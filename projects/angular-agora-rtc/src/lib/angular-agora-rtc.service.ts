import { Injectable, Inject } from '@angular/core';
import * as AgoraRTC from 'agora-rtc-sdk';
import { Subject, BehaviorSubject } from 'rxjs';
import { AgoraConfig } from './AgoraConfig';
import { AgoraClient } from './AgoraClient';

@Injectable({
  providedIn: 'root'
})
export class AngularAgoraRtcService {

  public audioDevices: any[];
  public videoDevices: any[];

  public client: AgoraClient;

  constructor(
    @Inject('config') private config:AgoraConfig
  ) {
    if (!this.checkSystemRequirements()) {
      this.logger('error', 'Web RTC is not supported');
    } else{
      this.getDevices();
    }
  }

  checkSystemRequirements() {
    return AgoraRTC.checkSystemRequirements();
  }

  private getDevices() {
    AgoraRTC.getDevices((devices) => {
      let audioDevices = devices.filter(device => {
        return device.kind === 'audioinput' && device.deviceId !== 'default'
      });
      let videoDevices = devices.filter(device => {
        return device.kind === 'videoinput' && device.deviceId !== 'default'
      });
      this.audioDevices = audioDevices;
      this.videoDevices = videoDevices;
    });
  }

  createClient(mode: string = 'interop', codec: string = 'vp8') {
     this.client = AgoraRTC.createClient({ mode: mode, codec: codec });
     this.client.init(this.config.AppID);
  }

  createStream(streamID: any, audio: boolean, cameraId: string = this.videoDevices[0].deviceId, microphoneId: string = this.audioDevices[0].deviceId, video: boolean, screen: boolean) {
    return AgoraRTC.createStream({streamID, audio, cameraId, microphoneId, video, screen});
  }

  setLoggerLevel(level: AgoraRTC.Logger) {
    AgoraRTC.Logger.setLoggerLevel(level);
  }

  logger(type: string, message: string) {
    switch (type) {
      case 'error':
        AgoraRTC.Logger.error(message);
        break;
      case 'warning':
        AgoraRTC.Logger.warning(message);
        break;
      case 'info':
        AgoraRTC.Logger.info(message);
        break;
      case 'debug':
        AgoraRTC.Logger.debug(message);
        break;
      default:
        AgoraRTC.Logger.error(message);
    }
  }
}
