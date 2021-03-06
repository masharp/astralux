/* Stateful React Component that controls the login view. Allows a user to
 * authenticate via Facebook and Twitter OAuth. */

'use strict';

import PageFooter from './components/PageFooter';
const React = require('react');
const ReactDOM = require('react-dom');
const Request = require('request');

const ASTRALUX_API = 'https://astralux-api.herokuapp.com/api/users';
const LOCAL_URL = 'https://astralux.herokuapp.com/credentials';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
    this.handleLogin = this.handleLogin.bind(this);
  }
  /**
   * Based on what is clicked, trigger authenitcation route call for platform
   */
  handleLogin(event) {
    const target = event.target.id;

    if (target === 'login-twitter') location.href = '/auth/twitter', 'twitter-auth-window';
    else if (target === 'login-facebook') location.href = '/auth/facebook', 'facebook-auth-window';
  }
  render() {
    return (
      React.createElement('div', { id: 'login-component' },
        React.createElement('div', { id: 'login-header' },
          React.createElement('img', { src: '/assets/login-alien.png' }),
          React.createElement('h2', { className: 'login-header-text' }, 'Login  |  Sign Up'),
          React.createElement('h3', null, 'Connect with: '),
          React.createElement('div', { id: 'login-facebook', className: 'login-btn', onClick: this.handleLogin },
            React.createElement('i', { className: 'fa fa-facebook'}),
            React.createElement('span', { className: 'login-btn-text'}, 'Facebook')
          ),
          React.createElement('br', null),
          React.createElement('div', { id: 'login-twitter', className: 'login-btn', onClick: this.handleLogin },
            React.createElement('i', { className: 'fa fa-twitter'}),
            React.createElement('span', { className: 'login-btn-text'}, 'Twitter')
          )
        ),
        React.createElement(PageFooter, null)
      )
    );
  }
}

Login.propTypes = {
  apiURL: React.PropTypes.string.isRequired,
  localURL: React.PropTypes.string.isRequired,
};

// front end global error handler -> redirect to error page for now
window.onerror = () => window.location.href = '/error/455';

ReactDOM.render(React.createElement(Login, { apiURL: ASTRALUX_API, localURL: LOCAL_URL }),
  document.getElementById('login'));
