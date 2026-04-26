import { Component } from '@angular/core';
import { AppList } from "../../../components/app-list/app-list";
import { Modal } from "../../../components/modal/modal";
import { PageTitle } from "../../../components/page-title/page-title";
import { Option, OptionChooser } from "../../../components/option-chooser/option-chooser";
import { AlertService } from '../../../services/alert-service';
import { LoadingPanel } from "../../../components/loading-panel/loading-panel";

type d = { id: number, title: string }

@Component({
    selector: 'app-design',
    imports: [AppList, Modal, PageTitle, OptionChooser, LoadingPanel],
    templateUrl: './design.html',
    styleUrl: './design.css',
})
export class Design {
    data: d[] = [];

    constructor(private _alertService: AlertService) {
        for (let i = 0; i < 5; i++) {
            this.data.push({ id: i, title: `Option ${i + 1}` });
        }
    }

    getOptions(): Option[] {
        return [];
        return this.data.map(d => ({ id: d.id, name: d.title }));
    }

    onOptionClick(optionId: number) {
        this._alertService.show(`Option choosen with id: ${optionId}`);
    }
}
