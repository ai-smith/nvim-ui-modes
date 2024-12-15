import * as vscode from 'vscode';

function getConfiguration(section = '', resource: vscode.Uri | null = null) {
  return vscode.workspace.getConfiguration(section, resource);
}

function getColorCustomizationByModes(config: vscode.WorkspaceConfiguration) {
  const colorCustomizationsByMode = config.get<Record<string, Record<string, string>>>('ColorCustomizationsByModes') || {};
  return colorCustomizationsByMode;
}

function updateColorsSafely(
  workbenchConfig: vscode.WorkspaceConfiguration,
  colorCustomizationsByMode: Record<string, string>
) {
  workbenchConfig.update('colorCustomizations', colorCustomizationsByMode, vscode.ConfigurationTarget.Workspace);
}

export function activate(context: vscode.ExtensionContext) {
  const activeTextEditor = vscode.window.activeTextEditor;
  const resource = activeTextEditor ? activeTextEditor.document.uri : null;

  const workbenchConfig = getConfiguration('workbench', resource);
  const colorCustomizationsByMode = getColorCustomizationByModes(getConfiguration('nvim-theme', resource));

  const modes = ['normal', 'command', 'insert', 'visual', 'replace'];

  modes.forEach((mode) => {
    const disposable = vscode.commands.registerCommand(`nvim-theme.${mode}`, () => {
      updateColorsSafely(workbenchConfig, colorCustomizationsByMode[mode]);
    });
    context.subscriptions.push(disposable);
  });
}

export function deactivate() {}
