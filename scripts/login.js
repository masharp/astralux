'use strict';

import PageFooter from './components/PageFooter';
const React = require('react');
const ReactDOM = require('react-dom');
const Request = require('request');

const ASTRALUX_API = 'https://astralux-api.herokuapp.com/api/v1.0/users';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }
  componentDidMount() {
  }
  handleButtonClick(event) {
  }
  render() {
    return (
      React.createElement('div', { id: 'login-component' },
        React.createElement('div', { id: 'login-header' },
          React.createElement('img', { src: '/assets/login-alien.png' }),
          React.createElement('h2', { className: 'login-header-text' }, 'Login  |  Sign Up'),
          React.createElement('h3', null, 'Connect with: '),
          React.createElement('div', { id: 'login-facebook', className: 'login-btn' },
            React.createElement('i', { className: 'fa fa-facebook'}),
            React.createElement('span', { className: 'login-btn-text'}, 'Facebook')
          ),
          React.createElement('br', null),
          React.createElement('div', { id: 'login-google', className: 'login-btn' },
            React.createElement('i', { className: 'fa fa-google'}),
            React.createElement('span', { className: 'login-btn-text'}, 'Google')
          ),
          React.createElement('br', null),
          React.createElement('div', { id: 'login-twitter', className: 'login-btn' },
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
  apiCredentials: React.PropTypes.object.isRequired,
};

// front end global error handler -> redirect to error page for now
//window.onerror = () => window.location.href = '/error';

ReactDOM.render(React.createElement(Login, { apiURL: ASTRALUX_API, apiCredentials: credentials }),
  document.getElementById('login'));