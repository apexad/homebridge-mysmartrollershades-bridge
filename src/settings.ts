/* Plugin Infrmation */
export const PLATFORM_NAME = 'MySmartRollerShadesBridge';
export const PLUGIN_NAME = 'homebridge-mysmartrollershades-bridge';

/* Tilt App Settings */
export const MYSMARTBLINDS_DOMAIN = 'mysmartblinds.auth0.com';
export const TILTSMARTHOME_URL = 'https://api.tiltsmarthome.com/v2/store/tilt';

export const TILTSMARTHOME_OPTIONS = {
  scope: 'openid offline_access',
  grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
  client_id: 'Owjr4yOJ2HauKaQhBpICgmfTf7naJsRd',
  realm: 'Username-Password-Authentication',
  audience: 'Tilt Settings Storage API',
};
