export function errorResponse(reason: string) {
  return {status: 'failed', reason: reason};
}

export function successResponse(payload: object) {
  return {status: 'success', ...payload};
}
