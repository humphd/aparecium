const elems = document.querySelectorAll('h2');
console.log({elems})

if(elems && elems.length) {

  const text = (Array.from(elems)).reduce((acc, elem) => acc + elem.innerHTML, '');
  
  console.log({text});
  chrome.runtime.sendMessage({text}, function(response) {
    if(response) {
      console.log(response.farewell);
    }
  });
}
