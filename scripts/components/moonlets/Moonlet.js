/**
 * Module that exports the reusable Moonlet element
 *
 * @return {object} Component's React element
 */
const React = require('react');

export default function Moonlet(props) {
  return (
    React.createElement('div', { className: 'moonlet-display' },
      React.createElement('h2', { className: 'moonlet-display-name' }, props.moonlet.display_name),
      React.createElement('h3', { className: 'moonlet-display-class' }, props.moonlet.classification),
      React.createElement('img', { className: 'moonlet-display-img', src: props.moonlet.img_src }),
      React.createElement('span', { className: 'moonlet-display-desc' }, props.moonlet.description),
      React.createElement('span', { className: 'moonlet-display-price' }, props.moonlet.price),
      React.createElement('span', { className: 'moonlet-display-color' }, props.moonlet.color),
      React.createElement('input', { type: 'button', className: 'moonlet-display-btn', value: 'Buy' })
    )
  );
}

Moonlet.propTypes = {
  moonlet: React.PropTypes.object
}
