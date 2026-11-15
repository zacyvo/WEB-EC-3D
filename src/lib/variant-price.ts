import type { Product, ProductVariantPrice } from '@/types';

/** Giá theo phân loại — mirrors backend products/product-variant-price.util.ts. A color/size
 * combination with its own entry in `product.variants` sells at that price; any other
 * combination sells at the product price. The server recomputes the price at checkout. */

function same(a?: string, b?: string): boolean {
  return (a?.trim() || null) === (b?.trim() || null);
}

export function findVariantPrice(product: Product, color?: string, size?: string): ProductVariantPrice | undefined {
  return (product.variants ?? []).find((v) => same(v.color, color) && same(v.size, size));
}

/** { sellingPrice, finalPrice } for the given selection (falls back to the product price). */
export function priceFor(product: Product, color?: string, size?: string): { sellingPrice: number; finalPrice: number } {
  const v = findVariantPrice(product, color, size);
  return v ? { sellingPrice: v.sellingPrice, finalPrice: v.finalPrice } : { sellingPrice: product.sellingPrice, finalPrice: product.finalPrice };
}

/** Lowest/highest finalPrice over every selectable combination. */
export function priceRange(product: Product): { min: number; max: number } {
  const variants = product.variants ?? [];
  if (variants.length === 0) return { min: product.finalPrice, max: product.finalPrice };
  const colors = (product.colors ?? []).map((c) => c.name);
  const sizes = product.sizes ?? [];
  const colorAxis: (string | undefined)[] = colors.length ? colors : [undefined];
  const sizeAxis: (string | undefined)[] = sizes.length ? sizes : [undefined];
  const prices = colorAxis.flatMap((c) => sizeAxis.map((s) => priceFor(product, c, s).finalPrice));
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
