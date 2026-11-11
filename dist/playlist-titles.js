'use strict';
const playlistTitles=new Map([['PLS7NuVuIPeHjj_XgaQVAWhBbMpQKkR35L','05 21'],['PLS7NuVuIPeHh3ND9y6EnpMqTlGuVAMwF1','01-22']]);
const playlistTitleRequests=new Map();
function refreshPlaylistTitle(d){
 const list=d.list,label=d.root.querySelector('.playlist-title');if(!label)return;
 const show=title=>{if(d.list!==list)return;label.textContent=title;label.title=title};
 show(playlistTitles.get(list)||'Chargement…');
 if(!playlistTitleRequests.has(list)){
  const url='https://www.youtube.com/oembed?format=json&url='+encodeURIComponent('https://www.youtube.com/playlist?list='+list);
  const request=fetch(url,{signal:AbortSignal.timeout(10000)}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{if(typeof data.title!=='string'||!data.title.trim())throw Error();playlistTitles.set(list,data.title);return data.title}).catch(()=>{playlistTitleRequests.delete(list);return playlistTitles.get(list)||'Nom indisponible'});
  playlistTitleRequests.set(list,request);
 }
 playlistTitleRequests.get(list).then(show);
}
