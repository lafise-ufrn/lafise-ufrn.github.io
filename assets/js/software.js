const softwareImage = "assets/img/logos/lafise-work-in-progress.gif";

function escapeMarkup(value){

    return String(value ?? "").replace(/[&<>"']/g, character => ({

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"

    })[character]);

}

function createSoftwareCard(software){

    const repositoryLink = software.url
        ? `
            <a href="${escapeMarkup(software.url)}"
                class="software-card-link"
                target="_blank"
                rel="noopener noreferrer">
                View repository
            </a>
        `
        : "";

    return `
        <div class="software-grid-item">
            <article class="software-card">
                <div class="software-card-media">
                    <img
                        src="${softwareImage}"
                        class="software-card-image"
                        alt="Animated LAFISE logo: rat running in a wheel. Work in progress."
                        loading="lazy">
                </div>

                <div class="software-card-body">
                    <h2 class="software-card-title">${escapeMarkup(software.name)}</h2>
                    <p class="software-card-description">${escapeMarkup(software.description)}</p>
                    <span class="software-card-status">${escapeMarkup(software.status)}</span>
                    ${repositoryLink}
                </div>
            </article>
        </div>
    `;

}

export async function loadSoftware(){

    if(document.body.dataset.page !== "softwares") return;

    const container = document.getElementById("software-container");

    if(!container) return;

    try{

        const response = await fetch("data/software.json");

        if(!response.ok){

            throw new Error("Unable to load software data.");

        }

        const software = await response.json();

        container.className = "software-grid";
        container.innerHTML = software.map(createSoftwareCard).join("");

    }catch(error){

        console.error(error);

        container.innerHTML = "<p>Unable to load software information.</p>";

    }

}
