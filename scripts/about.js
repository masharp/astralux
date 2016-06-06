/**
 * React Component that composes the About Page components. Includes FAQ and
 * information about the site. Currently stateless. */

'use strict';

import PageFooter from './components/PageFooter';

const React = require('react');
const ReactDOM = require('react-dom');
const Request = require('request');

// server side variables sent with render
const appCredentials = credentials;

class About extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      React.createElement('div', { id: 'about-component' },
        React.createElement('img', { className: 'about-header-img', src: '/assets/brand.png' }),
        React.createElement('p', { className: 'about-body' },
          'Astralux is an e-commerce prototype project of ',
          React.createElement('a', { href: 'http://www.softwareontheshore.com', target:'_blank' }, 'Software on the Shore'),
          '. It is intended to showcase design and engineering ability, as well as test technologies. ' +
          'All products sold here are fictional. All currencies used here are fiction. Transactions and user ' +
          'information are superficial and Astralux does not retain anything sensitive.'
        ),
        React.createElement(PageFooter, null)
      )
    );
  }
}

About.propTypes = {
};

// front end global error handler -> redirect to error page for now
//window.onerror = () => window.location.href = '/error/455';

ReactDOM.render(React.createElement(About, null), document.getElementById('about'));
