import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupportChatAdminComponent } from './support-chat-admin/support-chat-admin.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/admin' },
  { path: 'admin', component: SupportChatAdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
