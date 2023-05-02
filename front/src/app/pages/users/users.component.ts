import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DashService } from 'src/app/services/dashboard.service';
import { PricingService } from 'src/app/services/pricing.servive';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  allUsers: any
  errorMsg: any
  errorMsg2: any
  allCallingCode:any



  constructor(private dashboardService: DashService,private usersService:UsersService,private pricingService:PricingService) { }


  ngOnInit(): void {
    this.showUsers()
    this.getCallingCodes()
  }

  showUsers() {
    this.usersService.getUsers().subscribe((data: any) => {
      console.log(data);
      this.allUsers = data
    })



  }

  addUser(Data: any) {
    const file = this.fileInput.nativeElement.files[0];

    const formObj = new FormData();

   console.log( Data.CallingCode)
    formObj.append("name", Data.name),
      formObj.append('email', Data.email),
      formObj.append("mobile",Data.CallingCode+"-" + Data.mobile ),
      formObj.append("country", Data.country),
      formObj.append('file', file);



    this.usersService.addUser(formObj).subscribe({


      next: (data) => {

        this.showUsers()
        console.log(data);
      }, error: (error) => {


        console.log(error);

        if (error.error.email) {

          this.errorMsg = error.error.email
        }if(error.error.number){
          this.errorMsg2 = error.error.number
        }

      }




    })
  }

  updateUser(id: any) {
    this.usersService.updateUser(id).subscribe({

      next: (data: any) => {
       let name = document.getElementById('name') as HTMLInputElement
       let email = document.getElementById('email') as HTMLInputElement
       let mobile = document.getElementById('mobile') as HTMLInputElement
       let CallingCode = document.getElementById('CallingCode') as HTMLInputElement
       let country = document.getElementById('country') as HTMLInputElement


        name.value = data.name
        email.value = data.email
        mobile.value = data.CallingCode+"-"+ data.mobile
        country.value = data.country

        console.log(data);

      }, error: (error) => {
        console.log(error);

      }
    })
  }

  deleteUser(id: any) {
    this.usersService.deleteUser(id).subscribe((data: any) => {
      this.showUsers()

    })


  }
  getCallingCodes(){
    this.pricingService.allCallingCodes().subscribe({
      next:(data)=>{
        console.log(data);
        this.allCallingCode = data
      },error:(error)=>{
        console.log(error);
      }
    })
  }


}
