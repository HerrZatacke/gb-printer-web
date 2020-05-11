/* eslint-disable */
function noop() {}

export default function (url, opts) {
  opts = opts || {};

  var ws, num=0, timer=1, $={}, _url = url;
  var max = opts.maxAttempts || Infinity;

  $.open = function () {
    try {
      ws = new WebSocket(_url, opts.protocols || []);
    } catch (e) {
      (opts.onstatechange || noop)(WebSocket.CLOSED);
      (opts.onerror || noop)(e);
      return;
    }

    (opts.onstatechange || noop)(ws.readyState);

    ws.onmessage = opts.onmessage || noop;

    ws.onopen = function (e) {
      (opts.onopen || noop)(e);
      (opts.onstatechange || noop)(ws.readyState);
      num = 0;
    };

    ws.onclose = function (e) {
      e.code === 1e3 || e.code === 1001 || e.code === 1005 || $.reconnect(e);
      (opts.onclose || noop)(e);
      (opts.onstatechange || noop)(ws.readyState);
    };

    ws.onerror = function (e) {
      (e && e.code==='ECONNREFUSED') ? $.reconnect(e) : (opts.onerror || noop)(e);
      (opts.onstatechange || noop)(ws.readyState);
    };
  };

  $.reconnect = function (e) {
    if (timer && num++ < max) {
      timer = setTimeout(function () {
        (opts.onreconnect || noop)(e);
        (opts.onstatechange || noop)(ws.readyState);
        $.open();
      }, opts.timeout || 1e3);
    } else {
      (opts.onmaximum || noop)(e);
      (opts.onstatechange || noop)(ws.readyState);
    }
  };

  $.json = function (x) {
    ws.send(JSON.stringify(x));
  };

  $.send = function (x) {
    ws.send(x);
  };

  $.close = function (x, y) {
    timer = clearTimeout(timer);
    ws.close(x || 1e3, y);
    (opts.onstatechange || noop)(ws.readyState);
  };

  $.setUrl = function(url) {
    _url = url;
    $.close();
    $.open();
  };

  $.open(); // init

  return $;
}
