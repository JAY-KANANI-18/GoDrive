import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from 'src/app/services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private http: HttpClient, private postService: PostsService,private router:Router) { }

  ngOnInit() {
    // const data = { name: 'fsef', email: 'fsdfv' };

  }
  onCreatePost(postData: any) {
    // Send Http request

    const Data = {
      name: postData.name,
      email: postData.email,
      password: postData.password

    }
    this.postService.createAndStorePost(Data).subscribe((response: any) => {
      setTimeout(()=>{
        this.router.navigate(['./login'])

      },1000)

    }
    )


  }

}
