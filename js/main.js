const toolsUI = {
  openTool(id) {
    const tool = App.tools.find(t => t.id === id);
    if (!tool) return;
    document.getElementById('tool-title').textContent = tool.name;
    const container = document.getElementById('tool-container');
    container.innerHTML = '';
    if (id==='hash-gen') hashGenerator.render(container);
    else if (id==='base64-hex') base64HexTool.render(container);
    else if (id==='headers-check') headersChecker.render(container);
    else if (id==='jwt-debug') jwtDebugger.render(container);
    else container.innerHTML = `<p class="terminal-output">🔧 Module "${id}" loading...</p>`;
    document.getElementById('tool-workspace').classList.remove('hidden');
    document.getElementById('tools-grid').classList.add('hidden');
  },
  closeTool() {
    document.getElementById('tool-workspace').classList.add('hidden');
    document.getElementById('tools-grid').classList.remove('hidden');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
  UIEffects.typeWriter(document.querySelector('.site-name'), 'UNKN0WN', 80);
  setTimeout(() => UIEffects.typeWriter(document.querySelector('.tagline'), 'FUcKeR', 60), 1000);
});
