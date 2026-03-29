import { ActivatedRoute } from "@angular/router";

export abstract class PageExtensions {
    protected route?: ActivatedRoute;

    getQueryParameter(paramName: string): string {
        return this.route?.snapshot.paramMap.get(paramName) || '';
    }
}