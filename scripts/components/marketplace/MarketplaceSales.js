/* This is a module that contains a stateless React component, which constructs
  a list of MoonletItem components comprising all moonlets currently on sale */

'use strict';

import MoonletItem from '../../components/MoonletItem';

const React = require('react');

export default function MarketplaceSales(props) {
  /**
   * Function that takes the list of moonlets on sale and generates list
   * of MoonletItem components
   * @param {array} moonlets - array of moonlets on sale
   * @return {array} - array of react components
   */
  function constructMoonlets(moonlets) {
    const saleMoonlets = moonlets;
    const nodes = [];

    for (let x = 0; x < saleMoonlets.length; x++) {
      // construct a moonletItem from this moonlet and give it a key
      nodes.push(React.createElement(MoonletItem, { moonlet: saleMoonlets[x], key: `saleMoonlet-${x}`}));
    }

    return nodes;
  }

  const moonletNodes = constructMoonlets(props.moonlets);

  return (
    React.createElement('div', { id: 'marketplace-class-1', className: 'marketplace-category' },
      // header-1 hardcoded for future selection when clicked
      React.createElement('h2', { className: 'marketplace-cat-title header-1 sales', onClick: props.handleClick }, 'Sales'),
      React.createElement('div', { id: 'marketplace-sales-moonlets' }, moonletNodes)
    )
  );
}

MarketplaceSales.propTypes = {
  handleClick: React.PropTypes.func.isRequired,
  moonlets: React.PropTypes.array,
}
