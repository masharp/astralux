/* This is a module that contains a stateless react component, which constructs
 * the user's settings panel. This allows the user to update their email or delete
 * their account completely. */

'use strict';

import PageFooter from '../PageFooter';

const React = require('react');
const Request = require('request');

/**
 * Function that takes the user prop and the global moonlets prop and construct a
 * react module for use in the dashboard component.
 * @param {object} props - user: props.user, global moonlets: props.moonlets
 */
export default function SettingsPanel(props) {

  /**
   * Function that handles updating the user's email via a promise
   * @param {string} username - username of the user
   * @param {object} credentials - api credentials
   * @param {string} url - api url
   * @param {string} email - email to use when updating
   * @return {boolean} - true or false for success or failure
   */
  function updateEmail(username, credentials, url, email) {
    return new Promise((resolve, reject) => {
      const credentialsUsername = credentials.username;
      const credentialsPassword = credentials.password;

      const options = {
        url: `${url}/users/${username}`,
        method: 'PUT',
        json: { email }
      };
      function updateCallback(error, response, body) {
        if (error || body.hasOwnProperty('error')) {
          error = body.error ? body.error : error;
          reject(error);
        }

        resolve(true);
      }

      Request.put(options, updateCallback).auth(credentialsUsername, credentialsPassword, true);
    });
  }
  /**
   * Function that handles deleting the user's account via a promise
   * @param {string} username - username of the user
   * @param {object} credentials - api credentials
   * @param {string} url - api url
   * @return {boolean} - true or false for success or failure
   */
  function deleteAccount(username, credentials, url) {
    return new Promise((resolve, reject) => {
      const credentialsUsername = credentials.username;
      const credentialsPassword = credentials.password;
      const call = `${url}/users/${username}`;

      function deleteCallback(error, response, body) {
        if (error || body.hasOwnProperty('error')) {
          error = body.error ? body.error : error;
          reject(error);
        }
        resolve(true);
      }

      Request.delete(call, deleteCallback).auth(credentialsUsername, credentialsPassword, true);
    });
  }

  /**
   * Click handler for both the email update and account deletion buttons
   * Issues a server request. upon success or failure, updates view
   */
  function handleClicks(event) {
    const trigger = event.target.id;
    const username = props.user.username;
    const credentials = props.credentials;
    const url = props.url;

    const emailOne = document.getElementById('new-email-input');
    const emailTwo = document.getElementById('confirm-email-input');
    const emailFailure = document.getElementById('email-failure');
    const requestSuccess = document.getElementById('request-success');
    const requestSpinner = document.getElementById('request-spinner');

    // ensure request-status messages are hidden and trigger request-spinner
    requestSpinner.classList.remove('hidden');
    requestSuccess.classList.add('hidden');
    emailFailure.classList.add('hidden');

    switch (trigger) {
      // handle the clicking of the email-btn
      case 'update-email-btn':
        // get the email input values and validate them
        const emailOneVal = emailOne.value;
        const emailTwoVal = emailTwo.value;
        const validationOne = emailOneVal.split('@');
        const validationTwo = validationOne.length > 0 ? validationOne[1].split('.').length : 0;

        // simple email validation - show the error message
        if (emailOneVal !== emailTwoVal || validationOne.length < 2 || validationTwo < 2) {
          emailFailure.classList.remove('hidden');
          break;
        }

        // trigger update request if the email checks out
        updateEmail(username, credentials, url, emailOneVal).then((result) => {
          if (result) {
            requestSpinner.classList.add('hidden');
            requestSuccess.classList.remove('hidden');
            document.getElementById('email-selector').innerHTML = emailOneVal;
          }
        }).catch((error) => { window.location.href = '/error/455'; });

        break;
      // handle clicking of the delete acct btn
      case 'delete-acct-btn':
        let confirmBox = window.confirm('Are you sure!? This cannot be undone!');

        // confirm the user's action then submit request the server.
        if (confirmBox) {
          deleteAccount(username, credentials, url).then((result) => {
            if (result) {
              let alert = window.alert('Your account has been deleted. We\'re sorry to see you go!');
              window.location.href = '/';
            }
          }).catch((error) => { window.location.href = '/error/455'; });
        }
        break;
    }
  }

  const currentEmail = props.user.email.length > 0 ? props.user.email : 'N/A';

  return (
    React.createElement('div', { id: 'settings-panel' },
      React.createElement('h2', { className: 'settings-header' }, 'Settings'),
      React.createElement('div', { id: 'request-status' },
        React.createElement('p', { id: 'request-success', className: 'hidden' }, 'Your update was successful!'),
        React.createElement('i', { id: 'request-spinner', className: 'fa fa-spinner fa-pulse hidden'})
      ),
      React.createElement('div', { id: 'email-update' },
        React.createElement('h3', { className: 'email-update-header' }, 'Update Email'),
        React.createElement('p', { className: 'current-email' }, 'Current Email: ',
          React.createElement('span', { id: 'email-selector' }, currentEmail) // display user's current email
        ),
        // new email label-input combo
        React.createElement('label', { className: 'new-label' }, 'New Email: '),
        React.createElement('input', { type: 'text', id: 'new-email-input' }),
        React.createElement('br', null),
        React.createElement('br', null),
        // confirm email label-input combo
        React.createElement('label', { className: 'confirm-label' }, 'Confirm Email: '),
        React.createElement('input', { type: 'text', id: 'confirm-email-input' }),
        React.createElement('br', null),
        React.createElement('br', null),
        // update and error messages
        React.createElement('a', { id: 'update-email-btn', onClick: handleClicks }, 'Update'),
        React.createElement('p', { id: 'email-failure', className: 'hidden' }, 'Input invalid!')
      ),
      // delete account area
      React.createElement('div', { id: 'danger-zone' },
        React.createElement('h3', { className: 'danger-zone-header' }, 'Danger Zone'),
        React.createElement('div', { id: 'delete-account' },
          React.createElement('a', { id: 'delete-acct-btn', onClick: handleClicks }, 'Delete Account')
        )
      ),
      // empty div in order to clear floating and display footer
      React.createElement('div', { className: 'clear-filler' }),
      React.createElement(PageFooter, null)
    )
  );
}

SettingsPanel.propTypes = {
  user: React.PropTypes.object.isRequired,
  credentials: React.PropTypes.object.isRequired,
  url: React.PropTypes.string.isRequired,
}
