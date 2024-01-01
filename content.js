function getElementsByXPath(xpath, parent) {
    let results = [];
    let query = document.evaluate(xpath, parent || document,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        results.push(query.snapshotItem(i));
    }
    return results;
}

chrome.runtime.onMessage.addListener((message) => {
    const mouseEvents = ['click', 'contextmenu', 'dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup']
    if (mouseEvents.indexOf(message.type) > -1) {
      const element = getElementsByXPath(message.target)[0];
      if(document.createEvent) {
        element.dispatchEvent(new MouseEvent(message.type, {
            bubbles: true,
            cancelable: true,
            view: window,
          }));
      } else {
        element.fireEvent('on'+message.type); 
      }
    } else if (message.type === "change") {
      const element = getElementsByXPath(message.target)[0];
      if (element) {
         element.value = message.value;
      } else {
           console.log("Element not found.", message.target);
      } 
    }
  });