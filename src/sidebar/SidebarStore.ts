import { Observable, operators, } from 'rxjs';

import { Store } from '../shared/Store';

import { SidebarIntent } from './SidebarIntent';
import { SidebarRepository } from './SidebarRepository';
import { SidebarState } from './SidebarState';
import { mapToSidebarItemEntity } from './SidebarDomain';
import { BookmarkTreeNode } from '../../typings/webext/bookmarks';

const { map, merge, share, withLatestFrom } = operators;

export class SidebarStore implements Store<SidebarState> {

    private _intent: SidebarIntent;
    private _repo: SidebarRepository;

    constructor(intent: SidebarIntent, repo: SidebarRepository) {
        this._intent = intent;
        this._repo = repo;
    }

    compose(initial: Readonly<SidebarState>): Observable<SidebarState> {
        const init = Observable.of(initial);
        const changed: Observable<SidebarState> = this._repo.asObservable()
            .pipe(
                map((list: Array<BookmarkTreeNode>) => {
                    const l = list.map(mapToSidebarItemEntity);
                    return { list: l };
                })
            );
        const result = init.pipe(
            merge(changed),
            share(),
        );

        const enableIsOpening: Observable<SidebarState> = this._intent.openItem()
            .pipe(
                withLatestFrom(result, (action, state) => {
                    const { id } = action;
                    for (const item of state.list) {
                        if (item.bookmark.id === id) {
                            item.isOpening = true;
                        }
                    }
                    return state;
                })
            );

        return result.pipe(merge(enableIsOpening));
    }
}
