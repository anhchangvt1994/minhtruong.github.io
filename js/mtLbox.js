$(function($) {
    $.fn.mtLbox = function(opt) {
        var itemID = $(this)[0].id,
            itemClass = $(this)[0].className;
        var curObj = itemID == " " ? "#" + itemID : itemClass.split(" ").length == 0 ? "." + itemClass : "." + itemClass.split(" ")[0],
            listImg = $($(this).find("img"));        
            console.log(curObj);
        // get origin paramenters (id/class of current item use plugin function).
        // get list images of  that item.  

        if (opt === undefined) {
            opt = { "suffixImg": undefined };
        }

        // get suffix for alternative image (if you want to instead current image by a langer image)   

        mtSetupLBox["init"](curObj, opt, listImg);
    };
    var mtSetupLBox = {
        init: function(curObj, opt, imgs) {
            this.setup(curObj, opt, imgs);
        },
        setup: function(curObj, opt, imgs) {
            var wWidth = $(window).outerWidth(true) <= 375 ? $(window).outerWidth(true) * 90 / 100 : $(window).outerWidth(true) * 80 / 100;
            var wHeight = $(window).outerHeight(true) <= 375 ? $(window).outerHeight(true) * 90 / 100 : $(window).outerHeight(true) * 80 / 100;

            // get % for fit images into window width and height.

            var currentPercent, imgID;
            $("body").append('<div class="fullImg hidden">\
                                    <div class="imgBox">\
                                    </div>\
                                   </div>\
                                   <div class="navBox hidden">\
                                    <span class="prevBtn">&nbsp;</span>\
                                    <span class="close-lightBox"></span>\
                                    <span class="nextBtn">&nbsp;</span>\
                                   </div>');

            // origin content for fancybox.   
            var target = ($(curObj).find("a").length!=0?"a":$(curObj).find("li").length!=0?"li":$(curObj).find("div").length!=0?"div":$(curObj).find("dd").length!=0?"dd":"img");
            console.log(target);
            if(target!="img"){
                $(curObj).find(target).click(function(e){
                    e.preventDefault();
                    $(this).find("img").click();
                });
            }            
            $(curObj).find("img").click(function(e) {                
                e.preventDefault();                
                // setting for fancybox animate after clicked.
                var trueW, trueH, animate = 50;
                // check if have suffix
                if (opt.suffixImg !== undefined) {
                    $("body").find(".fullImg").append(setNewImg($(this))).removeClass("hidden");
                    animate = 0;
                } else {
                    $("body").find(".fullImg").append($(this)[0].outerHTML);
                }                
                $(".fullImg").find("img").load(function() {

                    // get width and height in fact of that image acording to % width and height of window    

                    trueW = getSmallRatio($(this).prop("naturalWidth"), $(this).prop("naturalHeight")).trueWidth;
                    trueH = getSmallRatio($(this).prop("naturalWidth"), $(this).prop("naturalHeight")).trueHeight;
                    
                    // animte for fancybox

                    $("body").find(".fullImg").removeClass("hidden");
                    $("body").find(".navBox").removeClass("hidden");
                    $("body").find(".fullImg img").attr({ "width": trueW, "height": trueH });
                    setTimeout(function() {
                        $("body").find(".fullImg img").addClass("appearOpa");
                    }, 200);
                    setTimeout(function() {
                        $("body").find(".imgBox").css({ "width": trueW + 20, "height": trueH + 20 });
                        $("body").find(".navBox").css({ "width": trueW + 20, "height": trueH + 20 });
                    }, animate);
                });
                var curItem = $(this);
                imgs.each(function(id) {
                    if (curItem.attr("src") == $(this).attr("src")) {
                        imgID = id;
                    }
                });
                return false;
            })

            // service function for getting new image width suffix paramenter  
            // note : the images file have suffix must have same name the the corresponding image

            function setNewImg(img) {
                var src = img.attr("src");
                var oldImg = src.split("/")[src.split("/").length - 1];
                var newImg = src.split(oldImg)[0] + oldImg.split(".")[0] + "-" + opt.suffixImg + "." + oldImg.split(".")[1];
                return "<img src='" + newImg + "'>";
            }

            // service function for detecting the fact size of image according width and height of window

            function getSmallRatio(curW, curH) {
                if (curW > wWidth) {
                    currentPercent = (wWidth / curW) * 100;
                    curW = wWidth;
                    curH = (curH * currentPercent) / 100;
                }
                if (curH > wHeight) {
                    currentPercent = (wHeight / curH) * 100;
                    curH = wHeight;
                    curW = (curW * currentPercent) / 100;
                }
                if (curW > wWidth || curH > wHeight) {
                    arguments.callee(curW, curH);
                } else {
                    return { "trueWidth": curW, "trueHeight": curH };
                }
            }

            // dectect and control when next/prev button clicked.    

            $(".navBox").on("click", ".prevBtn, .nextBtn", function() {
                if ($(this)[0].className == "prevBtn") {
                    if (imgID > 0) {
                        imgID--;
                    } else {
                        imgID = $(curObj).find("img").length - 1;
                    }
                } else if ($(this)[0].className == "nextBtn") {
                    if (imgID < $(curObj).find("img").length - 1) {
                        imgID++;
                    } else {
                        imgID = 0;
                    }
                }
                var getImgByID = $(curObj).find("img")[imgID];
                var trueW = getSmallRatio($(getImgByID).prop("naturalWidth"), $(getImgByID).prop("naturalHeight")).trueWidth;
                var trueH = getSmallRatio($(getImgByID).prop("naturalWidth"), $(getImgByID).prop("naturalHeight")).trueHeight;
                setTimeout(function() {
                    $("body").find(".fullImg").append($(getImgByID)[0].outerHTML);
                    $("body").find(".imgBox").css({ "width": trueW + 20, "height": trueH + 20 });
                    $("body").find(".navBox").css({ "width": trueW + 20, "height": trueH + 20 });
                    setTimeout(function() {
                        $("body").find(".fullImg").children().eq(1).attr({ width: trueW, height: trueH }).removeClass("appearOpa");
                        console.log($("body").find(".fullImg").children().eq(1));
                        setTimeout(function() {
                            $("body").find(".fullImg").children().eq(2).attr({ width: trueW, height: trueH }).addClass("appearOpa");
                            console.log($("body").find(".fullImg").children().eq(2));
                        }, 150)
                    }, 100);
                    setTimeout(function() {
                        $("body").find(".fullImg").children().eq(1).remove();
                        if (!$("body").find(".fullImg img").hasClass("appearOpa")) {
                            var trueW = getSmallRatio($(getImgByID).prop("naturalWidth"), $(getImgByID).prop("naturalHeight")).trueWidth;
                            var trueH = getSmallRatio($(getImgByID).prop("naturalWidth"), $(getImgByID).prop("naturalHeight")).trueHeight;
                            $("body").find(".fullImg img").attr({ width: trueW, height: trueH }).addClass("appearOpa");
                        }
                    }, 500)
                }, 150);
            })

            // detect and control when close button clicked.           

            $(".navBox").on("click", ".close-lightBox", function() {
                $(".fullImg").addClass("hidden").find("img").remove();
                $(".fullImg").find(".imgBox").css({ "width": "", "height": "" });
                $(this).parent().addClass("hidden");
            })
                    
            // detect and control when resize the screen size.   

            $(window).resize(function() {
                if ($(this).outerWidth(false) <= 375 && !$(".fullImg").hasClass("hidden")) {
                    wWidth = $(this).outerWidth(false) * 90 / 100;
                    wHeight = $(this).outerHeight(false) * 90 / 100;
                } else {
                    wWidth = $(this).outerWidth(false) * 80 / 100;
                    wHeight = $(this).outerHeight(false) * 80 / 100;
                }
                var trueW = getSmallRatio($("body").find(".fullImg img").prop("naturalWidth"), $("body").find(".fullImg img").prop("naturalHeight")).trueWidth;
                var trueH = getSmallRatio($("body").find(".fullImg img").prop("naturalWidth"), $("body").find(".fullImg img").prop("naturalHeight")).trueHeight;
                $("body").find(".fullImg img").css({ "width": trueW, "height": trueH });
                $("body").find(".imgBox").css({ "width": trueW + 20, "height": trueH + 20 });
                $("body").find(".navBox").css({ "width": trueW + 20, "height": trueH + 20 });
            })
        }
    }
})
