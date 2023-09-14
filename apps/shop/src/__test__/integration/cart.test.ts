import app from '../../app';
import request from 'supertest';
import { signin } from './test-utils';
import db from '../../database/sql';
import { cart, cartItem, product, productPrice } from '../../models/schema';

describe('Cart routes', () => {
  beforeAll(async () => {
    await db.delete(cartItem);
    await db.delete(cart);
    await db.delete(productPrice);
    await db.delete(product);

    await db.insert(product).values({
      id: 1,
      name: 'test',
      createdAt: new Date(),
      image: 'test',
      stock: 10,
      version: 1,
    });

    await db.insert(product).values({
      id: 2,
      name: 'test2',
      createdAt: new Date(),
      image: 'test2',
      stock: 10,
      version: 1,
    });

    await db.insert(productPrice).values({
      id: 1,
      productId: 1,
      price: 10.6,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    });

    await db.insert(productPrice).values({
      id: 2,
      productId: 2,
      price: 12.6,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    });
  });

  describe('POST /cart', () => {
    it("should add product to cart even guest user doesn't have any cart created yet", async () => {
      const res = await request(app)
        .post('/shop/cart?product_id=1&quantity=1')
        .send()
        .expect(200);

      expect(res.body.message).toBe('Product added to cart');
      // expect add cart session cookie
      const cookies = res.get('Set-Cookie');
      expect(cookies[0].split(';')[0].split('=')[0]).toMatch('cart_session');
    });

    it('should add product too if user signed in', async () => {
      const accessToken = signin();
      const res = await request(app)
        .post('/shop/cart?product_id=2&quantity=1')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send()
        .expect(200);

      expect(res.body.message).toBe('Product added to cart');
      const cookies = res.get('Set-Cookie');

      const response2 = await request(app)
        .post('/shop/cart?product_id=1&quantity=1')
        .set('Cookie', [`accessToken=${accessToken}`, ...cookies])
        .send()
        .expect(200);
      expect(response2.body.message).toBe('Product added to cart');

      const cartResponse = await request(app)
        .get('/shop/cart')
        .set('Cookie', [`accessToken=${accessToken}`, ...cookies])
        .send();
      console.log(cartResponse.body.cart);
      expect(cartResponse.body.cart.cartItems.length).toBe(2);
    });
  });

  describe('GET /cart', () => {
    beforeAll(async () => {
      await db.delete(cartItem);
      await db.delete(cart);
    });
    it('should return cart', async () => {
      const res = await request(app).get('/shop/cart').send();

      expect(res.body.cart).toHaveProperty('cartItems');
      expect(res.body.cart.cartItems.length).toBe(0);
    });

    it("it shouldn't return cart if user is not owner of the cart", async () => {
      const accessToken = signin();
      const res = await request(app)
        .post('/shop/cart?product_id=2&quantity=1')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send()
        .expect(200);

      const cookies = res.get('Set-Cookie');
      await request(app)
        .get('/shop/cart')
        .set('Cookie', [...cookies])
        .send()
        .expect(403);
    });
  });

  describe('PATCH /cart/:id', () => {
    beforeAll(async () => {
      await db.delete(cartItem);
      await db.delete(cart);
    });

    it('should return 404 if cart not found', async () => {
      const res = await request(app)
        .patch('/shop/cart/1?quantity=1')
        .set('Cookie', [`cart_session=1`])
        .send()
        .expect(404);

      expect(res.body.message).toBe('Cart not found');
    });

    it('should return 404 if product not found', async () => {
      const accessToken = signin();
      const res2 = await request(app)
        .post('/shop/cart?product_id=1&quantity=1')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send();
      const cookies2 = res2.get('Set-Cookie');
      const res3 = await request(app)
        .patch('/shop/cart/123?quantity=1')
        .set('Cookie', [`accessToken=${accessToken}`, ...cookies2])
        .send();

      expect(res3.body.message).toBe('Product not found');

      const res4 = await request(app)
        .patch('/shop/cart/2?&quantity=5')
        .set('Cookie', [`accessToken=${accessToken}`, ...cookies2])
        .send();
      expect(res4.body.message).toBe('Product not found on cart');
    });
  });

  describe('DELETE /cart', () => {
    beforeAll(async () => {
      await db.delete(cartItem);
      await db.delete(cart);
    });

    it('should delete item from cart', async () => {
      const accessToken = signin();
      const res2 = await request(app)
        .post('/shop/cart?product_id=1&quantity=1')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send();
      const cookies2 = res2.get('Set-Cookie');
      const res3 = await request(app)
        .delete('/shop/cart?product_id=1')
        .set('Cookie', [`accessToken=${accessToken}`, ...cookies2])
        .send();

      expect(res3.body.message).toBe('Product removed from cart');

      // check if cart is empty
      const res4 = await request(app)
        .get('/shop/cart')
        .set('Cookie', [`accessToken=${accessToken}`, ...cookies2])
        .send();
      expect(res4.body.cart.cartItems.length).toBe(0);
    });
  });
});
