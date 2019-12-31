    /***************************** url中的参数* **************************/
        var userID = '04O9NiVneizTiB6OvSAhBQ%3D%3D';
        var clientType = '2'; // 0 -- pc , 1 -- ios, 2 -- android
        var source = '101';  // 云盘101 ，相册102
        var token = 'hoTervWA%7C1%7CRCS%7C1579862901586%7Cafcx8t48pYhE.1ht4xlhdeosjJkBVqtM.hkmw9_ryHzwqWT7taKr1xb_uIOkVU5WFvkVgAaNYlQbAfs91CbmItsI91J0GUYpiLxc1QuoTFeFopeSnyid5eDSVZPG5cp0rakUj9n7RyQd_XKQu12YvrPYH4WV_ttc9A.gi26aagI-'; //云盘token
        var account = '19802021498'; //手机号
        var isPC = clientType == '0';
        var isIOS = clientType == '1';
        var isAndroid = clientType == '2';

        var coedNumber = 60; //验证码倒计时
        var code = ''; // 短信验证码

        // 前端加密
        var publicKeyModulus = '<%=publicKeyModulus%>';
        var publicKeyExponent = '<%=publicKeyExponent%>';
        
        // 注销结果 0-失败，1--成功，2--不满足条件
        var logoutRes = '';
    /******************浏览器回退和前进改变元素的可见性***************************/
    // $(window).on('popstate',function() {
    //     let eleID = location.hash
    //     if(eleID) {
    //         if(eleID == '#toast') {
    //             $('.mask').show()
    //             $('#confirm').show()
    //         }
    //         $(eleID).show()
    //     } else {
    //         $('#tips').show()
    //     }
    // })
    $(function() {
        // if(isAndroid || isIOS) {
        //     $('.input-text ').css('background-color','#e4e2e200')
        //     $('.get-code ').css('background-color','#e4e2e2ab')
        // }
        if (true) {
            $('.phone').html('手机号：' + account)
        }
        if(isPC) {
            $('.input-text ').attr('type','number')
        }
        $('#get_code_btn').attr("disabled",false)
        var eleID = location.hash;
        if(eleID) {
            if(eleID == '#toast') {
                $('#tips').hide();
                $('.mask').show();
                $('#confirm').show();
                $('.toast').show();
            } else if(eleID == '#logout-success') {
                $('#tips').hide();
                $('.result-success').show();
            } else if(eleID == '#logout-error') {
                $('#tips').hide();
                $('.result-error').show();
            } else{
                $('#tips').hide();
                $(eleID).show();
            }
        } else {
            $('#tips').show();
        }

        // 倒计时状态
        var codeNum;
        var userInfo = sessionStorage.getItem('userInfo');
        var beginTime = sessionStorage.getItem('beginTime');
        var endTime = new Date().getTime();
        var diffTime = parseInt((endTime - beginTime)/1000);
        userInfo = JSON.parse(userInfo);
        if(userInfo && userInfo.userID == userID) {
            codeNum = 60 - diffTime;
            countdownHandler(codeNum);
        }
        
    })
    window.onload = function() {
    };

    
    
    /**************************改变urlhash用于刷新保存状态******************/
        function changeUrlHash(value) {
            var path = location.href;
            var url;
            if (path.indexOf('#')>-1) {
                url = path.split('#')[0];
            } else {
                url = path;
            }
            return url + '#' + value;
        }

    /********************* 判断移动端为iOS还是Android 以及PC****END***/
    function logoutConfirm() {
        $('#besure_btn').attr("disabled",false)
        if(isAndroid) { // 安卓端
            if(source == '101') { // 和彩云
                if(window.jsInterface) {
                    window.jsInterface.closePage();
                }      
            } else if(source == '102') { // 和家相册
                if(hxcJs && hxcJs.hxcInvoke) {
                    hxcJs.hxcInvoke('{"action":{"key":"jumpLoginAfterCancelAccount"}}','logoutConfirmCallback');
                }
            }     
        } else if(isIOS) { // IOS
            if(source == '101') { // 和彩云
                if(window.jsInterface) {
                    window.jsInterface.closePage();
                }
            } else if(source == '102') { // 和家相册
                if(hxcJs && hxcJs.hxcInvoke) {
                    hxcJs.hxcInvoke('{"action":{"key":"jumpLoginAfterCancelAccount"}}','logoutConfirmCallback');
                }
            }  
        } else if(isPC) { //web端
            if(logoutRes == 1) { //注销成功，强制退出
                window.onheaderexec.exit();
            } else if(logoutRes == 0) {//注销失败，返回首页
                $('.result-error').hide();
                $('#tips').show();
                if(history.replaceState) {
                    window.history.replaceState('','',changeUrlHash(''));
                }
            } else { //不满足注销条件，返回首页
                $('#check-fail').hide();
                $('#tips').show();
                if(history.replaceState) {
                    window.history.replaceState('','',changeUrlHash(''));
                }
            }
        }
    }
    
    /******** ios 端注销后改变url
      * result=success 代表注销成功
      * result=success 代表注销失败
      * *************/
    function addQueryStringArg(url,name,value){
        var path = url.split('#')[0];
        var mount = url.split('#')[1] || ''; // #后面的值
        var item = name + '=' + value, res;
        if(path.indexOf("?")==-1){
            path += "?";
        }else{
            path += "&";
        }
        if(path.indexOf(item)>-1){
            res = url;
        } else {
            path += encodeURIComponent(name)+"="+encodeURIComponent(value);
            res = path + '#' + mount;
        }
        return res;
    }
        
    /******input相关事件***********************/
        function inputFocus() {
                $('.input-text').css({'outline':'none'});
                $('.input-text').css({'color':'#333'});
                // $('.input-text').val('')
                if($('.input-text').val() == '') {
                    $('.confirmLogout').css({ 
                    'background-color': '#ccc' 
                });
                } else {
                    $('.input-text').css({'color':'#333'});
                }
        }
        $('.input-text').on('blur',function() {
            if($('.input-text').val() == '') {
                $('.input-text').css({'color':'#999'});
                $('.confirmLogout').css({ 
                    'background-color': '#ccc' 
                });
            }
        })
        $(".input-text").keyup(function(){    
            $(this).val($(this).val().replace(/[^0-9.]/g,''));    
        }).bind("paste",function(){  //CTR+V事件处理    
            $(this).val($(this).val().replace(/[^0-9.]/g,''));     
        }).css("ime-mode", "disabled"); //CSS设置输入法不可用  

        $('.input-text').on('input', function() {
            var val = $('.input-text').val().replace(/[^0-9]/g,'');
            if(val.length > 6) {
                var temp = val.slice(0,6);
                $('.input-text').val(temp);
            }
            if(val == '') {
                $('.confirmLogout').css({ 
                    'background-color': '#ccc' 
                });
                // $('.confirmLogout').attr("disabled",true)
            } else { // 可点击清空输入框
                $('.confirmLogout').css({ 
                    'background-color': '#70aafc' 
                });
                $('.confirmLogout').attr("disabled",false);
            }
        })

    /************** 验证码倒计时 ******************/
        var countdownHandler = function(num){
        var $button = $(".get-code-btn");
        var number = num;
        var countdown = function(){
            if (number <= 0) {
                $button.attr("disabled",false);
                $button.html("获取验证码");
                number = 60;
                $('#get_code_btn').attr("disabled",false)
                return;
            } else {
                $button.attr("disabled",true);
                $button.html( number + 's后重试');
                number--;
                var user = {number:number,userID:userID}
                sessionStorage.setItem('userInfo',JSON.stringify(user));
            }
            setTimeout(countdown,1000);
        }
        setTimeout(countdown,1000);
    }
    /********************************接口函数定义****************************************/

        /*（1）******** 获取短信验证码*******************/
        /*
            0：成功
            999: userID参数为空
            1001: userID加密错误
            1002：短信验证码发送失败
            1003：短信验证码接口已发送，60秒内不能重复发送；
            1004：手机号不合法
        */
        $('#get_code_btn').click(function() {
            $('#get_code_btn').attr("disabled",true)
            var objUser = {
                userID: encodeURIComponent(userID)
            };
            getCode(objUser);
        })
        var getCode = function(obj) { 
            $.ajax({
                type: 'POST',
                url: '../sso/destroyAccount!sendSms.action',
                contentType: 'application/json',
                data: JSON.stringify(obj),
                dataType:"json",
                success: function(res) {
                    $('#besure_btn').attr("disabled",false);
                    $('#get_code_btn').attr("disabled",false);
                    if(res.retCode == '0') { 
                        sessionStorage.setItem('beginTime',new Date().getTime());
                        countdownHandler(coedNumber);
                        // $('.show-err-tips').css('color','green');
                        // $('.show-err-tips').html('短信验证码发送成功，请注意查收!');
                        $('#random').val(res.random);
                        // setTimeout(function() {$('.show-err-tips').html('');},2000);
                    } else if (res.retCode == '999') {
                        
                    }else if (res.retCode == '1001') {

                    } else if (res.retCode == '1002') {
                        $('.show-err-tips').html('短信验证码发送失败，请稍后再试!');
                        setTimeout(function() {$('.show-err-tips').html('');},2000);
                    } else if (res.retCode == '1003') {
                        $('.show-err-tips').html('获取验证码过于频繁，请稍后重试');
                        $('#get_code_btn').attr("disabled",false)
                        setTimeout(function() {$('.show-err-tips').html('');},2000);
                    } else if (res.retCode == '1004') {
                        $('.show-err-tips').html('手机号不合法!');
                        setTimeout(function() {$('.show-err-tips').html('');},2000);
                    } else if(res.retCode = 'AAS_200059508') {
                        $('.show-err-tips').html('获取验证码已达上限');
                        setTimeout(function() {$('.show-err-tips').html('');},2000);
                    }
                },
                error: function() {
                    $('#besure_btn').attr("disabled",false);
                    $('#get_code_btn').attr("disabled",false);
                    $('.show-err-tips').html('网络异常');
                    setTimeout(function() {$('.show-err-tips').html('');},2000);
                    $(".get-code-btn").html('获取验证码');
                }
            })
        }


        /*******************************************
          * 注销账户
          * @param userID: 手机号aes加密
          * @param validateCodeEncryt: 手机验证码加密
          * respond
          * *retCode 
          * *0：成功
            999: userID或validateCodeEncryt参数为空
            1001: userID或validateCodeEncryt加密错误
            1004：手机号不合法
            1005: 验证码失效
            1006：华为其它错误码
        * * message 错误信息
          * ***************************************/
        function destroyAccount(obj) {
            $.ajax({
                url: '../sso/destroyAccount!comfirm.action',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(obj),
                dataType:"json",
                success: function(res) {
                    $('#besure_btn').attr("disabled",false)
                    var errCode = ['OSE_203001000', 'OSE_203001014', 'OSE_203001019', 'OSE_203002309', 'OSE_203090519', 'OSE_200000401']
                    if(res.retCode == '0') {
                        if(history.replaceState) {
                            window.history.replaceState('','',changeUrlHash('logout-success'));
                        }
                        logoutRes = 1;
                        notifyLogoutRes(1); // 通知客户端注销结果 0 -- 失败， 1 -- 成功
                        $('.mask').hide();
                        $('.toast').hide();
                        $('.logout-confirm').hide();
                        $('.result-success').show();
                        countdownBtn();
                        // l  OSE_203001000：未知错误（系统内部错误）
                        // l  OSE_203001014：系统访问鉴权失败
                        // l  OSE_203001019：参数非法
                        // l  OSE_203002309：用户未注册（不存在）
                        // l  OSE_203090517：用户存在包月产品的订购关系（BMP新增错误码）
                        // l  OSE_203090518：业务销户失败，短信验证码校验失败（BMP新增错误码）
                        //   OSE_203090519：业务销户失败，用户已自销户（BMP新增错误码）
                        
                    }
                    else if (res.retCode == 'OSE_203090518' || res.retCode =='OSE_203090520') {
                        $('.mask').hide();
                        $('.toast').hide();
                        if(history.replaceState) {
                            history.replaceState('','',changeUrlHash('confirm'));
                        }
                        if(isAndroid || isIOS) {
                            $('.show-err-tips').html('验证码错误或已失效，请重新获取');
                        } else {
                            $('.show-err-tips').html('验证码错误，请重新获取');
                        }   
                        $('#besure_btn').attr("disabled",false)
                        setTimeout(function() {$('.show-err-tips').html('');},2000);
                    }
                    // else if (res.retCode == '1001') {

                    // } else if (res.retCode == '1004') {

                    // } else if (res.retCode == '1005') {
                        
                    // } 
                    else if (errCode.indexOf(res.retCode) > -1) { //注销失败
                        if(history.replaceState) {
                            window.history.replaceState('','',changeUrlHash('logout-error'));
                        }                       
                        logoutRes = 0;
                        notifyLogoutRes(0);
                        $('.mask').hide();
                        $('.toast').hide();
                        $('.logout-confirm').hide();
                        $('.result-error').show();
                    } else if (res.retCode == 'OSE_203090517') { //用户存在包月产品的订购关系，即不满足注销条件
                        if(history.replaceState) {
                            window.history.replaceState('','',changeUrlHash('check-fail'));
                        }
                        logoutRes = 2;
                        notifyLogoutRes(0);
                        $('.mask').hide();
                        $('.toast').hide();
                        $('.logout-confirm').hide();
                        $('.check-result').show();
                    } else {
                        logoutRes = 0;
                        notifyLogoutRes(0);
                        $('.mask').hide();
                        $('.toast').hide();
                        $('.logout-confirm').hide();
                        $('.result-error').show();
                    }
                },
                error: function(err) {
                    if(history.replaceState) {
                        window.history.replaceState('','',changeUrlHash('logout-error'));
                    }
                    logoutRes = 0;
                    $('.mask').hide();
                    $('.toast').hide();
                    $('.logout-confirm').hide();
                    $('.result-error').show();
                    notifyLogoutRes(0); // 通知客户端注销结果 0 -- 失败， 1 -- 成功
                }
            })
        }

    /************** 确定按钮倒计时 ******************/
    var countdownBtn = function() {
        var $button = $(".sure");
        var number = 10;
        var countdown = function() {
            if(number < 0) {
                logoutConfirm();
                return ;
            }else {
                $button.html('确定 （'+number+'）');
                number--;
            }
                setTimeout(countdown,1000);
            }
        setTimeout(countdown,1000);
    }

    /**************** 注销接口调用后通知函数，用于告诉客户端请求结果，从而处理关闭按钮*******/
        function notifyLogoutRes(res) { // 通知客户端结果 和彩云函数 1 代表成功，0 代表失败
            if(isAndroid) {
                if(source == '101') { // 和彩云
                    if(window.jsInterface) {
                        window.jsInterface.notifyUnregisterResult(res);
                    }
                }else if(source == '102') { // 和家相册
                    if(hxcJs && hxcJs.hxcInvoke) {
                        hxcJs.hxcInvoke('{"action":{"key":"hiddenReturnButton"}}','besureClickCallback');
                    }
                }
            
            } else if(isIOS) {
                if(source == '101') {  // 和彩云
                    if(window.jsInterface) {
                        window.jsInterface.notifyUnregisterResult(res);
                    }
                } else if(source == '102') { // 和家相册
                    if(hxcJs && hxcJs.hxcInvoke) {
                        hxcJs.hxcInvoke('{"action":{"key":"hiddenReturnButton"}}','besureClickCallback');
                    } 
                }
            } else { //pc web
                return;
            }
        }
    /**************** 注销接口调用后通知函数，用于告诉客户端请求结果，从而处理关闭按钮****END/


    /**************** 注销结果跳转函数，两种可能（成功和失败）*******/
        function logoutResSuccess() { // 注销成功

        }

        function logoutResFailure() { // 注销失败

        }
    /**************** 注销结果跳转函数，两种可能（成功和失败）****END/
      * 
      * 
    /************** 交互时请求数据和隐藏其他元素 *******************/
    $('.toast-close').click(function() {
        $('.mask').hide();
        $('.toast').hide();
    })
    $('#go-on-btn').click(function() { //清楚风险，确定继续
        $('.phone').html('手机号：' + account );
        // if(isAndroid || isIOS) {
        //     $('.input-text').css('background-color','#e4e2e200')
        //     $('.get-code').css('background-color','#e4e2e2ab')
        // }
        if(isPC) {
            $('.input-text ').attr('type','number')
        }
        $('.logout-tips').hide();
        $('.logout-confirm').show();
        if(history.replaceState) {
            history.replaceState('','',changeUrlHash('confirm'));
        }
    })
    $('#go_to_logout').click(function() {
        if(!$('.input-text').val()) {
            $('.show-err-tips').html('验证码不能为空');
            setTimeout(function() {$('.show-err-tips').html('');},2000);
        } else {
            $('.mask').show();
            $('.toast').show();
            if(history.replaceState) {
                history.replaceState('','',changeUrlHash('toast'));
            }
        }
    })
    $('#consider_btn').click(function() {
        $('.mask').hide();
        $('.toast').hide();
        if(history.replaceState) {
            history.replaceState('','',changeUrlHash('confirm'));
        }
    })
    $('#besure_btn').click(function() {
        $('#besure_btn').attr("disabled",true)
        code = $('.input-text').val();        
        var key = new RSAUtils.getKeyPair(publicKeyExponent, "", publicKeyModulus);
        var accountEncrypt = RSAUtils.encryptedString(key,code.split("").reverse().join(""));
        var validateCode = Base64.encode(accountEncrypt); // 加密后的验证码
        var obj = {
            userID: encodeURIComponent(userID),
            validateCodeEncryt: validateCode,
            token: encodeURIComponent(token),
            clientType: clientType,
            random: $('#random').val()
        };
        destroyAccount(obj);
        $('.input-text').attr("value",'');
    })