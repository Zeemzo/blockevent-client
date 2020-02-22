import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiedTicketsComponent } from './verified-tickets.component';

describe('VerifiedTicketsComponent', () => {
  let component: VerifiedTicketsComponent;
  let fixture: ComponentFixture<VerifiedTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifiedTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiedTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
