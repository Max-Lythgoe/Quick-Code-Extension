import { codeSnippets } from "./code-snippets.js";
const newSnippetForm = document.getElementById('add-snippet')

// create codeboxes for snippets 
function getCodeBoxesHtml(codeArray) {
  if (Array.isArray(codeArray)) {
    console.log(`Array is ${Array.isArray(codeArray)}`);

    // Sort the array so that items with isFavorite true come first
    codeArray.sort((a, b) => b.isFavorite - a.isFavorite);

    return codeArray
      .map(function ({ title, codeCopy, isFavorite }, index) {
        return `
    <div id="code-box-${index}" class="code-box ${isFavorite}">
    <div class="code-title-section">
      <p class="code-title">${title}</p>
      <i class="fa-regular fa-star"></i>
      <i class="fa-solid fa-star"></i>
    </div>
    <div class="code-snippet-container"><pre class="code-snippet">${escapeHtml(codeCopy)}</pre></div>
    <div class="copied-overlay">Copied!</div>
    </div> 
    `;
      })
      .join("");
  } else {
    console.log("oops not an array");
  }
}


// properly display html
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


// click to copy code
function copyCode(code) {
  navigator.clipboard.writeText(code); 
}


// display snippets
document.getElementById("container").innerHTML = getCodeBoxesHtml(codeSnippets);

codeSnippets.forEach(({ codeCopy }, index) => {
    const element = document.getElementById(`code-box-${index}`);
    element.addEventListener('click', function() { 
      copyCode(codeCopy);

      element.classList.add('copied');
  
    setTimeout(() => {
      element.classList.remove('copied');
    }, 3000);
    });
  
    
  
});


// add new snippet  
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
  
  // Update the HTML
  document.getElementById("container").innerHTML = getCodeBoxesHtml(codeSnippets);
  
  // Add event listener for the new snippet
  const newElement = document.getElementById(`code-box-${codeSnippets.length - 1}`);
  newElement.addEventListener('click', function() { 
    copyCode(newSnippet.codeCopy);
    newElement.classList.add('copied');
    setTimeout(() => {
      newElement.classList.remove('copied');
    }, 3000);
  });
});

function favoriteCodeBox() {

}