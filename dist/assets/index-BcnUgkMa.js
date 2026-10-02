(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))o(c);new MutationObserver(c=>{for(const s of c)if(s.type==="childList")for(const d of s.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function a(c){const s={};return c.integrity&&(s.integrity=c.integrity),c.referrerPolicy&&(s.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?s.credentials="include":c.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(c){if(c.ep)return;c.ep=!0;const s=a(c);fetch(c.href,s)}})();const T="plannerDashboardDataV1",i=typeof crypto<"u"&&typeof crypto.randomUUID=="function"?()=>crypto.randomUUID():()=>`id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`,y={class:{label:"Class",color:"#7a5cff",icon:"🎓"},shift:{label:"Shift",color:"#34c759",icon:"💼"},appointment:{label:"Appointment",color:"#0a84ff",icon:"📍"},plan:{label:"Plan",color:"#ff9f0a",icon:"🗓️"},deadline_school:{label:"School Deadline",color:"#ff375f",icon:"📚"},deadline_work:{label:"Work Deadline",color:"#ff453a",icon:"📌"},money:{label:"Money",color:"#30b0c7",icon:"💳"}},w={events:[{id:i(),title:"Biology Lecture",category:"class",date:m(0),startTime:"09:30",endTime:"10:45",notes:"Bring lab notebook",accountId:""},{id:i(),title:"Coffee Shift",category:"shift",date:m(0),startTime:"13:00",endTime:"18:00",notes:"Close register",accountId:""},{id:i(),title:"UX Assignment Due",category:"deadline_school",date:m(2),startTime:"23:59",endTime:"",notes:"Submit on portal",accountId:""}],trackers:[{id:i(),name:"Laundry",type:"chore",frequencyDays:7,period:"week",lastDone:m(-5),checks:{}},{id:i(),name:"Yoga",type:"selfcare",frequencyDays:2,period:"week",lastDone:m(-1),checks:{}},{id:i(),name:"Birth Control",type:"selfcare",frequencyDays:1,period:"month",lastDone:m(-1),checks:{}}],accounts:[{id:i(),name:"Main Checking",balance:980},{id:i(),name:"Bills Checking",balance:410}]},n={selectedDate:f(),activeTab:"schedule",modal:null,data:K()},h=document.querySelector("#app");r();function r(){h.innerHTML=`
    <main class="screen">
      <header class="top">
        <div>
          <p class="caption">Planner</p>
          <h1>${G(n.selectedDate)}</h1>
        </div>
        <button class="pill" data-action="jump-today">Today</button>
      </header>

      <section class="card day-overview">
        <div class="section-head">
          <h2>Your Day</h2>
          <p>${J(n.selectedDate)} items</p>
        </div>
        <div class="event-list">${P(n.selectedDate)}</div>
      </section>

      <section class="card">
        <div class="section-head">
          <h2>Calendar</h2>
          <p>${R(n.selectedDate)}</p>
        </div>
        ${F(n.selectedDate)}
      </section>

      <nav class="tabs">
        <button class="tab ${n.activeTab==="schedule"?"active":""}" data-tab="schedule">Schedule</button>
        <button class="tab ${n.activeTab==="trackers"?"active":""}" data-tab="trackers">Trackers</button>
        <button class="tab ${n.activeTab==="money"?"active":""}" data-tab="money">Money</button>
      </nav>

      <section class="content">
        ${M()}
      </section>

      <button class="fab" data-action="quick-add">＋</button>
    </main>

    ${U()}
  `,B()}function M(){return n.activeTab==="trackers"?L():n.activeTab==="money"?O():N()}function N(){const t=g(n.selectedDate);return`
    <div class="card soft">
      <div class="section-head">
        <h3>${Q(n.selectedDate)}</h3>
        <button class="ghost" data-action="new-event">Add Event</button>
      </div>
      <div class="event-list">${D(t,!0)}</div>
    </div>
  `}function L(){const t=n.data.trackers;return`
    <div class="card soft">
      <div class="section-head">
        <h3>Chores & Self-Care</h3>
        <button class="ghost" data-action="new-tracker">Add Tracker</button>
      </div>
      <div class="tracker-list">
        ${t.length?t.map(e=>j(e)).join(""):'<p class="empty">No trackers yet.</p>'}
      </div>
    </div>
  `}function O(){const{accounts:t}=n.data,e=n.data.events.filter(a=>a.category==="money").sort(q).slice(0,6);return`
    <div class="stack">
      <div class="card soft">
        <div class="section-head">
          <h3>Checking Accounts</h3>
          <button class="ghost" data-action="new-account">Add Account</button>
        </div>
        <div class="account-grid">
          ${t.length?t.map(a=>x(a)).join(""):'<p class="empty">No accounts yet.</p>'}
        </div>
      </div>
      <div class="card soft">
        <div class="section-head">
          <h3>Upcoming Money Items</h3>
          <button class="ghost" data-action="new-money-event">Add Item</button>
        </div>
        <div class="event-list">${D(e,!0)}</div>
      </div>
    </div>
  `}function j(t){const e=X(t),a=$(t.period),o=!!t.checks[a],c=z(t,e),s=t.type==="chore"?"🧹":"🌸",d=e===0?"Due now":`${e}d left`;return`
    <article class="tracker-card ${t.type}">
      <div class="tracker-top">
        <div class="tracker-icon">${s}</div>
        <div class="tracker-title-wrap">
          <p class="tracker-type ${t.type}">${t.type==="chore"?"Chore":"Self-Care"}</p>
          <h4>${l(t.name)}</h4>
          <p class="muted">Every ${t.frequencyDays} day${t.frequencyDays===1?"":"s"} • ${t.period}</p>
        </div>
        <p class="tracker-chip ${e===0?"due":""}">${d}</p>
      </div>
      <div class="tracker-progress">
        <div class="tracker-progress-fill ${e===0?"due":""}" style="width:${c}%"></div>
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
  `}function x(t){return`
    <article class="account-card">
      <p>${l(t.name)}</p>
      <h4>${Z(t.balance)}</h4>
      <div class="row-actions">
        <button class="tiny" data-action="edit-account" data-id="${t.id}">Edit</button>
        <button class="tiny danger" data-action="delete-account" data-id="${t.id}">Delete</button>
      </div>
    </article>
  `}function P(t){const e=g(t);return D(e,!1)}function D(t,e){return t.length?t.map(a=>{const o=y[a.category]??y.plan;return`
        <article class="event-row">
          <div class="event-dot" style="background:${o.color}"></div>
          <div class="event-main">
            <p class="badge">${o.icon} ${o.label}</p>
            <h4>${l(a.title)}</h4>
            <p class="muted">${V(a.startTime,a.endTime)} ${a.notes?`• ${l(a.notes)}`:""}</p>
          </div>
          ${e?`<div class="row-actions">
                    <button class="tiny" data-action="edit-event" data-id="${a.id}">Edit</button>
                    <button class="tiny danger" data-action="delete-event" data-id="${a.id}">Delete</button>
                 </div>`:""}
        </article>
      `}).join(""):'<p class="empty">Nothing scheduled yet.</p>'}function F(t){const e=new Date(`${t}T12:00:00`),a=e.getFullYear(),o=e.getMonth(),s=(new Date(a,o,1).getDay()+6)%7,d=new Date(a,o+1,0).getDate(),k=[];for(let p=0;p<s;p+=1)k.push('<div class="cal-cell blank"></div>');for(let p=1;p<=d;p+=1){const b=new Date(a,o,p,12).toISOString().slice(0,10),A=b===n.selectedDate,I=b===f(),E=g(b).slice(0,3).map(C=>`<span style="background:${(y[C.category]??y.plan).color}"></span>`).join("");k.push(`
      <button class="cal-cell ${A?"selected":""} ${I?"today":""}" data-action="select-date" data-date="${b}">
        <strong>${p}</strong>
        <span class="dots">${E}</span>
      </button>
    `)}return`
    <div class="weekday-row">
      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
    </div>
    <div class="calendar-grid">${k.join("")}</div>
  `}function U(){if(!n.modal)return"";if(n.modal.type==="quick-add")return`
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
    `;if(n.modal.type==="event-form"){const t=n.modal.editing||{title:"",category:n.modal.preset||"plan",date:n.selectedDate,startTime:"",endTime:"",notes:"",accountId:""};return`
      <div class="modal-backdrop" data-action="close-modal">
        <form class="modal form" data-form="event" data-stop>
          <h3>${n.modal.editing?"Edit Event":"New Event"}</h3>
          <label>Title<input required name="title" value="${l(t.title)}" /></label>
          <label>Category
            <select name="category">
              ${Object.entries(y).map(([e,a])=>`<option value="${e}" ${t.category===e?"selected":""}>${a.label}</option>`).join("")}
            </select>
          </label>
          <label>Date<input required type="date" name="date" value="${t.date}" /></label>
          <div class="double">
            <label>Start<input type="time" name="startTime" value="${t.startTime||""}" /></label>
            <label>End<input type="time" name="endTime" value="${t.endTime||""}" /></label>
          </div>
          <label>Notes<input name="notes" value="${l(t.notes||"")}" /></label>
          <label>Account (for money items)
            <select name="accountId">
              <option value="">None</option>
              ${n.data.accounts.map(e=>`<option value="${e.id}" ${t.accountId===e.id?"selected":""}>${l(e.name)}</option>`).join("")}
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
          <label>Name<input required name="name" value="${l(t.name)}" /></label>
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
          <label>Name<input required name="name" value="${l(t.name)}" /></label>
          <label>Balance<input required type="number" step="0.01" name="balance" value="${t.balance}" /></label>
          <div class="modal-actions">
            <button type="button" class="ghost" data-action="close-modal">Cancel</button>
            <button class="pill" type="submit">Save</button>
          </div>
        </form>
      </div>
    `}return""}function B(){h.querySelectorAll("[data-tab]").forEach(t=>{t.addEventListener("click",()=>{n.activeTab=t.dataset.tab,r()})}),h.querySelectorAll("[data-action]").forEach(t=>{t.addEventListener("click",e=>{const a=t.dataset.action;t.hasAttribute("data-stop")&&e.stopPropagation(),W(a,t)})}),h.querySelectorAll("form[data-form]").forEach(t=>{t.addEventListener("submit",e=>{e.preventDefault();const a=t.dataset.form,o=Object.fromEntries(new FormData(t).entries());a==="event"&&Y(o),a==="tracker"&&_(o),a==="account"&&H(o)})})}function W(t,e){if(t==="jump-today"){n.selectedDate=f(),r();return}if(t==="select-date"){n.selectedDate=e.dataset.date,r();return}if(t==="quick-add"){n.modal={type:"quick-add"},r();return}if(t==="close-modal"){n.modal=null,r();return}if(t==="quick-preset"){n.modal={type:"event-form",preset:e.dataset.preset},r();return}if(t==="open-tracker-form"||t==="new-tracker"){n.modal={type:"tracker-form"},r();return}if(t==="new-event"){n.modal={type:"event-form"},r();return}if(t==="new-account"){n.modal={type:"account-form"},r();return}if(t==="new-money-event"){n.modal={type:"event-form",preset:"money"},r();return}if(t==="edit-event"){const a=n.data.events.find(o=>o.id===e.dataset.id);if(!a)return;n.modal={type:"event-form",editing:a},r();return}if(t==="delete-event"){n.data.events=n.data.events.filter(a=>a.id!==e.dataset.id),u(),r();return}if(t==="edit-tracker"){const a=n.data.trackers.find(o=>o.id===e.dataset.id);if(!a)return;n.modal={type:"tracker-form",editing:a},r();return}if(t==="delete-tracker"){n.data.trackers=n.data.trackers.filter(a=>a.id!==e.dataset.id),u(),r();return}if(t==="mark-done"){const a=n.data.trackers.find(o=>o.id===e.dataset.id);if(!a)return;a.lastDone=f(),a.checks[$(a.period)]=!0,u(),r();return}if(t==="toggle-check"){const a=n.data.trackers.find(c=>c.id===e.dataset.id);if(!a)return;const o=$(a.period);a.checks[o]=!a.checks[o],u(),r();return}if(t==="edit-account"){const a=n.data.accounts.find(o=>o.id===e.dataset.id);if(!a)return;n.modal={type:"account-form",editing:a},r();return}t==="delete-account"&&(n.data.accounts=n.data.accounts.filter(a=>a.id!==e.dataset.id),n.data.events=n.data.events.map(a=>a.accountId===e.dataset.id?{...a,accountId:""}:a),u(),r())}function Y(t){var o;const e={id:((o=n.modal.editing)==null?void 0:o.id)||i(),title:String(t.title||"").trim(),category:t.category,date:t.date,startTime:t.startTime,endTime:t.endTime,notes:String(t.notes||"").trim(),accountId:t.accountId};if(!e.title||!e.date)return;const a=n.data.events.findIndex(c=>c.id===e.id);a>=0?n.data.events[a]=e:n.data.events.push(e),u(),n.modal=null,r()}function _(t){var o,c,s;const e={id:((o=n.modal.editing)==null?void 0:o.id)||i(),name:String(t.name||"").trim(),type:t.type,frequencyDays:Math.max(1,Number(t.frequencyDays||1)),period:t.period,lastDone:((c=n.modal.editing)==null?void 0:c.lastDone)||f(),checks:((s=n.modal.editing)==null?void 0:s.checks)||{}};if(!e.name)return;const a=n.data.trackers.findIndex(d=>d.id===e.id);a>=0?n.data.trackers[a]=e:n.data.trackers.push(e),u(),n.modal=null,r()}function H(t){var o;const e={id:((o=n.modal.editing)==null?void 0:o.id)||i(),name:String(t.name||"").trim(),balance:Number(t.balance||0)};if(!e.name)return;const a=n.data.accounts.findIndex(c=>c.id===e.id);a>=0?n.data.accounts[a]=e:n.data.accounts.push(e),u(),n.modal=null,r()}function g(t){return n.data.events.filter(e=>e.date===t).sort(q)}function J(t){return g(t).length}function q(t,e){return`${t.date}-${t.startTime||"99:99"}`.localeCompare(`${e.date}-${e.startTime||"99:99"}`)}function u(){localStorage.setItem(T,JSON.stringify(n.data))}function K(){const t=localStorage.getItem(T);if(!t)return S(w);try{const e=JSON.parse(t);return{events:Array.isArray(e.events)?e.events:[],trackers:Array.isArray(e.trackers)?e.trackers:[],accounts:Array.isArray(e.accounts)?e.accounts:[]}}catch{return S(w)}}function S(t){return JSON.parse(JSON.stringify(t))}function f(){return new Date().toISOString().slice(0,10)}function m(t){const e=new Date;return e.setDate(e.getDate()+t),e.toISOString().slice(0,10)}function R(t){return new Date(`${t}T12:00:00`).toLocaleDateString(void 0,{month:"long",year:"numeric"})}function G(t){return new Date(`${t}T12:00:00`).toLocaleDateString(void 0,{weekday:"long",month:"long",day:"numeric"})}function Q(t){return new Date(`${t}T12:00:00`).toLocaleDateString(void 0,{month:"short",day:"numeric"})}function V(t,e){return!t&&!e?"Anytime":t&&!e?v(t):!t&&e?`Until ${v(e)}`:`${v(t)} - ${v(e)}`}function v(t){const[e,a]=String(t).split(":"),o=Number(e),c=Number(a||0),s=new Date;return s.setHours(o,c,0,0),s.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}function X(t){const e=new Date(`${t.lastDone}T12:00:00`).getTime(),a=new Date(`${f()}T12:00:00`).getTime(),o=Math.floor((a-e)/(24*60*60*1e3));return Math.max(0,t.frequencyDays-o)}function z(t,e){const a=Math.max(1,Number(t.frequencyDays)||1),o=Math.min(a,Math.max(0,a-e));return Math.round(o/a*100)}function $(t){const e=new Date;if(t==="month")return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`;const a=new Date(e.getFullYear(),0,1),o=Math.floor((e-a)/(24*60*60*1e3)),c=Math.ceil((o+a.getDay()+1)/7);return`${e.getFullYear()}-W${String(c).padStart(2,"0")}`}function Z(t){return new Intl.NumberFormat(void 0,{style:"currency",currency:"USD"}).format(Number(t||0))}function l(t){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
