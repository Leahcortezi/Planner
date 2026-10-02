(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}})();const B="plannerDashboardDataV1",R="plannerReminderLogV1",m=typeof crypto<"u"&&typeof crypto.randomUUID=="function"?()=>crypto.randomUUID():()=>`id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`,h={class:{label:"Class",color:"#7a5cff",icon:"🎓"},shift:{label:"Shift",color:"#34c759",icon:"💼"},appointment:{label:"Appointment",color:"#0a84ff",icon:"📍"},plan:{label:"Plan",color:"#ff9f0a",icon:"🗓️"},deadline_school:{label:"School Deadline",color:"#ff375f",icon:"📚"},deadline_work:{label:"Work Deadline",color:"#ff453a",icon:"📌"},money:{label:"Money",color:"#30b0c7",icon:"💳"}},A={events:[{id:m(),title:"Biology Lecture",category:"class",date:p(0),startTime:"09:30",endTime:"10:45",notes:"Bring lab notebook",accountId:"",recurrenceType:"weekly",recurrenceEnd:p(120),reminderType:"at-time",reminderMinutesBefore:15},{id:m(),title:"Coffee Shift",category:"shift",date:p(0),startTime:"13:00",endTime:"18:00",notes:"Close register",accountId:"",recurrenceType:"weekly",recurrenceEnd:p(120),reminderType:"at-time",reminderMinutesBefore:30},{id:m(),title:"UX Assignment Due",category:"deadline_school",date:p(2),startTime:"23:59",endTime:"",notes:"Submit on portal",accountId:"",recurrenceType:"none",recurrenceEnd:"",reminderType:"morning",reminderMinutesBefore:15}],trackers:[{id:m(),name:"Laundry",type:"chore",frequencyDays:7,period:"week",lastDone:p(-5),checks:{}},{id:m(),name:"Yoga",type:"selfcare",frequencyDays:2,period:"week",lastDone:p(-1),checks:{}},{id:m(),name:"Birth Control",type:"selfcare",frequencyDays:1,period:"month",lastDone:p(-1),checks:{}}],accounts:[{id:m(),name:"Main Checking",balance:980},{id:m(),name:"Bills Checking",balance:410}]},a={selectedDate:l(),activeTab:"today",modal:null,data:le(),reminderLog:Le()},T=document.querySelector("#app");c();qe();je();function c(){T.innerHTML=`
    <main class="screen">
      <header class="top">
        <div>
          <p class="caption">Planner</p>
          <h1>${a.activeTab==="calendar"?x(a.selectedDate):ue(a.selectedDate)}</h1>
        </div>
        <button class="pill" data-action="jump-today">Today</button>
      </header>

      <section class="content">
        ${J()}
      </section>

      <nav class="bottom-nav">
        <button class="tab ${a.activeTab==="today"?"active":""}" data-tab="today">🏠 Today</button>
        <button class="tab ${a.activeTab==="calendar"?"active":""}" data-tab="calendar">📆 Calendar</button>
        <button class="tab ${a.activeTab==="trackers"?"active":""}" data-tab="trackers">🌸 Trackers</button>
        <button class="tab ${a.activeTab==="money"?"active":""}" data-tab="money">💳 Money</button>
        <button class="tab ${a.activeTab==="inbox"?"active":""}" data-tab="inbox">✨ Inbox</button>
      </nav>

      <button class="fab" data-action="quick-add">＋</button>
    </main>

    ${te()}
  `,ne()}function J(){return a.activeTab==="today"?I():a.activeTab==="calendar"?K():a.activeTab==="trackers"?Q():a.activeTab==="money"?V():a.activeTab==="inbox"?z():I()}function I(){const e=g(a.selectedDate);return`
    <div class="stack">
      <div class="card day-overview">
        <div class="section-head">
          <h2>Your Day</h2>
          <p>${ce(a.selectedDate)} items</p>
        </div>
        <div class="smart-grid">
          ${ee()}
        </div>
      </div>
      <div class="card soft">
        <div class="section-head">
          <h3>${D(a.selectedDate)} Agenda</h3>
          <button class="ghost" data-action="new-event">Add Event</button>
        </div>
        <div class="event-list">${w(e)}</div>
      </div>
    </div>
  `}function K(){const e=g(a.selectedDate);return`
    <div class="stack">
      <section class="card">
        <div class="section-head">
          <h2>Calendar</h2>
          <p>${x(a.selectedDate)}</p>
        </div>
        ${Z(a.selectedDate)}
      </section>
      <div class="card soft">
        <div class="section-head">
          <h3>${D(a.selectedDate)}</h3>
          <button class="ghost" data-action="new-event">Add</button>
        </div>
        <div class="event-list">${w(e)}</div>
      </div>
    </div>
  `}function z(){const e=E(l(),p(21),5);return`
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
          <p class="muted">${typeof Notification>"u"?"Notifications unavailable on this browser":Notification.permission==="granted"?"Reminders are enabled":Notification.permission==="denied"?"Reminders blocked in browser settings":"Enable reminders for smarter alerts"}</p>
          <button class="ghost" data-action="request-notifications">Enable Alerts</button>
        </div>
      </div>
      <div class="card soft">
        <div class="section-head">
          <h3>Upcoming</h3>
          <button class="ghost" data-action="new-event">Manual Add</button>
        </div>
        <div class="event-list">${w(e)}</div>
      </div>
    </div>
  `}function Q(){const e=a.data.trackers;return`
    <div class="card soft">
      <div class="section-head">
        <h3>Chores & Self-Care</h3>
        <button class="ghost" data-action="new-tracker">Add Tracker</button>
      </div>
      <div class="tracker-list">
        ${e.length?e.map(t=>G(t)).join(""):'<p class="empty">No trackers yet.</p>'}
      </div>
    </div>
  `}function V(){const{accounts:e}=a.data,t=E(l(),p(30),6,n=>n.category==="money");return`
    <div class="stack">
      <div class="card soft">
        <div class="section-head">
          <h3>Checking Accounts</h3>
          <button class="ghost" data-action="new-account">Add Account</button>
        </div>
        <div class="account-grid">
          ${e.length?e.map(n=>X(n)).join(""):'<p class="empty">No accounts yet.</p>'}
        </div>
      </div>
      <div class="card soft">
        <div class="section-head">
          <h3>Upcoming Money Items</h3>
          <button class="ghost" data-action="new-money-event">Add Item</button>
        </div>
        <div class="event-list">${w(t)}</div>
      </div>
    </div>
  `}function G(e){const t=fe(e),n=N(e.period),r=!!e.checks[n],o=ye(e,t),i=e.type==="chore"?"🧹":"🌸",s=t===0?"Due now":`${t}d left`;return`
    <article class="tracker-card ${e.type}">
      <div class="tracker-top">
        <div class="tracker-icon">${i}</div>
        <div class="tracker-title-wrap">
          <p class="tracker-type ${e.type}">${e.type==="chore"?"Chore":"Self-Care"}</p>
          <h4>${f(e.name)}</h4>
          <p class="muted">Every ${e.frequencyDays} day${e.frequencyDays===1?"":"s"} • ${e.period}</p>
        </div>
        <p class="tracker-chip ${t===0?"due":""}">${s}</p>
      </div>
      <div class="tracker-progress">
        <div class="tracker-progress-fill ${t===0?"due":""}" style="width:${o}%"></div>
      </div>
      <div class="tracker-actions">
        <label class="check-wrap">
          <input type="checkbox" data-action="toggle-check" data-id="${e.id}" ${r?"checked":""} />
          ${e.period==="week"?"Done this week":"Done this month"}
        </label>
        <button class="pill" data-action="mark-done" data-id="${e.id}">Mark done today</button>
        <div class="row-actions">
          <button class="tiny" data-action="edit-tracker" data-id="${e.id}">Edit</button>
          <button class="tiny danger" data-action="delete-tracker" data-id="${e.id}">Delete</button>
        </div>
      </div>
    </article>
  `}function X(e){return`
    <article class="account-card">
      <p>${f(e.name)}</p>
      <h4>${be(e.balance)}</h4>
      <div class="row-actions">
        <button class="tiny" data-action="edit-account" data-id="${e.id}">Edit</button>
        <button class="tiny danger" data-action="delete-account" data-id="${e.id}">Delete</button>
      </div>
    </article>
  `}function w(e,t){return e.length?e.map(n=>{const r=h[n.category]??h.plan,o=me(n.recurrenceType),i=pe(n),s=[$(n.startTime,n.endTime)];return o&&s.push(o),i&&s.push(i),n.notes&&s.push(f(n.notes)),`
        <article class="event-row">
          <div class="event-dot" style="background:${r.color}"></div>
          <div class="event-main">
            <p class="badge">${r.icon} ${r.label}</p>
            <h4>${f(n.title)}</h4>
            <p class="muted">${s.join(" • ")}</p>
          </div>
          ${`<div class="row-actions">
                    <button class="tiny" data-action="edit-event" data-id="${n.id}">Edit</button>
                    <button class="tiny danger" data-action="delete-event" data-id="${n.id}">Delete</button>
                 </div>`}
        </article>
      `}).join(""):'<p class="empty">Nothing scheduled yet.</p>'}function Z(e){const t=new Date(`${e}T12:00:00`),n=t.getFullYear(),r=t.getMonth(),i=(new Date(n,r,1).getDay()+6)%7,s=new Date(n,r+1,0).getDate(),d=[];for(let u=0;u<i;u+=1)d.push('<div class="cal-cell blank"></div>');for(let u=1;u<=s;u+=1){const b=new Date(n,r,u,12).toISOString().slice(0,10),W=b===a.selectedDate,H=b===l(),Y=g(b).slice(0,3).map(_=>`<span style="background:${(h[_.category]??h.plan).color}"></span>`).join("");d.push(`
      <button class="cal-cell ${W?"selected":""} ${H?"today":""}" data-action="select-date" data-date="${b}">
        <strong>${u}</strong>
        <span class="dots">${Y}</span>
      </button>
    `)}return`
    <div class="weekday-row">
      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
    </div>
    <div class="calendar-grid">${d.join("")}</div>
  `}function ee(){const e=Se(a.selectedDate),t=Ne(a.selectedDate),n=Me();return`
    <article class="smart-card now">
      <p class="smart-label">Now</p>
      <h4>${e?f(e.title):"Nothing right now"}</h4>
      <p>${e?$(e.startTime,e.endTime):"Take a breather ✨"}</p>
    </article>
    <article class="smart-card next">
      <p class="smart-label">Next</p>
      <h4>${t?f(t.title):"No more events today"}</h4>
      <p>${t?$(t.startTime,t.endTime):"You are caught up"}</p>
    </article>
    <article class="smart-card soon">
      <p class="smart-label">Due Soon</p>
      <h4>${n?f(n.title):"No urgent deadlines"}</h4>
      <p>${n?`${D(n.date)} • ${Ee(n.date)}d left`:"Everything looks clear"}</p>
    </article>
  `}function te(){if(!a.modal)return"";if(a.modal.type==="quick-add")return`
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
    `;if(a.modal.type==="event-form"){const e=a.modal.editing||{title:"",category:a.modal.preset||"plan",date:a.selectedDate,startTime:"",endTime:"",notes:"",accountId:"",recurrenceType:"none",recurrenceEnd:"",reminderType:"none",reminderMinutesBefore:15};return`
      <div class="modal-backdrop" data-action="close-modal">
        <form class="modal form" data-form="event" data-stop>
          <h3>${a.modal.editing?"Edit Event":"New Event"}</h3>
          <label>Title<input required name="title" value="${f(e.title)}" /></label>
          <label>Category
            <select name="category">
              ${Object.entries(h).map(([t,n])=>`<option value="${t}" ${e.category===t?"selected":""}>${n.label}</option>`).join("")}
            </select>
          </label>
          <label>Date<input required type="date" name="date" value="${e.date}" /></label>
          <div class="double">
            <label>Start<input type="time" name="startTime" value="${e.startTime||""}" /></label>
            <label>End<input type="time" name="endTime" value="${e.endTime||""}" /></label>
          </div>
          <label>Notes<input name="notes" value="${f(e.notes||"")}" /></label>
          <label>Repeat
            <select name="recurrenceType">
              <option value="none" ${e.recurrenceType==="none"?"selected":""}>Does not repeat</option>
              <option value="daily" ${e.recurrenceType==="daily"?"selected":""}>Daily</option>
              <option value="weekly" ${e.recurrenceType==="weekly"?"selected":""}>Weekly</option>
              <option value="monthly" ${e.recurrenceType==="monthly"?"selected":""}>Monthly</option>
            </select>
          </label>
          <label>Repeat until (optional)
            <input type="date" name="recurrenceEnd" value="${e.recurrenceEnd||""}" />
          </label>
          <label>Reminder
            <select name="reminderType">
              <option value="none" ${e.reminderType==="none"?"selected":""}>No reminder</option>
              <option value="at-time" ${e.reminderType==="at-time"?"selected":""}>Before start time</option>
              <option value="morning" ${e.reminderType==="morning"?"selected":""}>Morning reminder (8:00 AM)</option>
            </select>
          </label>
          <label>Minutes before (for timed reminders)
            <select name="reminderMinutesBefore">
              <option value="5" ${Number(e.reminderMinutesBefore)===5?"selected":""}>5 min</option>
              <option value="10" ${Number(e.reminderMinutesBefore)===10?"selected":""}>10 min</option>
              <option value="15" ${Number(e.reminderMinutesBefore)===15?"selected":""}>15 min</option>
              <option value="30" ${Number(e.reminderMinutesBefore)===30?"selected":""}>30 min</option>
              <option value="60" ${Number(e.reminderMinutesBefore)===60?"selected":""}>60 min</option>
            </select>
          </label>
          <label>Account (for money items)
            <select name="accountId">
              <option value="">None</option>
              ${a.data.accounts.map(t=>`<option value="${t.id}" ${e.accountId===t.id?"selected":""}>${f(t.name)}</option>`).join("")}
            </select>
          </label>
          <div class="modal-actions">
            <button type="button" class="ghost" data-action="close-modal">Cancel</button>
            <button class="pill" type="submit">Save</button>
          </div>
        </form>
      </div>
    `}if(a.modal.type==="tracker-form"){const e=a.modal.editing||{name:"",type:"chore",frequencyDays:7,period:"week"};return`
      <div class="modal-backdrop" data-action="close-modal">
        <form class="modal form" data-form="tracker" data-stop>
          <h3>${a.modal.editing?"Edit Tracker":"New Tracker"}</h3>
          <label>Name<input required name="name" value="${f(e.name)}" /></label>
          <label>Type
            <select name="type">
              <option value="chore" ${e.type==="chore"?"selected":""}>Chore</option>
              <option value="selfcare" ${e.type==="selfcare"?"selected":""}>Self-Care</option>
            </select>
          </label>
          <label>How often (days)
            <input required type="number" min="1" name="frequencyDays" value="${e.frequencyDays}" />
          </label>
          <label>Checklist period
            <select name="period">
              <option value="week" ${e.period==="week"?"selected":""}>Week</option>
              <option value="month" ${e.period==="month"?"selected":""}>Month</option>
            </select>
          </label>
          <div class="modal-actions">
            <button type="button" class="ghost" data-action="close-modal">Cancel</button>
            <button class="pill" type="submit">Save</button>
          </div>
        </form>
      </div>
    `}if(a.modal.type==="account-form"){const e=a.modal.editing||{name:"",balance:0};return`
      <div class="modal-backdrop" data-action="close-modal">
        <form class="modal form" data-form="account" data-stop>
          <h3>${a.modal.editing?"Edit Account":"New Account"}</h3>
          <label>Name<input required name="name" value="${f(e.name)}" /></label>
          <label>Balance<input required type="number" step="0.01" name="balance" value="${e.balance}" /></label>
          <div class="modal-actions">
            <button type="button" class="ghost" data-action="close-modal">Cancel</button>
            <button class="pill" type="submit">Save</button>
          </div>
        </form>
      </div>
    `}return""}function ne(){T.querySelectorAll("[data-tab]").forEach(e=>{e.addEventListener("click",()=>{a.activeTab=e.dataset.tab,c()})}),T.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",t=>{const n=e.dataset.action;e.hasAttribute("data-stop")&&t.stopPropagation(),ae(n,e)})}),T.querySelectorAll("form[data-form]").forEach(e=>{e.addEventListener("submit",t=>{t.preventDefault();const n=e.dataset.form,r=Object.fromEntries(new FormData(e).entries());n==="event"&&re(r),n==="tracker"&&ie(r),n==="account"&&se(r),n==="quick-capture"&&oe(r)})})}function ae(e,t){if(e==="jump-today"){a.selectedDate=l(),a.activeTab="today",c();return}if(e==="select-date"){a.selectedDate=t.dataset.date,c();return}if(e==="quick-add"){a.modal={type:"quick-add"},c();return}if(e==="close-modal"){a.modal=null,c();return}if(e==="quick-preset"){a.modal={type:"event-form",preset:t.dataset.preset},c();return}if(e==="open-tracker-form"||e==="new-tracker"){a.modal={type:"tracker-form"},c();return}if(e==="new-event"){a.modal={type:"event-form"},c();return}if(e==="new-account"){a.modal={type:"account-form"},c();return}if(e==="new-money-event"){a.modal={type:"event-form",preset:"money"},c();return}if(e==="request-notifications"){xe();return}if(e==="edit-event"){const n=a.data.events.find(r=>r.id===t.dataset.id);if(!n)return;a.modal={type:"event-form",editing:n},c();return}if(e==="delete-event"){a.data.events=a.data.events.filter(n=>n.id!==t.dataset.id),y(),c();return}if(e==="edit-tracker"){const n=a.data.trackers.find(r=>r.id===t.dataset.id);if(!n)return;a.modal={type:"tracker-form",editing:n},c();return}if(e==="delete-tracker"){a.data.trackers=a.data.trackers.filter(n=>n.id!==t.dataset.id),y(),c();return}if(e==="mark-done"){const n=a.data.trackers.find(r=>r.id===t.dataset.id);if(!n)return;n.lastDone=l(),n.checks[N(n.period)]=!0,y(),c();return}if(e==="toggle-check"){const n=a.data.trackers.find(o=>o.id===t.dataset.id);if(!n)return;const r=N(n.period);n.checks[r]=!n.checks[r],y(),c();return}if(e==="edit-account"){const n=a.data.accounts.find(r=>r.id===t.dataset.id);if(!n)return;a.modal={type:"account-form",editing:n},c();return}e==="delete-account"&&(a.data.accounts=a.data.accounts.filter(n=>n.id!==t.dataset.id),a.data.events=a.data.events.map(n=>n.accountId===t.dataset.id?{...n,accountId:""}:n),y(),c())}function re(e){var r;const t={id:((r=a.modal.editing)==null?void 0:r.id)||m(),title:String(e.title||"").trim(),category:e.category,date:e.date,startTime:e.startTime,endTime:e.endTime,notes:String(e.notes||"").trim(),accountId:e.accountId,recurrenceType:j(e.recurrenceType),recurrenceEnd:e.recurrenceEnd||"",reminderType:F(e.reminderType),reminderMinutesBefore:P(e.reminderMinutesBefore)};if(!t.title||!t.date)return;const n=a.data.events.findIndex(o=>o.id===t.id);n>=0?a.data.events[n]=t:a.data.events.push(t),y(),a.modal=null,c()}function oe(e){const t=String(e.entry||"").trim();if(!t)return;const n=ge(t),r={id:m(),title:n.title,category:n.category,date:n.date,startTime:n.startTime,endTime:n.endTime,notes:n.notes,accountId:"",recurrenceType:n.recurrenceType,recurrenceEnd:n.recurrenceEnd,reminderType:n.reminderType,reminderMinutesBefore:n.reminderMinutesBefore};a.data.events.push(r),a.selectedDate=r.date,a.modal=null,a.activeTab="today",y(),c()}function ie(e){var r,o,i;const t={id:((r=a.modal.editing)==null?void 0:r.id)||m(),name:String(e.name||"").trim(),type:e.type,frequencyDays:Math.max(1,Number(e.frequencyDays||1)),period:e.period,lastDone:((o=a.modal.editing)==null?void 0:o.lastDone)||l(),checks:((i=a.modal.editing)==null?void 0:i.checks)||{}};if(!t.name)return;const n=a.data.trackers.findIndex(s=>s.id===t.id);n>=0?a.data.trackers[n]=t:a.data.trackers.push(t),y(),a.modal=null,c()}function se(e){var r;const t={id:((r=a.modal.editing)==null?void 0:r.id)||m(),name:String(e.name||"").trim(),balance:Number(e.balance||0)};if(!t.name)return;const n=a.data.accounts.findIndex(o=>o.id===t.id);n>=0?a.data.accounts[n]=t:a.data.accounts.push(t),y(),a.modal=null,c()}function g(e){return a.data.events.filter(t=>Ae(t,e)).map(t=>Ie(t,e)).sort(de)}function ce(e){return g(e).length}function de(e,t){return`${e.date}-${e.startTime||"99:99"}`.localeCompare(`${t.date}-${t.startTime||"99:99"}`)}function y(){localStorage.setItem(B,JSON.stringify(a.data))}function le(){const e=localStorage.getItem(B);if(!e)return C(A);try{const t=JSON.parse(e);return{events:Array.isArray(t.events)?t.events.map(n=>O(n)):[],trackers:Array.isArray(t.trackers)?t.trackers:[],accounts:Array.isArray(t.accounts)?t.accounts:[]}}catch{return C(A)}}function C(e){const t=JSON.parse(JSON.stringify(e));return{...t,events:Array.isArray(t.events)?t.events.map(n=>O(n)):[]}}function O(e){return{id:e.id||m(),title:String(e.title||"").trim(),category:e.category||"plan",date:e.date||l(),startTime:e.startTime||"",endTime:e.endTime||"",notes:e.notes||"",accountId:e.accountId||"",recurrenceType:j(e.recurrenceType),recurrenceEnd:e.recurrenceEnd||"",reminderType:F(e.reminderType),reminderMinutesBefore:P(e.reminderMinutesBefore)}}function l(){return new Date().toISOString().slice(0,10)}function p(e){const t=new Date;return t.setDate(t.getDate()+e),t.toISOString().slice(0,10)}function x(e){return new Date(`${e}T12:00:00`).toLocaleDateString(void 0,{month:"long",year:"numeric"})}function ue(e){return new Date(`${e}T12:00:00`).toLocaleDateString(void 0,{weekday:"long",month:"long",day:"numeric"})}function D(e){return new Date(`${e}T12:00:00`).toLocaleDateString(void 0,{month:"short",day:"numeric"})}function $(e,t){return!e&&!t?"Anytime":e&&!t?v(e):!e&&t?`Until ${v(t)}`:`${v(e)} - ${v(t)}`}function me(e){return e==="daily"?"Repeats daily":e==="weekly"?"Repeats weekly":e==="monthly"?"Repeats monthly":""}function pe(e){return e.reminderType==="at-time"&&e.startTime?`Alert ${e.reminderMinutesBefore}m before`:e.reminderType==="morning"?"Morning reminder":""}function v(e){const[t,n]=String(e).split(":"),r=Number(t),o=Number(n||0),i=new Date;return i.setHours(r,o,0,0),i.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}function fe(e){const t=new Date(`${e.lastDone}T12:00:00`).getTime(),n=new Date(`${l()}T12:00:00`).getTime(),r=Math.floor((n-t)/(24*60*60*1e3));return Math.max(0,e.frequencyDays-r)}function ye(e,t){const n=Math.max(1,Number(e.frequencyDays)||1),r=Math.min(n,Math.max(0,n-t));return Math.round(r/n*100)}function N(e){const t=new Date;if(e==="month")return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}`;const n=new Date(t.getFullYear(),0,1),r=Math.floor((t-n)/(24*60*60*1e3)),o=Math.ceil((r+n.getDay()+1)/7);return`${t.getFullYear()}-W${String(o).padStart(2,"0")}`}function be(e){return new Intl.NumberFormat(void 0,{style:"currency",currency:"USD"}).format(Number(e||0))}function f(e){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function ge(e){const t=e.toLowerCase(),n=Te(t)||a.selectedDate,{startTime:r,endTime:o}=$e(t),i=ke(t),s=De(we(e)),d=he(t),u=ve(t,r);return{title:s||"New item",category:i,date:n,startTime:r,endTime:o,notes:`Added from quick capture: ${e}`,recurrenceType:d,recurrenceEnd:d==="none"?"":p(90),reminderType:u,reminderMinutesBefore:15}}function he(e){return/\b(daily|every day|everyday)\b/.test(e)?"daily":/\b(weekly|every week)\b/.test(e)?"weekly":/\b(monthly|every month)\b/.test(e)?"monthly":"none"}function ve(e,t){return/\b(no reminder|silent)\b/.test(e)?"none":/\b(morning reminder|morning)\b/.test(e)?"morning":/\b(remind|alert|notify)\b/.test(e)?t?"at-time":"morning":"none"}function Te(e){const t=new Date,n=["sun","mon","tue","wed","thu","fri","sat"];if(e.includes("today"))return l();if(e.includes("tomorrow"))return p(1);const r=e.match(/\b(sun|mon|tue|wed|thu|fri|sat)(day)?\b/);if(r){const s=n.indexOf(r[1].slice(0,3)),d=new Date(`${l()}T12:00:00`),u=d.getDay();let b=(s-u+7)%7;return b===0&&(b=7),d.setDate(d.getDate()+b),d.toISOString().slice(0,10)}const o=e.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);if(o){const s=Number(o[1]),d=String(Number(o[2])).padStart(2,"0"),u=String(Number(o[3])).padStart(2,"0");return`${s}-${d}-${u}`}const i=e.match(/\b(\d{1,2})\/(\d{1,2})\b/);if(i){const s=String(Number(i[1])).padStart(2,"0"),d=String(Number(i[2])).padStart(2,"0");return`${t.getFullYear()}-${s}-${d}`}return null}function $e(e){const t=e.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(?:-|to)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/);if(t){const r=S(t[1],t[2],t[3]),o=S(t[4],t[5],t[6]||t[3]);return{startTime:r,endTime:o}}const n=e.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);return n?{startTime:S(n[1],n[2],n[3]),endTime:""}:{startTime:"",endTime:""}}function S(e,t,n){let r=Number(e);const o=Number(t||0),i=String(n||"").toLowerCase();return i==="pm"&&r<12&&(r+=12),i==="am"&&r===12&&(r=0),`${String(r).padStart(2,"0")}:${String(o).padStart(2,"0")}`}function ke(e){return/\bclass|lecture|lab|study\b/.test(e)?"class":/\bshift|work|job|clock\b/.test(e)?"shift":/\bdeadline|due|submit|assignment|exam\b/.test(e)?"deadline_school":/\bmeeting|client|project\b/.test(e)?"deadline_work":/\bmoney|bank|pay|bill|rent|budget\b/.test(e)?"money":/\bdoctor|dentist|appointment|salon|beauty|nails\b/.test(e)?"appointment":"plan"}function we(e){return e.replace(/\b(today|tomorrow|sun(day)?|mon(day)?|tue(sday)?|wed(nesday)?|thu(rsday)?|fri(day)?|sat(urday)?)\b/gi," ").replace(/\b\d{1,2}(:\d{2})?\s*(am|pm)?\s*[-to]*\s*\d{0,2}(:\d{2})?\s*(am|pm)?\b/gi," ").replace(/\b(every day|everyday|daily|weekly|monthly|every week|every month|remind me|alert me|notify me)\b/gi," ").replace(/\s+/g," ").trim()}function De(e){return String(e).toLowerCase().split(" ").filter(Boolean).map(t=>t[0].toUpperCase()+t.slice(1)).join(" ")}function Se(e){const t=g(e),n=new Date,r=n.getHours()*60+n.getMinutes();return t.find(o=>{if(!o.startTime||!o.endTime)return!1;const i=k(o.startTime),s=k(o.endTime);return r>=i&&r<=s})}function Ne(e){const t=g(e),n=new Date,r=n.getHours()*60+n.getMinutes();return t.find(o=>o.startTime?k(o.startTime)>r:!1)}function Me(){const e=p(7);return E(l(),e,20,t=>t.category==="deadline_school"||t.category==="deadline_work")[0]}function Ee(e){const t=new Date(`${e}T12:00:00`).getTime(),n=new Date(`${l()}T12:00:00`).getTime(),r=Math.floor((t-n)/(24*60*60*1e3));return Math.max(0,r)}function k(e){const[t,n]=String(e).split(":");return Number(t)*60+Number(n||0)}function qe(){"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js")})}function j(e){return["none","daily","weekly","monthly"].includes(e)?e:"none"}function F(e){return["none","at-time","morning"].includes(e)?e:"none"}function P(e){const t=Number(e);return Number.isFinite(t)?Math.min(60,Math.max(5,t)):15}function Ae(e,t){if(!(e!=null&&e.date)||t<e.date||e.recurrenceEnd&&t>e.recurrenceEnd)return!1;if(e.recurrenceType==="none")return e.date===t;if(e.recurrenceType==="daily")return!0;const n=new Date(`${e.date}T12:00:00`),r=new Date(`${t}T12:00:00`);return e.recurrenceType==="weekly"?n.getDay()===r.getDay():e.recurrenceType==="monthly"?n.getDate()===r.getDate():e.date===t}function Ie(e,t){return{...e,date:t,baseDate:e.date}}function E(e,t,n=1/0,r=()=>!0){const o=[];let i=e;for(;i<=t;){const s=g(i).filter(r);if(o.push(...s),o.length>=n)break;i=Ce(i,1)}return o.slice(0,n)}function Ce(e,t){const n=new Date(`${e}T12:00:00`);return n.setDate(n.getDate()+t),n.toISOString().slice(0,10)}function Le(){const e=localStorage.getItem(R);if(!e)return{};try{const t=JSON.parse(e);return typeof t=="object"&&t?t:{}}catch{return{}}}function U(){localStorage.setItem(R,JSON.stringify(a.reminderLog))}function q(e,t){return`${t}|${e.id}|${e.startTime||"none"}|${e.reminderType}`}function Be(e,t){return!!a.reminderLog[q(e,t)]}function Re(e,t){a.reminderLog[q(e,t)]=Date.now(),U()}function Oe(){const e=Date.now()-12096e5;Object.entries(a.reminderLog).forEach(([t,n])=>{Number(n)<e&&delete a.reminderLog[t]}),U()}function xe(){if(typeof Notification>"u"){window.alert("Notifications are not supported in this browser.");return}if(Notification.permission==="granted"){window.alert("Reminders are already enabled.");return}Notification.requestPermission().then(()=>{c(),M()})}function je(){Oe(),M(),window.setInterval(M,30*1e3)}function M(){if(typeof Notification>"u"||Notification.permission!=="granted")return;const e=l(),t=new Date,n=t.getHours()*60+t.getMinutes();g(e).forEach(o=>{if(!(o.reminderType==="none"||Be(o,e))){if(o.reminderType==="at-time"&&o.startTime){const i=Math.max(0,k(o.startTime)-o.reminderMinutesBefore);n>=i&&L(o,e,`${o.reminderMinutesBefore}m reminder`);return}o.reminderType==="morning"&&n>=8*60&&L(o,e,"Morning reminder")}})}function L(e,t,n){new Notification(`Planner: ${e.title}`,{body:`${n} • ${$(e.startTime,e.endTime)} • ${D(t)}`,tag:q(e,t)}),Re(e,t)}
