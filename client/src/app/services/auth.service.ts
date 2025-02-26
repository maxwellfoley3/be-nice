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
    this.setToken(uuid);
    // For now, we'll use the UUID as both token and userId
    this.setUserId(parseInt(uuid.replace(/-/g, '').slice(0, 8), 16));
  }

  async authenticate(id: string): Promise<void> {
    try {
      const response = await this.http.post<AuthResponse>(`${API_URL}/auth/register`, { id })
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

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserId(): number | null {
    const userId = localStorage.getItem(this.userIdKey);
    return userId ? parseInt(userId) : null;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);
  }

  private setUserId(userId: number): void {
    localStorage.setItem(this.userIdKey, userId.toString());
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
} 