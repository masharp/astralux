'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Request = require('request');

const ASTRALUX_API = 'https://astralux-api.herokuapp.com/api/v1.0';

// server side variables sent with render
const appCredentials = credentials;

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
  }
  componentDidMount() {
    const username = this.props.apiCredentials.username;
    const password = this.props.apiCredentials.password;
    const userURL = `${this.props.apiURL}/users/${this.props.username}`;
    const self = this;

    function userCallback(userError, userResponse, userBody) {
      if (userError) window.location.href = '/error';
      const user = JSON.parse(userBody).user;
      self.setState({ user });
    }
    // request info on this user
    if (this.props.username !== null) {
      // Request.get(userURL, userCallback).auth(username, password, true);
    }
  }
  handleButtonClick() {
  }
  render() {
    return (
      React.createElement('div', { id: 'menu-bar' },
        React.createElement('a', { className: 'navlink', href: '/' },
          React.createElement('img', { className: 'brand-img', src: '/assets/brand.png' })
        ),
        React.createElement('div', { id: 'link-nav' },
          React.createElement('a', { className: 'navlink hidden', href: '' }, 'Logout'),
          React.createElement('a', { className: 'navlink login', href: '/login' }, 'Login'),
          React.createElement('a', { className: 'navdrop navlink hidden', href: '' }, 'Menu')
        )
      )
    );
  }
}

Menu.propTypes = {
  apiURL: React.PropTypes.string.isRequired,
  apiCredentials: React.PropTypes.object.isRequired,
};

// front end global error handler -> redirect to error page for now
// window.onerror = () => window.location.href = '/error';

ReactDOM.render(React.createElement(Menu, { apiURL: ASTRALUX_API, apiCredentials: appCredentials }),
  document.getElementById('menu'));
