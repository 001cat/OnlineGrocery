import { useState, useEffect, useCallback } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import "./style.css";
import axios from "axios";
axios.defaults.withCredentials = true;

import Layout from "./Layout";
import ErrorMessage from "./Error";
import Overview from "./Overview";
import LoginForm from "./Login";
import Account from "./Account";
import Cart from "./Cart";
import Address from "./Address";
import Orders from "./Orders";

document.title = "Grocery | All products";

const stripe = await loadStripe(
  "pk_test_51NeqdRJ3Oox2TWhwXPoyalGemLR1iG4nMw1SA7vekVzrB0Pbg4u9GJMMV73mgG4rHH5vFPetaFqCU83dSZGrZXBv00BOGluzGS",
);

function App() {
  const [alert, setAlert] = useState([0, "error", ""]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        let res = await axios.get(
          "http://localhost:3000/api/v1/users/isLoggedIn",
        );
        if (res.data.data.user) {
          setUser(res.data.data.user);
          res = await axios.get("http://localhost:3000/api/v1/carts/myCart");
          setCart(res?.data.data.items);
        }
      } catch (err) {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  const loadProducts = useCallback(async () => {
    let products, suggests;
    try {
      let res = await axios.get(
        "http://localhost:3000/api/v1/products?limit=100",
      );
      products = res.data.data.doc;
      res = user
        ? await axios.get("http://localhost:3000/api/v1/products/suggests")
        : null;
      suggests = res?.data.data.suggests;
    } catch (err) {
      products = [];
      suggests = [];
    }
    return { products, suggests };
  }, [user]);

  const patchCart = useCallback(
    async (operation, product, quantity = 1) => {
      try {
        let newCart = [...cart];
        let index = -1;
        if (operation === "remove" && product === "all") {
          newCart = [];
        } else {
          for (let i = 0; i < cart.length; i += 1) {
            if (cart[i].product.id === product.id) {
              index = i;
              break;
            }
          }
          if (operation === "modify") {
            if (index === -1) {
              newCart.push({ product, quantity: 1 });
            } else if (newCart[index].quantity + quantity <= 0) {
              throw Error("Item quantity must be positive!");
            } else {
              newCart[index].quantity += quantity;
            }
          } else if (operation === "remove") {
            if (index === -1) {
              throw new Error("Item not found!");
            } else {
              newCart = newCart.splice(index, 1);
            }
          } else {
            throw new Error("Invalid operation");
          }
        }
        const res = await axios.patch(
          "http://localhost:3000/api/v1/carts/myCart",
          {
            items: newCart.map((el) => {
              return { product: el.product.id, quantity: el.quantity };
            }),
          },
        );
        if (res.data.stats === "Success") {
          setCart(newCart);
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return false;
      }
    },
    [cart, setCart],
  );

  const router = createBrowserRouter([
    {
      element: <Layout user={user} alert={alert} setAlert={setAlert} />,
      errorElement: <ErrorMessage />,
      children: [
        {
          path: "/",
          loader: loadProducts,
          element: (
            <Overview user={user} patchCart={patchCart} setAlert={setAlert} />
          ),
        },
        { path: "/login", element: <LoginForm setAlert={setAlert} /> },
        {
          path: "/my-cart",
          element: cart ? (
            <Cart cart={cart} patchCart={patchCart} setAlert={setAlert} />
          ) : null,
        },
        {
          path: "/me",
          element: <Account user={user} setAlert={setAlert} />,
        },
        {
          path: "/delivery-address",
          element: user ? (
            <Address user={user} setAlert={setAlert} stripe={stripe} />
          ) : null,
        },
        { path: "/my-orders", element: <Orders user={user} /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
