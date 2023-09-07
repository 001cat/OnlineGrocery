function Cart({ cart, patchCart, setAlert }) {
  const failAlert = () =>
    setAlert([
      5000,
      "failed",
      "Ops! Operation failed, please try again later.",
    ]);
  //   console.log(cart);
  return (
    <main className="main">
      <div className="cart-header">
        <div className="cart-heading">My Cart</div>
        <a
          className="cart-remove-all"
          id="clearCart"
          onClick={async () => {
            (await patchCart("remove", "all"))
              ? setAlert([5000, "success", "Shopping cart has been cleared!"])
              : failAlert();
          }}
        >
          Remove all
        </a>
      </div>
      <div className="cart-body">
        {cart.map((el) => (
          <Item
            item={el}
            patchCart={patchCart}
            setAlert={setAlert}
            key={el.product.id}
          />
        ))}
      </div>
      <hr className="cart-checkout" />
      <div className="cart-checkout">
        <div className="cart-checkout-amount" id="totalPrice">
          Total:{" "}
          {cart
            .reduce((sum, el) => sum + el.product.price * el.quantity, 0)
            .toFixed(2)}
        </div>
      </div>
      <div className="cart-checkout">
        {cart.length === 0 ? null : (
          <a className="btn btn--green span-all-rows" href="/delivery-address">
            {/* <a
            className="btn btn--green span-all-rows"
            href={`my-orders/?userId=64e18d906b3b44731165d9f0`}
          > */}
            Checkout
          </a>
        )}
      </div>
    </main>
  );
}

function Item({ item, patchCart, setAlert }) {
  const failAlert = () =>
    setAlert([
      5000,
      "failed",
      "Ops! Operation failed, please try again later.",
    ]);
  return (
    <div className="cart-item">
      <img
        className="cart-item-image"
        src={`img/images/${item.product.images[0]}`}
      />
      <h1 className="cart-item-title">{item.product.name}</h1>
      <div className="cart-item-counter">
        <div
          className="cart-counter-btn minus"
          onClick={async () => {
            (await patchCart("modify", item.product, -1)) || failAlert();
          }}
        >
          {" "}
          -{" "}
        </div>
        <div className="cart-counter-quantity">
          <div className="cart-counter-count">{item.quantity}</div>
          {item.product.unitInLB ? (
            <div className="cart-counter-unit">lb</div>
          ) : null}
        </div>
        <div
          className="cart-counter-btn plus"
          onClick={async () => {
            await patchCart("modify", item.product, 1);
          }}
        >
          {" "}
          +{" "}
        </div>
      </div>
      <div className="cart-item-price-container">
        <div className="cart-item-price">
          ${(item.product.price * item.quantity).toFixed(2)}
        </div>
        <a
          className="cart-price-remove"
          onClick={async () => {
            (await patchCart("remove", item.product))
              ? setAlert([5000, "success", "Item has been removed!"])
              : failAlert();
          }}
        >
          Remove
        </a>
      </div>
    </div>
  );
}

export default Cart;
