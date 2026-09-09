'use client';

import React from 'react';

const floatAnimation = `
  @keyframes welcomeFloat {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
    100% { transform: translateY(0px); }
  }
  .welcome-animate-float {
    animation: welcomeFloat 3s ease-in-out infinite;
  }
`;

interface WelcomeScreenProps {
  onUploadClick: () => void;
  onCreateBlankClick: () => void;
  onGalleryClick: () => void;
  onImportCodeClick: () => void;
  isMounted: boolean;
}

const beadColors = [
  'bg-red-400', 'bg-blue-400', 'bg-yellow-400', 'bg-green-400',
  'bg-purple-400', 'bg-pink-400', 'bg-orange-400', 'bg-teal-400',
  'bg-indigo-400', 'bg-cyan-400', 'bg-lime-400', 'bg-amber-400',
  'bg-rose-400', 'bg-sky-400', 'bg-emerald-400', 'bg-violet-400',
];

export default function WelcomeScreen({
  onUploadClick,
  onCreateBlankClick,
  onGalleryClick,
  onImportCodeClick,
  isMounted,
}: WelcomeScreenProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: floatAnimation }} />
      <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-4 py-10">
        {/* Logo */}
        <div className="welcome-animate-float mb-6">
          <div className="grid grid-cols-4 gap-2 p-4 bg-white/95 dark:bg-gray-800/95 rounded-3xl shadow-2xl border-4 border-gray-100 dark:border-gray-700">
            {beadColors.map((color, i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded-full ${color} shadow-lg`}
                style={{ animation: `welcomeFloat ${2 + (i % 3)}s ease-in-out infinite ${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-400 tracking-widest text-center">
          拼豆底稿生成器
          <span className="text-sm font-normal text-gray-400 dark:text-gray-500 tracking-widest ml-1 align-middle">2.0</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base font-light text-gray-500 dark:text-gray-400 text-center tracking-[0.15em]">
          让像素创意属于每一个人
        </p>

        {/* Entry buttons */}
        <div className="mt-10 w-full max-w-sm flex flex-col gap-3">
          <button
            type="button"
            onClick={onUploadClick}
            disabled={!isMounted}
            className={`w-full py-3.5 px-6 rounded-2xl font-medium text-white bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 ${!isMounted ? 'opacity-60 cursor-wait' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            上传图片 / 导入底稿
          </button>

          <button
            type="button"
            onClick={onCreateBlankClick}
            className="w-full py-3 px-6 rounded-2xl font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            空白画布创建
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onGalleryClick}
              className="flex-1 py-3 px-4 rounded-2xl text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              社区画廊
            </button>
            <button
              type="button"
              onClick={onImportCodeClick}
              className="flex-1 py-3 px-4 rounded-2xl text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              分享码导入
            </button>
          </div>
        </div>

        <p className="mt-8 text-xs text-gray-400 dark:text-gray-500 text-center max-w-xs">
          所有图像处理均在你的浏览器本地完成，不会上传到服务器
        </p>
      </div>
    </>
  );
}
