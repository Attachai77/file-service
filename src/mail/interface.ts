export interface IContext {
  [key: string]: string
}

export interface ISendEmail {
  email: string;
  subject: string;
  template: string;
  context: IContext
}
