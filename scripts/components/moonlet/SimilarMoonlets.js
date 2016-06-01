'use strict';
import MoonletItem from '../../components/MoonletItem';

const React = require('react');
const Request = require('request');

export default class SimilarMoonlets extends React.Component {
  constructor(props) {
    super(props);
    this.state = { moonlets: null };
    this.constructMoonlets = this.constructMoonlets.bind(this);
  }
  constructMoonlets() {
    const currentType = this.props.moonletType;
    const currentID = this.props.moonletID;
    const currentMoonlets = this.state.moonlets;
    const moonletsLength = currentMoonlets.length;
    const nodes = [];

    /* check the available moonlets for the same type as current moonlet */
    for (let x = 0; x < moonletsLength; x++) {
      if (nodes.length > 4) return nodes;

      if (currentMoonlets[x].classification === currentType && currentMoonlets[x].id !== currentID) {
        nodes.push(
          React.createElement(MoonletItem, { moonlet: currentMoonlets[x], key: `moonlet-${x}` })
        )
      }
    }

    /* if there are no similar moonlets - add the first three of the available moonlets */
    if (nodes.length < 1) {
      for (let y = 0; y < 3; y++) {
        if (currentType && currentMoonlets[y].id !== currentID) {
          nodes.push(
            React.createElement(MoonletItem, { moonlet: currentMoonlets[y], key: `moonlet-${y}` })
          )
        }
      }
    }

    return nodes;
  }
  componentDidMount() {
    const username = this.props.apiCredentials.username;
    const password = this.props.apiCredentials.password;
    const url = `${this.props.apiURL}/moonlets`;
    const self = this;

    function callback(error, response, body) {
      if (error) window.location.href = '/error';
      const result = JSON.parse(body);

      self.setState({ moonlets: result.moonlets });
    }

    Request.get(url, callback).auth(username, password, true);
  }
  render() {
    if ( this.state.moonlets !== null) {
      const moonletNodes = this.constructMoonlets();

      return (
        React.createElement('div', { id: 'moonlet-similar' },
          React.createElement('hr', null),
          React.createElement('h2', { className: 'moonlet-similar-title' }, 'You May Also Like'),
          React.createElement('div', { id: 'moonlet-similar-list'}, moonletNodes)
        )
      );
    }
    return ( React.createElement('div', null));
  }
}

SimilarMoonlets.propTypes = {
  apiURL: React.PropTypes.string.isRequired,
  apiCredentials: React.PropTypes.object.isRequired,
  moonletType: React.PropTypes.string.isRequired,
  moonletID: React.PropTypes.number.isRequired,
}
