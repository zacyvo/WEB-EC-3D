'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Card, CardActionArea, CardMedia, CardContent, CardActions,
  Box, Typography, Chip, IconButton, alpha,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart.store';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  // Products with color/size options need the detail page to pick a variant first —
  // quick-add only applies when there's nothing to choose.
  const hasVariants = product.colors.length > 0 || product.sizes.length > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    if (hasVariants) return; // let the click fall through to the product page link
    e.preventDefault();
    if (product.stock === 0) return;
    addItem({
      productId: product._id,
      productName: product.name,
      productImage: product.images[0] || '',
      quantity: 1,
      price: product.finalPrice,
      slug: product.slug,
    });
    toast.success('Đã thêm vào giỏ hàng');
  };

  const hasDiscount = product.discountPercent > 0;
  const outOfStock = product.stock === 0;

  return (
    <Card
      component={Link}
      href={`/products/${product.slug}`}
      sx={{
        display: 'block', textDecoration: 'none', height: '100%',
        transition: 'transform 0.25s, box-shadow 0.25s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
      }}
    >
      <CardActionArea component="div" sx={{ cursor: 'pointer' }} disableRipple>
        {/* Image */}
        <Box sx={{ position: 'relative', aspectRatio: '1/1', bgcolor: 'grey.50', overflow: 'hidden' }}>
          {product.images[0] ? (
            <Image src={product.images[0]} alt={product.name} fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
            />
          ) : (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.300' }}>
              <ShoppingBagOutlinedIcon sx={{ fontSize: 48 }} />
            </Box>
          )}

          {/* Badges */}
          <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {hasDiscount && <Chip label={`-${product.discountPercent}%`} size="small" color="error" sx={{ height: 20, fontSize: 10, fontWeight: 700 }} />}
            {outOfStock && <Chip label="Hết hàng" size="small" sx={{ height: 20, fontSize: 10, bgcolor: 'grey.600', color: '#fff' }} />}
          </Box>

          {/* Quick add */}
          <Box sx={{ position: 'absolute', bottom: 8, right: 8 }}>
            <IconButton
              size="small"
              onClick={handleAddToCart}
              disabled={outOfStock}
              sx={{ bgcolor: outOfStock ? 'grey.400' : 'primary.main', color: '#fff', boxShadow: 2, '&:hover': { bgcolor: outOfStock ? 'grey.400' : 'primary.dark' }, width: 36, height: 36 }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        <CardContent sx={{ p: 1.75, pb: '14px !important' }}>
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.25 }}>
            {typeof product.category === 'object' ? product.category.name : ''}
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.4, mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 500  }}>
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>
              {formatCurrency(product.finalPrice)}
            </Typography>
            {hasDiscount && (
              <Typography variant="caption" color="text.disabled" sx={{ textDecoration: 'line-through' }}>
                {formatCurrency(product.sellingPrice)}
              </Typography>
            )}
          </Box>
          {product.stock > 0 && product.stock <= 5 && (
            <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, display: 'block' }}>Còn {product.stock} sản phẩm</Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
