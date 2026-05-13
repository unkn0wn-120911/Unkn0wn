const jwtDebugger = {
  render(container) {
    container.innerHTML = `
      <div class="tool-input-group">
        <label>Paste JWT Token:</label>
        <textarea id="jwt-input" rows="4" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."></textarea>
      </div>
      <div class="tool-actions">
        <button id="jwt-decode-btn">🔓 Decode & Analyze</button>
      </div>
      <div id="jwt-output" class="terminal-output"></div>
    `;
    document.getElementById('jwt-decode-btn').onclick = () => this.decode();
  },
  decode() {
    const token = document.getElementById('jwt-input').value.trim();
    const out = document.getElementById('jwt-output');
    out.innerHTML = '';
    const parts = token.split('.');
    if (parts.length !== 3) { out.textContent = '❌ Invalid JWT format. Expected 3 parts separated by "."'; return; }
    try {
      const dec = s => { s=s.replace(/-/g,'+').replace(/_/g,'/'); while(s.length%4) s+='='; return JSON.parse(atob(s)); };
      const header = dec(parts[0]);
      const payload = dec(parts[1]);
      const lines = [`📜 ALGORITHM: ${header.alg || 'unknown'}`, `📜 TYPE: ${header.typ || 'unknown'}`, `--- PAYLOAD ---`];
      Object.entries(payload).forEach(([k,v]) => {
        if (k==='exp') { const d=new Date(v*1000); lines.push(`${k}: ${v} (${d.toISOString()}) ${Date.now()>v*1000 ? '⚠️ EXPIRED' : '✅ VALID'}`); }
        else if (k==='iat') { lines.push(`${k}: ${v} (${new Date(v*1000).toISOString()})`); }
        else { lines.push(`${k}: ${typeof v==='object' ? JSON.stringify(v) : v}`); }
      });
      if (header.alg==='none') lines.push('🚨 CRITICAL: Algorithm "none" detected! Signature bypass possible.');
      UIEffects.typewriterOutput(out, lines);
      setTimeout(() => UIEffects.setupCopyButton(out), 600);
    } catch(e) { out.textContent = `❌ Decode Error: ${e.message}`; }
  }
};
