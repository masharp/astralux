'use strict';
import MoonletItem from '../../components/MoonletItem';

const React = require('react');

export default function MarketplaceFeatured(props) {
  function constructMoonlets(moonlets) {
    const featuredMoonlets = moonlets;
    const nodes = [];

    for (let x = 0; x < featuredMoonlets.length; x++) {
      nodes.push(React.createElement(MoonletItem, { moonlet: featuredMoonlets[x], key: `featuredMoonlet-${x}`}));
    }

    return nodes;
  }

  const moonletNodes = constructMoonlets(props.moonlets);

  return (
    React.createElement('div', { id: 'marketplace-featured' },
      React.createElement('h1', { className: 'marketplace-featured-title' }, 'Featured'),
      React.createElement('div', { id: 'marketplace-featured-moonlets' }, moonletNodes)
    )
  );
}

MarketplaceFeatured.propTypes = {
  moonlets: React.PropTypes.array
}
