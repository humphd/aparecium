const scormContentSelector = 'iframe#ScormContent';
const accessibleContentSelector = '.cp-accessibility';

// Text will be hidden in the DOM in <div>s with the cp-accessibility class
function findAccessible(doc) {
  const nodes = doc.querySelectorAll(accessibleContentSelector);
  if(!nodes) {
    return;
  }

  // Grab the nodes' innerHTML, which is what we really want.
  return Array.from(nodes).map(node => node.innerHTML);
}

function addButton(frame) {
  const button = document.createElement('button');
  button.id = 'aparecium';
  button.innerHTML = 'Aparecium';
  button.onclick = function() {
    const elems = findAccessible(frame.contentDocument);
    if(elems) {
      console.log('Aparecium', elems);

      // Inject in DOM for testing
      const div = document.createElement('div');
      for(elem of elems) {
        // Deal with End-Of-Text (ETX, 0x03), which seems to signal the start of a bullet
        elem = elem.replace(/\x03\s*/g, '<br><li>');
        div.innerHTML += elem;
      }
      document.body.append(div);
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
