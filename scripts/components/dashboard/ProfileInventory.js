/* This is a module that contains a stateless react component, which constructs
 * the user's inventory of moonlets for use in the profile panel of the dashboard */

'use strict';
import MoonletItem from '../../components/MoonletItem';

const React = require('react');

/**
 * Function that takes the user prop and the global moonlets prop and construct a
 * react module for use in the ProfilePanel
 * @param {object} props - user: props.user, global moonlets: props.moonlets
 */
export default function ProfileInventory(props) {
  /**
   * Function that takes the user's moonlet object and constructs a moonlet inventory
   * @param {object} moonlets - object of moonlet inventory
   * @param {array} availableMoonlets - list of moonlets to compare with the user's inventory
   * @return {aray} - array of react components comprising the user's moonlet inventory
   */
  function constructInventory(moonlets, availableMoonlets) {
    const userMoonlets = moonlets;
    const allMoonlets = availableMoonlets;
    const nodes = [];

    // populate inventory with moonlets that match the user's moonlets
    if (Object.keys(userMoonlets).length > 0) {
      for (let x in userMoonlets) {
        for (let y = 0; y < allMoonlets.length; y++) {
          // match the current moonlet id to the URI (which includes the id at the end)
          if (Number(allMoonlets[y].id) === Number(x)) {
            let moonlet = allMoonlets[y];
            moonlet.inventory = userMoonlets[x]; // edit the moonlet object's inventory to reflect the user's inventory

            nodes.push(React.createElement(MoonletItem, { moonlet, key: `inv-${x}` }));
          }
        }
      }
    // handle an empty inventory
    } else {
      const emptyElement = React.createElement('p', { className: 'empty-invtentory' }, 'Your inventory is empty!');
      nodes.push(emptyElement);
    }

    return nodes;
  }

  const moonletNodes = constructInventory(props.user.moonlets, props.moonlets); // construct react components for inventory

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
