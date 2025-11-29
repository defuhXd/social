import {Address} from './address.interface';

export enum ReceiverType {
  UNIVERSITY = 'UNIVERSITY',
  COLLEGE = 'COLLEGE',
  SCHOOL = 'SCHOOL',
  OTHER = 'OTHER',
}

export interface Worker {
  id?: number; // добавляем id для бэкенда
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  educationType: ReceiverType;
  education: string;
  skills: string;
  experience: string;
  profession: string;
  addresses: Address[];
}

export interface Job {
  id?: number;
  companyName: string;
  email: string;
  phone: string;
  website: string;
  educationType: ReceiverType;
  education: string;
  skills: string;
  experience: string;
  profession: string;
  addresses: Address[];
}
