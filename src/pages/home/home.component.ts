import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

interface RecentSubmission {
  id: number;
  image: string;
  title: string;
  description: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  // @Input() imageSrc: string;
  recentSubmissions: any[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.currentUser.subscribe({
        next: (currentUser: any) => {
          this.subscriptions.push(
            this.authService.getRecentSubmissions(currentUser?.nsfw_checked || false).subscribe((data: any) => {
                  console.log(data);
                  data.forEach((submission: any) => {
                    submission.post.submissions.imageLoaded = false;
                  });
                  this.recentSubmissions = data;
                }, (error) => {
                    console.log(error);
                    this._snackBar.open('There was an error fetching the posts. Please try again','X',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        panelClass: 'error-snack',
                        duration: 7000,
                      }
                  );
                }
              )
          );
        }, error: (err) => {
          console.error(err);
        }
      })
    );
  }

  postNavigate(id: number) {
    this.router.navigate(['post', id]);
  }

  imageFinishedLoading(submission: any) {
    submission.imageLoaded = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe);
  }

  // imageLoaded(submission: any) {
  //   // submission.imageLoaded = true;
  //   return submission.imageLoaded;
  // }
}
