/* This is a module that contains a stateless React component, which constructs
  a list of MoonletItem components comprising all featured moonlets */

'use strict';

import MoonletItem from '../../components/MoonletItem';

const React = require('react');

export default function MarketplaceFeatured(props) {
  /**
   * Function that takes the list of featured moonlets and generates list
   * of MoonletItem components
   * @param {array} moonlets - array of featured moonlets
   * @return {array} - array of react components
   */
  function constructMoonlets(moonlets) {
    const featuredMoonlets = moonlets;
    const nodes = [];

    for (let x = 0; x < featuredMoonlets.length; x++) {
      // construct a moonletItem from this moonlet and give it a key
      nodes.push(React.createElement(MoonletItem, { moonlet: featuredMoonlets[x], key: `featuredMoonlet-${x}`}));
    }

    return nodes;
  }

  const moonletNodes = constructMoonlets(props.moonlets);

  return (
    React.createElement('div', { id: 'marketplace-class-2', className: 'marketplace-category' },
    // header-1 hardcoded for future selection when clicked
      React.createElement('h2', { className: 'marketplace-cat-title header-2 featured', onClick: props.handleClick }, 'Featured'),
      React.createElement('div', { id: 'marketplace-featured-moonlets' }, moonletNodes)
    )
  );
}

MarketplaceFeatured.propTypes = {
  handleClick: React.PropTypes.func.isRequired,
  moonlets: React.PropTypes.array,
}
