import { TasksService } from './tasks.service';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findAll(): Promise<{
        id: string;
        title: string;
        status: string;
        tags: string;
        deadline: Date | null;
        startedAt: Date | null;
        finishedAt: Date | null;
        projectId: string;
        assigneeId: string | null;
    }[]>;
    create(body: {
        title: string;
        projectId: string;
    }): Promise<{
        id: string;
        title: string;
        status: string;
        tags: string;
        deadline: Date | null;
        startedAt: Date | null;
        finishedAt: Date | null;
        projectId: string;
        assigneeId: string | null;
    }>;
    update(id: string, status: string): Promise<{
        id: string;
        title: string;
        status: string;
        tags: string;
        deadline: Date | null;
        startedAt: Date | null;
        finishedAt: Date | null;
        projectId: string;
        assigneeId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        title: string;
        status: string;
        tags: string;
        deadline: Date | null;
        startedAt: Date | null;
        finishedAt: Date | null;
        projectId: string;
        assigneeId: string | null;
    }>;
}
