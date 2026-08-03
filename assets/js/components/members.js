const roles = {

    pi: "Principal Investigator",

    phd: "PhD Student",

    masters: "Master's Student",

    undergraduate: "Undergraduate Student"

};

const memberSections = [

    {
        id: "pi",
        title: "Principal Investigator"
    },

    {
        id: "phd",
        title: "PhD Students"
    },

    {
        id: "masters",
        title: "Master's Students"
    },

    {
        id: "undergraduate",
        title: "Undergraduate Students"
    }

];

export async function loadMembers(){

    if(document.body.dataset.page !== "members") return;

    const response = await fetch("data/members.json");

    const members = await response.json();

    const container = document.getElementById("members-container");

    if(!container) return;

    container.innerHTML = "";

    // ===============================
    // Current Members
    // ===============================

    memberSections.forEach(section=>{

        const group = members.filter(member=>

            member.role===section.id &&
            member.status==="active"

        );

        if(group.length===0) return;

        container.appendChild(

            createSection(section.title,group)

        );

    });

    // ===============================
    // Alumni
    // ===============================

    const alumni = members.filter(member=>

        member.status!=="active"

    );

    if(alumni.length>0){

        container.appendChild(

            createSection("Alumni",alumni)

        );

    }

}

function createSection(title, members){

    const section = document.createElement("section");

    section.className = "member-section";

    section.innerHTML = `<h2>${title}</h2>`;

    const row = document.createElement("div");

    row.className = "row justify-content-center g-4";

    members.forEach(member => {

        const col = document.createElement("div");

        col.className = "col-xl-3 col-lg-4 col-md-6 col-sm-6";

        col.appendChild(createCard(member));

        row.appendChild(col);

    });

    section.appendChild(row);

    return section;

}

function createCard(member){

    const card=document.createElement("div");

    card.className = "card member-card";

    // ===============================
    // Research
    // ===============================

    const research=

        member.research && member.research.length

            ? member.research

                .map(topic=>`<li>${topic}</li>`)

                .join("")

            : "<li>Not informed</li>";

    // ===============================
    // Formation
    // ===============================

    const formation = member.formation
        ? [
            member.formation.bachelor
                ? `<strong>BSc:</strong> ${member.formation.bachelor}`
                : "",

            member.formation.masters
                ? `<strong>MSc:</strong> ${member.formation.masters}`
                : "",

            member.formation.phd
                ? `<strong>PhD:</strong> ${member.formation.phd}`
                : ""
        ].join("<br>")
        : "Not informed";

    // ===============================

    card.innerHTML=`

        <img

            src="${member.photo}"

            alt="${member.name}"

            class="member-photo">

        <div class="card-body">

            <h5>${member.name}</h5>

            <p class="member-formation">

                ${formation}

            </p>

            <div class="member-extra">

                ${
                    member.status !== "active"
                        ? `
                        <h6>Last Position</h6>
                        <p>${roles[member.role]}</p>
                        `
                        : ""
                }

                <h6>Research Interests</h6>

                <ul>

                    ${research}

                </ul>

                <div class="member-links">

                    ${
                        member.lattes
                            ? `<a href="${member.lattes}"
                                target="_blank"
                                class="btn btn-outline-success btn-sm">
                                Lattes
                            </a>`
                            : ""
                    }

                    ${
                        member.orcid
                            ? `<a href="${member.orcid}"
                                target="_blank"
                                class="btn btn-outline-success btn-sm">
                                ORCID
                            </a>`
                            : ""
                    }

                </div>

            </div>

        </div>

    `;

    // ===============================
    // Expand card
    // ===============================

    card.querySelector(".member-photo").addEventListener("click", () => {

        card.classList.toggle("expanded");

    });

    return card;

}