// Reports bindables from src/controlBindings.ts that no dev-app demo binds (heuristic: e-<hyphenated> / e-on-<hyphenated> on the control tag).
//   node tools/check-coverage.js   exits 1 when something is unbound
const fs=require('fs'),path=require('path');
const root=__dirname+'/..';
const src=fs.readFileSync('src/controlBindings.ts','utf8');
const ts=require('typescript');
const m={exports:{}};new Function('module','exports',ts.transpileModule(src,{compilerOptions:{module:1}}).outputText)(m,m.exports);
const B=m.exports.ControlBindings;
const kebab=s=>s.replace(/([A-Z])/g,'-$1').toLowerCase(); // Aurelia hyphenates every capital
function walk(d,o=[]){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);e.isDirectory()?walk(p,o):o.push(p)}return o}
const html=walk('dev-app').filter(f=>f.endsWith('.html')).map(f=>fs.readFileSync(f,'utf8')).join('\n').toLowerCase();
let tot=0,miss=0;const res={};
for(const [name,b] of Object.entries(B)){ if(name==='common')continue;
 const tag=kebab(name).replace(/(\d)-d$/,'$1d').replace(/(\d)-d-/,'$1d-');
 // collect element texts for tag
 const re=new RegExp('<ej2-'+tag+'[\\s>][\\s\\S]*?>','g');
 const els=(html.match(re)||[]).join(' ');
 const props=[...(b.oneWay||[]),...(b.twoWay||[]),...(b.fromView||[])];
 const ev=b.events||[];
 const mp=props.filter(p=>!els.includes('e-'+kebab(p)+'.')&&!els.includes('e-'+kebab(p)+'='));
 const me=ev.filter(p=>!els.includes('e-on-'+kebab(p)+'.')&&!els.includes('e-on-'+p.toLowerCase()+'.')&&!els.includes('e-on-'+kebab(p)+'='));
 res[name]={props:props.length,missP:mp,events:ev.length,missE:me};
 tot+=props.length+ev.length;miss+=mp.length+me.length;
}
for(const [n,r] of Object.entries(res))console.log(n,`props ${r.props-r.missP.length}/${r.props} events ${r.events-r.missE.length}/${r.events}`);
console.log('total',tot,'uncovered',miss);
fs.writeFileSync(process.argv[2]||'/dev/null',JSON.stringify(res,null,1));
process.exit(miss ? 1 : 0);
