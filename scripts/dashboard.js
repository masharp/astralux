'use strict';

import PageFooter from './components/PageFooter';
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

const ASTRALUX_API = 'https://astralux-api.herokuapp.com/api/v1.0/users';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
  }
  componentDidMount() {
    const username = this.props.apiCredentials.username;
    const password = this.props.apiCredentials.password;
    const url = `${this.props.apiURL}/${this.props.username}`;
    const self = this;

    function callback(error, response, body) {
      if (error) window.location.href = '/error';
      const result = JSON.parse(body);

      self.setState({ user: result.user });
    }

    Request.get(url, callback).auth(username, password, true);
  }
  handleButtonClick() {
  }
  handleTabClick(index, last) {
    console.log(index, last);
  }
  render() {
    if (this.state.user !== null) {
      return (
        React.createElement('div', { id: 'dash-component' },
          React.createElement(Tabs, { onSelect: this.handleTabClick, selectedIndex: 0 },
            React.createElement(TabList, null,
              React.createElement(Tab, null, 'Profile'),
              React.createElement(Tab, null, 'History'),
              React.createElement(Tab, null, 'Settings')
            ),
            React.createElement(TabPanel, {},
              React.createElement(ProfilePanel, { user: this.state.user })
            ),
            React.createElement(TabPanel, {},
              React.createElement(TransactionsPanel, { history: this.state.user.transactions })
            ),
            React.createElement(TabPanel, {},
              React.createElement(SettingsPanel, { user: this.state.user })
            )
          ),
          React.createElement(PageFooter, null)
        )
      );
    }
    return (React.createElement('div', null));
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
