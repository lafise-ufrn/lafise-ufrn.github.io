import { loadFragment } from "./loader.js";
import { loadMarkdown } from "./markdown.js";
import { initializeVisit } from "./visit.js";

import { initializeHeader } from "./components/header.js";
import { loadMembers } from "./components/members.js";

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

});