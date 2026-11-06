/* V104 — customer-facing service cleanup */
(() => {
  'use strict';

  const replacement = 'Rough-In Wiring';
  const oldService = /starlink/ig;
  const newPage = 'services/rough-in-wiring.html';

  function update(root) {
    if (!root) return;

    const elements = [];
    if (root.nodeType === 1) elements.push(root);
    if (root.querySelectorAll) {
      elements.push(...root.querySelectorAll('*'));
    }

    for (const el of elements) {
      if (['SCRIPT','STYLE','NOSCRIPT'].includes(el.tagName)) continue;

      // Correct old links without changing other services.
      if (el.hasAttribute('href')) {
        const href = el.getAttribute('href');
        if (/starlink/i.test(href)) {
          el.setAttribute('href',
            href.replace(/(?:services\/)?starlink\.html/ig,newPage)
                .replace(/starlink/ig,'rough-in-wiring'));
        }
      }

      for (const attr of ['aria-label','title','alt','placeholder']) {
        const value = el.getAttribute(attr);
        if (value && oldService.test(value)) {
          el.setAttribute(attr,value.replace(/starlink/ig,replacement));
        }
        oldService.lastIndex = 0;
      }
    }

    const walker = document.createTreeWalker(
      root, NodeFilter.SHOW_TEXT
    );

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    for (const node of nodes) {
      const parent = node.parentElement;
      if (!parent ||
          ['SCRIPT','STYLE','NOSCRIPT'].includes(parent.tagName)) continue;

      if (/starlink/i.test(node.nodeValue)) {
        node.nodeValue =
          node.nodeValue.replace(/starlink/ig,replacement);
      }
    }
  }

  function run() {
    update(document.body);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',run,{once:true});
  } else {
    run();
  }

  // Older V100 tools create content dynamically.
  // Watch for newly inserted interactive elements.
  const observer = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType === 1) update(node);
      }
      if (record.type === 'characterData' &&
          /starlink/i.test(record.target.nodeValue || '')) {
        record.target.nodeValue =
          record.target.nodeValue.replace(/starlink/ig,replacement);
      }
    }
  });

  observer.observe(document.documentElement,{
    childList:true,
    subtree:true,
    characterData:true
  });
})();
