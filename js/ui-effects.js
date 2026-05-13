const UIEffects = {
  typeWriter(element, text, speed = 40) {
    let i = 0;
    element.classList.add('typing-cursor');
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        element.classList.remove('typing-cursor');
      }
    }
    type();
  },
  typewriterOutput(container, lines, speed = 12) {
    container.innerHTML = '';
    let lineIdx = 0, charIdx = 0;
    const cursor = document.createElement('span');
    cursor.style.animation = 'blink 1s step-end infinite';
    cursor.textContent = '_';
    cursor.style.color = 'var(--neon-green)';
    cursor.style.position = 'relative';
    cursor.style.top = '-2px';

    function type() {
      if (lineIdx < lines.length) {
        let lineEl = container.querySelector(`.line-${lineIdx}`);
        if (!lineEl) {
          lineEl = document.createElement('div');
          lineEl.className = `line-${lineIdx}`;
          container.appendChild(lineEl);
        }
        if (charIdx < lines[lineIdx].length) {
          lineEl.textContent += lines[lineIdx][charIdx];
          charIdx++;
          setTimeout(type, speed);
        } else {
          lineIdx++;
          charIdx = 0;
          setTimeout(type, speed);
        }
      } else {
        container.appendChild(cursor);
      }
    }
    type();
  },
  setupCopyButton(outputEl) {
    if (outputEl.querySelector('.copy-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = '📋 Copy';
    btn.onclick = () => {
      navigator.clipboard.writeText(outputEl.innerText.replace('_', '')).then(() => {
        btn.textContent = '✅ Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = '📋 Copy'; btn.classList.remove('copied'); }, 1500);
      });
    };
    outputEl.style.position = 'relative';
    outputEl.appendChild(btn);
  },
  loadTheme() {
    const saved = localStorage.getItem('ukn0wn_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
  },
  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ukn0wn_theme', next);
  }
};
