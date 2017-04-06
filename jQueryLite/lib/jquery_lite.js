/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);

function $l (selector) {
  let elementArray = [];
  if (selector instanceof Function) {
    const funcArray = [];
    document.addEventListener("DOMContentLoaded", function(event) {
      funcArray.forEach((el) => el());
    });
    funcArray.push(selector);
  } else if (selector instanceof HTMLElement) {
    elementArray = [selector];
  } else {
    let elementList = document.querySelectorAll(selector);
    for (let i = 0; i < elementList.length; i++) {
      elementArray.push(elementList[i]);
    }
  }

  // this.extend = function () {
  //   console.log('extend');
  // };

  return new DOMNodeCollection(elementArray);
}

$l.extend = function(...objs) {
  return Object.assign(...objs);
};

$l.ajax = function(options) {
  let defaults = {
    url: window.location.href,
    method: 'GET',
    dataType: 'JSON',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    async: true,
    converters: {"* text": window.String, "text html": true, "text json": jQuery.parseJSON, "text xml": jQuery.parseXML},
    global: true,
    headers: {},
    ifModified: false,
    processData: true,
    statusCode: {},
    success: (data) => data,
    error: (error) => error
  };

  let mergedOptions = this.extend(defaults, options);

  const xhr = new XMLHttpRequest();
  xhr.open(mergedOptions.method, mergedOptions.url);
  xhr.onload = function () {
    console.log(xhr.status);
    console.log(xhr.responseType);
    console.log(xhr.response);

    if (xhr.status === 200) {
      mergedOptions.success(JSON.parse(xhr.response));
    } else {
      mergedOptions.error(xhr.response);
    }
  };

  xhr.send(mergedOptions);
};

window.$l = $l;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DOMNodeCollection {
  constructor(htmlElements) {
    this.htmlElements = htmlElements;
  }

  html(htmlString) {
    if (htmlString !== undefined) {
      this.each((el) => {
        el.innerHTML = htmlString;
      });
      return this.htmlElements;
    }
    return this.htmlElements[0].innerHTML;
  }

  empty() {
    this.html('');
  }

  each(callback) {
    this.htmlElements.forEach((el) => {
      callback(el);
    });
    return this.htmlElements;
  }

  append(argument) {
    if (argument instanceof DOMNodeCollection) {
      argument.each((arg) => {
        this.each((el) => {
          el.innerHTML += arg.outerHTML;
        });
      });
    } else {
      this.each((el) => {
        el.innerHTML += argument.outerHTML;
      });
    }
  }

  attr(attrName, attrValue) {
    if (attrValue === undefined) {
      return this.htmlElements[0].getAttribute(attrName);
    } else {
      return this.each((el) => {
        el.setAttribute(attrName, attrValue);
      });
    }
  }

  addClass(...classNames) {
    this.each((el) => {
      el.classList.add(...classNames);
    });
  }

  removeClass(...className) {
    this.each((el) => {
      el.classList.remove(...className);
      if (el.classList.length === 0) {
        el.removeAttribute('class');
      }
    });
  }

  children() {
    let array = [];
    this.each((el) => {
      if (el.children.length === 0) {
        return new DOMNodeCollection(el);
      } else {
        for (let i = 0; i < el.children.length; i++) {
          array.push(el.children[i]);
        }
      }
    });

    return new DOMNodeCollection(array);
  }

  parent() {
    let parents = [];
    this.each((el) => {
      parents.push(el.parentElement);
    });

    return new DOMNodeCollection(parents);
  }

  find(selector) {
    let array = [];
    this.each((el) => {
      let found = el.querySelectorAll(selector);
      for (let i = 0; i < found.length; i++) {
        array.push(found[i]);
      }
    });
    return new DOMNodeCollection(array);
  }

  remove() {
    this.each((el) => {
      el.remove();
    });
    this.htmlElements = [];
  }

  on(domEvent, callback) {
    this.each((el) => {
      el.attr('callback', callback);
      el.addEventListener(domEvent, callback);
    });
  }

  off(domEvent) {
    this.each((el) => {
      el.removeEventListener(domEvent, el.attr('callback'));
    });
  }
}

module.exports = DOMNodeCollection;


/***/ })
/******/ ]);