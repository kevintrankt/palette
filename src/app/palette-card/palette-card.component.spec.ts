import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaletteCardComponent } from './palette-card.component';

describe('PaletteCardComponent', () => {
  let component: PaletteCardComponent;
  let fixture: ComponentFixture<PaletteCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaletteCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaletteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
