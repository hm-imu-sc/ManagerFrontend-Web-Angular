import { Component } from '@angular/core';
import { Login } from "../../../components/login/login";
import { Registration } from "../../../components/registration/registration";
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { PageExtensions } from '../../../abstruct_classes/PageExtensions';

@Component({
    selector: 'app-login-registration',
    imports: [Login, Registration, CommonModule],
    templateUrl: './login-registration.html',
    styleUrl: './login-registration.css',
})
export class LoginRegistration extends PageExtensions {

    showLogin: boolean = false;
    showRegistration: boolean = false;
    isDesktop: boolean = false;
    showForms: boolean = false;
    showFormChooser: boolean = false;

    constructor(protected override route: ActivatedRoute, private breakPointObserver: BreakpointObserver) {
        super();
        breakPointObserver
            .observe([Breakpoints.WebLandscape])
            .subscribe(r => this.isDesktop = r.matches);

        const mode = this.getQueryParameter('mode');
        this.showLogin = mode === "login" || this.isDesktop;
        this.showRegistration = mode === "registration" || this.isDesktop;
        this.showForms = this.isDesktop || this.showLogin || this.showRegistration;
        this.showFormChooser = !this.isDesktop && !(this.showLogin || this.showRegistration);
    }
}
