document.addEventListener("DOMContentLoaded", () => {
  /* ===== Header Color on Mouse Move ===== */
  const header = document.querySelector("#header");
  header.addEventListener("mousemove", (e) => {
    const red = Math.min(255, Math.max(0, Math.floor((e.clientX / window.innerWidth) * 255)));
    const blue = Math.min(255, Math.max(0, Math.floor((e.clientY / window.innerHeight) * 255)));
    header.style.background = `linear-gradient(60deg, rgba(200, 200, 200, 1), rgb(${red}, 0, ${blue})`;
    header.style.backgroundClip = "text";
    header.style.color = "transparent";
  });

  /* ===== Network Graph Canvas ===== */
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size to full screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // === Graph Configuration Constants ===
  const NODE_COUNT = 130; // total number of nodes to display
  const LINK_RADIUS = 160; // max distance between nodes to draw a link
  const HOVER_RADIUS = 120; // range of mouse influence on nearby nodes

  // === Graph State ===
  const nodes = []; // array to store nodes (points)
  const links = []; // array to store links (pairs of node indices)
  let mouse = { x: -9999, y: -9999 }; // initial mouse position off-screen

  // === Generate nodes with minimum distance between each other ===
  function generateNodes() {
    const minDist = 60; // minimum allowed distance between nodes
    let tries = 0;

    while (nodes.length < NODE_COUNT && tries < NODE_COUNT * 100) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.95;

      // check if too close to an existing node
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
        // add new node with initial position (x0, y0) and velocity
        nodes.push({ x, y, x0: x, y0: y, vx: 0, vy: 0 });
      }

      tries++;
    }
  }

  // === Connect nodes with lines if close enough (undirected edges) ===
  function generateLinks() {
    links.length = 0; // clear existing links
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i],
          b = nodes[j];
        const dx = a.x0 - b.x0;
        const dy = a.y0 - b.y0;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_RADIUS) {
          links.push([i, j]); // store index pair
        }
      }
    }
  }

  // === Mouse movement tracking ===
  canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // === Reset mouse influence when it leaves the canvas ===
  canvas.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // === Update node positions with ripple + spring physics ===
  function update() {
    for (let node of nodes) {
      const dx = node.x - mouse.x;
      const dy = node.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Apply ripple force from mouse
      if (dist < HOVER_RADIUS) {
        const angle = Math.atan2(dy, dx);
        const strength = (HOVER_RADIUS - dist) * 0.01; // stronger when closer
        node.vx += Math.cos(angle) * strength;
        node.vy += Math.sin(angle) * strength;
      }

      // Apply spring force to return node to its original position
      const springX = (node.x0 - node.x) * 0.05;
      const springY = (node.y0 - node.y) * 0.05;
      node.vx += springX;
      node.vy += springY;

      // Apply damping to smooth motion
      node.vx *= 0.85;
      node.vy *= 0.85;

      // Update actual node position
      node.x += node.vx;
      node.y += node.vy;
    }
  }

  // === Draw all nodes and links to the canvas ===
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw links between nodes
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

    // Draw circular nodes
    for (let node of nodes) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#a3b4c7ff";
      ctx.fill();
    }
  }

  // === Animation loop ===
  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  // === Initialize the graph ===
  generateNodes();
  generateLinks();
  loop();

  /* ===== Tab Section Toggle ===== */
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

  /* ===== Animated Skill Bars ===== */
  const animateProgressBars = () => {
    document.querySelectorAll(".progress-bar").forEach((bar) => {
      const width = bar.dataset.width;
      setTimeout(() => (bar.style.width = `${width}%`), 100);
    });
  };

  /* ===== Image Gallery ===== */
  const galleryImages = [
    {
      title: "Presenting My Poster",
      caption: "Presenting at the PEPR Conference, Bordeaux, France",
      src: "./assets/bordeuax.jpeg",
    },
    {
      title: "Conference Talk",
      caption: "Presenting my conference paper in Bologna, Italy",
      src: "./assets/bologna.jpeg",
    },
    {
      title: "Hiking in Kejan",
      caption: "Hiking in the mountains of Kejan, Isfahan, Iran",
      src: "./assets/kejan.jpeg",
    },
  ];

  const gallery = document.querySelector(".gallery");
  const dotsContainer = document.querySelector(".gallery-dots");
  let currentIndex = 0;

  // Create gallery slides
  galleryImages.forEach((image, i) => {
    const slide = document.createElement("div");
    slide.classList.add("gallery-slide");
    if (i === 0) slide.classList.add("active");

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.title;

    const title = document.createElement("div");
    title.classList.add("caption");
    title.innerHTML = `<h3>${image.title}</h3>`;

    const caption = document.createElement("div");
    caption.classList.add("caption");
    caption.innerHTML = `<p>${image.caption}</p>`;

    slide.appendChild(title);
    slide.appendChild(img);
    slide.appendChild(caption);
    gallery.insertBefore(slide, gallery.querySelector(".gallery-controls"));
  });

  // Create dot navigation
  galleryImages.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  // Gallery navigation logic
  const slides = gallery.querySelectorAll(".gallery-slide");
  const dots = dotsContainer.querySelectorAll(".dot");
  const prevBtn = gallery.querySelector(".prev");
  const nextBtn = gallery.querySelector(".next");

  const showSlide = (idx) => {
    slides.forEach((s, i) => s.classList.toggle("active", i === idx));
    dots.forEach((d, i) => d.classList.toggle("active", i === idx));
    currentIndex = idx;
  };

  const nextSlide = () => showSlide((currentIndex + 1) % galleryImages.length);
  const prevSlide = () =>
    showSlide((currentIndex - 1 + galleryImages.length) % galleryImages.length);
  const goToSlide = (i) => showSlide(i);

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);
});
