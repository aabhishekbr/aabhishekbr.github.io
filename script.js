// Global States
let typewriterIndex = 0;
let charIndex = 0;
let isDeleting = false;
const roles = [
  "Software Development Engineer in Test",
  "Automation Architect",
  "CI/CD Pipeline Specialist",
  "Quality Assurance Engineer"
];
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseDelay = 2000;

// Canvas Particles System
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
const particleCount = 65;
const connectionDistance = 110;

// QA Simulator State
let runningSim = false;
let simInterval = null;

// Initialize on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  initNavbarScroll();
  initMobileMenu();
  initCanvas();
  initTypewriter();
  initSkillProgressAnimation();
  initNavbarActiveLinkTracker();
});

// 1. Navigation Scroll Styling
function initNavbarScroll() {
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

// 2. Mobile Menu Toggle
function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  
  menuToggle.addEventListener("click", () => {
    if (navLinks.style.display === "flex") {
      navLinks.style.display = "none";
    } else {
      navLinks.style.display = "flex";
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "100%";
      navLinks.style.left = "0";
      navLinks.style.width = "100%";
      navLinks.style.background = "rgba(6, 9, 19, 0.95)";
      navLinks.style.borderBottom = "1px solid var(--border-color)";
      navLinks.style.padding = "20px";
      navLinks.style.gap = "15px";
    }
  });

  // Close mobile menu on clicking links
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navLinks.style.display = "none";
      }
    });
  });
}

// 3. Canvas Particles Backdrop
function initCanvas() {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(6, 182, 212, 0.25)";
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / connectionDistance) * 0.08;
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// 4. Roles Typewriter Loop
function initTypewriter() {
  const typewriter = document.getElementById("typewriter");
  if (!typewriter) return;

  const currentRole = roles[typewriterIndex];

  if (isDeleting) {
    typewriter.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriter.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? deletingSpeed : typingSpeed;

  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true;
    delay = pauseDelay;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    typewriterIndex = (typewriterIndex + 1) % roles.length;
    delay = 300;
  }

  setTimeout(initTypewriter, delay);
}

// 5. Switch Philosophy Tabs
function switchAboutTab(tabName) {
  // Update Buttons
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  document.getElementById(`tab-${tabName}`).classList.add("active");

  // Update Contents
  document.querySelectorAll(".tab-content").forEach(content => {
    content.classList.remove("active");
  });
  document.getElementById(`content-${tabName}`).classList.add("active");
}

// 6. Skill progress circular bars scroll-in-view logic
function initSkillProgressAnimation() {
  const skillsSection = document.getElementById("skills");
  const fillBars = document.querySelectorAll(".progress-bar-fill");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fillBars.forEach(bar => {
          const targetPct = bar.getAttribute("data-percent");
          bar.style.width = targetPct;
        });
        observer.unobserve(skillsSection);
      }
    });
  }, { threshold: 0.2 });

  if (skillsSection) {
    observer.observe(skillsSection);
  }
}

// 7. Track Active Section Scroll links
function initNavbarActiveLinkTracker() {
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-item");

  window.addEventListener("scroll", () => {
    let currentId = "home";

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 180)) {
        currentId = section.getAttribute("id");
      }
    });

    navItems.forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${currentId}`) {
        item.classList.add("active");
      }
    });
  });
}

// 8. Interactive QA Test Automation Sandbox Simulator
function startSimulatedSuite() {
  if (runningSim) return;
  runningSim = true;

  const btn = document.getElementById("run-suite-btn");
  const btnText = document.getElementById("btn-run-text");
  const selectedSuite = document.getElementById("suite-selector").value;
  const consoleBody = document.getElementById("console-body");
  const circProgress = document.getElementById("circular-progress");
  const pctLabel = document.getElementById("percentage-label");
  const statPassed = document.getElementById("stat-passed");
  const statFailed = document.getElementById("stat-failed");
  const statDuration = document.getElementById("stat-duration");
  const consoleTitle = document.getElementById("console-header-title");

  // Reset values
  btn.style.opacity = "0.6";
  btn.style.cursor = "not-allowed";
  btnText.textContent = "Running...";
  consoleBody.innerHTML = "";
  circProgress.style.strokeDashoffset = "377";
  pctLabel.textContent = "0%";
  statPassed.textContent = "0";
  statFailed.textContent = "0";
  statDuration.textContent = "0.0s";

  let logSteps = [];
  let totalTime = 0.0;
  let testCount = 0;
  let passedCount = 0;
  let failedCount = 0;

  if (selectedSuite === "e2e-web") {
    consoleTitle.textContent = "selenium_pom_runner.log";
    logSteps = [
      { text: "[INFO] 2026-06-01 08:30:00 - Initializing ChromeDriver v126.0.40...", type: "info" },
      { text: "[INFO] Configuring browser options: --headless, --disable-gpu, --window-size=1920,1080", type: "info" },
      { text: "[PASS] ChromeDriver successfully spawned.", type: "success", passes: 0, fails: 0, time: 0.2 },
      { text: "[INFO] Navigating to Target URL: https://portal.enterprise.app/login", type: "info" },
      { text: "[PASS] Page loaded in 760ms. HTTP status: 200 OK", type: "success", passes: 1, fails: 0, time: 0.8 },
      { text: "[INFO] [POM] Executing login flow with user: test_admin_roy", type: "info" },
      { text: "[INFO] Entering credentials into FormFields element locations...", type: "info" },
      { text: "[PASS] User authenticated. Redirected to Dashboard view.", type: "success", passes: 2, fails: 0, time: 1.3 },
      { text: "[INFO] Initiating dynamic data load verification checks...", type: "info" },
      { text: "[INFO] Scanning grid metrics for API syncing discrepancies...", type: "info" },
      { text: "[PASS] Grid parsed: 42 records synced correctly.", type: "success", passes: 3, fails: 0, time: 1.9 },
      { text: "[INFO] Performing DOM accessibility validations...", type: "info" },
      { text: "[PASS] Aria-labels check completed. 0 warnings detected.", type: "success", passes: 4, fails: 0, time: 2.2 },
      { text: "[INFO] Executing Visual Regression checks on charts panel...", type: "info" },
      { text: "[WARN] Visual comparison offset detected: 0.02% (Below threshold of 0.05%)", type: "warning" },
      { text: "[PASS] Visual Regression Test: PASSED", type: "success", passes: 5, fails: 0, time: 2.8 },
      { text: "[INFO] Processing cleanup logic, destroying driver instances...", type: "info" },
      { text: "[SUCCESS] [SUITE PASS] e2e-web: 5/5 assertions PASSED.", type: "success", passes: 5, fails: 0, time: 3.1 }
    ];
  } else if (selectedSuite === "api-regression") {
    consoleTitle.textContent = "postman_restassured.log";
    logSteps = [
      { text: "[INFO] 2026-06-01 08:30:00 - Compiling Postman Collection: API_V2_Regression...", type: "info" },
      { text: "[INFO] Resolving environment variables: {{base_url}} -> https://api.enterprise.app/v2", type: "info" },
      { text: "[INFO] [REQ] GET /health", type: "info" },
      { text: "[PASS] status: 200, responseTime: 82ms, schema: Match", type: "success", passes: 1, fails: 0, time: 0.1 },
      { text: "[INFO] [REQ] POST /oauth/token", type: "info" },
      { text: "[PASS] Bearer token retrieved successfully.", type: "success", passes: 2, fails: 0, time: 0.3 },
      { text: "[INFO] [REQ] GET /users/profile (Authenticated)", type: "info" },
      { text: "[PASS] JSON response matches UserSchema layout.", type: "success", passes: 3, fails: 0, time: 0.6 },
      { text: "[INFO] [REQ] PUT /users/settings - Modifying notifications configurations", type: "info" },
      { text: "[PASS] Configurations saved correctly.", type: "success", passes: 4, fails: 0, time: 0.9 },
      { text: "[INFO] [REQ] GET /billing/invoice/INV-90210", type: "info" },
      { text: "[FAIL] Invoice total mismatches tax metrics: expected 150.00 but got 148.50", type: "error", passes: 4, fails: 1, time: 1.2 },
      { text: "[INFO] [REQ] DELETE /users/session/active", type: "info" },
      { text: "[PASS] Session cleared. Token revoked.", type: "success", passes: 5, fails: 1, time: 1.5 },
      { text: "[SUCCESS] [SUITE END] API Suite execution concluded.", type: "warning", passes: 5, fails: 1, time: 1.7 }
    ];
  } else if (selectedSuite === "load-test") {
    consoleTitle.textContent = "locust_load_test.log";
    logSteps = [
      { text: "[INFO] 2026-06-01 08:30:00 - Initializing simulated Locust worker instances...", type: "info" },
      { text: "[INFO] Target Host: https://load.enterprise.app", type: "info" },
      { text: "[INFO] Ramping up user swarm rate: 10 users/sec up to maximum 100...", type: "info" },
      { text: "[PASS] Swarm active. 20 virtual users simulated.", type: "success", passes: 5, fails: 0, time: 0.3 },
      { text: "[INFO] HTTP Requests active. Current RPS: 84. Average Latency: 92ms.", type: "info" },
      { text: "[PASS] 50 virtual users simulated. Latency stable.", type: "success", passes: 15, fails: 0, time: 0.8 },
      { text: "[INFO] Swarming threshold reached. 100 virtual users simulated.", type: "info" },
      { text: "[INFO] Current RPS: 412. Average Response Time: 120ms.", type: "info" },
      { text: "[FAIL] HTTP 503 Service Unavailable encountered at /reports/download", type: "error", passes: 15, fails: 1, time: 1.4 },
      { text: "[WARN] Latency spike detected: 980ms latency observed.", type: "warning" },
      { text: "[PASS] 100 users active. Database connections recovered.", type: "success", passes: 35, fails: 1, time: 2.1 },
      { text: "[INFO] Swarm cooldown initiated. Releasing virtual workers...", type: "info" },
      { text: "[SUCCESS] [SUITE END] Load simulation completed successfully.", type: "success", passes: 35, fails: 1, time: 2.5 }
    ];
  }

  let step = 0;
  simInterval = setInterval(() => {
    if (step >= logSteps.length) {
      clearInterval(simInterval);
      runningSim = false;
      btn.style.opacity = "1";
      btn.style.cursor = "pointer";
      btnText.textContent = "Run Suite";
      return;
    }

    const currentStep = logSteps[step];
    
    // Create new log line elements
    const logLine = document.createElement("div");
    logLine.className = `log-line log-${currentStep.type}`;
    logLine.textContent = currentStep.text;
    consoleBody.appendChild(logLine);
    consoleBody.scrollTop = consoleBody.scrollHeight; // Auto scroll

    // Stats updates
    if (currentStep.time) {
      statDuration.textContent = `${currentStep.time.toFixed(1)}s`;
    }
    if (currentStep.passes !== undefined) {
      statPassed.textContent = currentStep.passes;
    }
    if (currentStep.fails !== undefined) {
      statFailed.textContent = currentStep.fails;
    }

    // Radial ring percentage animations
    const percent = Math.round(((step + 1) / logSteps.length) * 100);
    pctLabel.textContent = `${percent}%`;
    const offset = 377 - (377 * percent) / 100;
    circProgress.style.strokeDashoffset = offset;

    step++;
  }, 180);
}

// 9. Premium form submission pipeline
function handleFormSubmit(event) {
  event.preventDefault();
  const form = document.getElementById("portfolio-contact-form");
  const logBox = document.getElementById("contact-console-log");
  const submitBtn = document.getElementById("form-submit-btn");

  const name = document.getElementById("form-name").value;
  const email = document.getElementById("form-email").value;
  const subject = document.getElementById("form-subject").value;
  const msg = document.getElementById("form-message").value;

  logBox.style.display = "block";
  logBox.innerHTML = "<span class='log-info'>[INFO] Compiling contact_form_validator.py...</span><br>";
  submitBtn.disabled = true;
  submitBtn.style.opacity = "0.6";

  const submissionSteps = [
    { text: "[INFO] Parsing payload...", type: "info" },
    { text: `[INFO] Validating fields (name: '${name}', email: '${email}')`, type: "info" },
    { text: "[PASS] Email syntax check complete.", type: "success" },
    { text: "[INFO] Compiling message bytes buffer...", type: "info" },
    { text: "[INFO] Launching outbound POST pipeline...", type: "info" },
    { text: "[PASS] Server response: 200 OK. Message queued.", type: "success" },
    { text: "[SUCCESS] contact_test_suite.py: 100% assertions PASSED! Message Sent.", type: "success" }
  ];

  let step = 0;
  const formTimer = setInterval(() => {
    if (step >= submissionSteps.length) {
      clearInterval(formTimer);
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
      form.reset();
      setTimeout(() => {
        logBox.style.display = "none";
      }, 5000);
      return;
    }

    const currentLine = submissionSteps[step];
    logBox.innerHTML += `<span class="log-${currentLine.type}">${currentLine.text}</span><br>`;
    logBox.scrollTop = logBox.scrollHeight;
    step++;
  }, 350);
}
