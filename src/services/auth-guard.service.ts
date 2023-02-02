import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  // prettier-ignore
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.loggedInStatus().then((response: any) => {
        if (response.status) {
            return true
        } else {
            return false
        }
    }).catch(err => {
        console.log(err);
        this._snackBar.open(
            'You must sign in first',
            'X',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: 'error-snack',
              duration: 5000,
            }
          );
        this.router.navigate(['/login']);
        return false
    })
  }
}
