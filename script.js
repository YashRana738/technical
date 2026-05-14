// File paths mapped by unit index and type
var units = [
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

var rawNotesPath = "Technical_Writing_and_Communication_Skills_Notes.md";
var currentUnit = 0;
var currentType = "full";

document.addEventListener("DOMContentLoaded", function () {
    var contentEl = document.getElementById("markdown-content");
    var unitTabsContainer = document.getElementById("unit-tabs");
    var typeTabsContainer = document.getElementById("type-tabs");
    var themeToggle = document.getElementById("theme-toggle");

    // Theme
    var savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    themeToggle.addEventListener("click", function () {
        var cur = document.documentElement.getAttribute("data-theme");
        var next = cur === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
    });

    // Unit tab clicks
    var unitButtons = unitTabsContainer.querySelectorAll(".unit-tab");
    unitButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            // update active state
            unitButtons.forEach(function (b) { b.classList.remove("active"); });
            btn.classList.add("active");

            if (btn.getAttribute("data-unit") === "raw") {
                currentUnit = "raw";
                typeTabsContainer.style.display = "none";
                loadFile(rawNotesPath);
            } else {
                currentUnit = parseInt(btn.getAttribute("data-unit"));
                typeTabsContainer.style.display = "";
                loadFile(units[currentUnit][currentType]);
            }
        });
    });

    // Type tab clicks
    var typeButtons = typeTabsContainer.querySelectorAll(".type-tab");
    typeButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            typeButtons.forEach(function (b) { b.classList.remove("active"); });
            btn.classList.add("active");
            currentType = btn.getAttribute("data-type");
            if (currentUnit !== "raw") {
                loadFile(units[currentUnit][currentType]);
            }
        });
    });

    // Load a markdown file by path
    function loadFile(path) {
        contentEl.innerHTML = '<div class="loader-wrap"><div class="loader"></div></div>';

        fetch(path)
            .then(function (res) {
                if (!res.ok) throw new Error("Could not load file (status " + res.status + ")");
                return res.text();
            })
            .then(function (md) {
                var html = marked.parse(md);

                // Wrap tables for horizontal scroll
                var wrapper = document.createElement("div");
                wrapper.innerHTML = html;
                var tables = wrapper.querySelectorAll("table");
                tables.forEach(function (table) {
                    var div = document.createElement("div");
                    div.className = "table-wrapper";
                    table.parentNode.insertBefore(div, table);
                    div.appendChild(table);
                });

                contentEl.innerHTML = "";
                contentEl.appendChild(wrapper);
                window.scrollTo(0, 0);
            })
            .catch(function (err) {
                contentEl.innerHTML =
                    '<p class="placeholder-text">Error: ' + err.message +
                    '<br><br>If testing locally, use a local server (Live Server or python -m http.server).</p>';
            });
    }

    // Load first page
    loadFile(units[0]["full"]);
});
