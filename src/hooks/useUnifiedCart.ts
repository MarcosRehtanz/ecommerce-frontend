'use client';

import { useEffect, useCallback } from 'react';
import { useCartStore, LocalCartItem } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import {
  useServerCart,
  useAddToCartServer,
  useUpdateCartItemServer,
  useRemoveCartItemServer,
  useClearCartServer,
  useSyncCart,
} from './useCart';
import { notifications } from '@mantine/notifications';
import { getProductImageSrc } from '@/utils/image';

/**
 * Unified cart hook that handles both local (anonymous) and server (authenticated) carts
 */
export function useUnifiedCart() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Local cart state
  const localItems = useCartStore((state) => state.items);
  const localAddItem = useCartStore((state) => state.addItem);
  const localRemoveItem = useCartStore((state) => state.removeItem);
  const localUpdateQuantity = useCartStore((state) => state.updateQuantity);
  const localClearCart = useCartStore((state) => state.clearCart);
  const setItems = useCartStore((state) => state.setItems);
  const getItemsForSync = useCartStore((state) => state.getItemsForSync);

  // Server cart hooks
  const { data: serverCart, isLoading: isLoadingServer } = useServerCart();
  const addToCartMutation = useAddToCartServer();
  const updateCartMutation = useUpdateCartItemServer();
  const removeCartMutation = useRemoveCartItemServer();
  const clearCartMutation = useClearCartServer();
  const syncCartMutation = useSyncCart();

  // Sync local cart with server when user logs in
  useEffect(() => {
    if (isAuthenticated && localItems.length > 0 && !syncCartMutation.isPending) {
      const itemsToSync = getItemsForSync();
      syncCartMutation.mutate(itemsToSync, {
        onSuccess: (data) => {
          // Update local cart with server response
          const newLocalItems: LocalCartItem[] = data.items.map((item) => ({
            productId: item.productId,
            name: item.product.name,
            price: Number(item.product.price),
            quantity: item.quantity,
            imageUrl: getProductImageSrc(item.product.imageData, item.product.imageUrl),
          }));
          setItems(newLocalItems);
        },
      });
    }
  }, [isAuthenticated]);

  // Update local cart when server cart changes
  useEffect(() => {
    if (isAuthenticated && serverCart && !syncCartMutation.isPending) {
      const newLocalItems: LocalCartItem[] = serverCart.items.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        price: Number(item.product.price),
        quantity: item.quantity,
        imageUrl: getProductImageSrc(item.product.imageData, item.product.imageUrl),
      }));
      setItems(newLocalItems);
    }
  }, [serverCart, isAuthenticated]);

  // Add item to cart
  const addItem = useCallback(
    (item: Omit<LocalCartItem, 'quantity'>) => {
      // Always update local state first (optimistic)
      localAddItem(item);

      if (isAuthenticated) {
        addToCartMutation.mutate(
          { productId: item.productId, quantity: 1 },
          {
            onError: () => {
              // Revert on error
              localRemoveItem(item.productId);
            },
          }
        );
      }

      notifications.show({
        title: 'Producto agregado',
        message: `${item.name} se agregó al carrito`,
        color: 'green',
      });
    },
    [isAuthenticated, localAddItem, localRemoveItem, addToCartMutation]
  );

  // Update quantity
  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const previousItem = localItems.find((i) => i.productId === productId);
      localUpdateQuantity(productId, quantity);

      if (isAuthenticated && serverCart) {
        const serverItem = serverCart.items.find((i) => i.productId === productId);
        if (serverItem) {
          updateCartMutation.mutate(
            { itemId: serverItem.id, data: { quantity } },
            {
              onError: () => {
                // Revert on error
                if (previousItem) {
                  localUpdateQuantity(productId, previousItem.quantity);
                }
              },
            }
          );
        }
      }
    },
    [isAuthenticated, serverCart, localItems, localUpdateQuantity, updateCartMutation]
  );

  // Remove item
  const removeItem = useCallback(
    (productId: string) => {
      const previousItem = localItems.find((i) => i.productId === productId);
      localRemoveItem(productId);

      if (isAuthenticated && serverCart) {
        const serverItem = serverCart.items.find((i) => i.productId === productId);
        if (serverItem) {
          removeCartMutation.mutate(serverItem.id, {
            onError: () => {
              // Revert on error
              if (previousItem) {
                localAddItem(previousItem);
              }
            },
          });
        }
      }
    },
    [isAuthenticated, serverCart, localItems, localRemoveItem, localAddItem, removeCartMutation]
  );

  // Clear cart
  const clearCart = useCallback(() => {
    const previousItems = [...localItems];
    localClearCart();

    if (isAuthenticated) {
      clearCartMutation.mutate(undefined, {
        onError: () => {
          // Revert on error
          setItems(previousItems);
        },
      });
    }
  }, [isAuthenticated, localItems, localClearCart, setItems, clearCartMutation]);

  // Calculate totals
  const totalItems = localItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = localItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return {
    items: localItems,
    totalItems,
    totalPrice,
    isLoading: isAuthenticated && isLoadingServer,
    isSyncing: syncCartMutation.isPending,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
