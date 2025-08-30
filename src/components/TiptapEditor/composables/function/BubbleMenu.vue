<template>
  <bubble-menu
    :editor="editor"
    :tippy-options="{ duration: 100 }"
    :should-show="shouldShow"
    v-if="editor"
  >
    <div class="bubble-menu-container">
      <!-- 文字对齐 -->
      <div class="menu-group">
        <button 
          @click="setTextAlign('left')"
          :class="['menu-button', { active: isActive('textAlign', { textAlign: 'left' }) }]"
          title="左对齐"
        >
          <AlignLeft class="menu-icon" />
        </button>
        <button 
          @click="setTextAlign('center')"
          :class="['menu-button', { active: isActive('textAlign', { textAlign: 'center' }) }]"
          title="居中对齐"
        >
          <AlignCenter class="menu-icon" />
        </button>
        <button 
          @click="setTextAlign('right')"
          :class="['menu-button', { active: isActive('textAlign', { textAlign: 'right' }) }]"
          title="右对齐"
        >
          <AlignRight class="menu-icon" />
        </button>
        <button 
          @click="setTextAlign('justify')"
          :class="['menu-button', { active: isActive('textAlign', { textAlign: 'justify' }) }]"
          title="两端对齐"
        >
          <AlignJustify class="menu-icon" />
        </button>
      </div>

      <div class="menu-divider"></div>

      <!-- 文字样式 -->
      <div class="menu-group">
        <button 
          @click="toggleBold"
          :class="['menu-button', { active: isActive('bold') }]"
          title="加粗"
        >
          <Bold class="menu-icon" />
        </button>
        <button 
          @click="toggleItalic"
          :class="['menu-button', { active: isActive('italic') }]"
          title="斜体"
        >
          <Italic class="menu-icon" />
        </button>
        <button 
          @click="toggleCode"
          :class="['menu-button', { active: isActive('code') }]"
          title="代码"
        >
          <Code class="menu-icon" />
        </button>
      </div>

      <div class="menu-divider"></div>

      <!-- 颜色选择 -->
      <div class="menu-group">
        <div class="color-picker-wrapper">
          <button 
            @click="toggleColorPicker('text')"
            class="menu-button"
            title="文字颜色"
          >
            <Type class="menu-icon" />
          </button>
          <div v-if="showTextColorPicker" class="color-picker">
            <div class="color-grid">
              <button 
                v-for="color in textColors"
                :key="color"
                @click="setTextColor(color)"
                :style="{ backgroundColor: color }"
                class="color-button"
              ></button>
            </div>
          </div>
        </div>
        
        <div class="color-picker-wrapper">
          <button 
            @click="toggleColorPicker('highlight')"
            class="menu-button"
            title="背景颜色"
          >
            <Palette class="menu-icon" />
          </button>
          <div v-if="showHighlightColorPicker" class="color-picker">
            <div class="color-grid">
              <button 
                v-for="color in highlightColors"
                :key="color"
                @click="setHighlightColor(color)"
                :style="{ backgroundColor: color }"
                class="color-button"
              ></button>
            </div>
          </div>
        </div>
      </div>

      <div class="menu-divider"></div>

      <!-- 清除样式 -->
      <div class="menu-group">
        <button 
          @click="clearFormatting"
          class="menu-button"
          title="清除样式"
        >
          <Eraser class="menu-icon" />
        </button>
      </div>

      <div class="menu-divider"></div>

      <!-- AI助手 -->
      <div class="menu-group">
        <button 
          @click="openAIAssistant"
          class="menu-button"
          title="AI助手"
        >
          <Bot class="menu-icon" />
        </button>
      </div>
    </div>
  </bubble-menu>
</template>

<script setup>
import { ref } from 'vue'
import { BubbleMenu } from '@tiptap/vue-3/menus'
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
  Bot,
  Eraser
} from 'lucide-vue-next'

const props = defineProps({
  editor: {
    type: Object,
    required: true
  }
})

const showTextColorPicker = ref(false)
const showHighlightColorPicker = ref(false)

const textColors = [
  '#000000', '#333333', '#666666', '#999999', '#cccccc',
  '#ff0000', '#ff6600', '#ffcc00', '#00ff00', '#0066ff',
  '#6600ff', '#ff0066', '#00ffff', '#ff00ff', '#ffff00'
]

const highlightColors = [
  '#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#ff6600',
  '#ff0000', '#0066ff', '#6600ff', '#cccccc', '#999999'
]

const shouldShow = ({ editor, view, state, oldState, from, to }) => {
  // 只在有文字选中时显示
  return !state.selection.empty
}

const isActive = (name, attrs = {}) => {
  return props.editor?.isActive(name, attrs) || false
}

const setTextAlign = (alignment) => {
  props.editor?.chain().focus().setTextAlign(alignment).run()
}

const toggleBold = () => {
  props.editor?.chain().focus().toggleBold().run()
}

const toggleItalic = () => {
  props.editor?.chain().focus().toggleItalic().run()
}

const toggleCode = () => {
  props.editor?.chain().focus().toggleCode().run()
}

const toggleColorPicker = (type) => {
  if (type === 'text') {
    showTextColorPicker.value = !showTextColorPicker.value
    showHighlightColorPicker.value = false
  } else {
    showHighlightColorPicker.value = !showHighlightColorPicker.value
    showTextColorPicker.value = false
  }
}

const setTextColor = (color) => {
  props.editor?.chain().focus().setColor(color).run()
  showTextColorPicker.value = false
}

const setHighlightColor = (color) => {
  props.editor?.chain().focus().setHighlight({ color }).run()
  showHighlightColorPicker.value = false
}

const clearFormatting = () => {
  props.editor?.chain().focus().clearNodes().unsetAllMarks().run()
}

const openAIAssistant = () => {
  props.editor?.chain().focus().openAIChat().run()
}
</script>

<style scoped>

html[ arco-theme="dark"] .bubble-menu-container{
  background-color: var( --color-gray-800 )  !important;
}

.bubble-menu-container {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--color-gray-100);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 0.5rem;
}

.menu-group {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.menu-divider {
  width: 1px;
  height: 1.5rem;
  background-color: var(--border);
  margin: 0 0.25rem;
}

.menu-button {
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.15s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--foreground);
}

html[ arco-theme="dark"] .menu-button:hover {
  background-color: var(--color-gray-700);
  color: var(--color-text-1);
}

.menu-button:hover {
  background-color: var(--color-gray-300) !important;
  color: var( --color-text-1 ) !important;
}

 
.menu-button.active {
  background-color: var(--primary);
  color: var(--primary-foreground);
}

.menu-icon {
  width: 1rem;
  height: 1rem;
}

 

.color-picker-wrapper {
  position: relative;
}

.color-picker {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.25rem;
  background-color: var(--popover);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 0.5rem;
  z-index: 10;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.25rem;
}

.color-button {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: transform 0.15s ease-in-out;
}

.color-button:hover {
  transform: scale(1.1);
}
</style>