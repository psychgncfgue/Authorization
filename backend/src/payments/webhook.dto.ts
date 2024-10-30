import { IsString, IsNumber } from 'class-validator';

export class WebhookDto {
  @IsString()
  id: string;

  @IsNumber()
  amount: number;
}