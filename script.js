const nav=document.querySelector('nav'),menu=document.querySelector('.menu');menu.addEventListener('click',()=>menu.classList.toggle('open'));menu.addEventListener('click',()=>{if(menu.classList.contains('open')){nav.style.display='flex';nav.style.position='absolute';nav.style.top='74px';nav.style.left='0';nav.style.right='0';nav.style.padding='20px 28px';nav.style.flexDirection='column';nav.style.background='#050a12';nav.style.borderBottom='1px solid #1d3652'}else{nav.removeAttribute('style')}});document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');nav.removeAttribute('style')}));

(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];

/* scroll progress + back to top */
const bar=$('#progress'),top=$('#toTop');
const onScroll=()=>{const h=document.documentElement,max=h.scrollHeight-h.clientHeight;bar.style.width=(max>0?scrollY/max*100:0)+'%';top.classList.toggle('show',scrollY>600)};
addEventListener('scroll',onScroll,{passive:true});onScroll();
top.addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'}));

/* active nav link */
const links=$$('nav a[href^="#"]');
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-45% 0px -50% 0px'});
$$('main section[id]').forEach(s=>spy.observe(s));

/* count-up for metrics */
function countUp(el){
  const m=el.textContent.trim().match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);if(!m||reduce)return;
  const [,pre,num,suf]=m,dec=(num.split('.')[1]||'').length,comma=num.includes(','),end=parseFloat(num.replace(/,/g,'')),t0=performance.now(),dur=1100;
  const fmt=v=>{let s=v.toFixed(dec);if(comma){const[a,b]=s.split('.');s=a.replace(/\B(?=(\d{3})+(?!\d))/g,',')+(b?'.'+b:'')}return pre+s+suf};
  (function tick(t){const p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,3);el.textContent=fmt(end*e);if(p<1)requestAnimationFrame(tick);else el.textContent=pre+num+suf})(t0);
}

/* reveal on scroll */
const targets=$$('.section-head,.about-main,.profile-stats,.skills-grid .skill,.project,.project-grid,.timeline article,.domain-grid div,.contact>*,.filters');
targets.forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--d',(i%3)*0.08+'s')});
const rev=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');$$('.metric-grid b',e.target).forEach(countUp);rev.unobserve(e.target)}}),{threshold:.12});
targets.forEach(el=>rev.observe(el));

/* spotlight on cards */
$$('.project,.skill,.domain-grid div').forEach(el=>{
  el.classList.add('spot');
  el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--mx',e.clientX-r.left+'px');el.style.setProperty('--my',e.clientY-r.top+'px')});
});

/* portrait tilt */
const frame=$('.portrait-frame'),hero=$('.hero-right');
if(frame&&!reduce&&matchMedia('(hover:hover)').matches){
  hero.addEventListener('mousemove',e=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;frame.style.transform=`perspective(900px) rotateY(${x*10}deg) rotateX(${-y*8}deg)`});
  hero.addEventListener('mouseleave',()=>frame.style.transform='');
}

/* project filters */
const btns=$$('.filters button'),items=$$('#projects [data-tools]');
btns.forEach(b=>b.addEventListener('click',()=>{
  btns.forEach(x=>x.classList.toggle('active',x===b));
  const f=b.dataset.filter;
  items.forEach(it=>{const show=f==='all'||it.dataset.tools.split(' ').includes(f);it.classList.toggle('is-hidden',!show);if(show)it.classList.add('in')});
}));

/* image lightbox */
const lb=$('#lightbox'),lbImg=$('img',lb);
const close=()=>{lb.classList.remove('open');lb.setAttribute('aria-hidden','true')};
$$('.hr-visual img').forEach(img=>img.addEventListener('click',()=>{lbImg.src=img.src;lbImg.alt=img.alt;lb.classList.add('open');lb.setAttribute('aria-hidden','false')}));
lb.addEventListener('click',close);addEventListener('keydown',e=>{if(e.key==='Escape')close()});
})();
