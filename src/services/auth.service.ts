import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface User {
  username: String;
  password: String;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  userLoggedInState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
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

  signupNewUser(user: { username: string; email: string; password: string }) {
    return this.http.post('http://localhost:4000/api/user', user);
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

  getCountOfAllSubmission() {
    return this.http.get('http://localhost:4000/api/submissions/count');
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
