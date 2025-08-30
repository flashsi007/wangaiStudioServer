import {treeToMarkdown} from "./treeToMarkdown.js" 


/**
 * 根据提示文本和树形数据生成 Markdown 内容
 * @param {string} promptText - 包含 @#路径 语法的提示文本
 * @param {Array} jsonData - 树形结构的数据
 * @returns {string} 生成的 Markdown 内容
 */
export default function generateMarkdown(promptText, jsonData) {
  // 解析 @#路径 的正则表达式，匹配到逗号、换行或字符串结尾
  const pathRegex = /@#([^,\n]+)/g;
  
  let result = promptText;
  let match;
  
  // 重置正则表达式的 lastIndex
  pathRegex.lastIndex = 0;
  
  // 查找所有匹配的路径
  while ((match = pathRegex.exec(promptText)) !== null) {
    const fullPath = match[1].trim(); // 完整路径，如：写网文的步骤/第一阶段：市场调研（1-2天）
    const pathParts = fullPath.split('/');
    
    // 在树形数据中查找对应的节点
    const nodeData = findNodeByPath(jsonData, pathParts);
    
    if (nodeData) {
      // 生成该节点的 Markdown 内容
      const markdown = generateNodeMarkdown(nodeData);
      
      // 替换原始的 @#路径 为生成的 Markdown
      result = result.replace(match[0], markdown);
    }
  }
  
  return `
你是一个专业的AI助手，请基于用户提供的问题和相关的思维导图上下文信息，提供准确、详细且有价值的回答。
## 用户问题
  ${result}
------------------------------
## 相关上下文信息-思维导图
${treeToMarkdown(jsonData)}

## 回答要求
  1. **准确性**: 基于提供的思维导图上下文信息回答，确保信息准确
  2. **完整性**: 充分利用关联节点的信息，提供全面的回答
  3. **结构化**: 回答要有清晰的结构和逻辑
  4. **实用性**: 提供可操作的建议或解决方案
  5. **关联性**: 明确说明如何利用思维导图中的相关信息
## 特别说明
  - 如果用户问题与思维导图内容相关，请详细解释相关节点的含义和关系
  - 如果需要补充信息，请明确指出哪些方面需要更多细节
  - 可以建议用户关联更多相关的思维导图节点来获得更好的回答
  - 使用Markdown格式不要图表有利于做思维导图
  请开始回答:
 `
}

/**
 * 根据路径在树形数据中查找节点
 * @param {Array} data - 树形数据
 * @param {Array} pathParts - 路径部分数组
 * @returns {Object|null} 找到的节点或 null
 */
function findNodeByPath(data, pathParts) {
  if (!data || !pathParts || pathParts.length === 0) {
    return null;
  }
  
  // 递归查找函数
  function searchNode(nodes, targetPath, currentIndex = 0) {
    if (currentIndex >= targetPath.length) {
      return null;
    }
    
    const targetTitle = targetPath[currentIndex];
    
    for (const node of nodes) {
      if (node.title === targetTitle) {
        // 如果是最后一个路径部分，返回当前节点
        if (currentIndex === targetPath.length - 1) {
          return node;
        }
        
        // 否则继续在子节点中查找
        if (node.children && node.children.length > 0) {
          const result = searchNode(node.children, targetPath, currentIndex + 1);
          if (result) {
            return result;
          }
        }
      }
    }
    
    return null;
  }
  
  return searchNode(data, pathParts);
}

/**
 * 为节点生成 Markdown 内容
 * @param {Object} node - 节点数据
 * @returns {string} Markdown 格式的内容
 */
function generateNodeMarkdown(node) {
  let markdown = `## ${node.title}\n`;
  
  // 如果有子节点，生成列表
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      markdown += `  - ${child.title}\n`;
    });
  }
  
  return markdown;
}
 