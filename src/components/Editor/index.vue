<template>
    <div>
        <TiptapEditor 
        :showTopMenu="true" 
        :type="types[0]"  
         @onChange="onChange"
         :content="content" 
         :Treelist="Treelist" 
         />
    </div>
</template>
<script setup>
const Treelist = [
  {
    title: '写网文的步骤',
    key: 'root-1',
    children: [
      {
        title: '第一阶段：市场调研',
        key: '1-1',
        children: [
          { title: '分析当前热门榜单', key: '1-1-1', children: [] },
          { title: '研究爆款套路', key: '1-1-2', children: [] }
        ]
      },
      {
        title: '第二阶段：核心创意',
        key: '1-2',
        children: []
      }
    ]
  },
  {
    title: '技术文档',
    key: 'root-2',
    children: [
      { title: '前端开发', key: '2-1', children: [{ title: 'Vue.js', key: '2-1-1', children: [] }] },
      { title: '后端开发', key: '2-2', children: [{ title: 'Node.js', key: '2-2-1', children: [] }] }
    ]
  }
] 

import TiptapEditor from "@/components/TiptapEditor/index.vue"
import {watch,ref} from "vue"
const content = ref('')
const types = [
  "markdown",
  "html",
  "json",
]
const props = defineProps({
    content: {
        type: Object,
        default: () => ({})
    }
})

watch( () => props.markdown, (newVal) => {
  content.value =newVal 
})


const onChange = (newVal)=>{
    console.log(newVal)
}

</script>