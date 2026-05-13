const headersChecker = {
  render(container) {
    container.innerHTML = `
      <div class="tool-input-group">
        <label>Target URL (https://...):</label>
        <input type="url" id="hc-url" placeholder="https://example.com" />
      </div>
      <div class="tool-actions">
        <button id="hc-check-btn">🔍 Check Headers</button>
      </div>
      <div id="hc-output" class="terminal-output"></div>
      <p style="font-size:0.7rem; color:var(--text-muted); margin-top:0.5rem;">⚠️ Browser CORS policy restricts cross-origin header reads. Uses fetch with fallback.</p>
    `;
    document.getElementById('hc-check-btn').onclick = () => this.check();
  },
  async check() {
    const url = document.getElementById('hc-url').value.trim();
    const out = document.getElementById('hc-output');
    out.innerHTML = '';
    if (!url.startsWith('http')) { out.textContent = '⚠️ Use full URL (https://...)'; return; }
    out.textContent = '⏳ Fetching...';
    try {
      const res = await fetch(url, { method: 'HEAD' });
      const headers = {};
      res.headers.forEach((v,k) => headers[k] = v);
      const sec = ['Strict-Transport-Security','Content-Security-Policy','X-Frame-Options','X-Content-Type-Options','Referrer-Policy','Permissions-Policy'];
      const lines = sec.map(h => `${h}: ${headers[h.toLowerCase()] || headers[h] || '❌ Missing'}`);
      UIEffects.typewriterOutput(out, lines);
      setTimeout(() => UIEffects.setupCopyButton(out), 600);
    } catch(e) {
      out.innerHTML = `⚠️ CORS/Network Blocked<br>📖 Run locally: <code>curl -I ${url}</code><br>Or use server-side proxy for production scanning.`;
    }
  }
};
