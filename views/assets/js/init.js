/* functions */

function armin_modal(params) {
  var p = {
    id: 'main',                         
    title: 'Untitled',                  
    body: '',                           
    customClass: '',                    
    customAttributes: {},       // object {'key': 'value'}
    width: 0,                           
    oncreate: function() {}         
  };
  for(var i in params) p[i] = params[i];

  var modalBlock = template('#template_modal', ['modalWnd_'+p.id, p.title, p.body, p.customClass]);
  console.log(p);
  if($('#modalWnd_'+p.id).length==0) {
    $('body').append(modalBlock);
    $('.blur-content').addClass('blur');
  }
  else $('#modalWnd_'+p.id).replaceWith(modalBlock);
  for(var i in p.customAttributes) $('#modalWnd_'+p.id).attr(i, p.customAttributes[i]);
  if(p.width > 0 && !isNaN(p.width)) $('#modalWnd_'+p.id+' .modal').outerWidth(p.width);

  $('#modalWnd_'+p.id).fadeIn(300);
  $('#modalWnd_'+p.id+' [rel="modal:close"]').click(function(e) {
    e.preventDefault();
    $('.blur-content').removeClass('blur');
    $('#modalWnd_'+p.id).fadeOut(300);
    setTimeout(function() {$('#modalWnd_'+p.id).remove();}, 300);
  });
  if(typeof p.oncreate === 'function') setTimeout(p.oncreate, 300);
}
function modalAlert(text) {
  armin_modal({
    title: '&nbsp;',
    body: text+'<br/>'+
    '<div class="form-btn-center"><button type="submit" href="javascript://" onclick="$(\'.close-modal\').click();return false;" class="form-btn form-btn-login gradient-purple"><span>OK</span></button></div>',
    width:450
  });
}
function apireq(method,params,callback) {
    var data = [];
    if(typeof params === 'object') {for(let param in params) data.push(param+'='+encodeURIComponent(params[param]));data=data.join('&');}
    else data = params;
    $.post('/'+method, data, function(d) {
        if(typeof d !== 'object') return modalAlert('Internal server error');
        if(typeof callback === 'function') return callback(d); else return true;
    });
}
function randomInteger(min, max) {
    var rand = min + Math.random() * (max - min)
    rand = Math.round(rand);
    return rand;
}
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
function setCookie(name, value, options) {
  options = options || {};
 
  var expires = options.expires;
 
  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires*1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }
 
  value = encodeURIComponent(value);
 
  var updatedCookie = name + "=" + value;
 
  for(var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];   
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
     }
  }
 
  document.cookie = updatedCookie;
}
function deleteCookie(name) {
  setCookie(name, "", { expires: -1 })
}
function template(selector, vars) {
  var html = $(selector).html();for(i=0;i<vars.length;i++) html = html.split('$VAR_'+(i+1)+'$').join(vars[i]);return html;
}
function shuffle(a) {
  for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
}
function armin_countdown(target, sec_num) {
  var sec_num = parseInt(sec_num, 10);
  if(sec_num < 0) sec_num = 0;
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  $(target).html(hours+':'+minutes+':'+seconds);
  if(sec_num>0) setTimeout(function(){armin_countdown(target, --sec_num);},1000);
}

/* INIT */
$(document).ready(function(){
  //SEO: Better google page speed
  var isPageSpeed = /Google Page Speed Insights/.test(navigator.userAgent);
  if (isPageSpeed) {
      return;
  }
  
  /* INIT */
  $(window).trigger('resize');
  $('#menu-toggle').on('click', function() {
      var data = $(this).data();

      $(this).toggleClass(data.toggle).toggleClass('is-active');
      $(data.target).toggleClass(data.toggle)
  });
  if ($(window).width() <= 768) {
      $('.wow').attr('data-wow-duration', '0.5s');
  }
  
  if ($(window).width() <= 996) {
      $('.menu-weapons > li > a').on('click', function(e) {
          e.preventDefault();

          $('.menu-weapons > li').removeClass('active open');

          $(this).parent().addClass('active open');
      });
  }
  var w = $(window).width(),
  i = 10;

  if (w >= 200) i = 2;
  if (w >= 400) i = 3;
  if (w >= 768) i = 4;
  if (w >= 1100) i = 5;
  if (w >= 1400) i = 6;
  if (w >= 1600) i = 7;

  $('.weap_slide-content').each(function() {
      var swip = $(this);

      var swiper = new Swiper($('.swiper-container', swip), {
          slidesPerView: i,
          spaceBetween: 7,
          navigation: {
          nextEl: $('.weap_slide-arrow-right', swip),
          prevEl: $('.weap_slide-arrow-left', swip),
      },
      loop: true
      });
      $(document).on('updateSwiper', function() {
          swiper.update();
      });
  })
  
  $('.lang-box').on('click', function() {
      $(this).toggleClass('open')

      $('.lang-drop-menu').slideToggle();
  });
  
  $(document).on('click', function(event) {
      if (!$(event.target).closest($('.lang-box')).length) {
          $('.lang-box').removeClass('open')
          $('.lang-drop-menu').slideUp();
      }

      if (!$(event.target).closest($('.user-box-selector')).length) {
          $('.ser-box-selector').removeClass('open')
          $('.user-box-drop').slideUp();
      }
  })

  $('.user-box-selector').on('click', function() {
      $(this).toggleClass('open');
      $('.user-box-drop').slideToggle();
  })

  $('.participants-swip').each(function() {
      var swip = $(this);

      $('.participants-item', swip).on('click', function() {
          $(this).toggleClass('open')

          $('.participants-drop', swip).toggleClass('open')
      })
  })

  $('.chat-open-close').on('click', function() {
      $('.x-col-chat').toggleClass('close')
      $('.chat-over-btn').toggleClass('open')
  })
  /* INIT END */


  /* REMOVE CHAT */

  $('#chat > .chat-write textarea').keypress(function(e) {
      if(e.which == 13 && !e.ctrlKey) {
          e.preventDefault();
          var value = $(this).val();$(this).val('');
          //TODO: send message
      }
      else if((e.which == 13 && e.ctrlKey) || e.which == 10) {
          $(this).val(function(i,val){
              return val + "\n";
          });
      }
  });
  $('#chat > .chat-write .chat-write-btn').click(function(e) {
      e.preventDefault();
      var value = $('#chat_form_enabled textarea').val();$('#chat_form_enabled textarea').val('');
      //TODO: send message
  });
  /* EDIT USERNAME */
  $('#profileEditUsername').click(function(e) {
    e.preventDefault();
    armin_modal({
      title: 'Edit username',
      body: '<form action="" method="post" id="profileEditUsernameForm">'+
      '<div class="textInputLabel">Your username:</div>'+
      '<div class="textInput"><input autocomplete="off" type="text" name="username" value="'+$('#profileCurrentUsername').text()+'" placeholder="Leave blank to use your ID"></div>'+
      '<div class="textInputLabel">(!) Your username must cointain only english letters / numbers</div>'+
      '<br/>'+
      '<div class="form-btn-center"><button type="submit" href="javascript://" class="form-btn form-btn-login gradient-purple"><span>SAVE</span></button></div>'+
      '<input type="hidden" name="token" value="'+TOKEN+'" />'+
      '</form>',
      width:450
    });
  });
  $(document).on('submit', '#profileEditUsernameForm', function(e) {
    e.preventDefault();
    apireq('setUsername', $(this).serialize(), function(d) {
      if(d.success == true) {$('.close-modal').click();swal('Success', 'Username set!', 'success');}
      else swal('Error', d.error, 'error');
    });
  });
  /* EDIT AVATAR */
  $('#profileEditAvatar').click(function(e) {
    e.preventDefault();
    armin_modal({
      title: 'Edit avatar',
      body: '<form action="" method="post" id="profileEditAvatarForm">'+
      '<div class="textInputLabel">Your avatar:</div>'+
      '<div class="textInput"><input autocomplete="off" id="profileEditAvatarFormAvatar" type="file" name="avatar"></div>'+
      '<div class="textInputLabel">(!) Your avatar must be &lt;20M and be in PNG/GIF/JPG format.</div>'+
      '<br/>'+
      '<div class="form-uploading" style="display:none;"><button type="button" href="javascript://" class="form-btn form-btn-login gradient-purple"><span>Uploading in progress...</span></button></div>'+
      '<div class="form-btn-center"><button type="submit" href="javascript://" class="form-btn form-btn-login gradient-purple"><span>UPLOAD</span></button></div>'+
      '<input type="hidden" name="token" value="'+TOKEN+'" />'+
      '</form>',
      width:450
    });
  });
  $(document).on('submit', '#profileEditAvatarForm', function(e) {
    e.preventDefault();
    $('#profileEditAvatarForm .form-btn-center').hide();
    $('#profileEditAvatarForm .form-uploading').show();
    var form_data = new FormData();
    form_data.append('avatar', $('#profileEditAvatarFormAvatar').prop('files')[0]);
    form_data.append('token', TOKEN);               
    $.ajax({
      url: '/setAvatar',
      dataType: 'json',
      cache: false,
      contentType: false,
      processData: false,
      data: form_data,                         
      type: 'post',
      success: function(d){
        $('#profileEditAvatarForm .form-btn-center').show();
        $('#profileEditAvatarForm .form-uploading').hide();
        if(d.success==true) top.location.reload();
        else swal('','Error occured while uploading avatar.');
      }
    });
  });
  /* DEPOSIT FORM */
  $('#profileDepositBtn').click(function(e) {depositForm();});
  /* WITHDRAW FORM */
  $('#profileWithdrawBtn').click(function(e) {withdrawForm();});
  $('body').on('click', '#deposit_items_panel > div:not(.locked)', function(e) {
    $(this).find(' > div').toggleClass('active');
    var sum = 0; 
    $('#deposit_items_panel > div').each(function(i, item) {
      if($(item).find('> div').hasClass('active'))
        sum+=parseFloat($(item).attr('data-price'));
    });
    $('#bet_panel_sum').html((Math.round(sum*100)/100));
  });
  $('body').on('click', '#chat .chat-list-delete', function(e) {
      e.preventDefault();
      var id = $(this).closest('[data-id]').attr('data-id');
      //TODO: delete chat list
  });

    /* TAB CONTROL */
  $(document).on('click', '.tab-control > a', function(e) {
    e.preventDefault();
    var id = $(this).attr('data-id');
    $(this).parent().find('> a').removeClass('active');
    $(this).addClass('active');
    $('#'+id).parent().find('.tab').hide();
    $('#'+id).show();
  });
  $(document).on('click', '.tabs-nav > li', function(e) {
    e.preventDefault();
    var selector = $(this).attr('rel');
    $(this).parent().find('> li').removeClass('active');
    $(this).addClass('active');
    $(selector).parent().find('.tabs-content').removeClass('active');
    $(selector).addClass('active');
  });
  $(document).on('click', '[data-action="login"]', function(e) {
    e.preventDefault();
    armin_modal({
      title: '<div class="tab-control"><a class="active" data-id="tab_login" href="javascript://">LOGIN</a><a data-id="tab_register" href="javascript://">REGISTER</a></div>',
      body: 
        '<form method="post" class="tab" id="tab_login" style="display:block;">'+
        '<div class="textInput"><input required autocomplete="off" type="email" name="username" id="username" placeholder="Your Username"/></div>'+
        '<div class="textInput"><input required autocomplete="off" type="password" name="password" id="password" placeholder="Your password"/></div>'+
        '<div class="textInputError"></div>'+
        '<button type="submit" class="form-btn form-btn-login gradient-purple" id="dologin" click="doLogin()"><span>LOGIN</span></button>'+
        '<input type="hidden" name="token" value="'+TOKEN+'"/>'+
        '</form>'+
        '<form method="post" class="tab" id="tab_register">'+
        '<div class="textInput"><input autocomplete="off" required type="email" name="user_email" id="user_email" placeholder="Your e-mail"/></div>'+
        '<div class="textInput"><input autocomplete="off" required type="password" name="password" id="password" placeholder="Your password"/></div>'+
        '<div class="textInput"><input autocomplete="off" required type="text" name="full_name" id="full_name" placeholder="Desired nickname"/></div>'+
        '<div class="textInputError"></div>'+
        '<button type="submit" class="form-btn form-btn-login gradient-purple" id="doregistration"><span>REGISTER</span></button>'+
        '<input type="hidden" name="token" value="'+TOKEN+'"/><input type="hidden" name="user_id" value="'+uniqueID()+'"/>'+
        '<input type="hidden" name="user_contact" value=""/><input type="hidden" name="user_status" value="Active"/>'+
        '</form>',
      width: 480,
      customClass: 'tabs-heading login-form'
    });
  });

  /* LOGIN/REGISTER FORM HANDLERS */
  $(document).on('submit', '#tab_login', function(e) {
    e.preventDefault();$('#tab_login .textInputError').html('');
    apireq('userLogin', $(this).serialize(), function(d) {
      if(d.success==false) $('#tab_login .textInputError').html('Invalid email or password.');
      else if(d.success==true) {top.location.href='/';}
    });
  });
  $(document).on('submit', '#tab_register', function(e) {
    e.preventDefault();$('#tab_register .textInputError').html('');
    apireq('userRegister', $(this).serialize(), function(d) {
      if(d.success==true) {top.location.href='/';}
      else $('#tab_register .textInputError').html(d.error);
    });
  });
}); 