(() => {
  'use strict';

  function repair(root) {
    if (!root || !root.querySelectorAll) return;

    const nodes = [
      ...(root.nodeType === 1 ? [root] : []),
      ...root.querySelectorAll('*')
    ];

    for (const el of nodes) {
      if (['SCRIPT','STYLE','NOSCRIPT'].includes(el.tagName)) continue;

      if (el.hasAttribute('href')) {
        const href = el.getAttribute('href');
        if (/roughin/i.test(href)) {
          el.setAttribute(
            'href',
            href.replace(/(?:services\/)?roughin\.html/ig,
              match => match.startsWith('services/')
                ? 'services/rough-in-wiring.html'
                : 'rough-in-wiring.html')
              .replace(/roughin/ig,'rough-in-wiring')
          );
        }
      }

      for (const attr of ['aria-label','title','alt']) {
        const value = el.getAttribute(attr);
        if (value && /roughin/i.test(value)) {
          el.setAttribute(attr,
            value.replace(/roughin/ig,'Rough-In Wiring'));
        }
      }
    }

    const walker = document.createTreeWalker(
      root, NodeFilter.SHOW_TEXT
    );
    const texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);

    for (const node of texts) {
      if (['SCRIPT','STYLE','NOSCRIPT'].includes(
        node.parentElement?.tagName)) continue;

      if (/roughin/i.test(node.nodeValue)) {
        node.nodeValue = node.nodeValue.replace(
          /roughin/ig,'Rough-In Wiring'
        );
      }
    }
  }

  function run() {
    repair(document.body);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',run,{once:true});
  } else {
    run();
  }

  const observer = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType === 1) repair(node);
      }
    }
  });

  observer.observe(document.documentElement,{
    childList:true,
    subtree:true
  });
})();
