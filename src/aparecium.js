// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"A6Qc":[function(require,module,exports) {
var define;
(function(root, factory) {

    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.SimpleLightbox = factory();
    }

}(this, function() {

    function assign(target) {

        for (var i = 1; i < arguments.length; i++) {

            var obj = arguments[i];

            if (obj) {
                for (var key in obj) {
                    obj.hasOwnProperty(key) && (target[key] = obj[key]);
                }
            }

        }

        return target;

    }

    function addClass(element, className) {

        if (element && className) {
            element.className += ' ' + className;
        }

    }

    function removeClass(element, className) {

        if (element && className) {
            element.className = element.className.replace(
                new RegExp('(\\s|^)' + className + '(\\s|$)'), ' '
            ).trim();
        }

    }

    function parseHtml(html) {

        var div = document.createElement('div');
        div.innerHTML = html.trim();

        return div.childNodes[0];

    }

    function matches(el, selector) {

        return (el.matches || el.matchesSelector || el.msMatchesSelector).call(el, selector);

    }

    function getWindowHeight() {

        return 'innerHeight' in window
            ? window.innerHeight
            : document.documentElement.offsetHeight;

    }

    function SimpleLightbox(options) {

        this.init.apply(this, arguments);

    }

    SimpleLightbox.defaults = {

        // add custom classes to lightbox elements
        elementClass: '',
        elementLoadingClass: 'slbLoading',
        htmlClass: 'slbActive',
        closeBtnClass: '',
        nextBtnClass: '',
        prevBtnClass: '',
        loadingTextClass: '',

        // customize / localize controls captions
        closeBtnCaption: 'Close',
        nextBtnCaption: 'Next',
        prevBtnCaption: 'Previous',
        loadingCaption: 'Loading...',

        bindToItems: true, // set click event handler to trigger lightbox on provided $items
        closeOnOverlayClick: true,
        closeOnEscapeKey: true,
        nextOnImageClick: true,
        showCaptions: true,

        captionAttribute: 'title', // choose data source for library to glean image caption from
        urlAttribute: 'href', // where to expect large image

        startAt: 0, // start gallery at custom index
        loadingTimeout: 100, // time after loading element will appear

        appendTarget: 'body', // append elsewhere if needed

        beforeSetContent: null, // convenient hooks for extending library behavoiur
        beforeClose: null,
        afterClose: null,
        beforeDestroy: null,
        afterDestroy: null,

        videoRegex: new RegExp(/youtube.com|vimeo.com/) // regex which tests load url for iframe content

    };

    assign(SimpleLightbox.prototype, {

        init: function(options) {

            options = this.options = assign({}, SimpleLightbox.defaults, options);

            var self = this;
            var elements;

            if (options.$items) {
                elements = options.$items.get();
            }

            if (options.elements) {
                elements = [].slice.call(
                    typeof options.elements === 'string'
                        ? document.querySelectorAll(options.elements)
                        : options.elements
                );
            }

            this.eventRegistry = {lightbox: [], thumbnails: []};
            this.items = [];
            this.captions = [];

            if (elements) {

                elements.forEach(function(element, index) {

                    self.items.push(element.getAttribute(options.urlAttribute));
                    self.captions.push(element.getAttribute(options.captionAttribute));

                    if (options.bindToItems) {

                        self.addEvent(element, 'click', function(e) {

                            e.preventDefault();
                            self.showPosition(index);

                        }, 'thumbnails');

                    }

                });

            }

            if (options.items) {
                this.items = options.items;
            }

            if (options.captions) {
                this.captions = options.captions;
            }

        },

        addEvent: function(element, eventName, callback, scope) {

            this.eventRegistry[scope || 'lightbox'].push({
                element: element,
                eventName: eventName,
                callback: callback
            });

            element.addEventListener(eventName, callback);

            return this;

        },

        removeEvents: function(scope) {

            this.eventRegistry[scope].forEach(function(item) {
                item.element.removeEventListener(item.eventName, item.callback);
            });

            this.eventRegistry[scope] = [];

            return this;

        },

        next: function() {

            return this.showPosition(this.currentPosition + 1);

        },

        prev: function() {

            return this.showPosition(this.currentPosition - 1);

        },

        normalizePosition: function(position) {

            if (position >= this.items.length) {
                position = 0;
            } else if (position < 0) {
                position = this.items.length - 1;
            }

            return position;

        },

        showPosition: function(position) {

            var newPosition = this.normalizePosition(position);

            if (typeof this.currentPosition !== 'undefined') {
                this.direction = newPosition > this.currentPosition ? 'next' : 'prev';
            }

            this.currentPosition = newPosition;

            return this.setupLightboxHtml()
                .prepareItem(this.currentPosition, this.setContent)
                .show();

        },

        loading: function(on) {

            var self = this;
            var options = this.options;

            if (on) {

                this.loadingTimeout = setTimeout(function() {

                    addClass(self.$el, options.elementLoadingClass);

                    self.$content.innerHTML =
                        '<p class="slbLoadingText ' + options.loadingTextClass + '">' +
                            options.loadingCaption +
                        '</p>';
                    self.show();

                }, options.loadingTimeout);

            } else {

                removeClass(this.$el, options.elementLoadingClass);
                clearTimeout(this.loadingTimeout);

            }

        },

        prepareItem: function(position, callback) {

            var self = this;
            var url = this.items[position];

            this.loading(true);

            if (this.options.videoRegex.test(url)) {

                callback.call(self, parseHtml(
                    '<div class="slbIframeCont"><iframe class="slbIframe" frameborder="0" allowfullscreen src="' + url + '"></iframe></div>')
                );

            } else {

                var $imageCont = parseHtml(
                    '<div class="slbImageWrap"><img class="slbImage" src="' + url + '" /></div>'
                );

                this.$currentImage = $imageCont.querySelector('.slbImage');

                if (this.options.showCaptions && this.captions[position]) {
                    $imageCont.appendChild(parseHtml(
                        '<div class="slbCaption">' + this.captions[position] + '</div>')
                    );
                }

                this.loadImage(url, function() {

                    self.setImageDimensions();

                    callback.call(self, $imageCont);

                    self.loadImage(self.items[self.normalizePosition(self.currentPosition + 1)]);

                });

            }

            return this;

        },

        loadImage: function(url, callback) {

            if (!this.options.videoRegex.test(url)) {

                var image = new Image();
                callback && (image.onload = callback);
                image.src = url;

            }

        },

        setupLightboxHtml: function() {

            var o = this.options;

            if (!this.$el) {

                this.$el = parseHtml(
                    '<div class="slbElement ' + o.elementClass + '">' +
                        '<div class="slbOverlay"></div>' +
                        '<div class="slbWrapOuter">' +
                            '<div class="slbWrap">' +
                                '<div class="slbContentOuter">' +
                                    '<div class="slbContent"></div>' +
                                    '<button type="button" title="' + o.closeBtnCaption + '" class="slbCloseBtn ' + o.closeBtnClass + '">×</button>' +
                                    (this.items.length > 1
                                        ? '<div class="slbArrows">' +
                                             '<button type="button" title="' + o.prevBtnCaption + '" class="prev slbArrow' + o.prevBtnClass + '">' + o.prevBtnCaption + '</button>' +
                                             '<button type="button" title="' + o.nextBtnCaption + '" class="next slbArrow' + o.nextBtnClass + '">' + o.nextBtnCaption + '</button>' +
                                          '</div>'
                                        : ''
                                    ) +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
                );

                this.$content = this.$el.querySelector('.slbContent');

            }

            this.$content.innerHTML = '';

            return this;

        },

        show: function() {

            if (!this.modalInDom) {

                document.querySelector(this.options.appendTarget).appendChild(this.$el);
                addClass(document.documentElement, this.options.htmlClass);
                this.setupLightboxEvents();
                this.modalInDom = true;

            }

            return this;

        },

        setContent: function(content) {

            var $content = typeof content === 'string'
                ? parseHtml(content)
                : content
            ;

            this.loading(false);

            this.setupLightboxHtml();

            removeClass(this.$content, 'slbDirectionNext');
            removeClass(this.$content, 'slbDirectionPrev');

            if (this.direction) {
                addClass(this.$content, this.direction === 'next'
                    ? 'slbDirectionNext'
                    : 'slbDirectionPrev'
                );
            }

            if (this.options.beforeSetContent) {
                this.options.beforeSetContent($content, this);
            }

            this.$content.appendChild($content);

            return this;

        },

        setImageDimensions: function() {

            if (this.$currentImage) {
                this.$currentImage.style.maxHeight = getWindowHeight() + 'px';
            }

        },

        setupLightboxEvents: function() {

            var self = this;

            if (this.eventRegistry.lightbox.length) {
                return this;
            }

            this.addEvent(this.$el, 'click', function(e) {

                var $target = e.target;

                if (matches($target, '.slbCloseBtn') || (self.options.closeOnOverlayClick && matches($target, '.slbWrap'))) {

                    self.close();

                } else if (matches($target, '.slbArrow')) {

                    matches($target, '.next') ? self.next() : self.prev();

                } else if (self.options.nextOnImageClick && self.items.length > 1 && matches($target, '.slbImage')) {

                    self.next();

                }

            }).addEvent(document, 'keyup', function(e) {

                self.options.closeOnEscapeKey && e.keyCode === 27 && self.close();

                if (self.items.length > 1) {
                    (e.keyCode === 39 || e.keyCode === 68) && self.next();
                    (e.keyCode === 37 || e.keyCode === 65) && self.prev();
                }

            }).addEvent(window, 'resize', function() {

                self.setImageDimensions();

            });

            return this;

        },

        close: function() {

            if (this.modalInDom) {

                this.runHook('beforeClose');
                this.removeEvents('lightbox');
                this.$el && this.$el.parentNode.removeChild(this.$el);
                removeClass(document.documentElement, this.options.htmlClass);
                this.modalInDom = false;
                this.runHook('afterClose');

            }

            this.direction = undefined;
            this.currentPosition = this.options.startAt;

        },

        destroy: function() {

            this.close();
            this.runHook('beforeDestroy');
            this.removeEvents('thumbnails');
            this.runHook('afterDestroy');

        },

        runHook: function(name) {

            this.options[name] && this.options[name](this);

        }

    });

    SimpleLightbox.open = function(options) {

        var instance = new SimpleLightbox(options);

        return options.content
            ? instance.setContent(options.content).show()
            : instance.showPosition(instance.options.startAt);

    };

    SimpleLightbox.registerAsJqueryPlugin = function($) {

        $.fn.simpleLightbox = function(options) {

            var lightboxInstance;
            var $items = this;

            return this.each(function() {
                if (!$.data(this, 'simpleLightbox')) {
                    lightboxInstance = lightboxInstance || new SimpleLightbox($.extend({}, options, {$items: $items}));
                    $.data(this, 'simpleLightbox', lightboxInstance);
                }
            });

        };

        $.SimpleLightbox = SimpleLightbox;

    };

    if (typeof window !== 'undefined' && window.jQuery) {
        SimpleLightbox.registerAsJqueryPlugin(window.jQuery);
    }

    return SimpleLightbox;

}));

},{}],"Tnu0":[function(require,module,exports) {

},{}],"OvzY":[function(require,module,exports) {
/*globals jQuery,Window,HTMLElement,HTMLDocument,HTMLCollection,NodeList,MutationObserver */
/*exported Arrive*/
/*jshint latedef:false */

/*
 * arrive.js
 * v2.4.1
 * https://github.com/uzairfarooq/arrive
 * MIT licensed
 *
 * Copyright (c) 2014-2017 Uzair Farooq
 */
var Arrive = (function(window, $, undefined) {

  "use strict";

  if(!window.MutationObserver || typeof HTMLElement === 'undefined'){
    return; //for unsupported browsers
  }

  var arriveUniqueId = 0;

  var utils = (function() {
    var matches = HTMLElement.prototype.matches || HTMLElement.prototype.webkitMatchesSelector || HTMLElement.prototype.mozMatchesSelector
                  || HTMLElement.prototype.msMatchesSelector;

    return {
      matchesSelector: function(elem, selector) {
        return elem instanceof HTMLElement && matches.call(elem, selector);
      },
      // to enable function overloading - By John Resig (MIT Licensed)
      addMethod: function (object, name, fn) {
        var old = object[ name ];
        object[ name ] = function(){
          if ( fn.length == arguments.length ) {
            return fn.apply( this, arguments );
          }
          else if ( typeof old == 'function' ) {
            return old.apply( this, arguments );
          }
        };
      },
      callCallbacks: function(callbacksToBeCalled, registrationData) {
        if (registrationData && registrationData.options.onceOnly && registrationData.firedElems.length == 1) {
          // as onlyOnce param is true, make sure we fire the event for only one item
          callbacksToBeCalled = [callbacksToBeCalled[0]];
        }

        for (var i = 0, cb; (cb = callbacksToBeCalled[i]); i++) {
          if (cb && cb.callback) {
            cb.callback.call(cb.elem, cb.elem);
          }
        }

        if (registrationData && registrationData.options.onceOnly && registrationData.firedElems.length == 1) {
          // unbind event after first callback as onceOnly is true.
          registrationData.me.unbindEventWithSelectorAndCallback.call(
            registrationData.target, registrationData.selector, registrationData.callback);
        }
      },
      // traverse through all descendants of a node to check if event should be fired for any descendant
      checkChildNodesRecursively: function(nodes, registrationData, matchFunc, callbacksToBeCalled) {
        // check each new node if it matches the selector
        for (var i=0, node; (node = nodes[i]); i++) {
          if (matchFunc(node, registrationData, callbacksToBeCalled)) {
            callbacksToBeCalled.push({ callback: registrationData.callback, elem: node });
          }

          if (node.childNodes.length > 0) {
            utils.checkChildNodesRecursively(node.childNodes, registrationData, matchFunc, callbacksToBeCalled);
          }
        }
      },
      mergeArrays: function(firstArr, secondArr){
        // Overwrites default options with user-defined options.
        var options = {},
            attrName;
        for (attrName in firstArr) {
          if (firstArr.hasOwnProperty(attrName)) {
            options[attrName] = firstArr[attrName];
          }
        }
        for (attrName in secondArr) {
          if (secondArr.hasOwnProperty(attrName)) {
            options[attrName] = secondArr[attrName];
          }
        }
        return options;
      },
      toElementsArray: function (elements) {
        // check if object is an array (or array like object)
        // Note: window object has .length property but it's not array of elements so don't consider it an array
        if (typeof elements !== "undefined" && (typeof elements.length !== "number" || elements === window)) {
          elements = [elements];
        }
        return elements;
      }
    };
  })();


  // Class to maintain state of all registered events of a single type
  var EventsBucket = (function() {
    var EventsBucket = function() {
      // holds all the events

      this._eventsBucket    = [];
      // function to be called while adding an event, the function should do the event initialization/registration
      this._beforeAdding    = null;
      // function to be called while removing an event, the function should do the event destruction
      this._beforeRemoving  = null;
    };

    EventsBucket.prototype.addEvent = function(target, selector, options, callback) {
      var newEvent = {
        target:             target,
        selector:           selector,
        options:            options,
        callback:           callback,
        firedElems:         []
      };

      if (this._beforeAdding) {
        this._beforeAdding(newEvent);
      }

      this._eventsBucket.push(newEvent);
      return newEvent;
    };

    EventsBucket.prototype.removeEvent = function(compareFunction) {
      for (var i=this._eventsBucket.length - 1, registeredEvent; (registeredEvent = this._eventsBucket[i]); i--) {
        if (compareFunction(registeredEvent)) {
          if (this._beforeRemoving) {
              this._beforeRemoving(registeredEvent);
          }

          // mark callback as null so that even if an event mutation was already triggered it does not call callback
          var removedEvents = this._eventsBucket.splice(i, 1);
          if (removedEvents && removedEvents.length) {
            removedEvents[0].callback = null;
          }
        }
      }
    };

    EventsBucket.prototype.beforeAdding = function(beforeAdding) {
      this._beforeAdding = beforeAdding;
    };

    EventsBucket.prototype.beforeRemoving = function(beforeRemoving) {
      this._beforeRemoving = beforeRemoving;
    };

    return EventsBucket;
  })();


  /**
   * @constructor
   * General class for binding/unbinding arrive and leave events
   */
  var MutationEvents = function(getObserverConfig, onMutation) {
    var eventsBucket    = new EventsBucket(),
        me              = this;

    var defaultOptions = {
      fireOnAttributesModification: false
    };

    // actual event registration before adding it to bucket
    eventsBucket.beforeAdding(function(registrationData) {
      var
        target    = registrationData.target,
        observer;

      // mutation observer does not work on window or document
      if (target === window.document || target === window) {
        target = document.getElementsByTagName("html")[0];
      }

      // Create an observer instance
      observer = new MutationObserver(function(e) {
        onMutation.call(this, e, registrationData);
      });

      var config = getObserverConfig(registrationData.options);

      observer.observe(target, config);

      registrationData.observer = observer;
      registrationData.me = me;
    });

    // cleanup/unregister before removing an event
    eventsBucket.beforeRemoving(function (eventData) {
      eventData.observer.disconnect();
    });

    this.bindEvent = function(selector, options, callback) {
      options = utils.mergeArrays(defaultOptions, options);

      var elements = utils.toElementsArray(this);

      for (var i = 0; i < elements.length; i++) {
        eventsBucket.addEvent(elements[i], selector, options, callback);
      }
    };

    this.unbindEvent = function() {
      var elements = utils.toElementsArray(this);
      eventsBucket.removeEvent(function(eventObj) {
        for (var i = 0; i < elements.length; i++) {
          if (this === undefined || eventObj.target === elements[i]) {
            return true;
          }
        }
        return false;
      });
    };

    this.unbindEventWithSelectorOrCallback = function(selector) {
      var elements = utils.toElementsArray(this),
          callback = selector,
          compareFunction;

      if (typeof selector === "function") {
        compareFunction = function(eventObj) {
          for (var i = 0; i < elements.length; i++) {
            if ((this === undefined || eventObj.target === elements[i]) && eventObj.callback === callback) {
              return true;
            }
          }
          return false;
        };
      }
      else {
        compareFunction = function(eventObj) {
          for (var i = 0; i < elements.length; i++) {
            if ((this === undefined || eventObj.target === elements[i]) && eventObj.selector === selector) {
              return true;
            }
          }
          return false;
        };
      }
      eventsBucket.removeEvent(compareFunction);
    };

    this.unbindEventWithSelectorAndCallback = function(selector, callback) {
      var elements = utils.toElementsArray(this);
      eventsBucket.removeEvent(function(eventObj) {
          for (var i = 0; i < elements.length; i++) {
            if ((this === undefined || eventObj.target === elements[i]) && eventObj.selector === selector && eventObj.callback === callback) {
              return true;
            }
          }
          return false;
      });
    };

    return this;
  };


  /**
   * @constructor
   * Processes 'arrive' events
   */
  var ArriveEvents = function() {
    // Default options for 'arrive' event
    var arriveDefaultOptions = {
      fireOnAttributesModification: false,
      onceOnly: false,
      existing: false
    };

    function getArriveObserverConfig(options) {
      var config = {
        attributes: false,
        childList: true,
        subtree: true
      };

      if (options.fireOnAttributesModification) {
        config.attributes = true;
      }

      return config;
    }

    function onArriveMutation(mutations, registrationData) {
      mutations.forEach(function( mutation ) {
        var newNodes    = mutation.addedNodes,
            targetNode = mutation.target,
            callbacksToBeCalled = [],
            node;

        // If new nodes are added
        if( newNodes !== null && newNodes.length > 0 ) {
          utils.checkChildNodesRecursively(newNodes, registrationData, nodeMatchFunc, callbacksToBeCalled);
        }
        else if (mutation.type === "attributes") {
          if (nodeMatchFunc(targetNode, registrationData, callbacksToBeCalled)) {
            callbacksToBeCalled.push({ callback: registrationData.callback, elem: targetNode });
          }
        }

        utils.callCallbacks(callbacksToBeCalled, registrationData);
      });
    }

    function nodeMatchFunc(node, registrationData, callbacksToBeCalled) {
      // check a single node to see if it matches the selector
      if (utils.matchesSelector(node, registrationData.selector)) {
        if(node._id === undefined) {
          node._id = arriveUniqueId++;
        }
        // make sure the arrive event is not already fired for the element
        if (registrationData.firedElems.indexOf(node._id) == -1) {
          registrationData.firedElems.push(node._id);

          return true;
        }
      }

      return false;
    }

    arriveEvents = new MutationEvents(getArriveObserverConfig, onArriveMutation);

    var mutationBindEvent = arriveEvents.bindEvent;

    // override bindEvent function
    arriveEvents.bindEvent = function(selector, options, callback) {

      if (typeof callback === "undefined") {
        callback = options;
        options = arriveDefaultOptions;
      } else {
        options = utils.mergeArrays(arriveDefaultOptions, options);
      }

      var elements = utils.toElementsArray(this);

      if (options.existing) {
        var existing = [];

        for (var i = 0; i < elements.length; i++) {
          var nodes = elements[i].querySelectorAll(selector);
          for (var j = 0; j < nodes.length; j++) {
            existing.push({ callback: callback, elem: nodes[j] });
          }
        }

        // no need to bind event if the callback has to be fired only once and we have already found the element
        if (options.onceOnly && existing.length) {
          return callback.call(existing[0].elem, existing[0].elem);
        }

        setTimeout(utils.callCallbacks, 1, existing);
      }

      mutationBindEvent.call(this, selector, options, callback);
    };

    return arriveEvents;
  };


  /**
   * @constructor
   * Processes 'leave' events
   */
  var LeaveEvents = function() {
    // Default options for 'leave' event
    var leaveDefaultOptions = {};

    function getLeaveObserverConfig() {
      var config = {
        childList: true,
        subtree: true
      };

      return config;
    }

    function onLeaveMutation(mutations, registrationData) {
      mutations.forEach(function( mutation ) {
        var removedNodes  = mutation.removedNodes,
            callbacksToBeCalled = [];

        if( removedNodes !== null && removedNodes.length > 0 ) {
          utils.checkChildNodesRecursively(removedNodes, registrationData, nodeMatchFunc, callbacksToBeCalled);
        }

        utils.callCallbacks(callbacksToBeCalled, registrationData);
      });
    }

    function nodeMatchFunc(node, registrationData) {
      return utils.matchesSelector(node, registrationData.selector);
    }

    leaveEvents = new MutationEvents(getLeaveObserverConfig, onLeaveMutation);

    var mutationBindEvent = leaveEvents.bindEvent;

    // override bindEvent function
    leaveEvents.bindEvent = function(selector, options, callback) {

      if (typeof callback === "undefined") {
        callback = options;
        options = leaveDefaultOptions;
      } else {
        options = utils.mergeArrays(leaveDefaultOptions, options);
      }

      mutationBindEvent.call(this, selector, options, callback);
    };

    return leaveEvents;
  };


  var arriveEvents = new ArriveEvents(),
      leaveEvents  = new LeaveEvents();

  function exposeUnbindApi(eventObj, exposeTo, funcName) {
    // expose unbind function with function overriding
    utils.addMethod(exposeTo, funcName, eventObj.unbindEvent);
    utils.addMethod(exposeTo, funcName, eventObj.unbindEventWithSelectorOrCallback);
    utils.addMethod(exposeTo, funcName, eventObj.unbindEventWithSelectorAndCallback);
  }

  /*** expose APIs ***/
  function exposeApi(exposeTo) {
    exposeTo.arrive = arriveEvents.bindEvent;
    exposeUnbindApi(arriveEvents, exposeTo, "unbindArrive");

    exposeTo.leave = leaveEvents.bindEvent;
    exposeUnbindApi(leaveEvents, exposeTo, "unbindLeave");
  }

  if ($) {
    exposeApi($.fn);
  }
  exposeApi(HTMLElement.prototype);
  exposeApi(NodeList.prototype);
  exposeApi(HTMLCollection.prototype);
  exposeApi(HTMLDocument.prototype);
  exposeApi(Window.prototype);

  var Arrive = {};
  // expose functions to unbind all arrive/leave events
  exposeUnbindApi(arriveEvents, Arrive, "unbindAllArrive");
  exposeUnbindApi(leaveEvents, Arrive, "unbindAllLeave");

  return Arrive;

})(window, typeof jQuery === 'undefined' ? null : jQuery, undefined);
},{}],"Focm":[function(require,module,exports) {
// https://dbrekalo.github.io/simpleLightbox/
var SimpleLightbox = require('simple-lightbox'); // CSS


require('./styles.css');

require('../node_modules/simple-lightbox/dist/simpleLightbox.min.css');

var scormContentSelector = 'iframe#ScormContent';
var accessibleContentSelector = '.cp-accessibility'; // Wait on the ScormContent frame

require('arrive');

document.arrive(scormContentSelector, {
  fireOnAttributesModification: true
}, function () {
  document.unbindArrive();
  addButton(this);
}); // Convert a <p> to a <span> and return outer HTML string

var pToSpanHTML = function pToSpanHTML(p) {
  var elem = document.createElement('span');
  elem.innerHTML = p.innerHTML;
  return elem.outerHTML;
}; // Text will be hidden in the DOM in <div>s with the cp-accessibility class


function findAccessible(doc) {
  var nodes = doc.querySelectorAll(accessibleContentSelector);

  if (!nodes) {
    return;
  }

  console.log('nodes', nodes);
  var accessibleElements = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      node = _step.value;
      // Remove navigation text nodes
      if (node.innerText.trim() === 'Skip to Main Content') continue;
      if (node.innerText.trim() === 'Trigger this button to go to the next slide') continue;
      if (node.innerText.trim() === 'Trigger this button to go to the previous slide') continue;
      if (node.innerText.trim() === 'Trigger this button to exit') continue; // Grab everything inside a DIV container

      if (node.nodeName === 'DIV') {
        accessibleElements.push(node.innerHTML);
      } // Turn <p> into <span> so we connect text that's actually meant to be a single paragraph.
      else if (node.nodeName === 'P') {
          accessibleElements.push(pToSpanHTML(node));
        } // Use the accessible node itself, (e.g., <a>)
        else {
            accessibleElements.push(node.outerHTML);
          }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return accessibleElements;
} // Deal with End-Of-Text (ETX, 0x03), which seems to signal the start of a bullet


var cleanETX = function cleanETX(elem) {
  return elem.replace(/\x03\s*/g, '<br>');
}; // Ignore things like <p> </p>


var cleanEmpty = function cleanEmpty(elem) {
  return elem.replace(/^<[^>]+>\s+<\/[^>]+>$/, '');
};

function wrapDiv(div) {
  var wrapper = document.createElement('div');
  wrapper.classList.add('aparecium-wrapper');
  wrapper.appendChild(div);
  return wrapper;
}

function addButton(frame) {
  var button = document.createElement('button');
  button.id = 'aparecium-button'; // Include Unicode Sparkles - https://graphemica.com/✨

  button.innerHTML = '&#10024; Aparecium';

  button.onclick = function () {
    var elems = findAccessible(frame.contentDocument);

    if (!elems) {
      return;
    }

    console.log('Aparecium', elems);
    var div = document.createElement('div');
    div.classList.add('aparecium-text'); // Process and insert all relevant accessible text elements

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = elems[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        elem = _step2.value;
        // Deal with End-Of-Text (ETX, 0x03), which seems to signal the start of a bullet
        elem = cleanETX(elem); // Remove empty elements

        elem = cleanEmpty(elem);
        div.innerHTML += elem;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    console.log('html', div.outerHTML);
    SimpleLightbox.open({
      content: wrapDiv(div).outerHTML,
      elementClass: 'slbContentEl'
    });
  };

  document.body.appendChild(button);
}
},{"simple-lightbox":"A6Qc","./styles.css":"Tnu0","../node_modules/simple-lightbox/dist/simpleLightbox.min.css":"Tnu0","arrive":"OvzY"}]},{},["Focm"], null)