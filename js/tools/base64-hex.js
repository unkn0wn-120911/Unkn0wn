const base64HexTool = {
  render(container) {
    container.innerHTML = `
      <div class="tool-input-group">
        <label>Input Text:</label>
        <textarea id="bh-input" rows="3" placeholder="Enter string to encode/decode..."></textarea>
      </div>
      <div class="tool-actions">
        <button id="bh-encode-btn">🔒 Encode</button>
        <button id="bh-decode-btn">🔓 Decode</button>
      </div>
      <div id="bh-output" class="terminal-output"></div>
    `;
    document.getElementById('bh-encode-btn').onclick = () => this.process('encode');
    document.getElementById('bh-decode-btn').onclick = () => this.process('decode');
  },
  process(mode) {
    const input = document.getElementById('bh-input').value.trim();
    const out = document.getElementById('bh-output');
    out.innerHTML = '';
    if (!input) { out.textContent = '⚠️ Input required.'; return; }
    try {
      let res = {};
      if (mode === 'encode') {
        const bytes = new TextEncoder().encode(input);
        res.base64 = btoa(String.fromCharCode(...bytes));
        res.hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
      } else {
        if (/^[0-9a-fA-F\s]+$/.test(input)) {
          const hex = input.replace(/\s/g, '');
          const bytes = new Uint8Array(hex.match(/.{1,2}/g).map(b => parseInt(b, 16)));
          res.decoded = new TextDecoder().decode(bytes);
        } else {
          res.decoded = atob(input);
        }
      }
      const lines = Object.entries(res).map(([k,v]) => `${k.toUpperCase()}: ${v}`);
      UIEffects.typewriterOutput(out, lines);
      setTimeout(() => UIEffects.setupCopyButton(out), 600);
    } catch(e) { out.textContent = `❌ Error: ${e.message}`; }
  }
};
