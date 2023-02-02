import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface User {
  username: String;
  password: String;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(user: User) {
    return this.http.post('http://localhost:4000/api/auth/login', user, {
      withCredentials: true,
    });
  }

  upload(file: string | ArrayBuffer, title: string, description: string) {
    // get rid of this or put it in another service
    return this.http.post(
      'http://localhost:4000/api/upload',
      { file: file, title: title, description: description },
      { withCredentials: true }
    );
  }

  getRecentSubmissions() {
    return this.http.get('http://localhost:4000/api/submissions');
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
}
