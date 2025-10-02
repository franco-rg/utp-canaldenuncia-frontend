import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosArchivosComponent } from './datos-archivos.component';

describe('DatosArchivosComponent', () => {
  let component: DatosArchivosComponent;
  let fixture: ComponentFixture<DatosArchivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosArchivosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
