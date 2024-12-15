// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { commands } from './commands';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function getConfiguration(section = '') {
  const activeTextEditor = vscode.window.activeTextEditor;
  const resource = activeTextEditor ? activeTextEditor.document.uri : null;
  return vscode.workspace.getConfiguration(section, resource);
}

function getColorCustomizationByModes(config: vscode.WorkspaceConfiguration) {
  const colorCustomizationsByMode = config.get<Record<string, Record<string, string>>>('ColorCustomizationsByModes') || {}
  return colorCustomizationsByMode;
}

export function activate(context: vscode.ExtensionContext) {
  const workbenchConfig = getConfiguration('workbench');
  const colorCustomizationsByMode = getColorCustomizationByModes(getConfiguration('nvim-ui'));

  commands({
    workbenchConfig,
    colorCustomizationsByMode
  }).forEach((cmd) => context.subscriptions.push(cmd));
}

// this method is called when your extension is deactivated
export function deactivate() {}
