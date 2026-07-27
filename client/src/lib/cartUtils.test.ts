import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { addToCart, removeFromCart, getCart, updateCartItemQuantity, getTotalPrice } from './cartUtils';

describe('Cart Utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('addToCart', () => {
    it('should add a new item to an empty cart', () => {
      const item = {
        productId: 1,
        name: 'Rose',
        price: 10,
        quantity: 5,
        unitType: 'single stem',
      };

      addToCart(item);
      const cart = getCart();

      expect(cart).toHaveLength(1);
      expect(cart[0]).toMatchObject(item);
    });

    it('should merge duplicate items by increasing quantity', () => {
      const item1 = {
        productId: 1,
        name: 'Rose',
        price: 10,
        quantity: 5,
        unitType: 'single stem',
      };

      const item2 = {
        productId: 1,
        name: 'Rose',
        price: 10,
        quantity: 3,
        unitType: 'single stem',
      };

      addToCart(item1);
      addToCart(item2);
      const cart = getCart();

      expect(cart).toHaveLength(1);
      expect(cart[0]?.quantity).toBe(8);
    });

    it('should add different items to the cart', () => {
      const item1 = {
        productId: 1,
        name: 'Rose',
        price: 10,
        quantity: 5,
        unitType: 'single stem',
      };

      const item2 = {
        productId: 2,
        name: 'Tulip',
        price: 5,
        quantity: 3,
        unitType: 'single stem',
      };

      addToCart(item1);
      addToCart(item2);
      const cart = getCart();

      expect(cart).toHaveLength(2);
    });
  });

  describe('removeFromCart', () => {
    it('should remove an item from the cart', () => {
      const item = {
        productId: 1,
        name: 'Rose',
        price: 10,
        quantity: 5,
        unitType: 'single stem',
      };

      addToCart(item);
      removeFromCart(1);
      const cart = getCart();

      expect(cart).toHaveLength(0);
    });

    it('should only remove the specified item', () => {
      const item1 = {
        productId: 1,
        name: 'Rose',
        price: 10,
        quantity: 5,
        unitType: 'single stem',
      };

      const item2 = {
        productId: 2,
        name: 'Tulip',
        price: 5,
        quantity: 3,
        unitType: 'single stem',
      };

      addToCart(item1);
      addToCart(item2);
      removeFromCart(1);
      const cart = getCart();

      expect(cart).toHaveLength(1);
      expect(cart[0]?.productId).toBe(2);
    });
  });

  describe('updateCartItemQuantity', () => {
    it('should update the quantity of an item', () => {
      const item = {
        productId: 1,
        name: 'Rose',
        price: 10,
        quantity: 5,
        unitType: 'single stem',
      };

      addToCart(item);
      updateCartItemQuantity(1, 10);
      const cart = getCart();

      expect(cart[0]?.quantity).toBe(10);
    });

    it('should remove item if quantity is set to 0', () => {
      const item = {
        productId: 1,
        name: 'Rose',
        price: 10,
        quantity: 5,
        unitType: 'single stem',
      };

      addToCart(item);
      updateCartItemQuantity(1, 0);
      const cart = getCart();

      expect(cart).toHaveLength(0);
    });

    it('should remove item if quantity is set to negative', () => {
      const item = {
        productId: 1,
        name: 'Rose',
        price: 10,
        quantity: 5,
        unitType: 'single stem',
      };

      addToCart(item);
      updateCartItemQuantity(1, -5);
      const cart = getCart();

      expect(cart).toHaveLength(0);
    });
  });

  describe('getTotalPrice', () => {
    it('should calculate total price correctly', () => {
      const item1 = {
        productId: 1,
        name: 'Rose',
        price: 10,
        quantity: 5,
        unitType: 'single stem',
      };

      const item2 = {
        productId: 2,
        name: 'Tulip',
        price: 5,
        quantity: 3,
        unitType: 'single stem',
      };

      addToCart(item1);
      addToCart(item2);
      const total = getTotalPrice(getCart());

      // (10 * 5) + (5 * 3) = 50 + 15 = 65
      expect(total).toBe('65.00');
    });

    it('should return 0.00 for empty cart', () => {
      const total = getTotalPrice([]);
      expect(total).toBe('0.00');
    });
  });

  describe('getCart', () => {
    it('should return empty array if no cart exists', () => {
      const cart = getCart();
      expect(cart).toEqual([]);
    });

    it('should return cart items from localStorage', () => {
      const item = {
        productId: 1,
        name: 'Rose',
        price: 10,
        quantity: 5,
        unitType: 'single stem',
      };

      addToCart(item);
      const cart = getCart();

      expect(cart).toHaveLength(1);
      expect(cart[0]).toMatchObject(item);
    });
  });
});
