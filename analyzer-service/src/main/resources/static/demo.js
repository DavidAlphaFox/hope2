(function () {
    /**
     * 测试(首次从 URL 获取数据)
     */
    function initTest() {
        $("#test")
            .bsSuggest("init", {
                /*url: "/rest/sys/getuserlist?keyword=",
                    effectiveFields: ["userName", "email"],
                    searchFields: [ "shortAccount"],
                    effectiveFieldsAlias:{userName: "姓名"},*/
                clearable: true,
                url: "data.json",
                idField: "userId",
                keyField: "userName"
            })
            .on("onDataRequestSuccess", function (e, result) {
                console.log("onDataRequestSuccess: ", result);
            })
            .on("onSetSelectValue", function (e, keyword, data) {
                console.log("onSetSelectValue: ", keyword, data);
            })
            .on("onUnsetSelectValue", function () {
                console.log("onUnsetSelectValue");
            })
            .on("onShowDropdown", function (e, data) {
                console.log("onShowDropdown", e.target.value, data);
            })
            .on("onHideDropdown", function (e, data) {
                console.log("onHideDropdown", e.target.value, data);
            });
    }

    //按钮方法事件监听
    $("#methodTest button").on("click", function () {
        var method = $(this).text();
        var $i;

        if (method === "init") {
            initTest();
        } else {
            $i = $("#test").bsSuggest(method);
            if (typeof $i === "object") {
                $i = $i.data("bsSuggest");
            }
            console.log(method, $i);
            if (!$i) {
                alert("未初始化或已销毁");
            }
        }

        if (method === "version") {
            alert($i);
        }
    });
    initTest();

    /**
     * 测试(modal 中显示；不自动选中值；不显示按钮)
     */
    $("#modalTest_input")
        .bsSuggest({
            url: "data.json",
            effectiveFields: ["userName", "shortAccount"],
            searchFields: ["shortAccount"],
            //showHeader: false,
            autoSelect: false,
            showBtn: false,
            idField: "userId",
            keyField: "userName"
        })
        .on("onDataRequestSuccess", function (e, result) {
            console.log("onDataRequestSuccess: ", result);
        })
        .on("onSetSelectValue", function (e, keyword, data) {
            console.log("onSetSelectValue: ", keyword, data);
        })
        .on("onUnsetSelectValue", function () {
            console.log("onUnsetSelectValue");
        });

    /**
     * 测试(首次从 URL 获取数据，显示 header，不显示按钮，忽略大小写，可清除)
     */
    $("#testNoBtn")
        .bsSuggest({
            url: "data.json",
            /*effectiveFields: ["userName", "shortAccount"],
              searchFields: [ "shortAccount"],*/
            effectiveFieldsAlias: {userName: "姓名"},
            effectiveFields: ["userId", "userName", "shortAccount"],
            ignorecase: true,
            showHeader: true,
            showBtn: false, //不显示下拉按钮
            delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
            idField: "userId",
            keyField: "userName",
            clearable: true
        })
        .on("onDataRequestSuccess", function (e, result) {
            console.log("onDataRequestSuccess: ", result);
        })
        .on("onSetSelectValue", function (e, keyword, data) {
            console.log("onSetSelectValue: ", keyword, data);
        })
        .on("onUnsetSelectValue", function () {
            console.log("onUnsetSelectValue");
        });

    /**
     * 从 data参数中过滤数据
     */
    var dataList = {value: []},
        i = 5001;
    while (i--) {
        dataList.value.push({
            id: i,
            word: Math.random() * 100000,
            description: "https://lzw.me"
        });
    }
    $("#test_data")
        .bsSuggest({
            indexId: 2, //data.value 的第几个数据，作为input输入框的内容
            indexKey: 1, //data.value 的第几个数据，作为input输入框的内容
            data: dataList
        })
        .on("onDataRequestSuccess", function (e, result) {
            console.log(
                "从 json.data 参数中获取，不会触发 onDataRequestSuccess 事件",
                result
            );
        })
        .on("onSetSelectValue", function (e, keyword, data) {
            console.log("onSetSelectValue: ", keyword, data);
        })
        .on("onUnsetSelectValue", function () {
            console.log("onUnsetSelectValue");
        });

    /**
     * 百度搜索 API 测试
     */
    $("#baidu")
        .bsSuggest({
            emptyTip: "未检索到匹配的数据",
            allowNoKeyword: false, //是否允许无关键字时请求数据。为 false 则无输入时不执行过滤请求
            multiWord: true, //以分隔符号分割的多关键字支持
            separator: ",", //多关键字支持时的分隔符，默认为空格
            getDataMethod: "url", //获取数据的方式，总是从 URL 获取
            url: "https://unionsug.baidu.com/su?p=3&wd=", //优先从url ajax 请求 json 帮助数据，注意最后一个参数为关键字请求参数
            jsonp: "cb", //如果从 url 获取数据，并且需要跨域，则该参数必须设置
            fnProcessData: function (json) {
                // url 获取数据时，对数据的处理，作为 fnGetData 的回调函数
                var index,
                    len,
                    data = {value: []};
                if (!json || !json.s || json.s.length === 0) {
                    return false;
                }

                len = json.s.length;

                for (index = 0; index < len; index++) {
                    data.value.push({
                        word: json.s[index]
                    });
                }
                data.defaults = "baidu";

                //字符串转化为 js 对象
                return data;
            }
        })
        .on("onDataRequestSuccess", function (e, result) {
            console.log("onDataRequestSuccess: ", result);
        })
        .on("onSetSelectValue", function (e, keyword, data) {
            console.log("onSetSelectValue: ", keyword, data);
        })
        .on("onUnsetSelectValue", function () {
            console.log("onUnsetSelectValue");
        });

    /**
     * 百度搜索 API 测试，附带关键字“手机”
     */
    $("#baiduPreKeyword")
        .bsSuggest({
            allowNoKeyword: false, //是否允许无关键字时请求数据。为 false 则无输入时不执行过滤请求
            multiWord: true, //以分隔符号分割的多关键字支持
            separator: ",", //多关键字支持时的分隔符，默认为空格
            getDataMethod: "url", //获取数据的方式，总是从 URL 获取
            url:
                "https://unionsug.baidu.com/su?p=3&wd=" /*优先从url ajax 请求 json 帮助数据，注意最后一个参数为关键字请求参数*/,
            jsonp: "cb", //如果从 url 获取数据，并且需要跨域，则该参数必须设置
            fnPreprocessKeyword: function (keyword) {
                //请求数据前，对输入关键字作进一步处理方法。注意，应返回字符串
                return $("#preKeyword").val() + keyword;
            },
            fnProcessData: function (json) {
                // url 获取数据时，对数据的处理，作为 fnGetData 的回调函数
                var index,
                    len,
                    data = {value: []};
                if (!json || !json.s || json.s.length === 0) {
                    return false;
                }

                len = json.s.length;

                for (index = 0; index < len; index++) {
                    data.value.push({
                        word: json.s[index]
                    });
                }
                data.defaults = "baidu";

                //字符串转化为 js 对象
                return data;
            }
        })
        .on("onDataRequestSuccess", function (e, result) {
            console.log("onDataRequestSuccess: ", result);
        })
        .on("onSetSelectValue", function (e, keyword, data) {
            console.log("onSetSelectValue: ", keyword, data);
        })
        .on("onUnsetSelectValue", function () {
            console.log("onUnsetSelectValue");
        });

    /**
     * 百度搜索 API 测试，ajax 参数调整回调
     */
    $("#baiduAdjustAjaxParam")
        .bsSuggest({
            allowNoKeyword: false, //是否允许无关键字时请求数据。为 false 则无输入时不执行过滤请求
            multiWord: true, //以分隔符号分割的多关键字支持
            separator: ",", //多关键字支持时的分隔符，默认为空格
            getDataMethod: "url", //获取数据的方式，总是从 URL 获取
            url:
                "https://unionsug.baidu.com/su?p=3" /*优先从url ajax 请求 json 帮助数据，注意最后一个参数为关键字请求参数*/,
            jsonp: "cb",
            //调整 ajax 请求参数方法，用于更多的请求配置需求。如对请求关键字作进一步处理、修改超时时间等
            fnAdjustAjaxParam: function (keyword, opts) {
                console.log("ajax 请求参数调整：", keyword, opts);
                return {
                    jsonp: "cb",
                    dataType: "jsonp",
                    timeout: 10000,
                    data: {
                        wd: $("#customKeyword").val() + keyword
                    }
                };
            },
            // url 获取数据时，对数据的处理，作为 fnGetData 的回调函数
            fnProcessData: function (json) {
                var index,
                    len,
                    data = {value: []};
                if (!json || !json.s || json.s.length === 0) {
                    return false;
                }

                len = json.s.length;

                for (index = 0; index < len; index++) {
                    data.value.push({
                        word: json.s[index]
                    });
                }
                data.defaults = "baidu";

                //字符串转化为 js 对象
                return data;
            }
        })
        .on("onDataRequestSuccess", function (e, result) {
            console.log("onDataRequestSuccess: ", result);
        })
        .on("onSetSelectValue", function (e, keyword, data) {
            console.log("onSetSelectValue: ", keyword, data);
        })
        .on("onUnsetSelectValue", function () {
            console.log("onUnsetSelectValue");
        });

    /**
     * 淘宝搜索 API 测试
     */
    $("#taobao")
        .bsSuggest({
            indexId: 1, //data.value 的第几个数据，作为input输入框的内容
            indexKey: 0, //data.value 的第几个数据，作为input输入框的内容
            allowNoKeyword: false, //是否允许无关键字时请求数据。为 false 则无输入时不执行过滤请求
            multiWord: true, //以分隔符号分割的多关键字支持
            separator: ",", //多关键字支持时的分隔符，默认为空格
            getDataMethod: "url", //获取数据的方式，总是从 URL 获取
            showHeader: true, //显示多个字段的表头
            autoDropup: true, //自动判断菜单向上展开
            effectiveFieldsAlias: {code: "代码", name: "名称"},
            url:
                "http://127.0.0.1:8002/search?word=" /*优先从url ajax 请求 json 帮助数据，注意最后一个参数为关键字请求参数*/,
            fnProcessData: function (json) {
                var index,
                    len,
                    data = {value: []};

                if (!json || !json.symbols || !json.symbols.length) {
                    return false;
                }

                len = json.symbols.length;

                for (index = 0; index < len; index++) {
                    data.value.push({
                        code: json.symbols[index].code,
                        name: json.symbols[index].name
                    });
                }
                console.log("淘宝搜索 API: ", data);
                return data;
            }
        })
        .on("onDataRequestSuccess", function (e, result) {
            console.log("onDataRequestSuccess: ", result);
        })
        .on("onSetSelectValue", function (e, keyword, data) {
            console.log("onSetSelectValue: ", keyword, data);
        })
        .on("onUnsetSelectValue", function () {
            console.log("onUnsetSelectValue");
        });

    //禁用表单提交
    $("form").submit(function () {
        return false;
    });

    //版本切换
    $("#bsVersion button").on("click", function () {
        var ver = $(this).data("version");
        var cdnSite = "//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/";
        // var cdnSite = '//stackpath.bootstrapcdn.com/bootstrap/';
        $("#bscss").attr("href", cdnSite + ver + "/css/bootstrap.min.css");
        $("#bsjs").attr("src", cdnSite + ver + "/js/bootstrap.min.js");
    });
})();
