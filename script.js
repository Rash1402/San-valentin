const btnPlan = document.getElementById('btnPlan');
const btnAccept = document.getElementById('btnAccept');
const btnMsg = document.getElementById('btnMsg');

const modal = document.getElementById('modal');
const btnClose = document.getElementById('btnClose');
const btnCopy = document.getElementById('btnCopy');
const copyText = document.getElementById('copyText');

const confetti = document.getElementById('confetti');

btnPlan.addEventListener('click', () => {
  document.getElementById('plan').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

btnMsg.addEventListener('click', () => {
  copyText.value =
`Paulina ❤️
Este sábado 14 te tengo un plan:
🌳 Chapultepec (paseo y fotitos)
🍽️ Comida rica (tú eliges 😌)
🎨 Noche de pintura en casa (música, velitas y brindis)
¿Te late? 💖`;
  modal.style.display = 'grid';
  modal.setAttribute('aria-hidden', 'false');
});

btnClose.addEventListener('click', () => {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }
});

btnCopy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyText.value);
    btnCopy.textContent = '¡Copiado! ✅';
  } catch {
    btnCopy.textContent = 'Copia manual 😅';
  }
  setTimeout(() => (btnCopy.textContent = 'Copiar'), 1200);
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
  setTimeout(() => (btnAccept.textContent = 'Aceptar la cita 💖'), 2200);
});
