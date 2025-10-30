// Sample Data
const appsData = [
  {
    id: 1,
    name: "Noice",
    category: "Social",
    icon: "💰",
    description: "Set tipping rules and reward creators for great content",
    users: 1247,
    trend: "rising",
    creator: "limone.eth",
    rating: 4.8,
    techStack: ["Base", "Farcaster", "Smart Contracts"]
  },
  {
    id: 2,
    name: "Farcade",
    category: "Gaming",
    icon: "🎮",
    description: "Play mini games and compete with friends for tokens",
    users: 3421,
    trend: "trending",
    creator: "farcade.eth",
    rating: 4.6,
    techStack: ["Base", "Farcaster", "NFTs"]
  },
  {
    id: 3,
    name: "Ponder",
    category: "Social",
    icon: "🤔",
    description: "Bet on poll outcomes and test your prediction skills",
    users: 892,
    trend: "rising",
    creator: "ponder.eth",
    rating: 4.3,
    techStack: ["Base", "Farcaster"]
  },
  {
    id: 4,
    name: "Clanker",
    category: "DeFi",
    icon: "🏭",
    description: "AI-powered token deployment in seconds",
    users: 5683,
    trend: "trending",
    creator: "clanker.eth",
    rating: 4.9,
    techStack: ["Base", "AI", "Smart Contracts"]
  },
  {
    id: 5,
    name: "Tab",
    category: "Tools",
    icon: "📊",
    description: "Track channel tokens and manage your portfolio",
    users: 2105,
    trend: "stable",
    creator: "tab.eth",
    rating: 4.5,
    techStack: ["Base", "Analytics"]
  },
  {
    id: 6,
    name: "GeoCaster",
    category: "Gaming",
    icon: "🗺️",
    description: "Geo-guessing game with NFT proofs on Arbitrum",
    users: 456,
    trend: "rising",
    creator: "hummusonrails",
    rating: 4.4,
    techStack: ["Base", "NFTs", "Geolocation"]
  }
];

const reviews = [
  {
    appId: 1,
    user: "jesse.base.eth",
    rating: 5,
    text: "@noiceapp just nailed their launch. This is the new playbook."
  },
  {
    appId: 2,
    user: "base-builder.eth",
    rating: 5,
    text: "Gaming on Base just got way more fun. Already spent 2 hours here."
  }
];

const badges = [
  {
    name: "Early Adopter",
    icon: "🌟",
    description: "Tried an app in its first week",
    rarity: "common"
  },
  {
    name: "Launch Supporter",
    icon: "🚀",
    description: "Joined 10+ app waitlists",
    rarity: "uncommon"
  },
  {
    name: "Viral Hit",
    icon: "🔥",
    description: "Your launch got 1000+ users in week 1",
    rarity: "rare"
  },
  {
    name: "App Hunter",
    icon: "🎯",
    description: "Discovered 50+ apps before they trended",
    rarity: "epic"
  }
];

// State
let currentView = 'discover';
let currentFilter = 'all';
let currentSort = 'trending';
let savedApps = [1, 2]; // IDs of saved apps
let userRole = null;
let selectedApp = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Check if user has visited before
  const hasVisited = checkFirstVisit();
  
  if (!hasVisited) {
    showOnboarding();
  } else {
    initApp();
  }
});

function checkFirstVisit() {
  // Simulate checking if user has visited
  // Since we can't use localStorage, we'll just return false for demo
  return false;
}

function showOnboarding() {
  const modal = document.getElementById('onboardingModal');
  modal.classList.add('active');

  // Role selection
  const roleBtns = document.querySelectorAll('.role-btn');
  roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      userRole = btn.dataset.role;
      document.getElementById('onboardingStep1').style.display = 'none';
      
      if (userRole === 'builder') {
        document.getElementById('onboardingStep2Builder').style.display = 'block';
      } else {
        document.getElementById('onboardingStep2Explorer').style.display = 'block';
      }
    });
  });

  // Category selection
  const categoryBtns = document.querySelectorAll('.category-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('multi-select')) {
        btn.classList.toggle('selected');
      } else {
        categoryBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      }
    });
  });

  // Start launch button
  document.getElementById('startLaunchBtn').addEventListener('click', () => {
    modal.classList.remove('active');
    initApp();
    switchView('launch');
    showToast('Welcome to BaseLaunch! Let\'s build your waitlist', 'success');
  });

  // Find apps button
  document.getElementById('findAppsBtn').addEventListener('click', () => {
    modal.classList.remove('active');
    initApp();
    showToast('Welcome to BaseLaunch! Discover amazing apps', 'success');
  });
}

function initApp() {
  setupNavigation();
  renderDiscoverView();
  setupLaunchView();
  setupAppDetailModal();
  updateCountdown();
  setInterval(updateCountdown, 60000); // Update countdown every minute
}

function setupNavigation() {
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const view = tab.dataset.view;
      switchView(view);
    });
  });
}

function switchView(viewName) {
  // Update nav tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.view === viewName);
  });

  // Update views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  
  const targetView = document.getElementById(`${viewName}View`);
  if (targetView) {
    targetView.classList.add('active');
  }

  currentView = viewName;

  // Render view-specific content
  if (viewName === 'trending') {
    renderTrendingView();
  } else if (viewName === 'myapps') {
    renderMyAppsView();
  }
}

function renderDiscoverView() {
  // Setup filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderAppGrid();
    });
  });

  // Setup sort
  const sortSelect = document.getElementById('sortSelect');
  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderAppGrid();
  });

  renderAppGrid();
}

function renderAppGrid() {
  const grid = document.getElementById('appGrid');
  let filteredApps = [...appsData];

  // Apply filter
  if (currentFilter !== 'all') {
    filteredApps = filteredApps.filter(app => app.category === currentFilter);
  }

  // Apply sort
  if (currentSort === 'users') {
    filteredApps.sort((a, b) => b.users - a.users);
  } else if (currentSort === 'new') {
    filteredApps.reverse();
  } else if (currentSort === 'rising') {
    filteredApps = filteredApps.filter(app => app.trend === 'rising');
  } else if (currentSort === 'trending') {
    filteredApps = filteredApps.filter(app => app.trend === 'trending' || app.trend === 'rising');
  }

  grid.innerHTML = filteredApps.map(app => createAppCard(app)).join('');

  // Add click handlers
  grid.querySelectorAll('.app-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.btn-icon')) {
        const appId = parseInt(card.dataset.appId);
        showAppDetail(appId);
      }
    });
  });

  // Add save button handlers
  grid.querySelectorAll('.save-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const appId = parseInt(btn.dataset.appId);
      toggleSaveApp(appId);
    });
  });
}

function createAppCard(app) {
  const isSaved = savedApps.includes(app.id);
  const trendBadge = app.trend === 'trending' ? 
    '<span class="trend-badge trending">🔥 Trending</span>' :
    app.trend === 'rising' ? 
    '<span class="trend-badge rising">⬆️ Rising</span>' : '';

  return `
    <div class="app-card" data-app-id="${app.id}">
      <div class="app-card-header">
        <div class="app-icon">${app.icon}</div>
        <div class="app-card-info">
          <div class="app-name">${app.name}</div>
          <div class="app-meta">
            <span class="category-badge">${app.category}</span>
            ${trendBadge}
          </div>
        </div>
      </div>
      <div class="app-description">${app.description}</div>
      <div class="app-stats">
        <span>${formatNumber(app.users)} users</span>
        <span class="rating">⭐ ${app.rating}</span>
      </div>
      <div class="app-actions">
        <button class="btn btn--primary btn--sm" onclick="window.open('#', '_blank')">Try App</button>
        <button class="btn-icon save-btn" data-app-id="${app.id}" title="${isSaved ? 'Saved' : 'Save'}">
          ${isSaved ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  `;
}

function toggleSaveApp(appId) {
  const index = savedApps.indexOf(appId);
  if (index > -1) {
    savedApps.splice(index, 1);
    showToast('Removed from saved apps', 'success');
  } else {
    savedApps.push(appId);
    showToast('Added to saved apps', 'success');
  }
  renderAppGrid();
}

function showAppDetail(appId) {
  const app = appsData.find(a => a.id === appId);
  if (!app) return;

  selectedApp = app;
  const modal = document.getElementById('appDetailModal');
  
  document.getElementById('detailIcon').textContent = app.icon;
  document.getElementById('detailName').textContent = app.name;
  document.getElementById('detailCategory').textContent = app.category;
  document.getElementById('detailCreator').textContent = `by ${app.creator}`;
  document.getElementById('detailUsers').textContent = `${formatNumber(app.users)} users`;
  document.getElementById('detailRating').textContent = `⭐ ${app.rating}`;
  document.getElementById('detailDescription').textContent = app.description;

  // Tech stack
  const techStack = document.getElementById('detailTechStack');
  techStack.innerHTML = app.techStack.map(tech => 
    `<span class="tech-badge">${tech}</span>`
  ).join('');

  // Reviews
  const appReviews = reviews.filter(r => r.appId === app.id);
  const reviewsList = document.getElementById('reviewsList');
  if (appReviews.length > 0) {
    reviewsList.innerHTML = appReviews.map(review => `
      <div class="review-item">
        <div class="review-header">
          <span class="review-author">${review.user}</span>
          <span class="rating">⭐ ${review.rating}</span>
        </div>
        <div class="review-text">${review.text}</div>
      </div>
    `).join('');
  } else {
    reviewsList.innerHTML = '<div class="empty-state">Be the first to review this app</div>';
  }

  modal.classList.add('active');
}

function setupAppDetailModal() {
  const modal = document.getElementById('appDetailModal');
  const closeBtn = document.getElementById('closeAppDetail');
  
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Tab switching
  const detailTabs = document.querySelectorAll('.detail-tab');
  detailTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      detailTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.detail-tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      const tabName = tab.dataset.tab;
      document.getElementById(`${tabName}Tab`).classList.add('active');
    });
  });

  // Action buttons
  document.getElementById('tryAppBtn').addEventListener('click', () => {
    window.open('#', '_blank');
  });

  document.getElementById('saveAppBtn').addEventListener('click', () => {
    if (selectedApp) {
      toggleSaveApp(selectedApp.id);
    }
  });

  document.getElementById('shareAppBtn').addEventListener('click', () => {
    showToast('Share link copied to clipboard!', 'success');
  });
}

function setupLaunchView() {
  // Checklist
  const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]:not([disabled])');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateChecklistProgress);
  });

  // Copy referral link
  document.getElementById('copyLinkBtn').addEventListener('click', () => {
    const input = document.getElementById('referralLink');
    input.select();
    showToast('Referral link copied!', 'success');
  });

  // Copy templates
  document.querySelectorAll('.copy-template').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Template copied to clipboard!', 'success');
    });
  });

  // Create chart
  createWaitlistChart();
}

function updateChecklistProgress() {
  const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
  const total = checkboxes.length;
  const percentage = (checked / total) * 100;

  document.getElementById('checklistProgress').style.width = `${percentage}%`;
  document.getElementById('checklistText').textContent = `${checked}/${total} completed`;
}

function createWaitlistChart() {
  const ctx = document.getElementById('waitlistChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Waitlist Signups',
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#0052FF',
        backgroundColor: 'rgba(0, 82, 255, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#A7A9A9'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#A7A9A9'
          }
        }
      }
    }
  });
}

function renderTrendingView() {
  const leaderboard = document.getElementById('trendingLeaderboard');
  const sortedApps = [...appsData].sort((a, b) => b.users - a.users);

  leaderboard.innerHTML = sortedApps.slice(0, 10).map((app, index) => {
    const rank = index + 1;
    const isTop = rank <= 3;
    const growth = Math.floor(Math.random() * 300) + 50;

    return `
      <div class="leaderboard-item" data-app-id="${app.id}">
        <div class="rank ${isTop ? 'top' : ''}">${rank}</div>
        <div class="app-icon">${app.icon}</div>
        <div class="leaderboard-info">
          <div class="app-name">${app.name}</div>
          <div class="leaderboard-stats">
            <span>${formatNumber(app.users)} users</span>
            <span class="growth-metric">+${growth} this week</span>
          </div>
        </div>
        <span class="category-badge">${app.category}</span>
      </div>
    `;
  }).join('');

  // Add click handlers
  leaderboard.querySelectorAll('.leaderboard-item').forEach(item => {
    item.addEventListener('click', () => {
      const appId = parseInt(item.dataset.appId);
      showAppDetail(appId);
    });
  });

  // Rising stars
  const risingStars = document.getElementById('risingStars');
  const risingApps = appsData.filter(app => app.trend === 'rising');
  risingStars.innerHTML = risingApps.map(app => `
    <div style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer;" 
         onclick="showAppDetail(${app.id})">
      <strong>${app.icon} ${app.name}</strong><br>
      <small style="color: var(--color-text-secondary);">${formatNumber(app.users)} users</small>
    </div>
  `).join('');

  // Hidden gems
  const hiddenGems = document.getElementById('hiddenGems');
  const gems = appsData.filter(app => app.users < 1000);
  hiddenGems.innerHTML = gems.map(app => `
    <div style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer;"
         onclick="showAppDetail(${app.id})">
      <strong>${app.icon} ${app.name}</strong><br>
      <small style="color: var(--color-text-secondary);">${formatNumber(app.users)} users · ${app.category}</small>
    </div>
  `).join('');
}

function renderMyAppsView() {
  // Saved apps
  const savedAppsList = document.getElementById('savedAppsList');
  const saved = appsData.filter(app => savedApps.includes(app.id));
  
  if (saved.length > 0) {
    savedAppsList.innerHTML = saved.map(app => `
      <div style="padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer;"
           onclick="showAppDetail(${app.id})">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="app-icon" style="width: 40px; height: 40px; font-size: 20px;">${app.icon}</div>
          <div style="flex: 1;">
            <strong>${app.name}</strong><br>
            <small style="color: var(--color-text-secondary);">${app.category} · ${formatNumber(app.users)} users</small>
          </div>
        </div>
      </div>
    `).join('');
  } else {
    savedAppsList.innerHTML = '<div class="empty-state">Start exploring to build your app stack</div>';
  }

  // Badges
  const badgesList = document.getElementById('badgesList');
  badgesList.innerHTML = badges.slice(0, 2).map(badge => `
    <div class="badge-card">
      <div class="badge-icon">${badge.icon}</div>
      <div class="badge-name">${badge.name}</div>
      <div class="badge-desc">${badge.description}</div>
      <div class="badge-rarity">${badge.rarity}</div>
    </div>
  `).join('');
}

function updateCountdown() {
  // Calculate time until next cohort (3 days from now for demo)
  const now = new Date();
  const target = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (22 * 60 * 1000));
  const diff = target - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const countdownEl = document.getElementById('cohortCountdown');
  if (countdownEl) {
    countdownEl.textContent = `${days}d ${hours}h ${minutes}m`;
  }
}

function formatNumber(num) {
  return num.toLocaleString();
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Make showAppDetail global for inline onclick handlers
window.showAppDetail = showAppDetail;