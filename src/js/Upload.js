/**
 * Created by Administrator on 2017/3/9.
 */

function FileUpload(params) {
    var defParams = {
        input: '.file-upload',
        callBack: null,
        type: 1                 // 1:多文件 一个 <input type="file"/> ，2:多个 <input type="file"/>
    };
    params = $.extend({}, defParams, (params ? params : {}));

    // 多 文件选

    // 多 input file

    $('#articleMn').on('change', params.input, function () {

        var files = this.files,     // 文件对象
            fileLen = files.length,
            blobs = []; // 文件数量

        if (fileLen > 0) {
            // 至少有一个文件
            blobs = perview({files: files, fileLen: fileLen}); // 获得 blob 类型文件路径
        }


        if (typeof (callBack) == 'function') {
            callBack({
                files: files,
                blobs: blobs
            });
        }

    });

    // 生成预览图 返回预览路径 数组
    function perview(_params) {

        _params = $.extend({}, {fileLen: 1}, (_params ? _params : {}));

        var URL = window.URL || window.webkitURL,
            _blobs = [];

        if (_params.fileLen > 1) {
            for (var i = 0; i < _params.fileLen; i++) {
                _blobs.push(URL.createObjectURL(_params.files[i]));
            }
        } else {
            _blobs.push(URL.createObjectURL(_params.files[0]));
        }

        return _blobs;

    }

    // 压缩图片
}

$.fn.fileChange = function () {
    this.on('ch')
};
