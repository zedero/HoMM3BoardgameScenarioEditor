import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TileComponent } from './components/tile/tile.component';
import { EditorComponent } from './components/editor/editor.component';
import { MatSelectModule } from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {NgFor} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    TileComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSelectModule,
    MatFormFieldModule, NgFor, MatInputModule, FormsModule, BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
