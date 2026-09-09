'use client';

import React from 'react';
import { ColorSystem, getColorKeyByHex } from '../utils/colorSystemUtils';
import { PrecheckResult } from '../utils/inventoryUtils';

interface StockPrecheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  precheckResult: PrecheckResult;
  selectedColorSystem: ColorSystem;
  onConfirmDeduct: () => void; // 确认扣减库存并开始
  onProceedWithoutDeduct: () => void; // 不扣减直接开始
}

const StockPrecheckModal: React.FC<StockPrecheckModalProps> = ({
  isOpen,
  onClose,
  precheckResult,
  selectedColorSystem,
  onConfirmDeduct,
  onProceedWithoutDeduct,
}) => {
  if (!isOpen) return null;

  const { totalNeeded, colorsNeeded, colorsShort, totalShortage, details } = precheckResult;
  const shortDetails = details.filter(d => d.shortage > 0);
  const hasShortage = colorsShort > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
        {/* 标题 */}
        <div className="text-center flex-shrink-0">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${hasShortage ? 'bg-red-100 dark:bg-red-900/40' : 'bg-green-100 dark:bg-green-900/40'}`}>
            {hasShortage ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">库存预检</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            本作品共需 {totalNeeded} 颗豆豆，涉及 {colorsNeeded} 种颜色
            {hasShortage ? `，其中 ${colorsShort} 种不足（共缺 ${totalShortage} 颗）` : '，库存全部充足'}
          </p>
        </div>

        {/* 缺口详情 */}
        {hasShortage && (
          <div className="flex-1 overflow-y-auto min-h-0 -mx-1 px-1">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg divide-y divide-red-100 dark:divide-red-800/30">
              {shortDetails.map(({ hex, needed, stock, shortage }) => (
                <div key={hex} className="flex items-center gap-2.5 p-2.5 text-sm">
                  <div className="w-5 h-5 rounded border border-gray-200 dark:border-gray-600 flex-shrink-0" style={{ backgroundColor: hex }} />
                  <span className="font-medium text-gray-700 dark:text-gray-200 flex-shrink-0">
                    {getColorKeyByHex(hex, selectedColorSystem)}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 text-xs flex-1 text-right">
                    需 {needed} · 有 {stock} · 缺 <span className="text-red-500 font-medium">{shortage}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-col space-y-2 flex-shrink-0">
          <button
            onClick={onConfirmDeduct}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-medium transition-all duration-200"
          >
            确认扣减库存并开始
          </button>
          <button
            onClick={onProceedWithoutDeduct}
            className="w-full py-2.5 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all duration-200"
          >
            不扣减，直接开始
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockPrecheckModal;
