import type { Zone } from './zone';

export interface Status {
  zones: Zone[];
  timeOffset: number;
  ssid: string;
  serverReachable: boolean;
  serial: string;
  rebootCount: number;
  radioFirmwareVersion: string;
  localIP: string;
  lastCheckinDate: string;
  lastActiveDate: string;
  hardwareVersion: string;
  firmwareVersion: string;
}
