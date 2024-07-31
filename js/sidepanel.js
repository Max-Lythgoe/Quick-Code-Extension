import { codeSnippets as initialCodeSnippets } from "./code-snippets.js";
const newSnippetForm = document.getElementById('add-snippet');

// Load code snippets from local storage
function loadSnippets() {
  const storedSnippets = localStorage.getItem('codeSnippets');
  return storedSnippets ? JSON.parse(storedSnippets) : initialCodeSnippets;
}

// Save code snippets to local storage
function saveSnippets(snippets) {
  localStorage.setItem('codeSnippets', JSON.stringify(snippets));
}

// Initialize code snippets
let codeSnippets = loadSnippets();

// Create codeboxes for snippets 
function getCodeBoxesHtml(codeArray) {
  if (Array.isArray(codeArray)) {
    console.log(`Array is ${Array.isArray(codeArray)}`);

    // Sort the array so that items with isFavorite true come first
    codeArray.sort((a, b) => b.isFavorite - a.isFavorite);

    return codeArray
      .map(function ({ title, codeCopy, isFavorite }, index) {
        return `
    <div id="code-box-${index}" class="code-box ${isFavorite}">
    <div id="code-inner-${index}">
      <div class="code-title-section">
        <p class="code-title">${title}</p>
      </div>
      <div class="code-snippet-container"><pre class="code-snippet">${escapeHtml(codeCopy)}</pre></div>
      <div class="copied-overlay">Copied!</div>
      </div>
    
    <div class="btns-container">
        <button id="fav-btn-${index}" class="fav-btn">❤</button>
        <button id="delete-btn-${index}" class="delete-btn">✖</button>
    </div>
    </div> 
    `;
      })
      .join("");
  } else {
    console.log("oops not an array");
  }
}

// Properly display HTML
function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Click to copy code
function copyCode(code) {
  navigator.clipboard.writeText(code); 
}

// Display snippets
callAll()

// Add new snippet  
newSnippetForm.addEventListener('submit', function(e){
  e.preventDefault();
  
  const snippetFormData = new FormData(newSnippetForm);
  const snippetTitle = snippetFormData.get('snippetTitle');
  const snippetCode = snippetFormData.get('snippetCode'); 
  const isFavorite = snippetFormData.get('isFavorite') === 'on';
  
  const newSnippet = {
    id: codeSnippets.length + 1,
    title: snippetTitle,
    isFavorite: isFavorite,
    codeCopy: snippetCode
  };
  
  codeSnippets.push(newSnippet);
  
  // Save updated snippets to local storage
  saveSnippets(codeSnippets);
  
  callAll()

  // reset fields after submission
newSnippetForm.reset();
  
});



// call all snippets and add copy functionality
function callAll() {
  // Update the HTML
  document.getElementById("container").innerHTML = getCodeBoxesHtml(codeSnippets);
  
  // Add event listener for the new snippet
  codeSnippets.forEach(({ codeCopy }, index) => {
      const element = document.getElementById(`code-inner-${index}`);
      const deleteBtn = document.getElementById(`delete-btn-${index}`);
      const favBtn = document.getElementById(`fav-btn-${index}`);

      element.addEventListener('click', function() { 
        copyCode(codeCopy);
    
        element.parentElement.classList.add('copied');
    
        setTimeout(() => {
            element.parentElement.classList.remove('copied');
        }, 3000);
    });
    

      favBtn.addEventListener('click', function() {
        // Toggle the isFavorite property
        codeSnippets[index].isFavorite = !codeSnippets[index].isFavorite;
        
        // Save updated snippets to local storage
        saveSnippets(codeSnippets);
        
        // Update the HTML
        callAll();
      });

      deleteBtn.addEventListener('click', function() {
        // Remove the snippet from the array
        codeSnippets.splice(index, 1);
        
        // Save updated snippets to local storage
        saveSnippets(codeSnippets);
        
        // Update the HTML
        callAll();
      });
  });
}


// favorite snippets

function favSnippets() {
  
}

