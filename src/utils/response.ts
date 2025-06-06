import { BaseResponse, Pagination } from "../types/base_response";

export function successResponse<T>(
    data: T,
    message = 'Success',
    code = 200,
    pagination?: Pagination
  ): BaseResponse<T> {
    return {
      code,
      data,
      message,
      ...(pagination && { pagination }),
    };
  }
  
  export function errorResponse(
    message = 'Internal Server Error',
    code = 500,
    data: any = null
  ): BaseResponse<any> {
    return {
      code,
      data,
      message,
    };
  }