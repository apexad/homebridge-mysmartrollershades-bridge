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
//  PLUGIN_NAME,
} from './settings';
import {
  MySmartRollerShadesConfig,
  MySmartRollerShadesAuth,
} from './config';

export class MySmartRollerShadesBridgePlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

  // this is used to track restored cached accessories
  public readonly accessories: PlatformAccessory[] = [];
  auth!: MySmartRollerShadesAuth;

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
        throw new Error('MySmartBlinds Bridge - You must provide a username');
      }
      if (!this.config.password) {
        throw new Error('MySmartBlinds Bridge - You must provide a password');
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

  discoverDevices() {
    this.log.info('This plugin is still a work in progress');
  }
}