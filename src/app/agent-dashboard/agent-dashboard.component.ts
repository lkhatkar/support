import { Component, OnInit } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { WebSocketService } from '../services/web-socket.service';

export interface Clients {
  name: string;
}
@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.scss']
})
export class AgentDashboardComponent implements OnInit {
  nodes: NzTreeNodeOptions[] = [];
  index = 0;
  tabs:string[] = [];
  inputValueTab?: string ="Hello there";
  chatMessage = "";
  listOfData: Clients[] = [];
  chatData = [
    {
      message:'there is a issue',
      time:new Date().getTime(),
      user_type:'client'
    },
    {
      message:'hey agent here',
      time:new Date().getTime(),
      user_type:'agent'
    },
    {
      message:'How may i help you',
      time:new Date().getTime(),
      user_type:'agent'
    },
    {
      message:'fix the issue',
      time:new Date().getTime(),
      user_type:'client'
    },
  ]
  // Dropdown right click
  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }
  constructor(
    private nzContextMenuService: NzContextMenuService,
    private websocket:WebSocketService) {
  }

  ngOnInit(): void {
    this.listOfData.push({name: "Vishal"}, {name: "Mohit"});
    const dig = (path = '0', level = 3) => {
      const list = [
        {
          title: 'Default',
          key: '100',
          expanded: true,
          icon: 'team',
          children: [
            { title: 'agent1', key: '1001', icon: 'user', isLeaf: true },
            { title: 'agent2', key: '1002', icon: 'user', isLeaf: true }
          ]
        }

      ];

      return list;
    };
    this.nodes = dig();
  }
  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index, 1);
    this.websocket.closeConnection();
  }

  newTab(name: string): void {
    this.websocket.connect()
    .subscribe(message=>{
      console.log('message',message);
    },
    err=> {
      console.log(err);
    });
    this.tabs.push(name);
      this.index = this.tabs.length - 1;
  }

  onChatSend(): void {
    this.websocket.send(this.chatMessage);
    this.chatData.push({
      message:this.chatMessage,
      time:new Date().getTime(),
      user_type:'agent'
    });
    this.chatMessage = '';
    console.log('Chat send clicked');
  }

}
