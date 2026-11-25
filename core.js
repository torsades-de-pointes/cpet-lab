/* CPET Lab · shared engine and content
   Used by index.html (desktop) and mobile.html (phone).
   No dependencies, no network calls. MIT licence. */
(function (root) {
'use strict';

/* ───────────────────────── 1. Model ───────────────────────── */

const BASE = {wt:80,age:55,sex:'M',predVO2:2400,peak:2450,slope:10,bend:0.7,kLate:1,vt1:0.55,rcp:0.84,s2:1.35,rcpGain:14,
  hrRest:72,hrPeak:162,hrPred:165,hrShape:1,hrWork:false,hrr1:24,veVco2:26,veInt:3,mvv:140,veCapFrac:0,rrRest:14,rrPeak:38,vtMax:2.6,
  petR:37,petRise:5,petDrop:5,eov:0,spo2R:98,spo2P:97,tau:0.6,tauR:1.0,unlAdd:0};

const SCENARIOS = {
 normal:{label:'Normal',group:'Reference',desc:'Healthy 55-year-old man, 80 kg. Learn this one first; every other pattern is a departure from it.',p:{}},
 decon:{label:'Deconditioning',group:'Reference',desc:'44-year-old man, 95 kg, sedentary. Breathless on stairs. Echo and spirometry normal.',
  p:{wt:95,age:44,predVO2:2650,peak:1950,slope:10,vt1:0.47,rcp:0.85,hrRest:86,hrPeak:172,hrPred:176,hrr1:22,veVco2:27,mvv:155,vtMax:2.5}},
 poor:{label:'Submaximal effort',group:'Reference',desc:'50-year-old man, 82 kg. Stopped at 6 minutes, saying he was tired. Borg 12.',
  p:{wt:82,age:50,predVO2:2550,peak:1500,slope:10,vt1:0.88,rcp:0,s2:1.15,hrRest:80,hrPeak:126,hrPred:170,hrr1:20,veVco2:27,mvv:150}},
 obese:{label:'Obesity, normal heart',group:'Reference',desc:'40-year-old man, 128 kg, BMI 41. The report says "reduced" peak VO₂ per kilogram.',
  p:{wt:128,age:40,predVO2:2900,peak:2650,slope:10.2,vt1:0.5,rcp:0.85,hrRest:84,hrPeak:174,hrPred:178,hrr1:20,veVco2:27,veInt:3.5,mvv:150,rrRest:18,rrPeak:44,vtMax:2.0,petR:38,unlAdd:120}},
 hfref:{label:'HFrEF, advanced',group:'Heart',desc:'52-year-old man, ischaemic cardiomyopathy, LVEF 18%, on full GDMT including a beta-blocker. Referred for advanced therapy evaluation.',
  p:{age:52,predVO2:2450,peak:900,slope:7.5,bend:0.55,kLate:0.6,vt1:0.74,rcp:0.94,s2:2.1,hrRest:76,hrPeak:118,hrPred:168,hrShape:1.3,hrWork:true,hrr1:9,veVco2:42,veInt:4,mvv:130,rrRest:18,rrPeak:44,vtMax:1.5,petR:30,petRise:1,petDrop:2,eov:3.2,spo2R:97,spo2P:96,tau:1.2,tauR:1.8}},
 hfpef:{label:'HFpEF',group:'Heart',desc:'68-year-old woman, 100 kg, hypertension, paroxysmal AF. Exertional dyspnoea, inconclusive resting echo.',
  p:{wt:100,age:68,sex:'F',predVO2:1750,peak:1300,slope:8.5,bend:0.6,kLate:0.75,vt1:0.66,rcp:0.92,s2:1.75,hrRest:70,hrPeak:116,hrPred:152,hrShape:1.15,hrr1:12,veVco2:34,veInt:3.5,mvv:95,rrRest:16,rrPeak:40,vtMax:1.6,petR:34,petRise:2,petDrop:2,spo2R:97,spo2P:96,tau:0.9,tauR:1.4}},
 ischemia:{label:'Exercise-induced ischaemia',group:'Heart',desc:'61-year-old man with atypical exertional discomfort. Watch the last third of the ramp.',
  p:{age:61,predVO2:2300,peak:1650,slope:10,bend:0.62,kLate:0.25,vt1:0.6,rcp:0.92,s2:1.5,hrRest:70,hrPeak:150,hrPred:159,hrShape:1.0,hrWork:true,hrr1:18,veVco2:29}},
 chrono:{label:'Chronotropic incompetence',group:'Heart',desc:'70-year-old man with fatigue, on no rate-slowing drugs. Peak RER 1.10.',
  p:{age:70,predVO2:2050,peak:1550,slope:10,vt1:0.56,hrRest:64,hrPeak:108,hrPred:150,hrr1:14,veVco2:29}},
 fontan:{label:'Adult Fontan',group:'Heart',desc:'28-year-old man, extracardiac Fontan with fenestration. Works full time and reports no symptoms.',
  p:{wt:65,age:28,predVO2:2700,peak:1450,slope:8.5,bend:0.6,kLate:0.75,vt1:0.58,rcp:0.9,hrRest:82,hrPeak:148,hrPred:192,hrShape:1.2,hrWork:true,hrr1:16,veVco2:37,mvv:120,petR:32,petRise:1,spo2R:94,spo2P:87}},
 pah:{label:'Pulmonary arterial hypertension',group:'Pulmonary vessels',desc:'45-year-old woman, progressive dyspnoea and one syncopal episode. Dilated RV on echo.',
  p:{wt:70,age:45,sex:'F',predVO2:1750,peak:950,slope:7.5,bend:0.5,kLate:0.6,vt1:0.7,rcp:0,s2:1.9,hrRest:88,hrPeak:156,hrPred:175,hrShape:1.35,hrWork:true,hrr1:14,veVco2:50,veInt:4,mvv:100,rrRest:20,rrPeak:46,vtMax:1.3,petR:28,petRise:-3,petDrop:3,spo2R:96,spo2P:86,tau:1.1,tauR:1.5}},
 copd:{label:'COPD',group:'Lungs',desc:'65-year-old man, 75 kg, 45 pack-years, FEV₁ 1.1 L. Is the breathlessness from the lungs or the heart?',
  p:{wt:75,age:65,predVO2:2050,peak:1200,slope:9.5,vt1:0.72,rcp:0,hrRest:86,hrPeak:126,hrPred:155,hrr1:15,veVco2:34,veInt:4,mvv:42,veCapFrac:0.96,rrRest:18,rrPeak:32,vtMax:1.15,petR:38,petRise:6,petDrop:-2,spo2R:95,spo2P:90}},
 ild:{label:'Interstitial lung disease',group:'Lungs',desc:'62-year-old woman, dry cough, basal crackles, DLCO 42% predicted.',
  p:{wt:70,age:62,sex:'F',predVO2:1700,peak:1050,slope:9,vt1:0.65,rcp:0,s2:1.55,hrRest:90,hrPeak:138,hrPred:158,hrr1:16,veVco2:41,veInt:4,mvv:68,rrRest:22,rrPeak:56,vtMax:0.85,petR:33,petRise:0,petDrop:2,spo2R:95,spo2P:83}},
 mito:{label:'Mitochondrial myopathy',group:'Muscle',desc:'34-year-old woman, 62 kg, lifelong exercise intolerance, myalgia, mild ptosis. Normal echo.',
  p:{wt:62,age:34,sex:'F',predVO2:2050,peak:1050,slope:7,vt1:0.38,rcp:0.8,s2:1.65,rcpGain:18,hrRest:92,hrPeak:178,hrPred:186,hrShape:0.8,hrr1:20,veVco2:33,veInt:3.5,mvv:110,rrRest:16,rrPeak:44,vtMax:1.7,petR:35,petRise:1,petDrop:4}}
};

function makeParams(key){return Object.assign({},BASE,SCENARIOS[key].p);}
/* A healthy version of the same person: same size, age and predicted values. */
function healthyTwin(P){return Object.assign({},BASE,{wt:P.wt,age:P.age,sex:P.sex,predVO2:P.predVO2,peak:P.predVO2,hrPred:P.hrPred,hrPeak:P.hrPred-3,
  mvv:Math.max(110,P.predVO2/18),unlAdd:P.unlAdd});}

function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const gauss=r=>(r()+r()+r()+r()-2)*0.87;
const sp=(x,w)=>w*Math.log1p(Math.exp(x/w));
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));

function simulate(P,seed){
 const r=rng(seed||42);
 const T=10, dt=1/6, tEnd=4+T+3;
 const VO2r=3.5*P.wt, VO2u=150+6*P.wt+P.unlAdd;
 const peak=Math.max(P.peak,VO2u+120);
 const pb=P.bend,k=P.kLate,a=1/(pb+k*(1-pb));
 const WRpk=(peak-VO2u)*a/P.slope;
 const VO2vt=Math.max(VO2u+60,P.vt1*peak);
 const VO2rcp=P.rcp>0?Math.max(VO2vt+80,P.rcp*peak):Infinity;
 const VCO2r=0.82*VO2r;
 const vco2f=v=>VCO2r+0.95*(v-VO2r)+(P.s2-0.95)*sp(v-VO2vt,45);
 const VCO2rcp=isFinite(VO2rcp)?vco2f(VO2rcp):Infinity;
 const vef=c=>P.veInt+P.veVco2*c/1000+(isFinite(VCO2rcp)?P.rcpGain*sp(c-VCO2rcp,40)/1000:0);
 const rows=[];let pk=null;
 for(let i=0;;i++){const t=+(i*dt).toFixed(4);if(t>tEnd+1e-9)break;
  let VO2,WR=0,phase;
  if(t<2){phase=0;VO2=VO2r;}
  else if(t<4){phase=1;VO2=VO2r+(VO2u-VO2r)*(1-Math.exp(-(t-2)/P.tau));}
  else if(t<=4+T+1e-9){phase=2;const p=(t-4)/T;const g=p<pb?a*p:a*pb+a*k*(p-pb);VO2=VO2u+(peak-VO2u)*g;WR=WRpk*p;
   const lag=1-Math.exp(-(t-4)/P.tau);VO2=VO2u+(VO2-VO2u)*(0.85+0.15*lag);}
  else phase=3;
  let VCO2,VE,HR,PET,SpO2,q;
  if(phase<3){
   VCO2=vco2f(VO2);VE=vef(VCO2);
   if(P.veCapFrac>0){const cap=P.mvv*P.veCapFrac;VE=cap-sp(cap-VE,1.6);}
   const f=clamp((VO2-VO2r)/(peak-VO2r),0,1);
   if(P.hrWork&&phase===2){const f0=(VO2u-VO2r)/(peak-VO2r);q=f0+(1-f0)*((t-4)/T);}else q=f;
   HR=P.hrRest+(P.hrPeak-P.hrRest)*Math.pow(clamp(q,0,1),P.hrShape);
   if(VO2<=VO2vt)PET=P.petR+P.petRise*clamp((VO2-VO2r)/(VO2vt-VO2r),0,1);else PET=P.petR+P.petRise;
   if(VO2>VO2rcp)PET-=P.petDrop*(VO2-VO2rcp)/(peak-VO2rcp);
   else if(!isFinite(VO2rcp)&&VO2>VO2vt)PET-=P.petDrop*(VO2-VO2vt)/(peak-VO2vt)*0.6;
   SpO2=P.spo2R+(P.spo2P-P.spo2R)*f;
   if(P.eov>0){const prog=phase<2?0:(t-4)/T;VE+=P.eov*Math.sin(2*Math.PI*t/1.15)*Math.max(0,1-1.15*prog)*(1+0.2*Math.sin(t));}
   pk={VO2,VCO2,VE,HR,PET,SpO2};
  }else{
   const d=t-(4+T);
   VO2=VO2r+(pk.VO2-VO2r)*Math.exp(-d/P.tauR);
   VCO2=VCO2r+(pk.VCO2-VCO2r)*Math.exp(-d/(P.tauR*1.4));
   const VEr=vef(VCO2r);VE=VEr+(pk.VE-VEr)*Math.exp(-d/(P.tauR*1.3));
   const tauH=-1/Math.log(Math.max(0.05,1-P.hrr1/Math.max(1,P.hrPeak-P.hrRest)));
   HR=P.hrRest+(pk.HR-P.hrRest)*Math.exp(-d/tauH);
   PET=P.petR+(pk.PET-P.petR)*Math.exp(-d/1.5);
   SpO2=P.spo2R+(pk.SpO2-P.spo2R)*Math.exp(-d/0.8);
  }
  const c=gauss(r)*0.022,e=gauss(r);
  rows.push({t,phase,WR,VO2:VO2*(1+c+gauss(r)*0.008),VCO2:VCO2*(1+c+gauss(r)*0.008),VE:Math.max(3,VE*(1+c*0.9+gauss(r)*0.012)),
   HR:HR+e*1.2,PET:PET+gauss(r)*0.5,SpO2:SpO2+gauss(r)*0.3,VO2true:VO2});
 }
 const VEr=rows[0].VE,VEp=Math.max(...rows.map(x=>x.VE));
 rows.forEach(x=>{const fv=clamp((x.VE-VEr)/(VEp-VEr),0,1);let RR=P.rrRest+(P.rrPeak-P.rrRest)*Math.pow(fv,1.3);let VT=x.VE/RR;
  if(VT>P.vtMax*0.98){VT=P.vtMax*0.98+(VT-P.vtMax*0.98)*0.05;RR=x.VE/VT;}
  x.RR=RR;x.VT=VT;x.RER=x.VCO2/x.VO2;x.O2p=x.VO2/x.HR;x.EqO2=x.VE*1000/x.VO2;x.EqCO2=x.VE*1000/x.VCO2;
  x.PETCO2=x.PET;x.PETO2=clamp(150-x.PET/Math.max(0.7,x.RER),85,135);});
 return {rows,T,VO2r,VO2u,peak,WRpk,VO2vt,VO2rcp:isFinite(VO2rcp)?VO2rcp:null,P,rampRate:WRpk/T};
}

function linreg(xs,ys){const n=xs.length;let sx=0,sy=0,sxx=0,sxy=0;for(let i=0;i<n;i++){sx+=xs[i];sy+=ys[i];sxx+=xs[i]*xs[i];sxy+=xs[i]*ys[i];}const b=(n*sxy-sx*sy)/(n*sxx-sx*sx);return{b,a:(sy-b*sx)/n};}

function metrics(S){
 const R=S.rows,P=S.P,ramp=R.filter(x=>x.phase===2),last=ramp.slice(-3);
 const avg=k=>last.reduce((s,x)=>s+x[k],0)/last.length;
 const pkVO2=avg('VO2'),pkRER=avg('RER'),pkHR=Math.max(...ramp.map(x=>x.HR)),pkVE=avg('VE');
 const toRcp=ramp.filter(x=>S.VO2rcp?x.VO2true<=S.VO2rcp:true);
 const slope=linreg(toRcp.map(x=>x.VCO2/1000),toRcp.map(x=>x.VE)).b;
 const nadir=Math.min(...R.filter(x=>x.phase>=1&&x.phase<3).map(x=>x.EqCO2));
 const wrR=ramp.filter(x=>x.t>=5);
 const dVO2=linreg(wrR.map(x=>x.WR),wrR.map(x=>x.VO2)).b;
 const eR=ramp.filter(x=>x.t>=4+0.1*S.T&&x.t<=4+0.5*S.T),lR=ramp.filter(x=>x.t>=4+0.75*S.T);
 const early=linreg(eR.map(x=>x.WR),eR.map(x=>x.VO2)).b,late=linreg(lR.map(x=>x.WR),lR.map(x=>x.VO2)).b;
 const ex=R.filter(x=>x.phase>=1&&x.phase<3);
 const oues=linreg(ex.map(x=>Math.log10(x.VE)),ex.map(x=>x.VO2)).b/1000;
 const rest=R.filter(x=>x.phase===0);
 const restPET=rest.reduce((s,x)=>s+x.PET,0)/rest.length;
 const maxPET=Math.max(...ex.map(x=>x.PET));
 const endT=4+S.T,rec1=R.find(x=>Math.abs(x.t-(endT+1))<0.01);
 const o2pPred=P.predVO2/P.hrPred;
 return{pkVO2,pkVO2kg:pkVO2/P.wt,pct:100*pkVO2/P.predVO2,pkRER,pkHR,hrRes:P.hrPred-pkHR,ci:(pkHR-P.hrRest)/(P.hrPred-P.hrRest),
  vt1:S.VO2vt,vt1kg:S.VO2vt/P.wt,vt1pct:100*S.VO2vt/P.predVO2,slope,nadir,restPET,dPET:maxPET-restPET,
  BR:100*(P.mvv-pkVE)/P.mvv,pkVE,o2p:pkVO2/pkHR,o2pPct:100*(pkVO2/pkHR)/o2pPred,dVO2,flatRatio:late/early,oues,
  hrr1:rec1?pkHR-rec1.HR:0,spo2min:Math.min(...ex.map(x=>x.SpO2)),spo2R:P.spo2R,eov:P.eov>0.4,WRpk:S.WRpk,mvv:P.mvv,rampRate:S.rampRate};
}
const weber=v=>v>20?'A':v>=16?'B':v>=10?'C':'D';
const vclass=s=>s<30?'I':s<36?'II':s<45?'III':'IV';

/* Key numbers shown under the plots: [label, value, detail, abnormal?] */
function metricRows(M){return[
 ['Peak VO₂',M.pkVO2kg.toFixed(1)+' mL/kg/min',(M.pkVO2/1000).toFixed(2)+' L/min · '+M.pct.toFixed(0)+'% pred · Weber '+weber(M.pkVO2kg),M.pct<85],
 ['Peak RER',M.pkRER.toFixed(2),M.pkRER>=1.1?'maximal effort':M.pkRER>=1.05?'meets ISHLT definition':'submaximal',M.pkRER<1.05],
 ['VT1',M.vt1kg.toFixed(1)+' mL/kg/min',M.vt1pct.toFixed(0)+'% of predicted peak',M.vt1pct<40],
 ['VE/VCO₂ slope',M.slope.toFixed(1),'class '+vclass(M.slope)+' · nadir '+M.nadir.toFixed(0),M.slope>=34],
 ['PETCO₂ rest',M.restPET.toFixed(0)+' mmHg','rise to max '+(M.dPET>=0?'+':'')+M.dPET.toFixed(1),M.restPET<33||M.dPET<3],
 ['ΔVO₂/ΔWR',M.dVO2.toFixed(1)+' mL/min/W','late/early '+M.flatRatio.toFixed(2),M.dVO2<8.4||M.flatRatio<0.6],
 ['O₂ pulse',M.o2p.toFixed(1)+' mL/beat',M.o2pPct.toFixed(0)+'% predicted',M.o2pPct<80],
 ['Peak HR',M.pkHR.toFixed(0)+' bpm','reserve '+M.hrRes.toFixed(0)+' · CI '+M.ci.toFixed(2),M.hrRes>15],
 ['Breathing reserve',M.BR.toFixed(0)+'%','VE '+M.pkVE.toFixed(0)+' of MVV '+M.mvv.toFixed(0),M.BR<15],
 ['SpO₂',M.spo2R.toFixed(0)+' → '+M.spo2min.toFixed(0)+'%','rest to lowest',M.spo2R-M.spo2min>=4],
 ['OUES',M.oues.toFixed(2),'L/min per log₁₀ L/min',false],
 ['HR recovery',M.hrr1.toFixed(0)+' bpm','first minute',M.hrr1<12],
 ['Oscillatory ventilation',M.eov?'Present':'Absent','',M.eov]
];}

/* Rule-based reading, shown only after the learner commits to their own. */
function interpret(M,P){
 const L=[];
 L.push('<b>Effort.</b> Peak RER '+M.pkRER.toFixed(2)+'. '+(M.pkRER>=1.1?'Maximal, so peak values can be trusted.':M.pkRER>=1.05?'Adequate by the ISHLT definition.':'Submaximal. A low peak VO₂ cannot be called disease. Use VT1, the VE/VCO₂ slope, OUES and ΔVO₂/ΔWR instead.'));
 L.push('<b>Capacity.</b> Peak VO₂ '+M.pkVO2kg.toFixed(1)+' mL/kg/min, '+M.pct.toFixed(0)+'% of predicted, Weber class '+weber(M.pkVO2kg)+'. '+(M.pct>=85?'Normal.':'Reduced.')+(P.wt>110?' Body weight is high, so judge by absolute VO₂ and percent predicted rather than mL/kg/min.':''));
 const s=[];
 const card=[M.dVO2<8.4,M.o2pPct<70,M.slope>=34&&M.restPET<33,M.eov,M.flatRatio<0.6].filter(Boolean).length;
 if(M.BR<15)s.push('ventilatory mechanics: breathing reserve '+M.BR.toFixed(0)+'%, VE reached MVV');
 if(M.spo2R-M.spo2min>=4)s.push('gas exchange: SpO₂ fell '+(M.spo2R-M.spo2min).toFixed(0)+' points');
 if(M.slope>=34&&M.restPET<33)s.push('ventilatory inefficiency with low PETCO₂, which points to poorly perfused lung or heightened reflex drive (heart failure or pulmonary vascular disease)');
 if(M.dPET<0.5&&M.slope>=40)s.push('PETCO₂ does not rise and the slope is very steep, which favours pulmonary vascular disease');
 if(M.flatRatio<0.6)s.push('ΔVO₂/ΔWR flattens late in the ramp (late to early ratio '+M.flatRatio.toFixed(2)+'). With an O₂ pulse plateau this suggests ischaemia or a stroke volume ceiling');
 if(card>=2&&M.BR>=15)s.push('cardiovascular: O₂ pulse '+M.o2pPct.toFixed(0)+'% of predicted, ΔVO₂/ΔWR '+M.dVO2.toFixed(1));
 if(M.hrRes>15&&M.pkRER>=1.08)s.push('chronotropic incompetence: HR reserve '+M.hrRes.toFixed(0)+' bpm despite a good RER');
 if(M.vt1pct<35&&M.hrRes<15&&M.BR>=30&&M.pkRER>=1.15)s.push('very early VT1 while HR reaches its maximum. Consider a peripheral or muscle limitation; invasive CPET separates this from low cardiac output');
 if(!s.length&&card<2&&M.pct<85&&M.pkRER>=1.1&&M.slope<32)s.push('mildly reduced capacity with normal efficiency and full use of HR reserve, the pattern of deconditioning');
 if(!s.length&&M.pkRER<1.05&&M.slope<32)s.push('the measures that do not depend on effort are normal, so the low peak most likely reflects effort rather than disease');
 L.push('<b>Limiting system.</b> '+(s.length?s.map(x=>x.charAt(0).toUpperCase()+x.slice(1)).join('. ')+'.':'No system reached its limit. The pattern is normal'+(M.pct<85?' or reflects deconditioning.':'.')));
 const pr=['Weber '+weber(M.pkVO2kg),'ventilatory class '+vclass(M.slope)];
 if(M.restPET<33)pr.push('low resting PETCO₂');if(M.eov)pr.push('oscillatory ventilation');if(M.hrr1<12)pr.push('blunted HR recovery');
 L.push('<b>Prognostic markers.</b> '+pr.join(', ')+'.');
 if(M.pkVO2kg<16){const tx=(M.pkRER>=1.05&&M.pkVO2kg<=12)||(M.pkRER<1.05&&M.slope>35);
  L.push('<b>Advanced heart failure.</b> '+(tx?'Meets an ISHLT 2016 CPET criterion for transplant evaluation. Confirm beta-blocker status, percent predicted in women and in patients under 50, and lean-mass adjustment in obesity.':'Does not meet the ISHLT 2016 CPET thresholds. Weigh it alongside risk scores, haemodynamics and the trend over time.'));}
 return L;
}

/* ───────────────────────── 2. Plotting ───────────────────────── */

function nice(min,max,n){const span=max-min||1,step0=span/n,mag=Math.pow(10,Math.floor(Math.log10(step0)));const st=[1,2,2.5,5,10].map(s=>s*mag).find(s=>s>=step0)||10*mag;const lo=Math.floor(min/st)*st,hi=Math.ceil(max/st)*st;const t=[];for(let v=lo;v<=hi+1e-9;v+=st)t.push(+v.toFixed(6));return{lo,hi,t};}
function fmt(v){return Math.abs(v)>=100?v.toFixed(0):Math.abs(v)>=10?(+v.toFixed(1)).toString():(+v.toFixed(2)).toString();}

/* o: {x, series:[{y,x?,c,axis,dots,d,w}], xl, yl, yr, R, ext, fix, v, h, lines, xmin, xmax}; col: palette object */
function plot(o,col,size){
 const W=(size&&size.w)||320,H=(size&&size.h)||210,fs=(size&&size.fs)||9.5;
 const ml=38,mr=o.R?46:12,mt=10,mb=30,pw=W-ml-mr,ph=H-mt-mb;
 const all=[].concat(o.x,...o.series.filter(s=>s.x).map(s=>s.x)).filter(isFinite);
 const xr=nice(o.xmin!=null?o.xmin:Math.min(...all),o.xmax!=null?o.xmax:Math.max(...all),5);
 const rng=side=>{const ser=o.series.filter(s=>(s.axis||'L')===side);if(!ser.length)return null;let lo=Infinity,hi=-Infinity;
  ser.forEach(s=>s.y.forEach(v=>{if(isFinite(v)){lo=Math.min(lo,v);hi=Math.max(hi,v);}}));((o.ext&&o.ext[side])||[]).forEach(v=>{lo=Math.min(lo,v);hi=Math.max(hi,v);});
  if(o.fix&&o.fix[side]){[lo,hi]=o.fix[side];return nice(lo,hi,4);}const pad=(hi-lo)*0.06;let a=lo-pad;if(lo>=0&&a<0)a=0;const r=nice(a,hi+pad,4);if(lo>=0&&r.lo<0){r.lo=0;r.t=r.t.filter(v=>v>=0);}return r;};
 const yl=rng('L'),yr=rng('R');
 const X=v=>ml+(v-xr.lo)/(xr.hi-xr.lo)*pw,Y=(v,ax)=>{const a=ax==='R'?yr:yl;return mt+ph-(v-a.lo)/(a.hi-a.lo)*ph;};
 let s='<svg class="plot" viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" font-size="'+fs+'" role="img">';
 s+='<rect x="'+ml+'" y="'+mt+'" width="'+pw+'" height="'+ph+'" fill="'+col.plot+'" stroke="'+col.line+'"/>';
 xr.t.forEach(v=>{const x=X(v);s+='<line x1="'+x+'" x2="'+x+'" y1="'+mt+'" y2="'+(mt+ph)+'" stroke="'+col.grid+'"/><text x="'+x+'" y="'+(mt+ph+12)+'" text-anchor="middle" fill="'+col.mut+'" class="ax">'+fmt(v)+'</text>';});
 if(yl)yl.t.forEach(v=>{const y=Y(v,'L');s+='<line x1="'+ml+'" x2="'+(ml+pw)+'" y1="'+y+'" y2="'+y+'" stroke="'+col.grid+'"/><text x="'+(ml-4)+'" y="'+(y+3)+'" text-anchor="end" fill="'+col.mut+'" class="ax">'+fmt(v)+'</text>';});
 if(yr)yr.t.forEach(v=>{s+='<text x="'+(ml+pw+4)+'" y="'+(Y(v,'R')+3)+'" fill="'+col.mut+'" class="ax">'+fmt(v)+'</text>';});
 s+='<text x="'+(ml+pw/2)+'" y="'+(H-4)+'" text-anchor="middle" fill="'+col.ink2+'" class="ax">'+o.xl+'</text>';
 if(o.yl)s+='<text transform="translate(10,'+(mt+ph/2)+') rotate(-90)" text-anchor="middle" fill="'+(o.ylc||col.ink2)+'" class="ax">'+o.yl+'</text>';
 if(o.yr)s+='<text transform="translate('+(W-4)+','+(mt+ph/2)+') rotate(-90)" text-anchor="middle" fill="'+(o.yrc||col.ink2)+'" class="ax">'+o.yr+'</text>';
 (o.v||[]).forEach(v=>{if(v.x>=xr.lo&&v.x<=xr.hi){const x=X(v.x);s+='<line x1="'+x+'" x2="'+x+'" y1="'+mt+'" y2="'+(mt+ph)+'" stroke="'+(v.c||col.mut)+'" stroke-dasharray="'+(v.d||'0')+'" stroke-width="'+(v.w||0.8)+'"/>';if(v.lab)s+='<text x="'+(x+3)+'" y="'+(mt+10)+'" fill="'+(v.c||col.mut)+'" font-size="'+(fs-1)+'">'+v.lab+'</text>';}});
 (o.h||[]).forEach(h=>{const a=(h.axis||'L')==='R'?yr:yl;if(!a||h.y<a.lo||h.y>a.hi)return;const y=Y(h.y,h.axis||'L');s+='<line x1="'+ml+'" x2="'+(ml+pw)+'" y1="'+y+'" y2="'+y+'" stroke="'+(h.c||col.mut)+'" stroke-dasharray="'+(h.d||'4 3')+'"/>';if(h.lab)s+='<text x="'+(ml+4)+'" y="'+(y-3)+'" fill="'+(h.c||col.mut)+'" font-size="'+(fs-1)+'">'+h.lab+'</text>';});
 (o.lines||[]).forEach(L=>{s+='<line x1="'+X(L.x1)+'" y1="'+Y(L.y1,L.axis||'L')+'" x2="'+X(L.x2)+'" y2="'+Y(L.y2,L.axis||'L')+'" stroke="'+(L.c||col.mut)+'" stroke-dasharray="'+(L.d||'5 3')+'" stroke-width="1.1"/>';if(L.lab)s+='<text x="'+(X(L.x2)-3)+'" y="'+(Y(L.y2,L.axis||'L')+11)+'" text-anchor="end" fill="'+(L.c||col.mut)+'" font-size="'+(fs-1)+'">'+L.lab+'</text>';});
 s+='<g clip-path="none">';
 o.series.forEach(se=>{const ax=se.axis||'L',xs=se.x||o.x;const pts=[];se.y.forEach((v,i)=>{const xx=xs[i];if(isFinite(v)&&isFinite(xx)&&xx>=xr.lo&&xx<=xr.hi)pts.push(X(xx).toFixed(1)+','+Y(v,ax).toFixed(1));});
  if(se.dots)pts.forEach(p=>{const[a,b]=p.split(',');s+='<circle cx="'+a+'" cy="'+b+'" r="1.6" fill="'+se.c+'" opacity="'+(se.op||0.85)+'"/>';});
  else s+='<polyline points="'+pts.join(' ')+'" fill="none" stroke="'+se.c+'" stroke-width="'+(se.w||1.5)+'" stroke-dasharray="'+(se.d||'0')+'" stroke-linejoin="round" opacity="'+(se.op||1)+'"/>';});
 return s+'</g></svg>';
}

const PANELS=[
 {n:1,g:'pump',t:'Ventilation',ax:'VE vs time',q:'How much air did they move, and was it steady?',
  look:'Peak VE against MVV (dashed line). A gap under about 15% means the ventilatory pump reached its ceiling. Cyclic waves in VE at rest and early exercise are oscillatory ventilation, an adverse sign in heart failure. VE bends upward after the respiratory compensation point.'},
 {n:2,g:'heart',t:'Heart rate and O₂ pulse',ax:'HR, O₂ pulse vs time',q:'Did HR reach its maximum? Did stroke volume keep rising?',
  look:'HR should approach the predicted maximum (dashed). O₂ pulse is stroke volume multiplied by extraction and should keep rising until near peak. An early plateau, or a fall late in the test, means stroke volume cannot increase (heart failure, pulmonary hypertension, outflow obstruction) or ischaemia is developing.'},
 {n:3,g:'heart',t:'VO₂, VCO₂ and work',ax:'VO₂, VCO₂ vs time',q:'How large is the engine, and did O₂ uptake keep pace with work?',
  look:'VO₂ should rise about 10 mL/min for each watt. The grey dashed line shows that expected rise from the start of the ramp. VO₂ falling below it, or flattening, means delivery is failing. VCO₂ crossing above VO₂ marks heavy buffering. The dotted line is predicted peak VO₂.'},
 {n:4,g:'pump',t:'Ventilatory efficiency',ax:'VE vs VCO₂',q:'How much ventilation does it take to clear CO₂?',
  look:'The slope of this line up to the respiratory compensation point is the VE/VCO₂ slope. Reference lines show slopes of 25 and 35. A steeper line means more dead space or a lower PaCO₂ set point. Ventilatory classes: I under 30, II 30 to 35.9, III 36 to 44.9, IV 45 or more.'},
 {n:5,g:'heart',t:'V-slope and HR',ax:'VCO₂ and HR vs VO₂',q:'Where is VT1? What does each litre of O₂ cost in heart beats?',
  look:'VCO₂ against VO₂ runs close to the 45 degree line, then steepens at VT1 (vertical line). HR against VO₂ shows chronotropic behaviour: a steep line means the heart relies on rate because stroke volume is small. A line that ends well below predicted HR means chronotropic incompetence or a submaximal test.'},
 {n:6,g:'gas',t:'Ventilatory equivalents',ax:'VE/VO₂, VE/VCO₂ vs time',q:'Where are VT1 and the compensation point?',
  look:'Both fall early as ventilation and perfusion match better. VE/VO₂ starts rising at VT1 while VE/VCO₂ stays flat. VE/VCO₂ rises later at the respiratory compensation point. If both stay high throughout, think of dead space or hyperventilation.'},
 {n:7,g:'pump',t:'Breathing pattern',ax:'Tidal volume vs VE',q:'Did they breathe deeper or faster?',
  look:'Tidal volume normally rises to about half of vital capacity, after which rate takes over. A low tidal volume plateau with a high rate suggests restriction (interstitial lung disease, obesity, chest wall). In COPD, tidal volume plateaus early because of dynamic hyperinflation.'},
 {n:8,g:'gas',t:'Respiratory exchange ratio',ax:'RER vs time',q:'What fuel, how much effort, how much acid?',
  look:'About 0.8 at rest, crossing 1.0 after VT1. A peak of 1.10 or more indicates good effort; ISHLT uses 1.05. A resting value above 1.0 means the patient was hyperventilating before the test. RER overshoots in recovery as stored CO₂ is cleared.'},
 {n:9,g:'gas',t:'End-tidal gases',ax:'PETCO₂, PETO₂ vs time',q:'Is ventilated lung being perfused?',
  look:'PETCO₂ is normally 36 to 42 mmHg at rest, rises 3 to 8 mmHg up to VT1 and falls after the compensation point. Low and flat, or falling from the start, means poor pulmonary perfusion (heart failure, pulmonary hypertension). A steady rise to peak means CO₂ retention from ventilatory limitation. PETO₂ reaches its lowest point at VT1.'}
];

/* Build the nine plot specs. ref = simulation of the healthy twin (optional). */
function panelSpecs(S,ref,col){
 const R=S.rows,P=S.P,t=R.map(x=>x.t),ex=R.filter(x=>x.phase<3),exT=R.filter(x=>x.phase>=1&&x.phase<3),endT=4+S.T;
 const vT=[{x:2,d:'3 3'},{x:4,d:'3 3'},{x:endT,d:'3 3'}];
 const vtRow=R.find(x=>x.phase===2&&x.VO2true>=S.VO2vt);
 const vV=vtRow?vT.concat([{x:vtRow.t,c:col.c3,w:1,lab:'VT1'}]):vT;
 const g=ref?ref.rows:null,gT=g?g.map(x=>x.t):null,gEx=g?g.filter(x=>x.phase>=1&&x.phase<3):null,gE=g?g.filter(x=>x.phase<3):null;
 const ghost=(arr,xs,axis)=>g?[{y:arr,x:xs,c:col.ghost,d:'3 3',w:1.2,axis:axis||'L'}]:[];
 const specs=[];
 specs.push({x:t,xl:'time (min)',yl:'VE (L/min)',yr:'work (W)',R:true,series:ghost(g&&g.map(x=>x.VE),gT).concat([{y:R.map(x=>x.VE),c:col.c1},{y:R.map(x=>x.WR),c:col.mut,axis:'R',d:'2 2',w:1}]),ext:{L:[0,P.mvv*1.03]},h:[{y:P.mvv,lab:'MVV',c:col.c2}],v:vT});
 specs.push({x:t,xl:'time (min)',yl:'HR (bpm)',ylc:col.c2,yr:'O₂ pulse (mL/beat)',yrc:col.c1,R:true,
  series:ghost(g&&g.map(x=>x.O2p),gT,'R').concat([{y:R.map(x=>x.HR),c:col.c2},{y:R.map(x=>x.O2p),c:col.c1,axis:'R'}]),ext:{L:[P.hrPred+5],R:[0]},h:[{y:P.hrPred,lab:'predicted max',c:col.c2}],v:vT});
 specs.push({x:t,xl:'time (min)',yl:'VO₂, VCO₂ (L/min)',yr:'work (W)',R:true,
  series:ghost(g&&g.map(x=>x.VO2/1000),gT).concat([{y:R.map(x=>x.VO2/1000),c:col.c1},{y:R.map(x=>x.VCO2/1000),c:col.c2},{y:R.map(x=>x.phase===2?(S.VO2u+10*x.WR)/1000:NaN),c:col.mut,d:'5 3',w:1},{y:R.map(x=>x.WR),c:col.mut,axis:'R',d:'2 2',w:0.8}]),
  ext:{L:[0,P.predVO2/1000*1.02]},h:[{y:P.predVO2/1000,lab:'predicted peak',d:'1 3'}],v:vV});
 const vc=exT.map(x=>x.VCO2/1000),vmax=Math.max(...vc,g?Math.max(...gEx.map(x=>x.VCO2/1000)):0);
 specs.push({x:vc,xl:'VCO₂ (L/min)',yl:'VE (L/min)',xmin:0,series:ghost(gEx&&gEx.map(x=>x.VE),gEx&&gEx.map(x=>x.VCO2/1000)).concat([{y:exT.map(x=>x.VE),c:col.c1,dots:true}]),ext:{L:[0]},
  lines:[{x1:0,y1:3,x2:vmax,y2:3+25*vmax,lab:'25'},{x1:0,y1:3,x2:vmax,y2:3+35*vmax,lab:'35',c:col.c2}]});
 const vo=exT.map(x=>x.VO2/1000),vomax=Math.max(...vo);
 specs.push({x:vo,xl:'VO₂ (L/min)',yl:'VCO₂ (L/min)',ylc:col.c2,yr:'HR (bpm)',yrc:col.c1,R:true,
  series:[{y:exT.map(x=>x.VCO2/1000),c:col.c2,dots:true},{y:exT.map(x=>x.HR),c:col.c1,axis:'R',w:1.3}],ext:{R:[P.hrPred]},
  lines:[{x1:vo[0],y1:exT[0].VCO2/1000,x2:vomax,y2:exT[0].VCO2/1000+(vomax-vo[0]),lab:'45°'}],v:[{x:S.VO2vt/1000,c:col.c3,lab:'VT1',w:1}],h:[{y:P.hrPred,axis:'R',c:col.c1,lab:'predicted HR'}]});
 specs.push({x:t,xl:'time (min)',yl:'VE/VO₂ · VE/VCO₂',series:ghost(g&&g.map(x=>x.EqCO2),gT).concat([{y:R.map(x=>x.EqO2),c:col.c1},{y:R.map(x=>x.EqCO2),c:col.c2}]),v:vV,h:[{y:30,lab:'30',d:'1 3'}]});
 specs.push({x:ex.map(x=>x.VE),xl:'VE (L/min)',yl:'tidal volume (L)',xmin:0,xmax:Math.max(P.mvv*1.05,...ex.map(x=>x.VE)),
  series:ghost(gE&&gE.map(x=>x.VT),gE&&gE.map(x=>x.VE)).concat([{y:ex.map(x=>x.VT),c:col.c1,dots:true}]),ext:{L:[0,P.vtMax*1.1]},v:[{x:P.mvv,c:col.c2,lab:'MVV',d:'4 3'}]});
 specs.push({x:t,xl:'time (min)',yl:'RER',series:ghost(g&&g.map(x=>x.RER),gT).concat([{y:R.map(x=>x.RER),c:col.c1}]),fix:{L:[0.65,1.45]},h:[{y:1.0,lab:'1.00',d:'1 3'},{y:1.1,lab:'1.10',c:col.c3}],v:vV});
 specs.push({x:t,xl:'time (min)',yl:'PETCO₂ (mmHg)',ylc:col.c2,yr:'PETO₂ (mmHg)',yrc:col.c1,R:true,
  series:ghost(g&&g.map(x=>x.PETCO2),gT).concat([{y:R.map(x=>x.PETCO2),c:col.c2},{y:R.map(x=>x.PETO2),c:col.c1,axis:'R'}]),fix:{L:[18,48],R:[80,135]},v:vV});
 return specs;
}

/* ───────────────────────── 3. References (verified in PubMed) ───────────────────────── */
const REFS=[
 {id:1,a:'Balady GJ, Arena R, Sietsema K, et al.',t:"Clinician's guide to cardiopulmonary exercise testing in adults: a scientific statement from the American Heart Association.",j:'Circulation',y:2010,v:'122(2):191-225',pmid:'20585013',doi:'10.1161/CIR.0b013e3181e52e69',topic:'Statement'},
 {id:2,a:'Guazzi M, Adams V, Conraads V, et al.',t:'EACPR/AHA scientific statement. Clinical recommendations for cardiopulmonary exercise testing data assessment in specific patient populations.',j:'Circulation',y:2012,v:'126(18):2261-74',pmid:'22952317',doi:'10.1161/CIR.0b013e31826fb946',pmc:'PMC4777325',topic:'Statement'},
 {id:3,a:'Guazzi M, Arena R, Halle M, et al.',t:'2016 focused update: clinical recommendations for cardiopulmonary exercise testing data assessment in specific patient populations.',j:'Circulation',y:2016,v:'133(24):e694-711',pmid:'27143685',doi:'10.1161/CIR.0000000000000406',topic:'Statement'},
 {id:4,a:'American Thoracic Society; American College of Chest Physicians.',t:'ATS/ACCP statement on cardiopulmonary exercise testing.',j:'Am J Respir Crit Care Med',y:2003,v:'167(2):211-77',pmid:'12524257',doi:'10.1164/rccm.167.2.211',topic:'Statement'},
 {id:5,a:'Mehra MR, Canter CE, Hannan MM, et al.',t:'The 2016 International Society for Heart Lung Transplantation listing criteria for heart transplantation: a 10-year update.',j:'J Heart Lung Transplant',y:2016,v:'35(1):1-23',pmid:'26776864',doi:'10.1016/j.healun.2015.10.023',topic:'Transplant'},
 {id:6,a:'Peled Y, Ducharme A, Kittleson M, et al.',t:'International Society for Heart and Lung Transplantation guidelines for the evaluation and care of cardiac transplant candidates, 2024.',j:'J Heart Lung Transplant',y:2024,v:'43(10):1529-1628.e54',pmid:'39115488',doi:'10.1016/j.healun.2024.05.010',topic:'Transplant'},
 {id:7,a:'Mancini DM, Eisen H, Kussmaul W, et al.',t:'Value of peak exercise oxygen consumption for optimal timing of cardiac transplantation in ambulatory patients with heart failure.',j:'Circulation',y:1991,v:'83(3):778-86',pmid:'1999029',doi:'10.1161/01.cir.83.3.778',topic:'Transplant'},
 {id:8,a:'Weber KT, Kinasewitz GT, Janicki JS, Fishman AP.',t:'Oxygen utilization and ventilation during exercise in patients with chronic cardiac failure.',j:'Circulation',y:1982,v:'65(6):1213-23',pmid:'6804111',doi:'10.1161/01.cir.65.6.1213',topic:'Heart failure'},
 {id:9,a:'Arena R, Myers J, Abella J, et al.',t:'Development of a ventilatory classification system in patients with heart failure.',j:'Circulation',y:2007,v:'115(18):2410-7',pmid:'17452607',doi:'10.1161/CIRCULATIONAHA.107.686576',topic:'Heart failure'},
 {id:10,a:'Chua TP, Ponikowski P, Harrington D, et al.',t:'Clinical correlates and prognostic significance of the ventilatory response to exercise in chronic heart failure.',j:'J Am Coll Cardiol',y:1997,v:'29(7):1585-90',pmid:'9180123',doi:'10.1016/s0735-1097(97)00078-8',topic:'Heart failure'},
 {id:11,a:'Corrà U, Giordano A, Bosimini E, et al.',t:'Oscillatory ventilation during exercise in patients with chronic heart failure: clinical correlates and prognostic implications.',j:'Chest',y:2002,v:'121(5):1572-80',pmid:'12006446',doi:'10.1378/chest.121.5.1572',topic:'Heart failure'},
 {id:12,a:'Baba R, Nagashima M, Goto M, et al.',t:'Oxygen uptake efficiency slope: a new index of cardiorespiratory functional reserve derived from the relation between oxygen uptake and minute ventilation during incremental exercise.',j:'J Am Coll Cardiol',y:1996,v:'28(6):1567-72',pmid:'8917273',doi:'10.1016/s0735-1097(96)00412-3',topic:'Physiology'},
 {id:13,a:'Beaver WL, Wasserman K, Whipp BJ.',t:'A new method for detecting anaerobic threshold by gas exchange.',j:'J Appl Physiol',y:1986,v:'60(6):2020-7',pmid:'3087938',doi:'10.1152/jappl.1986.60.6.2020',topic:'Physiology'},
 {id:14,a:'Chambers DJ, Wisely NA.',t:"Cardiopulmonary exercise testing: a beginner's guide to the nine-panel plot.",j:'BJA Educ',y:2019,v:'19(5):158-64',pmid:'33456885',doi:'10.1016/j.bjae.2019.01.009',pmc:'PMC7807922',topic:'Interpretation'},
 {id:15,a:'Neder JA, Phillips DB, Marillier M, et al.',t:'Clinical interpretation of cardiopulmonary exercise testing: current pitfalls and limitations.',j:'Front Physiol',y:2021,v:'12:552000',pmid:'33815128',doi:'10.3389/fphys.2021.552000',pmc:'PMC8012894',topic:'Interpretation'},
 {id:16,a:'Guazzi M, Borlaug B, Metra M, et al.',t:'Revisiting and implementing the Weber and ventilatory functional classifications in heart failure by cardiopulmonary imaging phenotyping.',j:'J Am Heart Assoc',y:2021,v:'10(5):e018822',pmid:'33615821',doi:'10.1161/JAHA.120.018822',pmc:'PMC8174289',topic:'Heart failure'},
 {id:17,a:'Guazzi M, Wilhelm M, Halle M, et al.',t:'Exercise testing in heart failure with preserved ejection fraction: an appraisal through diagnosis, pathophysiology and therapy. A clinical consensus statement of the HFA and EAPC of the ESC.',j:'Eur J Heart Fail',y:2022,v:'24(8):1327-45',pmid:'35775383',doi:'10.1002/ejhf.2601',pmc:'PMC9542249',topic:'HFpEF'},
 {id:18,a:'Borlaug BA, Nishimura RA, Sorajja P, Lam CSP, Redfield MM.',t:'Exercise hemodynamics enhance diagnosis of early heart failure with preserved ejection fraction.',j:'Circ Heart Fail',y:2010,v:'3(5):588-95',pmid:'20543134',doi:'10.1161/CIRCHEARTFAILURE.109.930701',pmc:'PMC3048586',topic:'HFpEF'},
 {id:19,a:'Oldham WM, Lewis GD, Opotowsky AR, et al.',t:'Unexplained exertional dyspnea caused by low ventricular filling pressures: results from clinical invasive cardiopulmonary exercise testing.',j:'Pulm Circ',y:2016,v:'6(1):55-62',pmid:'27162614',doi:'10.1086/685054',pmc:'PMC4860548',topic:'Invasive CPET'},
 {id:20,a:'Wattanachayakul P, Kittipibul V, Salah HM, et al.',t:'Invasive haemodynamic assessment in heart failure with preserved ejection fraction.',j:'ESC Heart Fail',y:2025,v:'12(3):1558-70',pmid:'39520094',doi:'10.1002/ehf2.15163',pmc:'PMC12055371',topic:'Invasive CPET'},
 {id:21,a:'Humbert M, Kovacs G, Hoeper MM, et al.',t:'2022 ESC/ERS guidelines for the diagnosis and treatment of pulmonary hypertension.',j:'Eur Heart J',y:2022,v:'43(38):3618-731',pmid:'36017548',doi:'10.1093/eurheartj/ehac237',topic:'Pulmonary hypertension'},
 {id:22,a:'Older P, Smith R, Courtney P, Hone R.',t:'Preoperative evaluation of cardiac failure and ischemia in elderly patients by cardiopulmonary exercise testing.',j:'Chest',y:1993,v:'104(3):701-4',pmid:'8365279',doi:'10.1378/chest.104.3.701',topic:'Perioperative'},
 {id:23,a:'Garcia Brás P, Gonçalves AV, Reis JF, et al.',t:'Cardiopulmonary exercise testing in the age of new heart failure therapies: still a powerful tool?',j:'Biomedicines',y:2023,v:'11(8):2208',pmid:'37626705',doi:'10.3390/biomedicines11082208',pmc:'PMC10452308',topic:'Heart failure'},
 {id:24,a:'Wasserman K, Hansen JE, Sue DY, et al.',t:'Principles of Exercise Testing and Interpretation. 5th ed.',j:'Philadelphia: Lippincott Williams & Wilkins',y:2012,v:'',topic:'Textbook'}
];

/* [n] or [n,m] in content becomes a tappable citation */
function cite(html){return html.replace(/\[(\d+(?:,\s*\d+)*)\]/g,(m,ids)=>'<sup class="cite">'+ids.split(',').map(i=>'<a href="#" data-ref="'+i.trim()+'">'+i.trim()+'</a>').join(',')+'</sup>');}

/* ───────────────────────── 4. Learn: chapters ─────────────────────────
   Each chapter runs the same sequence:
   ask → idea → try (in the simulator) → check → say it back.            */
const CHAPTERS=[
{id:'fick',n:1,title:'Oxygen in, work out',sub:'VO₂, the Fick principle and the O₂ pulse',
 ask:{q:'A patient with a fixed stroke volume needs to double oxygen delivery to his legs. Without reading further, which variable must rise most steeply on his test?',
  opts:['Respiratory rate','Heart rate','Tidal volume','End-tidal CO₂'],a:1,why:'If stroke volume cannot rise, flow can only increase through rate. His HR will climb steeply for each litre of oxygen, and his O₂ pulse will stay flat.'},
 idea:`<p>Oxygen uptake measured at the mouth equals the oxygen used by the tissues once the patient reaches steady state. The Fick principle connects the two:</p>
<div class="eq">VO₂ = HR × SV × (CaO₂ − CvO₂)</div>
<p>Every CPET variable is a way of asking which term in this equation failed to rise. Peak VO₂ is the product of the whole chain: lungs that load oxygen, blood that carries it, a heart that pumps it, and muscle that extracts and burns it [1,24].</p>
<p>Divide both sides by heart rate and you get the <b>O₂ pulse</b>, the oxygen delivered with each beat. Extraction widens in a predictable way during exercise, so the O₂ pulse follows stroke volume closely. When it flattens early, stroke volume has reached its ceiling [14].</p>
<p>Muscle efficiency is fairly constant, so on a cycle ramp VO₂ rises by about <b>10 mL/min for every watt</b> (ΔVO₂/ΔWR, normally 8.5 to 11). A slope under about 8.4, or one that flattens late in the ramp, means oxygen delivery is falling behind demand and the extra work is being paid for anaerobically [1,24].</p>
<div class="note"><b>A picture to keep.</b> Think of a delivery service. VO₂ is parcels delivered per minute, HR is trips per minute, stroke volume is the size of the van, and extraction is how many parcels each house accepts. The O₂ pulse is parcels per trip. If the vans cannot get bigger, the only way to deliver more is to make more trips.</div>`,
 try:{scen:'normal',knobs:{kLate:0.3},prompt:'The normal test has been changed so that VO₂ stops keeping pace with work in the last third of the ramp. Before you look: what happens to the O₂ pulse in panel 2, and to the gap between VO₂ and the grey dashed line in panel 3?',
  look:'VO₂ falls away from the expected 10 mL/min/W line while HR keeps climbing, so the O₂ pulse flattens and then dips. This is the classic pattern of exercise-induced ischaemia or a stroke volume ceiling.'},
 check:[['Why is the O₂ pulse only an approximation of stroke volume? Name two situations in which it misleads.','It equals stroke volume times the arteriovenous O₂ difference. It underestimates stroke volume when extraction is impaired (mitochondrial myopathy) and when arterial O₂ content is low (anaemia, desaturation). It is unreliable in atrial fibrillation because stroke volume varies beat to beat.'],
  ['A patient reaches 100 W, but VO₂ rose only 6 mL/min per watt. Where did the rest of the energy come from?','From anaerobic glycolysis and stored phosphates. The work was done, but oxygen delivery could not keep up, so the deficit was paid with lactate. Expect an early VT1 and a steep rise in RER.']],
 say:{prompt:'In four or five sentences, explain to a medical student why peak VO₂ predicts survival in heart failure.',
  model:'Peak VO₂ is the output of the entire oxygen chain under maximum stress. In heart failure the main constraint is how far cardiac output can rise, with added contributions from skeletal muscle and the vasculature. A single number therefore summarises cardiac reserve and the body\'s adaptation to its loss. A heart that cannot raise flow during exercise is likely to fail under the other stresses of daily life, which is why low peak VO₂ tracks mortality [7,8].'}},

{id:'thresholds',n:2,title:'Two thresholds',sub:'RER, VT1 and the respiratory compensation point',
 ask:{q:'Burning fat or carbohydrate can never produce more CO₂ than the O₂ it consumes. Yet RER regularly exceeds 1.0 at peak exercise. Where does the extra CO₂ come from?',
  opts:['Protein oxidation','Bicarbonate buffering of lactic acid','Carbon monoxide in the expired gas','Measurement error at high flow'],a:1,why:'Hydrogen ions from lactic acid are buffered by bicarbonate, which releases CO₂ that did not come from oxidation. Each mmol of lactate buffered adds about 22 mL of CO₂ [13].'},
 idea:`<p>At rest, RER (VCO₂/VO₂) sits near 0.8, reflecting a mix of fat and carbohydrate. During a ramp it rises for a different reason: acid.</p>
<p><b>VT1</b> (the gas exchange or anaerobic threshold) is where lactate production begins to outpace clearance. Bicarbonate buffers the acid and releases extra CO₂, so VCO₂ bends upward relative to VO₂. Plotting one against the other and finding the break point is the V-slope method [13]. Ventilation follows CO₂ faithfully, so VE/VO₂ and PETO₂ start to rise while VE/VCO₂ and PETCO₂ stay flat. This stretch is called isocapnic buffering.</p>
<p><b>The respiratory compensation point</b> (RCP, VT2) comes later, as bicarbonate runs low and pH begins to fall. The carotid bodies now drive ventilation beyond the CO₂ load. VE/VCO₂ starts to rise and PETCO₂ starts to fall.</p>
<p>VT1 does not depend on effort. It can be found even if the patient stops early, which is why it matters when the test is submaximal. Normal VT1 is above 40% of predicted peak VO₂ [2]. Peak RER, by contrast, tells you how far into the acid range the patient went: 1.10 or more indicates good effort, and ISHLT accepts 1.05 for transplant decisions [5].</p>
<div class="note"><b>A picture to keep.</b> Pour acid into a glass of bicarbonate solution and it fizzes CO₂. VT1 is when the fizzing starts and you breathe harder only to clear the fizz. The compensation point is when the bicarbonate runs out and the glass actually turns acidic, so you breathe harder again to correct the pH.</div>`,
 try:{scen:'normal',knobs:{},prompt:'On the normal test, find VT1 in panel 5 and in panel 6 before reading the labels. What changes in each panel at the same moment?',
  look:'In panel 5 the VCO₂ dots leave the 45 degree line. In panel 6 VE/VO₂ turns upward while VE/VCO₂ stays flat. In panel 9 PETO₂ reaches its lowest point and begins to rise. All three happen at the same VO₂.'},
 check:[['At VT1, why does VE/VO₂ rise while VE/VCO₂ stays flat?','Ventilation rises in step with the extra CO₂ from buffering. Relative to CO₂ nothing changes, but relative to O₂ ventilation is now excessive, so VE/VO₂ rises.'],
  ['A test ends with peak RER 0.98. Which results can you still use?','VT1, the VE/VCO₂ slope (measured below the compensation point), OUES, the PETCO₂ pattern, ΔVO₂/ΔWR and oscillatory ventilation. Peak VO₂ and peak O₂ pulse cannot be interpreted as maximal values.']],
 say:{prompt:'Explain the V-slope method to an intern without using the word "anaerobic".',
  model:'Plot CO₂ breathed out against O₂ taken in. While muscles burn fuel with oxygen, the two rise together along a line close to 45 degrees. When lactic acid starts to build up, bicarbonate neutralises it and releases extra CO₂ that did not come from burning fuel, so CO₂ begins to rise faster than O₂. The point where the line bends upward is VT1. The patient does not need to try hard for you to see it [13].'}},

{id:'efficiency',n:3,title:'Ventilatory efficiency',sub:'VE/VCO₂, PETCO₂ and oscillatory breathing',
 ask:{q:'Two patients each have a VE/VCO₂ slope of 45. One has advanced HFrEF, the other is anxious and hyperventilating. Which other variable would best tell them apart?',
  opts:['Peak HR','End-tidal CO₂ behaviour and the resting phase','Tidal volume','Peak work rate'],a:1,why:'Both raise the slope, but by different mechanisms. The hyperventilator shows a high resting RER and low PETCO₂ from the start, often with an erratic pattern, while O₂ pulse and ΔVO₂/ΔWR are normal. The heart failure patient has low PETCO₂ with flat O₂ pulse and early VT1.'},
 idea:`<p>Combine the alveolar ventilation equation with the dead space fraction and you get:</p>
<div class="eq">VE/VCO₂ = 863 / [PaCO₂ × (1 − VD/VT)]</div>
<p>Only two things can raise VE/VCO₂. The first is <b>more dead space</b>: ventilated alveoli with too little blood flow, as happens with low cardiac output and pulmonary vascular disease. The second is <b>a lower PaCO₂ set point</b>: the body chooses to run a lower CO₂ because of heightened chemoreflexes, muscle ergoreflexes, J-receptor stimulation from high left atrial pressure, anxiety or acidosis [10].</p>
<p>In HFrEF both mechanisms act together. That is why the VE/VCO₂ slope carries prognostic information beyond peak VO₂ [10] and why a four-level ventilatory classification predicts events: class I under 30, II 30 to 35.9, III 36 to 44.9, IV 45 or more [9]. The slope is measured up to the respiratory compensation point and does not depend on effort.</p>
<p><b>PETCO₂</b> is the mirror image. Normally 36 to 42 mmHg at rest, it rises 3 to 8 mmHg up to VT1 as perfusion improves, then falls after the compensation point. A low resting value that fails to rise points to poorly perfused lung. A value that falls from the start of exercise suggests pulmonary vascular disease [2,21].</p>
<p><b>Oscillatory ventilation</b> is a waxing and waning of VE during exercise. It is a control problem: a long circulation time (low cardiac output) combined with high chemoreflex gain makes the feedback loop overshoot. It is associated with worse survival in heart failure [11].</p>
<div class="note"><b>A picture to keep.</b> A shower with long pipes and a jumpy hand on the tap swings between too hot and too cold. Lengthen the pipes (slow circulation) or make the hand jumpier (sensitive chemoreceptors) and the swings grow. That is oscillatory ventilation.</div>`,
 try:{scen:'normal',knobs:{veVco2:45,petR:30},prompt:'The VE/VCO₂ slope has been raised to 45 and resting PETCO₂ lowered to 30. Predict panels 4, 6 and 9 before you look.',
  look:'Panel 4 steepens beyond the 35 reference line. In panel 6 VE/VCO₂ stays high throughout with a high nadir. In panel 9 PETCO₂ starts low. Compare each with the dotted healthy trace.'},
 check:[['Name both mechanisms that raise VE/VCO₂ in HFrEF, with one cause for each.','Increased dead space, from low cardiac output and raised pulmonary vascular resistance leaving ventilated lung under-perfused. Lower PaCO₂ set point, from enhanced chemoreflex and ergoreflex drive and J-receptor stimulation by high left atrial pressure.'],
  ['Why is PETCO₂ low in pulmonary hypertension even though the patient is not necessarily hyperventilating?','End-tidal gas comes from all ventilated alveoli. Alveoli that are ventilated but poorly perfused contribute gas with almost no CO₂, which dilutes the end-tidal value.']],
 say:{prompt:'Explain to a patient with heart failure why they get more breathless than their friend at the same walking pace.',
  model:'Part of your lungs is getting air but not enough blood, because the heart cannot push blood through them fast enough. That air is wasted, so you have to breathe more to get rid of the same amount of carbon dioxide. On top of that, the sensors that control your breathing have become oversensitive and set your breathing higher than it needs to be. Both make you breathe harder for the same effort.'}},

{id:'ninepanel',n:4,title:'Reading the nine panels',sub:'One question per panel',
 ask:{q:'Panel positions differ between laboratories. What is the most reliable way to learn the nine-panel display?',
  opts:['Memorise the classic positions','Learn the question each panel answers','Read only the summary table','Look only at peak values'],a:1,why:'Layouts vary between systems and editions. The questions do not. If you know what each plot asks, you can read any layout.'},
 idea:`<p>The nine-panel plot, developed by Wasserman and colleagues, shows the same breath-by-breath data nine ways [24]. The classic arrangement groups into three systems [14]:</p>
<ul><li><b>Heart and circulation</b>, panels 2, 3 and 5: HR and O₂ pulse, VO₂ against work, and the V-slope with HR.</li>
<li><b>Ventilatory pump</b>, panels 1, 4 and 7: VE over time, VE against VCO₂, and tidal volume against VE.</li>
<li><b>Gas exchange</b>, panels 6, 8 and 9: ventilatory equivalents, RER, and end-tidal gases.</li></ul>
<p>Read them in that order: heart, then pump, then gas exchange. Before peaks, look at the rest phase. A resting RER above 1.0 or a high resting VE/VCO₂ means the patient was hyperventilating before the test, which distorts the early slopes [15].</p>
<p>Three vertical lines usually mark the start of unloaded pedalling, the start of the ramp and the end of loaded exercise. In this app the dotted grey trace is a healthy person of the same age and size, so every abnormality appears as a separation from it.</p>`,
 try:{scen:'hfref',knobs:{},prompt:'This is advanced HFrEF. Go through the panels in the order heart, pump, gas exchange, and name one abnormality in each group before you open the key numbers.',
  look:'Heart: flat, low O₂ pulse; ΔVO₂/ΔWR below the expected line; early VT1. Pump: oscillation in VE; breathing reserve is ample. Gas exchange: high VE/VCO₂ throughout; low PETCO₂ that barely rises.'},
 check:[['Which two panels locate VT1, and what changes in each?','Panel 5: VCO₂ leaves the 45 degree line. Panel 6: VE/VO₂ begins to rise while VE/VCO₂ stays flat. Panel 9 confirms it with the PETO₂ low point.'],
  ['PETCO₂ rises steadily to peak instead of falling. What does that say about the ventilatory pump?','The patient could not increase ventilation enough to clear CO₂, so it accumulated. This is ventilatory limitation, typically COPD with low breathing reserve.']],
 say:{prompt:'Pick panel 2 or panel 4. Explain what it shows and why it matters, as if teaching at noon conference without slides.',
  model:'Panel 4 plots ventilation against CO₂ output. Its slope tells you how many litres of air the patient needs to clear one litre of CO₂. A healthy person needs about 25. In heart failure and pulmonary hypertension it rises, because some ventilated lung receives too little blood and because breathing control is set higher. A slope above 35 to 36 marks higher risk, and above 45 the highest risk group [9,10].'}},

{id:'routine',n:5,title:'A reading routine',sub:'The same six questions every time',
 ask:{q:'A report says peak VO₂ is 14 mL/kg/min. What should you check before calling it reduced cardiac capacity?',
  opts:['The VE/VCO₂ slope','Peak RER and the reason for stopping','Resting heart rate','Body mass index only'],a:1,why:'If effort was submaximal, a low peak VO₂ says nothing about the heart. Validity and effort always come first.'},
 idea:`<p>Use the same order on every test. Do not move on until each question is answered.</p>
<ol>
<li><b>Is the test valid?</b> What was the question, which protocol (a ramp should last 8 to 12 minutes), why did the patient stop, and what does the rest phase look like? Check medications and rhythm [1,4].</li>
<li><b>Was effort maximal?</b> Peak RER, Borg score, HR reserve, and whether VT1 and the compensation point were reached. If not, rely on VT1, the VE/VCO₂ slope, OUES, PETCO₂ and ΔVO₂/ΔWR [12].</li>
<li><b>Is capacity reduced?</b> Peak VO₂ in mL/kg/min and as percent predicted, naming the reference equation. VT1 as a percentage of predicted peak.</li>
<li><b>Which system limited?</b> Cardiovascular, ventilatory mechanics, gas exchange, peripheral or muscle, deconditioning, or effort.</li>
<li><b>What does it predict?</b> Weber class [8], ventilatory class [9], oscillatory ventilation [11], PETCO₂ and HR recovery, taken together [16].</li>
<li><b>Answer the referral question</b> in plain language.</li></ol>
<p>A useful report sentence reads: "The limitation is cardiovascular, with markers of advanced heart failure: peak VO₂ 11.2 mL/kg/min on a beta-blocker at RER 1.12, VE/VCO₂ slope 41, oscillatory ventilation present. This meets ISHLT CPET criteria for transplant evaluation."</p>`,
 try:{scen:'poor',knobs:{},prompt:'This man stopped at six minutes. Work through steps 1 to 4 before opening the key numbers. Is his heart abnormal?',
  look:'RER stays below 1.0 and HR reserve is large, so the test is submaximal. The measures that do not need effort are normal: VE/VCO₂ slope about 27, ΔVO₂/ΔWR about 10, normal PETCO₂ rise. The low peak reflects effort, not disease.'},
 check:[['Why must validity come before capacity?','Every later step depends on the data being real and the effort being sufficient. A mask leak, a short ramp or early stopping produces numbers that look like disease.'],
  ['Write one sentence answering a transplant referral for a patient at peak VO₂ 13 mL/kg/min, RER 0.99, VE/VCO₂ slope 39.','The test was submaximal, so peak VO₂ cannot be applied to the listing threshold. However, the VE/VCO₂ slope of 39 exceeds 35, which ISHLT allows as a supportive criterion when RER is below 1.05 [5].']],
 say:{prompt:'From memory, list the six questions and say what goes wrong if you skip each one.',
  model:'Valid: you interpret artefact. Effort: you call poor effort disease. Capacity: you miss the size of the problem or misjudge it in obesity. System: you treat the wrong organ. Prognosis: you miss who needs advanced therapy. Answer: the referring doctor cannot act on the report.'}},

{id:'patterns',n:6,title:'Patterns of limitation',sub:'Telling the look-alikes apart',
 ask:{q:'A smoker with dyspnoea has peak VO₂ 58% of predicted, breathing reserve 4% and HR reserve 29 bpm. Which system limited him first?',
  opts:['Heart','Ventilatory pump','Skeletal muscle','Effort'],a:1,why:'He used almost all of his ventilatory capacity while his heart still had reserve. The system that reaches its ceiling first is the limiter.'},
 idea:`<p>Each disease breaks one link in the oxygen chain, and the pattern follows from the link [1,2,24].</p>
<div class="tbl"><table><tr><th>Pattern</th><th>Signature</th></tr>
<tr><td>HFrEF</td><td>Low peak VO₂, early VT1, flat low O₂ pulse, low ΔVO₂/ΔWR, high VE/VCO₂, low PETCO₂, often oscillatory ventilation. Breathing reserve preserved.</td></tr>
<tr><td>HFpEF</td><td>Reduced peak VO₂, chronotropic incompetence, O₂ pulse plateau, mildly raised VE/VCO₂ [17].</td></tr>
<tr><td>Pulmonary vascular disease</td><td>Very high VE/VCO₂, low PETCO₂ that falls from the start, desaturation, early O₂ pulse plateau [21].</td></tr>
<tr><td>Myocardial ischaemia</td><td>Sudden late flattening of ΔVO₂/ΔWR with an O₂ pulse that plateaus or falls [3].</td></tr>
<tr><td>COPD</td><td>Breathing reserve under 15%, VE near MVV, PETCO₂ that rises, large HR reserve, possible desaturation.</td></tr>
<tr><td>Interstitial lung disease</td><td>Rapid shallow breathing, high VE/VCO₂, marked desaturation.</td></tr>
<tr><td>Deconditioning</td><td>Mildly reduced peak VO₂ with everything else normal: VE/VCO₂, O₂ pulse kinetics, ΔVO₂/ΔWR and breathing reserve.</td></tr>
<tr><td>Muscle or mitochondrial</td><td>Very early VT1, HR high for the VO₂, low ΔVO₂/ΔWR, high peak RER, normal breathing reserve [19].</td></tr>
<tr><td>Chronotropic incompetence</td><td>HR reserve over 15 bpm despite RER 1.10 or more; O₂ pulse often high as stroke volume compensates.</td></tr>
<tr><td>Obesity</td><td>Low per kilogram but normal absolute VO₂ and percent predicted; raised unloaded VO₂ with a normal slope.</td></tr></table></div>
<p><b>Heart failure or pulmonary vascular disease?</b> Both raise VE/VCO₂ and flatten the O₂ pulse. PETCO₂ that falls from the start, a slope often above 45 and desaturation favour the pulmonary vessels. Oscillatory ventilation favours the left heart.</p>
<p><b>Heart or deconditioning?</b> Deconditioning has normal efficiency and normal kinetics. Only the size is small. An early VT1 alone is not enough to call the heart abnormal.</p>
<p><b>Heart or muscle?</b> In mitochondrial myopathy the heart over-performs: HR is high for the VO₂ and invasive testing shows a high cardiac output with poor extraction.</p>`,
 try:{scen:'copd',knobs:{},prompt:'Before you look: which panels will show that the lungs, not the heart, limited this man?',
  look:'Panel 1: VE runs into the MVV line. Panel 7: tidal volume plateaus early. Panel 9: PETCO₂ keeps rising (CO₂ retention). Panel 2: HR stops well short of predicted while the O₂ pulse looks normal.'},
 check:[['A patient has early VT1, normal VE/VCO₂, normal O₂ pulse kinetics and HR reaching the predicted maximum. Most likely pattern?','Deconditioning. The chain works normally; the engine is simply small.'],
  ['What finding would make you suspect a right-to-left shunt opening during exercise?','An abrupt fall in PETCO₂ with a simultaneous rise in PETO₂ and a drop in SpO₂, often in pulmonary hypertension with a patent foramen ovale.']],
 say:{prompt:'Explain to a pulmonary fellow how one CPET can show whether their COPD patient is limited by the lungs or the heart.',
  model:'Ask which system ran out of reserve first. If ventilation reached the MVV with less than 15% left, PETCO₂ rose and the heart still had HR reserve and a normal O₂ pulse, the lungs limited. If breathing reserve was ample but HR reached its maximum, the O₂ pulse flattened, ΔVO₂/ΔWR fell and VT1 came early, the heart limited. Both can coexist, and the one that hit its ceiling first is the limiter.'}},

{id:'invasive',n:7,title:'Invasive CPET',sub:'Measuring what the 9 panels infer',
 ask:{q:'A patient\'s cardiac output rises far more than her VO₂ during exercise. What does that suggest?',
  opts:['Low cardiac output heart failure','A problem with oxygen extraction in muscle','Pulmonary hypertension','Chronotropic incompetence'],a:1,why:'If flow is plentiful but VO₂ lags, oxygen is being delivered but not used. That points to the periphery, such as mitochondrial myopathy.'},
 idea:`<p>Invasive CPET adds a pulmonary artery catheter and a radial arterial line to a cycle test. Cardiac output and extraction are now measured directly instead of inferred, which makes it the reference test for unexplained dyspnoea when resting studies are normal [19,20].</p>
<div class="tbl"><table><tr><th>Phenotype</th><th>Exercise signature</th></tr>
<tr><td>HFpEF</td><td>PCWP of 25 mmHg or more during exercise, often with a blunted rise in cardiac output [18].</td></tr>
<tr><td>Exercise pulmonary hypertension</td><td>mPAP/CO slope above 3 mmHg/L/min between rest and exercise. Use PCWP to separate pre- from post-capillary [21].</td></tr>
<tr><td>Low filling pressures ("preload failure")</td><td>Low right atrial pressure and PCWP during exercise with a reduced peak cardiac output. Venous return is insufficient [19].</td></tr>
<tr><td>Peripheral extraction limit</td><td>Normal or high cardiac output, narrow arteriovenous O₂ difference, steep CO/VO₂ relationship.</td></tr></table></div>
<div class="note"><b>A picture to keep.</b> Non-invasive CPET listens to an engine from outside the car. Invasive CPET puts gauges on the fuel line (RA pressure and PCWP), the pump (cardiac output) and the exhaust (mixed venous O₂). Now you can tell "no fuel arriving" from "pump cannot handle the fuel" from "engine cannot burn it".</div>`,
 try:{scen:'mito',knobs:{},prompt:'This young woman has a normal echo. Before you look, predict HR, VT1 and ΔVO₂/ΔWR. Then decide what invasive CPET would show.',
  look:'VT1 is very early, HR climbs steeply and reaches its maximum, ΔVO₂/ΔWR is low, and RER rises high. Non-invasively this can look cardiac. Invasive testing would show a high cardiac output for the VO₂ and a narrow arteriovenous O₂ difference: an extraction problem.'},
 check:[['Why does a steep CO/VO₂ relationship point away from the heart?','The heart is delivering more flow than usual for each litre of oxygen used. Delivery is not the problem; use of oxygen is.'],
  ['PCWP rises from 12 to 31 mmHg at 40 W. Why was the resting study insufficient?','Resting pressures can be normal in early HFpEF. The stiff ventricle only shows itself when flow increases, which is why exercise haemodynamics improve diagnosis [18].']],
 say:{prompt:'Using the car picture, explain the four invasive phenotypes to a resident.',
  model:'HFpEF: the pump cannot accept more fuel without the pressure in the fuel line rising sharply. Exercise pulmonary hypertension: the road between the pump and the lungs is too narrow, so pressure rises steeply with flow. Low filling pressures: not enough fuel arrives at the pump. Extraction limit: the pump delivers plenty of fuel, but the engine cannot burn it.'}},

{id:'uses',n:8,title:'Where CPET changes decisions',sub:'Advanced heart failure and beyond',
 ask:{q:'A 45-year-old woman on a beta-blocker has peak VO₂ 13.5 mL/kg/min at RER 1.12, which is 48% of predicted. Does she meet an ISHLT CPET listing criterion?',
  opts:['No, she is above 12','Yes, through percent predicted','Only if VE/VCO₂ is above 35','Only if she stops the beta-blocker'],a:1,why:'In women and in patients under 50, ISHLT 2016 allows a percent predicted peak VO₂ of 50% or less to be used alongside the absolute threshold [5].'},
 idea:`<p><b>Transplant and LVAD timing.</b> The original 14 mL/kg/min threshold came from Mancini and colleagues: ambulatory patients above it had survival similar to that after transplant, so listing could be deferred [7]. Beta-blockers improved survival at any given peak VO₂, and the 2016 ISHLT criteria moved the threshold to 12 mL/kg/min on beta-blockade [5]:</p>
<div class="tbl"><table><tr><th>Situation</th><th>Criterion</th></tr>
<tr><td>Maximal test</td><td>RER 1.05 or more, VT1 reached, on optimal therapy</td></tr>
<tr><td>On beta-blocker</td><td>Peak VO₂ 12 mL/kg/min or less</td></tr>
<tr><td>Beta-blocker intolerant</td><td>Peak VO₂ 14 mL/kg/min or less</td></tr>
<tr><td>Women, or age under 50</td><td>Also consider 50% of predicted or less</td></tr>
<tr><td>Submaximal (RER under 1.05)</td><td>VE/VCO₂ slope above 35 may be considered</td></tr>
<tr><td>BMI above 30</td><td>Lean body mass-adjusted peak VO₂ under 19 mL/kg/min</td></tr></table></div>
<p>The 2024 ISHLT candidate guideline updates the broader evaluation [6]. In patients on contemporary therapy, the classic thresholds discriminate less well, and lower cut-offs (peak VO₂ 10 or less, VE/VCO₂ above 40) performed better in one cohort [23]. Use CPET with risk scores, haemodynamics and the trend between tests. Weber and ventilatory classes are stronger together than apart [16].</p>
<p><b>Pulmonary hypertension.</b> ESC/ERS 2022 risk thresholds: low risk with peak VO₂ above 15 mL/kg/min and VE/VCO₂ slope below 36; high risk with peak VO₂ below 11 or a slope of 45 or more [21].</p>
<p><b>HFpEF and unexplained dyspnoea.</b> CPET separates heart, lungs, pulmonary vessels, muscle and fitness in one test, and points to who needs invasive haemodynamics [3,17].</p>
<p><b>Hypertrophic cardiomyopathy, valve disease and congenital heart disease.</b> CPET quantifies symptoms that patients under-report, shows an abnormal blood pressure response or O₂ pulse plateau, and tracks decline between tests. Adults with a Fontan circulation commonly reach only half to two-thirds of predicted peak VO₂ while describing themselves as well, so serial testing is the objective record [2,3].</p>
<p><b>Before major surgery.</b> An anaerobic threshold under 11 mL/kg/min identified elderly patients at higher risk after major abdominal surgery [22]. The 2016 update added a pre-surgical algorithm [3].</p>`,
 try:{scen:'fontan',knobs:{},prompt:'This man with a Fontan circulation says he feels well. Predict peak VO₂ as percent predicted, his HR response and his SpO₂ before you look.',
  look:'About 50 to 55% of predicted, chronotropic incompetence, a VE/VCO₂ slope in class III, and desaturation from the fenestration. His symptoms do not reflect his limitation, which is why the trend between tests matters.'},
 check:[['Why did the transplant threshold move from 14 to 12 mL/kg/min?','Beta-blockers improved survival at the same peak VO₂, and they blunt the HR response, so a lower threshold was needed to identify the same level of risk [5,7].'],
  ['A 130 kg man has peak VO₂ 15 mL/kg/min at RER 1.15. Name three things to check before deciding about listing.','Absolute VO₂ and percent predicted by ideal or lean body weight; lean mass-adjusted peak VO₂ against the threshold of 19; the VE/VCO₂ slope and other markers. Also beta-blocker status and the trend over time.']],
 say:{prompt:'Write the referral question, the key variables and the report sentence for one use case of your choice.',
  model:'Referral: is this patient with HFrEF ready for advanced therapy evaluation? Variables: peak RER, peak VO₂ and percent predicted, VE/VCO₂ slope, oscillatory ventilation, PETCO₂. Sentence: maximal test (RER 1.12); peak VO₂ 11.2 mL/kg/min (46% predicted) on a beta-blocker, VE/VCO₂ slope 42 with oscillatory ventilation; meets ISHLT CPET criteria; proceed with transplant and LVAD evaluation.'}},

{id:'limits',n:9,title:'When the test misleads',sub:'Limitations and pitfalls',
 ask:{q:'The same patient\'s peak VO₂ is 82% of predicted in one laboratory and 68% in another, on the same day. What is the most likely explanation?',
  opts:['Day-to-day variability','Different reference equations','Calibration drift','Different mask sizes'],a:1,why:'Reference equations differ by 10 to 20% for the same person. Always name the equation and use the same one for serial tests [15].'},
 idea:`<div class="tbl"><table><tr><th>Pitfall</th><th>Defence</th></tr>
<tr><td>Submaximal effort reads as disease</td><td>Check RER, Borg and reserves. Use the measures that do not depend on effort [12,13].</td></tr>
<tr><td>Reference equations disagree</td><td>Name the equation. Keep it the same for serial tests [15].</td></tr>
<tr><td>Body size</td><td>In obesity use percent predicted, absolute VO₂ and lean or ideal weight [5].</td></tr>
<tr><td>Cycle versus treadmill</td><td>Treadmill peak VO₂ is usually higher. Compare like with like [1].</td></tr>
<tr><td>Ramp too short or too long</td><td>Aim for 8 to 12 minutes [4].</td></tr>
<tr><td>Averaging window</td><td>Report it. Peak values change with the window [1].</td></tr>
<tr><td>Hyperventilation at rest</td><td>Inspect the rest phase; use nadir VE/VCO₂ and PETCO₂ behaviour [15].</td></tr>
<tr><td>VT1 detection varies between readers</td><td>Use at least two methods; report "indeterminate" when it is [13].</td></tr>
<tr><td>Beta-blockers, ivabradine, atrial fibrillation</td><td>Report them; use beta-blocker-specific thresholds [5].</td></tr>
<tr><td>Thresholds set before modern therapy</td><td>Combine CPET with scores, haemodynamics and trend [23].</td></tr>
<tr><td>CPET shows which system, not always why</td><td>Add imaging, exercise echo, invasive CPET or exercise flow-volume loops [3,19].</td></tr>
<tr><td>Symptoms are ignored</td><td>Record Borg dyspnoea and leg effort through the test and relate them to VE [15].</td></tr></table></div>`,
 try:{scen:'obese',knobs:{},prompt:'The surgeon\'s report says "severely reduced 20.7 mL/kg/min". Before you look, predict absolute VO₂, percent predicted and the O₂ pulse.',
  look:'Absolute VO₂ is about 2.6 L/min and roughly 90% of predicted. The O₂ pulse is normal and keeps rising. The unloaded VO₂ is raised, but the slope against work is normal. The heart is normal; the denominator is the problem.'},
 check:[['Why is mL/kg/min misleading in obesity?','Adipose tissue adds weight but uses little oxygen during exercise, so dividing by total weight underestimates the capacity of the cardiopulmonary system.'],
  ['Which three pitfalls are most dangerous in a heart failure clinic?','Misreading a submaximal test as severe disease, applying thresholds without regard to beta-blockers, sex, age or body size, and ignoring the trend between tests in favour of one number.']],
 say:{prompt:'Explain to a colleague why two CPET reports on the same patient can disagree.',
  model:'Different reference equations, different modalities (cycle or treadmill), different ramp lengths and different averaging windows all change the reported numbers. Effort and medications on the day also matter. To compare tests, keep the protocol, modality and equation the same, and look at the measures that do not depend on effort.'}}
];

/* ───────────────────────── 5. Cases ───────────────────────── */
const CASES=[
 {t:'The transplant question',scen:'hfref',v:'52-year-old man, ischaemic cardiomyopathy, LVEF 18%, NYHA III, on carvedilol, sacubitril/valsartan, spironolactone, dapagliflozin and an ICD. Two heart failure admissions in six months. Cycle ramp 10 W/min, stopped for dyspnoea and leg fatigue at 9.5 minutes.',
  d:[['Peak VO₂','11.2 mL/kg/min (46% predicted)'],['Peak RER','1.12'],['VT1','7.0 mL/kg/min'],['VE/VCO₂ slope','42'],['PETCO₂ at rest','30 mmHg, rises 1 mmHg'],['O₂ pulse','Flat from minute 4, 54% predicted'],['Peak HR','118 bpm on beta-blocker'],['Breathing reserve','48%'],['Oscillatory ventilation','Present for the first half of exercise']],
  s:[['Can this test be used for listing?','Yes. RER 1.12 with VT1 reached on optimal therapy meets the ISHLT definition of a maximal test [5].'],
   ['Which system limited?','Cardiovascular. The O₂ pulse is flat and low, VT1 is early, and VE/VCO₂ is high with low PETCO₂. Breathing reserve is ample.'],
   ['How would you classify risk?','Weber class C and ventilatory class III, with oscillatory ventilation and low resting PETCO₂. Several adverse markers together carry more weight than any single one [9,11,16].'],
   ['Answer the referral.','Meets the ISHLT CPET criterion of peak VO₂ 12 mL/kg/min or less on a beta-blocker. With recurrent admissions, proceed with advanced therapy evaluation, including right heart catheterisation and frailty assessment.']]},
 {t:'Submaximal but still useful',v:'58-year-old woman, non-ischaemic cardiomyopathy, LVEF 22%, on metoprolol. Stopped at 5 minutes because of knee pain.',
  d:[['Peak VO₂','13.8 mL/kg/min'],['Peak RER','0.98'],['VT1','Not clearly identified'],['VE/VCO₂ slope','39'],['OUES','Low'],['PETCO₂ at rest','31 mmHg']],
  s:[['Can you use peak VO₂?','No. With RER 0.98 the test is submaximal; 13.8 underestimates her true capacity and cannot be compared with the threshold of 12.'],
   ['What can you still use?','The VE/VCO₂ slope of 39 exceeds 35, which ISHLT allows as supportive evidence when RER is below 1.05 [5]. A low OUES and low PETCO₂ point the same way [12].'],
   ['What next?','Treat her as high risk. Consider repeating the test with another modality, right heart catheterisation and risk scores. Report percent predicted peak VO₂, since she is a woman.']]},
 {t:'Lungs or heart?',scen:'copd',v:'65-year-old man, 45 pack-years, FEV₁ 1.1 L (38% predicted), LVEF 50%. Stopped because of breathlessness.',
  d:[['Peak VO₂','16.0 mL/kg/min (59%)'],['Peak RER','1.02'],['Peak HR','126 bpm (predicted 155)'],['Peak VE / MVV','40 / 42 L/min, reserve 4%'],['VE/VCO₂ slope','34'],['PETCO₂','38 rising to 41 mmHg'],['SpO₂','95 falling to 90%']],
  s:[['Is this poor effort?','No. RER is low and HR reserve is large, but that is expected when ventilation runs out first. The ventilatory pump reached its ceiling.'],
   ['Which system?','Ventilatory mechanics. Breathing reserve 4%, VE at MVV, rising PETCO₂ and modest desaturation. The heart still had reserve.'],
   ['What does this change?','Optimise lung treatment and refer to pulmonary rehabilitation. A cardiac cause is unlikely to be the main limitation. An exercise flow-volume loop would document expiratory flow limitation [3].']]},
 {t:'The HFpEF puzzle',scen:'hfpef',v:'68-year-old woman, BMI 38, hypertension, paroxysmal AF, exertional dyspnoea. Echo: LVEF 60%, E/e’ 11, mildly dilated left atrium. Normal spirometry. NT-proBNP 220 pg/mL.',
  d:[['Peak VO₂','13.0 mL/kg/min (74% predicted by ideal weight)'],['Peak RER','1.14'],['Peak HR','116 bpm (predicted 152), chronotropic index 0.56'],['VE/VCO₂ slope','34'],['O₂ pulse','Flattens in the final third'],['Breathing reserve','35%']],
  s:[['Is it normal?','No. Capacity is reduced despite maximal effort. The lungs had reserve. There is chronotropic incompetence and a stroke volume plateau, a cardiovascular pattern [17].'],
   ['What can the non-invasive test not tell you?','Whether filling pressures or pulmonary pressures rise with exercise, or whether extraction is the problem.'],
   ['What next?','Invasive CPET or exercise right heart catheterisation. Exercise PCWP of 25 mmHg or more confirms HFpEF [18]; assess the mPAP/CO slope as well [21]. Review whether rate-controlling drugs are contributing.']]},
 {t:'Falling end-tidal CO₂',scen:'pah',v:'45-year-old woman, progressive dyspnoea, one syncopal episode, normal left ventricle on echo.',
  d:[['Peak VO₂','13.6 mL/kg/min (54%)'],['VE/VCO₂ slope','50'],['PETCO₂','28 falling to 25 mmHg from the start'],['SpO₂','96 falling to 86%'],['O₂ pulse','Early plateau'],['Breathing reserve','40%']],
  s:[['Which pattern?','Pulmonary vascular disease. Very steep VE/VCO₂, PETCO₂ that falls from the onset, desaturation and an early stroke volume plateau, with normal lung mechanics.'],
   ['Why does she desaturate?','A low mixed venous O₂ (low output with high extraction) through ventilation-perfusion mismatch, possibly with right-to-left shunting through a patent foramen ovale as right-sided pressure rises.'],
   ['Risk category?','A VE/VCO₂ slope of 45 or more is in the ESC/ERS high-risk range; peak VO₂ 13.6 is intermediate [21]. Proceed to right heart catheterisation and a V/Q scan.']]},
 {t:'Early threshold, normal heart',scen:'mito',v:'34-year-old woman, lifelong exercise intolerance, myalgia, mild ptosis. Normal echo and coronary CT. Referred as possible cardiomyopathy.',
  d:[['Peak VO₂','16.9 mL/kg/min (51%)'],['VT1','32% of predicted peak'],['Peak RER','1.38'],['HR','Rises steeply, reaches 178 (predicted 186)'],['ΔVO₂/ΔWR','7.0 mL/min/W'],['Breathing reserve','Normal']],
  s:[['Why not heart failure?','The heart over-performs. HR is high for the VO₂ and there is no sign of pulmonary congestion. The very early VT1 and very high RER suggest muscle that switches to anaerobic metabolism early.'],
   ['How would you confirm it?','Invasive CPET: high cardiac output for the VO₂, a narrow arteriovenous O₂ difference and a high mixed venous saturation. Then a neuromuscular workup.'],
   ['The lesson','An early VT1 means something in delivery or use of oxygen failed early, not necessarily the heart. Peripheral limitation is easy to miss.']]},
 {t:'The obese "low VO₂"',scen:'obese',v:'40-year-old man, 128 kg. The report reads "severely reduced, 20.7 mL/kg/min".',
  d:[['Peak VO₂','2.65 L/min; 20.7 mL/kg/min'],['Percent predicted (ideal weight)','About 91%'],['Peak RER','1.18'],['O₂ pulse','Normal, rising'],['ΔVO₂/ΔWR','10.2 with a raised unloaded VO₂'],['VE/VCO₂ slope','27']],
  s:[['Is cardiac function reduced?','No. Absolute VO₂ and percent predicted are normal. Dividing by total body weight is misleading.'],
   ['Why is unloaded VO₂ high?','Moving heavy legs costs oxygen even at zero watts, so the VO₂ line shifts upward while its slope stays normal.'],
   ['Relevance to transplant?','ISHLT suggests lean mass-adjusted peak VO₂ below 19 mL/kg/min in obesity. Check it against percent predicted [5].']]},
 {t:'"I feel fine" after Fontan',scen:'fontan',v:'28-year-old man, extracardiac Fontan with fenestration, working full time, no symptoms.',
  d:[['Peak VO₂','22.3 mL/kg/min (54% predicted)'],['Peak HR','148 bpm (predicted 192)'],['VE/VCO₂ slope','37'],['SpO₂','94 falling to 87%'],['O₂ pulse','Plateau at 70% predicted'],['Previous year','25.1 mL/kg/min']],
  s:[['What is abnormal?','Capacity about half of predicted, chronotropic incompetence, ventilatory inefficiency, desaturation through the fenestration, and a stroke volume plateau because there is no subpulmonary ventricle to raise preload.'],
   ['Why does the trend matter?','People with a Fontan circulation adapt to their limits and under-report symptoms. An 11% fall in peak VO₂ in a year is an objective sign of decline and should prompt a review of Fontan pressures, liver, lymphatics and rhythm, and an early conversation about advanced therapies.']]}
];

/* ───────────────────────── 6. Review cards ───────────────────────── */
const CARDS=[
 ['Fick equation for VO₂','VO₂ = HR × SV × (CaO₂ − CvO₂)'],
 ['O₂ pulse approximates','Stroke volume × extraction; it tracks stroke volume during exercise'],
 ['Normal ΔVO₂/ΔWR on a cycle ramp','About 10 mL/min/W (8.5 to 11); under 8.4 is abnormal'],
 ['Why RER exceeds 1.0 at high work','Bicarbonate buffering of lactic acid releases extra CO₂'],
 ['Peak RER for good effort; ISHLT definition','1.10 or more; ISHLT accepts 1.05 with VT1 reached'],
 ['At VT1: VE/VO₂, VE/VCO₂, PETO₂, PETCO₂','VE/VO₂ and PETO₂ rise; VE/VCO₂ and PETCO₂ stay flat'],
 ['At the respiratory compensation point','VE/VCO₂ rises and PETCO₂ falls'],
 ['VE/VCO₂ equation','863 / [PaCO₂ × (1 − VD/VT)]'],
 ['Two mechanisms that raise VE/VCO₂','More dead space; lower PaCO₂ set point'],
 ['Ventilatory classes','I under 30; II 30 to 35.9; III 36 to 44.9; IV 45 or more'],
 ['Weber classes (peak VO₂)','A above 20; B 16 to 20; C 10 to 16; D under 10 mL/kg/min'],
 ['Normal VT1','Above 40% of predicted peak VO₂'],
 ['Resting PETCO₂ and its rise to VT1','36 to 42 mmHg; rises 3 to 8 mmHg'],
 ['PETCO₂ falling from the start of exercise','Suggests pulmonary vascular disease'],
 ['Breathing reserve threshold for ventilatory limitation','Under 15% (or under 11 L/min); MVV ≈ FEV₁ × 35 to 40'],
 ['Chronotropic incompetence','HR reserve over 15 bpm at RER 1.10 or more; chronotropic index under 0.8 (0.62 on beta-blockers)'],
 ['ISHLT peak VO₂ threshold on and off beta-blockers','12 or less on; 14 or less if intolerant'],
 ['ISHLT criterion in women and patients under 50','Also consider 50% of predicted or less'],
 ['ISHLT criterion when RER is under 1.05','VE/VCO₂ slope above 35 may be considered'],
 ['ISHLT criterion with BMI above 30','Lean mass-adjusted peak VO₂ under 19 mL/kg/min'],
 ['Origin of the 14 mL/kg/min threshold','Mancini 1991: above 14, survival matched that after transplant'],
 ['Oscillatory ventilation: cause and meaning','Long circulation time plus high chemoreflex gain; adverse prognosis in heart failure'],
 ['OUES','Slope of VO₂ against log₁₀ VE; does not depend on maximal effort'],
 ['Measures that do not need maximal effort','VT1, VE/VCO₂ slope, OUES, PETCO₂, ΔVO₂/ΔWR, oscillatory ventilation'],
 ['Ischaemia on CPET','Late flattening of ΔVO₂/ΔWR with an O₂ pulse plateau or fall'],
 ['COPD on CPET','Low breathing reserve, VE near MVV, rising PETCO₂, large HR reserve'],
 ['Interstitial lung disease on CPET','Rapid shallow breathing, high VE/VCO₂, marked desaturation'],
 ['Mitochondrial myopathy on CPET','Very early VT1, HR high for VO₂, low ΔVO₂/ΔWR, high RER; invasive: high CO for VO₂'],
 ['Deconditioning on CPET','Mildly low peak VO₂, everything else normal'],
 ['HFpEF on invasive testing','Exercise PCWP 25 mmHg or more'],
 ['Exercise pulmonary hypertension (ESC/ERS 2022)','mPAP/CO slope above 3 mmHg/L/min'],
 ['Low filling pressure phenotype','Low RA pressure and PCWP with low peak cardiac output'],
 ['ESC/ERS PAH high-risk CPET values','Peak VO₂ under 11 mL/kg/min; VE/VCO₂ slope 45 or more'],
 ['Target ramp duration','8 to 12 minutes'],
 ['Why mL/kg/min misleads in obesity','Fat adds weight but uses little O₂; use absolute VO₂ and percent predicted'],
 ['Alveolar gas equation (simplified)','PAO₂ ≈ PIO₂ − PACO₂/RER'],
 ['Pre-operative AT threshold (Older 1993)','Under 11 mL/kg/min marked higher risk'],
 ['The six reading questions','Valid, effort, capacity, system, prognosis, answer'],
 ['Abnormal HR recovery at one minute','12 bpm or less'],
 ['Classic nine-panel groups','Heart 2, 3, 5; pump 1, 4, 7; gas exchange 6, 8, 9']
];


/* ───────────────────────── 7. How to cite ───────────────────────── */
const META={name:'CPET Lab',version:'1.0',year:2026,author:'Parcha, Vibhu',authorShort:'Parcha V',url:'https://torsades-de-pointes.github.io/cpet-lab/',repo:'https://github.com/torsades-de-pointes/cpet-lab'};
function citeBlock(){
 const d=new Date(),acc=d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),iso=d.toISOString().slice(0,10);
 const ama=META.authorShort+'. '+META.name+': cardiopulmonary exercise testing simulator and course. Version '+META.version+'. Published '+META.year+'. Accessed '+acc+'. '+META.url;
 const apa='Parcha, V. ('+META.year+'). '+META.name+': Cardiopulmonary exercise testing simulator and course (Version '+META.version+') [Computer software]. '+META.url;
 const bib='@software{cpetlab'+META.year+',\n  title   = {'+META.name+': Cardiopulmonary Exercise Testing Simulator and Course},\n  author  = {'+META.author+'},\n  year    = {'+META.year+'},\n  version = {'+META.version+'},\n  url     = {'+META.url+'},\n  urldate = {'+iso+'},\n  note    = {Open-source educational simulator of the nine-panel CPET plot. MIT License.}\n}';
 return {ama,apa,bib};
}

root.CPET={META,citeBlock,BASE,SCENARIOS,makeParams,healthyTwin,simulate,metrics,metricRows,interpret,weber,vclass,plot,PANELS,panelSpecs,REFS,cite,CHAPTERS,CASES,CARDS};
})(typeof window!=='undefined'?window:globalThis);
