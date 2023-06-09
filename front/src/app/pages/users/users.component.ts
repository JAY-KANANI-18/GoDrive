import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PricingService } from 'src/app/services/pricing.servive';
import { UsersService } from 'src/app/services/users.service';
import { Stripe, StripeCardElement, StripeCardElementOptions, StripeElements } from '@stripe/stripe-js';

import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';

const stripePromise = loadStripe('pk_test_51N2piRJAU9zBfSBOixMp53BIFUU3aFXpACWos1Lvi2aM8H984bRSIf1aVoloiRnQNVCWU0Ckyg6SWuYyyXwlDT8000xGZO12wf');
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  public allUsers: any = []
  public errorMsg: any
  public errorMsg2: any
  public allCallingCode: any
  public UpdateActivate: any = false
  public UserForm: FormGroup
  public currentPage: any = 1
  public NoOfPages: any = []
  public countriesArray: any
  public userImage: any
  private cardElement: any
  public elements: any
  public allCards: any
  public defaultMethod: any

  public error :any

  public currentUser: any


  public sortingObj = {
    name: 1,
    email: 1,
    number: 1
  }

  private updateId: any


  constructor(private usersService: UsersService, private pricingService: PricingService, private toster: ToastrService, private ngbService: NgbModal, private http: HttpClient) {
    this.createUserForm()

  }


  ngOnInit(): void {
    this.showUsers(this.currentPage)
    this.getCallingCodes()
    this.getCountries()
  }

  showUsers(page: any) {
    this.usersService.getUsers(page).subscribe((data: any) => {
      console.log(data);
      this.allUsers = data.users
      this.NoOfPages = new Array(data.pages)

    })



  }

  addUser(Data: any, files: any) {
    const file = files.files[0];


    const data = this.UserForm.value
    const formObj = new FormData()


    console.log(Data.CallingCode)
    formObj.append("name", data.name),
      formObj.append('email', data.email),
      formObj.append("mobile", data.callingCode + "-" + data.mobile),
      formObj.append("country", data.country),
      formObj.append('file', file);



    this.usersService.addUser(formObj).subscribe({


      next: (data) => {

        this.showUsers(this.currentPage)
        console.log(data);
        this.toster.success('User Added Successfully', '')

      }, error: (error) => {

        this.toster.error('Something went wrong', '')




        if (error.error.email) {

          this.errorMsg = error.error.email
        } if (error.error.number) {
          this.errorMsg2 = error.error.number
        }

      }




    })
  }

  updateUser(id: any) {

    this.currentUser = id
    this.usersService.updateUser(id).subscribe({

      next: (obj:any) => {

       let data = obj.user


        this.defaultMethod =  obj.customer.invoice_settings.default_payment_method
        console.log(this.defaultMethod);

        this.UpdateActivate = true


        let num = data.mobile.split('-')
        this.UserForm.get('name').setValue(data.name);
        this.UserForm.get('email').setValue(data.email);
        this.UserForm.get('callingCode').setValue(num[0]);
        this.UserForm.get('mobile').setValue(num[1]);
        this.UserForm.get('country').setValue(data.country);
        this.userImage = data.avatar

        this.updateId = data._id



        this.toster.success('userdata filled Successfully', '')

        console.log(data);

      }, error: (error) => {
        console.log(error);

      }
    })
  }
  onSearch(search: any) {



    this.usersService.getUsers(this.currentPage, { search }).subscribe({
      next: (data: any) => {
        console.log(data);
        this.allUsers = data.users
        this.NoOfPages = new Array(data.count)
        this.currentPage = 1
      }, error: (error) => {
        console.log(error);
      }
    })
  }

  deleteUser(id: any) {
    this.usersService.deleteUser(id).subscribe(
      {
        next: (data: any) => {
          this.showUsers(this.currentPage)
          this.toster.success('Deleted Successfully', '')


        }, error: (error) => {
          console.log(error);
        }
      })
  }
  getCallingCodes() {
    this.pricingService.allCallingCodes().subscribe({
      next: (data) => {
        this.allCallingCode = data
      }, error: (error) => {
        console.log(error);
      }
    })
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  onSave(file: any) {
    let data = this.UserForm.value
    file = file.files[0];

    const formObj = new FormData();
    if (file) {
      formObj.append('file', file);


    }

    formObj.append("name", data.name),
      formObj.append('email', data.email),
      formObj.append("mobile", data.callingCode + "-" + data.mobile),
      formObj.append("country", data.country),




      this.usersService.SaveUser(this.updateId, formObj).subscribe({
        next: (data: any) => {
          console.log(data);
          this.toster.success('Update Successfully', '')
          this.UpdateActivate = !this.UpdateActivate
          this.showUsers(this.currentPage)

        }, error: (error) => {

          this.toster.error('Something went wrong', '')




          if (error.error.email) {

            this.errorMsg = error.error.email
          } if (error.error.number) {
            this.errorMsg2 = error.error.number
          }
        }
      })




  }
  onCancel(data: any) {
    this.UpdateActivate = !this.UpdateActivate

  }
  onPage(page: any) {
    this.currentPage = page
    this.showUsers(this.currentPage)
  }
  onPrevious() {
    this.currentPage--
    this.showUsers(this.currentPage)


  }
  onNext() {
    this.currentPage++
    console.log(this.currentPage);
    console.log(this.NoOfPages);

    this.showUsers(this.currentPage)



  }
  getCountries() {
    this.pricingService.getAddedCountry().subscribe(
      {
        next: (data: any) => {
          this.countriesArray = data

        }, error: (error) => {
          console.log(error);
        }
      })

  }
  onSort(data: any) {
    if (this.sortingObj[data] == 1) {
      this.sortingObj[data] = -1
    } else {
      this.sortingObj[data] = 1
    }

    console.log(data,this.sortingObj[data]);


    this.usersService.getUsers(this.currentPage, { field: data, order: this.sortingObj[data] }).subscribe({
      next: (data: any) => {
        console.log(data);
        this.allUsers = data.users
        this.NoOfPages = new Array(data.pages)


      }, error: (error) => {
        console.log(error);
      }
    })
  }
  createUserForm() {

    this.UserForm = new FormGroup({
      file: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      country: new FormControl("", [Validators.required]),
      callingCode: new FormControl("", [Validators.required]),
      mobile: new FormControl(null, [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9\\s-]{10}$')]),
    })

  }
  openModel(content: any) {

    this.ngbService.open(content, { centered: true });

  }
  onAddCard() {

  }
  async openCards() {
    let stripes = await stripePromise

    this.elements = stripes.elements();
    const cardElement = this.elements.create('card');
    this.cardElement = cardElement
    cardElement.mount('#payment-element');
  }
  async saveCard() {
    // if (this.submitBtn.disabled) {
    //   return;
    // }

    // this.submitBtn.disabled = true;

    const { error: submitError } = await this.elements.submit();

    if (submitError) {
      this.handleError(submitError);
      return;
    }


    let stripes = await stripePromise



    const { error, paymentMethod } = await stripes.createPaymentMethod({
      type: 'card',
      card: this.cardElement,
    });

    if (error) {
      console.error(error);
      this.error = error

    } else {
      this.error = null

      // Payment method created successfully
      // console.log(paymentMethod);


      this.usersService.addCard(this.currentUser,paymentMethod).subscribe({
        next:(data:any)=>{
          console.log(data,'card');
          this.getCards()
        },error:(error)=>{
          console.log(error);
        }
      })
      // Call your Node.js backend API to create a payment method
      // Pass the necessary paymentMethod details to your server
      // e.g., using Angular's HttpClient
    }





  }
  handleError = (error: any) => {
    const messageContainer = document.querySelector(
      '#error-message'
    ) as HTMLElement;

    messageContainer.textContent = error.message;


  }
  getCards(){
    this.usersService.getCards(this.currentUser).subscribe({
      next: (cards: any) => {
        this.allCards = cards.data
        console.log();
        (document.getElementById('submit') as HTMLButtonElement).classList.add('btn','btn-outline-primary')

      }, error: (error) => {
        console.log(error);
      }
    })
  }
  setDefault(card:any){
    this.usersService.setDefaultCard(this.currentUser,card.id).subscribe({
      next:(data:any)=>{
        this.updateUser(this.currentUser)

      },error:(error)=>{
        console.log(error);
      }
    })



    console.log(card);

  }
  onDeleteCard(card:any){
    console.log(card);
    this.usersService.deleteCard(card.id).subscribe({
      next:(data:any)=>{
        console.log(data);
        this.getCards()
      },error:(error)=>{
        console.log(error);
      }
    })

  }
}
