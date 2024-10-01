import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CellComponent } from './components/cell/cell.component';
import { TileComponent } from './components/tile/tile.component';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import { MatRadioModule } from '@angular/material/radio'
import {CommonModule} from "@angular/common";
import {SelectionDialogComponent} from "./components/selection-dialog/selection-dialog.component";
import { EditDialogComponent } from './components/edit-dialog/edit-dialog.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from '@angular/material/tooltip';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { CellEditorComponent } from './components/cell-editor/cell-editor.component';
import { CubeComponent } from './components/cube/cube.component';
import { ImportExportDialogComponent } from './components/import-export-dialog/import-export-dialog.component';
import {ClipboardModule} from "@angular/cdk/clipboard";
import {HttpClientModule} from "@angular/common/http";
import { PortraitComponent } from './components/portrait/portrait.component';
import { SettingsDialogComponent } from './components/settings-dialog/settings-dialog.component';
import { AboutDialogComponent } from './components/about-dialog/about-dialog.component';
import { ImagePipe } from './pipes/image.pipe';


@NgModule({
  declarations: [
    AppComponent,
    CellComponent,
    TileComponent,
    SelectionDialogComponent,
    EditDialogComponent,
    CellEditorComponent,
    CubeComponent,
    ImportExportDialogComponent,
    PortraitComponent,
    SettingsDialogComponent,
    AboutDialogComponent,
    ImagePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatDialogModule,
    MatRadioModule,
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule,ClipboardModule,
    MatTooltipModule
  ],
  providers: [MatDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
