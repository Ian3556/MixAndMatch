export class OperationTimedOutError extends Error {
  constructor() {
    super('The operation timed out.');
    this.name = 'OperationTimedOutError';
  }
}

export async function withTimeout<T>(promise: PromiseLike<T>, timeoutMs = 15_000): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      Promise.resolve(promise),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new OperationTimedOutError()), timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}
