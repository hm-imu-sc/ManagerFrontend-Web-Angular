import { ChangeDetectorRef, Component } from '@angular/core';
import { AlertService } from '../../services/alert-service';
import { UtilityService } from '../../services/utility-service';

@Component({
    selector: 'app-temporary',
    imports: [],
    templateUrl: './temporary.html',
    styleUrl: './temporary.css',
})
export class Temporary {
    n = 0;
    pos = new Map<number, {first?: number, second?: number}>();
    ar: number[] = [];

    constructor(
        private _alertService: AlertService,
        private _cdr: ChangeDetectorRef,
        private _util: UtilityService) { }

    btnLoadOnClick(): void {
        this.ar = new Array((2 * this.n) - 1).fill(-1);
        this.pos.clear();
        for (let i = 0; i < this.n; i++) {
            this.pos.set(i, {});
        }   
    }

    private remove(idx: number) {
        let val = this.ar[idx];
        let p = this.pos.get(val);
        this.ar[idx] = -1;
        
        if (p && p.second && p.second === idx) p.second = undefined;
        else if (p && p.first && p.first === idx) p.first = undefined;
        
        if (p && p.second && !p.first) {
            p.first = p.second;
            p.second = undefined;
        }

        this._alertService.show(`Removed${val == -1 ? '' : ` ${val}`} from ${idx}`, 'info');
    }

    setPos(val: number, idx: number): void {
        if (val === -1) {
            this.remove(idx);
            return;
        }
        if (this.ar[idx] !== -1) this.remove(idx);
        let p = this.pos.get(val);
        if (this._util.isNullOrUndefined(p) || this._util.isNullOrUndefined(p!.first)) {
            this.pos.set(val, { first: idx });
            this.ar[idx] = val;
            this._alertService.show('Successfull assignment.', 'success');
        }
        else {
            if (this._util.isNullOrUndefined(p!.second) && Math.abs(p!.first! - idx) === (val + 1)) {
                p!.second = idx;
                this.ar[idx] = val;
                this._alertService.show('Successfull assignment.', 'success');
            }
            else {
                this._alertService.show(`Unable to set value ${val} at index ${idx}`, 'failed');
                this._cdr.detectChanges();
            }
        }
    }
}
