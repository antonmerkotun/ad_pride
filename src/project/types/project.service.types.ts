import { Prisma, Project } from '@prisma/client';

export namespace IProjectService {
  export namespace GetMany {
    export type Parameters = {
      userId: number;
      limit?: number;
      offset?: number;
      search?: string;
    };

    export type ReturnType = Promise<{
      data: Project[];
      total: number;
      size: number;
      offset: number;
      limit: number;
    }>;
  }

  export namespace Create {
    export type Parameters = Project & { userId: number };

    export type ReturnType = Promise<Project>;
  }

  export namespace Count {
    export type Parameters = Prisma.ProjectCountArgs;

    export type ReturnType = Promise<number>;
  }

  export namespace Update {
    export type Parameters = Partial<Prisma.ProjectUpdateInput> & {
      id: number;
    };

    export type ReturnType = Promise<Project>;
  }

  export namespace Delete {
    export type Parameters = { id: number };

    export type ReturnType = Promise<Project>;
  }
}
