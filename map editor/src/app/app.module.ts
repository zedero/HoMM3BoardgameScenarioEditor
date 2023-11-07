import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CellComponent } from './components/cell/cell.component';
import { TileComponent } from './components/tile/tile.component';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {CommonModule} from "@angular/common";
import {SelectionDialogComponent} from "./components/selection-dialog/selection-dialog.component";
import { EditDialogComponent } from './components/edit-dialog/edit-dialog.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { CellEditorComponent } from './components/cell-editor/cell-editor.component';
import { CubeComponent } from './components/cube/cube.component';
import { ImportExportDialogComponent } from './components/import-export-dialog/import-export-dialog.component';
import {ClipboardModule} from "@angular/cdk/clipboard";


@NgModule({
  declarations: [
    AppComponent,
    CellComponent,
    TileComponent,
    SelectionDialogComponent,
    EditDialogComponent,
    CellEditorComponent,
    CubeComponent,
    ImportExportDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatDialogModule,
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule,ClipboardModule
  ],
  providers: [MatDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
