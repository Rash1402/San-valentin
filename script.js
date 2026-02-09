const btnPlan = document.getElementById('btnPlan');
const btnAccept = document.getElementById('btnAccept');

const plan = document.getElementById('plan');
const confetti = document.getElementById('confetti');

btnPlan.addEventListener('click', () => {
  const hidden = plan.classList.contains('is-hidden');

  if (hidden) {
    plan.classList.remove('is-hidden');
    plan.classList.add('is-revealed');
    plan.setAttribute('aria-hidden', 'false');

    btnPlan.textContent = 'Ocultar el plan';

    // scroll suave al plan
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

  setTimeout(() => {
    confetti.style.display = 'none';
  }, 2000);
}

btnAccept.addEventListener('click', () => {
  launchConfetti();
  btnAccept.textContent = 'Cita aceptada 😍✅';
  setTimeout(() => (btnAccept.textContent = 'Aceptar la cita 💖'), 15000);
});

