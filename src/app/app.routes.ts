import { Routes } from '@angular/router';
import { Design } from './pages/common/design/design';
import { LoginRegistration } from './pages/common/login-registration/login-registration';
import { TagManager } from './pages/common/tag-manager/tag-manager';
import { DevTracker } from './pages/app-manager/dev-tracker/dev-tracker';
import { RouteList } from './pages/route-list/route-list';

export const routes: Routes = [
    {
        path: '',
        component: RouteList,
        title: 'Route List'
    },
    {
        path: 'design',
        component: Design,
        title: 'Design Page'
    },
    {
        path: 'login-registration/:mode',
        component: LoginRegistration,
        title: 'Login Registration'
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
