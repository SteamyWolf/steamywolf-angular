import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/components/login/login.component';
import { AccountComponent } from 'src/pages/account/account.component';
import { HomeComponent } from 'src/pages/home/home.component';
import { PostComponent } from 'src/pages/post/post.component';
import { UploadComponent } from 'src/pages/upload/upload.component';
import { AuthGuard } from 'src/services/auth-guard.service';

const routes: Routes = [
  {
    path: 'account',
    component: AccountComponent,
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
    path: 'post/:id',
    component: PostComponent,
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
