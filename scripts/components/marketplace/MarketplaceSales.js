'use strict';
import MoonletItem from '../../components/MoonletItem';

const React = require('react');

export default function MarketplaceSales(props) {
  function constructMoonlets(moonlets) {
    const saleMoonlets = moonlets;
    const nodes = [];

    for (let x = 0; x < saleMoonlets.length; x++) {
      nodes.push(React.createElement(MoonletItem, { moonlet: saleMoonlets[x], key: `saleMoonlet-${x}`}));
    }

    return nodes;
  }

  const moonletNodes = constructMoonlets(props.moonlets);

  return (
    React.createElement('div', { id: 'marketplace-sales' },
      React.createElement('h1', { className: 'marketplace-sales-title' }, 'On Sale'),
      React.createElement('div', { id: 'marketplace-sales-moonlets' }, moonletNodes)
    )
  );
}

MarketplaceSales.propTypes = {
  moonlets: React.PropTypes.array,
}
