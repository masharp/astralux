/* This is a module that contains a stateless React component, which constructs
  a list all of the different list displays of moonlet types. Includes unique
  classifications, sales, and featured. */

'use strict';

import MarketplaceFeatured from './MarketplaceFeatured';
import MarketplaceSales from './MarketplaceSales';
import MarketplaceClasses from './MarketplaceClasses';

const React = require('react');

export default function MarketplaceDisplay(props) {
  /**
   * Function creates an array of MarketplaceCLasses components, which are
   * a list of moonlets in a unique classification type
   * @param {object} classTypes - object containing keys for each unique class - each key
   * is an array of moonlets in that class
   * @return {array} - array of react components
   */
  function constructClasses(classTypes) {
    const classifications = classTypes;
    const items = [];

    // assign a category number that is index + 3 (0: all, 1: sale, 2: featured)
    let index = 3;

    for (let x in classifications) {
      items.push(
        React.createElement(MarketplaceClasses,
          { moonlets: classTypes[x], title: x, key: `type-${x}`, handleClick: props.handleClick, num: index } // num allows for assignment in the child component
        )
      );
      index++;
    }

    return items;
  }

  const classNodes = constructClasses(props.categories.classTypes);

  return (
    React.createElement('div', { id: 'marketplace-display' },
      React.createElement(MarketplaceSales, { moonlets: props.categories.sales, handleClick: props.handleClick }),
      React.createElement(MarketplaceFeatured, { moonlets: props.categories.featured, handleClick: props.handleClick }),
      React.createElement('div', { id: 'marketplace-classes' }, classNodes)
    )
  );
}

MarketplaceDisplay.propTypes = {
  categories: React.PropTypes.object.isRequired,
  handleClick: React.PropTypes.func.isRequired,
}
