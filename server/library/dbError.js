'use strict';

module.exports = DbError;

function DbError(errorMsg, error, log) {
    this.message = errorMsg.message || "";
    this.code = errorMsg.code || 1002;
    if(error){
        this.innerError = error;
    }
    this.log = log || '';
}

/*
 * info:继承Error
 * */
DbError.prototype = new Error();
DbError.prototype.constructor = DbError;
