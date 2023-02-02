import { Component, OnInit } from '@angular/core';
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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getRecentSubmissions().subscribe((data: any) => {
      console.log(data);
      this.recentSubmissions = data;
    });
  }

  postNavigate(id: number) {
    this.router.navigate(['post', id]);
  }
}
