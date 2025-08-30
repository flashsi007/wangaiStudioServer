import { nextTick, onMounted, ref, onUnmounted, watch } from 'vue'
import MindMap from 'simple-mind-map'
import Export from 'simple-mind-map/src/plugins/Export.js'
import RichText from 'simple-mind-map/src/plugins/RichText.js'
import markdown from 'simple-mind-map/src/parse/markdown.js'
import Drag from 'simple-mind-map/src/plugins/Drag.js'

import catalogOrganization from "@/assets/images/catalogOrganization.jpg"
import fishbone from "@/assets/images/fishbone.jpg"
import logicalStructure from "@/assets/images/logicalStructure.jpg"
import mindMap from "@/assets/images/mindMap.jpg"
import organizationStructure from "@/assets/images/organizationStructure.jpg"
import timeline from "@/assets/images/timeline.jpg"
import timeline2 from "@/assets/images/timeline2.jpg"

import verticalTimeline from "@/assets/images/verticalTimeline.jpg"
import { htmlToText } from 'html-to-text'
import convertToTreeStructure from "./function/convertToTreeStructure"
import generateMarkdown from "./function/buildPrompter"
import getTreeItem from "./function/getTreeItem"
import generateTreeWithRemark from "./function/generateTreeWithRemark"
import {chatStream} from "@/api" 

export function useMinMap(props,emit){
     // 获取主题配置
const getThemeConfig = () => {
  if (isDark.value) {
    return {
      theme: 'dark',
      themeConfig: {
        backgroundColor: '#111827',
        lineColor: '#6b7280',
        lineWidth: 2,
        generalizationLineColor: '#6b7280',
        associativeLineColor: '#6b7280',
        nodeUseLineStyle: false,
        rootNodeFillColor: '#1f2937',
        rootNodeColor: '#1f2937',
        rootNodeBorderColor: '#374151',
        secondNodeFillColor: '#374151',
        secondNodeColor: '#1f2937',
        secondNodeBorderColor: '#4b5563',
        nodeColor: '#1f2937',
        nodeFillColor: '#4b5563',
        nodeBorderColor: '#6b7280'
      }
    }
  } else {
    return {
      theme: 'default',
      themeConfig: {
        backgroundColor: '#ffffff',
        lineColor: '#549688',
        lineWidth: 2,
        generalizationLineColor: '#549688',
        associativeLineColor: '#549688',
        nodeUseLineStyle: false,
        rootNodeFillColor: '#f8f9fa',
        rootNodeColor: '#1f2937',
        rootNodeBorderColor: '#e5e7eb',
        secondNodeFillColor: '#f1f3f4',
        secondNodeColor: '#374151',
        secondNodeBorderColor: '#d1d5db',
        nodeColor: '#4b5563',
        nodeFillColor: '#f9fafb',
        nodeBorderColor: '#e5e7eb'
      }
    }
  }
}

const layoutTypes = [
  { label:'逻辑结构', value:'logicalStructure',icon:logicalStructure},
  { label:'思维导图', value:'mindMap',icon:mindMap},
  { label:'组织结构', value:'organizationStructure',icon:organizationStructure},
  { label:'目录组织', value:'catalogOrganization',icon:catalogOrganization},
  { label:'时间线', value:'timeline',icon:timeline},
  { label:'时间线2', value:'timeline2',icon:timeline2},
  { label:'垂直时间线', value:'verticalTimeline',icon:verticalTimeline},
  { label:'鱼骨图', value:'fishbone',icon:fishbone },
]
  

// 注册插件
MindMap.usePlugin(Export)
MindMap.usePlugin(RichText)
MindMap.usePlugin(Drag)

const mindMapContainer = ref(null)
let mindMapInstance = null
const isDark = ref(false)

// 右键菜单相关
const showContextMenu = ref(false)
const menuPosition = ref({ x: 0, y: 0 })
const currentNode = ref(null)
const visible = ref(false)
const selectNode = ref(null)
const modalTitle = ref('')
const mentionOptions = ref([])
const treeData = ref([])
const selectedKeys = ref([]) // 树组件选中的节点
const mentionTitle = ref('') // mention 输入框的文本
const isLoading = ref(false)
const btnText = ref('发送')
const isSend = ref(false)
const isShowPlusNode = ref(false)
const AiAnswer = ref('')
const isShowAiAnswer = ref(false)

// 检测当前主题
const detectTheme = () => {
  const html = document.documentElement
  isDark.value = html.classList.contains('dark') || html.getAttribute('arco-theme') === 'dark'
}


const setLayout = (layout)=>{
  if (mindMapInstance) {
    mindMapInstance.setLayout(layout);
  }
}

// 工具栏功能函数
// 放大
const zoomIn = () => {
  if (mindMapInstance) {
    mindMapInstance.view.enlarge()
    console.log('放大成功')
  }
}

// 缩小
const zoomOut = () => {
  if (mindMapInstance) {
    mindMapInstance.view.narrow()
    console.log('缩小成功')
  }
}

// 适应画布
const fitCanvas = () => {
  if (mindMapInstance) {
    try {
      // 使用reset方法重置视图变换，使思维导图适应画布
      mindMapInstance.view.reset()
      console.log('适应画布成功')
    } catch (error) {
      console.error('适应画布失败:', error)
      // 如果reset方法不可用，尝试其他方法
      try {
        // 获取画布和思维导图的尺寸信息
        const containerRect = mindMapContainer.value.getBoundingClientRect()
        const svgRect = mindMapInstance.svg.node().getBBox()
        
        // 计算缩放比例
        const scaleX = (containerRect.width - 100) / svgRect.width
        const scaleY = (containerRect.height - 100) / svgRect.height
        const scale = Math.min(scaleX, scaleY, 1) // 不超过1倍缩放
        
        // 设置缩放和居中
        mindMapInstance.view.setScale(scale)
        mindMapInstance.view.setTransform({
          x: (containerRect.width - svgRect.width * scale) / 2,
          y: (containerRect.height - svgRect.height * scale) / 2
        })
        console.log('适应画布成功（备用方法）')
      } catch (fallbackError) {
        console.error('适应画布备用方法也失败:', fallbackError)
      }
    }
  }
}

// 导入数据
const importData = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,.smm'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result)
          if (mindMapInstance) {
            mindMapInstance.setData(data)
            console.log('导入成功')
          }
        } catch (error) {
          console.error('导入失败:', error)
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

// 导出数据
const exportData = () => {
  if (!mindMapInstance) return
  
  try {
    exportAsPng()
    console.log('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
  }
}
 

// 树选择事件处理
const onTreeSelect = (keys, { selected, selectedNodes, node, event }) => {
  // console.log('选中的节点keys:', keys)
  // console.log('选中的节点信息:', { selected, selectedNodes, node })
  
  // 实时获取并打印选中节点的路径
  setTimeout(() => {
    const paths = getSelectedNodePaths()
    const node =  getTreeItem( paths[0], JSON.parse( JSON.stringify(  treeData.value )  ) )
    mentionTitle.value +=  node.title+','
    selectedKeys.value = [] 
  }, 100)
}

// 获取选中节点的完整路径
const getSelectedNodePaths = () => {
  if (!mindMapInstance || selectedKeys.value.length === 0) {
    return []
  }
  
  const mindMapData = mindMapInstance.getData()
  const paths = []
  
  // 递归查找节点路径的函数
  const findNodePath = (node, targetUid, currentPath = []) => {
    const newPath = [...currentPath, node.data.uid]
    
    if (node.data.uid === targetUid) {
      return newPath
    }
    
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        const result = findNodePath(child, targetUid, newPath)
        if (result) {
          return result
        }
      }
    }
    
    return null
  }
  
  // 为每个选中的节点查找路径
  selectedKeys.value.forEach(selectedUid => {
    const path = findNodePath(mindMapData, selectedUid)
    if (path) {
      paths.push(path.join('/'))
    }
  })
  
  return paths
}

const handleDoubleClick = (node) => {
   if(isLoading.value == true) return

   btnText.value = '发送'
   mentionTitle.value = ""
   selectedKeys.value = [] 
   isSend.value = false
   isLoading.value = false
   isShowPlusNode.value = false
   isShowAiAnswer.value = false
   AiAnswer.value = ""

  console.log('双击事件触发', node)
}
// 打开AI助手
const openAIAssistant = () => {
   btnText.value = '发送'
   mentionTitle.value = ""
   selectedKeys.value = [] 
   isSend.value = false
   isLoading.value = false
   isShowPlusNode.value = false
   isShowAiAnswer.value = false
   AiAnswer.value = ""


   if(selectNode.value !== null){ // 选中了节点 
    const plainText = htmlToText(selectNode.value.nodeData.data.text, {
       wordwrap: false, // 禁用自动换行
       preserveNewlines: false // 不保留换行符
     })
     modalTitle.value =  plainText    

  
   }else{ // 没有选中节点 使用根节点
    const {data} = mindMapInstance.getData()
    const plainText = htmlToText(data.text , {
      wordwrap: false, // 禁用自动换行
      preserveNewlines: false // 不保留换行符
    }) 
    modalTitle.value = plainText   
   }

  treeData.value =  convertToTreeStructure(  mindMapInstance.getData() ) 
    mentionOptions.value = [{ value: '#', label: 'z' }]

   setTimeout(()=>{
      visible.value = true  
   },100)
}
 
 const handleSend = () => {
    // visible.value = false;
   let prompte =  generateMarkdown(mentionTitle.value, JSON.parse( JSON.stringify( treeData.value ) ))
   isLoading.value = true
   isShowPlusNode.value = false
   isShowAiAnswer.value = true
   chatStream(
    prompte,
    (data)=>{
      AiAnswer.value +=  (data + '\n')
      // console.log(data)
    },
    (err)=>{
     isLoading.value = false
     isSend.value = false
     isShowPlusNode.value = true
     btnText.value = '发送'
    },
    ()=>{
      isSend.value = true
      btnText.value = '重新生成'
      isLoading.value = false
      isShowPlusNode.value = true
    }
  );
  //  console.log(  prompte );
   
 };

  // 应用AI回答生成 思维导图
 const addNodeTree = ()=>{
   if (!mindMapInstance || !AiAnswer.value.trim()) {
     console.warn('思维导图实例不存在或AI回答为空')
     return
   }
   
   try {
     // 生成新的树结构
     let tree = generateTreeWithRemark(AiAnswer.value)
     
     if (!tree || !tree.data) {
       console.warn('生成的树结构无效')
       return
     }
     
     // 获取当前思维导图数据的深拷贝
     const currentData = JSON.parse(JSON.stringify(mindMapInstance.getData()))
     
     // 确保根节点有children数组
     if (!currentData.children) {
       currentData.children = []
     }
     
     // 将生成的树添加到根节点的children中
     currentData.children.push(tree)
     
     // 更新思维导图数据
     mindMapInstance.setData(currentData)
     
     console.log('AI生成的思维导图节点已添加到根节点', tree)
     console.log('更新后的完整数据结构:', currentData)
     
     // 关闭AI助手弹窗
     visible.value = false
     
   } catch (error) {
     console.error('添加AI生成节点失败:', error)
   }
 }

 const handleCancel = () => {
   visible.value = false;
 }

// 初始化思维导图
const initMindMap = () => {
  if (!mindMapContainer.value) return
  
  try {
    detectTheme()
    const themeConfig = getThemeConfig()
    
    mindMapInstance = new MindMap({
      el: mindMapContainer.value,
      data: props.nodeData,
      // 基础配置
      layout: 'logicalStructure', // 布局类型
      theme: themeConfig.theme,
      themeConfig: themeConfig.themeConfig,
      // 启用富文本
      richText: true,
      // 节点配置
      nodeConfig: {
        useCustomNodeContent: false,
        textAutoWrapWidth: 500
      },
      // 连线配置
      lineConfig: {
        width: 2,
        color: themeConfig.themeConfig.lineColor,
        showArrow: false
      }
    })
    
    // 添加右键菜单事件监听
    mindMapInstance.on('node_contextmenu', (e, node) => {
      if (e.which === 3) { // 右键点击
        e.preventDefault()
        menuPosition.value = {
          x: e.clientX + 10,
          y: e.clientY + 10
        }
        showContextMenu.value = true
        currentNode.value = node
      }
    })
    
    // 监听思维导图数据变化
    mindMapInstance.on('data_change', (data) => {
      console.log('思维导图数据发生变化:', data)
      // 可以在这里触发自定义事件或回调
      emit('dataChange', data)
    })
    
    // 监听节点数据变化
    mindMapInstance.on('node_tree_change', (data) => {
      console.log('节点树结构发生变化:', data)
      emit('nodeTreeChange', data)
    })
    
    // 监听节点激活状态变化
    mindMapInstance.on('node_active', (node, activeNodeList) => {
      emit('nodeActive', { node, activeNodeList })
      // activeNodes.value = activeNodeList
      selectNode.value = node
      console.log('节点激活状态变化:', { node, activeNodeList })
    })
    
    // 监听节点开始编辑事件
    mindMapInstance.on('before_show_text_edit', () => {
        // 在节点开始编辑时设置文字颜色
        console.log("before_show_text_edit..........");
        setTimeout(() => {
          const editInput = document.querySelector('[contenteditable="true"]')
          if (editInput) {
            editInput.style.color =  '#000 !important'
          }
        }, 100)
      })
    
    // 监听节点内容变化
    mindMapInstance.on('node_text_edit_end', (node, text) => {
      console.log('节点文本编辑结束:', { node, text })
      emit('nodeTextEditEnd', { node, text }) 
    })
    
    // 点击其他地方隐藏菜单
    document.addEventListener('click', hideContextMenu)
    
    // console.log('思维导图初始化成功', mindMapInstance)
  } catch (error) {
    console.error('思维导图初始化失败:', error)
  }
}

// 更新主题
const updateTheme = () => {
  if (!mindMapInstance) return
  
  detectTheme()
  const themeConfig = getThemeConfig()
  
  try {
    mindMapInstance.setTheme(themeConfig.theme)
    mindMapInstance.setThemeConfig(themeConfig.themeConfig)
    console.log('主题更新成功:', themeConfig.theme)
  } catch (error) {
    console.error('主题更新失败:', error)
  }
}

// 隐藏右键菜单
const hideContextMenu = () => {
  showContextMenu.value = false
  currentNode.value = null
}

// 创建文档
const createDocument =  async () => {
  if (!mindMapInstance) return
  
  try {
      // 获取节点文本
  const nodeText = currentNode.value.nodeData.data.text
  
  // 获取节点完整数据
  const nodeData = currentNode.value.nodeData.data
  
  console.log('节点文本:', nodeText)
  console.log('节点数据:', nodeData)
    
  } catch (error) {
    console.error('导出文本失败:', error)
  }
  hideContextMenu()
}

// 导出为PNG
const exportAsPng = async () => {
  if (!mindMapInstance) return
  
  try {
    const data = await mindMapInstance.doExport.png({
      transparent: false,
      fitBg: true
    })
    
    // 创建下载链接
    const link = document.createElement('a')
    link.href = data
    link.download = `思维导图_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    console.log('PNG导出成功')
  } catch (error) {
    console.error('PNG导出失败:', error)
  }
  hideContextMenu()
}

// 添加节点
const addNode = () => {
  if (!mindMapInstance || !currentNode.value) return
  
  try {
    // 先激活当前节点
    mindMapInstance.renderer.activeNodeList = [currentNode.value]
    const newNodeData = {
      text: '新节点',
      expand: true
    }
    mindMapInstance.execCommand('INSERT_CHILD_NODE', true, [newNodeData])
    console.log('添加节点成功')
  } catch (error) {
    console.error('添加节点失败:', error)
  }
  hideContextMenu()
}

// 删除节点
const deleteNode = () => {
  if (!mindMapInstance || !currentNode.value) return
  
  try {
    // 不能删除根节点
    if (currentNode.value.isRoot) {
      console.warn('不能删除根节点')
      return
    }
    // 先激活当前节点
    mindMapInstance.renderer.activeNodeList = [currentNode.value]
    mindMapInstance.execCommand('REMOVE_NODE')
    console.log('删除节点成功')
  } catch (error) {
    console.error('删除节点失败:', error)
  }
  hideContextMenu()
}

// 监听主题变化
const observeThemeChange = () => {
  const observer = new MutationObserver(() => {
    updateTheme()
  })
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'arco-theme']
  })
  
  return observer
}

let themeObserver = null

// 组件挂载后初始化
onMounted(() => {
  nextTick(() => {
    initMindMap()
    themeObserver = observeThemeChange()
  })
})

// 组件卸载时清理
onUnmounted(() => {
  if (mindMapInstance) {
    mindMapInstance.destroy()
    mindMapInstance = null
  }
  if (themeObserver) {
    themeObserver.disconnect()
    themeObserver = null
  }
  // 移除事件监听器
  document.removeEventListener('click', hideContextMenu)
})

// 获取当前思维导图数据
const getMindMapData = () => {
  if (!mindMapInstance) return null
  return mindMapInstance.getData()
}

// 获取Markdown内容
const getMarkdown = () => {
  if (!mindMapInstance) return ''
  
  try {
    const data = mindMapInstance.getData()
    const mdContent = markdown.transformToMarkdown(data)
    return mdContent
  } catch (error) {
    console.error('获取Markdown内容失败:', error)
    return ''
  }
}



watch(() => props.nodeData, (newData) => {
  if (mindMapInstance) {
    mindMapInstance.setData(newData)
  }
})


return { 
    mindMapContainer,
    showContextMenu,
    menuPosition,
    currentNode,
    visible,
    selectNode,
    modalTitle,
    mentionOptions,
    treeData,
    selectedKeys ,
    mentionTitle ,
    isLoading,
    btnText,
    isSend,
    isShowPlusNode,
    AiAnswer,
    isShowAiAnswer,
    layoutTypes,
    mindMapInstance,  

    detectTheme,
    setLayout,
    zoomIn,
    zoomOut,
    fitCanvas,
    importData,
    exportData,
    onTreeSelect,
    getSelectedNodePaths,
    handleDoubleClick,
    openAIAssistant,
    handleSend,
    addNodeTree,
    handleCancel,
    initMindMap,
    updateTheme,
    hideContextMenu,
    createDocument,
    exportAsPng,
    addNode,
    deleteNode,
    observeThemeChange,
    getMindMapData,
    getMarkdown,
}

}