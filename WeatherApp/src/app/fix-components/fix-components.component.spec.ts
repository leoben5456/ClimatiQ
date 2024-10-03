import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixComponentsComponent } from './fix-components.component';

describe('FixComponentsComponent', () => {
  let component: FixComponentsComponent;
  let fixture: ComponentFixture<FixComponentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FixComponentsComponent]
    });
    fixture = TestBed.createComponent(FixComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
