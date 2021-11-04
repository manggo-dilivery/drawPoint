var warn = function (msg) {
  console.error("[Draw Warn]: " + msg);
}
function PaintLine(options) {
  this._cvs = document.getElementById(options.ele);
  var {clientWidth, clientHeight} = options.cvsBody
  this.lineNum = options.lineNum || 1
  this.limitPoint = options.limitPoint || 5
  this.lineClosed = options.lineClosed || false
  this._cvs.width = clientWidth
  this._cvs.height = clientHeight
  this.clientWidth = clientWidth
  this.clientHeight = clientHeight
  this._direction = options.direction || false
  this.arrowLength = options.arrowLength || 40
  this.angleLength = options.angleLength || 16
  this.currIndex = 1
  this._ctx = this._cvs.getContext('2d');
  this._init(options)
}
function getPointOnCanvas(canvas, x, y) {
  var bbox = canvas.getBoundingClientRect();
  return {
    x: x- bbox.left - 7,
    y:y - bbox.top - 5
  }
}
function canPaint() {
  var _point = this.getPoint()
  return _point.length && this._onPaint
}
function onup (e) {
  var {x, y} = getPointOnCanvas(this._cvs, e.pageX, e.pageY)
  var _point = this.getPoint()
  if (_point.length === this.limitPoint - 1) {
    if (this.lineClosed) {
      let [ox, oy] = _point[0]
      drawLine.call(this, ox, oy, x, y)
    }
    drawArc.call(this, x, y)
    _point.push([x, y])
    this.fillPolygon && fillMode.call(this, _point, _point.length)
    if (this.lineNum > this.currIndex) {
      this.currIndex ++
    } else {
      this.currIndex = 1
      this._onPaint = false
    }
  } else if (_point.length < this.limitPoint - 1) {
    drawArc.call(this, x, y)
    _point.push([x, y])
  }
}
function initStatus (options) {
  if (options.pointList && options.pointList.length) {
    this._onPaint = false
    this.paintOld()
  } else {
    this._onPaint = true
  }
}
function initPoint(options) {
  var len = options.lineNum ? options.lineNum : 1
  var canAssign = options.pointList && options.pointList.length
  for (let i = 0; i < len; i++) {
    this[`_point${i + 1}`] = canAssign ? options.pointList[i] : []
  }
}
function getMiddle(x, ox) {
  return Math.floor(ox + (x - ox) / 2)
}
function normalMode(type, callback, len, _point) {
  for (let i = 1; i < len; i++) {
    let [x, y] = _point[i]
    if (type === 'line') {
      if (i === 1 && this._direction) {
        drawArrow.call(this, x, y, callback)
      }
      let [ox, oy] = _point[i - 1]
      callback.call(this, ox, oy, x, y)
    } else {
      callback.call(this, x, y)
    }
  }
  if (this.lineClosed && this.lineNum >= 2 && type === 'line' && len === this.limitPoint) {
    let [_x, _y] = _point[0]
    let [_ox, _oy] = _point[len - 1]
    callback.call(this, _ox, _oy, _x, _y)
    // this.fillPolygon && this.startFill()
  }
  if (type === 'arc' && _point.length) {
    callback.call(this, _point[0][0], _point[0][1])
  }
}
function fillMode(_point, len) {
  this._ctx.beginPath()
  var [ox, oy] = _point[0]
  this._ctx.strokeStyle = '#f00'
  this._ctx.lineWidth = 4
  this._ctx.moveTo(ox, oy)
  for (let i = 1; i < len; i++) {
    let [x, y] = _point[i]
    this._ctx.lineTo(x, y)
  }
  this._ctx.lineTo(ox, oy)
  this._ctx.fillStyle="rgba(230, 0, 0, 0.3)";
  this._ctx.stroke()
  this._ctx.fill()
  for (let j = 0; j < len; j++) {
    let [ax, ay] = _point[j]
    drawArc.call(this, ax, ay)
  }
}
function handleIteratePoint (type, callback, j) {
  let _point = this[`_point${j}`]
  var len = _point.length
  if (this.fillPolygon && _point.length === this.limitPoint) {
    fillMode.call(this, _point, len)
  } else {
    normalMode.call(this, type, callback, len, _point)
  }
}
function emptyVal(val) {
  !val && warn(`${val} is not defined`)
  return val
}
function isPlainObject(obj) {
  return toString.call(obj) === "[object Object]";
}
function assertObjectType(name, vaule) {
  if (!isPlainObject(vaule)) {
    warn("选项" + name + "的值无效：必须是个对象");
  }
}
function canFill (fillPolygon) {
  this.fillPolygon = this.limitPoint >= 3 && fillPolygon
}
function getAngle(start, end) {
  var diff_x = end.x - start.x,
    diff_y = end.y - start.y;
  //返回角度,不是弧度
  return 360*Math.atan(diff_y/diff_x)/(2*Math.PI);
}
function calcArrow(ox, oy, x, y, len) {
  var A = getAngle({x:ox, y:oy}, {x, y})
  var radian = Math.abs(A * Math.PI / 180)
  var cosA = Math.round(len * Math.cos(radian))
  var sinA = Math.round(len * Math.sin(radian))
  return {cx: sinA, cy: cosA, A}
}

function drawAngle(ax, ay, A, x, ox, y, oy) {
  var angelLen = this.angleLength
  var dx1, dy1, dx2, dy2
  var B = Math.abs(A)
  var dir = false
  if (A > 45 && A <= 90) {
    var r = Math.abs((B - 45) * Math.PI / 180)
    var cos1 = Math.abs(angelLen * Math.cos(r))
    var sin1 = Math.abs(angelLen * Math.sin(r))
    if (x > ox && y > oy) {
      dx1 = Math.round(ax - cos1)
      dy1 = Math.round(ay - sin1)
      dx2 = Math.round(ax - sin1)
      dy2 = Math.round(ay + cos1)
    } else {
      dx1 = Math.round(ax + cos1)
      dy1 = Math.round(ay + sin1)
      dx2 = Math.round(ax + sin1)
      dy2 = Math.round(ay - cos1)
    }

  } else if (A <= -45 && A >= -90) {
    var r = Math.abs((B - 45) * Math.PI / 180)
    var cos2 = Math.abs(angelLen * Math.cos(r))
    var sin2 = Math.abs(angelLen * Math.sin(r))
    if (x < ox && y > oy) {
      dx1 = Math.round(ax - sin2)
      dy1 = Math.round(ay - cos2)
      dx2 = Math.round(ax - cos2)
      dy2 = Math.round(ay + sin2)
    } else {
      dx1 = Math.round(ax + sin2)
      dy1 = Math.round(ay + cos2)
      dx2 = Math.round(ax + cos2)
      dy2 = Math.round(ay - sin2)
    }

  } else if (A > -45 && A <= 0) {
    var r = Math.abs((45 - B) * Math.PI / 180)
    var cos3 = Math.abs(angelLen * Math.cos(r))
    var sin3 = Math.abs(angelLen * Math.sin(r))
    if (x < ox && y > oy) {
      dx1 = Math.round(ax + sin3)
      dy1 = Math.round(ay - cos3)
      dx2 = Math.round(ax - cos3)
      dy2 = Math.round(ay - sin3)
    } else {
      dx1 = Math.round(ax - sin3)
      dy1 = Math.round(ay + cos3)
      dx2 = Math.round(ax + cos3)
      dy2 = Math.round(ay + sin3)
    }

  } else if (A > 0 && A <= 45) {
    var r = Math.abs((45 - B) * Math.PI / 180)
    var cos4 = Math.abs(angelLen * Math.cos(r))
    var sin4 = Math.abs(angelLen * Math.sin(r))
    if (x < ox && y < oy) {
      dx1 = Math.round(ax + cos4)
      dy1 = Math.round(ay - sin4)
      dx2 = Math.round(ax - sin4)
      dy2 = Math.round(ay - cos4)
    } else {
      dx1 = Math.round(ax - cos4)
      dy1 = Math.round(ay + sin4)
      dx2 = Math.round(ax + sin4)
      dy2 = Math.round(ay + cos4)
    }
  }
  this._ctx.beginPath()
  this._ctx.moveTo(ax, ay)
  this._ctx.lineTo(dx1, dy1)
  this._ctx.lineTo(dx2, dy2)
  this._ctx.closePath()
  this._ctx.fillStyle = '#f00'
  this._ctx.fill()
}
function drawArrow(x, y, callback) {
  var [ox, oy] = this[`_point${this.currIndex}`][0]
  var mx = Math.abs(getMiddle(x, ox))
  var my = Math.abs(getMiddle(y, oy))
  var len = this.arrowLength
  var {cx, cy, A} = calcArrow(ox, oy, x, y, len)
  // console.error('')
  var ax, ay
  if (ox < x && oy > y) {
    ax = mx - cx
    ay = my - cy
  } else if (ox < x && oy < y) {
    ax = mx + cx
    ay = my - cy
  } else if (ox > x && oy < y) {
    ax = mx + cx
    ay = my + cy
  } else {
    ax = mx - cx
    ay = my + cy
  }
  drawAngle.call(this, ax, ay, A, x, ox, y, oy)
  callback.call(this, ax, ay, mx, my)

  // callback(this, ox, oy, x, y)
  // console.error('ox, oy', ox, oy)
  // console.error('x,y', x, y)
}
PaintLine.prototype.getPoint = function () {
  return this[`_point${this.currIndex}`]
}
PaintLine.prototype.getPointList = function() {
  var r = []
  var len = this.lineNum ? this.lineNum : 1
  for (let i = 0; i < len; i++) {
    r.push(this[`_point${i + 1}`])
  }
  return r
}
PaintLine.prototype.restartPaint = function (option) {
  assertObjectType('limitPoint', option)
  this.limitPoint = emptyVal(option.limitPoint)
  this.lineNum = emptyVal(option.lineNum)
  this.fillPolygon = option.fillPolygon
  this.lineClosed = option.lineClosed
  this._direction = option.direction || false
  this.clear()
  this._onPaint = true
  this.currIndex = 1
}
PaintLine.prototype.clear = function() {
  this.clearCvs()
  this.loopLineNum(function (i) {
    this[`_point${i}`] = []
  })
  this._onPaint = false
}
PaintLine.prototype.clearCvs = function() {
  this._ctx.clearRect(0, 0, this.clientWidth, this.clientHeight)
}
PaintLine.prototype.loopLineNum = function(callback) {
  for (let i = 0; i < this.lineNum; i++) {
    callback.call(this, i + 1)
  }
}
PaintLine.prototype.iteratePoint = function(type, callback) {
  this.loopLineNum(function (i) {
    handleIteratePoint.call(this, type, callback, i)
  })
}
PaintLine.prototype._init = function (options) {
  var that = this
  initPoint.call(this, options)
  canFill.call(this, options.fillPolygon)
  initStatus.call(this, options)
  this._cvs.addEventListener('mouseup', function (e) {
    if (that._onPaint) {
      onup.call(that, e)
    }
  })
  this._cvs.addEventListener('mousemove', function (e) {
    canPaint.call(that) && that.draw(e)
  })
}
function drawArc (x, y) {
  this._ctx.beginPath()
  this._ctx.arc(x,y,5,0,2*Math.PI);
  this._ctx.fillStyle = '#f00'
  this._ctx.fill()
}
PaintLine.prototype.draw = function (e) {
  var _point = this.getPoint()
  this.clearCvs()
  var {x, y} = getPointOnCanvas(this._cvs, e.pageX, e.pageY)
  var [ox, oy] = _point[_point.length - 1]
  drawLine.call(this, ox, oy, x, y)
  if (_point.length === 1 && this._direction) {
    drawArrow.call(this, x, y, drawLine)
  }
  this.paintOld()
}
function drawLine(ox, oy, x, y) {
  this._ctx.beginPath()
  this._ctx.moveTo(ox, oy)
  this._ctx.lineTo(x, y)
  this._ctx.strokeStyle = '#f00'
  this._ctx.lineWidth = 4
  this._ctx.stroke()
}
PaintLine.prototype.paintOld = function () {
  this.iteratePoint('line', drawLine)
  this.iteratePoint('arc', drawArc)
}

export default PaintLine
