import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarDireitaComponent } from './sidebar-direita.component';

describe('SidebarDireitaComponent', () => {
  let component: SidebarDireitaComponent;
  let fixture: ComponentFixture<SidebarDireitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarDireitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarDireitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
