export interface SessionAudit {
  userId: string;
  userType: 'user' | 'admin';
  action: 'login' | 'logout' | 'login_failed' | 'token_invalidated';
  ipAddress: string;
  success: boolean;
  failureReason?: string;
  createdAt: Date;
}
