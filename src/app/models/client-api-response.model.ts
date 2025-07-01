import { Client } from './client.model';

export interface ClientApiResponse {
  clients: Client[];
  totalPages: number;
}