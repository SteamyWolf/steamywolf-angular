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
  postCopy: any = {};
  user: any = {};
  loggedInUser: any = {};
  comment: string;
  userLoggedIn: boolean = false;
  hasBeenAddedToFavorites: boolean = false;
  subscriptions: Subscription[] = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    const postId = parseInt(this.router.url.split('/')[2]);
    this.subscriptions.push(
      this.authService.getPost(postId).subscribe(
        (response: any) => {
          response.response.foundPost.comments.forEach((comment: any) => {
            comment.comment.editing = false;
          })
          this.post = response.response.foundPost;
          this.postCopy = structuredClone(this.post);
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
          this.loggedInUser = value;
          if (value) {
            this.userLoggedIn = true;
            const postInFavorites = value.favorites.find((favorite: any) => +favorite.id === parseInt(this.router.url.split('/')[2]));
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

  userOwnsComment(comment: any): boolean {
    if (this.loggedInUser?.comments?.find((userComment: any) => userComment.id === comment.comment.id)) {
      return true;
    } else {
      return false;
    }
  }

  userOwnsPost() {
    if (this.loggedInUser?.posts?.find((post: any) => post.id === parseInt(this.router.url.split('/')[2]))) {
      return true;
    } else {
      return false;
    }
  }

  deletePost() {
    const confirmation = confirm('Are you sure you want to delete this post? It\'ll be gone forever.');
    if (confirmation) {
      console.log('success');
      this.authService.deletePost(this.post.id).subscribe((response) => {
        console.log(response);
        this._snackBar.open('Deleted Successfully', 'X', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'successful-snack',
          duration: 1000
        });
        this.router.navigate(['account']);
      })
    } else {
      console.log('does not want to delete');
    }
  }

  editComment(index: number) {
    this.post.comments[index].comment.editing = true;
  }

  deleteComment(comment: any, index: number) {
    this.post.comments.splice(index, 1);
    this.authService.deleteComment(comment).subscribe((deletedComment: any) => {
      this._snackBar.open('Deleted Successfully', 'X', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'successful-snack',
        duration: 1000
      })
    })
  }

  saveComment(comment: any, index: number) {
    this.post.comments[index].comment.editing = false;
    this.authService.saveEditedComment(comment).subscribe((updatedComment: any) => {
      this._snackBar.open('Saved', 'X', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'successful-snack',
        duration: 1000
      })
    });
  }

  cancelCommentEditing(index: number) {
    this.post.comments[index].comment.text = this.postCopy.comments[index].comment.text;
    this.post.comments[index].comment.editing = false;
  }
}
