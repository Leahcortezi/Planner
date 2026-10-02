import './styles.css';

const storageKey = 'plannerDashboardDataV1';
const reminderLogKey = 'plannerReminderLogV1';

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
      accountId: '',
      recurrenceType: 'weekly',
      recurrenceEnd: isoDateOffset(120),
      reminderType: 'at-time',
      reminderMinutesBefore: 15
    },
    {
      id: idGenerator(),
      title: 'Coffee Shift',
      category: 'shift',
      date: isoDateOffset(0),
      startTime: '13:00',
      endTime: '18:00',
      notes: 'Close register',
      accountId: '',
      recurrenceType: 'weekly',
      recurrenceEnd: isoDateOffset(120),
      reminderType: 'at-time',
      reminderMinutesBefore: 30
    },
    {
      id: idGenerator(),
      title: 'UX Assignment Due',
      category: 'deadline_school',
      date: isoDateOffset(2),
      startTime: '23:59',
      endTime: '',
      notes: 'Submit on portal',
      accountId: '',
      recurrenceType: 'none',
      recurrenceEnd: '',
      reminderType: 'morning',
      reminderMinutesBefore: 15
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
  activeTab: 'today',
  modal: null,
  data: loadData(),
  reminderLog: loadReminderLog()
};

const app = document.querySelector('#app');

render();
registerServiceWorker();
startReminderEngine();

function render() {
  app.innerHTML = `
    <main class="screen">
      <header class="top">
        <div>
          <p class="caption">Planner</p>
          <h1>${state.activeTab === 'calendar' ? monthTitle(state.selectedDate) : formatLongDate(state.selectedDate)}</h1>
        </div>
        <button class="pill" data-action="jump-today">Today</button>
      </header>

      <section class="content">
        ${renderActiveTab()}
      </section>

      <nav class="bottom-nav">
        <button class="tab ${state.activeTab === 'today' ? 'active' : ''}" data-tab="today">🏠 Today</button>
        <button class="tab ${state.activeTab === 'calendar' ? 'active' : ''}" data-tab="calendar">📆 Calendar</button>
        <button class="tab ${state.activeTab === 'trackers' ? 'active' : ''}" data-tab="trackers">🌸 Trackers</button>
        <button class="tab ${state.activeTab === 'money' ? 'active' : ''}" data-tab="money">💳 Money</button>
        <button class="tab ${state.activeTab === 'inbox' ? 'active' : ''}" data-tab="inbox">✨ Inbox</button>
      </nav>

      <button class="fab" data-action="quick-add">＋</button>
    </main>

    ${renderModal()}
  `;

  bindEvents();
}

function renderActiveTab() {
  if (state.activeTab === 'today') return renderTodayTab();
  if (state.activeTab === 'calendar') return renderCalendarTab();
  if (state.activeTab === 'trackers') return renderTrackers();
  if (state.activeTab === 'money') return renderMoney();
  if (state.activeTab === 'inbox') return renderInbox();
  return renderTodayTab();
}

function renderTodayTab() {
  const selected = eventsForDate(state.selectedDate);
  return `
    <div class="stack">
      <div class="card day-overview">
        <div class="section-head">
          <h2>Your Day</h2>
          <p>${countEventsForDate(state.selectedDate)} items</p>
        </div>
        <div class="smart-grid">
          ${renderTodayHighlights()}
        </div>
      </div>
      <div class="card soft">
        <div class="section-head">
          <h3>${formatShortDate(state.selectedDate)} Agenda</h3>
          <button class="ghost" data-action="new-event">Add Event</button>
        </div>
        <div class="event-list">${renderEventRows(selected, true)}</div>
      </div>
    </div>
  `;
}

function renderCalendarTab() {
  const selected = eventsForDate(state.selectedDate);
  return `
    <div class="stack">
      <section class="card">
        <div class="section-head">
          <h2>Calendar</h2>
          <p>${monthTitle(state.selectedDate)}</p>
        </div>
        ${renderCalendar(state.selectedDate)}
      </section>
      <div class="card soft">
        <div class="section-head">
          <h3>${formatShortDate(state.selectedDate)}</h3>
          <button class="ghost" data-action="new-event">Add</button>
        </div>
        <div class="event-list">${renderEventRows(selected, true)}</div>
      </div>
    </div>
  `;
}

function renderInbox() {
  const upcoming = getOccurrencesInRange(todayISO(), isoDateOffset(21), 5);
  const reminderStatus =
    typeof Notification === 'undefined'
      ? 'Notifications unavailable on this browser'
      : Notification.permission === 'granted'
        ? 'Reminders are enabled'
        : Notification.permission === 'denied'
          ? 'Reminders blocked in browser settings'
          : 'Enable reminders for smarter alerts';

  return `
    <div class="stack">
      <div class="card soft">
        <div class="section-head">
          <h3>Quick Capture</h3>
          <p>Smart add</p>
        </div>
        <form class="capture-form" data-form="quick-capture">
          <input name="entry" placeholder="Work shift Tue 4-9pm" required />
          <button class="pill" type="submit">Add</button>
        </form>
        <p class="muted">Try: "Yoga tomorrow 7am" or "Dentist Oct 15 3pm"</p>
        <div class="inbox-reminders">
          <p class="muted">${reminderStatus}</p>
          <button class="ghost" data-action="request-notifications">Enable Alerts</button>
        </div>
      </div>
      <div class="card soft">
        <div class="section-head">
          <h3>Upcoming</h3>
          <button class="ghost" data-action="new-event">Manual Add</button>
        </div>
        <div class="event-list">${renderEventRows(upcoming, true)}</div>
      </div>
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
  const moneyEvents = getOccurrencesInRange(todayISO(), isoDateOffset(30), 6, (event) => event.category === 'money');

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
      const recurrenceText = recurrenceLabel(event.recurrenceType);
      const reminderText = reminderLabel(event);
      const metaParts = [formatTimeRange(event.startTime, event.endTime)];
      if (recurrenceText) metaParts.push(recurrenceText);
      if (reminderText) metaParts.push(reminderText);
      if (event.notes) metaParts.push(escapeHtml(event.notes));
      return `
        <article class="event-row">
          <div class="event-dot" style="background:${category.color}"></div>
          <div class="event-main">
            <p class="badge">${category.icon} ${category.label}</p>
            <h4>${escapeHtml(event.title)}</h4>
            <p class="muted">${metaParts.join(' • ')}</p>
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

function renderTodayHighlights() {
  const nowItem = findNowEvent(state.selectedDate);
  const nextItem = findNextEvent(state.selectedDate);
  const dueSoon = findDueSoonEvent();

  return `
    <article class="smart-card now">
      <p class="smart-label">Now</p>
      <h4>${nowItem ? escapeHtml(nowItem.title) : 'Nothing right now'}</h4>
      <p>${nowItem ? formatTimeRange(nowItem.startTime, nowItem.endTime) : 'Take a breather ✨'}</p>
    </article>
    <article class="smart-card next">
      <p class="smart-label">Next</p>
      <h4>${nextItem ? escapeHtml(nextItem.title) : 'No more events today'}</h4>
      <p>${nextItem ? formatTimeRange(nextItem.startTime, nextItem.endTime) : 'You are caught up'}</p>
    </article>
    <article class="smart-card soon">
      <p class="smart-label">Due Soon</p>
      <h4>${dueSoon ? escapeHtml(dueSoon.title) : 'No urgent deadlines'}</h4>
      <p>${dueSoon ? `${formatShortDate(dueSoon.date)} • ${daysUntil(dueSoon.date)}d left` : 'Everything looks clear'}</p>
    </article>
  `;
}

function renderModal() {
  if (!state.modal) return '';

  if (state.modal.type === 'quick-add') {
    return `
      <div class="modal-backdrop" data-action="close-modal">
        <div class="modal" data-stop>
          <h3>Quick Add</h3>
          <form class="capture-form" data-form="quick-capture">
            <input name="entry" placeholder="Class mon 9:30am" required />
            <button class="pill" type="submit">Add</button>
          </form>
          <p class="muted">Smart examples: "work shift tue 4-9", "period care tomorrow"</p>
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
      accountId: '',
      recurrenceType: 'none',
      recurrenceEnd: '',
      reminderType: 'none',
      reminderMinutesBefore: 15
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
          <label>Repeat
            <select name="recurrenceType">
              <option value="none" ${event.recurrenceType === 'none' ? 'selected' : ''}>Does not repeat</option>
              <option value="daily" ${event.recurrenceType === 'daily' ? 'selected' : ''}>Daily</option>
              <option value="weekly" ${event.recurrenceType === 'weekly' ? 'selected' : ''}>Weekly</option>
              <option value="monthly" ${event.recurrenceType === 'monthly' ? 'selected' : ''}>Monthly</option>
            </select>
          </label>
          <label>Repeat until (optional)
            <input type="date" name="recurrenceEnd" value="${event.recurrenceEnd || ''}" />
          </label>
          <label>Reminder
            <select name="reminderType">
              <option value="none" ${event.reminderType === 'none' ? 'selected' : ''}>No reminder</option>
              <option value="at-time" ${event.reminderType === 'at-time' ? 'selected' : ''}>Before start time</option>
              <option value="morning" ${event.reminderType === 'morning' ? 'selected' : ''}>Morning reminder (8:00 AM)</option>
            </select>
          </label>
          <label>Minutes before (for timed reminders)
            <select name="reminderMinutesBefore">
              <option value="5" ${Number(event.reminderMinutesBefore) === 5 ? 'selected' : ''}>5 min</option>
              <option value="10" ${Number(event.reminderMinutesBefore) === 10 ? 'selected' : ''}>10 min</option>
              <option value="15" ${Number(event.reminderMinutesBefore) === 15 ? 'selected' : ''}>15 min</option>
              <option value="30" ${Number(event.reminderMinutesBefore) === 30 ? 'selected' : ''}>30 min</option>
              <option value="60" ${Number(event.reminderMinutesBefore) === 60 ? 'selected' : ''}>60 min</option>
            </select>
          </label>
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
      if (kind === 'quick-capture') saveQuickCapture(values);
    });
  });
}

function handleAction(action, element) {
  if (action === 'jump-today') {
    state.selectedDate = todayISO();
    state.activeTab = 'today';
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

  if (action === 'request-notifications') {
    requestNotificationPermission();
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
    accountId: values.accountId,
    recurrenceType: sanitizeRecurrenceType(values.recurrenceType),
    recurrenceEnd: values.recurrenceEnd || '',
    reminderType: sanitizeReminderType(values.reminderType),
    reminderMinutesBefore: clampReminderMinutes(values.reminderMinutesBefore)
  };

  if (!payload.title || !payload.date) return;

  const index = state.data.events.findIndex((item) => item.id === payload.id);
  if (index >= 0) state.data.events[index] = payload;
  else state.data.events.push(payload);

  persist();
  state.modal = null;
  render();
}

function saveQuickCapture(values) {
  const input = String(values.entry || '').trim();
  if (!input) return;

  const parsed = parseNaturalEventInput(input);
  const payload = {
    id: idGenerator(),
    title: parsed.title,
    category: parsed.category,
    date: parsed.date,
    startTime: parsed.startTime,
    endTime: parsed.endTime,
    notes: parsed.notes,
    accountId: '',
    recurrenceType: parsed.recurrenceType,
    recurrenceEnd: parsed.recurrenceEnd,
    reminderType: parsed.reminderType,
    reminderMinutesBefore: parsed.reminderMinutesBefore
  };

  state.data.events.push(payload);
  state.selectedDate = payload.date;
  state.modal = null;
  state.activeTab = 'today';
  persist();
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
  return state.data.events
    .filter((item) => occursOnDate(item, date))
    .map((item) => materializeEventOnDate(item, date))
    .sort(sortByDateTime);
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
      events: Array.isArray(parsed.events) ? parsed.events.map((event) => normalizeEvent(event)) : [],
      trackers: Array.isArray(parsed.trackers) ? parsed.trackers : [],
      accounts: Array.isArray(parsed.accounts) ? parsed.accounts : []
    };
  } catch {
    return cloneData(demoData);
  }
}

function cloneData(data) {
  const cloned = JSON.parse(JSON.stringify(data));
  return {
    ...cloned,
    events: Array.isArray(cloned.events) ? cloned.events.map((event) => normalizeEvent(event)) : []
  };
}

function normalizeEvent(event) {
  return {
    id: event.id || idGenerator(),
    title: String(event.title || '').trim(),
    category: event.category || 'plan',
    date: event.date || todayISO(),
    startTime: event.startTime || '',
    endTime: event.endTime || '',
    notes: event.notes || '',
    accountId: event.accountId || '',
    recurrenceType: sanitizeRecurrenceType(event.recurrenceType),
    recurrenceEnd: event.recurrenceEnd || '',
    reminderType: sanitizeReminderType(event.reminderType),
    reminderMinutesBefore: clampReminderMinutes(event.reminderMinutesBefore)
  };
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

function recurrenceLabel(recurrenceType) {
  if (recurrenceType === 'daily') return 'Repeats daily';
  if (recurrenceType === 'weekly') return 'Repeats weekly';
  if (recurrenceType === 'monthly') return 'Repeats monthly';
  return '';
}

function reminderLabel(event) {
  if (event.reminderType === 'at-time' && event.startTime) {
    return `Alert ${event.reminderMinutesBefore}m before`;
  }
  if (event.reminderType === 'morning') return 'Morning reminder';
  return '';
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

function parseNaturalEventInput(input) {
  const lowered = input.toLowerCase();
  const date = parseDateFromText(lowered) || state.selectedDate;
  const { startTime, endTime } = parseTimeRangeFromText(lowered);
  const category = inferCategoryFromText(lowered);
  const title = toTitleCase(cleanTitleFromInput(input));
  const recurrenceType = parseRecurrenceFromText(lowered);
  const reminderType = parseReminderFromText(lowered, startTime);

  return {
    title: title || 'New item',
    category,
    date,
    startTime,
    endTime,
    notes: `Added from quick capture: ${input}`,
    recurrenceType,
    recurrenceEnd: recurrenceType === 'none' ? '' : isoDateOffset(90),
    reminderType,
    reminderMinutesBefore: 15
  };
}

function parseRecurrenceFromText(text) {
  if (/\b(daily|every day|everyday)\b/.test(text)) return 'daily';
  if (/\b(weekly|every week)\b/.test(text)) return 'weekly';
  if (/\b(monthly|every month)\b/.test(text)) return 'monthly';
  return 'none';
}

function parseReminderFromText(text, startTime) {
  if (/\b(no reminder|silent)\b/.test(text)) return 'none';
  if (/\b(morning reminder|morning)\b/.test(text)) return 'morning';
  if (/\b(remind|alert|notify)\b/.test(text)) return startTime ? 'at-time' : 'morning';
  return 'none';
}

function parseDateFromText(text) {
  const now = new Date();
  const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  if (text.includes('today')) return todayISO();
  if (text.includes('tomorrow')) return isoDateOffset(1);

  const weekdayMatch = text.match(/\b(sun|mon|tue|wed|thu|fri|sat)(day)?\b/);
  if (weekdayMatch) {
    const target = weekdays.indexOf(weekdayMatch[1].slice(0, 3));
    const base = new Date(`${todayISO()}T12:00:00`);
    const current = base.getDay();
    let diff = (target - current + 7) % 7;
    if (diff === 0) diff = 7;
    base.setDate(base.getDate() + diff);
    return base.toISOString().slice(0, 10);
  }

  const explicit = text.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);
  if (explicit) {
    const year = Number(explicit[1]);
    const month = String(Number(explicit[2])).padStart(2, '0');
    const day = String(Number(explicit[3])).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const shortDate = text.match(/\b(\d{1,2})\/(\d{1,2})\b/);
  if (shortDate) {
    const month = String(Number(shortDate[1])).padStart(2, '0');
    const day = String(Number(shortDate[2])).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  }

  return null;
}

function parseTimeRangeFromText(text) {
  const range = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(?:-|to)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/);
  if (range) {
    const startTime = to24Hour(range[1], range[2], range[3]);
    const endTime = to24Hour(range[4], range[5], range[6] || range[3]);
    return { startTime, endTime };
  }

  const single = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);
  if (single) {
    return { startTime: to24Hour(single[1], single[2], single[3]), endTime: '' };
  }

  return { startTime: '', endTime: '' };
}

function to24Hour(hourRaw, minuteRaw, meridiemRaw) {
  let hour = Number(hourRaw);
  const minute = Number(minuteRaw || 0);
  const meridiem = String(meridiemRaw || '').toLowerCase();

  if (meridiem === 'pm' && hour < 12) hour += 12;
  if (meridiem === 'am' && hour === 12) hour = 0;

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function inferCategoryFromText(text) {
  if (/\bclass|lecture|lab|study\b/.test(text)) return 'class';
  if (/\bshift|work|job|clock\b/.test(text)) return 'shift';
  if (/\bdeadline|due|submit|assignment|exam\b/.test(text)) return 'deadline_school';
  if (/\bmeeting|client|project\b/.test(text)) return 'deadline_work';
  if (/\bmoney|bank|pay|bill|rent|budget\b/.test(text)) return 'money';
  if (/\bdoctor|dentist|appointment|salon|beauty|nails\b/.test(text)) return 'appointment';
  return 'plan';
}

function cleanTitleFromInput(input) {
  return input
    .replace(/\b(today|tomorrow|sun(day)?|mon(day)?|tue(sday)?|wed(nesday)?|thu(rsday)?|fri(day)?|sat(urday)?)\b/gi, ' ')
    .replace(/\b\d{1,2}(:\d{2})?\s*(am|pm)?\s*[-to]*\s*\d{0,2}(:\d{2})?\s*(am|pm)?\b/gi, ' ')
    .replace(/\b(every day|everyday|daily|weekly|monthly|every week|every month|remind me|alert me|notify me)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toTitleCase(text) {
  return String(text)
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function findNowEvent(date) {
  const todayEvents = eventsForDate(date);
  const now = new Date();
  const minutesNow = now.getHours() * 60 + now.getMinutes();

  return todayEvents.find((event) => {
    if (!event.startTime || !event.endTime) return false;
    const start = timeToMinutes(event.startTime);
    const end = timeToMinutes(event.endTime);
    return minutesNow >= start && minutesNow <= end;
  });
}

function findNextEvent(date) {
  const todayEvents = eventsForDate(date);
  const now = new Date();
  const minutesNow = now.getHours() * 60 + now.getMinutes();

  return todayEvents.find((event) => {
    if (!event.startTime) return false;
    return timeToMinutes(event.startTime) > minutesNow;
  });
}

function findDueSoonEvent() {
  const limit = isoDateOffset(7);
  return getOccurrencesInRange(todayISO(), limit, 20, (event) => event.category === 'deadline_school' || event.category === 'deadline_work')[0];
}

function daysUntil(isoDate) {
  const target = new Date(`${isoDate}T12:00:00`).getTime();
  const current = new Date(`${todayISO()}T12:00:00`).getTime();
  const raw = Math.floor((target - current) / (24 * 60 * 60 * 1000));
  return Math.max(0, raw);
}

function timeToMinutes(time) {
  const [hours, minutes] = String(time).split(':');
  return Number(hours) * 60 + Number(minutes || 0);
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

function sanitizeRecurrenceType(value) {
  const allowed = ['none', 'daily', 'weekly', 'monthly'];
  return allowed.includes(value) ? value : 'none';
}

function sanitizeReminderType(value) {
  const allowed = ['none', 'at-time', 'morning'];
  return allowed.includes(value) ? value : 'none';
}

function clampReminderMinutes(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 15;
  return Math.min(60, Math.max(5, parsed));
}

function occursOnDate(event, date) {
  if (!event?.date) return false;
  if (date < event.date) return false;

  if (event.recurrenceEnd && date > event.recurrenceEnd) return false;
  if (event.recurrenceType === 'none') return event.date === date;

  if (event.recurrenceType === 'daily') return true;

  const startDate = new Date(`${event.date}T12:00:00`);
  const targetDate = new Date(`${date}T12:00:00`);

  if (event.recurrenceType === 'weekly') {
    return startDate.getDay() === targetDate.getDay();
  }

  if (event.recurrenceType === 'monthly') {
    return startDate.getDate() === targetDate.getDate();
  }

  return event.date === date;
}

function materializeEventOnDate(event, date) {
  return {
    ...event,
    date,
    baseDate: event.date
  };
}

function getOccurrencesInRange(startDate, endDate, limit = Infinity, filterFn = () => true) {
  const events = [];
  let cursor = startDate;

  while (cursor <= endDate) {
    const dayEvents = eventsForDate(cursor).filter(filterFn);
    events.push(...dayEvents);
    if (events.length >= limit) break;
    cursor = shiftIsoDate(cursor, 1);
  }

  return events.slice(0, limit);
}

function shiftIsoDate(isoDate, days) {
  const date = new Date(`${isoDate}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function loadReminderLog() {
  const raw = localStorage.getItem(reminderLogKey);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function saveReminderLog() {
  localStorage.setItem(reminderLogKey, JSON.stringify(state.reminderLog));
}

function notificationKey(event, occurrenceDate) {
  return `${occurrenceDate}|${event.id}|${event.startTime || 'none'}|${event.reminderType}`;
}

function hasSentReminder(event, occurrenceDate) {
  return Boolean(state.reminderLog[notificationKey(event, occurrenceDate)]);
}

function markReminderSent(event, occurrenceDate) {
  state.reminderLog[notificationKey(event, occurrenceDate)] = Date.now();
  saveReminderLog();
}

function pruneReminderLog() {
  const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 14;
  Object.entries(state.reminderLog).forEach(([key, timestamp]) => {
    if (Number(timestamp) < cutoff) delete state.reminderLog[key];
  });
  saveReminderLog();
}

function requestNotificationPermission() {
  if (typeof Notification === 'undefined') {
    window.alert('Notifications are not supported in this browser.');
    return;
  }

  if (Notification.permission === 'granted') {
    window.alert('Reminders are already enabled.');
    return;
  }

  Notification.requestPermission().then(() => {
    render();
    checkRemindersNow();
  });
}

function startReminderEngine() {
  pruneReminderLog();
  checkRemindersNow();
  window.setInterval(checkRemindersNow, 30 * 1000);
}

function checkRemindersNow() {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

  const occurrenceDate = todayISO();
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const todayEvents = eventsForDate(occurrenceDate);

  todayEvents.forEach((event) => {
    if (event.reminderType === 'none' || hasSentReminder(event, occurrenceDate)) return;

    if (event.reminderType === 'at-time' && event.startTime) {
      const trigger = Math.max(0, timeToMinutes(event.startTime) - event.reminderMinutesBefore);
      if (nowMinutes >= trigger) {
        sendEventNotification(event, occurrenceDate, `${event.reminderMinutesBefore}m reminder`);
      }
      return;
    }

    if (event.reminderType === 'morning' && nowMinutes >= 8 * 60) {
      sendEventNotification(event, occurrenceDate, 'Morning reminder');
    }
  });
}

function sendEventNotification(event, occurrenceDate, subtitle) {
  new Notification(`Planner: ${event.title}`, {
    body: `${subtitle} • ${formatTimeRange(event.startTime, event.endTime)} • ${formatShortDate(occurrenceDate)}`,
    tag: notificationKey(event, occurrenceDate)
  });
  markReminderSent(event, occurrenceDate);
}
