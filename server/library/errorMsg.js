'use strict';

module.exports = {
    UNKNOWN_ERROR: {
        code: 1000,
        message: '未知错误'
    },
    SYS_ERROR: {
        code: 1001,
        message: '系统错误'
    },
    DB_ERROR: {
        code: 1002,
        message: '数据库错误'
    },
    PARAMS_ERROR: {
        code: 1003,
        message: '参数错误：'
    },
    NORMAL_ERROR: {
        code: 1004,
        message: '失败：'
    },
    NOT_SUPPORT_REQUEST_METHOD: {
        code: 1101,
        message: '暂不支持该请求方式'
    },
    NOT_FIND_REQUEST_DATA: {
        code: 1102,
        message: '未发现有请求数据'
    },
    PROTOCOL_NOT_EXIST: {
        code: 1103,
        message: '请求接口不存在'
    },
    NOT_FIND_DATA: {
        code: 1104,
        message: '未查找到数据'
    },
    PERMISSE_EXIST_ALIKE_MODULE_NAME: {
        code: 1105,
        message: '已经存在相同的权限模块名'
    },
    PERMISSION_MODULE_IS_NOT_BOOT: {
        code: 1106,
        message: '选择的节点非模块，不允许添加权限'
    },
    PERMISSION_CHILD_EXIST_ALIKE: {
        code: 1107,
        message: '该模块已经存在相同的权限名称'
    },
    ROLE_EXIST_ALIKE_NAME: {
        code: 1108,
        message: '已经存在相同的角色名'
    },
    USER_EXIST: {
        code: 1205,
        message: '用户已经存在'
    },
    USER_NOT_EXIST: {
        code: 1206,
        message: '用户不存在'
    }
};