import * as vscode from 'vscode';
import Record from './record';
import * as replay from './replay';
import loadWebView from './webview';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "yestercode" is now active!');

  let start = vscode.commands.registerCommand('yestercode.start', () => {
    Record.start();
  });

  let play = vscode.commands.registerCommand('yestercode.replay', () => {
    replay.start(context);

    // loadWebView(context);
  });

  let webview = vscode.commands.registerCommand('yestercode.webview', () => {
    // Webview commands
  });

  context.subscriptions.push(start, play, webview);
}

export function deactivate() {}
