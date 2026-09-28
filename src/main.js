import { createIcons, Menu, ArrowRight, ArrowUpRight, ArrowDown, Code2, Server, Bot, Mail } from 'lucide';
import './style.css';

// Initialize Lucide icons
createIcons({
  icons: {
    Menu,
    ArrowRight,
    ArrowUpRight,
    ArrowDown,
    Code2,
    Server,
    Bot,
    Mail
  }
});

const cursor = document.getElementById('cursor');
const cursorContent = document.getElementById('cursor-content');
const heroArea = document.getElementById('hero-area');
const revealLayer = document.getElementById('reveal-layer');
const btnConnect = document.getElementById('btn-connect');
const btnWork = document.getElementById('btn-work');

// Initialize far off-screen
let mouseX = -1000;
let mouseY = -1000;

// Physics variables
let blobX = -1000;
let blobY = -1000;
let cursorX = -1000;
let cursorY = -1000;

let isHoveringHero = false;
let isHoveringCTA = false;
const isMobile = window.matchMedia("(max-width: 768px)").matches;

// Fast mouse tracker
window.addEventListener(isMobile ? 'touchmove' : 'mousemove', (e) => {
  mouseX = e.touches ? e.touches[0].clientX : e.clientX;
  mouseY = e.touches ? e.touches[0].clientY : e.clientY;
});

const heroSection = document.getElementById('hero');

heroSection.addEventListener('mouseenter', () => {
  isHoveringHero = true;
  revealLayer.classList.add('active');
});
heroSection.addEventListener('mouseleave', () => {
  isHoveringHero = false;
  revealLayer.classList.remove('active');
});

const interactables = document.querySelectorAll('a, button');
interactables.forEach(el => {
  el.addEventListener('mouseenter', () => isHoveringCTA = true);
  el.addEventListener('mouseleave', () => isHoveringCTA = false);
});

let currentCursorState = '';

// Hardware accelerated render loop
function update() {
  // Lerp for smooth blob movement (snappier)
  blobX += (mouseX - blobX) * 0.25;
  blobY += (mouseY - blobY) * 0.25;
  
  // Instant cursor position (removes input lag feel)
  cursorX = mouseX;
  cursorY = mouseY;

  // Hardware accelerated mask position
  // Center the 400px mask (subtract 200)
  revealLayer.style.setProperty('--mask-x', `${blobX - 200}px`);
  revealLayer.style.setProperty('--mask-y', `${blobY - 200}px`);

  if (!isMobile) {
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    
    const targetState = isHoveringCTA ? 'cta' : (isHoveringHero ? 'hero' : 'default');
    
    // ONLY update DOM if state actually changed (prevents massive DOM thrashing lag)
    if (currentCursorState !== targetState) {
      currentCursorState = targetState;
      if (targetState === 'cta') {
        cursorContent.className = 'cursor-dot';
        cursorContent.style.width = '16px';
        cursorContent.style.height = '16px';
        cursorContent.innerHTML = '';
      } else if (targetState === 'hero') {
        cursorContent.className = 'cursor-reveal';
        cursorContent.innerHTML = 'REVEAL';
        cursorContent.style.width = '64px';
        cursorContent.style.height = '64px';
      } else {
        cursorContent.className = 'cursor-dot';
        cursorContent.innerHTML = '';
        cursorContent.style.width = '12px';
        cursorContent.style.height = '12px';
      }
    }
  }

  requestAnimationFrame(update);
}
update();
