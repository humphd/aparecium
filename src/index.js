// https://dbrekalo.github.io/simpleLightbox/
const SimpleLightbox  = require('simple-lightbox');
// https://github.com/feross/clipboard-copy
const copy = require('clipboard-copy');

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
// Ignore `$$cpInfoCurrentSlide$$ of $$cpInfoSlideCount$$` text
const cleanSlideOfSlide = elem => elem.replace(/<p>\s*(\$\$.+\$\$)*\s*<\/p>/, '');
// Ignore Previous and Next
const cleanPreviousNext = elem => elem.replace(/<p>\s*(Previous|Next|Image)\s*<\/p>/, '');
// Ignore various navigation button labels
const cleanNavButtons = elem => elem.replace(/<p>\s*(Close|Submit|Suggested answer) button\s*<\/p>/, '');

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

    const containerDiv = document.createElement('div');

    /// Add copy all button
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = 'Copy All'
    copyBtn.classList.add('aparecium-copy-btn');
    containerDiv.appendChild(copyBtn);
    
    // Wrap all text in its own div for easy extraction
    const div = document.createElement('div');
    div.classList.add('aparecium-text');
    containerDiv.appendChild(div);

    // Process and insert all relevant accessible text elements
    for(elem of elems) {
      // Deal with End-Of-Text (ETX, 0x03), which seems to signal the start of a bullet
      elem = cleanETX(elem);
      // Remove empty elements
      elem = cleanEmpty(elem);
      // Remove "slide m of n"
      elem = cleanSlideOfSlide(elem);
      // Remove UI widgets like Previous, Next, Image, etc.
      elem = cleanPreviousNext(elem);
      // Remove nav button labels
      elem = cleanNavButtons(elem);

      div.innerHTML += elem;
    }

    console.log('html', div.outerHTML);

    // We need to wait for the lightbox to inject the HTML we need, which
    // includes the button for which we want to add an event listener.
    document.arrive('.aparecium-copy-btn', {fireOnAttributesModification: true}, function() {
      document.unbindArrive();

      document.querySelector('.aparecium-copy-btn').addEventListener('click', function(evt) {
        evt.preventDefault();
  
        const div = document.querySelector('.aparecium-text');
        if(!div) {
          console.log('Unable to copy text, no text div!');
          return false;
        }
      
        // Copy everything to the clipboard
        copy(div.innerText);
  
        // Let the user know it worked
        evt.target.innerHTML = 'Copied!';
        // Reset text in a few seconds
        setTimeout(function() {
          const btn = document.querySelector('.aparecium-copy-btn');
          if(btn) {
            btn.innerHTML = 'Copy All';
          }
        }, 2000);

        console.log('Copied to clipboard');
        return false;
      });
    });

    SimpleLightbox.open({
      content: wrapDiv(containerDiv).outerHTML,
      elementClass: 'slbContentEl'
    });
  };

  document.body.appendChild(button);
}
