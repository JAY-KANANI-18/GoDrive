import { Component, OnInit } from "@angular/core";
import { BnNgIdleService } from "bn-ng-idle"; // import bn-ng-idle service
import { PostsService } from "src/app/services/login.service";
import { SocketService } from "src/app/services/soketio.service";

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.scss"],
})
export class AdminLayoutComponent implements OnInit {
  user:any
  constructor(
    private bnIdle: BnNgIdleService,
    private loginService: PostsService,
    private socketService: SocketService,

  ) {}

  ngOnInit() {

    // this.user =  localStorage.getItem('UserObj')
    // this.user = JSON.parse(this.user)
    // this.socketService.msg_emit({event:'online',name:this.user.name,id:this.user._name})
    this.bnIdle.startWatching(100 * 60).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        console.log("time out");
        this.loginService.logOut();

        this.bnIdle.stopTimer();
      }
    });
  }
  ngOnDestroy(): void {
    // this.socketService.msg_emit({event:'offline',name:this.user.name,id:this.user._name})
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }
}
