export default function extractNodeByPath(path, tree) {
  // 递归搜索函数
  function findNode(nodes, pathParts, currentIndex) {
    for (const node of nodes) {
      // 检查当前节点是否匹配路径的当前部分
      if (node.title.includes(pathParts[currentIndex])) {
        // 如果是路径的最后一部分，返回简化后的节点
        if (currentIndex === pathParts.length - 1) {
          // 提取节点标题的最后一部分
          const titleParts = node.title.split('/');
          const simpleTitle = titleParts[titleParts.length - 1];
          
          // 返回简化后的节点结构
          return {
            title: simpleTitle,
            key: node.key,
            children: node.children ? [...node.children] : []
          };
        }
        
        // 继续递归查找子节点
        if (node.children && node.children.length > 0) {
          const result = findNode(node.children, pathParts, currentIndex + 1);
          if (result) return result;
        }
      }
    }
    return null;
  }
  
  // 分割路径
  const pathParts = path.split('/');
  
  // 开始搜索
  return findNode(tree, pathParts, 0);
}