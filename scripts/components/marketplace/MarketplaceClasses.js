'use strict';
import MoonletItem from '../../components/MoonletItem';

const React = require('react');

export default function MarketplaceClasses(props) {
  function constructMoonlets(moonlets) {
    const currentMoonlets = moonlets;
    const items = [];

    for(let x = 0; x < currentMoonlets.length; x++) {
      items.push(React.createElement(MoonletItem, { moonlet: currentMoonlets[x], key: `classMoonlet-${x}` }));
    }

    return items;
  }

  const moonletNodes = constructMoonlets(props.moonlets);

  return (
    React.createElement('div', { id: `marketplace-class-${props.num}`, className: 'marketplace-category' },
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
