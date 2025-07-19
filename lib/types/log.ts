export interface Log {
  id: string;
  entityId: string;
  userId: string;
  userName: string;
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: string;
}
