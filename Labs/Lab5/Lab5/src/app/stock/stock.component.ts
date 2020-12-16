import {Component, Input, OnInit} from '@angular/core';
import {Stock} from '../app.component';
import {HttpService} from '../../http.service';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
  providers: [HttpService]
})
export class StockComponent implements OnInit {

  constructor(private httpService: HttpService,
              private  appComponent: AppComponent){}

  @Input() stock: Stock;

  visible = false;
  done = false;
  private data: { price: string; name: string; count: string; title: string; maxCount: string };

  OpenChange(){
    this.visible = true;
  }

  CloseChange(){
    this.visible = false;

    this.data  = {
      name: 'Change',
      title: this.stock.title,
      price: this.stock.price,
      count: this.stock.count,
      maxCount: this.stock.maxCount
    };

    this.httpService.changeData(this.data)
      .subscribe(
        (data: Stock) => {this.done = true;},
        error => console.log(error)
      );
  }

  Del(){
    this.appComponent.open = true;
    this.data  = {
      name: 'Del',
      title: this.stock.title,
      price: this.stock.price,
      count: this.stock.count,
      maxCount: this.stock.maxCount
    };
    this.httpService.DelData(this.data)
      .subscribe(
        (data: Stock) => {this.done = true; },
        error => console.log(error)
      );

    this.appComponent.Update();
  }

  ngOnInit(): void {
  }

}
