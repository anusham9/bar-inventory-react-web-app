// Import Statements 
import React, { useState } from 'react';
import '../css/LoginPage.css';

function LoginPage() {
  // username and password are the variables that store input values from the user 
  // setUsername and setPassword are functions used to update the variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Submission handling
  // Function triggered when the user sumbits login credentials
  const handleSubmit = (e) => {
    e.preventDefault();                                 // prevents form from refeshing the page on submit

      // Log username and password to the console
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);

    // Send the username and password to the server
    fetch('http://localhost:8000/login/', {
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
        <button type="submit" className="button">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;