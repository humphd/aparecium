// https://dbrekalo.github.io/simpleLightbox/
const SimpleLightbox  = require('simple-lightbox');

// CSS
require('./styles.css');
require('../node_modules/simple-lightbox/dist/simpleLightbox.min.css');

const scormContentSelector = 'iframe#ScormContent';
const accessibleContentSelector = '.cp-accessibility';

// Wait on the ScormContent frame
require('arrive');
document.arrive(scormContentSelector, {fireOnAttributesModification: true}, function() {
  document.unbindArrive();
  addButton(this);
});

// Convert a <p> to a <span> and return outer HTML string
const pToSpanHTML = (p) => {
  const elem = document.createElement('span');
  elem.innerHTML = p.innerHTML;
  return elem.outerHTML;
};

// Text will be hidden in the DOM in <div>s with the cp-accessibility class
function findAccessible(doc) {
  const nodes = doc.querySelectorAll(accessibleContentSelector);
  if(!nodes) {
    return;
  }

  console.log('nodes', nodes);

  const accessibleElements = [];
  for(node of nodes) {
    // Remove navigation text nodes
    if(node.innerText.trim() === 'Skip to Main Content') continue;
    if(node.innerText.trim() === 'Trigger this button to go to the next slide') continue;
    if(node.innerText.trim() === 'Trigger this button to go to the previous slide') continue;
    if(node.innerText.trim() === 'Trigger this button to exit') continue;


    // Grab everything inside a DIV container
    if(node.nodeName === 'DIV') {
      accessibleElements.push(node.innerHTML);
    }
    // Turn <p> into <span> so we connect text that's actually meant to be a single paragraph.
    else if(node.nodeName === 'P') {
      accessibleElements.push(pToSpanHTML(node));
    }
    // Use the accessible node itself, (e.g., <a>)
    else {
      accessibleElements.push(node.outerHTML);
    }
  }

  return accessibleElements;
}

// Deal with End-Of-Text (ETX, 0x03), which seems to signal the start of a bullet
const cleanETX = elem => elem.replace(/\x03\s*/g, '<br>');
// Ignore things like <p> </p>
const cleanEmpty = elem => elem.replace(/^<[^>]+>\s+<\/[^>]+>$/, '');

function wrapDiv(div) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('aparecium-wrapper');
  wrapper.appendChild(div);
  return wrapper;
}

function addButton(frame) {
  const button = document.createElement('button');
  button.id = 'aparecium-button';
  // Include Unicode Sparkles - https://graphemica.com/✨
  button.innerHTML = '&#10024; Aparecium';
  button.onclick = function() {
    const elems = findAccessible(frame.contentDocument);
    if(!elems) {
      return;
    }
     
    console.log('Aparecium', elems);

    const div = document.createElement('div');
    div.classList.add('aparecium-text');

    // Process and insert all relevant accessible text elements
    for(elem of elems) {
      // Deal with End-Of-Text (ETX, 0x03), which seems to signal the start of a bullet
      elem = cleanETX(elem);
      // Remove empty elements
      elem = cleanEmpty(elem);

      div.innerHTML += elem;
    }

    console.log('html', div.outerHTML);

    SimpleLightbox.open({
      content: wrapDiv(div).outerHTML,
      elementClass: 'slbContentEl'
    });
  };

  document.body.appendChild(button);
}
