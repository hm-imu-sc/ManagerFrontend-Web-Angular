import { Injectable } from '@angular/core';
import { Dummy } from '../../constants';

@Injectable({
    providedIn: 'root',
})
export class UtilityService {
    isNullOrUndefined(val: any): boolean {
        return val === null || val === undefined;
    }

    isNullOrEmpty(val?: string): boolean {
        return this.isNullOrUndefined(val) || val === '';
    }

    isDummyOrUndefined(val?: any) {
        return this.isNullOrUndefined(val) || val === Dummy.int;
    }
}
