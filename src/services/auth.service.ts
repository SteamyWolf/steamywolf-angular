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
  currentUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);
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

  uploadNewUserThumbnail(file: string, public_id: string) {
    return this.http.post(
      'http://localhost:4000/api/upload/thumbnail',
      { file, public_id },
      { withCredentials: true }
    );
  }

  getRecentSubmissions(nsfw: boolean) {
    return this.http.get(`http://localhost:4000/api/submissions/${nsfw}`);
  }

  getPageRequestedSubmissions(skip: number, take: number, nsfw: boolean) {
    return this.http.get(
      `http://localhost:4000/api/submissions/browse/${skip}/${take}/${nsfw}`
    );
  }

  getSearchQueryRequestedSubmissions(
    query: string,
    skip: number,
    take: number,
    nsfw: boolean
  ) {
    return this.http.get(
      `http://localhost:4000/api/post/search/${query}/${skip}/${take}/${nsfw}`
    );
  }

  getCountOfAllSubmissions(nsfw: boolean) {
    return this.http.get(`http://localhost:4000/api/submissions/count/${nsfw}`);
  }

  getCountOfSearchedQuery(query: string, nsfw: boolean) {
    return this.http.get(
      `http://localhost:4000/api/post/search-count/${query}/${nsfw}`
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

  addNewFavoritePost(favoritePost: any) {
    return this.http.post(
      'http://localhost:4000/api/post/add-favorite',
      {
        favoritePost,
      },
      { withCredentials: true }
    );
  }

  removeFavoritedPost(postId: number) {
    return this.http.post(
      'http://localhost:4000/api/post/remove-favorite',
      { postId },
      { withCredentials: true }
    );
  }

  updateNsfwChecked(nsfw: boolean) {
    return this.http.post(
      'http://localhost:4000/api/user/nsfw',
      { nsfw },
      { withCredentials: true }
    );
  }

  getUserOfFavoritePost(userId: number) {
    return this.http.get(`http://localhost:4000/api/user/userId/${userId}`).toPromise();
  }
}
