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
    React.createElement('div', { id: 'marketplace-class-1', className: 'marketplace-category' },
      React.createElement('h2', { className: 'marketplace-cat-title header-1 sales', onClick: props.handleClick }, 'Sales'),
      React.createElement('div', { id: 'marketplace-sales-moonlets' }, moonletNodes)
    )
  );
}

MarketplaceSales.propTypes = {
  handleClick: React.PropTypes.func.isRequired,
  moonlets: React.PropTypes.array,
}
