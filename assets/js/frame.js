var appVotingBeauty = '2041159069433896';
var appABTech = '152276092150806';


var server = 'local';
var appID = appVotingBeauty;

var linkLocal = 'http://localhost:8888/estee/';
var linkABTech = 'http://voting.abtech.vn/estee/';
var chooseLink = '';

if (server == 'local') {
    chooseLink = linkLocal;
} else {
    chooseLink = linkABTech;
}


function loading() {
    $('#loading').css('display', 'block');
    $('.step2-content').css('opacity', '0.2');
}

function onChangeEvent() {
    loading();
    var user_id = document.getElementById('user-id').value;
    var file_data = $('#fileToUpload').prop('files')[0];
    var type = file_data.type;
    var match = ["image/png", "image/jpeg", "image/jpg"];
    if (type == match[0] || type == match[1] || type == match[2]) {
        var form_data = new FormData();
        form_data.append('file', file_data);
        form_data.append('user_id', user_id);
        console.log('localhost');
        $.ajax({
            url: chooseLink + 'upload.php',
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function(res) {
                console.log(res);

                if (res == 'upload ok') {
                    window.location.href = chooseLink + 'frame.step4.html';

                }
            }
        });
    } else {
        console.log('chi duoc upload file anh');
    }
    return false;
}

function silderZoom() {
    var mySlider = $("#zoom-slider").slider({
        value: 1,
        step: 0.01,
        min: 0.8,
        max: 3,
        orientation: 'vertical',
        tooltip: 'hide'
    });
    var _WIDTH = $('#zoomImg').width();


    function changeImgScale() {
        var value = mySlider.slider('getValue');
        $('#zoomImg').css('width', _WIDTH * value);
        $("#zoomImg").css({
            top: '0px',
            left: '0px'
        });
        // $('#zoomImg').css('transform', 'scale(' + value + ')');
    }

    changeImgScale();
    mySlider.on('slide', changeImgScale);
    mySlider.on('slideStop', changeImgScale);
};
var _DRAGGGING_STARTED = 0;
    var _LAST_MOUSEMOVE_POSITION = {
        x: null,
        y: null,
    };
    var _DIV_OFFSET = $('#image-container').offset();
    var _CONTAINER_WIDTH = $("#image-container").outerWidth();
    var _CONTAINER_HEIGHT = $("#image-container").outerHeight();
    var _IMAGE_WIDTH;
    var _IMAGE_HEIGHT;
    var _IMAGE_LOADED = 0;
    var _ZOOM = 1;

function startDrag(){
    $('.notice-drag').css('display', 'none');
    _DRAGGGING_STARTED = 1;
    dragAction();
}

function dragAction() {
    $('.notice-drag').css('display', 'none');
    


    // Check whether image is cached or wait for the image to load
    // This is necessary before calculating width and height of the image
    if ($('#zoomImg').get(0).complete) {
        ImageLoaded();
    } else {
        $('#zoomImg').on('load', function() {
            ImageLoaded();
        });
    }

    // Image is loaded
    function ImageLoaded() {
        _ZOOM = $("#zoom-slider").slider('getValue');
        _IMAGE_WIDTH = $("#zoomImg").width() * _ZOOM;
        _IMAGE_HEIGHT = $("#zoomImg").height() * _ZOOM;
        _IMAGE_LOADED = 1;
    }

    $('#blank-frame').on('mousedown', function(event) {
        /* Image should be loaded before it can be dragged */


        if ((_IMAGE_LOADED == 1) && (_DRAGGGING_STARTED == 0)) {
            _ZOOM = $("#zoom-slider").slider('getValue');
            _IMAGE_WIDTH = $("#zoomImg").width() * _ZOOM;
            _IMAGE_HEIGHT = $("#zoomImg").height() * _ZOOM;
            _DRAGGGING_STARTED = 1;

            /* Save mouse position */
            _LAST_MOUSE_POSITION = {
                x: event.pageX - _DIV_OFFSET.left,
                y: event.pageY - _DIV_OFFSET.top
            };

        } else {
            return;
        }


    });

    $('#blank-frame').on('mouseup', function() {
        _DRAGGGING_STARTED = 0;
        $('.notice-drag').css('display', 'block');
    });

    $('#blank-frame').on('mousemove', function(event) {
        var current_mouse_position = {
            x: event.pageX - _DIV_OFFSET.left,
            y: event.pageY - _DIV_OFFSET.top
        };

        if (_DRAGGGING_STARTED == 1 && _LAST_MOUSE_POSITION.x != current_mouse_position.x && _LAST_MOUSE_POSITION.y != current_mouse_position.y) {

            var change_x = (current_mouse_position.x - _LAST_MOUSE_POSITION.x) * _ZOOM;
            var change_y = (current_mouse_position.y - _LAST_MOUSE_POSITION.y) * _ZOOM;

            /* Save mouse position */
            _LAST_MOUSE_POSITION = current_mouse_position;

            var img_top = parseInt($("#zoomImg").css('top'), 10);
            var img_left = parseInt($("#zoomImg").css('left'), 10);

            var img_top_new = img_top + change_y;
            var img_left_new = img_left + change_x;

            console.log(img_top_new);
            console.log(_CONTAINER_HEIGHT);
            console.log(_IMAGE_HEIGHT);

            /* Validate top and left do not fall outside the image, otherwise white space will be seen */
            if (img_top_new > 0)
                img_top_new = 0;
            if (img_top_new < _CONTAINER_HEIGHT - (_IMAGE_HEIGHT / _ZOOM))
                img_top_new = _CONTAINER_HEIGHT - (_IMAGE_HEIGHT / _ZOOM);

            if (img_left_new > 0)
                img_left_new = 0;
            if (img_left_new < _CONTAINER_WIDTH - (_IMAGE_WIDTH / _ZOOM))
                img_left_new = _CONTAINER_WIDTH - (_IMAGE_WIDTH / _ZOOM);

            console.log(img_top_new);
            $("#zoomImg").css({
                top: img_top_new + 'px',
                left: img_left_new + 'px'
            });
        } else {
            return;
        }
    });
}

function saveCanvas2ImageOnServer() {
    console.log('save canvas');

    html2canvas(document.getElementById('frame-and-image')).then(function(canvas) {
        var image = canvas.toDataURL("image/png");
        var user_id = document.getElementById('user-id').innerHTML;
        console.log(user_id);
        var form_data = new FormData();
        form_data.append('imgBase64', image);
        form_data.append('user_id', user_id);
        $.ajax({
            url: chooseLink + 'save-canvas.php',
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function(res) {
                if (res == 'save image ok') {
                    window.location.href = chooseLink + 'frame.step5.html';
                }
            }
        });
    });

}

// [1] Load lên các thành phần cần thiết
window.fbAsyncInit = function() {
    FB.init({
        appId: appID,
        cookie: true,
        xfbml: true,
        version: 'v2.11'
    });
    // Kiểm tra trạng thái hiện tại
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });

};

// [2] Xử lý trạng thái đăng nhập
function statusChangeCallback(response) {
    // Người dùng đã đăng nhập FB và đã đăng nhập vào ứng dụng
    if (response.status === 'connected') {
        ShowWelcome();
        //window.location.href = 'http://thathinh.texaschicken.vn/choose.html';
    }
    // Người dùng đã đăng nhập FB nhưng chưa đăng nhập ứng dụng
    else if (response.status === 'not_authorized') {
        ShowLoginButton();
    }
    // Người dùng chưa đăng nhập FB
    else {
        ShowLoginButton();
    }
}

// [3] Yêu cầu đăng nhập FB
function RequestLoginFB() {
    window.location =
        'http://graph.facebook.com/oauth/authorize?client_id=' + appID + '&scope=public_profile,email,user_likes&redirect_uri=' + chooseLink + 'frame.step2.html';
}

// [4] Hiển thị nút đăng nhập
function ShowLoginButton() {
    // document.getElementById('btb').setAttribute('style', 'display:block');
    // document.getElementById('lbl').setAttribute('style', 'display:none');
    console.log('chua dang nhap');

}

// [5] Chào mừng người dùng đã đăng nhập
function ShowWelcome() {
    FB.api('/me', function(response) {
        var name = response.name;
        var username = response.username;
        var id = response.id;

        var token = FB.getAuthResponse().accessToken;
        var public_profile_link = "https://www.facebook.com/app_scoped_user_id/" + id;
        var picture = "http://graph.facebook.com/" + id + "/picture?type=large";


        document.getElementById('user-id').value = id;
        document.getElementById('name-user').innerHTML = name;
        document.getElementById('picture-user').src = picture;


        var link_effect_pic = './photos/' + id + '/';
        document.getElementById('fresh').src = link_effect_pic + 'fresh.png';
        document.getElementById('vintage').src = link_effect_pic + 'vintage.png';
        document.getElementById('summer').src = link_effect_pic + 'summer.png';
        document.getElementById('winter').src = link_effect_pic + 'winter.png';

        var img = document.createElement("IMG");
        img.id = "zoomImg";
        img.src = link_effect_pic + 'original.png';
        // document.getElementById('zoomImg').src = link_effect_pic + 'original.png';
        document.getElementById('image-container').appendChild(img);
        silderZoom();



    });
}

function logoutFB() {
    FB.logout(function(response) {
        // user is now logged out
        window.location.href = chooseLink + 'index.html';

    });
}


(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.11&appId=" + appID;
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));