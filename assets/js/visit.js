export function initializeVisit() {

    const button = document.getElementById("copy-address");

    if (!button) return;

    button.addEventListener("click", copyAddress);

}

function copyAddress() {

    const address = `https://maps.app.goo.gl/rs3xzoDE5mh22q268`;

    navigator.clipboard.writeText(address)
        .then(() => {

            alert("Address copied to clipboard!");

        })
        .catch(() => {

            alert("Unable to copy the address.");

        });

}