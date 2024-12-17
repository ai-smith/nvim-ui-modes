import * as vscode from 'vscode';

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

const luaCreateConfig = [
  "local vscode = require('vscode')",
  "local function send_mode()",
  "  local mode = vim.api.nvim_get_mode().mode",
  "  if mode == 'i' or mode == '' then",
  "    vscode.call('nvim-ui-modes.insert')",
  "  elseif mode == 'c' then",
  "    vscode.call('nvim-ui-modes.command')",
  "  elseif mode == 'R' then",
  "    vscode.call('nvim-ui-modes.replace')",
  "  elseif mode == 'n' then",
  "    vscode.call('nvim-ui-modes.normal')",
  "  elseif mode == 'V' or mode == 'v' or mode == '^V' then",
  "    vscode.call('nvim-ui-modes.visual')",
  "  end",
  "end",
  "local group = vim.api.nvim_create_augroup('nvim-ui-modes', { clear = true })",
  "send_mode()",
  "vim.api.nvim_create_autocmd({ 'InsertEnter', 'InsertLeave', 'ModeChanged' }, {",
  "  group = group,",
  "  callback = function()",
  "    send_mode()",
  "  end,",
  "})"
];

const luaDeleteConfig = [
  "pcall(vim.api.nvim_clear_autocmds, { group = 'nvim-ui-modes' })",
  "pcall(vim.api.nvim_del_augroup_by_name, 'nvim-ui-modes')"
];

function executeCommand(luaCode: string[]) {
  vscode.commands.executeCommand('vscode-neovim.lua', luaCode);
}

export function activate(context: vscode.ExtensionContext) {
  const activeTextEditor = vscode.window.activeTextEditor;
  const resource = activeTextEditor ? activeTextEditor.document.uri : null;

  const workbenchConfig = getConfiguration('workbench', resource);
  const colorCustomizations = getColorCustomization(getConfiguration('nvim-ui-modes', resource));

  const modes = ['normal', 'command', 'insert', 'visual', 'replace'];

  modes.forEach((mode) => {
    const disposable = vscode.commands.registerCommand(`nvim-ui-modes.${mode}`, () => {
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
