import * as vscode from 'vscode';

export type Frame = [
  vscode.TextDocumentContentChangeEvent[],
  vscode.Selection[]
];

const replayDecorationType = vscode.window.createTextEditorDecorationType({
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
});

let buffers: Frame[][] = [];
let isReplaying = false;

export function all() {
  return buffers;
}

export function push(buffer: Frame[]) {
  buffers.push(buffer);
}

export function clear() {
  buffers = [];
}

export function count() {
  return buffers.length;
}

export function get(start: number, end: number) {
  return buffers.slice(start, end);
}

export function setIsReplaying(result: boolean) {
  isReplaying = result;
}

export function getIsReplaying() {
  return isReplaying;
}

export function getReplayDecorationType() {
  return replayDecorationType;
}
