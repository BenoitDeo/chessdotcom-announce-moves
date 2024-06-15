// Function to convert chess figurines to spoken names
function figurineToName(figurine) {
  switch (figurine) {
    case 'N': return 'Knight';
    case 'B': return 'Bishop';
    case 'R': return 'Rook';
    case 'Q': return 'Queen';
    case 'K': return 'King';
    default: return '';
  }
}

// Function to announce the move
function announceMove(text) {
  const msg = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(msg);
}

function humanizeTextCodes(text) {
  const patterns = [
    // vowels
    { regex: /\a/gi, replace: 'A' },
    { regex: /\e/gi, replace: 'E' },
    // actions
    { regex: /\x/g, replace: ', takes ' },
    { regex: /O-O/gi, replace: 'Kingside castle' },
    { regex: /O-O-O/gi, replace: 'Queenside castle' },
    // pawn promote
    { regex: /=Q/g, replace: ', promote to Queen' },
    { regex: /=R/g, replace: ', promote to Rook' },
    { regex: /=B/g, replace: ', promote to Bishop' },
    { regex: /=N/g, replace: ', promote to Knight' },
    // check
    { regex: /\+/g, replace: ', check' },
    { regex: /\#/g, replace: ', checkmate' },
  ];

  patterns.forEach(({ regex, replace }) => {
    text = text.replace(regex, replace);
  });

  return text;
}

// Function to parse and announce the move
function parseAndAnnounceSpan(span) {
  let text = humanizeTextCodes(span.innerText.trim())

  const figurineSpan = span.querySelector('.icon-font-chess');

  if (figurineSpan) {
    const figurine = figurineSpan.getAttribute('data-figurine');
    const name = figurineToName(figurine);
    text = `${name} ${text}`;
  }

  announceMove(text);
}

// Function to check if a node is a move and announce it
function handleNewNode(node) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    const isWhiteMove = node.classList.contains('white-move') && node.classList.contains('main-line-ply');
    const isBlackMove = node.classList.contains('black-move') && node.classList.contains('main-line-ply');

    if (isWhiteMove || isBlackMove) {
      const span = node.querySelector('span.node-highlight-content');
      if (span) {
        parseAndAnnounceSpan(span);
      }
    }
  }
}

// Create a MutationObserver to monitor for new elements
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      handleNewNode(node);
    });
  });
});

// Start observing the document body for child list changes
observer.observe(document.body, { childList: true, subtree: true });
