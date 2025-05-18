import { Request } from 'express';

export enum SchoolBoard_Enum {
  CBSE = 'CBSE',
  ICSE = 'ICSE',
  STATE = 'STATE',
  IB = 'IB',
}

export enum StudentGender_Enum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum Attendence_Enum {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LEAVE = 'LEAVE',
  MEDICAL = 'MEDICAL',
}

export enum SchoolStaffRole_Enum {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
  ACCOUNTANT = 'ACCOUNTANT',
  MANAGER = 'MANAGER',
  LIBRARIAN = 'LIBRARIAN',
  PEON = 'PEON',
  DRIVER = 'DRIVER',
  SECURITY = 'SECURITY',
  CLEANER = 'CLEANER',
  GATEKEEPER = 'GATEKEEPER',
  GARDENER = 'GARDENER',
  COOK = 'COOK',
  HELPER = 'HELPER',
  STUDENT = 'STUDENT',
  PARENTS = 'PARENTS',
}

export enum ClassName_Enum {
  PLAYGROUP = 'PLAYGROUP',
  NURSERY = 'NURSERY',
  LKG = 'LKG',
  UKG = 'UKG',
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
  SIX = 'SIX',
  SEVEN = 'SEVEN',
  EIGHT = 'EIGHT',
  NINE = 'NINE',
  TEN = 'TEN',
  ELEVEN = 'ELEVEN',
  TWELVE = 'TWELVE',
}

export interface Request_Interface {
  user: {
    schoolId: string;
    studentId?: string;
    staffId?: string;
    role?: SchoolStaffRole_Enum;
    iat?: number;
    exp?: number;
  };
}

export interface CustomRequest extends Request_Interface, Request {}
