import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  submitForm() {
    this.authService
      .login({
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      })
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.login) {
            this._snackBar.open(
              `Success! You are now logged in as ${this.loginForm.value.username}`,
              'X',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: 'successful-snack',
                duration: 5000,
              }
            );
            this.authService.userLoggedInState.next(true);
            this.authService.getCurrentUser(data.user.id).subscribe({
              next: (value: any) => {
                this.authService.currentUser.next(value.foundUser);
                this.router.navigate(['/']);
              },
              error: (error) => {
                console.log(error);
              },
            });
          }
        },
        (err) => {
          console.log(err);
          this._snackBar.open('Username or password is incorrect', 'X', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'error-snack',
            duration: 5000,
          });
        }
      );
  }
}
