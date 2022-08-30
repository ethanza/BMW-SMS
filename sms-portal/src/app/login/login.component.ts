import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  public isAuthenticated: boolean = false;
  // private loginServiceSubscription: Subscription;
  public usernameControl = new FormControl('');
  public passwordControl = new FormControl('');
  public loginForm = this.formBuilder.group({
    username: this.usernameControl,
    password: this.passwordControl,
  });

  constructor(
    private formBuilder: FormBuilder,
    private elementRef: ElementRef 
    //  private loginService: LoginService
  ) {}

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor ='#fff';
  }

  ngOnInit() {
    // this.checkForSession();
  }

  ngOnDestroy() {
    //  this.loginServiceSubscription.unsubscribe();
  }

  public onSubmit(): void {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    if (!(username && password)) {
      alert('incorrect username/password');
      return;
    }
    // this.loginService.login({ username, password }).subscribe((user: UserModel) => {
    //   if (user && user.token) {
    //     alert('logged in successfully');
    //     this.isAuthenticated = true;
    //     this.loginForm.reset();
    //     this.loginService.setUser(user);
    //   } else {
    //     alert('Please try again, server error');
    //   }
    // });
  }
  // private checkForSession(): void {
  //   if(this.loginService.getUser()) {
  //     this.isAuthenticated = true;
  //   }
  // }

  public getFloatLabelValue(): FloatLabelType {
    return 'auto';
  }
}
