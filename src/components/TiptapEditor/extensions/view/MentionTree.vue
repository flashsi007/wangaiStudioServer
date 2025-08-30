<template>
  <textarea
    ref="ta"
    v-model="text"
    @input="onInput"
    @keydown.down.prevent="moveDown"
    @keydown.up.prevent="moveUp"
    @keydown.enter="handleEnter"
    placeholder="输入 @ 关联思维导图"
    :rows="dynamicRows"
    
    class="textarea"
  ></textarea>
</template>

<script setup>
import { ref, nextTick, watch, onMounted, computed } from 'vue'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

const props =defineProps({
  Treelist: {
    type: Object,
    required: true
  },
  chatHeight: {
    type: Number,
    default: 480
  }
})


const emit = defineEmits(['onInput'])

// 根据聊天框高度动态计算 textarea 行数
const dynamicRows = computed(() => {
  // 基础高度 480px 对应 17 行
  // 计算比例：当前高度 / 基础高度 * 基础行数
  const baseHeight = 480
  const baseRows = 16
  const minRows = 5  // 最小行数
  const maxRows = 30 // 最大行数
  
  const calculatedRows = Math.round((props.chatHeight / baseHeight) * baseRows)
  return Math.max(minRows, Math.min(maxRows, calculatedRows))  
})

/* ---------- 工具：先序扁平 ---------- */
const allNodes = []
function flatten(nodes) {
  nodes.forEach(n => {
    allNodes.push(n)
    if (n.children?.length) flatten(n.children)
  })
}


// flatten(props.Treelist)

// 初始化数据
onMounted(() => {
  if (props.Treelist) {
    allNodes.length = 0
    flatten(props.Treelist)
  }
})

watch(() => props.Treelist, (newVal, oldVal) => {
  allNodes.length = 0 // 清空数组
  flatten(newVal)
  console.log("flatten------------:",newVal);
})

/* ---------- 计算节点到根的完整路径 ---------- */
function buildPath(target) {
  const path = []
  let cur = target
  // 暴力递归，性能足够
  function dfs(nodes) {
    for (const n of nodes) {
      path.push(n)
      if (n === cur) return true
      if (n.children?.length && dfs(n.children)) return true
      path.pop()
    }
    return false
  }
  dfs(props.Treelist)
  return path.map(p => p.title || '未命名节点')
}

/* ---------- 渲染树 DOM ---------- */
function renderTree(nodes, depth = 0) {
  if (!Array.isArray(nodes)) nodes = []
  const ul = document.createElement('ul')
  ul.style.margin = '0'
  ul.style.paddingLeft = '16px'
  ul.style.listStyle = 'none'

  nodes.forEach(node => {
    const li = document.createElement('li')
    li.style.cursor = 'pointer'
    li.style.padding = `8px  0px 8px ${2 + depth * 8}px`
    li.style.whiteSpace = 'nowrap'
    li.style.overflow = 'hidden'
    li.style.color = `var(--color-text-1) !important;`
     li.style.background
    const icon = document.createElement('span')
    icon.style.display = 'inline-block'
    icon.style.width = '16px'
    icon.style.height = '16px'
    icon.style.marginRight = '4px'
    icon.style.transition = 'transform .2s'
    icon.style.verticalAlign = 'middle'
    icon.innerHTML = `
      <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="#1890ff" stroke-width="2">
        <path d="M6 4l4 4-4 4"/>
      </svg>
    `

    const text = document.createElement('span')
    text.textContent = node.title || '未命名节点'
    text.style.padding = '3px 0'
    
    // 如果节点标题为空，添加特殊样式
    if (!node.title) {
      text.style.color = '#999'
      text.style.fontStyle = 'italic'
    }

    let childUl = null
    if (node.children?.length) {
      childUl = renderTree(node.children, depth + 1)
      childUl.style.display = 'none'
      icon.addEventListener('click', (e) => {
        e.stopPropagation()
        const isOpen = childUl.style.display === 'block'
        childUl.style.display = isOpen ? 'none' : 'block'
        icon.style.transform = isOpen ? '' : 'rotate(90deg)'
      })
    } else {
      icon.style.visibility = 'hidden'
    }

    /* 点击文字：插入 @路径 */
    text.addEventListener('click', () => {
      const path = buildPath(node)
      insert('@' + path.join('/'))
    })

    li.append(icon, text, childUl)
    ul.appendChild(li)
  })
  return ul
}

/* ---------- 生成 tippy 内容 ---------- */
let popper = null
function buildTreeContent() {
  const container = document.createElement('div') 
    container.style ={  
     width:'100%',
     maxHeight:'200px',
     overflow:'auto',
     background:'#fff',
     border:'1px solid #e0e0e0',
     borderRadius:'4px',
    }


  container.appendChild(renderTree(props.Treelist))
  return container
}

/* ---------- 插入文本 ---------- */
function insert(str) { 
     const pos = ta.value.selectionStart
     const before = text.value.slice(0, pos)
     const after  = text.value.slice(pos)
     const newText = before.replace(/@[^@\s]*$/, str + '; ')
     text.value = newText + after  
  hidePopper()
  nextTick(() => {
    ta.value.selectionStart = ta.value.selectionEnd = newText.length
    ta.value.focus()
     emit('onInput', text.value) 
  })
}

/* ---------- 状态 ---------- */
const text = ref('')
const ta = ref()
let activeIdx = 0

/* ---------- 计算候选 ---------- */
const candidates = () => allNodes.filter(n =>
  n.title.toLowerCase().includes(text.value.slice(0, ta.value.selectionStart).match(/@([^@\s]*)$/)?.[1]?.toLowerCase() || '')
)

/* ---------- 控制弹窗 ---------- */
function showPopper() {
  hidePopper()
  if (!candidates().length) return
  activeIdx = 0
  popper = tippy(ta.value, {
    content: buildTreeContent(),
    placement: 'bottom-start',
    trigger: 'manual',
    id:'tippy-2',
    theme: 'MentionTree',
    allowHTML: true,
    interactive: true,
    offset: [0, 4],
  })
  popper.show()
}
function hidePopper() {
  popper?.destroy()
  popper = null
}

/* ---------- 事件 ---------- */
function onInput() {
  nextTick(() => {
    if (/@([^@\s]*)$/.test(text.value.slice(0, ta.value.selectionStart))) {
      showPopper()
    } else {
      hidePopper()
    }
  })
  emit('onInput', text.value) 
}

function moveDown() {
  activeIdx = Math.min(activeIdx + 1, candidates().length - 1)
}

function moveUp() {
  activeIdx = Math.max(activeIdx - 1, 0)
}

function selectActive() {
  const candidateList = candidates()
  if (candidateList.length > 0) {
    insert(candidateList[activeIdx].title)
  }
}

function handleEnter(event) {
  // 检查是否有@符号匹配且有候选项
  const hasAtSymbol = /@([^@\s]*)$/.test(text.value.slice(0, ta.value.selectionStart))
  const candidateList = candidates()
  
  // 只有在有@符号匹配且有候选项时才阻止默认行为
  if (hasAtSymbol && candidateList.length > 0 && popper) {
    event.preventDefault()
    selectActive()
  }
  // 否则允许正常换行（不阻止默认行为）
}

</script>

<style >
.textarea {
  width: 100%;
   padding: .5rem;
   box-sizing: border-box; 
  font-size: 1.2rem;
  resize: none; 
   color: var(--color-text-1) !important; 
   border-radius: 0.5rem;
   margin-bottom: 1.5rem !important; 
}
.textarea:focus {
  outline: none;
}
/**************** tippy ************************ */
html[ arco-theme="dark"] .tippy-content{
  background-color: var(--color-gray-800) !important;
}
 .tippy-content{
     width: 19rem !important;
    color:var( --color-text-4 ) !important;
     background-color: var(--color-gray-700) !important;
     border-radius: 0.2rem;
}

html[ arco-theme="dark"].tippy-box{
    background-color: var(--color-gray-800) !important;
}
.tippy-box{
  display: fixed !important; 
  bottom: 22rem;
   width: 19rem !important; 
   background-color: var(--color-gray-700) !important;
  left: 0;
  color: var(--color-text-1) !important;

}
   
 
</style>