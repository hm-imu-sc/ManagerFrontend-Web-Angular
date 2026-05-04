import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Dummy, Empty } from '../../../../constants';
import { BehaviorSubject } from 'rxjs';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { BaseComponent } from '../../../abstruct_classes/BaseComponent';
import { UtilityService } from '../../../services/utility-service';

export type Option = {
    id: number,
    name: string
}

@Component({
    selector: 'app-option-chooser',
    imports: [NgTemplateOutlet, CommonModule],
    templateUrl: './option-chooser.html',
    styleUrl: './option-chooser.css',
})
export class OptionChooser extends BaseComponent implements OnChanges {
    @Input()
    noOptMessage = '';
    
    @Input({required: true})
    options: Option[] = [];

    @Input()
    selectedId: number = Dummy.int;

    @Input()
    selectedOptionIds: number[] = [];

    @Input()
    allowMultiSelect: boolean = false;

    @Output()
    onOptionClick = new EventEmitter<number>();

    @Output()
    onOptionToggle = new EventEmitter<number[]>();
    
    opts$ = new BehaviorSubject<Option[]>(Empty.array);
    isOptSelected = new Map<number, boolean>();

    constructor(public _utilService: UtilityService) { super(); }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.allowMultiSelect) {
            for (let selectedId of this.selectedOptionIds) {
                this.isOptSelected.set(selectedId, true);
            }
        }
        else {
            this.isOptSelected.set(this.selectedId, true);
        }
        this.opts$.next(changes['options'].currentValue);
    }

    selectOpt(opt: Option) {
        this.selectedId = opt.id;
        this.onOptionClick.emit(opt.id);
    }

    toggleOpt(optId: number) {
        this.isOptSelected.set(optId, !this.isOptSelected.get(optId));
        this.onOptionToggle.emit(this.options
            .filter(opt => this.isOptSelected.get(opt.id) ?? false)
            .map(opt => opt.id));
    }

    isOptionSelected(option: Option): boolean {
        if (this.allowMultiSelect) {
            return this.isOptSelected.get(option.id) ?? false;
        }
        return this.selectedId === option.id;
    }

    getDummyOpt(): { opt: Option } {
        return { opt: { name: this.noOptMessage, id: Dummy.int } };
    }

    onOptClick(opt: Option) {
        if (this.allowMultiSelect) {
            this.toggleOpt(opt.id);
        }
        else {
            this.selectOpt(opt);
        }
    }
}
