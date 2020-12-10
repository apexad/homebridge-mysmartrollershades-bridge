import rp from 'request-promise';
import jwt from 'jsonwebtoken';
import WebSocket from 'ws';
import {
  API,
  DynamicPlatformPlugin,
  Logger,
  PlatformAccessory,
  PlatformConfig,
  Service,
  Characteristic,
} from 'homebridge';
import {
  PLATFORM_NAME,
  PLUGIN_NAME,
  MYSMARTBLINDS_DOMAIN,
  TILTSMARTHOME_OPTIONS,
  TILTSMARTHOME_URL,
  TILTSMARTHOME_WSS,
} from './settings';
import {
  MySmartRollerShadesConfig,
  MySmartRollerShadesAuth,
  MySmartRollerShade,
} from './config';
import { MySmartRollerShadesAccessory } from './platformAccessory';

export class MySmartRollerShadesBridgePlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

  // this is used to track restored cached accessories
  public readonly accessories: PlatformAccessory[] = [];
  auth!: MySmartRollerShadesAuth;
  authToken!: string;
  authTokenInterval?: NodeJS.Timeout;
  tiltWebSocket!: WebSocket;
  requestOptions!: {
    method: string;
    uri: string;
    json: boolean;
    headers: {
      Authorization: string;
    };
  };


  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig & MySmartRollerShadesConfig,
    public readonly api: API,
  ) {
    /* plugin not configured check */
    if (!config) {
      this.log.info('No configuration found for platform ', PLATFORM_NAME);
      return;
    }

    /* setup config */
    this.config = config;
    this.log = log;

    try {
      if (!this.config.username) {
        throw new Error('MySmartRollerShades Bridge - You must provide a username');
      }
      if (!this.config.password) {
        throw new Error('MySmartRollershades Bridge - You must provide a password');
      }
      this.auth = {
        username: this.config.username,
        password: this.config.password,
      };
    } catch(err) {
      this.log.error(err);
    }

    this.log.debug('Finished initializing platform:', this.config.name);
    this.api.on('didFinishLaunching', () => {
      log.debug('Executed didFinishLaunching callback');
      // run the method to discover / register your devices as accessories
      this.discoverDevices();
    });
  }

  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading roller shade from cache:', accessory.displayName);

    // add the restored accessory to the accessories cache so we can track if it has already been registered
    this.accessories.push(accessory);
  }

  refreshAuthToken() {
    return rp({
      method: 'POST',
      uri: `https://${MYSMARTBLINDS_DOMAIN}/oauth/token`,
      json: true,
      body: Object.assign(
        {},
        TILTSMARTHOME_OPTIONS,
        this.auth,
      ),
    }).then((response) => {
      this.authToken = response.access_token;
      this.requestOptions = {
        method: 'GET',
        uri: TILTSMARTHOME_URL,
        json: true,
        headers: { Authorization: `Bearer ${response.access_token}` },
      };

      if (this.config.allowDebug) {
        const authTokenExpireDate = new Date((jwt.decode(response.id_token || '{ exp: 0 }') as { exp: number }).exp * 1000).toISOString();
        this.log.info(`authToken refresh, now expires ${authTokenExpireDate}`);
      }
    });
  }

  discoverDevices() {
    this.log.info('This plugin is still a work in progress');
    this.refreshAuthToken().then(() => {
      this.authTokenInterval = setInterval(this.refreshAuthToken.bind(this), 1000 * 60 * 60 * 8);
      rp(this.requestOptions).then((response) => {
        // attempt WebSocket setup
        try {
          this.tiltWebSocket = new WebSocket(TILTSMARTHOME_WSS, [], { headers: this.requestOptions.headers });

          this.tiltWebSocket.on('open', () => {
            this.log.warn('WebSocket has connected!');
          });

          this.tiltWebSocket.on('message', (data: string) => {
            this.log.warn(`WebSocket message recieved: ${JSON.parse(data)}`);
          });
        } catch(err) {
          this.log.warn('WebSocket connection failed!', err);
        }

        // create blind accessories
        response.rooms.forEach((room: { rollerShades: MySmartRollerShade[] }) => {
          room.rollerShades.forEach((rollerShade) => {
            const {
              id: shadeID,
              name: shadeName,
            } = rollerShade;
            const uuid = this.api.hap.uuid.generate(shadeID);

            const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);
            if (existingAccessory) {
              this.log.debug(`Restore cached roller shade: ${shadeName}`);

              new MySmartRollerShadesAccessory(this, existingAccessory);

              this.api.updatePlatformAccessories([existingAccessory]);
            } else {
              this.log.info(`Adding new roller shade: ${shadeName}`);
        
              // create a new accessory
              const accessory = new this.api.platformAccessory(shadeName, uuid);
              accessory.context.shade = {
                name: shadeName,
                id: shadeID,
                shadePosition: 100, // change to real value via get shade
                batteryLevel: 100, // change to real value via get shade
              };

              new MySmartRollerShadesAccessory(this, accessory);
        
              this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
            }
          });
          // need to figure out how to handle deleted roller shades
        });
      });
    });
  }
}