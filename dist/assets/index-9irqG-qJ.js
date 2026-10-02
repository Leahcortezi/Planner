(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function a(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=a(r);fetch(r.href,s)}})();const E="plannerDashboardDataV1",l=typeof crypto<"u"&&typeof crypto.randomUUID=="function"?()=>crypto.randomUUID():()=>`id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`,h={class:{label:"Class",color:"#7a5cff",icon:"🎓"},shift:{label:"Shift",color:"#34c759",icon:"💼"},appointment:{label:"Appointment",color:"#0a84ff",icon:"📍"},plan:{label:"Plan",color:"#ff9f0a",icon:"🗓️"},deadline_school:{label:"School Deadline",color:"#ff375f",icon:"📚"},deadline_work:{label:"Work Deadline",color:"#ff453a",icon:"📌"},money:{label:"Money",color:"#30b0c7",icon:"💳"}},A={events:[{id:l(),title:"Biology Lecture",category:"class",date:y(0),startTime:"09:30",endTime:"10:45",notes:"Bring lab notebook",accountId:""},{id:l(),title:"Coffee Shift",category:"shift",date:y(0),startTime:"13:00",endTime:"18:00",notes:"Close register",accountId:""},{id:l(),title:"UX Assignment Due",category:"deadline_school",date:y(2),startTime:"23:59",endTime:"",notes:"Submit on portal",accountId:""}],trackers:[{id:l(),name:"Laundry",type:"chore",frequencyDays:7,period:"week",lastDone:y(-5),checks:{}},{id:l(),name:"Yoga",type:"selfcare",frequencyDays:2,period:"week",lastDone:y(-1),checks:{}},{id:l(),name:"Birth Control",type:"selfcare",frequencyDays:1,period:"month",lastDone:y(-1),checks:{}}],accounts:[{id:l(),name:"Main Checking",balance:980},{id:l(),name:"Bills Checking",balance:410}]},n={selectedDate:p(),activeTab:"today",modal:null,data:tt()},$=document.querySelector("#app");i();bt();function i(){$.innerHTML=`
    <main class="screen">
      <header class="top">
        <div>
          <p class="caption">Planner</p>
          <h1>${n.activeTab==="calendar"?M(n.selectedDate):et(n.selectedDate)}</h1>
        </div>
        <button class="pill" data-action="jump-today">Today</button>
      </header>

      <section class="content">
        ${F()}
      </section>

      <nav class="bottom-nav">
        <button class="tab ${n.activeTab==="today"?"active":""}" data-tab="today">🏠 Today</button>
        <button class="tab ${n.activeTab==="calendar"?"active":""}" data-tab="calendar">📆 Calendar</button>
        <button class="tab ${n.activeTab==="trackers"?"active":""}" data-tab="trackers">🌸 Trackers</button>
        <button class="tab ${n.activeTab==="money"?"active":""}" data-tab="money">💳 Money</button>
        <button class="tab ${n.activeTab==="inbox"?"active":""}" data-tab="inbox">✨ Inbox</button>
      </nav>

      <button class="fab" data-action="quick-add">＋</button>
    </main>

    ${J()}
  `,K()}function F(){return n.activeTab==="today"?C():n.activeTab==="calendar"?P():n.activeTab==="trackers"?W():n.activeTab==="money"?Y():n.activeTab==="inbox"?U():C()}function C(){const t=v(n.selectedDate);return`
    <div class="stack">
      <div class="card day-overview">
        <div class="section-head">
          <h2>Your Day</h2>
          <p>${Z(n.selectedDate)} items</p>
        </div>
        <div class="smart-grid">
          ${R()}
        </div>
      </div>
      <div class="card soft">
        <div class="section-head">
          <h3>${q(n.selectedDate)} Agenda</h3>
          <button class="ghost" data-action="new-event">Add Event</button>
        </div>
        <div class="event-list">${k(t)}</div>
      </div>
    </div>
  `}function P(){const t=v(n.selectedDate);return`
    <div class="stack">
      <section class="card">
        <div class="section-head">
          <h2>Calendar</h2>
          <p>${M(n.selectedDate)}</p>
        </div>
        ${H(n.selectedDate)}
      </section>
      <div class="card soft">
        <div class="section-head">
          <h3>${q(n.selectedDate)}</h3>
          <button class="ghost" data-action="new-event">Add</button>
        </div>
        <div class="event-list">${k(t)}</div>
      </div>
    </div>
  `}function U(){const t=n.data.events.filter(e=>e.date>=p()).sort(D).slice(0,5);return`
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
      </div>
      <div class="card soft">
        <div class="section-head">
          <h3>Upcoming</h3>
          <button class="ghost" data-action="new-event">Manual Add</button>
        </div>
        <div class="event-list">${k(t)}</div>
      </div>
    </div>
  `}function W(){const t=n.data.trackers;return`
    <div class="card soft">
      <div class="section-head">
        <h3>Chores & Self-Care</h3>
        <button class="ghost" data-action="new-tracker">Add Tracker</button>
      </div>
      <div class="tracker-list">
        ${t.length?t.map(e=>_(e)).join(""):'<p class="empty">No trackers yet.</p>'}
      </div>
    </div>
  `}function Y(){const{accounts:t}=n.data,e=n.data.events.filter(a=>a.category==="money").sort(D).slice(0,6);return`
    <div class="stack">
      <div class="card soft">
        <div class="section-head">
          <h3>Checking Accounts</h3>
          <button class="ghost" data-action="new-account">Add Account</button>
        </div>
        <div class="account-grid">
          ${t.length?t.map(a=>B(a)).join(""):'<p class="empty">No accounts yet.</p>'}
        </div>
      </div>
      <div class="card soft">
        <div class="section-head">
          <h3>Upcoming Money Items</h3>
          <button class="ghost" data-action="new-money-event">Add Item</button>
        </div>
        <div class="event-list">${k(e)}</div>
      </div>
    </div>
  `}function _(t){const e=at(t),a=S(t.period),o=!!t.checks[a],r=nt(t,e),s=t.type==="chore"?"🧹":"🌸",c=e===0?"Due now":`${e}d left`;return`
    <article class="tracker-card ${t.type}">
      <div class="tracker-top">
        <div class="tracker-icon">${s}</div>
        <div class="tracker-title-wrap">
          <p class="tracker-type ${t.type}">${t.type==="chore"?"Chore":"Self-Care"}</p>
          <h4>${u(t.name)}</h4>
          <p class="muted">Every ${t.frequencyDays} day${t.frequencyDays===1?"":"s"} • ${t.period}</p>
        </div>
        <p class="tracker-chip ${e===0?"due":""}">${c}</p>
      </div>
      <div class="tracker-progress">
        <div class="tracker-progress-fill ${e===0?"due":""}" style="width:${r}%"></div>
      </div>
      <div class="tracker-actions">
        <label class="check-wrap">
          <input type="checkbox" data-action="toggle-check" data-id="${t.id}" ${o?"checked":""} />
          ${t.period==="week"?"Done this week":"Done this month"}
        </label>
        <button class="pill" data-action="mark-done" data-id="${t.id}">Mark done today</button>
        <div class="row-actions">
          <button class="tiny" data-action="edit-tracker" data-id="${t.id}">Edit</button>
          <button class="tiny danger" data-action="delete-tracker" data-id="${t.id}">Delete</button>
        </div>
      </div>
    </article>
  `}function B(t){return`
    <article class="account-card">
      <p>${u(t.name)}</p>
      <h4>${ot(t.balance)}</h4>
      <div class="row-actions">
        <button class="tiny" data-action="edit-account" data-id="${t.id}">Edit</button>
        <button class="tiny danger" data-action="delete-account" data-id="${t.id}">Delete</button>
      </div>
    </article>
  `}function k(t,e){return t.length?t.map(a=>{const o=h[a.category]??h.plan;return`
        <article class="event-row">
          <div class="event-dot" style="background:${o.color}"></div>
          <div class="event-main">
            <p class="badge">${o.icon} ${o.label}</p>
            <h4>${u(a.title)}</h4>
            <p class="muted">${w(a.startTime,a.endTime)} ${a.notes?`• ${u(a.notes)}`:""}</p>
          </div>
          ${`<div class="row-actions">
                    <button class="tiny" data-action="edit-event" data-id="${a.id}">Edit</button>
                    <button class="tiny danger" data-action="delete-event" data-id="${a.id}">Delete</button>
                 </div>`}
        </article>
      `}).join(""):'<p class="empty">Nothing scheduled yet.</p>'}function H(t){const e=new Date(`${t}T12:00:00`),a=e.getFullYear(),o=e.getMonth(),s=(new Date(a,o,1).getDay()+6)%7,c=new Date(a,o+1,0).getDate(),d=[];for(let m=0;m<s;m+=1)d.push('<div class="cal-cell blank"></div>');for(let m=1;m<=c;m+=1){const b=new Date(a,o,m,12).toISOString().slice(0,10),L=b===n.selectedDate,O=b===p(),x=v(b).slice(0,3).map(j=>`<span style="background:${(h[j.category]??h.plan).color}"></span>`).join("");d.push(`
      <button class="cal-cell ${L?"selected":""} ${O?"today":""}" data-action="select-date" data-date="${b}">
        <strong>${m}</strong>
        <span class="dots">${x}</span>
      </button>
    `)}return`
    <div class="weekday-row">
      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
    </div>
    <div class="calendar-grid">${d.join("")}</div>
  `}function R(){const t=ut(n.selectedDate),e=mt(n.selectedDate),a=pt();return`
    <article class="smart-card now">
      <p class="smart-label">Now</p>
      <h4>${t?u(t.title):"Nothing right now"}</h4>
      <p>${t?w(t.startTime,t.endTime):"Take a breather ✨"}</p>
    </article>
    <article class="smart-card next">
      <p class="smart-label">Next</p>
      <h4>${e?u(e.title):"No more events today"}</h4>
      <p>${e?w(e.startTime,e.endTime):"You are caught up"}</p>
    </article>
    <article class="smart-card soon">
      <p class="smart-label">Due Soon</p>
      <h4>${a?u(a.title):"No urgent deadlines"}</h4>
      <p>${a?`${q(a.date)} • ${ft(a.date)}d left`:"Everything looks clear"}</p>
    </article>
  `}function J(){if(!n.modal)return"";if(n.modal.type==="quick-add")return`
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
    `;if(n.modal.type==="event-form"){const t=n.modal.editing||{title:"",category:n.modal.preset||"plan",date:n.selectedDate,startTime:"",endTime:"",notes:"",accountId:""};return`
      <div class="modal-backdrop" data-action="close-modal">
        <form class="modal form" data-form="event" data-stop>
          <h3>${n.modal.editing?"Edit Event":"New Event"}</h3>
          <label>Title<input required name="title" value="${u(t.title)}" /></label>
          <label>Category
            <select name="category">
              ${Object.entries(h).map(([e,a])=>`<option value="${e}" ${t.category===e?"selected":""}>${a.label}</option>`).join("")}
            </select>
          </label>
          <label>Date<input required type="date" name="date" value="${t.date}" /></label>
          <div class="double">
            <label>Start<input type="time" name="startTime" value="${t.startTime||""}" /></label>
            <label>End<input type="time" name="endTime" value="${t.endTime||""}" /></label>
          </div>
          <label>Notes<input name="notes" value="${u(t.notes||"")}" /></label>
          <label>Account (for money items)
            <select name="accountId">
              <option value="">None</option>
              ${n.data.accounts.map(e=>`<option value="${e.id}" ${t.accountId===e.id?"selected":""}>${u(e.name)}</option>`).join("")}
            </select>
          </label>
          <div class="modal-actions">
            <button type="button" class="ghost" data-action="close-modal">Cancel</button>
            <button class="pill" type="submit">Save</button>
          </div>
        </form>
      </div>
    `}if(n.modal.type==="tracker-form"){const t=n.modal.editing||{name:"",type:"chore",frequencyDays:7,period:"week"};return`
      <div class="modal-backdrop" data-action="close-modal">
        <form class="modal form" data-form="tracker" data-stop>
          <h3>${n.modal.editing?"Edit Tracker":"New Tracker"}</h3>
          <label>Name<input required name="name" value="${u(t.name)}" /></label>
          <label>Type
            <select name="type">
              <option value="chore" ${t.type==="chore"?"selected":""}>Chore</option>
              <option value="selfcare" ${t.type==="selfcare"?"selected":""}>Self-Care</option>
            </select>
          </label>
          <label>How often (days)
            <input required type="number" min="1" name="frequencyDays" value="${t.frequencyDays}" />
          </label>
          <label>Checklist period
            <select name="period">
              <option value="week" ${t.period==="week"?"selected":""}>Week</option>
              <option value="month" ${t.period==="month"?"selected":""}>Month</option>
            </select>
          </label>
          <div class="modal-actions">
            <button type="button" class="ghost" data-action="close-modal">Cancel</button>
            <button class="pill" type="submit">Save</button>
          </div>
        </form>
      </div>
    `}if(n.modal.type==="account-form"){const t=n.modal.editing||{name:"",balance:0};return`
      <div class="modal-backdrop" data-action="close-modal">
        <form class="modal form" data-form="account" data-stop>
          <h3>${n.modal.editing?"Edit Account":"New Account"}</h3>
          <label>Name<input required name="name" value="${u(t.name)}" /></label>
          <label>Balance<input required type="number" step="0.01" name="balance" value="${t.balance}" /></label>
          <div class="modal-actions">
            <button type="button" class="ghost" data-action="close-modal">Cancel</button>
            <button class="pill" type="submit">Save</button>
          </div>
        </form>
      </div>
    `}return""}function K(){$.querySelectorAll("[data-tab]").forEach(t=>{t.addEventListener("click",()=>{n.activeTab=t.dataset.tab,i()})}),$.querySelectorAll("[data-action]").forEach(t=>{t.addEventListener("click",e=>{const a=t.dataset.action;t.hasAttribute("data-stop")&&e.stopPropagation(),Q(a,t)})}),$.querySelectorAll("form[data-form]").forEach(t=>{t.addEventListener("submit",e=>{e.preventDefault();const a=t.dataset.form,o=Object.fromEntries(new FormData(t).entries());a==="event"&&G(o),a==="tracker"&&X(o),a==="account"&&z(o),a==="quick-capture"&&V(o)})})}function Q(t,e){if(t==="jump-today"){n.selectedDate=p(),n.activeTab="today",i();return}if(t==="select-date"){n.selectedDate=e.dataset.date,i();return}if(t==="quick-add"){n.modal={type:"quick-add"},i();return}if(t==="close-modal"){n.modal=null,i();return}if(t==="quick-preset"){n.modal={type:"event-form",preset:e.dataset.preset},i();return}if(t==="open-tracker-form"||t==="new-tracker"){n.modal={type:"tracker-form"},i();return}if(t==="new-event"){n.modal={type:"event-form"},i();return}if(t==="new-account"){n.modal={type:"account-form"},i();return}if(t==="new-money-event"){n.modal={type:"event-form",preset:"money"},i();return}if(t==="edit-event"){const a=n.data.events.find(o=>o.id===e.dataset.id);if(!a)return;n.modal={type:"event-form",editing:a},i();return}if(t==="delete-event"){n.data.events=n.data.events.filter(a=>a.id!==e.dataset.id),f(),i();return}if(t==="edit-tracker"){const a=n.data.trackers.find(o=>o.id===e.dataset.id);if(!a)return;n.modal={type:"tracker-form",editing:a},i();return}if(t==="delete-tracker"){n.data.trackers=n.data.trackers.filter(a=>a.id!==e.dataset.id),f(),i();return}if(t==="mark-done"){const a=n.data.trackers.find(o=>o.id===e.dataset.id);if(!a)return;a.lastDone=p(),a.checks[S(a.period)]=!0,f(),i();return}if(t==="toggle-check"){const a=n.data.trackers.find(r=>r.id===e.dataset.id);if(!a)return;const o=S(a.period);a.checks[o]=!a.checks[o],f(),i();return}if(t==="edit-account"){const a=n.data.accounts.find(o=>o.id===e.dataset.id);if(!a)return;n.modal={type:"account-form",editing:a},i();return}t==="delete-account"&&(n.data.accounts=n.data.accounts.filter(a=>a.id!==e.dataset.id),n.data.events=n.data.events.map(a=>a.accountId===e.dataset.id?{...a,accountId:""}:a),f(),i())}function G(t){var o;const e={id:((o=n.modal.editing)==null?void 0:o.id)||l(),title:String(t.title||"").trim(),category:t.category,date:t.date,startTime:t.startTime,endTime:t.endTime,notes:String(t.notes||"").trim(),accountId:t.accountId};if(!e.title||!e.date)return;const a=n.data.events.findIndex(r=>r.id===e.id);a>=0?n.data.events[a]=e:n.data.events.push(e),f(),n.modal=null,i()}function V(t){const e=String(t.entry||"").trim();if(!e)return;const a=rt(e),o={id:l(),title:a.title,category:a.category,date:a.date,startTime:a.startTime,endTime:a.endTime,notes:a.notes,accountId:""};n.data.events.push(o),n.selectedDate=o.date,n.modal=null,n.activeTab="today",f(),i()}function X(t){var o,r,s;const e={id:((o=n.modal.editing)==null?void 0:o.id)||l(),name:String(t.name||"").trim(),type:t.type,frequencyDays:Math.max(1,Number(t.frequencyDays||1)),period:t.period,lastDone:((r=n.modal.editing)==null?void 0:r.lastDone)||p(),checks:((s=n.modal.editing)==null?void 0:s.checks)||{}};if(!e.name)return;const a=n.data.trackers.findIndex(c=>c.id===e.id);a>=0?n.data.trackers[a]=e:n.data.trackers.push(e),f(),n.modal=null,i()}function z(t){var o;const e={id:((o=n.modal.editing)==null?void 0:o.id)||l(),name:String(t.name||"").trim(),balance:Number(t.balance||0)};if(!e.name)return;const a=n.data.accounts.findIndex(r=>r.id===e.id);a>=0?n.data.accounts[a]=e:n.data.accounts.push(e),f(),n.modal=null,i()}function v(t){return n.data.events.filter(e=>e.date===t).sort(D)}function Z(t){return v(t).length}function D(t,e){return`${t.date}-${t.startTime||"99:99"}`.localeCompare(`${e.date}-${e.startTime||"99:99"}`)}function f(){localStorage.setItem(E,JSON.stringify(n.data))}function tt(){const t=localStorage.getItem(E);if(!t)return I(A);try{const e=JSON.parse(t);return{events:Array.isArray(e.events)?e.events:[],trackers:Array.isArray(e.trackers)?e.trackers:[],accounts:Array.isArray(e.accounts)?e.accounts:[]}}catch{return I(A)}}function I(t){return JSON.parse(JSON.stringify(t))}function p(){return new Date().toISOString().slice(0,10)}function y(t){const e=new Date;return e.setDate(e.getDate()+t),e.toISOString().slice(0,10)}function M(t){return new Date(`${t}T12:00:00`).toLocaleDateString(void 0,{month:"long",year:"numeric"})}function et(t){return new Date(`${t}T12:00:00`).toLocaleDateString(void 0,{weekday:"long",month:"long",day:"numeric"})}function q(t){return new Date(`${t}T12:00:00`).toLocaleDateString(void 0,{month:"short",day:"numeric"})}function w(t,e){return!t&&!e?"Anytime":t&&!e?g(t):!t&&e?`Until ${g(e)}`:`${g(t)} - ${g(e)}`}function g(t){const[e,a]=String(t).split(":"),o=Number(e),r=Number(a||0),s=new Date;return s.setHours(o,r,0,0),s.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}function at(t){const e=new Date(`${t.lastDone}T12:00:00`).getTime(),a=new Date(`${p()}T12:00:00`).getTime(),o=Math.floor((a-e)/(24*60*60*1e3));return Math.max(0,t.frequencyDays-o)}function nt(t,e){const a=Math.max(1,Number(t.frequencyDays)||1),o=Math.min(a,Math.max(0,a-e));return Math.round(o/a*100)}function S(t){const e=new Date;if(t==="month")return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`;const a=new Date(e.getFullYear(),0,1),o=Math.floor((e-a)/(24*60*60*1e3)),r=Math.ceil((o+a.getDay()+1)/7);return`${e.getFullYear()}-W${String(r).padStart(2,"0")}`}function ot(t){return new Intl.NumberFormat(void 0,{style:"currency",currency:"USD"}).format(Number(t||0))}function u(t){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function rt(t){const e=t.toLowerCase(),a=st(e)||n.selectedDate,{startTime:o,endTime:r}=it(e),s=ct(e);return{title:lt(dt(t))||"New item",category:s,date:a,startTime:o,endTime:r,notes:`Added from quick capture: ${t}`}}function st(t){const e=new Date,a=["sun","mon","tue","wed","thu","fri","sat"];if(t.includes("today"))return p();if(t.includes("tomorrow"))return y(1);const o=t.match(/\b(sun|mon|tue|wed|thu|fri|sat)(day)?\b/);if(o){const c=a.indexOf(o[1].slice(0,3)),d=new Date(`${p()}T12:00:00`),m=d.getDay();let b=(c-m+7)%7;return b===0&&(b=7),d.setDate(d.getDate()+b),d.toISOString().slice(0,10)}const r=t.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);if(r){const c=Number(r[1]),d=String(Number(r[2])).padStart(2,"0"),m=String(Number(r[3])).padStart(2,"0");return`${c}-${d}-${m}`}const s=t.match(/\b(\d{1,2})\/(\d{1,2})\b/);if(s){const c=String(Number(s[1])).padStart(2,"0"),d=String(Number(s[2])).padStart(2,"0");return`${e.getFullYear()}-${c}-${d}`}return null}function it(t){const e=t.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(?:-|to)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/);if(e){const o=T(e[1],e[2],e[3]),r=T(e[4],e[5],e[6]||e[3]);return{startTime:o,endTime:r}}const a=t.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);return a?{startTime:T(a[1],a[2],a[3]),endTime:""}:{startTime:"",endTime:""}}function T(t,e,a){let o=Number(t);const r=Number(e||0),s=String(a||"").toLowerCase();return s==="pm"&&o<12&&(o+=12),s==="am"&&o===12&&(o=0),`${String(o).padStart(2,"0")}:${String(r).padStart(2,"0")}`}function ct(t){return/\bclass|lecture|lab|study\b/.test(t)?"class":/\bshift|work|job|clock\b/.test(t)?"shift":/\bdeadline|due|submit|assignment|exam\b/.test(t)?"deadline_school":/\bmeeting|client|project\b/.test(t)?"deadline_work":/\bmoney|bank|pay|bill|rent|budget\b/.test(t)?"money":/\bdoctor|dentist|appointment|salon|beauty|nails\b/.test(t)?"appointment":"plan"}function dt(t){return t.replace(/\b(today|tomorrow|sun(day)?|mon(day)?|tue(sday)?|wed(nesday)?|thu(rsday)?|fri(day)?|sat(urday)?)\b/gi," ").replace(/\b\d{1,2}(:\d{2})?\s*(am|pm)?\s*[-to]*\s*\d{0,2}(:\d{2})?\s*(am|pm)?\b/gi," ").replace(/\s+/g," ").trim()}function lt(t){return String(t).toLowerCase().split(" ").filter(Boolean).map(e=>e[0].toUpperCase()+e.slice(1)).join(" ")}function ut(t){const e=v(t),a=new Date,o=a.getHours()*60+a.getMinutes();return e.find(r=>{if(!r.startTime||!r.endTime)return!1;const s=N(r.startTime),c=N(r.endTime);return o>=s&&o<=c})}function mt(t){const e=v(t),a=new Date,o=a.getHours()*60+a.getMinutes();return e.find(r=>r.startTime?N(r.startTime)>o:!1)}function pt(){const t=y(7);return n.data.events.filter(e=>(e.category==="deadline_school"||e.category==="deadline_work")&&e.date>=p()&&e.date<=t).sort(D)[0]}function ft(t){const e=new Date(`${t}T12:00:00`).getTime(),a=new Date(`${p()}T12:00:00`).getTime(),o=Math.floor((e-a)/(24*60*60*1e3));return Math.max(0,o)}function N(t){const[e,a]=String(t).split(":");return Number(e)*60+Number(a||0)}function bt(){"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js")})}
