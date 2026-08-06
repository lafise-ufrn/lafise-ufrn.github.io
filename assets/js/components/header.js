const subtitles = {
    home: "UFRN",
    members: "Laboratory Members",
    publications: "Scientific Publications",
    softwares: "New Tools",
    opportunities: "Join Our Team"
};

export function initializeHeader() {

    const page = document.body.dataset.page;

    const subtitle = document.getElementById("hero-subtitle");

    if (subtitle) {
        subtitle.textContent = subtitles[page] || "";
    }

}