import * as vscode from 'vscode';
import Record from './record';
import { loadWebView, onDidReceiveMessage } from './webview';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "yestercode" is now active!');

  let currentPanel: vscode.WebviewPanel;

  let start = vscode.commands.registerCommand('yestercode.start', () => {
    currentPanel = loadWebView(context);
    const recorder = new Record(currentPanel);
    const editor = recorder.getEditor();

    currentPanel.webview.onDidReceiveMessage((message) =>
      onDidReceiveMessage(message, editor)
    );
  });

  context.subscriptions.push(start);
}

export function deactivate() {}
