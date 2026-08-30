const intro = document.getElementById('intro');
const introVideo = document.getElementById('introVideo');

if (introVideo) {
  introVideo.addEventListener('ended', () => {
    if (intro) intro.classList.add('hide');
  });

  setTimeout(() => {
    if (intro && !intro.classList.contains('hide')) {
      intro.classList.add('hide');
    }
  }, 12000);
} else {
  setTimeout(() => {
    if (intro) intro.classList.add('hide');
  }, 10300);
}

const pujaBtn = document.getElementById('pujaBtn');
const ganeshIdol = document.getElementById('ganeshIdol');
const heroSection = document.querySelector('.hero');
const pujaZone = document.querySelector('.puja-zone');

if (pujaBtn && heroSection && pujaZone) {
  let isAartiRunning = false;
  let isDragging = false;
  let dragStartPos = { x: 0, y: 0 };
  let hasDragged = false;
  let offsetX = 0;
  let offsetY = 0;

  const startDrag = (clientX, clientY) => {
    isDragging = true;
    hasDragged = false;
    dragStartPos = { x: clientX, y: clientY };
    const rect = pujaZone.getBoundingClientRect();
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
    pujaZone.classList.add('dragging');
    pujaZone.style.right = 'auto';
    pujaZone.style.bottom = 'auto';
  };

  const moveDrag = (clientX, clientY) => {
    if (!isDragging) return;
    const dx = clientX - dragStartPos.x;
    const dy = clientY - dragStartPos.y;
    if (Math.hypot(dx, dy) > 8) hasDragged = true;

    let x = clientX - offsetX;
    let y = clientY - offsetY;
    const zoneRect = pujaZone.getBoundingClientRect();
    x = Math.max(0, Math.min(window.innerWidth - zoneRect.width, x));
    y = Math.max(0, Math.min(window.innerHeight - zoneRect.height, y));

    pujaZone.style.left = `${x}px`;
    pujaZone.style.top = `${y}px`;
  };

  const endDrag = () => {
    isDragging = false;
    pujaZone.classList.remove('dragging');
  };

  pujaZone.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
  document.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
  document.addEventListener('mouseup', endDrag);

  pujaZone.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  }, { passive: true });
  document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  }, { passive: true });
  document.addEventListener('touchend', endDrag);

  pujaBtn.addEventListener('click', (e) => {
    if (hasDragged) {
      e.preventDefault();
      return;
    }
    if (isAartiRunning) return;
    isAartiRunning = true;

    heroSection.classList.add('doing-aarti');

    const aartiInterval = setInterval(() => {
      if (!ganeshIdol) return;
      const rect = ganeshIdol.getBoundingClientRect();
      const spark = document.createElement('span');
      spark.className = 'aarti-spark';
      spark.textContent = ['✨', '🌸', '🌼', '🪷', '💛'][Math.floor(Math.random() * 5)];
      spark.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * rect.width}px`;
      spark.style.top = `${rect.top + rect.height / 2 + (Math.random() - 0.5) * rect.height}px`;

      const x = (Math.random() - 0.5) * 60;
      const y = -140 - Math.random() * 120;

      spark.animate([
        { transform: 'translate(0, 0) scale(0.3) rotate(0)', opacity: 0 },
        { opacity: 1, offset: 0.15 },
        { transform: `translate(${x}px, ${y}px) scale(1.5) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: 1600 + Math.random() * 800,
        easing: 'cubic-bezier(.16, .84, .2, 1)'
      });

      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 2600);
    }, 110);

    setTimeout(() => {
      clearInterval(aartiInterval);
      heroSection.classList.remove('doing-aarti');
      isAartiRunning = false;
    }, 4800);
  });
}

const petals = document.getElementById('petals');
const petalSymbols = ['🌸', '🪷', '🌼', '✦', '❀'];

for (let i = 0; i < 32; i++) {
  const petal = document.createElement('div');
  petal.className = 'petal';
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.animationDuration = `${8 + Math.random() * 9}s`;
  petal.style.animationDelay = `${Math.random() * 8}s`;
  petal.style.fontSize = `${15 + Math.random() * 14}px`;
  const inner = document.createElement('span');
  inner.textContent = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];
  petal.appendChild(inner);
  petals.appendChild(petal);
}

function makeLights(id) {
  const wrap = document.getElementById(id);
  for (let i = 0; i < 14; i++) {
    const light = document.createElement('span');
    light.className = 'light';
    wrap.appendChild(light);
  }
}
makeLights('leftLights');
makeLights('rightLights');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      if (entry.target.id === 'invite') {
        const typeElements = entry.target.querySelectorAll('.invite-text');
        typeElements.forEach((el, index) => {
          setTimeout(() => {
            typeWriter(el, 35);
          }, 1000 + index * 1400);
        });
      }
    }
  });
}, { threshold: 0.16 });

function typeWriter(element, speed = 35) {
  const text = element.getAttribute('data-text');
  element.textContent = '';
  element.style.opacity = 1;
  element.classList.add('typing');
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
      element.classList.remove('typing');
    }
  }, speed);
}

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const modal = document.getElementById('modal');
document.getElementById('rsvpBtn').addEventListener('click', () => {
  modal.classList.add('show');
  burstBlessings();
});
document.getElementById('closeModal').addEventListener('click', () => modal.classList.remove('show'));
modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.classList.remove('show');
});

function burstBlessings() {
  for (let i = 0; i < 24; i++) {
    const spark = document.createElement('div');
    spark.textContent = ['✨', '🪷', '🌸', '💛'][Math.floor(Math.random() * 4)];
    spark.style.position = 'fixed';
    spark.style.left = '50%';
    spark.style.top = '55%';
    spark.style.zIndex = '60';
    spark.style.pointerEvents = 'none';
    spark.style.fontSize = `${18 + Math.random() * 18}px`;
    const x = (Math.random() - 0.5) * window.innerWidth * 0.75;
    const y = (Math.random() - 0.5) * window.innerHeight * 0.55;
    spark.animate([
      { transform: 'translate(-50%, -50%) scale(.4)', opacity: 0 },
      { opacity: 1, offset: 0.18 },
      { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.4) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], { duration: 1300 + Math.random() * 700, easing: 'cubic-bezier(.2,.8,.2,1)' });
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 2200);
  }
}
