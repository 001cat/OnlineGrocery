import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function Orders() {
  const [searchParams] = useSearchParams();
  let userId = searchParams.get("userId");
  const [orders, setOrders] = useState([]);
  const [isPlaceOrder, setIsPlaceOrder] = useState(false);

  useEffect(() => {
    async function getOrders(userId) {
      if (userId) {
        setIsPlaceOrder(true);
        try {
          await axios.post(
            `http://localhost:3000/api/v1/orders/placeOrder/${userId}`,
          );
        } catch (error) {
          if (error.response.data.message !== "Empty cart!") console.log(error);
        }
      }
      const res = await axios.get(
        `http://localhost:3000/api/v1/orders/myOrders`,
      );
      const orders = res.data.data;
      orders.reverse();
      setOrders(orders);
    }
    getOrders(userId);
  }, [userId, setIsPlaceOrder, setOrders]);

  if (isPlaceOrder) {
    setIsPlaceOrder(false);
    // searchParams.delete("userId");
    // setSearchParams(searchParams);
    // return <Navigate to={`/my-orders`} replace={true} />;
    location.assign("/my-orders");
  } else {
    return (
      <main className="main">
        <div className="cart-header">
          <div className="cart-heading">Orders</div>
        </div>
        {orders.map((el) => (
          <Order order={el} key={el.id} />
        ))}
      </main>
    );
    // return <p>{orders.map((el) => JSON.stringify(el)).toString()}</p>;
  }
}

function Order({ order }) {
  const orderedAt = new Date(order.orderedAt).toLocaleString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  return (
    <div className="cart-body order-body">
      <div className="order-header">
        <div className="order-heading">{`Ordered at ${orderedAt}`}</div>
        <div className="order-total">
          Total $
          {order.items
            .reduce((sum, el) => sum + el.product.price * el.quantity, 0)
            .toFixed(2)}
        </div>
      </div>
      {order.items.map((el) => (
        <Item item={el} key={el.id} />
      ))}
    </div>
  );
}

function Item({ item }) {
  return (
    <div className="cart-item">
      <img
        className="cart-item-image"
        src={`/img/images/${item.product.images[0]}`}
      />
      <h1 className="cart-item-title">{item.product.name}</h1>
      <div className="cart-item-counter">
        <div className="cart-counter-count">{`${item.quantity}${
          item.product.unitInLB ? (item.quantity === 1 ? " lb" : " lbs") : ""
        }`}</div>
      </div>
      <div className="cart-item-price-container">
        <div className="cart-item-price">
          ${(item.product.price * item.quantity).toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default Orders;
