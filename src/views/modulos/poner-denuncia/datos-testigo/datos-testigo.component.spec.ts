import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosTestigoComponent } from './datos-testigo.component';

describe('DatosTestigoComponent', () => {
  let component: DatosTestigoComponent;
  let fixture: ComponentFixture<DatosTestigoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosTestigoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosTestigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
