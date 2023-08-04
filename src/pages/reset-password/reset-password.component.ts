import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;
  tokenValid: boolean = false;
  matcher = new MyErrorStateMatcher();
  subscriptions: Subscription[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private _matSnack: MatSnackBar
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    this.subscriptions.push(
      this.authService
        .resetUserPasswordVerification(params['id'], params['token'])
        .subscribe({
          next: (value) => {
            this.tokenValid = true;
          },
          error: (error) => {
            this.tokenValid = false;
            this._matSnack.open(
              'Link may have expired. Please submit another request on the password reset page',
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

    this.resetPasswordForm = new FormGroup(
      {
        password: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required),
      },
      {
        validators: this.checkPasswords,
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  checkPasswords(group: AbstractControl): ValidationErrors | null {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  submitForm() {
    this.subscriptions.push(
      this.authService
        .resetUserPassword(
          this.route.snapshot.params['id'],
          this.resetPasswordForm.controls['password'].value
        )
        .subscribe({
          next: (value) => {
            this.router.navigate(['/login']);
            this._matSnack.open(
              'Successfully updated password. Go ahead and login',
              'X',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: 'successful-snack',
                duration: 5000,
              }
            );
          },
          error: (error) => {
            console.log(error);
          },
        })
    );
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
