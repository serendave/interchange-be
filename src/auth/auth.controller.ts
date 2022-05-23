import {
  Body,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images/',
        filename: (_req, _file, cb) => {
          cb(null, `profile-${uuid()}.png`);
        },
      }),
    }),
  )
  async uploadProfilePhoto(
    @Body('profileId') profileId: string,
    @UploadedFile() file,
  ) {
    await this.authService.processProfilePhoto(profileId, file.filename);

    return {
      profile: profileId,
      photo: file.path,
    };
  }
}
