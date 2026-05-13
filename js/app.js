const App = {
  tools: [],
  init() {
    this.registerTools();
    this.renderToolsGrid();
    UIEffects.loadTheme();
    document.getElementById('theme-toggle')?.addEventListener('click', UIEffects.toggleTheme);
    window.addEventListener('hashchange', () => router.handleRoute());
    router.handleRoute();
  },
  registerTools() {
    this.tools = [
      { id: 'hash-gen', name: 'Hash Generator', category: 'Crypto', desc: 'SHA-1/256/512 via Web Crypto API' },
      { id: 'base64-hex', name: 'Base64 / Hex Encoder', category: 'Encoding', desc: 'Safe in-browser encode/decode' },
      { id: 'headers-check', name: 'Headers Analyzer', category: 'Recon', desc: 'Check CORS, CSP, HSTS flags' },
      { id: 'jwt-debug', name: 'JWT Token Debugger', category: 'Web Sec', desc: 'Decode, validate, highlight claims' }
    ];
  },
  renderToolsGrid() {
    const grid = document.getElementById('tools-grid');
    if (!grid) return;
    grid.innerHTML = this.tools.map(t => `
      <div class="tool-card fade-in" onclick="toolsUI.openTool('${t.id}')">
        <h3>${t.name}</h3><p>${t.desc}</p><span>[${t.category}]</span>
      </div>`).join('');
  }
};
