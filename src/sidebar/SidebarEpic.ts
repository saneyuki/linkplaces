import { Nullable, isNotNull } from 'option-t/esm/Nullable/Nullable';
import { expectNotNull } from 'option-t/esm/Nullable/expect';
import { Subscription } from 'rxjs/Subscription';

import { Channel } from '../shared/Channel';
import { Epic } from '../shared/Epic';
import {
    WhereToOpenItem,
    WHERE_TO_OPEN_ITEM_TO_TAB,
} from '../shared/RemoteAction';
import { openItem } from '../shared/RemoteCall';

import { SidebarIntent } from './SidebarIntent';
import { SidebarRepository } from './SidebarRepository';

export class SidebarViewEpic implements Epic {

    private _subscription: Nullable<Subscription>;
    private _intent: SidebarIntent;
    private _channel: Channel;
    private _repository: SidebarRepository;

    constructor(intent: SidebarIntent, repository: SidebarRepository, channel: Channel) {
        this._subscription = null;
        this._intent = intent;
        this._channel = channel;
        this._repository = repository;
    }

    activate(): void {
        if (isNotNull(this._subscription)) {
            throw new TypeError('This has been activated. You cannot activate twice in the same lifecycle.');
        }

        const s = new Subscription();
        this._subscription = s;

        s.add( this._intent.openItem().subscribe(({ id, url,}) => {
            this._repository.setIsOpening(id);
            const where: WhereToOpenItem = WHERE_TO_OPEN_ITEM_TO_TAB;
            openItem(this._channel, id, url, where);
        }, console.error) );
    }

    destroy(): void {
        const s = expectNotNull(this._subscription, 'This has been destroyed');
        s.unsubscribe();
        this._subscription = null;
        this._intent = null as any; // tslint:disable-line:no-any
        this._channel = null as any; // tslint:disable-line:no-any
        this._repository = null as any; // tslint:disable-line:no-any
    }
}
