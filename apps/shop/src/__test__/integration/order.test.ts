import app from '../../app';
import request from 'supertest';
import { signin } from './test-utils';
import db from '../../database/sql';
import { cart, cartItem, product, productPrice } from '../../models/schema';

jest.mock('../../libs/stripe', () => ({
  __esModule: true,
  default: {
    paymentIntents: {
      create: jest.fn().mockImplementation(() => ({
        client_secret: 'test',
        id: 'idtest',
      })),
    },
  },
}));

jest.mock('@e-commerce-monorepo/event-bus', () => ({
  OrderCreated: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
}));

describe('Order routes', () => {
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
      startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    });

    await db.insert(productPrice).values({
      id: 2,
      productId: 2,
      price: 12.6,
      startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    });
  });

  it('should create order', async () => {
    const accessToken = signin();
    const res = await request(app)
      .post('/shop/cart?product_id=2&quantity=1')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send()
      .expect(200);

    const cookies = res.get('Set-Cookie');

    await request(app)
      .post('/shop/cart?product_id=1&quantity=1')
      .set('Cookie', [`accessToken=${accessToken}`, ...cookies])
      .send()
      .expect(200);

    const cartResponse = await request(app)
      .get('/shop/cart')
      .set('Cookie', [`accessToken=${accessToken}`, ...cookies])
      .send();

    const cart = cartResponse.body.cart;
    console.log('cartest', cart);
    console.log('cartItemProduct', cart.cartItems[1].product);
    let total = 0;
    for (const item of cart.cartItems) {
      console.log(item.product.price[0]);
      total += item.product.price[0].price * item.quantity;
    }

    const checkResponse = await request(app)
      .get(`/shop/cart/check?total=${total}`)
      .set('Cookie', [`accessToken=${accessToken}`, ...cookies])
      .send();

    expect(checkResponse.status).toBe(200);
    const response = await request(app)
      .post(`/shop/order?total=${total}&token=tok_visa`)
      .set('Cookie', [`accessToken=${accessToken}`, ...cookies]);

    expect(response.status).toBe(201);
  });

  it('should return all orders for user', async () => {
    const accessToken = signin();
    const res = await request(app)
      .get('/shop/order')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send()
      .expect(200);

    console.log('res', res.body.data);

    expect(res.body.data.length).toBe(1);
  });
});
