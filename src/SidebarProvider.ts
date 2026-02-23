import * as vscode from "vscode";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _context: vscode.ExtensionContext
  ) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (msg) => {
      if (msg.command === "saveState") {
        await this._context.globalState.update("totalSeconds", msg.totalSeconds);
        await this._context.globalState.update("languageStats", msg.languageStats);
      }
    });

    setTimeout(() => {
      const totalSeconds = this._context.globalState.get<number>("totalSeconds") || 0;
      const languageStats =
        this._context.globalState.get<Record<string, number>>("languageStats") || {};
      webviewView.webview.postMessage({ command: "setState", totalSeconds, languageStats });
    }, 300);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const u = (f: string) =>
      webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", f)).toString();

    const fontUri = u("PixelifySans-Regular.ttf");
    const mascotUri = u("level1.gif");

    const chars: [string, string][] = [
      ["script-kiddie-locked.svg",    "Script Kiddie"],
      ["vibe-coder-locked.svg",       "Vibe Coder"],
      ["spaghetti-chef-locked.svg",   "Spaghetti Chef"],
      ["junior-developer-locked.svg", "Junior Dev"],
      ["overflow-survivor-locked.svg","Overflow Survivor"],
      ["senior-developer-locked.svg", "Senior Dev"],
      ["10x-engineer-locked.svg",     "10x Engineer"],
      ["vim-lord-locked.svg",         "Vim Lord"],
      ["the-singularity-locked.svg",  "The Singularity"],
    ];

    const charCards = chars
      .map(
        ([file, name], i) =>
          '<div class="character-card ' +
          (i === 0 ? "unlocked" : "locked") +
          '" data-level="' + i + '">' +
          '<img src="' + u(file) + '" alt="' + name + '" />' +
          '<div class="character-name">' + name + "</div>" +
          "</div>"
      )
      .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
@font-face {
  font-family: 'Pixelify';
  src: url('${fontUri}') format('truetype');
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Pixelify', monospace;
  background: var(--vscode-sideBar-background);
  color: var(--vscode-foreground);
  padding: 12px;
  font-size: 13px;
  line-height: 1.4;
}

/* ── Mascot ── */
.mascot-section {
  text-align: center;
  padding: 18px 0 14px;
}
.mascot-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  image-rendering: pixelated;
  display: block;
  margin: 0 auto 10px;
}
.mascot-title {
  font-size: 1.45em;
  color: #4ec9b0;
  margin-bottom: 6px;
}
.tag-line {
  font-size: 0.7em;
  color: var(--vscode-descriptionForeground);
  padding: 0 10px;
  line-height: 1.5;
  font-style: italic;
}

/* ── Section card ── */
.section {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
}
.section-label {
  font-size: 0.6em;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--vscode-descriptionForeground);
  margin-bottom: 10px;
}

/* ── Timer ── */
.timer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.timer-display {
  font-size: 2.2em;
  color: #4ec9b0;
  letter-spacing: 0.04em;
}
.timer-status {
  font-size: 0.72em;
  color: var(--vscode-descriptionForeground);
  display: flex;
  align-items: center;
  gap: 5px;
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #666;
  display: inline-block;
  flex-shrink: 0;
}
.status-dot.active {
  background: #4ec9b0;
  box-shadow: 0 0 5px #4ec9b0;
  animation: blink 1.5s ease-in-out infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

/* ── Progress bar ── */
.progress-bar-bg {
  background: rgba(255,255,255,0.08);
  border-radius: 4px;
  height: 5px;
  overflow: hidden;
  margin: 6px 0;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ec9b0, #7de8d3);
  border-radius: 4px;
  transition: width 0.6s ease;
  min-width: 2px;
}
.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.68em;
  color: var(--vscode-descriptionForeground);
}

/* ── Language bars ── */
.lang-item { margin-bottom: 9px; }
.lang-item:last-child { margin-bottom: 0; }
.lang-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
}
.lang-name { font-size: 0.78em; }
.lang-pct  { font-size: 0.72em; color: var(--vscode-descriptionForeground); }
.lang-bar-bg {
  background: rgba(255,255,255,0.08);
  border-radius: 3px;
  height: 4px;
  overflow: hidden;
}
.lang-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}
.lang-empty {
  font-size: 0.75em;
  color: var(--vscode-descriptionForeground);
  text-align: center;
  padding: 4px 0;
}

/* ── Badges ── */
.badge-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.badge {
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px;
  padding: 8px 4px;
  text-align: center;
  background: rgba(255,255,255,0.02);
  transition: all 0.25s;
}
.badge.earned {
  border-color: rgba(78,201,176,0.4);
  background: rgba(78,201,176,0.07);
}
.badge.locked {
  filter: grayscale(1);
  opacity: 0.35;
}
.badge-icon { font-size: 1.5em; margin-bottom: 3px; }
.badge-name {
  font-size: 0.58em;
  color: var(--vscode-descriptionForeground);
  line-height: 1.2;
}
.badge.earned .badge-name { color: #4ec9b0; }

/* ── Character grid ── */
.char-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.character-card {
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px;
  padding: 8px 4px;
  text-align: center;
  background: rgba(255,255,255,0.02);
  transition: all 0.25s;
}
.character-card.unlocked {
  border-color: rgba(78,201,176,0.45);
  background: rgba(78,201,176,0.07);
}
.character-card.locked {
  filter: grayscale(0.8);
  opacity: 0.4;
}
.character-card img {
  width: 100%;
  height: auto;
  display: block;
  image-rendering: pixelated;
}
.character-name {
  font-size: 0.58em;
  margin-top: 5px;
  line-height: 1.2;
  color: var(--vscode-descriptionForeground);
}
.character-card.unlocked .character-name { color: #4ec9b0; }

/* ── Toast notification ── */
.toast {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%) translateY(60px);
  background: #4ec9b0;
  color: #000;
  font-size: 0.8em;
  font-weight: bold;
  padding: 7px 14px;
  border-radius: 20px;
  opacity: 0;
  transition: all 0.35s ease;
  pointer-events: none;
  white-space: nowrap;
  z-index: 999;
}
.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
</style>
</head>
<body>

<!-- ── Mascot ── -->
<div class="mascot-section">
  <img src="${mascotUri}" class="mascot-img" alt="mascot" />
  <div id="mascotTitle" class="mascot-title">Script Kiddie</div>
  <div id="tagLine" class="tag-line">I hacked the mainframe (I changed the HTML background color).</div>
</div>

<!-- ── Timer ── -->
<div class="section">
  <div class="section-label">Coding Time</div>
  <div class="timer-row">
    <div class="timer-display" id="timerDisplay">00:00:00</div>
    <div class="timer-status">
      <span class="status-dot active" id="statusDot"></span>
      <span id="statusText">Active</span>
    </div>
  </div>
</div>

<!-- ── Level progress ── -->
<div class="section">
  <div class="section-label">Level Progress</div>
  <div class="progress-bar-bg">
    <div class="progress-bar-fill" id="levelBar" style="width:0%"></div>
  </div>
  <div class="progress-info">
    <span id="levelHours">0.0h total</span>
    <span id="levelNext">&rarr; Vibe Coder at 10h</span>
  </div>
</div>

<!-- ── Languages ── -->
<div class="section">
  <div class="section-label">Languages</div>
  <div id="langStats">
    <div class="lang-empty">Start coding to track languages</div>
  </div>
</div>

<!-- ── Badges ── -->
<div class="section">
  <div class="section-label">Badges</div>
  <div class="badge-grid">
    <div class="badge locked" id="badge-warmed_up">
      <div class="badge-icon">&#x1F525;</div>
      <div class="badge-name">Warmed Up</div>
    </div>
    <div class="badge locked" id="badge-polyglot">
      <div class="badge-icon">&#x1F310;</div>
      <div class="badge-name">Polyglot</div>
    </div>
    <div class="badge locked" id="badge-dedicated">
      <div class="badge-icon">&#x26A1;</div>
      <div class="badge-name">Dedicated</div>
    </div>
    <div class="badge locked" id="badge-linguist">
      <div class="badge-icon">&#x1F4D6;</div>
      <div class="badge-name">Linguist</div>
    </div>
    <div class="badge locked" id="badge-centurion">
      <div class="badge-icon">&#x1F4AF;</div>
      <div class="badge-name">Centurion</div>
    </div>
    <div class="badge locked" id="badge-legend">
      <div class="badge-icon">&#x1F3C6;</div>
      <div class="badge-name">Legend</div>
    </div>
  </div>
</div>

<!-- ── Characters ── -->
<div class="section">
  <div class="section-label">Characters</div>
  <div class="char-grid">
    ${charCards}
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
const vscode = acquireVsCodeApi();

let seconds   = 0;
let langStats  = {};
let currentLevel = 0;
let timerInterval    = null;
let inactivityTimeout = null;
let activeLang = null;

const INACTIVITY_MS = 60000;

const LEVELS = [
  { min: 0,    max: 10,   name: "Script Kiddie",    tag: "I hacked the mainframe (I changed the HTML background color)." },
  { min: 10,   max: 30,   name: "Vibe Coder",        tag: "My code works and I have no idea why." },
  { min: 30,   max: 50,   name: "Spaghetti Chef",    tag: "It's not spaghetti code, it's... artisan pasta." },
  { min: 50,   max: 100,  name: "Junior Developer",  tag: "Stack Overflow is my rubber duck." },
  { min: 100,  max: 200,  name: "Overflow Survivor", tag: "I've closed over 500 Stack Overflow tabs." },
  { min: 200,  max: 300,  name: "Senior Developer",  tag: "Why add comments when the code speaks for itself?" },
  { min: 300,  max: 500,  name: "10x Engineer",      tag: "10x the output, 10x the technical debt." },
  { min: 500,  max: 1000, name: "The Vim Lord",      tag: "I exit Vim on purpose now." },
  { min: 1000, max: 1e9,  name: "The Singularity",   tag: "I don't write code. I manifest it." }
];

const LANG_COLORS = {
  typescript:  "#3178C6",
  javascript:  "#f0db4f",
  python:      "#3572A5",
  rust:        "#DEA584",
  go:          "#00ADD8",
  java:        "#B07219",
  cpp:         "#f34b7d",
  c:           "#555555",
  csharp:      "#178600",
  html:        "#e34c26",
  css:         "#563d7c",
  scss:        "#c6538c",
  ruby:        "#CC342D",
  php:         "#4F5D95",
  swift:       "#F05138",
  kotlin:      "#A97BFF",
  dart:        "#00B4AB",
  vue:         "#42b883",
  json:        "#aaaaaa",
  markdown:    "#083fa1",
  yaml:        "#cb171e",
  shellscript: "#89e051"
};

const LANG_NAMES = {
  typescript:  "TypeScript",
  javascript:  "JavaScript",
  python:      "Python",
  rust:        "Rust",
  go:          "Go",
  java:        "Java",
  cpp:         "C++",
  c:           "C",
  csharp:      "C#",
  html:        "HTML",
  css:         "CSS",
  scss:        "SCSS",
  ruby:        "Ruby",
  php:         "PHP",
  swift:       "Swift",
  kotlin:      "Kotlin",
  dart:        "Dart",
  vue:         "Vue",
  json:        "JSON",
  markdown:    "Markdown",
  yaml:        "YAML",
  shellscript: "Shell"
};

const NOISE = new Set([
  "plaintext", "Log", "log", "scminput", "git-commit",
  "search-result", "code-text-binary", "ignore", ""
]);

/* ── Helpers ── */

function getLangName(id) {
  return LANG_NAMES[id] || (id.charAt(0).toUpperCase() + id.slice(1));
}

function getLangColor(id) {
  return LANG_COLORS[id] || "#4ec9b0";
}

function calcLevel(secs) {
  const hours = secs / 3600;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (hours >= LEVELS[i].min) { return i; }
  }
  return 0;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

/* ── UI updaters ── */

function updateTimerDisplay() {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  document.getElementById("timerDisplay").textContent =
    pad(h) + ":" + pad(m) + ":" + pad(s);
}

function updateStatus(active) {
  const dot = document.getElementById("statusDot");
  const txt = document.getElementById("statusText");
  if (active) {
    dot.className = "status-dot active";
    txt.textContent = "Active";
  } else {
    dot.className = "status-dot";
    txt.textContent = "Paused";
  }
}

function updateLevelUI() {
  const data   = LEVELS[currentLevel];
  const nextLv = LEVELS[currentLevel + 1];
  const hours  = seconds / 3600;

  document.getElementById("mascotTitle").textContent = data.name;
  document.getElementById("tagLine").textContent     = data.tag;
  document.getElementById("levelHours").textContent  = hours.toFixed(1) + "h total";

  if (!nextLv) {
    document.getElementById("levelBar").style.width  = "100%";
    document.getElementById("levelNext").textContent = "Max Level Reached!";
    return;
  }

  const pct = Math.min(100, Math.max(0,
    ((hours - data.min) / (nextLv.min - data.min)) * 100
  ));
  document.getElementById("levelBar").style.width  = pct.toFixed(1) + "%";
  document.getElementById("levelNext").textContent =
    "\u2192 " + nextLv.name + " at " + nextLv.min + "h";
}

function updateChars(lv) {
  document.querySelectorAll(".character-card").forEach(function(card) {
    const cl = parseInt(card.getAttribute("data-level"), 10);
    card.className = "character-card " + (cl <= lv ? "unlocked" : "locked");
  });
}

function updateBadges() {
  const langCount = Object.keys(langStats).filter(function(id) {
    return !NOISE.has(id);
  }).length;

  const checks = {
    "warmed_up": seconds >= 3600,
    "polyglot":  langCount >= 3,
    "dedicated": seconds >= 50 * 3600,
    "linguist":  langCount >= 5,
    "centurion": seconds >= 100 * 3600,
    "legend":    seconds >= 500 * 3600
  };

  Object.keys(checks).forEach(function(id) {
    const el = document.getElementById("badge-" + id);
    if (el) {
      el.className = "badge " + (checks[id] ? "earned" : "locked");
    }
  });
}

function updateLangStats() {
  const container = document.getElementById("langStats");

  const entries = Object.entries(langStats)
    .filter(function(e) { return !NOISE.has(e[0]); })
    .sort(function(a, b) { return b[1] - a[1]; })
    .slice(0, 5);

  if (entries.length === 0) {
    container.innerHTML = "<div class=\"lang-empty\">Start coding to track languages</div>";
    return;
  }

  const total = entries.reduce(function(s, e) { return s + e[1]; }, 0);
  let html = "";

  entries.forEach(function(entry) {
    const id      = entry[0];
    const langSecs = entry[1];
    const pct     = total > 0 ? (langSecs / total * 100) : 0;
    const color   = getLangColor(id);
    const name    = getLangName(id);

    html += "<div class=\"lang-item\">";
    html += "<div class=\"lang-row\">";
    html += "<span class=\"lang-name\">" + name + "</span>";
    html += "<span class=\"lang-pct\">" + pct.toFixed(0) + "%</span>";
    html += "</div>";
    html += "<div class=\"lang-bar-bg\">";
    html += "<div class=\"lang-bar-fill\" style=\"width:" + pct.toFixed(1) + "%;background:" + color + "\"></div>";
    html += "</div></div>";
  });

  container.innerHTML = html;
}

/* ── Level management ── */

function setLevel(newLevel) {
  if (newLevel > currentLevel) {
    showToast("Unlocked: " + LEVELS[newLevel].name + "!");
  }
  currentLevel = newLevel;
  updateLevelUI();
  updateChars(newLevel);
}

function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(function() { el.classList.remove("show"); }, 3000);
}

/* ── Timer ── */

function startTimer() {
  if (timerInterval) { return; }
  timerInterval = setInterval(function() {
    seconds++;

    if (activeLang && !NOISE.has(activeLang)) {
      langStats[activeLang] = (langStats[activeLang] || 0) + 1;
    }

    updateTimerDisplay();

    const newLevel = calcLevel(seconds);
    if (newLevel !== currentLevel) {
      setLevel(newLevel);
    } else {
      updateLevelUI();
    }

    updateLangStats();
    updateBadges();

    if (seconds % 30 === 0) { saveLocalState(); }
  }, 1000);
  updateStatus(true);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  updateStatus(false);
}

function resetInactivity() {
  clearTimeout(inactivityTimeout);
  startTimer();
  inactivityTimeout = setTimeout(function() {
    stopTimer();
    saveState();
  }, INACTIVITY_MS);
}

/* ── State persistence ── */

function saveLocalState() {
  try { vscode.setState({ totalSeconds: seconds, languageStats: langStats }); } catch(e) {}
}

function saveState() {
  saveLocalState();
  vscode.postMessage({
    command: "saveState",
    totalSeconds: seconds,
    languageStats: langStats
  });
}

function initFromState(state) {
  seconds   = state.totalSeconds || 0;
  langStats = state.languageStats || {};
  currentLevel = calcLevel(seconds);
  updateTimerDisplay();
  updateLevelUI();
  updateChars(currentLevel);
  updateLangStats();
  updateBadges();
}

/* ── Message listener ── */

window.addEventListener("message", function(event) {
  const msg = event.data;
  if (msg.command === "userActive") {
    activeLang = msg.language || null;
    resetInactivity();
  } else if (msg.command === "setState") {
    initFromState({ totalSeconds: msg.totalSeconds, languageStats: msg.languageStats });
    saveLocalState();
  } else if (msg.command === "requestState") {
    saveState();
  }
});

/* ── Boot ── */

// Fast restore from webview state (survives sidebar hide/show)
let wsState = null;
try { wsState = vscode.getState(); } catch(e) {}
if (wsState) { initFromState(wsState); }

updateTimerDisplay();
updateLevelUI();
updateBadges();
resetInactivity();
</script>
</body>
</html>`;
  }
}
