import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // SEARCH
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  // ========================================
  // REFS
  // ========================================

  const accountRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchInputRef = useRef(null);


  // ========================================
  // LOAD USER
  // ========================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem("genlearningUser");

    if (storedUser) {

      try {

        setUser(JSON.parse(storedUser));

      } catch (error) {

        console.error(
          "Invalid stored user:",
          error
        );

        localStorage.removeItem(
          "genlearningUser"
        );

        setUser(null);
      }

    } else {

      setUser(null);

    }

    setAccountOpen(false);
    setMenuOpen(false);

  }, [location.pathname]);


  // ========================================
  // SEARCH INPUT FOCUS
  // ========================================

  useEffect(() => {

    if (searchOpen) {

      setTimeout(() => {

        searchInputRef.current?.focus();

      }, 100);

    }

  }, [searchOpen]);


  // ========================================
  // CLOSE ON OUTSIDE CLICK
  // ========================================

  useEffect(() => {

    const handleOutsideClick = (event) => {

      // ACCOUNT DROPDOWN

      if (
        accountRef.current &&
        !accountRef.current.contains(
          event.target
        )
      ) {

        setAccountOpen(false);

      }


      // MOBILE MENU

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(
          event.target
        )
      ) {

        const menuButton =
          event.target.closest(".menu-btn");

        if (!menuButton) {

          setMenuOpen(false);

        }

      }

    };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, []);


  // ========================================
  // SEARCH OUTSIDE CLICK
  // ========================================

  useEffect(() => {

    const handleSearchOutsideClick = (event) => {

      if (!searchOpen) return;


      const searchBox =
        event.target.closest(
          ".navbar-search-box"
        );


      const searchButton =
        event.target.closest(
          ".search-btn"
        );


      if (!searchBox && !searchButton) {

        setSearchOpen(false);
        setSearchQuery("");

      }

    };


    document.addEventListener(
      "mousedown",
      handleSearchOutsideClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleSearchOutsideClick
      );

    };

  }, [searchOpen]);


  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {

    localStorage.removeItem(
      "genlearningUser"
    );

    localStorage.removeItem(
      "genlearningToken"
    );

    setUser(null);

    setAccountOpen(false);
    setMenuOpen(false);

    navigate("/");

  };


  // ========================================
  // THEME
  // ========================================

  const toggleTheme = () => {

    const currentTheme =
      document.documentElement.getAttribute(
        "data-theme"
      );


    if (currentTheme === "dark") {

      document.documentElement.removeAttribute(
        "data-theme"
      );

      localStorage.setItem(
        "theme",
        "light"
      );

    } else {

      document.documentElement.setAttribute(
        "data-theme",
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );

    }

  };


  // ========================================
  // NAVIGATION CLICK
  // ========================================

  const handleNavClick = () => {

    requestAnimationFrame(() => {

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

    });


    setMenuOpen(false);

  };


  // ========================================
  // SEARCH OPEN
  // ========================================

  const openSearch = () => {

    setAccountOpen(false);
    setMenuOpen(false);

    setSearchOpen(true);

  };


  // ========================================
  // SEARCH CLOSE
  // ========================================

  const closeSearch = () => {

    setSearchOpen(false);
    setSearchQuery("");

  };


  // ========================================
  // NAVIGATION LINKS
  // ========================================

  const navLinks = [

    {
      name: "Home",
      path: "/",
    },

    {
      name: "Courses",
      path: "/courses",
    },

    {
      name: "IT Services",
      path: "/services",
    },

    {
      name: "Projects",
      path: "/projects",
    },

    {
      name: "About",
      path: "/about",
    },

    {
      name: "Contact",
      path: "/contact",
    },

  ];


  // ========================================
  // RENDER
  // ========================================

  return (

    <header className="navbar">

      <div className="navbar-container">


        {/* =================================
            LOGO
        ================================= */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={handleNavClick}
        >

          <img
            src="/logo-optimized.webp"
            alt="GEN Learning"
            className="navbar-logo-image"
            width="169"
            height="55"
          />

        </Link>


        {/* =================================
            DESKTOP NAV
        ================================= */}

        <nav className="desktop-nav">

          {navLinks.map((link) => (

            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `nav-link ${
                  isActive
                    ? "active"
                    : ""
                }`
              }
              onClick={handleNavClick}
            >

              {link.name}

            </NavLink>

          ))}

        </nav>


        {/* =================================
            RIGHT SIDE
        ================================= */}

        <div className="navbar-actions">


          {/* =================================
              THEME
          ================================= */}

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >

            ◐

          </button>


          {/* =================================
              SEARCH
          ================================= */}

          <button
            type="button"
            className="search-btn"
            aria-label="Search"
            onClick={openSearch}
          >

            ⌕

          </button>


          {/* =================================
              LOGGED OUT
          ================================= */}

          {!user ? (

            <>

              <Link
                to="/login"
                className="login-btn"
              >

                Login

              </Link>


              <Link
                to="/register"
                className="join-btn"
              >

                Join Now

                <span className="join-arrow">
                  →
                </span>

              </Link>

            </>

          ) : (

            /* =================================
               LOGGED IN ACCOUNT
            ================================= */

            <div
              className="navbar-account"
              ref={accountRef}
            >

              <button
                type="button"
                className="navbar-account-btn"
                onClick={() =>
                  setAccountOpen(
                    (previous) =>
                      !previous
                  )
                }
                aria-expanded={accountOpen}
                aria-haspopup="true"
              >

                <span className="navbar-account-avatar">

                  {user.name
                    ? user.name
                        .charAt(0)
                        .toUpperCase()
                    : "G"}

                </span>


                <span className="navbar-account-name">

                  {user.name ||
                    "Account"}

                </span>


                <span className="navbar-account-arrow">

                  ↓

                </span>

              </button>


              {/* =================================
                  ACCOUNT DROPDOWN
              ================================= */}

              {accountOpen && (

                <div className="navbar-account-menu">


                  <div className="navbar-account-header">

                    <span className="navbar-account-avatar large">

                      {user.name
                        ? user.name
                            .charAt(0)
                            .toUpperCase()
                        : "G"}

                    </span>


                    <div>

                      <strong>

                        {user.name ||
                          "User"}

                      </strong>


                      <span>

                        {user.email || ""}

                      </span>

                    </div>

                  </div>


                  <div className="navbar-account-divider" />


                  {/* DASHBOARD */}

                  <Link
                    to="/dashboard"
                    onClick={() => {

                      setAccountOpen(false);
                      handleNavClick();

                    }}
                  >

                    <span>
                      01
                    </span>

                    Dashboard

                  </Link>


                  {/* MY BOOKINGS */}

                  <Link
                    to="/my-bookings"
                    onClick={() => {

                      setAccountOpen(false);
                      handleNavClick();

                    }}
                  >

                    <span>
                      02
                    </span>

                    My Bookings

                  </Link>


                  {/* PROFILE */}

                  <Link
                    to="/profile"
                    onClick={() => {

                      setAccountOpen(false);
                      handleNavClick();

                    }}
                  >

                    <span>
                      03
                    </span>

                    Profile

                  </Link>


                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={handleLogout}
                  >

                    <span>
                      04
                    </span>

                    Logout

                  </button>


                </div>

              )}

            </div>

          )}


          {/* =================================
              MOBILE MENU BUTTON
          ================================= */}

          <button
            type="button"
            className={`menu-btn ${
              menuOpen
                ? "open"
                : ""
            }`}
            onClick={() =>
              setMenuOpen(
                (previous) =>
                  !previous
              )
            }
            aria-label="Menu"
            aria-expanded={menuOpen}
          >

            <span />
            <span />
            <span />

          </button>


        </div>

      </div>


      {/* =================================
          MOBILE NAV
      ================================= */}

      <nav
        ref={mobileMenuRef}
        className={`mobile-nav ${
          menuOpen
            ? "open"
            : ""
        }`}
      >


        {navLinks.map((link) => (

          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `mobile-link ${
                isActive
                  ? "active"
                  : ""
              }`
            }
            onClick={() =>
              handleNavClick()
            }
          >

            {link.name}

          </NavLink>

        ))}


        {!user && (

          <Link
            to="/register"
            className="mobile-join-btn"
            onClick={() => {

              setMenuOpen(false);
              handleNavClick();

            }}
          >

            Join Now →

          </Link>

        )}


        {user && (

          <>

            <Link
              to="/dashboard"
              className="mobile-link"
              onClick={() =>
                handleNavClick()
              }
            >

              Dashboard

            </Link>


            {/* MY BOOKINGS */}

            <Link
              to="/my-bookings"
              className="mobile-link"
              onClick={() =>
                handleNavClick()
              }
            >

              My Bookings

            </Link>


            <Link
              to="/profile"
              className="mobile-link"
              onClick={() =>
                handleNavClick()
              }
            >

              Profile

            </Link>


            <button
              type="button"
              className="mobile-logout-btn"
              onClick={handleLogout}
            >

              Logout

            </button>

          </>

        )}

      </nav>


      {/* =================================
          SEARCH OVERLAY
      ================================= */}

      {searchOpen && (

        <div
          className="navbar-search-overlay"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              closeSearch();

            }

          }}
        >

          <div className="navbar-search-box">


            {/* SEARCH INPUT */}

            <div className="navbar-search-input-wrap">

              <span className="navbar-search-icon">
                ⌕
              </span>


              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Search GEN Learning..."
                autoComplete="off"
              />


              <button
                type="button"
                className="navbar-search-close"
                onClick={closeSearch}
                aria-label="Close search"
              >

                ×

              </button>

            </div>


            {/* SEARCH HINT */}

            <div className="navbar-search-hint">

              Press{" "}

              <strong>
                ESC
              </strong>

              {" "}to close

            </div>


          </div>

        </div>

      )}

    </header>

  );

};


export default Navbar;