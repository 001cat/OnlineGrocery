import { useState } from "react";
import axios from "axios";

function LoginForm({ setAlert }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg"> Log into your account </h2>
        <form
          className="form form--login"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const res = await axios({
                method: "POST",
                url: "http://localhost:3000/api/v1/users/login",
                data: {
                  email,
                  password,
                },
              });
              if (res.data.status === "success") {
                setAlert([5000, "success", "Logged in successfully!"]);
                setTimeout(() => {
                  location.assign("/");
                  // <Navigate to="/" replace={true} />;
                }, 1500);
              }
            } catch (err) {
              setAlert([5000, "error", err.response.data.message]);
            }
          }}
        >
          <div className="form__group">
            <label className="form__label" htmlFor="email">
              Email address
            </label>
            <input
              className="form__input"
              id="email"
              type="email"
              placeholder="you@example.com"
              required="required"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="password">
              Password
            </label>
            <input
              className="form__input"
              id="password"
              type="password"
              placeholder="••••••••"
              required="required"
              minLength="8"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <div className="form__group">
            <button className="btn btn--green">Login</button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default LoginForm;
