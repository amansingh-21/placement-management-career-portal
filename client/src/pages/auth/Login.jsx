import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);

      const loggedInUser = response.user;

      if (loggedInUser.role === "STUDENT") {
        navigate("/student/dashboard");
      } else if (loggedInUser.role === "RECRUITER") {
        navigate("/recruiter/dashboard");
      } else if (loggedInUser.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/unauthorized");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your email and password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <span className="app-navbar-brand">
            Placement<span>Portal</span>
          </span>
          <h1>Welcome back</h1>
          <p>Sign in to continue to your dashboard.</p>
        </div>

        {error && (
          <div role="alert" className="alert alert-error">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email" className="field-label">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              className="input"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password" className="field-label">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              className="input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading && <span className="btn-spinner" />}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-card-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;