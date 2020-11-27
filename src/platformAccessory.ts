import {
  Service,
  PlatformAccessory,
  CharacteristicValue,
  CharacteristicSetCallback,
} from 'homebridge';
// import rp from 'request-promise';
import { MySmartRollerShadesBridgePlatform } from './platform';

export class MySmartRollerShadesAccessory {
  service!: Service;
  batteryService: Service;
  statusLog: boolean;
  pollingInterval: number;
  name: string;
  id: string;
  platform: MySmartRollerShadesBridgePlatform;
  accessory: PlatformAccessory;
  allowDebug: boolean;

  constructor(
    platform: MySmartRollerShadesBridgePlatform,
    accessory: PlatformAccessory,
  ) {
    this.platform = platform;
    this.name = accessory.context.shade.name;
    this.id = accessory.context.shade.id;
    this.statusLog = platform.config.statusLog || false;
    this.pollingInterval = platform.config.pollingInterval || 0;
    this.allowDebug = platform.config.allowDebug || false;

    accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Tilt Smart Home')
      .setCharacteristic(this.platform.Characteristic.Model, 'MySmartRollerShades')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, this.id);

    this.service = accessory.getService(this.platform.Service.WindowCovering)
    || accessory.addService(this.platform.Service.WindowCovering);

    this.service.setCharacteristic(this.platform.Characteristic.Name, this.name);

    this.service.getCharacteristic(this.platform.Characteristic.TargetPosition)
      .on('set', this.setTargetPosition.bind(this));
    this.updatePosition(accessory.context.shade.shadePosition);

    this.batteryService = accessory.getService(this.platform.Service.BatteryService)
    || accessory.addService(this.platform.Service.BatteryService, `${this.name} Battery`, `${this.id} Battery`);
    this.updateBattery(accessory.context.shade.batteryLevel);
    
    this.accessory = accessory;

    if (this.pollingInterval > 0) {
      if (this.allowDebug) {
        this.platform.log.info(`Begin polling for ${this.name}`);
      }
      setTimeout(() => this.refreshRollerShade(), this.pollingInterval * 1000 * 60);
    }
  }

  updatePosition(currentPosition: number) {
    let reportCurrentPosition = currentPosition;

    if (reportCurrentPosition === 99) {
      reportCurrentPosition = 100;
    }
    if (reportCurrentPosition === 1) {
      reportCurrentPosition = 0;
    }
    if (this.statusLog) {
      this.platform.log.info(`STATUS: ${this.name} updateCurrentPosition : ${reportCurrentPosition} (Actual ${currentPosition})`);
    }

    this.service.updateCharacteristic(this.platform.Characteristic.TargetPosition, reportCurrentPosition);
    this.service.updateCharacteristic(this.platform.Characteristic.CurrentPosition, reportCurrentPosition);
    this.service.updateCharacteristic(this.platform.Characteristic.PositionState, this.platform.Characteristic.PositionState.STOPPED);
  }

  updateBattery(batteryLevel: number) {
    const {
      StatusLowBattery,
    } = this.platform.Characteristic;
    // value of -1 means data was not sent correctly, so ignore it for now

    this.batteryService.updateCharacteristic(this.platform.Characteristic.BatteryLevel, batteryLevel);
    this.batteryService
      .updateCharacteristic(
        StatusLowBattery,
        (batteryLevel < 20 && batteryLevel !== -1) ? StatusLowBattery.BATTERY_LEVEL_LOW : StatusLowBattery.BATTERY_LEVEL_NORMAL,
      );
  }

  setTargetPosition(value: CharacteristicValue, callback: CharacteristicSetCallback) {
    const targetPosition = value as number;
    this.service.updateCharacteristic(this.platform.Characteristic.TargetPosition, targetPosition);

    this.platform.log.info(`${this.name} setTargetPosition to ${value}`);

    /* need to add update logic */
    // update current position
    this.updatePosition(targetPosition);
        
    this.platform.log.info(`${this.name} currentPosition is now ${targetPosition}`);
    callback(null);
  }

  refreshRollerShade() {
    if (this.allowDebug) {
      this.platform.log.info(`Refresh roller shade ${this.name}`);
    }
    /* work in progress
    const shadeState = response.shadeState;
    this.updatePosition(shadeState.position);
    this.updateBattery(shadeState.batteryLevel as number);
    let refreshShadeimeOut = this.pollingInterval * 1000 * 60; // convert minutes to milliseconds
    if (response.headers['x-ratelimit-reset']) {
      refreshShadeTimeOut = new Date(parseInt(response.headers['x-ratelimit-reset']) * 1000).getTime() - new Date().getTime();
      this.platform.log.warn(`Rate Limit reached, refresh for ${this.name} delay to ${new Date(response.headers['x-ratelimit-reset'])}`);
    }
    setTimeout(() => this.refreshRollerShade(), refreshShadeTimeOut);
    */
  }
}
