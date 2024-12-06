// Markdown 工具函数
function stripMarkdown(text) {
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

function convertToHtml(text) {
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

// 监听 DOM 变化，为每个 AI 回复添加复制按钮
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // 查找所有操作按钮组
        const actionGroups = document.querySelectorAll('div.mb-2.flex.gap-3 .items-center.justify-start.rounded-xl.p-1.flex');
        console.log('找到按钮组数量:', actionGroups.length);
        actionGroups.forEach(addCleanCopyButton);
      }
    });
  });
});

// 添加 Clean Copy 按钮
function addCleanCopyButton(actionGroup) {
  // 检查是否已经添加过按钮
  if (actionGroup.querySelector('.clean-copy-button')) {
    console.log('按钮已存在，跳过');
    return;
  }

  // 查找原始复制按钮
  const originalCopyButton = actionGroup.querySelector('[data-testid="copy-turn-action-button"]');
  if (!originalCopyButton) {
    console.log('未找到原始复制按钮，跳过');
    return;
  }

  console.log('找到原始复制按钮，准备添加 Clean Copy 按钮');

  // 创建新的按钮
  const button = document.createElement('button');
  button.className = 'clean-copy-button rounded-lg text-token-text-secondary hover:bg-token-main-surface-secondary';
  button.setAttribute('aria-label', 'Clean Copy');
  
  // 创建按钮内容
  const buttonContent = document.createElement('span');
  buttonContent.className = 'flex h-[30px] w-[30px] items-center justify-center';
  
  // 使用类似的图标样式
  buttonContent.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md-heavy">
      <rect width="24" height="24" rx="12" fill="#10B981" fill-opacity="0.1"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M7 5C7 3.34315 8.34315 2 10 2H19C20.6569 2 22 3.34315 22 5V14C22 15.6569 20.6569 17 19 17H17V19C17 20.6569 15.6569 22 14 22H5C3.34315 22 2 20.6569 2 19V10C2 8.34315 3.34315 7 5 7H7V5ZM9 7H14C15.6569 7 17 8.34315 17 10V15H19C19.5523 15 20 14.5523 20 14V5C20 4.44772 19.5523 4 19 4H10C9.44772 4 9 4.44772 9 5V7ZM5 9C4.44772 9 4 9.44772 4 10V19C4 19.5523 4.44772 20 5 20H14C14.5523 20 15 19.5523 15 19V10C15 9.44772 14.5523 9 14 9H5Z" fill="#10B981"/>
    </svg>
  `;

  button.appendChild(buttonContent);

  // 添加点击事件
  button.addEventListener('click', () => {
    console.log('按钮被点击');
    // 首先尝试获取最近的消息容器
    const messageElement = actionGroup.closest('[data-message-author-role="assistant"]')
      ?.querySelector('.markdown.prose.w-full');
    
    if (messageElement) {
      console.log('找到消息元素:', messageElement);
      console.log('消息内容:', messageElement.innerText);
      handleCopy(messageElement);
    } else {
      console.error('未找到消息元素');
      console.log('当前按钮的父元素结构:', actionGroup.parentElement);
    }
  });

  // 将按钮插入到原始复制按钮后面
  originalCopyButton.parentNode.insertBefore(button, originalCopyButton.nextSibling);
}

// 处理复制操作
async function handleCopy(messageElement) {
  try {
    console.log('开始复制操作');
    const markdownText = messageElement.innerText;
    console.log('获取到的文本:', markdownText);
    
    // 检查文本是否为空
    if (!markdownText) {
      console.error('获取到的文本为空');
      return;
    }

    // 创建包含两种格式的 ClipboardItem
    const clipboardItem = new ClipboardItem({
      'text/plain': new Blob([stripMarkdown(markdownText)], { type: 'text/plain' }),
      'text/html': new Blob([convertToHtml(markdownText)], { type: 'text/html' })
    });

    console.log('准备写入剪贴板');
    await navigator.clipboard.write([clipboardItem]);
    
    // 显示复制成功提示
    showCopySuccess();
  } catch (error) {
    console.error('复制失败，详细错误:', error);
    console.error('错误堆栈:', error.stack);
    // 显示错误提示
    showCopyError();
  }
}

// 显示复制成功提示
function showCopySuccess() {
  const toast = document.createElement('div');
  toast.className = 'copy-success-toast';
  toast.textContent = '复制成功';
  document.body.appendChild(toast);
  
  // 2秒后移��提示
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 2000);
}

// 显示复制错误提示
function showCopyError() {
  const toast = document.createElement('div');
  toast.className = 'copy-error-toast';
  toast.textContent = '复制失败';
  document.body.appendChild(toast);
  
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 2000);
}

// 开始观察 DOM 变化
observer.observe(document.body, {
  childList: true,
  subtree: true
}); 