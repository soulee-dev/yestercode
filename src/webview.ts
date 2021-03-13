import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as replay from './replay';

let currentPanel: vscode.WebviewPanel | undefined = undefined;

export function loadWebView(context: vscode.ExtensionContext) {
  if (currentPanel) {
    currentPanel.reveal(vscode.ViewColumn.One);
  } else {
    currentPanel = vscode.window.createWebviewPanel(
      'yestercode',
      'yesrercode',
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

  return currentPanel;
}

export function onDidReceiveMessage(
  message: any,
  textEditor: vscode.TextEditor | undefined
) {
  switch (message.command) {
    case 'recover':
      console.log('wow');
      replay.start(textEditor, Number(message.text), Number(message.text) + 1);
      return;
  }
}
