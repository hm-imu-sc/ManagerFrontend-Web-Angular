import { Directive, Input } from "@angular/core";

@Directive()
export abstract class BaseComponent {
    @Input()
    enabled: boolean = true;

    @Input()
    readonly: boolean = false;
}