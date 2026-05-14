// File paths mapped by unit index and type
const units = [
    {
        full: "Unit 1/Unit_1_10_and_5_Mark_Answers.md",
        quick: "Unit 1/Unit_1_Most_Likely.md"
    },
    {
        full: "Unit 2/Unit_2_10_and_5_Mark_Answers.md",
        quick: "Unit 2/Unit_2_Most_Likely.md"
    },
    {
        full: "Unit 3/Unit_3_10_and_5_Mark_Answers.md",
        quick: "Unit 3/Unit_3_Most_Likely.md"
    },
    {
        full: "Unit 4/Unit_4_10_and_5_Mark_Answers.md",
        quick: "Unit 4/Unit_4_Most_Likely.md"
    },
    {
        full: "Unit 5/Unit_5_10_and_5_Mark_Answers.md",
        quick: "Unit 5/Unit_5_Most_Likely.md"
    }
];

let currentUnit = 0;
let currentType = "full";

marked.setOptions({ breaks: true, gfm: true });

document.addEventListener("DOMContentLoaded", () => {
    const contentEl = document.getElementById("markdown-content");
    const unitTabsContainer = document.getElementById("unit-tabs");
    const typeTabsContainer = document.getElementById("type-tabs");
    const themeToggle = document.getElementById("theme-toggle");

    // --- Theme ---
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    themeToggle.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
    });

    // --- Unit tab clicks ---
    unitTabsContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".unit-tab");
        if (!btn) return;
        currentUnit = parseInt(btn.dataset.unit);
        setActiveTab(unitTabsContainer, btn);
        loadCurrent();
    });

    // --- Type tab clicks ---
    typeTabsContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".type-tab");
        if (!btn) return;
        currentType = btn.dataset.type;
        setActiveTab(typeTabsContainer, btn);
        loadCurrent();
    });

    function setActiveTab(container, active) {
        container.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        active.classList.add("active");
    }

    // --- Load markdown ---
    const rawNotesPath = "Technical_Writing_and_Communication_Skills_Notes.md";

    async function loadCurrent() {
        const path = currentType === "raw" ? rawNotesPath : units[currentUnit][currentType];
        contentEl.innerHTML = '<div class="loader-wrap"><div class="loader"></div></div>';

        try {
            const res = await fetch(encodeURI(path));
            if (!res.ok) throw new Error("Could not load file (status " + res.status + ")");
            const md = await res.text();
            const html = marked.parse(md);

            // Wrap tables for horizontal scroll
            const wrapper = document.createElement("div");
            wrapper.innerHTML = html;
            wrapper.querySelectorAll("table").forEach(table => {
                const div = document.createElement("div");
                div.className = "table-wrapper";
                table.parentNode.insertBefore(div, table);
                div.appendChild(table);
            });

            contentEl.innerHTML = "";
            contentEl.appendChild(wrapper);
            window.scrollTo({ top: 0, behavior: "instant" });
        } catch (err) {
            contentEl.innerHTML =
                '<p class="placeholder-text">Error: ' + err.message +
                '<br><br>If you are testing locally, please use a local server<br>(e.g. Live Server in VS Code or <code>python -m http.server</code>).</p>';
        }
    }

    // Load first page on start
    loadCurrent();
});
