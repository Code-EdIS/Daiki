
document.addEventListener("DOMContentLoaded", () => {
  const CONTACT_EMAIL = "info@daikisro.com";

  // Floating navigation
  const header = document.querySelector(".floating-header");

  function updateHeader() {
    header?.classList.toggle("scrolled", window.scrollY > 30);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");

  function closeMenu() {
    mobileNav?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileNav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", event => {
    if (
      mobileNav?.classList.contains("open") &&
      !mobileNav.contains(event.target) &&
      !menuToggle?.contains(event.target)
    ) {
      closeMenu();
    }
  });

  // Scroll reveal
  const revealElements = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -25px 0px"
    });

    revealElements.forEach(element => observer.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add("visible"));
  }

  // Dynamic copyright year
  document.querySelectorAll(".current-year").forEach(element => {
    element.textContent = new Date().getFullYear();
  });

  // Contact form
  const form = document.getElementById("contactForm");
  if (!form) return;

  const interestSelect = document.getElementById("interest");
  const gmailButton = document.getElementById("gmailButton");

  // Product preselection from Solutions page
  const params = new URLSearchParams(window.location.search);
  const interest = params.get("interest");

  if (
    interestSelect &&
    ["image", "usb", "partnership", "general"].includes(interest)
  ) {
    interestSelect.value = interest;
  }

  function buildEmail() {
    if (!form.reportValidity()) return null;

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const company = document.getElementById("company").value.trim();
    const selectedInterest = interestSelect.value;
    const interestLabel = interestSelect.selectedOptions[0].textContent;
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !selectedInterest || !message) return null;

    const subject = `DAIKI Enquiry - ${interestLabel}`;

    const body = [
      "DAIKI - Website Enquiry",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || "Not specified"}`,
      `Area of interest: ${interestLabel}`,
      "",
      "Message:",
      message,
      "",
      "---",
      "Prepared using the DAIKI website contact form."
    ].join("\n");

    return { subject, body };
  }

  // Default email application
  form.addEventListener("submit", event => {
    event.preventDefault();

    const data = buildEmail();
    if (!data) return;

    const mailto =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(data.subject)}` +
      `&body=${encodeURIComponent(data.body)}`;

    window.location.href = mailto;
  });

  // Gmail alternative
  gmailButton?.addEventListener("click", () => {
    const data = buildEmail();
    if (!data) return;

    const gmailURL = new URL("https://mail.google.com/mail/");

    gmailURL.searchParams.set("view", "cm");
    gmailURL.searchParams.set("fs", "1");
    gmailURL.searchParams.set("to", CONTACT_EMAIL);
    gmailURL.searchParams.set("su", data.subject);
    gmailURL.searchParams.set("body", data.body);

    const opened = window.open(
      gmailURL.toString(),
      "_blank"
    );

    if (opened) {
      opened.opener = null;
    } else {
      window.location.assign(gmailURL.toString());
    }
  });
});
