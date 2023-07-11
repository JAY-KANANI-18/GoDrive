import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { PricingService } from "src/app/services/pricing.servive";
import { UsersService } from "src/app/services/users.service";

import { loadStripe } from "@stripe/stripe-js";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";


@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  public allUsers: any = [];
  public errorMsg: any;
  public errorMsg2: any;
  public allCallingCode: any;
  public UpdateActivate: any = false;
  public UserForm: FormGroup;
  public currentPage: any = 1;
  public NoOfPages: any = [];
  public countriesArray: any;
  public userImage: any;
  private cardElement: any;
  public elements: any;
  public allCards: any;
  public defaultMethod: any;
  public UpdateForm: any;
  public sortField: any;
  public selectedImage: any;

  public error: any;
  private stripePromise:any
  public currentUser: any;


  private updateId: any;

  constructor(
    private usersService: UsersService,
    private pricingService: PricingService,
    private toster: ToastrService,
    private ngbService: NgbModal,
    private http: HttpClient,
    private cdf: ChangeDetectorRef
  ) {
  }

  async ngOnInit() {
   let z:any = this.usersService.getSettings()
   console.log(z);

    console.log(this.usersService.stripe_public_key);
    this.showUsers(this.currentPage);
    this.getCallingCodes();
    this.getCountries();
    this.createUserForm();


  }

  showUsers(page: any) {
    this.usersService.getUsers(page,{field:this.sortField}).subscribe({
      next: (data: any) => {
        this.allUsers = data.users;
        this.NoOfPages = new Array(data.pages);
      },
      error: (error) => { },
    });
  }

  addUser(Data: any, files: any, modal?: any) {
    const file = files.files[0];

    this.UserForm.markAllAsTouched();
    if (this.UserForm.invalid) {
this.toster.error('Form is Invalid')
      return

    }

    const data = this.UserForm.value;
    const formObj = new FormData();

    console.log(Data.CallingCode);
    formObj.append("name", data.name),
      formObj.append("email", data.email),
      formObj.append("mobile", data.callingCode + "-" + data.mobile),
      formObj.append("country", data.country),
      formObj.append("avatar", file);

    this.usersService.addUser(formObj).subscribe({
      next: (data:any) => {
        modal.close('Close click');
        this.toster.success(data.msg);
        this.UserForm.reset()



        this.showUsers(this.currentPage);
        console.log(data);
      },
      error: (error) => {
        console.log(error);

        if (error.error.email) {
          // this.errorMsg = error.error.email;
          this.toster.error(error.error.email, "");

        }
        else if (error.error.number) {
          // this.errorMsg2 = error.error.number;
          this.toster.error(error.error.number, "");

        }else if(error.error.msg){
          this.toster.error(error.error.msg, "");


        }
      }
    });
  }

  async updateUser(id: any, content?: any) {

    this.createUpdateForm()
    if (content) {
      this.ngbService.open(content, { centered: true });
    }

    this.currentUser = id;
    this.usersService.updateUser(id).subscribe({
      next: (obj: any) => {
        // this.toster.success(obj.msg)
        let data = obj.user;

        if(  obj.customer.invoice_settings.default_payment_method){

          this.defaultMethod =
          obj.customer.invoice_settings.default_payment_method;

        }
        // this.UpdateActivate = true;
        let num = data.mobile.split("-");
        this.UpdateForm.get("uname").patchValue(data.name);
        this.UpdateForm.get("uemail").patchValue(data.email);
        this.UpdateForm.get("ucallingCode").patchValue(num[0]);
        this.UpdateForm.get("umobile").patchValue(num[1]);
        this.UpdateForm.get("ucountry").patchValue(data.country);
        this.selectedImage = environment.URL + "/avatars/" +data.avatar;
        this.updateId = data._id;


        // this.cdf.detectChanges();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  onSearch(search: any) {
    this.currentPage = 1
    this.usersService.getUsers(this.currentPage, { search }).subscribe({
      next: (data: any) => {
        console.log(data);
        this.allUsers = data.users;
        this.NoOfPages = new Array(data.count);
        this.currentPage = 1;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  deleteUser(id: any) {
    this.usersService.deleteUser(id).subscribe({
      next: (data: any) => {
        this.showUsers(this.currentPage);
        // this.toster.success("Deleted Successfully", "");
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  getCallingCodes() {
    this.pricingService.allCallingCodes().subscribe({
      next: (data:any) => {
        // this.toster.success(data.msg)

        this.allCallingCode = data.allCollingCodes;;
        console.log(data);

      },
      error: (error) => {
        this.toster.error(error.error.msg)

        console.log(error);
      },
    });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  onSave(file: any, modal?: any) {
    let data = this.UpdateForm.value;
    file = file.files[0];

    const formObj = new FormData();
    if (file) {
      formObj.append("avatar", file);
    }
    this.errorMsg = false
    this.errorMsg2 = false
    formObj.append("name", data.uname),
      formObj.append("email", data.uemail),
      formObj.append("mobile", data.ucallingCode + "-" + data.umobile),
      formObj.append("country", data.ucountry),
      this.usersService.SaveUser(this.updateId, formObj).subscribe({
        next: (data: any) => {
          this.toster.success(data.msg)
          modal.dismiss('Click')
          this.UpdateForm.reset()
          // this.toster.success("Update Successfully", "");
          this.UpdateActivate = !this.UpdateActivate;
          this.showUsers(this.currentPage);
        },
        error: (error) => {
          if (error.error.email) {
            // this.errorMsg = error.error.email;
            this.toster.error(error.error.email, "");

          }
          else if (error.error.number) {
            // this.errorMsg2 = error.error.number;
            this.toster.error(error.error.number, "");

          }else if(error.error.msg){
            this.toster.error(error.error.msg, "");


          }
        },
      });
  }
  onCancel(data: any) {
    this.UpdateActivate = !this.UpdateActivate;
  }
  onPage(page: any) {
    this.currentPage = page;
    this.showUsers(this.currentPage);
  }
  onPrevious() {
    this.currentPage--;
    this.showUsers(this.currentPage);
  }
  onNext() {
    this.currentPage++;
    console.log(this.currentPage);
    console.log(this.NoOfPages);

    this.showUsers(this.currentPage);
  }
  getCountries() {
    this.pricingService.getAddedCountry().subscribe({
      next: (data: any) => {
        // this.toster.success(data.msg)

        this.countriesArray = data.country;
      },
      error: (error) => {
        this.toster.error(error.error.msg);

        console.log(error);
      },
    });
  }
  onSort(data: any) {

    this.sortField = data

    this.showUsers(this.currentPage)




  }
  createUserForm() {
    this.UserForm = new FormGroup({
      file: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      callingCode: new FormControl(null, [Validators.required]),
      mobile: new FormControl(null, [
        Validators.required,
        Validators.pattern("^((\\+91-?)|0)?[0-9\\s-]{10}$"),
      ]),
    });
  }
  createUpdateForm() {
    this.UpdateForm = new FormGroup({
      ufile: new FormControl(null),
      uname: new FormControl(null, [Validators.required]),
      uemail: new FormControl(null, [Validators.required]),
      ucountry: new FormControl("", [Validators.required]),
      ucallingCode: new FormControl("", [Validators.required]),
      umobile: new FormControl(null, [
        Validators.required,
        Validators.pattern("^((\\+91-?)|0)?[0-9\\s-]{10}$"),
      ]),
    });

  }
  openModel(content: any) {


    this.stripePromise = loadStripe(
      this.usersService.stripe_public_key
     );
    this.errorMsg = false
    this.errorMsg2 = false
    this.selectedImage = null
    this.ngbService.open(content, { centered: true });
  }
  async openCards() {
    let stripes = await this.stripePromise;

    this.elements = stripes.elements();
    const cardElement = this.elements.create("card");
    this.cardElement = cardElement;
    cardElement.mount("#payment-element");
  }
  async saveCard() {
    const { error: submitError } = await this.elements.submit();

    if (submitError) {
      this.handleError(submitError);
      return;
    }

    let stripes = await this.stripePromise;

    const { error, paymentMethod } = await stripes.createPaymentMethod({
      type: "card",
      card: this.cardElement,
    });

    if (error) {
      console.error(error);
      this.toster.error(error.message)

      this.error = error;
    } else {
      this.error = null;

      this.usersService.addCard(this.currentUser, paymentMethod).subscribe({
        next: (data: any) => {
          // this.toster.success(data.msg)
          console.log(data, "card");
          this.getCards();
        },
        error: (error) => {
          this.toster.error(error.error.msg)
          console.log(error);
        },
      });
    }
  }
  handleError = (error: any) => {

    const messageContainer = document.querySelector(
      "#error-message"
    ) as HTMLElement;

    messageContainer.textContent = error.message;
  };
  getCards() {
    this.usersService.getCards(this.currentUser).subscribe({
      next: (cards: any) => {
        console.log(cards);
        // this.toster.success(cards.msg)
        this.allCards = cards.cards.data;
      },
      error: (error) => {
        this.toster.error(error.error.msg)
        console.log(error);
      },
    });
  }
  setDefault(card: any) {
    this.usersService.setDefaultCard(this.currentUser, card.id).subscribe({
      next: (data: any) => {
        // this.toster.success(data.msg)
        this.updateUser(this.currentUser);
      },
      error: (error) => {
        this.toster.error(error.error.msg)
        console.log(error);
      },
    });

    console.log(card);
  }
  onDeleteCard(card: any) {
    console.log(card);
    this.usersService.deleteCard(card.id).subscribe({
      next: (data: any) => {
        // this.toster.success(data.msg)
        console.log(data);
        this.getCards();
      },
      error: (error) => {
        this.toster.error(error.error.msg)
        console.log(error);
      },
    });
  }
  onFileSelected(e: any) {
    if (e.target.files) {
      let reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload = (event: any) => {
        this.selectedImage = event.target.result
      }
    }
  }
}
