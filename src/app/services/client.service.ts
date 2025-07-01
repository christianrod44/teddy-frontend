import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { ClientApiResponse } from '../models/client-api-response.model';

const BASE_URL = 'https://boasorte.teddybackoffice.com.br';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  getClients(page: number, limit: number): Observable<ClientApiResponse> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('limit', limit.toString());

    return this.http.get<ClientApiResponse>(`${BASE_URL}/users`, { params });
  }

  createClient(client: Omit<Client, 'id' | 'selected'>): Observable<Client> {
    return this.http.post<Client>(`${BASE_URL}/users`, client);
  }

  updateClient(id: number, clientData: { name?: string; salary?: number; companyValuation?: number }): Observable<Client> {
    return this.http.patch<Client>(`${BASE_URL}/users/${id}`, clientData);
  }
  
  deleteClient(id: number): Observable<any> { // Mudamos para <any> pois não estamos esperando um tipo Client ou void no sucesso
    return this.http.delete(`${BASE_URL}/users/${id}`, { responseType: 'text' });
  }
}