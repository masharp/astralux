'use strict';
import Moonlet from '../../components/moonlets/Moonlet';

const React = require('react');

const tempMoonlet = {
  classification: "AA-Zeus",
  color: "Grey",
  description: "A newly discovered moonlet!",
  discount: 10,
  display_name: "Special-K",
  img_src: "/assets/moonlets/generic.png",
  inventory: 100,
  limited: false,
  on_sale: false,
  price: 1000,
  uri: "https://astralux-api.herokuapp.com/api/v1.0/moonlets/520200"
}

export default function ProfileInventory(props) {
  return (
    React.createElement('div', { id: 'profile-panel-inventory' },
      React.createElement('h2', { className: 'profile-inventory-header' }, 'Your Moonlets'),
      React.createElement('div', { id: 'moonlet-inventory' },
        React.createElement(Moonlet, { moonlet: tempMoonlet }),
        React.createElement(Moonlet, { moonlet: tempMoonlet }),
        React.createElement(Moonlet, { moonlet: tempMoonlet })
      )
    )
  );
}

ProfileInventory.propTypes = {
  moonlets: React.PropTypes.object.isRequired
};
