import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewEventsPage } from './view-events.page';

describe('ViewEventsPage', () => {
  let component: ViewEventsPage;
  let fixture: ComponentFixture<ViewEventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEventsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
