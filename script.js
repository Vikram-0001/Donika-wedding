/* ============================================================
   ROYAL WEDDING INVITATION SCRIPT
   Donika & Aval | Royal Wedding Celebrations
   ============================================================ */

const CONFIG = {
  bride: "Donika",
  groom: "Aval",

  // Main Wedding Day & Auspicious Pheras (22 Nov 2026, 7:00 PM)
  weddingDateTime: "2026-11-22T19:00:00",

  venueName: "Aashirwad Banquet & Garden",
  venueAddress: "Aashirwad Banquet & Garden, Near Kherki Daula Toll Plaza, Gurugram, Haryana - 122004",

  // Google Maps Links
  mapsLink: "https://www.google.com/maps/place/Aashirwad+Banquet+%26+Garden/@28.3990644,76.9777203,17z/data=!3m1!4b1!4m6!3m5!1s0x390d3d872cedf4ed:0xca7418887786fe98!8m2!3d28.3990644!4d76.9802952!16s%2Fg%2F11x95s115y",
  mapsEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3509.4326581452934!2d76.9777203!3d28.3990644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d3d872cedf4ed%3A0xca7418887786fe98!2sAashirwad%20Banquet%20%26%20Garden!5e0!3m2!1sen!2sin!4v1728662400000!5m2!1sen!2sin",

  hosts: "With love, blessings, and warm regards: The Families & Relatives of Donika and Aval",

  // The 3 Requested Events:
  events: [
    {
      id: "haldi",
      title: "Haldi Ceremony",
      name: "Haldi",
      startDate: "2026-11-21T14:00:00",
      endDate: "2026-11-21T17:00:00",
      displayDate: "Saturday, 21st November 2026",
      displayTime: "2:00 PM",
      theme: "Shades of Yellow, Ochre & Marigold",
      description: "Auspicious turmeric ceremony with joyful music, phoolon ki holi and heartfelt blessings.",
      icon: "🌼"
    },
    {
      id: "sangeet",
      title: "Ladies Sangeet & Celebration",
      name: "Ladies Sangeet",
      startDate: "2026-11-21T19:00:00",
      endDate: "2026-11-21T23:59:00",
      displayDate: "Saturday, 21st November 2026",
      displayTime: "7:00 PM Onwards",
      theme: "Glamorous Indian Traditional / Indo-Western",
      description: "An evening of dance performances, live dhol beats, vibrant boliyan, cocktails & grand feast.",
      icon: "🪕"
    },
    {
      id: "shaadi",
      title: "The Grand Shaadi (Wedding)",
      name: "Shaadi",
      startDate: "2026-11-22T19:00:00",
      endDate: "2026-11-23T02:00:00",
      displayDate: "Sunday, 22nd November 2026",
      displayTime: "Baraat: 7:00 PM • Varmala: 8:30 PM • Pheras: 10:00 PM Onwards",
      theme: "Royal Ethnic Finery / Traditional Sherwanis & Sarees",
      description: "Sacred Vedic Pheras around the holy fire as Donika & Aval tie the eternal knot.",
      icon: "👑"
    }
  ]
};

/* ============================================================
   DOM HELPERS & STATE
   ============================================================ */
const $ = (id) => document.getElementById(id);
let currentCardIndex = 0;
let isCurtainOpen = false;

// Bind text fields
document.querySelectorAll("[data-bind]").forEach((el) => {
  const key = el.dataset.bind;
  if (CONFIG[key]) el.textContent = CONFIG[key];
});

// Disable automatic browser scroll restoration so the page always starts at the top
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

// Clear any hash if opened with an anchor
if (window.location.hash) {
  try {
    history.replaceState(null, null, window.location.pathname + window.location.search);
  } catch (e) {}
}

/* ============================================================
   1. ROYAL CURTAIN OPENING
   ============================================================ */
const curtainOverlay = $("curtainOverlay");
const unveilBtn = $("unveilBtn");
const curtainSeal = $("curtainSeal");

function openCurtains() {
  if (isCurtainOpen) return;
  isCurtainOpen = true;

  // Ensure view starts exactly at the top of the page
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });

  // Clear any anchor hash
  if (window.location.hash) {
    try {
      history.replaceState(null, null, window.location.pathname + window.location.search);
    } catch (e) {}
  }

  // Blur the button so focus doesn't jump to lower page elements
  if (document.activeElement && typeof document.activeElement.blur === "function") {
    document.activeElement.blur();
  }

  // Play auspicious chime
  playRoyalAuspiciousChime();

  // Trigger curtain visual opening
  if (curtainOverlay) {
    curtainOverlay.classList.add("curtain-opened");
  }
  document.body.classList.remove("curtain-active");

  // Keep page at the top after unlocking scroll
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });

  // Shower royal petals and sparkles
  spawnPetalShower(36);

  // Trigger first down-to-up card slide-in after curtains part
  setTimeout(() => {
    goToCard(0, "up");
  }, 700);

  showToast("Welcome to the Royal Wedding of Donika & Aval! ✨");
}

if (unveilBtn) {
  unveilBtn.addEventListener("click", openCurtains);
}
if (curtainSeal) {
  curtainSeal.addEventListener("click", (e) => {
    if (e.target.closest("button") === unveilBtn) return;
    openCurtains();
  });
}

/* ============================================================
   2. DOWN-TO-UP SLIDE-IN CARD SHOWCASE
   ============================================================ */
const cards = [
  $("card-0"),
  $("card-1"),
  $("card-2")
].filter(Boolean);

const tabs = [
  $("tab-0"),
  $("tab-1"),
  $("tab-2")
].filter(Boolean);

const dots = document.querySelectorAll("#deckDots .dot");
const currentCardNum = $("currentCardNum");

function goToCard(targetIndex, direction = "up") {
  if (cards.length === 0) return;
  if (targetIndex < 0) targetIndex = cards.length - 1;
  if (targetIndex >= cards.length) targetIndex = 0;

  currentCardIndex = targetIndex;

  // Update tabs
  tabs.forEach((tab, idx) => {
    const isActive = idx === targetIndex;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  // Update dots
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === targetIndex);
  });

  // Update counter
  if (currentCardNum) currentCardNum.textContent = targetIndex + 1;

  // Slide cards:
  cards.forEach((card, idx) => {
    card.classList.remove("card-active", "card-exited-up", "card-exited-down");

    if (idx === targetIndex) {
      // PREPARE FOR DOWN-TO-UP SLIDE IN:
      // Force position below screen first if it wasn't already
      card.style.transform = "translateY(110%) scale(0.92)";
      card.style.opacity = "0";

      // Force browser reflow so the transition fires smoothly
      void card.offsetWidth;

      // Animate smoothly to center stage!
      card.style.transform = "";
      card.style.opacity = "";
      card.classList.add("card-active");
    } else if (idx < targetIndex) {
      // Prior cards float upwards
      card.classList.add("card-exited-up");
    } else {
      // Succeeding cards stay below ready to slide up
      card.classList.add("card-exited-down");
    }
  });

  // Dynamically update the stage height to perfectly match the active card
  updateStageHeight();
}

/**
 * Dynamically adjusts the height of #slideDeckStage to match the active invitation card.
 * This completely prevents card overflow and overlapping with the Itinerary/Timeline section.
 */
function updateStageHeight() {
  const stage = $("slideDeckStage");
  if (!stage || cards.length === 0) return;
  const activeCard = cards[currentCardIndex] || cards[0];
  if (activeCard) {
    const cardHeight = Math.max(activeCard.offsetHeight, activeCard.scrollHeight);
    if (cardHeight > 0) {
      stage.style.minHeight = `${cardHeight + 20}px`;
    }
  }
}

// Resize & Font load observers to keep stage height pixel-perfect
window.addEventListener("load", updateStageHeight);
window.addEventListener("resize", updateStageHeight);
window.addEventListener("orientationchange", updateStageHeight);
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(updateStageHeight);
}

if (typeof ResizeObserver !== "undefined") {
  const cardResizeObserver = new ResizeObserver(() => {
    updateStageHeight();
  });
  cards.forEach((card) => {
    if (card) cardResizeObserver.observe(card);
  });
}

// Initial call to ensure proper height on load
updateStageHeight();

// Stage Navigation Buttons
const prevBtn = $("prevCardBtn");
const nextBtn = $("nextCardBtn");

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    goToCard(currentCardIndex - 1, "down");
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    goToCard(currentCardIndex + 1, "up");
  });
}

// Step Tab Clicks
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const idx = parseInt(tab.dataset.index, 10);
    goToCard(idx, idx > currentCardIndex ? "up" : "down");
  });
});

// Dot clicks
dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const idx = parseInt(dot.dataset.index, 10);
    goToCard(idx, idx > currentCardIndex ? "up" : "down");
  });
});

// Note: Cards only change when the user explicitly clicks/touches a button (tabs, arrows, dots, or next buttons).
// Touch swipe interception has been removed so natural mobile page scrolling is never interrupted.

/* ============================================================
   3. SHUBH VIVAH COUNTDOWN TIMER
   ============================================================ */
const weddingDate = new Date(CONFIG.weddingDateTime);

function updateCountdown() {
  const cdDays = $("cdDays");
  const cdHours = $("cdHours");
  const cdMins = $("cdMins");
  const cdSecs = $("cdSecs");
  if (!cdDays) return;

  const now = new Date();
  let diff = weddingDate - now;
  if (diff < 0) diff = 0;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  cdDays.textContent = String(days).padStart(2, "0");
  cdHours.textContent = String(hours).padStart(2, "0");
  cdMins.textContent = String(mins).padStart(2, "0");
  cdSecs.textContent = String(secs).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ============================================================
   4. VENUE & DIRECTIONS & COPY ADDRESS
   ============================================================ */
const mapFrame = $("mapFrame");
const directionsBtn = $("directionsBtn");
const copyAddressBtn = $("copyAddressBtn");

// Lazy-load venue map so it doesn't hijack scroll or focus during opening
function loadVenueMap() {
  if (mapFrame && !mapFrame.src) {
    mapFrame.src = CONFIG.mapsEmbedSrc;
  }
}

if (mapFrame) {
  if ("IntersectionObserver" in window) {
    const mapObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadVenueMap();
          mapObserver.disconnect();
        }
      });
    }, { rootMargin: "300px" });
    mapObserver.observe(mapFrame);
  } else {
    setTimeout(loadVenueMap, 3500);
  }
}

if (directionsBtn) directionsBtn.href = CONFIG.mapsLink;
document.querySelectorAll('a[href="#venue"]').forEach((link) => {
  link.addEventListener("click", loadVenueMap);
});

if (copyAddressBtn) {
  copyAddressBtn.addEventListener("click", async () => {
    const copyText = $("copyText");
    try {
      await navigator.clipboard.writeText(CONFIG.venueAddress);
      if (copyText) copyText.textContent = "Address Copied!";
      showToast("📍 Venue address copied to clipboard!");
    } catch (err) {
      if (copyText) copyText.textContent = "Selected Address";
    }
    setTimeout(() => {
      if (copyText) copyText.textContent = "Copy Address";
    }, 2800);
  });
}

/* ============================================================
   5. AUSPICIOUS OPENING CHIME (WEB AUDIO API)
   ============================================================ */
let audioCtx = null;

function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

// Auspicious opening temple bell & chime flourish
function playRoyalAuspiciousChime() {
  try {
    initAudioContext();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const chimeFreqs = [587.33, 880.00, 1174.66, 1760.00]; // Royal D bells
    chimeFreqs.forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now + i * 0.12);

      gain.gain.setValueAtTime(0, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.09, now + i * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 1.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 2.0);
    });
  } catch (e) {
    // Audio autostart policy safe fallback
  }
}

/* ============================================================
   6. ROYAL PETAL SHOWER & FLOATING PARTICLES
   ============================================================ */
const petalsContainer = $("petalsContainer");

function spawnPetalShower(count = 25) {
  if (!petalsContainer) return;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      createPetal();
      if (i % 2 === 0) createSparkle();
    }, i * 110);
  }
}

function createPetal() {
  if (!petalsContainer) return;
  const petal = document.createElement("div");
  petal.className = "petal";

  const size = Math.random() * 14 + 10;
  const left = Math.random() * 100;
  const duration = Math.random() * 5 + 4;
  const delay = Math.random() * 2;

  petal.style.width = `${size}px`;
  petal.style.height = `${size * 1.3}px`;
  petal.style.left = `${left}%`;
  petal.style.animationDuration = `${duration}s`;
  petal.style.animationDelay = `${delay}s`;

  petalsContainer.appendChild(petal);
  setTimeout(() => petal.remove(), (duration + delay) * 1000);
}

function createSparkle() {
  if (!petalsContainer) return;
  const sparkle = document.createElement("div");
  sparkle.className = "sparkle";

  const left = Math.random() * 100;
  const duration = Math.random() * 4 + 3;
  const delay = Math.random() * 1.5;

  sparkle.style.left = `${left}%`;
  sparkle.style.animationDuration = `${duration}s`;
  sparkle.style.animationDelay = `${delay}s`;

  petalsContainer.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), (duration + delay) * 1000);
}

// Gentle continuous background petal drift
setInterval(() => {
  if (isCurtainOpen && Math.random() > 0.4) {
    createPetal();
    if (Math.random() > 0.5) createSparkle();
  }
}, 1800);

/* ============================================================
   7. SCROLL OBSERVER (DOWN-TO-UP REVEAL ON SCROLL)
   ============================================================ */
const scrollElements = document.querySelectorAll(".scroll-slide-up");
if (scrollElements.length > 0) {
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      }
    });
  }, { threshold: 0.15 });

  scrollElements.forEach((el) => scrollObserver.observe(el));
}

/* ============================================================
   8. TOAST NOTIFICATION
   ============================================================ */
let toastTimeout = null;
function showToast(msg) {
  const toast = $("toastNotification");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// Make goToCard globally available for inline onclick calls
window.goToCard = goToCard;
