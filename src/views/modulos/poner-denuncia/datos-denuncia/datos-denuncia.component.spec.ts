import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosDenunciaComponent } from './datos-denuncia.component';

describe('DatosDenunciaComponent', () => {
  let component: DatosDenunciaComponent;
  let fixture: ComponentFixture<DatosDenunciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosDenunciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosDenunciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
