function escapeMarkup(value){

    return String(value ?? "").replace(/[&<>"']/g, character => ({

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"

    })[character]);

}

function createOpportunityLink(link, className, openInNewTab = true){

    if(!link) return "";

    const externalAttributes = openInNewTab
        ? 'target="_blank" rel="noopener noreferrer"'
        : "";

    return `
        <a class="${className}"
            href="${escapeMarkup(link.url)}"
            ${externalAttributes}>
            ${escapeMarkup(link.label)} <span aria-hidden="true">&rarr;</span>
        </a>
    `;

}

function createOpportunityCard(card){

    const variants = {

        program: "opportunity-card-program",
        compact: "opportunity-card-compact",
        resource: "opportunity-card-resource"

    };

    const topline = card.topline?.length
        ? `
            <div class="opportunity-card-topline">
                ${card.topline.map(item => `<span>${escapeMarkup(item)}</span>`).join("")}
            </div>
        `
        : "";

    const label = card.label
        ? `<span class="opportunity-card-label">${escapeMarkup(card.label)}</span>`
        : "";

    const mark = card.mark
        ? `<span class="opportunity-resource-mark" aria-hidden="true">${escapeMarkup(card.mark)}</span>`
        : "";

    const tags = card.tags?.length
        ? `
            <ul class="opportunity-tags" aria-label="Research areas">
                ${card.tags.map(tag => `<li>${escapeMarkup(tag)}</li>`).join("")}
            </ul>
        `
        : "";

    return `
        <article class="opportunity-card ${variants[card.variant] ?? ""}">
            ${topline}
            ${label}
            ${mark}
            <h3>${escapeMarkup(card.title)}</h3>
            <p>${escapeMarkup(card.description)}</p>
            ${tags}
            ${createOpportunityLink(card.link, "opportunity-link")}
        </article>
    `;

}

function createOpportunitySection(section){

    const gridClass = section.columns === 3
        ? "opportunity-grid-three"
        : "opportunity-grid-two";

    return `
        <section class="opportunity-section" id="${escapeMarkup(section.id)}">
            <div class="opportunity-section-heading">
                <div>
                    <p class="opportunity-section-kicker">${escapeMarkup(section.kicker)}</p>
                    <h2>${escapeMarkup(section.title)}</h2>
                    <p>${escapeMarkup(section.description)}</p>
                </div>
            </div>

            <div class="opportunity-grid ${gridClass}">
                ${section.cards.map(createOpportunityCard).join("")}
            </div>
        </section>
    `;

}

function createOpportunitiesIntro(data, heading){

    const intro = document.createElement("div");
    const eyebrow = document.createElement("span");
    const lead = document.createElement("p");
    const description = document.createElement("p");

    intro.className = "opportunities-intro";

    eyebrow.className = "opportunities-eyebrow";
    eyebrow.textContent = data.eyebrow;

    lead.className = "opportunities-lead";
    lead.textContent = data.lead;

    description.textContent = data.description;

    intro.append(eyebrow, heading, lead, description);

    return intro;

}

export async function loadOpportunities(){

    if(document.body.dataset.page !== "opportunities") return;

    const container = document.getElementById("opportunities-container");

    if(!container) return;

    try{

        const response = await fetch("data/opportunities.json");

        if(!response.ok){

            throw new Error("Unable to load opportunities data.");

        }

        const opportunities = await response.json();
        const content = document.getElementById("content");
        const heading = content.querySelector(":scope > h1");

        if(!heading){

            throw new Error("Opportunities heading was not found.");

        }

        const intro = createOpportunitiesIntro(opportunities.intro, heading);
        const navigation = `
            <nav class="opportunities-jump" aria-label="Opportunity categories">
                ${opportunities.navigation.map(item => `
                    <a href="#${escapeMarkup(item.target)}">${escapeMarkup(item.label)}</a>
                `).join("")}
            </nav>
        `;

        const contact = `
            <aside class="opportunities-contact" aria-labelledby="opportunities-contact-title">
                <div>
                    <p class="opportunity-section-kicker">${escapeMarkup(opportunities.contact.kicker)}</p>
                    <h2 id="opportunities-contact-title">${escapeMarkup(opportunities.contact.title)}</h2>
                    <p>${escapeMarkup(opportunities.contact.description)}</p>
                </div>

                ${createOpportunityLink(opportunities.contact.link, "opportunities-contact-link", false)}
            </aside>
        `;

        const template = document.createElement("template");

        template.innerHTML = `
            ${navigation}
            ${opportunities.sections.map(createOpportunitySection).join("")}
            ${contact}
        `;

        content.insertBefore(intro, container);
        container.replaceWith(template.content);

    }catch(error){

        console.error(error);

        container.innerHTML = "<p>Unable to load opportunities information.</p>";

    }

}
