/* @ts-check */
/* eslint-disable */
const $ = require("jquery")
const bootstrap = require("bootstrap")
const popperjs = require("popper.js")

require("jquery-mask-plugin")
const { validate } = require("formee")

window.validate = validate
window.$ = $

module.exports = function() {
  $(function() {
    $(".popover-trigger").popover({
      trigger: "focus"
    })
    $(window).on("scroll", e => {
      // e.
      if ($(this).scrollTop() > 100) {
        $(".navbar").addClass("scrolled-down")
      } else {
        $(".navbar").removeClass("scrolled-down")
      }
    })
    $(window).trigger("scroll")

    window.resetForm = () => {
      $(`:input`).removeClass("border-danger")

      $(`:input`)
        .siblings("span.text-danger")
        .remove()
    }
  })
}
