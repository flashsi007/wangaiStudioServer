import { computed, onMounted, ref } from "vue";
import {childrenApi} from "@/api"
export function useMindmap(
    nodeData
){ 

/**
 * 更新子节点
 * @param {Object} data - 更新数据
 * @param {string} data.nodeId - 节点ID
 * @param {string} data.parentId - 父文档ID
 * @param {string} [data.title] - 节点标题
 * @param {string} [data.type] - 节点类型 ('markdown' | 'mindmap')
 * @param {number} [data.sort] - 排序号
 * @param {Object} [data.content] - 节点内容
 */
const dataMindmapChange = async  (data)=>{
 const param =    JSON.parse( JSON.stringify( nodeData.value ) ) 
  param.content = data
 let  res = await  childrenApi.updateChild(param._id,{ title:param.title, parentId: param.parentId, content:  param.content })



  console.log(res); 
}

return {
    dataMindmapChange
}
    
}