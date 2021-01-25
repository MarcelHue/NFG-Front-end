import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../../Models/Users';
import {Observable} from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userUrls = `https://localhost:5001/Users`;

  constructor(
    private http: HttpClient,
  ) {
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.userUrls, user, httpOptions);
  }

  getSingleUser(UID: string): Observable<User> {
    return this.http.get<User>(`${this.userUrls}/${UID}`);
  }

  favoritesUser(user: User): any {
    return this.http.put<User>(`${this.userUrls}/${user.id}/favorites`, user.favorites, httpOptions).subscribe();
  }
}
