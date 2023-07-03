import { Component, OnInit } from "@angular/core";
import { BnNgIdleService } from "bn-ng-idle"; // import bn-ng-idle service
import { PostsService } from "src/app/services/login.service";

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.scss"],
})
export class AdminLayoutComponent implements OnInit {
  constructor(
    private bnIdle: BnNgIdleService,
    private loginService: PostsService
  ) {}

  ngOnInit() {
    this.bnIdle.startWatching(100 * 60).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        console.log("time out");
        this.loginService.logOut();

        this.bnIdle.stopTimer();
      }
    });
  }
}
