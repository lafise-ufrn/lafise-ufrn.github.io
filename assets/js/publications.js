export async function initializePublications() {
    if (document.body.dataset.page !== "publications") return;

    const container = document.getElementById("publications-container");
    if (!container) return;

    const response = await fetch("data/publications.json");
    let publications = await response.json();

    publications = publications.filter(pub => {
        return (
            pub.year &&
            pub.journal &&
            pub.journal.trim() !== ""
        );
    });

    // Ordena por ano e citações
    publications.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.citations - a.citations;
    });

    // Agrupa por ano
    const grouped = publications.reduce((acc, pub) => {
        if (!acc[pub.year]) acc[pub.year] = [];
        acc[pub.year].push(pub);
        return acc;
    }, {});

    const years = Object.keys(grouped)
        .map(Number)
        .sort((a, b) => b - a);

    let html = "";

    years.forEach(year => {
        html += `<h2 class="publication-year">${year}</h2>`;

        grouped[year].forEach(paper => {
            const authorsText = paper.authors ? paper.authors.replace(/ and /g, "; ") : "";
            const citationsText = paper.citations > 0 ? ` &bull; ${paper.citations} citations` : "";

            // Conteúdo interno do card
            const cardContent = `
                <article class="publication">
                    <h3>${paper.title}</h3>
                    <p>${authorsText}</p>
                    <p>
                        <em>${paper.journal}</em>${citationsText}
                    </p>
                </article>
            `;

            // Se tiver URL, envolve a moldura toda no link com a tag <a>
            if (paper.url) {
                html += `
                    <a href="${paper.url}" target="_blank" rel="noopener noreferrer" class="publication-card-link">
                        ${cardContent}
                    </a>
                `;
            } else {
                html += cardContent;
            }
        });
    });

    container.innerHTML = html;
}