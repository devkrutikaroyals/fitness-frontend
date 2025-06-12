import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import './auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member'
  });
    const [loading, setLoading] = useState(false); // 🔥 FIXED
  

  const { register, error, message, clearErrors, clearMessage } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearErrors();
    if (message) clearMessage();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await register(formData);
      if (!result.success) {
        return;
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Register</h1>
        {message && <div className="auth-message">{message}</div>}
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={onSubmit} className="auth-form">
          <label>Name</label>
          <input name="name" value={name} onChange={onChange} required />
          
          <label>Email</label>
          <input type="email" name="email" value={email} onChange={onChange} required />
          
          <label>Password</label>
          <input 
            type="password" 
            name="password" 
            value={password} 
            onChange={onChange} 
            required 
            minLength={6} 
          />
          
          <label>Role</label>
          <select name="role" value={role} onChange={onChange}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Register'}
          </button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;