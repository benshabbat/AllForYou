import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../slices/authSlice';
import { Redirect } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((data) => {
        localStorage.setItem('token', data.token);
      });
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="pure-form pure-form-stacked">
        <fieldset>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="pure-button pure-button-primary">
            {status === 'loading' ? 'Loading...' : 'Login'}
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;