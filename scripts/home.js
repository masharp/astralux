'use strict';

import PageFooter from './components/PageFooter';
import LoadingOverlay from './components/LoadingOverlay';
import MoonletItem from './components/MoonletItem';

const React = require('react');
const ReactDOM = require('react-dom');
const Request = require('request');

const ASTRALUX_API = 'https://astralux-api.herokuapp.com/api/moonlets';
const LOCAL_URL = 'https://astralux.herokuapp.com/credentials';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { moonlets: null };
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.constructFeatured = this.constructFeatured.bind(this);
  }
  componentDidMount() {
    const url = this.props.apiURL;
    const localURL = this.props.localURL;
    const self = this;

    // query local server for API credentials
    Request.get(localURL, (error, response, body) => {
      if (error) window.location.href = '/error/455';
      const credentials = JSON.parse(body);

      function callback(error, response, body) {
        if (error || body.hasOwnProperty('error')) window.location.href = '/error/455';
        else {
          const content = JSON.parse(body).moonlets;
          self.setState({ moonlets: content });
        }
      }

      // request data from API
      Request.get(url, callback).auth(credentials.username, credentials.password, true);
    });

  }
  handleButtonClick() {
    window.location.href = '/login';
  }
  constructFeatured() {
    const moonlets = this.state.moonlets;
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
  localURL: React.PropTypes.string.isRequired,
};

// front end global error handler -> redirect to error page for now
window.onerror = () => window.location.href = '/error/455';

ReactDOM.render(React.createElement(Home, { apiURL: ASTRALUX_API, localURL: LOCAL_URL }), document.getElementById('home'));
