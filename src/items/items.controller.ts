import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Post('upload-images')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './images/',
        filename: (_req, _file, cb) => {
          cb(null, `items-${uuid()}.png`);
        },
      }),
    }),
  )
  async uploadImages(@Body('itemId') itemId: string, @UploadedFiles() files) {
    const response = [];
    files.forEach((file) => {
      const fileReponse = { filename: file.filename };
      response.push(fileReponse);
    });

    await this.itemsService.processItemImages(
      itemId,
      response.map((fileResponse) => fileResponse.filename),
    );

    return response;
  }
}
