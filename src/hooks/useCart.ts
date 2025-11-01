import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { clearCart, addToCart, removeFromCart } from '@/store/slices/cart.slice'

/**
 * Custom hook for managing cart state with localStorage persistence
 */
export function useCart() {
  const dispatch = useAppDispatch()
  const cart = useAppSelector((state) => state.cart)
  const [isMounted, setIsMounted] = useState(false)

  // Persist cart to localStorage
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && cart.items.length > 0) {
      try {
        localStorage.setItem('ffdh_cart', JSON.stringify(cart))
      } catch (error) {
        console.warn('Failed to persist cart to localStorage:', error)
      }
    }
  }, [cart, isMounted])

  // Hydrate cart from localStorage
  useEffect(() => {
    if (isMounted) {
      try {
        const savedCart = localStorage.getItem('ffdh_cart')
        if (savedCart) {
          // Optional: Restore cart from localStorage
          // This would require additional action in the store
          console.log('Cart restored from localStorage')
        }
      } catch (error) {
        console.warn('Failed to restore cart from localStorage:', error)
      }
    }
  }, [isMounted])

  return {
    items: cart.items,
    total: cart.total,
    itemCount: cart.itemCount,
    addItem: (item: any) => dispatch(addToCart(item)),
    removeItem: (variantId: string) => dispatch(removeFromCart(variantId)),
    clear: () => dispatch(clearCart()),
  }
}

/**
 * Hook to check if cart has items
 */
export function useHasCartItems() {
  const { itemCount } = useAppSelector((state) => state.cart)
  return itemCount > 0
}
