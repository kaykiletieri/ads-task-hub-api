import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFcmTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'FCM Token',
    example:
      'ep_f6pbkxUfIgcmAoxwe88:APA91bH3PSTz_tMjUjmU-f2sI5jOJNMlF7OnjagLFZqa3rFuDvKAToDWdUXi_c4Q_rSOzLQTgjD5P1XWCp9pFEYksUj1fsBGldadG8A5NI3rGxLxGYm9EruXIv_HSScKZJksH2tWseZK',
    required: true,
    type: 'string',
  })
  fcm_token: string;
}
