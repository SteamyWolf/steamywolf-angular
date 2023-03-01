import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, AfterViewInit, OnDestroy {
  signupForm: FormGroup;
  usernameLoading: boolean = false;
  createNewUserLoading: boolean = false;
  matcher = new MyErrorStateMatcher();
  subscriptions: Subscription[] = [];
  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        confirmPassword: new FormControl(''),
      },
      { validators: this.checkPasswords }
    );
  }

  ngAfterViewInit(): void {
    this.signupForm.setErrors({ usernameChecked: true });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  checkPasswords(group: AbstractControl): ValidationErrors | null {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  checkUsernameAvailability(submitFormTriggered: boolean) {
    this.usernameLoading = true;
    this.subscriptions.push(
      this.authService
        .checkUsername(this.signupForm.controls['username'].value)
        .subscribe(
          (response: any) => {
            this.usernameLoading = false;
            if (submitFormTriggered) {
              this.createNewUserLoading = true;
              const user = {
                username: this.signupForm.controls['username'].value,
                email: this.signupForm.controls['email'].value,
                password: this.signupForm.controls['password'].value,
              };
              this.subscriptions.push(
                this.authService.signupNewUser(user).subscribe(
                  (user: any) => {
                    this.subscriptions.push(
                      this.authService
                        .signupNewUserEmail({
                          username: user.username,
                          email: user.email,
                        })
                        .subscribe({
                          next: (value) => {},
                          error: (error) => console.log(error),
                        })
                    );
                    this.createNewUserLoading = false;
                    const loginNewUser = {
                      username: user.username,
                      password: this.signupForm.controls['password'].value,
                    };
                    this.subscriptions.push(
                      this.authService
                        .login(loginNewUser)
                        .subscribe((response: any) => {
                          this._snackBar.open(
                            `Welcome ${user.username} to SteamyWolf!`,
                            'X',
                            {
                              horizontalPosition: 'center',
                              verticalPosition: 'top',
                              panelClass: 'successful-snack',
                              duration: 5000,
                            }
                          );
                          this.authService.userLoggedInState.next(true);
                          this.router.navigate(['/']);
                        })
                    );
                  },
                  (error) => {
                    console.log(error);
                    this.createNewUserLoading = false;
                    this._snackBar.open(
                      'There was a server error when creating a new account. Please try again',
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
            } else {
              this._snackBar.open(
                `${this.signupForm.controls['username'].value} is available!`,
                'X',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  panelClass: 'successful-snack',
                  duration: 5000,
                }
              );
            }
          },
          (error) => {
            console.log(error);
            this.usernameLoading = false;
            this._snackBar.open(
              'There was a server error when checking for unique username',
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
  }

  submitForm() {
    this.checkUsernameAvailability(true);
  }
}

class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(
      control?.parent?.invalid && control?.parent?.dirty
    );

    return invalidCtrl || invalidParent;
  }
}
