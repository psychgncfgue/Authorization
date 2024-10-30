import { IsInt, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsInt()
  @Min(1)
  amount: number;

  @IsString()
  currency: string;
}