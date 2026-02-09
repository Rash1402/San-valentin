// ======= Helpers =======
const $ = (id) => document.getElementById(id);

window.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM listo. JS cargado.');

  const btnPlan = $('btnPlan');
  const btnAccept = $('btnAccept');
  const plan = $('plan');
  const surprise = $('surprise');
  const confetti = $('confetti');

  // Validación rápida
  if (!btnPlan || !btnAccept || !plan || !surprise || !confetti) {
    console.error('❌ Falta algún elemento:', {
      btnPlan, btnAccept, plan, surprise, confetti
    });
    return;
  }

  // --- Ver/Ocultar plan ---
  btnPlan.addEventListener('click', () => {
    const hidden = plan.classList.contains('is-hidden');

    if (hidden) {
      plan.classList.remove('is-hidden');
      plan.classList.add('is-revealed');
      plan.setAttribute('aria-hidden', 'false');
      btnPlan.textContent = 'Ocultar el plan';

      setTimeout(() => {
        plan.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    } else {
      plan.classList.add('is-hidden');
      plan.classList.remove('is-revealed');
      plan.setAttribute('aria-hidden', 'true');
      btnPlan.textContent = 'Ver el plan';
    }
  });

  // --- Confetti ---
  function launchConfetti() {
    confetti.innerHTML = '';
    confetti.style.display = 'block';

    const pieces = 120;
    for (let i = 0; i < pieces; i++) {
      const p = document.createElement('div');
      p.className = 'piece';

      const left = Math.random() * 100;
      const delay = Math.random() * 0.35;
      const size = 6 + Math.random() * 10;
      const hue = Math.floor(Math.random() * 360);

      p.style.left = left + 'vw';
      p.style.animationDelay = delay + 's';
      p.style.width = size + 'px';
      p.style.height = (size * 1.4) + 'px';
      p.style.background = `hsl(${hue} 90% 60%)`;

      confetti.appendChild(p);
    }

    setTimeout(() => (confetti.style.display = 'none'), 2000);
  }

  // --- Aceptar + desbloquear sorpresa ---
  btnAccept.addEventListener('click', () => {
    console.log('💖 Click en Aceptar');

    launchConfetti();

    btnAccept.textContent = 'Cita aceptada 😍✅';
    setTimeout(() => (btnAccept.textContent = 'Aceptar la cita 💖'), 2200);

    // mostrar sorpresa
    surprise.classList.remove('is-hidden');
    surprise.classList.add('is-revealed');
    surprise.setAttribute('aria-hidden', 'false');

    setTimeout(() => {
      surprise.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 250);

    initConstellation(); // inicia canvas
  });
});

// ======= CONSTELLATION =======
let constellationStarted = false;

function initConstellation() {
  if (constellationStarted) return;
  constellationStarted = true;

  const canvas = document.getElementById('sky');
  if (!canvas) {
    console.error('❌ No existe canvas #sky');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('❌ No se pudo obtener context 2D');
    return;
  }

  console.log('🌌 Constellation init');

  const pointer = { x: 0, y: 0, active: false };
  let stars = [];
  let W = 0, H = 0, dpr = 1;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;

    // Si el canvas está en 0, forzamos un alto mínimo (por si CSS no cargó)
    if (H < 50) H = 260;

    dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const starCount = Math.max(55, Math.floor((W * H) / 12000));
    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.7 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      glow: 0.25 + Math.random() * 0.35,
      on: false
    }));

    console.log(`📐 Canvas listo: ${Math.round(W)}x${Math.round(H)} stars=${stars.length}`);
  }

  function setPointer(e) {
    const box = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - box.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - box.top;
    pointer.x = Math.max(0, Math.min(W, x));
    pointer.y = Math.max(0, Math.min(H, y));
  }

  canvas.addEventListener('mousemove', (e) => { pointer.active = true; setPointer(e); });
  canvas.addEventListener('mouseleave', () => { pointer.active = false; });

  canvas.addEventListener('touchstart', (e) => { pointer.active = true; setPointer(e); }, { passive: true });
  canvas.addEventListener('touchmove', (e) => { pointer.active = true; setPointer(e); }, { passive: true });
  canvas.addEventListener('touchend', () => { pointer.active = false; });

  canvas.addEventListener('click', (e) => {
    setPointer(e);
    stars.forEach(s => {
      const d = Math.hypot(s.x - pointer.x, s.y - pointer.y);
      if (d < 70) s.on = true;
    });
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // fondo
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, 0, W, H);

    // movimiento + activación por cercanía
    for (const s of stars) {
      s.x += s.vx;
      s.y += s.vy;

      if (s.x < 0 || s.x > W) s.vx *= -1;
      if (s.y < 0 || s.y > H) s.vy *= -1;

      if (pointer.active) {
        const d = Math.hypot(s.x - pointer.x, s.y - pointer.y);
        if (d < 90) s.on = true;
      }
    }

    // líneas
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const a = stars[i], b = stars[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);

        if (d < 85 && (a.on || b.on)) {
          const alpha = Math.max(0, 1 - d / 85) * 0.25;
          ctx.strokeStyle = `rgba(245,246,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // estrellas
    for (const s of stars) {
      const alpha = s.on ? 0.95 : 0.45;
      ctx.fillStyle = `rgba(245,246,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      if (s.on) {
        ctx.fillStyle = `rgba(255,61,127,${s.glow * 0.35})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (s.on && !pointer.active && Math.random() < 0.007) s.on = false;
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}
