// jQuery JavaScript Library v2.0.3
// Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
var class2Type = {
	'[object Boolean]': 'boolean',
	'[object Number]': 'number',
	'[object String]': 'string',
	'[object Function]': 'function',
	'[object Array]': 'array',
	'[object Date]': 'date',
	'[object RegExp]': 'regexp',
	'[object Object]': 'object',
	'[object Error]': 'error'
};

var coreToString = class2Type.toString;
var coreHasOwn = class2Type.hasOwnProperty;

function isFunction(obj) {
	return getType(obj) === 'function';
}

function isWindow(obj) {
	return obj != null && obj === obj.window;
}

function getType(obj) {
	if (obj == null) {
		return String(obj);
	}
	return typeof obj === 'object' || typeof obj === 'function' ?
		class2Type[coreToString.call(obj)] || 'object' :
		typeof obj;
}

function isPlainObject(obj) {
	if (getType(obj) !== 'object' || obj.nodeType || isWindow(obj)) {
		return false;
	}

	try {
		if (obj.constructor &&
        !coreHasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
			return false;
		}
	} catch (e) {
		return false;
	}

	return true;
}

function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0] || {};
	var i = 1;
	var deep = false;
	var length = arguments.length;

	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		i = 2;
	}

	if (typeof target !== 'object' && !isFunction(target)) {
		target = {};
	}

	if (length === i) {
		target = this;
		--i;
	}

	for (; i < length; i++) {
		if ((options = arguments[i]) != null) {
			for (name in options) {
				src = target[name];
				copy = options[name];

				if (target === copy) {
					continue;
				}

				if (deep && copy &&
            (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];

					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					target[name] = extend(deep, clone, copy);

				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	return target;
}
