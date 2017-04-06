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
