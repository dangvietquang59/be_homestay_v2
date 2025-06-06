export class AppError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number = 500, data?: any) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.data = data;
  }
}
