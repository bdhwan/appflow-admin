import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppListPage } from './app-list.page';

describe('AppListPage', () => {
  let component: AppListPage;
  let fixture: ComponentFixture<AppListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
