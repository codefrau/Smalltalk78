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
    OOP_NIL: 0,
    OOP_FALSE: 2,
    OOP_TRUE: 4,
    OOP_THEPROCESS: 6,
    OOP_SMALLTALK: 8,

    // known classes
    OOP_CLCLASS: 0x20,
    OOP_CLINTEGER: 0x40,	// class of SmallIntegers
    OOP_CLSTRING: 0x60,
    OOP_CLVECTOR: 0x80,
    OOP_CLSTREAM: 0xa0,
    OOP_CLFLOAT: 0xc0,
    OOP_CLPROCESS: 0xe0,
    OOP_CLREMOTECODE: 0x100,
    OOP_CLPOINT: 0x120,
    OOP_CLNATURAL: 0x140,
    OOP_CLLARGEINTEGER: 0x160,
    OOP_CLUNIQUESTRING: 0x1a0,
    OOP_CLCOMPILEDMETHOD: 0x1e0,
    OOP_CLVLENGTHCLASS: 0x9c0,

    OOP_MASK: 0x1F,       // mask for class oops
    OOP_TAG_SMALL: 0x1E,  // tag for 16 bit size header
    OOP_TAG_LARGE: 0x1F,  // tag for 32 bit size header

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
	PC_BIAS: 2,	// due to NT's shorter header format
	
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

Object.subclass('users.bert.St78.vm.ObjectTableReader',
'about', {
    about: function() {
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
        for (var oti = 0; oti < this.ot.length; oti += 4) {
            var oop = oti / 2;      // 1 more bit for our oops so we get up to 32 K objects
            if (this.refCountOf(oop)) {
                oopMap[oop] = new users.bert.St78.vm.Object(oop);
            }
        }
        for (var oop in oopMap)
            oopMap[oop].readFromObjectTable(this, oopMap);
        return oopMap;
    }
}, 
'object access', {
    otAt: function(oop) {
        // Return the OT entry for the oop
        // Decode two two-byte numbers into one 32-bit number
        var i = oop * 2,
            val = 0;
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
        return (this.fieldOfObject(0, oop) & 0xFFC0) / 2; // our oops are half the original
    },
    refCountOf: function (oop) {
        return this.otAt(oop) >>> 24;
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
        oop: unique integer (16 bits, lsb is 0, in classes 5 lower bits are 0)
        mark: boolean (used only during GC, otherwise false)
        nextObject: linked list of objects in old space (new space objects do not have this yet)
    }

    Object Table
    ============
    There is no object table. Objects use direct references. We have immediate untagged ints (+/-16K).
    The snapshot image format uses 16 bit words for oops and tags the ints.

    */    
    }
},
'initializing', {
    initialize: function(oopMap, name, doPatches) {
        this.name = name;
        this.maxTenuresBeforeGC = 1000;
        this.tenuresSinceLastGC = 0;
        this.gcCount = 0;
        this.newSpaceCount = 0;
        this.oldSpaceCount = 0;
        this.oldSpaceBytes = 0;
        this.nextTempOop = -2;      // new objects get negative preliminary oops
        this.freeOops = {};         // pool for real oops
        this.freeClassOops = {};    // pool for real class oops (lower bits 0)
        // link all objects into oldspace
        var prevObj;
        for (var oop = 0; oop < 0xFFFF; oop += 2)
            if (oopMap[oop]) {
                this.oldSpaceCount++;
                this.oldSpaceBytes += oopMap[oop].totalBytes();
                if (prevObj) prevObj.nextObject = oopMap[oop];
                prevObj = oopMap[oop];
            } else {
                (oop & NoteTaker.OOP_MASK ? this.freeOops : this.freeClassOops)[oop] = true;
            }
        this.firstOldObject = oopMap[0];
        this.lastOldObject = prevObj;
        this.initKnownObjects(oopMap);
        this.initCompiledMethods(oopMap, doPatches);
        console.log("Loaded image " + this.name);
    },
    initKnownObjects: function(oopMap) {
        oopMap[NoteTaker.OOP_NIL].isNil = true;
        oopMap[NoteTaker.OOP_TRUE].isTrue = true;
        oopMap[NoteTaker.OOP_FALSE].isFalse = true;
        this.globals = oopMap[NoteTaker.OOP_SMALLTALK];
        this.userProcess = oopMap[NoteTaker.OOP_THEPROCESS];
        this.specialOopsVector = this.globalNamed('SpecialOops');
    },
    initCompiledMethods: function(oopMap, doPatches) {
        // make proper pointer objects for literals encoded in bytes
        var cmClass = this.objectFromOop(NoteTaker.OOP_CLCOMPILEDMETHOD, oopMap),
            cm = this.someInstanceOf(cmClass);
        while (cm) {
            cm.methodInitLits(this, oopMap, doPatches);
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
    selectorNamed: function(name) {
        var symbolClass = this.objectFromOop(NoteTaker.OOP_CLUNIQUESTRING),
            symbol = this.someInstanceOf(symbolClass);
        while (symbol) {
            if (name.length == symbol.bytes.length && name == symbol.bytesAsString())
                return symbol;
            symbol = this.nextInstanceAfter(symbol);
        }
    },
    globalNamed: function(name) {
        return this.globalRefNamed(name).pointers[NoteTaker.PI_OBJECTREFERENCE_VALUE];
    },
    smallifyLargeInts: function() {
        // visit every pointer field of every object, converting smallable LargeInts to Integers
        // We do this because the normal ST-76 range is +-32K
        var lgIntClass = this.objectFromOop(NoteTaker.OOP_CLLARGEINTEGER),
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

    fullGC: function() {
        // Old space is a linked list of objects - each object has an "nextObject" reference.
        // New space objects do not have that pointer, they are garbage-collected by JavaScript.
        // But they have an allocation id so the survivors can be ordered on tenure.
        // The "nextObject" references are created by collecting all new objects, 
        // and then linking them into old space.
        // Note: after an old object is released, its "nextObject" ref must still allow traversal
        // of all remaining objects. This is so enumeration works despite GC.

        var newObjects = this.markReachableObjects();
        var removedObjects = this.removeUnmarkedOldObjects();
        this.appendToOldObjects(newObjects);
        this.relinkRemovedObjects(removedObjects);
        console.log(Strings.format("GC: %s allocations, %s released, %s tenured, now %s total (%s bytes)", 
            this.newSpaceCount, newObjects.length, removedObjects.length, this.oldSpaceCount, this.oldSpaceBytes));
        this.newSpaceCount = 0;
        this.nextTempOop = -2;
        this.gcCount++;
    },
    allocateOopFor: function(anObj) {
        // get an oop from the pool of unused oops
        var isClass = anObj.isClass(),
            pool = isClass ? this.freeClassOops : this.freeOops;
        for (var oopStr in pool) {
            delete pool[oopStr];
            return anObj.oop = parseInt(oopStr);
        }
        throw isClass ? "too many classes" : "too many objects";
    },
    freeOopFor: function(anObj) {
        if (anObj.oop > 0) {
            (anObj.oop & NoteTaker.OOP_MASK ? this.freeOops : this.freeClassOops)[anObj.oop] = true;
            anObj.oop = null;
        } else throw "attempt to free invalid oop";
    },
    markReachableObjects: function() {
        // Visit all reachable objects and mark them.
        // Return surviving new objects
        var todo = [this.globals, this.vm.activeContext];
        if (this.vm.primHandler.displayBlt) // stored in image header so must be retained
            todo.push(this.vm.primHandler.displayBlt);
        var newObjects = [];
        while (todo.length > 0) {
            var object = todo.pop();
            if (object.mark) continue;    // objects are added to todo more than once 
            if (object.oop < 0)           // it's a new object
                newObjects.push(object);
            object.mark = true;           // mark it
            if (!object.stClass.mark)     // trace class if not marked
                todo.push(object.stClass);
            var body = object.pointers;
            if (body)                     // trace all unmarked pointers
                for (var i = 0; i < body.length; i++)
                    if (typeof body[i] === "object" && !body[i].mark)      // except SmallInts
                        todo.push(body[i]);
        }
        return newObjects;
    },
    removeUnmarkedOldObjects: function() {
        // Unlink unmarked old objects from the nextObject linked list
        // Reset marks of remaining objects
        // Set this.lastOldObject to last old object
        // Return removed old objects
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
                this.oldSpaceCount--;
                this.oldSpaceBytes -= corpse.totalBytes();
                this.freeOopFor(corpse);
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
        // and unmark them. Also, assign a real oop.
        // Note: also called outside GC to quickly tenure an object
        var oldObj = this.lastOldObject;
        for (var i = 0; i < newObjects.length; i++) {
            var newObj = newObjects[i];
            if (newObj.oop >= 0) {debugger; throw "attempt to tenure old object"}
            newObj.mark = false;
            this.allocateOopFor(newObj);
            oldObj.nextObject = newObj;
            oldObj = newObj;
            this.oldSpaceCount++;
            this.oldSpaceBytes += newObj.totalBytes();
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
    tempOop: function() {
        // new objects get a temporary oop
        this.newSpaceCount++;
        return this.nextTempOop -= 2;
    },
    instantiateClass: function(aClass, indexableSize, nilObj) {
        var newObject = new users.bert.St78.vm.Object(this.tempOop());
        newObject.initInstanceOf(aClass, indexableSize, nilObj);
        return newObject;
    },
    clone: function(object) {
        var newObject = new users.bert.St78.vm.Object(this.tempOop());
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
            if (!obj.stClass) return false;  //non-objects in from array
            if (mutations[obj.id]) return false; //repeated oops in from array
            else mutations[obj.id] = toArray[i];
        }
        if (twoWay) for (var i = 0; i < n; i++) {
            var obj = toArray[i];
            if (!obj.stClass) return false;  //non-objects in to array
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
            var mut = mutations[obj.stClass.id];
            if (mut) obj.stClass = mut;
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
    writeToBuffer: function() {
        this.fullGC(); // collect all objects
        var magic = 'St78',
            version = 0x0100, // 1.0
            headerSize = 18,
            data = new DataView(new ArrayBuffer(headerSize + this.oldSpaceBytes)),
            pos = 0;
        // magic bytes
        for (var i = 0; i < 4; i++)
            data.setUint8(pos++, magic.charCodeAt(i));
        // version
        data.setUint16(pos, version); pos += 2;
        // header size
        data.setUint16(pos, headerSize); pos += 2;
        // image size
        data.setUint16(pos, this.oldSpaceCount); pos += 2;
        data.setUint32(pos, this.oldSpaceBytes); pos += 4;
        // current process and display
        data.setUint16(pos, this.vm.activeContext.oop); pos += 2;
        data.setUint16(pos,this.vm.primHandler.displayBlt.oop); pos += 2;
        if (pos !== headerSize) throw "wrong header size";
        // objects
        var obj = this.firstOldObject,
            n = 0;
        while (obj) {
            if (obj.isCompiledMethod())           // store literal oops into bytes
                obj.methodPointersModified(this);
            pos = obj.writeTo(data, pos, this);
            obj = obj.nextObject;
            n++;
        }
        if (pos !== headerSize + this.oldSpaceBytes) throw "wrong image size";
        if (n !== this.oldSpaceCount) throw "wrong object count";
        return data.buffer;
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
    objectToOop: function(anObject) {
        // newly created objects have a temporary oop, so assign a real one
        if (this.vm.isSmallInt(anObject))
            return (anObject * 2 + 0x10001) & 0xFFFF; // add tag bit, make unsigned
        if (anObject.oop < 0) { // it's a temp oop
            if (this.tenuresSinceLastGC++ > this.maxTenuresBeforeGC) {
                console.log("Forcing GC after " + this.maxTenuresBeforeGC + " unchecked tenures");
                this.fullGC();    // force a GC since we tenured many objects already
                if (!(anObject.oop > 0))
                    throw "attempt to tenure unreachable object";
            } else {
                this.appendToOldObjects([anObject]); // just tenure the object
            }
        }
        return anObject.oop;
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
        var clClass = this.objectFromOop(NoteTaker.OOP_CLCLASS),
            cl = this.someInstanceOf(clClass),
            result = [];
        while (cl) {
            if ((cl.pointers[NoteTaker.PI_CLASS_INSTSIZE] & NoteTaker.FMT_ISVARIABLE) > 0) result.push(cl);
            cl = this.nextInstanceAfter(cl);
        };
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

Object.extend(users.bert.St78.vm.Image, {
    readFromBuffer: function(buffer, name) {
        // reads an image created by writeToBuffer()
        var data = new DataView(buffer),
            pos = 0,
            reader = {
                nextUint8: function(){return data.getUint8(pos++)},
                nextUint16: function(){pos += 2; return data.getUint16(pos-2)},
                nextUint32: function(){pos += 4; return data.getUint32(pos-4)},
                nextBytes: function(n){pos += n; return new DataView(data.buffer, pos - n, n)},
            },
            magic = 'St78',
            onePointOh = 0x0100;
        for (var i = 0; i < 4; i++)
            if (reader.nextUint8() !== magic.charCodeAt(i)) throw "magic number not found";
        var version = reader.nextUint16();
        if (version !== onePointOh) throw "cannot read version " + version.toString16();
        var headerSize = reader.nextUint16(),
            objectCount = reader.nextUint16(),
            imageSize = reader.nextUint32(),
            processOop = reader.nextUint16(),
            displayOop = reader.nextUint16();
        if (pos !== headerSize) throw "header mismatch";
        var oopMap = {};
        for (var i = 0; i < objectCount; i++) {
            var obj = users.bert.St78.vm.Object.readFromBuffer(reader);
            oopMap[obj.oop] = obj;
            if (pos & 1) pos++; // odd size
        }
        for (var oop in oopMap)
            oopMap[oop].initFromImage(oopMap);
        if (pos !== headerSize + imageSize) throw "size mismatch"
        var image = new this(oopMap, name);
        image.userProcess = oopMap[processOop];
        image.userDisplay = oopMap[displayOop];
        return image;
    },
});

Object.subclass('users.bert.St78.vm.Object',
'initialization', {
    initialize: function(oop) {
        this.oop = oop;
    },
    initFromImage: function(oopMap) {
        var stClass = oopMap[this.data.classOop],
            instSpec = stClass.pointers ? stClass.pointers[NoteTaker.PI_CLASS_INSTSIZE] :
                stClass.data.body.getUint16(NoteTaker.PI_CLASS_INSTSIZE * 2) >> 1,
            bodyBytes = this.data.body && this.data.body.byteLength;
        this.stClass = stClass;
        if (bodyBytes) {
            if (instSpec & NoteTaker.FMT_HASPOINTERS) { // pointers
                this.pointers = [];
                for (var i = 0; i < bodyBytes; i+=2) {
                    var oop = this.data.body.getUint16(i);
                    var obj = this.objectFromOop(oop, oopMap);
                    this.pointers.push(obj);
                }
            } else if (instSpec & NoteTaker.FMT_HASWORDS) { // words
                if (this.data.classOop === NoteTaker.OOP_CLFLOAT) {
                    this.isFloat = true;
                    this.float = this.data.body.getFloat64(0);
                } else {
                    this.words = [];
                    for (var i = 0; i < bodyBytes; i+=2) {
                        var word = this.data.body.getUint16(i);
                        this.words.push(word);
                    }
                }
            } else { // bytes
                this.bytes = [];
                for (var i = 0; i < bodyBytes; i++) {
                    var byte = this.data.body.getUint8(i);
                    this.bytes.push(byte);
                }
            }
        }
        delete this.data;
    },
    readFromObjectTable: function(reader, oopMap) {
        var entry = reader.otAt(this.oop);
        var addr = reader.dataAddress(this.oop);
        var classOop = reader.classOfOop(this.oop);
        this.stClass = oopMap[classOop];
        var instSize = reader.fieldOfObject(3, classOop) >> 1;
        var objBytes = instSize & NoteTaker.FMT_ISVARIABLE
            ? reader.lengthBitsAtAddr(addr) : instSize & NoteTaker.FMT_BYTELENGTH;
        if (objBytes <= 2) return; // only class
        if (instSize & NoteTaker.FMT_HASPOINTERS) { // pointers
            this.pointers = [];
            for (var i = 1; i < objBytes/2; i++) {
                var oop = reader.fieldOfObject(i, this.oop);
                if (!(oop&1)) oop /= 2; // our oops are half the original
                var obj = this.objectFromOop(oop, oopMap);
                this.pointers.push(obj);
            }
        } else if (instSize & NoteTaker.FMT_HASWORDS) { // words
            this.words = [];
            for (var i = 1; i < objBytes/2; i++) {
                var word = reader.fieldOfObject(i, this.oop);
                this.words.push(word);
            }
            if (classOop === NoteTaker.OOP_CLFLOAT) {
                this.isFloat = true;
                this.float = this.wordsAsFloat();
            }
        } else { // bytes
            this.bytes = [];
            for (var i = 2; i < objBytes; i++) {
                var byte = reader.data[addr + i];
                this.bytes.push(byte);
            }
        }
    },
    initInstanceOf: function(aClass, indexableSize, nilObj) {
        this.stClass = aClass;
        var instSpec = aClass.pointers[NoteTaker.PI_CLASS_INSTSIZE];
        if (instSpec & NoteTaker.FMT_HASPOINTERS) {
            var instSize = ((instSpec & NoteTaker.FMT_BYTELENGTH) >> 1) - 1; // words, sans header
            if (instSize + indexableSize > 0)
                this.pointers = this.fillArray(instSize + indexableSize, nilObj);
        } else
            if (indexableSize > 0)
                if (instSpec & NoteTaker.FMT_HASWORDS)
                    this.words = this.fillArray(indexableSize, 0); //Floats require further init of float value
                else
                    this.bytes = this.fillArray(indexableSize, 0); //Methods require further init of pointers
    },
    objectFromOop: function(oop, oopMap) {
        if (oop & 1) {
            var val = oop >> 1;
            return (val & 0x3FFF) - (val & 0x4000);
        }
        return oopMap[oop];
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
                : '␀≤␂▹␄␅≡◦␈\x09◢␋␌\x0A≠↪␐⇑≥ⓢ◣¬∢⌾▱␙␚⇒␜␝␞␟'[char]);
        }
        var string = chars.join('');
        if (n < bytes.length)
            string += '…';
        return string;
    },
    bytesAsRawString: function() {
        if (!this.bytes) return '';
        var bytes = this.bytes; // can be Uint8Array
        var n = bytes.length;
        var chars = [];
        for (var i = 0; i < n; i++)
            chars.push(String.fromCharCode(bytes[i]));
        return chars.join('');
    },
    wordsAsFloat: function() {
        // layout of NoteTaker Floats (from MSB):
        // 15 bits exponent in two's complement without bias, 1 bit sign
        // 32 bits mantissa including its highest bit (which is implicit in IEEE 754)
        if (!this.words[1]) return 0.0; // if high-bit of mantissa is 0, then it's all zero
        var nt0 = this.words[0], nt1 = this.words[1], nt2 = this.words[2],
            ntExponent = nt0 >> 1, ntSign = nt0 & 1, ntMantissa = (nt1 & 0x7FFF) << 16 | nt2, // drop high bit of mantissa
            ieeeExponent11 = (ntExponent + 1022) & 0x7FF, // IEEE: 11 bit exponent, biased
            ieee = new DataView(new ArrayBuffer(8));
        /// IEEE is 1 sign bit, 11 bits exponent, 53 bits mantissa omitting the highest bit (which is always 1, except for 0.0)
        ieee.setInt32(0, ntSign << (32-1) | ieeeExponent11 << (31-11) | (ntMantissa & 0x7FFFF8000) >> 11); // 20 bits of ntMantissa
        ieee.setInt32(4, (ntMantissa & 0x7FF) << (32-11)); // remaining 11 bits of ntMantissa, rest filled up with 0
        // why not use setInt64()? Because JavaScript does not have 64 bit ints
        return ieee.getFloat64(0);
    },
    bytesAsInteger: function() {
        // Return numeric value of my bytes
        var value = 0;
        for (var i = this.bytes.length - 1; i >= 0; i--)
            value = value * 256 + this.bytes[i];
        return value;
    },
    largeIntegerValue: function() {
        // Return numeric value of a LargeInteger
        var value = this.pointers[NoteTaker.PI_LARGEINTEGER_BYTES].bytesAsInteger();
        if (this.pointers[NoteTaker.PI_LARGEINTEGER_NEG].isTrue) value = - value;
        return value;
    },
    dataBytes: function() {
        // number of bytes in this object excluding header and class information
        return this.isFloat ? 8 :               // we use IEEE floats instead of the original 3-word format
            this.bytes ? this.bytes.length :    // includes CompiledMethods
            this.words ? this.words.length * 2 :
            this.pointers ? this.pointers.length * 2 :
            0;
    },
    totalBytes: function() { // size in bytes this object will take up in image snapshot
        var dataBytes = this.dataBytes(),
            dataWords = dataBytes+1 >> 1,
            maxSmall = NoteTaker.OOP_TAG_SMALL,    // 0x1E
            headerWords = dataBytes < maxSmall ? 2 // oop, classOopAndSizeOrLargeTag (up to 30 bytes)
                : dataBytes <= 0xFFFF ? 3          // oop, class oop, 2 bytes size (OOP_TAG_SMALL, 0x1E)
                : 4;                               // oop, class oop, 4 bytes size (OOP_TAG_LARGE, 0x1F)
        return (headerWords + dataWords) * 2;
    },
},
'writing', {
    writeTo: function(data, pos, image) {
        // Write oop, class.oop + small size, optional large size, optional data
        // oop goes first
        data.setUint16(pos, this.oop); pos += 2;
        var byteSize = this.dataBytes();
        // write class oop and size in its lower 6 bits
        if (byteSize < NoteTaker.OOP_TAG_SMALL) { // one word for class and size
           data.setUint16(pos, this.stClass.oop + byteSize);  pos += 2;
        } else if (byteSize <= 0xFFFF) { // two words, marked by 0x1E
           data.setUint16(pos, this.stClass.oop + NoteTaker.OOP_TAG_SMALL);  pos += 2;
           data.setUint16(pos, byteSize); pos += 2;
        } else { // three words, marked by 0x1F
           data.setUint16(pos, this.stClass.oop + NoteTaker.OOP_TAG_LARGE);  pos += 2;
           data.setUint32(pos, byteSize); pos += 4;
        }
        // now write data
        var beforePos = pos;
        if (this.isFloat)
            { data.setFloat64(pos, this.float); pos += 8 }
        else if (this.bytes)
            for (var i = 0; i < this.bytes.length; i++)
                { data.setUint8(pos, this.bytes[i]); pos++ }
        else if (this.words)
            for (var i = 0; i < this.words.length; i++)
                { data.setUint16(pos, this.words[i]); pos += 2 }
        else if (this.pointers)
            for (var i = 0; i < this.pointers.length; i++)
                { data.setUint16(pos, image.objectToOop(this.pointers[i])); pos += 2 }
        if (pos !== beforePos + byteSize) throw "written size does not match";
        // adjust for odd number of bytes
        if (pos & 1) pos++;
        return pos;
    },
},
'as class', {
    isClass: function() {
        return this.stClass.oop === NoteTaker.OOP_CLCLASS
            || this.stClass.oop === NoteTaker.OOP_CLVLENGTHCLASS;
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
    className: function() {
        var classNameObj = this.pointers[NoteTaker.PI_CLASS_TITLE];
        if (!classNameObj.stClass) return "???";
        return classNameObj.bytesAsString();
    },
    stInstName: function(maxLength) {
        if (!this.stClass || !this.stClass.pointers) return "???";
        if (this.oop === NoteTaker.OOP_NIL) return "nil";
        if (this.oop === NoteTaker.OOP_FALSE) return "false";
        if (this.oop === NoteTaker.OOP_TRUE) return "true";
        if (this.isFloat) {var str = this.float.toString(); if (!/\./.test(str)) str += '.0'; return str; }
        if (this.isClass()) return "the " + this.className() + " class";
        if (this.stClass.oop === NoteTaker.OOP_CLSTRING) return "'" + this.bytesAsString(maxLength||16) + "'";
        if (this.stClass.oop === NoteTaker.OOP_CLUNIQUESTRING) return "#" + this.bytesAsString(maxLength||16);
        if (this.stClass.oop === NoteTaker.OOP_CLLARGEINTEGER) return this.largeIntegerValue() + "L";
        if (this.stClass.oop === NoteTaker.OOP_CLNATURAL) return this.bytesAsInteger() + "N";
        if (this.stClass.oop === NoteTaker.OOP_CLPOINT) return this.stInstNames().join("⌾");
        var className = this.stClass.className();
        return (/^[aeiou]/i.test(className) ? 'an ' : 'a ') + className;
    },
    stInstNames: function() {
        return this.pointers.map(function(ea){
            return ea.stInstName ? ea.stInstName() : ea.toString();
        });
    },
    slotNameAt: function(index) {
        // one-based index
        var vars = this.stClass.allInstVarNames();
        return index <= vars.length ? vars[index - 1] : "◦" + (index - vars.length).toString();
    },
    allInstVarNames: function() {
        var superclass = this.superclass();
        var vars = superclass.isNil ? [] : superclass.allInstVarNames();
        var string = this.pointers[NoteTaker.PI_CLASS_MYINSTVARS].bytesAsRawString();
        // remove comments, make comma-separated, then split
        string = string.replace(/"[^"]*"/g, ' ');   // replace comments "..." with space
        string = string.replace(/\s+/g, ',');       // replace whitespace runs with comma 
        string = string.replace(/^,/, '');          // remove lone comma at start 
        string = string.replace(/,$/, '');          // remove lone comma at end
        if (string.length)
            vars = vars.concat(string.split(','));  // split into words at commas
        return vars;
    } 
},
'as method', {
    isCompiledMethod: function() {
        return this.stClass.oop === NoteTaker.OOP_CLCOMPILEDMETHOD;
    },
    methodInitLits: function(image, optionalOopMap, convertOops) {
        // make literals encoded as oops available as proper pointer objects
        var numLits = this.methodNumLits();
        if (numLits) {
            var lits = [],
                bytesPtr = 2; // skip header word
            for (var i = 0; i < numLits; i++) {
                var oop = this.bytes[bytesPtr++] + 256 * this.bytes[bytesPtr++];
                if (convertOops && !(oop & 1)) oop /= 2;
                lits.push(image.objectFromOop(oop, optionalOopMap));
            }
            this.pointers = lits;
        }
    },
    methodPointersModified: function(image, index, n) {
        // n literal pointers starting at index were modified: copy oops to bytes
        if (n) return; // we ignore this if sent from bitblt
        // if sent from image saving, copy all
        index = 0; n = this.methodNumLits();
        var bytesPtr = index * 2 + 2; // skip method header
        for (var i = index; i < index + n; i++) {
            var oop = image.objectToOop(this.pointers[i]);
            this.bytes[bytesPtr++] = oop & 0xFF;
            this.bytes[bytesPtr++] = (oop >> 8) & 0xFF;
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
        return (this.bytes[1] & 126) - NoteTaker.PC_BIAS; // bias = 2 because 4-byte header became 2-byte for NT
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

Object.extend(users.bert.St78.vm.Object, {
    readFromBuffer: function(reader) {
        var oop = reader.nextUint16(),
            classOopAndSize = reader.nextUint16(),
            byteSize = classOopAndSize & NoteTaker.OOP_MASK,
            classOop = classOopAndSize - byteSize;
        if (byteSize === NoteTaker.OOP_TAG_SMALL)
            byteSize = reader.nextUint16();
        else if (byteSize === NoteTaker.OOP_TAG_LARGE)
            byteSize = reader.nextUint32();
        var obj = new this(oop);
        obj.data = {
            classOop: classOop,
            body: byteSize && reader.nextBytes(byteSize),
        };
        return obj;
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
        this.loadInitialContext(display);
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
        this.nilObj = this.image.objectFromOop(NoteTaker.OOP_NIL);
        this.falseObj = this.image.objectFromOop(NoteTaker.OOP_FALSE);
        this.trueObj = this.image.objectFromOop(NoteTaker.OOP_TRUE);
        this.integerClass = this.image.objectFromOop(NoteTaker.OOP_CLINTEGER);
        this.classClass = this.image.objectFromOop(NoteTaker.OOP_CLCLASS);
        this.errorSel = this.image.selectorNamed('error:');
    },
    notetakerPatches: function(display) {
        // this.method is Process>>goBaby
        
        // set display extent to 640x480 by modifying literals
        this.method.pointers[9] = display.width || 640;
        this.method.pointers[17] = display.height || 480;

        // Do not make font glyphs little-endian and interleaved 
        this.methodBytes[77] = 145;  // Patches over "DefaultTextStyle NoteTakerize."

        // Remarkably, it seems that Vector, String and Uniquestring all have their classes
        // mistakenly set to Class rather than VariableLengthClass as they were in the image
        // from which the NT image was cloned. 
        // The one thing that would have revealed this error, the lookup of new:, was sidestepped
        // in both my original 8086 code and Helge's Java VM.  Truly amazing  ;-)
        this.image.objectFromOop(NoteTaker.OOP_CLSTRING).stClass =
            this.image.objectFromOop(NoteTaker.OOP_CLVLENGTHCLASS);
        this.image.objectFromOop(NoteTaker.OOP_CLUNIQUESTRING).stClass =
            this.image.objectFromOop(NoteTaker.OOP_CLVLENGTHCLASS);
        this.image.objectFromOop(NoteTaker.OOP_CLVECTOR).stClass =
            this.image.objectFromOop(NoteTaker.OOP_CLVLENGTHCLASS);
        this.image.objectFromOop(NoteTaker.OOP_CLPROCESS).stClass =
            this.image.objectFromOop(NoteTaker.OOP_CLVLENGTHCLASS);
        this.image.objectFromOop(NoteTaker.OOP_CLNATURAL).stClass =
            this.image.objectFromOop(NoteTaker.OOP_CLVLENGTHCLASS);
        this.image.objectFromOop(NoteTaker.OOP_CLCOMPILEDMETHOD).stClass =
            this.image.objectFromOop(NoteTaker.OOP_CLVLENGTHCLASS);

        if (false) { // disabled because we need that 1 bit to 
                     // tell oops from ints in saved image 
            // Patch to make all LargeIntegers in range +-32K small again:
            this.image.smallifyLargeInts();
            NoteTaker.MAX_INT =  0x7FFF;
            NoteTaker.MIN_INT = -0x8000;
            NoteTaker.NON_INT = -0x9000;
            
            // Patches to make +-32K integers work while NoteTaker is true
            this.patchByteCode(11994, 12, 0x7E); // Integer>>lshift:
            this.patchByteCode(12310, 8, 0x7E); // Integer>>minVal
            this.patchByteCode(12304, 8, 0x7E); // Integer>>maxVal
            this.patchByteCode(13418, 24, 0x7E); // LargeInteger>>lshift:
            this.patchByteCode(13512, 20, 0x7E); // LargeInteger>>land:
            this.patchByteCode(13498, 30, 0x7E); // LargeInteger>>asSmall
            this.patchByteCode(13456, 18, 0x7E); // LargeInteger>>lor:
            this.patchByteCode(13516, 18, 0x7E); // LargeInteger>>lxor:
        }

        // jump over Dorado code in UserView>>screenextent:tab: 
        this.patchByteCode(8310, 34, 0xA4, (111-34)-2); // long jmp to 111 [jumps have a bias of 2]

        // Highjack user restart in ProjectWindow>>install to do thisProcess restart instead!
        this.patchByteCode(8760, 23, 0x85);     // thisProcess
    },

    initVMState: function() {
        this.byteCodeCount = 0;
        this.sendCount = 0;
        this.doSuper = false;
        this.interruptCheckCounter = 0;
        this.interruptCheckCounterFeedBackReset = 1000;
        this.interruptChecksEveryNms = 3;
        this.lastTick = 0;
        this.methodCacheSize = 1024;
        this.methodCacheMask = this.methodCacheSize - 1;
        this.methodCacheRandomish = 0;
        this.methodCache = [];
        for (var i = 0; i < this.methodCacheSize; i++)
            this.methodCache[i] = {lkupClass: null, selector: null, method: null, methodClass: null, primIndex: 0, argCount: 0};
        this.breakOutOfInterpreter = false;
        this.breakOutTick = 0;
        this.breakOnMethod = null; // method to break on
        this.breakOnFrameChanged = false;
        this.breakOnFrameReturned = null; // context to break on
        this.startupTime = Date.now(); // base for millisecond clock
    },
    loadInitialContext: function(display) {
        this.wakeProcess(this.image.userProcess);  // set up activeProcess and sp
        this.popPCBP();                          // restore pc and current frame
        this.loadFromFrame(this.currentFrame);   // load all the rest from the frame

        // initial refresh
        if (this.image.userDisplay) {
            this.primHandler.setDisplayAndCursor(this.image.userDisplay, true);
        } else {
            // we loaded the original NoteTaker snapshot
            this.notetakerPatches(display);
        }
    },
    wakeProcess: function(proc) {
        // Install a new active process and load sp, ready to restore other state
        this.activeContext = proc;
        this.activeContextPointers = this.activeContext.pointers;
        this.sp = (this.activeContextPointers.length - this.activeContextPointers[NoteTaker.PI_PROCESS_TOP]) - 1;
    },
    sleepProcess: function() {
        // Preserve state of sp in variable 'top' (after saving PC and BP)
        this.activeContextPointers[NoteTaker.PI_PROCESS_TOP] = (this.activeContextPointers.length - this.sp) - 1;
        return this.activeContext;
    },
    patchByteCode: function(oop, index, replacementByte, maybeByte2, maybeByte3, maybeByte4) {
        var method = this.image.objectFromOop(oop);
        method.bytes[index] = replacementByte;
        if (maybeByte2) method.bytes[index+1] = maybeByte2
        if (maybeByte3) method.bytes[index+2] = maybeByte3
        if (maybeByte4) method.bytes[index+3] = maybeByte4
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
				this.push(this.methodLiteral(this.nextByte()));
				break;
			case 0x8B:	// X LDLITI
				this.push(this.methodLiteral(this.nextByte()).pointers[NoteTaker.PI_OBJECTREFERENCE_VALUE]);
				break;
			case 0x8C:	// X SEND
				this.send(this.methodLiteral(this.nextByte()));
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
        // answer milliseconds to sleep
        // or 'break' if reached breakpoint
        this.primHandler.cursorUpdate();
        this.breakOutOfInterpreter = false;
        this.breakOutTick = this.lastTick + (forMilliseconds || 500);
        while (!this.breakOutOfInterpreter)
            this.interpretOne();
        if (this.breakOutOfInterpreter == 'break') return 'break';
        return Math.min(this.primHandler.idleMS(), 200);
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
            this.breakOutTick = now + (this.breakOutTick - this.lastTick);
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
        if (now >= this.breakOutTick) // have to return to web browser once in a while
            this.breakOutOfInterpreter = this.breakOutOfInterpreter || true; // do not overwrite break string
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
        //Could not find the method -- send #error: with selector
        if (selector === this.errorSel) // Cannot find #error: -- unrecoverable error.
            throw "Recursive not understood error encountered";
        var rcvr = this.pop(),
            className = startingClass.pointers[NoteTaker.PI_CLASS_TITLE].bytesAsRawString(),
            selName = selector.bytesAsRawString();
        this.push(this.primHandler.makeStString('MNU: ' + className + '>>' + selName));
        this.push(rcvr);
        if (this.breakOnMessageNotUnderstood)
            this.breakNow('MNU: ' + startingClass.className() + '>>' + selector.bytesAsString());
        return this.findSelectorInClass(this.errorSel, 1, startingClass);
    },
    lookupSelectorInDict: function(mDict, messageSelector) {
        //Returns a method or nilObject
        var selectors = mDict.pointers[NoteTaker.PI_MESSAGEDICT_OBJECTS].pointers,
            methods = mDict.pointers[NoteTaker.PI_MESSAGEDICT_METHODS].pointers,
            index = this.getHash(messageSelector) % selectors.length;
        for (var i = 0; i < selectors.length; i++) {
            if (selectors[index] === messageSelector)
                return methods[index];
            index = (index + 1) % selectors.length;
        }
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
            if (this.tryPrimitive(primitiveIndex, argumentCount, newMethod, newMethodClass))
                return;  //Primitive succeeded -- end of story
        // sp points to new receiver, so this is where we base the new frame off
        this.pushFrame(newMethod, newMethodClass, argumentCount);
        /////// Whoosh //////
        this.currentFrame = this.sp; //We're off and running...
        this.method = newMethod;
        this.methodBytes = newMethod.bytes;
        this.methodNumArgs = argumentCount;
        this.pc = newMethod.methodStartPC();
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
        var returnFrame = (this.activeContextPointers.length - this.pop());
        var returnPC = this.pop() - NoteTaker.PC_BIAS;
        var rCode = this.pop(); // might want to check that we're in the same process
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
        var reply = this.pop();
        /////// Whoosh //////
        this.popFrame();
        this.loadFromFrame(this.currentFrame);
        this.push(reply);
        if (this.breakOnFrameChanged) {
            this.breakOnFrameChanged = false;
            this.breakNow();
        }
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
    tryPrimitive: function(primIndex, argCount, newMethod, newMethodClass) {
        var success = this.primHandler.doPrimitive(primIndex, argCount, newMethod, newMethodClass);
        return success;
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
    flushMethodCache: function() { //clear all cache entries
        for (var i = 0; i < this.methodCacheSize; i++) {
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
    },
    pushPCBP: function() {
        // Save the state of PC and BP on the stack
        this.push(this.pc + NoteTaker.PC_BIAS);
        this.push(this.currentFrame - this.sp);  // delta relative to sp before the push
    },
    popPCBP: function() {
        // Load context frame from the stack
        this.currentFrame = this.pop() + this.sp;  // + 1 because delta was computed before push
        this.pc = this.pop() - NoteTaker.PC_BIAS;  // Bias due to NT shorter header
    },
    pushFrame: function(method, methodClass, argCount) {
        var newFrame = this.sp - NoteTaker.FI_RECEIVER;
        if (newFrame <= NoteTaker.PI_PROCESS_STACK)
            throw "stack overflow" // implement stack growing here
        this.push(methodClass);
        this.push(method);
        this.push(argCount);
        this.pushPCBP();
        if (this.sp !== newFrame) throw "bad frame size";
    },
    popFrame: function() {
        this.popN(this.currentFrame - this.sp); // drop temps
        this.popPCBP();                         // restore previous frame and pc
        this.popN(4 + this.methodNumArgs);      // drop old frame + args
    },
    loadFromFrame: function(aFrame) {
        // cache values from current frame in slots
        this.method = this.activeContextPointers[aFrame + NoteTaker.FI_METHOD];
        this.methodBytes = this.method.bytes;
        this.methodNumArgs = this.activeContextPointers[aFrame + NoteTaker.FI_NUMARGS];
        this.receiver = this.activeContextPointers[aFrame + NoteTaker.FI_RECEIVER];
        return aFrame;
    },
},
'stack access', {
    pop: function() {
        var value = this.activeContextPointers[this.sp];  
        this.activeContextPointers[this.sp++] = this.nilObj;
        return value;
    },
    popN: function(nToPop) {
        for (var i = 0; i < nToPop; i++)
            this.activeContextPointers[this.sp++] = this.nilObj;
    },
    push: function(oop) {
        this.activeContextPointers[--this.sp] = oop;
    },
    popNandPush: function(nToPop, oop) {
        for (var i = 1; i < nToPop; i++)
            this.activeContextPointers[this.sp++] = this.nilObj;
        this.activeContextPointers[this.sp] = oop;
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
    getHash: function(object) {
        return (this.image.objectToOop(object) >> 1) & NoteTaker.MAX_INT;
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
        var stack = '',
            process = ctx.pointers,
            bp = this.currentFrame,
            sp = this.sp,
            remoteCodeClass = this.primHandler.remoteCodeClass;
        while (limit-- > 0) {
            while (sp++ < bp) { // look for remoteCode activations in stack of current frame
                var rCode = process[sp];
                if (rCode.stClass !== remoteCodeClass) continue;
                if (rCode.pointers[NoteTaker.PI_RCODE_STACKOFFSET] === process.length - sp) {
                    var homeBP = process.length - rCode.pointers[NoteTaker.PI_RCODE_FRAMEOFFSET],
                        homeMethod = process[homeBP + NoteTaker.FI_METHOD];
                    stack = '[] in ' + this.printMethod(homeMethod) + '\n' + stack;
                    // continue with the frame that eval'ed this remoteCode
                    bp = process.length - process[sp - 2]; // stored BP
                }
            }
            var method = process[bp + NoteTaker.FI_METHOD],
                deltaBP = process[bp + NoteTaker.FI_SAVED_BP] + 1;
            stack = this.printMethod(method) + '\n' + stack;
            if (deltaBP <= 1) return stack;
            bp += deltaBP;
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
            sp = this.sp,
            numArgs = ctx[bp + NoteTaker.FI_NUMARGS],
            numTemps = ctx[bp + NoteTaker.FI_METHOD].methodNumTemps();
        var stack = '';
        if (debugFrame) stack += Strings.format("\npc: %s sp: %s bp: %s numArgs: %s\n",
            this.pc, this.sp, this.currentFrame, numArgs);
        for (var i = this.sp; i < ctx.length; i++) {
            if (!debugFrame && bp + NoteTaker.FI_SAVED_BP <= i && bp + NoteTaker.FI_RECEIVER > i) continue;
            var obj = ctx[i];
            var value = obj && obj.stInstName ? obj.stInstName(32) : obj;
            stack += Strings.format('\n[%s] %s%s', i,
                bp + NoteTaker.FI_FIRST_TEMP - numTemps < i && i <= bp + NoteTaker.FI_FIRST_TEMP
                    ? ('temp' + (bp-1+numArgs-i) + '/t' + (bp+numArgs-i) + ': ') :
                bp + NoteTaker.FI_SAVED_BP == i ? ' savedBP: ' :
                bp + NoteTaker.FI_CALLER_PC == i ? 'callerPC: ' :
                bp + NoteTaker.FI_NUMARGS == i ? ' numArgs: ' :
                bp + NoteTaker.FI_METHOD == i ? '  method: ' :
                bp + NoteTaker.FI_MCLASS == i ? '  mclass: ' :
                bp + NoteTaker.FI_RECEIVER == i ? 'receiver: ' :
                bp + NoteTaker.FI_RECEIVER < i && i <= bp + NoteTaker.FI_RECEIVER + numArgs 
                    ? (' arg' + (bp+5+numArgs-i) + '/t' + (bp+6+numArgs-i) + ': ') :
                sp == i ? '   sp ==> ' : 
                '          ', value);
            if (i >= bp + NoteTaker.FI_RECEIVER + numArgs && i+1 < ctx.length) {
                if (!printAll) return stack;
                sp = bp + NoteTaker.FI_LAST_ARG + numArgs;
                bp += ctx[bp + NoteTaker.FI_SAVED_BP] + 1;
                // look for remoteCode activation on stack
                for (var j = sp; j < bp; j++){
                    var rCode = ctx[j];
                    if (rCode.stClass !== this.primHandler.remoteCodeClass) continue;
                    if (rCode.pointers[NoteTaker.PI_RCODE_STACKOFFSET] === ctx.length - j) {
                        var homeBP = ctx.length - rCode.pointers[NoteTaker.PI_RCODE_FRAMEOFFSET],
                            homeMethod = ctx[homeBP + NoteTaker.FI_METHOD];
                        stack += '\n\n[] in ' + this.printMethod(homeMethod);
                        if (debugFrame) {
                            while (++i <= j) {
                                obj = ctx[i];
                                value = obj && obj.stInstName ? obj.stInstName(32) : obj;
                                stack += Strings.format('\n[%s] %s%s', i,
                                i == j-2 ? '  homeBP: ' :
                                i == j-1 ? '  homePC: ' :
                                i == j ?   '   rCode: ' :
                                '          ', value);
                            }
                            i--;
                        }
                        bp = ctx.length - ctx[j - 2]; // continue at stored BP
                    }
                }
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
        this.display = display;         // display interface
        this.display.vm = this.vm;
        this.displayPixels = null;      // HTML canvas pixel data matching this.display.ctx
        this.displayBlt = null;         // the current Smalltalk display/cursor object, also stored in image header
        this.displayBits = null;        // accessor for words in Smalltalk display
        this.displayPitch = 0;          // number of words per line in displayBits
        this.cursorBits = null;         // accessor for words in Smalltalk cursor
        this.cursorX = 0;
        this.cursorY = 0;
        this.damage = {dirtyRects: []};
        this.initAtCache();
        this.remoteCodeClass = vm.image.objectFromOop(NoteTaker.OOP_CLREMOTECODE);
        this.processClass = vm.image.objectFromOop(NoteTaker.OOP_CLPROCESS);
        this.pointClass = this.vm.image.objectFromOop(NoteTaker.OOP_CLPOINT);
        this.floatClass = this.vm.image.objectFromOop(NoteTaker.OOP_CLFLOAT);
        this.stringClass = this.vm.image.objectFromOop(NoteTaker.OOP_CLSTRING);
        this.compiledMethodClass = this.vm.image.objectFromOop(NoteTaker.OOP_CLCOMPILEDMETHOD);
        this.uniqueStringClass = this.vm.image.objectFromOop(NoteTaker.OOP_CLUNIQUESTRING);
        this.bitBltClass = this.vm.image.globalNamed('BitBlt');
        this.idleCounter = 0;
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
            case 0x5: return this.pop2andPushBoolIfOK(this.vm.stackValue(0) === this.vm.stackValue(1)); // ==
            //case 0x6: return false; // is:
            //case 0x7: return false; // append:
            case 0x8: return this.popNandPushIfOK(1,this.vm.getClass(this.vm.top())); // class
            case 0x9: return this.primitiveRemoteCopy(0); // remoteCopy
            case 0xA: return this.primitiveValue(0); // eval
            //case 0xB: return false; // new
            //case 0xC: return false; // new:
            //case 0xD: return false; // x
            //case 0xE: return false; // y
            //case 0xF: return false; // asStream
        }
        return false;
    },
    doPrimitive: function(index, argCount, newMethod, newMethodClass) {
        this.success = true;
        this.floatReceiver = false;
        switch (index) {
            case 0: return this.popNandPushNumIfOK(2,this.stackIntOrFloat(0) + this.stackIntOrFloat(1));  // add
            case 1: return this.popNandPushNumIfOK(2,this.stackIntOrFloat(0) - this.stackIntOrFloat(1));  // subtract
            case 2: return this.pop2andPushBoolIfOK(this.stackIntOrFloat(0) < this.stackIntOrFloat(1));   // less
            case 3: return this.pop2andPushBoolIfOK(this.stackIntOrFloat(0) > this.stackIntOrFloat(1));   // greater
            case 4: return this.pop2andPushBoolIfOK(this.stackIntOrFloat(0) <= this.stackIntOrFloat(1));  // leq
            case 5: return this.pop2andPushBoolIfOK(this.stackIntOrFloat(0) >= this.stackIntOrFloat(1));  // geq
            case 6: return this.pop2andPushBoolIfOK(this.stackIntOrFloat(0) === this.stackIntOrFloat(1)); // equal
            case 7: return this.pop2andPushBoolIfOK(this.stackIntOrFloat(0) !== this.stackIntOrFloat(1)); // notequal
            case 8: return this.popNandPushNumIfOK(2,this.stackIntOrFloat(0) * this.stackIntOrFloat(1));  // multiply *
            case 9: return this.popNandPushNumIfOK(2,this.doDiv(this.stackIntOrFloat(0),this.stackIntOrFloat(1)));  // divide /  
            case 10: return this.popNandPushNumIfOK(2,this.doRem(this.stackIntOrFloat(0),this.stackIntOrFloat(1)));  // rem \\
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
            case 32: return this.popNandPushFloatIfOK(1,this.stackInteger(0)); // primitiveAsFloat
            case 33: return this.popNandPushIntIfOK(1,Math.floor(this.stackFloat(0))); // primitiveAsInteger
            case 34: return this.popNandPushFloatIfOK(1,this.stackFloat(0)|0); // primitiveIntegerPart
            case 35: {var f = this.stackFloat(0); return this.popNandPushFloatIfOK(1, f - (f|0));} // primitiveFractionPart
            case 36: return this.popNandPushIntIfOK(1, this.vm.getHash(this.stackNonInteger(0))); // Object.hash
            case 39: return this.primitiveValueGets(argCount); // RemoteCode.value_
            case 40: return this.primitiveCopyBits(argCount);  // BitBlt.callBLT
            case 41: return this.primitiveBeDisplayAndCursor(argCount); // BitBlt install for display
            case 45: return this.primitiveSaveImage(argCount);
            case 46: return this.popNandPushIfOK(argCount, this.primitiveInstField(argCount)); //instField:
            case 47: return this.popNandPushIfOK(argCount, this.primitiveInstField(argCount)); //instField: <-
            case 48: return this.primitivePerform(argCount); // Object>>perform:
            case 49: return this.popNandPushIntIfOK(1,999); // Object>>refct
            case 50: return false; // TextScanner>>scanword:
            case 53: this.vm.popN(argCount); return true; // altoDoAnything
            case 55: return this.primitiveRunMethod(argCount);
            case 58: return this.primitiveMousePoint(argCount);
            case 59: return true; //UserView.primCursorLoc←
            case 61: return this.primitiveKeyboardPeek(argCount);
            case 62: return this.primitiveKeyboardNext(argCount);
            case 66: return this.readStringFromLively(argCount);  //  co-opted from user primPort: 
            case 68: return this.primitiveMouseButtons(argCount);
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
    popNandPushNumIfOK: function(nToPop, returnValue) {
        if (!this.success) return false;
        if (this.floatReceiver)
            returnValue = this.makeFloat(returnValue);
        else if (!this.vm.canBeSmallInt(returnValue)) return false;
        this.vm.popNandPush(nToPop, returnValue);
        return true;
    },
    popNandPushFloatIfOK: function(nToPop, returnValue) {
        if (this.success)
            this.vm.popNandPush(nToPop, this.makeFloat(returnValue));
        return this.success;
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
    popNandPushIntIfOK: function(nToPop, returnValue) {
        if (!this.success) return false; 
        if (this.vm.canBeSmallInt(returnValue)) return this.popNandPushIfOK(nToPop, returnValue);
        return false; 
    },
    pos16BitIntFor: function(pos16Val) {
        // Return the 16-bit quantity as a positive 16-bit integer
        if (pos16Val >= 0)
            if (this.vm.canBeSmallInt(pos16Val)) return pos16Val;
        debugger; throw "large ints not implemented yet"
    },
    stackIntOrFloat: function(nDeep) {
        var obj = this.vm.stackValue(nDeep);
        if (this.vm.isSmallInt(obj)) return obj;
        if (obj.isFloat && (nDeep === 0 || this.floatReceiver)) {
            this.floatReceiver = true;
            return obj.float;
        }
        this.success = false;
        return 0;
    },
    stackFloat: function(nDeep) {
        return this.checkFloat(this.vm.stackValue(nDeep));
    }
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
        var result = this.vm.safeShift(rcvr, arg); // returns non-int if failed
        if (this.vm.canBeSmallInt(result))
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
        return this.floatReceiver ? rcvr/arg : Math.floor(rcvr/arg);
    },
    doRem: function(rcvr, arg) {
        if (arg === 0) return NoteTaker.NON_INT;  // fail if divide by zero
        return rcvr - Math.floor(rcvr/arg) * arg;
    },
},
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
    checkNonInteger: function(obj) { // returns an St78Object and sets success
        if (!this.vm.isSmallInt(obj))
            return obj;
        this.success = false;
        return this.vm.nilObj;
    },
    makeFloat: function(value) {
        var newFloat = this.vm.instantiateClass(this.floatClass, 0);
        newFloat.isFloat = true;
        newFloat.float = value;
        return newFloat;
	},
    makePointWithXandY: function(x, y) {
        var newPoint = this.vm.instantiateClass(this.pointClass, 0);
        newPoint.pointers[NoteTaker.PI_POINT_X] = x;
        newPoint.pointers[NoteTaker.PI_POINT_Y] = y;
        return newPoint;
    },
    makeStString: function(jsString) {
        var bytes = [];
        for (var i = 0; i < jsString.length; ++i)
            bytes.push(jsString.charCodeAt(i) & 0xFF);
        var stString = this.vm.instantiateClass(this.stringClass, bytes.length);
        stString.bytes = bytes;
        return stString;
    },
    pointsTo: function(rcvr, arg) {
        if (!rcvr.pointers) return false;
        return rcvr.pointers.indexOf(arg) >= 0;
    },
    idleMS: function() {
        if (this.idleCounter < 100) return 0;
        var inactivityMS = Date.now() - this.display.timeStamp;
        return inactivityMS;
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
    primitiveInstField: function(argCount) {
        // Both instField: and instField: <-
        debugger
        var rcvr = this.stackNonInteger(0);
        var index = this.stackPos16BitInt(argCount); //args out of order ;-)
        if (!this.success) return false;
        var instSize = rcvr.stClass.classInstSize();
        if (index < 1 || index > instSize) {this.success = false; return false;}
        if (argCount = 1) return rcvr.pointers[index-1]; // instField:
        var objToPut = this.vm.stackValue(1);
        rcvr.pointers[index-1] = objToPut;
        return objToPut; // instField: <-
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
            if (byteToPut < 0) {this.success = false; return objToPut;}
            return array.bytes[index-1] = byteToPut & 0xFF;
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
    primitivePerform: function(argCount) {
        // handle perform: <selector> (with: arg)*
        if (this.vm.stackValue(argCount).stClass !== this.uniqueStringClass)
            return false;
        var args = [];
        for (var i = 0; i < argCount; i++) args.push(this.vm.pop());
        var selector = this.vm.pop();
        while (args.length) this.vm.push(args.pop());
        this.vm.send(selector, argCount - 1);
        return true;
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
        if (this.success && size < 0) return false;  // negative size
        if (!this.success) {
            var largeSize = this.stackNonInteger(1);
            if (largeSize.stClass.oop !== NoteTaker.OOP_CLLARGEINTEGER) return false;
            size = largeSize.largeIntegerValue();
            if (size < 0 || size > 200000) return false; // we have our limits
            this.success = true;
        }
        if (!((rcvr.pointers[NoteTaker.PI_CLASS_INSTSIZE] & NoteTaker.FMT_ISVARIABLE) > 0)) {
            console.log("Failure of new: due to instSize bit not set for class " + rcvr);
            return false
        }
        if (rcvr === this.compiledMethodClass)
            this.vm.flushMethodCache();
        return this.popNandPushIfOK(2, this.vm.instantiateClass(rcvr, size));
    },
    doArrayBecome: function(doBothWays) {
	    var rcvr = this.stackNonInteger(0);
        var arg = this.stackNonInteger(1);
    	if (!this.success) return rcvr;
        this.success = this.vm.image.bulkBecome(rcvr.pointers, arg.pointers, doBothWays);
        return rcvr;
    },
},
'blocks', {
    primitiveRemoteCopy: function(argCount) {
        // Make a block-like outrigger to rcvr, a process
        var rcvr = this.vm.stackValue(0);
	    if (rcvr !== this.vm.activeContext) return false;
		var pc = this.vm.pc,
    		bp = this.vm.currentFrame,
		    sp = this.vm.sp,
		    relBP = rcvr.pointers.length - bp,
    		relSP = rcvr.pointers.length - sp,
		    jumpInstr = this.vm.method.bytes[pc],
    		rCode = this.vm.instantiateClass(this.remoteCodeClass, 0);
		pc += jumpInstr < 0xA0 ? 1 : 2;
		// these are used in primitiveValue
		rCode.pointers[NoteTaker.PI_RCODE_FRAMEOFFSET] = relBP; // offset from end, used in ProcessFrame>>from:
		rCode.pointers[NoteTaker.PI_RCODE_STARTINGPC] = pc + NoteTaker.PC_BIAS;
		rCode.pointers[NoteTaker.PI_RCODE_PROCESS] = rcvr;
		this.vm.popNandPush(1, rCode);
		return true;
    },
    primitiveValue: function(argCount) {
        // One entry for RemoteCode eval, value, and for Process eval which does a full process switch
        var rCode = this.vm.stackValue(0);
        if (rCode.stClass === this.processClass) return this.resume(rCode);
        if (rCode.stClass !== this.remoteCodeClass) return false;

        var contextLength = this.vm.activeContextPointers.length;

        // store the current sp here to mark the rCode as activated
		rCode.pointers[NoteTaker.PI_RCODE_STACKOFFSET] = contextLength - this.vm.sp;

        // Common code to sleep this frame
        this.vm.push(this.vm.pc + NoteTaker.PC_BIAS);           // save PC and absBP for remoteReturn
        this.vm.push(contextLength - this.vm.currentFrame);
        
        // Wake the remote context frame
        var frame = contextLength - rCode.pointers[NoteTaker.PI_RCODE_FRAMEOFFSET];
		this.vm.currentFrame = this.vm.loadFromFrame(frame);
		this.vm.pc = rCode.pointers[NoteTaker.PI_RCODE_STARTINGPC] - NoteTaker.PC_BIAS;
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
    resume: function(processToRun) {
        // Called by <Process> eval - sleep the current process and wake processToRun
        // FIXME: this needs to be refactored with RCeval, RCreturn, and VM.loadActiveContext
        // All should use common pushPCBP, popPCBP, and sleep/wake (for storing SP in top)

        // Push this frame and sleep this process
        this.vm.pop(); // drop receiver
        this.vm.pushPCBP();           // save PC and BP for remoteReturn, then preserve in top
        this.vm.sleepProcess();

        // Wake processToRun and load vm state   //NOTE: same as loadInitialContext
        this.vm.wakeProcess(processToRun);  // set up activeProcess and sp
        this.vm.popPCBP();            // restore pc and current frame
        this.vm.loadFromFrame(this.vm.currentFrame);    // load all the rest from the frame
        return true;
    },
    primitiveRunMethod: function(argCount) {
        if (argCount !== 2) return false;
        var method = this.vm.stackValue(0),
            mClass = this.vm.stackValue(1),
            newRcvr = this.vm.stackValue(2);
        if (method.stClass !== this.compiledMethodClass || !mClass.isClass())
            return false;
        var primIndex = method.methodPrimitiveIndex();
            argCount = method.methodNumArgs();
        this.vm.popN(3);
        if (this.vm.breakOnDoit) this.vm.breakNow();
        this.vm.executeNewMethod(newRcvr, method, mClass, argCount, primIndex);
        return true;
    },
},
'platform', {
    primitiveQuit: function(argCount) {
        this.vm.breakOutOfInterpreter = 'break'; 
        return true;
    },
    primitiveSaveImage: function(argCount) {
        if (!window.webkitStorageInfo) return alert("Need webkitStorage");
        this.vm.pushPCBP();
        var process = this.vm.sleepProcess();
        var buffer = this.vm.image.writeToBuffer();
        this.vm.wakeProcess(process);
        this.vm.popPCBP();
        // write file asynchronously
        window.webkitStorageInfo.requestQuota(PERSISTENT, 5*1024*1024, function(grantedBytes) {
            window.webkitRequestFileSystem(PERSISTENT, grantedBytes, function(fs) {
                fs.root.getFile('default.st78', {create: true}, function(fileEntry) {
                    fileEntry.createWriter(function(fileWriter) {
                        fileWriter.onwriteend = function(e) {alertOK("Saved " + fileEntry.toURL())};
                        fileWriter.onerror = function(e) {alert('Write failed: ' + e.toString());};
                        fileWriter.write(new Blob([buffer]));
                    }, function(e){alert("Cannot create file writer " + e)});
                }, function(e){alert("Cannot create file entry " + e)});
            }, function(e){alert("Cannot create file system " + e)});
        }, function(e){alert("Quota request denied " + e)});
        return true;
    },
    primitiveExitToDebugger: function(argCount) {
        this.vm.breakOutOfInterpreter = 'break';
        debugger;
        return true;
    },
    primitiveBeDisplayAndCursor: function(argCount) {
        var rcvr = this.vm.top();
        if (rcvr.stClass !== this.bitBltClass)
            return this.popNandPushIfOK(argCount+1, this.makePointWithXandY(this.display.width, this.display.height));
        this.setDisplayAndCursor(rcvr);
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
        if (bitbltObj.pointers[NoteTaker.PI_BITBLT_SOURCEBITS].pointers || bitbltObj.pointers[NoteTaker.PI_BITBLT_DESTBITS].pointers)
            return this.bitBltCopyPointers(bitbltObj);
        var bitblt = new users.bert.St78.vm.BitBlt(this.vm);
        if (!bitblt.loadBitBlt(bitbltObj)) return false;
        bitblt.copyBits();
        if (bitblt.destForm === this.displayBlt.pointers[NoteTaker.PI_BITBLT_DEST])
            this.displayDirty(bitblt.affectedRect());
        return true;
	},
    primitiveKeyboardNext: function(argCount) {
        this.idleCounter = 0; // reset idle if there is input
        return this.popNandPushIfOK(argCount+1, this.checkSmallInt(this.display.keys.shift()));
    },
    primitiveKeyboardPeek: function(argCount) {
        var length = this.display.keys.length;
        if (!length) this.idleCounter++;
        this.displayFlush();
        return this.popNandPushIfOK(argCount+1, length ? this.checkSmallInt(this.display.keys[0] || 0) : this.vm.falseObj);
    },
    primitiveMouseButtons: function(argCount) {
        if (this.display.fetchMouseButtons) this.display.fetchMouseButtons();
        if (this.display.buttons & 7) this.idleCounter = 0;
        else this.idleCounter++;
        this.displayFlush();
        return this.popNandPushIfOK(argCount+1, this.checkSmallInt(this.display.buttons));
    },
    primitiveMousePoint: function(argCount) {
        if (this.display.fetchMousePos) this.display.fetchMousePos();
        return this.popNandPushIfOK(argCount+1, this.makePointWithXandY(this.checkSmallInt(this.display.mouseX), this.checkSmallInt(this.display.mouseY)));
    },
    setDisplayAndCursor: function(bitBlt, fullRedraw){
        // dest is display form, source is cursor form
        this.displayBlt = bitBlt;   // also stored in image
        var blt = new users.bert.St78.vm.BitBlt(this.vm);
        blt.loadBitBlt(this.displayBlt);
        this.displayBits = blt.destBits;
        this.displayPitch = blt.destPitch;
        this.cursorBits = blt.sourceBits;
        if (fullRedraw) this.redrawFullDisplay();
        else this.cursorUpdate(true);
    },
    redrawFullDisplay: function() {
        this.displayUpdate({left: 0, top: 0, right: this.display.width, bottom: this.display.height});
    },
    displayDirty: function(rect) {
        if (!rect) return;
        if (!this.damage) return this.displayUpdate(rect);
        // look for rect to merge with
        rect.area = (rect.right - rect.left) * (rect.bottom - rect.top);
        for (var i = 0; i < this.damage.dirtyRects.length; i++) {
            var existing = this.damage.dirtyRects[i],
                mergedLeft = Math.min(rect.left, existing.left),
                mergedTop = Math.min(rect.top, existing.top),
                mergedRight = Math.max(rect.right, existing.right),
                mergedBottom = Math.max(rect.bottom, existing.bottom),
                mergedArea = (mergedRight - mergedLeft) * (mergedBottom - mergedTop);
            // if merged area is smaller, do the merge
            if (mergedArea <= rect.area + existing.area) {
                existing.left = mergedLeft;
                existing.right = mergedRight;
                existing.top = mergedTop;
                existing.bottom = mergedBottom;
                existing.area = mergedArea;
                return; // merged, so we're done
            }
        }
        // non found: add this as extra region
        this.damage.dirtyRects.push(rect);
    },
    displayFlush: function(rect) {
        if (!this.damage) return;
        while (this.damage.dirtyRects.length)
            this.displayUpdate(this.damage.dirtyRects.shift());
    },
    displayUpdate: function(rect, noCursor) {
        if (!this.displayBits) return; // image has not created display bitmap yet
        if (!this.displayPixels) // our actual screen pixels, 32 bits ARGB
            this.displayPixels = this.display.ctx.createImageData(this.display.width, this.display.height);
        var dest = new Uint32Array(this.displayPixels.data.buffer),
            dstPitch = this.displayPixels.width,
            dstX = rect.left,
            source = this.displayBits,
            srcPitch = this.displayPitch,
            srcX = rect.left >> 4, // 16 bit words
            leftMask = 0x8000 >> (rect.left & 15);
        for (var y = rect.top; y < rect.bottom; y++) {
            var srcIndex = srcPitch * y + srcX;
            var mask = leftMask;
            var src = source.getWord(srcIndex);
            var dstIndex = dstPitch * y + dstX;
            for (var x = rect.left; x < rect.right; x++) {
                dest[dstIndex++] = src & mask ? 0xFF000000 : 0xFFFFFFFF;
                if (!(mask = mask >> 1)) {
                    mask = 0x8000;
                    src = source.getWord(++srcIndex);
                }
            }
        };
        this.display.ctx.putImageData(this.displayPixels, 0, 0, rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
        // show cursor if it was just overwritten
        if (noCursor) return;
        if (this.cursorX + 16 > rect.left && this.cursorX < rect.right &&
            this.cursorY + 16 > rect.top && this.cursorY < rect.bottom) 
                this.cursorDraw();
    },
    cursorUpdate: function(force) {
        var x = this.display.mouseX,
            y = this.display.mouseY;
        if (x === this.cursorX && y === this.cursorY && !force) return;
        var oldBounds = {left: this.cursorX, top: this.cursorY, right: this.cursorX + 16, bottom: this.cursorY + 16 };
        this.cursorX = x;
        this.cursorY = y;
        // restore display at old cursor pos
        this.displayUpdate(oldBounds, true);
        // draw cursor at new pos
        this.cursorDraw();
    },
    cursorDraw: function() {
        if (!this.cursorBits || !this.displayPixels) return;
        var src = this.cursorBits, // 16x16 cursor form
            srcY = 0,
            dst = new Uint32Array(this.displayPixels.data.buffer),
            dstPitch = this.displayPixels.width,
            dstX = this.cursorX,
            dstY = this.cursorY;
        for (var y = 0; y < 16; y++) {
            var srcWord = src.getWord(srcY);
            if ((srcY += 8) >= 16) srcY -= 15;  // undo interleaving
            var mask = 0x80;
            var dstIndex = dstPitch * dstY++ + dstX;
            for (var x = 0; x < 16; x++, dstIndex++) {
                if (srcWord & mask) dst[dstIndex] = 0xFF000000;
                mask = mask >> 1;
                if (!mask) mask = 0x8000;      // undo byte swap
            }
        };
        this.display.ctx.putImageData(this.displayPixels, 0, 0, this.cursorX, this.cursorY, 16, 16);
    },
    readStringFromLively: function(nargs) {
        // The Notetaker panel object includes an object named 'fileStrings'
        // Files dropped onto this world get bound to that object
        // They can be read using this primitive, co-opted from user primPort:
        
        // check that arg is a string
        var fName = this.stackNonInteger(nargs);
        if (!this.success || (fName.stClass !== this.stringClass)) return null;
        // check that it matches a property of $morph('Notetaker').fileStrings
        var livelyPanel = $morph('Notetaker');
        var livelyDirectory = livelyPanel && livelyPanel.fileStrings;
        if (livelyDirectory && nargs == 2) {
            // if nargs == 2, then check for a string argument and store it out to Lively
            var stString = this.stackNonInteger(1)
            if (!this.success || (stString.stClass !== this.stringClass)) return null;
            livelyDirectory[fName.bytesAsString()] = stString.bytesAsRawString();
            this.popNandPushIfOK(nargs+1, stString);
            return true
        }
        // If nargs == 1, then check that the fileString exists and return it
        var livelyData = livelyDirectory && livelyDirectory[fName.bytesAsString()];
        if (!livelyData) return null;
        // Return a string object with the byte array copied into it
        var newString = this.vm.image.instantiateClass(this.stringClass, livelyData.length, 0)
        if (typeof livelyData == "string") {
                for (var i=0; i<livelyData.length; i++) newString.bytes[i] = livelyData.charCodeAt(i);
            } else {
                for (var i=0; i<livelyData.length; i++) newString.bytes[i] = livelyData[i];
            }
        this.popNandPushIfOK(nargs+1, newString);
        return true
    },
	millisecondClockValue: function() {
        //Return the value of the millisecond clock as an integer.
        //Note that the millisecond clock wraps around periodically.
        //The range is limited to SmallInteger maxVal / 2 to allow
        //delays of up to that length without overflowing a SmallInteger."
        return (Date.now() - this.vm.startupTime) & this.vm.millisecondClockMask;
	},
    bitBltCopyPointers: function(bitbltObj) {
        // BitBlt is used by the image to copy literals into and out of
        // CompiledMethods' bytes. In our implementation, the literals are 
        // duplicated into pointers. This is taken care of here.
        var src = bitbltObj.pointers[NoteTaker.PI_BITBLT_SOURCEBITS],
            srcIndex = bitbltObj.pointers[NoteTaker.PI_BITBLT_SOURCEY],
            dest = bitbltObj.pointers[NoteTaker.PI_BITBLT_DESTBITS],
            destIndex = bitbltObj.pointers[NoteTaker.PI_BITBLT_DESTY],
            count = bitbltObj.pointers[NoteTaker.PI_BITBLT_CLIPHEIGHT];
        // adjust for missing header word in CompiledMethod's pointers
        if (src.stClass === this.compiledMethodClass) srcIndex--;
        if (dest.stClass === this.compiledMethodClass) destIndex--;
        // make sure the CompiledMethod pointers are initialized
        [{obj:src,i:srcIndex},{obj:dest,i:destIndex}].forEach(function(each){
            if (each.obj.isNil && each.obj !== dest) return; // okay for src to be nil
            if (!each.obj.pointers) {
                if (each.obj.stClass !== this.compiledMethodClass)
                    throw Strings.format("bitBltCopyPointers: %s fields from %s@%s to %s@%s",
                        count, src.stInstName(), srcIndex, dest.stInstName(), destIndex);
                // this is a new CompiledMethod, duplicate its bytes to pointers
                each.obj.methodInitLits(this.vm.image);
            }
            if (each.i < 0 || each.i + count > each.obj.pointers.length)
                throw Strings.format("bitBltCopyPointers: access out of bounds for %s@%s-%s", 
                    each.obj.stInstName(), each.i, each.i + count - 1);
            }, this);
        // now do the copy or store nil
        if (src.isNil)
            this.vm.arrayFill(dest.pointers, destIndex, destIndex+count, src);
        else
            this.vm.arrayCopy(src.pointers, srcIndex, dest.pointers, destIndex, count);
        // if a CompiledMethod was modified, adjust its bytes, too
        if (dest.stClass === this.compiledMethodClass)
            dest.methodPointersModified(this.vm.image, destIndex, count);
        return true;
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
        this.success = true;
        var bitblt = bitbltObj.pointers;
        var func = bitblt[NoteTaker.PI_BITBLT_FUNCTION];
        this.destRule = func & 3;           // set, or, xor, and
        this.sourceRule = (func >> 2) & 3;  // src, ~src, halftone in src, halftone
        this.noSource = this.sourceRule === 3;
        this.sourceFn = this.makeSourceFn(this.sourceRule);
        this.destFn = this.makeDestFn(this.destRule);
        this.halftone = this.sourceRule >= 2 ? this.loadHalftone(bitblt[NoteTaker.PI_BITBLT_GRAY]) : null;
        this.destBits = this.loadBits(bitblt[NoteTaker.PI_BITBLT_DESTBITS]);
        this.destPitch = this.intFrom(bitblt[NoteTaker.PI_BITBLT_DESTRASTER]);
        this.destX = this.intFrom(bitblt[NoteTaker.PI_BITBLT_DESTX]);
        this.destY = this.intFrom(bitblt[NoteTaker.PI_BITBLT_DESTY]);
        this.width = this.intFrom(bitblt[NoteTaker.PI_BITBLT_WIDTH]);
        this.height = this.intFrom(bitblt[NoteTaker.PI_BITBLT_HEIGHT]);
        if (!this.noSource) {
            this.sourceBits = this.loadBits(bitblt[NoteTaker.PI_BITBLT_SOURCEBITS]);
            this.sourcePitch = this.intFrom(bitblt[NoteTaker.PI_BITBLT_SOURCERASTER]);
            this.sourceX = this.intFrom(bitblt[NoteTaker.PI_BITBLT_SOURCEX]);
            this.sourceY = this.intFrom(bitblt[NoteTaker.PI_BITBLT_SOURCEY]);
            this.sourceForm = bitblt[NoteTaker.PI_BITBLT_SOURCE];
        }
        this.clipX = this.intFrom(bitblt[NoteTaker.PI_BITBLT_CLIPX]);
        this.clipY = this.intFrom(bitblt[NoteTaker.PI_BITBLT_CLIPY]);
        this.clipW = this.intFrom(bitblt[NoteTaker.PI_BITBLT_CLIPWIDTH]);
        this.clipH = this.intFrom(bitblt[NoteTaker.PI_BITBLT_CLIPHEIGHT]);
        this.destForm = bitblt[NoteTaker.PI_BITBLT_DEST];
        return this.success;
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
        if (!bitsOop.bitBltAcccessor) {
            // convert its bytes to a Uint8Array
            if (!bitsOop.bytes.buffer)
                bitsOop.bytes = new Uint8Array(bitsOop.bytes);
            // make a dataview on the same data buffer
            var bytesAsWords = new DataView(bitsOop.bytes.buffer);
            bitsOop.bitBltAcccessor = {
                getWord: function(index) {
                    if (index >= 0 && index * 2 < bytesAsWords.byteLength)
                        return bytesAsWords.getUint16(index * 2);
                    else return 0;
                },
                setWord: function(index, value) {
                    if (index >= 0 && index * 2 < bytesAsWords.byteLength)
                        bytesAsWords.setUint16(index * 2, value);
                }
            }
        }
        return bitsOop.bitBltAcccessor;
    },

    intFrom: function(intOrFloat) {
        if (this.vm.isSmallInt(intOrFloat))
            return intOrFloat;
        if (intOrFloat.isFloat)
            return intOrFloat.float | 0;
        this.success = false;
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
        //console.log("Blt " + ['src', '~src', 'halftone in src', 'halftone'][this.sourceRule] + ' ' + ['set', 'or', 'xor', 'and'][this.destRule] + " dest ")
        //console.log(Strings.format("x: %s y: %s w: %s h: %s", this.destX, this.destY, this.width, this.height));
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
            var destMask = this.mask1,
                destWord = this.destBits.getWord(this.destIndex),
                mergeWord = this.destFn(halftoneWord, destWord);
            destWord = (destMask & mergeWord) | (destWord & (~destMask));
            this.destBits.setWord(this.destIndex++, destWord);
            destMask = 0xFFFF;
            //the central horizontal loop requires no store masking */
            if (this.destRule === 0) // Store rule requires no dest merging
                for (var word = 2; word < this.nWords; word++)
                    this.destBits.setWord(this.destIndex++, halftoneWord);
            else
                for (var word = 2; word < this.nWords; word++) {
                    destWord = this.destBits.getWord(this.destIndex);
                    mergeWord = this.destFn(halftoneWord, destWord);
                    this.destBits.setWord(this.destIndex++, mergeWord);
                }
            //last word in row is masked
            if (this.nWords > 1) {
                destMask = this.mask2;
                destWord = this.destBits.getWord(this.destIndex);
                mergeWord = this.destFn(halftoneWord, destWord);
                destWord = (destMask & mergeWord) | (destWord & (~destMask));
                this.destBits.setWord(this.destIndex++, destWord);
            }
            this.destIndex += this.destDelta;
        }
    },
    copyLoop: function() {
        // this version of the inner loop assumes we do have a source
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
                halftoneWord = this.halftone[y % halftoneHeight];
                y += this.vDir;
            }
            var prevWord;
            if (this.preload) {
                prevWord = this.sourceBits.getWord(this.sourceIndex);
                this.sourceIndex += hInc;
            } else {
                prevWord = 0;
            }
            var destMask = this.mask1;
            /* pick up next word */
            var thisWord = this.sourceBits.getWord(this.sourceIndex);
            this.sourceIndex += hInc;
            /* 16-bit rotate */
            var skewWord = ((unskew < 0 ? ( (prevWord & notSkewMask) >> -unskew) : ( (prevWord & notSkewMask) << unskew)))
                | (((this.skew < 0) ? ( (thisWord & skewMask) >> -this.skew) : ( (thisWord & skewMask) << this.skew)));
            prevWord = thisWord;
            var destWord = this.destBits.getWord(this.destIndex);
            var mergeWord = this.destFn(this.sourceFn(skewWord, halftoneWord, destWord), destWord);
            destWord = (destMask & mergeWord) | (destWord & (~destMask));
            this.destBits.setWord(this.destIndex, destWord);
            //The central horizontal loop requires no store masking */
            this.destIndex += hInc;
            destMask = 0xFFFF;
            if (this.destRule === 0 && this.sourceRule !== 2) { //Store mode avoids dest merge function
                if ((this.skew === 0) && (this.sourceRule === 0)) {
                    //Non-skewed and no sourceFn: fast copy. TODO: destBits.set(sourceBits.subarray(...)) ?
                    if (this.hDir == -1) {
                        for (var word = 2; word < this.nWords; word++) {
                            thisWord = this.sourceBits.getWord(this.sourceIndex);
                            this.destBits.setWord(this.destIndex, thisWord);
                            this.sourceIndex += hInc;
                            this.destIndex += hInc;
                        }
                    } else {
                        for (var word = 2; word < this.nWords; word++) {
                            this.destBits.setWord(this.destIndex, prevWord);
                            prevWord = this.sourceBits.getWord(this.sourceIndex);
                            this.destIndex += hInc;
                            this.sourceIndex += hInc;
                        }
                    }
                } else {
                    //skewed and/or source function
                    for (var word = 2; word < this.nWords; word++) {
                        thisWord = this.sourceBits.getWord(this.sourceIndex);
                        this.sourceIndex += hInc;
                        /* 16-bit rotate */
                        skewWord = (((unskew < 0) ? ( (prevWord & notSkewMask) >> -unskew) : ( (prevWord & notSkewMask) << unskew)))
                            | (((this.skew < 0) ? ( (thisWord & skewMask) >> -this.skew) : ( (thisWord & skewMask) << this.skew)));
                        prevWord = thisWord;
                        this.destBits.setWord(this.destIndex, this.sourceFn(skewWord, halftoneWord, null));
                        this.destIndex += hInc;
                    }
                }
            } else { //Dest merging here...
                for (var word = 2; word < this.nWords; word++) {
                    thisWord = this.sourceBits.getWord(this.sourceIndex); //pick up next word
                    this.sourceIndex += hInc;
                    /* 16-bit rotate */
                    skewWord = (((unskew < 0) ? ( (prevWord & notSkewMask) >> -unskew) : ( (prevWord & notSkewMask) << unskew)))
                        | (((this.skew < 0) ? ( (thisWord & skewMask) >> -this.skew) : ( (thisWord & skewMask) << this.skew)));
                    prevWord = thisWord;
                    destWord = this.destBits.getWord(this.destIndex);
                    mergeWord = this.destFn(this.sourceFn(skewWord, halftoneWord, destWord), destWord);
                    this.destBits.setWord(this.destIndex, mergeWord);
                    this.destIndex += hInc;
                }
            } 
            // last word with masking and all
            if (this.nWords > 1) {
                destMask = this.mask2;
                thisWord = this.sourceBits.getWord(this.sourceIndex); //pick up last word
                this.sourceIndex += hInc;
                /* 16-bit rotate */
                skewWord = (((unskew < 0) ? ((prevWord & notSkewMask) >> -unskew) : ((prevWord & notSkewMask) << unskew)))
                    | (((this.skew < 0) ? ( (thisWord & skewMask) >> -this.skew) : ( (thisWord & skewMask) << this.skew)));
                destWord = this.destBits.getWord(this.destIndex);
                mergeWord = this.destFn(this.sourceFn(skewWord, halftoneWord, destWord), destWord);
                destWord = (destMask & mergeWord) | (destWord & (~destMask));
                this.destBits.setWord(this.destIndex, destWord);
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
        this.dx = this.destX + leftOffset;
        this.bbW = this.width - leftOffset;
        var rightOffset = (this.dx + this.bbW) - (this.clipX + this.clipW);
    	if (rightOffset > 0)
    		this.bbW -= rightOffset;
        var topOffset = Math.max(this.clipY - this.destY, 0);
        this.dy = this.destY + topOffset;
        this.bbH = this.height - topOffset;
        var bottomOffset = (this.dy + this.bbH) - (this.clipY + this.clipH);
    	if (bottomOffset > 0)
    		this.bbH -= bottomOffset;
        // intersect with sourceForm bounds
    	if (this.noSource) return;
        this.sx = this.sourceX + leftOffset;
        this.sy = this.sourceY + topOffset;
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
        return {left: affectedL, top: affectedT, right: affectedR, bottom: affectedB};
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
        if (!this.method.isCompiledMethod())
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
