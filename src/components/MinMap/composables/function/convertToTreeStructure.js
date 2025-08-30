import { htmlToText } from 'html-to-text'
 

function convertToTreeStructure(data) { 
  // 提取纯文本内容的辅助函数
  const extractText = (html) => {
     const plainText = htmlToText(html, {
       wordwrap: false, // 禁用自动换行
       preserveNewlines: false // 不保留换行符
     })

    
    return plainText
  };

  // 递归转换节点
  const convertNode = (node, path) => {
    const text = extractText(node.data.text);
    const title = text.trim() || 'Untitled';
    
    const converted = {
      title: title,
      key: path, // 使用路径作为 key
    };

    // 递归处理子节点
    if (node.children && node.children.length > 0) {
      converted.children = node.children.map((child, idx) => {
        const childPath = child.data.uid; 
        return convertNode(child, childPath);
      });
    }

    return converted;
  };

  // 处理根节点
  return [convertNode(data,data.data.uid)];
}


 export default convertToTreeStructure