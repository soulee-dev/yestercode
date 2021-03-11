import * as vscode from 'vscode';
import * as buffers from './buffers';

export async function start(context: vscode.ExtensionContext) {
  const textChanges = buffers.all();
  const editor = vscode.window.activeTextEditor;

  buffers.setIsReplaying(true);

  if (!editor) {
    vscode.window.showErrorMessage('No active editor');
    return;
  }

  let uri = editor.document.uri;
  let edits: vscode.TextEdit[] = [];

  textChanges.forEach((currentChange) => {
    currentChange.forEach((changes) => {
      changes.forEach((change) => {
        if (change.text === '') {
          edits.push(vscode.TextEdit.delete(change.range));
        } else if (change.rangeLength === 0) {
          edits.push(vscode.TextEdit.insert(change.range.start, change.text));
        } else {
          edits.push(vscode.TextEdit.replace(change.range, change.text));
        }
        buffers.pushReplayDecorations(change.range);
      });
    });
  });
  let edit = new vscode.WorkspaceEdit();
  edit.set(uri, edits);

  await vscode.workspace.applyEdit(edit).then(() => {
    buffers.setIsReplaying(false);
  });
}

export function onBackspace() {
  vscode.commands.executeCommand('deleteLeft').then(() => {});
}
