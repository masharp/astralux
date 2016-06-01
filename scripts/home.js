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
    this.state = { featured: null };
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }
  componentDidMount() {
    const username = this.props.apiCredentials.username;
    const password = this.props.apiCredentials.password;
    const url = this.props.apiURL;
    const self = this;

    function callback(error, response, body) {
      const content = JSON.parse(body);
      if (error || !content.moonlets) window.location.href = '/error';

      const featured = content.moonlets.slice(0, 3);
      self.setState({ featured });
    }

    Request.get(url, callback).auth(username, password, true);
  }
  handleButtonClick() {
    window.location.href = '/login';
  }
  render() {
    if (this.state.featured !== null) {
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
          React.createElement('div', { id: 'home-featured' },
            React.createElement(MoonletItem, { moonlet: this.state.featured[0] }),
            React.createElement(MoonletItem, { moonlet: this.state.featured[1] }),
            React.createElement(MoonletItem, { moonlet: this.state.featured[2] })
          ),
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
