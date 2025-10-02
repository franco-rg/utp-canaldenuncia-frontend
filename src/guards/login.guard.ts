import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "src/resources/services/auth.service";

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): any {
    this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/panel']);
        return false;
      } else {
        return true;
      }
    });
  }
}
