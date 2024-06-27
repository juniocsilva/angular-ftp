import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarEsquerdaComponent } from './sidebar-esquerda.component';

describe('SidebarEsquerdaComponent', () => {
  let component: SidebarEsquerdaComponent;
  let fixture: ComponentFixture<SidebarEsquerdaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarEsquerdaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarEsquerdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
