import * as vscode from 'vscode';

function updateColors(
  workbenchConfig: vscode.WorkspaceConfiguration,
  colorCustomizationsByMode: Record<string, string>
) {
  workbenchConfig.update('colorCustomizations', colorCustomizationsByMode, vscode.ConfigurationTarget.Workspace);
}

interface CommandArgs {
  workbenchConfig: vscode.WorkspaceConfiguration;
  colorCustomizationsByMode: Record<string, Record<string, string>>;
}

export const commands = ({
  workbenchConfig,
  colorCustomizationsByMode,
}: CommandArgs) => {
  const modes = ['normal', 'command', 'insert', 'visual', 'replace'];

  return modes.map((mode) =>
    vscode.commands.registerCommand(`nvim-theme.${mode}`, function () {
      updateColors(workbenchConfig, colorCustomizationsByMode[mode]);
    })
  );
};
