'use strict';

import PageFooter from './components/PageFooter';
import LoadingOverlay from './components/LoadingOverlay';
import MoonletItem from './components/MoonletItem';

const React = require('react');
const ReactDOM = require('react-dom');
const Request = require('request');

const ASTRALUX_API = 'https://astralux-api.herokuapp.com/api/moonlets';

// server side variables sent with render
const appCredentials = credentials;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { moonlets: null };
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.constructFeatured = this.constructFeatured.bind(this);
  }
  componentDidMount() {
    const username = this.props.apiCredentials.username;
    const password = this.props.apiCredentials.password;
    const url = this.props.apiURL;
    const self = this;

    function callback(error, response, body) {
      const content = JSON.parse(body);
      if (error) window.location.href = '/error';

      self.setState({ moonlets: content.moonlets });
    }

    Request.get(url, callback).auth(username, password, true);
  }
  handleButtonClick() {
    window.location.href = '/login';
  }
  constructFeatured() {
    const moonlets = this.state.moonlets;
    console.log(moonlets);
    const nodes = [];
    const found = [];

    /* check if any current moonlets are of limited quanitity */
    for (let x = 0; x < moonlets.length; x++) {
      if (nodes.length === 3) return nodes;
      if (moonlets[x].limited) {
        found.push(moonlets[x].id);
        nodes.push(React.createElement(MoonletItem, { moonlet: moonlets[x], key: `featured-${x}` }));
      }
    }

    /* if not enough to feature, pick others */
    for (let y = 0; y < moonlets.length; y++) {
      if (nodes.length === 3) return nodes;
      if (found.indexOf(moonlets[y].id) < 0) {
        found.push(moonlets[y].id);
        nodes.push(React.createElement(MoonletItem, { moonlet: moonlets[y], key: `featured-${y}` }));
      }
    }

    return nodes;
  }
  render() {
    if (this.state.moonlets !== null) {
      const featuredNodes = this.constructFeatured();

      return (
        React.createElement('div', { id: 'home-component' },
          React.createElement('div', { id: 'home-header' },
            React.createElement('img', { src: '/assets/home.png', id: 'home-img' }),
            React.createElement('div', { id: 'home-copy' },
              React.createElement('h1', { className: 'copy-header' }, 'Astralux Industries'),
              React.createElement('p', { className: 'copy' },
                'Brave space explorers have discovered Moonlets in the far reaches of the galaxy! ' +
                'The United Nations Galactic Agency has commissioned Astralux to sell rights to these ' +
                'countless wonders in hopes to fund colonization efforts. Stake your claim and grab your ' +
                'moonlet today!'
              ),
              React.createElement('input', { type: 'button', className: 'home-btn',
                value: 'Sign Up', onClick: this.handleButtonClick }),
              React.createElement('input', { type: 'button', className: 'home-btn',
                value: 'Login', onClick: this.handleButtonClick })
            )
          ),
          React.createElement('h1', { className: 'featured-header'}, 'Today\'s Featured Moonlets'),
          React.createElement('div', { id: 'home-featured' }, featuredNodes),
          React.createElement(PageFooter, null)
        )
      );
    }
    return (React.createElement(LoadingOverlay, null));
  }
}

Home.propTypes = {
  apiURL: React.PropTypes.string.isRequired,
  apiCredentials: React.PropTypes.object.isRequired,
};

// front end global error handler -> redirect to error page for now
window.onerror = () => window.location.href = '/error';

ReactDOM.render(React.createElement(Home, { apiURL: ASTRALUX_API, apiCredentials: appCredentials }),
  document.getElementById('home'));
