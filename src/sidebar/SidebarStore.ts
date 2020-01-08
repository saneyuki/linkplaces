import { unwrapNullable } from 'option-t/esm/Nullable/unwrap';
import { Store as ReduxStore, createStore } from 'redux';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { Store } from '../shared/Store';

import { SidebarIntent, Action as SidebarAction, notifyUpdateEntries } from './SidebarIntent';
import { SidebarRepository } from './SidebarRepository';
import { SidebarState, createReducer, SidebarStateTree } from './SidebarState';

type SidebarReduxStore = ReduxStore<SidebarStateTree, SidebarAction>;

export class SidebarStore implements Store<SidebarState> {

    private _repo: SidebarRepository;
    private _subject: BehaviorSubject<SidebarState> | null;
    private _subscription: Subscription | null;
    private _redux: SidebarReduxStore | null;

    constructor(_intent: SidebarIntent, repo: SidebarRepository) {
        this._repo = repo;
        this._subject = null;
        this._subscription = null;
        this._redux = null;
    }

    destroy(): void {
        const s = unwrapNullable(this._subscription);
        s.unsubscribe();

        const subject = unwrapNullable(this._subject);
        subject.unsubscribe();
    }

    compose(initial: Readonly<SidebarState>): Observable<SidebarState> {
        const reducers = createReducer();
        const initState: SidebarStateTree = {
            reduceSidebarState: initial,
        };
        const s: SidebarReduxStore = createStore(reducers, initState);
        this._redux = s;

        const subject = new BehaviorSubject(initial);
        this._subject = subject;

        const subscribeRepository = this._repo.asObservable()
            .subscribe((list) => {
                const action = notifyUpdateEntries(list);
                const s = unwrapNullable(this._redux);
                s.dispatch(action);
            });

        const subscribeReduxStore = s.subscribe(() => {
            const state = s.getState();
            subject.next(state.reduceSidebarState);
        });

        subscribeRepository.add(subscribeReduxStore);

        this._subscription = subscribeRepository;

        return subject.asObservable();
    }
}
