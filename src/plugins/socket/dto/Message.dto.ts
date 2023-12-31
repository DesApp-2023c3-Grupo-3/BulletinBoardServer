import { AdvertisingMessageDto } from './AdvertisingMessage.dto';
import { ConnectionMessageDto } from './ConnectionMessage.dto';
import { CourseMessageDto } from './CourseMessage.dto';

type Actions =
  | 'START_CONNECTION'
  | 'CREATE_ADVERTISING'
  | 'UPDATE_ADVERTISING'
  | 'DELETE_ADVERTISING'
  | 'CREATE_COURSES'
  | 'UPDATE_SCREEN_CONFIGURATION'
  | 'SCREEN_REMOTE_DISCONNECT';

export class MessageDto {
  id: number;
  action: Actions;
  data: AdvertisingMessageDto | CourseMessageDto[] | ConnectionMessageDto;
}
