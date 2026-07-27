export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_SERVER_ERROR'

const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
}

export function httpStatusForApiErrorCode(code: ApiErrorCode): number {
  return STATUS_BY_CODE[code]
}

// Same {code, message} shape as tRPC's TRPCError, kept so service functions
// didn't need to change beyond the import when tRPC was removed.
export class ApiError extends Error {
  code: ApiErrorCode

  constructor({ code, message }: { code: ApiErrorCode; message: string }) {
    super(message)
    this.code = code
  }
}
