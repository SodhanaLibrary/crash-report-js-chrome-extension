// popup.js

let gTracks = [];

function getElementsByXPath(xpath, parent) {
  let results = [];
  let query = document.evaluate(xpath, parent || document,
      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (let i = 0, length = query.snapshotLength; i < length; ++i) {
      results.push(query.snapshotItem(i));
  }
  return results;
}

function displayJSONTable(jsonArray) {
  const inputContainer = document.getElementById('inputContainer');
  const jsonTableContainer = document.getElementById('jsonTableContainer');
  const jsonTableBody = document.getElementById('jsonTableBody');

  // Clear previous table data
  jsonTableBody.innerHTML = '';

  // Populate the table with JSON data
  const mouseEvents = ['click', 'contextmenu', 'dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup']
  jsonArray.forEach(obj => {
      let action = '';
      if(mouseEvents.indexOf(obj.type) > -1 || obj.type === 'change') {
        action = `<button data-id="${obj.id}">${obj.type}</button>`;
      }
      const row = document.createElement('tr');
      row.innerHTML = `<td>${obj.type}</td><td>${obj.target || ''}</td><td>${obj.value || ''}</td><td>${action}</td>`;
      jsonTableBody.appendChild(row);
  });

  // Hide inputContainer, show jsonTableContainer and clear button
  inputContainer.style.display = 'none';
  jsonTableContainer.style.display = 'block';
  document.getElementById('clearBtn').style.display = 'block';
}

document.getElementById('clearButton').addEventListener('click', function () {
  const inputContainer = document.getElementById('inputContainer');
  const jsonTableContainer = document.getElementById('jsonTableContainer');
  const clearBtn = document.getElementById('clearBtn');

  // Show inputContainer, hide jsonTableContainer and clear button
  inputContainer.style.display = 'flex';
  jsonTableContainer.style.display = 'none';
  clearBtn.style.display = 'none';

  // Clear text area
  document.getElementById('jsonInput').value = '';
});

document.getElementById('submitButton').addEventListener('click', function () {
  const jsonInput = document.getElementById('jsonInput').value.trim();

  try {
      const jsonArray = JSON.parse(jsonInput);
      displayJSONTable(jsonArray);
      gTracks = jsonArray;
  } catch (error) {
      // alert('Invalid JSON input. Please enter valid JSON objects.');
  }    
});

document.getElementById('jsonTable').addEventListener('click', function (event) {  
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];
    if(event.target.attributes['data-id']) {
      const jsonInput = document.getElementById('jsonInput').value.trim();
      const jsonArray = JSON.parse(jsonInput);
      const fTrack = jsonArray.find(track => 
        parseInt(event.target.attributes['data-id'].value) === track.id
      );
      chrome.tabs.sendMessage(currentTab.id, fTrack);
    }
  });
});