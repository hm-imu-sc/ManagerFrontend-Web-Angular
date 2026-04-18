import { Component, ViewChild } from '@angular/core';
import { AppList } from "../../../components/app-list/app-list";
import { Modal } from "../../../components/modal/modal";
import { PageTitle } from "../../../components/page-title/page-title";

@Component({
    selector: 'app-design',
    imports: [AppList, Modal, PageTitle],
    templateUrl: './design.html',
    styleUrl: './design.css',
})
export class Design {
    @ViewChild(AppList)
    appList!: AppList;

    test(appId: number) {
        console.log(`Selected app id: ${appId}`)
        console.log(`Selected app: ${this.appList.apps$.value[this.appList.selectedAppIdx].name}`)
    }
}
