import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellEditorComponent } from './cell-editor.component';

describe('CellEditorComponent', () => {
  let component: CellEditorComponent;
  let fixture: ComponentFixture<CellEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CellEditorComponent]
    });
    fixture = TestBed.createComponent(CellEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
