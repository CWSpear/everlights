export interface Zone {
  temperature: number;
  snr: number;
  serial: string;
  rssi: number;
  rebootCount: number;
  lastResponseDate: string;
  lastRequestDate: string;
  lastActiveDate: string;
  firmwareVersion: string;
  current: number;
  configuredLength: number;
  bridgeSerial: string;
  active: boolean;
}
