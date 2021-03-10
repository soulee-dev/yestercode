import * as vscode from 'vscode';
import * as buffers from './buffers';
import { Frame } from './buffers';

export function start(context: vscode.ExtensionContext) {
  const textChanges = buffers.all();
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage('No active editor');
    return;
  }

  console.log(textChanges);

  textChanges.forEach((currentChange) => {
    Object.entries(currentChange).forEach((item) => {
      const changes = <Frame>item[1];
      //  changes.changes[0]
      if (changes.changes && changes.changes.length > 0) {
        editor.edit((edit) => applyContentChanges(changes.changes, edit));
      } else {
        if (changes.selections.length) {
          updateSelections(changes.selections, editor);
        }
      }
    });
  });
}

function updateSelections(
  selections: readonly vscode.Selection[],
  editor: vscode.TextEditor
) {
  editor.selections = <vscode.Selection[]>selections;

  // move scroll focus if needed
  const { start, end } = editor.selections[0];
  editor.revealRange(
    new vscode.Range(start, end),
    vscode.TextEditorRevealType.InCenterIfOutsideViewport
  );
}

function applyContentChanges(
  changes: readonly vscode.TextDocumentContentChangeEvent[],
  edit: vscode.TextEditorEdit
) {
  changes.forEach((change) => {
    applyContentChange(change, edit);
  });
}

function applyContentChange(
  change: vscode.TextDocumentContentChangeEvent,
  edit: vscode.TextEditorEdit
) {
  // if (change.text === '') {
  //   edit.delete(change.range);
  // } else if (change.rangeLength === 0) {
  //   edit.insert(change.range.start, change.text);
  // } else {
  //   edit.replace(change.range, change.text);
  // }
  console.log(change.text);
  if (change.text === '') {
    edit.delete(change.range);
  } else if (change.rangeLength === 0) {
    edit.insert(change.range.start, change.text);
  } else {
    edit.replace(change.range, change.text);
  }
}
