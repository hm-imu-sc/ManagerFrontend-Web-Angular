import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService, GeneralResponse } from '../../services/api-service';
import { AlertService } from '../../services/alert-service';

type App = {
    id: number,
    name: string,
    description: string
}

type Tag = {
    id: number,
    name: string,
    parentTagId: number,
    app?: App
}

class TagEID {
    public level!: number;
    public idx!: number;
    public box!: string;

    constructor() {
        this.reset();
    }

    set(level: number, idx: number, box: string) {
        this.level = level;
        this.idx = idx;
        this.box = box;
    }

    reset() {
        this.set(0, Dummy.int, Empty.str);
    }
}

export class Dummy {
    static readonly int = -1;
}

export class Empty {    
    static readonly array: [] = [];
    static readonly str: string = '';
}

class Mode {
    private _rename!: boolean;
    private _insert!: boolean;
    private _delete!: boolean;

    constructor() {
        this.reset();
    }

    get rename(): boolean {
        return this._rename;
    }

    get insert(): boolean {
        return this._insert;
    }

    get delete(): boolean {
        return this._delete;
    }

    setRenameMode(): void {
        this._rename = true;
        this._insert = false;
        this._delete = false;   
    }

    setInsertMode(): void {
        this._rename = false;
        this._insert = true;
        this._delete = false;   
    }

    setDeleteMode(): void {
        this._rename = false;
        this._insert = false;
        this._delete = true;   
    }

    reset() {
        this._rename = false;
        this._insert = false;
        this._delete = false;
    }
}

@Component({
    selector: 'app-tag-manager',
    imports: [CommonModule],
    templateUrl: './tag-manager.html',
    styleUrl: './tag-manager.css',
})
export class TagManager implements OnInit {
    apps$ = new BehaviorSubject<App[]>(Empty.array);
    appTags$ = new BehaviorSubject<Tag[]>(Empty.array);
    selectedAppIdx = Dummy.int;
    levelWiseTags: Tag[][] = Empty.array;
    levelWiseSelectedTagIdx: number[] = Empty.array;
    hasChild: {}[] = Empty.array;
    tagEID = new TagEID();
    mode = new Mode();
    nextTagId = 100;

    @ViewChild('tagContainer')
    tagContainer!: ElementRef;

    constructor(
        private _apiService: ApiService,
        private _cdr: ChangeDetectorRef,
        private _alertService: AlertService) {
    }

    ngOnInit(): void {
        this.getAppsAsync().then(r => {
            if (r?.length ?? 0 > 0) {
                this.apps$.next(r);
                this.onAppClick(2);
            }
        });
    }

    async getAppsAsync(): Promise<App[]> {
        const api = '/api/App/getAllApps';
        try {
            const response = await this._apiService.get<{ apps?: App[] }>(api);
            return response.apps!;
        }
        catch (error) {
            console.log(`getApps(): ${error}`);            
        }
        return Empty.array;
    }

    async getTagsAsync(appId: number): Promise<Tag[]> {
        const api = `/api/Tag/getTags/${appId}`;
        try {
            const response = await this._apiService.get<{ tags?: Tag[] }>(api);
            return response.tags!;
        }
        catch (error) {
            console.log(`getTagsAsync(): ${error}`);            
        }
        return Empty.array;
    }

    prepareLevelWiseTags(tags: Tag[]): void {
        tags.sort((t1, t2) => {
            if (t1.parentTagId < t2.parentTagId) {
                return -1;
            }

            if (t1.parentTagId > t2.parentTagId) {
                return 1;
            }

            if (t1.id < t2.id) {
                return -1;
            }

            return 1;
        });

        this.levelWiseTags = [];
        this.levelWiseSelectedTagIdx = [];
        this.hasChild = [];
        let tagLevelMap = new Map<number, number>();

        for (let tag of tags) {
            const isRoot = tag.id === tag.parentTagId;
            const hasParent = tagLevelMap.has(tag.parentTagId);
            const tagLevel = isRoot ? 0 : (hasParent ? (tagLevelMap.get(tag.parentTagId)! + 1) : Dummy.int);
            if (tagLevel === Dummy.int) {
                continue;
            }
            
            tagLevelMap.set(tag.id, tagLevel);

            if (this.levelWiseTags.length <= tagLevel) {
                this.levelWiseTags.push([]);
                this.levelWiseSelectedTagIdx.push(isRoot ? 0 : Dummy.int);
            }
            this.levelWiseTags[tagLevel].push(tag);
            this.hasChild[tag.parentTagId] = true;
        }
        this.levelWiseTags.push([]);
        this.levelWiseSelectedTagIdx.push(Dummy.int);
    }

    onAppClick(appIdx: number): void {
        if (this.selectedAppIdx === appIdx) {
            return;
        }

        this.selectedAppIdx = appIdx;
        this.clearTags();
        this.getTagsAsync(this.apps$.getValue()[this.selectedAppIdx].id)
            .then(tags => {
                if (tags.length > 0) {
                    this.prepareLevelWiseTags(tags);
                    this.appTags$.next(tags);
                }
            });
    }

    onTagClick(level: number, tagIndex: number): void {
        this.levelWiseSelectedTagIdx[level] = tagIndex;
        this.unSelectLevelTag(level + 1);
        this.scrollRight();
    }

    onEditClick(level: number, tagIdx: number): void {
        this.tagEID.set(level, tagIdx, this.levelWiseTags[level][tagIdx].name);
        this.mode.setRenameMode();
    }

    onInsertClick(level: number): void {
        this.tagEID.level = level;
        this.mode.setInsertMode();
        this.scrollRight()
    }

    onDeleteClick(level: number, tagIdx: number): void {
        this.tagEID.set(level, tagIdx, "Confirm delete ?");
        this.mode.setDeleteMode();
    }

    async deleteTagAsync() {
        try {
            const tagId = this.levelWiseTags[this.tagEID.level][this.tagEID.idx].id;
            const api = `/api/Tag/deleteTag/${tagId}`;
            
            const response = await this._apiService.post<{}>(api, null);
        
            if (response.generalResponse.isSuccess) {
                this._alertService.show(`deleted "${this.levelWiseTags[this.tagEID.level][this.tagEID.idx].name}"`, 'success');
                
                if (this.levelWiseSelectedTagIdx[this.tagEID.level] === this.tagEID.idx) {
                    this.unSelectLevelTag(this.tagEID.level);
                }
                this.levelWiseTags[this.tagEID.level].splice(this.tagEID.idx, 1);
                if (this.levelWiseSelectedTagIdx[this.tagEID.level] >= this.tagEID.idx) {
                    this.levelWiseSelectedTagIdx[this.tagEID.level]--;
                }

                this.disableEditInsert();
            }
            else {
                throw new Error(response.generalResponse.message);
            }
        }
        catch (error) {
            this._alertService.show(String(error), 'failed');
            console.log(`deleteTagAsync(): ${error}`);
        }
    }

    async insertTagAsync() {
        try {
            const api = '/api/Tag/createTag';
            const level = this.tagEID.level;
    
            let parentId = Dummy.int;
            if (level > 0) {
                const previousLevel = level - 1;
                const previousLevelSelectedTagIdx = this.levelWiseSelectedTagIdx[previousLevel];
                parentId = this.levelWiseTags[previousLevel][previousLevelSelectedTagIdx].id;
            }
            const body = {
                name: this.tagEID.box,
                parrentTagId: parentId,
                app: {
                    id: this.apps$.value[this.selectedAppIdx].id
                }
            }

            const response = await this._apiService.post<{ tagId?: number }>(api, body);

            if (response.generalResponse.isSuccess) {
                this.levelWiseTags[level].push({
                    id: response.tagId!,
                    name: body.name,
                    parentTagId: parentId,
                });
    
                const lastLevelIdx = this.levelWiseTags.length - 1;
                const isLastLevelEmpty = this.levelWiseTags[lastLevelIdx].length > 0;
                if (isLastLevelEmpty) {
                    this.levelWiseTags.push([]);
                    this.levelWiseSelectedTagIdx.push(Dummy.int);
                }
                this._alertService.show(`new tag "${body.name}" created`, 'success');
                this.disableEditInsert();
            }
            else {
                throw new Error(response.generalResponse.message); 
            }
        }
        catch (error) {
            this._alertService.show(String(error), 'failed');
            console.log(`insertTagAsync(): ${error}`);    
        }
    }

    async renameTagAsync() {
        try {
            const tagId = this.levelWiseTags[this.tagEID.level][this.tagEID.idx].id;
            const api = `/api/Tag/updateTagName/${tagId}`;
            
            const response = await this._apiService.post<{}>(api, JSON.stringify(this.tagEID.box));
        
            if (response.generalResponse.isSuccess) {
                this._alertService.show(`renamed "${this.levelWiseTags[this.tagEID.level][this.tagEID.idx].name}" > "${this.tagEID.box}"`, 'success');
                this.levelWiseTags[this.tagEID.level][this.tagEID.idx].name = this.tagEID.box;
                this.disableEditInsert();
            }
            else {
                throw new Error(response.generalResponse.message);
            }
        }
        catch (error) {
            this._alertService.show(String(error), 'failed');
            console.log(`updateTagNameAsync(): ${error}`);
        }
    }

    async onSaveClickAsync(): Promise<void> {
        if (this.mode.rename) {
            await this.renameTagAsync();
        }
        else if (this.mode.insert) {
            await this.insertTagAsync();
        }
        else if (this.mode.delete) {
            await this.deleteTagAsync();
        }
    }
    
    onCancelClick(): void {
        this.disableEditInsert();
    }

    disableEditInsert(): void {
        this.tagEID.reset();
        this.mode.reset();
        this._cdr.detectChanges();
    }

    isDisable(): boolean {
        return this.mode.insert || this.mode.rename || this.mode.delete;
    }

    isShowLevel(level: number): boolean {
        const previousLevel = level - 1;
        const logic = level === 0 || this.levelWiseSelectedTagIdx[previousLevel] !== Dummy.int;
        return logic;
    }

    isShowTag(level: number, tagIndex: number): boolean {
        const previousLevel = level - 1;
        const previousLevelSelectedTagIdx = this.levelWiseSelectedTagIdx[previousLevel];
        const logic = level === 0
            || (previousLevelSelectedTagIdx !== Dummy.int
            && this.levelWiseTags[previousLevel][previousLevelSelectedTagIdx].id === this.levelWiseTags[level][tagIndex].parentTagId);
        return logic;
    }
    
    isDirtyEID(): boolean {
        if (this.mode.insert || this.mode.delete) {
            return false;
        }
        return this.tagEID.box === this.levelWiseTags[this.tagEID.level][this.tagEID.idx].name;
    }

    unSelectLevelTag(level: number): void {
        if (level < this.levelWiseSelectedTagIdx.length) {
            this.unSelectLevelTag(level + 1);
            this.levelWiseSelectedTagIdx[level] = Dummy.int;
        }
    }
    
    clearTags(): void {
        this.prepareLevelWiseTags([]);
        this.appTags$.next([]);
    }

    scrollRight() {
        this._cdr.detectChanges();
        const el = this.tagContainer.nativeElement;
        el.scrollLeft = el.scrollWidth; 
    }
}
