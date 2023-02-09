import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
export class HomeComponent implements OnInit {
  recentSubmissions: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.getRecentSubmissions('home').subscribe(
      (data: any) => {
        console.log(data);
        this.recentSubmissions = data;
      },
      (error) => {
        console.log(error);
        this._snackBar.open(
          'There was an error fetching the posts. Please try again',
          'X',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'error-snack',
            duration: 7000,
          }
        );
      }
    );
  }

  postNavigate(id: number) {
    this.router.navigate(['post', id]);
  }
}
