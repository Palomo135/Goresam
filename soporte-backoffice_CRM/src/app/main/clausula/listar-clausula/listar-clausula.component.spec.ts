import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarClausulaComponent } from './listar-clausula.component';

describe('ListarClausulaComponent', () => {
  let component: ListarClausulaComponent;
  let fixture: ComponentFixture<ListarClausulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarClausulaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarClausulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
