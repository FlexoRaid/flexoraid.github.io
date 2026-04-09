document.addEventListener("DOMContentLoaded", () => {
    const codeInput = document.getElementById('codeInput');
    const runBtn = document.getElementById('runBtn');
    const consoleText = document.getElementById('consoleText');
    const htmlPreview = document.getElementById('htmlPreview');
    const fileTabsContainer = document.getElementById('fileTabs');
    const langIcons = document.querySelectorAll('.lang-icon');

    let projectData = {
        js: { 'main.js': 'console.log("Hello World!");' 
        },
        html: { 
            'index.html': '<h1>Hello World</h1>', 
            'style.css': 'h1 { color: blue; }', 
            'script.js': 'console.log("Hello World!");' 
        },
        py: { 'main.py': '#unfortunately only the print function works\nprint("Hello, World!")' }
    };

    let currentLang = 'js';
    let currentFile = 'main.js';

    function updateEditor() {
        fileTabsContainer.innerHTML = '';
        Object.keys(projectData[currentLang]).forEach(file => {
            const tab = document.createElement('div');
            tab.className = `file-tab ${file === currentFile ? 'active' : ''}`;
            tab.textContent = file;
            tab.onclick = () => {
                projectData[currentLang][currentFile] = codeInput.value;
                currentFile = file;
                updateEditor();
            };
            fileTabsContainer.appendChild(tab);
        });
        codeInput.value = projectData[currentLang][currentFile];
    }

    langIcons.forEach(icon => {
        icon.onclick = () => {
            langIcons.forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
            projectData[currentLang][currentFile] = codeInput.value;
            currentLang = icon.dataset.lang;
            currentFile = Object.keys(projectData[currentLang])[0];
            updateEditor();
            consoleText.innerHTML = '';
            htmlPreview.style.display = 'none';
        };
    });

    function executeJS(code) {
        consoleText.innerHTML = '';
        const originalLog = console.log;
        const originalError = console.error;

        console.log = (...args) => {
            const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' ');
            consoleText.innerHTML += `<div class="log-normal">${msg}</div>`;
        };
        console.error = (...args) => {
            const msg = args.map(a => a).join(' ');
            consoleText.innerHTML += `<div class="log-error">Error: ${msg}</div>`;
        };

        try {
            const run = new Function(code);
            run();
        } catch (err) {
            console.error(err.message);
        }

        console.log = originalLog;
        console.error = originalError;
    }

    function executePython(code) {
        try {
            const oldTag = document.getElementById('pyscript-runner');
            if (oldTag) oldTag.remove();

            const pyScriptTag = document.createElement('script');
            pyScriptTag.type = 'py';
            pyScriptTag.id = 'pyscript-runner';
            
            const wrappedCode = `
    import sys
    from js import document, window

    class BrowserOutput:
        def write(self, text):
            if text.strip():
                node = document.createElement('div')
                node.className = 'log-normal'
                node.textContent = text
                document.getElementById('consoleText').appendChild(node)
        def flush(self):
            pass

    def browser_input(prompt_text=""):
        return window.prompt(prompt_text)

    sys.stdout = BrowserOutput()
    sys.stderr = BrowserOutput()
    input = browser_input

    ${code}
            `;

            consoleText.innerHTML = '<div class="log-normal">Python is running...</div>';
            pyScriptTag.textContent = wrappedCode;
            document.body.appendChild(pyScriptTag);

            setTimeout(() => {
            }, 1000);

        } catch (err) {
            consoleText.innerHTML = `<div class="log-error">Python Error: ${err.message}</div>`;
        }
    }

    runBtn.onclick = () => {
        projectData[currentLang][currentFile] = codeInput.value;
        
        if (currentLang === 'js') {
            htmlPreview.style.display = 'none';
            consoleText.style.display = 'block';
            executeJS(codeInput.value);
        }
        else if (currentLang === 'py') {
            htmlPreview.style.display = 'none';
            consoleText.style.display = 'block';
            executePython(codeInput.value);
        }
        else if (currentLang === 'html') {
            consoleText.style.display = 'none';
            htmlPreview.style.display = 'block';
            const content = `
                <html>
                    <head><style>${projectData.html['style.css']}</style></head>
                    <body>
                        ${projectData.html['index.html']}\n                        <script>${projectData.html['script.js']}<\/script>
                    </body>
                </html>`;
            htmlPreview.srcdoc = content;
        }
    };

    document.getElementById('clearBtn').onclick = () => consoleText.innerHTML = '';

    updateEditor();
});