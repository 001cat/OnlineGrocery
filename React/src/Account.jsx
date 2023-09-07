import { useState } from "react";
import axios from "axios";

const updateSettings = async (data, type) => {
  try {
    console.log(data);
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
      return [5000, "success", `${type.toUpperCase()} updated successfully!`];
    }
    console.log(res);
  } catch (err) {
    return [5000, "error", err.response.data.message];
  }
};

function Account({ user, setAlert }) {
  if (!user) return null;
  return (
    <main className="main">
      <div className="user-view">
        <Nav user={user} />
        <Content user={user} setAlert={setAlert} />
      </div>
    </main>
  );
}

function Nav({ user }) {
  return (
    <nav className="user-view__menu">
      <ul className="side-nav">
        <NavItem
          link={"/me"}
          text={"Profiles"}
          icon={"settings"}
          active={true}
        />
        <NavItem
          link={"/my-orders"}
          text={"My orders"}
          icon={"briefcase"}
          active={false}
        />
      </ul>
      {user.role === "admin" ? <AdminNav /> : null}
    </nav>
  );
}

function Content({ user, setAlert }) {
  return (
    <div className="user-view__content">
      <Setting user={user} setAlert={setAlert} />
      <div className="line">&nbsp;</div>
      <Password user={user} setAlert={setAlert} />
    </div>
  );
}

function Setting({ user, setAlert }) {
  const [userName, setUserName] = useState(user.name);
  const [userEmail, setUserEmail] = useState(user.email);
  const [userPhoto, setUserPhoto] = useState(user.photo);
  const [userPhotoUrl, setUserPhotoUrl] = useState(`/img/photos/${user.photo}`);
  return (
    <div className="user-view__form-container">
      <h2 className="heading-secondary ma-bt-md">Your account settings</h2>
      <form
        className="form form-user-data"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = new FormData();
          form.append("name", userName);
          form.append("email", userEmail);
          form.append("photo", userPhoto);
          setAlert(await updateSettings(form, "data"));
        }}
      >
        <div className="form__group">
          <label className="form__label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="form__input"
            type="text"
            value={userName}
            required
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
        </div>
        <div className="form__group ma-bt-md">
          <label className="form__label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            className="form__input"
            type="email"
            value={userEmail}
            required
            onChange={(e) => {
              setUserEmail(e.target.value);
            }}
          />
        </div>
        <div className="form__group form__photo-upload">
          <img
            className="form__user-photo"
            src={userPhotoUrl}
            alt="User photo"
          />

          <input
            name="photo"
            id="photo"
            className="form__upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              setUserPhoto(e.target.files[0]);
              setUserPhotoUrl(URL.createObjectURL(e.target.files[0]));
            }}
          />
          <label htmlFor="photo">Choose new photo</label>
        </div>
        <div className="form__group right">
          <button className="btn btn--small btn--green">Save settings</button>
        </div>
      </form>
    </div>
  );
}

function Password({ setAlert }) {
  const [inUpdating, setinUpdating] = useState(false);
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setConfirmPassword] = useState("");
  return (
    <div className="user-view__form-container">
      <h2 className="heading-secondary ma-bt-md">Password change</h2>
      <form
        className="form form-user-password"
        onSubmit={async (e) => {
          e.preventDefault();
          setinUpdating(true);
          setAlert(
            await updateSettings(
              {
                passwordCurrent,
                password,
                passwordConfirm,
              },
              "password",
            ),
          );
          setinUpdating(false);
        }}
      >
        <div className="form__group">
          <label className="form__label" htmlFor="password-current">
            Current password
          </label>
          <input
            className="form__input"
            id="password-current"
            type="password"
            placeholder="••••••••"
            required
            minLength="8"
            onChange={(e) => {
              setPasswordCurrent(e.target.value);
            }}
          />
        </div>
        <div className="form__group">
          <label className="form__label" htmlFor="password">
            New password
          </label>
          <input
            className="form__input"
            id="password"
            type="password"
            placeholder="••••••••"
            required
            minLength="8"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="form__group ma-bt-lg">
          <label className="form__label" htmlFor="password-confirm">
            Confirm password
          </label>
          <input
            className="form__input"
            id="password-confirm"
            type="password"
            placeholder="••••••••"
            required
            minLength="8"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </div>
        <div className="form__group right">
          <button className="btn btn--small btn--green btn--save-password">
            {inUpdating ? "Updating..." : "Save password"}
          </button>
        </div>
      </form>
    </div>
  );
}

function AdminNav() {
  return (
    <div className="admin-nav">
      <h5 className="admin-nav__heading">Admin</h5>
      <ul className="side-nav">
        <NavItem link="#" text="Manage product" icon="target" active={false} />
        <NavItem link="#" text="Manage users" icon="users" active={false} />
        <NavItem
          link="#"
          text="Manage orders"
          icon="briefcase"
          active={false}
        />
      </ul>
    </div>
  );
}
function NavItem({ link, text, icon, active }) {
  return (
    <li className={`${active ? "side-nav--active" : ""}`}>
      <a href={`${link}`}>
        <svg>
          <use href={`/icons.svg#icon-${icon}`} />
          {/* <use xlinkHref={`img/icons.svg#icon-${icon}`} /> */}
        </svg>
        {text}
      </a>
    </li>
  );
}

export default Account;
