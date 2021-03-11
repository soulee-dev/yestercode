import * as vscode from 'vscode';

export type Frame = readonly vscode.TextDocumentContentChangeEvent[];

let buffers: [{}] = [[]];
let isReplaying = false;

export function all() {
  return buffers;
}

export function push(buffer: Frame[]) {
  buffers.push(buffer);
}

export function clear() {
  buffers = [[]];
}

export function setIsReplaying(result: boolean) {
  isReplaying = result;
}

export function getIsReplaying() {
  return isReplaying;
}
