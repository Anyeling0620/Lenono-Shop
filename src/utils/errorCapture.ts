// 全局错误捕获
window.addEventListener('error', (e) => {
    console.error('[全局错误捕获]', e.error || e)
}, true)

window.addEventListener('unhandledrejection', (e) => {
    console.error('[全局Promise错误捕获]', e.reason);
    e.preventDefault();
});
console.warn('[全局错误捕获]已启动')
