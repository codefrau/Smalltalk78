module('users.bert.St78.vm').requires().toRun(function() {
/*
 * Copyright (c) 2013 Bert Freudenberg
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


NoteTaker = {
	OTI_NIL: 0,
	OTI_FALSE: 4,
	OTI_TRUE: 8,
	OTI_THEPROCESS: 0xc,
	OTI_SMALLTALK: 0x10,
	OTI_FIRST_SEL: 0x14,
	OTI_LAST_SEL: 0x9c,
	OTI_ERROR_SEL: 0x9c,
	OTI_USTABLE: 0xa0,

	// known classes
	OTI_CLCLASS: 0x40,
	OTI_CLINTEGER: 0x80,	// class of SmallIntegers
	OTI_CLSTRING: 0xc0,
	OTI_CLVECTOR: 0x100,
	OTI_CLSTREAM: 0x140,
	OTI_CLFLOAT: 0x180,
	OTI_CLPROCESS: 0x1c0,
	OTI_CLREMOTECODE: 0x200,
	OTI_CLPOINT: 0x240,
	OTI_CLNATURAL: 0x280,
	OTI_CLLARGEINTEGER: 0x2c0,
    OTI_CLUNIQUESTRING: 0x340,
    OTI_CLCOMPILEDMETHOD: 0x3C0,
    OTI_CLVLENGTHCLASS: 0x1380,

	// CLCLASS layout:
	PI_CLASS_TITLE: 0,
	PI_CLASS_MYINSTVARS: 1,
	PI_CLASS_INSTSIZE: 2,
	PI_CLASS_MDICT: 3,
	PI_CLASS_CLASSVARS: 4,
	PI_CLASS_SUPERCLASS: 5,
	PI_CLASS_ENVIRONMENT: 6,
	
	// CLSTREAM layout:
	PI_STREAM_ARRAY: 0,
	PI_STREAM_POSITION: 1,
	PI_STREAM_LIMIT: 2,
	
	// CLPROCESS layout:
	PI_PROCESS_MINSIZE: 0,		// THEPROCESS: 128
	PI_PROCESS_HWM: 1,			// THEPROCESS: 0
	PI_PROCESS_TOP: 2,			// THEPROCESS: 7
	PI_PROCESS_RESTARTCODE: 3,	// THEPROCESS: NIL
	PI_PROCESS_STACK: 4,		// THEPROCESS: NIL
	PN_PROCESS: 5,   	    	// number of fixed pointers
	
	// CLREMOTECODE layout:
	PI_RCODE_FRAMEOFFSET: 0,
	PI_RCODE_STARTINGPC: 1,
	PI_RCODE_PROCESS: 2,
	PI_RCODE_STACKOFFSET: 3,
	
	// CLHASHSET layout:
	PI_HASHSET_OBJECTS: 0,
	
	// CLDICTIONARY layout:
	PI_DICTIONARY_OBJECTS: 0,
	PI_DICTIONARY_VALUES: 1,
	
	// CLSYMBOLTABLE layout:
	PI_SYMBOLTABLE_OBJECTS: 0,
	PI_SYMBOLTABLE_VALUES: 1,
	
	// CLMESSAGEDICT layout:
	PI_MESSAGEDICT_OBJECTS: 0,
	PI_MESSAGEDICT_METHODS: 1,
	
	// CLOBJECTREFERENCE layout:
	PI_OBJECTREFERENCE_VALUE: 0,
	
	// CLCOMPILEDMETHOD layout:
	BI_COMPILEDMETHOD_FIRSTLITERAL: 2,	// past method header
	
	// CLPOINT layout:
	PI_POINT_X: 0,
	PI_POINT_Y: 1,
	
	// CLLARGEINTEGER layout:
	PI_LARGEINTEGER_BYTES: 0,
	PI_LARGEINTEGER_NEG: 1,
	
	// CLBITBLT layout:
	PI_BITBLT_FUNCTION: 0,
	PI_BITBLT_GRAY: 1,
	PI_BITBLT_DESTBITS: 2,
	PI_BITBLT_DESTRASTER: 3,
	PI_BITBLT_DESTX: 4,
	PI_BITBLT_DESTY: 5,
	PI_BITBLT_WIDTH: 6,
	PI_BITBLT_HEIGHT: 7,
	PI_BITBLT_SOURCEBITS: 8,
	PI_BITBLT_SOURCERASTER: 9,
	PI_BITBLT_SOURCEX: 10,
	PI_BITBLT_SOURCEY: 11,
	PI_BITBLT_CLIPX: 12,
	PI_BITBLT_CLIPY: 13,
	PI_BITBLT_CLIPWIDTH: 14,
	PI_BITBLT_CLIPHEIGHT: 15,
	PI_BITBLT_SOURCEFIELD: 16,
	PI_BITBLT_DESTFIELD: 17,
	PI_BITBLT_SOURCE: 18,
	PI_BITBLT_DEST: 19,
	
	// CLFORM layout:
	PI_FORM_EXTENT: 0,
	PI_FORM_BITS: 1,
	// also: offset figure ground
	
	// runtime indices and offsets:
	
	// process frame layout (off BP):
	FI_FIRST_TEMP: -1,
	// nominal stack frame contains six items, as follow:
	FI_SAVED_BP: 0,
	FI_CALLER_PC: 1,
	FI_NUMARGS: 2,
	FI_METHOD: 3,
	FI_MCLASS: 4,
	FI_RECEIVER: 5,	// top stack item in previous frame
	// 
	FI_LAST_ARG: 6,	// stack item in previous frame
	//
	F_FRAMESIZE: 5,	// don't count args nor receiver...
	
	// Class instSize format (assuming untagged integer!):
	FMT_HASPOINTERS: 0x4000,
	FMT_HASWORDS: 0x2000,
	FMT_ISVARIABLE: 0x1000,
	FMT_BYTELENGTH: 0x07ff,

    // Ints
    MAX_INT:  0x3FFF,
    MIN_INT: -0x4000,
    NON_INT: -0x5000, // non-small and neg (so non pos16 too)

    // Event constants
    Mouse_Blue: 1,
    Mouse_Yellow: 2,
    Mouse_Red: 4,
    Keyboard_Shift: 8,
    Keyboard_Ctrl: 16,
    Keyboard_Alt: 32,
    Keyboard_Cmd: 64,
    Mouse_All: 1 + 2 + 4,
    Keyboard_All: 8 + 16 + 32 + 64,
};

Object.subclass('users.bert.St78.vm.ImageReader',
'about', {
    aboout: function() {
/*
ot is the object table, a sequence of 4-byte entries, retrievable by this.otAt(oop), where oop is an object pointer with the bottom two bits = 0.  The entry encodes the data address, along with some other bits including a reference count that we can now ignore.  The method dataAddress(oop) will retrieve the address, also taking into account the "dataBias" which I won't explain.

data is the object data space, a sequence of 2-byte words, retrievable by this.fieldOfObject(i, oop), where oop is an object pointer with the bottom two bits = 0, and i is the instance field number, with 1 being the index of the first field.  An index of 0 would retrieve the class pointer of an object, but this must be masked by 0xFFC0 because the bottom 6 bits of the class word are used for the object's size in bytes.  The method classOfOop will do this for you.  This implies that all class oops have zero in the bottom 6 bits.  This worked out nicely for OOZE's zones, but we will drop all that and go to the Squeak object format or whatever Bert is using internally.  Note that if the size field is zero, then there is a word before the class with a 16-bit length.  The method lengthBitsAt decodes this for you.  It appears that the size field is the size in bytes, including the class(and size), so a string of length 1 has size=3, and a Point would have a size = 6.  

The format of classes is (quoting from the system itself...
    title	"<String> for identification, printing"
    myinstvars "<String> partnames for compiling, printing"
    instsize "<Integer> for storage management"
    messagedict "<MessageDict> for communication, compiling"
    classvars "<Dictionary/nil> compiler checks here"
    superclass "<Class> for execution of inherited behavior"
    environment "<Vector of SymbolTables> for external refs"
    fieldtype
The instsize is an integer (ie low bit = 1) with the following interpretation:
    0x8000 - fields are pointers, else not
    0x4000 - fields are words, else bytes
    0x2000 - instances are variable length
    0x0FFE - instance size in words including class
    Thus Point has instsize = 0x8006 and Float has instsize = 04008 (nasty 3-word binary format)
*/
    },
},
'initialize', {
    initialize: function(objTable, objSpace, bias) {
        this.ot = objTable;
        this.data = objSpace;
        this.dataBias = bias;
    }
},
'reading', {
    readObjects: function() {
        // create js objects for the st78 objects in ot+data
        var oopMap = {};
        for (var oop = 0; oop < this.ot.length; oop += 4)
            if (this.refCountOf(oop))
                oopMap[oop] = new users.bert.St78.vm.Object(oop);
        for (var oop in oopMap)
            oopMap[oop].installFromImage(this, oopMap);
        return oopMap;
    }
}, 
'object access', {
    otAt: function(oop) {
        // Return the OT entry for the given oop
        // Decode two two-byte numbers into one 32-bit number
        var i = oop;
        var val = 0;
        val = this.ot[i+1];
        val = val*256 + this.ot[i];
        val = val*256 + this.ot[i+3];
        val = val*256 + this.ot[i+2];
        return val;
    },
    dataAddress: function(oop) {
        var entry = this.otAt(oop);
        return (entry&0xFFFF) * 16 + ((entry>>16)&0x1E) - this.dataBias;
    },
    fieldOfObject: function(i, oop) { 
        // i = 1 for first field after class
    	var addr = this.dataAddress(oop);
    	var a = addr+(2*i);
    	return this.data[a+1]*256 + this.data[a];
    },
    classOfOop: function(oop) {
        return this.fieldOfObject(0, oop) & 0xFFC0;
    },
    refCountOf: function (oop) {
        return this.otAt(oop) >>> 24;
    },
    integerValueOf: function(oop) {
        var val = oop>>1;
        return (val&0x3FFF) - (val&0x4000);
    },
    isInteger: function(oop) {
        return oop & 1;
    },
    lengthBitsAtAddr: function(addr) {
    	var len = this.data[addr] & 0x3F;
    	if (len > 0) return len;
    	return this.data[addr-1] * 256 + this.data[addr-2];
    },
});

Object.subclass('users.bert.St78.vm.Image',
'about', {
    about: function() {
    /*
    Object Format
    =============
    Each St78 object is a users.bert.St78.vm.Object, only SmallIntegers are JS numbers.
    Instance variables/fields reference other objects directly via the "pointers" property.
    {
        stClass: reference to class object
        pointers: (optional) Array referencing inst vars + indexable fields
        words: (optional) Array of numbers (words)
        bytes: (optional) Array of numbers (bytes)
        float: (optional) float value if this is a Float object
        isNil: (optional) true if this is the nil object
        isTrue: (optional) true if this is the true object
        isFalse: (optional) true if this is the false object
        isFloat: (optional) true if this is a Float object
        isFloatClass: (optional) true if this is the Float class
        oop: unique integer
        mark: boolean (used only during GC, otherwise false)
        nextObject: linked list of objects in old space (new space objects do not have this yet)
    }

    Object Table
    ============
    Used for enumerating objects and GC.

    */    
    }
},
'initializing', {
    initialize: function(objTable, objSpace, dataBias, name) {
        this.name = name;
        this.totalMemory = 1000000; 
        this.gcCount = 0;
        this.oldSpaceCount = 0;
        this.newSpaceCount = 0;
        this.oldSpaceBytes = 0;
        var reader = new users.bert.St78.vm.ImageReader(objTable, objSpace, dataBias);
        var oopMap = reader.readObjects();
        // link all objects into oldspace
        var prevObj;
        for (var oop = 0; oop < objTable.length; oop += 4)
            if (oopMap[oop]) {
                this.oldSpaceCount++;
                this.oldSpaceBytes += oopMap[oop].totalBytes();
                if (prevObj) prevObj.nextObject = oopMap[oop];
                prevObj = oopMap[oop];
            }
        this.firstOldObject = oopMap[0];
        this.lastOldObject = prevObj;
        this.lastOop = prevObj.oop; // might want an oop recycling scheme later
        this.initKnownObjects(oopMap);
        this.initCompiledMethods(oopMap);
    },
    initKnownObjects: function(oopMap) {
        oopMap[NoteTaker.OTI_NIL].isNil = true;
        oopMap[NoteTaker.OTI_TRUE].isTrue = true;
        oopMap[NoteTaker.OTI_FALSE].isFalse = true;
        this.globals = oopMap[NoteTaker.OTI_SMALLTALK];
        this.userProcess = oopMap[NoteTaker.OTI_THEPROCESS];
        this.specialOopsVector = this.globalNamed('SpecialOops');
    },
    initCompiledMethods: function(oopMap) {
        // make proper pointer objects for literals encoded in bytes
        var cmClass = this.objectFromOop(NoteTaker.OTI_CLCOMPILEDMETHOD, oopMap),
            cm = this.someInstanceOf(cmClass);
        while (cm) {
            cm.methodInitLits(this, oopMap);
            cm = this.nextInstanceAfter(cm);
        }
    },
    globalRefNamed: function(name) {
        var globalNames = this.globals.pointers[NoteTaker.PI_SYMBOLTABLE_OBJECTS].pointers,
            globalValues = this.globals.pointers[NoteTaker.PI_SYMBOLTABLE_VALUES].pointers;
        for (var i = 0; i < globalNames.length; i++) {
            if (globalNames[i].isNil) continue;
            if (name == globalNames[i].bytesAsString())
                return globalValues[i];
        }
    },
    globalNamed: function(name) {
        return this.globalRefNamed(name).pointers[NoteTaker.PI_OBJECTREFERENCE_VALUE];
    },

    objectFromOop: function(oop, optionalOopMap) {
        if (oop & 1) {
            var val = oop >> 1;
            return (val & 0x3FFF) - (val & 0x4000);
        }
        if (optionalOopMap) return optionalOopMap[oop]; // only available at startup
    
        // find the object with the given oop - looks only in oldSpace for now!
        var obj = this.firstOldObject;
        do {
            if (oop === obj.oop) return obj;
            obj = obj.nextObject;
        } while (obj);
        
        debugger;
        throw "oop not found";
    },
    smallifyLargeInts: function() {
        // visit every filed of every object, converting smallable LargeInts to Integers
        // We do this because the normal ST-76 range is +-32K
        var lgIntClass = this.objectFromOop(NoteTaker.OTI_CLLARGEINTEGER),
            obj = this.firstOldObject;
        while (obj) {
            var body = obj.pointers;
            if (body) {
                for (var i=0; i<body.length; i++) {
                    if (body[i].stClass === lgIntClass) {
                        var value = body[i].largeIntegerValue();
                        if (value <= 32767 && value >= -32768) body[i] = value
                    }
                }
            }
            obj = obj.nextObject;
        }
    }

},
'garbage collection', {
    partialGC: function() {
        // no partial GC needed since new space uses the Javascript GC
        return this.totalMemory - this.oldSpaceBytes;
    },
    fullGC: function() {
        // Old space is a linked list of objects - each object has an "nextObject" reference.
        // New space objects do not have that pointer, they are garbage-collected by JavaScript.
        // But they have an allocation id so the survivors can be ordered on tenure.
        // The "nextObject" references are created by collecting all new objects, 
        // sorting them by id, and then linking them into old space.
        // Note: after an old object is released, its "nextObject" ref must still allow traversal
        // of all remaining objects. This is so enumeration works despite GC.

        var newObjects = this.markReachableObjects();
        var removedObjects = this.removeUnmarkedOldObjects();
        this.appendToOldObjects(newObjects);
        this.relinkRemovedObjects(removedObjects);
        this.oldSpaceCount += newObjects.length - removedObjects.length;
        this.newSpaceCount = 0;
        this.gcCount++;
        return this.totalMemory - this.oldSpaceBytes;
    },
    markReachableObjects: function() {
        // Visit all reachable objects and mark them.
        // Return surviving new objects
        var todo = [this.specialObjectsArray, this.vm.activeContext];
        var newObjects = [];
        while (todo.length > 0) {
            var object = todo.pop();
            if (!object.nextObject && object !== this.lastOldObject)       // it's a new object
                newObjects.push(object);
            object.mark = true;           // mark it
            if (!object.sqClass.mark)     // trace class if not marked
                todo.push(object.sqClass);
            var body = object.pointers;
            if (body)                     // trace all unmarked pointers
                for (var i = 0; i < body.length; i++)
                    if (typeof body[i] === "object" && !body[i].mark)      // except SmallInts
                        todo.push(body[i]);
        }
        // sort by id to preserve creation order
        return newObjects.sort(function(a,b){return a.id - b.id});
    },
    removeUnmarkedOldObjects: function() {
        // Unlink unmarked old objects from the nextObject linked list
        // Reset marks of remaining objects
        // Set this.lastOldObject to last old object
        // Return removed old objects (to support finalization later)
        var removed = [];
        var obj = this.firstOldObject;
        while (true) {
            var next = obj.nextObject;
            if (!next) {// we're done
                this.lastOldObject = obj;
                return removed;
            }
            // if marked, continue with next object
            if (next.mark) {
                next.mark = false;     // unmark for next GC
                obj = next;
            } else { // otherwise, remove it
                var corpse = next; 
                obj.nextObject = corpse.nextObject; // drop from list
                this.oldSpaceBytes -= corpse.totalBytes(this.compactClasses);
                removed.push(corpse);               // remember for relinking
                corpse.nextObject = obj;            // kludge: the corpse's nextObject
                // must point into the old space list, so that enumerating will still work,
                // even with a GC in the middle. So we point it to the surviving obj here.
                // However, this would lead to obj being enumerated twice (because it preceded
                // the corpse until now), so we'll relink this later, after the new objects
                // have been tenured
            }
        }
    },
    appendToOldObjects: function(newObjects) {
        // append new objects to linked list of old objects
        // and unmark them
        var oldObj = this.lastOldObject;
        for (var i = 0; i < newObjects.length; i++) {
            var newObj = newObjects[i];
            newObj.mark = false;
            oldObj.nextObject = newObj;
            oldObj = newObj;
            this.oldSpaceBytes += newObj.totalBytes(this.compactClasses);
        }
        this.lastOldObject = oldObj;
    },
    relinkRemovedObjects: function(removed) {
        // fix up the nextObject pointers of removed objects,
        // which were set to the preceding object in removeUnmarkedOldObjects()
        for (var i = 0; i < removed.length; i++)
            removed[i].nextObject = removed[i].nextObject.nextObject;
    },
},
'creating', {
    newOop: function() {
        this.newSpaceCount++;
        return this.lastOop += 4;
    },
    instantiateClass: function(aClass, indexableSize, filler) {
        var newObject = new users.bert.St78.vm.Object(this.newOop());
        newObject.initInstanceOf(aClass, indexableSize, filler);
        return newObject;
    },
    clone: function(object) {
        var newObject = new users.bert.St78.vm.Object(this.newOop());
        newObject.initAsClone(object);
        return newObject;
    },
},
'operations', {
    bulkBecome: function(fromArray, toArray, twoWay) {
        var n = fromArray.length;
        if (n !== toArray.length)
            return false;
        var mutations = {};
        for (var i = 0; i < n; i++) {
            var obj = fromArray[i];
            if (!obj.sqClass) return false;  //non-objects in from array
            if (mutations[obj.id]) return false; //repeated oops in from array
            else mutations[obj.id] = toArray[i];
        }
        if (twoWay) for (var i = 0; i < n; i++) {
            var obj = toArray[i];
            if (!obj.sqClass) return false;  //non-objects in to array
            if (mutations[obj.id]) return false; //repeated oops in to array
            else mutations[obj.id] = fromArray[i];
        }
        // ensure new objects have nextObject pointers
        if (this.newSpaceCount > 0)
            this.fullGC();
        // Now, for every object...
        var obj = this.firstOldObject;
        while (obj) {
            // mutate the class
            var mut = mutations[obj.sqClass.id];
            if (mut) obj.sqClass = mut;
            // and mutate body pointers
            var body = obj.pointers;
            if (body) for (var j = 0; j < body.length; j++) {
                mut = mutations[body[j].id];
                if (mut) body[j] = mut;
            }
            obj = obj.nextObject;
        }
        this.vm.flushMethodCacheAfterBecome(mutations);
        return true;
    },
    someInstanceOf: function(clsObj) {
        var obj = this.firstOldObject;
        while (true) {
            if (obj.stClass === clsObj)
                return obj;
            if (!obj.nextObject) {
                // this was the last old object, tenure new objects and try again
                if (this.newSpaceCount > 0) this.fullGC();
                // if this really was the last object, we're done
                if (!obj.nextObject) return null;
            }
            obj = obj.nextObject;
        }
    },
    objectAfter: function(obj) {
        // if this was the last old object, tenure new objects and try again
        if (!obj.nextObject && this.newSpaceCount > 0)
            this.fullGC();
        return obj.nextObject;
    },
    nextInstanceAfter: function(obj) {
        var clsObj = obj.stClass;
        while (true) {
            if (!obj.nextObject) {
                // this was the last old object, tenure new objects and try again
                if (this.newSpaceCount > 0) this.fullGC();
                // if this really was the last object, we're done
                if (!obj.nextObject) return null;
            }
            obj = obj.nextObject;
            if (obj.stClass === clsObj)
                return obj;
        }
    },
},
'debugging',
{
    variableClasses: function() {
        // enumerate classes to find all classes flagged as indexable in their instSize
        // this.variableClasses()
        var clClass = this.objectFromOop(NoteTaker.OTI_CLCLASS),
            cl = this.someInstanceOf(clClass),
            result = [];
        while (cl) {
            if ((cl.pointers[NoteTaker.PI_CLASS_INSTSIZE] & NoteTaker.FMT_ISVARIABLE) > 0) result.push(cl);
            cl = this.nextInstanceAfter(cl);
        };
        return result
    },
    largeInts: function() {  // this.largeInts()
        // enumerate largeIntegers
        var cl = this.objectFromOop(NoteTaker.OTI_CLLARGEINTEGER),
            large = this.someInstanceOf(cl),
            result = [];
        while (large) {
            result.push(large.largeIntegerValue());
            large = this.nextInstanceAfter(large);
            }
        return result
    },

    labelObjRefs: function() {
        // label object refs with their keys in all symbol tables
        var tableClass = this.globalNamed('SymbolTable'),
            table = this.someInstanceOf(tableClass);
        while (table) {
            table.symbolTableLabelObjRefs();
            table = this.nextInstanceAfter(table);
        }
    },
});

Object.subclass('users.bert.St78.vm.Object',
'initialization', {
    initialize: function(oop) {
        this.oop = oop;
    },
    installFromImage: function(image, oopMap) {
        var entry = image.otAt(this.oop);
        var addr = image.dataAddress(this.oop);
        var classOop = image.classOfOop(this.oop);
        this.stClass = oopMap[classOop];
        var instSize = image.fieldOfObject(3, classOop) >> 1;
        var objBytes = instSize & NoteTaker.FMT_ISVARIABLE
            ? image.lengthBitsAtAddr(addr) : instSize & NoteTaker.FMT_BYTELENGTH;
        if (objBytes <= 2) return; // only class
        if (instSize & NoteTaker.FMT_HASPOINTERS) { // pointers
            this.pointers = [];
            for (var i = 1; i < objBytes/2; i++) {
                var oop = image.fieldOfObject(i, this.oop);
                var obj = image.isInteger(oop) ? image.integerValueOf(oop) : oopMap[oop];
                this.pointers.push(obj);
            }
        } else if (instSize & NoteTaker.FMT_HASWORDS) { // words
            this.words = [];
            for (var i = 1; i < objBytes/2; i++) {
                var word = image.fieldOfObject(i, this.oop);
                this.words.push(word);
            }
        } else { // bytes
            this.bytes = [];
            for (var i = 2; i < objBytes; i++) {
                var byte = image.data[addr + i];
                this.bytes.push(byte);
            }
        }
    },
    initInstanceOf: function(aClass, indexableSize, filler) {
        this.stClass = aClass;
        var instSpec = aClass.pointers[NoteTaker.PI_CLASS_INSTSIZE];

        if (instSpec & NoteTaker.FMT_HASPOINTERS) {
            var instSize = ((instSpec & NoteTaker.FMT_BYTELENGTH) >> 1) - 1; // words, sans header
            if (instSize + indexableSize > 0)
                this.pointers = this.fillArray(instSize + indexableSize, filler);
        } else
            if (indexableSize > 0)
                if (instSpec & NoteTaker.FMT_HASWORDS)
                    this.words = this.fillArray(indexableSize, 0);
                else
                    this.bytes = this.fillArray(indexableSize, 0); //Methods require further init of pointers
    },
    fillArray: function(length, filler) {
        for (var array = [], i = 0; i < length; i++)
            array[i] = filler;
        return array;
    },
},
'accessing', {
    pointersSize: function() {
    	return this.pointers ? this.pointers.length : 0;
    },
    bytesSize: function() {
        return this.bytes ? this.bytes.length : 0;
    },
    wordsSize: function() {
        return this.words ? this.words.length : 0;
    },
    bytesAsString: function(maxLength) {
        if (!this.bytes) return '';
        var bytes = this.bytes; // can be Uint8Array
        var n = bytes.length;
        if (maxLength && maxLength < n) n = maxLength;
        var chars = [];
        for (var i = 0; i < n; i++)  {
            var char = bytes[i];
            chars.push(char == 95 ? '←' : char >= 32 ? String.fromCharCode(char)
                : '␀≤␂▹␄␅≡◦␈\x09◢␋␌\x0A≠↪␐↑≥ⓢ◣¬∢⌾▱␙␚⇒␜␝␞␟'[char]);
        }
        var string = chars.join('');
        if (n < bytes.length)
            string += '…';
        return string;
    },
    totalBytes: function() { // size in bytes this object would take up in image snapshot
        var nWords =
            this.words ? this.words.length :
            this.pointers ? this.pointers.length : 0;
        if (this.bytes) nWords += (this.bytes.length + 1) / 2 | 0; 
        var headerWords = 3; // class + size if variable?
        return (headerWords + nWords) * 2;
    },
},
'as class', {
    isClass: function() {
        return this.stClass.oop === NoteTaker.OTI_CLCLASS
            || this.stClass.oop === NoteTaker.OTI_CLVLENGTHCLASS;
    },
    superclass: function() {
        return this.pointers[NoteTaker.PI_CLASS_SUPERCLASS];
    },
    classInstSize: function() {
        // number of vars in my instances
        var instSpec = this.pointers[NoteTaker.PI_CLASS_INSTSIZE];
        if (instSpec & NoteTaker.FMT_HASPOINTERS)
            return ((instSpec & NoteTaker.FMT_BYTELENGTH) >> 1) - 1; // words, sans header
        return 0;
    }
},
'debugging', {
    toString: function() {
        return Strings.format('stObj(%s)',
            this.stClass.constructor == users.bert.St78.vm.Object ? this.stInstName() : this.stClass);
    },
    largeIntegerValue: function() {
        // Return numeric value of a LargeInteger
        var nat = this.pointers[NoteTaker.PI_LARGEINTEGER_BYTES],
            value = 0;
        for (var i=0; i<nat.bytes.length; i++) value = value*256 + nat.bytes[nat.bytes.length - (i+1)];
        if (this.pointers[NoteTaker.PI_LARGEINTEGER_NEG].isTrue) value = - value;
        return value
    },

    className: function() {
        var classNameObj = this.pointers[NoteTaker.PI_CLASS_TITLE];
        if (!classNameObj.stClass) return "???";
        return classNameObj.bytesAsString();
    },
    stInstName: function(maxLength) {
        if (!this.stClass || !this.stClass.pointers) return "???";
        if (this.oop === NoteTaker.OTI_NIL) return "nil";
        if (this.oop === NoteTaker.OTI_FALSE) return "false";
        if (this.oop === NoteTaker.OTI_TRUE) return "true";
        if (this.isClass()) return "the " + this.className() + " class";
        if (this.stClass.oop === NoteTaker.OTI_CLSTRING) return "'" + this.bytesAsString(maxLength||16) + "'";
        if (this.stClass.oop === NoteTaker.OTI_CLUNIQUESTRING) return "#" + this.bytesAsString(maxLength||16);
        var className = this.stClass.className();
        return (/^[aeiou]/i.test(className) ? 'an ' : 'a ') + className;
    },
    slotNameAt: function(index) {
        // one-based index
        var vars = this.stClass.allInstVarNames();
        return index <= vars.length ? vars[index - 1] : index.toString();
    },
    allInstVarNames: function() {
        var superclass = this.superclass();
        var vars = superclass.isNil ? [] : superclass.allInstVarNames();
        var string = this.pointers[1].bytesAsString();
        // remove comments, make comma-separated
        string = string.replace(/"[^"]*"/g, ' ').replace(/\s+/g, ',').replace(/,$/, '');
        if (string.length)
            vars = vars.concat(string.split(','));
        return vars;
    } 
},
'as method', {
    methodInitLits: function(image, optionalOopMap) {
        // make literals encoded as oops available as proper pointer objects
        var numLits = this.methodNumLits();
        if (numLits) {
            var lits = [],
                bytesPtr = 2; // skip header word
            for (var i = 0; i < numLits; i++) {
                var oop = this.bytes[bytesPtr++] + 256 * this.bytes[bytesPtr++];
                lits.push(image.objectFromOop(oop, optionalOopMap));
            }
            this.pointers = lits;
        }
    },
    methodIsQuick: function() {
        return this.bytes[1] === 128;
    },
    methodQuickIndex: function() {
        return this.bytes[0];
    },
    methodNumLits: function() {
        if (this.methodIsQuick()) return 0;
        return ((this.bytes[1] & 126) - 4) / 2;
    },
    methodNumArgs: function() {
        return this.bytes[0] & 15;
    },
    methodNumTemps: function() {
        if (this.methodIsQuick()) return 0;
        return ((this.bytes[1] & 1) << 4) + (this.bytes[0] >> 4);
    },
    methodPrimitiveIndex: function() {
        if (this.bytes[1] <= 128) return 0;
        return this.pointers[this.methodNumLits() - 1];
    },
    methodGetLiteral: function(zeroBasedIndex) {
        return this.pointers[zeroBasedIndex];
    },
    methodStartPC: function() {
        if (this.methodIsQuick()) return 0; 
        return (this.bytes[1] & 126) - 2; // zero-based
    },
    methodEndPC: function() {
        if (this.methodIsQuick()) return 0; 
        return this.bytes.length;
    },
},
'as symbol table', {
    symbolTableLabelObjRefs: function(objRef) {
        var tableValues = this.pointers[NoteTaker.PI_SYMBOLTABLE_VALUES].pointers;
        for (var i = 0; i < tableValues.length; i++)
            if (!tableValues[i].isNil)
                // cache in objRef's stInstName() function
                (function(table, i){
                    tableValues[i].stInstName = function() {
                        if (this === table.symbolTableRefAtIndex(i))
                            return 'objref ' + table.symbolTableKeyAtIndex(i).bytesAsString();
                        delete this.stInstName; // cache is invalid
                        return 'objref ' + this.oop;
                    };
                })(this, i);
    },
    symbolTableKeyAtIndex: function(i) {
        return this.pointers[NoteTaker.PI_SYMBOLTABLE_OBJECTS].pointers[i];
    },
    symbolTableRefAtIndex: function(i) {
        return this.pointers[NoteTaker.PI_SYMBOLTABLE_VALUES].pointers[i];
    },
});

Object.subclass('users.bert.St78.vm.Interpreter',
'initialization', {
    initialize: function(image, display) {
        console.log('st78: initializing interpreter');
        this.image = image;
        this.image.vm = this;
        this.initConstants();
        this.primHandler = new users.bert.St78.vm.Primitives(this, display);
        this.loadImageState();
        this.initVMState();
        this.loadInitialContext();
        console.log('st78: interpreter ready');
    },
    initConstants: function() {
        this.millisecondClockMask = NoteTaker.MAX_INT >> 1; //keeps ms logic in small int range
    },
    loadImageState: function() {
        this.specialObjects = this.image.specialOopsVector.pointers;
        this.specialSelectors = range(9, 40).map(
            function(ix) {return this.specialObjects[ix]}, this);
        // Note this could be computed by counting non-alpha characters in each selector...
        this.specialNargs = [
            1, 1, 1, 1, 1, 1, 1, 1,   1, 1, 1, 1, 1, 1, 1, 1, 
            1, 2, 0, 1, 0, 1, 1, 1,   0, 0, 0, 0, 1, 0, 0, 0 ];
        this.nilObj = this.image.objectFromOop(NoteTaker.OTI_NIL);
        this.falseObj = this.image.objectFromOop(NoteTaker.OTI_FALSE);
        this.trueObj = this.image.objectFromOop(NoteTaker.OTI_TRUE);
        this.integerClass = this.image.objectFromOop(NoteTaker.OTI_CLINTEGER);
        this.classClass = this.image.objectFromOop(NoteTaker.OTI_CLCLASS);
    },
    initVMState: function() {
        this.byteCodeCount = 0;
        this.sendCount = 0;
        this.doSuper = false;
        this.interruptCheckCounter = 0;
        this.interruptCheckCounterFeedBackReset = 1000;
        this.interruptChecksEveryNms = 3;
        this.nextPollTick = 0;
        this.nextWakeupTick = 0;
        this.lastTick = 0;
        this.interruptKeycode = 2094;  //"cmd-."
        this.interruptPending = false;
        //this.semaphoresToSignal = [];
        //this.deferDisplayUpdates = false;
        //this.pendingFinalizationSignals = 0;
        this.methodCacheSize = 1024;
        this.methodCacheMask = this.methodCacheSize - 1;
        this.methodCacheRandomish = 0;
        this.methodCache = [];
        for (var i = 0; i < this.methodCacheSize; i++)
            this.methodCache[i] = {lkupClass: null, selector: null, method: null, methodClass: null, primIndex: 0, argCount: 0};
        this.breakOutOfInterpreter = false;
        this.breakOutTick = 0;
        this.breakOnMethod = null; // method to break on
        this.breakOnNewMethod = false;
        this.breakOnFrameChanged = false;
        this.breakOnFrameReturned = null; // context to break on
        this.startupTime = Date.now(); // base for millisecond clock
    },
    loadInitialContext: function() {
        this.activeContext = this.image.userProcess;
        this.activeContextPointers = this.activeContext.pointers;
        this.currentFrame = (this.activeContextPointers.length - this.activeContextPointers[NoteTaker.PI_PROCESS_TOP]) + 1;
        this.method = this.activeContextPointers[this.currentFrame + NoteTaker.FI_METHOD];
        this.methodBytes = this.method.bytes;
        this.methodNumArgs = this.activeContextPointers[this.currentFrame + NoteTaker.FI_NUMARGS];
        this.receiver = this.activeContextPointers[this.currentFrame + NoteTaker.FI_RECEIVER];
        // FIXME:  [DI] I don't understand the saved pc in the image, but I do know that it
        // starts by setting the global Notetaker to true.  
        this.pc = this.method.methodStartPC(); // Loc of Notetaker <- true.
        this.sp = this.currentFrame;

        // FIXME:  The following should all be moved to a method called, eg, NTpatches...
        // So far all the references to the Notetaker global seem to be about byte ordering, 
        // and I believe that we do not want the intel swapping,  So by skipping 3 bytes forward, 
        // Notetaker will remain false and byte access will benormal
        this.pc += 3; // Loc beyond Notetaker <- true.

        // Sadly the call on notetakerize will still cause trouble, so we'll have to patch that out
        this.methodBytes[77] = 145;  // Patches over "DefaultTextStyle NoteTakerize."
        this.method.pointers[9] = 400; // patch display width to 400
        this.method.pointers[17] = 327; // patch display height to 327

        // Also, remarkably, it seems that Vector, String and Uniquestring all have their classes
        // mistakenly set to Class rather than VariableLengthClass as they were in the image
        // from which the NT image was cloned.  I was accused of "bit rot" for claiming this
        // to be in error due to the contradictory evidence in the image.  Amazingly
        // the one thing that would have revealed this error, the lookup of new:, was sidestepped
        // in both my original 8086 code and Helge's Java VM.  Truly amazing  ;-)
        this.image.objectFromOop(NoteTaker.OTI_CLSTRING).stClass =
            this.image.objectFromOop(NoteTaker.OTI_CLVLENGTHCLASS);
        this.image.objectFromOop(NoteTaker.OTI_CLUNIQUESTRING).stClass =
            this.image.objectFromOop(NoteTaker.OTI_CLVLENGTHCLASS);
        this.image.objectFromOop(NoteTaker.OTI_CLVECTOR).stClass =
            this.image.objectFromOop(NoteTaker.OTI_CLVLENGTHCLASS);
        this.image.objectFromOop(NoteTaker.OTI_CLPROCESS).stClass =
            this.image.objectFromOop(NoteTaker.OTI_CLVLENGTHCLASS);
        this.image.objectFromOop(NoteTaker.OTI_CLNATURAL).stClass =
            this.image.objectFromOop(NoteTaker.OTI_CLVLENGTHCLASS);
        this.image.objectFromOop(NoteTaker.OTI_CLCOMPILEDMETHOD).stClass =
            this.image.objectFromOop(NoteTaker.OTI_CLVLENGTHCLASS);
        
        // Permanent patch to act as NoteTaker=true
        this.patchByteCode(1052, 14, 0x7F); // Rectangle>>color:mode:
        this.patchByteCode(1028, 12, 0x7F); // Rectangle>>blt:mode:
        this.patchByteCode(2008, 26, 0x7F); // Rectangle>>bitsIntoString:mode:
        this.patchByteCode(1456, 26, 0x7F); // Rectangle>>bitsFromString:mode:
        this.patchByteCode(23988, 12, 0x7F); // Integer>>lshift:
        this.patchByteCode(24620, 8, 0x7F); // Integer>>minVal
        this.patchByteCode(24608, 8, 0x7F); // Integer>>maxVal
        this.patchByteCode(26836, 24, 0x7F); // LargeInteger>>lshift:
        this.patchByteCode(27024, 20, 0x7F); // LargeInteger>>land:
        this.patchByteCode(26996, 30, 0x7F); // LargeInteger>>asSmall
        this.patchByteCode(3992, 20, 0x7F); // TextScanner>>toDisplay
        this.patchByteCode(4004, 59, 0x7F); // TextScanner>>frame:window:para:style:printing:
        this.patchByteCode(1820, 12, 0x7F); // BitBlt>>window:
        this.patchByteCode(1892, 22, 0x7F); // BitBlt>>toDisplay
        this.patchByteCode(18912, 20, 0x7F); // UserView>>mp
        this.patchByteCode(18800, 14, 0x7F); // UserView>>buttons
        this.patchByteCode(18864, 20, 0x7F); // UserView>>rawkbck
        this.patchByteCode(18488, 19, 0x7F); // UserView>>kbck
        this.patchByteCode(6312, 12, 0x7F); // UserView>>rawkbck
        this.patchByteCode(18844, 20, 0x7F); // UserView>>kbdnext
        this.patchByteCode(19104, 14, 0x7F); // UserView>>keyset
        this.patchByteCode(18552, 16, 0x7F); // UserView>>cursorloc←
        this.patchByteCode(428, 57, 0x7F); // UserView>>currentCursor:

        // Permanent patch to make all LargeIntegers in range +-32K small again:
        // Note: this does not yet work :-(
        //this.image.smallifyLargeInts();
        //NoteTaker.MAX_INT;  0x7FFF;
        //NoteTaker.MIN_INT; -0x8000;
        //NoteTaker.NON_INT; -0x9000; // non-small and neg (so non pos16 too)

    },
    patchByteCode: function(oop, index, value) {
        var method = this.image.objectFromOop(oop);
        method.bytes[index] = value;
    },

},
'interpreting', {
    interpretOne: function() {
        var b, b2;
        this.byteCodeCount++;
        b = this.nextByte();
        switch (b) { /* The Main Bytecode Dispatch Loop */

            // load receiver variable
            case 0x00: case 0x01: case 0x02: case 0x03: case 0x04: case 0x05: case 0x06: case 0x07:
            case 0x08: case 0x09: case 0x0A: case 0x0B: case 0x0C: case 0x0D: case 0x0E: case 0x0F:
                this.push(this.receiver.pointers[b]); break;

            // load temporary variable
            case 0x10: case 0x11: case 0x12: case 0x13: case 0x14: case 0x15: case 0x16: case 0x17:
            case 0x18: case 0x19: case 0x1A: case 0x1B: case 0x1C: case 0x1D: case 0x1E: case 0x1F:
                this.push(this.activeContextPointers[this.currentFrameTempOrArg(b - 0x10)]); break;

            // loadLiteral
            case 0x20: case 0x21: case 0x22: case 0x23: case 0x24: case 0x25: case 0x26: case 0x27:
            case 0x28: case 0x29: case 0x2A: case 0x2B: case 0x2C: case 0x2D: case 0x2E: case 0x2F:
            case 0x30: case 0x31: case 0x32: case 0x33: case 0x34: case 0x35: case 0x36: case 0x37:
            case 0x38: case 0x39: case 0x3A: case 0x3B: case 0x3C: case 0x3D: case 0x3E: case 0x3F:
                this.push(this.methodLiteral(b - 0x20)); break;

            // loadLiteralIndirect
            case 0x40: case 0x41: case 0x42: case 0x43: case 0x44: case 0x45: case 0x46: case 0x47:
            case 0x48: case 0x49: case 0x4A: case 0x4B: case 0x4C: case 0x4D: case 0x4E: case 0x4F:
            case 0x50: case 0x51: case 0x52: case 0x53: case 0x54: case 0x55: case 0x56: case 0x57:
            case 0x58: case 0x59: case 0x5A: case 0x5B: case 0x5C: case 0x5D: case 0x5E: case 0x5F:
            case 0x60: case 0x61: case 0x62: case 0x63: case 0x64: case 0x65: case 0x66: case 0x67:
            case 0x68: case 0x69: case 0x6A: case 0x6B: case 0x6C: case 0x6D: case 0x6E: case 0x6F:
                this.push(this.methodLiteral(b - 0x40).pointers[NoteTaker.PI_OBJECTREFERENCE_VALUE]); break;

            // Quick loads
            case 0x70: this.nono(); break;
            case 0x71: this.push(this.receiver); break;
            case 0x72: case 0x73: case 0x74: case 0x75: case 0x76: case 0x77:
                this.nono(); break;
            // Push constant (-1, 0, 1, 2, 10, nil, false, true)
            case 0x78: case 0x79: case 0x7A: case 0x7B: case 0x7C: case 0x7D: case 0x7E: case 0x7F:
                this.push(this.specialObjects[b - 0x78 + 1]); break;

            // Sundry
			case 0x80:
				this.doStore(this.pop(), this.nextByte()); break;  // STOPOP
			case 0x81:
				this.doStore(this.top(), this.nextByte()); break;  // STONP
			case 0x82:
				this.pop(); break;	// POP
			case 0x83:	// RETURN
			    this.doReturn(); // method return
				break;
			case 0x84:	// REMLV
				this.doRemoteReturn(); // block return
				break;
			case 0x85:	// PUSHCURRENT
				this.push(this.activeContext);
				break;
			case 0x86:	// SUPER
				this.doSuper = true;
				break; 
			case 0x87:	// LSELF (cf. 0x71 above)
				this.push(this.receiver);
				break;
			case 0x88:	// X LDINST
				this.push(this.receiver.pointers[this.nextByte()]);
				break;
			case 0x89:	// X LDTEMP
                var addr = this.currentFrameTempOrArg(this.nextByte());
				this.push(this.activeContextPointers[addr]); break
				break;
			case 0x8A:	// X LDLIT
				this.push(fetchMethodLiteral(this.nextByte()));
				break;
			case 0x8B:	// X LDLITI
				push(body(fetchMethodLiteral(this.nextByte())).pointers[NoteTaker.PI_OBJECTREFERENCE_VALUE]);
				break;
			case 0x8C:	// X SEND
				send(fetchMethodLiteral(nextByte()));
				break;
			case 0x8D:
			case 0x8E: this.nono(); break; 			// illegal 0x87..0x8F
			case 0x8F: this.breakNow(); break;

            // Short jumps
            case 0x90: case 0x91: case 0x92: case 0x93: case 0x94: case 0x95: case 0x96: case 0x97:
                this.pc += (b&7) + 1;
                break;
            // Short jumps on false
            case 0x98: case 0x99: case 0x9A: case 0x9B: case 0x9C: case 0x9D: case 0x9E: case 0x9F:
                if (this.pop().isFalse) this.pc += (b&7) + 1;
                break;
            // Long jumps
            case 0xA0: case 0xA1: case 0xA2: case 0xA3:
            case 0xA4: case 0xA5: case 0xA6: case 0xA7:
                var delta = ((b&7) - 4) * 256 + this.nextByte();
                if (delta < 0) this.checkForInterrupts();  //check on backward jumps (loops)
                this.pc += delta;
                break;
            // Long jumps on false
            case 0xA8: case 0xA9: case 0xAA: case 0xAB: case 0xAC: case 0xAD: case 0xAE: case 0xAF:
                var b2 = this.nextByte();
                if (this.pop().isFalse) {
                    var delta = ((b&7) - 4) * 256 + b2;
                    if (delta < 0) this.checkForInterrupts();  //check on backward jumps (loops)
                    this.pc += delta;
                }
                break;

            // Arithmetic Ops... + - < > <= >= = ~=    * / \ @ lshift: lxor: land: lor:
            case 0xB0: case 0xB1: case 0xB2: case 0xB3: case 0xB4: case 0xB5: case 0xB6: case 0xB7:
            case 0xB8: case 0xB9: case 0xBA: case 0xBB: case 0xBC: case 0xBD: case 0xBE: case 0xBF:
                if (!this.primHandler.doPrimitive(b&0xF, this.specialNargs[b&0xF]))
                    this.sendSpecial(b&0xF); break;

            // at:, at:put:, size, next, nextPut:, ...
            case 0xC0: case 0xC1: case 0xC2: case 0xC3: case 0xC4: case 0xC5: case 0xC6: case 0xC7:
            case 0xC8: case 0xC9: case 0xCA: case 0xCB: case 0xCC: case 0xCD: case 0xCE: case 0xCF:
                if (this.doSuper || !this.primHandler.doSpecial(b&0xF))
                    this.sendSpecial((b&0xF)+16); break;

            // Send Literal Selector
            case 0xD0: case 0xD1: case 0xD2: case 0xD3: case 0xD4: case 0xD5: case 0xD6: case 0xD7:
            case 0xD8: case 0xD9: case 0xDA: case 0xDB: case 0xDC: case 0xDD: case 0xDE: case 0xDF:
            case 0xE0: case 0xE1: case 0xE2: case 0xE3: case 0xE4: case 0xE5: case 0xE6: case 0xE7:
            case 0xE8: case 0xE9: case 0xEA: case 0xEB: case 0xEC: case 0xED: case 0xEE: case 0xEF:
            case 0xF0: case 0xF1: case 0xF2: case 0xF3: case 0xF4: case 0xF5: case 0xF6: case 0xF7:
            case 0xF8: case 0xF9: case 0xFA: case 0xFB: case 0xFC: case 0xFD: case 0xFE: case 0xFF:
                this.send(this.methodLiteral(b - 0xD0)); break;
        }
        if (this.doSuper && b != 0x86) debugger  // this can prob be remeoved
    },
    doStore: function (value, addrByte) {
		switch (addrByte >> 4) {
			case 0x0:	// store inst
				this.receiver.pointers[addrByte] = value; break;
			case 0x1:	// store temp
				var addr = this.currentFrameTempOrArg(addrByte-0x10);
				this.activeContextPointers[addr] = value; break;
			case 0x2:	// store lit
			case 0x3:
				this.nono(); break;
			case 0x4:	// store lit indirect
			case 0x5:
			case 0x6:
		        this.methodLiteral(addrByte&0x3F).pointers[NoteTaker.PI_OBJECTREFERENCE_VALUE] = value; break;
            case 0x8:
				// handle EXTENDED stores 0x88-0x8c
				var extendedAddr = this.nextByte();
				switch (addrByte) {
					case 0x88:	// STO* X LDINST
						this.receiver.pointers[extendedAddr] = value; break;	
					case 0x89:	// STO* X LDTEMP
						var addr = this.currentFrameTempOrArg(extendedAddr);
				        this.activeContextPointers[addr] = value; break;
					case 0x8b:	// STO* X LDLITI
                        var oref = this.methodLiteral(extendedAddr);
                        oref.pointers[NoteTaker.PI_OBJECTREFERENCE_VALUE] = value; break
					default:		// 0x8a (X LDLIT) and 0x8c (X SEND)
						nono();
				};
				break;
            default:
				nono();
		}
	},

    interpret: function(forMilliseconds) {
        // run until idle, but at most for a couple milliseconds
        // answer milliseconds to sleep (until next timer wakeup)
        // or 'break' if reached breakpoint
        this.isIdle = false;
        this.breakOutOfInterpreter = false;
        this.breakOutTick = this.lastTick + (forMilliseconds || 500);
        while (!this.breakOutOfInterpreter)
            this.interpretOne();
        if (this.breakOutOfInterpreter == 'break') return 'break';
        if (!this.isIdle) return 0;
        if (!this.nextWakeupTick) return 'sleep'; // all processes waiting
        return Math.max(0, this.nextWakeupTick - this.primHandler.millisecondClockValue());
    },
    nextByte: function() {
        return this.methodBytes[this.pc++] & 0xFF;
    },
    methodLiteral: function(index) {
        var literal = this.method.pointers[index];
        if (this.breakOnLiteral === literal) {
            var seen = this.printMethod() + ' @' + this.method.oop + '[' + (this.pc-1) + ']';
            if (!this.breakOnLiteralSeen) this.breakOnLiteralSeen = {};
            if (this.breakOnLiteralSeen[seen]) {
                this.breakOnLiteralSeen[seen] += 1;
            } else {
                this.breakOnLiteralSeen[seen] = 1;
                this.breakNow();
            }
        }
        return literal;
    },

    nono: function() {
        throw "Oh No!";
    },
    checkForInterrupts: function() {
        //Check for interrupts at sends and backward jumps
        if (this.interruptCheckCounter-- > 0) return; //only really check every 100 times or so
        var now = this.primHandler.millisecondClockValue();
        if (now < this.lastTick) { // millisecond clock wrapped
            this.nextPollTick = now + (this.nextPollTick - this.lastTick);
            this.breakOutTick = now + (this.breakOutTick - this.lastTick);
            if (this.nextWakeupTick !== 0)
                this.nextWakeupTick = now + (this.nextWakeupTick - this.lastTick);
        }
        //Feedback logic attempts to keep interrupt response around 3ms...
        if ((now - this.lastTick) < this.interruptChecksEveryNms)  //wrapping is not a concern
            this.interruptCheckCounterFeedBackReset += 10;
        else {
            if (this.interruptCheckCounterFeedBackReset <= 1000)
                this.interruptCheckCounterFeedBackReset = 1000;
            else
                this.interruptCheckCounterFeedBackReset -= 12;
        }
    	this.interruptCheckCounter = this.interruptCheckCounterFeedBackReset; //reset the interrupt check counter
    	this.lastTick = now; //used to detect wraparound of millisecond clock
        //	if(signalLowSpace) {
        //            signalLowSpace= false; //reset flag
        //            sema= getSpecialObject(Squeak.splOb_TheLowSpaceSemaphore);
        //            if(sema != nilObj) synchronousSignal(sema); }
        //	if(now >= nextPollTick) {
        //            ioProcessEvents(); //sets interruptPending if interrupt key pressed
        //            nextPollTick= now + 500; } //msecs to wait before next call to ioProcessEvents"
        if (this.interruptPending) {
            this.interruptPending = false; //reset interrupt flag
            var sema = this.specialObjects[Squeak.splOb_TheInterruptSemaphore];
            if (!sema.isNil) this.primHandler.synchronousSignal(sema);
        }
        if ((this.nextWakeupTick !== 0) && (now >= this.nextWakeupTick)) {
            this.nextWakeupTick = 0; //reset timer interrupt
            var sema = this.specialObjects[Squeak.splOb_TheTimerSemaphore];
            if (!sema.isNil) this.primHandler.synchronousSignal(sema);
        }
        //	if (pendingFinalizationSignals > 0) { //signal any pending finalizations
        //            sema= getSpecialObject(Squeak.splOb_ThefinalizationSemaphore);
        //            pendingFinalizationSignals= 0;
        //            if(sema != nilObj) primHandler.synchronousSignal(sema); }
        //if (this.semaphoresToSignal.length)
        //    this.signalExternalSemaphores();  //signal all semaphores in semaphoresToSignal
        if (now >= this.breakOutTick) // have to return to web browser once in a while
            this.breakOutOfInterpreter = this.breakOutOfInterpreter || true; // do not overwrite break string
    },
    extendedPush: function(nextByte) {
        var lobits = nextByte & 63;
        switch (nextByte>>6) {
            case 0: this.push(this.receiver.pointers[lobits]);break;
            case 1: this.push(this.homeContext.pointers[Squeak.Context_tempFrameStart+lobits]); break;
            case 2: this.push(this.methodLiteral(lobits)); break;
            case 3: this.push(this.methodLiteral(lobits).pointers[Squeak.Assn_value]); break;
        }
    },
    extendedStore: function( nextByte) {
        var lobits = nextByte & 63;
        switch (nextByte>>6) {
            case 0: this.receiver.pointers[lobits] = this.top(); break;
            case 1: this.homeContext.pointers[Squeak.Context_tempFrameStart+lobits] = this.top(); break;
            case 2: this.nono(); break;
            case 3: this.methodLiteral(lobits).pointers[Squeak.Assn_value] = this.top(); break;
        }
    },
    extendedStorePop: function(nextByte) {
        var lobits = nextByte & 63;
        switch (nextByte>>6) {
            case 0: this.receiver.pointers[lobits] = this.pop(); break;
            case 1: this.homeContext.pointers[Squeak.Context_tempFrameStart+lobits] = this.pop(); break;
            case 2: this.nono(); break;
            case 3: this.methodLiteral(lobits).pointers[Squeak.Assn_value] = this.pop(); break;
        }
    },
    sendSpecial: function(lobits) {
        this.send(this.specialSelectors[lobits], this.specialNargs[lobits]); 
    },
},
'sending', {
    send: function(selector, argCountOrUndefined) {
        //console.log("sending " + selector.stInstName() + ", super= " + this.doSuper);
        var newRcvr = this.top();
        var lookupClass = this.getClass(newRcvr);
        //console.log("rcvr " + newRcvr + ", lookupClass= " + lookupClass);
        if (this.doSuper) {
            this.doSuper = false;
            lookupClass = this.activeContextPointers[this.currentFrame + NoteTaker.FI_MCLASS].superclass();
        }
        var entry = this.findSelectorInClass(selector, argCountOrUndefined, lookupClass);
        if (this.debugSelectors && this.debugSelectors.indexOf(selector.bytesAsString()) >= 0) debugger;
        this.executeNewMethod(newRcvr, entry.method, entry.methodClass, entry.argCount, entry.primIndex);
    },
    findSelectorInClass: function(selector, argCountOrUndefined, startingClass) {
        var cacheEntry = this.findMethodCacheEntry(selector, startingClass);
        if (cacheEntry.method) return cacheEntry; // Found it in the method cache
        var currentClass = startingClass;
        var mDict;
        while (!currentClass.isNil) {
            mDict = currentClass.pointers[NoteTaker.PI_CLASS_MDICT];
            if (mDict.isNil) throw "cannotInterpret";
            var newMethod = this.lookupSelectorInDict(mDict, selector);
            if (!newMethod.isNil) {
                //load cache entry here and return
                cacheEntry.method = newMethod;
                cacheEntry.methodClass = currentClass;
                cacheEntry.primIndex = newMethod.methodPrimitiveIndex();
                cacheEntry.argCount = argCountOrUndefined === undefined ? newMethod.methodNumArgs() : argCountOrUndefined;
                return cacheEntry;
            }  
            currentClass = currentClass.pointers[NoteTaker.PI_CLASS_SUPERCLASS];
        }
        //Could not find a normal message -- send #error
        var errorSel = this.image.objectFromOop(NoteTaker.OTI_ERROR_SEL);
        if (selector === errorSel) // Cannot find #error -- unrecoverable error.
            throw "Recursive not understood error encountered";
        return this.findSelectorInClass(errorSel, 0, startingClass);
    },
    lookupSelectorInDict: function(mDict, messageSelector) {
        //Returns a method or nilObject
        var selectors = mDict.pointers[NoteTaker.PI_MESSAGEDICT_OBJECTS].pointers;
        var methods = mDict.pointers[NoteTaker.PI_MESSAGEDICT_METHODS].pointers;
        for (var i = 0; i < selectors.length; i++)
            if (selectors[i] === messageSelector)
                return methods[i];
        return this.nilObj;
    },
    executeNewMethod: function(newRcvr, newMethod, newMethodClass, argumentCount, primitiveIndex) {
        this.sendCount++;
        if (this.logSends) console.log(this.sendCount + ' ' + this.printMethod(newMethod));
        if (this.breakOnMethod === newMethod) this.breakNow();
        if (this.breakOnFrameChanged) {
            this.breakOnFrameChanged = false;
            this.breakNow();
        }
        if (newMethod.methodIsQuick())
            return this.doQuickSend(newRcvr, newMethod.methodQuickIndex());
        if (primitiveIndex>0)
            if (this.tryPrimitive(primitiveIndex, argumentCount, newMethod))
                return;  //Primitive succeeded -- end of story
        // sp points to new receiver, so this is where we base the new frame off
        var newFrame = this.sp - NoteTaker.FI_RECEIVER;
        if (newFrame <= NoteTaker.PI_PROCESS_STACK)
            throw "stack overflow"
        this.activeContextPointers[newFrame + NoteTaker.FI_SAVED_BP] = this.currentFrame;
        this.activeContextPointers[newFrame + NoteTaker.FI_CALLER_PC] = this.pc;
        this.activeContextPointers[newFrame + NoteTaker.FI_NUMARGS] = argumentCount;
        this.activeContextPointers[newFrame + NoteTaker.FI_METHOD] = newMethod;
        this.activeContextPointers[newFrame + NoteTaker.FI_MCLASS] = newMethodClass;
        /////// Whoosh //////
        this.currentFrame = newFrame; //We're off and running...
        this.method = newMethod;
        this.methodBytes = newMethod.bytes;
        this.methodNumArgs = argumentCount;
        this.pc = newMethod.methodStartPC();
        this.sp = newFrame;
        for (var i = 0; i < newMethod.methodNumTemps(); i++)
            this.push(this.nilObj); //  make room for temps and init them
        this.receiver = this.activeContextPointers[this.currentFrame + NoteTaker.FI_RECEIVER];
        if (this.receiver !== newRcvr)
            throw "receivers don't match";
        this.checkForInterrupts();
    },
    doRemoteReturn: function() {
        // reverse of primitiveValue()
        var reply = this.pop();
        var returnFrame = this.pop();
        var returnPC = this.pop();
        /////// Whoosh //////
        this.currentFrame = this.loadFromFrame(returnFrame);
        this.pc = returnPC;
        this.push(reply);
        if (this.breakOnFrameChanged) {
            this.breakOnFrameChanged = false;
            this.breakNow();
        }
    },
    doReturn: function() {
        // reverse of executeNewMethod()
        if (this.breakOnFrameReturned === this.currentFrame) {
            this.breakOnFrameReturned = null;
            this.breakNow();
        }
        var reply = this.top();
        var oldFrame = this.currentFrame;
        var newFrame = this.activeContextPointers[oldFrame + NoteTaker.FI_SAVED_BP];
        var newPC = this.activeContextPointers[oldFrame + NoteTaker.FI_CALLER_PC];
        var newSP = oldFrame + NoteTaker.FI_LAST_ARG + this.methodNumArgs; // pop past old frame and args
        /////// Whoosh //////
        this.currentFrame = this.loadFromFrame(newFrame);
        this.pc = newPC;
        this.sp = newSP;
        this.push(reply);
        if (this.breakOnFrameChanged) {
            this.breakOnFrameChanged = false;
            this.breakNow();
        }
},
    loadFromFrame: function(aFrame) {
        // cache values from aFrame in slots
        this.method = this.activeContextPointers[aFrame + NoteTaker.FI_METHOD];
        this.methodBytes = this.method.bytes;
        this.methodNumArgs = this.activeContextPointers[aFrame + NoteTaker.FI_NUMARGS];
        this.receiver = this.activeContextPointers[aFrame + NoteTaker.FI_RECEIVER];
        return aFrame;
    },
    doQuickSend: function(obj, index) {
        // pop receiver, push self or my inst var at index
        if (index === 255)
            return this.activeContextPointers[this.sp] = obj;
        if (index >= obj.pointers.size) {
            throw "quick push out of range?"
        }
        this.activeContextPointers[this.sp] = obj.pointers[index];
    },
    tryPrimitive: function(primIndex, argCount, newMethod) {
        var success = this.primHandler.doPrimitive(primIndex, argCount, newMethod);
        return success;
    },
    primitivePerform: function(argCount) {
        var selector = this.stackValue(argCount-1);
        var rcvr = this.stackValue(argCount);
        // NOTE: findNewMethodInClass may fail and be converted to #doesNotUnderstand:,
        //       (Whoah) so we must slide args down on the stack now, so that would work
        var trueArgCount = argCount - 1;
        var selectorIndex = this.sp - trueArgCount;
        var stack = this.activeContext.pointers; // slide eveything down...
        this.arrayCopy(stack, selectorIndex+1, stack, selectorIndex, trueArgCount);
        this.sp--; // adjust sp accordingly
        var entry = this.findSelectorInClass(selector, trueArgCount, this.getClass(rcvr));
        this.executeNewMethod(rcvr, entry.method, entry.methodClass, entry.argCount, entry.primIndex);
        return true;
    },
    primitivePerformWithArgs: function(argCount, supered) {
        var rcvr = this.stackValue(argCount);
        var selector = this.stackValue(argCount - 1);
        var args = this.stackValue(argCount - 2);
        if (args.sqClass !== this.specialObjects[Squeak.splOb_ClassArray])
            return false;
        var lookupClass = supered ? this.stackValue(argCount - 3) : this.getClass(rcvr);
        if (supered) { // verify that lookupClass is in fact in superclass chain of receiver;
            var cls = this.getClass(rcvr);
            while (cls !== lookupClass) {
                cls = cls.pointers[Squeak.Class_superclass];
		        if (cls.isNil) return false;
            }
        }
        var trueArgCount = args.pointersSize();
        var stack = this.activeContext.pointers;
        this.arrayCopy(args.pointers, 0, stack, this.sp - 1, trueArgCount);
        this.sp += trueArgCount - argCount; //pop selector and array then push args
        var entry = this.findSelectorInClass(selector, trueArgCount, lookupClass);
        this.executeNewMethod(rcvr, entry.method, entry.methodClass, entry.argCount, entry.primIndex);
        return true;
    },
    findMethodCacheEntry: function(selector, lkupClass) {
        //Probe the cache, and return the matching entry if found
        //Otherwise return one that can be used (selector and class set) with method == null.
        //Initial probe is class xor selector, reprobe delta is selector
        //We do not try to optimize probe time -- all are equally 'fast' compared to lookup
        //Instead we randomize the reprobe so two or three very active conflicting entries
        //will not keep dislodging each other
        var entry;
        this.methodCacheRandomish = (this.methodCacheRandomish + 1) & 3;
        var firstProbe = ((selector.oop ^ lkupClass.oop) >> 1) & this.methodCacheMask;
        var probe = firstProbe;
        for (var i = 0; i < 4; i++) { // 4 reprobes for now
            entry = this.methodCache[probe];
            if (entry.selector === selector && entry.lkupClass === lkupClass) return entry;
            if (i === this.methodCacheRandomish) firstProbe = probe;
            probe = (probe + selector.oop) & this.methodCacheMask;
        }
        entry = this.methodCache[firstProbe];
        entry.lkupClass = lkupClass;
        entry.selector = selector;
        entry.method = null;
        return entry;
    },
    flushMethodCache: function() { //clear all cache entries (prim 89)
        for (var i = 0; i < this.methodCacheSize; i++) {
            this.methodCache[i].selector = null;   // mark it free
            this.methodCache[i].method = null;  // release the method
        }
        return true;
    },
    flushMethodCacheForSelector: function(selector) { //clear cache entries for selector (prim 119)
        for (var i = 0; i < this.methodCacheSize; i++)
            if (this.methodCache[i].selector === selector) {
                this.methodCache[i].selector = null;   // mark it free
                this.methodCache[i].method = null;  // release the method
            }
        return true;
    },
    flushMethodCacheForMethod: function(method) { //clear cache entries for method (prim 116)
        for (var i = 0; i < this.methodCacheSize; i++)
            if (this.methodCache[i].method === method) {
                this.methodCache[i].selector = null;   // mark it free
                this.methodCache[i].method = null;  // release the method
            }
        return true;
    },
    flushMethodCacheAfterBecome: function(mutations) {
        // could be selective by checking lkupClass, selector,
        // and method against mutations dict
        this.flushMethodCache();
    },
},
'frame', {
    currentFrameTempOrArg: function(tempIndex) {
        return tempIndex < this.methodNumArgs ? 
            this.currentFrame + NoteTaker.FI_LAST_ARG + (this.methodNumArgs - 1 - tempIndex) :
            this.currentFrame + NoteTaker.FI_FIRST_TEMP - (tempIndex - this.methodNumArgs);
    }
},
'stack access', {
    pop: function() {
        //Note leaves garbage above SP.  Serious reclaim should store nils above SP
        return this.activeContextPointers[this.sp++];  
    },
    popN: function(nToPop) {
        this.sp += nToPop;
    },
    push: function(oop) {
        this.activeContextPointers[--this.sp] = oop;
    },
    popNandPush: function(nToPop, oop) {
        this.activeContextPointers[this.sp += nToPop - 1] = oop;
    },
    top: function() {
        return this.activeContextPointers[this.sp];
    },
    stackValue: function(depthIntoStack) {
        return this.activeContext.pointers[this.sp + depthIntoStack];
    },
    stackInteger: function(depthIntoStack) {
        return this.checkSmallInt(this.stackValue(depthIntoStack));
    },
    pop2AndPushIntResult: function(intResult) {// returns success boolean
        if (this.success && this.canBeSmallInt(intResult)) {
            this.popNandPush(2, intResult);
            return true;
        }
        return false;
    },
    pop2AndPushBoolResult: function(boolResult) {
        if (!this.success) return false;
        this.popNandPush(2, boolResult ? this.trueObj : this.falseObj);
        return true;
    },
},
'numbers', {
    getClass: function(obj) {
        if (this.isSmallInt(obj))
            return this.integerClass;
        return obj.stClass;
    },
    canBeSmallInt: function(anInt) {
        return (anInt >= NoteTaker.MIN_INT) && (anInt <= NoteTaker.MAX_INT);
    },
    isSmallInt: function(object) {
        return typeof object === "number";
    },
    checkSmallInt: function(maybeSmall) { // returns an int and sets success
        if (this.isSmallInt(maybeSmall))
            return maybeSmall;
        this.success = false;
        return 1;
    },



    safeShift: function(bitsToShift, shiftCount) {
        if (shiftCount<0) return bitsToShift>>-shiftCount; //OK to lose bits shifting right
        //check for lost bits by seeing if computation is reversible
        var shifted = bitsToShift<<shiftCount;
        if  ((shifted>>shiftCount) === bitsToShift) return shifted;
        return NoteTaker.NON_INT;  //non-small result will cause failure
    },
},
'utils',
{
    instantiateClass: function(aClass, indexableSize) {
        return this.image.instantiateClass(aClass, indexableSize, this.nilObj);
    },
    arrayFill: function(array, fromIndex, toIndex, value) {
        // assign value to range from fromIndex (inclusive) to toIndex (exclusive)
        for (var i = fromIndex; i < toIndex; i++)
            array[i] = value;
    },
    arrayCopy: function(src, srcPos, dest, destPos, length) {
        // copy length elements from src at srcPos to dest at destPos
        if (src === dest && srcPos < destPos)
            for (var i = length - 1; i >= 0; i--)
                dest[destPos + i] = src[srcPos + i];
        else
            for (var i = 0; i < length; i++)
                dest[destPos + i] = src[srcPos + i];
    },
},
'debugging', {
    printMethod: function(aMethod) {
        // return a 'class>>selector' description for the method
        // in old images this is expensive, we have to search all classes
        if (!aMethod) aMethod = this.method;
        var found;
        this.allMethodsDo(function(classObj, methodObj, selectorObj) {
            if (methodObj === aMethod)
                return found = classObj.className() + '>>' + selectorObj.bytesAsString();
        });
        return found || "?>>?";
    },
    allMethodsDo: function(callback) {
        // callback(classObj, methodObj, selectorObj) should return true to break out of iteration
        var globals = this.image.globals.pointers[NoteTaker.PI_SYMBOLTABLE_VALUES].pointers;
        for (var i = 0; i < globals.length; i++) {
            var objRef = globals[i];
            if (!objRef.isNil) {
                var cls = objRef.pointers[NoteTaker.PI_OBJECTREFERENCE_VALUE];
                if (typeof cls === 'object' && cls.isClass()) {
                    var mdict = cls.pointers[NoteTaker.PI_CLASS_MDICT];
                    var selectors = mdict.pointers[NoteTaker.PI_MESSAGEDICT_OBJECTS].pointers;
                    var methods = mdict.pointers[NoteTaker.PI_MESSAGEDICT_METHODS].pointers;
                    for (var j = 0; j < methods.length; j++)
                        if (!methods[j].isNil)
                            if (callback.call(this, cls, methods[j], selectors[j]))
                                return;
                }
            }
        }
    },
    printStack: function(ctx, limit) {
        // both args are optional
        if (typeof ctx == "number") {limit = ctx; ctx = null;}
        if (!ctx) ctx = this.activeContext;
        if (!limit) limit = 100;
        var stack = '';
        var bp = this.currentFrame;
        while (bp && limit-- > 0) {
            var method = ctx.pointers[bp + NoteTaker.FI_METHOD];
            stack = this.printMethod(method) + '\n' + stack;
            bp = ctx.pointers[bp + NoteTaker.FI_SAVED_BP];
        }
        return stack;
    },
    breakOn: function(classAndMethodString) {
        // classAndMethodString is 'Class>>method'
        var found;
        this.allMethodsDo(function(classObj, methodObj, selectorObj) {
            var thisMethod = classObj.className() + '>>' + selectorObj.bytesAsString();
            if (classAndMethodString == thisMethod)
                return found = methodObj;
        });
        this.breakOnMethod = found;
        return found;
    },
    breakOnGlobal: function(name) {
        this.breakOnLiteral = this.image.globalRefNamed(name);
        return this.breakOnLiteral;
    },

    breakNow: function() {
        this.breakOutOfInterpreter = 'break';
    },
    breakOnReturn: function() {
        this.breakOnFrameChanged = false;
        this.breakOnFrameReturned = this.currentFrame;
    },
    breakOnSendOrReturn: function() {
        this.breakOnFrameChanged = true;
        this.breakOnFrameReturned = null;
    },
    printActiveContext: function(printAll, debugFrame) {
        // temps and stack in current context
        var ctx = this.activeContextPointers,
            bp = this.currentFrame,
            numArgs = ctx[bp + NoteTaker.FI_NUMARGS],
            numTemps = ctx[bp + NoteTaker.FI_METHOD].methodNumTemps();
        var stack = '';
        if (debugFrame) stack += Strings.format("\npc: %s sp: %s bp: %s numArgs: %s\n",
            this.pc, this.sp, this.currentFrame, numArgs);
        for (var i = this.sp; i < ctx.length; i++) {
            if (!debugFrame && bp + NoteTaker.FI_SAVED_BP <= i && bp + NoteTaker.FI_RECEIVER >= i) continue;
            var obj = ctx[i];
            var value = typeof obj === 'number' ? obj : obj.stInstName();
            stack += Strings.format('\n[%s] %s%s', i, 
                bp + NoteTaker.FI_FIRST_TEMP - numTemps < i && i <= bp + NoteTaker.FI_FIRST_TEMP
                    ? ('  temp ' + (bp + NoteTaker.FI_FIRST_TEMP + numArgs - i) + ': ') :
                bp + NoteTaker.FI_SAVED_BP == i ? ' savedBP: ' :
                bp + NoteTaker.FI_CALLER_PC == i ? 'callerPC: ' :
                bp + NoteTaker.FI_NUMARGS == i ? ' numArgs: ' :
                bp + NoteTaker.FI_METHOD == i ? '  method: ' :
                bp + NoteTaker.FI_MCLASS == i ? '  mclass: ' :
                bp + NoteTaker.FI_RECEIVER == i ? 'receiver: ' :
                bp + NoteTaker.FI_RECEIVER < i && i <= bp + NoteTaker.FI_RECEIVER + numArgs 
                    ? ('   arg ' + (bp + NoteTaker.FI_RECEIVER + numArgs - i) + ': ') :
                this.sp == i ? '   sp ==> ' : 
                '          ', value);
            if (i >= bp + NoteTaker.FI_RECEIVER + numArgs && i+1 < ctx.length) {
                if (!printAll) return stack;
                bp = ctx[bp + NoteTaker.FI_SAVED_BP];
                numArgs = ctx[bp + NoteTaker.FI_NUMARGS];
                numTemps = ctx[bp + NoteTaker.FI_METHOD].methodNumTemps();
                stack += '\n\n' + this.printMethod(ctx[bp + NoteTaker.FI_METHOD]);
            }
        }
        return stack;
    },
    printByteCodes: function(aMethod, optionalIndent, optionalHighlight, optionalPC) {
        var printer = new users.bert.St78.vm.InstructionPrinter(aMethod || this.method, this);
        return printer.printInstructions(optionalIndent, optionalHighlight, optionalPC);
    },
    willSendOrReturn: function() {
        // Answer whether the next bytecode corresponds to a Smalltalk
        // message send or return
        var byte = this.method.bytes[this.pc];
        return byte >= 0xB0 || byte == 0x8C || byte == 0x83;
    },
});

Object.subclass('users.bert.St78.vm.Primitives',
'initialization', {
    initialize: function(vm, display) {
        this.vm = vm;
        this.display = display;
        this.display.vm = this.vm;
        this.initAtCache();
        this.initModules();
		this.remoteCodeClass = vm.image.objectFromOop(NoteTaker.OTI_CLREMOTECODE);
    },
    initModules: function() {
        this.loadedModules = {};
        this.externalModules = {};
        this.builtinModules = {
            MiscPrimitivePlugin: {
                exports: {
                    primitiveStringHash: this.primitiveStringHash.bind(this),
                },
            },
        };
    },
},
'dispatch', {
    doSpecial: function(lobits) {
        // returns true if it succeeds
        this.success = true;
        switch (lobits) {
            case 0x0: return this.popNandPushIfOK(2, this.objectAt(true,true,false)); // at:
            case 0x1: return this.popNandPushIfOK(3, this.objectAtPut(true,true,false)); // at:put:
            //case 0x2: return false; // next
            //case 0x3: return false; // nextPut:
            case 0x4: return this.popNandPushIfOK(1, this.objectSize()); // length
            case 0x5: return this.pop2andPushBoolIfOK(this.vm.stackValue(1) === this.vm.stackValue(0)); // ==
            //case 0x6: return false; // is:
            //case 0x7: return false; // append:
            case 0x8: return this.popNandPushIfOK(1,this.vm.getClass(this.vm.top())); // class
            case 0x9: return this.popNandPushIfOK(2,this.doBlockCopy()); // remoteCopy:
            case 0xA: return this.primitiveValue(0); // eval
            //case 0xB: return false; // new
            //case 0xC: return false; // new:
            //case 0xD: return false; // x
            //case 0xE: return false; // y
            //case 0xF: return false; // asStream
        }
        return false;
    },
    doPrimitive: function(index, argCount) {
        this.success = true;
        switch (index) {
            case 0: return this.popNandPushIntIfOK(2,this.stackInteger(0) + this.stackInteger(1));  // Integer.add
            case 1: return this.popNandPushIntIfOK(2,this.stackInteger(0) - this.stackInteger(1));  // Integer.subtract
            case 2: return this.pop2andPushBoolIfOK(this.stackInteger(0) < this.stackInteger(1));   // Integer.less
            case 3: return this.pop2andPushBoolIfOK(this.stackInteger(0) > this.stackInteger(1));   // Integer.greater
            case 4: return this.pop2andPushBoolIfOK(this.stackInteger(0) <= this.stackInteger(1));  // Integer.leq
            case 5: return this.pop2andPushBoolIfOK(this.stackInteger(0) >= this.stackInteger(1));  // Integer.geq
            case 6: return this.pop2andPushBoolIfOK(this.stackInteger(0) === this.stackInteger(1)); // Integer.equal
            case 7: return this.pop2andPushBoolIfOK(this.stackInteger(0) !== this.stackInteger(1)); // Integer.notequal
            case 8: return this.popNandPushIntIfOK(2,this.stackInteger(0) * this.stackInteger(1));  // Integer.multiply *
            case 9: return this.popNandPushIntIfOK(2,this.doDiv(this.stackInteger(0),this.stackInteger(1)));  // Integer.divide /  
            case 10: return this.popNandPushIntIfOK(2,this.doRem(this.stackInteger(0),this.stackInteger(1)));  // Integer.rem \\
            case 11: return this.primitiveMakePoint(argCount);  // @ - make a Point
            case 12: return this.popNandPushIfOK(2,this.doBitShift());  // SmallInt.bitShift
            case 13: return this.popNandPushIfOK(2,this.doBitXor());  // SmallInt.bitXor
            case 14: return this.popNandPushIfOK(2,this.doBitAnd());  // SmallInt.bitAnd
            case 15: return this.popNandPushIfOK(2,this.doBitOr());  // SmallInt.bitOr
            case 18: return false; // next;
            case 19: return false; // next <-
            case 20: return false;
            case 21: return false; // primitiveAddLargeIntegers
            case 22: return false; // primitiveSubtractLargeIntegers
            case 23: return false; // primitiveLessThanLargeIntegers
            case 24: return false; // primitiveGreaterThanLargeIntegers
            case 25: return this.primitiveRemoteCopy(argCount); // Process.remoteCopy
            case 26: return this.primitiveValue(argCount); // RemoteCode.value
            case 27: return this.primitiveNew(argCount); // argCount = 0 fixed size
            case 28: return this.primitiveNew(argCount); // argCount = 1 variable
            case 39: return this.primitiveValueGets(argCount); // RemoteCode.value_
            case 40: return this.primitiveCopyBits(argCount);  // BitBlt.callBLT
            case 41: return this.primitiveBeDisplay(argCount); // BitBlt install for display
            case 50: return false; // TextScanner.scanword:
            case 53: return true; // String.lock/unlock: address of bits (return self on Notetaker)
            case 58: return this.primitiveMousePoint(argCount);
            case 59: return true; //UserView.primCursorLoc←
            case 61: return this.primitiveKeyboardPeek(argCount);
            case 62: return this.primitiveKeyboardNext(argCount);
            case 68: return this.primitiveMouseButtons(argCount);
/*
            case 29: return false; // primitiveMultiplyLargeIntegers
            case 30: return false; // primitiveDivideLargeIntegers
            case 31: return false; // primitiveModLargeIntegers
            case 32: return false; // primitiveDivLargeIntegers
            case 33: return false; // primitiveQuoLargeIntegers
            case 34: return false; // primitiveBitAndLargeIntegers
            case 35: return false; // primitiveBitOrLargeIntegers
            case 36: return false; // primitiveBitXorLargeIntegers
            case 37: return false; // primitiveBitShiftLargeIntegers
            case 38: return false; // TODO: primitiveFloatAt
            case 39: return false; // TODO: primitiveFloatAtPut
            case 40: return this.popNandPushFloatIfOK(1,this.stackInteger(0)); // primitiveAsFloat
            case 41: return this.popNandPushFloatIfOK(2,this.stackFloat(0)+this.stackFloat(1));  // Float +
            case 42: return this.popNandPushFloatIfOK(2,this.stackFloat(0)-this.stackFloat(1));  // Float -	
            case 43: return this.pop2andPushBoolIfOK(this.stackFloat(0)<this.stackFloat(1));  // Float <
            case 44: return this.pop2andPushBoolIfOK(this.stackFloat(0)>this.stackFloat(1));  // Float >
            case 45: return this.pop2andPushBoolIfOK(this.stackFloat(0)<=this.stackFloat(1));  // Float <=
            case 46: return this.pop2andPushBoolIfOK(this.stackFloat(0)>=this.stackFloat(1));  // Float >=
            case 47: return this.pop2andPushBoolIfOK(this.stackFloat(0)===this.stackFloat(1));  // Float =
            case 48: return this.pop2andPushBoolIfOK(this.stackFloat(0)!==this.stackFloat(1));  // Float !=
            case 49: return this.popNandPushFloatIfOK(2,this.stackFloat(0)*this.stackFloat(1));  // Float.mul
            case 50: return this.popNandPushFloatIfOK(2,this.safeFDiv(this.stackFloat(0),this.stackFloat(1)));  // Float.div
            case 51: return this.popNandPushIfOK(1, this.checkSmallInt(this.stackFloat(0)|0));  // Float.asInteger
            case 52: return false;  // Float.fractionPart
            case 53: return this.popNandPushIfOK(1, Math.log(this.stackFloat(0)) / Math.log(2) | 0); // Exponent
            case 54: return this.popNandPushFloatIfOK(2, this.stackFloat(0) * Math.pow(2, this.stackFloat(1))); // TimesTwoPower
            case 55: return this.popNandPushFloatIfOK(1, Math.sqrt(this.stackFloat(0))); // SquareRoot
            case 56: return this.popNandPushFloatIfOK(1, Math.sin(this.stackFloat(0))); // Sine
            case 57: return this.popNandPushFloatIfOK(1, Math.atan(this.stackFloat(0))); // Arctan
            case 58: return this.popNandPushFloatIfOK(1, Math.log(this.stackFloat(0))); // LogN
            case 59: return this.popNandPushFloatIfOK(1, Math.exp(this.stackFloat(0))); // Exp
            case 60: return this.popNandPushIfOK(2, this.objectAt(false,false,false)); // basicAt:
            case 61: return this.popNandPushIfOK(3, this.objectAtPut(false,false,false)); // basicAt:put:
            case 62: return this.popNandPushIfOK(1, this.objectSize()); // size
            case 63: return this.popNandPushIfOK(2, this.objectAt(false,true,false)); // String.basicAt:
            case 64: return this.popNandPushIfOK(3, this.objectAtPut(false,true,false)); // String.basicAt:put:
            case 65: return false; // primitiveNext
            case 66: return false; // primitiveNextPut
            case 67: return false; // primitiveAtEnd
            case 68: return this.popNandPushIfOK(2, this.objectAt(false,false,true)); // Method.objectAt:
            case 69: return this.popNandPushIfOK(3, this.objectAtPut(false,false,true)); // Method.objectAt:put:
            case 72: return this.popNandPushIfOK(2, this.doArrayBecome(false)); //arrayBecomeOneWay
            case 73: return this.popNandPushIfOK(2, this.objectAt(false,false,true)); // instVarAt:
            case 74: return this.popNandPushIfOK(3, this.objectAtPut(false,false,true)); // instVarAt:put:
            case 75: return this.popNandPushIfOK(1, this.stackNonInteger(0).hash); // Object.identityHash
            case 76: return false; // primitiveStoreStackp (Blue Book: primitiveAsObject)
            case 77: return this.popNandPushIfOK(1, this.someInstanceOf(this.stackNonInteger(0))); // Class.someInstance
            case 78: return this.popNandPushIfOK(1, this.nextInstanceAfter(this.stackNonInteger(0))); // Object.nextInstance
            case 79: return this.primitiveNewMethod(); // Compiledmethod.new
            case 80: return this.popNandPushIfOK(2,this.doBlockCopy()); // blockCopy:
            case 81: return this.primitiveBlockValue(argCount); // BlockContext.value
            case 82: return this.primitiveValueWithArgs(argCount); // BlockContext.valueWithArguments:
            case 83: return this.vm.primitivePerform(argCount); // Object.perform:(with:)*
            case 84: return this.vm.primitivePerformWithArgs(argCount, false); //  Object.perform:withArguments:
            case 85: return this.primitiveSignal(); // Semaphore.wait
            case 86: return this.primitiveWait(); // Semaphore.wait
            case 87: return this.primitiveResume(); // Process.resume
            case 88: return this.primitiveSuspend(); // Process.suspend
            case 89: return this.vm.flushMethodCache(); //primitiveFlushCache
            case 90: return this.primitiveMousePoint(argCount); // mousePoint
            case 91: return this.primitiveTestDisplayDepth(argCount); // cursorLocPut in old images
            case 92: return false; // primitiveSetDisplayMode				"Blue Book: primitiveCursorLink"
            case 93: return false; // primitiveInputSemaphore
            case 94: return false; // primitiveGetNextEvent				"Blue Book: primitiveSampleInterval"
            case 95: return false; // primitiveInputWord
            case 96: return this.primitiveCopyBits(argCount);  // BitBlt.copyBits
            case 97: return false; // primitiveSnapshot
            case 98: return false; // primitiveStoreImageSegment
            case 99: return false; // primitiveLoadImageSegment
            case 100: return this.vm.primitivePerformWithArgs(argCount, true); // Object.perform:withArguments:inSuperclass: (Blue Book: primitiveSignalAtTick)
            case 101: return this.primitiveBeCursor(argCount); // Cursor.beCursor
            case 102: return this.primitiveBeDisplay(argCount); // DisplayScreen.beDisplay
            case 103: return false; // primitiveScanCharacters
            case 104: return false; // primitiveDrawLoop
            case 105: return this.popNandPushIfOK(5, this.doStringReplace()); // string and array replace
            case 106: return this.primitiveScreenSize(argCount); // actualScreenSize
            case 110: return this.pop2andPushBoolIfOK(this.vm.stackValue(0) === this.vm.stackValue(1)); // ==
            case 111: return this.popNandPushIfOK(1, this.vm.getClass(this.vm.top())); // Object.class
            case 112: return this.popNandPushIfOK(1, 1000000); //primitiveBytesLeft
            case 113: return this.primitiveQuit(argCount);
            case 114: return this.primitiveExitToDebugger(argCount);
            case 115: return false; //TODO primitiveChangeClass					"Blue Book: primitiveOopsLeft"
            case 116: return this.vm.flushMethodCacheForMethod(this.vm.top());
            case 117: return this.doNamedPrimitive(argCount, newMethod); // named prims
            case 118: return false; //TODO primitiveDoPrimitiveWithArgs
            case 119: return this.vm.flushMethodCacheForSelector(this.vm.top());
            case 120: return false; //primitiveCalloutToFFI
            case 121: return this.popNandPushIfOK(1, this.makeStString("/home/bert/mini.image")); //imageName
            case 122: return this.primitiveReverseDisplay(argCount); // Blue Book: primitiveImageVolume
            case 123: return false; //TODO primitiveValueUninterruptably
            case 124: return this.popNandPushIfOK(2, this.registerSemaphore(Squeak.splOb_TheLowSpaceSemaphore));
            case 125: return this.popNandPushIfOK(2, this.setLowSpaceThreshold());
            case 126: return false; //TODO primitiveDeferDisplayUpdates
    		case 127: return false; //TODO primitiveShowDisplayRect
            case 128: return this.popNandPushIfOK(2, this.doArrayBecome(true)); //arrayBecome
            case 129: return this.popNandPushIfOK(1, this.vm.image.specialObjectsArray); //specialObjectsOop
            case 130: return this.popNandPushIfOK(1, this.vm.image.fullGC()); // GC
            case 131: return this.popNandPushIfOK(1, this.vm.image.partialGC()); // GCmost
            case 132: return this.pop2andPushBoolIfOK(this.pointsTo(this.stackNonInteger(1), this.vm.top())); //Object.pointsTo
            case 133: return false; //TODO primitiveSetInterruptKey
            case 134: return this.popNandPushIfOK(2, this.registerSemaphore(Squeak.splOb_TheInterruptSemaphore));
            case 135: return this.popNandPushIfOK(1, this.millisecondClockValue());
            case 136: return this.primitiveSignalAtMilliseconds(argCount); //Delay signal:atMs:());
            case 137: return this.popNandPushIfOK(1, this.secondClock()); // seconds since Jan 1, 1901
            case 138: return this.popNandPushIfOK(1, this.someObject()); // Object.someObject
            case 139: return this.popNandPushIfOK(1, this.nextObject(this.vm.top())); // Object.nextObject
            case 140: return false; // TODO primitiveBeep
            case 141: return this.primitiveClipboardText(argCount);
            case 142: return this.popNandPushIfOK(1, this.makeStString("/users/bert/st78vm/")); //vmPath
            case 143: return false; // TODO primitiveShortAt
            case 144: return false; // TODO primitiveShortAtPut
            case 145: return false; // TODO primitiveConstantFill
            case 146: return false; // TODO primitiveReadJoystick
            case 147: return false; // TODO primitiveWarpBits
            case 148: return this.popNandPushIfOK(1, this.vm.image.clone(this.vm.top())); //shallowCopy
            case 149: return false; // TODO primitiveGetAttribute
            case 153: return false; // File.open 
            case 156: return false; // primDeleteFileNamed:
            case 159: return false; // primRename:to:
            case 160: return false; // TODO primitiveAdoptInstance
            case 161: return this.popNandPushIfOK(1, this.charFromInt('/'.charCodeAt(0))); //path delimiter
            case 162: return this.popNandPushIfOK(1, this.vm.nilObj);  // FileDirectory.primLookupEntryIn:index: 
            case 167: return false; // Processor.yield
            case 195: return false; // Context.findNextUnwindContextUpTo:
            case 196: return false; // Context.terminateTo:
            case 197: return false; // Context.findNextHandlerContextStarting
            case 198: return false; // MarkUnwindMethod (must fail)
            case 199: return false; // MarkHandlerMethod (must fail)
            case 230: return this.primitiveRelinquishProcessorForMicroseconds(argCount);
            case 231: return this.primitiveForceDisplayUpdate(argCount);
            case 233: return this.primitiveSetFullScreen(argCount);
            case 234: return false; // primBitmapdecompressfromByteArrayat
            case 235: return false; // primStringcomparewithcollated
            case 236: return false; // primSampledSoundconvert8bitSignedFromto16Bit
            case 237: return false; // primBitmapcompresstoByteArray
            case 238: case 239: case 240: case 241: return false; // serial port primitives
            case 243: return false; // primStringtranslatefromtotable
            case 244: return false; // primStringfindFirstInStringinSetstartingAt
            case 245: return false; // primStringindexOfAsciiinStringstartingAt
            case 246: return false; // primStringfindSubstringinstartingAtmatchTable
            case 254: return this.primitiveVMParameter(argCount);
*/
        }
        throw "primitive " + index + " not implemented yet";
        return false;
    },
},
'stack access', {
    pop2andPushBoolIfOK: function(bool) {
        this.vm.success = this.success;
        return this.vm.pop2AndPushBoolResult(bool);
    },
    popNandPushIfOK: function(nToPop, returnValue) {
        if (!this.success || returnValue == null) return false;
        this.vm.popNandPush(nToPop, returnValue);
        return true;
    },
    popNandPushIntIfOK: function(nToPop, returnValue) {
        if (!this.success || !this.vm.canBeSmallInt(returnValue)) return false; 
        return this.popNandPushIfOK(nToPop, returnValue);
    },
    popNandPushFloatIfOK: function(nToPop, returnValue) {
        if (!this.success) return false;
        return this.popNandPushIfOK(nToPop, this.makeFloat(returnValue));
    },
    stackNonInteger: function(nDeep) {
        return this.checkNonInteger(this.vm.stackValue(nDeep));
    },
    stackInteger: function(nDeep) {
        return this.checkSmallInt(this.vm.stackValue(nDeep));
    },
    stackPos16BitInt: function(nDeep) {
        var stackVal = this.vm.stackValue(nDeep);
        if (this.vm.isSmallInt(stackVal)) {
            if (stackVal >= 0)
                return stackVal;
            this.success = false;
            return 0;
        }
        return 0;  //FIXME - I think in st78 all calls to stackPos16BitInt can simply call stackInteger
    },
    pos16BitIntFor: function(pos16Val) {
        // Return the 16-bit quantity as a positive 16-bit integer
        if (pos16Val >= 0)
            if (this.vm.canBeSmallInt(pos16Val)) return pos16Val;
        debugger; throw "large ints not implemented yet"
        var lgIntClass = this.vm.specialObjects[Squeak.splOb_ClassLargePositiveInteger];
        var lgIntObj = this.vm.instantiateClass(lgIntClass, 4);
        var bytes = lgIntObj.bytes;
        for (var i=0; i<4; i++)
            bytes[i] = (pos16Val>>>(8*i))&255;
        return lgIntObj;
    },
    stackFloat: function(nDeep) {
        return this.checkFloat(this.vm.stackValue(nDeep));
    },
},
'numbers', {
    doBitAnd: function() {
        var rcvr = this.stackInteger(0);
        var arg = this.stackInteger(1);
        if (!this.success) return 0;
        return rcvr & arg;
    },
    doBitOr: function() {
        var rcvr = this.stackInteger(0);
        var arg = this.stackInteger(1);
        if (!this.success) return 0;
        return rcvr | arg;
    },
    doBitXor: function() {
        var rcvr = this.stackInteger(0);
        var arg = this.stackInteger(1);
        if (!this.success) return 0;
        return rcvr ^ arg;
    },
    doBitShift: function() {
        var rcvr = this.stackInteger(0);
        var arg = this.stackInteger(1);
        if (!this.success) return 0;
        var result = this.vm.safeShift(rcvr, arg); // returns negative result if failed
        if (result >= 0 && this.vm.canBeSmallInt(result))
            return result;
        this.success = false;
        return 0;
    },

    safeFDiv: function(dividend, divisor) {
        if (divisor === 0.0) {
            this.success = false;
            return 1.0;
        }
        return dividend / divisor;
    },
    doDiv: function(rcvr, arg) {
        if (arg === 0) return NoteTaker.NON_INT;  // fail if divide by zero
        return Math.floor(rcvr/arg);
    },
    doRem: function(rcvr, arg) {
        if (arg === 0) return NoteTaker.NON_INT;  // fail if divide by zero
        return rcvr - Math.floor(rcvr/arg) * arg;
    },},
'utils', {
    checkFloat: function(maybeFloat) { // returns a float and sets success
        if (maybeFloat.isFloat)
            return maybeFloat.float;
        this.success = false;
        return 0.0;
    },
    checkSmallInt: function(maybeSmall) { // returns an int and sets success
        if (this.vm.isSmallInt(maybeSmall))
            return maybeSmall;
        this.success = false;
        return 0;
    },
    checkNonInteger: function(obj) { // returns a SqObj and sets success
        if (!this.vm.isSmallInt(obj))
            return obj;
        this.success = false;
        return this.vm.nilObj;
    },
    isA: function(obj, knownClass) {
        return obj.sqClass === this.vm.specialObjects[knownClass];
    },
    isKindOf: function(obj, knownClass) {
        var classOrSuper = obj.sqClass;
        var theClass = this.vm.specialObjects[knownClass];
        while (!classOrSuper.isNil) {
            if (classOrSuper === theClass) return true;
            classOrSuper = classOrSuper.pointers[Squeak.Class_superclass];
        }
        return false;
    },
    charFromInt: function(ascii) {
        var charTable = this.vm.specialObjects[Squeak.splOb_CharacterTable];
        return charTable.pointers[ascii];
    },
    makeFloat: function(value) {
        var floatClass = this.vm.specialObjects[Squeak.splOb_ClassFloat];
        var newFloat = this.vm.instantiateClass(floatClass, 2);
        newFloat.float = value;
        return newFloat;
	},
    makePointWithXandY: function(x, y) {
        var pointClass = this.vm.image.objectFromOop(NoteTaker.OTI_CLPOINT);
        var newPoint = this.vm.instantiateClass(pointClass, 0);
        newPoint.pointers[NoteTaker.PI_POINT_X] = x;
        newPoint.pointers[NoteTaker.PI_POINT_Y] = y;
        return newPoint;
    },
    makeStString: function(jsString) {
        var bytes = [];
        for (var i = 0; i < jsString.length; ++i)
            bytes.push(jsString.charCodeAt(i) & 0xFF);
        var stString = this.vm.instantiateClass(this.vm.specialObjects[Squeak.splOb_ClassString], bytes.length);
        stString.bytes = bytes;
        return stString;
    },
    pointsTo: function(rcvr, arg) {
        if (!rcvr.pointers) return false;
        return rcvr.pointers.indexOf(arg) >= 0;
    },
},
'indexing', {
    indexableSize: function(obj) {
        if (this.vm.isSmallInt(obj)) return -1; // -1 means not indexable
        var instSize = obj.stClass.pointers[NoteTaker.PI_CLASS_INSTSIZE];
        if ((instSize & NoteTaker.FMT_ISVARIABLE) == 0) return -1;  // fail if not indexable

        if (obj.bytes) return obj.bytes.length;
        if (obj.words) return obj.words.length;
        return obj.pointersSize() - obj.stClass.classInstSize();
    },
    objectAt: function(cameFromBytecode, convertChars, includeInstVars) {
        //Returns result of at: or sets success false
        var array = this.stackNonInteger(0);
        var index = this.stackPos16BitInt(1); //note non-int returns zero
        if (!this.success) return array;
        var info = this.atCache[(array.oop >> 1) & this.atCacheMask];
        if (info.array !== array)
            info = this.makeAtCacheInfo(this.atCache, this.vm.specialSelectors[16], array, convertChars, includeInstVars);
        if (index < 1 || index > info.size) {this.success = false; return array;}
        if (includeInstVars)  // pointers
            return array.pointers[index-1];
        if (array.words) // words
            return this.pos16BitIntFor(array.words[index-1]);
        if (array.bytes) // bytes...
            return array.bytes[index-1];
        // comes last to not report pointers of compiled methods
        if (array.pointers)
            return array.pointers[index-1+info.ivarOffset];
        throw "indexing problem"
    },
    objectAtPut: function(cameFromBytecode, convertChars, includeInstVars) {
        //Returns result of at:put: or sets success false
        var array = this.stackNonInteger(0);
        var index = this.stackPos16BitInt(2); //note non-int returns zero
        if (!this.success) return array;
        var info = this.atPutCache[(array.oop >> 1) & this.atCacheMask];
        if (info.array !== array)
            info = this.makeAtCacheInfo(this.atPutCache, this.vm.specialSelectors[17], array, convertChars, includeInstVars);
        if (index<1 || index>info.size) {this.success = false; return array;}
        var objToPut = this.vm.stackValue(1);
        if (includeInstVars)  // pointers
            return array.pointers[index-1] = objToPut;
        if (array.pointers && !array.bytes) // pointers, but not compiled methods
            return array.pointers[index-1+info.ivarOffset] = objToPut;
        // words and bytes
        if (array.words) {  // words...
            var wordToPut = this.stackPos16BitInt(1);
            if (this.success) array.words[index-1] = wordToPut;
            return objToPut;
        }
        if (array.bytes) { // bytes...
            var byteToPut = this.checkSmallInt(objToPut);
            if (!this.success) return objToPut;
            if (byteToPut < 0 || byteToPut > 255) {this.success = false; return objToPut;}
            return array.bytes[index-1] = byteToPut;
        }
        throw "indexing problem"
    },
    objectSize: function(argCount) {
        var rcvr = this.vm.stackValue(0);
        var size = this.indexableSize(rcvr);
        if (size === -1) {this.success = false; return -1}; //not indexable
        return size;
    },
    initAtCache: function() {
        // The purpose of the at-cache is to allow fast (bytecode) access to at/atput code
        // without having to check whether this object has overridden at, etc.
        this.atCacheSize = 32; // must be power of 2
        this.atCacheMask = this.atCacheSize - 1; //...so this is a mask
        this.atCache = [];
        this.atPutCache = [];
        this.nonCachedInfo = {};
        for (var i= 0; i < this.atCacheSize; i++) {
            this.atCache.push({});
            this.atPutCache.push({});
        }
    },
    clearAtCache: function() { //clear at-cache pointers (prior to GC)
        this.nonCachedInfo.array = null;
        for (var i= 0; i < this.atCacheSize; i++) {
            this.atCache[i].array = null;
            this.atPutCache[i].array = null;
        }
    },
    makeAtCacheInfo: function(atOrPutCache, atOrPutSelector, array, convertChars, includeInstVars) {
        //Make up an info object and store it in the atCache or the atPutCache.
        //If it's not cacheable (not a non-super send of at: or at:put:)
        //then return the info in nonCachedInfo.
        //Note that info for objectAt (includeInstVars) will have
        //a zero ivarOffset, and a size that includes the extra instVars
        var cacheable = !this.vm.doSuper,           //not a super send
            instSize = array.stClass.classInstSize(),
            indexableSize = this.indexableSize(array),
            info = cacheable ? atOrPutCache[(array.oop >> 1) & this.atCacheMask] : this.nonCachedInfo;
        info.array = array;
        info.convertChars = convertChars;
        if (includeInstVars) {
            info.size = instSize + indexableSize;
            info.ivarOffset = 0;
        } else {
            info.size = indexableSize;
            info.ivarOffset = instSize;
        }
        return info;
    },
},
'basic',{
    someObject: function() {
        return this.vm.image.firstOldObject;
    },
    nextObject: function(obj) {
        var nextObj = this.vm.image.objectAfter(obj);
        return nextObj ? nextObj : 0;
    },
    someInstanceOf: function(clsObj) {
        var someInstance = this.vm.image.someInstanceOf(clsObj);
        if (someInstance) return someInstance;
        this.success = false;
        return 0;
    },
    nextInstanceAfter: function(obj) {
        var nextInstance = this.vm.image.nextInstanceAfter(obj);
        if (nextInstance) return nextInstance;
        this.success = false;
        return 0;
    },
    primitiveMakePoint: function(argCount) {
        var x = this.vm.stackValue(0);
        var y = this.vm.stackValue(1);
        this.vm.popNandPush(2, this.makePointWithXandY(x, y));
        return true;
    },
    primitiveNew: function(argCount) {
        // Create a new instance
        // Note testing for argCount is *not* the way to check indexable
        // Instead we should be checking the instSize spec
        var rcvr = this.stackNonInteger(0);
        if (!this.success || !rcvr.isClass()) return false;
        if (argCount == 0) // fixed size
            return this.popNandPushIfOK(1, this.vm.instantiateClass(rcvr, 0));
        // variable size 
        var size = this.stackInteger(1);
        if (!this.success || size < 0) return false;
        if (!((rcvr.pointers[NoteTaker.PI_CLASS_INSTSIZE] & NoteTaker.FMT_ISVARIABLE) > 0)) console.log("Failure of new: due to instSize bit not set for class " + rcvr);
        if (!((rcvr.pointers[NoteTaker.PI_CLASS_INSTSIZE] & NoteTaker.FMT_ISVARIABLE) > 0)) return false
        return this.popNandPushIfOK(2, this.vm.instantiateClass(rcvr, size));
    },



    primitiveNewMethod: function(argCount) {
        var header = this.stackInteger(0);
        var byteCount = this.stackInteger(1);
        if (!this.success) return 0;
        var litCount = (header>>9) & 0xFF;
        var method = this.vm.instantiateClass(this.vm.stackValue(2), byteCount);
        method.isCompiledMethod = true;
        method.pointers = [header];
        while (method.pointers.length < litCount+1)
            method.pointers.push(this.vm.nilObj);
        this.vm.popNandPush(1+argCount, method);
        if (this.vm.breakOnNewMethod)
            this.vm.breakOnMethod = method;
        return true;
    },
    doArrayBecome: function(doBothWays) {
	    var rcvr = this.stackNonInteger(0);
        var arg = this.stackNonInteger(1);
    	if (!this.success) return rcvr;
        this.success = this.vm.image.bulkBecome(rcvr.pointers, arg.pointers, doBothWays);
        return rcvr;
    },
    doStringReplace: function() {
        throw "need to reverse args"
        var dst = this.stackNonInteger(4);
        var dstPos = this.stackInteger(3) - 1;
        var count = this.stackInteger(2) - dstPos;
        //	if (count<=0) {this.success = false; return dst;} //fail for compat, later succeed
        var src = this.stackNonInteger(1);
        var srcPos = this.stackInteger(0) - 1;
        if (!this.success) return dst; //some integer not right
        var srcFmt = src.format;
        var dstFmt = dst.format;
    	if (dstFmt < 8)
            if (dstFmt != srcFmt) {this.success = false; return dst;} //incompatible formats
        else
            if ((dstFmt&0xC) != (srcFmt&0xC)) {this.success = false; return dst;} //incompatible formats
        if (srcFmt<4) {//pointer type objects
            var totalLength = src.pointersSize();
            var srcInstSize = src.instSize();
            srcPos += srcInstSize;
            if ((srcPos < 0) || (srcPos + count) > totalLength)
                {this.success = false; return dst;} //would go out of bounds
            totalLength = dst.pointersSize();
            var dstInstSize= dst.instSize();
            dstPos += dstInstSize;
            if ((dstPos < 0) || (dstPos + count) > totalLength)
                {this.success= false; return dst;} //would go out of bounds
            this.vm.arrayCopy(src.pointers, srcPos, dst.pointers, dstPos, count);
            return dst;
        } else if (srcFmt < 8) { //words type objects
            var totalLength = src.wordsSize();
            if ((srcPos < 0) || (srcPos + count) > totalLength)
                {this.success = false; return dst;} //would go out of bounds
            totalLength = dst.wordsSize();
            if ((dstPos < 0) || (dstPos + count) > totalLength)
                {this.success = false; return dst;} //would go out of bounds
            this.vm.arrayCopy(src.words, srcPos, dst.words, dstPos, count);
            return dst;
        } else { //bytes type objects
            var totalLength = src.bytesSize();
            if ((srcPos < 0) || (srcPos + count) > totalLength)
                {this.success = false; return dst;} //would go out of bounds
            totalLength = dst.bytesSize();
            if ((dstPos < 0) || (dstPos + count) > totalLength)
                {this.success = false; return dst;} //would go out of bounds
            this.vm.arrayCopy(src.bytes, srcPos, dst.bytes, dstPos, count);
            return dst;
        }
    },
},
'blocks', {
    primitiveRemoteCopy: function(argCount) {
        // Make a block-like outrigger to rcvr, a process
        var rcvr = this.vm.stackValue(0);
	    if (rcvr !== this.vm.activeContext) return false;
		var pc = this.vm.pc;
		var bp = this.vm.currentFrame;
		var jumpInstr = this.vm.method.bytes[pc];
		pc += jumpInstr < 0xA0 ? 1 : 2;
		var rCode = this.vm.instantiateClass(this.remoteCodeClass, 0);
		var relBP = this.indexableSize(rcvr) - bp;
		rCode.pointers[NoteTaker.PI_RCODE_FRAMEOFFSET] = relBP;
		rCode.pointers[NoteTaker.PI_RCODE_STARTINGPC] = pc;
		this.vm.popNandPush(1, rCode);
		return true;
    },
    primitiveValue: function(argCount) {
        var rCode = this.vm.stackValue(0);
        if (rCode.stClass !== this.remoteCodeClass)
            return false;
        var frame = this.indexableSize(this.vm.activeContext) - rCode.pointers[NoteTaker.PI_RCODE_FRAMEOFFSET];
        this.vm.pop(); // drop self
        this.vm.push(this.vm.pc);           // save PC and BP for remoteReturn
        this.vm.push(this.vm.currentFrame);
		this.vm.currentFrame = this.vm.loadFromFrame(frame);
		this.vm.pc = rCode.pointers[NoteTaker.PI_RCODE_STARTINGPC];
        return true;
    },
    primitiveValueGets: function(argCount) {
		var value = this.vm.stackValue(1);
        if (!this.primitiveValue(0))
            return false;
		this.vm.push(value);		// for remote return (if there is only a ld/store opcode)
		this.vm.doStore(value, this.vm.nextByte());		// TODO emulate STOREMODE
		return true;
    },
},
'scheduling',
{
    primitiveResume: function() {
        this.resume(this.vm.top());
        return true;
	},
    primitiveSuspend: function() {
        var activeProc = this.getScheduler().pointers[Squeak.ProcSched_activeProcess];
        if (this.vm.top() !== activeProc) return false;
        this.vm.popNandPush(1, this.vm.nilObj);
        this.transferTo(this.pickTopProcess());
        return true;
    },
    getScheduler: function() {
        var assn = this.vm.specialObjects[Squeak.splOb_SchedulerAssociation];
        return assn.pointers[Squeak.Assn_value];
    },
    resume: function(newProc) {
        var activeProc = this.getScheduler().pointers[Squeak.ProcSched_activeProcess];
        var activePriority = activeProc.pointers[Squeak.Proc_priority];
        var newPriority = newProc.pointers[Squeak.Proc_priority];
        if (newPriority > activePriority) {
            this.putToSleep(activeProc);
            this.transferTo(newProc);
        } else {
            this.putToSleep(newProc);
        }
    },
    putToSleep: function(aProcess) {
        //Save the given process on the scheduler process list for its priority.
        var priority = aProcess.pointers[Squeak.Proc_priority];
        var processLists = this.getScheduler().pointers[Squeak.ProcSched_processLists];
        var processList = processLists.pointers[priority - 1];
        this.linkProcessToList(aProcess, processList);
    },
    transferTo: function(newProc) {
        //Record a process to be awakened on the next interpreter cycle.
        var sched = this.getScheduler();
        var oldProc = sched.pointers[Squeak.ProcSched_activeProcess];
        sched.pointers[Squeak.ProcSched_activeProcess] = newProc;
        oldProc.pointers[Squeak.Proc_suspendedContext] = this.vm.activeContext;
        this.vm.newActiveContext(newProc.pointers[Squeak.Proc_suspendedContext]);
        newProc.pointers[Squeak.Proc_suspendedContext] = this.vm.nilObj;
        this.vm.reclaimableContextCount = 0;
        if (this.vm.breakOnFrameChanged || this.vm.breakOnFrameReturned) {
            this.vm.breakOnFrameChanged = false;
            this.vm.breakOnFrameReturned = null;
            this.vm.breakOutOfInterpreter = 'break';
        }
    },
    pickTopProcess: function() { // aka wakeHighestPriority
        //Return the highest priority process that is ready to run.
        //Note: It is a fatal VM error if there is no runnable process.
        var schedLists = this.getScheduler().pointers[Squeak.ProcSched_processLists];
        var p = schedLists.pointersSize() - 1;  // index of last indexable field
        var processList;
        do {
            if (p < 0) throw "scheduler could not find a runnable process";
            processList = schedLists.pointers[p--];
        } while (this.isEmptyList(processList));
        return this.removeFirstLinkOfList(processList);
	},    
    linkProcessToList: function(proc, aList) {
        // Add the given process to the given linked list and set the backpointer
        // of process to its new list.
        if (this.isEmptyList(aList))
            aList.pointers[Squeak.LinkedList_firstLink] = proc;
        else {
            var lastLink = aList.pointers[Squeak.LinkedList_lastLink];
            lastLink.pointers[Squeak.Link_nextLink] = proc;
        }
        aList.pointers[Squeak.LinkedList_lastLink] = proc;
        proc.pointers[Squeak.Proc_myList] = aList;
    },
    isEmptyList: function(aLinkedList) {
        return aLinkedList.pointers[Squeak.LinkedList_firstLink].isNil;
    },
    removeFirstLinkOfList: function(aList) {
        //Remove the first process from the given linked list.
        var first = aList.pointers[Squeak.LinkedList_firstLink];
        var last = aList.pointers[Squeak.LinkedList_lastLink];
        if (first === last) {
            aList.pointers[Squeak.LinkedList_firstLink] = this.vm.nilObj;
            aList.pointers[Squeak.LinkedList_lastLink] = this.vm.nilObj;
        } else {
            var next = first.pointers[Squeak.Link_nextLink];
            aList.pointers[Squeak.LinkedList_firstLink] = next;
        }
        first.pointers[Squeak.Link_nextLink] = this.vm.nilObj;
        return first;
    },
    registerSemaphore: function(specialObjIndex) {
        var sema = this.vm.top();
        if (this.isA(sema, Squeak.splOb_ClassSemaphore))
            this.vm.specialObjects[specialObjIndex] = sema;
        else
            this.vm.specialObjects[specialObjIndex] = this.vm.nilObj;
        return this.vm.stackValue(1);
    },
    primitiveWait: function() {
    	var sema = this.vm.top();
        if (!this.isA(sema, Squeak.splOb_ClassSemaphore)) return false;
        var excessSignals = sema.pointers[Squeak.Semaphore_excessSignals];
        if (excessSignals > 0)
            sema.pointers[Squeak.Semaphore_excessSignals] = excessSignals - 1;
        else {
            var activeProc = this.getScheduler().pointers[Squeak.ProcSched_activeProcess];
            this.linkProcessToList(activeProc, sema);
            this.transferTo(this.pickTopProcess());
        }
        return true;
    },
    primitiveSignal: function() {
	    var sema = this.vm.top();
        if (!this.isA(sema, Squeak.splOb_ClassSemaphore)) return false;
        this.synchronousSignal(sema);
        return true;
    },
    synchronousSignal: function(sema) {
    	if (this.isEmptyList(sema)) {
            // no process is waiting on this semaphore
            sema.pointers[Squeak.Semaphore_excessSignals]++;
        } else
            this.resume(this.removeFirstLinkOfList(sema));
        return;
    },
    primitiveSignalAtMilliseconds: function(argCount) { //Delay signal:atMs:
        var msTime = this.stackInteger(0);
        var sema = this.stackNonInteger(1);
        var rcvr = this.stackNonInteger(2);
        if (!this.success) return false;
        if (this.isA(sema, Squeak.splOb_ClassSemaphore)) {
            this.vm.specialObjects[Squeak.splOb_TheTimerSemaphore] = sema;
            this.vm.nextWakeupTick = msTime;
        } else {
            this.vm.specialObjects[Squeak.splOb_TheTimerSemaphore] = this.vm.nilObj;
            this.vm.nextWakeupTick = 0;
        }
        this.vm.popN(argCount); // return self
        return true;
	},
},
'vm settings', {
    setLowSpaceThreshold: function() {
        var nBytes = this.stackInteger(0);
        if (this.success) this.vm.lowSpaceThreshold = nBytes;
        return this.vm.stackValue(1);
    },
    primitiveVMParameter: function(argCount) {
        /* Behaviour depends on argument count:
		0 args:	return an Array of VM parameter values;
		1 arg:	return the indicated VM parameter;
		2 args:	set the VM indicated parameter. */
		var paramsArraySize = 40;
		switch (argCount) {
		    case 0:
		        var arrayObj = this.vm.instantiateClass(this.vm.specialObjects[Squeak.splOb_ClassArray], paramsArraySize);
		        arrayObj.pointers = this.vm.fillArray(paramsArraySize, 0);
		        return this.popNandPushIfOK(1, arrayObj);
		    case 1:
		        return this.popNandPushIfOK(2, 0);
		    case 2:
		        return this.popNandPushIfOK(3, 0);
		};
		return false;
    },
},
'MiscPrimitivePlugin', {
    primitiveStringHash: function(argCount) {
        // need to implement this because in older Etoys image the fallback code is wrong
        var initialHash = this.stackInteger(0);
        var stringObj = this.stackNonInteger(1);
        if (!this.success) return false;
        var stringSize = stringObj.bytesSize();
        var string = stringObj.bytes;
    	var hash = initialHash & 0x0FFFFFFF;
    	for (var i = 0; i < stringSize; i++) {
    		hash += string[i];
    		var low = hash & 0x3FFF;
    		hash = (0x260D * low + ((0x260D * (hash >>> 14) + (0x0065 * low) & 16383) * 16384)) & 0x0FFFFFFF;
    	}
    	this.vm.popNandPush(3, hash);
        return true;
    }
},
'platform', {
    primitiveQuit: function(argCount) {
        this.vm.breakOutOfInterpreter = 'break'; 
        return true;
    },
    primitiveExitToDebugger: function(argCount) {
        this.vm.breakOutOfInterpreter = 'break';
        debugger;
        return true;
    },
    primitiveBeCursor: function(argCount) {
        this.vm.popN(argCount); // return self
        return true;
    },
    primitiveBeDisplay: function(argCount) {
        this.displayBlt = this.vm.stackValue(0);
        this.vm.popN(argCount); // return self
        return true;
	},
	primitiveClipboardText: function(argCount) {
        if (argCount === 0) { // read from clipboard
            if (typeof(this.display.clipboardString) !== 'string') return false;
            this.vm.popNandPush(1, this.makeStString(this.display.clipboardString));
        } else if (argCount === 1) { // write to clipboard
            var stringObj = this.vm.top();
            if (!stringObj.bytes) return false;
            this.display.clipboardString = stringObj.bytesAsString();
            this.display.clipboardStringChanged = true;
            this.vm.pop();
        }
        return true;
	},
	primitiveCopyBits: function(argCount) { // no rcvr class check, to allow unknown subclasses (e.g. under Turtle)
        var bitbltObj = this.vm.stackValue(argCount);
        var bitblt = new users.bert.St78.vm.BitBlt(this.vm);
        if (!bitblt.loadBitBlt(bitbltObj)) return false;
        bitblt.copyBits();
        if (bitblt.destForm === this.displayBlt.pointers[NoteTaker.PI_BITBLT_DEST])
            this.showOnDisplay(bitblt, bitblt.affectedRect());
        return true;
	},
    primitiveKeyboardNext: function(argCount) {
        return this.popNandPushIfOK(argCount+1, this.checkSmallInt(this.display.keys.pop()));
    },
    primitiveKeyboardPeek: function(argCount) {
        var length = this.display.keys.length;
        return this.popNandPushIfOK(argCount+1, length ? this.checkSmallInt(this.display.keys[length - 1] || 0) : this.vm.falseObj);
    },
    primitiveMouseButtons: function(argCount) {
        return this.popNandPushIfOK(argCount+1, this.checkSmallInt(this.display.buttons));
    },
    primitiveMousePoint: function(argCount) {
        return this.popNandPushIfOK(argCount+1, this.makePointWithXandY(this.checkSmallInt(this.display.mouseX), this.checkSmallInt(this.display.mouseY)));
    },
    primitiveRelinquishProcessorForMicroseconds: function(argCount) {
        var millis = 100;
        if (argCount > 1) return false;
        if (argCount > 0) {
            var micros = this.stackInteger(0);
            if (!this.success) return false;
            this.vm.pop();
            millis = micros / 1000;
        }
        // make sure we tend to pending delays
        this.vm.interruptCheckCounter = 0;
        this.vm.isIdle = true;
        this.vm.breakOutOfInterpreter = true;
        return true;
    },
    primitiveReverseDisplay: function(argCount) {
        this.reverseDisplay = !this.reverseDisplay;
        this.redrawFullDisplay();
        return true;
    },
    redrawFullDisplay: function() {
        var bitblt = new users.bert.St78.vm.BitBlt(this.vm);
        bitblt.loadBitBlt(this.displayBlt);
        var bounds = { x: 0, y: 0, w: bitblt.clipW, h: bitblt.clipH};
        this.showOnDisplay(bitblt, bounds);
    },
    showOnDisplay: function(bitBlt, rect) {
        if (!rect) return;
        var ctx = this.display.ctx;
        var pixels = ctx.createImageData(rect.w, rect.h);
        var dest = new Uint32Array(pixels.data.buffer);
        var leftMask = 0x8000 >> (rect.x & 15);
        var source = bitBlt.destBits;
        var srcY = rect.y;
        for (var y = 0; y < rect.h; y++) {
            var srcIndex = (bitBlt.destPitch * srcY + (rect.x >> 4)) * 2;
            var mask = leftMask;
            var src = source.getUint16(srcIndex);
            var dstIndex = pixels.width * y;
            for (var x = 0; x < rect.w; x++) {
                dest[dstIndex++] = src & mask ? 0xFF000000 : 0xFFFFFFFF;
                if (!(mask = mask >> 1)) {
                    mask = 0x8000;
                    srcIndex += 2;
                    if (srcIndex < source.byteLength)
                        src = source.getUint16(srcIndex);
                }
            }
            srcY++;
        };
      ctx.putImageData(pixels, rect.x, rect.y);
    },
    primitiveForceDisplayUpdate: function(argCount) {
        // not needed, we show everything immediately
        return true;
    },
    primitiveScreenSize: function(argCount) {
        return this.popNandPushIfOK(argCount+1, this.makePointWithXandY(this.display.width, this.display.height));
    },
    primitiveSetFullScreen: function(argCount) {
        return false; // fail for now
    },
    primitiveTestDisplayDepth: function(argCount) {
        var supportedDepths =  [1, 2, 4, 8, 16, 32]; // match showOnDisplay()
        return this.pop2andPushBoolIfOK(supportedDepths.indexOf(this.stackInteger(0)) >= 0);
    },

	millisecondClockValue: function() {
        //Return the value of the millisecond clock as an integer.
        //Note that the millisecond clock wraps around periodically.
        //The range is limited to SmallInteger maxVal / 2 to allow
        //delays of up to that length without overflowing a SmallInteger."
        return (Date.now() - this.vm.startupTime) & this.vm.millisecondClockMask;
	},
	secondClock: function() {
	    var date = new Date();
        var seconds = date.getTime() / 1000 | 0;    // milliseconds -> seconds
        seconds -= date.getTimezoneOffset() * 60;   // make local time
        seconds += ((69 * 365 + 17) * 24 * 3600);   // adjust epoch from 1970 to 1901
        return this.pos16BitIntFor(seconds);
    },
});
Object.subclass('users.bert.St78.vm.BitBlt',
'initialization', {
    initialize: function(vm) {
        this.vm = vm;
    }, 
    loadBitBlt: function(bitbltObj) {
        var bitblt = bitbltObj.pointers;
        var func = bitblt[NoteTaker.PI_BITBLT_FUNCTION];
        this.destRule = func & 3;           // set, or, xor, and
        this.sourceRule = (func >> 2) & 3;  // src, ~src, halftone in src, halftone
        this.noSource = this.sourceRule === 3;
        this.sourceFn = this.makeSourceFn(this.sourceRule);
        this.destFn = this.makeDestFn(this.destRule);
        this.halftone = this.sourceRule >= 2 ? this.loadHalftone(bitblt[NoteTaker.PI_BITBLT_GRAY]) : null;
        this.destBits = this.loadBits(bitblt[NoteTaker.PI_BITBLT_DESTBITS]);
        this.destPitch = bitblt[NoteTaker.PI_BITBLT_DESTRASTER];
        this.destX = bitblt[NoteTaker.PI_BITBLT_DESTX];
        this.destY = bitblt[NoteTaker.PI_BITBLT_DESTY];
        this.width = bitblt[NoteTaker.PI_BITBLT_WIDTH];
        this.height = bitblt[NoteTaker.PI_BITBLT_HEIGHT];
        if (!this.noSource) {
            this.sourceBits = this.loadBits(bitblt[NoteTaker.PI_BITBLT_SOURCEBITS]);
            this.sourcePitch = bitblt[NoteTaker.PI_BITBLT_SOURCERASTER];
            this.sourceX = bitblt[NoteTaker.PI_BITBLT_SOURCEX];
            this.sourceY = bitblt[NoteTaker.PI_BITBLT_SOURCEY];
            this.sourceForm = bitblt[NoteTaker.PI_BITBLT_SOURCE];
        }
        this.clipX = bitblt[NoteTaker.PI_BITBLT_CLIPX];
        this.clipY = bitblt[NoteTaker.PI_BITBLT_CLIPY];
        this.clipW = bitblt[NoteTaker.PI_BITBLT_CLIPWIDTH];
        this.clipH = bitblt[NoteTaker.PI_BITBLT_CLIPHEIGHT];
        this.destForm = bitblt[NoteTaker.PI_BITBLT_DEST];
        return true;
    },
    makeSourceFn: function(rule) {
        switch(rule) {
            case 0: return function(src, halftone, dst) { return src };
            case 1: return function(src, halftone, dst) { return ~src };
            case 2: return function(src, halftone, dst) { return (src & halftone) | (~src & dst) };
            case 3: return function(src, halftone, dst) { return halftone };
        }
        throw "bitblt rule not implemented yet";
    },
    makeDestFn: function(rule) {
        switch(rule) {
            case 0: return function(val, dst) { return val };
            case 1: return function(val, dst) { return val | dst };
            case 2: return function(val, dst) { return val ^ dst };
            case 3: return function(val, dst) { return val & dst };
        }
    },
    loadBits: function(bitsOop) {
        // make the bytes in bitOop accessible as a word array
        if (!bitsOop.bytesAsWords) {
            // convert its bytes to a Uint8Array
            bitsOop.bytes = new Uint8Array(bitsOop.bytes);
            // make a dataview on the same data buffer
            bitsOop.bytesAsWords = new DataView(bitsOop.bytes.buffer);
        }
        return bitsOop.bytesAsWords;
    },
    loadHalftone: function(int) {
        // halftone is 4x4 bits. Expand to 16x4 bits for quick access
        if (int.pointers)  // large int
            int = int.largeIntegerValue();
        var words = [];
        for (i = 0; i < 4; i++) {
            var word = (int >> (i * 4)) & 0x000F;
            word += word << 4;
            word += word << 8;
            words.push(word);
        }
        return words;
    },
},
'blitting', {
    copyBits: function() {
        this.bitCount = 0;
        this.clipRange();
        if (this.bbW <= 0 || this.bbH <= 0) return;
        this.destMaskAndPointerInit();
        /* Choose and perform the actual copy loop. */
        if (this.noSource) {
            this.copyLoopNoSource();
        } else {
            this.checkSourceOverlap();
            this.sourceSkewAndPointerInit();
            this.copyLoop();
        }
    },
    copyLoopNoSource: function() {
        //	Faster copyLoop when source not used.  hDir and vDir are both
        //	positive, and perload and skew are unused
        var halftoneWord = 0xFFFF;
        for (var i = 0; i < this.bbH; i++) { // vertical loop
            if (this.halftone) halftoneWord = this.halftone[(this.dy + i) % 4];
            // First word in row is masked
            var destMask = this.mask1;
            var destWord = this.destBits.getUint16(this.destIndex * 2);
            var mergeWord = this.destFn(halftoneWord, destWord);
            destWord = (destMask & mergeWord) | (destWord & (~destMask));
            this.destBits.setUint16((this.destIndex++) * 2, destWord);
            destMask = 0xFFFF;
            //the central horizontal loop requires no store masking */
            if (this.destRule === 0) // Store rule requires no dest merging
                for (var word = 2; word < this.nWords; word++)
                    this.destBits.setUint16((this.destIndex++) * 2, halftoneWord);
            else
                for (var word = 2; word < this.nWords; word++) {
                        destWord = this.destBits.getUint16(this.destIndex * 2);
                        mergeWord = this.destFn(halftoneWord, destWord);
                        this.destBits.setUint16((this.destIndex++) * 2, mergeWord);
                }
            //last word in row is masked
            if (this.nWords > 1) {
                    destMask = this.mask2;
                    destWord = this.destBits.getUint16(this.destIndex * 2);
                    mergeWord = this.destFn(halftoneWord, destWord);
                    destWord = (destMask & mergeWord) | (destWord & (~destMask));
                    this.destBits.setUint16((this.destIndex++) * 2, destWord);
            }
            this.destIndex += this.destDelta;
        }
    },
    copyLoop: function() {
        // this version of the inner loop assumes we do have a source
        var sourceLimit = this.sourceBits.length;
        var hInc = this.hDir;
        // init skew (the difference in word alignment of source and dest)
        var unskew;
        var skewMask;
        if (this.skew == -16) {
            this.skew = unskew = skewMask = 0;
        } else {
            if (this.skew < 0) {
                unskew = this.skew + 16;
                skewMask = 0xFFFF << -this.skew;
            } else {
                if (this.skew === 0) {
                    unskew = 0;
                    skewMask = 0xFFFF;
                } else {
                    unskew = this.skew - 16;
                    skewMask = 0xFFFF >> this.skew;
                }
            }
        }
        var notSkewMask = ~skewMask;
        // init halftones
        var halftoneWord;
        var halftoneHeight;
       	if (this.halftone) {
            halftoneWord = this.halftone[0];
            halftoneHeight = this.halftone.length;
        } else {
            halftoneWord = 0xFFFF;
            halftoneHeight = 0;
        }
        // now loop over all lines
        var y = this.dy;
        for (var i = 1; i <= this.bbH; i++) {
            if (halftoneHeight > 1) {
                halftoneWord = this.halftone.words[y % halftoneHeight];
                y += this.vDir;
            }
            var prevWord;
            if (this.preload) {
                prevWord = this.sourceBits.getUint16(this.sourceIndex * 2);
                this.sourceIndex += hInc;
            } else {
                prevWord = 0;
            }
            var destMask = this.mask1;
            /* pick up next word */
            var thisWord = this.sourceBits.getUint16(this.sourceIndex * 2);
            this.sourceIndex += hInc;
            /* 16-bit rotate */
            var skewWord = ((unskew < 0 ? ( (prevWord & notSkewMask) >> -unskew) : ( (prevWord & notSkewMask) << unskew)))
                | (((this.skew < 0) ? ( (thisWord & skewMask) >> -this.skew) : ( (thisWord & skewMask) << this.skew)));
            prevWord = thisWord;
            var destWord = this.destBits.getUint16(this.destIndex * 2);
            var mergeWord = this.destFn(this.sourceFn(skewWord, halftoneWord, destWord), destWord);
            destWord = (destMask & mergeWord) | (destWord & (~destMask));
            this.destBits.setUint16(this.destIndex * 2, destWord);
            //The central horizontal loop requires no store masking */
            this.destIndex += hInc;
            destMask = 0xFFFF;
            if (this.destRule === 0 && this.sourceRule !== 2) { //Store mode avoids dest merge function
                if ((this.skew === 0) && (this.sourceRule === 0)) {
                    //Non-skewed and no sourceFn: fast copy. TODO: destBits.set(sourceBits.subarray(...)) ?
                    if (this.hDir == -1) {
                        for (var word = 2; word < this.nWords; word++) {
                            thisWord = this.sourceBits.getUint16(this.sourceIndex * 2);
                            this.destBits.setUint16(this.destIndex * 2, thisWord);
                            this.sourceIndex += hInc;
                            this.destIndex += hInc;
                        }
                    } else {
                        for (var word = 2; word < this.nWords; word++) {
                            this.destBits.setUint16(this.destIndex * 2, prevWord);
                            prevWord = this.sourceBits.getUint16(this.sourceIndex * 2);
                            this.destIndex += hInc;
                            this.sourceIndex += hInc;
                        }
                    }
                } else {
                    //skewed and/or source function
                    for (var word = 2; word < this.nWords; word++) {
                        thisWord = this.sourceBits.getUint16(this.sourceIndex * 2);
                        this.sourceIndex += hInc;
                        /* 16-bit rotate */
                        skewWord = (((unskew < 0) ? ( (prevWord & notSkewMask) >> -unskew) : ( (prevWord & notSkewMask) << unskew)))
                            | (((this.skew < 0) ? ( (thisWord & skewMask) >> -this.skew) : ( (thisWord & skewMask) << this.skew)));
                        prevWord = thisWord;
                        this.destBits.setUint16(this.destIndex * 2, this.sourceFn(skewWord, halftoneWord, null));
                        this.destIndex += hInc;
                    }
                }
            } else { //Dest merging here...
                for (var word = 2; word < this.nWords; word++) {
                    thisWord = this.sourceBits.getUint16(this.sourceIndex * 2); //pick up next word
                    this.sourceIndex += hInc;
                    /* 16-bit rotate */
                    skewWord = (((unskew < 0) ? ( (prevWord & notSkewMask) >> -unskew) : ( (prevWord & notSkewMask) << unskew)))
                        | (((this.skew < 0) ? ( (thisWord & skewMask) >> -this.skew) : ( (thisWord & skewMask) << this.skew)));
                    prevWord = thisWord;
                    destWord = this.destBits.getUint16(this.destIndex * 2);
                    mergeWord = this.destFn(this.sourceFn(skewWord, halftoneWord, destWord), destWord);
                    this.destBits.setUint16(this.destIndex * 2, mergeWord);
                    this.destIndex += hInc;
                }
            } 
            // last word with masking and all
            if (this.nWords > 1) {
                destMask = this.mask2;
                if (this.sourceIndex >= 0 && this.sourceIndex < sourceLimit)
                //NOTE: we are currently overrunning source bits in some cases
                //this test makes up for it.
                    thisWord = this.sourceBits.getUint16(this.sourceIndex * 2); //pick up next word
                this.sourceIndex += hInc;
                /* 16-bit rotate */
                skewWord = (((unskew < 0) ? ((prevWord & notSkewMask) >> -unskew) : ((prevWord & notSkewMask) << unskew)))
                    | (((this.skew < 0) ? ( (thisWord & skewMask) >> -this.skew) : ( (thisWord & skewMask) << this.skew)));
                destWord = this.destBits.getUint16(this.destIndex * 2);
                mergeWord = this.destFn(this.sourceFn(skewWord, halftoneWord, destWord), destWord);
                destWord = (destMask & mergeWord) | (destWord & (~destMask));
                this.destBits.setUint16(this.destIndex * 2, destWord);
                this.destIndex += hInc;
            }
            this.sourceIndex += this.sourceDelta;
            this.destIndex += this.destDelta;
        }
    },
    pickSourcePixels: function(nPixels, srcMask, dstMask, srcShiftInc, dstShiftInc) {
        /*	Pick nPix pixels starting at srcBitIndex from the source, map by the
        color map, and justify them according to dstBitIndex in the resulting destWord. */
        var sourceWord = this.sourceBits[this.sourceIndex];
        var destWord = 0;
        var srcShift = this.srcBitShift; // put into temp for speed
        var dstShift = this.dstBitShift;
        var nPix = nPixels;
        // always > 0 so we can use do { } while(--nPix);
       do {
            var sourcePix = (sourceWord >>> srcShift) & srcMask;
            var destPix = this.mapPixel(sourcePix);
            // adjust dest pix index
            destWord = destWord | ((destPix & dstMask) << dstShift);
            // adjust source pix index
            dstShift += dstShiftInc;
            if ((srcShift += srcShiftInc) & 0xFFFFFFE0) {
                srcShift += 16;
                sourceWord = this.src.bits[++sourceIndex];
            }
        } while (--nPix);
        this.srcBitShift = srcShift;  // Store back
        return destWord;
    },
    sourceSkewAndPointerInit: function() {
        var sxLowBits = this.sx & 15;
        var dxLowBits = this.dx & 15;
        // check if need to preload buffer
        // (i.e., two words of source needed for first word of destination)
        var dWid;
        if (this.hDir > 0) {
            dWid = ((this.bbW < (16 - dxLowBits)) ? this.bbW : (16 - dxLowBits));
            this.preload = (sxLowBits + dWid) + 1 > 16;
        } else {
            dWid = ((this.bbW < (dxLowBits + 1)) ? this.bbW : (dxLowBits + 1));
            this.preload = (sxLowBits - dWid) + 1 < 0;
        }
        this.skew = sxLowBits - dxLowBits;
        if (this.preload) {
            if (this.skew < 0) this.skew += 16;
            else this.skew -= 16;
        }
        /* calculate increments from end of one line to start of next */
        this.sourceIndex = (this.sy * this.sourcePitch) + (this.sx / 16 | 0);
        this.sourceDelta = (this.sourcePitch * this.vDir) - (this.nWords * this.hDir);
        if (this.preload) this.sourceDelta -= this.hDir;
    },
    destMaskAndPointerInit: function() {
        var startBits = 16 - (this.dx & 15); //how many pixels in first word
        var endBits = (((this.dx + this.bbW) - 1) & 15) + 1;
        this.mask1 = 0xFFFF >> (16 - startBits);
        this.mask2 = 0xFFFF << (16 - endBits);
        if (this.bbW < startBits) { //start and end in same word, so merge masks
            this.mask1 = this.mask1 & this.mask2;
            this.mask2 = 0;
            this.nWords = 1;
        } else
            this.nWords = (((this.bbW - startBits) + 15) / 16 | 0) + 1;
        this.hDir = this.vDir = 1; //defaults for no overlap with source
        this.destIndex = (this.dy * this.destPitch) + (this.dx / 16 | 0); //both these in words, not bytes
        this.destDelta = (this.destPitch * this.vDir) - (this.nWords * this.hDir);
    },
    clipRange: function() {
        // initialize sx,sy, dx,dy, bbW,bbH to the intersection of source, dest, and clip
        // let's assume everything is alright ... 
        // intersect with destForm bounds
        if (this.clipX < 0) {this.clipW += this.clipX; this.clipX = 0; }
        if (this.clipY < 0) {this.clipH += this.clipY; this.clipY = 0; }
        if ((this.clipX + this.clipW) > this.destWidth) {this.clipW = this.destWidth - this.clipX; }
        if ((this.clipY + this.clipH) > this.destHeight) {this.clipH = this.destHeight - this.clipY; }
        // intersect with clipRect
        var leftOffset = Math.max(this.clipX - this.destX, 0);
        this.sx = this.sourceX + leftOffset;
        this.dx = this.destX + leftOffset;
        this.bbW = this.width - leftOffset;
        var rightOffset = (this.dx + this.bbW) - (this.clipX + this.clipW);
    	if (rightOffset > 0)
    		this.bbW -= rightOffset;
        var topOffset = Math.max(this.clipY - this.destY, 0);
        this.sy = this.sourceY + topOffset;
        this.dy = this.destY + topOffset;
        this.bbH = this.height - topOffset;
        var bottomOffset = (this.dy + this.bbH) - (this.clipY + this.clipH);
    	if (bottomOffset > 0)
    		this.bbH -= bottomOffset;
        // intersect with sourceForm bounds
    	if (this.noSource) return;
    	if (this.sx < 0) {
    		this.dx -= this.sx;
    		this.bbW += this.sx;
    		this.sx = 0;
    	}
    	if ((this.sx + this.bbW) > this.sourceWidth)
    		this.bbW -= (this.sx + this.bbW) - this.sourceWidth;
    	if (this.sy < 0) {
    		this.dy -= this.sy;
    		this.bbH += this.sy;
    		this.sy = 0;
    	}
    	if ((this.sy + this.bbH) > this.sourceHeight)
    		this.bbH -= (this.sy + this.bbH) - this.sourceHeight;
	},
    checkSourceOverlap: function() {
        if (this.sourceForm === this.destForm && this.dy >= this.sy) {
            if (this.dy > this.sy) {
                this.vDir = -1;
                this.sy = (this.sy + this.bbH) - 1;
                this.dy = (this.dy + this.bbH) - 1;
            } else {
                if (this.dy === this.sy && this.dx > this.sx) {
                    this.hDir = -1;
                    this.sx = (this.sx + this.bbW) - 1; //start at right
                    this.dx = (this.dx + this.bbW) - 1;
                    if (this.nWords > 1) {
                        var t = this.mask1; //and fix up masks
                        this.mask1 = this.mask2;
                        this.mask2 = t;
                    }
                }
            }
            this.destIndex = (this.dy * this.destPitch) + (this.dx / 16 | 0); //recompute since dx, dy change
            this.destDelta = (this.destPitch * this.vDir) - (this.nWords * this.hDir);
		}
    },
},
'accessing', {
    affectedRect: function() {
        if (this.bbW <= 0 || this.bbH <= 0) return null;
        var affectedL, affectedR, affectedT, affectedB;
        if (this.hDir > 0) {
            affectedL = this.dx;
            affectedR = this.dx + this.bbW;
        } else {
            affectedL = (this.dx - this.bbW) + 1;
            affectedR = this.dx + 1;
        }
        if (this.vDir > 0) {
            affectedT = this.dy;
            affectedB = this.dy + this.bbH;
        } else {
            affectedT = (this.dy - this.bbH) + 1;
            affectedB = this.dy + 1; }
        return {x: affectedL, y: affectedT, w: affectedR-affectedL, h: affectedB-affectedT};
    },
});

Object.subclass('users.bert.St78.vm.InstructionPrinter',
'initialization', {
    initialize: function(method, vm) {
        this.method = method;
        this.vm = vm;
    },
},
'printing', {
    printInstructions: function(indent, highlight, highlightPC) {
        // all args are optional
        this.indent = indent;           // prepend to every line except if highlighted
        this.highlight = highlight;     // prepend to highlighted line
        this.highlightPC = highlightPC; // PC of highlighted line
        if (this.method.stClass.oop !== NoteTaker.OTI_CLCOMPILEDMETHOD)
            return "<not a CompiledMethod>";
        this.result = '';
        this.scanner = new users.bert.St78.vm.InstructionStream(this.method, this.vm);
        this.oldPC = this.scanner.pc;
        var end = this.method.methodEndPC();
    	while (this.scanner.pc < end)
        	this.scanner.interpretNextInstructionFor(this);
        return this.result;
    },
    print: function(instruction) {
        if (this.oldPC === this.highlightPC) {
            if (this.highlight) this.result += this.highlight;
        } else {
            if (this.indent) this.result += this.indent;
        }
        this.result += this.oldPC + " <";
        for (var i = this.oldPC; i < this.scanner.pc; i++) {
            if (i > this.oldPC) this.result += " ";
            this.result += (this.method.bytes[i]+0x100).toString(16).substr(-2).toUpperCase(); // padded hex
        }
        this.result += "> " + instruction + "\n";
        // if pc is in the middle of an extended instruction, restart from there
        if (this.highlightPC > this.oldPC && this.highlightPC < this.scanner.pc) {
            this.oldPC = this.highlightPC;
            this.scanner.pc = this.highlightPC;
            this.scanner.interpretNextInstructionFor(this);
            this.result = this.result.slice(0,-1) + " <partial instr>\n";
        }
        this.oldPC = this.scanner.pc;
    },
    printLiteral: function(index) {
        var literals = this.method.pointers,
            literal = literals && literals[index];
        if (!literal) return "invalid literal";
        return literal.stInstName ? literal.stInstName() : literal.toString();
    },
},
'decoding', {

    doDup: function() {
    	this.print('dup');
    },
    doPop: function() {
    	this.print('pop');
    },
    doSuper: function() {
    	this.print('do super send');
    },
	jump: function(delta, conditional) {
        this.print((conditional ? 'jumpIfFalse: ' : 'jumpTo: ') + (this.scanner.pc + delta));
    },


    doReturn: function() {
	    this.print('return');
    },




	pushActiveContext: function() {
	    this.print('push: thisContext');
    },
    pushConstant: function(obj) {
    	this.print('pushConst: ' + (obj.stInstName ? obj.stInstName() : obj));
    },
    pushLiteralVariable: function(index) {
        var lit = this.printLiteral(index);
        this.print('pushLitRef: ' + index + ' (' + lit + ')');
    },
	pushReceiver: function() {
	    this.print('push: self');
    },
    pushReceiverVariable: function(offset) { 
    	this.print('pushInstVar: ' + offset);
    },
	pushTemporaryVariable: function(offset) {
	    this.print('pushArgOrTemp: ' + offset);
    },
    send: function(selector) {
    	this.print( 'send: #' + (selector.bytesAsString ? selector.bytesAsString() : selector));
    },
    storeIntoLiteralVariable: function(index, doPop) {
        var lit = this.printLiteral(index);
        this.print((doPop ? 'pop' : 'store') + 'IntoLitRef: ' + index + ' (' + lit + ')');
    },
    storeIntoReceiverVariable: function(offset, doPop) { 
    	this.print((doPop ? 'pop' : 'store') + 'IntoInstVar: ' + offset);
    },
	storeIntoTemporaryVariable: function(offset, doPop) {
	    this.print((doPop ? 'pop' : 'store') + 'IntoArgOrTemp: ' + offset);
    },
    doRemoteReturn: function() {
        this.print('remote return');
    }

});

Object.subclass('users.bert.St78.vm.InstructionStream',
'initialization', {
    initialize: function(method, vm) {
        this.vm = vm;
        this.method = method;
        this.pc = method.methodStartPC();
        this.specialConstants = ['-1', '0', '1', '2', '10', 'nil', 'false', 'true'];
        this.specialSelectors = ['+', '-', '<', '>', '≤', '≥', '=', '≠', '*', '/', '\\', '⦿',
        'lshift:', 'lxor:', 'land:', 'lor:', '◦', '◦←', 'next', 'next←', 'length', '≡',
        'is:', 'append:', 'class', 'remoteCopy', 'eval', 'new', 'new:', 'x', 'y', 'asStream'];
    },
},
'decoding',
{
    interpretNextInstructionFor: function(client) {
    	// Send to the argument, client, a message that specifies the type of the next instruction.
    	var method = this.method;
    	var byte = method.bytes[this.pc++];
    	var offset = byte & 0xF;
    	switch (byte >> 4) {
    	case 0: return client.pushReceiverVariable(offset);
    	case 1: return client.pushTemporaryVariable(offset);
    	case 2: return client.pushConstant(method.methodGetLiteral(offset));
    	case 3: return client.pushConstant(method.methodGetLiteral(offset + 16));
    	case 4: return client.pushLiteralVariable(offset);
    	case 5: return client.pushLiteralVariable(offset + 16);
    	case 6: return client.pushLiteralVariable(offset + 32);
    	case 7:
            if (offset===1) return client.pushReceiver()
			if (offset < 8) throw "unusedBytecode";
			return client.pushConstant(this.specialConstants[offset - 8]);
    	case 8: // sundry
    	    var doPop = false;
    	    switch (offset) {
    	        case 0: // ext pop
    	            doPop = true;
    	        case 1: // ext store
    	            var byte2 = this.method.bytes[this.pc++];
    	            var offset2 = byte2 & 0xF;
                    switch (byte2 >> 4) {
                        case 0: return client.storeIntoReceiverVariable(offset2, doPop);
                        case 1: return client.storeIntoTemporaryVariable(offset2, doPop);
                    	case 4: return client.storeIntoLiteralVariable(offset2, doPop);
                    	case 5: return client.storeIntoLiteralVariable(offset2 + 16, doPop);
                    	case 6: return client.storeIntoLiteralVariable(offset2 + 32, doPop);
                    	case 8: // double-extended
            	            var byte3 = this.method.bytes[this.pc++];
                    	    switch (offset2) {
                    	        case 8: return client.storeIntoReceiverVariable(byte3, doPop);
                    	        case 9: return client.storeIntoTemporaryVariable(byte3, doPop);
                    	        case 11: return client.storeIntoLiteralVariable(byte3, doPop);
                    	    }
                    }
                    throw "unusedBytecode";
    	        case 2: return client.doPop();
    	        case 3: return client.doReturn();
    	        case 4: return client.doRemoteReturn();
    	        case 5: return client.pushActiveContext();
    	        case 6: return client.doSuper();
    	        case 7: return client.pushReceiver();
    	        case 8: return client.pushReceiverVariable(this.method.bytes[this.pc++]);
    	        case 9: return client.pushTemporaryVariable(this.method.bytes[this.pc++]);
    	        case 0xA: return client.pushConstant(method.methodGetLiteral(this.method.bytes[this.pc++]));
        	    case 0xB: return client.pushLiteralVariable(this.method.bytes[this.pc++]);
            	case 0xC: return client.send(method.methodGetLiteral(this.method.bytes[this.pc++]));
            	case 0xF: return client.doBreakpoint();
    	    }
    	    throw "unusedBytecode";
    	case 9: return client.jump((offset&7)+1, offset&8);
    	case 0xA: return client.jump((((offset&7) - 4) * 256) + this.method.bytes[this.pc++], offset&8);
    	case 0xB: return client.send(this.specialSelectors[offset]);
    	case 0xC: return client.send(this.specialSelectors[offset+16]);
    	case 0xD: return client.send(method.methodGetLiteral(offset));
    	case 0xE: return client.send(method.methodGetLiteral(offset + 16));
    	case 0xF: return client.send(method.methodGetLiteral(offset + 32));
    	}
    },

});

}) // end of module
