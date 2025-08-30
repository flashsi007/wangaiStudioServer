<template>
  <div class="tiptap-test-page">
    <div class="header">
      <h1 class="title">Tiptap 编辑器测试</h1>
      <p class="description">测试 Tiptap 编辑器的各种功能</p>
    </div>

    <div class="toolbar">
      <div class="toolbar-group">
        <button @click="editorRef?.toggleBold()" :class="{ active: editorRef?.isActive('bold') }" class="toolbar-btn">
          <Bold class="icon" />
          加粗
        </button>
        <button @click="editorRef?.toggleItalic()" :class="{ active: editorRef?.isActive('italic') }" class="toolbar-btn">
          <Italic class="icon" />
          斜体
        </button>
        <button @click="editorRef?.toggleCode()" :class="{ active: editorRef?.isActive('code') }" class="toolbar-btn">
          <Code class="icon" />
          代码
        </button>
      </div>

      <div class="toolbar-group">
        <button @click="editorRef?.setHeading(1)" :class="{ active: editorRef?.isActive('heading', { level: 1 }) }" class="toolbar-btn">
          <Heading1 class="icon" />
          H1
        </button>
        <button @click="editorRef?.setHeading(2)" :class="{ active: editorRef?.isActive('heading', { level: 2 }) }" class="toolbar-btn">
          <Heading2 class="icon" />
          H2
        </button>
        <button @click="editorRef?.setHeading(3)" :class="{ active: editorRef?.isActive('heading', { level: 3 }) }" class="toolbar-btn">
          <Heading3 class="icon" />
          H3
        </button>
      </div>

      <div class="toolbar-group">
        <button @click="editorRef?.toggleBulletList()" :class="{ active: editorRef?.isActive('bulletList') }" class="toolbar-btn">
          <List class="icon" />
          无序列表
        </button>
        <button @click="editorRef?.toggleOrderedList()" :class="{ active: editorRef?.isActive('orderedList') }" class="toolbar-btn">
          <ListOrdered class="icon" />
          有序列表
        </button>
        <button @click="editorRef?.toggleTaskList()" :class="{ active: editorRef?.isActive('taskList') }" class="toolbar-btn">
          <LayoutList class="icon" />
          任务列表
        </button>
      </div>

      <div class="toolbar-group">
        <button @click="editorRef?.undo()" :disabled="!editorRef?.canUndo()" class="toolbar-btn">
          <Undo class="icon" />
          撤销
        </button>
        <button @click="editorRef?.redo()" :disabled="!editorRef?.canRedo()" class="toolbar-btn">
          <Redo class="icon" />
          重做
        </button>
      </div>
    </div>

    <div class="editor-container">
      <TiptapEditor ref="editorRef" />
    </div>

    <div class="info-panel">
      <h3>使用说明：</h3>
      <ul>
        <li>输入 <code>/</code> 可以唤起斜杠命令菜单</li>
        <li>选中文字可以显示气泡菜单</li>
        <li>支持 Markdown 快捷键</li>
        <li>支持代码块语法高亮</li>
        <li>支持任务列表</li>
        <li>支持数学公式（LaTeX）</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TiptapEditor from '@/components/TiptapEditor/index.vue'
import {
  Bold,
  Italic,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  LayoutList,
  Undo,
  Redo
} from 'lucide-vue-next'

const editorRef = ref(null)
</script>

<style scoped>
.tiptap-test-page {
  @apply max-w-6xl mx-auto p-6 space-y-6;
}

.header {
  @apply text-center space-y-2;
}

.title {
  @apply text-3xl font-bold text-gray-900 dark:text-gray-100;
}

.description {
  @apply text-gray-600 dark:text-gray-400;
}

.toolbar {
  @apply flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700;
}

.toolbar-group {
  @apply flex gap-2;
}

.toolbar-btn {
  @apply flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors;
  @apply bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600;
  @apply hover:bg-gray-50 dark:hover:bg-gray-600;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.toolbar-btn.active {
  @apply bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700;
}

.icon {
  @apply w-4 h-4;
}

.editor-container {
  @apply min-h-[500px];
}

.info-panel {
  @apply p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800;
}

.info-panel h3 {
  @apply text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3;
}

.info-panel ul {
  @apply space-y-2 text-blue-800 dark:text-blue-200;
}

.info-panel li {
  @apply flex items-start gap-2;
}

.info-panel li::before {
  content: '•';
  @apply text-blue-600 dark:text-blue-400 font-bold;
}

.info-panel code {
  @apply bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded text-sm font-mono;
}
</style>