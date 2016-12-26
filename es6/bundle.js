define("context/Context", ["require", "exports"], function (require, exports) {
    "use strict";
    var Context = (function () {
        function Context() {
        }
        return Context;
    }());
    exports.Context = Context;
});
// import {Muttasel as M} from './DatabaseConfig';
var Muttasel;
(function (Muttasel) {
    var db;
    (function (db) {
        var Database = (function () {
            function Database(cfg) {
                this._url = cfg.url;
                this.conn = null;
                this._refs = {};
                // this._onMessage = this._onMessage.bind(this); 
                if (cfg.type === db.ConnectionType.WebSocket) {
                    this.conn = new Muttasel.net.WebSocketConnection(cfg.url);
                }
                else {
                    throw new Error("Currently, only WebSocket connections are supported!");
                }
            }
            // _onMessage(cmd:net.CommandResult){
            //     if (cmd.status){
            //         let ref = this._refs[cmd.path];
            //         ref._onMessage(cmd.payload);
            //     }
            // }
            Database.prototype.ref = function (key) {
                if (this._refs[key]) {
                    return this._refs[key];
                }
                return (this._refs[key] = new db.DatabaseRef(key, this));
            };
            Database.prototype.on = function (path, cb) {
                if (this.conn) {
                }
            };
            return Database;
        }());
        db.Database = Database;
    })(db = Muttasel.db || (Muttasel.db = {}));
})(Muttasel || (Muttasel = {}));
// export = Muttasel 
var Muttasel;
(function (Muttasel) {
    var db;
    (function (db) {
        (function (ConnectionType) {
            ConnectionType[ConnectionType["WebSocket"] = 1] = "WebSocket";
            ConnectionType[ConnectionType["Ajax"] = 2] = "Ajax";
        })(db.ConnectionType || (db.ConnectionType = {}));
        var ConnectionType = db.ConnectionType;
    })(db = Muttasel.db || (Muttasel.db = {}));
})(Muttasel || (Muttasel = {}));
var Muttasel;
(function (Muttasel) {
    var db;
    (function (db) {
        var DatabaseRef = (function () {
            function DatabaseRef(key, database) {
                this._key = key;
                this._$cbid = 0;
                this._onClose = this._onClose.bind(this);
                this._onMessage = this._onMessage.bind(this);
                this._events = {
                    val: [],
                    add_item: [],
                    remove_item: [],
                    set: [],
                };
                this._db = database;
            }
            DatabaseRef.prototype._onMessage = function (msg) {
                switch (msg.type) {
                    case Muttasel.net.ResultPayloadType.ADD_ITEM:
                        this._events.add_item.forEach(function (c) { return c(msg.data); });
                        this._events.val.forEach(function (c) { return c(msg.data); });
                        break;
                    case Muttasel.net.ResultPayloadType.REMOVE_ITEM:
                        break;
                    case Muttasel.net.ResultPayloadType.SET:
                        break;
                    default:
                        throw new Error(Muttasel.util.printf("Unrecognised message type: %s", msg.type));
                }
            };
            DatabaseRef.prototype._onClose = function () {
            };
            DatabaseRef.prototype.on = function (eventType, cb) {
                if (!cb.__id) {
                    cb.__id = ++this._$cbid;
                    this._events[eventType].push(cb);
                }
            };
            DatabaseRef.prototype.off = function (eventType, cb) {
                if (!cb.__id) {
                    throw new Error(Muttasel.util.printf("Provided callback is not registered with this component."));
                }
                this._events[eventType] = this._events[eventType].filter(function (e) {
                    return e.__id !== cb.__id;
                });
            };
            return DatabaseRef;
        }());
        db.DatabaseRef = DatabaseRef;
    })(db = Muttasel.db || (Muttasel.db = {}));
})(Muttasel || (Muttasel = {}));
var Muttasel;
(function (Muttasel) {
    var db;
    (function (db) {
        var DatabaseSnapshot = (function () {
            function DatabaseSnapshot() {
            }
            DatabaseSnapshot.prototype.val = function () {
            };
            return DatabaseSnapshot;
        }());
        db.DatabaseSnapshot = DatabaseSnapshot;
    })(db = Muttasel.db || (Muttasel.db = {}));
})(Muttasel || (Muttasel = {}));
var Muttasel;
(function (Muttasel) {
    var net;
    (function (net) {
        /**
         * The supported command types.
         *
         * @export
         * @enum {number}
         */
        (function (CommandType) {
            CommandType[CommandType["CommandAssignID"] = 1] = "CommandAssignID";
            CommandType[CommandType["CommandPeerConnected"] = 2] = "CommandPeerConnected";
            CommandType[CommandType["CommandPeerDisconnected"] = 3] = "CommandPeerDisconnected";
            CommandType[CommandType["CommandList"] = 4] = "CommandList";
            CommandType[CommandType["CommandTerminate"] = 5] = "CommandTerminate";
            CommandType[CommandType["CommandBroadcast"] = 6] = "CommandBroadcast";
        })(net.CommandType || (net.CommandType = {}));
        var CommandType = net.CommandType;
        /**
         * Result status
         *
         * @export
         * @enum {number}
         */
        (function (CommandResultStatus) {
            CommandResultStatus[CommandResultStatus["SUCCESS"] = 1] = "SUCCESS";
            CommandResultStatus[CommandResultStatus["FAILURE"] = 2] = "FAILURE";
        })(net.CommandResultStatus || (net.CommandResultStatus = {}));
        var CommandResultStatus = net.CommandResultStatus;
    })(net = Muttasel.net || (Muttasel.net = {}));
})(Muttasel || (Muttasel = {}));
var Muttasel;
(function (Muttasel) {
    var net;
    (function (net) {
        (function (ConnectionEventType) {
            ConnectionEventType[ConnectionEventType["Message"] = 1] = "Message";
            ConnectionEventType[ConnectionEventType["Close"] = 2] = "Close";
            ConnectionEventType[ConnectionEventType["Error"] = 3] = "Error";
        })(net.ConnectionEventType || (net.ConnectionEventType = {}));
        var ConnectionEventType = net.ConnectionEventType;
    })(net = Muttasel.net || (Muttasel.net = {}));
})(Muttasel || (Muttasel = {}));
// import {EventEmitter} from 'events'; 
var Muttasel;
(function (Muttasel) {
    var net;
    (function (net) {
        function handleOnOpenEvent(fn, ctx) {
            return function (evt) {
                fn.call(ctx || null, evt);
            };
        }
        function handleOnMessageEvent(fn, ctx) {
            return function (evt) {
                var msg = evt.data;
                fn.call(ctx || null, msg);
            };
        }
        function handleOnCloseEvent(fn, ctx) {
            return function (evt) {
                fn.call(ctx || null, evt.code);
            };
        }
        function handleOnErrorEvent(fn, ctx) {
            return function (evt) {
                fn.call(ctx | null, evt.error);
            };
        }
        var messagesFn = {
            "open": handleOnOpenEvent,
            "close": handleOnCloseEvent,
            "message": handleOnMessageEvent,
            "error": handleOnErrorEvent,
        };
        var WebSocketConnection = (function () {
            function WebSocketConnection(url, protocls) {
                var socket = new WebSocket(url, protocls || []);
                this._onError = this._onError.bind(this);
                this._onMessage = this._onMessage.bind(this);
                this._onOpen = this._onOpen.bind(this);
                this._onClose = this._onClose.bind(this);
                this._events = {};
                this._seq = 0;
                this._$cbId = 0;
                socket.addEventListener("open", this._onOpen);
                socket.addEventListener("close", this._onClose);
                socket.addEventListener("message", this._onMessage);
                socket.addEventListener("error", this._onError);
                this._socket = socket;
            }
            WebSocketConnection.prototype._onClose = function (ev) {
                this._events['close'].forEach(function (c) { return c(ev.code); });
            };
            WebSocketConnection.prototype._onOpen = function (ev) {
                this._events['open'].forEach(function (c) { return c(ev); });
            };
            WebSocketConnection.prototype._onError = function (err) {
                this._events['error'].forEach(function (c) { return c(err.error); });
            };
            WebSocketConnection.prototype._onMessage = function (msg) {
                var result = JSON.parse(msg.data);
                this._events['message'].forEach(function (c) { return c(result); });
            };
            WebSocketConnection.prototype.send = function (data) {
                if (data) {
                    var socket = this._socket;
                    switch (typeof data) {
                        case "number":
                        case "string":
                            socket.send(data);
                            break;
                        case "function":
                            var v = data();
                            if (typeof v !== "function") {
                                return this.send(v);
                            }
                            throw new Error(Muttasel.util.printf("Cannot send data %o over the channel", data));
                        case "object":
                            socket.send((data && data.serialize && data.serialize()) || (data && data.toJSON && JSON.stringify(data.toJSON())) || JSON.stringify(data));
                            break;
                        default:
                            throw new Error(Muttasel.util.printf("Cannot send data of type %s over the channel", typeof data));
                    }
                }
            };
            WebSocketConnection.prototype.close = function () {
                this._socket.close(0, "Gracefully closing socket");
            };
            WebSocketConnection.prototype.addEventListener = function (eventType, cb, ctx) {
                var fn = messagesFn[eventType];
                if (typeof fn === "undefined") {
                    throw new Error(Muttasel.util.printf("Event of type %s is not supported", eventType));
                }
                var fx = fn(cb, ctx);
                var id = (++this._$cbId);
                cb.__id = id;
                this._events[id] = fx;
                this._socket.addEventListener(eventType, fx);
            };
            WebSocketConnection.prototype.removeEventListener = function (eventType, cb) {
                if (cb.__id) {
                    this._socket.removeEventListener(eventType, this._events[cb.__id]);
                    return;
                }
                throw new Error("Callback is not registered with this connection.");
            };
            return WebSocketConnection;
        }());
        net.WebSocketConnection = WebSocketConnection;
    })(net = Muttasel.net || (Muttasel.net = {}));
})(Muttasel || (Muttasel = {}));
var Muttasel;
(function (Muttasel) {
    var util;
    (function (util) {
        var FORMATTERS = {
            "d": function (item, extra) {
                if (extra.charAt(0) === ".") {
                    return item.toFixed(+extra.substr(1));
                }
                else if (/^[0-9]+$/.test(extra)) {
                    var len = parseInt(extra);
                    var v = item + "";
                    if (v.length < len) {
                        return "0".repeat(len - v.length) + v;
                    }
                    return v;
                }
                else {
                    return item;
                }
            },
            "x": function (item) {
                return item.toString(16);
            },
            "o": function (item) {
                if (typeof item === "object") {
                    if (item.toJSON) {
                        return JSON.stringify(item.toJSON());
                    }
                    return item.toString();
                }
                return item;
            },
            "s": function (item) {
                return item;
            }
        };
        function printf(format) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var final = args.reduce(function (prev, current, cIdx) {
                return prev.replace(/%([0-9]+?d|\.[0-9]+?d|d|x|s|o)/, function (all, a) {
                    var len = a.length, f = a.charAt(len - 1);
                    return FORMATTERS[f](current, a.substr(0, len - 1));
                });
            }, format);
            return final;
        }
        util.printf = printf;
    })(util = Muttasel.util || (Muttasel.util = {}));
})(Muttasel || (Muttasel = {}));
var Muttasel;
(function (Muttasel) {
    var util;
    (function (util) {
        function stringToByteArray(str) {
            var t = [];
            var i = 0, l = str.length, z = 0;
            for (; i < l; i++) {
                z = str.charCodeAt(i);
                if (z > 0xFF) {
                    t.push(((z >>> 8) & 0x00ff), (z & 0x00ff));
                }
                else {
                    t.push(z);
                }
            }
            return t;
        }
        util.stringToByteArray = stringToByteArray;
    })(util = Muttasel.util || (Muttasel.util = {}));
})(Muttasel || (Muttasel = {}));
