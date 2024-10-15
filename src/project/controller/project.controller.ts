import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Project } from '@prisma/client';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { ProjectService } from '../service/project.service';
import { CreateDto, GetManyDto, UpdateDto } from '../dto';

@UseGuards(AuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async list(
    @Request() req,
    @Query() query: GetManyDto.Query,
  ): Promise<GetManyDto.Response> {
    const userId = req.user.sub as number;
    return this.projectService.getMany({ userId, ...query });
  }

  @Post()
  async create(
    @Request() req,
    @Body() body: CreateDto.Body,
  ): CreateDto.Response {
    const userId = req.user.sub as number;
    return this.projectService.create({ userId, ...body });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateDto.Body,
  ): UpdateDto.Response {
    const projectId = parseInt(id, 10);
    return this.projectService.update({ id: projectId, ...body });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Project> {
    const projectId = parseInt(id, 10);
    return this.projectService.delete({ id: projectId });
  }

  @Cron('*/1 * * * *')
  async checkExpiredProjects(): Promise<void> {
    this.projectService.checkExpiredProjects();
  }
}
