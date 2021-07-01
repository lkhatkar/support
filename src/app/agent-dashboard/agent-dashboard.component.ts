import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { WebSocketService } from '../services/web-socket.service';
import { AuthService } from '../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface Clients {
  id: string;
  name: string;
  email: string;
  dept: string;
  pid: string;
}
@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.scss']
})
export class AgentDashboardComponent implements OnInit, OnDestroy {
  nodes: NzTreeNodeOptions[] = [];
  selectedAgent: any ;
  selectedVisitor: any;
  index = 0;
  tabs : {name: string, id: string}[] = [];
  inputValueTab?: string ="Hello there";
  chatMessage = "";
  listOfData: Clients[] = [];
  hidden:boolean = true;
  private _subscription$: Subject<void>;
  chatData:any[] = [
  //   {
  //     message:'there is a issue',
  //     time:new Date().getTime(),
  //     user_type:'client'
  //   },
  //   {
  //     message:'hey agent here',
  //     time:new Date().getTime(),
  //     user_type:'agent'
  //   },
  //   {
  //     message:'How may i help you',
  //     time:new Date().getTime(),
  //     user_type:'agent'
  //   },
  //   {
  //     message:'fix the issue',
  //     time:new Date().getTime(),
  //     user_type:'client'
  //   },
  ]
  // Dropdown right click
  contextMenu($event: any, menu: NzDropdownMenuComponent, nodes: any): void {
    let agentName = $event.explicitOriginalTarget.nodeValue;
    // console.log(this.selectedAgent);
    if(agentName === this.selectedAgent.name) {
      this.nzContextMenuService.create($event, menu);
    }
    // console.log($event.explicitOriginalTarget.nodeValue);
    // console.log(nodes[0].children[0].title);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }
  constructor(
    private nzContextMenuService: NzContextMenuService,
    private websocket:WebSocketService,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef) {
      this._subscription$ = new Subject();
  }

  ngOnInit(): void {
    const currentAgent = this.authService.getCurrentAgent()

    // this.authService.getToken().subscribe(res=> {
      let names:any = []
      // if(res.success) {
        // sessionStorage.setItem('token', res.access_token);
        // Get Agents
        this.authService.getAgents().subscribe(resp=> {
          if(resp.success) {

            resp.agents.forEach((element:any, index:any) => {
              names.push({ title: element.name, key: index, icon: 'user', isLeaf: true })
            });
            const dig = (path = '0', level = 3) => {
              const list = [
                {
                  title: 'Default',
                  key: '100',
                  expanded: true,
                  icon: 'team',
                  children: names
                }

              ];

              return list;
            };
            this.nodes = dig();
            console.log(this.nodes);
          }
          // Selected agent
          this.selectedAgent = resp.agents.find((agent:any)=>agent.email === currentAgent.email);
          // this.selectedAgent = resp.agents[0];


          //Client list
          this.authService.getClients().subscribe((response:any)=> {
            if(response.success) {
              console.log(response);

              if(response.clients.length > 0) {
                // this.selectedVisitor = response?.clients[0];
                // console.log(this.selectedVisitor);
                let jsonData:any = [];
                response.clients.forEach((element:any) => {
                  jsonData.push(element)
                });
                this.listOfData = jsonData;
              }

              // connect auth
              this.websocket.connect(this.selectedAgent)
              .pipe(takeUntil(this._subscription$))
              .subscribe(data=> {
                if(data.message && typeof(data.message)==='string') {
                  this.chatData.push({
                    message:data.message,
                    time:new Date().getTime(),
                    user_type:'client',
                    id: data.id
                  });
                }
                console.log(data);
              });
            }
          });
        });
    //   }

    // })

  }
  // For table
  // ngAfterContentChecked() : void {
  //   this.changeDetector.detectChanges();
  // }
  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index, 1);
    // this.websocket.closeConnection();
  }

  newTab(id: string, name: string): void {
    // this.websocket.connect()
    // .subscribe(message=>{
    //   console.log('message',message);
    // },
    // err=> {
    //   console.log(err);
    // });

    this.authService.assignClient(this.selectedAgent.email, id).subscribe(res=> {
      if(res.success) {
        if(this.tabs.filter(e => e.id === id).length == 0) {
          this.tabs.push({name: name, id: id});
           this.index = this.tabs.length - 1;
           console.log(res);
        }
       }
      else {
        console.log(res);
        this.hidden = false
        setTimeout(() => {
          this.hidden = true;
        }, 5000);
      }

    })
  }

  onChatSend(id: string): void {
    this.websocket.send({clientId: id, message: this.chatMessage});

    this.chatData.push({
      message:this.chatMessage,
      time:new Date().getTime(),
      user_type:'agent',
      id: id
    });

    this.chatMessage = '';
    console.log('Chat send clicked');
  }

  private addMessage(message:string,userType:string){

  }
  onLogout() {
    this.authService.agentLogout();
  }

  ngOnDestroy() {
    this._subscription$.next();
    this._subscription$.complete();
    this.websocket.closeConnection();
  }

}
