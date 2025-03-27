import { pgEnum } from "drizzle-orm/pg-core";
import { Attendence_Interface, ClassName_Interface, SchoolBoard_Interface } from "../utils/interfaces";

export const classNameEnum = pgEnum(
    'className',
    Object.values(ClassName_Interface) as [string, ...string[]],
);

export const schoolBoardEnum = pgEnum(
    'role',
    Object.values(SchoolBoard_Interface) as [string, ...string[]],
);

export const attendenceEnum = pgEnum(
    'attendence',
    Object.values(Attendence_Interface) as [string, ...string[]],
);

export const schoolStaffRoleEnum = pgEnum(
    'schoolStaffRole',
    Object.values(SchoolBoard_Interface) as [string, ...string[]],
);