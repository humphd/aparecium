const scormContentSelector = 'iframe#ScormContent';
const accessibleContentSelector = '.cp-accessibility';

// Text will be hidden in the DOM in <div>s with the cp-accessibility class
function findAccessible(doc) {
  const nodes = doc.querySelectorAll(accessibleContentSelector);
  if(!nodes) {
    return;
  }

  console.log('nodes', nodes);

  const accessibleElements = [];
  for(node of nodes) {
    // Remove "Skip to Main Content" node
    if(node.innerText === 'Skip to Main Content') continue;
    if(node.innerText === 'Trigger this button to go to the next slide') continue;
    if(node.innerText === 'Trigger this button to go to the previous slide') continue;

    // Grab everything inside a DIV container
    if(node.nodeName === 'DIV') {
      accessibleElements.push(node.innerHTML);
    }
    // Use the accessible node itself, (e.g., <p> or <a>)
    else {
      // TODO: with given a bunch of <p> and <a> outside of a <div>, can I join them?
      accessibleElements.push(node.outerHTML);
    }
  }

  return accessibleElements;
}

// Deal with End-Of-Text (ETX, 0x03), which seems to signal the start of a bullet
const cleanETX = elem => elem.replace(/\x03\s*/g, '<br><li>');

function addButton(frame) {
  const button = document.createElement('button');
  button.id = 'aparecium-button';
  button.innerHTML = 'Aparecium';
  button.onclick = function() {
    const elems = findAccessible(frame.contentDocument);
    if(elems) {
      console.log('Aparecium', elems);

      // Inject in DOM for testing
      let div = document.querySelector('#aparecium-text');
      if(!div) {
        div = document.createElement('div');
        div.id = 'aparecium-text';
        document.body.append(div);
      }

      // Clear from previous attempt
      div.innerHTML = '';

      // Process and insert all relevant accessible text elements
      for(elem of elems) {
        // Deal with End-Of-Text (ETX, 0x03), which seems to signal the start of a bullet
        elem = cleanETX(elem);

        div.innerHTML += elem;
      }

      div.scrollIntoView();
    }
  };
  document.body.appendChild(button);
}

// TODO: switch to npm and parcel to build this - https://github.com/uzairfarooq/arrive
// Wait on the ScormContent frame
document.arrive(scormContentSelector, {fireOnAttributesModification: true}, function() {
  document.unbindArrive();
  addButton(this);
});

window.addEventListener("moduleReadyEvent", function(evt) {
  console.log('moduleReadyEvent', evt);
});
