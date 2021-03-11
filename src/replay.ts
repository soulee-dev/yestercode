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
    for (let changes of Object.values(currentChange)) {
      let change = <vscode.TextDocumentContentChangeEvent[]>changes;
      change.forEach((change) => {
        edits.push(vscode.TextEdit.replace(change.range, change.text));
      });
    }
  });
  let edit = new vscode.WorkspaceEdit();
  edit.set(uri, edits);

  await vscode.workspace.applyEdit(edit).then(() => {
    buffers.setIsReplaying(false);
  });
}
