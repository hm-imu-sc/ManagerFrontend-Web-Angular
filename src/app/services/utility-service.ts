import { Injectable } from '@angular/core';
import { Dummy } from '../../constants';

@Injectable({
    providedIn: 'root',
})
export class UtilityService {
    isNullOrUndefined(val?: any): boolean {
        return val === null || val === undefined;
    }

    isNullOrEmpty(val?: string): boolean {
        return this.isNullOrUndefined(val) || val === '';
    }

    isNullOrEmptyArray(val?: any[]): boolean {
        return this.isNullOrUndefined(val) || val!.length === 0;
    }

    isDummyOrUndefined(val?: any) {
        return this.isNullOrUndefined(val) || val === Dummy.int;
    }

    isContain<T>(allData: T[], singleData: T): boolean {
        for (let d of allData) {
            if (d === singleData) {
                return true;
            }
        }
        return false;
    }
}
