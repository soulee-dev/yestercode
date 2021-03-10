import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

let currentPanel: vscode.WebviewPanel | undefined = undefined;

export default function loadWebView(context: vscode.ExtensionContext) {
  if (currentPanel) {
    currentPanel.reveal(vscode.ViewColumn.One);
  } else {
    currentPanel = vscode.window.createWebviewPanel(
      'catCoding', // internal name
      'Cat Coding', // title name
      vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );
  }

  fs.readFile(
    path.join(context.extensionPath, 'src', 'webview.html'),
    'utf8',
    (err: any, data: string) => {
      if (!currentPanel) {
        return;
      }
      if (err) {
        console.error(err);
      }

      currentPanel.webview.html = data;
    }
  );
}
