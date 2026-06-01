/* Digital Clock JavaScript */

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Australia/Perth',
  'Pacific/Auckland',
  'Pacific/Fiji',
  'America/Sao_Paulo',
  'America/Mexico_City',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Asia/Singapore',
  'Asia/Jakarta'
];

const DOM = {
  primaryClock: document.getElementById('primaryClock'),
  primaryDate: document.getElementById('primaryDate'),
  localTimezone: document.getElementById('localTimezone'),
  utcOffset: document.getElementById('utcOffset'),
  dayOfWeek: document.getElementById('dayOfWeek'),
  weekNumber: document.getElementById('weekNumber'),
  timezoneSelect: document.getElementById('timezoneSelect'),
  addTimezoneBtn: document.getElementById('addTimezoneBtn'),
  activeTimezonesContainer: document.getElementById('activeTimezonesContainer'),
  noTimezonesMessage: document.getElementById('noTimezonesMessage'),
  year: document.getElementById('year')
};

let activeTimezones = [];
let updateInterval;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeTimezoneSelect();
  setupEventListeners();
  updateClock();
  startClockUpdates();
  setCurrentYear();
});

function setCurrentYear() {
  DOM.year.textContent = new Date().getFullYear();
}

function initializeTimezoneSelect() {
  const fragment = document.createDocumentFragment();
  
  TIMEZONES.forEach(tz => {
    const option = document.createElement('option');
    option.value = tz;
    option.textContent = tz.replace(/_/g, ' ');
    fragment.appendChild(option);
  });
  
  DOM.timezoneSelect.appendChild(fragment);
}

function setupEventListeners() {
  DOM.addTimezoneBtn.addEventListener('click', addTimezone);
  DOM.timezoneSelect.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTimezone();
  });

  // Quick add buttons
  document.querySelectorAll('.quick-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tz = btn.dataset.timezone;
      addSpecificTimezone(tz);
    });
  });
}

function addTimezone() {
  const selected = DOM.timezoneSelect.value;
  if (selected) {
    addSpecificTimezone(selected);
  }
}

function addSpecificTimezone(timezone) {
  if (!activeTimezones.includes(timezone)) {
    activeTimezones.push(timezone);
    DOM.timezoneSelect.value = '';
    renderActiveTimezones();
  }
}

function removeTimezone(timezone) {
  activeTimezones = activeTimezones.filter(tz => tz !== timezone);
  renderActiveTimezones();
}

function renderActiveTimezones() {
  const container = DOM.activeTimezonesContainer;
  
  if (activeTimezones.length === 0) {
    container.innerHTML = `
      <div id="noTimezonesMessage" class="col-12 text-center py-5">
        <i class="fa-solid fa-clock fa-3x text-muted mb-3"></i>
        <p class="text-muted">No additional time zones added yet. Select one above to get started.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  container.className = 'row';
  
  activeTimezones.forEach(timezone => {
    const card = createTimezoneCard(timezone);
    container.appendChild(card);
  });
}

function createTimezoneCard(timezone) {
  const col = document.createElement('div');
  col.className = 'col-md-6 col-lg-4';
  
  const card = document.createElement('div');
  card.className = 'timezone-card';
  
  const now = new Date();
  const tzTime = getTimeInTimezone(now, timezone);
  
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
  removeBtn.setAttribute('aria-label', `Remove ${timezone}`);
  removeBtn.addEventListener('click', () => removeTimezone(timezone));
  
  card.appendChild(removeBtn);
  
  const nameDiv = document.createElement('div');
  nameDiv.className = 'timezone-name';
  nameDiv.textContent = timezone.replace(/_/g, ' ');
  card.appendChild(nameDiv);
  
  const timeDiv = document.createElement('div');
  timeDiv.className = 'timezone-time';
  timeDiv.textContent = formatTime(tzTime);
  timeDiv.dataset.timezone = timezone;
  card.appendChild(timeDiv);
  
  const dateDiv = document.createElement('div');
  dateDiv.className = 'timezone-date';
  dateDiv.textContent = formatDate(tzTime);
  card.appendChild(dateDiv);
  
  const infoDiv = document.createElement('div');
  infoDiv.className = 'timezone-info';
  
  const offset = getUTCOffset(tzTime, timezone);
  
  infoDiv.innerHTML = `
    <span>
      <i class="fa-solid fa-globe"></i>
      ${offset}
    </span>
    <span>
      <i class="fa-solid fa-sun"></i>
      ${getDayName(tzTime.getDay())}
    </span>
  `;
  
  card.appendChild(infoDiv);
  col.appendChild(card);
  
  return col;
}

function updateClock() {
  const now = new Date();
  
  // Update primary clock (local time)
  const timeStr = formatTime(now);
  DOM.primaryClock.querySelector('.clock-time').textContent = timeStr;
  DOM.primaryDate.textContent = formatFullDate(now);
  
  // Get local timezone
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  DOM.localTimezone.textContent = localTz.replace(/_/g, ' ');
  
  // Update UTC offset
  const offset = getUTCOffset(now, localTz);
  DOM.utcOffset.textContent = offset;
  
  // Update day of week
  DOM.dayOfWeek.textContent = getDayName(now.getDay());
  
  // Update week number
  DOM.weekNumber.textContent = getWeekNumber(now);
  
  // Update active timezone cards
  document.querySelectorAll('.timezone-time').forEach(el => {
    const timezone = el.dataset.timezone;
    const tzTime = getTimeInTimezone(now, timezone);
    el.textContent = formatTime(tzTime);
    
    const dateEl = el.nextElementSibling;
    if (dateEl) {
      dateEl.textContent = formatDate(tzTime);
    }
  });
}

function startClockUpdates() {
  updateInterval = setInterval(updateClock, 100); // Update every 100ms for smooth display
}

function getTimeInTimezone(date, timezone) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const parts = formatter.formatToParts(date);
    const result = {};
    
    parts.forEach(part => {
      result[part.type] = part.value;
    });
    
    const tzDate = new Date(
      `${result.year}-${result.month}-${result.day}T${result.hour}:${result.minute}:${result.second}Z`
    );
    
    return tzDate;
  } catch (e) {
    console.error(`Error getting time for timezone ${timezone}:`, e);
    return date;
  }
}

function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function formatDate(date) {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function formatFullDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function getDayName(dayIndex) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
}

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function getUTCOffset(date, timezone) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset'
    });
    
    const parts = formatter.formatToParts(date);
    const offset = parts.find(p => p.type === 'timeZoneName')?.value || 'UTC';
    return offset;
  } catch (e) {
    return 'UTC';
  }
}

// Cleanup on page unload
window.addEventListener('unload', () => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
