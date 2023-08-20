import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { checkout } from './stripe';
import {
  addToCart,
  addQuantityInCart,
  removeQuantityInCart,
  clearCart,
  removeProductFromCart,
} from './cart';

//DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userNameEmailForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
const cartPlusBtns = document.querySelectorAll('.cart-counter-btn.plus');
const cartMinusBtns = document.querySelectorAll('.cart-counter-btn.minus');
const clearCartLink = document.getElementById('clearCart');
const removeProductFromCartLinks =
  document.querySelectorAll('.cart-price-remove');
const checkoutBtn = document.getElementById('checkout');
const payBtn = document.getElementById('pay');

//DELEGATION
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (userNameEmailForm) {
  userNameEmailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // console.log(document.getElementById('photo'));
    await updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );
    document.querySelector('.btn--save-password').textContent = 'Save Passwrod';
  });
}

if (addToCartBtns) {
  addToCartBtns.forEach((el) => {
    el.addEventListener('click', (e) => {
      addToCart(e.target.dataset.productId);
    });
  });
}

if (cartPlusBtns) {
  cartPlusBtns.forEach((el) => {
    el.addEventListener('click', addQuantityInCart);
  });
}

if (cartMinusBtns) {
  cartMinusBtns.forEach((el) => {
    el.addEventListener('click', removeQuantityInCart);
  });
}

if (clearCartLink) {
  clearCartLink.addEventListener('click', clearCart);
}

if (removeProductFromCartLinks) {
  removeProductFromCartLinks.forEach((el) => {
    el.addEventListener('click', removeProductFromCart);
  });
}

// if (checkoutBtn) {
//   checkoutBtn.addEventListener('click', (e) => {
//     e.target.textContent = 'Processing...';
//     const cartId = e.target.dataset.cartId;
//     checkout(cartId);
//   });
// }

if (payBtn) {
  payBtn.addEventListener('click', async (e) => {
    // e.preventDefault();
    const address = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      addLine1: document.getElementById('addLine1').value,
      addLine2: document.getElementById('addLine2').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      zipCode: document.getElementById('zipCode').value,
    };
    console.log(address);
    await updateSettings({ address }, 'pay');
    await checkout();
  });
}
