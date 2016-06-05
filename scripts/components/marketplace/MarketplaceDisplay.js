'use strict';
import MarketplaceFeatured from './MarketplaceFeatured';
import MarketplaceSales from './MarketplaceSales';
import MarketplaceClasses from './MarketplaceClasses';

const React = require('react');

export default function MarketplaceDisplay(props) {
  function constructClasses(classTypes) {
    console.log(classTypes);
  }

  const classNodes = constructClasses(props.categories.classTypes);

  return (
    React.createElement('div', { id: 'marketplace-display' },
      React.createElement(MarketplaceSales, { moonlets: props.categories.sales }),
      React.createElement(MarketplaceFeatured, { moonlets: props.categories.featured })
    )
  );
}

MarketplaceDisplay.propTypes = {
  categories: React.PropTypes.object.isRequired,
}
