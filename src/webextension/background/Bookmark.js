/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// @ts-check
/* eslint-env webextensions */

// @ts-ignore
import * as _ from '../../../typings/webext/index'; // eslint-disable-line no-unused-vars
import {
    removeBookmarkItem as removeBookmarkItemWebExt,
} from '../shared/Bookmark';
import { gClassicRuntimePort } from './port';

export {
    getLinkSchemeType,
    createBookmarkItem,
} from '../shared/Bookmark';

// workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1375981
export const useClassicBookmarkBackend = true;

/**
 *  @param {string}  id
 *  @returns    {Promise<void>}
 */
export function removeBookmarkItem(id) {
    if (useClassicBookmarkBackend) {
        gClassicRuntimePort.postOneShotMessage('linkplaces-classic-remove-item', {
            id,
        });
        return Promise.resolve();
    }
    else {
        return removeBookmarkItemWebExt(id);
    }
}
