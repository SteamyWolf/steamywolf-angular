import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.userLoggedInState.subscribe((value: boolean) => {
      this.loggedIn = value;
    });
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout().subscribe((response: any) => {
      console.log(response);
      this._snackBar.open('Successfully logged out', 'X', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'successful-snack',
        duration: 5000,
      });
      this.authService.userLoggedInState.next(false);
      this.navigateHome();
    });
  }
}
