/* Pointer-led orbital study & tactile spatial micro-interactions. Real 3D projection, zero dependencies. */
(() => {
  'use strict';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer: fine)');

  // 1. Subtle portrait tilt with spring release
  const portrait = document.querySelector('[data-tilt]');
  let tiltFrame = 0;
  if (portrait) {
    portrait.addEventListener('pointermove', event => {
      if (motion.matches || !fine.matches) return;
      cancelAnimationFrame(tiltFrame);
      tiltFrame = requestAnimationFrame(() => {
        const box = portrait.getBoundingClientRect();
        portrait.style.setProperty('--ry', `${((event.clientX - box.left) / box.width - .5) * 10}deg`);
        portrait.style.setProperty('--rx', `${-((event.clientY - box.top) / box.height - .5) * 10}deg`);
      });
    }, { passive: true });
    portrait.addEventListener('pointerleave', () => {
      cancelAnimationFrame(tiltFrame);
      portrait.style.setProperty('--ry', '0deg');
      portrait.style.setProperty('--rx', '0deg');
    });
  }

  // 2. 3D Celestial Orbital Canvas Engine
  const canvas = document.querySelector('#orbit-canvas');
  const context = canvas?.getContext('2d');
  const art = canvas?.closest('.orbit-art');
  const readout = document.querySelector('#orbit-readout');
  if (!context || !canvas) return;

  const width = 280, height = 230, radius = 74;
  function resizeCanvas() {
    const scale = Math.max(1, canvas.clientWidth / width) * Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
  }
  resizeCanvas();

  let ink = '#262722', line = '#dcdcd4', strongLine = '#b2b5a7';
  function palette() {
    const styles = getComputedStyle(document.documentElement);
    ink = styles.getPropertyValue('--ink').trim() || '#262722';
    line = styles.getPropertyValue('--line').trim() || '#dcdcd4';
    strongLine = styles.getPropertyValue('--strong-line').trim() || '#b2b5a7';
  }
  palette();

  let frame = 0, last = 0, visible = true;
  let rotation = .35, yaw = 0, pitch = -.32;
  let targetYaw = 0, targetPitch = -.32;
  let velocity = 0, impulse = 0, satelliteAngle = .6;
  let hovering = false, previousX = null, pointerAt = 0;
  let pointerX = width / 2, pointerY = height / 2, hoverStrength = 0;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const degrees = radians => {
    const value = Math.round(radians * 180 / Math.PI);
    return `${value < 0 ? '−' : '+'}${Math.abs(value).toString().padStart(2, '0')}°`;
  };

  // 3D perspective projection onto the canvas viewport
  function project(x, y, z) {
    const a = rotation + yaw;
    const px = x * Math.cos(a) - z * Math.sin(a);
    const pz = x * Math.sin(a) + z * Math.cos(a);
    const py = y * Math.cos(pitch) - pz * Math.sin(pitch);
    const depth = y * Math.sin(pitch) + pz * Math.cos(pitch);
    const scale = 420 / (420 + depth);
    return [width / 2 + px * scale, height / 2 + py * scale, depth, scale];
  }

  function orbitPoint(t, tilt) {
    const r = 98;
    return [r * Math.cos(t), r * Math.sin(t) * Math.sin(tilt), r * Math.sin(t) * Math.cos(tilt)];
  }

  // Draw 3D curved paths partitioned into front and back hemispheres
  function curve(points, front, alpha, stroke = ink, thickness = .65) {
    context.beginPath();
    let drawing = false;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const near = p[2] <= 0;
      if (near !== front) { drawing = false; continue; }
      if (!drawing) { context.moveTo(p[0], p[1]); drawing = true; }
      else { context.lineTo(p[0], p[1]); }
    }
    context.strokeStyle = stroke;
    context.globalAlpha = Math.max(0, Math.min(1, alpha));
    context.lineWidth = thickness;
    context.stroke();
  }

  function draw() {
    context.clearRect(0, 0, width, height);

    // Instrument registration corner ticks
    context.strokeStyle = strongLine;
    context.lineWidth = .7;
    context.globalAlpha = .45;
    const pad = 20, tickLen = 3;
    [[pad, pad], [width - pad, pad], [pad, height - pad], [width - pad, height - pad]].forEach(([cx, cy]) => {
      context.beginPath();
      context.moveTo(cx - tickLen, cy); context.lineTo(cx + tickLen, cy);
      context.moveTo(cx, cy - tickLen); context.lineTo(cx, cy + tickLen);
      context.stroke();
    });

    // 1. Meridians (longitudes)
    const paths = [];
    const intersections = [];
    const meridianCount = 10;
    const parallelCount = 5;

    for (let m = 0; m < meridianCount; m++) {
      const longitude = (m / meridianCount) * Math.PI;
      const pts = [];
      for (let s = 0; s <= 90; s++) {
        const t = (s / 90) * Math.PI * 2;
        pts.push(project(
          radius * Math.cos(t) * Math.cos(longitude),
          radius * Math.sin(t),
          radius * Math.cos(t) * Math.sin(longitude)
        ));
      }
      paths.push(pts);
    }

    // 2. Parallels (latitudes)
    for (let p = -2; p <= 2; p++) {
      const lat = (p * Math.PI) / 6.5;
      const r = radius * Math.cos(lat);
      const y = radius * Math.sin(lat);
      const pts = [];
      for (let s = 0; s <= 90; s++) {
        const t = (s / 90) * Math.PI * 2;
        pts.push(project(r * Math.cos(t), y, r * Math.sin(t)));
      }
      paths.push(pts);

      // Collect grid intersections for constellation nodes
      for (let m = 0; m < meridianCount; m++) {
        const lon = (m / meridianCount) * Math.PI * 2;
        intersections.push(project(
          r * Math.sin(lon),
          y,
          r * Math.cos(lon)
        ));
      }
    }

    // 3. Orbit track & satellite
    const orbit = [];
    const orbitSteps = 120;
    for (let s = 0; s <= orbitSteps; s++) {
      orbit.push(project(...orbitPoint((s / orbitSteps) * Math.PI * 2, .52)));
    }

    // Back hemisphere rendering (faint, atmospheric)
    curve(orbit, false, .16, line, .75);
    paths.forEach(pts => curve(pts, false, .12, line, .6));

    // Front hemisphere rendering (crisp, illuminated)
    paths.forEach(pts => curve(pts, true, .58 + hoverStrength * .15, ink, .65));
    curve(orbit, true, .68, strongLine, .85);

    // 4. Constellation Nodes (Micro coordinate points on front hemisphere)
    for (let i = 0; i < intersections.length; i++) {
      const node = intersections[i];
      if (node[2] <= 0) { // front hemisphere only
        const depthFactor = clamp((radius - node[2]) / (radius * 2), 0.3, 1);
        const nodeAlpha = (.3 + depthFactor * .45 + hoverStrength * .25);
        context.fillStyle = ink;
        context.globalAlpha = nodeAlpha;
        context.beginPath();
        const nodeR = 1.1 * node[3] * (depthFactor > .7 ? 1.2 : 1);
        context.arc(node[0], node[1], nodeR, 0, Math.PI * 2);
        context.fill();

        // Subtle specular halo on prominent front nodes when hovered
        if (hoverStrength > .05 && depthFactor > .82) {
          context.strokeStyle = ink;
          context.globalAlpha = hoverStrength * .22 * depthFactor;
          context.lineWidth = .6;
          context.beginPath();
          context.arc(node[0], node[1], nodeR + 2.5, 0, Math.PI * 2);
          context.stroke();
        }
      }
    }

    // 5. Satellite with kinetic decay trail
    const satPos = project(...orbitPoint(satelliteAngle, .52));
    const satFront = satPos[2] <= 0;

    // Fading orbital trail
    const trailLen = 14;
    context.lineWidth = .8;
    for (let i = 1; i <= trailLen; i++) {
      const trailAngle = satelliteAngle - (i * 0.035);
      const tp = project(...orbitPoint(trailAngle, .52));
      if (tp[2] <= 0 || !satFront) {
        context.globalAlpha = (1 - (i / trailLen)) * (satFront ? .45 : .18);
        context.fillStyle = ink;
        context.beginPath();
        context.arc(tp[0], tp[1], Math.max(.5, 1.8 - (i * .1)), 0, Math.PI * 2);
        context.fill();
      }
    }

    // Satellite body
    context.globalAlpha = satFront ? 1 : .38;
    context.fillStyle = ink;
    context.beginPath();
    context.arc(satPos[0], satPos[1], 2.8, 0, Math.PI * 2);
    context.fill();

    // Satellite beacon ring
    context.strokeStyle = ink;
    context.globalAlpha = satFront ? (.4 + hoverStrength * .3) : .15;
    context.lineWidth = .75;
    context.beginPath();
    context.arc(satPos[0], satPos[1], 6.5, 0, Math.PI * 2);
    context.stroke();

    // Pointer magnetic tether when hovering
    if (hoverStrength > .02) {
      context.globalAlpha = hoverStrength * .3;
      context.strokeStyle = strongLine;
      context.lineWidth = .7;
      context.setLineDash([2, 4]);
      context.beginPath();
      context.moveTo(width / 2, height / 2);
      context.lineTo(pointerX, pointerY);
      context.stroke();
      context.setLineDash([]);

      // Subtle cursor target ring
      context.globalAlpha = hoverStrength * .6;
      context.strokeStyle = ink;
      context.beginPath();
      context.arc(pointerX, pointerY, 3.5, 0, Math.PI * 2);
      context.stroke();
    }

    context.globalAlpha = 1;

    // Numerical HUD readout update
    if (readout) {
      readout.textContent = `${degrees(yaw)} / ${degrees(pitch)}`;
    }
  }

  function tick(time) {
    frame = 0;
    if (!visible || document.hidden || motion.matches) return;
    const dt = last ? Math.min((time - last) / 16.667, 3) : 1;
    last = time;
    const ease = 1 - Math.pow(.92, dt);
    yaw += (targetYaw - yaw) * ease;
    pitch += (targetPitch - pitch) * ease;
    hoverStrength += ((hovering ? 1 : 0) - hoverStrength) * ease;
    velocity += impulse;
    impulse = 0;
    velocity *= Math.pow(.95, dt);
    rotation += (.0011 * (1 - hoverStrength * .75) + velocity) * dt;
    satelliteAngle += (.0042 + (hoverStrength * .002)) * dt;

    if (time - pointerAt > 90) previousX = null;
    draw();
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    if (motion.matches) {
      yaw = targetYaw = 0;
      pitch = targetPitch = -.32;
      velocity = impulse = hoverStrength = 0;
      hovering = false;
      art?.classList.remove('is-engaged');
    }
    draw();
    if (visible && !document.hidden && !motion.matches) {
      frame = requestAnimationFrame(tick);
    }
  }

  // Pointer tracking for smooth 3D steering
  document.addEventListener('pointermove', event => {
    if (!visible || motion.matches || !fine.matches || event.pointerType === 'touch') return;
    const box = canvas.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const localX = (event.clientX - box.left) / box.width;
    const localY = (event.clientY - box.top) / box.height;
    const over = localX >= 0 && localX <= 1 && localY >= 0 && localY <= 1;
    const x = over ? (localX - .5) * 2 : (event.clientX / innerWidth - .5) * 2;
    const y = over ? (localY - .5) * 2 : (event.clientY / innerHeight - .5) * 2;
    targetYaw = clamp(x, -1, 1) * (over ? 1.25 : .3);
    targetPitch = -.32 + clamp(y, -1, 1) * (over ? .9 : .22);
    pointerX = localX * width;
    pointerY = localY * height;

    if (over && previousX !== null) {
      impulse += clamp(event.clientX - previousX, -30, 30) * .00018;
    }
    previousX = over ? event.clientX : null;
    pointerAt = performance.now();

    if (hovering !== over) {
      hovering = over;
      art?.classList.toggle('is-engaged', over);
    }
  }, { passive: true });

  document.documentElement.addEventListener('pointerleave', () => {
    hovering = false;
    previousX = null;
    targetYaw = 0;
    targetPitch = -.32;
    art?.classList.remove('is-engaged');
  });

  // Watch for theme changes to adapt canvas line colors instantly
  new MutationObserver(() => {
    palette();
    draw();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      sync();
    }).observe(canvas);
  }

  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  new ResizeObserver(() => {
    resizeCanvas();
    draw();
  }).observe(canvas);
  sync();

  // 3. Apple/Linear-grade radial cursor spotlight on cards
  const spotlightTargets = document.querySelectorAll('.project, .workflow-panel, .practice-grid article, .availability');
  if (fine.matches && !motion.matches) {
    spotlightTargets.forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }, { passive: true });
    });
  }

  // 4. Directional contact arrow response
  const contact = document.querySelector('.contact');
  contact?.addEventListener('pointermove', event => {
    if (motion.matches || !fine.matches) return;
    const box = contact.getBoundingClientRect();
    contact.style.setProperty('--arrow-x', `${((event.clientX - box.left) / box.width - .5) * 18}px`);
    contact.style.setProperty('--arrow-y', `${((event.clientY - box.top) / box.height - .5) * 14}px`);
  }, { passive: true });
  contact?.addEventListener('pointerleave', () => {
    contact.style.setProperty('--arrow-x', '0px');
    contact.style.setProperty('--arrow-y', '0px');
  });

  // 5. Section reveal observer
  if ('IntersectionObserver' in window && !motion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    document.querySelectorAll('.section-head, .tool-list, .note-list').forEach(el => {
      el.classList.add('reveal-pending');
      observer.observe(el);
    });
  }
})();
