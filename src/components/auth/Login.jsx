import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import './auth.css';
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false); // 🔥 FIXED
  const { login, error, message, clearErrors, clearMessage } = useContext(AuthContext);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearErrors();
    if (message) clearMessage();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Start loading
    try {
      const result = await login(formData);
      if (!result.success) return;
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="form-title">Welcome Back 👋</h2>
        <p className="form-subtitle">Please login to your account</p>

        {message && <div className="form-message">{message}</div>}
        {error && <div className="form-error">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="form-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};
export default Login;