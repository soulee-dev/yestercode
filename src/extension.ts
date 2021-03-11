import * as vscode from 'vscode';
var fs = require('fs');
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "5mincode" is now active!');

  let timeout: NodeJS.Timer | undefined = undefined;
  let activeEditor = vscode.window.activeTextEditor;
  let savedCode: { range: vscode.Range; code: string; time: number }[] = [];
  let currentPanel: vscode.WebviewPanel | undefined = undefined;
  let _currentChanges: vscode.TextDocumentContentChangeEvent[] = [];

  const smallNumbers: vscode.DecorationOptions[] = [];

  let disposable = vscode.commands.registerCommand(
    '5mincode.helloWorld',
    () => {
      // Create and show a new webvie

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

      currentPanel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case 'recovery':
              vscode.window.showErrorMessage(savedCode[message.text].code);
              editText(
                savedCode[message.text].range,
                savedCode[message.text].code
              );
              return;
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );
  context.subscriptions.push(disposable);

  const smallNumberDecorationType = vscode.window.createTextEditorDecorationType(
    {
      borderWidth: '1px',
      borderStyle: 'solid',
      overviewRulerColor: 'blue',
      overviewRulerLane: vscode.OverviewRulerLane.Right,
      light: {
        // this color will be used in light color themes
        borderColor: 'darkblue',
      },
      dark: {
        // this color will be used in dark color themes
        borderColor: 'lightblue',
      },
    }
  );

  function editText(range: vscode.Range, code: string) {
    // line by line 으로 저장하는거니까, 그 라인을 지우고 라인에 replace
    // reconstruct 하는거처럼 backtracking 해야 될듯

    if (!activeEditor) {
      return;
    }
    const edit = new vscode.WorkspaceEdit();
    const line = range.start.line;
    const start = new vscode.Position(line, 0);
    const end = new vscode.Position(line + 1, 0);
    const one_line = new vscode.Range(start, end);

    smallNumbers.push({ range: range });

    edit.replace(activeEditor.document.uri, one_line, '\n');
    vscode.workspace.applyEdit(edit).then(() => {
      if (!activeEditor) {
        return;
      }
      edit.replace(activeEditor.document.uri, range, code);
      vscode.workspace.applyEdit(edit);
    });
  }

  function textUpdated() {
    if (!currentPanel) {
      return;
    }

    if (!activeEditor) {
      return;
    }

    // https://github.com/microsoft/vscode-extension-samples/blob/main/decorator-sample/src/extension.ts 참조
    // TODO
    // split configuration

    activeEditor.setDecorations(smallNumberDecorationType, smallNumbers);

    const text = activeEditor.document.getText();
    const splited = text.split('\r\n');
    console.log(splited[splited.length - 1]);

    // https://code.visualstudio.com/api/references/vscode-api
    // position at 쓸려면 지금까지 idx + /r/n 갯수 함치면 될듯

    const line = activeEditor.document.lineAt(
      activeEditor.document.positionAt(splited.length).line
    );
    const indexOf = line.text.indexOf(splited[0]);
    const position = new vscode.Position(line.lineNumber, indexOf);
    const range = activeEditor.document.getWordRangeAtPosition(
      position,
      /(\r\n|\r|\n)/g
    );

    if (range) {
      savedCode.push({
        range: range,
        code: activeEditor.document.getText(range),
        time: new Date().getTime() / 1000,
      });

      console.log(savedCode);
      currentPanel.webview.postMessage(savedCode);
    }
  }

  function triggerTextUpdated() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    timeout = setTimeout(textUpdated, 500);
  }

  if (activeEditor) {
    triggerTextUpdated();
  }

  //   vscode.window.onDidChangeActiveTextEditor(
  //     (editor) => {
  //       activeEditor = editor;
  //       if (editor) {
  //         triggerTextUpdated();
  //       }
  //     },
  //     null,
  //     context.subscriptions
  //   );

  //   vscode.workspace.onDidChangeTextDocument(
  //     (event) => {
  //       if (activeEditor && event.document === activeEditor.document) {
  //         triggerTextUpdated();
  //       }
  //     },
  //     null,
  //     context.subscriptions
  //   );

  vscode.workspace.onDidChangeTextDocument(
    onDidChangeTextDocument,
    null,
    context.subscriptions
  );

  function onDidChangeTextDocument(e: vscode.TextDocumentChangeEvent) {
    console.log(e.contentChanges);
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
