export async function rejectOnError<T extends { error: unknown }>(
  promise: PromiseLike<T>
): Promise<T> {
  const result = await promise;
  if (result.error) {
    if (result.error instanceof Error) {
      throw result.error;
    } else if (typeof result.error === 'string') {
      throw new Error(result.error);
    } else {
      throw Object.assign(new Error(JSON.stringify(result.error)), {
        cause: result.error
      });
    }
  }
  return result;
}
