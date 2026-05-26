const STORAGE_KEY = "ashleyPortfolioData";

const defaultPortfolioData = {
  profile: {
    name: "Ashley Killie",
    title: "ICT Systems & Field Deployment Officer, Web Developer, and Systems Administrator based in Wewak, East Sepik Province, Papua New Guinea.",
    summary:
      "I bring 8+ years of ICT experience supporting government and private sector operations, with practical strengths across systems deployment, website development, Microsoft 365 support, networking, end-user support, and business-focused ICT standardization.",
    cardTitle: "ICT Professional",
    cardText:
      "Systems deployment, administration, and web solutions for public service and business environments.",
  },
  stats: [
    { value: "8+", label: "Years Experience" },
    { value: "PNG", label: "Based in Wewak" },
    { value: "360", label: "ICT Support Focus" },
  ],
  skills: [
    { icon: "fa-solid fa-laptop-code", title: "Systems Deployment", text: "Rollout planning, user setup, device preparation, and field implementation support." },
    { icon: "fa-solid fa-code", title: "Web Development", text: "Responsive websites and prototypes using HTML, CSS, JavaScript, PHP, and MySQL." },
    { icon: "fa-brands fa-microsoft", title: "Microsoft 365", text: "Email, collaboration, account support, productivity tools, and user administration." },
    { icon: "fa-solid fa-network-wired", title: "Networking", text: "LAN support, connectivity troubleshooting, basic infrastructure, and site support." },
    { icon: "fa-solid fa-server", title: "Citrix", text: "Application access support, user assistance, and virtual environment troubleshooting." },
    { icon: "fa-brands fa-wordpress", title: "WordPress", text: "Website setup, content management, theme customization, and maintenance support." },
    { icon: "fa-solid fa-database", title: "PHP & MySQL", text: "Database-driven prototypes, forms, reporting concepts, and small MIS builds." },
    { icon: "fa-solid fa-headset", title: "ICT Support", text: "Customer-focused troubleshooting for users, departments, and field teams." },
  ],
  experience: [
    { title: "East Sepik Provincial Administration", text: "ICT systems support, deployment coordination, website initiatives, and ICT standardization for provincial government operations." },
    { title: "Civil & National Identity Registration", text: "Field deployment support, systems assistance, user troubleshooting, and technology support for registration services." },
    { title: "Avenall Engineering Systems", text: "ICT and systems support in a technical private sector environment, including infrastructure and end-user assistance." },
    { title: "Monian Group", text: "Operational ICT support, systems administration tasks, and customer-focused technical troubleshooting." },
    { title: "Airways Hotel", text: "Hospitality ICT support experience, supporting users, systems, and service-focused technology operations." },
  ],
  projects: [
    { icon: "fa-solid fa-chart-line", title: "MIS Prototypes", text: "Designed practical management information system concepts for reporting, records, and operational visibility." },
    { icon: "fa-solid fa-landmark", title: "Government Websites", text: "Supported digital presence initiatives for public sector communication, accessibility, and service information." },
    { icon: "fa-solid fa-screwdriver-wrench", title: "ICT Standardization", text: "Contributed to repeatable ICT processes, consistent support practices, and improved deployment readiness." },
    { icon: "fa-solid fa-robot", title: "AI-Assisted Systems", text: "Used AI-assisted tools to speed up planning, prototyping, documentation, and system development workflows." },
  ],
  education: [
    { qualification: "Diploma", area: "Information and Communication Technology", status: "Completed" },
    { qualification: "Certificates", area: "ICT, systems, and professional development", status: "Completed" },
    { qualification: "Bachelor of Business in IT", area: "Business information systems and technology management", status: "Ongoing" },
  ],
  strengths: [
    "Strong troubleshooting across hardware, software, network, and user issues.",
    "Customer-focused support for staff, departments, and operational teams.",
    "Adaptability in government, hospitality, engineering, and field deployment settings.",
    "Teamwork, documentation, and clear communication with technical and non-technical users.",
    "Confident use of AI-assisted tools for faster prototyping, planning, and learning.",
  ],
  contact: {
    phone1: "+675 7000 0000",
    phone2: "+675 7200 0000",
    email: "ashley.killie@example.com",
    location: "Wewak, East Sepik Province, Papua New Guinea",
  },
  footer: {
    text: "Ashley Killie. All rights reserved.",
    links: [
      { label: "Home", href: "#home" },
      { label: "Projects", href: "#projects" },
      { label: "Contact", href: "#contact" },
      { label: "Dashboard", href: "dashboard.html" },
    ],
  },
};

const year = document.querySelector("#year");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const navbarCollapse = document.querySelector(".navbar-collapse");

function loadPortfolioData() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    return defaultPortfolioData;
  }

  try {
    return { ...defaultPortfolioData, ...JSON.parse(savedData) };
  } catch {
    return defaultPortfolioData;
  }
}

function setText(selector, value) {
  const element = document.querySelector(selector);

  if (element && value) {
    element.textContent = value;
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeIcon(value = "") {
  return String(value).replace(/[^a-z0-9 -]/gi, "").trim() || "fa-solid fa-circle";
}

function safeHref(value = "") {
  const href = String(value).trim();
  const isSafe = href.startsWith("#") || href.endsWith(".html") || href.startsWith("mailto:") || href.startsWith("tel:");

  return isSafe ? href : "#";
}

function renderPortfolio() {
  const data = loadPortfolioData();

  setText(".hero h1", data.profile.name);
  setText(".hero .lead", data.profile.title);
  setText(".hero-summary", data.profile.summary);
  setText(".profile-card h2", data.profile.cardTitle);
  setText(".profile-card p", data.profile.cardText);

  const stats = document.querySelector(".profile-stats");
  if (stats) {
    stats.innerHTML = data.stats
      .map((item) => `<div><dt>${escapeHtml(item.value)}</dt><dd>${escapeHtml(item.label)}</dd></div>`)
      .join("");
  }

  const skills = document.querySelector("#skills .row.g-4");
  if (skills) {
    skills.innerHTML = data.skills
      .map(
        (item) => `
          <div class="col-sm-6 col-lg-3">
            <article class="skill-card">
              <i class="${safeIcon(item.icon)}" aria-hidden="true"></i>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </article>
          </div>`
      )
      .join("");
  }

  const timeline = document.querySelector("#experience .timeline");
  if (timeline) {
    timeline.innerHTML = data.experience
      .map(
        (item) => `
          <article class="timeline-item">
            <div class="timeline-dot" aria-hidden="true"></div>
            <div class="timeline-content">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </div>
          </article>`
      )
      .join("");
  }

  const projects = document.querySelector("#projects .row.g-4");
  if (projects) {
    projects.innerHTML = data.projects
      .map(
        (item) => `
          <div class="col-md-6 col-xl-3">
            <article class="project-card">
              <div class="project-icon"><i class="${safeIcon(item.icon)}" aria-hidden="true"></i></div>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </article>
          </div>`
      )
      .join("");
  }

  const education = document.querySelector("#education tbody");
  if (education) {
    education.innerHTML = data.education
      .map(
        (item) => `
          <tr>
            <td>${escapeHtml(item.qualification)}</td>
            <td>${escapeHtml(item.area)}</td>
            <td><span class="badge ${item.status.toLowerCase() === "ongoing" ? "text-bg-warning" : "text-bg-primary"}">${escapeHtml(item.status)}</span></td>
          </tr>`
      )
      .join("");
  }

  const strengths = document.querySelector(".strength-list");
  if (strengths) {
    strengths.innerHTML = data.strengths
      .map((item) => `<li><i class="fa-solid fa-circle-check" aria-hidden="true"></i> ${escapeHtml(item)}</li>`)
      .join("");
  }

  const contact = document.querySelector("#contact .row.g-4");
  if (contact) {
    contact.innerHTML = `
      <div class="col-md-4">
        <article class="contact-card">
          <i class="fa-solid fa-phone" aria-hidden="true"></i>
          <h3>Phone</h3>
          <p><a href="tel:${escapeHtml(data.contact.phone1.replaceAll(" ", ""))}">${escapeHtml(data.contact.phone1)}</a></p>
          <p><a href="tel:${escapeHtml(data.contact.phone2.replaceAll(" ", ""))}">${escapeHtml(data.contact.phone2)}</a></p>
        </article>
      </div>
      <div class="col-md-4">
        <article class="contact-card">
          <i class="fa-solid fa-envelope" aria-hidden="true"></i>
          <h3>Email</h3>
          <p><a href="mailto:${escapeHtml(data.contact.email)}">${escapeHtml(data.contact.email)}</a></p>
        </article>
      </div>
      <div class="col-md-4">
        <article class="contact-card">
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
          <h3>Location</h3>
          <p>${escapeHtml(data.contact.location)}</p>
        </article>
      </div>`;
  }

  const footerText = document.querySelector(".site-footer .footer-content p");
  if (footerText) {
    footerText.innerHTML = `&copy; <span id="year">${new Date().getFullYear()}</span> ${escapeHtml(data.footer?.text || defaultPortfolioData.footer.text)}`;
  }

  const footerLinks = document.querySelector(".site-footer .footer-links");
  if (footerLinks) {
    footerLinks.innerHTML = (data.footer?.links || defaultPortfolioData.footer.links)
      .map((item) => `<li><a href="${escapeHtml(safeHref(item.href))}">${escapeHtml(item.label)}</a></li>`)
      .join("");
  }
}

if (year) {
  year.textContent = new Date().getFullYear();
}

renderPortfolio();

const messageForm = document.querySelector("#messageForm");
if (messageForm) {
  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = loadPortfolioData();
    const status = document.querySelector("#messageStatus");
    const formData = new FormData(messageForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message,
    ].join("\n");

    window.location.href = `mailto:${data.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = "Your email app should open with the message ready to send.";
    messageForm.reset();
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (navbarCollapse?.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isActive);
      });
    });
  },
  {
    rootMargin: "-45% 0px -45% 0px",
    threshold: 0,
  }
);

sections.forEach((section) => observer.observe(section));
