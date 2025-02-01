pcall(vim.api.nvim_clear_autocmds, { group = 'nvim-ui-modes' })
pcall(vim.api.nvim_del_augroup_by_name, 'nvim-ui-modes')
