import React, { useState } from "react";

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Email: ${email}`);
    // Implement the password reset functionality here
  };

  return (
    <div id="password-reset-container">
      <h1>Reset Password</h1>
      <form id="password-reset-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email address:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <button type="submit">Reset my password</button>
      </form>
      <p>
        <a href="sign-in.html">Return to Sign In</a>
      </p>
    </div>
  );
};

export default ResetPasswordForm;
