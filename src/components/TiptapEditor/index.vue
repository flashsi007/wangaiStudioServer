<template>
  <div class="tiptap-editor-container">
    <!-- 固定菜单 -->
    <FixedMenu :editor="editor" v-if="showTopMenu" />
    
    <!-- 编辑器容器 -->
    <div 
      ref="editorContainer" 
      class="editor-content"
    ></div>

    <!-- 气泡菜单 -->
    <BubbleMenu :editor="editor" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTiptapEditor } from './composables'
import BubbleMenu from './composables/function/BubbleMenu.vue'
import FixedMenu from './composables/function/FixedMenu.vue'
 
  const emit = defineEmits(['onChange'])
// 定义 props
const props = defineProps({
  Treelist: {
    type: Array,
    default: () => []
  },
  content:{
    type: Object,
    default: () => ({})
  },

  type: {
    type: String,
    default: 'json'
  },
  showTopMenu:{
    type: Boolean,
    default: true
  }
})



// 使用 Tiptap composable
const {
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
} = useTiptapEditor(
  props.Treelist,
  props.content,
  props.type, 
  emit
)
 

// 生命周期钩子
onMounted(() => {
  if (editorContainer.value) {
    initEditor()
  }
})

onUnmounted(() => {
  destroyEditor()
})

// 暴露编辑器实例和方法给父组件
defineExpose({
  editor,
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
  isActive,
  canUndo,
  canRedo,
  undo,
  redo,
  getHTML,
  getJSON,
  getText,
  setContent,
})
</script>

<style scoped>
@import "./index.css";
</style>