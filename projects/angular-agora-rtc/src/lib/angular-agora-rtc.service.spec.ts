import { TestBed, inject } from '@angular/core/testing';

import { AngularAgoraRtcService } from './angular-agora-rtc.service';

describe('AngularAgoraRtcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AngularAgoraRtcService]
    });
  });

  it('should be created', inject([AngularAgoraRtcService], (service: AngularAgoraRtcService) => {
    expect(service).toBeTruthy();
  }));
});
