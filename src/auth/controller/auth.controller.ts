import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignInDto, SignUpDto } from '../dto';
import { AuthGuard } from '../guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() body: SignInDto.Body) {
    return this.authService.signIn(body.username, body.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  async signUp(@Body() body: SignUpDto.Body) {
    await this.authService.signUp(body.username, body.password);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getHello(@Request() req): string {
    return req.user;
  }
}
