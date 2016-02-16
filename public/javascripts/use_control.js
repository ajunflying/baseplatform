/**
 * Created by junpinp on 2015/12/3.
 */
var TBL = {
    pageInfo: {
        pev: "上一页",
        next: "下一页",
        first: "首页",
        last: "末页"
    }
};

function DoTable(parentId) {
    this.parentId = parentId;
    this.theadTemplete = null; //thead模板ID
    this.tbodyTemplate = null; //tbody tr模板ID
    this.ajaxUrl = '';        //post地址
    this.ajaxCallback = null; //ajax回调后执行
    this.postData = {};         //post请求数据
    this.searchAreaClass = '';
    this.tempData = [];

    this.cursor = 0;
    this.count = 10;

    this.allCount = 0; //总记录数
    this.allSize = 0;  //总页码数

    this.firstBtn = false;
    this.lastBtn = false;

    this.showTop = true; //是否显示顶部栏
    this.showSelectPageSize = true;
    this.showFooter = true; //是否显示底部栏

    this.addBtn = true;
    this.editBtn = false;
    this.deleteBtn = false;
    this.searchBtn = true;
    this.cancelBtn = true;

    this.searchDivId = '';
    this.searchEvent = null;//筛选事件
    this.addEvent = null;//新增
    this.editEvent = null;//编辑
    this.deleteEvent = null;//删除

    var table = $('<table cellpadding="1" cellspacing="1">');
    var tbody = $('<tbody>');
    var pages = null;
    var startCursor = $('<span>');//分页开始索引
    var endCursor = $('<span>');//结束索引
    var spanAllCount = $('<span>'); //总记录数
    var spanAllSize = $('<span>');//总页码

    var self;
    this.run = function (callback) {
        self = this;

        /*是否存在筛选*/
        if (self.searchDivId) {
            $('#' + self.searchDivId).addClass('doTable_search');
        }

        /*加载顶部栏*/
        initTop();

        /*加载表格*/
        initTable();

        /*加载底部栏*/
        initPageFooter();

        ajax(callback);
    };

    /*添加顶部栏*/
    var initTop = function () {
        if (!self.showTop) {
            return;
        }
        var topDiv = $('<div>');
        topDiv.appendTo($("#" + self.parentId));
        topDiv.addClass('do_table_top');

        if (self.showSelectPageSize) {
            var span = $('<span>');
            span.appendTo(topDiv);
            span.html('显示 ');

            var pageShowSize = $('<select style="height:20px;border:1px gainsboro solid;margin-top: 10px;">');
            pageShowSize.appendTo(topDiv);
            pageShowSize.addClass('choose_page_size');
            $("<option>10</option>").appendTo(pageShowSize);
            $("<option>20</option>").appendTo(pageShowSize);
            $("<option>50</option>").appendTo(pageShowSize);
            $("<option>100</option>").appendTo(pageShowSize);

            pageShowSize.bind('change', function () {
                self.count = parseInt(this.value);
                //ajax();
                self.search(null, false, true);
            });
        }

        if (self.cancelBtn) {
            cancelBtn(topDiv);
        }
        if (self.searchBtn) {
            searchBtn(topDiv);
        }
        if (self.deleteBtn) {
            deleteBtn(topDiv);
        }
        if (self.editBtn) {
            editBtn(topDiv);
        }
        if (self.addBtn) {
            addBtn(topDiv);
        }
    };

    var searchBtn = function (parent) {
        var btn = $('<a>');
        btn.html("<i class='fa fa-search'></i> 筛选");
        btn.addClass("dotable_top_btn_a");
        btn.attr('src', 'javascript:;').css({
            'float': 'right',
            'marginRight': 20
        });
        btn.appendTo(parent);
        btn.on('click', function () {
            self.search(null, false, true);
        });
    };

    var cancelBtn = function (parent) {
        var btn = $('<a>');
        btn.html("<i class='fa fa-times'></i> 取消筛选");
        btn.addClass("dotable_top_btn_a");
        btn.attr('src', 'javascript:;').css({
            'float': 'right',
            'marginRight': 20
        });
        btn.appendTo(parent);
        btn.on('click', function () {
            self.search(null, true, true);
        });
    };


    var deleteBtn = function (parent) {
        var btn = $('<a>');
        btn.html("<i class='fa fa-times'></i> 删除");
        btn.addClass("dotable_top_btn_a");
        btn.attr('src', 'javascript:;').css({
            'float': 'right',
            'marginRight': 20
        });
        btn.appendTo(parent);
        btn.on('click', function () {
            tool.openTipPopupBtn('确定要删除吗', function () {
                self.deleteEvent && self.deleteEvent();
            }, '删除提示框');
        });
    };


    var editBtn = function (parent) {
        var btn = $('<a>');
        btn.html("<i class='fa fa-edit'></i> 编辑");
        btn.addClass("dotable_top_btn_a");
        btn.attr('src', 'javascript:;').css({
            'float': 'right',
            'marginRight': 20
        });
        btn.appendTo(parent);
        btn.on('click', function () {
            self.editEvent && self.editEvent();
        });
    };

    var addBtn = function (parent) {
        var btn = $('<a>');
        btn.html("<i class='fa fa-plus'></i> 新增");
        btn.addClass("dotable_top_btn_a");
        btn.attr('src', 'javascript:;').css({
            'float': 'right',
            'marginRight': 20
        });
        btn.appendTo(parent);
        btn.on('click', function () {
            self.addEvent && self.addEvent();
        });
    };

    var initTable = function () {
        var contentDiv = $('<div>');
        contentDiv.css({
            "overflow-x": 'auto',
            "overflow-y": 'hidden'
        });
        contentDiv.addClass('do_table');
        contentDiv.appendTo($("#" + self.parentId));

        /*添加table*/
        table.appendTo(contentDiv);

        /*添加thead*/
        var thead = $('<thead>');
        thead.appendTo(table);
        thead.html($('#' + self.theadTemplete).html());

        /*添加tbody*/
        tbody.appendTo(table);
    };

    var initPageFooter = function () {
        if (!self.showFooter) {
            return;
        }
        var tfooter = $('<div>');

        /*添加footer*/
        tfooter.appendTo($("#" + self.parentId));
        tfooter.addClass('page_footer');

        var span1 = $('<span>');
        span1.html("从 ");
        span1.appendTo(tfooter);

        startCursor.html(self.cursor);
        startCursor.appendTo(tfooter);

        var span2 = $('<span>');
        span2.html(" 到");
        span2.appendTo(tfooter);

        endCursor.html((self.cursor + self.count));
        endCursor.appendTo(tfooter);

        var span6 = $('<span>');
        span6.html("条记录 ——");
        span6.appendTo(tfooter);

        var span3 = $('<span>');
        span3.html("总记录数为");
        span3.appendTo(tfooter);


        spanAllCount.html(self.allCount);
        spanAllCount.appendTo(tfooter);

        var span4 = $('<span>');
        span4.html("条");
        span4.appendTo(tfooter);

        if (self.firstBtn) {
            firstBtn(tfooter);
        }
        pevBtn(tfooter);
        inputPages(tfooter);
        nextBtn(tfooter);
        allPagesInfo(tfooter);
        if (self.lastBtn) {
            lastBtn(tfooter);
        }
    };

    var firstBtn = function (tfooter) {
        var firstBtn = $('<a>');
        firstBtn.html(TBL.pageInfo.first + "    ");
        firstBtn.attr('src', 'javascript:;');
        firstBtn.appendTo(tfooter);
        firstBtn.on('click', function () {
            self.cursor = 0;
            //ajax();
            self.search(null, false, false);
        });
    };

    var pevBtn = function (tfooter) {
        var pevBtn = $('<a>');
        pevBtn.html('<');
        pevBtn.addClass("cc_a_btn");
        pevBtn.attr('src', 'javascript:;');
        pevBtn.appendTo(tfooter);
        pevBtn.on('click', function () {
            if (self.cursor >= self.count) {
                self.cursor = parseInt(self.cursor - self.count);
            }
            //ajax();
            self.search(null, false, false);
        });
    };

    var inputPages = function (tfooter) {
        pages = $('<input type="text" onkeyup="value=value.replace(/[^\\d]/g,\'\') ' +
            '"onbeforepaste="clipboardData.setData(\'text\',clipboardData.getData(\'text\').replace(/[^\\d]/g,\'\'))">');
        pages.val(1);
        pages.addClass('currentPage');
        pages.appendTo(tfooter);
        pages.bind('keypress', function (event) {
            if (event.keyCode == "13") {
                var _currentPage = parseInt(pages.val());
                if (_currentPage <= parseInt(self.allSize)) {
                    self.cursor = parseInt((_currentPage - 1) * self.count);
                    //ajax();
                    self.search(null, false, false);
                }
            }
        });
    };

    var nextBtn = function (tfooter) {
        var nextBtn = $('<a>');
        nextBtn.html(">");
        nextBtn.addClass("cc_a_btn");
        nextBtn.attr('src', 'javascript:;');
        nextBtn.appendTo(tfooter);
        nextBtn.on('click', function () {
            if (self.allCount - self.cursor > self.count) {
                self.cursor = parseInt(self.cursor + self.count);
            }
            //ajax();
            self.search(null, false, false);
        });
    };

    var allPagesInfo = function (tfooter) {
        var span2 = $('<span>');
        span2.html("页&nbsp;");
        span2.css({
            'float': 'right'
        });
        span2.appendTo(tfooter);

        spanAllSize.html(0);
        spanAllSize.css({
            'float': 'right'
        });
        spanAllSize.appendTo(tfooter);

        var span1 = $('<span>');
        span1.html("总计");
        span1.css({
            'float': 'right'
        });
        span1.appendTo(tfooter);
    };

    var lastBtn = function (tfooter) {
        var lastBtn = $('<a>');
        lastBtn.html(TBL.pageInfo.last);
        lastBtn.attr('src', 'javascript:;');
        lastBtn.appendTo(tfooter);
        lastBtn.on('click', function () {
            self.cursor = parseInt(self.allCount - (self.allCount % self.count));
            //ajax();
            self.search(null, false, false);
        });
    };

    var ajax = function (callback) {
        if (!self.ajaxUrl) {
            callback && callback();
            return;
        }
        var loading = new Loading();
        loading.run('列表加载中');

        self.postData.cursor = self.cursor;
        self.postData.count = self.count;


        var initData = function (data) {
            self.allCount = parseInt(data.count || 0);
            var html = "";
            self.currentList = data.list || [];

            if (self.tbodyTemplate) {
                data.list.forEach(function (item) {
                    var _template = _.template($("#" + self.tbodyTemplate).html());
                    var _temp = _template(item);
                    html += _temp;
                });
            }
            tbody.html("");
            tbody.html(html);

            /*开始数据*/
            if (startCursor) {
                startCursor.html(parseInt(self.cursor) + 1);
            }
            /*结束数据*/
            if (endCursor) {
                endCursor.html(parseInt(self.cursor) + self.currentList.length);
            }
            /*总数据*/
            if (spanAllCount) {
                spanAllCount.html(self.allCount);
            }
            /*总页码*/
            self.allSize = parseInt(Math.ceil(self.allCount / self.count));
            if (spanAllSize) {
                spanAllSize.html(self.allSize);
            }
            /*当前页码*/
            if (pages) {
                pages.val(parseInt(self.cursor / self.count) + 1);
            }

            table.find('tr:even').each(function () {
                $(this).find('td').css({
                    'background-color': '#F9F9F8'
                });
            });

            var oldcolor;
            table.find('tr').on('mouseover', function () {
                oldcolor = $(this).find('td').css('background-color');
                $(this).find('td').css({
                    'background-color': '#dff0d8'
                });
            }).on('mouseout', function () {
                $(this).find('td').css({
                    'background-color': oldcolor
                });
            });

            /*删除加载*/
            loading.remove();
        };

        if (self.tempData.length > 0) {
            /*测试数据*/
            initData({
                count: 100,
                list: self.tempData
            });
            callback && callback();
        } else {
            $.ajax({
                type: 'POST',
                url: self.ajaxUrl,
                data: JSON.stringify(self.postData),
                contentType: 'application/json',
                success: function (result) {
                    //result = JSON.parse(result);
                    //console.log(result)
                    if (result.status != 0) {
                        createErrorTip(result.message);
                        loading.remove();
                        return;
                    }
                    loading.remove();

                    if (!result.body.hasOwnProperty('list')) {
                        createErrorTip('返回结果必须包含list=[]');
                        return;
                    }
                    if (!result.body.hasOwnProperty('count')) {
                        createErrorTip('返回结果必须包含count=int');
                        return;
                    }

                    if (self.ajaxCallback) {
                        self.ajaxCallback(result.body.list);
                    }

                    initData(result.body);

                    callback && callback();
                },
                error: function (error) {
                    createErrorTip(error.responseText);
                    loading.remove();
                    callback && callback();
                }
            });
        }
    }

    this.getObjectById = function (id) {
        for (var i = 0; i < self.currentList.length; i++) {
            if (self.currentList[i]['id'] === id || self.currentList[i]['objectId'] === id) {
                return self.currentList[i];
            }
        }
        return null;
    };

    this.refresh = function () {
        //self.ajax();
        self.search(null, false, false);
    };

    this.search = function (data, cancel, resetCursor) {
        if (resetCursor === undefined) {
            resetCursor = true;
        }

        if (cancel) {
            self.postData = {};

            if (self.searchDivId && $('#' + self.searchDivId).size() > 0) {
                $('.' + (self.searchAreaClass || 'doTable_search')).find('.search').each(function () {
                    if (this.tagName === 'SELECT' && $(this).val()) {
                        $(this).val('');
                    }
                    if (this.tagName === 'INPUT' && $(this).val()) {
                        $(this).val('');
                    }
                });
            }
        } else {
            if (data) {
                self.postData = data;
            }
            if (self.searchDivId && $('.' + self.searchDivId).size() > 0) {
                $('.' + (self.searchAreaClass || 'doTable_search')).find('.search').each(function () {
                    if (this.id) {
                        if (this.tagName === 'SELECT' && $(this).val()) {
                            self.postData[this.id] = $(this).val();
                        }
                        if (this.tagName === 'INPUT' && $(this).val()) {
                            self.postData[this.id] = $(this).val();
                        }
                    }
                });
            }
        }

        if (resetCursor) {
            self.cursor = 0;
        }

        ajax(function () {
            self.postData = {};
        });
    };
};


function Loading() {
    var shade = $('<div>');
    var div = $('<div>');
    this.run = function (msg) {

        shade.addClass('div_shade2');
        shade.appendTo($('body'));


        div.addClass('blockUI');
        div.addClass('blockMsg');
        div.addClass('blockPage');
        div.addClass('shade_div');
        div.appendTo($('body'));


        var div2 = $('<div>');
        div2.addClass('loading-message');
        div2.addClass('loading-message-boxed');
        div2.appendTo(div);

        var img = $('<img>');
        img.attr('src', '/img/loading-spinner-grey.gif');
        img.appendTo(div2);

        var span = $('<span>');
        span.html(" " + msg);
        span.appendTo(div2);
    };

    this.remove = function () {
        shade.remove();
        div.remove();
    }
};


var __ShadeCount__ = 0;
function Popup(id) {
    this.top = 50;
    this.width = 550;
    this.height = 300;
    this.id = id || ('div_' + parseInt((new Date()).getTime() / 1000));
    this.title = 'popup';
    this.isShowBtnOk = false;
    this.btnEvent = null;
    this.html = "";

    var self = this;
    this.run = function (templateId, data, callback) {

        createShade();

        var div = $('<div class="popup" id="' + self.id + '">');
        var str = '<div class="popup_top"><span class="popup_title">' + self.title + '</span><img src="/img/remove-icon-small.png" class="aclose"/></div>';

        var contentStr = '';
        if (templateId && data) {
            var _template = _.template($("#" + templateId).html());
            contentStr = '<div class="popup_content">' + _template(data) + '</div>';
        } else {
            contentStr = '<div class="popup_content">' + self.html + '</div>';
        }
        var bottom = '<div class="popup_bottom">';
        if (self.isShowBtnOk) {
            bottom += '<input type="button" value="确定" class="btn_ok __btnevent__"/>';
        }

        bottom += '<input type="button" value="关闭" class="btn-cancel aclose"/>';
        bottom += '</div>';

        div.html(str + contentStr + bottom);
        div.appendTo($("body"));
        $('#' + self.id).css({
            width: self.width + 'px',
            top: -(self.height + $(window).scrollTop()) + 'px',
            marginLeft: -self.width / 2 + 'px',
            opacity: '0'
        });
        $('#' + self.id + ' .popup_content').css({
            height: self.height + 'px'
        });

        var _close = function(){
            __ShadeCount__--;
            $('#' + self.id).animate({
                top: '-' + $('#' + self.id).height() + 'px',
                opacity:'0',
            }, null, function(){
                $("#" + self.id).remove();
                if (__ShadeCount__ <= 0) {
                    $(".div_shade").remove();
                }
            });
        };

        $("#" + self.id + " .aclose").on('click', function () {
            _close();
        });

        $('#' + self.id).animate({
            top: (self.top + $(window).scrollTop()) + 'px',
            opacity:'1',
        });

        $('.__btnevent__').bind('click', function () {
            if (self.btnEvent) {
                self.btnEvent();
                //_close();
            }
        });

        $(window).scroll(function () {
            $('#' + self.id).css({
                top: (self.top + $(window).scrollTop()) + 'px'
            });
        });

        callback && callback();
    };

    var createShade = function () {
        __ShadeCount__++;
        if (__ShadeCount__ <= 1) {
            var div = $('<div>');
            div.html("           ");
            div.addClass('div_shade');
            div.addClass('aclose');
            div.appendTo($("body"));
        }
    };

    this.close = function () {
        $("#" + self.id + " .aclose").click();
    };
};


var error_top_count = 0;
function createErrorTip(message) {
    if (error_top_count > 0) {
        closeErrorTip();
    }

    var div = $('<div>');
    div.appendTo($('body'));
    div.addClass('error_tip_show').addClass('alert-error').animate({
        top: $(window).scrollTop()
    });

    var icon = '&nbsp;&nbsp;<i class="fa fa-warning" style="color:#a94442;"></i>&nbsp;&nbsp;';
    var close = '<img src="/img/remove-icon-small.png" onclick="closeErrorTip()" style="float:right;margin-top: 15px;margin-right: 20px;">';
    div.html(icon + message + close);

    error_top_count++;

    $(window).scroll(function () {
        var top = $(window).scrollTop();
        var left = $(window).scrollLeft();
        $(".error_tip_show").css({left: left + "px", top: top + "px"});
    });
}

function closeErrorTip() {
    error_top_count--;
    $(".error_tip_show").remove();
};


var message_tip_top_count = 0;
function createMessageTip(message) {
    if (message_tip_top_count > 0) {
        _closeMessageTip();
    }

    var div = $('<div>');
    div.appendTo($('body'));
    div.addClass('message_tip_top_show').addClass('alert-success').animate({
        top: $(window).scrollTop()
    });

    var icon = '&nbsp;&nbsp;<i class="fa fa-check" style="color:#3c763d;"></i>&nbsp;&nbsp;';
    var close = '<img src="/img/remove-icon-small.png" onclick="_closeMessageTip()" style="float:right;margin-top: 15px;margin-right: 20px;">';
    div.html(icon + message + close);

    message_tip_top_count++;

    $(window).scroll(function () {
        var top = $(window).scrollTop();
        var left = $(window).scrollLeft();
        $(".message_tip_top_show").css({left: left + "px", top: top + "px"});
    });

    setTimeout(function () {
        _closeMessageTip();
    }, 2000);
}

function _closeMessageTip() {
    message_tip_top_count--;
    $(".message_tip_top_show").remove();
};