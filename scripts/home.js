'use strict';

import PageFooter from './components/PageFooter';
import Moonlet from './components/moonlets/Moonlet'
const React = require('react');
const ReactDOM = require('react-dom');
const Request = require('request');

const ASTRALUX_API = 'http://astralux-api.herokuapp.com/api/v1.0/moonlets';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { featured: null };
  }
  componentDidMount() {
    const username = this.props.apiCredentials.username;
    const password = this.props.apiCredentials.password;
    const url = this.props.apiURL;
    const options = {
      url,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description'
      }
    };
    const self = this;

    function callback(error, response, body) {
      const content = JSON.parse(body);
      if (error || !content.moonlets) window.location.href = '/error';

      const featured = content.moonlets.slice(0, 3);
      self.setState({ featured });
    }

    Request.get(options, callback).auth(username, password, true);
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
              )
            )
          ),
          React.createElement('div', { id: 'home-featured' },
            React.createElement(Moonlet, { moonlet: this.state.featured[0] }),
            React.createElement(Moonlet, { moonlet: this.state.featured[1] }),
            React.createElement(Moonlet, { moonlet: this.state.featured[2] })
          ),
          React.createElement(PageFooter, null)
        )
      );
    }
    return (React.createElement('div', null));
  }
}

Home.propTypes = {
  apiURL: React.PropTypes.string.isRequired,
  apiCredentials: React.PropTypes.object.isRequired,
};

// front end global error handler -> redirect to error page for now
//window.onerror = () => window.location.href = '/error';

ReactDOM.render(React.createElement(Home, { apiURL: ASTRALUX_API, apiCredentials: credentials }),
  document.getElementById('home'));
