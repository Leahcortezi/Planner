import './styles.css';

const storageKey = 'plannerDashboardDataV1';

const idGenerator =
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? () => crypto.randomUUID()
    : () => `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const categoryConfig = {
  class: { label: 'Class', color: '#7a5cff', icon: '🎓' },
  shift: { label: 'Shift', color: '#34c759', icon: '💼' },
  appointment: { label: 'Appointment', color: '#0a84ff', icon: '📍' },
  plan: { label: 'Plan', color: '#ff9f0a', icon: '🗓️' },
  deadline_school: { label: 'School Deadline', color: '#ff375f', icon: '📚' },
  deadline_work: { label: 'Work Deadline', color: '#ff453a', icon: '📌' },
  money: { label: 'Money', color: '#30b0c7', icon: '💳' }
};

const demoData = {
  events: [
    {
      id: idGenerator(),
      title: 'Biology Lecture',
      category: 'class',
      date: isoDateOffset(0),
      startTime: '09:30',
      endTime: '10:45',
      notes: 'Bring lab notebook',
      accountId: ''
    },
    {
      id: idGenerator(),
      title: 'Coffee Shift',
      category: 'shift',
      date: isoDateOffset(0),
      startTime: '13:00',
      endTime: '18:00',
      notes: 'Close register',
      accountId: ''
    },
    {
      id: idGenerator(),
      title: 'UX Assignment Due',
      category: 'deadline_school',
      date: isoDateOffset(2),
      startTime: '23:59',
      endTime: '',
      notes: 'Submit on portal',
      accountId: ''
    }
  ],
  trackers: [
    {
      id: idGenerator(),
      name: 'Laundry',
      type: 'chore',
      frequencyDays: 7,
      period: 'week',
      lastDone: isoDateOffset(-5),
      checks: {}
    },
    {
      id: idGenerator(),
      name: 'Yoga',
      type: 'selfcare',
      frequencyDays: 2,
      period: 'week',
      lastDone: isoDateOffset(-1),
      checks: {}
    },
    {
      id: idGenerator(),
      name: 'Birth Control',
      type: 'selfcare',
      frequencyDays: 1,
      period: 'month',
      lastDone: isoDateOffset(-1),
      checks: {}
    }
  ],
  accounts: [
    {
      id: idGenerator(),
      name: 'Main Checking',
      balance: 980
    },
    {
      id: idGenerator(),
      name: 'Bills Checking',
      balance: 410
    }
  ]
};

const state = {
  selectedDate: todayISO(),
  activeTab: 'schedule',
  modal: null,
  data: loadData()
};

const app = document.querySelector('#app');

render();

function render() {
  app.innerHTML = `
    <main class="screen">
      <header class="top">
        <div>
          <p class="caption">Planner</p>
          <h1>${formatLongDate(state.selectedDate)}</h1>
        </div>
        <button class="pill" data-action="jump-today">Today</button>
      </header>

      <section class="card day-overview">
        <div class="section-head">
          <h2>Your Day</h2>
          <p>${countEventsForDate(state.selectedDate)} items</p>
        </div>
        <div class="event-list">${renderDayEvents(state.selectedDate)}</div>
      </section>

      <section class="card">
        <div class="section-head">
          <h2>Calendar</h2>
          <p>${monthTitle(state.selectedDate)}</p>
        </div>
        ${renderCalendar(state.selectedDate)}
      </section>

      <nav class="tabs">
        <button class="tab ${state.activeTab === 'schedule' ? 'active' : ''}" data-tab="schedule">Schedule</button>
        <button class="tab ${state.activeTab === 'trackers' ? 'active' : ''}" data-tab="trackers">Trackers</button>
        <button class="tab ${state.activeTab === 'money' ? 'active' : ''}" data-tab="money">Money</button>
      </nav>

      <section class="content">
        ${renderActiveTab()}
      </section>

      <button class="fab" data-action="quick-add">＋</button>
    </main>

    ${renderModal()}
  `;

  bindEvents();
}

function renderActiveTab() {
  if (state.activeTab === 'trackers') return renderTrackers();
  if (state.activeTab === 'money') return renderMoney();
  return renderScheduleTab();
}

function renderScheduleTab() {
  const selected = eventsForDate(state.selectedDate);
  return `
    <div class="card soft">
      <div class="section-head">
        <h3>${formatShortDate(state.selectedDate)}</h3>
        <button class="ghost" data-action="new-event">Add Event</button>
      </div>
      <div class="event-list">${renderEventRows(selected, true)}</div>
    </div>
  `;
}

function renderTrackers() {
  const trackers = state.data.trackers;
  return `
    <div class="card soft">
      <div class="section-head">
        <h3>Chores & Self-Care</h3>
        <button class="ghost" data-action="new-tracker">Add Tracker</button>
      </div>
      <div class="tracker-list">
        ${
          trackers.length
            ? trackers.map((tracker) => renderTrackerCard(tracker)).join('')
            : '<p class="empty">No trackers yet.</p>'
        }
      </div>
    </div>
  `;
}

function renderMoney() {
  const { accounts } = state.data;
  const moneyEvents = state.data.events
    .filter((event) => event.category === 'money')
    .sort(sortByDateTime)
    .slice(0, 6);

  return `
    <div class="stack">
      <div class="card soft">
        <div class="section-head">
          <h3>Checking Accounts</h3>
          <button class="ghost" data-action="new-account">Add Account</button>
        </div>
        <div class="account-grid">
          ${
            accounts.length
              ? accounts.map((account) => renderAccountCard(account)).join('')
              : '<p class="empty">No accounts yet.</p>'
          }
        </div>
      </div>
      <div class="card soft">
        <div class="section-head">
          <h3>Upcoming Money Items</h3>
          <button class="ghost" data-action="new-money-event">Add Item</button>
        </div>
        <div class="event-list">${renderEventRows(moneyEvents, true)}</div>
      </div>
    </div>
  `;
}

function renderTrackerCard(tracker) {
  const daysLeft = trackerDaysLeft(tracker);
  const periodKey = currentPeriodKey(tracker.period);
  const checked = Boolean(tracker.checks[periodKey]);
  const progressPercent = trackerProgressPercent(tracker, daysLeft);
  const trackerIcon = tracker.type === 'chore' ? '🧹' : '🌸';
  const statusLabel = daysLeft === 0 ? 'Due now' : `${daysLeft}d left`;
  return `
    <article class="tracker-card ${tracker.type}">
      <div class="tracker-top">
        <div class="tracker-icon">${trackerIcon}</div>
        <div class="tracker-title-wrap">
          <p class="tracker-type ${tracker.type}">${tracker.type === 'chore' ? 'Chore' : 'Self-Care'}</p>
          <h4>${escapeHtml(tracker.name)}</h4>
          <p class="muted">Every ${tracker.frequencyDays} day${tracker.frequencyDays === 1 ? '' : 's'} • ${tracker.period}</p>
        </div>
        <p class="tracker-chip ${daysLeft === 0 ? 'due' : ''}">${statusLabel}</p>
      </div>
      <div class="tracker-progress">
        <div class="tracker-progress-fill ${daysLeft === 0 ? 'due' : ''}" style="width:${progressPercent}%"></div>
      </div>
      <div class="tracker-actions">
        <label class="check-wrap">
          <input type="checkbox" data-action="toggle-check" data-id="${tracker.id}" ${checked ? 'checked' : ''} />
          ${tracker.period === 'week' ? 'Done this week' : 'Done this month'}
        </label>
        <button class="pill" data-action="mark-done" data-id="${tracker.id}">Mark done today</button>
        <div class="row-actions">
          <button class="tiny" data-action="edit-tracker" data-id="${tracker.id}">Edit</button>
          <button class="tiny danger" data-action="delete-tracker" data-id="${tracker.id}">Delete</button>
        </div>
      </div>
    </article>
  `;
}

function renderAccountCard(account) {
  return `
    <article class="account-card">
      <p>${escapeHtml(account.name)}</p>
      <h4>${formatCurrency(account.balance)}</h4>
      <div class="row-actions">
        <button class="tiny" data-action="edit-account" data-id="${account.id}">Edit</button>
        <button class="tiny danger" data-action="delete-account" data-id="${account.id}">Delete</button>
      </div>
    </article>
  `;
}

function renderDayEvents(date) {
  const events = eventsForDate(date);
  return renderEventRows(events, false);
}

function renderEventRows(events, showActions) {
  if (!events.length) return '<p class="empty">Nothing scheduled yet.</p>';
  return events
    .map((event) => {
      const category = categoryConfig[event.category] ?? categoryConfig.plan;
      return `
        <article class="event-row">
          <div class="event-dot" style="background:${category.color}"></div>
          <div class="event-main">
            <p class="badge">${category.icon} ${category.label}</p>
            <h4>${escapeHtml(event.title)}</h4>
            <p class="muted">${formatTimeRange(event.startTime, event.endTime)} ${event.notes ? `• ${escapeHtml(event.notes)}` : ''}</p>
          </div>
          ${
            showActions
              ? `<div class="row-actions">
                    <button class="tiny" data-action="edit-event" data-id="${event.id}">Edit</button>
                    <button class="tiny danger" data-action="delete-event" data-id="${event.id}">Delete</button>
                 </div>`
              : ''
          }
        </article>
      `;
    })
    .join('');
}

function renderCalendar(selectedDate) {
  const date = new Date(`${selectedDate}T12:00:00`);
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let index = 0; index < startWeekDay; index += 1) cells.push('<div class="cal-cell blank"></div>');

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dayIso = new Date(year, month, day, 12).toISOString().slice(0, 10);
    const isSelected = dayIso === state.selectedDate;
    const isToday = dayIso === todayISO();
    const dayEvents = eventsForDate(dayIso);
    const dots = dayEvents
      .slice(0, 3)
      .map((event) => {
        const category = categoryConfig[event.category] ?? categoryConfig.plan;
        return `<span style="background:${category.color}"></span>`;
      })
      .join('');

    cells.push(`
      <button class="cal-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}" data-action="select-date" data-date="${dayIso}">
        <strong>${day}</strong>
        <span class="dots">${dots}</span>
      </button>
    `);
  }

  return `
    <div class="weekday-row">
      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
    </div>
    <div class="calendar-grid">${cells.join('')}</div>
  `;
}

function renderModal() {
  if (!state.modal) return '';

  if (state.modal.type === 'quick-add') {
    return `
      <div class="modal-backdrop" data-action="close-modal">
        <div class="modal" data-stop>
          <h3>Quick Add</h3>
          <div class="quick-grid">
            <button data-action="quick-preset" data-preset="class">Class</button>
            <button data-action="quick-preset" data-preset="shift">Shift</button>
            <button data-action="quick-preset" data-preset="appointment">Appointment</button>
            <button data-action="quick-preset" data-preset="plan">Plan</button>
            <button data-action="quick-preset" data-preset="deadline_school">School Deadline</button>
            <button data-action="quick-preset" data-preset="deadline_work">Work Deadline</button>
            <button data-action="quick-preset" data-preset="money">Money Item</button>
            <button data-action="open-tracker-form">Tracker</button>
          </div>
        </div>
      </div>
    `;
  }

  if (state.modal.type === 'event-form') {
    const event = state.modal.editing || {
      title: '',
      category: state.modal.preset || 'plan',
      date: state.selectedDate,
      startTime: '',
      endTime: '',
      notes: '',
      accountId: ''
    };

    return `
      <div class="modal-backdrop" data-action="close-modal">
        <form class="modal form" data-form="event" data-stop>
          <h3>${state.modal.editing ? 'Edit Event' : 'New Event'}</h3>
          <label>Title<input required name="title" value="${escapeHtml(event.title)}" /></label>
          <label>Category
            <select name="category">
              ${Object.entries(categoryConfig)
                .map(([key, value]) => `<option value="${key}" ${event.category === key ? 'selected' : ''}>${value.label}</option>`)
                .join('')}
            </select>
          </label>
          <label>Date<input required type="date" name="date" value="${event.date}" /></label>
          <div class="double">
            <label>Start<input type="time" name="startTime" value="${event.startTime || ''}" /></label>
            <label>End<input type="time" name="endTime" value="${event.endTime || ''}" /></label>
          </div>
          <label>Notes<input name="notes" value="${escapeHtml(event.notes || '')}" /></label>
          <label>Account (for money items)
            <select name="accountId">
              <option value="">None</option>
              ${state.data.accounts
                .map((account) => `<option value="${account.id}" ${event.accountId === account.id ? 'selected' : ''}>${escapeHtml(account.name)}</option>`)
                .join('')}
            </select>
          </label>
          <div class="modal-actions">
            <button type="button" class="ghost" data-action="close-modal">Cancel</button>
            <button class="pill" type="submit">Save</button>
          </div>
        </form>
      </div>
    `;
  }

  if (state.modal.type === 'tracker-form') {
    const tracker = state.modal.editing || {
      name: '',
      type: 'chore',
      frequencyDays: 7,
      period: 'week'
    };

    return `
      <div class="modal-backdrop" data-action="close-modal">
        <form class="modal form" data-form="tracker" data-stop>
          <h3>${state.modal.editing ? 'Edit Tracker' : 'New Tracker'}</h3>
          <label>Name<input required name="name" value="${escapeHtml(tracker.name)}" /></label>
          <label>Type
            <select name="type">
              <option value="chore" ${tracker.type === 'chore' ? 'selected' : ''}>Chore</option>
              <option value="selfcare" ${tracker.type === 'selfcare' ? 'selected' : ''}>Self-Care</option>
            </select>
          </label>
          <label>How often (days)
            <input required type="number" min="1" name="frequencyDays" value="${tracker.frequencyDays}" />
          </label>
          <label>Checklist period
            <select name="period">
              <option value="week" ${tracker.period === 'week' ? 'selected' : ''}>Week</option>
              <option value="month" ${tracker.period === 'month' ? 'selected' : ''}>Month</option>
            </select>
          </label>
          <div class="modal-actions">
            <button type="button" class="ghost" data-action="close-modal">Cancel</button>
            <button class="pill" type="submit">Save</button>
          </div>
        </form>
      </div>
    `;
  }

  if (state.modal.type === 'account-form') {
    const account = state.modal.editing || { name: '', balance: 0 };
    return `
      <div class="modal-backdrop" data-action="close-modal">
        <form class="modal form" data-form="account" data-stop>
          <h3>${state.modal.editing ? 'Edit Account' : 'New Account'}</h3>
          <label>Name<input required name="name" value="${escapeHtml(account.name)}" /></label>
          <label>Balance<input required type="number" step="0.01" name="balance" value="${account.balance}" /></label>
          <div class="modal-actions">
            <button type="button" class="ghost" data-action="close-modal">Cancel</button>
            <button class="pill" type="submit">Save</button>
          </div>
        </form>
      </div>
    `;
  }

  return '';
}

function bindEvents() {
  app.querySelectorAll('[data-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeTab = button.dataset.tab;
      render();
    });
  });

  app.querySelectorAll('[data-action]').forEach((element) => {
    element.addEventListener('click', (event) => {
      const action = element.dataset.action;
      if (element.hasAttribute('data-stop')) event.stopPropagation();
      handleAction(action, element);
    });
  });

  app.querySelectorAll('form[data-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const kind = form.dataset.form;
      const values = Object.fromEntries(new FormData(form).entries());
      if (kind === 'event') saveEvent(values);
      if (kind === 'tracker') saveTracker(values);
      if (kind === 'account') saveAccount(values);
    });
  });
}

function handleAction(action, element) {
  if (action === 'jump-today') {
    state.selectedDate = todayISO();
    render();
    return;
  }

  if (action === 'select-date') {
    state.selectedDate = element.dataset.date;
    render();
    return;
  }

  if (action === 'quick-add') {
    state.modal = { type: 'quick-add' };
    render();
    return;
  }

  if (action === 'close-modal') {
    state.modal = null;
    render();
    return;
  }

  if (action === 'quick-preset') {
    state.modal = { type: 'event-form', preset: element.dataset.preset };
    render();
    return;
  }

  if (action === 'open-tracker-form' || action === 'new-tracker') {
    state.modal = { type: 'tracker-form' };
    render();
    return;
  }

  if (action === 'new-event') {
    state.modal = { type: 'event-form' };
    render();
    return;
  }

  if (action === 'new-account') {
    state.modal = { type: 'account-form' };
    render();
    return;
  }

  if (action === 'new-money-event') {
    state.modal = { type: 'event-form', preset: 'money' };
    render();
    return;
  }

  if (action === 'edit-event') {
    const eventToEdit = state.data.events.find((item) => item.id === element.dataset.id);
    if (!eventToEdit) return;
    state.modal = { type: 'event-form', editing: eventToEdit };
    render();
    return;
  }

  if (action === 'delete-event') {
    state.data.events = state.data.events.filter((item) => item.id !== element.dataset.id);
    persist();
    render();
    return;
  }

  if (action === 'edit-tracker') {
    const tracker = state.data.trackers.find((item) => item.id === element.dataset.id);
    if (!tracker) return;
    state.modal = { type: 'tracker-form', editing: tracker };
    render();
    return;
  }

  if (action === 'delete-tracker') {
    state.data.trackers = state.data.trackers.filter((item) => item.id !== element.dataset.id);
    persist();
    render();
    return;
  }

  if (action === 'mark-done') {
    const tracker = state.data.trackers.find((item) => item.id === element.dataset.id);
    if (!tracker) return;
    tracker.lastDone = todayISO();
    tracker.checks[currentPeriodKey(tracker.period)] = true;
    persist();
    render();
    return;
  }

  if (action === 'toggle-check') {
    const tracker = state.data.trackers.find((item) => item.id === element.dataset.id);
    if (!tracker) return;
    const key = currentPeriodKey(tracker.period);
    tracker.checks[key] = !tracker.checks[key];
    persist();
    render();
    return;
  }

  if (action === 'edit-account') {
    const account = state.data.accounts.find((item) => item.id === element.dataset.id);
    if (!account) return;
    state.modal = { type: 'account-form', editing: account };
    render();
    return;
  }

  if (action === 'delete-account') {
    state.data.accounts = state.data.accounts.filter((item) => item.id !== element.dataset.id);
    state.data.events = state.data.events.map((item) => (item.accountId === element.dataset.id ? { ...item, accountId: '' } : item));
    persist();
    render();
  }
}

function saveEvent(values) {
  const payload = {
    id: state.modal.editing?.id || idGenerator(),
    title: String(values.title || '').trim(),
    category: values.category,
    date: values.date,
    startTime: values.startTime,
    endTime: values.endTime,
    notes: String(values.notes || '').trim(),
    accountId: values.accountId
  };

  if (!payload.title || !payload.date) return;

  const index = state.data.events.findIndex((item) => item.id === payload.id);
  if (index >= 0) state.data.events[index] = payload;
  else state.data.events.push(payload);

  persist();
  state.modal = null;
  render();
}

function saveTracker(values) {
  const payload = {
    id: state.modal.editing?.id || idGenerator(),
    name: String(values.name || '').trim(),
    type: values.type,
    frequencyDays: Math.max(1, Number(values.frequencyDays || 1)),
    period: values.period,
    lastDone: state.modal.editing?.lastDone || todayISO(),
    checks: state.modal.editing?.checks || {}
  };

  if (!payload.name) return;

  const index = state.data.trackers.findIndex((item) => item.id === payload.id);
  if (index >= 0) state.data.trackers[index] = payload;
  else state.data.trackers.push(payload);

  persist();
  state.modal = null;
  render();
}

function saveAccount(values) {
  const payload = {
    id: state.modal.editing?.id || idGenerator(),
    name: String(values.name || '').trim(),
    balance: Number(values.balance || 0)
  };

  if (!payload.name) return;

  const index = state.data.accounts.findIndex((item) => item.id === payload.id);
  if (index >= 0) state.data.accounts[index] = payload;
  else state.data.accounts.push(payload);

  persist();
  state.modal = null;
  render();
}

function eventsForDate(date) {
  return state.data.events.filter((item) => item.date === date).sort(sortByDateTime);
}

function countEventsForDate(date) {
  return eventsForDate(date).length;
}

function sortByDateTime(first, second) {
  return `${first.date}-${first.startTime || '99:99'}`.localeCompare(`${second.date}-${second.startTime || '99:99'}`);
}

function persist() {
  localStorage.setItem(storageKey, JSON.stringify(state.data));
}

function loadData() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return cloneData(demoData);
  try {
    const parsed = JSON.parse(raw);
    return {
      events: Array.isArray(parsed.events) ? parsed.events : [],
      trackers: Array.isArray(parsed.trackers) ? parsed.trackers : [],
      accounts: Array.isArray(parsed.accounts) ? parsed.accounts : []
    };
  } catch {
    return cloneData(demoData);
  }
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function isoDateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function monthTitle(isoDate) {
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

function formatLongDate(isoDate) {
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatShortDate(isoDate) {
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatTimeRange(startTime, endTime) {
  if (!startTime && !endTime) return 'Anytime';
  if (startTime && !endTime) return formatTime(startTime);
  if (!startTime && endTime) return `Until ${formatTime(endTime)}`;
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

function formatTime(time) {
  const [hourRaw, minuteRaw] = String(time).split(':');
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw || 0);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function trackerDaysLeft(tracker) {
  const last = new Date(`${tracker.lastDone}T12:00:00`).getTime();
  const now = new Date(`${todayISO()}T12:00:00`).getTime();
  const diffDays = Math.floor((now - last) / (24 * 60 * 60 * 1000));
  return Math.max(0, tracker.frequencyDays - diffDays);
}

function trackerProgressPercent(tracker, daysLeft) {
  const total = Math.max(1, Number(tracker.frequencyDays) || 1);
  const elapsed = Math.min(total, Math.max(0, total - daysLeft));
  return Math.round((elapsed / total) * 100);
}

function currentPeriodKey(period) {
  const now = new Date();
  if (period === 'month') return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const jan1 = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - jan1) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(amount || 0));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
