import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

interface User {
  username: String;
  password: String;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  userLoggedInState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  currentUser: Subject<any> = new Subject<any>();
  constructor(private http: HttpClient) {}

  login(user: User) {
    return this.http.post('http://localhost:4000/api/auth/login', user, {
      withCredentials: true,
    });
  }

  logout() {
    return this.http.get('http://localhost:4000/api/auth/logout', {
      withCredentials: true,
    });
  }

  loggedInStatus() {
    return this.http
      .get('http://localhost:4000/api/auth/status', { withCredentials: true })
      .toPromise();
  }

  getCurrentUser(id: number) {
    return this.http.get(`http://localhost:4000/api/auth/current-user/${id}`);
  }

  signupNewUser(user: { username: string; email: string; password: string }) {
    return this.http.post('http://localhost:4000/api/user', user);
  }

  signupNewUserEmail(user: { username: string; email: string }) {
    return this.http.post('http://localhost:4000/api/user/email', user);
  }

  forgotUserPasswordRequest(email: string) {
    return this.http.post('http://localhost:4000/api/user/forgot-password', {
      email,
    });
  }

  resetUserPasswordVerification(id: string, token: string) {
    return this.http.get(
      `http://localhost:4000/api/user/reset-password/${id}/${token}`
    );
  }

  resetUserPassword(id: string, password: string) {
    return this.http.post(
      'http://localhost:4000/api/user/reset-password-request',
      { id, password }
    );
  }

  upload(
    file: string | ArrayBuffer,
    title: string,
    description: string,
    tags: string[],
    nsfw: string
  ) {
    return this.http.post(
      'http://localhost:4000/api/upload',
      {
        file: file,
        title: title,
        description: description,
        tags: tags,
        nsfw: nsfw,
      },
      { withCredentials: true }
    );
  }

  getRecentSubmissions(page: string) {
    return this.http.get(`http://localhost:4000/api/submissions/${page}`);
  }

  getPageRequestedSubmissions(skip: number, take: number) {
    return this.http.get(
      `http://localhost:4000/api/submissions/browse/${skip}/${take}`
    );
  }

  getSearchQueryRequestedSubmissions(
    query: string,
    skip: number,
    take: number
  ) {
    return this.http.get(
      `http://localhost:4000/api/post/search/${query}/${skip}/${take}`
    );
  }

  getCountOfAllSubmission() {
    return this.http.get('http://localhost:4000/api/submissions/count');
  }

  getCountOfSearchedQuery(query: string) {
    return this.http.get(
      `http://localhost:4000/api/post/search-count/${query}`
    );
  }

  getPost(postId: number) {
    return this.http.get(`http://localhost:4000/api/post/find/${postId}`);
  }

  postComment(postId: number, comment: string) {
    return this.http.post(
      'http://localhost:4000/api/comment',
      {
        postId,
        comment,
      },
      { withCredentials: true }
    );
  }

  checkUsername(username: string) {
    return this.http.get(`http://localhost:4000/api/auth/${username}`);
  }
}
