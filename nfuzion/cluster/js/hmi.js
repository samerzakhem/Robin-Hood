(function () { "use strict";
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var nfuzion = {}
nfuzion.application = {}
nfuzion.application.Application = function(name) {
	if(name == null) throw "Application name cannot be null.";
	if(nfuzion.application.Application.appName != null) throw "Cannot create more than one instance of Application.";
	nfuzion.application.Application.appName = name;
	haxe.Log.trace("Starting " + name + ".",{ fileName : "Application.hx", lineNumber : 53, className : "nfuzion.application.Application", methodName : "new"});
	haxe.Log.trace("Built: " + "2013-12-06 15:50:29",{ fileName : "Application.hx", lineNumber : 54, className : "nfuzion.application.Application", methodName : "new"});
};
$hxClasses["nfuzion.application.Application"] = nfuzion.application.Application;
nfuzion.application.Application.__name__ = ["nfuzion","application","Application"];
nfuzion.application.Application.destroy = function() {
	nfuzion.application.Application.appName = null;
	nfuzion.application.Application.done = true;
}
nfuzion.application.Application.exit = function() {
}
nfuzion.application.Application.doExit = function(data) {
	nfuzion.application.Application.done = true;
}
nfuzion.application.Application.prototype = {
	run: function() {
	}
	,__class__: nfuzion.application.Application
}
nfuzion.nTactic = {}
nfuzion.nTactic.NTactic = function(name) {
	nfuzion.application.Application.call(this,name);
	this.ready = false;
	nfuzion.nTactic.NTactic.layers = new nfuzion.nTactic.core.AppView();
	nfuzion.nTactic.NTactic.fontManager = new nfuzion.font.FontManager();
	nfuzion.nTactic.NTactic.paintManager = new nfuzion.paint.PaintManager();
	nfuzion.nTactic.NTactic.imageManager = new nfuzion.image.ImageManager();
	nfuzion.nTactic.NTactic.storage = (function($this) {
		var $r;
		if(nfuzion.storage.PersistentStorage.instance == null) nfuzion.storage.PersistentStorage.instance = new nfuzion.storage.PersistentStorage();
		$r = nfuzion.storage.PersistentStorage.instance;
		return $r;
	}(this));
	nfuzion.nTactic.NTactic.cache = new nfuzion.nTactic.core.ScreenCache();
	nfuzion.nTactic.NTactic.cacheManager = new nfuzion.nTactic.core.CacheManager();
	nfuzion.nTactic.NTactic.builder = new nfuzion.builder.Builder();
	nfuzion.nTactic.NTactic.builder.addEventListener("sketch",$bind(this,this.onReady));
	nfuzion.nTactic.NTactic.storage.addEventListener("StorageEvent.ready",$bind(this,this.onReady));
	this.onReady();
};
$hxClasses["nfuzion.nTactic.NTactic"] = nfuzion.nTactic.NTactic;
nfuzion.nTactic.NTactic.__name__ = ["nfuzion","nTactic","NTactic"];
nfuzion.nTactic.NTactic["goto"] = function(branch,vars,addToHistory) {
	if(addToHistory == null) addToHistory = true;
	var array = branch.split(":");
	if(array.length > 1) {
		var screenModel = nfuzion.nTactic.NTactic.screens.getModel(array.shift());
		if(screenModel != null) screenModel["goto"](array.join("/"),vars,addToHistory); else haxe.Log.trace("ERROR: Failed to go to branch on screen model.",{ fileName : "NTactic.hx", lineNumber : 85, className : "nfuzion.nTactic.NTactic", methodName : "goto"});
	} else nfuzion.nTactic.NTactic.screens.defaultModel["goto"](branch);
}
nfuzion.nTactic.NTactic.cacheScreens = function(model,screensToCache) {
	var screenModel = nfuzion.nTactic.NTactic.screens.getModel(model);
	if(screenModel != null) screenModel.cacheScreens(screensToCache); else haxe.Log.trace("ERROR: Failed to cache screen(s). Screen model does not exist",{ fileName : "NTactic.hx", lineNumber : 108, className : "nfuzion.nTactic.NTactic", methodName : "cacheScreens"});
}
nfuzion.nTactic.NTactic.releaseScreens = function(model,screensToRelease) {
	var screenModel = nfuzion.nTactic.NTactic.screens.getModel(model);
	if(screenModel != null) screenModel.releaseScreens(screensToRelease); else haxe.Log.trace("ERROR: Failed to cache screen(s). Screen model does not exist",{ fileName : "NTactic.hx", lineNumber : 123, className : "nfuzion.nTactic.NTactic", methodName : "releaseScreens"});
}
nfuzion.nTactic.NTactic.back = function() {
	nfuzion.nTactic.NTactic.screens.defaultModel.back();
}
nfuzion.nTactic.NTactic.__super__ = nfuzion.application.Application;
nfuzion.nTactic.NTactic.prototype = $extend(nfuzion.application.Application.prototype,{
	start: function() {
		nfuzion.nTactic.NTactic.screens.loadInitialScreens();
	}
	,onReady: function(e) {
		if(this.get_ready()) {
			if(nfuzion.nTactic.NTactic.cacheManager == null) nfuzion.nTactic.NTactic.cacheManager = new nfuzion.nTactic.core.CacheManager();
			nfuzion.nTactic.NTactic.builder.removeEventListener("sketch",$bind(this,this.onReady));
			nfuzion.nTactic.NTactic.storage.removeEventListener("StorageEvent.ready",$bind(this,this.onReady));
			this.start();
		}
	}
	,get_ready: function() {
		return nfuzion.nTactic.NTactic.builder.sketch != null && nfuzion.nTactic.NTactic.builder.sketch.ready && nfuzion.nTactic.NTactic.screens != null && nfuzion.nTactic.NTactic.storage.ready;
	}
	,ready: null
	,onNTacticXmlReady: function(e) {
		this.loader.removeEventListener("LoaderEvent.ready",$bind(this,this.onNTacticXmlReady));
		var xml = Xml.parse(this.loader.data);
		nfuzion.nTactic.NTactic.configurationXml = xml.firstElement();
		if(nfuzion.nTactic.NTactic.configurationXml == null) {
			haxe.Log.trace("FATAL: 'ntactic.xml' data is null!",{ fileName : "NTactic.hx", lineNumber : 183, className : "nfuzion.nTactic.NTactic", methodName : "onNTacticXmlReady"});
			return;
		}
		var viewportXml = nfuzion.nTactic.NTactic.configurationXml.elementsNamed("viewport").next();
		if(viewportXml != null) {
			var width = 800;
			var height = 600;
			var paint = null;
			var widthString = viewportXml.get("width");
			if(widthString == null) haxe.Log.trace("FATAL: Viewport width is not specified in 'ntactic.xml'.",{ fileName : "NTactic.hx", lineNumber : 197, className : "nfuzion.nTactic.NTactic", methodName : "onNTacticXmlReady"}); else width = Std.parseInt(widthString);
			var heightString = viewportXml.get("height");
			if(heightString == null) haxe.Log.trace("FATAL: Viewport height is not specified in 'ntactic.xml'.",{ fileName : "NTactic.hx", lineNumber : 206, className : "nfuzion.nTactic.NTactic", methodName : "onNTacticXmlReady"}); else height = Std.parseInt(heightString);
			var colorString = viewportXml.get("color");
			if(colorString != null) paint = new nfuzion.paint.Paint("viewport",nfuzion.utility.ColorTools.fromString(colorString)); else paint = new nfuzion.paint.Paint("viewport",nfuzion.type.Color.black);
			nfuzion.nTactic.NTactic.stage = new nfuzion.graphics.Stage(width,height,paint);
		} else haxe.Log.trace("FATAL: Viewport not specified in 'ntactic.xml'.",{ fileName : "NTactic.hx", lineNumber : 225, className : "nfuzion.nTactic.NTactic", methodName : "onNTacticXmlReady"});
		nfuzion.nTactic.NTactic.screens = new nfuzion.nTactic.core.AppModel();
		this.onReady();
	}
	,assignCacheManager: function(cacheManager) {
		if(cacheManager == null) {
			haxe.Log.trace("WARNING: Intercepted attempt to set property 'cacheManager' to null.",{ fileName : "NTactic.hx", lineNumber : 166, className : "nfuzion.nTactic.NTactic", methodName : "assignCacheManager"});
			return;
		}
		if(nfuzion.nTactic.NTactic.cacheManager != null) throw "Property 'cacheManager' has already been assigned!";
		nfuzion.nTactic.NTactic.cacheManager = cacheManager;
	}
	,assignAssetsPath: function(path) {
		nfuzion.nTactic.NTactic.assetsPath = path;
		this.loader = new nfuzion.loader.TextLoader(path + "ntactic.xml");
		this.loader.addEventListener("LoaderEvent.ready",$bind(this,this.onNTacticXmlReady));
		this.loader.request();
	}
	,loader: null
	,__class__: nfuzion.nTactic.NTactic
	,__properties__: {get_ready:"get_ready"}
});
var Hmi = function() {
	nfuzion.nTactic.NTactic.call(this,"Robin Hood Hmi");
	this.assignAssetsPath("../assets/");
	nfuzion.nTactic.NTactic.builder.set_sketch(new nfuzion.sketch.XmlSketch("assets.xml"));
};
$hxClasses["Hmi"] = Hmi;
Hmi.__name__ = ["Hmi"];
Hmi.__super__ = nfuzion.nTactic.NTactic;
Hmi.prototype = $extend(nfuzion.nTactic.NTactic.prototype,{
	start: function() {
		peripheral.Peripheral.initialize();
		nfuzion.nTactic.NTactic.prototype.start.call(this);
	}
	,__class__: Hmi
});
var HxOverrides = function() { }
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var Lambda = function() { }
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
}
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
}
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Main = function() { }
$hxClasses["Main"] = Main;
Main.__name__ = ["Main"];
Main.main = function() {
	nfuzion.debug.Debug.initialize();
	new Hmi();
}
var IMap = function() { }
$hxClasses["IMap"] = IMap;
IMap.__name__ = ["IMap"];
var Reflect = function() { }
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.deleteField = function(o,field) {
	if(!Reflect.hasField(o,field)) return false;
	delete(o[field]);
	return true;
}
var Std = function() { }
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	addSub: function(s,pos,len) {
		this.b += len == null?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = function() { }
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	return quotes?s.split("\"").join("&quot;").split("'").join("&#039;"):s;
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&quot;").join("\"").split("&#039;").join("'").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { }
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
var TypeTools = function() { }
$hxClasses["TypeTools"] = TypeTools;
TypeTools.__name__ = ["TypeTools"];
var XmlType = $hxClasses["XmlType"] = { __ename__ : ["XmlType"], __constructs__ : [] }
var Xml = function() {
};
$hxClasses["Xml"] = Xml;
Xml.__name__ = ["Xml"];
Xml.parse = function(str) {
	return haxe.xml.Parser.parse(str);
}
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new haxe.ds.StringMap();
	r.set_nodeName(name);
	return r;
}
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.set_nodeValue(data);
	return r;
}
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.set_nodeValue(data);
	return r;
}
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.set_nodeValue(data);
	return r;
}
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.set_nodeValue(data);
	return r;
}
Xml.createProcessingInstruction = function(data) {
	var r = new Xml();
	r.nodeType = Xml.ProcessingInstruction;
	r.set_nodeValue(data);
	return r;
}
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
}
Xml.prototype = {
	addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
	,firstElement: function() {
		if(this._children == null) throw "bad nodetype";
		var cur = 0;
		var l = this._children.length;
		while(cur < l) {
			var n = this._children[cur];
			if(n.nodeType == Xml.Element) return n;
			cur++;
		}
		return null;
	}
	,elementsNamed: function(name) {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				if(n.nodeType == Xml.Element && n._nodeName == name) break;
				k++;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k++;
				if(n.nodeType == Xml.Element && n._nodeName == name) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,elements: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				if(this.x[k].nodeType == Xml.Element) break;
				k += 1;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k += 1;
				if(n.nodeType == Xml.Element) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,set_nodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,set_nodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,get_nodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,_parent: null
	,_children: null
	,_attributes: null
	,_nodeValue: null
	,_nodeName: null
	,nodeType: null
	,__class__: Xml
}
var haxe = {}
haxe.Log = function() { }
$hxClasses["haxe.Log"] = haxe.Log;
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Serializer = function() {
	this.buf = new StringBuf();
	this.cache = new Array();
	this.useCache = haxe.Serializer.USE_CACHE;
	this.useEnumIndex = haxe.Serializer.USE_ENUM_INDEX;
	this.shash = new haxe.ds.StringMap();
	this.scount = 0;
};
$hxClasses["haxe.Serializer"] = haxe.Serializer;
haxe.Serializer.__name__ = ["haxe","Serializer"];
haxe.Serializer.run = function(v) {
	var s = new haxe.Serializer();
	s.serialize(v);
	return s.toString();
}
haxe.Serializer.prototype = {
	serialize: function(v) {
		var _g = Type["typeof"](v);
		var $e = (_g);
		switch( $e[1] ) {
		case 0:
			this.buf.b += "n";
			break;
		case 1:
			if(v == 0) {
				this.buf.b += "z";
				return;
			}
			this.buf.b += "i";
			this.buf.b += Std.string(v);
			break;
		case 2:
			if(Math.isNaN(v)) this.buf.b += "k"; else if(!Math.isFinite(v)) this.buf.b += Std.string(v < 0?"m":"p"); else {
				this.buf.b += "d";
				this.buf.b += Std.string(v);
			}
			break;
		case 3:
			this.buf.b += Std.string(v?"t":"f");
			break;
		case 6:
			var c = $e[2];
			if(c == String) {
				this.serializeString(v);
				return;
			}
			if(this.useCache && this.serializeRef(v)) return;
			switch(c) {
			case Array:
				var ucount = 0;
				this.buf.b += "a";
				var l = v.length;
				var _g1 = 0;
				while(_g1 < l) {
					var i = _g1++;
					if(v[i] == null) ucount++; else {
						if(ucount > 0) {
							if(ucount == 1) this.buf.b += "n"; else {
								this.buf.b += "u";
								this.buf.b += Std.string(ucount);
							}
							ucount = 0;
						}
						this.serialize(v[i]);
					}
				}
				if(ucount > 0) {
					if(ucount == 1) this.buf.b += "n"; else {
						this.buf.b += "u";
						this.buf.b += Std.string(ucount);
					}
				}
				this.buf.b += "h";
				break;
			case List:
				this.buf.b += "l";
				var v1 = v;
				var $it0 = v1.iterator();
				while( $it0.hasNext() ) {
					var i = $it0.next();
					this.serialize(i);
				}
				this.buf.b += "h";
				break;
			case Date:
				var d = v;
				this.buf.b += "v";
				this.buf.b += Std.string(HxOverrides.dateStr(d));
				break;
			case haxe.ds.StringMap:
				this.buf.b += "b";
				var v1 = v;
				var $it1 = v1.keys();
				while( $it1.hasNext() ) {
					var k = $it1.next();
					this.serializeString(k);
					this.serialize(v1.get(k));
				}
				this.buf.b += "h";
				break;
			case haxe.ds.IntMap:
				this.buf.b += "q";
				var v1 = v;
				var $it2 = v1.keys();
				while( $it2.hasNext() ) {
					var k = $it2.next();
					this.buf.b += ":";
					this.buf.b += Std.string(k);
					this.serialize(v1.get(k));
				}
				this.buf.b += "h";
				break;
			case haxe.ds.ObjectMap:
				this.buf.b += "M";
				var v1 = v;
				var $it3 = v1.keys();
				while( $it3.hasNext() ) {
					var k = $it3.next();
					var id = Reflect.field(k,"__id__");
					Reflect.deleteField(k,"__id__");
					this.serialize(k);
					k.__id__ = id;
					this.serialize(v1.h[k.__id__]);
				}
				this.buf.b += "h";
				break;
			case haxe.io.Bytes:
				var v1 = v;
				var i = 0;
				var max = v1.length - 2;
				var charsBuf = new StringBuf();
				var b64 = haxe.Serializer.BASE64;
				while(i < max) {
					var b1 = v1.b[i++];
					var b2 = v1.b[i++];
					var b3 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt((b1 << 4 | b2 >> 4) & 63));
					charsBuf.b += Std.string(b64.charAt((b2 << 2 | b3 >> 6) & 63));
					charsBuf.b += Std.string(b64.charAt(b3 & 63));
				}
				if(i == max) {
					var b1 = v1.b[i++];
					var b2 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt((b1 << 4 | b2 >> 4) & 63));
					charsBuf.b += Std.string(b64.charAt(b2 << 2 & 63));
				} else if(i == max + 1) {
					var b1 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt(b1 << 4 & 63));
				}
				var chars = charsBuf.b;
				this.buf.b += "s";
				this.buf.b += Std.string(chars.length);
				this.buf.b += ":";
				this.buf.b += Std.string(chars);
				break;
			default:
				this.cache.pop();
				if(v.hxSerialize != null) {
					this.buf.b += "C";
					this.serializeString(Type.getClassName(c));
					this.cache.push(v);
					v.hxSerialize(this);
					this.buf.b += "g";
				} else {
					this.buf.b += "c";
					this.serializeString(Type.getClassName(c));
					this.cache.push(v);
					this.serializeFields(v);
				}
			}
			break;
		case 4:
			if(this.useCache && this.serializeRef(v)) return;
			this.buf.b += "o";
			this.serializeFields(v);
			break;
		case 7:
			var e = $e[2];
			if(this.useCache && this.serializeRef(v)) return;
			this.cache.pop();
			this.buf.b += Std.string(this.useEnumIndex?"j":"w");
			this.serializeString(Type.getEnumName(e));
			if(this.useEnumIndex) {
				this.buf.b += ":";
				this.buf.b += Std.string(v[1]);
			} else this.serializeString(v[0]);
			this.buf.b += ":";
			var l = v.length;
			this.buf.b += Std.string(l - 2);
			var _g1 = 2;
			while(_g1 < l) {
				var i = _g1++;
				this.serialize(v[i]);
			}
			this.cache.push(v);
			break;
		case 5:
			throw "Cannot serialize function";
			break;
		default:
			throw "Cannot serialize " + Std.string(v);
		}
	}
	,serializeFields: function(v) {
		var _g = 0, _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.b += "g";
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0, _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += "r";
				this.buf.b += Std.string(i);
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeString: function(s) {
		var x = this.shash.get(s);
		if(x != null) {
			this.buf.b += "R";
			this.buf.b += Std.string(x);
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.b += "y";
		s = StringTools.urlEncode(s);
		this.buf.b += Std.string(s.length);
		this.buf.b += ":";
		this.buf.b += Std.string(s);
	}
	,toString: function() {
		return this.buf.b;
	}
	,useEnumIndex: null
	,useCache: null
	,scount: null
	,shash: null
	,cache: null
	,buf: null
	,__class__: haxe.Serializer
}
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe.Timer;
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
}
haxe.Timer.prototype = {
	run: function() {
		haxe.Log.trace("run",{ fileName : "Timer.hx", lineNumber : 98, className : "haxe.Timer", methodName : "run"});
	}
	,stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,id: null
	,__class__: haxe.Timer
}
haxe.Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = new Array();
	this.cache = new Array();
	var r = haxe.Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe.Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe.Unserializer;
haxe.Unserializer.__name__ = ["haxe","Unserializer"];
haxe.Unserializer.initCodes = function() {
	var codes = new Array();
	var _g1 = 0, _g = haxe.Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe.Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
}
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
}
haxe.Unserializer.prototype = {
	unserialize: function() {
		var _g = this.buf.charCodeAt(this.pos++);
		switch(_g) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			var p1 = this.pos;
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
			}
			return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
		case 121:
			var len = this.readDigits();
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = StringTools.urlDecode(s);
			this.scache.push(s);
			return s;
		case 107:
			return Math.NaN;
		case 109:
			return Math.NEGATIVE_INFINITY;
		case 112:
			return Math.POSITIVE_INFINITY;
		case 97:
			var buf = this.buf;
			var a = new Array();
			this.cache.push(a);
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c == 104) {
					this.pos++;
					break;
				}
				if(c == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n = this.readDigits();
			if(n < 0 || n >= this.cache.length) throw "Invalid reference";
			return this.cache[n];
		case 82:
			var n = this.readDigits();
			if(n < 0 || n >= this.scache.length) throw "Invalid string reference";
			return this.scache[n];
		case 120:
			throw this.unserialize();
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 119:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl)[index];
			if(tag == null) throw "Unknown enum index " + name + "@" + index;
			var e = this.unserializeEnum(edecl,tag);
			this.cache.push(e);
			return e;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new haxe.ds.StringMap();
			this.cache.push(h);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s = this.unserialize();
				h.set(s,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h = new haxe.ds.IntMap();
			this.cache.push(h);
			var buf = this.buf;
			var c = this.buf.charCodeAt(this.pos++);
			while(c == 58) {
				var i = this.readDigits();
				h.set(i,this.unserialize());
				c = this.buf.charCodeAt(this.pos++);
			}
			if(c != 104) throw "Invalid IntMap format";
			return h;
		case 77:
			var h = new haxe.ds.ObjectMap();
			this.cache.push(h);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s = this.unserialize();
				h.set(s,this.unserialize());
			}
			this.pos++;
			return h;
		case 118:
			var d = HxOverrides.strDate(HxOverrides.substr(this.buf,this.pos,19));
			this.cache.push(d);
			this.pos += 19;
			return d;
		case 115:
			var len = this.readDigits();
			var buf = this.buf;
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid bytes length";
			var codes = haxe.Unserializer.CODES;
			if(codes == null) {
				codes = haxe.Unserializer.initCodes();
				haxe.Unserializer.CODES = codes;
			}
			var i = this.pos;
			var rest = len & 3;
			var size = (len >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i + (len - rest);
			var bytes = haxe.io.Bytes.alloc(size);
			var bpos = 0;
			while(i < max) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				var c3 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				var c4 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c3 << 6 | c4) & 255;
			}
			if(rest >= 2) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				if(rest == 3) {
					var c3 = codes[buf.charCodeAt(i++)];
					bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				}
			}
			this.pos += len;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			o.hxUnserialize(this);
			if(this.buf.charCodeAt(this.pos++) != 103) throw "Invalid custom data";
			return o;
		default:
		}
		this.pos--;
		throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.buf.charCodeAt(this.pos++) != 58) throw "Invalid enum format";
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = new Array();
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw "Invalid object";
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!js.Boot.__instanceof(k,String)) throw "Invalid object key";
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_) {
			return null;
		}}; else this.resolver = r;
	}
	,resolver: null
	,scache: null
	,cache: null
	,length: null
	,pos: null
	,buf: null
	,__class__: haxe.Unserializer
}
haxe.crypto = {}
haxe.crypto.BaseCode = function(base) {
	var len = base.length;
	var nbits = 1;
	while(len > 1 << nbits) nbits++;
	if(nbits > 8 || len != 1 << nbits) throw "BaseCode : base length must be a power of two.";
	this.base = base;
	this.nbits = nbits;
};
$hxClasses["haxe.crypto.BaseCode"] = haxe.crypto.BaseCode;
haxe.crypto.BaseCode.__name__ = ["haxe","crypto","BaseCode"];
haxe.crypto.BaseCode.prototype = {
	decodeBytes: function(b) {
		var nbits = this.nbits;
		var base = this.base;
		if(this.tbl == null) this.initTable();
		var tbl = this.tbl;
		var size = b.length * nbits >> 3;
		var out = haxe.io.Bytes.alloc(size);
		var buf = 0;
		var curbits = 0;
		var pin = 0;
		var pout = 0;
		while(pout < size) {
			while(curbits < 8) {
				curbits += nbits;
				buf <<= nbits;
				var i = tbl[b.b[pin++]];
				if(i == -1) throw "BaseCode : invalid encoded char";
				buf |= i;
			}
			curbits -= 8;
			out.b[pout++] = buf >> curbits & 255 & 255;
		}
		return out;
	}
	,initTable: function() {
		var tbl = new Array();
		var _g = 0;
		while(_g < 256) {
			var i = _g++;
			tbl[i] = -1;
		}
		var _g1 = 0, _g = this.base.length;
		while(_g1 < _g) {
			var i = _g1++;
			tbl[this.base.b[i]] = i;
		}
		this.tbl = tbl;
	}
	,encodeBytes: function(b) {
		var nbits = this.nbits;
		var base = this.base;
		var size = b.length * 8 / nbits | 0;
		var out = haxe.io.Bytes.alloc(size + (b.length * 8 % nbits == 0?0:1));
		var buf = 0;
		var curbits = 0;
		var mask = (1 << nbits) - 1;
		var pin = 0;
		var pout = 0;
		while(pout < size) {
			while(curbits < nbits) {
				curbits += 8;
				buf <<= 8;
				buf |= b.b[pin++];
			}
			curbits -= nbits;
			out.b[pout++] = base.b[buf >> curbits & mask] & 255;
		}
		if(curbits > 0) out.b[pout++] = base.b[buf << nbits - curbits & mask] & 255;
		return out;
	}
	,tbl: null
	,nbits: null
	,base: null
	,__class__: haxe.crypto.BaseCode
}
haxe.ds = {}
haxe.ds.IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe.ds.IntMap;
haxe.ds.IntMap.__name__ = ["haxe","ds","IntMap"];
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,h: null
	,__class__: haxe.ds.IntMap
}
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe.ds.ObjectMap;
haxe.ds.ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.prototype = {
	keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,set: function(key,value) {
		var id = key.__id__ != null?key.__id__:key.__id__ = ++haxe.ds.ObjectMap.count;
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,h: null
	,__class__: haxe.ds.ObjectMap
}
haxe.ds.StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: haxe.ds.StringMap
}
haxe.io = {}
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var _g1 = 0, _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.charCodeAt(i);
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
}
haxe.io.Bytes.prototype = {
	toString: function() {
		return this.readString(0,this.length);
	}
	,readString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c2 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,b: null
	,length: null
	,__class__: haxe.io.Bytes
}
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
haxe.xml = {}
haxe.xml.Parser = function() { }
$hxClasses["haxe.xml.Parser"] = haxe.xml.Parser;
haxe.xml.Parser.__name__ = ["haxe","xml","Parser"];
haxe.xml.Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe.xml.Parser.doParse(str,0,doc);
	return doc;
}
haxe.xml.Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	var buf = new StringBuf();
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start));
				buf = new StringBuf();
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			} else if(c == 38) {
				buf.addSub(str,start,p - start);
				state = 18;
				next = 13;
				start = p + 1;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == str.charCodeAt(start)) {
				var val = HxOverrides.substr(str,start + 1,p - start - 1);
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = haxe.xml.Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.get_nodeName()) throw "Expected </" + parent.get_nodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProcessingInstruction(str1));
				state = 1;
			}
			break;
		case 18:
			if(c == 59) {
				var s = HxOverrides.substr(str,start,p - start);
				if(s.charCodeAt(0) == 35) {
					var i = s.charCodeAt(1) == 120?Std.parseInt("0" + HxOverrides.substr(s,1,s.length - 1)):Std.parseInt(HxOverrides.substr(s,1,s.length - 1));
					buf.b += Std.string(String.fromCharCode(i));
				} else if(!haxe.xml.Parser.escapes.exists(s)) buf.b += Std.string("&" + s + ";"); else buf.b += Std.string(haxe.xml.Parser.escapes.get(s));
				start = p + 1;
				state = next;
			}
			break;
		}
		c = str.charCodeAt(++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
}
var js = {}
js.Boot = function() { }
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0, _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Browser = function() { }
$hxClasses["js.Browser"] = js.Browser;
js.Browser.__name__ = ["js","Browser"];
nfuzion.application.ApplicationMessage = function(handler,data) {
	this.handler = handler;
	this.data = data;
};
$hxClasses["nfuzion.application.ApplicationMessage"] = nfuzion.application.ApplicationMessage;
nfuzion.application.ApplicationMessage.__name__ = ["nfuzion","application","ApplicationMessage"];
nfuzion.application.ApplicationMessage.prototype = {
	data: null
	,handler: null
	,__class__: nfuzion.application.ApplicationMessage
}
nfuzion.application.ApplicationTool = function() { }
$hxClasses["nfuzion.application.ApplicationTool"] = nfuzion.application.ApplicationTool;
nfuzion.application.ApplicationTool.__name__ = ["nfuzion","application","ApplicationTool"];
nfuzion.event = {}
nfuzion.event.IEventDispatcher = function() { }
$hxClasses["nfuzion.event.IEventDispatcher"] = nfuzion.event.IEventDispatcher;
nfuzion.event.IEventDispatcher.__name__ = ["nfuzion","event","IEventDispatcher"];
nfuzion.event.IEventDispatcher.prototype = {
	dispatchEvent: null
	,hasEventListener: null
	,removeEventListener: null
	,addEventListener: null
	,__class__: nfuzion.event.IEventDispatcher
}
nfuzion.event.EventDispatcher = function() {
	this.eventTypes = null;
};
$hxClasses["nfuzion.event.EventDispatcher"] = nfuzion.event.EventDispatcher;
nfuzion.event.EventDispatcher.__name__ = ["nfuzion","event","EventDispatcher"];
nfuzion.event.EventDispatcher.__interfaces__ = [nfuzion.event.IEventDispatcher];
nfuzion.event.EventDispatcher.prototype = {
	getFunctionIndex: function(listeners,listener) {
		var _g1 = 0, _g = listeners.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(Reflect.compareMethods(listeners[i],listener)) return i;
		}
		return -1;
	}
	,dispatchEvent: function(e) {
		if(this.eventTypes == null) return;
		if(this.eventTypes.exists(e.type)) {
			var listeners = this.eventTypes.get(e.type);
			var _g = 0, _g1 = listeners.slice();
			while(_g < _g1.length) {
				var listener = _g1[_g];
				++_g;
				listener(e);
				if(e.stopNow) break;
			}
		}
	}
	,hasEventListener: function(type) {
		if(this.eventTypes == null) return false;
		if(this.eventTypes.exists(type)) {
			var listeners = this.eventTypes.get(type);
			if(listeners.length > 0) return true;
		}
		return false;
	}
	,removeEventListener: function(type,listener,priority) {
		if(priority == null) priority = 0;
		if(this.eventTypes == null) return;
		if(this.eventTypes.exists(type)) {
			var listeners = this.eventTypes.get(type);
			var index = this.getFunctionIndex(listeners,listener);
			if(index >= 0) listeners.splice(index,1);
		}
	}
	,addEventListener: function(type,listener,priority) {
		if(priority == null) priority = 0;
		if(this.eventTypes == null) this.eventTypes = new haxe.ds.StringMap();
		if(!this.eventTypes.exists(type)) this.eventTypes.set(type,new Array());
		var listeners = this.eventTypes.get(type);
		var index = this.getFunctionIndex(listeners,listener);
		if(index < 0) {
			if(!this.invertDefaultPriority) listeners.push(listener); else listeners.unshift(listener);
		}
	}
	,invertDefaultPriority: null
	,eventTypes: null
	,__class__: nfuzion.event.EventDispatcher
}
nfuzion.builder = {}
nfuzion.builder.Builder = function() {
	nfuzion.event.EventDispatcher.call(this);
	this.set_sketch(null);
};
$hxClasses["nfuzion.builder.Builder"] = nfuzion.builder.Builder;
nfuzion.builder.Builder.__name__ = ["nfuzion","builder","Builder"];
nfuzion.builder.Builder.__super__ = nfuzion.event.EventDispatcher;
nfuzion.builder.Builder.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	themeComponent: function(component,sketchComponent,useBox) {
		if(useBox == null) useBox = true;
		if(useBox) component.setSquare(sketchComponent._x,sketchComponent._y,sketchComponent._width,sketchComponent._height);
		component.set_alpha(sketchComponent.alpha);
		component.set_visible(sketchComponent.visible);
		component.set_backgroundPaint(sketchComponent.backgroundPaint);
		component.set_borderPaint(sketchComponent.borderPaint);
		if(sketchComponent.borderWidth != null) component.set_borderWidth(sketchComponent.borderWidth);
		component.set_frames(sketchComponent.frames);
		if(sketchComponent.mask != null) {
			component.set_maskUrl(sketchComponent.mask.url);
			component.maskBox.copyFromBox(sketchComponent.mask);
		} else component.set_maskUrl(null);
	}
	,themeText: function(text,sketchText,useBox) {
		if(useBox == null) useBox = true;
		this.themeComponent(text,sketchText);
		text.set_alignment(sketchText.alignment);
		if(sketchText.text != null && !text.manualText) {
			text.set_text(sketchText.text);
			text.manualText = false;
		}
		text.set_font(sketchText.font);
		if(sketchText.paint != null) text.set_paint(sketchText.paint);
		text.set_wrap(sketchText.wrap);
	}
	,themeChild: function(child,childSketch,useBox) {
		if(useBox == null) useBox = true;
		if(js.Boot.__instanceof(child,nfuzion.graphics.Text)) this.themeText(child,childSketch,useBox); else if(js.Boot.__instanceof(child,nfuzion.graphics.Container)) this.themeContainer(child,childSketch,useBox); else haxe.Log.trace("ERROR: Unknown sketch type '" + Type.getClassName(Type.getClass(child)) + "'.",{ fileName : "Builder.hx", lineNumber : 285, className : "nfuzion.builder.Builder", methodName : "themeChild"});
	}
	,themeChildren: function(foundation,sketchContainer) {
		if(js.Boot.__instanceof(sketchContainer,nfuzion.sketch.type.SketchContainer)) {
			var _g = 0, _g1 = sketchContainer.children;
			while(_g < _g1.length) {
				var childSketch = _g1[_g];
				++_g;
				var child = foundation.getChild(childSketch.name);
				if(child != null) this.themeChild(child,childSketch);
			}
		}
	}
	,themeContainer: function(container,sketchContainer,useBox) {
		if(useBox == null) useBox = true;
		this.themeComponent(container,sketchContainer,useBox);
		var classSketch = null;
		if(sketchContainer.className != null) {
			var className = sketchContainer.className;
			classSketch = this.sketch.getClass(className);
			if(classSketch == null) haxe.Log.trace("ERROR: Class '" + className + "' not found.",{ fileName : "Builder.hx", lineNumber : 230, className : "nfuzion.builder.Builder", methodName : "themeContainer"}); else {
				this.themeComponent(container,classSketch,false);
				container.setSize(classSketch._width,classSketch._height);
				this.themeChildren(container,classSketch);
				container.sketch = classSketch;
			}
		}
		this.themeChildren(container,sketchContainer);
	}
	,theme: function(foundation,sketchComponent) {
		this.themeChild(foundation,sketchComponent,false);
	}
	,buildText: function(foundation,sketchText) {
		var text = new nfuzion.graphics.Text(sketchText.name,sketchText);
		this.themeText(text,sketchText);
		foundation.appendChild(text);
		return text;
	}
	,buildChildren: function(foundation,sketchContainer) {
		var _g = 0, _g1 = sketchContainer.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			var _g2 = Type.getClass(child);
			switch(_g2) {
			case nfuzion.sketch.type.SketchContainer:
				this.buildContainer(foundation,child);
				break;
			case nfuzion.sketch.type.SketchText:
				this.buildText(foundation,child);
				break;
			default:
				haxe.Log.trace("ERROR: Unknown sketch type '" + Type.getClassName(Type.getClass(child)) + "'.",{ fileName : "Builder.hx", lineNumber : 180, className : "nfuzion.builder.Builder", methodName : "buildChildren"});
			}
		}
	}
	,buildContainer: function(foundation,sketchContainer) {
		var container = new nfuzion.graphics.Container(sketchContainer.name,sketchContainer);
		foundation.appendChild(container);
		this.configueComponent(container,sketchContainer);
		var classSketch = null;
		if(sketchContainer.className != null) {
			var className = sketchContainer.className;
			classSketch = this.sketch.getClass(className);
			if(classSketch == null) haxe.Log.trace("ERROR: Class '" + className + "' not found.",{ fileName : "Builder.hx", lineNumber : 141, className : "nfuzion.builder.Builder", methodName : "buildContainer"}); else {
				this.configueComponent(container,classSketch);
				this.buildChildren(container,classSketch);
				container.sketch = classSketch;
			}
		}
		this.buildChildren(container,sketchContainer);
		if(classSketch != null) {
			container.setPosition(sketchContainer._x,sketchContainer._y);
			container.set_borderWidth(classSketch.borderWidth);
			container.set_borderPaint(classSketch.borderPaint);
			container.set_backgroundPaint(classSketch.backgroundPaint);
		}
		return container;
	}
	,configueComponent: function(component,sketchComponent) {
		component.set_guises(sketchComponent.guises);
		this.themeComponent(component,sketchComponent);
		component["goto"](sketchComponent.initialFrameName);
	}
	,buildOver: function(className,container) {
		var classSketch;
		classSketch = this.sketch.getClass(className);
		if(classSketch == null) {
			haxe.Log.trace("ERROR: Class '" + className + "' not found.",{ fileName : "Builder.hx", lineNumber : 101, className : "nfuzion.builder.Builder", methodName : "buildOver"});
			return false;
		}
		this.configueComponent(container,classSketch);
		this.buildChildren(container,classSketch);
		container.sketch = classSketch;
		return true;
	}
	,build: function(className,foundation) {
		var classSketch;
		classSketch = this.sketch.getClass(className);
		if(classSketch == null) {
			haxe.Log.trace("ERROR: Class '" + className + "' not found.",{ fileName : "Builder.hx", lineNumber : 79, className : "nfuzion.builder.Builder", methodName : "build"});
			return false;
		}
		this.buildContainer(foundation,classSketch);
		return true;
	}
	,onSketchReady: function(e) {
		if(this.sketch != null && this.sketch.ready) {
			this.sketch.removeEventListener("BuilderEvent.ready",$bind(this,this.onSketchReady));
			this.dispatchEvent(new nfuzion.builder.event.BuilderEvent("sketch"));
		}
	}
	,set_sketch: function(sketch) {
		if(sketch != this.sketch) {
			this.sketch = sketch;
			if(sketch.ready) this.onSketchReady(); else sketch.addEventListener("BuilderEvent.ready",$bind(this,this.onSketchReady));
		}
		return this.sketch;
	}
	,sketch: null
	,__class__: nfuzion.builder.Builder
	,__properties__: {set_sketch:"set_sketch"}
});
nfuzion.event.Event = function(type) {
	this.type = type;
	this.stop = false;
	this.stopNow = false;
};
$hxClasses["nfuzion.event.Event"] = nfuzion.event.Event;
nfuzion.event.Event.__name__ = ["nfuzion","event","Event"];
nfuzion.event.Event.prototype = {
	stopImmediatePropagation: function() {
		this.stopNow = true;
	}
	,stopPropagation: function() {
		this.stop = true;
	}
	,stopNow: null
	,stop: null
	,type: null
	,__class__: nfuzion.event.Event
}
nfuzion.builder.event = {}
nfuzion.builder.event.BuilderEvent = function(type) {
	nfuzion.event.Event.call(this,type);
};
$hxClasses["nfuzion.builder.event.BuilderEvent"] = nfuzion.builder.event.BuilderEvent;
nfuzion.builder.event.BuilderEvent.__name__ = ["nfuzion","builder","event","BuilderEvent"];
nfuzion.builder.event.BuilderEvent.__super__ = nfuzion.event.Event;
nfuzion.builder.event.BuilderEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	__class__: nfuzion.builder.event.BuilderEvent
});
nfuzion.cache = {}
nfuzion.cache.ListCache = function() {
	this.dataDismisser = null;
	this.dataRequester = null;
	this.bufferSize = 20;
	this.dataAtRangeIndexHint = -1;
	this.requestInProgress = false;
	this.cached = false;
	nfuzion.event.EventDispatcher.call(this);
	this.requestTimer = new nfuzion.timer.Timer(5);
	this.set_listLength(0);
	this.set_listPosition(0);
	this.set_windowSize(1);
	this.ranges = new Array();
	this.requestTimer.addEventListener("timer",$bind(this,this.onRequestTimeout));
};
$hxClasses["nfuzion.cache.ListCache"] = nfuzion.cache.ListCache;
nfuzion.cache.ListCache.__name__ = ["nfuzion","cache","ListCache"];
nfuzion.cache.ListCache.__super__ = nfuzion.event.EventDispatcher;
nfuzion.cache.ListCache.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	dismissDataEntry: function(index) {
		if(this.dataDismisser != null) {
			if(this.getCacheDataAt(index) == null) this.dataDismisser(this.data.entries[index - this.data.offset]);
		}
	}
	,dismissAllData: function() {
		if(this.data != null) {
			if(this.data != null) {
				var _g1 = 0, _g = this.data.entries.length;
				while(_g1 < _g) {
					var i = _g1++;
					this.dismissDataEntry(i);
				}
			}
			this.data.entries = new Array();
		}
	}
	,requestCacheRangeData: function() {
		var _g1 = 0, _g = this.ranges.length;
		while(_g1 < _g) {
			var i = _g1++;
			var range = this.ranges[i];
			if(range.entries.length < range.end - range.start + 1) {
				this.addDataRequest(range.start + range.entries.length,range.end);
				break;
			}
		}
	}
	,addCacheRangeData: function(partialList) {
		if(this.ranges.length > 0) {
			var start = partialList.offset;
			var end = partialList.offset + partialList.entries.length - 1;
			var index = this.findInsertionIndex(start);
			if(index < 0) index++;
			if(index > 0 && this.ranges[index - 1].end >= start) {
				var previousRange = this.ranges[index - 1];
				if(start <= previousRange.start + previousRange.entries.length) index--; else {
					var newEnd = previousRange.end;
					previousRange.end = start - 1;
					this.ranges.splice(index,0,new nfuzion.cache.type.CacheRange(start,newEnd));
				}
			}
			while(index < this.ranges.length && this.ranges[index].start <= end) {
				var range = this.ranges[index];
				var i = start;
				while(i <= end) {
					var nextEntry = range.start + range.entries.length;
					if(i < nextEntry) range.entries[i - range.start] = partialList.entries[i - start]; else if(i == nextEntry) {
						range.entries.push(partialList.entries[i - start]);
						nextEntry++;
						if(nextEntry > range.end) {
							if(index + 1 < this.ranges.length && this.ranges[index + 1].start == nextEntry) {
								var nextRange = this.ranges.splice(index + 1,1)[0];
								range.entries = range.entries.concat(nextRange.entries);
								range.end = nextRange.end;
							} else nextEntry = range.end;
						}
					} else if(index + 1 < this.ranges.length && this.ranges[index + 1].start == i) {
						var nextRange = this.ranges.splice(index + 1,1)[0];
						range.entries = range.entries.concat(nextRange.entries);
						range.end = nextRange.end;
					} else break;
					i++;
				}
				index++;
			}
		}
	}
	,clearCacheRanges: function() {
		this.ranges = new Array();
	}
	,removeCacheRange: function(start,end) {
		if(start <= 0 && end >= this.listLength - 1) {
			if(this.dataDismisser != null) {
				var _g = 0, _g1 = this.ranges;
				while(_g < _g1.length) {
					var range = _g1[_g];
					++_g;
					this.dataDismisser(range.entries);
				}
			}
			this.ranges = new Array();
		} else {
			haxe.Log.trace("WARNING: Cannot remove partial cache range.  Removing all.",{ fileName : "ListCache.hx", lineNumber : 784, className : "nfuzion.cache.ListCache", methodName : "removeCacheRange"});
			this.removeCacheRange(0,this.listLength - 1);
		}
	}
	,addCacheRange: function(start,end) {
		if(end >= this.listLength) end = this.listLength - 1;
		if(start > end) start = end;
		if(start < 0) return;
		var index = this.findInsertionIndex(start);
		if(index == -1) {
			this.ranges.unshift(new nfuzion.cache.type.CacheRange(start,start));
			index++;
		}
		if(index > 0 && this.ranges[index - 1].end >= start) index--;
		var range = this.ranges[index];
		if(range == null || end < range.start) {
			var newRange = new nfuzion.cache.type.CacheRange(start,end);
			this.ranges.splice(index,0,newRange);
		} else while(end >= range.start) {
			if(start < range.start) {
				var newRange = new nfuzion.cache.type.CacheRange(start,range.start - 1);
				this.ranges.splice(index,0,newRange);
				start = range.start;
				index++;
				range = this.ranges[index];
			}
			if(index + 1 >= this.ranges.length) {
				if(range.end + 1 >= start) {
					if(end > range.end) range.end = end;
				} else this.ranges.splice(index + 1,0,new nfuzion.cache.type.CacheRange(start,end));
				break;
			} else {
				var nextRange = this.ranges[index + 1];
				if(end < nextRange.start) {
					if(range.end + 1 >= start) {
						if(end > range.end) range.end = end;
					} else this.ranges.splice(index + 1,0,new nfuzion.cache.type.CacheRange(start,end));
					break;
				} else {
					range.end = nextRange.start - 1;
					start = range.end + 1;
				}
			}
			index++;
			range = this.ranges[index];
		}
		this.requestData();
	}
	,findInsertionIndex: function(start) {
		var _g1 = 0, _g = this.ranges.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.ranges[i].start > start) return i - 1;
		}
		return this.ranges.length;
	}
	,addCacheWindow: function(offset) {
		if(offset + this.windowSize > this.listLength) offset = this.listLength - this.windowSize;
		this.addCacheRange(offset,offset + this.windowSize - 1);
	}
	,getCacheDataAt: function(at) {
		if(this.ranges.length <= 0) {
			this.dataAtRangeIndexHint = -1;
			return null;
		}
		if(this.dataAtRangeIndexHint >= 0 && this.dataAtRangeIndexHint < this.ranges.length) {
			var range = this.ranges[this.dataAtRangeIndexHint];
			if(at >= range.start && at < range.start + range.entries.length) return range.entries[at - range.start];
		}
		var index = this.findInsertionIndex(at);
		if(index >= 0) {
			if(index >= this.ranges.length) index = this.ranges.length - 1;
			var range = this.ranges[index];
			if(at >= range.start && at < range.start + range.entries.length) {
				this.dataAtRangeIndexHint = index;
				return range.entries[at - range.start];
			}
		}
		this.dataAtRangeIndexHint = -1;
		return null;
	}
	,getDataAt: function(index) {
		if(this.data != null && index >= this.data.offset && index < this.data.offset + this.data.entries.length) return this.data.entries[index - this.data.offset];
		return this.getCacheDataAt(index);
	}
	,set_dataDismisser: function(dataDismisser) {
		this.dataDismisser = dataDismisser;
		return dataDismisser;
	}
	,dataDismisser: null
	,set_dataRequester: function(dataRequester) {
		if(!Reflect.compareMethods(this.dataRequester,dataRequester)) {
			this.dataRequester = dataRequester;
			this.invalidateData();
		}
		return dataRequester;
	}
	,dataRequester: null
	,invalidateData: function() {
		this.dismissAllData();
		this.data = null;
		this.dispatchEvent(new nfuzion.cache.event.CacheEvent("CacheEvent.update",0,this.listLength - 1));
		this.requestInProgress = false;
		this.requestData();
	}
	,onRequestTimeout: function(e) {
		haxe.Log.trace("ERROR: No response received for list request after " + this.requestTimer.period + " seconds.",{ fileName : "ListCache.hx", lineNumber : 476, className : "nfuzion.cache.ListCache", methodName : "onRequestTimeout"});
		this.requestTimer.reset();
		this.requestInProgress = false;
		this.requestData();
	}
	,addDataRequest: function(start,end) {
		if(end > this.listLength - 1) end = this.listLength - 1;
		if(start < 0 || end < 0 || end < start) haxe.Log.trace("WARNING: Request for invalid data range!",{ fileName : "ListCache.hx", lineNumber : 461, className : "nfuzion.cache.ListCache", methodName : "addDataRequest"}); else {
			this.requestTimer.start();
			this.requestedStart = start;
			this.requestedEnd = end;
			this.requestInProgress = true;
			this.dataRequester(start,end);
		}
	}
	,requestData: function() {
		if(this.dataRequester != null && !this.requestInProgress && this.listLength > 0) {
			if(this.data == null) {
				if(this.windowSize > 0) {
					var start = this.listPosition;
					var end = this.listPosition + this.windowSize - 1;
					if(end >= this.listLength) end = this.listLength - 1;
					this.dismissAllData();
					this.data = new nfuzion.widget.type.PartialList(start,new Array());
					start = this.fillCacheForward(start,end);
					if(this.data.entries.length > 0) this.dispatchEvent(new nfuzion.cache.event.CacheEvent("CacheEvent.update",0,this.listLength - 1));
					if(start <= end) this.addDataRequest(start,end); else this.requestData();
				}
			} else {
				var dataStart = this.data.offset;
				var dataEnd = dataStart + this.data.entries.length - 1;
				var windowStart = this.listPosition;
				var windowEnd = this.listPosition + this.windowSize - 1;
				var overlapStart = -1;
				if(windowStart <= dataEnd) {
					if(windowStart >= dataStart) overlapStart = windowStart; else if(dataStart <= windowEnd) overlapStart = dataStart;
				}
				var overlapEnd = -1;
				if(windowEnd >= dataStart) {
					if(windowEnd <= dataEnd) overlapEnd = windowEnd; else if(windowStart <= dataEnd) overlapEnd = dataEnd;
				}
				var bufferedEnd = this.listPosition + this.windowSize + this.bufferSize - 1;
				if(bufferedEnd >= this.listLength) bufferedEnd = this.listLength - 1;
				var bufferedStart = this.listPosition - this.bufferSize;
				if(bufferedStart < 0) bufferedStart = 0;
				var overlapSize = 0;
				if(overlapStart >= 0 && overlapEnd >= 0) overlapSize = overlapEnd - overlapStart + 1;
				var windowSize = this.windowSize;
				if(windowSize > this.listLength) windowSize = this.listLength;
				if(this.listPosition < this.listLength && overlapSize < windowSize) {
					var requestStart = this.listPosition;
					if(overlapStart == this.listPosition) requestStart = overlapEnd + 1;
					if(requestStart < this.listLength) {
						var requestEnd = requestStart + (windowSize - overlapSize) - 1;
						if(requestEnd >= this.listLength) requestEnd = this.listLength - 1;
						var newStart = this.fillCacheForward(requestStart,requestEnd);
						if(newStart != requestStart) this.dispatchEvent(new nfuzion.cache.event.CacheEvent("CacheEvent.update",this.data.offset,this.data.offset + this.data.entries.length - 1));
						if(newStart <= requestEnd) this.addDataRequest(requestStart,requestEnd); else this.requestData();
					}
				} else if(dataEnd < bufferedEnd) {
					var start = dataEnd + 1;
					start = this.fillCacheForward(start,bufferedEnd);
					if(start <= bufferedEnd) this.addDataRequest(start,bufferedEnd); else this.requestData();
				} else if(bufferedStart < this.data.offset) {
					this.fillCacheBackward(bufferedStart);
					if(bufferedStart <= this.data.offset) this.addDataRequest(bufferedStart,dataStart - 1); else this.requestData();
				} else this.requestCacheRangeData();
			}
		}
		if(this.requestInProgress && this.cached) {
			this.cached = false;
			this.dispatchEvent(new nfuzion.cache.event.CacheEvent("CacheEvent.caching",this.requestedStart,this.requestedEnd));
		} else if(!this.requestInProgress && !this.cached) {
			this.cached = true;
			this.dispatchEvent(new nfuzion.cache.event.CacheEvent("CacheEvent.cached",0,this.listLength - 1));
		}
	}
	,fillCacheBackward: function(start) {
		while(start <= this.data.offset) {
			var entry = this.getCacheDataAt(this.data.offset - 1);
			if(entry == null) break;
			this.data.entries.unshift(entry);
			this.data.offset--;
		}
	}
	,fillCacheForward: function(start,end) {
		if(end >= this.listLength) end = this.listLength - 1;
		if(start > end) return start;
		do {
			var entry = this.getCacheDataAt(start);
			if(entry == null) break;
			this.data.entries.push(entry);
			start++;
		} while(start <= end);
		return start;
	}
	,addData: function(partialList) {
		var i;
		if(partialList != null) {
			if(this.requestInProgress) {
				var requestedLength = this.requestedEnd - this.requestedStart + 1;
				if(partialList.offset == this.requestedStart && partialList.entries.length == requestedLength) {
					this.requestTimer.reset();
					this.requestInProgress = false;
				}
			}
			if(partialList.offset >= this.listLength) {
				haxe.Log.trace("WARNING: List received out-of-range data.",{ fileName : "ListCache.hx", lineNumber : 180, className : "nfuzion.cache.ListCache", methodName : "addData"});
				return;
			}
			if(partialList.offset >= this.listPosition - 20 && partialList.offset + partialList.entries.length <= this.listPosition + this.windowSize + 20) {
				if(this.data == null || this.data.offset > partialList.offset + partialList.entries.length || partialList.offset > this.data.offset + this.data.entries.length) {
					if(partialList != null) {
						this.dismissAllData();
						this.data = partialList.clone();
					}
				} else {
					i = this.data.offset - 1;
					while(i >= partialList.offset) {
						this.data.entries.unshift(partialList.entries[i - partialList.offset]);
						this.data.offset = i;
						i--;
					}
					i = this.data.offset + this.data.entries.length;
					var mylength;
					mylength = partialList.entries.length;
					while(i < partialList.offset + mylength) {
						if(i >= this.data.offset && i < this.data.offset + this.data.entries.length) this.data.entries[i - this.data.offset] = partialList.entries[i - partialList.offset]; else this.data.entries.push(partialList.entries[i - partialList.offset]);
						i++;
					}
				}
				this.dispatchEvent(new nfuzion.cache.event.CacheEvent("CacheEvent.update",this.data.offset,this.data.offset + this.data.entries.length - 1));
			}
			this.addCacheRangeData(partialList);
		}
		this.requestData();
	}
	,dataEventHandler: function(e) {
		this.addData(e.data);
	}
	,set_listPosition: function(listPosition) {
		if(listPosition < 0) {
			haxe.Log.trace("ERROR: Cannot set list position to less than 0.",{ fileName : "ListCache.hx", lineNumber : 120, className : "nfuzion.cache.ListCache", methodName : "set_listPosition"});
			listPosition = 0;
		}
		if(this.listPosition != listPosition) {
			this.listPosition = listPosition;
			if(this.data != null) {
				if(listPosition < this.data.offset || listPosition >= this.data.offset + this.data.entries.length) {
					this.dismissAllData();
					this.data = null;
				} else {
					while(this.data.offset < listPosition - this.bufferSize) {
						this.dismissDataEntry(this.data.entries.shift());
						this.data.offset++;
					}
					while(this.data.offset + this.data.entries.length > listPosition + this.windowSize + this.bufferSize) this.dismissDataEntry(this.data.entries.pop());
				}
			}
			this.requestData();
		}
		return listPosition;
	}
	,listPosition: null
	,set_listLength: function(listLength) {
		if(listLength < 0) {
			haxe.Log.trace("ERROR: Cannot set list length to less than 0.",{ fileName : "ListCache.hx", lineNumber : 85, className : "nfuzion.cache.ListCache", methodName : "set_listLength"});
			listLength = 0;
		}
		if(this.listLength != listLength) {
			if(listLength < this.listLength) {
				if(this.data.offset + this.data.entries.length >= listLength) {
					var excess = this.data.offset + this.data.entries.length - listLength;
					if(excess > this.data.entries.length) this.data.entries = new Array(); else {
						var _g = 0;
						while(_g < excess) {
							var i = _g++;
							this.data.entries.pop();
						}
					}
				}
				this.removeCacheRange(listLength,this.listLength - 1);
			}
			this.listLength = listLength;
			this.requestData();
		}
		return listLength;
	}
	,listLength: null
	,set_windowSize: function(windowSize) {
		if(windowSize < 1) {
			haxe.Log.trace("ERROR: Cannot set cache window size to less than 1.",{ fileName : "ListCache.hx", lineNumber : 69, className : "nfuzion.cache.ListCache", methodName : "set_windowSize"});
			windowSize = 1;
		}
		if(this.windowSize != windowSize) {
			this.windowSize = windowSize;
			this.requestData();
		}
		return windowSize;
	}
	,windowSize: null
	,set_bufferSize: function(bufferSize) {
		if(bufferSize < 0) bufferSize = 0;
		if(this.bufferSize != bufferSize) {
			this.bufferSize = bufferSize;
			this.requestData();
		}
		return bufferSize;
	}
	,bufferSize: null
	,destroy: function() {
		this.requestTimer.removeEventListener("timer",$bind(this,this.onRequestTimeout));
		this.set_dataRequester(null);
		this.data = null;
	}
	,dataAtRangeIndexHint: null
	,requests: null
	,ranges: null
	,requestedEnd: null
	,requestedStart: null
	,requestTimer: null
	,requestInProgress: null
	,data: null
	,cached: null
	,__class__: nfuzion.cache.ListCache
	,__properties__: {set_bufferSize:"set_bufferSize",set_windowSize:"set_windowSize",set_listLength:"set_listLength",set_listPosition:"set_listPosition",set_dataRequester:"set_dataRequester",set_dataDismisser:"set_dataDismisser"}
});
nfuzion.cache.event = {}
nfuzion.cache.event.CacheEvent = function(type,start,end) {
	nfuzion.event.Event.call(this,type);
	this.start = start;
	this.end = end;
};
$hxClasses["nfuzion.cache.event.CacheEvent"] = nfuzion.cache.event.CacheEvent;
nfuzion.cache.event.CacheEvent.__name__ = ["nfuzion","cache","event","CacheEvent"];
nfuzion.cache.event.CacheEvent.__super__ = nfuzion.event.Event;
nfuzion.cache.event.CacheEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	end: null
	,start: null
	,__class__: nfuzion.cache.event.CacheEvent
});
nfuzion.cache.type = {}
nfuzion.cache.type.CacheRange = function(start,end) {
	this.entries = new Array();
	this.start = start;
	this.end = end;
};
$hxClasses["nfuzion.cache.type.CacheRange"] = nfuzion.cache.type.CacheRange;
nfuzion.cache.type.CacheRange.__name__ = ["nfuzion","cache","type","CacheRange"];
nfuzion.cache.type.CacheRange.prototype = {
	end: null
	,start: null
	,entries: null
	,__class__: nfuzion.cache.type.CacheRange
}
nfuzion.client = {}
nfuzion.client.IClient = function() { }
$hxClasses["nfuzion.client.IClient"] = nfuzion.client.IClient;
nfuzion.client.IClient.__name__ = ["nfuzion","client","IClient"];
nfuzion.client.IClient.__interfaces__ = [nfuzion.event.IEventDispatcher];
nfuzion.client.IClient.prototype = {
	send: null
	,disconnect: null
	,connect: null
	,connected: null
	,port: null
	,host: null
	,__class__: nfuzion.client.IClient
}
nfuzion.client.Client = function(host,port) {
	nfuzion.event.EventDispatcher.call(this);
	this.host = host;
	this.port = port;
};
$hxClasses["nfuzion.client.Client"] = nfuzion.client.Client;
nfuzion.client.Client.__name__ = ["nfuzion","client","Client"];
nfuzion.client.Client.__interfaces__ = [nfuzion.client.IClient];
nfuzion.client.Client.__super__ = nfuzion.event.EventDispatcher;
nfuzion.client.Client.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	send: function(message) {
		return false;
	}
	,disconnect: function() {
	}
	,connect: function() {
	}
	,port: null
	,host: null
	,connected: null
	,__class__: nfuzion.client.Client
});
nfuzion.client.GhostClient = function() {
	nfuzion.event.EventDispatcher.call(this);
	this.host = "ghost";
	this.port = 0;
	this.connected = true;
	this.set_autoConnect(false);
};
$hxClasses["nfuzion.client.GhostClient"] = nfuzion.client.GhostClient;
nfuzion.client.GhostClient.__name__ = ["nfuzion","client","GhostClient"];
nfuzion.client.GhostClient.__interfaces__ = [nfuzion.client.IClient];
nfuzion.client.GhostClient.__super__ = nfuzion.event.EventDispatcher;
nfuzion.client.GhostClient.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	addMessageListener: function(type,listener) {
	}
	,send: function(data) {
		return false;
	}
	,set_autoConnect: function(autoConnect) {
		return autoConnect;
	}
	,autoConnect: null
	,disconnect: function() {
	}
	,connect: function() {
	}
	,connected: null
	,port: null
	,host: null
	,__class__: nfuzion.client.GhostClient
	,__properties__: {set_autoConnect:"set_autoConnect"}
});
nfuzion.client.WebSocketClient = function(host,port) {
	nfuzion.client.Client.call(this,host,port);
	this.client = null;
	this.connected = false;
	this.connectRequested = false;
	this.closeRequested = false;
	this.txTimer = new nfuzion.timer.Timer(0.05);
};
$hxClasses["nfuzion.client.WebSocketClient"] = nfuzion.client.WebSocketClient;
nfuzion.client.WebSocketClient.__name__ = ["nfuzion","client","WebSocketClient"];
nfuzion.client.WebSocketClient.__super__ = nfuzion.client.Client;
nfuzion.client.WebSocketClient.prototype = $extend(nfuzion.client.Client.prototype,{
	onError: function(message) {
		haxe.Log.trace("ERROR:" + Std.string(message),{ fileName : "WebSocketClient.hx", lineNumber : 191, className : "nfuzion.client.WebSocketClient", methodName : "onError"});
	}
	,onMessage: function(e) {
		if(e.data != null) this.dispatchEvent(new nfuzion.client.event.ClientEvent("ClientEvent.data",this,e.data));
	}
	,onClose: function(message) {
		this.connected = false;
		this.connectRequested = false;
		this.closeRequested = false;
		this.client = null;
		this.dispatchEvent(new nfuzion.client.event.ClientEvent("ClientEvent.disconnect",this));
	}
	,onOpen: function(message) {
		this.connected = true;
		this.connectRequested = false;
		if(this.closeRequested) this.disconnect(); else this.dispatchEvent(new nfuzion.client.event.ClientEvent("ClientEvent.connect",this));
	}
	,onTxTimer: function(e) {
		if(this.client.bufferedAmount <= 0) {
			if(this.txQueue.length > 0) try {
				this.client.send(this.txQueue.shift());
			} catch( e1 ) {
				haxe.Log.trace("ERROR: " + Std.string(e1),{ fileName : "WebSocketClient.hx", lineNumber : 144, className : "nfuzion.client.WebSocketClient", methodName : "onTxTimer"});
				this.disconnect();
			}
			this.txTimer.reset();
		}
	}
	,send: function(data) {
		if(this.client != null) {
			if(this.txQueue.length <= 0) {
				if(this.client.bufferedAmount <= 0) try {
					this.client.send(data);
				} catch( e ) {
					haxe.Log.trace("ERROR: " + Std.string(e),{ fileName : "WebSocketClient.hx", lineNumber : 97, className : "nfuzion.client.WebSocketClient", methodName : "send"});
					this.disconnect();
					return false;
				} else {
					this.txQueue.push(data);
					this.txTimer.start();
				}
			} else this.txQueue.push(data);
			return true;
		}
		return false;
	}
	,disconnect: function() {
		if(this.client != null) {
			if(this.connected) {
				this.txTimer.removeEventListener("timer",$bind(this,this.onTxTimer));
				this.connected = false;
				this.client.close();
			} else this.closeRequested = true;
		}
	}
	,connect: function() {
		if(!this.connectRequested) {
			if(this.client != null) this.disconnect(); else {
				this.txTimer.addEventListener("timer",$bind(this,this.onTxTimer));
				this.txQueue = new Array();
				this.connectRequested = true;
				this.client = new WebSocket("ws://" + this.host + ":" + Std.string(this.port) + "?encoding=text");
				this.client.onopen = $bind(this,this.onOpen);
				this.client.onclose = $bind(this,this.onClose);
				this.client.onerror = $bind(this,this.onError);
				this.client.onmessage = $bind(this,this.onMessage);
			}
		}
	}
	,txTimer: null
	,txQueue: null
	,client: null
	,closeRequested: null
	,connectRequested: null
	,__class__: nfuzion.client.WebSocketClient
});
nfuzion.client.event = {}
nfuzion.client.event.ClientEvent = function(type,client,data) {
	nfuzion.event.Event.call(this,type);
	this.client = client;
	this.data = data;
};
$hxClasses["nfuzion.client.event.ClientEvent"] = nfuzion.client.event.ClientEvent;
nfuzion.client.event.ClientEvent.__name__ = ["nfuzion","client","event","ClientEvent"];
nfuzion.client.event.ClientEvent.__super__ = nfuzion.event.Event;
nfuzion.client.event.ClientEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	data: null
	,client: null
	,__class__: nfuzion.client.event.ClientEvent
});
nfuzion.debug = {}
nfuzion.debug.Debug = function() { }
$hxClasses["nfuzion.debug.Debug"] = nfuzion.debug.Debug;
nfuzion.debug.Debug.__name__ = ["nfuzion","debug","Debug"];
nfuzion.debug.Debug.__properties__ = {set_client:"set_client"}
nfuzion.debug.Debug.initialize = function() {
	nfuzion.debug.Debug.buffer = new Array();
	haxe.Log.trace = nfuzion.debug.Debug.debugTrace;
}
nfuzion.debug.Debug.debugTrace = function(v,inf) {
	var message = new nfuzion.message.debug.LetTrace(nfuzion.timer.Delay.now(),nfuzion.application.Application.appName,Std.string(v),inf.fileName,inf.lineNumber,inf.className,inf.methodName);
	if(nfuzion.debug.Debug.client == null || nfuzion.debug.Debug.client.get_connected() == false) {
		nfuzion.debug.Debug.buffer.push(message);
		while(nfuzion.debug.Debug.buffer.length > 20) nfuzion.debug.Debug.buffer.shift();
	} else nfuzion.debug.Debug.client.send(message);
}
nfuzion.debug.Debug.set_client = function(client) {
	nfuzion.debug.Debug.client = client;
	if(!client.get_connected()) client.addEventListener("SpanClientEvent.connect",nfuzion.debug.Debug.onClientConnect); else nfuzion.debug.Debug.onClientConnect();
	return nfuzion.debug.Debug.client;
}
nfuzion.debug.Debug.onClientConnect = function(e) {
	while(nfuzion.debug.Debug.buffer.length > 0) nfuzion.debug.Debug.client.send(nfuzion.debug.Debug.buffer.shift());
}
nfuzion.event.BubblingEvent = function(type,bubbles) {
	if(bubbles == null) bubbles = true;
	nfuzion.event.Event.call(this,type);
	this.bubbles = bubbles;
};
$hxClasses["nfuzion.event.BubblingEvent"] = nfuzion.event.BubblingEvent;
nfuzion.event.BubblingEvent.__name__ = ["nfuzion","event","BubblingEvent"];
nfuzion.event.BubblingEvent.__super__ = nfuzion.event.Event;
nfuzion.event.BubblingEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	bubbles: null
	,__class__: nfuzion.event.BubblingEvent
});
nfuzion.event.IListenerManager = function() { }
$hxClasses["nfuzion.event.IListenerManager"] = nfuzion.event.IListenerManager;
nfuzion.event.IListenerManager.__name__ = ["nfuzion","event","IListenerManager"];
nfuzion.event.IListenerManager.prototype = {
	detachAllListeners: null
	,swapListener: null
	,detachListener: null
	,attachListener: null
	,__class__: nfuzion.event.IListenerManager
}
nfuzion.event.ListenerManager = function() {
	this.listeners = new Array();
};
$hxClasses["nfuzion.event.ListenerManager"] = nfuzion.event.ListenerManager;
nfuzion.event.ListenerManager.__name__ = ["nfuzion","event","ListenerManager"];
nfuzion.event.ListenerManager.prototype = {
	detachAllListeners: function() {
		var _g = 0, _g1 = this.listeners;
		while(_g < _g1.length) {
			var listener = _g1[_g];
			++_g;
			var dispatcher = listener.dispatcher;
			dispatcher.removeEventListener(listener.type,listener.listener);
		}
		this.listeners = new Array();
	}
	,swapListener: function(dispatcher,type,listener,priority) {
		if(priority == null) priority = 0;
		var _g1 = 0, _g = this.listeners.length;
		while(_g1 < _g) {
			var i = _g1++;
			var listenerItem = this.listeners[i];
			if(listenerItem.dispatcher == dispatcher && listenerItem.type == type) {
				var dispatcher1 = listenerItem.dispatcher;
				dispatcher1.removeEventListener(listenerItem.type,listenerItem.listener);
				this.listeners.splice(i,1);
			}
		}
		if(listener != null) this.attachListener(dispatcher,type,listener,priority);
	}
	,detachListener: function(dispatcher,type,listener) {
		var _g1 = 0, _g = this.listeners.length;
		while(_g1 < _g) {
			var i = _g1++;
			var listenerItem = this.listeners[i];
			if(listenerItem.dispatcher == dispatcher && listenerItem.type == type && Reflect.compareMethods(listenerItem.listener,listener)) {
				var dispatcher1 = listenerItem.dispatcher;
				dispatcher1.removeEventListener(listenerItem.type,listenerItem.listener);
				this.listeners.splice(i,1);
				break;
			}
		}
	}
	,attachListener: function(dispatcher,type,listener,priority) {
		if(priority == null) priority = 0;
		if(dispatcher != null) {
			var _g1 = 0, _g = this.listeners.length;
			while(_g1 < _g) {
				var i = _g1++;
				var listenerItem = this.listeners[i];
				if(listenerItem.dispatcher == dispatcher && listenerItem.type == type && Reflect.compareMethods(listenerItem.listener,listener)) return;
			}
			this.listeners.push(new nfuzion.event.ListenerRecord(dispatcher,type,listener));
			dispatcher.addEventListener(type,listener);
		} else haxe.Log.trace("ERROR: Attempted to add a listener to a null EventDispatcher.",{ fileName : "ListenerManager.hx", lineNumber : 36, className : "nfuzion.event.ListenerManager", methodName : "attachListener"});
	}
	,listeners: null
	,__class__: nfuzion.event.ListenerManager
}
nfuzion.event.ListenerManagerAndEventDispatcher = function() {
	nfuzion.event.ListenerManager.call(this);
	this.eventDispatcher = new nfuzion.event.EventDispatcher();
};
$hxClasses["nfuzion.event.ListenerManagerAndEventDispatcher"] = nfuzion.event.ListenerManagerAndEventDispatcher;
nfuzion.event.ListenerManagerAndEventDispatcher.__name__ = ["nfuzion","event","ListenerManagerAndEventDispatcher"];
nfuzion.event.ListenerManagerAndEventDispatcher.__interfaces__ = [nfuzion.event.IEventDispatcher];
nfuzion.event.ListenerManagerAndEventDispatcher.__super__ = nfuzion.event.ListenerManager;
nfuzion.event.ListenerManagerAndEventDispatcher.prototype = $extend(nfuzion.event.ListenerManager.prototype,{
	dispatchEvent: function(event) {
		this.eventDispatcher.dispatchEvent(event);
	}
	,hasEventListener: function(type) {
		return this.eventDispatcher.hasEventListener(type);
	}
	,removeEventListener: function(type,listener,priority) {
		if(priority == null) priority = 0;
		this.eventDispatcher.removeEventListener(type,listener,priority);
	}
	,addEventListener: function(type,listener,priority) {
		if(priority == null) priority = 0;
		this.eventDispatcher.addEventListener(type,listener,priority);
	}
	,eventDispatcher: null
	,__class__: nfuzion.event.ListenerManagerAndEventDispatcher
});
nfuzion.event.ListenerRecord = function(dispatcher,type,listener) {
	this.dispatcher = dispatcher;
	this.type = type;
	this.listener = listener;
};
$hxClasses["nfuzion.event.ListenerRecord"] = nfuzion.event.ListenerRecord;
nfuzion.event.ListenerRecord.__name__ = ["nfuzion","event","ListenerRecord"];
nfuzion.event.ListenerRecord.prototype = {
	listener: null
	,type: null
	,dispatcher: null
	,__class__: nfuzion.event.ListenerRecord
}
nfuzion.font = {}
nfuzion.font.BaseFont = function(face,size,style,weight) {
	if(size == null) size = 10;
	nfuzion.event.EventDispatcher.call(this);
	if(style == null) style = nfuzion.font.type.FontStyle.normal;
	if(weight == null) weight = nfuzion.font.type.FontWeight.normal;
	this.set_face(face);
	this.set_size(size);
	this.set_style(style);
	this.set_weight(weight);
};
$hxClasses["nfuzion.font.BaseFont"] = nfuzion.font.BaseFont;
nfuzion.font.BaseFont.__name__ = ["nfuzion","font","BaseFont"];
nfuzion.font.BaseFont.__super__ = nfuzion.event.EventDispatcher;
nfuzion.font.BaseFont.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	weightChanged: function() {
	}
	,set_weight: function(weight) {
		if(weight == null) weight = nfuzion.font.type.FontWeight.normal;
		if(this.weight != weight) {
			this.weight = weight;
			this.dispatchEvent(new nfuzion.font.event.FontEvent("PaintEvent.change",this));
			this.weightChanged();
		}
		return this.weight;
	}
	,weight: null
	,styleChanged: function() {
	}
	,set_style: function(style) {
		if(style == null) style = nfuzion.font.type.FontStyle.normal;
		if(this.style != style) {
			this.style = style;
			this.dispatchEvent(new nfuzion.font.event.FontEvent("PaintEvent.change",this));
			this.styleChanged();
		}
		return this.style;
	}
	,style: null
	,sizeChanged: function() {
	}
	,set_size: function(size) {
		if(size > 0 && this.size != size) {
			this.size = size;
			this.dispatchEvent(new nfuzion.font.event.FontEvent("PaintEvent.change",this));
			this.sizeChanged();
		}
		return this.size;
	}
	,size: null
	,faceChanged: function() {
	}
	,set_face: function(face) {
		if(this.face != face) {
			this.dispatchEvent(new nfuzion.font.event.FontEvent("PaintEvent.change",this));
			this.face = face;
			this.faceChanged();
		}
		return this.face;
	}
	,face: null
	,__class__: nfuzion.font.BaseFont
	,__properties__: {set_face:"set_face",set_size:"set_size",set_style:"set_style",set_weight:"set_weight"}
});
nfuzion.font.IFontFace = function() { }
$hxClasses["nfuzion.font.IFontFace"] = nfuzion.font.IFontFace;
nfuzion.font.IFontFace.__name__ = ["nfuzion","font","IFontFace"];
nfuzion.font.IFontFace.__interfaces__ = [nfuzion.event.IEventDispatcher];
nfuzion.font.IFontFace.prototype = {
	implementation: null
	,ready: null
	,path: null
	,name: null
	,__class__: nfuzion.font.IFontFace
}
nfuzion.font.BaseFontFace = function(path) {
	nfuzion.event.EventDispatcher.call(this);
	if(!StringTools.endsWith(path,".ttf")) {
		haxe.Log.trace("ERROR: Invalid font filename: " + path,{ fileName : "BaseFontFace.hx", lineNumber : 23, className : "nfuzion.font.BaseFontFace", methodName : "new"});
		return;
	}
	this.path = path;
	var start = path.lastIndexOf("/") + 1;
	if(start < 0) start = 0;
	var length = path.length - (start + 4);
	this.name = HxOverrides.substr(path,start,length);
};
$hxClasses["nfuzion.font.BaseFontFace"] = nfuzion.font.BaseFontFace;
nfuzion.font.BaseFontFace.__name__ = ["nfuzion","font","BaseFontFace"];
nfuzion.font.BaseFontFace.__interfaces__ = [nfuzion.font.IFontFace];
nfuzion.font.BaseFontFace.__super__ = nfuzion.event.EventDispatcher;
nfuzion.font.BaseFontFace.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	implementation: null
	,ready: null
	,path: null
	,name: null
	,__class__: nfuzion.font.BaseFontFace
});
nfuzion.font.Font = function(face,size,style,weight) {
	if(size == null) size = 10;
	if(nfuzion.font.Font.styleElement == null) {
		nfuzion.font.Font.styleElement = js.Browser.document.createElement("style");
		js.Browser.document.head.appendChild(nfuzion.font.Font.styleElement);
	}
	this.cssName = "font_" + nfuzion.utility.BaseCode32.encodeString(Std.string(nfuzion.font.Font.fontCount));
	nfuzion.font.Font.fontCount++;
	var cssStyleSheet = nfuzion.font.Font.styleElement.sheet;
	var index = cssStyleSheet.insertRule("." + this.cssName + "{}",0);
	var cssStyleRule = cssStyleSheet.rules.item(0);
	this.implementation = cssStyleRule.style;
	nfuzion.font.BaseFont.call(this,face,size,style,weight);
};
$hxClasses["nfuzion.font.Font"] = nfuzion.font.Font;
nfuzion.font.Font.__name__ = ["nfuzion","font","Font"];
nfuzion.font.Font.__super__ = nfuzion.font.BaseFont;
nfuzion.font.Font.prototype = $extend(nfuzion.font.BaseFont.prototype,{
	weightChanged: function() {
		this.implementation.fontWeight = Std.string(this.weight);
	}
	,styleChanged: function() {
		this.implementation.fontStyle = Std.string(this.style);
	}
	,sizeChanged: function() {
		this.implementation.fontSize = Std.string(this.size) + "px";
	}
	,faceChanged: function() {
		this.implementation.fontFamily = this.face.name;
	}
	,cssName: null
	,implementation: null
	,__class__: nfuzion.font.Font
});
nfuzion.font.FontFace = function(path) {
	nfuzion.font.BaseFontFace.call(this,path);
	this.implementation = js.Browser.document.createElement("style");
	js.Browser.document.head.appendChild(this.implementation);
	this.implementation.innerHTML = "@font-face" + "{" + "font-family: " + this.name + ";" + "src: url('" + path + "');" + "}";
	this.ready = true;
};
$hxClasses["nfuzion.font.FontFace"] = nfuzion.font.FontFace;
nfuzion.font.FontFace.__name__ = ["nfuzion","font","FontFace"];
nfuzion.font.FontFace.__super__ = nfuzion.font.BaseFontFace;
nfuzion.font.FontFace.prototype = $extend(nfuzion.font.BaseFontFace.prototype,{
	__class__: nfuzion.font.FontFace
});
nfuzion.font.FontManager = function() {
	this.fonts = new haxe.ds.StringMap();
	this.fontFaces = new haxe.ds.StringMap();
};
$hxClasses["nfuzion.font.FontManager"] = nfuzion.font.FontManager;
nfuzion.font.FontManager.__name__ = ["nfuzion","font","FontManager"];
nfuzion.font.FontManager.prototype = {
	get: function(name) {
		var font = this.fonts.get(name);
		if(font == null) {
			font = new nfuzion.font.Font();
			this.fonts.set(name,font);
		}
		return font;
	}
	,set: function(name,source,size,style,weight) {
		var fontFace = null;
		if(this.fontFaces.exists(source)) fontFace = this.fontFaces.get(source); else {
			fontFace = new nfuzion.font.FontFace(source);
			this.fontFaces.set(source,fontFace);
		}
		var font = null;
		if(this.fonts.exists(name)) {
			font = this.fonts.get(name);
			font.set_face(fontFace);
			font.set_size(size);
			font.set_style(style);
			font.set_weight(weight);
		} else {
			font = new nfuzion.font.Font(fontFace,size,style,weight);
			this.fonts.set(name,font);
		}
	}
	,fontFaces: null
	,fonts: null
	,__class__: nfuzion.font.FontManager
}
nfuzion.font.event = {}
nfuzion.font.event.FontEvent = function(type,target) {
	nfuzion.event.Event.call(this,type);
	this.target = target;
};
$hxClasses["nfuzion.font.event.FontEvent"] = nfuzion.font.event.FontEvent;
nfuzion.font.event.FontEvent.__name__ = ["nfuzion","font","event","FontEvent"];
nfuzion.font.event.FontEvent.__super__ = nfuzion.event.Event;
nfuzion.font.event.FontEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	target: null
	,__class__: nfuzion.font.event.FontEvent
});
nfuzion.font.event.FontFaceEvent = function(type,target) {
	nfuzion.event.Event.call(this,type);
	this.target = target;
};
$hxClasses["nfuzion.font.event.FontFaceEvent"] = nfuzion.font.event.FontFaceEvent;
nfuzion.font.event.FontFaceEvent.__name__ = ["nfuzion","font","event","FontFaceEvent"];
nfuzion.font.event.FontFaceEvent.__super__ = nfuzion.event.Event;
nfuzion.font.event.FontFaceEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	target: null
	,__class__: nfuzion.font.event.FontFaceEvent
});
nfuzion.font.type = {}
nfuzion.font.type.FontStyle = $hxClasses["nfuzion.font.type.FontStyle"] = { __ename__ : ["nfuzion","font","type","FontStyle"], __constructs__ : ["normal","italic"] }
nfuzion.font.type.FontStyle.normal = ["normal",0];
nfuzion.font.type.FontStyle.normal.toString = $estr;
nfuzion.font.type.FontStyle.normal.__enum__ = nfuzion.font.type.FontStyle;
nfuzion.font.type.FontStyle.italic = ["italic",1];
nfuzion.font.type.FontStyle.italic.toString = $estr;
nfuzion.font.type.FontStyle.italic.__enum__ = nfuzion.font.type.FontStyle;
nfuzion.font.type.FontWeight = $hxClasses["nfuzion.font.type.FontWeight"] = { __ename__ : ["nfuzion","font","type","FontWeight"], __constructs__ : ["normal","bold","bolder","lighter","light"] }
nfuzion.font.type.FontWeight.normal = ["normal",0];
nfuzion.font.type.FontWeight.normal.toString = $estr;
nfuzion.font.type.FontWeight.normal.__enum__ = nfuzion.font.type.FontWeight;
nfuzion.font.type.FontWeight.bold = ["bold",1];
nfuzion.font.type.FontWeight.bold.toString = $estr;
nfuzion.font.type.FontWeight.bold.__enum__ = nfuzion.font.type.FontWeight;
nfuzion.font.type.FontWeight.bolder = ["bolder",2];
nfuzion.font.type.FontWeight.bolder.toString = $estr;
nfuzion.font.type.FontWeight.bolder.__enum__ = nfuzion.font.type.FontWeight;
nfuzion.font.type.FontWeight.lighter = ["lighter",3];
nfuzion.font.type.FontWeight.lighter.toString = $estr;
nfuzion.font.type.FontWeight.lighter.__enum__ = nfuzion.font.type.FontWeight;
nfuzion.font.type.FontWeight.light = ["light",4];
nfuzion.font.type.FontWeight.light.toString = $estr;
nfuzion.font.type.FontWeight.light.__enum__ = nfuzion.font.type.FontWeight;
nfuzion.geometry = {}
nfuzion.geometry.IBox = function() { }
$hxClasses["nfuzion.geometry.IBox"] = nfuzion.geometry.IBox;
nfuzion.geometry.IBox.__name__ = ["nfuzion","geometry","IBox"];
nfuzion.geometry.IBox.__interfaces__ = [nfuzion.event.IEventDispatcher];
nfuzion.geometry.IBox.prototype = {
	cloneBox: null
	,copyFromBox: null
	,setSize: null
	,setPosition: null
	,setSquare: null
	,setBox: null
	,__class__: nfuzion.geometry.IBox
}
nfuzion.geometry.Box = function(x,y,width,height) {
	nfuzion.event.EventDispatcher.call(this);
	this._x = x;
	this._y = y;
	this._width = width;
	this._height = height;
	this.xChanged();
	this.yChanged();
	this.widthChanged();
	this.heightChanged();
	this.positionChanged();
	this.sizeChanged();
	this.boxChanged();
};
$hxClasses["nfuzion.geometry.Box"] = nfuzion.geometry.Box;
nfuzion.geometry.Box.__name__ = ["nfuzion","geometry","Box"];
nfuzion.geometry.Box.__interfaces__ = [nfuzion.geometry.IBox];
nfuzion.geometry.Box.createBox = function(left,right,top,bottom) {
	return new nfuzion.geometry.Box(left,right,right - left + 1,bottom - top + 1);
}
nfuzion.geometry.Box.__super__ = nfuzion.event.EventDispatcher;
nfuzion.geometry.Box.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	cloneBox: function() {
		return new nfuzion.geometry.Box(this._x,this._y,this._width,this._height);
	}
	,boxChanged: function() {
		this.dispatchEvent(new nfuzion.geometry.event.BoxEvent("change"));
	}
	,sizeChanged: function() {
		this.dispatchEvent(new nfuzion.geometry.event.BoxEvent("changeSize"));
	}
	,positionChanged: function() {
		this.dispatchEvent(new nfuzion.geometry.event.BoxEvent("changePosition"));
	}
	,heightChanged: function() {
	}
	,widthChanged: function() {
	}
	,yChanged: function() {
	}
	,xChanged: function() {
	}
	,cropWithBox: function(box) {
		var newLeft = this._x;
		var newRight = this.get_right();
		var newTop = this._y;
		var newBottom = this.get_bottom();
		if(newLeft < box._x) newLeft = box._x;
		if(newRight > box.get_right()) newRight = box.get_right();
		if(newTop < box._y) newTop = box._y;
		if(newBottom > box.get_bottom()) newBottom = box.get_bottom();
		this.setBox(newLeft,newRight,newTop,newBottom);
	}
	,unionWithBox: function(box) {
		var maxLeft = this._x;
		var maxRight = this.get_right();
		var maxTop = this._y;
		var maxBottom = this.get_bottom();
		if(box._x < maxLeft) maxLeft = box._x;
		if(box.get_right() > maxRight) maxRight = box.get_right();
		if(box._y < maxTop) maxTop = box._y;
		if(box.get_bottom() > maxBottom) maxBottom = box.get_bottom();
		this.setBox(maxLeft,maxRight,maxTop,maxBottom);
	}
	,copyFromBox: function(box) {
		this.setSquare(box._x,box._y,box._width,box._height);
	}
	,set_height: function(height) {
		if(this._height != height) {
			this._height = height;
			this.heightChanged();
			this.boxChanged();
			this.sizeChanged();
		}
		return this._height;
	}
	,get_height: function() {
		return this._height;
	}
	,set_width: function(width) {
		if(this._width != width) {
			this._width = width;
			this.widthChanged();
			this.boxChanged();
			this.sizeChanged();
		}
		return this._width;
	}
	,get_width: function() {
		return this._width;
	}
	,set_y: function(y) {
		if(this._y != y) {
			this._y = y;
			this.yChanged();
			this.positionChanged();
			this.boxChanged();
		}
		return this._y;
	}
	,get_y: function() {
		return this._y;
	}
	,set_x: function(x) {
		if(this._x != x) {
			this._x = x;
			this.xChanged();
			this.positionChanged();
			this.boxChanged();
		}
		return this._x;
	}
	,get_x: function() {
		return this._x;
	}
	,set_bottom: function(bottom) {
		if(bottom != this._y + this._height - 1) {
			this._height = bottom - this._y + 1;
			this.heightChanged();
			this.sizeChanged();
			this.boxChanged();
		}
		return bottom;
	}
	,get_bottom: function() {
		return this._y + this._height - 1;
	}
	,set_top: function(top) {
		if(this._y != top) {
			var delta = this._y - top;
			this._y -= delta;
			this._height += delta;
			this.yChanged();
			this.heightChanged();
			this.positionChanged();
			this.sizeChanged();
			this.boxChanged();
		}
		return this._y;
	}
	,get_top: function() {
		return this._y;
	}
	,set_right: function(right) {
		if(right != this._x + this._width - 1) {
			this._width = right - this._x + 1;
			this.widthChanged();
			this.sizeChanged();
			this.boxChanged();
		}
		return right;
	}
	,get_right: function() {
		return this._x + this._width - 1;
	}
	,set_left: function(left) {
		if(this._x != left) {
			var delta = this._x - left;
			this._x -= delta;
			this._width += delta;
			this.xChanged();
			this.widthChanged();
			this.positionChanged();
			this.sizeChanged();
			this.boxChanged();
		}
		return this._x;
	}
	,get_left: function() {
		return this._x;
	}
	,setSize: function(width,height) {
		var oldWidth = this._width;
		var oldHeight = this._height;
		this._width = width;
		this._height = height;
		var changed = false;
		if(oldWidth != this._width) {
			this.widthChanged();
			changed = true;
		}
		if(oldHeight != this._height) {
			this.heightChanged();
			changed = true;
		}
		if(changed) {
			this.sizeChanged();
			this.boxChanged();
		}
	}
	,setPosition: function(x,y) {
		var oldX = this._x;
		var oldY = this._y;
		this._x = x;
		this._y = y;
		var changed = false;
		if(oldX != this._x) {
			this.xChanged();
			changed = true;
		}
		if(oldY != this._y) {
			this.yChanged();
			changed = true;
		}
		if(changed) {
			this.positionChanged();
			this.boxChanged();
		}
	}
	,setSquare: function(x,y,width,height) {
		var oldWidth = this._width;
		var oldHeight = this._height;
		var oldX = this._x;
		var oldY = this._y;
		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;
		var positionChanged = false;
		var sizeChanged = false;
		var boxChanged = false;
		if(oldX != this._x) {
			this.xChanged();
			positionChanged = true;
			boxChanged = true;
		}
		if(oldY != this._y) {
			this.yChanged();
			positionChanged = true;
			boxChanged = true;
		}
		if(oldWidth != this._width) {
			this.widthChanged();
			sizeChanged = true;
			boxChanged = true;
		}
		if(oldHeight != this._height) {
			this.heightChanged();
			sizeChanged = true;
			boxChanged = true;
		}
		if(positionChanged) this.positionChanged();
		if(sizeChanged) this.sizeChanged();
		if(boxChanged) this.boxChanged();
	}
	,setBox: function(left,right,top,bottom) {
		var oldWidth = this._width;
		var oldHeight = this._height;
		var oldX = this._x;
		var oldY = this._y;
		this._x = left;
		this._y = top;
		this._width = right - left + 1;
		this._height = bottom - top + 1;
		var positionChanged = false;
		var sizeChanged = false;
		var boxChanged = false;
		if(oldX != this._x) {
			this.xChanged();
			positionChanged = true;
			boxChanged = true;
		}
		if(oldY != this._y) {
			this.yChanged();
			positionChanged = true;
			boxChanged = true;
		}
		if(oldWidth != this._width) {
			this.widthChanged();
			sizeChanged = true;
			boxChanged = true;
		}
		if(oldHeight != this._height) {
			this.heightChanged();
			sizeChanged = true;
			boxChanged = true;
		}
		if(positionChanged) this.positionChanged();
		if(sizeChanged) this.sizeChanged();
		if(boxChanged) this.boxChanged();
	}
	,_height: null
	,_width: null
	,_y: null
	,_x: null
	,changed: null
	,__class__: nfuzion.geometry.Box
	,__properties__: {set_left:"set_left",get_left:"get_left",set_right:"set_right",get_right:"get_right",set_top:"set_top",get_top:"get_top",set_bottom:"set_bottom",get_bottom:"get_bottom",set_x:"set_x",get_x:"get_x",set_y:"set_y",get_y:"get_y",set_width:"set_width",get_width:"get_width",set_height:"set_height",get_height:"get_height"}
});
nfuzion.geometry.IRelativeBox = function() { }
$hxClasses["nfuzion.geometry.IRelativeBox"] = nfuzion.geometry.IRelativeBox;
nfuzion.geometry.IRelativeBox.__name__ = ["nfuzion","geometry","IRelativeBox"];
nfuzion.geometry.IRelativeBox.__interfaces__ = [nfuzion.geometry.IBox];
nfuzion.geometry.IRelativeBox.prototype = {
	referenceBox: null
	,setRelativeBox: null
	,bottomIsRelative: null
	,topIsRelative: null
	,rightIsRelative: null
	,leftIsRelative: null
	,__class__: nfuzion.geometry.IRelativeBox
}
nfuzion.geometry.Point = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
};
$hxClasses["nfuzion.geometry.Point"] = nfuzion.geometry.Point;
nfuzion.geometry.Point.__name__ = ["nfuzion","geometry","Point"];
nfuzion.geometry.Point.prototype = {
	toString: function() {
		return "(" + Std.string(this.x) + ", " + Std.string(this.y) + ")";
	}
	,divide: function(otherPoint) {
		return new nfuzion.geometry.Point(this.x / otherPoint.x,this.y / otherPoint.y);
	}
	,multiply: function(otherPoint) {
		return new nfuzion.geometry.Point(this.x * otherPoint.x,this.y * otherPoint.y);
	}
	,subtract: function(otherPoint) {
		return new nfuzion.geometry.Point(this.x - otherPoint.x,this.y - otherPoint.y);
	}
	,add: function(otherPoint) {
		return new nfuzion.geometry.Point(this.x + otherPoint.x,this.y + otherPoint.y);
	}
	,equals: function(otherPoint) {
		if(this.x == otherPoint.x && this.y == otherPoint.y) return true;
		return false;
	}
	,clone: function() {
		return new nfuzion.geometry.Point(this.x,this.y);
	}
	,copyFrom: function(source) {
		this.x = source.x;
		this.y = source.y;
	}
	,get_length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	,length: null
	,y: null
	,x: null
	,__class__: nfuzion.geometry.Point
	,__properties__: {get_length:"get_length"}
}
nfuzion.geometry.RelativeBox = function(x,y,top,bottom) {
	this.leftIsRelative = false;
	this.rightIsRelative = false;
	this.topIsRelative = false;
	this.bottomIsRelative = false;
	this.listeningToParent = false;
	nfuzion.geometry.Box.call(this,x,y,top,bottom);
};
$hxClasses["nfuzion.geometry.RelativeBox"] = nfuzion.geometry.RelativeBox;
nfuzion.geometry.RelativeBox.__name__ = ["nfuzion","geometry","RelativeBox"];
nfuzion.geometry.RelativeBox.__interfaces__ = [nfuzion.geometry.IRelativeBox];
nfuzion.geometry.RelativeBox.__super__ = nfuzion.geometry.Box;
nfuzion.geometry.RelativeBox.prototype = $extend(nfuzion.geometry.Box.prototype,{
	onReferenceSizeChange: function(e) {
		if(this.referenceBox == null) return;
		var left = this._x;
		var right = this.get_right();
		var top = this._y;
		var bottom = this.get_bottom();
		if(this.leftIsRelative) left = this.get_relativeLeft() * this.referenceBox.get_width();
		if(this.rightIsRelative) right = this.get_relativeRight() * this.referenceBox.get_width();
		if(this.topIsRelative) top = this.get_relativeTop() * this.referenceBox.get_height();
		if(this.bottomIsRelative) bottom = this.get_relativeBottom() * this.referenceBox.get_height();
		this.pauseRelativeBox = true;
		this.setBox(left,right,top,bottom);
		this.pauseRelativeBox = false;
	}
	,updateRelativeBox: function() {
		var relativeInUse = this.leftIsRelative || this.rightIsRelative || this.topIsRelative || this.bottomIsRelative;
		if(relativeInUse && !this.listeningToParent && this.referenceBox != null) {
			this.listeningToParent = true;
			this.referenceBox.addEventListener("changeSize",$bind(this,this.onReferenceSizeChange));
			this.onReferenceSizeChange();
		}
	}
	,set_referenceBox: function(referenceBox) {
		if(referenceBox != this.referenceBox) {
			if(this.referenceBox != null) {
				this.referenceBox.removeEventListener("changeSize",$bind(this,this.onReferenceSizeChange));
				this.listeningToParent = false;
			}
			this.referenceBox = referenceBox;
			this.updateRelativeBox();
		}
		return this.referenceBox;
	}
	,referenceBox: null
	,setRelativeBox: function(relativeLeft,relativeRight,relativeTop,relativeBottom) {
		this.leftIsRelative = true;
		this.rightIsRelative = true;
		this.topIsRelative = true;
		this.bottomIsRelative = true;
		this.set_relativeLeft(relativeLeft);
		this.set_relativeRight(relativeRight);
		this.set_relativeTop(relativeTop);
		this.set_relativeBottom(relativeBottom);
		this.updateRelativeBox();
	}
	,set_relativeY: function(relativeY) {
		this.set_relativeTop(relativeY);
		return this.get_relativeTop();
	}
	,get_relativeY: function() {
		return this.get_relativeTop();
	}
	,set_relativeX: function(relativeX) {
		this.set_relativeLeft(relativeX);
		return this.get_relativeLeft();
	}
	,get_relativeX: function() {
		return this.get_relativeLeft();
	}
	,set_relativeBottom: function(relativeBottom) {
		var pause = this.pauseRelativeBox;
		this.pauseRelativeBox = true;
		if(this.referenceBox != null) this.set_bottom(this.referenceBox.get_height() * relativeBottom);
		this.relativeBottom = relativeBottom;
		this.pauseRelativeBox = pause;
		this.bottomIsRelative = true;
		this.updateRelativeBox();
		return this.get_relativeBottom();
	}
	,get_relativeBottom: function() {
		if(this.bottomIsRelative) return this.relativeBottom;
		if(this.referenceBox.get_height() == 0) return 0;
		return this.get_bottom() / this.referenceBox.get_height();
	}
	,relativeBottom: null
	,set_relativeTop: function(relativeTop) {
		var pause = this.pauseRelativeBox;
		this.pauseRelativeBox = true;
		if(this.referenceBox != null) this.set_top(this.referenceBox.get_height() * relativeTop);
		this.relativeTop = relativeTop;
		this.pauseRelativeBox = pause;
		this.topIsRelative = true;
		this.updateRelativeBox();
		return this.get_relativeTop();
	}
	,get_relativeTop: function() {
		if(this.topIsRelative) return this.relativeTop;
		if(this.referenceBox.get_height() == 0) return 0;
		return this._y / this.referenceBox.get_height();
	}
	,relativeTop: null
	,set_relativeRight: function(relativeRight) {
		var pause = this.pauseRelativeBox;
		this.pauseRelativeBox = true;
		if(this.referenceBox != null) this.set_right(this.referenceBox.get_width() * relativeRight);
		this.relativeRight = relativeRight;
		this.pauseRelativeBox = pause;
		this.rightIsRelative = true;
		this.updateRelativeBox();
		return this.get_relativeRight();
	}
	,get_relativeRight: function() {
		if(this.rightIsRelative) return this.relativeRight;
		if(this.referenceBox.get_width() == 0) return 0;
		return this.get_right() / this.referenceBox.get_width();
	}
	,relativeRight: null
	,set_relativeLeft: function(relativeLeft) {
		var pause = this.pauseRelativeBox;
		this.pauseRelativeBox = true;
		if(this.referenceBox != null) this.set_left(this.referenceBox.get_width() * relativeLeft);
		this.relativeLeft = relativeLeft;
		this.pauseRelativeBox = pause;
		this.leftIsRelative = true;
		this.updateRelativeBox();
		return this.get_relativeLeft();
	}
	,get_relativeLeft: function() {
		if(this.leftIsRelative) return this.relativeLeft;
		if(this.referenceBox.get_width() == 0) return 0;
		return this._x / this.referenceBox.get_width();
	}
	,relativeLeft: null
	,setBox: function(left,right,top,bottom) {
		if(!this.pauseRelativeBox) {
			this.leftIsRelative = false;
			this.rightIsRelative = false;
			this.topIsRelative = false;
			this.bottomIsRelative = false;
		}
		nfuzion.geometry.Box.prototype.setBox.call(this,left,right,top,bottom);
	}
	,set_bottom: function(bottom) {
		if(!this.pauseRelativeBox) this.bottomIsRelative = false;
		return nfuzion.geometry.Box.prototype.set_bottom.call(this,bottom);
	}
	,set_top: function(top) {
		if(!this.pauseRelativeBox) this.topIsRelative = false;
		return nfuzion.geometry.Box.prototype.set_top.call(this,top);
	}
	,set_right: function(right) {
		if(!this.pauseRelativeBox) this.rightIsRelative = false;
		return nfuzion.geometry.Box.prototype.set_right.call(this,right);
	}
	,set_left: function(left) {
		if(!this.pauseRelativeBox) this.leftIsRelative = false;
		return nfuzion.geometry.Box.prototype.set_left.call(this,left);
	}
	,pauseRelativeBox: null
	,listeningToParent: null
	,bottomIsRelative: null
	,topIsRelative: null
	,rightIsRelative: null
	,leftIsRelative: null
	,__class__: nfuzion.geometry.RelativeBox
	,__properties__: $extend(nfuzion.geometry.Box.prototype.__properties__,{set_relativeLeft:"set_relativeLeft",get_relativeLeft:"get_relativeLeft",set_relativeRight:"set_relativeRight",get_relativeRight:"get_relativeRight",set_relativeTop:"set_relativeTop",get_relativeTop:"get_relativeTop",set_relativeBottom:"set_relativeBottom",get_relativeBottom:"get_relativeBottom",set_relativeX:"set_relativeX",get_relativeX:"get_relativeX",set_relativeY:"set_relativeY",get_relativeY:"get_relativeY",set_referenceBox:"set_referenceBox"})
});
nfuzion.geometry.event = {}
nfuzion.geometry.event.BoxEvent = function(type) {
	nfuzion.event.Event.call(this,type);
};
$hxClasses["nfuzion.geometry.event.BoxEvent"] = nfuzion.geometry.event.BoxEvent;
nfuzion.geometry.event.BoxEvent.__name__ = ["nfuzion","geometry","event","BoxEvent"];
nfuzion.geometry.event.BoxEvent.__super__ = nfuzion.event.Event;
nfuzion.geometry.event.BoxEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	__class__: nfuzion.geometry.event.BoxEvent
});
nfuzion.relation = {}
nfuzion.relation.IChild = function() { }
$hxClasses["nfuzion.relation.IChild"] = nfuzion.relation.IChild;
nfuzion.relation.IChild.__name__ = ["nfuzion","relation","IChild"];
nfuzion.relation.IChild.prototype = {
	implementation: null
	,orphan: null
	,adopt: null
	,parent: null
	,__class__: nfuzion.relation.IChild
}
nfuzion.graphics = {}
nfuzion.graphics.IComponent = function() { }
$hxClasses["nfuzion.graphics.IComponent"] = nfuzion.graphics.IComponent;
nfuzion.graphics.IComponent.__name__ = ["nfuzion","graphics","IComponent"];
nfuzion.graphics.IComponent.__interfaces__ = [nfuzion.relation.IChild,nfuzion.geometry.IBox];
nfuzion.graphics.IComponent.prototype = {
	canvas: null
	,layout: null
	,finalYScale: null
	,finalXScale: null
	,yScale: null
	,xScale: null
	,guise: null
	,guises: null
	,defaultFrame: null
	,gotoDefault: null
	,'goto': null
	,currentFrame: null
	,frames: null
	,maskBox: null
	,maskFit: null
	,maskUrl: null
	,borderWidth: null
	,borderPaint: null
	,backgroundPaint: null
	,backgroundBox: null
	,backgroundFit: null
	,backgroundUrl: null
	,destroy: null
	,bubbleEvent: null
	,copy: null
	,clone: null
	,touchEnabled: null
	,screen: null
	,globalPosition: null
	,globalToLocal: null
	,localToGlobal: null
	,visible: null
	,alpha: null
	,removedFromStage: null
	,addedToStage: null
	,stage: null
	,initialized: null
	,name: null
	,__class__: nfuzion.graphics.IComponent
}
nfuzion.graphics.BaseComponent = function(name,sketch) {
	if(name == null) name = "";
	this.canvas = null;
	this.yScale = 1;
	this.xScale = 1;
	this.guise = null;
	this.defaultFrame = null;
	this.alpha = 1;
	this.canvasCreated = false;
	this.initialized = false;
	this.desroyed = false;
	this.name = name;
	this.sketch = sketch;
	this.currentSketch = sketch;
	this.set_frames(new haxe.ds.StringMap());
	this.set_guises(new haxe.ds.StringMap());
	this.onStage = false;
	this.create();
	if(this.implementation == null) throw "Failed to create implementation.";
	this.backgroundBox = new nfuzion.geometry.Box(0,0,0,0);
	this.backgroundBox.addEventListener("change",$bind(this,this.backgroundBoxChanged));
	this.maskBox = new nfuzion.geometry.Box(0,0,0,0);
	this.maskBox.addEventListener("change",$bind(this,this.maskBoxChanged));
	nfuzion.geometry.Box.call(this,0,0,0,0);
	this.initialize();
};
$hxClasses["nfuzion.graphics.BaseComponent"] = nfuzion.graphics.BaseComponent;
nfuzion.graphics.BaseComponent.__name__ = ["nfuzion","graphics","BaseComponent"];
nfuzion.graphics.BaseComponent.__interfaces__ = [nfuzion.graphics.IComponent];
nfuzion.graphics.BaseComponent.__super__ = nfuzion.geometry.Box;
nfuzion.graphics.BaseComponent.prototype = $extend(nfuzion.geometry.Box.prototype,{
	createCanvas: function() {
		return null;
	}
	,get_canvas: function() {
		if(!this.canvasCreated) this.canvas = this.createCanvas();
		return this.canvas;
	}
	,canvas: null
	,get_finalYScale: function() {
		var parent = this.parent;
		var scale = this.yScale;
		while(parent != null && parent != this.get_stage()) {
			scale *= parent.yScale;
			parent = parent.parent;
		}
		return scale;
	}
	,finalYScale: null
	,get_finalXScale: function() {
		var parent = this.parent;
		var scale = this.xScale;
		while(parent != null && parent != this.get_stage()) {
			scale *= parent.xScale;
			parent = parent.parent;
		}
		return scale;
	}
	,finalXScale: null
	,set_layout: function(layout) {
		if(this.layout != layout) {
			this.layout = layout;
			if(this.layout != null) this.layout.detach();
			if(!this.layout.attach(this)) {
				layout = null;
				haxe.Log.trace("Could not attach layout to component '" + this.get_fullName() + "'.",{ fileName : "BaseComponent.hx", lineNumber : 926, className : "nfuzion.graphics.BaseComponent", methodName : "set_layout"});
			}
		}
		return this.layout;
	}
	,layout: null
	,yScaleChanged: function() {
	}
	,set_yScale: function(yScale) {
		if(this.yScale != yScale) {
			this.yScale = yScale;
			this.yScaleChanged();
		}
		return this.yScale;
	}
	,yScale: null
	,xScaleChanged: function() {
	}
	,set_xScale: function(xScale) {
		if(this.xScale != xScale) {
			this.xScale = xScale;
			this.xScaleChanged();
		}
		return this.xScale;
	}
	,xScale: null
	,get_fullName: function() {
		if(this.parent != null) return this.parent.get_fullName() + "." + this.name;
		return this.name;
	}
	,fullName: null
	,updateGuise: function() {
		var targetSketch = this.sketch;
		if(this.guise != null && this.guises != null && this.guises.exists(this.guise)) targetSketch = this.guises.get(this.guise);
		if(targetSketch != this.currentSketch && this.guises != null) {
			this.currentSketch = targetSketch;
			nfuzion.nTactic.NTactic.builder.theme(this,this.currentSketch);
		}
	}
	,set_guise: function(guise) {
		if(guise != this.guise) {
			this.guise = guise;
			this.updateGuise();
		}
		return this.guise;
	}
	,guise: null
	,set_guises: function(guises) {
		if(this.guises != guises) {
			this.guises = guises;
			this.updateGuise();
		}
		return this.guises;
	}
	,guises: null
	,set_frames: function(frames) {
		if(this.frames != frames) {
			if(frames != null) {
				if(this.frames != null) {
					var $it0 = ((function(_e) {
						return function() {
							return _e.iterator();
						};
					})(this.frames))();
					while( $it0.hasNext() ) {
						var frame = $it0.next();
						this.removeImage(frame.url);
					}
				}
				this.frames = frames;
				var $it1 = ((function(_e1) {
					return function() {
						return _e1.iterator();
					};
				})(frames))();
				while( $it1.hasNext() ) {
					var frame = $it1.next();
					if(frame.url == null) haxe.Log.trace("frame null on '" + this.get_fullName() + "'",{ fileName : "BaseComponent.hx", lineNumber : 769, className : "nfuzion.graphics.BaseComponent", methodName : "set_frames"});
					this.addImage(frame.url);
				}
			} else this.frames = null;
			if(this.currentFrame != null && frames != null) this["goto"](this.currentFrame);
		}
		return this.frames;
	}
	,frames: null
	,maskFitChanged: function() {
	}
	,set_maskFit: function(maskFit) {
		if(maskFit == null) maskFit = nfuzion.graphics.type.Fit.none;
		if(this.maskFit != maskFit) {
			this.maskFit = maskFit;
			this.maskFitChanged();
		}
		return this.maskFit;
	}
	,maskFit: null
	,maskImageReady: function(e) {
		if(e != null) e.target.removeEventListener("ImageEvent.ready",$bind(this,this.maskImageReady));
	}
	,maskUrlChanged: function() {
	}
	,set_maskUrl: function(maskUrl) {
		if(this.maskImage == null || maskUrl != this.maskUrl) {
			this.maskUrl = maskUrl;
			if(this.maskImage != null) this.removeImage(this.maskImage.url);
			if(maskUrl != null) {
				this.maskImage = this.addImage(maskUrl);
				this.maskUrlChanged();
				if(this.maskImage != null) {
					if(this.maskImage.ready) this.maskImageReady(); else this.maskImage.addEventListener("ImageEvent.ready",$bind(this,this.maskImageReady));
				}
			}
		}
		return this.maskUrl;
	}
	,maskUrl: null
	,maskBoxChanged: function(e) {
	}
	,borderWidthChanged: function() {
	}
	,set_borderWidth: function(borderWidth) {
		if(borderWidth < 0) borderWidth = 0;
		if(borderWidth != this.borderWidth) {
			this.borderWidth = borderWidth;
			this.borderWidthChanged();
		}
		return this.borderWidth;
	}
	,borderWidth: null
	,borderPaintChanged: function() {
	}
	,set_borderPaint: function(borderPaint) {
		if(this.borderPaint != borderPaint) {
			this.disusePaint(this.borderPaint);
			this.borderPaint = borderPaint;
			this.usePaint(this.borderPaint);
			this.borderPaintChanged();
		}
		return this.borderPaint;
	}
	,borderPaint: null
	,backgroundPaintChanged: function() {
	}
	,set_backgroundPaint: function(backgroundPaint) {
		if(this.backgroundPaint != backgroundPaint) {
			this.backgroundPaintChanged();
			this.disusePaint(this.backgroundPaint);
			this.backgroundPaint = backgroundPaint;
			this.usePaint(this.backgroundPaint);
			this.backgroundPaintChanged();
		}
		return this.backgroundPaint;
	}
	,backgroundPaint: null
	,backgroundFitChanged: function() {
	}
	,set_backgroundFit: function(backgroundFit) {
		if(backgroundFit == null) backgroundFit = nfuzion.graphics.type.Fit.none;
		if(this.backgroundFit != backgroundFit) {
			this.backgroundFit = backgroundFit;
			this.backgroundFitChanged();
		}
		return this.backgroundFit;
	}
	,backgroundFit: null
	,backgroundImageReady: function(e) {
		if(e != null) e.target.removeEventListener("ImageEvent.ready",$bind(this,this.backgroundImageReady));
	}
	,backgroundUrlChanged: function() {
	}
	,set_backgroundUrl: function(backgroundUrl) {
		this.currentFrame = null;
		if(this.backgroundImage == null || backgroundUrl != this.backgroundUrl) {
			this.backgroundUrl = backgroundUrl;
			this.backgroundUrlChanged();
			if(this.backgroundImage != null) this.removeImage(this.backgroundImage.url);
			if(backgroundUrl != null) {
				this.backgroundImage = this.addImage(backgroundUrl);
				if(this.backgroundImage != null) {
					if(this.backgroundImage.ready) this.backgroundImageReady(); else this.backgroundImage.addEventListener("ImageEvent.ready",$bind(this,this.backgroundImageReady));
				}
			}
		}
		return this.backgroundUrl;
	}
	,backgroundUrl: null
	,backgroundBoxChanged: function(e) {
	}
	,destroy: function() {
		this.desroyed = true;
		if(this.canvasCreated) this.get_canvas().destroy();
		this.backgroundBox.removeEventListener("change",$bind(this,this.backgroundBoxChanged));
		this.maskBox.removeEventListener("change",$bind(this,this.maskBoxChanged));
		if(this.backgroundImage != null) this.backgroundImage.removeEventListener("ImageEvent.ready",$bind(this,this.backgroundImageReady));
		if(this.maskImage != null) this.maskImage.removeEventListener("ImageEvent.ready",$bind(this,this.maskImageReady));
		if(this.parent != null) {
			this.parent.removeChild(this);
			this.parent = null;
		}
		this.eventTypes = null;
		this.set_screen(null);
		this.maskBox = null;
		this.implementation = null;
		this.set_frames(null);
		this.set_guises(null);
	}
	,onPaintChange: function(e) {
		var paint = e.target;
		if(paint == this.backgroundPaint) this.set_backgroundPaint(this.backgroundPaint);
		if(paint == this.borderPaint) this.set_borderPaint(this.borderPaint);
	}
	,disusePaint: function(paint) {
		if(paint != null) paint.removeEventListener("PaintEvent.change",$bind(this,this.onPaintChange));
	}
	,usePaint: function(paint) {
		if(paint != null) paint.addEventListener("PaintEvent.change",$bind(this,this.onPaintChange));
	}
	,disusePaints: function() {
		this.disusePaint(this.borderPaint);
		this.disusePaint(this.backgroundPaint);
	}
	,usePaints: function() {
		this.usePaint(this.borderPaint);
		this.usePaint(this.backgroundPaint);
	}
	,bubbleEvent: function(e) {
		var component = this;
		do {
			if(component.touchEnabled) component.dispatchEvent(e);
			component = component.parent;
		} while(e.bubbles && !e.stop && !e.stopNow && component != null);
	}
	,copy: function(from) {
		this.copyFromBox(from);
		this.sketch = from.sketch;
		this.set_guises(from.guises);
		this.set_guise(from.guise);
		this.set_alpha(from.alpha);
		this.set_visible(from.visible);
		this.set_imposeTouchDisabled(from.imposeTouchDisabled);
		this.set_borderPaint(from.borderPaint);
		this.set_borderWidth(from.borderWidth);
		this.maskBox.copyFromBox(from.maskBox);
		this.set_maskFit(from.maskFit);
		this.set_maskUrl(from.maskUrl);
		this.set_frames(from.frames);
		this.set_defaultFrame(from.defaultFrame);
		this.set_backgroundPaint(from.backgroundPaint);
		if(from.currentFrame == null) {
			this.backgroundBox.copyFromBox(from.backgroundBox);
			this.set_backgroundUrl(from.backgroundUrl);
			this.set_backgroundFit(from.backgroundFit);
		} else this["goto"](from.currentFrame);
	}
	,clone: function() {
		haxe.Log.trace("ERROR: Cannot clone BaseComponent.",{ fileName : "BaseComponent.hx", lineNumber : 405, className : "nfuzion.graphics.BaseComponent", methodName : "clone"});
		return null;
	}
	,imposeTouchDisabledChanged: function() {
	}
	,set_imposeTouchDisabled: function(imposeTouchDisabled) {
		if(imposeTouchDisabled != this.imposeTouchDisabled) {
			this.imposeTouchDisabled = imposeTouchDisabled;
			this.imposeTouchDisabledChanged();
		}
		return this.imposeTouchDisabled;
	}
	,imposeTouchDisabled: null
	,touchEnabledChanged: function() {
	}
	,set_touchEnabled: function(touchEnabled) {
		if(touchEnabled != this.touchEnabled) {
			this.touchEnabled = touchEnabled;
			this.touchEnabledChanged();
		}
		return this.touchEnabled;
	}
	,touchEnabled: null
	,set_defaultFrame: function(name) {
		if(name != null) {
			if(!this.frames.exists(name)) {
				haxe.Log.trace("WARNING: Attempted to set a default frame that doesn't exist",{ fileName : "BaseComponent.hx", lineNumber : 353, className : "nfuzion.graphics.BaseComponent", methodName : "set_defaultFrame"});
				name = null;
			}
		}
		this.defaultFrame = name;
		return name;
	}
	,defaultFrame: null
	,gotoDefault: function() {
		this["goto"](this.defaultFrame);
	}
	,'goto': function(name) {
		var result = false;
		var newFrame = null;
		if(name == null) {
			this.set_backgroundUrl(null);
			result = true;
		} else {
			var frame = this.frames.get(name);
			if(frame != null) {
				newFrame = name;
				this.set_backgroundUrl(frame.url);
				this.backgroundBox.copyFromBox(frame);
				this.set_backgroundFit(frame.fit);
				result = true;
			} else this.set_backgroundUrl(null);
		}
		this.currentFrame = newFrame;
		return result;
	}
	,removedFromScreen: function() {
		if(this.backgroundUrl != null) this.removeImage(this.backgroundUrl);
	}
	,addedToScreen: function() {
		if(this.backgroundUrl != null) {
			var currentFrame = this.currentFrame;
			this.set_backgroundUrl(this.backgroundUrl);
			this.currentFrame = currentFrame;
		}
		if(this.maskUrl != null) this.set_maskUrl(this.maskUrl);
	}
	,set_screen: function(screen) {
		if(screen != this.screen) {
			if(this.screen != null) this.removedFromScreen();
			this.screen = screen;
			if(this.screen != null) this.addedToScreen();
		}
		return this.screen;
	}
	,screen: null
	,getImage: function(url) {
		if(this.screen != null) return this.screen.getImage(url);
		return null;
	}
	,removeImage: function(url) {
		if(this.screen != null) this.screen.removeImage(url);
	}
	,addImage: function(url) {
		if(this.screen != null && url != null) return this.screen.addImage(url);
		return null;
	}
	,get_globalPosition: function() {
		var position = new nfuzion.geometry.Point();
		if(this != this.get_stage()) {
			var component = this;
			do {
				position.x += component._x;
				position.y += component._y;
				component = component.parent;
			} while(component != this.get_stage() && component != null);
		}
		return position;
	}
	,globalPosition: null
	,globalToLocal: function(global) {
		var local = global.clone();
		return local.divide(new nfuzion.geometry.Point(this.get_finalXScale(),this.get_finalYScale())).subtract(this.get_globalPosition());
	}
	,localToGlobal: function(local) {
		return this.get_globalPosition().add(local).multiply(new nfuzion.geometry.Point(this.get_finalXScale(),this.get_finalYScale()));
	}
	,visibleChanged: function() {
	}
	,set_visible: function(visible) {
		if(visible != this.visible) {
			this.visible = visible;
			this.visibleChanged();
		}
		return visible;
	}
	,visible: null
	,alphaChanged: function() {
	}
	,set_alpha: function(alpha) {
		if(alpha < 0) alpha = 0;
		if(alpha > 1) alpha = 1;
		this.alpha = alpha;
		this.alphaChanged();
		return alpha;
	}
	,alpha: null
	,create: function() {
	}
	,initialize: function() {
		this.set_visible(true);
		this.set_backgroundFit(nfuzion.graphics.type.Fit.none);
		this.set_borderPaint(null);
		this.set_borderWidth(0);
		this.set_maskFit(nfuzion.graphics.type.Fit.none);
		this.set_touchEnabled(false);
		this.set_imposeTouchDisabled(false);
		this.set_maskFit(nfuzion.graphics.type.Fit.none);
		this.initialized = true;
	}
	,removedFromStage: function() {
		if(this.get_stage() == null && this.onStage) {
			this.onStage = false;
			this.dispatchEvent(new nfuzion.graphics.event.ComponentEvent("removedFromStage",this));
			this.disusePaints();
		}
	}
	,addedToStage: function() {
		if(this.get_stage() != null && !this.onStage) {
			this.onStage = true;
			this.dispatchEvent(new nfuzion.graphics.event.ComponentEvent("addedToStage",this));
		}
		this.usePaints();
	}
	,get_stage: function() {
		if(this.parent != null) return this.parent.get_stage();
		return null;
	}
	,stage: null
	,orphan: function() {
		this.dispatchEvent(new nfuzion.graphics.event.ComponentEvent("orphaning",this));
		this.parent = null;
		this.removedFromStage();
		this.set_screen(null);
	}
	,adopt: function(parent) {
		if(this.parent != null) {
			var parent1 = this.parent;
			this.orphan();
			parent1.removeChild(this);
		}
		this.parent = parent;
		this.set_screen(parent.screen);
		this.addedToStage();
		this.dispatchEvent(new nfuzion.graphics.event.ComponentEvent("adopted",this));
	}
	,canvasCreated: null
	,desroyed: null
	,maskImage: null
	,backgroundImage: null
	,onStage: null
	,currentSketch: null
	,sketch: null
	,maskBox: null
	,backgroundBox: null
	,initialized: null
	,parent: null
	,name: null
	,currentFrame: null
	,implementation: null
	,__class__: nfuzion.graphics.BaseComponent
	,__properties__: $extend(nfuzion.geometry.Box.prototype.__properties__,{get_stage:"get_stage",set_alpha:"set_alpha",set_visible:"set_visible",get_globalPosition:"get_globalPosition",set_screen:"set_screen",set_defaultFrame:"set_defaultFrame",set_touchEnabled:"set_touchEnabled",set_imposeTouchDisabled:"set_imposeTouchDisabled",set_backgroundUrl:"set_backgroundUrl",set_backgroundFit:"set_backgroundFit",set_backgroundPaint:"set_backgroundPaint",set_borderPaint:"set_borderPaint",set_borderWidth:"set_borderWidth",set_maskUrl:"set_maskUrl",set_maskFit:"set_maskFit",set_frames:"set_frames",set_guises:"set_guises",set_guise:"set_guise",get_fullName:"get_fullName",set_xScale:"set_xScale",set_yScale:"set_yScale",set_layout:"set_layout",get_finalXScale:"get_finalXScale",get_finalYScale:"get_finalYScale",get_canvas:"get_canvas"})
});
nfuzion.graphics.Component = function(name,sketch) {
	if(name == null) name = "";
	this.hFlipped = false;
	this.vFlipped = false;
	this.backgroundDiv = null;
	this.borderDiv = null;
	nfuzion.graphics.BaseComponent.call(this,name,sketch);
};
$hxClasses["nfuzion.graphics.Component"] = nfuzion.graphics.Component;
nfuzion.graphics.Component.__name__ = ["nfuzion","graphics","Component"];
nfuzion.graphics.Component.__super__ = nfuzion.graphics.BaseComponent;
nfuzion.graphics.Component.prototype = $extend(nfuzion.graphics.BaseComponent.prototype,{
	yScaleChanged: function() {
		this.yChanged();
	}
	,xScaleChanged: function() {
		this.xChanged();
	}
	,updateMask: function(e) {
		if(!this.initialized) return;
		if(this.maskImage != null && this.maskImage.ready) {
			var _g = this;
			switch( (_g.maskFit)[1] ) {
			case 0:
				this.implementation.style.webkitMaskBoxImage = null;
				this.implementation.style.webkitMaskImage = "url(" + this.maskUrl + ")";
				this.implementation.style.webkitMaskPosition = Std.string(this.maskBox._x * -1) + "px -" + Std.string(this.maskBox._y) + "px";
				break;
			case 2:
				throw "Not implemented.";
				break;
			case 1:
				throw "Not implemented.";
				break;
			case 3:
				this.implementation.style.webkitMaskBoxImage = "url(" + this.maskUrl + ") stretch";
				break;
			case 4:
				throw "Not implemented.";
				break;
			case 6:
				throw "Not implemented.";
				break;
			case 5:
				throw "Not implemented.";
				break;
			case 7:
				throw "Not implemented.";
				break;
			case 8:
				throw "Not implemented.";
				break;
			}
		}
	}
	,maskImageReady: function(e) {
		nfuzion.graphics.BaseComponent.prototype.maskImageReady.call(this,e);
		this.updateMask();
	}
	,maskFitChanged: function() {
		this.updateMask();
	}
	,maskBoxChanged: function(e) {
		this.updateMask();
	}
	,updateBackground: function(e) {
		if(!this.initialized || this.implementation == null || this.backgroundDiv == null) return;
		if(this.backgroundUrl == null || this.backgroundImage != null && this.backgroundImage.ready) {
			if(this.backgroundImage != null) {
				var _g = this;
				switch( (_g.backgroundFit)[1] ) {
				case 0:
					this.backgroundDiv.style.backgroundImage = "url('" + this.backgroundUrl + "')";
					this.backgroundDiv.style.backgroundSize = null;
					this.backgroundDiv.style.backgroundPosition = Std.string(this.backgroundBox._x * -1) + "px -" + Std.string(this.backgroundBox._y) + "px";
					this.backgroundDiv.style.webkitTransform = null;
					break;
				case 2:
					throw "Not implemented.";
					break;
				case 1:
					this.backgroundDiv.style.backgroundImage = "url('" + this.backgroundUrl + "')";
					this.backgroundDiv.style.backgroundSize = "cover";
					this.backgroundDiv.style.backgroundPosition = "center";
					this.backgroundDiv.style.webkitTransform = null;
					break;
				case 3:
					throw "Not implemented.";
					break;
				case 4:
					throw "Not implemented.";
					break;
				case 6:
					throw "Not implemented.";
					break;
				case 5:
					throw "Not implemented.";
					break;
				case 7:
					this.backgroundDiv.style.backgroundImage = "url('" + this.backgroundUrl + "')";
					this.backgroundDiv.style.backgroundSize = null;
					this.backgroundDiv.style.backgroundPosition = Std.string(this.backgroundBox._x * -1) + "px -" + Std.string(this.backgroundBox._y) + "px";
					var xScale = Math.abs(this._width) / this.backgroundBox._width;
					var yScale = Math.abs(this._height) / this.backgroundBox._height;
					this.backgroundDiv.style.width = Std.string(Math.round(this._width / xScale)) + "px";
					this.backgroundDiv.style.height = Std.string(Math.round(this._height / yScale)) + "px";
					this.backgroundDiv.style.webkitTransform = "scale(" + Std.string(xScale) + ", " + Std.string(yScale) + ")";
					this.backgroundDiv.style.webkitTransformOrigin = "0% 0%";
					break;
				case 8:
					throw "Not implemented.";
					break;
				}
			}
		}
	}
	,updateBorder: function() {
		if(this.borderDiv == null) return;
		this.borderDiv.style.width = Std.string(Math.round(Math.abs(this._width) - this.borderWidth * 2)) + "px";
		this.borderDiv.style.height = Std.string(Math.round(Math.abs(this._height) - this.borderWidth * 2)) + "px";
		if(this.borderPaint != null && this.borderWidth > 0) this.borderDiv.style.border = this.borderWidth + "px solid #" + nfuzion.utility.ColorTools.toString(this.borderPaint.color); else this.borderDiv.style.border = null;
	}
	,borderWidthChanged: function() {
		if(this.borderWidth > 0 && this.borderDiv == null) {
			this.borderDiv = js.Browser.document.createElement("div");
			this.borderDiv.style.left = "0px";
			this.borderDiv.style.top = "0px";
			if(this.implementation.firstChild != null) this.implementation.insertBefore(this.borderDiv,this.implementation.firstChild); else this.implementation.appendChild(this.borderDiv);
		}
		if(this.borderPaint != null) this.updateBorder();
	}
	,borderPaintChanged: function() {
		if(this.borderWidth > 0) this.updateBorder();
	}
	,backgroundPaintChanged: function() {
		if(this.backgroundPaint != null) this.implementation.style.backgroundColor = "#" + nfuzion.utility.ColorTools.toString(this.backgroundPaint.color); else this.implementation.style.backgroundColor = null;
	}
	,backgroundFitChanged: function() {
		this.updateBackground();
	}
	,backgroundImageReady: function(e) {
		nfuzion.graphics.BaseComponent.prototype.backgroundImageReady.call(this,e);
		this.updateBackground();
	}
	,backgroundUrlChanged: function() {
		if(this.backgroundDiv == null && this.backgroundUrl != null) {
			this.backgroundDiv = js.Browser.document.createElement("div");
			this.backgroundDiv.style.left = "0px";
			this.backgroundDiv.style.top = "0px";
			this.backgroundDiv.style.width = "100%";
			this.backgroundDiv.style.height = "100%";
			if(this.implementation.firstChild != null) this.implementation.insertBefore(this.backgroundDiv,this.implementation.firstChild); else this.implementation.appendChild(this.backgroundDiv);
		}
	}
	,backgroundBoxChanged: function(e) {
		this.updateBackground();
	}
	,visibleChanged: function() {
		this.implementation.style.display = this.visible?"block":"none";
	}
	,destroy: function() {
		nfuzion.graphics.BaseComponent.prototype.destroy.call(this);
		this.implementation.component = null;
		this.implementation = null;
	}
	,clone: function() {
		var clone = new nfuzion.graphics.Component(this.name);
		clone.copy(this);
		return clone;
	}
	,updateTouchEnabled: function() {
		if(this.implementation == null) return;
		if(this.touchEnabled && !this.imposeTouchDisabled) this.implementation.style.pointerEvents = "auto"; else this.implementation.style.pointerEvents = null;
	}
	,imposeTouchDisabledChanged: function() {
		this.updateTouchEnabled();
	}
	,touchEnabledChanged: function() {
		this.updateTouchEnabled();
	}
	,alphaChanged: function() {
		this.implementation.style.opacity = Std.string(this.alpha);
	}
	,updateTransform: function() {
		var transformString = "";
		transformString += "translate3d(" + this.xTransform + "px," + this.yTransform + "px,0) ";
		if(this.xScale != 1) transformString += "scaleX(" + this.xScale + ") ";
		if(this.yScale != 1) transformString += "scaleY(" + this.yScale + ") ";
		if(this._width < 0) transformString += "rotateY(180deg) ";
		if(this._height < 0) transformString += "rotateX(180deg) ";
		this.implementation.style.webkitTransform = transformString;
	}
	,positionChanged: function() {
		this.updateTransform();
		nfuzion.graphics.BaseComponent.prototype.positionChanged.call(this);
	}
	,heightChanged: function() {
		nfuzion.graphics.BaseComponent.prototype.heightChanged.call(this);
		if(this._height >= 0) {
			if(this.vFlipped) {
				this.vFlipped = false;
				this.yChanged();
				this.updateTransform();
			}
			this.implementation.style.height = Std.string(Math.round(this._height)) + "px";
		} else {
			this.yChanged();
			if(!this.vFlipped) this.vFlipped = true;
			this.updateTransform();
			this.implementation.style.height = Std.string(Math.round(-this._height)) + "px";
		}
		if(this.borderWidth > 0 && this.borderPaint != null) this.updateBorder();
		if(this.backgroundImage != null) this.updateBackground();
	}
	,yChanged: function() {
		nfuzion.graphics.BaseComponent.prototype.yChanged.call(this);
		if(!this.vFlipped) this.yTransform = Std.string(this._y - this._height * (1 - this.yScale) / 2); else this.yTransform = Std.string(this._y + this._height + this._height * (1 - this.yScale) / 2);
	}
	,widthChanged: function() {
		nfuzion.graphics.BaseComponent.prototype.widthChanged.call(this);
		if(this._width >= 0) {
			if(this.hFlipped) {
				this.hFlipped = false;
				this.xChanged();
				this.updateTransform();
			}
			this.implementation.style.width = Std.string(Math.round(this._width)) + "px";
		} else {
			this.xChanged();
			if(!this.hFlipped) this.hFlipped = true;
			this.updateTransform();
			this.implementation.style.width = Std.string(Math.round(-this._width)) + "px";
		}
		if(this.borderWidth > 0 && this.borderPaint != null) this.updateBorder();
		if(this.backgroundImage != null) this.updateBackground();
	}
	,xChanged: function() {
		nfuzion.graphics.BaseComponent.prototype.xChanged.call(this);
		if(!this.hFlipped) this.xTransform = Std.string(this._x - this._width * (1 - this.xScale) / 2); else this.xTransform = Std.string(this._x + this._width * this.xScale);
	}
	,create: function() {
		this.implementation = js.Browser.document.createElement("div");
		this.updateTouchEnabled();
		this.implementation.component = this;
	}
	,removedFromStage: function() {
		nfuzion.graphics.BaseComponent.prototype.removedFromStage.call(this);
		if(this.get_stage() == null && this.onStage) {
			this.implementation.removeEventListener("touchenter",$bind(this,this.onTouchEnter),false);
			this.implementation.removeEventListener("touchleave",$bind(this,this.onTouchLeave),false);
		}
	}
	,addedToStage: function() {
		nfuzion.graphics.BaseComponent.prototype.addedToStage.call(this);
		this.implementation.addEventListener("touchleave",$bind(this,this.onTouchLeave),false);
		this.implementation.addEventListener("touchenter",$bind(this,this.onTouchEnter),false);
	}
	,onTouchLeave: function(e) {
		e.stopPropagation();
		e.preventDefault();
		var _g1 = 0, _g = e.changedTouches.length;
		while(_g1 < _g) {
			var i = _g1++;
			var touch = e.changedTouches.item(i);
			this.dispatchEvent(new nfuzion.graphics.event.TouchEvent("out",this,touch.identifier,new nfuzion.geometry.Point(touch.clientX,touch.clientY)));
		}
		return false;
	}
	,onTouchEnter: function(e) {
		e.stopPropagation();
		e.preventDefault();
		var _g1 = 0, _g = e.changedTouches.length;
		while(_g1 < _g) {
			var i = _g1++;
			var touch = e.changedTouches.item(i);
			this.dispatchEvent(new nfuzion.graphics.event.TouchEvent("over",this,touch.identifier,new nfuzion.geometry.Point(touch.clientX,touch.clientY)));
		}
		return false;
	}
	,yTransform: null
	,xTransform: null
	,vFlipped: null
	,hFlipped: null
	,backgroundDiv: null
	,borderDiv: null
	,__class__: nfuzion.graphics.Component
});
nfuzion.relation.IParent = function() { }
$hxClasses["nfuzion.relation.IParent"] = nfuzion.relation.IParent;
nfuzion.relation.IParent.__name__ = ["nfuzion","relation","IParent"];
nfuzion.relation.IParent.prototype = {
	removeChildAt: null
	,removeChild: null
	,insertChildAfter: null
	,insertChild: null
	,appendChild: null
	,getChildIndex: null
	,getChildAt: null
	,getChild: null
	,childCount: null
	,__class__: nfuzion.relation.IParent
}
nfuzion.graphics.IContainer = function() { }
$hxClasses["nfuzion.graphics.IContainer"] = nfuzion.graphics.IContainer;
nfuzion.graphics.IContainer.__name__ = ["nfuzion","graphics","IContainer"];
nfuzion.graphics.IContainer.__interfaces__ = [nfuzion.relation.IParent,nfuzion.graphics.IComponent];
nfuzion.graphics.IContainer.prototype = {
	forceTouchChildrenDisabled: null
	,childCount: null
	,getChildIndex: null
	,getChild: null
	,getChildAt: null
	,removeChildAt: null
	,removeChild: null
	,insertChildAfter: null
	,insertChild: null
	,appendChild: null
	,children: null
	,__class__: nfuzion.graphics.IContainer
}
nfuzion.graphics.Container = function(name,sketch) {
	nfuzion.graphics.Component.call(this,name,sketch);
};
$hxClasses["nfuzion.graphics.Container"] = nfuzion.graphics.Container;
nfuzion.graphics.Container.__name__ = ["nfuzion","graphics","Container"];
nfuzion.graphics.Container.__interfaces__ = [nfuzion.graphics.IContainer];
nfuzion.graphics.Container.__super__ = nfuzion.graphics.Component;
nfuzion.graphics.Container.prototype = $extend(nfuzion.graphics.Component.prototype,{
	set_screen: function(screen) {
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.set_screen(screen);
		}
		return nfuzion.graphics.Component.prototype.set_screen.call(this,screen);
	}
	,destroy: function() {
		while(this.children.length > 0) {
			var child = this.children.pop();
			this.removeChild(child);
			child.orphan();
			child.destroy();
		}
		nfuzion.graphics.Component.prototype.destroy.call(this);
	}
	,copy: function(from) {
		nfuzion.graphics.Component.prototype.copy.call(this,from);
		if(!js.Boot.__instanceof(from,nfuzion.graphics.Container)) throw "ERROR: Source component is not an instance of Container.";
		var container = from;
		var _g = 0, _g1 = container.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			var clonedChild = child.clone();
			this.appendChild(clonedChild);
		}
		this.set_forceTouchChildrenDisabled(container.forceTouchChildrenDisabled);
	}
	,clone: function() {
		var clone = new nfuzion.graphics.Container(this.name);
		clone.copy(this);
		return clone;
	}
	,set_forceTouchChildrenDisabled: function(forceTouchChildrenDisabled) {
		this.forceTouchChildrenDisabled = forceTouchChildrenDisabled;
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.set_imposeTouchDisabled(forceTouchChildrenDisabled);
		}
		return forceTouchChildrenDisabled;
	}
	,forceTouchChildrenDisabled: null
	,get_childCount: function() {
		return this.children.length;
	}
	,childCount: null
	,getChildIndex: function(child) {
		var _g1 = 0, _g = this.get_childCount();
		while(_g1 < _g) {
			var i = _g1++;
			if(this.children[i] == child) return i;
		}
		return -1;
	}
	,getChild: function(name) {
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.name == name) return child;
		}
		return null;
	}
	,getChildAt: function(index) {
		if(index >= 0 && index < this.children.length) return this.children[index];
		return null;
	}
	,removeChildAt: function(index) {
		if(index >= 0 && index < this.children.length) return this.removeChild(this.children[index]);
		return false;
	}
	,removedFromStage: function() {
		nfuzion.graphics.Component.prototype.removedFromStage.call(this);
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.removedFromStage();
		}
	}
	,addedToStage: function() {
		nfuzion.graphics.Component.prototype.addedToStage.call(this);
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.addedToStage();
		}
	}
	,removeChild: function(child) {
		var success = HxOverrides.remove(this.children,child);
		if(success) {
			this.implementation.removeChild(child.implementation);
			child.orphan();
		}
		return success;
	}
	,insertChildAfter: function(child,after) {
		var afterIndex = this.getChildIndex(after);
		if(afterIndex >= 0) {
			this.insertChild(child,afterIndex + 1);
			return true;
		}
		return false;
	}
	,insertChild: function(child,index) {
		if(index == null) index = 0;
		if(this.get_childCount() == 0 || index >= this.get_childCount()) return this.appendChild(child);
		if(index <= 0) index = 0;
		child.adopt(this);
		var bumpedChild = this.getChildAt(index);
		if(bumpedChild == null) return false;
		this.implementation.insertBefore(child.implementation,bumpedChild.implementation);
		this.children.splice(index,0,child);
		return true;
	}
	,appendChild: function(child) {
		if(child == null) return false;
		child.adopt(this);
		this.implementation.appendChild(child.implementation);
		this.children.push(child);
		return true;
	}
	,initialize: function() {
		nfuzion.graphics.Component.prototype.initialize.call(this);
		this.children = new Array();
		this.set_forceTouchChildrenDisabled(false);
	}
	,children: null
	,__class__: nfuzion.graphics.Container
	,__properties__: $extend(nfuzion.graphics.Component.prototype.__properties__,{get_childCount:"get_childCount",set_forceTouchChildrenDisabled:"set_forceTouchChildrenDisabled"})
});
nfuzion.graphics.ICanvas = function() { }
$hxClasses["nfuzion.graphics.ICanvas"] = nfuzion.graphics.ICanvas;
nfuzion.graphics.ICanvas.__name__ = ["nfuzion","graphics","ICanvas"];
nfuzion.graphics.ICanvas.prototype = {
	destroy: null
	,lineTo: null
	,moveTo: null
	,lineAlpha: null
	,linePaint: null
	,lineThickness: null
	,clear: null
	,component: null
	,__class__: nfuzion.graphics.ICanvas
}
nfuzion.graphics.IStage = function() { }
$hxClasses["nfuzion.graphics.IStage"] = nfuzion.graphics.IStage;
nfuzion.graphics.IStage.__name__ = ["nfuzion","graphics","IStage"];
nfuzion.graphics.IStage.__interfaces__ = [nfuzion.graphics.IContainer];
nfuzion.graphics.IStage.prototype = {
	touchActive: null
	,maxFrameRate: null
	,__class__: nfuzion.graphics.IStage
}
nfuzion.graphics.IText = function() { }
$hxClasses["nfuzion.graphics.IText"] = nfuzion.graphics.IText;
nfuzion.graphics.IText.__name__ = ["nfuzion","graphics","IText"];
nfuzion.graphics.IText.__interfaces__ = [nfuzion.graphics.IComponent];
nfuzion.graphics.IText.prototype = {
	manualText: null
	,selectable: null
	,editable: null
	,wrap: null
	,font: null
	,paint: null
	,__class__: nfuzion.graphics.IText
}
nfuzion.graphics.Stage = function(width,height,paint) {
	this.frameRequested = false;
	this.animating = false;
	nfuzion.graphics.Container.call(this,"stage");
	this.set_visible(false);
	this.set_touchEnabled(true);
	var style = js.Browser.document.createElement("style");
	style.type = "text/css";
	js.Browser.document.head.appendChild(style);
	style.innerHTML = "div" + "{" + "white-space: nowrap;" + "text-overflow: ellipsis;" + "top: 0px;" + "left: 0px;" + "width: 0px;" + "height: 0px;" + "-webkit-transform: translate3d(0,0,0);" + "-webkit-user-select: none;" + "-khtml-user-select: none;" + "-moz-user-select: none;" + "-ms-user-select: none;" + "-o-user-select: none;" + "user-select: none;" + "position: absolute;" + "vertical-align: text-bottom;" + "cursor: default;" + "overflow: hidden;" + "pointer-events: none;" + "}";
	this.bodyCss = js.Browser.document.createElement("style");
	this.bodyCss.type = "text/css";
	js.Browser.document.head.appendChild(this.bodyCss);
	this.touchActive = false;
	this.set_width(width);
	this.set_height(height);
	this.set_backgroundPaint(paint);
	this.requestAnimationFrame = $bind(this,this.requestAnimationFrameFallback);
	if(($_=js.Browser.window,$bind($_,$_.requestAnimationFrame)) != null) this.requestAnimationFrame = ($_=js.Browser.window,$bind($_,$_.requestAnimationFrame)); else if(window.webkitRequestAnimationFrame != null) this.requestAnimationFrame = $bind(this,this.webkitRequestAnimationFrame); else if(window.mozRequestAnimationFrame != null) this.requestAnimationFrame = window.mozRequestAnimationFrame;
};
$hxClasses["nfuzion.graphics.Stage"] = nfuzion.graphics.Stage;
nfuzion.graphics.Stage.__name__ = ["nfuzion","graphics","Stage"];
nfuzion.graphics.Stage.__interfaces__ = [nfuzion.graphics.IStage];
nfuzion.graphics.Stage.__super__ = nfuzion.graphics.Container;
nfuzion.graphics.Stage.prototype = $extend(nfuzion.graphics.Container.prototype,{
	set_visible: function(visible) {
		js.Browser.document.body.appendChild(this.implementation);
		return nfuzion.graphics.Container.prototype.set_visible.call(this,visible);
	}
	,set_backgroundPaint: function(backgroundPaint) {
		var result = nfuzion.graphics.Container.prototype.set_backgroundPaint.call(this,backgroundPaint);
		this.bodyCss.innerHTML = "html, body" + "{" + "background-color:#" + nfuzion.utility.ColorTools.toString(result.color) + ";" + "}";
		return result;
	}
	,copy: function(from) {
		throw "Illegal operation: Cannot copy Stage.";
	}
	,clone: function() {
		return null;
	}
	,onAnimationFrame: function(timestamp) {
		if(timestamp == null) timestamp = 0;
		this.frameRequested = false;
		this.dispatchEvent(new nfuzion.graphics.event.StageEvent("paint",this));
		if(this.animating) this.requestFrame();
		return true;
	}
	,onFrameDelay: function() {
		this.onAnimationFrame();
	}
	,requestAnimationFrameFallback: function(_callback) {
		this.frameDelay = new nfuzion.timer.Delay($bind(this,this.onFrameDelay),1 / 30);
		return 0;
	}
	,webkitRequestAnimationFrame: function(_callback) {
		return window.webkitRequestAnimationFrame(_callback);
	}
	,requestFrame: function() {
		if(!this.frameRequested) {
			this.frameRequested = true;
			this.requestAnimationFrame($bind(this,this.onAnimationFrame));
		}
	}
	,removeEventListener: function(type,listener,priority) {
		if(priority == null) priority = 0;
		nfuzion.graphics.Container.prototype.removeEventListener.call(this,type,listener,priority);
		if(type == "paint") {
			if(!this.hasEventListener("paint")) this.animating = false;
		}
	}
	,addEventListener: function(type,listener,priority) {
		if(priority == null) priority = 0;
		nfuzion.graphics.Container.prototype.addEventListener.call(this,type,listener,priority);
		if(type == "paint") {
			if(!this.animating) {
				this.animating = true;
				this.requestFrame();
			}
		}
	}
	,get_stage: function() {
		return nfuzion.nTactic.NTactic.stage;
	}
	,getComponent: function(implementation) {
		if(implementation == null) return null;
		var component = null;
		do {
			component = implementation.component;
			if(component == null) {
				if(js.Boot.__instanceof(implementation.parentNode,HTMLDivElement)) implementation = implementation.parentNode; else implementation = null;
			}
		} while(implementation != null && component == null);
		if(component != null) while(!component.touchEnabled && component != this.get_stage()) component = component.parent;
		return component;
	}
	,onMouseUp: function(e) {
		if(!this.touchActive && e.button == 0) {
			js.Browser.document.onmousemove = null;
			this.implementation.onmouseover = null;
			this.implementation.onmouseout = null;
			var component = null;
			if(js.Boot.__instanceof(e.target,HTMLDivElement)) component = this.getComponent(e.target);
			if(component == null) component = this;
			component.bubbleEvent(new nfuzion.graphics.event.TouchEvent("end",component,-1,new nfuzion.geometry.Point(e.clientX,e.clientY)));
		}
	}
	,onMouseOut: function(e) {
		if(!this.touchActive && e.button == 0) {
			var component = null;
			if(js.Boot.__instanceof(e.target,HTMLDivElement)) component = this.getComponent(e.target);
			if(component == null) component = this;
			component.dispatchEvent(new nfuzion.graphics.event.TouchEvent("out",component,-1,new nfuzion.geometry.Point(e.clientX,e.clientY)));
		}
	}
	,onMouseMove: function(e) {
		if(!this.touchActive) {
			var component = null;
			if(js.Boot.__instanceof(e.target,HTMLDivElement)) component = this.getComponent(e.target);
			if(component == null) component = this;
			component.bubbleEvent(new nfuzion.graphics.event.TouchEvent("move",component,-1,new nfuzion.geometry.Point(e.clientX,e.clientY)));
		}
	}
	,onMouseOver: function(e) {
		if(!this.touchActive && e.button == 0) {
			var component = null;
			if(js.Boot.__instanceof(e.target,HTMLDivElement)) component = this.getComponent(e.target);
			if(component == null) component = this;
			component.dispatchEvent(new nfuzion.graphics.event.TouchEvent("over",component,-1,new nfuzion.geometry.Point(e.clientX,e.clientY)));
		}
	}
	,onMouseDown: function(e) {
		if(!this.touchActive && e.button == 0) {
			js.Browser.document.onmousemove = $bind(this,this.onMouseMove);
			this.implementation.onmouseover = $bind(this,this.onMouseOver);
			this.implementation.onmouseout = $bind(this,this.onMouseOut);
			var component = null;
			if(js.Boot.__instanceof(e.target,HTMLDivElement)) component = this.getComponent(e.target);
			if(component == null) component = this;
			component.bubbleEvent(new nfuzion.graphics.event.TouchEvent("begin",component,-1,new nfuzion.geometry.Point(e.clientX,e.clientY)));
		}
	}
	,onTouchEnd: function(e) {
		if(e.touches.length <= 0) this.touchActive = false;
		e.stopPropagation();
		e.preventDefault();
		var _g1 = 0, _g = e.changedTouches.length;
		while(_g1 < _g) {
			var i = _g1++;
			var touch = e.changedTouches.item(i);
			var point = new nfuzion.geometry.Point(touch.clientX,touch.clientY);
			var target = js.Browser.document.elementFromPoint(touch.clientX,touch.clientY);
			var component = this.getComponent(target);
			if(component == null) component = this;
			component.bubbleEvent(new nfuzion.graphics.event.TouchEvent("end",component,touch.identifier,point));
		}
		return false;
	}
	,onTouchCancel: function(e) {
		return this.onTouchEnd(e);
	}
	,onTouchMove: function(e) {
		e.stopPropagation();
		e.preventDefault();
		var _g1 = 0, _g = e.changedTouches.length;
		while(_g1 < _g) {
			var i = _g1++;
			var touch = e.changedTouches.item(i);
			var point = new nfuzion.geometry.Point(touch.clientX,touch.clientY);
			var target = e.target;
			var component = this.getComponent(target);
			if(component == null) component = this;
			component.bubbleEvent(new nfuzion.graphics.event.TouchEvent("move",component,touch.identifier,point));
		}
		return false;
	}
	,onTouchStart: function(e) {
		this.touchActive = true;
		e.stopPropagation();
		e.preventDefault();
		var _g1 = 0, _g = e.changedTouches.length;
		while(_g1 < _g) {
			var i = _g1++;
			var touch = e.changedTouches.item(i);
			var point = new nfuzion.geometry.Point(touch.clientX,touch.clientY);
			var target = js.Browser.document.elementFromPoint(touch.clientX,touch.clientY);
			var component = this.getComponent(target);
			if(component == null) component = this;
			component.bubbleEvent(new nfuzion.graphics.event.TouchEvent("begin",component,touch.identifier,point));
		}
		return false;
	}
	,initialize: function() {
		this.implementation.addEventListener("touchstart",$bind(this,this.onTouchStart),false);
		this.implementation.addEventListener("touchmove",$bind(this,this.onTouchMove),false);
		this.implementation.addEventListener("touchend",$bind(this,this.onTouchEnd),false);
		this.implementation.addEventListener("touchcancel",$bind(this,this.onTouchCancel),false);
		this.implementation.onmousedown = $bind(this,this.onMouseDown);
		js.Browser.document.onmouseup = $bind(this,this.onMouseUp);
		nfuzion.graphics.Container.prototype.initialize.call(this);
	}
	,frameRequested: null
	,animating: null
	,requestAnimationFrame: null
	,touchActive: null
	,maxFrameRate: null
	,bodyCss: null
	,frameDelay: null
	,__class__: nfuzion.graphics.Stage
});
nfuzion.graphics.Text = function(name,sketch) {
	if(name == null) name = "";
	this.selectable = false;
	this.editable = false;
	this.wrap = false;
	this.textNode = js.Browser.document.createTextNode("");
	nfuzion.graphics.Component.call(this,name,sketch);
	this.implementation.appendChild(this.textNode);
};
$hxClasses["nfuzion.graphics.Text"] = nfuzion.graphics.Text;
nfuzion.graphics.Text.__name__ = ["nfuzion","graphics","Text"];
nfuzion.graphics.Text.__interfaces__ = [nfuzion.graphics.IText];
nfuzion.graphics.Text.__super__ = nfuzion.graphics.Component;
nfuzion.graphics.Text.prototype = $extend(nfuzion.graphics.Component.prototype,{
	set_selectable: function(selectable) {
		this.selectable = selectable;
		return this.selectable;
	}
	,selectable: null
	,set_editable: function(editable) {
		this.editable = editable;
		return this.editable;
	}
	,editable: null
	,destroy: function() {
		nfuzion.graphics.Component.prototype.destroy.call(this);
	}
	,onPaintChange: function(e) {
		nfuzion.graphics.Component.prototype.onPaintChange.call(this,e);
		var paint = e.target;
		if(paint == this.paint) this.set_paint(this.paint);
	}
	,disusePaints: function() {
		nfuzion.graphics.Component.prototype.disusePaints.call(this);
		this.disusePaint(this.paint);
	}
	,usePaints: function() {
		nfuzion.graphics.Component.prototype.usePaints.call(this);
		this.usePaint(this.paint);
	}
	,copy: function(from) {
		nfuzion.graphics.Component.prototype.copy.call(this,from);
		if(!js.Boot.__instanceof(from,nfuzion.graphics.Text)) throw "ERROR: Source component is not an instance of Text.";
		var text = from;
		this.set_alignment(text.alignment);
		this.set_text(text.get_text());
		this.set_paint(text.paint);
		this.set_font(text.font);
	}
	,clone: function() {
		var clone = new nfuzion.graphics.Text(this.name);
		clone.copy(this);
		return clone;
	}
	,set_wrap: function(wrap) {
		if(wrap != this.wrap) {
			this.wrap = wrap;
			if(wrap) this.implementation.style.whiteSpace = "normal"; else this.implementation.style.whiteSpace = "nowrap";
		}
		return this.wrap;
	}
	,wrap: null
	,set_font: function(font) {
		if(font != null) {
			this.font = font;
			this.implementation.className = font.cssName;
		} else haxe.Log.trace("ERROR: Cannot set font to null.",{ fileName : "Text.hx", lineNumber : 132, className : "nfuzion.graphics.Text", methodName : "set_font"});
		return this.font;
	}
	,font: null
	,set_paint: function(paint) {
		if(this.paint != paint) {
			this.disusePaint(this.paint);
			this.paint = paint;
			this.usePaint(this.paint);
		}
		this.implementation.style.color = "#" + nfuzion.utility.ColorTools.toString(paint.color);
		return paint;
	}
	,paint: null
	,set_text: function(text) {
		this.manualText = true;
		this.textNode.data = text;
		return text;
	}
	,get_text: function() {
		return this.textNode.data;
	}
	,set_alignment: function(alignment) {
		this.alignment = alignment;
		this.implementation.style.textAlign = Std.string(alignment);
		return alignment;
	}
	,alignment: null
	,initialize: function() {
		nfuzion.graphics.Component.prototype.initialize.call(this);
		this.manualText = false;
		this.set_paint(new nfuzion.paint.Paint());
	}
	,create: function() {
		nfuzion.graphics.Component.prototype.create.call(this);
		this.set_alignment(nfuzion.type.Alignment.left);
	}
	,textNode: null
	,manualText: null
	,__class__: nfuzion.graphics.Text
	,__properties__: $extend(nfuzion.graphics.Component.prototype.__properties__,{set_alignment:"set_alignment",set_text:"set_text",get_text:"get_text",set_paint:"set_paint",set_font:"set_font",set_wrap:"set_wrap",set_editable:"set_editable",set_selectable:"set_selectable"})
});
nfuzion.graphics.event = {}
nfuzion.graphics.event.ComponentEvent = function(type,target) {
	nfuzion.event.Event.call(this,type);
	this.target = target;
};
$hxClasses["nfuzion.graphics.event.ComponentEvent"] = nfuzion.graphics.event.ComponentEvent;
nfuzion.graphics.event.ComponentEvent.__name__ = ["nfuzion","graphics","event","ComponentEvent"];
nfuzion.graphics.event.ComponentEvent.__super__ = nfuzion.event.Event;
nfuzion.graphics.event.ComponentEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	target: null
	,__class__: nfuzion.graphics.event.ComponentEvent
});
nfuzion.graphics.event.StageEvent = function(type,target) {
	nfuzion.event.Event.call(this,type);
	this.target = target;
};
$hxClasses["nfuzion.graphics.event.StageEvent"] = nfuzion.graphics.event.StageEvent;
nfuzion.graphics.event.StageEvent.__name__ = ["nfuzion","graphics","event","StageEvent"];
nfuzion.graphics.event.StageEvent.__super__ = nfuzion.event.Event;
nfuzion.graphics.event.StageEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	target: null
	,__class__: nfuzion.graphics.event.StageEvent
});
nfuzion.graphics.event.TouchEvent = function(type,target,id,global,timestamp,bubbles) {
	if(bubbles == null) bubbles = true;
	if(timestamp == null) timestamp = 0;
	nfuzion.event.BubblingEvent.call(this,type,bubbles);
	this.target = target;
	this.id = id;
	this.global = global;
	this.local = target.globalToLocal(global);
	this.timestamp = timestamp;
};
$hxClasses["nfuzion.graphics.event.TouchEvent"] = nfuzion.graphics.event.TouchEvent;
nfuzion.graphics.event.TouchEvent.__name__ = ["nfuzion","graphics","event","TouchEvent"];
nfuzion.graphics.event.TouchEvent.__super__ = nfuzion.event.BubblingEvent;
nfuzion.graphics.event.TouchEvent.prototype = $extend(nfuzion.event.BubblingEvent.prototype,{
	timestamp: null
	,local: null
	,global: null
	,id: null
	,target: null
	,__class__: nfuzion.graphics.event.TouchEvent
});
nfuzion.graphics.type = {}
nfuzion.graphics.type.Fit = $hxClasses["nfuzion.graphics.type.Fit"] = { __ename__ : ["nfuzion","graphics","type","Fit"], __constructs__ : ["none","coverAll","containAll","stretchAll","tileAll","cover","contain","stretch","tile"] }
nfuzion.graphics.type.Fit.none = ["none",0];
nfuzion.graphics.type.Fit.none.toString = $estr;
nfuzion.graphics.type.Fit.none.__enum__ = nfuzion.graphics.type.Fit;
nfuzion.graphics.type.Fit.coverAll = ["coverAll",1];
nfuzion.graphics.type.Fit.coverAll.toString = $estr;
nfuzion.graphics.type.Fit.coverAll.__enum__ = nfuzion.graphics.type.Fit;
nfuzion.graphics.type.Fit.containAll = ["containAll",2];
nfuzion.graphics.type.Fit.containAll.toString = $estr;
nfuzion.graphics.type.Fit.containAll.__enum__ = nfuzion.graphics.type.Fit;
nfuzion.graphics.type.Fit.stretchAll = ["stretchAll",3];
nfuzion.graphics.type.Fit.stretchAll.toString = $estr;
nfuzion.graphics.type.Fit.stretchAll.__enum__ = nfuzion.graphics.type.Fit;
nfuzion.graphics.type.Fit.tileAll = ["tileAll",4];
nfuzion.graphics.type.Fit.tileAll.toString = $estr;
nfuzion.graphics.type.Fit.tileAll.__enum__ = nfuzion.graphics.type.Fit;
nfuzion.graphics.type.Fit.cover = ["cover",5];
nfuzion.graphics.type.Fit.cover.toString = $estr;
nfuzion.graphics.type.Fit.cover.__enum__ = nfuzion.graphics.type.Fit;
nfuzion.graphics.type.Fit.contain = ["contain",6];
nfuzion.graphics.type.Fit.contain.toString = $estr;
nfuzion.graphics.type.Fit.contain.__enum__ = nfuzion.graphics.type.Fit;
nfuzion.graphics.type.Fit.stretch = ["stretch",7];
nfuzion.graphics.type.Fit.stretch.toString = $estr;
nfuzion.graphics.type.Fit.stretch.__enum__ = nfuzion.graphics.type.Fit;
nfuzion.graphics.type.Fit.tile = ["tile",8];
nfuzion.graphics.type.Fit.tile.toString = $estr;
nfuzion.graphics.type.Fit.tile.__enum__ = nfuzion.graphics.type.Fit;
nfuzion.image = {}
nfuzion.image.IImage = function() { }
$hxClasses["nfuzion.image.IImage"] = nfuzion.image.IImage;
nfuzion.image.IImage.__name__ = ["nfuzion","image","IImage"];
nfuzion.image.IImage.__interfaces__ = [nfuzion.event.IEventDispatcher];
nfuzion.image.IImage.prototype = {
	project: null
	,useCount: null
	,height: null
	,width: null
	,failed: null
	,ready: null
	,url: null
	,__class__: nfuzion.image.IImage
}
nfuzion.image.Image = function(url) {
	nfuzion.event.EventDispatcher.call(this);
	this.url = url;
	this.ready = false;
	this.width = 0;
	this.height = 0;
	this.useCount = 0;
	this.loadAttempts = 0;
	this.implementation = js.Browser.document.createElement("img");
	this.implementation.onload = $bind(this,this.onLoad);
	this.implementation.onerror = $bind(this,this.onError);
	this.load();
};
$hxClasses["nfuzion.image.Image"] = nfuzion.image.Image;
nfuzion.image.Image.__name__ = ["nfuzion","image","Image"];
nfuzion.image.Image.__interfaces__ = [nfuzion.image.IImage];
nfuzion.image.Image.__super__ = nfuzion.event.EventDispatcher;
nfuzion.image.Image.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	project: function(target) {
		return false;
	}
	,onError: function(e) {
		this.failed = true;
		this.ready = false;
		this.dispatchEvent(new nfuzion.image.event.ImageEvent("ImageEvent.error",this));
		if(this.loadAttempts < 5) {
			this.implementation.src = null;
			this.load();
		}
	}
	,onLoad: function(e) {
		this.ready = true;
		this.failed = false;
		this.width = this.implementation.width;
		this.height = this.implementation.height;
		this.dispatchEvent(new nfuzion.image.event.ImageEvent("ImageEvent.ready",this));
	}
	,load: function() {
		this.loadAttempts++;
		this.implementation.src = this.url;
	}
	,loadAttempts: null
	,implementation: null
	,useCount: null
	,height: null
	,width: null
	,failed: null
	,ready: null
	,url: null
	,__class__: nfuzion.image.Image
});
nfuzion.image.ImageLoader = function(url,component,fit,timeout) {
	nfuzion.event.EventDispatcher.call(this);
	this.url = url;
	this.component = component;
	this.fit = fit;
	this.timeout = timeout;
	this.complete = false;
	this.tinyUrl = HxOverrides.substr(url,url.lastIndexOf("/") + 1,null);
	this.load();
};
$hxClasses["nfuzion.image.ImageLoader"] = nfuzion.image.ImageLoader;
nfuzion.image.ImageLoader.__name__ = ["nfuzion","image","ImageLoader"];
nfuzion.image.ImageLoader.__super__ = nfuzion.event.EventDispatcher;
nfuzion.image.ImageLoader.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	destroy: function() {
		if(!this.complete) nfuzion.nTactic.NTactic.imageManager.remove(this.url);
		if(this.image != null) {
			this.image.removeEventListener("ImageEvent.ready",$bind(this,this.onImageEvent));
			this.image.removeEventListener("ImageEvent.error",$bind(this,this.onImageEvent));
		}
		if(this.delay != null) {
			this.delay.destroy();
			this.delay = null;
		}
		this.image = null;
		this.component = null;
	}
	,onComplete: function() {
		this.complete = true;
		this.dispatchEvent(new nfuzion.image.event.ImageLoaderEvent("ImageLoaderEvent.complete",this));
	}
	,setDefaultImage: function() {
		this.component.gotoDefault();
	}
	,setImage: function() {
		this.component.set_backgroundUrl(this.url);
		this.component.set_backgroundFit(this.fit);
	}
	,onDelayTimer: function() {
		this.delay.destroy();
		this.delay = null;
		this.setDefaultImage();
	}
	,onImageEvent: function(e) {
		if(this.delay != null) this.delay.destroy();
		e.target.removeEventListener("ImageEvent.ready",$bind(this,this.onImageEvent));
		e.target.removeEventListener("ImageEvent.error",$bind(this,this.onImageEvent));
		if(e.type == "ImageEvent.ready") this.setImage(); else this.setDefaultImage();
		nfuzion.nTactic.NTactic.imageManager.remove(this.url);
		this.onComplete();
	}
	,load: function() {
		this.image = nfuzion.nTactic.NTactic.imageManager.cite(this.url);
		if(this.image != null && this.image.ready) {
			this.setImage();
			this.onComplete();
		} else {
			this.image = nfuzion.nTactic.NTactic.imageManager.add(this.url);
			if(!this.image.ready) {
				this.image.addEventListener("ImageEvent.ready",$bind(this,this.onImageEvent));
				this.image.addEventListener("ImageEvent.error",$bind(this,this.onImageEvent));
				if(this.image.failed) {
					this.setDefaultImage();
					nfuzion.nTactic.NTactic.imageManager.remove(this.url);
				} else if(this.timeout != null) this.delay = new nfuzion.timer.Delay($bind(this,this.onDelayTimer),this.timeout);
			} else {
				this.setImage();
				nfuzion.nTactic.NTactic.imageManager.remove(this.url);
				this.onComplete();
			}
		}
	}
	,tinyUrl: null
	,delay: null
	,image: null
	,complete: null
	,timeout: null
	,component: null
	,fit: null
	,url: null
	,__class__: nfuzion.image.ImageLoader
});
nfuzion.image.ImageManager = function() {
	this.images = new haxe.ds.StringMap();
};
$hxClasses["nfuzion.image.ImageManager"] = nfuzion.image.ImageManager;
nfuzion.image.ImageManager.__name__ = ["nfuzion","image","ImageManager"];
nfuzion.image.ImageManager.prototype = {
	remove: function(url) {
		if(url != null) {
			var image = this.images.get(url);
			if(image == null) return null;
			image.useCount--;
			if(image.useCount <= 0) this.images.remove(url);
			return image;
		}
		return null;
	}
	,cite: function(url) {
		var image = this.images.get(url);
		return image;
	}
	,add: function(url) {
		if(url != null) {
			var image = this.images.get(url);
			if(image == null) {
				image = new nfuzion.image.Image(url);
				this.images.set(url,image);
			}
			image.useCount++;
			return image;
		}
		return null;
	}
	,images: null
	,__class__: nfuzion.image.ImageManager
}
nfuzion.image.event = {}
nfuzion.image.event.ImageEvent = function(type,target) {
	nfuzion.event.Event.call(this,type);
	this.target = target;
};
$hxClasses["nfuzion.image.event.ImageEvent"] = nfuzion.image.event.ImageEvent;
nfuzion.image.event.ImageEvent.__name__ = ["nfuzion","image","event","ImageEvent"];
nfuzion.image.event.ImageEvent.__super__ = nfuzion.event.Event;
nfuzion.image.event.ImageEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	target: null
	,__class__: nfuzion.image.event.ImageEvent
});
nfuzion.image.event.ImageLoaderEvent = function(type,imageLoader) {
	nfuzion.event.Event.call(this,type);
	this.imageLoader = imageLoader;
};
$hxClasses["nfuzion.image.event.ImageLoaderEvent"] = nfuzion.image.event.ImageLoaderEvent;
nfuzion.image.event.ImageLoaderEvent.__name__ = ["nfuzion","image","event","ImageLoaderEvent"];
nfuzion.image.event.ImageLoaderEvent.__super__ = nfuzion.event.Event;
nfuzion.image.event.ImageLoaderEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	imageLoader: null
	,__class__: nfuzion.image.event.ImageLoaderEvent
});
nfuzion.layout = {}
nfuzion.layout.ILayout = function() { }
$hxClasses["nfuzion.layout.ILayout"] = nfuzion.layout.ILayout;
nfuzion.layout.ILayout.__name__ = ["nfuzion","layout","ILayout"];
nfuzion.layout.ILayout.__interfaces__ = [nfuzion.event.IListenerManager,nfuzion.event.IEventDispatcher];
nfuzion.layout.ILayout.prototype = {
	detach: null
	,attach: null
	,__class__: nfuzion.layout.ILayout
}
nfuzion.layout.BaseLayout = function() {
	nfuzion.event.ListenerManagerAndEventDispatcher.call(this);
};
$hxClasses["nfuzion.layout.BaseLayout"] = nfuzion.layout.BaseLayout;
nfuzion.layout.BaseLayout.__name__ = ["nfuzion","layout","BaseLayout"];
nfuzion.layout.BaseLayout.__interfaces__ = [nfuzion.layout.ILayout];
nfuzion.layout.BaseLayout.__super__ = nfuzion.event.ListenerManagerAndEventDispatcher;
nfuzion.layout.BaseLayout.prototype = $extend(nfuzion.event.ListenerManagerAndEventDispatcher.prototype,{
	componentAttached: function() {
		return true;
	}
	,componentDetaching: function() {
		this.detachAllListeners();
	}
	,detach: function() {
		if(this.component != null) {
			this.componentDetaching();
			if(this.component.layout != null) this.component.set_layout(null);
		}
		this.component = null;
	}
	,attach: function(component) {
		if(component == null) haxe.Log.trace("ERROR: Cannot attach a null component to a layout.",{ fileName : "BaseLayout.hx", lineNumber : 20, className : "nfuzion.layout.BaseLayout", methodName : "attach"});
		if(this.component != component) {
			this.detach();
			this.component = component;
			return this.componentAttached();
		}
		return true;
	}
	,component: null
	,__class__: nfuzion.layout.BaseLayout
});
nfuzion.layout.SnapParentEdges = function(snapLeft,snapRight,snapTop,snapBottom,useScaling) {
	if(useScaling == null) useScaling = false;
	if(snapBottom == null) snapBottom = true;
	if(snapTop == null) snapTop = true;
	if(snapRight == null) snapRight = true;
	if(snapLeft == null) snapLeft = true;
	nfuzion.layout.BaseLayout.call(this);
	this.snapLeft = snapLeft;
	this.snapRight = snapRight;
	this.snapTop = snapTop;
	this.snapBottom = snapBottom;
	this.useScaling = useScaling;
};
$hxClasses["nfuzion.layout.SnapParentEdges"] = nfuzion.layout.SnapParentEdges;
nfuzion.layout.SnapParentEdges.__name__ = ["nfuzion","layout","SnapParentEdges"];
nfuzion.layout.SnapParentEdges.__super__ = nfuzion.layout.BaseLayout;
nfuzion.layout.SnapParentEdges.prototype = $extend(nfuzion.layout.BaseLayout.prototype,{
	onBoxChanged: function(e) {
		this.update();
	}
	,apply: function() {
		if(this.snapLeft) this.component.set_x(0);
		if(this.snapTop) this.component.set_y(0);
		if(this.snapRight) this.component.set_right(this.component.parent._width - 1);
		if(this.snapBottom) this.component.set_bottom(this.component.parent._height - 1);
		if(this.useScaling) this.applyScaling();
	}
	,update: function() {
		if(this.component.parent != null) {
			this.detachListener(this.component,"change",$bind(this,this.onBoxChanged));
			this.apply();
			this.attachListener(this.component,"change",$bind(this,this.onBoxChanged));
		}
	}
	,applyScaling: function() {
		this.component.set_xScale(this.component._width / this.originalWidth);
		this.component.set_yScale(this.component._height / this.originalHeight);
	}
	,onSizeChanged: function(e) {
		this.onBoxChanged();
	}
	,onAdopted: function(e) {
		this.attachListener(this.component.parent,"changeSize",$bind(this,this.onSizeChanged));
		this.onSizeChanged();
	}
	,onOrphaning: function(e) {
		this.detachListener(this.component.parent,"changeSize",$bind(this,this.onSizeChanged));
	}
	,componentAttached: function() {
		this.originalWidth = this.component._width;
		this.originalHeight = this.component._height;
		this.attachListener(this.component,"orphaning",$bind(this,this.onOrphaning));
		this.attachListener(this.component,"adopted",$bind(this,this.onAdopted));
		this.attachListener(this.component,"change",$bind(this,this.onBoxChanged));
		if(this.component.parent != null) this.onAdopted();
		this.update();
		return true;
	}
	,originalHeight: null
	,originalWidth: null
	,useScaling: null
	,snapBottom: null
	,snapTop: null
	,snapRight: null
	,snapLeft: null
	,__class__: nfuzion.layout.SnapParentEdges
});
nfuzion.limits = {}
nfuzion.limits.IntLimits = function() { }
$hxClasses["nfuzion.limits.IntLimits"] = nfuzion.limits.IntLimits;
nfuzion.limits.IntLimits.__name__ = ["nfuzion","limits","IntLimits"];
nfuzion.lingo = {}
nfuzion.lingo.ILingo = function() { }
$hxClasses["nfuzion.lingo.ILingo"] = nfuzion.lingo.ILingo;
nfuzion.lingo.ILingo.__name__ = ["nfuzion","lingo","ILingo"];
nfuzion.lingo.ILingo.prototype = {
	from: null
	,to: null
	,__class__: nfuzion.lingo.ILingo
}
nfuzion.lingo.HaxeLingo = function() {
};
$hxClasses["nfuzion.lingo.HaxeLingo"] = nfuzion.lingo.HaxeLingo;
nfuzion.lingo.HaxeLingo.__name__ = ["nfuzion","lingo","HaxeLingo"];
nfuzion.lingo.HaxeLingo.__interfaces__ = [nfuzion.lingo.ILingo];
nfuzion.lingo.HaxeLingo.prototype = {
	from: function(serializedMessage) {
		return haxe.Unserializer.run(serializedMessage);
	}
	,to: function(instance) {
		return haxe.Serializer.run(instance);
	}
	,__class__: nfuzion.lingo.HaxeLingo
}
nfuzion.lingo.JsonLingo = function(alphabeticalOrder,pad,lineEnd,impliedClassPrefix) {
	if(impliedClassPrefix == null) impliedClassPrefix = "nfuzion.message.";
	if(lineEnd == null) lineEnd = "\n";
	if(pad == null) pad = "  ";
	if(alphabeticalOrder == null) alphabeticalOrder = true;
	this.alphabeticalOrder = alphabeticalOrder;
	this.pad = pad;
	this.lineEnd = lineEnd;
	this.impliedClassPrefix = impliedClassPrefix;
};
$hxClasses["nfuzion.lingo.JsonLingo"] = nfuzion.lingo.JsonLingo;
nfuzion.lingo.JsonLingo.__name__ = ["nfuzion","lingo","JsonLingo"];
nfuzion.lingo.JsonLingo.__interfaces__ = [nfuzion.lingo.ILingo];
nfuzion.lingo.JsonLingo.prototype = {
	trimComma: function(serial) {
		serial = StringTools.ltrim(serial);
		if(serial != null && serial.charAt(0) == ",") serial = HxOverrides.substr(serial,1,null);
		return serial;
	}
	,arrayFrom: function(serial,array,itemClass) {
		while(!this.closesWith(serial,"]")) {
			var transport = { item : null};
			serial = "\"item\":" + serial;
			serial = this.propertyFrom(serial,transport,itemClass.slice());
			if(serial != null) array.push(transport.item); else return null;
			serial = this.trimComma(serial);
		}
		return serial;
	}
	,propertyFrom: function(serial,parentInstance,propertyClassArray) {
		var name = this.getQuotedString(serial);
		serial = this.trimToChar(serial,":");
		if(serial == null) {
			haxe.Log.trace("Property name not followed by ':'",{ fileName : "JsonLingo.hx", lineNumber : 387, className : "nfuzion.lingo.JsonLingo", methodName : "propertyFrom"});
			return null;
		}
		var propertyType = this.getValueType(serial);
		if(propertyType == null) {
			haxe.Log.trace("Could not determine type of property: '" + name + "'",{ fileName : "JsonLingo.hx", lineNumber : 394, className : "nfuzion.lingo.JsonLingo", methodName : "propertyFrom"});
			return null;
		}
		if(propertyClassArray == null && js.Boot.__instanceof(parentInstance,nfuzion.message.generic.base.Base)) {
			var base = parentInstance;
			propertyClassArray = base.getPropertyType(name);
		}
		if(propertyClassArray == null) {
			haxe.Log.trace("Failed to get property class array.",{ fileName : "JsonLingo.hx", lineNumber : 405, className : "nfuzion.lingo.JsonLingo", methodName : "propertyFrom"});
			return null;
		}
		var propertyClass = propertyClassArray.shift();
		switch(propertyClass) {
		case Array:
			if(propertyType == nfuzion.lingo.type.PropertyType.array) {
				var array = new Array();
				serial = this.trimToChar(serial,"[");
				if(serial != null) serial = this.arrayFrom(serial,array,propertyClassArray);
				serial = this.trimToChar(serial,"]");
				if(serial == null) {
					haxe.Log.trace("Error parsing array.",{ fileName : "JsonLingo.hx", lineNumber : 425, className : "nfuzion.lingo.JsonLingo", methodName : "propertyFrom"});
					return null;
				}
				Reflect.setProperty(parentInstance,name,array);
			} else {
				haxe.Log.trace("Message type and class do not match.",{ fileName : "JsonLingo.hx", lineNumber : 432, className : "nfuzion.lingo.JsonLingo", methodName : "propertyFrom"});
				return null;
			}
			break;
		case Bool:
			StringTools.ltrim(serial);
			var value = StringTools.startsWith(serial,"true");
			parentInstance[name] = value;
			if(value) serial = HxOverrides.substr(serial,4,null); else serial = HxOverrides.substr(serial,5,null);
			break;
		case Int:
			var propertyValue = this.getNumber(serial);
			serial = this.removeNumber(serial);
			parentInstance[name] = Std.parseInt(propertyValue);
			break;
		case Float:
			var propertyValue = this.getNumber(serial);
			serial = this.removeNumber(serial);
			parentInstance[name] = Std.parseFloat(propertyValue);
			break;
		case String:
			var propertyValue = this.getQuotedString(serial);
			serial = this.removeQuotedString(serial);
			parentInstance[name] = StringTools.urlDecode(propertyValue);
			break;
		default:
			switch( (propertyType)[1] ) {
			case 4:
				var instance = Type.createEmptyInstance(propertyClass);
				if(instance != null) {
					serial = this.trimToChar(serial,"{");
					if(serial != null) serial = this.propertiesFrom(serial,instance);
					if(serial != null) serial = this.trimToChar(serial,"}");
					if(serial == null) instance = null;
					parentInstance[name] = instance;
				}
				if(instance == null) {
					haxe.Log.trace("Failed to create class.",{ fileName : "JsonLingo.hx", lineNumber : 485, className : "nfuzion.lingo.JsonLingo", methodName : "propertyFrom"});
					return null;
				}
				break;
			case 3:
				var propertyValue = this.getQuotedString(serial);
				serial = this.removeQuotedString(serial);
				parentInstance[name] = Type.createEnum(propertyClass,propertyValue);
				break;
			default:
				haxe.Log.trace("Unhandled type \"" + Std.string(propertyType) + "\" in class.",{ fileName : "JsonLingo.hx", lineNumber : 493, className : "nfuzion.lingo.JsonLingo", methodName : "propertyFrom"});
				return null;
			}
		}
		return serial;
	}
	,propertiesFrom: function(serial,instance) {
		while(serial != null && !this.closesWith(serial,"}")) {
			serial = this.propertyFrom(serial,instance);
			if(serial == null) break;
			serial = this.trimComma(serial);
		}
		return serial;
	}
	,closesWith: function(serial,$char) {
		if(serial != null) {
			serial = StringTools.ltrim(serial);
			return StringTools.startsWith(serial,$char);
		}
		return false;
	}
	,getValueType: function(serial) {
		var type = null;
		serial = StringTools.ltrim(serial);
		var _g = serial.charAt(0);
		switch(_g) {
		case "t":case "f":
			type = nfuzion.lingo.type.PropertyType["boolean"];
			break;
		case "\"":
			type = nfuzion.lingo.type.PropertyType.string;
			break;
		case "[":
			type = nfuzion.lingo.type.PropertyType.array;
			break;
		case "{":
			type = nfuzion.lingo.type.PropertyType.structure;
			break;
		case "-":case "0":case "1":case "2":case "3":case "4":case "5":case "6":case "7":case "8":case "9":
			type = nfuzion.lingo.type.PropertyType.number;
			break;
		}
		return type;
	}
	,trimToChar: function(serial,$char) {
		if(serial != null) {
			var string = null;
			var index = serial.indexOf($char);
			if(index >= 0) return HxOverrides.substr(serial,index + 1,null);
		}
		return null;
	}
	,removeNumber: function(serial) {
		var index = 0;
		serial = StringTools.trim(serial);
		try {
			while(index < serial.length) {
				var _g = serial.charAt(index);
				switch(_g) {
				case "}":case "]":case " ":case "\n":case ",":
					throw "__break__";
					break;
				default:
				}
				index++;
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		if(index < serial.length) return HxOverrides.substr(serial,index,null);
		return null;
	}
	,getNumber: function(serial) {
		var index = 0;
		serial = StringTools.trim(serial);
		try {
			while(index < serial.length) {
				var _g = serial.charAt(index);
				switch(_g) {
				case "}":case "]":case " ":case "\n":case ",":
					throw "__break__";
					break;
				default:
				}
				index++;
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		if(index < serial.length) return HxOverrides.substr(serial,0,index);
		return null;
	}
	,removeQuotedString: function(serial) {
		var string = null;
		serial = this.trimToChar(serial,"\"");
		if(serial != null) {
			var index = serial.indexOf("\"");
			if(index >= 0) serial = HxOverrides.substr(serial,index + 1,null);
		}
		return serial;
	}
	,getQuotedString: function(serial) {
		var string = null;
		serial = this.trimToChar(serial,"\"");
		if(serial != null) {
			var index = serial.indexOf("\"");
			if(index >= 0) {
				string = HxOverrides.substr(serial,0,index);
				serial = HxOverrides.substr(serial,index,null);
			}
		}
		return string;
	}
	,from: function(serializedMessage) {
		if(serializedMessage == null) return null;
		serializedMessage = StringTools.replace(serializedMessage,"\n","");
		if(serializedMessage.charAt(0) == "{") {
			if(serializedMessage.length - serializedMessage.lastIndexOf("}") > 2) haxe.Log.trace("WARNING: Data possibly being ignored in serialized message",{ fileName : "JsonLingo.hx", lineNumber : 185, className : "nfuzion.lingo.JsonLingo", methodName : "from"});
			serializedMessage = serializedMessage.substring(1,serializedMessage.lastIndexOf("}"));
		}
		var className = this.impliedClassPrefix + this.getQuotedString(serializedMessage);
		var cls = Type.resolveClass(className);
		var message;
		try {
			message = Type.createEmptyInstance(cls);
		} catch( e ) {
			return null;
		}
		serializedMessage = this.trimToChar(serializedMessage,"{");
		if(serializedMessage == null) {
			haxe.Log.trace("Root element is not an object.",{ fileName : "JsonLingo.hx", lineNumber : 216, className : "nfuzion.lingo.JsonLingo", methodName : "from"});
			return null;
		}
		serializedMessage = this.propertiesFrom(serializedMessage,message);
		if(!this.closesWith(serializedMessage,"}")) {
			haxe.Log.trace("Root object does not have closing bracket..",{ fileName : "JsonLingo.hx", lineNumber : 224, className : "nfuzion.lingo.JsonLingo", methodName : "from"});
			return null;
		}
		serializedMessage = this.trimToChar(serializedMessage,"}");
		StringTools.ltrim(serializedMessage);
		if(serializedMessage.length > 0) {
			haxe.Log.trace("Extra data found in serialized message.",{ fileName : "JsonLingo.hx", lineNumber : 234, className : "nfuzion.lingo.JsonLingo", methodName : "from"});
			return null;
		}
		return message;
	}
	,sortString: function(a,b) {
		return a < b?-1:a > b?1:0;
	}
	,propertyTo: function(property,propertyName,padding) {
		var serializedProperty = padding + this.pad;
		var fieldName = "";
		if(propertyName != null && propertyName != "") fieldName += "\"" + propertyName + "\":";
		var _g = Type["typeof"](property);
		var $e = (_g);
		switch( $e[1] ) {
		case 1:
		case 2:
			serializedProperty += fieldName + Std.string(property);
			break;
		case 7:
			var e = $e[2];
			serializedProperty += fieldName + "\"" + Std.string(property) + "\"";
			break;
		case 6:
			var c = $e[2];
			if(js.Boot.__instanceof(property,String)) serializedProperty += fieldName + "\"" + StringTools.urlEncode(Std.string(property)) + "\""; else if(js.Boot.__instanceof(property,Array)) {
				if(fieldName != "") serializedProperty += fieldName + this.lineEnd + padding + this.pad + "["; else serializedProperty += "[";
				var first = true;
				var _g1 = 0, _g2 = js.Boot.__cast(property , Array);
				while(_g1 < _g2.length) {
					var item = _g2[_g1];
					++_g1;
					var propertyString = this.propertyTo(item,"",padding + this.pad);
					if(propertyString != null) {
						if(!first) serializedProperty += ",";
						first = false;
						serializedProperty += this.lineEnd + propertyString;
					}
				}
				serializedProperty += this.lineEnd + padding + this.pad + "]";
			} else if(js.Boot.__instanceof(property,nfuzion.message.generic.type.TypeClass)) serializedProperty += this.classTo(property,propertyName,padding + this.pad); else {
			}
			break;
		case 3:
			serializedProperty += fieldName + (property == true?"true":"false");
			break;
		default:
			return null;
		}
		return serializedProperty;
	}
	,classTo: function(instance,instanceName,padding) {
		if(padding == null) padding = "";
		var serializedClass = "";
		var instanceClass = Type.getClass(instance);
		var instanceClassName = Type.getClassName(instanceClass);
		if(!StringTools.startsWith(instanceClassName,this.impliedClassPrefix)) {
			haxe.Log.trace("Unexpected message class namespace.",{ fileName : "JsonLingo.hx", lineNumber : 54, className : "nfuzion.lingo.JsonLingo", methodName : "classTo"});
			return null;
		}
		instanceClassName = HxOverrides.substr(instanceClassName,this.impliedClassPrefix.length,null);
		if(instanceName != "") serializedClass += "\"" + (instanceName == null?instanceClassName:instanceName) + "\":" + this.lineEnd + padding + "{" + this.lineEnd; else serializedClass += "{" + this.lineEnd;
		var propertyNames = Type.getInstanceFields(instanceClass);
		propertyNames.sort($bind(this,this.sortString));
		var first = true;
		var _g = 0;
		while(_g < propertyNames.length) {
			var propertyName = propertyNames[_g];
			++_g;
			var property = Reflect.field(instance,propertyName);
			var propertyString = this.propertyTo(property,propertyName,padding);
			if(propertyString != null) {
				if(!first) serializedClass += "," + this.lineEnd;
				first = false;
				serializedClass += propertyString;
			}
		}
		serializedClass += this.lineEnd + padding + "}";
		return serializedClass;
	}
	,to: function(instance) {
		if(instance != null) {
			var serializedClass = this.classTo(instance);
			serializedClass = "{" + serializedClass + "}";
			return serializedClass;
		}
		return null;
	}
	,impliedClassPrefix: null
	,lineEnd: null
	,pad: null
	,alphabeticalOrder: null
	,__class__: nfuzion.lingo.JsonLingo
}
nfuzion.lingo.XmlLingo = function(alphabeticalOrder,pad,lineEnd,impliedClassPrefix) {
	if(impliedClassPrefix == null) impliedClassPrefix = "nfuzion.message.";
	if(lineEnd == null) lineEnd = "\n";
	if(pad == null) pad = "  ";
	if(alphabeticalOrder == null) alphabeticalOrder = true;
	this.alphabeticalOrder = alphabeticalOrder;
	this.pad = pad;
	this.lineEnd = lineEnd;
	this.impliedClassPrefix = impliedClassPrefix;
};
$hxClasses["nfuzion.lingo.XmlLingo"] = nfuzion.lingo.XmlLingo;
nfuzion.lingo.XmlLingo.__name__ = ["nfuzion","lingo","XmlLingo"];
nfuzion.lingo.XmlLingo.__interfaces__ = [nfuzion.lingo.ILingo];
nfuzion.lingo.XmlLingo.prototype = {
	extractPropertyValue: function(string) {
		string = HxOverrides.substr(string,0,string.indexOf(">"));
		var startIndex = string.indexOf("\"") + 1;
		var type = Type.createEnum(nfuzion.lingo.type.PropertyType,HxOverrides.substr(string,startIndex,string.lastIndexOf("\"") - startIndex));
		return type;
	}
	,arrayFrom: function(tagStarts,array,itemClass) {
		var result = true;
		while(tagStarts[0].charAt(0) != "/") if(StringTools.startsWith(tagStarts[0],"item ")) {
			var transport = { item : null};
			if(this.propertyFrom(tagStarts,transport,itemClass.slice())) array.push(transport.item); else {
				result = false;
				break;
			}
		} else {
			haxe.Log.trace("None item tag found in an array.",{ fileName : "XmlLingo.hx", lineNumber : 388, className : "nfuzion.lingo.XmlLingo", methodName : "arrayFrom"});
			result = false;
			break;
		}
		return result;
	}
	,propertyFrom: function(tagStarts,parentInstance,propertyClassArray) {
		var start = tagStarts.shift();
		if(start == null) {
			haxe.Log.trace("ERROR: start is null!",{ fileName : "XmlLingo.hx", lineNumber : 272, className : "nfuzion.lingo.XmlLingo", methodName : "propertyFrom"});
			return false;
		}
		var name = HxOverrides.substr(start,0,start.indexOf(" "));
		if(propertyClassArray == null && js.Boot.__instanceof(parentInstance,nfuzion.message.generic.base.Base)) propertyClassArray = (js.Boot.__cast(parentInstance , nfuzion.message.generic.base.Base)).getPropertyType(name);
		if(propertyClassArray == null) {
			haxe.Log.trace("Failed to get property class array.",{ fileName : "XmlLingo.hx", lineNumber : 282, className : "nfuzion.lingo.XmlLingo", methodName : "propertyFrom"});
			return false;
		}
		var propertyClass = propertyClassArray.shift();
		var propertyType = this.extractPropertyValue(start);
		switch(propertyClass) {
		case Array:
			if(propertyType == nfuzion.lingo.type.PropertyType.array) {
				var array = new Array();
				if(!this.arrayFrom(tagStarts,array,propertyClassArray)) return false;
				Reflect.setProperty(parentInstance,name,array);
			} else {
				haxe.Log.trace("Message type and class do not match.",{ fileName : "XmlLingo.hx", lineNumber : 302, className : "nfuzion.lingo.XmlLingo", methodName : "propertyFrom"});
				return false;
			}
			break;
		case Bool:
			var propertyValue = HxOverrides.substr(start,start.indexOf(">") + 1,null);
			parentInstance[name] = StringTools.startsWith(propertyValue,"true");
			break;
		case Int:
			var propertyValue = HxOverrides.substr(start,start.indexOf(">") + 1,null);
			parentInstance[name] = Std.parseInt(propertyValue);
			break;
		case Float:
			var propertyValue = HxOverrides.substr(start,start.indexOf(">") + 1,null);
			parentInstance[name] = Std.parseFloat(propertyValue);
			break;
		case String:
			var propertyValue = HxOverrides.substr(start,start.indexOf(">") + 1,null);
			parentInstance[name] = StringTools.htmlUnescape(propertyValue);
			break;
		default:
			switch( (propertyType)[1] ) {
			case 4:
				var instance = Type.createEmptyInstance(propertyClass);
				if(instance != null) {
					if(!this.propertiesFrom(tagStarts,instance)) instance = null;
					parentInstance[name] = instance;
				}
				if(instance == null) {
					haxe.Log.trace("Failed to create class.",{ fileName : "XmlLingo.hx", lineNumber : 334, className : "nfuzion.lingo.XmlLingo", methodName : "propertyFrom"});
					return false;
				}
				break;
			case 3:
				var propertyValue = HxOverrides.substr(start,start.indexOf(">") + 1,null);
				parentInstance[name] = Type.createEnum(propertyClass,propertyValue);
				break;
			default:
				haxe.Log.trace("Unhandled type \"" + Std.string(propertyType) + "\" in class.",{ fileName : "XmlLingo.hx", lineNumber : 341, className : "nfuzion.lingo.XmlLingo", methodName : "propertyFrom"});
				return false;
			}
		}
		var end = tagStarts.shift();
		if(end != null) {
			if(!StringTools.startsWith(end,"/" + name + ">")) {
				haxe.Log.trace("Bogus end tag.",{ fileName : "XmlLingo.hx", lineNumber : 351, className : "nfuzion.lingo.XmlLingo", methodName : "propertyFrom"});
				return false;
			}
		} else {
			haxe.Log.trace("No end tag",{ fileName : "XmlLingo.hx", lineNumber : 357, className : "nfuzion.lingo.XmlLingo", methodName : "propertyFrom"});
			return false;
		}
		return true;
	}
	,propertiesFrom: function(tagStarts,instance) {
		while(tagStarts.length > 0 && !StringTools.startsWith(tagStarts[0],"/")) if(!this.propertyFrom(tagStarts,instance)) return false;
		return true;
	}
	,from: function(serializedMessage) {
		if(serializedMessage == null) {
			haxe.Log.trace("ERROR: Serialized message is null!",{ fileName : "XmlLingo.hx", lineNumber : 172, className : "nfuzion.lingo.XmlLingo", methodName : "from"});
			return null;
		}
		if(serializedMessage == "") {
			haxe.Log.trace("ERROR: Serialized message is empty!",{ fileName : "XmlLingo.hx", lineNumber : 177, className : "nfuzion.lingo.XmlLingo", methodName : "from"});
			return null;
		}
		var tagStarts = serializedMessage.split("<");
		tagStarts.shift();
		var start = tagStarts.shift();
		if(start == null) return null;
		var partialClassName = HxOverrides.substr(start,0,start.indexOf(">"));
		var emptyMessage = false;
		if(StringTools.endsWith(partialClassName,"/")) {
			emptyMessage = true;
			partialClassName = HxOverrides.substr(partialClassName,0,partialClassName.length - 1);
		}
		var className = this.impliedClassPrefix + partialClassName;
		var cls = Type.resolveClass(className);
		var message = null;
		var error = "";
		if(cls != null) try {
			if(cls != null) message = Type.createEmptyInstance(cls);
		} catch( e ) {
			error = e;
		}
		if(message == null) return null;
		if(!emptyMessage) {
			this.propertiesFrom(tagStarts,message);
			var end = tagStarts.shift();
			if(end != null) {
				if(!StringTools.startsWith(end,"/" + partialClassName + ">")) {
					haxe.Log.trace("Root tag does not match.",{ fileName : "XmlLingo.hx", lineNumber : 231, className : "nfuzion.lingo.XmlLingo", methodName : "from"});
					return null;
				}
			} else {
				haxe.Log.trace("No end tag",{ fileName : "XmlLingo.hx", lineNumber : 237, className : "nfuzion.lingo.XmlLingo", methodName : "from"});
				return null;
			}
			if(tagStarts.length != 0) {
				haxe.Log.trace("Extraneous data found in serialized message.",{ fileName : "XmlLingo.hx", lineNumber : 244, className : "nfuzion.lingo.XmlLingo", methodName : "from"});
				return null;
			}
		}
		return message;
	}
	,sortString: function(a,b) {
		return a < b?-1:a > b?1:0;
	}
	,propertyTo: function(property,propertyName,padding) {
		var serializedProperty = "";
		var _g = Type["typeof"](property);
		var $e = (_g);
		switch( $e[1] ) {
		case 1:
		case 2:
			serializedProperty += padding + this.pad + "<" + propertyName + " type=\"" + Std.string(nfuzion.lingo.type.PropertyType.number) + "\">" + Std.string(property) + "</" + propertyName + ">" + this.lineEnd;
			break;
		case 7:
			var e = $e[2];
			serializedProperty += padding + this.pad + "<" + propertyName + " type=\"" + Std.string(nfuzion.lingo.type.PropertyType.string) + "\">" + Std.string(property) + "</" + propertyName + ">" + this.lineEnd;
			break;
		case 6:
			var c = $e[2];
			if(js.Boot.__instanceof(property,String)) serializedProperty += padding + this.pad + "<" + propertyName + " type=\"" + Std.string(nfuzion.lingo.type.PropertyType.string) + "\">" + StringTools.htmlEscape(Std.string(property)) + "</" + propertyName + ">" + this.lineEnd; else if(js.Boot.__instanceof(property,Array)) {
				serializedProperty += padding + this.pad + "<" + propertyName + " type=\"" + Std.string(nfuzion.lingo.type.PropertyType.array) + "\">" + this.lineEnd;
				var _g1 = 0, _g2 = js.Boot.__cast(property , Array);
				while(_g1 < _g2.length) {
					var item = _g2[_g1];
					++_g1;
					serializedProperty += this.propertyTo(item,"item",padding + this.pad);
				}
				serializedProperty += padding + this.pad + "</" + propertyName + ">" + this.lineEnd;
			} else if(js.Boot.__instanceof(property,nfuzion.message.generic.type.TypeClass)) serializedProperty += this.classTo(property,propertyName,padding + this.pad); else haxe.Log.trace("Detected class does not extend TypeClass.  Property will not be serialized.",{ fileName : "XmlLingo.hx", lineNumber : 142, className : "nfuzion.lingo.XmlLingo", methodName : "propertyTo"});
			break;
		case 3:
			serializedProperty += padding + this.pad + "<" + propertyName + " type=\"" + Std.string(nfuzion.lingo.type.PropertyType["boolean"]) + "\">" + (property == true?"true":"false") + "</" + propertyName + ">" + this.lineEnd;
			break;
		default:
		}
		return serializedProperty;
	}
	,classTo: function(instance,instanceName,padding) {
		if(padding == null) padding = "";
		var serializedClass = "";
		var instanceClass = Type.getClass(instance);
		var instanceClassName = Type.getClassName(instanceClass);
		if(!StringTools.startsWith(instanceClassName,this.impliedClassPrefix)) {
			haxe.Log.trace("Unknown class type.",{ fileName : "XmlLingo.hx", lineNumber : 55, className : "nfuzion.lingo.XmlLingo", methodName : "classTo"});
			return null;
		}
		instanceClassName = HxOverrides.substr(instanceClassName,this.impliedClassPrefix.length,null);
		if(instanceName == null) serializedClass += padding + "<" + instanceClassName + ">" + this.lineEnd; else serializedClass += padding + "<" + instanceName + (padding == ""?">":" type=\"" + Std.string(nfuzion.lingo.type.PropertyType.structure) + "\">") + this.lineEnd;
		var propertyNames = Type.getInstanceFields(instanceClass);
		propertyNames.sort($bind(this,this.sortString));
		var _g = 0;
		while(_g < propertyNames.length) {
			var propertyName = propertyNames[_g];
			++_g;
			var property = Reflect.field(instance,propertyName);
			serializedClass += this.propertyTo(property,propertyName,padding);
		}
		if(instanceName == null) serializedClass += padding + "</" + instanceClassName + ">"; else serializedClass += padding + "</" + instanceName + ">" + this.lineEnd;
		return serializedClass;
	}
	,to: function(instance) {
		if(instance != null) return this.classTo(instance);
		return null;
	}
	,impliedClassPrefix: null
	,lineEnd: null
	,pad: null
	,alphabeticalOrder: null
	,__class__: nfuzion.lingo.XmlLingo
}
nfuzion.lingo.type = {}
nfuzion.lingo.type.PropertyType = $hxClasses["nfuzion.lingo.type.PropertyType"] = { __ename__ : ["nfuzion","lingo","type","PropertyType"], __constructs__ : ["array","boolean","number","string","structure"] }
nfuzion.lingo.type.PropertyType.array = ["array",0];
nfuzion.lingo.type.PropertyType.array.toString = $estr;
nfuzion.lingo.type.PropertyType.array.__enum__ = nfuzion.lingo.type.PropertyType;
nfuzion.lingo.type.PropertyType["boolean"] = ["boolean",1];
nfuzion.lingo.type.PropertyType["boolean"].toString = $estr;
nfuzion.lingo.type.PropertyType["boolean"].__enum__ = nfuzion.lingo.type.PropertyType;
nfuzion.lingo.type.PropertyType.number = ["number",2];
nfuzion.lingo.type.PropertyType.number.toString = $estr;
nfuzion.lingo.type.PropertyType.number.__enum__ = nfuzion.lingo.type.PropertyType;
nfuzion.lingo.type.PropertyType.string = ["string",3];
nfuzion.lingo.type.PropertyType.string.toString = $estr;
nfuzion.lingo.type.PropertyType.string.__enum__ = nfuzion.lingo.type.PropertyType;
nfuzion.lingo.type.PropertyType.structure = ["structure",4];
nfuzion.lingo.type.PropertyType.structure.toString = $estr;
nfuzion.lingo.type.PropertyType.structure.__enum__ = nfuzion.lingo.type.PropertyType;
nfuzion.loader = {}
nfuzion.loader.TextLoader = function(url) {
	nfuzion.event.EventDispatcher.call(this);
	this.data = null;
	this.ready = false;
	this.url = url;
	this.xmlHttpRequest = new XMLHttpRequest();
	this.xmlHttpRequest.open("GET",url,true);
	this.xmlHttpRequest.onreadystatechange = $bind(this,this.onReadyStateChange);
};
$hxClasses["nfuzion.loader.TextLoader"] = nfuzion.loader.TextLoader;
nfuzion.loader.TextLoader.__name__ = ["nfuzion","loader","TextLoader"];
nfuzion.loader.TextLoader.__super__ = nfuzion.event.EventDispatcher;
nfuzion.loader.TextLoader.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	onError: function() {
		if(this.hasEventListener("LoaderEvent.error")) this.dispatchEvent(new nfuzion.loader.event.LoaderEvent("LoaderEvent.error",this)); else haxe.Log.trace("ERROR: Failed to load file at '" + this.url + "'.",{ fileName : "TextLoader.hx", lineNumber : 126, className : "nfuzion.loader.TextLoader", methodName : "onError"});
	}
	,onReady: function() {
		this.ready = true;
		this.dispatchEvent(new nfuzion.loader.event.LoaderEvent("LoaderEvent.ready",this));
	}
	,onReadyStateChange: function(e) {
		if(this.xmlHttpRequest.readyState == 4) {
			this.data = this.xmlHttpRequest.responseText;
			this.onReady();
		}
	}
	,request: function() {
		this.xmlHttpRequest.send(null);
	}
	,xmlHttpRequest: null
	,url: null
	,ready: null
	,data: null
	,__class__: nfuzion.loader.TextLoader
});
nfuzion.loader.event = {}
nfuzion.loader.event.LoaderEvent = function(type,target) {
	nfuzion.event.Event.call(this,type);
	this.target = target;
};
$hxClasses["nfuzion.loader.event.LoaderEvent"] = nfuzion.loader.event.LoaderEvent;
nfuzion.loader.event.LoaderEvent.__name__ = ["nfuzion","loader","event","LoaderEvent"];
nfuzion.loader.event.LoaderEvent.__super__ = nfuzion.event.Event;
nfuzion.loader.event.LoaderEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	target: null
	,__class__: nfuzion.loader.event.LoaderEvent
});
nfuzion.message = {}
nfuzion.message.generic = {}
nfuzion.message.generic.base = {}
nfuzion.message.generic.base.Base = function() {
};
$hxClasses["nfuzion.message.generic.base.Base"] = nfuzion.message.generic.base.Base;
nfuzion.message.generic.base.Base.__name__ = ["nfuzion","message","generic","base","Base"];
nfuzion.message.generic.base.Base.prototype = {
	getPropertyType: function(name) {
		var typeName = name + "Type";
		var cls = Type.getClass(this);
		while(cls != null) {
			var propertyType = Reflect.field(cls,typeName);
			if(propertyType != null) return propertyType.slice();
			cls = Type.getSuperClass(cls);
		}
		haxe.Log.trace("WARNING: Class appears to not have a field named '" + name + "'.",{ fileName : "Base.hx", lineNumber : 32, className : "nfuzion.message.generic.base.Base", methodName : "getPropertyType"});
		return null;
	}
	,__class__: nfuzion.message.generic.base.Base
}
nfuzion.message.generic.templates = {}
nfuzion.message.generic.templates.MessageClass = function() {
	nfuzion.message.generic.base.Base.call(this);
};
$hxClasses["nfuzion.message.generic.templates.MessageClass"] = nfuzion.message.generic.templates.MessageClass;
nfuzion.message.generic.templates.MessageClass.__name__ = ["nfuzion","message","generic","templates","MessageClass"];
nfuzion.message.generic.templates.MessageClass.__super__ = nfuzion.message.generic.base.Base;
nfuzion.message.generic.templates.MessageClass.prototype = $extend(nfuzion.message.generic.base.Base.prototype,{
	__class__: nfuzion.message.generic.templates.MessageClass
});
nfuzion.message.generic.templates.Let = function() {
	nfuzion.message.generic.templates.MessageClass.call(this);
};
$hxClasses["nfuzion.message.generic.templates.Let"] = nfuzion.message.generic.templates.Let;
nfuzion.message.generic.templates.Let.__name__ = ["nfuzion","message","generic","templates","Let"];
nfuzion.message.generic.templates.Let.__super__ = nfuzion.message.generic.templates.MessageClass;
nfuzion.message.generic.templates.Let.prototype = $extend(nfuzion.message.generic.templates.MessageClass.prototype,{
	__class__: nfuzion.message.generic.templates.Let
});
nfuzion.message.chime = {}
nfuzion.message.chime.type = {}
nfuzion.message.chime.type.Chime = $hxClasses["nfuzion.message.chime.type.Chime"] = { __ename__ : ["nfuzion","message","chime","type","Chime"], __constructs__ : ["uiConfirm","uiCancel","uiNotice","warning","turnSignalClick"] }
nfuzion.message.chime.type.Chime.uiConfirm = ["uiConfirm",0];
nfuzion.message.chime.type.Chime.uiConfirm.toString = $estr;
nfuzion.message.chime.type.Chime.uiConfirm.__enum__ = nfuzion.message.chime.type.Chime;
nfuzion.message.chime.type.Chime.uiCancel = ["uiCancel",1];
nfuzion.message.chime.type.Chime.uiCancel.toString = $estr;
nfuzion.message.chime.type.Chime.uiCancel.__enum__ = nfuzion.message.chime.type.Chime;
nfuzion.message.chime.type.Chime.uiNotice = ["uiNotice",2];
nfuzion.message.chime.type.Chime.uiNotice.toString = $estr;
nfuzion.message.chime.type.Chime.uiNotice.__enum__ = nfuzion.message.chime.type.Chime;
nfuzion.message.chime.type.Chime.warning = ["warning",3];
nfuzion.message.chime.type.Chime.warning.toString = $estr;
nfuzion.message.chime.type.Chime.warning.__enum__ = nfuzion.message.chime.type.Chime;
nfuzion.message.chime.type.Chime.turnSignalClick = ["turnSignalClick",4];
nfuzion.message.chime.type.Chime.turnSignalClick.toString = $estr;
nfuzion.message.chime.type.Chime.turnSignalClick.__enum__ = nfuzion.message.chime.type.Chime;
nfuzion.message.chime.LetChime = function(chime,playCount) {
	if(playCount == null) playCount = 0;
	nfuzion.message.generic.templates.Let.call(this);
	this.chime = chime;
	this.playCount = playCount;
};
$hxClasses["nfuzion.message.chime.LetChime"] = nfuzion.message.chime.LetChime;
nfuzion.message.chime.LetChime.__name__ = ["nfuzion","message","chime","LetChime"];
nfuzion.message.chime.LetChime.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.chime.LetChime.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	playCount: null
	,chime: null
	,__class__: nfuzion.message.chime.LetChime
});
nfuzion.message.generic.templates.Set = function() {
	nfuzion.message.generic.templates.MessageClass.call(this);
};
$hxClasses["nfuzion.message.generic.templates.Set"] = nfuzion.message.generic.templates.Set;
nfuzion.message.generic.templates.Set.__name__ = ["nfuzion","message","generic","templates","Set"];
nfuzion.message.generic.templates.Set.__super__ = nfuzion.message.generic.templates.MessageClass;
nfuzion.message.generic.templates.Set.prototype = $extend(nfuzion.message.generic.templates.MessageClass.prototype,{
	__class__: nfuzion.message.generic.templates.Set
});
nfuzion.message.chime.SetChime = function(chime,playCount) {
	if(playCount == null) playCount = 1;
	nfuzion.message.generic.templates.Set.call(this);
	this.chime = chime;
	this.playCount = playCount;
};
$hxClasses["nfuzion.message.chime.SetChime"] = nfuzion.message.chime.SetChime;
nfuzion.message.chime.SetChime.__name__ = ["nfuzion","message","chime","SetChime"];
nfuzion.message.chime.SetChime.__super__ = nfuzion.message.generic.templates.Set;
nfuzion.message.chime.SetChime.prototype = $extend(nfuzion.message.generic.templates.Set.prototype,{
	playCount: null
	,chime: null
	,__class__: nfuzion.message.chime.SetChime
});
nfuzion.message.debug = {}
nfuzion.message.debug.LetTrace = function(timestamp,sourceName,message,fileName,lineNumber,className,functionName) {
	if(lineNumber == null) lineNumber = -1;
	nfuzion.message.generic.templates.Let.call(this);
	this.timestamp = timestamp;
	this.sourceName = sourceName;
	this.message = message;
	this.fileName = fileName;
	this.lineNumber = lineNumber;
	this.className = className;
	this.functionName = functionName;
};
$hxClasses["nfuzion.message.debug.LetTrace"] = nfuzion.message.debug.LetTrace;
nfuzion.message.debug.LetTrace.__name__ = ["nfuzion","message","debug","LetTrace"];
nfuzion.message.debug.LetTrace.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.debug.LetTrace.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	functionName: null
	,className: null
	,lineNumber: null
	,fileName: null
	,message: null
	,sourceName: null
	,timestamp: null
	,__class__: nfuzion.message.debug.LetTrace
});
nfuzion.message.generic.templates.Get = function() {
	nfuzion.message.generic.templates.MessageClass.call(this);
};
$hxClasses["nfuzion.message.generic.templates.Get"] = nfuzion.message.generic.templates.Get;
nfuzion.message.generic.templates.Get.__name__ = ["nfuzion","message","generic","templates","Get"];
nfuzion.message.generic.templates.Get.__super__ = nfuzion.message.generic.templates.MessageClass;
nfuzion.message.generic.templates.Get.prototype = $extend(nfuzion.message.generic.templates.MessageClass.prototype,{
	__class__: nfuzion.message.generic.templates.Get
});
nfuzion.message.generic.templates.LetBool = function(value) {
	nfuzion.message.generic.templates.Let.call(this);
	this.value = value;
};
$hxClasses["nfuzion.message.generic.templates.LetBool"] = nfuzion.message.generic.templates.LetBool;
nfuzion.message.generic.templates.LetBool.__name__ = ["nfuzion","message","generic","templates","LetBool"];
nfuzion.message.generic.templates.LetBool.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.generic.templates.LetBool.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	value: null
	,__class__: nfuzion.message.generic.templates.LetBool
});
nfuzion.message.generic.templates.LetFloat = function(value) {
	nfuzion.message.generic.templates.Let.call(this);
	this.value = value;
};
$hxClasses["nfuzion.message.generic.templates.LetFloat"] = nfuzion.message.generic.templates.LetFloat;
nfuzion.message.generic.templates.LetFloat.__name__ = ["nfuzion","message","generic","templates","LetFloat"];
nfuzion.message.generic.templates.LetFloat.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.generic.templates.LetFloat.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	value: null
	,__class__: nfuzion.message.generic.templates.LetFloat
});
nfuzion.message.generic.templates.SetBool = function(value) {
	nfuzion.message.generic.templates.Set.call(this);
	this.value = value;
};
$hxClasses["nfuzion.message.generic.templates.SetBool"] = nfuzion.message.generic.templates.SetBool;
nfuzion.message.generic.templates.SetBool.__name__ = ["nfuzion","message","generic","templates","SetBool"];
nfuzion.message.generic.templates.SetBool.__super__ = nfuzion.message.generic.templates.Set;
nfuzion.message.generic.templates.SetBool.prototype = $extend(nfuzion.message.generic.templates.Set.prototype,{
	value: null
	,__class__: nfuzion.message.generic.templates.SetBool
});
nfuzion.message.generic.templates.SetFloat = function(value) {
	nfuzion.message.generic.templates.Set.call(this);
	this.value = value;
};
$hxClasses["nfuzion.message.generic.templates.SetFloat"] = nfuzion.message.generic.templates.SetFloat;
nfuzion.message.generic.templates.SetFloat.__name__ = ["nfuzion","message","generic","templates","SetFloat"];
nfuzion.message.generic.templates.SetFloat.__super__ = nfuzion.message.generic.templates.Set;
nfuzion.message.generic.templates.SetFloat.prototype = $extend(nfuzion.message.generic.templates.Set.prototype,{
	value: null
	,__class__: nfuzion.message.generic.templates.SetFloat
});
nfuzion.message.generic.templates.SetString = function(value) {
	nfuzion.message.generic.templates.Let.call(this);
	this.value = value;
};
$hxClasses["nfuzion.message.generic.templates.SetString"] = nfuzion.message.generic.templates.SetString;
nfuzion.message.generic.templates.SetString.__name__ = ["nfuzion","message","generic","templates","SetString"];
nfuzion.message.generic.templates.SetString.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.generic.templates.SetString.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	value: null
	,__class__: nfuzion.message.generic.templates.SetString
});
nfuzion.message.generic.type = {}
nfuzion.message.generic.type.TypeClass = function() {
	nfuzion.message.generic.base.Base.call(this);
};
$hxClasses["nfuzion.message.generic.type.TypeClass"] = nfuzion.message.generic.type.TypeClass;
nfuzion.message.generic.type.TypeClass.__name__ = ["nfuzion","message","generic","type","TypeClass"];
nfuzion.message.generic.type.TypeClass.__super__ = nfuzion.message.generic.base.Base;
nfuzion.message.generic.type.TypeClass.prototype = $extend(nfuzion.message.generic.base.Base.prototype,{
	__class__: nfuzion.message.generic.type.TypeClass
});
nfuzion.message.leap = {}
nfuzion.message.leap.type = {}
nfuzion.message.leap.type.Phase = $hxClasses["nfuzion.message.leap.type.Phase"] = { __ename__ : ["nfuzion","message","leap","type","Phase"], __constructs__ : ["start","change","end"] }
nfuzion.message.leap.type.Phase.start = ["start",0];
nfuzion.message.leap.type.Phase.start.toString = $estr;
nfuzion.message.leap.type.Phase.start.__enum__ = nfuzion.message.leap.type.Phase;
nfuzion.message.leap.type.Phase.change = ["change",1];
nfuzion.message.leap.type.Phase.change.toString = $estr;
nfuzion.message.leap.type.Phase.change.__enum__ = nfuzion.message.leap.type.Phase;
nfuzion.message.leap.type.Phase.end = ["end",2];
nfuzion.message.leap.type.Phase.end.toString = $estr;
nfuzion.message.leap.type.Phase.end.__enum__ = nfuzion.message.leap.type.Phase;
nfuzion.message.leap.LetCursor = function(x,y,phase) {
	nfuzion.message.generic.templates.Let.call(this);
	this.x = x;
	this.y = y;
	this.phase = phase;
};
$hxClasses["nfuzion.message.leap.LetCursor"] = nfuzion.message.leap.LetCursor;
nfuzion.message.leap.LetCursor.__name__ = ["nfuzion","message","leap","LetCursor"];
nfuzion.message.leap.LetCursor.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.leap.LetCursor.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	phase: null
	,y: null
	,x: null
	,__class__: nfuzion.message.leap.LetCursor
});
nfuzion.message.leap.type.Gesture = $hxClasses["nfuzion.message.leap.type.Gesture"] = { __ename__ : ["nfuzion","message","leap","type","Gesture"], __constructs__ : ["oneFingerSwipeLeft","oneFingerSwipeRight","oneFingerSwipeUp","oneFingerSwipeDown","twoFingerSwipeLeft","twofingerSwipeRight","twoFingerSwipeUp","twoFingerSwipeDown","dismiss","beckon"] }
nfuzion.message.leap.type.Gesture.oneFingerSwipeLeft = ["oneFingerSwipeLeft",0];
nfuzion.message.leap.type.Gesture.oneFingerSwipeLeft.toString = $estr;
nfuzion.message.leap.type.Gesture.oneFingerSwipeLeft.__enum__ = nfuzion.message.leap.type.Gesture;
nfuzion.message.leap.type.Gesture.oneFingerSwipeRight = ["oneFingerSwipeRight",1];
nfuzion.message.leap.type.Gesture.oneFingerSwipeRight.toString = $estr;
nfuzion.message.leap.type.Gesture.oneFingerSwipeRight.__enum__ = nfuzion.message.leap.type.Gesture;
nfuzion.message.leap.type.Gesture.oneFingerSwipeUp = ["oneFingerSwipeUp",2];
nfuzion.message.leap.type.Gesture.oneFingerSwipeUp.toString = $estr;
nfuzion.message.leap.type.Gesture.oneFingerSwipeUp.__enum__ = nfuzion.message.leap.type.Gesture;
nfuzion.message.leap.type.Gesture.oneFingerSwipeDown = ["oneFingerSwipeDown",3];
nfuzion.message.leap.type.Gesture.oneFingerSwipeDown.toString = $estr;
nfuzion.message.leap.type.Gesture.oneFingerSwipeDown.__enum__ = nfuzion.message.leap.type.Gesture;
nfuzion.message.leap.type.Gesture.twoFingerSwipeLeft = ["twoFingerSwipeLeft",4];
nfuzion.message.leap.type.Gesture.twoFingerSwipeLeft.toString = $estr;
nfuzion.message.leap.type.Gesture.twoFingerSwipeLeft.__enum__ = nfuzion.message.leap.type.Gesture;
nfuzion.message.leap.type.Gesture.twofingerSwipeRight = ["twofingerSwipeRight",5];
nfuzion.message.leap.type.Gesture.twofingerSwipeRight.toString = $estr;
nfuzion.message.leap.type.Gesture.twofingerSwipeRight.__enum__ = nfuzion.message.leap.type.Gesture;
nfuzion.message.leap.type.Gesture.twoFingerSwipeUp = ["twoFingerSwipeUp",6];
nfuzion.message.leap.type.Gesture.twoFingerSwipeUp.toString = $estr;
nfuzion.message.leap.type.Gesture.twoFingerSwipeUp.__enum__ = nfuzion.message.leap.type.Gesture;
nfuzion.message.leap.type.Gesture.twoFingerSwipeDown = ["twoFingerSwipeDown",7];
nfuzion.message.leap.type.Gesture.twoFingerSwipeDown.toString = $estr;
nfuzion.message.leap.type.Gesture.twoFingerSwipeDown.__enum__ = nfuzion.message.leap.type.Gesture;
nfuzion.message.leap.type.Gesture.dismiss = ["dismiss",8];
nfuzion.message.leap.type.Gesture.dismiss.toString = $estr;
nfuzion.message.leap.type.Gesture.dismiss.__enum__ = nfuzion.message.leap.type.Gesture;
nfuzion.message.leap.type.Gesture.beckon = ["beckon",9];
nfuzion.message.leap.type.Gesture.beckon.toString = $estr;
nfuzion.message.leap.type.Gesture.beckon.__enum__ = nfuzion.message.leap.type.Gesture;
nfuzion.message.leap.LetGesture = function(gesture) {
	nfuzion.message.generic.templates.Let.call(this);
	this.gesture = gesture;
};
$hxClasses["nfuzion.message.leap.LetGesture"] = nfuzion.message.leap.LetGesture;
nfuzion.message.leap.LetGesture.__name__ = ["nfuzion","message","leap","LetGesture"];
nfuzion.message.leap.LetGesture.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.leap.LetGesture.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	gesture: null
	,__class__: nfuzion.message.leap.LetGesture
});
nfuzion.message.leap.LetPoke = function(x,y,fingerCount,clickCount) {
	nfuzion.message.generic.templates.Let.call(this);
	this.x = x;
	this.y = y;
	this.fingerCount = fingerCount;
	this.clickCount = clickCount;
};
$hxClasses["nfuzion.message.leap.LetPoke"] = nfuzion.message.leap.LetPoke;
nfuzion.message.leap.LetPoke.__name__ = ["nfuzion","message","leap","LetPoke"];
nfuzion.message.leap.LetPoke.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.leap.LetPoke.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	clickCount: null
	,fingerCount: null
	,y: null
	,x: null
	,__class__: nfuzion.message.leap.LetPoke
});
nfuzion.message.leap.LetRotate = function(deltaAngle,fingerCount) {
	nfuzion.message.generic.templates.Let.call(this);
	this.deltaAngle = deltaAngle;
	this.fingerCount = fingerCount;
};
$hxClasses["nfuzion.message.leap.LetRotate"] = nfuzion.message.leap.LetRotate;
nfuzion.message.leap.LetRotate.__name__ = ["nfuzion","message","leap","LetRotate"];
nfuzion.message.leap.LetRotate.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.leap.LetRotate.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	fingerCount: null
	,deltaAngle: null
	,__class__: nfuzion.message.leap.LetRotate
});
nfuzion.message.leap.LetScroll = function(deltaX,deltaY,velocityX,velocityY,phase,fingerCount) {
	nfuzion.message.generic.templates.Let.call(this);
	this.deltaX = deltaX;
	this.deltaY = deltaY;
	this.velocityX = velocityX;
	this.velocityY = velocityY;
	this.phase = phase;
	this.fingerCount = fingerCount;
};
$hxClasses["nfuzion.message.leap.LetScroll"] = nfuzion.message.leap.LetScroll;
nfuzion.message.leap.LetScroll.__name__ = ["nfuzion","message","leap","LetScroll"];
nfuzion.message.leap.LetScroll.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.leap.LetScroll.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	fingerCount: null
	,phase: null
	,velocityY: null
	,velocityX: null
	,deltaY: null
	,deltaX: null
	,__class__: nfuzion.message.leap.LetScroll
});
nfuzion.message.leap.LetZoom = function(deltaZoom,fingerCount) {
	nfuzion.message.generic.templates.Let.call(this);
	this.deltaZoom = deltaZoom;
	this.fingerCount = fingerCount;
};
$hxClasses["nfuzion.message.leap.LetZoom"] = nfuzion.message.leap.LetZoom;
nfuzion.message.leap.LetZoom.__name__ = ["nfuzion","message","leap","LetZoom"];
nfuzion.message.leap.LetZoom.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.leap.LetZoom.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	fingerCount: null
	,deltaZoom: null
	,__class__: nfuzion.message.leap.LetZoom
});
nfuzion.message.magic = {}
nfuzion.message.magic.type = {}
nfuzion.message.magic.type.Phase = $hxClasses["nfuzion.message.magic.type.Phase"] = { __ename__ : ["nfuzion","message","magic","type","Phase"], __constructs__ : ["start","change","end"] }
nfuzion.message.magic.type.Phase.start = ["start",0];
nfuzion.message.magic.type.Phase.start.toString = $estr;
nfuzion.message.magic.type.Phase.start.__enum__ = nfuzion.message.magic.type.Phase;
nfuzion.message.magic.type.Phase.change = ["change",1];
nfuzion.message.magic.type.Phase.change.toString = $estr;
nfuzion.message.magic.type.Phase.change.__enum__ = nfuzion.message.magic.type.Phase;
nfuzion.message.magic.type.Phase.end = ["end",2];
nfuzion.message.magic.type.Phase.end.toString = $estr;
nfuzion.message.magic.type.Phase.end.__enum__ = nfuzion.message.magic.type.Phase;
nfuzion.message.media = {}
nfuzion.message.media.type = {}
nfuzion.message.media.type.ItemType = $hxClasses["nfuzion.message.media.type.ItemType"] = { __ename__ : ["nfuzion","message","media","type","ItemType"], __constructs__ : ["partition","folder","file","category","artist","album","genre","composer","track","playlist","audiobook","chapter","podcast","episode"] }
nfuzion.message.media.type.ItemType.partition = ["partition",0];
nfuzion.message.media.type.ItemType.partition.toString = $estr;
nfuzion.message.media.type.ItemType.partition.__enum__ = nfuzion.message.media.type.ItemType;
nfuzion.message.media.type.ItemType.folder = ["folder",1];
nfuzion.message.media.type.ItemType.folder.toString = $estr;
nfuzion.message.media.type.ItemType.folder.__enum__ = nfuzion.message.media.type.ItemType;
nfuzion.message.media.type.ItemType.file = ["file",2];
nfuzion.message.media.type.ItemType.file.toString = $estr;
nfuzion.message.media.type.ItemType.file.__enum__ = nfuzion.message.media.type.ItemType;
nfuzion.message.media.type.ItemType.category = ["category",3];
nfuzion.message.media.type.ItemType.category.toString = $estr;
nfuzion.message.media.type.ItemType.category.__enum__ = nfuzion.message.media.type.ItemType;
nfuzion.message.media.type.ItemType.artist = ["artist",4];
nfuzion.message.media.type.ItemType.artist.toString = $estr;
nfuzion.message.media.type.ItemType.artist.__enum__ = nfuzion.message.media.type.ItemType;
nfuzion.message.media.type.ItemType.album = ["album",5];
nfuzion.message.media.type.ItemType.album.toString = $estr;
nfuzion.message.media.type.ItemType.album.__enum__ = nfuzion.message.media.type.ItemType;
nfuzion.message.media.type.ItemType.genre = ["genre",6];
nfuzion.message.media.type.ItemType.genre.toString = $estr;
nfuzion.message.media.type.ItemType.genre.__enum__ = nfuzion.message.media.type.ItemType;
nfuzion.message.media.type.ItemType.composer = ["composer",7];
nfuzion.message.media.type.ItemType.composer.toString = $estr;
nfuzion.message.media.type.ItemType.composer.__enum__ = nfuzion.message.media.type.ItemType;
nfuzion.message.media.type.ItemType.track = ["track",8];
nfuzion.message.media.type.ItemType.track.toString = $estr;
nfuzion.message.media.type.ItemType.track.__enum__ = nfuzion.message.media.type.ItemType;
nfuzion.message.media.type.ItemType.playlist = ["playlist",9];
nfuzion.message.media.type.ItemType.playlist.toString = $estr;
nfuzion.message.media.type.ItemType.playlist.__enum__ = nfuzion.message.media.type.ItemType;
nfuzion.message.media.type.ItemType.audiobook = ["audiobook",10];
nfuzion.message.media.type.ItemType.audiobook.toString = $estr;
nfuzion.message.media.type.ItemType.audiobook.__enum__ = nfuzion.message.media.type.ItemType;
nfuzion.message.media.type.ItemType.chapter = ["chapter",11];
nfuzion.message.media.type.ItemType.chapter.toString = $estr;
nfuzion.message.media.type.ItemType.chapter.__enum__ = nfuzion.message.media.type.ItemType;
nfuzion.message.media.type.ItemType.podcast = ["podcast",12];
nfuzion.message.media.type.ItemType.podcast.toString = $estr;
nfuzion.message.media.type.ItemType.podcast.__enum__ = nfuzion.message.media.type.ItemType;
nfuzion.message.media.type.ItemType.episode = ["episode",13];
nfuzion.message.media.type.ItemType.episode.toString = $estr;
nfuzion.message.media.type.ItemType.episode.__enum__ = nfuzion.message.media.type.ItemType;
nfuzion.message.media.type.Item = function(title,type,id,playable,artUrl,artFile,length,album,artist,genre,composer,albumTrackNumber) {
	nfuzion.message.generic.type.TypeClass.call(this);
	this.title = title;
	this.type = type;
	this.id = id;
	this.playable = playable;
	this.artUrl = artUrl;
	this.artFile = artFile;
	this.length = length;
	this.album = album;
	this.artist = artist;
	this.genre = genre;
	this.composer = composer;
	this.albumTrackNumber = albumTrackNumber;
};
$hxClasses["nfuzion.message.media.type.Item"] = nfuzion.message.media.type.Item;
nfuzion.message.media.type.Item.__name__ = ["nfuzion","message","media","type","Item"];
nfuzion.message.media.type.Item.__super__ = nfuzion.message.generic.type.TypeClass;
nfuzion.message.media.type.Item.prototype = $extend(nfuzion.message.generic.type.TypeClass.prototype,{
	albumTrackNumber: null
	,composer: null
	,genre: null
	,artist: null
	,album: null
	,length: null
	,artFile: null
	,artUrl: null
	,playable: null
	,id: null
	,type: null
	,title: null
	,__class__: nfuzion.message.media.type.Item
});
nfuzion.message.media.templates = {}
nfuzion.message.media.templates.LetPartialMediaList = function(offset,data) {
	nfuzion.message.generic.templates.Let.call(this);
	this.offset = offset;
	this.data = data;
};
$hxClasses["nfuzion.message.media.templates.LetPartialMediaList"] = nfuzion.message.media.templates.LetPartialMediaList;
nfuzion.message.media.templates.LetPartialMediaList.__name__ = ["nfuzion","message","media","templates","LetPartialMediaList"];
nfuzion.message.media.templates.LetPartialMediaList.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.media.templates.LetPartialMediaList.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	data: null
	,offset: null
	,__class__: nfuzion.message.media.templates.LetPartialMediaList
});
nfuzion.message.navigation = {}
nfuzion.message.navigation.GetDistance = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.navigation.GetDistance"] = nfuzion.message.navigation.GetDistance;
nfuzion.message.navigation.GetDistance.__name__ = ["nfuzion","message","navigation","GetDistance"];
nfuzion.message.navigation.GetDistance.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.navigation.GetDistance.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.navigation.GetDistance
});
nfuzion.message.navigation.GetDistancePercentage = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.navigation.GetDistancePercentage"] = nfuzion.message.navigation.GetDistancePercentage;
nfuzion.message.navigation.GetDistancePercentage.__name__ = ["nfuzion","message","navigation","GetDistancePercentage"];
nfuzion.message.navigation.GetDistancePercentage.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.navigation.GetDistancePercentage.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.navigation.GetDistancePercentage
});
nfuzion.message.navigation.GetNextTurn = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.navigation.GetNextTurn"] = nfuzion.message.navigation.GetNextTurn;
nfuzion.message.navigation.GetNextTurn.__name__ = ["nfuzion","message","navigation","GetNextTurn"];
nfuzion.message.navigation.GetNextTurn.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.navigation.GetNextTurn.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.navigation.GetNextTurn
});
nfuzion.message.navigation.GetRoute = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.navigation.GetRoute"] = nfuzion.message.navigation.GetRoute;
nfuzion.message.navigation.GetRoute.__name__ = ["nfuzion","message","navigation","GetRoute"];
nfuzion.message.navigation.GetRoute.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.navigation.GetRoute.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.navigation.GetRoute
});
nfuzion.message.navigation.GetWaypoints = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.navigation.GetWaypoints"] = nfuzion.message.navigation.GetWaypoints;
nfuzion.message.navigation.GetWaypoints.__name__ = ["nfuzion","message","navigation","GetWaypoints"];
nfuzion.message.navigation.GetWaypoints.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.navigation.GetWaypoints.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.navigation.GetWaypoints
});
nfuzion.message.navigation.LetCancel = function() {
	nfuzion.message.generic.templates.Let.call(this);
};
$hxClasses["nfuzion.message.navigation.LetCancel"] = nfuzion.message.navigation.LetCancel;
nfuzion.message.navigation.LetCancel.__name__ = ["nfuzion","message","navigation","LetCancel"];
nfuzion.message.navigation.LetCancel.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.navigation.LetCancel.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	__class__: nfuzion.message.navigation.LetCancel
});
nfuzion.message.navigation.LetDestination = function() {
	nfuzion.message.generic.templates.Let.call(this);
};
$hxClasses["nfuzion.message.navigation.LetDestination"] = nfuzion.message.navigation.LetDestination;
nfuzion.message.navigation.LetDestination.__name__ = ["nfuzion","message","navigation","LetDestination"];
nfuzion.message.navigation.LetDestination.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.navigation.LetDestination.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	__class__: nfuzion.message.navigation.LetDestination
});
nfuzion.message.navigation.LetDistance = function(distance) {
	nfuzion.message.generic.templates.LetFloat.call(this,distance);
};
$hxClasses["nfuzion.message.navigation.LetDistance"] = nfuzion.message.navigation.LetDistance;
nfuzion.message.navigation.LetDistance.__name__ = ["nfuzion","message","navigation","LetDistance"];
nfuzion.message.navigation.LetDistance.__super__ = nfuzion.message.generic.templates.LetFloat;
nfuzion.message.navigation.LetDistance.prototype = $extend(nfuzion.message.generic.templates.LetFloat.prototype,{
	__class__: nfuzion.message.navigation.LetDistance
});
nfuzion.message.navigation.LetDistancePercentage = function(distance) {
	nfuzion.message.generic.templates.LetFloat.call(this,distance);
};
$hxClasses["nfuzion.message.navigation.LetDistancePercentage"] = nfuzion.message.navigation.LetDistancePercentage;
nfuzion.message.navigation.LetDistancePercentage.__name__ = ["nfuzion","message","navigation","LetDistancePercentage"];
nfuzion.message.navigation.LetDistancePercentage.__super__ = nfuzion.message.generic.templates.LetFloat;
nfuzion.message.navigation.LetDistancePercentage.prototype = $extend(nfuzion.message.generic.templates.LetFloat.prototype,{
	__class__: nfuzion.message.navigation.LetDistancePercentage
});
nfuzion.message.navigation.type = {}
nfuzion.message.navigation.type.TargetType = $hxClasses["nfuzion.message.navigation.type.TargetType"] = { __ename__ : ["nfuzion","message","navigation","type","TargetType"], __constructs__ : ["left","right","bearLeft","bearRight","uturn","destination","continueAhead"] }
nfuzion.message.navigation.type.TargetType.left = ["left",0];
nfuzion.message.navigation.type.TargetType.left.toString = $estr;
nfuzion.message.navigation.type.TargetType.left.__enum__ = nfuzion.message.navigation.type.TargetType;
nfuzion.message.navigation.type.TargetType.right = ["right",1];
nfuzion.message.navigation.type.TargetType.right.toString = $estr;
nfuzion.message.navigation.type.TargetType.right.__enum__ = nfuzion.message.navigation.type.TargetType;
nfuzion.message.navigation.type.TargetType.bearLeft = ["bearLeft",2];
nfuzion.message.navigation.type.TargetType.bearLeft.toString = $estr;
nfuzion.message.navigation.type.TargetType.bearLeft.__enum__ = nfuzion.message.navigation.type.TargetType;
nfuzion.message.navigation.type.TargetType.bearRight = ["bearRight",3];
nfuzion.message.navigation.type.TargetType.bearRight.toString = $estr;
nfuzion.message.navigation.type.TargetType.bearRight.__enum__ = nfuzion.message.navigation.type.TargetType;
nfuzion.message.navigation.type.TargetType.uturn = ["uturn",4];
nfuzion.message.navigation.type.TargetType.uturn.toString = $estr;
nfuzion.message.navigation.type.TargetType.uturn.__enum__ = nfuzion.message.navigation.type.TargetType;
nfuzion.message.navigation.type.TargetType.destination = ["destination",5];
nfuzion.message.navigation.type.TargetType.destination.toString = $estr;
nfuzion.message.navigation.type.TargetType.destination.__enum__ = nfuzion.message.navigation.type.TargetType;
nfuzion.message.navigation.type.TargetType.continueAhead = ["continueAhead",6];
nfuzion.message.navigation.type.TargetType.continueAhead.toString = $estr;
nfuzion.message.navigation.type.TargetType.continueAhead.__enum__ = nfuzion.message.navigation.type.TargetType;
nfuzion.message.navigation.type.StepData = function(target,distance,street) {
	if(distance == null) distance = 0;
	nfuzion.message.generic.type.TypeClass.call(this);
	this.distance = distance;
	this.street = street;
	this.target = target;
	this.turn = null;
	this.destination = null;
	this.isLastStep = false;
	this.isLastLeg = false;
};
$hxClasses["nfuzion.message.navigation.type.StepData"] = nfuzion.message.navigation.type.StepData;
nfuzion.message.navigation.type.StepData.__name__ = ["nfuzion","message","navigation","type","StepData"];
nfuzion.message.navigation.type.StepData.__super__ = nfuzion.message.generic.type.TypeClass;
nfuzion.message.navigation.type.StepData.prototype = $extend(nfuzion.message.generic.type.TypeClass.prototype,{
	isLastLeg: null
	,isLastStep: null
	,destination: null
	,street: null
	,target: null
	,turn: null
	,distance: null
	,__class__: nfuzion.message.navigation.type.StepData
});
nfuzion.message.navigation.LetNextTurn = function(nextTurn) {
	nfuzion.message.generic.templates.Let.call(this);
	this.nextTurn = nextTurn;
};
$hxClasses["nfuzion.message.navigation.LetNextTurn"] = nfuzion.message.navigation.LetNextTurn;
nfuzion.message.navigation.LetNextTurn.__name__ = ["nfuzion","message","navigation","LetNextTurn"];
nfuzion.message.navigation.LetNextTurn.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.navigation.LetNextTurn.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	nextTurn: null
	,__class__: nfuzion.message.navigation.LetNextTurn
});
nfuzion.message.navigation.type.SerializablePoint = function(x,y) {
	if(y == null) y = 0.0;
	if(x == null) x = 0.0;
	nfuzion.message.generic.type.TypeClass.call(this);
	this.x = x;
	this.y = y;
};
$hxClasses["nfuzion.message.navigation.type.SerializablePoint"] = nfuzion.message.navigation.type.SerializablePoint;
nfuzion.message.navigation.type.SerializablePoint.__name__ = ["nfuzion","message","navigation","type","SerializablePoint"];
nfuzion.message.navigation.type.SerializablePoint.__super__ = nfuzion.message.generic.type.TypeClass;
nfuzion.message.navigation.type.SerializablePoint.prototype = $extend(nfuzion.message.generic.type.TypeClass.prototype,{
	y: null
	,x: null
	,__class__: nfuzion.message.navigation.type.SerializablePoint
});
nfuzion.message.navigation.type.TransitType = $hxClasses["nfuzion.message.navigation.type.TransitType"] = { __ename__ : ["nfuzion","message","navigation","type","TransitType"], __constructs__ : ["walking","driving"] }
nfuzion.message.navigation.type.TransitType.walking = ["walking",0];
nfuzion.message.navigation.type.TransitType.walking.toString = $estr;
nfuzion.message.navigation.type.TransitType.walking.__enum__ = nfuzion.message.navigation.type.TransitType;
nfuzion.message.navigation.type.TransitType.driving = ["driving",1];
nfuzion.message.navigation.type.TransitType.driving.toString = $estr;
nfuzion.message.navigation.type.TransitType.driving.__enum__ = nfuzion.message.navigation.type.TransitType;
nfuzion.message.navigation.type.Step = function(distance,sp,ep,track,text,type) {
	if(text == null) text = "";
	if(distance == null) distance = 0.0;
	nfuzion.message.generic.type.TypeClass.call(this);
	this.distance = distance;
	if(sp == null) this.startingPoint = new nfuzion.message.navigation.type.SerializablePoint(); else this.startingPoint = sp;
	if(ep == null) this.endingPoint = new nfuzion.message.navigation.type.SerializablePoint(); else this.endingPoint = ep;
	if(track == null) this.track = new Array(); else this.track = track;
	this.text = text;
	if(type == null) this.type = nfuzion.message.navigation.type.TransitType.driving; else this.type = type;
};
$hxClasses["nfuzion.message.navigation.type.Step"] = nfuzion.message.navigation.type.Step;
nfuzion.message.navigation.type.Step.__name__ = ["nfuzion","message","navigation","type","Step"];
nfuzion.message.navigation.type.Step.__super__ = nfuzion.message.generic.type.TypeClass;
nfuzion.message.navigation.type.Step.prototype = $extend(nfuzion.message.generic.type.TypeClass.prototype,{
	type: null
	,text: null
	,track: null
	,endingPoint: null
	,startingPoint: null
	,distance: null
	,__class__: nfuzion.message.navigation.type.Step
});
nfuzion.message.navigation.type.Leg = function(distance,sp,ep,steps) {
	if(distance == null) distance = 0.0;
	nfuzion.message.generic.type.TypeClass.call(this);
	this.distance = distance;
	if(sp == null) this.startingPoint = new nfuzion.message.navigation.type.SerializablePoint(); else this.startingPoint = sp;
	if(ep == null) this.endingPoint = new nfuzion.message.navigation.type.SerializablePoint(); else this.endingPoint = ep;
	if(steps == null) this.steps = new Array(); else this.steps = steps;
};
$hxClasses["nfuzion.message.navigation.type.Leg"] = nfuzion.message.navigation.type.Leg;
nfuzion.message.navigation.type.Leg.__name__ = ["nfuzion","message","navigation","type","Leg"];
nfuzion.message.navigation.type.Leg.__super__ = nfuzion.message.generic.type.TypeClass;
nfuzion.message.navigation.type.Leg.prototype = $extend(nfuzion.message.generic.type.TypeClass.prototype,{
	steps: null
	,endingPoint: null
	,startingPoint: null
	,distance: null
	,__class__: nfuzion.message.navigation.type.Leg
});
nfuzion.message.navigation.type.Waypoint = function(name,address,x,y) {
	if(y == null) y = 0.0;
	if(x == null) x = 0.0;
	nfuzion.message.generic.type.TypeClass.call(this);
	this.name = name;
	this.address = address;
	this.x = x;
	this.y = y;
};
$hxClasses["nfuzion.message.navigation.type.Waypoint"] = nfuzion.message.navigation.type.Waypoint;
nfuzion.message.navigation.type.Waypoint.__name__ = ["nfuzion","message","navigation","type","Waypoint"];
nfuzion.message.navigation.type.Waypoint.__super__ = nfuzion.message.generic.type.TypeClass;
nfuzion.message.navigation.type.Waypoint.prototype = $extend(nfuzion.message.generic.type.TypeClass.prototype,{
	toString: function() {
		if(this.address.length > 0) return this.address;
		return Std.string(this.x) + "," + Std.string(this.y);
	}
	,y: null
	,x: null
	,address: null
	,name: null
	,__class__: nfuzion.message.navigation.type.Waypoint
});
nfuzion.message.navigation.type.Route = function(markers,legs,distance) {
	if(distance == null) distance = 0.0;
	nfuzion.message.generic.type.TypeClass.call(this);
	if(markers == null) this.markers = new Array(); else this.markers = markers;
	if(legs == null) this.legs = new Array(); else this.legs = legs;
	this.distance = distance;
};
$hxClasses["nfuzion.message.navigation.type.Route"] = nfuzion.message.navigation.type.Route;
nfuzion.message.navigation.type.Route.__name__ = ["nfuzion","message","navigation","type","Route"];
nfuzion.message.navigation.type.Route.__super__ = nfuzion.message.generic.type.TypeClass;
nfuzion.message.navigation.type.Route.prototype = $extend(nfuzion.message.generic.type.TypeClass.prototype,{
	getTextDirections: function() {
		if(this.legs == null) return null;
		var directions = new Array();
		var _g = 0, _g1 = this.legs;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			var _g2 = 0, _g3 = l.steps;
			while(_g2 < _g3.length) {
				var s = _g3[_g2];
				++_g2;
				directions.push(s.text);
			}
		}
		return directions;
	}
	,addMarker: function(point) {
		this.markers.push(point);
	}
	,distance: null
	,legs: null
	,markers: null
	,__class__: nfuzion.message.navigation.type.Route
});
nfuzion.message.navigation.LetRoute = function(route) {
	nfuzion.message.generic.templates.Let.call(this);
	this.route = route;
};
$hxClasses["nfuzion.message.navigation.LetRoute"] = nfuzion.message.navigation.LetRoute;
nfuzion.message.navigation.LetRoute.__name__ = ["nfuzion","message","navigation","LetRoute"];
nfuzion.message.navigation.LetRoute.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.navigation.LetRoute.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	route: null
	,__class__: nfuzion.message.navigation.LetRoute
});
nfuzion.message.navigation.LetWaypoints = function(waypoints) {
	nfuzion.message.generic.templates.Let.call(this);
	this.waypoints = waypoints;
};
$hxClasses["nfuzion.message.navigation.LetWaypoints"] = nfuzion.message.navigation.LetWaypoints;
nfuzion.message.navigation.LetWaypoints.__name__ = ["nfuzion","message","navigation","LetWaypoints"];
nfuzion.message.navigation.LetWaypoints.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.navigation.LetWaypoints.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	waypoints: null
	,__class__: nfuzion.message.navigation.LetWaypoints
});
nfuzion.message.navigation.SetAddWaypoint = function(waypoint) {
	nfuzion.message.generic.templates.Set.call(this);
	this.waypoint = waypoint;
};
$hxClasses["nfuzion.message.navigation.SetAddWaypoint"] = nfuzion.message.navigation.SetAddWaypoint;
nfuzion.message.navigation.SetAddWaypoint.__name__ = ["nfuzion","message","navigation","SetAddWaypoint"];
nfuzion.message.navigation.SetAddWaypoint.__super__ = nfuzion.message.generic.templates.Set;
nfuzion.message.navigation.SetAddWaypoint.prototype = $extend(nfuzion.message.generic.templates.Set.prototype,{
	waypoint: null
	,__class__: nfuzion.message.navigation.SetAddWaypoint
});
nfuzion.message.navigation.SetCancel = function() {
	nfuzion.message.generic.templates.Set.call(this);
};
$hxClasses["nfuzion.message.navigation.SetCancel"] = nfuzion.message.navigation.SetCancel;
nfuzion.message.navigation.SetCancel.__name__ = ["nfuzion","message","navigation","SetCancel"];
nfuzion.message.navigation.SetCancel.__super__ = nfuzion.message.generic.templates.Set;
nfuzion.message.navigation.SetCancel.prototype = $extend(nfuzion.message.generic.templates.Set.prototype,{
	__class__: nfuzion.message.navigation.SetCancel
});
nfuzion.message.navigation.SetClearRoute = function() {
	nfuzion.message.generic.templates.Set.call(this);
};
$hxClasses["nfuzion.message.navigation.SetClearRoute"] = nfuzion.message.navigation.SetClearRoute;
nfuzion.message.navigation.SetClearRoute.__name__ = ["nfuzion","message","navigation","SetClearRoute"];
nfuzion.message.navigation.SetClearRoute.__super__ = nfuzion.message.generic.templates.Set;
nfuzion.message.navigation.SetClearRoute.prototype = $extend(nfuzion.message.generic.templates.Set.prototype,{
	__class__: nfuzion.message.navigation.SetClearRoute
});
nfuzion.message.navigation.SetEndByAddress = function(value) {
	nfuzion.message.generic.templates.SetString.call(this,value);
};
$hxClasses["nfuzion.message.navigation.SetEndByAddress"] = nfuzion.message.navigation.SetEndByAddress;
nfuzion.message.navigation.SetEndByAddress.__name__ = ["nfuzion","message","navigation","SetEndByAddress"];
nfuzion.message.navigation.SetEndByAddress.__super__ = nfuzion.message.generic.templates.SetString;
nfuzion.message.navigation.SetEndByAddress.prototype = $extend(nfuzion.message.generic.templates.SetString.prototype,{
	__class__: nfuzion.message.navigation.SetEndByAddress
});
nfuzion.message.navigation.SetEndByPoint = function(x,y) {
	nfuzion.message.generic.templates.Set.call(this);
	this.x = x;
	this.y = y;
};
$hxClasses["nfuzion.message.navigation.SetEndByPoint"] = nfuzion.message.navigation.SetEndByPoint;
nfuzion.message.navigation.SetEndByPoint.__name__ = ["nfuzion","message","navigation","SetEndByPoint"];
nfuzion.message.navigation.SetEndByPoint.__super__ = nfuzion.message.generic.templates.Set;
nfuzion.message.navigation.SetEndByPoint.prototype = $extend(nfuzion.message.generic.templates.Set.prototype,{
	y: null
	,x: null
	,__class__: nfuzion.message.navigation.SetEndByPoint
});
nfuzion.message.navigation.SetInsertWaypoint = function(index,waypoint) {
	nfuzion.message.generic.templates.Set.call(this);
	this.index = index;
	this.waypoint = waypoint;
};
$hxClasses["nfuzion.message.navigation.SetInsertWaypoint"] = nfuzion.message.navigation.SetInsertWaypoint;
nfuzion.message.navigation.SetInsertWaypoint.__name__ = ["nfuzion","message","navigation","SetInsertWaypoint"];
nfuzion.message.navigation.SetInsertWaypoint.__super__ = nfuzion.message.generic.templates.Set;
nfuzion.message.navigation.SetInsertWaypoint.prototype = $extend(nfuzion.message.generic.templates.Set.prototype,{
	waypoint: null
	,index: null
	,__class__: nfuzion.message.navigation.SetInsertWaypoint
});
nfuzion.message.navigation.SetRemoveWaypoint = function(index) {
	nfuzion.message.generic.templates.Set.call(this);
	this.index = index;
};
$hxClasses["nfuzion.message.navigation.SetRemoveWaypoint"] = nfuzion.message.navigation.SetRemoveWaypoint;
nfuzion.message.navigation.SetRemoveWaypoint.__name__ = ["nfuzion","message","navigation","SetRemoveWaypoint"];
nfuzion.message.navigation.SetRemoveWaypoint.__super__ = nfuzion.message.generic.templates.Set;
nfuzion.message.navigation.SetRemoveWaypoint.prototype = $extend(nfuzion.message.generic.templates.Set.prototype,{
	index: null
	,__class__: nfuzion.message.navigation.SetRemoveWaypoint
});
nfuzion.message.navigation.SetRequestNewRoute = function(type) {
	nfuzion.message.generic.templates.Set.call(this);
	this.type = type;
};
$hxClasses["nfuzion.message.navigation.SetRequestNewRoute"] = nfuzion.message.navigation.SetRequestNewRoute;
nfuzion.message.navigation.SetRequestNewRoute.__name__ = ["nfuzion","message","navigation","SetRequestNewRoute"];
nfuzion.message.navigation.SetRequestNewRoute.__super__ = nfuzion.message.generic.templates.Set;
nfuzion.message.navigation.SetRequestNewRoute.prototype = $extend(nfuzion.message.generic.templates.Set.prototype,{
	type: null
	,__class__: nfuzion.message.navigation.SetRequestNewRoute
});
nfuzion.message.navigation.SetStartByAddress = function(start) {
	nfuzion.message.generic.templates.SetString.call(this,start);
};
$hxClasses["nfuzion.message.navigation.SetStartByAddress"] = nfuzion.message.navigation.SetStartByAddress;
nfuzion.message.navigation.SetStartByAddress.__name__ = ["nfuzion","message","navigation","SetStartByAddress"];
nfuzion.message.navigation.SetStartByAddress.__super__ = nfuzion.message.generic.templates.SetString;
nfuzion.message.navigation.SetStartByAddress.prototype = $extend(nfuzion.message.generic.templates.SetString.prototype,{
	__class__: nfuzion.message.navigation.SetStartByAddress
});
nfuzion.message.navigation.SetStartByPoint = function(x,y) {
	nfuzion.message.generic.templates.Set.call(this);
	this.x = x;
	this.y = y;
};
$hxClasses["nfuzion.message.navigation.SetStartByPoint"] = nfuzion.message.navigation.SetStartByPoint;
nfuzion.message.navigation.SetStartByPoint.__name__ = ["nfuzion","message","navigation","SetStartByPoint"];
nfuzion.message.navigation.SetStartByPoint.__super__ = nfuzion.message.generic.templates.Set;
nfuzion.message.navigation.SetStartByPoint.prototype = $extend(nfuzion.message.generic.templates.Set.prototype,{
	y: null
	,x: null
	,__class__: nfuzion.message.navigation.SetStartByPoint
});
nfuzion.message.navigation.SetWaypoints = function(waypoints) {
	nfuzion.message.generic.templates.Set.call(this);
	this.waypoints = waypoints;
};
$hxClasses["nfuzion.message.navigation.SetWaypoints"] = nfuzion.message.navigation.SetWaypoints;
nfuzion.message.navigation.SetWaypoints.__name__ = ["nfuzion","message","navigation","SetWaypoints"];
nfuzion.message.navigation.SetWaypoints.__super__ = nfuzion.message.generic.templates.Set;
nfuzion.message.navigation.SetWaypoints.prototype = $extend(nfuzion.message.generic.templates.Set.prototype,{
	waypoints: null
	,__class__: nfuzion.message.navigation.SetWaypoints
});
nfuzion.message.span = {}
nfuzion.message.span.LetClientMetadata = function(name,clientCatagory,echo) {
	if(echo == null) echo = true;
	nfuzion.message.generic.templates.Let.call(this);
	this.name = name;
	this.clientCatagory = clientCatagory;
	this.echo = echo;
};
$hxClasses["nfuzion.message.span.LetClientMetadata"] = nfuzion.message.span.LetClientMetadata;
nfuzion.message.span.LetClientMetadata.__name__ = ["nfuzion","message","span","LetClientMetadata"];
nfuzion.message.span.LetClientMetadata.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.span.LetClientMetadata.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	echo: null
	,clientCatagory: null
	,name: null
	,__class__: nfuzion.message.span.LetClientMetadata
});
nfuzion.message.swc = {}
nfuzion.message.swc.type = {}
nfuzion.message.swc.type.Gesture = $hxClasses["nfuzion.message.swc.type.Gesture"] = { __ename__ : ["nfuzion","message","swc","type","Gesture"], __constructs__ : ["oneFingerSwipeLeft","oneFingerSwipeRight","oneFingerSwipeUp","oneFingerSwipeDown","twoFingerSwipeLeft","twofingerSwipeRight","twoFingerSwipeUp","twoFingerSwipeDown"] }
nfuzion.message.swc.type.Gesture.oneFingerSwipeLeft = ["oneFingerSwipeLeft",0];
nfuzion.message.swc.type.Gesture.oneFingerSwipeLeft.toString = $estr;
nfuzion.message.swc.type.Gesture.oneFingerSwipeLeft.__enum__ = nfuzion.message.swc.type.Gesture;
nfuzion.message.swc.type.Gesture.oneFingerSwipeRight = ["oneFingerSwipeRight",1];
nfuzion.message.swc.type.Gesture.oneFingerSwipeRight.toString = $estr;
nfuzion.message.swc.type.Gesture.oneFingerSwipeRight.__enum__ = nfuzion.message.swc.type.Gesture;
nfuzion.message.swc.type.Gesture.oneFingerSwipeUp = ["oneFingerSwipeUp",2];
nfuzion.message.swc.type.Gesture.oneFingerSwipeUp.toString = $estr;
nfuzion.message.swc.type.Gesture.oneFingerSwipeUp.__enum__ = nfuzion.message.swc.type.Gesture;
nfuzion.message.swc.type.Gesture.oneFingerSwipeDown = ["oneFingerSwipeDown",3];
nfuzion.message.swc.type.Gesture.oneFingerSwipeDown.toString = $estr;
nfuzion.message.swc.type.Gesture.oneFingerSwipeDown.__enum__ = nfuzion.message.swc.type.Gesture;
nfuzion.message.swc.type.Gesture.twoFingerSwipeLeft = ["twoFingerSwipeLeft",4];
nfuzion.message.swc.type.Gesture.twoFingerSwipeLeft.toString = $estr;
nfuzion.message.swc.type.Gesture.twoFingerSwipeLeft.__enum__ = nfuzion.message.swc.type.Gesture;
nfuzion.message.swc.type.Gesture.twofingerSwipeRight = ["twofingerSwipeRight",5];
nfuzion.message.swc.type.Gesture.twofingerSwipeRight.toString = $estr;
nfuzion.message.swc.type.Gesture.twofingerSwipeRight.__enum__ = nfuzion.message.swc.type.Gesture;
nfuzion.message.swc.type.Gesture.twoFingerSwipeUp = ["twoFingerSwipeUp",6];
nfuzion.message.swc.type.Gesture.twoFingerSwipeUp.toString = $estr;
nfuzion.message.swc.type.Gesture.twoFingerSwipeUp.__enum__ = nfuzion.message.swc.type.Gesture;
nfuzion.message.swc.type.Gesture.twoFingerSwipeDown = ["twoFingerSwipeDown",7];
nfuzion.message.swc.type.Gesture.twoFingerSwipeDown.toString = $estr;
nfuzion.message.swc.type.Gesture.twoFingerSwipeDown.__enum__ = nfuzion.message.swc.type.Gesture;
nfuzion.message.swc.type.Phase = $hxClasses["nfuzion.message.swc.type.Phase"] = { __ename__ : ["nfuzion","message","swc","type","Phase"], __constructs__ : ["start","change","end"] }
nfuzion.message.swc.type.Phase.start = ["start",0];
nfuzion.message.swc.type.Phase.start.toString = $estr;
nfuzion.message.swc.type.Phase.start.__enum__ = nfuzion.message.swc.type.Phase;
nfuzion.message.swc.type.Phase.change = ["change",1];
nfuzion.message.swc.type.Phase.change.toString = $estr;
nfuzion.message.swc.type.Phase.change.__enum__ = nfuzion.message.swc.type.Phase;
nfuzion.message.swc.type.Phase.end = ["end",2];
nfuzion.message.swc.type.Phase.end.toString = $estr;
nfuzion.message.swc.type.Phase.end.__enum__ = nfuzion.message.swc.type.Phase;
nfuzion.message.test = {}
nfuzion.message.test.type = {}
nfuzion.message.test.type.Type = function(test) {
	nfuzion.message.generic.type.TypeClass.call(this);
	this.test = test;
};
$hxClasses["nfuzion.message.test.type.Type"] = nfuzion.message.test.type.Type;
nfuzion.message.test.type.Type.__name__ = ["nfuzion","message","test","type","Type"];
nfuzion.message.test.type.Type.__super__ = nfuzion.message.generic.type.TypeClass;
nfuzion.message.test.type.Type.prototype = $extend(nfuzion.message.generic.type.TypeClass.prototype,{
	test: null
	,__class__: nfuzion.message.test.type.Type
});
nfuzion.message.test.type.Enum = $hxClasses["nfuzion.message.test.type.Enum"] = { __ename__ : ["nfuzion","message","test","type","Enum"], __constructs__ : ["alpha","bravo","charlie","delta"] }
nfuzion.message.test.type.Enum.alpha = ["alpha",0];
nfuzion.message.test.type.Enum.alpha.toString = $estr;
nfuzion.message.test.type.Enum.alpha.__enum__ = nfuzion.message.test.type.Enum;
nfuzion.message.test.type.Enum.bravo = ["bravo",1];
nfuzion.message.test.type.Enum.bravo.toString = $estr;
nfuzion.message.test.type.Enum.bravo.__enum__ = nfuzion.message.test.type.Enum;
nfuzion.message.test.type.Enum.charlie = ["charlie",2];
nfuzion.message.test.type.Enum.charlie.toString = $estr;
nfuzion.message.test.type.Enum.charlie.__enum__ = nfuzion.message.test.type.Enum;
nfuzion.message.test.type.Enum.delta = ["delta",3];
nfuzion.message.test.type.Enum.delta.toString = $estr;
nfuzion.message.test.type.Enum.delta.__enum__ = nfuzion.message.test.type.Enum;
nfuzion.message.test.LetTest = function(a,b,c,d,e,f,g) {
	nfuzion.message.generic.templates.Let.call(this);
	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;
	this.e = e;
	this.f = f;
	this.g = g;
};
$hxClasses["nfuzion.message.test.LetTest"] = nfuzion.message.test.LetTest;
nfuzion.message.test.LetTest.__name__ = ["nfuzion","message","test","LetTest"];
nfuzion.message.test.LetTest.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.test.LetTest.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	g: null
	,f: null
	,e: null
	,d: null
	,c: null
	,b: null
	,a: null
	,__class__: nfuzion.message.test.LetTest
});
nfuzion.message.vehicle = {}
nfuzion.message.vehicle.GetABS = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetABS"] = nfuzion.message.vehicle.GetABS;
nfuzion.message.vehicle.GetABS.__name__ = ["nfuzion","message","vehicle","GetABS"];
nfuzion.message.vehicle.GetABS.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetABS.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetABS
});
nfuzion.message.vehicle.GetAirbag = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetAirbag"] = nfuzion.message.vehicle.GetAirbag;
nfuzion.message.vehicle.GetAirbag.__name__ = ["nfuzion","message","vehicle","GetAirbag"];
nfuzion.message.vehicle.GetAirbag.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetAirbag.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetAirbag
});
nfuzion.message.vehicle.GetBattery = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetBattery"] = nfuzion.message.vehicle.GetBattery;
nfuzion.message.vehicle.GetBattery.__name__ = ["nfuzion","message","vehicle","GetBattery"];
nfuzion.message.vehicle.GetBattery.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetBattery.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetBattery
});
nfuzion.message.vehicle.GetDistanceToEmpty = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetDistanceToEmpty"] = nfuzion.message.vehicle.GetDistanceToEmpty;
nfuzion.message.vehicle.GetDistanceToEmpty.__name__ = ["nfuzion","message","vehicle","GetDistanceToEmpty"];
nfuzion.message.vehicle.GetDistanceToEmpty.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetDistanceToEmpty.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetDistanceToEmpty
});
nfuzion.message.vehicle.GetDriverDoorOpen = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetDriverDoorOpen"] = nfuzion.message.vehicle.GetDriverDoorOpen;
nfuzion.message.vehicle.GetDriverDoorOpen.__name__ = ["nfuzion","message","vehicle","GetDriverDoorOpen"];
nfuzion.message.vehicle.GetDriverDoorOpen.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetDriverDoorOpen.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetDriverDoorOpen
});
nfuzion.message.vehicle.GetDriverSeated = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetDriverSeated"] = nfuzion.message.vehicle.GetDriverSeated;
nfuzion.message.vehicle.GetDriverSeated.__name__ = ["nfuzion","message","vehicle","GetDriverSeated"];
nfuzion.message.vehicle.GetDriverSeated.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetDriverSeated.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetDriverSeated
});
nfuzion.message.vehicle.GetEmergencyBrake = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetEmergencyBrake"] = nfuzion.message.vehicle.GetEmergencyBrake;
nfuzion.message.vehicle.GetEmergencyBrake.__name__ = ["nfuzion","message","vehicle","GetEmergencyBrake"];
nfuzion.message.vehicle.GetEmergencyBrake.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetEmergencyBrake.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetEmergencyBrake
});
nfuzion.message.vehicle.GetFuel = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetFuel"] = nfuzion.message.vehicle.GetFuel;
nfuzion.message.vehicle.GetFuel.__name__ = ["nfuzion","message","vehicle","GetFuel"];
nfuzion.message.vehicle.GetFuel.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetFuel.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetFuel
});
nfuzion.message.vehicle.GetHighBeam = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetHighBeam"] = nfuzion.message.vehicle.GetHighBeam;
nfuzion.message.vehicle.GetHighBeam.__name__ = ["nfuzion","message","vehicle","GetHighBeam"];
nfuzion.message.vehicle.GetHighBeam.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetHighBeam.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetHighBeam
});
nfuzion.message.vehicle.GetLocked = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetLocked"] = nfuzion.message.vehicle.GetLocked;
nfuzion.message.vehicle.GetLocked.__name__ = ["nfuzion","message","vehicle","GetLocked"];
nfuzion.message.vehicle.GetLocked.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetLocked.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetLocked
});
nfuzion.message.vehicle.GetOdometer = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetOdometer"] = nfuzion.message.vehicle.GetOdometer;
nfuzion.message.vehicle.GetOdometer.__name__ = ["nfuzion","message","vehicle","GetOdometer"];
nfuzion.message.vehicle.GetOdometer.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetOdometer.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetOdometer
});
nfuzion.message.vehicle.GetOil = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetOil"] = nfuzion.message.vehicle.GetOil;
nfuzion.message.vehicle.GetOil.__name__ = ["nfuzion","message","vehicle","GetOil"];
nfuzion.message.vehicle.GetOil.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetOil.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetOil
});
nfuzion.message.vehicle.GetSeatBelt = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetSeatBelt"] = nfuzion.message.vehicle.GetSeatBelt;
nfuzion.message.vehicle.GetSeatBelt.__name__ = ["nfuzion","message","vehicle","GetSeatBelt"];
nfuzion.message.vehicle.GetSeatBelt.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetSeatBelt.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetSeatBelt
});
nfuzion.message.vehicle.GetSpeed = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetSpeed"] = nfuzion.message.vehicle.GetSpeed;
nfuzion.message.vehicle.GetSpeed.__name__ = ["nfuzion","message","vehicle","GetSpeed"];
nfuzion.message.vehicle.GetSpeed.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetSpeed.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetSpeed
});
nfuzion.message.vehicle.GetStarted = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetStarted"] = nfuzion.message.vehicle.GetStarted;
nfuzion.message.vehicle.GetStarted.__name__ = ["nfuzion","message","vehicle","GetStarted"];
nfuzion.message.vehicle.GetStarted.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetStarted.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetStarted
});
nfuzion.message.vehicle.GetTractionControl = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetTractionControl"] = nfuzion.message.vehicle.GetTractionControl;
nfuzion.message.vehicle.GetTractionControl.__name__ = ["nfuzion","message","vehicle","GetTractionControl"];
nfuzion.message.vehicle.GetTractionControl.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetTractionControl.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetTractionControl
});
nfuzion.message.vehicle.GetTransmission = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetTransmission"] = nfuzion.message.vehicle.GetTransmission;
nfuzion.message.vehicle.GetTransmission.__name__ = ["nfuzion","message","vehicle","GetTransmission"];
nfuzion.message.vehicle.GetTransmission.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetTransmission.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetTransmission
});
nfuzion.message.vehicle.GetTurnSignal = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetTurnSignal"] = nfuzion.message.vehicle.GetTurnSignal;
nfuzion.message.vehicle.GetTurnSignal.__name__ = ["nfuzion","message","vehicle","GetTurnSignal"];
nfuzion.message.vehicle.GetTurnSignal.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetTurnSignal.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetTurnSignal
});
nfuzion.message.vehicle.GetWaterTemperature = function() {
	nfuzion.message.generic.templates.Get.call(this);
};
$hxClasses["nfuzion.message.vehicle.GetWaterTemperature"] = nfuzion.message.vehicle.GetWaterTemperature;
nfuzion.message.vehicle.GetWaterTemperature.__name__ = ["nfuzion","message","vehicle","GetWaterTemperature"];
nfuzion.message.vehicle.GetWaterTemperature.__super__ = nfuzion.message.generic.templates.Get;
nfuzion.message.vehicle.GetWaterTemperature.prototype = $extend(nfuzion.message.generic.templates.Get.prototype,{
	__class__: nfuzion.message.vehicle.GetWaterTemperature
});
nfuzion.message.vehicle.LetABS = function(value) {
	nfuzion.message.generic.templates.LetBool.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.LetABS"] = nfuzion.message.vehicle.LetABS;
nfuzion.message.vehicle.LetABS.__name__ = ["nfuzion","message","vehicle","LetABS"];
nfuzion.message.vehicle.LetABS.__super__ = nfuzion.message.generic.templates.LetBool;
nfuzion.message.vehicle.LetABS.prototype = $extend(nfuzion.message.generic.templates.LetBool.prototype,{
	__class__: nfuzion.message.vehicle.LetABS
});
nfuzion.message.vehicle.LetAirbag = function(value) {
	nfuzion.message.generic.templates.LetBool.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.LetAirbag"] = nfuzion.message.vehicle.LetAirbag;
nfuzion.message.vehicle.LetAirbag.__name__ = ["nfuzion","message","vehicle","LetAirbag"];
nfuzion.message.vehicle.LetAirbag.__super__ = nfuzion.message.generic.templates.LetBool;
nfuzion.message.vehicle.LetAirbag.prototype = $extend(nfuzion.message.generic.templates.LetBool.prototype,{
	__class__: nfuzion.message.vehicle.LetAirbag
});
nfuzion.message.vehicle.LetBattery = function(value) {
	nfuzion.message.generic.templates.LetBool.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.LetBattery"] = nfuzion.message.vehicle.LetBattery;
nfuzion.message.vehicle.LetBattery.__name__ = ["nfuzion","message","vehicle","LetBattery"];
nfuzion.message.vehicle.LetBattery.__super__ = nfuzion.message.generic.templates.LetBool;
nfuzion.message.vehicle.LetBattery.prototype = $extend(nfuzion.message.generic.templates.LetBool.prototype,{
	__class__: nfuzion.message.vehicle.LetBattery
});
nfuzion.message.vehicle.LetDistanceToEmpty = function(value) {
	nfuzion.message.generic.templates.LetFloat.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.LetDistanceToEmpty"] = nfuzion.message.vehicle.LetDistanceToEmpty;
nfuzion.message.vehicle.LetDistanceToEmpty.__name__ = ["nfuzion","message","vehicle","LetDistanceToEmpty"];
nfuzion.message.vehicle.LetDistanceToEmpty.__super__ = nfuzion.message.generic.templates.LetFloat;
nfuzion.message.vehicle.LetDistanceToEmpty.prototype = $extend(nfuzion.message.generic.templates.LetFloat.prototype,{
	__class__: nfuzion.message.vehicle.LetDistanceToEmpty
});
nfuzion.message.vehicle.LetDriverDoorOpen = function(value) {
	nfuzion.message.generic.templates.LetBool.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.LetDriverDoorOpen"] = nfuzion.message.vehicle.LetDriverDoorOpen;
nfuzion.message.vehicle.LetDriverDoorOpen.__name__ = ["nfuzion","message","vehicle","LetDriverDoorOpen"];
nfuzion.message.vehicle.LetDriverDoorOpen.__super__ = nfuzion.message.generic.templates.LetBool;
nfuzion.message.vehicle.LetDriverDoorOpen.prototype = $extend(nfuzion.message.generic.templates.LetBool.prototype,{
	__class__: nfuzion.message.vehicle.LetDriverDoorOpen
});
nfuzion.message.vehicle.LetDriverSeated = function(value) {
	nfuzion.message.generic.templates.LetBool.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.LetDriverSeated"] = nfuzion.message.vehicle.LetDriverSeated;
nfuzion.message.vehicle.LetDriverSeated.__name__ = ["nfuzion","message","vehicle","LetDriverSeated"];
nfuzion.message.vehicle.LetDriverSeated.__super__ = nfuzion.message.generic.templates.LetBool;
nfuzion.message.vehicle.LetDriverSeated.prototype = $extend(nfuzion.message.generic.templates.LetBool.prototype,{
	__class__: nfuzion.message.vehicle.LetDriverSeated
});
nfuzion.message.vehicle.LetEmergencyBrake = function(value) {
	nfuzion.message.generic.templates.LetBool.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.LetEmergencyBrake"] = nfuzion.message.vehicle.LetEmergencyBrake;
nfuzion.message.vehicle.LetEmergencyBrake.__name__ = ["nfuzion","message","vehicle","LetEmergencyBrake"];
nfuzion.message.vehicle.LetEmergencyBrake.__super__ = nfuzion.message.generic.templates.LetBool;
nfuzion.message.vehicle.LetEmergencyBrake.prototype = $extend(nfuzion.message.generic.templates.LetBool.prototype,{
	__class__: nfuzion.message.vehicle.LetEmergencyBrake
});
nfuzion.message.vehicle.LetFuel = function(value) {
	nfuzion.message.generic.templates.LetFloat.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.LetFuel"] = nfuzion.message.vehicle.LetFuel;
nfuzion.message.vehicle.LetFuel.__name__ = ["nfuzion","message","vehicle","LetFuel"];
nfuzion.message.vehicle.LetFuel.__super__ = nfuzion.message.generic.templates.LetFloat;
nfuzion.message.vehicle.LetFuel.prototype = $extend(nfuzion.message.generic.templates.LetFloat.prototype,{
	__class__: nfuzion.message.vehicle.LetFuel
});
nfuzion.message.vehicle.LetGoodbye = function() {
	nfuzion.message.generic.templates.Let.call(this);
};
$hxClasses["nfuzion.message.vehicle.LetGoodbye"] = nfuzion.message.vehicle.LetGoodbye;
nfuzion.message.vehicle.LetGoodbye.__name__ = ["nfuzion","message","vehicle","LetGoodbye"];
nfuzion.message.vehicle.LetGoodbye.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.vehicle.LetGoodbye.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	__class__: nfuzion.message.vehicle.LetGoodbye
});
nfuzion.message.vehicle.LetHighBeam = function(value) {
	nfuzion.message.generic.templates.LetBool.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.LetHighBeam"] = nfuzion.message.vehicle.LetHighBeam;
nfuzion.message.vehicle.LetHighBeam.__name__ = ["nfuzion","message","vehicle","LetHighBeam"];
nfuzion.message.vehicle.LetHighBeam.__super__ = nfuzion.message.generic.templates.LetBool;
nfuzion.message.vehicle.LetHighBeam.prototype = $extend(nfuzion.message.generic.templates.LetBool.prototype,{
	__class__: nfuzion.message.vehicle.LetHighBeam
});
nfuzion.message.vehicle.LetLocked = function(value) {
	nfuzion.message.generic.templates.LetBool.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.LetLocked"] = nfuzion.message.vehicle.LetLocked;
nfuzion.message.vehicle.LetLocked.__name__ = ["nfuzion","message","vehicle","LetLocked"];
nfuzion.message.vehicle.LetLocked.__super__ = nfuzion.message.generic.templates.LetBool;
nfuzion.message.vehicle.LetLocked.prototype = $extend(nfuzion.message.generic.templates.LetBool.prototype,{
	__class__: nfuzion.message.vehicle.LetLocked
});
nfuzion.message.vehicle.LetOdometer = function(value) {
	nfuzion.message.generic.templates.LetFloat.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.LetOdometer"] = nfuzion.message.vehicle.LetOdometer;
nfuzion.message.vehicle.LetOdometer.__name__ = ["nfuzion","message","vehicle","LetOdometer"];
nfuzion.message.vehicle.LetOdometer.__super__ = nfuzion.message.generic.templates.LetFloat;
nfuzion.message.vehicle.LetOdometer.prototype = $extend(nfuzion.message.generic.templates.LetFloat.prototype,{
	__class__: nfuzion.message.vehicle.LetOdometer
});
nfuzion.message.vehicle.LetOil = function(value) {
	nfuzion.message.generic.templates.LetBool.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.LetOil"] = nfuzion.message.vehicle.LetOil;
nfuzion.message.vehicle.LetOil.__name__ = ["nfuzion","message","vehicle","LetOil"];
nfuzion.message.vehicle.LetOil.__super__ = nfuzion.message.generic.templates.LetBool;
nfuzion.message.vehicle.LetOil.prototype = $extend(nfuzion.message.generic.templates.LetBool.prototype,{
	__class__: nfuzion.message.vehicle.LetOil
});
nfuzion.message.vehicle.LetSeatBelt = function(value) {
	nfuzion.message.generic.templates.LetBool.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.LetSeatBelt"] = nfuzion.message.vehicle.LetSeatBelt;
nfuzion.message.vehicle.LetSeatBelt.__name__ = ["nfuzion","message","vehicle","LetSeatBelt"];
nfuzion.message.vehicle.LetSeatBelt.__super__ = nfuzion.message.generic.templates.LetBool;
nfuzion.message.vehicle.LetSeatBelt.prototype = $extend(nfuzion.message.generic.templates.LetBool.prototype,{
	__class__: nfuzion.message.vehicle.LetSeatBelt
});
nfuzion.message.vehicle.LetSpeed = function(value) {
	nfuzion.message.generic.templates.LetFloat.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.LetSpeed"] = nfuzion.message.vehicle.LetSpeed;
nfuzion.message.vehicle.LetSpeed.__name__ = ["nfuzion","message","vehicle","LetSpeed"];
nfuzion.message.vehicle.LetSpeed.__super__ = nfuzion.message.generic.templates.LetFloat;
nfuzion.message.vehicle.LetSpeed.prototype = $extend(nfuzion.message.generic.templates.LetFloat.prototype,{
	__class__: nfuzion.message.vehicle.LetSpeed
});
nfuzion.message.vehicle.LetStarted = function(value) {
	nfuzion.message.generic.templates.LetBool.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.LetStarted"] = nfuzion.message.vehicle.LetStarted;
nfuzion.message.vehicle.LetStarted.__name__ = ["nfuzion","message","vehicle","LetStarted"];
nfuzion.message.vehicle.LetStarted.__super__ = nfuzion.message.generic.templates.LetBool;
nfuzion.message.vehicle.LetStarted.prototype = $extend(nfuzion.message.generic.templates.LetBool.prototype,{
	__class__: nfuzion.message.vehicle.LetStarted
});
nfuzion.message.vehicle.LetTractionControl = function(value) {
	nfuzion.message.generic.templates.LetBool.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.LetTractionControl"] = nfuzion.message.vehicle.LetTractionControl;
nfuzion.message.vehicle.LetTractionControl.__name__ = ["nfuzion","message","vehicle","LetTractionControl"];
nfuzion.message.vehicle.LetTractionControl.__super__ = nfuzion.message.generic.templates.LetBool;
nfuzion.message.vehicle.LetTractionControl.prototype = $extend(nfuzion.message.generic.templates.LetBool.prototype,{
	__class__: nfuzion.message.vehicle.LetTractionControl
});
nfuzion.message.vehicle.type = {}
nfuzion.message.vehicle.type.TransmissionState = $hxClasses["nfuzion.message.vehicle.type.TransmissionState"] = { __ename__ : ["nfuzion","message","vehicle","type","TransmissionState"], __constructs__ : ["park","reverse","nuetral","overdrive","drive","low2","low1"] }
nfuzion.message.vehicle.type.TransmissionState.park = ["park",0];
nfuzion.message.vehicle.type.TransmissionState.park.toString = $estr;
nfuzion.message.vehicle.type.TransmissionState.park.__enum__ = nfuzion.message.vehicle.type.TransmissionState;
nfuzion.message.vehicle.type.TransmissionState.reverse = ["reverse",1];
nfuzion.message.vehicle.type.TransmissionState.reverse.toString = $estr;
nfuzion.message.vehicle.type.TransmissionState.reverse.__enum__ = nfuzion.message.vehicle.type.TransmissionState;
nfuzion.message.vehicle.type.TransmissionState.nuetral = ["nuetral",2];
nfuzion.message.vehicle.type.TransmissionState.nuetral.toString = $estr;
nfuzion.message.vehicle.type.TransmissionState.nuetral.__enum__ = nfuzion.message.vehicle.type.TransmissionState;
nfuzion.message.vehicle.type.TransmissionState.overdrive = ["overdrive",3];
nfuzion.message.vehicle.type.TransmissionState.overdrive.toString = $estr;
nfuzion.message.vehicle.type.TransmissionState.overdrive.__enum__ = nfuzion.message.vehicle.type.TransmissionState;
nfuzion.message.vehicle.type.TransmissionState.drive = ["drive",4];
nfuzion.message.vehicle.type.TransmissionState.drive.toString = $estr;
nfuzion.message.vehicle.type.TransmissionState.drive.__enum__ = nfuzion.message.vehicle.type.TransmissionState;
nfuzion.message.vehicle.type.TransmissionState.low2 = ["low2",5];
nfuzion.message.vehicle.type.TransmissionState.low2.toString = $estr;
nfuzion.message.vehicle.type.TransmissionState.low2.__enum__ = nfuzion.message.vehicle.type.TransmissionState;
nfuzion.message.vehicle.type.TransmissionState.low1 = ["low1",6];
nfuzion.message.vehicle.type.TransmissionState.low1.toString = $estr;
nfuzion.message.vehicle.type.TransmissionState.low1.__enum__ = nfuzion.message.vehicle.type.TransmissionState;
nfuzion.message.vehicle.LetTransmission = function(state) {
	nfuzion.message.generic.templates.Let.call(this);
	this.state = state;
};
$hxClasses["nfuzion.message.vehicle.LetTransmission"] = nfuzion.message.vehicle.LetTransmission;
nfuzion.message.vehicle.LetTransmission.__name__ = ["nfuzion","message","vehicle","LetTransmission"];
nfuzion.message.vehicle.LetTransmission.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.vehicle.LetTransmission.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	state: null
	,__class__: nfuzion.message.vehicle.LetTransmission
});
nfuzion.message.vehicle.type.TurnSignalState = $hxClasses["nfuzion.message.vehicle.type.TurnSignalState"] = { __ename__ : ["nfuzion","message","vehicle","type","TurnSignalState"], __constructs__ : ["none","left","right","both"] }
nfuzion.message.vehicle.type.TurnSignalState.none = ["none",0];
nfuzion.message.vehicle.type.TurnSignalState.none.toString = $estr;
nfuzion.message.vehicle.type.TurnSignalState.none.__enum__ = nfuzion.message.vehicle.type.TurnSignalState;
nfuzion.message.vehicle.type.TurnSignalState.left = ["left",1];
nfuzion.message.vehicle.type.TurnSignalState.left.toString = $estr;
nfuzion.message.vehicle.type.TurnSignalState.left.__enum__ = nfuzion.message.vehicle.type.TurnSignalState;
nfuzion.message.vehicle.type.TurnSignalState.right = ["right",2];
nfuzion.message.vehicle.type.TurnSignalState.right.toString = $estr;
nfuzion.message.vehicle.type.TurnSignalState.right.__enum__ = nfuzion.message.vehicle.type.TurnSignalState;
nfuzion.message.vehicle.type.TurnSignalState.both = ["both",3];
nfuzion.message.vehicle.type.TurnSignalState.both.toString = $estr;
nfuzion.message.vehicle.type.TurnSignalState.both.__enum__ = nfuzion.message.vehicle.type.TurnSignalState;
nfuzion.message.vehicle.LetTurnSignal = function(state) {
	nfuzion.message.generic.templates.Let.call(this);
	this.state = state;
};
$hxClasses["nfuzion.message.vehicle.LetTurnSignal"] = nfuzion.message.vehicle.LetTurnSignal;
nfuzion.message.vehicle.LetTurnSignal.__name__ = ["nfuzion","message","vehicle","LetTurnSignal"];
nfuzion.message.vehicle.LetTurnSignal.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.vehicle.LetTurnSignal.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	state: null
	,__class__: nfuzion.message.vehicle.LetTurnSignal
});
nfuzion.message.vehicle.LetWaterTemperature = function(value) {
	nfuzion.message.generic.templates.LetFloat.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.LetWaterTemperature"] = nfuzion.message.vehicle.LetWaterTemperature;
nfuzion.message.vehicle.LetWaterTemperature.__name__ = ["nfuzion","message","vehicle","LetWaterTemperature"];
nfuzion.message.vehicle.LetWaterTemperature.__super__ = nfuzion.message.generic.templates.LetFloat;
nfuzion.message.vehicle.LetWaterTemperature.prototype = $extend(nfuzion.message.generic.templates.LetFloat.prototype,{
	__class__: nfuzion.message.vehicle.LetWaterTemperature
});
nfuzion.message.vehicle.LetWelcome = function(title,subtitle) {
	nfuzion.message.generic.templates.Let.call(this);
	this.title = title;
	this.subtitle = subtitle;
};
$hxClasses["nfuzion.message.vehicle.LetWelcome"] = nfuzion.message.vehicle.LetWelcome;
nfuzion.message.vehicle.LetWelcome.__name__ = ["nfuzion","message","vehicle","LetWelcome"];
nfuzion.message.vehicle.LetWelcome.__super__ = nfuzion.message.generic.templates.Let;
nfuzion.message.vehicle.LetWelcome.prototype = $extend(nfuzion.message.generic.templates.Let.prototype,{
	subtitle: null
	,title: null
	,__class__: nfuzion.message.vehicle.LetWelcome
});
nfuzion.message.vehicle.SetHonk = function(value) {
	nfuzion.message.generic.templates.SetFloat.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.SetHonk"] = nfuzion.message.vehicle.SetHonk;
nfuzion.message.vehicle.SetHonk.__name__ = ["nfuzion","message","vehicle","SetHonk"];
nfuzion.message.vehicle.SetHonk.__super__ = nfuzion.message.generic.templates.SetFloat;
nfuzion.message.vehicle.SetHonk.prototype = $extend(nfuzion.message.generic.templates.SetFloat.prototype,{
	__class__: nfuzion.message.vehicle.SetHonk
});
nfuzion.message.vehicle.SetLocked = function(value) {
	nfuzion.message.generic.templates.SetBool.call(this,value);
};
$hxClasses["nfuzion.message.vehicle.SetLocked"] = nfuzion.message.vehicle.SetLocked;
nfuzion.message.vehicle.SetLocked.__name__ = ["nfuzion","message","vehicle","SetLocked"];
nfuzion.message.vehicle.SetLocked.__super__ = nfuzion.message.generic.templates.SetBool;
nfuzion.message.vehicle.SetLocked.prototype = $extend(nfuzion.message.generic.templates.SetBool.prototype,{
	__class__: nfuzion.message.vehicle.SetLocked
});
nfuzion.moduleLink = {}
nfuzion.moduleLink.IModuleLink = function() { }
$hxClasses["nfuzion.moduleLink.IModuleLink"] = nfuzion.moduleLink.IModuleLink;
nfuzion.moduleLink.IModuleLink.__name__ = ["nfuzion","moduleLink","IModuleLink"];
nfuzion.moduleLink.IModuleLink.__interfaces__ = [nfuzion.event.IEventDispatcher];
nfuzion.moduleLink.IModuleLink.prototype = {
	ready: null
	,__class__: nfuzion.moduleLink.IModuleLink
}
nfuzion.moduleLink.ModuleLink = function() {
	nfuzion.event.EventDispatcher.call(this);
};
$hxClasses["nfuzion.moduleLink.ModuleLink"] = nfuzion.moduleLink.ModuleLink;
nfuzion.moduleLink.ModuleLink.__name__ = ["nfuzion","moduleLink","ModuleLink"];
nfuzion.moduleLink.ModuleLink.__interfaces__ = [nfuzion.moduleLink.IModuleLink];
nfuzion.moduleLink.ModuleLink.__super__ = nfuzion.event.EventDispatcher;
nfuzion.moduleLink.ModuleLink.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	ready: null
	,__class__: nfuzion.moduleLink.ModuleLink
});
nfuzion.moduleLink.ClientModuleLink = function(client,name) {
	nfuzion.moduleLink.ModuleLink.call(this);
	this.name = name;
	this.client = client;
	this.ready = client.get_connected();
	if(this.ready) this.dispatchEvent(new nfuzion.moduleLink.event.ModuleLinkEvent("ready",this));
	client.addMessageListener(name,$bind(this,this.onClientMessage));
	client.addEventListener("SpanClientEvent.connect",$bind(this,this.onClientConnect));
	client.addEventListener("SpanClientEvent.disconnect",$bind(this,this.onClientDisconnect));
};
$hxClasses["nfuzion.moduleLink.ClientModuleLink"] = nfuzion.moduleLink.ClientModuleLink;
nfuzion.moduleLink.ClientModuleLink.__name__ = ["nfuzion","moduleLink","ClientModuleLink"];
nfuzion.moduleLink.ClientModuleLink.__super__ = nfuzion.moduleLink.ModuleLink;
nfuzion.moduleLink.ClientModuleLink.prototype = $extend(nfuzion.moduleLink.ModuleLink.prototype,{
	onClientMessage: function(e) {
		var className = e.className;
		var message = e.message;
		if(className.indexOf("Let") == 0) {
			var functionName = "on" + className;
			if(Lambda.has(Type.getInstanceFields(Type.getClass(this)),functionName)) Reflect.field(this,functionName).apply(this,[message]); else haxe.Log.trace("Function " + functionName + " not implemented.",{ fileName : "ClientModuleLink.hx", lineNumber : 72, className : "nfuzion.moduleLink.ClientModuleLink", methodName : "onClientMessage"});
		}
	}
	,sendMessage: function(message) {
		this.client.send(message);
	}
	,onClientDisconnect: function(e) {
		this.ready = false;
		this.dispatchEvent(new nfuzion.moduleLink.event.ModuleLinkEvent("ready",this));
	}
	,onClientConnect: function(e) {
		this.ready = true;
		this.dispatchEvent(new nfuzion.moduleLink.event.ModuleLinkEvent("ready",this));
	}
	,get_messageTypes: function() {
		return [this.name];
	}
	,messageTypes: null
	,client: null
	,name: null
	,__class__: nfuzion.moduleLink.ClientModuleLink
	,__properties__: {get_messageTypes:"get_messageTypes"}
});
nfuzion.moduleLink.IChime = function() { }
$hxClasses["nfuzion.moduleLink.IChime"] = nfuzion.moduleLink.IChime;
nfuzion.moduleLink.IChime.__name__ = ["nfuzion","moduleLink","IChime"];
nfuzion.moduleLink.IChime.__interfaces__ = [nfuzion.moduleLink.IModuleLink];
nfuzion.moduleLink.IChime.prototype = {
	getChime: null
	,setChime: null
	,__class__: nfuzion.moduleLink.IChime
}
nfuzion.moduleLink.ChimeProxy = function(client) {
	nfuzion.moduleLink.ClientModuleLink.call(this,client,"chime");
};
$hxClasses["nfuzion.moduleLink.ChimeProxy"] = nfuzion.moduleLink.ChimeProxy;
nfuzion.moduleLink.ChimeProxy.__name__ = ["nfuzion","moduleLink","ChimeProxy"];
nfuzion.moduleLink.ChimeProxy.__interfaces__ = [nfuzion.moduleLink.IChime];
nfuzion.moduleLink.ChimeProxy.__super__ = nfuzion.moduleLink.ClientModuleLink;
nfuzion.moduleLink.ChimeProxy.prototype = $extend(nfuzion.moduleLink.ClientModuleLink.prototype,{
	getChime: function() {
	}
	,setChime: function(chime,playCount) {
		if(playCount == null) playCount = 1;
		this.sendMessage(new nfuzion.message.chime.SetChime(chime,playCount));
	}
	,__class__: nfuzion.moduleLink.ChimeProxy
});
nfuzion.moduleLink.ILeap = function() { }
$hxClasses["nfuzion.moduleLink.ILeap"] = nfuzion.moduleLink.ILeap;
nfuzion.moduleLink.ILeap.__name__ = ["nfuzion","moduleLink","ILeap"];
nfuzion.moduleLink.ILeap.__interfaces__ = [nfuzion.event.IEventDispatcher];
nfuzion.moduleLink.ILeap.prototype = {
	onLetZoom: null
	,onLetPoke: null
	,onLetScroll: null
	,onLetRotate: null
	,onLetGesture: null
	,onLetCursor: null
	,__class__: nfuzion.moduleLink.ILeap
}
nfuzion.moduleLink.INavigation = function() { }
$hxClasses["nfuzion.moduleLink.INavigation"] = nfuzion.moduleLink.INavigation;
nfuzion.moduleLink.INavigation.__name__ = ["nfuzion","moduleLink","INavigation"];
nfuzion.moduleLink.INavigation.__interfaces__ = [nfuzion.moduleLink.IModuleLink];
nfuzion.moduleLink.INavigation.prototype = {
	cancelNavigation: null
	,requestNewRoute: null
	,removeWaypoint: null
	,insertWaypoint: null
	,addWaypoint: null
	,setEndByAddress: null
	,setEndByPoint: null
	,setStartByAddress: null
	,setStartByPoint: null
	,clearRoute: null
	,getWaypoints: null
	,waypoints: null
	,getNextTurn: null
	,nextTurn: null
	,getRoute: null
	,route: null
	,getDistancePercentage: null
	,distancePercentage: null
	,getDistance: null
	,distance: null
	,__class__: nfuzion.moduleLink.INavigation
}
nfuzion.moduleLink.IVehicle = function() { }
$hxClasses["nfuzion.moduleLink.IVehicle"] = nfuzion.moduleLink.IVehicle;
nfuzion.moduleLink.IVehicle.__name__ = ["nfuzion","moduleLink","IVehicle"];
nfuzion.moduleLink.IVehicle.__interfaces__ = [nfuzion.moduleLink.IModuleLink];
nfuzion.moduleLink.IVehicle.prototype = {
	getWaterTemperature: null
	,waterTemperature: null
	,getTurnSignal: null
	,turnSignal: null
	,getTransmission: null
	,transmission: null
	,getTractionControl: null
	,tractionControl: null
	,getSpeed: null
	,speed: null
	,getSeatBelt: null
	,seatBelt: null
	,getOil: null
	,oil: null
	,getOdometer: null
	,odometer: null
	,getHighBeam: null
	,highBeam: null
	,getFuel: null
	,fuel: null
	,getEmergencyBrake: null
	,emergencyBrake: null
	,getDistanceToEmpty: null
	,distanceToEmpty: null
	,getBattery: null
	,battery: null
	,getAirBag: null
	,airBag: null
	,getABS: null
	,abs: null
	,setHonk: null
	,setLocked: null
	,getLocked: null
	,locked: null
	,getStarted: null
	,started: null
	,getDriverSeated: null
	,driverSeated: null
	,getDriverDoorOpen: null
	,driverDoorOpen: null
	,welcomeSubtitle: null
	,welcomeTitle: null
	,__class__: nfuzion.moduleLink.IVehicle
}
nfuzion.moduleLink.IWindow = function() { }
$hxClasses["nfuzion.moduleLink.IWindow"] = nfuzion.moduleLink.IWindow;
nfuzion.moduleLink.IWindow.__name__ = ["nfuzion","moduleLink","IWindow"];
nfuzion.moduleLink.IWindow.__interfaces__ = [nfuzion.moduleLink.IModuleLink];
nfuzion.moduleLink.IWindow.prototype = {
	BringToFront: null
	,__class__: nfuzion.moduleLink.IWindow
}
nfuzion.moduleLink.LeapProxy = function(client) {
	nfuzion.moduleLink.ClientModuleLink.call(this,client,"leap");
};
$hxClasses["nfuzion.moduleLink.LeapProxy"] = nfuzion.moduleLink.LeapProxy;
nfuzion.moduleLink.LeapProxy.__name__ = ["nfuzion","moduleLink","LeapProxy"];
nfuzion.moduleLink.LeapProxy.__interfaces__ = [nfuzion.moduleLink.ILeap];
nfuzion.moduleLink.LeapProxy.__super__ = nfuzion.moduleLink.ClientModuleLink;
nfuzion.moduleLink.LeapProxy.prototype = $extend(nfuzion.moduleLink.ClientModuleLink.prototype,{
	onLetZoom: function(message) {
		this.dispatchEvent(nfuzion.moduleLink.event.LeapEvent.createZoomEvent(message.deltaZoom,message.fingerCount));
	}
	,onLetPoke: function(message) {
		this.dispatchEvent(nfuzion.moduleLink.event.LeapEvent.createPokeEvent(message.x,message.y,message.fingerCount,message.clickCount));
	}
	,onLetScroll: function(message) {
		this.dispatchEvent(nfuzion.moduleLink.event.LeapEvent.createScrollEvent(message.deltaX,message.deltaY,message.velocityX,message.velocityY,message.phase,message.fingerCount));
	}
	,onLetRotate: function(message) {
		this.dispatchEvent(nfuzion.moduleLink.event.LeapEvent.createRotateEvent(message.deltaAngle,message.fingerCount));
	}
	,onLetGesture: function(message) {
		this.dispatchEvent(nfuzion.moduleLink.event.LeapEvent.createGestureEvent(message.gesture));
	}
	,onLetCursor: function(message) {
		this.dispatchEvent(nfuzion.moduleLink.event.LeapEvent.createCursorEvent(message.x,message.y,message.phase));
	}
	,__class__: nfuzion.moduleLink.LeapProxy
});
nfuzion.moduleLink.NavigationProxy = function(client) {
	nfuzion.moduleLink.ClientModuleLink.call(this,client,"navigation");
};
$hxClasses["nfuzion.moduleLink.NavigationProxy"] = nfuzion.moduleLink.NavigationProxy;
nfuzion.moduleLink.NavigationProxy.__name__ = ["nfuzion","moduleLink","NavigationProxy"];
nfuzion.moduleLink.NavigationProxy.__interfaces__ = [nfuzion.moduleLink.INavigation];
nfuzion.moduleLink.NavigationProxy.__super__ = nfuzion.moduleLink.ClientModuleLink;
nfuzion.moduleLink.NavigationProxy.prototype = $extend(nfuzion.moduleLink.ClientModuleLink.prototype,{
	cancelNavigation: function() {
		this.sendMessage(new nfuzion.message.navigation.SetCancel());
	}
	,requestNewRoute: function(type) {
		this.sendMessage(new nfuzion.message.navigation.SetRequestNewRoute(type));
	}
	,removeWaypoint: function(index) {
		this.sendMessage(new nfuzion.message.navigation.SetRemoveWaypoint(index));
	}
	,insertWaypoint: function(index,waypoint) {
		this.sendMessage(new nfuzion.message.navigation.SetInsertWaypoint(index,waypoint));
	}
	,addWaypoint: function(waypoint) {
		this.sendMessage(new nfuzion.message.navigation.SetAddWaypoint(waypoint));
	}
	,setEndByAddress: function(end) {
		this.sendMessage(new nfuzion.message.navigation.SetEndByAddress(end));
	}
	,setEndByPoint: function(end) {
		this.sendMessage(new nfuzion.message.navigation.SetEndByPoint(end.x,end.y));
	}
	,setStartByAddress: function(start) {
		this.sendMessage(new nfuzion.message.navigation.SetStartByAddress(start));
	}
	,setStartByPoint: function(start) {
		this.sendMessage(new nfuzion.message.navigation.SetStartByPoint(start.x,start.y));
	}
	,clearRoute: function() {
		this.sendMessage(new nfuzion.message.navigation.SetClearRoute());
	}
	,getWaypoints: function() {
		this.sendMessage(new nfuzion.message.navigation.GetWaypoints());
	}
	,waypoints: null
	,getNextTurn: function() {
		this.sendMessage(new nfuzion.message.navigation.GetNextTurn());
	}
	,nextTurn: null
	,getRoute: function() {
		this.sendMessage(new nfuzion.message.navigation.GetRoute());
	}
	,route: null
	,getDistancePercentage: function() {
		this.sendMessage(new nfuzion.message.navigation.GetDistancePercentage());
	}
	,distancePercentage: null
	,getDistance: function() {
		this.sendMessage(new nfuzion.message.navigation.GetDistance());
	}
	,distance: null
	,onLetCancel: function(message) {
		haxe.Log.trace("CANCEL!",{ fileName : "NavigationProxy.hx", lineNumber : 115, className : "nfuzion.moduleLink.NavigationProxy", methodName : "onLetCancel"});
		this.dispatchEvent(new nfuzion.moduleLink.event.NavigationEvent("navigationCancel"));
	}
	,onLetDistancePercentage: function(message) {
		this.distancePercentage = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.NavigationEvent("navigationDistancePercentage"));
	}
	,onLetDistance: function(message) {
		this.distance = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.NavigationEvent("navigationDistance"));
	}
	,onLetDestination: function(message) {
		this.dispatchEvent(new nfuzion.moduleLink.event.NavigationEvent("navigationDestination"));
	}
	,onLetWaypoints: function(message) {
		this.waypoints = message.waypoints;
		this.dispatchEvent(new nfuzion.moduleLink.event.NavigationEvent("navigationWaypoints"));
	}
	,onLetRoute: function(message) {
		this.route = message.route;
		this.dispatchEvent(new nfuzion.moduleLink.event.NavigationEvent("navigationRoute"));
	}
	,onLetNextTurn: function(message) {
		this.nextTurn = message.nextTurn;
		this.dispatchEvent(new nfuzion.moduleLink.event.NavigationEvent("navigationTurn"));
	}
	,__class__: nfuzion.moduleLink.NavigationProxy
});
nfuzion.moduleLink.VehicleProxy = function(client) {
	nfuzion.moduleLink.ClientModuleLink.call(this,client,"vehicle");
};
$hxClasses["nfuzion.moduleLink.VehicleProxy"] = nfuzion.moduleLink.VehicleProxy;
nfuzion.moduleLink.VehicleProxy.__name__ = ["nfuzion","moduleLink","VehicleProxy"];
nfuzion.moduleLink.VehicleProxy.__interfaces__ = [nfuzion.moduleLink.IVehicle];
nfuzion.moduleLink.VehicleProxy.__super__ = nfuzion.moduleLink.ClientModuleLink;
nfuzion.moduleLink.VehicleProxy.prototype = $extend(nfuzion.moduleLink.ClientModuleLink.prototype,{
	onLetGoodbye: function(message) {
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("goodbye"));
	}
	,onLetWelcome: function(message) {
		this.welcomeTitle = message.title;
		this.welcomeSubtitle = message.subtitle;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("welcome"));
	}
	,onLetWaterTemperature: function(message) {
		this.waterTemperature = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("waterTemperature"));
	}
	,onLetTurnSignal: function(message) {
		this.turnSignal = message.state;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("turnSignal"));
	}
	,onLetTransmission: function(message) {
		this.transmission = message.state;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("transmission"));
	}
	,onLetTractionControl: function(message) {
		this.tractionControl = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("tractionControl"));
	}
	,onLetStarted: function(message) {
		this.started = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("started"));
	}
	,onLetSpeed: function(message) {
		this.speed = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("speed"));
	}
	,onLetSeatBelt: function(message) {
		this.seatBelt = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("seatBelt"));
	}
	,onLetOil: function(message) {
		this.oil = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("oil"));
	}
	,onLetOdometer: function(message) {
		this.odometer = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("odometer"));
	}
	,onLetLocked: function(message) {
		this.locked = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("doorsLocked"));
	}
	,onLetHighBeam: function(message) {
		this.highBeam = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("highBeam"));
	}
	,onLetFuel: function(message) {
		this.fuel = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("fuel"));
	}
	,onLetEmergencyBrake: function(message) {
		this.emergencyBrake = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("emergencyBrake"));
	}
	,onLetDriverSeated: function(message) {
		this.driverSeated = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("driverSeated"));
	}
	,onLetDriverDoorOpen: function(message) {
		this.driverDoorOpen = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("driverDoorOpen"));
	}
	,onLetDistanceToEmpty: function(message) {
		this.distanceToEmpty = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("distanceToEmpty"));
	}
	,onLetBattery: function(message) {
		this.battery = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("battery"));
	}
	,onLetABS: function(message) {
		this.abs = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("abs"));
	}
	,onLetAirbag: function(message) {
		this.airBag = message.value;
		this.dispatchEvent(new nfuzion.moduleLink.event.VehicleEvent("airBag"));
	}
	,getWaterTemperature: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetWaterTemperature());
	}
	,waterTemperature: null
	,getTurnSignal: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetTurnSignal());
	}
	,turnSignal: null
	,getTransmission: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetTransmission());
	}
	,transmission: null
	,getTractionControl: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetTractionControl());
	}
	,tractionControl: null
	,getStarted: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetStarted());
	}
	,started: null
	,getSpeed: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetSpeed());
	}
	,speed: null
	,getSeatBelt: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetSeatBelt());
	}
	,seatBelt: null
	,getOil: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetOil());
	}
	,oil: null
	,getOdometer: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetOdometer());
	}
	,odometer: null
	,setHonk: function(honk) {
		this.sendMessage(new nfuzion.message.vehicle.SetHonk(honk));
	}
	,getHighBeam: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetHighBeam());
	}
	,highBeam: null
	,setLocked: function(lock) {
		this.sendMessage(new nfuzion.message.vehicle.SetLocked(lock));
	}
	,getLocked: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetLocked());
	}
	,locked: null
	,getFuel: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetFuel());
	}
	,fuel: null
	,getEmergencyBrake: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetEmergencyBrake());
	}
	,emergencyBrake: null
	,getDriverSeated: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetDriverSeated());
	}
	,driverSeated: null
	,getDriverDoorOpen: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetDriverDoorOpen());
	}
	,driverDoorOpen: null
	,getDistanceToEmpty: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetDistanceToEmpty());
	}
	,distanceToEmpty: null
	,getBattery: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetBattery());
	}
	,battery: null
	,getAirBag: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetAirbag());
	}
	,airBag: null
	,getABS: function() {
		this.sendMessage(new nfuzion.message.vehicle.GetABS());
	}
	,abs: null
	,welcomeSubtitle: null
	,welcomeTitle: null
	,__class__: nfuzion.moduleLink.VehicleProxy
});
nfuzion.moduleLink.event = {}
nfuzion.moduleLink.event.LeapEvent = function(type) {
	nfuzion.event.Event.call(this,type);
	this.x = 0;
	this.y = 0;
	this.phase = null;
	this.gesture = null;
	this.deltaX = 0;
	this.deltaY = 0;
	this.deltaAngle = 0;
	this.fingerCount = 0;
	this.velocityX = 0;
	this.velocityY = 0;
	this.clickCount = 0;
	this.deltaZoom = 0;
};
$hxClasses["nfuzion.moduleLink.event.LeapEvent"] = nfuzion.moduleLink.event.LeapEvent;
nfuzion.moduleLink.event.LeapEvent.__name__ = ["nfuzion","moduleLink","event","LeapEvent"];
nfuzion.moduleLink.event.LeapEvent.createCursorEvent = function(x,y,phase) {
	var event = new nfuzion.moduleLink.event.LeapEvent("leapCursor");
	event.x = x;
	event.y = y;
	event.phase = phase;
	return event;
}
nfuzion.moduleLink.event.LeapEvent.createGestureEvent = function(gesture) {
	var event = new nfuzion.moduleLink.event.LeapEvent("leapGesture");
	event.gesture = gesture;
	return event;
}
nfuzion.moduleLink.event.LeapEvent.createRotateEvent = function(deltaAngle,fingerCount) {
	var event = new nfuzion.moduleLink.event.LeapEvent("leapRotate");
	event.deltaAngle = deltaAngle;
	event.fingerCount = fingerCount;
	return event;
}
nfuzion.moduleLink.event.LeapEvent.createScrollEvent = function(deltaX,deltaY,velocityX,velocityY,phase,fingerCount) {
	var event = new nfuzion.moduleLink.event.LeapEvent("leapCursor");
	event.deltaX = deltaX;
	event.deltaY = deltaY;
	event.velocityX = velocityX;
	event.velocityY = velocityY;
	event.phase = phase;
	event.fingerCount = fingerCount;
	return event;
}
nfuzion.moduleLink.event.LeapEvent.createPokeEvent = function(x,y,fingerCount,clickCount) {
	var event = new nfuzion.moduleLink.event.LeapEvent("leapCursor");
	event.x = x;
	event.y = y;
	event.fingerCount = fingerCount;
	event.clickCount = clickCount;
	return event;
}
nfuzion.moduleLink.event.LeapEvent.createZoomEvent = function(deltaZoom,fingerCount) {
	var event = new nfuzion.moduleLink.event.LeapEvent("leapCursor");
	event.deltaZoom = deltaZoom;
	event.fingerCount = fingerCount;
	return event;
}
nfuzion.moduleLink.event.LeapEvent.__super__ = nfuzion.event.Event;
nfuzion.moduleLink.event.LeapEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	deltaZoom: null
	,clickCount: null
	,velocityY: null
	,velocityX: null
	,deltaY: null
	,deltaX: null
	,fingerCount: null
	,deltaAngle: null
	,gesture: null
	,phase: null
	,y: null
	,x: null
	,__class__: nfuzion.moduleLink.event.LeapEvent
});
nfuzion.moduleLink.event.MagicScrollEvent = function(type,deltaX,deltaY,velocityX,velocityY,phase,fingerCount) {
	nfuzion.event.Event.call(this,type);
	this.deltaX = deltaX;
	this.deltaY = deltaY;
	this.velocityX = velocityX;
	this.velocityY = velocityY;
	this.phase = phase;
	this.fingerCount = fingerCount;
};
$hxClasses["nfuzion.moduleLink.event.MagicScrollEvent"] = nfuzion.moduleLink.event.MagicScrollEvent;
nfuzion.moduleLink.event.MagicScrollEvent.__name__ = ["nfuzion","moduleLink","event","MagicScrollEvent"];
nfuzion.moduleLink.event.MagicScrollEvent.__super__ = nfuzion.event.Event;
nfuzion.moduleLink.event.MagicScrollEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	fingerCount: null
	,phase: null
	,velocityY: null
	,velocityX: null
	,deltaY: null
	,deltaX: null
	,__class__: nfuzion.moduleLink.event.MagicScrollEvent
});
nfuzion.moduleLink.event.MediaPlayerEvent = function(type,partialList) {
	nfuzion.event.Event.call(this,type);
	this.partialList = partialList;
};
$hxClasses["nfuzion.moduleLink.event.MediaPlayerEvent"] = nfuzion.moduleLink.event.MediaPlayerEvent;
nfuzion.moduleLink.event.MediaPlayerEvent.__name__ = ["nfuzion","moduleLink","event","MediaPlayerEvent"];
nfuzion.moduleLink.event.MediaPlayerEvent.__super__ = nfuzion.event.Event;
nfuzion.moduleLink.event.MediaPlayerEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	partialList: null
	,__class__: nfuzion.moduleLink.event.MediaPlayerEvent
});
nfuzion.moduleLink.event.ModuleLinkEvent = function(type,target) {
	nfuzion.event.Event.call(this,type);
	this.target = target;
};
$hxClasses["nfuzion.moduleLink.event.ModuleLinkEvent"] = nfuzion.moduleLink.event.ModuleLinkEvent;
nfuzion.moduleLink.event.ModuleLinkEvent.__name__ = ["nfuzion","moduleLink","event","ModuleLinkEvent"];
nfuzion.moduleLink.event.ModuleLinkEvent.__super__ = nfuzion.event.Event;
nfuzion.moduleLink.event.ModuleLinkEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	target: null
	,__class__: nfuzion.moduleLink.event.ModuleLinkEvent
});
nfuzion.moduleLink.event.NavigationEvent = function(type,data) {
	nfuzion.event.Event.call(this,type);
	this.data = data;
};
$hxClasses["nfuzion.moduleLink.event.NavigationEvent"] = nfuzion.moduleLink.event.NavigationEvent;
nfuzion.moduleLink.event.NavigationEvent.__name__ = ["nfuzion","moduleLink","event","NavigationEvent"];
nfuzion.moduleLink.event.NavigationEvent.__super__ = nfuzion.event.Event;
nfuzion.moduleLink.event.NavigationEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	data: null
	,__class__: nfuzion.moduleLink.event.NavigationEvent
});
nfuzion.moduleLink.event.VehicleEvent = function(type) {
	nfuzion.event.Event.call(this,type);
};
$hxClasses["nfuzion.moduleLink.event.VehicleEvent"] = nfuzion.moduleLink.event.VehicleEvent;
nfuzion.moduleLink.event.VehicleEvent.__name__ = ["nfuzion","moduleLink","event","VehicleEvent"];
nfuzion.moduleLink.event.VehicleEvent.__super__ = nfuzion.event.Event;
nfuzion.moduleLink.event.VehicleEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	__class__: nfuzion.moduleLink.event.VehicleEvent
});
nfuzion.nTactic.core = {}
nfuzion.nTactic.core.AppModel = function() {
	nfuzion.event.EventDispatcher.call(this);
	this.screenModels = new Array();
	this.screenDictionary = new haxe.ds.StringMap();
	var $it0 = nfuzion.nTactic.NTactic.configurationXml.elementsNamed("model");
	while( $it0.hasNext() ) {
		var screenModelXml = $it0.next();
		var screenModel = new nfuzion.nTactic.core.ScreenModel(this,nfuzion.nTactic.NTactic.layers);
		this.screenModels.push(screenModel);
		screenModel.initialize(screenModelXml);
		if(this.defaultModel == null) this.defaultModel = screenModel;
		screenModel.addEventListener("goto",$bind(this,this.propagateEvent));
		screenModel.addEventListener("afterGoto",$bind(this,this.propagateEvent));
		screenModel.addEventListener("branchLoaded",$bind(this,this.propagateEvent));
	}
};
$hxClasses["nfuzion.nTactic.core.AppModel"] = nfuzion.nTactic.core.AppModel;
nfuzion.nTactic.core.AppModel.__name__ = ["nfuzion","nTactic","core","AppModel"];
nfuzion.nTactic.core.AppModel.__super__ = nfuzion.event.EventDispatcher;
nfuzion.nTactic.core.AppModel.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	exit: function(modelId) {
		this.getModel(modelId).exit();
	}
	,captureExit: function(modelId) {
		this.getModel(modelId).captureExit();
	}
	,setExit: function(modelId) {
		this.getModel(modelId).setExit();
	}
	,back: function(modelId) {
		this.getModel(modelId).back();
	}
	,'goto': function(branch,vars,addToHistory) {
		if(addToHistory == null) addToHistory = true;
		haxe.Log.trace("NOTICE: Loading: " + branch,{ fileName : "AppModel.hx", lineNumber : 158, className : "nfuzion.nTactic.core.AppModel", methodName : "goto"});
		var addressArray = branch.split(":");
		if(addressArray.length > 1) {
			var model;
			model = this.getModel(addressArray[0]);
			if(model != null) model["goto"](addressArray[1],vars,addToHistory); else haxe.Log.trace("ERROR: Could not find screen model: " + addressArray[0],{ fileName : "AppModel.hx", lineNumber : 173, className : "nfuzion.nTactic.core.AppModel", methodName : "goto"});
		} else this.defaultModel["goto"](addressArray[0],vars,addToHistory);
	}
	,propagateEvent: function(e) {
		this.dispatchEvent(e);
	}
	,onInitialBranchLoaded: function(e) {
		if(e != null) {
			var model = this.getModel(e.modelId);
			model.removeEventListener("branchLoaded",$bind(this,this.onInitialBranchLoaded));
			model.initialBranchLoaded = true;
		}
		var ready = true;
		var _g = 0, _g1 = this.screenModels;
		while(_g < _g1.length) {
			var model = _g1[_g];
			++_g;
			if(model.initialBranch != null && model.initialBranch != "") {
				if(!model.initialBranchLoaded) {
					ready = false;
					break;
				}
			}
		}
		if(ready) nfuzion.nTactic.NTactic.stage.set_visible(true);
	}
	,loadInitialScreens: function() {
		var _g = 0, _g1 = this.screenModels;
		while(_g < _g1.length) {
			var model = _g1[_g];
			++_g;
			if(model.initialBranch != null && model.initialBranch != "") {
				model["goto"](model.initialBranch);
				if(!model.initialBranchLoaded) model.addEventListener("branchLoaded",$bind(this,this.onInitialBranchLoaded)); else this.onInitialBranchLoaded();
			}
		}
	}
	,loadScreenModelBranch: function(screenModelId,branch,vars) {
		var _g1 = 0, _g = this.screenModels.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(screenModelId == this.screenModels[i].id) {
				this.screenModels[i]["goto"](branch,vars);
				break;
			}
		}
	}
	,getModel: function(modelId) {
		if(modelId == null) return this.defaultModel;
		var _g1 = 0, _g = this.screenModels.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.screenModels[i].id == modelId) return this.screenModels[i];
		}
		return null;
	}
	,getInitialBranch: function(screenModelId) {
		try {
			return this.getModel(screenModelId).initialBranch;
		} catch( message ) {
			if( js.Boot.__instanceof(message,String) ) {
			} else throw(message);
		}
		return "";
	}
	,mInitialGoto: null
	,screenDictionary: null
	,screenModels: null
	,defaultModel: null
	,__class__: nfuzion.nTactic.core.AppModel
});
nfuzion.nTactic.core.AppView = function() {
};
$hxClasses["nfuzion.nTactic.core.AppView"] = nfuzion.nTactic.core.AppView;
nfuzion.nTactic.core.AppView.__name__ = ["nfuzion","nTactic","core","AppView"];
nfuzion.nTactic.core.AppView.prototype = {
	getLayer: function(depth) {
		var layer = null;
		var component = nfuzion.nTactic.NTactic.stage.getChild(nfuzion.nTactic.core.Layer.getName(depth));
		if(component != null) layer = component;
		if(layer == null) {
			var index = -1;
			var _g1 = 0, _g = nfuzion.nTactic.NTactic.stage.get_childCount();
			while(_g1 < _g) {
				var i = _g1++;
				var component1 = nfuzion.nTactic.NTactic.stage.getChildAt(i);
				if(js.Boot.__instanceof(component1,nfuzion.nTactic.core.Layer)) {
					var currentLayer = component1;
					if(currentLayer.depth > depth) {
						index = i;
						break;
					}
				}
			}
			if(index == -1) index = nfuzion.nTactic.NTactic.stage.get_childCount();
			layer = new nfuzion.nTactic.core.Layer(depth);
			nfuzion.nTactic.NTactic.stage.insertChild(layer,index);
		}
		return layer;
	}
	,removeScreen: function(screen) {
		var layer = this.getLayer(screen.depth);
		layer.removeScreen(screen);
	}
	,addScreen: function(screen) {
		var layer = this.getLayer(screen.depth);
		layer.addScreen(screen);
	}
	,__class__: nfuzion.nTactic.core.AppView
}
nfuzion.nTactic.core.BranchHistory = function(branch,modelData) {
	this.branch = branch;
	this.modelData = modelData;
};
$hxClasses["nfuzion.nTactic.core.BranchHistory"] = nfuzion.nTactic.core.BranchHistory;
nfuzion.nTactic.core.BranchHistory.__name__ = ["nfuzion","nTactic","core","BranchHistory"];
nfuzion.nTactic.core.BranchHistory.prototype = {
	modelData: null
	,branch: null
	,__class__: nfuzion.nTactic.core.BranchHistory
}
nfuzion.nTactic.core.ICacheManager = function() { }
$hxClasses["nfuzion.nTactic.core.ICacheManager"] = nfuzion.nTactic.core.ICacheManager;
nfuzion.nTactic.core.ICacheManager.__name__ = ["nfuzion","nTactic","core","ICacheManager"];
nfuzion.nTactic.core.ICacheManager.prototype = {
	clearCache: null
	,release: null
	,'use': null
	,cacheAll: null
	,__class__: nfuzion.nTactic.core.ICacheManager
}
nfuzion.nTactic.core.CacheManager = function() {
	this.set_cacheAll(true);
};
$hxClasses["nfuzion.nTactic.core.CacheManager"] = nfuzion.nTactic.core.CacheManager;
nfuzion.nTactic.core.CacheManager.__name__ = ["nfuzion","nTactic","core","CacheManager"];
nfuzion.nTactic.core.CacheManager.__interfaces__ = [nfuzion.nTactic.core.ICacheManager];
nfuzion.nTactic.core.CacheManager.prototype = {
	clearCache: function() {
		nfuzion.nTactic.NTactic.cache.destroyAll();
	}
	,release: function(id) {
		if(!this.cacheAll && !(nfuzion.nTactic.NTactic.cache.getRecord(id).priority == 134217727)) nfuzion.nTactic.NTactic.cache.destroy(id);
	}
	,'use': function(id) {
	}
	,set_cacheAll: function(cacheAll) {
		if(!cacheAll) this.clearCache();
		this.cacheAll = cacheAll;
		return this.cacheAll;
	}
	,cacheAll: null
	,__class__: nfuzion.nTactic.core.CacheManager
	,__properties__: {set_cacheAll:"set_cacheAll"}
}
nfuzion.nTactic.core.Screen = function(graphicsClassName,fillParent) {
	if(fillParent == null) fillParent = true;
	this.modelData = null;
	this.screenInitialized = false;
	this.useBuilder = true;
	this.subScreens = new Array();
	this.imageRecords = new haxe.ds.StringMap();
	this.imageLoaders = new haxe.ds.StringMap();
	this.graphicsClassName = graphicsClassName;
	this.listenerManager = new nfuzion.event.ListenerManager();
	this.pendingImages = new haxe.ds.StringMap();
	this.set_screen(this);
	this.ready = true;
	if(this.graphicsClassName == null) {
		this.graphicsClassName = Type.getClassName(Type.getClass(this));
		this.graphicsClassName = HxOverrides.substr(this.graphicsClassName,this.graphicsClassName.lastIndexOf(".") + 1,null);
	}
	nfuzion.graphics.Container.call(this,"Screen(" + this.graphicsClassName + ")");
	if(fillParent) this.set_layout(new nfuzion.layout.SnapParentEdges());
};
$hxClasses["nfuzion.nTactic.core.Screen"] = nfuzion.nTactic.core.Screen;
nfuzion.nTactic.core.Screen.__name__ = ["nfuzion","nTactic","core","Screen"];
nfuzion.nTactic.core.Screen.__interfaces__ = [nfuzion.event.IListenerManager];
nfuzion.nTactic.core.Screen.__super__ = nfuzion.graphics.Container;
nfuzion.nTactic.core.Screen.prototype = $extend(nfuzion.graphics.Container.prototype,{
	removeSubScreen: function(subScreen) {
		HxOverrides.remove(this.subScreens,subScreen);
		if(!this.entered) {
			subScreen.removeListeners();
			subScreen.exitScreen();
		}
	}
	,addSubScreen: function(subScreen) {
		this.subScreens.push(subScreen);
		if(!subScreen.screenInitialized) {
			subScreen.model = this.model;
			subScreen.initializeScreen();
			subScreen.screenInitialized = true;
		}
		if(this.entered) {
			subScreen.addListeners();
			subScreen.enterScreen();
		}
	}
	,set_screen: function(screen) {
		if(screen == null) {
			this.screen = null;
			return null;
		} else {
			this.screen = this;
			return this;
		}
	}
	,getWidget: function(name) {
		return this.group.getWidget(name);
	}
	,detatchAllImages: function() {
		var $it0 = this.imageRecords.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			nfuzion.nTactic.NTactic.imageManager.remove(key);
		}
		this.imageRecords = new haxe.ds.StringMap();
	}
	,onReady: function() {
		haxe.Log.trace(" ** *  *   *     *  Screen " + this.graphicsClassName + " is ready!  *    *   *  * ** ",{ fileName : "Screen.hx", lineNumber : 402, className : "nfuzion.nTactic.core.Screen", methodName : "onReady"});
		this.initalGraphicsLoaded = true;
		this.dispatchEvent(new nfuzion.nTactic.event.ScreenEvent("ready",this));
	}
	,onImageReady: function(e) {
		if(e != null) {
			var image = e.target;
			this.pendingImages.remove(image.url);
			image.removeEventListener("ImageEvent.ready",$bind(this,this.onImageReady));
			image.removeEventListener("ImageEvent.error",$bind(this,this.onImageError));
		}
		var ready = true;
		var $it0 = ((function(_e) {
			return function() {
				return _e.iterator();
			};
		})(this.pendingImages))();
		while( $it0.hasNext() ) {
			var image = $it0.next();
			if(!image.ready) {
				ready = false;
				break;
			}
		}
		this.ready = ready;
		if(ready) this.onReady();
	}
	,onImageError: function(e) {
		var image = e.target;
		this.pendingImages.remove(image.url);
		image.removeEventListener("ImageEvent.ready",$bind(this,this.onImageReady));
		image.removeEventListener("ImageEvent.error",$bind(this,this.onImageError));
		this.onImageReady();
	}
	,detatchImage: function(url) {
		if(url != null && url != "") {
			if(this.imageRecords.exists(url)) {
				var references = this.imageRecords.get(url);
				if(references > 1) this.imageRecords.set(url,this.imageRecords.get(url) - 1); else if(references == 1) {
					this.imageRecords.remove(url);
					var image = nfuzion.nTactic.NTactic.imageManager.remove(url);
					if(image != null && !image.ready) {
						this.pendingImages.remove(image.url);
						this.detachListener(image,"ImageEvent.ready",$bind(this,this.onImageReady));
						this.detachListener(image,"ImageEvent.error",$bind(this,this.onImageError));
					}
				} else {
				}
			} else haxe.Log.trace("WARNING: cannot detatch image " + url,{ fileName : "Screen.hx", lineNumber : 355, className : "nfuzion.nTactic.core.Screen", methodName : "detatchImage"});
		}
	}
	,attachImage: function(url,wait) {
		if(wait == null) wait = false;
		if(url != null && url != "") {
			if(this.imageRecords.exists(url)) {
				this.imageRecords.set(url,this.imageRecords.get(url) + 1);
				return nfuzion.nTactic.NTactic.imageManager.cite(url);
			} else {
				this.imageRecords.set(url,1);
				var image = nfuzion.nTactic.NTactic.imageManager.add(url);
				if(!image.ready && wait && !this.initalGraphicsLoaded) {
					this.ready = false;
					this.attachListener(image,"ImageEvent.ready",$bind(this,this.onImageReady));
					this.attachListener(image,"ImageEvent.error",$bind(this,this.onImageError));
					this.pendingImages.set(image.url,image);
				}
				return image;
			}
		}
		return null;
	}
	,getImage: function(url) {
		var image = this.attachImage(url);
		return image;
	}
	,removeImage: function(url) {
		this.detatchImage(url);
	}
	,addImage: function(url) {
		return this.attachImage(url,true);
	}
	,onComponentImageLoaded: function(e) {
		var loader = e.imageLoader;
		this.detachListener(loader,"ImageLoaderEvent.complete",$bind(this,this.onComponentImageLoaded));
		this.imageLoaders.remove(loader.url + loader.component.name);
		loader.destroy();
	}
	,setComponentImage: function(component,url,fit,timeout) {
		if(url != "" && url != null) {
			if(!this.imageLoaders.exists(url + component.name)) {
				var loader = new nfuzion.image.ImageLoader(url,component,fit,timeout);
				if(!loader.complete) {
					this.imageLoaders.set(url + component.name,loader);
					this.attachListener(loader,"ImageLoaderEvent.complete",$bind(this,this.onComponentImageLoaded));
				} else loader.destroy();
			}
		} else component.gotoDefault();
	}
	,detachAllListeners: function() {
		this.listenerManager.detachAllListeners();
	}
	,swapListener: function(dispatcher,type,listener,priority) {
		if(priority == null) priority = 0;
		this.listenerManager.swapListener(dispatcher,type,listener,priority);
	}
	,detachListener: function(dispatcher,type,listener) {
		this.listenerManager.detachListener(dispatcher,type,listener);
	}
	,attachListener: function(dispatcher,type,listener,priority) {
		if(priority == null) priority = 0;
		this.listenerManager.attachListener(dispatcher,type,listener,priority);
	}
	,modelDataChanged: function() {
		var _g = 0, _g1 = this.subScreens;
		while(_g < _g1.length) {
			var subScreen = _g1[_g];
			++_g;
			subScreen.modelDataChanged();
		}
	}
	,set_modelData: function(modelData) {
		this.model.modelData = modelData;
		return this.model.modelData;
	}
	,get_modelData: function() {
		return this.model.modelData;
	}
	,modelData: null
	,exitScreen: function() {
		this.entered = false;
		this.group.removedFromStage();
		var _g = 0, _g1 = this.subScreens;
		while(_g < _g1.length) {
			var subScreen = _g1[_g];
			++_g;
			subScreen.exitScreen();
		}
	}
	,removeListeners: function() {
		this.detachAllListeners();
		var _g = 0, _g1 = this.subScreens;
		while(_g < _g1.length) {
			var subScreen = _g1[_g];
			++_g;
			subScreen.removeListeners();
		}
	}
	,enterScreen: function() {
		this.entered = true;
		this.group.addedToStage();
		var _g = 0, _g1 = this.subScreens;
		while(_g < _g1.length) {
			var subScreen = _g1[_g];
			++_g;
			subScreen.enterScreen();
		}
	}
	,addListeners: function() {
		var _g = 0, _g1 = this.subScreens;
		while(_g < _g1.length) {
			var subScreen = _g1[_g];
			++_g;
			subScreen.addListeners();
		}
	}
	,initializeScreen: function() {
		if(this.useBuilder) {
			if(!nfuzion.nTactic.NTactic.builder.buildOver(this.graphicsClassName,this)) haxe.Log.trace("ERROR: Screen graphics class not found for " + this.graphicsClassName + ".  A ghost screen will be created.",{ fileName : "Screen.hx", lineNumber : 104, className : "nfuzion.nTactic.core.Screen", methodName : "initializeScreen"});
		}
		this.group = new nfuzion.widget.Group(this.graphicsClassName,this);
	}
	,destroy: function() {
		this.group.destroy();
		this.group = null;
		this.orphan();
		nfuzion.graphics.Container.prototype.destroy.call(this);
		this.detatchAllImages();
		var $it0 = this.imageLoaders.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			var loader = this.imageLoaders.get(key);
			this.detachListener(loader,"ImageLoaderEvent.complete",$bind(this,this.onComponentImageLoaded));
			loader.destroy();
		}
		this.listenerManager = null;
		this.imageRecords = null;
		this.pendingImages = null;
	}
	,model: null
	,screenInitialized: null
	,subScreens: null
	,initalGraphicsLoaded: null
	,imageLoaders: null
	,ready: null
	,pendingImages: null
	,imageRecords: null
	,graphicsClassName: null
	,group: null
	,entered: null
	,listenerManager: null
	,branch: null
	,depth: null
	,useBuilder: null
	,__class__: nfuzion.nTactic.core.Screen
	,__properties__: $extend(nfuzion.graphics.Container.prototype.__properties__,{set_modelData:"set_modelData",get_modelData:"get_modelData"})
});
nfuzion.nTactic.core.DynamicScreen = function(name) {
	if(name == null) name = "";
	nfuzion.nTactic.core.Screen.call(this,name);
};
$hxClasses["nfuzion.nTactic.core.DynamicScreen"] = nfuzion.nTactic.core.DynamicScreen;
nfuzion.nTactic.core.DynamicScreen.__name__ = ["nfuzion","nTactic","core","DynamicScreen"];
nfuzion.nTactic.core.DynamicScreen.__super__ = nfuzion.nTactic.core.Screen;
nfuzion.nTactic.core.DynamicScreen.prototype = $extend(nfuzion.nTactic.core.Screen.prototype,{
	setupWidgets: function() {
	}
	,formatPath: function(path) {
		if(StringTools.startsWith(path,"./")) path = nfuzion.nTactic.NTactic.assetsPath + HxOverrides.substr(path,2,null);
		var array = path.split("\\").join("/").split("/");
		var out = new Array();
		var _g = 0;
		while(_g < array.length) {
			var item = array[_g];
			++_g;
			out.push(StringTools.urlEncode(item));
		}
		path = out.join("/");
		return path;
	}
	,setFont: function(name,source,size,style,weight) {
		var font = null;
		if(style == null) style = nfuzion.font.type.FontStyle.normal;
		if(weight == null) weight = nfuzion.font.type.FontWeight.normal;
		nfuzion.nTactic.NTactic.fontManager.set(name,source,size,style,weight);
		font = nfuzion.nTactic.NTactic.fontManager.get(name);
		return font;
	}
	,setPaint: function(name,colorString) {
		var color = null;
		var paint = null;
		color = nfuzion.utility.ColorTools.fromString(colorString);
		nfuzion.nTactic.NTactic.paintManager.set(name,color);
		paint = nfuzion.nTactic.NTactic.paintManager.get(name);
		return paint;
	}
	,createContainer: function(name,width,height,x,y) {
		if(y == null) y = 0;
		if(x == null) x = 0;
		var container = new nfuzion.graphics.Container(name);
		container.setSquare(x,y,width,height);
		return container;
	}
	,layoutScreen: function() {
	}
	,defineFonts: function() {
	}
	,definePaints: function() {
	}
	,initializeScreen: function() {
		this.useBuilder = false;
		this.definePaints();
		this.defineFonts();
		this.layoutScreen();
		nfuzion.nTactic.core.Screen.prototype.initializeScreen.call(this);
		this.setupWidgets();
		this.onReady();
	}
	,__class__: nfuzion.nTactic.core.DynamicScreen
});
nfuzion.nTactic.core.Layer = function(depth) {
	if(depth == null) depth = 0;
	nfuzion.graphics.Container.call(this,nfuzion.nTactic.core.Layer.getName(depth));
	this.depth = depth;
	this.set_layout(new nfuzion.layout.SnapParentEdges());
};
$hxClasses["nfuzion.nTactic.core.Layer"] = nfuzion.nTactic.core.Layer;
nfuzion.nTactic.core.Layer.__name__ = ["nfuzion","nTactic","core","Layer"];
nfuzion.nTactic.core.Layer.getName = function(depth) {
	return "layer:" + Std.string(depth);
}
nfuzion.nTactic.core.Layer.__super__ = nfuzion.graphics.Container;
nfuzion.nTactic.core.Layer.prototype = $extend(nfuzion.graphics.Container.prototype,{
	removeScreen: function(screen) {
		this.removeChild(screen);
	}
	,addScreen: function(screen) {
		this.appendChild(screen);
	}
	,depth: null
	,__class__: nfuzion.nTactic.core.Layer
});
nfuzion.nTactic.core.ScreenCache = function() {
	nfuzion.event.EventDispatcher.call(this);
	this.screenRecords = new haxe.ds.StringMap();
};
$hxClasses["nfuzion.nTactic.core.ScreenCache"] = nfuzion.nTactic.core.ScreenCache;
nfuzion.nTactic.core.ScreenCache.__name__ = ["nfuzion","nTactic","core","ScreenCache"];
nfuzion.nTactic.core.ScreenCache.__super__ = nfuzion.event.EventDispatcher;
nfuzion.nTactic.core.ScreenCache.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	destroyAll: function() {
		var $it0 = ((function(_e) {
			return function() {
				return _e.iterator();
			};
		})(this.screenRecords))();
		while( $it0.hasNext() ) {
			var screenRecord = $it0.next();
			screenRecord.destroyScreen();
		}
	}
	,destroy: function(branch) {
		var record = this.screenRecords.get(branch);
		if(record != null && record.destroyScreen()) return true;
		haxe.Log.trace("NOTE: Could not destroy screen " + branch,{ fileName : "ScreenCache.hx", lineNumber : 102, className : "nfuzion.nTactic.core.ScreenCache", methodName : "destroy"});
		return false;
	}
	,release: function(branch) {
		if(this.screenRecords.exists(branch)) {
			haxe.Log.trace(" [ - ] Releasing screen: " + branch,{ fileName : "ScreenCache.hx", lineNumber : 87, className : "nfuzion.nTactic.core.ScreenCache", methodName : "release"});
			this.screenRecords.get(branch).inUse = false;
			nfuzion.nTactic.NTactic.cacheManager.release(branch);
		}
	}
	,createScreen: function(screenRecord,model) {
		var screen;
		var className = screenRecord.className;
		var cls = null;
		try {
			cls = Type.resolveClass(screenRecord.classPrefix + className);
		} catch( e ) {
			cls = null;
		}
		if(cls == null) {
			haxe.Log.trace("FATAL: Could not instantiate '" + className + "'.  Check the screen name and verify that it is imported.",{ fileName : "ScreenCache.hx", lineNumber : 69, className : "nfuzion.nTactic.core.ScreenCache", methodName : "createScreen"});
			return false;
		}
		screen = Type.createInstance(cls,[className]);
		screen.depth = screenRecord.depth;
		screen.branch = screenRecord.branch;
		screen.model = model;
		screen.initializeScreen();
		screen.screenInitialized = true;
		screenRecord.screen = screen;
		return true;
	}
	,get: function(record) {
		if(record.screen == null) {
			haxe.Log.trace(" [ + ] Creating Screen: " + record.branch,{ fileName : "ScreenCache.hx", lineNumber : 36, className : "nfuzion.nTactic.core.ScreenCache", methodName : "get"});
			this.createScreen(record,nfuzion.nTactic.NTactic.screens.getModel(record.modelId));
		} else haxe.Log.trace(" [ = ] Reusing screen: " + record.branch,{ fileName : "ScreenCache.hx", lineNumber : 41, className : "nfuzion.nTactic.core.ScreenCache", methodName : "get"});
		if(record.screen != null) {
			record.inUse = true;
			nfuzion.nTactic.NTactic.cacheManager["use"](record.branch);
		}
		return record.screen;
	}
	,getRecord: function(branch) {
		return this.screenRecords.get(branch);
	}
	,addRecord: function(record) {
		this.screenRecords.set(record.branch,record);
	}
	,screenRecords: null
	,__class__: nfuzion.nTactic.core.ScreenCache
});
nfuzion.nTactic.core.ScreenModel = function(appModel,view) {
	nfuzion.event.EventDispatcher.call(this);
	this.mAppModel = appModel;
	this.mView = view;
	this.currentBranch = "";
	this.mScreensToAdd = new Array();
	this.mScreensToRemove = new Array();
	this.mScreensToPresent = new Array();
	this.mBackHistory = new Array();
	this.mExitHistory = new Array();
	this.mDefaultDepth = 0;
	this.mMaxHistoryLength = 0;
	this.id = "";
	this.initialBranchLoaded = false;
};
$hxClasses["nfuzion.nTactic.core.ScreenModel"] = nfuzion.nTactic.core.ScreenModel;
nfuzion.nTactic.core.ScreenModel.__name__ = ["nfuzion","nTactic","core","ScreenModel"];
nfuzion.nTactic.core.ScreenModel.__super__ = nfuzion.event.EventDispatcher;
nfuzion.nTactic.core.ScreenModel.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	clearHistory: function() {
		if(this.mMaxHistoryLength > 0) this.mBackHistory = new Array();
	}
	,updateHistory: function(branch,ext) {
		if(ext == null) ext = false;
		if(this.mMaxHistoryLength > 0) {
			if(branch != "" && branch != this.currentBranch) this.mBackHistory.push(new nfuzion.nTactic.core.BranchHistory(this.currentBranch,this.modelData)); else if(ext) this.mBackHistory.push(new nfuzion.nTactic.core.BranchHistory(this.currentBranch,this.modelData));
			if(this.mBackHistory.length > 50) this.mBackHistory.shift();
		}
	}
	,exit: function() {
		if(this.mMaxHistoryLength > 0) {
			if(this.mExitHistory.length > 0) {
				var exitObject = this.mExitHistory.pop();
				var exitBranch = exitObject.branch;
				var exitVars = exitObject.vars;
				this["goto"](exitBranch,exitVars,false);
			} else this.back();
		}
	}
	,captureExit: function() {
		if(this.mMaxHistoryLength > 0) {
			var exitIndex = this.mBackHistory.length - 1;
			if(exitIndex >= 0) {
				if(this.mExitHistory.length == 0 || this.mExitHistory[this.mExitHistory.length - 1] != this.mBackHistory[exitIndex]) this.mExitHistory.push(this.mBackHistory[exitIndex]);
				if(this.mExitHistory.length > 50) this.mExitHistory.shift();
			}
		}
	}
	,setExit: function() {
		if(this.mMaxHistoryLength > 0) {
			this.mExitHistory.push(new nfuzion.nTactic.core.BranchHistory(this.currentBranch,this.mCurrentVars));
			if(this.mExitHistory.length > this.mMaxHistoryLength) this.mExitHistory.shift();
		}
	}
	,back: function() {
		if(this.mMaxHistoryLength > 0 && this.mBackHistory.length > 0) {
			var backRecord = this.mBackHistory.pop();
			var backBranch = "";
			var vars = null;
			if(backRecord != null) {
				backBranch = backRecord.branch;
				vars = backRecord.modelData;
			}
			this["goto"](backBranch,vars,false);
		}
	}
	,removeScreens: function() {
		var screen;
		while(this.mScreensToRemove.length > 0) {
			var record = [this.mScreensToRemove.shift()];
			this.mScreensToAdd = Lambda.array(Lambda.filter(this.mScreensToAdd,(function(record) {
				return function(item) {
					return item != record[0];
				};
			})(record)));
			this.mScreensToPresent = Lambda.array(Lambda.filter(this.mScreensToPresent,(function(record) {
				return function(item) {
					return item != record[0];
				};
			})(record)));
			screen = record[0].screen;
			if(screen != null) {
				screen.removeEventListener("ready",$bind(this,this.onScreenReady));
				screen.removeListeners();
				screen.exitScreen();
				nfuzion.nTactic.NTactic.layers.removeScreen(screen);
				nfuzion.nTactic.NTactic.cache.release(record[0].branch);
			}
		}
	}
	,showScreen: function(screen) {
		screen.removeEventListener("ready",$bind(this,this.onScreenReady));
		screen.set_visible(true);
		this.branchReady();
	}
	,onScreenReady: function(e) {
		this.showScreen(e.screen);
	}
	,addScreens: function() {
		var screen;
		while(this.mScreensToAdd.length > 0) {
			var record = this.mScreensToAdd.shift();
			screen = nfuzion.nTactic.NTactic.cache.get(record);
			if(screen != null) {
				screen.set_visible(false);
				this.mView.addScreen(screen);
				this.mScreensToPresent.push(record);
				screen.model = this;
			}
		}
		this.updateModelData();
		var _g = 0, _g1 = this.mScreensToPresent;
		while(_g < _g1.length) {
			var record = _g1[_g];
			++_g;
			var screen1 = record.screen;
			if(screen1.initialized && !screen1.entered) {
				screen1.addListeners();
				screen1.enterScreen();
			}
			screen1.addEventListener("ready",$bind(this,this.onScreenReady));
			if(screen1.ready) this.showScreen(screen1);
		}
		this.mScreensToPresent = new Array();
	}
	,getScreenRecord: function(branch) {
		var record = nfuzion.nTactic.NTactic.cache.getRecord(this.id + ":" + branch);
		if(record == null) haxe.Log.trace("WARNING: Could not locate screen branch: " + this.id + ":" + branch,{ fileName : "ScreenModel.hx", lineNumber : 383, className : "nfuzion.nTactic.core.ScreenModel", methodName : "getScreenRecord"});
		return record;
	}
	,getScreenRecords: function(branch) {
		var records = new Array();
		if(branch != null && branch != "") {
			var branchArray = branch.split("/");
			var branch1 = branchArray.shift();
			var record = this.getScreenRecord(branch1);
			if(record != null) records.push(record);
			while(branchArray.length > 0) {
				branch1 += "/" + branchArray.shift();
				record = this.getScreenRecord(branch1);
				if(record != null) records.push(record);
			}
		}
		return records;
	}
	,setScreensToAddOrRemove: function(oldBranch,newBranch) {
		this.oldBranchRecords = this.getScreenRecords(oldBranch);
		this.newBranchRecords = this.getScreenRecords(newBranch);
		var i;
		if(this.oldBranchRecords.length > 0) {
			i = this.oldBranchRecords.length;
			while(--i > -1) if(this.newBranchRecords.length <= i || this.newBranchRecords[i] != this.oldBranchRecords[i]) this.mScreensToRemove.push(this.oldBranchRecords[i]); else if(this.newBranchRecords[i] == this.oldBranchRecords[i]) break;
		}
		if(this.newBranchRecords.length > 0) {
			i = this.newBranchRecords.length;
			while(--i > -1) if(this.oldBranchRecords.length <= i || this.newBranchRecords[i] != this.oldBranchRecords[i]) this.mScreensToAdd.push(this.newBranchRecords[i]); else if(this.newBranchRecords[i] == this.oldBranchRecords[i]) break;
		}
	}
	,releaseScreens: function(screens) {
		if(screens == null) {
		} else {
			var _g = 0;
			while(_g < screens.length) {
				var screenBranch = screens[_g];
				++_g;
				var record = nfuzion.nTactic.NTactic.cache.getRecord(this.id + ":" + screenBranch);
				if(record != null) {
					haxe.Log.trace("NOTE: Setting priority for " + record.branch + " to MIN",{ fileName : "ScreenModel.hx", lineNumber : 281, className : "nfuzion.nTactic.core.ScreenModel", methodName : "releaseScreens"});
					record.priority = 134217728;
					if(!record.inUse) nfuzion.nTactic.NTactic.cache.release(record.branch);
				} else haxe.Log.trace("WARNING: could not find record for branch: " + screenBranch + " Screen will not be released",{ fileName : "ScreenModel.hx", lineNumber : 293, className : "nfuzion.nTactic.core.ScreenModel", methodName : "releaseScreens"});
			}
		}
	}
	,cacheScreens: function(screens) {
		if(screens == null) {
		} else {
			var _g = 0;
			while(_g < screens.length) {
				var screenBranch = screens[_g];
				++_g;
				var record = nfuzion.nTactic.NTactic.cache.getRecord(this.id + ":" + screenBranch);
				if(record != null) {
					haxe.Log.trace("Setting priority for " + record.branch + " to MAX",{ fileName : "ScreenModel.hx", lineNumber : 243, className : "nfuzion.nTactic.core.ScreenModel", methodName : "cacheScreens"});
					record.priority = 134217727;
					if(record.screen == null) {
						haxe.Log.trace("NOTE: Preloading " + record.branch + ".",{ fileName : "ScreenModel.hx", lineNumber : 248, className : "nfuzion.nTactic.core.ScreenModel", methodName : "cacheScreens"});
						var screen = nfuzion.nTactic.NTactic.cache.get(record);
						nfuzion.nTactic.NTactic.cache.release(screen.branch);
					} else haxe.Log.trace("WARNING: could not find record for branch: " + screenBranch + " Screen will not be cached",{ fileName : "ScreenModel.hx", lineNumber : 256, className : "nfuzion.nTactic.core.ScreenModel", methodName : "cacheScreens"});
				}
			}
		}
	}
	,branchReady: function() {
		var ready = true;
		var _g = 0, _g1 = this.newBranchRecords;
		while(_g < _g1.length) {
			var record = _g1[_g];
			++_g;
			if(record.screen != null) {
				if(!record.screen.ready) {
					ready = false;
					break;
				}
			}
		}
		if(ready) {
			this.initialBranchLoaded = true;
			this.dispatchEvent(new nfuzion.nTactic.event.ScreenModelEvent("branchLoaded",this.id,this.currentBranch));
		}
	}
	,updateModelData: function() {
		if(this.currentBranch != "") {
			var twigs = this.currentBranch.split("/");
			var branch = "";
			var _g = 0;
			while(_g < twigs.length) {
				var twig = twigs[_g];
				++_g;
				if(branch != "") branch += "/";
				branch += twig;
				var screenRecord = this.getScreenRecord(branch);
				var screen = screenRecord.screen;
				screen.modelDataChanged();
			}
		}
	}
	,'goto': function(branch,modelData,addToHistory) {
		if(addToHistory == null) addToHistory = true;
		this.modelData = modelData;
		this.dispatchEvent(new nfuzion.nTactic.event.ScreenModelEvent("goto",this.id,branch,modelData));
		this.setScreensToAddOrRemove(this.currentBranch,branch);
		if(addToHistory) this.updateHistory(branch);
		this.currentBranch = branch;
		if(this.mScreensToRemove.length > 0) this.removeScreens();
		if(this.mScreensToAdd.length > 0) this.addScreens(); else this.updateModelData();
		this.branchReady();
		this.dispatchEvent(new nfuzion.nTactic.event.ScreenModelEvent("afterGoto",this.id,this.currentBranch,modelData));
	}
	,addScreenRecord: function(screenXml,parentScreens) {
		var screenRecord = new nfuzion.nTactic.core.ScreenRecord();
		screenRecord.className = screenXml.get("id");
		screenRecord.classPrefix = this.classPrefix;
		screenRecord.modelId = this.id;
		var branch = this.id + ":";
		var _g = 0;
		while(_g < parentScreens.length) {
			var parent = parentScreens[_g];
			++_g;
			branch += parent + "/";
		}
		screenRecord.branch = branch + screenRecord.className;
		screenRecord.depth = screenXml.exists("depth")?Std.parseInt(screenXml.get("depth")):this.mDefaultDepth;
		if(screenXml.exists("priority")) {
			var priority = screenXml.get("priority");
			if(priority == "max") screenRecord.priority = 134217727; else if(priority == "min") screenRecord.priority = 134217728; else screenRecord.priority = Std.parseInt(priority);
		} else screenRecord.priority = 0;
		nfuzion.nTactic.NTactic.cache.addRecord(screenRecord);
		var parentScreensClone = parentScreens.slice();
		parentScreensClone.push(screenRecord.className);
		var $it0 = screenXml.elements();
		while( $it0.hasNext() ) {
			var xml = $it0.next();
			this.addScreenRecord(xml,parentScreensClone);
		}
	}
	,createScreenRecords: function(xml) {
		var $it0 = xml.elements();
		while( $it0.hasNext() ) {
			var screenXml = $it0.next();
			this.addScreenRecord(screenXml,new Array());
		}
	}
	,initialize: function(xml) {
		if(xml.exists("defaultDepth")) this.mDefaultDepth = Std.parseInt(xml.get("defaultDepth"));
		if(xml.exists("historyLength")) this.mMaxHistoryLength = Std.parseInt(xml.get("historyLength"));
		if(xml.exists("initialBranch")) this.initialBranch = xml.get("initialBranch"); else this.initialBranch = "";
		this.classPrefix = xml.get("classPrefix");
		if(this.classPrefix == null) this.classPrefix = "screen.";
		this.id = xml.get("id");
		this.createScreenRecords(xml);
	}
	,modelData: null
	,initialBranchLoaded: null
	,newBranchRecords: null
	,oldBranchRecords: null
	,initialBranchRecords: null
	,classPrefix: null
	,mMaxHistoryLength: null
	,mDefaultDepth: null
	,mCurrentVars: null
	,mExitHistory: null
	,mBackHistory: null
	,mScreensToPresent: null
	,mScreensToRemove: null
	,mScreensToAdd: null
	,mView: null
	,mAppModel: null
	,initialBranch: null
	,currentBranch: null
	,id: null
	,__class__: nfuzion.nTactic.core.ScreenModel
});
nfuzion.nTactic.core.ScreenRecord = function() {
	this.inUse = false;
};
$hxClasses["nfuzion.nTactic.core.ScreenRecord"] = nfuzion.nTactic.core.ScreenRecord;
nfuzion.nTactic.core.ScreenRecord.__name__ = ["nfuzion","nTactic","core","ScreenRecord"];
nfuzion.nTactic.core.ScreenRecord.prototype = {
	destroyScreen: function() {
		var success = false;
		if(this.screen != null) {
			if(!this.inUse && !this.screen.entered) {
				haxe.Log.trace(" [ X ] Destroying screen: " + this.branch,{ fileName : "ScreenRecord.hx", lineNumber : 34, className : "nfuzion.nTactic.core.ScreenRecord", methodName : "destroyScreen"});
				this.screen.destroy();
				this.screen = null;
				success = true;
			}
		}
		this.priority = 134217728;
		return success;
	}
	,inUse: null
	,screen: null
	,priority: null
	,depth: null
	,branch: null
	,modelId: null
	,classPrefix: null
	,className: null
	,__class__: nfuzion.nTactic.core.ScreenRecord
}
nfuzion.nTactic.core.SubScreen = function(parentGroup,fillParent,graphicsClassName) {
	this.parentGroup = parentGroup;
	nfuzion.nTactic.core.Screen.call(this,graphicsClassName,fillParent);
	this.name = "SubScreen(" + this.graphicsClassName + ")";
};
$hxClasses["nfuzion.nTactic.core.SubScreen"] = nfuzion.nTactic.core.SubScreen;
nfuzion.nTactic.core.SubScreen.__name__ = ["nfuzion","nTactic","core","SubScreen"];
nfuzion.nTactic.core.SubScreen.__super__ = nfuzion.nTactic.core.Screen;
nfuzion.nTactic.core.SubScreen.prototype = $extend(nfuzion.nTactic.core.Screen.prototype,{
	initializeScreen: function() {
		nfuzion.nTactic.core.Screen.prototype.initializeScreen.call(this);
		this.parentGroup.appendChild(this.group);
	}
	,parentGroup: null
	,__class__: nfuzion.nTactic.core.SubScreen
});
nfuzion.nTactic.event = {}
nfuzion.nTactic.event.ScreenEvent = function(type,screen) {
	nfuzion.event.Event.call(this,type);
	this.screen = screen;
};
$hxClasses["nfuzion.nTactic.event.ScreenEvent"] = nfuzion.nTactic.event.ScreenEvent;
nfuzion.nTactic.event.ScreenEvent.__name__ = ["nfuzion","nTactic","event","ScreenEvent"];
nfuzion.nTactic.event.ScreenEvent.__super__ = nfuzion.event.Event;
nfuzion.nTactic.event.ScreenEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	screen: null
	,__class__: nfuzion.nTactic.event.ScreenEvent
});
nfuzion.nTactic.event.ScreenModelEvent = function(type,modelId,branch,modelData) {
	nfuzion.event.Event.call(this,type);
	this.modelId = modelId;
	this.branch = branch;
	this.modelData = modelData;
};
$hxClasses["nfuzion.nTactic.event.ScreenModelEvent"] = nfuzion.nTactic.event.ScreenModelEvent;
nfuzion.nTactic.event.ScreenModelEvent.__name__ = ["nfuzion","nTactic","event","ScreenModelEvent"];
nfuzion.nTactic.event.ScreenModelEvent.__super__ = nfuzion.event.Event;
nfuzion.nTactic.event.ScreenModelEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	modelData: null
	,branch: null
	,modelId: null
	,__class__: nfuzion.nTactic.event.ScreenModelEvent
});
nfuzion.paint = {}
nfuzion.paint.Paint = function(name,color) {
	nfuzion.event.EventDispatcher.call(this);
	this.name = name;
	if(color == null) color = nfuzion.type.Color.black;
	this.set_color(color);
};
$hxClasses["nfuzion.paint.Paint"] = nfuzion.paint.Paint;
nfuzion.paint.Paint.__name__ = ["nfuzion","paint","Paint"];
nfuzion.paint.Paint.__super__ = nfuzion.event.EventDispatcher;
nfuzion.paint.Paint.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	set_color: function(color) {
		if(!Type.enumEq(this.color,color)) {
			this.color = color;
			this.dispatchEvent(new nfuzion.paint.event.PaintEvent("PaintEvent.change",this));
		}
		return this.color;
	}
	,color: null
	,name: null
	,__class__: nfuzion.paint.Paint
	,__properties__: {set_color:"set_color"}
});
nfuzion.paint.PaintManager = function() {
	this.palette = new haxe.ds.StringMap();
};
$hxClasses["nfuzion.paint.PaintManager"] = nfuzion.paint.PaintManager;
nfuzion.paint.PaintManager.__name__ = ["nfuzion","paint","PaintManager"];
nfuzion.paint.PaintManager.prototype = {
	get: function(name) {
		var paint = this.palette.get(name);
		if(paint == null) {
			paint = new nfuzion.paint.Paint(name);
			this.palette.set(name,paint);
		}
		return paint;
	}
	,set: function(name,color) {
		var paint = this.palette.get(name);
		if(paint == null) {
			paint = new nfuzion.paint.Paint(name,color);
			this.palette.set(name,paint);
		}
	}
	,palette: null
	,__class__: nfuzion.paint.PaintManager
}
nfuzion.paint.event = {}
nfuzion.paint.event.PaintEvent = function(type,target) {
	nfuzion.event.Event.call(this,type);
	this.target = target;
};
$hxClasses["nfuzion.paint.event.PaintEvent"] = nfuzion.paint.event.PaintEvent;
nfuzion.paint.event.PaintEvent.__name__ = ["nfuzion","paint","event","PaintEvent"];
nfuzion.paint.event.PaintEvent.__super__ = nfuzion.event.Event;
nfuzion.paint.event.PaintEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	target: null
	,__class__: nfuzion.paint.event.PaintEvent
});
nfuzion.physics = {}
nfuzion.physics.IPhysics = function() { }
$hxClasses["nfuzion.physics.IPhysics"] = nfuzion.physics.IPhysics;
nfuzion.physics.IPhysics.__name__ = ["nfuzion","physics","IPhysics"];
nfuzion.physics.IPhysics.__interfaces__ = [nfuzion.event.IEventDispatcher];
nfuzion.physics.IPhysics.prototype = {
	onMagicScroll: null
	,bottomPadding: null
	,rowSize: null
	,touchTarget: null
	,step: null
	,scroller: null
	,orientation: null
	,length: null
	,destroy: null
	,__class__: nfuzion.physics.IPhysics
}
nfuzion.physics.Scrolling = function() {
	this.touching = false;
	this.repaintRequested = false;
	this.scrollerGrabbed = false;
	this.velocity = 0;
	this.touchDragging = false;
	this.touchDelta = 0;
	this.lastTouchPoint = null;
	this.lastRawPosition = 0;
	this.lastFrameTime = 0;
	this.gliding = false;
	this.bottomPadding = 0;
	this.currentTouchId = null;
	nfuzion.event.EventDispatcher.call(this);
	this.orientation = nfuzion.type.Orientation.vertical;
	this.touchDragged = new nfuzion.geometry.Point();
	this.set_step(0);
	this.set_length(0);
	this.set_position(0);
	this.snapThreshold = 10;
	this.set_rowSize(1);
};
$hxClasses["nfuzion.physics.Scrolling"] = nfuzion.physics.Scrolling;
nfuzion.physics.Scrolling.__name__ = ["nfuzion","physics","Scrolling"];
nfuzion.physics.Scrolling.__interfaces__ = [nfuzion.physics.IPhysics];
nfuzion.physics.Scrolling.__super__ = nfuzion.event.EventDispatcher;
nfuzion.physics.Scrolling.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	onMagicScroll: function(e) {
		var delta = new nfuzion.geometry.Point(e.deltaX * nfuzion.nTactic.NTactic.stage._width,-e.deltaY * nfuzion.nTactic.NTactic.stage._height);
		var velocity = new nfuzion.geometry.Point(e.velocityX * nfuzion.nTactic.NTactic.stage._width,-e.velocityY * nfuzion.nTactic.NTactic.stage._height);
		this.processTouchDelta(delta);
		switch( (e.phase)[1] ) {
		case 0:
			this.startDragging();
			break;
		case 2:
			this.stopDragging();
			this.velocity = this.getTouchDelta(velocity);
			break;
		case 1:
			break;
		}
	}
	,getTouchDelta: function(delta) {
		if(this.orientation == nfuzion.type.Orientation.horizontal) return delta.x; else return delta.y;
	}
	,onPaint: function(e) {
		if(!this.gliding && !this.touching) {
			nfuzion.nTactic.NTactic.stage.removeEventListener("paint",$bind(this,this.onPaint));
			this.repaintRequested = false;
		}
		var newPosition = this.rawPosition;
		if(this.gliding) {
			var now = nfuzion.timer.Timer.now();
			var frameTime = now - this.lastFrameTime;
			var visualExcess = 0;
			if(this.rawPosition < 0) {
				visualExcess = newPosition;
				this.velocity -= visualExcess * frameTime * 200;
			} else if(this.length <= 0) {
				visualExcess = newPosition;
				this.velocity -= visualExcess * frameTime * 200;
			} else if(newPosition > this.length) {
				visualExcess = newPosition - this.length;
				this.velocity -= visualExcess * frameTime * 200;
			}
			if(Math.abs(this.velocity) < this.snapThreshold && Math.abs(visualExcess) <= 1) this.onSnapThreshold(); else {
				var newVelocity;
				var positionDelta = 0;
				if(this.velocity > 0) {
					newVelocity = this.velocity - 500 * frameTime;
					if(newVelocity < 0) newVelocity = 0; else positionDelta = this.velocity * frameTime + 250. * Math.pow(frameTime,2);
				} else {
					newVelocity = this.velocity + 500 * frameTime;
					if(newVelocity > 0) newVelocity = 0; else positionDelta = this.velocity * frameTime - 250. * Math.pow(frameTime,2);
				}
				if(this.velocity != 0 && visualExcess == 0) this.velocity = newVelocity;
				newPosition += positionDelta;
			}
			this.lastFrameTime = now;
		}
		if(newPosition != this.rawPosition) {
			if(newPosition > 0 && this.rawPosition <= 0 || this.length <= 0 && newPosition < 0 && this.rawPosition >= 0 || newPosition < this.length && this.rawPosition >= this.length) {
				this.set_rawPosition(this.get_boundedPosition());
				this.velocity = 0;
			} else this.set_rawPosition(newPosition);
		}
		if(this.lastRawPosition != this.rawPosition) {
			this.lastRawPosition = this.rawPosition;
			this.dispatchEvent(new nfuzion.physics.event.PhysicsEvent("PhysicsEvent.change",this.get_position()));
		}
		if(this.scroller != null) this.scroller.set_value(this.get_boundedPosition() / this.rowSize);
	}
	,repaint: function(e) {
		if(nfuzion.nTactic.NTactic.stage != null && !this.repaintRequested) {
			this.repaintRequested = true;
			nfuzion.nTactic.NTactic.stage.addEventListener("paint",$bind(this,this.onPaint));
		}
	}
	,processTouchDelta: function(delta) {
		this.touchDelta += this.getTouchDelta(delta);
		if(this.touchDelta != 0) {
			var now = nfuzion.timer.Timer.now();
			var interval = now - this.lastFrameTime;
			if(interval != 0 && interval >= 0.07) {
				var newVelocity = this.touchDelta / interval;
				this.velocity -= this.velocity / 3;
				this.velocity -= newVelocity / 3;
				this.touchDelta = 0;
				this.lastFrameTime = now;
			}
		}
		if(!this.touchDragging) {
			this.touchDragged.x += delta.x;
			this.touchDragged.y += delta.y;
			if(Math.abs(this.touchDragged.get_length()) > 15) {
				delta.x = this.touchDragged.x;
				delta.y = this.touchDragged.y;
				this.touchDragged.x = 0;
				this.touchDragged.y = 0;
				this.touchDragging = true;
				this.startMoving();
			}
		}
		if(this.touchDragging) {
			var _g = this;
			_g.set_rawPosition(_g.rawPosition - this.getTouchDelta(delta));
		}
	}
	,stopGliding: function() {
		this.gliding = false;
		this.velocity = 0;
		this.dispatchEvent(new nfuzion.physics.event.PhysicsEvent("PhysicsEvent.end",this.get_position()));
	}
	,onSnapThreshold: function() {
		this.stopGliding();
	}
	,stopDragging: function() {
		this.gliding = true;
	}
	,startMoving: function() {
		this.dispatchEvent(new nfuzion.physics.event.PhysicsEvent("PhysicsEvent.begin",this.get_position()));
	}
	,startDragging: function() {
		this.gliding = false;
		this.velocity = 0;
		this.lastFrameTime = nfuzion.timer.Timer.now();
		this.repaint();
	}
	,onTouchEnd: function(e) {
		if(this.currentTouchId == e.id) {
			this.onTouchMove(e);
			this.currentTouchId = null;
			if(this.touchDragging) {
				this.touchDragging = false;
				this.stopDragging();
				var now = nfuzion.timer.Timer.now();
				var interval = now - this.lastFrameTime;
				if(interval >= 0.1) {
					this.velocity = 0;
					this.lastFrameTime = now;
				}
			}
			this.touching = false;
		}
	}
	,onTouchMove: function(e) {
		if(this.currentTouchId == e.id) {
			e.stopPropagation();
			var touchDelta = new nfuzion.geometry.Point(e.global.x - this.lastTouchPoint.x,e.global.y - this.lastTouchPoint.y);
			this.lastTouchPoint = new nfuzion.geometry.Point(e.global.x,e.global.y);
			this.processTouchDelta(touchDelta);
		}
	}
	,onTouchBegin: function(e) {
		if(this.currentTouchId == null) {
			this.touching = true;
			e.stopPropagation();
			this.currentTouchId = e.id;
			this.lastTouchPoint = new nfuzion.geometry.Point(e.global.x,e.global.y);
			this.startDragging();
		}
	}
	,onScrollerRelease: function(e) {
		this.onScrollerPosition(e);
		this.stopGliding();
		this.scrollerGrabbed = false;
	}
	,onScrollerPosition: function(e) {
		if(!this.touchDragging) {
			this.stopGliding();
			this.set_rawPosition(this.scroller.get_value() * this.rowSize);
		}
		this.onPaint();
	}
	,onScrollerGrab: function(e) {
		this.startDragging();
		this.scrollerGrabbed = true;
		this.onScrollerPosition(e);
	}
	,destroy: function() {
		nfuzion.nTactic.NTactic.stage.removeEventListener("move",$bind(this,this.onTouchMove));
		nfuzion.nTactic.NTactic.stage.removeEventListener("end",$bind(this,this.onTouchEnd));
		nfuzion.nTactic.NTactic.stage.removeEventListener("paint",$bind(this,this.onPaint));
		if(this.scroller != null) {
			this.scroller.removeEventListener("ScrollerEvent.grab",$bind(this,this.onScrollerGrab));
			this.scroller.removeEventListener("ScrollerEvent.position",$bind(this,this.onScrollerPosition));
			this.scroller.removeEventListener("ScrollerEvent.release",$bind(this,this.onScrollerRelease));
			this.set_scroller(null);
		}
		if(this.touchTarget != null) {
			this.touchTarget.removeEventListener("begin",$bind(this,this.onTouchBegin));
			this.set_touchTarget(null);
		}
		this.stopGliding();
	}
	,set_touchTarget: function(touchTarget) {
		if(this.touchTarget != null) {
			this.touchTarget.removeEventListener("begin",$bind(this,this.onTouchBegin));
			nfuzion.nTactic.NTactic.stage.removeEventListener("move",$bind(this,this.onTouchMove));
			nfuzion.nTactic.NTactic.stage.removeEventListener("end",$bind(this,this.onTouchEnd));
		}
		this.touchTarget = touchTarget;
		if(touchTarget != null) {
			touchTarget.addEventListener("begin",$bind(this,this.onTouchBegin));
			nfuzion.nTactic.NTactic.stage.addEventListener("move",$bind(this,this.onTouchMove));
			nfuzion.nTactic.NTactic.stage.addEventListener("end",$bind(this,this.onTouchEnd));
		}
		return touchTarget;
	}
	,touchTarget: null
	,set_scroller: function(scroller) {
		if(this.scroller != null) {
			this.scroller.removeEventListener("ScrollerEvent.grab",$bind(this,this.onScrollerGrab));
			this.scroller.removeEventListener("ScrollerEvent.position",$bind(this,this.onScrollerPosition));
			this.scroller.removeEventListener("ScrollerEvent.release",$bind(this,this.onScrollerRelease));
		}
		this.scroller = scroller;
		if(scroller != null) {
			scroller.set_pageSize(this.step / this.rowSize);
			scroller.set_maximum(Math.ceil((this.length + this.step - this.bottomPadding) / this.rowSize));
			scroller.set_value(this.get_position() / this.rowSize);
			scroller.addEventListener("ScrollerEvent.grab",$bind(this,this.onScrollerGrab));
			scroller.addEventListener("ScrollerEvent.position",$bind(this,this.onScrollerPosition));
			scroller.addEventListener("ScrollerEvent.release",$bind(this,this.onScrollerRelease));
		}
		return scroller;
	}
	,scroller: null
	,set_position: function(position) {
		if(position < 0 || this.length <= 0) this.set_rawPosition(position / 0.2); else if(position > this.length) this.set_rawPosition(this.length + (position - this.length) / 0.2); else this.set_rawPosition(position);
		this.repaint();
		return position;
	}
	,get_position: function() {
		if(this.rawPosition < 0 || this.length <= 0) return this.rawPosition * 0.2; else if(this.rawPosition > this.length) return this.length + (this.rawPosition - this.length) * 0.2;
		return this.rawPosition;
	}
	,get_boundedPosition: function() {
		if(this.length > 0 && this.rawPosition > this.length) return this.length;
		if(this.rawPosition < 0 || this.length <= 0) return 0;
		return this.rawPosition;
	}
	,set_rawPosition: function(rawPosition) {
		this.rawPosition = rawPosition;
		return rawPosition;
	}
	,rawPosition: null
	,set_step: function(step) {
		this.step = step;
		if(this.scroller != null) {
			this.scroller.set_pageSize(step / this.rowSize);
			this.scroller.set_maximum((this.length + step - this.bottomPadding) / this.rowSize);
		}
		return step;
	}
	,step: null
	,set_length: function(length) {
		if(length < 0) length = 0;
		this.length = length;
		if(this.scroller != null) this.scroller.set_maximum((length + this.step - this.bottomPadding) / this.rowSize);
		if(this.get_position() > length) this.set_position(length);
		return length;
	}
	,length: null
	,set_rowSize: function(rowSize) {
		this.rowSize = rowSize;
		return this.rowSize;
	}
	,rowSize: null
	,touching: null
	,repaintRequested: null
	,scrollerGrabbed: null
	,velocity: null
	,touchDragging: null
	,touchDragged: null
	,touchDelta: null
	,lastTouchPoint: null
	,lastRawPosition: null
	,lastFrameTime: null
	,gliding: null
	,bottomPadding: null
	,orientation: null
	,currentTouchId: null
	,snapThreshold: null
	,__class__: nfuzion.physics.Scrolling
	,__properties__: {set_rowSize:"set_rowSize",set_length:"set_length",set_step:"set_step",set_rawPosition:"set_rawPosition",get_boundedPosition:"get_boundedPosition",set_position:"set_position",get_position:"get_position",set_scroller:"set_scroller",set_touchTarget:"set_touchTarget"}
});
nfuzion.physics.event = {}
nfuzion.physics.event.PhysicsEvent = function(type,position) {
	nfuzion.event.Event.call(this,type);
	this.position = position;
};
$hxClasses["nfuzion.physics.event.PhysicsEvent"] = nfuzion.physics.event.PhysicsEvent;
nfuzion.physics.event.PhysicsEvent.__name__ = ["nfuzion","physics","event","PhysicsEvent"];
nfuzion.physics.event.PhysicsEvent.__super__ = nfuzion.event.Event;
nfuzion.physics.event.PhysicsEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	position: null
	,__class__: nfuzion.physics.event.PhysicsEvent
});
nfuzion.sketch = {}
nfuzion.sketch.ISketch = function() { }
$hxClasses["nfuzion.sketch.ISketch"] = nfuzion.sketch.ISketch;
nfuzion.sketch.ISketch.__name__ = ["nfuzion","sketch","ISketch"];
nfuzion.sketch.ISketch.__interfaces__ = [nfuzion.event.IEventDispatcher];
nfuzion.sketch.ISketch.prototype = {
	getClass: null
	,ready: null
	,__class__: nfuzion.sketch.ISketch
}
nfuzion.sketch.XmlSketch = function(path) {
	nfuzion.event.EventDispatcher.call(this);
	this.ready = false;
	this.assets = null;
	this.classes = new haxe.ds.StringMap();
	path = nfuzion.nTactic.NTactic.assetsPath + path;
	this.loader = new nfuzion.loader.TextLoader(path);
	this.loader.addEventListener("LoaderEvent.ready",$bind(this,this.onReady));
	this.mBluePrintPath = this.loader.url;
	var lasIndex = this.mBluePrintPath.lastIndexOf("/");
	if(lasIndex > 0) this.themePath = HxOverrides.substr(this.mBluePrintPath,0,lasIndex + 1); else this.themePath = "";
	this.loader.request();
};
$hxClasses["nfuzion.sketch.XmlSketch"] = nfuzion.sketch.XmlSketch;
nfuzion.sketch.XmlSketch.__name__ = ["nfuzion","sketch","XmlSketch"];
nfuzion.sketch.XmlSketch.__interfaces__ = [nfuzion.sketch.ISketch];
nfuzion.sketch.XmlSketch.__super__ = nfuzion.event.EventDispatcher;
nfuzion.sketch.XmlSketch.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	pahoUrl: function(path) {
		var array = path.split("\\").join("/").split("/");
		var out = new Array();
		var _g = 0;
		while(_g < array.length) {
			var item = array[_g];
			++_g;
			out.push(StringTools.urlEncode(item));
		}
		return out.join("/");
	}
	,getRelativePath: function(path) {
		var out = path;
		if(StringTools.startsWith(path,"./")) out = this.themePath + HxOverrides.substr(path,2,null);
		return out;
	}
	,readContainer: function(element,isGuise) {
		if(isGuise == null) isGuise = false;
		var sketchContainer;
		if(!isGuise) sketchContainer = new nfuzion.sketch.type.SketchContainer(element.get("name"),Std.parseInt(element.get("x")),Std.parseInt(element.get("y")),0,0); else sketchContainer = new nfuzion.sketch.type.SketchContainer(element.get("name"),0,0,0,0);
		var className = element.get("class");
		if(className != null) sketchContainer.className = className; else {
			if(!isGuise) sketchContainer.setSize(Std.parseInt(element.get("width")),Std.parseInt(element.get("height")));
			if(element.get("visible") != null) sketchContainer.visible = element.get("visible") != "false";
			if(element.get("alpha") != null) sketchContainer.alpha = Std.parseFloat(element.get("alpha"));
			var backgroundPaint = element.get("paint");
			if(backgroundPaint != null) sketchContainer.backgroundPaint = nfuzion.nTactic.NTactic.paintManager.get(backgroundPaint);
			var borderPaint = element.get("borderPaint");
			if(borderPaint != null) sketchContainer.borderPaint = nfuzion.nTactic.NTactic.paintManager.get(borderPaint);
			if(element.get("borderWidth") != null) sketchContainer.borderWidth = Std.parseInt(element.get("borderWidth"));
			var scaleString = element.get("scale");
			if(scaleString != null && scaleString == "true") sketchContainer.scale = true;
			this.readElement(element,sketchContainer);
		}
		return sketchContainer;
	}
	,readElement: function(xmlSource,parent) {
		var $it0 = xmlSource.elements();
		while( $it0.hasNext() ) {
			var element = $it0.next();
			var _g = element.get_nodeName();
			switch(_g) {
			case "Guise":
				var guise = this.readContainer(element,true);
				parent.addGuise(guise);
				break;
			case "Container":
				var sketchContainer = this.readContainer(element);
				parent.appendChildSketch(sketchContainer);
				break;
			case "Text":
				var sketchText = new nfuzion.sketch.type.SketchText(element.get("name"),Std.parseInt(element.get("x")),Std.parseInt(element.get("y")),Std.parseInt(element.get("width")),Std.parseInt(element.get("height")));
				sketchText.text = element.get("text");
				if(element.get("visible") != null) sketchText.visible = element.get("visible") != "false";
				if(element.get("wrap") != null) sketchText.wrap = element.get("wrap") == "true";
				var paint = element.get("paint");
				if(paint != null) sketchText.paint = nfuzion.nTactic.NTactic.paintManager.get(paint);
				var alignment = element.get("alignment");
				if(alignment != null) sketchText.alignment = Type.createEnum(nfuzion.type.Alignment,alignment);
				var font = element.get("font");
				if(font != null) sketchText.font = nfuzion.nTactic.NTactic.fontManager.get(font);
				parent.appendChildSketch(sketchText);
				break;
			case "Frame":
				var frameName = element.get("name");
				var fit = null;
				var fitString = element.get("fit");
				if(fitString != null) fit = Type.createEnum(nfuzion.graphics.type.Fit,fitString);
				if(fit == null) fit = nfuzion.graphics.type.Fit.stretch;
				var frame = new nfuzion.type.Frame(this.getRelativePath(this.pahoUrl(element.get("source"))),fit,Std.parseInt(element.get("x")),Std.parseInt(element.get("y")),Std.parseInt(element.get("width")),Std.parseInt(element.get("height")));
				parent.setFrame(frameName,frame);
				break;
			case "Mask":
				var fit = null;
				var fitString = element.get("fit");
				if(fitString != null) fit = Type.createEnum(nfuzion.graphics.type.Fit,fitString);
				if(fit == null) fit = nfuzion.graphics.type.Fit.stretch;
				var maskSketch = new nfuzion.type.Frame(this.getRelativePath(this.pahoUrl(element.get("source"))),fit,Std.parseInt(element.get("x")),Std.parseInt(element.get("y")),parent._width,parent._height);
				parent.mask = maskSketch;
				break;
			}
		}
	}
	,parseClasses: function() {
		var $it0 = this.assets.elementsNamed("Class");
		while( $it0.hasNext() ) {
			var classXml = $it0.next();
			var name = classXml.get("name");
			var buildClass = new nfuzion.sketch.type.SketchContainer(name,0,0,Std.parseInt(classXml.get("width")),Std.parseInt(classXml.get("height")));
			this.readElement(classXml,buildClass);
			this.classes.set(name,buildClass);
		}
	}
	,parsePalee: function() {
		var $it0 = this.assets.elementsNamed("Paint");
		while( $it0.hasNext() ) {
			var fontXml = $it0.next();
			var name = fontXml.get("name");
			var color = null;
			var colorString = fontXml.get("color");
			if(colorString != null) color = nfuzion.utility.ColorTools.fromString(colorString);
			nfuzion.nTactic.NTactic.paintManager.set(name,color);
		}
	}
	,parseFonts: function() {
		var $it0 = this.assets.elementsNamed("Font");
		while( $it0.hasNext() ) {
			var fontXml = $it0.next();
			var name = fontXml.get("name");
			var source = this.getRelativePath(this.pahoUrl(fontXml.get("source")));
			var size = Std.parseFloat(fontXml.get("size"));
			var style = Type.createEnum(nfuzion.font.type.FontStyle,fontXml.get("style"));
			var weight = Type.createEnum(nfuzion.font.type.FontWeight,fontXml.get("weight"));
			nfuzion.nTactic.NTactic.fontManager.set(name,source,size,style,weight);
		}
	}
	,onReady: function(e) {
		this.loader.removeEventListener("LoaderEvent.ready",$bind(this,this.onReady));
		if(this.loader.data != null) {
			try {
				var assets = Xml.parse(this.loader.data);
				this.assets = assets.elementsNamed("Assets").next();
			} catch( e1 ) {
				haxe.Log.trace("ERROR: " + Std.string(e1),{ fileName : "XmlSketch.hx", lineNumber : 80, className : "nfuzion.sketch.XmlSketch", methodName : "onReady"});
				this.assets = null;
			}
			if(this.assets == null) {
				haxe.Log.trace("ERROR: No 'Assets' ag found.",{ fileName : "XmlSketch.hx", lineNumber : 85, className : "nfuzion.sketch.XmlSketch", methodName : "onReady"});
				return;
			}
			this.parsePalee();
			this.parseFonts();
			this.parseClasses();
		}
		if(this.assets == null) haxe.Log.trace("ERROR: No assets loaded.",{ fileName : "XmlSketch.hx", lineNumber : 94, className : "nfuzion.sketch.XmlSketch", methodName : "onReady"});
		this.ready = true;
		this.dispatchEvent(new nfuzion.sketch.event.SketchEvent("BuilderEvent.ready"));
	}
	,getClass: function(name) {
		if(this.ready) return this.classes.get(name);
		return null;
	}
	,classes: null
	,loader: null
	,assets: null
	,themePath: null
	,mBluePrintPath: null
	,ready: null
	,__class__: nfuzion.sketch.XmlSketch
});
nfuzion.sketch.event = {}
nfuzion.sketch.event.SketchEvent = function(type) {
	nfuzion.event.Event.call(this,type);
};
$hxClasses["nfuzion.sketch.event.SketchEvent"] = nfuzion.sketch.event.SketchEvent;
nfuzion.sketch.event.SketchEvent.__name__ = ["nfuzion","sketch","event","SketchEvent"];
nfuzion.sketch.event.SketchEvent.__super__ = nfuzion.event.Event;
nfuzion.sketch.event.SketchEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	__class__: nfuzion.sketch.event.SketchEvent
});
nfuzion.sketch.type = {}
nfuzion.sketch.type.SketchComponent = function(name,x,y,width,height) {
	if(height == null) height = 0;
	if(width == null) width = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.alpha = 1;
	nfuzion.geometry.Box.call(this,x,y,width,height);
	this.name = name;
	this.scale = false;
	this.frames = new haxe.ds.StringMap();
	this.guises = new haxe.ds.StringMap();
	this.alpha = 1;
	this.visible = true;
};
$hxClasses["nfuzion.sketch.type.SketchComponent"] = nfuzion.sketch.type.SketchComponent;
nfuzion.sketch.type.SketchComponent.__name__ = ["nfuzion","sketch","type","SketchComponent"];
nfuzion.sketch.type.SketchComponent.__super__ = nfuzion.geometry.Box;
nfuzion.sketch.type.SketchComponent.prototype = $extend(nfuzion.geometry.Box.prototype,{
	addGuise: function(guise) {
		this.guises.set(guise.name,guise);
	}
	,setFrame: function(frameName,frame) {
		if(!this.frames.iterator().hasNext()) this.initialFrameName = frameName;
		this.frames.set(frameName,frame);
	}
	,visible: null
	,mask: null
	,guises: null
	,initialFrameName: null
	,frames: null
	,className: null
	,scale: null
	,borderPaint: null
	,borderWidth: null
	,backgroundPaint: null
	,alpha: null
	,name: null
	,__class__: nfuzion.sketch.type.SketchComponent
});
nfuzion.sketch.type.SketchContainer = function(name,x,y,width,height) {
	if(height == null) height = 0;
	if(width == null) width = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	nfuzion.sketch.type.SketchComponent.call(this,name,x,y,width,height);
	this.children = new Array();
};
$hxClasses["nfuzion.sketch.type.SketchContainer"] = nfuzion.sketch.type.SketchContainer;
nfuzion.sketch.type.SketchContainer.__name__ = ["nfuzion","sketch","type","SketchContainer"];
nfuzion.sketch.type.SketchContainer.__super__ = nfuzion.sketch.type.SketchComponent;
nfuzion.sketch.type.SketchContainer.prototype = $extend(nfuzion.sketch.type.SketchComponent.prototype,{
	getChildSketch: function(name) {
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.name == name) return child;
		}
		return null;
	}
	,childAddCommon: function(childSketch) {
		if(this.getChildSketch(childSketch.name) != null) throw "Container already contains a child named \"" + childSketch.name + ".\"";
	}
	,insertChildSketch: function(childSketch,index) {
		this.childAddCommon(childSketch);
		this.children.splice(index,0,childSketch);
	}
	,prependChildSketch: function(childSketch) {
		this.childAddCommon(childSketch);
		this.children.unshift(childSketch);
	}
	,appendChildSketch: function(childSketch) {
		this.childAddCommon(childSketch);
		this.children.push(childSketch);
	}
	,children: null
	,__class__: nfuzion.sketch.type.SketchContainer
});
nfuzion.sketch.type.SketchText = function(name,x,y,width,height) {
	if(height == null) height = 0;
	if(width == null) width = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	nfuzion.sketch.type.SketchComponent.call(this,name,x,y,width,height);
	this.text = "";
	this.wrap = false;
};
$hxClasses["nfuzion.sketch.type.SketchText"] = nfuzion.sketch.type.SketchText;
nfuzion.sketch.type.SketchText.__name__ = ["nfuzion","sketch","type","SketchText"];
nfuzion.sketch.type.SketchText.__super__ = nfuzion.sketch.type.SketchComponent;
nfuzion.sketch.type.SketchText.prototype = $extend(nfuzion.sketch.type.SketchComponent.prototype,{
	wrap: null
	,text: null
	,font: null
	,alignment: null
	,paint: null
	,__class__: nfuzion.sketch.type.SketchText
});
nfuzion.span = {}
nfuzion.span.ISpanClient = function() { }
$hxClasses["nfuzion.span.ISpanClient"] = nfuzion.span.ISpanClient;
nfuzion.span.ISpanClient.__name__ = ["nfuzion","span","ISpanClient"];
nfuzion.span.ISpanClient.__interfaces__ = [nfuzion.event.IEventDispatcher];
nfuzion.span.ISpanClient.prototype = {
	addMessageListener: null
	,send: null
	,disconnect: null
	,connect: null
	,connected: null
	,autoConnect: null
	,echo: null
	,url: null
	,__class__: nfuzion.span.ISpanClient
}
nfuzion.span.SpanClient = function(urlString,lingo,name,tag,echo) {
	if(echo == null) echo = true;
	nfuzion.event.EventDispatcher.call(this);
	this.metadata = new nfuzion.message.span.LetClientMetadata(name,tag,echo);
	this.newClient(urlString,lingo);
};
$hxClasses["nfuzion.span.SpanClient"] = nfuzion.span.SpanClient;
nfuzion.span.SpanClient.__name__ = ["nfuzion","span","SpanClient"];
nfuzion.span.SpanClient.__interfaces__ = [nfuzion.span.ISpanClient];
nfuzion.span.SpanClient.parseUrlString = function(urlString,throwHints) {
	if(throwHints == null) throwHints = false;
	if(urlString.indexOf("://") < 0) urlString = "ws://" + urlString;
	var url = new nfuzion.url.Url(urlString,throwHints);
	if(!url.valid) return null;
	switch(url.protocol) {
	case "ws":
		break;
	case "ghost":
		break;
	default:
		if(throwHints) throw "The protocol '" + url.protocol + "' is not supported.";
		return null;
	}
	switch(url.protocol) {
	case "ws":
		if(url.port == null) url.port = 4412;
		break;
	case "ghost":
		url.port = null;
		url.host = "ghost";
		break;
	default:
		haxe.Log.trace("ERROR: This should never happen: protocol = " + url.protocol,{ fileName : "SpanClient.hx", lineNumber : 101, className : "nfuzion.span.SpanClient", methodName : "parseUrlString"});
		return null;
	}
	return url;
}
nfuzion.span.SpanClient.__super__ = nfuzion.event.EventDispatcher;
nfuzion.span.SpanClient.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	onClientData: function(e) {
		var message = this.lingo.from(e.data);
		if(message != null) {
			var fullNameArray = Type.getClassName(Type.getClass(message)).split(".");
			var className = fullNameArray.pop();
			var type = fullNameArray.pop();
			this.dispatchEvent(new nfuzion.span.event.MessageEvent(type,className,message));
		} else {
		}
	}
	,onClientDisconnect: function(e) {
		this.dispatchEvent(new nfuzion.span.event.SpanClientEvent("SpanClientEvent.disconnect",this));
		if(this.autoConnect) {
			if(this.reconnectDelay == null) this.reconnectDelay = new nfuzion.timer.Delay($bind(this,this.reconnect),1);
		}
	}
	,onClientConnect: function(e) {
		this.send(this.metadata);
		this.dispatchEvent(new nfuzion.span.event.SpanClientEvent("SpanClientEvent.connect",this));
	}
	,addMessageListener: function(type,listener) {
		this.addEventListener(type,listener);
	}
	,reconnect: function() {
		this.reconnectDelay.destroy();
		this.reconnectDelay = null;
		this.connect();
	}
	,send: function(message) {
		if(this.get_connected()) return this.client.send(this.lingo.to(message));
		return false;
	}
	,set_autoConnect: function(autoConnect) {
		this.autoConnect = autoConnect;
		if(autoConnect) this.connect();
		return autoConnect;
	}
	,autoConnect: null
	,disconnect: function() {
		if(this.reconnectDelay != null) this.reconnectDelay.destroy();
		this.client.disconnect();
	}
	,get_connected: function() {
		if(this.client != null) return this.client.connected;
		return false;
	}
	,connected: null
	,connect: function(url,lingo) {
		if(url != null) {
			this.client.disconnect();
			this.newClient(url,lingo);
		} else if(lingo != null) this.lingo = lingo;
		if(this.reconnectDelay != null) {
			this.reconnectDelay.destroy();
			this.reconnectDelay = null;
		}
		if(!this.client.connected) this.client.connect();
	}
	,set_echo: function(echo) {
		this.echo = echo;
		return echo;
	}
	,echo: null
	,newClient: function(urlString,lingo) {
		if(this.client != null) {
			this.client.removeEventListener("ClientEvent.connect",$bind(this,this.onClientConnect));
			this.client.removeEventListener("ClientEvent.disconnect",$bind(this,this.onClientDisconnect));
			this.client.removeEventListener("ClientEvent.data",$bind(this,this.onClientData));
			this.client = null;
		}
		this.url = nfuzion.span.SpanClient.parseUrlString(urlString);
		var _g = this;
		switch(_g.url.protocol) {
		case "ws":
			this.client = new nfuzion.client.WebSocketClient(this.url.host,this.url.port);
			break;
		case "ghost":
			this.client = new nfuzion.client.GhostClient();
			break;
		default:
			haxe.Log.trace("ERROR: This should never happen: protocol = " + this.url.protocol,{ fileName : "SpanClient.hx", lineNumber : 131, className : "nfuzion.span.SpanClient", methodName : "newClient"});
		}
		if(lingo == null) {
			var _g1 = this;
			switch(_g1.url.port) {
			case 4400:case 4410:
				this.lingo = new nfuzion.lingo.XmlLingo();
				break;
			case 4402:case 4412:
				this.lingo = new nfuzion.lingo.JsonLingo();
				break;
			case 0:case 4403:case 4413:
				this.lingo = new nfuzion.lingo.HaxeLingo();
				break;
			default:
				haxe.Log.trace("WARNING: No default lingo specified for port " + this.url.port + ".  Using XmlLingo.",{ fileName : "SpanClient.hx", lineNumber : 145, className : "nfuzion.span.SpanClient", methodName : "newClient"});
				this.lingo = new nfuzion.lingo.XmlLingo();
			}
		} else this.lingo = lingo;
		this.client.addEventListener("ClientEvent.connect",$bind(this,this.onClientConnect));
		this.client.addEventListener("ClientEvent.disconnect",$bind(this,this.onClientDisconnect));
		this.client.addEventListener("ClientEvent.data",$bind(this,this.onClientData));
	}
	,client: null
	,reconnectDelay: null
	,url: null
	,lingo: null
	,metadata: null
	,__class__: nfuzion.span.SpanClient
	,__properties__: {set_echo:"set_echo",get_connected:"get_connected",set_autoConnect:"set_autoConnect"}
});
nfuzion.span.event = {}
nfuzion.span.event.MessageEvent = function(type,className,message) {
	nfuzion.event.Event.call(this,type);
	this.className = className;
	this.message = message;
};
$hxClasses["nfuzion.span.event.MessageEvent"] = nfuzion.span.event.MessageEvent;
nfuzion.span.event.MessageEvent.__name__ = ["nfuzion","span","event","MessageEvent"];
nfuzion.span.event.MessageEvent.__super__ = nfuzion.event.Event;
nfuzion.span.event.MessageEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	message: null
	,className: null
	,__class__: nfuzion.span.event.MessageEvent
});
nfuzion.span.event.SpanClientEvent = function(type,client) {
	nfuzion.event.Event.call(this,type);
	this.client = client;
};
$hxClasses["nfuzion.span.event.SpanClientEvent"] = nfuzion.span.event.SpanClientEvent;
nfuzion.span.event.SpanClientEvent.__name__ = ["nfuzion","span","event","SpanClientEvent"];
nfuzion.span.event.SpanClientEvent.__super__ = nfuzion.event.Event;
nfuzion.span.event.SpanClientEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	client: null
	,__class__: nfuzion.span.event.SpanClientEvent
});
nfuzion.storage = {}
nfuzion.storage.PersistentStorage = function() {
	nfuzion.event.EventDispatcher.call(this);
	if(nfuzion.storage.PersistentStorage.instance != null) throw "Persist may not be instantiated more than once.";
	this.ready = false;
	nfuzion.storage.PersistentStorage.instance = this;
	this.records = new haxe.ds.StringMap();
	this.loadLocalStorage();
};
$hxClasses["nfuzion.storage.PersistentStorage"] = nfuzion.storage.PersistentStorage;
nfuzion.storage.PersistentStorage.__name__ = ["nfuzion","storage","PersistentStorage"];
nfuzion.storage.PersistentStorage.create = function() {
	if(nfuzion.storage.PersistentStorage.instance == null) nfuzion.storage.PersistentStorage.instance = new nfuzion.storage.PersistentStorage();
	return nfuzion.storage.PersistentStorage.instance;
}
nfuzion.storage.PersistentStorage.__super__ = nfuzion.event.EventDispatcher;
nfuzion.storage.PersistentStorage.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	decodeName: function(codedName) {
		var name = null;
		if(StringTools.endsWith(codedName,".record")) name = nfuzion.utility.BaseCode32.decodeString(HxOverrides.substr(codedName,0,codedName.length - ".record".length));
		return name;
	}
	,encodeName: function(name) {
		return nfuzion.utility.BaseCode32.encodeString(name) + ".record";
	}
	,onRecordChange: function(e) {
		var record = e.target;
		if(!record.temporary) {
			var codedName = this.encodeName(record.name);
			var data = haxe.Serializer.run(record.value);
			localStorage[codedName] = data;
		}
	}
	,loadLocalStorage: function() {
		var localStorageKeys = Object.keys(localStorage);
		var _g = 0;
		while(_g < localStorageKeys.length) {
			var codedName = localStorageKeys[_g];
			++_g;
			try {
				var name = this.decodeName(codedName);
				var data = localStorage[codedName];
				var value = haxe.Unserializer.run(data);
				var record = new nfuzion.storage.Record(name,value);
				this.records.set(name,record);
				record.addEventListener("RecordEvent.change",$bind(this,this.onRecordChange));
			} catch( e ) {
			}
		}
		this.ready = true;
		this.dispatchEvent(new nfuzion.storage.event.StorageEvent("StorageEvent.ready"));
	}
	,createRecord: function(name,temporary) {
		if(temporary == null) temporary = false;
		var record = null;
		if(!this.records.exists(name)) {
			record = new nfuzion.storage.Record(name,null,temporary);
			this.records.set(name,record);
			record.addEventListener("RecordEvent.change",$bind(this,this.onRecordChange));
			record.save();
		}
		return record;
	}
	,deleteRecord: function(name) {
		var record = this.getRecord(name);
		if(record == null) return false;
		if(!record.temporary) {
			var codedName = this.encodeName(record.name);
			localStorage.removeitem(codedName);
		}
		record.removeEventListener("RecordEvent.change",$bind(this,this.onRecordChange));
		record.dispatchEvent(new nfuzion.storage.event.RecordEvent("RecordEvent.delete",record));
		return this.records.remove(name);
	}
	,getTemporaryRecord: function(name) {
		var record = this.records.get(name);
		if(record == null) record = this.createRecord(name,true);
		return record;
	}
	,getRecord: function(name) {
		var record = this.records.get(name);
		if(record == null) record = this.createRecord(name);
		return record;
	}
	,records: null
	,ready: null
	,__class__: nfuzion.storage.PersistentStorage
});
nfuzion.storage.Record = function(name,value,temporary) {
	if(temporary == null) temporary = false;
	nfuzion.event.EventDispatcher.call(this);
	this.name = name;
	this.set_value(value);
	this.temporary = temporary;
};
$hxClasses["nfuzion.storage.Record"] = nfuzion.storage.Record;
nfuzion.storage.Record.__name__ = ["nfuzion","storage","Record"];
nfuzion.storage.Record.__super__ = nfuzion.event.EventDispatcher;
nfuzion.storage.Record.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	save: function() {
		this.dispatchEvent(new nfuzion.storage.event.RecordEvent("RecordEvent.change",this));
	}
	,set_value: function(value) {
		this.value = value;
		this.dispatchEvent(new nfuzion.storage.event.RecordEvent("RecordEvent.change",this));
		return value;
	}
	,value: null
	,temporary: null
	,name: null
	,__class__: nfuzion.storage.Record
	,__properties__: {set_value:"set_value"}
});
nfuzion.storage.event = {}
nfuzion.storage.event.RecordEvent = function(type,target) {
	nfuzion.event.Event.call(this,type);
	this.target = target;
};
$hxClasses["nfuzion.storage.event.RecordEvent"] = nfuzion.storage.event.RecordEvent;
nfuzion.storage.event.RecordEvent.__name__ = ["nfuzion","storage","event","RecordEvent"];
nfuzion.storage.event.RecordEvent.__super__ = nfuzion.event.Event;
nfuzion.storage.event.RecordEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	target: null
	,__class__: nfuzion.storage.event.RecordEvent
});
nfuzion.storage.event.StorageEvent = function(type) {
	nfuzion.event.Event.call(this,type);
};
$hxClasses["nfuzion.storage.event.StorageEvent"] = nfuzion.storage.event.StorageEvent;
nfuzion.storage.event.StorageEvent.__name__ = ["nfuzion","storage","event","StorageEvent"];
nfuzion.storage.event.StorageEvent.__super__ = nfuzion.event.Event;
nfuzion.storage.event.StorageEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	__class__: nfuzion.storage.event.StorageEvent
});
nfuzion.timer = {}
nfuzion.timer.Delay = function(callbackFunction,delay) {
	if(delay == null) delay = 0;
	this.delayTimer = haxe.Timer.delay(callbackFunction,Math.round(delay * 1000));
};
$hxClasses["nfuzion.timer.Delay"] = nfuzion.timer.Delay;
nfuzion.timer.Delay.__name__ = ["nfuzion","timer","Delay"];
nfuzion.timer.Delay.now = function() {
	var timestamp = haxe.Timer.stamp();
	if(timestamp < nfuzion.timer.Delay.lastTimestamp) {
		haxe.Log.trace("FATAL: Timer is broken!",{ fileName : "Delay.hx", lineNumber : 43, className : "nfuzion.timer.Delay", methodName : "now"});
		return -3.4e+038;
	}
	nfuzion.timer.Delay.lastTimestamp = timestamp;
	return nfuzion.timer.Delay.lastTimestamp;
}
nfuzion.timer.Delay.prototype = {
	destroy: function() {
		this.delayTimer.stop();
	}
	,callbackFunction: null
	,end: null
	,delayTimer: null
	,__class__: nfuzion.timer.Delay
}
nfuzion.timer.Timer = function(period,repeatCount) {
	if(repeatCount == null) repeatCount = 0;
	nfuzion.event.EventDispatcher.call(this);
	this.id = Math.round(Math.random() * 65535);
	this.set_period(period);
	this.repeatCount = repeatCount;
};
$hxClasses["nfuzion.timer.Timer"] = nfuzion.timer.Timer;
nfuzion.timer.Timer.__name__ = ["nfuzion","timer","Timer"];
nfuzion.timer.Timer.now = function() {
	return nfuzion.timer.Delay.now();
}
nfuzion.timer.Timer.__super__ = nfuzion.event.EventDispatcher;
nfuzion.timer.Timer.prototype = $extend(nfuzion.event.EventDispatcher.prototype,{
	onTimer: function() {
		this.currentCount++;
		this.dispatchEvent(new nfuzion.timer.event.TimerEvent("timer"));
		if(this.repeatCount != 0 && this.currentCount > this.repeatCount) {
			this.stop();
			this.dispatchEvent(new nfuzion.timer.event.TimerEvent("timerComplete"));
		}
	}
	,reset: function() {
		this.stop();
		this.currentCount = 0;
	}
	,stop: function() {
		if(this.timer != null) {
			this.timer.stop();
			this.timer = null;
		}
	}
	,start: function() {
		if(this.timer != null) this.timer.stop();
		this.timer = new haxe.Timer(Math.round(this.period * 1000));
		this.timer.run = $bind(this,this.onTimer);
	}
	,set_period: function(period) {
		this.period = period;
		if(this.timer != null) {
			this.stop();
			this.start();
		}
		return period;
	}
	,period: null
	,id: null
	,get_running: function() {
		return this.timer != null;
	}
	,running: null
	,repeatCount: null
	,timer: null
	,currentCount: null
	,__class__: nfuzion.timer.Timer
	,__properties__: {get_running:"get_running",set_period:"set_period"}
});
nfuzion.timer.event = {}
nfuzion.timer.event.TimerEvent = function(type) {
	nfuzion.event.Event.call(this,type);
};
$hxClasses["nfuzion.timer.event.TimerEvent"] = nfuzion.timer.event.TimerEvent;
nfuzion.timer.event.TimerEvent.__name__ = ["nfuzion","timer","event","TimerEvent"];
nfuzion.timer.event.TimerEvent.__super__ = nfuzion.event.Event;
nfuzion.timer.event.TimerEvent.prototype = $extend(nfuzion.event.Event.prototype,{
	__class__: nfuzion.timer.event.TimerEvent
});
nfuzion.tween = {}
nfuzion.tween.Tween = function(period,tweenProperties,onComplete) {
	this.properties = tweenProperties;
	this.period = period;
	this.onComplete = onComplete;
	this.start();
};
$hxClasses["nfuzion.tween.Tween"] = nfuzion.tween.Tween;
nfuzion.tween.Tween.__name__ = ["nfuzion","tween","Tween"];
nfuzion.tween.Tween.prototype = {
	destroy: function() {
		nfuzion.nTactic.NTactic.stage.removeEventListener("paint",$bind(this,this.onPaint));
		if(this.onComplete != null) {
			var cb = this.onComplete;
			this.onComplete = null;
			cb();
		}
	}
	,applyType: function(progress,type) {
		var cookedProgress = progress;
		switch( (type)[1] ) {
		case 1:
			var a = 1 - progress;
			a = a * a;
			cookedProgress = 1 - a;
			break;
		case 2:
			cookedProgress = progress * progress;
			break;
		default:
		}
		return cookedProgress;
	}
	,onPaint: function(e) {
		var progress = (nfuzion.timer.Delay.now() - this.startTime) / this.period;
		if(progress > 1) progress = 1;
		var _g = 0, _g1 = this.properties;
		while(_g < _g1.length) {
			var tweenProperty = _g1[_g];
			++_g;
			var cookedProgress = this.applyType(progress,tweenProperty.type);
			var currentValue = tweenProperty.initialValue + tweenProperty.range * cookedProgress;
			tweenProperty.set(currentValue);
		}
		if(progress == 1) this.destroy();
	}
	,start: function() {
		var okay = true;
		var _g = 0, _g1 = this.properties;
		while(_g < _g1.length) {
			var tweenProperty = _g1[_g];
			++_g;
			tweenProperty.initialValue = tweenProperty.get();
			tweenProperty.range = tweenProperty.targetValue - tweenProperty.initialValue;
		}
		this.startTime = nfuzion.timer.Delay.now();
		nfuzion.nTactic.NTactic.stage.addEventListener("paint",$bind(this,this.onPaint));
	}
	,onComplete: null
	,startTime: null
	,properties: null
	,period: null
	,__class__: nfuzion.tween.Tween
}
nfuzion.tween.type = {}
nfuzion.tween.type.TweenProperty = function(target,name,targetValue,type) {
	this.target = target;
	this.name = name;
	this.targetValue = targetValue;
	if(type == null) type = nfuzion.tween.type.TweenType.linear;
	this.type = type;
	var success = true;
	try {
		this.initialValue = Reflect.getProperty(target,name);
	} catch( e ) {
		success = false;
	}
	if(success) this.get = $bind(this,this.getProperty); else try {
		this.get = Reflect.getProperty(target,"get_" + name);
		this.initialValue = this.get();
	} catch( e ) {
		this.get = null;
	}
	if(this.get == null) {
		haxe.Log.trace("ERROR: Getter for property '" + name + "' could not be found.",{ fileName : "TweenProperty.hx", lineNumber : 62, className : "nfuzion.tween.type.TweenProperty", methodName : "new"});
		return;
	}
	success = true;
	try {
		Reflect.setProperty(target,name,this.initialValue);
	} catch( e ) {
		success = false;
	}
	if(success) this.set = $bind(this,this.setProperty); else try {
		this.set = Reflect.getProperty(target,"set_" + name);
	} catch( e ) {
		this.set = null;
	}
	if(this.set == null) {
		haxe.Log.trace("ERROR: Setter for property '" + name + "' could not be found.",{ fileName : "TweenProperty.hx", lineNumber : 93, className : "nfuzion.tween.type.TweenProperty", methodName : "new"});
		return;
	}
};
$hxClasses["nfuzion.tween.type.TweenProperty"] = nfuzion.tween.type.TweenProperty;
nfuzion.tween.type.TweenProperty.__name__ = ["nfuzion","tween","type","TweenProperty"];
nfuzion.tween.type.TweenProperty.prototype = {
	setProperty: function(value) {
		Reflect.setProperty(this.target,this.name,value);
		return value;
	}
	,getProperty: function() {
		return Reflect.getProperty(this.target,this.name);
	}
	,set: null
	,get: null
	,target: null
	,range: null
	,initialValue: null
	,type: null
	,targetValue: null
	,name: null
	,__class__: nfuzion.tween.type.TweenProperty
}
nfuzion.tween.type.TweenType = $hxClasses["nfuzion.tween.type.TweenType"] = { __ename__ : ["nfuzion","tween","type","TweenType"], __constructs__ : ["linear","fast","slow"] }
nfuzion.tween.type.TweenType.linear = ["linear",0];
nfuzion.tween.type.TweenType.linear.toString = $estr;
nfuzion.tween.type.TweenType.linear.__enum__ = nfuzion.tween.type.TweenType;
nfuzion.tween.type.TweenType.fast = ["fast",1];
nfuzion.tween.type.TweenType.fast.toString = $estr;
nfuzion.tween.type.TweenType.fast.__enum__ = nfuzion.tween.type.TweenType;
nfuzion.tween.type.TweenType.slow = ["slow",2];
nfuzion.tween.type.TweenType.slow.toString = $estr;
nfuzion.tween.type.TweenType.slow.__enum__ = nfuzion.tween.type.TweenType;
nfuzion.type = {}
nfuzion.type.Alignment = $hxClasses["nfuzion.type.Alignment"] = { __ename__ : ["nfuzion","type","Alignment"], __constructs__ : ["left","center","right","justify"] }
nfuzion.type.Alignment.left = ["left",0];
nfuzion.type.Alignment.left.toString = $estr;
nfuzion.type.Alignment.left.__enum__ = nfuzion.type.Alignment;
nfuzion.type.Alignment.center = ["center",1];
nfuzion.type.Alignment.center.toString = $estr;
nfuzion.type.Alignment.center.__enum__ = nfuzion.type.Alignment;
nfuzion.type.Alignment.right = ["right",2];
nfuzion.type.Alignment.right.toString = $estr;
nfuzion.type.Alignment.right.__enum__ = nfuzion.type.Alignment;
nfuzion.type.Alignment.justify = ["justify",3];
nfuzion.type.Alignment.justify.toString = $estr;
nfuzion.type.Alignment.justify.__enum__ = nfuzion.type.Alignment;
nfuzion.type.Color = $hxClasses["nfuzion.type.Color"] = { __ename__ : ["nfuzion","type","Color"], __constructs__ : ["aqua","black","blue","fuchsia","gray","green","red","white","yellow","rgb"] }
nfuzion.type.Color.aqua = ["aqua",0];
nfuzion.type.Color.aqua.toString = $estr;
nfuzion.type.Color.aqua.__enum__ = nfuzion.type.Color;
nfuzion.type.Color.black = ["black",1];
nfuzion.type.Color.black.toString = $estr;
nfuzion.type.Color.black.__enum__ = nfuzion.type.Color;
nfuzion.type.Color.blue = ["blue",2];
nfuzion.type.Color.blue.toString = $estr;
nfuzion.type.Color.blue.__enum__ = nfuzion.type.Color;
nfuzion.type.Color.fuchsia = ["fuchsia",3];
nfuzion.type.Color.fuchsia.toString = $estr;
nfuzion.type.Color.fuchsia.__enum__ = nfuzion.type.Color;
nfuzion.type.Color.gray = ["gray",4];
nfuzion.type.Color.gray.toString = $estr;
nfuzion.type.Color.gray.__enum__ = nfuzion.type.Color;
nfuzion.type.Color.green = ["green",5];
nfuzion.type.Color.green.toString = $estr;
nfuzion.type.Color.green.__enum__ = nfuzion.type.Color;
nfuzion.type.Color.red = ["red",6];
nfuzion.type.Color.red.toString = $estr;
nfuzion.type.Color.red.__enum__ = nfuzion.type.Color;
nfuzion.type.Color.white = ["white",7];
nfuzion.type.Color.white.toString = $estr;
nfuzion.type.Color.white.__enum__ = nfuzion.type.Color;
nfuzion.type.Color.yellow = ["yellow",8];
nfuzion.type.Color.yellow.toString = $estr;
nfuzion.type.Color.yellow.__enum__ = nfuzion.type.Color;
nfuzion.type.Color.rgb = function(red,green,blue) { var $x = ["rgb",9,red,green,blue]; $x.__enum__ = nfuzion.type.Color; $x.toString = $estr; return $x; }
nfuzion.type.Frame = function(url,fit,x,y,width,height,floating) {
	if(floating == null) floating = false;
	nfuzion.geometry.Box.call(this,x,y,width,height);
	this.url = url;
	this.fit = fit;
	this.floating = floating;
};
$hxClasses["nfuzion.type.Frame"] = nfuzion.type.Frame;
nfuzion.type.Frame.__name__ = ["nfuzion","type","Frame"];
nfuzion.type.Frame.__super__ = nfuzion.geometry.Box;
nfuzion.type.Frame.prototype = $extend(nfuzion.geometry.Box.prototype,{
	floating: null
	,fit: null
	,url: null
	,__class__: nfuzion.type.Frame
});
nfuzion.type.Orientation = $hxClasses["nfuzion.type.Orientation"] = { __ename__ : ["nfuzion","type","Orientation"], __constructs__ : ["horizontal","vertical"] }
nfuzion.type.Orientation.horizontal = ["horizontal",0];
nfuzion.type.Orientation.horizontal.toString = $estr;
nfuzion.type.Orientation.horizontal.__enum__ = nfuzion.type.Orientation;
nfuzion.type.Orientation.vertical = ["vertical",1];
nfuzion.type.Orientation.vertical.toString = $estr;
nfuzion.type.Orientation.vertical.__enum__ = nfuzion.type.Orientation;
nfuzion.type.VerticalAlignment = $hxClasses["nfuzion.type.VerticalAlignment"] = { __ename__ : ["nfuzion","type","VerticalAlignment"], __constructs__ : ["top","middle","bottom"] }
nfuzion.type.VerticalAlignment.top = ["top",0];
nfuzion.type.VerticalAlignment.top.toString = $estr;
nfuzion.type.VerticalAlignment.top.__enum__ = nfuzion.type.VerticalAlignment;
nfuzion.type.VerticalAlignment.middle = ["middle",1];
nfuzion.type.VerticalAlignment.middle.toString = $estr;
nfuzion.type.VerticalAlignment.middle.__enum__ = nfuzion.type.VerticalAlignment;
nfuzion.type.VerticalAlignment.bottom = ["bottom",2];
nfuzion.type.VerticalAlignment.bottom.toString = $estr;
nfuzion.type.VerticalAlignment.bottom.__enum__ = nfuzion.type.VerticalAlignment;
nfuzion.url = {}
nfuzion.url.Url = function(urlString,throwHints) {
	if(throwHints == null) throwHints = false;
	this.fromString(urlString,throwHints);
};
$hxClasses["nfuzion.url.Url"] = nfuzion.url.Url;
nfuzion.url.Url.__name__ = ["nfuzion","url","Url"];
nfuzion.url.Url.prototype = {
	isNumeric: function(string) {
		var value = Std.parseInt(string);
		if(Std.string(value) == string) return true;
		return false;
	}
	,fromString: function(urlString,throwHints) {
		if(throwHints == null) throwHints = false;
		this.protocol = null;
		this.host = null;
		this.port = null;
		this.path = null;
		this.valid = false;
		if(urlString != null) {
			var urlArray = urlString.split("://");
			if(urlArray.length == 2) {
				this.protocol = urlArray.shift();
				if(this.protocol == "") {
					if(throwHints) throw "No protocol is specified.";
					return;
				}
				urlString = urlArray.shift();
				if(urlString == "") {
					if(throwHints) throw "No hostname is specified.";
					return;
				}
				var index = urlString.indexOf("/");
				if(index >= 0) {
					if(index == 0) {
						if(throwHints) throw "No hostname is specified.";
						return;
					} else {
						urlString = HxOverrides.substr(urlString,0,index);
						this.path = HxOverrides.substr(urlString,index,null);
					}
				} else this.path = "";
				urlArray = urlString.split(":");
				switch(urlArray.length) {
				case 1:
					this.host = urlArray.shift();
					break;
				case 2:
					this.host = urlArray.shift();
					var portString = urlArray.shift();
					if(portString == "") {
						if(throwHints) throw "No port is specified.";
						return;
					}
					this.port = Std.parseInt(portString);
					if(Std.string(this.port) != portString) {
						this.port = null;
						if(throwHints) throw "The port is not a number.";
					}
					if(this.port < 0 || this.port > 65535) {
						this.port = null;
						if(throwHints) throw "The port is out of range.";
					}
					break;
				default:
					if(throwHints) throw "There are too many colons after the hostname.";
				}
			} else {
				if(throwHints) throw "There are too many protocol delimiters.";
				return;
			}
			if(this.isNumeric(this.host.charAt(0))) {
				var hostArray = this.host.split(".");
				if(hostArray.length == 4) {
					var numberArray = new Array();
					var _g = 0;
					while(_g < hostArray.length) {
						var numberString = hostArray[_g];
						++_g;
						var number = Std.parseInt(numberString);
						if(Std.string(number) != numberString || number < 0 || number > 255) break;
						numberArray.push(number);
					}
					if(numberArray.length == 4) {
						if(numberArray[0] == 0 || numberArray[0] == 169 && numberArray[1] == 254 || numberArray[0] == 192 && numberArray[1] == 0 && numberArray[2] == 2 || numberArray[0] == 198 && numberArray[1] == 51 && numberArray[2] == 100 || numberArray[0] == 203 && numberArray[1] == 0 && numberArray[2] == 113 || (numberArray[0] & 240) == 224 || (numberArray[0] & 240) == 240 || numberArray[0] == 255 && numberArray[1] == 255 && numberArray[2] == 255 && numberArray[3] == 255) {
							if(throwHints) throw "The specified IP is reserved by the IETF.";
						} else this.valid = true;
						return;
					}
				}
			}
			if(this.host.length > 255) {
				if(throwHints) throw "The specified hostname is too long.";
				return;
			}
			if(this.host.indexOf("..") >= 0) {
				if(throwHints) throw "The hostname may not include unseparated periods.";
			}
			var hostArray = this.host.split(".");
			var _g = 0;
			while(_g < hostArray.length) {
				var label = hostArray[_g];
				++_g;
				if(label.charAt(0) == "-" || label.charAt(label.length - 1) == "-") {
					if(throwHints) throw "The hostname may not begin or end with the hyphen.";
					return;
				}
				if(label.length > 63) {
					if(throwHints) throw "The hostname component may not be longer than 63 characters.";
					return;
				}
				if(label.length < 1) {
					if(throwHints) throw "The hostname may not begin or end with a period.";
					return;
				}
			}
			var _g1 = 0, _g = this.host.length;
			while(_g1 < _g) {
				var i = _g1++;
				var charCode = HxOverrides.cca(this.host,i);
				if(!(charCode >= HxOverrides.cca("a",0) && charCode <= HxOverrides.cca("z",0) || charCode >= HxOverrides.cca("A",0) && charCode <= HxOverrides.cca("Z",0) || charCode >= HxOverrides.cca("0",0) && charCode <= HxOverrides.cca("9",0) || charCode == HxOverrides.cca("-",0) || charCode == HxOverrides.cca(".",0))) {
					if(throwHints) throw "The hostname may not contain the character '" + this.host.charAt(i) + "'.";
					return;
				}
			}
			this.valid = true;
		}
	}
	,toString: function() {
		var url = null;
		if(this.valid) {
			url = this.protocol + "://" + this.host;
			if(this.port != null) url = url + ":" + this.port;
			url = url + this.path;
		}
		return url;
	}
	,valid: null
	,path: null
	,port: null
	,host: null
	,protocol: null
	,__class__: nfuzion.url.Url
}
nfuzion.utility = {}
nfuzion.utility.BaseCode32 = function() { }
$hxClasses["nfuzion.utility.BaseCode32"] = nfuzion.utility.BaseCode32;
nfuzion.utility.BaseCode32.__name__ = ["nfuzion","utility","BaseCode32"];
nfuzion.utility.BaseCode32.encodeString = function(string) {
	var bytes = haxe.io.Bytes.ofString(string);
	var encodings = haxe.io.Bytes.ofString("abcdefghijklmnopqrstuvwxyz234567");
	var base32 = new haxe.crypto.BaseCode(encodings).encodeBytes(bytes).toString();
	return base32;
}
nfuzion.utility.BaseCode32.decodeString = function(base32) {
	var encodings = haxe.io.Bytes.ofString("abcdefghijklmnopqrstuvwxyz234567");
	var bytes = new haxe.crypto.BaseCode(encodings).decodeBytes(haxe.io.Bytes.ofString(base32));
	return bytes.toString();
}
nfuzion.utility.CharacterTools = function() { }
$hxClasses["nfuzion.utility.CharacterTools"] = nfuzion.utility.CharacterTools;
nfuzion.utility.CharacterTools.__name__ = ["nfuzion","utility","CharacterTools"];
nfuzion.utility.CharacterTools.isNumeric = function(code) {
	if(code >= nfuzion.utility.CharacterTools.CODE_0 && code <= nfuzion.utility.CharacterTools.CODE_9) return true;
	return false;
}
nfuzion.utility.CharacterTools.isUpperAlpha = function(code) {
	if(code >= nfuzion.utility.CharacterTools.CODE_A && code <= nfuzion.utility.CharacterTools.CODE_Z) return true;
	return false;
}
nfuzion.utility.CharacterTools.isLowerAlpha = function(code) {
	if(code >= nfuzion.utility.CharacterTools.CODE_a && code <= nfuzion.utility.CharacterTools.CODE_z) return true;
	return false;
}
nfuzion.utility.CharacterTools.isAlpha = function(code) {
	if(nfuzion.utility.CharacterTools.isUpperAlpha(code) || nfuzion.utility.CharacterTools.isLowerAlpha(code)) return true;
	return false;
}
nfuzion.utility.CharacterTools.isAlphaNumeric = function(code) {
	if(nfuzion.utility.CharacterTools.isAlpha(code) || nfuzion.utility.CharacterTools.isNumeric(code)) return true;
	return false;
}
nfuzion.utility.ColorTools = function() { }
$hxClasses["nfuzion.utility.ColorTools"] = nfuzion.utility.ColorTools;
nfuzion.utility.ColorTools.__name__ = ["nfuzion","utility","ColorTools"];
nfuzion.utility.ColorTools.toInt = function(color) {
	return (function($this) {
		var $r;
		var $e = (color);
		switch( $e[1] ) {
		case 9:
			var blue = $e[4], green = $e[3], red = $e[2];
			$r = red << 16 | green << 8 | blue;
			break;
		case 0:
			$r = 65535;
			break;
		case 1:
			$r = 0;
			break;
		case 2:
			$r = 255;
			break;
		case 3:
			$r = 16711935;
			break;
		case 4:
			$r = 8421504;
			break;
		case 5:
			$r = 65280;
			break;
		case 6:
			$r = 16711680;
			break;
		case 7:
			$r = 16777215;
			break;
		case 8:
			$r = 16776960;
			break;
		}
		return $r;
	}(this));
}
nfuzion.utility.ColorTools.toString = function(color) {
	return StringTools.hex(nfuzion.utility.ColorTools.toInt(color),6);
}
nfuzion.utility.ColorTools.fromInt = function(value) {
	return nfuzion.type.Color.rgb(value >> 16 & 255,value >> 8 & 255,value & 255);
}
nfuzion.utility.ColorTools.fromString = function(value) {
	var color = null;
	if(nfuzion.utility.CharacterTools.isAlpha(HxOverrides.cca(value,0))) try {
		color = Type.createEnum(nfuzion.type.Color,value);
	} catch( e ) {
		color = null;
	} else {
		if(value.charAt(0) == "#") value = "0x" + HxOverrides.substr(value,1,null);
		var $int = Std.parseInt(value);
		color = nfuzion.utility.ColorTools.fromInt($int);
	}
	return color;
}
nfuzion.widget = {}
nfuzion.widget.IWidget = function() { }
$hxClasses["nfuzion.widget.IWidget"] = nfuzion.widget.IWidget;
nfuzion.widget.IWidget.__name__ = ["nfuzion","widget","IWidget"];
nfuzion.widget.IWidget.__interfaces__ = [nfuzion.event.IEventDispatcher,nfuzion.relation.IChild];
nfuzion.widget.IWidget.prototype = {
	destroy: null
	,fullName: null
	,cancel: null
	,copy: null
	,clone: null
	,removedFromStage: null
	,addedToStage: null
	,encloseGraphics: null
	,name: null
	,bubbleComponentEvents: null
	,__class__: nfuzion.widget.IWidget
}
nfuzion.widget.Simple = function(name,component) {
	this.listenersAdded = false;
	nfuzion.event.ListenerManagerAndEventDispatcher.call(this);
	this.name = name;
	this.initialize();
	if(component != null) this.encloseGraphics(component);
	this.restoreListeners();
};
$hxClasses["nfuzion.widget.Simple"] = nfuzion.widget.Simple;
nfuzion.widget.Simple.__name__ = ["nfuzion","widget","Simple"];
nfuzion.widget.Simple.__interfaces__ = [nfuzion.widget.IWidget];
nfuzion.widget.Simple.__super__ = nfuzion.event.ListenerManagerAndEventDispatcher;
nfuzion.widget.Simple.prototype = $extend(nfuzion.event.ListenerManagerAndEventDispatcher.prototype,{
	destroy: function() {
		this.removeListeners();
		this.parent = null;
		this.implementation = null;
		this.set_target(null);
	}
	,get_fullName: function() {
		if(this.parent != null) return this.parent.get_fullName() + "." + this.name;
		return this.name;
	}
	,fullName: null
	,cancel: function() {
	}
	,copy: function(from) {
		if(!js.Boot.__instanceof(from,nfuzion.widget.Simple)) throw "ERROR: Source widget is not an instance of Simple.";
		var simple = from;
		this.bubbleComponentEvents = simple.bubbleComponentEvents;
		this.set_visible(simple.get_visible());
		this.set_enabled(simple.get_enabled());
		this.set_acceptsFocus(simple.get_acceptsFocus());
	}
	,clone: function(name) {
		var component = null;
		if(this.implementation != null) component = this.implementation.clone();
		var cls = Type.getClass(this);
		if(name == null) name = this.name;
		var clone = Type.createInstance(cls,[name,component]);
		clone.copy(this);
		return clone;
	}
	,dispatchEvent: function(event) {
		nfuzion.event.ListenerManagerAndEventDispatcher.prototype.dispatchEvent.call(this,event);
		if(js.Boot.__instanceof(event,nfuzion.event.BubblingEvent) && this.parent != null) {
			var bubblingEvent = event;
			if(bubblingEvent.bubbles && !bubblingEvent.stop && !bubblingEvent.stopNow) this.parent.dispatchEvent(event);
		}
	}
	,getComponentChild: function(component,name) {
		var container = null;
		try {
			container = component;
		} catch( e ) {
			container = null;
		}
		var child = null;
		if(container != null) child = container.getChild(name);
		return child;
	}
	,get_hasHotspot: function() {
		return this.hotspot != null;
	}
	,hasHotspot: null
	,takeFocus: function() {
		if(this.get_hasFocus()) this.endFocus();
	}
	,giveFocus: function() {
		if(!this.get_hasFocus()) this.beginFocus();
	}
	,get_hasFocus: function() {
		return this.hasFocus;
	}
	,hasFocus: null
	,set_acceptsFocus: function(acceptsFocus) {
		this.acceptsFocus = acceptsFocus;
		return acceptsFocus;
	}
	,get_acceptsFocus: function() {
		return this.focus != null && this.acceptsFocus;
	}
	,acceptsFocus: null
	,update: function() {
	}
	,set_enabled: function(enabled) {
		if(this.target != null) {
			if(this.target.touchEnabled != enabled) {
				this.target.set_touchEnabled(enabled);
				if(enabled) this.restoreListeners(); else {
					this.removeListeners();
					this.cancel();
				}
				this.update();
			}
			return this.target.touchEnabled;
		}
		return enabled;
	}
	,get_enabled: function() {
		if(this.target == null) return false;
		return this.target.touchEnabled;
	}
	,enabled: null
	,set_visible: function(visible) {
		this.visible = visible;
		if(this.implementation != null) {
			var change = this.implementation.visible != visible;
			if(change) {
				this.implementation.set_visible(visible);
				this.dispatchEvent(new nfuzion.widget.event.WidgetEvent("WidgetEvent.visibility",this));
			}
		}
		return visible;
	}
	,get_visible: function() {
		return this.visible;
	}
	,visible: null
	,discardEvent: function(e) {
		e.stopImmediatePropagation();
	}
	,removedFromStage: function() {
		this.purgeListeners();
		this.takeFocus();
	}
	,addedToStage: function() {
		this.restoreListeners();
	}
	,endFocus: function() {
		this.implementation.set_guise(null);
		this.hasFocus = false;
	}
	,beginFocus: function() {
		this.implementation.set_guise("focus");
		this.hasFocus = true;
	}
	,removeListeners: function() {
		this.detachAllListeners();
		this.listenersAdded = false;
	}
	,addListeners: function() {
		this.listenersAdded = true;
	}
	,purgeListeners: function() {
		if(this.listenersAdded) this.removeListeners();
	}
	,restoreListeners: function() {
		if(this.implementation == null) return;
		if(this.get_enabled() && this.implementation.get_stage() != null && !this.listenersAdded) this.addListeners();
	}
	,set_target: function(target) {
		if(this.target != target) {
			this.purgeListeners();
			this.target = target;
			this.restoreListeners();
		}
		return this.target;
	}
	,target: null
	,orphan: function() {
		this.parent = null;
	}
	,adopt: function(parent) {
		this.parent = parent;
		if(parent.implementation.get_stage() != null) this.addedToStage();
	}
	,findComponents: function(container) {
		if(this.implementation == null) return;
		this.purgeListeners();
		var restoreFocus = this.get_hasFocus();
		if(this.focus != null) this.focus.set_alpha(0);
		this.focus = this.getComponentChild(this.implementation,"focus");
		if(this.focus != null) this.focus.set_alpha(0);
		this.hotspot = this.getComponentChild(this.implementation,"hotspot");
		if(this.hotspot != null) this.set_target(this.hotspot); else this.set_target(this.implementation);
		this.set_enabled(false);
		if(restoreFocus && this.focus != null) {
			this.focus.set_alpha(1);
			this.beginFocus();
		}
	}
	,configureComponent: function() {
	}
	,refresh: function() {
		this.purgeListeners();
		if(this.implementation != null) {
			if(js.Boot.__instanceof(this.implementation,nfuzion.graphics.Container)) {
				var container = this.implementation;
				this.findComponents(container);
			}
			this.configureComponent();
		}
		this.restoreListeners();
	}
	,encloseGraphics: function(component) {
		if(this.implementation != null) {
			haxe.Log.trace("ERROR: Widget already contains graphics.",{ fileName : "Simple.hx", lineNumber : 78, className : "nfuzion.widget.Simple", methodName : "encloseGraphics"});
			return false;
		}
		this.implementation = component;
		this.refresh();
		return component != null;
	}
	,initialize: function() {
		this.bubbleComponentEvents = true;
	}
	,listenersAdded: null
	,hotspot: null
	,focus: null
	,bubbleComponentEvents: null
	,parent: null
	,name: null
	,implementation: null
	,__class__: nfuzion.widget.Simple
	,__properties__: {set_target:"set_target",set_visible:"set_visible",get_visible:"get_visible",set_enabled:"set_enabled",get_enabled:"get_enabled",set_acceptsFocus:"set_acceptsFocus",get_acceptsFocus:"get_acceptsFocus",get_hasFocus:"get_hasFocus",get_hasHotspot:"get_hasHotspot",get_fullName:"get_fullName"}
});
nfuzion.widget.Group = function(name,component) {
	this.firstUpdate = false;
	this.currentComponent = null;
	nfuzion.widget.Simple.call(this,name,component);
};
$hxClasses["nfuzion.widget.Group"] = nfuzion.widget.Group;
nfuzion.widget.Group.__name__ = ["nfuzion","widget","Group"];
nfuzion.widget.Group.__interfaces__ = [nfuzion.relation.IParent];
nfuzion.widget.Group.__super__ = nfuzion.widget.Simple;
nfuzion.widget.Group.prototype = $extend(nfuzion.widget.Simple.prototype,{
	destroy: function() {
		nfuzion.widget.Simple.prototype.destroy.call(this);
		while(this.children.length > 0) {
			var child = this.children.pop();
			child.orphan();
			child.destroy();
			child = null;
		}
	}
	,get_fullName: function() {
		if(this.parent == null) return nfuzion.widget.Simple.prototype.get_fullName.call(this);
		return this.parent.get_fullName() + "." + this.name;
	}
	,copy: function(from) {
		nfuzion.widget.Simple.prototype.copy.call(this,from);
		if(!js.Boot.__instanceof(from,nfuzion.widget.Group)) throw "ERROR: Source widget is not an instance of Group.";
		var group = from;
		this.set_exclusiveChildren(group.exclusiveChildren);
		this.set_radioButtons(group.radioButtons);
		this.set_requireSelection(group.requireSelection);
		this.setSelection(group.getSelection(),false);
		this.set_eventsRequireChange(group.eventsRequireChange);
	}
	,removedFromStage: function() {
		nfuzion.widget.Simple.prototype.removedFromStage.call(this);
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.removedFromStage();
		}
	}
	,addedToStage: function() {
		nfuzion.widget.Simple.prototype.addedToStage.call(this);
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			child.addedToStage();
		}
	}
	,findChildWidgets: function(container) {
		var _g = 0, _g1 = container.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			var done = false;
			var widget = this.createChild(child.name,child);
			if(widget != null) {
				this.appendChild(widget);
				done = true;
			}
			if(!done) {
				if(js.Boot.__instanceof(child,nfuzion.graphics.Container)) this.findChildWidgets(child);
			}
		}
	}
	,createChild: function(name,component) {
		var nameArray = name.split("_");
		if(nameArray.length > 1) {
			var className = nameArray.pop();
			className = className.charAt(0).toUpperCase() + HxOverrides.substr(className,1,null);
			var cls = Type.resolveClass("nfuzion.widget." + className);
			if(cls != null) {
				var widget = Type.createInstance(cls,[name,component]);
				if(widget != null) return widget;
			}
		}
		return null;
	}
	,findComponents: function(container) {
		nfuzion.widget.Simple.prototype.findComponents.call(this,container);
		this.findChildWidgets(container);
	}
	,get_childCount: function() {
		return this.children.length;
	}
	,childCount: null
	,getChild: function(name) {
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.name == name) return child;
		}
		return null;
	}
	,getChildAt: function(index) {
		if(index >= 0 && index < this.children.length) return this.children[index];
		return null;
	}
	,getChildIndex: function(child) {
		var _g1 = 0, _g = this.get_childCount();
		while(_g1 < _g) {
			var i = _g1++;
			if(this.children[i] == child) return i;
		}
		return -1;
	}
	,removeChildAt: function(index) {
		if(index > 0 && index < this.children.length) {
			this.children[index].orphan();
			return this.removeChild(this.children[index]);
		}
		return false;
	}
	,removeChild: function(child) {
		var success = HxOverrides.remove(this.children,child);
		child.orphan();
		return success;
	}
	,insertChildAfter: function(child,after) {
		var afterIndex = this.getChildIndex(after);
		if(afterIndex >= 0) {
			this.insertChild(child,afterIndex);
			return true;
		}
		return false;
	}
	,insertChild: function(child,index) {
		if(index == null) index = 0;
		if(this.get_childCount() == 0 || index >= this.get_childCount()) return this.appendChild(child);
		if(index <= 0) index = 0;
		if(this.implementation != null && js.Boot.__instanceof(this.implementation,nfuzion.graphics.Container)) {
			var container = this.implementation;
			if(child.implementation != null && child.implementation.parent == null) {
				var displacedChild = this.getChildAt(index);
				container.insertChildAfter(child.implementation,displacedChild.implementation);
			}
		}
		child.adopt(this);
		this.children.splice(index,0,child);
		return true;
	}
	,appendChild: function(child) {
		if(child == null) throw "ERROR: Failed to add null child on " + this.name + ".";
		if(this.implementation != null && js.Boot.__instanceof(this.implementation,nfuzion.graphics.Container)) {
			var container = this.implementation;
			if(child.implementation != null && child.implementation.parent == null) container.appendChild(child.implementation);
		}
		this.children.push(child);
		child.adopt(this);
		return true;
	}
	,set_eventsRequireChange: function(value) {
		this.eventsRequireChange = value;
		return value;
	}
	,eventsRequireChange: null
	,previousSelection: function() {
	}
	,nextSelection: function() {
	}
	,onButtonClick: function(e) {
		if(!e.target.activated) this.setSelection(e.target.name); else if(!this.requireSelection) this.setSelection(null); else this.setSelection(e.target.name);
	}
	,onVisibility: function(e) {
		if(e == null || e.target.get_visible() == true) {
			var _g1 = 0, _g = this.get_childCount();
			while(_g1 < _g) {
				var index = _g1++;
				var widget = this.getChildAt(index);
				if(widget != null) {
					if(e == null || widget != e.target) widget.set_visible(false);
				}
			}
		}
	}
	,hideChildren: function(e) {
	}
	,getSelection: function() {
		return null;
	}
	,setSelection: function(selection,doEventDispatch) {
		if(doEventDispatch == null) doEventDispatch = true;
		var found = false;
		var noChange = false;
		var button = null;
		var selectedButton = null;
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var widget = _g1[_g];
			++_g;
			if(widget != null && StringTools.endsWith(widget.name,"_button")) {
				button = js.Boot.__cast(widget , nfuzion.widget.Button);
				if(found || widget.name != selection) button.set_activated(false); else {
					found = true;
					if(button.activated) {
						if(button.name == selection) noChange = true;
					} else {
						selectedButton = button;
						button.set_activated(true);
					}
				}
			}
		}
		if((!noChange || !this.eventsRequireChange) && doEventDispatch) {
			if(selectedButton != null) this.dispatchEvent(new nfuzion.widget.event.WidgetEvent("WidgetEvent.select",selectedButton,false));
		}
	}
	,set_requireSelection: function(requireSelection) {
		this.requireSelection = requireSelection;
		return requireSelection;
	}
	,requireSelection: null
	,set_radioButtons: function(radioButtons) {
		this.radioButtons = radioButtons;
		var found = false;
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var widget = _g1[_g];
			++_g;
			if(widget != null && StringTools.endsWith(widget.name,"_button")) {
				if(radioButtons) {
					var button = js.Boot.__cast(widget , nfuzion.widget.Button);
					button.addEventListener("ButtonEvent.click",$bind(this,this.onButtonClick));
					if(found) button.set_activated(false); else if(button.activated) found = true;
				} else widget.removeEventListener("ButtonEvent.click",$bind(this,this.onButtonClick));
			}
		}
		return radioButtons;
	}
	,radioButtons: null
	,set_exclusiveChildren: function(exclusiveChildren) {
		this.exclusiveChildren = exclusiveChildren;
		if(exclusiveChildren) this.attachListener(this,"WidgetEvent.visibility",$bind(this,this.onVisibility)); else this.detachListener(this,"WidgetEvent.visibility",$bind(this,this.onVisibility));
		if(exclusiveChildren) this.onVisibility();
		return exclusiveChildren;
	}
	,exclusiveChildren: null
	,getWidgetByArray: function(nameArray) {
		if(nameArray == null || nameArray.length == 0) return null;
		var name = nameArray.shift();
		var child = this.getChild(name);
		if(child == null) {
			child = this.createChild(name);
			this.appendChild(child);
		}
		if(child == null) {
			haxe.Log.trace("ERROR: Could not find or create child '" + name + "'.",{ fileName : "Group.hx", lineNumber : 72, className : "nfuzion.widget.Group", methodName : "getWidgetByArray"});
			return null;
		}
		if(nameArray.length > 0) {
			var group = child;
			if(group != null) return group.getWidgetByArray(nameArray); else {
				haxe.Log.trace("ERROR: Widget '" + name + "' cannot contain children.",{ fileName : "Group.hx", lineNumber : 84, className : "nfuzion.widget.Group", methodName : "getWidgetByArray"});
				return null;
			}
		}
		return child;
	}
	,getWidget: function(name) {
		if(name == null || name == "") return null;
		var nameArray = name.split(".");
		return this.getWidgetByArray(nameArray);
	}
	,initialize: function() {
		nfuzion.widget.Simple.prototype.initialize.call(this);
		this.children = new Array();
		this.set_exclusiveChildren(false);
		this.set_radioButtons(false);
		this.set_requireSelection(false);
		this.currentComponent = null;
		this.set_eventsRequireChange(true);
		this.firstUpdate = false;
	}
	,children: null
	,firstUpdate: null
	,currentComponent: null
	,__class__: nfuzion.widget.Group
	,__properties__: $extend(nfuzion.widget.Simple.prototype.__properties__,{set_exclusiveChildren:"set_exclusiveChildren",set_radioButtons:"set_radioButtons",set_requireSelection:"set_requireSelection",set_eventsRequireChange:"set_eventsRequireChange",get_childCount:"get_childCount"})
});
nfuzion.widget.Button = function(name,component) {
	this.down = false;
	this.pressed = false;
	this.mDirectClick = false;
	this.pressDelayPeriod = 0;
	nfuzion.widget.Group.call(this,name,component);
};
$hxClasses["nfuzion.widget.Button"] = nfuzion.widget.Button;
nfuzion.widget.Button.__name__ = ["nfuzion","widget","Button"];
nfuzion.widget.Button.__super__ = nfuzion.widget.Group;
nfuzion.widget.Button.prototype = $extend(nfuzion.widget.Group.prototype,{
	setText: function(text,labelName) {
		if(labelName == null) labelName = "text_label";
		var mainLabel = this.getChild(labelName);
		if(mainLabel != null) mainLabel.set_text(text);
	}
	,updateIcons: function() {
		if(this.iconFrameName != null) {
			if(this.icon != null) {
				var frameName = this.iconFrameName + "_" + this.iconFrameNameSuffix;
				if(this.icon.frames.exists(frameName)) this.icon["goto"](frameName); else this.icon["goto"](this.iconFrameName);
			}
		}
	}
	,gotoIcon: function(name) {
		this.iconFrameName = name;
		this.updateIcons();
	}
	,copy: function(from) {
		nfuzion.widget.Group.prototype.copy.call(this,from);
		if(!js.Boot.__instanceof(from,nfuzion.widget.Button)) throw "ERROR: Source widget is not an instance of Button.";
		var button = from;
		this.set_longPressDelay(button.get_longPressDelay());
		this.set_toggleMode(button.toggleMode);
		this.set_autoRepeatPeriod(button.autoRepeatPeriod);
		this.set_autoRepeatDelay(button.autoRepeatDelay);
	}
	,set_activated: function(activated) {
		if(this.activated != activated) {
			this.activated = activated;
			this.dispatchEvent(new nfuzion.widget.event.ButtonEvent("ButtonEvent.activeChange",this,true));
			this.update();
		}
		return activated;
	}
	,activated: null
	,set_down: function(down) {
		this.down = down;
		this.dispatchEvent(new nfuzion.widget.event.ButtonEvent("ButtonEvent.toggle",this,true));
		return down;
	}
	,down: null
	,set_pressed: function(pressed) {
		this.pressed = pressed;
		if(pressed) this.dispatchEvent(new nfuzion.widget.event.ButtonEvent("ButtonEvent.down",this,true)); else if(this.currentTouchId == null) this.dispatchEvent(new nfuzion.widget.event.ButtonEvent("ButtonEvent.up",this,true)); else this.dispatchEvent(new nfuzion.widget.event.ButtonEvent("ButtonEvent.up",this,true));
		return pressed;
	}
	,pressed: null
	,toggle: function() {
		this.set_down(!this.down);
	}
	,update: function() {
		if(this.implementation == null) return;
		var showDown = this.toggleMode && this.down || !this.toggleMode && this.pressed;
		if(this.get_enabled()) {
			if(showDown) {
				this.implementation.set_guise("down");
				this.iconFrameNameSuffix = "down";
			} else if(this.activated) {
				this.implementation.set_guise("active");
				this.iconFrameNameSuffix = "active";
			} else {
				this.implementation.set_guise(null);
				this.iconFrameNameSuffix = "up";
			}
		} else {
			this.implementation.set_guise("disabled");
			this.iconFrameNameSuffix = "disabled";
		}
		if(this.implementation.frames.exists(this.iconFrameNameSuffix)) this.implementation["goto"](this.iconFrameNameSuffix); else if(this.implementation.frames.keys().hasNext()) this.implementation["goto"](this.implementation.frames.keys().next());
		this.updateIcons();
	}
	,set_requireDirectTouch: function(requireDirectTouch) {
		if(this.requireDirectTouch != requireDirectTouch) this.requireDirectTouch = requireDirectTouch;
		return this.requireDirectTouch;
	}
	,requireDirectTouch: null
	,set_autoRepeatDelay: function(delay) {
		this.autoRepeatDelay = delay;
		return this.autoRepeatDelay;
	}
	,autoRepeatDelay: null
	,set_autoRepeatPeriod: function(period) {
		this.autoRepeatPeriod = period;
		return this.autoRepeatPeriod;
	}
	,autoRepeatPeriod: null
	,set_toggleMode: function(toggleMode) {
		this.toggleMode = toggleMode;
		return this.toggleMode;
	}
	,toggleMode: null
	,set_longPressDelay: function(delay) {
		this.longPressTimer.set_period(delay);
		return delay;
	}
	,get_longPressDelay: function() {
		return this.longPressTimer.period;
	}
	,onAutoRepeat: function(e) {
		this.dispatchEvent(new nfuzion.widget.event.ButtonEvent("ButtonEvent.autoClick",this,true));
		if(this.autoRepeatPeriod > 0) {
			if(this.autoRepeatTimer.period != this.autoRepeatPeriod) this.autoRepeatTimer.set_period(this.autoRepeatPeriod);
		} else this.autoRepeatTimer.stop();
	}
	,onDownLong: function(e) {
		this.longPressTimer.stop();
		this.mDirectClick = false;
		this.dispatchEvent(new nfuzion.widget.event.ButtonEvent("ButtonEvent.longPress",this,true));
	}
	,release: function() {
		if(this.pressed) {
			this.set_pressed(false);
			this.longPressTimer.stop();
			this.autoRepeatTimer.stop();
			this.update();
		}
	}
	,cancel: function() {
		this.release();
		if(this.pressDelay != null) this.pressDelay.destroy();
		this.detachListener(this.target,"over",$bind(this,this.onTouchOver));
		this.detachListener(this.implementation.get_stage(),"end",$bind(this,this.onTouchEnd));
		this.detachListener(this.target,"out",$bind(this,this.onTouchOut));
		this.currentTouchId = null;
	}
	,press: function() {
		if(!this.pressed) {
			this.set_pressed(true);
			if(this.get_longPressDelay() > 0) this.longPressTimer.start();
			if(this.autoRepeatPeriod > 0) {
				this.autoRepeatTimer.set_period(this.autoRepeatDelay);
				this.autoRepeatTimer.start();
			}
			this.dispatchEvent(new nfuzion.widget.event.ButtonEvent("ButtonEvent.autoClick",this,true));
			this.update();
		}
	}
	,endTouch: function() {
		this.detachListener(this.implementation.get_stage(),"end",$bind(this,this.onTouchEnd));
		this.detachListener(this.target,"out",$bind(this,this.onTouchOut));
	}
	,startTouch: function() {
		this.attachListener(this.target.get_stage(),"end",$bind(this,this.onTouchEnd));
		this.attachListener(this.target,"out",$bind(this,this.onTouchOut));
		if(this.pressDelayPeriod > 0) this.pressDelay = new nfuzion.timer.Delay($bind(this,this.press),this.pressDelayPeriod); else this.press();
	}
	,onTouchEnd: function(e) {
		if(this.currentTouchId == e.id) {
			this.endTouch();
			if(!this.bubbleComponentEvents) e.stopPropagation();
			this.currentTouchId = null;
			if(e.target == this.target) {
				if(this.toggleMode) this.set_down(!this.down);
				e.stopPropagation();
				this.dispatchEvent(new nfuzion.widget.event.ButtonEvent("ButtonEvent.click",this,true));
			}
			this.release();
		}
	}
	,onTouchOut: function(e) {
		if(this.currentTouchId == e.id) {
			if(!this.directTouch) {
				this.currentTouchId = null;
				this.endTouch();
			}
			if(!this.bubbleComponentEvents) e.stopPropagation();
			this.release();
		}
	}
	,onTouchOver: function(e) {
		if(this.get_enabled()) {
			if(this.currentTouchId == e.id) {
				if(!this.bubbleComponentEvents) e.stopPropagation();
				this.press();
			} else if(!this.requireDirectTouch && this.currentTouchId == null) {
				this.currentTouchId = e.id;
				this.directTouch = false;
				this.startTouch();
			}
		}
	}
	,onTouchBegin: function(e) {
		if(this.get_enabled() && this.currentTouchId == null) {
			this.currentTouchId = e.id;
			if(!this.bubbleComponentEvents) e.stopPropagation();
			this.directTouch = true;
			this.startTouch();
		}
	}
	,destroy: function() {
		if(this.pressDelay != null) this.pressDelay.destroy();
		nfuzion.widget.Group.prototype.destroy.call(this);
	}
	,removeListeners: function() {
		nfuzion.widget.Group.prototype.removeListeners.call(this);
		this.currentTouchId = null;
		this.release();
	}
	,addListeners: function() {
		nfuzion.widget.Group.prototype.addListeners.call(this);
		this.attachListener(this.longPressTimer,"timer",$bind(this,this.onDownLong));
		this.attachListener(this.autoRepeatTimer,"timer",$bind(this,this.onAutoRepeat));
		this.attachListener(this.target,"begin",$bind(this,this.onTouchBegin));
		this.attachListener(this.target,"over",$bind(this,this.onTouchOver));
	}
	,set_target: function(target) {
		return nfuzion.widget.Group.prototype.set_target.call(this,target);
	}
	,findComponents: function(container) {
		nfuzion.widget.Group.prototype.findComponents.call(this,container);
		this.set_enabled(true);
		this.icon = this.getComponentChild(this.implementation,"icon");
		var widget = this.getChild("text_label");
		if(widget != null && js.Boot.__instanceof(widget,nfuzion.widget.Label)) this.label = widget;
		this.update();
	}
	,initialize: function() {
		nfuzion.widget.Group.prototype.initialize.call(this);
		this.bubbleComponentEvents = false;
		this.longPressTimer = new nfuzion.timer.Timer(0);
		this.autoRepeatTimer = new nfuzion.timer.Timer(0);
		this.set_requireDirectTouch(true);
		this.set_autoRepeatDelay(0);
		this.set_autoRepeatPeriod(0);
		this.set_activated(false);
		this.currentTouchId = null;
	}
	,pressDelay: null
	,iconFrameNameSuffix: null
	,iconFrameName: null
	,icon: null
	,currentTouchId: null
	,mDirectClick: null
	,directTouch: null
	,autoRepeatTimer: null
	,longPressTimer: null
	,pressDelayPeriod: null
	,label: null
	,__class__: nfuzion.widget.Button
	,__properties__: $extend(nfuzion.widget.Group.prototype.__properties__,{set_longPressDelay:"set_longPressDelay",get_longPressDelay:"get_longPressDelay",set_toggleMode:"set_toggleMode",set_autoRepeatPeriod:"set_autoRepeatPeriod",set_autoRepeatDelay:"set_autoRepeatDelay",set_requireDirectTouch:"set_requireDirectTouch",set_pressed:"set_pressed",set_down:"set_down",set_activated:"set_activated"})
});
nfuzion.widget.Chain = function(name,component) {
	this.currentTouchId = null;
	nfuzion.widget.Group.call(this,name,component);
};
$hxClasses["nfuzion.widget.Chain"] = nfuzion.widget.Chain;
nfuzion.widget.Chain.__name__ = ["nfuzion","widget","Chain"];
nfuzion.widget.Chain.__super__ = nfuzion.widget.Group;
nfuzion.widget.Chain.prototype = $extend(nfuzion.widget.Group.prototype,{
	onScrollerPosition: function(e) {
		if(this.pageScroller.thumbDown) {
			this.currentPage = Math.round(this.pageScroller.get_value());
			this.gotoPage();
		}
	}
	,onMagicScroll: function(e) {
		var delta = e.deltaX * this.implementation.get_stage()._width;
		switch( (e.phase)[1] ) {
		case 0:
			this.killTweens();
			this.attachListener(this.implementation.get_stage(),"paint",$bind(this,this.onPaint));
			this.startMoving();
			this.deltaDistance = delta;
			break;
		case 2:
			this.stopMoving();
			this.detachListener(this.implementation.get_stage(),"paint",$bind(this,this.onPaint));
			break;
		case 1:
			this.deltaDistance += delta;
			break;
		}
	}
	,copy: function(from) {
		nfuzion.widget.Group.prototype.copy.call(this,from);
		if(!js.Boot.__instanceof(from,nfuzion.widget.Chain)) throw "ERROR: Source widget is not an instance of Chain.";
		var chain = from;
		this.set_data(chain.data);
		this.set_itemUpdater(chain.itemUpdater);
	}
	,onPaint: function(e) {
		this.velocity -= this.velocity / 5;
		this.velocity += this.deltaDistance / 5;
		if(this.dragged != Math.POSITIVE_INFINITY) {
			this.dragged += this.deltaDistance;
			if(Math.abs(this.dragged) > 15) {
				this.needsSnap = true;
				this.startMoving();
				this.dragged = Math.POSITIVE_INFINITY;
			}
		}
		if(this.dragged == Math.POSITIVE_INFINITY) {
			var _g = this.pageA.implementation;
			_g.set_x(_g._x + this.deltaDistance);
			var alphaWidth = this.pageA.implementation._width * 0.75;
			this.pageA.implementation.set_alpha(1 - Math.abs(this.pageA.implementation._x) / alphaWidth);
			if(this.pageB != null) {
				var _g = this.pageB.implementation;
				_g.set_x(_g._x + this.deltaDistance);
				this.pageB.implementation.set_alpha(1 - Math.abs(this.pageB.implementation._x) / alphaWidth);
			}
		}
		this.deltaDistance = 0;
	}
	,gotoPage: function() {
		if(this.pageA == null) return;
		this.killTweens();
		var pageWidth = this.pageA.implementation._width;
		this.snapTweenA = new nfuzion.tween.Tween(0.2,[new nfuzion.tween.type.TweenProperty(this.pageA.implementation,"x",-this.currentPage * pageWidth + this.pageOffset,nfuzion.tween.type.TweenType.fast),new nfuzion.tween.type.TweenProperty(this.pageA.implementation,"alpha",this.currentPage == 1?0:1)]);
		this.snapTweenB = new nfuzion.tween.Tween(0.2,[new nfuzion.tween.type.TweenProperty(this.pageB.implementation,"x",-this.currentPage * pageWidth + pageWidth + this.pageOffset,nfuzion.tween.type.TweenType.fast),new nfuzion.tween.type.TweenProperty(this.pageB.implementation,"alpha",this.currentPage == 0?0:1)]);
		this.updatePageIndicator();
		this.updateDirectionalButtons();
	}
	,snap: function() {
		if(this.pageA == null) return;
		if(this.pageA.implementation._x < -this.pageA.implementation._width / 2) this.currentPage = 1; else this.currentPage = 0;
		if(Math.abs(this.velocity) > 2) {
			if(this.velocity > 0) this.currentPage = 0; else this.currentPage = 1;
		}
		this.gotoPage();
	}
	,previousPage: function(e) {
		this.currentPage--;
		if(this.currentPage < 0) this.currentPage = 0;
		this.gotoPage();
	}
	,nextPage: function(e) {
		this.currentPage++;
		if(this.currentPage >= this.pageCount) this.currentPage = this.pageCount - 1;
		this.gotoPage();
	}
	,getDataByWidget: function(widget) {
		var _g = 0, _g1 = this.links;
		while(_g < _g1.length) {
			var link = _g1[_g];
			++_g;
			if(link.widget == widget) return link.data;
		}
		return null;
	}
	,stopMoving: function() {
		this.detachListener(this.implementation.get_stage(),"paint",$bind(this,this.onPaint));
		this.dragged = 0;
		this.snap();
	}
	,startMoving: function() {
		var _g = 0, _g1 = this.links;
		while(_g < _g1.length) {
			var link = _g1[_g];
			++_g;
			link.widget.cancel();
		}
	}
	,itemClicked: function(e) {
		var itemIndex = 0;
		if(itemIndex < this.data.length) this.dispatchEvent(new nfuzion.widget.event.ChainEvent("ChainEvent.select",this.data[itemIndex],itemIndex,this.links[itemIndex]));
	}
	,set_itemUpdater: function(itemUpdater) {
		this.itemUpdater = itemUpdater;
		return itemUpdater;
	}
	,itemUpdater: null
	,updateDirectionalButtons: function() {
		if(this.pageCount > 1) {
			if(this.previousButton != null) {
				this.previousButton.set_visible(true);
				if(this.currentPage == 0) this.previousButton.set_enabled(false); else this.previousButton.set_enabled(true);
			}
			if(this.nextButton != null) {
				this.nextButton.set_visible(true);
				if(this.currentPage == this.pageCount - 1) this.nextButton.set_enabled(false); else this.nextButton.set_enabled(true);
			}
		} else {
			if(this.previousButton != null) this.previousButton.set_visible(false);
			if(this.nextButton != null) this.nextButton.set_visible(false);
		}
	}
	,updatePageIndicator: function() {
		if(this.pageCount > 1) {
			if(this.pageIndicator != null) {
				this.pageIndicator.set_visible(true);
				var pageIndicatorArray = new Array();
				var _g1 = 0, _g = this.pageCount;
				while(_g1 < _g) {
					var i = _g1++;
					pageIndicatorArray.push(i == this.currentPage);
				}
				this.pageIndicator.set_data(pageIndicatorArray);
			}
			if(this.pageScroller != null) {
				this.pageScroller.set_visible(true);
				this.pageScroller.set_value(this.currentPage);
			}
		} else {
			if(this.pageScroller != null) this.pageScroller.set_visible(false);
			if(this.pageIndicator != null) this.pageIndicator.set_visible(false);
		}
	}
	,update: function() {
		var _g1 = 0, _g = this.links.length;
		while(_g1 < _g) {
			var itemPosition = _g1++;
			var widget = this.links[itemPosition].widget;
			var link = this.data[itemPosition];
			if(this.itemUpdater != null && this.data != null && itemPosition < this.data.length && this.data[itemPosition] != null) {
				this.links[itemPosition].data = link;
				this.links[itemPosition].dataIndex = itemPosition;
				this.itemUpdater(this.links[itemPosition]);
				widget.set_visible(true);
			} else widget.set_visible(false);
		}
		this.updateDirectionalButtons();
	}
	,set_data: function(data) {
		this.data = data;
		this.set_pageCount(Math.ceil(data.length / this.pageSize));
		this.update();
		this.updatePageIndicator();
		this.updateDirectionalButtons();
		return data;
	}
	,data: null
	,getItemCount: function() {
		return this.links.length;
	}
	,findLinks: function(group) {
		var links = new Array();
		var _g = 0, _g1 = group.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			var childNameArray = child.name.split("_");
			if(childNameArray.length >= 2 && childNameArray[0] == "item") {
				var position = Std.parseInt(childNameArray[1]);
				if(position != null) links.push(new nfuzion.widget.type.ItemWidget(child,position));
			}
		}
		links.sort(function(x,y) {
			return x.widgetIndex - y.widgetIndex;
		});
		var _g1 = 0, _g = links.length;
		while(_g1 < _g) {
			var i = _g1++;
			links[i].widgetIndex = i;
			var widget = links[i].widget;
			widget.bubbleComponentEvents = true;
		}
		var _g = 0;
		while(_g < links.length) {
			var link = links[_g];
			++_g;
			this.links.push(link);
		}
	}
	,onTouchEnd: function(e) {
		if(this.pagingEnabled) {
			if(this.currentTouchId == e.id) {
				this.currentTouchId = null;
				this.stopMoving();
			}
		}
	}
	,onTouchMove: function(e) {
		if(this.pagingEnabled) {
			if(this.currentTouchId == e.id) {
				this.deltaDistance += e.global.x - this.currentTouchX;
				this.currentTouchX = e.global.x;
			}
		}
	}
	,killTweens: function() {
		if(this.snapTweenA != null) {
			this.snapTweenA.destroy();
			this.snapTweenB.destroy();
			this.snapTweenA = null;
			this.snapTweenB = null;
		}
	}
	,onTouchBegin: function(e) {
		if(this.pagingEnabled) {
			if(this.currentTouchId == null) {
				if(this.bubbleComponentEvents) e.stopPropagation();
				this.currentTouchId = e.id;
				this.currentTouchX = e.global.x;
				this.killTweens();
				this.attachListener(this.implementation.get_stage(),"paint",$bind(this,this.onPaint));
			}
		}
	}
	,removeListeners: function() {
		nfuzion.widget.Group.prototype.removeListeners.call(this);
		this.stopMoving();
		this.killTweens();
	}
	,addListeners: function() {
		nfuzion.widget.Group.prototype.addListeners.call(this);
		if(this.pageA != null) {
			this.attachListener(this.target,"begin",$bind(this,this.onTouchBegin));
			this.attachListener(this.target.get_stage(),"move",$bind(this,this.onTouchMove));
			this.attachListener(this.target.get_stage(),"end",$bind(this,this.onTouchEnd));
			if(this.nextButton != null) this.attachListener(this.nextButton,"ButtonEvent.autoClick",$bind(this,this.nextPage));
			if(this.previousButton != null) this.attachListener(this.previousButton,"ButtonEvent.autoClick",$bind(this,this.previousPage));
		}
		if(this.pageScroller != null) this.attachListener(this.pageScroller,"ScrollerEvent.position",$bind(this,this.onScrollerPosition));
	}
	,updatePageIndicatorItem: function(itemWidget) {
		var widget = itemWidget.widget;
		var data = itemWidget.data;
		if(data) widget.implementation["goto"]("active"); else widget.implementation["goto"]("inactive");
	}
	,set_pageCount: function(pageCount) {
		this.pageCount = pageCount;
		if(pageCount > 1) this.pagingEnabled = true; else this.pagingEnabled = false;
		if(this.pageScroller != null) this.pageScroller.set_maximum(pageCount - 1);
		return this.pageCount;
	}
	,pageCount: null
	,set_previousButton: function(button) {
		this.previousButton = button;
		this.attachListener(this.previousButton,"ButtonEvent.autoClick",$bind(this,this.previousPage));
		this.updateDirectionalButtons();
		return button;
	}
	,previousButton: null
	,set_nextButton: function(button) {
		this.nextButton = button;
		this.attachListener(this.nextButton,"ButtonEvent.autoClick",$bind(this,this.nextPage));
		this.updateDirectionalButtons();
		return button;
	}
	,nextButton: null
	,findComponents: function(container) {
		nfuzion.widget.Group.prototype.findComponents.call(this,container);
		this.set_enabled(true);
		var widget = this.getChild("pageIndicator_chain");
		if(widget != null) {
			this.pageIndicator = widget;
			this.pageIndicator.set_itemUpdater($bind(this,this.updatePageIndicatorItem));
		}
		widget = this.getChild("page_scroller");
		if(widget != null) {
			this.pageScroller = widget;
			this.pageScroller.set_pageSize(0);
			this.pageScroller.set_minimum(0);
			this.pageScroller.set_maximum(0);
			this.pageScroller.roundValue = true;
		}
		this.links = new Array();
		widget = this.getChild("page_group");
		if(widget != null) {
			this.pageA = widget;
			this.pageB = this.pageA.clone("pageClone_group");
			this.insertChildAfter(this.pageB,this.pageA);
			this.pageB.implementation.set_x(this.pageA.implementation._width);
			this.findLinks(this.pageA);
			this.pageSize = this.links.length;
			this.findLinks(this.pageB);
			this.pageOffset = this.pageA.implementation._x;
			this.pageB.implementation.set_alpha(0);
			this.pageB.set_visible(true);
		} else {
			this.findLinks(this);
			this.pageSize = this.links.length;
		}
		if(this.pageA != null) {
			widget = this.getChild("next_button");
			if(widget != null) this.set_nextButton(widget);
			widget = this.getChild("previous_button");
			if(widget != null) this.set_previousButton(widget);
		}
		this.update();
	}
	,initialize: function() {
		nfuzion.widget.Group.prototype.initialize.call(this);
		this.set_itemUpdater(null);
		this.links = new Array();
		this.set_data(new Array());
		this.velocity = 0;
		this.dragged = 0;
		this.needsSnap = false;
		this.currentPage = 0;
		this.set_pageCount(0);
		this.deltaDistance = 0;
	}
	,pagingEnabled: null
	,pageOffset: null
	,pageSize: null
	,currentPage: null
	,pageScroller: null
	,pageIndicator: null
	,snapTweenB: null
	,snapTweenA: null
	,pageB: null
	,pageA: null
	,needsSnap: null
	,dragged: null
	,velocity: null
	,deltaDistance: null
	,currentTouchX: null
	,currentTouchId: null
	,links: null
	,__class__: nfuzion.widget.Chain
	,__properties__: $extend(nfuzion.widget.Group.prototype.__properties__,{set_nextButton:"set_nextButton",set_previousButton:"set_previousButton",set_pageCount:"set_pageCount",set_data:"set_data",set_itemUpdater:"set_itemUpdater"})
});
nfuzion.widget.Label = function(name,component) {
	nfuzion.widget.Simple.call(this,name,component);
};
$hxClasses["nfuzion.widget.Label"] = nfuzion.widget.Label;
nfuzion.widget.Label.__name__ = ["nfuzion","widget","Label"];
nfuzion.widget.Label.__super__ = nfuzion.widget.Simple;
nfuzion.widget.Label.prototype = $extend(nfuzion.widget.Simple.prototype,{
	destroy: function() {
		if(this.textComponent != null) this.textComponent.destroy();
		nfuzion.widget.Simple.prototype.destroy.call(this);
	}
	,set_paint: function(paint) {
		this.paint = paint;
		if(this.textComponent != null) this.textComponent.set_paint(paint);
		return paint;
	}
	,paint: null
	,set_wrap: function(wrap) {
		if(this.textComponent != null) this.textComponent.set_wrap(wrap);
		return wrap;
	}
	,wrap: null
	,set_text: function(text) {
		this.text = text;
		if(this.textComponent != null && this.textComponent.get_text() != text) this.textComponent.set_text(text);
		return text;
	}
	,text: null
	,configureComponent: function() {
		nfuzion.widget.Simple.prototype.configureComponent.call(this);
		this.textComponent = null;
		if(this.implementation != null && js.Boot.__instanceof(this.implementation,nfuzion.graphics.Text)) {
			this.textComponent = this.implementation;
			this.set_text(this.textComponent.get_text());
		}
	}
	,textComponent: null
	,__class__: nfuzion.widget.Label
	,__properties__: $extend(nfuzion.widget.Simple.prototype.__properties__,{set_text:"set_text",set_wrap:"set_wrap",set_paint:"set_paint"})
});
nfuzion.widget.List = function(name,component) {
	this.dataLength = 0;
	this._dataPosition = 0;
	this.visualPosition = 0;
	this.rowUpdater = null;
	this.scrollFactor = 1;
	this.selectedRowIndex = 0;
	nfuzion.widget.Group.call(this,name,component);
};
$hxClasses["nfuzion.widget.List"] = nfuzion.widget.List;
nfuzion.widget.List.__name__ = ["nfuzion","widget","List"];
nfuzion.widget.List.__super__ = nfuzion.widget.Group;
nfuzion.widget.List.prototype = $extend(nfuzion.widget.Group.prototype,{
	destroy: function() {
		nfuzion.widget.Group.prototype.destroy.call(this);
		if(this.cache != null) {
			this.cache.destroy();
			this.cache = null;
		}
		if(this.physics != null) {
			this.physics.destroy();
			this.set_physics(null);
		}
		while(this.rows.length > 0) {
			var row = this.rows.pop();
			if(row != null) {
				row.widget.destroy();
				row = null;
			}
		}
		this.rows = null;
	}
	,getDataByWidget: function(widget) {
		var _g = 0, _g1 = this.rows;
		while(_g < _g1.length) {
			var row = _g1[_g];
			++_g;
			if(row.widget == widget) return row.data;
		}
		return null;
	}
	,set_physics: function(physics) {
		if(this.physics != null) {
			this.detachListener(physics,"PhysicsEvent.begin",$bind(this,this.onPhysicsBegin));
			this.detachListener(physics,"PhysicsEvent.change",$bind(this,this.onPhysicsChange));
			this.detachListener(physics,"PhysicsEvent.end",$bind(this,this.onPhysicsEnd));
		}
		this.physics = physics;
		if(physics != null) {
			physics.set_touchTarget(this.target);
			if(this.rowSize > 0) physics.set_rowSize(this.rowSize);
			physics.bottomPadding = this.rowOverlap;
			this.attachListener(physics,"PhysicsEvent.begin",$bind(this,this.onPhysicsBegin));
			this.attachListener(physics,"PhysicsEvent.change",$bind(this,this.onPhysicsChange));
			this.attachListener(physics,"PhysicsEvent.end",$bind(this,this.onPhysicsEnd));
		}
		return physics;
	}
	,physics: null
	,onPhysicsEnd: function(e) {
		this.onPhysicsChange(e);
	}
	,onPhysicsChange: function(e) {
		this.set_visualPosition(e.position);
		this.adjustRowPositions();
	}
	,onPhysicsBegin: function(e) {
		this.onPhysicsChange(e);
		var _g = 0, _g1 = this.rows;
		while(_g < _g1.length) {
			var row = _g1[_g];
			++_g;
			row.widget.cancel();
		}
	}
	,update: function() {
		var _g1 = 0, _g = this.rows.length;
		while(_g1 < _g) {
			var i = _g1++;
			var dataIndex = this._dataPosition + i;
			var row = this.rows[i];
			row.data = this.cache.getDataAt(dataIndex);
			if(row.data == null || this.rowUpdater == null) dataIndex = -35535;
			if(row.dataIndex != dataIndex) {
				row.dataIndex = dataIndex;
				if(dataIndex >= 0) {
					row.widget.set_visible(true);
					row.widgetIndex = i;
					this.rowUpdater(this.rows[i]);
				} else row.widget.set_visible(false);
			}
		}
	}
	,onCacheUpdate: function(e) {
		if(this.cache.listPosition <= e.end && this.cache.listPosition + this.rows.length > e.start) this.update();
	}
	,adjustRowPositions: function() {
		var offset = this._dataPosition * this.rowSize - this.visualPosition;
		var _g1 = 0, _g = this.rows.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.rows[i].widget.implementation.set_y(offset + i * this.rowSize);
		}
	}
	,getPosition: function(point) {
		haxe.Log.trace("FATAL: getPosition from List.as must be overridden.",{ fileName : "List.hx", lineNumber : 280, className : "nfuzion.widget.List", methodName : "getPosition"});
		return 0;
	}
	,invalidateView: function() {
		var _g = 0, _g1 = this.rows;
		while(_g < _g1.length) {
			var row = _g1[_g];
			++_g;
			row.dataIndex = -35534;
		}
		this.update();
	}
	,set_dataLength: function(dataLength) {
		if(this.dataLength != dataLength) {
			this.dataLength = dataLength;
			if(this.physics != null) {
				this.physics.set_length(this.rowSize * dataLength - this.size + this.rowOverlap);
				this.physics.set_step(this.size);
			}
			this.dispatchEvent(new nfuzion.widget.event.ListEvent("ListEvent.length",this,true));
			this.cache.set_listLength(dataLength);
			this.invalidateView();
		}
		return dataLength;
	}
	,dataLength: null
	,changeDataPosition: function(dataPosition) {
		if(dataPosition > this.dataLength - this.rows.length) dataPosition = this.dataLength - this.rows.length;
		if(dataPosition < 0) dataPosition = 0;
		if(this._dataPosition != dataPosition) {
			var tempArray;
			if(dataPosition < this._dataPosition && dataPosition + this.rows.length >= this._dataPosition) {
				tempArray = this.rows.splice(this.rows.length - (this._dataPosition - dataPosition),this.rows.length - 2);
				this.rows = tempArray.concat(this.rows);
			} else if(dataPosition > this._dataPosition && dataPosition < this._dataPosition + this.rows.length) {
				tempArray = this.rows.splice(0,dataPosition - this._dataPosition);
				this.rows = this.rows.concat(tempArray);
			}
			this._dataPosition = dataPosition;
			this.cache.set_listPosition(dataPosition);
			this.adjustRowPositions();
			this.update();
		}
	}
	,set_dataPosition: function(dataPosition) {
		this.set_visualPosition(dataPosition * this.rowSize);
		if(this.physics != null) this.physics.set_position(this.visualPosition);
		return dataPosition;
	}
	,get_dataPosition: function() {
		return this._dataPosition;
	}
	,_dataPosition: null
	,set_visualPosition: function(visualPosition) {
		if(this.visualPosition != visualPosition && this.rowSize > 0) {
			this.visualPosition = visualPosition;
			var targetDataPosition = visualPosition / this.rowSize | 0;
			this.changeDataPosition(targetDataPosition);
		}
		return visualPosition;
	}
	,visualPosition: null
	,rows: null
	,rowUpdater: null
	,addListeners: function() {
		nfuzion.widget.Group.prototype.addListeners.call(this);
		this.set_physics(this.physics);
		this.attachListener(this.cache,"CacheEvent.update",$bind(this,this.onCacheUpdate));
	}
	,findComponents: function(container) {
		nfuzion.widget.Group.prototype.findComponents.call(this,container);
		this.set_enabled(true);
		var rows = new Array();
		var _g1 = 0, _g = this.get_childCount();
		while(_g1 < _g) {
			var i = _g1++;
			var widget = this.getChildAt(i);
			var widgetNameArray = widget.name.split("_");
			if(widgetNameArray.length >= 3 && widgetNameArray[0] == "row") {
				if(widgetNameArray[2] == "button") {
					var button = widget;
					button.pressDelayPeriod = 0.1;
				}
				var index = Std.parseInt(widgetNameArray[1]);
				rows.push(new nfuzion.widget.type.ItemWidget(widget,index));
			}
		}
		rows.sort(function(x,y) {
			return x.widgetIndex - y.widgetIndex;
		});
		this.size = this.implementation._height;
		if(rows.length > 1) this.rowSize = rows[1].widget.implementation._y - rows[0].widget.implementation._y; else this.rowSize = rows[0].widget.implementation._height;
		this.rowOverlap = rows[0].widget.implementation._height - this.rowSize;
		this.pageSize = Math.ceil(this.size / this.rowSize);
		this.cache.set_windowSize(this.pageSize);
		var targetRowCount = Math.ceil(this.size / this.rowSize) + 1;
		var nameArray = rows[rows.length - 1].widget.name.split("_");
		var lastRowWidget = rows[rows.length - 1].widget;
		var _g = rows.length;
		while(_g < targetRowCount) {
			var i = _g++;
			nameArray[1] = Std.string(i);
			var newRowWidget = lastRowWidget.clone();
			newRowWidget.name = nameArray.join("_");
			this.insertChildAfter(newRowWidget,lastRowWidget);
			rows.push(new nfuzion.widget.type.ItemWidget(newRowWidget,i));
		}
		var _g1 = 0, _g = rows.length;
		while(_g1 < _g) {
			var i = _g1++;
			rows[i].widgetIndex = i;
			var widget = rows[i].widget;
			widget.bubbleComponentEvents = true;
		}
		var _g = 0;
		while(_g < rows.length) {
			var row = rows[_g];
			++_g;
			this.rows.push(row);
		}
		this.adjustRowPositions();
		this.update();
	}
	,initialize: function() {
		nfuzion.widget.Group.prototype.initialize.call(this);
		this.rows = new Array();
		this.cache = new nfuzion.cache.ListCache();
	}
	,scrollFactor: null
	,selectedRowIndex: null
	,rowOverlap: null
	,rowSize: null
	,size: null
	,cache: null
	,pageSize: null
	,__class__: nfuzion.widget.List
	,__properties__: $extend(nfuzion.widget.Group.prototype.__properties__,{set_visualPosition:"set_visualPosition",set_dataPosition:"set_dataPosition",get_dataPosition:"get_dataPosition",set_dataLength:"set_dataLength",set_physics:"set_physics"})
});
nfuzion.widget.Scroller = function(name,component) {
	this.popupPageThreshold = 5;
	this.reportPeriod = 0;
	this.hMaximum = 90;
	this.vMaximum = 90;
	this.vMinimum = 0;
	this.hMinimum = 0;
	this.hValue = 0;
	this.vValue = 0;
	this.hideIfUseless = false;
	this.repaintRequested = false;
	this.currentTouchId = null;
	this.popupWidget = null;
	this.hidePopupOnStop = true;
	this.popupUpdater = null;
	this.liveProgress = true;
	this.progressTracksThumb = true;
	this.thumbDown = false;
	this.roundValue = false;
	this.horizontalEnabled = false;
	this.verticalEnabled = false;
	nfuzion.widget.Group.call(this,name,component);
};
$hxClasses["nfuzion.widget.Scroller"] = nfuzion.widget.Scroller;
nfuzion.widget.Scroller.__name__ = ["nfuzion","widget","Scroller"];
nfuzion.widget.Scroller.__super__ = nfuzion.widget.Group;
nfuzion.widget.Scroller.prototype = $extend(nfuzion.widget.Group.prototype,{
	set_popupPageThreshold: function(popupPageThreshold) {
		if(this.popupPageThreshold != popupPageThreshold) {
			this.popupPageThreshold = popupPageThreshold;
			this.updatePopup();
		}
		return this.popupPageThreshold;
	}
	,popupPageThreshold: null
	,onPaint: function(e) {
		if(!this.thumbDown) {
			this.detachListener(this.implementation.get_stage(),"paint",$bind(this,this.onPaint));
			this.repaintRequested = false;
			this.update();
			this.updatePopup();
		} else {
			var local = this.implementation.globalToLocal(this.touch);
			if(this.verticalEnabled) {
				var y = local.y - this.touchOffset.y;
				this.slideY(y);
			}
			if(this.horizontalEnabled) {
				var x = local.x - this.touchOffset.x;
				this.slideX(x);
			}
			if(this.get_reportPeriod() == 0) this.reportPosition();
			this.updatePopup();
			if(this.liveProgress) {
				this.updateProgress();
				this.updateButtons();
			}
		}
	}
	,set_autoRepeatDelay: function(delay) {
		this.autoRepeatDelay = delay;
		if(this.upButton != null) this.upButton.set_autoRepeatDelay(delay);
		if(this.downButton != null) this.downButton.set_autoRepeatDelay(delay);
		if(this.leftButton != null) this.leftButton.set_autoRepeatDelay(delay);
		if(this.rightButton != null) this.rightButton.set_autoRepeatDelay(delay);
		return this.autoRepeatDelay;
	}
	,autoRepeatDelay: null
	,set_autoRepeatPeriod: function(period) {
		this.autoRepeatPeriod = period;
		if(this.upButton != null) this.upButton.set_autoRepeatPeriod(period);
		if(this.downButton != null) this.downButton.set_autoRepeatPeriod(period);
		if(this.leftButton != null) this.leftButton.set_autoRepeatPeriod(period);
		if(this.rightButton != null) this.rightButton.set_autoRepeatPeriod(period);
		return this.autoRepeatPeriod;
	}
	,autoRepeatPeriod: null
	,updatePopup: function() {
		if(this.popupWidget != null) {
			var hPages = 0;
			if(this.horizontalEnabled) hPages = (this.hMaximum - this.hMinimum) / this.hPageSize;
			var vPages = 0;
			if(this.verticalEnabled) vPages = (this.vMaximum - this.vMinimum) / this.vPageSize;
			if(vPages > this.popupPageThreshold || hPages > this.popupPageThreshold) {
				this.popupWidget.set_visible(true);
				if(this.popupUpdater != null) this.popupUpdater(this.popupWidget);
			}
		}
	}
	,set_hProgress: function(value) {
		if(this.horizontalEnabled && this.progressIndicator != null) {
			if(value < this.hMinimum) value = this.hMinimum;
			if(value > this.hMaximum - this.hPageSize) value = this.hMaximum - this.hPageSize;
			var valueRange = this.hMaximum - this.hMinimum - this.hPageSize;
			if(valueRange < 0) valueRange = 0;
			this.progressIndicator.set_width((value - this.hMinimum) / valueRange * this.progressWidth);
		}
		return value;
	}
	,get_hProgress: function() {
		if(this.horizontalEnabled && this.progressIndicator != null) {
			var valueRange = this.hMaximum - this.hMinimum - this.hPageSize;
			if(valueRange < 0) valueRange = 0;
			return this.progressIndicator._width / this.progressWidth * valueRange + this.hMinimum;
		} else return 0;
	}
	,set_vProgress: function(value) {
		if(this.verticalEnabled && this.progressIndicator != null) {
			if(value < this.vMinimum) value = this.vMinimum;
			if(value > this.vMaximum - this.vPageSize) value = this.vMaximum - this.vPageSize;
			var valueRange = this.vMaximum - this.vMinimum - this.vPageSize;
			if(valueRange < 0) valueRange = 0;
			this.progressIndicator.set_height((value - this.vMinimum) / valueRange * this.progressHeight);
		}
		return value;
	}
	,get_vProgress: function() {
		if(this.verticalEnabled && this.progressIndicator != null) {
			var valueRange = this.vMaximum - this.vMinimum - this.vPageSize;
			if(valueRange < 0) valueRange = 0;
			return this.progressIndicator._height / this.progressHeight * valueRange + this.vMinimum;
		} else return 0;
	}
	,set_progress: function(value) {
		if(this.verticalEnabled) this.set_vProgress(value); else this.set_hProgress(value);
		return value;
	}
	,get_progress: function() {
		if(this.verticalEnabled) return this.get_vProgress(); else return this.get_hProgress();
	}
	,set_reportPeriod: function(reportingPeriod) {
		this.reportPeriod = this.get_reportPeriod();
		if(reportingPeriod > 0) this.reportTimer.set_period(reportingPeriod);
		return this.reportTimer.period;
	}
	,get_reportPeriod: function() {
		return this.reportTimer.period;
	}
	,reportPeriod: null
	,pageRight: function(e) {
		var _g = this;
		_g.set_hValue(_g.get_hValue() + this.hPageSize);
		if(this.liveProgress) this.updateProgress();
		this.reportPosition();
	}
	,pageLeft: function(e) {
		var _g = this;
		_g.set_hValue(_g.get_hValue() - this.hPageSize);
		if(this.liveProgress) this.updateProgress();
		this.reportPosition();
	}
	,pageDown: function(e) {
		var _g = this;
		_g.set_vValue(_g.get_vValue() + Math.floor(this.vPageSize));
		if(this.liveProgress) this.updateProgress();
		this.reportPosition();
	}
	,pageUp: function(e) {
		var _g = this;
		_g.set_vValue(_g.get_vValue() - Math.floor(this.vPageSize));
		if(this.liveProgress) this.updateProgress();
		this.reportPosition();
	}
	,reportPosition: function(e) {
		var value = this.get_vValue();
		if(this.previousVValue != value) {
			this.previousVValue = value;
			this.dispatchEvent(new nfuzion.widget.event.ScrollerEvent("ScrollerEvent.verticalPosition",this,value,true));
			if(this.verticalEnabled) this.dispatchEvent(new nfuzion.widget.event.ScrollerEvent("ScrollerEvent.position",this,value,true));
		}
		value = this.get_hValue();
		if(this.previousHValue != value) {
			this.previousHValue = value;
			this.dispatchEvent(new nfuzion.widget.event.ScrollerEvent("ScrollerEvent.horizontalPosition",this,value,true));
			if(!this.verticalEnabled) this.dispatchEvent(new nfuzion.widget.event.ScrollerEvent("ScrollerEvent.position",this,value,true));
		}
	}
	,stopSlideTimer: function() {
		this.reportTimer.stop();
		this.detachListener(this.reportTimer,"timer",$bind(this,this.reportPosition));
	}
	,startSlideTimer: function() {
		this.stopSlideTimer();
		this.attachListener(this.reportTimer,"timer",$bind(this,this.reportPosition));
		this.reportTimer.set_period(this.get_reportPeriod());
		this.reportTimer.start();
	}
	,onHListPageSize: function(e) {
		var list = e.target;
		this.set_hPageSize(list.pageSize);
	}
	,onVListPageSize: function(e) {
		var list = e.target;
		this.set_vPageSize(list.pageSize);
	}
	,onListPageSize: function(e) {
		if(this.verticalEnabled) this.onVListPageSize(e); else this.onHListPageSize(e);
	}
	,set_hPageSize: function(pageSize) {
		if(pageSize != this.hPageSize) {
			this.hPageSize = pageSize;
			if(this.hMaximum - this.hPageSize < this.get_hValue()) this.set_value(this.hMaximum - this.hPageSize);
			this.repaint();
		}
		return this.hPageSize;
	}
	,hPageSize: null
	,set_vPageSize: function(pageSize) {
		if(pageSize != this.vPageSize) {
			this.vPageSize = pageSize;
			if(this.vMaximum - this.vPageSize < this.get_vValue()) this.set_value(this.vMaximum - this.vPageSize);
			this.repaint();
		}
		return this.vPageSize;
	}
	,vPageSize: null
	,set_pageSize: function(pageSize) {
		if(this.verticalEnabled) this.set_vPageSize(pageSize); else this.set_hPageSize(pageSize);
		return pageSize;
	}
	,get_pageSize: function() {
		if(this.verticalEnabled) return this.vPageSize; else return this.hPageSize;
	}
	,onHListLength: function(e) {
		var list = e.target;
		this.set_hMaximum(list.dataLength);
	}
	,set_hMaximum: function(max) {
		if(max != this.hMaximum) {
			this.hMaximum = max;
			if(this.hMaximum < this.hMinimum) this.set_hMinimum(this.hMaximum);
			if(this.hMaximum - this.hPageSize < this.get_hValue()) this.set_value(this.hMaximum - this.hPageSize);
			this.repaint();
		}
		return this.hMaximum;
	}
	,hMaximum: null
	,onVListLength: function(e) {
		var list = e.target;
		this.set_vMaximum(list.dataLength);
	}
	,set_vMaximum: function(max) {
		if(max != this.vMaximum) {
			this.vMaximum = max;
			if(this.vMaximum < this.vMinimum) this.set_vMinimum(this.vMaximum);
			if(this.vMaximum - this.vPageSize < this.get_vValue()) this.set_value(this.vMaximum - this.vPageSize);
			this.repaint();
		}
		return this.vMaximum;
	}
	,vMaximum: null
	,onListLength: function(e) {
		var list = e.target;
		if(this.verticalEnabled) this.onVListLength(e); else this.onHListLength(e);
	}
	,set_maximum: function(max) {
		if(this.verticalEnabled) this.set_vMaximum(max); else this.set_hMaximum(max);
		return max;
	}
	,get_maximum: function() {
		if(this.verticalEnabled) return this.vMaximum; else return this.hMaximum;
	}
	,set_vMinimum: function(min) {
		if(min != this.vMinimum) {
			this.vMinimum = min;
			if(this.vMinimum > this.vMaximum) this.set_vMaximum(this.vMinimum);
			if(this.vMinimum > this.get_vValue()) this.set_vValue(this.vMinimum);
			this.repaint();
		}
		return this.vMinimum;
	}
	,vMinimum: null
	,set_hMinimum: function(min) {
		if(min != this.hMinimum) {
			this.hMinimum = min;
			if(this.hMinimum > this.hMaximum) this.set_hMaximum(this.hMinimum);
			if(this.hMinimum > this.get_hValue()) this.set_hValue(this.hMinimum);
			this.repaint();
		}
		return this.hMinimum;
	}
	,hMinimum: null
	,set_minimum: function(min) {
		if(this.verticalEnabled) this.set_vMinimum(min); else this.set_hMinimum(min);
		return min;
	}
	,get_minimum: function() {
		if(this.verticalEnabled) return this.vMinimum; else return this.hMinimum;
	}
	,set_hValue: function(value) {
		if(value != this.get_hValue()) {
			if(value > this.hMaximum - this.hPageSize) value = this.hMaximum - this.hPageSize;
			if(value < this.hMinimum) value = this.hMinimum;
			this.hValue = value;
			this.repaint();
		}
		return this.get_hValue();
	}
	,get_hValue: function() {
		if(this.roundValue) return Math.round(this.hValue); else return this.hValue;
	}
	,hValue: null
	,set_vValue: function(value) {
		if(value != this.get_vValue()) {
			if(value > this.vMaximum - this.vPageSize) value = this.vMaximum - this.vPageSize;
			if(value < this.vMinimum) value = this.vMinimum;
			this.vValue = value;
			this.repaint();
		}
		return this.get_vValue();
	}
	,get_vValue: function() {
		if(this.roundValue) return Math.round(this.vValue); else return this.vValue;
	}
	,vValue: null
	,set_value: function(value) {
		if(this.verticalEnabled) this.set_vValue(value); else this.set_hValue(value);
		return value;
	}
	,get_value: function() {
		if(this.verticalEnabled) return this.get_vValue(); else return this.get_hValue();
	}
	,set_hideIfUseless: function(hideIfUseless) {
		this.hideIfUseless = hideIfUseless;
		this.update();
		return hideIfUseless;
	}
	,hideIfUseless: null
	,onTouchEnd: function(e) {
		if(this.currentTouchId != e.id) return;
		this.currentTouchId = null;
		if(this.track != null) {
			this.detachListener(this.track.get_stage(),"move",$bind(this,this.onTouchMove));
			this.detachListener(this.track.get_stage(),"end",$bind(this,this.onTouchEnd));
		}
		this.endSlide();
	}
	,onTouchMove: function(e) {
		if(this.currentTouchId != e.id) return;
		this.touch = e.global.clone();
	}
	,onTrackTouchBegin: function(e) {
		if(this.currentTouchId != null) return; else {
			this.currentTouchId = e.id;
			e.stopPropagation();
		}
		if(this.sensitiveTrack) {
			if(this.thumb != null) {
				this.touchOffset.x = this.thumb._width / 2;
				this.touchOffset.y = this.thumb._height / 2;
			} else {
				this.touchOffset.x = 0;
				this.touchOffset.y = 0;
			}
			if(this.track != null) {
				this.attachListener(this.track.get_stage(),"move",$bind(this,this.onTouchMove));
				this.attachListener(this.track.get_stage(),"end",$bind(this,this.onTouchEnd));
			}
			this.startSlide();
			this.onTouchMove(e);
			this.reportPosition();
		}
	}
	,onThumbTouchBegin: function(e) {
		if(this.currentTouchId == null) {
			this.currentTouchId = e.id;
			e.stopPropagation();
			this.touch = e.global.clone();
			this.touchOffset = e.local;
			if(this.track != null) {
				this.attachListener(this.track.get_stage(),"move",$bind(this,this.onTouchMove));
				this.attachListener(this.track.get_stage(),"end",$bind(this,this.onTouchEnd));
			}
			this.startSlide();
		}
	}
	,slideY: function(y) {
		if(this.height >= 0) {
			if(y > this.bottom) y = this.bottom; else if(y < this.top) y = this.top;
		} else if(y < this.bottom) y = this.bottom; else if(y > this.top) y = this.top;
		if(this.thumb != null) this.thumb.set_y(y);
		this.updateValue();
	}
	,slideX: function(x) {
		if(this.width >= 0) {
			if(x > this.right) x = this.right; else if(x < this.left) x = this.left;
		} else if(x < this.right) x = this.right; else if(x > this.left) x = this.left;
		if(this.thumb != null) this.thumb.set_x(x);
		this.updateValue();
	}
	,endSlide: function() {
		this.thumbDown = false;
		this.dispatchEvent(new nfuzion.widget.event.ScrollerEvent("ScrollerEvent.release",this));
		this.stopSlideTimer();
		this.updateValue();
		this.reportPosition();
		this.touch = null;
		if(this.popupWidget != null && this.hidePopupOnStop) this.popupWidget.set_visible(false);
	}
	,startSlide: function() {
		this.thumbDown = true;
		this.dispatchEvent(new nfuzion.widget.event.ScrollerEvent("ScrollerEvent.grab",this));
		this.repaint();
		if(this.get_reportPeriod() > 0) this.startSlideTimer();
		this.updatePopup();
	}
	,repaint: function(e) {
		if(this.implementation != null && this.implementation.get_stage() != null && !this.repaintRequested) {
			this.repaintRequested = true;
			this.attachListener(this.implementation.get_stage(),"paint",$bind(this,this.onPaint));
		}
	}
	,updateProgress: function() {
		if(this.implementation == null) return;
		var newRight = 0;
		var newBottom = 0;
		var thumbHalfWidth = 0;
		var thumbHalfHeight = 0;
		if(this.progressIndicator != null && this.progressTracksThumb) {
			if(this.thumb != null) {
				thumbHalfWidth = this.thumb._width / 2;
				thumbHalfHeight = this.thumb._height / 2;
				newRight = this.thumb._x + thumbHalfWidth;
				newBottom = this.thumb._y + thumbHalfHeight;
			} else if(this.touch != null) {
				newRight = this.implementation.globalToLocal(this.touch).x;
				newBottom = this.implementation.globalToLocal(this.touch).y;
			} else {
				var xPosition = this.left;
				var xValueRange = this.hMaximum - this.hMinimum - this.hPageSize;
				if(xValueRange < 0) xValueRange = 0;
				if(xValueRange != 0 && this.width != 0) xPosition += (this.get_value() - this.hMinimum) / xValueRange * this.width;
				var yPosition = this.top;
				var yValueRange = this.vMaximum - this.vMinimum - this.vPageSize;
				if(yValueRange < 0) yValueRange = 0;
				if(yValueRange != 0 && this.height != 0) yPosition += (this.get_value() - this.vMinimum) / yValueRange * this.height;
				newRight = xPosition;
				newBottom = yPosition;
			}
			if(this.horizontalEnabled) this.progressIndicator.set_right(newRight);
			if(this.verticalEnabled) this.progressIndicator.set_bottom(newBottom);
		}
		if(this.horizontalLine != null && this.verticalLine != null) {
			this.verticalLine.set_x(this.thumb._x + this.thumb._width / 2 - this.verticalLine._width / 2);
			this.horizontalLine.set_y(this.thumb._y + this.thumb._height / 2 - this.horizontalLine._height / 2);
		}
	}
	,updateButtons: function() {
		if(this.verticalEnabled) {
			if(this.upButton != null) this.upButton.set_enabled(this.get_vValue() > this.vMinimum);
			if(this.downButton != null) this.downButton.set_enabled(this.get_vValue() < this.vMaximum - this.vPageSize);
		}
		if(this.horizontalEnabled) {
			if(this.leftButton != null) this.leftButton.set_enabled(this.get_hValue() > this.hMinimum);
			if(this.rightButton != null) this.rightButton.set_enabled(this.get_hValue() < this.hMaximum - this.hPageSize);
		}
	}
	,updateValue: function() {
		var valueRange;
		if(this.verticalEnabled) {
			valueRange = this.vMaximum - this.vMinimum - this.vPageSize;
			if(valueRange < 0) valueRange = 0;
			if(this.track != null) {
				if(this.thumb != null) this.set_vValue((this.thumb._y - this.top) / this.height * valueRange + this.vMinimum); else this.set_vValue(this.track.globalToLocal(this.touch).y / this.height * valueRange + this.vMinimum);
			}
		}
		if(this.horizontalEnabled) {
			valueRange = this.hMaximum - this.hMinimum - this.hPageSize;
			if(valueRange < 0) valueRange = 0;
			if(this.track != null) {
				if(this.thumb != null) this.set_hValue((this.thumb._x - this.left) / this.width * valueRange + this.hMinimum); else this.set_hValue(this.track.globalToLocal(this.touch).x / this.width * valueRange + this.hMinimum);
			}
		}
		this.updateButtons();
	}
	,update: function() {
		var value;
		var valueRange;
		if(this.hideIfUseless) {
			var useless = true;
			if(this.verticalEnabled && Math.round(this.vMaximum - this.vPageSize) > Math.round(this.vMinimum)) useless = false;
			if(this.horizontalEnabled && this.hMaximum - this.hPageSize > this.hMinimum) useless = false;
			this.set_visible(!useless);
		}
		if(this.verticalEnabled) {
			value = this.get_vValue();
			if(value + this.vPageSize > this.vMaximum) value = this.vMaximum - this.vPageSize;
			if(value < this.vMinimum) value = this.vMinimum;
			valueRange = this.vMaximum - this.vMinimum - this.vPageSize;
			if(valueRange < 0) valueRange = 0;
			if(this.thumb != null) {
				if(valueRange != 0 && this.height != 0) this.thumb.set_y((value - this.vMinimum) / valueRange * this.height + this.top); else this.thumb.set_y(this.top);
			}
		}
		if(this.horizontalEnabled) {
			value = this.get_hValue();
			if(value + this.hPageSize > this.hMaximum) value = this.hMaximum - this.hPageSize;
			if(value < this.hMinimum) value = this.hMinimum;
			valueRange = this.hMaximum - this.hMinimum - this.hPageSize;
			if(valueRange < 0) valueRange = 0;
			if(this.thumb != null) {
				if(valueRange != 0 && this.width != 0) this.thumb.set_x((value - this.hMinimum) / valueRange * this.width + this.left); else this.thumb.set_x(this.left);
			}
		}
		this.updateProgress();
		this.updateButtons();
	}
	,set_sensitiveTrack: function(sensitiveTrack) {
		this.sensitiveTrack = sensitiveTrack;
		if(this.track != null) {
			if(sensitiveTrack) {
				this.attachListener(this.track,"begin",$bind(this,this.onTrackTouchBegin));
				this.track.set_touchEnabled(true);
			} else {
				this.detachListener(this.track,"begin",$bind(this,this.onTrackTouchBegin));
				this.track.set_touchEnabled(false);
			}
		}
		return sensitiveTrack;
	}
	,sensitiveTrack: null
	,addListeners: function() {
		nfuzion.widget.Group.prototype.addListeners.call(this);
		if(this.thumb != null) this.attachListener(this.thumb,"begin",$bind(this,this.onThumbTouchBegin));
		this.set_sensitiveTrack(this.sensitiveTrack);
		if(this.upButton != null) this.attachListener(this.upButton,"ButtonEvent.autoClick",$bind(this,this.pageUp));
		if(this.downButton != null) this.attachListener(this.downButton,"ButtonEvent.autoClick",$bind(this,this.pageDown));
		if(this.leftButton != null) this.attachListener(this.leftButton,"ButtonEvent.autoClick",$bind(this,this.pageLeft));
		if(this.rightButton != null) this.attachListener(this.rightButton,"ButtonEvent.autoClick",$bind(this,this.pageRight));
	}
	,findComponents: function(container) {
		nfuzion.widget.Group.prototype.findComponents.call(this,container);
		this.track = this.getComponentChild(this.implementation,"track");
		this.thumb = this.getComponentChild(this.implementation,"thumb");
		if(this.thumb == null) this.thumb = this.getComponentChild(this.implementation,"thumb_button");
		if(this.thumb != null) this.thumb.set_touchEnabled(true);
		var widget = this.getChild("popup_group");
		if(widget != null) {
			this.popupWidget = widget;
			this.popupWidget.set_visible(false);
		}
		this.progressIndicator = this.getComponentChild(this.implementation,"progress");
		if(this.progressIndicator == null) {
			var widget1 = this.getChild("progress_simple");
			if(widget1 != null) this.progressIndicator = widget1.implementation;
		}
		if(this.progressIndicator == null) {
			var widget1 = this.getChild("progress_group");
			if(widget1 != null) this.progressIndicator = widget1.implementation;
		}
		if(this.progressIndicator != null) this.progressOrigin = new nfuzion.geometry.Point(this.progressIndicator._x,this.progressIndicator._y);
		this.horizontalLine = this.getComponentChild(this.implementation,"horizontalLine");
		this.verticalLine = this.getComponentChild(this.implementation,"verticalLine");
		if(this.track != null && this.track._height >= this.track._width) this.verticalEnabled = true;
		if(this.track != null && this.track._width >= this.track._height) this.horizontalEnabled = true;
		if(this.track != null) {
			if(this.thumb != null) {
				this.top = this.thumb._y;
				this.bottom = 2 * this.track._y + this.track._height - this.thumb._height - this.thumb._y;
				this.left = this.thumb._x;
				this.right = 2 * this.track._x + this.track._width - this.thumb._width - this.thumb._x;
			} else {
				this.top = 0;
				this.bottom = this.track._height;
				this.left = 0;
				this.right = this.track._width;
			}
		}
		this.height = this.bottom - this.top;
		this.width = this.right - this.left;
		if(this.progressIndicator != null && this.track != null) {
			this.progressWidth = this.track._width + (this.track._x - this.progressIndicator._x) * 2;
			this.progressHeight = this.track._height + (this.track._y - this.progressIndicator._y) * 2;
		}
		widget = this.getChild("up_button");
		if(widget != null) {
			this.upButton = widget;
			this.verticalEnabled = true;
		}
		widget = this.getChild("down_button");
		if(widget != null) {
			this.downButton = widget;
			this.verticalEnabled = true;
		}
		widget = this.getChild("left_button");
		if(widget != null) {
			this.leftButton = widget;
			this.horizontalEnabled = true;
		}
		widget = this.getChild("right_button");
		if(widget != null) {
			this.rightButton = widget;
			this.horizontalEnabled = true;
		}
		this.set_autoRepeatPeriod(0.2);
		this.set_autoRepeatDelay(1);
		this.set_sensitiveTrack(true);
		this.set_enabled(true);
		this.reportPosition();
		this.repaint();
		this.attachListener(this.implementation,"addedToStage",$bind(this,this.repaint));
	}
	,initialize: function() {
		nfuzion.widget.Group.prototype.initialize.call(this);
		this.touchOffset = new nfuzion.geometry.Point();
		this.reportTimer = new nfuzion.timer.Timer(0);
		this.progressOrigin = new nfuzion.geometry.Point();
		this.set_hMinimum(0);
		this.set_vMinimum(0);
		this.set_hMaximum(100);
		this.set_vMaximum(100);
		this.set_vPageSize(10);
		this.set_hPageSize(10);
	}
	,repaintRequested: null
	,touch: null
	,currentTouchId: null
	,progressOrigin: null
	,popupWidget: null
	,progressHeight: null
	,progressWidth: null
	,reportTimer: null
	,verticalLine: null
	,horizontalLine: null
	,progressIndicator: null
	,track: null
	,thumb: null
	,previousHValue: null
	,previousVValue: null
	,touchOffset: null
	,width: null
	,right: null
	,left: null
	,height: null
	,bottom: null
	,top: null
	,rightButton: null
	,leftButton: null
	,downButton: null
	,upButton: null
	,hidePopupOnStop: null
	,popupUpdater: null
	,liveProgress: null
	,progressTracksThumb: null
	,thumbDown: null
	,roundValue: null
	,horizontalEnabled: null
	,verticalEnabled: null
	,__class__: nfuzion.widget.Scroller
	,__properties__: $extend(nfuzion.widget.Group.prototype.__properties__,{set_sensitiveTrack:"set_sensitiveTrack",set_hideIfUseless:"set_hideIfUseless",set_value:"set_value",get_value:"get_value",set_vValue:"set_vValue",get_vValue:"get_vValue",set_hValue:"set_hValue",get_hValue:"get_hValue",set_minimum:"set_minimum",get_minimum:"get_minimum",set_hMinimum:"set_hMinimum",set_vMinimum:"set_vMinimum",set_maximum:"set_maximum",get_maximum:"get_maximum",set_vMaximum:"set_vMaximum",set_hMaximum:"set_hMaximum",set_pageSize:"set_pageSize",get_pageSize:"get_pageSize",set_vPageSize:"set_vPageSize",set_hPageSize:"set_hPageSize",set_reportPeriod:"set_reportPeriod",get_reportPeriod:"get_reportPeriod",set_progress:"set_progress",get_progress:"get_progress",set_vProgress:"set_vProgress",get_vProgress:"get_vProgress",set_hProgress:"set_hProgress",get_hProgress:"get_hProgress",set_autoRepeatPeriod:"set_autoRepeatPeriod",set_autoRepeatDelay:"set_autoRepeatDelay",set_popupPageThreshold:"set_popupPageThreshold"})
});
nfuzion.widget.Slice = function(name,component) {
	nfuzion.widget.Simple.call(this,name,component);
};
$hxClasses["nfuzion.widget.Slice"] = nfuzion.widget.Slice;
nfuzion.widget.Slice.__name__ = ["nfuzion","widget","Slice"];
nfuzion.widget.Slice.__super__ = nfuzion.widget.Simple;
nfuzion.widget.Slice.prototype = $extend(nfuzion.widget.Simple.prototype,{
	update: function() {
		nfuzion.widget.Simple.prototype.update.call(this);
		var width = Math.round(this.implementation._width);
		var height = Math.round(this.implementation._height);
		if(width == this.lastWidth && height == this.lastHeight) return;
		this.lastWidth = width;
		this.lastHeight = height;
		var leftWidth = this.leftSize;
		var middleWidth = width - this.minWidth;
		var rightWidth = this.rightSize;
		if(width <= -this.minWidth) {
			leftWidth = -this.leftSize;
			middleWidth = width + this.minWidth;
			rightWidth = -this.rightSize;
		} else if(width < 0) {
			leftWidth = width * (this.leftSize / this.minWidth);
			rightWidth = width * (this.rightSize / this.minWidth);
			middleWidth = 0;
		} else if(width < this.minWidth) {
			leftWidth = -width * (this.leftSize / this.minWidth);
			rightWidth = -width * (this.rightSize / this.minWidth);
			middleWidth = 0;
		}
		var rightEdge = width - rightWidth + 1;
		if(width < 0) rightEdge = width - rightWidth - 1;
		var topHeight = this.topSize;
		var middleHeight = height - this.minHeight;
		var bottomHeight = this.bottomSize;
		if(height <= -this.minHeight) {
			topHeight = -this.topSize;
			middleHeight = height + this.minHeight;
			bottomHeight = -this.bottomSize;
		} else if(height < 0) {
			topHeight = height * (this.topSize / this.minHeight);
			middleHeight = 0;
			bottomHeight = height * (this.bottomSize / this.minHeight);
		} else if(height < this.minHeight) {
			topHeight = -height * (this.topSize / this.minHeight);
			middleHeight = 0;
			bottomHeight = -height * (this.bottomSize / this.minHeight);
		}
		var bottomEdge = height - bottomHeight + 1;
		if(height < 0) bottomEdge = height - bottomHeight - 1;
		if(this.topLeft != null) this.topLeft.setSize(leftWidth,topHeight);
		if(this.top != null) this.top.setSquare(leftWidth,this.top._y,middleWidth,topHeight);
		if(this.topRight != null) this.topRight.setSquare(rightEdge,this.topRight._y,rightWidth,topHeight);
		if(this.left != null) this.left.setSquare(this.left._x,topHeight,leftWidth,middleHeight);
		if(this.middle != null) this.middle.setSquare(leftWidth,topHeight,middleWidth,middleHeight);
		if(this.right != null) this.right.setSquare(rightEdge,topHeight,rightWidth,middleHeight);
		if(this.bottomLeft != null) this.bottomLeft.setSquare(this.bottomLeft._x,bottomEdge,leftWidth,bottomHeight);
		if(this.bottom != null) this.bottom.setSquare(leftWidth,bottomEdge,middleWidth,bottomHeight);
		if(this.bottomRight != null) this.bottomRight.setSquare(rightEdge,bottomEdge,rightWidth,bottomHeight);
	}
	,lastHeight: null
	,lastWidth: null
	,set_enabled: function(enabled) {
		if(this.target != null) {
			if(this.get_enabled() != enabled) {
				this.enabled = enabled;
				if(enabled) this.restoreListeners(); else {
					this.removeListeners();
					this.cancel();
				}
				this.update();
			}
		}
		return this.get_visible();
	}
	,get_enabled: function() {
		return this.enabled;
	}
	,onSizeChange: function(e) {
		this.update();
	}
	,addListeners: function() {
		nfuzion.widget.Simple.prototype.addListeners.call(this);
		this.attachListener(this.implementation,"changeSize",$bind(this,this.onSizeChange));
		this.update();
	}
	,findComponents: function(container) {
		this.topLeft = container.getChild("topLeft");
		this.top = container.getChild("top");
		this.topRight = container.getChild("topRight");
		this.left = container.getChild("left");
		this.middle = container.getChild("middle");
		this.right = container.getChild("right");
		this.bottomLeft = container.getChild("bottomLeft");
		this.bottom = container.getChild("bottom");
		this.bottomRight = container.getChild("bottomRight");
		if(this.topLeft != null) {
			this.leftSize = this.topLeft._width;
			this.topSize = this.topLeft._height;
		}
		if(this.middle != null) {
			this.rightSize = this.implementation._width - this.middle.get_right();
			this.bottomSize = this.implementation._height - this.middle.get_bottom();
			this.minWidth = this.implementation._width - this.middle._width;
			this.minHeight = this.implementation._height - this.middle._height;
		}
		nfuzion.widget.Simple.prototype.findComponents.call(this,container);
		this.set_enabled(true);
		this.implementation.set_touchEnabled(false);
	}
	,bottomSize: null
	,topSize: null
	,rightSize: null
	,leftSize: null
	,minHeight: null
	,minWidth: null
	,bottomRight: null
	,bottom: null
	,bottomLeft: null
	,right: null
	,middle: null
	,left: null
	,topRight: null
	,top: null
	,topLeft: null
	,__class__: nfuzion.widget.Slice
});
nfuzion.widget.VBox = function(name,component) {
	nfuzion.widget.Group.call(this,name,component);
};
$hxClasses["nfuzion.widget.VBox"] = nfuzion.widget.VBox;
nfuzion.widget.VBox.__name__ = ["nfuzion","widget","VBox"];
nfuzion.widget.VBox.__super__ = nfuzion.widget.Group;
nfuzion.widget.VBox.prototype = $extend(nfuzion.widget.Group.prototype,{
	onChildSizeChange: function(e) {
		this.update();
	}
	,update: function() {
		nfuzion.widget.Group.prototype.update.call(this);
		var totalHeight = 0;
		var y = 0;
		var i = this.children.length - 1;
		while(i >= 0) {
			var child = this.children[i];
			if(child != null && child.implementation != null) {
				totalHeight += child.implementation._height;
				child.implementation.set_y(y);
				y += child.implementation._height;
			}
			i--;
		}
		if(totalHeight > 0) this.implementation.set_height(totalHeight);
	}
	,appendChild: function(child) {
		var returnValue = nfuzion.widget.Group.prototype.appendChild.call(this,child);
		if(returnValue && child.implementation != null) this.attachListener(child.implementation,"changeSize",$bind(this,this.onChildSizeChange));
		return returnValue;
	}
	,findChildWidgets: function(container) {
		nfuzion.widget.Group.prototype.findChildWidgets.call(this,container);
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			this.attachListener(child.implementation,"changeSize",$bind(this,this.onChildSizeChange));
		}
		this.update();
	}
	,__class__: nfuzion.widget.VBox
});
nfuzion.widget.event = {}
nfuzion.widget.event.ButtonEvent = function(type,target,bubbles) {
	if(bubbles == null) bubbles = true;
	nfuzion.event.BubblingEvent.call(this,type,bubbles);
	this.target = target;
};
$hxClasses["nfuzion.widget.event.ButtonEvent"] = nfuzion.widget.event.ButtonEvent;
nfuzion.widget.event.ButtonEvent.__name__ = ["nfuzion","widget","event","ButtonEvent"];
nfuzion.widget.event.ButtonEvent.__super__ = nfuzion.event.BubblingEvent;
nfuzion.widget.event.ButtonEvent.prototype = $extend(nfuzion.event.BubblingEvent.prototype,{
	target: null
	,__class__: nfuzion.widget.event.ButtonEvent
});
nfuzion.widget.event.ChainEvent = function(type,target,index,data,bubbles) {
	if(bubbles == null) bubbles = true;
	nfuzion.event.BubblingEvent.call(this,type,bubbles);
	this.target = target;
	this.index = index;
	this.data = data;
};
$hxClasses["nfuzion.widget.event.ChainEvent"] = nfuzion.widget.event.ChainEvent;
nfuzion.widget.event.ChainEvent.__name__ = ["nfuzion","widget","event","ChainEvent"];
nfuzion.widget.event.ChainEvent.__super__ = nfuzion.event.BubblingEvent;
nfuzion.widget.event.ChainEvent.prototype = $extend(nfuzion.event.BubblingEvent.prototype,{
	data: null
	,index: null
	,target: null
	,__class__: nfuzion.widget.event.ChainEvent
});
nfuzion.widget.event.ListEvent = function(type,target,bubbles) {
	if(bubbles == null) bubbles = true;
	nfuzion.event.BubblingEvent.call(this,type,bubbles);
	this.target = target;
};
$hxClasses["nfuzion.widget.event.ListEvent"] = nfuzion.widget.event.ListEvent;
nfuzion.widget.event.ListEvent.__name__ = ["nfuzion","widget","event","ListEvent"];
nfuzion.widget.event.ListEvent.__super__ = nfuzion.event.BubblingEvent;
nfuzion.widget.event.ListEvent.prototype = $extend(nfuzion.event.BubblingEvent.prototype,{
	target: null
	,__class__: nfuzion.widget.event.ListEvent
});
nfuzion.widget.event.ScrollerEvent = function(type,target,value,bubbles) {
	if(bubbles == null) bubbles = true;
	if(value == null) value = 0;
	nfuzion.event.BubblingEvent.call(this,type,bubbles);
	this.target = target;
	this.value = value;
};
$hxClasses["nfuzion.widget.event.ScrollerEvent"] = nfuzion.widget.event.ScrollerEvent;
nfuzion.widget.event.ScrollerEvent.__name__ = ["nfuzion","widget","event","ScrollerEvent"];
nfuzion.widget.event.ScrollerEvent.__super__ = nfuzion.event.BubblingEvent;
nfuzion.widget.event.ScrollerEvent.prototype = $extend(nfuzion.event.BubblingEvent.prototype,{
	value: null
	,target: null
	,__class__: nfuzion.widget.event.ScrollerEvent
});
nfuzion.widget.event.WidgetEvent = function(type,target,bubbles) {
	if(bubbles == null) bubbles = true;
	nfuzion.event.BubblingEvent.call(this,type,bubbles);
	this.target = target;
};
$hxClasses["nfuzion.widget.event.WidgetEvent"] = nfuzion.widget.event.WidgetEvent;
nfuzion.widget.event.WidgetEvent.__name__ = ["nfuzion","widget","event","WidgetEvent"];
nfuzion.widget.event.WidgetEvent.__super__ = nfuzion.event.BubblingEvent;
nfuzion.widget.event.WidgetEvent.prototype = $extend(nfuzion.event.BubblingEvent.prototype,{
	target: null
	,__class__: nfuzion.widget.event.WidgetEvent
});
nfuzion.widget.type = {}
nfuzion.widget.type.ItemWidget = function(widget,widgetIndex,data,dataIndex) {
	if(dataIndex == null) dataIndex = -35534;
	this.widget = widget;
	this.widgetIndex = widgetIndex;
	this.data = data;
	this.data = dataIndex;
};
$hxClasses["nfuzion.widget.type.ItemWidget"] = nfuzion.widget.type.ItemWidget;
nfuzion.widget.type.ItemWidget.__name__ = ["nfuzion","widget","type","ItemWidget"];
nfuzion.widget.type.ItemWidget.prototype = {
	dataIndex: null
	,data: null
	,widgetIndex: null
	,widget: null
	,__class__: nfuzion.widget.type.ItemWidget
}
nfuzion.widget.type.PartialList = function(offset,entries) {
	this.offset = offset;
	this.entries = entries;
};
$hxClasses["nfuzion.widget.type.PartialList"] = nfuzion.widget.type.PartialList;
nfuzion.widget.type.PartialList.__name__ = ["nfuzion","widget","type","PartialList"];
nfuzion.widget.type.PartialList.prototype = {
	clone: function() {
		return new nfuzion.widget.type.PartialList(this.offset,this.entries.slice());
	}
	,entries: null
	,offset: null
	,__class__: nfuzion.widget.type.PartialList
}
var peripheral = {}
peripheral.Peripheral = function() { }
$hxClasses["peripheral.Peripheral"] = peripheral.Peripheral;
peripheral.Peripheral.__name__ = ["peripheral","Peripheral"];
peripheral.Peripheral.initialize = function() {
	if(peripheral.Peripheral.initialized) throw "Intercepted attempt to initialize Peripheral twice.";
	peripheral.Peripheral.initialized = true;
	peripheral.Peripheral.urlRecord = nfuzion.nTactic.NTactic.storage.getRecord("url");
	if(peripheral.Peripheral.urlRecord.value == null) peripheral.Peripheral.useDefault();
	try {
		peripheral.Peripheral.spanClient = new nfuzion.span.SpanClient(peripheral.Peripheral.urlRecord.value,null,"Cluster","hmi");
		peripheral.Peripheral.spanClient.addEventListener("SpanClientEvent.disconnect",peripheral.Peripheral.onClientDisconnect);
	} catch( e ) {
		peripheral.Peripheral.spanClient = null;
		haxe.Log.trace("NOTICE: Invalid url. Using default.",{ fileName : "Peripheral.hx", lineNumber : 57, className : "peripheral.Peripheral", methodName : "initialize"});
		peripheral.Peripheral.useDefault();
		peripheral.Peripheral.spanClient = new nfuzion.span.SpanClient(peripheral.Peripheral.urlRecord.value);
	}
	if(peripheral.Peripheral.spanClient != null) {
		peripheral.Peripheral.spanClient.set_autoConnect(true);
		nfuzion.debug.Debug.set_client(peripheral.Peripheral.spanClient);
		peripheral.Peripheral.chime = new nfuzion.moduleLink.ChimeProxy(peripheral.Peripheral.spanClient);
		peripheral.Peripheral.navigation = new nfuzion.moduleLink.NavigationProxy(peripheral.Peripheral.spanClient);
		peripheral.Peripheral.vehicle = new nfuzion.moduleLink.VehicleProxy(peripheral.Peripheral.spanClient);
		peripheral.Peripheral.leap = new nfuzion.moduleLink.LeapProxy(peripheral.Peripheral.spanClient);
	}
	peripheral.Peripheral.urlRecord.addEventListener("RecordEvent.change",peripheral.Peripheral.onUrlChange);
}
peripheral.Peripheral.onClientDisconnect = function(e) {
	nfuzion.nTactic.NTactic["goto"]("config:SpanConfigPopup");
}
peripheral.Peripheral.useDefault = function() {
	peripheral.Peripheral.urlRecord.set_value("ws://spanhost");
}
peripheral.Peripheral.onUrlChange = function(e) {
	peripheral.Peripheral.spanClient.connect(peripheral.Peripheral.urlRecord.value);
}
var screen = {}
screen.Cluster = function(graphicsClassName,fillParent) {
	nfuzion.nTactic.core.Screen.call(this,graphicsClassName,fillParent);
};
$hxClasses["screen.Cluster"] = screen.Cluster;
screen.Cluster.__name__ = ["screen","Cluster"];
screen.Cluster.__super__ = nfuzion.nTactic.core.Screen;
screen.Cluster.prototype = $extend(nfuzion.nTactic.core.Screen.prototype,{
	navTweenToAlpha: function(alpha) {
		if(this.navAlphaTween != null) this.navAlphaTween.destroy();
		this.navAlphaTween = new nfuzion.tween.Tween(0.75,[new nfuzion.tween.type.TweenProperty(this,"navAlpha",alpha,nfuzion.tween.type.TweenType.fast)]);
	}
	,set_navAlpha: function(navAlpha) {
		if(this.navAlpha != navAlpha) {
			this.navAlpha = navAlpha;
			this.navGroup.implementation.set_alpha(navAlpha);
		}
		return this.navAlpha;
	}
	,navAlpha: null
	,updateFuelLevelPopup: function(widget) {
		var popup = widget;
		popup.implementation.set_y(this.fuelLevel.progressIndicator.get_bottom() - 13);
	}
	,blinkTimerRun: function(priority) {
		var _g = peripheral.Peripheral;
		switch( (_g.vehicle.turnSignal)[1] ) {
		case 0:
			this.leftSignal.set_visible(false);
			this.rightSignal.set_visible(false);
			break;
		case 1:
			this.leftSignal.set_visible(!this.leftSignal.get_visible());
			peripheral.Peripheral.chime.setChime(nfuzion.message.chime.type.Chime.turnSignalClick,1);
			break;
		case 2:
			this.rightSignal.set_visible(!this.rightSignal.get_visible());
			peripheral.Peripheral.chime.setChime(nfuzion.message.chime.type.Chime.turnSignalClick,1);
			break;
		case 3:
			this.rightSignal.set_visible(!this.rightSignal.get_visible());
			this.leftSignal.set_visible(!this.leftSignal.get_visible());
			peripheral.Peripheral.chime.setChime(nfuzion.message.chime.type.Chime.turnSignalClick,1);
			break;
		}
	}
	,onNavRoute: function(e) {
	}
	,onNavWaypoints: function(e) {
	}
	,onNavDistancePercentage: function(e) {
	}
	,onNavDistance: function(e) {
		this.distanceToTargetLabel.set_text(Std.string(Math.round(peripheral.Peripheral.navigation.distance / 160.9) / 10) + "˘");
		this.updateDistanceScroller();
	}
	,onNavDestination: function(e) {
		this.navigationLabel.set_text("Arrived at destination");
	}
	,onNavCancel: function(e) {
		this.navGroup.set_visible(false);
		this.distanceToTargetScroller.set_value(0.0);
		this.distanceToTargetLabel.set_text("");
		this.navigationLabel.set_text("");
	}
	,updateDistanceScroller: function(distance) {
		if(distance == null) distance = peripheral.Peripheral.navigation.distance;
		if(!Math.isNaN(distance)) {
			distance = distance / 3218;
			if(distance > 1) distance = 1;
			this.distanceToTargetScroller.set_value(distance);
		}
	}
	,onNavTurn: function(e) {
		this.navGroup.set_visible(true);
		if(peripheral.Peripheral.navigation.nextTurn != null) {
			var _g = peripheral.Peripheral;
			switch( (_g.navigation.nextTurn.target)[1] ) {
			case 0:
				this.navArrows.implementation["goto"]("left");
				break;
			case 1:
				this.navArrows.implementation["goto"]("right");
				break;
			case 2:
				this.navArrows.implementation["goto"]("bearLeft");
				break;
			case 3:
				this.navArrows.implementation["goto"]("bearRight");
				break;
			case 4:
				this.navArrows.implementation["goto"]("uturn");
				break;
			case 5:
				break;
			case 6:
				this.navArrows.implementation["goto"]("forward");
				break;
			}
			this.navigationLabel.set_text(peripheral.Peripheral.navigation.nextTurn.street);
			this.navArrows.implementation.set_visible(true);
		} else this.navGroup.set_visible(false);
		this.updateDistanceScroller();
		this.distanceToTargetLabel.set_text(Std.string(Math.round(peripheral.Peripheral.navigation.distance / 160.9) / 10) + "˘");
	}
	,onWaterTemperature: function(e) {
		this.waterTemp.set_value(1 - peripheral.Peripheral.vehicle.waterTemperature);
	}
	,onTurnSignal: function(e) {
		var _g = peripheral.Peripheral;
		switch( (_g.vehicle.turnSignal)[1] ) {
		case 0:
			if(this.blinkTimer != null) {
				this.blinkTimer.stop();
				this.blinkTimer.reset();
				this.leftSignal.set_visible(false);
				this.rightSignal.set_visible(false);
			}
			this.blinkTimer = null;
			break;
		case 1:
			if(this.blinkTimer == null) {
				this.blinkTimer = new nfuzion.timer.Timer(0.5,0);
				this.blinkTimer.addEventListener("timer",$bind(this,this.blinkTimerRun));
				this.blinkTimer.start();
			}
			this.rightSignal.set_visible(false);
			break;
		case 2:
			if(this.blinkTimer == null) {
				this.blinkTimer = new nfuzion.timer.Timer(0.5,0);
				this.blinkTimer.addEventListener("timer",$bind(this,this.blinkTimerRun));
				this.blinkTimer.start();
			}
			this.leftSignal.set_visible(false);
			break;
		case 3:
			this.leftSignal.set_visible(false);
			this.rightSignal.set_visible(false);
			if(this.blinkTimer == null) {
				this.blinkTimer = new nfuzion.timer.Timer(0.5,0);
				this.blinkTimer.addEventListener("timer",$bind(this,this.blinkTimerRun));
				this.blinkTimer.start();
			}
			break;
		}
	}
	,onTransmission: function(e) {
		var _g = peripheral.Peripheral;
		switch( (_g.vehicle.transmission)[1] ) {
		case 0:
			this.prndSimple.implementation["goto"]("park");
			break;
		case 1:
			this.prndSimple.implementation["goto"]("reverse");
			break;
		case 2:
			this.prndSimple.implementation["goto"]("neutral");
			break;
		case 3:
			break;
		case 5:
			break;
		case 6:
			break;
		case 4:
			this.prndSimple.implementation["goto"]("drive");
			break;
		}
	}
	,onTractionControl: function(e) {
		this.tractionControl.set_visible(peripheral.Peripheral.vehicle.tractionControl);
	}
	,onSpeed: function(e) {
		this.speedLabel.set_text(Std.string(peripheral.Peripheral.vehicle.speed | 0));
	}
	,onSeatBelt: function(e) {
		this.seatBelts.set_visible(peripheral.Peripheral.vehicle.seatBelt);
	}
	,onOil: function(e) {
		this.oil.set_visible(peripheral.Peripheral.vehicle.oil);
	}
	,onOdometer: function(e) {
		this.odometerLabel.set_text(Std.string(peripheral.Peripheral.vehicle.odometer | 0) + "˘");
	}
	,onHighBeam: function(e) {
		this.highBeams.set_visible(peripheral.Peripheral.vehicle.highBeam);
	}
	,onFuel: function(e) {
		this.fuelLevel.set_value(1 - peripheral.Peripheral.vehicle.fuel);
	}
	,onEmergencyBrake: function(e) {
		this.emergencyBrake.set_visible(peripheral.Peripheral.vehicle.emergencyBrake);
	}
	,onDistanceToEmpty: function(e) {
		this.distanceToEmptyLabel.set_text(Std.string(peripheral.Peripheral.vehicle.distanceToEmpty | 0) + "˘");
		this.distanceToEmptyLabel.set_visible(true);
	}
	,onBattery: function(e) {
		this.battery.set_visible(peripheral.Peripheral.vehicle.battery);
	}
	,onAirBag: function(e) {
		this.airBag.set_visible(peripheral.Peripheral.vehicle.airBag);
	}
	,onABS: function(e) {
		this.abs.set_visible(peripheral.Peripheral.vehicle.abs);
	}
	,onNavigationReady: function(e) {
		if(peripheral.Peripheral.navigation.ready) peripheral.Peripheral.navigation.getNextTurn();
	}
	,onVehicleReady: function(e) {
		if(peripheral.Peripheral.vehicle.ready) {
			peripheral.Peripheral.vehicle.getABS();
			peripheral.Peripheral.vehicle.getAirBag();
			peripheral.Peripheral.vehicle.getBattery();
			peripheral.Peripheral.vehicle.getDistanceToEmpty();
			peripheral.Peripheral.vehicle.getEmergencyBrake();
			peripheral.Peripheral.vehicle.getFuel();
			peripheral.Peripheral.vehicle.getHighBeam();
			peripheral.Peripheral.vehicle.getOdometer();
			peripheral.Peripheral.vehicle.getOil();
			peripheral.Peripheral.vehicle.getSeatBelt();
			peripheral.Peripheral.vehicle.getSpeed();
			peripheral.Peripheral.vehicle.getTractionControl();
			peripheral.Peripheral.vehicle.getTransmission();
			peripheral.Peripheral.vehicle.getTurnSignal();
			peripheral.Peripheral.vehicle.getWaterTemperature();
		}
	}
	,onGoodbye: function(e) {
		nfuzion.nTactic.NTactic.screens["goto"]("welcome:Welcome");
	}
	,onStarted: function(e) {
		if(!peripheral.Peripheral.vehicle.started) nfuzion.nTactic.NTactic.screens["goto"]("welcome:Welcome");
	}
	,onLeapGesture: function(e) {
		switch( (e.gesture)[1] ) {
		case 8:
			this.navTweenToAlpha(0);
			break;
		case 9:
			this.navTweenToAlpha(1);
			break;
		default:
		}
	}
	,addListeners: function() {
		nfuzion.nTactic.core.Screen.prototype.addListeners.call(this);
		this.attachListener(peripheral.Peripheral.vehicle,"abs",$bind(this,this.onABS));
		this.attachListener(peripheral.Peripheral.vehicle,"airBag",$bind(this,this.onAirBag));
		this.attachListener(peripheral.Peripheral.vehicle,"battery",$bind(this,this.onBattery));
		this.attachListener(peripheral.Peripheral.vehicle,"distanceToEmpty",$bind(this,this.onDistanceToEmpty));
		this.attachListener(peripheral.Peripheral.vehicle,"emergencyBrake",$bind(this,this.onEmergencyBrake));
		this.attachListener(peripheral.Peripheral.vehicle,"fuel",$bind(this,this.onFuel));
		this.attachListener(peripheral.Peripheral.vehicle,"highBeam",$bind(this,this.onHighBeam));
		this.attachListener(peripheral.Peripheral.vehicle,"odometer",$bind(this,this.onOdometer));
		this.attachListener(peripheral.Peripheral.vehicle,"oil",$bind(this,this.onOil));
		this.attachListener(peripheral.Peripheral.vehicle,"seatBelt",$bind(this,this.onSeatBelt));
		this.attachListener(peripheral.Peripheral.vehicle,"speed",$bind(this,this.onSpeed));
		this.attachListener(peripheral.Peripheral.vehicle,"tractionControl",$bind(this,this.onTractionControl));
		this.attachListener(peripheral.Peripheral.vehicle,"transmission",$bind(this,this.onTransmission));
		this.attachListener(peripheral.Peripheral.vehicle,"turnSignal",$bind(this,this.onTurnSignal));
		this.attachListener(peripheral.Peripheral.vehicle,"waterTemperature",$bind(this,this.onWaterTemperature));
		this.attachListener(peripheral.Peripheral.navigation,"navigationTurn",$bind(this,this.onNavTurn));
		this.attachListener(peripheral.Peripheral.navigation,"navigationCancel",$bind(this,this.onNavCancel));
		this.attachListener(peripheral.Peripheral.navigation,"navigationDestination",$bind(this,this.onNavDestination));
		this.attachListener(peripheral.Peripheral.navigation,"navigationDistance",$bind(this,this.onNavDistance));
		this.attachListener(peripheral.Peripheral.navigation,"navigationDistancePercentage",$bind(this,this.onNavDistancePercentage));
		this.attachListener(peripheral.Peripheral.navigation,"navigationRoute",$bind(this,this.onNavRoute));
		this.attachListener(peripheral.Peripheral.navigation,"navigationWaypoints",$bind(this,this.onNavWaypoints));
		this.attachListener(peripheral.Peripheral.vehicle,"ready",$bind(this,this.onVehicleReady));
		this.attachListener(peripheral.Peripheral.navigation,"ready",$bind(this,this.onNavigationReady));
		if(peripheral.Peripheral.vehicle.ready) this.onVehicleReady();
		if(peripheral.Peripheral.navigation.ready) this.onNavigationReady();
		this.attachListener(peripheral.Peripheral.vehicle,"goodbye",$bind(this,this.onGoodbye));
		this.attachListener(peripheral.Peripheral.vehicle,"started",$bind(this,this.onStarted));
		this.attachListener(peripheral.Peripheral.leap,"leapGesture",$bind(this,this.onLeapGesture));
	}
	,enterScreen: function() {
		nfuzion.nTactic.core.Screen.prototype.enterScreen.call(this);
		this.set_navAlpha(1);
	}
	,initializeScreen: function() {
		nfuzion.nTactic.core.Screen.prototype.initializeScreen.call(this);
		this.distanceToEmptyLabel = this.getWidget("fuelLevel_scroller.popup_group.text_label");
		this.odometerLabel = this.getWidget("odometer_label");
		this.speedLabel = this.getWidget("speed_label");
		this.leftSignal = this.getWidget("turnLeft_simple");
		this.rightSignal = this.getWidget("turnRight_simple");
		this.emergencyBrake = this.getWidget("parkingbrake_simple");
		this.seatBelts = this.getWidget("seatBelts_simple");
		this.tractionControl = this.getWidget("tractionControl_simple");
		this.oil = this.getWidget("oil_simple");
		this.battery = this.getWidget("battery_simple");
		this.highBeams = this.getWidget("highBeams_simple");
		this.abs = this.getWidget("abs_simple");
		this.airBag = this.getWidget("airbag_simple");
		this.waterTemp = this.getWidget("waterTemp_scroller");
		this.fuelLevel = this.getWidget("fuelLevel_scroller");
		this.navGroup = this.getWidget("tacticalNav_group");
		this.distanceToTargetScroller = this.getWidget("tacticalNav_group.distance_scroller");
		this.distanceToTargetLabel = this.getWidget("tacticalNav_group.turnDistance_label");
		this.navigationLabel = this.getWidget("tacticalNav_group.nextTurnStreetName_label");
		this.navArrows = this.getWidget("tacticalNav_group.directionArrows_simple");
		this.prndSimple = this.getWidget("prnd_simple");
		var popupGroup = this.getWidget("fuelLevel_scroller.popup_group");
		this.updateFuelLevelPopup(popupGroup);
		this.waterTemp.set_maximum(1.0);
		this.waterTemp.set_minimum(0.0);
		this.waterTemp.set_pageSize(0.0);
		this.fuelLevel.set_maximum(1.0);
		this.fuelLevel.set_minimum(0.0);
		this.fuelLevel.set_pageSize(0.0);
		this.fuelLevel.hidePopupOnStop = false;
		this.fuelLevel.set_popupPageThreshold(-1);
		this.fuelLevel.popupUpdater = $bind(this,this.updateFuelLevelPopup);
		this.distanceToTargetScroller.set_maximum(1.0);
		this.distanceToTargetScroller.set_minimum(0.0);
		this.distanceToTargetScroller.set_pageSize(0.0);
		this.distanceToTargetScroller.set_enabled(false);
		this.leftSignal.set_visible(false);
		this.rightSignal.set_visible(false);
		this.abs.set_visible(false);
		this.airBag.set_visible(false);
		this.battery.set_visible(false);
		this.distanceToEmptyLabel.set_visible(true);
		this.emergencyBrake.set_visible(false);
		this.highBeams.set_visible(false);
		this.oil.set_visible(false);
		this.seatBelts.set_visible(false);
		this.tractionControl.set_visible(false);
		this.speedLabel.set_text("0");
		this.distanceToTargetLabel.set_text("");
		this.navigationLabel.set_text("");
		this.odometerLabel.set_text("86753˘");
		this.distanceToEmptyLabel.set_text("400˘");
		this.navGroup.set_visible(false);
	}
	,blinkTimer: null
	,navAlphaTween: null
	,prndSimple: null
	,navArrows: null
	,navigationLabel: null
	,distanceToTargetLabel: null
	,distanceToTargetScroller: null
	,navGroup: null
	,fuelLevel: null
	,waterTemp: null
	,airBag: null
	,abs: null
	,highBeams: null
	,battery: null
	,oil: null
	,tractionControl: null
	,seatBelts: null
	,emergencyBrake: null
	,rightSignal: null
	,leftSignal: null
	,speedLabel: null
	,odometerLabel: null
	,distanceToEmptyLabel: null
	,__class__: screen.Cluster
	,__properties__: $extend(nfuzion.nTactic.core.Screen.prototype.__properties__,{set_navAlpha:"set_navAlpha"})
});
screen.SpanConfigPopup = function(name) {
	this.entry = "";
	nfuzion.nTactic.core.DynamicScreen.call(this,name);
};
$hxClasses["screen.SpanConfigPopup"] = screen.SpanConfigPopup;
screen.SpanConfigPopup.__name__ = ["screen","SpanConfigPopup"];
screen.SpanConfigPopup.__super__ = nfuzion.nTactic.core.DynamicScreen;
screen.SpanConfigPopup.prototype = $extend(nfuzion.nTactic.core.DynamicScreen.prototype,{
	addToHistory: function(url) {
		this.history = this.history.filter(function(item) {
			return item != url;
		});
		this.history.unshift(url);
		if(this.history.length > 10) this.history.shift();
		this.historyList.set_dataLength(0);
		this.historyList.set_dataPosition(0);
		this.historyList.cache.invalidateData();
		this.historyList.invalidateView();
		this.historyList.set_dataLength(this.history.length);
		this.historyRecord.set_value(this.history);
	}
	,onHistorySelect: function(e) {
		var data = this.historyList.getDataByWidget(e.target);
		if(data != null) {
			this.entry = data;
			this.displayLabel.set_text(this.entry);
			this.onEnter();
			this.hideHistory();
		}
	}
	,updateRow: function(itemWidget) {
		var button = itemWidget.widget;
		var data = Std.string(itemWidget.data);
		if(data != null) button.label.set_text(data);
	}
	,requestData: function(start,end) {
		var entries = new Array();
		var _g1 = start, _g = end + 1;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.history[i] != null) entries.push(this.history[i]);
		}
		this.historyList.cache.addData(new nfuzion.widget.type.PartialList(start,entries));
	}
	,hideHistory: function() {
		this.historyList.set_visible(false);
	}
	,onDisplayClick: function(e) {
		this.historyList.set_visible(!this.historyList.get_visible());
	}
	,onClose: function(e) {
		peripheral.Peripheral.spanClient.set_autoConnect(true);
		nfuzion.nTactic.NTactic.screens["goto"]("config:");
	}
	,onKeyboard: function(e) {
		this.changeKeyLayout();
	}
	,onEnter: function(e) {
		if(this.validateEntry()) {
			this.urlRecord.set_value(this.entry);
			if(peripheral.Peripheral.spanClient.url != null) {
				this.entry = peripheral.Peripheral.spanClient.url.toString();
				this.setDisplayLabel(this.entry);
				this.descriptionLabel.set_text("Attempting to connect to:");
				peripheral.Peripheral.spanClient.set_autoConnect(true);
				this.addToHistory(this.entry);
			} else this.descriptionLabel.set_text("Failed to connect; malformed URL");
		}
	}
	,deleteCharacter: function() {
		this.entry = HxOverrides.substr(this.entry,0,this.entry.length - 1);
		this.setDisplayLabel(this.entry);
	}
	,onDeleteAutoClick: function(e) {
		this.deleteCharacter();
	}
	,onDeleteLongPress: function(e) {
		this.entry = "";
		this.setDisplayLabel(this.entry);
	}
	,changeKeyLayout: function(index) {
		if(index == null) index = -1;
		if(index < 0) {
			index = this.keyboardLayoutRecord.value + 1;
			if(index >= screen.SpanConfigPopup.keyLayouts.length) index = 0;
		}
		if(index < screen.SpanConfigPopup.keyLayouts.length) {
			this.keyboardLayoutRecord.set_value(index);
			this.keyMatrix.set_data(screen.SpanConfigPopup.keyLayouts[this.keyboardLayoutRecord.value]);
			this.keyMatrix.update();
		}
	}
	,validateEntry: function() {
		try {
			nfuzion.span.SpanClient.parseUrlString(this.entry,true);
		} catch( e ) {
			if( js.Boot.__instanceof(e,String) ) {
				this.descriptionLabel.set_text(e);
				return false;
			} else throw(e);
		}
		return true;
	}
	,onKeyClick: function(e) {
		var value = this.keyMatrix.getDataByWidget(e.target);
		this.entry += value;
		this.setDisplayLabel(this.entry);
	}
	,onConnectionEvent: function(e) {
		if(peripheral.Peripheral.spanClient.get_connected()) {
			haxe.Log.trace("Connected to Span!",{ fileName : "SpanConfigPopup.hx", lineNumber : 484, className : "screen.SpanConfigPopup", methodName : "onConnectionEvent"});
			this.descriptionLabel.set_text("Connected");
			this.displayLabel.set_paint(this.connectedPaint);
		} else if(e == null) {
			haxe.Log.trace("Not Connected",{ fileName : "SpanConfigPopup.hx", lineNumber : 491, className : "screen.SpanConfigPopup", methodName : "onConnectionEvent"});
			this.descriptionLabel.set_text("Disconnected");
		} else {
			haxe.Log.trace("Connection Failed!",{ fileName : "SpanConfigPopup.hx", lineNumber : 496, className : "screen.SpanConfigPopup", methodName : "onConnectionEvent"});
			this.descriptionLabel.set_text("Connection failed");
			this.displayLabel.set_paint(this.invalidPaint);
		}
	}
	,setDisplayLabel: function(value) {
		if(!this.validateEntry()) {
			this.displayLabel.set_paint(this.invalidPaint);
			this.enterButton.label.set_paint(this.disabledPaint);
			this.enterButton.set_enabled(false);
			if(value == "") this.descriptionLabel.set_text("Enter a valid url or hostname");
		} else {
			this.displayLabel.set_paint(this.alphaPaint);
			this.enterButton.label.set_paint(this.controlsTextPaint);
			this.enterButton.set_enabled(true);
			this.descriptionLabel.set_text("");
		}
		if(this.entry == peripheral.Peripheral.spanClient.url.toString() && peripheral.Peripheral.spanClient.get_connected()) {
			this.displayLabel.set_paint(this.connectedPaint);
			this.displayLabel.set_text(value);
			this.descriptionLabel.set_text("Connected");
		} else this.displayLabel.set_text(value + "_");
		peripheral.Peripheral.spanClient.set_autoConnect(false);
	}
	,updateKeys: function(itemWidget) {
		if(js.Boot.__instanceof(itemWidget.widget,nfuzion.widget.Button)) {
			var button = itemWidget.widget;
			button.label.set_text(itemWidget.data.toUpperCase());
			var numerals = ["1","2","3","4","5","6","7","8","9","0"];
			if(Lambda.indexOf(numerals,itemWidget.data.toUpperCase()) != -1) button.label.set_paint(this.numeralPaint); else button.label.set_paint(this.alphaPaint);
		}
	}
	,createButton: function(foundation,name,font,staticText,verticalAlign,upPaint) {
		if(verticalAlign == null) verticalAlign = 0.5;
		if(upPaint == null) upPaint = this.keyPrimaryPaint;
		var buttonSketch = new nfuzion.sketch.type.SketchContainer(name,0,0,this.keyWidth,this.keyHeight);
		buttonSketch.backgroundPaint = upPaint;
		buttonSketch.borderPaint = this.keyBorderPaint;
		buttonSketch.borderWidth = 1;
		buttonSketch.alpha = 0.9;
		var textSketch = null;
		if(font != null) {
			var textHeight = Math.round(1.35 * font.size);
			textSketch = new nfuzion.sketch.type.SketchText("text_label",2,Math.round(verticalAlign * (this.keyHeight - textHeight)),this.keyWidth - 4,textHeight);
			textSketch.paint = this.controlsTextPaint;
			textSketch.alignment = nfuzion.type.Alignment.center;
			textSketch.font = font;
			textSketch.text = staticText;
			buttonSketch.appendChildSketch(textSketch);
		}
		var downGuise = new nfuzion.sketch.type.SketchContainer("down");
		downGuise.backgroundPaint = this.keyDownPaint;
		downGuise.borderPaint = this.keyBorderPaint;
		downGuise.borderWidth = 1;
		buttonSketch.addGuise(downGuise);
		var disabledGuise = new nfuzion.sketch.type.SketchContainer("disabled");
		disabledGuise.backgroundPaint = this.keyPrimaryPaint;
		disabledGuise.alpha = 0.7;
		disabledGuise.borderPaint = this.keyBorderPaint;
		disabledGuise.borderWidth = 1;
		buttonSketch.addGuise(disabledGuise);
		var container = nfuzion.nTactic.NTactic.builder.buildContainer(foundation,buttonSketch);
		if(textSketch != null) textSketch.paint = null;
		return container;
	}
	,layoutScreen: function() {
		nfuzion.nTactic.core.DynamicScreen.prototype.layoutScreen.call(this);
		var screenWidth = nfuzion.nTactic.NTactic.stage._width / 2 | 0;
		var screenHeight = nfuzion.nTactic.NTactic.stage._height / 2 | 0;
		var screenRatio = .8;
		var popupWidth = .9 * screenWidth | 0;
		var popupHeight;
		if(screenRatio >= 0.5) popupHeight = 0.5 * popupWidth | 0; else popupHeight = screenRatio * popupWidth | 0;
		var originX = (screenWidth - popupWidth) / 2 | 0;
		var originY = (screenHeight - popupHeight) / 2 | 0;
		this.keyWidth = (popupWidth / 10 | 0) + 1;
		this.keyHeight = popupHeight / 5 | 0;
		var bg = this.createContainer("background_simple",screenWidth,screenHeight);
		bg.set_alpha(0.8);
		bg.set_backgroundPaint(this.bgPaint);
		this.appendChild(bg);
		var controlPanel = this.createContainer("control_group",popupWidth,this.keyHeight,originX,originY);
		var $delete = this.createButton(controlPanel,"delete_button",this.symbolFont,"<",0.6,this.controlsPaint);
		$delete.set_x(popupWidth - 2 * (this.keyWidth - 1));
		var enter = this.createButton(controlPanel,"enter_button",this.symbolFont,">",0.6,this.controlsPaint);
		enter.set_x(popupWidth - (this.keyWidth - 1));
		enter.set_width(this.keyWidth - 1);
		var close = this.createButton(controlPanel,"close_button",this.symbolFont,"X",0.6,this.controlsPaint);
		var keyLayout = this.createButton(controlPanel,"keyLayout_button",this.symbolFont,"K",0.6,this.controlsPaint);
		keyLayout.set_x(this.keyWidth - 1);
		var displayWidth = popupWidth - 4 * (this.keyWidth - 1) - 1;
		var displayX = 2 * this.keyWidth - 1;
		var displayBackground = this.createContainer("displayBackground_simple",displayWidth,this.keyHeight,displayX,0);
		displayBackground.set_backgroundPaint(this.bgPaint);
		displayBackground.set_alpha(0.9);
		controlPanel.appendChild(displayBackground);
		this.appendChild(controlPanel);
		var display = this.createContainer("display_button",displayWidth,this.keyHeight,displayX,0);
		var input = new nfuzion.graphics.Text("input_label");
		input.set_text("");
		input.set_paint(this.alphaPaint);
		input.set_alignment(nfuzion.type.Alignment.left);
		input.set_font(this.displayFontPrimary);
		input.set_x(10);
		input.set_height(1.25 * input.font.size);
		input.set_y(this.keyHeight - input._height);
		input.set_width(display._width - (input._x + 2));
		display.appendChild(input);
		var alert = new nfuzion.graphics.Text("alert_label");
		alert.set_text("");
		alert.set_paint(this.controlsTextPaint);
		alert.set_alignment(nfuzion.type.Alignment.left);
		alert.set_font(this.displayFontSecondary);
		alert.set_x(10);
		alert.set_y(4);
		alert.set_height(1.25 * alert.font.size);
		alert.set_width(display._width - (alert._x + 2));
		display.appendChild(alert);
		controlPanel.appendChild(display);
		var keypad = this.createContainer("keypad_chain",popupWidth,popupHeight,originX,originY + this.keyHeight - 1);
		var _g = 0;
		while(_g < 4) {
			var y = _g++;
			var _g1 = 0;
			while(_g1 < 10) {
				var x = _g1++;
				var key = this.createButton(keypad,"item_" + (x + y * 10) + "_button",this.keypadFont);
				key.set_x(x * (this.keyWidth - 1));
				key.set_y(y * (this.keyHeight - 1));
			}
		}
		this.appendChild(keypad);
		var border = this.createContainer("border",popupWidth,popupHeight - 4,originX,originY);
		border.set_touchEnabled(false);
		border.set_borderPaint(this.keyBorderPaint);
		border.set_borderWidth(1);
		this.appendChild(border);
		var list = this.createContainer("history_list",displayWidth,popupHeight - 2 * this.keyHeight - 2,originX + displayX,originY + this.keyHeight - 1);
		list.set_backgroundPaint(this.disabledPaint);
		list.set_alpha(0.9);
		list.set_borderPaint(this.keyBorderPaint);
		list.set_borderWidth(1);
		var row = this.createContainer("row_0_button",displayWidth,Math.round(0.6 * this.keyHeight),0,0);
		var rowDown = this.createContainer("down",row._width,row._height,0,0);
		rowDown.set_backgroundPaint(this.keyDownPaint);
		var input1 = new nfuzion.graphics.Text("text_label");
		input1.set_text("Blast from the past!");
		input1.set_paint(this.alphaPaint);
		input1.set_alignment(nfuzion.type.Alignment.left);
		input1.set_font(this.displayFontPrimary);
		input1.set_x(10);
		input1.set_height(1.25 * input1.font.size);
		input1.set_y(3);
		input1.set_width(display._width - (input1._x + 2));
		row.appendChild(rowDown);
		row.appendChild(input1);
		list.appendChild(row);
		this.appendChild(list);
	}
	,defineFonts: function() {
		nfuzion.nTactic.core.DynamicScreen.prototype.defineFonts.call(this);
		this.keypadFont = this.setFont("spanconfigkey",this.formatPath("./fonts/GillSansLight.ttf"),40);
		this.displayFontPrimary = this.setFont("spanconfigdisplayprimary",this.formatPath("./fonts/GillSansLight.ttf"),36);
		this.displayFontSecondary = this.setFont("spanconfigdisplaysecondary",this.formatPath("./fonts/GillSansLight.ttf"),22);
		this.symbolFont = this.setFont("spanconfigsymbols",this.formatPath("./fonts/Symbols.ttf"),40);
	}
	,definePaints: function() {
		nfuzion.nTactic.core.DynamicScreen.prototype.definePaints.call(this);
		this.alphaPaint = this.setPaint("spanconfigalpha","0xffffff");
		this.numeralPaint = this.setPaint("spanconfignumeral","0xffff99");
		this.connectedPaint = this.setPaint("spanconfigconnected","0xccff66");
		this.invalidPaint = this.setPaint("spanconfiginvalid","0xff3300");
		this.disabledPaint = this.setPaint("spanconfigdisabled","0x000000");
		this.controlsTextPaint = this.setPaint("spanconfigcontrolstext","0xbbbbbb");
		this.controlsPaint = this.setPaint("spanconfigcontrols","0x333333");
		this.keyPrimaryPaint = this.setPaint("spanconfigkeyprimary","0x555555");
		this.keyDownPaint = this.setPaint("spanconfigkeydown","0x78C043");
		this.keyBorderPaint = this.setPaint("spanconfigkeyborder","0x666666");
		this.bgPaint = this.setPaint("spanconfigbackground","0x000000");
	}
	,enterScreen: function() {
		nfuzion.nTactic.core.DynamicScreen.prototype.enterScreen.call(this);
		this.keyMatrix.update();
		this.deleteButton.set_longPressDelay(1.5);
		this.deleteButton.set_autoRepeatDelay(.5);
		this.deleteButton.set_autoRepeatPeriod(.1);
		this.historyList.update();
		this.entry = peripheral.Peripheral.spanClient.url.toString();
		this.displayLabel.set_text(this.entry);
		this.onConnectionEvent();
		if(screen.SpanConfigPopup.keyLayouts.length > 1) this.keyboardButton.set_visible(true); else this.keyboardButton.set_visible(false);
		this.historyList.set_visible(false);
	}
	,addListeners: function() {
		nfuzion.nTactic.core.DynamicScreen.prototype.addListeners.call(this);
		this.attachListener(this.keyMatrix,"ButtonEvent.click",$bind(this,this.onKeyClick));
		this.attachListener(this.deleteButton,"ButtonEvent.longPress",$bind(this,this.onDeleteLongPress));
		this.attachListener(this.deleteButton,"ButtonEvent.autoClick",$bind(this,this.onDeleteAutoClick));
		this.attachListener(this.enterButton,"ButtonEvent.click",$bind(this,this.onEnter));
		this.attachListener(this.closeButton,"ButtonEvent.click",$bind(this,this.onClose));
		this.attachListener(this.keyboardButton,"ButtonEvent.click",$bind(this,this.onKeyboard));
		this.attachListener(this.displayButton,"ButtonEvent.click",$bind(this,this.onDisplayClick));
		this.attachListener(this.historyList,"ButtonEvent.click",$bind(this,this.onHistorySelect));
		this.attachListener(peripheral.Peripheral.spanClient,"SpanClientEvent.connect",$bind(this,this.onConnectionEvent));
		this.attachListener(peripheral.Peripheral.spanClient,"SpanClientEvent.disconnect",$bind(this,this.onConnectionEvent));
	}
	,setupWidgets: function() {
		nfuzion.nTactic.core.DynamicScreen.prototype.setupWidgets.call(this);
		this.keyMatrix = this.getWidget("keypad_chain");
		this.deleteButton = this.getWidget("control_group.delete_button");
		this.closeButton = this.getWidget("control_group.close_button");
		this.enterButton = this.getWidget("control_group.enter_button");
		this.keyboardButton = this.getWidget("control_group.keyLayout_button");
		this.displayButton = this.getWidget("control_group.display_button");
		this.displayLabel = this.getWidget("control_group.display_button.input_label");
		this.descriptionLabel = this.getWidget("control_group.display_button.alert_label");
		this.historyList = this.getWidget("history_list");
		this.urlRecord = nfuzion.nTactic.NTactic.storage.getRecord("url");
		this.keyboardLayoutRecord = nfuzion.nTactic.NTactic.storage.getRecord("keyLayout");
		if(this.keyboardLayoutRecord.value == null) this.keyboardLayoutRecord.set_value(0);
		this.keyMatrix.set_data(screen.SpanConfigPopup.keyLayouts[this.keyboardLayoutRecord.value]);
		this.keyMatrix.set_itemUpdater($bind(this,this.updateKeys));
		var _g1 = 0, _g = this.keyMatrix.get_childCount() - 1;
		while(_g1 < _g) {
			var i = _g1++;
			var key = this.keyMatrix.getChildAt(i);
			key.set_requireDirectTouch(false);
		}
		this.history = new Array();
		this.historyRecord = nfuzion.nTactic.NTactic.storage.getRecord("urlHistory");
		if(this.historyRecord.value == null) this.historyRecord.set_value(this.history);
		this.history = this.historyRecord.value;
		this.historyList.set_physics(new nfuzion.physics.Scrolling());
		this.historyList.cache.set_dataRequester($bind(this,this.requestData));
		this.historyList.rowUpdater = $bind(this,this.updateRow);
		this.historyList.set_dataLength(this.history.length);
	}
	,historyRecord: null
	,keyboardLayoutRecord: null
	,urlRecord: null
	,keyHeight: null
	,keyWidth: null
	,history: null
	,entry: null
	,historyList: null
	,displayButton: null
	,descriptionLabel: null
	,displayLabel: null
	,keyboardButton: null
	,closeButton: null
	,enterButton: null
	,deleteButton: null
	,displayGroup: null
	,keyMatrix: null
	,symbolFont: null
	,displayFontSecondary: null
	,displayFontPrimary: null
	,keypadFont: null
	,bgPaint: null
	,keyBorderPaint: null
	,keyDownPaint: null
	,controlsPaint: null
	,keyPrimaryPaint: null
	,controlsTextPaint: null
	,disabledPaint: null
	,invalidPaint: null
	,connectedPaint: null
	,numeralPaint: null
	,alphaPaint: null
	,__class__: screen.SpanConfigPopup
});
screen.Welcome = function(graphicsClassName,fillParent) {
	nfuzion.nTactic.core.Screen.call(this,graphicsClassName,fillParent);
};
$hxClasses["screen.Welcome"] = screen.Welcome;
screen.Welcome.__name__ = ["screen","Welcome"];
screen.Welcome.__super__ = nfuzion.nTactic.core.Screen;
screen.Welcome.prototype = $extend(nfuzion.nTactic.core.Screen.prototype,{
	fadeTextOut: function() {
		new nfuzion.tween.Tween(1,[new nfuzion.tween.type.TweenProperty(this.welcomeText,"alpha",0,nfuzion.tween.type.TweenType.slow)],$bind(this,this.animationComplete));
		new nfuzion.tween.Tween(1,[new nfuzion.tween.type.TweenProperty(this.nameText,"alpha",0,nfuzion.tween.type.TweenType.slow)]);
	}
	,endGlow: function() {
		new nfuzion.tween.Tween(.5,[new nfuzion.tween.type.TweenProperty(this.glow,"alpha",0,nfuzion.tween.type.TweenType.slow)]);
	}
	,enterLines: function() {
		new nfuzion.tween.Tween(2,[new nfuzion.tween.type.TweenProperty(this.lines,"x",0,nfuzion.tween.type.TweenType.linear)],$bind(this,this.fadeTextOut));
		new nfuzion.tween.Tween(.5,[new nfuzion.tween.type.TweenProperty(this.glow,"alpha",1,nfuzion.tween.type.TweenType.fast)],$bind(this,this.endGlow));
		new nfuzion.tween.Tween(1.2,[new nfuzion.tween.type.TweenProperty(this.nameText,"alpha",1,nfuzion.tween.type.TweenType.slow)]);
	}
	,animationComplete: function() {
		haxe.Log.trace("Complete",{ fileName : "Welcome.hx", lineNumber : 118, className : "screen.Welcome", methodName : "animationComplete"});
		this.setInitialState();
	}
	,animate: function() {
		haxe.Log.trace("Animating!",{ fileName : "Welcome.hx", lineNumber : 110, className : "screen.Welcome", methodName : "animate"});
		new nfuzion.tween.Tween(1,[new nfuzion.tween.type.TweenProperty(this.welcomeText,"y",120,nfuzion.tween.type.TweenType.linear)]);
		new nfuzion.tween.Tween(.5,[new nfuzion.tween.type.TweenProperty(this.welcomeText,"alpha",1,nfuzion.tween.type.TweenType.slow)]);
		new nfuzion.timer.Delay($bind(this,this.enterLines),.75);
	}
	,onWelcome: function(e) {
		if(peripheral.Peripheral.vehicle.welcomeSubtitle != null) this.nameLabel.set_text(peripheral.Peripheral.vehicle.welcomeSubtitle); else this.nameLabel.set_text("");
		this.welcomeLabel.set_text(peripheral.Peripheral.vehicle.welcomeTitle);
		this.animate();
	}
	,unloadCluster: function() {
		nfuzion.nTactic.NTactic.screens["goto"]("default:");
	}
	,close: function() {
		nfuzion.nTactic.NTactic.screens["goto"]("welcome:");
	}
	,fadeOut: function() {
		new nfuzion.tween.Tween(1,[new nfuzion.tween.type.TweenProperty(this,"alpha",0,nfuzion.tween.type.TweenType.slow)],$bind(this,this.close));
	}
	,fadeIn: function() {
		new nfuzion.tween.Tween(1,[new nfuzion.tween.type.TweenProperty(this,"alpha",1,nfuzion.tween.type.TweenType.fast)],$bind(this,this.unloadCluster));
	}
	,onIgnition: function(e) {
		nfuzion.nTactic.NTactic.screens["goto"]("Cluster");
		new nfuzion.timer.Delay($bind(this,this.fadeOut),.1);
	}
	,addListeners: function() {
		nfuzion.nTactic.core.Screen.prototype.addListeners.call(this);
		this.attachListener(peripheral.Peripheral.vehicle,"welcome",$bind(this,this.onWelcome));
		this.attachListener(peripheral.Peripheral.vehicle,"started",$bind(this,this.onIgnition));
	}
	,setInitialState: function() {
		this.nameText.set_alpha(0);
		this.lines.set_x(-3888);
		this.welcomeText.set_y(500);
		this.welcomeText.set_alpha(0);
		this.glow.set_alpha(0);
	}
	,enterScreen: function() {
		nfuzion.nTactic.core.Screen.prototype.enterScreen.call(this);
		this.setInitialState();
		this.set_alpha(0);
		new nfuzion.timer.Delay($bind(this,this.fadeIn),.5);
	}
	,initializeScreen: function() {
		nfuzion.nTactic.core.Screen.prototype.initializeScreen.call(this);
		var animationSimple = this.getWidget("animatedMask_simple");
		this.welcomeLabel = this.getWidget("text_label");
		this.nameLabel = this.getWidget("subtext_label");
		var glowSimple = this.getWidget("glow_simple");
		this.glow = glowSimple.implementation;
		this.lines = animationSimple.implementation;
		this.welcomeText = this.welcomeLabel.implementation;
		this.nameText = this.nameLabel.implementation;
	}
	,glow: null
	,lines: null
	,nameText: null
	,welcomeText: null
	,welcomeLabel: null
	,nameLabel: null
	,__class__: screen.Welcome
});
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.ProcessingInstruction = "processingInstruction";
Xml.Document = "document";
nfuzion.application.Application.done = false;
haxe.Serializer.USE_CACHE = false;
haxe.Serializer.USE_ENUM_INDEX = false;
haxe.Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.ds.ObjectMap.count = 0;
haxe.xml.Parser.escapes = (function($this) {
	var $r;
	var h = new haxe.ds.StringMap();
	h.set("lt","<");
	h.set("gt",">");
	h.set("amp","&");
	h.set("quot","\"");
	h.set("apos","'");
	h.set("nbsp",String.fromCharCode(160));
	$r = h;
	return $r;
}(this));
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
nfuzion.builder.event.BuilderEvent.SKETCH = "sketch";
nfuzion.cache.ListCache.REQUEST_TIMEOUT = 5;
nfuzion.cache.ListCache.BUFFER_SIZE = 20;
nfuzion.cache.ListCache.INVALID_RANGE_INDEX = -1;
nfuzion.cache.event.CacheEvent.UPDATE = "CacheEvent.update";
nfuzion.cache.event.CacheEvent.CACHING = "CacheEvent.caching";
nfuzion.cache.event.CacheEvent.CACHED = "CacheEvent.cached";
nfuzion.client.WebSocketClient.TX_WAIT_PERIOD = 0.05;
nfuzion.client.event.ClientEvent.CONNECT = "ClientEvent.connect";
nfuzion.client.event.ClientEvent.DISCONNECT = "ClientEvent.disconnect";
nfuzion.client.event.ClientEvent.DATA = "ClientEvent.data";
nfuzion.debug.Debug.BUFFER_LIMIT = 20;
nfuzion.font.Font.fontCount = 0;
nfuzion.font.event.FontEvent.CHANGE = "PaintEvent.change";
nfuzion.font.event.FontFaceEvent.READY = "FontFaceEvent.ready";
nfuzion.geometry.event.BoxEvent.CHANGE = "change";
nfuzion.geometry.event.BoxEvent.CHANGE_SIZE = "changeSize";
nfuzion.geometry.event.BoxEvent.CHANGE_POSITION = "changePosition";
nfuzion.graphics.Stage.FORCED_FRAME_RATE = 1 / 30;
nfuzion.graphics.Stage.FRAME_RATE_PERIOD = .25;
nfuzion.graphics.Stage.FRAME_RATE_FILTER = 10;
nfuzion.graphics.event.ComponentEvent.ADDED_TO_STAGE = "addedToStage";
nfuzion.graphics.event.ComponentEvent.REMOVED_FROM_STAGE = "removedFromStage";
nfuzion.graphics.event.ComponentEvent.ORPHANING = "orphaning";
nfuzion.graphics.event.ComponentEvent.ADOPTED = "adopted";
nfuzion.graphics.event.StageEvent.PAINT = "paint";
nfuzion.graphics.event.StageEvent.FRAME_RATE = "frameRate";
nfuzion.graphics.event.TouchEvent.MOUSE_TOUCH_ID = -1;
nfuzion.graphics.event.TouchEvent.BEGIN = "begin";
nfuzion.graphics.event.TouchEvent.OVER = "over";
nfuzion.graphics.event.TouchEvent.MOVE = "move";
nfuzion.graphics.event.TouchEvent.OUT = "out";
nfuzion.graphics.event.TouchEvent.END = "end";
nfuzion.image.event.ImageEvent.READY = "ImageEvent.ready";
nfuzion.image.event.ImageEvent.ERROR = "ImageEvent.error";
nfuzion.image.event.ImageLoaderEvent.COMPLETE = "ImageLoaderEvent.complete";
nfuzion.limits.IntLimits.MAX = 134217727;
nfuzion.limits.IntLimits.MIN = 134217728;
nfuzion.loader.event.LoaderEvent.READY = "LoaderEvent.ready";
nfuzion.loader.event.LoaderEvent.ERROR = "LoaderEvent.error";
nfuzion.message.chime.LetChime.chimeType = [nfuzion.message.chime.type.Chime];
nfuzion.message.chime.LetChime.playCountType = [Int];
nfuzion.message.chime.SetChime.chimeType = [nfuzion.message.chime.type.Chime];
nfuzion.message.chime.SetChime.playCountType = [Int];
nfuzion.message.debug.LetTrace.timestampType = [Float];
nfuzion.message.debug.LetTrace.sourceNameType = [String];
nfuzion.message.debug.LetTrace.messageType = [String];
nfuzion.message.debug.LetTrace.fileNameType = [String];
nfuzion.message.debug.LetTrace.lineNumberType = [Int];
nfuzion.message.debug.LetTrace.classNameType = [String];
nfuzion.message.debug.LetTrace.functionNameType = [String];
nfuzion.message.generic.templates.LetBool.valueType = [Bool];
nfuzion.message.generic.templates.LetFloat.valueType = [Float];
nfuzion.message.generic.templates.SetBool.valueType = [Bool];
nfuzion.message.generic.templates.SetFloat.valueType = [Float];
nfuzion.message.generic.templates.SetString.valueType = [String];
nfuzion.message.leap.LetCursor.xType = [Float];
nfuzion.message.leap.LetCursor.yType = [Float];
nfuzion.message.leap.LetCursor.phaseType = [nfuzion.message.leap.type.Phase];
nfuzion.message.leap.LetGesture.gestureType = [nfuzion.message.leap.type.Gesture];
nfuzion.message.leap.LetPoke.xType = [Float];
nfuzion.message.leap.LetPoke.yType = [Float];
nfuzion.message.leap.LetPoke.fingerCountType = [Int];
nfuzion.message.leap.LetPoke.clickCountType = [Int];
nfuzion.message.leap.LetRotate.deltaAngleType = [Float];
nfuzion.message.leap.LetRotate.fingerCountType = [Int];
nfuzion.message.leap.LetScroll.deltaXType = [Float];
nfuzion.message.leap.LetScroll.deltaYType = [Float];
nfuzion.message.leap.LetScroll.velocityXType = [Float];
nfuzion.message.leap.LetScroll.velocityYType = [Float];
nfuzion.message.leap.LetScroll.phaseType = [nfuzion.message.leap.type.Phase];
nfuzion.message.leap.LetScroll.fingerCountType = [Int];
nfuzion.message.leap.LetZoom.deltaZoomType = [Float];
nfuzion.message.leap.LetZoom.fingerCountType = [Int];
nfuzion.message.media.type.Item.titleType = [String];
nfuzion.message.media.type.Item.typeType = [nfuzion.message.media.type.ItemType];
nfuzion.message.media.type.Item.idType = [Int];
nfuzion.message.media.type.Item.playableType = [Bool];
nfuzion.message.media.type.Item.artUrlType = [String];
nfuzion.message.media.type.Item.artFileType = [String];
nfuzion.message.media.type.Item.lengthType = [Int];
nfuzion.message.media.type.Item.albumType = [String];
nfuzion.message.media.type.Item.artistType = [String];
nfuzion.message.media.type.Item.genreType = [String];
nfuzion.message.media.type.Item.composerType = [String];
nfuzion.message.media.type.Item.albumTrackNumberType = [Int];
nfuzion.message.media.templates.LetPartialMediaList.offsetType = [Int];
nfuzion.message.media.templates.LetPartialMediaList.dataType = [Array,nfuzion.message.media.type.Item];
nfuzion.message.navigation.type.StepData.distanceType = [Float];
nfuzion.message.navigation.type.StepData.turnType = [String];
nfuzion.message.navigation.type.StepData.targetType = [nfuzion.message.navigation.type.TargetType];
nfuzion.message.navigation.type.StepData.streetType = [String];
nfuzion.message.navigation.type.StepData.destinationType = [String];
nfuzion.message.navigation.type.StepData.isLastStepType = [Bool];
nfuzion.message.navigation.type.StepData.isLastLegType = [Bool];
nfuzion.message.navigation.LetNextTurn.nextTurnType = [nfuzion.message.navigation.type.StepData];
nfuzion.message.navigation.type.SerializablePoint.xType = [Float];
nfuzion.message.navigation.type.SerializablePoint.yType = [Float];
nfuzion.message.navigation.type.Step.distanceType = [Float];
nfuzion.message.navigation.type.Step.startingPointType = [nfuzion.message.navigation.type.SerializablePoint];
nfuzion.message.navigation.type.Step.endingPointType = [nfuzion.message.navigation.type.SerializablePoint];
nfuzion.message.navigation.type.Step.trackType = [Array,nfuzion.message.navigation.type.SerializablePoint];
nfuzion.message.navigation.type.Step.textType = [String];
nfuzion.message.navigation.type.Step.typeType = [nfuzion.message.navigation.type.TransitType];
nfuzion.message.navigation.type.Leg.distanceType = [Float];
nfuzion.message.navigation.type.Leg.startingPointType = [nfuzion.message.navigation.type.SerializablePoint];
nfuzion.message.navigation.type.Leg.endingPointType = [nfuzion.message.navigation.type.SerializablePoint];
nfuzion.message.navigation.type.Leg.stepsType = [Array,nfuzion.message.navigation.type.Step];
nfuzion.message.navigation.type.Waypoint.nameType = [String];
nfuzion.message.navigation.type.Waypoint.addressType = [String];
nfuzion.message.navigation.type.Waypoint.xType = [Float];
nfuzion.message.navigation.type.Waypoint.yType = [Float];
nfuzion.message.navigation.type.Route.markersType = [Array,nfuzion.message.navigation.type.Waypoint];
nfuzion.message.navigation.type.Route.legsType = [Array,nfuzion.message.navigation.type.Leg];
nfuzion.message.navigation.type.Route.distanceType = [Float];
nfuzion.message.navigation.LetRoute.routeType = [nfuzion.message.navigation.type.Route];
nfuzion.message.navigation.LetWaypoints.waypointsType = [Array,nfuzion.message.navigation.type.Waypoint];
nfuzion.message.navigation.SetAddWaypoint.waypointType = [nfuzion.message.navigation.type.Waypoint];
nfuzion.message.navigation.SetEndByPoint.xType = [Float];
nfuzion.message.navigation.SetEndByPoint.yType = [Float];
nfuzion.message.navigation.SetInsertWaypoint.indexType = [Int];
nfuzion.message.navigation.SetInsertWaypoint.waypointType = [nfuzion.message.navigation.type.Waypoint];
nfuzion.message.navigation.SetRemoveWaypoint.indexType = [Int];
nfuzion.message.navigation.SetRequestNewRoute.typeType = [nfuzion.message.navigation.type.TransitType];
nfuzion.message.navigation.SetStartByPoint.xType = [Float];
nfuzion.message.navigation.SetStartByPoint.yType = [Float];
nfuzion.message.navigation.SetWaypoints.waypointsType = [Array,nfuzion.message.navigation.type.Waypoint];
nfuzion.message.span.LetClientMetadata.nameType = [String];
nfuzion.message.span.LetClientMetadata.clientCatagoryType = [String];
nfuzion.message.span.LetClientMetadata.echoType = [Bool];
nfuzion.message.test.type.Type.testType = [String];
nfuzion.message.test.LetTest.aType = [Array,nfuzion.message.test.type.Type];
nfuzion.message.test.LetTest.bType = [Bool];
nfuzion.message.test.LetTest.cType = [nfuzion.message.test.type.Type];
nfuzion.message.test.LetTest.dType = [String];
nfuzion.message.test.LetTest.eType = [nfuzion.message.test.type.Enum];
nfuzion.message.test.LetTest.fType = [Float];
nfuzion.message.test.LetTest.gType = [Array,Array,Int];
nfuzion.message.vehicle.LetTransmission.stateType = [nfuzion.message.vehicle.type.TransmissionState];
nfuzion.message.vehicle.LetTurnSignal.stateType = [nfuzion.message.vehicle.type.TurnSignalState];
nfuzion.message.vehicle.LetWelcome.titleType = [String];
nfuzion.message.vehicle.LetWelcome.subtitleType = [String];
nfuzion.moduleLink.event.LeapEvent.CURSOR = "leapCursor";
nfuzion.moduleLink.event.LeapEvent.GESTURE = "leapGesture";
nfuzion.moduleLink.event.LeapEvent.ROTATE = "leapRotate";
nfuzion.moduleLink.event.LeapEvent.SCROLL = "leapScroll";
nfuzion.moduleLink.event.LeapEvent.POKE = "leapPoke";
nfuzion.moduleLink.event.LeapEvent.ZOOM = "leapZoom";
nfuzion.moduleLink.event.MagicScrollEvent.SCROLL = "scroll";
nfuzion.moduleLink.event.MediaPlayerEvent.AUDITION_PERIOD = "auditionPeriod";
nfuzion.moduleLink.event.MediaPlayerEvent.BROWSE_ITEMS = "browseItems";
nfuzion.moduleLink.event.MediaPlayerEvent.BROWSE_PATH = "browsePath";
nfuzion.moduleLink.event.MediaPlayerEvent.CURRENT_DEVICE = "currentDevice";
nfuzion.moduleLink.event.MediaPlayerEvent.CURRENT_ITEM = "currentItem";
nfuzion.moduleLink.event.MediaPlayerEvent.DEVICES = "devices";
nfuzion.moduleLink.event.MediaPlayerEvent.PLAY_ITEMS = "playItems";
nfuzion.moduleLink.event.MediaPlayerEvent.PLAY_PATH = "playPath";
nfuzion.moduleLink.event.MediaPlayerEvent.TRANSPORT_POSITION = "transportPosition";
nfuzion.moduleLink.event.MediaPlayerEvent.RANDOM_MODE = "randomMode";
nfuzion.moduleLink.event.MediaPlayerEvent.REPEAT_MODE = "repeatMode";
nfuzion.moduleLink.event.MediaPlayerEvent.SEEK_SPEED = "seekSpeed";
nfuzion.moduleLink.event.MediaPlayerEvent.SKIP_THRESHOLD = "skipThreshold";
nfuzion.moduleLink.event.MediaPlayerEvent.TRANSPORT_ACTION = "transportAction";
nfuzion.moduleLink.event.MediaPlayerEvent.BROWSE_ALPHA_INDEX = "browseAlphaIndex";
nfuzion.moduleLink.event.ModuleLinkEvent.READY = "ready";
nfuzion.moduleLink.event.NavigationEvent.NAVIGATION_TURN = "navigationTurn";
nfuzion.moduleLink.event.NavigationEvent.NAVIGATION_ROUTE = "navigationRoute";
nfuzion.moduleLink.event.NavigationEvent.NAVIGATION_WAYPOINTS = "navigationWaypoints";
nfuzion.moduleLink.event.NavigationEvent.NAVIGATION_DISTANCE = "navigationDistance";
nfuzion.moduleLink.event.NavigationEvent.NAVIGATION_DISTANCE_PERCENTAGE = "navigationDistancePercentage";
nfuzion.moduleLink.event.NavigationEvent.NAVIGATION_DESTINATION = "navigationDestination";
nfuzion.moduleLink.event.NavigationEvent.NAVIGATION_CANCEL = "navigationCancel";
nfuzion.moduleLink.event.VehicleEvent.DRIVER_DOOR_OPEN = "driverDoorOpen";
nfuzion.moduleLink.event.VehicleEvent.DRIVER_SEATED = "driverSeated";
nfuzion.moduleLink.event.VehicleEvent.DOORS_LOCKED = "doorsLocked";
nfuzion.moduleLink.event.VehicleEvent.STARTED = "started";
nfuzion.moduleLink.event.VehicleEvent.WELCOME = "welcome";
nfuzion.moduleLink.event.VehicleEvent.GOODBYE = "goodbye";
nfuzion.moduleLink.event.VehicleEvent.ABS = "abs";
nfuzion.moduleLink.event.VehicleEvent.AIR_BAG = "airBag";
nfuzion.moduleLink.event.VehicleEvent.BATTERY = "battery";
nfuzion.moduleLink.event.VehicleEvent.DISTANCE_TO_EMPTY = "distanceToEmpty";
nfuzion.moduleLink.event.VehicleEvent.EMERGENCY_BRAKE = "emergencyBrake";
nfuzion.moduleLink.event.VehicleEvent.FUEL = "fuel";
nfuzion.moduleLink.event.VehicleEvent.HIGH_BEAM = "highBeam";
nfuzion.moduleLink.event.VehicleEvent.ODOMETER = "odometer";
nfuzion.moduleLink.event.VehicleEvent.OIL = "oil";
nfuzion.moduleLink.event.VehicleEvent.SEAT_BELT = "seatBelt";
nfuzion.moduleLink.event.VehicleEvent.SPEED = "speed";
nfuzion.moduleLink.event.VehicleEvent.TRACTION_CONTROL = "tractionControl";
nfuzion.moduleLink.event.VehicleEvent.TRANSMISSION = "transmission";
nfuzion.moduleLink.event.VehicleEvent.TURN_SIGNAL = "turnSignal";
nfuzion.moduleLink.event.VehicleEvent.WATER_TEMPERATURE = "waterTemperature";
nfuzion.nTactic.event.ScreenEvent.READY = "ready";
nfuzion.nTactic.event.ScreenEvent.SCREEN_OUT_COMPLETE = "screenOutComplete";
nfuzion.nTactic.event.ScreenModelEvent.GOTO = "goto";
nfuzion.nTactic.event.ScreenModelEvent.AFTER_GOTO = "afterGoto";
nfuzion.nTactic.event.ScreenModelEvent.INITIAL_BRANCH_LOADED = "initalBranchLoaded";
nfuzion.nTactic.event.ScreenModelEvent.BRANCH_LOADED = "branchLoaded";
nfuzion.paint.event.PaintEvent.CHANGE = "PaintEvent.change";
nfuzion.physics.Scrolling.FRICTIONAL_ACCELERATION = 500;
nfuzion.physics.Scrolling.VELOCITY_FILTER_COEFFICIENT = 3;
nfuzion.physics.Scrolling.STRETCH_FACTOR = 0.2;
nfuzion.physics.Scrolling.EXTREMITY_ACCELERATION = 20000;
nfuzion.physics.Scrolling.JERK = 200;
nfuzion.physics.Scrolling.VELOCITY_KILL_TIME = 0.1;
nfuzion.physics.Scrolling.EXTREMITY_TYPE = 1;
nfuzion.physics.Scrolling.MINIMUM_INTERVAL = 0.07;
nfuzion.physics.Scrolling.DRAG_THRESHOLD = 15;
nfuzion.physics.Scrolling.HARD = 0;
nfuzion.physics.Scrolling.SOFT = 1;
nfuzion.physics.Scrolling.RUBBER = 2;
nfuzion.physics.event.PhysicsEvent.BEGIN = "PhysicsEvent.begin";
nfuzion.physics.event.PhysicsEvent.CHANGE = "PhysicsEvent.change";
nfuzion.physics.event.PhysicsEvent.END = "PhysicsEvent.end";
nfuzion.sketch.event.SketchEvent.READY = "BuilderEvent.ready";
nfuzion.span.SpanClient.RECONNECT_PERIOD = 1;
nfuzion.span.event.SpanClientEvent.CONNECT = "SpanClientEvent.connect";
nfuzion.span.event.SpanClientEvent.DISCONNECT = "SpanClientEvent.disconnect";
nfuzion.storage.PersistentStorage.STORAGE_EXTENSION = ".record";
nfuzion.storage.event.RecordEvent.CHANGE = "RecordEvent.change";
nfuzion.storage.event.RecordEvent.DELETE = "RecordEvent.delete";
nfuzion.storage.event.StorageEvent.READY = "StorageEvent.ready";
nfuzion.timer.Delay.BIG_NUMBER_NOT_INFINITY = 3.4E+38;
nfuzion.timer.Delay.delays = new Array();
nfuzion.timer.Delay.requestedTimestamps = new Array();
nfuzion.timer.event.TimerEvent.TIMER = "timer";
nfuzion.timer.event.TimerEvent.TIMER_COMPLETE = "timerComplete";
nfuzion.utility.BaseCode32.BASE_32_ENCODINGS = "abcdefghijklmnopqrstuvwxyz234567";
nfuzion.utility.CharacterTools.CODE_0 = HxOverrides.cca("0",0);
nfuzion.utility.CharacterTools.CODE_9 = HxOverrides.cca("9",0);
nfuzion.utility.CharacterTools.CODE_A = HxOverrides.cca("A",0);
nfuzion.utility.CharacterTools.CODE_Z = HxOverrides.cca("Z",0);
nfuzion.utility.CharacterTools.CODE_a = HxOverrides.cca("a",0);
nfuzion.utility.CharacterTools.CODE_z = HxOverrides.cca("z",0);
nfuzion.widget.Chain.MOVE_THRESHOLD = 15;
nfuzion.widget.Chain.VELOCITY_THRESHOLD = 2;
nfuzion.widget.Scroller.REPORT_PERIOD = 0;
nfuzion.widget.Scroller.ROUND_VALUES = false;
nfuzion.widget.Scroller.POPUP_PAGE_THRESHOLD = 5;
nfuzion.widget.Scroller.SENSITIVE_TRACK = true;
nfuzion.widget.Scroller.HIDE_IF_USELESS = false;
nfuzion.widget.event.ButtonEvent.ACTIVE_CHANGE = "ButtonEvent.activeChange";
nfuzion.widget.event.ButtonEvent.AUTO_CLICK = "ButtonEvent.autoClick";
nfuzion.widget.event.ButtonEvent.CLICK = "ButtonEvent.click";
nfuzion.widget.event.ButtonEvent.DOWN = "ButtonEvent.down";
nfuzion.widget.event.ButtonEvent.LONG_PRESS = "ButtonEvent.longPress";
nfuzion.widget.event.ButtonEvent.TOGGLE = "ButtonEvent.toggle";
nfuzion.widget.event.ButtonEvent.UP = "ButtonEvent.up";
nfuzion.widget.event.ButtonEvent.CANCEL = "ButtonEvent.cancel";
nfuzion.widget.event.ChainEvent.SELECT = "ChainEvent.select";
nfuzion.widget.event.ListEvent.LENGTH = "ListEvent.length";
nfuzion.widget.event.ScrollerEvent.VERTICAL_POSITION = "ScrollerEvent.verticalPosition";
nfuzion.widget.event.ScrollerEvent.HORIZONTAL_POSITION = "ScrollerEvent.horizontalPosition";
nfuzion.widget.event.ScrollerEvent.POSITION = "ScrollerEvent.position";
nfuzion.widget.event.ScrollerEvent.GRAB = "ScrollerEvent.grab";
nfuzion.widget.event.ScrollerEvent.RELEASE = "ScrollerEvent.release";
nfuzion.widget.event.WidgetEvent.VISIBILITY = "WidgetEvent.visibility";
nfuzion.widget.event.WidgetEvent.SELECT = "WidgetEvent.select";
nfuzion.widget.type.ItemWidget.NULL_DATA_INDEX = -35535;
nfuzion.widget.type.ItemWidget.INVALID_DATA_INDEX = -35534;
peripheral.Peripheral.initialized = false;
screen.Cluster.ALPHA_TWEEN_PERIOD = 0.75;
screen.SpanConfigPopup.FILL_PERCENT = .9;
screen.SpanConfigPopup.PRIMARY_FONT_PATH = "./fonts/GillSansLight.ttf";
screen.SpanConfigPopup.SYMBOL_FONT_PATH = "./fonts/Symbols.ttf";
screen.SpanConfigPopup.keyLayouts = [["a","b","c","d","e","f","g","7","8","9","h","i","j","k","l","m","n","4","5","6","o","p","q","r","s","t","u","1","2","3","v","w","x","y","z","-",":","/","0","."],["1","2","3","4","5","6","7","8","9","0","q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l",":","z","x","c","v","b","n","m","-",".","/"],["1","2","3","4","5","6","7","8","9","0",":","/",".","p","y","f","g","c","r","l","a","o","e","u","i","d","h","t","n","s","-","q","j","k","x","b","m","w","v","z"]];
Main.main();
})();
