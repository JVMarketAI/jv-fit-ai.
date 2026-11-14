
/* JV FIT AI Share Studio V3 — additive, no changes to workout storage or backups. */
(()=>{'use strict';
const KEY='jvfit_personal_v1';let selected=null,mode='overlay',theme='dark',photo=null,canvas=null;
const $=id=>document.getElementById(id);
const css=`
#jvshare-modal{position:fixed;inset:0;z-index:9999;background:#0009;display:none;align-items:flex-start;justify-content:center;overflow:auto;padding:18px 12px 80px}
#jvshare-modal.open{display:flex}#jvshare-panel{background:#fff;color:#222;width:min(440px,100%);border-radius:18px;padding:16px;box-shadow:0 12px 45px #0005;font-family:-apple-system,BlinkMacSystemFont,sans-serif}
#jvshare-panel button{border-radius:10px;padding:11px 12px;border:1px solid #ddd;background:#fff;color:#222;font-weight:650;font-size:14px}
#jvshare-panel button.primary{background:#fc4c02;color:white;border-color:#fc4c02}#jvshare-panel .jvrow{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}#jvshare-panel .jvrow>*{flex:1}
#jvshare-panel label{color:#333;font-size:13px}#jvshare-panel select,#jvshare-panel input{background:white;color:#222;border:1px solid #ddd;width:100%;padding:10px;border-radius:9px;margin:5px 0 12px}
#jvshare-preview{display:block;width:min(100%,270px);height:auto;margin:12px auto;border:1px solid #ddd;background:repeating-conic-gradient(#ddd 0% 25%,#fff 0% 50%) 50%/20px 20px}
.jv-share-launch{margin:8px 14px 14px;background:#fff7f2!important;color:#c64508!important;border:1px solid #f3c8b7!important;border-radius:9px!important;padding:10px 14px!important;font-size:14px!important;font-weight:750!important}
`;
const style=document.createElement('style');style.textContent=css;document.head.append(style);
const modal=document.createElement('div');modal.id='jvshare-modal';modal.innerHTML=`<section id="jvshare-panel" role="dialog" aria-modal="true" aria-label="JV FIT AI Share Studio"><div style="display:flex;justify-content:space-between;align-items:center"><b>⚡ JV FIT AI · Share Studio</b><button id="jvshare-close" aria-label="Close">✕</button></div><p style="font-size:13px;color:#666">Choose a style and save a story-ready PNG. Your workout data stays on this device.</p><label for="jvshare-mode">Design</label><select id="jvshare-mode"><option value="overlay">Transparent stats overlay</option><option value="card">Branded workout card</option></select><label for="jvshare-theme">Card theme</label><select id="jvshare-theme"><option value="dark">Dark</option><option value="light">Light</option></select><label for="jvshare-photo">Optional photo background (card only)</label><input id="jvshare-photo" type="file" accept="image/*"><canvas id="jvshare-preview" width="1080" height="1920"></canvas><div class="jvrow"><button class="primary" id="jvshare-save">⬇ Save PNG</button><button id="jvshare-send">↗ iPhone Share</button></div><small style="color:#666">Transparent PNGs work as overlays in editors that support transparency. The iPhone share sheet may flatten transparency in some destinations. No GPS map is generated without route data.</small></section>`;document.body.append(modal);canvas=$('jvshare-preview');
function getEntries(){try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a:[]}catch{return []}}
function dateLabel(d){const a=new Date(d+'T12:00:00');return Number.isNaN(+a)?String(d):a.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
function pace(e){const d=Number(e.distance),m=Number(e.duration);if(!(d>0&&m>0))return '—';const sec=Math.round(m*60/d);return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}/mi`}
function draw(){if(!selected)return;const ctx=canvas.getContext('2d');const W=1080,H=1920;ctx.clearRect(0,0,W,H);const dark=theme==='dark',fg=mode==='overlay'?'#fff':dark?'#fff':'#1b1b1b',accent='#fc4c02';if(mode==='card'){
ctx.fillStyle=dark?'#0e1722':'#f6f4f1';ctx.fillRect(0,0,W,H);
if(photo){const scale=Math.max(W/photo.width,H/photo.height);ctx.drawImage(photo,(W-photo.width*scale)/2,(H-photo.height*scale)/2,photo.width*scale,photo.height*scale);const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,'#0009');grad.addColorStop(.5,'#0005');grad.addColorStop(1,'#000d');ctx.fillStyle=grad;ctx.fillRect(0,0,W,H)}
ctx.fillStyle=accent;ctx.fillRect(0,0,W,20);}
const color=photo?'#fff':fg;ctx.fillStyle=color;ctx.font='bold 60px -apple-system,Arial';ctx.fillText('⚡ JV FIT AI',75,160);
ctx.font='bold 42px -apple-system,Arial';ctx.fillStyle=mode==='card'&&!photo?accent:color;ctx.fillText(String(selected.type||'Workout').toUpperCase(),75,mode==='overlay'?1180:700);
const start=mode==='overlay'?1265:820;
if(mode==='overlay'){const g=ctx.createLinearGradient(0,1100,0,1900);g.addColorStop(0,'#0000');g.addColorStop(.5,'#0007');g.addColorStop(1,'#000a');ctx.fillStyle=g;ctx.fillRect(0,1100,W,820)}
ctx.fillStyle=color;ctx.font='bold 126px -apple-system,Arial';ctx.fillText(Number(selected.distance)>0?Number(selected.distance).toFixed(2)+' MI':String(selected.duration)+' MIN',75,start);
ctx.font='bold 62px -apple-system,Arial';ctx.fillText(`${selected.duration} MIN`,75,start+120);
ctx.font='50px -apple-system,Arial';ctx.fillText(Number(selected.distance)>0?'PACE  '+pace(selected):'WORKOUT COMPLETE',75,start+210);
if(selected.hr!=null&&Number(selected.hr)>0)ctx.fillText('AVG HR  '+selected.hr+' BPM',75,start+290);
ctx.font='38px -apple-system,Arial';ctx.fillText(dateLabel(selected.date),75,mode==='overlay'?1820:1600);
ctx.font='bold 36px -apple-system,Arial';ctx.fillText('@officialjv707',75,mode==='overlay'?1880:1770);
}
function openFor(e){selected=e;photo=null;$('jvshare-photo').value='';$('jvshare-modal').classList.add('open');draw()}
function refreshButtons(){document.querySelectorAll('.feedcard').forEach((card,i)=>{if(card.querySelector('.jv-share-launch'))return;const list=getEntries().sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,10);const e=list[i];if(!e)return;const btn=document.createElement('button');btn.className='jv-share-launch';btn.textContent='↗ Share workout';btn.addEventListener('click',()=>openFor(e));card.append(btn)});
document.querySelectorAll('#history .activity').forEach((card,i)=>{if(card.querySelector('.jv-share-launch'))return;const list=getEntries().sort((a,b)=>String(b.date).localeCompare(String(a.date)));const e=list[i];if(!e)return;const btn=document.createElement('button');btn.className='jv-share-launch';btn.textContent='↗ Share';btn.addEventListener('click',()=>openFor(e));card.append(btn)})}
$('jvshare-close').onclick=()=>$('jvshare-modal').classList.remove('open');modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});$('jvshare-mode').onchange=e=>{mode=e.target.value;draw()};$('jvshare-theme').onchange=e=>{theme=e.target.value;draw()};$('jvshare-photo').onchange=e=>{const f=e.target.files?.[0];if(!f){photo=null;draw();return}const url=URL.createObjectURL(f),img=new Image();img.onload=()=>{photo=img;URL.revokeObjectURL(url);draw()};img.onerror=()=>{URL.revokeObjectURL(url);alert('Could not open photo')};img.src=url};
const png=()=>new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('PNG export failed')),'image/png'));
$('jvshare-save').onclick=async()=>{try{const b=await png(),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='JV-FIT-AI-'+(selected?.date||'workout')+'.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),15000)}catch(e){alert(e.message)}};
$('jvshare-send').onclick=async()=>{try{const b=await png(),file=new File([b],'JV-FIT-AI.png',{type:'image/png'});if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:'JV FIT AI workout'})}else{alert('Direct file sharing is not available here. Use Save PNG, then share from Photos or Files.')}}catch(e){if(e.name!=='AbortError')alert(e.message)}};
const observer=new MutationObserver(()=>{clearTimeout(observer._t);observer._t=setTimeout(refreshButtons,80)});observer.observe(document.body,{subtree:true,childList:true});refreshButtons();
})();
