import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';
interface AuthResponse {
  token: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  private userIdKey = 'user_id';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {
    // Check for token on initialization
    if (!this.hasToken()) {
      this.generateAndStoreUuid();
    }
  }

  private generateAndStoreUuid(): void {
    const uuid = crypto.randomUUID();
    this.setUserId(uuid);
  }

  async authenticate(): Promise<void> {
    try {
      const response = await this.http.post<AuthResponse>(`${API_URL}/auth/register`, { id: this.getUserId() })
        .toPromise();
      
      if (response) {
        this.setToken(response.token);
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.getValue();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserId(): string | null {
    const userId = localStorage.getItem(this.userIdKey);
    return userId;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);
  }

  private setUserId(userId: string): void {
    localStorage.setItem(this.userIdKey, userId);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
} 