document.addEventListener('DOMContentLoaded', () => {
  // Ambil elemen utama yang perlu diinteraksi.
  const typingElement = document.getElementById('typing-text');
  const openGiftButton = document.getElementById('open-gift-btn');
  const revealSections = document.querySelectorAll('.reveal-on-open');
  const modal = document.getElementById('letter-modal');
  const envelopeButton = document.getElementById('envelope');
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  const tiltCards = document.querySelectorAll('[data-tilt]');
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confettiContext = confettiCanvas.getContext('2d');

  const birthdayMessage = 'Happy Birthday, Bro!';
  let typingIndex = 0;
  let animationFrameId = null;
  let lastFocusedElement = null;

  // Efek ketik teks sambutan di hero.
  function typeBirthdayText() {
    if (typingIndex >= birthdayMessage.length) {
      return;
    }

    typingElement.textContent += birthdayMessage.charAt(typingIndex);
    typingIndex += 1;
    setTimeout(typeBirthdayText, 78);
  }

  // Ukuran canvas confetti harus menyesuaikan viewport.
  function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  // Buat efek confetti yang pecah saat tombol ditekan.
  function launchConfetti() {
    const colors = ['#e5232e', '#116ac0', '#ffffff', '#a8d8ff'];
    const particles = Array.from({ length: 150 }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.35,
      size: Math.random() * 7 + 4,
      xSpeed: (Math.random() - 0.5) * 18,
      ySpeed: Math.random() * -12 - 3,
      gravity: Math.random() * 0.12 + 0.12,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
    }));

    const drawParticles = () => {
      confettiContext.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      particles.forEach((particle) => {
        particle.x += particle.xSpeed;
        particle.y += particle.ySpeed;
        particle.ySpeed += particle.gravity;
        particle.rotation += particle.rotationSpeed;
        particle.life -= 0.008;

        confettiContext.save();
        confettiContext.globalAlpha = Math.max(particle.life, 0);
        confettiContext.translate(particle.x, particle.y);
        confettiContext.rotate(particle.rotation);
        confettiContext.fillStyle = particle.color;
        confettiContext.fillRect(
          -particle.size / 2,
          -particle.size / 3,
          particle.size,
          particle.size * 0.66
        );
        confettiContext.restore();
      });

      const remainingParticles = particles.filter(
        (particle) => particle.life > 0 && particle.y < confettiCanvas.height + 30
      );

      if (remainingParticles.length > 0) {
        animationFrameId = requestAnimationFrame(drawParticles);
      } else {
        confettiContext.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    };

    cancelAnimationFrame(animationFrameId);
    drawParticles();
  }

  // Fungsi untuk menampilkan section utama setelah tombol "Buka kejutan" diklik.
  function revealMissionSections() {
    revealSections.forEach((section) => {
      section.classList.add('is-visible');
    });

    setTimeout(() => {
      document.getElementById('mission').scrollIntoView({ behavior: 'smooth' });
    }, 650);
  }

  // Buka modal pesan birthday.
  function openModal() {
    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal__close').focus();
  }

  // Tutup modal dan kembalikan fokus ke tombol sebelumnya.
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    lastFocusedElement?.focus();
  }

  // Efek 3D ringan pada kartu saat pointer bergerak.
  function setupTiltEffect() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerFine = window.matchMedia('(pointer: fine)');

    if (reducedMotion.matches || !pointerFine.matches) {
      return;
    }

    tiltCards.forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;

        card.style.setProperty('--ry', `${x * 8}deg`);
        card.style.setProperty('--rx', `${y * -8}deg`);
      });

      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  // Jalankan efek awal.
  typeBirthdayText();
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Event saat tombol utama ditekan.
  openGiftButton.addEventListener(
    'click',
    () => {
      launchConfetti();
      openGiftButton.classList.add('btn--opened');
      openGiftButton.querySelector('.btn__label').textContent = 'Mission unlocked!';
      revealMissionSections();
    },
    { once: true }
  );

  // Event modal.
  envelopeButton.addEventListener('click', openModal);
  closeButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });

  setupTiltEffect();
});

