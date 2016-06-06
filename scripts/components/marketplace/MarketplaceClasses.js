/* This is a module that contains a stateless React component, which constructs
  a list of MoonletItem components comprising all moonlets under a unique classification */

'use strict';

import MoonletItem from '../../components/MoonletItem';

const React = require('react');

export default function MarketplaceClasses(props) {
  /**
   * Function that takes the list of moonlets in a unique class and generates list
   * of MoonletItem components
   * @param {array} moonlets - array of moonlets in this classification
   * @return {array} - array of react components
   */
  function constructMoonlets(moonlets) {
    const currentMoonlets = moonlets;
    const items = [];

    for(let x = 0; x < currentMoonlets.length; x++) {
      // construct a moonletItem from this moonlet and give it a key
      items.push(React.createElement(MoonletItem, { moonlet: currentMoonlets[x], key: `classMoonlet-${x}` }));
    }

    return items;
  }

  const moonletNodes = constructMoonlets(props.moonlets);

  return (
    React.createElement('div', { id: `marketplace-class-${props.num}`, className: 'marketplace-category' },
      // header-num allows for future selection when clicked (always larger than 2)
      React.createElement('h2', { className: `marketplace-cat-title header-${props.num} ${props.title}`,
        onClick: props.handleClick }, props.title),
      React.createElement('div', { className: 'marketplace-class-moonlet' }, moonletNodes)
    )
  );
}

MarketplaceClasses.propTypes = {
  handleClick: React.PropTypes.func.isRequired,
  num: React.PropTypes.number.isRequired,
  moonlets: React.PropTypes.array,
  title: React.PropTypes.string,
}
