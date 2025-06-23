// Инициализация VK Bridge
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, запущено ли приложение в VK
    if (typeof vkBridge !== 'undefined') {
        vkBridge.send('VKWebAppInit');
        
        // Подписка на события
        vkBridge.subscribe((e) => {
            if (e.detail.type === 'VKWebAppUpdateConfig') {
                const scheme = e.detail.data.scheme ? e.detail.data.scheme : 'client_light';
                document.body.setAttribute('scheme', scheme);
            }
        });
        
        // Запрашиваем данные пользователя (опционально)
        vkBridge.send('VKWebAppGetUserInfo')
            .then(data => {
                console.log('User info:', data);
            })
            .catch(error => {
                console.error('Failed to get user info:', error);
            });
    }
});