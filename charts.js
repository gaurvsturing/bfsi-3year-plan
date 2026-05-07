/* =========================================================
   Shared chart helpers (SVG, native — no libs)
   ========================================================= */
window.CHARTS = (function () {
  const svgNS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs = {}, parent) {
    const node = document.createElementNS(svgNS, tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  // Tooltip
  const tip = document.getElementById('tooltip');
  function showTip(html, x, y) {
    tip.innerHTML = html;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
    tip.classList.add('show');
  }
  function hideTip() { tip.classList.remove('show'); }

  // Position tooltip relative to a target svg point in deck/page coords
  function tipFromMouse(ev, html) {
    showTip(html, ev.clientX, ev.clientY - 4);
  }

  // Build a fresh full-size SVG inside container.
  // preserveAspect: false = stretch to fill (good for X-axis charts where bar widths can scale);
  //                 true  = preserveAspectRatio "xMidYMid meet" (text/labels stay readable).
  function makeSvg(container, width, height, preserveAspect) {
    clear(container);
    const svg = el('svg', {
      xmlns: svgNS,
      viewBox: `0 0 ${width} ${height}`,
      width: '100%', height: '100%',
      preserveAspectRatio: preserveAspect ? 'xMidYMid meet' : 'none'
    });
    container.appendChild(svg);
    return svg;
  }

  function fmtMoney(v) {
    if (v == null) return '—';
    if (Math.abs(v) >= 100) return '$' + v.toFixed(0) + 'M';
    if (Math.abs(v) >= 10) return '$' + v.toFixed(1) + 'M';
    return '$' + v.toFixed(2) + 'M';
  }
  function fmtNum(v) { return v == null ? '—' : v.toLocaleString(); }

  return { el, clear, makeSvg, showTip, hideTip, tipFromMouse, fmtMoney, fmtNum };
})();
