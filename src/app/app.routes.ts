import { Routes } from '@angular/router';
import { Design } from './pages/common/design/design';
import { LoginRegistration } from './pages/common/login-registration/login-registration';
import { TagManager } from './pages/common/tag-manager/tag-manager';
import { DevTracker } from './pages/app-manager/dev-tracker/dev-tracker';

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
    },
    {
        path: 'tag-manager',
        component: TagManager,
        title: 'Tag Manager'
    },
    {
        path: 'dev-tracker',
        component: DevTracker,
        title: 'Dev Tracker'
    }
];
