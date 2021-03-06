import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../logo.png';
import './Login.css';
import { firebaseUI, uiConfig } from '../../config'

class Login extends Component {
  componentDidMount() {
    console.log("Starting Firebase UI!")
    firebaseUI.start('#firebaseui-auth-container', uiConfig);
  }
  render() {
    return (
      <section
        id="page-splash"
        ref={splashPage => (this.splashPage = splashPage)}
      >
        <img
          src={logo}
          alt="This is the logo"
          style={{ width: 150 + 'px', height: 150 + 'px' }}
        />
        <h3
          className="fp-logo"
          style={{
            margin: 10 + 'px',
            paddingLeft: 10 + 'px',
            paddingRight: 10 + 'px',
            textAlign: 'center',
          }}
        >
          Welcome to Sunday School Lessons
          </h3>
        <div className="fp-caption">
          Singing in the Shadow of the Wings of God
          </div>
        <div>
          <div id="firebaseui-auth-container" />
          <Link className="fp-skip" to="/home">
            skip sign in
            </Link>
        </div>
      </section>
    );
  }
}

export default Login;
