export async function initializePublications() {

    // Executa somente na página Publications
    if (document.body.dataset.page !== "publications") return;

    // Container onde as publicações serão inseridas
    const container = document.getElementById("publications-container");

    if (!container) return;

    // Carrega as publicações
    const response = await fetch("data/publications.json");
    let publications = await response.json();

    publications = publications.filter(pub => {

        return (
            pub.year &&
            pub.journal &&
            pub.journal.trim() !== ""
        );

    });

    // Ordena por ano e, dentro do mesmo ano, por número de citações
    publications.sort((a, b) => {

        if (a.year !== b.year)
            return b.year - a.year;

        return b.citations - a.citations;

    });

    // Agrupa por ano
    const grouped = publications.reduce((acc, pub) => {

        if (!acc[pub.year])
            acc[pub.year] = [];

        acc[pub.year].push(pub);

        return acc;

    }, {});

    // Ordena explicitamente os anos em ordem decrescente
    const years = Object.keys(grouped)
        .map(Number)
        .sort((a, b) => b - a);

    // Monta o HTML
    let html = "";

    years.forEach(year => {

        html += `<h2 class="publication-year">${year}</h2>`;

        grouped[year].forEach(paper => {

            html += `
                <article class="publication">

                    <h3>

                        ${
                            paper.url
                                ? `<a href="${paper.url}" target="_blank" rel="noopener noreferrer">
                                       ${paper.title}
                                   </a>`
                                : paper.title
                        }

                    </h3>

                    <p>
                        ${
                            paper.authors
                                ? paper.authors.replace(/ and /g, "; ")
                                : ""
                        }
                    </p>

                    <p>

                        <em>${paper.journal}</em>

                        ${
                            paper.citations > 0
                                ? ` &bull; ${paper.citations} citations`
                                : ""
                        }

                    </p>

                </article>
            `;

        });

    });

    // Insere na página
    container.innerHTML = html;

}