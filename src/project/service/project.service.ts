import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma';
import { ProjectStatus } from '@prisma/client';

import { IProjectService } from '../types/project.service.types';

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMany({
    userId,
    limit = 10,
    offset = 0,
    search,
  }: IProjectService.GetMany.Parameters): IProjectService.GetMany.ReturnType {
    const whereClause = {
      userId,
      ...(search && {
        OR: [{ name: { contains: search } }, { url: { contains: search } }],
      }),
    };

    const [projects, total] = await Promise.all([
      this.prismaService.project.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
      }),
      this.prismaService.project.count({ where: whereClause }),
    ]);

    return {
      data: projects,
      total,
      size: projects.length,
      offset,
      limit,
    };
  }

  async create({
    userId,
    ...body
  }: IProjectService.Create.Parameters): IProjectService.Create.ReturnType {
    return this.prismaService.project.create({
      data: {
        name: body.name,
        url: body.url,
        status: body.status || ProjectStatus.active,
        userId: userId,
        expiredAt: new Date(Date.now()),
      },
    });
  }

  async count(
    args: IProjectService.Count.Parameters,
  ): IProjectService.Count.ReturnType {
    return this.prismaService.project.count(args);
  }

  async update({
    id,
    ...data
  }: IProjectService.Update.Parameters): IProjectService.Update.ReturnType {
    return this.prismaService.project.update({
      where: { id },
      data,
    });
  }

  async delete({
    id,
  }: IProjectService.Delete.Parameters): IProjectService.Delete.ReturnType {
    return this.prismaService.project.update({
      where: { id },
      data: { status: ProjectStatus.deleted },
    });
  }

  async checkExpiredProjects() {
    const now = new Date();

    await this.prismaService.project.updateMany({
      where: {
        expiredAt: {
          lt: now,
        },
      },
      data: {
        status: ProjectStatus.expired,
      },
    });

    console.log('Expired projects updated');
  }
}
