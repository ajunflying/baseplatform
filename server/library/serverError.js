'use strict';

module.exports = ServerError;

function ServerError(errorMsg, error, log) {
    this.message = (errorMsg.message + (log || '')) || "";
    this.code = errorMsg.code || -1;
    if (error) {
        this.innerError = error;
    }
}

/*
 * info:继承Error
 * */
ServerError.prototype = new Error();
ServerError.prototype.constructor = ServerError;

