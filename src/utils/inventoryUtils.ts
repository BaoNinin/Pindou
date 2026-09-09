// 豆库/库存管理工具函数
// 存储结构：{ [hex大写]: 库存数量 }，与项目里其他色板数据一致，全部以 hex 作为 key

const STORAGE_KEY = 'perlerBeadInventory';

export interface BeadInventory {
  [hexValue: string]: number;
}

/**
 * 从 localStorage 加载库存数据
 */
export function loadInventory(): BeadInventory {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('无法从本地存储加载豆库库存:', error);
    localStorage.removeItem(STORAGE_KEY);
  }
  return {};
}

/**
 * 保存库存数据到 localStorage
 */
export function saveInventory(inventory: BeadInventory): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  } catch (error) {
    console.error('无法保存豆库库存到本地存储:', error);
  }
}

/**
 * 获取某个颜色的库存数量，未设置过则视为 0
 */
export function getStock(inventory: BeadInventory, hex: string): number {
  return inventory[hex.toUpperCase()] ?? 0;
}

/**
 * 设置某个颜色的库存数量（不可为负数）
 */
export function setStock(inventory: BeadInventory, hex: string, quantity: number): BeadInventory {
  return { ...inventory, [hex.toUpperCase()]: Math.max(0, Math.floor(quantity) || 0) };
}

export interface PrecheckDetail {
  hex: string;
  needed: number;
  stock: number;
  shortage: number;
}

export interface PrecheckResult {
  totalNeeded: number;   // 本作品共需颗数
  colorsNeeded: number;  // 涉及颜色种数
  colorsShort: number;   // 库存不足的颜色种数
  totalShortage: number; // 共缺颗数
  details: PrecheckDetail[];
}

/**
 * 库存预检：对比当前作品所需颜色/数量与库存，得出缺口
 */
export function precheckInventory(
  colorCounts: { [hex: string]: { count: number; color: string } } | null,
  inventory: BeadInventory
): PrecheckResult {
  const entries = colorCounts ? Object.entries(colorCounts) : [];

  const details: PrecheckDetail[] = entries.map(([hex, { count }]) => {
    const stock = getStock(inventory, hex);
    return {
      hex,
      needed: count,
      stock,
      shortage: Math.max(0, count - stock),
    };
  });

  const shortDetails = details.filter(d => d.shortage > 0);

  return {
    totalNeeded: details.reduce((sum, d) => sum + d.needed, 0),
    colorsNeeded: details.length,
    colorsShort: shortDetails.length,
    totalShortage: shortDetails.reduce((sum, d) => sum + d.shortage, 0),
    details,
  };
}

/**
 * 按当前作品用量扣减库存（库存不会扣成负数，缺口部分只是不再继续扣）
 */
export function deductInventory(
  inventory: BeadInventory,
  colorCounts: { [hex: string]: { count: number; color: string } } | null
): BeadInventory {
  if (!colorCounts) return inventory;
  const next = { ...inventory };
  Object.entries(colorCounts).forEach(([hex, { count }]) => {
    const key = hex.toUpperCase();
    const current = next[key] ?? 0;
    next[key] = Math.max(0, current - count);
  });
  return next;
}
