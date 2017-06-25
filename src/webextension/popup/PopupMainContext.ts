import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { applyMiddleware, createStore, Store, Unsubscribe } from 'redux';
import thunk from 'redux-thunk';

import { Channel } from '../shared/Channel';
import { ViewContext } from '../shared/ViewContext';

import { BookmarkTreeNode, OnChangeInfo } from '../../../typings/webext/bookmarks';

import { PopupMainView } from './view/PopupMainView';

import { createItemChangedAction } from './PopupIntent';
import { createReducer, PopupMainState } from './PopupMainState';
import { ThunkArguments } from './PopupMainThunk';

export class PopupMainContext implements ViewContext {

    private _channel: Channel;
    private _list: Array<BookmarkTreeNode>;
    private _disposerSet: Set<Unsubscribe> | null;

    constructor(channel: Channel, list: Array<BookmarkTreeNode>) {
        this._channel = channel;
        this._list = list;
        this._disposerSet = null;
    }

    onActivate(mountpoint: Element): void {
        if (this._disposerSet !== null) {
            throw new TypeError();
        }

        const reducer = createReducer();
        const middleware = thunk.withExtraArgument({
            channel: this._channel,
        } as ThunkArguments);
        const store: Store<PopupMainState> = createStore(reducer, applyMiddleware(middleware));
        const list = this._list;

        const render = () => {
            const state: PopupMainState = store.getState();

            const view = React.createElement(PopupMainView, {
                state,
                store,
                list,
            }, []);
            ReactDOM.render(view, mountpoint);
        };

        const onChanged = (id: string, info: OnChangeInfo) => {
            const a = createItemChangedAction(id, info);
            store.dispatch(a);
        };
        browser.bookmarks.onChanged.addListener(onChanged);

        this._disposerSet = new Set([
            store.subscribe(render),
            () => { browser.bookmarks.onChanged.removeListener(onChanged); }
        ]);
        render();
    }

    onDestroy(mountpoint: Element): void {
        if (this._disposerSet === null) {
            throw new TypeError();
        }

        this._disposerSet.forEach((fn) => fn());
        this._disposerSet.clear();
        this._disposerSet = null;

        ReactDOM.unmountComponentAtNode(mountpoint);
    }

    onResume(_mountpoint: Element): void {
        throw new Error('Method not implemented.');
    }
    onSuspend(_mountpoint: Element): void {
        throw new Error('Method not implemented.');
    }
}
