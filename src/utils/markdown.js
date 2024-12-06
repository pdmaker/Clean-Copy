// 移除 Markdown 标记，返回纯文本
export function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // 移除加粗
    .replace(/\*(.*?)\*/g, '$1')     // 移除斜体
    .replace(/`(.*?)`/g, '$1')       // 移除行内代码
    .replace(/^#+\s+/gm, '')         // 移除标题标记
    .replace(/^[*-]\s+/gm, '')       // 移除无序列表标记
    .replace(/^\d+\.\s+/gm, '')      // 移除有序列表标记
    .replace(/^\>\s+/gm, '')         // 移除引用标记
    .trim();
}

// 将 Markdown 转换为 HTML
export function convertToHtml(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^#{6}\s+(.*?)$/gm, '<h6>$1</h6>')
    .replace(/^#{5}\s+(.*?)$/gm, '<h5>$1</h5>')
    .replace(/^#{4}\s+(.*?)$/gm, '<h4>$1</h4>')
    .replace(/^#{3}\s+(.*?)$/gm, '<h3>$1</h3>')
    .replace(/^#{2}\s+(.*?)$/gm, '<h2>$1</h2>')
    .replace(/^#{1}\s+(.*?)$/gm, '<h1>$1</h1>')
    .replace(/^[*-]\s+(.*?)$/gm, '<li>$1</li>')
    .replace(/^\d+\.\s+(.*?)$/gm, '<li>$1</li>')
    .replace(/^\>\s+(.*?)$/gm, '<blockquote>$1</blockquote>')
    .split('\n').join('<br>');
} 