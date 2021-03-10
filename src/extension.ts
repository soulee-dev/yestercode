import * as vscode from 'vscode';
import Record from './record';
import Replay from './replay';
import loadWebView from './webview';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "yestercode" is now active!');

  let start = vscode.commands.registerCommand('yestercode.start', () => {
    vscode.window.showInformationMessage('Hello World from yestercode!');
    Record.start();
  });

  let replay = vscode.commands.registerCommand('yestercode.replay', () => {
    Replay.start();
    loadWebView(context);
  });

  let webview = vscode.commands.registerCommand('yestercode.webview', () => {
    // Webview commands
  });

  context.subscriptions.push(start, replay, webview);
}

export function deactivate() {}
