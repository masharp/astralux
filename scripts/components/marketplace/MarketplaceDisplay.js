'use strict';
import MarketplaceFeatured from './MarketplaceFeatured';
import MarketplaceSales from './MarketplaceSales';
import MarketplaceClasses from './MarketplaceClasses';

const React = require('react');

export default function MarketplaceDisplay(props) {
  function constructClasses(classTypes) {
    const classifications = classTypes;
    const items = [];


    // assign a category number that is index + 3 (0: all, 1: sale, 2: featured)
    let index = 3;

    for (let x in classifications) {
      items.push(
        React.createElement(MarketplaceClasses,
          { moonlets: classTypes[x], title: x, key: `type-${x}`, handleClick: props.handleClick, num: index }
        )
      );
      index++;
    }

    return items;
  }

  const classNodes = constructClasses(props.categories.classTypes);
  return (
    React.createElement('div', { id: 'marketplace-display' },
      React.createElement('div', { id: 'marketplace-classes' }, classNodes),
      React.createElement(MarketplaceSales, { moonlets: props.categories.sales, handleClick: props.handleClick }),
      React.createElement(MarketplaceFeatured, { moonlets: props.categories.featured, handleClick: props.handleClick })
    )
  );
}

MarketplaceDisplay.propTypes = {
  categories: React.PropTypes.object.isRequired,
  handleClick: React.PropTypes.func.isRequired,
}
