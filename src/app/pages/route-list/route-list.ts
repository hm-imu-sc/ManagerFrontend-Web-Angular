import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { PageTitle } from "../../components/page-title/page-title";
import { routes } from '../../app.routes';

@Component({
    selector: 'app-route-list',
    imports: [RouterLink, PageTitle],
    templateUrl: './route-list.html',
    styleUrl: './route-list.css',
})
export class RouteList {
    public allRoutes = routes;
}
