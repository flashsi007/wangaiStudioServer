import { unified } from 'unified';
import remarkParse from 'remark-parse';

/**
 * 生成唯一ID
 * @returns {string} 唯一ID
 */
function generateUid() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

/**
 * 根据节点类型和层级生成带样式的HTML文本
 * @param {string} text - 原始文本
 * @param {number} level - 层级
 * @param {string} type - 节点类型 (heading, listItem, paragraph)
 * @returns {string} 带样式的HTML文本
 */
function generateStyledText(text, level, type) {
    const baseStyle = 'font-family: "PingFang SC", "Microsoft YaHei", sans-serif;';
    
    switch (type) {
        case 'heading':
            const headingSize = Math.max(16 - level, 12); // 根据标题级别调整字体大小
            const headingColor = level === 1 ? '#1a1a1a' : level === 2 ? '#333333' : '#555555';
            // return `<p style="${baseStyle} font-size: ${headingSize}px; font-weight: bold; color: ${headingColor}; margin: 0; padding: 2px 4px;">${text}</p>`;
             return text
        case 'listItem':
            // return `<p style="${baseStyle} font-size: 14px; color: #666666; margin: 0; padding: 2px 4px;">${text}</p>`;
             return text
            
        case 'paragraph':
        default:
            // return `<p style="${baseStyle} font-size: 13px; color: #777777; margin: 0; padding: 2px 4px;">${text}</p>`;
             return text
    }
}

/**
 * 从mdast节点中提取纯文本
 * @param {object} node - mdast节点
 * @returns {string} 纯文本
 */
function extractText(node) {
    if (node.type === 'text') {
        return node.value;
    }
    if (node.children) {
        return node.children.map(extractText).join('');
    }
    return '';
}

/**
 * 将mdast节点转换为扁平的节点数组
 * @param {object} mdastNode - mdast节点
 * @param {array} result - 结果数组
 * @returns {void}
 */
function flattenMdastNodes(mdastNode, result = []) {
    if (!mdastNode) return;
    
    const { type, children } = mdastNode;
    
    switch (type) {
        case 'heading':
            const headingText = extractText(mdastNode);
            if (headingText.trim()) {
                result.push({
                    type: 'heading',
                    text: headingText.trim(),
                    level: mdastNode.depth,
                    data: {
                        text: generateStyledText(headingText.trim(), mdastNode.depth, 'heading'),
                        uid: generateUid(),
                        expand: true,
                        richText: true,
                        isActive: false
                    },
                    children: []
                });
            }
            break;
            
        case 'listItem':
            const listText = extractText(mdastNode);
            if (listText.trim()) {
                result.push({
                    type: 'listItem',
                    text: listText.trim(),
                    level: 0, // 将在后续处理中确定
                    data: {
                        text: generateStyledText(listText.trim(), 0, 'listItem'),
                        uid: generateUid(),
                        expand: true,
                        richText: true,
                        isActive: false
                    },
                    children: []
                });
            }
            break;
            
        case 'paragraph':
            const paraText = extractText(mdastNode);
            if (paraText.trim()) {
                result.push({
                    type: 'paragraph',
                    text: paraText.trim(),
                    level: 0, // 将在后续处理中确定
                    data: {
                        text: generateStyledText(paraText.trim(), 0, 'paragraph'),
                        uid: generateUid(),
                        expand: true,
                        richText: true,
                        isActive: false
                    },
                    children: []
                });
            }
            break;
            
        case 'list':
        case 'root':
        default:
            // 递归处理子节点
            if (children && children.length > 0) {
                children.forEach(child => flattenMdastNodes(child, result));
            }
            break;
    }
}

/**
 * 构建层级树结构
 * @param {array} nodes - 扁平的节点数组
 * @returns {object} 根节点
 */
function buildHierarchy(nodes) {
    if (!nodes || nodes.length === 0) return null;
    
    // 找到第一个标题作为根节点
    let rootIndex = -1;
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].type === 'heading' && nodes[i].level === 1) {
            rootIndex = i;
            break;
        }
    }
    
    let root;
    let startIndex = 0;
    
    if (rootIndex >= 0) {
        root = {
            data: nodes[rootIndex].data,
            children: []
        };
        startIndex = rootIndex + 1;
    } else {
        // 如果没有一级标题，创建一个根节点
        root = {
            data: {
                text: generateStyledText('思维导图', 0, 'heading'),
                uid: generateUid(),
                expand: true,
                richText: true,
                isActive: false
            },
            children: []
        };
    }
    
    const stack = [{ level: 0, node: root }];
    let lastHeadingLevel = 0;
    
    for (let i = startIndex; i < nodes.length; i++) {
        const nodeData = nodes[i];
        if (!nodeData) continue;
        
        let level = 1;
        
        if (nodeData.type === 'heading') {
            level = nodeData.level;
            lastHeadingLevel = level;
        } else if (nodeData.type === 'listItem') {
            level = lastHeadingLevel + 1;
        } else {
            level = lastHeadingLevel + 1;
        }
        
        // 调整栈，找到正确的父节点
        while (stack.length > 1 && level <= stack[stack.length - 1].level) {
            stack.pop();
        }
        
        const treeNode = {
            data: nodeData.data,
            children: []
        };
        
        // 添加到父节点
        stack[stack.length - 1].node.children.push(treeNode);
        stack.push({ level, node: treeNode });
    }
    
    return root;
}

/**
 * 使用remark将Markdown文本转换为 treeData 结构
 * @param {string} AiAnswer - 包含Markdown格式内容的字符串
 * @returns {object} - 转换后的treeData结构
 */
export default function generateTreeWithRemark(AiAnswer) {
    if (!AiAnswer || typeof AiAnswer !== 'string') {
        return null;
    }
    
    try {
        // 使用remark解析Markdown
        const processor = unified().use(remarkParse);
        const mdast = processor.parse(AiAnswer);
        
        // 将mdast转换为扁平的节点数组
        const nodes = [];
        flattenMdastNodes(mdast, nodes);
        
        // 构建层级结构
        return buildHierarchy(nodes);
        
    } catch (error) {
        console.error('Error parsing markdown with remark:', error);
        return null;
    }
}