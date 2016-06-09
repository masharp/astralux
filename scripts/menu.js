'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Request = require('request');

const ASTRALUX_API = 'https://astralux-api.herokuapp.com/api/users';
const LOCAL_URL = 'http://localhost:3000/credentials';

/* capture sever-sent globabl variable */
const currentUser = username;

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null, credentials: null, size: 0, balance: 0 };

    this.beginServerQuery = this.beginServerQuery.bind(this);
  }
  componentDidMount() {
    const localURL = this.props.localURL;
    const self = this;

    Request.get(localURL, (error, response, body) => {
      if (error || body.hasOwnProperty('error')) window.location.href = '/error/455';
      else {
        const credentials = JSON.parse(body);

        self.setState({ credentials });
        /* load initial state and query every 3 seconds thereafter if authenticated user */
        if (this.props.username.length > 0) self.beginServerQuery();
      }
    });
  }
  /* Function that updates the menu bar with the current user's profile state.
   * calls itself every 5 seconds and checks if the current stored state has changed.
   * updates as necessary
   * NOTE: Disabled due to poor performance. Explore other options.
   */
  beginServerQuery() {
    const credentials = this.state.credentials;
    const url = `${this.props.apiURL}/${this.props.username}`;
    const self = this;

    function queryCallback(error, response, body) {
      if (error || body.hasOwnProperty('error')) window.location.href = '/error/455';
      else {
        const updatedState = JSON.parse(body).user;
        const size = updatedState.cart.current.length; // pull out cart size
        const balance = updatedState.balance; // pull out user's balance

        self.setState({ user: updatedState, balance, size });

        setTimeout(self.beginServerQuery, 5000);
      }
    }
    Request.get(url, queryCallback).auth(credentials.username, credentials.password, true);
  }
  handleButtonClick() {
  }
  render() {

    return (
      React.createElement('div', { id: 'menu-bar' },
        React.createElement('a', { className: 'navlink', href: '/' },
          React.createElement('img', { className: 'menu-brand', src: '/assets/brand.png' })
        ),
        React.createElement('div', { id: 'link-nav' },
          React.createElement('a', { className: 'navlink menu-marketplace', href: '/marketplace'}, 'Marketplace'),
          React.createElement('a', { className: 'menu-logout navlink hidden', href: '/' }, 'Logout'),
          React.createElement('span', { className: 'navlink menu-balance hidden'}, 'Balance: ',
            React.createElement('span', { className: 'balance-amount-point' }, this.state.balance)
          ),
          React.createElement('a', { id: 'menu-cart', className: 'navlink hidden', href: `/cart/${this.props.username}` },
            React.createElement('i', { className: 'fa fa-shopping-cart' }),
            React.createElement('span', { id: 'menu-cart-updater' }, ` ${this.state.size} `)
          ),
          React.createElement('a', { className: 'menu-account navlink hidden', href: `/dashboard/${this.props.username}` }, 'Dashboard'),
          React.createElement('a', { className: 'navlink menu-login', href: '/login' }, 'Login')
        )
      )
    );
  }
}

Menu.propTypes = {
  apiURL: React.PropTypes.string.isRequired,
  localURL: React.PropTypes.string.isRequired,
  username: React.PropTypes.string
};

// front end global error handler -> redirect to error page for now
// window.onerror = () => window.location.href = '/error/455';

ReactDOM.render(React.createElement(Menu, { apiURL: ASTRALUX_API, localURL: LOCAL_URL, username: currentUser }),
  document.getElementById('menu'));
