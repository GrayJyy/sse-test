import { Controller, Get, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { exec } from 'child_process';
import { readFileSync } from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Sse('stream')
  stream() {
    return new Observable((observer) => {
      observer.next({ data: { message: 'next' } });
      setTimeout(() => {
        observer.next({ data: { message: 'next2' } });
      }, 2000);
      setTimeout(() => {
        observer.next({ data: { message: 'next3' } });
      }, 3000);
    });
  }

  @Sse('log')
  log() {
    const childProcess = exec('tail -f ./log');
    return new Observable((observer) => {
      childProcess.stdout.on('data', (msg) => {
        observer.next({ data: { msg: msg.toString() } });
      });
    });
  }

  @Sse('buffer')
  buffer() {
    const json = readFileSync('./package.json');
    return new Observable((observer) => {
      observer.next({ data: json.toJSON() });
    });
  }
}
