import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificarTareaComponent } from './calificar-tarea.component';

describe('CalificarTareaComponent', () => {
  let component: CalificarTareaComponent;
  let fixture: ComponentFixture<CalificarTareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificarTareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificarTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
