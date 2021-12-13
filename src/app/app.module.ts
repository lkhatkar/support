import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule} from './ng-zorro-antd.module';
import { SupportChatAdminComponent } from './support-chat-admin/support-chat-admin.component';
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';
import { AgentLoginComponent } from './agent-dashboard/agent-login/agent-login.component';
import { TokenInterceptorService } from './token-interceptor.service';
import { AddAgentsComponent } from './agent-dashboard/add-agents/add-agents.component';
import { InitializeComponent } from './initialize/initialize.component';
import { ClipboardModule } from '@angular/cdk/clipboard'


registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    SupportChatAdminComponent,
    AgentDashboardComponent,
    AgentLoginComponent,
    AddAgentsComponent,
    InitializeComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    ClipboardModule
  ],
  providers: [
    {
      provide: NZ_I18N,
      useValue: en_US
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
