import { Project } from '@prisma/client';

export namespace CreateDto {
  export type Body = Project;

  export type Response = Promise<Project>;
}
