import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

interface User {
  posts: any[];
  image: string;
  title: string;
  id: number;
  thumbnail: string;
  username: string;
  createdAt: string;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, OnDestroy {
  user: User;
  alteredUserPosts: any[] = [];
  allUserPosts: any[] = [];
  seeAllPostsOpened: boolean = false;

  alteredUserFavorites: any[] = [];
  allUserFavorites: any[] = [];
  seeAllFavoritesOpened: boolean = false;

  subscriptions: Subscription[] = [];
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.currentUser.subscribe({
        next: (value: any) => {
          console.log(value);
          if (value) {
            this.alteredUserPosts = value?.posts?.slice(0, 4);
            this.allUserPosts = value?.posts;

            this.alteredUserFavorites = value?.favorites.slice(0, 4);
            this.allUserFavorites = value?.favorites;
            this.user = value;
          }
        },
        error: (error: any) => {
          console.log(error);
        },
      })
    );
  }

  postNavigate(id: number) {
    this.router.navigate(['post', id]);
  }

  handleSeeAll(type: string) {
    if (type === 'posts') {
      if (!this.seeAllPostsOpened) {
        this.seeAllPostsOpened = true;
        this.alteredUserPosts = this.allUserPosts;
      } else {
        this.seeAllPostsOpened = false;
        this.alteredUserPosts = this.allUserPosts.slice(0, 4);
      }
    }
    if (type === 'favorites') {
      if (!this.seeAllFavoritesOpened) {
        this.seeAllFavoritesOpened = true;
        this.alteredUserFavorites = this.allUserFavorites;
      } else {
        this.seeAllFavoritesOpened = false;
        this.alteredUserFavorites = this.allUserFavorites.slice(0, 4);
      }
    }
  }

  navigateEdit() {
    this.router.navigate(['account', 'edit']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe);
  }
}
