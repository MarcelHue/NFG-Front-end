import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthUsers} from '../../Models/AuthUsers';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  autUrl = `https://localhost:5001/Users/authenticate`;
  public currentUser: Observable<AuthUsers>;
  private currentUserSubject: BehaviorSubject<AuthUsers>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<AuthUsers>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AuthUsers {
    return this.currentUserSubject.value;
  }

  login(EMail, password): Observable<AuthUsers> {
    return this.http.post<AuthUsers>(this.autUrl, {EMail, password})
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);

        return user;
      }));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
