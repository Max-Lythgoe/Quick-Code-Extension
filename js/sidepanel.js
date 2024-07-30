import { codeSnippets } from "./code-snippets.js";

console.log(codeSnippets)

function getCodeBoxesHtml(codeArray) {
  if (Array.isArray(codeArray)) {
    console.log(`Array is ${Array.isArray(codeArray)}`);

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

function copyCode(code) {
  navigator.clipboard.writeText(code); 
}

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
  
