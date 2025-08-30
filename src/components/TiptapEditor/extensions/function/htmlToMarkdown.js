import TurndownService from 'turndown';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// 移除潜在危险标签
turndown.remove(['script', 'style', 'noscript', 'iframe']);


 function stripCodeBlockDelimiters(str) {
  return str
    // 去掉 ```html 或 ``` 开头的标记
    .replace(/^```(?:html)?\n?/gm, '')
    // 去掉结尾的 ``` 标记
    .replace(/\n?```$/gm, '');
}

/**
 * 将 HTML 字符串安全地转为 Markdown
 * @param html 原始 HTML
 * @returns 对应的 Markdown 字符串
 */
export default function htmlToMarkdown(html) {
  if (typeof html !== 'string') return '';
 
  
  return turndown.turndown( stripCodeBlockDelimiters(html) );
}