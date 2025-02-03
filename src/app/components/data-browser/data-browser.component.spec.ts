import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataBrowserComponent } from './data-browser.component';

describe('DataBrowserComponent', () => {
  let component: DataBrowserComponent;
  let fixture: ComponentFixture<DataBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataBrowserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
