export function treeToMarkdown(tree, level = 0) {
  // 检查输入是否有效
  if (!tree || !Array.isArray(tree) || tree.length === 0) {
    return '';
  }
  
  let markdown = '';
  
  // 遍历树中的每个节点
  for (const node of tree) {
    // 提取节点标题的最后一部分（去掉路径）
    const titleParts = node.title.split('/');
    const displayTitle = titleParts[titleParts.length - 1];
    
    // 添加当前节点的Markdown行（带缩进）
    const indent = '  '.repeat(level);
    markdown += `${indent}- ${displayTitle}\n`;
    
    // 递归处理子节点
    if (node.children && node.children.length > 0) {
      markdown += treeToMarkdown(node.children, level + 1);
    }
  }
  
  return markdown;
}

export function treeToMarkdownPuls(tree , options = {}) {
  const {
    level = 0,
    indentSize = 2,
    showKeys = false,
    rootTitle = ''
  } = options;
  
  if (!tree || !Array.isArray(tree) || tree.length === 0) {
    return '';
  }
  
  let markdown = '';
  const indent = ' '.repeat(level * indentSize);
  
  for (const node of tree) {
    // 提取显示标题
    const titleParts = node.title.split('/');
    let displayTitle = titleParts[titleParts.length - 1];
    
    // 添加根标题（如果指定）
    if (level === 0 && rootTitle) {
      displayTitle = `${rootTitle}/${displayTitle}`;
    }
    
    // 添加key（如果启用）
    const nodeText = showKeys 
      ? `${displayTitle} (${node.key})` 
      : displayTitle;
    
    // 添加当前节点
    markdown += `${indent}- ${nodeText}\n`;
    
    // 递归处理子节点
    if (node.children && node.children.length > 0) {
      markdown += treeToMarkdown(node.children, {
        level: level + 1,
        indentSize,
        showKeys,
        rootTitle: level === 0 ? displayTitle : rootTitle
      });
    }
  }
  
  return markdown;
}