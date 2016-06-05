'use strict';
import MoonletItem from '../../components/MoonletItem';

const React = require('react');

export default function MarketplaceClasses(props) {
  return (
    React.createElement('div', { id: 'marketplace-class' }
    )
  );
}

MarketplaceClasses.propTypes = {
  moonlets: React.PropTypes.array,
}
