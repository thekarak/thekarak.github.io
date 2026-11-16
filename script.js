/* Small, dependency-free interactions & keyboard ergonomics. Core content works without JavaScript. */
(() => {
  'use strict';
  const root = document.documentElement;
  const themeButton = document.querySelector('#theme-toggle');
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  let explicitTheme = false;
  try { explicitTheme = ['light', 'dark'].includes(localStorage.getItem('sk-theme')); } catch {}

  function setTheme(theme, persist = false) {
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    const colorMeta = document.querySelector('#theme-color');
    if (colorMeta) colorMeta.content = dark ? '#181a18' : '#f8f7f4';
    if (themeButton) {
      themeButton.setAttribute('aria-pressed', String(dark));
      themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
      themeButton.title = `Switch to ${dark ? 'light' : 'dark'} theme (or press T)`;
    }
    if (persist) {
      explicitTheme = true;
      try { localStorage.setItem('sk-theme', theme); } catch {}
    }
  }

  setTheme(root.dataset.theme);
  themeButton?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
  systemTheme.addEventListener('change', event => { if (!explicitTheme) setTheme(event.matches ? 'dark' : 'light'); });

  // Quick keyboard shortcut 'T' to toggle theme
  window.addEventListener('keydown', event => {
    if (event.key === 't' || event.key === 'T') {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable) return;
      event.preventDefault();
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme, true);
    }
  });

  // Kolkata Asia live clock
  const clocks = [...document.querySelectorAll('#local-clock, #footer-clock')];
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  });

  function updateClock() {
    const now = new Date();
    const time = formatter.format(now);
    clocks.forEach(clock => {
      clock.textContent = time;
      clock.dateTime = now.toISOString();
      clock.setAttribute('aria-label', `${time} India Standard Time, Kolkata`);
    });
  }

  let clockTimer;
  function resumeClock() {
    clearInterval(clockTimer);
    updateClock();
    clockTimer = setInterval(updateClock, 1000);
  }
  resumeClock();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(clockTimer);
    else resumeClock();
  });

  const yearEl = document.querySelector('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scrollspy & Reading Progress
  const sections = ['about', 'projects', 'notes', 'contact'].map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = [...document.querySelectorAll('[data-section]')];
  const progress = document.querySelector('#scroll-progress-bar');
  let scrollFrame = 0;

  function onScroll() {
    scrollFrame = 0;
    const max = root.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0})`;
    let active = sections[0]?.id;
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= innerHeight * .34) active = section.id;
    });
    if (innerHeight + scrollY >= root.scrollHeight - 3) active = 'contact';
    navLinks.forEach(link => {
      const selected = link.dataset.section === active;
      link.classList.toggle('is-active', selected);
      if (selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function queueScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(onScroll); }
  addEventListener('scroll', queueScroll, { passive: true });
  addEventListener('resize', queueScroll);
  onScroll();

  // Project Category Filters
  const projects = [...document.querySelectorAll('.project')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  filters.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let count = 0;
    projects.forEach(project => {
      project.hidden = filter !== 'all' && !project.dataset.categories.split(' ').includes(filter);
      project.classList.remove('entering');
      if (!project.hidden) {
        count++;
        requestAnimationFrame(() => project.classList.add('entering'));
      }
    });
    filters.forEach(item => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    const countEl = document.querySelector('#project-count');
    if (countEl) countEl.textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
    queueScroll();
  }));

  // Accordion Details for Behind-the-Build
  const toggles = [...document.querySelectorAll('.abstract-toggle')];
  toggles.forEach(button => button.addEventListener('click', () => {
    const shouldOpen = button.getAttribute('aria-expanded') !== 'true';
    toggles.forEach(item => {
      const open = item === button && shouldOpen;
      item.setAttribute('aria-expanded', String(open));
      const target = document.getElementById(item.getAttribute('aria-controls'));
      if (target) target.hidden = !open;
    });
    queueScroll();
  }));

  // In-page anchor jumps
  document.querySelectorAll('a[href^="#project-"]').forEach(link => link.addEventListener('click', () => {
    filters.find(button => button.dataset.filter === 'all')?.click();
  }));

  // Interactive BioAgent-ST Architecture Inspector
  const workflow = [
    ['01 / PLAN', 'The language model turns a question into a typed workflow. Scientific calculations remain strictly isolated in deterministic tools.'],
    ['02 / EXECUTE', 'Deterministic Scanpy and Squidpy tools carry out the analysis, completely separated from generative hallucination.'],
    ['03 / VERIFY', 'Fail-closed policy gates inspect the run. When required evidence is missing or confidence is low, the pipeline halts rather than returning an unverified result.'],
    ['04 / RECORD', 'An append-only SQLite ledger with cryptographic SHA-256 hashes links every output to its exact inputs, tool versions, and run timestamp.']
  ];
  const steps = [...document.querySelectorAll('[data-step]')];
  const explanation = document.querySelector('#workflow-explanation');

  function selectStep(index) {
    const safeIdx = Math.max(0, Math.min(steps.length - 1, index));
    const button = steps[safeIdx];
    if (!button) return;
    const [label, description] = workflow[safeIdx];
    steps.forEach((step, i) => {
      const selected = i === safeIdx;
      step.classList.toggle('is-selected', selected);
      step.setAttribute('aria-pressed', String(selected));
    });
    if (explanation) {
      const labelEl = explanation.querySelector('.workflow-label');
      const descEl = explanation.querySelector('p');
      if (labelEl) labelEl.textContent = label;
      if (descEl) descEl.textContent = description;
    }
  }

  steps.forEach((button, idx) => {
    button.addEventListener('click', () => selectStep(idx));
    button.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        const next = (idx + 1) % steps.length;
        steps[next]?.focus();
        selectStep(next);
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        const prev = (idx - 1 + steps.length) % steps.length;
        steps[prev]?.focus();
        selectStep(prev);
      }
    });
  });

  // Tactile Copy Email Toast
  const toast = document.querySelector('#toast');
  let toastTimer;
  function announce(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const email = button.dataset.copy;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const field = document.createElement('textarea');
        field.value = email;
        field.style.cssText = 'position:fixed;left:-9999px';
        document.body.append(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        button.focus();
        if (!copied) throw new Error('Clipboard unavailable');
      }
      announce('Email address copied to clipboard.');
    } catch {
      announce(`Copy unavailable — write to ${email}`);
    }
  }));
})();
