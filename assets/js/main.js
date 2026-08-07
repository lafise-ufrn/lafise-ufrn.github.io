import { loadFragment } from "./components/loader.js";
import { loadMarkdown } from "./components/markdown.js";
import { initializeVisit } from "./components/visit.js";
import { initializeHeader } from "./components/header.js";
import { initializeCollaborationMap } from "./components/collab_maps.js";
import { initializePublications } from "./publications.js";

import { loadMembers } from "./members.js";
import { loadSoftware } from "./software.js";
import { loadOpportunities } from "./opportunities.js";

document.addEventListener("DOMContentLoaded", async () => {

    await loadFragment("header", "fragments/header.html");

    initializeHeader();

    await loadFragment("navbar", "fragments/navbar.html");

    await loadMarkdown(
        "content",
        `content/${document.body.dataset.page}.md`
    );

    await loadFragment("footer", "fragments/footer.html");

    initializeVisit();

    await loadMembers();

    await loadSoftware();

    await loadOpportunities();

    initializeCollaborationMap();

    initializePublications();
});
