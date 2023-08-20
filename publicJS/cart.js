import axios from 'axios';
import { showAlert } from './alerts';

const patchToCart = async (items) => {
  try {
    const res = await axios.patch('http://localhost:3000/api/v1/carts/myCart', {
      items,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

export const addQuantityInCart = async (event) => {
  let newPrice = 0;
  let counts = document.querySelectorAll('.cart-counter-count');

  counts.forEach((el) => {
    if (el.dataset.productId === event.target.dataset.productId) {
      el.textContent = el.textContent * 1 + 1;
      newPrice = el.textContent * el.dataset.productPrice;
      updatePriceInCart(event.target.dataset.productId, newPrice);
    }
  });

  const items = Array.from(counts).map((el) => ({
    product: el.dataset.productId,
    quantity: el.textContent * 1,
  }));
  await patchToCart(items);
};
export const removeQuantityInCart = async (event) => {
  let newPrice = 0;
  let counts = document.querySelectorAll('.cart-counter-count');

  counts.forEach((el) => {
    if (el.dataset.productId === event.target.dataset.productId) {
      if (el.textContent * 1 - 1 <= 0)
        showAlert('error', 'Quantity must be positive!');
      else {
        el.textContent = el.textContent * 1 - 1;
        newPrice = el.textContent * el.dataset.productPrice;
        updatePriceInCart(event.target.dataset.productId, newPrice);
      }
    }
  });
  const items = Array.from(counts).map((el) => ({
    product: el.dataset.productId,
    quantity: el.textContent * 1,
  }));
  await patchToCart(items);
};
const updatePriceInCart = (productId, newPrice) => {
  let prices = document.querySelectorAll('.cart-item-price');
  prices.forEach((el) => {
    if (el.dataset.productId === productId)
      el.textContent = `$${newPrice.toFixed(2)}`;
  });
  const total = Array.from(prices).reduce(
    (sum, el) => sum + el.textContent.slice(1) * 1,
    0,
  );
  let totalPrice = document.getElementById('totalPrice');
  totalPrice.textContent = `$${total.toFixed(2)}`;
};

export const addToCart = async (productId) => {
  try {
    const res = await axios.get('http://localhost:3000/api/v1/carts/myCart');
    const cart = res.data.data;
    let exist = false;
    let items = cart.items.map((el) => {
      if (el.product.id === productId) {
        exist = true;
        return {
          product: el.product.id,
          quantity: el.quantity + 1,
        };
      } else {
        return {
          product: el.product.id,
          quantity: el.quantity,
        };
      }
    });
    // console.log(items);
    if (!exist) items.push({ product: productId, quantity: 1 });
    await axios.patch('http://localhost:3000/api/v1/carts/myCart', {
      items,
    });
    showAlert('success', 'Item has been added to the cart!');
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

export const clearCart = async () => {
  try {
    await axios.delete('http://localhost:3000/api/v1/carts/myCart');
    showAlert('success', 'Shopping cart has been cleared');
    window.setTimeout(() => {
      location.assign('/my-cart');
    }, 1500);
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

export const removeProductFromCart = async (event) => {
  try {
    const res = await axios.get('http://localhost:3000/api/v1/carts/myCart');
    const cart = res.data.data;
    let productName;

    const items = cart.items.filter((el) => {
      if (el.product.id === event.target.dataset.productId) {
        productName = el.product.name;
        return false;
      } else {
        return true;
      }
    });

    await axios.patch('http://localhost:3000/api/v1/carts/myCart', {
      items,
    });
    showAlert('success', `${productName} has been removed from cart`);
    window.setTimeout(() => {
      location.assign('/my-cart');
    }, 500);
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

export const checkout = (cartId) => {};
