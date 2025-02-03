import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MeResponse {
  github: {
    userId: string,
    username: string,
    displayName: string,
    accessToken: string,
    connectedAt: string,
  }
  airtable: {
    userId: string,
    username: string,
    displayName: string,
    accessToken: string,
    connectedAt: string,
  }
  user: {
    accessToken: string
    connectedAt: string
    userId: string
    username: string;
    __v: number;
    _id: string;
  }
}

@Injectable({
  providedIn: 'root',
})
export class GithubIntegrationService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.baseUrl}/auth/me`, {
      withCredentials: true
    });
  }

  connectToGithub(): void {
    window.location.href = `${this.baseUrl}/auth/github`;
  }

  removeIntegration(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/auth/github/logout`, {
      withCredentials: true
    });

  }


  reconnect(): void {
    this.connectToGithub();
  }


  fetchEntityData(entity: string, search?: string, page?: number, pageSize?: number, query?: Record<string, string>): Observable<any> {
    const validEntities = ['organizations', 'repos', 'commits', 'pulls', 'issues', 'organizations-users', 'issues/completed'];
    if (!validEntities.includes(entity)) {
      throw new Error(`Unsupported GitHub entity: ${entity}`);
    }

    let params: any = {};
    if (search) params.searchTerm = search;
    if (page) params.page = page;
    if (pageSize) params.pageSize = pageSize;
    if (query) {
      params = {
        ...params,
        ...query
      }

    }
    return this.http.get<any>(`${this.baseUrl}/github/${entity}`, {
      params,
      withCredentials: true
    });
  }
}
