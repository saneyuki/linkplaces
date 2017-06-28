/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { OnClickData, CreateArgument } from '../../../typings/webext/contextMenus';
import { Tab } from '../../../typings/webext/tabs';

import { createBookmarkItem } from './Bookmark';

const CTXMENU_ID_TAB_SAVE_TAB = 'linkplaces-ctx-tab-save-tab';
const CTXMENU_ID_CONTENT_SAVE_TAB = 'linkplaces-ctx-content-save-tab';
const CTXMENU_ID_LINK_SAVE_LINK = 'linkplaces-ctx-link-save-link';

export function createContextMenu(): void {
    const list: Array<CreateArgument> = [
        {
            type: 'normal',
            id: CTXMENU_ID_TAB_SAVE_TAB,
            title: 'Add Tab to LinkPlaces',
            contexts: ['tab'],
        } as CreateArgument,
        {
            type: 'normal',
            id: CTXMENU_ID_CONTENT_SAVE_TAB,
            title: 'Add Page to LinkPlaces',
            contexts: ['page'],
        } as CreateArgument,
        {
            type: 'normal',
            id: CTXMENU_ID_LINK_SAVE_LINK,
            title: 'Add Link to LinkPlaces',
            contexts: ['link'],
        } as CreateArgument,
    ];

    for (const item of list) {
        browser.contextMenus.create(item);
    }

    browser.contextMenus.onClicked.addListener(onClicked);
}

export function removeContextMenu(): Promise<void> {
    browser.contextMenus.onClicked.removeListener(onClicked);

    return browser.contextMenus.removeAll();
}

function onClicked(info: OnClickData, tab: Tab): void {
    switch (info.menuItemId) {
        case CTXMENU_ID_TAB_SAVE_TAB: {
            if (!tab) {
                throw new TypeError();
            }

            const { title, url } = tab;
            if (typeof title !== 'string' || typeof url !== 'string') {
                throw new TypeError();
            }
            createBookmarkItem(url, title).catch(console.error);
            break;
        }
        case CTXMENU_ID_CONTENT_SAVE_TAB: {
            const url = info.pageUrl;
            if (typeof url !== 'string') {
                throw new TypeError();
            }

            const title: string = ((!!tab) && (typeof tab.title === 'string')) ? tab.title : url;
            createBookmarkItem(url, title).catch(console.error);
            break;
        }
        case CTXMENU_ID_LINK_SAVE_LINK: {
            const url = info.linkUrl;
            if (typeof url !== 'string') {
                throw new TypeError();
            }
            // `OnClickData` does not have a property containing the link title.
            // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/contextMenus/OnClickData
            // So we'll skip it.
            createBookmarkItem(url, url).catch(console.error);
            break;
        }
        default:
            throw new RangeError('unexpected `info.menuItemId`');
    }
}