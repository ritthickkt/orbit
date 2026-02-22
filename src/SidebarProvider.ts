import * as vscode from "vscode";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    
    const fontUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "PixelifySans-Regular.ttf"));
    const scriptKiddieImagePath = vscode.Uri.joinPath(this._extensionUri, "media", "level1.gif");
    const vibeCoderImagePath = vscode.Uri.joinPath(this._extensionUri, "media", "vibe-coder.gif");
    const spaghettiChefImagePath = vscode.Uri.joinPath(this._extensionUri, "media", "spaghetti-chef.gif");
    const juniorDeveloperImagePath = vscode.Uri.joinPath(this._extensionUri, "media", "junior-developer.gif");
    const overflowSurvivorImagePath = vscode.Uri.joinPath(this._extensionUri, "media", "overflow-survivor.gif");
    const seniorDeveloperImagePath = vscode.Uri.joinPath(this._extensionUri, "media", "senior-developer.gif");
    const tenEngineerImagePath = vscode.Uri.joinPath(this._extensionUri, "media", "10x-engineer.gif");
    const vimLordImagePath = vscode.Uri.joinPath(this._extensionUri, "media", "vim-lord.gif");
    const singularityImagePath = vscode.Uri.joinPath(this._extensionUri, "media", "the-singularity.gif");

    const scriptKiddieImage = webview.asWebviewUri(scriptKiddieImagePath);
    const vibeCoderImage = webview.asWebviewUri(vibeCoderImagePath);
    const spaghettiChefImage = webview.asWebviewUri(spaghettiChefImagePath);
    const juniorDeveloperImage = webview.asWebviewUri(juniorDeveloperImagePath);
    const overflowSurvivorImage = webview.asWebviewUri(overflowSurvivorImagePath);
    const seniorDeveloperImage = webview.asWebviewUri(seniorDeveloperImagePath);
    const tenEngineerImage = webview.asWebviewUri(tenEngineerImagePath);
    const vimLordImage = webview.asWebviewUri(vimLordImagePath);
    const singularityImage = webview.asWebviewUri(singularityImagePath);

    const lockedScriptKiddiePath = vscode.Uri.joinPath(this._extensionUri, "media", "script-kiddie-locked.svg");
    const lockedvibeCoderPath = vscode.Uri.joinPath(this._extensionUri, "media", "vibe-coder-locked.svg");
    const lockedspaghettiChefPath = vscode.Uri.joinPath(this._extensionUri, "media", "spaghetti-chef-locked.svg");
    const lockedjuniorDeveloperPath = vscode.Uri.joinPath(this._extensionUri, "media", "junior-developer-locked.svg");
    const lockedstackOverflowSurvivorPath = vscode.Uri.joinPath(this._extensionUri, "media", "overflow-survivor-locked.svg");
    const lockedseniorDeveloperPath = vscode.Uri.joinPath(this._extensionUri, "media", "senior-developer-locked.svg");
    const lockedtenEngineerPath = vscode.Uri.joinPath(this._extensionUri, "media", "10x-engineer-locked.svg");
    const lockedvimLordPath = vscode.Uri.joinPath(this._extensionUri, "media", "vim-lord-locked.svg");
    const lockedsingularityPath = vscode.Uri.joinPath(this._extensionUri, "media", "the-singularity-locked.svg");

    const lockedScriptKiddie = webview.asWebviewUri(lockedScriptKiddiePath);
    const lockedvibeCoder = webview.asWebviewUri(lockedvibeCoderPath);
    const lockedspaghettiChef = webview.asWebviewUri(lockedspaghettiChefPath);
    const lockedjuniorDeveloper = webview.asWebviewUri(lockedjuniorDeveloperPath);
    const lockedstackOverflowSurvivor = webview.asWebviewUri(lockedstackOverflowSurvivorPath);
    const lockedseniorDeveloper = webview.asWebviewUri(lockedseniorDeveloperPath);
    const lockedtenEngineer = webview.asWebviewUri(lockedtenEngineerPath);
    const lockedvimLord = webview.asWebviewUri(lockedvimLordPath);
    const lockedsingularity = webview.asWebviewUri(lockedsingularityPath);
    
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "style.css"));

  return `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <link href="${styleUri}" rel="stylesheet">
          
          <style>
              @font-face {
                  font-family: 'Pixelify Sans';
                  src: url('${fontUri}') format('truetype');
                  font-weight: normal;
                  font-style: normal;
              }
              
              body {
                  font-family: 'Pixelify Sans', monospace !important;
              }

              .timer-display {
                  font-size: 2.5em;
                  text-align: center;
                  margin: 20px 0;
                  color: #4ec9b0;
                  font-weight: bold;
              }

              .timer-status {
                  text-align: center;
                  font-size: 0.9em;
                  color: #858585;
                  margin-bottom: 10px;
              }

              .timer-status.active {
                  color: #4ec9b0;
              }

              .timer-status.inactive {
                  color: #d4534a;
              }

              .achievements {
                  margin-top: 30px;
              }

              .achievements h2 {
                  font-size: 1.2em;
                  margin-bottom: 15px;
                  color: #d4d4d4;
              }

              .locked-characters-grid {
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  gap: 12px;
              }

              .character-card {
                  border: 2px solid #858585;
                  border-radius: 8px;
                  padding: 15px;
                  text-align: center;
                  background-color: rgba(78, 201, 176, 0.05);
                  min-height: 120px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
              }

              .character-card.unlocked {
                  border-color: #4ec9b0;
              }

              .character-card .character-name {
                  font-size: 0.85em;
                  color: #4ec9b0;
                  margin-top: 10px;
                  font-weight: bold;
              }
          </style>
      </head>
      <body>
        <h1 class="mascot-title">Script Kiddie</h1>
        <img src="${scriptKiddieImage}" width="100%" />
        <p class="tag-line">I hacked the mainframe (I changed the HTML background color).</p>
        
        <div class="timer">
          <div class="timer-status active" id="timerStatus">Active</div>
          <div class="timer-display" id="timerDisplay">00:00:00</div>
        </div>

        <div class="achievements">
          <h2>Characters</h2>
          <div class="locked-characters-grid">
            <div class="character-card unlocked" data-level="0">
              <div class="character-image"><img src="${lockedScriptKiddie}" width="100%" /></div>
              <div class="character-name">Script Kiddie</div>
            </div>
            <div class="character-card" data-level="1">
              <div class="character-image"><img src="${lockedvibeCoder}" width="100%" /></div>
              <div class="character-name">Vibe Coder</div>
            </div>
            <div class="character-card" data-level="2">
              <div class="character-image"><img src="${lockedspaghettiChef}" width="100%" /></div>
              <div class="character-name">Spaghetti Chef</div>
            </div>
            <div class="character-card" data-level="3">
              <div class="character-image"><img src="${lockedjuniorDeveloper}" width="100%" /></div>
              <div class="character-name">Junior Developer</div>
            </div>
            <div class="character-card" data-level="4">
              <div class="character-image"><img src="${lockedstackOverflowSurvivor}" width="100%" /></div>
              <div class="character-name">Overflow Survivor</div>
            </div>
            <div class="character-card" data-level="5">
              <div class="character-image"><img src="${lockedseniorDeveloper}" width="100%" /></div>
              <div class="character-name">Senior Developer</div>
            </div>
            <div class="character-card" data-level="6">
              <div class="character-image"><img src="${lockedtenEngineer}" width="100%" /></div>
              <div class="character-name">10x Engineer</div>
            </div>
            <div class="character-card" data-level="7">
              <div class="character-image"><img src="${lockedvimLord}" width="100%" /></div>
              <div class="character-name">The Vim Lord</div>
            </div>
            <div class="character-card" data-level="8">
              <div class="character-image"><img src="${lockedsingularity}" width="100%" /></div>
              <div class="character-name">The Singularity</div>
            </div>
          </div>
        </div>

        <script>
          let seconds = 0;
          let timerInterval = null;
          let inactivityTimeout = null;
          const INACTIVITY_THRESHOLD = 1 * 60 * 1000; // 1 minute

          const LEVEL_THRESHOLDS = [
            { level: 0, minHours: 0, maxHours: 10, name: 'Script Kiddie' },
            { level: 1, minHours: 10, maxHours: 30, name: 'Vibe Coder' },
            { level: 2, minHours: 30, maxHours: 50, name: 'Spaghetti Chef' },
            { level: 3, minHours: 50, maxHours: 100, name: 'Junior Developer' },
            { level: 4, minHours: 100, maxHours: 200, name: 'Stack Overflow Survivor' },
            { level: 5, minHours: 200, maxHours: 300, name: 'Senior Developer' },
            { level: 6, minHours: 300, maxHours: 500, name: '10x Engineer' },
            { level: 7, minHours: 500, maxHours: 1000, name: 'The Vim Lord' },
            { level: 8, minHours: 1000, maxHours: Infinity, name: 'The Singularity' }
          ];

          function calculateLevelFromHours(hours) {
            for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
              if (hours >= LEVEL_THRESHOLDS[i].minHours) {
                return i;
              }
            }
            return 0;
          }

          function updateCharacterStatus(level) {
            document.querySelectorAll('.character-card').forEach((card) => {
              const cardLevel = parseInt(card.dataset.level);
              card.classList.remove('unlocked');
              
              if (cardLevel <= level) {
                card.classList.add('unlocked');
              }
            });
          }

          function updateMascotDisplay(level) {
            const levelData = LEVEL_DATA[level];
            document.getElementById('mascotTitle').textContent = levelData.name;
            document.getElementById('mascotImage').src = levelData.image;
            document.getElementById('tagLine').textContent = levelData.tagLine;
          }

          function setCurrentLevel(level) {
            currentLevel = level;
            updateCharacterStatus(level);
          }

          function startTimer() {
            if (timerInterval) return;
            
            timerInterval = setInterval(() => {
              seconds++;
              updateTimerDisplay();
              
              // Check if user leveled up
              const hours = Math.floor(seconds / 3600);
              const newLevel = calculateLevelFromHours(hours);
              if (newLevel > currentLevel) {
                setCurrentLevel(newLevel);
              }
            }, 1000);

            updateStatusUI(true);
          }

          function stopTimer() {
            if (timerInterval) {
              clearInterval(timerInterval);
              timerInterval = null;
            }
            updateStatusUI(false);
          }

          function updateTimerDisplay() {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;

            const display = 
              String(hours).padStart(2, '0') + ':' +
              String(minutes).padStart(2, '0') + ':' +
              String(secs).padStart(2, '0');

            document.getElementById('timerDisplay').textContent = display;
          }

          function updateStatusUI(isActive) {
            const statusEl = document.getElementById('timerStatus');
            if (isActive) {
              statusEl.textContent = 'Active';
              statusEl.className = 'timer-status active';
            } else {
              statusEl.textContent = 'Inactive (paused)';
              statusEl.className = 'timer-status inactive';
            }
          }

          function resetInactivityTimer() {
            clearTimeout(inactivityTimeout);
            
            startTimer();

            inactivityTimeout = setTimeout(() => {
              stopTimer();
            }, INACTIVITY_THRESHOLD);
          }

          // Listen for keyboard and mouse activity
          document.addEventListener('keydown', resetInactivityTimer);

          // VS Code command to trigger on user activity
          window.addEventListener('message', (event) => {
            const message = event.data;
            if (message.command === 'userActive') {
              resetInactivityTimer();
            }
            if (message.command === 'setSeconds') {
              seconds = message.seconds;
              updateTimerDisplay();
              const hours = Math.floor(seconds / 3600);
              const newLevel = calculateLevelFromHours(hours);
              setCurrentLevel(newLevel);
            }
            if (message.command === 'requestSeconds') {
              // Send current seconds back to extension
              vscode.postMessage({ 
                command: 'saveSeconds', 
                seconds: seconds 
              });
            }
          });

          // Initialize
          setCurrentLevel(0);
          resetInactivityTimer();
        </script>
      </body>
      </html>`;
  }
    
}