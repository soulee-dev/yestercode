import * as vscode from 'vscode';

export type Frame = {
  changes: readonly vscode.TextDocumentContentChangeEvent[];
  selections: readonly vscode.Selection[];
};

let buffers: [{}] = [{}];

export function all() {
  return buffers;
}

export function push(buffer: Frame[]) {
  buffers.push(buffer);
}

export function clear() {
  buffers = [[]];
}
