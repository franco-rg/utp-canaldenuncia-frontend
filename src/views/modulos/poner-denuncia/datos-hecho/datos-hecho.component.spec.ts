import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosHechoComponent } from './datos-hecho.component';

describe('DatosHechoComponent', () => {
  let component: DatosHechoComponent;
  let fixture: ComponentFixture<DatosHechoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosHechoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosHechoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
