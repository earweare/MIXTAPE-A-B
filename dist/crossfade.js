'use strict';
let fadeFrame=0,fadeToken=0;
function fadeDuration(){const n=Number($('#fade-ms').value);return Number.isFinite(n)?Math.round(Math.max(0,Math.min(3600000,n))):5000}
function saveFadeDuration(){$('#fade-ms').value=fadeDuration();try{localStorage.setItem('mixtape-ab-fade-ms',$('#fade-ms').value)}catch{}}
try{const raw=localStorage.getItem('mixtape-ab-fade-ms');if(raw!==null){$('#fade-ms').value=raw;$('#fade-ms').value=fadeDuration()}}catch{}
function cancelFade(){fadeToken++;if(fadeFrame)cancelAnimationFrame(fadeFrame);fadeFrame=0;$('#fade-a').classList.remove('fading');$('#fade-b').classList.remove('fading')}
function startFade(target){cancelFade();saveFadeDuration();const token=fadeToken,start=+$('#cross').value,duration=fadeDuration(),began=performance.now();if(!duration||start===target){$('#cross').value=target;mix();return}$(target===0?'#fade-a':'#fade-b').classList.add('fading');function frame(now){if(token!==fadeToken)return;const progress=Math.min(1,(now-began)/duration);$('#cross').value=start+(target-start)*progress;mix(false);if(progress<1)fadeFrame=requestAnimationFrame(frame);else{cancelFade();persist();}}fadeFrame=requestAnimationFrame(frame)}
$('#cross').step='0.01';$('#cross').oninput=()=>{cancelFade();mix()};$('#center').onclick=()=>{cancelFade();$('#cross').value=50;mix()};$('#fade-a').onclick=()=>startFade(0);$('#fade-b').onclick=()=>startFade(100);$('#fade-ms').onchange=saveFadeDuration;
