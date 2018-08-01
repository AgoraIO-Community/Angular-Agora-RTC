import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'agora-local',
  template: `
    <div id="agora_local" [style.width.px]="width" [style.height.px]="height">
      <button>Start Call</button>
    </div>
  `,
  styles: [
    `#agora_local { 
      background-color: blue;
    }, 
    `
  ]
})
export class AgoraLocalComponent implements OnInit {

  @Input() width: string;
  @Input() height: string;

  constructor() { }

  ngOnInit() {
    console.log(this.width)
  }

}
