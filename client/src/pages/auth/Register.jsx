import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
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
      const response = await register(formData);
      const registeredUser = response.user;

      if (registeredUser.role === "STUDENT") {
        navigate("/student/dashboard");
      } else if (registeredUser.role === "RECRUITER") {
        navigate("/recruiter/dashboard");
      } else {
        navigate("/unauthorized");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please check your details and try again.";

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
          <h1>Create your account</h1>
          <p>Get started with your placement journey.</p>
        </div>

        {error && (
          <div role="alert" className="alert alert-error">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name" className="field-label">
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              className="input"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

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

          <div className="field">
            <label htmlFor="role" className="field-label">
              Register as
            </label>

            <select
              id="role"
              name="role"
              className="select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="STUDENT">Student</option>
              <option value="RECRUITER">Recruiter</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading && <span className="btn-spinner" />}
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-card-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;