var nowLevelNo = -1;
var nowPackNo = -1;
var levelCount = 0;
var nowLevelS = 0;
var levelSCount = 0;
var compLevels = "";
var compArray = [];
var packComp = [];
var flowjson;
var allLevels;
if (localStorage) {
  compLevels = localStorage["compLevels"]
}
else {
  compLevels = getCookie("compLevels");
}
if (!compLevels) {
  compLevels = ""
}
compArray = compLevels.split(",");
function saveComp() {
  TScore = 0;
  for (var x = 0; x < packComp.length; x++) {
    packComp[x] = 0;
  }
  for (var i = 0, len = compArray.length; i < len; i++) {
    var NLevelComp = compArray[i].split(":");

    var packlid = parseInt(parseInt(NLevelComp[0]) / 150);
    packComp[packlid]++;
    if (NLevelComp.length == 3) {
      TScore += 100;
      TScore -= Math.min((parseInt(NLevelComp[1]) - parseInt(NLevelComp[2])) * 10, 70);
    }
    var levelElComp = [];
    if (packlid == nowPackNo) levelElComp = $("#levels a[data-lno='" + NLevelComp[0] + "']");
    if (levelElComp.length != 0) {
      if (NLevelComp.length != 3) {
        var levelECNowL = levelElComp.data("level").split(";").length;
        compArray[i] = NLevelComp[0] + ":" + levelECNowL + ":" + levelECNowL;
      }
      levelElComp.attr("data-cano", i);

      if (NLevelComp[1] == NLevelComp[2]) {
        levelElComp.css("background-image", "url(comp3.png?2)")
      } else {
        levelElComp.css("background-image", "url(comp2.png?2)")
      }
    }
  }

  if (localStorage) {
    localStorage["compLevels"] = compArray.join(",");
  } else {
    var date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    document.cookie = "compLevels=" + escape(compArray.join(",")) + "; expires=" + date.toUTCString();
  }
  $("#score").html(TScore);
  for (var i = 0; i < packComp.length; i++) {
    $("#pack_main a[data-packid='" + i + "'] h5").text(packComp[i] + "/150");
  }
}
function getCookie(c_name) {
  var i, x, y, ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == c_name) {
      return unescape(y);
    }
  }
}
$(document).ready(function () {
  pack_1_open = localStorage["pack_1_open"] || getCookie("pack_1_open") || 0;
  allLevels = $("#levels");
  var mainSLeft = $(".mainS")[0].offsetLeft;
  if (top !== self) {
    $(".HAds").remove();
  }

  $.getJSON("new_levels.json", function (data) {
    flowjson = data;
    data.forEach(function (pack, packid) {

      packComp.push(0);

      $("#pack_main").append("<a data-packid='" + packid + "' style='color:" + pack[0].color + "'>" +
        pack[0].name +
        "<h5></h5>" +
        "<span>" + pack[0].desc + "</span>" +
        "</a>"
      );

    });
    $("#pack_main a").click(pack_click);
    saveComp();

    //setTimeout('$("#main_screen").fadeIn();',300);
    setTimeout('$("#main_screen").show();', 300);
  });

  pack_click = function () {
    var packid = $(this).data("packid");
    if (packid == 2 && pack_1_open == 0) {
      //$("#open_pack_msg").fadeIn("fast");
      $("#open_pack_msg").show();
      return;
    }
    nowLevelS = 0;
    nowPackNo = packid;
    var packarray = flowjson[packid];
    allLevels.html("").width(0);
    $("#SCPoint").html("");
    var levelCount = packid * 150;
    levelSCount = 0;
    for (var i = 1, len = packarray.length; i < len; i++) {
      levelSCount++;
      allLevels.width(allLevels.width() + 550).css("margin-left", 0);
      var level_sobj = packarray[i];
      var level_S = $('<div class="level_S" data-size="' + level_sobj.size + '"></div>');
      level_S.append("<span>" + level_sobj.size + "X" + level_sobj.size + " (" + (((i - 1) * 30) + 1) + " - " + (i * 30) + ")</span>");
      level_sobj.levels.forEach(function (level, key) {
        level_S.append("<a href='#' data-lno='" + levelCount + "' data-level='" + level + "'>" + (key + 1) + "</a>");
        levelCount++;
      });
      allLevels.append(level_S);
      $("#SCPoint").append("<li></li>");

    }
    $("#SCPoint li").first().addClass("active");


    saveComp();
    //$("#levels_main").fadeIn();
    $("#levels_main").show();
    //$("#pack_main").fadeOut("fast");
    $("#pack_main").hide();
    //Sforward.play();

  };

  $(".level_S a").live("click", function () {
    nowLevelNo = $(this).data("lno");
    $("#levelCompS").hide();
    //$("#levels_main").fadeOut("fast");
    $("#levels_main").hide();
    //$("#game_screen").fadeIn();
    $("#game_screen").show();
    mkGame(parseInt($(this).parent().data("size")), level2Array($(this).data("level")));

    $("#levelName").html("Level " + $(this).html());
    //Sforward.play();
    return false;
  });
  $("#SCPoint li").live("click", function () {
    nowLevelS = $(this).index();
    $("#SCPoint li").removeClass("active");
    $("#SCPoint li:eq(" + nowLevelS + ")").addClass("active");
    //$("#levels").stop().animate({marginLeft:-550*nowLevelS},{easing:"easeOutCirc",duration:"slow"});
    $("#levels").hide();
  });
  $("#back,#forw,#retr,#forwCS,#retrCS").click(function () {
    var this_id = $(this).data("id");

    if ((nowLevelNo == nowPackNo * 150 && this_id == "back") || (nowLevelNo + 1 >= (nowPackNo + 1) * 150 && this_id == "forw")) {
      return false;
    }
    if (this_id == "back") {
      nowLevelNo--;
    } else if (this_id == "forw") {
      nowLevelNo++;
    }
    //$("#levelCompS").fadeOut("fast");
    $("#levelCompS").hide();
    $(".mainS canvas").hide();
    //$(".mainS canvas").fadeOut("fast",function(){
    mkGameByNo(nowLevelNo);
    //$(".mainS canvas").fadeIn();
    $(".mainS canvas").show();
    //});

  });
  $("#keepCS").click(function () {
    //$("#levelCompS").fadeOut("fast");
    $("#levelCompS").hide();
  });
  $("#sback,#sforw").click(function () {
    var $thisId = $(this).attr("id");
    if ((levelSCount - 1 > nowLevelS && nowLevelS > 0) || (nowLevelS == 0 && $thisId == "sforw") || (levelSCount - 1 == nowLevelS && $thisId == "sback")) {
      if ($thisId == "sback") {
        nowLevelS--;
      } else if ($thisId == "sforw") {
        nowLevelS++;
      }
      $("#SCPoint li").removeClass("active");
      $("#SCPoint li:eq(" + nowLevelS + ")").addClass("active");
      //$("#levels").stop().animate({marginLeft:-550*nowLevelS},{easing:"easeOutCirc",duration:"slow"});
      $("#levels").hide();
    }
  });
  $(".go_screen").click(function () {
    $("#open_pack_msg").hide();
    var new_screen_id = $(this).data("screen");
    var sound = $(this).data("sound");
    //$(".mainS>div").fadeOut("fast");
    $(".mainS>div").hide();
    //$("#"+new_screen_id).stop().fadeIn();
    $("#" + new_screen_id).show();
    //window[sound || "Sleak"].play();
  });
  $(".sound_icon").click(function () {
    if (Sleak.muted) {
      Sleak.muted = false;
      Sforward.muted = false;
      $(this).removeClass("nosound_icon");
    } else {
      Sleak.muted = true;
      Sforward.muted = true;
      $(this).addClass("nosound_icon");
    }
  });

});
function mkGameByNo(no) {
  var bt_no = $("#levels a[data-lno='" + no + "']");
  $("#levelName").html("Level " + bt_no.html());

  mkGame(parseInt(bt_no.parent().data("size")), level2Array(bt_no.data("level")));
}
function level2Array(levelstring) {
  var levelSplit = levelstring.split(";");
  var levelArray = []
  for (var i = 0; i < levelSplit.length; i++) {
    levelArray[i] = levelSplit[i].split(",");
  }
  return levelArray;
}