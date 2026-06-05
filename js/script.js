window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  const minShow = 1200;
  const start = Date.now();
  const delay = Math.max(0, minShow - (Date.now() - start));
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 400);
  }, delay);
});

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.nav-links a');
  const current = location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === current);
  });
});

const constellationCanvas = document.getElementById('constellation-canvas');
const ctxConstellation = constellationCanvas.getContext('2d', { alpha: true });
let stars = [];
const STAR_COUNT = 180;
const MAX_DISTANCE = 160;
const DRIFT_SPEED = 0.22;

function resizeConstellation() {
  constellationCanvas.width = window.innerWidth;
  constellationCanvas.height = window.innerHeight;
}
resizeConstellation();
window.addEventListener('resize', resizeConstellation);

function createStars() {
  stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * constellationCanvas.width,
    y: Math.random() * constellationCanvas.height,
    radius: Math.random() * 1.3 + 0.25,
    alpha: Math.random() * 0.7 + 0.2,
    speedX: Math.random() * 0.12 + DRIFT_SPEED,
    twinkle: Math.random() * 0.015 + 0.004
  }));
}
createStars();

function animateConstellation() {
  ctxConstellation.clearRect(0, 0, constellationCanvas.width, constellationCanvas.height);

  stars.forEach((star) => {
    star.x += star.speedX;
    if (star.x > constellationCanvas.width) star.x = -20;
    star.alpha += Math.sin(Date.now() * star.twinkle) * 0.012;
    star.alpha = Math.max(0.2, Math.min(0.95, star.alpha));

    ctxConstellation.beginPath();
    ctxConstellation.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctxConstellation.fillStyle = `rgba(230, 240, 255, ${star.alpha})`;
    ctxConstellation.shadowBlur = 4;
    ctxConstellation.shadowColor = 'rgba(255, 255, 255, 0.4)';
    ctxConstellation.fill();
  });

  ctxConstellation.beginPath();
  ctxConstellation.strokeStyle = 'rgba(180, 210, 255, 0.11)';
  ctxConstellation.lineWidth = 0.5;
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DISTANCE) {
        ctxConstellation.moveTo(stars[i].x, stars[i].y);
        ctxConstellation.lineTo(stars[j].x, stars[j].y);
      }
    }
  }
  ctxConstellation.stroke();

  requestAnimationFrame(animateConstellation);
}
animateConstellation();

const rippleCanvas = document.getElementById('ripple-canvas');
const ctxRipple = rippleCanvas.getContext('2d', { alpha: true });
let ripples = [];
function resizeRipple() {
  rippleCanvas.width = window.innerWidth;
  rippleCanvas.height = window.innerHeight;
}
resizeRipple();
window.addEventListener('resize', resizeRipple);
window.addEventListener('mousemove', (e) => {
  ripples.push({ x: e.clientX, y: e.clientY, radius: 0, alpha: 0.22 });
});
function animateRipple() {
  ctxRipple.clearRect(0, 0, rippleCanvas.width, rippleCanvas.height);
  ripples.forEach((ripple, idx) => {
    ripple.radius += 1.7;
    ripple.alpha -= 0.008;
    if (ripple.alpha <= 0) return ripples.splice(idx, 1);
    ctxRipple.beginPath();
    ctxRipple.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
    ctxRipple.strokeStyle = `rgba(111, 255, 233, ${ripple.alpha})`;
    ctxRipple.lineWidth = 1;
    ctxRipple.stroke();
  });
  requestAnimationFrame(animateRipple);
}
animateRipple();

const cursorCanvas = document.getElementById('cursor-canvas');
const ctxCursor = cursorCanvas.getContext('2d', { alpha: true });
let cursorTrail = [];
function resizeCursor() {
  cursorCanvas.width = window.innerWidth;
  cursorCanvas.height = window.innerHeight;
}
resizeCursor();
window.addEventListener('resize', resizeCursor);
window.addEventListener('mousemove', (e) => {
  cursorTrail.push({ x: e.clientX, y: e.clientY, alpha: 0.9, size: Math.random() * 1.2 + 0.6 });
});
function animateCursor() {
  ctxCursor.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
  cursorTrail.forEach((dot, idx) => {
    dot.alpha -= 0.03;
    if (dot.alpha <= 0.03) return cursorTrail.splice(idx, 1);
    ctxCursor.beginPath();
    ctxCursor.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    ctxCursor.fillStyle = `rgba(111, 255, 233, ${dot.alpha})`;
    ctxCursor.shadowBlur = 4;
    ctxCursor.shadowColor = '#6fffe9';
    ctxCursor.fill();
  });
  requestAnimationFrame(animateCursor);
}
animateCursor();