/* ================================================
   DZAKI.DEV — JavaScript (Perfected Edition)
   Page loader, dark mode, scroll animations, navbar,
   active nav, scroll-to-top, scroll progress, counter,
   mouse parallax, contact form, mobile menu
   ================================================ */

(function () {
  "use strict";

  /* ----- Reduced-motion check ----- */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ===== PAGE LOADER ===== */
  const loader = document.getElementById("pageLoader");
  if (loader) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        loader.classList.add("hidden");
      }, 600);
    });
    // Fallback: hide after 3s max
    setTimeout(() => loader.classList.add("hidden"), 3000);
  }

  /* ===== DARK MODE ===== */
  const darkToggle = document.getElementById("darkToggle");
  const savedTheme = localStorage.getItem("theme");

  // Apply saved theme on load
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else if (savedTheme === "light") {
    document.documentElement.removeAttribute("data-theme");
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
    });
  }

  /* ===== SCROLL REVEAL (IntersectionObserver) ===== */
  const animElements = document.querySelectorAll(".animate");

  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    animElements.forEach((el) => revealObserver.observe(el));
  } else {
    animElements.forEach((el) => el.classList.add("show"));
  }

  /* ===== NAVBAR SCROLL EFFECT ===== */
  const nav = document.getElementById("navbar");

  if (nav) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run on load
  }

  /* ===== ACTIVE NAV LINK ON SCROLL ===== */
  const navLinksWithSection = document.querySelectorAll(
    ".nav__links a[data-section]"
  );
  const sections = document.querySelectorAll("section[id], .hero[id]");

  if (navLinksWithSection.length > 0 && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinksWithSection.forEach((link) => {
              link.classList.toggle(
                "active",
                link.getAttribute("data-section") === id
              );
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ===== SCROLL TO TOP ===== */
  const scrollTopBtn = document.getElementById("scrollTop");

  if (scrollTopBtn) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 500) {
          scrollTopBtn.classList.add("visible");
        } else {
          scrollTopBtn.classList.remove("visible");
        }
      },
      { passive: true }
    );

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ===== SCROLL PROGRESS BAR ===== */
  const scrollProgress = document.getElementById("scrollProgress");

  if (scrollProgress) {
    window.addEventListener(
      "scroll",
      () => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + "%";
      },
      { passive: true }
    );
  }

  /* ===== MOUSE PARALLAX GLOW ===== */
  const heroGlow = document.querySelector(".hero__glow");
  const heroSection = document.querySelector(".hero");

  if (heroGlow && heroSection && !prefersReducedMotion) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 40;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 40;
      heroGlow.style.transform = "translate(" + x + "px, " + y + "px)";
    });

    heroSection.addEventListener("mouseleave", () => {
      heroGlow.style.transform = "translate(0, 0)";
    });
  }

  /* ===== COUNTER ANIMATION ===== */
  const counters = document.querySelectorAll(".counter");

  if (counters.length > 0 && !prefersReducedMotion) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute("data-target"), 10);
            const duration = 1500;
            const start = performance.now();

            function updateCounter(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const value = Math.round(eased * target);
              el.textContent = value;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                el.textContent = target;
              }
            }

            requestAnimationFrame(updateCounter);
          } else {
            // Reset when leaving viewport for re-triggering
            entry.target.textContent = "0";
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => counterObserver.observe(c));
  } else {
    // No animation: set values directly
    counters.forEach((c) => {
      c.textContent = c.getAttribute("data-target");
    });
  }

  /* ===== MOBILE MENU TOGGLE ===== */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      navLinks.classList.toggle("open");
      document.body.style.overflow = navLinks.classList.contains("open")
        ? "hidden"
        : "";
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("active");
        navLinks.classList.remove("open");
        document.body.style.overflow = "";
      });
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("open")) {
        navToggle.classList.remove("active");
        navLinks.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  }

  /* ===== CONTACT FORM ===== */
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("formName").value.trim();
      const email = document.getElementById("formEmail").value.trim();
      const message = document.getElementById("formMessage").value.trim();

      if (!name || !email || !message) return;

      // Show success state
      contactForm.classList.add("success");
      contactForm.innerHTML = `
        <div class="form__success">
          <div class="form__success-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3>Pesan Terkirim! 🎉</h3>
          <p>Terima kasih, ${name}. Saya akan segera membalas via email.</p>
        </div>
      `;
    });
  }

  /* ===== SMOOTH ANCHOR SCROLLING ===== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
})();
