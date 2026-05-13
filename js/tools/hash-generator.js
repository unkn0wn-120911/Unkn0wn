const hashGenerator = {
  render(container) {
    container.innerHTML = `
      <div class="tool-input-group">
        <label>Input String:</label>
        <textarea id="hash-input" rows="3" placeholder="Type here..."></textarea>
      </div>
      <div class="tool-actions">
        <button id="calc-hashes">Generate Hashes</button>
      </div>
      <div id="hash-output" class="terminal-output"></div>
    `;
    document.getElementById('calc-hashes').addEventListener('click', this.calculate);
  },
  async calculate() {
    const input = document.getElementById('hash-input').value;
    const out = document.getElementById('hash-output');
    if (!input) { out.textContent = '⚠️ Input required.'; return; }
    out.textContent = '⏳ Computing...';
    
    const res = {};
    for (const algo of ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']) {
      const buf = new TextEncoder().encode(input);
      const hashBuf = await crypto.subtle.digest(algo, buf);
      res[algo] = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2,'0')).join('');
    }
    out.textContent = Object.entries(res).map(([k,v]) => `${k}: ${v}`).join('\n\n');
  }
};
