'use strict';
import Moonlet from '../../components/moonlets/Moonlet';

const React = require('react');

export default function ProfileInventory(props) {
  const userMoonlets = props.user.moonlets;
  const moonletNodes = [];
  // populate inventory with moonlets that match the user's moonlets
  if (Object.keys(userMoonlets).length > 0) {
    for (let x in userMoonlets) {
      for (let y = 0; y < props.moonlets.length; y++) {
        
        // match the current moonlet id to the URI (which includes the id at the end)
        if (props.moonlets[y].uri.indexOf(x) >= 0) {
          let moonlet = props.moonlets[y];
          moonlet.inventory = userMoonlets[x];

          moonletNodes.push(React.createElement(Moonlet, { moonlet, key: `inv-${x}` }));
        }
      }
    }
  // handle an empty inventory
  } else {
    const emptyElement = React.createElement('p', { className: 'empty-invtentory' }, 'Your inventory is empty!');
    moonletNodes.push(emptyElement);
  }
  return (
    React.createElement('div', { id: 'profile-panel-inventory' },
      React.createElement('h2', { className: 'profile-inventory-header' }, 'Your Moonlets'),
      React.createElement('div', { id: 'moonlet-inventory' }, moonletNodes)
    )
  );
}

ProfileInventory.propTypes = {
  user: React.PropTypes.object.isRequired,
  moonlets: React.PropTypes.array.isRequired,
};
