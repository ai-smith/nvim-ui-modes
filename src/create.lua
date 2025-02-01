local vscode = require('vscode')
local function send_mode()
  local mode = vim.api.nvim_get_mode().mode
  if mode == 'i' or mode == '' then
    vscode.call('nvim-ui-modes.insert')
  elseif mode == 'c' then
    vscode.call('nvim-ui-modes.command')
  elseif mode == 'R' then
    vscode.call('nvim-ui-modes.replace')
  elseif mode == 'n' then
    vscode.call('nvim-ui-modes.normal')
  elseif mode == 'V' or mode == 'v' or mode == '\\x16' then
    vscode.call('nvim-ui-modes.visual')
  end
end
local group = vim.api.nvim_create_augroup('nvim-ui-modes', { clear = true })
send_mode()
vim.api.nvim_create_autocmd({ 'InsertEnter', 'InsertLeave', 'ModeChanged' }, {
  group = group,
  callback = function()
    send_mode()
  end,
})
