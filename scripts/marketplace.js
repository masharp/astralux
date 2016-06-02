'use strict';

import MarketplaceFeatured from './components/marketplace/MarketplaceFeatured';
import MarketplaceSales from './components/marketplace/MarketplaceSales';
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
    this.state = { moonlets: null, featured: null, sales: null };
    this.handleTreeClick = this.handleTreeClick.bind(this);
    this.constructFeatured = this.constructFeatured.bind(this);
    this.constructSales = this.constructSales.bind(this);
  }
  componentDidMount() {
    const username = this.props.apiCredentials.username;
    const password = this.props.apiCredentials.password;
    const url = this.props.apiURL;
    const self = this;

    function callback(error, response, body) {
      const result = JSON.parse(body);
      if (error) console.log(error);//window.location.href = '/error';

      const featured = self.constructFeatured(result.moonlets);
      const sales = self.constructSales(result.moonlets);

      self.setState({ moonlets: result.moonlets, featured, sales });
    }

    Request.get(url, callback).auth(username, password, true);
  }
  constructFeatured(moonlets) {
    const currentMoonlets = moonlets;
    const items = [];

    for (let x = 0; x < currentMoonlets.length; x++) {
      if (currentMoonlets[x].limited) items.push(currentMoonlets[x]);
    }

    return items;
  }
  constructSales(moonlets) {
    const currentMoonlets = moonlets;
    const items = [];

    for (let y = 0; y < currentMoonlets.length; y++) {
      if (currentMoonlets[y].on_sale) items.push(currentMoonlets[y]);
    }

    return items;
  }
  handleTreeClick() {

  }
  render() {
    console.log(this.state.moonlets);
    if (this.state.moonlets !== null) {

      return (
        React.createElement('div', { id: 'marketplace-component' },
          React.createElement('div', { id: 'marketplace-header' },
            React.createElement('h1', { className: 'marketplace-title'}, 'Astralux'),
            React.createElement('a', { id: 'marketplace-display-tree', className: 'tree all', href: '' }, 'All ->')
          ),
          React.createElement(MarketplaceFeatured, { moonlets: this.state.featured }),
          React.createElement(MarketplaceSales, { moonlets: this.state.sales }),
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
