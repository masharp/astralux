'use strict';

import PageFooter from './components/PageFooter';

const React = require('react');
const ReactDOM = require('react-dom');
const Request = require('request');

const ASTRALUX_API = 'astralux-api.herokuapp.com/api/v1.0/moonlets';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { featured: null };
  }
  componentDidMount() {
    const username = this.props.apiCredentials.username;
    const password = this.props.apiCredentials.password;
    const url = `http://${username}:${password}@${this.props.apiURL}`;

    Request({ url }, (error, response, body) => {
      console.log(response);
      console.log(body);
    });
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
          React.createElement('div', { id: 'home-featured' }),
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
