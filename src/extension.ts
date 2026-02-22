import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  let lastHeartbeat = 0;
  const SAVE_INTERVAL = 60000; // Save every 60 seconds

  // Register the sidebar
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "orbit.view",
      sidebarProvider
    )
  );

  // Listen for text document changes (typing)
  vscode.workspace.onDidChangeTextDocument(async (event) => {
    if (sidebarProvider._view) {
      sidebarProvider._view.webview.postMessage({ command: 'userActive' });
      
      // Save time every 60 seconds
      const now = Date.now();
      if (now - lastHeartbeat > SAVE_INTERVAL) {
        lastHeartbeat = now;
        // Request current seconds from webview
        sidebarProvider._view.webview.postMessage({ command: 'requestSeconds' });
      }
    }
  });

  // Handle messages from the webview
  if (sidebarProvider._view) {
    sidebarProvider._view.webview.onDidReceiveMessage(async (message) => {
      if (message.command === 'saveSeconds') {
        // Save total seconds to global state
        await context.globalState.update('totalSeconds', message.seconds);
      }
    });
  }

  // Load saved time when extension activates
  const loadSavedTime = async () => {
    const savedSeconds = await context.globalState.get('totalSeconds') || 0;
    if (sidebarProvider._view) {
      sidebarProvider._view.webview.postMessage({ 
        command: 'setSeconds', 
        seconds: savedSeconds 
      });
    }
  };  // Load saved time after a short delay to ensure webview is ready
  setTimeout(loadSavedTime, 500);
}

export function deactivate() {}