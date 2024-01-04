import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

export class TodoDto {
  @IsUUID('4')
  id: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  is_done: boolean;
}

export class TodoCreateDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class TodoUpdateDto {
  @IsUUID('4')
  id: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @IsBoolean()
  is_done?: boolean;
}

export class TodoDeleteDto {
  @IsUUID('4')
  id: string;
}

export const todoSchemas = validationMetadatasToSchemas();
