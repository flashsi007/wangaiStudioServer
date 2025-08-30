<template>
  <div class="fixed-menu">
    <!-- 文本对齐 -->
    <div class="menu-group">
      <button
        @click="editor?.chain().focus().setTextAlign('left').run()"
        :class="{ active: editor?.isActive({ textAlign: 'left' }) }"
        class="menu-btn"
        title="文字左对齐"
      >
        <AlignLeft class="icon" />
      </button>
      <button
        @click="editor?.chain().focus().setTextAlign('center').run()"
        :class="{ active: editor?.isActive({ textAlign: 'center' }) }"
        class="menu-btn"
        title="文字居中"
      >
        <AlignCenter class="icon" />
      </button>
      <button
        @click="editor?.chain().focus().setTextAlign('right').run()"
        :class="{ active: editor?.isActive({ textAlign: 'right' }) }"
        class="menu-btn"
        title="文字右对齐"
      >
        <AlignRight class="icon" />
      </button>
      <button
        @click="editor?.chain().focus().setTextAlign('justify').run()"
        :class="{ active: editor?.isActive({ textAlign: 'justify' }) }"
        class="menu-btn"
        title="文字两端对齐"
      >
        <AlignJustify class="icon" />
      </button>
    </div>

    <!-- 文本格式 -->
    <div class="menu-group">
      <button
        @click="editor?.chain().focus().toggleBold().run()"
        :class="{ active: editor?.isActive('bold') }"
        class="menu-btn"
        title="文字加粗"
      >
        <Bold class="icon" />
      </button>
      <button
        @click="editor?.chain().focus().toggleItalic().run()"
        :class="{ active: editor?.isActive('italic') }"
        class="menu-btn"
        title="文字斜体"
      >
        <Italic class="icon" />
      </button>
      <button
        @click="editor?.chain().focus().toggleCode().run()"
        :class="{ active: editor?.isActive('code') }"
        class="menu-btn"
        title="代码行"
      >
        <Code class="icon" />
      </button>
    </div>

    <!-- 颜色设置 -->
    <div class="menu-group">
      <div class="color-picker-wrapper">
        <button
          @click="showTextColorPicker = !showTextColorPicker"
          class="menu-btn"
          title="文字颜色"
        >
          <Type class="icon" />
        </button>
        <div v-if="showTextColorPicker" class="color-picker">
          <div class="color-grid">
            <button
              v-for="color in textColors"
              :key="color"
              @click="setTextColor(color)"
              :style="{ backgroundColor: color }"
              class="color-item"
            ></button>
          </div>
        </div>
      </div>
      <div class="color-picker-wrapper">
        <button
          @click="showHighlightPicker = !showHighlightPicker"
          class="menu-btn"
          title="文字背景颜色"
        >
          <Palette class="icon" />
        </button>
        <div v-if="showHighlightPicker" class="color-picker">
          <div class="color-grid">
            <button
              v-for="color in highlightColors"
              :key="color"
              @click="setHighlightColor(color)"
              :style="{ backgroundColor: color }"
              class="color-item"
            ></button>
          </div>
        </div>
      </div>
    </div>

    <!-- 标题 -->
    <div class="menu-group">
      <button
        @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ active: editor?.isActive('heading', { level: 1 }) }"
        class="menu-btn"
        title="标题1"
      >
        <Heading1 class="icon" />
      </button>
      <button
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ active: editor?.isActive('heading', { level: 2 }) }"
        class="menu-btn"
        title="标题2"
      >
        <Heading2 class="icon" />
      </button>
      <button
        @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ active: editor?.isActive('heading', { level: 3 }) }"
        class="menu-btn"
        title="标题3"
      >
        <Heading3 class="icon" />
      </button>
      <button
        @click="editor?.chain().focus().toggleHeading({ level: 4 }).run()"
        :class="{ active: editor?.isActive('heading', { level: 4 }) }"
        class="menu-btn"
        title="标题4"
      >
        <Heading4 class="icon" />
      </button>
    </div>

    <!-- 列表 -->
    <div class="menu-group">
      <button
        @click="editor?.chain().focus().toggleBulletList().run()"
        :class="{ active: editor?.isActive('bulletList') }"
        class="menu-btn"
        title="无序列表"
      >
        <List class="icon" />
      </button>
      <button
        @click="editor?.chain().focus().toggleOrderedList().run()"
        :class="{ active: editor?.isActive('orderedList') }"
        class="menu-btn"
        title="有序列表"
      >
        <ListOrdered class="icon" />
      </button>
      <button
        @click="editor?.chain().focus().toggleTaskList().run()"
        :class="{ active: editor?.isActive('taskList') }"
        class="menu-btn"
        title="任务列表"
      >
        <LayoutList class="icon" />
      </button>
    </div>

    <!-- 其他功能 -->
    <div class="menu-group">
      <button
        @click="editor?.chain().focus().toggleCodeBlock().run()"
        :class="{ active: editor?.isActive('codeBlock') }"
        class="menu-btn"
        title="代码块"
      >
        <Braces class="icon" />
      </button>
      <button
        @click="editor?.chain().focus().toggleBlockquote().run()"
        :class="{ active: editor?.isActive('blockquote') }"
        class="menu-btn"
        title="引用"
      >
        <TextQuote class="icon" />
      </button>
      <button
        @click="clearFormatting"
        class="menu-btn"
        title="清除样式"
      >
        <Eraser class="icon" />
      </button>
      <button
        @click="handleAIAssistant"
        class="menu-btn ai-btn"
        title="AI助手"
      >
        <Bot class="icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Code,
  Type,
  Palette,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  LayoutList,
  Braces,
  TextQuote,
  Bot,
  Eraser
} from 'lucide-vue-next'

const props = defineProps({
  editor: {
    type: Object,
    default: null
  }
})

const showTextColorPicker = ref(false)
const showHighlightPicker = ref(false)

// 文字颜色选项
const textColors = [
  '#000000', '#333333', '#666666', '#999999',
  '#FF0000', '#FF6600', '#FFCC00', '#00FF00',
  '#0066FF', '#6600FF', '#FF0066', '#00FFFF'
]

// 高亮颜色选项
const highlightColors = [
  '#FFFF00', '#FFE6CC', '#CCFFCC', '#CCE6FF',
  '#FFCCCC', '#E6CCFF', '#FFCCFF', '#CCFFFF',
  '#F0F0F0', '#E0E0E0', '#D0D0D0', '#C0C0C0'
]

// 设置文字颜色
const setTextColor = (color) => {
  props.editor?.chain().focus().setColor(color).run()
  showTextColorPicker.value = false
}

// 设置高亮颜色
const setHighlightColor = (color) => {
  props.editor?.chain().focus().setHighlight({ color }).run()
  showHighlightPicker.value = false
}

// 清除样式功能
const clearFormatting = () => {
  props.editor?.chain().focus().clearNodes().unsetAllMarks().run()
}

// AI助手功能
const handleAIAssistant = () => {
  props.editor?.chain().focus().openAIChat().run()
}
</script>

<style scoped>

html[ arco-theme="dark"] .fixed-menu{
   background-color: var( --color-gray-700);
}

.fixed-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: var(--color-gray-50);
  border: 1px solid var(--color-border-2);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.menu-group {
  display: flex;
  gap: 4px;
  padding: 0 8px;
  border-right: 1px solid var(--color-border-3);
}

.menu-group:last-child {
  border-right: none;
}
html[ arco-theme="dark"] .menu-btn{
    background: var(--color-gray-800);
    color: var(--color-gray-200);
}
.menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 6px;
  border: 1px solid var(--color-border-2);
  border-radius: 6px;
  background: var(---color-gray-300);
  color: var(--color-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-btn:hover {
  background: var(--color-bg-3);
  border-color: var(--color-border-1);
  color: var(--color-text-1);
}

.menu-btn.active {
  background: var(--color-primary-light-1);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.menu-btn.ai-btn {
  background: linear-gradient(135deg, var(--color-primary-light-1), var(--color-primary-light-2));
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.menu-btn.ai-btn:hover {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light-1));
  color: white;
}

.icon {
  width: 16px;
  height: 16px;
}

.color-picker-wrapper {
  position: relative;
}

.color-picker {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  margin-top: 4px;
  padding: 8px;
  background: var(--color-bg-1);
  border: 1px solid var(--color-border-2);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  width: 120px;
}

.color-item {
  width: 24px;
  height: 24px;
  border: 1px solid var(--color-border-3);
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-item:hover {
  transform: scale(1.1);
  border-color: var(--color-border-1);
}

/* 暗色主题适配 */
.dark .fixed-menu {
  background: var(--color-bg-2);
  border-color: var(--color-border-2);
}

.dark .menu-btn {
  background: var(--color-bg-3);
  border-color: var(--color-border-3);
  color: var(--color-text-2);
}

.dark .menu-btn:hover {
  background: var(--color-bg-4);
  color: var(--color-text-1);
}

.dark .color-picker {
  background: var(--color-bg-2);
  border-color: var(--color-border-2);
}
</style>