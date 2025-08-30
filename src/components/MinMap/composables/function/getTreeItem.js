 export default function getTreeItem(path, tree) {
  // 将路径拆分为节点ID数组
  const keys = path.split('/');
  
  // 递归查找节点并收集标题
  function findNode(nodes, currentIndex, titlePath) {
    for (const node of nodes) {
      if (node.key === keys[currentIndex]) {
        // 构建当前路径标题
        const currentTitle = titlePath ? `${titlePath}/${node.title}` : node.title;
        
        // 如果是路径的最后一个节点
        if (currentIndex === keys.length - 1) {
          // 返回一个包含完整路径标题和子节点的对象
          return {
            title: currentTitle,
            key: node.key,
            children: node.children ? [...node.children] : []
          };
        }
        
        // 继续递归查找子节点
        if (node.children && node.children.length > 0) {
          const result = findNode(node.children, currentIndex + 1, currentTitle);
          if (result) return result;
        }
      }
    }
    return null;
  }
  
  // 处理树对象或树数组
  const treeNodes = Array.isArray(tree) ? tree : [tree];
  
  // 从根节点开始查找
  return findNode(treeNodes, 0, "");
}


 