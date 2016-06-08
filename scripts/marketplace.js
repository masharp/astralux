/* Stateful React Component that controls the marketplace view. Displays a list
 * of all moonlets currently on sale, divided by subcategories - unique class,
 * sale, and featured. Also includes click event handlers for narrowing the view
 * by category. Passes down all handlers and state to stateless child components */

'use strict';

import MarketplaceDisplay from './components/marketplace/MarketplaceDisplay';
import PageFooter from './components/PageFooter';
import LoadingOverlay from './components/LoadingOverlay';

const React = require('react');
const ReactDOM = require('react-dom');
const Request = require('request');

const ASTRALUX_API = 'https://astralux-api.herokuapp.com/api/moonlets';
const LOCAL_URL = 'https://astralux.herokuapp.com/credentials';

class Marketplace extends React.Component {
  constructor(props) {
    super(props);
    this.state = { moonlets: null, categories: null };

    // bind functions to 'this'
    this.handleTreeClick = this.handleTreeClick.bind(this);
    this.handleCategoryClick = this.handleCategoryClick.bind(this);
  }
  componentDidMount() {
    const url = this.props.apiURL;
    const localURL = this.props.localURL;
    const self = this;

    // query local server for API credentials
    Request.get(localURL, (error, response, body) => {
      if (error || body.hasOwnProperty('error')) window.location.href = '/error/455';
      const credentials = JSON.parse(body);

      function callback(error, response, body) {
        if (error || body.hasOwnProperty('error')) window.location.href = '/error/455';
        else {
          const result = JSON.parse(body);

          const featured = self.buildFeatured(result.moonlets); // extract the featured moonlets
          const sales = self.buildSales(result.moonlets); // extract the moonlets on sale
          const classTypes = self.buildTypes(result.moonlets); // seperate moonlets by classification
          const categories = { sales, featured, classTypes }

          self.setState({ moonlets: result.moonlets, categories });
        }
      }

      Request.get(url, callback).auth(credentials.username, credentials.password, true);
    });
  }
  /**
   * Function that takes all current moonlets and parses them into an object
   * containing classification keys and an array of moonlets that match that class
   * @param {array} moonlets - array of all moonlets
   * @return {object} - object containg each class and an array of moonlets in that class
   */
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
  /**
   * Function that takes all current moonlets and parses them into list of featured
   * moonlet objects
   * @param {array} moonlets - array of all moonlets
   * @return {array} - array of featured moonlets
   */
  buildFeatured(moonlets) {
    const currentMoonlets = moonlets;
    const items = [];

    for (let x = 0; x < currentMoonlets.length; x++) {
      if (currentMoonlets[x].limited) items.push(currentMoonlets[x]);
    }

    return items;
  }
  /**
   * Function that takes all current moonlets and parses them in moonlet's that
   * are on sale
   * @param {array} moonlets - array of all moonlets
   * @return {array} - array of moonlet objects on sale
   */
  buildSales(moonlets) {
    const currentMoonlets = moonlets;
    const items = [];

    for (let y = 0; y < currentMoonlets.length; y++) {
      if (currentMoonlets[y].on_sale) items.push(currentMoonlets[y]);
    }

    return items;
  }
  /**
   * Function that handles the tree being clicked and then updates the UI based
   * on which part of the tree is clicked. uses the categoryClick by creating
   * a new event as the header-all element
   */
  handleTreeClick(event) {
    const newEvent = { target: document.getElementById('marketplace-header-all') };
    this.handleCategoryClick(newEvent);
  }
  /**
   * Function that handles a category being clicked. Narrows the view to just that
   * category. If the marketplace title is clicked, returns view to All. Also
   * updates the tree display
   */
  handleCategoryClick(event) {
    /* pull out the current target element ID and all category divs */
    const target = Number(event.target.classList[1].split('-')[1]);
    const categoryElements = document.getElementsByClassName('marketplace-category');

    /* call a function on each DOM element and hide what isn't the category click */
    Array.prototype.map.call(categoryElements, (element, index) => {
      const currentID = element.getAttribute('id');
      const currentTarget = Number(currentID.split('-')[2]);
      const currentElement = document.getElementById(currentID);

      if (target === 0) currentElement.classList.remove('hidden'); // if page header clicked - display all
      if (currentTarget !== target && target !== 0) currentElement.classList.add('hidden'); // else hide all but clicked header
    });

    /* update the directory tree text display with category div being viewed */
    const treeElement = document.getElementById('marketplace-display-tree');
    const categoryTitle = event.target.classList[2]; // extract category clicked
    // check if tree has a currently displayed category
    const treeContainsSub = treeElement.contains(document.getElementById('tree-sub'));

    if (target === 0 && treeContainsSub) { // if header clicked, change tree to root
      treeElement.removeChild(document.getElementById('tree-sub'));
    } else if (target === 0 && !treeContainsSub) return; // if already at root
    else if (target !== 0 && treeContainsSub) return; // if current category already displayed
    // else append tree with new category
    else {
      let newSubTree = document.createElement('span');
      newSubTree.appendChild(document.createTextNode(` ${categoryTitle}`));
      newSubTree.classList.add('tree');
      newSubTree.setAttribute('id', 'tree-sub');
      treeElement.appendChild(newSubTree);
    }
  }
  render() {
    if (this.state.categories !== null) {
      return (
        React.createElement('div', { id: 'marketplace-component' },
          React.createElement('div', { id: 'marketplace-header' },
            React.createElement('h1', { id: 'marketplace-header-all', className: 'marketplace-title header-0',
              onClick: this.handleCategoryClick }, 'Astralux'),
            React.createElement('span', { className: 'marketplace-click-info' }, 'Click Title to Narrow Results'),
            React.createElement('div', { id: 'marketplace-display-tree' },
              React.createElement('span', { className: 'tree all', onClick: this.handleTreeClick }, 'All ',
                React.createElement('span', { className: 'fa fa-arrow-right' })
              )
            )
          ),
          React.createElement(MarketplaceDisplay, { categories: this.state.categories,
              handleClick: this.handleCategoryClick }),
          React.createElement(PageFooter, null)
        )
      );
    }
    return (React.createElement(LoadingOverlay, null));
  }
}

Marketplace.propTypes = {
  apiURL: React.PropTypes.string.isRequired,
  localURL: React.PropTypes.string.isRequired,
};

// front end global error handler -> redirect to error page for now
//window.onerror = () => window.location.href = '/error/455';

ReactDOM.render(React.createElement(Marketplace, { apiURL: ASTRALUX_API, localURL: LOCAL_URL }),
  document.getElementById('marketplace'));
