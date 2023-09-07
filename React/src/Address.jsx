import { useState } from "react";
import axios from "axios";

const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "http://localhost:3000/api/v1/users/updateMyPassword"
        : "http://localhost:3000/api/v1/users/updateMe";
    const res = await axios({
      method: "PATCH",
      url,
      data,
    });
    if (res.data.status === "success" && type !== "pay") {
      console.log("success", `${type.toUpperCase()} updated successfully!`);
    }
    console.log(res);
    return true;
  } catch (err) {
    console.log("error", err.response.data.message);
    return false;
  }
};

const checkout = async (stripe) => {
  try {
    // 1) get checkout session from API
    const session = await axios(
      `http://localhost:3000/api/v1/orders/checkout-session/`,
    );
    console.log(session);
    // 2) create checkout form
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
  }
};

function Address({ user, setAlert, stripe }) {
  const [add, setAdd] = useState(user.address);

  return (
    <main className="main">
      <script src="https://js.stripe.com/v3/"></script>
      <div className="delivery-container">
        <h2 className="heading-secondary ma-bt-md">Confirm your add</h2>
        <form
          className="form form-delivery"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              (await updateSettings({ add }, "pay")) &&
                (await checkout(stripe));
            } catch (err) {
              setAlert([5000, "error", err]);
            }
          }}
        >
          <div className="form-delivery-text">
            <AddressItem
              input={["Frist Name", "firstName", add.firstName, true]}
              onChange={(e) => {
                add.firstName = e.target.value;
                setAdd(add);
              }}
            />
            <AddressItem
              input={["Last Name", "lastName", add.lastName, true]}
              onChange={(e) => {
                add.lastName = e.target.value;
                setAdd(add);
              }}
            />
            <AddressItem
              input={["Address Line 1", "addLine1", add.addLine1, true]}
              onChange={(e) => {
                add.addLine1 = e.target.value;
                setAdd(add);
              }}
            />
            <AddressItem
              input={["Address Line 2", "addLine2", add.addLine2, false]}
              onChange={(e) => {
                add.addLine2 = e.target.value;
                setAdd(add);
              }}
            />
            <AddressItem
              input={["City", "city", add.city, true]}
              onChange={(e) => {
                add.city = e.target.value;
                setAdd(add);
              }}
            />
            <AddressItem
              input={["State", "state", add.state, true]}
              onChange={(e) => {
                add.state = e.target.value;
                setAdd(add);
              }}
            />
            <AddressItem
              input={["Zip Code", "zipCode", add.zipCode, true]}
              onChange={(e) => {
                add.zipCode = e.target.value;
                setAdd(add);
              }}
            />
          </div>
          <div className="form-delivery-submit">
            <button id="pay" className="btn btn--small btn--green">
              Make the payment
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function AddressItem({ input, onChange }) {
  const [label, varName, defaultText, required] = input;
  return (
    <div className="form__group__delivery">
      <label className="form__label" htmlFor={varName}>
        {label}
      </label>
      <input
        className="form__input"
        type="text"
        id={varName}
        value={defaultText}
        required={required}
        onChange={onChange}
      />
    </div>
  );
}
export default Address;
