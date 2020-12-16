import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { StockComponent } from './stock/stock.component';
import { BrokerComponent } from './broker/broker.component';
import { SettingComponent } from './setting/setting.component';
import {BoldDirective} from '../bold.directive';

@NgModule({
    declarations: [
        AppComponent,
        StockComponent,
        BrokerComponent,
        SettingComponent,
        BoldDirective
    ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
