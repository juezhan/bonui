/// <reference path="BonUi.js" />
/// <reference path="../lib/jquery-3.1.1.min.js" />

$(function () {
    FastClick.attach(document.body);
});
//document.addEventListener('touchmove', function (e) { e.preventDefault() }, false);

var pageManager = {
    $container: $('#pages'),
    _pageStack: [],
    _configs: {},
    _defaultPage: null,
    _isGo: false,
    _viewFile: './view/',
    _fileExtensionName: '.html',
    default: function (defaultPage) {
        this._defaultPage = defaultPage;
        return this;
    },
    getCurrentUrl: function () {
        return location.hash.indexOf('#') === 0 ? location.hash : '#';
    },
    init: function () {
        var self = this;

        $(window).on('hashchange', function (e) {

            var _isBack = !self._isGo;

            self._isGo = false;
            if (!_isBack) {
                return;
            }

            var url = self.getCurrentUrl(), found = null;

            for (var i in self._pageStack) {
                var stack = self._pageStack[i];
                if (stack.config.url === url) {
                    found = stack;
                    break;
                }
            }

            if (found) {
                found.config.load ? found.config.load() : null;
                self.back();
            }
            else {
                goDefault();
            }

        });

        function goDefault() {
            self.go(self.getCurrentUrl());
        }

        self.go(this.getCurrentUrl(), 'in');

        return this;
    },
    push: function (config) {
        this._configs[config.url] = config;
        return this;
    },
    go: function (to, css) {

        var target = to, paramsStr = '', request = null;

        if (target.indexOf('?') > -1) {
            var targets = target.split('?');

            to = targets[0];
            paramsStr = '?' + targets[1];

            if (target.indexOf('&') > 0) {
                request = {};
                var strs = targets[1].split("&");
                for (var i = 0; i < strs.length; i++) {
                    request[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
        }

        //console.log(request);

        var config = this._find(to);

        if (!config) return;

        var ts = this;

        $.get(ts._viewFile + config.name + ts._fileExtensionName, function (html) {

            var $html = $(html).addClass((css != null ? css : 'slideIn')).addClass(config.name);

            ts.$container.append($html);

            ts._pageStack.push({ config: config, dom: $html });
            ts._isGo = true;

            location.hash = config.url + paramsStr;

            config.load ? config.load(request) : null;

            if (!config.isBind) {
                ts._bind(config);
            }

            if ($html.has('.article-swiper').length > 0) {
                var $articleSwiper = $html.find('.article-swiper');

                var articleSwiper = new Swiper('.article-swiper', {
                    scrollbar: '.article-swiper-scrollbar',
                    direction: 'vertical',
                    slidesPerView: 'auto',
                    mousewheelControl: true,
                    freeMode: true
                });
            }
        });

        return this;
    },
    back: function () {
        var stack = this._pageStack.pop();

        if (!stack) {
            return;
        }

        stack.dom.addClass('slideOut').on('animationend', function () {
            stack.dom.remove();
        }).on('webkitAnimationEnd', function () {
            stack.dom.remove();
        });

        return this;
    },
    _find: function (value) {

        var _c = this._configs[value];

        if (_c != null) {
            return (_c.url === value) ? _c : null;
        }

        return null;
    },
    _bind: function (page) {
        var events = page.events || {};
        for (var t in events) {
            for (var type in events[t]) {
                this.$container.on(type, t, events[t][type]);
            }
        }
        page.isBind = true;
    }
};


var home = {
    name: 'home',
    url: '#',
    template: '#tpl_home',
    events: {
        '.js_grid': {
            click: function (e) {
                pageManager.go('#' + $(this).data('target'));
            }
        },
        '#ipt_Area': {
            click: function (e) {


                var carVendors0 = [{ display: '安徽省', value: 'AH' }, { display: '福建', value: 'FJ' }],
                    carVendors1 = {
                        AH: [{ display: '安庆', value: 'a36' }, { display: '蚌埠', value: 'a37' }, { display: '巢湖', value: 'a38' }],
                        FJ: [{ display: '福州', value: 'a53' }, { display: '龙岩', value: 'a54' }]
                    },
                    carVendors2 = {
                        a36: [
                            { display: 'a36-A', value: '360' },
                            { display: 'a36-B', value: '361' },
                            { display: 'a36-C', value: '362' },
                            { display: 'a36-D', value: '363' }
                        ],
                        a37: [
                            { display: 'a37-A', value: '370' },
                            { display: 'a37-B', value: '371' },
                            { display: 'a37-C', value: '372' },
                            { display: 'a37-D', value: '373' }
                        ],
                        a38: [
                            { display: 'a38-A', value: '380' },
                            { display: 'a38-B', value: '381' },
                            { display: 'a38-C', value: '382' },
                            { display: 'a38-D', value: '383' }
                        ],
                        a53: [
                            { display: 'a53-A', value: '530' },
                            { display: 'a53-B', value: '531' },
                            { display: 'a53-C', value: '532' },
                            { display: 'a53-D', value: '533' }
                        ],
                        a54: [
                            { display: 'a54-A', value: '540' },
                            { display: 'a54-B', value: '541' },
                            { display: 'a54-C', value: '542' },
                            { display: 'a54-D', value: '543' }
                        ],
                    };

                bonui.picker({
                    input: '#ipt_Area',
                    formatValue: function (vals) {
                        if (vals.length > 0) {

                            return vals[0].display + '—' + vals[1].display + '—' + vals[2].display;

                        } else {
                            return '';
                        }
                    },
                    cols: [
                        {
                            values: carVendors0,
                            onChange: function (picker, val, s) {
                                if (picker[1]) {

                                    picker[1].setValue(carVendors1[val]);

                                    if (picker[2]) {
                                        var _val = carVendors1[val][0].value;
                                        picker[2].setValue(carVendors2[_val]);
                                    }

                                }
                            }
                        },
                        {
                            divider: true,
                            content: ':'
                        },
                        {
                            values: carVendors1.AH,
                            onChange: function (picker, val, s) {
                                if (picker[2]) {
                                    picker[2].setValue(carVendors2[val]);
                                }
                            }
                        },
                        {
                            divider: true,
                            content: ':'
                        },
                        {
                            values: carVendors2.a36
                        }
                    ]
                });
            }
        }
        
    },
    load: function () {
        console.log('LOAD');
    }
};

var buttons = {
    name: 'buttons',
    url: '#buttons',
    template: '#tpl_buttons',
    events: {
        '.js_grid': {
            click: function (e) {
                pageManager.go('#' + $(this).data('target'));
            }
        },
        '#showAlert1': {
            click: function (e) {
                bonui.alert({
                    text: 'showAlert1'
                });
            }
        },
        '#showAlert2': {
            click: function (e) {
                bonui.alert({
                    text: 'showAlert2',
                    hasTitle: false,

                });
            }
        },
        '#showConfirm_1': {
            click: function (e) {
                bonui.confirm({
                    text: 'showConfirm_1',
                    buttonConfirm: {
                        click: function (m, i) {
                            console.log('showConfirm_2 click Confirm');
                        }
                    },
                    buttonCancle: {
                        click: function (m, i) {
                            console.log('showConfirm_2 click Cancle');
                        }
                    }
                });
            }
        },
        '#showConfirm_2': {
            click: function (e) {
                bonui.confirm({
                    text: 'showConfirm_2',
                    hasTitle: false,
                    buttonConfirm: {
                        click: function (m, i) {
                            console.log('showConfirm_2 click Confirm');
                        }
                    },
                    buttonCancle: {
                        click: function (m, i) {
                            console.log('showConfirm_2 click Cancle');
                        }
                    }
                });
            }
        }
    },
    load: function (_request) {
        var request = _request;
        if (request) {
            console.log(request.a);
        }
        console.log('buttons');
    }
};

var inputs = {
    name: 'inputs',
    url: '#inputs',
    template: '#tpl_inputs',
    events: {
        '.js_grid': {
            click: function (e) {
                pageManager.go('#' + $(this).data('target'));
            }
        }
    },
    load: function (_request) {
        var request = _request;
        if (request) {
            console.log(request.a);
        }
        console.log('inputs');
    }
};

var toast = {
    name: 'toast',
    url: '#toast',
    template: '#tpl_toast',
    events: {
        '#showToast': {
            click: function (e) {
                bonui.toast();
            }
        },
        '#showLoadingToast': {
            click: function (e) {
                var m = bonui.loadingToast();
                setTimeout(function () {
                    bonui.close(m)
                }, 50000);
            }
        }
    },
    load: function (_request) {
        var request = _request;
        if (request) {
            console.log(request.a);
        }
        console.log('toast');
    }
};

var msg_success = {
    name: 'msg_success',
    url: '#msg_success',
    template: '#tpl_msg_success',
    events: {},
    load: function (_request) {
        console.log('msg_success');
    }
};

var msg_warn = {
    name: 'msg_warn',
    url: '#msg_warn',
    template: '#tpl_msg_warn',
    events: {},
    load: function (_request) {
        console.log('msg_warn');
    }
};

var dialog = {
    name: 'dialog',
    url: '#dialog',
    template: '#tpl_dialog',
    events: {
        '#showIOSDialog1': {
            click: function (e) {
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
            }
        },
        '#showActionsheet': {
            click: function (e) {

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
            }
        },
        '#showToptipsSuccess': {
            click: function (e) {
                bonui.toptipsSuccess({
                    text: '请填写正确的字段'
                })
            }
        },
        '#showToptipsWran': {
            click: function (e) {
                bonui.toptipsWran({
                    text: '请填写正确的字段'
                })

            }
        }
    },
    load: function (_request) {
        console.log('msg_warn');
    }
};

var flex = {
    name: 'flex',
    url: '#flex',
    template: '#tpl_flex',
    events: {},
    load: function (_request) {
        console.log('flex');
    }
};

pageManager
    .push(home)
    .push(buttons)
    .push(inputs)
    .push(toast)
    .push(msg_success)
    .push(msg_warn)
    .push(dialog)
    .push(flex)
    .init();

