import { Extension } from '@tiptap/core'
import { InputRule } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'

// 表格扩展，支持Markdown语法
export const TableExtension = Extension.create({
  name: 'tableExtension',

  addExtensions() {
    return [
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'table-auto border-collapse border border-gray-300',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-gray-300',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 font-semibold text-left p-2 border border-gray-300',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'p-2 border border-gray-300',
        },
      }),
    ]
  },

  addProseMirrorPlugins() {
    return [
      // 只添加粘贴处理插件，不重复添加表格插件
      new Plugin({
        key: new PluginKey('handleMarkdownTablePaste'),
        props: {
          handlePaste: (view, event, slice) => {
            const text = event.clipboardData?.getData('text/plain')
            if (text && this.isMarkdownTable(text)) {
              const table = parseMarkdownTable(text)
              if (table && table.rows.length > 0) {
                const { state, dispatch } = view
                const { tr } = state
                
                // 创建表格节点
                const bodyRows = []
                
                // 创建表头
                if (table.hasHeader && table.rows[0]) {
                  const headerCells = table.rows[0].map(cellText => 
                    state.schema.nodes.tableHeader.create({}, 
                      cellText ? state.schema.text(cellText.trim()) : null
                    )
                  )
                  const headerRowNode = state.schema.nodes.tableRow.create({}, headerCells)
                  bodyRows.push(headerRowNode)
                }
                
                // 创建数据行
                for (let i = table.hasHeader ? 1 : 0; i < table.rows.length; i++) {
                  const row = table.rows[i]
                  const cells = row.map(cellText => 
                    state.schema.nodes.tableCell.create({}, 
                      cellText ? state.schema.text(cellText.trim()) : null
                    )
                  )
                  const rowNode = state.schema.nodes.tableRow.create({}, cells)
                  bodyRows.push(rowNode)
                }
                
                const completeTable = state.schema.nodes.table.create({}, bodyRows)
                const pos = state.selection.from
                tr.insert(pos, completeTable)
                
                dispatch(tr)
                return true
              }
            }
            return false
          },
        },
      }),
    ]
  },

  addCommands() {
    return {
      // 插入表格
      insertTable: (options = {}) => ({ commands }) => {
        const { rows = 3, cols = 3, withHeaderRow = true } = options
        return commands.insertTable({ rows, cols, withHeaderRow })
      },

      // 添加列（前）
      addColumnBefore: () => ({ commands }) => {
        return commands.addColumnBefore()
      },

      // 添加列（后）
      addColumnAfter: () => ({ commands }) => {
        return commands.addColumnAfter()
      },

      // 删除列
      deleteColumn: () => ({ commands }) => {
        return commands.deleteColumn()
      },

      // 添加行（前）
      addRowBefore: () => ({ commands }) => {
        return commands.addRowBefore()
      },

      // 添加行（后）
      addRowAfter: () => ({ commands }) => {
        return commands.addRowAfter()
      },

      // 删除行
      deleteRow: () => ({ commands }) => {
        return commands.deleteRow()
      },

      // 删除表格
      deleteTable: () => ({ commands }) => {
        return commands.deleteTable()
      },

      // 合并单元格
      mergeCells: () => ({ commands }) => {
        return commands.mergeCells()
      },

      // 拆分单元格
      splitCell: () => ({ commands }) => {
        return commands.splitCell()
      },

      // 切换表头行
      toggleHeaderRow: () => ({ commands }) => {
        return commands.toggleHeaderRow()
      },

      // 切换表头列
      toggleHeaderColumn: () => ({ commands }) => {
        return commands.toggleHeaderColumn()
      },

      // 从Markdown创建表格
      createTableFromMarkdown: (markdown) => ({ commands, editor, tr, state }) => {
        const table = parseMarkdownTable(markdown)
        if (table) {
          // 先插入表格结构
          const insertResult = commands.insertTable({
            rows: table.rows.length,
            cols: table.cols,
            withHeaderRow: table.hasHeader
          })
          
          if (insertResult) {
            // 延迟填充内容，确保表格已经渲染
            setTimeout(() => {
              if (editor && table.rows.length > 0) {
                // 填充表头
                if (table.hasHeader && table.rows[0]) {
                  table.rows[0].forEach((header, colIndex) => {
                    if (colIndex === 0) {
                      editor.commands.insertContent(header || '')
                    } else {
                      editor.commands.goToNextCell()
                      editor.commands.insertContent(header || '')
                    }
                  })
                }
                
                // 填充数据行
                for (let rowIndex = 1; rowIndex < table.rows.length; rowIndex++) {
                  const row = table.rows[rowIndex]
                  row.forEach((cell, colIndex) => {
                    editor.commands.goToNextCell()
                    editor.commands.insertContent(cell || '')
                  })
                }
              }
            }, 100)
          }
          
          return insertResult
        }
        return false
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      // Tab键在表格中移动到下一个单元格
      Tab: () => {
        if (this.editor.isActive('table')) {
          return this.editor.commands.goToNextCell()
        }
        return false
      },
      // Shift+Tab在表格中移动到上一个单元格
      'Shift-Tab': () => {
        if (this.editor.isActive('table')) {
          return this.editor.commands.goToPreviousCell()
        }
        return false
      },
    }
  },

  addInputRules() {
    return [
      // 检测完整的 Markdown 表格
      new InputRule({
        find: /(\|[^\n]*\|\s*\n\|[-:| ]+\|\s*\n(?:\|[^\n]*\|\s*\n?)*)/g,
        handler: ({ state, range, match, commands }) => {
          const markdownTable = match[1]
          const table = parseMarkdownTable(markdownTable)
          
          if (table && table.rows.length > 0) {
            const { tr } = state
            const start = range.from
            const end = range.to
            
            // 删除匹配的文本
            tr.delete(start, end)
            
            // 创建表格节点
            const tableNode = state.schema.nodes.table.create()
            const headerRow = state.schema.nodes.tableRow.create()
            const bodyRows = []
            
            // 创建表头
            if (table.hasHeader && table.rows[0]) {
              const headerCells = table.rows[0].map(cellText => 
                state.schema.nodes.tableHeader.create({}, 
                  cellText ? state.schema.text(cellText) : null
                )
              )
              const headerRowNode = state.schema.nodes.tableRow.create({}, headerCells)
              bodyRows.push(headerRowNode)
            }
            
            // 创建数据行
            for (let i = table.hasHeader ? 1 : 0; i < table.rows.length; i++) {
              const row = table.rows[i]
              const cells = row.map(cellText => 
                state.schema.nodes.tableCell.create({}, 
                  cellText ? state.schema.text(cellText) : null
                )
              )
              const rowNode = state.schema.nodes.tableRow.create({}, cells)
              bodyRows.push(rowNode)
            }
            
            const completeTable = state.schema.nodes.table.create({}, bodyRows)
            tr.insert(start, completeTable)
            
            return tr
          }
          
          return null
        },
      }),
    ]
  },

  // 检测是否为 Markdown 表格格式
  isMarkdownTable(text) {
    const lines = text.trim().split('\n')
    if (lines.length < 2) return false
    
    // 检查是否包含表格分隔符
    const hasTableSeparator = lines.some(line => 
      line.includes('|') && /\|\s*[-:]+\s*\|/.test(line)
    )
    
    // 检查是否有表格行
    const hasTableRows = lines.filter(line => 
      line.trim().startsWith('|') && line.trim().endsWith('|')
    ).length >= 2
    
    return hasTableSeparator && hasTableRows
  },
})

// 解析Markdown表格的辅助函数
function parseMarkdownTable(markdown) {
  const lines = markdown.trim().split('\n')
  if (lines.length < 2) return null
  
  // 检查是否是有效的表格格式
  const headerLine = lines[0]
  const separatorLine = lines[1]
  
  if (!headerLine.includes('|') || !separatorLine.includes('|')) {
    return null
  }
  
  // 解析表头
  const headers = headerLine.split('|').map(cell => cell.trim()).filter(cell => cell)
  const cols = headers.length
  
  // 解析分隔符行（检查是否有效）
  const separators = separatorLine.split('|').map(cell => cell.trim()).filter(cell => cell)
  if (separators.length !== cols) return null
  
  // 检查分隔符是否有效（应该包含至少一个-）
  const validSeparators = separators.every(sep => /^:?-+:?$/.test(sep))
  if (!validSeparators) return null
  
  // 解析数据行
  const dataRows = lines.slice(2).filter(line => line.trim() && line.includes('|'))
  
  return {
    cols,
    rows: [headers, ...dataRows.map(row => 
      row.split('|').map(cell => cell.trim()).filter(cell => cell)
    )],
    hasHeader: true
  }
}

// 导出默认配置
export default TableExtension

// 导出表格相关的工具函数
export const tableUtils = {
  // 将表格转换为Markdown格式
  tableToMarkdown(tableNode) {
    const rows = []
    
    tableNode.content.forEach((row, rowIndex) => {
      const cells = []
      row.content.forEach(cell => {
        cells.push(cell.textContent || '')
      })
      rows.push(`| ${cells.join(' | ')} |`)
      
      // 在第一行后添加分隔符
      if (rowIndex === 0) {
        const separator = cells.map(() => '---').join(' | ')
        rows.push(`| ${separator} |`)
      }
    })
    
    return rows.join('\n')
  },
  
  // 从Markdown创建表格数据
  markdownToTableData(markdown) {
    return parseMarkdownTable(markdown)
  }
}