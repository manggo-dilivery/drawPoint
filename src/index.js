import PaintLine from './draw'
var cvsBody = {
  clientWidth: 600,
  clientHeight: 600
}
var drawInfo = {
  lineNum: 1, limitPoint: 5, lineClosed: false, fillPolygon: false, direction: false
}

var ins = new PaintLine({ele: "test", cvsBody, ...drawInfo })

var btn = document.querySelector('#btn')
var btn1 = createEle('button', setPoint, 'setPoint')
var btn2 = createEle('button', getPoint, 'getPonit')
var btn3 = createEle('button', restartPaint, 'restartPaint')
var btn4 = createEle('button', restartPaint, 'lineNum', {lineNum: 2})
var btn5 = createEle('button', restartPaint, 'lineClosed', {lineClosed: true})
var btn6 = createEle('button', restartPaint, 'fillPolygon', {fillPolygon: true})
var btn7 = createEle('button', restartPaint, 'direction', {direction: true})
btn.appendChild(btn1)
btn.appendChild(btn2)
btn.appendChild(btn3)
btn.appendChild(btn4)
btn.appendChild(btn5)
btn.appendChild(btn6)
btn.appendChild(btn7)

function createEle(eleName, callback, name, data) {
  var ele = document.createElement(eleName)
  ele.addEventListener('click', callback)
  ele.innerText = name
  ele.setAttribute('info', JSON.stringify(data))
  return ele
}

function setPoint() {
  var pointList = [
    [[45, 82],
    [66, 222],
    [130, 239],
    [185, 164],
    [185, 99]]
  ]
  ins = new PaintLine({ ele: "test", cvsBody, ...drawInfo, pointList })
  // ins.restartPaint(drawInfo, pointList)
}
function getPoint() {
  var point = ins.getPointList()
  console.log('point', point)
}
function restartPaint(e) {
  var aa = {...drawInfo}
  var b = e.target.getAttribute('info')
  var info = b === 'undefined' ? {} : JSON.parse(b)
  if (info) {
    for (let i in info) {
      aa[i] = info[i]
    }
  }
  ins.restartPaint(aa)
}