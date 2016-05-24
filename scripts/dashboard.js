'use strict';

import PageFooter from './components/PageFooter';
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

const ASTRALUX_API = 'https://astralux-api.herokuapp.com/api/v1.0';

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
      if (userError) window.location.href = '/error';
      const user = JSON.parse(userBody).user;

      function moonletsCallback(moonletsError, moonletsResponse, moonletsBody) {
        if (moonletsError) window.location.href = '/error';
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
    console.log(index, last);
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
              React.createElement(TransactionsPanel, { history: this.state.user.transactions.history })
            ),
            React.createElement(TabPanel, {},
              React.createElement(SettingsPanel, { user: this.state.user })
            )
          ),
          React.createElement(PageFooter, null)
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
// window.onerror = () => window.location.href = '/error';

ReactDOM.render(React.createElement(Dashboard, { apiURL: ASTRALUX_API, apiCredentials: credentials, username }),
  document.getElementById('dashboard'));
