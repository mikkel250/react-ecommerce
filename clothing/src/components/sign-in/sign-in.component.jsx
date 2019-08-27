import React from 'react';

import './sign-in.styles.scss';

class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    }
  }

  render() {
    return (
      <div className="sign-in">
        <h2>I already have an account</h2>
        <span>Sign in with email and password</span>
        
        <form action="">
          <input type="email" name="email" value="email" />
          <input type="password" name="password" value="password" />
        </form>
      </div>
    )
  }


}