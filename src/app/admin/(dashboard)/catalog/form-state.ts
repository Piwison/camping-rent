// Shared form state for the catalog server actions. Kept out of actions.ts
// because a "use server" module may only export async functions.
export type FormState = { errors: Record<string, string> };
export const emptyFormState: FormState = { errors: {} };
