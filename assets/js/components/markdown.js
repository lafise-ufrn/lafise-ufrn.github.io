export async function loadMarkdown(id, file) {

    try {

        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Failed to load: ${file}`);
        }

        const markdown = await response.text();

        document.getElementById(id).innerHTML = marked.parse(markdown);

    } catch (error) {

        console.error(error);

        document.getElementById(id).innerHTML =
            "<p>Unable to load page content.</p>";

    }

}