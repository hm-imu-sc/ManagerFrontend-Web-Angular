import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Dummy, Empty } from '../../../constants';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert-service';
import { ApiService } from '../../services/api-service';
import { LoadingPanel } from "../loading-panel/loading-panel";
import { OptionChooser } from "../option-chooser/option-chooser";

export type App = {
    id: number,
    name: string,
    description: string
}

@Component({
    selector: 'app-app-list',
    imports: [CommonModule, LoadingPanel, OptionChooser],
    templateUrl: './app-list.html',
    styleUrl: './app-list.css',
})
export class AppList implements OnInit {
    readonly notFoundMessage = 'No apps found !';
    readonly loadingText = 'Loading app list ...';

    dummy = Dummy;

    isLoading = false;
    apps$ = new BehaviorSubject<App[]>(Empty.array);
    appOptions$ = this.apps$.pipe(map(apps => apps.map((app, idx) => ({ id: idx, name: app.name }))));
    selectedAppIdx = Dummy.int;
    selectedApp: App | undefined;

    @Output()
    onAppClick = new EventEmitter<number>();

    constructor(
        private _alertService: AlertService,
        private _apiService: ApiService
    ) {}

    ngOnInit(): void {
        this.getAppsAsync().then(r => {
            if (r?.length ?? 0 > 0) {
                this.apps$.next(r);
            }
            else {
                this._alertService.show(this.notFoundMessage, "failed")
            }
        });
    }

    async getAppsAsync(): Promise<App[]> {
        const api = '/api/App/getAllApps';
        let apps: App[] = Empty.array;
        this.isLoading = true;
        try {
            const response = await this._apiService.get<{ apps?: App[] }>(api);
            apps = response.apps!;
        }
        catch (error) {
            console.log(`getApps(): ${error}`);            
        }
        this.isLoading = false;
        return apps;
    }

    selectApp(appIdx: number) {
        this.selectedAppIdx = appIdx;
        this.selectedApp = this.apps$.value[appIdx];
        this.onAppClick.emit(this.selectedApp.id);
    }
}
