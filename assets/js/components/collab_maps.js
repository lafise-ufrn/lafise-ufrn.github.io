export async function initializeCollaborationMap() {

    // Executa somente na página Members
    if (document.body.dataset.page !== "members") return;

    const mapContainer = document.getElementById("collaboration-map");

    if (!mapContainer) return;

    // Carrega as instituições
    const response = await fetch("data/collaborators.json");
    const institutions = await response.json();

    const bounds = L.latLngBounds(
        [-90, -180],
        [90, 180]
    );

    const map = L.map("collaboration-map", {
        center: [15, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 18,
        worldCopyJump: false,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0
    });

    L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
            attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
            noWrap: true
        }
    ).addTo(map);

    map.fitBounds(bounds);
    map.setMinZoom(map.getZoom());

    // Adiciona um marcador para cada instituição
    institutions.forEach(institution => {

        const isHome = institution.labs.some(lab => lab.is_home_lab);

        if (isHome) {

            L.circleMarker([institution.lat, institution.lng], {
                radius: 14,
                color: "#8000ff",
                fillColor: "#8000ff",
                fillOpacity: 0.35,
                weight: 2
            }).addTo(map);

        }

        const marker = L.marker([institution.lat, institution.lng]).addTo(map);

        const labsHtml = institution.labs.map(lab => {

            const labName = lab.Website
                ? `<a href="${lab.Website}" target="_blank">${lab.name}</a>`
                : lab.name;

            return `
                <p>
                    <strong>${labName}</strong><br>
                    ${lab.collaborator}
                </p>
            `;

        }).join("");

        // Popup
        marker.bindPopup(`
            <h5>${institution.institution}</h5>

            <strong>${institution.city}, ${institution.country}</strong>

            <hr>

            ${labsHtml}
        `);

    });

}