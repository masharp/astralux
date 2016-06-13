/**
 * Stateful Moonlet React Controller for the main Moonlet route. Displays info
 * on the current moonlet and similar moonlets (weighted towards similar moonlet type)
 * component.
 */

'use strict';

import LoadingOverlay from './components/LoadingOverlay';
import PageFooter from './components/PageFooter';
import SimilarMoonlets from './components/moonlet/SimilarMoonlets';

const React = require('react');
const ReactDOM = require('react-dom');
const Request = require('request');

const LOCAL_URL = 'https://astralux.herokuapp.com/credentials';
const ASTRALUX_API = 'https://astralux-api.herokuapp.com/api';

// server side variables sent with render
const moonletTag = Number(moonletID);
const currentUser = username;

class Moonlet extends React.Component {
  constructor(props) {
    super(props);
    this.state = { moonlet: null, amount: 0, cost: 0, credentials: null };
    this.handleCartClick = this.handleCartClick.bind(this);
    this.handleAmountClick = this.handleAmountClick.bind(this);
  }
  /* upon component loading, call the local server for credentials, then query API
     for data on current moonlet.
   */
  componentDidMount() {
    const localURL = this.props.localURL;
    const url = `${this.props.apiURL}/moonlets/${this.props.moonletID}`;
    const self = this;

    // query local server for API credentials
    Request.get(localURL, (error, response, body) => {
      if (error || body.hasOwnProperty('error')) window.location.href = '/error/455';
      else {
        const credentials = JSON.parse(body);

        function callback(error, response, body) {
          if (error || body.hasOwnProperty('error')) window.location.href = '/error/455';
          else {
            const result = JSON.parse(body);
            // add the featured class property in order to control display
            result.moonlet['featured_class'] = 'hidden';

            // if the item is on sale - calculate the new price based on the discount percentage
            if (result.moonlet.sale) result.moonlet.price = result.moonlet.price * (1 - (1 / result.moonlet.discount));
            // if the item is featured - show the featured message
            if (result.moonlet.featured) result.moonlet.featured_class = '';

            self.setState({ moonlet: result.moonlet, credentials });
          }
        }
        // request data from API
        Request.get(url, callback).auth(credentials.username, credentials.password, true);
      }
    });
  }
  /**
   * click handler for the Moonlet Amount incr/decr. ceiling at 0
   */
  handleAmountClick(event) {
    const target = event.target.classList[0];
    let amountState = this.state.amount;
    let cost = 0;

    if (target === 'amount-increment') amountState++;
    if (target === 'amount-decrement') amountState--;
    if (amountState < 0) amountState = 0;

    cost =  this.state.moonlet.price * amountState;
    this.setState({ amount: amountState, cost });
  }
  /**
   * click handler for adding the moonlet amount to the user's cart.
   * First queries for the user's current cart, combines stored cart with
   * new additions, then updates the user's store.
   */
  handleCartClick(event) {
    const successMsgElement = document.getElementById('cart-success-msg');
    const cartURL = `${this.props.apiURL}/users/cart/${this.props.username}`;
    const userURL = `${this.props.apiURL}/users/${this.props.username}`;
    const self = this;
    const options = { url: cartURL, method: 'PUT', json: { }, };

    /* hide cart success message if open */
    successMsgElement.classList.add('hidden');

    /* check if there is anything to add to cart and user is logged in */
    if (self.state.amount > 0 && this.props.username.length > 0) {

      /* callback for the cart update PUT request */
      function cartCallback(cartError, cartResponse, cartBody) {
        if (cartError || cartBody.hasOwnProperty('error')) console.log(cartError);//window.location.href = '/error/455';
        else successMsgElement.classList.remove('hidden');
      }

      /* callback for the user's GET request */
      function userCallback(userError, userResponse, userBody) {
        if (userError || userBody.hasOwnProperty('error')) console.log(userError);//window.location.href = '/error/455';

        /* obtain the user's current cart */
        const currentCart = JSON.parse(userBody).user.cart.current;

        /* construct a new item for the cart from this moonlet */
        const currentItem = {
          item: self.state.moonlet.id,
          amount: self.state.amount,
          price: self.state.moonlet.price,
        };

        /* check if moonlet is already in cart, if so add current amount to the cart */
        let found = false;
        for (let x = 0; x < currentCart.length; x++) {
          if (Number(currentCart[x].item) === currentItem.item && currentCart[x].price === currentItem.price) {
            currentCart[x].amount += currentItem.amount;
            found = true;
            break;
          }
        }

        /* if moonlet not currently in the cart, add it */
        if (!found) currentCart.push(currentItem);

        /* update the PUT request options with cart JSON */
        options.json = { cart: currentCart };

        /* request a PUT to the current's users cart and update with current addition */
        Request.put(options, cartCallback).auth(self.state.credentials.username, self.state.credentials.password, true);
      }

      // request the current user's cart
      Request.get(userURL, userCallback).auth(self.state.credentials.username, self.state.credentials.password, true);
    }
  }
  render() {
    if (this.state.moonlet !== null) {
      return (
        React.createElement('div', { id: 'moonlet-component' },
          React.createElement('h3', { id: 'cart-success-msg', className: 'hidden' }, 'Item(s) added to cart successfully!'),
          React.createElement('div', { id: 'moonlet-header' },
            React.createElement('h1', { className: 'moonlet-header-name' }, this.state.moonlet.display_name),
            React.createElement('img', { className: 'moonlet-header-img', src: this.state.moonlet.img_src }),
            React.createElement('h2', { className: 'moonlet-header-price' },
              React.createElement('span', { className: 'moonlet-header-pricepoint' }, this.state.moonlet.price),
              ' Credits'
            ),
            React.createElement('h3', { className: `moonlet-header-featured ${this.state.moonlet.featured_class}` }, 'SPECIAL!')
          ),
          React.createElement('div', { id: 'moonlet-info' },
            React.createElement('h2', { className: 'moonlet-info-type' }, 'Classification: ',
              React.createElement('span', { className: 'moonlet-type-class' }, this.state.moonlet.classification)
            ),
            React.createElement('p', { className: 'moonlet-info-desc' }, this.state.moonlet.description),
            React.createElement('p', { className: 'moonlet-info-color' },'Color: ',
              React.createElement('span', { className: 'moonlet-color-point', style: { color: this.state.moonlet.color } },
                this.state.moonlet.color)
            ),
            React.createElement('p', { className: 'moonlet-info-inventory' },'Astralux Inventory: ',
              React.createElement('span', { className: 'moonlet-inventory-point' }, this.state.moonlet.inventory)
            ),
            React.createElement('div', { id: 'moonlet-purchase' },
              React.createElement('div', { id: 'moonlet-amount' },
                React.createElement('a', { className: 'amount-decrement', onClick: this.handleAmountClick }, '-'),
                React.createElement('label', { className: 'amount-label' }, this.state.amount),
                React.createElement('a', { className: 'amount-increment', onClick: this.handleAmountClick }, '+')
              ),
              React.createElement('p', { className: 'moonlet-amount-cost' }, 'Cost: ',
                React.createElement('span', { className: 'moonlet-cost-point' }, this.state.cost)
              ),
              React.createElement('input', { type: 'button', className: 'moonlet-purchase-btn',
                value: 'Add to Cart', onClick: this.handleCartClick })
            )
          ),
          React.createElement(SimilarMoonlets,
            { apiURL: this.props.apiURL, apiCredentials: this.state.credentials,
               moonletType: this.state.moonlet.classification, moonletID: this.props.moonletID }),
          React.createElement(PageFooter, null)
        )
      );
    }
    return (React.createElement(LoadingOverlay, null));
  }
}

Moonlet.propTypes = {
  apiURL: React.PropTypes.string.isRequired,
  localURL: React.PropTypes.string.isRequired,
  moonletID: React.PropTypes.number.isRequired,
  username: React.PropTypes.string,
};

// front end global error handler -> redirect to error page for now
window.onerror = () => window.location.href = '/error/455';

ReactDOM.render(React.createElement(Moonlet, { apiURL: ASTRALUX_API, localURL: LOCAL_URL, moonletID: moonletTag, username: currentUser }),
  document.getElementById('moonlet'));
