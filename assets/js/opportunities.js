const sections = [

    {
        id: "phd",
        kicker: "Graduate training",
        title: "PhD pathways",
        description: "Doctoral researchers may connect with LaFiSE through either of two UFRN graduate programs, depending on the emphasis of the proposed project.",
        grid: "two"
    },

    {
        id: "masters",
        kicker: "Graduate training",
        title: "Master's pathways",
        description: "Master's projects combine focused research questions with hands-on training in experimental design, data collection, analysis, and scientific communication.",
        grid: "two"
    },

    {
        id: "undergraduate",
        kicker: "Early research experience",
        title: "Undergraduate research",
        description: "Undergraduate students can take their first steps in research while contributing to active laboratory projects.",
        grid: "two"
    },

    {
        id: "lab-access",
        kicker: "Shared infrastructure",
        title: "Equipment and research tools",
        description: "Researchers and partner groups may contact LaFiSE to discuss collaborative access, technical feasibility, training requirements, and scheduling.",
        grid: "three"
    }

];

export async function initializeOpportunities(){

    if(document.body.dataset.page !== "opportunities") return;

    const response = await fetch("data/opportunities.json");
    
    const opportunities = await response.json();

    const container = document.getElementById("opportunities-container");

    if(!container) return;

    container.innerHTML = "";

    // ===============================
    // Navigation
    // ===============================

    const nav = document.createElement("nav");

    nav.className = "opportunities-jump";
    nav.setAttribute("aria-label","Opportunity categories");

    nav.innerHTML = sections.map(section => `

        <a href="#${section.id}">

            ${section.title.replace(" pathways","")}

        </a>

    `).join("");

    container.appendChild(nav);

    // ===============================
    // Sections
    // ===============================

    sections.forEach(section=>{

        const cards = opportunities.filter(item=>

            item.category===section.id &&
            (item.status==="active" || item.status==="available")

        );

        container.appendChild(

            createSection(section,cards)

        );

    });

    // ===============================
    // Contact
    // ===============================

    container.appendChild(

        createContact()

    );

}

function createSection(section,cards){

    const element=document.createElement("section");

    element.className="opportunity-section";

    element.id=section.id;

    element.innerHTML=`

        <div class="opportunity-section-heading">

            <div>

                <p class="opportunity-section-kicker">

                    ${section.kicker}

                </p>

                <h2>

                    ${section.title}

                </h2>

                <p>

                    ${section.description}

                </p>

            </div>

        </div>

        <div class="opportunity-grid opportunity-grid-${section.grid}">

        </div>

    `;

    const grid=element.querySelector(".opportunity-grid");

    cards.forEach((item,index)=>{

        grid.appendChild(

            createCard(item,index)

        );

    });

    return element;

}

function createCard(item,index){

    const card=document.createElement("article");

    card.className=`opportunity-card opportunity-card-${item.type}`;

    switch(item.type){

        case "program":

            card.innerHTML=`

                <div class="opportunity-card-topline">

                    <span>${item.institution}</span>

                    <span>PhD</span>

                </div>

                <h3>${item.title}</h3>

                <p>${item.description}</p>

                <ul class="opportunity-tags" aria-label="Research areas">

                    ${item.areas.map(area=>`<li>${area}</li>`).join("")}

                </ul>

                ${createButton(item)}

            `;

            break;

        case "compact":

            card.innerHTML=`

                <span class="opportunity-card-label">

                    ${item.label}

                </span>

                <h3>${item.title}</h3>

                <p>${item.description}</p>

                ${createButton(item)}

            `;

            break;

        case "resource":

            card.innerHTML=`

                <span class="opportunity-resource-mark" aria-hidden="true">

                    ${String.fromCharCode(65+index)}

                </span>

                <h3>${item.title}</h3>

                <p>${item.description}</p>

                ${createButton(item)}

            `;

            break;

    }

    return card;

}

function createButton(item){

    if(!item.url) return "";

    return `

        <a

            class="opportunity-link"

            href="${item.url}"

            target="_blank"

            rel="noopener noreferrer">

            ${item.button}

            <span aria-hidden="true">&rarr;</span>

        </a>

    `;

}

function createContact(){

    const aside=document.createElement("aside");

    aside.className="opportunities-contact";

    aside.setAttribute("aria-labelledby","opportunities-contact-title");

    aside.innerHTML=`

        <div>

            <p class="opportunity-section-kicker">

                Start a conversation

            </p>

            <h2 id="opportunities-contact-title">

                Tell us how you would like to work with LaFiSE.

            </h2>

            <p>

                Introduce yourself, your background, the opportunity you are interested in, and the research question or resource you would like to explore.

            </p>

        </div>

        <a

            class="opportunities-contact-link"

            href="mailto:lafiseufrn@gmail.com?subject=LaFiSE%20opportunity%20inquiry">

            Contact the laboratory

            <span aria-hidden="true">&rarr;</span>

        </a>

    `;

    return aside;

}