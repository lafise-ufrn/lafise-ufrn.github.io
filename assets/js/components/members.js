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

const memberLayoutAnimations = new WeakMap();

function getMemberLayoutElements(){

    return [

        ...document.querySelectorAll(`
            body[data-page="members"] .member-section h2,
            body[data-page="members"] .member-section > .row > *,
            body[data-page="members"] #content > hr,
            body[data-page="members"] #content > h2,
            body[data-page="members"] #collaboration-map
        `)

    ];

}

function captureMemberLayout(){

    return new Map(

        getMemberLayoutElements().map(element => [

            element,
            element.getBoundingClientRect()

        ])

    );

}

function animateMemberLayout(previousLayout){

    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    getMemberLayoutElements().forEach(element => {

        const previous = previousLayout.get(element);

        if(!previous) return;

        const current = element.getBoundingClientRect();
        const deltaX = previous.left - current.left;
        const deltaY = previous.top - current.top;

        if(Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) return;

        const runningAnimation = memberLayoutAnimations.get(element);

        if(runningAnimation){

            runningAnimation.cancel();
            memberLayoutAnimations.delete(element);

        }

        const animation = element.animate(

            [
                { transform:`translate(${deltaX}px, ${deltaY}px)` },
                { transform:"translate(0, 0)" }
            ],

            {
                duration:520,
                easing:"cubic-bezier(.22, 1, .36, 1)"
            }

        );

        memberLayoutAnimations.set(element, animation);

        animation.addEventListener("finish", () => {

            if(memberLayoutAnimations.get(element) === animation){

                memberLayoutAnimations.delete(element);
                animation.cancel();

            }

        }, { once:true });

    });

}

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

    const photo = card.querySelector(".member-photo");

    photo.tabIndex = 0;
    photo.setAttribute("role", "button");
    photo.setAttribute("aria-expanded", "false");
    photo.setAttribute("aria-label", `View profile for ${member.name}`);

    const toggleProfile = () => {

        const previousLayout = captureMemberLayout();
        const previousCardTop = card.getBoundingClientRect().top;
        const minimumCardTop = Math.min(96, window.innerHeight * 0.12);
        const maximumCardTop = Math.min(200, window.innerHeight * 0.25);
        const preferredCardTop = Math.min(

            Math.max(previousCardTop, minimumCardTop),
            maximumCardTop

        );

        const expanded = card.classList.toggle("expanded");
        const currentCardTop = card.getBoundingClientRect().top;
        const scrollCompensation = currentCardTop - preferredCardTop;

        if(Math.abs(scrollCompensation) >= 0.5){

            window.scrollBy(0, scrollCompensation);

        }

        photo.setAttribute("aria-expanded", String(expanded));

        requestAnimationFrame(() => animateMemberLayout(previousLayout));

    };

    photo.addEventListener("click", toggleProfile);

    photo.addEventListener("keydown", event => {

        if(event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();

        toggleProfile();

    });

    return card;

}
