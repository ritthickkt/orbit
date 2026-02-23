import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri, context);
  let lastSave = 0;
  const SAVE_INTERVAL = 30000;

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("orbit.view", sidebarProvider, {
      webviewOptions: { retainContextWhenHidden: true }
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (!sidebarProvider._view) { return; }

      sidebarProvider._view.webview.postMessage({
        command: 'userActive',
        language: event.document.languageId
      });

      const now = Date.now();
      if (now - lastSave > SAVE_INTERVAL) {
        lastSave = now;
        sidebarProvider._view.webview.postMessage({ command: 'requestState' });
      }
    })
  );
}

export function deactivate() {}
