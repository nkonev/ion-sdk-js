"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uint8ArrayToString = void 0;
function Uint8ArrayToString(dataArray) {
    let dataString = '';
    for (const element of dataArray) {
        dataString += String.fromCharCode(element);
    }
    return dataString;
}
exports.Uint8ArrayToString = Uint8ArrayToString;
