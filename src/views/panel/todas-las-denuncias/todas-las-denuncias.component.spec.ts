import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodasLasDenunciasComponent } from './todas-las-denuncias.component';

describe('TodasLasDenunciasComponent', () => {
  let component: TodasLasDenunciasComponent;
  let fixture: ComponentFixture<TodasLasDenunciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodasLasDenunciasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodasLasDenunciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
