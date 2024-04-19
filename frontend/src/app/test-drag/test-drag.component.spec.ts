import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TestDragComponent } from './test-drag.component';

describe('TestDragComponent', () => {
  let component: TestDragComponent;
  let fixture: ComponentFixture<TestDragComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestDragComponent],
      imports: [DragDropModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
