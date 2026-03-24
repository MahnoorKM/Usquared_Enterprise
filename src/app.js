// Integration data
const integrations = {
  slack: {
    name: 'Slack', category: 'Messaging', status: 'disconnected',
    permissions: ['Read messages in channels', 'Send messages on behalf of twin', 'Access user profiles'],
    config: {
      workspace: 'Acme Corp Workspace',
      channels: [
        { name: '#general', mode: 'Listen' },
        { name: '#marketing', mode: 'Respond' },
        { name: '#sales-leads', mode: 'Respond' }
      ],
      twins: ['Marketing Twin', 'Sales Twin'],
      permissionLevel: 'Read & Respond'
    },
    activity: [
      { time: '3:42 PM', twin: 'Marketing Twin', action: 'Responded to message in #marketing' },
      { time: '3:38 PM', twin: 'Sales Twin', action: 'Read new message in #sales-leads' },
      { time: '3:21 PM', twin: 'Marketing Twin', action: 'Created thread in #general' },
      { time: '2:55 PM', twin: 'System', action: 'Sync completed — 48 messages processed' }
    ]
  },
  jira: {
    name: 'Jira', category: 'Project Mgmt', status: 'disconnected',
    permissions: ['Read project issues', 'Create and update issues', 'Access comments and attachments'],
    config: {
      project: 'ACME-Marketing',
      issueTypes: ['Task', 'Story', 'Bug'],
      twins: ['Marketing Twin'],
      autoAssign: true
    },
    activity: [
      { time: '1:50 PM', twin: 'Support Twin', action: 'Resolved ticket ACME-1234' },
      { time: '1:15 PM', twin: 'Marketing Twin', action: 'Created story ACME-1298' },
      { time: '12:40 PM', twin: 'System', action: 'Sync completed — 12 issues updated' }
    ]
  },
  asana: {
    name: 'Asana', category: 'Task Mgmt', status: 'disconnected',
    permissions: ['Read tasks and projects', 'Create and update tasks', 'Post comments'],
    config: {
      workspace: 'Acme Corp',
      projects: ['Q1 Campaign', 'Product Roadmap'],
      twins: ['Marketing Twin'],
      actions: ['Create', 'Update', 'Complete', 'Comment']
    },
    activity: [
      { time: '2:15 PM', twin: 'Marketing Twin', action: 'Commented on Q1 Campaign task' },
      { time: '11:30 AM', twin: 'Marketing Twin', action: 'Completed 3 tasks in Q1 Campaign' }
    ]
  },
  salesforce: {
    name: 'Salesforce', category: 'CRM', status: 'disconnected',
    permissions: ['Read leads and contacts', 'Update opportunity stages', 'Access reports'],
    config: {
      org: 'Acme Corp (Production)',
      objects: ['Leads', 'Contacts', 'Opportunities'],
      twins: ['Sales Twin'],
      triggers: ['New Lead', 'Stage Change', 'Close Won']
    },
    activity: [
      { time: '2:30 PM', twin: 'Sales Twin', action: 'Updated lead status for 5 contacts' },
      { time: '12:00 PM', twin: 'System', action: 'Sync completed — 23 records processed' }
    ]
  },
  teams: {
    name: 'Teams', category: 'Collaboration', status: 'disconnected',
    permissions: ['Read channel messages', 'Send messages in channels', 'Access team info'],
    config: {
      tenant: 'Acme Corp',
      teams: ['Marketing Team', 'All Hands'],
      channels: [
        { name: 'General', mode: 'Listen' },
        { name: 'Announcements', mode: 'Respond' }
      ],
      twins: ['Marketing Twin', 'Sales Twin']
    },
    activity: [
      { time: '3:10 PM', twin: 'Marketing Twin', action: 'Posted update in Announcements' },
      { time: '2:00 PM', twin: 'System', action: 'Sync completed — 31 messages processed' }
    ]
  }
};

// Current state
let currentIntegration = null;

// Modal helpers
function showModal(id) {
  document.getElementById(id).classList.remove('hidden');
  document.getElementById(id).classList.add('flex');
}
function hideModal(id) {
  document.getElementById(id).classList.add('hidden');
  document.getElementById(id).classList.remove('flex');
}

// Step 1: Click integration → open connect modal
function openConnect(key) {
  currentIntegration = key;
  const int = integrations[key];
  document.getElementById('connect-modal-title').textContent = `Connect to ${int.name}`;
  document.getElementById('connect-modal-subtitle').textContent = `U² will request the following permissions from ${int.name}:`;
  const list = document.getElementById('connect-modal-permissions');
  list.innerHTML = int.permissions.map(p =>
    `<li class="flex items-center gap-2 text-sm text-text-secondary">
      <svg class="w-4 h-4 text-text-tertiary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
      ${p}
    </li>`
  ).join('');
  document.getElementById('connect-modal-btn').textContent = `Continue to ${int.name} →`;
  // Reset states
  document.getElementById('connect-step-auth').classList.add('hidden');
  document.getElementById('connect-step-success').classList.add('hidden');
  document.getElementById('connect-step-permissions').classList.remove('hidden');
  showModal('connect-modal');
}

// Step 2: Simulate OAuth
function simulateOAuth() {
  document.getElementById('connect-step-permissions').classList.add('hidden');
  document.getElementById('connect-step-auth').classList.remove('hidden');
  // Fake loading
  setTimeout(() => {
    document.getElementById('connect-step-auth').classList.add('hidden');
    document.getElementById('connect-step-success').classList.remove('hidden');
    document.getElementById('connect-success-name').textContent = integrations[currentIntegration].name;
    integrations[currentIntegration].status = 'connected';
    updateCardState(currentIntegration);
  }, 1800);
}

// Step 3: Open configure panel after connect
function openConfigure() {
  hideModal('connect-modal');
  showConfigPanel(currentIntegration);
}

// Update card visual state
function updateCardState(key) {
  const card = document.getElementById('int-' + key);
  if (!card) return;
  const int = integrations[key];
  const dot = card.querySelector('.status-dot');
  const label = card.querySelector('.status-label');
  if (int.status === 'connected') {
    if (dot) { dot.classList.remove('hidden'); dot.classList.add('bg-green-500'); }
    if (label) label.textContent = 'Connected';
    card.onclick = () => showConfigPanel(key);
  } else if (int.status === 'active') {
    if (dot) { dot.classList.remove('hidden'); dot.classList.add('bg-green-500'); }
    if (label) label.textContent = 'Active';
    card.onclick = () => showManagePanel(key);
  } else {
    if (dot) dot.classList.add('hidden');
    if (label) label.textContent = 'Connect';
    card.onclick = () => openConnect(key);
  }
}

// Config panel
function showConfigPanel(key) {
  currentIntegration = key;
  const int = integrations[key];
  const cfg = int.config;
  document.getElementById('config-panel-title').textContent = `${int.name} Configuration`;

  let html = '';
  // Workspace / Org
  const wsLabel = cfg.workspace || cfg.org || cfg.project || cfg.tenant || '';
  if (wsLabel) {
    html += sectionHTML('Workspace', `<div class="flex items-center justify-between py-2 px-3 bg-bg-sidebar rounded-lg"><span class="text-sm text-text-primary">${wsLabel}</span><span class="text-xs text-green-600 font-medium">✓ Detected</span></div>`);
  }

  // Twins
  if (cfg.twins) {
    html += sectionHTML('Assign to Twins', cfg.twins.map(t =>
      `<label class="flex items-center gap-2 py-1.5 px-3 bg-bg-sidebar rounded-lg cursor-pointer hover:bg-bg-hover transition-colors"><input type="checkbox" checked class="accent-accent w-3.5 h-3.5"><span class="text-sm text-text-primary">${t}</span></label>`
    ).join(''));
  }

  // Channels
  if (cfg.channels) {
    html += sectionHTML('Channels', cfg.channels.map(c =>
      `<div class="flex items-center justify-between py-2 px-3 bg-bg-sidebar rounded-lg"><span class="text-sm text-text-primary">${c.name}</span><select class="text-xs bg-bg-content border border-border rounded px-2 py-1 text-text-secondary outline-none"><option ${c.mode==='Listen'?'selected':''}>Listen</option><option ${c.mode==='Respond'?'selected':''}>Respond</option></select></div>`
    ).join(''));
  }

  // Objects / Projects / Issue Types
  const listItems = cfg.objects || cfg.projects || cfg.issueTypes || cfg.actions || [];
  if (listItems.length && !cfg.channels) {
    const label = cfg.objects ? 'Objects' : cfg.projects ? 'Projects' : cfg.issueTypes ? 'Issue Types' : 'Actions';
    html += sectionHTML(label, listItems.map(i =>
      `<label class="flex items-center gap-2 py-1.5 px-3 bg-bg-sidebar rounded-lg cursor-pointer hover:bg-bg-hover transition-colors"><input type="checkbox" checked class="accent-accent w-3.5 h-3.5"><span class="text-sm text-text-primary">${i}</span></label>`
    ).join(''));
  }

  // Triggers
  if (cfg.triggers) {
    html += sectionHTML('Triggers', cfg.triggers.map(t =>
      `<label class="flex items-center gap-2 py-1.5 px-3 bg-bg-sidebar rounded-lg cursor-pointer hover:bg-bg-hover transition-colors"><input type="checkbox" checked class="accent-accent w-3.5 h-3.5"><span class="text-sm text-text-primary">${t}</span></label>`
    ).join(''));
  }

  document.getElementById('config-panel-body').innerHTML = html;
  showModal('config-panel');
}

function sectionHTML(title, content) {
  return `<div class="mb-5"><h4 class="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">${title}</h4><div class="space-y-1.5">${content}</div></div>`;
}

function saveConfig() {
  integrations[currentIntegration].status = 'active';
  updateCardState(currentIntegration);
  hideModal('config-panel');
  showToast(`${integrations[currentIntegration].name} configured and active`);
}

// Active management panel
function showManagePanel(key) {
  currentIntegration = key;
  const int = integrations[key];
  document.getElementById('manage-panel-title').textContent = int.name;
  document.getElementById('manage-panel-status').textContent = int.status === 'active' ? 'Active' : 'Connected';
  document.getElementById('manage-panel-twins').textContent = (int.config.twins || []).length + ' twins';

  const log = document.getElementById('manage-panel-log');
  log.innerHTML = int.activity.map(a =>
    `<div class="flex gap-3 py-2.5 border-b border-border-light last:border-0">
      <span class="text-[11px] text-text-tertiary w-14 shrink-0 pt-0.5">${a.time}</span>
      <div><span class="text-xs font-medium text-text-primary">${a.twin}</span><p class="text-xs text-text-secondary mt-0.5">${a.action}</p></div>
    </div>`
  ).join('');
  showModal('manage-panel');
}

function disconnectIntegration() {
  if (confirm(`Disconnect ${integrations[currentIntegration].name}? This will unlink all assigned twins.`)) {
    integrations[currentIntegration].status = 'disconnected';
    updateCardState(currentIntegration);
    hideModal('manage-panel');
    showToast(`${integrations[currentIntegration].name} disconnected`);
  }
}

// Toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.remove('hidden', 'translate-y-2', 'opacity-0');
  toast.classList.add('flex', 'translate-y-0', 'opacity-100');
  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 3000);
}

// Drawer toggle
let drawerOpen = true;
function toggleDrawer() {
  const drawer = document.getElementById('drawer');
  const content = document.getElementById('drawer-content');
  const arrow = document.getElementById('drawer-arrow');
  drawerOpen = !drawerOpen;
  if (drawerOpen) {
    drawer.style.width = '320px';
    content.style.display = 'flex';
    arrow.style.transform = 'rotate(0deg)';
  } else {
    drawer.style.width = '24px';
    content.style.display = 'none';
    arrow.style.transform = 'rotate(180deg)';
  }
}

// Navigation logic
function nav(page) {
  // Reset all nav styling
  document.getElementById('nav-home').className = 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors duration-150';
  document.getElementById('nav-twins').className = 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors duration-150';
  
  // Hide all views
  document.getElementById('view-home').classList.add('hidden');
  document.getElementById('view-home').classList.remove('flex');
  document.getElementById('view-twins').classList.add('hidden');
  document.getElementById('view-twins').classList.remove('flex');

  // Activate selected nav and view
  if (page === 'home') {
    document.getElementById('nav-home').className = 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-bg-active text-text-primary transition-colors duration-150';
    document.getElementById('view-home').classList.remove('hidden');
    document.getElementById('view-home').classList.add('flex');
    document.getElementById('topbar-title').textContent = 'Home';
    document.getElementById('topbar-badge').classList.add('hidden');
  } else if (page === 'twins') {
    document.getElementById('nav-twins').className = 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-bg-active text-text-primary transition-colors duration-150';
    document.getElementById('view-twins').classList.remove('hidden');
    document.getElementById('view-twins').classList.add('flex');
    document.getElementById('topbar-title').textContent = 'Twins';
    document.getElementById('topbar-badge').classList.remove('hidden');
  }
}

// Chart Init
function initCharts() {
  if (!window.Chart) return;
  Chart.defaults.color = '#737373';
  Chart.defaults.font.family = 'Figtree, sans-serif';

  const ctxGrowth = document.getElementById('growthChart');
  if (ctxGrowth) {
    new Chart(ctxGrowth.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Total Twins',
          data: [12, 28, 45, 78, 102, 124],
          borderColor: '#171717',
          backgroundColor: '#171717',
          borderWidth: 2,
          pointBackgroundColor: '#171717',
          fill: false,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: '#e5e5e5' } }
        }
      }
    });
  }

  const ctxDept = document.getElementById('deptChart');
  if (ctxDept) {
    new Chart(ctxDept.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Sales', 'Marketing', 'Support', 'Finance', 'HR'],
        datasets: [{
          data: [45, 30, 25, 15, 9],
          backgroundColor: ['#171717', '#404040', '#737373', '#a3a3a3', '#d4d4d4'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { position: 'right' }
        }
      }
    });
  }
}

// Invite Flow
function showInviteList() {
  const initial = document.getElementById('invite-state-initial');
  const list = document.getElementById('invite-state-list');
  if (initial && list) {
    initial.classList.add('hidden');
    initial.classList.remove('flex');
    list.classList.remove('hidden');
    list.classList.add('flex');
  }
}

function openAllInvitesModal() {
  showModal('invites-modal');
}

// Knowledgebase Flow
function openKbModal() {
  showModal('kb-modal');
}

function linkKnowledgebase() {
  hideModal('kb-modal');
  const initial = document.getElementById('kb-state-initial');
  const active = document.getElementById('kb-state-active');
  if (initial && active) {
    initial.classList.add('hidden');
    initial.classList.remove('flex');
    active.classList.remove('hidden');
    active.classList.add('flex');
  }
  showToast('Knowledgebase linked successfully');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  Object.keys(integrations).forEach(key => updateCardState(key));
  initCharts();
});
