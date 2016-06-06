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

// server side variables sent with render
const appCredentials = credentials;
const currentUser = username;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null, moonlets: null };
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
  }
  componentDidMount() {
    const username = this.props.apiCredentials.username;
    const password = this.props.apiCredentials.password;
    const userURL = `${this.props.apiURL}/users/${this.props.username}`;
    const moonletsURL = `${this.props.apiURL}/moonlets`;
    const self = this;

    function userCallback(userError, userResponse, userBody) {
      if (userError || JSON.parse(userBody).hasOwnProperty('error')) window.location.href = '/error/455';
      const user = JSON.parse(userBody).user;

      function moonletsCallback(moonletsError, moonletsResponse, moonletsBody) {
        if (moonletsError || JSON.parse(moonletsBody).hasOwnProperty('error')) window.location.href = '/error/455';
        const moonlets =  JSON.parse(moonletsBody).moonlets;

        self.setState({ user, moonlets });
      }
      // request info on all moonlets
      Request.get(moonletsURL, moonletsCallback).auth(username, password, true);
    }
    // request info on this user
    Request.get(userURL, userCallback).auth(username, password, true);
  }
  handleButtonClick() {
  }
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
                { user: this.state.user, credentials: this.props.apiCredentials, url: this.props.apiURL })
            ),
            React.createElement(TabPanel, {},
              React.createElement(SettingsPanel,
                { user: this.state.user, credentials: this.props.apiCredentials, url: this.props.apiURL })
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
  apiCredentials: React.PropTypes.object.isRequired,
  username: React.PropTypes.string
};

// front end global error handler -> redirect to error page for now
// window.onerror = () => window.location.href = '/error/455';

ReactDOM.render(React.createElement(Dashboard, { apiURL: ASTRALUX_API, apiCredentials: appCredentials, username: currentUser }),
  document.getElementById('dashboard'));
