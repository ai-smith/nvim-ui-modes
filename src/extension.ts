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
  colorCustomizations: Record<string, string>,
  configrationTarget: vscode.ConfigurationTarget
) {
  workbenchConfig.update('colorCustomizations', colorCustomizations, configrationTarget);
}

function executeCommand(luaCode: string[]) {
  vscode.commands.executeCommand('vscode-neovim.lua', luaCode);
}

function loadConfigrationTargetSetting(settingId: string)
{
  return getConfiguration().get<string>(settingId,'Global');
}

function getConfigrationTarget(configrationTarget: string) {
  switch (configrationTarget) {
    case 'Global':
      return vscode.ConfigurationTarget.Global;
    case 'Workspace':
      return vscode.ConfigurationTarget.Workspace;
    case 'WorkspaceFolder':
      return vscode.ConfigurationTarget.WorkspaceFolder;
    default:
      return vscode.ConfigurationTarget.Global;
  }
}

export function activate(context: vscode.ExtensionContext) {
  const id = getExtentionId();
  const activeTextEditor = vscode.window.activeTextEditor;
  const resource = activeTextEditor ? activeTextEditor.document.uri : null;

  const workbenchConfig = getConfiguration('workbench', resource);
  const colorCustomizations = getColorCustomization(getConfiguration(id, resource));
  const target = loadConfigrationTargetSetting(`${id}.configrationTarget`);
  const configrationTarget = getConfigrationTarget(target);

  const modes = ['normal', 'command', 'insert', 'visual', 'replace'];

  modes.forEach((mode) => {
    const disposable = vscode.commands.registerCommand(`${id}.${mode}`, () => {
      updateColors(workbenchConfig, colorCustomizations[mode], configrationTarget);
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
