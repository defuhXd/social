// import { Address } from './address.model';
import { ReceiverType, ExpAge } from './enums';
import {Address} from './address.interface';

export interface Job {
  id?: number;
  companyName: string;
  email: string;
  phone: string;
  website: string;
  educationType: ReceiverType;
  education: string;
  skills: string;
  experience: ExpAge | string;
  profession: string;
  addresses: Address[];
}
