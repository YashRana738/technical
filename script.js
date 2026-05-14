// Define the structure of the files to populate the sidebar dynamically
const fileStructure = [
    {
        unit: "Unit 1",
        files: [
            { name: "10 & 5 Mark Answers", path: "Unit 1/Unit_1_10_and_5_Mark_Answers.md" },
            { name: "Most Likely (Quick Revision)", path: "Unit 1/Unit_1_Most_Likely.md" }
        ]
    },
    {
        unit: "Unit 2",
        files: [
            { name: "10 & 5 Mark Answers", path: "Unit 2/Unit_2_10_and_5_Mark_Answers.md" },
            { name: "Most Likely (Quick Revision)", path: "Unit 2/Unit_2_Most_Likely.md" }
        ]
    },
    {
        unit: "Unit 3",
        files: [
            { name: "10 & 5 Mark Answers", path: "Unit 3/Unit_3_10_and_5_Mark_Answers.md" },
            { name: "Most Likely (Quick Revision)", path: "Unit 3/Unit_3_Most_Likely.md" }
        ]
    },
    {
        unit: "Unit 4",
        files: [
            { name: "10 & 5 Mark Answers", path: "Unit 4/Unit_4_10_and_5_Mark_Answers.md" },
            { name: "Most Likely (Quick Revision)", path: "Unit 4/Unit_4_Most_Likely.md" }
        ]
    },
    {
        unit: "Unit 5",
        files: [
            { name: "10 & 5 Mark Answers", path: "Unit 5/Unit_5_10_and_5_Mark_Answers.md" },
            { name: "Most Likely (Quick Revision)", path: "Unit 5/Unit_5_Most_Likely.md" }
        ]
    }
];

// Configure marked.js to use highlight.js for code blocks
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true, // translate newlines into <br>
    gfm: true     // GitHub Flavored Markdown
});

document.addEventListener('DOMContentLoaded', () => {
    const navLinksContainer = document.getElementById('nav-links');
    const contentArea = document.getElementById('markdown-content');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const themeToggle = document.getElementById('theme-toggle');

    // 1. Theme initialization & toggle
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        let switchToTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', switchToTheme);
        localStorage.setItem('theme', switchToTheme);
    });

    // 2. Mobile sidebar toggle
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target) && 
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });

    // 3. Generate Sidebar Navigation
    fileStructure.forEach(unitGrp => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'nav-group';
        
        const groupTitle = document.createElement('div');
        groupTitle.className = 'nav-group-title';
        groupTitle.textContent = unitGrp.unit;
        groupDiv.appendChild(groupTitle);

        unitGrp.files.forEach(file => {
            const link = document.createElement('a');
            link.href = `#${encodeURIComponent(file.path)}`;
            link.className = 'nav-link';
            link.textContent = file.name;
            link.dataset.path = file.path;
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                loadMarkdown(file.path);
                
                // Update active state in sidebar
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close sidebar on mobile after clicking a link
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }
                
                // Update browser URL hash without scrolling page
                window.history.pushState(null, null, `#${encodeURIComponent(file.path)}`);
            });
            
            groupDiv.appendChild(link);
        });

        navLinksContainer.appendChild(groupDiv);
    });

    // 4. Load and Parse Markdown
    async function loadMarkdown(path) {
        // Show loading spinner
        contentArea.innerHTML = '<div class="loader-container"><span class="loader"></span></div>';
        
        try {
            // Encode URI for spaces in folder/file names (e.g. "Unit 1")
            const response = await fetch(encodeURI(path));
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const markdownText = await response.text();
            
            // Re-create the div to trigger CSS fadeIn animation
            const newContent = document.createElement('div');
            newContent.innerHTML = marked.parse(markdownText);
            
            contentArea.innerHTML = '';
            contentArea.appendChild(newContent);
            
            // Scroll back to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
        } catch (error) {
            contentArea.innerHTML = `
                <div style="text-align:center; padding: 3rem;">
                    <h2 style="color: #ef4444; margin-bottom: 1rem;">Oops! Unable to load file.</h2>
                    <p style="color: var(--text-secondary);">${error.message}</p>
                    <div style="margin-top: 2rem; text-align: left; background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 0.5rem; font-size: 0.9em;">
                        <strong>Note for local testing:</strong><br>
                        If you are opening this <code>index.html</code> file directly in your browser (using the <code>file://</code> protocol), browsers typically block fetching local files due to strict CORS security policies.<br><br>
                        <strong>How to fix:</strong><br>
                        1. This will work perfectly once pushed to GitHub Pages.<br>
                        2. To test locally, use a local web server (e.g., VSCode's "Live Server" extension, or run <code>python -m http.server</code> in the terminal in this directory).
                    </div>
                </div>
            `;
            console.error('Error fetching markdown:', error);
        }
    }

    // 5. Handle initial load based on URL hash (e.g., on page refresh)
    const initialHash = window.location.hash.slice(1);
    if (initialHash) {
        const decodedPath = decodeURIComponent(initialHash);
        const link = document.querySelector(`.nav-link[data-path="${decodedPath}"]`);
        
        if (link) {
            // Simulate click to handle both loading and active states
            link.click();
        } else {
            // Load path directly if somehow not in sidebar
            loadMarkdown(decodedPath);
        }
    }
});
