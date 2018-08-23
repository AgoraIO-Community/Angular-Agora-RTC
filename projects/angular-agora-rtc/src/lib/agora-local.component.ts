import { Component } from '@angular/core';
import { AngularAgoraRtcService } from './angular-agora-rtc.service';
import { Stream } from './Stream';

@Component({
  selector: 'agora-rtc',
  templateUrl: 'agora-local-component.html',
  styleUrls: ['agora-local.component.css']
})
export class AgoraLocalComponent {

  activeCall: boolean = false;
  audioEnabled: boolean = true;
  videoEnabled: boolean = true;
  localStream: Stream
  remoteCalls: any = [];

  constructor(
    private agoraService: AngularAgoraRtcService
  ) {
    this.agoraService.createClient();
  }

  startCall() {
    this.activeCall = true;
    this.agoraService.client.join(null, '1000', null, (uid) => {
      this.localStream = this.agoraService.createStream(uid, true, null, null, true, false);
      this.localStream.setVideoProfile('720p_3');
      this.subscribeToStreams();
    });
  }

  private subscribeToStreams() {
    this.localStream.on("accessAllowed", () => {
      console.log("accessAllowed");
    });
    // The user has denied access to the camera and mic.
    this.localStream.on("accessDenied", () => {
      console.log("accessDenied");
    });

    this.localStream.init(() => {
      console.log("getUserMedia successfully");
      this.localStream.play('agora_local');
      this.agoraService.client.publish(this.localStream, function (err) {
        console.log("Publish local stream error: " + err);
      });
      this.agoraService.client.on('stream-published', function (evt) {
        console.log("Publish local stream successfully");
      });
    }, function (err) {
      console.log("getUserMedia failed", err);
    });

    this.agoraService.client.on('error', (err) => {
      console.log("Got error msg:", err.reason);
      if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.agoraService.client.renewChannelKey("", () => {
          console.log("Renew channel key successfully");
        }, (err) => {
          console.log("Renew channel key failed: ", err);
        });
      }
    });

    this.agoraService.client.on('stream-added', (evt) => {
      const stream = evt.stream;
      this.agoraService.client.subscribe(stream, (err) => {
        console.log("Subscribe stream failed", err);
      });
    });

    this.agoraService.client.on('stream-subscribed', (evt) => {
      const stream = evt.stream;
      if (!this.remoteCalls.includes(`agora_remote${stream.getId()}`)) this.remoteCalls.push(`agora_remote${stream.getId()}`);
      setTimeout(() => stream.play(`agora_remote${stream.getId()}`), 2000);
    });

    this.agoraService.client.on('stream-removed', (evt) => {
      const stream = evt.stream;
      stream.stop();
      this.remoteCalls = this.remoteCalls.filter(call => call !== `#agora_remote${stream.getId()}`);
      console.log(`Remote stream is removed ${stream.getId()}`);
    });

    this.agoraService.client.on('peer-leave', (evt) => {
      const stream = evt.stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call === `#agora_remote${stream.getId()}`);
        console.log(`${evt.uid} left from this channel`);
      }
    });
  }
  leave() {
    this.agoraService.client.leave(() => {
      this.activeCall = false;
      document.getElementById('agora_local').innerHTML = "";
      console.log("Leavel channel successfully");
    }, (err) => {
      console.log("Leave channel failed");
    });
  }

  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;
    if (this.audioEnabled) this.localStream.enableAudio();
    else this.localStream.disableAudio();
  }

  toggleVideo() {
    this.videoEnabled = !this.videoEnabled;
    if (this.videoEnabled) this.localStream.enableVideo();
    else this.localStream.disableVideo();
  }

}
