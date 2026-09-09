'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PaletteColor } from '../utils/pixelation';
import { ColorSystem, getColorKeyByHex } from '../utils/colorSystemUtils';
import { BeadInventory, loadInventory, saveInventory, setStock } from '../utils/inventoryUtils';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  // 优先展示当前作品实际用到的颜色；没有作品数据时回退展示整套色板
  colorCounts: { [hex: string]: { count: number; color: string } } | null;
  activeBeadPalette: PaletteColor[];
  selectedColorSystem: ColorSystem;
  onInventoryChange?: (inventory: BeadInventory) => void;
}

const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  colorCounts,
  activeBeadPalette,
  selectedColorSystem,
  onInventoryChange,
}) => {
  const [inventory, setInventory] = useState<BeadInventory>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInventory(loadInventory());
      setSearchTerm('');
    }
  }, [isOpen]);

  const colorList = useMemo(() => {
    if (colorCounts && Object.keys(colorCounts).length > 0) {
      return Object.entries(colorCounts)
        .map(([hex, { count }]) => ({ hex, needed: count }))
        .sort((a, b) => b.needed - a.needed);
    }
    return activeBeadPalette.map(c => ({ hex: c.hex, needed: 0 }));
  }, [colorCounts, activeBeadPalette]);

  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return colorList;
    const term = searchTerm.trim().toUpperCase();
    return colorList.filter(({ hex }) => {
      const code = getColorKeyByHex(hex, selectedColorSystem).toUpperCase();
      return code.includes(term) || hex.toUpperCase().includes(term);
    });
  }, [colorList, searchTerm, selectedColorSystem]);

  if (!isOpen) return null;

  const handleStockChange = (hex: string, value: string) => {
    const num = value === '' ? 0 : parseInt(value, 10);
    if (Number.isNaN(num)) return;
    setInventory(prev => setStock(prev, hex, num));
  };

  const handleSave = () => {
    saveInventory(inventory);
    onInventoryChange?.(inventory);
    onClose();
  };

  const handleClearAll = () => {
    const confirmed = window.confirm('确定要清空所有豆库库存记录吗？此操作不可撤销。');
    if (!confirmed) return;
    setInventory({});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col">
        {/* 标题 */}
        <div className="p-5 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              豆库 / 库存管理
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {colorCounts && Object.keys(colorCounts).length > 0
              ? '记录你手头每种颜色现有的豆子数量，下载/开始制作前会自动核对库存是否够用。'
              : '当前没有作品数据，下面展示的是完整色板，你也可以提前登记库存。'}
          </p>
        </div>

        {/* 搜索 */}
        <div className="px-5 pt-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索色号..."
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* 颜色列表 */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-1.5">
          {filteredList.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">没有匹配的颜色</p>
          )}
          {filteredList.map(({ hex, needed }) => {
            const code = getColorKeyByHex(hex, selectedColorSystem);
            const stock = inventory[hex.toUpperCase()] ?? 0;
            const isShort = needed > 0 && stock < needed;
            return (
              <div
                key={hex}
                className={`flex items-center gap-3 p-2 rounded-lg ${isShort ? 'bg-red-50 dark:bg-red-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
              >
                <div
                  className="w-6 h-6 rounded-md border border-gray-200 dark:border-gray-600 flex-shrink-0"
                  style={{ backgroundColor: hex }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{code}</p>
                  {needed > 0 && (
                    <p className={`text-xs ${isShort ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
                      本作品需要 {needed} 颗
                    </p>
                  )}
                </div>
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => handleStockChange(hex, e.target.value)}
                  className="w-20 px-2 py-1.5 text-sm text-right border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            );
          })}
        </div>

        {/* 操作按钮 */}
        <div className="p-5 pt-3 border-t border-gray-100 dark:border-gray-700 flex gap-2">
          <button
            onClick={handleClearAll}
            className="px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            清空库存
          </button>
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-medium transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
