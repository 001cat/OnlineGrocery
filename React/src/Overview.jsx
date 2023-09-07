import { useCallback } from "react";
import { useLoaderData } from "react-router-dom";

function Overview({ user, patchCart, setAlert }) {
  const { products, suggests } = useLoaderData();
  const onClickAddToCart = useCallback(
    async (product) => {
      (await patchCart("modify", product))
        ? setAlert([5000, "success", "Item has been added to the cart!"])
        : setAlert([
            5000,
            "failed",
            "Failed adding item to cart! Please try again later.",
          ]);
    },
    [patchCart, setAlert],
  );
  return (
    <main className="main">
      {suggests && suggests.length > 0 ? (
        <ItemDisplay
          title={"Suggests"}
          items={suggests}
          user={user}
          onClickAddToCart={onClickAddToCart}
        />
      ) : null}

      <ItemDisplay
        title={"All items"}
        items={products}
        user={user}
        onClickAddToCart={onClickAddToCart}
      />

      {/* {error && <ErrorMessage message={error} />} */}
    </main>
  );
}

function ItemDisplay({ title, items, user, onClickAddToCart }) {
  return (
    <>
      <div className="card-container-title">
        <div className="heading-secondary ma-bt-md">{title}</div>
      </div>
      <div className="card-container">
        {items.map((item) => (
          <div className="card" key={item.name}>
            <div className="card__header">
              <div className="card__picture">
                <img
                  className="card__picture-img"
                  src={`/img/images/${item.images[0]}`}
                  alt={`${item.name}`}
                />
              </div>
              <h3 className="heading-tertirary">
                <span>{item.name}</span>
              </h3>
            </div>
            <div className="card__footer">
              <p className="card__ratings">
                <span className="card__footer-value">${item.price}</span>
                {item.unitInLB ? (
                  <span className="card__footer-test"> / lb</span>
                ) : null}
              </p>
              {user ? (
                <button
                  className="btn btn--green btn--small add-to-cart-btn"
                  onClick={() => onClickAddToCart(item)}
                  data-product-id={item.id}
                >
                  Add to cart
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Overview;
