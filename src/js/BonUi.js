/// <reference path="../lib/jquery-3.1.1.min.js" />
/// <reference path="../lib/swiper.jquery.min.js" />
$(function () {
    // FastClick.attach(document.body); 影响文本框焦点事件
});

function BonUi() {

    var tools = this;

    tools.params = {
        container: $('#body'),

        dialogTitle: 'BonUI',
        dialogButtonConfirmText: '确定',
        dialogButtonCancleText: '取消',
        dialogHasTitle: true,

        pickerButtonConfirmText: '确定',
        pickerButtonCancleText: '取消',

        //toast
        toastClose: true,
        toastCloseTime: 3000,   //提示框 显示时间（毫秒）
        toastDefaultIcon: 'bonui-icon-success-no-circle',
        toastDefaultTxt: '已完成',
        toastLoadingIcon: 'bonui-loading',
        toastLoadingTxt: '数据加载中',

        col_item_height: {}

    };

    // 提示框
    /*
     bonui.toast({
     text:string,        // 提示文字
     icon:string,        // 提示消息图标 tools.params.toastDefaultIcon
     close:bool,         // 自动关闭 true,
     closeTime:int       // 提示框显示时间 tools.params.toastCloseTime
     });
     */
    tools.toast = function (params) {

        params = params || {};

        var model = $('<div class="toast">\
                            <div class="bonui-mask_transparent"></div>\
                            <div class="bonui-toast">\
                                <i class="' + (params.icon ? params.icon : tools.params.toastDefaultIcon) + ' bonui-icon_toast"></i>\
                                <p class="bonui-toast__content">' + (params.text ? params.text : tools.params.toastDefaultTxt) + '</p>\
                            </div>\
                        </div>');

        tools.params.container.append(model);

        if (params.close != false) {
            setTimeout(function () {
                tools.close(model)
            }, (params.closeTime ? params.closeTime : tools.params.toastCloseTime));
        }

        return model;

    };

    // 加载 提示框
    /*
     bonui.loadingToast({
     text:string,    // 提示文字
     icon:string     // 提示消息图标 tools.params.toastLoadingIcon
     });
     */
    tools.loadingToast = function (params) {

        params = params || {};

        return tools.toast({
            text: (params.text ? params.text : tools.params.toastLoadingTxt),
            icon: (params.icon ? params.icon : tools.params.toastLoadingIcon),
            close: false
        });
    };

    // 关闭指定 模块
    /*
     bonui.close(m); // m:bonui 返回的模块
     */
    tools.close = function (m) {

        m.remove();
    };

    // 对话框
    /*
     bonui.dialog({
     title:string,       // 标题    null
     hasTitle:bool,      // 有标题  false
     html:string,        // 内容    ''
     buttons:[
     {
     text:string,                // 按钮标题
     primary:bool,               // 推荐操作 false (true文字高亮加粗)
     click: function (m, e) {}   // 按钮点击回调函数
     },
     ……
     ],
     });

     bonui.dialog({
     title: '弹窗标题',
     html: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
     buttons: [
     {
     text: '辅助操作',
     click: function (m, e) {
     alert('辅助操作');
     }
     },
     {
     text: '主操作',
     primary: true,
     click: function (m, e) {
     alert('主操作');
     }
     }
     ]

     });
     */
    tools.dialog = function (params) {
        params = params || {};

        var buttonsHTML = "";

        if (params.buttons && params.buttons.length > 0) {

            var btns = [];

            for (var i = 0; i < params.buttons.length; i++) {
                btns.push('<a href="javascript:;" class="bonui-dialog__btn ' + (params.buttons[i].primary ? ' bonui-dialog__btn_primary' : ' bonui-dialog__btn_default') + '">' + params.buttons[i].text + '</a>');
            }

            buttonsHTML = '<div class="bonui-dialog__ft">' + btns.join('') + '</div>';
        }

        var model = $('<div class="dialog">\
                            <div class="bonui-mask"></div>\
                            <div class="bonui-dialog">\
                                ' + (params.title ? '<div class="bonui-dialog__hd"><strong class="bonui-dialog__title">' + params.title + '</strong></div>' : '') + '\
                                <div class="bonui-dialog__bd">' + params.html + '</div>\
                                ' + buttonsHTML + '\
                            </div>\
                        </div>');

        model.find(".bonui-dialog__btn").each(function (index, el) {
            $(this).bind("click", function (e) {
                if (params.buttons[index].click) params.buttons[index].click(model, e);
                if (params.buttons[index].close !== false) tools.close(model);
                if (params.click) params.click(model, index);
            });
        });

        tools.params.container.append(model);

        return model;
    };

    // 警告框
    /*

     bonui.alert({
     title:string,       // 标题    null
     hasTitle:bool,      // 有标题  false
     text:string,        // 内容    ''
     buttonText:string,  // 按钮文字 tools.params.dialogButtonConfirmText
     click:function      // 按钮回调函数   null
     });

     */
    tools.alert = function (params) {

        params = params || {};

        var param = {};

        if (params.title) {
            param.title = params.title;
        } else {
            if (params.hasTitle === undefined) {
                if (tools.params.dialogHasTitle) {
                    param.title = tools.params.dialogTitle;
                }
            } else {
                if (params.hasTitle) {
                    param.title = tools.params.dialogTitle;
                }
            }
        }

        param.html = params.text;

        param.buttons = [
            {
                text: params.buttonText ? params.buttonText : tools.params.dialogButtonConfirmText,
                primary: true,
                click: params.click
            }
        ];

        return bonui.dialog(param);

    };

    // 确认选择框
    /*

     bonui.confirm({
     title:string,       // 标题    null
     hasTitle:bool,      // 有标题  false
     text:string,        // 内容    ''
     buttonConfirm:{    // 确定按钮
     text:'',        // 按钮文字 tools.params.dialogButtonConfirmText
     primary:'',     // 是推荐操作    true
     close:'',       // 点击后关闭当前 Confirm     true
     click:function  // 按钮回调函数   null
     },
     buttonCancle:{     // 取消按钮
     text:'',        // 按钮文字 tools.params.dialogButtonConfirmText
     primary:'',     // 是推荐操作    false
     close:'',       // 点击后关闭当前 Confirm     true
     click:function  // 按钮回调函数   null
     }
     });

     */
    tools.confirm = function (params) {

        params = params || {};

        var param = {},
            buttonConfirm = {
                text: tools.params.dialogButtonConfirmText,
                primary: true,
                close: true,
                click: null
            },
            buttonCancle = {
                text: tools.params.dialogButtonCancleText,
                primary: false,
                close: true,
                click: null
            };

        if (params.title) {
            param.title = params.title;
        } else {
            if (params.hasTitle === undefined) {
                if (tools.params.dialogHasTitle) {
                    param.title = tools.params.dialogTitle;
                }
            } else {
                if (params.hasTitle) {
                    param.title = tools.params.dialogTitle;
                }
            }
        }
        if (params.buttonConfirm) {
            buttonConfirm = $.extend({}, buttonConfirm, params.buttonConfirm);
        }
        if (params.buttonCancle) {
            buttonCancle = $.extend({}, buttonCancle, params.buttonCancle);
        }

        param.html = params.text;

        param.buttons = [buttonConfirm, buttonCancle];

        return bonui.dialog(param);
    }

    //模态框
    /*
     bonui.modal({
     html: string,   // 模态框内容 html ***** 必填 *****
     css: string     // css
     });

     点击带有 ‘bonui-modal-close’ 的元素可以触发模态框关闭事件

     var _html = '<div class="bonui-modal__hd">\
     <div class="bonui-modal__close bonui-modal-close"></div>\
     </div>\
     <div class="bonui-modal__bd">\
     <div class="bonui-btn bonui-btn_primary btn1">OK 1</div>\
     <div class="bonui-btn bonui-btn_primary btn2">OK 2</div>\
     <div class="bonui-btn bonui-btn_primary btn3">OK 3</div>\
     <div class="bonui-btn bonui-btn_c1 bonui-modal-close">关闭</div>\
     </div>';

     var m = bonui.modal({ html: _html });

     m.find('.btn1').click(function () {
     console.log('ok 1');
     });

     m.find('.btn2').click(function () {
     console.log('ok 2');
     });

     m.find('.btn3').click(function () {
     console.log('ok 3');
     });

     m.find('.bonui-modal-close').click(function () {
     console.log('bonui-modal-close');
     });

     */
    tools.modal = function (params) {

        params = params || {};

        var model = $('<div class="modal ' + (params.css ? params.css : '') + '">\
                            <div class="bonui-mask"></div>\
                            <div class="bonui-modal">\
                                ' + params.html + '\
                            </div>\
                        </div>');

        tools.params.container.append(model);

        dialogShowBefore();

        return model;
    };

    //操作列表
    /*
     bonui.actionsheet({
     menus:[]        // 操作按钮组
     // text:按钮名称
     // click:按钮点击回调函数
     // close:是否关闭 actionsheet
     });
     例：
     bonui.actionsheet({
     menus: [
     {
     buttons: [
     { text: '示例菜单 1', click: function (m) { alert('示例菜单 1'); } },
     { text: '示例菜单 2', click: function (m) { alert('示例菜单 2'); } }
     ]
     },
     {
     buttons: [
     { text: '示例菜单 3', click: function (m) { alert('示例菜单 3'); } },
     { text: '示例菜单 4', click: function (m) { alert('示例菜单 4'); } },
     { text: '示例菜单 5', click: function (m) { alert('示例菜单 5'); } }
     ]
     },
     {
     buttons: [
     { text: '取消', click: function (m) { alert('取消'); } }
     ]
     }
     ]
     });
     */
    tools.actionsheet = function (params) {
        params = params || {};

        var menus = [];

        if (params.menus && params.menus.length > 0) {
            for (var i = 0; i < params.menus.length; i++) {
                if (params.menus[i].buttons && params.menus[i].buttons.length > 0) {
                    var btns = [], buttons = params.menus[i].buttons;
                    for (var j = 0; j < buttons.length; j++) {
                        btns.push('<div class="bonui-actionsheet__cell ' + (buttons[j].primary ? ' bonui-actionsheet__cell_primary' : '') + '">' + buttons[j].text + '</div>');
                    }
                    menus.push('<div class="bonui-actionsheet__menu">' + btns.join('') + '</div>');
                }
            }
        }

        var model = $('<div class="actionsheet">\
                            <div class="bonui-mask"></div>\
                            <div class="bonui-actionsheet">\
                            ' + menus.join('') + '\
                            </div>\
                        </div>');


        model.find(".bonui-actionsheet__menu").each(function (menu_index, me) {
            $(this).find(".bonui-actionsheet__cell").each(function (index, el) {
                $(this).bind("click", function (e) {
                    if (params.menus[menu_index].buttons[index].click) params.menus[menu_index].buttons[index].click(model, e);
                    if (params.menus[menu_index].buttons[index].close !== false) tools.close(model);
                    if (params.click) params.click(model, index);
                });
            });
        });

        tools.params.container.append(model);

        setTimeout(function () {
            model.find(".bonui-actionsheet").addClass('bonui-actionsheet_toggle');
        }, 10);

        return model;

    };

    // 顶部提示消息 toptips
    /*
     bonui.confirm({
     text:string,        // 消息内容    ''
     css:string,         // 显示样式     [bonui-toptips_success,bonui-toptips_warn]  ''
     closeTime:int       // 显示持续时间   毫秒  tools.params.toastCloseTime
     });

     */
    function toptips(params) {

        params = params || {};

        var model = $('<div class="toptips bonui-toptips ' + (params.css ? params.css : '') + '">' + params.text + '</div>');

        if (params.close != false) {
            setTimeout(function () {
                tools.close(model);
            }, (params.closeTime ? params.closeTime : tools.params.toastCloseTime));
        }

        tools.params.container.append(model);

        return model;
    };

    //  顶部提示消息 成功！
    /*
     bonui.toptipsSuccess({
     text:string,            // 提示文字 ***** 必填 *****
     closeTime:int           // 显示时间 tools.params.toastCloseTime
     });
     */
    tools.toptipsSuccess = function (params) {
        params = params || {};
        params.css = 'bonui-toptips_success';
        toptips(params);
    };

    //  顶部提示消息 警告！
    /*        
     bonui.toptipsWran({
     text:string,            // 提示文字 ***** 必填 *****
     closeTime:int           // 显示时间 tools.params.toastCloseTime
     });
     */
    tools.toptipsWran = function (params) {
        params = params || {};
        params.css = 'bonui-toptips_warn';
        toptips(params);
    };

    // picker 单列、多列选择器
    /*
     bonui.picker({
     input: string,              // 显示 Value 容器Id 带#号 如 #targetId  ****** 必填 ******
     title:string,               // picker 标题 html
     formatValue:function(vals){},       // 格式化 value 函数 function(vals){} vals:数据列集合
     // 例：
     // function (vals) {
     //     if (vals.length > 0) {
     //
     //         return vals[0].display + '—' + vals[1].display + '—' + vals[2].display;
     //
     //     } else {
     //         return '';
     //     }
     // },

     confirm: object,            // “确定”按钮 缺省：有“确定”按钮并使用 tools.params.pickerButtonConfirmText 的文本作为按钮文字，
     // 例
     // {
     //     hasBtn:bool,                 // 是否有“确定”按钮
     //     text:string,                 // “确定”按钮显示文字 '',
     //     click: function (obj) {}     // 按钮点击事件回调函数
     //                                  // 例：function (obj) {
     //     // obj ={
     p: bonuiPickers,   // picker cols 对象数组
     m: model,          // picker html对象
     e: e               // 点击事件
     }
     //                                  //         console.log('onConfirm');
     //                                  //     }
     //                                  // },
     cancle: object,             // “取消”按钮 缺省：有“取消”按钮并使用 tools.params.pickerButtonConfirmText 的文本作为按钮文字，
     // 例
     // {
     //     hasBtn:bool,                 // 是否有“取消”按钮
     //     text:string,                 // “取消”按钮显示文字 '',
     //     click: function (obj) {}     // 按钮点击事件回调函数
     //                                  // 例：function (obj) {
     //     // obj ={
     p: bonuiPickers,   // picker cols 对象数组
     m: model,          // picker html对象
     e: e               // 点击事件
     }
     //                                  //         console.log('onConfirm');
     //                                  //     }
     //                                  // },

     cols:[],                    // 数据列 ****** 必填 ******
     // 例：
     // [
     //      {
     //          values:[{display:'',value:''},……]，         // 数据对象数组， ****** 必填 ****** (如果是占位符该项无效)
     //                                                      // 例：{
     //                                                      //          display:'',     // 显示值
     //                                                      //          value:''        // 实际值
     //                                                      //     }
     //          onChange:function (picker, val, s) {}       // 数据项改变后回调函数
     //                                                      // 例：(如果是占位符该项无效)
     //                                                      // function (picker, val, s) {
     //                                                      //     if (picker[1]) {
     //                                                      //         picker[1].setValue(carVendors1[val]);
     //                                                      //         if (picker[2]) {
     //                                                      //             var _val = carVendors1[val][0].value;
     //                                                      //             picker[2].setValue(carVendors2[_val]);
     //                                                      //         }
     //                                                      //     }
     //                                                      // }
     //          divider: bool,  // 是占位符 false   如果是占位符 values,onChange 都无效
     //          content:string,  // 占位字符 ''
     //          width:int       // 该列的 css 样式
     //      },
     //      数据列2,
     //      数据列3,
     //      ……
     // ]
     });
     */
    tools.picker = function (params) {

        params = params || {};

        var cols = params.cols,
            colsStr = [],//选项
            pickers = [];

        if (cols) {

            var pickerIndex = 0;

            for (var i in cols) {
                var col = cols[i];
                if (col.divider) {
                    colsStr.push('<div class="picker_divider ' + (col.css ? col.css : '') + '">' + col.content + '</div>');
                } else {
                    var values = col.values,
                        onChange = col.onChange;
                    if (values) {
                        var valuesStr = [];
                        for (var j in values) {
                            valuesStr.push('<div class="swiper-slide bonui-picker-slide" data-val="' + (values[j].value ? values[j].value : values[j].display) + '" data-dsp="' + values[j].display + '">' + values[j].display + '</div>');
                        }

                        colsStr.push('<div class="bonui-picker__group_item ' + (col.css ? col.css : '') + '">\
                                        <div class="swiper-container bonui-picker-container" id="bonuiPicker_' + pickerIndex + '">\
                                            <div class="swiper-wrapper">\
                                              ' + valuesStr.join('') + '\
                                            </div>\
                                        </div>\
                                    </div>');

                        pickers.push({'id': '#bonuiPicker_' + pickerIndex, 'onChange': onChange});

                        pickerIndex++;

                    }
                }
            }
        }

        var _cancelHtml = '';

        if (params.cancle) {
            if (!params.cancle.hasBtn && params.cancle.hasBtn == false) {
                _cancelHtml = '';
            } else {
                var _cancelText = '';
                if (params.cancle.text) {
                    _cancelText = params.cancle.text;
                } else {
                    _cancelText = tools.params.pickerButtonCancleText
                }
                _cancelHtml = '<span class="bonui-picker__action bonui-picker__cancel">' + _cancelText + '</span>';
            }
        } else {
            _cancelHtml = '<span class="bonui-picker__action bonui-picker__cancel">' + tools.params.pickerButtonCancleText + '</span>';
        }

        var _confirmHtml = '';

        if (params.confirm) {
            if (!params.confirm.hasBtn && params.confirm.hasBtn == false) {
                _confirmHtml = '';
            } else {
                var _confirmText = '';
                if (params.confirm.text) {
                    _confirmText = params.confirm.text;
                } else {
                    _confirmText = tools.params.pickerButtonConfirmText
                }
                _confirmHtml = '<span class="bonui-picker__action bonui-picker__confirm">' + _confirmText + '</span>';
            }
        } else {
            _confirmHtml = '<span class="bonui-picker__action bonui-picker__confirm">' + tools.params.pickerButtonConfirmText + '</span>';
        }

        var model = $('<div>\
                        <div class="bonui-mask"></div>\
                        <div class="bonui-picker">\
                            <div class="bonui-picker__hd">\
                                ' + _cancelHtml + '\
                                ' + (params.title ? '<div class="bonui-picker__title">' + params.title + '</div>' : '') + '\
                                ' + _confirmHtml + '\
                            </div>\
                            <div class="bonui-picker__bd">\
                                <div class="bonui-picker__group">\
                                    ' + colsStr.join('') + '\
                                    <div class="picker-center-highlight"></div>\
                                    <div class="bonui-picker__mask"></div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>');


        tools.params.container.append(model);

        var bonuiPickers = [];

        if (pickers.length > 0) {

            for (var i in pickers) {

                var mySwiper = (function () {

                    var pic = pickers[i];
                    var _mySwiper = new Swiper(pic.id, {

                        pagination: '.swiper-pagination',
                        effect: 'coverflow',
                        direction: "vertical",
                        grabCursor: true,
                        centeredSlides: true,
                        slidesPerView: 'auto',
                        coverflow: {rotate: 0, stretch: 0, depth: 50, modifier: 1, slideShadows: false},
                        onSlideChangeEnd: changeEnd,
                        onTransitionEnd: changeEnd
                    });

                    function changeEnd(s) {
                        var activeIndex = s.activeIndex,
                            $currSlides = $(s.slides[activeIndex]);

                        if (pic.onChange) {
                            pic.onChange(bonuiPickers, $currSlides.data('val'), s);
                        }


                        if (pickers.length == bonuiPickers.length) {

                            var _vals = [];

                            //console.log(' ===== changeEnd ===== ');

                            for (var j in bonuiPickers) {
                                var _activeIndex = bonuiPickers[j].activeIndex,
                                    _$slide = $(bonuiPickers[j].slides[_activeIndex]);

                                _vals.push({'values': _$slide.data('val'), 'display': _$slide.data('dsp')});
                            }

                            if (params.formatValue) {
                                $(params.input).val(params.formatValue(_vals));
                            } else {
                                var retVal = [];

                                for (var i in _vals) {
                                    retVal.push(_vals[i].display);
                                }

                                $(params.input).val(retVal.join(','));
                            }
                        }


                    }

                    Swiper.prototype.setValue = function (vals) {

                        var that = this;
                        //console.log(' ===== setValue ===== ');
                        //console.log(vals);

                        var slides = [];

                        for (var i in vals) {
                            slides.push('<div class="swiper-slide bonui-picker-slide" data-val="' + vals[i].value + '" data-dsp="' + vals[i].display + '">' + vals[i].display + '</div>');
                        }

                        that.removeAllSlides();
                        that.appendSlide(slides);
                        that.slideTo(0);

                    };

                    return _mySwiper;

                })();

                //mySwiper.propertyIsEnumerable.setValue = function () {
                //    console.log('setValue');
                //}

                bonuiPickers.push(mySwiper);

            }
        }

        model.find('.bonui-picker__confirm').click(function (e) {

            if (params.confirm) {
                if (params.confirm.click) params.confirm.click({
                    p: bonuiPickers,
                    m: model,
                    e: e
                });
            }
            tools.close(model);

        });

        model.find('.bonui-picker__cancel').click(function (e) {

            if (params.cancle) {
                if (params.cancle.click) params.cancle.click({
                    p: bonuiPickers,
                    m: model,
                    e: e
                });
            }

            tools.close(model);

        });

        return model;

    }

    //  消息框
    /*
     消息框
     bonui.message({
     text:string,            // 提示文字 ***** 必填 *****
     closeTime:int           // 显示时间 tools.params.toastCloseTime
     });
     例：
     bonui.message({ text: '咋滴' });

     */
    tools.message = function (params) {

        params = params || {};

        var model = $('<div>\
                            <div class="bonui-massage">\
                                <div class="bonui-massage__md">\
                                    <div class="bonui-massage__divider"></div>\
                                    <div class="bonui-massage__bd">' + params.text + '</div>\
                                    <div class="bonui-massage__divider"></div>\
                                </div>\
                            </div>\
                        </div>');

        model.find('.bonui-massage__bd').click(function () {
            tools.close(model);
        });

        tools.params.container.append(model);

        setTimeout(function () {
            tools.close(model);
        }, (params.closeTime ? params.closeTime : tools.params.toastCloseTime));

        return model;

    }

    //后退提示
    /*
     后退提示
     bonui.backConfirm({
     text:string             // 提示文字 ***** 必填 *****
     });

     例：
     bonui.backConfirm({text:'亲，评价还未完成，您确定要离开么？'});
     */
    tools.backConfirm = function (params) {

        params = $.extend({}, {}, (params || {}));

        $(window).bind('popstate', function () {
            if (window.confirm(params.text)) {
                window.history.back();
            } else {
                _winSetState();
            }
        });

        function _winSetState() {
            if (window.history.state == 'satisfice') {
                window.history.replaceState('satisfice', null, location.href);
            } else {
                window.history.pushState('satisfice', null, location.href);
            }
        }

        _winSetState();
    }

    //滚动加载
    /*
     滚动加载
     bonui.scrollLoad({
     input: string,                      // 显示Loadmore 容器 ID       ***** 必填 *****
     scrollContainer：string||object     // 需要做滚动加载事件的容器   window
     viewportHeight: int,                // 可视窗口高度               window.screen.height
     goTop:{
     input:string,                   // 返回顶部标签 id 或者 class ***** 必填 *****
     minScrollTop: int               // 需要显示‘返回顶部'的滚动条最小位置 0
     },
     callBack:function                   // 滚动事件回调函数
     // {
     loadMoreTop: int,           // Loadmore 当前相对顶部的距离
     viewportHeight: int,        // 可视窗口高度 （同 传入参数）
     loadFlag: bool,             // 是否可执行加载事件
     setLoadMore: function ,     // 设置 Loadmore 容器显示样式
     chkLoadMore: function       // 检查列表内容是否已经填充超过视口高度
     }
     // 例：
     // params.callBack({
     loadMoreTop: loadMoreTop,
     viewportHeight: params.viewportHeight,
     loadFlag: loadFlag,
     setLoadMore: function (obj) {
     loadMore.removeClass('loading complete').addClass(obj.css);
     },
     chkLoadMore: function (obj) {
     loadFlag = obj.loadFlag;
     if (loadMore.offset().top < params.viewportHeight) {
     $(params.scrollContainer).trigger('scroll');
     }
     }
     });
     });

     例：

     var _viewportHeight = window.screen.height - ($('#footer').height())

     bonui.scrollLoad({
     input: '#loadMore',
     viewportHeight: _viewportHeight,
     callBack: function (obj) {
     if (CNT < 8) {
     _loadFlag = obj.loadFlag;
     obj.setLoadMore({ css: 'loading' });

     CNT++;
     setTimeout(function () {
     var htmls = [];

     for (var i = 0; i < 3; i++) {
     htmls.push('<li class="bonui-list-group_item">\
     <div class="bonui-list-group_item_mn">' + CNT + ' - ' + i + ' 习近平号召闻鸡起舞继续进发</div>\
     </li>');
     }

     $('#listContent').append(htmls);

     obj.setLoadMore({ css: 'complete' });

     _loadFlag = true;
     obj.chkLoadMore({ loadFlag: _loadFlag });

     }, 3000);

     } else {
     obj.setLoadMore({ css: 'complete' });
     }
     }
     });
     */
    tools.scrollLoad = function (params) {

        params = $.extend({},
            {
                scrollContainer: window,
                viewportHeight: window.screen.height
            }, (params || {}));

        var loadMore = $(params.input),
            loadFlag = true;


        $(params.scrollContainer).scroll(function () {

            var loadMoreTop = loadMore.offset().top;

            if (params.goTop) {

                _goTop({
                    input: params.goTop.input,
                    currentScrollTop: $(params.scrollContainer).scrollTop(),
                    minScrollTop: params.goTop.minScrollTop
                });

                $(params.goTop.input).click(function () {
                    $('html,body').animate({scrollTop: '0px'}, 200);
                });

            }

            if (typeof params.callBack == 'function') {

                if (loadMoreTop - $(params.scrollContainer).scrollTop() <= params.viewportHeight && loadFlag) {

                    loadFlag = false;

                    params.callBack({
                        loadMoreTop: loadMoreTop,
                        viewportHeight: params.viewportHeight,
                        loadFlag: loadFlag,
                        setLoadMore: function (obj) {
                            loadMore.removeClass('loading complete').addClass(obj.css);
                        },
                        chkLoadMore: function (obj) {
                            loadFlag = obj.loadFlag;
                            if (loadMore.offset().top < params.viewportHeight) {
                                $(params.scrollContainer).trigger('scroll');
                            }
                        }
                    });
                }
            }
        }).trigger('scroll');

    }

    //返回顶部
    /*
     bonui.goTop({
     minScrollTop:int,   // 需要显示‘返回顶部'的滚动条最小位置 默认 0
     animateTime:int,    // 返回顶部用时 默认 200
     });
     */
    tools.goTop = function (params) {

        params = getParamsObj({
            defauleParams: {
                minScrollTop: 0,
                animateTime: 200
            },
            newParams: {}
        })

        $(window).scroll(function () {

            _goTop({
                input: params.input,
                currentScrollTop: $(window).scrollTop(),
                minScrollTop: params.minScrollTop
            });

        });

        $(params.input).click(function () {
            $('html,body').animate({scrollTop: '0px'}, params.animateTime);
        });

    }

    //文件上传组件
    /*
     文件上传组件

     */
    tools.uploadFile = function (params) {
        params = params || {};

        if (params.close) {
            //关闭 上传图片小图
            tools.upimgClose({
                input: params.input + ' .bonui-upimg_close',
                callBack: function (_obj) {
                    params.close.callBack(_obj);
                }
            });
        }

        if (params.preview) {

            //图片预览
            params.preview.inputContainer = params.input;
            tools.upimgPreview(params.preview);

        }

        function bindEvent() {

            $(params.input).find('input[type=file]').localResizeIMG({
                quality: 0.8,
                before: params.before,
                success: function (_result) {

                    params.success(_result);

                    clearFile();

                }
            });
        }

        bindEvent();

        function clearFile() {

            var inputFile = $(params.input).find('input[type=file]');
            inputFile.after(inputFile.clone().val(""));
            inputFile.remove();

            bindEvent();
        }

    }

    //小图片关闭按钮
    /*
     小图片关闭按钮

     bonui.upimgClose({
     input: string,          //  按钮对象
     callBack: function      //  回调函数
     //  function(_obj){
     _obj        // Object
     _obj.ts     // 当前按钮 对象
     _obj.upImg  // 当前 .bonui-upimg div 对象
     }
     });

     例：
     bonui.upimgClose({
     input: '#upls .bonui-upimg_close,#uplsb .bonui-upimg_close',
     callBack: function (_obj) {
     console.log(_obj.upImg.data('url'));
     }
     });

     */
    tools.upimgClose = function (params) {

        params = params || {};

        if (params.input) {
            tools.params.container.on('click', params.input, function () {
                var $t = $(this),
                    $upImg = $t.closest('.bonui-upimg');

                $upImg.remove();

                if (params.callBack && typeof (params.callBack) == 'function') {
                    params.callBack({ts: $t, upImg: $upImg});
                }
                return false;
            });
        }
    }

    //预览大图
    /*
     预览大图
     bonui.upimgPreview({
     inputContainer:string,                  // 触发事件对象容器
     input: string,                          // 触发事件对象
     tapClose: bool,                         // 单击图片时触发关闭 true
     deleteButton: {                         // 删除按钮
     css: string,                        // 自定义 class 追加到原有 class 后
     style: string,                      // 自定义行内样式 格式和原 HTML 行内样式一致
     callBack: function(obj),            // 执行完删除操作后的回调函数
     callBackBefore: function(obj)       // 在执行删除操作前执行此函数内容
     // 参数 obj.deleteFunction(); 执行删除操作
     },
     closeButton: {                          // 关闭按钮
     visibility: bool,                   // 是否显示 true
     css:string,                         // 自定义 class 追加到原有 class 后
     style:string                        // 自定义行内样式 格式和原 HTML 行内样式一致
     },
     closeCallBack: function (obj) {}        // 关闭后回调函数
     });

     例：
     bonui.upimgPreview({
     inputContainer: '#upls',
     input: '.bonui-upimg',
     tapClose: true,
     deleteButton: {
     css: '',
     style: '',
     callBack: function (obj) { },
     callBackBefore: function (obj) {
     //弹出提示（组件混合使用）
     var m = bonui.confirm({
     hasTitle: false,
     text: 'Are you sure?',
     buttonConfirm: {
     click: function () {
     obj.deleteFunction();
     }
     }
     });

     ////延时
     //setTimeout(obj.deleteFunction, 2000);
     }
     },
     closeButton: {
     visibility: true,
     css: '',
     style: ''
     },
     closeCallBack: function (obj) {}
     });
     */
    tools.upimgPreview = function (params) {
        params = params || {};
        if (params.input) {

            bonui.params.container.on('click', params.inputContainer + ' ' + params.input, function (e) {
                var imgs = $(this).siblings('.bonui-upimg').addBack(),
                    len = imgs.length,
                    imgStr = [],
                    index = $(this).index(),
                    closeButton = '', deleteButton = '';

                if (params.closeButton && params.closeButton.visibility) {
                    closeButton = '<div class="bonui-icon-cancel bonui-upimg-swiper-close ' + (params.closeButton.css ? params.closeButton.css : '') + '" ' + (params.closeButton.style ? 'style=""' : '') + '></div>';
                }

                if (params.deleteButton) {
                    deleteButton = '<div class="bonui-icon-delete bonui-upimg-swiper-delete ' + (params.deleteButton.css ? params.deleteButton.css : '') + '" ' + (params.deleteButton.style ? 'style=""' : '') + '></div>';
                }

                for (var i = 0; i < len; i++) {
                    imgStr.push('<div class="swiper-slide bonui-upimg-swiper-slide" style="background-image:url(' + $(imgs[i]).data('url') + ')"></div>');
                }

                var $m = $('<div class="dialog">\
                            <div class="bonui-mask bonui-upimg-mask"></div>\
                            <div class="bonui-upimg-swiper-container">\
                                <div class="swiper-container swiper-container-horizontal bonui-upimg-swiper-container" id="bonuiUpimgSwiper">\
                                    <div class="swiper-wrapper">\
                                        ' + imgStr.join('') + '\
                                    </div>\
                                    <div class="swiper-pagination"></div>\
                                </div>\
                                ' + closeButton + '\
                                ' + deleteButton + '\
                            </div>\
                        </div>');

                dialogShowBefore();

                $m.appendTo(bonui.params.container);

                var bonuiUpimgSwiper = new Swiper('.swiper-container', {
                    initialSlide: index,
                    onTap: function (swiper) {
                        if (params.tapClose == true) {
                            upimgSwiperClose();
                        }
                    }
                });

                if (params.closeButton) {
                    $m.find('.bonui-upimg-swiper-close').click(function () {
                        upimgSwiperClose();
                    });
                }

                //删除按钮动作
                if (params.deleteButton) {
                    $m.find('.bonui-upimg-swiper-delete').click(function () {

                        if (typeof params.deleteButton.callBackBefore == 'function') {

                            params.deleteButton.callBackBefore({
                                deleteFunction: function () {
                                    upimgPreviewDelete();
                                }
                            });

                        } else {
                            upimgPreviewDelete();
                        }
                    });
                }

                function upimgPreviewDelete() {

                    //删除
                    var realIndex = bonuiUpimgSwiper.realIndex;

                    bonuiUpimgSwiper.removeSlide(realIndex);
                    bonuiUpimgSwiper.update();

                    $(params.inputContainer).find(params.input + ':eq(' + realIndex + ')').remove();

                    if (bonuiUpimgSwiper.slides.length == 0) {
                        upimgSwiperClose();
                    }

                    if (typeof params.deleteButton.callBack == 'function') {

                        params.deleteButton.callBack({index: realIndex});

                    }
                }

                function upimgSwiperClose() {

                    //关闭
                    $m.animate({'opacity': '0'}, 300, function () {
                        bonuiUpimgSwiper.destroy(false);
                        delete bonuiUpimgSwiper;
                        $m.remove();
                        dialogCloseAfter();

                        if (typeof params.closeCallBack == 'function') {
                            params.closeCallBack({});
                        }

                    });

                }

            });
        }
    };

    // 标签页
    /*
     * 标签页
     bonui.tab({
     inputContainer: string,        // 标签容器（***** 必填 *****）
     input: string,                 // 标签项  默认 '.bonui-tab__item'
     callBack: function             // 点击标签项后执行的回调函数
     function(obj){
     // obj 被点击的标签项
     }
     });
     例：
     *    bonui.tab({
     inputContainer: '#bonuiTabNav',
     input: '.bonui-tab__item',
     callBack: function (obj) {
     console.log(obj.item.data('target'));
     }
     });
     * */
    tools.tab = function (params) {
        var defaultParams = {
            input: '.bonui-tab__item'
        };
        params = $.extend({}, defaultParams, (params ? params : {}));

        tools.params.container.on('click', params.inputContainer + ' ' + params.input, function () {

            var $ts = $(this);

            $ts.addClass('active').siblings(params.input).removeClass('active');

            if (typeof params.callBack == 'function') {
                params.callBack({item: $ts});
            }

        });

    }

    // AJAX请求
    /*  bonui.ajax(
     {
     url:string,             // 请求UIL
     type:string,            // 请求类型 默认 get
     success:function,       // 同 jQuery.ajax.success
     complete:function,      // 同 jQuery.ajax.complete
     error:function          // 同 jQuery.ajax.error
     }
     );
     */
    tools.ajax = function (params) {

        params = getParamsObj({
            defauleParams: {
                type: 'get'
            },
            newParams: params
        });

        return $.ajax({
            url: params.url,
            type: params.type,
            dataType: 'json',
            success: params.success,
            complete: params.complete,
            error: params.error
        });
    }

    // 九宫格 已作废
    tools.grid = function (params) {

        params = getParamsObj({newParams: params});

        var $gridMn = $(params.input).find('.bonui-grid_mn'),
            _colItemW = $gridMn.eq(0).width();

        $gridMn.height(_colItemW);

        return {height: _colItemW};
    }

    // 全屏板块
    tools.plank = function (params) {

        var _defauleParams = {};
        params = getParamsObj({defauleParams: _defauleParams, newParams: params});

        var model = $('<div class="plank ' + (params.css ? params.css : '') + '">\
                            <div class="bonui-mask fadeIn animated"></div>\
                            <div class="bonui-plank">\
                                ' + params.html + '\
                            </div>\
                        </div>');

        tools.params.container.append(model);

        var bonuiPlank = model.find('.bonui-plank'),
            bonuiMask = model.find('.bonui-mask');

        bonuiPlank
            .addClass('slideInRight animated')
            .one('webkitAnimationEnd',function (argument) {
                $(this).removeClass('slideInRight animated');
            });

        bonuiMask
            .one('webkitAnimationEnd',function (argument) {
                $(this).removeClass('fadeIn animated');
            })
            .one('click',function () {

                bonuiPlank
                    .addClass('slideOutRight animated')
                    .one('webkitAnimationEnd',function function_name(argument) {                    
                        $(this).removeClass('slideOutRight animated').remove();
                        
                    });
                    
                bonuiMask
                    .addClass('fadeOut animated')
                    .one('webkitAnimationEnd',function (argument) {
                        dialogCloseAfter();
                        bonui.close(model);
                    });

            });

        dialogShowBefore();

        return model;

    }

    // 模态框关闭按钮
    /*
     模态框关闭按钮
     */
    tools.params.container.on('click', '.bonui-modal-close', function () {
        $(this).closest('.modal').remove();
    });

    // 关闭 主容器 滚动条
    function dialogShowBefore() {
        tools.params.container.addClass('overflow-hidden');
    }

    // 打开 主容器 滚动条
    function dialogCloseAfter() {
        tools.params.container.removeClass('overflow-hidden');
    }

    // 返回顶部 内部函数
    /*
     _goTop({
     input:string,               // 返回顶部标签 id 或者 class ***** 必填 *****
     currentScrollTop:int,       // 当前容器的滚动条位置 ***** 必填 *****
     minScrollTop:int            // 需要显示‘返回顶部'的滚动条最小位置 0
     });

     例：
     _goTop({
     input:'#goTop',                                 // 返回顶部标签 id 或者 class ***** 必填 *****
     currentScrollTop:$(window).scrollTop(),         // 当前容器的滚动条位置 ***** 必填 *****
     minScrollTop:128                                // 需要显示‘返回顶部'的滚动条最小位置 0
     });
     */
    function _goTop(params) {

        params = $.extend({}, {minScrollTop: 0}, (params ? params : {}));

        var $goTop = $(params.input);

        if (params.currentScrollTop > params.minScrollTop) {
            $goTop.addClass('active');
        } else {
            $goTop.removeClass('active');
        }


    }

    //获取参数对象
    /*
     *   使用 jQuery $.extend() 函数追加对象
     *   getParamsObj({
     defauleParams: Object       // 参数对象默认值
     newParams: Object           // 新参数值
     });
     // 返回 一个新的 合并后的新参数对象

     例：
     params = getParamsObj({
     defauleParams: {
     aa: '123'
     bb: 'asd'
     },
     newParams:{
     aa:'456',
     cc:'ASD"
     }
     });

     params = { aa:'456',bb: 'asd', cc:'ASD"};
     *
     * */
    function getParamsObj(obj) {
        return $.extend({}, (obj.defauleParams ? obj.defauleParams : {}), (obj.newParams ? obj.newParams : {}));
    }
}

window.bonui = new BonUi();
