// import { Address } from './address.model';
import { ReceiverType } from './enums';
import {Address} from './address.interface';

export interface Worker {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string; // или Date если будешь парсить
  educationType: ReceiverType;
  education?: string;
  skills?: string;
  experience?: string;
  profession?: string;
  addresses: Address[];
}
