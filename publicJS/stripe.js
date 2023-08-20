/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51NeqdRJ3Oox2TWhwXPoyalGemLR1iG4nMw1SA7vekVzrB0Pbg4u9GJMMV73mgG4rHH5vFPetaFqCU83dSZGrZXBv00BOGluzGS',
);

export const checkout = async () => {
  try {
    // 1) get checkout session from API
    const session = await axios(
      `http://localhost:3000/api/v1/orders/checkout-session/`,
    );
    // 2) create checkout form
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
