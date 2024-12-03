import React, { useState, FormEvent } from 'react';
import '../css/LoginPage.css';

const LoginPage: React.FC = () => {
  // Define state with types
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Submission handling
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault(); // Prevents form from refreshing the page on submit

    // Log username and password to the console
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);

    // Send the username and password to the server
    fetch('inventory/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message); // Successful login
        } else {
          alert(data.error); // Display error message
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="container">
      <h1 className="header">Bar Stocker</h1>
      <form onSubmit={handleSubmit} className="form">
        {/* Username Section */}
        <div className="form-group">
          <label className="label">Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            required
          />
        </div>

        {/* Password Section */}
        <div className="form-group">
          <label className="label">Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
        </div>

        {/* Login Button */}
        <button type="submit" className="button">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;