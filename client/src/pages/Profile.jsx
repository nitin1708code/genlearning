import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { InView } from "../components/motion-primitives/in-view";

const API_URL = "https://api.genlearning.in";

const readApiResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      `API returned a non-JSON response (HTTP ${response.status}). Check backend deployment and API route.`
    );
  }

  return response.json();
};

const Profile = () => {
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // ========================================
  // LOAD PROFILE
  // ========================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("genlearningToken");

        if (!token) {
          setError("Authentication required. Please log in again.");
          return;
        }

        const response = await fetch(`${API_URL}/api/auth/me`, {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await readApiResponse(response);

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load profile.");
        }

        setUser(data.user);

        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
        });
      } catch (error) {
        console.error("Profile fetch error:", error);
        setError(error.message || "Unable to load profile.");
      }
    };

    fetchProfile();
  }, []);

  // ========================================
  // PROFILE INPUT
  // ========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // ========================================
  // PASSWORD INPUT
  // ========================================

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // ========================================
  // UPDATE PROFILE
  // ========================================

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("genlearningToken");

      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
        }),
      });

      const data = await readApiResponse(response);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile.");
      }

      if (!data.user) {
        throw new Error("Profile updated, but user data was not returned.");
      }

      setUser(data.user);

      setFormData({
        name: data.user.name || "",
        email: data.user.email || "",
      });

      localStorage.setItem("genlearningUser", JSON.stringify(data.user));

      setMessage(data.message || "Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);
      setError(error.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // CHANGE PASSWORD
  // ========================================

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      setError("New passwords do not match.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (
      passwordData.currentPassword === passwordData.newPassword
    ) {
      setError("New password must differ from current password.");
      return;
    }

    try {
      setChangingPassword(true);

      const token = localStorage.getItem("genlearningToken");

      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const response = await fetch(
        `${API_URL}/api/auth/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
            confirmPassword: passwordData.confirmPassword,
          }),
        }
      );

      const data = await readApiResponse(response);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to change password.");
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage(data.message || "Password changed successfully.");
    } catch (error) {
      console.error("Password change error:", error);
      setError(error.message || "Unable to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (!user && !error) {
    return (
      <main className="profile-page">
        <div className="profile-container">
          <p>Loading profile...</p>
        </div>
      </main>
    );
  }

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <main className="profile-page">
      {/* HEADER */}

      <section className="profile-header">
        <div className="profile-container">
          <InView
            variants={{
              hidden: {
                opacity: 0,
                y: 30,
                filter: "blur(4px)",
              },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              },
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
            viewOptions={{
              margin: "0px 0px -80px 0px",
            }}
          >
            <span className="section-eyebrow">ACCOUNT</span>

            <h1>
              Your <span>profile.</span>
            </h1>

            <p>Manage your account information and password.</p>
          </InView>
        </div>
      </section>

      {/* MAIN */}

      <section className="profile-main">
        <div className="profile-container">
          {/* SUCCESS MESSAGE */}

          {message && (
            <InView
              className="profile-success"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{
                duration: 0.7,
                ease: "easeInOut",
              }}
            >
              {message}
            </InView>
          )}

          {/* ERROR MESSAGE */}

          {error && (
            <InView
              className="profile-error"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{
                duration: 0.7,
                ease: "easeInOut",
              }}
            >
              {error}
            </InView>
          )}

          <div className="profile-grid">
            {/* PROFILE INFORMATION */}

            <InView
              className="profile-card"
              variants={{
                hidden: {
                  opacity: 0,
                  x: -35,
                  scale: 0.97,
                  filter: "blur(4px)",
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  filter: "blur(0px)",
                },
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -80px 0px",
              }}
            >
              <div className="profile-card-heading">
                <span className="section-eyebrow">
                  PERSONAL INFORMATION
                </span>

                <h2>Account details</h2>
              </div>

              <form
                className="profile-form"
                onSubmit={handleProfileSubmit}
              >
                <div className="profile-form-group">
                  <label htmlFor="name">Full Name</label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="email">Email Address</label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    readOnly
                  />

                  <small>Email address cannot be changed.</small>
                </div>

                <div className="profile-form-group">
                  <label htmlFor="role">Account Role</label>

                  <input
                    id="role"
                    type="text"
                    value={user?.role || "student"}
                    readOnly
                  />
                </div>

                <button
                  type="submit"
                  className="profile-submit"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                  <span>→</span>
                </button>
              </form>
            </InView>

            {/* CHANGE PASSWORD */}

            <InView
              className="profile-card"
              variants={{
                hidden: {
                  opacity: 0,
                  x: 35,
                  scale: 0.97,
                  filter: "blur(4px)",
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  filter: "blur(0px)",
                },
              }}
              transition={{
                duration: 1,
                delay: 0.15,
                ease: "easeInOut",
              }}
              viewOptions={{
                margin: "0px 0px -80px 0px",
              }}
            >
              <div className="profile-card-heading">
                <span className="section-eyebrow">SECURITY</span>

                <h2>Change password</h2>
              </div>

              <form
                className="profile-form"
                onSubmit={handlePasswordSubmit}
              >
                <div className="profile-form-group">
                  <label htmlFor="currentPassword">
                    Current Password
                  </label>

                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="newPassword">New Password</label>

                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="confirmPassword">
                    Confirm New Password
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="profile-submit"
                  disabled={changingPassword}
                >
                  {changingPassword
                    ? "Changing..."
                    : "Change Password"}
                  <span>→</span>
                </button>
              </form>
            </InView>
          </div>

          {/* BACK TO DASHBOARD */}

          <InView
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
            viewOptions={{
              margin: "0px 0px -60px 0px",
            }}
          >
            <Link to="/dashboard" className="profile-back">
              ← Back to Dashboard
            </Link>
          </InView>
        </div>
      </section>
    </main>
  );
};

export default Profile;