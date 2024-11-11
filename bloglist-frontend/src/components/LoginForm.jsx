const LoginForm = ({ onSubmit, onUsernameChange, onPasswordChange, username, password }) => (
  <form onSubmit={onSubmit}>
    <div>
    <h2>Log in to application</h2>
      username
        <input data-testid='username'
          type="text"
          value={username}
          name="Username"
          onChange={onUsernameChange}
      />
    </div>
    <div>
      password
        <input data-testid='password'
          type="password"
          value={password}
          name="Password"
          onChange={onPasswordChange}
      />
    </div>
    <button type="submit">login</button>
  </form> 
  )
  
  export default LoginForm