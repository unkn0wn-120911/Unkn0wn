const toolsUI = {
  openTool(id) {
    const tool = App.tools.find(t => t.id === id);
    if (!tool) return;
    document.getElementById('tool-title').textContent = tool.name;
    const container = document.getElementById('tool-container');
    container.innerHTML = '';
    
    if (id === 'hash-gen') hashGenerator.render(container);
    else container.innerHTML = `<p class="terminal-output">🔧 Module "${id}" loading... (Coming Soon)</p>`;
    
    document.getElementById('tool-workspace').classList.remove('hidden');
    document.getElementById('tools-grid').classList.add('hidden');
  },
  closeTool() {
    document.getElementById('tool-workspace').classList.add('hidden');
    document.getElementById('tools-grid').classList.remove('hidden');
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
