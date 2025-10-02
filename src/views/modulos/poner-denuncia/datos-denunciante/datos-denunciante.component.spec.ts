import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosDenuncianteComponent } from './datos-denunciante.component';

describe('DatosDenuncianteComponent', () => {
  let component: DatosDenuncianteComponent;
  let fixture: ComponentFixture<DatosDenuncianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosDenuncianteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosDenuncianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
