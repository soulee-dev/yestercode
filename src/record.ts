import * as vscode from 'vscode';
import * as buffers from './buffers';
import { Frame } from './buffers';

export default class Record {
  private timeout: NodeJS.Timer | undefined = undefined;
  private _textEditor: vscode.TextEditor | undefined;
  private _currentChanges: readonly vscode.TextDocumentContentChangeEvent[] = [];
  private _textChanges: Frame[] = [];

  public static start() {
    const record = new Record();
  }

  constructor() {
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

    this._textEditor = vscode.window.activeTextEditor;
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
    if (e.textEditor !== this._textEditor) {
      return;
    }

    if (buffers.getIsReplaying()) {
      return;
    }

    const changes = this._currentChanges;
    this._currentChanges = [];

    this._textChanges.push(changes);

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
    buffers.push(this._textChanges);
    this._textChanges = [];
  }
}
