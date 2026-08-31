"use strict";(()=>{function b(e){if(e.length===0)return NaN;let t=[...e].sort((r,i)=>r-i),n=t.length>>1;return t.length%2===0?(t[n-1]+t[n])/2:t[n]}function K(e){var i,s;let t=[];for(let o=0;o<e.length;o++)for(let c=o+1;c<e.length;c++){let a=e[c].x-e[o].x;a!==0&&t.push((e[c].y-e[o].y)/a)}if(t.length===0)return{slope:0,intercept:(s=(i=e[0])==null?void 0:i.y)!=null?s:0};let n=b(t),r=b(e.map(o=>o.y-n*o.x));return{slope:n,intercept:r}}var J=8,X=3,Q=14,Z=1.5,ne=10080*60*1e3,ee=1440*60*1e3;function G(e){let t=new Date(e);t.setHours(0,0,0,0);let n=(t.getDay()+6)%7;return t.setDate(t.getDate()-n),t.getTime()}function be(e,t){return!isFinite(t)||t===0?0:e/t*100}function re(e,t){let n=-be(e,t);return n===0?0:n}function ye(e){if(e.length===0)return[];let t=[...e].sort((o,c)=>o.at-c.at),n=G(t[0].at),r=new Map;for(let o of t){let c=G(o.at),a=r.get(c);a?a.push(o):r.set(c,[o])}let i=b(t.map(o=>o.distanceM))||1,s=b(t.map(o=>o.recoverySec))||1;return[...r.entries()].sort((o,c)=>o[0]-c[0]).map(([o,c])=>{let a=b(c.map(h=>h.distanceM)),d=b(c.map(h=>h.recoverySec));return{weekStart:o,weekIndex:Math.round((o-n)/ne),count:c.length,medianDistanceM:a,medianRecoverySec:d,medianResponse:b(c.map(h=>h.response)),score:a/i+d/s}})}function z(e,t,n,r){var A,W;let i=e.map(w=>({x:w.weekIndex,y:r(w)})),s=i.length>=2?K(i):{slope:0,intercept:(W=(A=i[0])==null?void 0:A.y)!=null?W:0},o=s.slope,c=e[0].weekIndex,a=e[e.length-1].weekIndex,d=a-c,h=c+d/3,v=a-d/3,E=e[0].weekStart,$=w=>Math.round((G(w)-E)/ne),k=t.filter(w=>$(w.at)<=h).map(n),T=t.filter(w=>$(w.at)>=v).map(n);k.length===0&&(k=[r(e[0])]),T.length===0&&(T=[r(e[e.length-1])]);let M=b(k),S=b(T);return{thenValue:M,nowValue:S,improvementPctTotal:re(S-M,M),improvementPctPerWeek:we(s,c,a),slopePerWeek:o}}function we(e,t,n){let r=n-t;if(r<=0)return 0;let i=e.intercept+e.slope*t,s=e.intercept+e.slope*n;if(!isFinite(i)||i<=0)return 0;s<=0&&(s=i*.01);let o=1-Math.pow(s/i,1/r);return!isFinite(o)||o===0?0:o*100}var H={thenValue:0,nowValue:0,improvementPctTotal:0,improvementPctPerWeek:0,slopePerWeek:0};function te(e){let t=new Map;for(let n of e){let r=t.get(n.trigger);r?r.push(n):t.set(n.trigger,[n])}return[...t.entries()].map(([n,r])=>{let i=null;if(r.length>=6){let s=[...r].sort((d,h)=>d.at-h.at),o=Math.max(1,Math.floor(s.length/3)),c=b(s.slice(0,o).map(d=>d.distanceM)),a=b(s.slice(-o).map(d=>d.distanceM));i=re(a-c,c)}return{trigger:n,count:r.length,medianDistanceM:b(r.map(s=>s.distanceM)),medianRecoverySec:b(r.map(s=>s.recoverySec)),medianResponse:b(r.map(s=>s.response)),improvementPctTotal:i}}).sort((n,r)=>r.count-n.count)}function xe(e,t,n){let r="low";return e>=24&&t>=6?r="good":e>=12&&t>=4&&(r="moderate"),n&&(r=r==="good"?"moderate":"low"),r}function j(e,t={}){var V,f,D;let n=(V=t.now)!=null?V:Date.now(),r=t.windowDays?n-t.windowDays*ee:-1/0,i=e.filter(p=>p.at>=r).sort((p,O)=>p.at-O.at),s=ye(i),o=i.length,c=o?i[0].at:null,a=o?i[o-1].at:null,d=c!==null&&a!==null?(a-c)/ee:0;if(o<J||s.length<X||d<Q)return{verdict:"insufficient",confidence:"low",compositePctPerWeek:0,compositePctTotal:0,weeksElapsed:0,distance:H,recovery:H,response:H,weeks:s,byTrigger:te(i),bestWeek:null,worstWeek:null,total:o,spanDays:d,firstAt:c,lastAt:a,needed:{encounters:Math.max(0,J-o),weeks:Math.max(0,X-s.length),days:Math.max(0,Math.ceil(Q-d))}};let v=z(s,i,p=>p.distanceM,p=>p.medianDistanceM),E=z(s,i,p=>p.recoverySec,p=>p.medianRecoverySec),$=z(s,i,p=>p.response,p=>p.medianResponse),k=.5*v.improvementPctPerWeek+.5*E.improvementPctPerWeek,T=.5*v.improvementPctTotal+.5*E.improvementPctTotal,M=s[s.length-1].weekIndex-s[0].weekIndex,S="flat";k>=Z?S="improving":k<=-Z&&(S="worsening");let A=Math.sign(v.improvementPctPerWeek)!==Math.sign(E.improvementPctPerWeek)&&Math.abs(v.improvementPctPerWeek)>3&&Math.abs(E.improvementPctPerWeek)>3,w=[...s.filter(p=>p.count>=2).length>=2?s.filter(p=>p.count>=2):s].sort((p,O)=>p.score-O.score);return{verdict:S,confidence:xe(o,s.length,A),compositePctPerWeek:k,compositePctTotal:T,weeksElapsed:M,distance:v,recovery:E,response:$,weeks:s,byTrigger:te(i),bestWeek:(f=w[0])!=null?f:null,worstWeek:(D=w[w.length-1])!=null?D:null,total:o,spanDays:d,firstAt:c,lastAt:a,needed:null}}var oe=["dog","person","child","bike","vehicle","noise","alone","other"],R={dog:"Dog",person:"Person",child:"Child",bike:"Bike / scooter",vehicle:"Vehicle",noise:"Noise",alone:"Left alone",other:"Other"},se=[{level:0,label:"No reaction",hint:"Noticed it, stayed relaxed"},{level:1,label:"Alert",hint:"Looked, then disengaged on their own"},{level:2,label:"Tense",hint:"Stiff, staring, still able to respond to me"},{level:3,label:"Vocal",hint:"Barking or whining, could be redirected"},{level:4,label:"Lunging",hint:"Pulling toward or away, hard to redirect"},{level:5,label:"Over threshold",hint:"No response to me at all"}];var ie=3.280839895;function B(e,t){return t==="imperial"?e*ie:e}function $e(e,t){return t==="imperial"?e/ie:e}function I(e){return e==="imperial"?"ft":"m"}function x(e,t){let n=B(e,t);return`${n>=20?Math.round(n):Math.round(n*10)/10} ${I(t)}`}function y(e){let t=Math.max(0,Math.round(e));if(t<90)return`${t} s`;let n=Math.floor(t/60),r=t%60;return r===0?`${n} min`:`${n} min ${r} s`}function ae(e){return(e==="imperial"?[3,10,20,35,50,75,100,150]:[1,3,5,10,15,25,40,60]).map(n=>({metres:$e(n,e),label:`${n}`}))}var ce=[0,5,15,30,60,120,300,600];var ke="Threshold reports only what the owner recorded. It is not a diagnostic tool. It does not diagnose any condition, recommend any treatment or medication, and is not a substitute for advice from a qualified trainer, behaviourist or veterinarian.",U={improving:"Improving",flat:"Holding steady",worsening:"Going backwards",insufficient:"Not enough data yet"},de=6;function P(e){return`${Math.abs(Math.round(e))}%`}function le(e,t){try{return new Intl.DateTimeFormat(t,{day:"numeric",month:"long",year:"numeric"}).format(new Date(e))}catch{return new Date(e).toISOString().slice(0,10)}}function _(e,t){try{return new Intl.DateTimeFormat(t,{day:"numeric",month:"short"}).format(new Date(e))}catch{return new Date(e).toISOString().slice(0,10)}}function Y(e,t){let n=t.trim()||"Your dog";switch(e.verdict){case"improving":return`${n} is improving`;case"worsening":return`${n} is going backwards`;case"flat":return`${n} is holding steady`;default:return"Not enough data yet"}}function q(e){if(e.verdict==="insufficient"){let n=e.needed;if(!n)return"Log a few encounters to get started.";let r=[];return n.encounters>0&&r.push(`${n.encounters} more encounter${n.encounters===1?"":"s"}`),n.days>0&&r.push(`${n.days} more day${n.days===1?"":"s"}`),r.length?`${r.join(" and ")} before a verdict.`:"Keep logging for a few more days."}if(e.verdict==="flat")return"No clear movement either way";let t=e.verdict==="improving"?"better":"worse";return e.weeksElapsed<de?`About ${P(e.compositePctTotal)} ${t} over ${e.weeks.length} weeks`:`About ${P(e.compositePctPerWeek)} ${t} each week`}function Te(e,t,n,r){let i=t.trim()||"This dog",s=[];if(e.verdict==="insufficient")return s.push(`${i} has ${e.total} encounter${e.total===1?"":"s"} logged so far. Threshold needs at least 8 encounters spread over 3 weeks before it will call a trend, because behaviour change is slow and non-linear and a short run of records can point the wrong way.`),s;let o=e.weeks.length,c=e.firstAt?_(e.firstAt,r):"",a=e.lastAt?_(e.lastAt,r):"",d=e.verdict==="improving"?`over the ${o} weeks from ${c} to ${a}, the records show steady improvement`:e.verdict==="worsening"?`over the ${o} weeks from ${c} to ${a}, the records have moved the wrong way`:`over the ${o} weeks from ${c} to ${a}, the records show no clear change in either direction`,h=e.weeksElapsed<de?`an overall change of about ${P(e.compositePctTotal)} across the period`:`an overall rate of about ${P(e.compositePctPerWeek)} per week`;s.push(`${i}: ${d}. ${e.total} encounters were logged, at ${h}.`);let v=e.distance,E=v.improvementPctTotal>=0?"closer":"further away";s.push(`Reaction distance: ${i} now reacts at about ${x(v.nowValue,n)}, compared with ${x(v.thenValue,n)} in the first third of the period. That is ${P(v.improvementPctTotal)} ${E}. A smaller distance means the trigger can be nearer before ${i} reacts.`);let $=e.recovery,k=$.improvementPctTotal>=0?"faster":"slower";s.push(`Recovery time: settling now takes about ${y($.nowValue)}, compared with ${y($.thenValue)} earlier in the period - ${P($.improvementPctTotal)} ${k}.`);let T=e.byTrigger[0];if(T){let M=e.byTrigger.slice(1,3).map(S=>`${R[S.trigger].toLowerCase()} (${S.count})`);s.push(`Most encounters involved ${R[T.trigger].toLowerCase()} (${T.count} of ${e.total})`+(M.length?`, then ${M.join(", ")}.`:"."))}return e.bestWeek&&e.worstWeek&&e.bestWeek.weekStart!==e.worstWeek.weekStart&&s.push(`Best week began ${_(e.bestWeek.weekStart,r)} (median ${x(e.bestWeek.medianDistanceM,n)}, ${y(e.bestWeek.medianRecoverySec)} to settle, ${e.bestWeek.count} encounters). Hardest week began ${_(e.worstWeek.weekStart,r)} (median ${x(e.worstWeek.medianDistanceM,n)}, ${y(e.worstWeek.medianRecoverySec)} to settle, ${e.worstWeek.count} encounters).`),e.confidence==="low"?s.push("Confidence is low: there is not yet enough spread in the records for this trend to be relied on. More encounters logged over more weeks will sharpen it."):e.confidence==="moderate"&&s.push("Confidence is moderate. The direction is reasonably clear, but a few more weeks of records would firm it up."),e.verdict==="worsening"&&s.push(`This report is worth showing to the trainer, behaviourist or vet working with ${i}.`),s}function ue(e,t,n={}){var o;let r=(o=n.generatedAt)!=null?o:Date.now(),i=e.settings.locale,s=t.firstAt&&t.lastAt?`${le(t.firstAt,i)} to ${le(t.lastAt,i)}`:"No encounters recorded";return{dogName:e.dog.name,generatedAt:r,periodStart:t.firstAt,periodEnd:t.lastAt,periodLabel:s,units:e.settings.units,locale:i,trend:t,headline:Y(t,e.dog.name),subhead:q(t),summary:Te(t,e.dog.name,e.settings.units,i),disclaimer:ke}}var Se={improving:"#1B7A57",flat:"#9A7419",worsening:"#A93B2B",insufficient:"#6B7A72"};function g(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function me(e){return e.map((t,n)=>`${n===0?"M":"L"}${t.x.toFixed(1)},${t.y.toFixed(1)}`).join(" ")}function Ee(e,t,n=620,r=190){if(e.length<2)return'<div class="empty">Not enough weeks logged to draw a trend line yet.</div>';let i=40,s=44,o=12,c=26,a=n-i-s,d=r-o-c,h=e[0].weekIndex,v=e[e.length-1].weekIndex,E=Math.max(1,v-h),$=e.map(f=>B(f.medianDistanceM,t)),k=e.map(f=>f.medianRecoverySec),T=Math.max(...$)*1.15||1,M=Math.max(...k)*1.15||1,S=f=>i+(e[f].weekIndex-h)/E*a,A=e.map((f,D)=>({x:S(D),y:o+d-$[D]/T*d})),W=e.map((f,D)=>({x:S(D),y:o+d-k[D]/M*d})),w=[.25,.5,.75].map(f=>`<line x1="${i}" x2="${n-s}" y1="${o+d*f}" y2="${o+d*f}" stroke="#E3DFD7" stroke-width="1" />`).join(""),V=A.map(f=>`<circle cx="${f.x.toFixed(1)}" cy="${f.y.toFixed(1)}" r="2.6" fill="#2E5D50" />`).join("");return`<svg viewBox="0 0 ${n} ${r}" width="100%" height="${r}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Weekly median reaction distance and recovery time">
  ${w}
  <line x1="${i}" x2="${n-s}" y1="${o+d}" y2="${o+d}" stroke="#9AA69F" stroke-width="1" />
  <path d="${me(W)}" stroke="#B4762B" stroke-width="2" fill="none" />
  <path d="${me(A)}" stroke="#2E5D50" stroke-width="2.5" fill="none" />
  ${V}
  <text x="4" y="${o+8}" font-size="10" fill="#2E5D50">${Math.round(T)}${I(t)}</text>
  <text x="4" y="${o+d}" font-size="10" fill="#9AA69F">0</text>
  <text x="${n-s+5}" y="${o+8}" font-size="10" fill="#B4762B">${Math.round(M)}s</text>
  <text x="${i}" y="${r-6}" font-size="10" fill="#9AA69F">week 1</text>
  <text x="${n-s}" y="${r-6}" font-size="10" fill="#9AA69F" text-anchor="end">week ${v-h+1}</text>
</svg>`}function Me(e){return`<table>
    <thead>
      <tr><th>Trigger</th><th class="num">Encounters</th><th class="num">Median distance</th><th class="num">Median recovery</th><th class="num">Change</th></tr>
    </thead>
    <tbody>${e.trend.byTrigger.map(n=>{let r=n.improvementPctTotal===null?'<span class="muted">not enough data</span>':`${Math.abs(Math.round(n.improvementPctTotal))}% ${n.improvementPctTotal>=0?"closer":"further"}`;return`<tr>
        <td>${g(R[n.trigger])}</td>
        <td class="num">${n.count}</td>
        <td class="num">${g(x(n.medianDistanceM,e.units))}</td>
        <td class="num">${g(y(n.medianRecoverySec))}</td>
        <td class="num">${r}</td>
      </tr>`}).join("")}</tbody>
  </table>`}function pe(e,t,n){if(!t)return"";let r=new Date(t.weekStart),i;try{i=new Intl.DateTimeFormat(n.locale,{day:"numeric",month:"short"}).format(r)}catch{i=r.toISOString().slice(0,10)}return`<div class="weekcard">
    <div class="weekcard-title">${g(e)}</div>
    <div class="weekcard-date">week beginning ${g(i)}</div>
    <div class="weekcard-stats">${g(x(t.medianDistanceM,n.units))} \xB7 ${g(y(t.medianRecoverySec))} to settle \xB7 ${t.count} encounters</div>
  </div>`}function ge(e){var o;let t=(o=Se[e.trend.verdict])!=null?o:"#6B7A72",n=new Date(e.generatedAt).toISOString().slice(0,10),r=e.dogName.trim()||"Unnamed dog",i=e.summary.map(c=>`<p>${g(c)}</p>`).join(""),s=e.trend.verdict==="insufficient"?"":`<div class="stats">
          <div class="stat">
            <div class="stat-label">Reacts at</div>
            <div class="stat-value">${g(x(e.trend.distance.nowValue,e.units))}</div>
            <div class="stat-was">was ${g(x(e.trend.distance.thenValue,e.units))}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Settles in</div>
            <div class="stat-value">${g(y(e.trend.recovery.nowValue))}</div>
            <div class="stat-was">was ${g(y(e.trend.recovery.thenValue))}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Encounters</div>
            <div class="stat-value">${e.trend.total}</div>
            <div class="stat-was">over ${e.trend.weeks.length} weeks</div>
          </div>
          <div class="stat">
            <div class="stat-label">Confidence</div>
            <div class="stat-value cap">${g(e.trend.confidence)}</div>
            <div class="stat-was">from the records logged</div>
          </div>
        </div>`;return`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Threshold report - ${g(r)}</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #17211B; margin: 0; font-size: 11pt; line-height: 1.45; background: #fff;
  }
  header { display: flex; justify-content: space-between; align-items: flex-start;
           border-bottom: 2px solid #17211B; padding-bottom: 8px; margin-bottom: 14px; }
  h1 { font-size: 20pt; margin: 0; letter-spacing: -0.4px; }
  .period { color: #6B7A72; font-size: 10pt; margin-top: 2px; }
  .brand { text-align: right; font-size: 9pt; color: #6B7A72; }
  .verdict { display: inline-block; padding: 4px 12px; border-radius: 999px;
             font-weight: 700; font-size: 10pt; color: #fff; background: ${t}; }
  .verdict-line { font-size: 15pt; font-weight: 700; color: ${t}; margin: 10px 0 2px; }
  .stats { display: flex; gap: 10px; margin: 12px 0 14px; }
  .stat { flex: 1; border: 1px solid #E3DFD7; border-radius: 8px; padding: 8px 10px; }
  .stat-label { font-size: 8pt; text-transform: uppercase; letter-spacing: 0.6px; color: #9AA69F; }
  .stat-value { font-size: 15pt; font-weight: 700; margin-top: 2px; }
  .stat-value.cap { text-transform: capitalize; }
  .stat-was { font-size: 8.5pt; color: #6B7A72; }
  h2 { font-size: 10pt; text-transform: uppercase; letter-spacing: 0.8px;
       color: #9AA69F; margin: 14px 0 6px; }
  p { margin: 0 0 7px; }
  table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
  th { text-align: left; color: #6B7A72; font-weight: 600; border-bottom: 1px solid #E3DFD7; padding: 4px 6px; }
  td { padding: 4px 6px; border-bottom: 1px solid #F1EFEA; }
  .num { text-align: right; }
  .muted { color: #9AA69F; }
  .weeks { display: flex; gap: 10px; margin-top: 6px; }
  .weekcard { flex: 1; background: #F7F6F3; border-radius: 8px; padding: 8px 10px; }
  .weekcard-title { font-weight: 700; font-size: 10pt; }
  .weekcard-date { font-size: 8.5pt; color: #6B7A72; }
  .weekcard-stats { font-size: 9pt; margin-top: 3px; }
  .legend { font-size: 8.5pt; color: #6B7A72; margin-top: 2px; }
  .swatch { display: inline-block; width: 12px; height: 3px; vertical-align: middle; margin-right: 4px; }
  .empty { color: #9AA69F; font-size: 10pt; padding: 20px 0; }
  footer { margin-top: 16px; border-top: 1px solid #E3DFD7; padding-top: 8px;
           font-size: 8.5pt; color: #6B7A72; }
</style>
</head>
<body>
<header>
  <div>
    <h1>${g(r)}</h1>
    <div class="period">${g(e.periodLabel)}</div>
  </div>
  <div class="brand">
    <div><strong>Threshold</strong></div>
    <div>behaviour progress report</div>
    <div>generated ${g(n)}</div>
  </div>
</header>

<span class="verdict">${g(U[e.trend.verdict])}</span>
<div class="verdict-line">${g(e.headline)} \u2014 ${g(e.subhead.toLowerCase())}</div>

${s}

<h2>Weekly trend</h2>
${Ee(e.trend.weeks,e.units)}
<div class="legend">
  <span class="swatch" style="background:#2E5D50"></span>reaction distance
  <span class="swatch" style="background:#B4762B; margin-left:14px"></span>recovery time
  &nbsp;\u2014 both lines falling means progress.
</div>

<h2>Summary</h2>
${i}

<h2>By trigger</h2>
${Me(e)}

<h2>Best and hardest week</h2>
<div class="weeks">
  ${pe("Best week",e.trend.bestWeek,e)}
  ${pe("Hardest week",e.trend.worstWeek,e)}
</div>

<footer>
  ${g(e.disclaimer)}<br />
  Produced on the owner's device from their own records. Threshold has no server and collects no data.
</footer>
</body>
</html>`}var De="gapfound.apps@gmail.com",fe="threshold.validate.v1",he,u=(he=Re())!=null?he:{dogName:"",units:"metric",encounters:[]};function Re(){try{let e=localStorage.getItem(fe);return e?JSON.parse(e):null}catch{return null}}function N(){try{localStorage.setItem(fe,JSON.stringify(u))}catch{}}function l(e){let t=document.getElementById(e);if(!t)throw new Error(`Missing #${e}`);return t}var m={trigger:null,distanceM:null,response:null,recoverySec:null,daysAgo:0};function C(e,t,n,r){let i=document.createElement("button");return i.type="button",i.className=`chip${t?" chip--on":""}`,i.innerHTML=r?`<span>${e}</span><small>${r}</small>`:e,i.addEventListener("click",n),i}function L(){let e=u.units;l("f-trigger").replaceChildren(...oe.map(a=>C(R[a],m.trigger===a,()=>{m.trigger=a,L()}))),l("f-distance-unit").textContent=`(${I(e)})`,l("f-distance").replaceChildren(...ae(e).map(a=>C(a.label,m.distanceM===a.metres,()=>{m.distanceM=a.metres,L()}))),l("f-response").replaceChildren(...se.map(a=>C(String(a.level),m.response===a.level,()=>{m.response=a.level,L()},a.label))),l("f-recovery").replaceChildren(...ce.map(a=>C(a===0?"None":y(a),m.recoverySec===a,()=>{m.recoverySec=a,L()})));let s=l("f-days"),o=[0,1,2,3,5,7,10,14,17,21];s.replaceChildren(...o.map(a=>C(a===0?"Today":`${a}d ago`,m.daysAgo===a,()=>{m.daysAgo=a,L()})));let c=m.trigger!==null&&m.distanceM!==null&&m.response!==null&&m.recoverySec!==null;l("f-add").disabled=!c}function Ae(){m.trigger===null||m.distanceM===null||m.response===null||m.recoverySec===null||(u.encounters.push({id:`v${Date.now()}${Math.random().toString(36).slice(2,7)}`,at:Date.now()-m.daysAgo*24*60*60*1e3,trigger:m.trigger,distanceM:m.distanceM,response:m.response,recoverySec:m.recoverySec}),m={trigger:null,distanceM:null,response:null,recoverySec:null,daysAgo:m.daysAgo},N(),F())}function Pe(){return{schemaVersion:1,dog:{name:u.dogName},settings:{units:u.units,locale:navigator.language||"en-AU",backupWarningAcknowledged:!0},encounters:u.encounters}}function ve(){let e=j(u.encounters),t=u.dogName.trim();l("v-badge").textContent=U[e.verdict],l("v-badge").className=`badge badge--${e.verdict}`,l("v-headline").textContent=Y(e,t),l("v-headline").className=`headline headline--${e.verdict}`,l("v-sub").textContent=q(e);let n=l("v-metrics");e.verdict==="insufficient"?n.innerHTML='<p class="muted">Enter at least 8 encounters spread over 3 weeks and the verdict appears here. Behaviour change is slow and non-linear, so a shorter run of records can point the wrong way.</p>':n.innerHTML=`
      <div class="stat"><div class="stat-label">Reacts at</div>
        <div class="stat-value">${x(e.distance.nowValue,u.units)}</div>
        <div class="stat-was">was ${x(e.distance.thenValue,u.units)}</div></div>
      <div class="stat"><div class="stat-label">Settles in</div>
        <div class="stat-value">${y(e.recovery.nowValue)}</div>
        <div class="stat-was">was ${y(e.recovery.thenValue)}</div></div>
      <div class="stat"><div class="stat-label">Encounters</div>
        <div class="stat-value">${e.total}</div>
        <div class="stat-was">over ${e.weeks.length} weeks</div></div>`,l("email-send").disabled=e.verdict==="insufficient",l("preview").disabled=e.verdict==="insufficient"}function Le(){let e=l("v-list");if(u.encounters.length===0){e.innerHTML='<p class="muted">Nothing entered yet.</p>';return}let t=[...u.encounters].sort((n,r)=>r.at-n.at).map((n,r)=>`<li><span>${new Date(n.at).toLocaleDateString(navigator.language||"en-AU",{day:"numeric",month:"short"})} \xB7 ${R[n.trigger]} \xB7 ${x(n.distanceM,u.units)} \xB7 level ${n.response} \xB7 ${y(n.recoverySec)}</span>
      <button type="button" data-remove="${r}" aria-label="Remove">\xD7</button></li>`).join("");e.innerHTML=`<ol class="entries">${t}</ol>`,e.querySelectorAll("button[data-remove]").forEach(n=>{n.addEventListener("click",()=>{let i=[...u.encounters].sort((s,o)=>o.at-s.at)[Number(n.dataset.remove)];u.encounters=u.encounters.filter(s=>s.id!==i.id),N(),F()})}),l("v-count").textContent=`${u.encounters.length}`}function We(){let e=u.encounters.map(t=>`${new Date(t.at).toISOString().slice(0,10)},${t.trigger},${B(t.distanceM,u.units).toFixed(1)},${t.response},${t.recoverySec}`).join(`
`);return`dog=${u.dogName||"(unnamed)"}
units=${u.units}
date,trigger,distance,response,recovery_seconds
${e}`}function Be(){let e=l("email-address").value.trim();if(!e){l("email-note").textContent="Enter the address the report should go to.";return}let t=[`Please send my Threshold report to: ${e}`,"",We(),"","(Sent from the Threshold validation page. This data was entered by me and lives only in this email.)"].join(`
`),n=`mailto:${De}?subject=${encodeURIComponent(`Threshold report request - ${u.dogName||"my dog"}`)}&body=${encodeURIComponent(t)}`;window.location.href=n,l("email-note").textContent="Your mail app should have opened with the request ready to send. We reply with the one-page report."}function Ie(){let e=Pe(),t=ge(ue(e,j(e.encounters))),n=window.open("","_blank");if(!n){l("email-note").textContent="Your browser blocked the preview window.";return}n.document.write(t),n.document.close()}function F(){L(),ve(),Le()}function Ce(){let e=l("dog-name");e.value=u.dogName,e.addEventListener("input",()=>{u.dogName=e.value,N(),ve()});for(let t of["metric","imperial"])l(`unit-${t}`).addEventListener("click",()=>{u.units=t,m.distanceM=null,N(),document.querySelectorAll(".unit-toggle button").forEach(n=>n.classList.remove("on")),l(`unit-${t}`).classList.add("on"),F()});l(`unit-${u.units}`).classList.add("on"),l("f-add").addEventListener("click",Ae),l("email-send").addEventListener("click",Be),l("preview").addEventListener("click",Ie),l("clear").addEventListener("click",()=>{confirm("Clear everything you have entered?")&&(u.encounters=[],N(),F())}),F()}document.addEventListener("DOMContentLoaded",Ce);})();
