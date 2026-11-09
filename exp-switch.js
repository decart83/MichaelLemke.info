// Experience grouping: Industry / Time / Role type, with click-to-read dialog
(function(){
  const yr = s => (s||'').match(/\d{4}/)?.[0] || '';
  const GROUPS = {
    industry: { label:'Industry', cols:[
      {name:'Data & Analytics', test:c=>/Snowflake|Alteryx/.test(c.company)},
      {name:'Education & Assessment', test:c=>/ETS|Area9|McGraw|Pearson|McDougal|Houghton/.test(c.company)},
      {name:'Consumer & Startups', test:c=>/Uncommon/.test(c.company)} ]},
    time: { label:'Time', cols:[
      {name:'2020s', test:c=>+yr(c.roles[0].start)>=2020},
      {name:'2010s', test:c=>{const y=+yr(c.roles[0].start);return y>=2010&&y<2020;}},
      {name:'2000s', test:c=>+yr(c.roles[0].start)<2010} ]},
    role: { label:'Role type', cols:[
      {name:'Strategy & Operations', test:c=>/Strategy|Operations/i.test(c.roles[0].title)},
      {name:'Data & Analytics', test:c=>/Intelligence|Analytics|Analyst/i.test(c.roles[0].title)&&!/Strategy|Operations/i.test(c.roles[0].title)},
      {name:'Product & Learning', test:c=>/Product|Learning/i.test(c.roles[0].title)&&!/Analyst|Producer/i.test(c.roles[0].title)},
      {name:'Production & Technology', test:c=>/Producer|Technology|Editor|Faculty/i.test(c.roles[0].title)} ]}
  };
  const mount = document.getElementById('industries'); if (!mount) return;
  const dlg = document.getElementById('co-dialog'); const body = dlg.querySelector('.co-body');
  const bar = document.getElementById('exp-switch');
  let companies = [];
  function build(exp){
    const byCo = new Map();
    exp.forEach(j => { if(!byCo.has(j.company)) byCo.set(j.company,{company:j.company,logo:j.logo,url:j.url,roles:[]}); byCo.get(j.company).roles.push(j); });
    companies = [...byCo.values()];
    Object.keys(GROUPS).forEach(k => { const b=document.createElement('button'); b.type='button'; b.textContent=GROUPS[k].label; b.dataset.mode=k; b.onclick=()=>render(k); bar.appendChild(b); });
    render('industry');
  }
  function openCo(c, groupName){
    body.innerHTML = '<div class="co-head">'+(c.logo?'<img src="'+c.logo+'" alt="">':'')+'<div><p class="eyebrow">'+groupName+'</p><h2>'+c.company+'</h2>'+(c.url?'<a href="'+c.url+'" target="_blank" rel="noopener">Visit site &nearr;</a>':'')+'</div></div>'
      + c.roles.map(r => '<div class="co-role"><p class="role-line"><strong>'+r.title+'</strong> · '+r.start+' – '+r.end+(r.location?' · '+r.location:'')+'</p>'+(r.summary?'<p class="muted">'+r.summary+'</p>':'')+'</div>').join('');
    dlg.showModal();
  }
  function render(mode){
    [...bar.children].forEach(b => b.setAttribute('aria-pressed', b.dataset.mode===mode));
    mount.innerHTML=''; mount.dataset.mode=mode;
    const cols = GROUPS[mode].cols; mount.style.setProperty('--cols', cols.length);
    cols.forEach(g => {
      const col = document.createElement('div'); col.className='ind-col';
      col.innerHTML = '<h3 class="ind-title">'+g.name+'</h3>';
      const list = document.createElement('div'); list.className='ind-logos';
      companies.filter(g.test).forEach(c => {
        const first=c.roles[c.roles.length-1], last=c.roles[0];
        const span=yr(first.start)+' – '+(/present/i.test(last.end||'')?'now':yr(last.end));
        const b = document.createElement('button'); b.type='button'; b.className='logo-btn'; b.title=c.company;
        b.innerHTML = (c.logo?'<img src="'+c.logo+'" alt="">':'')+'<span class="lb-text"><strong>'+c.company+'</strong><small>'+last.title+(c.roles.length>1?' <em>+'+(c.roles.length-1)+' more</em>':'')+'</small><small class="lb-dates">'+span+'</small></span>';
        b.onclick = () => openCo(c, g.name);
        list.appendChild(b);
      });
      if (!list.children.length) list.innerHTML='<p class="muted" style="font-size:.85rem;margin:0">—</p>';
      col.appendChild(list); mount.appendChild(col);
    });
  }
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  const exp = window.__EXPERIENCE__ || [];
  if (exp.length) build(exp); else fetch('experience.json').then(r=>r.json()).then(build);
})();
