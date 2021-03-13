import * as vscode from 'vscode';
import * as buffers from './buffers';
import { Frame } from './buffers';

export default class Record {
  private timeout: NodeJS.Timer | undefined = undefined;
  public readonly textEditor: vscode.TextEditor | undefined;
  private _currentChanges:
    | readonly vscode.TextDocumentContentChangeEvent[]
    | undefined;

  private _currentPanel: vscode.WebviewPanel | undefined = undefined;

  private _textChanges: Frame[] = [];

  constructor(currentPanel: vscode.WebviewPanel) {
    let subscriptions: vscode.Disposable[] = [];

    vscode.workspace.onDidChangeTextDocument(
      this.onDidChangeTextDocument,
      this,
      subscriptions
    );

    vscode.window.onDidChangeTextEditorSelection(
      this.onDidChangeTextEditorSelection,
      this,
      subscriptions
    );

    this.textEditor = vscode.window.activeTextEditor;
    this._currentPanel = currentPanel;
  }

  getEditor(): vscode.TextEditor | undefined {
    if (!this.textEditor) {
      return;
    }

    return this.textEditor;
  }

  private onDidChangeTextDocument(e: vscode.TextDocumentChangeEvent) {
    if (buffers.getIsReplaying()) {
      return;
    }

    this._currentChanges = e.contentChanges;
  }

  private onDidChangeTextEditorSelection(
    e: vscode.TextEditorSelectionChangeEvent
  ) {
    // if (e.textEditor !== this._textEditor) {
    //   console.log('no editor');
    //   return;
    // }

    if (buffers.getIsReplaying()) {
      return;
    }

    const changes = <vscode.TextDocumentContentChangeEvent[]>(
      this._currentChanges
    );
    const selections = <vscode.Selection[]>e.selections || [];
    this._textChanges.push([changes, selections]);

    this.triggerSaveOnBuffer();
  }

  private triggerSaveOnBuffer() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }

    this.saveOnBuffer = this.saveOnBuffer.bind(this);

    this.timeout = setTimeout(this.saveOnBuffer, 500);
  }

  private saveOnBuffer() {
    if (!this.textEditor) {
      return;
    }

    if (!this._currentPanel) {
      return;
    }

    this.textEditor.setDecorations(buffers.getReplayDecorationType(), []);
    buffers.push(this._textChanges);

    this._currentPanel.webview.postMessage(buffers.count());
    console.log(buffers.all());

    this._textChanges = [];
  }
}
