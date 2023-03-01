import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'steamywolf-angular';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.loggedInStatus().then((response: any) => {
      if (response.status) {
        this.authService.userLoggedInState.next(true);
        this.authService.getCurrentUser(response.user.id).subscribe({
          next: (value: any) => {
            this.authService.currentUser.next(value.foundUser);
          },
          error: (error: any) => {
            console.log(error);
          },
        });
      }
    });
  }
}
