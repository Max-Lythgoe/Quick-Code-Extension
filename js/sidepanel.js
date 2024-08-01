import { codeSnippets as initialCodeSnippets } from "./code-snippets.js";
const newSnippetForm = document.getElementById('add-snippet');
const searchBar = document.querySelector('.search-bar');

// Load code snippets from local storage
function loadSnippets() {
  const storedSnippets = localStorage.getItem('codeSnippets');
  return storedSnippets ? JSON.parse(storedSnippets) : initialCodeSnippets;
}

// Save code snippets to local storage
function saveSnippets(snippets) {
  localStorage.setItem('codeSnippets', JSON.stringify(snippets));
}

// Load the next ID counter from local storage
function loadNextId() {
  const storedNextId = localStorage.getItem('nextId');
  return storedNextId ? parseInt(storedNextId, 10) : initialCodeSnippets.length + 1;
}

// Save the next ID counter to local storage
function saveNextId(nextId) {
  localStorage.setItem('nextId', nextId);
}

// Initialize code snippets and next ID counter
let codeSnippets = loadSnippets();
let nextId = loadNextId();

// Create codeboxes for snippets 
function getCodeBoxesHtml(codeArray) {
  if (Array.isArray(codeArray)) {

    // Sort the array so that items with isFavorite true come first
    codeArray.sort((a, b) => b.isFavorite - a.isFavorite);

    return codeArray
      .map(function ({ id, title, codeCopy, isFavorite }, index) {
        return `
    <div id="code-box-${id}" class="code-box ${isFavorite}" style="animation-delay: .${index}s">
    <div id="code-inner-${id}">
      <div class="code-title-section">
        <p class="code-title">${title}</p>
      </div>
      <div class="code-snippet-container"><pre class="code-snippet">${escapeHtml(codeCopy)}</pre></div>
      <div class="copied-overlay">Copied!</div>
      </div>
    
    <div class="btns-container">
        <button id="fav-btn-${id}" class="fav-btn">❤</button>
        <button id="delete-btn-toggle-${id}" class="delete-btn">✖</button>
    </div>
    
    </div> 
    <div id="delete-btn-modal-${id}" class="delete-modal-closed delete-modal">
    <div class="modal-box">
          <p>Are you sure you want to delete <strong>${title}</strong>?</p>
          <div class="delete-modal-btns">
            <button id="cancel-delete-btn-${id}" class="cancel-delete-btn-in-modal">Cancel</button>
            <button id="delete-btn-${id}" class="delete-btn-in-modal">Delete</button>
          </div>
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
    id: nextId,
    title: snippetTitle,
    isFavorite: isFavorite,
    codeCopy: snippetCode
  };
  
  codeSnippets.push(newSnippet);
  
  // Save updated snippets to local storage
  saveSnippets(codeSnippets);
  
  // Increment and save the next ID counter
  nextId++;
  saveNextId(nextId);
  
  callAll()

  // reset fields after submission
  newSnippetForm.reset();
  
});

// call all snippets and add functionality
function callAll(filteredSnippets = codeSnippets) {
  // Update the HTML
  document.getElementById("container").innerHTML = getCodeBoxesHtml(filteredSnippets);
  
  // Add event listener for the new snippet
  filteredSnippets.forEach(({ id, codeCopy }) => {
      const element = document.getElementById(`code-inner-${id}`);
      const deleteBtn = document.getElementById(`delete-btn-${id}`);
      const deleteBtnToggle = document.getElementById(`delete-btn-toggle-${id}`);
      const deleteBtnModal = document.getElementById(`delete-btn-modal-${id}`);
      const cancelDeleteBtn = document.getElementById(`cancel-delete-btn-${id}`);
      const favBtn = document.getElementById(`fav-btn-${id}`);

      element.addEventListener('click', function() { 
        copyCode(codeCopy);
    
        element.parentElement.classList.add('copied');
    
        setTimeout(() => {
            element.parentElement.classList.remove('copied');
        }, 3000);
    });

      favBtn.addEventListener('click', function() {
        // Find the actual snippet by id
        const snippet = codeSnippets.find(snippet => snippet.id === id);
        
        // Toggle the isFavorite property
        snippet.isFavorite = !snippet.isFavorite;
        
        // Save updated snippets to local storage
        saveSnippets(codeSnippets);
        
        // Update the HTML
        callAll();
      });

      deleteBtnToggle.addEventListener('click', function() {
        // Toggle the modal class
        deleteBtnModal.classList.toggle('delete-modal-closed');
        deleteBtnModal.classList.toggle('delete-modal-open');
      });

      cancelDeleteBtn.addEventListener('click', function() {
        // Close the modal
        deleteBtnModal.classList.add('delete-modal-closed');
        deleteBtnModal.classList.remove('delete-modal-open');
      });

      deleteBtn.addEventListener('click', function() {
        // Find the actual index in the codeSnippets array
        const actualIndex = codeSnippets.findIndex(snippet => snippet.id === id);
        
        // Remove the snippet from the array
        codeSnippets.splice(actualIndex, 1);
        
        // Save updated snippets to local storage
        saveSnippets(codeSnippets);
        
        // Update the HTML
        callAll();
      });
  });

  // Check for all instances of .code-title and wrap in <marquee> if width exceeds 210px
  document.querySelectorAll('.code-title').forEach(function(codeTitle) {
    if (codeTitle.offsetWidth > 210) {
      const marqueeHTML = `<marquee>${codeTitle.innerHTML}</marquee>`;
      codeTitle.insertAdjacentHTML('beforebegin', marqueeHTML);
      codeTitle.remove();
    }
  });
}

// Add search functionality
searchBar.addEventListener('input', function(e) {
  const searchQuery = e.target.value.toLowerCase();
  const filteredSnippets = codeSnippets.filter(snippet => 
    snippet.title.toLowerCase().includes(searchQuery) || 
    snippet.codeCopy.toLowerCase().includes(searchQuery)
  );
  callAll(filteredSnippets);
});
