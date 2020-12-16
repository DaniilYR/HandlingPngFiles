import { Component } from '@angular/core';
import  {HttpService} from '../http.service';

export interface Stock{
  arr: Stock[];
  title: string;
  price: string;
  count: string;
  maxCount: string;
}

export interface Broker{
  arr: Broker[];
  brokerName: string;
  money: string;
}

export interface Settings{
  arr: Settings[];
  beginTimeH: string;
  beginTimeM: string;
  endTimeH: string;
  endTimeM: string;
  interval: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpService]
})

export class AppComponent {
  title = 'Lab5';

  constructor(private httpService: HttpService){}

  private data: { price: string; name: string; count: string; title: string; maxCount: string };
  private dataB: { money: string; name: string; brokerName: string };

  stocks: Stock[] = [];
  brokers: Broker[] = [];
  settings: Settings[] = [];

  done = false;
  doneB = false;
  doneS = false;
  visible = false;
  visibleB = false;
  visibleS = false;

  company = '';
  count = '';
  price = '';
  maxCount = '';
  brokerName = '';
  money = '';

  open = false;
  openBroker = false;
  openSettings = false;


  // Акции

  OpenStock(){
    if (this.open === false)  {
      this.submit('Get');
    }
    this.openBroker = false;
    this.openSettings = false;
    this.open = !this.open;
  }

  OpenAddStock(){
    this.visible = true;
  }

  Close(){
    this.visible = false;
    this.company = '';
    this.price = '';
    this.count = '';
    this.maxCount = '';
  }

  CloseAddStock(){
    this.visible = false;
    if( this.company !== '' &&
        this.price !== '' &&
        this.count !== '' &&
        this.maxCount !== ''){

      this.data = {
        name: 'Add',
        title: this.company,
        price: this.price,
        count: this.count,
        maxCount: this.maxCount
      };
      this.company = '';
      this.price = '';
      this.count = '';
      this.maxCount = '';
      this.AddStock(this.data);
    }
    else {
      alert('Вы заполнели не все поля. Акции компании не были добавлены');
      this.company = '';
      this.price = '';
      this.count = '';
      this.maxCount = '';
    }
  }

  AddStock(dat){
    this.httpService.AddData(dat)
      .subscribe(
        (data: Stock) => {this.stocks = data.arr; this.done = true; },
        error => console.log(error)
      );
    this.Update();
  }

  Update(){
    this.open = false;
    this.submit('Get');
    this.open = true;
  }

  submit(funcName: string){
    this.httpService.postData(funcName)
      .subscribe(
        (data: Stock) => {this.stocks = data.arr; this.done = true; },
        error => console.log(error)
      );
  }

  // Брокеры

  OpenBroker(){
    if (this.openBroker === false){
      this.submitBroker('Get');
    }
    this.open = false;
    this.openSettings = false;
    this.openBroker = !this.openBroker;
  }

  BUpdate(){
    this.openBroker = false;
    this.submitBroker('Get');
    this.openBroker = true;
  }

  CloseAddBroker(){
    this.visibleB = false;
    if ( this.brokerName !== '' && this.money !== '' ){
      this.dataB = {
        name: 'Add',
        brokerName: this.brokerName,
        money: this.money
      };
      this.brokerName = '';
      this.money = '';
      this.AddBroker(this.dataB);
    }
    else {
      alert('Вы заполнели не все поля. Акции компании не были добавлены');
      this.brokerName = '';
      this.money = '';
    }
  }

  AddBroker(dat){
    this.httpService.BAddData(dat)
      .subscribe(
        (data: Broker) => {this.brokers = data.arr; this.doneB = true; },
        error => console.log(error)
      );
    this.BUpdate();
  }

  CloseB(){
    this.visibleB = false;
    this.brokerName = '';
    this.money = '';
  }

  submitBroker(funcName: string){
    this.httpService.BpostData(funcName)
      .subscribe(
        (data: Broker) => {this.brokers = data.arr; this.done = true; },
        error => console.log(error)
      );
  }

  // Настройки

  OpenSettings(){
    if(this.openSettings === false){
      this.submitSettings('Get');
    }
    this.openSettings = !this.openSettings;
    this.openBroker = false;
    this.open = false;
  }

  submitSettings(funcName: string){
    this.httpService.SpostData(funcName)
      .subscribe(
        (data: Settings) => {this.settings = data.arr; this.doneS = true; },
        error => console.log(error)
      );
  }

}
