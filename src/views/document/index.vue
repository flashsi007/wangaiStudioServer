<template>
   
    <div class="h-full w-full  ">
        <!-- 头部 -->
        <div class=" h-12 w-[100%] flex items-center pl-14 docTop">
            <div  >
                top
            </div>
        </div>

        <!-- 内容 -->
        <div class=" h-[calc(100vh-3rem)] p-5" :style="{overflowY:'scroll'}">
             <MinMap v-if="activate == 'mindmap'" ref="mindMapRef" :nodeData="mindmap.content" @dataChange="dataMindmapChange" />
             <MarkdownEditor v-if="activate == 'markdown'" ref="markdownRef" :markdown="markdown" />
             
       </div>  
     
    </div>
</template>

<script setup>
const userId = "687afdefefde72a6ffb20410" 
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { childrenApi } from '@/api'
import MinMap from '@/components/MinMap/index.vue'
import MarkdownEditor from "@/components/Editor/index.vue"
import { useMindmap } from './composables'

const mindMapRef = ref(null)
const markdownRef = ref(null)
const activate = ref("")

const route = useRoute()
const id = ref(route.query.id) 
const documentId = ref(route.query.parentId) 



// 监听路由查询参数变化
watch( () => route.query,
  (newQuery) => {
    id.value = newQuery.id
    documentId.value = newQuery.parentId
    // 当路由参数变化时重新获取数据
    if (id.value && documentId.value) {
      getChild()
    }
  },
  { deep: true }
)


const mindmap = ref({
  type:'',
  content:{
      "data": {
        "text": "🎯 主题", 
    },
  }
})

const markdown = ref({
  content: { type: "heading",   props: {  level: 1, },   content: "今天写的什么！"}
})


const getChild = async ()=>{
  const {data}  = await childrenApi.getChild({userId:userId, childId:id.value, documentId:documentId.value})  
  switch( data.type ){ 
    case 'markdown':
      activate.value = 'markdown'
       data.content = (  data.content ? data.content  : { type: "heading",   props: {  level: 1, },   content:data.title || '今天写点什么！'}  )
        markdown.value = data 
      break;
    case 'mindmap':
        activate.value = 'mindmap'
        data.content = (  data.content ? data.content  : {data: {  text: data.title || "主题",   } }  )
        mindmap.value = data 
      break; 
  }
  console.log(data);
  
}



onMounted(()=>{
    getChild() 
    // setTimeout(()=>{ 
    //   console.log( mindMapRef.value.getMarkdown() ); 
    //  },1000)
})

const {dataMindmapChange} = useMindmap(mindmap)
</script>




<style scoped>
    .docTop{
        border-bottom: var(--border) 1px solid;
    }
</style>
