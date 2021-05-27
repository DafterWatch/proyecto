import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTareas1Component } from './lista-tareas1.component';

describe('ListaTareas1Component', () => {
  let component: ListaTareas1Component;
  let fixture: ComponentFixture<ListaTareas1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaTareas1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaTareas1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
