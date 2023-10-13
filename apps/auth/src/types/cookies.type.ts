export interface CookiesReturnType {
  access_token: {
    value: string;
    expire: number;
  };
  refresh_token: {
    value: string;
    expire: number;
  };
}
