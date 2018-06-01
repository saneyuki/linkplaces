/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { removeBookmarkItem, getLinkSchemeType, } from '../shared/Bookmark';
import { createContextMenu } from './ContextMenu';
import {
    RemoteAction,
    MSG_TYPE_OPEN_URL,
    MSG_TYPE_OPEN_ORGANIZE_WINDOW,
    WhereToOpenItem,
} from '../shared/RemoteAction';
import { Packet } from '../shared/Channel';
import { NoImplementationError } from '../shared/NoImplementationError';

// @ts-ignore
import { createTab } from './TabOpener';

(function main() {

    createContextMenu();

    browser.runtime.onConnect.addListener((s) => {
        s.onMessage.addListener(onMessageFromPopup);
        // @ts-ignore
        s.onDisconnect.addListener(function onDisconnect() {
            // @ts-ignore
            s.onDisconnect.removeListener(onDisconnect);
            // @ts-ignore
            s.onMessage.removeListener(onMessageFromPopup);
        });
    });
})();

function onMessageFromPopup(packet: Packet<RemoteAction>) {
    const { payload: msg } = packet;
    switch (msg.type) {
        case MSG_TYPE_OPEN_URL: {
            const { id, url, where } = msg.value;
            openUrlFromPopup(url, id, where).catch(console.error);
            break;
        }
        case MSG_TYPE_OPEN_ORGANIZE_WINDOW: {
            const e = new NoImplementationError('opening the places organizer window');
            throw e;
        }
        default:
            throw new RangeError(`undefined type: ${JSON.stringify(msg)}`);
    }
}

async function openUrlFromPopup(url: string, bookmarkId: string, where: WhereToOpenItem): Promise<void> {
    await openUrl(url, where);
    await removeBookmarkItem(bookmarkId);
}

function openUrl(url: string, where: WhereToOpenItem): Promise<number> {
    const { isPrivileged } = getLinkSchemeType(url);
    let opened = null;
    if (isPrivileged) {
        const e = new NoImplementationError('opening a privileged url');
        opened = Promise.reject(e);
    }
    else {
        opened = createTab(url, where);
    }

    return opened;
}
