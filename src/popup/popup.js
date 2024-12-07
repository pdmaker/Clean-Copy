document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('togglePlugin');

    // 从 storage 中读取插件状态
    chrome.storage.sync.get(['enabled'], function(result) {
        toggleSwitch.checked = result.enabled !== false; // 默认为开启状态
    });

    // 监听开关变化
    toggleSwitch.addEventListener('change', function() {
        const enabled = toggleSwitch.checked;
        
        // 保存状态到 storage
        chrome.storage.sync.set({ enabled: enabled }, function() {
            // 向 content script 发送状态更新消息
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: 'TOGGLE_PLUGIN',
                    enabled: enabled
                });
            });
        });
    });
}); 