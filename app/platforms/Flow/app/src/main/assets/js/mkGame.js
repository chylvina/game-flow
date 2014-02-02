var bgCanvas,
  liCanvas,
  bgContext,
  liContext;

$(document).ready(function () {
  bgCanvas = document.getElementById("bgCanvas");
  liCanvas = document.getElementById("liCanvas");
  bgContext = bgCanvas.getContext("2d");
  liContext = liCanvas.getContext("2d");
  //Sleak = document.getElementById("Sleak");
  //Sforward = document.getElementById("Sforward");
  liCanvas.addEventListener("touchend", function (ev) {
    ev.preventDefault();
    console.log("touch end");
    mouseDown = false;
    $("#movesC").html(movesC)
  }, false);
});
function mkGame(size, levelBoxsA) {
  $("#Perc").html("0");
  $("#movesC").html("0");


  bgContext.clearRect(0, 0, 550, 550);
  liContext.clearRect(0, 0, 550, 550);
  idoArray = $("#levels a[data-lno='" + nowLevelNo + "']").attr("data-cano");
  movesC = 0;
  if (compArray[idoArray]) {
    if (!compArray[idoArray].split(":")[1]) {
      movesB = "-";
    } else {
      movesB = compArray[idoArray].split(":")[1];
    }
  } else {
    movesB = "-";
  }
  $("#movesB").html(movesB);
  FWSpeed = 1;
  level = []
  colors_d = ["rgba(247,125,0,1)", "rgba(0,0,255,1)", "rgba(0,129,0,1)", "rgba(239,239,0,1)", "rgba(255,0,0,1)", "rgba(0,255,255,1)", "rgba(255,0,255,1)", "rgba(164,45,41,1)", "rgba(123,0,123,1)", "rgba(255,255,255,1)", "rgba(0,0,140,1)", "rgba(0,125,123,1)", "rgba(165,165,165,1)", "rgba(0,255,0,1)", "rgba(189,182,107,1)", "rgba(255,20,148,1)"];
  boxSize = 550 / size;
  HboxSize = boxSize / 2;
  lineSize = boxSize * 33 / 100;
  CircSize = boxSize * 35 / 100;
  boxs = []
  mouseDown = false;
  levelColor = -1;
  oldBox = -1;
  anyThing = false;
  offsetLeft = liCanvas.parentElement.offsetLeft;
  offsetTop = liCanvas.parentElement.offsetTop;
  //// STR Draw BG & Make Boxs \\\\
  bgContext.beginPath();
  for (var y = 0; y < size; y++) {
    bgContext.moveTo(y * boxSize, 0);
    bgContext.lineTo(y * boxSize, 550);
    bgContext.moveTo(0, y * boxSize);
    bgContext.lineTo(550, y * boxSize);
    for (var x = 0; x < size; x++) {
      boxs.push({
        state: 0,
        colorIndex: -1,
        points: [x * boxSize, y * boxSize, (x + 1) * boxSize, (y + 1) * boxSize]
      });
    }
  }
  bgContext.moveTo(550, 0);
  bgContext.lineTo(550, 550);
  bgContext.moveTo(0, 550);
  bgContext.lineTo(550, 550);
  bgContext.strokeStyle = "#fff";
  bgContext.stroke();
  bgContext.closePath()
  //// END Draw BG & Make Boxs \\\\


  //// STR Draw Level \\\\
  levelBoxsA.forEach(function (value, key) {
    bgContext.beginPath();
    level[key] = {line: [], comp: false, color: colors_d[key], box: value, soundState: 0};
    var box_1 = boxs[value[0]];
    var box_2 = boxs[value[1]];
    box_1.state = 2;
    box_2.state = 2;
    box_1.colorIndex = key;
    box_2.colorIndex = key;
    var arcX_1 = (box_1.points[0] + box_1.points[2]) / 2
    var arcY_1 = (box_1.points[1] + box_1.points[3]) / 2
    var arcX_2 = (box_2.points[0] + box_2.points[2]) / 2
    var arcY_2 = (box_2.points[1] + box_2.points[3]) / 2

    bgContext.moveTo(arcX_1, arcY_1);
    bgContext.arc(arcX_1, arcY_1, CircSize, 0, Math.PI * 2);
    bgContext.moveTo(arcX_2, arcY_2);
    bgContext.arc(arcX_2, arcY_2, CircSize, 0, Math.PI * 2);
    level[key].colorOpc = level[key].color.replace("1)", ".2)");
    bgContext.fillStyle = level[key].color;
    bgContext.fill();
    bgContext.closePath()
  });
  //// END Draw Level \\\\
  liCanvas.addEventListener("touchstart", pointerStart, false);
  liCanvas.addEventListener("touchmove", pointerMove, false);

  function pointerStart(ev) {
    ev.preventDefault();
    console.log(ev);
    mouseDown = true;
    var evX, evY;
    evX = ev.offsetX || ev.layerX;
    evY = ev.offsetY || ev.layerY;

    boxId = (parseInt(evY / boxSize) * size) + parseInt(evX / boxSize);
    if (levelColor != boxs[boxId].colorIndex) {
      movesC++;
    }
    levelColor = boxs[boxId].colorIndex;
    if (boxs[boxId].state == 2) {

      for (i = 1; i < level[levelColor].line.length; i++) {
        var box = boxs[level[levelColor].line[i]]
        if (box.state != 2) {
          box.state = 0;
          box.colorIndex = -1;
        }
      }
      level[levelColor].line = [boxId];
    }
    anyThing = true;
    pointerMove(ev);
  }

  function pointerMove(ev) {
    ev.preventDefault();
    console.log(ev);
    var evX, evY;
    evX = ev.touches[0].pageX;
    evY = ev.touches[0].pageY;

    var boxId = (parseInt(evY / boxSize) * size) + parseInt(evX / boxSize);

    if (oldBox != boxId && mouseDown && levelColor != -1) {
      var lastLLineId = level[levelColor].line[level[levelColor].line.length - 1];
      oldBox = boxId;
      var box = boxs[boxId];
      if (!anyThing && !(lastLLineId - size == boxId || lastLLineId + size == boxId || ((lastLLineId - 1 == boxId || lastLLineId + 1 == boxId) && parseInt(lastLLineId / size) == parseInt(boxId / size)))) {
        return;
      }
      if (box.state == 2) {
        if (level[levelColor].line[0] != boxId && box.colorIndex == levelColor && (lastLLineId - 1 == boxId || lastLLineId + 1 == boxId || lastLLineId - size == boxId || lastLLineId + size == boxId)) {
          level[levelColor].line.push(boxId);
          mouseDown = false;

        }
      }
      if (box.state == 1 || (box.state == 2 && box.colorIndex == levelColor)) {
        newArray = [];
        var goHell = false;
        var oldArray = level[box.colorIndex].line;
        var NCI = box.colorIndex;
        for (i = 0; i < oldArray.length; i++) {
          if (oldArray[i] == boxId && box.colorIndex != levelColor) {
            goHell = true;
            oldBox = -1;
          }
          if (!goHell) {
            newArray.push(oldArray[i]);
          } else {
            if (boxs[oldArray[i]].state != 2) {
              boxs[oldArray[i]].state = 0;
              boxs[oldArray[i]].colorIndex = -1;
            }
          }
          if (oldArray[i] == boxId) {
            goHell = true;
          }
        }
        level[NCI].line = newArray;

      } else if (box.state == 0) {
        box.state = 1;
        box.colorIndex = levelColor;
        level[levelColor].line.push(boxId);
      }
      liContext.clearRect(0, 0, 550, 550);
      var boxsSum = 0;
      var compSum = 0;
      var PlayTS = false;
      var PlayFS = false;
      FWSpeed = 1;
      for (var i = 0; i < level.length; i++) {
        var NLevel = level[i]
        if (NLevel.line.length != 0) {
          liContext.beginPath()
          var firstBox = NLevel.line[0];
          var secondBox = NLevel.line[NLevel.line.length - 1];
          var FPoint = boxs[NLevel.line[0]].points;
          liContext.moveTo(FPoint[0] + HboxSize, FPoint[1] + HboxSize);
          liContext.fillStyle = NLevel.colorOpc;
          liContext.fillRect(FPoint[0], FPoint[1], boxSize, boxSize);
          boxsSum++;
          for (var p = 1; p < NLevel.line.length; p++) {
            boxsSum++;
            var NBox = boxs[NLevel.line[p]].points;
            liContext.lineTo(NBox[0] + HboxSize, NBox[1] + HboxSize);
            liContext.fillStyle = NLevel.colorOpc;
            liContext.fillRect(NBox[0], NBox[1], boxSize, boxSize);
          }
          liContext.lineWidth = lineSize;
          liContext.lineCap = 'round';
          liContext.lineJoin = "round";
          liContext.strokeStyle = NLevel.color
          liContext.stroke();
          liContext.closePath()
          var isNewComp = NLevel.comp;
          if ((NLevel.box[0] == firstBox && NLevel.box[1] == secondBox) || (NLevel.box[0] == secondBox && NLevel.box[1] == firstBox)) {
            NLevel.comp = true;
            FWSpeed += .1;
            compSum++;
          } else {
            NLevel.comp = false;
          }
          if (isNewComp == false && NLevel.comp == true) {
            PlayTS = true;
          }
          if (isNewComp == true && NLevel.comp == false) {
            PlayTS = false;
            PlayFS = true;
          }
        }
      }
      if (PlayTS == true) {
        //Sforward.playbackRate = FWSpeed-.1;
        //Sforward.play();
      }
      if (PlayFS == true) {
        //Sleak.play();
      }
      var Perc = Math.round(boxsSum * 100 / boxs.length);
      if (Perc == 100 && compSum == level.length) {
        if (!compArray[idoArray]) {
          compArray.push(nowLevelNo + ":" + movesC + ":" + level.length);
        } else {
          var CANlevel = compArray[idoArray].split(":");
          if (!CANlevel[1] || CANlevel[1] > movesC) {
            compArray[idoArray] = nowLevelNo + ":" + movesC + ":" + level.length;
          }
        }
        saveComp();
        if (level.length == movesC) {
          $("#levelCompS .title").html("Perfect!");
        } else {
          $("#levelCompS .title").html("Level complete!");
        }
        $("#levelCompS .desc").html("You completed the level in " + movesC + " moves.");
        $("#forwCS").val("next level");
        $("#retrCS").css("display", "block");
        var sharemsg = "I've Completed Level " + (nowLevelNo - nowPackNo * 150 + 1) + " (" + size + "X" + size + ") in " + flowjson[nowPackNo][0].name + " & my total score : " + TScore + "!";
        addthis.update('share', 'title', sharemsg + " give a try");
        $(".addthis_button_facebook,.addthis_button_google_plusone_share").attr("addthis:url", "http://moh97.us/flow/share.php?msg=" + encodeURIComponent(sharemsg));
        addthis.toolbox("#share_score");
        $("#share_score").css("display", "block");
        $("#keepCS").css("display", "none");
        $("#levelCompS").fadeIn("fast");
      } else if (compSum == level.length) {
        $("#levelCompS .title").html("Almost there...");
        $("#levelCompS .desc").html("Fill the board with pipe to complete the level.");
        $("#forwCS").val("skip level");
        $("#retrCS").css("display", "none");
        $("#share_score").css("display", "none");
        $("#keepCS").css("display", "block");
        $("#levelCompS").fadeIn("fast");
      }
      $("#Perc").html(Perc);
      anyThing = false;

    }
  }
}