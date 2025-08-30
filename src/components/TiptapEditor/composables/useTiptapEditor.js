
import { ref,watch  } from 'vue'
import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Mathematics from '@tiptap/extension-mathematics'
import { BubbleMenu } from '@tiptap/extension-bubble-menu'
import Typography from '@tiptap/extension-typography'
import Placeholder from '@tiptap/extension-placeholder'
import { createLowlight } from 'lowlight'
import Commands from '../extensions/commands.js'
import ChatCommands from '../extensions/chat.js'
import suggestion from '../extensions/suggestion.js'
import TableExtension from '../extensions/tables.js'
import md2html from "../extensions/function/md2html.js"
import htmlToMarkdown from "../extensions/function/htmlToMarkdown.js"

// 导入语言支持
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'
import less from 'highlight.js/lib/languages/less'
import vue from 'highlight.js/lib/languages/xml'
import markdown from 'highlight.js/lib/languages/markdown' 
// 创建lowlight实例
const lowlight = createLowlight()

// 注册语言
lowlight.register('javascript', javascript)
lowlight.register('typescript', typescript)
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('scss', scss)
lowlight.register('less', less)
lowlight.register('vue', vue)
lowlight.register('markdown', markdown)
lowlight.register('js', javascript)
lowlight.register('ts', typescript)
lowlight.register('jsx', javascript)
lowlight.register('tsx', typescript)



export default function useTiptapEditor(  treeList = [],content = null,type = 'json',emit) {
    const editor = ref(null)
    const editorContainer = ref(null)
    const editorContent = ref('')
    
  

    watch(() =>  type, (newVal) => {
        switch(newVal){
            case 'json':
            case 'html':
                editorContent.value = content
                break
            case 'markdown':
                 editorContent.value =  md2html(content)
             return 
        }
    })

   const onChange = ({ editor })=>{
    switch(type){
        case "html":
            emit('onChange',editor.getHTML())
            break
        case "markdown":
            emit('onChange', htmlToMarkdown(editor.getHTML()))
            break
        case "json":
            emit('onChange',editor.getJSON())
            break
    } 
   }
    const initEditor = () => {
        editor.value = new Editor({
            element: editorContainer.value,
            extensions: [
                StarterKit.configure({
                    codeBlock: false, // 禁用默认代码块，使用 lowlight 版本
                }),
                Typography.configure({
                    // 启用 Markdown 语法快捷键
                }),
                TextAlign.configure({
                    types: ['heading', 'paragraph'],
                }),
                TextStyle,
                Color.configure({
                    types: ['textStyle'],
                }),
                Highlight.configure({
                    multicolor: true,
                }),
                CodeBlockLowlight.configure({
                    lowlight,
                    defaultLanguage: 'javascript',
                }),
                TaskList,
                TaskItem.configure({
                    nested: true,
                }),
                Mathematics.configure({
                    HTMLAttributes: {
                        class: 'math-node',
                    },
                }),
                BubbleMenu.configure({
                    element: null, // 将在组件中设置
                }),
                Placeholder.configure({
                    placeholder: '输入"/" 开启 唤起更多！',
                }),
                Commands.configure({
                    suggestion,
                }),
                ChatCommands.configure({
                    treeList,
                }),
                TableExtension,
            ],
            content: editorContent.value,
            editorProps: {
                attributes: {
                    class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
                },
            },
            onUpdate: onChange,
        })
    }

    const destroyEditor = () => {
        if (editor.value) {
            editor.value.destroy()
            editor.value = null
        }
    }

    // 编辑器命令
    const toggleBold = () => editor.value?.chain().focus().toggleBold().run()
    const toggleItalic = () => editor.value?.chain().focus().toggleItalic().run()
    const toggleCode = () => editor.value?.chain().focus().toggleCode().run()
    const setTextAlign = (alignment) => editor.value?.chain().focus().setTextAlign(alignment).run()
    const setHeading = (level) => editor.value?.chain().focus().toggleHeading({ level }).run()
    const toggleBulletList = () => editor.value?.chain().focus().toggleBulletList().run()
    const toggleOrderedList = () => editor.value?.chain().focus().toggleOrderedList().run()
    const toggleTaskList = () => editor.value?.chain().focus().toggleTaskList().run()
    const toggleBlockquote = () => editor.value?.chain().focus().toggleBlockquote().run()
    const setCodeBlock = (language = 'javascript') => {
        editor.value?.chain().focus().toggleCodeBlock({ language }).run()
    }
    const setColor = (color) => editor.value?.chain().focus().setColor(color).run()
    const setHighlight = (color) => editor.value?.chain().focus().setHighlight({ color }).run()
    const insertMath = (latex) => {
        editor.value?.chain().focus().insertContent({
            type: 'mathematics',
            attrs: {
                latex,
            },
        }).run()
    }
    const openAIChat = () => {
        console.log('openAIChat called, editor:', editor.value)
        if (editor.value) {
            console.log('Editor commands:', Object.keys(editor.value.commands))
            const result = editor.value.chain().focus().openAIChat().run()
            console.log('openAIChat result:', result)
            return result
        }
        console.warn('Editor not available')
        return false
    }

    // 表格相关命令
    const insertTable = (options = {}) => {
        const { rows = 3, cols = 3, withHeaderRow = true } = options
        return editor.value?.chain().focus().insertTable({ rows, cols, withHeaderRow }).run()
    }
    const addColumnBefore = () => editor.value?.chain().focus().addColumnBefore().run()
    const addColumnAfter = () => editor.value?.chain().focus().addColumnAfter().run()
    const deleteColumn = () => editor.value?.chain().focus().deleteColumn().run()
    const addRowBefore = () => editor.value?.chain().focus().addRowBefore().run()
    const addRowAfter = () => editor.value?.chain().focus().addRowAfter().run()
    const deleteRow = () => editor.value?.chain().focus().deleteRow().run()
    const deleteTable = () => editor.value?.chain().focus().deleteTable().run()
    const mergeCells = () => editor.value?.chain().focus().mergeCells().run()
    const splitCell = () => editor.value?.chain().focus().splitCell().run()
    const toggleHeaderRow = () => editor.value?.chain().focus().toggleHeaderRow().run()
    const toggleHeaderColumn = () => editor.value?.chain().focus().toggleHeaderColumn().run()
    const createTableFromMarkdown = (markdown) => editor.value?.chain().focus().createTableFromMarkdown(markdown).run()

    // 获取编辑器状态
    const isActive = (name, attrs = {}) => editor.value?.isActive(name, attrs) || false
    const canUndo = () => editor.value?.can().undo() || false
    const canRedo = () => editor.value?.can().redo() || false

    // 撤销重做
    const undo = () => editor.value?.chain().focus().undo().run()
    const redo = () => editor.value?.chain().focus().redo().run()

    // 获取内容
    const getHTML = () => editor.value?.getHTML() || ''
    const getJSON = () => editor.value?.getJSON() || {}
    const getText = () => editor.value?.getText() || ''

    // 设置内容
    const setContent = (content) => editor.value?.commands.setContent(content)

    // 编辑器初始化将在组件中手动调用

    return {
        editor,
        editorContainer, 
        initEditor,
        destroyEditor,
        // 编辑器命令
        toggleBold,
        toggleItalic,
        toggleCode,
        setTextAlign,
        setHeading,
        toggleBulletList,
        toggleOrderedList,
        toggleTaskList,
        toggleBlockquote,
        setCodeBlock,
        setColor,
        setHighlight,
        insertMath,
        openAIChat,
        // 表格命令
        insertTable,
        addColumnBefore,
        addColumnAfter,
        deleteColumn,
        addRowBefore,
        addRowAfter,
        deleteRow,
        deleteTable,
        mergeCells,
        splitCell,
        toggleHeaderRow,
        toggleHeaderColumn,
        createTableFromMarkdown,
        // 状态查询
        isActive,
        canUndo,
        canRedo,
        // 撤销重做
        undo,
        redo,
        // 内容操作
        getHTML,
        getJSON,
        getText,
        setContent,
    }
}