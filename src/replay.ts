import * as vscode from 'vscode';
import * as buffers from './buffers';

export async function start(
  textEditor: vscode.TextEditor | undefined,
  start: number,
  end: number
) {
  const textChanges = buffers.get(start, end);
  console.log(textChanges);

  if (!textEditor) {
    vscode.window.showErrorMessage('No active editor');
    return;
  }

  applyChange(textEditor, textChanges);
}

async function applyChange(
  textEditor: vscode.TextEditor,
  textChanges: buffers.Frame[][]
) {
  let textChangeDecorations: vscode.DecorationOptions[] = [];
  let edits: vscode.TextEdit[] = [];
  let uri = textEditor.document.uri;

  buffers.setIsReplaying(true);

  textChanges.forEach((frameList) => {
    frameList.forEach(async (frame) => {
      const [changes, selections] = frame;
      changes.forEach((change) => {
        if (change.text === '') {
          edits.push(vscode.TextEdit.delete(change.range));
        } else {
          edits.push(vscode.TextEdit.insert(change.range.start, change.text));
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

  textEditor.setDecorations(
    buffers.getReplayDecorationType(),
    textChangeDecorations
  );
}
