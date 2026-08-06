export async function loadAndRenderSoftwares(containerId = 'software-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch("data/softwares.json");
    
    // Tratamento caso o arquivo não seja encontrado
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    renderSoftwareGrid(data, container);
  } catch (error) {
    console.error('Error loading software list:', error);
  }
}

function renderSoftwareGrid(items, container) {
  container.innerHTML = items.map(item => `
    <div class="software-grid-item">
      <article class="software-card">
        <div class="software-card-media">
          <img src="${item.image}" class="software-card-image" alt="${item.title} logo" loading="lazy">
        </div>
        <div class="software-card-body">
          <h2 class="software-card-title">${item.title}</h2>
          <p class="software-card-description">${item.description}</p>
          <span class="software-card-status">${item.status}</span>
          ${item.repository ? `<a href="${item.repository}" class="software-card-link" target="_blank" rel="noopener noreferrer">View repository</a>` : ''}
        </div>
      </article>
    </div>
  `).join('');
}