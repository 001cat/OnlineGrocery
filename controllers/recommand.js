const Order = require('../models/orderModel');

const getMinMax = (products) => {
  const minmax = products.reduce(
    (r, e) => {
      r[0][0] =
        r[0][0] <= e.nutrition100g.protein ? r[0][0] : e.nutrition100g.protein;
      r[1][0] = r[1][0] <= e.nutrition100g.fat ? r[1][0] : e.nutrition100g.fat;
      r[2][0] =
        r[2][0] <= e.nutrition100g.fiber ? r[2][0] : e.nutrition100g.fiber;
      r[3][0] =
        r[3][0] <= e.nutrition100g.sugars ? r[3][0] : e.nutrition100g.sugars;
      r[4][0] =
        r[4][0] <= e.nutrition100g.water ? r[4][0] : e.nutrition100g.water;

      r[0][1] =
        r[0][1] >= e.nutrition100g.protein ? r[0][1] : e.nutrition100g.protein;
      r[1][1] = r[1][1] >= e.nutrition100g.fat ? r[1][1] : e.nutrition100g.fat;
      r[2][1] =
        r[2][1] >= e.nutrition100g.fiber ? r[2][1] : e.nutrition100g.fiber;
      r[3][1] =
        r[3][1] >= e.nutrition100g.sugars ? r[3][1] : e.nutrition100g.sugars;
      r[4][1] =
        r[4][1] >= e.nutrition100g.water ? r[4][1] : e.nutrition100g.water;
      return r;
    },
    [
      [100, 0],
      [100, 0],
      [100, 0],
      [100, 0],
      [100, 0],
    ],
  );
  return minmax;
};

const getOrdersAvg = (orders) => {
  const ordersSum = orders.reduce(
    (acc, el) => {
      const tmp = el.items.reduce(
        (a, e) => {
          a[0] += e.quantity;
          a[1] += e.product.nutrition100g.protein * e.quantity;
          a[2] += e.product.nutrition100g.fat * e.quantity;
          a[3] += e.product.nutrition100g.fiber * e.quantity;
          a[4] += e.product.nutrition100g.sugars * e.quantity;
          a[5] += e.product.nutrition100g.water * e.quantity;
          return a;
        },
        [0, 0, 0, 0, 0, 0],
      );

      for (let i = 0; i < 6; i += 1) {
        acc[i] += tmp[i];
      }
      return acc;
    },
    [0, 0, 0, 0, 0, 0],
  );
  return [
    ordersSum[1] / ordersSum[0],
    ordersSum[2] / ordersSum[0],
    ordersSum[3] / ordersSum[0],
    ordersSum[4] / ordersSum[0],
    ordersSum[5] / ordersSum[0],
  ];
};

const getDist = (ordersAvg, product, minmax) => {
  let d = 0;
  const p = [
    product.nutrition100g.protein,
    product.nutrition100g.fat,
    product.nutrition100g.fiber,
    product.nutrition100g.sugars,
    product.nutrition100g.water,
  ];
  for (let i = 0; i < ordersAvg.length; i += 1) {
    d += ((ordersAvg[i] - p[i]) / (minmax[i][1] - minmax[i][0])) ** 2;
  }
  d /= ordersAvg.length;
  //   console.log(d);
  return { distance: Math.sqrt(d), product };
};
// const normalize = ()

module.exports = async (userId, products) => {
  const orders = await Order.find({ userId });
  if (orders.length === 0) return false;

  const minmax = getMinMax(products);
  //   console.log(minmax);
  const ordersAvg = getOrdersAvg(orders);
  //   console.log(ordersAvg);

  const res = products
    .map((el) => getDist(ordersAvg, el, minmax))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map((el) => el.product);
  //   console.log(res);
  //   console.log(res.map((el) => el.name));
  return res;
};
