import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PonerDenunciaComponent } from './poner-denuncia.component';

describe('PonerDenunciaComponent', () => {
  let component: PonerDenunciaComponent;
  let fixture: ComponentFixture<PonerDenunciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PonerDenunciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PonerDenunciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
