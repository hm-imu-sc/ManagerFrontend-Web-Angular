import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UtilityService {
    isNullOrUndefined(val: any): boolean {
        return val === null || val === undefined;
    }
}
