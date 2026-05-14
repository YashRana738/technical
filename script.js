const fileStructure = [
    {
        unit: "Unit 1",
        files: [
            { name: "10 & 5 Mark Answers", path: "Unit 1/Unit_1_10_and_5_Mark_Answers.md" },
            { name: "Quick Revision", path: "Unit 1/Unit_1_Most_Likely.md" }
        ]
    },
    {
        unit: "Unit 2",
        files: [
            { name: "10 & 5 Mark Answers", path: "Unit 2/Unit_2_10_and_5_Mark_Answers.md" },
            { name: "Quick Revision", path: "Unit 2/Unit_2_Most_Likely.md" }
        ]
    },
    {
        unit: "Unit 3",
        files: [
            { name: "10 & 5 Mark Answers", path: "Unit 3/Unit_3_10_and_5_Mark_Answers.md" },
            { name: "Quick Revision", path: "Unit 3/Unit_3_Most_Likely.md" }
        ]
    },
    {
        unit: "Unit 4",
        files: [
            { name: "10 & 5 Mark Answers", path: "Unit 4/Unit_4_10_and_5_Mark_Answers.md" },
            { name: "Quick Revision", path: "Unit 4/Unit_4_Most_Likely.md" }
        ]
    },
    {
        unit: "Unit 5",
        files: [
            { name: "10 & 5 Mark Answers", path: "Unit 5/Unit_5_10_and_5_Mark_Answers.md" },
            { name: "Quick Revision", path: "Unit 5/Unit_5_Most_Likely.md" }
        ]
    }
];

marked.setOptions({ breaks: true, gfm: true });

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.getElementById('nav-links');
    const content = document.getElementById('markdown-content');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const menuToggle = document.getElementById('menu-toggle');
    const themeToggle = document.getElementById('theme-toggle');

    // Theme
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);

    themeToggle.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    // Mobile sidebar
    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('visible');
    }
    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
    }

    menuToggle.addEventListener('click', openSidebar);
    overlay.addEventListener('click', closeSidebar);

    // Build nav
    fileStructure.forEach(group => {
        const div = document.createElement('div');
        div.className = 'nav-group';

        const title = document.createElement('div');
        title.className = 'nav-group-title';
        title.textContent = group.unit;
        div.appendChild(title);

        group.files.forEach(file => {
            const a = document.createElement('a');
            a.href = '#' + encodeURIComponent(file.path);
            a.className = 'nav-link';
            a.textContent = file.name;
            a.dataset.path = file.path;

            a.addEventListener('click', e => {
                e.preventDefault();
                load(file.path);
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                a.classList.add('active');
                closeSidebar();
                window.history.pushState(null, null, '#' + encodeURIComponent(file.path));
            });

            div.appendChild(a);
        });

        navLinks.appendChild(div);
    });

    // Load markdown
    async function load(path) {
        content.innerHTML = '<div class="loader-container"><span class="loader"></span></div>';
        try {
            const res = await fetch(encodeURI(path));
            if (!res.ok) throw new Error('File not found (' + res.status + ')');
            const md = await res.text();
            content.innerHTML = marked.parse(md);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            content.innerHTML =
                '<div style="text-align:center;padding:3rem 1rem;">' +
                '<h2>Unable to load file</h2>' +
                '<p style="color:var(--text-light);margin-top:0.5rem;">' + err.message + '</p>' +
                '<p style="color:var(--text-light);margin-top:1rem;font-size:0.85rem;">' +
                'If testing locally, use a local server (e.g. Live Server in VS Code).</p></div>';
        }
    }

    // Handle direct URL hash on page load
    const hash = window.location.hash.slice(1);
    if (hash) {
        const path = decodeURIComponent(hash);
        const link = document.querySelector('.nav-link[data-path="' + path + '"]');
        if (link) link.click();
        else load(path);
    }
});
