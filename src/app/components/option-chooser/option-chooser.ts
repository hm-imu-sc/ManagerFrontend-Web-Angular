import { Component, EventEmitter, Output } from '@angular/core';
import { LoadingPanel } from "../loading-panel/loading-panel";
import { NgTemplateOutlet } from "../../../../node_modules/@angular/common/types/_common_module-chunk";
import { Dummy, Empty } from '../../../constants';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-option-chooser',
    imports: [LoadingPanel, NgTemplateOutlet],
    templateUrl: './option-chooser.html',
    styleUrl: './option-chooser.css',
})
export class OptionChooser {
    // dummy = Dummy;

    // data$ = new BehaviorSubject<App[]>(Empty.array);
    // selectedAppIdx = Dummy.int;
    // selectedApp: App | undefined;

    // @Output()
    // onAppClick = new EventEmitter<number>();
}
