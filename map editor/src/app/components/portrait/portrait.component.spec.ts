import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortraitComponent } from './portrait.component';

describe('PortraitComponent', () => {
  let component: PortraitComponent;
  let fixture: ComponentFixture<PortraitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortraitComponent]
    });
    fixture = TestBed.createComponent(PortraitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
