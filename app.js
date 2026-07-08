// State Management & Persistence Keys
const STORAGE_PREFIX = 'globaltech_acc_';

const appState = {
  theme: 'light',
  fontScale: 100,
  lineSpacing: 15,
  letterSpacing: 0,
  wordSpacing: 0,
  textAlign: 'inherit',
  dyslexiaActive: false,
  monospaceActive: false,
  colorblind: 'none',
  contrastFilter: 100,
  saturationFilter: 100,
  ttsActive: false,
  ttsVoice: '',
  ttsSpeed: 1.0,
  consoleActive: false,
  brailleActive: false,
  speechActive: false,
  focusRing: 'default',
  largeTargets: false,
  cursorActive: false,
  rulerActive: false,
  maskActive: false,
  focusFrame: false,
  motionActive: false,
  labelsActive: false,
  audioActive: false,
  language: 'en'
};

// Global Element Cache
let rootEl, bodyEl;
let splashScreen, splashLoaderProgress, splashStatus;
let sidebarToggle, sidebar, mainContent, breadcrumbCurrent;
let searchInput, searchResultsDropdown;
let notificationBtn, notificationPanel, notificationBadge;
let profileBtn, profileMenu;
let ttsVoiceSelect, ttsSpeedSlider;

// Table Sort State
let currentSortField = 'id';
let currentSortAscending = true;

// 1. Splash Screen Loader Simulation
function initSplashScreen(callback) {
  splashScreen = document.getElementById('splash-screen');
  splashLoaderProgress = document.getElementById('splash-loader-progress');
  splashStatus = document.getElementById('splash-status');
  
  if (!splashScreen) {
    callback();
    return;
  }

  const statuses = [
    { limit: 25, text: 'Initializing secure connection...' },
    { limit: 55, text: 'Loading UI design system tokens...' },
    { limit: 80, text: 'Syncing WCAG accessibility profile...' },
    { limit: 100, text: 'Establishing secure user workspace...' }
  ];

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      splashLoaderProgress.style.width = '100%';
      
      const matched = statuses.find(s => progress <= s.limit);
      if (matched) splashStatus.textContent = matched.text;

      setTimeout(() => {
        // Smoothly fade out loader
        splashScreen.classList.add('fade-out');
        setTimeout(() => {
          splashScreen.style.display = 'none';
          callback();
        }, 600);
      }, 300);
    } else {
      splashLoaderProgress.style.width = `${progress}%`;
      const matched = statuses.find(s => progress <= s.limit);
      if (matched) splashStatus.textContent = matched.text;
    }
  }, 55);
}

// 2. Settings Persistence Methods
function loadSavedSettings() {
  Object.keys(appState).forEach(key => {
    const val = localStorage.getItem(STORAGE_PREFIX + key);
    if (val !== null) {
      if (val === 'true') appState[key] = true;
      else if (val === 'false') appState[key] = false;
      else if (!isNaN(val) && val !== '') appState[key] = Number(val);
      else appState[key] = val;
    }
  });
}

function saveSetting(key, val) {
  appState[key] = val;
  localStorage.setItem(STORAGE_PREFIX + key, val);
}

// 2b. OS Shortcuts Adjustment & Localization Dictionary
function adjustOSShortcuts() {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modifierText = isMac ? 'Option' : 'Alt';
  document.querySelectorAll('.shortcut-modifier').forEach(el => {
    el.textContent = modifierText;
  });
}

const localizations = {
  en: {
    '.nav-item[data-target="dashboard-tab"] .nav-label': 'Dashboard',
    '.nav-item[data-target="hr-tab"] .nav-label': 'HR Portal',
    '.nav-item[data-target="learning-tab"] .nav-label': 'Learning & Dev',
    '.nav-item[data-target="support-tab"] .nav-label': 'Tech Support',
    '.nav-item[data-target="news-tab"] .nav-label': 'Company News',
    '.nav-item[data-target="directory-tab"] .nav-label': 'Directory',
    '.nav-item[data-target="kb-tab"] .nav-label': 'Knowledge Base',
    '.nav-item[data-target="help-tab"] .nav-label': 'Help Centre',
    '#accessibility-toolbar-btn .btn-text': 'Accessibility Hub',
    '#notification-btn .btn-text': 'Alerts',
    '.profile-role': 'Business Analyst',
    '.welcome-banner h1': 'Welcome back, Vishnu',
    '.welcome-banner p': 'You have 3 training courses pending and 1 active tech support ticket.',
    '.welcome-banner .primary-btn-overlay': 'Resume Training',
    '.welcome-banner .secondary-btn-overlay': 'Check Ticket Status',
    '.training-summary-card h2': 'Learning & Development',
    '.training-summary-card .card-desc': 'Track compliance training modules status.',
    '.support-summary-card h2': 'Technology Support Desk',
    '.support-summary-card .card-desc': 'Check active tickets resolution progress.',
    '.shortcuts-card h2': 'Quick Action Panel',
    '.shortcuts-card .card-desc': 'Access common self-service portal tasks.',
    '.shortcut-btn[data-target="hr-tab"][data-sub="leave"]': 'Request Leave',
    '.shortcut-btn[data-target="hr-tab"][data-sub="benefits"]': 'Benefits Sign Up',
    '.shortcut-btn[data-target="learning-tab"]': 'Start Training Course',
    '.shortcut-btn[data-target="support-tab"]': 'Open Tech Ticket',
    '#hr-subtab-leave': 'Time Off Request',
    '#hr-subtab-benefits': 'Health Benefits',
    '.allowances-card h3': 'Leave Balance Allowances',
    '.kb-accordion-card h3': 'Frequently Asked Questions'
  },
  es: {
    '.nav-item[data-target="dashboard-tab"] .nav-label': 'Panel de Control',
    '.nav-item[data-target="hr-tab"] .nav-label': 'Portal de RRHH',
    '.nav-item[data-target="learning-tab"] .nav-label': 'Capacitación',
    '.nav-item[data-target="support-tab"] .nav-label': 'Soporte Técnico',
    '.nav-item[data-target="news-tab"] .nav-label': 'Noticias',
    '.nav-item[data-target="directory-tab"] .nav-label': 'Directorio',
    '.nav-item[data-target="kb-tab"] .nav-label': 'Base de Conocimiento',
    '.nav-item[data-target="help-tab"] .nav-label': 'Centro de Ayuda',
    '#accessibility-toolbar-btn .btn-text': 'Centro de Accesibilidad',
    '#notification-btn .btn-text': 'Alertas',
    '.profile-role': 'Analista de Negocio',
    '.welcome-banner h1': 'Bienvenido de nuevo, Vishnu',
    '.welcome-banner p': 'Tienes 3 cursos de capacitación pendientes y 1 ticket de soporte activo.',
    '.welcome-banner .primary-btn-overlay': 'Reanudar Capacitación',
    '.welcome-banner .secondary-btn-overlay': 'Verificar Ticket',
    '.training-summary-card h2': 'Desarrollo y Aprendizaje',
    '.training-summary-card .card-desc': 'Seguimiento de módulos de cumplimiento.',
    '.support-summary-card h2': 'Mesa de Soporte Técnico',
    '.support-summary-card .card-desc': 'Verificar el progreso del soporte.',
    '.shortcuts-card h2': 'Panel de Acciones Rápidas',
    '.shortcuts-card .card-desc': 'Acceso rápido a las herramientas de la empresa.',
    '.shortcut-btn[data-target="hr-tab"][data-sub="leave"]': 'Solicitar Licencia',
    '.shortcut-btn[data-target="hr-tab"][data-sub="benefits"]': 'Inscripción de Beneficios',
    '.shortcut-btn[data-target="learning-tab"]': 'Iniciar Capacitación',
    '.shortcut-btn[data-target="support-tab"]': 'Abrir Soporte Técnico',
    '#hr-subtab-leave': 'Solicitud de Tiempo Libre',
    '#hr-subtab-benefits': 'Beneficios de Salud',
    '.allowances-card h3': 'Asignación de Días de Licencia',
    '.kb-accordion-card h3': 'Preguntas Frecuentes'
  },
  fr: {
    '.nav-item[data-target="dashboard-tab"] .nav-label': 'Tableau de Bord',
    '.nav-item[data-target="hr-tab"] .nav-label': 'Portail RH',
    '.nav-item[data-target="learning-tab"] .nav-label': 'Formation & Dev',
    '.nav-item[data-target="support-tab"] .nav-label': 'Support Tech',
    '.nav-item[data-target="news-tab"] .nav-label': 'Actualités',
    '.nav-item[data-target="directory-tab"] .nav-label': 'Annuaire',
    '.nav-item[data-target="kb-tab"] .nav-label': 'Base de Connaissances',
    '.nav-item[data-target="help-tab"] .nav-label': "Centre d'Aide",
    '#accessibility-toolbar-btn .btn-text': 'Espace Accessibilité',
    '#notification-btn .btn-text': 'Alertes',
    '.profile-role': 'Analyste d\u2019Affaires',
    '.welcome-banner h1': 'Bon retour, Vishnu',
    '.welcome-banner p': 'Vous avez 3 cours de formation en attente et 1 ticket de support actif.',
    '.welcome-banner .primary-btn-overlay': 'Reprendre la Formation',
    '.welcome-banner .secondary-btn-overlay': 'Vérifier le Statut',
    '.training-summary-card h2': 'Apprentissage et Développement',
    '.training-summary-card .card-desc': 'Suivi de la formation de conformité.',
    '.support-summary-card h2': 'Support Technique',
    '.support-summary-card .card-desc': 'Consulter la progression de vos tickets.',
    '.shortcuts-card h2': 'Actions Rapides',
    '.shortcuts-card .card-desc': 'Accéder rapidement aux services du portail.',
    '.shortcut-btn[data-target="hr-tab"][data-sub="leave"]': 'Demander un Congé',
    '.shortcut-btn[data-target="hr-tab"][data-sub="benefits"]': 'Avantages Inscription',
    '.shortcut-btn[data-target="learning-tab"]': 'Démarrer la Formation',
    '.shortcut-btn[data-target="support-tab"]': 'Créer un Ticket Support',
    '#hr-subtab-leave': 'Demande de Congés',
    '#hr-subtab-benefits': 'Prestations de Santé',
    '.allowances-card h3': 'Allocations de Congés',
    '.kb-accordion-card h3': 'Foire Aux Questions'
  },
  de: {
    '.nav-item[data-target="dashboard-tab"] .nav-label': 'Dashboard',
    '.nav-item[data-target="hr-tab"] .nav-label': 'HR Portal',
    '.nav-item[data-target="learning-tab"] .nav-label': 'Weiterbildung',
    '.nav-item[data-target="support-tab"] .nav-label': 'Technischer Support',
    '.nav-item[data-target="news-tab"] .nav-label': 'Firmennachrichten',
    '.nav-item[data-target="directory-tab"] .nav-label': 'Verzeichnis',
    '.nav-item[data-target="kb-tab"] .nav-label': 'Wissensdatenbank',
    '.nav-item[data-target="help-tab"] .nav-label': 'Hilfezentrum',
    '#accessibility-toolbar-btn .btn-text': 'Barrierefreiheit-Hub',
    '#notification-btn .btn-text': 'Benachrichtigungen',
    '.profile-role': 'Business Analyst',
    '.welcome-banner h1': 'Willkommen zurück, Vishnu',
    '.welcome-banner p': 'Sie haben 3 ausstehende Schulungskurse und 1 aktives Support-Ticket.',
    '.welcome-banner .primary-btn-overlay': 'Schulung Fortsetzen',
    '.welcome-banner .secondary-btn-overlay': 'Ticket-Status Prüfen',
    '.training-summary-card h2': 'Aus- und Weiterbildung',
    '.training-summary-card .card-desc': 'Status der Compliance-Schulung prüfen.',
    '.support-summary-card h2': 'Technischer Support Desk',
    '.support-summary-card .card-desc': 'Lösungsfortschritt aktiver Tickets prüfen.',
    '.shortcuts-card h2': 'Schnellaktionen',
    '.shortcuts-card .card-desc': 'Zugriff auf Self-Service-Aufgaben.',
    '.shortcut-btn[data-target="hr-tab"][data-sub="leave"]': 'Urlaub Beantragen',
    '.shortcut-btn[data-target="hr-tab"][data-sub="benefits"]': 'Leistungsanmeldung',
    '.shortcut-btn[data-target="learning-tab"]': 'Schulung Starten',
    '.shortcut-btn[data-target="support-tab"]': 'Support-Ticket Öffnen',
    '#hr-subtab-leave': 'Urlaubsantrag',
    '#hr-subtab-benefits': 'Gesundheitsleistungen',
    '.allowances-card h3': 'Urlaubssaldo-Zuweisungen',
    '.kb-accordion-card h3': 'Häufig gestellte Fragen'
  },
  it: {
    '.nav-item[data-target="dashboard-tab"] .nav-label': 'Dashboard',
    '.nav-item[data-target="hr-tab"] .nav-label': 'Portale Risorse Umane',
    '.nav-item[data-target="learning-tab"] .nav-label': 'Formazione e Sviluppo',
    '.nav-item[data-target="support-tab"] .nav-label': 'Supporto Tecnico',
    '.nav-item[data-target="news-tab"] .nav-label': 'Notizie Aziendali',
    '.nav-item[data-target="directory-tab"] .nav-label': 'Elenco Dipendenti',
    '.nav-item[data-target="kb-tab"] .nav-label': 'Archivio Conoscenze',
    '.nav-item[data-target="help-tab"] .nav-label': 'Centro Assistenza',
    '#accessibility-toolbar-btn .btn-text': 'Centro Accessibilità',
    '#notification-btn .btn-text': 'Avvisi',
    '.profile-role': 'Analista di Business',
    '.welcome-banner h1': 'Bentornato, Vishnu',
    '.welcome-banner p': 'Hai 3 corsi di formazione in sospeso e 1 ticket di supporto attivo.',
    '.welcome-banner .primary-btn-overlay': 'Riprendi Formazione',
    '.welcome-banner .secondary-btn-overlay': 'Stato del Ticket',
    '.training-summary-card h2': 'Formazione e Sviluppo',
    '.training-summary-card .card-desc': 'Monitora lo stato dei corsi di conformità.',
    '.support-summary-card h2': 'Supporto Tecnico',
    '.support-summary-card .card-desc': 'Controlla il progresso dei ticket attivi.',
    '.shortcuts-card h2': 'Azioni Rapide',
    '.shortcuts-card .card-desc': 'Accedi ai servizi comuni dipendenti.',
    '.shortcut-btn[data-target="hr-tab"][data-sub="leave"]': 'Richiedi Congedo',
    '.shortcut-btn[data-target="hr-tab"][data-sub="benefits"]': 'Iscrizione Agevolazioni',
    '.shortcut-btn[data-target="learning-tab"]': 'Avvia Corso',
    '.shortcut-btn[data-target="support-tab"]': 'Apri Ticket',
    '#hr-subtab-leave': 'Richiesta Congedo',
    '#hr-subtab-benefits': 'Agevolazioni Sanitarie',
    '.allowances-card h3': 'Saldo Congedi Rimanenti',
    '.kb-accordion-card h3': 'Domande Frequenti'
  },
  pt: {
    '.nav-item[data-target="dashboard-tab"] .nav-label': 'Painel',
    '.nav-item[data-target="hr-tab"] .nav-label': 'Portal de RH',
    '.nav-item[data-target="learning-tab"] .nav-label': 'Treinamento e Des.',
    '.nav-item[data-target="support-tab"] .nav-label': 'Suporte Técnico',
    '.nav-item[data-target="news-tab"] .nav-label': 'Notícias',
    '.nav-item[data-target="directory-tab"] .nav-label': 'Diretório',
    '.nav-item[data-target="kb-tab"] .nav-label': 'Base de Conhecimento',
    '.nav-item[data-target="help-tab"] .nav-label': 'Centro de Ajuda',
    '#accessibility-toolbar-btn .btn-text': 'Painel de Acessibilidade',
    '#notification-btn .btn-text': 'Alertas',
    '.profile-role': 'Analista de Negócios',
    '.welcome-banner h1': 'Bem-vindo de volta, Vishnu',
    '.welcome-banner p': 'Você tem 3 treinamentos pendentes e 1 ticket de suporte ativo.',
    '.welcome-banner .primary-btn-overlay': 'Retomar Treinamento',
    '.welcome-banner .secondary-btn-overlay': 'Verificar Ticket',
    '.training-summary-card h2': 'Treinamento e Desenvolvimento',
    '.training-summary-card .card-desc': 'Acompanhe o progresso de seus cursos.',
    '.support-summary-card h2': 'Mesa de Suporte Técnico',
    '.support-summary-card .card-desc': 'Verificar a resolução de tickets ativos.',
    '.shortcuts-card h2': 'Painel de Ações Rápidas',
    '.shortcuts-card .card-desc': 'Acesso rápido aos serviços da empresa.',
    '.shortcut-btn[data-target="hr-tab"][data-sub="leave"]': 'Solicitar Licencia',
    '.shortcut-btn[data-target="hr-tab"][data-sub="benefits"]': 'Inscrição de Benefícios',
    '.shortcut-btn[data-target="learning-tab"]': 'Iniciar Treinamento',
    '.shortcut-btn[data-target="support-tab"]': 'Abrir Chamado',
    '#hr-subtab-leave': 'Solicitação de Ausência',
    '#hr-subtab-benefits': 'Benefícios de Saúde',
    '.allowances-card h3': 'Saldo de Licenças',
    '.kb-accordion-card h3': 'Perguntas Frequentes'
  },
  ja: {
    '.nav-item[data-target="dashboard-tab"] .nav-label': 'ダッシュボード',
    '.nav-item[data-target="hr-tab"] .nav-label': '人事ポータル',
    '.nav-item[data-target="learning-tab"] .nav-label': '研修・開発',
    '.nav-item[data-target="support-tab"] .nav-label': '技術サポート',
    '.nav-item[data-target="news-tab"] .nav-label': '社内ニュース',
    '.nav-item[data-target="directory-tab"] .nav-label': '社員名簿',
    '.nav-item[data-target="kb-tab"] .nav-label': 'ナレッジベース',
    '.nav-item[data-target="help-tab"] .nav-label': 'ヘルプセンター',
    '#accessibility-toolbar-btn .btn-text': 'アクセシビリティハブ',
    '#notification-btn .btn-text': '通知',
    '.profile-role': 'ビジネスアナリスト',
    '.welcome-banner h1': 'おかえりなさい、Vishnu',
    '.welcome-banner p': '未完了の研修が3件、進行中のサポートチケットが1件あります。',
    '.welcome-banner .primary-btn-overlay': '研修を再開する',
    '.welcome-banner .secondary-btn-overlay': 'チケット状況を確認',
    '.training-summary-card h2': '学習と開発',
    '.training-summary-card .card-desc': 'コンプライアンス研修の進捗を確認します。',
    '.support-summary-card h2': 'ヘルプデスク',
    '.support-summary-card .card-desc': 'チケットの解決状況を確認します。',
    '.shortcuts-card h2': 'クイックアクション',
    '.shortcuts-card .card-desc': 'セルフサービスポータルにアクセスします。',
    '.shortcut-btn[data-target="hr-tab"][data-sub="leave"]': '休暇を申請する',
    '.shortcut-btn[data-target="hr-tab"][data-sub="benefits"]': '福利厚生の登録',
    '.shortcut-btn[data-target="learning-tab"]': '研修を開始する',
    '.shortcut-btn[data-target="support-tab"]': 'チケットを開く',
    '#hr-subtab-leave': '休暇申請',
    '#hr-subtab-benefits': '医療保険・福利厚生',
    '.allowances-card h3': '休暇残日数一覧',
    '.kb-accordion-card h3': 'よくあるご質問'
  },
  zh: {
    '.nav-item[data-target="dashboard-tab"] .nav-label': '仪表板',
    '.nav-item[data-target="hr-tab"] .nav-label': '人力资源门户',
    '.nav-item[data-target="learning-tab"] .nav-label': '学习与发展',
    '.nav-item[data-target="support-tab"] .nav-label': '技术支持',
    '.nav-item[data-target="news-tab"] .nav-label': '公司新闻',
    '.nav-item[data-target="directory-tab"] .nav-label': '员工名册',
    '.nav-item[data-target="kb-tab"] .nav-label': '知识库',
    '.nav-item[data-target="help-tab"] .nav-label': '帮助中心',
    '#accessibility-toolbar-btn .btn-text': '无障碍中心',
    '#notification-btn .btn-text': '通知',
    '.profile-role': '业务分析师',
    '.welcome-banner h1': '欢迎回来，Vishnu',
    '.welcome-banner p': '您有3个待处理的培训课程和1个活动技术支持工单。',
    '.welcome-banner .primary-btn-overlay': '继续培训',
    '.welcome-banner .secondary-btn-overlay': '工单状态',
    '.training-summary-card h2': '学习与发展课程',
    '.training-summary-card .card-desc': '合规性培训模块状态跟踪。',
    '.support-summary-card h2': '技术支持服务台',
    '.support-summary-card .card-desc': '检查活动技术工单的解决进度。',
    '.shortcuts-card h2': '快速操作面板',
    '.shortcuts-card .card-desc': '访问自服务门户任务。',
    '.shortcut-btn[data-target="hr-tab"][data-sub="leave"]': '请假申请',
    '.shortcut-btn[data-target="hr-tab"][data-sub="benefits"]': '福利注册',
    '.shortcut-btn[data-target="learning-tab"]': '开始课程',
    '.shortcut-btn[data-target="support-tab"]': '新建工单',
    '#hr-subtab-leave': '休假申请',
    '#hr-subtab-benefits': '健康福利',
    '.allowances-card h3': '剩余休假额度',
    '.kb-accordion-card h3': '常见问题解答'
  },
  hi: {
    '.nav-item[data-target="dashboard-tab"] .nav-label': 'डैशबोर्ड',
    '.nav-item[data-target="hr-tab"] .nav-label': 'एचआर पोर्टल',
    '.nav-item[data-target="learning-tab"] .nav-label': 'सीखना और विकास',
    '.nav-item[data-target="support-tab"] .nav-label': 'तकनीकी सहायता',
    '.nav-item[data-target="news-tab"] .nav-label': 'कंपनी समाचार',
    '.nav-item[data-target="directory-tab"] .nav-label': 'निर्देशिका',
    '.nav-item[data-target="kb-tab"] .nav-label': 'ज्ञानकोष',
    '.nav-item[data-target="help-tab"] .nav-label': 'सहायता केंद्र',
    '#accessibility-toolbar-btn .btn-text': 'सुलभता केंद्र',
    '#notification-btn .btn-text': 'अलर्ट',
    '.profile-role': 'बिज़नेस एनालिस्ट',
    '.welcome-banner h1': 'स्वागत है, Vishnu',
    '.welcome-banner p': 'आपके पास 3 लंबित प्रशिक्षण पाठ्यक्रम और 1 सक्रिय टिकट है।',
    '.welcome-banner .primary-btn-overlay': 'प्रशिक्षण फिर से शुरू करें',
    '.welcome-banner .secondary-btn-overlay': 'टिकट स्थिति',
    '.training-summary-card h2': 'सीखना और विकास',
    '.training-summary-card .card-desc': 'अनुपालन प्रशिक्षण पाठ्यक्रमों की स्थिति।',
    '.support-summary-card h2': 'तकनीकी सहायता डेस्क',
    '.support-summary-card .card-desc': 'सक्रिय टिकट समाधान प्रगति।',
    '.shortcuts-card h2': 'त्वरित कार्रवाई पैनल',
    '.shortcuts-card .card-desc': 'सामान्य स्वयं-सेवा पोर्टल कार्य।',
    '.shortcut-btn[data-target="hr-tab"][data-sub="leave"]': 'छुट्टी का अनुरोध',
    '.shortcut-btn[data-target="hr-tab"][data-sub="benefits"]': 'स्वास्थ्य लाभ पंजीकरण',
    '.shortcut-btn[data-target="learning-tab"]': 'प्रशिक्षण शुरू करें',
    '.shortcut-btn[data-target="support-tab"]': 'सपोर्ट टिकट खोलें',
    '#hr-subtab-leave': 'छुट्टी का अनुरोध',
    '#hr-subtab-benefits': 'स्वास्थ्य लाभ',
    '.allowances-card h3': 'बची हुई छुट्टियां',
    '.kb-accordion-card h3': 'अक्सर पूछे जाने वाले प्रश्न'
  }
};

function applyTranslation(lang) {
  const dictionary = localizations[lang];
  if (!dictionary) return;

  Object.keys(dictionary).forEach(selector => {
    const els = document.querySelectorAll(selector);
    els.forEach(el => {
      const svg = el.querySelector('svg');
      if (svg) {
        const textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
        if (textNode) {
          textNode.textContent = ' ' + dictionary[selector];
        } else {
          el.appendChild(document.createTextNode(' ' + dictionary[selector]));
        }
      } else {
        el.textContent = dictionary[selector];
      }
    });
  });
}

// 3. Accessibility Hub Application Functions
function applyAccessibilitySettings() {
  // Theme Presets
  rootEl.setAttribute('data-theme', appState.theme);
  const themeRadio = document.querySelector(`input[name="app-theme"][value="${appState.theme}"]`);
  if (themeRadio) themeRadio.checked = true;

  // Text Scaling
  rootEl.style.setProperty('--font-scale', appState.fontScale / 100);
  const sizeSlider = document.getElementById('font-size-slider');
  if (sizeSlider) sizeSlider.value = appState.fontScale;
  const sizeText = document.getElementById('font-size-value');
  if (sizeText) sizeText.textContent = `${appState.fontScale}%`;

  // Paragraph Spacing
  rootEl.style.setProperty('--custom-line-height', appState.lineSpacing / 10);
  const lineSlider = document.getElementById('line-spacing-slider');
  if (lineSlider) lineSlider.value = appState.lineSpacing;
  const lineText = document.getElementById('line-spacing-value');
  if (lineText) lineText.textContent = `${(appState.lineSpacing / 10).toFixed(1)}x`;

  // Letter Spacing
  rootEl.style.setProperty('--custom-letter-spacing', appState.letterSpacing === 0 ? 'normal' : `${appState.letterSpacing / 100}em`);
  const letterSlider = document.getElementById('letter-spacing-slider');
  if (letterSlider) letterSlider.value = appState.letterSpacing;
  const letterText = document.getElementById('letter-spacing-value');
  if (letterText) letterText.textContent = appState.letterSpacing === 0 ? 'Normal' : `+${appState.letterSpacing}%`;

  // Word Spacing
  rootEl.style.setProperty('--custom-word-spacing', appState.wordSpacing === 0 ? 'normal' : `${appState.wordSpacing / 100}em`);
  const wordSlider = document.getElementById('word-spacing-slider');
  if (wordSlider) wordSlider.value = appState.wordSpacing;
  const wordText = document.getElementById('word-spacing-value');
  if (wordText) wordText.textContent = appState.wordSpacing === 0 ? 'Normal' : `+${appState.wordSpacing}%`;

  // Alignment
  const alignSelect = document.getElementById('text-align-select');
  if (alignSelect) alignSelect.value = appState.textAlign;
  const textElements = document.querySelectorAll('p, li, td, th');
  textElements.forEach(el => el.style.textAlign = appState.textAlign === 'inherit' ? '' : appState.textAlign);

  // Dyslexia & Monospace Fonts
  rootEl.setAttribute('data-dyslexia', appState.dyslexiaActive ? 'true' : 'false');
  const dyslexiaToggle = document.getElementById('dyslexia-font-toggle');
  if (dyslexiaToggle) dyslexiaToggle.checked = appState.dyslexiaActive;

  rootEl.setAttribute('data-monospace', appState.monospaceActive ? 'true' : 'false');
  const monospaceToggle = document.getElementById('monospace-toggle');
  if (monospaceToggle) monospaceToggle.checked = appState.monospaceActive;

  // Colorblind Shaders
  rootEl.setAttribute('data-colorblind', appState.colorblind);
  const colorblindSelect = document.getElementById('colorblind-select');
  if (colorblindSelect) colorblindSelect.value = appState.colorblind;

  // Saturation & Contrast
  rootEl.setAttribute('data-filter-custom', (appState.contrastFilter !== 100 || appState.saturationFilter !== 100) ? 'true' : 'false');
  rootEl.style.setProperty('--custom-contrast-filter', `contrast(${appState.contrastFilter}%)`);
  rootEl.style.setProperty('--custom-saturation-filter', `saturate(${appState.saturationFilter}%)`);
  
  const contrastSlider = document.getElementById('contrast-filter-slider');
  if (contrastSlider) contrastSlider.value = appState.contrastFilter;
  const contrastText = document.getElementById('contrast-filter-value');
  if (contrastText) contrastText.textContent = `${appState.contrastFilter}%`;

  const saturationSlider = document.getElementById('saturation-filter-slider');
  if (saturationSlider) saturationSlider.value = appState.saturationFilter;
  const saturationText = document.getElementById('saturation-filter-value');
  if (saturationText) saturationText.textContent = `${appState.saturationFilter}%`;

  // Screen Reader Console Overlay
  const srConsole = document.getElementById('screen-reader-console');
  if (srConsole) {
    if (appState.consoleActive) srConsole.classList.remove('hidden');
    else srConsole.classList.add('hidden');
  }
  const consoleToggle = document.getElementById('sr-console-toggle');
  if (consoleToggle) consoleToggle.checked = appState.consoleActive;

  // Tactile Braille Overlay
  const brailleConsole = document.getElementById('braille-console');
  if (brailleConsole) {
    if (appState.brailleActive) brailleConsole.classList.remove('hidden');
    else brailleConsole.classList.add('hidden');
  }
  const brailleToggle = document.getElementById('braille-simulator-toggle');
  if (brailleToggle) brailleToggle.checked = appState.brailleActive;

  // Screen Reader / TTS Toggle
  const ttsToggle = document.getElementById('tts-reader-toggle');
  if (ttsToggle) ttsToggle.checked = appState.ttsActive;
  const ttsGroup = document.getElementById('tts-voice-group');
  if (ttsGroup) ttsGroup.style.display = appState.ttsActive ? 'block' : 'none';

  // Load Vocal Rate Speed Value
  const speedSlider = document.getElementById('tts-speed-slider');
  if (speedSlider) speedSlider.value = appState.ttsSpeed;
  const speedText = document.getElementById('tts-speed-value');
  if (speedText) speedText.textContent = `${appState.ttsSpeed.toFixed(2)}x`;

  // Voice Command Mode
  const speechToggle = document.getElementById('speech-command-toggle');
  if (speechToggle) speechToggle.checked = appState.speechActive;
  const hintsBox = document.getElementById('speech-hints-box');
  if (hintsBox) hintsBox.style.display = appState.speechActive ? 'block' : 'none';
  updateSpeechHintsBox();
  if (appState.speechActive) {
    startVoiceCommandEngine();
  } else {
    stopVoiceCommandEngine();
  }

  // Keyboard Focus Rings
  rootEl.setAttribute('data-focus-ring', appState.focusRing);
  const ringSelect = document.getElementById('focus-ring-select');
  if (ringSelect) ringSelect.value = appState.focusRing;

  // Click Target Expansion
  rootEl.setAttribute('data-large-targets', appState.largeTargets ? 'true' : 'false');
  const targetsToggle = document.getElementById('large-targets-toggle');
  if (targetsToggle) targetsToggle.checked = appState.largeTargets;

  // Large Pointer Cursor
  rootEl.setAttribute('data-cursor', appState.cursorActive ? 'large' : 'default');
  const cursorToggle = document.getElementById('large-cursor-toggle');
  if (cursorToggle) cursorToggle.checked = appState.cursorActive;

  // Reading Ruler Overlay
  rootEl.setAttribute('data-ruler', appState.rulerActive ? 'true' : 'false');
  const rulerToggle = document.getElementById('reading-ruler-toggle');
  if (rulerToggle) rulerToggle.checked = appState.rulerActive;

  // Reading Mask Overlay
  rootEl.setAttribute('data-mask', appState.maskActive ? 'true' : 'false');
  const maskToggle = document.getElementById('reading-mask-toggle');
  if (maskToggle) maskToggle.checked = appState.maskActive;
  if (!appState.maskActive) {
    const maskTop = document.getElementById('reading-mask-top');
    const maskBottom = document.getElementById('reading-mask-bottom');
    if (maskTop) maskTop.style.height = '0px';
    if (maskBottom) maskBottom.style.height = '100%';
  }

  // ADHD Focus Frame Mode
  rootEl.setAttribute('data-focus-frame', appState.focusFrame ? 'true' : 'false');
  const focusFrameToggle = document.getElementById('focus-frame-toggle');
  if (focusFrameToggle) focusFrameToggle.checked = appState.focusFrame;
  const frameOverlay = document.getElementById('focus-frame-overlay');
  if (frameOverlay) {
    if (appState.focusFrame) {
      frameOverlay.style.clipPath = 'inset(100%)';
      frameOverlay.classList.remove('hidden');
      setTimeout(() => updateFocusFrame(document.activeElement), 50);
    } else {
      frameOverlay.classList.add('hidden');
      frameOverlay.style.clipPath = 'inset(100%)';
    }
  }

  // Reduced Motion (Freeze animations)
  rootEl.setAttribute('data-motion', appState.motionActive ? 'reduced' : 'normal');
  const motionToggle = document.getElementById('reduced-motion-toggle');
  if (motionToggle) motionToggle.checked = appState.motionActive;

  // Forced Button Text Labels
  rootEl.setAttribute('data-show-labels', appState.labelsActive ? 'true' : 'false');
  const labelsToggle = document.getElementById('icon-labels-toggle');
  if (labelsToggle) labelsToggle.checked = appState.labelsActive;

  // Sound Visual Toast Alerts
  const audioToggle = document.getElementById('audio-cue-toggle');
  if (audioToggle) audioToggle.checked = appState.audioActive;

  // Language Selection
  const langSelect = document.getElementById('language-select');
  if (langSelect) langSelect.value = appState.language;
  applyTranslation(appState.language);
}

// 4. TTS Vocalizer Speech Engine
function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  ttsVoiceSelect = document.getElementById('tts-voice-select');
  if (!ttsVoiceSelect) return;

  // Set default voice if empty
  if (!appState.ttsVoice && voices.length > 0) {
    const englishVoice = voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) {
      appState.ttsVoice = englishVoice.name;
      saveSetting('ttsVoice', englishVoice.name);
    } else {
      appState.ttsVoice = voices[0].name;
      saveSetting('ttsVoice', voices[0].name);
    }
  }

  ttsVoiceSelect.innerHTML = '';
  voices.forEach(voice => {
    const option = document.createElement('option');
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    if (voice.name === appState.ttsVoice) option.selected = true;
    ttsVoiceSelect.appendChild(option);
  });

  // Voices load asynchronously, so the hint text (and any live recognizer)
  // are refreshed once the real voice list — and its languages — are known
  updateSpeechHintsBox();
  if (appState.speechActive && speechRecognitionEngine) {
    stopVoiceCommandEngine();
    startVoiceCommandEngine();
  }
}

let ttsSpeakTimer = null;

function announceTextReader(text, urgent = false) {
  if (!appState.ttsActive || !('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;

  clearTimeout(ttsSpeakTimer);
  synth.cancel(); // Stop any announcement currently in progress

  // Chromium has a long-standing bug where speak() queued in the same tick
  // as cancel() is silently dropped — a short delay lets the cancel finish
  // before the next utterance is queued, otherwise the reader can go
  // completely silent whenever focus/hover events fire in quick succession
  ttsSpeakTimer = setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const selectedVoice = voices.find(v => v.name === appState.ttsVoice);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }
    utterance.rate = appState.ttsSpeed;

    if (synth.paused) synth.resume();
    synth.speak(utterance);
  }, 60);
}

// ARIA Log updates
function logToAriaConsole(text) {
  const textEl = document.getElementById('sr-console-text');
  if (textEl) {
    textEl.textContent = text;
  }
}

// Toast notifications — accessible, non-blocking replacement for alert()
const TOAST_ICONS = {
  success: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
  info: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>',
  error: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" x2="12" y1="9" y2="13"></line><line x1="12" x2="12.01" y1="17" y2="17"></line></svg>'
};

function showToast(message, type = 'info', duration = 5000) {
  // Sound Visual Equivalents: flash a visible banner in place of the chime
  if (appState.audioActive) {
    const flashEl = document.getElementById('visual-audio-alert');
    if (flashEl) {
      flashEl.textContent = 'Notification chime played';
      flashEl.classList.remove('hidden');
      setTimeout(() => flashEl.classList.add('hidden'), 2500);
    }
  }

  const stack = document.getElementById('toast-stack');
  if (!stack) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<span class="toast-icon" aria-hidden="true">${TOAST_ICONS[type] || TOAST_ICONS.info}</span><div>${message}</div>`;
  stack.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('leaving');
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

// Accessible modal dialog (focus is trapped and restored on close)
let lastFocusedBeforeModal = null;

function closeModal() {
  const overlay = document.getElementById('app-modal');
  if (overlay) overlay.remove();
  if (lastFocusedBeforeModal) {
    lastFocusedBeforeModal.focus();
    lastFocusedBeforeModal = null;
  }
}

function openModal({ title, metaHtml = '', bodyHtml = '' }) {
  closeModal();
  lastFocusedBeforeModal = document.activeElement;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'app-modal';
  overlay.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="app-modal-title">
      <div class="modal-header">
        <h2 id="app-modal-title"></h2>
        <button type="button" class="icon-btn modal-close-btn" aria-label="Close dialog">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="modal-meta">${metaHtml}</div>
        ${bodyHtml}
      </div>
      <div class="modal-footer">
        <button type="button" class="secondary-btn btn-sm modal-close-btn">Close</button>
      </div>
    </div>`;
  overlay.querySelector('#app-modal-title').textContent = title;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      closeModal();
    } else if (e.key === 'Tab') {
      const focusables = overlay.querySelectorAll('button, a[href]');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  overlay.querySelectorAll('.modal-close-btn').forEach(btn => btn.addEventListener('click', closeModal));

  document.body.appendChild(overlay);
  overlay.querySelector('.modal-header .modal-close-btn').focus();
}

// Braille dynamic mapping translation
const brailleMap = {
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
  'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
  'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵', '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉',
  '4': '⠼⠙', '5': '⠼⠑', '6': '⠼⠋', '7': '⠼⠛', '8': '⠼⠓', '9': '⠼⠊', '0': '⠼⠚', ' ': ' ',
  '.': '⠲', ',': '⠂', ';': '⠆', ':': '⠒', '!': '⠖', '?': '⠦', '-': '⠤', '(': '⠦', ')': '⠴'
};

function translateToBraille(text) {
  const lower = text.toLowerCase();
  let braille = '';
  for (let char of lower) {
    braille += brailleMap[char] || '⠐'; // Unknown characters default to dot
  }
  const brailleTextEl = document.getElementById('braille-console-text');
  if (brailleTextEl) {
    brailleTextEl.textContent = braille;
  }
}

// 5. Motor Speech Recognition command routing
// Command keywords per language so voice control works no matter which TTS
// voice profile (and therefore language/accent) the user has selected —
// the recognizer's listening language and the matched keywords both follow
// the currently selected voice, instead of being hardcoded to English.
const VOICE_TAB_ORDER = ['dashboard-tab', 'hr-tab', 'learning-tab', 'support-tab', 'news-tab', 'directory-tab', 'kb-tab', 'help-tab', 'profile-tab'];

const VOICE_COMMAND_KEYWORDS = {
  en: { 'dashboard-tab': ['dashboard', 'home'], 'hr-tab': ['hr', 'leave', 'benefits'], 'learning-tab': ['learning', 'training', 'course'], 'support-tab': ['support', 'ticket'], 'news-tab': ['news', 'announcement'], 'directory-tab': ['directory', 'employee'], 'kb-tab': ['knowledge', 'faq', 'kb'], 'help-tab': ['help'], 'profile-tab': ['profile', 'me'] },
  es: { 'dashboard-tab': ['panel', 'inicio'], 'hr-tab': ['rrhh', 'recursos humanos', 'licencia', 'beneficios'], 'learning-tab': ['capacitación', 'formación', 'curso'], 'support-tab': ['soporte', 'ticket'], 'news-tab': ['noticias', 'anuncio'], 'directory-tab': ['directorio', 'empleado'], 'kb-tab': ['conocimiento', 'preguntas frecuentes'], 'help-tab': ['ayuda'], 'profile-tab': ['perfil'] },
  fr: { 'dashboard-tab': ['tableau de bord', 'accueil'], 'hr-tab': ['rh', 'ressources humaines', 'congé', 'avantages'], 'learning-tab': ['formation', 'cours'], 'support-tab': ['support', 'ticket'], 'news-tab': ['actualités', 'annonce'], 'directory-tab': ['annuaire', 'employé'], 'kb-tab': ['connaissances', 'faq'], 'help-tab': ['aide'], 'profile-tab': ['profil'] },
  de: { 'dashboard-tab': ['dashboard', 'start'], 'hr-tab': ['hr', 'personalabteilung', 'urlaub', 'leistungen'], 'learning-tab': ['schulung', 'weiterbildung', 'kurs'], 'support-tab': ['support', 'ticket'], 'news-tab': ['nachrichten', 'ankündigung'], 'directory-tab': ['verzeichnis', 'mitarbeiter'], 'kb-tab': ['wissensdatenbank', 'faq'], 'help-tab': ['hilfe'], 'profile-tab': ['profil'] },
  it: { 'dashboard-tab': ['dashboard', 'home'], 'hr-tab': ['risorse umane', 'congedo', 'agevolazioni'], 'learning-tab': ['formazione', 'corso'], 'support-tab': ['supporto', 'ticket'], 'news-tab': ['notizie', 'annuncio'], 'directory-tab': ['elenco', 'dipendente'], 'kb-tab': ['conoscenza', 'domande frequenti'], 'help-tab': ['aiuto'], 'profile-tab': ['profilo'] },
  pt: { 'dashboard-tab': ['painel', 'início'], 'hr-tab': ['rh', 'recursos humanos', 'licença', 'benefícios'], 'learning-tab': ['treinamento', 'curso'], 'support-tab': ['suporte', 'chamado'], 'news-tab': ['notícias', 'anúncio'], 'directory-tab': ['diretório', 'funcionário'], 'kb-tab': ['conhecimento', 'perguntas frequentes'], 'help-tab': ['ajuda'], 'profile-tab': ['perfil'] },
  ja: { 'dashboard-tab': ['ダッシュボード'], 'hr-tab': ['人事', '休暇', '福利厚生'], 'learning-tab': ['研修', 'トレーニング'], 'support-tab': ['サポート', 'チケット'], 'news-tab': ['ニュース', 'お知らせ'], 'directory-tab': ['名簿', '社員'], 'kb-tab': ['ナレッジ', 'よくある質問'], 'help-tab': ['ヘルプ'], 'profile-tab': ['プロフィール'] },
  zh: { 'dashboard-tab': ['仪表板', '主页'], 'hr-tab': ['人事', '请假', '福利'], 'learning-tab': ['培训', '课程'], 'support-tab': ['支持', '工单'], 'news-tab': ['新闻', '公告'], 'directory-tab': ['名册', '员工'], 'kb-tab': ['知识库', '常见问题'], 'help-tab': ['帮助'], 'profile-tab': ['个人资料'] },
  hi: { 'dashboard-tab': ['डैशबोर्ड', 'होम'], 'hr-tab': ['एचआर', 'छुट्टी', 'लाभ'], 'learning-tab': ['प्रशिक्षण', 'सीखना'], 'support-tab': ['सहायता', 'टिकट'], 'news-tab': ['समाचार', 'सूचना'], 'directory-tab': ['निर्देशिका', 'कर्मचारी'], 'kb-tab': ['ज्ञान', 'सवाल'], 'help-tab': ['मदद'], 'profile-tab': ['प्रोफ़ाइल'] }
};

// Resolves the BCP-47 recognition tag and command-keyword language from
// whichever voice is currently selected in the TTS "System Voice Profile"
// dropdown, so both speech input and speech output agree on a language.
function getActiveRecognitionLang() {
  const voices = ('speechSynthesis' in window) ? window.speechSynthesis.getVoices() : [];
  const selectedVoice = voices.find(v => v.name === appState.ttsVoice);
  const bcp47 = (selectedVoice && selectedVoice.lang) || navigator.language || 'en-US';
  const short = bcp47.slice(0, 2).toLowerCase();
  return { bcp47, short: VOICE_COMMAND_KEYWORDS[short] ? short : 'en' };
}

// Regenerates the "Voice commands list" hint text to show real examples in
// whichever language is currently active, so the hint never goes stale
function updateSpeechHintsBox() {
  const listEl = document.getElementById('speech-hints-list');
  const tagEl = document.getElementById('speech-hints-lang-tag');
  if (!listEl) return;

  const { short } = getActiveRecognitionLang();
  const keywords = VOICE_COMMAND_KEYWORDS[short];
  listEl.textContent = VOICE_TAB_ORDER.map(tab => `"${keywords[tab][0]}"`).join(', ') + '.';
  if (tagEl) tagEl.textContent = short === 'en' ? '' : ` (${short.toUpperCase()})`;
}

let speechRecognitionEngine = null;
function disableSpeechToggle() {
  saveSetting('speechActive', false);
  const speechToggle = document.getElementById('speech-command-toggle');
  if (speechToggle) speechToggle.checked = false;
  const hints = document.getElementById('speech-hints-box');
  if (hints) hints.style.display = 'none';
}

function startVoiceCommandEngine() {
  if (speechRecognitionEngine) return;
  const RecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!RecognitionClass) {
    // If Web Speech API not supported by browser, toggle state off and
    // say why — failing silently here is exactly what made this look
    // "broken" with no way for the user to tell what went wrong
    disableSpeechToggle();
    showToast('Voice commands need Chrome, Edge, or Safari 17+ — this browser doesn\'t support speech recognition.', 'error', 7000);
    console.warn('Web Speech Recognition API not supported by this browser.');
    return;
  }

  // Speech recognition requires a secure context (HTTPS or localhost); on
  // plain HTTP or a file:// page the browser silently refuses microphone
  // access, so this is surfaced instead of leaving the toggle stuck "on"
  if (!window.isSecureContext) {
    disableSpeechToggle();
    showToast('Voice commands require a secure (HTTPS) connection. This page is not being served securely.', 'error', 7000);
    return;
  }

  try {
    speechRecognitionEngine = new RecognitionClass();
    speechRecognitionEngine.continuous = true;
    speechRecognitionEngine.interimResults = false;
    speechRecognitionEngine.lang = getActiveRecognitionLang().bcp47;

    const indicator = document.getElementById('voice-indicator');

    speechRecognitionEngine.onstart = () => {
      if (indicator) indicator.classList.remove('hidden');
      announceTextReader('Voice control microphone is now listening.');
    };

    speechRecognitionEngine.onresult = (e) => {
      const result = e.results[e.results.length - 1][0].transcript.toLowerCase().trim();
      routeSpeechCommand(result);
    };

    speechRecognitionEngine.onerror = (event) => {
      console.warn('Speech recognition error event:', event.error);

      // "no-speech" (silence) and "aborted" (tab switch, manual stop) are
      // routine in continuous listening mode, not real failures
      if (event.error === 'no-speech' || event.error === 'aborted') return;

      const messages = {
        'not-allowed': 'Microphone access was blocked. Allow the microphone for this site in your browser settings, then turn voice control back on.',
        'service-not-allowed': 'Microphone access was blocked. Allow the microphone for this site in your browser settings, then turn voice control back on.',
        'audio-capture': 'No microphone was found. Connect a microphone and try again.',
        'network': 'Voice recognition needs an internet connection — the speech service could not be reached.'
      };

      if (messages[event.error]) {
        showToast(messages[event.error], 'error', 7000);
        disableSpeechToggle();
        stopVoiceCommandEngine();
      }
    };

    speechRecognitionEngine.onend = () => {
      // Restart listening loop if voice control is still active
      if (appState.speechActive && speechRecognitionEngine) {
        try {
          speechRecognitionEngine.start();
        } catch (err) {
          console.warn('Failed to restart speech engine:', err);
        }
      } else {
        if (indicator) indicator.classList.add('hidden');
      }
    };

    speechRecognitionEngine.start();
  } catch (err) {
    console.warn('Microphone synthesis initialization failed:', err);
    disableSpeechToggle();
    showToast('Voice control could not start. Please reload the page and try again.', 'error', 6000);
  }
}

// Support sorting tickets table functions
function sortTickets(field) {
  if (currentSortField === field) {
    currentSortAscending = !currentSortAscending;
  } else {
    currentSortField = field;
    currentSortAscending = true;
  }

  mockTicketsData.sort((a, b) => {
    let valA = a[field];
    let valB = b[field];

    if (field === 'id') {
      valA = parseInt(a.id.replace('GT-', ''));
      valB = parseInt(b.id.replace('GT-', ''));
    }

    if (valA < valB) return currentSortAscending ? -1 : 1;
    if (valA > valB) return currentSortAscending ? 1 : -1;
    return 0;
  });

  updateSortHeadersUI();
  renderSupportTicketsTable();

  const fieldLabels = { id: 'Ticket ID', title: 'Issue Summary', category: 'Category', priority: 'Priority', status: 'Status' };
  const sortDirectionText = currentSortAscending ? 'ascending' : 'descending';
  announceTextReader(`Sorted tickets table by ${fieldLabels[field]} in ${sortDirectionText} order`);
}

function updateSortHeadersUI() {
  const headers = {
    id: 'sort-ticket-id',
    title: 'sort-ticket-title',
    category: 'sort-ticket-category',
    priority: 'sort-ticket-priority',
    status: 'sort-ticket-status'
  };

  const friendlyLabels = { id: 'Ticket ID', title: 'Title', category: 'Category', priority: 'Priority', status: 'Status' };

  Object.keys(headers).forEach(key => {
    const btn = document.getElementById(headers[key]);
    if (!btn) return;
    const th = btn.closest('th');

    if (key === currentSortField) {
      th.setAttribute('aria-sort', currentSortAscending ? 'ascending' : 'descending');
      btn.setAttribute('aria-label', `Sort by ${friendlyLabels[key]}, ${currentSortAscending ? 'descending' : 'ascending'}`);
    } else {
      th.removeAttribute('aria-sort');
      btn.setAttribute('aria-label', `Sort by ${friendlyLabels[key]}, ascending`);
    }
  });
}

function stopVoiceCommandEngine() {
  if (!speechRecognitionEngine) return;
  try {
    speechRecognitionEngine.stop();
  } catch (e) {}
  speechRecognitionEngine = null;
  const indicator = document.getElementById('voice-indicator');
  if (indicator) indicator.classList.add('hidden');
}

function routeSpeechCommand(phrase) {
  console.log('Recognized speech phrase:', phrase);
  
  const voiceAlert = document.getElementById('visual-audio-alert');
  if (appState.audioActive && voiceAlert) {
    voiceAlert.textContent = `Speech command heard: "${phrase}"`;
    voiceAlert.classList.remove('hidden');
    setTimeout(() => voiceAlert.classList.add('hidden'), 3000);
  }

  // Match against whichever language the active voice profile implies —
  // falls back to the English keyword set for any unmapped language, so a
  // recognized phrase always has a chance to route somewhere
  const { short } = getActiveRecognitionLang();
  const keywords = VOICE_COMMAND_KEYWORDS[short];
  const matchedTab = VOICE_TAB_ORDER.find(tab => keywords[tab].some(kw => phrase.includes(kw)));
  if (matchedTab) {
    switchTab(matchedTab);
  }
}

// 6. Navigation Tabs Controller
function switchTab(tabId, subTarget = '') {
  const panels = document.querySelectorAll('.tab-panel');
  panels.forEach(panel => {
    panel.classList.remove('active');
  });

  const targetPanel = document.getElementById(tabId);
  if (targetPanel) {
    targetPanel.classList.add('active');
    
    // Shift focus for keyboard users
    targetPanel.setAttribute('tabindex', '-1');
    targetPanel.focus();
  }

  // Update active sidebar indicators
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    if (item.getAttribute('data-target') === tabId) {
      item.classList.add('active');
      item.setAttribute('aria-current', 'page');
    } else {
      item.classList.remove('active');
      item.removeAttribute('aria-current');
    }
  });

  // Dynamic breadcrumbs mapping
  const crumbLink = document.querySelector(`.nav-item[data-target="${tabId}"]`);
  let labelText = 'Dashboard';
  if (crumbLink) {
    labelText = crumbLink.querySelector('.nav-label')?.textContent || crumbLink.textContent.trim();
  } else if (tabId === 'profile-tab') {
    labelText = 'My Profile';
  }
  
  if (breadcrumbCurrent) {
    breadcrumbCurrent.textContent = labelText;
  }

  // Speak announcement to screen readers
  announceTextReader(`Navigated to ${labelText} tab view panel`);
  logToAriaConsole(`Navigated to tab view: ${labelText}`);

  // Sub-target router routing inside views
  if (tabId === 'hr-tab' && subTarget) {
    const leaveTabBtn = document.getElementById('hr-subtab-leave');
    const benefitsTabBtn = document.getElementById('hr-subtab-benefits');
    const leavePanel = document.getElementById('hr-panel-leave');
    const benefitsPanel = document.getElementById('hr-panel-benefits');

    if (subTarget === 'leave' && leaveTabBtn && leavePanel) {
      leaveTabBtn.click();
    } else if (subTarget === 'benefits' && benefitsTabBtn && benefitsPanel) {
      benefitsTabBtn.click();
    }
  }

  // Scroll main panel to top
  if (mainContent) mainContent.scrollTop = 0;
}

// 7. Reading Guide Masks & Focus Frame positioning
function updateFocusFrame(target) {
  const overlay = document.getElementById('focus-frame-overlay');
  if (!overlay) return;

  // Climb to a visible ancestor when the target has no box of its own
  // (e.g. the visually-hidden checkbox inside toggle switches)
  let el = target;
  while (el && el !== document.body && el.getBoundingClientRect) {
    const r = el.getBoundingClientRect();
    if (r.width > 4 && r.height > 4) break;
    el = el.parentElement;
  }

  if (!appState.focusFrame || !el || el === document.body || el === document.documentElement) {
    // Nothing meaningful is focused: clip the whole overlay away so the
    // screen never sits fully dimmed with no spotlight cut-out
    overlay.style.clipPath = 'inset(100%)';
    return;
  }

  const rect = el.getBoundingClientRect();
  const padding = 6;
  const left = Math.max(0, rect.left - padding);
  const top = Math.max(0, rect.top - padding);
  const right = Math.min(window.innerWidth, rect.right + padding);
  const bottom = Math.min(window.innerHeight, rect.bottom + padding);

  overlay.style.clipPath = `polygon(
    0% 0%, 
    100% 0%, 
    100% 100%, 
    0% 100%, 
    0% 0%,
    ${left}px ${top}px, 
    ${left}px ${bottom}px, 
    ${right}px ${bottom}px, 
    ${right}px ${top}px, 
    ${left}px ${top}px
  )`;
}

function updateReadingMask(clientY) {
  const maskTop = document.getElementById('reading-mask-top');
  const maskBottom = document.getElementById('reading-mask-bottom');
  if (!maskTop || !maskBottom) return;

  const windowHeight = window.innerHeight;
  const gapHeight = 100; // Visible reading slit height in pixels

  const topHeight = Math.max(0, clientY - gapHeight / 2);
  const bottomHeight = Math.max(0, windowHeight - (clientY + gapHeight / 2));

  maskTop.style.height = `${topHeight}px`;
  maskBottom.style.height = `${bottomHeight}px`;
}

function updateReadingMaskFocus(target) {
  const maskTop = document.getElementById('reading-mask-top');
  const maskBottom = document.getElementById('reading-mask-bottom');
  if (!maskTop || !maskBottom) return;

  const rect = target.getBoundingClientRect();
  const topHeight = Math.max(0, rect.top - 20);
  const bottomHeight = Math.max(0, window.innerHeight - (rect.bottom + 20));

  maskTop.style.height = `${topHeight}px`;
  maskBottom.style.height = `${bottomHeight}px`;
}

// 8. Element Hover / Focus Scanner
function initHoverFocusSpeechListener() {
  document.body.addEventListener('focusin', (e) => {
    const target = e.target;
    const text = getElementAccessibleName(target);
    if (text) {
      if (appState.ttsActive) {
        announceTextReader(text);
      }
      if (appState.consoleActive) {
        logToAriaConsole(`Focused: ${text}`);
      }
      if (appState.brailleActive) {
        translateToBraille(text);
      }
    }

    // Keyboard navigation focus updates reading guides
    if (appState.rulerActive) {
      const rulerEl = document.getElementById('reading-ruler');
      if (rulerEl) {
        const rect = target.getBoundingClientRect();
        rulerEl.style.top = `${rect.top + rect.height / 2 - 2}px`;
      }
    }

    if (appState.maskActive) {
      updateReadingMaskFocus(target);
    }

    if (appState.focusFrame) {
      updateFocusFrame(target);
    }
  });

  document.body.addEventListener('mouseover', (e) => {
    // ADHD focus frame also spotlights the block under the pointer, so the
    // feature works with a mouse as well as with keyboard navigation
    if (appState.focusFrame) {
      const spotlight = e.target.closest('button, a, input, select, textarea, [tabindex], .dashboard-card, .form-card, .allowances-card, .status-summary-card, .need-urgent-help, .news-card, .employee-card, .accordion-item, .acc-section, .sidebar-card, .player-panel, .kb-search-box, tr');
      if (spotlight) updateFocusFrame(spotlight);
    }

    if (!appState.ttsActive && !appState.consoleActive && !appState.brailleActive) return;
    const target = e.target.closest('button, a, input, select, textarea, h1, h2, h3, h4, p, li, td, th');
    if (target && target.dataset.hoverSpoken !== 'true') {
      const text = getElementAccessibleName(target);
      if (text) {
        if (appState.ttsActive) {
          announceTextReader(text);
        }
        if (appState.consoleActive) {
          logToAriaConsole(`Hovered: ${text}`);
        }
        if (appState.brailleActive) {
          translateToBraille(text);
        }
        
        // Cache to prevent duplicate mousemove speak triggering
        target.dataset.hoverSpoken = 'true';
        target.addEventListener('mouseleave', () => {
          target.removeAttribute('data-hoverSpoken');
        }, { once: true });
      }
    }
  });
}

// Focus outline and ARIA label mapping helper
function getElementAccessibleName(el) {
  if (!el) return '';
  
  // ARIA Labels
  if (el.getAttribute('aria-label')) return el.getAttribute('aria-label');
  
  // Image alt text description
  if (el.tagName === 'IMG') return el.alt || 'Decorative Image';
  
  // Input fields description
  if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
    let labelText = '';
    if (el.id) {
      const associatedLabel = document.querySelector(`label[for="${el.id}"]`);
      if (associatedLabel) labelText = associatedLabel.textContent.trim();
    }
    return `${labelText} ${el.tagName.toLowerCase()} field`;
  }

  return el.textContent.trim().replace(/\s+/g, ' ').substring(0, 150);
}

// 9. FAQ Accordion panel toggle controllers
function initAccordionControls() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      const panelId = trigger.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);

      trigger.setAttribute('aria-expanded', !expanded);
      if (panel) {
        panel.hidden = expanded;
      }
      
      const qText = trigger.textContent.trim();
      const statusMessage = `${qText} accordion section is now ${expanded ? 'collapsed' : 'expanded'}`;
      announceTextReader(statusMessage);
      logToAriaConsole(statusMessage);
    });
  });
}

// Knowledge Base FAQ Filter search logic
function initKbSearch() {
  const kbInput = document.getElementById('kb-search-input');
  const kbBtn = document.getElementById('kb-search-btn');
  const faqItems = document.querySelectorAll('#faq-accordion .accordion-item');

  if (!kbInput || !kbBtn) return;

  function performFaqSearch() {
    const query = kbInput.value.toLowerCase().trim();
    let matchesCount = 0;

    faqItems.forEach(item => {
      const trigger = item.querySelector('.accordion-trigger');
      const body = item.querySelector('.accordion-body');
      const panel = item.querySelector('.accordion-panel');

      const text = (trigger.textContent + ' ' + (body ? body.textContent : '')).toLowerCase();
      
      if (!query) {
        item.style.display = '';
        trigger.setAttribute('aria-expanded', 'false');
        if (panel) panel.hidden = true;
      } else if (text.includes(query)) {
        item.style.display = '';
        trigger.setAttribute('aria-expanded', 'true');
        if (panel) panel.hidden = false;
        matchesCount++;
      } else {
        item.style.display = 'none';
      }
    });

    // Visible empty state alongside the spoken announcement
    let emptyEl = document.getElementById('faq-empty-state');
    if (query && matchesCount === 0) {
      if (!emptyEl) {
        emptyEl = document.createElement('div');
        emptyEl.id = 'faq-empty-state';
        emptyEl.className = 'empty-state';
        emptyEl.setAttribute('role', 'status');
        emptyEl.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          <h3>No articles found</h3>
          <p>No FAQ articles match your search. Try different keywords, or contact the support desk.</p>
          <button type="button" class="secondary-btn btn-sm">Clear search</button>`;
        emptyEl.querySelector('button').addEventListener('click', () => {
          kbInput.value = '';
          performFaqSearch();
          kbInput.focus();
        });
        document.getElementById('faq-accordion').appendChild(emptyEl);
      }
    } else if (emptyEl) {
      emptyEl.remove();
    }

    const speakMsg = query
      ? `Found ${matchesCount} FAQ articles matching "${query}"`
      : 'Cleared FAQ search filters';
    announceTextReader(speakMsg);
    logToAriaConsole(speakMsg);
  }

  kbBtn.addEventListener('click', performFaqSearch);
  kbInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      performFaqSearch();
    }
  });
}

// 10. HR/IT Ticket Form inputs validations
function initFormValidationHandlers() {
  // Time Off Request Form
  const leaveForm = document.getElementById('leave-form');
  const leaveErrorSummary = document.getElementById('leave-error-summary');
  const leaveErrorsList = document.getElementById('leave-errors-list');

  if (leaveForm) {
    leaveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Clear previous fields state
      const errorFields = leaveForm.querySelectorAll('.field-error');
      errorFields.forEach(f => f.classList.remove('field-error'));
      leaveForm.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
      if (leaveErrorSummary) leaveErrorSummary.classList.add('hidden');
      if (leaveErrorsList) leaveErrorsList.innerHTML = '';

      const errors = [];
      const typeVal = document.getElementById('leave-type').value;
      const startVal = document.getElementById('leave-start').value;
      const endVal = document.getElementById('leave-end').value;

      if (!typeVal) {
        errors.push({ id: 'leave-type', msg: 'Please select a leave category type.' });
      }
      if (!startVal) {
        errors.push({ id: 'leave-start', msg: 'Start date cannot be blank.' });
      }
      if (!endVal) {
        errors.push({ id: 'leave-end', msg: 'End date cannot be blank.' });
      }
      if (startVal && endVal && new Date(startVal) > new Date(endVal)) {
        errors.push({ id: 'leave-start', msg: 'Start date cannot be after the selected End date.' });
      }

      if (errors.length > 0) {
        // Output errors summaries
        if (leaveErrorSummary && leaveErrorsList) {
          leaveErrorSummary.classList.remove('hidden');
          errors.forEach(err => {
            const input = document.getElementById(err.id);
            input.parentElement.classList.add('field-error');
            input.setAttribute('aria-invalid', 'true');

            const fieldErrorSpan = document.getElementById(`${err.id}-error`);
            if (fieldErrorSpan) fieldErrorSpan.textContent = err.msg;

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${err.id}`;
            a.textContent = err.msg;
            a.onclick = (ev) => {
              ev.preventDefault();
              document.getElementById(err.id).focus();
            };
            li.appendChild(a);
            leaveErrorsList.appendChild(li);
          });
          leaveErrorSummary.focus();
          announceTextReader('Leave request submission failed. Please correct form errors at the top.');
        }
      } else {
        announceTextReader('Leave request submitted successfully. Routed to manager.');
        showToast('<strong>Leave request submitted.</strong> It has been routed to your manager — expect a decision within 24 hours.', 'success');
        leaveForm.reset();
      }
    });
  }

  // Technology Support Desk ticket submission form
  const supportForm = document.getElementById('support-form');
  const supportErrorSummary = document.getElementById('support-error-summary');
  const supportErrorsList = document.getElementById('support-errors-list');

  if (supportForm) {
    supportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const errorFields = supportForm.querySelectorAll('.field-error');
      errorFields.forEach(f => f.classList.remove('field-error'));
      supportForm.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
      if (supportErrorSummary) supportErrorSummary.classList.add('hidden');
      if (supportErrorsList) supportErrorsList.innerHTML = '';

      const errors = [];
      const catVal = document.getElementById('support-category').value;
      const priorityVal = document.getElementById('support-priority').value;
      const titleVal = document.getElementById('support-title').value.trim();
      const descVal = document.getElementById('support-desc').value.trim();

      if (!catVal) errors.push({ id: 'support-category', msg: 'Select a support category.' });
      if (!priorityVal) errors.push({ id: 'support-priority', msg: 'Select support priority urgency.' });
      if (!titleVal) errors.push({ id: 'support-title', msg: 'Summary title description is required.' });
      if (!descVal) errors.push({ id: 'support-desc', msg: 'Issue full description explanation is required.' });

      if (errors.length > 0) {
        if (supportErrorSummary && supportErrorsList) {
          supportErrorSummary.classList.remove('hidden');
          errors.forEach(err => {
            const input = document.getElementById(err.id);
            input.parentElement.classList.add('field-error');
            input.setAttribute('aria-invalid', 'true');

            const fieldErrorSpan = document.getElementById(`${err.id}-error`);
            if (fieldErrorSpan) fieldErrorSpan.textContent = err.msg;

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${err.id}`;
            a.textContent = err.msg;
            a.onclick = (ev) => {
              ev.preventDefault();
              document.getElementById(err.id).focus();
            };
            li.appendChild(a);
            supportErrorsList.appendChild(li);
          });
          supportErrorSummary.focus();
        }
      } else {
        // Mock add new submitted support ticket item to historical rows
        const newTicketId = addNewMockSupportTicket(catVal, priorityVal, titleVal, descVal);
        supportForm.reset();
        announceTextReader('Troubleshooting ticket submitted successfully.');
        showToast(`<strong>Ticket ${newTicketId} submitted.</strong> The IT service desk will confirm assignment shortly — you can track it in your ticket history below.`, 'success');
      }
    });
  }
}

// Mock Ticket listing array data
const mockTicketsData = [
  { id: 'GT-8841', title: 'Keyboard key stuck on corporate Mac', category: 'Hardware', priority: 'Medium', status: 'In Progress', log: 'Hardware technician assigned. Laptop must be dropped off at Hub 4.' },
  { id: 'GT-8102', title: 'VPN login fails with MFA timeout', category: 'Software & Access', priority: 'High', status: 'Resolved', log: 'Okta configuration re-synchronized. User confirmed login is fully operational.' }
];

function renderSupportTicketsTable() {
  const tableBody = document.getElementById('tickets-table-body');
  if (!tableBody) return;

  tableBody.innerHTML = '';
  mockTicketsData.forEach(ticket => {
    const row = document.createElement('tr');
    row.id = `ticket-row-${ticket.id}`;
    
    // Status Badge classes
    let statusClass = 'badge-info';
    if (ticket.status === 'Resolved') statusClass = 'badge-success';
    else if (ticket.status === 'Cancelled') statusClass = 'badge-general';

    let priorityClass = 'badge-warning';
    if (ticket.priority === 'High') priorityClass = 'badge-urgent';

    row.innerHTML = `
      <td><strong>${ticket.id}</strong></td>
      <td>${ticket.title}</td>
      <td>${ticket.category}</td>
      <td><span class="badge ${priorityClass}">${ticket.priority}</span></td>
      <td><span class="badge ${statusClass}">${ticket.status}</span></td>
      <td>
        <button class="secondary-btn btn-sm view-log-btn" aria-expanded="false" aria-controls="log-panel-${ticket.id}" data-id="${ticket.id}">
          View Resolution Logs
        </button>
      </td>
    `;
    tableBody.appendChild(row);

    // Expandable logs drawer sub-row
    const drawerRow = document.createElement('tr');
    drawerRow.id = `log-panel-${ticket.id}`;
    drawerRow.className = 'details-row-drawer hidden';
    drawerRow.innerHTML = `
      <td colspan="6">
        <div class="ticket-log-expanded">
          <p><strong>System Resolution Logs for Ticket ${ticket.id}:</strong></p>
          <p style="margin-top: 6px; font-style: italic;">"${ticket.log}"</p>
        </div>
      </td>
    `;
    tableBody.appendChild(drawerRow);
  });

  // Attach button triggers
  const logBtns = tableBody.querySelectorAll('.view-log-btn');
  logBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const ticketId = btn.getAttribute('data-id');
      const logPanel = document.getElementById(`log-panel-${ticketId}`);
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      btn.setAttribute('aria-expanded', !expanded);
      if (logPanel) {
        if (expanded) logPanel.classList.add('hidden');
        else logPanel.classList.remove('hidden');
      }

      announceTextReader(`Resolution details logs for ${ticketId} ${expanded ? 'collapsed' : 'expanded'}`);
    });
  });
}

function addNewMockSupportTicket(cat, priority, title, desc) {
  const newId = `GT-${Math.floor(Math.random() * 9000) + 1000}`;
  mockTicketsData.unshift({
    id: newId,
    title: title,
    category: cat === 'hardware' ? 'Hardware' : (cat === 'software' ? 'Software & Access' : (cat === 'network' ? 'Network' : 'Security')),
    priority: priority.charAt(0).toUpperCase() + priority.slice(1),
    status: 'Submitted',
    log: `Ticket submitted. Routed to ${cat} systems support queues. Troubleshooting description: "${desc}"`
  });
  renderSupportTicketsTable();
  return newId;
}

// 11. Mock Video Course Player actions
function initVideoPlayer() {
  const videoFrame = document.getElementById('video-frame');
  const bigPlayBtn = document.getElementById('video-big-play-btn');
  const playPauseBtn = document.getElementById('video-play-pause-btn');
  const playPauseIcon = document.getElementById('play-pause-icon');
  const progressSlider = document.getElementById('video-progress');
  const timeDisplay = document.getElementById('video-time-display');
  const captionsOverlay = document.getElementById('video-captions-overlay');
  const ccBtn = document.getElementById('video-cc-btn');
  const volumeBtn = document.getElementById('video-volume-btn');

  if (!videoFrame) return;

  let isPlaying = false;
  let currentTime = 0;
  let isMuted = false;
  let isCcActive = true;
  let playbackInterval = null;

  const videoDuration = 60; // 60 seconds mock total duration

  const mockCaptions = [
    { start: 0, end: 9, text: "Welcome to the GlobalTech Annual Code of Conduct." },
    { start: 10, end: 19, text: "In this training module, we will explore our core ethical principles." },
    { start: 20, end: 29, text: "We operate on transparency, inclusion, and accountability to our 400,000 global colleagues." },
    { start: 30, end: 39, text: "As employees, we must protect company property, user privacy, and report integrity." },
    { start: 40, end: 49, text: "If you observe unethical behavior, report it immediately to the compliance hotline." },
    { start: 50, end: 60, text: "Thank you for doing your part to keep GlobalTech a safe, respectful place for everyone." }
  ];

  function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      bigPlayBtn.style.display = 'none';
      playPauseIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
      playPauseBtn.setAttribute('aria-label', 'Pause course video');
      
      playbackInterval = setInterval(() => {
        currentTime++;
        if (currentTime > videoDuration) {
          currentTime = 0;
          togglePlay();
        }
        updatePlayerUI();
      }, 1000);
      
      announceTextReader("Compliance course video playback started.");
    } else {
      bigPlayBtn.style.display = 'flex';
      playPauseIcon.innerHTML = `<polygon points="6 3 20 12 6 21 6 3"></polygon>`;
      playPauseBtn.setAttribute('aria-label', 'Play course video');
      clearInterval(playbackInterval);
      announceTextReader("Compliance course video paused.");
    }
  }

  function updatePlayerUI() {
    progressSlider.value = currentTime;
    progressSlider.setAttribute('aria-valuenow', currentTime);
    progressSlider.setAttribute('aria-valuetext', `${currentTime} seconds elapsed`);

    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = currentTime % 60;
    const durationMinutes = Math.floor(videoDuration / 60);
    const durationSeconds = videoDuration % 60;

    timeDisplay.textContent = `${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')} / ${durationMinutes.toString().padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`;

    // Update Captions
    if (isCcActive) {
      const activeCaption = mockCaptions.find(c => currentTime >= c.start && currentTime <= c.end);
      captionsOverlay.textContent = activeCaption ? activeCaption.text : '';
      captionsOverlay.style.display = activeCaption ? 'block' : 'none';
    } else {
      captionsOverlay.style.display = 'none';
    }

    // Highlight active transcript segments
    const segments = document.querySelectorAll('.transcript-segment');
    segments.forEach(seg => {
      const time = parseInt(seg.getAttribute('data-time'));
      if (currentTime >= time && currentTime < time + 10) {
        seg.classList.add('active');
        seg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        seg.classList.remove('active');
      }
    });

    // Update Banner progress label percent
    const progressPctText = document.getElementById('player-progress-pct');
    if (progressPctText) {
      const pct = Math.floor((currentTime / videoDuration) * 100);
      progressPctText.textContent = `Progress: ${pct}%`;
    }
  }

  // Trigger bindings
  bigPlayBtn.addEventListener('click', togglePlay);
  playPauseBtn.addEventListener('click', togglePlay);
  
  progressSlider.addEventListener('input', (e) => {
    currentTime = parseInt(e.target.value);
    updatePlayerUI();
  });

  ccBtn.addEventListener('click', () => {
    isCcActive = !isCcActive;
    ccBtn.classList.toggle('active');
    ccBtn.setAttribute('aria-pressed', isCcActive);
    ccBtn.setAttribute('aria-label', `Toggle Closed Captions (Currently ${isCcActive ? 'ON' : 'OFF'})`);
    updatePlayerUI();
  });

  volumeBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    volumeBtn.setAttribute('aria-label', isMuted ? 'Unmute Audio' : 'Mute Audio');
    if (isMuted) {
      volumeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" x2="23" y1="1" y2="23"></line><path d="M9 9v6a3 3 0 0 0 5.12 2.12M15 9.34V4a2 2 0 0 0-3.5-1.33L7 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3l3.25 3.25A2 2 0 0 0 15 20v-3.5"></path></svg>`;
    } else {
      volumeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;
    }
  });

  // Timeline segment clicks
  const segments = document.querySelectorAll('.transcript-segment');
  segments.forEach(seg => {
    seg.addEventListener('click', () => {
      currentTime = parseInt(seg.getAttribute('data-time'));
      updatePlayerUI();
      if (!isPlaying) togglePlay();
    });
    
    seg.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        seg.click();
      }
    });
  });
}

// 12. Mock Interactive News list
const mockNewsItems = [
  { id: 1, title: 'New Global IT Security Policy Is Now Active', date: 'July 7, 2026', desc: 'All employees are required to review the data encryption policies and sign the digital security compliance agreement form in the portal settings.', category: 'Security' },
  { id: 2, title: 'Singapore Regional Office Grand Opening Set', date: 'July 5, 2026', desc: 'GlobalTech expansion continues with our state-of-the-art office workspace opening in Singapore next month. Internal relocation application cycles open Monday.', category: 'Operations' },
  { id: 3, title: 'Q2 Global Inclusion Summit Highlights', date: 'July 2, 2026', desc: 'Watch recordings and read summary transcripts of panels presenting the future of accessible digital systems at GlobalTech Connect.', category: 'Inclusion' }
];

// Category-tinted covers with icons (replaces repeated stock photography)
const NEWS_COVERS = {
  Security: { cls: 'news-cover-security', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>' },
  Operations: { cls: 'news-cover-operations', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>' },
  Inclusion: { cls: 'news-cover-inclusion', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' }
};

function renderNewsPortal() {
  const container = document.getElementById('news-grid-container');
  if (!container) return;

  container.innerHTML = '';
  mockNewsItems.forEach(news => {
    const cover = NEWS_COVERS[news.category] || NEWS_COVERS.Operations;
    const card = document.createElement('article');
    card.className = 'news-card';
    card.innerHTML = `
      <div class="news-image ${cover.cls}" aria-hidden="true">${cover.icon}</div>
      <div class="news-card-body">
        <div class="news-card-meta">
          <span class="badge badge-general">${news.category}</span>
          <span class="news-date">${news.date}</span>
        </div>
        <h3 class="news-card-title">${news.title}</h3>
        <p class="news-card-desc">${news.desc}</p>
      </div>
      <div class="news-card-footer">
        <button class="secondary-btn btn-sm read-article-btn" data-id="${news.id}">Read full announcement</button>
      </div>
    `;
    container.appendChild(card);
  });

  const readBtns = container.querySelectorAll('.read-article-btn');
  readBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = mockNewsItems.find(n => n.id == id);
      if (item) {
        announceTextReader(`Reading announcement article: ${item.title}. Published ${item.date}. Content details: ${item.desc}`);
        openModal({
          title: item.title,
          metaHtml: `<span class="badge badge-general">${item.category}</span><span class="news-date">${item.date}</span>`,
          bodyHtml: `<p>${item.desc}</p>`
        });
      }
    });
  });
}

// 13. Mock Employee Directory search engine
const mockEmployees = [
  { name: 'Vishnu', title: 'Business Analyst', dept: 'Business Operations', loc: 'London', email: 'vishnu@globaltech.com' },
  { name: 'Alex Wong', title: 'Senior Accessibility Engineer', dept: 'Engineering', loc: 'Singapore', email: 'alex.wong@globaltech.com' },
  { name: 'Chloe Sterling', title: 'HR Manager', dept: 'Human Resources', loc: 'London', email: 'chloe.sterling@globaltech.com' },
  { name: 'Michael Tanaka', title: 'Customer Support Lead', dept: 'Customer Support', loc: 'Tokyo', email: 'michael.tanaka@globaltech.com' },
  { name: 'Sarah Jenkins', title: 'Product Lead Manager', dept: 'Product', loc: 'New York', email: 'sarah.jenkins@globaltech.com' },
  { name: 'James Carter', title: 'Network Security Analyst', dept: 'Engineering', loc: 'Sydney', email: 'james.carter@globaltech.com' },
  { name: 'Priya Nair', title: 'Financial Operations Analyst', dept: 'Business Operations', loc: 'London', email: 'priya.nair@globaltech.com' },
  { name: 'Daniel Okafor', title: 'Software Engineer II', dept: 'Engineering', loc: 'New York', email: 'daniel.okafor@globaltech.com' },
  { name: 'Emma Lindqvist', title: 'Learning & Development Partner', dept: 'Human Resources', loc: 'London', email: 'emma.lindqvist@globaltech.com' },
  { name: 'Lucas Romero', title: 'Marketing Insights Manager', dept: 'Marketing', loc: 'New York', email: 'lucas.romero@globaltech.com' },
  { name: 'Hannah Kim', title: 'UX Researcher', dept: 'Product', loc: 'Singapore', email: 'hannah.kim@globaltech.com' },
  { name: 'Tom Bradshaw', title: 'IT Service Desk Analyst', dept: 'Customer Support', loc: 'Sydney', email: 'tom.bradshaw@globaltech.com' }
];

let filteredEmployees = [...mockEmployees];
let directoryCurrentPage = 1;
const directoryPageSize = 8;

// Deterministic initials avatars — consistent identity without stock photos
function getInitials(name) {
  return name.split(' ').filter(Boolean).map(part => part[0]).slice(0, 2).join('').toUpperCase();
}

function getAvatarHue(name) {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return sum % 6;
}

function renderEmployeeDirectory() {
  const container = document.getElementById('employee-grid-container');
  if (!container) return;

  container.innerHTML = '';
  const start = (directoryCurrentPage - 1) * directoryPageSize;
  const end = start + directoryPageSize;
  const pageData = filteredEmployees.slice(start, end);

  const pageIndicator = document.getElementById('dir-page-indicator');
  const totalPages = Math.ceil(filteredEmployees.length / directoryPageSize) || 1;
  if (pageIndicator) {
    pageIndicator.textContent = `Page ${directoryCurrentPage} of ${totalPages}`;
  }

  const prevBtn = document.getElementById('dir-prev-btn');
  const nextBtn = document.getElementById('dir-next-btn');
  if (prevBtn) prevBtn.disabled = directoryCurrentPage <= 1;
  if (nextBtn) nextBtn.disabled = directoryCurrentPage >= totalPages;

  if (pageData.length === 0) {
    container.innerHTML = `
      <div class="empty-state" role="status">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
        <h3>No matching colleagues</h3>
        <p>Try a different name, or clear the location and department filters to see everyone.</p>
        <button type="button" class="secondary-btn btn-sm" id="dir-empty-clear-btn">Clear all filters</button>
      </div>`;
    const emptyClearBtn = document.getElementById('dir-empty-clear-btn');
    if (emptyClearBtn) {
      emptyClearBtn.addEventListener('click', () => {
        const clearBtn = document.getElementById('dir-clear-btn');
        if (clearBtn) clearBtn.click();
      });
    }
    return;
  }

  pageData.forEach(emp => {
    const card = document.createElement('div');
    card.className = 'employee-card';
    card.innerHTML = `
      <div class="avatar-initials avatar-hue-${getAvatarHue(emp.name)}" aria-hidden="true">${getInitials(emp.name)}</div>
      <h3 class="employee-card-name">${emp.name}</h3>
      <span class="employee-card-title">${emp.title}</span>
      <span class="employee-card-detail">Dept: ${emp.dept}</span>
      <span class="employee-card-detail">Location: ${emp.loc}</span>
      <span class="employee-card-detail"><a href="mailto:${emp.email}" class="text-link-btn inline-btn">${emp.email}</a></span>
    `;
    container.appendChild(card);
  });
}

function filterDirectory() {
  const query = document.getElementById('dir-search-input').value.toLowerCase().trim();
  const loc = document.getElementById('dir-location-filter').value;
  const dept = document.getElementById('dir-dept-filter').value;

  filteredEmployees = mockEmployees.filter(emp => {
    const matchesQuery = emp.name.toLowerCase().includes(query) || 
                         emp.title.toLowerCase().includes(query) || 
                         emp.email.toLowerCase().includes(query);
    const matchesLoc = !loc || emp.loc === loc;
    const matchesDept = !dept || emp.dept === dept;
    return matchesQuery && matchesLoc && matchesDept;
  });

  directoryCurrentPage = 1;
  renderEmployeeDirectory();

  // Announce result counts to screen readers without stealing focus
  const live = document.getElementById('screen-reader-live');
  if (live) live.textContent = `${filteredEmployees.length} matching colleagues found.`;
}

function initDirectoryControls() {
  const searchInputEl = document.getElementById('dir-search-input');
  const locSelect = document.getElementById('dir-location-filter');
  const deptSelect = document.getElementById('dir-dept-filter');
  const clearBtn = document.getElementById('dir-clear-btn');
  
  const prevBtn = document.getElementById('dir-prev-btn');
  const nextBtn = document.getElementById('dir-next-btn');

  if (!searchInputEl) return;

  searchInputEl.addEventListener('input', filterDirectory);
  locSelect.addEventListener('change', filterDirectory);
  deptSelect.addEventListener('change', filterDirectory);

  clearBtn.addEventListener('click', () => {
    searchInputEl.value = '';
    locSelect.value = '';
    deptSelect.value = '';
    filterDirectory();
  });

  prevBtn.addEventListener('click', () => {
    if (directoryCurrentPage > 1) {
      directoryCurrentPage--;
      renderEmployeeDirectory();
      announceTextReader(`Navigated to directory page ${directoryCurrentPage}`);
    }
  });

  nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredEmployees.length / directoryPageSize);
    if (directoryCurrentPage < totalPages) {
      directoryCurrentPage++;
      renderEmployeeDirectory();
      announceTextReader(`Navigated to directory page ${directoryCurrentPage}`);
    }
  });
}

// 14. Global search dropdown filtering logic
const searchablePages = [
  { title: 'Employee Dashboard', target: 'dashboard-tab', category: 'Platform View' },
  { title: 'HR Self-Service Portal (Leave/Benefits)', target: 'hr-tab', category: 'Platform View' },
  { title: 'Learning & Development Training Videos', target: 'learning-tab', category: 'Platform View' },
  { title: 'IT Technology Support Desk', target: 'support-tab', category: 'Platform View' },
  { title: 'Company News & Operations Announcements', target: 'news-tab', category: 'Platform View' },
  { title: 'Employee Directory Contact Finder', target: 'directory-tab', category: 'Platform View' },
  { title: 'Knowledge Base FAQ Support Docs', target: 'kb-tab', category: 'Platform View' },
  { title: 'Help Centre Compliance Guidelines', target: 'help-tab', category: 'Platform View' }
];

function initSearchField() {
  searchInput = document.getElementById('global-search');
  searchResultsDropdown = document.getElementById('search-results');

  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
      searchResultsDropdown.classList.add('hidden');
      searchInput.setAttribute('aria-expanded', 'false');
      return;
    }

    const matches = searchablePages.filter(p => p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    renderSearchResults(matches);
  });

  // Keyboard navigation inside search results
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      const firstResult = searchResultsDropdown.querySelector('.search-result-item');
      if (firstResult) {
        e.preventDefault();
        firstResult.focus();
      }
    } else if (e.key === 'Escape') {
      searchResultsDropdown.classList.add('hidden');
      searchInput.setAttribute('aria-expanded', 'false');
      searchInput.blur();
    } else if (e.key === 'Enter') {
      const firstResult = searchResultsDropdown.querySelector('.search-result-item');
      if (firstResult) {
        e.preventDefault();
        firstResult.click();
      }
    }
  });

  // Handle outside clicks to close search results dropdown
  document.addEventListener('click', (e) => {
    if (searchResultsDropdown && !searchInput.contains(e.target) && !searchResultsDropdown.contains(e.target)) {
      searchResultsDropdown.classList.add('hidden');
      searchInput.setAttribute('aria-expanded', 'false');
    }
  });
}

function renderSearchResults(items) {
  if (!searchResultsDropdown) return;
  searchResultsDropdown.innerHTML = '';

  if (items.length === 0) {
    searchResultsDropdown.innerHTML = `<div style="padding: 10px 18px; color: var(--text-muted); font-size: 0.85rem;">No results found.</div>`;
    searchResultsDropdown.classList.remove('hidden');
    return;
  }

  items.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'search-result-item';
    btn.setAttribute('role', 'option');
    btn.innerHTML = `
      <span class="result-title">${item.title}</span>
      <span class="result-category">${item.category}</span>
    `;

    btn.addEventListener('click', () => {
      switchTab(item.target);
      searchResultsDropdown.classList.add('hidden');
      searchInput.setAttribute('aria-expanded', 'false');
      searchInput.value = '';
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = btn.nextElementSibling;
        if (next) next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = btn.previousElementSibling;
        if (prev) prev.focus();
        else searchInput.focus();
      } else if (e.key === 'Escape') {
        searchResultsDropdown.classList.add('hidden');
        searchInput.focus();
      }
    });

    searchResultsDropdown.appendChild(btn);
  });

  searchResultsDropdown.classList.remove('hidden');
  if (searchInput) searchInput.setAttribute('aria-expanded', 'true');
}

// 15. DOM Initialization binding
document.addEventListener('DOMContentLoaded', () => {
  rootEl = document.documentElement;
  bodyEl = document.body;

  // Initialize Splash Screen and callback
  initSplashScreen(() => {
    loadSavedSettings();
    applyAccessibilitySettings();
    
    // Voices synthesis load
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }

    // Core interactive elements binds
    sidebarToggle = document.getElementById('sidebar-toggle');
    sidebar = document.querySelector('.sidebar-nav');
    mainContent = document.getElementById('main-content');
    breadcrumbCurrent = document.getElementById('current-breadcrumb');

    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-collapsed');
        const collapsed = document.body.classList.contains('sidebar-collapsed');
        sidebarToggle.setAttribute('aria-expanded', !collapsed);
        announceTextReader(`Sidebar navigation menu ${collapsed ? 'collapsed' : 'expanded'}`);
      });

      // Small screens start with the navigation drawer closed
      if (window.innerWidth <= 860) {
        document.body.classList.add('sidebar-collapsed');
        sidebarToggle.setAttribute('aria-expanded', 'false');
      }
    }

    // Header Popups interactions (State Toggle Fixed propagation blocks)
    notificationBtn = document.getElementById('notification-btn');
    notificationPanel = document.getElementById('notification-panel');
    notificationBadge = document.getElementById('notification-badge');

    if (notificationBtn && notificationPanel) {
      notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const hidden = notificationPanel.classList.toggle('hidden');
        notificationBtn.setAttribute('aria-expanded', !hidden);
        if (!hidden) {
          profileMenu.classList.add('hidden');
          profileBtn.setAttribute('aria-expanded', 'false');
          announceTextReader("Notifications panel opened.");
        }
      });
      notificationPanel.addEventListener('click', (e) => e.stopPropagation());
    }

    profileBtn = document.getElementById('profile-btn');
    profileMenu = document.getElementById('profile-menu');

    if (profileBtn && profileMenu) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const hidden = profileMenu.classList.toggle('hidden');
        profileBtn.setAttribute('aria-expanded', !hidden);
        if (!hidden) {
          notificationPanel.classList.add('hidden');
          notificationBtn.setAttribute('aria-expanded', 'false');
          announceTextReader("User profile menu opened.");
        }
      });
      profileMenu.addEventListener('click', (e) => e.stopPropagation());
    }

    document.addEventListener('click', () => {
      if (notificationPanel) {
        notificationPanel.classList.add('hidden');
        notificationBtn.setAttribute('aria-expanded', 'false');
      }
      if (profileMenu) {
        profileMenu.classList.add('hidden');
        profileBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Sidebar view clicks
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const target = item.getAttribute('data-target');
        switchTab(target);

        // On small screens the sidebar is an overlay: close it after navigating
        if (window.innerWidth <= 860) {
          document.body.classList.add('sidebar-collapsed');
          if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Profile dropdown options redirects
    const profileItems = document.querySelectorAll('.profile-menu-item');
    profileItems.forEach(item => {
      item.addEventListener('click', () => {
        const target = item.getAttribute('data-target');
        if (target) {
          switchTab(target);
          if (profileMenu) profileMenu.classList.add('hidden');
        }
      });
    });

    // Quick Action shortcuts listeners
    const shortcutActions = document.querySelectorAll('.shortcut-btn, .primary-btn-overlay, .secondary-btn-overlay');
    shortcutActions.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        const sub = btn.getAttribute('data-sub') || '';
        if (target) switchTab(target, sub);
      });
    });

    // Close overlays on Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (notificationPanel) {
          notificationPanel.classList.add('hidden');
          notificationBtn.setAttribute('aria-expanded', 'false');
        }
        if (profileMenu) {
          profileMenu.classList.add('hidden');
          profileBtn.setAttribute('aria-expanded', 'false');
        }
        if (searchResultsDropdown) {
          searchResultsDropdown.classList.add('hidden');
        }
        const toolbarEl = document.getElementById('accessibility-toolbar');
        if (toolbarEl && toolbarEl.classList.contains('open')) {
          toolbarEl.classList.remove('open');
          toolbarEl.setAttribute('aria-hidden', 'true');
          const hubBtn = document.getElementById('accessibility-toolbar-btn');
          if (hubBtn) {
            hubBtn.setAttribute('aria-expanded', 'false');
            hubBtn.focus();
          }
          announceTextReader("Accessibility hub closed.");
        }
      }
    });

    // Mark all read alerts badge reset
    const markAllReadBtn = document.getElementById('mark-all-read');
    if (markAllReadBtn) {
      markAllReadBtn.addEventListener('click', () => {
        const unreads = document.querySelectorAll('.notification-item.unread');
        unreads.forEach(item => item.classList.remove('unread'));
        if (notificationBadge) notificationBadge.style.display = 'none';
        if (notificationBtn) notificationBtn.setAttribute('aria-label', 'View notifications. No unread messages.');
        announceTextReader("All alerts marked as read.");
      });
    }

    // HR subtab controls time off and health benefits switches
    const leaveSubtab = document.getElementById('hr-subtab-leave');
    const benefitsSubtab = document.getElementById('hr-subtab-benefits');
    const leavePanel = document.getElementById('hr-panel-leave');
    const benefitsPanel = document.getElementById('hr-panel-benefits');

    if (leaveSubtab && benefitsSubtab) {
      leaveSubtab.addEventListener('click', () => {
        leaveSubtab.classList.add('active');
        leaveSubtab.setAttribute('aria-selected', 'true');
        benefitsSubtab.classList.remove('active');
        benefitsSubtab.setAttribute('aria-selected', 'false');
        
        leavePanel.classList.remove('hidden');
        benefitsPanel.classList.add('hidden');
        announceTextReader("Time off request subtab active.");
      });

      benefitsSubtab.addEventListener('click', () => {
        benefitsSubtab.classList.add('active');
        benefitsSubtab.setAttribute('aria-selected', 'true');
        leaveSubtab.classList.remove('active');
        leaveSubtab.setAttribute('aria-selected', 'false');

        benefitsPanel.classList.remove('hidden');
        leavePanel.classList.add('hidden');
        announceTextReader("Health benefits enrollment subtab active.");
      });

      // WAI-ARIA tabs pattern: arrow keys move between the HR sub-tabs
      const hrTabs = [leaveSubtab, benefitsSubtab];
      hrTabs.forEach((tab, idx) => {
        tab.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const next = hrTabs[(idx + 1) % hrTabs.length];
            next.focus();
            next.click();
          }
        });
      });
    }

    // Keyboard global access key listeners
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.code === 'KeyA') {
        e.preventDefault();
        const toolbarBtn = document.getElementById('accessibility-toolbar-btn');
        if (toolbarBtn) toolbarBtn.click();
      } else if (e.altKey && e.code === 'Digit1') {
        e.preventDefault();
        switchTab('dashboard-tab');
      } else if (e.altKey && e.code === 'Digit2') {
        e.preventDefault();
        switchTab('hr-tab');
      } else if (e.altKey && e.code === 'Digit3') {
        e.preventDefault();
        switchTab('learning-tab');
      } else if (e.altKey && e.code === 'Digit4') {
        e.preventDefault();
        switchTab('support-tab');
      } else if (e.key === '/' && document.activeElement !== searchInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (searchInput) {
          searchInput.focus();
          announceTextReader("Global search field focused.");
        }
      }
    });

    // Accessibility Hub Drawer — opens from the header button, the profile
    // menu item, or the sidebar compliance link; state kept in sync for ARIA
    const toolbar = document.getElementById('accessibility-toolbar');
    const closeToolbar = document.getElementById('close-toolbar');
    const headerToolbarBtn = document.getElementById('accessibility-toolbar-btn');
    const profileToolbarBtn = document.getElementById('profile-accessibility-btn');

    function setToolbarOpen(open) {
      if (!toolbar) return;
      toolbar.classList.toggle('open', open);
      toolbar.setAttribute('aria-hidden', String(!open));
      if (headerToolbarBtn) headerToolbarBtn.setAttribute('aria-expanded', String(open));
      if (open) {
        if (profileMenu) {
          profileMenu.classList.add('hidden');
          profileBtn.setAttribute('aria-expanded', 'false');
        }
        if (closeToolbar) closeToolbar.focus();
        announceTextReader("Accessibility hub opened.");
      } else {
        announceTextReader("Accessibility hub closed.");
      }
    }

    if (headerToolbarBtn && toolbar) {
      headerToolbarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setToolbarOpen(!toolbar.classList.contains('open'));
      });
    }

    if (profileToolbarBtn && toolbar) {
      profileToolbarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setToolbarOpen(true);
      });
    }

    if (toolbar) toolbar.addEventListener('click', (e) => e.stopPropagation());

    if (closeToolbar) {
      closeToolbar.addEventListener('click', () => {
        setToolbarOpen(false);
        const returnBtn = headerToolbarBtn || document.getElementById('profile-btn');
        if (returnBtn) returnBtn.focus();
      });
    }

    const footerTrigger = document.getElementById('footer-accessibility-trigger');
    if (footerTrigger) {
      footerTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setToolbarOpen(true);
      });
    }

    // Dynamic mouse move handlers (Ruler, Mask)
    document.addEventListener('mousemove', (e) => {
      if (appState.rulerActive) {
        const rulerEl = document.getElementById('reading-ruler');
        if (rulerEl) {
          rulerEl.style.top = `${e.clientY - 2}px`;
        }
      }
      if (appState.maskActive) {
        updateReadingMask(e.clientY);
      }
    });

    // Accessibility controls interactive listener binders
    const themeRadios = document.querySelectorAll('input[name="app-theme"]');
    themeRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        saveSetting('theme', radio.value);
        applyAccessibilitySettings();
        announceTextReader(`Theme changed to ${radio.value} mode.`);
      });
    });

    const sizeSlider = document.getElementById('font-size-slider');
    if (sizeSlider) {
      sizeSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        saveSetting('fontScale', val);
        applyAccessibilitySettings();
      });
      sizeSlider.addEventListener('change', () => {
        announceTextReader(`Font size adjusted to ${appState.fontScale} percent`);
      });
    }

    const lineSlider = document.getElementById('line-spacing-slider');
    if (lineSlider) {
      lineSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        saveSetting('lineSpacing', val);
        applyAccessibilitySettings();
      });
      lineSlider.addEventListener('change', () => {
        announceTextReader(`Paragraph line spacing adjusted to ${(appState.lineSpacing / 10).toFixed(1)} times`);
      });
    }

    const letterSlider = document.getElementById('letter-spacing-slider');
    if (letterSlider) {
      letterSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        saveSetting('letterSpacing', val);
        applyAccessibilitySettings();
      });
      letterSlider.addEventListener('change', () => {
        announceTextReader(`Character letter spacing adjusted to plus ${appState.letterSpacing} percent`);
      });
    }

    const wordSlider = document.getElementById('word-spacing-slider');
    if (wordSlider) {
      wordSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        saveSetting('wordSpacing', val);
        applyAccessibilitySettings();
      });
      wordSlider.addEventListener('change', () => {
        announceTextReader(`Word spacing width adjusted to plus ${appState.wordSpacing} percent`);
      });
    }

    const alignSelect = document.getElementById('text-align-select');
    if (alignSelect) {
      alignSelect.addEventListener('change', () => {
        saveSetting('textAlign', alignSelect.value);
        applyAccessibilitySettings();
        announceTextReader(`Text alignment layout changed to ${alignSelect.value}`);
      });
    }

    const dyslexiaToggle = document.getElementById('dyslexia-font-toggle');
    if (dyslexiaToggle) {
      dyslexiaToggle.addEventListener('change', () => {
        saveSetting('dyslexiaActive', dyslexiaToggle.checked);
        applyAccessibilitySettings();
        announceTextReader(`Dyslexia layout font override ${appState.dyslexiaActive ? 'enabled' : 'disabled'}`);
      });
    }

    const monospaceToggle = document.getElementById('monospace-toggle');
    if (monospaceToggle) {
      monospaceToggle.addEventListener('change', () => {
        saveSetting('monospaceActive', monospaceToggle.checked);
        applyAccessibilitySettings();
        announceTextReader(`Monospace font override ${appState.monospaceActive ? 'enabled' : 'disabled'}`);
      });
    }

    const colorblindSelect = document.getElementById('colorblind-select');
    if (colorblindSelect) {
      colorblindSelect.addEventListener('change', () => {
        saveSetting('colorblind', colorblindSelect.value);
        applyAccessibilitySettings();
        announceTextReader(`Color blind simulator shader changed to ${colorblindSelect.value}`);
      });
    }

    const contrastSlider = document.getElementById('contrast-filter-slider');
    if (contrastSlider) {
      contrastSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        saveSetting('contrastFilter', val);
        applyAccessibilitySettings();
      });
      contrastSlider.addEventListener('change', () => {
        announceTextReader(`Contrast intensity adjusted to ${appState.contrastFilter} percent`);
      });
    }

    const saturationSlider = document.getElementById('saturation-filter-slider');
    if (saturationSlider) {
      saturationSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        saveSetting('saturationFilter', val);
        applyAccessibilitySettings();
      });
      saturationSlider.addEventListener('change', () => {
        announceTextReader(`Color saturation level adjusted to ${appState.saturationFilter} percent`);
      });
    }

    const ttsToggle = document.getElementById('tts-reader-toggle');
    if (ttsToggle) {
      ttsToggle.addEventListener('change', () => {
        saveSetting('ttsActive', ttsToggle.checked);
        applyAccessibilitySettings();
        if (appState.ttsActive) {
          loadVoices();
        }
        announceTextReader(`Screen reader text-to-speech voice reader ${appState.ttsActive ? 'enabled' : 'disabled'}`);
      });
    }

    ttsVoiceSelect = document.getElementById('tts-voice-select');
    if (ttsVoiceSelect) {
      ttsVoiceSelect.addEventListener('change', () => {
        saveSetting('ttsVoice', ttsVoiceSelect.value);
        updateSpeechHintsBox();
        // Restart voice control so it starts listening in the newly
        // selected profile's language rather than the previous one
        if (appState.speechActive && speechRecognitionEngine) {
          stopVoiceCommandEngine();
          startVoiceCommandEngine();
        }
        announceTextReader(`Vocal text-to-speech voice profile shifted to ${ttsVoiceSelect.value}`);
      });
    }

    ttsSpeedSlider = document.getElementById('tts-speed-slider');
    if (ttsSpeedSlider) {
      ttsSpeedSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        saveSetting('ttsSpeed', val);
        const speedValText = document.getElementById('tts-speed-value');
        if (speedValText) speedValText.textContent = `${val.toFixed(2)}x`;
      });
      ttsSpeedSlider.addEventListener('change', () => {
        announceTextReader(`Speech reading speed adjusted to ${appState.ttsSpeed} times`);
      });
    }

    const consoleToggle = document.getElementById('sr-console-toggle');
    if (consoleToggle) {
      consoleToggle.addEventListener('change', () => {
        saveSetting('consoleActive', consoleToggle.checked);
        applyAccessibilitySettings();
        announceTextReader(`Visual screen reader ARIA announcement console logs ${appState.consoleActive ? 'shown' : 'hidden'}`);
      });
    }

    const brailleToggle = document.getElementById('braille-simulator-toggle');
    if (brailleToggle) {
      brailleToggle.addEventListener('change', () => {
        saveSetting('brailleActive', brailleToggle.checked);
        applyAccessibilitySettings();
        announceTextReader(`Tactile Braille character translator console simulator ${appState.brailleActive ? 'shown' : 'hidden'}`);
      });
    }

    const speechToggle = document.getElementById('speech-command-toggle');
    if (speechToggle) {
      speechToggle.addEventListener('change', () => {
        saveSetting('speechActive', speechToggle.checked);
        applyAccessibilitySettings();
        announceTextReader(`Continuous voice speech recognition commands navigation microphone ${appState.speechActive ? 'enabled' : 'disabled'}`);
      });
    }

    const ringSelect = document.getElementById('focus-ring-select');
    if (ringSelect) {
      ringSelect.addEventListener('change', () => {
        saveSetting('focusRing', ringSelect.value);
        applyAccessibilitySettings();
        announceTextReader(`Keyboard navigation focus highlight rings outline changed to ${ringSelect.value}`);
      });
    }

    const targetsToggle = document.getElementById('large-targets-toggle');
    if (targetsToggle) {
      targetsToggle.addEventListener('change', () => {
        saveSetting('largeTargets', targetsToggle.checked);
        applyAccessibilitySettings();
        announceTextReader(`Large clickable targets expansion padding ${appState.largeTargets ? 'enabled' : 'disabled'}`);
      });
    }

    const cursorToggle = document.getElementById('large-cursor-toggle');
    if (cursorToggle) {
      cursorToggle.addEventListener('change', () => {
        saveSetting('cursorActive', cursorToggle.checked);
        applyAccessibilitySettings();
        announceTextReader(`Large high-contrast cursor ${appState.cursorActive ? 'enabled' : 'disabled'}`);
      });
    }

    const rulerToggle = document.getElementById('reading-ruler-toggle');
    if (rulerToggle) {
      rulerToggle.addEventListener('change', () => {
        saveSetting('rulerActive', rulerToggle.checked);
        applyAccessibilitySettings();
        announceTextReader(`Horizontal cursor reading ruler guide line ${appState.rulerActive ? 'enabled' : 'disabled'}`);
      });
    }

    const maskToggle = document.getElementById('reading-mask-toggle');
    if (maskToggle) {
      maskToggle.addEventListener('change', () => {
        saveSetting('maskActive', maskToggle.checked);
        applyAccessibilitySettings();
        announceTextReader(`Translucent vertical focus reading mask shader panel ${appState.maskActive ? 'enabled' : 'disabled'}`);
      });
    }

    const focusFrameToggle = document.getElementById('focus-frame-toggle');
    if (focusFrameToggle) {
      focusFrameToggle.addEventListener('change', () => {
        saveSetting('focusFrame', focusFrameToggle.checked);
        applyAccessibilitySettings();
        announceTextReader(`ADHD focus frame backdrop overlay blurs ${appState.focusFrame ? 'enabled' : 'disabled'}`);
      });
    }

    const motionToggle = document.getElementById('reduced-motion-toggle');
    if (motionToggle) {
      motionToggle.addEventListener('change', () => {
        saveSetting('motionActive', motionToggle.checked);
        applyAccessibilitySettings();
        announceTextReader(`Reduced layout transitions animations freeze ${appState.motionActive ? 'enabled' : 'disabled'}`);
      });
    }

    const labelsToggle = document.getElementById('icon-labels-toggle');
    if (labelsToggle) {
      labelsToggle.addEventListener('change', () => {
        saveSetting('labelsActive', labelsToggle.checked);
        applyAccessibilitySettings();
        announceTextReader(`Button icon text annotation descriptions forced visible labels ${appState.labelsActive ? 'enabled' : 'disabled'}`);
      });
    }

    const audioToggle = document.getElementById('audio-cue-toggle');
    if (audioToggle) {
      audioToggle.addEventListener('change', () => {
        saveSetting('audioActive', audioToggle.checked);
        applyAccessibilitySettings();
        announceTextReader(`Sound equivalents subtitles and flashes visual alerts ${appState.audioActive ? 'enabled' : 'disabled'}`);
      });
    }

    // Sort Button Event Listeners
    const sortIdBtn = document.getElementById('sort-ticket-id');
    if (sortIdBtn) sortIdBtn.addEventListener('click', () => sortTickets('id'));

    const sortTitleBtn = document.getElementById('sort-ticket-title');
    if (sortTitleBtn) sortTitleBtn.addEventListener('click', () => sortTickets('title'));

    const sortCategoryBtn = document.getElementById('sort-ticket-category');
    if (sortCategoryBtn) sortCategoryBtn.addEventListener('click', () => sortTickets('category'));

    const sortPriorityBtn = document.getElementById('sort-ticket-priority');
    if (sortPriorityBtn) sortPriorityBtn.addEventListener('click', () => sortTickets('priority'));

    const sortStatusBtn = document.getElementById('sort-ticket-status');
    if (sortStatusBtn) sortStatusBtn.addEventListener('click', () => sortTickets('status'));

    // Initial sub-modules renders
    renderSupportTicketsTable();
    renderNewsPortal();
    renderEmployeeDirectory();

    // Secondary UI controllers init
    initHoverFocusSpeechListener();
    initAccordionControls();
    initFormValidationHandlers();
    initVideoPlayer();
    initDirectoryControls();
    initSearchField();
    initKbSearch();

    adjustOSShortcuts();

    const langSelect = document.getElementById('language-select');
    if (langSelect) {
      langSelect.addEventListener('change', () => {
        saveSetting('language', langSelect.value);
        applyAccessibilitySettings();
      });
    }

    // Focus Frame Layout listeners
    window.addEventListener('resize', () => {
      if (appState.focusFrame && document.activeElement) {
        updateFocusFrame(document.activeElement);
      }
    });

    window.addEventListener('scroll', () => {
      if (appState.focusFrame && document.activeElement) {
        updateFocusFrame(document.activeElement);
      }
    }, true);
  });
});
