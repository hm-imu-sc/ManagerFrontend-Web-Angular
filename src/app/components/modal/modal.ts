import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
    selector: 'app-modal',
    imports: [],
    templateUrl: './modal.html',
    styleUrl: './modal.css',
})
export class Modal {
    @Input() isOpen: boolean = true;
    @Input() title: string = '';
    @Output() closed = new EventEmitter<void>();

    close() {
        this.closed.emit();
    }

    @HostListener('document:keydown.escape')
    onEscPressed() {
        if (this.isOpen) this.close();
    }

    stopClick(event: MouseEvent) {
        event.stopPropagation();
    }
}
