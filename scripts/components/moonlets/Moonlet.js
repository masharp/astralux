/**
 * Module that exports the reusable Moonlet element
 *
 * @return {object} Component's React element
 */
const React = require('react');

export default function Moonlet(props) {
  function handleClick() {
    const moonletID = props.moonlet.uri.split('/').pop();
    window.location.href = `/moonlet/${moonletID}/${props.moonlet.display_name}`;
  }
  return (
    React.createElement('div', { className: 'moonlet-display', onClick: handleClick },
      React.createElement('h2', { className: 'moonlet-display-name' }, props.moonlet.display_name),
      React.createElement('h3', { className: 'moonlet-display-class' }, `Type: ${props.moonlet.classification}`),
      React.createElement('img', { className: 'moonlet-display-img', src: props.moonlet.img_src }),
      React.createElement('p', { className: 'moonlet-display-desc' }, props.moonlet.description),
      React.createElement('p', { className: 'moonlet-display-price' }, `Price: ${props.moonlet.price}`),
      React.createElement('p', { className: 'moonlet-display-color' }, 'Color: ',
        React.createElement('span', { style: { color: `${props.moonlet.color}` } }, props.moonlet.color)
      ),
      React.createElement('p', { className: 'moonlet-display-inv' }, `Inventory: ${props.moonlet.inventory}`),
      React.createElement('input', { type: 'button', className: 'moonlet-display-btn',
        value: 'Explore', onClick: handleClick })
    )
  );
}

Moonlet.propTypes = {
  moonlet: React.PropTypes.object
}
