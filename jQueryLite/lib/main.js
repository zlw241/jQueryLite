const DOMNodeCollection = require('./dom_node_collection.js');

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
