import * as vscode from 'vscode';
import * as buffers from './buffers';
import { Position } from 'vscode';

export async function start(context: vscode.ExtensionContext) {
  const textChanges = buffers.all();
  const editor = vscode.window.activeTextEditor;
  const textChangeDecorations: vscode.DecorationOptions[] = [];

  buffers.setIsReplaying(true);

  if (!editor) {
    vscode.window.showErrorMessage('No active editor');
    return;
  }

  let uri = editor.document.uri;
  let edits: vscode.TextEdit[] = [];

  textChanges.forEach((frameList) => {
    frameList.forEach(async (frame) => {
      const [changes, selections] = frame;
      changes.forEach((change) => {
        if (change.text === '') {
          edits.push(vscode.TextEdit.delete(change.range));
        } else if (change.rangeLength === 0) {
          edits.push(vscode.TextEdit.insert(change.range.start, change.text));
        } else {
          edits.push(vscode.TextEdit.replace(change.range, change.text));
        }
        textChangeDecorations.push({ range: change.range });
      });
    });
  });

  let edit = new vscode.WorkspaceEdit();
  edit.set(uri, edits);

  await vscode.workspace.applyEdit(edit).then(() => {
    buffers.setIsReplaying(false);
  });

  editor.setDecorations(
    buffers.getReplayDecorationType(),
    textChangeDecorations
  );
}
