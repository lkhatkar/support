import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';



@Component({
  selector: 'app-support-chat-admin',
  templateUrl: './support-chat-admin.component.html',
  styleUrls: ['./support-chat-admin.component.scss']
})
export class SupportChatAdminComponent implements OnInit {
  embeddedLink: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.embeddedLink = `${window.location.host}/client/wssclient.js`;
  }
  onLogout(): void {
    console.log('Inside logout');
    this.authService.agentLogout();

  }

}
