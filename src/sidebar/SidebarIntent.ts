import { IterableX } from '@reactivex/ix-esnext-esm/iterable/iterablex';
import { Observable, Subject } from 'rxjs';
import { filter as filterRx } from 'rxjs/operators';

import { Dispatchable } from '../shared/Intent';
import {
    WhereToOpenItem,
} from '../shared/RemoteAction';

import { SidebarItemViewModelEntity } from './SidebarDomain';

export class SidebarIntent implements Dispatchable<Action> {

    private _subject: Subject<Action>;

    constructor() {
        this._subject = new Subject();
    }

    destroy(): void {
        this._subject.unsubscribe();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._subject = null as any;
    }

    dispatch(action: Action): void {
        this._subject.next(action);
    }

    openItem(): Observable<OpenItemAction> {
        return this._subject.asObservable()
            .pipe(
                filterRx(isOpenItemAction),
            );
    }

    selectItem(): Observable<SelectItemAction> {
        return this._subject.asObservable()
            .pipe(
                filterRx(isSelectItemAction)
            );
    }
}

export const enum ActionType {
    OpenItem = 'SIDEBAR_ACTION_ITEM_OPEND',
    SelectItem = 'SIDEBAR_ACTION_SELECT_ITEM',
    UpdateEntries = 'SIDEBAR_ACTION_UPDATE_ENTRIES',
}

export type Action =
    OpenItemAction | SelectItemAction | UpdateEntriesAction;

interface ActionBase {
    type: ActionType;
}

export interface OpenItemAction extends ActionBase {
    type: ActionType.OpenItem;
    id: string;
    url: string;
    where: WhereToOpenItem;
}
export function isOpenItemAction(v: Readonly<ActionBase>): v is OpenItemAction {
    return v.type === ActionType.OpenItem;
}
export function notifyOpenItem(id: string, url: string, where: WhereToOpenItem): OpenItemAction {
    return {
        type: ActionType.OpenItem,
        id,
        url,
        where,
    };
}

export interface SelectItemAction extends ActionBase {
    type: ActionType.SelectItem;
    id: string;
}
export function isSelectItemAction(v: Readonly<ActionBase>): v is SelectItemAction {
    return v.type === ActionType.SelectItem;
}
export function notifySelectItemAction(id: string): SelectItemAction {
    return {
        type: ActionType.SelectItem,
        id,
    };
}

export interface UpdateEntriesAction extends ActionBase {
    type: ActionType.UpdateEntries;
    list: IterableX<SidebarItemViewModelEntity>;
}
export function isUpdateEntriesAction(v: Readonly<ActionBase>): v is UpdateEntriesAction {
    return v.type === ActionType.UpdateEntries;
}
export function notifyUpdateEntries(list: IterableX<SidebarItemViewModelEntity>): UpdateEntriesAction {
    return {
        type: ActionType.UpdateEntries,
        list,
    };
}
