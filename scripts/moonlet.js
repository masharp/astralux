'use strict';

import LoadingOverlay from './components/LoadingOverlay';
import PageFooter from './components/PageFooter';
import SimilarMoonlets from './components/moonlet/SimilarMoonlets';

const React = require('react');
const ReactDOM = require('react-dom');
const Request = require('request');

const ASTRALUX_API = 'https://astralux-api.herokuapp.com/api';
// server side variables sent with render
const appCredentials = credentials;
const moonletTag = Number(moonletID);

class Moonlet extends React.Component {
  constructor(props) {
    super(props);
    this.state = { moonlet: null, amount: 0, cost: 0 };
    this.handleCartClick = this.handleCartClick.bind(this);
    this.handleAmountClick = this.handleAmountClick.bind(this);
  }
  componentDidMount() {
    const username = this.props.apiCredentials.username;
    const password = this.props.apiCredentials.password;
    const url = `${this.props.apiURL}/moonlets/${this.props.moonletID}`;
    const self = this;

    function callback(error, response, body) {
      if (error) window.location.href = '/error';
      const result = JSON.parse(body);

      // add the featured class property in order to control display
      result.moonlet['featured_class'] = 'hidden';

      // if the item is on sale - calculate the new price based on the discount percentage
      if (result.moonlet.sale) result.moonlet.price = result.moonlet.price * (1 - (1 / result.moonlet.discount));
      // if the item is featured - show the featured message
      if (result.moonlet.featured) result.moonlet.featured_class = '';

      self.setState({ moonlet: result.moonlet });
    }

    Request.get(url, callback).auth(username, password, true);
  }
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
  handleCartClick(event) {
    console.log(this.state.cost);

  }
  render() {
    if (this.state.moonlet !== null) {
      return (
        React.createElement('div', { id: 'moonlet-component' },
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
            { apiURL: this.props.apiURL, apiCredentials: this.props.apiCredentials,
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
  apiCredentials: React.PropTypes.object.isRequired,
  moonletID: React.PropTypes.number.isRequired,
};

// front end global error handler -> redirect to error page for now
// window.onerror = () => window.location.href = '/error';

ReactDOM.render(React.createElement(Moonlet, { apiURL: ASTRALUX_API, apiCredentials: appCredentials, moonletID: moonletTag }),
  document.getElementById('moonlet'));
