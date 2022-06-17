import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EventsService } from './events.service';
import { v4 as uuid } from 'uuid';
import { diskStorage } from 'multer';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post('upload-images')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './images/',
        filename: (_req, _file, cb) => {
          cb(null, `events-${uuid()}.png`);
        },
      }),
    }),
  )
  async uploadImages(@Body('eventId') eventId: string, @UploadedFiles() files) {
    const response = [];

    files?.forEach((file) => {
      const fileResponse = { filename: file.filename };
      response.push(fileResponse);
    });

    await this.eventsService.processEventImages(
      eventId,
      response.map((eventResponse) => eventResponse.filename),
    );

    return response;
  }
}
