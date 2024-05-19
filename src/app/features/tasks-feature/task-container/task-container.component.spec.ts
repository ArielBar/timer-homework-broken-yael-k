import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Input, Component } from '@angular/core';
import { TaskModel } from '../../../core/models/task-model';
import { TaskStoreService } from '../../../core/services/task-store.service';
import { TaskContainerComponent } from './task-container.component';
import { MatCardModule } from '@angular/material/card';
import { MinuteSecondsPipe } from '../../../core/pipes/minute-seconds.pipe';
import { Observable, of } from 'rxjs';
import { buttonText } from 'src/app/core/models/button-text';

describe('TaskContainerComponent', () => {
  let component: TaskContainerComponent;
  let fixture: ComponentFixture<TaskContainerComponent>;

  @Component({
    selector: 'app-task-presenter',
    template: ` <p>{{ task | json }}</p> `,
  })
  class FakeComponent implements TaskModel {
    @Input() id: number;
    @Input() name: string;
    @Input() timer: Observable<number>;
    @Input() buttonText: buttonText;
  }

  class FakeService {
    get tasks$() {
      return of([]);
    }
    get totalTime$() {
      return of(1);
    }
    updateTask() {
      return {};
    }
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskContainerComponent, FakeComponent, MinuteSecondsPipe],
      providers: [{ provide: TaskStoreService, useClass: FakeService }],
      imports: [MatCardModule],
    });
    fixture = TestBed.createComponent(TaskContainerComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('onClick', () => {
    it('makes expected calls', () => {
      const taskModelStub: TaskModel = {
        id: -1,
        name: '',
        timer: of(),
        buttonText: 'play_arrow',
      };
      const logicServiceStub: TaskStoreService =
        fixture.debugElement.injector.get(TaskStoreService);
      jest.spyOn(logicServiceStub, 'updateTask');
      component.onClick(-1);
      expect(logicServiceStub.updateTask).toHaveBeenCalled();
    });
  });
  describe('DOM', () => {
    it('should render totalTime$', () => {
      const logicServiceStub: TaskStoreService =
        fixture.debugElement.injector.get(TaskStoreService);
      jest.spyOn(logicServiceStub, 'totalTime$', 'get').mockReturnValue(of(35));
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toMatchSnapshot();
      });
    });
    it('should render tasks$', () => {
      const logicServiceStub: TaskStoreService =
        fixture.debugElement.injector.get(TaskStoreService);
      const tasks: TaskModel[] = [
        { id: 1, name: 'test1', buttonText: 'pause', timer: of(1) },
        { id: 2, name: 'test2', buttonText: 'pause', timer: of(1) },
        { id: 3, name: 'test3', buttonText: 'pause', timer: of(1) },
      ];
      jest.spyOn(logicServiceStub, 'tasks$', 'get').mockReturnValue(of(tasks));
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toMatchSnapshot();
      });
    });
  });
});
