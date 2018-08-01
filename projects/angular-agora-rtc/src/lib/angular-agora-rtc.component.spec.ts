import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgoraLocalComponent } from './agora-local.component';

describe('AgoraLocalComponent', () => {
  let component: AgoraLocalComponent;
  let fixture: ComponentFixture<AgoraLocalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgoraLocalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgoraLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
