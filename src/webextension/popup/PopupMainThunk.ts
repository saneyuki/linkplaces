import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import {
    MSG_TYPE_OPEN_ORGANIZE_WINDOW_FROM_POPUP,
    MSG_TYPE_OPEN_URL_FROM_POPUP,
    MSG_TYPE_OPEN_SIDEBAR_FROM_POPUP,
} from '../background/IpcMsg';
import { Channel } from '../shared/Channel';

import {
    createOpenSidebarAction as createOpenSidebarAction,
    createOpenLibraryWindow as createOpenLibraryWindow,
} from './PopupIntent';
import { PopupMainState, PopupMainStateTree } from './PopupMainState';

export type ThunkArguments = Readonly<{
    channel: Channel;
}>;

export function openItem(id: string, url: string): ThunkAction<Promise<void>, PopupMainStateTree, ThunkArguments> {
    return function openItemActual(_dispatch: Dispatch<PopupMainState>, _, dependencies: ThunkArguments): Promise<void> {
        dependencies.channel.postOneShotMessage(MSG_TYPE_OPEN_URL_FROM_POPUP, { id, url });

        return Promise.resolve().then(() => {
            window.close();
        });
    };
}

export function openSidebar(): ThunkAction<Promise<void>, PopupMainStateTree, ThunkArguments> {
    return function openItemActual(dispatch: Dispatch<PopupMainState>, _, dependencies: ThunkArguments): Promise<void> {
        dependencies.channel.postOneShotMessage(MSG_TYPE_OPEN_SIDEBAR_FROM_POPUP, null);

        dispatch(createOpenSidebarAction());

        return Promise.resolve().then(() => {
            window.close();
        });
    };
}

export function openLibraryWindow(bookmarkId: string): ThunkAction<Promise<void>, PopupMainStateTree, ThunkArguments> {
    return function openItemActual(dispatch: Dispatch<PopupMainState>, _, dependencies: ThunkArguments): Promise<void> {
        dependencies.channel.postOneShotMessage(MSG_TYPE_OPEN_ORGANIZE_WINDOW_FROM_POPUP, {
            bookmarkId,
        });

        dispatch(createOpenLibraryWindow(bookmarkId));

        return Promise.resolve().then(() => {
            window.close();
        });
    };
}