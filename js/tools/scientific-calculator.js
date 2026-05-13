const scientificCalculator = {
  state: {
    display: '0',
    expression: '',
    memory: 0,
    isDegree: true,
    lastResult: null,
    history: []
  },
  render(container) {
    container.innerHTML = `
      <div class="calc-wrapper">
        <div class="calc-display">
          <div class="calc-expression" id="calc-expr"></div>
          <div class="calc-main" id="calc-main">0</div>
          <div class="calc-indicators">
            <span id="calc-mode">D</span>
            <span id="calc-mem" class="hidden">M</span>
          </div>
        </div>
        <div class="calc-buttons">
          <!-- Row 1 -->
          <button class="calc-fn" data-action="shift">SHIFT</button>
          <button class="calc-fn" data-action="alpha">ALPHA</button>
          <button class="calc-fn" data-action="mode">MODE</button>
          <button class="calc-fn" data-action="on" style="color:#ff6b6b">ON</button>
          
          <!-- Row 2 -->
          <button class="calc-sci" data-input="sin(">sin</button>
          <button class="calc-sci" data-input="cos(">cos</button>
          <button class="calc-sci" data-input="tan(">tan</button>
          <button class="calc-fn" data-action="del">DEL</button>
          
          <!-- Row 3 -->
          <button class="calc-sci" data-input="log(">log</button>
          <button class="calc-sci" data-input="ln(">ln</button>
          <button class="calc-sci" data-input="√(">√</button>
          <button class="calc-fn" data-action="ac">AC</button>
          
          <!-- Row 4 -->
          <button class="calc-num" data-input="7">7</button>
          <button class="calc-num" data-input="8">8</button>
          <button class="calc-num" data-input="9">9</button>
          <button class="calc-op" data-input="÷">÷</button>
          
          <!-- Row 5 -->
          <button class="calc-num" data-input="4">4</button>
          <button class="calc-num" data-input="5">5</button>
          <button class="calc-num" data-input="6">6</button>
          <button class="calc-op" data-input="×">×</button>          
          <!-- Row 6 -->
          <button class="calc-num" data-input="1">1</button>
          <button class="calc-num" data-input="2">2</button>
          <button class="calc-num" data-input="3">3</button>
          <button class="calc-op" data-input="-">−</button>
          
          <!-- Row 7 -->
          <button class="calc-sci" data-input="π">π</button>
          <button class="calc-num" data-input="0">0</button>
          <button class="calc-sci" data-input=".">.</button>
          <button class="calc-op" data-input="+">+</button>
          
          <!-- Row 8 -->
          <button class="calc-sci" data-input="^">x^y</button>
          <button class="calc-sci" data-action="neg">(-)</button>
          <button class="calc-sci" data-action="ans">ANS</button>
          <button class="calc-eq" data-action="eq">=</button>
          
          <!-- Row 9 -->
          <button class="calc-mem" data-action="mc">MC</button>
          <button class="calc-mem" data-action="mr">MR</button>
          <button class="calc-mem" data-action="mplus">M+</button>
          <button class="calc-mem" data-action="mminus">M−</button>
        </div>
        <div class="calc-history" id="calc-history">
          <small>History:</small>
          <div id="calc-history-list"></div>
        </div>
      </div>
    `;
    this.bindEvents();
    this.updateDisplay();
  },
  bindEvents() {
    container = document.getElementById('tool-container');
    container.querySelectorAll('button[data-input]').forEach(btn => {
      btn.onclick = (e) => this.input(e.target.dataset.input);
    });
    container.querySelectorAll('button[data-action]').forEach(btn => {
      btn.onclick = (e) => this.action(e.target.dataset.action);
    });
    // Keyboard support
    document.onkeydown = (e) => {
      if (document.getElementById('tool-workspace')?.classList.contains('hidden')) return;
      const k = e.key;
      if (/[0-9.+\-*/()]/.test(k)) { e.preventDefault(); this.input(k === '*' ? '×' : k === '/' ? '÷' : k); }
      else if (k === 'Enter') { e.preventDefault(); this.action('eq'); }
      else if (k === 'Backspace') { e.preventDefault(); this.action('del'); }
      else if (k === 'Escape') { e.preventDefault(); this.action('ac'); }    };
  },
  input(val) {
    const s = this.state;
    if (s.display === '0' && /[0-9.]/.test(val)) s.display = val;
    else if (s.lastResult !== null && /[0-9.]/.test(val)) { s.display = val; s.lastResult = null; }
    else s.display += val;
    s.expression += val;
    this.updateDisplay();
  },
  action(act) {
    const s = this.state;
    switch(act) {
      case 'ac': s.display = '0'; s.expression = ''; s.lastResult = null; break;
      case 'del': 
        if (s.display.length > 1) s.display = s.display.slice(0, -1);
        else s.display = '0';
        if (s.expression) s.expression = s.expression.slice(0, -1);
        break;
      case 'eq':
        try {
          let expr = s.expression.replace(/×/g,'*').replace(/÷/g,'/').replace(/π/g,'Math.PI');
          expr = expr.replace(/sin\(/g, `Math.sin(${s.isDegree ? 'Math.PI/180*' : ''}`)
                     .replace(/cos\(/g, `Math.cos(${s.isDegree ? 'Math.PI/180*' : ''}`)
                     .replace(/tan\(/g, `Math.tan(${s.isDegree ? 'Math.PI/180*' : ''}`)
                     .replace(/log\(/g, 'Math.log10(')
                     .replace(/ln\(/g, 'Math.log(')
                     .replace(/√\(/g, 'Math.sqrt(')
                     .replace(/\^/g, '**');
          const result = Function('"use strict"; return (' + expr + ')')();
          s.lastResult = result;
          s.history.unshift(`${s.expression} = ${result}`);
          if (s.history.length > 10) s.history.pop();
          s.display = Number(result).toLocaleString('fullwide', {maximumFractionDigits:10});
          s.expression = String(result);
          this.updateHistory();
        } catch(e) { s.display = 'Error'; }
        break;
      case 'neg': s.display = s.display.startsWith('-') ? s.display.slice(1) : '-' + s.display; break;
      case 'ans': if (s.lastResult !== null) this.input(String(s.lastResult)); break;
      case 'mode': s.isDegree = !s.isDegree; document.getElementById('calc-mode').textContent = s.isDegree ? 'D' : 'R'; break;
      case 'mc': s.memory = 0; document.getElementById('calc-mem').classList.add('hidden'); break;
      case 'mr': this.input(String(s.memory)); break;
      case 'mplus': s.memory += parseFloat(s.display) || 0; document.getElementById('calc-mem').classList.remove('hidden'); break;
      case 'mminus': s.memory -= parseFloat(s.display) || 0; document.getElementById('calc-mem').classList.remove('hidden'); break;
      case 'on': this.action('ac'); break;
    }
    this.updateDisplay();
  },
  updateDisplay() {    document.getElementById('calc-main').textContent = this.state.display;
    document.getElementById('calc-expr').textContent = this.state.expression;
  },
  updateHistory() {
    const list = document.getElementById('calc-history-list');
    list.innerHTML = this.state.history.map(h => `<div class="hist-item">${h}</div>`).join('');
  }
};
