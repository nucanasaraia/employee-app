export interface EmployeeLog {
  id: number;
  employeeId?: number;
  employeeName?: string;
  action: string;
  description: string;
  performedAt: string;
}