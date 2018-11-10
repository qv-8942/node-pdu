'use strict';

var PDU     = require('../../pdu'),
    sprintf = require('sprintf');
    
function Header(params)
{
    /**
     *
     * @var integer
     */
    this._TYPE     = undefined;
    
    /**
     *
     * @var integer
     */
    this._POINTER  = 0;
    
    /**
     *
     * @var integer
     */
    this._SEGMENTS = 1;
    
    /**
     *
     * @var integer
     */
    this._CURRENT  = 1;
    
    if(params){
        this._TYPE = Header.IE_CONCAT_16BIT_REF;
        this._SEGMENTS = params.SEGMENTS;
        this._CURRENT  = params.CURRENT;
        this._POINTER  = params.POINTER;
    }
};

Header.IE_CONCAT_16BIT_REF      = 0x08;

/**
 * parse header
 * @return Header
 */
Header.parse = function()
{
    var buffer    = new Buffer(PDU.getPduSubstr(6), 'hex'),
        udhl      = buffer[0],
        type      = buffer[1],
        psize     = buffer[2];
        buffer    = new Buffer(PDU.getPduSubstr((psize - 2) * 2 ), 'hex'); // psize is pointer + segments + current
    var pointer   = buffer.length === 1 ? buffer[0] : (buffer[0]<<8) | buffer[1];
        buffer    = new Buffer(PDU.getPduSubstr(4), 'hex');
    var sergments = buffer[0],
        current   = buffer[1];
    
    var self = new Header({
            'POINTER':  pointer,
            'SEGMENTS': sergments,
            'CURRENT':  current
    });
    
    return self;
};

/**
 * cast object to array
 * @return array
 */
Header.prototype.toJSON = function()
{
    return {
        'POINTER':  this._POINTER,
        'SEGMENTS': this._SEGMENTS,
        'CURRENT':  this._CURRENT
    };
};

/**
 * get header size (UDHL value), in octets
 * @return integer
 */
Header.prototype.getSize = function()
{
    return this._TYPE === undefined ? 0 : 6;
};

/**
 * get header type
 * @return integer
 */
Header.prototype.getType = function()
{
    return this._TYPE;
};

/**
 * get a pointer size
 * @return integer
 */
Header.prototype.getPointerSize = function()
{
    return this._TYPE === undefined ? 0 : 4;
};

/**
 * get a pointer
 * @return integer
 */
Header.prototype.getPointer = function()
{
    return this._POINTER;
};

/**
 * get a segments
 * @return integer
 */
Header.prototype.getSegments = function()
{
    return this._SEGMENTS;
};

/**
 * get current segment
 * @return integer
 */
Header.prototype.getCurrent = function()
{
    return this._CURRENT;
};

/**
 * method for cast to string
 * @return string
 */
Header.prototype.toString = function()
{
    var head = '';

    if (this._TYPE === undefined)
        return '';

    head += sprintf("%02X", 6);
    head += sprintf("%02X", this._TYPE);
    head += sprintf("%02X", 4);
    head += sprintf("%04X", this._POINTER);
    head += sprintf("%02X", this._SEGMENTS);
    head += sprintf("%02X", this._CURRENT);
    
    return head;
};

module.exports = Header;