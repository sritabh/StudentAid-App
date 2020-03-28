import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddEventsPage } from './add-events.page';

describe('AddEventsPage', () => {
  let component: AddEventsPage;
  let fixture: ComponentFixture<AddEventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEventsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
