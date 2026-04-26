import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Dummy, Empty } from '../../../constants';
import { BehaviorSubject } from 'rxjs';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { BaseComponent } from '../../abstruct_classes/BaseComponent';

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

    @Output()
    onOptionClick = new EventEmitter<number>();
    
    dummy = Dummy;
    
    opts$ = new BehaviorSubject<Option[]>(Empty.array);
    selectedOptIdx = Dummy.int;
    selectedOpt?: Option;
    
    ngOnChanges(changes: SimpleChanges): void {
        for (let index = 0; index < this.options.length; index++) {
            if (this.options[index].id === this.selectedId) {
                this.selectedOptIdx = index;
            }
        }
        this.opts$.next(this.options);
    }

    selectOpt(optIdx: number) {
        this.selectedOptIdx = optIdx;
        this.selectedOpt = this.opts$.value[optIdx];
        this.onOptionClick.emit(this.selectedOpt.id);
    }
}
