<template>
  <div 
    ref="chatBox"
    class="chat-overlay"
    :style="{
      top: position.y + 'px',
      left: position.x + 'px',
      width: size.width + 'px',
      height: size.height + 'px'
    }"
  >
    <!-- 标题栏 -->
    <div 
      ref="header"
      class="chat-header"
      @mousedown="startDrag"
    >
      <button class="close-btn"  @click="$emit('close')">
        <CircleX size="18" />
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="chat-content relative"> 
      <!-- 输入区域 --> 
         <div v-if="isShowMarkdown" class="markdown-content text-lg h-5/6  mt-6 mb-3 overflow-y-auto  group cursor-pointer"  @dblclick="toggleEditMode"  > 
             <div class="absolute top-0 right-8 p-2   justify-end flex items-center gap-1"  @dblclick="toggleEditMode" v-if="isShowEditMode">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               AI 回答完成 
              </div>
             <VueMarkdown :source="aiAnswer" class="prose prose-sm dark:prose-invert max-w-none" /> 

             <div class="absolute bottom-3 left-0   p-2 flex items-center" @dblclick="toggleEditMode" v-if="isShowEditMode"> 
               <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
               <span> 双击可重新编辑问题  </span>
             </div>
         </div>
         <div v-if="!isShowMarkdown">
            <MentionTree :Treelist="props.treeList" :chatHeight="size.height" @onInput="onInput" /> 
         </div> 
        <div>  
           <div class="w-full flex justify-end items-center"> 
             <button v-if="isShowReload" class="cl-btn cursor-pointer flex items-center" :style="dynamicButtonStyle" @click="handleCite"> 
                <Copy   :size="Math.round(12 * ((parseFloat(dynamicButtonStyle.fontSize) / 12)))" class="mr-2" /> 
                <span class="text-white" :style="{ fontSize: dynamicButtonStyle.fontSize }">应用</span>
              </button>

              <button v-if="isShowReload" class="cl-btn cursor-pointer flex items-center " :style="dynamicButtonStyle" @click="handleReload"> 
                <RotateCw  :size="Math.round(12 * ((parseFloat(dynamicButtonStyle.fontSize) / 12)))" class="mr-2" /> 
                <span class="text-white" :style="{ fontSize: dynamicButtonStyle.fontSize }">重新生成</span>
              </button>

              <button  v-if="!isShowReload"  :loading="loading" :disabled="loading"
                       :class="['cl-btn flex items-center', loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer']" 
                       :style="dynamicButtonStyle"
                       @click="handleSend"> 
                <div v-if="loading" class="animate-spin mr-2">
                  <svg :style="{ width: dynamicButtonStyle.fontSize, height: dynamicButtonStyle.fontSize }" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                    <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <Send v-else :size="Math.round(12 * ((parseFloat(dynamicButtonStyle.fontSize) / 12)))" class="mr-2" /> 
                <span class="text-white" :style="{ fontSize: dynamicButtonStyle.fontSize }">{{ loading ? '回答中...' : '发送' }}</span>
              </button>
           </div>
        </div>
    </div>
    
    <!-- 拖拽调整大小手柄 -->
    <div 
      class="resize-handle"
      @mousedown="startResize"
    ></div>
  </div>
</template>

<script setup> 
 
import { chatStream } from "@/api"
import VueMarkdown from 'vue-markdown-render' 
import generatePrompter from "../function/generatePrompter.js" 
import md2html from "../function/md2html.js"
import MentionTree from "./MentionTree.vue"
import { ref, computed, onMounted, onUnmounted } from 'vue'   
import { Send,RotateCw,Copy,CircleX   } from 'lucide-vue-next' 
const aiAnswer = ref("") 
const loading = ref(false)
const isShowReload = ref(false)
const isShowMarkdown = ref( false )
const isShowEditMode = ref(false)
let sendValue = ""
let reloadValue = ""

 
const props = defineProps({
  editor: {
    type: Object,
    required: true
  },
  treeList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])


function reset(){
  sendValue = ""
  reloadValue = ""
  aiAnswer.value = ""
  loading.value = false 
  isShowReload.value = false 
  isShowMarkdown.value = false
  isShowEditMode.value =  false
}

function chat(value){
  loading.value = true
  isShowMarkdown.value = true
  isShowEditMode.value = false
  // 确保 aiAnswer 从空字符串开始
  aiAnswer.value = ''
  sendValue = ""
  
  chatStream(value,(stream)=>{
    // 确保 stream 是字符串
    const streamStr = String(stream || '')
    aiAnswer.value += streamStr + '\n'
  
    console.log( aiAnswer.value );
  },(err)=>{
    isShowEditMode.value =  true
    isShowMarkdown.value = false
    isShowReload.value = true
    loading.value = false
  },()=>{
    isShowEditMode.value =  true
    isShowMarkdown.value = true
    isShowReload.value = true
    loading.value = false
  })
}
 
function toggleEditMode(){
  if(!isShowEditMode.value) return
  isShowMarkdown.value = false
  isShowReload.value = false
  reloadValue = ""

}


const onInput = (value)=>{ 
  sendValue = value
  reloadValue = value
}

const handleSend = ()=>{
  // 确保 sendValue 是有效的字符串
  const inputValue = sendValue || '' 
  const selectText = editorDataText.value
  const prompt = generatePrompter(inputValue,selectText, props.treeList) 
   chat(prompt) 
}

const handleReload= ()=>{  
   const selectText = editorDataText.value
 const prompt = generatePrompter(reloadValue,selectText, props.treeList)
  chat(prompt)
}

const handleCite = ()=>{
  
  console.log("aiAnswer:  ",aiAnswer.value);
  
  // 将 aiAnswer 内容插入到 Tiptap 编辑器中
  if (props.editor && aiAnswer.value) {
    try {
      props.editor.chain().focus().insertContent( md2html(aiAnswer.value) ).run()
    } catch (e) {
      console.warn('插入内容到编辑器失败:', e)
    }
  }
  
  emit('close')
  reset()
}



const chatBox = ref(null)
const isDragging = ref(false)
const isResizing = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const resizeOffset = ref({ x: 0, y: 0 })
const position = ref({ 
  x: window.innerWidth / 2 - 240, // 30rem = 480px, so 240px is half
  y: window.innerHeight / 2 - 240
})
const size = ref({
  width: 480, // 30rem = 480px
  height: 480
})

// 根据聊天框尺寸动态计算按钮样式
const dynamicButtonStyle = computed(() => {
  // 基础尺寸 480px 对应基础样式
  const baseWidth = 480
  const baseHeight = 480
  const baseFontSize = 12
  const basePadding = 8 // 0.5rem = 8px
  
  // 计算缩放比例（取宽高的平均值）
  const scaleRatio = ((size.value.width / baseWidth) + (size.value.height / baseHeight)) / 2
  
  // 限制缩放范围
  const minScale = 0.7
  const maxScale = 1.5
  const clampedScale = Math.max(minScale, Math.min(maxScale, scaleRatio))
  
  return {
    fontSize: Math.round(baseFontSize * clampedScale) + 'px',
    padding: Math.round(basePadding * clampedScale) + 'px'
  }
})

const editorDataJSON = computed(() => {
  try {
    const editorData = props.editor?.getJSON?.() || {}
    return JSON.stringify(editorData, null, 2)
  } catch (e) {
    console.warn('获取编辑器数据失败:', e)
    return '{}'
  }
})

const editorDataText = computed(() => {
  try {
    return props.editor?.getText?.() || ''
  } catch (e) {
    console.warn('获取编辑器文本失败:', e)
    return ''
  }
})

const editorDataHTML = computed(() => {
  try {
    return props.editor?.getHTML?.() || '空内容'
  } catch (e) {
    console.warn('获取编辑器HTML失败:', e)
    return '空内容'
  }
})

const startDrag = (e) => {
  if (e.target.classList.contains('close-btn')) return
  
  isDragging.value = true
  const rect = chatBox.value.getBoundingClientRect()
  dragOffset.value.x = e.clientX - rect.left
  dragOffset.value.y = e.clientY - rect.top
  
  e.preventDefault()
}

const startResize = (e) => {
  isResizing.value = true
  const rect = chatBox.value.getBoundingClientRect()
  resizeOffset.value.x = e.clientX - rect.right
  resizeOffset.value.y = e.clientY - rect.bottom
  e.preventDefault()
  e.stopPropagation()
}

const onMouseMove = (e) => {
  if (isDragging.value) {
    const newX = e.clientX - dragOffset.value.x
    const newY = e.clientY - dragOffset.value.y
    
    // 限制在视窗范围内
    const maxX = window.innerWidth - size.value.width
    const maxY = window.innerHeight - size.value.height
    
    position.value.x = Math.max(0, Math.min(newX, maxX))
    position.value.y = Math.max(0, Math.min(newY, maxY))
  }
  
  if (isResizing.value) {
    const newWidth = e.clientX - position.value.x - resizeOffset.value.x
    const newHeight = e.clientY - position.value.y - resizeOffset.value.y
    
    // 设置最小尺寸限制
    const minWidth = 350
    const minHeight = 120
    
    // 设置最大尺寸限制（不超出视窗）
    const maxWidth = window.innerWidth - position.value.x
    const maxHeight = window.innerHeight - position.value.y
    
    size.value.width = Math.max(minWidth, Math.min(newWidth, maxWidth))
    size.value.height = Math.max(minHeight, Math.min(newHeight, maxHeight))
  }
}

const onMouseUp = () => {
  isDragging.value = false
  isResizing.value = false
}

const onKeydown = (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}


onMounted(() => {
 
  
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {  
  
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
 html[ arco-theme="dark"] .chat-overlay {
    background:var(--color-gray-700) !important;
 }

.chat-overlay {
  position: fixed;
  background: var(--color-gray-100);
  border: var(--color-gray-500) 1px solid;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-width: 350px;
  min-height: 120px;
}

html[ arco-theme="dark"] .chat-header{
background:var(--color-gray-700) !important;
}
.chat-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 0.5rem;
  background: var(--color-gray-100) !important;
  cursor: move;
  user-select: none;
}

html[ arco-theme="dark"] .close-btn {
  background-color: var(--color-gray-700) !important;
  color: var(--color-text-1) !important;
}

.close-btn {
  width: 2rem;
  height: 2rem;
  border: none; 
  background-color: var(--color-gray-100) !important;
  border-radius: 6px;
  cursor: pointer;
  color: var(--color-text-1) !important;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

html[ arco-theme="dark"] .chat-content {
  background-color: var(--color-gray-700) !important;
  color: var( --color-text-2);
}
.chat-content {
  flex: 1;
  padding-right: 10px;
  padding-left: 10px;
  overflow-y: auto;
  background: var(--color-gray-100);
  display: flex;
  flex-direction: column;
}

.ai-answer-area {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
}

html[ arco-theme="dark"] .cl-btn{
  background: var(--color-gray-800) !important;
} 
.cl-btn{
  background: var(  --color-gray-800 ) !important;
  border-radius: 5px;
  margin: 0 3px;
  color: var(  --color-text-4 ) !important;
  transition: all 0.2s ease;
  border: none;
}

/* 拖拽调整大小手柄 */
.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 1.2rem;
  height: 1rem;
  cursor: nw-resize;
  background: linear-gradient(-45deg, transparent 0%, transparent 30%, var(--color-gray-400) 30%, var(--color-gray-400) 35%, transparent 35%, transparent 65%, var(--color-gray-400) 65%, var(--color-gray-400) 70%, transparent 70%);
  transition: all 0.2s ease;
  border-bottom-right-radius: 12px;
}

.resize-handle:hover {
  transform: scale(1.2);
  background: linear-gradient(-45deg, transparent 0%, transparent 30%, var(--color-gray-600) 30%, var(--color-gray-600) 35%, transparent 35%, transparent 65%, var(--color-gray-600) 65%, var(--color-gray-600) 70%, transparent 70%);
}

html[arco-theme="dark"] .resize-handle {
  background: linear-gradient(-45deg, transparent 0%, transparent 30%, var(--color-gray-500) 30%, var(--color-gray-500) 35%, transparent 35%, transparent 65%, var(--color-gray-500) 65%, var(--color-gray-500) 70%, transparent 70%);
}

html[arco-theme="dark"] .resize-handle:hover {
  background: linear-gradient(-45deg, transparent 0%, transparent 30%, var(--color-gray-300) 30%, var(--color-gray-300) 35%, transparent 35%, transparent 65%, var(--color-gray-300) 65%, var(--color-gray-300) 70%, transparent 70%);
}

</style>