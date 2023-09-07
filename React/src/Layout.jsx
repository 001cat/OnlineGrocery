import { Link, Outlet } from "react-router-dom";
import axios from "axios";

function Layout({ user, alert, setAlert }) {
  return (
    <>
      <Alert alert={alert} setAlert={setAlert} />
      <Header user={user} setAlert={setAlert} />
      <Outlet />
      <Footer />
    </>
  );
}

function Alert({ alert, setAlert }) {
  const [timeout, type, msg] = alert;
  if (timeout > 0) {
    setTimeout(() => setAlert([0, "error", ""]), timeout);
    return <div className={`alert alert--${type}`}>{msg}</div>;
  }
  return <></>;
}

function Header({ user, setAlert }) {
  return (
    <header className="header">
      <nav className="nav nav--tours">
        <Link className="nav__el" to="/">
          Grocery Home
        </Link>
      </nav>
      <div className="header__logo">
        <svg className="header__logo">
          <use href="/icons.svg#icon-sunrise" />
        </svg>
      </div>
      <nav className="nav nav--user">
        {user ? (
          <>
            <Link className="nav__el" to="/my-cart">
              <svg className="card__icon">
                <use href="/icons.svg#icon-shopping-cart" />
              </svg>
            </Link>
            <a
              className="nav__el nav__el--logout"
              onClick={async () => {
                try {
                  const res = await axios({
                    method: "GET",
                    url: "http://localhost:3000/api/v1/users/logout",
                  });
                  if (res.data.status === "success") {
                    location.reload(true);
                    // redirect("/");
                    // <Navigate to="/" replace={true} />; //location.reload(true);
                  }
                } catch (err) {
                  setAlert([5000, "error", "Error logging out! Try again."]);
                }
              }}
            >
              Log out
            </a>
            <Link className="nav__el" to="/me">
              <img
                className="nav__user-img"
                src={`/img/photos/${user.photo}`}
                alt={`Photo of ${user.name}`}
              ></img>
            </Link>
          </>
        ) : (
          <>
            <Link className="nav__el" to="/login">
              Log in
            </Link>
            <Link className="nav__el nav__el--cta" to="/preparing">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__logo">
        <svg className="header_logo">
          <use href="/icons.svg#icon-sunrise" />
        </svg>
      </div>
      <ul className="footer__nav">
        <li>
          <a href="/preparing"> About us</a>
        </li>
        <li>
          <a href="/preparing"> Download apps</a>
        </li>
        <li>
          <a href="/preparing"> Careers</a>
        </li>
        <li>
          <a href="/preparing"> Contact</a>
        </li>
      </ul>
      <p className="footer__copyright">
        {" "}
        &copy; by Mengyu Wu. Demo of an online grocery store.
      </p>
    </footer>
  );
}

export default Layout;
