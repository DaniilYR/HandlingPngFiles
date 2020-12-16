import {Component, Input, OnInit} from '@angular/core';
import {HttpService} from '../../http.service';
import {AppComponent} from '../app.component';
import {Settings} from '../app.component';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  private data: { name: string; beginTimeH: any; endTimeH: any; interval: string; endTimeM: any; beginTimeM: any };

  constructor(private httpService: HttpService, private  appComponent: AppComponent){}

  @Input() sett: Settings;

  visible = false;
  done = false;

  ChangeSet(){
    this.visible = false;
    this.data  = {
      name: 'Change',
      beginTimeH: this.sett.beginTimeH,
      beginTimeM: this.sett.beginTimeM,
      endTimeH: this.sett.endTimeH,
      endTimeM: this.sett.endTimeM,
      interval: this.sett.interval
    };

    this.httpService.SchangeData(this.data)
      .subscribe(
        (data: Settings) => {this.done = true; },
        error => console.log(error)
      );
  }

  ngOnInit(): void {
  }

}
