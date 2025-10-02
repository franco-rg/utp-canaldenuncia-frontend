import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarContrasenaComponent } from './asignar-contrasena.component';

describe('AsignarContrasenaComponent', () => {
  let component: AsignarContrasenaComponent;
  let fixture: ComponentFixture<AsignarContrasenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarContrasenaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
