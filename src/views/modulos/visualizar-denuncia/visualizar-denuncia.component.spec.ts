import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarDenunciaComponent } from './visualizar-denuncia.component';

describe('VisualizarDenunciaComponent', () => {
  let component: VisualizarDenunciaComponent;
  let fixture: ComponentFixture<VisualizarDenunciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarDenunciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarDenunciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
