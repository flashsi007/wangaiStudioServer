import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import CommandsList from '../CommandsList.vue'

export default {
  items: ({ query }) => {
    const commands = [
      {
        title: 'AI助手',
        description: '调用AI助手进行智能写作',
        searchTerms: ['ai', 'assistant', '助手', 'bot'],
        icon: 'Bot',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .openAIChat()
            .run()
        },
      },
      {
        title: 'h1',
        description: '一级标题',
        searchTerms: ['heading1', 'title', 'h1', '标题'],
        icon: 'Heading1',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 1 })
            .run()
        },
      },
      {
        title: 'h2',
        description: '二级标题',
        searchTerms: ['heading2', 'subtitle', 'h2', '标题'],
        icon: 'Heading2',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 2 })
            .run()
        },
      },
      {
        title: 'h3',
        description: '三级标题',
        searchTerms: ['heading3', 'h3', '标题'],
        icon: 'Heading3',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 3 })
            .run()
        },
      },
      {
        title: 'h4',
        description: '四级标题',
        searchTerms: ['heading4', 'h4', '标题'],
        icon: 'Heading4',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 4 })
            .run()
        },
      },
      {
        title: '无序列表',
        description: '创建无序列表',
        searchTerms: ['bullet', 'unordered', 'list', '列表'],
        icon: 'List',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleBulletList()
            .run()
        },
      },
      {
        title: '有序列表',
        description: '创建有序列表',
        searchTerms: ['numbered', 'ordered', 'list', '列表'],
        icon: 'ListOrdered',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleOrderedList()
            .run()
        },
      },
      {
        title: 'todoList',
        description: '创建待办事项列表',
        searchTerms: ['todo', 'task', 'checklist', '待办', '任务'],
        icon: 'LayoutList',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleTaskList()
            .run()
        },
      },
      {
        title: '代码块',
        description: '插入代码块，支持多种编程语言',
        searchTerms: ['code', 'codeblock', '代码', 'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss', 'less', 'vue', 'react'],
        icon: 'Braces',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleCodeBlock()
            .run()
        },
      },
      {
        title: '引用',
        description: '插入引用块',
        searchTerms: ['quote', 'blockquote', '引用'],
        icon: 'TextQuote',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleBlockquote()
            .run()
        },
      },
      // {
      //   title: '表格',
      //   description: '插入表格',
      //   searchTerms: ['table', 'grid', '表格', '表'],
      //   icon: 'Table',
      //   command: ({ editor, range }) => {
      //     editor
      //       .chain()
      //       .focus()
      //       .deleteRange(range)
      //       .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      //       .run()
      //   },
      // },
      // {
      //   title: 'Markdown表格',
      //   description: '粘贴Markdown格式的表格',
      //   searchTerms: ['markdown', 'table', 'md', '表格', 'paste'],
      //   icon: 'Table',
      //   command: ({ editor, range }) => {
      //     // 提示用户粘贴Markdown表格
      //     const markdown = prompt('请粘贴Markdown格式的表格：\n例如：\n| 列1 | 列2 |\n|-----|-----|\n| 数据1 | 数据2 |')
      //     if (markdown) {
      //       editor
      //         .chain()
      //         .focus()
      //         .deleteRange(range)
      //         .createTableFromMarkdown(markdown)
      //         .run()
      //     }
      //   },
      // },
    ]

    return commands.filter(item => {
      if (typeof query === 'string' && query.length > 0) {
        const search = query.toLowerCase()
        return (
          item.title.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search) ||
          (item.searchTerms &&
            item.searchTerms.some(term => term.toLowerCase().includes(search)))
        )
      }
      return commands
    })
  },

  render: () => {
    let component
    let popup

    return {
      onStart: props => {
        component = new VueRenderer(CommandsList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        // 智能计算菜单位置，避免遮挡
        const getOptimalPlacement = () => {
          
          
          const rect = props.clientRect()
          const viewportHeight = window.innerHeight
          const viewportWidth = window.innerWidth
          
          // 动态计算菜单高度
          const getMenuHeight = () => {
            // 基础高度：padding + border
            let baseHeight = 12 // 进一步减少基础高度
            
            // 计算命令项数量和高度
            const itemCount = Math.min(props.items?.length || 4, 5) // 进一步减少显示项目数量
            const itemHeight = 40 // 进一步减少每个命令项高度预估
            
            const calculatedHeight = baseHeight + (itemCount * itemHeight)
            const maxHeight = 220 // 进一步减少最大高度
            
            return Math.min(calculatedHeight, maxHeight)
          }
          
          const menuHeight = getMenuHeight()
          const menuWidth = 280 // min-width from CSS
          const padding = 10 // 减少边距缓冲
          
          // 获取光标相对于视口的位置
          const cursorTop = rect.top
          const cursorBottom = rect.bottom
          
          const spaceBelow = viewportHeight - cursorBottom - padding
          const spaceAbove = cursorTop - padding
          const spaceRight = viewportWidth - rect.left - padding
          const spaceLeft = rect.right - padding
          
          // 垂直位置判断 - 恢复正常逻辑
          let verticalPlacement = 'bottom' // 默认显示在下方
          // 如果下方空间不足且上方空间充足，则显示在上方
          if (spaceBelow < menuHeight && spaceAbove >= menuHeight) {
            verticalPlacement = 'top'
          }
          
          // 水平位置判断
          let horizontalPlacement = 'start'
          if (spaceRight < menuWidth) {
            if (spaceLeft >= menuWidth || spaceLeft > spaceRight) {
              horizontalPlacement = 'end'
            }
          }
          const placement = `${verticalPlacement}-${horizontalPlacement}`
           console.log(`placement:-- ${verticalPlacement}-${horizontalPlacement}`)
          console.log('Placement calculation:', {
            spaceBelow,
            spaceAbove,
            menuHeight,
            cursorTop,
            cursorBottom,
            placement
          }) 
          return placement  
        }
 
        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: getOptimalPlacement(),
          // 减少偏移量让菜单更贴近光标
          offset: [0, 0],
          // 确保菜单在视口内
          popperOptions: {
            modifiers: [
              {
                name: 'preventOverflow',
                options: {
                  boundary: 'viewport',
                  padding: 8,
                },
              },
              {
                name: 'flip',
                enabled: false, // 禁用自动翻转，使用我们自己的placement逻辑
              },
              {
                name: 'computeStyles',
                options: {
                  adaptive: true,
                  roundOffsets: false,
                },
              },
            ],
          },
          // 在每次显示前重新计算位置
          onShow(instance) {
            const newPlacement = getOptimalPlacement()
            if (instance.props.placement !== newPlacement) {
              instance.setProps({ placement: newPlacement })
            }
            
            // 每次显示时重置样式，防止被MentionTree.vue污染
            const box = instance.popper.querySelector('.tippy-box')
            const content = instance.popper.querySelector('.tippy-content')
            
            if (box) {
              box.style.cssText = `
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
                border-radius: 0 !important;
                width: auto !important;
                height: auto !important;
                display: block !important;
                position: absolute !important;
                bottom: auto !important;
                left: auto !important;
                right: auto !important;
                top: auto !important;
                color: inherit !important;
              `
            }
            
            if (content) {
              content.style.cssText = `
                padding: 0 !important;
                background: transparent !important;
                border-radius: 0 !important;
                width: auto !important;
                height: auto !important;
                color: inherit !important;
              `
            }
          },
          // 添加完全独立的样式配置，避免全局污染
          onCreate(instance) {
            const box = instance.popper.querySelector('.tippy-box')
            const content = instance.popper.querySelector('.tippy-content')
            const arrow = instance.popper.querySelector('.tippy-arrow')
            
            if (box) {
              // 重置 tippy-box 样式，防止MentionTree.vue样式污染
              box.style.cssText = `
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
                border-radius: 0 !important;
                width: auto !important;
                height: auto !important;
                display: block !important;
                position: absolute !important;
                bottom: auto !important;
                left: auto !important;
                right: auto !important;
                top: auto !important;
                color: inherit !important;
              `
            }
            
            if (content) {
              // 重置 tippy-content 样式，防止MentionTree.vue样式污染
              content.style.cssText = `
                padding: 0 !important;
                background: transparent !important;
                border-radius: 0 !important;
                width: auto !important;
                height: auto !important;
                color: inherit !important;
              `
            }
            
            if (arrow) {
              // 隐藏箭头，避免样式冲突
              arrow.style.display = 'none'
            }
          },
        })
      },

      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        // 重新计算最佳位置
        const getOptimalPlacement = () => {
          const rect = props.clientRect()
          const viewportHeight = window.innerHeight
          const viewportWidth = window.innerWidth
          
          // 动态计算菜单高度
           const getMenuHeight = () => {
              // 基础高度：padding + border
              let baseHeight = 12 // 进一步减少基础高度
              
              // 计算命令项数量和高度
              const itemCount = Math.min(props.items?.length || 4, 5) // 进一步减少显示项目数量
              const itemHeight = 40 // 进一步减少每个命令项高度预估
              
              const calculatedHeight = baseHeight + (itemCount * itemHeight)
              const maxHeight = 220 // 进一步减少最大高度
              
              return Math.min(calculatedHeight, maxHeight)
            }
           
           const menuHeight =  getMenuHeight()
           const menuWidth = 280 // min-width from CSS
           const padding = 10 // 减少边距缓冲
           
           // 获取光标相对于视口的位置
           const cursorTop = rect.top
           const cursorBottom = rect.bottom
           
           const spaceBelow = viewportHeight - cursorBottom - padding
           const spaceAbove = cursorTop - padding
           const spaceRight = viewportWidth - rect.left - padding
           const spaceLeft = rect.right - padding
           
           // 垂直位置判断 - 恢复正常逻辑
            let verticalPlacement = 'bottom' // 默认显示在下方
            // 如果下方空间不足且上方空间充足，则显示在上方
            if (spaceBelow < menuHeight && spaceAbove >= menuHeight) {
              verticalPlacement = 'top'
            }
          
          // 水平位置判断
          let horizontalPlacement = 'start'
          if (spaceRight < menuWidth) {
            if (spaceLeft >= menuWidth || spaceLeft > spaceRight) {
              horizontalPlacement = 'end'
            }
          }
          
          const placement = `${verticalPlacement}-${horizontalPlacement}`

         

          console.log('onUpdate Placement calculation:', {
            spaceBelow,
            spaceAbove,
            menuHeight,
            cursorTop,
            cursorBottom,
            placement
          }) 
         return placement
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
          placement: getOptimalPlacement(),
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}