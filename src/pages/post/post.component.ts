import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialog } from 'src/components/image-dialog/image-dialog.component';
import { Subscription } from 'rxjs';

export interface ImageDialogData {
  source: string;
}

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit, OnDestroy {
  post: any = {};
  user: any = {};
  comment: string;
  userLoggedIn: boolean = false;
  hasBeenAddedToFavorites: boolean = false;
  subscriptions: Subscription[] = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const postId = parseInt(this.router.url.split('/')[2]);
    this.subscriptions.push(
      this.authService.getPost(postId).subscribe(
        (response: any) => {
          console.log(response);
          this.post = response.response.foundPost;
          this.user = response.response.userFound;
        },
        (err) => {
          console.error(err);
          this._snackBar.open(
            'There seemed to have been a server issue. Please try again',
            'X',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: 'error-snack',
              duration: 5000,
            }
          );
        }
      )
    );

    this.subscriptions.push(
      this.authService.currentUser.subscribe({
        next: (value: any) => {
          if (value) {
            this.userLoggedIn = true;
            const postInFavorites = value.favorites.find(
              (favorite: any) =>
                +favorite.id === parseInt(this.router.url.split('/')[2])
            );
            if (postInFavorites?.id) {
              this.hasBeenAddedToFavorites = true;
            }
          }
        },
        error: (error) => {
          console.log(error);
          this._snackBar.open(
            'There seemed to have been a server issue. Please try again',
            'X',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: 'error-snack',
              duration: 5000,
            }
          );
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  submitComment() {
    this.subscriptions.push(
      this.authService
        .postComment(parseInt(this.post.id), this.comment)
        .subscribe(
          (response: any) => {
            this.comment = '';
            this.ngOnInit();
          },
          (error) => {
            console.log(error);
            if (error.error.message === 'Token does not exist or has expired') {
              this._snackBar.open(
                'Please sign in again. Your session has expired.',
                'X',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  panelClass: 'error-snack',
                  duration: 5000,
                }
              );
              this.router.navigate(['/login']);
            }
          }
        )
    );
  }

  addRemoveFavorite() {
    if (this.hasBeenAddedToFavorites) {
      this.subscriptions.push(
        this.authService
          .removeFavoritedPost(parseInt(this.router.url.split('/')[2]))
          .subscribe({
            next: (value: any) => {
              console.log(value);
              this.hasBeenAddedToFavorites = false;
              this.authService.currentUser.next(value.removedFavoriteUser);
              this._snackBar.open('Successfully removed from favorites', 'X', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: 'successful-snack',
                duration: 5000,
              });
            },
            error: (error) => {
              console.log(error);
              this._snackBar.open(
                'There was an error removing from favorites. Please try again',
                'X',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  panelClass: 'error-snack',
                  duration: 5000,
                }
              );
            },
          })
      );
    }
    if (!this.hasBeenAddedToFavorites) {
      this.subscriptions.push(
        this.authService.addNewFavoritePost(this.post).subscribe({
          next: (value: any) => {
            this.hasBeenAddedToFavorites = true;
            this.authService.currentUser.next(value.addedFavoriteUser);
            this._snackBar.open('Successfully added to favorites', 'X', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: 'successful-snack',
              duration: 5000,
            });
          },
          error: (error) => {
            console.log(error);
            this._snackBar.open(
              'There was an error adding to favorites. Please try again',
              'X',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: 'error-snack',
                duration: 5000,
              }
            );
          },
        })
      );
    }
  }

  openFullScreenImageDialog() {
    this.dialog.open(ImageDialog, {
      data: { source: this.post.image },
      panelClass: 'image-screen-dialog',
    });
  }
}
