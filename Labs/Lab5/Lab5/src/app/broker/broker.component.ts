import {Component, Input, OnInit} from '@angular/core';
import {HttpService} from '../../http.service';
import {Broker, Stock} from '../app.component';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.css'],
  providers: [HttpService]
})
export class BrokerComponent implements OnInit {

  private data: { money: string; name: string; brokerName: string };

  constructor(private httpService: HttpService, private  appComponent: AppComponent){ }

  @Input() broker: Broker;

  visible = false;
  done = false;

  CloseChange(){
    this.visible = false;

    this.data  = {
      name: 'Change',
      brokerName: this.broker.brokerName,
      money: this.broker.money,
    };

    this.httpService.BchangeData(this.data)
      .subscribe(
        (data: Broker) => {this.done = true; },
        error => console.log(error)
      );
  }

  Del(){
    this.appComponent.openBroker = true;
    this.data  = {
      name: 'Del',
      brokerName: this.broker.brokerName,
      money: this.broker.money
    };
    this.httpService.BDelData(this.data)
      .subscribe(
        (data: Broker) => {this.done = true; },
        error => console.log(error)
      );

    this.appComponent.BUpdate();
  }

  ngOnInit(): void {
  }

}
