<template>
  <div class="mind-map-wrapper">  
    <div  id="mindMapContainer"   class="mind-map-container relative"   ref="mindMapContainer" > 
      <!-- 工具栏 -->
      <div class="toolbar absolute left-8 top-8 rounded-lg shadow-lg p-3 flex items-center gap-3 z-10">
        <!-- 放大按钮 -->
         <a-tooltip content="放大思维导图"> 
           <a-button type="text" size="small" @click="zoomIn" class="toolbar-btn"  >
             <template #icon> 
               <ZoomIn class="toolbar-icon" />
             </template>
           </a-button>
         </a-tooltip>
        
        <!-- 缩小按钮 -->
          <a-tooltip content="缩小思维导图">  
            <a-button type="text" size="small" @click="zoomOut" class="toolbar-btn"  >
              <template #icon> 
                <ZoomOut class="toolbar-icon" />
              </template>
            </a-button>
        </a-tooltip>
        
        <!-- 适应画布按钮 -->
         <a-tooltip content="适应画布大小">
           <a-button type="text" size="small" @click="fitCanvas" class="toolbar-btn"  >
             <template #icon> 
               <RefreshCcw  class="toolbar-icon" />
             </template>
           </a-button> 
         </a-tooltip>
        
        <!-- 分隔线 -->
        <div class="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
        
        <!-- 布局选择 -->
        <a-select :style="{width:'10rem',borderRadius:'2rem'} "  @change="setLayout" placeholder="选择布局" size="small" title="选择思维导图布局样式">
          <a-option v-for="item in layoutTypes" :key="item.value" :value="item.value">
            <div class="w-full flex justify-between items-center mb-2">
              <img :src="item.icon" alt="" class="w-16 h-16 mr-2">
              <div class="text-sm">{{item.label}}</div> 
            </div>
          </a-option> 
        </a-select>
        
        <!-- 分隔线 -->
        <div class="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
          
        <!-- 导出按钮 -->
         <a-tooltip content="导出思维导图"> 
          <a-button type="text" size="small" @click="exportData" class="toolbar-btn">
            <template #icon> 
            <Download class="toolbar-icon" />
            </template>
          </a-button>
         </a-tooltip>
        
        <!-- 导入Markdown按钮 -->
         <!-- <a-tooltip content="导入Markdown文件"> 
          <a-button type="text" size="small" @click="importMarkdown" class="toolbar-btn">
            <template #icon> 
            <Upload class="toolbar-icon" />
            </template>
          </a-button>
         </a-tooltip> -->
        
        <!-- 导出Markdown按钮 -->
         <!-- <a-tooltip content="导出为Markdown"> 
          <a-button type="text" size="small" @click="exportMarkdown" class="toolbar-btn">
            <template #icon> 
            <FileText class="toolbar-icon" />
            </template>
          </a-button>
         </a-tooltip> -->
        
        <!-- 分隔线 -->
        <div class="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
        
        <!-- AI助手按钮 -->
          <a-tooltip content="打开AI助手"> 
              <a-button type="text" size="small" @click="openAIAssistant" class="toolbar-btn"  >
                <template #icon> 
                  <Bot   class="toolbar-icon" />
                </template>
              </a-button>
        </a-tooltip>
      </div>
      
    </div>
    
    <!-- 右键菜单 -->
    <div v-if="showContextMenu"      class="context-menu"   :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }"  @click.stop >
      
        <div class="context-menu-item" @click="createDocument">
        <FilePenLine class="w-4 h-4" />
        <span>创建文档</span>
      </div>

      <div class="context-menu-item" @click="exportAsPng">
        <Download class="w-4 h-4" />
        <span>导出为PNG</span>
      </div>

      <!-- <div class="context-menu-item" @click="addNode">
        <Plus class="w-4 h-4" />
        <span>添加节点</span>
      </div> -->
      <div 
        v-if="currentNode && !currentNode.isRoot" 
        class="context-menu-item context-menu-item-danger" 
        @click="deleteNode"
      >
        <Trash2 class="w-4 h-4" />
        <span>删除节点</span>
      </div>
    </div>


    <a-modal class="rounded-lg" width="50%"  v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" :simple="false" :mask-closable="false" draggable>
        <template #title>
          <div class="overflow-hidden">
            <div class="text-lg max-w-96 font-bold text-ellipsis overflow-hidden whitespace-nowrap" > 
                {{ modalTitle }} 
            </div>
          </div>
        </template>
    <div>  
      <div v-if="isShowAiAnswer" class="ai-answer-container"> 
        <!-- 双击编辑提示 -->
        <div class="edit-hint">
          <MousePointer2 class="w-3 h-3" />
          <Edit3 class="w-3 h-3" />
          <span>双击编辑</span>
        </div>
        
        <!-- AI 回答内容 -->
        <div class="ai-content" @dblclick="handleDoubleClick">
          <VueMarkdown :source="AiAnswer" class="prose prose-sm dark:prose-invert max-w-none" />
        </div>
        
        <!-- 底部操作提示 -->
        <div class="operation-hint">
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>AI 回答完成</span>
          </div>
          <span class="text-gray-300 dark:text-gray-600">|</span>
          <span>双击可重新编辑问题</span>
        </div>
      </div>

      <div v-if="!isShowAiAnswer" class="w-full h-[25rem]"> 
        <a-mention v-model="mentionTitle"  placeholder="输入 @ 可以关联思维导图"  :auto-size="{  minRows:18,   maxRows:18 }" :data="mentionOptions"     type="textarea" >
           <template #option=OptionInfo >
             <div class="w-[20rem]"> 
               <a-tree 
                 :data="treeData"  
                 :show-line="true" 
                 v-model:selected-keys="selectedKeys"
                 :multiple="true"
                 @select="onTreeSelect"
               /> 
             </div>
             </template>
         </a-mention> 
      </div>

    </div>
    <template #footer> 
       <div class="flex justify-end">  
 
         <a-button type="text" size="small" v-if="isShowPlusNode" @click="addNodeTree">
            <template #icon>  
                <Plus v-if="!isSend"  class="toolbar-icon" />
            </template>
            应用
         </a-button>

         <a-button  :loading="isLoading" type="text" size="small" @click="handleSend"   >
           <template #icon> 
             <Send v-if="!isSend"  class="toolbar-icon" />
             <RefreshCcw v-if="isSend"  class="toolbar-icon" />
           </template>
           {{btnText}}
         </a-button>


       </div>
    </template>
  </a-modal>

  </div>
</template>

<script setup>
import VueMarkdown from 'vue-markdown-render'; 
import { FilePenLine, Plus, Trash2, Download, ZoomIn, ZoomOut, RefreshCcw , Bot, Send, Edit3, MousePointer2  } from 'lucide-vue-next' 
import { useMinMap } from "./composables/useMinMap.js"

 
const props  = defineProps({
  nodeData: {
    type: Object,
    default: () => ({})
  }
})

// 定义组件事件
const emit = defineEmits([
  'dataChange',
  'nodeTreeChange', 
  'nodeActive',
  'nodeTextEditEnd' 
])
 
 const  {
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

 } = useMinMap(props,emit)

 
// 暴露实例供父组件使用
defineExpose({
  mindMapInstance: () => mindMapInstance,
  updateTheme,
  getMindMapData,
  getMarkdown,
  getSelectedNodePaths
})

 

</script>

<style scoped>
@import "./map.css";
 
</style>