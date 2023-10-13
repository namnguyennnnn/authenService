import { Observable } from 'rxjs';

export interface Users {
  uid: string;
  user_name: string;
  password: string;
  account: string;
  avatar: string;
  is_verified: boolean;
}

export interface UsersService {
  GetUserById(params: { uid: string }): Observable<Users>;
  AddUser(
    params: Omit<Users, 'uid'>,
  ): Observable<{ StatusCode: string; StausDetail: string }>;
  VerifyAccountRequest(payload: { account: string }): void;
  GetUserByEmail(payload: { account: string }): Observable<Users>;
}
