import { Component, Input, OnChanges } from '@angular/core';
import { BadgeColorProfile } from '../../types/BadgeColorProfile';

type BadgeProfileColor = {
    backgroundColor: string,
    textColor: string
}

@Component({
    selector: 'app-badge',
    imports: [],
    templateUrl: './badge.html',
    styleUrl: './badge.css',
})
export class Badge implements OnChanges {
    profiles = new Map<BadgeColorProfile, BadgeProfileColor>([
        ['red', { backgroundColor: '#fb2c36', textColor: 'var(--default-background-color)' }],
        ['lime', { backgroundColor: '#7ccf00', textColor: 'var(--default-background-color)' }],
        ['violet', { backgroundColor: '#8e51ff', textColor: 'var(--default-background-color)' }],
        ['orange', { backgroundColor: '#ff6900', textColor: 'var(--default-background-color)' }],
        ['default', { backgroundColor: 'var(--default-text-color)', textColor: 'var(--default-background-color)' }]
    ]);

    @Input() colorProfile: BadgeColorProfile = 'default';
    @Input() backgroundColor?: string;
    @Input() textColor?: string;

    ngOnChanges(): void {
        if (this.colorProfile !== 'custom') {
            this.backgroundColor = this.profiles.get(this.colorProfile)?.backgroundColor;
            this.textColor = this.profiles.get(this.colorProfile)?.textColor;
        }
    }
}
