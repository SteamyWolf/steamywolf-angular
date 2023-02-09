import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  post: any = {};
  user: any = {};
  comment: string;
  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const postId = parseInt(this.router.url.split('/')[2]);
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
    );
  }

  submitComment() {
    this.authService
      .postComment(parseInt(this.post.id), this.comment)
      .subscribe(
        (response: any) => {
          console.log(response);
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
      );
  }
}
