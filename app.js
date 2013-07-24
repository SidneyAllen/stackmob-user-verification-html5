var app = (function($){

  StackMob.init({
      publicKey: "YOUR_PUBLIC_API_KEY",
      apiVersion: 0,
      secure : StackMob.SECURE_ALWAYS
  });

  var HomeView = Backbone.View.extend({

    initialize: function() {
       this.template = _.template($('#homeTemplate').html());
    },

    render:function (eventName) {
      // Render the page template
      $(this.el).html(this.template());
        
      return this;
    }
  });

  var VerifyView = Backbone.View.extend({
    events: {
      "click #verifyBtn": "verify",     
    },

    initialize: function() {
       this.template = _.template($('#verifyTemplate').html());
       this.router = this.options.router;
       this.username = this.options.username;
       this.uuid = this.options.uuid;
    },

    render:function (eventName) {
      // Render the page template
      $(this.el).html(this.template());
        
      return this;
    },
    
    verify:function (e) {
      // Render the page template
      var self = this;
      e.preventDefault();

      StackMob.customcode('create_verified_user', { 
          username: self.username, 
          uuid: self.uuid, 
          password: $("#verifyForm input.password").val()
          }, 
          'POST', 
          { 
          success: function(result) { 
              console.debug(result); 
              alert("Success! User Account Verified") 
          }, 
          error: function(error) { 
              console.log(error); 
          }
      });

      return this;
    }
  });

  var SignUpView = Backbone.View.extend({
    events: {
      "click #signUpBtn": "signup"     
    },

    initialize: function() {
      this.template = _.template($('#signUpTemplate').html());
      this.router = this.options.router;
    },

    render:function (eventName) {
      // Render the page template
      $(this.el).html(this.template());
        
      return this;
    },

    signup:function (e) {
      e.preventDefault();
      
      StackMob.customcode('create_unverified_user', { 
          username: $("#signUpForm input.username").val(), 
          email: $("#signUpForm input.email").val()
          }, 
          'POST', 
          { 
          success: function(result) { 
              console.debug(result);
              alert("Check your email for verification link!") 
          }, 
          error: function(error) { 
              console.log(error); 
          }
      });

      return this;
    }

  });

 
  var AppRouter = Backbone.Router.extend({
    routes:{
      "":"home",
      "signup":"signup",
      "verify/:username/:uuid":"verify"
    },

    initialize:function (options) {
      // Handle back button throughout the application
      $('.back').on('click', function(event) {
        window.history.back();

        return false;
      });
      this.firstPage = true;
    },

    home:function () {
      this.changePage(new HomeView(),true);
    },

    signup:function () {
        this.changePage( new SignUpView({collection : this.collection, router : this}) );
    },

    verify:function (username,uuid) {
      this.changePage(new VerifyView({username:username, uuid : uuid,router:this}),false);
    },

    changePage:function (page,reverse) {
      $(page.el).attr('data-role', 'page');
      page.render();
      $('body').append($(page.el));

      var transition = $.mobile.defaultPageTransition;
      // We don't want to slide the first page
      if (this.firstPage) {
        transition = 'none';
        this.firstPage = false;
      }
          
      $.mobile.changePage($(page.el), {changeHash:false, transition: transition, reverse: reverse});
    }
  });

  var initialize = function(){

    var app_router = new AppRouter();
    Backbone.history.start();
  };

  return { 
    initialize: initialize
  };

}(jQuery));


$(document).ready(function () {
    app.initialize();
});

$.fn.serializeObject = function()
{
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
         o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};
