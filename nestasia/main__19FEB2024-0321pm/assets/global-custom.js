console.log(`global-custom.js loaded`);

// check if the device is mobile or not

function checkMobile() {
  if (window.matchMedia("(max-width: 767px)").matches) return true;
  else return false;
}

function ccheckMobile() {
  if (window.matchMedia("(max-width: 1280px)").matches) return true;
  else return false;
}

const atcty = () => {
  $('.product-details .cbuy-act:not(.cthank)').text('Thank You!')
  setTimeout(() => {
    $('.product-details .cbuy-act:not(.cthank)').text('Add to cart')
  }, "1000");
}


$("#honeypot").html(
  '<input class="btn standard-width bottompad" type="submit" value="' +
    theme.language.contact_form_send +
    '" id="contactFormSubmit" />'
);

theme.getDiscountApply = function ($this, cart_token, code) {
  var data = {
    cart_token: cart_token,
    code: code,
  };
  $.ajax({
    type: "POST",
    url: "https://support.nestasia.in/api/assign-code",
    data: data,
    dataType: "json",
    success: function (data) {
      console.log("data", data);
    },
  });
};
// Function to set a cookie with a specific name and value
function setCookie(cookieName, cookieValue, expirationDays) {
  // Create a Date object for the expiration date
  var d = new Date();
  d.setTime(d.getTime() + expirationDays * 24 * 60 * 60 * 1000);

  // Convert the date to the correct format for the cookie
  var expires = "expires=" + d.toUTCString();

  // Create the cookie with the specified name, value, and expiration date
  document.cookie =
    cookieName + "=" + cookieValue + "; " + expires + "; path=/";
}

// Function to delete a cookie by setting its value to an empty string and an expiration date in the past
function deleteCookie(cookieName) {
  document.cookie =
    cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
// swiper js initialization
theme.swiper_carousel = function (
  $container,
  swiperConfigObj,
  swiperBreakPointObj,
  Carousel,
  CarouselGrid
) {
  var sectionId = (this.sectionId = $container.attr("data-section-id")),
    Carousel = !Carousel
      ? (this.Carousel = $("#swiper-carousel-" + sectionId))
      : Carousel,
    pagination = "#swiper-pagination-" + sectionId,
    next = "#swiper-button-next-" + sectionId,
    prev = "#swiper-button-prev-" + sectionId,
    breakpoints;
  if (checkMobile()) {
    breakpoints = 2;
  } else {
    breakpoints = 4;
  }
  console.log(`swiperConfigObj= ${swiperConfigObj}`);
  if (!swiperConfigObj) {
    swiperConfigObj = {
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      centeredSlides: false,
      freeMode: true,
      freeModeMomentumRatio: 0.35,
      freeModeMomentumVelocityRatio: 0.35,
      freeModeMomentumBounceRatio: 0.35,
      grabCursor: true,
      loop: true,
      loopAdditionalSlides: 1,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      navigation: {
        nextEl: next,
        prevEl: prev,
      },
      slidesPerView: breakpoints,
      breakpoints: {
        600: {
          slidesPerView: breakpoints,
        },
      },
    };
  }
};
// copy code to clipboard
theme.customerTemplates = (function () {
  function toggleRecoverPasswordForm() {
    $("#recover_password").toggleClass("hidden");
    $("#customer_login").toggleClass("hidden");
  }
  function initEventListeners() {
    $("#recover_password_btn,#customer_login_btn").on("click", function (e) {
      e.preventDefault();
      toggleRecoverPasswordForm();
    });
  }
  function resetPasswordSuccess() {
    if ($("#recover-email").hasClass("reset-success")) {
      $("#resetSuccess").removeClass("hidden");
    }
    if ($("#recover-email").hasClass("reset-error")) {
      $("#recover_password").removeClass("hidden");
      $("#customer_login").addClass("hidden");
    }
  }
  function customerAddressForm() {
    var $newAddressForm = $("#add_address");
    if (!$newAddressForm.length) {
      return;
    }
    if (Shopify) {
      new Shopify.CountryProvinceSelector(
        "address_country_new",
        "address_province_new",
        {
          hideElement: "address_province_container_new",
        }
      );
    }
    $(".address_country_option").each(function () {
      var formId = $(this).data("form-id"),
        countrySelector = "address_country_" + formId,
        provinceSelector = "address_province_" + formId,
        containerSelector = "address_province_container_" + formId;
      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: containerSelector,
      });
    });
  }
  return {
    init: function () {
      initEventListeners();
      resetPasswordSuccess();
      customerAddressForm();
    },
  };
})();
theme.copyToClipboard = function (text) {
  var selected = false;
  var el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  if (document.getSelection().rangeCount > 0) {
    selected = document.getSelection().getRangeAt(0);
  }
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};

// user login js start
theme.loginWithPhoneOpen = function () {
  $(".login_width_phone_step").removeClass("active");
  $(".login_with_phone_send_code").addClass("active");
  $(".form_error").removeClass("active");
  $(".custom_loading").removeClass("loading");
  $(".verification_input").val("");
  $("#login_with_phone_wrap").fadeIn();
  $("#login_with_phone_wrap .login_with_phone_content").addClass("open");
  $('#login_with_phone_wrap input:not([type="submit"])').val("");
  if ($("#login_with_phone_wrap form[onsubmit]").length > 0) {
    $("#login_with_phone_wrap form").removeAttr("onsubmit");
  }
};
theme.loginWithPhoneClose = function () {
  $("#login_with_phone_wrap").fadeOut();
  $("#login_with_phone_wrap .login_with_phone_content").removeClass("open");
  $("html").removeClass("ssw-modal-open");
};
theme.callMeCount = function () {
  let callMeCount = 30;
  $(".call_me_btn span").removeClass("hidden").text("(30)");
  $(".call_me_btn").addClass("counting");
  let callMeCountInterval = setInterval(function () {
    callMeCount--;
    if (
      callMeCount == 0 ||
      $(".login_with_phone_verify_code.active").length == 0
    ) {
      $("#login_with_phone_verification_form").removeClass("removeInterval");
      clearInterval(callMeCountInterval);
      $(".call_me_btn").removeClass("counting");
      $(".call_me_btn span").addClass("hidden");
    }
    $(".call_me_btn span").text("(" + callMeCount + ")");
  }, 1000);
};
theme.resendMeCount = function () {
  let resendMeCount = 30;
  $(".send_code_again span").removeClass("hidden").text("(30)");
  $(".send_code_again").addClass("counting");
  let resendMeCountInterval = setInterval(function () {
    resendMeCount--;
    if (
      resendMeCount == 0 ||
      $(".login_with_phone_verify_code.active").length == 0
    ) {
      $("#login_with_phone_verification_form").removeClass("removeInterval");
      clearInterval(resendMeCountInterval);
      $(".send_code_again").removeClass("counting");
      $(".send_code_again span").addClass("hidden");
    }
    $(".send_code_again span").text("(" + resendMeCount + ")");
  }, 1000);
};

$(document).ready(function () {
  if ($(".account-page-main-wrapper").length > 0) {
    // var rewardCount = setInterval(function () {
    //   if ($(".ssw-reward-page-balance").length > 0) {
    //     if ($(window).width() <= 767) {
    //       $(".ssw-reward-page-balance").insertBefore(".ssw-reward-page-header");
    //     }
    //     clearInterval(rewardCount);
    //   }
    // }, 500);
    var sswFaveItem = setInterval(function () {
      if ($("#ssw-fave-page-lists-wrapper .ssw-fave-item").length > 0) {
        $("#ssw-fave-page-lists-wrapper .ssw-fave-item").each(function () {
          var wishlistIcon = $(this).find(".ssw-icon-heart.fave-page-unfave"),
            sswProductAction = $(this).find(".ssw-fave-product-actions");
          $(wishlistIcon).prependTo(sswProductAction);
        });
        clearInterval(sswFaveItem);
      }
    }, 500);
    var profileCTAButton = setInterval(function () {
      if ($(".btn.ssw-buy-it.ssw-product-link").length > 0) {
        $(".ssw-collections .ssw-span").each(function () {
          var ctaBtn = $(this).find(".ssw-buy-it.ssw-product-link"),
            target = $(this);
          $(ctaBtn).appendTo(target);
        });
        clearInterval(profileCTAButton);
      }
    }, 500);
    var customersPageWrapper = setInterval(function () {
      $(".ssw-profile.ssw-own-profile .ssw-row-fluid:first")
        .find(".ssw-profile-thumb, .ssw-pull-left.ssw-pl2")
        .hide();
      if (
        $(".customers-page-wrapper").length > 0 &&
        $(".ssw-profile.ssw-own-profile .ssw-row-fluid:first").length > 0
      ) {
        var sswCustomerWrapper = $(
          ".ssw-profile.ssw-own-profile .ssw-row-fluid:first"
        );
        $(
          '<div class="user-profile-main-wrapper"><div class="user-profile-wrapper-inner clearfix"></div></div>'
        ).prependTo(sswCustomerWrapper);
        var userProfileImage = $(
            ".ssw-profile.ssw-own-profile .ssw-row-fluid:first"
          ).find(".ssw-profile-thumb"),
          userProfileContent = $(
            ".ssw-profile.ssw-own-profile .ssw-row-fluid:first"
          ).find(".ssw-pull-left.ssw-pl2");
        $(userProfileImage).appendTo($(".user-profile-wrapper-inner"));
        $(userProfileContent).appendTo($(".user-profile-wrapper-inner"));
        $(".ssw-profile.ssw-own-profile .ssw-row-fluid:first")
          .find(".ssw-profile-thumb, .ssw-pull-left.ssw-pl2")
          .show();
        clearInterval(customersPageWrapper);
      }
    }, 500);
  }
  theme.customerTemplates.init();
  window.customTheme = window.customTheme || {};
  $(document).on("click", ".login_width_phone_popup_close", function () {
    theme.loginWithPhoneClose();
  });
  $(document).on("click", ".change_phone_number", function () {
    $(".form_success").removeClass("active");
    $(".form_error").removeClass("active");
    $(".login_width_phone_step").removeClass("active");
    $(".login_with_phone_send_code").addClass("active");
  });
  $('[name="login"]').bind("keypress keyup keydown", function (e) {
    theme.loginValidation($(this));
  });
  $('[name="email"], [name="email_id"]').bind(
    "keypress keyup keydown",
    function (e) {
      theme.emailValidation($(this));
      $(
        "#login_with_phone_information_form .information_form_message"
      ).removeClass("active");
    }
  );
  $('[name="mobile"]').bind("keypress keyup keydown change", function (e) {
    theme.phoneValidation($(this));
  });
  $('[name="dob"], [name="password"], [name="confirm_password"]').bind(
    "keypress keyup keydown",
    function (e) {
      theme.fieldValidation($(this));
    }
  );
  $(document).on("change", '[name="dob"]', function () {
    theme.fieldValidation($(this));
  });
  $('[name="first_name"], [name="last_name"]').bind(
    "keypress keyup keydown",
    function (e) {
      theme.nameValidation($(this));
    }
  );
  $(
    '[name="first_name"], [name="last_name"], [name="address[first_name]"], [name="address[last_name]"], [name="address[company]"], [name="address[city]"]'
  ).bind("keypress keyup keydown", function (e) {
    theme.nameValidation($(this));
  });
  $('[name="address[address1]"], [name="address[address2]"]').bind(
    "keypress keyup keydown",
    function (e) {
      theme.textareaValidation($(this));
    }
  );
  $('[name="address[zip]"]').bind("keypress keyup keydown", function (e) {
    theme.fieldValidation($(this));
  });
  $('[name="address[phone]"]').bind("keypress keyup keydown", function (e) {
    var $input = $(this),
      value = $input.val(),
      length = value.length,
      inputCharacter = parseInt(value.slice(-1));

    if (
      !(
        (length > 0 && inputCharacter >= 0 && inputCharacter <= 10) ||
        (length === 1 && inputCharacter >= 7 && inputCharacter <= 10)
      )
    ) {
      $input.val(value.substring(0, length - 1));
    }
    theme.phoneValidation($(this));
  });
  //   $(document).on('click', '#get_otp_in_email_btn', function(){
  //     $('.login_width_phone_step').removeClass('active');
  //     $('.login_with_phone_verify_code').addClass('active');
  //     theme.callMeCount();
  //   });
  $(document).on("click", "#recover_password_btn", function () {
    $(".login_width_phone_step").removeClass("active");
    $(".login_with_phone_recover_customer_password").addClass("active");
  });
  $(document).on("click", "#customer_login_cancle_btn", function () {
    $(".login_width_phone_step").removeClass("active");
    $(".login_with_phone_shopify_login").addClass("active");
    $("#customer_login").removeClass("hidden");
  });
  $(document).on("click", ".send_code_again", function () {
    let $this = $(this);
    let $form = $(this).closest("form");
    let apiUrl, dataForm, otpSendTo;
    if ($(".user-profile-edit-popup").length > 0) {
      otpSendTo = $('#edit_user_profile [name="mobile"]').val();
    } else {
      otpSendTo = $('#login_with_phone_form [name="login"]').val();
    }
    if (localStorage.getItem("verify_type") == "email") {
      apiUrl = "https://support.nestasia.in/api/send-otp-email";
      dataForm = { email: otpSendTo };
      localStorage.setItem("verify_type", "email");
    } else {
      apiUrl = "https://support.nestasia.in/api/retry-otp";
      dataForm = { mobile_no: otpSendTo, retry_type: "sms" };
      localStorage.setItem("verify_type", "sms");
    }
    $this.prop("disabled", true);
    $form.find(".custom_loading").addClass("loading");
    $form.addClass("removeInterval");
    $.ajax({
      type: "POST",
      url: apiUrl,
      data: dataForm,
      dataType: "json",
      success: function (data) {
        $form.find(".custom_loading").removeClass("loading");
        $this.prop("disabled", false);
        if (data.status) {
          theme.callMeCount();
          theme.resendMeCount();
          if (localStorage.getItem("verify_type") == "email") {
            $form
              .find(".phone_verify_code_message")
              .text(
                `OTP Successfully resent to ${otpSendTo}, Please Check your Inbox.`
              );
          } else {
            $form
              .find(".phone_verify_code_message")
              .text(`OTP Successfully resent to ${otpSendTo}.`);
          }
          //           setTimeout(function(){
          //             $form.find('.verification_input_wrap .form_success').removeClass('active');
          //           }, 10000);
        }
      },
      $form: function (error) {
        $form.find(".custom_loading").removeClass("loading");
        $this.prop("disabled", false);
        console.log("error", error);
      },
    });
  });
  $(document).on("click", "#get_otp_in_email_btn", function () {
    let $this = $(this);
    let $form = $(this).closest("#customer_login");
    $this.prop("disabled", true);
    $form.find("#get_otp_in_email_btn").addClass("loading");
    $form.addClass("removeInterval");
    $.ajax({
      type: "POST",
      url: "https://support.nestasia.in/api/send-otp-email",
      data: { email: $('#login_with_phone_form [name="login"]').val() },
      dataType: "json",
      success: function (data) {
        $form.find("#get_otp_in_email_btn").removeClass("loading");
        $this.prop("disabled", false);
        $(
          "#login_with_phone_verification_form .phone_verify_code_message"
        ).text(
          `OTP Successfully sent to ${$(
            '#login_with_phone_form [name="login"]'
          ).val()}, Please Check your Inbox.`
        );
        if (data.status) {
          localStorage.setItem("verify_type", "email");
          customTheme.verify_type = "email";
          //           setTimeout(function(){
          $(".login_width_phone_step").removeClass("active");
          $(".login_with_phone_verify_code").addClass("active");
          //             theme.callMeCount();
          $form.find(".form_success").removeClass("active");
          //           }, 5000);
          theme.resendMeCount();
          //           $('#login_with_phone_verification_form .form_success').text('Please check your email for OTP.').addClass('active');
          //           setTimeout(function(){
          //             $('#login_with_phone_verification_form .form_success').removeClass('active');
          //           }, 5000)
        }
      },
      $form: function (error) {
        $form.find("#get_otp_in_email_btn").removeClass("loading");
        $this.prop("disabled", false);
        console.log("error", error);
      },
    });
  });
  $(document).on("click", ".call_me_btn", function () {
    let $this = $(this);
    let $form = $(this).closest("form");
    let otpSendTo;
    if ($(".user-profile-edit-popup").length > 0) {
      otpSendTo = $('#edit_user_profile [name="mobile"]').val();
    } else {
      otpSendTo = $('#login_with_phone_form [name="login"]').val();
    }
    $this.prop("disabled", true);
    $form.find(".custom_loading").addClass("loading");
    $form.addClass("removeInterval");
    $.ajax({
      type: "POST",
      url: "https://support.nestasia.in/api/retry-otp",
      data: { mobile_no: otpSendTo, retry_type: "call" },
      dataType: "json",
      success: function (data) {
        $form.find(".custom_loading").removeClass("loading");
        $this.prop("disabled", false);
        if (data.status) {
          localStorage.setItem("verify_type", "call");
          customTheme.verify_type = "call";
          theme.callMeCount();
          theme.resendMeCount();
          $form
            .find(".phone_verify_code_message")
            .text("You should be receiving a call with OTP.");
          //           setTimeout(function(){
          //             $form.find('.verification_input_wrap .form_success').removeClass('active');
          //           }, 10000);
        }
      },
      $form: function (error) {
        $form.find(".custom_loading").removeClass("loading");
        $this.prop("disabled", false);
        console.log("error", error);
      },
    });
  });
  $("#login_with_phone_information_form").submit(function (e) {
    e.preventDefault();
    var error_count = 0;
    let $this = $(this);
    error_count =
      error_count + theme.nameValidation($(this).find('[name="first_name"]'));
    error_count =
      error_count + theme.nameValidation($(this).find('[name="last_name"]'));
    error_count =
      error_count + theme.phoneValidation($(this).find('[name="mobile"]'));
    error_count =
      error_count + theme.emailValidation($(this).find('[name="email_id"]'));
    //     error_count = error_count + theme.fieldValidation($(this).find('[name="password"]'));
    //     error_count = error_count + theme.fieldValidation($(this).find('[name="confirm_password"]'));
    //     error_count = error_count + theme.fieldValidation($(this).find('[name="dob"]'));
    if (error_count == 0) {
      $this.find(".custom_loading").addClass("loading");
      //       if($(this).find('[name="password"]').val() != $(this).find('[name="confirm_password"]').val()){
      //    $(this).find('[name="confirm_password"]').closest('.form-wrap').find('.form_error').text('Passwords did not match.').addClass('active');

      //         return false;
      //       }else{
      //        alert('Done');
      //       }
      let formData = {
        phone: $(this).find('[name="mobile"]').val(),
        first_name: $(this).find('[name="first_name"]').val(),
        last_name: $(this).find('[name="last_name"]').val(),
        email: $(this).find('[name="email_id"]').val(),
        return_to: window.location.origin + window.location.pathname,
      };
      $.ajax({
        type: "POST",
        url: "https://support.nestasia.in/api/register-customer",
        data: formData,
        dataType: "json",
        success: function (data) {
          $this.find(".custom_loading").removeClass("loading");
          $(".verification_input_wrap input.verification_input").val("");
          if (data.customer_URL != "" && data.status) {
            window.location.href =
              "/account/login/multipass/" + data.customer_URL;
          } else {
            $this
              .find(".information_form_message")
              .text(data.message)
              .addClass("active");
            //             setTimeout(function(){
            //               $this.find('.information_form_message').removeClass('active');
            //             },10000);
          }
        },
        error: function (error) {
          $(".verification_input_wrap input.verification_input").val("");
          $this.find(".custom_loading").removeClass("loading");
        },
      });
    }
    return false;
  });

  //  profile page add new address on sumbit event
  // $("#address_form_new, .edit-address").submit(function (e) {
  //     var error_count = 0;
  //     let $this = $(this);
  //     error_count = error_count + theme.nameValidation($this.find('[name="address[first_name]"]'));
  //     error_count = error_count + theme.nameValidation($this.find('[name="address[last_name]"]'));
  //     error_count = error_count + theme.nameValidation($this.find('[name="address[company]"]'));
  //     error_count = error_count + theme.textareaValidation($this.find('[name="address[address1]"]'));
  //     // error_count = error_count + theme.textareaValidation($this.find('[name="address[address2]"]'));
  //     error_count = error_count + theme.nameValidation($this.find('[name="address[city]"]'));
  //     error_count = error_count + theme.fieldValidation($this.find('[name="address[zip]"]'));
  //     // error_count = error_count + theme.phoneValidation($this.find('[name="address[phone]"]'));
  //     console.log(error_count);
  //     if (error_count != 0) {
  //       e.preventDefault();
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   });

  $(".login_with_phone_shopify_login #customer_login").submit(function (e) {
    var error_count = 0;
    error_count =
      error_count +
      theme.fieldValidation($(this).find('[name="customer[password]"]'));
    if (error_count != 0) {
      e.preventDefault();
      return false;
    } else {
      return true;
    }
  });
  $(".login_with_phone_recover_customer_password form").submit(function (e) {
    var error_count = 0;
    error_count =
      error_count + theme.emailValidation($(this).find('[name="email"'));
    if (error_count != 0) {
      e.preventDefault();
      return false;
    } else {
      return true;
    }
  });
  //   Login width phone no end
  //   verification code Start
  var body = $("body");

  function goToPrevInput(e) {
    var key = e.which || this.value.substr(-1).charCodeAt(0),
      t = $(e.target),
      sib;
    if (key === 8) {
      sib = t.prev("input.verification_input");
    } else {
      return false;
    }
    sib.val("").select().focus();
  }

  function goToNextInput(e) {
    var key = e.which || this.value.substr(-1).charCodeAt(0),
      t = $(e.target),
      sib;
    if (key === 8) {
      sib = t.prev("input.verification_input");
    } else if (!t.hasClass("code_no_4")) {
      sib = t.next("input.verification_input");
    } else {
      sib = t;
    }

    if (key != 9 && key != 8 && (key < 48 || key > 57)) {
      e.preventDefault();
      return false;
    }

    if (key === 9) {
      return true;
    }

    if (!sib || !sib.length) {
      sib = body.find("input.verification_input").eq(0);
    }
    sib.select().focus();
    $("#login_with_phone_verification_form .form_error").removeClass("active");
  }

  function onKeyDown(e) {
    var key = e.which;

    if (key === 9 || key === 8 || (key >= 48 && key <= 57)) {
      return true;
    }

    e.preventDefault();
    return false;
  }

  function onFocus(e) {
    $(e.target).select();
  }

  body.on("input", "input.verification_input", goToNextInput);
  body.on("keyup", "input.verification_input", goToPrevInput);
  body.on("keydown", "input.verification_input", onKeyDown);
  //   body.on('click', 'input.verification_input', onFocus);
});
theme.userProfileEditOpen = function () {
  $(".form_error").removeClass("active");
  $(".custom_loading").removeClass("loading");
  $(".user-profile-edit-popup").fadeIn();
  $(".user-profile-edit-popup .user-profile-edit-inner").addClass("open");
};
theme.userProfileEditClose = function () {
  $(".user-profile-edit-popup").fadeOut();
  $(".user-profile-edit-popup .user-profile-edit-inner").removeClass("open");
};
$("#change_profile_verification_form").submit(function (e) {
  let $this = $(this);
  var error_count = 0;
  //     $this.find('.custom_loading').addClass('loading');
  if (
    $("input.verification_input.code_no_1").val() == "" ||
    $("input.verification_input.code_no_2").val() == "" ||
    $("input.verification_input.code_no_3").val() == "" ||
    $("input.verification_input.code_no_4").val() == ""
  ) {
    $("#change_profile_verification_form .form_error")
      .text("Please enter a valid OTP.")
      .addClass("active");
    error_count = error_count + 1;
  } else {
    $("#change_profile_verification_form .form_error").removeClass("active");
  }
  if (error_count == 0) {
    $this.find(".custom_loading").addClass("loading");
    let formData = {
      mobile_no: $('#edit_user_profile [name="mobile"]').val(),
      otp:
        $this.find(".code_no_1").val() +
        $this.find(".code_no_2").val() +
        $this.find(".code_no_3").val() +
        $this.find(".code_no_4").val(),
      verify_type: localStorage.getItem("verify_type"),
      return_to: window.location.origin + window.location.pathname,
    };
    $.ajax({
      type: "POST",
      url: "https://support.nestasia.in/api/verify-otp",
      data: formData,
      dataType: "json",
      success: function (data) {
        if (data.status) {
          let formData = {
            customer_id: $('#edit_user_profile [name="customer_id"]').val(),
            phone: $('#edit_user_profile [name="mobile"]').val(),
          };
          $.ajax({
            type: "POST",
            url: "https://support.nestasia.in/api/change-profile",
            data: formData,
            dataType: "json",
            success: function (data) {
              if (data.status) {
                //                   $this.find('.information_form_message').text('Your Phone Number is successfully Updated.').addClass('active').addClass('success');
                $(".login_width_phone_step").removeClass("active");
                $(".user_profile_edit_thank_you").addClass("active");
                setTimeout(function () {
                  window.location.reload();
                }, 5000);
              } else {
                $this.find(".custom_loading").removeClass("loading");
                $this
                  .find(".information_form_message")
                  .text(data.message)
                  .addClass("active");
              }
            },
            error: function (error) {
              $this.find(".custom_loading").removeClass("loading");
              $this
                .find(".information_form_message")
                .text(data.message)
                .addClass("active");
            },
          });
        } else {
          $("#change_profile_verification_form .form_error")
            .text("Invalid OTP, Please enter the correct OTP.")
            .addClass("active");
        }
        $(".verification_input_wrap input.verification_input").val("");
        $this.find(".custom_loading").removeClass("loading");
      },
      error: function (error) {
        $(".verification_input_wrap input.verification_input").val("");
        $this.find(".custom_loading").removeClass("loading");
      },
    });
  }
  e.preventDefault();
  return false;
});
$("#edit_user_profile").submit(function (e) {
  e.preventDefault();
  var error_count = 0;
  let $this = $(this);
  error_count =
    error_count + theme.phoneValidation($(this).find('[name="mobile"]'));
  if (error_count == 0) {
    $this.find(".custom_loading").addClass("loading");
    $.ajax({
      type: "POST",
      url: "https://support.nestasia.in/api/send-otp",
      data: { mobile_no: $('.user-profile-edit-popup [name="mobile"]').val() },
      dataType: "json",
      success: function (data) {
        $this.find(".custom_loading").removeClass("loading");
        if (data.status) {
          $(
            "#change_profile_verification_form .phone_verify_code_message"
          ).text(
            `OTP Successfully sent to ${$(
              '#edit_user_profile [name="mobile"]'
            ).val()}.`
          );
          $(".login_width_phone_step").removeClass("active");
          $(".login_with_phone_verify_code").addClass("active");
          localStorage.setItem("verify_type", "sms");
          customTheme.verify_type = "sms";
          theme.callMeCount();
          theme.resendMeCount();
        }
      },
      error: function (error) {
        $this.find(".custom_loading").removeClass("loading");
        console.log("error", error);
      },
    });
  }
  return false;
});
theme.phoneValidation = function ($this) {
  var count = 0;
  var parent = $this.closest(".form-wrap");
  let targetEl = $this.val().length;
  var numbers = /^[0-9]+$/;
  if ($this.val() == "") {
    parent
      .find(".form_error")
      .text("This field is required")
      .addClass("active");
    count = 1;
  } else {
    if (!$this.val().match(numbers)) {
      parent
        .find(".form_error")
        .text("Please enter only number")
        .addClass("active");
      count = 1;
    } else if (targetEl != 10) {
      parent
        .find(".form_error")
        .text("Please enter 10 digit number")
        .addClass("active");
      count = 1;
    } else {
      parent.find(".form_error").text("").removeClass("active");
    }
  }
  return count;
};
theme.emailValidation = function ($this) {
  var count = 0;
  var parent = $this.closest(".form-wrap");
  if ($this.val() == "" || $.trim($this.val()) == "") {
    parent
      .find(".form_error")
      .text("This field is required")
      .addClass("active");
    var count = 1;
  } else {
    function ValidateEmail(email) {
      var expr =
        /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      return expr.test(email);
    }
    if (!ValidateEmail($this.val())) {
      parent
        .find(".form_error")
        .text("Please enter valid email")
        .addClass("active");
      var count = 1;
    } else {
      parent.find(".form_error").removeClass("active");
    }
  }
  return count;
};
theme.loginValidation = function ($this) {
  var count = 0;
  var parent = $this.closest(".form-wrap");
  let targetEl = $this.val().length;
  var numbers = /^[0-9]+$/;
  if ($this.val() == "" || $.trim($this.val()) == "") {
    parent
      .find(".form_error")
      .text("This field is required")
      .addClass("active");
    var count = 1;
  } else if (!$this.val().match(numbers)) {
    function ValidateEmail(email) {
      var expr =
        /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      return expr.test(email);
    }
    if (!ValidateEmail($this.val())) {
      parent
        .find(".form_error")
        .text("Please enter valid email")
        .addClass("active");
      var count = 1;
    } else {
      parent.find(".form_error").text("").removeClass("active");
    }
  } else {
    if (targetEl != 10) {
      parent
        .find(".form_error")
        .text("Please enter 10 digit number")
        .addClass("active");
      count = 1;
    } else {
      parent.find(".form_error").text("").removeClass("active");
    }
  }
  return count;
};
// theme.nameValidation
theme.nameValidation = function ($this) {
  var count = 0;
  var parent = $this.closest(".form-wrap");
  var regex = new RegExp("^[a-zA-Z- ]+$");
  var str = $this.val();
  if ($this.val() == "" || $.trim($this.val()) == "") {
    parent
      .find(".form_error")
      .text("This filled is required")
      .addClass("active");
    count = 1;
  } else if ($this.length > 0) {
    if ($this.val().length > 49) {
      if ($this.val().length > 49) {
        parent
          .find(".form_error")
          .text("This is too long (maximum is 50 characters)")
          .addClass("active");
        count = 1;
      } else {
        parent
          .find(".form_error")
          .text("This is too long (maximum is 50 characters)")
          .removeClass("active");
      }
    } else {
      parent
        .find(".form_error")
        .text("This is too long (maximum is 50 characters)")
        .removeClass("active");
      if (regex.test(str)) {
        parent
          .find(".form_error")
          .text("Please enter only letters and dashes")
          .removeClass("active");
      } else {
        if (
          $(".template-page-contact").length > 0 ||
          $(".template-customers-register").length > 0
        ) {
          parent
            .find(".form_error")
            .text("Please enter only characters")
            .addClass("active");
        } else {
          parent
            .find(".form_error")
            .text("Please enter only letters and dashes")
            .addClass("active");
        }
        count = 1;
      }
    }
  } else {
    parent.find(".form_error").removeClass("active");
  }
  return count;
};

//theme.textareavaliadation
theme.textareaValidation = function ($this) {
  var count = 0;
  var parent = $this.closest(".form-wrap");
  if ($this.val() == "" || $.trim($this.val()) == "") {
    parent
      .find(".form_error")
      .text("This field is required")
      .addClass("active");
    count = 1;
  } else if ($this.length > 0) {
    if ($this.val().length > 249) {
      if ($this.val().length > 249) {
        parent
          .find(".form_error")
          .text("This is too long (maximum is 250 characters)")
          .addClass("active");
        count = 1;
      } else {
        parent
          .find(".form_error")
          .text("This is too long (maximum is 250 characters)")
          .removeClass("active");
      }
    } else {
      parent
        .find(".form_error")
        .text("This is too long (maximum is 250 characters)")
        .removeClass("active");
    }
  } else {
    parent.find(".form_error").text("").removeClass("active");
  }
  return count;
};

// theme.fieldValidation
theme.fieldValidation = function ($this) {
  var count = 0;
  var parent = $this.closest(".form-wrap");
  if ($this.val() == "" || $.trim($this.val()) == "") {
    parent
      .find(".form_error")
      .text("This field is required")
      .addClass("active");
    count = 1;
  } else {
    parent.find(".form_error").text("").removeClass("active");
  }
  return count;
};
$(document).ready(function () {
  if ($(".account-page-main-wrapper").length > 0) {
    // var rewardCount = setInterval(function () {
    //   if ($(".ssw-reward-page-balance").length > 0) {
    //     if ($(window).width() <= 767) {
    //       $(".ssw-reward-page-balance").insertBefore(".ssw-reward-page-header");
    //     }
    //     clearInterval(rewardCount);
    //   }
    // }, 500);
    var sswFaveItem = setInterval(function () {
      if ($("#ssw-fave-page-lists-wrapper .ssw-fave-item").length > 0) {
        $("#ssw-fave-page-lists-wrapper .ssw-fave-item").each(function () {
          var wishlistIcon = $(this).find(".ssw-icon-heart.fave-page-unfave"),
            sswProductAction = $(this).find(".ssw-fave-product-actions");
          $(wishlistIcon).prependTo(sswProductAction);
        });
        clearInterval(sswFaveItem);
      }
    }, 500);
    var profileCTAButton = setInterval(function () {
      if ($(".btn.ssw-buy-it.ssw-product-link").length > 0) {
        $(".ssw-collections .ssw-span").each(function () {
          var ctaBtn = $(this).find(".ssw-buy-it.ssw-product-link"),
            target = $(this);
          $(ctaBtn).appendTo(target);
        });
        clearInterval(profileCTAButton);
      }
    }, 500);
    var customersPageWrapper = setInterval(function () {
      $(".ssw-profile.ssw-own-profile .ssw-row-fluid:first")
        .find(".ssw-profile-thumb, .ssw-pull-left.ssw-pl2")
        .hide();
      if (
        $(".customers-page-wrapper").length > 0 &&
        $(".ssw-profile.ssw-own-profile .ssw-row-fluid:first").length > 0
      ) {
        var sswCustomerWrapper = $(
          ".ssw-profile.ssw-own-profile .ssw-row-fluid:first"
        );
        $(
          '<div class="user-profile-main-wrapper"><div class="user-profile-wrapper-inner clearfix"></div></div>'
        ).prependTo(sswCustomerWrapper);
        var userProfileImage = $(
            ".ssw-profile.ssw-own-profile .ssw-row-fluid:first"
          ).find(".ssw-profile-thumb"),
          userProfileContent = $(
            ".ssw-profile.ssw-own-profile .ssw-row-fluid:first"
          ).find(".ssw-pull-left.ssw-pl2");
        $(userProfileImage).appendTo($(".user-profile-wrapper-inner"));
        $(userProfileContent).appendTo($(".user-profile-wrapper-inner"));
        $(".ssw-profile.ssw-own-profile .ssw-row-fluid:first")
          .find(".ssw-profile-thumb, .ssw-pull-left.ssw-pl2")
          .show();
        clearInterval(customersPageWrapper);
      }
    }, 500);
  }
  theme.customerTemplates.init();
  window.customTheme = window.customTheme || {};
  $(document).on("click", ".login_width_phone_popup_close", function () {
    theme.loginWithPhoneClose();
  });
  $(document).on("click", ".change_phone_number", function () {
    $(".form_success").removeClass("active");
    $(".form_error").removeClass("active");
    $(".login_width_phone_step").removeClass("active");
    $(".login_with_phone_send_code").addClass("active");
  });
  $('[name="login"]').bind("keypress keyup keydown", function (e) {
    theme.loginValidation($(this));
  });
  $('[name="email"], [name="email_id"]').bind(
    "keypress keyup keydown",
    function (e) {
      theme.emailValidation($(this));
      $(
        "#login_with_phone_information_form .information_form_message"
      ).removeClass("active");
    }
  );
  $('[name="mobile"]').bind("keypress keyup keydown change", function (e) {
    theme.phoneValidation($(this));
  });
  $('[name="dob"], [name="password"], [name="confirm_password"]').bind(
    "keypress keyup keydown",
    function (e) {
      theme.fieldValidation($(this));
    }
  );
  $(document).on("change", '[name="dob"]', function () {
    theme.fieldValidation($(this));
  });
  $('[name="first_name"], [name="last_name"]').bind(
    "keypress keyup keydown",
    function (e) {
      theme.nameValidation($(this));
    }
  );
  $(
    '[name="first_name"], [name="last_name"], [name="address[first_name]"], [name="address[last_name]"], [name="address[company]"], [name="address[city]"]'
  ).bind("keypress keyup keydown", function (e) {
    theme.nameValidation($(this));
  });
  $('[name="address[address1]"], [name="address[address2]"]').bind(
    "keypress keyup keydown",
    function (e) {
      theme.textareaValidation($(this));
    }
  );
  $('[name="address[zip]"]').bind("keypress keyup keydown", function (e) {
    theme.fieldValidation($(this));
  });
  $('[name="address[phone]"]').bind("keypress keyup keydown", function (e) {
    var $input = $(this),
      value = $input.val(),
      length = value.length,
      inputCharacter = parseInt(value.slice(-1));

    if (
      !(
        (length > 0 && inputCharacter >= 0 && inputCharacter <= 10) ||
        (length === 1 && inputCharacter >= 7 && inputCharacter <= 10)
      )
    ) {
      $input.val(value.substring(0, length - 1));
    }
    theme.phoneValidation($(this));
  });
  //   $(document).on('click', '#get_otp_in_email_btn', function(){
  //     $('.login_width_phone_step').removeClass('active');
  //     $('.login_with_phone_verify_code').addClass('active');
  //     theme.callMeCount();
  //   });
  $(document).on("click", "#recover_password_btn", function () {
    $(".login_width_phone_step").removeClass("active");
    $(".login_with_phone_recover_customer_password").addClass("active");
  });
  $(document).on("click", "#customer_login_cancle_btn", function () {
    $(".login_width_phone_step").removeClass("active");
    $(".login_with_phone_shopify_login").addClass("active");
    $("#customer_login").removeClass("hidden");
  });
  $(document).on("click", ".send_code_again", function () {
    let $this = $(this);
    let $form = $(this).closest("form");
    let apiUrl, dataForm, otpSendTo;
    if ($(".user-profile-edit-popup").length > 0) {
      otpSendTo = $('#edit_user_profile [name="mobile"]').val();
    } else {
      otpSendTo = $('#login_with_phone_form [name="login"]').val();
    }
    if (localStorage.getItem("verify_type") == "email") {
      apiUrl = "https://support.nestasia.in/api/send-otp-email";
      dataForm = { email: otpSendTo };
      localStorage.setItem("verify_type", "email");
    } else {
      apiUrl = "https://support.nestasia.in/api/retry-otp";
      dataForm = { mobile_no: otpSendTo, retry_type: "sms" };
      localStorage.setItem("verify_type", "sms");
    }
    $this.prop("disabled", true);
    $form.find(".custom_loading").addClass("loading");
    $form.addClass("removeInterval");
    $.ajax({
      type: "POST",
      url: apiUrl,
      data: dataForm,
      dataType: "json",
      success: function (data) {
        $form.find(".custom_loading").removeClass("loading");
        $this.prop("disabled", false);
        if (data.status) {
          theme.callMeCount();
          theme.resendMeCount();
          if (localStorage.getItem("verify_type") == "email") {
            $form
              .find(".phone_verify_code_message")
              .text(
                `OTP Successfully resent to ${otpSendTo}, Please Check your Inbox.`
              );
          } else {
            $form
              .find(".phone_verify_code_message")
              .text(`OTP Successfully resent to ${otpSendTo}.`);
          }
          //           setTimeout(function(){
          //             $form.find('.verification_input_wrap .form_success').removeClass('active');
          //           }, 10000);
        }
      },
      $form: function (error) {
        $form.find(".custom_loading").removeClass("loading");
        $this.prop("disabled", false);
        console.log("error", error);
      },
    });
  });
  $(document).on("click", "#get_otp_in_email_btn", function () {
    let $this = $(this);
    let $form = $(this).closest("#customer_login");
    $this.prop("disabled", true);
    $form.find("#get_otp_in_email_btn").addClass("loading");
    $form.addClass("removeInterval");
    $.ajax({
      type: "POST",
      url: "https://support.nestasia.in/api/send-otp-email",
      data: { email: $('#login_with_phone_form [name="login"]').val() },
      dataType: "json",
      success: function (data) {
        $form.find("#get_otp_in_email_btn").removeClass("loading");
        $this.prop("disabled", false);
        $(
          "#login_with_phone_verification_form .phone_verify_code_message"
        ).text(
          `OTP Successfully sent to ${$(
            '#login_with_phone_form [name="login"]'
          ).val()}, Please Check your Inbox.`
        );
        if (data.status) {
          localStorage.setItem("verify_type", "email");
          customTheme.verify_type = "email";
          //           setTimeout(function(){
          $(".login_width_phone_step").removeClass("active");
          $(".login_with_phone_verify_code").addClass("active");
          //             theme.callMeCount();
          $form.find(".form_success").removeClass("active");
          //           }, 5000);
          theme.resendMeCount();
          //           $('#login_with_phone_verification_form .form_success').text('Please check your email for OTP.').addClass('active');
          //           setTimeout(function(){
          //             $('#login_with_phone_verification_form .form_success').removeClass('active');
          //           }, 5000)
        }
      },
      $form: function (error) {
        $form.find("#get_otp_in_email_btn").removeClass("loading");
        $this.prop("disabled", false);
        console.log("error", error);
      },
    });
  });
  $(document).on("click", ".call_me_btn", function () {
    let $this = $(this);
    let $form = $(this).closest("form");
    let otpSendTo;
    if ($(".user-profile-edit-popup").length > 0) {
      otpSendTo = $('#edit_user_profile [name="mobile"]').val();
    } else {
      otpSendTo = $('#login_with_phone_form [name="login"]').val();
    }
    $this.prop("disabled", true);
    $form.find(".custom_loading").addClass("loading");
    $form.addClass("removeInterval");
    $.ajax({
      type: "POST",
      url: "https://support.nestasia.in/api/retry-otp",
      data: { mobile_no: otpSendTo, retry_type: "call" },
      dataType: "json",
      success: function (data) {
        $form.find(".custom_loading").removeClass("loading");
        $this.prop("disabled", false);
        if (data.status) {
          localStorage.setItem("verify_type", "call");
          customTheme.verify_type = "call";
          theme.callMeCount();
          theme.resendMeCount();
          $form
            .find(".phone_verify_code_message")
            .text("You should be receiving a call with OTP.");
          //           setTimeout(function(){
          //             $form.find('.verification_input_wrap .form_success').removeClass('active');
          //           }, 10000);
        }
      },
      $form: function (error) {
        $form.find(".custom_loading").removeClass("loading");
        $this.prop("disabled", false);
        console.log("error", error);
      },
    });
  });
  $("#login_with_phone_form").submit(function (e) {
    let $this = $(this);
    var error_count = 0;
    let loginField = $(this).find('[name="login"]');
    var numbers = /^[0-9]+$/;
    let infoInputMobile = $(
      '#login_with_phone_information_form [name="mobile"]'
    );
    let infoInputEmail = $(
      '#login_with_phone_information_form [name="email_id"]'
    );
    error_count = error_count + theme.loginValidation(loginField);
    if (error_count == 0) {
      $this.find(".custom_loading").addClass("loading");
      $("#login_with_phone_verification_form .verification_send_width").val(
        $('#login_with_phone_form [name="login"]').val()
      );
      $(".send_code_again").addClass("counting");
      $(".call_me_btn").addClass("counting");
      if (loginField.val().match(numbers)) {
        $("#login_with_phone_wrap .change_phone_number").text(
          "Change Phone Number"
        );
        $("#login_with_phone_wrap .call_me_btn").removeClass("hide");
        infoInputMobile.val($('#login_with_phone_form [name="login"]').val());
        infoInputMobile.closest(".form-wrap").addClass("hide");
        infoInputEmail.closest(".form-wrap").removeClass("hide");
        $.ajax({
          type: "POST",
          url: "https://support.nestasia.in/api/send-otp",
          data: { mobile_no: $('#login_with_phone_form [name="login"]').val() },
          dataType: "json",
          success: function (data) {
            $this.find(".custom_loading").removeClass("loading");
            $(
              "#login_with_phone_verification_form .phone_verify_code_message"
            ).text(
              `OTP Successfully sent to ${$(
                '#login_with_phone_form [name="login"]'
              ).val()}.`
            );
            if (data.status) {
              $(".login_width_phone_step").removeClass("active");
              $(".login_with_phone_verify_code").addClass("active");
              localStorage.setItem("verify_type", "sms");
              customTheme.verify_type = "sms";
              theme.callMeCount();
              theme.resendMeCount();
            }
          },
          error: function (error) {
            $this.find(".custom_loading").removeClass("loading");
          },
        });
      } else {
        $.ajax({
          type: "POST",
          url: "https://support.nestasia.in/api/get-customer",
          data: { email: $('#login_with_phone_form [name="login"]').val() },
          dataType: "json",
          success: function (data) {
            if (data.customer_exist) {
              $this.find(".custom_loading").removeClass("loading");
              $(".login_width_phone_step").removeClass("active");
              $(".login_with_phone_shopify_login").addClass("active");
            } else {
              $.ajax({
                type: "POST",
                url: "https://support.nestasia.in/api/send-otp-email",
                data: {
                  email: $('#login_with_phone_form [name="login"]').val(),
                },
                dataType: "json",
                success: function (data) {
                  $this.prop("disabled", false);
                  $(
                    "#login_with_phone_verification_form .phone_verify_code_message"
                  ).text(
                    `OTP Successfully sent to ${$(
                      '#login_with_phone_form [name="login"]'
                    ).val()}, Please Check your Inbox.`
                  );
                  if (data.status) {
                    $(".login_width_phone_step").removeClass("active");
                    //                     if(data.customer_exist){
                    //                       $('.login_with_phone_shopify_login').addClass('active');
                    //                     }else{
                    $(".login_with_phone_verify_code").addClass("active");
                    theme.resendMeCount();
                    //                     }
                    $this.find(".custom_loading").removeClass("loading");
                    localStorage.setItem("verify_type", "email");
                  }
                },
                error: function (error) {
                  $form.find("#get_otp_in_email_btn").removeClass("loading");
                  $this.prop("disabled", false);
                  console.log("error", error);
                },
              });
            }
          },
          error: function (error) {
            $this.find(".custom_loading").removeClass("loading");
            $this.prop("disabled", false);
            console.log("error", error);
          },
        });
        $("#login_with_phone_wrap .change_phone_number").text("Change Email");
        $("#login_with_phone_wrap .call_me_btn").addClass("hide");
        $(
          '.login_with_phone_shopify_login #customer_login [name="customer[email]"]'
        ).val($('#login_with_phone_form [name="login"]').val());
        infoInputEmail.val($('#login_with_phone_form [name="login"]').val());
        infoInputEmail.closest(".form-wrap").addClass("hide");
        infoInputMobile.closest(".form-wrap").removeClass("hide");
      }
    }
    e.preventDefault();
    return false;
  });
  $("#login_with_phone_verification_form").submit(function (e) {
    let $this = $(this);
    var error_count = 0;
    $this.find(".custom_loading").addClass("loading");
    //     error_count = error_count + theme.phoneValidation($(this).find('[name="phone_no"]'));
    if (
      $("input.verification_input.code_no_1").val() == "" ||
      $("input.verification_input.code_no_2").val() == "" ||
      $("input.verification_input.code_no_3").val() == "" ||
      $("input.verification_input.code_no_4").val() == ""
    ) {
      $("#login_with_phone_verification_form .form_error")
        .text("Please enter a valid OTP.")
        .addClass("active");
      error_count = error_count + 1;
      $this.find(".custom_loading").removeClass("loading");
    } else {
      $("#login_with_phone_verification_form .form_error").removeClass(
        "active"
      );
    }
    //     error_count = error_count + theme.emailValidation($(this).find('[name="email_id"]'));
    if (error_count == 0) {
      $this.find(".custom_loading").addClass("loading");
      let formData;
      if (localStorage.getItem("verify_type") == "email") {
        formData = {
          email: $this.find(".verification_send_width").val(),
          otp:
            $this.find(".code_no_1").val() +
            $this.find(".code_no_2").val() +
            $this.find(".code_no_3").val() +
            $this.find(".code_no_4").val(),
          verify_type: localStorage.getItem("verify_type"),
          return_to: window.location.origin + window.location.pathname,
        };
      } else {
        formData = {
          mobile_no: $this.find(".verification_send_width").val(),
          otp:
            $this.find(".code_no_1").val() +
            $this.find(".code_no_2").val() +
            $this.find(".code_no_3").val() +
            $this.find(".code_no_4").val(),
          verify_type: localStorage.getItem("verify_type"),
          return_to: window.location.origin + window.location.pathname,
        };
      }
      $.ajax({
        type: "POST",
        url: "https://support.nestasia.in/api/verify-otp",
        data: formData,
        dataType: "json",
        success: function (data) {
          if (!data.customer_exist && data.status) {
            //             setTimeout(function(){
            //               $('.login_with_phone_information [name="mobile"]').val($('#login_with_phone_form [name="login"]').val());
            //             },1000);
            //             //       $('.login_with_phone_information [name="email_id"]').val($('#login_with_phone_verification_form [name="email_id"]').val());
            //             $('.login_width_phone_step').removeClass('active');
            //             $('.login_with_phone_email').addClass('active');
            $(".login_width_phone_step").removeClass("active");
            $(".login_with_phone_information").addClass("active");
          } else if (
            data.customer_exist &&
            data.status &&
            data.customer_URL != ""
          ) {
            window.location.href =
              "/account/login/multipass/" + data.customer_URL;
          } else if (!data.status) {
            $("#login_with_phone_verification_form .form_error")
              .text("Invalid OTP, Please enter the correct OTP.")
              .addClass("active");
          }
          $(".verification_input_wrap input.verification_input").val("");
          $this.find(".custom_loading").removeClass("loading");
        },
        error: function (error) {
          $(".verification_input_wrap input.verification_input").val("");
          $this.find(".custom_loading").removeClass("loading");
          console.log("error", error);
        },
      });
    }
    e.preventDefault();
    return false;
  });
  $("#login_with_phone_email_form").submit(function (e) {
    var error_count = 0;
    error_count =
      error_count + theme.emailValidation($(this).find('[name="email"]'));
    if (error_count == 0) {
      $('.login_with_phone_information [name="email_id"]').val(
        $('#login_with_phone_email_form [name="email"]').val()
      );
      $(".login_width_phone_step").removeClass("active");
      $(".login_with_phone_information").addClass("active");
    }
    e.preventDefault();
    return false;
  });

  //  profile page add new address on sumbit event
  // $("#address_form_new, .edit-address").submit(function (e) {
  //     var error_count = 0;
  //     let $this = $(this);
  //     error_count = error_count + theme.nameValidation($this.find('[name="address[first_name]"]'));
  //     error_count = error_count + theme.nameValidation($this.find('[name="address[last_name]"]'));
  //     error_count = error_count + theme.nameValidation($this.find('[name="address[company]"]'));
  //     error_count = error_count + theme.textareaValidation($this.find('[name="address[address1]"]'));
  //     // error_count = error_count + theme.textareaValidation($this.find('[name="address[address2]"]'));
  //     error_count = error_count + theme.nameValidation($this.find('[name="address[city]"]'));
  //     error_count = error_count + theme.fieldValidation($this.find('[name="address[zip]"]'));
  //     // error_count = error_count + theme.phoneValidation($this.find('[name="address[phone]"]'));
  //     console.log(error_count);
  //     if (error_count != 0) {
  //       e.preventDefault();
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   });

  $(".login_with_phone_shopify_login #customer_login").submit(function (e) {
    var error_count = 0;
    error_count =
      error_count +
      theme.fieldValidation($(this).find('[name="customer[password]"]'));
    if (error_count != 0) {
      e.preventDefault();
      return false;
    } else {
      return true;
    }
  });
  $(".login_with_phone_recover_customer_password form").submit(function (e) {
    var error_count = 0;
    error_count =
      error_count + theme.emailValidation($(this).find('[name="email"'));
    if (error_count != 0) {
      e.preventDefault();
      return false;
    } else {
      return true;
    }
  });
  //   Login width phone no end
  //   verification code Start
  var body = $("body");

  function goToPrevInput(e) {
    var key = e.which || this.value.substr(-1).charCodeAt(0),
      t = $(e.target),
      sib;
    if (key === 8) {
      sib = t.prev("input.verification_input");
    } else {
      return false;
    }
    sib.val("").select().focus();
  }

  function goToNextInput(e) {
    var key = e.which || this.value.substr(-1).charCodeAt(0),
      t = $(e.target),
      sib;
    if (key === 8) {
      sib = t.prev("input.verification_input");
    } else if (!t.hasClass("code_no_4")) {
      sib = t.next("input.verification_input");
    } else {
      sib = t;
    }

    if (key != 9 && key != 8 && (key < 48 || key > 57)) {
      e.preventDefault();
      return false;
    }

    if (key === 9) {
      return true;
    }

    if (!sib || !sib.length) {
      sib = body.find("input.verification_input").eq(0);
    }
    sib.select().focus();
    $("#login_with_phone_verification_form .form_error").removeClass("active");
  }

  function onKeyDown(e) {
    var key = e.which;

    if (key === 9 || key === 8 || (key >= 48 && key <= 57)) {
      return true;
    }

    e.preventDefault();
    return false;
  }

  function onFocus(e) {
    $(e.target).select();
  }

  body.on("input", "input.verification_input", goToNextInput);
  body.on("keyup", "input.verification_input", goToPrevInput);
  body.on("keydown", "input.verification_input", onKeyDown);
  //   body.on('click', 'input.verification_input', onFocus);
});
// user login js end

let giftwrapsync = function () {
  const cart = window.liquidAjaxCart.cart;
  let giftwrapProduct = [],
    giftwrapGift = [];

  // giftwrapProduct object structure
  // id
  // properties.giftWrap
  // quantity
  // index

  // giftwrapGift object structure
  // id
  // _giftParentId
  // quantity
  // index

  for (let i = 0; i < cart.items.length; i++) {
    if (cart.items[i].properties._giftParentId) {
      //for giftwrapGift
      let temp = {
        id: cart.items[i].id,
        giftParentId: cart.items[i].properties._giftParentId,
        quantity: cart.items[i].quantity,
        index: i,
        key: cart.items[i].key,
      };
      giftwrapGift.push(temp);
    }
    if (cart.items[i].properties.giftWrap) {
      //for giftwrapProduct
      let temp = {
        id: cart.items[i].id,
        giftWrap: cart.items[i].properties.giftWrap,
        quantity: cart.items[i].quantity,
        index: i,
        key: cart.items[i].key,
      };
      giftwrapProduct.push(temp);
    }
  }

  // let updates = {
  //   794864053: 2,
  //   794864233: 3
  // };
  let updates = {};

  for (let i = 0; i < giftwrapProduct.length; i++) {
    for (let j = 0; j < giftwrapGift.length; j++) {
      if (
        parseInt(giftwrapGift[j].giftParentId) ==
        parseInt(giftwrapProduct[i].id)
      ) {
        if (giftwrapGift[j].quantity != giftwrapProduct[i].quantity) {
          console.log(
            `qnt not same ${giftwrapGift[j].quantity} != ${giftwrapProduct[i].quantity}`
          );
          updates = {
            id: `${giftwrapGift[j].key}`,
            quantity: giftwrapProduct[i].quantity,
          };
        }
      }
    }
  }
  console.log(`updates - ${JSON.stringify(updates)}`);
  if (Object.keys(updates).length != 0) {
    liquidAjaxCart.change(updates, options);
  }

  // console.log('giftwrapGift - ',giftwrapGift)
  // console.log('giftwrapProduct - ',giftwrapProduct)
};

// apply codes to coupon box
// pass coupon_code
theme.applyCodes = function (coupon_code) {
  jQuery.getJSON("/cart.js", function (cart) {
    var cart_token,
      subtotal,
      customer_id = "",
      product_ids = "",
      variant_ids = [],
      collection_ids = "",
      total_quantity,
      coupons_html = "",
      coupons_row_html = "",
      line_items = [],
      line_product_arr = [];
    cart_token = cart.token;
    subtotal = cart.items_subtotal_price;
    customer_id = theme.customer_id;
    total_quantity = cart.item_count;

    /* Change in subtotal */
    $.each(cart.items, function (index, item) {
      if (item.product_type == "Gift Card" && subtotal != 0) {
        subtotal = subtotal - item.line_price;
      }
    });
    if (subtotal < 0) {
      subtotal = 0;
    }
    let temppid = [],
      tempcid = [],
      templineitem = [],
      tempvid = [];
    $(".my-cart__item").each(function (index) {
      templineitem = [];
      templineitem.push({
        id: $(this).attr("data-variantid"),
        qty: $(this).attr("data-qty"),
        price: ($(this).attr("data-itemprice") / 100).toFixed(2),
      });
      line_items.push({
        id: $(this).attr("data-product-id"),
        variant_ids: templineitem,
        collection_ids: $(this).attr("data-collectionid"),
      });
      temppid.push($(this).attr("data-product-id").split(":")[0]);
      tempvid.push($(this).attr("data-variantid"));
      $(this)
        .attr("data-collectionid")
        .split(",")
        .forEach(function (ele) {
          tempcid.push(ele);
        });
    });
    //remove dublicate
    let collection_ids_arr_new = tempcid.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
    product_ids = temppid.join(",");
    variant_ids = tempvid.join(",");
    var itemsdata = {
      cart_token: cart_token,
      subtotal: (subtotal / 100).toFixed(2),
      customer_id: customer_id,
      coupon_code: coupon_code,
      line_items: line_items,
      product_ids: product_ids,
      variant_ids: variant_ids,
      collection_ids: collection_ids_arr_new.toString(),
      total_quantity: total_quantity,
    };
    $.ajax({
      type: "POST",
      url: "https://support.nestasia.in/api/check-code-items",
      data: itemsdata,
      dataType: "json",
      success: function (newdata) {
        if (newdata.status) {
          if (newdata.is_applicable) {
            // adding 'active' class to the button
            $(`.apply-btn`).text("apply").removeClass("active");
            $(`.apply-btn[data-coupon=${coupon_code}]`)
              .text("Applied")
              .addClass("active");
            // setting the coupon code to the cookie
            setCookie("discount_code", coupon_code, 7);
            // setting the coupon code to the localstorage
            localStorage.setItem("discountCode", coupon_code);
            //adding a class stating if coupon code is applied or not
            $("#cart_drawer").addClass("couponCodeApplied");
            // showing the coupon code the input field
            $(".cart_offer_input").val(coupon_code);
            // adding the coupon code in the coupon box on cart drawer
            $(".apply-coupon_rc-bot > span").text(coupon_code);
            // input fields popup
            $(".couponloading").hide();
            $(".cart_offer_apply_btn span").show();
            // adding the price in the coupon box
            let totp = 0;
            let len = Object.keys(
              newdata.available_coupons[0].applicable_items
            ).length;

            for (let key in newdata.available_coupons[0].applicable_items) {
              if (
                newdata.available_coupons[0].applicable_items.hasOwnProperty(
                  key
                )
              ) {
                totp +=
                  parseInt(
                    $(
                      `.my-cart__item[data-variantid=${newdata.available_coupons[0].applicable_items[key]}]`
                    ).attr(`data-itemprice`)
                  ) *
                  parseInt(
                    $(
                      `.my-cart__item[data-variantid=${newdata.available_coupons[0].applicable_items[key]}]`
                    ).attr(`data-qty`)
                  );
                $(
                  `.item__applicable_discounts[data-test-product-id=${newdata.available_coupons[0].applicable_items[key]}]`
                ).html(`Coupon Applied <b>${coupon_code}</b>`);
              }
            }
            let disPerc = 0;
            let disVal = 0;
            // calcualtion done for percentage
            if (
              newdata.available_coupons[0].value_type != "" &&
              newdata.available_coupons[0].value_type == "percentage"
            ) {
              disVal = Math.ceil(
                (totp * Math.abs(newdata.available_coupons[0].value)) / 10000
              );
              disPerc = Shopify.formatMoney(
                Math.ceil(
                  (totp * Math.abs(newdata.available_coupons[0].value)) / 100
                ),
                theme.moneyFormat
              );
              // final total price after dividing it with 100
              //let ftotp = totp/100
            }
            // calcualtion done for fixed amount
            else if (
              newdata.available_coupons[0].value_type != "" &&
              newdata.available_coupons[0].value_type == "fixed_amount"
            ) {
              console.log(`totp`, totp);
              if (totp / 100 > 1500) {
                disVal = Math.abs(newdata.available_coupons[0].value);
                disPerc = Shopify.formatMoney(
                  Math.abs(Math.abs(newdata.available_coupons[0].value) * 100),
                  theme.moneyFormat
                );
              } else {
                console.log("Total value < 1500");
                theme.removeCoupon(coupon_code);
              }
            } else {
              console.log(
                `unknow type - ${newdata.available_coupons[0].value_type}`
              );
            }
            if (disPerc) {
              theme.discount_value = disVal;
              // appending the price to the coupon box
              $(".apply-coupon_rc-top > span").text(disPerc);
              // appending the discount price in the pice box
              $(".checkout-price_coupon > .checkout-price_discount-right").text(
                `- ${disPerc}`
              );
              // adding the coupon code in the coupon box on cart drawer
              $(
                ".checkout-price_coupon .checkout-price_discount-left > span"
              ).text(coupon_code);
              $(".checkout-price_coupon").css("display", "flex");
              // total price calculation
              let totalPrice =
                parseInt(
                  $(
                    ".checkout-price_total-amt .checkout-price_total-amt-right"
                  ).attr("data-total")
                ) / 100;
              let finalPrice = totalPrice - theme.discount_value;
              $(
                ".checkout-price_total-amt .checkout-price_total-amt-right"
              ).text(Shopify.formatMoney(finalPrice * 100, theme.moneyFormat));
              $(".checkout-btn span").text(
                Shopify.formatMoney(finalPrice * 100, theme.moneyFormat)
              );
            }
          } else {
            theme.removeCoupon(coupon_code);
            $(".cart_offer_input_wrap_inner").append(
              `<p class="error">Coupon ${coupon_code} is not applicable</p>`
            );
            $(".couponloading").hide();
            $(".cart_offer_apply_btn span").show();
            setTimeout(function () {
              $(".cart_offer_input_wrap_inner").find("p.error").remove();
            }, 10000);
          }
        } else {
          $(".couponloading").hide();
          $(".cart_offer_apply_btn span").show();
          console.log(
            `error in running https://support.nestasia.in/api/check-code-items`
          );
        }
      },
    });
  });
};

// form submission
$(".verification_input.code_no_4").on("input", function () {
  console.log("last one entered");
  $("#login_with_phone_verification_form .form-submit-wrap button").click();
  console.log("click should be triggered");
});

// mobile copy paste opt across 4
$(".verification_input.code_no_1").on("input", function () {
  let inp = $(this).val();
  let len = inp.length;
  if (len == 4) {
    for (let i = 0; i < len; i++) {
      console.log(`.verification_input.code_no_${i + 1} - ${inp[i]}`);
      $(`.verification_input.code_no_${i + 1}`).val(inp[i]);
    }
    $("#login_with_phone_verification_form .form-submit-wrap button").click();
  }
});

  $(document).on('click', '.cart_offer_view_all', function () {
    try {
      popupLoad();
      $(".cart_overlay").show();
      // $('.gift-coupen-popup').css('right','0px');
    } catch (error) {
      // console.log('include coupon-code-popup.liquid snippent in theme.liquid');
      // The function does not exist.
    }
  });

// open cart drawer
theme.openCart = function () {
  $("#cart_drawer").css({ right: "0" });
  $(".cart_overlay").show();
  $("body").css({ overflow: "hidden" });
  if (
    localStorage.getItem("discountCode") != null &&
    localStorage.getItem("discountCode") != undefined &&
    localStorage.getItem("discountCode").trim() != ""
  ) {
    let storedCoupon = localStorage.getItem("discountCode");
    theme.applyCodes(storedCoupon);
  } else {
    console.log("Coupon code is not present on cart open");
  }
};

theme.closeCart = function () {
  $("#cart_drawer").css({ right: "-428px" });
  $(".gift-coupen-popup").css({ right: "-428px" });
  $(".cart_overlay").hide();
  $("body").css({ overflow: "scroll" });
};

// called when the whole cart is rendered

// ref:- https://liquid-ajax-cart.js.org/v2/event-request-end/
document.addEventListener("liquid-ajax-cart:request-end", function (event) {
  const { requestState, cart, previousCart, sections } = event.detail;

  // Print out all the available event data
  // console.log({requestState, cart, previousCart, sections});
  // console.log('event.detail.requestState ',event.detail.requestState);

  let oc = false
  // console.log(`
  // oc1 ${oc}
  // `)
  //opening the cart if product added from product form
  if (event.detail.requestState.requestType != "update") {
    oc = true
  }
  // if in cart page then dont open cart drawer
  if(location.pathname != '/cart') {
    oc = true
  }

  console.log('oc ',oc)
  if (oc == true){
    theme.openCart();
  }
  if(requestState.info.initiator && requestState.info.initiator.tagName == 'AJAX-CART-PRODUCT-FORM'){
    atcty(); //atc ty stands for atc thank you for text change
  }

  if (
    localStorage.getItem("discountCode") != null &&
    localStorage.getItem("discountCode") != undefined &&
    localStorage.getItem("discountCode").trim() != ""
  ) {
    let storedCoupon = localStorage.getItem("discountCode");
    theme.applyCodes(storedCoupon);
  } else {
    console.log("Coupon code is not present on cart open");
  }
});

// called when request starts

// ref:- https://liquid-ajax-cart.js.org/v2/event-request-start/
document.addEventListener("liquid-ajax-cart:request-start", function (event) {
  const { requestState } = event.detail;

  // Print the requestState before the request is performed
  console.log(`request state event- `,event);
  console.log(`requestState.info- `,requestState.info);
  console.log('requestState.info.initiator- ',requestState.info.initiator.tagName);
  if(requestState.info.initiator && requestState.info.initiator.tagName == 'AJAX-CART-PRODUCT-FORM'){
    console.log('product adding from the product form')
  }
  // check if the gift cart is removed
  console.log(`request state event- `, event.detail.requestState.requestType);
  const cart = window.liquidAjaxCart.cart;
  // if (event.detail.requestState.requestType != "update") {
  //   theme.openCart();
  // }
  if (event.detail.requestState.requestType == "change") {
    console.log(
      `event.detail.requestState.info.initiator.className-`,
      event.detail.requestState.info.initiator.className
    );
    if (
      event.detail.requestState.info.initiator.className == "cart-remove_left cart-remove_btn c-gold gift-remove" ||
      event.detail.requestState.info.initiator.className == "cart-remove_left cart-remove_btn cp-remove_btn c-gold gift-remove"
    ) {
      console.log(event.detail.requestState.info.initiator.dataset.message);
      let message =
        event.detail.requestState.info.initiator.dataset.message.slice(4);
      let key;
      for (let i = 0; i < cart.items.length; i++) {
        if (cart.items[i].title == message) {
          console.log(cart.items[i].key);
          key = cart.items[i].key;
        }
      }
      if (key) {
        let changebdy = {
          id: key,
          properties: { _id: "", giftWrap: "", _giftWrap: "" },
        };
        liquidAjaxCart.change(changebdy, options);
      } else {
        console.log("key is not available");
      }
    } else {
      // for the situation when the main product is deleated, the gift card is also deleated
      let varid = event.detail.requestState.info.initiator.dataset.varid;
      let title = event.detail.requestState.info.initiator.dataset.title;
      let key;
      title = "for " + title;
      for (let i = 0; i < cart.items.length; i++) {
        if (cart.items[i].properties.message == title) {
          console.log(cart.items[i].key);
          key = cart.items[i].key;
        }
      }
      console.log(`
          varid ${varid}
          title ${title}
          key ${key}
        `);
      if (key) {
        let changebdy = {
          id: key,
          quantity: 0,
        };
        liquidAjaxCart.change(changebdy, options);
      } else {
        console.log("key is not available");
      }
    }
  }

  // add the addon product in pdp
  // console.log('requestState.info.initiator - ',requestState.info.initiator)
  if (
    requestState.info.initiator.tagName.toLowerCase() ==
    "ajax-cart-product-form"
  ) {
    console.log("ajax-cart-product-form found");
    let sm = $(".quantitySM");
    let sml = sm.length;
    let addbody = {
      items: [],
    };

    for (let i = 0; i < sml; i++) {
      if (parseInt(sm[i].value) > 0) {
        // console.log(`varid = ${$(sm[i]).attr('data-variant-id')}`)
        let prodid = parseInt($(sm[i]).attr("data-product-id"));
        let newItem = {
          id: parseInt($(sm[i]).attr("data-variant-id")),
          quantity: parseInt(sm[i].value),
        };
        console.log("newItem - ", newItem);
        addbody.items.push(newItem);
        //reset the value to 0
        sm[i].value = "0";
        //hide the quantity
        $(`.slickSmEachProductInput${prodid}`).css("display", "none");
        //show the atc
        $(`.slickSmEachProductAtc${prodid}`).css("display", "flex");
      }
    }
    console.log(`addbody - ${addbody.items.length} - `, addbody);
    if (addbody.items.length > 0) liquidAjaxCart.add(addbody, options);
    else console.log(`quantity is 0`);
  }
});

theme.removeCoupon = function (coupon_code) {
  var data = {
    cart_token: theme.cart_token,
    code: coupon_code,
  };
  $.ajax({
    type: "POST",
    url: "https://support.nestasia.in/api/remove-code",
    data: data,
    dataType: "json",
    success: function (data) {
      console.log("remove status::", data.status);
      if (data.status) {
        $(`.apply-btn`).text("apply").removeClass("active");
        console.log(`hi - .apply-btn[data-coupon=${coupon_code}]`);
        deleteCookie("discount_code");
        localStorage.removeItem("discountCode");
        $(".cart_offer_input").val("");
        $("#cart_drawer").removeClass("couponCodeApplied");
        $(".item__applicable_discounts").html("");
        $(".checkout-price_coupon").hide();
        let finaPrice = parseInt(
          $(".checkout-price_total-amt .checkout-price_total-amt-right").attr(
            "data-total"
          )
        );
        $(".checkout-price_total-amt .checkout-price_total-amt-right").text(
          Shopify.formatMoney(finaPrice, theme.moneyFormat)
        );
        $(".checkout-btn span").text(
          Shopify.formatMoney(finaPrice, theme.moneyFormat)
        );
      } else {
        console.log("Error in removing the coupon");
      }
    },
  });
};

function updateVariantId(newVariantId) {
    // Get the current URL
    var currentUrl = window.location.href;

    // Check if the URL contains a variant parameter
    if (currentUrl.includes('?variant=')) {
        // Update the existing variant ID
        currentUrl = currentUrl.replace(/variant=\d+/, `variant=${newVariantId}`);
    } else {
        // If there's no variant parameter, add it to the end of the URL
        currentUrl += `?variant=${newVariantId}`;
    }

    // Use pushState to change the URL without reloading the page
    window.history.pushState({ path: currentUrl }, '', currentUrl);
}

function handleIconClick() {
  // Run the theme.loginWithPhoneOpen() function
  theme.loginWithPhoneOpen();
}

function wishlistAttach(){      
    var elements = document.querySelectorAll('.ssw-faveiticon');
    // console.log('elements ',elements)
    
    // Add an event listener to each element
    elements.forEach(function(element) {
      element.addEventListener('click', handleIconClick);
    });
}

// open and close searchbar
$(document).on("click", '.icon-search[aria-label="Search"]', function () {
  // console.log('button clicked')
  if (checkMobile()) $("#wizzy-search-input-new").click();
  else {
    $(".search-form.header").slideToggle();
    $('.search-overlay').toggle();
    setTimeout(() => {
      $('input.search-field').focus()
    }, "1000");
  }
});

$(document).on("click", '.header-searchbar .search-form svg', function () {
  $(".search-form.header").slideToggle();
  $('.search-overlay').hide();
})
$(document).on("click", '.search-overlay', function () {
  $(".search-form.header").slideUp();
  $('.search-overlay').hide();
})

const dropdownCheck = () =>  {
  console.log('dropdownCheck', $('.wizzy-selected-facet-list-item').length)
  let checker = 0
  if (checkMobile()) checker = 1
  else checker = 5
  if($('.wizzy-selected-facet-list-item').length > checker) {
    $('.wizzy-selected-facet-list-svg').show()
  }
  else {
    $('.wizzy-selected-facet-list-svg').hide()  
  }
  $('.wizzy-selected-facet-list-svg').on('click',function(){
    $('ul.wizzy-selected-facet-list').toggleClass('wizzy-selected-facet-list-one-line')
    $(this).toggleClass('svg-rot')
  })
}



function myMutation() {
  //check the giftwrap and prodct is in sync
  giftwrapsync();
}

// Let Liquid Ajax Cart know about the mutation functions
window.liquidAjaxCart.conf("mutations", [myMutation]);
