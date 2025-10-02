import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizarDenunciaComponent } from './finalizar-denuncia.component';

describe('FinalizarDenunciaComponent', () => {
  let component: FinalizarDenunciaComponent;
  let fixture: ComponentFixture<FinalizarDenunciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalizarDenunciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalizarDenunciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
