const jx = {
  install(Vue) {
    Object.keys(jx).forEach(key => {
      if (key !== 'install') {
        Vue.prototype[`$${key}`] = jx[key]
      }
    })
  },
  // 判断是否为对象
  isObj(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  },
  // 判断是否为数组
  isArr(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
  },
  /**
   *  函数防抖
   *  param fnName  函数名
   *  param time  延迟时间
   *  return: 处理后的执行函数
   */
  vueDebounce(fnName, time) {
    let timeout = null
    return function() {
      const _arguments = arguments
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        timeout = null
        this[fnName].apply(this, _arguments)
      }, time)
    }
  },
  // 判读是否为空对象
  isEmptyObject(obj) {
    for (const key in obj) {
      return false
    }
    return true
  },
  // 字符串首字符转为大写
  firstToUpper(str) {
    if (str.length) {
      return str.replace(str[0], str[0].toUpperCase())
    }
    return str
  },
  //百分比转浮点
  percentToFloat(percentage) {
    // 去除百分号并转换为数字
    return parseFloat(percentage) / 100;
  },
  //浮点转百分比
  floatToPercent(float) {
    // 将结果转换回百分比形式
    return (float * 100).toFixed(2) + '%'; // toFixed(2) 可选，用于控制小数点后的位数
  },
  //日期往后推算
  getNextDate(date, day = 1, format = "{y}-{m}-{d}") {
    if (date) {
      //处理传入年月日格式 例如 date = 2022年07月12日
      date = date.match(/\d+/g).join("-");
      //方式二处理传入年月日格式 (需要针对是否是年月日格式判断)
      //date = date.replace(/[年月日]/g, "-").slice(0, -1);
      //方式三处理传入年月日格式
      //date = date.replace(/[年月]/g, "-").replace("日", "");
      // console.log(date, "date"); // 2022-07-12
      const nDate = new Date(date);
      nDate.setDate(nDate.getDate() + day);

      const formatObj = {
        y: nDate.getFullYear(),
        m: nDate.getMonth() + 1,
        d: nDate.getDate(),
      };
      return format.replace(/{([ymd])+}/g, (result, key) => {
        const value = formatObj[key];
        return value.toString().padStart(2, "0");
      });
    } else {
      console.log("date为空或格式不正确");
    }
  }
}
export default jx

//分组
export const groupBy = (list, fn) => {
  const groups = {};
  list.forEach(function (o) {
    const group = JSON.stringify(fn(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return groups;
}
