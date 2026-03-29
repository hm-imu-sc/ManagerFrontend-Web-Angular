import { Routes } from '@angular/router';
import { Design } from './pages/design/design';
import { LoginRegistration } from './pages/login-registration/login-registration';

export const routes: Routes = [
    {
        path: '',
        component: LoginRegistration,
        title: 'Welcome'
    },
    {
        path: 'design',
        component: Design,
        title: 'Design Page'
    },
    {
        path: 'login-registration/:mode',
        component: LoginRegistration,
        title: 'Welcome'
    }
];
