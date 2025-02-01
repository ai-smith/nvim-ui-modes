import * as vscode from 'vscode';
import createLua from './create.lua?raw';
import deleteLua from './delete.lua?raw';

function getExtentionId() {
  return 'nvim-ui-modes';
}

const luaCreateConfig = createLua.split('\n');

const luaDeleteConfig = deleteLua.split('\n');


function getConfiguration(section = '', resource: vscode.Uri | null = null) {
  return vscode.workspace.getConfiguration(section, resource);
}

function getColorCustomization(config: vscode.WorkspaceConfiguration) {
  const colorCustomizations = config.get<Record<string, Record<string, string>>>('colorCustomizations') || {};
  return colorCustomizations;
}

function updateColors(
  workbenchConfig: vscode.WorkspaceConfiguration,
  colorCustomizations: Record<string, string>
) {
  workbenchConfig.update('colorCustomizations', colorCustomizations, vscode.ConfigurationTarget.Workspace);
}

function executeCommand(luaCode: string[]) {
  vscode.commands.executeCommand('vscode-neovim.lua', luaCode);
}

export function activate(context: vscode.ExtensionContext) {
  const id = getExtentionId();
  const activeTextEditor = vscode.window.activeTextEditor;
  const resource = activeTextEditor ? activeTextEditor.document.uri : null;

  const workbenchConfig = getConfiguration('workbench', resource);
  const colorCustomizations = getColorCustomization(getConfiguration(id, resource));

  const modes = ['normal', 'command', 'insert', 'visual', 'replace'];

  modes.forEach((mode) => {
    const disposable = vscode.commands.registerCommand(`${id}.${mode}`, () => {
      updateColors(workbenchConfig, colorCustomizations[mode]);
    });
    context.subscriptions.push(disposable);
  });

  const interval = setInterval(async () => {
    const commands = await vscode.commands.getCommands(true);
    if (commands.includes('vscode-neovim.lua')) {
      executeCommand(luaCreateConfig)
      clearInterval(interval);
    }
  }, 1000);
}

export function deactivate() {
  executeCommand(luaDeleteConfig)
}
