const STORAGE_KEY = "ashleyPortfolioData";
const AUTH_KEY = "ashleyDashboardAuthenticated";
const ADMIN_USERNAME = "ashley";
const ADMIN_PASSWORD = "Ashley@2026";
const dashboardYear = document.querySelector("#dashboardYear");

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

const listConfig = {
  stats: { selector: "#statsList", fields: ["value", "label"], empty: { value: "", label: "" } },
  skills: { selector: "#skillsList", fields: ["icon", "title", "text"], empty: { icon: "fa-solid fa-circle", title: "", text: "" } },
  experience: { selector: "#experienceList", fields: ["title", "text"], empty: { title: "", text: "" } },
  projects: { selector: "#projectsList", fields: ["icon", "title", "text"], empty: { icon: "fa-solid fa-circle", title: "", text: "" } },
  education: { selector: "#educationList", fields: ["qualification", "area", "status"], empty: { qualification: "", area: "", status: "Completed" } },
  strengths: { selector: "#strengthsList", fields: ["text"], empty: "" },
  footerLinks: { selector: "#footerLinksList", fields: ["label", "href"], empty: { label: "", href: "" } },
};

let portfolioData = loadData();

function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

function showDashboard() {
  document.querySelector("#loginScreen").classList.add("is-hidden");
  document.querySelectorAll(".dashboard-private").forEach((element) => {
    element.classList.remove("is-hidden");
  });
}

function showLogin() {
  document.querySelector("#loginScreen").classList.remove("is-hidden");
  document.querySelectorAll(".dashboard-private").forEach((element) => {
    element.classList.add("is-hidden");
  });
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function loadData() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    return structuredClone(defaultPortfolioData);
  }

  try {
    return { ...structuredClone(defaultPortfolioData), ...JSON.parse(savedData) };
  } catch {
    return structuredClone(defaultPortfolioData);
  }
}

function saveData() {
  collectFormData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolioData));
  renderDashboard();
  showStatus("Saved. Open the portfolio page to see the updates.");
}

function showStatus(message) {
  const status = document.querySelector("#statusMessage");
  status.textContent = message;
  window.setTimeout(() => {
    status.textContent = "";
  }, 3500);
}

function setField(id, value) {
  const field = document.querySelector(id);

  if (field) {
    field.value = value || "";
  }
}

function fillProfileForm() {
  setField("#profileName", portfolioData.profile.name);
  setField("#profileTitle", portfolioData.profile.title);
  setField("#profileSummary", portfolioData.profile.summary);
  setField("#profileCardTitle", portfolioData.profile.cardTitle);
  setField("#profileCardText", portfolioData.profile.cardText);
  setField("#phone1", portfolioData.contact.phone1);
  setField("#phone2", portfolioData.contact.phone2);
  setField("#email", portfolioData.contact.email);
  setField("#location", portfolioData.contact.location);
  setField("#footerText", portfolioData.footer?.text);
}

function collectFormData() {
  portfolioData.profile = {
    name: document.querySelector("#profileName").value.trim(),
    title: document.querySelector("#profileTitle").value.trim(),
    summary: document.querySelector("#profileSummary").value.trim(),
    cardTitle: document.querySelector("#profileCardTitle").value.trim(),
    cardText: document.querySelector("#profileCardText").value.trim(),
  };

  portfolioData.contact = {
    phone1: document.querySelector("#phone1").value.trim(),
    phone2: document.querySelector("#phone2").value.trim(),
    email: document.querySelector("#email").value.trim(),
    location: document.querySelector("#location").value.trim(),
  };

  portfolioData.footer = {
    text: document.querySelector("#footerText").value.trim(),
    links: portfolioData.footer?.links || [],
  };

  Object.entries(listConfig).forEach(([section, config]) => {
    const rows = [...document.querySelectorAll(`${config.selector} .editable-item`)];
    const targetSection = section === "footerLinks" ? "links" : section;

    const items = rows.map((row) => {
      if (section === "strengths") {
        return row.querySelector("[data-field='text']").value.trim();
      }

      return Object.fromEntries(
        config.fields.map((field) => [field, row.querySelector(`[data-field='${field}']`).value.trim()])
      );
    }).filter((item) => {
      if (typeof item === "string") {
        return item.length > 0;
      }

      return Object.values(item).some(Boolean);
    });

    if (section === "footerLinks") {
      portfolioData.footer.links = items;
      return;
    }

    portfolioData[targetSection] = items;
  });
}

function fieldMarkup(section, item, index) {
  const config = listConfig[section];

  return config.fields
    .map((field) => {
      const value = section === "strengths" ? item : item[field];
      const safeValue = escapeHtml(value || "");
      const isLong = field === "text" || field === "area";
      const label = field.charAt(0).toUpperCase() + field.slice(1);

      if (isLong) {
        return `
          <div class="wide">
            <label class="form-label" for="${section}-${index}-${field}">${label}</label>
            <textarea class="form-control" id="${section}-${index}-${field}" data-field="${field}" rows="3">${safeValue}</textarea>
          </div>`;
      }

      return `
        <div>
          <label class="form-label" for="${section}-${index}-${field}">${label}</label>
          <input class="form-control" id="${section}-${index}-${field}" data-field="${field}" type="text" value="${safeValue}">
        </div>`;
    })
    .join("");
}

function renderList(section) {
  const container = document.querySelector(listConfig[section].selector);
  const items = section === "footerLinks" ? portfolioData.footer?.links || [] : portfolioData[section];

  container.innerHTML = items
    .map(
      (item, index) => `
        <div class="editable-item" data-section="${section}" data-index="${index}">
          <div class="editable-item-header">
            <strong>${section.charAt(0).toUpperCase() + section.slice(1)} ${index + 1}</strong>
            <button class="btn btn-sm btn-outline-danger" data-remove="${section}" data-index="${index}" type="button">Remove</button>
          </div>
          <div class="field-grid">${fieldMarkup(section, item, index)}</div>
        </div>`
    )
    .join("");
}

function updateCounts() {
  document.querySelector("#skillCount").textContent = portfolioData.skills.length;
  document.querySelector("#experienceCount").textContent = portfolioData.experience.length;
  document.querySelector("#projectCount").textContent = portfolioData.projects.length;
  document.querySelector("#educationCount").textContent = portfolioData.education.length;
}

function renderDashboard() {
  fillProfileForm();
  Object.keys(listConfig).forEach(renderList);
  updateCounts();
}

document.querySelector("#saveButton").addEventListener("click", saveData);

document.querySelector("#loginForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.querySelector("#loginUsername").value.trim();
  const password = document.querySelector("#loginPassword").value;
  const error = document.querySelector("#loginError");

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, "true");
    error.textContent = "";
    showDashboard();
    renderDashboard();
    return;
  }

  error.textContent = "Invalid username or password.";
});

document.querySelector("#forgotLoginButton").addEventListener("click", () => {
  const recovery = document.querySelector("#loginRecovery");
  recovery.innerHTML = `Username: ${escapeHtml(ADMIN_USERNAME)}<br>Password: ${escapeHtml(ADMIN_PASSWORD)}`;
  recovery.classList.add("is-visible");
});

document.querySelector("#logoutButton").addEventListener("click", () => {
  sessionStorage.removeItem(AUTH_KEY);
  showLogin();
});

document.querySelector("#resetButton").addEventListener("click", () => {
  if (!confirm("Reset the dashboard content to the original default portfolio data?")) {
    return;
  }

  portfolioData = structuredClone(defaultPortfolioData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolioData));
  renderDashboard();
  showStatus("Defaults restored.");
});

document.querySelector("#exportButton").addEventListener("click", () => {
  collectFormData();
  document.querySelector("#jsonData").value = JSON.stringify(portfolioData, null, 2);
  showStatus("JSON exported below.");
});

document.querySelector("#importButton").addEventListener("click", () => {
  try {
    portfolioData = { ...structuredClone(defaultPortfolioData), ...JSON.parse(document.querySelector("#jsonData").value) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolioData));
    renderDashboard();
    showStatus("JSON imported and saved.");
  } catch {
    showStatus("Import failed. Check the JSON format.");
  }
});

document.addEventListener("click", (event) => {
  const addSection = event.target.dataset.add;
  const removeSection = event.target.dataset.remove;

  if (addSection) {
    collectFormData();
    if (addSection === "footerLinks") {
      portfolioData.footer.links.push(structuredClone(listConfig[addSection].empty));
    } else {
      portfolioData[addSection].push(structuredClone(listConfig[addSection].empty));
    }
    renderDashboard();
  }

  if (removeSection) {
    collectFormData();
    if (removeSection === "footerLinks") {
      portfolioData.footer.links.splice(Number(event.target.dataset.index), 1);
    } else {
      portfolioData[removeSection].splice(Number(event.target.dataset.index), 1);
    }
    renderDashboard();
  }
});

if (isAuthenticated()) {
  showDashboard();
  renderDashboard();
} else {
  showLogin();
}

if (dashboardYear) {
  dashboardYear.textContent = new Date().getFullYear();
}
