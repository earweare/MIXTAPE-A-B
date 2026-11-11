'use strict';
const bankKey='mixtape-ab-bank-v1';
let selectedMixtape='';
function readBank(){
  const raw=localStorage.getItem(bankKey);
  if(!raw)return [];
  const bank=JSON.parse(raw);
  if(!Array.isArray(bank)||!bank.every(t=>typeof t.id==='string'&&typeof t.name==='string'&&t.decks?.length===2&&t.decks.every(d=>typeof d.list==='string'&&/^[-\w]+$/.test(d.list)&&Number.isInteger(d.index)&&d.index>=0&&Number.isFinite(d.volume)&&Number.isFinite(d.rate))&&Number.isFinite(t.cross)&&Number.isFinite(t.master)))throw Error('La banque de mixtapes est illisible. Elle a été conservée sans modification.');
  return bank;
}
function bankError(error){return error instanceof SyntaxError?'La banque de mixtapes est illisible. Elle a été conservée sans modification.':error.message||'Enregistrement impossible dans ce navigateur.'}
function populateBank(bank,selection=''){
  const menu=$('#mixtape-menu');menu.replaceChildren();const first=document.createElement('option');first.value='';first.textContent=bank.length?'Rappeler une mixtape…':'Mes mixtapes';menu.append(first);
  [...bank].sort((a,b)=>a.name.localeCompare(b.name,'fr')).forEach(t=>{const o=document.createElement('option');o.value=t.id;o.textContent=t.name;menu.append(o)});menu.value=selection;
}
function captureMixtape(name,id){return {id,name,updatedAt:new Date().toISOString(),fadeMs:fadeDuration(),cross:+$('#cross').value,master:+$('#master').value,decks:decks.map(d=>({list:d.list,index:Math.max(0,d.player.getPlaylistIndex()),video:d.player.getVideoData()?.video_id||d.video,volume:+d.volume.value,rate:d.player.getPlaybackRate()||1,loop:savedLoop(d)}))}}
function recallMixtape(t){
  if(!decks.every(d=>d.ready))throw Error('Attendez le chargement des deux lecteurs.');
  cancelFade();$('#fade-ms').value=Number.isFinite(t.fadeMs)?Math.max(0,Math.min(3600000,t.fadeMs)):5000;saveFadeDuration();
  decks.forEach(d=>d.player.pauseVideo());
  $('#cross').value=clamp(t.cross,50);$('#master').value=clamp(t.master,80);
  decks.forEach((d,i)=>{const v=t.decks[i];restoreLoop(d,v.loop);d.previousIds=d.ids.join();Object.assign(d,{list:v.list,index:v.index,video:v.video||'',pendingRate:v.rate,restoreVideo:v.video||''});refreshPlaylistTitle(d);d.volume.value=clamp(v.volume,85);d.volume.nextElementSibling.textContent=d.volume.value+'%';const url='https://www.youtube.com/playlist?list='+v.list;d.root.querySelector('input[type=url]').value=url;d.root.querySelector('a').href=url;d.ids=[];d.tracks.replaceChildren();d.count.textContent='Chargement…';d.player.cuePlaylist({listType:'playlist',list:v.list,index:v.index});status(d,'Mixtape rappelée · prête à lire.');});
  mix();selectedMixtape=t.id;$('#mixtape-notice').textContent='« '+t.name+' » rappelée';
}
$('#save-mixtape').onclick=()=>{try{const bank=readBank();$('#mixtape-name').value=bank.find(t=>t.id===selectedMixtape)?.name||'';$('#save-notice').textContent='';$('#save-dialog').showModal();$('#mixtape-name').focus();$('#mixtape-name').select();updateSaveLabel()}catch(e){$('#mixtape-notice').textContent=bankError(e)}};
function updateSaveLabel(){try{const name=$('#mixtape-name').value.trim();const existing=readBank().some(t=>t.name.toLocaleLowerCase('fr')===name.toLocaleLowerCase('fr'));$('#confirm-save').textContent=existing?'Remplacer':'Enregistrer';$('#save-notice').textContent=existing?'Une mixtape porte déjà ce nom. Ses réglages seront remplacés.':''}catch(e){$('#save-notice').textContent=bankError(e)}}
$('#mixtape-name').oninput=updateSaveLabel;
$('#cancel-save').onclick=()=>$('#save-dialog').close();
$('#save-form').onsubmit=e=>{e.preventDefault();try{const name=$('#mixtape-name').value.trim();if(!name)throw Error('Saisissez un nom pour la mixtape.');if(!decks.every(d=>d.ready))throw Error('Attendez le chargement des deux lecteurs.');const bank=readBank();const existing=bank.findIndex(t=>t.name.toLocaleLowerCase('fr')===name.toLocaleLowerCase('fr'));const id=existing>=0?bank[existing].id:crypto.randomUUID();const tape=captureMixtape(name,id);if(existing>=0)bank[existing]=tape;else bank.push(tape);localStorage.setItem(bankKey,JSON.stringify(bank));selectedMixtape=id;populateBank(bank,id);$('#save-dialog').close();$('#mixtape-notice').textContent='« '+name+' » enregistrée';}catch(error){$('#save-notice').textContent=bankError(error)}};
$('#mixtape-menu').onchange=()=>{try{const t=readBank().find(t=>t.id===$('#mixtape-menu').value);if(t)recallMixtape(t)}catch(error){$('#mixtape-menu').value=selectedMixtape;$('#mixtape-notice').textContent=bankError(error)}};
window.addEventListener('storage',e=>{if(e.key===bankKey){try{populateBank(readBank(),selectedMixtape)}catch(error){$('#mixtape-notice').textContent=bankError(error)}}});
try{populateBank(readBank())}catch(error){$('#mixtape-notice').textContent=bankError(error)}
