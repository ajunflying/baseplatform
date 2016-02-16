function tool() {
};

tool.icon = {
    home: 'icon-home',//主页
    tag: 'icon-tag',//标签
    pencil: 'icon-pencil',//铅笔
    settings: 'icon-settings',//设置
    user: 'icon-user',//用户
    pointer: 'icon-pointer',//坐标
    docs: 'icon-docs',//菜单默认
    calendar: 'icon-calendar',//日期
    bell: 'icon-bell',//铃铛
    envelope: 'icon-envelope',//信封
    eye: 'icon-eye',//眼
    link: 'icon-link',//链接
    speech: 'icon-speech',//消息
    flag: 'icon-flag',//标示旗帜
    barchart: 'icon-bar-chart',//统计
    basket: 'icon-basket',//购物车

    select_option: [
        {
            id: 'icon-home',
            name: 'icon-home'
        },
        {
            id: 'icon-tag',
            name: 'icon-tag'
        },
        {
            id: 'icon-pencil',
            name: 'icon-pencil'
        },
        {
            id: 'icon-settings',
            name: 'icon-settings'
        },
        {
            id: 'icon-user',
            name: 'icon-user'
        },
        {
            id: 'icon-pointer',
            name: 'icon-pointer'
        },
        {
            id: 'icon-docs',
            name: 'icon-docs'
        },
        {
            id: 'icon-calendar',
            name: 'icon-calendar'
        },
        {
            id: 'icon-bell',
            name: 'icon-bell'
        },
        {
            id: 'icon-envelope',
            name: 'icon-envelope'
        },
        {
            id: 'icon-eye',
            name: 'icon-eye'
        },
        {
            id: 'icon-link',
            name: 'icon-link'
        },
        {
            id: 'icon-speech',
            name: 'icon-speech'
        },
        {
            id: 'icon-flag',
            name: 'icon-flag'
        },
        {
            id: 'icon-bar-chart',
            name: 'icon-bar-chart'
        },
        {
            id: 'icon-basket',
            name: 'icon-basket'
        }
    ]
};

/*取url参数*/
tool.getQueryStr = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return decodeURI(r[2]);
    return null; //返回参数值
}

tool.post = function (api, data, callback) {
    var loading = new Loading();
    loading.run('数据加载中');

    $.ajax({
        type: 'POST',
        url: api,
        data: JSON.stringify(data || {}),
        contentType: 'application/json',
        success: function (result) {
            if (result.status != 0) {
                createErrorTip(result.message);
                loading.remove();
                return;
            }
            loading.remove();
            callback && callback(result.body);
        },
        error: function (error) {
            createErrorTip(error.responseText);
            loading.remove();
            //callback && callback();
        }
    });
};


tool.initSelect = function (id, list, checkValue, firstText) {
    if (!id) {
        alert('id is null');
        return;
    }
    var dom = $("#" + id);
    if (firstText) {
        dom.append("<option value=''>" + firstText + "</option>");
    } else {
        dom.append("<option value=''>——请选择——</option>");
    }
    list.forEach(function (item) {
        dom.append("<option value='" + item.id + "'>" + item.name || "" + "</option>");
    });
    if (checkValue) {
        for (var i = 0; i < list.length + 1; i++) {
            if (dom.get(0).options[i].value == checkValue) {
                dom.get(0).options[i].selected = true;
                break;
            }
        }
    }
};


tool.jqueryValidate = function (formId, submit, rules) {
    $('#' + formId).validate({
        debug: true,
        onkeyup: false,
        submitHandler: function (form) {
            submit();
        },
        rules: rules,
        /*错误提示位置*/
        errorPlacement: function (error, element) {
            error.appendTo(element.siblings("div"));
        }
    });

    $('#' + formId).submit();
};


tool.openTipPopupBtn = function (str, callback, title) {
    var popup = new Popup("_temp_popup_" + Math.round());
    popup.title = title || "系统提示框";
    popup.width = 420;
    popup.height = 50;
    popup.top = 100;
    popup.isShowBtnOk = true;
    popup.html = '<div style="height: 50px;line-height: 50px;font-size:16px; text-align: center;">'
        + (str || '什么也没做') + '</div>';
    popup.run();
    popup.btnEvent = function () {
        popup.close();
        if (popup.isShowBtnOk) {
            callback && callback();
        }
    };
};