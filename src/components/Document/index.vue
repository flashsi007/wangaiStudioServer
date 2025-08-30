<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { documentApi,childrenApi } from "@/api"
import { 
  Plus,
  Network,
  MoreHorizontal,
  FileText,
  Map,
  Edit3,
  Trash2,
  ChevronRight,
  ChevronDown,
  AlignStartVertical 
} from 'lucide-vue-next'

const documentList = ref([])
const expandedNodes = ref(new Set())
const editingNode = ref(null)
const editingValue = ref('')
const showDropdown = ref(null)
const newNodeParent = ref(null)
const newNodeType = ref('')
const newNodeValue = ref('')
const isDark = ref(false)

const userId = "687afdefefde72a6ffb20410"

const emit = defineEmits(['onClick'])

// 获取文档列表
async function getDocuments() {
  try {
    const {data} = await documentApi.getDocuments({
      userId: userId,
      page: 1,
      limit: 50,
    })
    documentList.value =  data
  } catch (error) {
    console.error('获取文档列表失败:', error)
  }
}

// 切换节点展开状态
function toggleNode(nodeId) {
  if (expandedNodes.value.has(nodeId)) {
    expandedNodes.value.delete(nodeId)
  } else {
    expandedNodes.value.add(nodeId)
  }
}

// 显示下拉菜单
function showMenu(event, nodeId, isRoot = false) {
  event.stopPropagation()
  showDropdown.value = { nodeId, isRoot, x: event.clientX, y: event.clientY }
}

// 隐藏下拉菜单
function hideMenu() {
  showDropdown.value = null
}


function getTreeItem(id, tree) {
  // 去除可能的空格
  const targetId = id.trim();
  
  // 使用深度优先搜索遍历树
  function findNode(nodes) {
    for (const node of nodes) {
      // 检查当前节点是否匹配
      if (node._id === targetId) {
        return node;
      }
      
      // 如果有子节点，递归查找
      if (node.children && node.children.length > 0) {
        const found = findNode(node.children);
        if (found) return found;
      }
    }
    return null;
  }
  
  return findNode(tree);
}

// 开始重命名
function startRename(nodeId, currentTitle) {
    console.log(nodeId, currentTitle);
    const node = getTreeItem(nodeId, documentList.value)
    console.log(node);
    
    console.log("开始重命名..........");
    
    showInput.value = true

  editingNode.value = nodeId
  editingValue.value = node.title
  hideMenu()
}

 

// 开始创建新节点
function startCreate(parentId, type) {
  newNodeParent.value = parentId
  newNodeType.value = type
  newNodeValue.value = ''
  hideMenu()
   
}

// 开始创建根节点
function startCreateRoot(type) {
  newNodeParent.value = null
  newNodeType.value = type
  newNodeValue.value = ''
  
  // 确保输入框获得焦点
  nextTick(() => {
    setTimeout(() => {
      const input = document.querySelector('.create-input-active')
      if (input) {
        input.focus()
        input.select()
      }
    }, 50)
  })
}

 
 

// 删除节点
async function deleteNode(nodeId) {
    console.log(nodeId);
       const node = getTreeItem(nodeId, documentList.value)
    switch(node.type){
        case "mindmap":
        case "markdown":
            await childrenApi.deleteChild(nodeId,{userId: userId,documentId: node.parentId  })
            break; 
        default :
        await  documentApi.deleteDocument({  userId: userId,   documentId: nodeId  }) 
    }

     await getDocuments()
    
handleConfirm()
  hideMenu()
}


const showInput = ref(false)
/**
 * 失去焦点
 */
 const handleConfirm = ()=>{ 
   showInput.value = false
   newNodeParent.value = null
   newNodeType.value = "" 
   showDropdown.value = false
 }

 /**
  * 获得焦点
  */
 const handleFocus = ()=>{ 
    showInput.value = true
 }
  
 /**
  * 按下回车键
  */
 const handleEnter = async (node)=>{ 
     if(!node._id) return 
     
      switch(node.type){
        case "mindmap": 
        case "markdown":
            await childrenApi.updateChild(node._id,{parentId: node.parentId, title: node.title}) 
         break;
        default :
        await documentApi.updateDocument({ userId: userId,  _id: node._id,  title: node.title}) 
    } 

    
    handleConfirm()
    await getDocuments()
}

 const handleEnterCreate = async ()=>{ 
    let params = {
        userId: userId,
        sort: 0,
        parentId: newNodeParent.value,
        type: newNodeType.value,
        title: newNodeValue.value,
    }

    await documentApi.addChild(params)
     await getDocuments() 
  handleConfirm()
 }

 
 const handleCreateRoot = async ()=>{
    await documentApi.createDocument({sort: 1, userId: userId, title: newNodeValue.value, })
     
     await getDocuments() 
    handleConfirm()
 }

const closeDropdown  = ()=>{
    showDropdown.value = false
}

const handleOpen = (node) => emit('onClick', node)


onMounted(async () => {
  // 恢复主题状态
  const savedTheme = localStorage.getItem('theme-dark')
  if (savedTheme === 'true') {
    isDark.value = true
  }
  
  await getDocuments() 
})

 
</script>

<template>
  <div  > 
     <div class="space-y-1 w-full ">
        <div :class="['text-xs px-2 mb-4 font-medium', isDark ? 'text-gray-500' : 'text-gray-400']">创作</div>

         <button @click="startCreateRoot('root')" :class="[
            'flex justify-between items-center px-2 py-1 text-sm rounded transition-colors mb-3 w-full cursor-pointer', 
              ]">
             <span>开始创作</span> 
             <Plus class="w-4 h-4 mr-2" />
        </button>
     </div>

    <!-- 创建根节点的输入框 -->
    <div  v-if="newNodeParent === null && newNodeType"   class="mb-4"  >
      <div class="flex items-center py-1 px-2">
            <Map v-if="newNodeType === 'mindmap'" class="w-4 h-4 mr-2" style="color: var(--primary)" />
            <FileText v-else class="w-4 h-4 mr-2" style="color: var(--muted-foreground)" />
            <input 
              v-model="newNodeValue"
               @blur="handleConfirm" 
               @keydown.enter="handleCreateRoot "
              placeholder="输入标题...根节点的输入框"
              class="flex-1 text-sm rounded px-2 py-1 focus:outline-none create-input-active"
              style="color: var(--muted-foreground); background-color: var(--muted); border: 1px solid var(--border); focus:ring: 2px var(--ring);"
            />
      </div>
    </div>

    <!-- 文档树 -->
    <div class="space-y-1 h-[22rem] overflow-y-auto">

      <!-- 无数据状态 -->
      <div v-if="!documentList || documentList.length === 0" class="flex flex-col items-center justify-center h-full text-center py-8">
        
        <h3 class="text-sm font-medium   mb-2">暂无文档</h3> 
      </div>
      
      <!-- 文档列表 -->
      <template v-else v-for="rootNode in documentList" :key="rootNode._id">
        <!-- 根节点 -->
        <div class="group "> 
          <div class="flex docRott items-center py-1 px-2 rounded transition-colors cursor-pointer" :style="{ paddingLeft: '8px' }"  >
            <!-- 展开/收起图标 -->
            <button 
              v-if="rootNode.children && rootNode.children.length > 0"
              @click="toggleNode(rootNode._id)"
              class="w-4 h-4 mr-1 text-muted-foreground hover:text-foreground flex-shrink-0"
            >
              <ChevronRight v-if="!expandedNodes.has(rootNode._id)" class="w-4.5 h-4.5" />
              <ChevronDown v-else class="w-4.5 h-4.5" />

            </button>
            <div v-else class="w-5 mr-1"></div>
            
            <!-- 文档图标 -->
            <AlignStartVertical  class="w-4 h-4 mr-2 flex-shrink-0" style="color: var(--muted-foreground)" />
            
            <!-- 标题 -->
            <div class="flex-1 min-w-0">
              <input 
                v-if="editingNode === rootNode._id && showInput"
                v-model="editingValue"
                @blur="handleConfirm"
                @focus="handleFocus" 
                @keydown.enter="handleEnter({...rootNode,title:editingValue}) "
                class="w-full text-sm rounded px-2 py-1 focus:outline-none"
                style="background-color: var(--muted); color: var(--muted-foreground); border: 1px solid var(--border);"
                ref="editInput"
              />
              <span   v-else class="text-sm font-medium truncate block">
                {{ rootNode.title }}
              </span>
            </div>
            
            <!-- 操作按钮 -->
            <button 
              @click="showMenu($event, rootNode._id, true)"
              class="opacity-0 group-hover:opacity-100 p-1 rounded transition-all ml-2 hover-btn"
              style="color: var(--muted-foreground);"
            >
              <MoreHorizontal class="w-4 h-4" />
            </button>
          </div>
          
          <!-- 创建新子节点的输入框 -->
          <div 
            v-if="newNodeParent === rootNode._id "
            class="ml-6 mt-1"
          >
            <div class="flex items-center py-1 px-2">
              
              <input 
                  v-model="newNodeValue"
                   @blur="handleConfirm" 
                   @keydown.enter="handleEnterCreate " 
                  placeholder="输入标题..."
                  class="flex-1 text-sm rounded px-2 py-1 focus:outline-none create-input-active"
                  style="background-color: var(--muted); color: var(--muted-foreground); border: 1px solid var(--border);"
                />
            </div>
          </div>
          
          <!-- 子节点 -->
          <div v-if="expandedNodes.has(rootNode._id) && rootNode.children" class="ml-4">
            <template v-for="childNode in rootNode.children" :key="childNode._id">
              <div class="group">
                <div 
                  class="flex items-center py-1 rounded transition-colors cursor-pointer child-node"
                  :style="{ paddingLeft: '2.2rem' }"
                >
                  <!-- 子节点图标 -->
                  <Network v-if="childNode.type === 'mindmap'"   class="w-4 h-4 mr-2 flex-shrink-0" style="color: var(--muted-foreground)" />
                  <FileText v-else class="w-4 h-4 mr-2 flex-shrink-0" style="color: var(--muted-foreground)" />
                  
                  <!-- 修改子节点标题 -->
                  <div class="flex-1 min-w-0">
                    <input 
                        v-if="editingNode === childNode._id && showInput"
                        v-model="editingValue" 
                         @blur="handleConfirm"
                         @focus="handleFocus"
                         @keydown.enter="handleEnter({...childNode,title:editingValue}) "
                         class="w-full text-sm rounded px-2 py-1 focus:outline-none"
                         style="background-color: var(--muted); color: var(--muted-foreground); border: 1px solid var(--border);"
                         />
                    <span  v-else   class="text-sm truncate block"  @click="handleOpen(childNode)" >
                      {{ childNode.title }}
                    </span>
                  </div>
                  
                  <!-- 子节点操作按钮 -->
                  <button 
                    @click="showMenu($event, childNode._id, false)"
                    class="opacity-0 group-hover:opacity-100 p-1 rounded transition-all ml-2 hover-btn"
                    style="color: var(--muted-foreground);"
                  >
                    <MoreHorizontal class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
    
    <!-- 下拉菜单 -->
    <div   v-if="showDropdown"    v-click-outside="closeDropdown"  class="fixed rounded-lg shadow-lg py-1 z-50 min-w-[160px] dropdown-menu" :style="{ left: showDropdown.x + 'px', top: showDropdown.y + 'px', backgroundColor: 'var(--popover)', border: '1px solid var(--border)' }" >
      <!-- 根节点菜单 -->
      <template v-if="showDropdown.isRoot">
        <button 
          @click="startCreate(showDropdown.nodeId, 'mindmap')"
          class="w-full text-left px-3 py-2 text-sm flex items-center menu-item"
          style="color: var(--popover-foreground);"
        >
          <Network class="w-4 h-4 mr-2" />
          创建思维导图
        </button>
        <button 
          @click="startCreate(showDropdown.nodeId, 'markdown')"
          class="w-full text-left px-3 py-2 text-sm flex items-center menu-item"
          style="color: var(--popover-foreground);"
        >
          <FileText class="w-4 h-4 mr-2" />
          创建文档
        </button>
        <div class="my-1" style="border-top: 1px solid var(--border);"></div>
      </template>
      
      <!-- 通用菜单项 -->
      <button  @click="startRename(showDropdown.nodeId, documentList.find(d => d._id === showDropdown.nodeId)?.title || '')"
        class="w-full text-left px-3 py-2 text-sm flex items-center menu-item"
        style="color: var(--popover-foreground);"
      >
        <Edit3 class="w-4 h-4 mr-2" />
        重命名
      </button>


      <button 
        @click="deleteNode(showDropdown.nodeId)"
        class="w-full text-left px-3 py-2 text-sm flex items-center menu-item-destructive"
        style="color: var(--destructive);"
      >
        <Trash2 class="w-4 h-4 mr-2" />
        删除
      </button>
    </div>
  </div>
</template>
<style scoped>
.docRott:hover {
  background-color: var(--muted);
}

.child-node:hover {
  background-color: var(--muted);
  color: var(--muted-foreground);
}

.hover-btn:hover {
  color: var(--foreground) !important;
}

.menu-item:hover {
  background-color: var(--accent);
}

.menu-item-destructive:hover {
  background-color: var(--destructive-10);
}
</style>