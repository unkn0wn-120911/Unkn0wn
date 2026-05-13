const App = {
  tools: [],
  init() {
    this.registerTools();
    this.renderToolsGrid();
    window.addEventListener('hashchange', () => router.handleRoute());
    router.handleRoute();
  },
  registerTools() {
    this.tools = [
      { id: 'hash-gen', name: 'Hash Generator', category: 'Crypto', desc: 'SHA-1/256/512 using Web Crypto API' },
      { id: 'base64', name: 'Base64 / Hex Encoder', category: 'Encoding', desc: 'Safe in-browser encode/decode' },
      { id: 'headers', name: 'Headers Analyzer', category: 'Recon', desc: 'Check CORS, CSP, HSTS flags' }
    ];
  },
  renderToolsGrid() {
    const grid = document.getElementById('tools-grid');
    if (!grid) return;
    grid.innerHTML = this.tools.map(t => `
      <div class="tool-card" onclick="toolsUI.openTool('${t.id}')">
        <h3>${t.name}</h3>
        <p>${t.desc}</p>
        <span>[${t.category}]</span>
      </div>
    `).join('');
  }
};
