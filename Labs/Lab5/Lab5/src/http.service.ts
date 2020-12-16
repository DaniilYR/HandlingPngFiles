import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class HttpService{

  constructor(private http: HttpClient){ }

  postData(st: string){

    const body = {name: st};
    return this.http.post('http://localhost:3000/postuser', body);
  }

  changeData(data){
    const body = {name: data.name, title: data.title, price: data.price, count: data.count, maxCount: data.maxCount};
    return this.http.post('http://localhost:3000/postuser', body);
  }

  AddData(data){
    const body = {name: data.name, title: data.title, price: data.price, count: data.count, maxCount: data.maxCount};
    return this.http.post('http://localhost:3000/postuser', body);
  }

  DelData(data){
    const body = {name: data.name, title: data.title, price: data.price, count: data.count, maxCount: data.maxCount};
    return this.http.post('http://localhost:3000/postuser', body);
  }

  // Брокеры
  BchangeData(data){
    const body = {name: data.name, brokerName: data.brokerName, money: data.money};
    return this.http.post('http://localhost:3000/broker', body);
  }

  BpostData(st: string){

    const body = {name: st};
    return this.http.post('http://localhost:3000/broker', body);
  }

  BDelData(data){
    const body = {name: data.name, brokerName: data.brokerName, money: data.money};
    return this.http.post('http://localhost:3000/broker', body);
  }

  BAddData(data){
    const body = {name: data.name, brokerName: data.brokerName, money: data.money};
    return this.http.post('http://localhost:3000/broker', body);
  }

  // настройки
  SpostData(st: string){

    const body = {name: st};
    return this.http.post('http://localhost:3000/set', body);
  }

  SchangeData(data){
    const body = {name: data.name, beginTimeH: data.beginTimeH, beginTimeM: data.beginTimeM, endTimeH: data.endTimeH, endTimeM: data.endTimeM, interval : data.interval};
    return this.http.post('http://localhost:3000/set', body);
  }
}
