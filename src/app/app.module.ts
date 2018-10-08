import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // <-Add here

import { AppComponent } from './app.component';
import { PaletteCardComponent } from './palette-card/palette-card.component';

@NgModule({
  declarations: [AppComponent, PaletteCardComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
