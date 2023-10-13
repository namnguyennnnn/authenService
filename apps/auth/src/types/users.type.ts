import { Observable } from 'rxjs';

export interface Users {
  uid: string;
  UserName: string;
  Password: string;
  Account: string;
  Avatar: string;
  IsVerified: boolean;
}


export interface UsersService {
  GetUserById(params: { uid: string }): Observable<Users>;
  AddUser(
    params: Omit<Users, 'uid'>,
  ): Observable<{ StatusCode: string; StausDetail: string }>;
  VerifyAccount(payload: { account: string }): Observable<void>;
  GetUserByEmail(payload: { account: string }): Observable<Users>;
}
