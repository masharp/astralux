/**
 * Module that exports the reusable Footer p element
 *
 * @return {object} Component's React element
 */
const React = require('react');

export default function PageFooter() {
  return (
    React.createElement('p', { className: 'page-footer' }, '\xA9 2016 Astralux | Alpha Release | ',
      React.createElement('a', { href: '/about' }, 'About '), '| ',
      React.createElement('a', { href: 'http://www.softwareontheshore.com' }, 'Software on the Shore')
    )
  );
}
