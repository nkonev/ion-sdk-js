"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IonConnector = exports.StreamState = exports.PeerState = exports.LocalStream = exports.Client = void 0;
const client_1 = require("./client");
exports.Client = client_1.default;
const stream_1 = require("./stream");
Object.defineProperty(exports, "LocalStream", { enumerable: true, get: function () { return stream_1.LocalStream; } });
const biz_1 = require("./signal/biz");
const grpc_web_impl_1 = require("./signal/grpc-web-impl");
var PeerState;
(function (PeerState) {
    PeerState[PeerState["NONE"] = 0] = "NONE";
    PeerState[PeerState["JOIN"] = 1] = "JOIN";
    PeerState[PeerState["UPDATE"] = 2] = "UPDATE";
    PeerState[PeerState["LEAVE"] = 3] = "LEAVE";
})(PeerState = exports.PeerState || (exports.PeerState = {}));
var StreamState;
(function (StreamState) {
    StreamState[StreamState["NONE"] = 0] = "NONE";
    StreamState[StreamState["ADD"] = 1] = "ADD";
    StreamState[StreamState["REMOVE"] = 2] = "REMOVE";
})(StreamState = exports.StreamState || (exports.StreamState = {}));
class IonConnector {
    constructor(url, config) {
        this._sid = "";
        this._uid = "";
        this._sfu = undefined;
        this._biz = new biz_1.BizClient(url);
        this._biz.on("join-reply", (success, reason) => __awaiter(this, void 0, void 0, function* () {
            if (this.onjoin) {
                this.onjoin(success, reason);
            }
            if (success && !this._sfu) {
                const signal = new grpc_web_impl_1.IonSFUGRPCWebSignal(url);
                const sfu = new client_1.default(signal, config);
                sfu.ontrack = (track, stream) => { var _a; return (_a = this.ontrack) === null || _a === void 0 ? void 0 : _a.call(this, track, stream); };
                sfu.ondatachannel = (ev) => { var _a; return (_a = this.ondatachannel) === null || _a === void 0 ? void 0 : _a.call(this, ev); };
                sfu.onspeaker = (ev) => { var _a; return (_a = this.onspeaker) === null || _a === void 0 ? void 0 : _a.call(this, ev); };
                this._sfu = sfu;
                yield sfu.join(this._sid, this._uid);
            }
        }));
        this._biz.on("leave-reply", (reason) => {
            if (this.onleave) {
                this.onleave(reason);
            }
        });
        this._biz.on("peer-event", (ev) => {
            if (this.onpeerevent) {
                this.onpeerevent(ev);
            }
        });
        this._biz.on("stream-event", (ev) => {
            if (this.onstreamevent) {
                this.onstreamevent(ev);
            }
        });
        this._biz.on("message", (msg) => {
            if (this.onmessage) {
                this.onmessage(msg);
            }
        });
    }
    get sfu() { return this._sfu; }
    join(sid, uid, info, token) {
        return __awaiter(this, void 0, void 0, function* () {
            this._sid = sid;
            this._uid = uid;
            return this._biz.join(sid, uid, info, token);
        });
    }
    leave(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._biz.leave(uid);
        });
    }
    message(from, to, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._biz.sendMessage(from, to, data);
        });
    }
    close() {
        var _a;
        (_a = this._sfu) === null || _a === void 0 ? void 0 : _a.close();
        this._biz.close();
    }
}
exports.IonConnector = IonConnector;