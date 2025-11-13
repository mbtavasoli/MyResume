document.addEventListener("DOMContentLoaded", () => {
  /* ========== INTERACTIVE BOUNCING PARTICLES ========== */
  const canvas = document.querySelector("#canvas");

  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const NODE_COUNT = 130;
  const LINK_RADIUS = 160;
  const HOVER_RADIUS = 120;

  const nodes = [];
  const links = [];
  let mouse = { x: -9999, y: -9999 };

  // === Generate nicely spaced nodes ===
  function generateNodes() {
    const minDist = 60;
    let tries = 0;

    while (nodes.length < NODE_COUNT && tries < NODE_COUNT * 100) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.95; // leave some top margin

      let tooClose = false;
      for (let node of nodes) {
        const dx = x - node.x0;
        const dy = y - node.y0;
        if (Math.sqrt(dx * dx + dy * dy) < minDist) {
          tooClose = true;
          break;
        }
      }

      if (!tooClose) {
        nodes.push({ x, y, x0: x, y0: y, vx: 0, vy: 0 });
      }

      tries++;
    }
  }

  // === Build links between nearby nodes ===
  function generateLinks() {
    links.length = 0;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i],
          b = nodes[j];
        const dx = a.x0 - b.x0;
        const dy = a.y0 - b.y0;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_RADIUS) {
          links.push([i, j]);
        }
      }
    }
  }

  // === Interactivity ===
  canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  canvas.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // === Physics + Animation ===
  function update() {
    for (let node of nodes) {
      const dx = node.x - mouse.x;
      const dy = node.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // apply ripple force if close
      if (dist < HOVER_RADIUS) {
        const angle = Math.atan2(dy, dx);
        const strength = (HOVER_RADIUS - dist) * 0.15;
        node.vx += Math.cos(angle) * strength;
        node.vy += Math.sin(angle) * strength;
      }

      // return to original position
      const springX = (node.x0 - node.x) * 0.05;
      const springY = (node.y0 - node.y) * 0.05;
      node.vx += springX;
      node.vy += springY;

      // damping
      node.vx *= 0.85;
      node.vy *= 0.85;

      node.x += node.vx;
      node.y += node.vy;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw links
    ctx.beginPath();
    for (let [i, j] of links) {
      const a = nodes[i];
      const b = nodes[j];
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    ctx.strokeStyle = "rgba(136, 141, 148, 0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // draw nodes
    for (let node of nodes) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#a3b4c7ff";
      ctx.fill();
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  generateNodes();
  generateLinks();
  loop();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    nodes.length = 0;
    generateNodes();
    generateLinks();
  });

  /* ========== TABS (unchanged) ========== */
  const tabBtns = document.querySelectorAll(".tab-btn");
  const sections = document.querySelectorAll(".section");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));
      btn.classList.add("active");
      document.querySelector(`#${btn.dataset.tab}`).classList.add("active");
      if (btn.dataset.tab === "skills") setTimeout(animateProgressBars, 300);
    });
  });

  /* ========== SKILL BARS (unchanged) ========== */
  const animateProgressBars = () => {
    document.querySelectorAll(".progress-bar").forEach((bar) => {
      const width = bar.dataset.width;
      setTimeout(() => (bar.style.width = `${width}%`), 100);
    });
  };

  /* ========== IMAGE GALLERY (unchanged) ========== */
  const imageUrls = [];

  const gallery = document.querySelector(".gallery");
  const dotsContainer = document.querySelector(".gallery-dots");
  let currentIndex = 0;

  imageUrls.forEach((url, i) => {
    const img = document.createElement("img");
    img.src = url;
    img.alt = `Project ${i + 1}`;
    if (i === 0) img.classList.add("active");
    gallery.insertBefore(img, gallery.querySelector(".gallery-controls"));
  });

  imageUrls.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const images = gallery.querySelectorAll("img");
  const dots = dotsContainer.querySelectorAll(".dot");
  const prevBtn = gallery.querySelector(".prev");
  const nextBtn = gallery.querySelector(".next");

  const showSlide = (index) => {
    images.forEach((img, i) => img.classList.toggle("active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    currentIndex = index;
  };

  const nextSlide = () => showSlide((currentIndex + 1) % imageUrls.length);
  const prevSlide = () =>
    showSlide((currentIndex - 1 + imageUrls.length) % imageUrls.length);
  const goToSlide = (i) => showSlide(i);

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);
});
