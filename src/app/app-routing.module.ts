import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/components/login/login.component';
import { AboutComponent } from 'src/pages/about/about.component';
import { AccountComponent } from 'src/pages/account/account.component';
import { EditAccountComponent } from 'src/pages/account/edit-account/edit-account.component';
import { BrowseComponent } from 'src/pages/browse/browse.component';
import { ForgotPasswordComponent } from 'src/pages/forgot-password/forgot-password.component';
import { HomeComponent } from 'src/pages/home/home.component';
import { PostComponent } from 'src/pages/post/post.component';
import { ResetPasswordComponent } from 'src/pages/reset-password/reset-password.component';
import { SignUpComponent } from 'src/pages/sign-up/sign-up.component';
import { UploadComponent } from 'src/pages/upload/upload.component';
import { AuthGuard } from 'src/services/auth-guard.service';

const routes: Routes = [
  {
    path: 'browse/:query',
    component: BrowseComponent,
  },
  {
    path: 'browse',
    component: BrowseComponent,
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'account/edit',
    component: EditAccountComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'upload',
    component: UploadComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignUpComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'post/:id',
    component: PostComponent,
  },
  {
    path: 'forgot',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password/:id/:token',
    component: ResetPasswordComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
