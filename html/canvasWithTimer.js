//Use javascript array of objects to represent words and their locations
let words = []
let chords = []
let returnString = ''
// let userText

let chordsshrp = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
let chordsflt = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab']


let wordBeingMoved // will use getWordAtLocation

let deltaX, deltaY //location where mouse is pressed
const canvas = document.getElementById('canvas1'); //our drawing canvas

function getWordAtLocation(aCanvasX, aCanvasY) {

  let context = canvas.getContext('2d')

  for (let i = 0; i < words.length; i++) {

    let stringWidth = context.measureText(words[i].word).width
    if ((aCanvasX > words[i].x && aCanvasX < (words[i].x + stringWidth)) &&
      (aCanvasY > words[i].y - 20 && aCanvasY < words[i].y)) return words[i]
  }
  return null
}

function drawCanvas() {

  let context = canvas.getContext('2d')

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  context.font = '20pt Arial'
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'

  for (let i = 0; i < words.length; i++) {

    let data = words[i]

    if (data.lyric) {
      context.fillStyle = 'cornflowerblue'
      context.strokeStyle = 'blue'
    }

    if (data.chord) {
      context.fillStyle = 'green'
      context.strokeStyle = 'green'
    }
    if (data.chgnChord) {
      context.fillStyle = 'darkorange'
      context.strokeStyle = 'darkorange'
    }
    context.fillText(data.word, data.x, data.y);
    context.strokeText(data.word, data.x, data.y)
  }
  context.stroke()
}

function handleMouseDown(e) {

  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  //var canvasX = e.clientX - rect.left
  //var canvasY = e.clientY - rect.top
  let canvasX = e.pageX - rect.left //use jQuery event object pageX and pageY
  let canvasY = e.pageY - rect.top
  // console.log("mouse down:" + canvasX + ", " + canvasY)

  wordBeingMoved = getWordAtLocation(canvasX, canvasY)
  // console.log(wordBeingMoved.word)
  if (wordBeingMoved != null) {
    deltaX = wordBeingMoved.x - canvasX
    deltaY = wordBeingMoved.y - canvasY
    // document.addEventListener("mousemove", handleMouseMove, true)
    // document.addEventListener("mouseup", handleMouseUp, true)
    $("#canvas1").mousemove(handleMouseMove)
    $("#canvas1").mouseup(handleMouseUp)

  }

  // Stop propagation of the event // TODO:  stop any default
  // browser behaviour

  e.stopPropagation()
  e.preventDefault()

  drawCanvas()
}

function handleMouseMove(e) {

  // console.log("mouse move")

  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  let canvasX = e.pageX - rect.left
  let canvasY = e.pageY - rect.top

  wordBeingMoved.x = canvasX + deltaX
  wordBeingMoved.y = canvasY + deltaY

  e.stopPropagation()

  drawCanvas()
}

function handleMouseUp(e) {
  // console.log("mouse up")

  e.stopPropagation()

  //$("#canvas1").off(); //remove all event handlers from canvas
  //$("#canvas1").mousedown(handleMouseDown); //add mouse down handler

  //remove mouse move and mouse up handlers but leave mouse down handler
  $("#canvas1").off("mousemove", handleMouseMove) //remove mouse move handler
  $("#canvas1").off("mouseup", handleMouseUp) //remove mouse up handler

  drawCanvas() //redraw the canvas
}

function handleTimer() {
  drawCanvas()
}

//KEY CODES
//should clean up these hard coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40


function handleKeyDown(e) {

  // console.log("keydown code = " + e.which)

  let keyCode = e.which
  if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
    //prevent browser from using these with text input drop downs
    e.stopPropagation()
    e.preventDefault()
  }

}

function handleKeyUp(e) {
  // console.log("key UP: " + e.which)

  if (e.which == ENTER) {
    handleSubmitButton() //treat ENTER key like you would a submit
    $('#userTextField').val('') //clear the user text field
  }

  e.stopPropagation()
  e.preventDefault()
}
function handleSubmitButton() {

  let userText = $('#userTextField').val(); //get text from user text input field
  if (userText && userText != '') {
    let userRequestObj = {
      text: userText
    } //make object to send to server
    let userRequestJSON = JSON.stringify(userRequestObj) //make JSON string
    $('#userTextField').val('') //clear the user text field
    $.post("userText", userRequestJSON, function (data, status) {

      console.log("data: " + data)
      console.log("typeof: " + typeof data)
      let responseObj = JSON.parse(data)
      if (responseObj.song) {
        words = responseObj.song

        getWords()
        // console.log(words)
      }
    })
  }
}
// take an array of strings and return a an array of words
function getWords() {


  let lyrics = []
  let chord = ''
  let arr = []
  let lyricWords = []
  let chordWords = []
  let lyricWord

  let chordflag = false
  let myFlag = false

  let xPosLyric = 30
  let yPosLyric = 30
  let xPosChord = -1
  let yPosChord = 20

  let lyricWidth

  let strChord = ''
  let mychr

  let chrWidth

  for (let i = 0; i < words.length; i++) {
    let line = words[i]

    let textDiv = document.getElementById("song")
    textDiv.innerHTML = textDiv.innerHTML + `<p> ${line}</p>`

    // will output two arrays, one with lyrics and one with chords
    for (let j = 0; j < line.length; j++) {

      // console.log(line[j])
      if (line[j] == '[') {
        chordflag = true
      }
      if (line[j] == ']') {
        chordflag = false
      }
      if (chordflag == true || line[j] == ']') {
        chord += line[j]
      }
      else if (chordflag == false) {
        lyrics.push(line[j])
        chord += " "


      }
      // counter.push(count)
    }
    // console.log(count)
    lyricWords = lyricWords.concat((lyrics.join('').split(' ')))

    for (let j = 0; j < lyricWords.length; j++) {
      if (lyricWords[j].length > 0) {

        lyricWidth = canvas.getContext('2d').measureText(lyricWords[j]).width

        lyricWord = {
          word: lyricWords[j],
          lyric: true,
          x: xPosLyric,
          y: yPosLyric,
        }

        console.log(lyricWord)
        xPosLyric += 10 + lyricWidth

        // xPosChord = lyricWidth

        yPosChord = yPosLyric - 25

        arr.push(lyricWord)
        lyricWords[j] = ''
      }
    }

    // console.log(chord)
    // chordWords = chordWords.concat((chord.join('').split(' ')))

    for (let k = 0; k < chord.length; k++) {
      mychr = chord.charAt(k)

      // console.log(mychr)


      if (mychr == " ") {
        // xPosChord += canvas.getContext('2d').measureText(' ').width
        chrWidth = canvas.getContext('2d').measureText(' ').width
        console.log(strChord)

        if (strChord != '') {

          strChord = strChord.replace('[', '')
          strChord = strChord.replace(']', '')

          lyricWord = {
            word: strChord,
            chord: true,
            orgnword: strChord,
            x: 10 + xPosChord * chrWidth,
            y: yPosChord,
          }

          console.log(lyricWord)
          arr.push(lyricWord)
          strChord = ''
          xPosChord = -1
        }

      }
      else {
        strChord += mychr
        if (xPosChord === -1) xPosChord = k + chrWidth
      }

    }
    xPosLyric = 30
    yPosLyric += 20 + i * 10 + 25

    lyrics = []
    chord = ""

  }

  words = arr
}


function handleRefreshButton() {

  console.log("Refreshing")

  let currLine = []
  let currHi = 30

  // refreshs the canvas
  for (let i = 0; i < words.length; i++) {

    if (words[i].y > currHi - 25) {
      currLine.push(words[i])
      currLine.sort(function (a, b) { return a.x - b.x })
      currLine.sort(function (a, b) { return a.y - b.y })
    }
  }

  // console.log(currLine)
  words = currLine

  let wordStr = ''
  let currHit = 30
  let sarr = []
  let chordProStr = ''

  let textDiv = document.getElementById("song")

  let returnArr = currLine

  let arrofWords = []
  let height = 30
  // change the y of the chords so it can be sorted
  for (let i = 0; i < returnArr.length; i++) {

    if (returnArr[i]) 
      returnArr[i].newy = returnArr[i].y

    if (returnArr[i].lyric )
      height = returnArr[i].newy
    
      if (returnArr[i].chord && i < 4) {
        returnArr[i].newy = height
       }
  
    arrofWords.push(returnArr[i])

  }
  console.log(arrofWords)
  arrofWords.sort(function (a, b) { return a.x - b.x })
  arrofWords.sort(function (a, b) { return a.newy - b.newy})

  // parse out the words from the arry of objects and the save as a string
  for (let i = 0; i < arrofWords.length; i++) {

    if (arrofWords[i].newy < currHit || arrofWords[i].newy < (currHit - 35) || arrofWords[i].newy < (currHit + 20)) {

      if (arrofWords[i].chord) {
        wordStr += '[' + arrofWords[i].word + ']'

      }
      else
        wordStr += ' ' + arrofWords[i].word + ' '
    }
    else {
      wordStr += '\n'
      currHit = arrofWords[i].newy
      wordStr += ' ' + arrofWords[i].word
    }
    sarr.push(wordStr)
    wordStr = ''

  }
  // console.log(wordStr)
  console.log(sarr.join(''))
  chordProStr = sarr.join('')

  returnString = chordProStr
  textDiv.innerHTML = ''

  // print to the text area under the canvas one line at a time
  let finalArr = chordProStr.split('\n')
  for (let k = 0; k < finalArr.length; k++) {

    textDiv.innerHTML = textDiv.innerHTML + `<p> ${finalArr[k]}</p>`

  }
}

function handleSaveasButton() {
  console.log("Saving")

  let userTextnew = $('#userTextField').val(); //get text from user text input field
  if (userTextnew && userTextnew != '') {
    let userRequestObj = {
      text: userTextnew
    }

    //make object to send to server

    userRequestObj.song = returnString
    let userRequestJSON = JSON.stringify(userRequestObj) //make JSON string

    $('#userTextField').val('') //clear the user text field
    $.post("updateStr", userRequestJSON, function (data, status) {

      console.log("data: " + data)
    })

  }

}

function handleTransposeUp() {

  transpose(1)
  drawCanvas()
}


function handleTransposeDown() {
  transpose(-1)
  drawCanvas()
}

function transpose(upordown) {
  let chrarr = []
  let chord = ''
  let arrName = chordsshrp

  for (let i = 0; i < words.length; i++) {
    if (words[i].chord) {
      // if words contains b or #

      chrarr = chrarr.concat(words[i].word.split(''))

      if (chrarr.includes('#')) {
        arrName = chordsshrp

      } else if (chrarr.includes('b')) {
        arrName = chordsflt

      }
      // console.log(chrarr)
      for (let j = 0; j < chrarr.length; j++) {

        // console.log(chrarr[j])
        if (arrName.includes(chrarr[j])) {
          // console.log(chrarr[j])
          if (chrarr[j + 1] == '#') {
            chrarr[j] += chrarr[j + 1]
            chrarr[j + 1] = ""
            // arrName = chordsshrp
          }
          else if (chrarr[j + 1] == 'b') {
            chrarr[j] += chrarr[j + 1]
            chrarr[j + 1] = ""
            // arrName = chordsflt
          }
          let indx = arrName.indexOf(chrarr[j]) + (upordown * 1)
          if (upordown == -1) {
            if (indx < 0) {
              indx = arrName.length - 1
            }
          }
          else if (upordown == 1) {
            if (indx == arrName.length) {
              indx = 0
            }
          }

          chrarr[j] = arrName[indx]

        }

        chord = chrarr.join("")

      }
      words[i].word = chord
      // console.log(words[i].cdrword)


      if (words[i].orgnword != chord) {
        words[i].chgnChord = true
      } else {
        words[i].chgnChord = false

      }

      // console.log(chord)
      chrarr = []

    }
  }
}

$(document).ready(function () {
  //This is called after the broswer has loaded the web page

  //add mouse down listener to our canvas object
  $("#canvas1").mousedown(handleMouseDown)

  //add key handler for the document as a whole, not separate elements.
  $(document).keydown(handleKeyDown)
  $(document).keyup(handleKeyUp)

  timer = setInterval(handleTimer, 100)
  //clearTimeout(timer) //to stop

  drawCanvas()
})
