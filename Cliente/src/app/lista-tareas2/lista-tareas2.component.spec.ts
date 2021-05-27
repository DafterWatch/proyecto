import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTareas2Component } from './lista-tareas2.component';

describe('ListaTareas2Component', () => {
  let component: ListaTareas2Component;
  let fixture: ComponentFixture<ListaTareas2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaTareas2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaTareas2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
