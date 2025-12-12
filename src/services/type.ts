export type DetailMessageType = {
  message: string;
  details?: [{ messages: string }];
  [key: string]: unknown;
}
