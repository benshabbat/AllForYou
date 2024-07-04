import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../slices/authSlice';
import { Redirect } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="pure-form pure-form-stacked">
        <fieldset>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            {status === 'loading' ? 'Loading...' : 'Register'}
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default Register;