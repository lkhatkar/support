import { Component, OnInit } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.scss']
})

export class AgentDashboardComponent implements OnInit {
  nodes: NzTreeNodeOptions[] = [];
  index = 0;
  tabs = ['Tab 1','Tab 2'];
  inputValueTab?: string ="Hello there";
  // Dropdown right click
  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }
  constructor(private nzContextMenuService: NzContextMenuService) {

  }

  ngOnInit(): void {
    const dig = (path = '0', level = 3) => {
      const list = [
        {
          title: 'Default',
          key: '100',
          expanded: true,
          icon: 'team',
          children: [
            { title: 'admin1', key: '1001', icon: 'user', isLeaf: true },
            { title: 'admin2', key: '1002', icon: 'user', isLeaf: true }
          ]
        }

      ];

      return list;
    };
    this.nodes = dig();
  }
  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index, 1);
  }

  newTab(): void {
    this.tabs.push('New Tab');
    this.index = this.tabs.length - 1;
  }
  onChatSend(): void {
    console.log('Chat send clicked');

  }



}
