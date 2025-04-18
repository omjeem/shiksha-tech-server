// utils/dbErrorHandler.ts

export const handleUniqueConstraintError = (
  err: any,
  fieldErrorMap: Record<string, string>,
) => {
  const detail = err.detail as string;
  for (const [column, message] of Object.entries(fieldErrorMap)) {
    if (detail.includes(column)) {
      throw message;
    }
  }
  throw 'A unique constraint was violated.';
};
