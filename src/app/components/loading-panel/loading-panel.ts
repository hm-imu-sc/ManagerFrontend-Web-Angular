import { Component, Input } from '@angular/core';
import { Empty } from '../../../constants';

type SpinenrSize = 'sm' | 'lg';


@Component({
    selector: 'app-loading-panel',
    imports: [],
    templateUrl: './loading-panel.html',
    styleUrl: './loading-panel.css',
})
export class LoadingPanel {
    @Input() isShow: boolean = false;
    @Input() isLong: boolean = false;
    @Input() spinner: SpinenrSize = 'sm';
    @Input() loadingText: string = 'Loading ...';
}
