import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
    @Redirect('', 302)
    @ApiExcludeEndpoint()
    app() {
        return { url: AppService.getSwaggerUrl() };
    }
}
