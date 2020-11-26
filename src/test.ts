/* eslint-disable no-console */
import rp from 'request-promise';
import prompt from 'prompt';
import {
  MYSMARTBLINDS_DOMAIN,
  TILTSMARTHOME_OPTIONS,
  TILTSMARTHOME_URL,
} from './settings';

import {
  MySmartRollerShadesAuth,
} from './config';

prompt.get(['username', {name: 'password', hidden: true }], (err: Error, result: MySmartRollerShadesAuth) => {
  rp({
    method: 'POST',
    uri: `https://${MYSMARTBLINDS_DOMAIN}/oauth/token`,
    json: true,
    body: Object.assign(
      {},
      TILTSMARTHOME_OPTIONS,
      {
        username: result.username,
        password: result.password,
      },
    ),
  }).then((response) => {
    console.log(response);
    rp({
      method: 'GET',
      uri: TILTSMARTHOME_URL,
      json: true,
      headers: { Authorization: `Bearer ${response.access_token}` },
    }).then((response) => {
      console.log(JSON.stringify(response));
    });
  });
});
