import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  const [changingPassword, setChangingPassword] =
    useState(false);

  // ========================================
  // LOAD PROFILE
  // ========================================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token =
        localStorage.getItem("genlearningToken");

      if (!token) {
        setError("Authentication required.");
        return;
      }

      const response = await fetch(
        "https://genlearning.in/api/auth/me",
        {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load profile."
        );
      }

      setUser(data.user);

      setFormData({
        name: data.user.name || "",
        email: data.user.email || "",
      });

    } catch (error) {
      console.error(
        "Profile fetch error:",
        error
      );

      setError(
        error.message ||
          "Unable to load profile."
      );
    }
  };


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

      const token =
        localStorage.getItem("genlearningToken");

      const response = await fetch(
        "https://genlearning.in/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update profile."
        );
      }

      setUser(data.user);

      localStorage.setItem(
        "genlearningUser",
        JSON.stringify(data.user)
      );

      setMessage(
        "Profile updated successfully."
      );

    } catch (error) {

      console.error(
        "Profile update error:",
        error
      );

      setError(
        error.message ||
          "Unable to update profile."
      );

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
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setError(
        "New passwords do not match."
      );

      return;
    }

    if (
      passwordData.newPassword.length < 6
    ) {
      setError(
        "New password must be at least 6 characters."
      );

      return;
    }

    try {

      setChangingPassword(true);

      const token =
        localStorage.getItem("genlearningToken");

      const response = await fetch(
        "https://genlearning.in/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword:
              passwordData.currentPassword,

            newPassword:
              passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to change password."
        );
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage(
        "Password changed successfully."
      );

    } catch (error) {

      console.error(
        "Password change error:",
        error
      );

      setError(
        error.message ||
          "Unable to change password."
      );

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


  return (
    <main className="profile-page">

      <section className="profile-header">

        <div className="profile-container">

          <span className="section-eyebrow">
            ACCOUNT
          </span>

          <h1>
            Your <span>profile.</span>
          </h1>

          <p>
            Manage your account information and
            password.
          </p>

        </div>

      </section>


      <section className="profile-main">

        <div className="profile-container">

          {message && (
            <div className="profile-success">
              {message}
            </div>
          )}

          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}


          <div className="profile-grid">

            {/* PROFILE INFORMATION */}

            <div className="profile-card">

              <div className="profile-card-heading">

                <span className="section-eyebrow">
                  PERSONAL INFORMATION
                </span>

                <h2>
                  Account details
                </h2>

              </div>


              <form
                className="profile-form"
                onSubmit={
                  handleProfileSubmit
                }
              >

                <div className="profile-form-group">

                  <label htmlFor="name">
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="profile-form-group">

                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    readOnly
                  />

                  <small>
                    Email address cannot be changed.
                  </small>

                </div>


                <div className="profile-form-group">

                  <label>
                    Account Role
                  </label>

                  <input
                    type="text"
                    value={
                      user?.role || "student"
                    }
                    readOnly
                  />

                </div>


                <button
                  type="submit"
                  className="profile-submit"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}

                  <span>→</span>
                </button>

              </form>

            </div>


            {/* PASSWORD */}

            <div className="profile-card">

              <div className="profile-card-heading">

                <span className="section-eyebrow">
                  SECURITY
                </span>

                <h2>
                  Change password
                </h2>

              </div>


              <form
                className="profile-form"
                onSubmit={
                  handlePasswordSubmit
                }
              >

                <div className="profile-form-group">

                  <label htmlFor="currentPassword">
                    Current Password
                  </label>

                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={
                      passwordData.currentPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    required
                  />

                </div>


                <div className="profile-form-group">

                  <label htmlFor="newPassword">
                    New Password
                  </label>

                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={
                      passwordData.newPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
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
                    value={
                      passwordData.confirmPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    required
                  />

                </div>


                <button
                  type="submit"
                  className="profile-submit"
                  disabled={
                    changingPassword
                  }
                >
                  {changingPassword
                    ? "Changing..."
                    : "Change Password"}

                  <span>→</span>
                </button>

              </form>

            </div>

          </div>


          <Link
            to="/dashboard"
            className="profile-back"
          >
            ← Back to Dashboard
          </Link>

        </div>

      </section>

    </main>
  );
};

export default Profile;