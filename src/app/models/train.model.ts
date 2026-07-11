export interface Train {
  id?: number;
  direction: string;
  departure: string;
  arrival: string;
  travelTime: string;
  tripNumber: string;
  tickets: number;
  isConfirmed?: boolean; 
}