import { UserRole } from "./user-role.model";

export class User {

    id : string = '';
    username : string = '';
    password : string = '';
    name : string = '';
    surname : string = '';
    age: number = 0;
    email : string = '';
    role: UserRole = UserRole.User;
    avatarURL? : string = '';
}
  