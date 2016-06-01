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

class Marketplace extends React.Component {
  constructor(props) {
    super(props);
    this.state = { moonlets: null };
    this.handleTreeClick = this.handleTreeClick.bind(this);
    this.constructSales = this.constructSales.bind(this);
    this.constructFeatured = this.constructFeatured.bind(this);
  }
  componentDidMount() {
    const username = this.props.apiCredentials.username;
    const password = this.props.apiCredentials.password;
    const url = this.props.apiURL;
    const self = this;

    function callback(error, response, body) {
      const result = JSON.parse(body);
      if (error) console.log(error);//window.location.href = '/error';

      self.setState({ moonlets: result });
    }

    Request.get(url, callback).auth(username, password, true);
  }
  constructSales() {

  }
  constructFeatured() {

  }
  handleTreeClick() {

  }
  render() {
    console.log(this.state.moonlets);
    if (this.state.moonlets !== null) {
      const featuredNodes = this.constructFeatured();
      const saleNodes = this.constructSales();

      return (
        React.createElement('div', { id: 'marketplace-component' },
          React.createElement('div', { id: 'marketplace-header' },
            React.createElement('h2', { className: 'marketplace-title'}, 'Astralux Marketplace'),
            React.createElement('a', { id: 'marketplace-display-tree', className: 'tree all', href: '' }, 'All ->')
          ),
          React.createElement('div', { id: 'marketplace-featured' },
            React.createElement('h3', { className: 'marketplace-featured-header' }, 'Featured')
          ),
          React.createElement('div', { id: 'marketplace-sales' },
            React.createElement('h3', { className: 'marketplace-sales-header' }, 'Sales')
          ),
          React.createElement(PageFooter, null)
        )
      );
    }
    return (React.createElement(LoadingOverlay, null));
  }
}

Marketplace.propTypes = {
  apiURL: React.PropTypes.string.isRequired,
  apiCredentials: React.PropTypes.object.isRequired,
};

// front end global error handler -> redirect to error page for now
//window.onerror = () => window.location.href = '/error';

ReactDOM.render(React.createElement(Marketplace, { apiURL: ASTRALUX_API, apiCredentials: appCredentials }),
  document.getElementById('marketplace'));
