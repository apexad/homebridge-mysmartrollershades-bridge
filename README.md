# homebridge-mysmartrollershades-bridge

[![mit license](https://badgen.net/badge/license/MIT/red)](https://github.com/apexad/homebridge-mysmartrollershades-bridge/blob/master/LICENSE)
[![npm](https://badgen.net/npm/v/homebridge-mysmartrollershades-bridge)](https://www.npmjs.com/package/homebridge-mysmartrollershades-bridge)
[![npm](https://badgen.net/npm/dt/homebridge-mysmartrollershades-bridge)](https://www.npmjs.com/package/homebridge-mysmartrollershades-bridge)
[![donate](https://badgen.net/badge/donate/paypal/91BE09)](https://www.paypal.me/apexadm)

[Homebridge](https://github.com/homebridge/homebridge) plugin which communicates with MySmartRollerShades through the [MySmartRollerShades/Tilt Bridge](https://www.tiltsmarthome.com/products/smart-hub?variant=31506970116161).  
Configure your roller shades and bridge with the official iOS or Android app first in order to use this Homebridge plugin.

This plugin is not affiliated with the MySmartRollerShades/Tilt Smart Home product

## Features
```diff
- Only adds roller shades to Homebridge/HomeKit! Not yet functional. Work in progress plugin
```

## Configuration
This easiest way to use this plugin is to use [homebridge-config-ui-x](https://www.npmjs.com/package/homebridge-config-ui-x).  
To configure manually, add to the `platforms` section of Homebridge's `config.json` after installing the plugin.

**Config:**
```json
{
  "platform": "MySmartRollerShadesBridge",
  "name": "MySmartRollerShadesBridge",
  "username": "<email address>",
  "password": "<password>"
}
```

Field                   | Description
------------------------|------------
**platform**            | Must always be "MySmartRollerShadesBridge"
**name**                | Best to set to "MySmartRollerShadesBridge"
**username**            | MySmartRollerShades/Tilt app username (usually email address)
**password**            | MySmartRollerShades/Tilt app password
**statusLog**           | _(optional true/false, defaults to false)_ logs position changes
**allowDebug**          | _(optional true/false, defaults to false)_ Outputs a lot of debug info to stdout
**pollingInterval**     | _(optional)_ Polling Interval (in minutes)

## Testing
Use `npx homebridge-mysmartrollershades-bridge` to test your credentials.

## Sponsors
[mbmccormick](https://github.com/mbmccormick)

## Code Credits
[apexad/homebridge-mysmartblinds-bridge](https://github.com/apexad/homebridge-mysmartblinds-bridge) - my own plugin, but check there for other code credits
