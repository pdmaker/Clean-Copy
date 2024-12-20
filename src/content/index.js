// 调试工具
const DEBUG = false;

// 在文件开头添加
let pluginEnabled = true;

function log(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

// Markdown 工具函数
function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, '$1')  // 移除代码块
    .replace(/\*\*(.*?)\*\*/g, '$1')   // 移除加粗
    .replace(/\*(.*?)\*/g, '$1')       // 移除斜体
    .replace(/`([^`]+)`/g, '$1')       // 移除行内代码
    .replace(/^#+\s+/gm, '')           // 移除标题标记
    .replace(/^[-*]\s+/gm, '')         // 移除无序列表标记
    .replace(/^\d+\.\s+/gm, '')        // 移除有序列表标记
    .replace(/^>\s+/gm, '')            // 移除引用标记
    .trim();
}

function convertToHtml(text) {
  // 首先处理代码块，避免内部内容被其他规则影响
  text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  return text
    // 内联格式
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // 标题
    .replace(/^#{6}\s+(.*?)$/gm, '<h6>$1</h6>')
    .replace(/^#{5}\s+(.*?)$/gm, '<h5>$1</h5>')
    .replace(/^#{4}\s+(.*?)$/gm, '<h4>$1</h4>')
    .replace(/^#{3}\s+(.*?)$/gm, '<h3>$1</h3>')
    .replace(/^#{2}\s+(.*?)$/gm, '<h2>$1</h2>')
    .replace(/^#{1}\s+(.*?)$/gm, '<h1>$1</h1>')
    
    // 列表
    .replace(/^(\d+)\.\s+(.*?)$/gm, '<li>$2</li>')
    .replace(/^[-*]\s+(.*?)$/gm, '<li>$1</li>')
    
    // 引用
    .replace(/^>\s+(.*?)$/gm, '<blockquote>$1</blockquote>')
    
    // 处理换行
    .split('\n').join('<br>');
}

// 监听 DOM 变化，为每个 AI 回复添加复制按钮
const observer = new MutationObserver((mutations) => {
  // 使用防抖，避免频繁处理
  clearTimeout(observer.timeout);
  observer.timeout = setTimeout(() => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // 查找所有操作按钮组
          const actionGroups = document.querySelectorAll('div.mb-2.flex.gap-3 .items-center.justify-start.rounded-xl.p-1.flex');
          actionGroups.forEach(addCleanCopyButton);
        }
      });
    });
  }, 100);
});

// 检测页面语言
function isChinesePage() {
  return document.documentElement.lang.includes('zh') || 
         document.querySelector('html').getAttribute('lang')?.includes('zh') ||
         document.location.href.includes('/zh') ||
         document.location.hostname.includes('.cn');
}

// 添加 Clean Copy 按钮
function addCleanCopyButton(actionGroup) {
  // 检查是否已经添加过按钮
  if (actionGroup.querySelector('.clean-copy-button')) {
    return;
  }

  // 创建的按钮
  const button = document.createElement('button');
  button.className = 'clean-copy-button rounded-lg text-token-text-secondary hover:bg-token-main-surface-secondary';
  button.setAttribute('aria-label', isChinesePage() ? '简净复制' : 'Clean Copy');
  button.setAttribute('data-tooltip', isChinesePage() ? '简净复制' : 'Clean Copy');

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
    log('按钮被点击');
    const article = actionGroup.closest('article');
    if (!article) {
      console.error('未找到消息容器');
      return;
    }
    
    const messageElement = article.querySelector('.markdown.prose.w-full.break-words.dark\\:prose-invert');
    
    if (messageElement) {
      log('找到消息元素:', messageElement);
      handleCopy(messageElement);
    } else {
      console.error('未找到消息元素');
      log('article 内容:', article.innerHTML);
      log('可用的类名:', article.querySelector('.markdown')?.classList.toString());
    }
  });

  // 将按钮添加到操作栏的最后
  actionGroup.appendChild(button);
}

// 处理复制操作
async function handleCopy(messageElement) {
  try {
    log('开始复制操作');
    
    // 获取原始文本
    const originalText = messageElement.innerText;
    log('获取到的文本:', originalText);
    
    // 检查文本是否为空
    if (!originalText) {
      log('获取到的文本为空');
      return;
    }

    // 添加复制中的视觉反馈
    messageElement.style.transition = 'opacity 0.2s';
    messageElement.style.opacity = '0.5';

    // 为富文本环境准备 HTML
    const htmlContent = `
      <meta charset="utf-8">
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        ${messageElement.innerHTML}
      </div>
    `.trim();

    // 为纯文本环境准备纯文本
    const plainText = stripMarkdown(originalText);

    // 创建包含两种格式的 ClipboardItem
    const clipboardItem = new ClipboardItem({
      'text/plain': new Blob([plainText], { type: 'text/plain' }),
      'text/html': new Blob([htmlContent], { type: 'text/html' })
    });

    log('准备写入剪贴板');
    await navigator.clipboard.write([clipboardItem]);
    
    // 显示复制成功提示
    showCopySuccess();
  } catch (error) {
    console.error('复制失败，详细错误:', error);
    showCopyError();
  } finally {
    // 恢复原始样式
    messageElement.style.opacity = '1';
  }
}

// 显示复制成功提示
function showCopySuccess() {
  const toast = document.createElement('div');
  toast.className = 'copy-success-toast';
  toast.style.cssText = 'background-color: rgb(0, 0, 0) !important;'; // 强制使用黑色背景
  
  // 创建图标元素
  const icon = document.createElement('span');
  icon.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  
  // 创建文本元素
  const text = document.createElement('span');
  text.textContent = isChinesePage() ? '复制成功' : 'Copied successfully';
  
  toast.appendChild(icon);
  toast.appendChild(text);
  document.body.appendChild(toast);
  
  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  }, 2000);
}

// 显示复制错误提示
function showCopyError() {
  const toast = document.createElement('div');
  toast.className = 'copy-error-toast';
  toast.style.cssText = 'background-color: rgb(0, 0, 0) !important;'; // 强制使用黑色背景
  
  // 创建图标元素
  const icon = document.createElement('span');
  icon.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  
  // 创建文本元素
  const text = document.createElement('span');
  text.textContent = isChinesePage() ? '复制失败' : 'Copy failed';
  
  toast.appendChild(icon);
  toast.appendChild(text);
  document.body.appendChild(toast);
  
  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  }, 2000);
}

// 开始观察 DOM 变化
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'TOGGLE_PLUGIN') {
        pluginEnabled = request.enabled;
        // 根据状态显示或隐藏所有复制按钮
        toggleCopyButtons(pluginEnabled);
    }
});

// 添加一个新函数来控制按钮的显示/隐藏
function toggleCopyButtons(show) {
    const buttons = document.querySelectorAll('.clean-copy-button');
    buttons.forEach(button => {
        button.style.display = show ? 'block' : 'none';
    });
} 