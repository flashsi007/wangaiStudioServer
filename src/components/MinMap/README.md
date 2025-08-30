# Markdown 转 TreeData 实现方案

本目录包含两种将 Markdown 文本转换为 TreeData 结构的实现方案：

## 方案一：手动解析实现 (generateTree.js)

### 特点
- **纯手工实现**：不依赖第三方库，代码完全自主可控
- **轻量级**：文件大小小，无额外依赖
- **定制化**：可以根据具体需求灵活调整解析逻辑
- **简单场景适用**：适合处理结构相对简单的 Markdown 文档

### 局限性
- 解析能力有限，可能无法处理复杂的 Markdown 语法
- 需要手动维护解析逻辑，容易出现边界情况
- 对于复杂嵌套结构的处理可能不够准确

### 使用方法
```javascript
import generateTree from './generateTree.js';

const markdown = `# 标题\n- 列表项`;
const treeData = generateTree(markdown);
```

## 方案二：基于 Remark 的实现 (generateTreeWithRemark.js) **推荐**

### 特点
- **专业解析**：基于 remark 生态系统，支持完整的 CommonMark 标准
- **准确性高**：能够正确处理各种复杂的 Markdown 语法结构
- **可扩展性强**：可以通过 remark 插件支持更多 Markdown 扩展语法
- **维护性好**：依赖成熟的开源项目，bug 修复和功能更新有保障

### 依赖
- `unified`: 统一的文本处理框架
- `remark-parse`: Markdown 解析器
- `remark-stringify`: Markdown 序列化器

### 使用方法
```javascript
import generateTreeWithRemark from './generateTreeWithRemark.js';

const markdown = `# 标题\n- 列表项`;
const treeData = generateTreeWithRemark(markdown);
```

## 输出格式

两种方案都会生成相同格式的 TreeData 结构：

```javascript
{
  data: {
    text: "<p style=\"...\">节点文本</p>",  // 带样式的 HTML 文本
    uid: "unique_id",                      // 唯一标识符
    expand: true,                          // 是否展开
    richText: true,                        // 是否为富文本
    isActive: false                        // 是否激活
  },
  children: [...]                          // 子节点数组
}
```

## 推荐使用

**建议使用方案二 (generateTreeWithRemark.js)**，原因：

1. **更准确的解析**：能够正确处理各种 Markdown 语法
2. **更好的层级结构**：正确识别标题层级和列表嵌套
3. **更强的扩展性**：可以轻松添加对新语法的支持
4. **更少的维护成本**：依赖成熟的开源项目

方案一可以作为备选方案，适用于对依赖有严格限制或需要极致轻量化的场景。

## 安装依赖

如果选择使用方案二，需要安装相关依赖：

```bash
pnpm add remark-parse remark-stringify unified
```

## 测试

两种方案都已经过测试，能够正确处理包含标题、列表、段落等元素的 Markdown 文档，并生成符合要求的 TreeData 结构。