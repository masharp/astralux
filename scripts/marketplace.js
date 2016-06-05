'use strict';

import MarketplaceDisplay from './components/marketplace/MarketplaceDisplay';
import PageFooter from './components/PageFooter';
import LoadingOverlay from './components/LoadingOverlay';

const React = require('react');
const ReactDOM = require('react-dom');
const Request = require('request');

const ASTRALUX_API = 'https://astralux-api.herokuapp.com/api/moonlets';

// server side variables sent with render
const appCredentials = credentials;

class Marketplace extends React.Component {
  constructor(props) {
    super(props);
    this.state = { moonlets: null, categories: null, tree: 0 };
    this.handleTreeClick = this.handleTreeClick.bind(this);
  }
  componentDidMount() {
    const username = this.props.apiCredentials.username;
    const password = this.props.apiCredentials.password;
    const url = this.props.apiURL;
    const self = this;

    function callback(error, response, body) {
      if (error || JSON.parse(body).hasOwnProperty('error')) window.location.href = '/error/455';//window.location.href = '/error';

      const result = JSON.parse(body);
      const featured = self.buildFeatured(result.moonlets);
      const sales = self.buildSales(result.moonlets);
      const classTypes = self.buildTypes(result.moonlets);
      const categories = { sales, featured, classTypes }

      self.setState({ moonlets: result.moonlets, categories });
    }

    Request.get(url, callback).auth(username, password, true);
  }
  /* function that constructs a category out of each moonlet classification */
  buildTypes(moonlets) {
    const currentMoonlets = moonlets;
    const items = {};

    for (let z = 0; z < currentMoonlets.length; z++) {
      const currentClass = currentMoonlets[z].classification;

      // assign an object key with an array that is the current list of the same classification
      if (!items.hasOwnProperty(currentClass)) {
        items[currentClass] = [currentMoonlets[z]];
      }
      else items[currentClass].push(currentMoonlets[z]);
    }

    return items;
  }
  /* function that constructs a 'featured' section of moonlets */
  buildFeatured(moonlets) {
    const currentMoonlets = moonlets;
    const items = [];

    for (let x = 0; x < currentMoonlets.length; x++) {
      if (currentMoonlets[x].limited) items.push(currentMoonlets[x]);
    }

    return items;
  }
  /* function that constructs a 'sales' section of moonlets */
  buildSales(moonlets) {
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
    if (this.state.categories !== null) {
      console.log(this.state.moonlets);
      console.log(this.state.categories);

      return (
        React.createElement('div', { id: 'marketplace-component' },
          React.createElement('div', { id: 'marketplace-header' },
            React.createElement('h1', { className: 'marketplace-title'}, 'Astralux'),
            React.createElement('a', { id: 'marketplace-display-tree', className: 'tree all', href: '', onClick: this.handleTreeClick }, 'All ->')
          ),
          React.createElement(MarketplaceDisplay, { categories: this.state.categories }),
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
//window.onerror = () => window.location.href = '/error/455';

ReactDOM.render(React.createElement(Marketplace, { apiURL: ASTRALUX_API, apiCredentials: appCredentials }),
  document.getElementById('marketplace'));
