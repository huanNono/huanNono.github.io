(() => {
  const root = document.querySelector('[data-home-experiment]');
  if (!root) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const toggle = root.querySelector('[data-motion-toggle]');
  let paused = false;
  const enabled = () => !paused && !reduced.matches;
  let observer;
  const reveals = [...root.querySelectorAll('[data-reveal]')];
  function sync() {
    root.classList.toggle('motion-paused', !enabled());
    toggle.hidden = reduced.matches;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.innerHTML = paused ? '开启动效 <span aria-hidden="true">↗</span>' : '暂停动效 <span aria-hidden="true">Ⅱ</span>';
    if (!enabled()) {
      root.style.removeProperty('--pointer-x'); root.style.removeProperty('--pointer-y'); root.style.removeProperty('--pointer-r');
      root.style.removeProperty('--focus-x'); root.style.removeProperty('--focus-y');
      reveals.forEach(el => el.classList.add('is-visible'));
    }
  }
  if ('IntersectionObserver' in window && !reduced.matches) {
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .1 });
    reveals.forEach(el => { el.classList.add('reveal-ready'); observer.observe(el); });
  }
  toggle.addEventListener('click', () => { paused = !paused; sync(); });
  reduced.addEventListener('change', sync);
  const stage = root.querySelector('[data-motion-stage]');
  stage.addEventListener('pointermove', event => {
    if (!enabled() || !fine.matches) return;
    const b = stage.getBoundingClientRect();
    const x = (event.clientX - b.left) / b.width - .5;
    const y = (event.clientY - b.top) / b.height - .5;
    root.style.setProperty('--pointer-x', `${x * 28}px`);
    root.style.setProperty('--pointer-y', `${y * 20}px`);
    root.style.setProperty('--pointer-r', `${x * 2}deg`);
  });
  stage.addEventListener('pointerleave', () => {
    ['--pointer-x','--pointer-y','--pointer-r'].forEach(p => root.style.removeProperty(p));
  });
  const frame = root.querySelector('[data-viewfinder]');
  if (frame) {
    frame.addEventListener('pointermove', event => {
      if (!enabled() || !fine.matches) return;
      const b = frame.getBoundingClientRect();
      root.style.setProperty('--focus-x', `${(event.clientX - b.left - b.width / 2) * .65}px`);
      root.style.setProperty('--focus-y', `${(event.clientY - b.top - b.height / 2) * .65}px`);
    });
    frame.addEventListener('pointerleave', () => { root.style.removeProperty('--focus-x'); root.style.removeProperty('--focus-y'); });
  }
  sync();
})();
