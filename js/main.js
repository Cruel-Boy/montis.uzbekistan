/* main.js - multilingual site loader and UI wiring */

(async function(){
  const POSSIBLE_PATHS = ['/lang/lang.json','lang/lang.json','./lang/lang.json'];
  let langData = null;

  async function loadLangJson(){
    for(const p of POSSIBLE_PATHS){
      try {
        const r = await fetch(p);
        if(!r.ok) continue;
        const json = await r.json();
        console.log('Loaded lang.json from', p);
        return json;
      } catch(e) {
        console.warn('fetch failed for', p, e);
      }
    }
    console.warn('Using inline fallback lang data (please fix lang/lang.json)');
    return {
      ru: { company_name: 'Компания', nav: { home: 'Главная' } },
      en: { company_name: 'Company', nav: { home: 'Home' } },
      uz: { company_name: 'Kompaniya', nav: { home: 'Asosiy' } }
    };
  }

  langData = await loadLangJson();

  // helper: dotted-key lookup
  function lookup(obj, path){
    return path.split('.').reduce((o,k)=> (o && o[k] !== undefined) ? o[k] : undefined, obj);
  }

  // apply translations to elements with data-i18n
  function applyTranslations(locale){
    if(!langData || !langData[locale]) return;
    const map = langData[locale];
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      const val = lookup(map, key);
      if(val !== undefined && val !== null){
        if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'){
          el.setAttribute('placeholder', val);
        } else {
          el.textContent = val;
        }
      }
    });
    document.documentElement.lang = locale;
    // update document title from top-level company_name + page-specific heading if present
    const pageTitleEl = document.querySelector('main h1[data-i18n]');
    const company = lookup(map, 'company_name');
    if(pageTitleEl){
      const key = pageTitleEl.getAttribute('data-i18n');
      const pageTitle = lookup(map, key) || pageTitleEl.textContent;
      if(company && pageTitle){
        document.title = `${company} — ${pageTitle}`;
      }
    } else if(company){
      document.title = company;
    }
  }

  // current locale
  function currentLocale(){ return localStorage.getItem('site_locale') || 'ru'; }
  function setLocale(loc){
    localStorage.setItem('site_locale', loc);
    // update all selects
    document.querySelectorAll('select[id^="langSelect"]').forEach(s=> s.value = loc);
    applyTranslations(loc);
    populateGrids(loc);
    renderKpis();
    renderCharts(loc);
  }

  // init language selects
  function initLangSelectors(){
    document.querySelectorAll('select[id^="langSelect"]').forEach(select=>{
      select.value = currentLocale();
      select.addEventListener('change', (e)=>{
        setLocale(e.target.value);
      });
    });
    // also set main select value if present
    const main = document.getElementById('langSelect');
    if(main) {
      main.value = currentLocale();
      main.addEventListener('change', (e)=> setLocale(e.target.value));
    }
    const drawer = document.getElementById('langSelectDrawer');
    if(drawer){
      drawer.value = currentLocale();
      drawer.addEventListener('change', (e)=> setLocale(e.target.value));
    }
  }

  // populate project cards
  function populateGrid(id, items){
    const grid = document.getElementById(id);
    if(!grid) return;
    grid.innerHTML = '';
    items.forEach(item=>{
      const article = document.createElement('article');
      article.className = 'card';
      const h3 = document.createElement('h3');
      h3.textContent = item;
      const desc = document.createElement('div');
      desc.className = 'desc';
      desc.textContent = ''; // placeholder short info, can be added to lang.json later
      article.appendChild(h3);
      article.appendChild(desc);
      grid.appendChild(article);
    });
  }

  // fill projects, equipment, services grids based on current locale
  function populateGrids(locale){
    const blocks = (langData[locale] && langData[locale].services_blocks) ? langData[locale].services_blocks : {};
    populateGrid('projectsGrid', blocks.projects || []);
    populateGrid('equipmentGrid', blocks.equipment || []);
    populateGrid('servicesGrid', blocks.services || []);

    // also fill the smaller feature cards on index if needed (catalog.items)
    const catalogItems = lookup(langData[locale], 'catalog.items') || [];
    const catalogGrid = document.getElementById('catalogGrid');
    if(catalogGrid){
      catalogGrid.innerHTML = '';
      catalogItems.forEach(ci=>{
        const card = document.createElement('article');
        card.className = 'card';
        const title = document.createElement('h3'); title.textContent = ci.title || '';
        const p = document.createElement('p'); p.textContent = ci.desc || '';
        const placeholder = document.createElement('div'); placeholder.className='image-placeholder'; placeholder.textContent='Image';
        card.appendChild(title); card.appendChild(p); card.appendChild(placeholder);
        catalogGrid.appendChild(card);
      });
    }

    // populate market highlights lists if present
    const mhA = document.getElementById('mhAuctions');
    const mhO = document.getElementById('mhOffers');
    const mhT = document.getElementById('mhTargets');
    if(mhA && mhO && mhT){
      const sampleAuctions = [
        'Lot #102 — Greenhouse frames (batch of 20)',
        'Lot #287 — Milk cooling tank 3,000L',
        'Lot #331 — Irrigation pumps (set)'
      ];
      const sampleOffers = [
        'Production line for cookies — refurbished',
        'Feed mixer — new, 1.5t/hour',
        'Ventilation system kits — turnkey'
      ];
      const sampleTargets = [
        'Buyer seeks 10 refrigerated containers',
        'Investor seeks poultry farm project',
        'Factory requests water treatment unit'
      ];

      function renderList(ul, items){
        ul.innerHTML = '';
        items.forEach(txt=>{
          const li = document.createElement('li');
          li.textContent = txt;
          ul.appendChild(li);
        });
      }
      renderList(mhA, sampleAuctions);
      renderList(mhO, sampleOffers);
      renderList(mhT, sampleTargets);
    }
  }

  // Dashboard helpers
  function getDemoMetrics(){
    return {
      revenue: { value: 1250000, deltaPct: 8.2 },
      orders: { value: 842, deltaPct: 5.6 },
      clients: { value: 312, deltaPct: 2.3 },
      conversion: { value: 3.8, deltaPct: 0.4 }
    };
  }

  function formatNumber(n){
    return Intl.NumberFormat().format(n);
  }

  function renderKpis(){
    const m = getDemoMetrics();
    const rev = document.getElementById('kpiRevenue');
    if(!rev) return;
    const revDelta = document.getElementById('kpiRevenueDelta');
    const ord = document.getElementById('kpiOrders');
    const ordDelta = document.getElementById('kpiOrdersDelta');
    const cli = document.getElementById('kpiClients');
    const cliDelta = document.getElementById('kpiClientsDelta');
    const conv = document.getElementById('kpiConversion');
    const convDelta = document.getElementById('kpiConversionDelta');

    rev.textContent = '$' + formatNumber(m.revenue.value);
    revDelta.textContent = (m.revenue.deltaPct>=0?'+':'') + m.revenue.deltaPct + '%';
    ord.textContent = formatNumber(m.orders.value);
    ordDelta.textContent = (m.orders.deltaPct>=0?'+':'') + m.orders.deltaPct + '%';
    cli.textContent = formatNumber(m.clients.value);
    cliDelta.textContent = (m.clients.deltaPct>=0?'+':'') + m.clients.deltaPct + '%';
    conv.textContent = m.conversion.value + '%';
    convDelta.textContent = (m.conversion.deltaPct>=0?'+':'') + m.conversion.deltaPct + ' pp';
  }

  function renderCharts(locale){
    const salesCanvas = document.getElementById('salesTrendChart');
    const catCanvas = document.getElementById('categoryBreakdownChart');
    if(!salesCanvas || !catCanvas) return;

    const t = (key)=> lookup(langData[locale], key) || key;
    const ctx1 = salesCanvas.getContext('2d');
    const ctx2 = catCanvas.getContext('2d');

    const months = [t('months.jan'),t('months.feb'),t('months.mar'),t('months.apr'),t('months.may'),t('months.jun'),t('months.jul'),t('months.aug'),t('months.sep'),t('months.oct'),t('months.nov'),t('months.dec')];
    const sales = [120,150,180,160,210,240,230,250,270,300,320,340];

    if(window.__salesChart) window.__salesChart.destroy();
    window.__salesChart = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: t('charts.sales_trend'),
          data: sales,
          borderColor: '#2c5cc5',
          backgroundColor: 'rgba(44,92,197,0.15)',
          tension: 0.3,
          fill: true,
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });

    const categories = [t('catalog.items.0.title'), t('catalog.items.1.title'), t('catalog.items.2.title')];
    const shares = [45, 30, 25];
    if(window.__catChart) window.__catChart.destroy();
    window.__catChart = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [{
          data: shares,
          backgroundColor: ['#1a2b49','#2c5cc5','#6b7280']
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // initial apply
  applyTranslations(currentLocale());
  initLangSelectors();
  populateGrids(currentLocale());
  renderKpis();
  renderCharts(currentLocale());

  // Mobile drawer toggle
  const hamburger = document.getElementById('hamburger');
  const drawerEl = document.getElementById('mobileDrawer');
  const overlayEl = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');
  function openDrawer(){
    if(!drawerEl || !overlayEl) return;
    drawerEl.classList.add('open');
    overlayEl.classList.add('open');
    drawerEl.setAttribute('aria-hidden','false');
  }
  function closeDrawer(){
    if(!drawerEl || !overlayEl) return;
    drawerEl.classList.remove('open');
    overlayEl.classList.remove('open');
    drawerEl.setAttribute('aria-hidden','true');
  }
  if(hamburger){ hamburger.addEventListener('click', openDrawer); }
  if(drawerClose){ drawerClose.addEventListener('click', closeDrawer); }
  if(overlayEl){ overlayEl.addEventListener('click', closeDrawer); }

})();