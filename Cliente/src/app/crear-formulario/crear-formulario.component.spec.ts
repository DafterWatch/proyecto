import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearFormularioComponent } from './crear-formulario.component';

describe('CrearFormularioComponent', () => {
  let component: CrearFormularioComponent;
  let fixture: ComponentFixture<CrearFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearFormularioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
