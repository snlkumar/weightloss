/*!
 * jQuery JavaScript Library v1.6.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu May 12 15:04:36 2011 -0400
 */

(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
  navigator = window.navigator,
  location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
    // The jQuery object is actually just the init constructor 'enhanced'
    return new jQuery.fn.init( selector, context, rootjQuery );
  },

  // Map over jQuery in case of overwrite
  _jQuery = window.jQuery,

  // Map over the $ in case of overwrite
  _$ = window.$,

  // A central reference to the root jQuery(document)
  rootjQuery,

  // A simple way to check for HTML strings or ID strings
  // (both of which we optimize for)
  quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

  // Check if a string has a non-whitespace character in it
  rnotwhite = /\S/,

  // Used for trimming whitespace
  trimLeft = /^\s+/,
  trimRight = /\s+$/,

  // Check for digits
  rdigit = /\d/,

  // Match a standalone tag
  rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

  // JSON RegExp
  rvalidchars = /^[\],:{}\s]*$/,
  rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
  rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
  rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

  // Useragent RegExp
  rwebkit = /(webkit)[ \/]([\w.]+)/,
  ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
  rmsie = /(msie) ([\w.]+)/,
  rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

  // Keep a UserAgent string for use with jQuery.browser
  userAgent = navigator.userAgent,

  // For matching the engine and version of the browser
  browserMatch,

  // The deferred used on DOM ready
  readyList,

  // The ready event handler
  DOMContentLoaded,

  // Save a reference to some core methods
  toString = Object.prototype.toString,
  hasOwn = Object.prototype.hasOwnProperty,
  push = Array.prototype.push,
  slice = Array.prototype.slice,
  trim = String.prototype.trim,
  indexOf = Array.prototype.indexOf,

  // [[Class]] -> type pairs
  class2type = {};

jQuery.fn = jQuery.prototype = {
  constructor: jQuery,
  init: function( selector, context, rootjQuery ) {
    var match, elem, ret, doc;

    // Handle $(""), $(null), or $(undefined)
    if ( !selector ) {
      return this;
    }

    // Handle $(DOMElement)
    if ( selector.nodeType ) {
      this.context = this[0] = selector;
      this.length = 1;
      return this;
    }

    // The body element only exists once, optimize finding it
    if ( selector === "body" && !context && document.body ) {
      this.context = document;
      this[0] = document.body;
      this.selector = selector;
      this.length = 1;
      return this;
    }

    // Handle HTML strings
    if ( typeof selector === "string" ) {
      // Are we dealing with HTML string or an ID?
      if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
        // Assume that strings that start and end with <> are HTML and skip the regex check
        match = [ null, selector, null ];

      } else {
        match = quickExpr.exec( selector );
      }

      // Verify a match, and that no context was specified for #id
      if ( match && (match[1] || !context) ) {

        // HANDLE: $(html) -> $(array)
        if ( match[1] ) {
          context = context instanceof jQuery ? context[0] : context;
          doc = (context ? context.ownerDocument || context : document);

          // If a single string is passed in and it's a single tag
          // just do a createElement and skip the rest
          ret = rsingleTag.exec( selector );

          if ( ret ) {
            if ( jQuery.isPlainObject( context ) ) {
              selector = [ document.createElement( ret[1] ) ];
              jQuery.fn.attr.call( selector, context, true );

            } else {
              selector = [ doc.createElement( ret[1] ) ];
            }

          } else {
            ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
            selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
          }

          return jQuery.merge( this, selector );

        // HANDLE: $("#id")
        } else {
          elem = document.getElementById( match[2] );

          // Check parentNode to catch when Blackberry 4.6 returns
          // nodes that are no longer in the document #6963
          if ( elem && elem.parentNode ) {
            // Handle the case where IE and Opera return items
            // by name instead of ID
            if ( elem.id !== match[2] ) {
              return rootjQuery.find( selector );
            }

            // Otherwise, we inject the element directly into the jQuery object
            this.length = 1;
            this[0] = elem;
          }

          this.context = document;
          this.selector = selector;
          return this;
        }

      // HANDLE: $(expr, $(...))
      } else if ( !context || context.jquery ) {
        return (context || rootjQuery).find( selector );

      // HANDLE: $(expr, context)
      // (which is just equivalent to: $(context).find(expr)
      } else {
        return this.constructor( context ).find( selector );
      }

    // HANDLE: $(function)
    // Shortcut for document ready
    } else if ( jQuery.isFunction( selector ) ) {
      return rootjQuery.ready( selector );
    }

    if (selector.selector !== undefined) {
      this.selector = selector.selector;
      this.context = selector.context;
    }

    return jQuery.makeArray( selector, this );
  },

  // Start with an empty selector
  selector: "",

  // The current version of jQuery being used
  jquery: "1.6.1",

  // The default length of a jQuery object is 0
  length: 0,

  // The number of elements contained in the matched element set
  size: function() {
    return this.length;
  },

  toArray: function() {
    return slice.call( this, 0 );
  },

  // Get the Nth element in the matched element set OR
  // Get the whole matched element set as a clean array
  get: function( num ) {
    return num == null ?

      // Return a 'clean' array
      this.toArray() :

      // Return just the object
      ( num < 0 ? this[ this.length + num ] : this[ num ] );
  },

  // Take an array of elements and push it onto the stack
  // (returning the new matched element set)
  pushStack: function( elems, name, selector ) {
    // Build a new jQuery matched element set
    var ret = this.constructor();

    if ( jQuery.isArray( elems ) ) {
      push.apply( ret, elems );

    } else {
      jQuery.merge( ret, elems );
    }

    // Add the old object onto the stack (as a reference)
    ret.prevObject = this;

    ret.context = this.context;

    if ( name === "find" ) {
      ret.selector = this.selector + (this.selector ? " " : "") + selector;
    } else if ( name ) {
      ret.selector = this.selector + "." + name + "(" + selector + ")";
    }

    // Return the newly-formed element set
    return ret;
  },

  // Execute a callback for every element in the matched set.
  // (You can seed the arguments with an array of args, but this is
  // only used internally.)
  each: function( callback, args ) {
    return jQuery.each( this, callback, args );
  },

  ready: function( fn ) {
    // Attach the listeners
    jQuery.bindReady();

    // Add the callback
    readyList.done( fn );

    return this;
  },

  eq: function( i ) {
    return i === -1 ?
      this.slice( i ) :
      this.slice( i, +i + 1 );
  },

  first: function() {
    return this.eq( 0 );
  },

  last: function() {
    return this.eq( -1 );
  },

  slice: function() {
    return this.pushStack( slice.apply( this, arguments ),
      "slice", slice.call(arguments).join(",") );
  },

  map: function( callback ) {
    return this.pushStack( jQuery.map(this, function( elem, i ) {
      return callback.call( elem, i, elem );
    }));
  },

  end: function() {
    return this.prevObject || this.constructor(null);
  },

  // For internal use only.
  // Behaves like an Array's method, not like a jQuery method.
  push: push,
  sort: [].sort,
  splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
    target = {};
  }

  // extend jQuery itself if only one argument is passed
  if ( length === i ) {
    target = this;
    --i;
  }

  for ( ; i < length; i++ ) {
    // Only deal with non-null/undefined values
    if ( (options = arguments[ i ]) != null ) {
      // Extend the base object
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];

        // Prevent never-ending loop
        if ( target === copy ) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && jQuery.isArray(src) ? src : [];

          } else {
            clone = src && jQuery.isPlainObject(src) ? src : {};
          }

          // Never move original objects, clone them
          target[ name ] = jQuery.extend( deep, clone, copy );

        // Don't bring in undefined values
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

jQuery.extend({
  noConflict: function( deep ) {
    if ( window.$ === jQuery ) {
      window.$ = _$;
    }

    if ( deep && window.jQuery === jQuery ) {
      window.jQuery = _jQuery;
    }

    return jQuery;
  },

  // Is the DOM ready to be used? Set to true once it occurs.
  isReady: false,

  // A counter to track how many items to wait for before
  // the ready event fires. See #6781
  readyWait: 1,

  // Hold (or release) the ready event
  holdReady: function( hold ) {
    if ( hold ) {
      jQuery.readyWait++;
    } else {
      jQuery.ready( true );
    }
  },

  // Handle when the DOM is ready
  ready: function( wait ) {
    // Either a released hold or an DOMready/load event and not yet ready
    if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
      // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
      if ( !document.body ) {
        return setTimeout( jQuery.ready, 1 );
      }

      // Remember that the DOM is ready
      jQuery.isReady = true;

      // If a normal DOM Ready event fired, decrement, and wait if need be
      if ( wait !== true && --jQuery.readyWait > 0 ) {
        return;
      }

      // If there are functions bound, to execute
      readyList.resolveWith( document, [ jQuery ] );

      // Trigger any bound ready events
      if ( jQuery.fn.trigger ) {
        jQuery( document ).trigger( "ready" ).unbind( "ready" );
      }
    }
  },

  bindReady: function() {
    if ( readyList ) {
      return;
    }

    readyList = jQuery._Deferred();

    // Catch cases where $(document).ready() is called after the
    // browser event has already occurred.
    if ( document.readyState === "complete" ) {
      // Handle it asynchronously to allow scripts the opportunity to delay ready
      return setTimeout( jQuery.ready, 1 );
    }

    // Mozilla, Opera and webkit nightlies currently support this event
    if ( document.addEventListener ) {
      // Use the handy event callback
      document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

      // A fallback to window.onload, that will always work
      window.addEventListener( "load", jQuery.ready, false );

    // If IE event model is used
    } else if ( document.attachEvent ) {
      // ensure firing before onload,
      // maybe late but safe also for iframes
      document.attachEvent( "onreadystatechange", DOMContentLoaded );

      // A fallback to window.onload, that will always work
      window.attachEvent( "onload", jQuery.ready );

      // If IE and not a frame
      // continually check to see if the document is ready
      var toplevel = false;

      try {
        toplevel = window.frameElement == null;
      } catch(e) {}

      if ( document.documentElement.doScroll && toplevel ) {
        doScrollCheck();
      }
    }
  },

  // See test/unit/core.js for details concerning isFunction.
  // Since version 1.3, DOM methods and functions like alert
  // aren't supported. They return false on IE (#2968).
  isFunction: function( obj ) {
    return jQuery.type(obj) === "function";
  },

  isArray: Array.isArray || function( obj ) {
    return jQuery.type(obj) === "array";
  },

  // A crude way of determining if an object is a window
  isWindow: function( obj ) {
    return obj && typeof obj === "object" && "setInterval" in obj;
  },

  isNaN: function( obj ) {
    return obj == null || !rdigit.test( obj ) || isNaN( obj );
  },

  type: function( obj ) {
    return obj == null ?
      String( obj ) :
      class2type[ toString.call(obj) ] || "object";
  },

  isPlainObject: function( obj ) {
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
      return false;
    }

    // Not own constructor property must be Object
    if ( obj.constructor &&
      !hasOwn.call(obj, "constructor") &&
      !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
      return false;
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.

    var key;
    for ( key in obj ) {}

    return key === undefined || hasOwn.call( obj, key );
  },

  isEmptyObject: function( obj ) {
    for ( var name in obj ) {
      return false;
    }
    return true;
  },

  error: function( msg ) {
    throw msg;
  },

  parseJSON: function( data ) {
    if ( typeof data !== "string" || !data ) {
      return null;
    }

    // Make sure leading/trailing whitespace is removed (IE can't handle it)
    data = jQuery.trim( data );

    // Attempt to parse using the native JSON parser first
    if ( window.JSON && window.JSON.parse ) {
      return window.JSON.parse( data );
    }

    // Make sure the incoming data is actual JSON
    // Logic borrowed from http://json.org/json2.js
    if ( rvalidchars.test( data.replace( rvalidescape, "@" )
      .replace( rvalidtokens, "]" )
      .replace( rvalidbraces, "")) ) {

      return (new Function( "return " + data ))();

    }
    jQuery.error( "Invalid JSON: " + data );
  },

  // Cross-browser xml parsing
  // (xml & tmp used internally)
  parseXML: function( data , xml , tmp ) {

    if ( window.DOMParser ) { // Standard
      tmp = new DOMParser();
      xml = tmp.parseFromString( data , "text/xml" );
    } else { // IE
      xml = new ActiveXObject( "Microsoft.XMLDOM" );
      xml.async = "false";
      xml.loadXML( data );
    }

    tmp = xml.documentElement;

    if ( ! tmp || ! tmp.nodeName || tmp.nodeName === "parsererror" ) {
      jQuery.error( "Invalid XML: " + data );
    }

    return xml;
  },

  noop: function() {},

  // Evaluates a script in a global context
  // Workarounds based on findings by Jim Driscoll
  // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
  globalEval: function( data ) {
    if ( data && rnotwhite.test( data ) ) {
      // We use execScript on Internet Explorer
      // We use an anonymous function so that context is window
      // rather than jQuery in Firefox
      ( window.execScript || function( data ) {
        window[ "eval" ].call( window, data );
      } )( data );
    }
  },

  nodeName: function( elem, name ) {
    return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
  },

  // args is for internal usage only
  each: function( object, callback, args ) {
    var name, i = 0,
      length = object.length,
      isObj = length === undefined || jQuery.isFunction( object );

    if ( args ) {
      if ( isObj ) {
        for ( name in object ) {
          if ( callback.apply( object[ name ], args ) === false ) {
            break;
          }
        }
      } else {
        for ( ; i < length; ) {
          if ( callback.apply( object[ i++ ], args ) === false ) {
            break;
          }
        }
      }

    // A special, fast, case for the most common use of each
    } else {
      if ( isObj ) {
        for ( name in object ) {
          if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
            break;
          }
        }
      } else {
        for ( ; i < length; ) {
          if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
            break;
          }
        }
      }
    }

    return object;
  },

  // Use native String.trim function wherever possible
  trim: trim ?
    function( text ) {
      return text == null ?
        "" :
        trim.call( text );
    } :

    // Otherwise use our own trimming functionality
    function( text ) {
      return text == null ?
        "" :
        text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
    },

  // results is for internal usage only
  makeArray: function( array, results ) {
    var ret = results || [];

    if ( array != null ) {
      // The window, strings (and functions) also have 'length'
      // The extra typeof function check is to prevent crashes
      // in Safari 2 (See: #3039)
      // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
      var type = jQuery.type( array );

      if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
        push.call( ret, array );
      } else {
        jQuery.merge( ret, array );
      }
    }

    return ret;
  },

  inArray: function( elem, array ) {

    if ( indexOf ) {
      return indexOf.call( array, elem );
    }

    for ( var i = 0, length = array.length; i < length; i++ ) {
      if ( array[ i ] === elem ) {
        return i;
      }
    }

    return -1;
  },

  merge: function( first, second ) {
    var i = first.length,
      j = 0;

    if ( typeof second.length === "number" ) {
      for ( var l = second.length; j < l; j++ ) {
        first[ i++ ] = second[ j ];
      }

    } else {
      while ( second[j] !== undefined ) {
        first[ i++ ] = second[ j++ ];
      }
    }

    first.length = i;

    return first;
  },

  grep: function( elems, callback, inv ) {
    var ret = [], retVal;
    inv = !!inv;

    // Go through the array, only saving the items
    // that pass the validator function
    for ( var i = 0, length = elems.length; i < length; i++ ) {
      retVal = !!callback( elems[ i ], i );
      if ( inv !== retVal ) {
        ret.push( elems[ i ] );
      }
    }

    return ret;
  },

  // arg is for internal usage only
  map: function( elems, callback, arg ) {
    var value, key, ret = [],
      i = 0,
      length = elems.length,
      // jquery objects are treated as arrays
      isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

    // Go through the array, translating each of the items to their
    if ( isArray ) {
      for ( ; i < length; i++ ) {
        value = callback( elems[ i ], i, arg );

        if ( value != null ) {
          ret[ ret.length ] = value;
        }
      }

    // Go through every key on the object,
    } else {
      for ( key in elems ) {
        value = callback( elems[ key ], key, arg );

        if ( value != null ) {
          ret[ ret.length ] = value;
        }
      }
    }

    // Flatten any nested arrays
    return ret.concat.apply( [], ret );
  },

  // A global GUID counter for objects
  guid: 1,

  // Bind a function to a context, optionally partially applying any
  // arguments.
  proxy: function( fn, context ) {
    if ( typeof context === "string" ) {
      var tmp = fn[ context ];
      context = fn;
      fn = tmp;
    }

    // Quick check to determine if target is callable, in the spec
    // this throws a TypeError, but we will just return undefined.
    if ( !jQuery.isFunction( fn ) ) {
      return undefined;
    }

    // Simulated bind
    var args = slice.call( arguments, 2 ),
      proxy = function() {
        return fn.apply( context, args.concat( slice.call( arguments ) ) );
      };

    // Set the guid of unique handler to the same of original handler, so it can be removed
    proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

    return proxy;
  },

  // Mutifunctional method to get and set values to a collection
  // The value/s can be optionally by executed if its a function
  access: function( elems, key, value, exec, fn, pass ) {
    var length = elems.length;

    // Setting many attributes
    if ( typeof key === "object" ) {
      for ( var k in key ) {
        jQuery.access( elems, k, key[k], exec, fn, value );
      }
      return elems;
    }

    // Setting one attribute
    if ( value !== undefined ) {
      // Optionally, function values get executed if exec is true
      exec = !pass && exec && jQuery.isFunction(value);

      for ( var i = 0; i < length; i++ ) {
        fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
      }

      return elems;
    }

    // Getting an attribute
    return length ? fn( elems[0], key ) : undefined;
  },

  now: function() {
    return (new Date()).getTime();
  },

  // Use of jQuery.browser is frowned upon.
  // More details: http://docs.jquery.com/Utilities/jQuery.browser
  uaMatch: function( ua ) {
    ua = ua.toLowerCase();

    var match = rwebkit.exec( ua ) ||
      ropera.exec( ua ) ||
      rmsie.exec( ua ) ||
      ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
      [];

    return { browser: match[1] || "", version: match[2] || "0" };
  },

  sub: function() {
    function jQuerySub( selector, context ) {
      return new jQuerySub.fn.init( selector, context );
    }
    jQuery.extend( true, jQuerySub, this );
    jQuerySub.superclass = this;
    jQuerySub.fn = jQuerySub.prototype = this();
    jQuerySub.fn.constructor = jQuerySub;
    jQuerySub.sub = this.sub;
    jQuerySub.fn.init = function init( selector, context ) {
      if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
        context = jQuerySub( context );
      }

      return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
    };
    jQuerySub.fn.init.prototype = jQuerySub.fn;
    var rootjQuerySub = jQuerySub(document);
    return jQuerySub;
  },

  browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
  class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
  jQuery.browser[ browserMatch.browser ] = true;
  jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
  jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
  trimLeft = /^[\s\xA0]+/;
  trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
  DOMContentLoaded = function() {
    document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
    jQuery.ready();
  };

} else if ( document.attachEvent ) {
  DOMContentLoaded = function() {
    // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
    if ( document.readyState === "complete" ) {
      document.detachEvent( "onreadystatechange", DOMContentLoaded );
      jQuery.ready();
    }
  };
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
  if ( jQuery.isReady ) {
    return;
  }

  try {
    // If IE is used, use the trick by Diego Perini
    // http://javascript.nwbox.com/IEContentLoaded/
    document.documentElement.doScroll("left");
  } catch(e) {
    setTimeout( doScrollCheck, 1 );
    return;
  }

  // and execute any waiting functions
  jQuery.ready();
}

// Expose jQuery to the global object
return jQuery;

})();


var // Promise methods
  promiseMethods = "done fail isResolved isRejected promise then always pipe".split( " " ),
  // Static reference to slice
  sliceDeferred = [].slice;

jQuery.extend({
  // Create a simple deferred (one callbacks list)
  _Deferred: function() {
    var // callbacks list
      callbacks = [],
      // stored [ context , args ]
      fired,
      // to avoid firing when already doing so
      firing,
      // flag to know if the deferred has been cancelled
      cancelled,
      // the deferred itself
      deferred  = {

        // done( f1, f2, ...)
        done: function() {
          if ( !cancelled ) {
            var args = arguments,
              i,
              length,
              elem,
              type,
              _fired;
            if ( fired ) {
              _fired = fired;
              fired = 0;
            }
            for ( i = 0, length = args.length; i < length; i++ ) {
              elem = args[ i ];
              type = jQuery.type( elem );
              if ( type === "array" ) {
                deferred.done.apply( deferred, elem );
              } else if ( type === "function" ) {
                callbacks.push( elem );
              }
            }
            if ( _fired ) {
              deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
            }
          }
          return this;
        },

        // resolve with given context and args
        resolveWith: function( context, args ) {
          if ( !cancelled && !fired && !firing ) {
            // make sure args are available (#8421)
            args = args || [];
            firing = 1;
            try {
              while( callbacks[ 0 ] ) {
                callbacks.shift().apply( context, args );
              }
            }
            finally {
              fired = [ context, args ];
              firing = 0;
            }
          }
          return this;
        },

        // resolve with this as context and given arguments
        resolve: function() {
          deferred.resolveWith( this, arguments );
          return this;
        },

        // Has this deferred been resolved?
        isResolved: function() {
          return !!( firing || fired );
        },

        // Cancel
        cancel: function() {
          cancelled = 1;
          callbacks = [];
          return this;
        }
      };

    return deferred;
  },

  // Full fledged deferred (two callbacks list)
  Deferred: function( func ) {
    var deferred = jQuery._Deferred(),
      failDeferred = jQuery._Deferred(),
      promise;
    // Add errorDeferred methods, then and promise
    jQuery.extend( deferred, {
      then: function( doneCallbacks, failCallbacks ) {
        deferred.done( doneCallbacks ).fail( failCallbacks );
        return this;
      },
      always: function() {
        return deferred.done.apply( deferred, arguments ).fail.apply( this, arguments );
      },
      fail: failDeferred.done,
      rejectWith: failDeferred.resolveWith,
      reject: failDeferred.resolve,
      isRejected: failDeferred.isResolved,
      pipe: function( fnDone, fnFail ) {
        return jQuery.Deferred(function( newDefer ) {
          jQuery.each( {
            done: [ fnDone, "resolve" ],
            fail: [ fnFail, "reject" ]
          }, function( handler, data ) {
            var fn = data[ 0 ],
              action = data[ 1 ],
              returned;
            if ( jQuery.isFunction( fn ) ) {
              deferred[ handler ](function() {
                returned = fn.apply( this, arguments );
                if ( returned && jQuery.isFunction( returned.promise ) ) {
                  returned.promise().then( newDefer.resolve, newDefer.reject );
                } else {
                  newDefer[ action ]( returned );
                }
              });
            } else {
              deferred[ handler ]( newDefer[ action ] );
            }
          });
        }).promise();
      },
      // Get a promise for this deferred
      // If obj is provided, the promise aspect is added to the object
      promise: function( obj ) {
        if ( obj == null ) {
          if ( promise ) {
            return promise;
          }
          promise = obj = {};
        }
        var i = promiseMethods.length;
        while( i-- ) {
          obj[ promiseMethods[i] ] = deferred[ promiseMethods[i] ];
        }
        return obj;
      }
    });
    // Make sure only one callback list will be used
    deferred.done( failDeferred.cancel ).fail( deferred.cancel );
    // Unexpose cancel
    delete deferred.cancel;
    // Call given func if any
    if ( func ) {
      func.call( deferred, deferred );
    }
    return deferred;
  },

  // Deferred helper
  when: function( firstParam ) {
    var args = arguments,
      i = 0,
      length = args.length,
      count = length,
      deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
        firstParam :
        jQuery.Deferred();
    function resolveFunc( i ) {
      return function( value ) {
        args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
        if ( !( --count ) ) {
          // Strange bug in FF4:
          // Values changed onto the arguments object sometimes end up as undefined values
          // outside the $.when method. Cloning the object into a fresh array solves the issue
          deferred.resolveWith( deferred, sliceDeferred.call( args, 0 ) );
        }
      };
    }
    if ( length > 1 ) {
      for( ; i < length; i++ ) {
        if ( args[ i ] && jQuery.isFunction( args[ i ].promise ) ) {
          args[ i ].promise().then( resolveFunc(i), deferred.reject );
        } else {
          --count;
        }
      }
      if ( !count ) {
        deferred.resolveWith( deferred, args );
      }
    } else if ( deferred !== firstParam ) {
      deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
    }
    return deferred.promise();
  }
});



jQuery.support = (function() {

  var div = document.createElement( "div" ),
    documentElement = document.documentElement,
    all,
    a,
    select,
    opt,
    input,
    marginDiv,
    support,
    fragment,
    body,
    bodyStyle,
    tds,
    events,
    eventName,
    i,
    isSupported;

  // Preliminary tests
  div.setAttribute("className", "t");
  div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

  all = div.getElementsByTagName( "*" );
  a = div.getElementsByTagName( "a" )[ 0 ];

  // Can't get basic test support
  if ( !all || !all.length || !a ) {
    return {};
  }

  // First batch of supports tests
  select = document.createElement( "select" );
  opt = select.appendChild( document.createElement("option") );
  input = div.getElementsByTagName( "input" )[ 0 ];

  support = {
    // IE strips leading whitespace when .innerHTML is used
    leadingWhitespace: ( div.firstChild.nodeType === 3 ),

    // Make sure that tbody elements aren't automatically inserted
    // IE will insert them into empty tables
    tbody: !div.getElementsByTagName( "tbody" ).length,

    // Make sure that link elements get serialized correctly by innerHTML
    // This requires a wrapper element in IE
    htmlSerialize: !!div.getElementsByTagName( "link" ).length,

    // Get the style information from getAttribute
    // (IE uses .cssText instead)
    style: /top/.test( a.getAttribute("style") ),

    // Make sure that URLs aren't manipulated
    // (IE normalizes it by default)
    hrefNormalized: ( a.getAttribute( "href" ) === "/a" ),

    // Make sure that element opacity exists
    // (IE uses filter instead)
    // Use a regex to work around a WebKit issue. See #5145
    opacity: /^0.55$/.test( a.style.opacity ),

    // Verify style float existence
    // (IE uses styleFloat instead of cssFloat)
    cssFloat: !!a.style.cssFloat,

    // Make sure that if no value is specified for a checkbox
    // that it defaults to "on".
    // (WebKit defaults to "" instead)
    checkOn: ( input.value === "on" ),

    // Make sure that a selected-by-default option has a working selected property.
    // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
    optSelected: opt.selected,

    // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
    getSetAttribute: div.className !== "t",

    // Will be defined later
    submitBubbles: true,
    changeBubbles: true,
    focusinBubbles: false,
    deleteExpando: true,
    noCloneEvent: true,
    inlineBlockNeedsLayout: false,
    shrinkWrapBlocks: false,
    reliableMarginRight: true
  };

  // Make sure checked status is properly cloned
  input.checked = true;
  support.noCloneChecked = input.cloneNode( true ).checked;

  // Make sure that the options inside disabled selects aren't marked as disabled
  // (WebKit marks them as disabled)
  select.disabled = true;
  support.optDisabled = !opt.disabled;

  // Test to see if it's possible to delete an expando from an element
  // Fails in Internet Explorer
  try {
    delete div.test;
  } catch( e ) {
    support.deleteExpando = false;
  }

  if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
    div.attachEvent( "onclick", function click() {
      // Cloning a node shouldn't copy over any
      // bound event handlers (IE does this)
      support.noCloneEvent = false;
      div.detachEvent( "onclick", click );
    });
    div.cloneNode( true ).fireEvent( "onclick" );
  }

  // Check if a radio maintains it's value
  // after being appended to the DOM
  input = document.createElement("input");
  input.value = "t";
  input.setAttribute("type", "radio");
  support.radioValue = input.value === "t";

  input.setAttribute("checked", "checked");
  div.appendChild( input );
  fragment = document.createDocumentFragment();
  fragment.appendChild( div.firstChild );

  // WebKit doesn't clone checked state correctly in fragments
  support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

  div.innerHTML = "";

  // Figure out if the W3C box model works as expected
  div.style.width = div.style.paddingLeft = "1px";

  // We use our own, invisible, body
  body = document.createElement( "body" );
  bodyStyle = {
    visibility: "hidden",
    width: 0,
    height: 0,
    border: 0,
    margin: 0,
    // Set background to avoid IE crashes when removing (#9028)
    background: "none"
  };
  for ( i in bodyStyle ) {
    body.style[ i ] = bodyStyle[ i ];
  }
  body.appendChild( div );
  documentElement.insertBefore( body, documentElement.firstChild );

  // Check if a disconnected checkbox will retain its checked
  // value of true after appended to the DOM (IE6/7)
  support.appendChecked = input.checked;

  support.boxModel = div.offsetWidth === 2;

  if ( "zoom" in div.style ) {
    // Check if natively block-level elements act like inline-block
    // elements when setting their display to 'inline' and giving
    // them layout
    // (IE < 8 does this)
    div.style.display = "inline";
    div.style.zoom = 1;
    support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

    // Check if elements with layout shrink-wrap their children
    // (IE 6 does this)
    div.style.display = "";
    div.innerHTML = "<div style='width:4px;'></div>";
    support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
  }

  div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
  tds = div.getElementsByTagName( "td" );

  // Check if table cells still have offsetWidth/Height when they are set
  // to display:none and there are still other visible table cells in a
  // table row; if so, offsetWidth/Height are not reliable for use when
  // determining if an element has been hidden directly using
  // display:none (it is still safe to use offsets if a parent element is
  // hidden; don safety goggles and see bug #4512 for more information).
  // (only IE 8 fails this test)
  isSupported = ( tds[ 0 ].offsetHeight === 0 );

  tds[ 0 ].style.display = "";
  tds[ 1 ].style.display = "none";

  // Check if empty table cells still have offsetWidth/Height
  // (IE < 8 fail this test)
  support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );
  div.innerHTML = "";

  // Check if div with explicit width and no margin-right incorrectly
  // gets computed margin-right based on width of container. For more
  // info see bug #3333
  // Fails in WebKit before Feb 2011 nightlies
  // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
  if ( document.defaultView && document.defaultView.getComputedStyle ) {
    marginDiv = document.createElement( "div" );
    marginDiv.style.width = "0";
    marginDiv.style.marginRight = "0";
    div.appendChild( marginDiv );
    support.reliableMarginRight =
      ( parseInt( ( document.defaultView.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
  }

  // Remove the body element we added
  body.innerHTML = "";
  documentElement.removeChild( body );

  // Technique from Juriy Zaytsev
  // http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
  // We only care about the case where non-standard event systems
  // are used, namely in IE. Short-circuiting here helps us to
  // avoid an eval call (in setAttribute) which can cause CSP
  // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
  if ( div.attachEvent ) {
    for( i in {
      submit: 1,
      change: 1,
      focusin: 1
    } ) {
      eventName = "on" + i;
      isSupported = ( eventName in div );
      if ( !isSupported ) {
        div.setAttribute( eventName, "return;" );
        isSupported = ( typeof div[ eventName ] === "function" );
      }
      support[ i + "Bubbles" ] = isSupported;
    }
  }

  return support;
})();

// Keep track of boxModel
jQuery.boxModel = jQuery.support.boxModel;




var rbrace = /^(?:\{.*\}|\[.*\])$/,
  rmultiDash = /([a-z])([A-Z])/g;

jQuery.extend({
  cache: {},

  // Please use with caution
  uuid: 0,

  // Unique for each copy of jQuery on the page
  // Non-digits removed to match rinlinejQuery
  expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

  // The following elements throw uncatchable exceptions if you
  // attempt to add expando properties to them.
  noData: {
    "embed": true,
    // Ban all objects except for Flash (which handle expandos)
    "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
    "applet": true
  },

  hasData: function( elem ) {
    elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];

    return !!elem && !isEmptyDataObject( elem );
  },

  data: function( elem, name, data, pvt /* Internal Use Only */ ) {
    if ( !jQuery.acceptData( elem ) ) {
      return;
    }

    var internalKey = jQuery.expando, getByName = typeof name === "string", thisCache,

      // We have to handle DOM nodes and JS objects differently because IE6-7
      // can't GC object references properly across the DOM-JS boundary
      isNode = elem.nodeType,

      // Only DOM nodes need the global jQuery cache; JS object data is
      // attached directly to the object so GC can occur automatically
      cache = isNode ? jQuery.cache : elem,

      // Only defining an ID for JS objects if its cache already exists allows
      // the code to shortcut on the same path as a DOM node with no cache
      id = isNode ? elem[ jQuery.expando ] : elem[ jQuery.expando ] && jQuery.expando;

    // Avoid doing any more work than we need to when trying to get data on an
    // object that has no data at all
    if ( (!id || (pvt && id && !cache[ id ][ internalKey ])) && getByName && data === undefined ) {
      return;
    }

    if ( !id ) {
      // Only DOM nodes need a new unique ID for each element since their data
      // ends up in the global cache
      if ( isNode ) {
        elem[ jQuery.expando ] = id = ++jQuery.uuid;
      } else {
        id = jQuery.expando;
      }
    }

    if ( !cache[ id ] ) {
      cache[ id ] = {};

      // TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
      // metadata on plain JS objects when the object is serialized using
      // JSON.stringify
      if ( !isNode ) {
        cache[ id ].toJSON = jQuery.noop;
      }
    }

    // An object can be passed to jQuery.data instead of a key/value pair; this gets
    // shallow copied over onto the existing cache
    if ( typeof name === "object" || typeof name === "function" ) {
      if ( pvt ) {
        cache[ id ][ internalKey ] = jQuery.extend(cache[ id ][ internalKey ], name);
      } else {
        cache[ id ] = jQuery.extend(cache[ id ], name);
      }
    }

    thisCache = cache[ id ];

    // Internal jQuery data is stored in a separate object inside the object's data
    // cache in order to avoid key collisions between internal data and user-defined
    // data
    if ( pvt ) {
      if ( !thisCache[ internalKey ] ) {
        thisCache[ internalKey ] = {};
      }

      thisCache = thisCache[ internalKey ];
    }

    if ( data !== undefined ) {
      thisCache[ jQuery.camelCase( name ) ] = data;
    }

    // TODO: This is a hack for 1.5 ONLY. It will be removed in 1.6. Users should
    // not attempt to inspect the internal events object using jQuery.data, as this
    // internal data object is undocumented and subject to change.
    if ( name === "events" && !thisCache[name] ) {
      return thisCache[ internalKey ] && thisCache[ internalKey ].events;
    }

    return getByName ? thisCache[ jQuery.camelCase( name ) ] : thisCache;
  },

  removeData: function( elem, name, pvt /* Internal Use Only */ ) {
    if ( !jQuery.acceptData( elem ) ) {
      return;
    }

    var internalKey = jQuery.expando, isNode = elem.nodeType,

      // See jQuery.data for more information
      cache = isNode ? jQuery.cache : elem,

      // See jQuery.data for more information
      id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

    // If there is already no cache entry for this object, there is no
    // purpose in continuing
    if ( !cache[ id ] ) {
      return;
    }

    if ( name ) {
      var thisCache = pvt ? cache[ id ][ internalKey ] : cache[ id ];

      if ( thisCache ) {
        delete thisCache[ name ];

        // If there is no data left in the cache, we want to continue
        // and let the cache object itself get destroyed
        if ( !isEmptyDataObject(thisCache) ) {
          return;
        }
      }
    }

    // See jQuery.data for more information
    if ( pvt ) {
      delete cache[ id ][ internalKey ];

      // Don't destroy the parent cache unless the internal data object
      // had been the only thing left in it
      if ( !isEmptyDataObject(cache[ id ]) ) {
        return;
      }
    }

    var internalCache = cache[ id ][ internalKey ];

    // Browsers that fail expando deletion also refuse to delete expandos on
    // the window, but it will allow it on all other JS objects; other browsers
    // don't care
    if ( jQuery.support.deleteExpando || cache != window ) {
      delete cache[ id ];
    } else {
      cache[ id ] = null;
    }

    // We destroyed the entire user cache at once because it's faster than
    // iterating through each key, but we need to continue to persist internal
    // data if it existed
    if ( internalCache ) {
      cache[ id ] = {};
      // TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
      // metadata on plain JS objects when the object is serialized using
      // JSON.stringify
      if ( !isNode ) {
        cache[ id ].toJSON = jQuery.noop;
      }

      cache[ id ][ internalKey ] = internalCache;

    // Otherwise, we need to eliminate the expando on the node to avoid
    // false lookups in the cache for entries that no longer exist
    } else if ( isNode ) {
      // IE does not allow us to delete expando properties from nodes,
      // nor does it have a removeAttribute function on Document nodes;
      // we must handle all of these cases
      if ( jQuery.support.deleteExpando ) {
        delete elem[ jQuery.expando ];
      } else if ( elem.removeAttribute ) {
        elem.removeAttribute( jQuery.expando );
      } else {
        elem[ jQuery.expando ] = null;
      }
    }
  },

  // For internal use only.
  _data: function( elem, name, data ) {
    return jQuery.data( elem, name, data, true );
  },

  // A method for determining if a DOM node can handle the data expando
  acceptData: function( elem ) {
    if ( elem.nodeName ) {
      var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

      if ( match ) {
        return !(match === true || elem.getAttribute("classid") !== match);
      }
    }

    return true;
  }
});

jQuery.fn.extend({
  data: function( key, value ) {
    var data = null;

    if ( typeof key === "undefined" ) {
      if ( this.length ) {
        data = jQuery.data( this[0] );

        if ( this[0].nodeType === 1 ) {
          var attr = this[0].attributes, name;
          for ( var i = 0, l = attr.length; i < l; i++ ) {
            name = attr[i].name;

            if ( name.indexOf( "data-" ) === 0 ) {
              name = jQuery.camelCase( name.substring(5) );

              dataAttr( this[0], name, data[ name ] );
            }
          }
        }
      }

      return data;

    } else if ( typeof key === "object" ) {
      return this.each(function() {
        jQuery.data( this, key );
      });
    }

    var parts = key.split(".");
    parts[1] = parts[1] ? "." + parts[1] : "";

    if ( value === undefined ) {
      data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

      // Try to fetch any internally stored data first
      if ( data === undefined && this.length ) {
        data = jQuery.data( this[0], key );
        data = dataAttr( this[0], key, data );
      }

      return data === undefined && parts[1] ?
        this.data( parts[0] ) :
        data;

    } else {
      return this.each(function() {
        var $this = jQuery( this ),
          args = [ parts[0], value ];

        $this.triggerHandler( "setData" + parts[1] + "!", args );
        jQuery.data( this, key, value );
        $this.triggerHandler( "changeData" + parts[1] + "!", args );
      });
    }
  },

  removeData: function( key ) {
    return this.each(function() {
      jQuery.removeData( this, key );
    });
  }
});

function dataAttr( elem, key, data ) {
  // If nothing was found internally, try to fetch any
  // data from the HTML5 data-* attribute
  if ( data === undefined && elem.nodeType === 1 ) {
    var name = "data-" + key.replace( rmultiDash, "$1-$2" ).toLowerCase();

    data = elem.getAttribute( name );

    if ( typeof data === "string" ) {
      try {
        data = data === "true" ? true :
        data === "false" ? false :
        data === "null" ? null :
        !jQuery.isNaN( data ) ? parseFloat( data ) :
          rbrace.test( data ) ? jQuery.parseJSON( data ) :
          data;
      } catch( e ) {}

      // Make sure we set the data so it isn't changed later
      jQuery.data( elem, key, data );

    } else {
      data = undefined;
    }
  }

  return data;
}

// TODO: This is a hack for 1.5 ONLY to allow objects with a single toJSON
// property to be considered empty objects; this property always exists in
// order to make sure JSON.stringify does not expose internal metadata
function isEmptyDataObject( obj ) {
  for ( var name in obj ) {
    if ( name !== "toJSON" ) {
      return false;
    }
  }

  return true;
}




function handleQueueMarkDefer( elem, type, src ) {
  var deferDataKey = type + "defer",
    queueDataKey = type + "queue",
    markDataKey = type + "mark",
    defer = jQuery.data( elem, deferDataKey, undefined, true );
  if ( defer &&
    ( src === "queue" || !jQuery.data( elem, queueDataKey, undefined, true ) ) &&
    ( src === "mark" || !jQuery.data( elem, markDataKey, undefined, true ) ) ) {
    // Give room for hard-coded callbacks to fire first
    // and eventually mark/queue something else on the element
    setTimeout( function() {
      if ( !jQuery.data( elem, queueDataKey, undefined, true ) &&
        !jQuery.data( elem, markDataKey, undefined, true ) ) {
        jQuery.removeData( elem, deferDataKey, true );
        defer.resolve();
      }
    }, 0 );
  }
}

jQuery.extend({

  _mark: function( elem, type ) {
    if ( elem ) {
      type = (type || "fx") + "mark";
      jQuery.data( elem, type, (jQuery.data(elem,type,undefined,true) || 0) + 1, true );
    }
  },

  _unmark: function( force, elem, type ) {
    if ( force !== true ) {
      type = elem;
      elem = force;
      force = false;
    }
    if ( elem ) {
      type = type || "fx";
      var key = type + "mark",
        count = force ? 0 : ( (jQuery.data( elem, key, undefined, true) || 1 ) - 1 );
      if ( count ) {
        jQuery.data( elem, key, count, true );
      } else {
        jQuery.removeData( elem, key, true );
        handleQueueMarkDefer( elem, type, "mark" );
      }
    }
  },

  queue: function( elem, type, data ) {
    if ( elem ) {
      type = (type || "fx") + "queue";
      var q = jQuery.data( elem, type, undefined, true );
      // Speed up dequeue by getting out quickly if this is just a lookup
      if ( data ) {
        if ( !q || jQuery.isArray(data) ) {
          q = jQuery.data( elem, type, jQuery.makeArray(data), true );
        } else {
          q.push( data );
        }
      }
      return q || [];
    }
  },

  dequeue: function( elem, type ) {
    type = type || "fx";

    var queue = jQuery.queue( elem, type ),
      fn = queue.shift(),
      defer;

    // If the fx queue is dequeued, always remove the progress sentinel
    if ( fn === "inprogress" ) {
      fn = queue.shift();
    }

    if ( fn ) {
      // Add a progress sentinel to prevent the fx queue from being
      // automatically dequeued
      if ( type === "fx" ) {
        queue.unshift("inprogress");
      }

      fn.call(elem, function() {
        jQuery.dequeue(elem, type);
      });
    }

    if ( !queue.length ) {
      jQuery.removeData( elem, type + "queue", true );
      handleQueueMarkDefer( elem, type, "queue" );
    }
  }
});

jQuery.fn.extend({
  queue: function( type, data ) {
    if ( typeof type !== "string" ) {
      data = type;
      type = "fx";
    }

    if ( data === undefined ) {
      return jQuery.queue( this[0], type );
    }
    return this.each(function() {
      var queue = jQuery.queue( this, type, data );

      if ( type === "fx" && queue[0] !== "inprogress" ) {
        jQuery.dequeue( this, type );
      }
    });
  },
  dequeue: function( type ) {
    return this.each(function() {
      jQuery.dequeue( this, type );
    });
  },
  // Based off of the plugin by Clint Helfers, with permission.
  // http://blindsignals.com/index.php/2009/07/jquery-delay/
  delay: function( time, type ) {
    time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
    type = type || "fx";

    return this.queue( type, function() {
      var elem = this;
      setTimeout(function() {
        jQuery.dequeue( elem, type );
      }, time );
    });
  },
  clearQueue: function( type ) {
    return this.queue( type || "fx", [] );
  },
  // Get a promise resolved when queues of a certain type
  // are emptied (fx is the type by default)
  promise: function( type, object ) {
    if ( typeof type !== "string" ) {
      object = type;
      type = undefined;
    }
    type = type || "fx";
    var defer = jQuery.Deferred(),
      elements = this,
      i = elements.length,
      count = 1,
      deferDataKey = type + "defer",
      queueDataKey = type + "queue",
      markDataKey = type + "mark",
      tmp;
    function resolve() {
      if ( !( --count ) ) {
        defer.resolveWith( elements, [ elements ] );
      }
    }
    while( i-- ) {
      if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
          ( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
            jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
          jQuery.data( elements[ i ], deferDataKey, jQuery._Deferred(), true ) )) {
        count++;
        tmp.done( resolve );
      }
    }
    resolve();
    return defer.promise();
  }
});




var rclass = /[\n\t\r]/g,
  rspace = /\s+/,
  rreturn = /\r/g,
  rtype = /^(?:button|input)$/i,
  rfocusable = /^(?:button|input|object|select|textarea)$/i,
  rclickable = /^a(?:rea)?$/i,
  rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
  rinvalidChar = /\:/,
  formHook, boolHook;

jQuery.fn.extend({
  attr: function( name, value ) {
    return jQuery.access( this, name, value, true, jQuery.attr );
  },

  removeAttr: function( name ) {
    return this.each(function() {
      jQuery.removeAttr( this, name );
    });
  },
  
  prop: function( name, value ) {
    return jQuery.access( this, name, value, true, jQuery.prop );
  },
  
  removeProp: function( name ) {
    name = jQuery.propFix[ name ] || name;
    return this.each(function() {
      // try/catch handles cases where IE balks (such as removing a property on window)
      try {
        this[ name ] = undefined;
        delete this[ name ];
      } catch( e ) {}
    });
  },

  addClass: function( value ) {
    if ( jQuery.isFunction( value ) ) {
      return this.each(function(i) {
        var self = jQuery(this);
        self.addClass( value.call(this, i, self.attr("class") || "") );
      });
    }

    if ( value && typeof value === "string" ) {
      var classNames = (value || "").split( rspace );

      for ( var i = 0, l = this.length; i < l; i++ ) {
        var elem = this[i];

        if ( elem.nodeType === 1 ) {
          if ( !elem.className ) {
            elem.className = value;

          } else {
            var className = " " + elem.className + " ",
              setClass = elem.className;

            for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
              if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
                setClass += " " + classNames[c];
              }
            }
            elem.className = jQuery.trim( setClass );
          }
        }
      }
    }

    return this;
  },

  removeClass: function( value ) {
    if ( jQuery.isFunction(value) ) {
      return this.each(function(i) {
        var self = jQuery(this);
        self.removeClass( value.call(this, i, self.attr("class")) );
      });
    }

    if ( (value && typeof value === "string") || value === undefined ) {
      var classNames = (value || "").split( rspace );

      for ( var i = 0, l = this.length; i < l; i++ ) {
        var elem = this[i];

        if ( elem.nodeType === 1 && elem.className ) {
          if ( value ) {
            var className = (" " + elem.className + " ").replace(rclass, " ");
            for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
              className = className.replace(" " + classNames[c] + " ", " ");
            }
            elem.className = jQuery.trim( className );

          } else {
            elem.className = "";
          }
        }
      }
    }

    return this;
  },

  toggleClass: function( value, stateVal ) {
    var type = typeof value,
      isBool = typeof stateVal === "boolean";

    if ( jQuery.isFunction( value ) ) {
      return this.each(function(i) {
        var self = jQuery(this);
        self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
      });
    }

    return this.each(function() {
      if ( type === "string" ) {
        // toggle individual class names
        var className,
          i = 0,
          self = jQuery( this ),
          state = stateVal,
          classNames = value.split( rspace );

        while ( (className = classNames[ i++ ]) ) {
          // check each className given, space seperated list
          state = isBool ? state : !self.hasClass( className );
          self[ state ? "addClass" : "removeClass" ]( className );
        }

      } else if ( type === "undefined" || type === "boolean" ) {
        if ( this.className ) {
          // store className if set
          jQuery._data( this, "__className__", this.className );
        }

        // toggle whole className
        this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
      }
    });
  },

  hasClass: function( selector ) {
    var className = " " + selector + " ";
    for ( var i = 0, l = this.length; i < l; i++ ) {
      if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
        return true;
      }
    }

    return false;
  },

  val: function( value ) {
    var hooks, ret,
      elem = this[0];
    
    if ( !arguments.length ) {
      if ( elem ) {
        hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

        if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
          return ret;
        }

        return (elem.value || "").replace(rreturn, "");
      }

      return undefined;
    }

    var isFunction = jQuery.isFunction( value );

    return this.each(function( i ) {
      var self = jQuery(this), val;

      if ( this.nodeType !== 1 ) {
        return;
      }

      if ( isFunction ) {
        val = value.call( this, i, self.val() );
      } else {
        val = value;
      }

      // Treat null/undefined as ""; convert numbers to string
      if ( val == null ) {
        val = "";
      } else if ( typeof val === "number" ) {
        val += "";
      } else if ( jQuery.isArray( val ) ) {
        val = jQuery.map(val, function ( value ) {
          return value == null ? "" : value + "";
        });
      }

      hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

      // If set returns undefined, fall back to normal setting
      if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
        this.value = val;
      }
    });
  }
});

jQuery.extend({
  valHooks: {
    option: {
      get: function( elem ) {
        // attributes.value is undefined in Blackberry 4.7 but
        // uses .value. See #6932
        var val = elem.attributes.value;
        return !val || val.specified ? elem.value : elem.text;
      }
    },
    select: {
      get: function( elem ) {
        var value,
          index = elem.selectedIndex,
          values = [],
          options = elem.options,
          one = elem.type === "select-one";

        // Nothing was selected
        if ( index < 0 ) {
          return null;
        }

        // Loop through all the selected options
        for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
          var option = options[ i ];

          // Don't return options that are disabled or in a disabled optgroup
          if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
              (!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

            // Get the specific value for the option
            value = jQuery( option ).val();

            // We don't need an array for one selects
            if ( one ) {
              return value;
            }

            // Multi-Selects return an array
            values.push( value );
          }
        }

        // Fixes Bug #2551 -- select.val() broken in IE after form.reset()
        if ( one && !values.length && options.length ) {
          return jQuery( options[ index ] ).val();
        }

        return values;
      },

      set: function( elem, value ) {
        var values = jQuery.makeArray( value );

        jQuery(elem).find("option").each(function() {
          this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
        });

        if ( !values.length ) {
          elem.selectedIndex = -1;
        }
        return values;
      }
    }
  },

  attrFn: {
    val: true,
    css: true,
    html: true,
    text: true,
    data: true,
    width: true,
    height: true,
    offset: true
  },
  
  attrFix: {
    // Always normalize to ensure hook usage
    tabindex: "tabIndex"
  },
  
  attr: function( elem, name, value, pass ) {
    var nType = elem.nodeType;
    
    // don't get/set attributes on text, comment and attribute nodes
    if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
      return undefined;
    }

    if ( pass && name in jQuery.attrFn ) {
      return jQuery( elem )[ name ]( value );
    }

    // Fallback to prop when attributes are not supported
    if ( !("getAttribute" in elem) ) {
      return jQuery.prop( elem, name, value );
    }

    var ret, hooks,
      notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

    // Normalize the name if needed
    name = notxml && jQuery.attrFix[ name ] || name;

    hooks = jQuery.attrHooks[ name ];

    if ( !hooks ) {
      // Use boolHook for boolean attributes
      if ( rboolean.test( name ) &&
        (typeof value === "boolean" || value === undefined || value.toLowerCase() === name.toLowerCase()) ) {

        hooks = boolHook;

      // Use formHook for forms and if the name contains certain characters
      } else if ( formHook && (jQuery.nodeName( elem, "form" ) || rinvalidChar.test( name )) ) {
        hooks = formHook;
      }
    }

    if ( value !== undefined ) {

      if ( value === null ) {
        jQuery.removeAttr( elem, name );
        return undefined;

      } else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
        return ret;

      } else {
        elem.setAttribute( name, "" + value );
        return value;
      }

    } else if ( hooks && "get" in hooks && notxml ) {
      return hooks.get( elem, name );

    } else {

      ret = elem.getAttribute( name );

      // Non-existent attributes return null, we normalize to undefined
      return ret === null ?
        undefined :
        ret;
    }
  },

  removeAttr: function( elem, name ) {
    var propName;
    if ( elem.nodeType === 1 ) {
      name = jQuery.attrFix[ name ] || name;
    
      if ( jQuery.support.getSetAttribute ) {
        // Use removeAttribute in browsers that support it
        elem.removeAttribute( name );
      } else {
        jQuery.attr( elem, name, "" );
        elem.removeAttributeNode( elem.getAttributeNode( name ) );
      }

      // Set corresponding property to false for boolean attributes
      if ( rboolean.test( name ) && (propName = jQuery.propFix[ name ] || name) in elem ) {
        elem[ propName ] = false;
      }
    }
  },

  attrHooks: {
    type: {
      set: function( elem, value ) {
        // We can't allow the type property to be changed (since it causes problems in IE)
        if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
          jQuery.error( "type property can't be changed" );
        } else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
          // Setting the type on a radio button after the value resets the value in IE6-9
          // Reset value to it's default in case type is set after value
          // This is for element creation
          var val = elem.value;
          elem.setAttribute( "type", value );
          if ( val ) {
            elem.value = val;
          }
          return value;
        }
      }
    },
    tabIndex: {
      get: function( elem ) {
        // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
        // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
        var attributeNode = elem.getAttributeNode("tabIndex");

        return attributeNode && attributeNode.specified ?
          parseInt( attributeNode.value, 10 ) :
          rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
            0 :
            undefined;
      }
    }
  },

  propFix: {
    tabindex: "tabIndex",
    readonly: "readOnly",
    "for": "htmlFor",
    "class": "className",
    maxlength: "maxLength",
    cellspacing: "cellSpacing",
    cellpadding: "cellPadding",
    rowspan: "rowSpan",
    colspan: "colSpan",
    usemap: "useMap",
    frameborder: "frameBorder",
    contenteditable: "contentEditable"
  },
  
  prop: function( elem, name, value ) {
    var nType = elem.nodeType;

    // don't get/set properties on text, comment and attribute nodes
    if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
      return undefined;
    }

    var ret, hooks,
      notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

    // Try to normalize/fix the name
    name = notxml && jQuery.propFix[ name ] || name;
    
    hooks = jQuery.propHooks[ name ];

    if ( value !== undefined ) {
      if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
        return ret;

      } else {
        return (elem[ name ] = value);
      }

    } else {
      if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== undefined ) {
        return ret;

      } else {
        return elem[ name ];
      }
    }
  },
  
  propHooks: {}
});

// Hook for boolean attributes
boolHook = {
  get: function( elem, name ) {
    // Align boolean attributes with corresponding properties
    return elem[ jQuery.propFix[ name ] || name ] ?
      name.toLowerCase() :
      undefined;
  },
  set: function( elem, value, name ) {
    var propName;
    if ( value === false ) {
      // Remove boolean attributes when set to false
      jQuery.removeAttr( elem, name );
    } else {
      // value is true since we know at this point it's type boolean and not false
      // Set boolean attributes to the same name and set the DOM property
      propName = jQuery.propFix[ name ] || name;
      if ( propName in elem ) {
        // Only set the IDL specifically if it already exists on the element
        elem[ propName ] = value;
      }

      elem.setAttribute( name, name.toLowerCase() );
    }
    return name;
  }
};

// Use the value property for back compat
// Use the formHook for button elements in IE6/7 (#1954)
jQuery.attrHooks.value = {
  get: function( elem, name ) {
    if ( formHook && jQuery.nodeName( elem, "button" ) ) {
      return formHook.get( elem, name );
    }
    return elem.value;
  },
  set: function( elem, value, name ) {
    if ( formHook && jQuery.nodeName( elem, "button" ) ) {
      return formHook.set( elem, value, name );
    }
    // Does not return so that setAttribute is also used
    elem.value = value;
  }
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !jQuery.support.getSetAttribute ) {

  // propFix is more comprehensive and contains all fixes
  jQuery.attrFix = jQuery.propFix;
  
  // Use this for any attribute on a form in IE6/7
  formHook = jQuery.attrHooks.name = jQuery.valHooks.button = {
    get: function( elem, name ) {
      var ret;
      ret = elem.getAttributeNode( name );
      // Return undefined if nodeValue is empty string
      return ret && ret.nodeValue !== "" ?
        ret.nodeValue :
        undefined;
    },
    set: function( elem, value, name ) {
      // Check form objects in IE (multiple bugs related)
      // Only use nodeValue if the attribute node exists on the form
      var ret = elem.getAttributeNode( name );
      if ( ret ) {
        ret.nodeValue = value;
        return value;
      }
    }
  };

  // Set width and height to auto instead of 0 on empty string( Bug #8150 )
  // This is for removals
  jQuery.each([ "width", "height" ], function( i, name ) {
    jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
      set: function( elem, value ) {
        if ( value === "" ) {
          elem.setAttribute( name, "auto" );
          return value;
        }
      }
    });
  });
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
  jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
    jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
      get: function( elem ) {
        var ret = elem.getAttribute( name, 2 );
        return ret === null ? undefined : ret;
      }
    });
  });
}

if ( !jQuery.support.style ) {
  jQuery.attrHooks.style = {
    get: function( elem ) {
      // Return undefined in the case of empty string
      // Normalize to lowercase since IE uppercases css property names
      return elem.style.cssText.toLowerCase() || undefined;
    },
    set: function( elem, value ) {
      return (elem.style.cssText = "" + value);
    }
  };
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
  jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
    get: function( elem ) {
      var parent = elem.parentNode;

      if ( parent ) {
        parent.selectedIndex;

        // Make sure that it also works with optgroups, see #5701
        if ( parent.parentNode ) {
          parent.parentNode.selectedIndex;
        }
      }
    }
  });
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
  jQuery.each([ "radio", "checkbox" ], function() {
    jQuery.valHooks[ this ] = {
      get: function( elem ) {
        // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
        return elem.getAttribute("value") === null ? "on" : elem.value;
      }
    };
  });
}
jQuery.each([ "radio", "checkbox" ], function() {
  jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
    set: function( elem, value ) {
      if ( jQuery.isArray( value ) ) {
        return (elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0);
      }
    }
  });
});




var hasOwn = Object.prototype.hasOwnProperty,
  rnamespaces = /\.(.*)$/,
  rformElems = /^(?:textarea|input|select)$/i,
  rperiod = /\./g,
  rspaces = / /g,
  rescape = /[^\w\s.|`]/g,
  fcleanup = function( nm ) {
    return nm.replace(rescape, "\\$&");
  };

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

  // Bind an event to an element
  // Original by Dean Edwards
  add: function( elem, types, handler, data ) {
    if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
      return;
    }

    if ( handler === false ) {
      handler = returnFalse;
    } else if ( !handler ) {
      // Fixes bug #7229. Fix recommended by jdalton
      return;
    }

    var handleObjIn, handleObj;

    if ( handler.handler ) {
      handleObjIn = handler;
      handler = handleObjIn.handler;
    }

    // Make sure that the function being executed has a unique ID
    if ( !handler.guid ) {
      handler.guid = jQuery.guid++;
    }

    // Init the element's event structure
    var elemData = jQuery._data( elem );

    // If no elemData is found then we must be trying to bind to one of the
    // banned noData elements
    if ( !elemData ) {
      return;
    }

    var events = elemData.events,
      eventHandle = elemData.handle;

    if ( !events ) {
      elemData.events = events = {};
    }

    if ( !eventHandle ) {
      elemData.handle = eventHandle = function( e ) {
        // Discard the second event of a jQuery.event.trigger() and
        // when an event is called after a page has unloaded
        return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
          jQuery.event.handle.apply( eventHandle.elem, arguments ) :
          undefined;
      };
    }

    // Add elem as a property of the handle function
    // This is to prevent a memory leak with non-native events in IE.
    eventHandle.elem = elem;

    // Handle multiple events separated by a space
    // jQuery(...).bind("mouseover mouseout", fn);
    types = types.split(" ");

    var type, i = 0, namespaces;

    while ( (type = types[ i++ ]) ) {
      handleObj = handleObjIn ?
        jQuery.extend({}, handleObjIn) :
        { handler: handler, data: data };

      // Namespaced event handlers
      if ( type.indexOf(".") > -1 ) {
        namespaces = type.split(".");
        type = namespaces.shift();
        handleObj.namespace = namespaces.slice(0).sort().join(".");

      } else {
        namespaces = [];
        handleObj.namespace = "";
      }

      handleObj.type = type;
      if ( !handleObj.guid ) {
        handleObj.guid = handler.guid;
      }

      // Get the current list of functions bound to this event
      var handlers = events[ type ],
        special = jQuery.event.special[ type ] || {};

      // Init the event handler queue
      if ( !handlers ) {
        handlers = events[ type ] = [];

        // Check for a special event handler
        // Only use addEventListener/attachEvent if the special
        // events handler returns false
        if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
          // Bind the global event handler to the element
          if ( elem.addEventListener ) {
            elem.addEventListener( type, eventHandle, false );

          } else if ( elem.attachEvent ) {
            elem.attachEvent( "on" + type, eventHandle );
          }
        }
      }

      if ( special.add ) {
        special.add.call( elem, handleObj );

        if ( !handleObj.handler.guid ) {
          handleObj.handler.guid = handler.guid;
        }
      }

      // Add the function to the element's handler list
      handlers.push( handleObj );

      // Keep track of which events have been used, for event optimization
      jQuery.event.global[ type ] = true;
    }

    // Nullify elem to prevent memory leaks in IE
    elem = null;
  },

  global: {},

  // Detach an event or set of events from an element
  remove: function( elem, types, handler, pos ) {
    // don't do events on text and comment nodes
    if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
      return;
    }

    if ( handler === false ) {
      handler = returnFalse;
    }

    var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
      elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
      events = elemData && elemData.events;

    if ( !elemData || !events ) {
      return;
    }

    // types is actually an event object here
    if ( types && types.type ) {
      handler = types.handler;
      types = types.type;
    }

    // Unbind all events for the element
    if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
      types = types || "";

      for ( type in events ) {
        jQuery.event.remove( elem, type + types );
      }

      return;
    }

    // Handle multiple events separated by a space
    // jQuery(...).unbind("mouseover mouseout", fn);
    types = types.split(" ");

    while ( (type = types[ i++ ]) ) {
      origType = type;
      handleObj = null;
      all = type.indexOf(".") < 0;
      namespaces = [];

      if ( !all ) {
        // Namespaced event handlers
        namespaces = type.split(".");
        type = namespaces.shift();

        namespace = new RegExp("(^|\\.)" +
          jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)");
      }

      eventType = events[ type ];

      if ( !eventType ) {
        continue;
      }

      if ( !handler ) {
        for ( j = 0; j < eventType.length; j++ ) {
          handleObj = eventType[ j ];

          if ( all || namespace.test( handleObj.namespace ) ) {
            jQuery.event.remove( elem, origType, handleObj.handler, j );
            eventType.splice( j--, 1 );
          }
        }

        continue;
      }

      special = jQuery.event.special[ type ] || {};

      for ( j = pos || 0; j < eventType.length; j++ ) {
        handleObj = eventType[ j ];

        if ( handler.guid === handleObj.guid ) {
          // remove the given handler for the given type
          if ( all || namespace.test( handleObj.namespace ) ) {
            if ( pos == null ) {
              eventType.splice( j--, 1 );
            }

            if ( special.remove ) {
              special.remove.call( elem, handleObj );
            }
          }

          if ( pos != null ) {
            break;
          }
        }
      }

      // remove generic event handler if no more handlers exist
      if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
        if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
          jQuery.removeEvent( elem, type, elemData.handle );
        }

        ret = null;
        delete events[ type ];
      }
    }

    // Remove the expando if it's no longer used
    if ( jQuery.isEmptyObject( events ) ) {
      var handle = elemData.handle;
      if ( handle ) {
        handle.elem = null;
      }

      delete elemData.events;
      delete elemData.handle;

      if ( jQuery.isEmptyObject( elemData ) ) {
        jQuery.removeData( elem, undefined, true );
      }
    }
  },
  
  // Events that are safe to short-circuit if no handlers are attached.
  // Native DOM events should not be added, they may have inline handlers.
  customEvent: {
    "getData": true,
    "setData": true,
    "changeData": true
  },

  trigger: function( event, data, elem, onlyHandlers ) {
    // Event object or event type
    var type = event.type || event,
      namespaces = [],
      exclusive;

    if ( type.indexOf("!") >= 0 ) {
      // Exclusive events trigger only for the exact event (no namespaces)
      type = type.slice(0, -1);
      exclusive = true;
    }

    if ( type.indexOf(".") >= 0 ) {
      // Namespaced trigger; create a regexp to match event type in handle()
      namespaces = type.split(".");
      type = namespaces.shift();
      namespaces.sort();
    }

    if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
      // No jQuery handlers for this event type, and it can't have inline handlers
      return;
    }

    // Caller can pass in an Event, Object, or just an event type string
    event = typeof event === "object" ?
      // jQuery.Event object
      event[ jQuery.expando ] ? event :
      // Object literal
      new jQuery.Event( type, event ) :
      // Just the event type (string)
      new jQuery.Event( type );

    event.type = type;
    event.exclusive = exclusive;
    event.namespace = namespaces.join(".");
    event.namespace_re = new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)");
    
    // triggerHandler() and global events don't bubble or run the default action
    if ( onlyHandlers || !elem ) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Handle a global trigger
    if ( !elem ) {
      // TODO: Stop taunting the data cache; remove global events and always attach to document
      jQuery.each( jQuery.cache, function() {
        // internalKey variable is just used to make it easier to find
        // and potentially change this stuff later; currently it just
        // points to jQuery.expando
        var internalKey = jQuery.expando,
          internalCache = this[ internalKey ];
        if ( internalCache && internalCache.events && internalCache.events[ type ] ) {
          jQuery.event.trigger( event, data, internalCache.handle.elem );
        }
      });
      return;
    }

    // Don't do events on text and comment nodes
    if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
      return;
    }

    // Clean up the event in case it is being reused
    event.result = undefined;
    event.target = elem;

    // Clone any incoming data and prepend the event, creating the handler arg list
    data = data ? jQuery.makeArray( data ) : [];
    data.unshift( event );

    var cur = elem,
      // IE doesn't like method names with a colon (#3533, #8272)
      ontype = type.indexOf(":") < 0 ? "on" + type : "";

    // Fire event on the current element, then bubble up the DOM tree
    do {
      var handle = jQuery._data( cur, "handle" );

      event.currentTarget = cur;
      if ( handle ) {
        handle.apply( cur, data );
      }

      // Trigger an inline bound script
      if ( ontype && jQuery.acceptData( cur ) && cur[ ontype ] && cur[ ontype ].apply( cur, data ) === false ) {
        event.result = false;
        event.preventDefault();
      }

      // Bubble up to document, then to window
      cur = cur.parentNode || cur.ownerDocument || cur === event.target.ownerDocument && window;
    } while ( cur && !event.isPropagationStopped() );

    // If nobody prevented the default action, do it now
    if ( !event.isDefaultPrevented() ) {
      var old,
        special = jQuery.event.special[ type ] || {};

      if ( (!special._default || special._default.call( elem.ownerDocument, event ) === false) &&
        !(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

        // Call a native DOM method on the target with the same name name as the event.
        // Can't use an .isFunction)() check here because IE6/7 fails that test.
        // IE<9 dies on focus to hidden element (#1486), may want to revisit a try/catch.
        try {
          if ( ontype && elem[ type ] ) {
            // Don't re-trigger an onFOO event when we call its FOO() method
            old = elem[ ontype ];

            if ( old ) {
              elem[ ontype ] = null;
            }

            jQuery.event.triggered = type;
            elem[ type ]();
          }
        } catch ( ieError ) {}

        if ( old ) {
          elem[ ontype ] = old;
        }

        jQuery.event.triggered = undefined;
      }
    }
    
    return event.result;
  },

  handle: function( event ) {
    event = jQuery.event.fix( event || window.event );
    // Snapshot the handlers list since a called handler may add/remove events.
    var handlers = ((jQuery._data( this, "events" ) || {})[ event.type ] || []).slice(0),
      run_all = !event.exclusive && !event.namespace,
      args = Array.prototype.slice.call( arguments, 0 );

    // Use the fix-ed Event rather than the (read-only) native event
    args[0] = event;
    event.currentTarget = this;

    for ( var j = 0, l = handlers.length; j < l; j++ ) {
      var handleObj = handlers[ j ];

      // Triggered event must 1) be non-exclusive and have no namespace, or
      // 2) have namespace(s) a subset or equal to those in the bound event.
      if ( run_all || event.namespace_re.test( handleObj.namespace ) ) {
        // Pass in a reference to the handler function itself
        // So that we can later remove it
        event.handler = handleObj.handler;
        event.data = handleObj.data;
        event.handleObj = handleObj;

        var ret = handleObj.handler.apply( this, args );

        if ( ret !== undefined ) {
          event.result = ret;
          if ( ret === false ) {
            event.preventDefault();
            event.stopPropagation();
          }
        }

        if ( event.isImmediatePropagationStopped() ) {
          break;
        }
      }
    }
    return event.result;
  },

  props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

  fix: function( event ) {
    if ( event[ jQuery.expando ] ) {
      return event;
    }

    // store a copy of the original event object
    // and "clone" to set read-only properties
    var originalEvent = event;
    event = jQuery.Event( originalEvent );

    for ( var i = this.props.length, prop; i; ) {
      prop = this.props[ --i ];
      event[ prop ] = originalEvent[ prop ];
    }

    // Fix target property, if necessary
    if ( !event.target ) {
      // Fixes #1925 where srcElement might not be defined either
      event.target = event.srcElement || document;
    }

    // check if target is a textnode (safari)
    if ( event.target.nodeType === 3 ) {
      event.target = event.target.parentNode;
    }

    // Add relatedTarget, if necessary
    if ( !event.relatedTarget && event.fromElement ) {
      event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
    }

    // Calculate pageX/Y if missing and clientX/Y available
    if ( event.pageX == null && event.clientX != null ) {
      var eventDocument = event.target.ownerDocument || document,
        doc = eventDocument.documentElement,
        body = eventDocument.body;

      event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
    }

    // Add which for key events
    if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
      event.which = event.charCode != null ? event.charCode : event.keyCode;
    }

    // Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
    if ( !event.metaKey && event.ctrlKey ) {
      event.metaKey = event.ctrlKey;
    }

    // Add which for click: 1 === left; 2 === middle; 3 === right
    // Note: button is not normalized, so don't use it
    if ( !event.which && event.button !== undefined ) {
      event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
    }

    return event;
  },

  // Deprecated, use jQuery.guid instead
  guid: 1E8,

  // Deprecated, use jQuery.proxy instead
  proxy: jQuery.proxy,

  special: {
    ready: {
      // Make sure the ready event is setup
      setup: jQuery.bindReady,
      teardown: jQuery.noop
    },

    live: {
      add: function( handleObj ) {
        jQuery.event.add( this,
          liveConvert( handleObj.origType, handleObj.selector ),
          jQuery.extend({}, handleObj, {handler: liveHandler, guid: handleObj.handler.guid}) );
      },

      remove: function( handleObj ) {
        jQuery.event.remove( this, liveConvert( handleObj.origType, handleObj.selector ), handleObj );
      }
    },

    beforeunload: {
      setup: function( data, namespaces, eventHandle ) {
        // We only want to do this special case on windows
        if ( jQuery.isWindow( this ) ) {
          this.onbeforeunload = eventHandle;
        }
      },

      teardown: function( namespaces, eventHandle ) {
        if ( this.onbeforeunload === eventHandle ) {
          this.onbeforeunload = null;
        }
      }
    }
  }
};

jQuery.removeEvent = document.removeEventListener ?
  function( elem, type, handle ) {
    if ( elem.removeEventListener ) {
      elem.removeEventListener( type, handle, false );
    }
  } :
  function( elem, type, handle ) {
    if ( elem.detachEvent ) {
      elem.detachEvent( "on" + type, handle );
    }
  };

jQuery.Event = function( src, props ) {
  // Allow instantiation without the 'new' keyword
  if ( !this.preventDefault ) {
    return new jQuery.Event( src, props );
  }

  // Event object
  if ( src && src.type ) {
    this.originalEvent = src;
    this.type = src.type;

    // Events bubbling up the document may have been marked as prevented
    // by a handler lower down the tree; reflect the correct value.
    this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
      src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

  // Event type
  } else {
    this.type = src;
  }

  // Put explicitly provided properties onto the event object
  if ( props ) {
    jQuery.extend( this, props );
  }

  // timeStamp is buggy for some events on Firefox(#3843)
  // So we won't rely on the native value
  this.timeStamp = jQuery.now();

  // Mark it as fixed
  this[ jQuery.expando ] = true;
};

function returnFalse() {
  return false;
}
function returnTrue() {
  return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
  preventDefault: function() {
    this.isDefaultPrevented = returnTrue;

    var e = this.originalEvent;
    if ( !e ) {
      return;
    }

    // if preventDefault exists run it on the original event
    if ( e.preventDefault ) {
      e.preventDefault();

    // otherwise set the returnValue property of the original event to false (IE)
    } else {
      e.returnValue = false;
    }
  },
  stopPropagation: function() {
    this.isPropagationStopped = returnTrue;

    var e = this.originalEvent;
    if ( !e ) {
      return;
    }
    // if stopPropagation exists run it on the original event
    if ( e.stopPropagation ) {
      e.stopPropagation();
    }
    // otherwise set the cancelBubble property of the original event to true (IE)
    e.cancelBubble = true;
  },
  stopImmediatePropagation: function() {
    this.isImmediatePropagationStopped = returnTrue;
    this.stopPropagation();
  },
  isDefaultPrevented: returnFalse,
  isPropagationStopped: returnFalse,
  isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {
  // Check if mouse(over|out) are still within the same parent element
  var parent = event.relatedTarget;

  // set the correct event type
  event.type = event.data;

  // Firefox sometimes assigns relatedTarget a XUL element
  // which we cannot access the parentNode property of
  try {

    // Chrome does something similar, the parentNode property
    // can be accessed but is null.
    if ( parent && parent !== document && !parent.parentNode ) {
      return;
    }

    // Traverse up the tree
    while ( parent && parent !== this ) {
      parent = parent.parentNode;
    }

    if ( parent !== this ) {
      // handle event if we actually just moused on to a non sub-element
      jQuery.event.handle.apply( this, arguments );
    }

  // assuming we've left the element since we most likely mousedover a xul element
  } catch(e) { }
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
  event.type = event.data;
  jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
  mouseenter: "mouseover",
  mouseleave: "mouseout"
}, function( orig, fix ) {
  jQuery.event.special[ orig ] = {
    setup: function( data ) {
      jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
    },
    teardown: function( data ) {
      jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
    }
  };
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

  jQuery.event.special.submit = {
    setup: function( data, namespaces ) {
      if ( !jQuery.nodeName( this, "form" ) ) {
        jQuery.event.add(this, "click.specialSubmit", function( e ) {
          var elem = e.target,
            type = elem.type;

          if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
            trigger( "submit", this, arguments );
          }
        });

        jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
          var elem = e.target,
            type = elem.type;

          if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
            trigger( "submit", this, arguments );
          }
        });

      } else {
        return false;
      }
    },

    teardown: function( namespaces ) {
      jQuery.event.remove( this, ".specialSubmit" );
    }
  };

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

  var changeFilters,

  getVal = function( elem ) {
    var type = elem.type, val = elem.value;

    if ( type === "radio" || type === "checkbox" ) {
      val = elem.checked;

    } else if ( type === "select-multiple" ) {
      val = elem.selectedIndex > -1 ?
        jQuery.map( elem.options, function( elem ) {
          return elem.selected;
        }).join("-") :
        "";

    } else if ( jQuery.nodeName( elem, "select" ) ) {
      val = elem.selectedIndex;
    }

    return val;
  },

  testChange = function testChange( e ) {
    var elem = e.target, data, val;

    if ( !rformElems.test( elem.nodeName ) || elem.readOnly ) {
      return;
    }

    data = jQuery._data( elem, "_change_data" );
    val = getVal(elem);

    // the current data will be also retrieved by beforeactivate
    if ( e.type !== "focusout" || elem.type !== "radio" ) {
      jQuery._data( elem, "_change_data", val );
    }

    if ( data === undefined || val === data ) {
      return;
    }

    if ( data != null || val ) {
      e.type = "change";
      e.liveFired = undefined;
      jQuery.event.trigger( e, arguments[1], elem );
    }
  };

  jQuery.event.special.change = {
    filters: {
      focusout: testChange,

      beforedeactivate: testChange,

      click: function( e ) {
        var elem = e.target, type = jQuery.nodeName( elem, "input" ) ? elem.type : "";

        if ( type === "radio" || type === "checkbox" || jQuery.nodeName( elem, "select" ) ) {
          testChange.call( this, e );
        }
      },

      // Change has to be called before submit
      // Keydown will be called before keypress, which is used in submit-event delegation
      keydown: function( e ) {
        var elem = e.target, type = jQuery.nodeName( elem, "input" ) ? elem.type : "";

        if ( (e.keyCode === 13 && !jQuery.nodeName( elem, "textarea" ) ) ||
          (e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
          type === "select-multiple" ) {
          testChange.call( this, e );
        }
      },

      // Beforeactivate happens also before the previous element is blurred
      // with this event you can't trigger a change event, but you can store
      // information
      beforeactivate: function( e ) {
        var elem = e.target;
        jQuery._data( elem, "_change_data", getVal(elem) );
      }
    },

    setup: function( data, namespaces ) {
      if ( this.type === "file" ) {
        return false;
      }

      for ( var type in changeFilters ) {
        jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
      }

      return rformElems.test( this.nodeName );
    },

    teardown: function( namespaces ) {
      jQuery.event.remove( this, ".specialChange" );

      return rformElems.test( this.nodeName );
    }
  };

  changeFilters = jQuery.event.special.change.filters;

  // Handle when the input is .focus()'d
  changeFilters.focus = changeFilters.beforeactivate;
}

function trigger( type, elem, args ) {
  // Piggyback on a donor event to simulate a different one.
  // Fake originalEvent to avoid donor's stopPropagation, but if the
  // simulated event prevents default then we do the same on the donor.
  // Don't pass args or remember liveFired; they apply to the donor event.
  var event = jQuery.extend( {}, args[ 0 ] );
  event.type = type;
  event.originalEvent = {};
  event.liveFired = undefined;
  jQuery.event.handle.call( elem, event );
  if ( event.isDefaultPrevented() ) {
    args[ 0 ].preventDefault();
  }
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
  jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

    // Attach a single capturing handler while someone wants focusin/focusout
    var attaches = 0;

    jQuery.event.special[ fix ] = {
      setup: function() {
        if ( attaches++ === 0 ) {
          document.addEventListener( orig, handler, true );
        }
      },
      teardown: function() {
        if ( --attaches === 0 ) {
          document.removeEventListener( orig, handler, true );
        }
      }
    };

    function handler( donor ) {
      // Donor event is always a native one; fix it and switch its type.
      // Let focusin/out handler cancel the donor focus/blur event.
      var e = jQuery.event.fix( donor );
      e.type = fix;
      e.originalEvent = {};
      jQuery.event.trigger( e, null, e.target );
      if ( e.isDefaultPrevented() ) {
        donor.preventDefault();
      }
    }
  });
}

jQuery.each(["bind", "one"], function( i, name ) {
  jQuery.fn[ name ] = function( type, data, fn ) {
    var handler;

    // Handle object literals
    if ( typeof type === "object" ) {
      for ( var key in type ) {
        this[ name ](key, data, type[key], fn);
      }
      return this;
    }

    if ( arguments.length === 2 || data === false ) {
      fn = data;
      data = undefined;
    }

    if ( name === "one" ) {
      handler = function( event ) {
        jQuery( this ).unbind( event, handler );
        return fn.apply( this, arguments );
      };
      handler.guid = fn.guid || jQuery.guid++;
    } else {
      handler = fn;
    }

    if ( type === "unload" && name !== "one" ) {
      this.one( type, data, fn );

    } else {
      for ( var i = 0, l = this.length; i < l; i++ ) {
        jQuery.event.add( this[i], type, handler, data );
      }
    }

    return this;
  };
});

jQuery.fn.extend({
  unbind: function( type, fn ) {
    // Handle object literals
    if ( typeof type === "object" && !type.preventDefault ) {
      for ( var key in type ) {
        this.unbind(key, type[key]);
      }

    } else {
      for ( var i = 0, l = this.length; i < l; i++ ) {
        jQuery.event.remove( this[i], type, fn );
      }
    }

    return this;
  },

  delegate: function( selector, types, data, fn ) {
    return this.live( types, data, fn, selector );
  },

  undelegate: function( selector, types, fn ) {
    if ( arguments.length === 0 ) {
      return this.unbind( "live" );

    } else {
      return this.die( types, null, fn, selector );
    }
  },

  trigger: function( type, data ) {
    return this.each(function() {
      jQuery.event.trigger( type, data, this );
    });
  },

  triggerHandler: function( type, data ) {
    if ( this[0] ) {
      return jQuery.event.trigger( type, data, this[0], true );
    }
  },

  toggle: function( fn ) {
    // Save reference to arguments for access in closure
    var args = arguments,
      guid = fn.guid || jQuery.guid++,
      i = 0,
      toggler = function( event ) {
        // Figure out which function to execute
        var lastToggle = ( jQuery.data( this, "lastToggle" + fn.guid ) || 0 ) % i;
        jQuery.data( this, "lastToggle" + fn.guid, lastToggle + 1 );

        // Make sure that clicks stop
        event.preventDefault();

        // and execute the function
        return args[ lastToggle ].apply( this, arguments ) || false;
      };

    // link all the functions, so any of them can unbind this click handler
    toggler.guid = guid;
    while ( i < args.length ) {
      args[ i++ ].guid = guid;
    }

    return this.click( toggler );
  },

  hover: function( fnOver, fnOut ) {
    return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
  }
});

var liveMap = {
  focus: "focusin",
  blur: "focusout",
  mouseenter: "mouseover",
  mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
  jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
    var type, i = 0, match, namespaces, preType,
      selector = origSelector || this.selector,
      context = origSelector ? this : jQuery( this.context );

    if ( typeof types === "object" && !types.preventDefault ) {
      for ( var key in types ) {
        context[ name ]( key, data, types[key], selector );
      }

      return this;
    }

    if ( name === "die" && !types &&
          origSelector && origSelector.charAt(0) === "." ) {

      context.unbind( origSelector );

      return this;
    }

    if ( data === false || jQuery.isFunction( data ) ) {
      fn = data || returnFalse;
      data = undefined;
    }

    types = (types || "").split(" ");

    while ( (type = types[ i++ ]) != null ) {
      match = rnamespaces.exec( type );
      namespaces = "";

      if ( match )  {
        namespaces = match[0];
        type = type.replace( rnamespaces, "" );
      }

      if ( type === "hover" ) {
        types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
        continue;
      }

      preType = type;

      if ( liveMap[ type ] ) {
        types.push( liveMap[ type ] + namespaces );
        type = type + namespaces;

      } else {
        type = (liveMap[ type ] || type) + namespaces;
      }

      if ( name === "live" ) {
        // bind live handler
        for ( var j = 0, l = context.length; j < l; j++ ) {
          jQuery.event.add( context[j], "live." + liveConvert( type, selector ),
            { data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
        }

      } else {
        // unbind live handler
        context.unbind( "live." + liveConvert( type, selector ), fn );
      }
    }

    return this;
  };
});

function liveHandler( event ) {
  var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
    elems = [],
    selectors = [],
    events = jQuery._data( this, "events" );

  // Make sure we avoid non-left-click bubbling in Firefox (#3861) and disabled elements in IE (#6911)
  if ( event.liveFired === this || !events || !events.live || event.target.disabled || event.button && event.type === "click" ) {
    return;
  }

  if ( event.namespace ) {
    namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
  }

  event.liveFired = this;

  var live = events.live.slice(0);

  for ( j = 0; j < live.length; j++ ) {
    handleObj = live[j];

    if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
      selectors.push( handleObj.selector );

    } else {
      live.splice( j--, 1 );
    }
  }

  match = jQuery( event.target ).closest( selectors, event.currentTarget );

  for ( i = 0, l = match.length; i < l; i++ ) {
    close = match[i];

    for ( j = 0; j < live.length; j++ ) {
      handleObj = live[j];

      if ( close.selector === handleObj.selector && (!namespace || namespace.test( handleObj.namespace )) && !close.elem.disabled ) {
        elem = close.elem;
        related = null;

        // Those two events require additional checking
        if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
          event.type = handleObj.preType;
          related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];

          // Make sure not to accidentally match a child element with the same selector
          if ( related && jQuery.contains( elem, related ) ) {
            related = elem;
          }
        }

        if ( !related || related !== elem ) {
          elems.push({ elem: elem, handleObj: handleObj, level: close.level });
        }
      }
    }
  }

  for ( i = 0, l = elems.length; i < l; i++ ) {
    match = elems[i];

    if ( maxLevel && match.level > maxLevel ) {
      break;
    }

    event.currentTarget = match.elem;
    event.data = match.handleObj.data;
    event.handleObj = match.handleObj;

    ret = match.handleObj.origHandler.apply( match.elem, arguments );

    if ( ret === false || event.isPropagationStopped() ) {
      maxLevel = match.level;

      if ( ret === false ) {
        stop = false;
      }
      if ( event.isImmediatePropagationStopped() ) {
        break;
      }
    }
  }

  return stop;
}

function liveConvert( type, selector ) {
  return (type && type !== "*" ? type + "." : "") + selector.replace(rperiod, "`").replace(rspaces, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
  "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
  "change select submit keydown keypress keyup error").split(" "), function( i, name ) {

  // Handle event binding
  jQuery.fn[ name ] = function( data, fn ) {
    if ( fn == null ) {
      fn = data;
      data = null;
    }

    return arguments.length > 0 ?
      this.bind( name, data, fn ) :
      this.trigger( name );
  };

  if ( jQuery.attrFn ) {
    jQuery.attrFn[ name ] = true;
  }
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
  done = 0,
  toString = Object.prototype.toString,
  hasDuplicate = false,
  baseHasDuplicate = true,
  rBackslash = /\\/g,
  rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
  baseHasDuplicate = false;
  return 0;
});

var Sizzle = function( selector, context, results, seed ) {
  results = results || [];
  context = context || document;

  var origContext = context;

  if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
    return [];
  }
  
  if ( !selector || typeof selector !== "string" ) {
    return results;
  }

  var m, set, checkSet, extra, ret, cur, pop, i,
    prune = true,
    contextXML = Sizzle.isXML( context ),
    parts = [],
    soFar = selector;
  
  // Reset the position of the chunker regexp (start from head)
  do {
    chunker.exec( "" );
    m = chunker.exec( soFar );

    if ( m ) {
      soFar = m[3];
    
      parts.push( m[1] );
    
      if ( m[2] ) {
        extra = m[3];
        break;
      }
    }
  } while ( m );

  if ( parts.length > 1 && origPOS.exec( selector ) ) {

    if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
      set = posProcess( parts[0] + parts[1], context );

    } else {
      set = Expr.relative[ parts[0] ] ?
        [ context ] :
        Sizzle( parts.shift(), context );

      while ( parts.length ) {
        selector = parts.shift();

        if ( Expr.relative[ selector ] ) {
          selector += parts.shift();
        }
        
        set = posProcess( selector, set );
      }
    }

  } else {
    // Take a shortcut and set the context if the root selector is an ID
    // (but not if it'll be faster if the inner selector is an ID)
    if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
        Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

      ret = Sizzle.find( parts.shift(), context, contextXML );
      context = ret.expr ?
        Sizzle.filter( ret.expr, ret.set )[0] :
        ret.set[0];
    }

    if ( context ) {
      ret = seed ?
        { expr: parts.pop(), set: makeArray(seed) } :
        Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

      set = ret.expr ?
        Sizzle.filter( ret.expr, ret.set ) :
        ret.set;

      if ( parts.length > 0 ) {
        checkSet = makeArray( set );

      } else {
        prune = false;
      }

      while ( parts.length ) {
        cur = parts.pop();
        pop = cur;

        if ( !Expr.relative[ cur ] ) {
          cur = "";
        } else {
          pop = parts.pop();
        }

        if ( pop == null ) {
          pop = context;
        }

        Expr.relative[ cur ]( checkSet, pop, contextXML );
      }

    } else {
      checkSet = parts = [];
    }
  }

  if ( !checkSet ) {
    checkSet = set;
  }

  if ( !checkSet ) {
    Sizzle.error( cur || selector );
  }

  if ( toString.call(checkSet) === "[object Array]" ) {
    if ( !prune ) {
      results.push.apply( results, checkSet );

    } else if ( context && context.nodeType === 1 ) {
      for ( i = 0; checkSet[i] != null; i++ ) {
        if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
          results.push( set[i] );
        }
      }

    } else {
      for ( i = 0; checkSet[i] != null; i++ ) {
        if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
          results.push( set[i] );
        }
      }
    }

  } else {
    makeArray( checkSet, results );
  }

  if ( extra ) {
    Sizzle( extra, origContext, results, seed );
    Sizzle.uniqueSort( results );
  }

  return results;
};

Sizzle.uniqueSort = function( results ) {
  if ( sortOrder ) {
    hasDuplicate = baseHasDuplicate;
    results.sort( sortOrder );

    if ( hasDuplicate ) {
      for ( var i = 1; i < results.length; i++ ) {
        if ( results[i] === results[ i - 1 ] ) {
          results.splice( i--, 1 );
        }
      }
    }
  }

  return results;
};

Sizzle.matches = function( expr, set ) {
  return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
  return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
  var set;

  if ( !expr ) {
    return [];
  }

  for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
    var match,
      type = Expr.order[i];
    
    if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
      var left = match[1];
      match.splice( 1, 1 );

      if ( left.substr( left.length - 1 ) !== "\\" ) {
        match[1] = (match[1] || "").replace( rBackslash, "" );
        set = Expr.find[ type ]( match, context, isXML );

        if ( set != null ) {
          expr = expr.replace( Expr.match[ type ], "" );
          break;
        }
      }
    }
  }

  if ( !set ) {
    set = typeof context.getElementsByTagName !== "undefined" ?
      context.getElementsByTagName( "*" ) :
      [];
  }

  return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
  var match, anyFound,
    old = expr,
    result = [],
    curLoop = set,
    isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

  while ( expr && set.length ) {
    for ( var type in Expr.filter ) {
      if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
        var found, item,
          filter = Expr.filter[ type ],
          left = match[1];

        anyFound = false;

        match.splice(1,1);

        if ( left.substr( left.length - 1 ) === "\\" ) {
          continue;
        }

        if ( curLoop === result ) {
          result = [];
        }

        if ( Expr.preFilter[ type ] ) {
          match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

          if ( !match ) {
            anyFound = found = true;

          } else if ( match === true ) {
            continue;
          }
        }

        if ( match ) {
          for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
            if ( item ) {
              found = filter( item, match, i, curLoop );
              var pass = not ^ !!found;

              if ( inplace && found != null ) {
                if ( pass ) {
                  anyFound = true;

                } else {
                  curLoop[i] = false;
                }

              } else if ( pass ) {
                result.push( item );
                anyFound = true;
              }
            }
          }
        }

        if ( found !== undefined ) {
          if ( !inplace ) {
            curLoop = result;
          }

          expr = expr.replace( Expr.match[ type ], "" );

          if ( !anyFound ) {
            return [];
          }

          break;
        }
      }
    }

    // Improper expression
    if ( expr === old ) {
      if ( anyFound == null ) {
        Sizzle.error( expr );

      } else {
        break;
      }
    }

    old = expr;
  }

  return curLoop;
};

Sizzle.error = function( msg ) {
  throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
  order: [ "ID", "NAME", "TAG" ],

  match: {
    ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
    CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
    NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
    ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
    TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
    CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
    POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
    PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
  },

  leftMatch: {},

  attrMap: {
    "class": "className",
    "for": "htmlFor"
  },

  attrHandle: {
    href: function( elem ) {
      return elem.getAttribute( "href" );
    },
    type: function( elem ) {
      return elem.getAttribute( "type" );
    }
  },

  relative: {
    "+": function(checkSet, part){
      var isPartStr = typeof part === "string",
        isTag = isPartStr && !rNonWord.test( part ),
        isPartStrNotTag = isPartStr && !isTag;

      if ( isTag ) {
        part = part.toLowerCase();
      }

      for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
        if ( (elem = checkSet[i]) ) {
          while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

          checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
            elem || false :
            elem === part;
        }
      }

      if ( isPartStrNotTag ) {
        Sizzle.filter( part, checkSet, true );
      }
    },

    ">": function( checkSet, part ) {
      var elem,
        isPartStr = typeof part === "string",
        i = 0,
        l = checkSet.length;

      if ( isPartStr && !rNonWord.test( part ) ) {
        part = part.toLowerCase();

        for ( ; i < l; i++ ) {
          elem = checkSet[i];

          if ( elem ) {
            var parent = elem.parentNode;
            checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
          }
        }

      } else {
        for ( ; i < l; i++ ) {
          elem = checkSet[i];

          if ( elem ) {
            checkSet[i] = isPartStr ?
              elem.parentNode :
              elem.parentNode === part;
          }
        }

        if ( isPartStr ) {
          Sizzle.filter( part, checkSet, true );
        }
      }
    },

    "": function(checkSet, part, isXML){
      var nodeCheck,
        doneName = done++,
        checkFn = dirCheck;

      if ( typeof part === "string" && !rNonWord.test( part ) ) {
        part = part.toLowerCase();
        nodeCheck = part;
        checkFn = dirNodeCheck;
      }

      checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
    },

    "~": function( checkSet, part, isXML ) {
      var nodeCheck,
        doneName = done++,
        checkFn = dirCheck;

      if ( typeof part === "string" && !rNonWord.test( part ) ) {
        part = part.toLowerCase();
        nodeCheck = part;
        checkFn = dirNodeCheck;
      }

      checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
    }
  },

  find: {
    ID: function( match, context, isXML ) {
      if ( typeof context.getElementById !== "undefined" && !isXML ) {
        var m = context.getElementById(match[1]);
        // Check parentNode to catch when Blackberry 4.6 returns
        // nodes that are no longer in the document #6963
        return m && m.parentNode ? [m] : [];
      }
    },

    NAME: function( match, context ) {
      if ( typeof context.getElementsByName !== "undefined" ) {
        var ret = [],
          results = context.getElementsByName( match[1] );

        for ( var i = 0, l = results.length; i < l; i++ ) {
          if ( results[i].getAttribute("name") === match[1] ) {
            ret.push( results[i] );
          }
        }

        return ret.length === 0 ? null : ret;
      }
    },

    TAG: function( match, context ) {
      if ( typeof context.getElementsByTagName !== "undefined" ) {
        return context.getElementsByTagName( match[1] );
      }
    }
  },
  preFilter: {
    CLASS: function( match, curLoop, inplace, result, not, isXML ) {
      match = " " + match[1].replace( rBackslash, "" ) + " ";

      if ( isXML ) {
        return match;
      }

      for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
        if ( elem ) {
          if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
            if ( !inplace ) {
              result.push( elem );
            }

          } else if ( inplace ) {
            curLoop[i] = false;
          }
        }
      }

      return false;
    },

    ID: function( match ) {
      return match[1].replace( rBackslash, "" );
    },

    TAG: function( match, curLoop ) {
      return match[1].replace( rBackslash, "" ).toLowerCase();
    },

    CHILD: function( match ) {
      if ( match[1] === "nth" ) {
        if ( !match[2] ) {
          Sizzle.error( match[0] );
        }

        match[2] = match[2].replace(/^\+|\s*/g, '');

        // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
        var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
          match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
          !/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

        // calculate the numbers (first)n+(last) including if they are negative
        match[2] = (test[1] + (test[2] || 1)) - 0;
        match[3] = test[3] - 0;
      }
      else if ( match[2] ) {
        Sizzle.error( match[0] );
      }

      // TODO: Move to normal caching system
      match[0] = done++;

      return match;
    },

    ATTR: function( match, curLoop, inplace, result, not, isXML ) {
      var name = match[1] = match[1].replace( rBackslash, "" );
      
      if ( !isXML && Expr.attrMap[name] ) {
        match[1] = Expr.attrMap[name];
      }

      // Handle if an un-quoted value was used
      match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

      if ( match[2] === "~=" ) {
        match[4] = " " + match[4] + " ";
      }

      return match;
    },

    PSEUDO: function( match, curLoop, inplace, result, not ) {
      if ( match[1] === "not" ) {
        // If we're dealing with a complex expression, or a simple one
        if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
          match[3] = Sizzle(match[3], null, null, curLoop);

        } else {
          var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

          if ( !inplace ) {
            result.push.apply( result, ret );
          }

          return false;
        }

      } else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
        return true;
      }
      
      return match;
    },

    POS: function( match ) {
      match.unshift( true );

      return match;
    }
  },
  
  filters: {
    enabled: function( elem ) {
      return elem.disabled === false && elem.type !== "hidden";
    },

    disabled: function( elem ) {
      return elem.disabled === true;
    },

    checked: function( elem ) {
      return elem.checked === true;
    },
    
    selected: function( elem ) {
      // Accessing this property makes selected-by-default
      // options in Safari work properly
      if ( elem.parentNode ) {
        elem.parentNode.selectedIndex;
      }
      
      return elem.selected === true;
    },

    parent: function( elem ) {
      return !!elem.firstChild;
    },

    empty: function( elem ) {
      return !elem.firstChild;
    },

    has: function( elem, i, match ) {
      return !!Sizzle( match[3], elem ).length;
    },

    header: function( elem ) {
      return (/h\d/i).test( elem.nodeName );
    },

    text: function( elem ) {
      var attr = elem.getAttribute( "type" ), type = elem.type;
      // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
      // use getAttribute instead to test this case
      return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
    },

    radio: function( elem ) {
      return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
    },

    checkbox: function( elem ) {
      return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
    },

    file: function( elem ) {
      return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
    },

    password: function( elem ) {
      return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
    },

    submit: function( elem ) {
      var name = elem.nodeName.toLowerCase();
      return (name === "input" || name === "button") && "submit" === elem.type;
    },

    image: function( elem ) {
      return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
    },

    reset: function( elem ) {
      var name = elem.nodeName.toLowerCase();
      return (name === "input" || name === "button") && "reset" === elem.type;
    },

    button: function( elem ) {
      var name = elem.nodeName.toLowerCase();
      return name === "input" && "button" === elem.type || name === "button";
    },

    input: function( elem ) {
      return (/input|select|textarea|button/i).test( elem.nodeName );
    },

    focus: function( elem ) {
      return elem === elem.ownerDocument.activeElement;
    }
  },
  setFilters: {
    first: function( elem, i ) {
      return i === 0;
    },

    last: function( elem, i, match, array ) {
      return i === array.length - 1;
    },

    even: function( elem, i ) {
      return i % 2 === 0;
    },

    odd: function( elem, i ) {
      return i % 2 === 1;
    },

    lt: function( elem, i, match ) {
      return i < match[3] - 0;
    },

    gt: function( elem, i, match ) {
      return i > match[3] - 0;
    },

    nth: function( elem, i, match ) {
      return match[3] - 0 === i;
    },

    eq: function( elem, i, match ) {
      return match[3] - 0 === i;
    }
  },
  filter: {
    PSEUDO: function( elem, match, i, array ) {
      var name = match[1],
        filter = Expr.filters[ name ];

      if ( filter ) {
        return filter( elem, i, match, array );

      } else if ( name === "contains" ) {
        return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

      } else if ( name === "not" ) {
        var not = match[3];

        for ( var j = 0, l = not.length; j < l; j++ ) {
          if ( not[j] === elem ) {
            return false;
          }
        }

        return true;

      } else {
        Sizzle.error( name );
      }
    },

    CHILD: function( elem, match ) {
      var type = match[1],
        node = elem;

      switch ( type ) {
        case "only":
        case "first":
          while ( (node = node.previousSibling) )  {
            if ( node.nodeType === 1 ) { 
              return false; 
            }
          }

          if ( type === "first" ) { 
            return true; 
          }

          node = elem;

        case "last":
          while ( (node = node.nextSibling) )  {
            if ( node.nodeType === 1 ) { 
              return false; 
            }
          }

          return true;

        case "nth":
          var first = match[2],
            last = match[3];

          if ( first === 1 && last === 0 ) {
            return true;
          }
          
          var doneName = match[0],
            parent = elem.parentNode;
  
          if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
            var count = 0;
            
            for ( node = parent.firstChild; node; node = node.nextSibling ) {
              if ( node.nodeType === 1 ) {
                node.nodeIndex = ++count;
              }
            } 

            parent.sizcache = doneName;
          }
          
          var diff = elem.nodeIndex - last;

          if ( first === 0 ) {
            return diff === 0;

          } else {
            return ( diff % first === 0 && diff / first >= 0 );
          }
      }
    },

    ID: function( elem, match ) {
      return elem.nodeType === 1 && elem.getAttribute("id") === match;
    },

    TAG: function( elem, match ) {
      return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
    },
    
    CLASS: function( elem, match ) {
      return (" " + (elem.className || elem.getAttribute("class")) + " ")
        .indexOf( match ) > -1;
    },

    ATTR: function( elem, match ) {
      var name = match[1],
        result = Expr.attrHandle[ name ] ?
          Expr.attrHandle[ name ]( elem ) :
          elem[ name ] != null ?
            elem[ name ] :
            elem.getAttribute( name ),
        value = result + "",
        type = match[2],
        check = match[4];

      return result == null ?
        type === "!=" :
        type === "=" ?
        value === check :
        type === "*=" ?
        value.indexOf(check) >= 0 :
        type === "~=" ?
        (" " + value + " ").indexOf(check) >= 0 :
        !check ?
        value && result !== false :
        type === "!=" ?
        value !== check :
        type === "^=" ?
        value.indexOf(check) === 0 :
        type === "$=" ?
        value.substr(value.length - check.length) === check :
        type === "|=" ?
        value === check || value.substr(0, check.length + 1) === check + "-" :
        false;
    },

    POS: function( elem, match, i, array ) {
      var name = match[2],
        filter = Expr.setFilters[ name ];

      if ( filter ) {
        return filter( elem, i, match, array );
      }
    }
  }
};

var origPOS = Expr.match.POS,
  fescape = function(all, num){
    return "\\" + (num - 0 + 1);
  };

for ( var type in Expr.match ) {
  Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
  Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
  array = Array.prototype.slice.call( array, 0 );

  if ( results ) {
    results.push.apply( results, array );
    return results;
  }
  
  return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
  Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
  makeArray = function( array, results ) {
    var i = 0,
      ret = results || [];

    if ( toString.call(array) === "[object Array]" ) {
      Array.prototype.push.apply( ret, array );

    } else {
      if ( typeof array.length === "number" ) {
        for ( var l = array.length; i < l; i++ ) {
          ret.push( array[i] );
        }

      } else {
        for ( ; array[i]; i++ ) {
          ret.push( array[i] );
        }
      }
    }

    return ret;
  };
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
  sortOrder = function( a, b ) {
    if ( a === b ) {
      hasDuplicate = true;
      return 0;
    }

    if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
      return a.compareDocumentPosition ? -1 : 1;
    }

    return a.compareDocumentPosition(b) & 4 ? -1 : 1;
  };

} else {
  sortOrder = function( a, b ) {
    // The nodes are identical, we can exit early
    if ( a === b ) {
      hasDuplicate = true;
      return 0;

    // Fallback to using sourceIndex (in IE) if it's available on both nodes
    } else if ( a.sourceIndex && b.sourceIndex ) {
      return a.sourceIndex - b.sourceIndex;
    }

    var al, bl,
      ap = [],
      bp = [],
      aup = a.parentNode,
      bup = b.parentNode,
      cur = aup;

    // If the nodes are siblings (or identical) we can do a quick check
    if ( aup === bup ) {
      return siblingCheck( a, b );

    // If no parents were found then the nodes are disconnected
    } else if ( !aup ) {
      return -1;

    } else if ( !bup ) {
      return 1;
    }

    // Otherwise they're somewhere else in the tree so we need
    // to build up a full list of the parentNodes for comparison
    while ( cur ) {
      ap.unshift( cur );
      cur = cur.parentNode;
    }

    cur = bup;

    while ( cur ) {
      bp.unshift( cur );
      cur = cur.parentNode;
    }

    al = ap.length;
    bl = bp.length;

    // Start walking down the tree looking for a discrepancy
    for ( var i = 0; i < al && i < bl; i++ ) {
      if ( ap[i] !== bp[i] ) {
        return siblingCheck( ap[i], bp[i] );
      }
    }

    // We ended someplace up the tree so do a sibling check
    return i === al ?
      siblingCheck( a, bp[i], -1 ) :
      siblingCheck( ap[i], b, 1 );
  };

  siblingCheck = function( a, b, ret ) {
    if ( a === b ) {
      return ret;
    }

    var cur = a.nextSibling;

    while ( cur ) {
      if ( cur === b ) {
        return -1;
      }

      cur = cur.nextSibling;
    }

    return 1;
  };
}

// Utility function for retreiving the text value of an array of DOM nodes
Sizzle.getText = function( elems ) {
  var ret = "", elem;

  for ( var i = 0; elems[i]; i++ ) {
    elem = elems[i];

    // Get the text from text nodes and CDATA nodes
    if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
      ret += elem.nodeValue;

    // Traverse everything else, except comment nodes
    } else if ( elem.nodeType !== 8 ) {
      ret += Sizzle.getText( elem.childNodes );
    }
  }

  return ret;
};

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
  // We're going to inject a fake input element with a specified name
  var form = document.createElement("div"),
    id = "script" + (new Date()).getTime(),
    root = document.documentElement;

  form.innerHTML = "<a name='" + id + "'/>";

  // Inject it into the root element, check its status, and remove it quickly
  root.insertBefore( form, root.firstChild );

  // The workaround has to do additional checks after a getElementById
  // Which slows things down for other browsers (hence the branching)
  if ( document.getElementById( id ) ) {
    Expr.find.ID = function( match, context, isXML ) {
      if ( typeof context.getElementById !== "undefined" && !isXML ) {
        var m = context.getElementById(match[1]);

        return m ?
          m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
            [m] :
            undefined :
          [];
      }
    };

    Expr.filter.ID = function( elem, match ) {
      var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

      return elem.nodeType === 1 && node && node.nodeValue === match;
    };
  }

  root.removeChild( form );

  // release memory in IE
  root = form = null;
})();

(function(){
  // Check to see if the browser returns only elements
  // when doing getElementsByTagName("*")

  // Create a fake element
  var div = document.createElement("div");
  div.appendChild( document.createComment("") );

  // Make sure no comments are found
  if ( div.getElementsByTagName("*").length > 0 ) {
    Expr.find.TAG = function( match, context ) {
      var results = context.getElementsByTagName( match[1] );

      // Filter out possible comments
      if ( match[1] === "*" ) {
        var tmp = [];

        for ( var i = 0; results[i]; i++ ) {
          if ( results[i].nodeType === 1 ) {
            tmp.push( results[i] );
          }
        }

        results = tmp;
      }

      return results;
    };
  }

  // Check to see if an attribute returns normalized href attributes
  div.innerHTML = "<a href='#'></a>";

  if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
      div.firstChild.getAttribute("href") !== "#" ) {

    Expr.attrHandle.href = function( elem ) {
      return elem.getAttribute( "href", 2 );
    };
  }

  // release memory in IE
  div = null;
})();

if ( document.querySelectorAll ) {
  (function(){
    var oldSizzle = Sizzle,
      div = document.createElement("div"),
      id = "__sizzle__";

    div.innerHTML = "<p class='TEST'></p>";

    // Safari can't handle uppercase or unicode characters when
    // in quirks mode.
    if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
      return;
    }
  
    Sizzle = function( query, context, extra, seed ) {
      context = context || document;

      // Only use querySelectorAll on non-XML documents
      // (ID selectors don't work in non-HTML documents)
      if ( !seed && !Sizzle.isXML(context) ) {
        // See if we find a selector to speed up
        var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
        
        if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
          // Speed-up: Sizzle("TAG")
          if ( match[1] ) {
            return makeArray( context.getElementsByTagName( query ), extra );
          
          // Speed-up: Sizzle(".CLASS")
          } else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
            return makeArray( context.getElementsByClassName( match[2] ), extra );
          }
        }
        
        if ( context.nodeType === 9 ) {
          // Speed-up: Sizzle("body")
          // The body element only exists once, optimize finding it
          if ( query === "body" && context.body ) {
            return makeArray( [ context.body ], extra );
            
          // Speed-up: Sizzle("#ID")
          } else if ( match && match[3] ) {
            var elem = context.getElementById( match[3] );

            // Check parentNode to catch when Blackberry 4.6 returns
            // nodes that are no longer in the document #6963
            if ( elem && elem.parentNode ) {
              // Handle the case where IE and Opera return items
              // by name instead of ID
              if ( elem.id === match[3] ) {
                return makeArray( [ elem ], extra );
              }
              
            } else {
              return makeArray( [], extra );
            }
          }
          
          try {
            return makeArray( context.querySelectorAll(query), extra );
          } catch(qsaError) {}

        // qSA works strangely on Element-rooted queries
        // We can work around this by specifying an extra ID on the root
        // and working up from there (Thanks to Andrew Dupont for the technique)
        // IE 8 doesn't work on object elements
        } else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
          var oldContext = context,
            old = context.getAttribute( "id" ),
            nid = old || id,
            hasParent = context.parentNode,
            relativeHierarchySelector = /^\s*[+~]/.test( query );

          if ( !old ) {
            context.setAttribute( "id", nid );
          } else {
            nid = nid.replace( /'/g, "\\$&" );
          }
          if ( relativeHierarchySelector && hasParent ) {
            context = context.parentNode;
          }

          try {
            if ( !relativeHierarchySelector || hasParent ) {
              return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
            }

          } catch(pseudoError) {
          } finally {
            if ( !old ) {
              oldContext.removeAttribute( "id" );
            }
          }
        }
      }
    
      return oldSizzle(query, context, extra, seed);
    };

    for ( var prop in oldSizzle ) {
      Sizzle[ prop ] = oldSizzle[ prop ];
    }

    // release memory in IE
    div = null;
  })();
}

(function(){
  var html = document.documentElement,
    matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

  if ( matches ) {
    // Check to see if it's possible to do matchesSelector
    // on a disconnected node (IE 9 fails this)
    var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
      pseudoWorks = false;

    try {
      // This should fail with an exception
      // Gecko does not error, returns false instead
      matches.call( document.documentElement, "[test!='']:sizzle" );
  
    } catch( pseudoError ) {
      pseudoWorks = true;
    }

    Sizzle.matchesSelector = function( node, expr ) {
      // Make sure that attribute selectors are quoted
      expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

      if ( !Sizzle.isXML( node ) ) {
        try { 
          if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
            var ret = matches.call( node, expr );

            // IE 9's matchesSelector returns false on disconnected nodes
            if ( ret || !disconnectedMatch ||
                // As well, disconnected nodes are said to be in a document
                // fragment in IE 9, so check for that
                node.document && node.document.nodeType !== 11 ) {
              return ret;
            }
          }
        } catch(e) {}
      }

      return Sizzle(expr, null, null, [node]).length > 0;
    };
  }
})();

(function(){
  var div = document.createElement("div");

  div.innerHTML = "<div class='test e'></div><div class='test'></div>";

  // Opera can't find a second classname (in 9.6)
  // Also, make sure that getElementsByClassName actually exists
  if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
    return;
  }

  // Safari caches class attributes, doesn't catch changes (in 3.2)
  div.lastChild.className = "e";

  if ( div.getElementsByClassName("e").length === 1 ) {
    return;
  }
  
  Expr.order.splice(1, 0, "CLASS");
  Expr.find.CLASS = function( match, context, isXML ) {
    if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
      return context.getElementsByClassName(match[1]);
    }
  };

  // release memory in IE
  div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
  for ( var i = 0, l = checkSet.length; i < l; i++ ) {
    var elem = checkSet[i];

    if ( elem ) {
      var match = false;

      elem = elem[dir];

      while ( elem ) {
        if ( elem.sizcache === doneName ) {
          match = checkSet[elem.sizset];
          break;
        }

        if ( elem.nodeType === 1 && !isXML ){
          elem.sizcache = doneName;
          elem.sizset = i;
        }

        if ( elem.nodeName.toLowerCase() === cur ) {
          match = elem;
          break;
        }

        elem = elem[dir];
      }

      checkSet[i] = match;
    }
  }
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
  for ( var i = 0, l = checkSet.length; i < l; i++ ) {
    var elem = checkSet[i];

    if ( elem ) {
      var match = false;
      
      elem = elem[dir];

      while ( elem ) {
        if ( elem.sizcache === doneName ) {
          match = checkSet[elem.sizset];
          break;
        }

        if ( elem.nodeType === 1 ) {
          if ( !isXML ) {
            elem.sizcache = doneName;
            elem.sizset = i;
          }

          if ( typeof cur !== "string" ) {
            if ( elem === cur ) {
              match = true;
              break;
            }

          } else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
            match = elem;
            break;
          }
        }

        elem = elem[dir];
      }

      checkSet[i] = match;
    }
  }
}

if ( document.documentElement.contains ) {
  Sizzle.contains = function( a, b ) {
    return a !== b && (a.contains ? a.contains(b) : true);
  };

} else if ( document.documentElement.compareDocumentPosition ) {
  Sizzle.contains = function( a, b ) {
    return !!(a.compareDocumentPosition(b) & 16);
  };

} else {
  Sizzle.contains = function() {
    return false;
  };
}

Sizzle.isXML = function( elem ) {
  // documentElement is verified for cases where it doesn't yet exist
  // (such as loading iframes in IE - #4833) 
  var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

  return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context ) {
  var match,
    tmpSet = [],
    later = "",
    root = context.nodeType ? [context] : context;

  // Position selectors must be done after the filter
  // And so must :not(positional) so we move all PSEUDOs to the end
  while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
    later += match[0];
    selector = selector.replace( Expr.match.PSEUDO, "" );
  }

  selector = Expr.relative[selector] ? selector + "*" : selector;

  for ( var i = 0, l = root.length; i < l; i++ ) {
    Sizzle( selector, root[i], tmpSet );
  }

  return Sizzle.filter( later, tmpSet );
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
  rparentsprev = /^(?:parents|prevUntil|prevAll)/,
  // Note: This RegExp should be improved, or likely pulled from Sizzle
  rmultiselector = /,/,
  isSimple = /^.[^:#\[\.,]*$/,
  slice = Array.prototype.slice,
  POS = jQuery.expr.match.POS,
  // methods guaranteed to produce a unique set when starting from a unique set
  guaranteedUnique = {
    children: true,
    contents: true,
    next: true,
    prev: true
  };

jQuery.fn.extend({
  find: function( selector ) {
    var self = this,
      i, l;

    if ( typeof selector !== "string" ) {
      return jQuery( selector ).filter(function() {
        for ( i = 0, l = self.length; i < l; i++ ) {
          if ( jQuery.contains( self[ i ], this ) ) {
            return true;
          }
        }
      });
    }

    var ret = this.pushStack( "", "find", selector ),
      length, n, r;

    for ( i = 0, l = this.length; i < l; i++ ) {
      length = ret.length;
      jQuery.find( selector, this[i], ret );

      if ( i > 0 ) {
        // Make sure that the results are unique
        for ( n = length; n < ret.length; n++ ) {
          for ( r = 0; r < length; r++ ) {
            if ( ret[r] === ret[n] ) {
              ret.splice(n--, 1);
              break;
            }
          }
        }
      }
    }

    return ret;
  },

  has: function( target ) {
    var targets = jQuery( target );
    return this.filter(function() {
      for ( var i = 0, l = targets.length; i < l; i++ ) {
        if ( jQuery.contains( this, targets[i] ) ) {
          return true;
        }
      }
    });
  },

  not: function( selector ) {
    return this.pushStack( winnow(this, selector, false), "not", selector);
  },

  filter: function( selector ) {
    return this.pushStack( winnow(this, selector, true), "filter", selector );
  },

  is: function( selector ) {
    return !!selector && ( typeof selector === "string" ?
      jQuery.filter( selector, this ).length > 0 :
      this.filter( selector ).length > 0 );
  },

  closest: function( selectors, context ) {
    var ret = [], i, l, cur = this[0];
    
    // Array
    if ( jQuery.isArray( selectors ) ) {
      var match, selector,
        matches = {},
        level = 1;

      if ( cur && selectors.length ) {
        for ( i = 0, l = selectors.length; i < l; i++ ) {
          selector = selectors[i];

          if ( !matches[ selector ] ) {
            matches[ selector ] = POS.test( selector ) ?
              jQuery( selector, context || this.context ) :
              selector;
          }
        }

        while ( cur && cur.ownerDocument && cur !== context ) {
          for ( selector in matches ) {
            match = matches[ selector ];

            if ( match.jquery ? match.index( cur ) > -1 : jQuery( cur ).is( match ) ) {
              ret.push({ selector: selector, elem: cur, level: level });
            }
          }

          cur = cur.parentNode;
          level++;
        }
      }

      return ret;
    }

    // String
    var pos = POS.test( selectors ) || typeof selectors !== "string" ?
        jQuery( selectors, context || this.context ) :
        0;

    for ( i = 0, l = this.length; i < l; i++ ) {
      cur = this[i];

      while ( cur ) {
        if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
          ret.push( cur );
          break;

        } else {
          cur = cur.parentNode;
          if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
            break;
          }
        }
      }
    }

    ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

    return this.pushStack( ret, "closest", selectors );
  },

  // Determine the position of an element within
  // the matched set of elements
  index: function( elem ) {
    if ( !elem || typeof elem === "string" ) {
      return jQuery.inArray( this[0],
        // If it receives a string, the selector is used
        // If it receives nothing, the siblings are used
        elem ? jQuery( elem ) : this.parent().children() );
    }
    // Locate the position of the desired element
    return jQuery.inArray(
      // If it receives a jQuery object, the first element is used
      elem.jquery ? elem[0] : elem, this );
  },

  add: function( selector, context ) {
    var set = typeof selector === "string" ?
        jQuery( selector, context ) :
        jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
      all = jQuery.merge( this.get(), set );

    return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
      all :
      jQuery.unique( all ) );
  },

  andSelf: function() {
    return this.add( this.prevObject );
  }
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
  return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
  parent: function( elem ) {
    var parent = elem.parentNode;
    return parent && parent.nodeType !== 11 ? parent : null;
  },
  parents: function( elem ) {
    return jQuery.dir( elem, "parentNode" );
  },
  parentsUntil: function( elem, i, until ) {
    return jQuery.dir( elem, "parentNode", until );
  },
  next: function( elem ) {
    return jQuery.nth( elem, 2, "nextSibling" );
  },
  prev: function( elem ) {
    return jQuery.nth( elem, 2, "previousSibling" );
  },
  nextAll: function( elem ) {
    return jQuery.dir( elem, "nextSibling" );
  },
  prevAll: function( elem ) {
    return jQuery.dir( elem, "previousSibling" );
  },
  nextUntil: function( elem, i, until ) {
    return jQuery.dir( elem, "nextSibling", until );
  },
  prevUntil: function( elem, i, until ) {
    return jQuery.dir( elem, "previousSibling", until );
  },
  siblings: function( elem ) {
    return jQuery.sibling( elem.parentNode.firstChild, elem );
  },
  children: function( elem ) {
    return jQuery.sibling( elem.firstChild );
  },
  contents: function( elem ) {
    return jQuery.nodeName( elem, "iframe" ) ?
      elem.contentDocument || elem.contentWindow.document :
      jQuery.makeArray( elem.childNodes );
  }
}, function( name, fn ) {
  jQuery.fn[ name ] = function( until, selector ) {
    var ret = jQuery.map( this, fn, until ),
      // The variable 'args' was introduced in
      // https://github.com/jquery/jquery/commit/52a0238
      // to work around a bug in Chrome 10 (Dev) and should be removed when the bug is fixed.
      // http://code.google.com/p/v8/issues/detail?id=1050
      args = slice.call(arguments);

    if ( !runtil.test( name ) ) {
      selector = until;
    }

    if ( selector && typeof selector === "string" ) {
      ret = jQuery.filter( selector, ret );
    }

    ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

    if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
      ret = ret.reverse();
    }

    return this.pushStack( ret, name, args.join(",") );
  };
});

jQuery.extend({
  filter: function( expr, elems, not ) {
    if ( not ) {
      expr = ":not(" + expr + ")";
    }

    return elems.length === 1 ?
      jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
      jQuery.find.matches(expr, elems);
  },

  dir: function( elem, dir, until ) {
    var matched = [],
      cur = elem[ dir ];

    while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
      if ( cur.nodeType === 1 ) {
        matched.push( cur );
      }
      cur = cur[dir];
    }
    return matched;
  },

  nth: function( cur, result, dir, elem ) {
    result = result || 1;
    var num = 0;

    for ( ; cur; cur = cur[dir] ) {
      if ( cur.nodeType === 1 && ++num === result ) {
        break;
      }
    }

    return cur;
  },

  sibling: function( n, elem ) {
    var r = [];

    for ( ; n; n = n.nextSibling ) {
      if ( n.nodeType === 1 && n !== elem ) {
        r.push( n );
      }
    }

    return r;
  }
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

  // Can't pass null or undefined to indexOf in Firefox 4
  // Set to 0 to skip string check
  qualifier = qualifier || 0;

  if ( jQuery.isFunction( qualifier ) ) {
    return jQuery.grep(elements, function( elem, i ) {
      var retVal = !!qualifier.call( elem, i, elem );
      return retVal === keep;
    });

  } else if ( qualifier.nodeType ) {
    return jQuery.grep(elements, function( elem, i ) {
      return (elem === qualifier) === keep;
    });

  } else if ( typeof qualifier === "string" ) {
    var filtered = jQuery.grep(elements, function( elem ) {
      return elem.nodeType === 1;
    });

    if ( isSimple.test( qualifier ) ) {
      return jQuery.filter(qualifier, filtered, !keep);
    } else {
      qualifier = jQuery.filter( qualifier, filtered );
    }
  }

  return jQuery.grep(elements, function( elem, i ) {
    return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
  });
}




var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
  rleadingWhitespace = /^\s+/,
  rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
  rtagName = /<([\w:]+)/,
  rtbody = /<tbody/i,
  rhtml = /<|&#?\w+;/,
  rnocache = /<(?:script|object|embed|option|style)/i,
  // checked="checked" or checked
  rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
  rscriptType = /\/(java|ecma)script/i,
  rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
  wrapMap = {
    option: [ 1, "<select multiple='multiple'>", "</select>" ],
    legend: [ 1, "<fieldset>", "</fieldset>" ],
    thead: [ 1, "<table>", "</table>" ],
    tr: [ 2, "<table><tbody>", "</tbody></table>" ],
    td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
    col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
    area: [ 1, "<map>", "</map>" ],
    _default: [ 0, "", "" ]
  };

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
  wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
  text: function( text ) {
    if ( jQuery.isFunction(text) ) {
      return this.each(function(i) {
        var self = jQuery( this );

        self.text( text.call(this, i, self.text()) );
      });
    }

    if ( typeof text !== "object" && text !== undefined ) {
      return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
    }

    return jQuery.text( this );
  },

  wrapAll: function( html ) {
    if ( jQuery.isFunction( html ) ) {
      return this.each(function(i) {
        jQuery(this).wrapAll( html.call(this, i) );
      });
    }

    if ( this[0] ) {
      // The elements to wrap the target around
      var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

      if ( this[0].parentNode ) {
        wrap.insertBefore( this[0] );
      }

      wrap.map(function() {
        var elem = this;

        while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
          elem = elem.firstChild;
        }

        return elem;
      }).append( this );
    }

    return this;
  },

  wrapInner: function( html ) {
    if ( jQuery.isFunction( html ) ) {
      return this.each(function(i) {
        jQuery(this).wrapInner( html.call(this, i) );
      });
    }

    return this.each(function() {
      var self = jQuery( this ),
        contents = self.contents();

      if ( contents.length ) {
        contents.wrapAll( html );

      } else {
        self.append( html );
      }
    });
  },

  wrap: function( html ) {
    return this.each(function() {
      jQuery( this ).wrapAll( html );
    });
  },

  unwrap: function() {
    return this.parent().each(function() {
      if ( !jQuery.nodeName( this, "body" ) ) {
        jQuery( this ).replaceWith( this.childNodes );
      }
    }).end();
  },

  append: function() {
    return this.domManip(arguments, true, function( elem ) {
      if ( this.nodeType === 1 ) {
        this.appendChild( elem );
      }
    });
  },

  prepend: function() {
    return this.domManip(arguments, true, function( elem ) {
      if ( this.nodeType === 1 ) {
        this.insertBefore( elem, this.firstChild );
      }
    });
  },

  before: function() {
    if ( this[0] && this[0].parentNode ) {
      return this.domManip(arguments, false, function( elem ) {
        this.parentNode.insertBefore( elem, this );
      });
    } else if ( arguments.length ) {
      var set = jQuery(arguments[0]);
      set.push.apply( set, this.toArray() );
      return this.pushStack( set, "before", arguments );
    }
  },

  after: function() {
    if ( this[0] && this[0].parentNode ) {
      return this.domManip(arguments, false, function( elem ) {
        this.parentNode.insertBefore( elem, this.nextSibling );
      });
    } else if ( arguments.length ) {
      var set = this.pushStack( this, "after", arguments );
      set.push.apply( set, jQuery(arguments[0]).toArray() );
      return set;
    }
  },

  // keepData is for internal use only--do not document
  remove: function( selector, keepData ) {
    for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
      if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
        if ( !keepData && elem.nodeType === 1 ) {
          jQuery.cleanData( elem.getElementsByTagName("*") );
          jQuery.cleanData( [ elem ] );
        }

        if ( elem.parentNode ) {
          elem.parentNode.removeChild( elem );
        }
      }
    }

    return this;
  },

  empty: function() {
    for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
      // Remove element nodes and prevent memory leaks
      if ( elem.nodeType === 1 ) {
        jQuery.cleanData( elem.getElementsByTagName("*") );
      }

      // Remove any remaining nodes
      while ( elem.firstChild ) {
        elem.removeChild( elem.firstChild );
      }
    }

    return this;
  },

  clone: function( dataAndEvents, deepDataAndEvents ) {
    dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
    deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

    return this.map( function () {
      return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
    });
  },

  html: function( value ) {
    if ( value === undefined ) {
      return this[0] && this[0].nodeType === 1 ?
        this[0].innerHTML.replace(rinlinejQuery, "") :
        null;

    // See if we can take a shortcut and just use innerHTML
    } else if ( typeof value === "string" && !rnocache.test( value ) &&
      (jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
      !wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

      value = value.replace(rxhtmlTag, "<$1></$2>");

      try {
        for ( var i = 0, l = this.length; i < l; i++ ) {
          // Remove element nodes and prevent memory leaks
          if ( this[i].nodeType === 1 ) {
            jQuery.cleanData( this[i].getElementsByTagName("*") );
            this[i].innerHTML = value;
          }
        }

      // If using innerHTML throws an exception, use the fallback method
      } catch(e) {
        this.empty().append( value );
      }

    } else if ( jQuery.isFunction( value ) ) {
      this.each(function(i){
        var self = jQuery( this );

        self.html( value.call(this, i, self.html()) );
      });

    } else {
      this.empty().append( value );
    }

    return this;
  },

  replaceWith: function( value ) {
    if ( this[0] && this[0].parentNode ) {
      // Make sure that the elements are removed from the DOM before they are inserted
      // this can help fix replacing a parent with child elements
      if ( jQuery.isFunction( value ) ) {
        return this.each(function(i) {
          var self = jQuery(this), old = self.html();
          self.replaceWith( value.call( this, i, old ) );
        });
      }

      if ( typeof value !== "string" ) {
        value = jQuery( value ).detach();
      }

      return this.each(function() {
        var next = this.nextSibling,
          parent = this.parentNode;

        jQuery( this ).remove();

        if ( next ) {
          jQuery(next).before( value );
        } else {
          jQuery(parent).append( value );
        }
      });
    } else {
      return this.length ?
        this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
        this;
    }
  },

  detach: function( selector ) {
    return this.remove( selector, true );
  },

  domManip: function( args, table, callback ) {
    var results, first, fragment, parent,
      value = args[0],
      scripts = [];

    // We can't cloneNode fragments that contain checked, in WebKit
    if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
      return this.each(function() {
        jQuery(this).domManip( args, table, callback, true );
      });
    }

    if ( jQuery.isFunction(value) ) {
      return this.each(function(i) {
        var self = jQuery(this);
        args[0] = value.call(this, i, table ? self.html() : undefined);
        self.domManip( args, table, callback );
      });
    }

    if ( this[0] ) {
      parent = value && value.parentNode;

      // If we're in a fragment, just use that instead of building a new one
      if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
        results = { fragment: parent };

      } else {
        results = jQuery.buildFragment( args, this, scripts );
      }

      fragment = results.fragment;

      if ( fragment.childNodes.length === 1 ) {
        first = fragment = fragment.firstChild;
      } else {
        first = fragment.firstChild;
      }

      if ( first ) {
        table = table && jQuery.nodeName( first, "tr" );

        for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
          callback.call(
            table ?
              root(this[i], first) :
              this[i],
            // Make sure that we do not leak memory by inadvertently discarding
            // the original fragment (which might have attached data) instead of
            // using it; in addition, use the original fragment object for the last
            // item instead of first because it can end up being emptied incorrectly
            // in certain situations (Bug #8070).
            // Fragments from the fragment cache must always be cloned and never used
            // in place.
            results.cacheable || (l > 1 && i < lastIndex) ?
              jQuery.clone( fragment, true, true ) :
              fragment
          );
        }
      }

      if ( scripts.length ) {
        jQuery.each( scripts, evalScript );
      }
    }

    return this;
  }
});

function root( elem, cur ) {
  return jQuery.nodeName(elem, "table") ?
    (elem.getElementsByTagName("tbody")[0] ||
    elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
    elem;
}

function cloneCopyEvent( src, dest ) {

  if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
    return;
  }

  var internalKey = jQuery.expando,
    oldData = jQuery.data( src ),
    curData = jQuery.data( dest, oldData );

  // Switch to use the internal data object, if it exists, for the next
  // stage of data copying
  if ( (oldData = oldData[ internalKey ]) ) {
    var events = oldData.events;
        curData = curData[ internalKey ] = jQuery.extend({}, oldData);

    if ( events ) {
      delete curData.handle;
      curData.events = {};

      for ( var type in events ) {
        for ( var i = 0, l = events[ type ].length; i < l; i++ ) {
          jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
        }
      }
    }
  }
}

function cloneFixAttributes( src, dest ) {
  var nodeName;

  // We do not need to do anything for non-Elements
  if ( dest.nodeType !== 1 ) {
    return;
  }

  // clearAttributes removes the attributes, which we don't want,
  // but also removes the attachEvent events, which we *do* want
  if ( dest.clearAttributes ) {
    dest.clearAttributes();
  }

  // mergeAttributes, in contrast, only merges back on the
  // original attributes, not the events
  if ( dest.mergeAttributes ) {
    dest.mergeAttributes( src );
  }

  nodeName = dest.nodeName.toLowerCase();

  // IE6-8 fail to clone children inside object elements that use
  // the proprietary classid attribute value (rather than the type
  // attribute) to identify the type of content to display
  if ( nodeName === "object" ) {
    dest.outerHTML = src.outerHTML;

  } else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
    // IE6-8 fails to persist the checked state of a cloned checkbox
    // or radio button. Worse, IE6-7 fail to give the cloned element
    // a checked appearance if the defaultChecked value isn't also set
    if ( src.checked ) {
      dest.defaultChecked = dest.checked = src.checked;
    }

    // IE6-7 get confused and end up setting the value of a cloned
    // checkbox/radio button to an empty string instead of "on"
    if ( dest.value !== src.value ) {
      dest.value = src.value;
    }

  // IE6-8 fails to return the selected option to the default selected
  // state when cloning options
  } else if ( nodeName === "option" ) {
    dest.selected = src.defaultSelected;

  // IE6-8 fails to set the defaultValue to the correct value when
  // cloning other types of input fields
  } else if ( nodeName === "input" || nodeName === "textarea" ) {
    dest.defaultValue = src.defaultValue;
  }

  // Event data gets referenced instead of copied if the expando
  // gets copied too
  dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
  var fragment, cacheable, cacheresults,
    doc = (nodes && nodes[0] ? nodes[0].ownerDocument || nodes[0] : document);

  // Only cache "small" (1/2 KB) HTML strings that are associated with the main document
  // Cloning options loses the selected state, so don't cache them
  // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
  // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
  if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
    args[0].charAt(0) === "<" && !rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

    cacheable = true;

    cacheresults = jQuery.fragments[ args[0] ];
    if ( cacheresults && cacheresults !== 1 ) {
      fragment = cacheresults;
    }
  }

  if ( !fragment ) {
    fragment = doc.createDocumentFragment();
    jQuery.clean( args, doc, fragment, scripts );
  }

  if ( cacheable ) {
    jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
  }

  return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
  appendTo: "append",
  prependTo: "prepend",
  insertBefore: "before",
  insertAfter: "after",
  replaceAll: "replaceWith"
}, function( name, original ) {
  jQuery.fn[ name ] = function( selector ) {
    var ret = [],
      insert = jQuery( selector ),
      parent = this.length === 1 && this[0].parentNode;

    if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
      insert[ original ]( this[0] );
      return this;

    } else {
      for ( var i = 0, l = insert.length; i < l; i++ ) {
        var elems = (i > 0 ? this.clone(true) : this).get();
        jQuery( insert[i] )[ original ]( elems );
        ret = ret.concat( elems );
      }

      return this.pushStack( ret, name, insert.selector );
    }
  };
});

function getAll( elem ) {
  if ( "getElementsByTagName" in elem ) {
    return elem.getElementsByTagName( "*" );

  } else if ( "querySelectorAll" in elem ) {
    return elem.querySelectorAll( "*" );

  } else {
    return [];
  }
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
  if ( elem.type === "checkbox" || elem.type === "radio" ) {
    elem.defaultChecked = elem.checked;
  }
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
  if ( jQuery.nodeName( elem, "input" ) ) {
    fixDefaultChecked( elem );
  } else if ( elem.getElementsByTagName ) {
    jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
  }
}

jQuery.extend({
  clone: function( elem, dataAndEvents, deepDataAndEvents ) {
    var clone = elem.cloneNode(true),
        srcElements,
        destElements,
        i;

    if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
        (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
      // IE copies events bound via attachEvent when using cloneNode.
      // Calling detachEvent on the clone will also remove the events
      // from the original. In order to get around this, we use some
      // proprietary methods to clear the events. Thanks to MooTools
      // guys for this hotness.

      cloneFixAttributes( elem, clone );

      // Using Sizzle here is crazy slow, so we use getElementsByTagName
      // instead
      srcElements = getAll( elem );
      destElements = getAll( clone );

      // Weird iteration because IE will replace the length property
      // with an element if you are cloning the body and one of the
      // elements on the page has a name or id of "length"
      for ( i = 0; srcElements[i]; ++i ) {
        cloneFixAttributes( srcElements[i], destElements[i] );
      }
    }

    // Copy the events from the original to the clone
    if ( dataAndEvents ) {
      cloneCopyEvent( elem, clone );

      if ( deepDataAndEvents ) {
        srcElements = getAll( elem );
        destElements = getAll( clone );

        for ( i = 0; srcElements[i]; ++i ) {
          cloneCopyEvent( srcElements[i], destElements[i] );
        }
      }
    }

    // Return the cloned set
    return clone;
  },

  clean: function( elems, context, fragment, scripts ) {
    var checkScriptType;

    context = context || document;

    // !context.createElement fails in IE with an error but returns typeof 'object'
    if ( typeof context.createElement === "undefined" ) {
      context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
    }

    var ret = [], j;

    for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
      if ( typeof elem === "number" ) {
        elem += "";
      }

      if ( !elem ) {
        continue;
      }

      // Convert html string into DOM nodes
      if ( typeof elem === "string" ) {
        if ( !rhtml.test( elem ) ) {
          elem = context.createTextNode( elem );
        } else {
          // Fix "XHTML"-style tags in all browsers
          elem = elem.replace(rxhtmlTag, "<$1></$2>");

          // Trim whitespace, otherwise indexOf won't work as expected
          var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
            wrap = wrapMap[ tag ] || wrapMap._default,
            depth = wrap[0],
            div = context.createElement("div");

          // Go to html and back, then peel off extra wrappers
          div.innerHTML = wrap[1] + elem + wrap[2];

          // Move to the right depth
          while ( depth-- ) {
            div = div.lastChild;
          }

          // Remove IE's autoinserted <tbody> from table fragments
          if ( !jQuery.support.tbody ) {

            // String was a <table>, *may* have spurious <tbody>
            var hasBody = rtbody.test(elem),
              tbody = tag === "table" && !hasBody ?
                div.firstChild && div.firstChild.childNodes :

                // String was a bare <thead> or <tfoot>
                wrap[1] === "<table>" && !hasBody ?
                  div.childNodes :
                  [];

            for ( j = tbody.length - 1; j >= 0 ; --j ) {
              if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
                tbody[ j ].parentNode.removeChild( tbody[ j ] );
              }
            }
          }

          // IE completely kills leading whitespace when innerHTML is used
          if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
            div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
          }

          elem = div.childNodes;
        }
      }

      // Resets defaultChecked for any radios and checkboxes
      // about to be appended to the DOM in IE 6/7 (#8060)
      var len;
      if ( !jQuery.support.appendChecked ) {
        if ( elem[0] && typeof (len = elem.length) === "number" ) {
          for ( j = 0; j < len; j++ ) {
            findInputs( elem[j] );
          }
        } else {
          findInputs( elem );
        }
      }

      if ( elem.nodeType ) {
        ret.push( elem );
      } else {
        ret = jQuery.merge( ret, elem );
      }
    }

    if ( fragment ) {
      checkScriptType = function( elem ) {
        return !elem.type || rscriptType.test( elem.type );
      };
      for ( i = 0; ret[i]; i++ ) {
        if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
          scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

        } else {
          if ( ret[i].nodeType === 1 ) {
            var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

            ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
          }
          fragment.appendChild( ret[i] );
        }
      }
    }

    return ret;
  },

  cleanData: function( elems ) {
    var data, id, cache = jQuery.cache, internalKey = jQuery.expando, special = jQuery.event.special,
      deleteExpando = jQuery.support.deleteExpando;

    for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
      if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
        continue;
      }

      id = elem[ jQuery.expando ];

      if ( id ) {
        data = cache[ id ] && cache[ id ][ internalKey ];

        if ( data && data.events ) {
          for ( var type in data.events ) {
            if ( special[ type ] ) {
              jQuery.event.remove( elem, type );

            // This is a shortcut to avoid jQuery.event.remove's overhead
            } else {
              jQuery.removeEvent( elem, type, data.handle );
            }
          }

          // Null the DOM reference to avoid IE6/7/8 leak (#7054)
          if ( data.handle ) {
            data.handle.elem = null;
          }
        }

        if ( deleteExpando ) {
          delete elem[ jQuery.expando ];

        } else if ( elem.removeAttribute ) {
          elem.removeAttribute( jQuery.expando );
        }

        delete cache[ id ];
      }
    }
  }
});

function evalScript( i, elem ) {
  if ( elem.src ) {
    jQuery.ajax({
      url: elem.src,
      async: false,
      dataType: "script"
    });
  } else {
    jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
  }

  if ( elem.parentNode ) {
    elem.parentNode.removeChild( elem );
  }
}




var ralpha = /alpha\([^)]*\)/i,
  ropacity = /opacity=([^)]*)/,
  rdashAlpha = /-([a-z])/ig,
  // fixed for IE9, see #8346
  rupper = /([A-Z]|^ms)/g,
  rnumpx = /^-?\d+(?:px)?$/i,
  rnum = /^-?\d/,
  rrelNum = /^[+\-]=/,
  rrelNumFilter = /[^+\-\.\de]+/g,

  cssShow = { position: "absolute", visibility: "hidden", display: "block" },
  cssWidth = [ "Left", "Right" ],
  cssHeight = [ "Top", "Bottom" ],
  curCSS,

  getComputedStyle,
  currentStyle,

  fcamelCase = function( all, letter ) {
    return letter.toUpperCase();
  };

jQuery.fn.css = function( name, value ) {
  // Setting 'undefined' is a no-op
  if ( arguments.length === 2 && value === undefined ) {
    return this;
  }

  return jQuery.access( this, name, value, true, function( elem, name, value ) {
    return value !== undefined ?
      jQuery.style( elem, name, value ) :
      jQuery.css( elem, name );
  });
};

jQuery.extend({
  // Add in style property hooks for overriding the default
  // behavior of getting and setting a style property
  cssHooks: {
    opacity: {
      get: function( elem, computed ) {
        if ( computed ) {
          // We should always get a number back from opacity
          var ret = curCSS( elem, "opacity", "opacity" );
          return ret === "" ? "1" : ret;

        } else {
          return elem.style.opacity;
        }
      }
    }
  },

  // Exclude the following css properties to add px
  cssNumber: {
    "zIndex": true,
    "fontWeight": true,
    "opacity": true,
    "zoom": true,
    "lineHeight": true,
    "widows": true,
    "orphans": true
  },

  // Add in properties whose names you wish to fix before
  // setting or getting the value
  cssProps: {
    // normalize float css property
    "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
  },

  // Get and set the style property on a DOM Node
  style: function( elem, name, value, extra ) {
    // Don't set styles on text and comment nodes
    if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
      return;
    }

    // Make sure that we're working with the right name
    var ret, type, origName = jQuery.camelCase( name ),
      style = elem.style, hooks = jQuery.cssHooks[ origName ];

    name = jQuery.cssProps[ origName ] || origName;

    // Check if we're setting a value
    if ( value !== undefined ) {
      type = typeof value;

      // Make sure that NaN and null values aren't set. See: #7116
      if ( type === "number" && isNaN( value ) || value == null ) {
        return;
      }

      // convert relative number strings (+= or -=) to relative numbers. #7345
      if ( type === "string" && rrelNum.test( value ) ) {
        value = +value.replace( rrelNumFilter, "" ) + parseFloat( jQuery.css( elem, name ) );
      }

      // If a number was passed in, add 'px' to the (except for certain CSS properties)
      if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
        value += "px";
      }

      // If a hook was provided, use that value, otherwise just set the specified value
      if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
        // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
        // Fixes bug #5509
        try {
          style[ name ] = value;
        } catch(e) {}
      }

    } else {
      // If a hook was provided get the non-computed value from there
      if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
        return ret;
      }

      // Otherwise just get the value from the style object
      return style[ name ];
    }
  },

  css: function( elem, name, extra ) {
    var ret, hooks;

    // Make sure that we're working with the right name
    name = jQuery.camelCase( name );
    hooks = jQuery.cssHooks[ name ];
    name = jQuery.cssProps[ name ] || name;

    // cssFloat needs a special treatment
    if ( name === "cssFloat" ) {
      name = "float";
    }

    // If a hook was provided get the computed value from there
    if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
      return ret;

    // Otherwise, if a way to get the computed value exists, use that
    } else if ( curCSS ) {
      return curCSS( elem, name );
    }
  },

  // A method for quickly swapping in/out CSS properties to get correct calculations
  swap: function( elem, options, callback ) {
    var old = {};

    // Remember the old values, and insert the new ones
    for ( var name in options ) {
      old[ name ] = elem.style[ name ];
      elem.style[ name ] = options[ name ];
    }

    callback.call( elem );

    // Revert the old values
    for ( name in options ) {
      elem.style[ name ] = old[ name ];
    }
  },

  camelCase: function( string ) {
    return string.replace( rdashAlpha, fcamelCase );
  }
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
  jQuery.cssHooks[ name ] = {
    get: function( elem, computed, extra ) {
      var val;

      if ( computed ) {
        if ( elem.offsetWidth !== 0 ) {
          val = getWH( elem, name, extra );

        } else {
          jQuery.swap( elem, cssShow, function() {
            val = getWH( elem, name, extra );
          });
        }

        if ( val <= 0 ) {
          val = curCSS( elem, name, name );

          if ( val === "0px" && currentStyle ) {
            val = currentStyle( elem, name, name );
          }

          if ( val != null ) {
            // Should return "auto" instead of 0, use 0 for
            // temporary backwards-compat
            return val === "" || val === "auto" ? "0px" : val;
          }
        }

        if ( val < 0 || val == null ) {
          val = elem.style[ name ];

          // Should return "auto" instead of 0, use 0 for
          // temporary backwards-compat
          return val === "" || val === "auto" ? "0px" : val;
        }

        return typeof val === "string" ? val : val + "px";
      }
    },

    set: function( elem, value ) {
      if ( rnumpx.test( value ) ) {
        // ignore negative width and height values #1599
        value = parseFloat(value);

        if ( value >= 0 ) {
          return value + "px";
        }

      } else {
        return value;
      }
    }
  };
});

if ( !jQuery.support.opacity ) {
  jQuery.cssHooks.opacity = {
    get: function( elem, computed ) {
      // IE uses filters for opacity
      return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
        ( parseFloat( RegExp.$1 ) / 100 ) + "" :
        computed ? "1" : "";
    },

    set: function( elem, value ) {
      var style = elem.style,
        currentStyle = elem.currentStyle;

      // IE has trouble with opacity if it does not have layout
      // Force it by setting the zoom level
      style.zoom = 1;

      // Set the alpha filter to set the opacity
      var opacity = jQuery.isNaN( value ) ?
        "" :
        "alpha(opacity=" + value * 100 + ")",
        filter = currentStyle && currentStyle.filter || style.filter || "";

      style.filter = ralpha.test( filter ) ?
        filter.replace( ralpha, opacity ) :
        filter + " " + opacity;
    }
  };
}

jQuery(function() {
  // This hook cannot be added until DOM ready because the support test
  // for it is not run until after DOM ready
  if ( !jQuery.support.reliableMarginRight ) {
    jQuery.cssHooks.marginRight = {
      get: function( elem, computed ) {
        // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
        // Work around by temporarily setting element display to inline-block
        var ret;
        jQuery.swap( elem, { "display": "inline-block" }, function() {
          if ( computed ) {
            ret = curCSS( elem, "margin-right", "marginRight" );
          } else {
            ret = elem.style.marginRight;
          }
        });
        return ret;
      }
    };
  }
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
  getComputedStyle = function( elem, name ) {
    var ret, defaultView, computedStyle;

    name = name.replace( rupper, "-$1" ).toLowerCase();

    if ( !(defaultView = elem.ownerDocument.defaultView) ) {
      return undefined;
    }

    if ( (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
      ret = computedStyle.getPropertyValue( name );
      if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
        ret = jQuery.style( elem, name );
      }
    }

    return ret;
  };
}

if ( document.documentElement.currentStyle ) {
  currentStyle = function( elem, name ) {
    var left,
      ret = elem.currentStyle && elem.currentStyle[ name ],
      rsLeft = elem.runtimeStyle && elem.runtimeStyle[ name ],
      style = elem.style;

    // From the awesome hack by Dean Edwards
    // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

    // If we're not dealing with a regular pixel number
    // but a number that has a weird ending, we need to convert it to pixels
    if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
      // Remember the original values
      left = style.left;

      // Put in the new values to get a computed value out
      if ( rsLeft ) {
        elem.runtimeStyle.left = elem.currentStyle.left;
      }
      style.left = name === "fontSize" ? "1em" : (ret || 0);
      ret = style.pixelLeft + "px";

      // Revert the changed values
      style.left = left;
      if ( rsLeft ) {
        elem.runtimeStyle.left = rsLeft;
      }
    }

    return ret === "" ? "auto" : ret;
  };
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {
  var which = name === "width" ? cssWidth : cssHeight,
    val = name === "width" ? elem.offsetWidth : elem.offsetHeight;

  if ( extra === "border" ) {
    return val;
  }

  jQuery.each( which, function() {
    if ( !extra ) {
      val -= parseFloat(jQuery.css( elem, "padding" + this )) || 0;
    }

    if ( extra === "margin" ) {
      val += parseFloat(jQuery.css( elem, "margin" + this )) || 0;

    } else {
      val -= parseFloat(jQuery.css( elem, "border" + this + "Width" )) || 0;
    }
  });

  return val;
}

if ( jQuery.expr && jQuery.expr.filters ) {
  jQuery.expr.filters.hidden = function( elem ) {
    var width = elem.offsetWidth,
      height = elem.offsetHeight;

    return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && (elem.style.display || jQuery.css( elem, "display" )) === "none");
  };

  jQuery.expr.filters.visible = function( elem ) {
    return !jQuery.expr.filters.hidden( elem );
  };
}




var r20 = /%20/g,
  rbracket = /\[\]$/,
  rCRLF = /\r?\n/g,
  rhash = /#.*$/,
  rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
  rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
  // #7653, #8125, #8152: local protocol detection
  rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|widget):$/,
  rnoContent = /^(?:GET|HEAD)$/,
  rprotocol = /^\/\//,
  rquery = /\?/,
  rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  rselectTextarea = /^(?:select|textarea)/i,
  rspacesAjax = /\s+/,
  rts = /([?&])_=[^&]*/,
  rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

  // Keep a copy of the old load method
  _load = jQuery.fn.load,

  /* Prefilters
   * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
   * 2) These are called:
   *    - BEFORE asking for a transport
   *    - AFTER param serialization (s.data is a string if s.processData is true)
   * 3) key is the dataType
   * 4) the catchall symbol "*" can be used
   * 5) execution will start with transport dataType and THEN continue down to "*" if needed
   */
  prefilters = {},

  /* Transports bindings
   * 1) key is the dataType
   * 2) the catchall symbol "*" can be used
   * 3) selection will start with transport dataType and THEN go to "*" if needed
   */
  transports = {},

  // Document location
  ajaxLocation,

  // Document location segments
  ajaxLocParts;

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
  ajaxLocation = location.href;
} catch( e ) {
  // Use the href attribute of an A element
  // since IE will modify it given document.location
  ajaxLocation = document.createElement( "a" );
  ajaxLocation.href = "";
  ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

  // dataTypeExpression is optional and defaults to "*"
  return function( dataTypeExpression, func ) {

    if ( typeof dataTypeExpression !== "string" ) {
      func = dataTypeExpression;
      dataTypeExpression = "*";
    }

    if ( jQuery.isFunction( func ) ) {
      var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
        i = 0,
        length = dataTypes.length,
        dataType,
        list,
        placeBefore;

      // For each dataType in the dataTypeExpression
      for(; i < length; i++ ) {
        dataType = dataTypes[ i ];
        // We control if we're asked to add before
        // any existing element
        placeBefore = /^\+/.test( dataType );
        if ( placeBefore ) {
          dataType = dataType.substr( 1 ) || "*";
        }
        list = structure[ dataType ] = structure[ dataType ] || [];
        // then we add to the structure accordingly
        list[ placeBefore ? "unshift" : "push" ]( func );
      }
    }
  };
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
    dataType /* internal */, inspected /* internal */ ) {

  dataType = dataType || options.dataTypes[ 0 ];
  inspected = inspected || {};

  inspected[ dataType ] = true;

  var list = structure[ dataType ],
    i = 0,
    length = list ? list.length : 0,
    executeOnly = ( structure === prefilters ),
    selection;

  for(; i < length && ( executeOnly || !selection ); i++ ) {
    selection = list[ i ]( options, originalOptions, jqXHR );
    // If we got redirected to another dataType
    // we try there if executing only and not done already
    if ( typeof selection === "string" ) {
      if ( !executeOnly || inspected[ selection ] ) {
        selection = undefined;
      } else {
        options.dataTypes.unshift( selection );
        selection = inspectPrefiltersOrTransports(
            structure, options, originalOptions, jqXHR, selection, inspected );
      }
    }
  }
  // If we're only executing or nothing was selected
  // we try the catchall dataType if not done already
  if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
    selection = inspectPrefiltersOrTransports(
        structure, options, originalOptions, jqXHR, "*", inspected );
  }
  // unnecessary when only executing (prefilters)
  // but it'll be ignored by the caller in that case
  return selection;
}

jQuery.fn.extend({
  load: function( url, params, callback ) {
    if ( typeof url !== "string" && _load ) {
      return _load.apply( this, arguments );

    // Don't do a request if no elements are being requested
    } else if ( !this.length ) {
      return this;
    }

    var off = url.indexOf( " " );
    if ( off >= 0 ) {
      var selector = url.slice( off, url.length );
      url = url.slice( 0, off );
    }

    // Default to a GET request
    var type = "GET";

    // If the second parameter was provided
    if ( params ) {
      // If it's a function
      if ( jQuery.isFunction( params ) ) {
        // We assume that it's the callback
        callback = params;
        params = undefined;

      // Otherwise, build a param string
      } else if ( typeof params === "object" ) {
        params = jQuery.param( params, jQuery.ajaxSettings.traditional );
        type = "POST";
      }
    }

    var self = this;

    // Request the remote document
    jQuery.ajax({
      url: url,
      type: type,
      dataType: "html",
      data: params,
      // Complete callback (responseText is used internally)
      complete: function( jqXHR, status, responseText ) {
        // Store the response as specified by the jqXHR object
        responseText = jqXHR.responseText;
        // If successful, inject the HTML into all the matched elements
        if ( jqXHR.isResolved() ) {
          // #4825: Get the actual response in case
          // a dataFilter is present in ajaxSettings
          jqXHR.done(function( r ) {
            responseText = r;
          });
          // See if a selector was specified
          self.html( selector ?
            // Create a dummy div to hold the results
            jQuery("<div>")
              // inject the contents of the document in, removing the scripts
              // to avoid any 'Permission Denied' errors in IE
              .append(responseText.replace(rscript, ""))

              // Locate the specified elements
              .find(selector) :

            // If not, just inject the full result
            responseText );
        }

        if ( callback ) {
          self.each( callback, [ responseText, status, jqXHR ] );
        }
      }
    });

    return this;
  },

  serialize: function() {
    return jQuery.param( this.serializeArray() );
  },

  serializeArray: function() {
    return this.map(function(){
      return this.elements ? jQuery.makeArray( this.elements ) : this;
    })
    .filter(function(){
      return this.name && !this.disabled &&
        ( this.checked || rselectTextarea.test( this.nodeName ) ||
          rinput.test( this.type ) );
    })
    .map(function( i, elem ){
      var val = jQuery( this ).val();

      return val == null ?
        null :
        jQuery.isArray( val ) ?
          jQuery.map( val, function( val, i ){
            return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
          }) :
          { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
    }).get();
  }
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
  jQuery.fn[ o ] = function( f ){
    return this.bind( o, f );
  };
});

jQuery.each( [ "get", "post" ], function( i, method ) {
  jQuery[ method ] = function( url, data, callback, type ) {
    // shift arguments if data argument was omitted
    if ( jQuery.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return jQuery.ajax({
      type: method,
      url: url,
      data: data,
      success: callback,
      dataType: type
    });
  };
});

jQuery.extend({

  getScript: function( url, callback ) {
    return jQuery.get( url, undefined, callback, "script" );
  },

  getJSON: function( url, data, callback ) {
    return jQuery.get( url, data, callback, "json" );
  },

  // Creates a full fledged settings object into target
  // with both ajaxSettings and settings fields.
  // If target is omitted, writes into ajaxSettings.
  ajaxSetup: function ( target, settings ) {
    if ( !settings ) {
      // Only one parameter, we extend ajaxSettings
      settings = target;
      target = jQuery.extend( true, jQuery.ajaxSettings, settings );
    } else {
      // target was provided, we extend into it
      jQuery.extend( true, target, jQuery.ajaxSettings, settings );
    }
    // Flatten fields we don't want deep extended
    for( var field in { context: 1, url: 1 } ) {
      if ( field in settings ) {
        target[ field ] = settings[ field ];
      } else if( field in jQuery.ajaxSettings ) {
        target[ field ] = jQuery.ajaxSettings[ field ];
      }
    }
    return target;
  },

  ajaxSettings: {
    url: ajaxLocation,
    isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
    global: true,
    type: "GET",
    contentType: "application/x-www-form-urlencoded",
    processData: true,
    async: true,
    /*
    timeout: 0,
    data: null,
    dataType: null,
    username: null,
    password: null,
    cache: null,
    traditional: false,
    headers: {},
    */

    accepts: {
      xml: "application/xml, text/xml",
      html: "text/html",
      text: "text/plain",
      json: "application/json, text/javascript",
      "*": "*/*"
    },

    contents: {
      xml: /xml/,
      html: /html/,
      json: /json/
    },

    responseFields: {
      xml: "responseXML",
      text: "responseText"
    },

    // List of data converters
    // 1) key format is "source_type destination_type" (a single space in-between)
    // 2) the catchall symbol "*" can be used for source_type
    converters: {

      // Convert anything to text
      "* text": window.String,

      // Text to html (true = no transformation)
      "text html": true,

      // Evaluate text as a json expression
      "text json": jQuery.parseJSON,

      // Parse text as xml
      "text xml": jQuery.parseXML
    }
  },

  ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
  ajaxTransport: addToPrefiltersOrTransports( transports ),

  // Main method
  ajax: function( url, options ) {

    // If url is an object, simulate pre-1.5 signature
    if ( typeof url === "object" ) {
      options = url;
      url = undefined;
    }

    // Force options to be an object
    options = options || {};

    var // Create the final options object
      s = jQuery.ajaxSetup( {}, options ),
      // Callbacks context
      callbackContext = s.context || s,
      // Context for global events
      // It's the callbackContext if one was provided in the options
      // and if it's a DOM node or a jQuery collection
      globalEventContext = callbackContext !== s &&
        ( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
            jQuery( callbackContext ) : jQuery.event,
      // Deferreds
      deferred = jQuery.Deferred(),
      completeDeferred = jQuery._Deferred(),
      // Status-dependent callbacks
      statusCode = s.statusCode || {},
      // ifModified key
      ifModifiedKey,
      // Headers (they are sent all at once)
      requestHeaders = {},
      requestHeadersNames = {},
      // Response headers
      responseHeadersString,
      responseHeaders,
      // transport
      transport,
      // timeout handle
      timeoutTimer,
      // Cross-domain detection vars
      parts,
      // The jqXHR state
      state = 0,
      // To know if global events are to be dispatched
      fireGlobals,
      // Loop variable
      i,
      // Fake xhr
      jqXHR = {

        readyState: 0,

        // Caches the header
        setRequestHeader: function( name, value ) {
          if ( !state ) {
            var lname = name.toLowerCase();
            name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
            requestHeaders[ name ] = value;
          }
          return this;
        },

        // Raw string
        getAllResponseHeaders: function() {
          return state === 2 ? responseHeadersString : null;
        },

        // Builds headers hashtable if needed
        getResponseHeader: function( key ) {
          var match;
          if ( state === 2 ) {
            if ( !responseHeaders ) {
              responseHeaders = {};
              while( ( match = rheaders.exec( responseHeadersString ) ) ) {
                responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
              }
            }
            match = responseHeaders[ key.toLowerCase() ];
          }
          return match === undefined ? null : match;
        },

        // Overrides response content-type header
        overrideMimeType: function( type ) {
          if ( !state ) {
            s.mimeType = type;
          }
          return this;
        },

        // Cancel the request
        abort: function( statusText ) {
          statusText = statusText || "abort";
          if ( transport ) {
            transport.abort( statusText );
          }
          done( 0, statusText );
          return this;
        }
      };

    // Callback for when everything is done
    // It is defined here because jslint complains if it is declared
    // at the end of the function (which would be more logical and readable)
    function done( status, statusText, responses, headers ) {

      // Called once
      if ( state === 2 ) {
        return;
      }

      // State is "done" now
      state = 2;

      // Clear timeout if it exists
      if ( timeoutTimer ) {
        clearTimeout( timeoutTimer );
      }

      // Dereference transport for early garbage collection
      // (no matter how long the jqXHR object will be used)
      transport = undefined;

      // Cache response headers
      responseHeadersString = headers || "";

      // Set readyState
      jqXHR.readyState = status ? 4 : 0;

      var isSuccess,
        success,
        error,
        response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
        lastModified,
        etag;

      // If successful, handle type chaining
      if ( status >= 200 && status < 300 || status === 304 ) {

        // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
        if ( s.ifModified ) {

          if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
            jQuery.lastModified[ ifModifiedKey ] = lastModified;
          }
          if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
            jQuery.etag[ ifModifiedKey ] = etag;
          }
        }

        // If not modified
        if ( status === 304 ) {

          statusText = "notmodified";
          isSuccess = true;

        // If we have data
        } else {

          try {
            success = ajaxConvert( s, response );
            statusText = "success";
            isSuccess = true;
          } catch(e) {
            // We have a parsererror
            statusText = "parsererror";
            error = e;
          }
        }
      } else {
        // We extract error from statusText
        // then normalize statusText and status for non-aborts
        error = statusText;
        if( !statusText || status ) {
          statusText = "error";
          if ( status < 0 ) {
            status = 0;
          }
        }
      }

      // Set data for the fake xhr object
      jqXHR.status = status;
      jqXHR.statusText = statusText;

      // Success/Error
      if ( isSuccess ) {
        deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
      } else {
        deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
      }

      // Status-dependent callbacks
      jqXHR.statusCode( statusCode );
      statusCode = undefined;

      if ( fireGlobals ) {
        globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
            [ jqXHR, s, isSuccess ? success : error ] );
      }

      // Complete
      completeDeferred.resolveWith( callbackContext, [ jqXHR, statusText ] );

      if ( fireGlobals ) {
        globalEventContext.trigger( "ajaxComplete", [ jqXHR, s] );
        // Handle the global AJAX counter
        if ( !( --jQuery.active ) ) {
          jQuery.event.trigger( "ajaxStop" );
        }
      }
    }

    // Attach deferreds
    deferred.promise( jqXHR );
    jqXHR.success = jqXHR.done;
    jqXHR.error = jqXHR.fail;
    jqXHR.complete = completeDeferred.done;

    // Status-dependent callbacks
    jqXHR.statusCode = function( map ) {
      if ( map ) {
        var tmp;
        if ( state < 2 ) {
          for( tmp in map ) {
            statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
          }
        } else {
          tmp = map[ jqXHR.status ];
          jqXHR.then( tmp, tmp );
        }
      }
      return this;
    };

    // Remove hash character (#7531: and string promotion)
    // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
    // We also use the url parameter if available
    s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

    // Extract dataTypes list
    s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

    // Determine if a cross-domain request is in order
    if ( s.crossDomain == null ) {
      parts = rurl.exec( s.url.toLowerCase() );
      s.crossDomain = !!( parts &&
        ( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
          ( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
            ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
      );
    }

    // Convert data if not already a string
    if ( s.data && s.processData && typeof s.data !== "string" ) {
      s.data = jQuery.param( s.data, s.traditional );
    }

    // Apply prefilters
    inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

    // If request was aborted inside a prefiler, stop there
    if ( state === 2 ) {
      return false;
    }

    // We can fire global events as of now if asked to
    fireGlobals = s.global;

    // Uppercase the type
    s.type = s.type.toUpperCase();

    // Determine if request has content
    s.hasContent = !rnoContent.test( s.type );

    // Watch for a new set of requests
    if ( fireGlobals && jQuery.active++ === 0 ) {
      jQuery.event.trigger( "ajaxStart" );
    }

    // More options handling for requests with no content
    if ( !s.hasContent ) {

      // If data is available, append data to url
      if ( s.data ) {
        s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
      }

      // Get ifModifiedKey before adding the anti-cache parameter
      ifModifiedKey = s.url;

      // Add anti-cache in url if needed
      if ( s.cache === false ) {

        var ts = jQuery.now(),
          // try replacing _= if it is there
          ret = s.url.replace( rts, "$1_=" + ts );

        // if nothing was replaced, add timestamp to the end
        s.url = ret + ( (ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
      }
    }

    // Set the correct header, if data is being sent
    if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
      jqXHR.setRequestHeader( "Content-Type", s.contentType );
    }

    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
    if ( s.ifModified ) {
      ifModifiedKey = ifModifiedKey || s.url;
      if ( jQuery.lastModified[ ifModifiedKey ] ) {
        jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
      }
      if ( jQuery.etag[ ifModifiedKey ] ) {
        jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
      }
    }

    // Set the Accepts header for the server, depending on the dataType
    jqXHR.setRequestHeader(
      "Accept",
      s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
        s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", */*; q=0.01" : "" ) :
        s.accepts[ "*" ]
    );

    // Check for headers option
    for ( i in s.headers ) {
      jqXHR.setRequestHeader( i, s.headers[ i ] );
    }

    // Allow custom headers/mimetypes and early abort
    if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
        // Abort if not done already
        jqXHR.abort();
        return false;

    }

    // Install callbacks on deferreds
    for ( i in { success: 1, error: 1, complete: 1 } ) {
      jqXHR[ i ]( s[ i ] );
    }

    // Get transport
    transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

    // If no transport, we auto-abort
    if ( !transport ) {
      done( -1, "No Transport" );
    } else {
      jqXHR.readyState = 1;
      // Send global event
      if ( fireGlobals ) {
        globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
      }
      // Timeout
      if ( s.async && s.timeout > 0 ) {
        timeoutTimer = setTimeout( function(){
          jqXHR.abort( "timeout" );
        }, s.timeout );
      }

      try {
        state = 1;
        transport.send( requestHeaders, done );
      } catch (e) {
        // Propagate exception as error if not done
        if ( status < 2 ) {
          done( -1, e );
        // Simply rethrow otherwise
        } else {
          jQuery.error( e );
        }
      }
    }

    return jqXHR;
  },

  // Serialize an array of form elements or a set of
  // key/values into a query string
  param: function( a, traditional ) {
    var s = [],
      add = function( key, value ) {
        // If value is a function, invoke it and return its value
        value = jQuery.isFunction( value ) ? value() : value;
        s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
      };

    // Set traditional to true for jQuery <= 1.3.2 behavior.
    if ( traditional === undefined ) {
      traditional = jQuery.ajaxSettings.traditional;
    }

    // If an array was passed in, assume that it is an array of form elements.
    if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
      // Serialize the form elements
      jQuery.each( a, function() {
        add( this.name, this.value );
      });

    } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for ( var prefix in a ) {
        buildParams( prefix, a[ prefix ], traditional, add );
      }
    }

    // Return the resulting serialization
    return s.join( "&" ).replace( r20, "+" );
  }
});

function buildParams( prefix, obj, traditional, add ) {
  if ( jQuery.isArray( obj ) ) {
    // Serialize array item.
    jQuery.each( obj, function( i, v ) {
      if ( traditional || rbracket.test( prefix ) ) {
        // Treat each array item as a scalar.
        add( prefix, v );

      } else {
        // If array item is non-scalar (array or object), encode its
        // numeric index to resolve deserialization ambiguity issues.
        // Note that rack (as of 1.0.0) can't currently deserialize
        // nested arrays properly, and attempting to do so may cause
        // a server error. Possible fixes are to modify rack's
        // deserialization algorithm or to provide an option or flag
        // to force array serialization to be shallow.
        buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
      }
    });

  } else if ( !traditional && obj != null && typeof obj === "object" ) {
    // Serialize object item.
    for ( var name in obj ) {
      buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
    }

  } else {
    // Serialize scalar item.
    add( prefix, obj );
  }
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

  // Counter for holding the number of active queries
  active: 0,

  // Last-Modified header cache for next request
  lastModified: {},
  etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

  var contents = s.contents,
    dataTypes = s.dataTypes,
    responseFields = s.responseFields,
    ct,
    type,
    finalDataType,
    firstDataType;

  // Fill responseXXX fields
  for( type in responseFields ) {
    if ( type in responses ) {
      jqXHR[ responseFields[type] ] = responses[ type ];
    }
  }

  // Remove auto dataType and get content-type in the process
  while( dataTypes[ 0 ] === "*" ) {
    dataTypes.shift();
    if ( ct === undefined ) {
      ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
    }
  }

  // Check if we're dealing with a known content-type
  if ( ct ) {
    for ( type in contents ) {
      if ( contents[ type ] && contents[ type ].test( ct ) ) {
        dataTypes.unshift( type );
        break;
      }
    }
  }

  // Check to see if we have a response for the expected dataType
  if ( dataTypes[ 0 ] in responses ) {
    finalDataType = dataTypes[ 0 ];
  } else {
    // Try convertible dataTypes
    for ( type in responses ) {
      if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
        finalDataType = type;
        break;
      }
      if ( !firstDataType ) {
        firstDataType = type;
      }
    }
    // Or just use first one
    finalDataType = finalDataType || firstDataType;
  }

  // If we found a dataType
  // We add the dataType to the list if needed
  // and return the corresponding response
  if ( finalDataType ) {
    if ( finalDataType !== dataTypes[ 0 ] ) {
      dataTypes.unshift( finalDataType );
    }
    return responses[ finalDataType ];
  }
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

  // Apply the dataFilter if provided
  if ( s.dataFilter ) {
    response = s.dataFilter( response, s.dataType );
  }

  var dataTypes = s.dataTypes,
    converters = {},
    i,
    key,
    length = dataTypes.length,
    tmp,
    // Current and previous dataTypes
    current = dataTypes[ 0 ],
    prev,
    // Conversion expression
    conversion,
    // Conversion function
    conv,
    // Conversion functions (transitive conversion)
    conv1,
    conv2;

  // For each dataType in the chain
  for( i = 1; i < length; i++ ) {

    // Create converters map
    // with lowercased keys
    if ( i === 1 ) {
      for( key in s.converters ) {
        if( typeof key === "string" ) {
          converters[ key.toLowerCase() ] = s.converters[ key ];
        }
      }
    }

    // Get the dataTypes
    prev = current;
    current = dataTypes[ i ];

    // If current is auto dataType, update it to prev
    if( current === "*" ) {
      current = prev;
    // If no auto and dataTypes are actually different
    } else if ( prev !== "*" && prev !== current ) {

      // Get the converter
      conversion = prev + " " + current;
      conv = converters[ conversion ] || converters[ "* " + current ];

      // If there is no direct converter, search transitively
      if ( !conv ) {
        conv2 = undefined;
        for( conv1 in converters ) {
          tmp = conv1.split( " " );
          if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
            conv2 = converters[ tmp[1] + " " + current ];
            if ( conv2 ) {
              conv1 = converters[ conv1 ];
              if ( conv1 === true ) {
                conv = conv2;
              } else if ( conv2 === true ) {
                conv = conv1;
              }
              break;
            }
          }
        }
      }
      // If we found no converter, dispatch an error
      if ( !( conv || conv2 ) ) {
        jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
      }
      // If found converter is not an equivalence
      if ( conv !== true ) {
        // Convert with 1 or 2 converters accordingly
        response = conv ? conv( response ) : conv2( conv1(response) );
      }
    }
  }
  return response;
}




var jsc = jQuery.now(),
  jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
  jsonp: "callback",
  jsonpCallback: function() {
    return jQuery.expando + "_" + ( jsc++ );
  }
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

  var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
    ( typeof s.data === "string" );

  if ( s.dataTypes[ 0 ] === "jsonp" ||
    s.jsonp !== false && ( jsre.test( s.url ) ||
        inspectData && jsre.test( s.data ) ) ) {

    var responseContainer,
      jsonpCallback = s.jsonpCallback =
        jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
      previous = window[ jsonpCallback ],
      url = s.url,
      data = s.data,
      replace = "$1" + jsonpCallback + "$2";

    if ( s.jsonp !== false ) {
      url = url.replace( jsre, replace );
      if ( s.url === url ) {
        if ( inspectData ) {
          data = data.replace( jsre, replace );
        }
        if ( s.data === data ) {
          // Add callback manually
          url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
        }
      }
    }

    s.url = url;
    s.data = data;

    // Install callback
    window[ jsonpCallback ] = function( response ) {
      responseContainer = [ response ];
    };

    // Clean-up function
    jqXHR.always(function() {
      // Set callback back to previous value
      window[ jsonpCallback ] = previous;
      // Call if it was a function and we have a response
      if ( responseContainer && jQuery.isFunction( previous ) ) {
        window[ jsonpCallback ]( responseContainer[ 0 ] );
      }
    });

    // Use data converter to retrieve json after script execution
    s.converters["script json"] = function() {
      if ( !responseContainer ) {
        jQuery.error( jsonpCallback + " was not called" );
      }
      return responseContainer[ 0 ];
    };

    // force json dataType
    s.dataTypes[ 0 ] = "json";

    // Delegate to script
    return "script";
  }
});




// Install script dataType
jQuery.ajaxSetup({
  accepts: {
    script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
  },
  contents: {
    script: /javascript|ecmascript/
  },
  converters: {
    "text script": function( text ) {
      jQuery.globalEval( text );
      return text;
    }
  }
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
  if ( s.cache === undefined ) {
    s.cache = false;
  }
  if ( s.crossDomain ) {
    s.type = "GET";
    s.global = false;
  }
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

  // This transport only deals with cross domain requests
  if ( s.crossDomain ) {

    var script,
      head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

    return {

      send: function( _, callback ) {

        script = document.createElement( "script" );

        script.async = "async";

        if ( s.scriptCharset ) {
          script.charset = s.scriptCharset;
        }

        script.src = s.url;

        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function( _, isAbort ) {

          if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;

            // Remove the script
            if ( head && script.parentNode ) {
              head.removeChild( script );
            }

            // Dereference the script
            script = undefined;

            // Callback if not abort
            if ( !isAbort ) {
              callback( 200, "success" );
            }
          }
        };
        // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
        // This arises when a base node is used (#2709 and #4378).
        head.insertBefore( script, head.firstChild );
      },

      abort: function() {
        if ( script ) {
          script.onload( 0, 1 );
        }
      }
    };
  }
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
  xhrOnUnloadAbort = window.ActiveXObject ? function() {
    // Abort all pending requests
    for ( var key in xhrCallbacks ) {
      xhrCallbacks[ key ]( 0, 1 );
    }
  } : false,
  xhrId = 0,
  xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
  try {
    return new window.XMLHttpRequest();
  } catch( e ) {}
}

function createActiveXHR() {
  try {
    return new window.ActiveXObject( "Microsoft.XMLHTTP" );
  } catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
  /* Microsoft failed to properly
   * implement the XMLHttpRequest in IE7 (can't request local files),
   * so we use the ActiveXObject when it is available
   * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
   * we need a fallback.
   */
  function() {
    return !this.isLocal && createStandardXHR() || createActiveXHR();
  } :
  // For all other browsers, use the standard XMLHttpRequest object
  createStandardXHR;

// Determine support properties
(function( xhr ) {
  jQuery.extend( jQuery.support, {
    ajax: !!xhr,
    cors: !!xhr && ( "withCredentials" in xhr )
  });
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

  jQuery.ajaxTransport(function( s ) {
    // Cross domain only allowed if supported through XMLHttpRequest
    if ( !s.crossDomain || jQuery.support.cors ) {

      var callback;

      return {
        send: function( headers, complete ) {

          // Get a new xhr
          var xhr = s.xhr(),
            handle,
            i;

          // Open the socket
          // Passing null username, generates a login popup on Opera (#2865)
          if ( s.username ) {
            xhr.open( s.type, s.url, s.async, s.username, s.password );
          } else {
            xhr.open( s.type, s.url, s.async );
          }

          // Apply custom fields if provided
          if ( s.xhrFields ) {
            for ( i in s.xhrFields ) {
              xhr[ i ] = s.xhrFields[ i ];
            }
          }

          // Override mime type if needed
          if ( s.mimeType && xhr.overrideMimeType ) {
            xhr.overrideMimeType( s.mimeType );
          }

          // X-Requested-With header
          // For cross-domain requests, seeing as conditions for a preflight are
          // akin to a jigsaw puzzle, we simply never set it to be sure.
          // (it can always be set on a per-request basis or even using ajaxSetup)
          // For same-domain requests, won't change header if already provided.
          if ( !s.crossDomain && !headers["X-Requested-With"] ) {
            headers[ "X-Requested-With" ] = "XMLHttpRequest";
          }

          // Need an extra try/catch for cross domain requests in Firefox 3
          try {
            for ( i in headers ) {
              xhr.setRequestHeader( i, headers[ i ] );
            }
          } catch( _ ) {}

          // Do send the request
          // This may raise an exception which is actually
          // handled in jQuery.ajax (so no try/catch here)
          xhr.send( ( s.hasContent && s.data ) || null );

          // Listener
          callback = function( _, isAbort ) {

            var status,
              statusText,
              responseHeaders,
              responses,
              xml;

            // Firefox throws exceptions when accessing properties
            // of an xhr when a network error occured
            // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
            try {

              // Was never called and is aborted or complete
              if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

                // Only called once
                callback = undefined;

                // Do not keep as active anymore
                if ( handle ) {
                  xhr.onreadystatechange = jQuery.noop;
                  if ( xhrOnUnloadAbort ) {
                    delete xhrCallbacks[ handle ];
                  }
                }

                // If it's an abort
                if ( isAbort ) {
                  // Abort it manually if needed
                  if ( xhr.readyState !== 4 ) {
                    xhr.abort();
                  }
                } else {
                  status = xhr.status;
                  responseHeaders = xhr.getAllResponseHeaders();
                  responses = {};
                  xml = xhr.responseXML;

                  // Construct response list
                  if ( xml && xml.documentElement /* #4958 */ ) {
                    responses.xml = xml;
                  }
                  responses.text = xhr.responseText;

                  // Firefox throws an exception when accessing
                  // statusText for faulty cross-domain requests
                  try {
                    statusText = xhr.statusText;
                  } catch( e ) {
                    // We normalize with Webkit giving an empty statusText
                    statusText = "";
                  }

                  // Filter status for non standard behaviors

                  // If the request is local and we have data: assume a success
                  // (success with no data won't get notified, that's the best we
                  // can do given current implementations)
                  if ( !status && s.isLocal && !s.crossDomain ) {
                    status = responses.text ? 200 : 404;
                  // IE - #1450: sometimes returns 1223 when it should be 204
                  } else if ( status === 1223 ) {
                    status = 204;
                  }
                }
              }
            } catch( firefoxAccessException ) {
              if ( !isAbort ) {
                complete( -1, firefoxAccessException );
              }
            }

            // Call complete if needed
            if ( responses ) {
              complete( status, statusText, responses, responseHeaders );
            }
          };

          // if we're in sync mode or it's in cache
          // and has been retrieved directly (IE6 & IE7)
          // we need to manually fire the callback
          if ( !s.async || xhr.readyState === 4 ) {
            callback();
          } else {
            handle = ++xhrId;
            if ( xhrOnUnloadAbort ) {
              // Create the active xhrs callbacks list if needed
              // and attach the unload handler
              if ( !xhrCallbacks ) {
                xhrCallbacks = {};
                jQuery( window ).unload( xhrOnUnloadAbort );
              }
              // Add to list of active xhrs callbacks
              xhrCallbacks[ handle ] = callback;
            }
            xhr.onreadystatechange = callback;
          }
        },

        abort: function() {
          if ( callback ) {
            callback(0,1);
          }
        }
      };
    }
  });
}




var elemdisplay = {},
  iframe, iframeDoc,
  rfxtypes = /^(?:toggle|show|hide)$/,
  rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
  timerId,
  fxAttrs = [
    // height animations
    [ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
    // width animations
    [ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
    // opacity animations
    [ "opacity" ]
  ],
  fxNow,
  requestAnimationFrame = window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame;

jQuery.fn.extend({
  show: function( speed, easing, callback ) {
    var elem, display;

    if ( speed || speed === 0 ) {
      return this.animate( genFx("show", 3), speed, easing, callback);

    } else {
      for ( var i = 0, j = this.length; i < j; i++ ) {
        elem = this[i];

        if ( elem.style ) {
          display = elem.style.display;

          // Reset the inline display of this element to learn if it is
          // being hidden by cascaded rules or not
          if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
            display = elem.style.display = "";
          }

          // Set elements which have been overridden with display: none
          // in a stylesheet to whatever the default browser style is
          // for such an element
          if ( display === "" && jQuery.css( elem, "display" ) === "none" ) {
            jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
          }
        }
      }

      // Set the display of most of the elements in a second loop
      // to avoid the constant reflow
      for ( i = 0; i < j; i++ ) {
        elem = this[i];

        if ( elem.style ) {
          display = elem.style.display;

          if ( display === "" || display === "none" ) {
            elem.style.display = jQuery._data(elem, "olddisplay") || "";
          }
        }
      }

      return this;
    }
  },

  hide: function( speed, easing, callback ) {
    if ( speed || speed === 0 ) {
      return this.animate( genFx("hide", 3), speed, easing, callback);

    } else {
      for ( var i = 0, j = this.length; i < j; i++ ) {
        if ( this[i].style ) {
          var display = jQuery.css( this[i], "display" );

          if ( display !== "none" && !jQuery._data( this[i], "olddisplay" ) ) {
            jQuery._data( this[i], "olddisplay", display );
          }
        }
      }

      // Set the display of the elements in a second loop
      // to avoid the constant reflow
      for ( i = 0; i < j; i++ ) {
        if ( this[i].style ) {
          this[i].style.display = "none";
        }
      }

      return this;
    }
  },

  // Save the old toggle function
  _toggle: jQuery.fn.toggle,

  toggle: function( fn, fn2, callback ) {
    var bool = typeof fn === "boolean";

    if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
      this._toggle.apply( this, arguments );

    } else if ( fn == null || bool ) {
      this.each(function() {
        var state = bool ? fn : jQuery(this).is(":hidden");
        jQuery(this)[ state ? "show" : "hide" ]();
      });

    } else {
      this.animate(genFx("toggle", 3), fn, fn2, callback);
    }

    return this;
  },

  fadeTo: function( speed, to, easing, callback ) {
    return this.filter(":hidden").css("opacity", 0).show().end()
          .animate({opacity: to}, speed, easing, callback);
  },

  animate: function( prop, speed, easing, callback ) {
    var optall = jQuery.speed(speed, easing, callback);

    if ( jQuery.isEmptyObject( prop ) ) {
      return this.each( optall.complete, [ false ] );
    }

    // Do not change referenced properties as per-property easing will be lost
    prop = jQuery.extend( {}, prop );

    return this[ optall.queue === false ? "each" : "queue" ](function() {
      // XXX 'this' does not always have a nodeName when running the
      // test suite

      if ( optall.queue === false ) {
        jQuery._mark( this );
      }

      var opt = jQuery.extend( {}, optall ),
        isElement = this.nodeType === 1,
        hidden = isElement && jQuery(this).is(":hidden"),
        name, val, p,
        display, e,
        parts, start, end, unit;

      // will store per property easing and be used to determine when an animation is complete
      opt.animatedProperties = {};

      for ( p in prop ) {

        // property name normalization
        name = jQuery.camelCase( p );
        if ( p !== name ) {
          prop[ name ] = prop[ p ];
          delete prop[ p ];
        }

        val = prop[ name ];

        // easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
        if ( jQuery.isArray( val ) ) {
          opt.animatedProperties[ name ] = val[ 1 ];
          val = prop[ name ] = val[ 0 ];
        } else {
          opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
        }

        if ( val === "hide" && hidden || val === "show" && !hidden ) {
          return opt.complete.call( this );
        }

        if ( isElement && ( name === "height" || name === "width" ) ) {
          // Make sure that nothing sneaks out
          // Record all 3 overflow attributes because IE does not
          // change the overflow attribute when overflowX and
          // overflowY are set to the same value
          opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

          // Set display property to inline-block for height/width
          // animations on inline elements that are having width/height
          // animated
          if ( jQuery.css( this, "display" ) === "inline" &&
              jQuery.css( this, "float" ) === "none" ) {
            if ( !jQuery.support.inlineBlockNeedsLayout ) {
              this.style.display = "inline-block";

            } else {
              display = defaultDisplay( this.nodeName );

              // inline-level elements accept inline-block;
              // block-level elements need to be inline with layout
              if ( display === "inline" ) {
                this.style.display = "inline-block";

              } else {
                this.style.display = "inline";
                this.style.zoom = 1;
              }
            }
          }
        }
      }

      if ( opt.overflow != null ) {
        this.style.overflow = "hidden";
      }

      for ( p in prop ) {
        e = new jQuery.fx( this, opt, p );
        val = prop[ p ];

        if ( rfxtypes.test(val) ) {
          e[ val === "toggle" ? hidden ? "show" : "hide" : val ]();

        } else {
          parts = rfxnum.exec( val );
          start = e.cur();

          if ( parts ) {
            end = parseFloat( parts[2] );
            unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

            // We need to compute starting value
            if ( unit !== "px" ) {
              jQuery.style( this, p, (end || 1) + unit);
              start = ((end || 1) / e.cur()) * start;
              jQuery.style( this, p, start + unit);
            }

            // If a +=/-= token was provided, we're doing a relative animation
            if ( parts[1] ) {
              end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
            }

            e.custom( start, end, unit );

          } else {
            e.custom( start, val, "" );
          }
        }
      }

      // For JS strict compliance
      return true;
    });
  },

  stop: function( clearQueue, gotoEnd ) {
    if ( clearQueue ) {
      this.queue([]);
    }

    this.each(function() {
      var timers = jQuery.timers,
        i = timers.length;
      // clear marker counters if we know they won't be
      if ( !gotoEnd ) {
        jQuery._unmark( true, this );
      }
      while ( i-- ) {
        if ( timers[i].elem === this ) {
          if (gotoEnd) {
            // force the next step to be the last
            timers[i](true);
          }

          timers.splice(i, 1);
        }
      }
    });

    // start the next in the queue if the last step wasn't forced
    if ( !gotoEnd ) {
      this.dequeue();
    }

    return this;
  }

});

// Animations created synchronously will run synchronously
function createFxNow() {
  setTimeout( clearFxNow, 0 );
  return ( fxNow = jQuery.now() );
}

function clearFxNow() {
  fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
  var obj = {};

  jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
    obj[ this ] = type;
  });

  return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
  slideDown: genFx("show", 1),
  slideUp: genFx("hide", 1),
  slideToggle: genFx("toggle", 1),
  fadeIn: { opacity: "show" },
  fadeOut: { opacity: "hide" },
  fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
  jQuery.fn[ name ] = function( speed, easing, callback ) {
    return this.animate( props, speed, easing, callback );
  };
});

jQuery.extend({
  speed: function( speed, easing, fn ) {
    var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
      complete: fn || !fn && easing ||
        jQuery.isFunction( speed ) && speed,
      duration: speed,
      easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
    };

    opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
      opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

    // Queueing
    opt.old = opt.complete;
    opt.complete = function( noUnmark ) {
      if ( opt.queue !== false ) {
        jQuery.dequeue( this );
      } else if ( noUnmark !== false ) {
        jQuery._unmark( this );
      }

      if ( jQuery.isFunction( opt.old ) ) {
        opt.old.call( this );
      }
    };

    return opt;
  },

  easing: {
    linear: function( p, n, firstNum, diff ) {
      return firstNum + diff * p;
    },
    swing: function( p, n, firstNum, diff ) {
      return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
    }
  },

  timers: [],

  fx: function( elem, options, prop ) {
    this.options = options;
    this.elem = elem;
    this.prop = prop;

    options.orig = options.orig || {};
  }

});

jQuery.fx.prototype = {
  // Simple function for setting a style value
  update: function() {
    if ( this.options.step ) {
      this.options.step.call( this.elem, this.now, this );
    }

    (jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );
  },

  // Get the current size
  cur: function() {
    if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
      return this.elem[ this.prop ];
    }

    var parsed,
      r = jQuery.css( this.elem, this.prop );
    // Empty strings, null, undefined and "auto" are converted to 0,
    // complex values such as "rotate(1rad)" are returned as is,
    // simple values such as "10px" are parsed to Float.
    return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
  },

  // Start an animation from one number to another
  custom: function( from, to, unit ) {
    var self = this,
      fx = jQuery.fx,
      raf;

    this.startTime = fxNow || createFxNow();
    this.start = from;
    this.end = to;
    this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );
    this.now = this.start;
    this.pos = this.state = 0;

    function t( gotoEnd ) {
      return self.step(gotoEnd);
    }

    t.elem = this.elem;

    if ( t() && jQuery.timers.push(t) && !timerId ) {
      // Use requestAnimationFrame instead of setInterval if available
      if ( requestAnimationFrame ) {
        timerId = 1;
        raf = function() {
          // When timerId gets set to null at any point, this stops
          if ( timerId ) {
            requestAnimationFrame( raf );
            fx.tick();
          }
        };
        requestAnimationFrame( raf );
      } else {
        timerId = setInterval( fx.tick, fx.interval );
      }
    }
  },

  // Simple 'show' function
  show: function() {
    // Remember where we started, so that we can go back to it later
    this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
    this.options.show = true;

    // Begin the animation
    // Make sure that we start at a small width/height to avoid any
    // flash of content
    this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

    // Start by showing the element
    jQuery( this.elem ).show();
  },

  // Simple 'hide' function
  hide: function() {
    // Remember where we started, so that we can go back to it later
    this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
    this.options.hide = true;

    // Begin the animation
    this.custom(this.cur(), 0);
  },

  // Each step of an animation
  step: function( gotoEnd ) {
    var t = fxNow || createFxNow(),
      done = true,
      elem = this.elem,
      options = this.options,
      i, n;

    if ( gotoEnd || t >= options.duration + this.startTime ) {
      this.now = this.end;
      this.pos = this.state = 1;
      this.update();

      options.animatedProperties[ this.prop ] = true;

      for ( i in options.animatedProperties ) {
        if ( options.animatedProperties[i] !== true ) {
          done = false;
        }
      }

      if ( done ) {
        // Reset the overflow
        if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

          jQuery.each( [ "", "X", "Y" ], function (index, value) {
            elem.style[ "overflow" + value ] = options.overflow[index];
          });
        }

        // Hide the element if the "hide" operation was done
        if ( options.hide ) {
          jQuery(elem).hide();
        }

        // Reset the properties, if the item has been hidden or shown
        if ( options.hide || options.show ) {
          for ( var p in options.animatedProperties ) {
            jQuery.style( elem, p, options.orig[p] );
          }
        }

        // Execute the complete function
        options.complete.call( elem );
      }

      return false;

    } else {
      // classical easing cannot be used with an Infinity duration
      if ( options.duration == Infinity ) {
        this.now = t;
      } else {
        n = t - this.startTime;
        this.state = n / options.duration;

        // Perform the easing function, defaults to swing
        this.pos = jQuery.easing[ options.animatedProperties[ this.prop ] ]( this.state, n, 0, 1, options.duration );
        this.now = this.start + ((this.end - this.start) * this.pos);
      }
      // Perform the next step of the animation
      this.update();
    }

    return true;
  }
};

jQuery.extend( jQuery.fx, {
  tick: function() {
    for ( var timers = jQuery.timers, i = 0 ; i < timers.length ; ++i ) {
      if ( !timers[i]() ) {
        timers.splice(i--, 1);
      }
    }

    if ( !timers.length ) {
      jQuery.fx.stop();
    }
  },

  interval: 13,

  stop: function() {
    clearInterval( timerId );
    timerId = null;
  },

  speeds: {
    slow: 600,
    fast: 200,
    // Default speed
    _default: 400
  },

  step: {
    opacity: function( fx ) {
      jQuery.style( fx.elem, "opacity", fx.now );
    },

    _default: function( fx ) {
      if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
        fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
      } else {
        fx.elem[ fx.prop ] = fx.now;
      }
    }
  }
});

if ( jQuery.expr && jQuery.expr.filters ) {
  jQuery.expr.filters.animated = function( elem ) {
    return jQuery.grep(jQuery.timers, function( fn ) {
      return elem === fn.elem;
    }).length;
  };
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

  if ( !elemdisplay[ nodeName ] ) {

    var elem = jQuery( "<" + nodeName + ">" ).appendTo( "body" ),
      display = elem.css( "display" );

    elem.remove();

    // If the simple way fails,
    // get element's real default display by attaching it to a temp iframe
    if ( display === "none" || display === "" ) {
      // No iframe to use yet, so create it
      if ( !iframe ) {
        iframe = document.createElement( "iframe" );
        iframe.frameBorder = iframe.width = iframe.height = 0;
      }

      document.body.appendChild( iframe );

      // Create a cacheable copy of the iframe document on first call.
      // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake html
      // document to it, Webkit & Firefox won't allow reusing the iframe document
      if ( !iframeDoc || !iframe.createElement ) {
        iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
        iframeDoc.write( "<!doctype><html><body></body></html>" );
      }

      elem = iframeDoc.createElement( nodeName );

      iframeDoc.body.appendChild( elem );

      display = jQuery.css( elem, "display" );

      document.body.removeChild( iframe );
    }

    // Store the correct default display
    elemdisplay[ nodeName ] = display;
  }

  return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
  rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
  jQuery.fn.offset = function( options ) {
    var elem = this[0], box;

    if ( options ) {
      return this.each(function( i ) {
        jQuery.offset.setOffset( this, options, i );
      });
    }

    if ( !elem || !elem.ownerDocument ) {
      return null;
    }

    if ( elem === elem.ownerDocument.body ) {
      return jQuery.offset.bodyOffset( elem );
    }

    try {
      box = elem.getBoundingClientRect();
    } catch(e) {}

    var doc = elem.ownerDocument,
      docElem = doc.documentElement;

    // Make sure we're not dealing with a disconnected DOM node
    if ( !box || !jQuery.contains( docElem, elem ) ) {
      return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
    }

    var body = doc.body,
      win = getWindow(doc),
      clientTop  = docElem.clientTop  || body.clientTop  || 0,
      clientLeft = docElem.clientLeft || body.clientLeft || 0,
      scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
      scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
      top  = box.top  + scrollTop  - clientTop,
      left = box.left + scrollLeft - clientLeft;

    return { top: top, left: left };
  };

} else {
  jQuery.fn.offset = function( options ) {
    var elem = this[0];

    if ( options ) {
      return this.each(function( i ) {
        jQuery.offset.setOffset( this, options, i );
      });
    }

    if ( !elem || !elem.ownerDocument ) {
      return null;
    }

    if ( elem === elem.ownerDocument.body ) {
      return jQuery.offset.bodyOffset( elem );
    }

    jQuery.offset.initialize();

    var computedStyle,
      offsetParent = elem.offsetParent,
      prevOffsetParent = elem,
      doc = elem.ownerDocument,
      docElem = doc.documentElement,
      body = doc.body,
      defaultView = doc.defaultView,
      prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
      top = elem.offsetTop,
      left = elem.offsetLeft;

    while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
      if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
        break;
      }

      computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
      top  -= elem.scrollTop;
      left -= elem.scrollLeft;

      if ( elem === offsetParent ) {
        top  += elem.offsetTop;
        left += elem.offsetLeft;

        if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
          top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
          left += parseFloat( computedStyle.borderLeftWidth ) || 0;
        }

        prevOffsetParent = offsetParent;
        offsetParent = elem.offsetParent;
      }

      if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
        top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
        left += parseFloat( computedStyle.borderLeftWidth ) || 0;
      }

      prevComputedStyle = computedStyle;
    }

    if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
      top  += body.offsetTop;
      left += body.offsetLeft;
    }

    if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
      top  += Math.max( docElem.scrollTop, body.scrollTop );
      left += Math.max( docElem.scrollLeft, body.scrollLeft );
    }

    return { top: top, left: left };
  };
}

jQuery.offset = {
  initialize: function() {
    var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.css(body, "marginTop") ) || 0,
      html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

    jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

    container.innerHTML = html;
    body.insertBefore( container, body.firstChild );
    innerDiv = container.firstChild;
    checkDiv = innerDiv.firstChild;
    td = innerDiv.nextSibling.firstChild.firstChild;

    this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
    this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

    checkDiv.style.position = "fixed";
    checkDiv.style.top = "20px";

    // safari subtracts parent border width here which is 5px
    this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
    checkDiv.style.position = checkDiv.style.top = "";

    innerDiv.style.overflow = "hidden";
    innerDiv.style.position = "relative";

    this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

    this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

    body.removeChild( container );
    jQuery.offset.initialize = jQuery.noop;
  },

  bodyOffset: function( body ) {
    var top = body.offsetTop,
      left = body.offsetLeft;

    jQuery.offset.initialize();

    if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
      top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
      left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
    }

    return { top: top, left: left };
  },

  setOffset: function( elem, options, i ) {
    var position = jQuery.css( elem, "position" );

    // set position first, in-case top/left are set even on static elem
    if ( position === "static" ) {
      elem.style.position = "relative";
    }

    var curElem = jQuery( elem ),
      curOffset = curElem.offset(),
      curCSSTop = jQuery.css( elem, "top" ),
      curCSSLeft = jQuery.css( elem, "left" ),
      calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
      props = {}, curPosition = {}, curTop, curLeft;

    // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
    if ( calculatePosition ) {
      curPosition = curElem.position();
      curTop = curPosition.top;
      curLeft = curPosition.left;
    } else {
      curTop = parseFloat( curCSSTop ) || 0;
      curLeft = parseFloat( curCSSLeft ) || 0;
    }

    if ( jQuery.isFunction( options ) ) {
      options = options.call( elem, i, curOffset );
    }

    if (options.top != null) {
      props.top = (options.top - curOffset.top) + curTop;
    }
    if (options.left != null) {
      props.left = (options.left - curOffset.left) + curLeft;
    }

    if ( "using" in options ) {
      options.using.call( elem, props );
    } else {
      curElem.css( props );
    }
  }
};


jQuery.fn.extend({
  position: function() {
    if ( !this[0] ) {
      return null;
    }

    var elem = this[0],

    // Get *real* offsetParent
    offsetParent = this.offsetParent(),

    // Get correct offsets
    offset       = this.offset(),
    parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

    // Subtract element margins
    // note: when an element has margin: auto the offsetLeft and marginLeft
    // are the same in Safari causing offset.left to incorrectly be 0
    offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
    offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

    // Add offsetParent borders
    parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
    parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

    // Subtract the two offsets
    return {
      top:  offset.top  - parentOffset.top,
      left: offset.left - parentOffset.left
    };
  },

  offsetParent: function() {
    return this.map(function() {
      var offsetParent = this.offsetParent || document.body;
      while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent;
    });
  }
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
  var method = "scroll" + name;

  jQuery.fn[ method ] = function( val ) {
    var elem, win;

    if ( val === undefined ) {
      elem = this[ 0 ];

      if ( !elem ) {
        return null;
      }

      win = getWindow( elem );

      // Return the scroll offset
      return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
        jQuery.support.boxModel && win.document.documentElement[ method ] ||
          win.document.body[ method ] :
        elem[ method ];
    }

    // Set the scroll offset
    return this.each(function() {
      win = getWindow( this );

      if ( win ) {
        win.scrollTo(
          !i ? val : jQuery( win ).scrollLeft(),
           i ? val : jQuery( win ).scrollTop()
        );

      } else {
        this[ method ] = val;
      }
    });
  };
});

function getWindow( elem ) {
  return jQuery.isWindow( elem ) ?
    elem :
    elem.nodeType === 9 ?
      elem.defaultView || elem.parentWindow :
      false;
}




// Create innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

  var type = name.toLowerCase();

  // innerHeight and innerWidth
  jQuery.fn["inner" + name] = function() {
    return this[0] ?
      parseFloat( jQuery.css( this[0], type, "padding" ) ) :
      null;
  };

  // outerHeight and outerWidth
  jQuery.fn["outer" + name] = function( margin ) {
    return this[0] ?
      parseFloat( jQuery.css( this[0], type, margin ? "margin" : "border" ) ) :
      null;
  };

  jQuery.fn[ type ] = function( size ) {
    // Get window width or height
    var elem = this[0];
    if ( !elem ) {
      return size == null ? null : this;
    }

    if ( jQuery.isFunction( size ) ) {
      return this.each(function( i ) {
        var self = jQuery( this );
        self[ type ]( size.call( this, i, self[ type ]() ) );
      });
    }

    if ( jQuery.isWindow( elem ) ) {
      // Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
      // 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
      var docElemProp = elem.document.documentElement[ "client" + name ];
      return elem.document.compatMode === "CSS1Compat" && docElemProp ||
        elem.document.body[ "client" + name ] || docElemProp;

    // Get document width or height
    } else if ( elem.nodeType === 9 ) {
      // Either scroll[Width/Height] or offset[Width/Height], whichever is greater
      return Math.max(
        elem.documentElement["client" + name],
        elem.body["scroll" + name], elem.documentElement["scroll" + name],
        elem.body["offset" + name], elem.documentElement["offset" + name]
      );

    // Get or set width or height on the element
    } else if ( size === undefined ) {
      var orig = jQuery.css( elem, type ),
        ret = parseFloat( orig );

      return jQuery.isNaN( ret ) ? orig : ret;

    // Set the width or height on the element (default to pixels if value is unitless)
    } else {
      return this.css( type, typeof size === "string" ? size : size + "px" );
    }
  };

});


window.jQuery = window.$ = jQuery;
})(window);
/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.4.4 or later.
 * https://github.com/rails/jquery-ujs

 * Uploading file using rails.js
 * =============================
 *
 * By default, browsers do not allow files to be uploaded via AJAX. As a result, if there are any non-blank file fields
 * in the remote form, this adapter aborts the AJAX submission and allows the form to submit through standard means.
 *
 * The `ajax:aborted:file` event allows you to bind your own handler to process the form submission however you wish.
 *
 * Ex:
 *     $('form').live('ajax:aborted:file', function(event, elements){
 *       // Implement own remote file-transfer handler here for non-blank file inputs passed in `elements`.
 *       // Returning false in this handler tells rails.js to disallow standard form submission
 *       return false;
 *     });
 *
 * The `ajax:aborted:file` event is fired when a file-type input is detected with a non-blank value.
 *
 * Third-party tools can use this hook to detect when an AJAX file upload is attempted, and then use
 * techniques like the iframe method to upload the file instead.
 *
 * Required fields in rails.js
 * ===========================
 *
 * If any blank required inputs (required="required") are detected in the remote form, the whole form submission
 * is canceled. Note that this is unlike file inputs, which still allow standard (non-AJAX) form submission.
 *
 * The `ajax:aborted:required` event allows you to bind your own handler to inform the user of blank required inputs.
 *
 * !! Note that Opera does not fire the form's submit event if there are blank required inputs, so this event may never
 *    get fired in Opera. This event is what causes other browsers to exhibit the same submit-aborting behavior.
 *
 * Ex:
 *     $('form').live('ajax:aborted:required', function(event, elements){
 *       // Returning false in this handler tells rails.js to submit the form anyway.
 *       // The blank required inputs are passed to this function in `elements`.
 *       return ! confirm("Would you like to submit the form with missing info?");
 *     });
 */


(function($, undefined) {
  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]',

		// Select elements bound by jquery-ujs
		selectChangeSelector: 'select[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input:file',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data,
        crossDomain = element.data('cross-domain') || null,
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

      if (rails.fire(element, 'ajax:before')) {

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is('select')) {
          method = element.data('method');
          url = element.data('url');
					data = element.serialize();
					if (element.data('params')) data = data + "&" + element.data('params'); 
        } else {
           method = element.data('method');
           url = element.attr('href');
           data = element.data('params') || null; 
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType, crossDomain: crossDomain,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          }
        };
        // Do not pass url to `ajax` options if blank
        if (url) { $.extend(options, { url: url }); }

        rails.ajax(options);
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = link.attr('href'),
        method = link.data('method'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Adds disabled=disabled attribute
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.attr('disabled', 'disabled');
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Removes disabled attribute
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.removeAttr('disabled');
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input,
        selector = specifiedSelector || 'input,textarea';
      form.find(selector).each(function() {
        input = $(this);
        // Collect non-blank inputs if nonBlank option is true, otherwise, collect blank inputs
        if (nonBlank ? input.val() : !input.val()) {
          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    // find all the submit events directly bound to the form and
    // manually invoke them. If anyone returns false then stop the loop
    callFormSubmitBindings: function(form) {
      var events = form.data('events'), continuePropagation = true;
      if (events !== undefined && events['submit'] !== undefined) {
        $.each(events['submit'], function(i, obj){
          if (typeof obj.handler === 'function') return continuePropagation = obj.handler(obj.data);
        });
      }
      return continuePropagation;
    }
  };

  // ajaxPrefilter is a jQuery 1.5 feature
  if ('ajaxPrefilter' in $) {
    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});
  } else {
    $(document).ajaxSend(function(e, xhr, options){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});
  }

  $(rails.linkClickSelector).live('click.rails', function(e) {
    var link = $(this);
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    if (link.data('remote') !== undefined) {
      rails.handleRemote(link);
      return false;
    } else if (link.data('method')) {
      rails.handleMethod(link);
      return false;
    }
  });

	$(rails.selectChangeSelector).live('change.rails', function(e) {
    var link = $(this);
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    rails.handleRemote(link);
    return false;
  });	

  $(rails.formSubmitSelector).live('submit.rails', function(e) {
    var form = $(this),
      remote = form.data('remote') !== undefined,
      blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
      nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

    if (!rails.allowAction(form)) return rails.stopEverything(e);

    // skip other logic when required values are missing or file upload is present
    if (blankRequiredInputs && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
      return rails.stopEverything(e);
    }

    if (remote) {
      if (nonBlankFileInputs) {
        return rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);
      }

      // If browser does not support submit bubbling, then this live-binding will be called before direct
      // bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
      if (!$.support.submitBubbles && rails.callFormSubmitBindings(form) === false) return rails.stopEverything(e);

      rails.handleRemote(form);
      return false;
    } else {
      // slight timeout so that the submit button gets properly serialized
      setTimeout(function(){ rails.disableFormElements(form); }, 13);
    }
  });

  $(rails.formInputClickSelector).live('click.rails', function(event) {
    var button = $(this);

    if (!rails.allowAction(button)) return rails.stopEverything(event);

    // register the pressed submit button
    var name = button.attr('name'),
      data = name ? {name:name, value:button.val()} : null;

    button.closest('form').data('ujs:submit-button', data);
  });

  $(rails.formSubmitSelector).live('ajax:beforeSend.rails', function(event) {
    if (this == event.target) rails.disableFormElements($(this));
  });

  $(rails.formSubmitSelector).live('ajax:complete.rails', function(event) {
    if (this == event.target) rails.enableFormElements($(this));
  });

})( jQuery );
/*!
 * jQuery UI 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */

(function( $, undefined ) {

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
$.ui = $.ui || {};
if ( $.ui.version ) {
  return;
}

$.extend( $.ui, {
  version: "1.8.12",

  keyCode: {
    ALT: 18,
    BACKSPACE: 8,
    CAPS_LOCK: 20,
    COMMA: 188,
    COMMAND: 91,
    COMMAND_LEFT: 91, // COMMAND
    COMMAND_RIGHT: 93,
    CONTROL: 17,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESCAPE: 27,
    HOME: 36,
    INSERT: 45,
    LEFT: 37,
    MENU: 93, // COMMAND_RIGHT
    NUMPAD_ADD: 107,
    NUMPAD_DECIMAL: 110,
    NUMPAD_DIVIDE: 111,
    NUMPAD_ENTER: 108,
    NUMPAD_MULTIPLY: 106,
    NUMPAD_SUBTRACT: 109,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    PERIOD: 190,
    RIGHT: 39,
    SHIFT: 16,
    SPACE: 32,
    TAB: 9,
    UP: 38,
    WINDOWS: 91 // COMMAND
  }
});

// plugins
$.fn.extend({
  _focus: $.fn.focus,
  focus: function( delay, fn ) {
    return typeof delay === "number" ?
      this.each(function() {
        var elem = this;
        setTimeout(function() {
          $( elem ).focus();
          if ( fn ) {
            fn.call( elem );
          }
        }, delay );
      }) :
      this._focus.apply( this, arguments );
  },

  scrollParent: function() {
    var scrollParent;
    if (($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
      scrollParent = this.parents().filter(function() {
        return (/(relative|absolute|fixed)/).test($.curCSS(this,'position',1)) && (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
      }).eq(0);
    } else {
      scrollParent = this.parents().filter(function() {
        return (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
      }).eq(0);
    }

    return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
  },

  zIndex: function( zIndex ) {
    if ( zIndex !== undefined ) {
      return this.css( "zIndex", zIndex );
    }

    if ( this.length ) {
      var elem = $( this[ 0 ] ), position, value;
      while ( elem.length && elem[ 0 ] !== document ) {
        // Ignore z-index if position is set to a value where z-index is ignored by the browser
        // This makes behavior of this function consistent across browsers
        // WebKit always returns auto if the element is positioned
        position = elem.css( "position" );
        if ( position === "absolute" || position === "relative" || position === "fixed" ) {
          // IE returns 0 when zIndex is not specified
          // other browsers return a string
          // we ignore the case of nested elements with an explicit value of 0
          // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
          value = parseInt( elem.css( "zIndex" ), 10 );
          if ( !isNaN( value ) && value !== 0 ) {
            return value;
          }
        }
        elem = elem.parent();
      }
    }

    return 0;
  },

  disableSelection: function() {
    return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
      ".ui-disableSelection", function( event ) {
        event.preventDefault();
      });
  },

  enableSelection: function() {
    return this.unbind( ".ui-disableSelection" );
  }
});

$.each( [ "Width", "Height" ], function( i, name ) {
  var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
    type = name.toLowerCase(),
    orig = {
      innerWidth: $.fn.innerWidth,
      innerHeight: $.fn.innerHeight,
      outerWidth: $.fn.outerWidth,
      outerHeight: $.fn.outerHeight
    };

  function reduce( elem, size, border, margin ) {
    $.each( side, function() {
      size -= parseFloat( $.curCSS( elem, "padding" + this, true) ) || 0;
      if ( border ) {
        size -= parseFloat( $.curCSS( elem, "border" + this + "Width", true) ) || 0;
      }
      if ( margin ) {
        size -= parseFloat( $.curCSS( elem, "margin" + this, true) ) || 0;
      }
    });
    return size;
  }

  $.fn[ "inner" + name ] = function( size ) {
    if ( size === undefined ) {
      return orig[ "inner" + name ].call( this );
    }

    return this.each(function() {
      $( this ).css( type, reduce( this, size ) + "px" );
    });
  };

  $.fn[ "outer" + name] = function( size, margin ) {
    if ( typeof size !== "number" ) {
      return orig[ "outer" + name ].call( this, size );
    }

    return this.each(function() {
      $( this).css( type, reduce( this, size, true, margin ) + "px" );
    });
  };
});

// selectors
function visible( element ) {
  return !$( element ).parents().andSelf().filter(function() {
    return $.curCSS( this, "visibility" ) === "hidden" ||
      $.expr.filters.hidden( this );
  }).length;
}

$.extend( $.expr[ ":" ], {
  data: function( elem, i, match ) {
    return !!$.data( elem, match[ 3 ] );
  },

  focusable: function( element ) {
    var nodeName = element.nodeName.toLowerCase(),
      tabIndex = $.attr( element, "tabindex" );
    if ( "area" === nodeName ) {
      var map = element.parentNode,
        mapName = map.name,
        img;
      if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
        return false;
      }
      img = $( "img[usemap=#" + mapName + "]" )[0];
      return !!img && visible( img );
    }
    return ( /input|select|textarea|button|object/.test( nodeName )
      ? !element.disabled
      : "a" == nodeName
        ? element.href || !isNaN( tabIndex )
        : !isNaN( tabIndex ))
      // the element and all of its ancestors must be visible
      && visible( element );
  },

  tabbable: function( element ) {
    var tabIndex = $.attr( element, "tabindex" );
    return ( isNaN( tabIndex ) || tabIndex >= 0 ) && $( element ).is( ":focusable" );
  }
});

// support
$(function() {
  var body = document.body,
    div = body.appendChild( div = document.createElement( "div" ) );

  $.extend( div.style, {
    minHeight: "100px",
    height: "auto",
    padding: 0,
    borderWidth: 0
  });

  $.support.minHeight = div.offsetHeight === 100;
  $.support.selectstart = "onselectstart" in div;

  // set display to none to avoid a layout bug in IE
  // http://dev.jquery.com/ticket/4014
  body.removeChild( div ).style.display = "none";
});





// deprecated
$.extend( $.ui, {
  // $.ui.plugin is deprecated.  Use the proxy pattern instead.
  plugin: {
    add: function( module, option, set ) {
      var proto = $.ui[ module ].prototype;
      for ( var i in set ) {
        proto.plugins[ i ] = proto.plugins[ i ] || [];
        proto.plugins[ i ].push( [ option, set[ i ] ] );
      }
    },
    call: function( instance, name, args ) {
      var set = instance.plugins[ name ];
      if ( !set || !instance.element[ 0 ].parentNode ) {
        return;
      }
  
      for ( var i = 0; i < set.length; i++ ) {
        if ( instance.options[ set[ i ][ 0 ] ] ) {
          set[ i ][ 1 ].apply( instance.element, args );
        }
      }
    }
  },
  
  // will be deprecated when we switch to jQuery 1.4 - use jQuery.contains()
  contains: function( a, b ) {
    return document.compareDocumentPosition ?
      a.compareDocumentPosition( b ) & 16 :
      a !== b && a.contains( b );
  },
  
  // only used by resizable
  hasScroll: function( el, a ) {
  
    //If overflow is hidden, the element might have extra content, but the user wants to hide it
    if ( $( el ).css( "overflow" ) === "hidden") {
      return false;
    }
  
    var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
      has = false;
  
    if ( el[ scroll ] > 0 ) {
      return true;
    }
  
    // TODO: determine which cases actually cause this to happen
    // if the element doesn't have the scroll set, see if it's possible to
    // set the scroll
    el[ scroll ] = 1;
    has = ( el[ scroll ] > 0 );
    el[ scroll ] = 0;
    return has;
  },
  
  // these are odd functions, fix the API or move into individual plugins
  isOverAxis: function( x, reference, size ) {
    //Determines when x coordinate is over "b" element axis
    return ( x > reference ) && ( x < ( reference + size ) );
  },
  isOver: function( y, x, top, left, height, width ) {
    //Determines when x, y coordinates is over "b" element
    return $.ui.isOverAxis( y, top, height ) && $.ui.isOverAxis( x, left, width );
  }
});

})( jQuery );
/*!
 * jQuery UI Widget 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function( $, undefined ) {

// jQuery 1.4+
if ( $.cleanData ) {
  var _cleanData = $.cleanData;
  $.cleanData = function( elems ) {
    for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
      $( elem ).triggerHandler( "remove" );
    }
    _cleanData( elems );
  };
} else {
  var _remove = $.fn.remove;
  $.fn.remove = function( selector, keepData ) {
    return this.each(function() {
      if ( !keepData ) {
        if ( !selector || $.filter( selector, [ this ] ).length ) {
          $( "*", this ).add( [ this ] ).each(function() {
            $( this ).triggerHandler( "remove" );
          });
        }
      }
      return _remove.call( $(this), selector, keepData );
    });
  };
}

$.widget = function( name, base, prototype ) {
  var namespace = name.split( "." )[ 0 ],
    fullName;
  name = name.split( "." )[ 1 ];
  fullName = namespace + "-" + name;

  if ( !prototype ) {
    prototype = base;
    base = $.Widget;
  }

  // create selector for plugin
  $.expr[ ":" ][ fullName ] = function( elem ) {
    return !!$.data( elem, name );
  };

  $[ namespace ] = $[ namespace ] || {};
  $[ namespace ][ name ] = function( options, element ) {
    // allow instantiation without initializing for simple inheritance
    if ( arguments.length ) {
      this._createWidget( options, element );
    }
  };

  var basePrototype = new base();
  // we need to make the options hash a property directly on the new instance
  // otherwise we'll modify the options hash on the prototype that we're
  // inheriting from
//  $.each( basePrototype, function( key, val ) {
//    if ( $.isPlainObject(val) ) {
//      basePrototype[ key ] = $.extend( {}, val );
//    }
//  });
  basePrototype.options = $.extend( true, {}, basePrototype.options );
  $[ namespace ][ name ].prototype = $.extend( true, basePrototype, {
    namespace: namespace,
    widgetName: name,
    widgetEventPrefix: $[ namespace ][ name ].prototype.widgetEventPrefix || name,
    widgetBaseClass: fullName
  }, prototype );

  $.widget.bridge( name, $[ namespace ][ name ] );
};

$.widget.bridge = function( name, object ) {
  $.fn[ name ] = function( options ) {
    var isMethodCall = typeof options === "string",
      args = Array.prototype.slice.call( arguments, 1 ),
      returnValue = this;

    // allow multiple hashes to be passed on init
    options = !isMethodCall && args.length ?
      $.extend.apply( null, [ true, options ].concat(args) ) :
      options;

    // prevent calls to internal methods
    if ( isMethodCall && options.charAt( 0 ) === "_" ) {
      return returnValue;
    }

    if ( isMethodCall ) {
      this.each(function() {
        var instance = $.data( this, name ),
          methodValue = instance && $.isFunction( instance[options] ) ?
            instance[ options ].apply( instance, args ) :
            instance;
        // TODO: add this back in 1.9 and use $.error() (see #5972)
//        if ( !instance ) {
//          throw "cannot call methods on " + name + " prior to initialization; " +
//            "attempted to call method '" + options + "'";
//        }
//        if ( !$.isFunction( instance[options] ) ) {
//          throw "no such method '" + options + "' for " + name + " widget instance";
//        }
//        var methodValue = instance[ options ].apply( instance, args );
        if ( methodValue !== instance && methodValue !== undefined ) {
          returnValue = methodValue;
          return false;
        }
      });
    } else {
      this.each(function() {
        var instance = $.data( this, name );
        if ( instance ) {
          instance.option( options || {} )._init();
        } else {
          $.data( this, name, new object( options, this ) );
        }
      });
    }

    return returnValue;
  };
};

$.Widget = function( options, element ) {
  // allow instantiation without initializing for simple inheritance
  if ( arguments.length ) {
    this._createWidget( options, element );
  }
};

$.Widget.prototype = {
  widgetName: "widget",
  widgetEventPrefix: "",
  options: {
    disabled: false
  },
  _createWidget: function( options, element ) {
    // $.widget.bridge stores the plugin instance, but we do it anyway
    // so that it's stored even before the _create function runs
    $.data( element, this.widgetName, this );
    this.element = $( element );
    this.options = $.extend( true, {},
      this.options,
      this._getCreateOptions(),
      options );

    var self = this;
    this.element.bind( "remove." + this.widgetName, function() {
      self.destroy();
    });

    this._create();
    this._trigger( "create" );
    this._init();
  },
  _getCreateOptions: function() {
    return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
  },
  _create: function() {},
  _init: function() {},

  destroy: function() {
    this.element
      .unbind( "." + this.widgetName )
      .removeData( this.widgetName );
    this.widget()
      .unbind( "." + this.widgetName )
      .removeAttr( "aria-disabled" )
      .removeClass(
        this.widgetBaseClass + "-disabled " +
        "ui-state-disabled" );
  },

  widget: function() {
    return this.element;
  },

  option: function( key, value ) {
    var options = key;

    if ( arguments.length === 0 ) {
      // don't return a reference to the internal hash
      return $.extend( {}, this.options );
    }

    if  (typeof key === "string" ) {
      if ( value === undefined ) {
        return this.options[ key ];
      }
      options = {};
      options[ key ] = value;
    }

    this._setOptions( options );

    return this;
  },
  _setOptions: function( options ) {
    var self = this;
    $.each( options, function( key, value ) {
      self._setOption( key, value );
    });

    return this;
  },
  _setOption: function( key, value ) {
    this.options[ key ] = value;

    if ( key === "disabled" ) {
      this.widget()
        [ value ? "addClass" : "removeClass"](
          this.widgetBaseClass + "-disabled" + " " +
          "ui-state-disabled" )
        .attr( "aria-disabled", value );
    }

    return this;
  },

  enable: function() {
    return this._setOption( "disabled", false );
  },
  disable: function() {
    return this._setOption( "disabled", true );
  },

  _trigger: function( type, event, data ) {
    var callback = this.options[ type ];

    event = $.Event( event );
    event.type = ( type === this.widgetEventPrefix ?
      type :
      this.widgetEventPrefix + type ).toLowerCase();
    data = data || {};

    // copy original event properties over to the new event
    // this would happen if we could call $.event.fix instead of $.Event
    // but we don't have a way to force an event to be fixed multiple times
    if ( event.originalEvent ) {
      for ( var i = $.event.props.length, prop; i; ) {
        prop = $.event.props[ --i ];
        event[ prop ] = event.originalEvent[ prop ];
      }
    }

    this.element.trigger( event, data );

    return !( $.isFunction(callback) &&
      callback.call( this.element[0], event, data ) === false ||
      event.isDefaultPrevented() );
  }
};

})( jQuery );
/*!
 * jQuery UI Mouse 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *  jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.mouse", {
  options: {
    cancel: ':input,option',
    distance: 1,
    delay: 0
  },
  _mouseInit: function() {
    var self = this;

    this.element
      .bind('mousedown.'+this.widgetName, function(event) {
        return self._mouseDown(event);
      })
      .bind('click.'+this.widgetName, function(event) {
        if (true === $.data(event.target, self.widgetName + '.preventClickEvent')) {
            $.removeData(event.target, self.widgetName + '.preventClickEvent');
          event.stopImmediatePropagation();
          return false;
        }
      });

    this.started = false;
  },

  // TODO: make sure destroying one instance of mouse doesn't mess with
  // other instances of mouse
  _mouseDestroy: function() {
    this.element.unbind('.'+this.widgetName);
  },

  _mouseDown: function(event) {
    // don't let more than one widget handle mouseStart
    // TODO: figure out why we have to use originalEvent
    event.originalEvent = event.originalEvent || {};
    if (event.originalEvent.mouseHandled) { return; }

    // we may have missed mouseup (out of window)
    (this._mouseStarted && this._mouseUp(event));

    this._mouseDownEvent = event;

    var self = this,
      btnIsLeft = (event.which == 1),
      elIsCancel = (typeof this.options.cancel == "string" ? $(event.target).parents().add(event.target).filter(this.options.cancel).length : false);
    if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
      return true;
    }

    this.mouseDelayMet = !this.options.delay;
    if (!this.mouseDelayMet) {
      this._mouseDelayTimer = setTimeout(function() {
        self.mouseDelayMet = true;
      }, this.options.delay);
    }

    if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
      this._mouseStarted = (this._mouseStart(event) !== false);
      if (!this._mouseStarted) {
        event.preventDefault();
        return true;
      }
    }

    // Click event may never have fired (Gecko & Opera)
    if (true === $.data(event.target, this.widgetName + '.preventClickEvent')) {
      $.removeData(event.target, this.widgetName + '.preventClickEvent');
    }

    // these delegates are required to keep context
    this._mouseMoveDelegate = function(event) {
      return self._mouseMove(event);
    };
    this._mouseUpDelegate = function(event) {
      return self._mouseUp(event);
    };
    $(document)
      .bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
      .bind('mouseup.'+this.widgetName, this._mouseUpDelegate);

    event.preventDefault();
    event.originalEvent.mouseHandled = true;
    return true;
  },

  _mouseMove: function(event) {
    // IE mouseup check - mouseup happened when mouse was out of window
    if ($.browser.msie && !(document.documentMode >= 9) && !event.button) {
      return this._mouseUp(event);
    }

    if (this._mouseStarted) {
      this._mouseDrag(event);
      return event.preventDefault();
    }

    if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
      this._mouseStarted =
        (this._mouseStart(this._mouseDownEvent, event) !== false);
      (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
    }

    return !this._mouseStarted;
  },

  _mouseUp: function(event) {
    $(document)
      .unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
      .unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);

    if (this._mouseStarted) {
      this._mouseStarted = false;

      if (event.target == this._mouseDownEvent.target) {
          $.data(event.target, this.widgetName + '.preventClickEvent', true);
      }

      this._mouseStop(event);
    }

    return false;
  },

  _mouseDistanceMet: function(event) {
    return (Math.max(
        Math.abs(this._mouseDownEvent.pageX - event.pageX),
        Math.abs(this._mouseDownEvent.pageY - event.pageY)
      ) >= this.options.distance
    );
  },

  _mouseDelayMet: function(event) {
    return this.mouseDelayMet;
  },

  // These are placeholder methods, to be overriden by extending plugin
  _mouseStart: function(event) {},
  _mouseDrag: function(event) {},
  _mouseStop: function(event) {},
  _mouseCapture: function(event) { return true; }
});

})(jQuery);
/*
 * jQuery UI Draggable 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.mouse.js
 *  jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.draggable", $.ui.mouse, {
  widgetEventPrefix: "drag",
  options: {
    addClasses: true,
    appendTo: "parent",
    axis: false,
    connectToSortable: false,
    containment: false,
    cursor: "auto",
    cursorAt: false,
    grid: false,
    handle: false,
    helper: "original",
    iframeFix: false,
    opacity: false,
    refreshPositions: false,
    revert: false,
    revertDuration: 500,
    scope: "default",
    scroll: true,
    scrollSensitivity: 20,
    scrollSpeed: 20,
    snap: false,
    snapMode: "both",
    snapTolerance: 20,
    stack: false,
    zIndex: false
  },
  _create: function() {

    if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
      this.element[0].style.position = 'relative';

    (this.options.addClasses && this.element.addClass("ui-draggable"));
    (this.options.disabled && this.element.addClass("ui-draggable-disabled"));

    this._mouseInit();

  },

  destroy: function() {
    if(!this.element.data('draggable')) return;
    this.element
      .removeData("draggable")
      .unbind(".draggable")
      .removeClass("ui-draggable"
        + " ui-draggable-dragging"
        + " ui-draggable-disabled");
    this._mouseDestroy();

    return this;
  },

  _mouseCapture: function(event) {

    var o = this.options;

    // among others, prevent a drag on a resizable-handle
    if (this.helper || o.disabled || $(event.target).is('.ui-resizable-handle'))
      return false;

    //Quit if we're not on a valid handle
    this.handle = this._getHandle(event);
    if (!this.handle)
      return false;

    return true;

  },

  _mouseStart: function(event) {

    var o = this.options;

    //Create and append the visible helper
    this.helper = this._createHelper(event);

    //Cache the helper size
    this._cacheHelperProportions();

    //If ddmanager is used for droppables, set the global draggable
    if($.ui.ddmanager)
      $.ui.ddmanager.current = this;

    /*
     * - Position generation -
     * This block generates everything position related - it's the core of draggables.
     */

    //Cache the margins of the original element
    this._cacheMargins();

    //Store the helper's css position
    this.cssPosition = this.helper.css("position");
    this.scrollParent = this.helper.scrollParent();

    //The element's absolute position on the page minus margins
    this.offset = this.positionAbs = this.element.offset();
    this.offset = {
      top: this.offset.top - this.margins.top,
      left: this.offset.left - this.margins.left
    };

    $.extend(this.offset, {
      click: { //Where the click happened, relative to the element
        left: event.pageX - this.offset.left,
        top: event.pageY - this.offset.top
      },
      parent: this._getParentOffset(),
      relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
    });

    //Generate the original position
    this.originalPosition = this.position = this._generatePosition(event);
    this.originalPageX = event.pageX;
    this.originalPageY = event.pageY;

    //Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
    (o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

    //Set a containment if given in the options
    if(o.containment)
      this._setContainment();

    //Trigger event + callbacks
    if(this._trigger("start", event) === false) {
      this._clear();
      return false;
    }

    //Recache the helper size
    this._cacheHelperProportions();

    //Prepare the droppable offsets
    if ($.ui.ddmanager && !o.dropBehaviour)
      $.ui.ddmanager.prepareOffsets(this, event);

    this.helper.addClass("ui-draggable-dragging");
    this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position
    return true;
  },

  _mouseDrag: function(event, noPropagation) {

    //Compute the helpers position
    this.position = this._generatePosition(event);
    this.positionAbs = this._convertPositionTo("absolute");

    //Call plugins and callbacks and use the resulting position if something is returned
    if (!noPropagation) {
      var ui = this._uiHash();
      if(this._trigger('drag', event, ui) === false) {
        this._mouseUp({});
        return false;
      }
      this.position = ui.position;
    }

    if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
    if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';
    if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

    return false;
  },

  _mouseStop: function(event) {

    //If we are using droppables, inform the manager about the drop
    var dropped = false;
    if ($.ui.ddmanager && !this.options.dropBehaviour)
      dropped = $.ui.ddmanager.drop(this, event);

    //if a drop comes from outside (a sortable)
    if(this.dropped) {
      dropped = this.dropped;
      this.dropped = false;
    }
    
    //if the original element is removed, don't bother to continue if helper is set to "original"
    if((!this.element[0] || !this.element[0].parentNode) && this.options.helper == "original")
      return false;

    if((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
      var self = this;
      $(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
        if(self._trigger("stop", event) !== false) {
          self._clear();
        }
      });
    } else {
      if(this._trigger("stop", event) !== false) {
        this._clear();
      }
    }

    return false;
  },
  
  cancel: function() {
    
    if(this.helper.is(".ui-draggable-dragging")) {
      this._mouseUp({});
    } else {
      this._clear();
    }
    
    return this;
    
  },

  _getHandle: function(event) {

    var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
    $(this.options.handle, this.element)
      .find("*")
      .andSelf()
      .each(function() {
        if(this == event.target) handle = true;
      });

    return handle;

  },

  _createHelper: function(event) {

    var o = this.options;
    var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone() : this.element);

    if(!helper.parents('body').length)
      helper.appendTo((o.appendTo == 'parent' ? this.element[0].parentNode : o.appendTo));

    if(helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position")))
      helper.css("position", "absolute");

    return helper;

  },

  _adjustOffsetFromHelper: function(obj) {
    if (typeof obj == 'string') {
      obj = obj.split(' ');
    }
    if ($.isArray(obj)) {
      obj = {left: +obj[0], top: +obj[1] || 0};
    }
    if ('left' in obj) {
      this.offset.click.left = obj.left + this.margins.left;
    }
    if ('right' in obj) {
      this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
    }
    if ('top' in obj) {
      this.offset.click.top = obj.top + this.margins.top;
    }
    if ('bottom' in obj) {
      this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
    }
  },

  _getParentOffset: function() {

    //Get the offsetParent and cache its position
    this.offsetParent = this.helper.offsetParent();
    var po = this.offsetParent.offset();

    // This is a special case where we need to modify a offset calculated on start, since the following happened:
    // 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
    // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
    //    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
    if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
      po.left += this.scrollParent.scrollLeft();
      po.top += this.scrollParent.scrollTop();
    }

    if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
    || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) //Ugly IE fix
      po = { top: 0, left: 0 };

    return {
      top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
      left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
    };

  },

  _getRelativeOffset: function() {

    if(this.cssPosition == "relative") {
      var p = this.element.position();
      return {
        top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
        left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
      };
    } else {
      return { top: 0, left: 0 };
    }

  },

  _cacheMargins: function() {
    this.margins = {
      left: (parseInt(this.element.css("marginLeft"),10) || 0),
      top: (parseInt(this.element.css("marginTop"),10) || 0),
      right: (parseInt(this.element.css("marginRight"),10) || 0),
      bottom: (parseInt(this.element.css("marginBottom"),10) || 0)
    };
  },

  _cacheHelperProportions: function() {
    this.helperProportions = {
      width: this.helper.outerWidth(),
      height: this.helper.outerHeight()
    };
  },

  _setContainment: function() {

    var o = this.options;
    if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
    if(o.containment == 'document' || o.containment == 'window') this.containment = [
      (o.containment == 'document' ? 0 : $(window).scrollLeft()) - this.offset.relative.left - this.offset.parent.left,
      (o.containment == 'document' ? 0 : $(window).scrollTop()) - this.offset.relative.top - this.offset.parent.top,
      (o.containment == 'document' ? 0 : $(window).scrollLeft()) + $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
      (o.containment == 'document' ? 0 : $(window).scrollTop()) + ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
    ];

    if(!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
      var ce = $(o.containment)[0]; if(!ce) return;
      var co = $(o.containment).offset();
      var over = ($(ce).css("overflow") != 'hidden');

      this.containment = [
        co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0),
        co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0),
        co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right,
        co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top  - this.margins.bottom
      ];
    } else if(o.containment.constructor == Array) {
      this.containment = o.containment;
    }

  },

  _convertPositionTo: function(d, pos) {

    if(!pos) pos = this.position;
    var mod = d == "absolute" ? 1 : -1;
    var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

    return {
      top: (
        pos.top                                 // The absolute mouse position
        + this.offset.relative.top * mod                    // Only for relative positioned nodes: Relative offset from element to offset parent
        + this.offset.parent.top * mod                      // The offsetParent's offset without borders (offset + border)
        - ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
      ),
      left: (
        pos.left                                // The absolute mouse position
        + this.offset.relative.left * mod                   // Only for relative positioned nodes: Relative offset from element to offset parent
        + this.offset.parent.left * mod                     // The offsetParent's offset without borders (offset + border)
        - ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
      )
    };

  },

  _generatePosition: function(event) {

    var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
    var pageX = event.pageX;
    var pageY = event.pageY;

    /*
     * - Position constraining -
     * Constrain the position to a mix of grid, containment.
     */

    if(this.originalPosition) { //If we are not dragging yet, we won't check for options

      if(this.containment) {
        if(event.pageX - this.offset.click.left < this.containment[0]) pageX = this.containment[0] + this.offset.click.left;
        if(event.pageY - this.offset.click.top < this.containment[1]) pageY = this.containment[1] + this.offset.click.top;
        if(event.pageX - this.offset.click.left > this.containment[2]) pageX = this.containment[2] + this.offset.click.left;
        if(event.pageY - this.offset.click.top > this.containment[3]) pageY = this.containment[3] + this.offset.click.top;
      }

      if(o.grid) {
        var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
        pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

        var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
        pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
      }

    }

    return {
      top: (
        pageY                               // The absolute mouse position
        - this.offset.click.top                         // Click offset (relative to the element)
        - this.offset.relative.top                        // Only for relative positioned nodes: Relative offset from element to offset parent
        - this.offset.parent.top                        // The offsetParent's offset without borders (offset + border)
        + ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
      ),
      left: (
        pageX                               // The absolute mouse position
        - this.offset.click.left                        // Click offset (relative to the element)
        - this.offset.relative.left                       // Only for relative positioned nodes: Relative offset from element to offset parent
        - this.offset.parent.left                       // The offsetParent's offset without borders (offset + border)
        + ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
      )
    };

  },

  _clear: function() {
    this.helper.removeClass("ui-draggable-dragging");
    if(this.helper[0] != this.element[0] && !this.cancelHelperRemoval) this.helper.remove();
    //if($.ui.ddmanager) $.ui.ddmanager.current = null;
    this.helper = null;
    this.cancelHelperRemoval = false;
  },

  // From now on bulk stuff - mainly helpers

  _trigger: function(type, event, ui) {
    ui = ui || this._uiHash();
    $.ui.plugin.call(this, type, [event, ui]);
    if(type == "drag") this.positionAbs = this._convertPositionTo("absolute"); //The absolute position has to be recalculated after plugins
    return $.Widget.prototype._trigger.call(this, type, event, ui);
  },

  plugins: {},

  _uiHash: function(event) {
    return {
      helper: this.helper,
      position: this.position,
      originalPosition: this.originalPosition,
      offset: this.positionAbs
    };
  }

});

$.extend($.ui.draggable, {
  version: "1.8.12"
});

$.ui.plugin.add("draggable", "connectToSortable", {
  start: function(event, ui) {

    var inst = $(this).data("draggable"), o = inst.options,
      uiSortable = $.extend({}, ui, { item: inst.element });
    inst.sortables = [];
    $(o.connectToSortable).each(function() {
      var sortable = $.data(this, 'sortable');
      if (sortable && !sortable.options.disabled) {
        inst.sortables.push({
          instance: sortable,
          shouldRevert: sortable.options.revert
        });
        sortable.refreshPositions();  // Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
        sortable._trigger("activate", event, uiSortable);
      }
    });

  },
  stop: function(event, ui) {

    //If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
    var inst = $(this).data("draggable"),
      uiSortable = $.extend({}, ui, { item: inst.element });

    $.each(inst.sortables, function() {
      if(this.instance.isOver) {

        this.instance.isOver = 0;

        inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
        this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

        //The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: 'valid/invalid'
        if(this.shouldRevert) this.instance.options.revert = true;

        //Trigger the stop of the sortable
        this.instance._mouseStop(event);

        this.instance.options.helper = this.instance.options._helper;

        //If the helper has been the original item, restore properties in the sortable
        if(inst.options.helper == 'original')
          this.instance.currentItem.css({ top: 'auto', left: 'auto' });

      } else {
        this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
        this.instance._trigger("deactivate", event, uiSortable);
      }

    });

  },
  drag: function(event, ui) {

    var inst = $(this).data("draggable"), self = this;

    var checkPos = function(o) {
      var dyClick = this.offset.click.top, dxClick = this.offset.click.left;
      var helperTop = this.positionAbs.top, helperLeft = this.positionAbs.left;
      var itemHeight = o.height, itemWidth = o.width;
      var itemTop = o.top, itemLeft = o.left;

      return $.ui.isOver(helperTop + dyClick, helperLeft + dxClick, itemTop, itemLeft, itemHeight, itemWidth);
    };

    $.each(inst.sortables, function(i) {
      
      //Copy over some variables to allow calling the sortable's native _intersectsWith
      this.instance.positionAbs = inst.positionAbs;
      this.instance.helperProportions = inst.helperProportions;
      this.instance.offset.click = inst.offset.click;
      
      if(this.instance._intersectsWith(this.instance.containerCache)) {

        //If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
        if(!this.instance.isOver) {

          this.instance.isOver = 1;
          //Now we fake the start of dragging for the sortable instance,
          //by cloning the list group item, appending it to the sortable and using it as inst.currentItem
          //We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
          this.instance.currentItem = $(self).clone().appendTo(this.instance.element).data("sortable-item", true);
          this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
          this.instance.options.helper = function() { return ui.helper[0]; };

          event.target = this.instance.currentItem[0];
          this.instance._mouseCapture(event, true);
          this.instance._mouseStart(event, true, true);

          //Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
          this.instance.offset.click.top = inst.offset.click.top;
          this.instance.offset.click.left = inst.offset.click.left;
          this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
          this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

          inst._trigger("toSortable", event);
          inst.dropped = this.instance.element; //draggable revert needs that
          //hack so receive/update callbacks work (mostly)
          inst.currentItem = inst.element;
          this.instance.fromOutside = inst;

        }

        //Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
        if(this.instance.currentItem) this.instance._mouseDrag(event);

      } else {

        //If it doesn't intersect with the sortable, and it intersected before,
        //we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
        if(this.instance.isOver) {

          this.instance.isOver = 0;
          this.instance.cancelHelperRemoval = true;
          
          //Prevent reverting on this forced stop
          this.instance.options.revert = false;
          
          // The out event needs to be triggered independently
          this.instance._trigger('out', event, this.instance._uiHash(this.instance));
          
          this.instance._mouseStop(event, true);
          this.instance.options.helper = this.instance.options._helper;

          //Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
          this.instance.currentItem.remove();
          if(this.instance.placeholder) this.instance.placeholder.remove();

          inst._trigger("fromSortable", event);
          inst.dropped = false; //draggable revert needs that
        }

      };

    });

  }
});

$.ui.plugin.add("draggable", "cursor", {
  start: function(event, ui) {
    var t = $('body'), o = $(this).data('draggable').options;
    if (t.css("cursor")) o._cursor = t.css("cursor");
    t.css("cursor", o.cursor);
  },
  stop: function(event, ui) {
    var o = $(this).data('draggable').options;
    if (o._cursor) $('body').css("cursor", o._cursor);
  }
});

$.ui.plugin.add("draggable", "iframeFix", {
  start: function(event, ui) {
    var o = $(this).data('draggable').options;
    $(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
      $('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>')
      .css({
        width: this.offsetWidth+"px", height: this.offsetHeight+"px",
        position: "absolute", opacity: "0.001", zIndex: 1000
      })
      .css($(this).offset())
      .appendTo("body");
    });
  },
  stop: function(event, ui) {
    $("div.ui-draggable-iframeFix").each(function() { this.parentNode.removeChild(this); }); //Remove frame helpers
  }
});

$.ui.plugin.add("draggable", "opacity", {
  start: function(event, ui) {
    var t = $(ui.helper), o = $(this).data('draggable').options;
    if(t.css("opacity")) o._opacity = t.css("opacity");
    t.css('opacity', o.opacity);
  },
  stop: function(event, ui) {
    var o = $(this).data('draggable').options;
    if(o._opacity) $(ui.helper).css('opacity', o._opacity);
  }
});

$.ui.plugin.add("draggable", "scroll", {
  start: function(event, ui) {
    var i = $(this).data("draggable");
    if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();
  },
  drag: function(event, ui) {

    var i = $(this).data("draggable"), o = i.options, scrolled = false;

    if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {

      if(!o.axis || o.axis != 'x') {
        if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
          i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
        else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity)
          i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
      }

      if(!o.axis || o.axis != 'y') {
        if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
          i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
        else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity)
          i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
      }

    } else {

      if(!o.axis || o.axis != 'x') {
        if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
          scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
        else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
          scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
      }

      if(!o.axis || o.axis != 'y') {
        if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
          scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
        else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
          scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
      }

    }

    if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
      $.ui.ddmanager.prepareOffsets(i, event);

  }
});

$.ui.plugin.add("draggable", "snap", {
  start: function(event, ui) {

    var i = $(this).data("draggable"), o = i.options;
    i.snapElements = [];

    $(o.snap.constructor != String ? ( o.snap.items || ':data(draggable)' ) : o.snap).each(function() {
      var $t = $(this); var $o = $t.offset();
      if(this != i.element[0]) i.snapElements.push({
        item: this,
        width: $t.outerWidth(), height: $t.outerHeight(),
        top: $o.top, left: $o.left
      });
    });

  },
  drag: function(event, ui) {

    var inst = $(this).data("draggable"), o = inst.options;
    var d = o.snapTolerance;

    var x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
      y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

    for (var i = inst.snapElements.length - 1; i >= 0; i--){

      var l = inst.snapElements[i].left, r = l + inst.snapElements[i].width,
        t = inst.snapElements[i].top, b = t + inst.snapElements[i].height;

      //Yes, I know, this is insane ;)
      if(!((l-d < x1 && x1 < r+d && t-d < y1 && y1 < b+d) || (l-d < x1 && x1 < r+d && t-d < y2 && y2 < b+d) || (l-d < x2 && x2 < r+d && t-d < y1 && y1 < b+d) || (l-d < x2 && x2 < r+d && t-d < y2 && y2 < b+d))) {
        if(inst.snapElements[i].snapping) (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
        inst.snapElements[i].snapping = false;
        continue;
      }

      if(o.snapMode != 'inner') {
        var ts = Math.abs(t - y2) <= d;
        var bs = Math.abs(b - y1) <= d;
        var ls = Math.abs(l - x2) <= d;
        var rs = Math.abs(r - x1) <= d;
        if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
        if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
        if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left - inst.margins.left;
        if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
      }

      var first = (ts || bs || ls || rs);

      if(o.snapMode != 'outer') {
        var ts = Math.abs(t - y1) <= d;
        var bs = Math.abs(b - y2) <= d;
        var ls = Math.abs(l - x1) <= d;
        var rs = Math.abs(r - x2) <= d;
        if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
        if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
        if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
        if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left - inst.margins.left;
      }

      if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first))
        (inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
      inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

    };

  }
});

$.ui.plugin.add("draggable", "stack", {
  start: function(event, ui) {

    var o = $(this).data("draggable").options;

    var group = $.makeArray($(o.stack)).sort(function(a,b) {
      return (parseInt($(a).css("zIndex"),10) || 0) - (parseInt($(b).css("zIndex"),10) || 0);
    });
    if (!group.length) { return; }
    
    var min = parseInt(group[0].style.zIndex) || 0;
    $(group).each(function(i) {
      this.style.zIndex = min + i;
    });

    this[0].style.zIndex = min + group.length;

  }
});

$.ui.plugin.add("draggable", "zIndex", {
  start: function(event, ui) {
    var t = $(ui.helper), o = $(this).data("draggable").options;
    if(t.css("zIndex")) o._zIndex = t.css("zIndex");
    t.css('zIndex', o.zIndex);
  },
  stop: function(event, ui) {
    var o = $(this).data("draggable").options;
    if(o._zIndex) $(ui.helper).css('zIndex', o._zIndex);
  }
});

})(jQuery);
/*
 * jQuery UI Droppable 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Droppables
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 *  jquery.ui.draggable.js
 */
(function( $, undefined ) {

$.widget("ui.droppable", {
  widgetEventPrefix: "drop",
  options: {
    accept: '*',
    activeClass: false,
    addClasses: true,
    greedy: false,
    hoverClass: false,
    scope: 'default',
    tolerance: 'intersect'
  },
  _create: function() {

    var o = this.options, accept = o.accept;
    this.isover = 0; this.isout = 1;

    this.accept = $.isFunction(accept) ? accept : function(d) {
      return d.is(accept);
    };

    //Store the droppable's proportions
    this.proportions = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight };

    // Add the reference and positions to the manager
    $.ui.ddmanager.droppables[o.scope] = $.ui.ddmanager.droppables[o.scope] || [];
    $.ui.ddmanager.droppables[o.scope].push(this);

    (o.addClasses && this.element.addClass("ui-droppable"));

  },

  destroy: function() {
    var drop = $.ui.ddmanager.droppables[this.options.scope];
    for ( var i = 0; i < drop.length; i++ )
      if ( drop[i] == this )
        drop.splice(i, 1);

    this.element
      .removeClass("ui-droppable ui-droppable-disabled")
      .removeData("droppable")
      .unbind(".droppable");

    return this;
  },

  _setOption: function(key, value) {

    if(key == 'accept') {
      this.accept = $.isFunction(value) ? value : function(d) {
        return d.is(value);
      };
    }
    $.Widget.prototype._setOption.apply(this, arguments);
  },

  _activate: function(event) {
    var draggable = $.ui.ddmanager.current;
    if(this.options.activeClass) this.element.addClass(this.options.activeClass);
    (draggable && this._trigger('activate', event, this.ui(draggable)));
  },

  _deactivate: function(event) {
    var draggable = $.ui.ddmanager.current;
    if(this.options.activeClass) this.element.removeClass(this.options.activeClass);
    (draggable && this._trigger('deactivate', event, this.ui(draggable)));
  },

  _over: function(event) {

    var draggable = $.ui.ddmanager.current;
    if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

    if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
      if(this.options.hoverClass) this.element.addClass(this.options.hoverClass);
      this._trigger('over', event, this.ui(draggable));
    }

  },

  _out: function(event) {

    var draggable = $.ui.ddmanager.current;
    if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

    if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
      if(this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
      this._trigger('out', event, this.ui(draggable));
    }

  },

  _drop: function(event,custom) {

    var draggable = custom || $.ui.ddmanager.current;
    if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return false; // Bail if draggable and droppable are same element

    var childrenIntersection = false;
    this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function() {
      var inst = $.data(this, 'droppable');
      if(
        inst.options.greedy
        && !inst.options.disabled
        && inst.options.scope == draggable.options.scope
        && inst.accept.call(inst.element[0], (draggable.currentItem || draggable.element))
        && $.ui.intersect(draggable, $.extend(inst, { offset: inst.element.offset() }), inst.options.tolerance)
      ) { childrenIntersection = true; return false; }
    });
    if(childrenIntersection) return false;

    if(this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
      if(this.options.activeClass) this.element.removeClass(this.options.activeClass);
      if(this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
      this._trigger('drop', event, this.ui(draggable));
      return this.element;
    }

    return false;

  },

  ui: function(c) {
    return {
      draggable: (c.currentItem || c.element),
      helper: c.helper,
      position: c.position,
      offset: c.positionAbs
    };
  }

});

$.extend($.ui.droppable, {
  version: "1.8.12"
});

$.ui.intersect = function(draggable, droppable, toleranceMode) {

  if (!droppable.offset) return false;

  var x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.helperProportions.width,
    y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.helperProportions.height;
  var l = droppable.offset.left, r = l + droppable.proportions.width,
    t = droppable.offset.top, b = t + droppable.proportions.height;

  switch (toleranceMode) {
    case 'fit':
      return (l <= x1 && x2 <= r
        && t <= y1 && y2 <= b);
      break;
    case 'intersect':
      return (l < x1 + (draggable.helperProportions.width / 2) // Right Half
        && x2 - (draggable.helperProportions.width / 2) < r // Left Half
        && t < y1 + (draggable.helperProportions.height / 2) // Bottom Half
        && y2 - (draggable.helperProportions.height / 2) < b ); // Top Half
      break;
    case 'pointer':
      var draggableLeft = ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left),
        draggableTop = ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top),
        isOver = $.ui.isOver(draggableTop, draggableLeft, t, l, droppable.proportions.height, droppable.proportions.width);
      return isOver;
      break;
    case 'touch':
      return (
          (y1 >= t && y1 <= b) || // Top edge touching
          (y2 >= t && y2 <= b) || // Bottom edge touching
          (y1 < t && y2 > b)    // Surrounded vertically
        ) && (
          (x1 >= l && x1 <= r) || // Left edge touching
          (x2 >= l && x2 <= r) || // Right edge touching
          (x1 < l && x2 > r)    // Surrounded horizontally
        );
      break;
    default:
      return false;
      break;
    }

};

/*
  This manager tracks offsets of draggables and droppables
*/
$.ui.ddmanager = {
  current: null,
  droppables: { 'default': [] },
  prepareOffsets: function(t, event) {

    var m = $.ui.ddmanager.droppables[t.options.scope] || [];
    var type = event ? event.type : null; // workaround for #2317
    var list = (t.currentItem || t.element).find(":data(droppable)").andSelf();

    droppablesLoop: for (var i = 0; i < m.length; i++) {

      if(m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0],(t.currentItem || t.element)))) continue; //No disabled and non-accepted
      for (var j=0; j < list.length; j++) { if(list[j] == m[i].element[0]) { m[i].proportions.height = 0; continue droppablesLoop; } }; //Filter out elements in the current dragged item
      m[i].visible = m[i].element.css("display") != "none"; if(!m[i].visible) continue;                   //If the element is not visible, continue

      if(type == "mousedown") m[i]._activate.call(m[i], event); //Activate the droppable if used directly from draggables

      m[i].offset = m[i].element.offset();
      m[i].proportions = { width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight };

    }

  },
  drop: function(draggable, event) {

    var dropped = false;
    $.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {

      if(!this.options) return;
      if (!this.options.disabled && this.visible && $.ui.intersect(draggable, this, this.options.tolerance))
        dropped = dropped || this._drop.call(this, event);

      if (!this.options.disabled && this.visible && this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
        this.isout = 1; this.isover = 0;
        this._deactivate.call(this, event);
      }

    });
    return dropped;

  },
  drag: function(draggable, event) {

    //If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
    if(draggable.options.refreshPositions) $.ui.ddmanager.prepareOffsets(draggable, event);

    //Run through all droppables and check their positions based on specific tolerance options
    $.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {

      if(this.options.disabled || this.greedyChild || !this.visible) return;
      var intersects = $.ui.intersect(draggable, this, this.options.tolerance);

      var c = !intersects && this.isover == 1 ? 'isout' : (intersects && this.isover == 0 ? 'isover' : null);
      if(!c) return;

      var parentInstance;
      if (this.options.greedy) {
        var parent = this.element.parents(':data(droppable):eq(0)');
        if (parent.length) {
          parentInstance = $.data(parent[0], 'droppable');
          parentInstance.greedyChild = (c == 'isover' ? 1 : 0);
        }
      }

      // we just moved into a greedy child
      if (parentInstance && c == 'isover') {
        parentInstance['isover'] = 0;
        parentInstance['isout'] = 1;
        parentInstance._out.call(parentInstance, event);
      }

      this[c] = 1; this[c == 'isout' ? 'isover' : 'isout'] = 0;
      this[c == "isover" ? "_over" : "_out"].call(this, event);

      // we just moved out of a greedy child
      if (parentInstance && c == 'isout') {
        parentInstance['isout'] = 0;
        parentInstance['isover'] = 1;
        parentInstance._over.call(parentInstance, event);
      }
    });

  }
};

})(jQuery);
/*
 * jQuery UI Resizable 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Resizables
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.mouse.js
 *  jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.resizable", $.ui.mouse, {
  widgetEventPrefix: "resize",
  options: {
    alsoResize: false,
    animate: false,
    animateDuration: "slow",
    animateEasing: "swing",
    aspectRatio: false,
    autoHide: false,
    containment: false,
    ghost: false,
    grid: false,
    handles: "e,s,se",
    helper: false,
    maxHeight: null,
    maxWidth: null,
    minHeight: 10,
    minWidth: 10,
    zIndex: 1000
  },
  _create: function() {

    var self = this, o = this.options;
    this.element.addClass("ui-resizable");

    $.extend(this, {
      _aspectRatio: !!(o.aspectRatio),
      aspectRatio: o.aspectRatio,
      originalElement: this.element,
      _proportionallyResizeElements: [],
      _helper: o.helper || o.ghost || o.animate ? o.helper || 'ui-resizable-helper' : null
    });

    //Wrap the element if it cannot hold child nodes
    if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {

      //Opera fix for relative positioning
      if (/relative/.test(this.element.css('position')) && $.browser.opera)
        this.element.css({ position: 'relative', top: 'auto', left: 'auto' });

      //Create a wrapper element and set the wrapper to the new current internal element
      this.element.wrap(
        $('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({
          position: this.element.css('position'),
          width: this.element.outerWidth(),
          height: this.element.outerHeight(),
          top: this.element.css('top'),
          left: this.element.css('left')
        })
      );

      //Overwrite the original this.element
      this.element = this.element.parent().data(
        "resizable", this.element.data('resizable')
      );

      this.elementIsWrapper = true;

      //Move margins to the wrapper
      this.element.css({ marginLeft: this.originalElement.css("marginLeft"), marginTop: this.originalElement.css("marginTop"), marginRight: this.originalElement.css("marginRight"), marginBottom: this.originalElement.css("marginBottom") });
      this.originalElement.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});

      //Prevent Safari textarea resize
      this.originalResizeStyle = this.originalElement.css('resize');
      this.originalElement.css('resize', 'none');

      //Push the actual element to our proportionallyResize internal array
      this._proportionallyResizeElements.push(this.originalElement.css({ position: 'static', zoom: 1, display: 'block' }));

      // avoid IE jump (hard set the margin)
      this.originalElement.css({ margin: this.originalElement.css('margin') });

      // fix handlers offset
      this._proportionallyResize();

    }

    this.handles = o.handles || (!$('.ui-resizable-handle', this.element).length ? "e,s,se" : { n: '.ui-resizable-n', e: '.ui-resizable-e', s: '.ui-resizable-s', w: '.ui-resizable-w', se: '.ui-resizable-se', sw: '.ui-resizable-sw', ne: '.ui-resizable-ne', nw: '.ui-resizable-nw' });
    if(this.handles.constructor == String) {

      if(this.handles == 'all') this.handles = 'n,e,s,w,se,sw,ne,nw';
      var n = this.handles.split(","); this.handles = {};

      for(var i = 0; i < n.length; i++) {

        var handle = $.trim(n[i]), hname = 'ui-resizable-'+handle;
        var axis = $('<div class="ui-resizable-handle ' + hname + '"></div>');

        // increase zIndex of sw, se, ne, nw axis
        //TODO : this modifies original option
        if(/sw|se|ne|nw/.test(handle)) axis.css({ zIndex: ++o.zIndex });

        //TODO : What's going on here?
        if ('se' == handle) {
          axis.addClass('ui-icon ui-icon-gripsmall-diagonal-se');
        };

        //Insert into internal handles object and append to element
        this.handles[handle] = '.ui-resizable-'+handle;
        this.element.append(axis);
      }

    }

    this._renderAxis = function(target) {

      target = target || this.element;

      for(var i in this.handles) {

        if(this.handles[i].constructor == String)
          this.handles[i] = $(this.handles[i], this.element).show();

        //Apply pad to wrapper element, needed to fix axis position (textarea, inputs, scrolls)
        if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {

          var axis = $(this.handles[i], this.element), padWrapper = 0;

          //Checking the correct pad and border
          padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

          //The padding type i have to apply...
          var padPos = [ 'padding',
            /ne|nw|n/.test(i) ? 'Top' :
            /se|sw|s/.test(i) ? 'Bottom' :
            /^e$/.test(i) ? 'Right' : 'Left' ].join("");

          target.css(padPos, padWrapper);

          this._proportionallyResize();

        }

        //TODO: What's that good for? There's not anything to be executed left
        if(!$(this.handles[i]).length)
          continue;

      }
    };

    //TODO: make renderAxis a prototype function
    this._renderAxis(this.element);

    this._handles = $('.ui-resizable-handle', this.element)
      .disableSelection();

    //Matching axis name
    this._handles.mouseover(function() {
      if (!self.resizing) {
        if (this.className)
          var axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
        //Axis, default = se
        self.axis = axis && axis[1] ? axis[1] : 'se';
      }
    });

    //If we want to auto hide the elements
    if (o.autoHide) {
      this._handles.hide();
      $(this.element)
        .addClass("ui-resizable-autohide")
        .hover(function() {
          $(this).removeClass("ui-resizable-autohide");
          self._handles.show();
        },
        function(){
          if (!self.resizing) {
            $(this).addClass("ui-resizable-autohide");
            self._handles.hide();
          }
        });
    }

    //Initialize the mouse interaction
    this._mouseInit();

  },

  destroy: function() {

    this._mouseDestroy();

    var _destroy = function(exp) {
      $(exp).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing")
        .removeData("resizable").unbind(".resizable").find('.ui-resizable-handle').remove();
    };

    //TODO: Unwrap at same DOM position
    if (this.elementIsWrapper) {
      _destroy(this.element);
      var wrapper = this.element;
      wrapper.after(
        this.originalElement.css({
          position: wrapper.css('position'),
          width: wrapper.outerWidth(),
          height: wrapper.outerHeight(),
          top: wrapper.css('top'),
          left: wrapper.css('left')
        })
      ).remove();
    }

    this.originalElement.css('resize', this.originalResizeStyle);
    _destroy(this.originalElement);

    return this;
  },

  _mouseCapture: function(event) {
    var handle = false;
    for (var i in this.handles) {
      if ($(this.handles[i])[0] == event.target) {
        handle = true;
      }
    }

    return !this.options.disabled && handle;
  },

  _mouseStart: function(event) {

    var o = this.options, iniPos = this.element.position(), el = this.element;

    this.resizing = true;
    this.documentScroll = { top: $(document).scrollTop(), left: $(document).scrollLeft() };

    // bugfix for http://dev.jquery.com/ticket/1749
    if (el.is('.ui-draggable') || (/absolute/).test(el.css('position'))) {
      el.css({ position: 'absolute', top: iniPos.top, left: iniPos.left });
    }

    //Opera fixing relative position
    if ($.browser.opera && (/relative/).test(el.css('position')))
      el.css({ position: 'relative', top: 'auto', left: 'auto' });

    this._renderProxy();

    var curleft = num(this.helper.css('left')), curtop = num(this.helper.css('top'));

    if (o.containment) {
      curleft += $(o.containment).scrollLeft() || 0;
      curtop += $(o.containment).scrollTop() || 0;
    }

    //Store needed variables
    this.offset = this.helper.offset();
    this.position = { left: curleft, top: curtop };
    this.size = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
    this.originalSize = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
    this.originalPosition = { left: curleft, top: curtop };
    this.sizeDiff = { width: el.outerWidth() - el.width(), height: el.outerHeight() - el.height() };
    this.originalMousePosition = { left: event.pageX, top: event.pageY };

    //Aspect Ratio
    this.aspectRatio = (typeof o.aspectRatio == 'number') ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height) || 1);

      var cursor = $('.ui-resizable-' + this.axis).css('cursor');
      $('body').css('cursor', cursor == 'auto' ? this.axis + '-resize' : cursor);

    el.addClass("ui-resizable-resizing");
    this._propagate("start", event);
    return true;
  },

  _mouseDrag: function(event) {

    //Increase performance, avoid regex
    var el = this.helper, o = this.options, props = {},
      self = this, smp = this.originalMousePosition, a = this.axis;

    var dx = (event.pageX-smp.left)||0, dy = (event.pageY-smp.top)||0;
    var trigger = this._change[a];
    if (!trigger) return false;

    // Calculate the attrs that will be change
    var data = trigger.apply(this, [event, dx, dy]), ie6 = $.browser.msie && $.browser.version < 7, csdif = this.sizeDiff;

    if (this._aspectRatio || event.shiftKey)
      data = this._updateRatio(data, event);

    data = this._respectSize(data, event);

    // plugins callbacks need to be called first
    this._propagate("resize", event);

    el.css({
      top: this.position.top + "px", left: this.position.left + "px",
      width: this.size.width + "px", height: this.size.height + "px"
    });

    if (!this._helper && this._proportionallyResizeElements.length)
      this._proportionallyResize();

    this._updateCache(data);

    // calling the user callback at the end
    this._trigger('resize', event, this.ui());

    return false;
  },

  _mouseStop: function(event) {

    this.resizing = false;
    var o = this.options, self = this;

    if(this._helper) {
      var pr = this._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName),
        soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : self.sizeDiff.height,
        soffsetw = ista ? 0 : self.sizeDiff.width;

      var s = { width: (self.helper.width()  - soffsetw), height: (self.helper.height() - soffseth) },
        left = (parseInt(self.element.css('left'), 10) + (self.position.left - self.originalPosition.left)) || null,
        top = (parseInt(self.element.css('top'), 10) + (self.position.top - self.originalPosition.top)) || null;

      if (!o.animate)
        this.element.css($.extend(s, { top: top, left: left }));

      self.helper.height(self.size.height);
      self.helper.width(self.size.width);

      if (this._helper && !o.animate) this._proportionallyResize();
    }

    $('body').css('cursor', 'auto');

    this.element.removeClass("ui-resizable-resizing");

    this._propagate("stop", event);

    if (this._helper) this.helper.remove();
    return false;

  },

  _updateCache: function(data) {
    var o = this.options;
    this.offset = this.helper.offset();
    if (isNumber(data.left)) this.position.left = data.left;
    if (isNumber(data.top)) this.position.top = data.top;
    if (isNumber(data.height)) this.size.height = data.height;
    if (isNumber(data.width)) this.size.width = data.width;
  },

  _updateRatio: function(data, event) {

    var o = this.options, cpos = this.position, csize = this.size, a = this.axis;

    if (data.height) data.width = (csize.height * this.aspectRatio);
    else if (data.width) data.height = (csize.width / this.aspectRatio);

    if (a == 'sw') {
      data.left = cpos.left + (csize.width - data.width);
      data.top = null;
    }
    if (a == 'nw') {
      data.top = cpos.top + (csize.height - data.height);
      data.left = cpos.left + (csize.width - data.width);
    }

    return data;
  },

  _respectSize: function(data, event) {

    var el = this.helper, o = this.options, pRatio = this._aspectRatio || event.shiftKey, a = this.axis,
        ismaxw = isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width), ismaxh = isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
          isminw = isNumber(data.width) && o.minWidth && (o.minWidth > data.width), isminh = isNumber(data.height) && o.minHeight && (o.minHeight > data.height);

    if (isminw) data.width = o.minWidth;
    if (isminh) data.height = o.minHeight;
    if (ismaxw) data.width = o.maxWidth;
    if (ismaxh) data.height = o.maxHeight;

    var dw = this.originalPosition.left + this.originalSize.width, dh = this.position.top + this.size.height;
    var cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);

    if (isminw && cw) data.left = dw - o.minWidth;
    if (ismaxw && cw) data.left = dw - o.maxWidth;
    if (isminh && ch) data.top = dh - o.minHeight;
    if (ismaxh && ch) data.top = dh - o.maxHeight;

    // fixing jump error on top/left - bug #2330
    var isNotwh = !data.width && !data.height;
    if (isNotwh && !data.left && data.top) data.top = null;
    else if (isNotwh && !data.top && data.left) data.left = null;

    return data;
  },

  _proportionallyResize: function() {

    var o = this.options;
    if (!this._proportionallyResizeElements.length) return;
    var element = this.helper || this.element;

    for (var i=0; i < this._proportionallyResizeElements.length; i++) {

      var prel = this._proportionallyResizeElements[i];

      if (!this.borderDif) {
        var b = [prel.css('borderTopWidth'), prel.css('borderRightWidth'), prel.css('borderBottomWidth'), prel.css('borderLeftWidth')],
          p = [prel.css('paddingTop'), prel.css('paddingRight'), prel.css('paddingBottom'), prel.css('paddingLeft')];

        this.borderDif = $.map(b, function(v, i) {
          var border = parseInt(v,10)||0, padding = parseInt(p[i],10)||0;
          return border + padding;
        });
      }

      if ($.browser.msie && !(!($(element).is(':hidden') || $(element).parents(':hidden').length)))
        continue;

      prel.css({
        height: (element.height() - this.borderDif[0] - this.borderDif[2]) || 0,
        width: (element.width() - this.borderDif[1] - this.borderDif[3]) || 0
      });

    };

  },

  _renderProxy: function() {

    var el = this.element, o = this.options;
    this.elementOffset = el.offset();

    if(this._helper) {

      this.helper = this.helper || $('<div style="overflow:hidden;"></div>');

      // fix ie6 offset TODO: This seems broken
      var ie6 = $.browser.msie && $.browser.version < 7, ie6offset = (ie6 ? 1 : 0),
      pxyoffset = ( ie6 ? 2 : -1 );

      this.helper.addClass(this._helper).css({
        width: this.element.outerWidth() + pxyoffset,
        height: this.element.outerHeight() + pxyoffset,
        position: 'absolute',
        left: this.elementOffset.left - ie6offset +'px',
        top: this.elementOffset.top - ie6offset +'px',
        zIndex: ++o.zIndex //TODO: Don't modify option
      });

      this.helper
        .appendTo("body")
        .disableSelection();

    } else {
      this.helper = this.element;
    }

  },

  _change: {
    e: function(event, dx, dy) {
      return { width: this.originalSize.width + dx };
    },
    w: function(event, dx, dy) {
      var o = this.options, cs = this.originalSize, sp = this.originalPosition;
      return { left: sp.left + dx, width: cs.width - dx };
    },
    n: function(event, dx, dy) {
      var o = this.options, cs = this.originalSize, sp = this.originalPosition;
      return { top: sp.top + dy, height: cs.height - dy };
    },
    s: function(event, dx, dy) {
      return { height: this.originalSize.height + dy };
    },
    se: function(event, dx, dy) {
      return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
    },
    sw: function(event, dx, dy) {
      return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
    },
    ne: function(event, dx, dy) {
      return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
    },
    nw: function(event, dx, dy) {
      return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
    }
  },

  _propagate: function(n, event) {
    $.ui.plugin.call(this, n, [event, this.ui()]);
    (n != "resize" && this._trigger(n, event, this.ui()));
  },

  plugins: {},

  ui: function() {
    return {
      originalElement: this.originalElement,
      element: this.element,
      helper: this.helper,
      position: this.position,
      size: this.size,
      originalSize: this.originalSize,
      originalPosition: this.originalPosition
    };
  }

});

$.extend($.ui.resizable, {
  version: "1.8.12"
});

/*
 * Resizable Extensions
 */

$.ui.plugin.add("resizable", "alsoResize", {

  start: function (event, ui) {
    var self = $(this).data("resizable"), o = self.options;

    var _store = function (exp) {
      $(exp).each(function() {
        var el = $(this);
        el.data("resizable-alsoresize", {
          width: parseInt(el.width(), 10), height: parseInt(el.height(), 10),
          left: parseInt(el.css('left'), 10), top: parseInt(el.css('top'), 10),
          position: el.css('position') // to reset Opera on stop()
        });
      });
    };

    if (typeof(o.alsoResize) == 'object' && !o.alsoResize.parentNode) {
      if (o.alsoResize.length) { o.alsoResize = o.alsoResize[0]; _store(o.alsoResize); }
      else { $.each(o.alsoResize, function (exp) { _store(exp); }); }
    }else{
      _store(o.alsoResize);
    }
  },

  resize: function (event, ui) {
    var self = $(this).data("resizable"), o = self.options, os = self.originalSize, op = self.originalPosition;

    var delta = {
      height: (self.size.height - os.height) || 0, width: (self.size.width - os.width) || 0,
      top: (self.position.top - op.top) || 0, left: (self.position.left - op.left) || 0
    },

    _alsoResize = function (exp, c) {
      $(exp).each(function() {
        var el = $(this), start = $(this).data("resizable-alsoresize"), style = {}, 
          css = c && c.length ? c : el.parents(ui.originalElement[0]).length ? ['width', 'height'] : ['width', 'height', 'top', 'left'];

        $.each(css, function (i, prop) {
          var sum = (start[prop]||0) + (delta[prop]||0);
          if (sum && sum >= 0)
            style[prop] = sum || null;
        });

        // Opera fixing relative position
        if ($.browser.opera && /relative/.test(el.css('position'))) {
          self._revertToRelativePosition = true;
          el.css({ position: 'absolute', top: 'auto', left: 'auto' });
        }

        el.css(style);
      });
    };

    if (typeof(o.alsoResize) == 'object' && !o.alsoResize.nodeType) {
      $.each(o.alsoResize, function (exp, c) { _alsoResize(exp, c); });
    }else{
      _alsoResize(o.alsoResize);
    }
  },

  stop: function (event, ui) {
    var self = $(this).data("resizable"), o = self.options;

    var _reset = function (exp) {
      $(exp).each(function() {
        var el = $(this);
        // reset position for Opera - no need to verify it was changed
        el.css({ position: el.data("resizable-alsoresize").position });
      });
    };

    if (self._revertToRelativePosition) {
      self._revertToRelativePosition = false;
      if (typeof(o.alsoResize) == 'object' && !o.alsoResize.nodeType) {
        $.each(o.alsoResize, function (exp) { _reset(exp); });
      }else{
        _reset(o.alsoResize);
      }
    }

    $(this).removeData("resizable-alsoresize");
  }
});

$.ui.plugin.add("resizable", "animate", {

  stop: function(event, ui) {
    var self = $(this).data("resizable"), o = self.options;

    var pr = self._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName),
          soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : self.sizeDiff.height,
            soffsetw = ista ? 0 : self.sizeDiff.width;

    var style = { width: (self.size.width - soffsetw), height: (self.size.height - soffseth) },
          left = (parseInt(self.element.css('left'), 10) + (self.position.left - self.originalPosition.left)) || null,
            top = (parseInt(self.element.css('top'), 10) + (self.position.top - self.originalPosition.top)) || null;

    self.element.animate(
      $.extend(style, top && left ? { top: top, left: left } : {}), {
        duration: o.animateDuration,
        easing: o.animateEasing,
        step: function() {

          var data = {
            width: parseInt(self.element.css('width'), 10),
            height: parseInt(self.element.css('height'), 10),
            top: parseInt(self.element.css('top'), 10),
            left: parseInt(self.element.css('left'), 10)
          };

          if (pr && pr.length) $(pr[0]).css({ width: data.width, height: data.height });

          // propagating resize, and updating values for each animation step
          self._updateCache(data);
          self._propagate("resize", event);

        }
      }
    );
  }

});

$.ui.plugin.add("resizable", "containment", {

  start: function(event, ui) {
    var self = $(this).data("resizable"), o = self.options, el = self.element;
    var oc = o.containment, ce = (oc instanceof $) ? oc.get(0) : (/parent/.test(oc)) ? el.parent().get(0) : oc;
    if (!ce) return;

    self.containerElement = $(ce);

    if (/document/.test(oc) || oc == document) {
      self.containerOffset = { left: 0, top: 0 };
      self.containerPosition = { left: 0, top: 0 };

      self.parentData = {
        element: $(document), left: 0, top: 0,
        width: $(document).width(), height: $(document).height() || document.body.parentNode.scrollHeight
      };
    }

    // i'm a node, so compute top, left, right, bottom
    else {
      var element = $(ce), p = [];
      $([ "Top", "Right", "Left", "Bottom" ]).each(function(i, name) { p[i] = num(element.css("padding" + name)); });

      self.containerOffset = element.offset();
      self.containerPosition = element.position();
      self.containerSize = { height: (element.innerHeight() - p[3]), width: (element.innerWidth() - p[1]) };

      var co = self.containerOffset, ch = self.containerSize.height,  cw = self.containerSize.width,
            width = ($.ui.hasScroll(ce, "left") ? ce.scrollWidth : cw ), height = ($.ui.hasScroll(ce) ? ce.scrollHeight : ch);

      self.parentData = {
        element: ce, left: co.left, top: co.top, width: width, height: height
      };
    }
  },

  resize: function(event, ui) {
    var self = $(this).data("resizable"), o = self.options,
        ps = self.containerSize, co = self.containerOffset, cs = self.size, cp = self.position,
        pRatio = self._aspectRatio || event.shiftKey, cop = { top:0, left:0 }, ce = self.containerElement;

    if (ce[0] != document && (/static/).test(ce.css('position'))) cop = co;

    if (cp.left < (self._helper ? co.left : 0)) {
      self.size.width = self.size.width + (self._helper ? (self.position.left - co.left) : (self.position.left - cop.left));
      if (pRatio) self.size.height = self.size.width / o.aspectRatio;
      self.position.left = o.helper ? co.left : 0;
    }

    if (cp.top < (self._helper ? co.top : 0)) {
      self.size.height = self.size.height + (self._helper ? (self.position.top - co.top) : self.position.top);
      if (pRatio) self.size.width = self.size.height * o.aspectRatio;
      self.position.top = self._helper ? co.top : 0;
    }

    self.offset.left = self.parentData.left+self.position.left;
    self.offset.top = self.parentData.top+self.position.top;

    var woset = Math.abs( (self._helper ? self.offset.left - cop.left : (self.offset.left - cop.left)) + self.sizeDiff.width ),
          hoset = Math.abs( (self._helper ? self.offset.top - cop.top : (self.offset.top - co.top)) + self.sizeDiff.height );

    var isParent = self.containerElement.get(0) == self.element.parent().get(0),
        isOffsetRelative = /relative|absolute/.test(self.containerElement.css('position'));

    if(isParent && isOffsetRelative) woset -= self.parentData.left;

    if (woset + self.size.width >= self.parentData.width) {
      self.size.width = self.parentData.width - woset;
      if (pRatio) self.size.height = self.size.width / self.aspectRatio;
    }

    if (hoset + self.size.height >= self.parentData.height) {
      self.size.height = self.parentData.height - hoset;
      if (pRatio) self.size.width = self.size.height * self.aspectRatio;
    }
  },

  stop: function(event, ui){
    var self = $(this).data("resizable"), o = self.options, cp = self.position,
        co = self.containerOffset, cop = self.containerPosition, ce = self.containerElement;

    var helper = $(self.helper), ho = helper.offset(), w = helper.outerWidth() - self.sizeDiff.width, h = helper.outerHeight() - self.sizeDiff.height;

    if (self._helper && !o.animate && (/relative/).test(ce.css('position')))
      $(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

    if (self._helper && !o.animate && (/static/).test(ce.css('position')))
      $(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

  }
});

$.ui.plugin.add("resizable", "ghost", {

  start: function(event, ui) {

    var self = $(this).data("resizable"), o = self.options, cs = self.size;

    self.ghost = self.originalElement.clone();
    self.ghost
      .css({ opacity: .25, display: 'block', position: 'relative', height: cs.height, width: cs.width, margin: 0, left: 0, top: 0 })
      .addClass('ui-resizable-ghost')
      .addClass(typeof o.ghost == 'string' ? o.ghost : '');

    self.ghost.appendTo(self.helper);

  },

  resize: function(event, ui){
    var self = $(this).data("resizable"), o = self.options;
    if (self.ghost) self.ghost.css({ position: 'relative', height: self.size.height, width: self.size.width });
  },

  stop: function(event, ui){
    var self = $(this).data("resizable"), o = self.options;
    if (self.ghost && self.helper) self.helper.get(0).removeChild(self.ghost.get(0));
  }

});

$.ui.plugin.add("resizable", "grid", {

  resize: function(event, ui) {
    var self = $(this).data("resizable"), o = self.options, cs = self.size, os = self.originalSize, op = self.originalPosition, a = self.axis, ratio = o._aspectRatio || event.shiftKey;
    o.grid = typeof o.grid == "number" ? [o.grid, o.grid] : o.grid;
    var ox = Math.round((cs.width - os.width) / (o.grid[0]||1)) * (o.grid[0]||1), oy = Math.round((cs.height - os.height) / (o.grid[1]||1)) * (o.grid[1]||1);

    if (/^(se|s|e)$/.test(a)) {
      self.size.width = os.width + ox;
      self.size.height = os.height + oy;
    }
    else if (/^(ne)$/.test(a)) {
      self.size.width = os.width + ox;
      self.size.height = os.height + oy;
      self.position.top = op.top - oy;
    }
    else if (/^(sw)$/.test(a)) {
      self.size.width = os.width + ox;
      self.size.height = os.height + oy;
      self.position.left = op.left - ox;
    }
    else {
      self.size.width = os.width + ox;
      self.size.height = os.height + oy;
      self.position.top = op.top - oy;
      self.position.left = op.left - ox;
    }
  }

});

var num = function(v) {
  return parseInt(v, 10) || 0;
};

var isNumber = function(value) {
  return !isNaN(parseInt(value, 10));
};

})(jQuery);
/*
 * jQuery UI Selectable 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Selectables
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.mouse.js
 *  jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.selectable", $.ui.mouse, {
  options: {
    appendTo: 'body',
    autoRefresh: true,
    distance: 0,
    filter: '*',
    tolerance: 'touch'
  },
  _create: function() {
    var self = this;

    this.element.addClass("ui-selectable");

    this.dragged = false;

    // cache selectee children based on filter
    var selectees;
    this.refresh = function() {
      selectees = $(self.options.filter, self.element[0]);
      selectees.each(function() {
        var $this = $(this);
        var pos = $this.offset();
        $.data(this, "selectable-item", {
          element: this,
          $element: $this,
          left: pos.left,
          top: pos.top,
          right: pos.left + $this.outerWidth(),
          bottom: pos.top + $this.outerHeight(),
          startselected: false,
          selected: $this.hasClass('ui-selected'),
          selecting: $this.hasClass('ui-selecting'),
          unselecting: $this.hasClass('ui-unselecting')
        });
      });
    };
    this.refresh();

    this.selectees = selectees.addClass("ui-selectee");

    this._mouseInit();

    this.helper = $("<div class='ui-selectable-helper'></div>");
  },

  destroy: function() {
    this.selectees
      .removeClass("ui-selectee")
      .removeData("selectable-item");
    this.element
      .removeClass("ui-selectable ui-selectable-disabled")
      .removeData("selectable")
      .unbind(".selectable");
    this._mouseDestroy();

    return this;
  },

  _mouseStart: function(event) {
    var self = this;

    this.opos = [event.pageX, event.pageY];

    if (this.options.disabled)
      return;

    var options = this.options;

    this.selectees = $(options.filter, this.element[0]);

    this._trigger("start", event);

    $(options.appendTo).append(this.helper);
    // position helper (lasso)
    this.helper.css({
      "left": event.clientX,
      "top": event.clientY,
      "width": 0,
      "height": 0
    });

    if (options.autoRefresh) {
      this.refresh();
    }

    this.selectees.filter('.ui-selected').each(function() {
      var selectee = $.data(this, "selectable-item");
      selectee.startselected = true;
      if (!event.metaKey) {
        selectee.$element.removeClass('ui-selected');
        selectee.selected = false;
        selectee.$element.addClass('ui-unselecting');
        selectee.unselecting = true;
        // selectable UNSELECTING callback
        self._trigger("unselecting", event, {
          unselecting: selectee.element
        });
      }
    });

    $(event.target).parents().andSelf().each(function() {
      var selectee = $.data(this, "selectable-item");
      if (selectee) {
        var doSelect = !event.metaKey || !selectee.$element.hasClass('ui-selected');
        selectee.$element
          .removeClass(doSelect ? "ui-unselecting" : "ui-selected")
          .addClass(doSelect ? "ui-selecting" : "ui-unselecting");
        selectee.unselecting = !doSelect;
        selectee.selecting = doSelect;
        selectee.selected = doSelect;
        // selectable (UN)SELECTING callback
        if (doSelect) {
          self._trigger("selecting", event, {
            selecting: selectee.element
          });
        } else {
          self._trigger("unselecting", event, {
            unselecting: selectee.element
          });
        }
        return false;
      }
    });

  },

  _mouseDrag: function(event) {
    var self = this;
    this.dragged = true;

    if (this.options.disabled)
      return;

    var options = this.options;

    var x1 = this.opos[0], y1 = this.opos[1], x2 = event.pageX, y2 = event.pageY;
    if (x1 > x2) { var tmp = x2; x2 = x1; x1 = tmp; }
    if (y1 > y2) { var tmp = y2; y2 = y1; y1 = tmp; }
    this.helper.css({left: x1, top: y1, width: x2-x1, height: y2-y1});

    this.selectees.each(function() {
      var selectee = $.data(this, "selectable-item");
      //prevent helper from being selected if appendTo: selectable
      if (!selectee || selectee.element == self.element[0])
        return;
      var hit = false;
      if (options.tolerance == 'touch') {
        hit = ( !(selectee.left > x2 || selectee.right < x1 || selectee.top > y2 || selectee.bottom < y1) );
      } else if (options.tolerance == 'fit') {
        hit = (selectee.left > x1 && selectee.right < x2 && selectee.top > y1 && selectee.bottom < y2);
      }

      if (hit) {
        // SELECT
        if (selectee.selected) {
          selectee.$element.removeClass('ui-selected');
          selectee.selected = false;
        }
        if (selectee.unselecting) {
          selectee.$element.removeClass('ui-unselecting');
          selectee.unselecting = false;
        }
        if (!selectee.selecting) {
          selectee.$element.addClass('ui-selecting');
          selectee.selecting = true;
          // selectable SELECTING callback
          self._trigger("selecting", event, {
            selecting: selectee.element
          });
        }
      } else {
        // UNSELECT
        if (selectee.selecting) {
          if (event.metaKey && selectee.startselected) {
            selectee.$element.removeClass('ui-selecting');
            selectee.selecting = false;
            selectee.$element.addClass('ui-selected');
            selectee.selected = true;
          } else {
            selectee.$element.removeClass('ui-selecting');
            selectee.selecting = false;
            if (selectee.startselected) {
              selectee.$element.addClass('ui-unselecting');
              selectee.unselecting = true;
            }
            // selectable UNSELECTING callback
            self._trigger("unselecting", event, {
              unselecting: selectee.element
            });
          }
        }
        if (selectee.selected) {
          if (!event.metaKey && !selectee.startselected) {
            selectee.$element.removeClass('ui-selected');
            selectee.selected = false;

            selectee.$element.addClass('ui-unselecting');
            selectee.unselecting = true;
            // selectable UNSELECTING callback
            self._trigger("unselecting", event, {
              unselecting: selectee.element
            });
          }
        }
      }
    });

    return false;
  },

  _mouseStop: function(event) {
    var self = this;

    this.dragged = false;

    var options = this.options;

    $('.ui-unselecting', this.element[0]).each(function() {
      var selectee = $.data(this, "selectable-item");
      selectee.$element.removeClass('ui-unselecting');
      selectee.unselecting = false;
      selectee.startselected = false;
      self._trigger("unselected", event, {
        unselected: selectee.element
      });
    });
    $('.ui-selecting', this.element[0]).each(function() {
      var selectee = $.data(this, "selectable-item");
      selectee.$element.removeClass('ui-selecting').addClass('ui-selected');
      selectee.selecting = false;
      selectee.selected = true;
      selectee.startselected = true;
      self._trigger("selected", event, {
        selected: selectee.element
      });
    });
    this._trigger("stop", event);

    this.helper.remove();

    return false;
  }

});

$.extend($.ui.selectable, {
  version: "1.8.12"
});

})(jQuery);
/*
 * jQuery UI Sortable 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Sortables
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.mouse.js
 *  jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.sortable", $.ui.mouse, {
  widgetEventPrefix: "sort",
  options: {
    appendTo: "parent",
    axis: false,
    connectWith: false,
    containment: false,
    cursor: 'auto',
    cursorAt: false,
    dropOnEmpty: true,
    forcePlaceholderSize: false,
    forceHelperSize: false,
    grid: false,
    handle: false,
    helper: "original",
    items: '> *',
    opacity: false,
    placeholder: false,
    revert: false,
    scroll: true,
    scrollSensitivity: 20,
    scrollSpeed: 20,
    scope: "default",
    tolerance: "intersect",
    zIndex: 1000
  },
  _create: function() {

    var o = this.options;
    this.containerCache = {};
    this.element.addClass("ui-sortable");

    //Get the items
    this.refresh();

    //Let's determine if the items are being displayed horizontally
    this.floating = this.items.length ? (/left|right/).test(this.items[0].item.css('float')) || (/inline|table-cell/).test(this.items[0].item.css('display')) : false;

    //Let's determine the parent's offset
    this.offset = this.element.offset();

    //Initialize mouse events for interaction
    this._mouseInit();

  },

  destroy: function() {
    this.element
      .removeClass("ui-sortable ui-sortable-disabled")
      .removeData("sortable")
      .unbind(".sortable");
    this._mouseDestroy();

    for ( var i = this.items.length - 1; i >= 0; i-- )
      this.items[i].item.removeData("sortable-item");

    return this;
  },

  _setOption: function(key, value){
    if ( key === "disabled" ) {
      this.options[ key ] = value;
  
      this.widget()
        [ value ? "addClass" : "removeClass"]( "ui-sortable-disabled" );
    } else {
      // Don't call widget base _setOption for disable as it adds ui-state-disabled class
      $.Widget.prototype._setOption.apply(this, arguments);
    }
  },

  _mouseCapture: function(event, overrideHandle) {

    if (this.reverting) {
      return false;
    }

    if(this.options.disabled || this.options.type == 'static') return false;

    //We have to refresh the items data once first
    this._refreshItems(event);

    //Find out if the clicked node (or one of its parents) is a actual item in this.items
    var currentItem = null, self = this, nodes = $(event.target).parents().each(function() {
      if($.data(this, 'sortable-item') == self) {
        currentItem = $(this);
        return false;
      }
    });
    if($.data(event.target, 'sortable-item') == self) currentItem = $(event.target);

    if(!currentItem) return false;
    if(this.options.handle && !overrideHandle) {
      var validHandle = false;

      $(this.options.handle, currentItem).find("*").andSelf().each(function() { if(this == event.target) validHandle = true; });
      if(!validHandle) return false;
    }

    this.currentItem = currentItem;
    this._removeCurrentsFromItems();
    return true;

  },

  _mouseStart: function(event, overrideHandle, noActivation) {

    var o = this.options, self = this;
    this.currentContainer = this;

    //We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
    this.refreshPositions();

    //Create and append the visible helper
    this.helper = this._createHelper(event);

    //Cache the helper size
    this._cacheHelperProportions();

    /*
     * - Position generation -
     * This block generates everything position related - it's the core of draggables.
     */

    //Cache the margins of the original element
    this._cacheMargins();

    //Get the next scrolling parent
    this.scrollParent = this.helper.scrollParent();

    //The element's absolute position on the page minus margins
    this.offset = this.currentItem.offset();
    this.offset = {
      top: this.offset.top - this.margins.top,
      left: this.offset.left - this.margins.left
    };

    // Only after we got the offset, we can change the helper's position to absolute
    // TODO: Still need to figure out a way to make relative sorting possible
    this.helper.css("position", "absolute");
    this.cssPosition = this.helper.css("position");

    $.extend(this.offset, {
      click: { //Where the click happened, relative to the element
        left: event.pageX - this.offset.left,
        top: event.pageY - this.offset.top
      },
      parent: this._getParentOffset(),
      relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
    });

    //Generate the original position
    this.originalPosition = this._generatePosition(event);
    this.originalPageX = event.pageX;
    this.originalPageY = event.pageY;

    //Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
    (o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

    //Cache the former DOM position
    this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };

    //If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
    if(this.helper[0] != this.currentItem[0]) {
      this.currentItem.hide();
    }

    //Create the placeholder
    this._createPlaceholder();

    //Set a containment if given in the options
    if(o.containment)
      this._setContainment();

    if(o.cursor) { // cursor option
      if ($('body').css("cursor")) this._storedCursor = $('body').css("cursor");
      $('body').css("cursor", o.cursor);
    }

    if(o.opacity) { // opacity option
      if (this.helper.css("opacity")) this._storedOpacity = this.helper.css("opacity");
      this.helper.css("opacity", o.opacity);
    }

    if(o.zIndex) { // zIndex option
      if (this.helper.css("zIndex")) this._storedZIndex = this.helper.css("zIndex");
      this.helper.css("zIndex", o.zIndex);
    }

    //Prepare scrolling
    if(this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML')
      this.overflowOffset = this.scrollParent.offset();

    //Call callbacks
    this._trigger("start", event, this._uiHash());

    //Recache the helper size
    if(!this._preserveHelperProportions)
      this._cacheHelperProportions();


    //Post 'activate' events to possible containers
    if(!noActivation) {
       for (var i = this.containers.length - 1; i >= 0; i--) { this.containers[i]._trigger("activate", event, self._uiHash(this)); }
    }

    //Prepare possible droppables
    if($.ui.ddmanager)
      $.ui.ddmanager.current = this;

    if ($.ui.ddmanager && !o.dropBehaviour)
      $.ui.ddmanager.prepareOffsets(this, event);

    this.dragging = true;

    this.helper.addClass("ui-sortable-helper");
    this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
    return true;

  },

  _mouseDrag: function(event) {

    //Compute the helpers position
    this.position = this._generatePosition(event);
    this.positionAbs = this._convertPositionTo("absolute");

    if (!this.lastPositionAbs) {
      this.lastPositionAbs = this.positionAbs;
    }

    //Do scrolling
    if(this.options.scroll) {
      var o = this.options, scrolled = false;
      if(this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML') {

        if((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
          this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
        else if(event.pageY - this.overflowOffset.top < o.scrollSensitivity)
          this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;

        if((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
          this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
        else if(event.pageX - this.overflowOffset.left < o.scrollSensitivity)
          this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;

      } else {

        if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
          scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
        else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
          scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);

        if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
          scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
        else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
          scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);

      }

      if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
        $.ui.ddmanager.prepareOffsets(this, event);
    }

    //Regenerate the absolute position used for position checks
    this.positionAbs = this._convertPositionTo("absolute");

    //Set the helper position
    if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
    if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';

    //Rearrange
    for (var i = this.items.length - 1; i >= 0; i--) {

      //Cache variables and intersection, continue if no intersection
      var item = this.items[i], itemElement = item.item[0], intersection = this._intersectsWithPointer(item);
      if (!intersection) continue;

      if(itemElement != this.currentItem[0] //cannot intersect with itself
        &&  this.placeholder[intersection == 1 ? "next" : "prev"]()[0] != itemElement //no useless actions that have been done before
        &&  !$.ui.contains(this.placeholder[0], itemElement) //no action if the item moved is the parent of the item checked
        && (this.options.type == 'semi-dynamic' ? !$.ui.contains(this.element[0], itemElement) : true)
        //&& itemElement.parentNode == this.placeholder[0].parentNode // only rearrange items within the same container
      ) {

        this.direction = intersection == 1 ? "down" : "up";

        if (this.options.tolerance == "pointer" || this._intersectsWithSides(item)) {
          this._rearrange(event, item);
        } else {
          break;
        }

        this._trigger("change", event, this._uiHash());
        break;
      }
    }

    //Post events to containers
    this._contactContainers(event);

    //Interconnect with droppables
    if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

    //Call callbacks
    this._trigger('sort', event, this._uiHash());

    this.lastPositionAbs = this.positionAbs;
    return false;

  },

  _mouseStop: function(event, noPropagation) {

    if(!event) return;

    //If we are using droppables, inform the manager about the drop
    if ($.ui.ddmanager && !this.options.dropBehaviour)
      $.ui.ddmanager.drop(this, event);

    if(this.options.revert) {
      var self = this;
      var cur = self.placeholder.offset();

      self.reverting = true;

      $(this.helper).animate({
        left: cur.left - this.offset.parent.left - self.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
        top: cur.top - this.offset.parent.top - self.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
      }, parseInt(this.options.revert, 10) || 500, function() {
        self._clear(event);
      });
    } else {
      this._clear(event, noPropagation);
    }

    return false;

  },

  cancel: function() {

    var self = this;

    if(this.dragging) {

      this._mouseUp({ target: null });

      if(this.options.helper == "original")
        this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
      else
        this.currentItem.show();

      //Post deactivating events to containers
      for (var i = this.containers.length - 1; i >= 0; i--){
        this.containers[i]._trigger("deactivate", null, self._uiHash(this));
        if(this.containers[i].containerCache.over) {
          this.containers[i]._trigger("out", null, self._uiHash(this));
          this.containers[i].containerCache.over = 0;
        }
      }

    }

    if (this.placeholder) {
      //$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
      if(this.placeholder[0].parentNode) this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
      if(this.options.helper != "original" && this.helper && this.helper[0].parentNode) this.helper.remove();

      $.extend(this, {
        helper: null,
        dragging: false,
        reverting: false,
        _noFinalSort: null
      });

      if(this.domPosition.prev) {
        $(this.domPosition.prev).after(this.currentItem);
      } else {
        $(this.domPosition.parent).prepend(this.currentItem);
      }
    }

    return this;

  },

  serialize: function(o) {

    var items = this._getItemsAsjQuery(o && o.connected);
    var str = []; o = o || {};

    $(items).each(function() {
      var res = ($(o.item || this).attr(o.attribute || 'id') || '').match(o.expression || (/(.+)[-=_](.+)/));
      if(res) str.push((o.key || res[1]+'[]')+'='+(o.key && o.expression ? res[1] : res[2]));
    });

    if(!str.length && o.key) {
      str.push(o.key + '=');
    }

    return str.join('&');

  },

  toArray: function(o) {

    var items = this._getItemsAsjQuery(o && o.connected);
    var ret = []; o = o || {};

    items.each(function() { ret.push($(o.item || this).attr(o.attribute || 'id') || ''); });
    return ret;

  },

  /* Be careful with the following core functions */
  _intersectsWith: function(item) {

    var x1 = this.positionAbs.left,
      x2 = x1 + this.helperProportions.width,
      y1 = this.positionAbs.top,
      y2 = y1 + this.helperProportions.height;

    var l = item.left,
      r = l + item.width,
      t = item.top,
      b = t + item.height;

    var dyClick = this.offset.click.top,
      dxClick = this.offset.click.left;

    var isOverElement = (y1 + dyClick) > t && (y1 + dyClick) < b && (x1 + dxClick) > l && (x1 + dxClick) < r;

    if(    this.options.tolerance == "pointer"
      || this.options.forcePointerForContainers
      || (this.options.tolerance != "pointer" && this.helperProportions[this.floating ? 'width' : 'height'] > item[this.floating ? 'width' : 'height'])
    ) {
      return isOverElement;
    } else {

      return (l < x1 + (this.helperProportions.width / 2) // Right Half
        && x2 - (this.helperProportions.width / 2) < r // Left Half
        && t < y1 + (this.helperProportions.height / 2) // Bottom Half
        && y2 - (this.helperProportions.height / 2) < b ); // Top Half

    }
  },

  _intersectsWithPointer: function(item) {

    var isOverElementHeight = $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
      isOverElementWidth = $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
      isOverElement = isOverElementHeight && isOverElementWidth,
      verticalDirection = this._getDragVerticalDirection(),
      horizontalDirection = this._getDragHorizontalDirection();

    if (!isOverElement)
      return false;

    return this.floating ?
      ( ((horizontalDirection && horizontalDirection == "right") || verticalDirection == "down") ? 2 : 1 )
      : ( verticalDirection && (verticalDirection == "down" ? 2 : 1) );

  },

  _intersectsWithSides: function(item) {

    var isOverBottomHalf = $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height/2), item.height),
      isOverRightHalf = $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width/2), item.width),
      verticalDirection = this._getDragVerticalDirection(),
      horizontalDirection = this._getDragHorizontalDirection();

    if (this.floating && horizontalDirection) {
      return ((horizontalDirection == "right" && isOverRightHalf) || (horizontalDirection == "left" && !isOverRightHalf));
    } else {
      return verticalDirection && ((verticalDirection == "down" && isOverBottomHalf) || (verticalDirection == "up" && !isOverBottomHalf));
    }

  },

  _getDragVerticalDirection: function() {
    var delta = this.positionAbs.top - this.lastPositionAbs.top;
    return delta != 0 && (delta > 0 ? "down" : "up");
  },

  _getDragHorizontalDirection: function() {
    var delta = this.positionAbs.left - this.lastPositionAbs.left;
    return delta != 0 && (delta > 0 ? "right" : "left");
  },

  refresh: function(event) {
    this._refreshItems(event);
    this.refreshPositions();
    return this;
  },

  _connectWith: function() {
    var options = this.options;
    return options.connectWith.constructor == String
      ? [options.connectWith]
      : options.connectWith;
  },
  
  _getItemsAsjQuery: function(connected) {

    var self = this;
    var items = [];
    var queries = [];
    var connectWith = this._connectWith();

    if(connectWith && connected) {
      for (var i = connectWith.length - 1; i >= 0; i--){
        var cur = $(connectWith[i]);
        for (var j = cur.length - 1; j >= 0; j--){
          var inst = $.data(cur[j], 'sortable');
          if(inst && inst != this && !inst.options.disabled) {
            queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not('.ui-sortable-placeholder'), inst]);
          }
        };
      };
    }

    queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not(".ui-sortable-helper").not('.ui-sortable-placeholder'), this]);

    for (var i = queries.length - 1; i >= 0; i--){
      queries[i][0].each(function() {
        items.push(this);
      });
    };

    return $(items);

  },

  _removeCurrentsFromItems: function() {

    var list = this.currentItem.find(":data(sortable-item)");

    for (var i=0; i < this.items.length; i++) {

      for (var j=0; j < list.length; j++) {
        if(list[j] == this.items[i].item[0])
          this.items.splice(i,1);
      };

    };

  },

  _refreshItems: function(event) {

    this.items = [];
    this.containers = [this];
    var items = this.items;
    var self = this;
    var queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]];
    var connectWith = this._connectWith();

    if(connectWith) {
      for (var i = connectWith.length - 1; i >= 0; i--){
        var cur = $(connectWith[i]);
        for (var j = cur.length - 1; j >= 0; j--){
          var inst = $.data(cur[j], 'sortable');
          if(inst && inst != this && !inst.options.disabled) {
            queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
            this.containers.push(inst);
          }
        };
      };
    }

    for (var i = queries.length - 1; i >= 0; i--) {
      var targetData = queries[i][1];
      var _queries = queries[i][0];

      for (var j=0, queriesLength = _queries.length; j < queriesLength; j++) {
        var item = $(_queries[j]);

        item.data('sortable-item', targetData); // Data for target checking (mouse manager)

        items.push({
          item: item,
          instance: targetData,
          width: 0, height: 0,
          left: 0, top: 0
        });
      };
    };

  },

  refreshPositions: function(fast) {

    //This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
    if(this.offsetParent && this.helper) {
      this.offset.parent = this._getParentOffset();
    }

    for (var i = this.items.length - 1; i >= 0; i--){
      var item = this.items[i];

      //We ignore calculating positions of all connected containers when we're not over them
      if(item.instance != this.currentContainer && this.currentContainer && item.item[0] != this.currentItem[0])
        continue;

      var t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

      if (!fast) {
        item.width = t.outerWidth();
        item.height = t.outerHeight();
      }

      var p = t.offset();
      item.left = p.left;
      item.top = p.top;
    };

    if(this.options.custom && this.options.custom.refreshContainers) {
      this.options.custom.refreshContainers.call(this);
    } else {
      for (var i = this.containers.length - 1; i >= 0; i--){
        var p = this.containers[i].element.offset();
        this.containers[i].containerCache.left = p.left;
        this.containers[i].containerCache.top = p.top;
        this.containers[i].containerCache.width = this.containers[i].element.outerWidth();
        this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
      };
    }

    return this;
  },

  _createPlaceholder: function(that) {

    var self = that || this, o = self.options;

    if(!o.placeholder || o.placeholder.constructor == String) {
      var className = o.placeholder;
      o.placeholder = {
        element: function() {

          var el = $(document.createElement(self.currentItem[0].nodeName))
            .addClass(className || self.currentItem[0].className+" ui-sortable-placeholder")
            .removeClass("ui-sortable-helper")[0];

          if(!className)
            el.style.visibility = "hidden";

          return el;
        },
        update: function(container, p) {

          // 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
          // 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
          if(className && !o.forcePlaceholderSize) return;

          //If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
          if(!p.height()) { p.height(self.currentItem.innerHeight() - parseInt(self.currentItem.css('paddingTop')||0, 10) - parseInt(self.currentItem.css('paddingBottom')||0, 10)); };
          if(!p.width()) { p.width(self.currentItem.innerWidth() - parseInt(self.currentItem.css('paddingLeft')||0, 10) - parseInt(self.currentItem.css('paddingRight')||0, 10)); };
        }
      };
    }

    //Create the placeholder
    self.placeholder = $(o.placeholder.element.call(self.element, self.currentItem));

    //Append it after the actual current item
    self.currentItem.after(self.placeholder);

    //Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
    o.placeholder.update(self, self.placeholder);

  },

  _contactContainers: function(event) {
    
    // get innermost container that intersects with item 
    var innermostContainer = null, innermostIndex = null;   
    
    
    for (var i = this.containers.length - 1; i >= 0; i--){

      // never consider a container that's located within the item itself 
      if($.ui.contains(this.currentItem[0], this.containers[i].element[0]))
        continue;

      if(this._intersectsWith(this.containers[i].containerCache)) {

        // if we've already found a container and it's more "inner" than this, then continue 
        if(innermostContainer && $.ui.contains(this.containers[i].element[0], innermostContainer.element[0]))
          continue;

        innermostContainer = this.containers[i]; 
        innermostIndex = i;
          
      } else {
        // container doesn't intersect. trigger "out" event if necessary 
        if(this.containers[i].containerCache.over) {
          this.containers[i]._trigger("out", event, this._uiHash(this));
          this.containers[i].containerCache.over = 0;
        }
      }

    }
    
    // if no intersecting containers found, return 
    if(!innermostContainer) return; 

    // move the item into the container if it's not there already
    if(this.containers.length === 1) {
      this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
      this.containers[innermostIndex].containerCache.over = 1;
    } else if(this.currentContainer != this.containers[innermostIndex]) { 

      //When entering a new container, we will find the item with the least distance and append our item near it 
      var dist = 10000; var itemWithLeastDistance = null; var base = this.positionAbs[this.containers[innermostIndex].floating ? 'left' : 'top']; 
      for (var j = this.items.length - 1; j >= 0; j--) { 
        if(!$.ui.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) continue; 
        var cur = this.items[j][this.containers[innermostIndex].floating ? 'left' : 'top']; 
        if(Math.abs(cur - base) < dist) { 
          dist = Math.abs(cur - base); itemWithLeastDistance = this.items[j]; 
        } 
      } 

      if(!itemWithLeastDistance && !this.options.dropOnEmpty) //Check if dropOnEmpty is enabled 
        return; 

      this.currentContainer = this.containers[innermostIndex]; 
      itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true); 
      this._trigger("change", event, this._uiHash()); 
      this.containers[innermostIndex]._trigger("change", event, this._uiHash(this)); 

      //Update the placeholder 
      this.options.placeholder.update(this.currentContainer, this.placeholder); 
    
      this.containers[innermostIndex]._trigger("over", event, this._uiHash(this)); 
      this.containers[innermostIndex].containerCache.over = 1;
    } 
  
    
  },

  _createHelper: function(event) {

    var o = this.options;
    var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper == 'clone' ? this.currentItem.clone() : this.currentItem);

    if(!helper.parents('body').length) //Add the helper to the DOM if that didn't happen already
      $(o.appendTo != 'parent' ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);

    if(helper[0] == this.currentItem[0])
      this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };

    if(helper[0].style.width == '' || o.forceHelperSize) helper.width(this.currentItem.width());
    if(helper[0].style.height == '' || o.forceHelperSize) helper.height(this.currentItem.height());

    return helper;

  },

  _adjustOffsetFromHelper: function(obj) {
    if (typeof obj == 'string') {
      obj = obj.split(' ');
    }
    if ($.isArray(obj)) {
      obj = {left: +obj[0], top: +obj[1] || 0};
    }
    if ('left' in obj) {
      this.offset.click.left = obj.left + this.margins.left;
    }
    if ('right' in obj) {
      this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
    }
    if ('top' in obj) {
      this.offset.click.top = obj.top + this.margins.top;
    }
    if ('bottom' in obj) {
      this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
    }
  },

  _getParentOffset: function() {


    //Get the offsetParent and cache its position
    this.offsetParent = this.helper.offsetParent();
    var po = this.offsetParent.offset();

    // This is a special case where we need to modify a offset calculated on start, since the following happened:
    // 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
    // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
    //    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
    if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
      po.left += this.scrollParent.scrollLeft();
      po.top += this.scrollParent.scrollTop();
    }

    if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
    || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) //Ugly IE fix
      po = { top: 0, left: 0 };

    return {
      top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
      left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
    };

  },

  _getRelativeOffset: function() {

    if(this.cssPosition == "relative") {
      var p = this.currentItem.position();
      return {
        top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
        left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
      };
    } else {
      return { top: 0, left: 0 };
    }

  },

  _cacheMargins: function() {
    this.margins = {
      left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
      top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
    };
  },

  _cacheHelperProportions: function() {
    this.helperProportions = {
      width: this.helper.outerWidth(),
      height: this.helper.outerHeight()
    };
  },

  _setContainment: function() {

    var o = this.options;
    if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
    if(o.containment == 'document' || o.containment == 'window') this.containment = [
      0 - this.offset.relative.left - this.offset.parent.left,
      0 - this.offset.relative.top - this.offset.parent.top,
      $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
      ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
    ];

    if(!(/^(document|window|parent)$/).test(o.containment)) {
      var ce = $(o.containment)[0];
      var co = $(o.containment).offset();
      var over = ($(ce).css("overflow") != 'hidden');

      this.containment = [
        co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
        co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
        co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
        co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
      ];
    }

  },

  _convertPositionTo: function(d, pos) {

    if(!pos) pos = this.position;
    var mod = d == "absolute" ? 1 : -1;
    var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

    return {
      top: (
        pos.top                                 // The absolute mouse position
        + this.offset.relative.top * mod                    // Only for relative positioned nodes: Relative offset from element to offset parent
        + this.offset.parent.top * mod                      // The offsetParent's offset without borders (offset + border)
        - ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
      ),
      left: (
        pos.left                                // The absolute mouse position
        + this.offset.relative.left * mod                   // Only for relative positioned nodes: Relative offset from element to offset parent
        + this.offset.parent.left * mod                     // The offsetParent's offset without borders (offset + border)
        - ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
      )
    };

  },

  _generatePosition: function(event) {

    var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

    // This is another very weird special case that only happens for relative elements:
    // 1. If the css position is relative
    // 2. and the scroll parent is the document or similar to the offset parent
    // we have to refresh the relative offset during the scroll so there are no jumps
    if(this.cssPosition == 'relative' && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
      this.offset.relative = this._getRelativeOffset();
    }

    var pageX = event.pageX;
    var pageY = event.pageY;

    /*
     * - Position constraining -
     * Constrain the position to a mix of grid, containment.
     */

    if(this.originalPosition) { //If we are not dragging yet, we won't check for options

      if(this.containment) {
        if(event.pageX - this.offset.click.left < this.containment[0]) pageX = this.containment[0] + this.offset.click.left;
        if(event.pageY - this.offset.click.top < this.containment[1]) pageY = this.containment[1] + this.offset.click.top;
        if(event.pageX - this.offset.click.left > this.containment[2]) pageX = this.containment[2] + this.offset.click.left;
        if(event.pageY - this.offset.click.top > this.containment[3]) pageY = this.containment[3] + this.offset.click.top;
      }

      if(o.grid) {
        var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
        pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

        var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
        pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
      }

    }

    return {
      top: (
        pageY                               // The absolute mouse position
        - this.offset.click.top                         // Click offset (relative to the element)
        - this.offset.relative.top                        // Only for relative positioned nodes: Relative offset from element to offset parent
        - this.offset.parent.top                        // The offsetParent's offset without borders (offset + border)
        + ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
      ),
      left: (
        pageX                               // The absolute mouse position
        - this.offset.click.left                        // Click offset (relative to the element)
        - this.offset.relative.left                       // Only for relative positioned nodes: Relative offset from element to offset parent
        - this.offset.parent.left                       // The offsetParent's offset without borders (offset + border)
        + ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
      )
    };

  },

  _rearrange: function(event, i, a, hardRefresh) {

    a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction == 'down' ? i.item[0] : i.item[0].nextSibling));

    //Various things done here to improve the performance:
    // 1. we create a setTimeout, that calls refreshPositions
    // 2. on the instance, we have a counter variable, that get's higher after every append
    // 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
    // 4. this lets only the last addition to the timeout stack through
    this.counter = this.counter ? ++this.counter : 1;
    var self = this, counter = this.counter;

    window.setTimeout(function() {
      if(counter == self.counter) self.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
    },0);

  },

  _clear: function(event, noPropagation) {

    this.reverting = false;
    // We delay all events that have to be triggered to after the point where the placeholder has been removed and
    // everything else normalized again
    var delayedTriggers = [], self = this;

    // We first have to update the dom position of the actual currentItem
    // Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
    if(!this._noFinalSort && this.currentItem[0].parentNode) this.placeholder.before(this.currentItem);
    this._noFinalSort = null;

    if(this.helper[0] == this.currentItem[0]) {
      for(var i in this._storedCSS) {
        if(this._storedCSS[i] == 'auto' || this._storedCSS[i] == 'static') this._storedCSS[i] = '';
      }
      this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
    } else {
      this.currentItem.show();
    }

    if(this.fromOutside && !noPropagation) delayedTriggers.push(function(event) { this._trigger("receive", event, this._uiHash(this.fromOutside)); });
    if((this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !noPropagation) delayedTriggers.push(function(event) { this._trigger("update", event, this._uiHash()); }); //Trigger update callback if the DOM position has changed
    if(!$.ui.contains(this.element[0], this.currentItem[0])) { //Node was moved out of the current element
      if(!noPropagation) delayedTriggers.push(function(event) { this._trigger("remove", event, this._uiHash()); });
      for (var i = this.containers.length - 1; i >= 0; i--){
        if($.ui.contains(this.containers[i].element[0], this.currentItem[0]) && !noPropagation) {
          delayedTriggers.push((function(c) { return function(event) { c._trigger("receive", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
          delayedTriggers.push((function(c) { return function(event) { c._trigger("update", event, this._uiHash(this));  }; }).call(this, this.containers[i]));
        }
      };
    };

    //Post events to containers
    for (var i = this.containers.length - 1; i >= 0; i--){
      if(!noPropagation) delayedTriggers.push((function(c) { return function(event) { c._trigger("deactivate", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
      if(this.containers[i].containerCache.over) {
        delayedTriggers.push((function(c) { return function(event) { c._trigger("out", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
        this.containers[i].containerCache.over = 0;
      }
    }

    //Do what was originally in plugins
    if(this._storedCursor) $('body').css("cursor", this._storedCursor); //Reset cursor
    if(this._storedOpacity) this.helper.css("opacity", this._storedOpacity); //Reset opacity
    if(this._storedZIndex) this.helper.css("zIndex", this._storedZIndex == 'auto' ? '' : this._storedZIndex); //Reset z-index

    this.dragging = false;
    if(this.cancelHelperRemoval) {
      if(!noPropagation) {
        this._trigger("beforeStop", event, this._uiHash());
        for (var i=0; i < delayedTriggers.length; i++) { delayedTriggers[i].call(this, event); }; //Trigger all delayed events
        this._trigger("stop", event, this._uiHash());
      }
      return false;
    }

    if(!noPropagation) this._trigger("beforeStop", event, this._uiHash());

    //$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
    this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

    if(this.helper[0] != this.currentItem[0]) this.helper.remove(); this.helper = null;

    if(!noPropagation) {
      for (var i=0; i < delayedTriggers.length; i++) { delayedTriggers[i].call(this, event); }; //Trigger all delayed events
      this._trigger("stop", event, this._uiHash());
    }

    this.fromOutside = false;
    return true;

  },

  _trigger: function() {
    if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
      this.cancel();
    }
  },

  _uiHash: function(inst) {
    var self = inst || this;
    return {
      helper: self.helper,
      placeholder: self.placeholder || $([]),
      position: self.position,
      originalPosition: self.originalPosition,
      offset: self.positionAbs,
      item: self.currentItem,
      sender: inst ? inst.element : null
    };
  }

});

$.extend($.ui.sortable, {
  version: "1.8.12"
});

})(jQuery);
/*
 * jQuery UI Effects 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/
 */
;jQuery.effects || (function($, undefined) {

$.effects = {};



/******************************************************************************/
/****************************** COLOR ANIMATIONS ******************************/
/******************************************************************************/

// override the animation for color styles
$.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor',
  'borderRightColor', 'borderTopColor', 'borderColor', 'color', 'outlineColor'],
function(i, attr) {
  $.fx.step[attr] = function(fx) {
    if (!fx.colorInit) {
      fx.start = getColor(fx.elem, attr);
      fx.end = getRGB(fx.end);
      fx.colorInit = true;
    }

    fx.elem.style[attr] = 'rgb(' +
      Math.max(Math.min(parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0], 10), 255), 0) + ',' +
      Math.max(Math.min(parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1], 10), 255), 0) + ',' +
      Math.max(Math.min(parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2], 10), 255), 0) + ')';
  };
});

// Color Conversion functions from highlightFade
// By Blair Mitchelmore
// http://jquery.offput.ca/highlightFade/

// Parse strings looking for color tuples [255,255,255]
function getRGB(color) {
    var result;

    // Check if we're already dealing with an array of colors
    if ( color && color.constructor == Array && color.length == 3 )
        return color;

    // Look for rgb(num,num,num)
    if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
        return [parseInt(result[1],10), parseInt(result[2],10), parseInt(result[3],10)];

    // Look for rgb(num%,num%,num%)
    if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
        return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

    // Look for #a0b1c2
    if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
        return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

    // Look for #fff
    if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
        return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

    // Look for rgba(0, 0, 0, 0) == transparent in Safari 3
    if (result = /rgba\(0, 0, 0, 0\)/.exec(color))
        return colors['transparent'];

    // Otherwise, we're most likely dealing with a named color
    return colors[$.trim(color).toLowerCase()];
}

function getColor(elem, attr) {
    var color;

    do {
        color = $.curCSS(elem, attr);

        // Keep going until we find an element that has color, or we hit the body
        if ( color != '' && color != 'transparent' || $.nodeName(elem, "body") )
            break;

        attr = "backgroundColor";
    } while ( elem = elem.parentNode );

    return getRGB(color);
};

// Some named colors to work with
// From Interface by Stefan Petre
// http://interface.eyecon.ro/

var colors = {
  aqua:[0,255,255],
  azure:[240,255,255],
  beige:[245,245,220],
  black:[0,0,0],
  blue:[0,0,255],
  brown:[165,42,42],
  cyan:[0,255,255],
  darkblue:[0,0,139],
  darkcyan:[0,139,139],
  darkgrey:[169,169,169],
  darkgreen:[0,100,0],
  darkkhaki:[189,183,107],
  darkmagenta:[139,0,139],
  darkolivegreen:[85,107,47],
  darkorange:[255,140,0],
  darkorchid:[153,50,204],
  darkred:[139,0,0],
  darksalmon:[233,150,122],
  darkviolet:[148,0,211],
  fuchsia:[255,0,255],
  gold:[255,215,0],
  green:[0,128,0],
  indigo:[75,0,130],
  khaki:[240,230,140],
  lightblue:[173,216,230],
  lightcyan:[224,255,255],
  lightgreen:[144,238,144],
  lightgrey:[211,211,211],
  lightpink:[255,182,193],
  lightyellow:[255,255,224],
  lime:[0,255,0],
  magenta:[255,0,255],
  maroon:[128,0,0],
  navy:[0,0,128],
  olive:[128,128,0],
  orange:[255,165,0],
  pink:[255,192,203],
  purple:[128,0,128],
  violet:[128,0,128],
  red:[255,0,0],
  silver:[192,192,192],
  white:[255,255,255],
  yellow:[255,255,0],
  transparent: [255,255,255]
};



/******************************************************************************/
/****************************** CLASS ANIMATIONS ******************************/
/******************************************************************************/

var classAnimationActions = ['add', 'remove', 'toggle'],
  shorthandStyles = {
    border: 1,
    borderBottom: 1,
    borderColor: 1,
    borderLeft: 1,
    borderRight: 1,
    borderTop: 1,
    borderWidth: 1,
    margin: 1,
    padding: 1
  };

function getElementStyles() {
  var style = document.defaultView
      ? document.defaultView.getComputedStyle(this, null)
      : this.currentStyle,
    newStyle = {},
    key,
    camelCase;

  // webkit enumerates style porperties
  if (style && style.length && style[0] && style[style[0]]) {
    var len = style.length;
    while (len--) {
      key = style[len];
      if (typeof style[key] == 'string') {
        camelCase = key.replace(/\-(\w)/g, function(all, letter){
          return letter.toUpperCase();
        });
        newStyle[camelCase] = style[key];
      }
    }
  } else {
    for (key in style) {
      if (typeof style[key] === 'string') {
        newStyle[key] = style[key];
      }
    }
  }
  
  return newStyle;
}

function filterStyles(styles) {
  var name, value;
  for (name in styles) {
    value = styles[name];
    if (
      // ignore null and undefined values
      value == null ||
      // ignore functions (when does this occur?)
      $.isFunction(value) ||
      // shorthand styles that need to be expanded
      name in shorthandStyles ||
      // ignore scrollbars (break in IE)
      (/scrollbar/).test(name) ||

      // only colors or values that can be converted to numbers
      (!(/color/i).test(name) && isNaN(parseFloat(value)))
    ) {
      delete styles[name];
    }
  }
  
  return styles;
}

function styleDifference(oldStyle, newStyle) {
  var diff = { _: 0 }, // http://dev.jquery.com/ticket/5459
    name;

  for (name in newStyle) {
    if (oldStyle[name] != newStyle[name]) {
      diff[name] = newStyle[name];
    }
  }

  return diff;
}

$.effects.animateClass = function(value, duration, easing, callback) {
  if ($.isFunction(easing)) {
    callback = easing;
    easing = null;
  }

  return this.queue('fx', function() {
    var that = $(this),
      originalStyleAttr = that.attr('style') || ' ',
      originalStyle = filterStyles(getElementStyles.call(this)),
      newStyle,
      className = that.attr('className');

    $.each(classAnimationActions, function(i, action) {
      if (value[action]) {
        that[action + 'Class'](value[action]);
      }
    });
    newStyle = filterStyles(getElementStyles.call(this));
    that.attr('className', className);

    that.animate(styleDifference(originalStyle, newStyle), duration, easing, function() {
      $.each(classAnimationActions, function(i, action) {
        if (value[action]) { that[action + 'Class'](value[action]); }
      });
      // work around bug in IE by clearing the cssText before setting it
      if (typeof that.attr('style') == 'object') {
        that.attr('style').cssText = '';
        that.attr('style').cssText = originalStyleAttr;
      } else {
        that.attr('style', originalStyleAttr);
      }
      if (callback) { callback.apply(this, arguments); }
    });

    // $.animate adds a function to the end of the queue
    // but we want it at the front
    var queue = $.queue(this),
      anim = queue.splice(queue.length - 1, 1)[0];
    queue.splice(1, 0, anim);
    $.dequeue(this);
  });
};

$.fn.extend({
  _addClass: $.fn.addClass,
  addClass: function(classNames, speed, easing, callback) {
    return speed ? $.effects.animateClass.apply(this, [{ add: classNames },speed,easing,callback]) : this._addClass(classNames);
  },

  _removeClass: $.fn.removeClass,
  removeClass: function(classNames,speed,easing,callback) {
    return speed ? $.effects.animateClass.apply(this, [{ remove: classNames },speed,easing,callback]) : this._removeClass(classNames);
  },

  _toggleClass: $.fn.toggleClass,
  toggleClass: function(classNames, force, speed, easing, callback) {
    if ( typeof force == "boolean" || force === undefined ) {
      if ( !speed ) {
        // without speed parameter;
        return this._toggleClass(classNames, force);
      } else {
        return $.effects.animateClass.apply(this, [(force?{add:classNames}:{remove:classNames}),speed,easing,callback]);
      }
    } else {
      // without switch parameter;
      return $.effects.animateClass.apply(this, [{ toggle: classNames },force,speed,easing]);
    }
  },

  switchClass: function(remove,add,speed,easing,callback) {
    return $.effects.animateClass.apply(this, [{ add: add, remove: remove },speed,easing,callback]);
  }
});



/******************************************************************************/
/*********************************** EFFECTS **********************************/
/******************************************************************************/

$.extend($.effects, {
  version: "1.8.12",

  // Saves a set of properties in a data storage
  save: function(element, set) {
    for(var i=0; i < set.length; i++) {
      if(set[i] !== null) element.data("ec.storage."+set[i], element[0].style[set[i]]);
    }
  },

  // Restores a set of previously saved properties from a data storage
  restore: function(element, set) {
    for(var i=0; i < set.length; i++) {
      if(set[i] !== null) element.css(set[i], element.data("ec.storage."+set[i]));
    }
  },

  setMode: function(el, mode) {
    if (mode == 'toggle') mode = el.is(':hidden') ? 'show' : 'hide'; // Set for toggle
    return mode;
  },

  getBaseline: function(origin, original) { // Translates a [top,left] array into a baseline value
    // this should be a little more flexible in the future to handle a string & hash
    var y, x;
    switch (origin[0]) {
      case 'top': y = 0; break;
      case 'middle': y = 0.5; break;
      case 'bottom': y = 1; break;
      default: y = origin[0] / original.height;
    };
    switch (origin[1]) {
      case 'left': x = 0; break;
      case 'center': x = 0.5; break;
      case 'right': x = 1; break;
      default: x = origin[1] / original.width;
    };
    return {x: x, y: y};
  },

  // Wraps the element around a wrapper that copies position properties
  createWrapper: function(element) {

    // if the element is already wrapped, return it
    if (element.parent().is('.ui-effects-wrapper')) {
      return element.parent();
    }

    // wrap the element
    var props = {
        width: element.outerWidth(true),
        height: element.outerHeight(true),
        'float': element.css('float')
      },
      wrapper = $('<div></div>')
        .addClass('ui-effects-wrapper')
        .css({
          fontSize: '100%',
          background: 'transparent',
          border: 'none',
          margin: 0,
          padding: 0
        });

    element.wrap(wrapper);
    wrapper = element.parent(); //Hotfix for jQuery 1.4 since some change in wrap() seems to actually loose the reference to the wrapped element

    // transfer positioning properties to the wrapper
    if (element.css('position') == 'static') {
      wrapper.css({ position: 'relative' });
      element.css({ position: 'relative' });
    } else {
      $.extend(props, {
        position: element.css('position'),
        zIndex: element.css('z-index')
      });
      $.each(['top', 'left', 'bottom', 'right'], function(i, pos) {
        props[pos] = element.css(pos);
        if (isNaN(parseInt(props[pos], 10))) {
          props[pos] = 'auto';
        }
      });
      element.css({position: 'relative', top: 0, left: 0, right: 'auto', bottom: 'auto' });
    }

    return wrapper.css(props).show();
  },

  removeWrapper: function(element) {
    if (element.parent().is('.ui-effects-wrapper'))
      return element.parent().replaceWith(element);
    return element;
  },

  setTransition: function(element, list, factor, value) {
    value = value || {};
    $.each(list, function(i, x){
      unit = element.cssUnit(x);
      if (unit[0] > 0) value[x] = unit[0] * factor + unit[1];
    });
    return value;
  }
});


function _normalizeArguments(effect, options, speed, callback) {
  // shift params for method overloading
  if (typeof effect == 'object') {
    callback = options;
    speed = null;
    options = effect;
    effect = options.effect;
  }
  if ($.isFunction(options)) {
    callback = options;
    speed = null;
    options = {};
  }
        if (typeof options == 'number' || $.fx.speeds[options]) {
    callback = speed;
    speed = options;
    options = {};
  }
  if ($.isFunction(speed)) {
    callback = speed;
    speed = null;
  }

  options = options || {};

  speed = speed || options.duration;
  speed = $.fx.off ? 0 : typeof speed == 'number'
    ? speed : speed in $.fx.speeds ? $.fx.speeds[speed] : $.fx.speeds._default;

  callback = callback || options.complete;

  return [effect, options, speed, callback];
}

function standardSpeed( speed ) {
  // valid standard speeds
  if ( !speed || typeof speed === "number" || $.fx.speeds[ speed ] ) {
    return true;
  }
  
  // invalid strings - treat as "normal" speed
  if ( typeof speed === "string" && !$.effects[ speed ] ) {
    return true;
  }
  
  return false;
}

$.fn.extend({
  effect: function(effect, options, speed, callback) {
    var args = _normalizeArguments.apply(this, arguments),
      // TODO: make effects take actual parameters instead of a hash
      args2 = {
        options: args[1],
        duration: args[2],
        callback: args[3]
      },
      mode = args2.options.mode,
      effectMethod = $.effects[effect];
    
    if ( $.fx.off || !effectMethod ) {
      // delegate to the original method (e.g., .show()) if possible
      if ( mode ) {
        return this[ mode ]( args2.duration, args2.callback );
      } else {
        return this.each(function() {
          if ( args2.callback ) {
            args2.callback.call( this );
          }
        });
      }
    }
    
    return effectMethod.call(this, args2);
  },

  _show: $.fn.show,
  show: function(speed) {
    if ( standardSpeed( speed ) ) {
      return this._show.apply(this, arguments);
    } else {
      var args = _normalizeArguments.apply(this, arguments);
      args[1].mode = 'show';
      return this.effect.apply(this, args);
    }
  },

  _hide: $.fn.hide,
  hide: function(speed) {
    if ( standardSpeed( speed ) ) {
      return this._hide.apply(this, arguments);
    } else {
      var args = _normalizeArguments.apply(this, arguments);
      args[1].mode = 'hide';
      return this.effect.apply(this, args);
    }
  },

  // jQuery core overloads toggle and creates _toggle
  __toggle: $.fn.toggle,
  toggle: function(speed) {
    if ( standardSpeed( speed ) || typeof speed === "boolean" || $.isFunction( speed ) ) {
      return this.__toggle.apply(this, arguments);
    } else {
      var args = _normalizeArguments.apply(this, arguments);
      args[1].mode = 'toggle';
      return this.effect.apply(this, args);
    }
  },

  // helper functions
  cssUnit: function(key) {
    var style = this.css(key), val = [];
    $.each( ['em','px','%','pt'], function(i, unit){
      if(style.indexOf(unit) > 0)
        val = [parseFloat(style), unit];
    });
    return val;
  }
});



/******************************************************************************/
/*********************************** EASING ***********************************/
/******************************************************************************/

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
$.easing.jswing = $.easing.swing;

$.extend($.easing,
{
  def: 'easeOutQuad',
  swing: function (x, t, b, c, d) {
    //alert($.easing.default);
    return $.easing[$.easing.def](x, t, b, c, d);
  },
  easeInQuad: function (x, t, b, c, d) {
    return c*(t/=d)*t + b;
  },
  easeOutQuad: function (x, t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
  },
  easeInOutQuad: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
  },
  easeInCubic: function (x, t, b, c, d) {
    return c*(t/=d)*t*t + b;
  },
  easeOutCubic: function (x, t, b, c, d) {
    return c*((t=t/d-1)*t*t + 1) + b;
  },
  easeInOutCubic: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t + b;
    return c/2*((t-=2)*t*t + 2) + b;
  },
  easeInQuart: function (x, t, b, c, d) {
    return c*(t/=d)*t*t*t + b;
  },
  easeOutQuart: function (x, t, b, c, d) {
    return -c * ((t=t/d-1)*t*t*t - 1) + b;
  },
  easeInOutQuart: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
    return -c/2 * ((t-=2)*t*t*t - 2) + b;
  },
  easeInQuint: function (x, t, b, c, d) {
    return c*(t/=d)*t*t*t*t + b;
  },
  easeOutQuint: function (x, t, b, c, d) {
    return c*((t=t/d-1)*t*t*t*t + 1) + b;
  },
  easeInOutQuint: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
    return c/2*((t-=2)*t*t*t*t + 2) + b;
  },
  easeInSine: function (x, t, b, c, d) {
    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
  },
  easeOutSine: function (x, t, b, c, d) {
    return c * Math.sin(t/d * (Math.PI/2)) + b;
  },
  easeInOutSine: function (x, t, b, c, d) {
    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
  },
  easeInExpo: function (x, t, b, c, d) {
    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
  },
  easeOutExpo: function (x, t, b, c, d) {
    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
  },
  easeInOutExpo: function (x, t, b, c, d) {
    if (t==0) return b;
    if (t==d) return b+c;
    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
  },
  easeInCirc: function (x, t, b, c, d) {
    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
  },
  easeOutCirc: function (x, t, b, c, d) {
    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
  },
  easeInOutCirc: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
  },
  easeInElastic: function (x, t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
  },
  easeOutElastic: function (x, t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
  },
  easeInOutElastic: function (x, t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
  },
  easeInBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c*(t/=d)*t*((s+1)*t - s) + b;
  },
  easeOutBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
  },
  easeInOutBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
  },
  easeInBounce: function (x, t, b, c, d) {
    return c - $.easing.easeOutBounce (x, d-t, 0, c, d) + b;
  },
  easeOutBounce: function (x, t, b, c, d) {
    if ((t/=d) < (1/2.75)) {
      return c*(7.5625*t*t) + b;
    } else if (t < (2/2.75)) {
      return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
    } else if (t < (2.5/2.75)) {
      return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
    } else {
      return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    }
  },
  easeInOutBounce: function (x, t, b, c, d) {
    if (t < d/2) return $.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
    return $.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
  }
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

})(jQuery);
/*
 * jQuery UI Effects Blind 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Blind
 *
 * Depends:
 *  jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.blind = function(o) {

  return this.queue(function() {

    // Create element
    var el = $(this), props = ['position','top','bottom','left','right'];

    // Set options
    var mode = $.effects.setMode(el, o.options.mode || 'hide'); // Set Mode
    var direction = o.options.direction || 'vertical'; // Default direction

    // Adjust
    $.effects.save(el, props); el.show(); // Save & Show
    var wrapper = $.effects.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
    var ref = (direction == 'vertical') ? 'height' : 'width';
    var distance = (direction == 'vertical') ? wrapper.height() : wrapper.width();
    if(mode == 'show') wrapper.css(ref, 0); // Shift

    // Animation
    var animation = {};
    animation[ref] = mode == 'show' ? distance : 0;

    // Animate
    wrapper.animate(animation, o.duration, o.options.easing, function() {
      if(mode == 'hide') el.hide(); // Hide
      $.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
      if(o.callback) o.callback.apply(el[0], arguments); // Callback
      el.dequeue();
    });

  });

};

})(jQuery);
/*
 * jQuery UI Effects Bounce 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Bounce
 *
 * Depends:
 *  jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.bounce = function(o) {

  return this.queue(function() {

    // Create element
    var el = $(this), props = ['position','top','bottom','left','right'];

    // Set options
    var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
    var direction = o.options.direction || 'up'; // Default direction
    var distance = o.options.distance || 20; // Default distance
    var times = o.options.times || 5; // Default # of times
    var speed = o.duration || 250; // Default speed per bounce
    if (/show|hide/.test(mode)) props.push('opacity'); // Avoid touching opacity to prevent clearType and PNG issues in IE

    // Adjust
    $.effects.save(el, props); el.show(); // Save & Show
    $.effects.createWrapper(el); // Create Wrapper
    var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
    var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';
    var distance = o.options.distance || (ref == 'top' ? el.outerHeight({margin:true}) / 3 : el.outerWidth({margin:true}) / 3);
    if (mode == 'show') el.css('opacity', 0).css(ref, motion == 'pos' ? -distance : distance); // Shift
    if (mode == 'hide') distance = distance / (times * 2);
    if (mode != 'hide') times--;

    // Animate
    if (mode == 'show') { // Show Bounce
      var animation = {opacity: 1};
      animation[ref] = (motion == 'pos' ? '+=' : '-=') + distance;
      el.animate(animation, speed / 2, o.options.easing);
      distance = distance / 2;
      times--;
    };
    for (var i = 0; i < times; i++) { // Bounces
      var animation1 = {}, animation2 = {};
      animation1[ref] = (motion == 'pos' ? '-=' : '+=') + distance;
      animation2[ref] = (motion == 'pos' ? '+=' : '-=') + distance;
      el.animate(animation1, speed / 2, o.options.easing).animate(animation2, speed / 2, o.options.easing);
      distance = (mode == 'hide') ? distance * 2 : distance / 2;
    };
    if (mode == 'hide') { // Last Bounce
      var animation = {opacity: 0};
      animation[ref] = (motion == 'pos' ? '-=' : '+=')  + distance;
      el.animate(animation, speed / 2, o.options.easing, function(){
        el.hide(); // Hide
        $.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
        if(o.callback) o.callback.apply(this, arguments); // Callback
      });
    } else {
      var animation1 = {}, animation2 = {};
      animation1[ref] = (motion == 'pos' ? '-=' : '+=') + distance;
      animation2[ref] = (motion == 'pos' ? '+=' : '-=') + distance;
      el.animate(animation1, speed / 2, o.options.easing).animate(animation2, speed / 2, o.options.easing, function(){
        $.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
        if(o.callback) o.callback.apply(this, arguments); // Callback
      });
    };
    el.queue('fx', function() { el.dequeue(); });
    el.dequeue();
  });

};

})(jQuery);
/*
 * jQuery UI Effects Clip 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Clip
 *
 * Depends:
 *  jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.clip = function(o) {

  return this.queue(function() {

    // Create element
    var el = $(this), props = ['position','top','bottom','left','right','height','width'];

    // Set options
    var mode = $.effects.setMode(el, o.options.mode || 'hide'); // Set Mode
    var direction = o.options.direction || 'vertical'; // Default direction

    // Adjust
    $.effects.save(el, props); el.show(); // Save & Show
    var wrapper = $.effects.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
    var animate = el[0].tagName == 'IMG' ? wrapper : el;
    var ref = {
      size: (direction == 'vertical') ? 'height' : 'width',
      position: (direction == 'vertical') ? 'top' : 'left'
    };
    var distance = (direction == 'vertical') ? animate.height() : animate.width();
    if(mode == 'show') { animate.css(ref.size, 0); animate.css(ref.position, distance / 2); } // Shift

    // Animation
    var animation = {};
    animation[ref.size] = mode == 'show' ? distance : 0;
    animation[ref.position] = mode == 'show' ? 0 : distance / 2;

    // Animate
    animate.animate(animation, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
      if(mode == 'hide') el.hide(); // Hide
      $.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
      if(o.callback) o.callback.apply(el[0], arguments); // Callback
      el.dequeue();
    }});

  });

};

})(jQuery);
/*
 * jQuery UI Effects Drop 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Drop
 *
 * Depends:
 *  jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.drop = function(o) {

  return this.queue(function() {

    // Create element
    var el = $(this), props = ['position','top','bottom','left','right','opacity'];

    // Set options
    var mode = $.effects.setMode(el, o.options.mode || 'hide'); // Set Mode
    var direction = o.options.direction || 'left'; // Default Direction

    // Adjust
    $.effects.save(el, props); el.show(); // Save & Show
    $.effects.createWrapper(el); // Create Wrapper
    var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
    var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';
    var distance = o.options.distance || (ref == 'top' ? el.outerHeight({margin:true}) / 2 : el.outerWidth({margin:true}) / 2);
    if (mode == 'show') el.css('opacity', 0).css(ref, motion == 'pos' ? -distance : distance); // Shift

    // Animation
    var animation = {opacity: mode == 'show' ? 1 : 0};
    animation[ref] = (mode == 'show' ? (motion == 'pos' ? '+=' : '-=') : (motion == 'pos' ? '-=' : '+=')) + distance;

    // Animate
    el.animate(animation, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
      if(mode == 'hide') el.hide(); // Hide
      $.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
      if(o.callback) o.callback.apply(this, arguments); // Callback
      el.dequeue();
    }});

  });

};

})(jQuery);
/*
 * jQuery UI Effects Explode 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Explode
 *
 * Depends:
 *  jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.explode = function(o) {

  return this.queue(function() {

  var rows = o.options.pieces ? Math.round(Math.sqrt(o.options.pieces)) : 3;
  var cells = o.options.pieces ? Math.round(Math.sqrt(o.options.pieces)) : 3;

  o.options.mode = o.options.mode == 'toggle' ? ($(this).is(':visible') ? 'hide' : 'show') : o.options.mode;
  var el = $(this).show().css('visibility', 'hidden');
  var offset = el.offset();

  //Substract the margins - not fixing the problem yet.
  offset.top -= parseInt(el.css("marginTop"),10) || 0;
  offset.left -= parseInt(el.css("marginLeft"),10) || 0;

  var width = el.outerWidth(true);
  var height = el.outerHeight(true);

  for(var i=0;i<rows;i++) { // =
    for(var j=0;j<cells;j++) { // ||
      el
        .clone()
        .appendTo('body')
        .wrap('<div></div>')
        .css({
          position: 'absolute',
          visibility: 'visible',
          left: -j*(width/cells),
          top: -i*(height/rows)
        })
        .parent()
        .addClass('ui-effects-explode')
        .css({
          position: 'absolute',
          overflow: 'hidden',
          width: width/cells,
          height: height/rows,
          left: offset.left + j*(width/cells) + (o.options.mode == 'show' ? (j-Math.floor(cells/2))*(width/cells) : 0),
          top: offset.top + i*(height/rows) + (o.options.mode == 'show' ? (i-Math.floor(rows/2))*(height/rows) : 0),
          opacity: o.options.mode == 'show' ? 0 : 1
        }).animate({
          left: offset.left + j*(width/cells) + (o.options.mode == 'show' ? 0 : (j-Math.floor(cells/2))*(width/cells)),
          top: offset.top + i*(height/rows) + (o.options.mode == 'show' ? 0 : (i-Math.floor(rows/2))*(height/rows)),
          opacity: o.options.mode == 'show' ? 1 : 0
        }, o.duration || 500);
    }
  }

  // Set a timeout, to call the callback approx. when the other animations have finished
  setTimeout(function() {

    o.options.mode == 'show' ? el.css({ visibility: 'visible' }) : el.css({ visibility: 'visible' }).hide();
        if(o.callback) o.callback.apply(el[0]); // Callback
        el.dequeue();

        $('div.ui-effects-explode').remove();

  }, o.duration || 500);


  });

};

})(jQuery);
/*
 * jQuery UI Effects Fade 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Fade
 *
 * Depends:
 *  jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.fade = function(o) {
  return this.queue(function() {
    var elem = $(this),
      mode = $.effects.setMode(elem, o.options.mode || 'hide');

    elem.animate({ opacity: mode }, {
      queue: false,
      duration: o.duration,
      easing: o.options.easing,
      complete: function() {
        (o.callback && o.callback.apply(this, arguments));
        elem.dequeue();
      }
    });
  });
};

})(jQuery);
/*
 * jQuery UI Effects Fold 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Fold
 *
 * Depends:
 *  jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.fold = function(o) {

  return this.queue(function() {

    // Create element
    var el = $(this), props = ['position','top','bottom','left','right'];

    // Set options
    var mode = $.effects.setMode(el, o.options.mode || 'hide'); // Set Mode
    var size = o.options.size || 15; // Default fold size
    var horizFirst = !(!o.options.horizFirst); // Ensure a boolean value
    var duration = o.duration ? o.duration / 2 : $.fx.speeds._default / 2;

    // Adjust
    $.effects.save(el, props); el.show(); // Save & Show
    var wrapper = $.effects.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
    var widthFirst = ((mode == 'show') != horizFirst);
    var ref = widthFirst ? ['width', 'height'] : ['height', 'width'];
    var distance = widthFirst ? [wrapper.width(), wrapper.height()] : [wrapper.height(), wrapper.width()];
    var percent = /([0-9]+)%/.exec(size);
    if(percent) size = parseInt(percent[1],10) / 100 * distance[mode == 'hide' ? 0 : 1];
    if(mode == 'show') wrapper.css(horizFirst ? {height: 0, width: size} : {height: size, width: 0}); // Shift

    // Animation
    var animation1 = {}, animation2 = {};
    animation1[ref[0]] = mode == 'show' ? distance[0] : size;
    animation2[ref[1]] = mode == 'show' ? distance[1] : 0;

    // Animate
    wrapper.animate(animation1, duration, o.options.easing)
    .animate(animation2, duration, o.options.easing, function() {
      if(mode == 'hide') el.hide(); // Hide
      $.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
      if(o.callback) o.callback.apply(el[0], arguments); // Callback
      el.dequeue();
    });

  });

};

})(jQuery);
/*
 * jQuery UI Effects Highlight 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Highlight
 *
 * Depends:
 *  jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.highlight = function(o) {
  return this.queue(function() {
    var elem = $(this),
      props = ['backgroundImage', 'backgroundColor', 'opacity'],
      mode = $.effects.setMode(elem, o.options.mode || 'show'),
      animation = {
        backgroundColor: elem.css('backgroundColor')
      };

    if (mode == 'hide') {
      animation.opacity = 0;
    }

    $.effects.save(elem, props);
    elem
      .show()
      .css({
        backgroundImage: 'none',
        backgroundColor: o.options.color || '#ffff99'
      })
      .animate(animation, {
        queue: false,
        duration: o.duration,
        easing: o.options.easing,
        complete: function() {
          (mode == 'hide' && elem.hide());
          $.effects.restore(elem, props);
          (mode == 'show' && !$.support.opacity && this.style.removeAttribute('filter'));
          (o.callback && o.callback.apply(this, arguments));
          elem.dequeue();
        }
      });
  });
};

})(jQuery);
/*
 * jQuery UI Effects Pulsate 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Pulsate
 *
 * Depends:
 *  jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.pulsate = function(o) {
  return this.queue(function() {
    var elem = $(this),
      mode = $.effects.setMode(elem, o.options.mode || 'show');
      times = ((o.options.times || 5) * 2) - 1;
      duration = o.duration ? o.duration / 2 : $.fx.speeds._default / 2,
      isVisible = elem.is(':visible'),
      animateTo = 0;

    if (!isVisible) {
      elem.css('opacity', 0).show();
      animateTo = 1;
    }

    if ((mode == 'hide' && isVisible) || (mode == 'show' && !isVisible)) {
      times--;
    }

    for (var i = 0; i < times; i++) {
      elem.animate({ opacity: animateTo }, duration, o.options.easing);
      animateTo = (animateTo + 1) % 2;
    }

    elem.animate({ opacity: animateTo }, duration, o.options.easing, function() {
      if (animateTo == 0) {
        elem.hide();
      }
      (o.callback && o.callback.apply(this, arguments));
    });

    elem
      .queue('fx', function() { elem.dequeue(); })
      .dequeue();
  });
};

})(jQuery);
/*
 * jQuery UI Effects Scale 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Scale
 *
 * Depends:
 *  jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.puff = function(o) {
  return this.queue(function() {
    var elem = $(this),
      mode = $.effects.setMode(elem, o.options.mode || 'hide'),
      percent = parseInt(o.options.percent, 10) || 150,
      factor = percent / 100,
      original = { height: elem.height(), width: elem.width() };

    $.extend(o.options, {
      fade: true,
      mode: mode,
      percent: mode == 'hide' ? percent : 100,
      from: mode == 'hide'
        ? original
        : {
          height: original.height * factor,
          width: original.width * factor
        }
    });

    elem.effect('scale', o.options, o.duration, o.callback);
    elem.dequeue();
  });
};

$.effects.scale = function(o) {

  return this.queue(function() {

    // Create element
    var el = $(this);

    // Set options
    var options = $.extend(true, {}, o.options);
    var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
    var percent = parseInt(o.options.percent,10) || (parseInt(o.options.percent,10) == 0 ? 0 : (mode == 'hide' ? 0 : 100)); // Set default scaling percent
    var direction = o.options.direction || 'both'; // Set default axis
    var origin = o.options.origin; // The origin of the scaling
    if (mode != 'effect') { // Set default origin and restore for show/hide
      options.origin = origin || ['middle','center'];
      options.restore = true;
    }
    var original = {height: el.height(), width: el.width()}; // Save original
    el.from = o.options.from || (mode == 'show' ? {height: 0, width: 0} : original); // Default from state

    // Adjust
    var factor = { // Set scaling factor
      y: direction != 'horizontal' ? (percent / 100) : 1,
      x: direction != 'vertical' ? (percent / 100) : 1
    };
    el.to = {height: original.height * factor.y, width: original.width * factor.x}; // Set to state

    if (o.options.fade) { // Fade option to support puff
      if (mode == 'show') {el.from.opacity = 0; el.to.opacity = 1;};
      if (mode == 'hide') {el.from.opacity = 1; el.to.opacity = 0;};
    };

    // Animation
    options.from = el.from; options.to = el.to; options.mode = mode;

    // Animate
    el.effect('size', options, o.duration, o.callback);
    el.dequeue();
  });

};

$.effects.size = function(o) {

  return this.queue(function() {

    // Create element
    var el = $(this), props = ['position','top','bottom','left','right','width','height','overflow','opacity'];
    var props1 = ['position','top','bottom','left','right','overflow','opacity']; // Always restore
    var props2 = ['width','height','overflow']; // Copy for children
    var cProps = ['fontSize'];
    var vProps = ['borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom'];
    var hProps = ['borderLeftWidth', 'borderRightWidth', 'paddingLeft', 'paddingRight'];

    // Set options
    var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
    var restore = o.options.restore || false; // Default restore
    var scale = o.options.scale || 'both'; // Default scale mode
    var origin = o.options.origin; // The origin of the sizing
    var original = {height: el.height(), width: el.width()}; // Save original
    el.from = o.options.from || original; // Default from state
    el.to = o.options.to || original; // Default to state
    // Adjust
    if (origin) { // Calculate baseline shifts
      var baseline = $.effects.getBaseline(origin, original);
      el.from.top = (original.height - el.from.height) * baseline.y;
      el.from.left = (original.width - el.from.width) * baseline.x;
      el.to.top = (original.height - el.to.height) * baseline.y;
      el.to.left = (original.width - el.to.width) * baseline.x;
    };
    var factor = { // Set scaling factor
      from: {y: el.from.height / original.height, x: el.from.width / original.width},
      to: {y: el.to.height / original.height, x: el.to.width / original.width}
    };
    if (scale == 'box' || scale == 'both') { // Scale the css box
      if (factor.from.y != factor.to.y) { // Vertical props scaling
        props = props.concat(vProps);
        el.from = $.effects.setTransition(el, vProps, factor.from.y, el.from);
        el.to = $.effects.setTransition(el, vProps, factor.to.y, el.to);
      };
      if (factor.from.x != factor.to.x) { // Horizontal props scaling
        props = props.concat(hProps);
        el.from = $.effects.setTransition(el, hProps, factor.from.x, el.from);
        el.to = $.effects.setTransition(el, hProps, factor.to.x, el.to);
      };
    };
    if (scale == 'content' || scale == 'both') { // Scale the content
      if (factor.from.y != factor.to.y) { // Vertical props scaling
        props = props.concat(cProps);
        el.from = $.effects.setTransition(el, cProps, factor.from.y, el.from);
        el.to = $.effects.setTransition(el, cProps, factor.to.y, el.to);
      };
    };
    $.effects.save(el, restore ? props : props1); el.show(); // Save & Show
    $.effects.createWrapper(el); // Create Wrapper
    el.css('overflow','hidden').css(el.from); // Shift

    // Animate
    if (scale == 'content' || scale == 'both') { // Scale the children
      vProps = vProps.concat(['marginTop','marginBottom']).concat(cProps); // Add margins/font-size
      hProps = hProps.concat(['marginLeft','marginRight']); // Add margins
      props2 = props.concat(vProps).concat(hProps); // Concat
      el.find("*[width]").each(function(){
        child = $(this);
        if (restore) $.effects.save(child, props2);
        var c_original = {height: child.height(), width: child.width()}; // Save original
        child.from = {height: c_original.height * factor.from.y, width: c_original.width * factor.from.x};
        child.to = {height: c_original.height * factor.to.y, width: c_original.width * factor.to.x};
        if (factor.from.y != factor.to.y) { // Vertical props scaling
          child.from = $.effects.setTransition(child, vProps, factor.from.y, child.from);
          child.to = $.effects.setTransition(child, vProps, factor.to.y, child.to);
        };
        if (factor.from.x != factor.to.x) { // Horizontal props scaling
          child.from = $.effects.setTransition(child, hProps, factor.from.x, child.from);
          child.to = $.effects.setTransition(child, hProps, factor.to.x, child.to);
        };
        child.css(child.from); // Shift children
        child.animate(child.to, o.duration, o.options.easing, function(){
          if (restore) $.effects.restore(child, props2); // Restore children
        }); // Animate children
      });
    };

    // Animate
    el.animate(el.to, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
      if (el.to.opacity === 0) {
        el.css('opacity', el.from.opacity);
      }
      if(mode == 'hide') el.hide(); // Hide
      $.effects.restore(el, restore ? props : props1); $.effects.removeWrapper(el); // Restore
      if(o.callback) o.callback.apply(this, arguments); // Callback
      el.dequeue();
    }});

  });

};

})(jQuery);
/*
 * jQuery UI Effects Shake 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Shake
 *
 * Depends:
 *  jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.shake = function(o) {

  return this.queue(function() {

    // Create element
    var el = $(this), props = ['position','top','bottom','left','right'];

    // Set options
    var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
    var direction = o.options.direction || 'left'; // Default direction
    var distance = o.options.distance || 20; // Default distance
    var times = o.options.times || 3; // Default # of times
    var speed = o.duration || o.options.duration || 140; // Default speed per shake

    // Adjust
    $.effects.save(el, props); el.show(); // Save & Show
    $.effects.createWrapper(el); // Create Wrapper
    var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
    var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';

    // Animation
    var animation = {}, animation1 = {}, animation2 = {};
    animation[ref] = (motion == 'pos' ? '-=' : '+=')  + distance;
    animation1[ref] = (motion == 'pos' ? '+=' : '-=')  + distance * 2;
    animation2[ref] = (motion == 'pos' ? '-=' : '+=')  + distance * 2;

    // Animate
    el.animate(animation, speed, o.options.easing);
    for (var i = 1; i < times; i++) { // Shakes
      el.animate(animation1, speed, o.options.easing).animate(animation2, speed, o.options.easing);
    };
    el.animate(animation1, speed, o.options.easing).
    animate(animation, speed / 2, o.options.easing, function(){ // Last shake
      $.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
      if(o.callback) o.callback.apply(this, arguments); // Callback
    });
    el.queue('fx', function() { el.dequeue(); });
    el.dequeue();
  });

};

})(jQuery);
/*
 * jQuery UI Effects Slide 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Slide
 *
 * Depends:
 *  jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.slide = function(o) {

  return this.queue(function() {

    // Create element
    var el = $(this), props = ['position','top','bottom','left','right'];

    // Set options
    var mode = $.effects.setMode(el, o.options.mode || 'show'); // Set Mode
    var direction = o.options.direction || 'left'; // Default Direction

    // Adjust
    $.effects.save(el, props); el.show(); // Save & Show
    $.effects.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
    var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
    var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';
    var distance = o.options.distance || (ref == 'top' ? el.outerHeight({margin:true}) : el.outerWidth({margin:true}));
    if (mode == 'show') el.css(ref, motion == 'pos' ? (isNaN(distance) ? "-" + distance : -distance) : distance); // Shift

    // Animation
    var animation = {};
    animation[ref] = (mode == 'show' ? (motion == 'pos' ? '+=' : '-=') : (motion == 'pos' ? '-=' : '+=')) + distance;

    // Animate
    el.animate(animation, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
      if(mode == 'hide') el.hide(); // Hide
      $.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
      if(o.callback) o.callback.apply(this, arguments); // Callback
      el.dequeue();
    }});

  });

};

})(jQuery);
/*
 * jQuery UI Effects Transfer 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Transfer
 *
 * Depends:
 *  jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.transfer = function(o) {
  return this.queue(function() {
    var elem = $(this),
      target = $(o.options.to),
      endPosition = target.offset(),
      animation = {
        top: endPosition.top,
        left: endPosition.left,
        height: target.innerHeight(),
        width: target.innerWidth()
      },
      startPosition = elem.offset(),
      transfer = $('<div class="ui-effects-transfer"></div>')
        .appendTo(document.body)
        .addClass(o.options.className)
        .css({
          top: startPosition.top,
          left: startPosition.left,
          height: elem.innerHeight(),
          width: elem.innerWidth(),
          position: 'absolute'
        })
        .animate(animation, o.duration, o.options.easing, function() {
          transfer.remove();
          (o.callback && o.callback.apply(elem[0], arguments));
          elem.dequeue();
        });
  });
};

})(jQuery);
/*
 * jQuery UI Accordion 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Accordion
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget( "ui.accordion", {
  options: {
    active: 0,
    animated: "slide",
    autoHeight: true,
    clearStyle: false,
    collapsible: false,
    event: "click",
    fillSpace: false,
    header: "> li > :first-child,> :not(li):even",
    icons: {
      header: "ui-icon-triangle-1-e",
      headerSelected: "ui-icon-triangle-1-s"
    },
    navigation: false,
    navigationFilter: function() {
      return this.href.toLowerCase() === location.href.toLowerCase();
    }
  },

  _create: function() {
    var self = this,
      options = self.options;

    self.running = 0;

    self.element
      .addClass( "ui-accordion ui-widget ui-helper-reset" )
      // in lack of child-selectors in CSS
      // we need to mark top-LIs in a UL-accordion for some IE-fix
      .children( "li" )
        .addClass( "ui-accordion-li-fix" );

    self.headers = self.element.find( options.header )
      .addClass( "ui-accordion-header ui-helper-reset ui-state-default ui-corner-all" )
      .bind( "mouseenter.accordion", function() {
        if ( options.disabled ) {
          return;
        }
        $( this ).addClass( "ui-state-hover" );
      })
      .bind( "mouseleave.accordion", function() {
        if ( options.disabled ) {
          return;
        }
        $( this ).removeClass( "ui-state-hover" );
      })
      .bind( "focus.accordion", function() {
        if ( options.disabled ) {
          return;
        }
        $( this ).addClass( "ui-state-focus" );
      })
      .bind( "blur.accordion", function() {
        if ( options.disabled ) {
          return;
        }
        $( this ).removeClass( "ui-state-focus" );
      });

    self.headers.next()
      .addClass( "ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom" );

    if ( options.navigation ) {
      var current = self.element.find( "a" ).filter( options.navigationFilter ).eq( 0 );
      if ( current.length ) {
        var header = current.closest( ".ui-accordion-header" );
        if ( header.length ) {
          // anchor within header
          self.active = header;
        } else {
          // anchor within content
          self.active = current.closest( ".ui-accordion-content" ).prev();
        }
      }
    }

    self.active = self._findActive( self.active || options.active )
      .addClass( "ui-state-default ui-state-active" )
      .toggleClass( "ui-corner-all" )
      .toggleClass( "ui-corner-top" );
    self.active.next().addClass( "ui-accordion-content-active" );

    self._createIcons();
    self.resize();
    
    // ARIA
    self.element.attr( "role", "tablist" );

    self.headers
      .attr( "role", "tab" )
      .bind( "keydown.accordion", function( event ) {
        return self._keydown( event );
      })
      .next()
        .attr( "role", "tabpanel" );

    self.headers
      .not( self.active || "" )
      .attr({
        "aria-expanded": "false",
        "aria-selected": "false",
        tabIndex: -1
      })
      .next()
        .hide();

    // make sure at least one header is in the tab order
    if ( !self.active.length ) {
      self.headers.eq( 0 ).attr( "tabIndex", 0 );
    } else {
      self.active
        .attr({
          "aria-expanded": "true",
          "aria-selected": "true",
          tabIndex: 0
        });
    }

    // only need links in tab order for Safari
    if ( !$.browser.safari ) {
      self.headers.find( "a" ).attr( "tabIndex", -1 );
    }

    if ( options.event ) {
      self.headers.bind( options.event.split(" ").join(".accordion ") + ".accordion", function(event) {
        self._clickHandler.call( self, event, this );
        event.preventDefault();
      });
    }
  },

  _createIcons: function() {
    var options = this.options;
    if ( options.icons ) {
      $( "<span></span>" )
        .addClass( "ui-icon " + options.icons.header )
        .prependTo( this.headers );
      this.active.children( ".ui-icon" )
        .toggleClass(options.icons.header)
        .toggleClass(options.icons.headerSelected);
      this.element.addClass( "ui-accordion-icons" );
    }
  },

  _destroyIcons: function() {
    this.headers.children( ".ui-icon" ).remove();
    this.element.removeClass( "ui-accordion-icons" );
  },

  destroy: function() {
    var options = this.options;

    this.element
      .removeClass( "ui-accordion ui-widget ui-helper-reset" )
      .removeAttr( "role" );

    this.headers
      .unbind( ".accordion" )
      .removeClass( "ui-accordion-header ui-accordion-disabled ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top" )
      .removeAttr( "role" )
      .removeAttr( "aria-expanded" )
      .removeAttr( "aria-selected" )
      .removeAttr( "tabIndex" );

    this.headers.find( "a" ).removeAttr( "tabIndex" );
    this._destroyIcons();
    var contents = this.headers.next()
      .css( "display", "" )
      .removeAttr( "role" )
      .removeClass( "ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-accordion-disabled ui-state-disabled" );
    if ( options.autoHeight || options.fillHeight ) {
      contents.css( "height", "" );
    }

    return $.Widget.prototype.destroy.call( this );
  },

  _setOption: function( key, value ) {
    $.Widget.prototype._setOption.apply( this, arguments );
      
    if ( key == "active" ) {
      this.activate( value );
    }
    if ( key == "icons" ) {
      this._destroyIcons();
      if ( value ) {
        this._createIcons();
      }
    }
    // #5332 - opacity doesn't cascade to positioned elements in IE
    // so we need to add the disabled class to the headers and panels
    if ( key == "disabled" ) {
      this.headers.add(this.headers.next())
        [ value ? "addClass" : "removeClass" ](
          "ui-accordion-disabled ui-state-disabled" );
    }
  },

  _keydown: function( event ) {
    if ( this.options.disabled || event.altKey || event.ctrlKey ) {
      return;
    }

    var keyCode = $.ui.keyCode,
      length = this.headers.length,
      currentIndex = this.headers.index( event.target ),
      toFocus = false;

    switch ( event.keyCode ) {
      case keyCode.RIGHT:
      case keyCode.DOWN:
        toFocus = this.headers[ ( currentIndex + 1 ) % length ];
        break;
      case keyCode.LEFT:
      case keyCode.UP:
        toFocus = this.headers[ ( currentIndex - 1 + length ) % length ];
        break;
      case keyCode.SPACE:
      case keyCode.ENTER:
        this._clickHandler( { target: event.target }, event.target );
        event.preventDefault();
    }

    if ( toFocus ) {
      $( event.target ).attr( "tabIndex", -1 );
      $( toFocus ).attr( "tabIndex", 0 );
      toFocus.focus();
      return false;
    }

    return true;
  },

  resize: function() {
    var options = this.options,
      maxHeight;

    if ( options.fillSpace ) {
      if ( $.browser.msie ) {
        var defOverflow = this.element.parent().css( "overflow" );
        this.element.parent().css( "overflow", "hidden");
      }
      maxHeight = this.element.parent().height();
      if ($.browser.msie) {
        this.element.parent().css( "overflow", defOverflow );
      }

      this.headers.each(function() {
        maxHeight -= $( this ).outerHeight( true );
      });

      this.headers.next()
        .each(function() {
          $( this ).height( Math.max( 0, maxHeight -
            $( this ).innerHeight() + $( this ).height() ) );
        })
        .css( "overflow", "auto" );
    } else if ( options.autoHeight ) {
      maxHeight = 0;
      this.headers.next()
        .each(function() {
          maxHeight = Math.max( maxHeight, $( this ).height( "" ).height() );
        })
        .height( maxHeight );
    }

    return this;
  },

  activate: function( index ) {
    // TODO this gets called on init, changing the option without an explicit call for that
    this.options.active = index;
    // call clickHandler with custom event
    var active = this._findActive( index )[ 0 ];
    this._clickHandler( { target: active }, active );

    return this;
  },

  _findActive: function( selector ) {
    return selector
      ? typeof selector === "number"
        ? this.headers.filter( ":eq(" + selector + ")" )
        : this.headers.not( this.headers.not( selector ) )
      : selector === false
        ? $( [] )
        : this.headers.filter( ":eq(0)" );
  },

  // TODO isn't event.target enough? why the separate target argument?
  _clickHandler: function( event, target ) {
    var options = this.options;
    if ( options.disabled ) {
      return;
    }

    // called only when using activate(false) to close all parts programmatically
    if ( !event.target ) {
      if ( !options.collapsible ) {
        return;
      }
      this.active
        .removeClass( "ui-state-active ui-corner-top" )
        .addClass( "ui-state-default ui-corner-all" )
        .children( ".ui-icon" )
          .removeClass( options.icons.headerSelected )
          .addClass( options.icons.header );
      this.active.next().addClass( "ui-accordion-content-active" );
      var toHide = this.active.next(),
        data = {
          options: options,
          newHeader: $( [] ),
          oldHeader: options.active,
          newContent: $( [] ),
          oldContent: toHide
        },
        toShow = ( this.active = $( [] ) );
      this._toggle( toShow, toHide, data );
      return;
    }

    // get the click target
    var clicked = $( event.currentTarget || target ),
      clickedIsActive = clicked[0] === this.active[0];

    // TODO the option is changed, is that correct?
    // TODO if it is correct, shouldn't that happen after determining that the click is valid?
    options.active = options.collapsible && clickedIsActive ?
      false :
      this.headers.index( clicked );

    // if animations are still active, or the active header is the target, ignore click
    if ( this.running || ( !options.collapsible && clickedIsActive ) ) {
      return;
    }

    // find elements to show and hide
    var active = this.active,
      toShow = clicked.next(),
      toHide = this.active.next(),
      data = {
        options: options,
        newHeader: clickedIsActive && options.collapsible ? $([]) : clicked,
        oldHeader: this.active,
        newContent: clickedIsActive && options.collapsible ? $([]) : toShow,
        oldContent: toHide
      },
      down = this.headers.index( this.active[0] ) > this.headers.index( clicked[0] );

    // when the call to ._toggle() comes after the class changes
    // it causes a very odd bug in IE 8 (see #6720)
    this.active = clickedIsActive ? $([]) : clicked;
    this._toggle( toShow, toHide, data, clickedIsActive, down );

    // switch classes
    active
      .removeClass( "ui-state-active ui-corner-top" )
      .addClass( "ui-state-default ui-corner-all" )
      .children( ".ui-icon" )
        .removeClass( options.icons.headerSelected )
        .addClass( options.icons.header );
    if ( !clickedIsActive ) {
      clicked
        .removeClass( "ui-state-default ui-corner-all" )
        .addClass( "ui-state-active ui-corner-top" )
        .children( ".ui-icon" )
          .removeClass( options.icons.header )
          .addClass( options.icons.headerSelected );
      clicked
        .next()
        .addClass( "ui-accordion-content-active" );
    }

    return;
  },

  _toggle: function( toShow, toHide, data, clickedIsActive, down ) {
    var self = this,
      options = self.options;

    self.toShow = toShow;
    self.toHide = toHide;
    self.data = data;

    var complete = function() {
      if ( !self ) {
        return;
      }
      return self._completed.apply( self, arguments );
    };

    // trigger changestart event
    self._trigger( "changestart", null, self.data );

    // count elements to animate
    self.running = toHide.size() === 0 ? toShow.size() : toHide.size();

    if ( options.animated ) {
      var animOptions = {};

      if ( options.collapsible && clickedIsActive ) {
        animOptions = {
          toShow: $( [] ),
          toHide: toHide,
          complete: complete,
          down: down,
          autoHeight: options.autoHeight || options.fillSpace
        };
      } else {
        animOptions = {
          toShow: toShow,
          toHide: toHide,
          complete: complete,
          down: down,
          autoHeight: options.autoHeight || options.fillSpace
        };
      }

      if ( !options.proxied ) {
        options.proxied = options.animated;
      }

      if ( !options.proxiedDuration ) {
        options.proxiedDuration = options.duration;
      }

      options.animated = $.isFunction( options.proxied ) ?
        options.proxied( animOptions ) :
        options.proxied;

      options.duration = $.isFunction( options.proxiedDuration ) ?
        options.proxiedDuration( animOptions ) :
        options.proxiedDuration;

      var animations = $.ui.accordion.animations,
        duration = options.duration,
        easing = options.animated;

      if ( easing && !animations[ easing ] && !$.easing[ easing ] ) {
        easing = "slide";
      }
      if ( !animations[ easing ] ) {
        animations[ easing ] = function( options ) {
          this.slide( options, {
            easing: easing,
            duration: duration || 700
          });
        };
      }

      animations[ easing ]( animOptions );
    } else {
      if ( options.collapsible && clickedIsActive ) {
        toShow.toggle();
      } else {
        toHide.hide();
        toShow.show();
      }

      complete( true );
    }

    // TODO assert that the blur and focus triggers are really necessary, remove otherwise
    toHide.prev()
      .attr({
        "aria-expanded": "false",
        "aria-selected": "false",
        tabIndex: -1
      })
      .blur();
    toShow.prev()
      .attr({
        "aria-expanded": "true",
        "aria-selected": "true",
        tabIndex: 0
      })
      .focus();
  },

  _completed: function( cancel ) {
    this.running = cancel ? 0 : --this.running;
    if ( this.running ) {
      return;
    }

    if ( this.options.clearStyle ) {
      this.toShow.add( this.toHide ).css({
        height: "",
        overflow: ""
      });
    }

    // other classes are removed before the animation; this one needs to stay until completed
    this.toHide.removeClass( "ui-accordion-content-active" );
    // Work around for rendering bug in IE (#5421)
    if ( this.toHide.length ) {
      this.toHide.parent()[0].className = this.toHide.parent()[0].className;
    }

    this._trigger( "change", null, this.data );
  }
});

$.extend( $.ui.accordion, {
  version: "1.8.12",
  animations: {
    slide: function( options, additions ) {
      options = $.extend({
        easing: "swing",
        duration: 300
      }, options, additions );
      if ( !options.toHide.size() ) {
        options.toShow.animate({
          height: "show",
          paddingTop: "show",
          paddingBottom: "show"
        }, options );
        return;
      }
      if ( !options.toShow.size() ) {
        options.toHide.animate({
          height: "hide",
          paddingTop: "hide",
          paddingBottom: "hide"
        }, options );
        return;
      }
      var overflow = options.toShow.css( "overflow" ),
        percentDone = 0,
        showProps = {},
        hideProps = {},
        fxAttrs = [ "height", "paddingTop", "paddingBottom" ],
        originalWidth;
      // fix width before calculating height of hidden element
      var s = options.toShow;
      originalWidth = s[0].style.width;
      s.width( parseInt( s.parent().width(), 10 )
        - parseInt( s.css( "paddingLeft" ), 10 )
        - parseInt( s.css( "paddingRight" ), 10 )
        - ( parseInt( s.css( "borderLeftWidth" ), 10 ) || 0 )
        - ( parseInt( s.css( "borderRightWidth" ), 10) || 0 ) );

      $.each( fxAttrs, function( i, prop ) {
        hideProps[ prop ] = "hide";

        var parts = ( "" + $.css( options.toShow[0], prop ) ).match( /^([\d+-.]+)(.*)$/ );
        showProps[ prop ] = {
          value: parts[ 1 ],
          unit: parts[ 2 ] || "px"
        };
      });
      options.toShow.css({ height: 0, overflow: "hidden" }).show();
      options.toHide
        .filter( ":hidden" )
          .each( options.complete )
        .end()
        .filter( ":visible" )
        .animate( hideProps, {
        step: function( now, settings ) {
          // only calculate the percent when animating height
          // IE gets very inconsistent results when animating elements
          // with small values, which is common for padding
          if ( settings.prop == "height" ) {
            percentDone = ( settings.end - settings.start === 0 ) ? 0 :
              ( settings.now - settings.start ) / ( settings.end - settings.start );
          }

          options.toShow[ 0 ].style[ settings.prop ] =
            ( percentDone * showProps[ settings.prop ].value )
            + showProps[ settings.prop ].unit;
        },
        duration: options.duration,
        easing: options.easing,
        complete: function() {
          if ( !options.autoHeight ) {
            options.toShow.css( "height", "" );
          }
          options.toShow.css({
            width: originalWidth,
            overflow: overflow
          });
          options.complete();
        }
      });
    },
    bounceslide: function( options ) {
      this.slide( options, {
        easing: options.down ? "easeOutBounce" : "swing",
        duration: options.down ? 1000 : 200
      });
    }
  }
});

})( jQuery );
/*
 * jQuery UI Autocomplete 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Autocomplete
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.ui.position.js
 */
(function( $, undefined ) {

// used to prevent race conditions with remote data sources
var requestIndex = 0;

$.widget( "ui.autocomplete", {
  options: {
    appendTo: "body",
    autoFocus: false,
    delay: 300,
    minLength: 1,
    position: {
      my: "left top",
      at: "left bottom",
      collision: "none"
    },
    source: null
  },

  pending: 0,

  _create: function() {
    var self = this,
      doc = this.element[ 0 ].ownerDocument,
      suppressKeyPress;

    this.element
      .addClass( "ui-autocomplete-input" )
      .attr( "autocomplete", "off" )
      // TODO verify these actually work as intended
      .attr({
        role: "textbox",
        "aria-autocomplete": "list",
        "aria-haspopup": "true"
      })
      .bind( "keydown.autocomplete", function( event ) {
        if ( self.options.disabled || self.element.attr( "readonly" ) ) {
          return;
        }

        suppressKeyPress = false;
        var keyCode = $.ui.keyCode;
        switch( event.keyCode ) {
        case keyCode.PAGE_UP:
          self._move( "previousPage", event );
          break;
        case keyCode.PAGE_DOWN:
          self._move( "nextPage", event );
          break;
        case keyCode.UP:
          self._move( "previous", event );
          // prevent moving cursor to beginning of text field in some browsers
          event.preventDefault();
          break;
        case keyCode.DOWN:
          self._move( "next", event );
          // prevent moving cursor to end of text field in some browsers
          event.preventDefault();
          break;
        case keyCode.ENTER:
        case keyCode.NUMPAD_ENTER:
          // when menu is open and has focus
          if ( self.menu.active ) {
            // #6055 - Opera still allows the keypress to occur
            // which causes forms to submit
            suppressKeyPress = true;
            event.preventDefault();
          }
          //passthrough - ENTER and TAB both select the current element
        case keyCode.TAB:
          if ( !self.menu.active ) {
            return;
          }
          self.menu.select( event );
          break;
        case keyCode.ESCAPE:
          self.element.val( self.term );
          self.close( event );
          break;
        default:
          // keypress is triggered before the input value is changed
          clearTimeout( self.searching );
          self.searching = setTimeout(function() {
            // only search if the value has changed
            if ( self.term != self.element.val() ) {
              self.selectedItem = null;
              self.search( null, event );
            }
          }, self.options.delay );
          break;
        }
      })
      .bind( "keypress.autocomplete", function( event ) {
        if ( suppressKeyPress ) {
          suppressKeyPress = false;
          event.preventDefault();
        }
      })
      .bind( "focus.autocomplete", function() {
        if ( self.options.disabled ) {
          return;
        }

        self.selectedItem = null;
        self.previous = self.element.val();
      })
      .bind( "blur.autocomplete", function( event ) {
        if ( self.options.disabled ) {
          return;
        }

        clearTimeout( self.searching );
        // clicks on the menu (or a button to trigger a search) will cause a blur event
        self.closing = setTimeout(function() {
          self.close( event );
          self._change( event );
        }, 150 );
      });
    this._initSource();
    this.response = function() {
      return self._response.apply( self, arguments );
    };
    this.menu = $( "<ul></ul>" )
      .addClass( "ui-autocomplete" )
      .appendTo( $( this.options.appendTo || "body", doc )[0] )
      // prevent the close-on-blur in case of a "slow" click on the menu (long mousedown)
      .mousedown(function( event ) {
        // clicking on the scrollbar causes focus to shift to the body
        // but we can't detect a mouseup or a click immediately afterward
        // so we have to track the next mousedown and close the menu if
        // the user clicks somewhere outside of the autocomplete
        var menuElement = self.menu.element[ 0 ];
        if ( !$( event.target ).closest( ".ui-menu-item" ).length ) {
          setTimeout(function() {
            $( document ).one( 'mousedown', function( event ) {
              if ( event.target !== self.element[ 0 ] &&
                event.target !== menuElement &&
                !$.ui.contains( menuElement, event.target ) ) {
                self.close();
              }
            });
          }, 1 );
        }

        // use another timeout to make sure the blur-event-handler on the input was already triggered
        setTimeout(function() {
          clearTimeout( self.closing );
        }, 13);
      })
      .menu({
        focus: function( event, ui ) {
          var item = ui.item.data( "item.autocomplete" );
          if ( false !== self._trigger( "focus", event, { item: item } ) ) {
            // use value to match what will end up in the input, if it was a key event
            if ( /^key/.test(event.originalEvent.type) ) {
              self.element.val( item.value );
            }
          }
        },
        selected: function( event, ui ) {
          var item = ui.item.data( "item.autocomplete" ),
            previous = self.previous;

          // only trigger when focus was lost (click on menu)
          if ( self.element[0] !== doc.activeElement ) {
            self.element.focus();
            self.previous = previous;
            // #6109 - IE triggers two focus events and the second
            // is asynchronous, so we need to reset the previous
            // term synchronously and asynchronously :-(
            setTimeout(function() {
              self.previous = previous;
              self.selectedItem = item;
            }, 1);
          }

          if ( false !== self._trigger( "select", event, { item: item } ) ) {
            self.element.val( item.value );
          }
          // reset the term after the select event
          // this allows custom select handling to work properly
          self.term = self.element.val();

          self.close( event );
          self.selectedItem = item;
        },
        blur: function( event, ui ) {
          // don't set the value of the text field if it's already correct
          // this prevents moving the cursor unnecessarily
          if ( self.menu.element.is(":visible") &&
            ( self.element.val() !== self.term ) ) {
            self.element.val( self.term );
          }
        }
      })
      .zIndex( this.element.zIndex() + 1 )
      // workaround for jQuery bug #5781 http://dev.jquery.com/ticket/5781
      .css({ top: 0, left: 0 })
      .hide()
      .data( "menu" );
    if ( $.fn.bgiframe ) {
       this.menu.element.bgiframe();
    }
  },

  destroy: function() {
    this.element
      .removeClass( "ui-autocomplete-input" )
      .removeAttr( "autocomplete" )
      .removeAttr( "role" )
      .removeAttr( "aria-autocomplete" )
      .removeAttr( "aria-haspopup" );
    this.menu.element.remove();
    $.Widget.prototype.destroy.call( this );
  },

  _setOption: function( key, value ) {
    $.Widget.prototype._setOption.apply( this, arguments );
    if ( key === "source" ) {
      this._initSource();
    }
    if ( key === "appendTo" ) {
      this.menu.element.appendTo( $( value || "body", this.element[0].ownerDocument )[0] )
    }
    if ( key === "disabled" && value && this.xhr ) {
      this.xhr.abort();
    }
  },

  _initSource: function() {
    var self = this,
      array,
      url;
    if ( $.isArray(this.options.source) ) {
      array = this.options.source;
      this.source = function( request, response ) {
        response( $.ui.autocomplete.filter(array, request.term) );
      };
    } else if ( typeof this.options.source === "string" ) {
      url = this.options.source;
      this.source = function( request, response ) {
        if ( self.xhr ) {
          self.xhr.abort();
        }
        self.xhr = $.ajax({
          url: url,
          data: request,
          dataType: "json",
          autocompleteRequest: ++requestIndex,
          success: function( data, status ) {
            if ( this.autocompleteRequest === requestIndex ) {
              response( data );
            }
          },
          error: function() {
            if ( this.autocompleteRequest === requestIndex ) {
              response( [] );
            }
          }
        });
      };
    } else {
      this.source = this.options.source;
    }
  },

  search: function( value, event ) {
    value = value != null ? value : this.element.val();

    // always save the actual value, not the one passed as an argument
    this.term = this.element.val();

    if ( value.length < this.options.minLength ) {
      return this.close( event );
    }

    clearTimeout( this.closing );
    if ( this._trigger( "search", event ) === false ) {
      return;
    }

    return this._search( value );
  },

  _search: function( value ) {
    this.pending++;
    this.element.addClass( "ui-autocomplete-loading" );

    this.source( { term: value }, this.response );
  },

  _response: function( content ) {
    if ( !this.options.disabled && content && content.length ) {
      content = this._normalize( content );
      this._suggest( content );
      this._trigger( "open" );
    } else {
      this.close();
    }
    this.pending--;
    if ( !this.pending ) {
      this.element.removeClass( "ui-autocomplete-loading" );
    }
  },

  close: function( event ) {
    clearTimeout( this.closing );
    if ( this.menu.element.is(":visible") ) {
      this.menu.element.hide();
      this.menu.deactivate();
      this._trigger( "close", event );
    }
  },
  
  _change: function( event ) {
    if ( this.previous !== this.element.val() ) {
      this._trigger( "change", event, { item: this.selectedItem } );
    }
  },

  _normalize: function( items ) {
    // assume all items have the right format when the first item is complete
    if ( items.length && items[0].label && items[0].value ) {
      return items;
    }
    return $.map( items, function(item) {
      if ( typeof item === "string" ) {
        return {
          label: item,
          value: item
        };
      }
      return $.extend({
        label: item.label || item.value,
        value: item.value || item.label
      }, item );
    });
  },

  _suggest: function( items ) {
    var ul = this.menu.element
      .empty()
      .zIndex( this.element.zIndex() + 1 );
    this._renderMenu( ul, items );
    // TODO refresh should check if the active item is still in the dom, removing the need for a manual deactivate
    this.menu.deactivate();
    this.menu.refresh();

    // size and position menu
    ul.show();
    this._resizeMenu();
    ul.position( $.extend({
      of: this.element
    }, this.options.position ));

    if ( this.options.autoFocus ) {
      this.menu.next( new $.Event("mouseover") );
    }
  },

  _resizeMenu: function() {
    var ul = this.menu.element;
    ul.outerWidth( Math.max(
      ul.width( "" ).outerWidth(),
      this.element.outerWidth()
    ) );
  },

  _renderMenu: function( ul, items ) {
    var self = this;
    $.each( items, function( index, item ) {
      self._renderItem( ul, item );
    });
  },

  _renderItem: function( ul, item) {
    return $( "<li></li>" )
      .data( "item.autocomplete", item )
      .append( $( "<a></a>" ).text( item.label ) )
      .appendTo( ul );
  },


  _move: function( direction, event ) {
    if ( !this.menu.element.is(":visible") ) {
      this.search( null, event );
      return;
    }
    if ( this.menu.first() && /^previous/.test(direction) ||
        this.menu.last() && /^next/.test(direction) ) {
      this.element.val( this.term );
      this.menu.deactivate();
      return;
    }
    this.menu[ direction ]( event );
  },

  widget: function() {
    return this.menu.element;
  }
});

$.extend( $.ui.autocomplete, {
  escapeRegex: function( value ) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  },
  filter: function(array, term) {
    var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
    return $.grep( array, function(value) {
      return matcher.test( value.label || value.value || value );
    });
  }
});

}( jQuery ));

/*
 * jQuery UI Menu (not officially released)
 * 
 * This widget isn't yet finished and the API is subject to change. We plan to finish
 * it for the next release. You're welcome to give it a try anyway and give us feedback,
 * as long as you're okay with migrating your code later on. We can help with that, too.
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Menu
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 */
(function($) {

$.widget("ui.menu", {
  _create: function() {
    var self = this;
    this.element
      .addClass("ui-menu ui-widget ui-widget-content ui-corner-all")
      .attr({
        role: "listbox",
        "aria-activedescendant": "ui-active-menuitem"
      })
      .click(function( event ) {
        if ( !$( event.target ).closest( ".ui-menu-item a" ).length ) {
          return;
        }
        // temporary
        event.preventDefault();
        self.select( event );
      });
    this.refresh();
  },
  
  refresh: function() {
    var self = this;

    // don't refresh list items that are already adapted
    var items = this.element.children("li:not(.ui-menu-item):has(a)")
      .addClass("ui-menu-item")
      .attr("role", "menuitem");
    
    items.children("a")
      .addClass("ui-corner-all")
      .attr("tabindex", -1)
      // mouseenter doesn't work with event delegation
      .mouseenter(function( event ) {
        self.activate( event, $(this).parent() );
      })
      .mouseleave(function() {
        self.deactivate();
      });
  },

  activate: function( event, item ) {
    this.deactivate();
    if (this.hasScroll()) {
      var offset = item.offset().top - this.element.offset().top,
        scroll = this.element.attr("scrollTop"),
        elementHeight = this.element.height();
      if (offset < 0) {
        this.element.attr("scrollTop", scroll + offset);
      } else if (offset >= elementHeight) {
        this.element.attr("scrollTop", scroll + offset - elementHeight + item.height());
      }
    }
    this.active = item.eq(0)
      .children("a")
        .addClass("ui-state-hover")
        .attr("id", "ui-active-menuitem")
      .end();
    this._trigger("focus", event, { item: item });
  },

  deactivate: function() {
    if (!this.active) { return; }

    this.active.children("a")
      .removeClass("ui-state-hover")
      .removeAttr("id");
    this._trigger("blur");
    this.active = null;
  },

  next: function(event) {
    this.move("next", ".ui-menu-item:first", event);
  },

  previous: function(event) {
    this.move("prev", ".ui-menu-item:last", event);
  },

  first: function() {
    return this.active && !this.active.prevAll(".ui-menu-item").length;
  },

  last: function() {
    return this.active && !this.active.nextAll(".ui-menu-item").length;
  },

  move: function(direction, edge, event) {
    if (!this.active) {
      this.activate(event, this.element.children(edge));
      return;
    }
    var next = this.active[direction + "All"](".ui-menu-item").eq(0);
    if (next.length) {
      this.activate(event, next);
    } else {
      this.activate(event, this.element.children(edge));
    }
  },

  // TODO merge with previousPage
  nextPage: function(event) {
    if (this.hasScroll()) {
      // TODO merge with no-scroll-else
      if (!this.active || this.last()) {
        this.activate(event, this.element.children(".ui-menu-item:first"));
        return;
      }
      var base = this.active.offset().top,
        height = this.element.height(),
        result = this.element.children(".ui-menu-item").filter(function() {
          var close = $(this).offset().top - base - height + $(this).height();
          // TODO improve approximation
          return close < 10 && close > -10;
        });

      // TODO try to catch this earlier when scrollTop indicates the last page anyway
      if (!result.length) {
        result = this.element.children(".ui-menu-item:last");
      }
      this.activate(event, result);
    } else {
      this.activate(event, this.element.children(".ui-menu-item")
        .filter(!this.active || this.last() ? ":first" : ":last"));
    }
  },

  // TODO merge with nextPage
  previousPage: function(event) {
    if (this.hasScroll()) {
      // TODO merge with no-scroll-else
      if (!this.active || this.first()) {
        this.activate(event, this.element.children(".ui-menu-item:last"));
        return;
      }

      var base = this.active.offset().top,
        height = this.element.height();
        result = this.element.children(".ui-menu-item").filter(function() {
          var close = $(this).offset().top - base + height - $(this).height();
          // TODO improve approximation
          return close < 10 && close > -10;
        });

      // TODO try to catch this earlier when scrollTop indicates the last page anyway
      if (!result.length) {
        result = this.element.children(".ui-menu-item:first");
      }
      this.activate(event, result);
    } else {
      this.activate(event, this.element.children(".ui-menu-item")
        .filter(!this.active || this.first() ? ":last" : ":first"));
    }
  },

  hasScroll: function() {
    return this.element.height() < this.element.attr("scrollHeight");
  },

  select: function( event ) {
    this._trigger("selected", event, { item: this.active });
  }
});

}(jQuery));
/*
 * jQuery UI Button 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Button
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 */
(function( $, undefined ) {

var lastActive,
  baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
  stateClasses = "ui-state-hover ui-state-active ",
  typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
  formResetHandler = function( event ) {
    $( ":ui-button", event.target.form ).each(function() {
      var inst = $( this ).data( "button" );
      setTimeout(function() {
        inst.refresh();
      }, 1 );
    });
  },
  radioGroup = function( radio ) {
    var name = radio.name,
      form = radio.form,
      radios = $( [] );
    if ( name ) {
      if ( form ) {
        radios = $( form ).find( "[name='" + name + "']" );
      } else {
        radios = $( "[name='" + name + "']", radio.ownerDocument )
          .filter(function() {
            return !this.form;
          });
      }
    }
    return radios;
  };

$.widget( "ui.button", {
  options: {
    disabled: null,
    text: true,
    label: null,
    icons: {
      primary: null,
      secondary: null
    }
  },
  _create: function() {
    this.element.closest( "form" )
      .unbind( "reset.button" )
      .bind( "reset.button", formResetHandler );

    if ( typeof this.options.disabled !== "boolean" ) {
      this.options.disabled = this.element.attr( "disabled" );
    }

    this._determineButtonType();
    this.hasTitle = !!this.buttonElement.attr( "title" );

    var self = this,
      options = this.options,
      toggleButton = this.type === "checkbox" || this.type === "radio",
      hoverClass = "ui-state-hover" + ( !toggleButton ? " ui-state-active" : "" ),
      focusClass = "ui-state-focus";

    if ( options.label === null ) {
      options.label = this.buttonElement.html();
    }

    if ( this.element.is( ":disabled" ) ) {
      options.disabled = true;
    }

    this.buttonElement
      .addClass( baseClasses )
      .attr( "role", "button" )
      .bind( "mouseenter.button", function() {
        if ( options.disabled ) {
          return;
        }
        $( this ).addClass( "ui-state-hover" );
        if ( this === lastActive ) {
          $( this ).addClass( "ui-state-active" );
        }
      })
      .bind( "mouseleave.button", function() {
        if ( options.disabled ) {
          return;
        }
        $( this ).removeClass( hoverClass );
      })
      .bind( "focus.button", function() {
        // no need to check disabled, focus won't be triggered anyway
        $( this ).addClass( focusClass );
      })
      .bind( "blur.button", function() {
        $( this ).removeClass( focusClass );
      });

    if ( toggleButton ) {
      this.element.bind( "change.button", function() {
        self.refresh();
      });
    }

    if ( this.type === "checkbox" ) {
      this.buttonElement.bind( "click.button", function() {
        if ( options.disabled ) {
          return false;
        }
        $( this ).toggleClass( "ui-state-active" );
        self.buttonElement.attr( "aria-pressed", self.element[0].checked );
      });
    } else if ( this.type === "radio" ) {
      this.buttonElement.bind( "click.button", function() {
        if ( options.disabled ) {
          return false;
        }
        $( this ).addClass( "ui-state-active" );
        self.buttonElement.attr( "aria-pressed", true );

        var radio = self.element[ 0 ];
        radioGroup( radio )
          .not( radio )
          .map(function() {
            return $( this ).button( "widget" )[ 0 ];
          })
          .removeClass( "ui-state-active" )
          .attr( "aria-pressed", false );
      });
    } else {
      this.buttonElement
        .bind( "mousedown.button", function() {
          if ( options.disabled ) {
            return false;
          }
          $( this ).addClass( "ui-state-active" );
          lastActive = this;
          $( document ).one( "mouseup", function() {
            lastActive = null;
          });
        })
        .bind( "mouseup.button", function() {
          if ( options.disabled ) {
            return false;
          }
          $( this ).removeClass( "ui-state-active" );
        })
        .bind( "keydown.button", function(event) {
          if ( options.disabled ) {
            return false;
          }
          if ( event.keyCode == $.ui.keyCode.SPACE || event.keyCode == $.ui.keyCode.ENTER ) {
            $( this ).addClass( "ui-state-active" );
          }
        })
        .bind( "keyup.button", function() {
          $( this ).removeClass( "ui-state-active" );
        });

      if ( this.buttonElement.is("a") ) {
        this.buttonElement.keyup(function(event) {
          if ( event.keyCode === $.ui.keyCode.SPACE ) {
            // TODO pass through original event correctly (just as 2nd argument doesn't work)
            $( this ).click();
          }
        });
      }
    }

    // TODO: pull out $.Widget's handling for the disabled option into
    // $.Widget.prototype._setOptionDisabled so it's easy to proxy and can
    // be overridden by individual plugins
    this._setOption( "disabled", options.disabled );
  },

  _determineButtonType: function() {

    if ( this.element.is(":checkbox") ) {
      this.type = "checkbox";
    } else if ( this.element.is(":radio") ) {
      this.type = "radio";
    } else if ( this.element.is("input") ) {
      this.type = "input";
    } else {
      this.type = "button";
    }

    if ( this.type === "checkbox" || this.type === "radio" ) {
      // we don't search against the document in case the element
      // is disconnected from the DOM
      var ancestor = this.element.parents().filter(":last"),
        labelSelector = "label[for=" + this.element.attr("id") + "]";
      this.buttonElement = ancestor.find( labelSelector );
      if ( !this.buttonElement.length ) {
        ancestor = ancestor.length ? ancestor.siblings() : this.element.siblings();
        this.buttonElement = ancestor.filter( labelSelector );
        if ( !this.buttonElement.length ) {
          this.buttonElement = ancestor.find( labelSelector );
        }
      }
      this.element.addClass( "ui-helper-hidden-accessible" );

      var checked = this.element.is( ":checked" );
      if ( checked ) {
        this.buttonElement.addClass( "ui-state-active" );
      }
      this.buttonElement.attr( "aria-pressed", checked );
    } else {
      this.buttonElement = this.element;
    }
  },

  widget: function() {
    return this.buttonElement;
  },

  destroy: function() {
    this.element
      .removeClass( "ui-helper-hidden-accessible" );
    this.buttonElement
      .removeClass( baseClasses + " " + stateClasses + " " + typeClasses )
      .removeAttr( "role" )
      .removeAttr( "aria-pressed" )
      .html( this.buttonElement.find(".ui-button-text").html() );

    if ( !this.hasTitle ) {
      this.buttonElement.removeAttr( "title" );
    }

    $.Widget.prototype.destroy.call( this );
  },

  _setOption: function( key, value ) {
    $.Widget.prototype._setOption.apply( this, arguments );
    if ( key === "disabled" ) {
      if ( value ) {
        this.element.attr( "disabled", true );
      } else {
        this.element.removeAttr( "disabled" );
      }
    }
    this._resetButton();
  },

  refresh: function() {
    var isDisabled = this.element.is( ":disabled" );
    if ( isDisabled !== this.options.disabled ) {
      this._setOption( "disabled", isDisabled );
    }
    if ( this.type === "radio" ) {
      radioGroup( this.element[0] ).each(function() {
        if ( $( this ).is( ":checked" ) ) {
          $( this ).button( "widget" )
            .addClass( "ui-state-active" )
            .attr( "aria-pressed", true );
        } else {
          $( this ).button( "widget" )
            .removeClass( "ui-state-active" )
            .attr( "aria-pressed", false );
        }
      });
    } else if ( this.type === "checkbox" ) {
      if ( this.element.is( ":checked" ) ) {
        this.buttonElement
          .addClass( "ui-state-active" )
          .attr( "aria-pressed", true );
      } else {
        this.buttonElement
          .removeClass( "ui-state-active" )
          .attr( "aria-pressed", false );
      }
    }
  },

  _resetButton: function() {
    if ( this.type === "input" ) {
      if ( this.options.label ) {
        this.element.val( this.options.label );
      }
      return;
    }
    var buttonElement = this.buttonElement.removeClass( typeClasses ),
      buttonText = $( "<span></span>" )
        .addClass( "ui-button-text" )
        .html( this.options.label )
        .appendTo( buttonElement.empty() )
        .text(),
      icons = this.options.icons,
      multipleIcons = icons.primary && icons.secondary,
      buttonClasses = [];  

    if ( icons.primary || icons.secondary ) {
      if ( this.options.text ) {
        buttonClasses.push( "ui-button-text-icon" + ( multipleIcons ? "s" : ( icons.primary ? "-primary" : "-secondary" ) ) );
      }

      if ( icons.primary ) {
        buttonElement.prepend( "<span class='ui-button-icon-primary ui-icon " + icons.primary + "'></span>" );
      }

      if ( icons.secondary ) {
        buttonElement.append( "<span class='ui-button-icon-secondary ui-icon " + icons.secondary + "'></span>" );
      }

      if ( !this.options.text ) {
        buttonClasses.push( multipleIcons ? "ui-button-icons-only" : "ui-button-icon-only" );

        if ( !this.hasTitle ) {
          buttonElement.attr( "title", buttonText );
        }
      }
    } else {
      buttonClasses.push( "ui-button-text-only" );
    }
    buttonElement.addClass( buttonClasses.join( " " ) );
  }
});

$.widget( "ui.buttonset", {
  options: {
    items: ":button, :submit, :reset, :checkbox, :radio, a, :data(button)"
  },

  _create: function() {
    this.element.addClass( "ui-buttonset" );
  },
  
  _init: function() {
    this.refresh();
  },

  _setOption: function( key, value ) {
    if ( key === "disabled" ) {
      this.buttons.button( "option", key, value );
    }

    $.Widget.prototype._setOption.apply( this, arguments );
  },
  
  refresh: function() {
    this.buttons = this.element.find( this.options.items )
      .filter( ":ui-button" )
        .button( "refresh" )
      .end()
      .not( ":ui-button" )
        .button()
      .end()
      .map(function() {
        return $( this ).button( "widget" )[ 0 ];
      })
        .removeClass( "ui-corner-all ui-corner-left ui-corner-right" )
        .filter( ":first" )
          .addClass( "ui-corner-left" )
        .end()
        .filter( ":last" )
          .addClass( "ui-corner-right" )
        .end()
      .end();
  },

  destroy: function() {
    this.element.removeClass( "ui-buttonset" );
    this.buttons
      .map(function() {
        return $( this ).button( "widget" )[ 0 ];
      })
        .removeClass( "ui-corner-left ui-corner-right" )
      .end()
      .button( "destroy" );

    $.Widget.prototype.destroy.call( this );
  }
});

}( jQuery ) );
/*
 * jQuery UI Datepicker 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Datepicker
 *
 * Depends:
 *  jquery.ui.core.js
 */
(function( $, undefined ) {

$.extend($.ui, { datepicker: { version: "1.8.12" } });

var PROP_NAME = 'datepicker';
var dpuuid = new Date().getTime();

/* Date picker manager.
   Use the singleton instance of this class, $.datepicker, to interact with the date picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

function Datepicker() {
  this.debug = false; // Change this to true to start debugging
  this._curInst = null; // The current instance in use
  this._keyEvent = false; // If the last event was a key event
  this._disabledInputs = []; // List of date picker inputs that have been disabled
  this._datepickerShowing = false; // True if the popup picker is showing , false if not
  this._inDialog = false; // True if showing within a "dialog", false if not
  this._mainDivId = 'ui-datepicker-div'; // The ID of the main datepicker division
  this._inlineClass = 'ui-datepicker-inline'; // The name of the inline marker class
  this._appendClass = 'ui-datepicker-append'; // The name of the append marker class
  this._triggerClass = 'ui-datepicker-trigger'; // The name of the trigger marker class
  this._dialogClass = 'ui-datepicker-dialog'; // The name of the dialog marker class
  this._disableClass = 'ui-datepicker-disabled'; // The name of the disabled covering marker class
  this._unselectableClass = 'ui-datepicker-unselectable'; // The name of the unselectable cell marker class
  this._currentClass = 'ui-datepicker-current-day'; // The name of the current day marker class
  this._dayOverClass = 'ui-datepicker-days-cell-over'; // The name of the day hover marker class
  this.regional = []; // Available regional settings, indexed by language code
  this.regional[''] = { // Default regional settings
    closeText: 'Done', // Display text for close link
    prevText: 'Prev', // Display text for previous month link
    nextText: 'Next', // Display text for next month link
    currentText: 'Today', // Display text for current month link
    monthNames: ['January','February','March','April','May','June',
      'July','August','September','October','November','December'], // Names of months for drop-down and formatting
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // For formatting
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], // For formatting
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // For formatting
    dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'], // Column headings for days starting at Sunday
    weekHeader: 'Wk', // Column header for week of the year
    dateFormat: 'mm/dd/yy', // See format options on parseDate
    firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
    isRTL: false, // True if right-to-left language, false if left-to-right
    showMonthAfterYear: false, // True if the year select precedes month, false for month then year
    yearSuffix: '' // Additional text to append to the year in the month headers
  };
  this._defaults = { // Global defaults for all the date picker instances
    showOn: 'focus', // 'focus' for popup on focus,
      // 'button' for trigger button, or 'both' for either
    showAnim: 'fadeIn', // Name of jQuery animation for popup
    showOptions: {}, // Options for enhanced animations
    defaultDate: null, // Used when field is blank: actual date,
      // +/-number for offset from today, null for today
    appendText: '', // Display text following the input box, e.g. showing the format
    buttonText: '...', // Text for trigger button
    buttonImage: '', // URL for trigger button image
    buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
    hideIfNoPrevNext: false, // True to hide next/previous month links
      // if not applicable, false to just disable them
    navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
    gotoCurrent: false, // True if today link goes back to current selection instead
    changeMonth: false, // True if month can be selected directly, false if only prev/next
    changeYear: false, // True if year can be selected directly, false if only prev/next
    yearRange: 'c-10:c+10', // Range of years to display in drop-down,
      // either relative to today's year (-nn:+nn), relative to currently displayed year
      // (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
    showOtherMonths: false, // True to show dates in other months, false to leave blank
    selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
    showWeek: false, // True to show week of the year, false to not show it
    calculateWeek: this.iso8601Week, // How to calculate the week of the year,
      // takes a Date and returns the number of the week for it
    shortYearCutoff: '+10', // Short year values < this are in the current century,
      // > this are in the previous century,
      // string value starting with '+' for current year + value
    minDate: null, // The earliest selectable date, or null for no limit
    maxDate: null, // The latest selectable date, or null for no limit
    duration: 'fast', // Duration of display/closure
    beforeShowDay: null, // Function that takes a date and returns an array with
      // [0] = true if selectable, false if not, [1] = custom CSS class name(s) or '',
      // [2] = cell title (optional), e.g. $.datepicker.noWeekends
    beforeShow: null, // Function that takes an input field and
      // returns a set of custom settings for the date picker
    onSelect: null, // Define a callback function when a date is selected
    onChangeMonthYear: null, // Define a callback function when the month or year is changed
    onClose: null, // Define a callback function when the datepicker is closed
    numberOfMonths: 1, // Number of months to show at a time
    showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
    stepMonths: 1, // Number of months to step back/forward
    stepBigMonths: 12, // Number of months to step back/forward for the big links
    altField: '', // Selector for an alternate field to store selected dates into
    altFormat: '', // The date format to use for the alternate field
    constrainInput: true, // The input is constrained by the current date format
    showButtonPanel: false, // True to show button panel, false to not show it
    autoSize: false // True to size the input for the date format, false to leave as is
  };
  $.extend(this._defaults, this.regional['']);
  this.dpDiv = $('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>');
}

$.extend(Datepicker.prototype, {
  /* Class name added to elements to indicate already configured with a date picker. */
  markerClassName: 'hasDatepicker',

  /* Debug logging (if enabled). */
  log: function () {
    if (this.debug)
      console.log.apply('', arguments);
  },
  
  // TODO rename to "widget" when switching to widget factory
  _widgetDatepicker: function() {
    return this.dpDiv;
  },

  /* Override the default settings for all instances of the date picker.
     @param  settings  object - the new settings to use as defaults (anonymous object)
     @return the manager object */
  setDefaults: function(settings) {
    extendRemove(this._defaults, settings || {});
    return this;
  },

  /* Attach the date picker to a jQuery selection.
     @param  target    element - the target input field or division or span
     @param  settings  object - the new settings to use for this date picker instance (anonymous) */
  _attachDatepicker: function(target, settings) {
    // check for settings on the control itself - in namespace 'date:'
    var inlineSettings = null;
    for (var attrName in this._defaults) {
      var attrValue = target.getAttribute('date:' + attrName);
      if (attrValue) {
        inlineSettings = inlineSettings || {};
        try {
          inlineSettings[attrName] = eval(attrValue);
        } catch (err) {
          inlineSettings[attrName] = attrValue;
        }
      }
    }
    var nodeName = target.nodeName.toLowerCase();
    var inline = (nodeName == 'div' || nodeName == 'span');
    if (!target.id) {
      this.uuid += 1;
      target.id = 'dp' + this.uuid;
    }
    var inst = this._newInst($(target), inline);
    inst.settings = $.extend({}, settings || {}, inlineSettings || {});
    if (nodeName == 'input') {
      this._connectDatepicker(target, inst);
    } else if (inline) {
      this._inlineDatepicker(target, inst);
    }
  },

  /* Create a new instance object. */
  _newInst: function(target, inline) {
    var id = target[0].id.replace(/([^A-Za-z0-9_-])/g, '\\\\$1'); // escape jQuery meta chars
    return {id: id, input: target, // associated target
      selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
      drawMonth: 0, drawYear: 0, // month being drawn
      inline: inline, // is datepicker inline or not
      dpDiv: (!inline ? this.dpDiv : // presentation div
      $('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))};
  },

  /* Attach the date picker to an input field. */
  _connectDatepicker: function(target, inst) {
    var input = $(target);
    inst.append = $([]);
    inst.trigger = $([]);
    if (input.hasClass(this.markerClassName))
      return;
    this._attachments(input, inst);
    input.addClass(this.markerClassName).keydown(this._doKeyDown).
      keypress(this._doKeyPress).keyup(this._doKeyUp).
      bind("setData.datepicker", function(event, key, value) {
        inst.settings[key] = value;
      }).bind("getData.datepicker", function(event, key) {
        return this._get(inst, key);
      });
    this._autoSize(inst);
    $.data(target, PROP_NAME, inst);
  },

  /* Make attachments based on settings. */
  _attachments: function(input, inst) {
    var appendText = this._get(inst, 'appendText');
    var isRTL = this._get(inst, 'isRTL');
    if (inst.append)
      inst.append.remove();
    if (appendText) {
      inst.append = $('<span class="' + this._appendClass + '">' + appendText + '</span>');
      input[isRTL ? 'before' : 'after'](inst.append);
    }
    input.unbind('focus', this._showDatepicker);
    if (inst.trigger)
      inst.trigger.remove();
    var showOn = this._get(inst, 'showOn');
    if (showOn == 'focus' || showOn == 'both') // pop-up date picker when in the marked field
      input.focus(this._showDatepicker);
    if (showOn == 'button' || showOn == 'both') { // pop-up date picker when button clicked
      var buttonText = this._get(inst, 'buttonText');
      var buttonImage = this._get(inst, 'buttonImage');
      inst.trigger = $(this._get(inst, 'buttonImageOnly') ?
        $('<img/>').addClass(this._triggerClass).
          attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
        $('<button type="button"></button>').addClass(this._triggerClass).
          html(buttonImage == '' ? buttonText : $('<img/>').attr(
          { src:buttonImage, alt:buttonText, title:buttonText })));
      input[isRTL ? 'before' : 'after'](inst.trigger);
      inst.trigger.click(function() {
        if ($.datepicker._datepickerShowing && $.datepicker._lastInput == input[0])
          $.datepicker._hideDatepicker();
        else
          $.datepicker._showDatepicker(input[0]);
        return false;
      });
    }
  },

  /* Apply the maximum length for the date format. */
  _autoSize: function(inst) {
    if (this._get(inst, 'autoSize') && !inst.inline) {
      var date = new Date(2009, 12 - 1, 20); // Ensure double digits
      var dateFormat = this._get(inst, 'dateFormat');
      if (dateFormat.match(/[DM]/)) {
        var findMax = function(names) {
          var max = 0;
          var maxI = 0;
          for (var i = 0; i < names.length; i++) {
            if (names[i].length > max) {
              max = names[i].length;
              maxI = i;
            }
          }
          return maxI;
        };
        date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
          'monthNames' : 'monthNamesShort'))));
        date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
          'dayNames' : 'dayNamesShort'))) + 20 - date.getDay());
      }
      inst.input.attr('size', this._formatDate(inst, date).length);
    }
  },

  /* Attach an inline date picker to a div. */
  _inlineDatepicker: function(target, inst) {
    var divSpan = $(target);
    if (divSpan.hasClass(this.markerClassName))
      return;
    divSpan.addClass(this.markerClassName).append(inst.dpDiv).
      bind("setData.datepicker", function(event, key, value){
        inst.settings[key] = value;
      }).bind("getData.datepicker", function(event, key){
        return this._get(inst, key);
      });
    $.data(target, PROP_NAME, inst);
    this._setDate(inst, this._getDefaultDate(inst), true);
    this._updateDatepicker(inst);
    this._updateAlternate(inst);
    inst.dpDiv.show();
  },

  /* Pop-up the date picker in a "dialog" box.
     @param  input     element - ignored
     @param  date      string or Date - the initial date to display
     @param  onSelect  function - the function to call when a date is selected
     @param  settings  object - update the dialog date picker instance's settings (anonymous object)
     @param  pos       int[2] - coordinates for the dialog's position within the screen or
                       event - with x/y coordinates or
                       leave empty for default (screen centre)
     @return the manager object */
  _dialogDatepicker: function(input, date, onSelect, settings, pos) {
    var inst = this._dialogInst; // internal instance
    if (!inst) {
      this.uuid += 1;
      var id = 'dp' + this.uuid;
      this._dialogInput = $('<input type="text" id="' + id +
        '" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>');
      this._dialogInput.keydown(this._doKeyDown);
      $('body').append(this._dialogInput);
      inst = this._dialogInst = this._newInst(this._dialogInput, false);
      inst.settings = {};
      $.data(this._dialogInput[0], PROP_NAME, inst);
    }
    extendRemove(inst.settings, settings || {});
    date = (date && date.constructor == Date ? this._formatDate(inst, date) : date);
    this._dialogInput.val(date);

    this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
    if (!this._pos) {
      var browserWidth = document.documentElement.clientWidth;
      var browserHeight = document.documentElement.clientHeight;
      var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
      var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
      this._pos = // should use actual width/height below
        [(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
    }

    // move input on screen for focus, but hidden behind dialog
    this._dialogInput.css('left', (this._pos[0] + 20) + 'px').css('top', this._pos[1] + 'px');
    inst.settings.onSelect = onSelect;
    this._inDialog = true;
    this.dpDiv.addClass(this._dialogClass);
    this._showDatepicker(this._dialogInput[0]);
    if ($.blockUI)
      $.blockUI(this.dpDiv);
    $.data(this._dialogInput[0], PROP_NAME, inst);
    return this;
  },

  /* Detach a datepicker from its control.
     @param  target    element - the target input field or division or span */
  _destroyDatepicker: function(target) {
    var $target = $(target);
    var inst = $.data(target, PROP_NAME);
    if (!$target.hasClass(this.markerClassName)) {
      return;
    }
    var nodeName = target.nodeName.toLowerCase();
    $.removeData(target, PROP_NAME);
    if (nodeName == 'input') {
      inst.append.remove();
      inst.trigger.remove();
      $target.removeClass(this.markerClassName).
        unbind('focus', this._showDatepicker).
        unbind('keydown', this._doKeyDown).
        unbind('keypress', this._doKeyPress).
        unbind('keyup', this._doKeyUp);
    } else if (nodeName == 'div' || nodeName == 'span')
      $target.removeClass(this.markerClassName).empty();
  },

  /* Enable the date picker to a jQuery selection.
     @param  target    element - the target input field or division or span */
  _enableDatepicker: function(target) {
    var $target = $(target);
    var inst = $.data(target, PROP_NAME);
    if (!$target.hasClass(this.markerClassName)) {
      return;
    }
    var nodeName = target.nodeName.toLowerCase();
    if (nodeName == 'input') {
      target.disabled = false;
      inst.trigger.filter('button').
        each(function() { this.disabled = false; }).end().
        filter('img').css({opacity: '1.0', cursor: ''});
    }
    else if (nodeName == 'div' || nodeName == 'span') {
      var inline = $target.children('.' + this._inlineClass);
      inline.children().removeClass('ui-state-disabled');
    }
    this._disabledInputs = $.map(this._disabledInputs,
      function(value) { return (value == target ? null : value); }); // delete entry
  },

  /* Disable the date picker to a jQuery selection.
     @param  target    element - the target input field or division or span */
  _disableDatepicker: function(target) {
    var $target = $(target);
    var inst = $.data(target, PROP_NAME);
    if (!$target.hasClass(this.markerClassName)) {
      return;
    }
    var nodeName = target.nodeName.toLowerCase();
    if (nodeName == 'input') {
      target.disabled = true;
      inst.trigger.filter('button').
        each(function() { this.disabled = true; }).end().
        filter('img').css({opacity: '0.5', cursor: 'default'});
    }
    else if (nodeName == 'div' || nodeName == 'span') {
      var inline = $target.children('.' + this._inlineClass);
      inline.children().addClass('ui-state-disabled');
    }
    this._disabledInputs = $.map(this._disabledInputs,
      function(value) { return (value == target ? null : value); }); // delete entry
    this._disabledInputs[this._disabledInputs.length] = target;
  },

  /* Is the first field in a jQuery collection disabled as a datepicker?
     @param  target    element - the target input field or division or span
     @return boolean - true if disabled, false if enabled */
  _isDisabledDatepicker: function(target) {
    if (!target) {
      return false;
    }
    for (var i = 0; i < this._disabledInputs.length; i++) {
      if (this._disabledInputs[i] == target)
        return true;
    }
    return false;
  },

  /* Retrieve the instance data for the target control.
     @param  target  element - the target input field or division or span
     @return  object - the associated instance data
     @throws  error if a jQuery problem getting data */
  _getInst: function(target) {
    try {
      return $.data(target, PROP_NAME);
    }
    catch (err) {
      throw 'Missing instance data for this datepicker';
    }
  },

  /* Update or retrieve the settings for a date picker attached to an input field or division.
     @param  target  element - the target input field or division or span
     @param  name    object - the new settings to update or
                     string - the name of the setting to change or retrieve,
                     when retrieving also 'all' for all instance settings or
                     'defaults' for all global defaults
     @param  value   any - the new value for the setting
                     (omit if above is an object or to retrieve a value) */
  _optionDatepicker: function(target, name, value) {
    var inst = this._getInst(target);
    if (arguments.length == 2 && typeof name == 'string') {
      return (name == 'defaults' ? $.extend({}, $.datepicker._defaults) :
        (inst ? (name == 'all' ? $.extend({}, inst.settings) :
        this._get(inst, name)) : null));
    }
    var settings = name || {};
    if (typeof name == 'string') {
      settings = {};
      settings[name] = value;
    }
    if (inst) {
      if (this._curInst == inst) {
        this._hideDatepicker();
      }
      var date = this._getDateDatepicker(target, true);
      var minDate = this._getMinMaxDate(inst, 'min');
      var maxDate = this._getMinMaxDate(inst, 'max');
      extendRemove(inst.settings, settings);
      // reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
      if (minDate !== null && settings['dateFormat'] !== undefined && settings['minDate'] === undefined)
        inst.settings.minDate = this._formatDate(inst, minDate);
      if (maxDate !== null && settings['dateFormat'] !== undefined && settings['maxDate'] === undefined)
        inst.settings.maxDate = this._formatDate(inst, maxDate);
      this._attachments($(target), inst);
      this._autoSize(inst);
      this._setDateDatepicker(target, date);
      this._updateDatepicker(inst);
    }
  },

  // change method deprecated
  _changeDatepicker: function(target, name, value) {
    this._optionDatepicker(target, name, value);
  },

  /* Redraw the date picker attached to an input field or division.
     @param  target  element - the target input field or division or span */
  _refreshDatepicker: function(target) {
    var inst = this._getInst(target);
    if (inst) {
      this._updateDatepicker(inst);
    }
  },

  /* Set the dates for a jQuery selection.
     @param  target   element - the target input field or division or span
     @param  date     Date - the new date */
  _setDateDatepicker: function(target, date) {
    var inst = this._getInst(target);
    if (inst) {
      this._setDate(inst, date);
      this._updateDatepicker(inst);
      this._updateAlternate(inst);
    }
  },

  /* Get the date(s) for the first entry in a jQuery selection.
     @param  target     element - the target input field or division or span
     @param  noDefault  boolean - true if no default date is to be used
     @return Date - the current date */
  _getDateDatepicker: function(target, noDefault) {
    var inst = this._getInst(target);
    if (inst && !inst.inline)
      this._setDateFromField(inst, noDefault);
    return (inst ? this._getDate(inst) : null);
  },

  /* Handle keystrokes. */
  _doKeyDown: function(event) {
    var inst = $.datepicker._getInst(event.target);
    var handled = true;
    var isRTL = inst.dpDiv.is('.ui-datepicker-rtl');
    inst._keyEvent = true;
    if ($.datepicker._datepickerShowing)
      switch (event.keyCode) {
        case 9: $.datepicker._hideDatepicker();
            handled = false;
            break; // hide on tab out
        case 13: var sel = $('td.' + $.datepicker._dayOverClass + ':not(.' + 
                  $.datepicker._currentClass + ')', inst.dpDiv);
            if (sel[0])
              $.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
            else
              $.datepicker._hideDatepicker();
            return false; // don't submit the form
            break; // select the value on enter
        case 27: $.datepicker._hideDatepicker();
            break; // hide on escape
        case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
              -$.datepicker._get(inst, 'stepBigMonths') :
              -$.datepicker._get(inst, 'stepMonths')), 'M');
            break; // previous month/year on page up/+ ctrl
        case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
              +$.datepicker._get(inst, 'stepBigMonths') :
              +$.datepicker._get(inst, 'stepMonths')), 'M');
            break; // next month/year on page down/+ ctrl
        case 35: if (event.ctrlKey || event.metaKey) $.datepicker._clearDate(event.target);
            handled = event.ctrlKey || event.metaKey;
            break; // clear on ctrl or command +end
        case 36: if (event.ctrlKey || event.metaKey) $.datepicker._gotoToday(event.target);
            handled = event.ctrlKey || event.metaKey;
            break; // current on ctrl or command +home
        case 37: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), 'D');
            handled = event.ctrlKey || event.metaKey;
            // -1 day on ctrl or command +left
            if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                  -$.datepicker._get(inst, 'stepBigMonths') :
                  -$.datepicker._get(inst, 'stepMonths')), 'M');
            // next month/year on alt +left on Mac
            break;
        case 38: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, -7, 'D');
            handled = event.ctrlKey || event.metaKey;
            break; // -1 week on ctrl or command +up
        case 39: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), 'D');
            handled = event.ctrlKey || event.metaKey;
            // +1 day on ctrl or command +right
            if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                  +$.datepicker._get(inst, 'stepBigMonths') :
                  +$.datepicker._get(inst, 'stepMonths')), 'M');
            // next month/year on alt +right
            break;
        case 40: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, +7, 'D');
            handled = event.ctrlKey || event.metaKey;
            break; // +1 week on ctrl or command +down
        default: handled = false;
      }
    else if (event.keyCode == 36 && event.ctrlKey) // display the date picker on ctrl+home
      $.datepicker._showDatepicker(this);
    else {
      handled = false;
    }
    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  },

  /* Filter entered characters - based on date format. */
  _doKeyPress: function(event) {
    var inst = $.datepicker._getInst(event.target);
    if ($.datepicker._get(inst, 'constrainInput')) {
      var chars = $.datepicker._possibleChars($.datepicker._get(inst, 'dateFormat'));
      var chr = String.fromCharCode(event.charCode == undefined ? event.keyCode : event.charCode);
      return event.ctrlKey || event.metaKey || (chr < ' ' || !chars || chars.indexOf(chr) > -1);
    }
  },

  /* Synchronise manual entry and field/alternate field. */
  _doKeyUp: function(event) {
    var inst = $.datepicker._getInst(event.target);
    if (inst.input.val() != inst.lastVal) {
      try {
        var date = $.datepicker.parseDate($.datepicker._get(inst, 'dateFormat'),
          (inst.input ? inst.input.val() : null),
          $.datepicker._getFormatConfig(inst));
        if (date) { // only if valid
          $.datepicker._setDateFromField(inst);
          $.datepicker._updateAlternate(inst);
          $.datepicker._updateDatepicker(inst);
        }
      }
      catch (event) {
        $.datepicker.log(event);
      }
    }
    return true;
  },

  /* Pop-up the date picker for a given input field.
     @param  input  element - the input field attached to the date picker or
                    event - if triggered by focus */
  _showDatepicker: function(input) {
    input = input.target || input;
    if (input.nodeName.toLowerCase() != 'input') // find from button/image trigger
      input = $('input', input.parentNode)[0];
    if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput == input) // already here
      return;
    var inst = $.datepicker._getInst(input);
    if ($.datepicker._curInst && $.datepicker._curInst != inst) {
      $.datepicker._curInst.dpDiv.stop(true, true);
    }
    var beforeShow = $.datepicker._get(inst, 'beforeShow');
    extendRemove(inst.settings, (beforeShow ? beforeShow.apply(input, [input, inst]) : {}));
    inst.lastVal = null;
    $.datepicker._lastInput = input;
    $.datepicker._setDateFromField(inst);
    if ($.datepicker._inDialog) // hide cursor
      input.value = '';
    if (!$.datepicker._pos) { // position below input
      $.datepicker._pos = $.datepicker._findPos(input);
      $.datepicker._pos[1] += input.offsetHeight; // add the height
    }
    var isFixed = false;
    $(input).parents().each(function() {
      isFixed |= $(this).css('position') == 'fixed';
      return !isFixed;
    });
    if (isFixed && $.browser.opera) { // correction for Opera when fixed and scrolled
      $.datepicker._pos[0] -= document.documentElement.scrollLeft;
      $.datepicker._pos[1] -= document.documentElement.scrollTop;
    }
    var offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
    $.datepicker._pos = null;
    //to avoid flashes on Firefox
    inst.dpDiv.empty();
    // determine sizing offscreen
    inst.dpDiv.css({position: 'absolute', display: 'block', top: '-1000px'});
    $.datepicker._updateDatepicker(inst);
    // fix width for dynamic number of date pickers
    // and adjust position before showing
    offset = $.datepicker._checkOffset(inst, offset, isFixed);
    inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
      'static' : (isFixed ? 'fixed' : 'absolute')), display: 'none',
      left: offset.left + 'px', top: offset.top + 'px'});
    if (!inst.inline) {
      var showAnim = $.datepicker._get(inst, 'showAnim');
      var duration = $.datepicker._get(inst, 'duration');
      var postProcess = function() {
        $.datepicker._datepickerShowing = true;
        var cover = inst.dpDiv.find('iframe.ui-datepicker-cover'); // IE6- only
        if( !! cover.length ){
          var borders = $.datepicker._getBorders(inst.dpDiv);
          cover.css({left: -borders[0], top: -borders[1],
            width: inst.dpDiv.outerWidth(), height: inst.dpDiv.outerHeight()});
        }
      };
      inst.dpDiv.zIndex($(input).zIndex()+1);
      if ($.effects && $.effects[showAnim])
        inst.dpDiv.show(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
      else
        inst.dpDiv[showAnim || 'show']((showAnim ? duration : null), postProcess);
      if (!showAnim || !duration)
        postProcess();
      if (inst.input.is(':visible') && !inst.input.is(':disabled'))
        inst.input.focus();
      $.datepicker._curInst = inst;
    }
  },

  /* Generate the date picker content. */
  _updateDatepicker: function(inst) {
    var self = this;
    var borders = $.datepicker._getBorders(inst.dpDiv);
    inst.dpDiv.empty().append(this._generateHTML(inst));
    var cover = inst.dpDiv.find('iframe.ui-datepicker-cover'); // IE6- only
    if( !!cover.length ){ //avoid call to outerXXXX() when not in IE6
      cover.css({left: -borders[0], top: -borders[1], width: inst.dpDiv.outerWidth(), height: inst.dpDiv.outerHeight()})
    }
    inst.dpDiv.find('button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a')
        .bind('mouseout', function(){
          $(this).removeClass('ui-state-hover');
          if(this.className.indexOf('ui-datepicker-prev') != -1) $(this).removeClass('ui-datepicker-prev-hover');
          if(this.className.indexOf('ui-datepicker-next') != -1) $(this).removeClass('ui-datepicker-next-hover');
        })
        .bind('mouseover', function(){
          if (!self._isDisabledDatepicker( inst.inline ? inst.dpDiv.parent()[0] : inst.input[0])) {
            $(this).parents('.ui-datepicker-calendar').find('a').removeClass('ui-state-hover');
            $(this).addClass('ui-state-hover');
            if(this.className.indexOf('ui-datepicker-prev') != -1) $(this).addClass('ui-datepicker-prev-hover');
            if(this.className.indexOf('ui-datepicker-next') != -1) $(this).addClass('ui-datepicker-next-hover');
          }
        })
      .end()
      .find('.' + this._dayOverClass + ' a')
        .trigger('mouseover')
      .end();
    var numMonths = this._getNumberOfMonths(inst);
    var cols = numMonths[1];
    var width = 17;
    if (cols > 1)
      inst.dpDiv.addClass('ui-datepicker-multi-' + cols).css('width', (width * cols) + 'em');
    else
      inst.dpDiv.removeClass('ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4').width('');
    inst.dpDiv[(numMonths[0] != 1 || numMonths[1] != 1 ? 'add' : 'remove') +
      'Class']('ui-datepicker-multi');
    inst.dpDiv[(this._get(inst, 'isRTL') ? 'add' : 'remove') +
      'Class']('ui-datepicker-rtl');
    if (inst == $.datepicker._curInst && $.datepicker._datepickerShowing && inst.input &&
        // #6694 - don't focus the input if it's already focused
        // this breaks the change event in IE
        inst.input.is(':visible') && !inst.input.is(':disabled') && inst.input[0] != document.activeElement)
      inst.input.focus();
    // deffered render of the years select (to avoid flashes on Firefox) 
    if( inst.yearshtml ){
      var origyearshtml = inst.yearshtml;
      setTimeout(function(){
        //assure that inst.yearshtml didn't change.
        if( origyearshtml === inst.yearshtml ){
          inst.dpDiv.find('select.ui-datepicker-year:first').replaceWith(inst.yearshtml);
        }
        origyearshtml = inst.yearshtml = null;
      }, 0);
    }
  },

  /* Retrieve the size of left and top borders for an element.
     @param  elem  (jQuery object) the element of interest
     @return  (number[2]) the left and top borders */
  _getBorders: function(elem) {
    var convert = function(value) {
      return {thin: 1, medium: 2, thick: 3}[value] || value;
    };
    return [parseFloat(convert(elem.css('border-left-width'))),
      parseFloat(convert(elem.css('border-top-width')))];
  },

  /* Check positioning to remain on screen. */
  _checkOffset: function(inst, offset, isFixed) {
    var dpWidth = inst.dpDiv.outerWidth();
    var dpHeight = inst.dpDiv.outerHeight();
    var inputWidth = inst.input ? inst.input.outerWidth() : 0;
    var inputHeight = inst.input ? inst.input.outerHeight() : 0;
    var viewWidth = document.documentElement.clientWidth + $(document).scrollLeft();
    var viewHeight = document.documentElement.clientHeight + $(document).scrollTop();

    offset.left -= (this._get(inst, 'isRTL') ? (dpWidth - inputWidth) : 0);
    offset.left -= (isFixed && offset.left == inst.input.offset().left) ? $(document).scrollLeft() : 0;
    offset.top -= (isFixed && offset.top == (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

    // now check if datepicker is showing outside window viewport - move to a better place if so.
    offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
      Math.abs(offset.left + dpWidth - viewWidth) : 0);
    offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
      Math.abs(dpHeight + inputHeight) : 0);

    return offset;
  },

  /* Find an object's position on the screen. */
  _findPos: function(obj) {
    var inst = this._getInst(obj);
    var isRTL = this._get(inst, 'isRTL');
        while (obj && (obj.type == 'hidden' || obj.nodeType != 1 || $.expr.filters.hidden(obj))) {
            obj = obj[isRTL ? 'previousSibling' : 'nextSibling'];
        }
        var position = $(obj).offset();
      return [position.left, position.top];
  },

  /* Hide the date picker from view.
     @param  input  element - the input field attached to the date picker */
  _hideDatepicker: function(input) {
    var inst = this._curInst;
    if (!inst || (input && inst != $.data(input, PROP_NAME)))
      return;
    if (this._datepickerShowing) {
      var showAnim = this._get(inst, 'showAnim');
      var duration = this._get(inst, 'duration');
      var postProcess = function() {
        $.datepicker._tidyDialog(inst);
        this._curInst = null;
      };
      if ($.effects && $.effects[showAnim])
        inst.dpDiv.hide(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
      else
        inst.dpDiv[(showAnim == 'slideDown' ? 'slideUp' :
          (showAnim == 'fadeIn' ? 'fadeOut' : 'hide'))]((showAnim ? duration : null), postProcess);
      if (!showAnim)
        postProcess();
      var onClose = this._get(inst, 'onClose');
      if (onClose)
        onClose.apply((inst.input ? inst.input[0] : null),
          [(inst.input ? inst.input.val() : ''), inst]);  // trigger custom callback
      this._datepickerShowing = false;
      this._lastInput = null;
      if (this._inDialog) {
        this._dialogInput.css({ position: 'absolute', left: '0', top: '-100px' });
        if ($.blockUI) {
          $.unblockUI();
          $('body').append(this.dpDiv);
        }
      }
      this._inDialog = false;
    }
  },

  /* Tidy up after a dialog display. */
  _tidyDialog: function(inst) {
    inst.dpDiv.removeClass(this._dialogClass).unbind('.ui-datepicker-calendar');
  },

  /* Close date picker if clicked elsewhere. */
  _checkExternalClick: function(event) {
    if (!$.datepicker._curInst)
      return;
    var $target = $(event.target);
    if ($target[0].id != $.datepicker._mainDivId &&
        $target.parents('#' + $.datepicker._mainDivId).length == 0 &&
        !$target.hasClass($.datepicker.markerClassName) &&
        !$target.hasClass($.datepicker._triggerClass) &&
        $.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI))
      $.datepicker._hideDatepicker();
  },

  /* Adjust one of the date sub-fields. */
  _adjustDate: function(id, offset, period) {
    var target = $(id);
    var inst = this._getInst(target[0]);
    if (this._isDisabledDatepicker(target[0])) {
      return;
    }
    this._adjustInstDate(inst, offset +
      (period == 'M' ? this._get(inst, 'showCurrentAtPos') : 0), // undo positioning
      period);
    this._updateDatepicker(inst);
  },

  /* Action for current link. */
  _gotoToday: function(id) {
    var target = $(id);
    var inst = this._getInst(target[0]);
    if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
      inst.selectedDay = inst.currentDay;
      inst.drawMonth = inst.selectedMonth = inst.currentMonth;
      inst.drawYear = inst.selectedYear = inst.currentYear;
    }
    else {
      var date = new Date();
      inst.selectedDay = date.getDate();
      inst.drawMonth = inst.selectedMonth = date.getMonth();
      inst.drawYear = inst.selectedYear = date.getFullYear();
    }
    this._notifyChange(inst);
    this._adjustDate(target);
  },

  /* Action for selecting a new month/year. */
  _selectMonthYear: function(id, select, period) {
    var target = $(id);
    var inst = this._getInst(target[0]);
    inst._selectingMonthYear = false;
    inst['selected' + (period == 'M' ? 'Month' : 'Year')] =
    inst['draw' + (period == 'M' ? 'Month' : 'Year')] =
      parseInt(select.options[select.selectedIndex].value,10);
    this._notifyChange(inst);
    this._adjustDate(target);
  },

  /* Restore input focus after not changing month/year. */
  _clickMonthYear: function(id) {
    var target = $(id);
    var inst = this._getInst(target[0]);
    if (inst.input && inst._selectingMonthYear) {
      setTimeout(function() {
        inst.input.focus();
      }, 0);
    }
    inst._selectingMonthYear = !inst._selectingMonthYear;
  },

  /* Action for selecting a day. */
  _selectDay: function(id, month, year, td) {
    var target = $(id);
    if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
      return;
    }
    var inst = this._getInst(target[0]);
    inst.selectedDay = inst.currentDay = $('a', td).html();
    inst.selectedMonth = inst.currentMonth = month;
    inst.selectedYear = inst.currentYear = year;
    this._selectDate(id, this._formatDate(inst,
      inst.currentDay, inst.currentMonth, inst.currentYear));
  },

  /* Erase the input field and hide the date picker. */
  _clearDate: function(id) {
    var target = $(id);
    var inst = this._getInst(target[0]);
    this._selectDate(target, '');
  },

  /* Update the input field with the selected date. */
  _selectDate: function(id, dateStr) {
    var target = $(id);
    var inst = this._getInst(target[0]);
    dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
    if (inst.input)
      inst.input.val(dateStr);
    this._updateAlternate(inst);
    var onSelect = this._get(inst, 'onSelect');
    if (onSelect)
      onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
    else if (inst.input)
      inst.input.trigger('change'); // fire the change event
    if (inst.inline)
      this._updateDatepicker(inst);
    else {
      this._hideDatepicker();
      this._lastInput = inst.input[0];
      if (typeof(inst.input[0]) != 'object')
        inst.input.focus(); // restore focus
      this._lastInput = null;
    }
  },

  /* Update any alternate field to synchronise with the main field. */
  _updateAlternate: function(inst) {
    var altField = this._get(inst, 'altField');
    if (altField) { // update alternate field too
      var altFormat = this._get(inst, 'altFormat') || this._get(inst, 'dateFormat');
      var date = this._getDate(inst);
      var dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
      $(altField).each(function() { $(this).val(dateStr); });
    }
  },

  /* Set as beforeShowDay function to prevent selection of weekends.
     @param  date  Date - the date to customise
     @return [boolean, string] - is this date selectable?, what is its CSS class? */
  noWeekends: function(date) {
    var day = date.getDay();
    return [(day > 0 && day < 6), ''];
  },

  /* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
     @param  date  Date - the date to get the week for
     @return  number - the number of the week within the year that contains this date */
  iso8601Week: function(date) {
    var checkDate = new Date(date.getTime());
    // Find Thursday of this week starting on Monday
    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
    var time = checkDate.getTime();
    checkDate.setMonth(0); // Compare with Jan 1
    checkDate.setDate(1);
    return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
  },

  /* Parse a string value into a date object.
     See formatDate below for the possible formats.

     @param  format    string - the expected format of the date
     @param  value     string - the date in the above format
     @param  settings  Object - attributes include:
                       shortYearCutoff  number - the cutoff year for determining the century (optional)
                       dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
                       dayNames         string[7] - names of the days from Sunday (optional)
                       monthNamesShort  string[12] - abbreviated names of the months (optional)
                       monthNames       string[12] - names of the months (optional)
     @return  Date - the extracted date value or null if value is blank */
  parseDate: function (format, value, settings) {
    if (format == null || value == null)
      throw 'Invalid arguments';
    value = (typeof value == 'object' ? value.toString() : value + '');
    if (value == '')
      return null;
    var shortYearCutoff = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff;
    shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff :
        new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
    var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
    var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
    var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
    var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
    var year = -1;
    var month = -1;
    var day = -1;
    var doy = -1;
    var literal = false;
    // Check whether a format character is doubled
    var lookAhead = function(match) {
      var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
      if (matches)
        iFormat++;
      return matches;
    };
    // Extract a number from the string value
    var getNumber = function(match) {
      var isDoubled = lookAhead(match);
      var size = (match == '@' ? 14 : (match == '!' ? 20 :
        (match == 'y' && isDoubled ? 4 : (match == 'o' ? 3 : 2))));
      var digits = new RegExp('^\\d{1,' + size + '}');
      var num = value.substring(iValue).match(digits);
      if (!num)
        throw 'Missing number at position ' + iValue;
      iValue += num[0].length;
      return parseInt(num[0], 10);
    };
    // Extract a name from the string value and convert to an index
    var getName = function(match, shortNames, longNames) {
      var names = (lookAhead(match) ? longNames : shortNames);
      for (var i = 0; i < names.length; i++) {
        if (value.substr(iValue, names[i].length).toLowerCase() == names[i].toLowerCase()) {
          iValue += names[i].length;
          return i + 1;
        }
      }
      throw 'Unknown name at position ' + iValue;
    };
    // Confirm that a literal character matches the string value
    var checkLiteral = function() {
      if (value.charAt(iValue) != format.charAt(iFormat))
        throw 'Unexpected literal at position ' + iValue;
      iValue++;
    };
    var iValue = 0;
    for (var iFormat = 0; iFormat < format.length; iFormat++) {
      if (literal)
        if (format.charAt(iFormat) == "'" && !lookAhead("'"))
          literal = false;
        else
          checkLiteral();
      else
        switch (format.charAt(iFormat)) {
          case 'd':
            day = getNumber('d');
            break;
          case 'D':
            getName('D', dayNamesShort, dayNames);
            break;
          case 'o':
            doy = getNumber('o');
            break;
          case 'm':
            month = getNumber('m');
            break;
          case 'M':
            month = getName('M', monthNamesShort, monthNames);
            break;
          case 'y':
            year = getNumber('y');
            break;
          case '@':
            var date = new Date(getNumber('@'));
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            break;
          case '!':
            var date = new Date((getNumber('!') - this._ticksTo1970) / 10000);
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            break;
          case "'":
            if (lookAhead("'"))
              checkLiteral();
            else
              literal = true;
            break;
          default:
            checkLiteral();
        }
    }
    if (year == -1)
      year = new Date().getFullYear();
    else if (year < 100)
      year += new Date().getFullYear() - new Date().getFullYear() % 100 +
        (year <= shortYearCutoff ? 0 : -100);
    if (doy > -1) {
      month = 1;
      day = doy;
      do {
        var dim = this._getDaysInMonth(year, month - 1);
        if (day <= dim)
          break;
        month++;
        day -= dim;
      } while (true);
    }
    var date = this._daylightSavingAdjust(new Date(year, month - 1, day));
    if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day)
      throw 'Invalid date'; // E.g. 31/02/00
    return date;
  },

  /* Standard date formats. */
  ATOM: 'yy-mm-dd', // RFC 3339 (ISO 8601)
  COOKIE: 'D, dd M yy',
  ISO_8601: 'yy-mm-dd',
  RFC_822: 'D, d M y',
  RFC_850: 'DD, dd-M-y',
  RFC_1036: 'D, d M y',
  RFC_1123: 'D, d M yy',
  RFC_2822: 'D, d M yy',
  RSS: 'D, d M y', // RFC 822
  TICKS: '!',
  TIMESTAMP: '@',
  W3C: 'yy-mm-dd', // ISO 8601

  _ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
    Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

  /* Format a date object into a string value.
     The format can be combinations of the following:
     d  - day of month (no leading zero)
     dd - day of month (two digit)
     o  - day of year (no leading zeros)
     oo - day of year (three digit)
     D  - day name short
     DD - day name long
     m  - month of year (no leading zero)
     mm - month of year (two digit)
     M  - month name short
     MM - month name long
     y  - year (two digit)
     yy - year (four digit)
     @ - Unix timestamp (ms since 01/01/1970)
     ! - Windows ticks (100ns since 01/01/0001)
     '...' - literal text
     '' - single quote

     @param  format    string - the desired format of the date
     @param  date      Date - the date value to format
     @param  settings  Object - attributes include:
                       dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
                       dayNames         string[7] - names of the days from Sunday (optional)
                       monthNamesShort  string[12] - abbreviated names of the months (optional)
                       monthNames       string[12] - names of the months (optional)
     @return  string - the date in the above format */
  formatDate: function (format, date, settings) {
    if (!date)
      return '';
    var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
    var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
    var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
    var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
    // Check whether a format character is doubled
    var lookAhead = function(match) {
      var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
      if (matches)
        iFormat++;
      return matches;
    };
    // Format a number, with leading zero if necessary
    var formatNumber = function(match, value, len) {
      var num = '' + value;
      if (lookAhead(match))
        while (num.length < len)
          num = '0' + num;
      return num;
    };
    // Format a name, short or long as requested
    var formatName = function(match, value, shortNames, longNames) {
      return (lookAhead(match) ? longNames[value] : shortNames[value]);
    };
    var output = '';
    var literal = false;
    if (date)
      for (var iFormat = 0; iFormat < format.length; iFormat++) {
        if (literal)
          if (format.charAt(iFormat) == "'" && !lookAhead("'"))
            literal = false;
          else
            output += format.charAt(iFormat);
        else
          switch (format.charAt(iFormat)) {
            case 'd':
              output += formatNumber('d', date.getDate(), 2);
              break;
            case 'D':
              output += formatName('D', date.getDay(), dayNamesShort, dayNames);
              break;
            case 'o':
              output += formatNumber('o',
                (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000, 3);
              break;
            case 'm':
              output += formatNumber('m', date.getMonth() + 1, 2);
              break;
            case 'M':
              output += formatName('M', date.getMonth(), monthNamesShort, monthNames);
              break;
            case 'y':
              output += (lookAhead('y') ? date.getFullYear() :
                (date.getYear() % 100 < 10 ? '0' : '') + date.getYear() % 100);
              break;
            case '@':
              output += date.getTime();
              break;
            case '!':
              output += date.getTime() * 10000 + this._ticksTo1970;
              break;
            case "'":
              if (lookAhead("'"))
                output += "'";
              else
                literal = true;
              break;
            default:
              output += format.charAt(iFormat);
          }
      }
    return output;
  },

  /* Extract all possible characters from the date format. */
  _possibleChars: function (format) {
    var chars = '';
    var literal = false;
    // Check whether a format character is doubled
    var lookAhead = function(match) {
      var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
      if (matches)
        iFormat++;
      return matches;
    };
    for (var iFormat = 0; iFormat < format.length; iFormat++)
      if (literal)
        if (format.charAt(iFormat) == "'" && !lookAhead("'"))
          literal = false;
        else
          chars += format.charAt(iFormat);
      else
        switch (format.charAt(iFormat)) {
          case 'd': case 'm': case 'y': case '@':
            chars += '0123456789';
            break;
          case 'D': case 'M':
            return null; // Accept anything
          case "'":
            if (lookAhead("'"))
              chars += "'";
            else
              literal = true;
            break;
          default:
            chars += format.charAt(iFormat);
        }
    return chars;
  },

  /* Get a setting value, defaulting if necessary. */
  _get: function(inst, name) {
    return inst.settings[name] !== undefined ?
      inst.settings[name] : this._defaults[name];
  },

  /* Parse existing date and initialise date picker. */
  _setDateFromField: function(inst, noDefault) {
    if (inst.input.val() == inst.lastVal) {
      return;
    }
    var dateFormat = this._get(inst, 'dateFormat');
    var dates = inst.lastVal = inst.input ? inst.input.val() : null;
    var date, defaultDate;
    date = defaultDate = this._getDefaultDate(inst);
    var settings = this._getFormatConfig(inst);
    try {
      date = this.parseDate(dateFormat, dates, settings) || defaultDate;
    } catch (event) {
      this.log(event);
      dates = (noDefault ? '' : dates);
    }
    inst.selectedDay = date.getDate();
    inst.drawMonth = inst.selectedMonth = date.getMonth();
    inst.drawYear = inst.selectedYear = date.getFullYear();
    inst.currentDay = (dates ? date.getDate() : 0);
    inst.currentMonth = (dates ? date.getMonth() : 0);
    inst.currentYear = (dates ? date.getFullYear() : 0);
    this._adjustInstDate(inst);
  },

  /* Retrieve the default date shown on opening. */
  _getDefaultDate: function(inst) {
    return this._restrictMinMax(inst,
      this._determineDate(inst, this._get(inst, 'defaultDate'), new Date()));
  },

  /* A date may be specified as an exact value or a relative one. */
  _determineDate: function(inst, date, defaultDate) {
    var offsetNumeric = function(offset) {
      var date = new Date();
      date.setDate(date.getDate() + offset);
      return date;
    };
    var offsetString = function(offset) {
      try {
        return $.datepicker.parseDate($.datepicker._get(inst, 'dateFormat'),
          offset, $.datepicker._getFormatConfig(inst));
      }
      catch (e) {
        // Ignore
      }
      var date = (offset.toLowerCase().match(/^c/) ?
        $.datepicker._getDate(inst) : null) || new Date();
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      var pattern = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g;
      var matches = pattern.exec(offset);
      while (matches) {
        switch (matches[2] || 'd') {
          case 'd' : case 'D' :
            day += parseInt(matches[1],10); break;
          case 'w' : case 'W' :
            day += parseInt(matches[1],10) * 7; break;
          case 'm' : case 'M' :
            month += parseInt(matches[1],10);
            day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
            break;
          case 'y': case 'Y' :
            year += parseInt(matches[1],10);
            day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
            break;
        }
        matches = pattern.exec(offset);
      }
      return new Date(year, month, day);
    };
    var newDate = (date == null || date === '' ? defaultDate : (typeof date == 'string' ? offsetString(date) :
      (typeof date == 'number' ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));
    newDate = (newDate && newDate.toString() == 'Invalid Date' ? defaultDate : newDate);
    if (newDate) {
      newDate.setHours(0);
      newDate.setMinutes(0);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
    }
    return this._daylightSavingAdjust(newDate);
  },

  /* Handle switch to/from daylight saving.
     Hours may be non-zero on daylight saving cut-over:
     > 12 when midnight changeover, but then cannot generate
     midnight datetime, so jump to 1AM, otherwise reset.
     @param  date  (Date) the date to check
     @return  (Date) the corrected date */
  _daylightSavingAdjust: function(date) {
    if (!date) return null;
    date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
    return date;
  },

  /* Set the date(s) directly. */
  _setDate: function(inst, date, noChange) {
    var clear = !date;
    var origMonth = inst.selectedMonth;
    var origYear = inst.selectedYear;
    var newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));
    inst.selectedDay = inst.currentDay = newDate.getDate();
    inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
    inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
    if ((origMonth != inst.selectedMonth || origYear != inst.selectedYear) && !noChange)
      this._notifyChange(inst);
    this._adjustInstDate(inst);
    if (inst.input) {
      inst.input.val(clear ? '' : this._formatDate(inst));
    }
  },

  /* Retrieve the date(s) directly. */
  _getDate: function(inst) {
    var startDate = (!inst.currentYear || (inst.input && inst.input.val() == '') ? null :
      this._daylightSavingAdjust(new Date(
      inst.currentYear, inst.currentMonth, inst.currentDay)));
      return startDate;
  },

  /* Generate the HTML for the current state of the date picker. */
  _generateHTML: function(inst) {
    var today = new Date();
    today = this._daylightSavingAdjust(
      new Date(today.getFullYear(), today.getMonth(), today.getDate())); // clear time
    var isRTL = this._get(inst, 'isRTL');
    var showButtonPanel = this._get(inst, 'showButtonPanel');
    var hideIfNoPrevNext = this._get(inst, 'hideIfNoPrevNext');
    var navigationAsDateFormat = this._get(inst, 'navigationAsDateFormat');
    var numMonths = this._getNumberOfMonths(inst);
    var showCurrentAtPos = this._get(inst, 'showCurrentAtPos');
    var stepMonths = this._get(inst, 'stepMonths');
    var isMultiMonth = (numMonths[0] != 1 || numMonths[1] != 1);
    var currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
      new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
    var minDate = this._getMinMaxDate(inst, 'min');
    var maxDate = this._getMinMaxDate(inst, 'max');
    var drawMonth = inst.drawMonth - showCurrentAtPos;
    var drawYear = inst.drawYear;
    if (drawMonth < 0) {
      drawMonth += 12;
      drawYear--;
    }
    if (maxDate) {
      var maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
        maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
      maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
      while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
        drawMonth--;
        if (drawMonth < 0) {
          drawMonth = 11;
          drawYear--;
        }
      }
    }
    inst.drawMonth = drawMonth;
    inst.drawYear = drawYear;
    var prevText = this._get(inst, 'prevText');
    prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
      this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
      this._getFormatConfig(inst)));
    var prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
      '<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_' + dpuuid +
      '.datepicker._adjustDate(\'#' + inst.id + '\', -' + stepMonths + ', \'M\');"' +
      ' title="' + prevText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'e' : 'w') + '">' + prevText + '</span></a>' :
      (hideIfNoPrevNext ? '' : '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="'+ prevText +'"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'e' : 'w') + '">' + prevText + '</span></a>'));
    var nextText = this._get(inst, 'nextText');
    nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
      this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
      this._getFormatConfig(inst)));
    var next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
      '<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_' + dpuuid +
      '.datepicker._adjustDate(\'#' + inst.id + '\', +' + stepMonths + ', \'M\');"' +
      ' title="' + nextText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'w' : 'e') + '">' + nextText + '</span></a>' :
      (hideIfNoPrevNext ? '' : '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="'+ nextText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'w' : 'e') + '">' + nextText + '</span></a>'));
    var currentText = this._get(inst, 'currentText');
    var gotoDate = (this._get(inst, 'gotoCurrent') && inst.currentDay ? currentDate : today);
    currentText = (!navigationAsDateFormat ? currentText :
      this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));
    var controls = (!inst.inline ? '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_' + dpuuid +
      '.datepicker._hideDatepicker();">' + this._get(inst, 'closeText') + '</button>' : '');
    var buttonPanel = (showButtonPanel) ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (isRTL ? controls : '') +
      (this._isInRange(inst, gotoDate) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery_' + dpuuid +
      '.datepicker._gotoToday(\'#' + inst.id + '\');"' +
      '>' + currentText + '</button>' : '') + (isRTL ? '' : controls) + '</div>' : '';
    var firstDay = parseInt(this._get(inst, 'firstDay'),10);
    firstDay = (isNaN(firstDay) ? 0 : firstDay);
    var showWeek = this._get(inst, 'showWeek');
    var dayNames = this._get(inst, 'dayNames');
    var dayNamesShort = this._get(inst, 'dayNamesShort');
    var dayNamesMin = this._get(inst, 'dayNamesMin');
    var monthNames = this._get(inst, 'monthNames');
    var monthNamesShort = this._get(inst, 'monthNamesShort');
    var beforeShowDay = this._get(inst, 'beforeShowDay');
    var showOtherMonths = this._get(inst, 'showOtherMonths');
    var selectOtherMonths = this._get(inst, 'selectOtherMonths');
    var calculateWeek = this._get(inst, 'calculateWeek') || this.iso8601Week;
    var defaultDate = this._getDefaultDate(inst);
    var html = '';
    for (var row = 0; row < numMonths[0]; row++) {
      var group = '';
      for (var col = 0; col < numMonths[1]; col++) {
        var selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
        var cornerClass = ' ui-corner-all';
        var calender = '';
        if (isMultiMonth) {
          calender += '<div class="ui-datepicker-group';
          if (numMonths[1] > 1)
            switch (col) {
              case 0: calender += ' ui-datepicker-group-first';
                cornerClass = ' ui-corner-' + (isRTL ? 'right' : 'left'); break;
              case numMonths[1]-1: calender += ' ui-datepicker-group-last';
                cornerClass = ' ui-corner-' + (isRTL ? 'left' : 'right'); break;
              default: calender += ' ui-datepicker-group-middle'; cornerClass = ''; break;
            }
          calender += '">';
        }
        calender += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + cornerClass + '">' +
          (/all|left/.test(cornerClass) && row == 0 ? (isRTL ? next : prev) : '') +
          (/all|right/.test(cornerClass) && row == 0 ? (isRTL ? prev : next) : '') +
          this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
          row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
          '</div><table class="ui-datepicker-calendar"><thead>' +
          '<tr>';
        var thead = (showWeek ? '<th class="ui-datepicker-week-col">' + this._get(inst, 'weekHeader') + '</th>' : '');
        for (var dow = 0; dow < 7; dow++) { // days of the week
          var day = (dow + firstDay) % 7;
          thead += '<th' + ((dow + firstDay + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : '') + '>' +
            '<span title="' + dayNames[day] + '">' + dayNamesMin[day] + '</span></th>';
        }
        calender += thead + '</tr></thead><tbody>';
        var daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
        if (drawYear == inst.selectedYear && drawMonth == inst.selectedMonth)
          inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
        var leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
        var numRows = (isMultiMonth ? 6 : Math.ceil((leadDays + daysInMonth) / 7)); // calculate the number of rows to generate
        var printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
        for (var dRow = 0; dRow < numRows; dRow++) { // create date picker rows
          calender += '<tr>';
          var tbody = (!showWeek ? '' : '<td class="ui-datepicker-week-col">' +
            this._get(inst, 'calculateWeek')(printDate) + '</td>');
          for (var dow = 0; dow < 7; dow++) { // create date picker days
            var daySettings = (beforeShowDay ?
              beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, '']);
            var otherMonth = (printDate.getMonth() != drawMonth);
            var unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
              (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
            tbody += '<td class="' +
              ((dow + firstDay + 6) % 7 >= 5 ? ' ui-datepicker-week-end' : '') + // highlight weekends
              (otherMonth ? ' ui-datepicker-other-month' : '') + // highlight days from other months
              ((printDate.getTime() == selectedDate.getTime() && drawMonth == inst.selectedMonth && inst._keyEvent) || // user pressed key
              (defaultDate.getTime() == printDate.getTime() && defaultDate.getTime() == selectedDate.getTime()) ?
              // or defaultDate is current printedDate and defaultDate is selectedDate
              ' ' + this._dayOverClass : '') + // highlight selected day
              (unselectable ? ' ' + this._unselectableClass + ' ui-state-disabled': '') +  // highlight unselectable days
              (otherMonth && !showOtherMonths ? '' : ' ' + daySettings[1] + // highlight custom dates
              (printDate.getTime() == currentDate.getTime() ? ' ' + this._currentClass : '') + // highlight selected day
              (printDate.getTime() == today.getTime() ? ' ui-datepicker-today' : '')) + '"' + // highlight today (if different)
              ((!otherMonth || showOtherMonths) && daySettings[2] ? ' title="' + daySettings[2] + '"' : '') + // cell title
              (unselectable ? '' : ' onclick="DP_jQuery_' + dpuuid + '.datepicker._selectDay(\'#' +
              inst.id + '\',' + printDate.getMonth() + ',' + printDate.getFullYear() + ', this);return false;"') + '>' + // actions
              (otherMonth && !showOtherMonths ? '&#xa0;' : // display for other months
              (unselectable ? '<span class="ui-state-default">' + printDate.getDate() + '</span>' : '<a class="ui-state-default' +
              (printDate.getTime() == today.getTime() ? ' ui-state-highlight' : '') +
              (printDate.getTime() == currentDate.getTime() ? ' ui-state-active' : '') + // highlight selected day
              (otherMonth ? ' ui-priority-secondary' : '') + // distinguish dates from other months
              '" href="#">' + printDate.getDate() + '</a>')) + '</td>'; // display selectable date
            printDate.setDate(printDate.getDate() + 1);
            printDate = this._daylightSavingAdjust(printDate);
          }
          calender += tbody + '</tr>';
        }
        drawMonth++;
        if (drawMonth > 11) {
          drawMonth = 0;
          drawYear++;
        }
        calender += '</tbody></table>' + (isMultiMonth ? '</div>' + 
              ((numMonths[0] > 0 && col == numMonths[1]-1) ? '<div class="ui-datepicker-row-break"></div>' : '') : '');
        group += calender;
      }
      html += group;
    }
    html += buttonPanel + ($.browser.msie && parseInt($.browser.version,10) < 7 && !inst.inline ?
      '<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>' : '');
    inst._keyEvent = false;
    return html;
  },

  /* Generate the month and year header. */
  _generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate,
      secondary, monthNames, monthNamesShort) {
    var changeMonth = this._get(inst, 'changeMonth');
    var changeYear = this._get(inst, 'changeYear');
    var showMonthAfterYear = this._get(inst, 'showMonthAfterYear');
    var html = '<div class="ui-datepicker-title">';
    var monthHtml = '';
    // month selection
    if (secondary || !changeMonth)
      monthHtml += '<span class="ui-datepicker-month">' + monthNames[drawMonth] + '</span>';
    else {
      var inMinYear = (minDate && minDate.getFullYear() == drawYear);
      var inMaxYear = (maxDate && maxDate.getFullYear() == drawYear);
      monthHtml += '<select class="ui-datepicker-month" ' +
        'onchange="DP_jQuery_' + dpuuid + '.datepicker._selectMonthYear(\'#' + inst.id + '\', this, \'M\');" ' +
        'onclick="DP_jQuery_' + dpuuid + '.datepicker._clickMonthYear(\'#' + inst.id + '\');"' +
        '>';
      for (var month = 0; month < 12; month++) {
        if ((!inMinYear || month >= minDate.getMonth()) &&
            (!inMaxYear || month <= maxDate.getMonth()))
          monthHtml += '<option value="' + month + '"' +
            (month == drawMonth ? ' selected="selected"' : '') +
            '>' + monthNamesShort[month] + '</option>';
      }
      monthHtml += '</select>';
    }
    if (!showMonthAfterYear)
      html += monthHtml + (secondary || !(changeMonth && changeYear) ? '&#xa0;' : '');
    // year selection
    if ( !inst.yearshtml ) {
      inst.yearshtml = '';
      if (secondary || !changeYear)
        html += '<span class="ui-datepicker-year">' + drawYear + '</span>';
      else {
        // determine range of years to display
        var years = this._get(inst, 'yearRange').split(':');
        var thisYear = new Date().getFullYear();
        var determineYear = function(value) {
          var year = (value.match(/c[+-].*/) ? drawYear + parseInt(value.substring(1), 10) :
            (value.match(/[+-].*/) ? thisYear + parseInt(value, 10) :
            parseInt(value, 10)));
          return (isNaN(year) ? thisYear : year);
        };
        var year = determineYear(years[0]);
        var endYear = Math.max(year, determineYear(years[1] || ''));
        year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
        endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
        inst.yearshtml += '<select class="ui-datepicker-year" ' +
          'onchange="DP_jQuery_' + dpuuid + '.datepicker._selectMonthYear(\'#' + inst.id + '\', this, \'Y\');" ' +
          'onclick="DP_jQuery_' + dpuuid + '.datepicker._clickMonthYear(\'#' + inst.id + '\');"' +
          '>';
        for (; year <= endYear; year++) {
          inst.yearshtml += '<option value="' + year + '"' +
            (year == drawYear ? ' selected="selected"' : '') +
            '>' + year + '</option>';
        }
        inst.yearshtml += '</select>';
        //when showing there is no need for later update
        if( ! $.browser.mozilla ){
          html += inst.yearshtml;
          inst.yearshtml = null;
        } else {
          // will be replaced later with inst.yearshtml
          html += '<select class="ui-datepicker-year"><option value="' + drawYear + '" selected="selected">' + drawYear + '</option></select>';
        }
      }
    }
    html += this._get(inst, 'yearSuffix');
    if (showMonthAfterYear)
      html += (secondary || !(changeMonth && changeYear) ? '&#xa0;' : '') + monthHtml;
    html += '</div>'; // Close datepicker_header
    return html;
  },

  /* Adjust one of the date sub-fields. */
  _adjustInstDate: function(inst, offset, period) {
    var year = inst.drawYear + (period == 'Y' ? offset : 0);
    var month = inst.drawMonth + (period == 'M' ? offset : 0);
    var day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) +
      (period == 'D' ? offset : 0);
    var date = this._restrictMinMax(inst,
      this._daylightSavingAdjust(new Date(year, month, day)));
    inst.selectedDay = date.getDate();
    inst.drawMonth = inst.selectedMonth = date.getMonth();
    inst.drawYear = inst.selectedYear = date.getFullYear();
    if (period == 'M' || period == 'Y')
      this._notifyChange(inst);
  },

  /* Ensure a date is within any min/max bounds. */
  _restrictMinMax: function(inst, date) {
    var minDate = this._getMinMaxDate(inst, 'min');
    var maxDate = this._getMinMaxDate(inst, 'max');
    var newDate = (minDate && date < minDate ? minDate : date);
    newDate = (maxDate && newDate > maxDate ? maxDate : newDate);
    return newDate;
  },

  /* Notify change of month/year. */
  _notifyChange: function(inst) {
    var onChange = this._get(inst, 'onChangeMonthYear');
    if (onChange)
      onChange.apply((inst.input ? inst.input[0] : null),
        [inst.selectedYear, inst.selectedMonth + 1, inst]);
  },

  /* Determine the number of months to show. */
  _getNumberOfMonths: function(inst) {
    var numMonths = this._get(inst, 'numberOfMonths');
    return (numMonths == null ? [1, 1] : (typeof numMonths == 'number' ? [1, numMonths] : numMonths));
  },

  /* Determine the current maximum date - ensure no time components are set. */
  _getMinMaxDate: function(inst, minMax) {
    return this._determineDate(inst, this._get(inst, minMax + 'Date'), null);
  },

  /* Find the number of days in a given month. */
  _getDaysInMonth: function(year, month) {
    return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
  },

  /* Find the day of the week of the first of a month. */
  _getFirstDayOfMonth: function(year, month) {
    return new Date(year, month, 1).getDay();
  },

  /* Determines if we should allow a "next/prev" month display change. */
  _canAdjustMonth: function(inst, offset, curYear, curMonth) {
    var numMonths = this._getNumberOfMonths(inst);
    var date = this._daylightSavingAdjust(new Date(curYear,
      curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));
    if (offset < 0)
      date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
    return this._isInRange(inst, date);
  },

  /* Is the given date in the accepted range? */
  _isInRange: function(inst, date) {
    var minDate = this._getMinMaxDate(inst, 'min');
    var maxDate = this._getMinMaxDate(inst, 'max');
    return ((!minDate || date.getTime() >= minDate.getTime()) &&
      (!maxDate || date.getTime() <= maxDate.getTime()));
  },

  /* Provide the configuration settings for formatting/parsing. */
  _getFormatConfig: function(inst) {
    var shortYearCutoff = this._get(inst, 'shortYearCutoff');
    shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff :
      new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
    return {shortYearCutoff: shortYearCutoff,
      dayNamesShort: this._get(inst, 'dayNamesShort'), dayNames: this._get(inst, 'dayNames'),
      monthNamesShort: this._get(inst, 'monthNamesShort'), monthNames: this._get(inst, 'monthNames')};
  },

  /* Format the given date for display. */
  _formatDate: function(inst, day, month, year) {
    if (!day) {
      inst.currentDay = inst.selectedDay;
      inst.currentMonth = inst.selectedMonth;
      inst.currentYear = inst.selectedYear;
    }
    var date = (day ? (typeof day == 'object' ? day :
      this._daylightSavingAdjust(new Date(year, month, day))) :
      this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
    return this.formatDate(this._get(inst, 'dateFormat'), date, this._getFormatConfig(inst));
  }
});

/* jQuery extend now ignores nulls! */
function extendRemove(target, props) {
  $.extend(target, props);
  for (var name in props)
    if (props[name] == null || props[name] == undefined)
      target[name] = props[name];
  return target;
};

/* Determine whether an object is an array. */
function isArray(a) {
  return (a && (($.browser.safari && typeof a == 'object' && a.length) ||
    (a.constructor && a.constructor.toString().match(/\Array\(\)/))));
};

/* Invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
                    Object - settings for attaching new datepicker functionality
   @return  jQuery object */
$.fn.datepicker = function(options){
  
  /* Verify an empty collection wasn't passed - Fixes #6976 */
  if ( !this.length ) {
    return this;
  }
  
  /* Initialise the date picker. */
  if (!$.datepicker.initialized) {
    $(document).mousedown($.datepicker._checkExternalClick).
      find('body').append($.datepicker.dpDiv);
    $.datepicker.initialized = true;
  }

  var otherArgs = Array.prototype.slice.call(arguments, 1);
  if (typeof options == 'string' && (options == 'isDisabled' || options == 'getDate' || options == 'widget'))
    return $.datepicker['_' + options + 'Datepicker'].
      apply($.datepicker, [this[0]].concat(otherArgs));
  if (options == 'option' && arguments.length == 2 && typeof arguments[1] == 'string')
    return $.datepicker['_' + options + 'Datepicker'].
      apply($.datepicker, [this[0]].concat(otherArgs));
  return this.each(function() {
    typeof options == 'string' ?
      $.datepicker['_' + options + 'Datepicker'].
        apply($.datepicker, [this].concat(otherArgs)) :
      $.datepicker._attachDatepicker(this, options);
  });
};

$.datepicker = new Datepicker(); // singleton instance
$.datepicker.initialized = false;
$.datepicker.uuid = new Date().getTime();
$.datepicker.version = "1.8.12";

// Workaround for #4055
// Add another global to avoid noConflict issues with inline event handlers
window['DP_jQuery_' + dpuuid] = $;

})(jQuery);
/*
 * jQuery UI Dialog 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Dialog
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.ui.button.js
 *  jquery.ui.draggable.js
 *  jquery.ui.mouse.js
 *  jquery.ui.position.js
 *  jquery.ui.resizable.js
 */
(function( $, undefined ) {

var uiDialogClasses =
    'ui-dialog ' +
    'ui-widget ' +
    'ui-widget-content ' +
    'ui-corner-all ',
  sizeRelatedOptions = {
    buttons: true,
    height: true,
    maxHeight: true,
    maxWidth: true,
    minHeight: true,
    minWidth: true,
    width: true
  },
  resizableRelatedOptions = {
    maxHeight: true,
    maxWidth: true,
    minHeight: true,
    minWidth: true
  },
  // support for jQuery 1.3.2 - handle common attrFn methods for dialog
  attrFn = $.attrFn || {
    val: true,
    css: true,
    html: true,
    text: true,
    data: true,
    width: true,
    height: true,
    offset: true,
    click: true
  };

$.widget("ui.dialog", {
  options: {
    autoOpen: true,
    buttons: {},
    closeOnEscape: true,
    closeText: 'close',
    dialogClass: '',
    draggable: true,
    hide: null,
    height: 'auto',
    maxHeight: false,
    maxWidth: false,
    minHeight: 150,
    minWidth: 150,
    modal: false,
    position: {
      my: 'center',
      at: 'center',
      collision: 'fit',
      // ensure that the titlebar is never outside the document
      using: function(pos) {
        var topOffset = $(this).css(pos).offset().top;
        if (topOffset < 0) {
          $(this).css('top', pos.top - topOffset);
        }
      }
    },
    resizable: true,
    show: null,
    stack: true,
    title: '',
    width: 300,
    zIndex: 1000
  },

  _create: function() {
    this.originalTitle = this.element.attr('title');
    // #5742 - .attr() might return a DOMElement
    if ( typeof this.originalTitle !== "string" ) {
      this.originalTitle = "";
    }

    this.options.title = this.options.title || this.originalTitle;
    var self = this,
      options = self.options,

      title = options.title || '&#160;',
      titleId = $.ui.dialog.getTitleId(self.element),

      uiDialog = (self.uiDialog = $('<div></div>'))
        .appendTo(document.body)
        .hide()
        .addClass(uiDialogClasses + options.dialogClass)
        .css({
          zIndex: options.zIndex
        })
        // setting tabIndex makes the div focusable
        // setting outline to 0 prevents a border on focus in Mozilla
        .attr('tabIndex', -1).css('outline', 0).keydown(function(event) {
          if (options.closeOnEscape && event.keyCode &&
            event.keyCode === $.ui.keyCode.ESCAPE) {
            
            self.close(event);
            event.preventDefault();
          }
        })
        .attr({
          role: 'dialog',
          'aria-labelledby': titleId
        })
        .mousedown(function(event) {
          self.moveToTop(false, event);
        }),

      uiDialogContent = self.element
        .show()
        .removeAttr('title')
        .addClass(
          'ui-dialog-content ' +
          'ui-widget-content')
        .appendTo(uiDialog),

      uiDialogTitlebar = (self.uiDialogTitlebar = $('<div></div>'))
        .addClass(
          'ui-dialog-titlebar ' +
          'ui-widget-header ' +
          'ui-corner-all ' +
          'ui-helper-clearfix'
        )
        .prependTo(uiDialog),

      uiDialogTitlebarClose = $('<a href="#"></a>')
        .addClass(
          'ui-dialog-titlebar-close ' +
          'ui-corner-all'
        )
        .attr('role', 'button')
        .hover(
          function() {
            uiDialogTitlebarClose.addClass('ui-state-hover');
          },
          function() {
            uiDialogTitlebarClose.removeClass('ui-state-hover');
          }
        )
        .focus(function() {
          uiDialogTitlebarClose.addClass('ui-state-focus');
        })
        .blur(function() {
          uiDialogTitlebarClose.removeClass('ui-state-focus');
        })
        .click(function(event) {
          self.close(event);
          return false;
        })
        .appendTo(uiDialogTitlebar),

      uiDialogTitlebarCloseText = (self.uiDialogTitlebarCloseText = $('<span></span>'))
        .addClass(
          'ui-icon ' +
          'ui-icon-closethick'
        )
        .text(options.closeText)
        .appendTo(uiDialogTitlebarClose),

      uiDialogTitle = $('<span></span>')
        .addClass('ui-dialog-title')
        .attr('id', titleId)
        .html(title)
        .prependTo(uiDialogTitlebar);

    //handling of deprecated beforeclose (vs beforeClose) option
    //Ticket #4669 http://dev.jqueryui.com/ticket/4669
    //TODO: remove in 1.9pre
    if ($.isFunction(options.beforeclose) && !$.isFunction(options.beforeClose)) {
      options.beforeClose = options.beforeclose;
    }

    uiDialogTitlebar.find("*").add(uiDialogTitlebar).disableSelection();

    if (options.draggable && $.fn.draggable) {
      self._makeDraggable();
    }
    if (options.resizable && $.fn.resizable) {
      self._makeResizable();
    }

    self._createButtons(options.buttons);
    self._isOpen = false;

    if ($.fn.bgiframe) {
      uiDialog.bgiframe();
    }
  },

  _init: function() {
    if ( this.options.autoOpen ) {
      this.open();
    }
  },

  destroy: function() {
    var self = this;
    
    if (self.overlay) {
      self.overlay.destroy();
    }
    self.uiDialog.hide();
    self.element
      .unbind('.dialog')
      .removeData('dialog')
      .removeClass('ui-dialog-content ui-widget-content')
      .hide().appendTo('body');
    self.uiDialog.remove();

    if (self.originalTitle) {
      self.element.attr('title', self.originalTitle);
    }

    return self;
  },

  widget: function() {
    return this.uiDialog;
  },

  close: function(event) {
    var self = this,
      maxZ, thisZ;
    
    if (false === self._trigger('beforeClose', event)) {
      return;
    }

    if (self.overlay) {
      self.overlay.destroy();
    }
    self.uiDialog.unbind('keypress.ui-dialog');

    self._isOpen = false;

    if (self.options.hide) {
      self.uiDialog.hide(self.options.hide, function() {
        self._trigger('close', event);
      });
    } else {
      self.uiDialog.hide();
      self._trigger('close', event);
    }

    $.ui.dialog.overlay.resize();

    // adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
    if (self.options.modal) {
      maxZ = 0;
      $('.ui-dialog').each(function() {
        if (this !== self.uiDialog[0]) {
          thisZ = $(this).css('z-index');
          if(!isNaN(thisZ)) {
            maxZ = Math.max(maxZ, thisZ);
          }
        }
      });
      $.ui.dialog.maxZ = maxZ;
    }

    return self;
  },

  isOpen: function() {
    return this._isOpen;
  },

  // the force parameter allows us to move modal dialogs to their correct
  // position on open
  moveToTop: function(force, event) {
    var self = this,
      options = self.options,
      saveScroll;

    if ((options.modal && !force) ||
      (!options.stack && !options.modal)) {
      return self._trigger('focus', event);
    }

    if (options.zIndex > $.ui.dialog.maxZ) {
      $.ui.dialog.maxZ = options.zIndex;
    }
    if (self.overlay) {
      $.ui.dialog.maxZ += 1;
      self.overlay.$el.css('z-index', $.ui.dialog.overlay.maxZ = $.ui.dialog.maxZ);
    }

    //Save and then restore scroll since Opera 9.5+ resets when parent z-Index is changed.
    //  http://ui.jquery.com/bugs/ticket/3193
    saveScroll = { scrollTop: self.element.attr('scrollTop'), scrollLeft: self.element.attr('scrollLeft') };
    $.ui.dialog.maxZ += 1;
    self.uiDialog.css('z-index', $.ui.dialog.maxZ);
    self.element.attr(saveScroll);
    self._trigger('focus', event);

    return self;
  },

  open: function() {
    if (this._isOpen) { return; }

    var self = this,
      options = self.options,
      uiDialog = self.uiDialog;

    self.overlay = options.modal ? new $.ui.dialog.overlay(self) : null;
    self._size();
    self._position(options.position);
    uiDialog.show(options.show);
    self.moveToTop(true);

    // prevent tabbing out of modal dialogs
    if (options.modal) {
      uiDialog.bind('keypress.ui-dialog', function(event) {
        if (event.keyCode !== $.ui.keyCode.TAB) {
          return;
        }

        var tabbables = $(':tabbable', this),
          first = tabbables.filter(':first'),
          last  = tabbables.filter(':last');

        if (event.target === last[0] && !event.shiftKey) {
          first.focus(1);
          return false;
        } else if (event.target === first[0] && event.shiftKey) {
          last.focus(1);
          return false;
        }
      });
    }

    // set focus to the first tabbable element in the content area or the first button
    // if there are no tabbable elements, set focus on the dialog itself
    $(self.element.find(':tabbable').get().concat(
      uiDialog.find('.ui-dialog-buttonpane :tabbable').get().concat(
        uiDialog.get()))).eq(0).focus();

    self._isOpen = true;
    self._trigger('open');

    return self;
  },

  _createButtons: function(buttons) {
    var self = this,
      hasButtons = false,
      uiDialogButtonPane = $('<div></div>')
        .addClass(
          'ui-dialog-buttonpane ' +
          'ui-widget-content ' +
          'ui-helper-clearfix'
        ),
      uiButtonSet = $( "<div></div>" )
        .addClass( "ui-dialog-buttonset" )
        .appendTo( uiDialogButtonPane );

    // if we already have a button pane, remove it
    self.uiDialog.find('.ui-dialog-buttonpane').remove();

    if (typeof buttons === 'object' && buttons !== null) {
      $.each(buttons, function() {
        return !(hasButtons = true);
      });
    }
    if (hasButtons) {
      $.each(buttons, function(name, props) {
        props = $.isFunction( props ) ?
          { click: props, text: name } :
          props;
        var button = $('<button type="button"></button>')
          .click(function() {
            props.click.apply(self.element[0], arguments);
          })
          .appendTo(uiButtonSet);
        // can't use .attr( props, true ) with jQuery 1.3.2.
        $.each( props, function( key, value ) {
          if ( key === "click" ) {
            return;
          }
          if ( key in attrFn ) {
            button[ key ]( value );
          } else {
            button.attr( key, value );
          }
        });
        if ($.fn.button) {
          button.button();
        }
      });
      uiDialogButtonPane.appendTo(self.uiDialog);
    }
  },

  _makeDraggable: function() {
    var self = this,
      options = self.options,
      doc = $(document),
      heightBeforeDrag;

    function filteredUi(ui) {
      return {
        position: ui.position,
        offset: ui.offset
      };
    }

    self.uiDialog.draggable({
      cancel: '.ui-dialog-content, .ui-dialog-titlebar-close',
      handle: '.ui-dialog-titlebar',
      containment: 'document',
      start: function(event, ui) {
        heightBeforeDrag = options.height === "auto" ? "auto" : $(this).height();
        $(this).height($(this).height()).addClass("ui-dialog-dragging");
        self._trigger('dragStart', event, filteredUi(ui));
      },
      drag: function(event, ui) {
        self._trigger('drag', event, filteredUi(ui));
      },
      stop: function(event, ui) {
        options.position = [ui.position.left - doc.scrollLeft(),
          ui.position.top - doc.scrollTop()];
        $(this).removeClass("ui-dialog-dragging").height(heightBeforeDrag);
        self._trigger('dragStop', event, filteredUi(ui));
        $.ui.dialog.overlay.resize();
      }
    });
  },

  _makeResizable: function(handles) {
    handles = (handles === undefined ? this.options.resizable : handles);
    var self = this,
      options = self.options,
      // .ui-resizable has position: relative defined in the stylesheet
      // but dialogs have to use absolute or fixed positioning
      position = self.uiDialog.css('position'),
      resizeHandles = (typeof handles === 'string' ?
        handles :
        'n,e,s,w,se,sw,ne,nw'
      );

    function filteredUi(ui) {
      return {
        originalPosition: ui.originalPosition,
        originalSize: ui.originalSize,
        position: ui.position,
        size: ui.size
      };
    }

    self.uiDialog.resizable({
      cancel: '.ui-dialog-content',
      containment: 'document',
      alsoResize: self.element,
      maxWidth: options.maxWidth,
      maxHeight: options.maxHeight,
      minWidth: options.minWidth,
      minHeight: self._minHeight(),
      handles: resizeHandles,
      start: function(event, ui) {
        $(this).addClass("ui-dialog-resizing");
        self._trigger('resizeStart', event, filteredUi(ui));
      },
      resize: function(event, ui) {
        self._trigger('resize', event, filteredUi(ui));
      },
      stop: function(event, ui) {
        $(this).removeClass("ui-dialog-resizing");
        options.height = $(this).height();
        options.width = $(this).width();
        self._trigger('resizeStop', event, filteredUi(ui));
        $.ui.dialog.overlay.resize();
      }
    })
    .css('position', position)
    .find('.ui-resizable-se').addClass('ui-icon ui-icon-grip-diagonal-se');
  },

  _minHeight: function() {
    var options = this.options;

    if (options.height === 'auto') {
      return options.minHeight;
    } else {
      return Math.min(options.minHeight, options.height);
    }
  },

  _position: function(position) {
    var myAt = [],
      offset = [0, 0],
      isVisible;

    if (position) {
      // deep extending converts arrays to objects in jQuery <= 1.3.2 :-(
  //    if (typeof position == 'string' || $.isArray(position)) {
  //      myAt = $.isArray(position) ? position : position.split(' ');

      if (typeof position === 'string' || (typeof position === 'object' && '0' in position)) {
        myAt = position.split ? position.split(' ') : [position[0], position[1]];
        if (myAt.length === 1) {
          myAt[1] = myAt[0];
        }

        $.each(['left', 'top'], function(i, offsetPosition) {
          if (+myAt[i] === myAt[i]) {
            offset[i] = myAt[i];
            myAt[i] = offsetPosition;
          }
        });

        position = {
          my: myAt.join(" "),
          at: myAt.join(" "),
          offset: offset.join(" ")
        };
      } 

      position = $.extend({}, $.ui.dialog.prototype.options.position, position);
    } else {
      position = $.ui.dialog.prototype.options.position;
    }

    // need to show the dialog to get the actual offset in the position plugin
    isVisible = this.uiDialog.is(':visible');
    if (!isVisible) {
      this.uiDialog.show();
    }
    this.uiDialog
      // workaround for jQuery bug #5781 http://dev.jquery.com/ticket/5781
      .css({ top: 0, left: 0 })
      .position($.extend({ of: window }, position));
    if (!isVisible) {
      this.uiDialog.hide();
    }
  },

  _setOptions: function( options ) {
    var self = this,
      resizableOptions = {},
      resize = false;

    $.each( options, function( key, value ) {
      self._setOption( key, value );
      
      if ( key in sizeRelatedOptions ) {
        resize = true;
      }
      if ( key in resizableRelatedOptions ) {
        resizableOptions[ key ] = value;
      }
    });

    if ( resize ) {
      this._size();
    }
    if ( this.uiDialog.is( ":data(resizable)" ) ) {
      this.uiDialog.resizable( "option", resizableOptions );
    }
  },

  _setOption: function(key, value){
    var self = this,
      uiDialog = self.uiDialog;

    switch (key) {
      //handling of deprecated beforeclose (vs beforeClose) option
      //Ticket #4669 http://dev.jqueryui.com/ticket/4669
      //TODO: remove in 1.9pre
      case "beforeclose":
        key = "beforeClose";
        break;
      case "buttons":
        self._createButtons(value);
        break;
      case "closeText":
        // ensure that we always pass a string
        self.uiDialogTitlebarCloseText.text("" + value);
        break;
      case "dialogClass":
        uiDialog
          .removeClass(self.options.dialogClass)
          .addClass(uiDialogClasses + value);
        break;
      case "disabled":
        if (value) {
          uiDialog.addClass('ui-dialog-disabled');
        } else {
          uiDialog.removeClass('ui-dialog-disabled');
        }
        break;
      case "draggable":
        var isDraggable = uiDialog.is( ":data(draggable)" );
        if ( isDraggable && !value ) {
          uiDialog.draggable( "destroy" );
        }
        
        if ( !isDraggable && value ) {
          self._makeDraggable();
        }
        break;
      case "position":
        self._position(value);
        break;
      case "resizable":
        // currently resizable, becoming non-resizable
        var isResizable = uiDialog.is( ":data(resizable)" );
        if (isResizable && !value) {
          uiDialog.resizable('destroy');
        }

        // currently resizable, changing handles
        if (isResizable && typeof value === 'string') {
          uiDialog.resizable('option', 'handles', value);
        }

        // currently non-resizable, becoming resizable
        if (!isResizable && value !== false) {
          self._makeResizable(value);
        }
        break;
      case "title":
        // convert whatever was passed in o a string, for html() to not throw up
        $(".ui-dialog-title", self.uiDialogTitlebar).html("" + (value || '&#160;'));
        break;
    }

    $.Widget.prototype._setOption.apply(self, arguments);
  },

  _size: function() {
    /* If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
     * divs will both have width and height set, so we need to reset them
     */
    var options = this.options,
      nonContentHeight,
      minContentHeight,
      isVisible = this.uiDialog.is( ":visible" );

    // reset content sizing
    this.element.show().css({
      width: 'auto',
      minHeight: 0,
      height: 0
    });

    if (options.minWidth > options.width) {
      options.width = options.minWidth;
    }

    // reset wrapper sizing
    // determine the height of all the non-content elements
    nonContentHeight = this.uiDialog.css({
        height: 'auto',
        width: options.width
      })
      .height();
    minContentHeight = Math.max( 0, options.minHeight - nonContentHeight );
    
    if ( options.height === "auto" ) {
      // only needed for IE6 support
      if ( $.support.minHeight ) {
        this.element.css({
          minHeight: minContentHeight,
          height: "auto"
        });
      } else {
        this.uiDialog.show();
        var autoHeight = this.element.css( "height", "auto" ).height();
        if ( !isVisible ) {
          this.uiDialog.hide();
        }
        this.element.height( Math.max( autoHeight, minContentHeight ) );
      }
    } else {
      this.element.height( Math.max( options.height - nonContentHeight, 0 ) );
    }

    if (this.uiDialog.is(':data(resizable)')) {
      this.uiDialog.resizable('option', 'minHeight', this._minHeight());
    }
  }
});

$.extend($.ui.dialog, {
  version: "1.8.12",

  uuid: 0,
  maxZ: 0,

  getTitleId: function($el) {
    var id = $el.attr('id');
    if (!id) {
      this.uuid += 1;
      id = this.uuid;
    }
    return 'ui-dialog-title-' + id;
  },

  overlay: function(dialog) {
    this.$el = $.ui.dialog.overlay.create(dialog);
  }
});

$.extend($.ui.dialog.overlay, {
  instances: [],
  // reuse old instances due to IE memory leak with alpha transparency (see #5185)
  oldInstances: [],
  maxZ: 0,
  events: $.map('focus,mousedown,mouseup,keydown,keypress,click'.split(','),
    function(event) { return event + '.dialog-overlay'; }).join(' '),
  create: function(dialog) {
    if (this.instances.length === 0) {
      // prevent use of anchors and inputs
      // we use a setTimeout in case the overlay is created from an
      // event that we're going to be cancelling (see #2804)
      setTimeout(function() {
        // handle $(el).dialog().dialog('close') (see #4065)
        if ($.ui.dialog.overlay.instances.length) {
          $(document).bind($.ui.dialog.overlay.events, function(event) {
            // stop events if the z-index of the target is < the z-index of the overlay
            // we cannot return true when we don't want to cancel the event (#3523)
            if ($(event.target).zIndex() < $.ui.dialog.overlay.maxZ) {
              return false;
            }
          });
        }
      }, 1);

      // allow closing by pressing the escape key
      $(document).bind('keydown.dialog-overlay', function(event) {
        if (dialog.options.closeOnEscape && event.keyCode &&
          event.keyCode === $.ui.keyCode.ESCAPE) {
          
          dialog.close(event);
          event.preventDefault();
        }
      });

      // handle window resize
      $(window).bind('resize.dialog-overlay', $.ui.dialog.overlay.resize);
    }

    var $el = (this.oldInstances.pop() || $('<div></div>').addClass('ui-widget-overlay'))
      .appendTo(document.body)
      .css({
        width: this.width(),
        height: this.height()
      });

    if ($.fn.bgiframe) {
      $el.bgiframe();
    }

    this.instances.push($el);
    return $el;
  },

  destroy: function($el) {
    var indexOf = $.inArray($el, this.instances);
    if (indexOf != -1){
      this.oldInstances.push(this.instances.splice(indexOf, 1)[0]);
    }

    if (this.instances.length === 0) {
      $([document, window]).unbind('.dialog-overlay');
    }

    $el.remove();
    
    // adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
    var maxZ = 0;
    $.each(this.instances, function() {
      maxZ = Math.max(maxZ, this.css('z-index'));
    });
    this.maxZ = maxZ;
  },

  height: function() {
    var scrollHeight,
      offsetHeight;
    // handle IE 6
    if ($.browser.msie && $.browser.version < 7) {
      scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      offsetHeight = Math.max(
        document.documentElement.offsetHeight,
        document.body.offsetHeight
      );

      if (scrollHeight < offsetHeight) {
        return $(window).height() + 'px';
      } else {
        return scrollHeight + 'px';
      }
    // handle "good" browsers
    } else {
      return $(document).height() + 'px';
    }
  },

  width: function() {
    var scrollWidth,
      offsetWidth;
    // handle IE 6
    if ($.browser.msie && $.browser.version < 7) {
      scrollWidth = Math.max(
        document.documentElement.scrollWidth,
        document.body.scrollWidth
      );
      offsetWidth = Math.max(
        document.documentElement.offsetWidth,
        document.body.offsetWidth
      );

      if (scrollWidth < offsetWidth) {
        return $(window).width() + 'px';
      } else {
        return scrollWidth + 'px';
      }
    // handle "good" browsers
    } else {
      return $(document).width() + 'px';
    }
  },

  resize: function() {
    /* If the dialog is draggable and the user drags it past the
     * right edge of the window, the document becomes wider so we
     * need to stretch the overlay. If the user then drags the
     * dialog back to the left, the document will become narrower,
     * so we need to shrink the overlay to the appropriate size.
     * This is handled by shrinking the overlay before setting it
     * to the full document size.
     */
    var $overlays = $([]);
    $.each($.ui.dialog.overlay.instances, function() {
      $overlays = $overlays.add(this);
    });

    $overlays.css({
      width: 0,
      height: 0
    }).css({
      width: $.ui.dialog.overlay.width(),
      height: $.ui.dialog.overlay.height()
    });
  }
});

$.extend($.ui.dialog.overlay.prototype, {
  destroy: function() {
    $.ui.dialog.overlay.destroy(this.$el);
  }
});

}(jQuery));
/*
 * jQuery UI Position 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Position
 */
(function( $, undefined ) {

$.ui = $.ui || {};

var horizontalPositions = /left|center|right/,
  verticalPositions = /top|center|bottom/,
  center = "center",
  _position = $.fn.position,
  _offset = $.fn.offset;

$.fn.position = function( options ) {
  if ( !options || !options.of ) {
    return _position.apply( this, arguments );
  }

  // make a copy, we don't want to modify arguments
  options = $.extend( {}, options );

  var target = $( options.of ),
    targetElem = target[0],
    collision = ( options.collision || "flip" ).split( " " ),
    offset = options.offset ? options.offset.split( " " ) : [ 0, 0 ],
    targetWidth,
    targetHeight,
    basePosition;

  if ( targetElem.nodeType === 9 ) {
    targetWidth = target.width();
    targetHeight = target.height();
    basePosition = { top: 0, left: 0 };
  // TODO: use $.isWindow() in 1.9
  } else if ( targetElem.setTimeout ) {
    targetWidth = target.width();
    targetHeight = target.height();
    basePosition = { top: target.scrollTop(), left: target.scrollLeft() };
  } else if ( targetElem.preventDefault ) {
    // force left top to allow flipping
    options.at = "left top";
    targetWidth = targetHeight = 0;
    basePosition = { top: options.of.pageY, left: options.of.pageX };
  } else {
    targetWidth = target.outerWidth();
    targetHeight = target.outerHeight();
    basePosition = target.offset();
  }

  // force my and at to have valid horizontal and veritcal positions
  // if a value is missing or invalid, it will be converted to center 
  $.each( [ "my", "at" ], function() {
    var pos = ( options[this] || "" ).split( " " );
    if ( pos.length === 1) {
      pos = horizontalPositions.test( pos[0] ) ?
        pos.concat( [center] ) :
        verticalPositions.test( pos[0] ) ?
          [ center ].concat( pos ) :
          [ center, center ];
    }
    pos[ 0 ] = horizontalPositions.test( pos[0] ) ? pos[ 0 ] : center;
    pos[ 1 ] = verticalPositions.test( pos[1] ) ? pos[ 1 ] : center;
    options[ this ] = pos;
  });

  // normalize collision option
  if ( collision.length === 1 ) {
    collision[ 1 ] = collision[ 0 ];
  }

  // normalize offset option
  offset[ 0 ] = parseInt( offset[0], 10 ) || 0;
  if ( offset.length === 1 ) {
    offset[ 1 ] = offset[ 0 ];
  }
  offset[ 1 ] = parseInt( offset[1], 10 ) || 0;

  if ( options.at[0] === "right" ) {
    basePosition.left += targetWidth;
  } else if ( options.at[0] === center ) {
    basePosition.left += targetWidth / 2;
  }

  if ( options.at[1] === "bottom" ) {
    basePosition.top += targetHeight;
  } else if ( options.at[1] === center ) {
    basePosition.top += targetHeight / 2;
  }

  basePosition.left += offset[ 0 ];
  basePosition.top += offset[ 1 ];

  return this.each(function() {
    var elem = $( this ),
      elemWidth = elem.outerWidth(),
      elemHeight = elem.outerHeight(),
      marginLeft = parseInt( $.curCSS( this, "marginLeft", true ) ) || 0,
      marginTop = parseInt( $.curCSS( this, "marginTop", true ) ) || 0,
      collisionWidth = elemWidth + marginLeft +
        ( parseInt( $.curCSS( this, "marginRight", true ) ) || 0 ),
      collisionHeight = elemHeight + marginTop +
        ( parseInt( $.curCSS( this, "marginBottom", true ) ) || 0 ),
      position = $.extend( {}, basePosition ),
      collisionPosition;

    if ( options.my[0] === "right" ) {
      position.left -= elemWidth;
    } else if ( options.my[0] === center ) {
      position.left -= elemWidth / 2;
    }

    if ( options.my[1] === "bottom" ) {
      position.top -= elemHeight;
    } else if ( options.my[1] === center ) {
      position.top -= elemHeight / 2;
    }

    // prevent fractions (see #5280)
    position.left = Math.round( position.left );
    position.top = Math.round( position.top );

    collisionPosition = {
      left: position.left - marginLeft,
      top: position.top - marginTop
    };

    $.each( [ "left", "top" ], function( i, dir ) {
      if ( $.ui.position[ collision[i] ] ) {
        $.ui.position[ collision[i] ][ dir ]( position, {
          targetWidth: targetWidth,
          targetHeight: targetHeight,
          elemWidth: elemWidth,
          elemHeight: elemHeight,
          collisionPosition: collisionPosition,
          collisionWidth: collisionWidth,
          collisionHeight: collisionHeight,
          offset: offset,
          my: options.my,
          at: options.at
        });
      }
    });

    if ( $.fn.bgiframe ) {
      elem.bgiframe();
    }
    elem.offset( $.extend( position, { using: options.using } ) );
  });
};

$.ui.position = {
  fit: {
    left: function( position, data ) {
      var win = $( window ),
        over = data.collisionPosition.left + data.collisionWidth - win.width() - win.scrollLeft();
      position.left = over > 0 ? position.left - over : Math.max( position.left - data.collisionPosition.left, position.left );
    },
    top: function( position, data ) {
      var win = $( window ),
        over = data.collisionPosition.top + data.collisionHeight - win.height() - win.scrollTop();
      position.top = over > 0 ? position.top - over : Math.max( position.top - data.collisionPosition.top, position.top );
    }
  },

  flip: {
    left: function( position, data ) {
      if ( data.at[0] === center ) {
        return;
      }
      var win = $( window ),
        over = data.collisionPosition.left + data.collisionWidth - win.width() - win.scrollLeft(),
        myOffset = data.my[ 0 ] === "left" ?
          -data.elemWidth :
          data.my[ 0 ] === "right" ?
            data.elemWidth :
            0,
        atOffset = data.at[ 0 ] === "left" ?
          data.targetWidth :
          -data.targetWidth,
        offset = -2 * data.offset[ 0 ];
      position.left += data.collisionPosition.left < 0 ?
        myOffset + atOffset + offset :
        over > 0 ?
          myOffset + atOffset + offset :
          0;
    },
    top: function( position, data ) {
      if ( data.at[1] === center ) {
        return;
      }
      var win = $( window ),
        over = data.collisionPosition.top + data.collisionHeight - win.height() - win.scrollTop(),
        myOffset = data.my[ 1 ] === "top" ?
          -data.elemHeight :
          data.my[ 1 ] === "bottom" ?
            data.elemHeight :
            0,
        atOffset = data.at[ 1 ] === "top" ?
          data.targetHeight :
          -data.targetHeight,
        offset = -2 * data.offset[ 1 ];
      position.top += data.collisionPosition.top < 0 ?
        myOffset + atOffset + offset :
        over > 0 ?
          myOffset + atOffset + offset :
          0;
    }
  }
};

// offset setter from jQuery 1.4
if ( !$.offset.setOffset ) {
  $.offset.setOffset = function( elem, options ) {
    // set position first, in-case top/left are set even on static elem
    if ( /static/.test( $.curCSS( elem, "position" ) ) ) {
      elem.style.position = "relative";
    }
    var curElem   = $( elem ),
      curOffset = curElem.offset(),
      curTop    = parseInt( $.curCSS( elem, "top",  true ), 10 ) || 0,
      curLeft   = parseInt( $.curCSS( elem, "left", true ), 10)  || 0,
      props     = {
        top:  (options.top  - curOffset.top)  + curTop,
        left: (options.left - curOffset.left) + curLeft
      };
    
    if ( 'using' in options ) {
      options.using.call( elem, props );
    } else {
      curElem.css( props );
    }
  };

  $.fn.offset = function( options ) {
    var elem = this[ 0 ];
    if ( !elem || !elem.ownerDocument ) { return null; }
    if ( options ) { 
      return this.each(function() {
        $.offset.setOffset( this, options );
      });
    }
    return _offset.call( this );
  };
}

}( jQuery ));
/*
 * jQuery UI Progressbar 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Progressbar
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget( "ui.progressbar", {
  options: {
    value: 0,
    max: 100
  },

  min: 0,

  _create: function() {
    this.element
      .addClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
      .attr({
        role: "progressbar",
        "aria-valuemin": this.min,
        "aria-valuemax": this.options.max,
        "aria-valuenow": this._value()
      });

    this.valueDiv = $( "<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>" )
      .appendTo( this.element );

    this.oldValue = this._value();
    this._refreshValue();
  },

  destroy: function() {
    this.element
      .removeClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
      .removeAttr( "role" )
      .removeAttr( "aria-valuemin" )
      .removeAttr( "aria-valuemax" )
      .removeAttr( "aria-valuenow" );

    this.valueDiv.remove();

    $.Widget.prototype.destroy.apply( this, arguments );
  },

  value: function( newValue ) {
    if ( newValue === undefined ) {
      return this._value();
    }

    this._setOption( "value", newValue );
    return this;
  },

  _setOption: function( key, value ) {
    if ( key === "value" ) {
      this.options.value = value;
      this._refreshValue();
      if ( this._value() === this.options.max ) {
        this._trigger( "complete" );
      }
    }

    $.Widget.prototype._setOption.apply( this, arguments );
  },

  _value: function() {
    var val = this.options.value;
    // normalize invalid value
    if ( typeof val !== "number" ) {
      val = 0;
    }
    return Math.min( this.options.max, Math.max( this.min, val ) );
  },

  _percentage: function() {
    return 100 * this._value() / this.options.max;
  },

  _refreshValue: function() {
    var value = this.value();
    var percentage = this._percentage();

    if ( this.oldValue !== value ) {
      this.oldValue = value;
      this._trigger( "change" );
    }

    this.valueDiv
      .toggle( value > this.min )
      .toggleClass( "ui-corner-right", value === this.options.max )
      .width( percentage.toFixed(0) + "%" );
    this.element.attr( "aria-valuenow", value );
  }
});

$.extend( $.ui.progressbar, {
  version: "1.8.12"
});

})( jQuery );
/*
 * jQuery UI Slider 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Slider
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.mouse.js
 *  jquery.ui.widget.js
 */
(function( $, undefined ) {

// number of pages in a slider
// (how many times can you page up/down to go through the whole range)
var numPages = 5;

$.widget( "ui.slider", $.ui.mouse, {

  widgetEventPrefix: "slide",

  options: {
    animate: false,
    distance: 0,
    max: 100,
    min: 0,
    orientation: "horizontal",
    range: false,
    step: 1,
    value: 0,
    values: null
  },

  _create: function() {
    var self = this,
      o = this.options;

    this._keySliding = false;
    this._mouseSliding = false;
    this._animateOff = true;
    this._handleIndex = null;
    this._detectOrientation();
    this._mouseInit();

    this.element
      .addClass( "ui-slider" +
        " ui-slider-" + this.orientation +
        " ui-widget" +
        " ui-widget-content" +
        " ui-corner-all" );
    
    if ( o.disabled ) {
      this.element.addClass( "ui-slider-disabled ui-disabled" );
    }

    this.range = $([]);

    if ( o.range ) {
      if ( o.range === true ) {
        this.range = $( "<div></div>" );
        if ( !o.values ) {
          o.values = [ this._valueMin(), this._valueMin() ];
        }
        if ( o.values.length && o.values.length !== 2 ) {
          o.values = [ o.values[0], o.values[0] ];
        }
      } else {
        this.range = $( "<div></div>" );
      }

      this.range
        .appendTo( this.element )
        .addClass( "ui-slider-range" );

      if ( o.range === "min" || o.range === "max" ) {
        this.range.addClass( "ui-slider-range-" + o.range );
      }

      // note: this isn't the most fittingly semantic framework class for this element,
      // but worked best visually with a variety of themes
      this.range.addClass( "ui-widget-header" );
    }

    if ( $( ".ui-slider-handle", this.element ).length === 0 ) {
      $( "<a href='#'></a>" )
        .appendTo( this.element )
        .addClass( "ui-slider-handle" );
    }

    if ( o.values && o.values.length ) {
      while ( $(".ui-slider-handle", this.element).length < o.values.length ) {
        $( "<a href='#'></a>" )
          .appendTo( this.element )
          .addClass( "ui-slider-handle" );
      }
    }

    this.handles = $( ".ui-slider-handle", this.element )
      .addClass( "ui-state-default" +
        " ui-corner-all" );

    this.handle = this.handles.eq( 0 );

    this.handles.add( this.range ).filter( "a" )
      .click(function( event ) {
        event.preventDefault();
      })
      .hover(function() {
        if ( !o.disabled ) {
          $( this ).addClass( "ui-state-hover" );
        }
      }, function() {
        $( this ).removeClass( "ui-state-hover" );
      })
      .focus(function() {
        if ( !o.disabled ) {
          $( ".ui-slider .ui-state-focus" ).removeClass( "ui-state-focus" );
          $( this ).addClass( "ui-state-focus" );
        } else {
          $( this ).blur();
        }
      })
      .blur(function() {
        $( this ).removeClass( "ui-state-focus" );
      });

    this.handles.each(function( i ) {
      $( this ).data( "index.ui-slider-handle", i );
    });

    this.handles
      .keydown(function( event ) {
        var ret = true,
          index = $( this ).data( "index.ui-slider-handle" ),
          allowed,
          curVal,
          newVal,
          step;
  
        if ( self.options.disabled ) {
          return;
        }
  
        switch ( event.keyCode ) {
          case $.ui.keyCode.HOME:
          case $.ui.keyCode.END:
          case $.ui.keyCode.PAGE_UP:
          case $.ui.keyCode.PAGE_DOWN:
          case $.ui.keyCode.UP:
          case $.ui.keyCode.RIGHT:
          case $.ui.keyCode.DOWN:
          case $.ui.keyCode.LEFT:
            ret = false;
            if ( !self._keySliding ) {
              self._keySliding = true;
              $( this ).addClass( "ui-state-active" );
              allowed = self._start( event, index );
              if ( allowed === false ) {
                return;
              }
            }
            break;
        }
  
        step = self.options.step;
        if ( self.options.values && self.options.values.length ) {
          curVal = newVal = self.values( index );
        } else {
          curVal = newVal = self.value();
        }
  
        switch ( event.keyCode ) {
          case $.ui.keyCode.HOME:
            newVal = self._valueMin();
            break;
          case $.ui.keyCode.END:
            newVal = self._valueMax();
            break;
          case $.ui.keyCode.PAGE_UP:
            newVal = self._trimAlignValue( curVal + ( (self._valueMax() - self._valueMin()) / numPages ) );
            break;
          case $.ui.keyCode.PAGE_DOWN:
            newVal = self._trimAlignValue( curVal - ( (self._valueMax() - self._valueMin()) / numPages ) );
            break;
          case $.ui.keyCode.UP:
          case $.ui.keyCode.RIGHT:
            if ( curVal === self._valueMax() ) {
              return;
            }
            newVal = self._trimAlignValue( curVal + step );
            break;
          case $.ui.keyCode.DOWN:
          case $.ui.keyCode.LEFT:
            if ( curVal === self._valueMin() ) {
              return;
            }
            newVal = self._trimAlignValue( curVal - step );
            break;
        }
  
        self._slide( event, index, newVal );
  
        return ret;
  
      })
      .keyup(function( event ) {
        var index = $( this ).data( "index.ui-slider-handle" );
  
        if ( self._keySliding ) {
          self._keySliding = false;
          self._stop( event, index );
          self._change( event, index );
          $( this ).removeClass( "ui-state-active" );
        }
  
      });

    this._refreshValue();

    this._animateOff = false;
  },

  destroy: function() {
    this.handles.remove();
    this.range.remove();

    this.element
      .removeClass( "ui-slider" +
        " ui-slider-horizontal" +
        " ui-slider-vertical" +
        " ui-slider-disabled" +
        " ui-widget" +
        " ui-widget-content" +
        " ui-corner-all" )
      .removeData( "slider" )
      .unbind( ".slider" );

    this._mouseDestroy();

    return this;
  },

  _mouseCapture: function( event ) {
    var o = this.options,
      position,
      normValue,
      distance,
      closestHandle,
      self,
      index,
      allowed,
      offset,
      mouseOverHandle;

    if ( o.disabled ) {
      return false;
    }

    this.elementSize = {
      width: this.element.outerWidth(),
      height: this.element.outerHeight()
    };
    this.elementOffset = this.element.offset();

    position = { x: event.pageX, y: event.pageY };
    normValue = this._normValueFromMouse( position );
    distance = this._valueMax() - this._valueMin() + 1;
    self = this;
    this.handles.each(function( i ) {
      var thisDistance = Math.abs( normValue - self.values(i) );
      if ( distance > thisDistance ) {
        distance = thisDistance;
        closestHandle = $( this );
        index = i;
      }
    });

    // workaround for bug #3736 (if both handles of a range are at 0,
    // the first is always used as the one with least distance,
    // and moving it is obviously prevented by preventing negative ranges)
    if( o.range === true && this.values(1) === o.min ) {
      index += 1;
      closestHandle = $( this.handles[index] );
    }

    allowed = this._start( event, index );
    if ( allowed === false ) {
      return false;
    }
    this._mouseSliding = true;

    self._handleIndex = index;

    closestHandle
      .addClass( "ui-state-active" )
      .focus();
    
    offset = closestHandle.offset();
    mouseOverHandle = !$( event.target ).parents().andSelf().is( ".ui-slider-handle" );
    this._clickOffset = mouseOverHandle ? { left: 0, top: 0 } : {
      left: event.pageX - offset.left - ( closestHandle.width() / 2 ),
      top: event.pageY - offset.top -
        ( closestHandle.height() / 2 ) -
        ( parseInt( closestHandle.css("borderTopWidth"), 10 ) || 0 ) -
        ( parseInt( closestHandle.css("borderBottomWidth"), 10 ) || 0) +
        ( parseInt( closestHandle.css("marginTop"), 10 ) || 0)
    };

    if ( !this.handles.hasClass( "ui-state-hover" ) ) {
      this._slide( event, index, normValue );
    }
    this._animateOff = true;
    return true;
  },

  _mouseStart: function( event ) {
    return true;
  },

  _mouseDrag: function( event ) {
    var position = { x: event.pageX, y: event.pageY },
      normValue = this._normValueFromMouse( position );
    
    this._slide( event, this._handleIndex, normValue );

    return false;
  },

  _mouseStop: function( event ) {
    this.handles.removeClass( "ui-state-active" );
    this._mouseSliding = false;

    this._stop( event, this._handleIndex );
    this._change( event, this._handleIndex );

    this._handleIndex = null;
    this._clickOffset = null;
    this._animateOff = false;

    return false;
  },
  
  _detectOrientation: function() {
    this.orientation = ( this.options.orientation === "vertical" ) ? "vertical" : "horizontal";
  },

  _normValueFromMouse: function( position ) {
    var pixelTotal,
      pixelMouse,
      percentMouse,
      valueTotal,
      valueMouse;

    if ( this.orientation === "horizontal" ) {
      pixelTotal = this.elementSize.width;
      pixelMouse = position.x - this.elementOffset.left - ( this._clickOffset ? this._clickOffset.left : 0 );
    } else {
      pixelTotal = this.elementSize.height;
      pixelMouse = position.y - this.elementOffset.top - ( this._clickOffset ? this._clickOffset.top : 0 );
    }

    percentMouse = ( pixelMouse / pixelTotal );
    if ( percentMouse > 1 ) {
      percentMouse = 1;
    }
    if ( percentMouse < 0 ) {
      percentMouse = 0;
    }
    if ( this.orientation === "vertical" ) {
      percentMouse = 1 - percentMouse;
    }

    valueTotal = this._valueMax() - this._valueMin();
    valueMouse = this._valueMin() + percentMouse * valueTotal;

    return this._trimAlignValue( valueMouse );
  },

  _start: function( event, index ) {
    var uiHash = {
      handle: this.handles[ index ],
      value: this.value()
    };
    if ( this.options.values && this.options.values.length ) {
      uiHash.value = this.values( index );
      uiHash.values = this.values();
    }
    return this._trigger( "start", event, uiHash );
  },

  _slide: function( event, index, newVal ) {
    var otherVal,
      newValues,
      allowed;

    if ( this.options.values && this.options.values.length ) {
      otherVal = this.values( index ? 0 : 1 );

      if ( ( this.options.values.length === 2 && this.options.range === true ) && 
          ( ( index === 0 && newVal > otherVal) || ( index === 1 && newVal < otherVal ) )
        ) {
        newVal = otherVal;
      }

      if ( newVal !== this.values( index ) ) {
        newValues = this.values();
        newValues[ index ] = newVal;
        // A slide can be canceled by returning false from the slide callback
        allowed = this._trigger( "slide", event, {
          handle: this.handles[ index ],
          value: newVal,
          values: newValues
        } );
        otherVal = this.values( index ? 0 : 1 );
        if ( allowed !== false ) {
          this.values( index, newVal, true );
        }
      }
    } else {
      if ( newVal !== this.value() ) {
        // A slide can be canceled by returning false from the slide callback
        allowed = this._trigger( "slide", event, {
          handle: this.handles[ index ],
          value: newVal
        } );
        if ( allowed !== false ) {
          this.value( newVal );
        }
      }
    }
  },

  _stop: function( event, index ) {
    var uiHash = {
      handle: this.handles[ index ],
      value: this.value()
    };
    if ( this.options.values && this.options.values.length ) {
      uiHash.value = this.values( index );
      uiHash.values = this.values();
    }

    this._trigger( "stop", event, uiHash );
  },

  _change: function( event, index ) {
    if ( !this._keySliding && !this._mouseSliding ) {
      var uiHash = {
        handle: this.handles[ index ],
        value: this.value()
      };
      if ( this.options.values && this.options.values.length ) {
        uiHash.value = this.values( index );
        uiHash.values = this.values();
      }

      this._trigger( "change", event, uiHash );
    }
  },

  value: function( newValue ) {
    if ( arguments.length ) {
      this.options.value = this._trimAlignValue( newValue );
      this._refreshValue();
      this._change( null, 0 );
      return;
    }

    return this._value();
  },

  values: function( index, newValue ) {
    var vals,
      newValues,
      i;

    if ( arguments.length > 1 ) {
      this.options.values[ index ] = this._trimAlignValue( newValue );
      this._refreshValue();
      this._change( null, index );
      return;
    }

    if ( arguments.length ) {
      if ( $.isArray( arguments[ 0 ] ) ) {
        vals = this.options.values;
        newValues = arguments[ 0 ];
        for ( i = 0; i < vals.length; i += 1 ) {
          vals[ i ] = this._trimAlignValue( newValues[ i ] );
          this._change( null, i );
        }
        this._refreshValue();
      } else {
        if ( this.options.values && this.options.values.length ) {
          return this._values( index );
        } else {
          return this.value();
        }
      }
    } else {
      return this._values();
    }
  },

  _setOption: function( key, value ) {
    var i,
      valsLength = 0;

    if ( $.isArray( this.options.values ) ) {
      valsLength = this.options.values.length;
    }

    $.Widget.prototype._setOption.apply( this, arguments );

    switch ( key ) {
      case "disabled":
        if ( value ) {
          this.handles.filter( ".ui-state-focus" ).blur();
          this.handles.removeClass( "ui-state-hover" );
          this.handles.attr( "disabled", "disabled" );
          this.element.addClass( "ui-disabled" );
        } else {
          this.handles.removeAttr( "disabled" );
          this.element.removeClass( "ui-disabled" );
        }
        break;
      case "orientation":
        this._detectOrientation();
        this.element
          .removeClass( "ui-slider-horizontal ui-slider-vertical" )
          .addClass( "ui-slider-" + this.orientation );
        this._refreshValue();
        break;
      case "value":
        this._animateOff = true;
        this._refreshValue();
        this._change( null, 0 );
        this._animateOff = false;
        break;
      case "values":
        this._animateOff = true;
        this._refreshValue();
        for ( i = 0; i < valsLength; i += 1 ) {
          this._change( null, i );
        }
        this._animateOff = false;
        break;
    }
  },

  //internal value getter
  // _value() returns value trimmed by min and max, aligned by step
  _value: function() {
    var val = this.options.value;
    val = this._trimAlignValue( val );

    return val;
  },

  //internal values getter
  // _values() returns array of values trimmed by min and max, aligned by step
  // _values( index ) returns single value trimmed by min and max, aligned by step
  _values: function( index ) {
    var val,
      vals,
      i;

    if ( arguments.length ) {
      val = this.options.values[ index ];
      val = this._trimAlignValue( val );

      return val;
    } else {
      // .slice() creates a copy of the array
      // this copy gets trimmed by min and max and then returned
      vals = this.options.values.slice();
      for ( i = 0; i < vals.length; i+= 1) {
        vals[ i ] = this._trimAlignValue( vals[ i ] );
      }

      return vals;
    }
  },
  
  // returns the step-aligned value that val is closest to, between (inclusive) min and max
  _trimAlignValue: function( val ) {
    if ( val <= this._valueMin() ) {
      return this._valueMin();
    }
    if ( val >= this._valueMax() ) {
      return this._valueMax();
    }
    var step = ( this.options.step > 0 ) ? this.options.step : 1,
      valModStep = (val - this._valueMin()) % step;
      alignValue = val - valModStep;

    if ( Math.abs(valModStep) * 2 >= step ) {
      alignValue += ( valModStep > 0 ) ? step : ( -step );
    }

    // Since JavaScript has problems with large floats, round
    // the final value to 5 digits after the decimal point (see #4124)
    return parseFloat( alignValue.toFixed(5) );
  },

  _valueMin: function() {
    return this.options.min;
  },

  _valueMax: function() {
    return this.options.max;
  },
  
  _refreshValue: function() {
    var oRange = this.options.range,
      o = this.options,
      self = this,
      animate = ( !this._animateOff ) ? o.animate : false,
      valPercent,
      _set = {},
      lastValPercent,
      value,
      valueMin,
      valueMax;

    if ( this.options.values && this.options.values.length ) {
      this.handles.each(function( i, j ) {
        valPercent = ( self.values(i) - self._valueMin() ) / ( self._valueMax() - self._valueMin() ) * 100;
        _set[ self.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
        $( this ).stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );
        if ( self.options.range === true ) {
          if ( self.orientation === "horizontal" ) {
            if ( i === 0 ) {
              self.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { left: valPercent + "%" }, o.animate );
            }
            if ( i === 1 ) {
              self.range[ animate ? "animate" : "css" ]( { width: ( valPercent - lastValPercent ) + "%" }, { queue: false, duration: o.animate } );
            }
          } else {
            if ( i === 0 ) {
              self.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { bottom: ( valPercent ) + "%" }, o.animate );
            }
            if ( i === 1 ) {
              self.range[ animate ? "animate" : "css" ]( { height: ( valPercent - lastValPercent ) + "%" }, { queue: false, duration: o.animate } );
            }
          }
        }
        lastValPercent = valPercent;
      });
    } else {
      value = this.value();
      valueMin = this._valueMin();
      valueMax = this._valueMax();
      valPercent = ( valueMax !== valueMin ) ?
          ( value - valueMin ) / ( valueMax - valueMin ) * 100 :
          0;
      _set[ self.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
      this.handle.stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );

      if ( oRange === "min" && this.orientation === "horizontal" ) {
        this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { width: valPercent + "%" }, o.animate );
      }
      if ( oRange === "max" && this.orientation === "horizontal" ) {
        this.range[ animate ? "animate" : "css" ]( { width: ( 100 - valPercent ) + "%" }, { queue: false, duration: o.animate } );
      }
      if ( oRange === "min" && this.orientation === "vertical" ) {
        this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { height: valPercent + "%" }, o.animate );
      }
      if ( oRange === "max" && this.orientation === "vertical" ) {
        this.range[ animate ? "animate" : "css" ]( { height: ( 100 - valPercent ) + "%" }, { queue: false, duration: o.animate } );
      }
    }
  }

});

$.extend( $.ui.slider, {
  version: "1.8.12"
});

}(jQuery));
/*
 * jQuery UI Tabs 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Tabs
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 */
(function( $, undefined ) {

var tabId = 0,
  listId = 0;

function getNextTabId() {
  return ++tabId;
}

function getNextListId() {
  return ++listId;
}

$.widget( "ui.tabs", {
  options: {
    add: null,
    ajaxOptions: null,
    cache: false,
    cookie: null, // e.g. { expires: 7, path: '/', domain: 'jquery.com', secure: true }
    collapsible: false,
    disable: null,
    disabled: [],
    enable: null,
    event: "click",
    fx: null, // e.g. { height: 'toggle', opacity: 'toggle', duration: 200 }
    idPrefix: "ui-tabs-",
    load: null,
    panelTemplate: "<div></div>",
    remove: null,
    select: null,
    show: null,
    spinner: "<em>Loading&#8230;</em>",
    tabTemplate: "<li><a href='#{href}'><span>#{label}</span></a></li>"
  },

  _create: function() {
    this._tabify( true );
  },

  _setOption: function( key, value ) {
    if ( key == "selected" ) {
      if (this.options.collapsible && value == this.options.selected ) {
        return;
      }
      this.select( value );
    } else {
      this.options[ key ] = value;
      this._tabify();
    }
  },

  _tabId: function( a ) {
    return a.title && a.title.replace( /\s/g, "_" ).replace( /[^\w\u00c0-\uFFFF-]/g, "" ) ||
      this.options.idPrefix + getNextTabId();
  },

  _sanitizeSelector: function( hash ) {
    // we need this because an id may contain a ":"
    return hash.replace( /:/g, "\\:" );
  },

  _cookie: function() {
    var cookie = this.cookie ||
      ( this.cookie = this.options.cookie.name || "ui-tabs-" + getNextListId() );
    return $.cookie.apply( null, [ cookie ].concat( $.makeArray( arguments ) ) );
  },

  _ui: function( tab, panel ) {
    return {
      tab: tab,
      panel: panel,
      index: this.anchors.index( tab )
    };
  },

  _cleanup: function() {
    // restore all former loading tabs labels
    this.lis.filter( ".ui-state-processing" )
      .removeClass( "ui-state-processing" )
      .find( "span:data(label.tabs)" )
        .each(function() {
          var el = $( this );
          el.html( el.data( "label.tabs" ) ).removeData( "label.tabs" );
        });
  },

  _tabify: function( init ) {
    var self = this,
      o = this.options,
      fragmentId = /^#.+/; // Safari 2 reports '#' for an empty hash

    this.list = this.element.find( "ol,ul" ).eq( 0 );
    this.lis = $( " > li:has(a[href])", this.list );
    this.anchors = this.lis.map(function() {
      return $( "a", this )[ 0 ];
    });
    this.panels = $( [] );

    this.anchors.each(function( i, a ) {
      var href = $( a ).attr( "href" );
      // For dynamically created HTML that contains a hash as href IE < 8 expands
      // such href to the full page url with hash and then misinterprets tab as ajax.
      // Same consideration applies for an added tab with a fragment identifier
      // since a[href=#fragment-identifier] does unexpectedly not match.
      // Thus normalize href attribute...
      var hrefBase = href.split( "#" )[ 0 ],
        baseEl;
      if ( hrefBase && ( hrefBase === location.toString().split( "#" )[ 0 ] ||
          ( baseEl = $( "base" )[ 0 ]) && hrefBase === baseEl.href ) ) {
        href = a.hash;
        a.href = href;
      }

      // inline tab
      if ( fragmentId.test( href ) ) {
        self.panels = self.panels.add( self.element.find( self._sanitizeSelector( href ) ) );
      // remote tab
      // prevent loading the page itself if href is just "#"
      } else if ( href && href !== "#" ) {
        // required for restore on destroy
        $.data( a, "href.tabs", href );

        // TODO until #3808 is fixed strip fragment identifier from url
        // (IE fails to load from such url)
        $.data( a, "load.tabs", href.replace( /#.*$/, "" ) );

        var id = self._tabId( a );
        a.href = "#" + id;
        var $panel = self.element.find( "#" + id );
        if ( !$panel.length ) {
          $panel = $( o.panelTemplate )
            .attr( "id", id )
            .addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" )
            .insertAfter( self.panels[ i - 1 ] || self.list );
          $panel.data( "destroy.tabs", true );
        }
        self.panels = self.panels.add( $panel );
      // invalid tab href
      } else {
        o.disabled.push( i );
      }
    });

    // initialization from scratch
    if ( init ) {
      // attach necessary classes for styling
      this.element.addClass( "ui-tabs ui-widget ui-widget-content ui-corner-all" );
      this.list.addClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" );
      this.lis.addClass( "ui-state-default ui-corner-top" );
      this.panels.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" );

      // Selected tab
      // use "selected" option or try to retrieve:
      // 1. from fragment identifier in url
      // 2. from cookie
      // 3. from selected class attribute on <li>
      if ( o.selected === undefined ) {
        if ( location.hash ) {
          this.anchors.each(function( i, a ) {
            if ( a.hash == location.hash ) {
              o.selected = i;
              return false;
            }
          });
        }
        if ( typeof o.selected !== "number" && o.cookie ) {
          o.selected = parseInt( self._cookie(), 10 );
        }
        if ( typeof o.selected !== "number" && this.lis.filter( ".ui-tabs-selected" ).length ) {
          o.selected = this.lis.index( this.lis.filter( ".ui-tabs-selected" ) );
        }
        o.selected = o.selected || ( this.lis.length ? 0 : -1 );
      } else if ( o.selected === null ) { // usage of null is deprecated, TODO remove in next release
        o.selected = -1;
      }

      // sanity check - default to first tab...
      o.selected = ( ( o.selected >= 0 && this.anchors[ o.selected ] ) || o.selected < 0 )
        ? o.selected
        : 0;

      // Take disabling tabs via class attribute from HTML
      // into account and update option properly.
      // A selected tab cannot become disabled.
      o.disabled = $.unique( o.disabled.concat(
        $.map( this.lis.filter( ".ui-state-disabled" ), function( n, i ) {
          return self.lis.index( n );
        })
      ) ).sort();

      if ( $.inArray( o.selected, o.disabled ) != -1 ) {
        o.disabled.splice( $.inArray( o.selected, o.disabled ), 1 );
      }

      // highlight selected tab
      this.panels.addClass( "ui-tabs-hide" );
      this.lis.removeClass( "ui-tabs-selected ui-state-active" );
      // check for length avoids error when initializing empty list
      if ( o.selected >= 0 && this.anchors.length ) {
        self.element.find( self._sanitizeSelector( self.anchors[ o.selected ].hash ) ).removeClass( "ui-tabs-hide" );
        this.lis.eq( o.selected ).addClass( "ui-tabs-selected ui-state-active" );

        // seems to be expected behavior that the show callback is fired
        self.element.queue( "tabs", function() {
          self._trigger( "show", null,
            self._ui( self.anchors[ o.selected ], self.element.find( self._sanitizeSelector( self.anchors[ o.selected ].hash ) )[ 0 ] ) );
        });

        this.load( o.selected );
      }

      // clean up to avoid memory leaks in certain versions of IE 6
      // TODO: namespace this event
      $( window ).bind( "unload", function() {
        self.lis.add( self.anchors ).unbind( ".tabs" );
        self.lis = self.anchors = self.panels = null;
      });
    // update selected after add/remove
    } else {
      o.selected = this.lis.index( this.lis.filter( ".ui-tabs-selected" ) );
    }

    // update collapsible
    // TODO: use .toggleClass()
    this.element[ o.collapsible ? "addClass" : "removeClass" ]( "ui-tabs-collapsible" );

    // set or update cookie after init and add/remove respectively
    if ( o.cookie ) {
      this._cookie( o.selected, o.cookie );
    }

    // disable tabs
    for ( var i = 0, li; ( li = this.lis[ i ] ); i++ ) {
      $( li )[ $.inArray( i, o.disabled ) != -1 &&
        // TODO: use .toggleClass()
        !$( li ).hasClass( "ui-tabs-selected" ) ? "addClass" : "removeClass" ]( "ui-state-disabled" );
    }

    // reset cache if switching from cached to not cached
    if ( o.cache === false ) {
      this.anchors.removeData( "cache.tabs" );
    }

    // remove all handlers before, tabify may run on existing tabs after add or option change
    this.lis.add( this.anchors ).unbind( ".tabs" );

    if ( o.event !== "mouseover" ) {
      var addState = function( state, el ) {
        if ( el.is( ":not(.ui-state-disabled)" ) ) {
          el.addClass( "ui-state-" + state );
        }
      };
      var removeState = function( state, el ) {
        el.removeClass( "ui-state-" + state );
      };
      this.lis.bind( "mouseover.tabs" , function() {
        addState( "hover", $( this ) );
      });
      this.lis.bind( "mouseout.tabs", function() {
        removeState( "hover", $( this ) );
      });
      this.anchors.bind( "focus.tabs", function() {
        addState( "focus", $( this ).closest( "li" ) );
      });
      this.anchors.bind( "blur.tabs", function() {
        removeState( "focus", $( this ).closest( "li" ) );
      });
    }

    // set up animations
    var hideFx, showFx;
    if ( o.fx ) {
      if ( $.isArray( o.fx ) ) {
        hideFx = o.fx[ 0 ];
        showFx = o.fx[ 1 ];
      } else {
        hideFx = showFx = o.fx;
      }
    }

    // Reset certain styles left over from animation
    // and prevent IE's ClearType bug...
    function resetStyle( $el, fx ) {
      $el.css( "display", "" );
      if ( !$.support.opacity && fx.opacity ) {
        $el[ 0 ].style.removeAttribute( "filter" );
      }
    }

    // Show a tab...
    var showTab = showFx
      ? function( clicked, $show ) {
        $( clicked ).closest( "li" ).addClass( "ui-tabs-selected ui-state-active" );
        $show.hide().removeClass( "ui-tabs-hide" ) // avoid flicker that way
          .animate( showFx, showFx.duration || "normal", function() {
            resetStyle( $show, showFx );
            self._trigger( "show", null, self._ui( clicked, $show[ 0 ] ) );
          });
      }
      : function( clicked, $show ) {
        $( clicked ).closest( "li" ).addClass( "ui-tabs-selected ui-state-active" );
        $show.removeClass( "ui-tabs-hide" );
        self._trigger( "show", null, self._ui( clicked, $show[ 0 ] ) );
      };

    // Hide a tab, $show is optional...
    var hideTab = hideFx
      ? function( clicked, $hide ) {
        $hide.animate( hideFx, hideFx.duration || "normal", function() {
          self.lis.removeClass( "ui-tabs-selected ui-state-active" );
          $hide.addClass( "ui-tabs-hide" );
          resetStyle( $hide, hideFx );
          self.element.dequeue( "tabs" );
        });
      }
      : function( clicked, $hide, $show ) {
        self.lis.removeClass( "ui-tabs-selected ui-state-active" );
        $hide.addClass( "ui-tabs-hide" );
        self.element.dequeue( "tabs" );
      };

    // attach tab event handler, unbind to avoid duplicates from former tabifying...
    this.anchors.bind( o.event + ".tabs", function() {
      var el = this,
        $li = $(el).closest( "li" ),
        $hide = self.panels.filter( ":not(.ui-tabs-hide)" ),
        $show = self.element.find( self._sanitizeSelector( el.hash ) );

      // If tab is already selected and not collapsible or tab disabled or
      // or is already loading or click callback returns false stop here.
      // Check if click handler returns false last so that it is not executed
      // for a disabled or loading tab!
      if ( ( $li.hasClass( "ui-tabs-selected" ) && !o.collapsible) ||
        $li.hasClass( "ui-state-disabled" ) ||
        $li.hasClass( "ui-state-processing" ) ||
        self.panels.filter( ":animated" ).length ||
        self._trigger( "select", null, self._ui( this, $show[ 0 ] ) ) === false ) {
        this.blur();
        return false;
      }

      o.selected = self.anchors.index( this );

      self.abort();

      // if tab may be closed
      if ( o.collapsible ) {
        if ( $li.hasClass( "ui-tabs-selected" ) ) {
          o.selected = -1;

          if ( o.cookie ) {
            self._cookie( o.selected, o.cookie );
          }

          self.element.queue( "tabs", function() {
            hideTab( el, $hide );
          }).dequeue( "tabs" );

          this.blur();
          return false;
        } else if ( !$hide.length ) {
          if ( o.cookie ) {
            self._cookie( o.selected, o.cookie );
          }

          self.element.queue( "tabs", function() {
            showTab( el, $show );
          });

          // TODO make passing in node possible, see also http://dev.jqueryui.com/ticket/3171
          self.load( self.anchors.index( this ) );

          this.blur();
          return false;
        }
      }

      if ( o.cookie ) {
        self._cookie( o.selected, o.cookie );
      }

      // show new tab
      if ( $show.length ) {
        if ( $hide.length ) {
          self.element.queue( "tabs", function() {
            hideTab( el, $hide );
          });
        }
        self.element.queue( "tabs", function() {
          showTab( el, $show );
        });

        self.load( self.anchors.index( this ) );
      } else {
        throw "jQuery UI Tabs: Mismatching fragment identifier.";
      }

      // Prevent IE from keeping other link focussed when using the back button
      // and remove dotted border from clicked link. This is controlled via CSS
      // in modern browsers; blur() removes focus from address bar in Firefox
      // which can become a usability and annoying problem with tabs('rotate').
      if ( $.browser.msie ) {
        this.blur();
      }
    });

    // disable click in any case
    this.anchors.bind( "click.tabs", function(){
      return false;
    });
  },

    _getIndex: function( index ) {
    // meta-function to give users option to provide a href string instead of a numerical index.
    // also sanitizes numerical indexes to valid values.
    if ( typeof index == "string" ) {
      index = this.anchors.index( this.anchors.filter( "[href$=" + index + "]" ) );
    }

    return index;
  },

  destroy: function() {
    var o = this.options;

    this.abort();

    this.element
      .unbind( ".tabs" )
      .removeClass( "ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible" )
      .removeData( "tabs" );

    this.list.removeClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" );

    this.anchors.each(function() {
      var href = $.data( this, "href.tabs" );
      if ( href ) {
        this.href = href;
      }
      var $this = $( this ).unbind( ".tabs" );
      $.each( [ "href", "load", "cache" ], function( i, prefix ) {
        $this.removeData( prefix + ".tabs" );
      });
    });

    this.lis.unbind( ".tabs" ).add( this.panels ).each(function() {
      if ( $.data( this, "destroy.tabs" ) ) {
        $( this ).remove();
      } else {
        $( this ).removeClass([
          "ui-state-default",
          "ui-corner-top",
          "ui-tabs-selected",
          "ui-state-active",
          "ui-state-hover",
          "ui-state-focus",
          "ui-state-disabled",
          "ui-tabs-panel",
          "ui-widget-content",
          "ui-corner-bottom",
          "ui-tabs-hide"
        ].join( " " ) );
      }
    });

    if ( o.cookie ) {
      this._cookie( null, o.cookie );
    }

    return this;
  },

  add: function( url, label, index ) {
    if ( index === undefined ) {
      index = this.anchors.length;
    }

    var self = this,
      o = this.options,
      $li = $( o.tabTemplate.replace( /#\{href\}/g, url ).replace( /#\{label\}/g, label ) ),
      id = !url.indexOf( "#" ) ? url.replace( "#", "" ) : this._tabId( $( "a", $li )[ 0 ] );

    $li.addClass( "ui-state-default ui-corner-top" ).data( "destroy.tabs", true );

    // try to find an existing element before creating a new one
    var $panel = self.element.find( "#" + id );
    if ( !$panel.length ) {
      $panel = $( o.panelTemplate )
        .attr( "id", id )
        .data( "destroy.tabs", true );
    }
    $panel.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide" );

    if ( index >= this.lis.length ) {
      $li.appendTo( this.list );
      $panel.appendTo( this.list[ 0 ].parentNode );
    } else {
      $li.insertBefore( this.lis[ index ] );
      $panel.insertBefore( this.panels[ index ] );
    }

    o.disabled = $.map( o.disabled, function( n, i ) {
      return n >= index ? ++n : n;
    });

    this._tabify();

    if ( this.anchors.length == 1 ) {
      o.selected = 0;
      $li.addClass( "ui-tabs-selected ui-state-active" );
      $panel.removeClass( "ui-tabs-hide" );
      this.element.queue( "tabs", function() {
        self._trigger( "show", null, self._ui( self.anchors[ 0 ], self.panels[ 0 ] ) );
      });

      this.load( 0 );
    }

    this._trigger( "add", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
    return this;
  },

  remove: function( index ) {
    index = this._getIndex( index );
    var o = this.options,
      $li = this.lis.eq( index ).remove(),
      $panel = this.panels.eq( index ).remove();

    // If selected tab was removed focus tab to the right or
    // in case the last tab was removed the tab to the left.
    if ( $li.hasClass( "ui-tabs-selected" ) && this.anchors.length > 1) {
      this.select( index + ( index + 1 < this.anchors.length ? 1 : -1 ) );
    }

    o.disabled = $.map(
      $.grep( o.disabled, function(n, i) {
        return n != index;
      }),
      function( n, i ) {
        return n >= index ? --n : n;
      });

    this._tabify();

    this._trigger( "remove", null, this._ui( $li.find( "a" )[ 0 ], $panel[ 0 ] ) );
    return this;
  },

  enable: function( index ) {
    index = this._getIndex( index );
    var o = this.options;
    if ( $.inArray( index, o.disabled ) == -1 ) {
      return;
    }

    this.lis.eq( index ).removeClass( "ui-state-disabled" );
    o.disabled = $.grep( o.disabled, function( n, i ) {
      return n != index;
    });

    this._trigger( "enable", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
    return this;
  },

  disable: function( index ) {
    index = this._getIndex( index );
    var self = this, o = this.options;
    // cannot disable already selected tab
    if ( index != o.selected ) {
      this.lis.eq( index ).addClass( "ui-state-disabled" );

      o.disabled.push( index );
      o.disabled.sort();

      this._trigger( "disable", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
    }

    return this;
  },

  select: function( index ) {
    index = this._getIndex( index );
    if ( index == -1 ) {
      if ( this.options.collapsible && this.options.selected != -1 ) {
        index = this.options.selected;
      } else {
        return this;
      }
    }
    this.anchors.eq( index ).trigger( this.options.event + ".tabs" );
    return this;
  },

  load: function( index ) {
    index = this._getIndex( index );
    var self = this,
      o = this.options,
      a = this.anchors.eq( index )[ 0 ],
      url = $.data( a, "load.tabs" );

    this.abort();

    // not remote or from cache
    if ( !url || this.element.queue( "tabs" ).length !== 0 && $.data( a, "cache.tabs" ) ) {
      this.element.dequeue( "tabs" );
      return;
    }

    // load remote from here on
    this.lis.eq( index ).addClass( "ui-state-processing" );

    if ( o.spinner ) {
      var span = $( "span", a );
      span.data( "label.tabs", span.html() ).html( o.spinner );
    }

    this.xhr = $.ajax( $.extend( {}, o.ajaxOptions, {
      url: url,
      success: function( r, s ) {
        self.element.find( self._sanitizeSelector( a.hash ) ).html( r );

        // take care of tab labels
        self._cleanup();

        if ( o.cache ) {
          $.data( a, "cache.tabs", true );
        }

        self._trigger( "load", null, self._ui( self.anchors[ index ], self.panels[ index ] ) );
        try {
          o.ajaxOptions.success( r, s );
        }
        catch ( e ) {}
      },
      error: function( xhr, s, e ) {
        // take care of tab labels
        self._cleanup();

        self._trigger( "load", null, self._ui( self.anchors[ index ], self.panels[ index ] ) );
        try {
          // Passing index avoid a race condition when this method is
          // called after the user has selected another tab.
          // Pass the anchor that initiated this request allows
          // loadError to manipulate the tab content panel via $(a.hash)
          o.ajaxOptions.error( xhr, s, index, a );
        }
        catch ( e ) {}
      }
    } ) );

    // last, so that load event is fired before show...
    self.element.dequeue( "tabs" );

    return this;
  },

  abort: function() {
    // stop possibly running animations
    this.element.queue( [] );
    this.panels.stop( false, true );

    // "tabs" queue must not contain more than two elements,
    // which are the callbacks for the latest clicked tab...
    this.element.queue( "tabs", this.element.queue( "tabs" ).splice( -2, 2 ) );

    // terminate pending requests from other tabs
    if ( this.xhr ) {
      this.xhr.abort();
      delete this.xhr;
    }

    // take care of tab labels
    this._cleanup();
    return this;
  },

  url: function( index, url ) {
    this.anchors.eq( index ).removeData( "cache.tabs" ).data( "load.tabs", url );
    return this;
  },

  length: function() {
    return this.anchors.length;
  }
});

$.extend( $.ui.tabs, {
  version: "1.8.12"
});

/*
 * Tabs Extensions
 */

/*
 * Rotate
 */
$.extend( $.ui.tabs.prototype, {
  rotation: null,
  rotate: function( ms, continuing ) {
    var self = this,
      o = this.options;

    var rotate = self._rotate || ( self._rotate = function( e ) {
      clearTimeout( self.rotation );
      self.rotation = setTimeout(function() {
        var t = o.selected;
        self.select( ++t < self.anchors.length ? t : 0 );
      }, ms );
      
      if ( e ) {
        e.stopPropagation();
      }
    });

    var stop = self._unrotate || ( self._unrotate = !continuing
      ? function(e) {
        if (e.clientX) { // in case of a true click
          self.rotate(null);
        }
      }
      : function( e ) {
        t = o.selected;
        rotate();
      });

    // start rotation
    if ( ms ) {
      this.element.bind( "tabsshow", rotate );
      this.anchors.bind( o.event + ".tabs", stop );
      rotate();
    // stop rotation
    } else {
      clearTimeout( self.rotation );
      this.element.unbind( "tabsshow", rotate );
      this.anchors.unbind( o.event + ".tabs", stop );
      delete this._rotate;
      delete this._unrotate;
    }

    return this;
  }
});

})( jQuery );
// Underscore.js 1.1.4
// (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){var q=this,C=q._,m={},j=Array.prototype,n=Object.prototype,i=j.slice,D=j.unshift,E=n.toString,o=n.hasOwnProperty,s=j.forEach,t=j.map,u=j.reduce,v=j.reduceRight,w=j.filter,x=j.every,y=j.some,p=j.indexOf,z=j.lastIndexOf;n=Array.isArray;var F=Object.keys,c=function(a){return new l(a)};if(typeof module!=="undefined"&&module.exports){module.exports=c;c._=c}else q._=c;c.VERSION="1.1.4";var k=c.each=c.forEach=function(a,b,d){if(a!=null)if(s&&a.forEach===s)a.forEach(b,d);else if(c.isNumber(a.length))for(var e=
0,f=a.length;e<f;e++){if(b.call(d,a[e],e,a)===m)break}else for(e in a)if(o.call(a,e))if(b.call(d,a[e],e,a)===m)break};c.map=function(a,b,d){var e=[];if(a==null)return e;if(t&&a.map===t)return a.map(b,d);k(a,function(f,g,h){e[e.length]=b.call(d,f,g,h)});return e};c.reduce=c.foldl=c.inject=function(a,b,d,e){var f=d!==void 0;if(a==null)a=[];if(u&&a.reduce===u){if(e)b=c.bind(b,e);return f?a.reduce(b,d):a.reduce(b)}k(a,function(g,h,G){if(!f&&h===0){d=g;f=true}else d=b.call(e,d,g,h,G)});if(!f)throw new TypeError("Reduce of empty array with no initial value");
return d};c.reduceRight=c.foldr=function(a,b,d,e){if(a==null)a=[];if(v&&a.reduceRight===v){if(e)b=c.bind(b,e);return d!==void 0?a.reduceRight(b,d):a.reduceRight(b)}a=(c.isArray(a)?a.slice():c.toArray(a)).reverse();return c.reduce(a,b,d,e)};c.find=c.detect=function(a,b,d){var e;A(a,function(f,g,h){if(b.call(d,f,g,h)){e=f;return true}});return e};c.filter=c.select=function(a,b,d){var e=[];if(a==null)return e;if(w&&a.filter===w)return a.filter(b,d);k(a,function(f,g,h){if(b.call(d,f,g,h))e[e.length]=
f});return e};c.reject=function(a,b,d){var e=[];if(a==null)return e;k(a,function(f,g,h){b.call(d,f,g,h)||(e[e.length]=f)});return e};c.every=c.all=function(a,b,d){b=b||c.identity;var e=true;if(a==null)return e;if(x&&a.every===x)return a.every(b,d);k(a,function(f,g,h){if(!(e=e&&b.call(d,f,g,h)))return m});return e};var A=c.some=c.any=function(a,b,d){b=b||c.identity;var e=false;if(a==null)return e;if(y&&a.some===y)return a.some(b,d);k(a,function(f,g,h){if(e=b.call(d,f,g,h))return m});return e};c.include=
c.contains=function(a,b){var d=false;if(a==null)return d;if(p&&a.indexOf===p)return a.indexOf(b)!=-1;A(a,function(e){if(d=e===b)return true});return d};c.invoke=function(a,b){var d=i.call(arguments,2);return c.map(a,function(e){return(b?e[b]:e).apply(e,d)})};c.pluck=function(a,b){return c.map(a,function(d){return d[b]})};c.max=function(a,b,d){if(!b&&c.isArray(a))return Math.max.apply(Math,a);var e={computed:-Infinity};k(a,function(f,g,h){g=b?b.call(d,f,g,h):f;g>=e.computed&&(e={value:f,computed:g})});
return e.value};c.min=function(a,b,d){if(!b&&c.isArray(a))return Math.min.apply(Math,a);var e={computed:Infinity};k(a,function(f,g,h){g=b?b.call(d,f,g,h):f;g<e.computed&&(e={value:f,computed:g})});return e.value};c.sortBy=function(a,b,d){return c.pluck(c.map(a,function(e,f,g){return{value:e,criteria:b.call(d,e,f,g)}}).sort(function(e,f){var g=e.criteria,h=f.criteria;return g<h?-1:g>h?1:0}),"value")};c.sortedIndex=function(a,b,d){d=d||c.identity;for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(b)?
e=g+1:f=g}return e};c.toArray=function(a){if(!a)return[];if(a.toArray)return a.toArray();if(c.isArray(a))return a;if(c.isArguments(a))return i.call(a);return c.values(a)};c.size=function(a){return c.toArray(a).length};c.first=c.head=function(a,b,d){return b&&!d?i.call(a,0,b):a[0]};c.rest=c.tail=function(a,b,d){return i.call(a,c.isUndefined(b)||d?1:b)};c.last=function(a){return a[a.length-1]};c.compact=function(a){return c.filter(a,function(b){return!!b})};c.flatten=function(a){return c.reduce(a,function(b,
d){if(c.isArray(d))return b.concat(c.flatten(d));b[b.length]=d;return b},[])};c.without=function(a){var b=i.call(arguments,1);return c.filter(a,function(d){return!c.include(b,d)})};c.uniq=c.unique=function(a,b){return c.reduce(a,function(d,e,f){if(0==f||(b===true?c.last(d)!=e:!c.include(d,e)))d[d.length]=e;return d},[])};c.intersect=function(a){var b=i.call(arguments,1);return c.filter(c.uniq(a),function(d){return c.every(b,function(e){return c.indexOf(e,d)>=0})})};c.zip=function(){for(var a=i.call(arguments),
b=c.max(c.pluck(a,"length")),d=Array(b),e=0;e<b;e++)d[e]=c.pluck(a,""+e);return d};c.indexOf=function(a,b,d){if(a==null)return-1;if(d){d=c.sortedIndex(a,b);return a[d]===b?d:-1}if(p&&a.indexOf===p)return a.indexOf(b);d=0;for(var e=a.length;d<e;d++)if(a[d]===b)return d;return-1};c.lastIndexOf=function(a,b){if(a==null)return-1;if(z&&a.lastIndexOf===z)return a.lastIndexOf(b);for(var d=a.length;d--;)if(a[d]===b)return d;return-1};c.range=function(a,b,d){var e=i.call(arguments),f=e.length<=1;a=f?0:e[0];
b=f?e[0]:e[1];d=e[2]||1;e=Math.max(Math.ceil((b-a)/d),0);f=0;for(var g=Array(e);f<e;){g[f++]=a;a+=d}return g};c.bind=function(a,b){var d=i.call(arguments,2);return function(){return a.apply(b||{},d.concat(i.call(arguments)))}};c.bindAll=function(a){var b=i.call(arguments,1);if(b.length==0)b=c.functions(a);k(b,function(d){a[d]=c.bind(a[d],a)});return a};c.memoize=function(a,b){var d={};b=b||c.identity;return function(){var e=b.apply(this,arguments);return e in d?d[e]:d[e]=a.apply(this,arguments)}};
c.delay=function(a,b){var d=i.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};c.defer=function(a){return c.delay.apply(c,[a,1].concat(i.call(arguments,1)))};var B=function(a,b,d){var e;return function(){var f=this,g=arguments,h=function(){e=null;a.apply(f,g)};d&&clearTimeout(e);if(d||!e)e=setTimeout(h,b)}};c.throttle=function(a,b){return B(a,b,false)};c.debounce=function(a,b){return B(a,b,true)};c.wrap=function(a,b){return function(){var d=[a].concat(i.call(arguments));return b.apply(this,
d)}};c.compose=function(){var a=i.call(arguments);return function(){for(var b=i.call(arguments),d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};c.keys=F||function(a){if(c.isArray(a))return c.range(0,a.length);var b=[],d;for(d in a)if(o.call(a,d))b[b.length]=d;return b};c.values=function(a){return c.map(a,c.identity)};c.functions=c.methods=function(a){return c.filter(c.keys(a),function(b){return c.isFunction(a[b])}).sort()};c.extend=function(a){k(i.call(arguments,1),function(b){for(var d in b)a[d]=
b[d]});return a};c.clone=function(a){return c.isArray(a)?a.slice():c.extend({},a)};c.tap=function(a,b){b(a);return a};c.isEqual=function(a,b){if(a===b)return true;var d=typeof a;if(d!=typeof b)return false;if(a==b)return true;if(!a&&b||a&&!b)return false;if(a._chain)a=a._wrapped;if(b._chain)b=b._wrapped;if(a.isEqual)return a.isEqual(b);if(c.isDate(a)&&c.isDate(b))return a.getTime()===b.getTime();if(c.isNaN(a)&&c.isNaN(b))return false;if(c.isRegExp(a)&&c.isRegExp(b))return a.source===b.source&&a.global===
b.global&&a.ignoreCase===b.ignoreCase&&a.multiline===b.multiline;if(d!=="object")return false;if(a.length&&a.length!==b.length)return false;d=c.keys(a);var e=c.keys(b);if(d.length!=e.length)return false;for(var f in a)if(!(f in b)||!c.isEqual(a[f],b[f]))return false;return true};c.isEmpty=function(a){if(c.isArray(a)||c.isString(a))return a.length===0;for(var b in a)if(o.call(a,b))return false;return true};c.isElement=function(a){return!!(a&&a.nodeType==1)};c.isArray=n||function(a){return E.call(a)===
"[object Array]"};c.isArguments=function(a){return!!(a&&o.call(a,"callee"))};c.isFunction=function(a){return!!(a&&a.constructor&&a.call&&a.apply)};c.isString=function(a){return!!(a===""||a&&a.charCodeAt&&a.substr)};c.isNumber=function(a){return!!(a===0||a&&a.toExponential&&a.toFixed)};c.isNaN=function(a){return a!==a};c.isBoolean=function(a){return a===true||a===false};c.isDate=function(a){return!!(a&&a.getTimezoneOffset&&a.setUTCFullYear)};c.isRegExp=function(a){return!!(a&&a.test&&a.exec&&(a.ignoreCase||
a.ignoreCase===false))};c.isNull=function(a){return a===null};c.isUndefined=function(a){return a===void 0};c.noConflict=function(){q._=C;return this};c.identity=function(a){return a};c.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};c.mixin=function(a){k(c.functions(a),function(b){H(b,c[b]=a[b])})};var I=0;c.uniqueId=function(a){var b=I++;return a?a+b:b};c.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g};c.template=function(a,b){var d=c.templateSettings;d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+
a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.interpolate,function(e,f){return"',"+f.replace(/\\'/g,"'")+",'"}).replace(d.evaluate||null,function(e,f){return"');"+f.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');";d=new Function("obj",d);return b?d(b):d};var l=function(a){this._wrapped=a};c.prototype=l.prototype;var r=function(a,b){return b?c(a).chain():a},H=function(a,b){l.prototype[a]=function(){var d=
i.call(arguments);D.call(d,this._wrapped);return r(b.apply(c,d),this._chain)}};c.mixin(c);k(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var b=j[a];l.prototype[a]=function(){b.apply(this._wrapped,arguments);return r(this._wrapped,this._chain)}});k(["concat","join","slice"],function(a){var b=j[a];l.prototype[a]=function(){return r(b.apply(this._wrapped,arguments),this._chain)}});l.prototype.chain=function(){this._chain=true;return this};l.prototype.value=function(){return this._wrapped}})();
/*
 Highcharts JS v2.1.4 (2011-03-02)

 (c) 2009-2010 Torstein H?nsi

 License: www.highcharts.com/license
*/

(function(){function qa(a,b){a||(a={});for(var c in b)a[c]=b[c];return a}function oa(a,b){return parseInt(a,b||10)}function Kb(a){return typeof a=="string"}function Eb(a){return typeof a=="object"}function ac(a){return typeof a=="number"}function mc(a,b){for(var c=a.length;c--;)if(a[c]==b){a.splice(c,1);break}}function J(a){return a!==Ra&&a!==null}function za(a,b,c){var d,e;if(Kb(b))if(J(c))a.setAttribute(b,c);else{if(a&&a.getAttribute)e=a.getAttribute(b)}else if(J(b)&&Eb(b))for(d in b)a.setAttribute(d,
b[d]);return e}function nc(a){if(!a||a.constructor!=Array)a=[a];return a}function y(){var a=arguments,b,c,d=a.length;for(b=0;b<d;b++){c=a[b];if(typeof c!=="undefined"&&c!==null)return c}}function Wd(a){var b="",c;for(c in a)b+=Ad(c)+":"+a[c]+";";return b}function Ia(a,b){if(Ac)if(b&&b.opacity!==Ra)b.filter="alpha(opacity="+b.opacity*100+")";qa(a.style,b)}function fb(a,b,c,d,e){a=Aa.createElement(a);b&&qa(a,b);e&&Ia(a,{padding:0,border:nb,margin:0});c&&Ia(a,c);d&&d.appendChild(a);return a}function bc(a,
b){Bc=y(a,b.animation)}function Bd(){var a=Sa.global.useUTC;Cc=a?Date.UTC:function(b,c,d,e,f,g){return(new Date(b,c,y(d,1),y(e,0),y(f,0),y(g,0))).getTime()};bd=a?"getUTCMinutes":"getMinutes";cd=a?"getUTCHours":"getHours";dd=a?"getUTCDay":"getDay";oc=a?"getUTCDate":"getDate";Dc=a?"getUTCMonth":"getMonth";Ec=a?"getUTCFullYear":"getFullYear";Cd=a?"setUTCMinutes":"setMinutes";Dd=a?"setUTCHours":"setHours";ed=a?"setUTCDate":"setDate";Ed=a?"setUTCMonth":"setMonth";Fd=a?"setUTCFullYear":"setFullYear"}function Fc(a){Gc||
(Gc=fb(Lb));a&&Gc.appendChild(a);Gc.innerHTML=""}function xb(a,b){var c=function(){};c.prototype=new a;qa(c.prototype,b);return c}function Gd(a,b,c,d){var e=Sa.lang;a=a;var f=isNaN(b=cb(b))?2:b;b=c===undefined?e.decimalPoint:c;d=d===undefined?e.thousandsSep:d;e=a<0?"-":"";c=oa(a=cb(+a||0).toFixed(f))+"";var g=(g=c.length)>3?g%3:0;return e+(g?c.substr(0,g)+d:"")+c.substr(g).replace(/(\d{3})(?=\d)/g,"$1"+d)+(f?b+cb(a-c).toFixed(f).slice(2):"")}function Hc(){}function Hd(a,b){function c(m,h){function x(l,
p){this.pos=l;this.minor=p;this.isNew=true;p||this.addLabel()}function w(l){if(l){this.options=l;this.id=l.id}return this}function O(){var l=[],p=[],r;Ta=u=null;Z=[];t(Ba,function(o){r=false;t(["xAxis","yAxis"],function(la){if(o.isCartesian&&(la=="xAxis"&&ma||la=="yAxis"&&!ma)&&(o.options[la]==h.index||o.options[la]===Ra&&h.index===0)){o[la]=s;Z.push(o);r=true}});if(!o.visible&&v.ignoreHiddenSeries)r=false;if(r){var T,Y,G,B,ia;if(!ma){T=o.options.stacking;Ic=T=="percent";if(T){B=o.type+y(o.options.stack,
"");ia="-"+B;o.stackKey=B;Y=l[B]||[];l[B]=Y;G=p[ia]||[];p[ia]=G}if(Ic){Ta=0;u=99}}if(o.isCartesian){t(o.data,function(la){var C=la.x,na=la.y,S=na<0,$=S?G:Y;S=S?ia:B;if(Ta===null)Ta=u=la[H];if(ma)if(C>u)u=C;else{if(C<Ta)Ta=C}else if(J(na)){if(T)$[C]=J($[C])?$[C]+na:na;na=$?$[C]:na;la=y(la.low,na);if(!Ic)if(na>u)u=na;else if(la<Ta)Ta=la;if(T){ea[S]||(ea[S]={});ea[S][C]={total:na,cum:na}}}});if(/(area|column|bar)/.test(o.type)&&!ma)if(Ta>=0){Ta=0;Id=true}else if(u<0){u=0;Jd=true}}}})}function ja(l,p){var r;
Fb=p?1:Ua.pow(10,ob(Ua.log(l)/Ua.LN10));r=l/Fb;if(!p){p=[1,2,2.5,5,10];if(h.allowDecimals===false)if(Fb==1)p=[1,2,5,10];else if(Fb<=0.1)p=[1/Fb]}for(var o=0;o<p.length;o++){l=p[o];if(r<=(p[o]+(p[o+1]||p[o]))/2)break}l*=Fb;return l}function L(l){var p;p=l;if(J(Fb)){p=(Fb<1?fa(1/Fb):1)*10;p=fa(l*p)/p}return p}function ga(){var l,p,r,o,T=h.tickInterval,Y=h.tickPixelInterval;l=h.maxZoom||(ma?pb(m.smallestInterval*5,u-Ta):null);A=M?wa:sa;if(Mb){r=m[ma?"xAxis":"yAxis"][h.linkedTo];o=r.getExtremes();K=y(o.min,
o.dataMin);P=y(o.max,o.dataMax)}else{K=y(pa,h.min,Ta);P=y(Na,h.max,u)}if(P-K<l){o=(l-P+K)/2;K=Ca(K-o,y(h.min,K-o),Ta);P=pb(K+l,y(h.max,K+l),u)}if(!Va&&!Ic&&!Mb&&J(K)&&J(P)){l=P-K||1;if(!J(h.min)&&!J(pa)&&Vb&&(Ta<0||!Id))K-=l*Vb;if(!J(h.max)&&!J(Na)&&Kd&&(u>0||!Jd))P+=l*Kd}Wa=K==P?1:Mb&&!T&&Y==r.options.tickPixelInterval?r.tickInterval:y(T,Va?1:(P-K)*Y/A);if(!N&&!J(h.tickInterval))Wa=ja(Wa);s.tickInterval=Wa;Jc=h.minorTickInterval==="auto"&&Wa?Wa/5:h.minorTickInterval;if(N){ra=[];T=Sa.global.useUTC;
var G=1E3/qb,B=6E4/qb,ia=36E5/qb;Y=864E5/qb;l=6048E5/qb;o=2592E6/qb;var la=31556952E3/qb,C=[["second",G,[1,2,5,10,15,30]],["minute",B,[1,2,5,10,15,30]],["hour",ia,[1,2,3,4,6,8,12]],["day",Y,[1,2]],["week",l,[1,2]],["month",o,[1,2,3,4,6]],["year",la,null]],na=C[6],S=na[1],$=na[2];for(r=0;r<C.length;r++){na=C[r];S=na[1];$=na[2];if(C[r+1])if(Wa<=(S*$[$.length-1]+C[r+1][1])/2)break}if(S==la&&Wa<5*S)$=[1,2,5];C=ja(Wa/S,$);$=new Date(K*qb);$.setMilliseconds(0);if(S>=G)$.setSeconds(S>=B?0:C*ob($.getSeconds()/
C));if(S>=B)$[Cd](S>=ia?0:C*ob($[bd]()/C));if(S>=ia)$[Dd](S>=Y?0:C*ob($[cd]()/C));if(S>=Y)$[ed](S>=o?1:C*ob($[oc]()/C));if(S>=o){$[Ed](S>=la?0:C*ob($[Dc]()/C));p=$[Ec]()}if(S>=la){p-=p%C;$[Fd](p)}S==l&&$[ed]($[oc]()-$[dd]()+h.startOfWeek);r=1;p=$[Ec]();G=$.getTime()/qb;B=$[Dc]();for(ia=$[oc]();G<P&&r<wa;){ra.push(G);if(S==la)G=Cc(p+r*C,0)/qb;else if(S==o)G=Cc(p,B+r*C)/qb;else if(!T&&(S==Y||S==l))G=Cc(p,B,ia+r*C*(S==Y?1:7));else G+=S*C;r++}ra.push(G);Kc=h.dateTimeLabelFormats[na[0]]}else{r=ob(K/Wa)*
Wa;p=fd(P/Wa)*Wa;ra=[];for(r=L(r);r<=p;){ra.push(r);r=L(r+Wa)}}if(!Mb){if(Va||ma&&m.hasColumn){p=(Va?1:Wa)*0.5;if(Va||!J(y(h.min,pa)))K-=p;if(Va||!J(y(h.max,Na)))P+=p}p=ra[0];r=ra[ra.length-1];if(h.startOnTick)K=p;else K>p&&ra.shift();if(h.endOnTick)P=r;else P<r&&ra.pop();Gb||(Gb={x:0,y:0});if(!N&&ra.length>Gb[H])Gb[H]=ra.length}}function Ea(){var l,p;gb=K;cc=P;O();ga();ha=D;D=A/(P-K||1);if(!ma)for(l in ea)for(p in ea[l])ea[l][p].cum=ea[l][p].total;if(!s.isDirty)s.isDirty=K!=gb||P!=cc}function ua(l){l=
(new w(l)).render();Nb.push(l);return l}function bb(){var l=h.title,p=h.alternateGridColor,r=h.lineWidth,o,T,Y=m.hasRendered,G=Y&&J(gb)&&!isNaN(gb);o=Z.length&&J(K)&&J(P);A=M?wa:sa;D=A/(P-K||1);xa=M?V:rb;if(o||Mb){if(Jc&&!Va)for(o=K+(ra[0]-K)%Jc;o<=P;o+=Jc){Wb[o]||(Wb[o]=new x(o,true));G&&Wb[o].isNew&&Wb[o].render(null,true);Wb[o].isActive=true;Wb[o].render()}t(ra,function(B,ia){if(!Mb||B>=K&&B<=P){G&&sb[B].isNew&&sb[B].render(ia,true);sb[B].isActive=true;sb[B].render(ia)}});p&&t(ra,function(B,ia){if(ia%
2===0&&B<P){dc[B]||(dc[B]=new w);dc[B].options={from:B,to:ra[ia+1]!==Ra?ra[ia+1]:P,color:p};dc[B].render();dc[B].isActive=true}});Y||t((h.plotLines||[]).concat(h.plotBands||[]),function(B){Nb.push((new w(B)).render())})}t([sb,Wb,dc],function(B){for(var ia in B)if(B[ia].isActive)B[ia].isActive=false;else{B[ia].destroy();delete B[ia]}});if(r){o=V+(Oa?wa:0)+Q;T=Pa-rb-(Oa?sa:0)+Q;o=aa.crispLine([Za,M?V:o,M?T:ba,Da,M?Xa-Ab:o,M?T:Pa-rb],r);if(Fa)Fa.animate({d:o});else Fa=aa.path(o).attr({stroke:h.lineColor,
"stroke-width":r,zIndex:7}).add()}if(s.axisTitle){o=M?V:ba;r=oa(l.style.fontSize||12);o={low:o+(M?0:A),middle:o+A/2,high:o+(M?A:0)}[l.align];r=(M?ba+sa:V)+(M?1:-1)*(Oa?-1:1)*gd+(E==2?r:0);s.axisTitle[Y?"animate":"attr"]({x:M?o:r+(Oa?wa:0)+Q+(l.x||0),y:M?r-(Oa?sa:0)+Q:o+(l.y||0)})}s.isDirty=false}function Ja(l){for(var p=Nb.length;p--;)Nb[p].id==l&&Nb[p].destroy()}var ma=h.isX,Oa=h.opposite,M=Ga?!ma:ma,E=M?Oa?0:2:Oa?1:3,ea={};h=ya(ma?Lc:hd,[Xd,Yd,Ld,Zd][E],h);var s=this,N=h.type=="datetime",Q=h.offset||
0,H=ma?"x":"y",A,D,ha,xa=M?V:rb,va,Ka,tb,Hb,Fa,Ta,u,Z,pa,Na,P=null,K=null,gb,cc,Vb=h.minPadding,Kd=h.maxPadding,Mb=J(h.linkedTo),Id,Jd,Ic,Md=h.events,id,Nb=[],Wa,Jc,Fb,ra,sb={},Wb={},dc={},ec,fc,gd,Kc,Va=h.categories,$d=h.labels.formatter||function(){var l=this.value;return Kc?Mc(Kc,l):Wa%1E6===0?l/1E6+"M":Wa%1E3===0?l/1E3+"k":!Va&&l>=1E3?Gd(l,0):l},Nc=M&&h.labels.staggerLines,Xb=h.reversed,Yb=Va&&h.tickmarkPlacement=="between"?0.5:0;x.prototype={addLabel:function(){var l=this.pos,p=h.labels,r=!(l==
K&&!y(h.showFirstLabel,1)||l==P&&!y(h.showLastLabel,0)),o=Va&&M&&Va.length&&!p.step&&!p.staggerLines&&!p.rotation&&wa/Va.length||!M&&wa/2,T=this.label;l=$d.call({isFirst:l==ra[0],isLast:l==ra[ra.length-1],dateTimeLabelFormat:Kc,value:Va&&Va[l]?Va[l]:l});o=o&&{width:o-2*(p.padding||10)+$a};o=qa(o,p.style);if(T===Ra)this.label=J(l)&&r&&p.enabled?aa.text(l,0,0).attr({align:p.align,rotation:p.rotation}).css(o).add(tb):null;else T&&T.attr({text:l}).css(o)},getLabelSize:function(){var l=this.label;return l?
(this.labelBBox=l.getBBox())[M?"height":"width"]:0},render:function(l,p){var r=!this.minor,o=this.label,T=this.pos,Y=h.labels,G=this.gridLine,B=r?h.gridLineWidth:h.minorGridLineWidth,ia=r?h.gridLineColor:h.minorGridLineColor,la=r?h.gridLineDashStyle:h.minorGridLineDashStyle,C=this.mark,na=r?h.tickLength:h.minorTickLength,S=r?h.tickWidth:h.minorTickWidth||0,$=r?h.tickColor:h.minorTickColor,pc=r?h.tickPosition:h.minorTickPosition;r=Y.step;var hb=p&&Oc||Pa,Ob;Ob=M?va(T+Yb,null,null,p)+xa:V+Q+(Oa?(p&&
jd||Xa)-Ab-V:0);hb=M?hb-rb+Q-(Oa?sa:0):hb-va(T+Yb,null,null,p)-xa;if(B){T=Ka(T+Yb,B,p);if(G===Ra){G={stroke:ia,"stroke-width":B};if(la)G.dashstyle=la;this.gridLine=G=B?aa.path(T).attr(G).add(Hb):null}G&&T&&G.animate({d:T})}if(S){if(pc=="inside")na=-na;if(Oa)na=-na;B=aa.crispLine([Za,Ob,hb,Da,Ob+(M?0:-na),hb+(M?na:0)],S);if(C)C.animate({d:B});else this.mark=aa.path(B).attr({stroke:$,"stroke-width":S}).add(tb)}if(o){Ob=Ob+Y.x-(Yb&&M?Yb*D*(Xb?-1:1):0);hb=hb+Y.y-(Yb&&!M?Yb*D*(Xb?1:-1):0);J(Y.y)||(hb+=
parseInt(o.styles.lineHeight)*0.9-o.getBBox().height/2);if(Nc)hb+=l%Nc*16;if(r)o[l%r?"hide":"show"]();o[this.isNew?"attr":"animate"]({x:Ob,y:hb})}this.isNew=false},destroy:function(){for(var l in this)this[l]&&this[l].destroy&&this[l].destroy()}};w.prototype={render:function(){var l=this,p=l.options,r=p.label,o=l.label,T=p.width,Y=p.to,G,B=p.from,ia=p.dashStyle,la=l.svgElem,C=[],na,S,$=p.color;S=p.zIndex;var pc=p.events;if(T){C=Ka(p.value,T);p={stroke:$,"stroke-width":T};if(ia)p.dashstyle=ia}else if(J(B)&&
J(Y)){B=Ca(B,K);Y=pb(Y,P);G=Ka(Y);if((C=Ka(B))&&G)C.push(G[4],G[5],G[1],G[2]);else C=null;p={fill:$}}else return;if(J(S))p.zIndex=S;if(la)if(C)la.animate({d:C},null,la.onGetPath);else{la.hide();la.onGetPath=function(){la.show()}}else if(C&&C.length){l.svgElem=la=aa.path(C).attr(p).add();if(pc){ia=function(hb){la.on(hb,function(Ob){pc[hb].apply(l,[Ob])})};for(na in pc)ia(na)}}if(r&&J(r.text)&&C&&C.length&&wa>0&&sa>0){r=ya({align:M&&G&&"center",x:M?!G&&4:10,verticalAlign:!M&&G&&"middle",y:M?G?16:10:
G?6:-4,rotation:M&&!G&&90},r);if(!o)l.label=o=aa.text(r.text,0,0).attr({align:r.textAlign||r.align,rotation:r.rotation,zIndex:S}).css(r.style).add();G=[C[1],C[4],C[6]||C[1]];C=[C[2],C[5],C[7]||C[2]];na=pb.apply(Ua,G);S=pb.apply(Ua,C);o.align(r,false,{x:na,y:S,width:Ca.apply(Ua,G)-na,height:Ca.apply(Ua,C)-S});o.show()}else o&&o.hide();return l},destroy:function(){for(var l in this){this[l]&&this[l].destroy&&this[l].destroy();delete this[l]}mc(Nb,this)}};va=function(l,p,r,o){var T=1,Y=0,G=o?ha:D;o=
o?gb:K;G||(G=D);if(r){T*=-1;Y=A}if(Xb){T*=-1;Y-=T*A}if(p){if(Xb)l=A-l;l=l/G+o}else l=T*(l-o)*G+Y;return l};Ka=function(l,p,r){var o,T,Y;l=va(l,null,null,r);var G=r&&Oc||Pa,B=r&&jd||Xa,ia;r=T=fa(l+xa);o=Y=fa(G-l-xa);if(isNaN(l))ia=true;else if(M){o=ba;Y=G-rb;if(r<V||r>V+wa)ia=true}else{r=V;T=B-Ab;if(o<ba||o>ba+sa)ia=true}return ia?null:aa.crispLine([Za,r,o,Da,T,Y],p||0)};if(Ga&&ma&&Xb===Ra)Xb=true;qa(s,{addPlotBand:ua,addPlotLine:ua,adjustTickAmount:function(){if(Gb&&!N&&!Va&&!Mb){var l=ec,p=ra.length;
ec=Gb[H];if(p<ec){for(;ra.length<ec;)ra.push(L(ra[ra.length-1]+Wa));D*=(p-1)/(ec-1);P=ra[ra.length-1]}if(J(l)&&ec!=l)s.isDirty=true}},categories:Va,getExtremes:function(){return{min:K,max:P,dataMin:Ta,dataMax:u}},getPlotLinePath:Ka,getThreshold:function(l){if(K>l)l=K;else if(P<l)l=P;return va(l,0,1)},isXAxis:ma,options:h,plotLinesAndBands:Nb,getOffset:function(){var l=Z.length&&J(K)&&J(P),p=0,r=0,o=h.title,T=h.labels,Y=[-1,1,1,-1][E];if(!tb){tb=aa.g("axis").attr({zIndex:7}).add();Hb=aa.g("grid").attr({zIndex:1}).add()}fc=
0;if(l||Mb){t(ra,function(B){if(sb[B])sb[B].addLabel();else sb[B]=new x(B);if(E===0||E==2||{1:"left",3:"right"}[E]==T.align)fc=Ca(sb[B].getLabelSize(),fc)});if(Nc)fc+=(Nc-1)*16}else for(var G in sb){sb[G].destroy();delete sb[G]}if(o&&o.text){if(!s.axisTitle)s.axisTitle=aa.text(o.text,0,0).attr({zIndex:7,rotation:o.rotation||0,align:o.textAlign||{low:"left",middle:"center",high:"right"}[o.align]}).css(o.style).add();p=s.axisTitle.getBBox()[M?"height":"width"];r=y(o.margin,M?5:10)}Q=Y*(h.offset||Pb[E]);
gd=fc+(E!=2&&fc&&Y*h.labels[M?"y":"x"])+r;Pb[E]=Ca(Pb[E],gd+p+Y*Q)},render:bb,setCategories:function(l,p){s.categories=Va=l;t(Z,function(r){r.translate();r.setTooltipPoints(true)});s.isDirty=true;y(p,true)&&m.redraw()},setExtremes:function(l,p,r,o){r=y(r,true);La(s,"setExtremes",{min:l,max:p},function(){pa=l;Na=p;r&&m.redraw(o)})},setScale:Ea,setTickPositions:ga,translate:va,redraw:function(){gc.resetTracker&&gc.resetTracker();bb();t(Nb,function(l){l.render()});t(Z,function(l){l.isDirty=true})},removePlotBand:Ja,
removePlotLine:Ja,reversed:Xb,stacks:ea});for(id in Md)Qa(s,id,Md[id]);Ea()}function d(){var m={};return{add:function(h,x,w,O){if(!m[h]){x=aa.text(x,0,0).css(a.toolbar.itemStyle).align({align:"right",x:-Ab-20,y:ba+30}).on("click",O).attr({align:"right",zIndex:20}).add();m[h]=x}},remove:function(h){Fc(m[h].element);m[h]=null}}}function e(m){function h(){var H=this.points||nc(this),A=H[0].series.xAxis,D=this.x;A=A&&A.options.type=="datetime";var ha=Kb(D)||A,xa;xa=ha?['<span style="font-size: 10px">',
A?Mc("%A, %b %e, %Y",D):D,"</span><br/>"]:[];t(H,function(va){xa.push(va.point.tooltipFormatter(ha))});return xa.join("")}function x(H,A){E=ma?H:(2*E+H)/3;ea=ma?A:(ea+A)/2;s.translate(E,ea);kd=cb(H-E)>1||cb(A-ea)>1?function(){x(H,A)}:null}function w(){if(!ma){var H=q.hoverPoints;s.hide();t(ga,function(A){A&&A.hide()});H&&t(H,function(A){A.setState()});q.hoverPoints=null;ma=true}}var O,ja=m.borderWidth,L=m.crosshairs,ga=[],Ea=m.style,ua=m.shared,bb=oa(Ea.padding),Ja=ja+bb,ma=true,Oa,M,E=0,ea=0;Ea.padding=
0;var s=aa.g("tooltip").attr({zIndex:8}).add(),N=aa.rect(Ja,Ja,0,0,m.borderRadius,ja).attr({fill:m.backgroundColor,"stroke-width":ja}).add(s).shadow(m.shadow),Q=aa.text("",bb+Ja,oa(Ea.fontSize)+bb+Ja).attr({zIndex:1}).css(Ea).add(s);s.hide();return{shared:ua,refresh:function(H){var A,D,ha,xa=0,va={},Ka=[];ha=H.tooltipPos;A=m.formatter||h;va=q.hoverPoints;var tb=function(Fa){return{series:Fa.series,point:Fa,x:Fa.category,y:Fa.y,percentage:Fa.percentage,total:Fa.total||Fa.stackTotal}};if(ua){va&&t(va,
function(Fa){Fa.setState()});q.hoverPoints=H;t(H,function(Fa){Fa.setState(yb);xa+=Fa.plotY;Ka.push(tb(Fa))});D=H[0].plotX;xa=fa(xa)/H.length;va={x:H[0].category};va.points=Ka;H=H[0]}else va=tb(H);va=A.call(va);O=H.series;D=ua?D:H.plotX;xa=ua?xa:H.plotY;A=fa(ha?ha[0]:Ga?wa-xa:D);D=fa(ha?ha[1]:Ga?sa-D:xa);ha=ua||!H.series.isCartesian||hc(A,D);if(va===false||!ha)w();else{if(ma){s.show();ma=false}Q.attr({text:va});ha=Q.getBBox();Oa=ha.width+2*bb;M=ha.height+2*bb;N.attr({width:Oa,height:M,stroke:m.borderColor||
H.color||O.color||"#606060"});A=A-Oa+V-25;D=D-M+ba+10;if(A<7){A=7;D-=30}if(D<5)D=5;else if(D+M>Pa)D=Pa-M-5;x(fa(A-Ja),fa(D-Ja))}if(L){L=nc(L);D=L.length;for(var Hb;D--;)if(L[D]&&(Hb=H.series[D?"yAxis":"xAxis"])){A=Hb.getPlotLinePath(H[D?"y":"x"],1);if(ga[D])ga[D].attr({d:A,visibility:Bb});else{ha={"stroke-width":L[D].width||1,stroke:L[D].color||"#C0C0C0",zIndex:2};if(L[D].dashStyle)ha.dashstyle=L[D].dashStyle;ga[D]=aa.path(A).attr(ha).add()}}}},hide:w}}function f(m,h){function x(E){var ea;E=E||ib.event;
if(!E.target)E.target=E.srcElement;ea=E.touches?E.touches.item(0):E;if(E.type!="mousemove"||ib.opera){for(var s=ta,N={left:s.offsetLeft,top:s.offsetTop};s=s.offsetParent;){N.left+=s.offsetLeft;N.top+=s.offsetTop;if(s!=Aa.body&&s!=Aa.documentElement){N.left-=s.scrollLeft;N.top-=s.scrollTop}}qc=N}if(Ac){E.chartX=E.x;E.chartY=E.y}else if(ea.layerX===Ra){E.chartX=ea.pageX-qc.left;E.chartY=ea.pageY-qc.top}else{E.chartX=E.layerX;E.chartY=E.layerY}return E}function w(E){var ea={xAxis:[],yAxis:[]};t(ab,function(s){var N=
s.translate,Q=s.isXAxis;ea[Q?"xAxis":"yAxis"].push({axis:s,value:N((Ga?!Q:Q)?E.chartX-V:sa-E.chartY+ba,true)})});return ea}function O(){var E=m.hoverSeries,ea=m.hoverPoint;ea&&ea.onMouseOut();E&&E.onMouseOut();rc&&rc.hide();ld=null}function ja(){if(ua){var E={xAxis:[],yAxis:[]},ea=ua.getBBox(),s=ea.x-V,N=ea.y-ba;if(Ea){t(ab,function(Q){var H=Q.translate,A=Q.isXAxis,D=Ga?!A:A,ha=H(D?s:sa-N-ea.height,true);H=H(D?s+ea.width:sa-N,true);E[A?"xAxis":"yAxis"].push({axis:Q,min:pb(ha,H),max:Ca(ha,H)})});La(m,
"selection",E,md)}ua=ua.destroy()}m.mouseIsDown=nd=Ea=false;Cb(Aa,Ib?"touchend":"mouseup",ja)}var L,ga,Ea,ua,bb=v.zoomType,Ja=/x/.test(bb),ma=/y/.test(bb),Oa=Ja&&!Ga||ma&&Ga,M=ma&&!Ga||Ja&&Ga;Pc=function(){if(Qc){Qc.translate(V,ba);Ga&&Qc.attr({width:m.plotWidth,height:m.plotHeight}).invert()}else m.trackerGroup=Qc=aa.g("tracker").attr({zIndex:9}).add()};Pc();if(h.enabled)m.tooltip=rc=e(h);(function(){var E=true;ta.onmousedown=function(s){s=x(s);m.mouseIsDown=nd=true;L=s.chartX;ga=s.chartY;Qa(Aa,
Ib?"touchend":"mouseup",ja)};var ea=function(s){if(!(s&&s.touches&&s.touches.length>1)){s=x(s);if(!Ib)s.returnValue=false;var N=s.chartX,Q=s.chartY,H=!hc(N-V,Q-ba);if(Ib&&s.type=="touchstart")if(za(s.target,"isTracker"))m.runTrackerClick||s.preventDefault();else!ae&&!H&&s.preventDefault();if(H){E||O();if(N<V)N=V;else if(N>V+wa)N=V+wa;if(Q<ba)Q=ba;else if(Q>ba+sa)Q=ba+sa}if(nd&&s.type!="touchstart"){if(Ea=Math.sqrt(Math.pow(L-N,2)+Math.pow(ga-Q,2))>10){if(ic&&(Ja||ma)&&hc(L-V,ga-ba))ua||(ua=aa.rect(V,
ba,Oa?1:wa,M?1:sa,0).attr({fill:"rgba(69,114,167,0.25)",zIndex:7}).add());if(ua&&Oa){N=N-L;ua.attr({width:cb(N),x:(N>0?0:N)+L})}if(ua&&M){Q=Q-ga;ua.attr({height:cb(Q),y:(Q>0?0:Q)+ga})}}}else if(!H){var A;Q=m.hoverPoint;N=m.hoverSeries;var D,ha,xa=Xa,va=Ga?s.chartY:s.chartX-V;if(rc&&h.shared){A=[];D=Ba.length;for(ha=0;ha<D;ha++)if(Ba[ha].visible&&Ba[ha].tooltipPoints.length){s=Ba[ha].tooltipPoints[va];s._dist=cb(va-s.plotX);xa=pb(xa,s._dist);A.push(s)}for(D=A.length;D--;)A[D]._dist>xa&&A.splice(D,
1);if(A.length&&A[0].plotX!=ld){rc.refresh(A);ld=A[0].plotX}}if(N&&N.tracker)(s=N.tooltipPoints[va])&&s!=Q&&s.onMouseOver()}return(E=H)||!ic}};ta.onmousemove=ea;Qa(ta,"mouseleave",O);ta.ontouchstart=function(s){if(Ja||ma)ta.onmousedown(s);ea(s)};ta.ontouchmove=ea;ta.ontouchend=function(){Ea&&O()};ta.onclick=function(s){var N=m.hoverPoint;s=x(s);s.cancelBubble=true;if(!Ea)if(N&&za(s.target,"isTracker")){var Q=N.plotX,H=N.plotY;qa(N,{pageX:qc.left+V+(Ga?wa-H:Q),pageY:qc.top+ba+(Ga?sa-Q:H)});La(N.series,
"click",qa(s,{point:N}));N.firePointEvent("click",s)}else{qa(s,w(s));hc(s.chartX-V,s.chartY-ba)&&La(m,"click",s)}Ea=false}})();Nd=setInterval(function(){kd&&kd()},32);qa(this,{zoomX:Ja,zoomY:ma,resetTracker:O})}function g(m){var h=m.type||v.type||v.defaultSeriesType,x=ub[h],w=q.hasRendered;if(w)if(Ga&&h=="column")x=ub.bar;else if(!Ga&&h=="bar")x=ub.column;h=new x;h.init(q,m);if(!w&&h.inverted)Ga=true;if(h.isCartesian)ic=h.isCartesian;Ba.push(h);return h}function i(){v.alignTicks!==false&&t(ab,function(m){m.adjustTickAmount()});
Gb=null}function k(m){var h=q.isDirtyLegend,x,w=q.isDirtyBox,O=Ba.length,ja=O,L=q.clipRect;for(bc(m,q);ja--;){m=Ba[ja];if(m.isDirty&&m.options.stacking){x=true;break}}if(x)for(ja=O;ja--;){m=Ba[ja];if(m.options.stacking)m.isDirty=true}t(Ba,function(ga){if(ga.isDirty){ga.cleanData();ga.getSegments();if(ga.options.legendType=="point")h=true}});if(h&&od.renderLegend){od.renderLegend();q.isDirtyLegend=false}if(ic){if(!Rc){Gb=null;t(ab,function(ga){ga.setScale()})}i();sc();t(ab,function(ga){if(ga.isDirty||
w){ga.redraw();w=true}})}if(w){pd();Pc();if(L){Sc(L);L.animate({width:q.plotSizeX,height:q.plotSizeY})}}t(Ba,function(ga){if(ga.isDirty&&ga.visible&&(!ga.isCartesian||ga.xAxis))ga.redraw()});gc&&gc.resetTracker&&gc.resetTracker();La(q,"redraw")}function j(){var m=a.xAxis||{},h=a.yAxis||{},x;m=nc(m);t(m,function(w,O){w.index=O;w.isX=true});h=nc(h);t(h,function(w,O){w.index=O});ab=m.concat(h);q.xAxis=[];q.yAxis=[];ab=jc(ab,function(w){x=new c(q,w);q[x.isXAxis?"xAxis":"yAxis"].push(x);return x});i()}
function n(m,h){kc=ya(a.title,m);tc=ya(a.subtitle,h);t([["title",m,kc],["subtitle",h,tc]],function(x){var w=x[0],O=q[w],ja=x[1];x=x[2];if(O&&ja){O.destroy();O=null}if(x&&x.text&&!O)q[w]=aa.text(x.text,0,0).attr({align:x.align,"class":"highcharts-"+w,zIndex:1}).css(x.style).add().align(x,false,uc)})}function z(){jb=v.renderTo;Od=Zb+qd++;if(Kb(jb))jb=Aa.getElementById(jb);jb.innerHTML="";if(!jb.offsetWidth){Qb=jb.cloneNode(0);Ia(Qb,{position:lc,top:"-9999px",display:""});Aa.body.appendChild(Qb)}Tc=
(Qb||jb).offsetWidth;vc=(Qb||jb).offsetHeight;q.chartWidth=Xa=v.width||Tc||600;q.chartHeight=Pa=v.height||(vc>19?vc:400);q.container=ta=fb(Lb,{className:"highcharts-container"+(v.className?" "+v.className:""),id:Od},qa({position:Pd,overflow:vb,width:Xa+$a,height:Pa+$a,textAlign:"left"},v.style),Qb||jb);q.renderer=aa=v.forExport?new Uc(ta,Xa,Pa,true):new Qd(ta,Xa,Pa);var m,h;if(Rd&&ta.getBoundingClientRect){m=function(){Ia(ta,{left:0,top:0});h=ta.getBoundingClientRect();Ia(ta,{left:-h.left%1+$a,top:-h.top%
1+$a})};m();Qa(ib,"resize",m);Qa(q,"destroy",function(){Cb(ib,"resize",m)})}}function F(){function m(){var x=v.width||jb.offsetWidth,w=v.height||jb.offsetHeight;if(x&&w){if(x!=Tc||w!=vc){clearTimeout(h);h=setTimeout(function(){rd(x,w,false)},100)}Tc=x;vc=w}}var h;Qa(window,"resize",m);Qa(q,"destroy",function(){Cb(window,"resize",m)})}function W(){var m=a.labels,h=a.credits,x;n();od=q.legend=new be(q);sc();t(ab,function(w){w.setTickPositions(true)});i();sc();pd();ic&&t(ab,function(w){w.render()});
if(!q.seriesGroup)q.seriesGroup=aa.g("series-group").attr({zIndex:3}).add();t(Ba,function(w){w.translate();w.setTooltipPoints();w.render()});m.items&&t(m.items,function(){var w=qa(m.style,this.style),O=oa(w.left)+V,ja=oa(w.top)+ba+12;delete w.left;delete w.top;aa.text(this.html,O,ja).attr({zIndex:2}).css(w).add()});if(!q.toolbar)q.toolbar=d(q);if(h.enabled&&!q.credits){x=h.href;aa.text(h.text,0,0).on("click",function(){if(x)location.href=x}).attr({align:h.position.align,zIndex:8}).css(h.style).add().align(h.position)}Pc();
q.hasRendered=true;if(Qb){jb.appendChild(ta);Fc(Qb)}}function ca(){var m=Ba.length,h=ta&&ta.parentNode;La(q,"destroy");Cb(ib,"unload",ca);Cb(q);for(t(ab,function(x){Cb(x)});m--;)Ba[m].destroy();if(ta){ta.innerHTML="";Cb(ta);h&&h.removeChild(ta);ta=null}if(aa)aa.alignedObjects=null;clearInterval(Nd);for(m in q)delete q[m]}function ka(){if(!wc&&ib==ib.top&&Aa.readyState!="complete")Aa.attachEvent("onreadystatechange",function(){Aa.detachEvent("onreadystatechange",ka);ka()});else{z();sd();td();t(a.series||
[],function(m){g(m)});q.inverted=Ga=y(Ga,a.chart.inverted);j();q.render=W;q.tracker=gc=new f(q,a.tooltip);W();La(q,"load");b&&b.apply(q,[q]);t(q.callbacks,function(m){m.apply(q,[q])})}}Lc=ya(Lc,Sa.xAxis);hd=ya(hd,Sa.yAxis);Sa.xAxis=Sa.yAxis=null;a=ya(Sa,a);var v=a.chart,I=v.margin;I=Eb(I)?I:[I,I,I,I];var da=y(v.marginTop,I[0]),X=y(v.marginRight,I[1]),U=y(v.marginBottom,I[2]),R=y(v.marginLeft,I[3]),Ha=v.spacingTop,Ya=v.spacingRight,ud=v.spacingBottom,Vc=v.spacingLeft,uc,kc,tc,ba,Ab,rb,V,Pb,jb,Qb,ta,
Od,Tc,vc,Xa,Pa,jd,Oc,Wc,vd,wd,Xc,q=this,ae=(I=v.events)&&!!I.click,xd,hc,rc,nd,$b,Sd,yd,sa,wa,gc,Qc,Pc,od,Rb,Sb,qc,ic=v.showAxes,Rc=0,ab=[],Gb,Ba=[],Ga,aa,kd,Nd,ld,pd,sc,sd,td,rd,md,Td,be=function(m){function h(u,Z){var pa=u.legendItem,Na=u.legendLine,P=u.legendSymbol,K=M.color,gb=Z?L.itemStyle.color:K;K=Z?u.color:K;pa&&pa.css({fill:gb});Na&&Na.attr({stroke:K});P&&P.attr({stroke:K,fill:K})}function x(u,Z,pa){var Na=u.legendItem,P=u.legendLine,K=u.legendSymbol;u=u.checkbox;Na&&Na.attr({x:Z,y:pa});
P&&P.translate(Z,pa-4);K&&K.attr({x:Z+K.xOff,y:pa+K.yOff});if(u){u.x=Z;u.y=pa}}function w(){t(bb,function(u){var Z=u.checkbox;Z&&Ia(Z,{left:Ka.attr("translateX")+u.legendItemWidth+Z.x-40+$a,top:Ka.attr("translateY")+Z.y-11+$a})})}function O(u){var Z,pa,Na,P,K,gb=u.legendItem;P=u.series||u;if(!gb){K=/^(bar|pie|area|column)$/.test(P.type);u.legendItem=gb=aa.text(L.labelFormatter.call(u),0,0).css(u.visible?ma:M).on("mouseover",function(){u.setState(yb);gb.css(Oa)}).on("mouseout",function(){gb.css(u.visible?
ma:M);u.setState()}).on("click",function(){var Vb=function(){u.setVisible()};u.firePointEvent?u.firePointEvent("legendItemClick",null,Vb):La(u,"legendItemClick",null,Vb)}).attr({zIndex:2}).add(Ka);if(!K&&u.options&&u.options.lineWidth){var cc=u.options;P={"stroke-width":cc.lineWidth,zIndex:2};if(cc.dashStyle)P.dashstyle=cc.dashStyle;u.legendLine=aa.path([Za,-Ea-ua,0,Da,-ua,0]).attr(P).add(Ka)}if(K)Z=aa.rect(pa=-Ea-ua,Na=-11,Ea,12,2).attr({"stroke-width":0,zIndex:3}).add(Ka);else if(u.options&&u.options.marker&&
u.options.marker.enabled)Z=aa.symbol(u.symbol,pa=-Ea/2-ua,Na=-4,u.options.marker.radius).attr(u.pointAttr[db]).attr({zIndex:3}).add(Ka);if(Z){Z.xOff=pa;Z.yOff=Na}u.legendSymbol=Z;h(u,u.visible);if(u.options&&u.options.showCheckbox){u.checkbox=fb("input",{type:"checkbox",checked:u.selected,defaultChecked:u.selected},L.itemCheckboxStyle,ta);Qa(u.checkbox,"click",function(Vb){La(u,"checkboxClick",{checked:Vb.target.checked},function(){u.select()})})}}Z=gb.getBBox();pa=u.legendItemWidth=L.itemWidth||
Ea+ua+Z.width+ea;D=Z.height;if(ga&&Q-N+pa>(Hb||Xa-2*E-N)){Q=N;H+=D}A=H;x(u,Q,H);if(ga)Q+=pa;else H+=D;tb=Hb||Ca(ga?Q-N:pa,tb);bb.push(u)}function ja(){Q=N;H=s;A=tb=0;bb=[];Ka||(Ka=aa.g("legend").attr({zIndex:7}).add());Ta&&Fa.reverse();t(Fa,function(Na){if(Na.options.showInLegend)t(Na.options.legendType=="point"?Na.data:[Na],O)});Ta&&Fa.reverse();Rb=Hb||tb;Sb=A-s+D;if(xa||va){Rb+=2*E;Sb+=2*E;if(ha)Rb>0&&Sb>0&&ha.animate(ha.crisp(null,null,null,Rb,Sb));else ha=aa.rect(0,0,Rb,Sb,L.borderRadius,xa||
0).attr({stroke:L.borderColor,"stroke-width":xa||0,fill:va||nb}).add(Ka).shadow(L.shadow);ha[bb.length?"show":"hide"]()}for(var u=["left","right","top","bottom"],Z,pa=4;pa--;){Z=u[pa];if(Ja[Z]&&Ja[Z]!="auto"){L[pa<2?"align":"verticalAlign"]=Z;L[pa<2?"x":"y"]=oa(Ja[Z])*(pa%2?-1:1)}}Ka.align(qa(L,{width:Rb,height:Sb}),true,uc);Rc||w()}var L=m.options.legend;if(L.enabled){var ga=L.layout=="horizontal",Ea=L.symbolWidth,ua=L.symbolPadding,bb,Ja=L.style,ma=L.itemStyle,Oa=L.itemHoverStyle,M=L.itemHiddenStyle,
E=oa(Ja.padding),ea=20,s=18,N=4+E+Ea+ua,Q,H,A,D=0,ha,xa=L.borderWidth,va=L.backgroundColor,Ka,tb,Hb=L.width,Fa=m.series,Ta=L.reversed;ja();Qa(m,"endResize",w);return{colorizeItem:h,destroyItem:function(u){var Z=u.checkbox;t(["legendItem","legendLine","legendSymbol"],function(pa){u[pa]&&u[pa].destroy()});Z&&Fc(u.checkbox)},renderLegend:ja}}};hc=function(m,h){return m>=0&&m<=wa&&h>=0&&h<=sa};Td=function(){La(q,"selection",{resetSelection:true},md);q.toolbar.remove("zoom")};md=function(m){var h=Sa.lang,
x=q.pointCount<100;q.toolbar.add("zoom",h.resetZoom,h.resetZoomTitle,Td);!m||m.resetSelection?t(ab,function(w){w.setExtremes(null,null,false,x)}):t(m.xAxis.concat(m.yAxis),function(w){var O=w.axis;if(q.tracker[O.isXAxis?"zoomX":"zoomY"])O.setExtremes(w.min,w.max,false,x)});k()};sc=function(){var m=a.legend,h=y(m.margin,10),x=m.x,w=m.y,O=m.align,ja=m.verticalAlign,L;sd();if((q.title||q.subtitle)&&!J(da))if(L=Ca(q.title&&!kc.floating&&!kc.verticalAlign&&kc.y||0,q.subtitle&&!tc.floating&&!tc.verticalAlign&&
tc.y||0))ba=Ca(ba,L+y(kc.margin,15)+Ha);if(m.enabled&&!m.floating)if(O=="right")J(X)||(Ab=Ca(Ab,Rb-x+h+Ya));else if(O=="left")J(R)||(V=Ca(V,Rb+x+h+Vc));else if(ja=="top")J(da)||(ba=Ca(ba,Sb+w+h+Ha));else if(ja=="bottom")J(U)||(rb=Ca(rb,Sb-w+h+ud));ic&&t(ab,function(ga){ga.getOffset()});J(R)||(V+=Pb[3]);J(da)||(ba+=Pb[0]);J(U)||(rb+=Pb[2]);J(X)||(Ab+=Pb[1]);td()};rd=function(m,h,x){var w=q.title,O=q.subtitle;Rc+=1;bc(x,q);Oc=Pa;jd=Xa;Xa=fa(m);Pa=fa(h);Ia(ta,{width:Xa+$a,height:Pa+$a});aa.setSize(Xa,
Pa,x);wa=Xa-V-Ab;sa=Pa-ba-rb;Gb=null;t(ab,function(ja){ja.isDirty=true;ja.setScale()});t(Ba,function(ja){ja.isDirty=true});q.isDirtyLegend=true;q.isDirtyBox=true;sc();w&&w.align(null,null,uc);O&&O.align(null,null,uc);k(x);Oc=null;La(q,"resize");setTimeout(function(){La(q,"endResize",null,function(){Rc-=1})},Bc&&Bc.duration||500)};td=function(){q.plotLeft=V=fa(V);q.plotTop=ba=fa(ba);q.plotWidth=wa=fa(Xa-V-Ab);q.plotHeight=sa=fa(Pa-ba-rb);q.plotSizeX=Ga?sa:wa;q.plotSizeY=Ga?wa:sa;uc={x:Vc,y:Ha,width:Xa-
Vc-Ya,height:Pa-Ha-ud}};sd=function(){ba=y(da,Ha);Ab=y(X,Ya);rb=y(U,ud);V=y(R,Vc);Pb=[0,0,0,0]};pd=function(){var m=v.borderWidth||0,h=v.backgroundColor,x=v.plotBackgroundColor,w=v.plotBackgroundImage,O,ja={x:V,y:ba,width:wa,height:sa};O=m+(v.shadow?8:0);if(m||h)if(Wc)Wc.animate(Wc.crisp(null,null,null,Xa-O,Pa-O));else Wc=aa.rect(O/2,O/2,Xa-O,Pa-O,v.borderRadius,m).attr({stroke:v.borderColor,"stroke-width":m,fill:h||nb}).add().shadow(v.shadow);if(x)if(vd)vd.animate(ja);else vd=aa.rect(V,ba,wa,sa,
0).attr({fill:x}).add().shadow(v.plotShadow);if(w)if(wd)wd.animate(ja);else wd=aa.image(w,V,ba,wa,sa).add();if(v.plotBorderWidth)if(Xc)Xc.animate(Xc.crisp(null,V,ba,wa,sa));else Xc=aa.rect(V,ba,wa,sa,0,v.plotBorderWidth).attr({stroke:v.plotBorderColor,"stroke-width":v.plotBorderWidth,zIndex:4}).add();q.isDirtyBox=false};Yc=Jb=0;Qa(ib,"unload",ca);v.reflow!==false&&Qa(q,"load",F);if(I)for(xd in I)Qa(q,xd,I[xd]);q.options=a;q.series=Ba;q.addSeries=function(m,h,x){var w;if(m){bc(x,q);h=y(h,true);La(q,
"addSeries",{options:m},function(){w=g(m);w.isDirty=true;q.isDirtyLegend=true;h&&q.redraw()})}return w};q.animation=y(v.animation,true);q.destroy=ca;q.get=function(m){var h,x,w;for(h=0;h<ab.length;h++)if(ab[h].options.id==m)return ab[h];for(h=0;h<Ba.length;h++)if(Ba[h].options.id==m)return Ba[h];for(h=0;h<Ba.length;h++){w=Ba[h].data;for(x=0;x<w.length;x++)if(w[x].id==m)return w[x]}return null};q.getSelectedPoints=function(){var m=[];t(Ba,function(h){m=m.concat(zd(h.data,function(x){return x.selected}))});
return m};q.getSelectedSeries=function(){return zd(Ba,function(m){return m.selected})};q.hideLoading=function(){Zc($b,{opacity:0},{duration:a.loading.hideDuration,complete:function(){Ia($b,{display:nb})}});yd=false};q.isInsidePlot=hc;q.redraw=k;q.setSize=rd;q.setTitle=n;q.showLoading=function(m){var h=a.loading;if(!$b){$b=fb(Lb,{className:"highcharts-loading"},qa(h.style,{left:V+$a,top:ba+$a,width:wa+$a,height:sa+$a,zIndex:10,display:nb}),ta);Sd=fb("span",null,h.labelStyle,$b)}Sd.innerHTML=m||a.lang.loading;
if(!yd){Ia($b,{opacity:0,display:""});Zc($b,{opacity:h.style.opacity},{duration:h.showDuration});yd=true}};q.pointCount=0;ka()}var Aa=document,ib=window,Ua=Math,fa=Ua.round,ob=Ua.floor,fd=Ua.ceil,Ca=Ua.max,pb=Ua.min,cb=Ua.abs,kb=Ua.cos,zb=Ua.sin,Tb=Ua.PI,Ud=Tb*2/360,xc=navigator.userAgent,Ac=/msie/i.test(xc)&&!ib.opera,yc=Aa.documentMode==8,ce=/AppleWebKit/.test(xc),Rd=/Firefox/.test(xc),wc=!!Aa.createElementNS&&!!Aa.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,Ib="ontouchstart"in
Aa.documentElement,Jb,Yc,de={},qd=0,qb=1,Gc,Sa,Mc,Bc,$c,Ra,Lb="div",lc="absolute",Pd="relative",vb="hidden",Zb="highcharts-",Bb="visible",$a="px",nb="none",Za="M",Da="L",Vd="rgba(192,192,192,"+(wc?1.0E-6:0.0020)+")",db="",yb="hover",Cc,bd,cd,dd,oc,Dc,Ec,Cd,Dd,ed,Ed,Fd,eb=ib.HighchartsAdapter,Db=eb||{},t=Db.each,zd=Db.grep,jc=Db.map,ya=Db.merge,Ad=Db.hyphenate,Qa=Db.addEvent,Cb=Db.removeEvent,La=Db.fireEvent,Zc=Db.animate,Sc=Db.stop,ub={};eb&&eb.init&&eb.init();if(!eb&&ib.jQuery){var lb=jQuery;t=function(a,
b){for(var c=0,d=a.length;c<d;c++)if(b.call(a[c],a[c],c,a)===false)return c};zd=lb.grep;jc=function(a,b){for(var c=[],d=0,e=a.length;d<e;d++)c[d]=b.call(a[d],a[d],d,a);return c};ya=function(){var a=arguments;return lb.extend(true,null,a[0],a[1],a[2],a[3])};Ad=function(a){return a.replace(/([A-Z])/g,function(b,c){return"-"+c.toLowerCase()})};Qa=function(a,b,c){lb(a).bind(b,c)};Cb=function(a,b,c){var d=Aa.removeEventListener?"removeEventListener":"detachEvent";if(Aa[d]&&!a[d])a[d]=function(){};lb(a).unbind(b,
c)};La=function(a,b,c,d){var e=lb.Event(b),f="detached"+b;qa(e,c);if(a[b]){a[f]=a[b];a[b]=null}lb(a).trigger(e);if(a[f]){a[b]=a[f];a[f]=null}d&&!e.isDefaultPrevented()&&d(e)};Zc=function(a,b,c){var d=lb(a);if(b.d){a.toD=b.d;b.d=1}d.stop();d.animate(b,c)};Sc=function(a){lb(a).stop()};lb.extend(lb.easing,{easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c}});var ee=jQuery.fx.step._default,fe=jQuery.fx.prototype.cur;lb.fx.step._default=function(a){var b=a.elem;b.attr?b.attr(a.prop,a.now):ee.apply(this,
arguments)};lb.fx.step.d=function(a){var b=a.elem;if(!a.started){var c=$c.init(b,b.d,b.toD);a.start=c[0];a.end=c[1];a.started=true}b.attr("d",$c.step(a.start,a.end,a.pos,b.toD))};lb.fx.prototype.cur=function(){var a=this.elem;return a.attr?a.attr(this.prop):fe.apply(this,arguments)}}$c={init:function(a,b,c){b=b||"";var d=a.shift,e=b.indexOf("C")>-1,f=e?7:3,g;b=b.split(" ");c=[].concat(c);var i,k,j=function(n){for(g=n.length;g--;)n[g]==Za&&n.splice(g+1,0,n[g+1],n[g+2],n[g+1],n[g+2])};if(e){j(b);j(c)}if(a.isArea){i=
b.splice(b.length-6,6);k=c.splice(c.length-6,6)}if(d){c=[].concat(c).splice(0,f).concat(c);a.shift=false}if(b.length)for(a=c.length;b.length<a;){d=[].concat(b).splice(b.length-f,f);if(e){d[f-6]=d[f-2];d[f-5]=d[f-1]}b=b.concat(d)}if(i){b=b.concat(i);c=c.concat(k)}return[b,c]},step:function(a,b,c,d){var e=[],f=a.length;if(c==1)e=d;else if(f==b.length&&c<1)for(;f--;){d=parseFloat(a[f]);e[f]=isNaN(d)?a[f]:c*parseFloat(b[f]-d)+d}else e=b;return e}};eb={enabled:true,align:"center",x:0,y:15,style:{color:"#666",
fontSize:"11px",lineHeight:"14px"}};Sa={colors:["#4572A7","#AA4643","#89A54E","#80699B","#3D96AE","#DB843D","#92A8CD","#A47D7C","#B5CA92"],symbols:["circle","diamond","square","triangle","triangle-down"],lang:{loading:"Loading...",months:["January","February","March","April","May","June","July","August","September","October","November","December"],weekdays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],decimalPoint:".",resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",
thousandsSep:","},global:{useUTC:true},chart:{borderColor:"#4572A7",borderRadius:5,defaultSeriesType:"line",ignoreHiddenSeries:true,spacingTop:10,spacingRight:10,spacingBottom:15,spacingLeft:10,style:{fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',fontSize:"12px"},backgroundColor:"#FFFFFF",plotBorderColor:"#C0C0C0"},title:{text:"Chart title",align:"center",y:15,style:{color:"#3E576F",fontSize:"16px"}},subtitle:{text:"",align:"center",y:30,style:{color:"#6D869F"}},
plotOptions:{line:{allowPointSelect:false,showCheckbox:false,animation:{duration:1E3},events:{},lineWidth:2,shadow:true,marker:{enabled:true,lineWidth:0,radius:4,lineColor:"#FFFFFF",states:{hover:{},select:{fillColor:"#FFFFFF",lineColor:"#000000",lineWidth:2}}},point:{events:{}},dataLabels:ya(eb,{enabled:false,y:-6,formatter:function(){return this.y}}),showInLegend:true,states:{hover:{marker:{}},select:{marker:{}}},stickyTracking:true}},labels:{style:{position:lc,color:"#3E576F"}},legend:{enabled:true,
align:"center",layout:"horizontal",labelFormatter:function(){return this.name},borderWidth:1,borderColor:"#909090",borderRadius:5,shadow:false,style:{padding:"5px"},itemStyle:{cursor:"pointer",color:"#3E576F"},itemHoverStyle:{cursor:"pointer",color:"#000000"},itemHiddenStyle:{color:"#C0C0C0"},itemCheckboxStyle:{position:lc,width:"13px",height:"13px"},symbolWidth:16,symbolPadding:5,verticalAlign:"bottom",x:0,y:0},loading:{hideDuration:100,labelStyle:{fontWeight:"bold",position:Pd,top:"1em"},showDuration:100,
style:{position:lc,backgroundColor:"white",opacity:0.5,textAlign:"center"}},tooltip:{enabled:true,backgroundColor:"rgba(255, 255, 255, .85)",borderWidth:2,borderRadius:5,shadow:true,snap:Ib?25:10,style:{color:"#333333",fontSize:"12px",padding:"5px",whiteSpace:"nowrap"}},toolbar:{itemStyle:{color:"#4572A7",cursor:"pointer"}},credits:{enabled:true,text:"Highcharts.com",href:"http://www.highcharts.com",position:{align:"right",x:-10,verticalAlign:"bottom",y:-5},style:{cursor:"pointer",color:"#909090",
fontSize:"10px"}}};var Lc={dateTimeLabelFormats:{second:"%H:%M:%S",minute:"%H:%M",hour:"%H:%M",day:"%e. %b",week:"%e. %b",month:"%b '%y",year:"%Y"},endOnTick:false,gridLineColor:"#C0C0C0",labels:eb,lineColor:"#C0D0E0",lineWidth:1,max:null,min:null,minPadding:0.01,maxPadding:0.01,minorGridLineColor:"#E0E0E0",minorGridLineWidth:1,minorTickColor:"#A0A0A0",minorTickLength:2,minorTickPosition:"outside",startOfWeek:1,startOnTick:false,tickColor:"#C0D0E0",tickLength:5,tickmarkPlacement:"between",tickPixelInterval:100,
tickPosition:"outside",tickWidth:1,title:{align:"middle",style:{color:"#6D869F",fontWeight:"bold"}},type:"linear"},hd=ya(Lc,{endOnTick:true,gridLineWidth:1,tickPixelInterval:72,showLastLabel:true,labels:{align:"right",x:-8,y:3},lineWidth:0,maxPadding:0.05,minPadding:0.05,startOnTick:true,tickWidth:0,title:{rotation:270,text:"Y-values"}}),Zd={labels:{align:"right",x:-8,y:null},title:{rotation:270}},Yd={labels:{align:"left",x:8,y:null},title:{rotation:90}},Ld={labels:{align:"center",x:0,y:14},title:{rotation:0}},
Xd=ya(Ld,{labels:{y:-5}}),wb=Sa.plotOptions;eb=wb.line;wb.spline=ya(eb);wb.scatter=ya(eb,{lineWidth:0,states:{hover:{lineWidth:0}}});wb.area=ya(eb,{});wb.areaspline=ya(wb.area);wb.column=ya(eb,{borderColor:"#FFFFFF",borderWidth:1,borderRadius:0,groupPadding:0.2,marker:null,pointPadding:0.1,minPointLength:0,states:{hover:{brightness:0.1,shadow:false},select:{color:"#C0C0C0",borderColor:"#000000",shadow:false}}});wb.bar=ya(wb.column,{dataLabels:{align:"left",x:5,y:0}});wb.pie=ya(eb,{borderColor:"#FFFFFF",
borderWidth:1,center:["50%","50%"],colorByPoint:true,dataLabels:{distance:30,enabled:true,formatter:function(){return this.point.name},y:5},legendType:"point",marker:null,size:"75%",showInLegend:false,slicedOffset:10,states:{hover:{brightness:0.1,shadow:false}}});Bd();var Ub=function(a){var b=[],c;(function(d){if(c=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/.exec(d))b=[oa(c[1]),oa(c[2]),oa(c[3]),parseFloat(c[4],10)];else if(c=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(d))b=
[oa(c[1],16),oa(c[2],16),oa(c[3],16),1]})(a);return{get:function(d){return b&&!isNaN(b[0])?d=="rgb"?"rgb("+b[0]+","+b[1]+","+b[2]+")":d=="a"?b[3]:"rgba("+b.join(",")+")":a},brighten:function(d){if(ac(d)&&d!==0){var e;for(e=0;e<3;e++){b[e]+=oa(d*255);if(b[e]<0)b[e]=0;if(b[e]>255)b[e]=255}}return this},setOpacity:function(d){b[3]=d;return this}}};Mc=function(a,b,c){function d(F){return F.toString().replace(/^([0-9])$/,"0$1")}if(!J(b)||isNaN(b))return"Invalid date";a=y(a,"%Y-%m-%d %H:%M:%S");b=new Date(b*
qb);var e=b[cd](),f=b[dd](),g=b[oc](),i=b[Dc](),k=b[Ec](),j=Sa.lang,n=j.weekdays;j=j.months;b={a:n[f].substr(0,3),A:n[f],d:d(g),e:g,b:j[i].substr(0,3),B:j[i],m:d(i+1),y:k.toString().substr(2,2),Y:k,H:d(e),I:d(e%12||12),l:e%12||12,M:d(b[bd]()),p:e<12?"AM":"PM",P:e<12?"am":"pm",S:d(b.getSeconds())};for(var z in b)a=a.replace("%"+z,b[z]);return c?a.substr(0,1).toUpperCase()+a.substr(1):a};Hc.prototype={init:function(a,b){this.element=Aa.createElementNS("http://www.w3.org/2000/svg",b);this.renderer=a},
animate:function(a,b,c){if(b=y(b,Bc,true)){b=ya(b);if(c)b.complete=c;Zc(this,a,b)}else{this.attr(a);c&&c()}},attr:function(a,b){var c,d,e,f,g=this.element,i=g.nodeName,k=this.renderer,j,n=this.shadows,z,F=this;if(Kb(a)&&J(b)){c=a;a={};a[c]=b}if(Kb(a)){c=a;if(i=="circle")c={x:"cx",y:"cy"}[c]||c;else if(c=="strokeWidth")c="stroke-width";F=za(g,c)||this[c]||0;if(c!="d"&&c!="visibility")F=parseFloat(F)}else for(c in a){j=false;d=a[c];if(c=="d"){if(d&&d.join)d=d.join(" ");if(/(NaN| {2}|^$)/.test(d))d=
"M 0 0";this.d=d}else if(c=="x"&&i=="text"){for(e=0;e<g.childNodes.length;e++){f=g.childNodes[e];za(f,"x")==za(g,"x")&&za(f,"x",d)}if(this.rotation)za(g,"transform","rotate("+this.rotation+" "+d+" "+oa(a.y||za(g,"y"))+")")}else if(c=="fill")d=k.color(d,g,c);else if(i=="circle"&&(c=="x"||c=="y"))c={x:"cx",y:"cy"}[c]||c;else if(c=="translateX"||c=="translateY"||c=="rotation"||c=="verticalAlign"){this[c]=d;this.updateTransform();j=true}else if(c=="stroke")d=k.color(d,g,c);else if(c=="dashstyle"){c="stroke-dasharray";
if(d){d=d.toLowerCase().replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");for(e=d.length;e--;)d[e]=oa(d[e])*a["stroke-width"];d=d.join(",")}}else if(c=="isTracker")this[c]=d;else if(c=="width")d=oa(d);else if(c=="align"){c="text-anchor";d={left:"start",center:"middle",right:"end"}[d]}if(c=="strokeWidth")c="stroke-width";
if(ce&&c=="stroke-width"&&d===0)d=1.0E-6;if(this.symbolName&&/^(x|y|r|start|end|innerR)/.test(c)){if(!z){this.symbolAttr(a);z=true}j=true}if(n&&/^(width|height|visibility|x|y|d)$/.test(c))for(e=n.length;e--;)za(n[e],c,d);if(c=="text"){this.textStr=d;this.added&&k.buildText(this)}else j||za(g,c,d)}return F},symbolAttr:function(a){var b=this;t(["x","y","r","start","end","width","height","innerR"],function(c){b[c]=y(a[c],b[c])});b.attr({d:b.renderer.symbols[b.symbolName](b.x,b.y,b.r,{start:b.start,end:b.end,
width:b.width,height:b.height,innerR:b.innerR})})},clip:function(a){return this.attr("clip-path","url("+this.renderer.url+"#"+a.id+")")},crisp:function(a,b,c,d,e){var f,g={},i={},k;a=a||this.strokeWidth||0;k=a%2/2;i.x=ob(b||this.x||0)+k;i.y=ob(c||this.y||0)+k;i.width=ob((d||this.width||0)-2*k);i.height=ob((e||this.height||0)-2*k);i.strokeWidth=a;for(f in i)if(this[f]!=i[f])this[f]=g[f]=i[f];return g},css:function(a){var b=this.element;b=a&&a.width&&b.nodeName=="text";if(a&&a.color)a.fill=a.color;
this.styles=a=qa(this.styles,a);if(Ac&&!wc){b&&delete a.width;Ia(this.element,a)}else this.attr({style:Wd(a)});b&&this.added&&this.renderer.buildText(this);return this},on:function(a,b){var c=b;if(Ib&&a=="click"){a="touchstart";c=function(d){d.preventDefault();b()}}this.element["on"+a]=c;return this},translate:function(a,b){return this.attr({translateX:a,translateY:b})},invert:function(){this.inverted=true;this.updateTransform();return this},updateTransform:function(){var a=this.translateX||0,b=this.translateY||
0,c=this.inverted,d=this.rotation,e=[];if(c){a+=this.attr("width");b+=this.attr("height")}if(a||b)e.push("translate("+a+","+b+")");if(c)e.push("rotate(90) scale(-1,1)");else d&&e.push("rotate("+d+" "+this.x+" "+this.y+")");e.length&&za(this.element,"transform",e.join(" "))},toFront:function(){var a=this.element;a.parentNode.appendChild(a);return this},align:function(a,b,c){if(a){this.alignOptions=a;this.alignByTranslate=b;c||this.renderer.alignedObjects.push(this)}else{a=this.alignOptions;b=this.alignByTranslate}c=
y(c,this.renderer);var d=a.align,e=a.verticalAlign,f=(c.x||0)+(a.x||0),g=(c.y||0)+(a.y||0),i={};if(/^(right|center)$/.test(d))f+=(c.width-(a.width||0))/{right:1,center:2}[d];i[b?"translateX":"x"]=fa(f);if(/^(bottom|middle)$/.test(e))g+=(c.height-(a.height||0))/({bottom:1,middle:2}[e]||1);i[b?"translateY":"y"]=fa(g);this[this.placed?"animate":"attr"](i);this.placed=true;return this},getBBox:function(){var a,b,c,d=this.rotation,e=d*Ud;try{a=qa({},this.element.getBBox())}catch(f){a={width:0,height:0}}b=
a.width;c=a.height;if(d){a.width=cb(c*zb(e))+cb(b*kb(e));a.height=cb(c*kb(e))+cb(b*zb(e))}return a},show:function(){return this.attr({visibility:Bb})},hide:function(){return this.attr({visibility:vb})},add:function(a){var b=this.renderer,c=a||b,d=c.element||b.box,e=d.childNodes,f=this.element,g=za(f,"zIndex");this.parentInverted=a&&a.inverted;this.textStr!==undefined&&b.buildText(this);if(g){c.handleZ=true;g=oa(g)}if(c.handleZ)for(c=0;c<e.length;c++){a=e[c];b=za(a,"zIndex");if(a!=f&&(oa(b)>g||!J(g)&&
J(b))){d.insertBefore(f,a);return this}}d.appendChild(f);this.added=true;return this},destroy:function(){var a=this.element||{},b=this.shadows,c=a.parentNode,d;a.onclick=a.onmouseout=a.onmouseover=a.onmousemove=null;Sc(this);c&&c.removeChild(a);b&&t(b,function(e){(c=e.parentNode)&&c.removeChild(e)});mc(this.renderer.alignedObjects,this);for(d in this)delete this[d];return null},empty:function(){for(var a=this.element,b=a.childNodes,c=b.length;c--;)a.removeChild(b[c])},shadow:function(a){var b=[],
c,d=this.element,e=this.parentInverted?"(-1,-1)":"(1,1)";if(a){for(a=1;a<=3;a++){c=d.cloneNode(0);za(c,{isShadow:"true",stroke:"rgb(0, 0, 0)","stroke-opacity":0.05*a,"stroke-width":7-2*a,transform:"translate"+e,fill:nb});d.parentNode.insertBefore(c,d);b.push(c)}this.shadows=b}return this}};var Uc=function(){this.init.apply(this,arguments)};Uc.prototype={init:function(a,b,c,d){var e=location,f;this.Element=Hc;f=this.createElement("svg").attr({xmlns:"http://www.w3.org/2000/svg",version:"1.1"});a.appendChild(f.element);
this.box=f.element;this.boxWrapper=f;this.alignedObjects=[];this.url=Ac?"":e.href.replace(/#.*?$/,"");this.defs=this.createElement("defs").add();this.forExport=d;this.setSize(b,c,false)},createElement:function(a){var b=new this.Element;b.init(this,a);return b},buildText:function(a){for(var b=a.element,c=y(a.textStr,"").toString().replace(/<(b|strong)>/g,'<span style="font-weight:bold">').replace(/<(i|em)>/g,'<span style="font-style:italic">').replace(/<a/g,"<span").replace(/<\/(b|strong|i|em|a)>/g,
"</span>").split(/<br[^>]?>/g),d=b.childNodes,e=/style="([^"]+)"/,f=/href="([^"]+)"/,g=za(b,"x"),i=a.styles,k=Rd&&i&&i.HcDirection=="rtl"&&!this.forExport,j,n=i&&oa(i.width),z=i&&i.lineHeight,F,W=d.length;W--;)b.removeChild(d[W]);n&&!a.added&&this.box.appendChild(b);t(c,function(ca,ka){var v,I=0,da;ca=ca.replace(/<span/g,"|||<span").replace(/<\/span>/g,"</span>|||");v=ca.split("|||");t(v,function(X){if(X!==""||v.length==1){var U={},R=Aa.createElementNS("http://www.w3.org/2000/svg","tspan");e.test(X)&&
za(R,"style",X.match(e)[1].replace(/(;| |^)color([ :])/,"$1fill$2"));if(f.test(X)){za(R,"onclick",'location.href="'+X.match(f)[1]+'"');Ia(R,{cursor:"pointer"})}X=X.replace(/<(.|\n)*?>/g,"")||" ";if(k){j=[];for(W=X.length;W--;)j.push(X.charAt(W));X=j.join("")}R.appendChild(Aa.createTextNode(X));if(I)U.dx=3;else U.x=g;if(!I){if(ka){da=oa(window.getComputedStyle(F,null).getPropertyValue("line-height"));if(isNaN(da))da=z||F.offsetHeight||18;za(R,"dy",da)}F=R}za(R,U);b.appendChild(R);I++;if(n){X=X.replace(/-/g,
"- ").split(" ");for(var Ha,Ya=[];X.length||Ya.length;){Ha=b.getBBox().width;U=Ha>n;if(!U||X.length==1){X=Ya;Ya=[];if(X.length){R=Aa.createElementNS("http://www.w3.org/2000/svg","tspan");za(R,{x:g,dy:z||16});b.appendChild(R);if(Ha>n)n=Ha}}else{R.removeChild(R.firstChild);Ya.unshift(X.pop())}R.appendChild(Aa.createTextNode(X.join(" ").replace(/- /g,"-")))}}}})})},crispLine:function(a,b){if(a[1]==a[4])a[1]=a[4]=fa(a[1])+b%2/2;if(a[2]==a[5])a[2]=a[5]=fa(a[2])+b%2/2;return a},path:function(a){return this.createElement("path").attr({d:a,
fill:nb})},circle:function(a,b,c){a=Eb(a)?a:{x:a,y:b,r:c};return this.createElement("circle").attr(a)},arc:function(a,b,c,d,e,f){if(Eb(a)){b=a.y;c=a.r;d=a.innerR;e=a.start;f=a.end;a=a.x}return this.symbol("arc",a||0,b||0,c||0,{innerR:d||0,start:e||0,end:f||0})},rect:function(a,b,c,d,e,f){if(Eb(a)){b=a.y;c=a.width;d=a.height;e=a.r;a=a.x}e=this.createElement("rect").attr({rx:e,ry:e,fill:nb});return e.attr(e.crisp(f,a,b,Ca(c,0),Ca(d,0)))},setSize:function(a,b,c){var d=this.alignedObjects,e=d.length;
this.width=a;this.height=b;for(this.boxWrapper[y(c,true)?"animate":"attr"]({width:a,height:b});e--;)d[e].align()},g:function(a){return this.createElement("g").attr(J(a)&&{"class":Zb+a})},image:function(a,b,c,d,e){var f={preserveAspectRatio:nb};arguments.length>1&&qa(f,{x:b,y:c,width:d,height:e});f=this.createElement("image").attr(f);f.element.setAttributeNS("http://www.w3.org/1999/xlink","href",a);return f},symbol:function(a,b,c,d,e){var f,g=this.symbols[a];g=g&&g(b,c,d,e);var i=/^url\((.*?)\)$/;
if(g){f=this.path(g);qa(f,{symbolName:a,x:b,y:c,r:d});e&&qa(f,e)}else if(i.test(a)){a=a.match(i)[1];f=this.image(a).attr({x:b,y:c});fb("img",{onload:function(){var k=de[this.src]||[this.width,this.height];f.attr({width:k[0],height:k[1]}).translate(-fa(k[0]/2),-fa(k[1]/2))},src:a})}else f=this.circle(b,c,d);return f},symbols:{square:function(a,b,c){c=0.707*c;return[Za,a-c,b-c,Da,a+c,b-c,a+c,b+c,a-c,b+c,"Z"]},triangle:function(a,b,c){return[Za,a,b-1.33*c,Da,a+c,b+0.67*c,a-c,b+0.67*c,"Z"]},"triangle-down":function(a,
b,c){return[Za,a,b+1.33*c,Da,a-c,b-0.67*c,a+c,b-0.67*c,"Z"]},diamond:function(a,b,c){return[Za,a,b-c,Da,a+c,b,a,b+c,a-c,b,"Z"]},arc:function(a,b,c,d){var e=d.start,f=d.end-1.0E-6,g=d.innerR,i=kb(e),k=zb(e),j=kb(f);f=zb(f);d=d.end-e<Tb?0:1;return[Za,a+c*i,b+c*k,"A",c,c,0,d,1,a+c*j,b+c*f,Da,a+g*j,b+g*f,"A",g,g,0,d,0,a+g*i,b+g*k,"Z"]}},clipRect:function(a,b,c,d){var e=Zb+qd++,f=this.createElement("clipPath").attr({id:e}).add(this.defs);a=this.rect(a,b,c,d,0).add(f);a.id=e;return a},color:function(a,
b,c){var d,e=/^rgba/;if(a&&a.linearGradient){var f=this;b=a.linearGradient;c=Zb+qd++;var g,i,k;g=f.createElement("linearGradient").attr({id:c,gradientUnits:"userSpaceOnUse",x1:b[0],y1:b[1],x2:b[2],y2:b[3]}).add(f.defs);t(a.stops,function(j){if(e.test(j[1])){d=Ub(j[1]);i=d.get("rgb");k=d.get("a")}else{i=j[1];k=1}f.createElement("stop").attr({offset:j[0],"stop-color":i,"stop-opacity":k}).add(g)});return"url("+this.url+"#"+c+")"}else if(e.test(a)){d=Ub(a);za(b,c+"-opacity",d.get("a"));return d.get("rgb")}else return a},
text:function(a,b,c){var d=Sa.chart.style;b=fa(y(b,0));c=fa(y(c,0));a=this.createElement("text").attr({x:b,y:c,text:a}).css({"font-family":d.fontFamily,"font-size":d.fontSize});a.x=b;a.y=c;return a}};var Ma;if(!wc){var ge=xb(Hc,{init:function(a,b){var c=["<",b,' filled="f" stroked="f"'],d=["position: ",lc,";"];if(b=="shape"||b==Lb)d.push("left:0;top:0;width:10px;height:10px;");if(yc)d.push("visibility: ",b==Lb?vb:Bb);c.push(' style="',d.join(""),'"/>');if(b){c=b==Lb||b=="span"||b=="img"?c.join(""):
a.prepVML(c);this.element=fb(c)}this.renderer=a},add:function(a){var b=this.renderer,c=this.element,d=b.box;d=a?a.element||a:d;a&&a.inverted&&b.invertChild(c,d);yc&&d.gVis==vb&&Ia(c,{visibility:vb});d.appendChild(c);this.added=true;this.alignOnAdd&&this.updateTransform();return this},attr:function(a,b){var c,d,e,f=this.element||{},g=f.style,i=f.nodeName,k=this.renderer,j=this.symbolName,n,z,F=this.shadows,W=this;if(Kb(a)&&J(b)){c=a;a={};a[c]=b}if(Kb(a)){c=a;W=c=="strokeWidth"||c=="stroke-width"?this.strokeweight:
this[c]}else for(c in a){d=a[c];n=false;if(j&&/^(x|y|r|start|end|width|height|innerR)/.test(c)){if(!z){this.symbolAttr(a);z=true}n=true}else if(c=="d"){d=d||[];this.d=d.join(" ");e=d.length;for(n=[];e--;)n[e]=ac(d[e])?fa(d[e]*10)-5:d[e]=="Z"?"x":d[e];d=n.join(" ")||"x";f.path=d;if(F)for(e=F.length;e--;)F[e].path=d;n=true}else if(c=="zIndex"||c=="visibility"){if(yc&&c=="visibility"&&i=="DIV"){f.gVis=d;n=f.childNodes;for(e=n.length;e--;)Ia(n[e],{visibility:d});if(d==Bb)d=null}if(d)g[c]=d;n=true}else if(/^(width|height)$/.test(c)){if(this.updateClipping){this[c]=
d;this.updateClipping()}else g[c]=d;n=true}else if(/^(x|y)$/.test(c)){this[c]=d;if(f.tagName=="SPAN")this.updateTransform();else g[{x:"left",y:"top"}[c]]=d}else if(c=="class")f.className=d;else if(c=="stroke"){d=k.color(d,f,c);c="strokecolor"}else if(c=="stroke-width"||c=="strokeWidth"){f.stroked=d?true:false;c="strokeweight";this[c]=d;if(ac(d))d+=$a}else if(c=="dashstyle"){(f.getElementsByTagName("stroke")[0]||fb(k.prepVML(["<stroke/>"]),null,null,f))[c]=d||"solid";this.dashstyle=d;n=true}else if(c==
"fill")if(i=="SPAN")g.color=d;else{f.filled=d!=nb?true:false;d=k.color(d,f,c);c="fillcolor"}else if(c=="translateX"||c=="translateY"||c=="rotation"||c=="align"){if(c=="align")c="textAlign";this[c]=d;this.updateTransform();n=true}else if(c=="text"){f.innerHTML=d;n=true}if(F&&c=="visibility")for(e=F.length;e--;)F[e].style[c]=d;if(!n)if(yc)f[c]=d;else za(f,c,d)}return W},clip:function(a){var b=this,c=a.members;c.push(b);b.destroyClip=function(){mc(c,b)};return b.css(a.getCSS(b.inverted))},css:function(a){var b=
this.element;if(b=a&&b.tagName=="SPAN"&&a.width){delete a.width;this.textWidth=b;this.updateTransform()}this.styles=qa(this.styles,a);Ia(this.element,a);return this},destroy:function(){this.destroyClip&&this.destroyClip();Hc.prototype.destroy.apply(this)},empty:function(){for(var a=this.element.childNodes,b=a.length,c;b--;){c=a[b];c.parentNode.removeChild(c)}},getBBox:function(){var a=this.element;if(a.nodeName=="text")a.style.position=lc;return{x:a.offsetLeft,y:a.offsetTop,width:a.offsetWidth,height:a.offsetHeight}},
on:function(a,b){this.element["on"+a]=function(){var c=ib.event;c.target=c.srcElement;b(c)};return this},updateTransform:function(){if(this.added){var a=this,b=a.element,c=a.translateX||0,d=a.translateY||0,e=a.x||0,f=a.y||0,g=a.textAlign||"left",i={left:0,center:0.5,right:1}[g],k=g&&g!="left";if(c||d)a.css({marginLeft:c,marginTop:d});a.inverted&&t(b.childNodes,function(I){a.renderer.invertChild(I,b)});if(b.tagName=="SPAN"){var j,n;c=a.rotation;var z;j=0;d=1;var F=0,W;z=oa(a.textWidth);var ca=a.xCorr||
0,ka=a.yCorr||0,v=[c,g,b.innerHTML,a.textWidth].join(",");if(v!=a.cTT){if(J(c)){j=c*Ud;d=kb(j);F=zb(j);Ia(b,{filter:c?["progid:DXImageTransform.Microsoft.Matrix(M11=",d,", M12=",-F,", M21=",F,", M22=",d,", sizingMethod='auto expand')"].join(""):nb})}j=b.offsetWidth;n=b.offsetHeight;if(j>z){Ia(b,{width:z+$a,display:"block",whiteSpace:"normal"});j=z}z=fa(oa(b.style.fontSize||12)*1.2);ca=d<0&&-j;ka=F<0&&-n;W=d*F<0;ca+=F*z*(W?1-i:i);ka-=d*z*(c?W?i:1-i:1);if(k){ca-=j*i*(d<0?-1:1);if(c)ka-=n*i*(F<0?-1:
1);Ia(b,{textAlign:g})}a.xCorr=ca;a.yCorr=ka}Ia(b,{left:e+ca,top:f+ka});a.cTT=v}}else this.alignOnAdd=true},shadow:function(a){var b=[],c=this.element,d=this.renderer,e,f=c.style,g,i=c.path;if(""+c.path==="")i="x";if(a){for(a=1;a<=3;a++){g=['<shape isShadow="true" strokeweight="',7-2*a,'" filled="false" path="',i,'" coordsize="100,100" style="',c.style.cssText,'" />'];e=fb(d.prepVML(g),null,{left:oa(f.left)+1,top:oa(f.top)+1});g=['<stroke color="black" opacity="',0.05*a,'"/>'];fb(d.prepVML(g),null,
null,e);c.parentNode.insertBefore(e,c);b.push(e)}this.shadows=b}return this}});Ma=function(){this.init.apply(this,arguments)};Ma.prototype=ya(Uc.prototype,{isIE8:xc.indexOf("MSIE 8.0")>-1,init:function(a,b,c){var d;this.Element=ge;this.alignedObjects=[];d=this.createElement(Lb);a.appendChild(d.element);this.box=d.element;this.boxWrapper=d;this.setSize(b,c,false);if(!Aa.namespaces.hcv){Aa.namespaces.add("hcv","urn:schemas-microsoft-com:vml");Aa.createStyleSheet().cssText="hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "}},
clipRect:function(a,b,c,d){var e=this.createElement();return qa(e,{members:[],left:a,top:b,width:c,height:d,getCSS:function(f){var g=this.top,i=this.left,k=i+this.width,j=g+this.height;g={clip:"rect("+fa(f?i:g)+"px,"+fa(f?j:k)+"px,"+fa(f?k:j)+"px,"+fa(f?g:i)+"px)"};!f&&yc&&qa(g,{width:k+$a,height:j+$a});return g},updateClipping:function(){t(e.members,function(f){f.css(e.getCSS(f.inverted))})}})},color:function(a,b,c){var d,e=/^rgba/;if(a&&a.linearGradient){var f,g,i=a.linearGradient,k,j,n,z;t(a.stops,
function(F,W){if(e.test(F[1])){d=Ub(F[1]);f=d.get("rgb");g=d.get("a")}else{f=F[1];g=1}if(W){n=f;z=g}else{k=f;j=g}});a=90-Ua.atan((i[3]-i[1])/(i[2]-i[0]))*180/Tb;c=["<",c,' colors="0% ',k,",100% ",n,'" angle="',a,'" opacity="',z,'" o:opacity2="',j,'" type="gradient" focus="100%" />'];fb(this.prepVML(c),null,null,b)}else if(e.test(a)&&b.tagName!="IMG"){d=Ub(a);c=["<",c,' opacity="',d.get("a"),'"/>'];fb(this.prepVML(c),null,null,b);return d.get("rgb")}else return a},prepVML:function(a){var b=this.isIE8;
a=a.join("");if(b){a=a.replace("/>",' xmlns="urn:schemas-microsoft-com:vml" />');a=a.indexOf('style="')==-1?a.replace("/>",' style="display:inline-block;behavior:url(#default#VML);" />'):a.replace('style="','style="display:inline-block;behavior:url(#default#VML);')}else a=a.replace("<","<hcv:");return a},text:function(a,b,c){var d=Sa.chart.style;return this.createElement("span").attr({text:a,x:fa(b),y:fa(c)}).css({whiteSpace:"nowrap",fontFamily:d.fontFamily,fontSize:d.fontSize})},path:function(a){return this.createElement("shape").attr({coordsize:"100 100",
d:a})},circle:function(a,b,c){return this.path(this.symbols.circle(a,b,c))},g:function(a){var b;if(a)b={className:Zb+a,"class":Zb+a};return this.createElement(Lb).attr(b)},image:function(a,b,c,d,e){var f=this.createElement("img").attr({src:a});arguments.length>1&&f.css({left:b,top:c,width:d,height:e});return f},rect:function(a,b,c,d,e,f){if(Eb(a)){b=a.y;c=a.width;d=a.height;e=a.r;a=a.x}var g=this.symbol("rect");g.r=e;return g.attr(g.crisp(f,a,b,Ca(c,0),Ca(d,0)))},invertChild:function(a,b){var c=b.style;
Ia(a,{flip:"x",left:oa(c.width)-10,top:oa(c.height)-10,rotation:-90})},symbols:{arc:function(a,b,c,d){var e=d.start,f=d.end,g=kb(e),i=zb(e),k=kb(f),j=zb(f);d=d.innerR;var n=0.07/c,z=d&&0.1/d||0;if(f-e===0)return["x"];else if(2*Tb-f+e<n)k=-n;else if(f-e<z)k=kb(e+z);return["wa",a-c,b-c,a+c,b+c,a+c*g,b+c*i,a+c*k,b+c*j,"at",a-d,b-d,a+d,b+d,a+d*k,b+d*j,a+d*g,b+d*i,"x","e"]},circle:function(a,b,c){return["wa",a-c,b-c,a+c,b+c,a+c,b,a+c,b,"e"]},rect:function(a,b,c,d){if(!J(d))return[];var e=d.width;d=d.height;
var f=a+e,g=b+d;c=pb(c,e,d);return[Za,a+c,b,Da,f-c,b,"wa",f-2*c,b,f,b+2*c,f-c,b,f,b+c,Da,f,g-c,"wa",f-2*c,g-2*c,f,g,f,g-c,f-c,g,Da,a+c,g,"wa",a,g-2*c,a+2*c,g,a+c,g,a,g-c,Da,a,b+c,"wa",a,b,a+2*c,b+2*c,a,b+c,a+c,b,"x","e"]}}})}var Qd=wc?Uc:Ma;Hd.prototype.callbacks=[];var zc=function(){};zc.prototype={init:function(a,b){var c;this.series=a;this.applyOptions(b);this.pointAttr={};if(a.options.colorByPoint){c=a.chart.options.colors;if(!this.options)this.options={};this.color=this.options.color=this.color||
c[Jb++];if(Jb>=c.length)Jb=0}a.chart.pointCount++;return this},applyOptions:function(a){var b=this.series;this.config=a;if(ac(a)||a===null)this.y=a;else if(Eb(a)&&!ac(a.length)){qa(this,a);this.options=a}else if(Kb(a[0])){this.name=a[0];this.y=a[1]}else if(ac(a[0])){this.x=a[0];this.y=a[1]}if(this.x===Ra)this.x=b.autoIncrement()},destroy:function(){var a=this,b=a.series,c;b.chart.pointCount--;a==b.chart.hoverPoint&&a.onMouseOut();b.chart.hoverPoints=null;Cb(a);t(["graphic","tracker","group","dataLabel",
"connector"],function(d){a[d]&&a[d].destroy()});a.legendItem&&a.series.chart.legend.destroyItem(a);for(c in a)a[c]=null},select:function(a,b){var c=this,d=c.series.chart;c.selected=a=y(a,!c.selected);c.firePointEvent(a?"select":"unselect");c.setState(a&&"select");b||t(d.getSelectedPoints(),function(e){if(e.selected&&e!=c){e.selected=false;e.setState(db);e.firePointEvent("unselect")}})},onMouseOver:function(){var a=this.series.chart,b=a.tooltip,c=a.hoverPoint;c&&c!=this&&c.onMouseOut();this.firePointEvent("mouseOver");
b&&!b.shared&&b.refresh(this);this.setState(yb);a.hoverPoint=this},onMouseOut:function(){this.firePointEvent("mouseOut");this.setState();this.series.chart.hoverPoint=null},tooltipFormatter:function(a){var b=this.series;return['<span style="color:'+b.color+'">',this.name||b.name,"</span>: ",!a?"<b>x = "+(this.name||this.x)+",</b> ":"","<b>",!a?"y = ":"",this.y,"</b><br/>"].join("")},getDataLabelText:function(){return this.series.options.dataLabels.formatter.call({x:this.x,y:this.y,series:this.series,
point:this,percentage:this.percentage,total:this.total||this.stackTotal})},update:function(a,b,c){var d=this,e=d.series,f=d.dataLabel,g=d.graphic,i=e.chart;b=y(b,true);d.firePointEvent("update",{options:a},function(){d.applyOptions(a);f&&f.attr({text:d.getDataLabelText()});if(Eb(a)){e.getAttribs();g&&g.attr(d.pointAttr[e.state])}e.isDirty=true;b&&i.redraw(c)})},remove:function(a,b){var c=this,d=c.series,e=d.chart,f=d.data;bc(b,e);a=y(a,true);c.firePointEvent("remove",null,function(){mc(f,c);c.destroy();
d.isDirty=true;a&&e.redraw()})},firePointEvent:function(a,b,c){var d=this,e=this.series.options;if(e.point.events[a]||d.options&&d.options.events&&d.options.events[a])this.importEvents();if(a=="click"&&e.allowPointSelect)c=function(f){d.select(null,f.ctrlKey||f.metaKey||f.shiftKey)};La(this,a,b,c)},importEvents:function(){if(!this.hasImportedEvents){var a=ya(this.series.options.point,this.options).events,b;this.events=a;for(b in a)Qa(this,b,a[b]);this.hasImportedEvents=true}},setState:function(a){var b=
this.series,c=b.options.states,d=wb[b.type].marker&&b.options.marker,e=d&&!d.enabled,f=(d=d&&d.states[a])&&d.enabled===false,g=b.stateMarkerGraphic,i=b.chart,k=this.pointAttr;a||(a=db);if(!(a==this.state||this.selected&&a!="select"||c[a]&&c[a].enabled===false||a&&(f||e&&!d.enabled))){if(this.graphic)this.graphic.attr(k[a]);else{if(a){if(!g)b.stateMarkerGraphic=g=i.renderer.circle(0,0,k[a].r).attr(k[a]).add(b.group);g.translate(this.plotX,this.plotY)}if(g)g[a?"show":"hide"]()}this.state=a}}};var mb=
function(){};mb.prototype={isCartesian:true,type:"line",pointClass:zc,pointAttrToOptions:{stroke:"lineColor","stroke-width":"lineWidth",fill:"fillColor",r:"radius"},init:function(a,b){var c,d;d=a.series.length;this.chart=a;b=this.setOptions(b);qa(this,{index:d,options:b,name:b.name||"Series "+(d+1),state:db,pointAttr:{},visible:b.visible!==false,selected:b.selected===true});d=b.events;for(c in d)Qa(this,c,d[c]);if(d&&d.click||b.point&&b.point.events&&b.point.events.click||b.allowPointSelect)a.runTrackerClick=
true;this.getColor();this.getSymbol();this.setData(b.data,false)},autoIncrement:function(){var a=this.options,b=this.xIncrement;b=y(b,a.pointStart,0);this.pointInterval=y(this.pointInterval,a.pointInterval,1);this.xIncrement=b+this.pointInterval;return b},cleanData:function(){var a=this.chart,b=this.data,c,d,e=a.smallestInterval,f,g;b.sort(function(i,k){return i.x-k.x});for(g=b.length-1;g>=0;g--)b[g-1]&&b[g-1].x==b[g].x&&b.splice(g-1,1);for(g=b.length-1;g>=0;g--)if(b[g-1]){f=b[g].x-b[g-1].x;if(d===
Ra||f<d){d=f;c=g}}if(e===Ra||d<e)a.smallestInterval=d;this.closestPoints=c},getSegments:function(){var a=-1,b=[],c=this.data;t(c,function(d,e){if(d.y===null){e>a+1&&b.push(c.slice(a+1,e));a=e}else e==c.length-1&&b.push(c.slice(a+1,e+1))});this.segments=b},setOptions:function(a){var b=this.chart.options.plotOptions;return ya(b[this.type],b.series,a)},getColor:function(){var a=this.chart.options.colors;this.color=this.options.color||a[Jb++]||"#0000ff";if(Jb>=a.length)Jb=0},getSymbol:function(){var a=
this.chart.options.symbols;this.symbol=this.options.marker.symbol||a[Yc++];if(Yc>=a.length)Yc=0},addPoint:function(a,b,c,d){var e=this.data,f=this.graph,g=this.area,i=this.chart;a=(new this.pointClass).init(this,a);bc(d,i);if(f&&c)f.shift=c;if(g){g.shift=c;g.isArea=true}b=y(b,true);e.push(a);c&&e[0].remove(false);this.isDirty=true;b&&i.redraw()},setData:function(a,b){var c=this,d=c.data,e=c.initialColor,f=c.chart,g=d&&d.length||0;c.xIncrement=null;if(J(e))Jb=e;for(a=jc(nc(a||[]),function(i){return(new c.pointClass).init(c,
i)});g--;)d[g].destroy();c.data=a;c.cleanData();c.getSegments();c.isDirty=true;f.isDirtyBox=true;y(b,true)&&f.redraw(false)},remove:function(a,b){var c=this,d=c.chart;a=y(a,true);if(!c.isRemoving){c.isRemoving=true;La(c,"remove",null,function(){c.destroy();d.isDirtyLegend=d.isDirtyBox=true;a&&d.redraw(b)})}c.isRemoving=false},translate:function(){for(var a=this.chart,b=this.options.stacking,c=this.xAxis.categories,d=this.yAxis,e=this.data,f=e.length;f--;){var g=e[f],i=g.x,k=g.y,j=g.low,n=d.stacks[(k<
0?"-":"")+this.stackKey];g.plotX=this.xAxis.translate(i);if(b&&this.visible&&n&&n[i]){j=n[i];i=j.total;j.cum=j=j.cum-k;k=j+k;if(b=="percent"){j=i?j*100/i:0;k=i?k*100/i:0}g.percentage=i?g.y*100/i:0;g.stackTotal=i}if(J(j))g.yBottom=d.translate(j,0,1);if(k!==null)g.plotY=d.translate(k,0,1);g.clientX=a.inverted?a.plotHeight-g.plotX:g.plotX;g.category=c&&c[g.x]!==Ra?c[g.x]:g.x}},setTooltipPoints:function(a){var b=this.chart,c=b.inverted,d=[],e=fa((c?b.plotTop:b.plotLeft)+b.plotSizeX),f,g,i=[];if(a)this.tooltipPoints=
null;t(this.segments,function(k){d=d.concat(k)});if(this.xAxis&&this.xAxis.reversed)d=d.reverse();t(d,function(k,j){f=d[j-1]?d[j-1].high+1:0;for(g=k.high=d[j+1]?ob((k.plotX+(d[j+1]?d[j+1].plotX:e))/2):e;f<=g;)i[c?e-f++:f++]=k});this.tooltipPoints=i},onMouseOver:function(){var a=this.chart,b=a.hoverSeries;if(!(!Ib&&a.mouseIsDown)){b&&b!=this&&b.onMouseOut();this.options.events.mouseOver&&La(this,"mouseOver");this.tracker&&this.tracker.toFront();this.setState(yb);a.hoverSeries=this}},onMouseOut:function(){var a=
this.options,b=this.chart,c=b.tooltip,d=b.hoverPoint;d&&d.onMouseOut();this&&a.events.mouseOut&&La(this,"mouseOut");c&&!a.stickyTracking&&c.hide();this.setState();b.hoverSeries=null},animate:function(a){var b=this.chart,c=this.clipRect,d=this.options.animation;if(d&&!Eb(d))d={};if(a){if(!c.isAnimating){c.attr("width",0);c.isAnimating=true}}else{c.animate({width:b.plotSizeX},d);this.animate=null}},drawPoints:function(){var a,b=this.data,c=this.chart,d,e,f,g,i,k;if(this.options.marker.enabled)for(f=
b.length;f--;){g=b[f];d=g.plotX;e=g.plotY;k=g.graphic;if(e!==Ra&&!isNaN(e)){a=g.pointAttr[g.selected?"select":db];i=a.r;if(k)k.animate({x:d,y:e,r:i});else g.graphic=c.renderer.symbol(y(g.marker&&g.marker.symbol,this.symbol),d,e,i).attr(a).add(this.group)}}},convertAttribs:function(a,b,c,d){var e=this.pointAttrToOptions,f,g,i={};a=a||{};b=b||{};c=c||{};d=d||{};for(f in e){g=e[f];i[f]=y(a[g],b[f],c[f],d[f])}return i},getAttribs:function(){var a=this,b=wb[a.type].marker?a.options.marker:a.options,c=
b.states,d=c[yb],e,f=a.color,g={stroke:f,fill:f},i=a.data,k=[],j,n=a.pointAttrToOptions;if(a.options.marker){d.radius=d.radius||b.radius+2;d.lineWidth=d.lineWidth||b.lineWidth+1}else d.color=d.color||Ub(d.color||f).brighten(d.brightness).get();k[db]=a.convertAttribs(b,g);t([yb,"select"],function(F){k[F]=a.convertAttribs(c[F],k[db])});a.pointAttr=k;for(f=i.length;f--;){g=i[f];if((b=g.options&&g.options.marker||g.options)&&b.enabled===false)b.radius=0;e=false;if(g.options)for(var z in n)if(J(b[n[z]]))e=
true;if(e){j=[];c=b.states||{};e=c[yb]=c[yb]||{};if(!a.options.marker)e.color=Ub(e.color||g.options.color).brighten(e.brightness||d.brightness).get();j[db]=a.convertAttribs(b,k[db]);j[yb]=a.convertAttribs(c[yb],k[yb],j[db]);j.select=a.convertAttribs(c.select,k.select,j[db])}else j=k;g.pointAttr=j}},destroy:function(){var a=this,b=a.chart,c=/\/5[0-9\.]+ (Safari|Mobile)\//.test(xc),d,e;Cb(a);a.legendItem&&a.chart.legend.destroyItem(a);t(a.data,function(f){f.destroy()});t(["area","graph","dataLabelsGroup",
"group","tracker"],function(f){if(a[f]){d=c&&f=="group"?"hide":"destroy";a[f][d]()}});if(b.hoverSeries==a)b.hoverSeries=null;mc(b.series,a);for(e in a)delete a[e]},drawDataLabels:function(){if(this.options.dataLabels.enabled){var a,b,c=this.data,d=this.options.dataLabels,e,f=this.dataLabelsGroup,g=this.chart,i=g.inverted,k=this.type,j;if(!f)f=this.dataLabelsGroup=g.renderer.g(Zb+"data-labels").attr({visibility:this.visible?Bb:vb,zIndex:5}).translate(g.plotLeft,g.plotTop).add();j=d.color;if(j=="auto")j=
null;d.style.color=y(j,this.color);t(c,function(n){var z=n.barX;z=z&&z+n.barW/2||n.plotX||-999;var F=y(n.plotY,-999),W=n.dataLabel,ca=d.align;e=n.getDataLabelText();a=(i?g.plotWidth-F:z)+d.x;b=(i?g.plotHeight-z:F)+d.y;if(k=="column")a+={left:-1,right:1}[ca]*n.barW/2||0;if(W)W.animate({x:a,y:b});else if(J(e))W=n.dataLabel=g.renderer.text(e,a,b).attr({align:ca,rotation:d.rotation,zIndex:1}).css(d.style).add(f);i&&!d.y&&W.attr({y:b+parseInt(W.styles.lineHeight)*0.9-W.getBBox().height/2})})}},drawGraph:function(){var a=
this,b=a.options,c=a.graph,d=[],e,f=a.area,g=a.group,i=b.lineColor||a.color,k=b.lineWidth,j=b.dashStyle,n,z=a.chart.renderer,F=a.yAxis.getThreshold(b.threshold||0),W=/^area/.test(a.type),ca=[],ka=[];t(a.segments,function(v){n=[];t(v,function(U,R){if(a.getPointSpline)n.push.apply(n,a.getPointSpline(v,U,R));else{n.push(R?Da:Za);R&&b.step&&n.push(U.plotX,v[R-1].plotY);n.push(U.plotX,U.plotY)}});if(v.length>1)d=d.concat(n);else ca.push(v[0]);if(W){var I=[],da,X=n.length;for(da=0;da<X;da++)I.push(n[da]);
X==3&&I.push(Da,n[1],n[2]);if(b.stacking&&a.type!="areaspline")for(da=v.length-1;da>=0;da--)I.push(v[da].plotX,v[da].yBottom);else I.push(Da,v[v.length-1].plotX,F,Da,v[0].plotX,F);ka=ka.concat(I)}});a.graphPath=d;a.singlePoints=ca;if(W){e=y(b.fillColor,Ub(a.color).setOpacity(b.fillOpacity||0.75).get());if(f)f.animate({d:ka});else a.area=a.chart.renderer.path(ka).attr({fill:e}).add(g)}if(c)c.animate({d:d});else if(k){c={stroke:i,"stroke-width":k};if(j)c.dashstyle=j;a.graph=z.path(d).attr(c).add(g).shadow(b.shadow)}},
render:function(){var a=this,b=a.chart,c,d,e=a.options,f=e.animation,g=f&&a.animate;f=g?f&&f.duration||500:0;var i=a.clipRect;d=b.renderer;if(!i){i=a.clipRect=!b.hasRendered&&b.clipRect?b.clipRect:d.clipRect(0,0,b.plotSizeX,b.plotSizeY);if(!b.clipRect)b.clipRect=i}if(!a.group){c=a.group=d.g("series");if(b.inverted){d=function(){c.attr({width:b.plotWidth,height:b.plotHeight}).invert()};d();Qa(b,"resize",d)}c.clip(a.clipRect).attr({visibility:a.visible?Bb:vb,zIndex:e.zIndex}).translate(b.plotLeft,b.plotTop).add(b.seriesGroup)}a.drawDataLabels();
g&&a.animate(true);a.getAttribs();a.drawGraph&&a.drawGraph();a.drawPoints();a.options.enableMouseTracking!==false&&a.drawTracker();g&&a.animate();setTimeout(function(){i.isAnimating=false;if((c=a.group)&&i!=b.clipRect&&i.renderer){c.clip(a.clipRect=b.clipRect);i.destroy()}},f);a.isDirty=false},redraw:function(){var a=this.chart,b=this.group;if(b){a.inverted&&b.attr({width:a.plotWidth,height:a.plotHeight});b.animate({translateX:a.plotLeft,translateY:a.plotTop})}this.translate();this.setTooltipPoints(true);
this.render()},setState:function(a){var b=this.options,c=this.graph,d=b.states;b=b.lineWidth;a=a||db;if(this.state!=a){this.state=a;if(!(d[a]&&d[a].enabled===false)){if(a)b=d[a].lineWidth||b+1;if(c&&!c.dashstyle)c.attr({"stroke-width":b},a?0:500)}}},setVisible:function(a,b){var c=this.chart,d=this.legendItem,e=this.group,f=this.tracker,g=this.dataLabelsGroup,i,k=this.data,j=c.options.chart.ignoreHiddenSeries;i=this.visible;i=(this.visible=a=a===Ra?!i:a)?"show":"hide";e&&e[i]();if(f)f[i]();else for(e=
k.length;e--;){f=k[e];f.tracker&&f.tracker[i]()}g&&g[i]();d&&c.legend.colorizeItem(this,a);this.isDirty=true;this.options.stacking&&t(c.series,function(n){if(n.options.stacking&&n.visible)n.isDirty=true});if(j)c.isDirtyBox=true;b!==false&&c.redraw();La(this,i)},show:function(){this.setVisible(true)},hide:function(){this.setVisible(false)},select:function(a){this.selected=a=a===Ra?!this.selected:a;if(this.checkbox)this.checkbox.checked=a;La(this,a?"select":"unselect")},drawTracker:function(){var a=
this,b=a.options,c=[].concat(a.graphPath),d=c.length,e=a.chart,f=e.options.tooltip.snap,g=a.tracker,i=b.cursor;i=i&&{cursor:i};var k=a.singlePoints,j;if(d)for(j=d+1;j--;){c[j]==Za&&c.splice(j+1,0,c[j+1]-f,c[j+2],Da);if(j&&c[j]==Za||j==d)c.splice(j,0,Da,c[j-2]+f,c[j-1])}for(j=0;j<k.length;j++){d=k[j];c.push(Za,d.plotX-f,d.plotY,Da,d.plotX+f,d.plotY)}if(g)g.attr({d:c});else a.tracker=e.renderer.path(c).attr({isTracker:true,stroke:Vd,fill:nb,"stroke-width":b.lineWidth+2*f,visibility:a.visible?Bb:vb,
zIndex:1}).on(Ib?"touchstart":"mouseover",function(){e.hoverSeries!=a&&a.onMouseOver()}).on("mouseout",function(){b.stickyTracking||a.onMouseOut()}).css(i).add(e.trackerGroup)}};Ma=xb(mb);ub.line=Ma;Ma=xb(mb,{type:"area"});ub.area=Ma;Ma=xb(mb,{type:"spline",getPointSpline:function(a,b,c){var d=b.plotX,e=b.plotY,f=a[c-1],g=a[c+1],i,k,j,n;if(c&&c<a.length-1){a=f.plotY;j=g.plotX;g=g.plotY;var z;i=(1.5*d+f.plotX)/2.5;k=(1.5*e+a)/2.5;j=(1.5*d+j)/2.5;n=(1.5*e+g)/2.5;z=(n-k)*(j-d)/(j-i)+e-n;k+=z;n+=z;if(k>
a&&k>e){k=Ca(a,e);n=2*e-k}else if(k<a&&k<e){k=pb(a,e);n=2*e-k}if(n>g&&n>e){n=Ca(g,e);k=2*e-n}else if(n<g&&n<e){n=pb(g,e);k=2*e-n}b.rightContX=j;b.rightContY=n}if(c){b=["C",f.rightContX||f.plotX,f.rightContY||f.plotY,i||d,k||e,d,e];f.rightContX=f.rightContY=null}else b=[Za,d,e];return b}});ub.spline=Ma;Ma=xb(Ma,{type:"areaspline"});ub.areaspline=Ma;var ad=xb(mb,{type:"column",pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color",r:"borderRadius"},init:function(){mb.prototype.init.apply(this,
arguments);var a=this,b=a.chart;b.hasColumn=true;b.hasRendered&&t(b.series,function(c){if(c.type==a.type)c.isDirty=true})},translate:function(){var a=this,b=a.chart,c=0,d=a.xAxis.reversed,e=a.xAxis.categories,f={},g,i;mb.prototype.translate.apply(a);t(b.series,function(I){if(I.type==a.type){if(I.options.stacking){g=I.stackKey;if(f[g]===Ra)f[g]=c++;i=f[g]}else if(I.visible)i=c++;I.columnIndex=i}});var k=a.options,j=a.data,n=a.closestPoints;b=cb(j[1]?j[n].plotX-j[n-1].plotX:b.plotSizeX/(e?e.length:
1));e=b*k.groupPadding;n=(b-2*e)/c;var z=k.pointWidth,F=J(z)?(n-z)/2:n*k.pointPadding,W=Ca(y(z,n-2*F),1),ca=F+(e+((d?c-a.columnIndex:a.columnIndex)||0)*n-b/2)*(d?-1:1),ka=a.yAxis.getThreshold(k.threshold||0),v=y(k.minPointLength,5);t(j,function(I){var da=I.plotY,X=I.yBottom||ka,U=I.plotX+ca,R=fd(pb(da,X)),Ha=fd(Ca(da,X)-R),Ya;if(cb(Ha)<v){if(v){Ha=v;R=cb(R-ka)>v?X-v:ka-(da<=ka?v:0)}Ya=R-3}qa(I,{barX:U,barY:R,barW:W,barH:Ha});I.shapeType="rect";I.shapeArgs={x:U,y:R,width:W,height:Ha,r:k.borderRadius};
I.trackerArgs=J(Ya)&&ya(I.shapeArgs,{height:Ca(6,Ha+3),y:Ya})})},getSymbol:function(){},drawGraph:function(){},drawPoints:function(){var a=this,b=a.options,c=a.chart.renderer,d,e;t(a.data,function(f){var g=f.plotY;if(g!==Ra&&!isNaN(g)){d=f.graphic;e=f.shapeArgs;if(d){Sc(d);d.animate(e)}else f.graphic=c[f.shapeType](e).attr(f.pointAttr[f.selected?"select":db]).add(a.group).shadow(b.shadow)}})},drawTracker:function(){var a=this,b=a.chart,c=b.renderer,d,e,f=+new Date,g=a.options.cursor,i=g&&{cursor:g},
k;t(a.data,function(j){e=j.tracker;d=j.trackerArgs||j.shapeArgs;if(j.y!==null)if(e)e.attr(d);else j.tracker=c[j.shapeType](d).attr({isTracker:f,fill:Vd,visibility:a.visible?Bb:vb,zIndex:1}).on(Ib?"touchstart":"mouseover",function(n){k=n.relatedTarget||n.fromElement;b.hoverSeries!=a&&za(k,"isTracker")!=f&&a.onMouseOver();j.onMouseOver()}).on("mouseout",function(n){if(!a.options.stickyTracking){k=n.relatedTarget||n.toElement;za(k,"isTracker")!=f&&a.onMouseOut()}}).css(i).add(b.trackerGroup)})},animate:function(a){var b=
this,c=b.data;if(!a){t(c,function(d){var e=d.graphic;if(e){e.attr({height:0,y:b.yAxis.translate(0,0,1)});e.animate({height:d.barH,y:d.barY},b.options.animation)}});b.animate=null}},remove:function(){var a=this,b=a.chart;b.hasRendered&&t(b.series,function(c){if(c.type==a.type)c.isDirty=true});mb.prototype.remove.apply(a,arguments)}});ub.column=ad;Ma=xb(ad,{type:"bar",init:function(a){a.inverted=this.inverted=true;ad.prototype.init.apply(this,arguments)}});ub.bar=Ma;Ma=xb(mb,{type:"scatter",translate:function(){var a=
this;mb.prototype.translate.apply(a);t(a.data,function(b){b.shapeType="circle";b.shapeArgs={x:b.plotX,y:b.plotY,r:a.chart.options.tooltip.snap}})},drawTracker:function(){var a=this,b=a.options.cursor,c=b&&{cursor:b},d;t(a.data,function(e){(d=e.graphic)&&d.attr({isTracker:true}).on("mouseover",function(){a.onMouseOver();e.onMouseOver()}).on("mouseout",function(){a.options.stickyTracking||a.onMouseOut()}).css(c)})},cleanData:function(){}});ub.scatter=Ma;Ma=xb(zc,{init:function(){zc.prototype.init.apply(this,
arguments);var a=this,b;qa(a,{visible:a.visible!==false,name:y(a.name,"Slice")});b=function(){a.slice()};Qa(a,"select",b);Qa(a,"unselect",b);return a},setVisible:function(a){var b=this.series.chart,c=this.tracker,d=this.dataLabel,e=this.connector,f;f=(this.visible=a=a===Ra?!this.visible:a)?"show":"hide";this.group[f]();c&&c[f]();d&&d[f]();e&&e[f]();this.legendItem&&b.legend.colorizeItem(this,a)},slice:function(a,b,c){var d=this.series.chart,e=this.slicedTranslation;bc(c,d);y(b,true);a=this.sliced=
J(a)?a:!this.sliced;this.group.animate({translateX:a?e[0]:d.plotLeft,translateY:a?e[1]:d.plotTop})}});Ma=xb(mb,{type:"pie",isCartesian:false,pointClass:Ma,pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color"},getColor:function(){this.initialColor=Jb},animate:function(){var a=this;t(a.data,function(b){var c=b.graphic;b=b.shapeArgs;var d=-Tb/2;if(c){c.attr({r:0,start:d,end:d});c.animate({r:b.r,start:b.start,end:b.end},a.options.animation)}});a.animate=null},translate:function(){var a=
0,b=-0.25,c=this.options,d=c.slicedOffset,e=d+c.borderWidth,f=c.center,g=this.chart,i=g.plotWidth,k=g.plotHeight,j,n,z,F=this.data,W=2*Tb,ca,ka=pb(i,k),v,I,da,X=c.dataLabels.distance;f.push(c.size,c.innerSize||0);f=jc(f,function(U,R){return(v=/%$/.test(U))?[i,k,ka,ka][R]*oa(U)/100:U});this.getX=function(U,R){z=Ua.asin((U-f[1])/(f[2]/2+X));return f[0]+(R?-1:1)*kb(z)*(f[2]/2+X)};this.center=f;t(F,function(U){a+=U.y});t(F,function(U){ca=a?U.y/a:0;j=fa(b*W*1E3)/1E3;b+=ca;n=fa(b*W*1E3)/1E3;U.shapeType=
"arc";U.shapeArgs={x:f[0],y:f[1],r:f[2]/2,innerR:f[3]/2,start:j,end:n};z=(n+j)/2;U.slicedTranslation=jc([kb(z)*d+g.plotLeft,zb(z)*d+g.plotTop],fa);I=kb(z)*f[2]/2;da=zb(z)*f[2]/2;U.tooltipPos=[f[0]+I*0.7,f[1]+da*0.7];U.labelPos=[f[0]+I+kb(z)*X,f[1]+da+zb(z)*X,f[0]+I+kb(z)*e,f[1]+da+zb(z)*e,f[0]+I,f[1]+da,X<0?"center":z<W/4?"left":"right",z];U.percentage=ca*100;U.total=a});this.setTooltipPoints()},render:function(){this.getAttribs();this.drawPoints();this.options.enableMouseTracking!==false&&this.drawTracker();
this.drawDataLabels();this.options.animation&&this.animate&&this.animate();this.isDirty=false},drawPoints:function(){var a=this.chart,b=a.renderer,c,d,e,f;t(this.data,function(g){d=g.graphic;f=g.shapeArgs;e=g.group;if(!e)e=g.group=b.g("point").attr({zIndex:5}).add();c=g.sliced?g.slicedTranslation:[a.plotLeft,a.plotTop];e.translate(c[0],c[1]);if(d)d.animate(f);else g.graphic=b.arc(f).attr(qa(g.pointAttr[db],{"stroke-linejoin":"round"})).add(g.group);g.visible===false&&g.setVisible(false)})},drawDataLabels:function(){var a=
this.data,b,c=this.chart,d=this.options.dataLabels,e=y(d.connectorPadding,10),f=y(d.connectorWidth,1),g,i,k=d.distance>0,j,n,z=this.center[1],F=[[],[],[],[]],W,ca,ka,v,I,da,X,U=4,R;mb.prototype.drawDataLabels.apply(this);t(a,function(Ha){var Ya=Ha.labelPos[7];F[Ya<0?0:Ya<Tb/2?1:Ya<Tb?2:3].push(Ha)});F[1].reverse();F[3].reverse();for(X=function(Ha,Ya){return Ha.y>Ya.y};U--;){a=0;b=[].concat(F[U]);b.sort(X);for(R=b.length;R--;)b[R].rank=R;for(v=0;v<2;v++){n=(da=U%3)?9999:-9999;I=da?-1:1;for(R=0;R<F[U].length;R++){b=
F[U][R];if(g=b.dataLabel){i=b.labelPos;ka=Bb;W=i[0];ca=i[1];j||(j=g&&g.getBBox().height);if(k)if(v&&b.rank<a)ka=vb;else if(!da&&ca<n+j||da&&ca>n-j){ca=n+I*j;W=this.getX(ca,U>1);if(!da&&ca+j>z||da&&ca-j<z)if(v)ka=vb;else a++}if(b.visible===false)ka=vb;if(ka==Bb)n=ca;if(v){g.attr({visibility:ka,align:i[6]})[g.moved?"animate":"attr"]({x:W+d.x+({left:e,right:-e}[i[6]]||0),y:ca+d.y});g.moved=true;if(k&&f){g=b.connector;i=[Za,W+(i[6]=="left"?5:-5),ca,Da,W,ca,Da,i[2],i[3],Da,i[4],i[5]];if(g){g.animate({d:i});
g.attr("visibility",ka)}else b.connector=g=this.chart.renderer.path(i).attr({"stroke-width":f,stroke:d.connectorColor||"#606060",visibility:ka,zIndex:3}).translate(c.plotLeft,c.plotTop).add()}}}}}}},drawTracker:ad.prototype.drawTracker,getSymbol:function(){}});ub.pie=Ma;ib.Highcharts={Chart:Hd,dateFormat:Mc,pathAnim:$c,getOptions:function(){return Sa},numberFormat:Gd,Point:zc,Color:Ub,Renderer:Qd,seriesTypes:ub,setOptions:function(a){Sa=ya(Sa,a);Bd();return Sa},Series:mb,addEvent:Qa,createElement:fb,
discardElement:Fc,css:Ia,each:t,extend:qa,map:jc,merge:ya,pick:y,extendClass:xb,version:"2.1.4"}})();
/**
 * jQuery.labelify - Display in-textbox hints
 * Stuart Langridge, http://www.kryogenix.org/
 * Released into the public domain
 * Date: 25th June 2008
 * @author Stuart Langridge
 * @version 1.3
 *
 *
 * Basic calling syntax: $("input").labelify();
 * Defaults to taking the in-field label from the field's title attribute
 *
 * You can also pass an options object with the following keys:
 *   text
 *     "title" to get the in-field label from the field's title attribute 
 *      (this is the default)
 *     "label" to get the in-field label from the inner text of the field's label
 *      (note that the label must be attached to the field with for="fieldid")
 *     a function which takes one parameter, the input field, and returns
 *      whatever text it likes
 *
 *   labelledClass
 *     a class that will be applied to the input field when it contains the
 *      label and removed when it contains user input. Defaults to blank.
 *  
 */

jQuery.fn.labelify = function(settings) {
  settings = jQuery.extend({
    text: "title",
    labelledClass: ""
  }, settings);
  var lookups = {
    title: function(input) {
      return $(input).attr("title");
    },
    label: function(input) {
      return $("label[for=" + input.id +"]").text();
    }
  };
  var lookup;
  var jQuery_labellified_elements = $(this);
  return $(this).each(function() {
    if (typeof settings.text === "string") {
      lookup = lookups[settings.text]; // what if not there?
    } else {
      lookup = settings.text; // what if not a fn?
    };
    // bail if lookup isn't a function or if it returns undefined
    if (typeof lookup !== "function") { return; }
    var lookupval = lookup(this);
    if (!lookupval) { return; }

    // need to strip newlines because the browser strips them
    // if you set textbox.value to a string containing them    
    $(this).data("label",lookup(this).replace(/\n/g,''));
    $(this).focus(function() {
      if (this.value === $(this).data("label")) {
        this.value = "";
        $(this).removeClass(settings.labelledClass);
      }
    }).blur(function(){
      if (this.value === "") {
        this.value = $(this).data("label");
        $(this).addClass(settings.labelledClass);
      }
    });
    
    var removeValuesOnExit = function() {
      jQuery_labellified_elements.each(function(){
        if (this.value === $(this).data("label")) {
          this.value = "";//this.defaultValue;
          $(this).removeClass(settings.labelledClass);
        }
      })
    };
    
    $(this).parents("form").submit(removeValuesOnExit);
    $(window).unload(removeValuesOnExit);
    
    if (this.value !== this.defaultValue) {
      // user already started typing; don't overwrite their work!
      return;
    }
    // actually set the value
    if(this.value === ""){
      this.value = $(this).data("label");
      $(this).addClass(settings.labelledClass);
    }
    

  });
};
/*
 * Jeditable - jQuery in place edit plugin
 *
 * Copyright (c) 2006-2009 Mika Tuupola, Dylan Verheul
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/jeditable
 *
 * Based on editable by Dylan Verheul <dylan_at_dyve.net>:
 *    http://www.dyve.net/jquery/?editable
 *
 */

/**
  * Version 1.7.1
  *
  * ** means there is basic unit tests for this parameter. 
  *
  * @name  Jeditable
  * @type  jQuery
  * @param String  target             (POST) URL or function to send edited content to **
  * @param Hash    options            additional options 
  * @param String  options[method]    method to use to send edited content (POST or PUT) **
  * @param Function options[callback] Function to run after submitting edited content **
  * @param String  options[name]      POST parameter name of edited content
  * @param String  options[id]        POST parameter name of edited div id
  * @param Hash    options[submitdata] Extra parameters to send when submitting edited content.
  * @param String  options[type]      text, textarea or select (or any 3rd party input type) **
  * @param Integer options[rows]      number of rows if using textarea ** 
  * @param Integer options[cols]      number of columns if using textarea **
  * @param Mixed   options[height]    'auto', 'none' or height in pixels **
  * @param Mixed   options[width]     'auto', 'none' or width in pixels **
  * @param String  options[loadurl]   URL to fetch input content before editing **
  * @param String  options[loadtype]  Request type for load url. Should be GET or POST.
  * @param String  options[loadtext]  Text to display while loading external content.
  * @param Mixed   options[loaddata]  Extra parameters to pass when fetching content before editing.
  * @param Mixed   options[data]      Or content given as paramameter. String or function.**
  * @param String  options[indicator] indicator html to show when saving
  * @param String  options[tooltip]   optional tooltip text via title attribute **
  * @param String  options[event]     jQuery event such as 'click' of 'dblclick' **
  * @param String  options[submit]    submit button value, empty means no button **
  * @param String  options[cancel]    cancel button value, empty means no button **
  * @param String  options[cssclass]  CSS class to apply to input form. 'inherit' to copy from parent. **
  * @param String  options[style]     Style to apply to input form 'inherit' to copy from parent. **
  * @param String  options[select]    true or false, when true text is highlighted ??
  * @param String  options[placeholder] Placeholder text or html to insert when element is empty. **
  * @param String  options[onblur]    'cancel', 'submit', 'ignore' or function ??
  *             
  * @param Function options[onsubmit] function(settings, original) { ... } called before submit
  * @param Function options[onreset]  function(settings, original) { ... } called before reset
  * @param Function options[onerror]  function(settings, original, xhr) { ... } called on error
  *             
  * @param Hash    options[ajaxoptions]  jQuery Ajax options. See docs.jquery.com.
  *             
  */


(function($) {

    $.fn.editable = function(target, options) {
            
        if ('disable' == target) {
            $(this).data('disabled.editable', true);
            return;
        }
        if ('enable' == target) {
            $(this).data('disabled.editable', false);
            return;
        }
        if ('destroy' == target) {
            $(this)
                .unbind($(this).data('event.editable'))
                .removeData('disabled.editable')
                .removeData('event.editable');
            return;
        }
        
        var settings = $.extend({}, $.fn.editable.defaults, {target:target}, options);
        
        /* setup some functions */
        var plugin   = $.editable.types[settings.type].plugin || function() { };
        var submit   = $.editable.types[settings.type].submit || function() { };
        var buttons  = $.editable.types[settings.type].buttons 
                    || $.editable.types['defaults'].buttons;
        var content  = $.editable.types[settings.type].content 
                    || $.editable.types['defaults'].content;
        var element  = $.editable.types[settings.type].element 
                    || $.editable.types['defaults'].element;
        var reset    = $.editable.types[settings.type].reset 
                    || $.editable.types['defaults'].reset;
        var callback = settings.callback || function() { };
        var onedit   = settings.onedit   || function() { }; 
        var onsubmit = settings.onsubmit || function() { };
        var onreset  = settings.onreset  || function() { };
        var onerror  = settings.onerror  || reset;
          
        /* show tooltip */
        if (settings.tooltip) {
            $(this).attr('title', settings.tooltip);
        }
        
        settings.autowidth  = 'auto' == settings.width;
        settings.autoheight = 'auto' == settings.height;
        
        return this.each(function() {
                        
            /* save this to self because this changes when scope changes */
            var self = this;  
                   
            /* inlined block elements lose their width and height after first edit */
            /* save them for later use as workaround */
            var savedwidth  = $(self).width();
            var savedheight = $(self).height();
            
            /* save so it can be later used by $.editable('destroy') */
            $(this).data('event.editable', settings.event);
            
            /* if element is empty add something clickable (if requested) */
            if (!$.trim($(this).html())) {
                $(this).html(settings.placeholder);
            }
            
            $(this).bind(settings.event, function(e) {
                
                /* abort if disabled for this element */
                if (true === $(this).data('disabled.editable')) {
                    return;
                }
                
                /* prevent throwing an exeption if edit field is clicked again */
                if (self.editing) {
                    return;
                }
                
                /* abort if onedit hook returns false */
                if (false === onedit.apply(this, [settings, self])) {
                   return;
                }
                
                /* prevent default action and bubbling */
                e.preventDefault();
                e.stopPropagation();
                
                /* remove tooltip */
                if (settings.tooltip) {
                    $(self).removeAttr('title');
                }
                
                /* figure out how wide and tall we are, saved width and height */
                /* are workaround for http://dev.jquery.com/ticket/2190 */
                if (0 == $(self).width()) {
                    //$(self).css('visibility', 'hidden');
                    settings.width  = savedwidth;
                    settings.height = savedheight;
                } else {
                    if (settings.width != 'none') {
                        settings.width = 
                            settings.autowidth ? $(self).width()  : settings.width;
                    }
                    if (settings.height != 'none') {
                        settings.height = 
                            settings.autoheight ? $(self).height() : settings.height;
                    }
                }
                //$(this).css('visibility', '');
                
                /* remove placeholder text, replace is here because of IE */
                if ($(this).html().toLowerCase().replace(/(;|")/g, '') == 
                    settings.placeholder.toLowerCase().replace(/(;|")/g, '')) {
                        $(this).html('');
                }
                                
                self.editing    = true;
                self.revert     = $(self).html();
                $(self).html('');

                /* create the form object */
                var form = $('<form />');
                
                /* apply css or style or both */
                if (settings.cssclass) {
                    if ('inherit' == settings.cssclass) {
                        form.attr('class', $(self).attr('class'));
                    } else {
                        form.attr('class', settings.cssclass);
                    }
                }

                if (settings.style) {
                    if ('inherit' == settings.style) {
                        form.attr('style', $(self).attr('style'));
                        /* IE needs the second line or display wont be inherited */
                        form.css('display', $(self).css('display'));                
                    } else {
                        form.attr('style', settings.style);
                    }
                }

                /* add main input element to form and store it in input */
                var input = element.apply(form, [settings, self]);

                /* set input content via POST, GET, given data or existing value */
                var input_content;
                
                if (settings.loadurl) {
                    var t = setTimeout(function() {
                        input.disabled = true;
                        content.apply(form, [settings.loadtext, settings, self]);
                    }, 100);

                    var loaddata = {};
                    loaddata[settings.id] = self.id;
                    if ($.isFunction(settings.loaddata)) {
                        $.extend(loaddata, settings.loaddata.apply(self, [self.revert, settings]));
                    } else {
                        $.extend(loaddata, settings.loaddata);
                    }
                    $.ajax({
                       type : settings.loadtype,
                       url  : settings.loadurl,
                       data : loaddata,
                       async : false,
                       success: function(result) {
                          window.clearTimeout(t);
                          input_content = result;
                          input.disabled = false;
                       }
                    });
                } else if (settings.data) {
                    input_content = settings.data;
                    if ($.isFunction(settings.data)) {
                        input_content = settings.data.apply(self, [self.revert, settings]);
                    }
                } else {
                    input_content = self.revert; 
                }
                content.apply(form, [input_content, settings, self]);

                input.attr('name', settings.name);
        
                /* add buttons to the form */
                buttons.apply(form, [settings, self]);
         
                /* add created form to self */
                $(self).append(form);
         
                /* attach 3rd party plugin if requested */
                plugin.apply(form, [settings, self]);

                /* focus to first visible form element */
                $(':input:visible:enabled:first', form).focus();

                /* highlight input contents when requested */
                if (settings.select) {
                    input.select();
                }
        
                /* discard changes if pressing esc */
                input.keydown(function(e) {
                    if (e.keyCode == 27) {
                        e.preventDefault();
                        //self.reset();
                        reset.apply(form, [settings, self]);
                    }
                });

                /* discard, submit or nothing with changes when clicking outside */
                /* do nothing is usable when navigating with tab */
                var t;
                if ('cancel' == settings.onblur) {
                    input.blur(function(e) {
                        /* prevent canceling if submit was clicked */
                        t = setTimeout(function() {
                            reset.apply(form, [settings, self]);
                        }, 500);
                    });
                } else if ('submit' == settings.onblur) {
                    input.blur(function(e) {
                        /* prevent double submit if submit was clicked */
                        t = setTimeout(function() {
                            form.submit();
                        }, 200);
                    });
                } else if ($.isFunction(settings.onblur)) {
                    input.blur(function(e) {
                        settings.onblur.apply(self, [input.val(), settings]);
                    });
                } else {
                    input.blur(function(e) {
                      /* TODO: maybe something here */
                    });
                }

                form.submit(function(e) {

                    if (t) { 
                        clearTimeout(t);
                    }

                    /* do no submit */
                    e.preventDefault(); 
            
                    /* call before submit hook. */
                    /* if it returns false abort submitting */                    
                    if (false !== onsubmit.apply(form, [settings, self])) { 
                        /* custom inputs call before submit hook. */
                        /* if it returns false abort submitting */
                        if (false !== submit.apply(form, [settings, self])) { 

                          /* check if given target is function */
                          if ($.isFunction(settings.target)) {
                              var str = settings.target.apply(self, [input.val(), settings]);
                              $(self).html(str);
                              self.editing = false;
                              callback.apply(self, [self.innerHTML, settings]);
                              /* TODO: this is not dry */                              
                              if (!$.trim($(self).html())) {
                                  $(self).html(settings.placeholder);
                              }
                          } else {
                              /* add edited content and id of edited element to POST */
                              var submitdata = {};
                              submitdata[settings.name] = input.val();
                              submitdata[settings.id] = self.id;
                              /* add extra data to be POST:ed */
                              if ($.isFunction(settings.submitdata)) {
                                  $.extend(submitdata, settings.submitdata.apply(self, [self.revert, settings]));
                              } else {
                                  $.extend(submitdata, settings.submitdata);
                              }

                              /* quick and dirty PUT support */
                              if ('PUT' == settings.method) {
                                  submitdata['_method'] = 'put';
                              }

                              /* show the saving indicator */
                              $(self).html(settings.indicator);
                              
                              /* defaults for ajaxoptions */
                              var ajaxoptions = {
                                  type    : 'POST',
                                  data    : submitdata,
                                  dataType: 'html',
                                  url     : settings.target,
                                  success : function(result, status) {
                                      if (ajaxoptions.dataType == 'html') {
                                        $(self).html(result);
                                      }
                                      self.editing = false;
                                      callback.apply(self, [result, settings]);
                                      if (!$.trim($(self).html())) {
                                          $(self).html(settings.placeholder);
                                      }
                                  },
                                  error   : function(xhr, status, error) {
                                      onerror.apply(form, [settings, self, xhr]);
                                  }
                              };
                              
                              /* override with what is given in settings.ajaxoptions */
                              $.extend(ajaxoptions, settings.ajaxoptions);   
                              $.ajax(ajaxoptions);          
                              
                            }
                        }
                    }
                    
                    /* show tooltip again */
                    $(self).attr('title', settings.tooltip);
                    
                    return false;
                });
            });
            
            /* privileged methods */
            this.reset = function(form) {
                /* prevent calling reset twice when blurring */
                if (this.editing) {
                    /* before reset hook, if it returns false abort reseting */
                    if (false !== onreset.apply(form, [settings, self])) { 
                        $(self).html(self.revert);
                        self.editing   = false;
                        if (!$.trim($(self).html())) {
                            $(self).html(settings.placeholder);
                        }
                        /* show tooltip again */
                        if (settings.tooltip) {
                            $(self).attr('title', settings.tooltip);                
                        }
                    }                    
                }
            };            
        });

    };


    $.editable = {
        types: {
            defaults: {
                element : function(settings, original) {
                    var input = $('<input type="hidden"></input>');                
                    $(this).append(input);
                    return(input);
                },
                content : function(string, settings, original) {
                    $(':input:first', this).val(string);
                },
                reset : function(settings, original) {
                  original.reset(this);
                },
                buttons : function(settings, original) {
                    var form = this;
                    if (settings.submit) {
                        /* if given html string use that */
                        if (settings.submit.match(/>$/)) {
                            var submit = $(settings.submit).click(function() {
                                if (submit.attr("type") != "submit") {
                                    form.submit();
                                }
                            });
                        /* otherwise use button with given string as text */
                        } else {
                            var submit = $('<button type="submit" />');
                            submit.html(settings.submit);                            
                        }
                        $(this).append(submit);
                    }
                    if (settings.cancel) {
                        /* if given html string use that */
                        if (settings.cancel.match(/>$/)) {
                            var cancel = $(settings.cancel);
                        /* otherwise use button with given string as text */
                        } else {
                            var cancel = $('<button type="cancel" />');
                            cancel.html(settings.cancel);
                        }
                        $(this).append(cancel);

                        $(cancel).click(function(event) {
                            //original.reset();
                            if ($.isFunction($.editable.types[settings.type].reset)) {
                                var reset = $.editable.types[settings.type].reset;                                                                
                            } else {
                                var reset = $.editable.types['defaults'].reset;                                
                            }
                            reset.apply(form, [settings, original]);
                            return false;
                        });
                    }
                }
            },
            text: {
                element : function(settings, original) {
                    var input = $('<input />');
                    if (settings.width  != 'none') { input.width(settings.width);  }
                    if (settings.height != 'none') { input.height(settings.height); }
                    /* https://bugzilla.mozilla.org/show_bug.cgi?id=236791 */
                    //input[0].setAttribute('autocomplete','off');
                    input.attr('autocomplete','off');
                    $(this).append(input);
                    return(input);
                }
            },
            textarea: {
                element : function(settings, original) {
                    var textarea = $('<textarea />');
                    if (settings.rows) {
                        textarea.attr('rows', settings.rows);
                    } else if (settings.height != "none") {
                        textarea.height(settings.height);
                    }
                    if (settings.cols) {
                        textarea.attr('cols', settings.cols);
                    } else if (settings.width != "none") {
                        textarea.width(settings.width);
                    }
                    $(this).append(textarea);
                    return(textarea);
                }
            },
            select: {
               element : function(settings, original) {
                    var select = $('<select />');
                    $(this).append(select);
                    return(select);
                },
                content : function(data, settings, original) {
                    /* If it is string assume it is json. */
                    if (String == data.constructor) {      
                        eval ('var json = ' + data);
                    } else {
                    /* Otherwise assume it is a hash already. */
                        var json = data;
                    }
                    for (var key in json) {
                        if (!json.hasOwnProperty(key)) {
                            continue;
                        }
                        if ('selected' == key) {
                            continue;
                        } 
                        var option = $('<option />').val(key).append(json[key]);
                        $('select', this).append(option);    
                    }                    
                    /* Loop option again to set selected. IE needed this... */ 
                    $('select', this).children().each(function() {
                        if ($(this).val() == json['selected'] || 
                            $(this).text() == $.trim(original.revert)) {
                                $(this).attr('selected', 'selected');
                        }
                    });
                }
            }
        },

        /* Add new input type */
        addInputType: function(name, input) {
            $.editable.types[name] = input;
        }
    };

    // publicly accessible defaults
    $.fn.editable.defaults = {
        name       : 'value',
        id         : 'id',
        type       : 'text',
        width      : 'auto',
        height     : 'auto',
        event      : 'click.editable',
        onblur     : 'cancel',
        loadtype   : 'GET',
        loadtext   : 'Loading...',
        placeholder: 'Click to edit',
        loaddata   : {},
        submitdata : {},
        ajaxoptions: {}
    };

})(jQuery);
/*
 * jQuery Format Plugin v${version}
 * http://www.asual.com/jquery/format/
 *
 * Copyright (c) 2009-2010 Rostislav Hristov
 * Uses code by Matt Kruse
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Date: ${timestamp}
 */

(function ($) {

    $.format = (function () {
        
        var UNDEFINED = 'undefined',
            TRUE = true,
            FALSE = false,
            _locale = {
                date: {
                    format: 'MMM dd, yyyy h:mm:ss a',
                    monthsFull: ['January','February','March','April','May','June','July','August','September','October','November','December'],
                    monthsShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                    daysFull: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
                    daysShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
                    shortDateFormat: 'M/d/yyyy h:mm a',
                    longDateFormat: 'EEEE, MMMM dd, yyyy h:mm:ss a'
                },
                number: {
                    format: '#,##0.0#',
                    groupingSeparator: ',',
                    decimalSeparator: '.'
                }
            };
       
        return {
            
            locale: function(value) {
                a = {a: 6};
                if (value) {
                    for (var p in value) {
                        for (var v in value[p]) {
                            _locale[p][v] = value[p][v];
                        }
                    }
                }
                return _locale;
            },
            
            date: function(value, format) {

                var i = 0,
                    j = 0,
                    l = 0,
                    c = '',
                    token = '',
                    x,
                    y;
                
                if (typeof value == 'string') {
                    
                    var getNumber = function (str, p, minlength, maxlength) {
                        for (var x = maxlength; x >= minlength; x--) {
                            var token = str.substring(p, p + x);
                            if (token.length >= minlength && (new RegExp(/^\d+$/)).test(token)) {
                                return token;
                            }
                        }
                        return null;
                    };
                    
                    if (typeof format == UNDEFINED) {
                        format = _locale.date.format;
                    }
                    
                    var _strict = false,
                        pos = 0,
                        now = new Date(),
                        year = now.getYear(),
                        month = now.getMonth() + 1,
                        date = 1,
                        hh = now.getHours(),
                        mm = now.getMinutes(),
                        ss = now.getSeconds(),
                        SSS = now.getMilliseconds(),
                        ampm = '',
                        monthName,
                        dayName;
                    
                    while (i < format.length) {
                        token = '';
                        c = format.charAt(i);
                        while ((format.charAt(i) == c) && (i < format.length)) {
                            token += format.charAt(i++);
                        }
                        if (token.indexOf('MMMM') > - 1 && token.length > 4) {
                            token = 'MMMM';
                        }
                        if (token.indexOf('EEEE') > - 1 && token.length > 4) {
                            token = 'EEEE';
                        }
                        if (token == 'yyyy' || token == 'yy' || token == 'y') {
                            if (token == 'yyyy') { 
                                x = 4; 
                                y = 4;
                            }
                            if (token == 'yy') {
                                x = 2;
                                y = 2;
                            }
                            if (token == 'y') {
                                x = 2;
                                y = 4;
                            }
                            year = getNumber(value, pos, x, y);
                            if (year === null) {
                                return 0;
                            }
                            pos += year.length;
                            if (year.length == 2) {
                                year = parseInt(year, 10);
                                if (year > 70) {
                                    year = 1900 + year;
                                } else {
                                    year = 2000 + year;
                                }
                            }
                        } else if (token == 'MMMM'){
                            month = 0;
                            for (j = 0, l = _locale.date.monthsFull.length; j < l; j++) {
                                monthName = _locale.date.monthsFull[j];
                                if (value.substring(pos, pos + monthName.length).toLowerCase() == monthName.toLowerCase()) {
                                    month = j + 1;
                                    pos += monthName.length;
                                    break;
                                }
                            }
                            if ((month < 1) || (month > 12)){
                                return 0;
                            }
                        } else if (token == 'MMM'){
                            month = 0;
                            for (j = 0, l = _locale.date.monthsShort.length; j < l; j++) {
                                monthName = _locale.date.monthsShort[j];
                                if (value.substring(pos, pos + monthName.length).toLowerCase() == monthName.toLowerCase()) {
                                    month = j + 1;
                                    pos += monthName.length;
                                    break;
                                }
                            }
                            if ((month < 1) || (month > 12)){
                                return 0;
                            }
                        } else if (token == 'EEEE'){
                            for (j = 0, l = _locale.date.daysFull.length; j < l; j++) {
                                dayName = _locale.date.daysFull[j];
                                if (value.substring(pos, pos + dayName.length).toLowerCase() == dayName.toLowerCase()) {
                                    pos += dayName.length;
                                    break;
                                }
                            }        
                        } else if (token == 'EEE'){
                            for (j = 0, l =_locale.date.daysShort.length; j < l; j++) {
                                dayName = _locale.date.daysShort[j];
                                if (value.substring(pos, pos + dayName.length).toLowerCase() == dayName.toLowerCase()) {
                                    pos += dayName.length;
                                    break;
                                }
                            }
                        } else if (token == 'MM' || token == 'M') {
                            month = getNumber(value, pos, _strict ? token.length : 1, 2);
                            if (month === null || (month < 1) || (month > 12)){
                                return 0;
                            }
                            pos += month.length;
                        } else if (token == 'dd' || token == 'd') {
                            date = getNumber(value, pos, _strict ? token.length : 1, 2);
                            if (date === null || (date < 1) || (date > 31)){
                                return 0;
                            }
                            pos += date.length;
                        } else if (token == 'hh' || token == 'h') {
                            hh = getNumber(value, pos, _strict ? token.length : 1, 2);
                            if (hh === null || (hh < 1) || (hh > 12)) {
                                return 0;
                            }
                            pos += hh.length;
                        } else if (token == 'HH' || token == 'H') {
                            hh = getNumber(value, pos, _strict ? token.length : 1, 2);
                            if(hh === null || (hh < 0) || (hh > 23)){
                                return 0;
                            }
                            pos += hh.length;
                        } else if (token == 'KK' || token == 'K') {
                            hh = getNumber(value, pos, _strict ? token.length : 1, 2);
                            if (hh === null || (hh < 0) || (hh > 11)){
                                return 0;
                            }
                            pos += hh.length;
                        } else if (token == 'kk' || token == 'k') {
                            hh = getNumber(value, pos, _strict ? token.length : 1, 2);
                            if (hh === null || (hh < 1) || (hh > 24)){
                                return 0;
                            }
                            pos += hh.length;
                            hh--;
                        } else if (token == 'mm' || token == 'm') {
                            mm = getNumber(value, pos, _strict ? token.length : 1, 2);
                            if (mm === null || (mm < 0) || ( mm > 59)) {
                                return 0;
                            }
                            pos += mm.length;
                        } else if (token == 'ss' || token == 's') {
                            ss = getNumber(value, pos, _strict ? token.length : 1, 2);
                            if (ss === null || (ss < 0) || (ss > 59)){
                                return 0;
                            }
                            pos += ss.length;
                        } else if (token == 'SSS' || token == 'SS' || token == 'S') {
                            SSS = getNumber(value, pos, _strict ? token.length : 1, 3);
                            if (SSS === null || (SSS < 0) || (SSS > 999)){
                                return 0;
                            }
                            pos += SSS.length;
                        } else if (token == 'a') {
                            var ap = value.substring(pos, pos + 2).toLowerCase();
                            if (ap == 'am') {
                                ampm = 'AM';
                            } else if (ap == 'pm') {
                                ampm = 'PM';
                            } else {
                                return 0;
                            }
                            pos += 2;
                        } else {
                            if (token != value.substring(pos, pos + token.length)) {
                                return 0;
                            } else {
                                pos += token.length;
                            }
                        }
                    }
                    if (pos != value.length) {
                        return 0;
                    }
                    if (month == 2) {
                        if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
                            if (date > 29) { 
                                return 0;
                            }
                        } else {
                            if (date > 28) {
                                return 0; 
                            } 
                        }
                    }
                    if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
                        if (date > 30) {
                            return 0;
                        }
                    }
                    if (hh < 12 && ampm == 'PM') {
                        hh = hh - 0 + 12;
                    } else if (hh > 11 && ampm == 'AM') {
                        hh -= 12;
                    }
                    
                    return (new Date(year, month - 1, date, hh, mm, ss, SSS));                    
                    
                } else {
                    
                    var formatNumber = function (n, s) {
                        if (typeof s == UNDEFINED || s == 2) {
                          return (n >= 0 && n < 10 ? '0' : '') + n;
                        } else {
                            if (n >= 0 && n < 10) {
                               return '00' + n; 
                            }
                            if (n >= 10 && n <100) {
                               return '0' + n;
                            }
                            return n;
                        }
                    };
                    
                    if (typeof format == UNDEFINED) {
                        format = _locale.date.format;
                    }
                    
                    y = value.getYear();
                    if (y < 1000) {
                        y = String(y + 1900);
                    }
                    
                    var M = value.getMonth() + 1,
                        d = value.getDate(),
                        E = value.getDay(),
                        H = value.getHours(),
                        m = value.getMinutes(),
                        s = value.getSeconds(),
                        S = value.getMilliseconds();

                    value = {
                        y: y,
                        yyyy: y,
                        yy: String(y).substring(2, 4),
                        M: M,
                        MM: formatNumber(M),
                        MMM: _locale.date.monthsShort[M-1],
                        MMMM: _locale.date.monthsFull[M-1],
                        d: d,
                        dd: formatNumber(d),
                        EEE: _locale.date.daysShort[E],
                        EEEE: _locale.date.daysFull[E],
                        H: H,
                        HH: formatNumber(H)
                    };
                    
                    if (H === 0) {
                        value.h = 12;
                    } else if (H > 12) {
                        value.h = H - 12;
                    } else {
                        value.h = H;
                    }
                    
                    value.hh = formatNumber(value.h);
                    value.k = H !== 0 ? H : 24;
                    value.kk = formatNumber(value.k);
                    
                    if (H > 11) {
                        value.K = H - 12;
                    } else {
                        value.K = H;
                    }
                    
                    value.KK = formatNumber(value.K);
                    
                    if (H > 11) {
                        value.a = 'PM';
                    } else {
                        value.a = 'AM';
                    }
                    
                    value.m = m;
                    value.mm = formatNumber(m);
                    value.s = s;
                    value.ss = formatNumber(s);
                    value.S = S;
                    value.SS = formatNumber(S);
                    value.SSS = formatNumber(S, 3);
                
                    var result = '';
                        
                    i = 0;
                    c = '';
                    token = '';
                    s = false;
                    
                    while (i < format.length) {
                        token = '';   
                        c = format.charAt(i);
                        if (c == '\'') {
                            i++;
                            if (format.charAt(i) == c) {
                                result = result + c;
                                i++;
                            } else {
                                s = !s;
                            }
                        } else {
                            while (format.charAt(i) == c) {
                                token += format.charAt(i++);
                            }
                            if (token.indexOf('MMMM') != -1 && token.length > 4) {
                                token = 'MMMM';
                            }
                            if (token.indexOf('EEEE') != -1 && token.length > 4) {
                                token = 'EEEE';
                            }
                            if (typeof value[token] != UNDEFINED && !s) {
                                result = result + value[token];
                            } else {
                                result = result + token;
                            }
                        }
                    }
                    return result;                    
                }
            },
            
            number: function(value, format) {

                var groupingSeparator,
                    groupingIndex,
                    decimalSeparator,
                    decimalIndex,
                    roundFactor,
                    i;
                
                if (typeof value == 'string') {
                    
                    groupingSeparator = _locale.number.groupingSeparator;
                    decimalSeparator = _locale.number.decimalSeparator;
                    decimalIndex = value.indexOf(decimalSeparator);
                    
                    roundFactor = 1;
                
                    if (decimalIndex != -1) {
                        roundFactor = Math.pow(10, value.length - decimalIndex - 1);
                    }
                    
                    value = value.replace(new RegExp('[' + groupingSeparator + ']', 'g'), '');
                    value = value.replace(new RegExp('[' + decimalSeparator + ']'), '.');
                    
                    return (parseInt(value*roundFactor, 10))/roundFactor;                    
                    
                } else {
                    
                    if (typeof format == UNDEFINED || format.length < 1) {
                        format = _locale.number.format;
                    }
                    
                    groupingSeparator = ',';
                    groupingIndex = format.lastIndexOf(groupingSeparator);
                    decimalSeparator = '.';
                    decimalIndex = format.indexOf(decimalSeparator);
                    
                    var integer = '',
                        fraction = '',
                        negative = value < 0,
                        minFraction = format.substr(decimalIndex + 1).replace(/#/g, '').length,
                        maxFraction = format.substr(decimalIndex + 1).length,
                        powFraction = 10;
                        
                    value = Math.abs(value);
        
                    if (decimalIndex != -1) {
                        fraction = _locale.number.decimalSeparator;
                        if (maxFraction > 0) {
                            roundFactor = 1000;
                            powFraction = Math.pow(powFraction, maxFraction);
                            var tempRound = Math.round(parseInt(value * powFraction * roundFactor - 
                                        Math.round(value) * powFraction * roundFactor, 10) / roundFactor),
                                tempFraction = String(tempRound < 0 ? Math.round(parseInt(value * powFraction * roundFactor - 
                                        parseInt(value, 10) * powFraction * roundFactor, 10) / roundFactor) : tempRound),
                                parts = value.toString().split('.');
                            if (typeof parts[1] != UNDEFINED) {
                                for (i = 0; i < maxFraction; i++) {
                                    if (parts[1].substr(i, 1) == '0' && i < maxFraction - 1 && (tempFraction.length != maxFraction || tempFraction.substr(0, 1) == '0')) {
                                        tempFraction = '0' + tempFraction;
                                    } else {
                                        break;
                                    }
                                }
                            }
                            for (i = 0; i < (maxFraction - fraction.length); i++) {
                                tempFraction += '0';
                            }
                            var symbol, 
                                formattedFraction = '';
                            for (i = 0; i < tempFraction.length; i++) {
                                symbol = tempFraction.substr(i, 1);
                                if (i >= minFraction && symbol == '0' && /^0*$/.test(tempFraction.substr(i+1))) {
                                    break;
                                }
                                formattedFraction += symbol;
                            }
                            fraction += formattedFraction;
                        }
                        if (fraction == _locale.number.decimalSeparator) {
                            fraction = '';
                        }
                    }
                    
                    if (decimalIndex !== 0) {
                        if (fraction != '') {
                            integer = String(parseInt(Math.round(value * powFraction) / powFraction, 10));
                        } else {
                            integer = String(Math.round(value));
                        }
                        var grouping = _locale.number.groupingSeparator,
                            groupingSize = 0;
                        if (groupingIndex != -1) {
                            if (decimalIndex != -1) {
                                groupingSize = decimalIndex - groupingIndex;
                            } else {
                                groupingSize = format.length - groupingIndex;
                            }
                            groupingSize--;
                        }
                        if (groupingSize > 0) {
                            var count = 0, 
                                formattedInteger = '';
                            i = integer.length;
                            while (i--) {
                                if (count !== 0 && count % groupingSize === 0) {
                                    formattedInteger = grouping + formattedInteger;    
                                }
                                formattedInteger = integer.substr(i, 1) + formattedInteger;
                                count++;
                            }
                            integer = formattedInteger;
                        }
                        var maxInteger;
                        if (decimalIndex != -1) {
                            maxInteger = format.substr(0, decimalIndex).replace(new RegExp('#|' + grouping, 'g'), '').length;
                        } else {
                            maxInteger = format.replace(new RegExp('#|' + grouping, 'g'), '').length;                
                        }
                        var tempInteger = integer.length;
                        for (i = tempInteger; i < maxInteger; i++) {
                            integer = '0' + integer;
                        }                
                    }
                    result = integer + fraction;
                    return (negative ? '-' : '') + result;                    
                }
            }
        };        
    })();
   
}(jQuery));
(function(a){a.tiny=a.tiny||{};a.tiny.scrollbar={options:{axis:"y",wheel:40,scroll:true,lockscroll:true,size:"auto",sizethumb:"auto"}};a.fn.tinyscrollbar=function(d){var c=a.extend({},a.tiny.scrollbar.options,d);this.each(function(){a(this).data("tsb",new b(a(this),c))});return this};a.fn.tinyscrollbar_update=function(c){return a(this).data("tsb").update(c)};function b(q,g){var k=this,t=q,j={obj:a(".viewport",q)},h={obj:a(".overview",q)},d={obj:a(".scrollbar",q)},m={obj:a(".track",d.obj)},p={obj:a(".thumb",d.obj)},l=g.axis==="x",n=l?"left":"top",v=l?"Width":"Height",r=0,y={start:0,now:0},o={},e=("ontouchstart" in document.documentElement)?true:false;function c(){k.update();s();return k}this.update=function(z){j[g.axis]=j.obj[0]["offset"+v];h[g.axis]=h.obj[0]["scroll"+v];h.ratio=j[g.axis]/h[g.axis];d.obj.toggleClass("disable",h.ratio>=1);m[g.axis]=g.size==="auto"?j[g.axis]:g.size;p[g.axis]=Math.min(m[g.axis],Math.max(0,(g.sizethumb==="auto"?(m[g.axis]*h.ratio):g.sizethumb)));d.ratio=g.sizethumb==="auto"?(h[g.axis]/m[g.axis]):(h[g.axis]-j[g.axis])/(m[g.axis]-p[g.axis]);r=(z==="relative"&&h.ratio<=1)?Math.min((h[g.axis]-j[g.axis]),Math.max(0,r)):0;r=(z==="bottom"&&h.ratio<=1)?(h[g.axis]-j[g.axis]):isNaN(parseInt(z,10))?r:parseInt(z,10);w()};function w(){var z=v.toLowerCase();p.obj.css(n,r/d.ratio);h.obj.css(n,-r);o.start=p.obj.offset()[n];d.obj.css(z,m[g.axis]);m.obj.css(z,m[g.axis]);p.obj.css(z,p[g.axis])}function s(){if(!e){p.obj.bind("mousedown",i);m.obj.bind("mouseup",u)}else{j.obj[0].ontouchstart=function(z){if(1===z.touches.length){i(z.touches[0]);z.stopPropagation()}}}if(g.scroll&&window.addEventListener){t[0].addEventListener("DOMMouseScroll",x,false);t[0].addEventListener("mousewheel",x,false)}else{if(g.scroll){t[0].onmousewheel=x}}}function i(A){var z=parseInt(p.obj.css(n),10);o.start=l?A.pageX:A.pageY;y.start=z=="auto"?0:z;if(!e){a(document).bind("mousemove",u);a(document).bind("mouseup",f);p.obj.bind("mouseup",f)}else{document.ontouchmove=function(B){B.preventDefault();u(B.touches[0])};document.ontouchend=f}}function x(B){if(h.ratio<1){var A=B||window.event,z=A.wheelDelta?A.wheelDelta/120:-A.detail/3;r-=z*g.wheel;r=Math.min((h[g.axis]-j[g.axis]),Math.max(0,r));p.obj.css(n,r/d.ratio);h.obj.css(n,-r);if(g.lockscroll||(r!==(h[g.axis]-j[g.axis])&&r!==0)){A=a.event.fix(A);A.preventDefault()}}}function u(z){if(h.ratio<1){if(!e){y.now=Math.min((m[g.axis]-p[g.axis]),Math.max(0,(y.start+((l?z.pageX:z.pageY)-o.start))))}else{y.now=Math.min((m[g.axis]-p[g.axis]),Math.max(0,(y.start+(o.start-(l?z.pageX:z.pageY)))))}r=y.now*d.ratio;h.obj.css(n,-r);p.obj.css(n,y.now)}}function f(){a(document).unbind("mousemove",u);a(document).unbind("mouseup",f);p.obj.unbind("mouseup",f);document.ontouchmove=document.ontouchend=null}return c()}}(jQuery));
/* 
 * flowplayer.js 3.2.6. The Flowplayer API
 * 
 * Copyright 2009-2011 Flowplayer Oy
 * 
 * This file is part of Flowplayer.
 * 
 * Flowplayer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Flowplayer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Flowplayer.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * Date: 2011-02-04 05:45:28 -0500 (Fri, 04 Feb 2011)
 * Revision: 614 
 */

(function(){function g(o){console.log("$f.fireEvent",[].slice.call(o))}function k(q){if(!q||typeof q!="object"){return q}var o=new q.constructor();for(var p in q){if(q.hasOwnProperty(p)){o[p]=k(q[p])}}return o}function m(t,q){if(!t){return}var o,p=0,r=t.length;if(r===undefined){for(o in t){if(q.call(t[o],o,t[o])===false){break}}}else{for(var s=t[0];p<r&&q.call(s,p,s)!==false;s=t[++p]){}}return t}function c(o){return document.getElementById(o)}function i(q,p,o){if(typeof p!="object"){return q}if(q&&p){m(p,function(r,s){if(!o||typeof s!="function"){q[r]=s}})}return q}function n(s){var q=s.indexOf(".");if(q!=-1){var p=s.slice(0,q)||"*";var o=s.slice(q+1,s.length);var r=[];m(document.getElementsByTagName(p),function(){if(this.className&&this.className.indexOf(o)!=-1){r.push(this)}});return r}}function f(o){o=o||window.event;if(o.preventDefault){o.stopPropagation();o.preventDefault()}else{o.returnValue=false;o.cancelBubble=true}return false}function j(q,o,p){q[o]=q[o]||[];q[o].push(p)}function e(){return"_"+(""+Math.random()).slice(2,10)}var h=function(t,r,s){var q=this,p={},u={};q.index=r;if(typeof t=="string"){t={url:t}}i(this,t,true);m(("Begin*,Start,Pause*,Resume*,Seek*,Stop*,Finish*,LastSecond,Update,BufferFull,BufferEmpty,BufferStop").split(","),function(){var v="on"+this;if(v.indexOf("*")!=-1){v=v.slice(0,v.length-1);var w="onBefore"+v.slice(2);q[w]=function(x){j(u,w,x);return q}}q[v]=function(x){j(u,v,x);return q};if(r==-1){if(q[w]){s[w]=q[w]}if(q[v]){s[v]=q[v]}}});i(this,{onCuepoint:function(x,w){if(arguments.length==1){p.embedded=[null,x];return q}if(typeof x=="number"){x=[x]}var v=e();p[v]=[x,w];if(s.isLoaded()){s._api().fp_addCuepoints(x,r,v)}return q},update:function(w){i(q,w);if(s.isLoaded()){s._api().fp_updateClip(w,r)}var v=s.getConfig();var x=(r==-1)?v.clip:v.playlist[r];i(x,w,true)},_fireEvent:function(v,y,w,A){if(v=="onLoad"){m(p,function(B,C){if(C[0]){s._api().fp_addCuepoints(C[0],r,B)}});return false}A=A||q;if(v=="onCuepoint"){var z=p[y];if(z){return z[1].call(s,A,w)}}if(y&&"onBeforeBegin,onMetaData,onStart,onUpdate,onResume".indexOf(v)!=-1){i(A,y);if(y.metaData){if(!A.duration){A.duration=y.metaData.duration}else{A.fullDuration=y.metaData.duration}}}var x=true;m(u[v],function(){x=this.call(s,A,y,w)});return x}});if(t.onCuepoint){var o=t.onCuepoint;q.onCuepoint.apply(q,typeof o=="function"?[o]:o);delete t.onCuepoint}m(t,function(v,w){if(typeof w=="function"){j(u,v,w);delete t[v]}});if(r==-1){s.onCuepoint=this.onCuepoint}};var l=function(p,r,q,t){var o=this,s={},u=false;if(t){i(s,t)}m(r,function(v,w){if(typeof w=="function"){s[v]=w;delete r[v]}});i(this,{animate:function(y,z,x){if(!y){return o}if(typeof z=="function"){x=z;z=500}if(typeof y=="string"){var w=y;y={};y[w]=z;z=500}if(x){var v=e();s[v]=x}if(z===undefined){z=500}r=q._api().fp_animate(p,y,z,v);return o},css:function(w,x){if(x!==undefined){var v={};v[w]=x;w=v}r=q._api().fp_css(p,w);i(o,r);return o},show:function(){this.display="block";q._api().fp_showPlugin(p);return o},hide:function(){this.display="none";q._api().fp_hidePlugin(p);return o},toggle:function(){this.display=q._api().fp_togglePlugin(p);return o},fadeTo:function(y,x,w){if(typeof x=="function"){w=x;x=500}if(w){var v=e();s[v]=w}this.display=q._api().fp_fadeTo(p,y,x,v);this.opacity=y;return o},fadeIn:function(w,v){return o.fadeTo(1,w,v)},fadeOut:function(w,v){return o.fadeTo(0,w,v)},getName:function(){return p},getPlayer:function(){return q},_fireEvent:function(w,v,x){if(w=="onUpdate"){var z=q._api().fp_getPlugin(p);if(!z){return}i(o,z);delete o.methods;if(!u){m(z.methods,function(){var B=""+this;o[B]=function(){var C=[].slice.call(arguments);var D=q._api().fp_invoke(p,B,C);return D==="undefined"||D===undefined?o:D}});u=true}}var A=s[w];if(A){var y=A.apply(o,v);if(w.slice(0,1)=="_"){delete s[w]}return y}return o}})};function b(q,G,t){var w=this,v=null,D=false,u,s,F=[],y={},x={},E,r,p,C,o,A;i(w,{id:function(){return E},isLoaded:function(){return(v!==null&&v.fp_play!==undefined&&!D)},getParent:function(){return q},hide:function(H){if(H){q.style.height="0px"}if(w.isLoaded()){v.style.height="0px"}return w},show:function(){q.style.height=A+"px";if(w.isLoaded()){v.style.height=o+"px"}return w},isHidden:function(){return w.isLoaded()&&parseInt(v.style.height,10)===0},load:function(J){if(!w.isLoaded()&&w._fireEvent("onBeforeLoad")!==false){var H=function(){u=q.innerHTML;if(u&&!flashembed.isSupported(G.version)){q.innerHTML=""}if(J){J.cached=true;j(x,"onLoad",J)}flashembed(q,G,{config:t})};var I=0;m(a,function(){this.unload(function(K){if(++I==a.length){H()}})})}return w},unload:function(J){if(this.isFullscreen()&&/WebKit/i.test(navigator.userAgent)){if(J){J(false)}return w}if(u.replace(/\s/g,"")!==""){if(w._fireEvent("onBeforeUnload")===false){if(J){J(false)}return w}D=true;try{if(v){v.fp_close();w._fireEvent("onUnload")}}catch(H){}var I=function(){v=null;q.innerHTML=u;D=false;if(J){J(true)}};setTimeout(I,50)}else{if(J){J(false)}}return w},getClip:function(H){if(H===undefined){H=C}return F[H]},getCommonClip:function(){return s},getPlaylist:function(){return F},getPlugin:function(H){var J=y[H];if(!J&&w.isLoaded()){var I=w._api().fp_getPlugin(H);if(I){J=new l(H,I,w);y[H]=J}}return J},getScreen:function(){return w.getPlugin("screen")},getControls:function(){return w.getPlugin("controls")._fireEvent("onUpdate")},getLogo:function(){try{return w.getPlugin("logo")._fireEvent("onUpdate")}catch(H){}},getPlay:function(){return w.getPlugin("play")._fireEvent("onUpdate")},getConfig:function(H){return H?k(t):t},getFlashParams:function(){return G},loadPlugin:function(K,J,M,L){if(typeof M=="function"){L=M;M={}}var I=L?e():"_";w._api().fp_loadPlugin(K,J,M,I);var H={};H[I]=L;var N=new l(K,null,w,H);y[K]=N;return N},getState:function(){return w.isLoaded()?v.fp_getState():-1},play:function(I,H){var J=function(){if(I!==undefined){w._api().fp_play(I,H)}else{w._api().fp_play()}};if(w.isLoaded()){J()}else{if(D){setTimeout(function(){w.play(I,H)},50)}else{w.load(function(){J()})}}return w},getVersion:function(){var I="flowplayer.js 3.2.6";if(w.isLoaded()){var H=v.fp_getVersion();H.push(I);return H}return I},_api:function(){if(!w.isLoaded()){throw"Flowplayer "+w.id()+" not loaded when calling an API method"}return v},setClip:function(H){w.setPlaylist([H]);return w},getIndex:function(){return p},_swfHeight:function(){return v.clientHeight}});m(("Click*,Load*,Unload*,Keypress*,Volume*,Mute*,Unmute*,PlaylistReplace,ClipAdd,Fullscreen*,FullscreenExit,Error,MouseOver,MouseOut").split(","),function(){var H="on"+this;if(H.indexOf("*")!=-1){H=H.slice(0,H.length-1);var I="onBefore"+H.slice(2);w[I]=function(J){j(x,I,J);return w}}w[H]=function(J){j(x,H,J);return w}});m(("pause,resume,mute,unmute,stop,toggle,seek,getStatus,getVolume,setVolume,getTime,isPaused,isPlaying,startBuffering,stopBuffering,isFullscreen,toggleFullscreen,reset,close,setPlaylist,addClip,playFeed,setKeyboardShortcutsEnabled,isKeyboardShortcutsEnabled").split(","),function(){var H=this;w[H]=function(J,I){if(!w.isLoaded()){return w}var K=null;if(J!==undefined&&I!==undefined){K=v["fp_"+H](J,I)}else{K=(J===undefined)?v["fp_"+H]():v["fp_"+H](J)}return K==="undefined"||K===undefined?w:K}});w._fireEvent=function(Q){if(typeof Q=="string"){Q=[Q]}var R=Q[0],O=Q[1],M=Q[2],L=Q[3],K=0;if(t.debug){g(Q)}if(!w.isLoaded()&&R=="onLoad"&&O=="player"){v=v||c(r);o=w._swfHeight();m(F,function(){this._fireEvent("onLoad")});m(y,function(S,T){T._fireEvent("onUpdate")});s._fireEvent("onLoad")}if(R=="onLoad"&&O!="player"){return}if(R=="onError"){if(typeof O=="string"||(typeof O=="number"&&typeof M=="number")){O=M;M=L}}if(R=="onContextMenu"){m(t.contextMenu[O],function(S,T){T.call(w)});return}if(R=="onPluginEvent"||R=="onBeforePluginEvent"){var H=O.name||O;var I=y[H];if(I){I._fireEvent("onUpdate",O);return I._fireEvent(M,Q.slice(3))}return}if(R=="onPlaylistReplace"){F=[];var N=0;m(O,function(){F.push(new h(this,N++,w))})}if(R=="onClipAdd"){if(O.isInStream){return}O=new h(O,M,w);F.splice(M,0,O);for(K=M+1;K<F.length;K++){F[K].index++}}var P=true;if(typeof O=="number"&&O<F.length){C=O;var J=F[O];if(J){P=J._fireEvent(R,M,L)}if(!J||P!==false){P=s._fireEvent(R,M,L,J)}}m(x[R],function(){P=this.call(w,O,M);if(this.cached){x[R].splice(K,1)}if(P===false){return false}K++});return P};function B(){if($f(q)){$f(q).getParent().innerHTML="";p=$f(q).getIndex();a[p]=w}else{a.push(w);p=a.length-1}A=parseInt(q.style.height,10)||q.clientHeight;E=q.id||"fp"+e();r=G.id||E+"_api";G.id=r;t.playerId=E;if(typeof t=="string"){t={clip:{url:t}}}if(typeof t.clip=="string"){t.clip={url:t.clip}}t.clip=t.clip||{};if(q.getAttribute("href",2)&&!t.clip.url){t.clip.url=q.getAttribute("href",2)}s=new h(t.clip,-1,w);t.playlist=t.playlist||[t.clip];var I=0;m(t.playlist,function(){var K=this;if(typeof K=="object"&&K.length){K={url:""+K}}m(t.clip,function(L,M){if(M!==undefined&&K[L]===undefined&&typeof M!="function"){K[L]=M}});t.playlist[I]=K;K=new h(K,I,w);F.push(K);I++});m(t,function(K,L){if(typeof L=="function"){if(s[K]){s[K](L)}else{j(x,K,L)}delete t[K]}});m(t.plugins,function(K,L){if(L){y[K]=new l(K,L,w)}});if(!t.plugins||t.plugins.controls===undefined){y.controls=new l("controls",null,w)}y.canvas=new l("canvas",null,w);u=q.innerHTML;function J(L){var K=w.hasiPadSupport&&w.hasiPadSupport();if(/iPad|iPhone|iPod/i.test(navigator.userAgent)&&!/.flv$/i.test(F[0].url)&&!K){return true}if(!w.isLoaded()&&w._fireEvent("onBeforeClick")!==false){w.load()}return f(L)}function H(){if(u.replace(/\s/g,"")!==""){if(q.addEventListener){q.addEventListener("click",J,false)}else{if(q.attachEvent){q.attachEvent("onclick",J)}}}else{if(q.addEventListener){q.addEventListener("click",f,false)}w.load()}}setTimeout(H,0)}if(typeof q=="string"){var z=c(q);if(!z){throw"Flowplayer cannot access element: "+q}q=z;B()}else{B()}}var a=[];function d(o){this.length=o.length;this.each=function(p){m(o,p)};this.size=function(){return o.length}}window.flowplayer=window.$f=function(){var p=null;var o=arguments[0];if(!arguments.length){m(a,function(){if(this.isLoaded()){p=this;return false}});return p||a[0]}if(arguments.length==1){if(typeof o=="number"){return a[o]}else{if(o=="*"){return new d(a)}m(a,function(){if(this.id()==o.id||this.id()==o||this.getParent()==o){p=this;return false}});return p}}if(arguments.length>1){var t=arguments[1],q=(arguments.length==3)?arguments[2]:{};if(typeof t=="string"){t={src:t}}t=i({bgcolor:"#000000",version:[9,0],expressInstall:"http://static.flowplayer.org/swf/expressinstall.swf",cachebusting:false},t);if(typeof o=="string"){if(o.indexOf(".")!=-1){var s=[];m(n(o),function(){s.push(new b(this,k(t),k(q)))});return new d(s)}else{var r=c(o);return new b(r!==null?r:o,t,q)}}else{if(o){return new b(o,t,q)}}}return null};i(window.$f,{fireEvent:function(){var o=[].slice.call(arguments);var q=$f(o[0]);return q?q._fireEvent(o.slice(1)):null},addPlugin:function(o,p){b.prototype[o]=p;return $f},each:m,extend:i});if(typeof jQuery=="function"){jQuery.fn.flowplayer=function(q,p){if(!arguments.length||typeof arguments[0]=="number"){var o=[];this.each(function(){var r=$f(this);if(r){o.push(r)}});return arguments.length?o[arguments[0]]:new d(o)}return this.each(function(){$f(this,k(q),p?k(p):{})})}}})();(function(){var e=typeof jQuery=="function";var i={width:"100%",height:"100%",allowfullscreen:true,allowscriptaccess:"always",quality:"high",version:null,onFail:null,expressInstall:null,w3c:false,cachebusting:false};if(e){jQuery.tools=jQuery.tools||{};jQuery.tools.flashembed={version:"1.0.4",conf:i}}function j(){if(c.done){return false}var l=document;if(l&&l.getElementsByTagName&&l.getElementById&&l.body){clearInterval(c.timer);c.timer=null;for(var k=0;k<c.ready.length;k++){c.ready[k].call()}c.ready=null;c.done=true}}var c=e?jQuery:function(k){if(c.done){return k()}if(c.timer){c.ready.push(k)}else{c.ready=[k];c.timer=setInterval(j,13)}};function f(l,k){if(k){for(key in k){if(k.hasOwnProperty(key)){l[key]=k[key]}}}return l}function g(k){switch(h(k)){case"string":k=k.replace(new RegExp('(["\\\\])',"g"),"\\$1");k=k.replace(/^\s?(\d+)%/,"$1pct");return'"'+k+'"';case"array":return"["+b(k,function(n){return g(n)}).join(",")+"]";case"function":return'"function()"';case"object":var l=[];for(var m in k){if(k.hasOwnProperty(m)){l.push('"'+m+'":'+g(k[m]))}}return"{"+l.join(",")+"}"}return String(k).replace(/\s/g," ").replace(/\'/g,'"')}function h(l){if(l===null||l===undefined){return false}var k=typeof l;return(k=="object"&&l.push)?"array":k}if(window.attachEvent){window.attachEvent("onbeforeunload",function(){__flash_unloadHandler=function(){};__flash_savedUnloadHandler=function(){}})}function b(k,n){var m=[];for(var l in k){if(k.hasOwnProperty(l)){m[l]=n(k[l])}}return m}function a(r,t){var q=f({},r);var s=document.all;var n='<object width="'+q.width+'" height="'+q.height+'"';if(s&&!q.id){q.id="_"+(""+Math.random()).substring(9)}if(q.id){n+=' id="'+q.id+'"'}if(q.cachebusting){q.src+=((q.src.indexOf("?")!=-1?"&":"?")+Math.random())}if(q.w3c||!s){n+=' data="'+q.src+'" type="application/x-shockwave-flash"'}else{n+=' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'}n+=">";if(q.w3c||s){n+='<param name="movie" value="'+q.src+'" />'}q.width=q.height=q.id=q.w3c=q.src=null;for(var l in q){if(q[l]!==null){n+='<param name="'+l+'" value="'+q[l]+'" />'}}var o="";if(t){for(var m in t){if(t[m]!==null){o+=m+"="+(typeof t[m]=="object"?g(t[m]):t[m])+"&"}}o=o.substring(0,o.length-1);n+='<param name="flashvars" value=\''+o+"' />"}n+="</object>";return n}function d(m,p,l){var k=flashembed.getVersion();f(this,{getContainer:function(){return m},getConf:function(){return p},getVersion:function(){return k},getFlashvars:function(){return l},getApi:function(){return m.firstChild},getHTML:function(){return a(p,l)}});var q=p.version;var r=p.expressInstall;var o=!q||flashembed.isSupported(q);if(o){p.onFail=p.version=p.expressInstall=null;m.innerHTML=a(p,l)}else{if(q&&r&&flashembed.isSupported([6,65])){f(p,{src:r});l={MMredirectURL:location.href,MMplayerType:"PlugIn",MMdoctitle:document.title};m.innerHTML=a(p,l)}else{if(m.innerHTML.replace(/\s/g,"")!==""){}else{m.innerHTML="<h2>Flash version "+q+" or greater is required</h2><h3>"+(k[0]>0?"Your version is "+k:"You have no flash plugin installed")+"</h3>"+(m.tagName=="A"?"<p>Click here to download latest version</p>":"<p>Download latest version from <a href='http://www.adobe.com/go/getflashplayer'>here</a></p>");if(m.tagName=="A"){m.onclick=function(){location.href="http://www.adobe.com/go/getflashplayer"}}}}}if(!o&&p.onFail){var n=p.onFail.call(this);if(typeof n=="string"){m.innerHTML=n}}if(document.all){window[p.id]=document.getElementById(p.id)}}window.flashembed=function(l,m,k){if(typeof l=="string"){var n=document.getElementById(l);if(n){l=n}else{c(function(){flashembed(l,m,k)});return}}if(!l){return}if(typeof m=="string"){m={src:m}}var o=f({},i);f(o,m);return new d(l,o,k)};f(window.flashembed,{getVersion:function(){var m=[0,0];if(navigator.plugins&&typeof navigator.plugins["Shockwave Flash"]=="object"){var l=navigator.plugins["Shockwave Flash"].description;if(typeof l!="undefined"){l=l.replace(/^.*\s+(\S+\s+\S+$)/,"$1");var n=parseInt(l.replace(/^(.*)\..*$/,"$1"),10);var r=/r/.test(l)?parseInt(l.replace(/^.*r(.*)$/,"$1"),10):0;m=[n,r]}}else{if(window.ActiveXObject){try{var p=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7")}catch(q){try{p=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");m=[6,0];p.AllowScriptAccess="always"}catch(k){if(m[0]==6){return m}}try{p=new ActiveXObject("ShockwaveFlash.ShockwaveFlash")}catch(o){}}if(typeof p=="object"){l=p.GetVariable("$version");if(typeof l!="undefined"){l=l.replace(/^\S+\s+(.*)$/,"$1").split(",");m=[parseInt(l[0],10),parseInt(l[2],10)]}}}}return m},isSupported:function(k){var m=flashembed.getVersion();var l=(m[0]>k[0])||(m[0]==k[0]&&m[1]>=k[1]);return l},domReady:c,asString:g,getHTML:a});if(e){jQuery.fn.flashembed=function(l,k){var m=null;this.each(function(){m=flashembed(this,l,k)});return l.api===false?this:m}}})();
// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//


jQuery.ajaxSetup({
  'beforeSend': function(xhr) {
    $('#ajax-spinner').show();
    // xhr.setRequestHeader("Accept", "text/javascript");
  },
  'complete': function(xhr, textstatus){
    $('#ajax-spinner').hide();
  }
});

function remove_meal_or_exercise_item(link){
  $(link).prev("input[type=hidden]").val("1");
  $(link).closest("tr").fadeOut();
}

function preloadImages(images){
  if (images.length > 0) {
    jQuery("<img>").attr("src", images.splice(0,1)).load(function() {
      preloadImages(images);
    });
  }
}

// Global OnReady callbacks
$(document).ready(function() {

  // Form Error fields onFocus, blank out, remove error styling
  $(".fieldError").live('focus', function(){
    // If a form field has a error we still want to show help messages
    if($(this).hasClass('fieldError')){
      if( $(this).is('input') ){ 
        $(this).val('');
      }
      $(this).removeClass('fieldError');
    }
  });
  
  // All links with class 'submit', submit their parent form
  $('a.submit').live('click', function(evt){
    evt.preventDefault();
    $(this).closest('form').submit();
  });
  
  $('input[type=text]').labelify({labelledClass: "label-highlight"});
  
});
