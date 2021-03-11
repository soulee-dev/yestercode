import * as vscode from 'vscode';

export type Frame = readonly vscode.TextDocumentContentChangeEvent[];

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

const replayDecorations: vscode.DecorationOptions[] = [];

let buffers: Frame[][] = [];
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

export function poplast() {
  let temp = buffers.pop();
  if (!temp) {
    return;
  }

  temp.pop();

  push(temp);
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

export function pushReplayDecorations(range: vscode.Range) {
  replayDecorations.push({ range: range });
}

export function getReplayDecorations() {
  return replayDecorations;
}
