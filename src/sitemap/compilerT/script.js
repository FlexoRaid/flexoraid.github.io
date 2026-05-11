document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById('languageSidebar');
    const langBtn = document.getElementById('menu-lang');
    const langBtnImg = langBtn.querySelector('img');
    const fileTabsContainer = document.querySelector('.file-tabs-container');
    const addFileBtn = document.getElementById('add-file');
    const codeInput = document.getElementById('codeInput');
    const outputDisplay = document.getElementById('outputDisplay');
    const runBtn = document.getElementById('runBtn');
    const showOutputBtn = document.getElementById('showOutputBtn');
    const showCodeBtn = document.getElementById('show-code-btn');

    // Definition der Standard-Dateien pro Sprache
    const presets = {
        js: [{ name: 'script.js', content: '// JavaScript Code hier' }],
        py: [{ name: 'main.py', content: '# Python Code hier' }],
        html: [
            { name: 'index.html', content: '' },
            { name: 'style.css', content: '/* CSS Styles */' },
            { name: 'script.js', content: '// JS Code' }
        ]
    };

    let currentLang = 'js';
    let files = [...presets[currentLang]];
    let activeFileIndex = 0;

    // --- SPRACHWECHSEL ---
    langBtn.addEventListener('click', () => {
        sidebar.style.translate = sidebar.style.translate === '0px 0px' ? '-100% 0' : '0 0';
    });

    document.querySelectorAll('.lang-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const lang = icon.getAttribute('data-lang');
            currentLang = lang;
            
            // Icon im Button aktualisieren
            const newSrc = icon.querySelector('img').src;
            langBtnImg.src = newSrc;
            langBtnImg.alt = lang.toUpperCase();

            // Dateien laden & Sidebar schließen
            files = [...presets[lang]];
            activeFileIndex = 0;
            renderTabs();
            sidebar.style.translate = '-100% 0';
        });
    });

    // --- DATEI-VERWALTUNG ---
    function renderTabs() {
        fileTabsContainer.innerHTML = '';
        files.forEach((file, index) => {
            const tab = document.createElement('div');
            tab.className = `file-tab ${index === activeFileIndex ? 'active' : ''}`;
            tab.textContent = file.name;

            // Wechseln der Datei
            tab.addEventListener('click', () => {
                files[activeFileIndex].content = codeInput.value; // Speichern
                activeFileIndex = index;
                renderTabs();
                codeInput.value = files[activeFileIndex].content;
            });

            // Umbenennen per Doppelklick
            tab.addEventListener('dblclick', () => {
                const newName = prompt('Datei umbenennen:', file.name);
                if (newName) {
                    file.name = newName;
                    renderTabs();
                }
            });

            fileTabsContainer.appendChild(tab);
        });
        codeInput.value = files[activeFileIndex].content;
    }

    addFileBtn.addEventListener('click', () => {
        const ext = currentLang === 'html' ? 'txt' : currentLang;
        files.push({ name: `newfile.${ext}`, content: '' });
        activeFileIndex = files.length - 1;
        renderTabs();
    });

    // --- MOBILE LOGIK (Output/Code Toggle) ---
    function toggleMobileView(showOutput) {
        if (window.innerWidth <= 768) {
            if (showOutput) {
                document.querySelector('.code-editor').style.display = 'none';
                document.getElementById('outputDisplay').style.display = 'block';
                document.querySelector('.left-header').style.display = 'none';
                document.querySelector('.right-header').style.display = 'flex';
            } else {
                document.querySelector('.code-editor').style.display = 'block';
                document.getElementById('outputDisplay').style.display = 'none';
                document.querySelector('.left-header').style.display = 'flex';
                document.querySelector('.right-header').style.display = 'none';
            }
        }
    }

    showOutputBtn.addEventListener('click', () => toggleMobileView(true));
    showCodeBtn.addEventListener('click', () => toggleMobileView(false));

    // --- RUN BUTTON ---
    runBtn.addEventListener('click', () => {
        outputDisplay.innerHTML = `<span style="color: #48cae4;">> Running ${files[activeFileIndex].name}...</span><br>Code execution simulation started.`;
        if (window.innerWidth <= 768) {
            toggleMobileView(true);
        }
    });

    // Initiale Anzeige
    renderTabs();
});