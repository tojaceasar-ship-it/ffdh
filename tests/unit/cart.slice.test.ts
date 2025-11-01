import { describe, it, expect, beforeEach } from 'vitest'
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  CartItem,
  CartState,
} from '../../src/store/slices/cart.slice'

describe('Cart Slice', () => {
  let initialState: CartState

  beforeEach(() => {
    initialState = {
      items: [],
      total: 0,
      itemCount: 0,
    }
  })

  describe('addToCart', () => {
    it('should add a new item to cart', () => {
      const newItem: CartItem = {
        id: '1',
        variantId: 'var_1',
        name: 'Test Product',
        priceEUR: 29.99,
        quantity: 1,
      }

      const result = cartReducer(initialState, addToCart(newItem))

      expect(result.items).toHaveLength(1)
      expect(result.items[0]).toEqual(newItem)
      expect(result.total).toBe(29.99)
      expect(result.itemCount).toBe(1)
    })

    it('should increase quantity when adding existing item', () => {
      const existingItem: CartItem = {
        id: '1',
        variantId: 'var_1',
        name: 'Test Product',
        priceEUR: 29.99,
        quantity: 1,
      }

      let state = cartReducer(initialState, addToCart(existingItem))

      const additionalItem: CartItem = {
        id: '1',
        variantId: 'var_1',
        name: 'Test Product',
        priceEUR: 29.99,
        quantity: 2,
      }

      state = cartReducer(state, addToCart(additionalItem))

      expect(state.items).toHaveLength(1)
      expect(state.items[0].quantity).toBe(3)
      expect(state.total).toBe(89.97)
      expect(state.itemCount).toBe(3)
    })

    it('should handle multiple different items', () => {
      const item1: CartItem = {
        id: '1',
        variantId: 'var_1',
        name: 'Product 1',
        priceEUR: 10.00,
        quantity: 1,
      }

      const item2: CartItem = {
        id: '2',
        variantId: 'var_2',
        name: 'Product 2',
        priceEUR: 20.00,
        quantity: 2,
      }

      let state = cartReducer(initialState, addToCart(item1))
      state = cartReducer(state, addToCart(item2))

      expect(state.items).toHaveLength(2)
      expect(state.total).toBe(50.00)
      expect(state.itemCount).toBe(3)
    })
  })

  describe('removeFromCart', () => {
    it('should remove item from cart', () => {
      const item: CartItem = {
        id: '1',
        variantId: 'var_1',
        name: 'Test Product',
        priceEUR: 29.99,
        quantity: 1,
      }

      let state = cartReducer(initialState, addToCart(item))
      state = cartReducer(state, removeFromCart('var_1'))

      expect(state.items).toHaveLength(0)
      expect(state.total).toBe(0)
      expect(state.itemCount).toBe(0)
    })

    it('should not affect other items when removing', () => {
      const item1: CartItem = {
        id: '1',
        variantId: 'var_1',
        name: 'Product 1',
        priceEUR: 10.00,
        quantity: 1,
      }

      const item2: CartItem = {
        id: '2',
        variantId: 'var_2',
        name: 'Product 2',
        priceEUR: 20.00,
        quantity: 1,
      }

      let state = cartReducer(initialState, addToCart(item1))
      state = cartReducer(state, addToCart(item2))
      state = cartReducer(state, removeFromCart('var_1'))

      expect(state.items).toHaveLength(1)
      expect(state.items[0].variantId).toBe('var_2')
      expect(state.total).toBe(20.00)
      expect(state.itemCount).toBe(1)
    })
  })

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const item: CartItem = {
        id: '1',
        variantId: 'var_1',
        name: 'Test Product',
        priceEUR: 10.00,
        quantity: 1,
      }

      let state = cartReducer(initialState, addToCart(item))
      state = cartReducer(state, updateQuantity({ variantId: 'var_1', quantity: 5 }))

      expect(state.items[0].quantity).toBe(5)
      expect(state.total).toBe(50.00)
      expect(state.itemCount).toBe(5)
    })

    it('should remove item when quantity is 0 or less', () => {
      const item: CartItem = {
        id: '1',
        variantId: 'var_1',
        name: 'Test Product',
        priceEUR: 10.00,
        quantity: 2,
      }

      let state = cartReducer(initialState, addToCart(item))
      state = cartReducer(state, updateQuantity({ variantId: 'var_1', quantity: 0 }))

      expect(state.items).toHaveLength(0)
      expect(state.total).toBe(0)
      expect(state.itemCount).toBe(0)
    })

    it('should not affect other items when updating quantity', () => {
      const item1: CartItem = {
        id: '1',
        variantId: 'var_1',
        name: 'Product 1',
        priceEUR: 10.00,
        quantity: 1,
      }

      const item2: CartItem = {
        id: '2',
        variantId: 'var_2',
        name: 'Product 2',
        priceEUR: 20.00,
        quantity: 1,
      }

      let state = cartReducer(initialState, addToCart(item1))
      state = cartReducer(state, addToCart(item2))
      state = cartReducer(state, updateQuantity({ variantId: 'var_1', quantity: 3 }))

      expect(state.items).toHaveLength(2)
      expect(state.items[0].quantity).toBe(3)
      expect(state.items[1].quantity).toBe(1)
      expect(state.total).toBe(50.00)
      expect(state.itemCount).toBe(4)
    })
  })

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const item1: CartItem = {
        id: '1',
        variantId: 'var_1',
        name: 'Product 1',
        priceEUR: 10.00,
        quantity: 1,
      }

      const item2: CartItem = {
        id: '2',
        variantId: 'var_2',
        name: 'Product 2',
        priceEUR: 20.00,
        quantity: 2,
      }

      let state = cartReducer(initialState, addToCart(item1))
      state = cartReducer(state, addToCart(item2))
      state = cartReducer(state, clearCart())

      expect(state.items).toHaveLength(0)
      expect(state.total).toBe(0)
      expect(state.itemCount).toBe(0)
    })
  })

  describe('initial state', () => {
    it('should return initial state', () => {
      expect(cartReducer(undefined, { type: undefined })).toEqual(initialState)
    })
  })
})
