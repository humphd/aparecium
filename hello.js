chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  debugger;
  console.log({request});
  if (request.text) {
    document.querySelector('#text').innerHTML = request.text;
  }
  sendResponse({farewell: "goodbye"});
  return true;
});
