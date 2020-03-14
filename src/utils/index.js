let tpyeString = { 
  Array: '[object Array]',
  Object: '[object Object]',
  String: '[object String]',
  Number: '[object Number]',
  Null: '[object Null]',
  Undefined: '[object Undefined]',
  Symbol: '[object Symbol]'
};

function TypeChecker (type, value) {
  if (tpyeString[type]) {
    return ({}).toString.call(value) === tpyeString[type];
  } else {
    console.warn('argument 1 is unidentifiable');
    return false;
  }
}

function formatTime (timestamp) {
  let res = '';
  if (TypeChecker('Number', +timestamp)) {
    if (Math.floor(timestamp / 60) < 1) {
      res = '00:00:' + getNumStr(timestamp);
    } else if (Math.floor(timestamp / 3600) < 1) {
      res = '00:' + getNumStr(timestamp / 60) + ':' + getNumStr(timestamp % 60);
    } else {
      let hour = getNumStr(timestamp / 60 / 60);
      let minute = getNumStr((timestamp - hour * 3600) / 60);
      let second = getNumStr(timestamp - hour * 3600 - minute * 60);
      res = hour + ':' + minute + ':' + second;
    }
  }

  function getNumStr (num) {
    let str = '0' + Math.floor(num);
    let len = str.length;
    if (len > 2) {
      return str.slice(1);
    } else {
      return str;
    }
  }

  return res;
}

export default {
  TypeChecker,
  formatTime
};
