/// <reference types="node" />
import { EventEmitter } from 'events';
import * as biz from './_proto/library/biz/biz_pb';
import * as biz_rpc from './_proto/library/biz/biz_pb_service';
import { JoinResult } from '../ion';
export declare class BizClient extends EventEmitter {
    protected client: biz_rpc.BizClient;
    protected streaming: biz_rpc.BidirectionalStream<biz.SignalRequest, biz.SignalReply>;
    constructor(uri: string);
    join(sid: string, uid: string, info: Map<string, any>, token: string | undefined): Promise<JoinResult>;
    leave(uid: string): Promise<string>;
    sendMessage(from: string, to: string, data: Map<string, any>): Promise<void>;
    close(): void;
}
