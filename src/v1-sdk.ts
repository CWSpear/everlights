// I think this is for v1 and it has not been tested
// adapted from https://github.com/stevecoug/everlights/blob/master/everlights.php

import chalk from 'chalk';
import { createSocket, Socket } from 'dgram';
import { ColorInput } from './types';
import { hex, socketColorHex } from './util';

export enum Pattern {
  None = 0,
  Blink = 1,
  ChaseLeft = 2,
  ChaseRight = 3,
  Fade = 4,
  Strobe = 5,
  Twinkle = 6,
}

export enum Command {
  Power = 'O',
  Sequence = 'C',
  Pattern = 'P',
  Brightness = 'I',
  Speed = 'S',
}

export interface Options {
  port?: number;
  ip?: string;
  alwaysConnected?: boolean;
}

export class EverLights {
  private readonly socket: Socket;
  private readonly options: Required<Options>;
  private readonly _readyPromise: Promise<void>;

  private ready: boolean = false;

  constructor(options: Options) {
    this.options = {
      port: 8080,
      ip: 'localhost',
      alwaysConnected: false,
      ...options,
    };

    this.socket = createSocket('udp4');

    this._readyPromise = new Promise<void>((resolve) => {
      if (this.options.alwaysConnected) {
        this.socket.connect(this.options.port, this.options.ip, async () => {
          console.log('connection established');
          this.ready = true;
          console.log(this.socket.remoteAddress());
          resolve();
        });
      } else {
        resolve();
      }
    }).then(() => {
      this.ready = true;
    });

    this.socket.on('error', (...args) => {
      console.error(chalk.red('Error'), ...args);
    });
  }

  async readyPromise(): Promise<void> {
    return this.ready ? Promise.resolve() : this._readyPromise;
  }

  async sequence(colors: ColorInput[]): Promise<void> {
    await this.sendCommand(Command.Sequence, [hex(colors.length), ...colors.map((color) => socketColorHex(color))].join(''));
  }

  async pattern(pattern: Pattern = Pattern.None): Promise<void> {
    await this.sendCommand(Command.Pattern, hex(pattern));
  }

  // 0 - 255
  async brightness(brightness: number = 255): Promise<void> {
    await this.sendCommand(Command.Brightness, hex(brightness));
  }

  // idk what the scale for speed is, I think 0-255
  async speed(speed: number = 0): Promise<void> {
    await this.sendCommand(Command.Speed, hex(speed));
  }

  async on(): Promise<void> {
    await this.sendCommand(Command.Power, hex(+true));
  }

  async off(): Promise<void> {
    await this.sendCommand(Command.Power, hex(+false));
  }

  private async sendCommand(cmd: Command, hexStr: string): Promise<void> {
    await this.send(`${cmd}${hexStr}`);
  }

  private async send(message: string): Promise<void> {
    console.log(`Sending '${message}'...`);
    if (this.options.alwaysConnected) {
      await new Promise<void>((resolve, reject) => this.socket.send(message, this.createResponseHandler(message, resolve, reject)));
    } else {
      await new Promise<void>((resolve, reject) =>
        this.socket.send(message, this.options.port, this.options.ip, this.createResponseHandler(message, resolve, reject)),
      );
    }
  }

  private createResponseHandler(
    message: string,
    resolve: () => void,
    reject: (err: Error) => void,
  ): (err: Error | null, bytes: number) => void {
    return (err: Error | null, bytes: number) => {
      if (err) {
        console.error(chalk.red(`Error sending ${message}:`), err);
        reject(new Error(err.message));
        return;
      }
      console.log(`Sent ${bytes} bytes.`);
      resolve();
    };
  }
}
