
export default function generatePrompter(value, editorDataText="",treeList) {
  console.log("value:  ", value);
  console.log("treeList:  ", treeList);
  console.log("editorDataText:  ", editorDataText);
  
  
  // 输入验证：确保 value 是字符串
  if (typeof value !== 'string') {
    value = value ? String(value) : '';
  }
  
  // 处理编辑器选中文本
  const hasSelectedText = editorDataText && editorDataText.trim().length > 0;
  
  // 提取 @ 路径
  const atMatches = value.match(/@([^;]+);/g);
  
  // 解析用户问题（去除 @ 路径部分）
  let userQuestion = value.replace(/@[^;]+;/g, '').trim();
  
  // 如果没有 @ 路径，生成基础提示词（包含选中文本）
  if (!atMatches || atMatches.length === 0) {
    return generateBasicPrompt(userQuestion || value, editorDataText);
  }
  
  // 如果用户问题为空或只包含无意义内容，使用默认提示
  if (!userQuestion || userQuestion.length < 2) {
    userQuestion = '请详细分析和解答';
  }
  
  // 收集所有相关的思维导图信息
  const contextInfo = [];
  const referencedPaths = [];
  
  atMatches.forEach(match => {
    const path = match.replace('@', '').replace(';', '').trim();
    const pathParts = path.split('/');
    referencedPaths.push(path);
    
    // 只有在 treeList 存在且有效时才查找节点
    if (treeList && Array.isArray(treeList) && treeList.length > 0) {
      const nodeInfo = findNodeByPath(treeList, pathParts);
      if (nodeInfo) {
        contextInfo.push(nodeInfo);
      }
    }
  });
  
  // 如果没有找到任何有效的思维导图节点，表示路径不存在，使用基础提示词
  if (contextInfo.length === 0) {
    return generateBasicPrompt(userQuestion || value, editorDataText);
  }
  
  // 生成 AI 提示词（包含选中文本）
  return generatePrompt(userQuestion, contextInfo, referencedPaths, editorDataText);
}

// 根据路径查找节点信息
function findNodeByPath(treeList, pathParts) {
  if (!Array.isArray(treeList) || pathParts.length === 0) {
    return null;
  }
  
  // 查找根节点
  let currentNode = treeList.find(node => node.title === pathParts[0]);
  if (!currentNode) {
    return null;
  }
  
  // 遍历路径的其余部分
  for (let i = 1; i < pathParts.length; i++) {
    if (!currentNode.children || currentNode.children.length === 0) {
      break;
    }
    
    const childNode = currentNode.children.find(child => child.title === pathParts[i]);
    if (childNode) {
      currentNode = childNode;
    } else {
      break;
    }
  }
  
  return {
    node: currentNode,
    path: pathParts,
    fullPath: pathParts.join('/')
  };
}

// 生成思维导图的 Markdown 结构
function generateMindMapMarkdown(nodeInfo, level = 1) {
  if (!nodeInfo || !nodeInfo.node) {
    return '';
  }
  
  const { node } = nodeInfo;
  const prefix = '#'.repeat(level);
  let markdown = `${prefix} ${node.title}\n`;
  
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      if (level === 1) {
        markdown += `## ${child.title}\n`;
        if (child.children && child.children.length > 0) {
          child.children.forEach(grandChild => {
            markdown += `- ${grandChild.title}\n`;
          });
        }
      } else {
        markdown += `- ${child.title}\n`;
      }
    });
  }
  
  return markdown;
}

// 生成基础提示词（没有思维导图上下文时）
function generateBasicPrompt(userQuestion, editorDataText = '') {
  if (!userQuestion || userQuestion.trim() === '') {
    userQuestion = '请提供详细的分析和建议';
  }
  
  // 处理选中的编辑器文本
  const hasSelectedText = editorDataText && editorDataText.trim().length > 0;
  let selectedTextSection = '';
  
  if (hasSelectedText) {
    selectedTextSection = `
## 选中的文本内容：
\`\`\`
${editorDataText.trim()}
\`\`\`

`;
  }
  
  return `${userQuestion}${selectedTextSection}
${hasSelectedText ? '我看到你选中了一些文本，我会结合这部分内容来回答你的问题。' : ''}

请用自然、易懂的方式回答，就像与正常人聊天一样。回答时：
- 用 Markdown 格式组织内容，让阅读更清晰
- 可以分点说明，但要保持轻松的语调
- 给出实用的建议和解决方案${hasSelectedText ? '\n- 结合选中的文本内容进行分析' : ''}
- 适当补充相关知识，但不要太学术化

开始回答吧：`;
}

// 生成完整的 AI 提示词
function generatePrompt(userQuestion, contextInfo, referencedPaths, editorDataText = '') {
  const pathsText = referencedPaths.join(', ');
  
  let contextMarkdown = '';
  let hasValidContext = false;
  
  if (contextInfo && contextInfo.length > 0) {
    contextInfo.forEach(info => {
      const markdown = generateMindMapMarkdown(info);
      if (markdown.trim()) {
        contextMarkdown += markdown + '\n';
        hasValidContext = true;
      }
    });
  }
  
  // 如果没有有效的上下文信息，提供替代说明
  if (!hasValidContext) {
    contextMarkdown = `**注意**: 引用的思维导图路径 "${pathsText}" 暂时无法获取具体内容，请基于路径名称和常识进行分析。\n\n`;
  }
  
  // 处理选中的编辑器文本
  const hasSelectedText = editorDataText && editorDataText.trim().length > 0;
  let selectedTextSection = '';
  
  if (hasSelectedText) {
    selectedTextSection = `
## 选中的文本内容：
\`\`\`
${editorDataText.trim()}
\`\`\`

`;
  }
  
  return `根据 @${pathsText} 的内容，${userQuestion}${selectedTextSection}
---

## 相关思维导图信息：
${contextMarkdown}
${hasSelectedText ? '我注意到你还选中了一些文本，我会把这部分内容和思维导图信息结合起来回答。' : ''}

请用轻松自然的语调回答，就像在和朋友讨论这个话题：
- 充分利用思维导图中的信息，把相关的点串联起来
- 用 Markdown 格式让内容更好阅读${hasSelectedText ? '\n- 把选中的文本和思维导图内容联系起来分析' : ''}
- 给出实用的建议，最好有具体的例子
- 可以适当延伸相关知识，但保持通俗易懂
- 如果思维导图信息不够，可以根据路径名称合理推测
- 主动想想用户可能还关心什么，一起回答了

开始聊吧：`;
}