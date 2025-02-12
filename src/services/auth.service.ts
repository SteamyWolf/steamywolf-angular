import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { environment } from 'src/environments/environment';

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
    return this.http.post(`${environment.apiUrl}/auth/login`, user, {
      withCredentials: true,
    });
  }

  logout() {
    return this.http.get(`${environment.apiUrl}/auth/logout`, {
      withCredentials: true,
    });
  }

  loggedInStatus() {
    return this.http
      .get(`${environment.apiUrl}/auth/status`, { withCredentials: true })
      .toPromise();
  }

  getCurrentUser(id: number) {
    return this.http.get(`${environment.apiUrl}/auth/current-user/${id}`);
  }

  signupNewUser(user: { username: string; email: string; password: string }) {
    return this.http.post(`${environment.apiUrl}/user`, user);
  }

  signupNewUserEmail(user: { username: string; email: string }) {
    return this.http.post(`${environment.apiUrl}/user/email`, user);
  }

  forgotUserPasswordRequest(email: string) {
    return this.http.post(`${environment.apiUrl}/user/forgot-password`, {
      email,
    });
  }

  resetUserPasswordVerification(id: string, token: string) {
    return this.http.get(
      `${environment.apiUrl}/user/reset-password/${id}/${token}`
    );
  }

  resetUserPassword(id: string, password: string) {
    return this.http.post(
      `${environment.apiUrl}/user/reset-password-request`,
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
      `${environment.apiUrl}/upload`,
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
      `${environment.apiUrl}/upload/thumbnail`,
      { file, public_id },
      { withCredentials: true }
    );
  }

  getRecentSubmissions(nsfw: boolean) {
    return this.http.get(`${environment.apiUrl}/submissions/${nsfw}`);
  }

  getPageRequestedSubmissions(skip: number, take: number, nsfw: boolean) {
    return this.http.get(
      `${environment.apiUrl}/submissions/browse/${skip}/${take}/${nsfw}`
    );
  }

  getSearchQueryRequestedSubmissions(
    query: string,
    skip: number,
    take: number,
    nsfw: boolean
  ) {
    return this.http.get(
      `${environment.apiUrl}/post/search/${query}/${skip}/${take}/${nsfw}`
    );
  }

  getCountOfAllSubmissions(nsfw: boolean) {
    return this.http.get(`${environment.apiUrl}/submissions/count/${nsfw}`);
  }

  getCountOfSearchedQuery(query: string, nsfw: boolean) {
    return this.http.get(
      `${environment.apiUrl}/post/search-count/${query}/${nsfw}`
    );
  }

  getPost(postId: number) {
    return this.http.get(`${environment.apiUrl}/post/find/${postId}`);
  }

  postComment(postId: number, comment: string) {
    return this.http.post(
      `${environment.apiUrl}/comment`,
      {
        postId,
        comment,
      },
      { withCredentials: true }
    );
  }

  checkUsername(username: string) {
    return this.http.get(`${environment.apiUrl}/auth/${username}`);
  }

  addNewFavoritePost(favoritePost: any) {
    return this.http.post(
      `${environment.apiUrl}/post/add-favorite`,
      {
        favoritePost,
      },
      { withCredentials: true }
    );
  }

  removeFavoritedPost(postId: number) {
    return this.http.post(
      `${environment.apiUrl}/post/remove-favorite`,
      { postId },
      { withCredentials: true }
    );
  }

  updateNsfwChecked(nsfw: boolean) {
    return this.http.post(
      `${environment.apiUrl}/user/nsfw`,
      { nsfw },
      { withCredentials: true }
    );
  }

  getUserOfFavoritePost(userId: number) {
    return this.http.get(`${environment.apiUrl}/user/userId/${userId}`).toPromise();
  }

  saveEditedComment(comment: any) {
    return this.http.post(`${environment.apiUrl}/comment/update`, comment);
  }

  deleteComment(comment: any) {
    return this.http.delete(`${environment.apiUrl}/comment/delete/${comment.comment.id}`);
  }

  deletePost(postId: number, public_id: string) {
    return this.http.delete(`${environment.apiUrl}/post/${postId}/${public_id}`);
  }
}
