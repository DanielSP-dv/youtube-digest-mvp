export type TRPCUser = { id: string | null };
export interface TRPCContext { user: TRPCUser }