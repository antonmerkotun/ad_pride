import { Project } from '@prisma/client';

export namespace UpdateDto {
  export type Body = Project;

  export type Response = Promise<Project>;
}
