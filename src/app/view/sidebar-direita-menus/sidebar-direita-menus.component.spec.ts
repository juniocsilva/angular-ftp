import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarDireitaMenusComponent } from './sidebar-direita-menus.component';

describe('SidebarDireitaMenusComponent', () => {
  let component: SidebarDireitaMenusComponent;
  let fixture: ComponentFixture<SidebarDireitaMenusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarDireitaMenusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarDireitaMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
