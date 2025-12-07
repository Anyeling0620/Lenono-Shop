import React, { useState } from "react";

interface ShareButtonsProps {
  productName: string;
  productUrl: string;
  productImage: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  productName,
  productUrl,
  productImage
}) => {
  const [showShareOptions, setShowShareOptions] = useState(false);

  const shareText = `发现好物：${productName} - 联想商城`;
  const shareUrl = window.location.origin + productUrl;

  const shareToWeChat = () => {
    // 微信分享需要微信SDK，这里模拟二维码分享
    alert("请使用微信扫码分享：\n" + shareUrl);
  };

  const shareToWeibo = () => {
    const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}&pic=${encodeURIComponent(productImage)}`;
    window.open(weiboUrl, '_blank', 'width=600,height=400');
  };

  const shareToQQ = () => {
    const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}&pics=${encodeURIComponent(productImage)}`;
    window.open(qqUrl, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("链接已复制到剪贴板！");
    } catch {
      // 降级方案
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert("链接已复制到剪贴板！");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareOptions(!showShareOptions)}
        className="cursor-pointer hover:text-red-600 flex items-center"
      >
        <span className="mr-1">📤</span> 分享
      </button>

      {showShareOptions && (
        <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 min-w-[200px]">
          <div className="text-sm font-medium text-gray-700 mb-2">分享到</div>
          <div className="space-y-2">
            <button
              onClick={shareToWeChat}
              className="w-full flex items-center space-x-2 p-2 hover:bg-gray-50 rounded text-sm"
            >
              <span className="text-green-600">💚</span>
              <span>微信好友</span>
            </button>
            <button
              onClick={shareToWeibo}
              className="w-full flex items-center space-x-2 p-2 hover:bg-gray-50 rounded text-sm"
            >
              <span className="text-red-400">📘</span>
              <span>微博</span>
            </button>
            <button
              onClick={shareToQQ}
              className="w-full flex items-center space-x-2 p-2 hover:bg-gray-50 rounded text-sm"
            >
              <span className="text-blue-500">💬</span>
              <span>QQ好友</span>
            </button>
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center space-x-2 p-2 hover:bg-gray-50 rounded text-sm"
            >
              <span>🔗</span>
              <span>复制链接</span>
            </button>
          </div>
        </div>
      )}

      {/* 点击其他地方关闭分享选项 */}
      {showShareOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareOptions(false)}
        />
      )}
    </div>
  );
};

export default ShareButtons;