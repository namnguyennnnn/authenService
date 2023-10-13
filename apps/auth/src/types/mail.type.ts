import { Observable } from 'rxjs';

export interface Mail {
  message: string;
}

export interface MailService {
  sendMail(params: { account: string }): Observable<Mail>;
}
