import {test, afterEach} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';

// Load actual route source without running a dev server or sending live provider requests.
const encode = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const transpile = source => ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const librarySource = (await readFile(new URL('../src/lib/ai-route.ts',import.meta.url),'utf8')).replace("'groq-sdk'",JSON.stringify(import.meta.resolve('groq-sdk')));
const library = encode(transpile(librarySource));
const routes = {};
for(const name of ['rewrite','analyze','questions','feedback']) {
  const source = (await readFile(new URL(`../src/app/api/${name}/route.ts`,import.meta.url),'utf8')).replace("'../../../lib/ai-route'",JSON.stringify(library));
  routes[name] = (await import(encode(transpile(source)))).POST;
}
const originalFetch = globalThis.fetch;
const originalKey = process.env.GROQ_API_KEY;
afterEach(()=>{globalThis.fetch=originalFetch;if(originalKey===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=originalKey;});
const request = body => new Request('http://localhost/api',{method:'POST',body:typeof body==='string'?body:JSON.stringify(body)});
const analysis = {role:'Designer',company:null,skills:['Figma'],values:['Clarity']};
const validBodies = {rewrite:{transcript:'I tested a prototype.'},analyze:{jobDescription:'Product designer'},questions:{analysis},feedback:{question:'What changed?',answer:'The labels.',analysis}};

for(const name of Object.keys(routes)) {
  test(`${name}: malformed JSON and wrong shapes return 400`,async()=>{
    for(const body of ['{','null',[],{}, {transcript:42,jobDescription:42,analysis:{role:'Designer',skills:'not an array',values:[]}}]){
      assert.equal((await routes[name](request(body))).status,400);
    }
  });
  test(`${name}: unset provider key returns 503 rather than crashing module import`,async()=>{
    delete process.env.GROQ_API_KEY;
    assert.equal((await routes[name](request(validBodies[name]))).status,503);
  });
}
test('large streamed body is rejected without calling the model',async()=>{
  assert.equal((await routes.rewrite(request({transcript:'x'.repeat(65000)}))).status,400);
});
test('upstream failures return safe errors without provider details',async()=>{
  process.env.GROQ_API_KEY='test-only';
  globalThis.fetch=async()=>Response.json({error:{message:'sensitive provider detail'}},{status:401});
  const res=await routes.rewrite(request(validBodies.rewrite));
  assert.equal(res.status,502);
  assert.doesNotMatch(await res.text(),/sensitive provider detail|test-only/);
});
test('rewrite returns text only after a valid model completion',async()=>{
  process.env.GROQ_API_KEY='test-only';
  globalThis.fetch=async()=>Response.json({choices:[{message:{content:'A clearer reflection.'}}]});
  const res=await routes.rewrite(request(validBodies.rewrite));
  assert.equal(res.status,200);
  assert.deepEqual(await res.json(),{text:'A clearer reflection.'});
});
test('invalid JSON model output becomes a recoverable 502',async()=>{
  process.env.GROQ_API_KEY='test-only';
  globalThis.fetch=async()=>Response.json({choices:[{message:{content:'not json'}}]});
  assert.equal((await routes.analyze(request(validBodies.analyze))).status,502);
});
test('valid JSON with the wrong feedback schema is rejected',async()=>{
  process.env.GROQ_API_KEY='test-only';
  globalThis.fetch=async()=>Response.json({choices:[{message:{content:JSON.stringify({score:900,strengths:'wrong'})}}]});
  assert.equal((await routes.feedback(request(validBodies.feedback))).status,502);
});
