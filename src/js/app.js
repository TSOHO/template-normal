!(function($) {

  var isMobile = /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)

  var APP = {
    init: function() {
      var base = this

      base.initWeiXin()
      base.assetsRender()
      base.initLazyload()
    },
    assetsRender: function() {
      var $section = $(".section")
      var tpl = "<!--<img src='{{src}}' />-->"

      $section.each(function(i, o) {
        var $o = $(o)
        var $data = $o.data()

        $o.find(".lazyload").html(tpl.replace("{{src}}", isMobile ? $data.srcp : $data.src))
      })
    },
    initLazyload: function() {
      $('.lazyload').lazyload({
        threshold: 50,
        load: function(element) {
          $(element).hide().fadeIn(1000)
        }
      })
    },
    initWeiXin: function() {
      $.get("http://lining2.y-upsilon.com/api/wechat/jssdk", {
        url: window.location.href
      }).then(function(result) {
        var result = JSON.parse(result)
        wx.config({
          jsApiList: [
            "onMenuShareTimeline",
            "onMenuShareAppMessage",
            "onMenuShareQQ",
            "onMenuShareWeibo",
            "onMenuShareQZone"
          ],
          appId: result.appId,
          nonceStr: result.nonceStr,
          timestamp: result.timestamp,
          signature: result.signature
        })

        var share = {
          title: "",
          desc: "",
          link: window.location.href,
          imgUrl: ""
        }

        wx.ready(function() {
          wx.onMenuShareAppMessage({
            title: share.title,
            desc: share.desc,
            link: share.link,
            imgUrl: share.imgUrl
          })

          wx.onMenuShareTimeline({
            title: share.title,
            link: share.link,
            imgUrl: share.imgUrl
          })
        })
      })
    }
  }

  APP.init()
})(jQuery)
