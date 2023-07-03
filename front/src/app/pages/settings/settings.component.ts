import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { SettingsService } from "src/app/services/setting.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  Stops: number[] = [1, 2, 3, 4, 5];
  TimeOut: number[] = [10, 20, 30, 45, 60, 90, 120];
  SettingsForm: any;
  id: any;
  constructor(
    private settingsService: SettingsService,
    private ngbService: NgbModal,
    private toster: ToastrService,

  ) {
    this.SettingsForm = new FormGroup({
      AcceptenceTimeForRide: new FormControl("", [Validators.required]),
      MaxStopsForRide: new FormControl("", [Validators.required]),
      sms_sid: new FormControl("", [Validators.required]),
      sms_token: new FormControl("", [Validators.required]),
      email_client_id: new FormControl("", [Validators.required]),
      email_secret: new FormControl("", [Validators.required]),
      email_refresh_token: new FormControl("", [Validators.required]),
      stripe_public_key: new FormControl("", [Validators.required]),
      stripe_secret_key: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getSettings();
  }

  onSave() {
    console.log("work");
    let values = this.SettingsForm.value;
    console.log(values);

    this.settingsService.setTimeOut(this.id, values).subscribe({
      next: (data: any) => {
        this.getSettings();

        this.toster.success(data.msg)
      },
      error: (error) => {
        this.toster.error(error.error.msg)
        console.log(error);
      },
    });
  }
  getSettings() {
    this.settingsService.currentSettings().subscribe({
      next: (data: any) => {
        this.toster.success(data.msg)
        data = data.setting
        this.SettingsForm.patchValue({
          AcceptenceTimeForRide: data.AcceptenceTimeForRide,
          MaxStopsForRide: data.MaxStopsForRide,
          sms_sid: data.sms_sid,
          sms_token: data.sms_token,
          email_client_id: data.email_client_id,
          email_secret: data.email_secret,
          stripe_secret_key: data.stripe_secret_key,
          email_refresh_token: data.email_refresh_token,
          stripe_public_key: data.stripe_public_key,
        });
        this.id = data._id;
      },
      error: (error) => {
        this.toster.error(error.error.msg)

        console.log(error);
      },
    });
  }
}
