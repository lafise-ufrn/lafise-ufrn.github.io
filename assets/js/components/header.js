const subtitles = {
    home: "Department of Physiology • UFRN",
    members: "Laboratory Members",
    publications: "Scientific Publications",
    software: "Open Source Software",
    opportunities: "Join Our Team"
};

export function initializeHeader() {

    const page = document.body.dataset.page;

    const subtitle = document.getElementById("hero-subtitle");

    if (subtitle) {
        subtitle.textContent = subtitles[page] || "";
    }

}