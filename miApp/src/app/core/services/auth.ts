import { Injectable, signal, computed } from '@angular/core';

export interface UserSession {
    username: string;
    role: 'admin' | 'user';
    isAuthenticated: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly STORAGE_KEY = 'DAM2_AUTH_SESSION';

    // Signal reactivo para el estado en memoria[cite: 4]
    private _currentUser = signal<UserSession | null>(this.readSessionFromStorage());

    // Selectores computados de solo lectura expuestos a la aplicación[cite: 4]
    public currentUser = this._currentUser.asReadonly();
    public isAuthenticated = computed(() => this._currentUser()?.isAuthenticated ?? false);

    /**
     * Valida credenciales requeridas: admin / 123[cite: 4]
     */
    public login(user: string, pass: string): boolean {
        if (user === 'admin' && pass === '123') {
            const sessionData: UserSession = {
                username: user,
                role: 'admin',
                isAuthenticated: true
            };

            // 1. Guardar en memoria reactiva[cite: 5]
            this._currentUser.set(sessionData);

            // 2. Persistir en el navegador (Web Storage API)[cite: 5]
            sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
            return true;
        }
        return false;
    }

    /**
     * Destruye la sesión activa en memoria y en almacenamiento local[cite: 5]
     */
    public logout(): void {
        sessionStorage.removeItem(this.STORAGE_KEY);
        this._currentUser.set(null);
    }

    /**
     * Recupera la sesión al refrescar la página[cite: 5]
     */
    private readSessionFromStorage(): UserSession | null {
        const rawData = sessionStorage.getItem(this.STORAGE_KEY);
        if (!rawData) {
            return null;
        }
        try {
            return JSON.parse(rawData) as UserSession;
        } catch {
            sessionStorage.removeItem(this.STORAGE_KEY);
            return null;
        }
    }
}
