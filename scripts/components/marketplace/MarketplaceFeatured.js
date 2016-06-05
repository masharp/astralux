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
    React.createElement('div', { id: 'marketplace-class-2', className: 'marketplace-category' },
      React.createElement('h2', { className: 'marketplace-cat-title header-2 featured', onClick: props.handleClick }, 'Featured'),
      React.createElement('div', { id: 'marketplace-featured-moonlets' }, moonletNodes)
    )
  );
}

MarketplaceFeatured.propTypes = {
  handleClick: React.PropTypes.func.isRequired,
  moonlets: React.PropTypes.array,
}
