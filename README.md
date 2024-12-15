# NeoVim UI Modes

This Visual Studio Code extension dynamically adjusts UI colors based on the current NeoVim mode.

![Demo](resources/demo.gif)

## Modes Supported

- Normal
- Insert
- Visual
- Replace
- Command

## Requirements

- Visual Studio Code 1.96.0 or later
- Neovim integration with VS Code (e.g., via `vscode-neovim` extension)

## Configuration

### VS Code Settings

To customize the colors for each mode, you can modify your `settings.json`:

```json
"nvim-ui.ColorCustomizationsByModes":{
  "normal": {
    "editorCursor.foreground": "#e9dbb7",
    "activityBarBadge.background": "#e9dbb7",
    "activityBarBadge.foreground": "#252525",
    "statusBar.background": "#252525",
    "statusBar.foreground": "#e9dbb7"
  },
  "command": {
    "editorCursor.foreground": "#e9dbb7",
    "activityBarBadge.background": "#252525",
    "activityBarBadge.foreground": "#e9dbb7",
    "statusBar.background": "#e9dbb7",
    "statusBar.foreground": "#252525"
  },
  "insert": {
    "editorCursor.foreground": "#ef857d",
    "activityBarBadge.background": "#e9dbb7",
    "activityBarBadge.foreground": "#252525",
    "statusBar.background": "#a87673",
    "statusBar.foreground": "#252525"
  },
  "visual": {
    "editorCursor.foreground": "#3e97f7",
    "activityBarBadge.background": "#e9dbb7",
    "activityBarBadge.foreground": "#252525",
    "statusBar.background": "#83a3c9",
    "statusBar.foreground": "#252525"
  },
  "replace": {
    "editorCursor.foreground": "#72f59c",
    "activityBarBadge.background": "#e9dbb7",
    "activityBarBadge.foreground": "#252525",
    "statusBar.background": "#c0dcb8",
    "statusBar.foreground": "#252525"
  }
}
```

Supported UI elemants of VScode include:

- `activityBarBadge.background`
- `editorCursor.foreground`
- `inputValidation.errorBorder`
- `panel.border`
- `panelTitle.activeBorder`
- `panelTitle.activeForeground`
- `peekView.border`
- `peekViewTitleLabel.foreground`
- `tab.activeBorder`
- `statusBar.border`
- `statusBar.background`
- `activityBar.background`
- `and more see` [VScode's docs](https://code.visualstudio.com/api/references/theme-color)

> **Note:** These customizations will overwrite any existing values in `workbench.colorCustomizations`.

### Neovim Configuration

To synchronize NeoVim modes with VS Code, add the following to your Neovim `init.vim` or `init.lua`.

#### Example for `init.lua`

```lua
local vscode = require("vscode")

local function send_mode()
    local mode = vim.api.nvim_get_mode().mode
    if mode == "i" then
        vscode.call("nvim-theme.insert")
    elseif mode == "c" or mode == "no" then
        vscode.call("nvim-theme.insert")
    elseif mode == "r" or mode == "R" then
        vscode.call("nvim-theme.insert")
    elseif mode == "n" then
        vscode.call("nvim-theme.insert")
    else
        vscode.call("nvim-theme.insert")
    end
end
send_mode()
vim.api.nvim_create_autocmd({ "InsertEnter", "InsertLeave", "ModeChanged" }, {
    callback = function()
        send_mode()
    end,
}
```

#### Example for `init.vim`

```vim
function! SendMode()
  let l:mode = mode()
  if l:mode == 'i'
    call VSCodeNotify('nvim-theme.insert')
  elseif l:mode == 'c' || l:mode == 'no'
    call VSCodeNotify('nvim-theme.insert')
  elseif l:mode == 'r' || l:mode == 'R'
    call VSCodeNotify('nvim-theme.insert')
  elseif l:mode == 'n'
    call VSCodeNotify('nvim-theme.insert')
  else
    call VSCodeNotify('nvim-theme.insert')
  endif
endfunction

call SendMode()

augroup ModeChange
  autocmd!
  autocmd InsertEnter,InsertLeave,ModeChanged * call SendMode()
augroup END
```

> **Warning:** When uninstalling the extension, ensure to clean up overridden keys in your `settings.json` under `workbench.colorCustomizations`.

If you enjoy this extension, consider supporting me with a small donation:

BTC Address: `bc1qajl9nu6slw0gevk2vhl2qh0u3nepndf786g400`