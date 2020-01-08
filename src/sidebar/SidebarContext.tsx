// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react-dom/experimental" />

import { Nullable, isNotNull } from 'option-t/esm/Nullable/Nullable';
import { expectNotNull } from 'option-t/esm/Nullable/expect';
import React from 'react';
import ReactDOM from 'react-dom';

import {
    Subscription,
    animationFrameScheduler as animationFrameRxScheduler,
} from 'rxjs';
import {
    debounceTime,
} from 'rxjs/operators';

import { BookmarkTreeNode } from '../../typings/webext/bookmarks';

import { ViewContext } from '../shared/ViewContext';
import { USE_REACT_CONCURRENT_MODE } from '../shared/constants';


import { mapToSidebarItemEntity } from './SidebarDomain';
import { SidebarViewEpic } from './SidebarEpic';
import { SidebarIntent } from './SidebarIntent';
import { RemoteActionChannel } from './SidebarMessageChannel';
import { SidebarRepository } from './SidebarRepository';
import { SidebarState } from './SidebarState';
import { SidebarStore } from './SidebarStore';
import { SidebarView } from './SidebarView';

export class SidebarContext implements ViewContext {

    private _list: Array<BookmarkTreeNode>;
    private _renderRoot: Nullable<ReactDOM.Root>;
    private _subscription: Nullable<Subscription>;

    private _intent: SidebarIntent;
    private _repo: SidebarRepository;
    private _epic: SidebarViewEpic;
    private _store: SidebarStore;

    constructor(list: Array<BookmarkTreeNode>, channel: RemoteActionChannel) {
        this._list = list;
        this._renderRoot = null;
        this._subscription = null;

        const intent = new SidebarIntent();
        this._intent = intent;
        this._repo = SidebarRepository.create(browser.bookmarks, list);
        this._epic = new SidebarViewEpic(intent, this._repo, channel);
        this._store = new SidebarStore(intent, this._repo);
    }

    async onActivate(mountpoint: Element): Promise<void> {
        if (isNotNull(this._subscription)) {
            throw new TypeError();
        }

        this._epic.activate();
        const state = this._store.compose({
            list: this._list.map(mapToSidebarItemEntity),
        });

        if (USE_REACT_CONCURRENT_MODE) {
            this._renderRoot = ReactDOM.createRoot(mountpoint);
        }

        this._subscription = state
            .pipe(
                // XXX: Should we remove this wrapping `requestAnimationFrame()` for React concurrent mode?
                // Will React schedule requestAnimationFrame properly?
                debounceTime(0, animationFrameRxScheduler),
            ).subscribe((state: Readonly<SidebarState>) => {
                const view = (
                    <React.StrictMode>
                        <SidebarView state={state} intent={this._intent} />
                    </React.StrictMode>
                );

                if (USE_REACT_CONCURRENT_MODE) {
                    const renderRoot = expectNotNull(this._renderRoot, 'should has been initialized the renderRoot');
                    renderRoot.render(view);
                } else {
                    ReactDOM.render(view, mountpoint);
                }
            }, (e) => {
                console.exception(e);
            });
    }

    async onDestroy(_mountpoint: Element): Promise<void> {
        const subscription = expectNotNull(this._subscription, '');
        subscription.unsubscribe();
        this._subscription = null;

        if (USE_REACT_CONCURRENT_MODE) {
            const renderRoot = expectNotNull(this._renderRoot, '');
            renderRoot.unmount();
        } else {
            ReactDOM.unmountComponentAtNode(_mountpoint);
        }
        this._renderRoot = null;

        this._store.destroy();
        this._epic.destroy();
        this._repo.destroy();
    }

    async onResume(_mountpoint: Element): Promise<void> {
        throw new Error('Method not implemented.');
    }
    async onSuspend(_mountpoint: Element): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
