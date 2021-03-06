/* Stateful React Component that controls the Dashboard view. Composes
 * the transaction, profile, and settings panels.
 */

'use strict';

import LoadingOverlay from './components/LoadingOverlay';
import ProfilePanel from './components/dashboard/ProfilePanel';
import TransactionsPanel from './components/dashboard/TransactionsPanel';
import SettingsPanel from './components/dashboard/SettingsPanel';

const React = require('react');
const ReactDOM = require('react-dom');
const ReactTabs = require('react-tabs');
const Request = require('request');

const Tab = ReactTabs.Tab;
const Tabs = ReactTabs.Tabs;
const TabList = ReactTabs.TabList;
const TabPanel = ReactTabs.TabPanel;

const ASTRALUX_API = 'https://astralux-api.herokuapp.com/api';
const LOCAL_URL = 'https://astralux.herokuapp.com/credentials';

// server side variables sent with render
const currentUser = username;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null, moonlets: null, credentials: null };
    this.queryUserData = this.queryUserData.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
  }
  queryUserData(credentials) {
    const userURL = `${this.props.apiURL}/users/${this.props.username}`;
    const moonletsURL = `${this.props.apiURL}/moonlets`;
    const self = this;

    function userCallback(userError, userResponse, userBody) {
      if (userError || userBody.hasOwnProperty('error')) window.location.href = '/error/455';
      const user = JSON.parse(userBody).user;

      function moonletsCallback(moonletsError, moonletsResponse, moonletsBody) {
        if (moonletsError || moonletsBody.hasOwnProperty('error')) window.location.href = '/error/455';
        const moonlets =  JSON.parse(moonletsBody).moonlets;

        self.setState({ user, moonlets, credentials });
      }
      // request info on all moonlets
      Request.get(moonletsURL, moonletsCallback).auth(credentials.username, credentials.password, true);
    }
    // request info on this user
    Request.get(userURL, userCallback).auth(credentials.username, credentials.password, true);

  }
  /* upon component load, query the local server for API credentials */
  componentDidMount() {
    const localURL = this.props.localURL;

    /* disallow if unauthenticated user */
    if (this.props.username.length <= 0) window.location.href = '/';

    // query local server for API credentials
    Request.get(localURL, (error, response, body) => {
      if (error || body.hasOwnProperty('error')) window.location.href = '/error/455';
      const credentials = JSON.parse(body);
      this.setState({ credentials });
      this.queryUserData(credentials);
    });
  }
  /* class function used by the ReactTabs plugin to change panels */
  handleTabClick(index, last) {
  }
  render() {
    if (this.state.user !== null && this.state.moonlets !== null) {
      return (
        React.createElement('div', { id: 'dash-component' },
          React.createElement(Tabs, { onSelect: this.handleTabClick, selectedIndex: 0 },
            React.createElement(TabList, null,
              React.createElement(Tab, null, 'Profile'),
              React.createElement(Tab, null, 'History'),
              React.createElement(Tab, null, 'Settings')
            ),
            React.createElement(TabPanel, {},
              React.createElement(ProfilePanel, { user: this.state.user, moonlets: this.state.moonlets })
            ),
            React.createElement(TabPanel, {},
              React.createElement(TransactionsPanel,
                { user: this.state.user, credentials: this.state.credentials,
                  url: this.props.apiURL, query: this.queryUserData })
            ),
            React.createElement(TabPanel, {},
              React.createElement(SettingsPanel,
                { user: this.state.user, credentials: this.state.credentials, url: this.props.apiURL })
            )
          )
        )
      );
    }
    return (React.createElement(LoadingOverlay, null));
  }
}

Dashboard.propTypes = {
  apiURL: React.PropTypes.string.isRequired,
  localURL: React.PropTypes.string.isRequired,
  username: React.PropTypes.string
};

// front end global error handler -> redirect to error page for now
//window.onerror = () => window.location.href = '/error/455';

ReactDOM.render(React.createElement(Dashboard, { apiURL: ASTRALUX_API, localURL: LOCAL_URL, username: currentUser }),
  document.getElementById('dashboard'));
