import { Test, TestingModule } from '@nestjs/testing';
import { TaskSchedulerController } from './task-scheduler.controller';

describe.skip('TaskSchedulerController', () => {
  let controller: TaskSchedulerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskSchedulerController],
    }).compile();

    controller = module.get<TaskSchedulerController>(TaskSchedulerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
