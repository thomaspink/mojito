(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Mojito = (function () {
    function Mojito() {
        console.log('Mojito init!');
    }
    Mojito.prototype.upperCaseTest = function (x) {
        return x.toUpperCase();
    };
    return Mojito;
})();
exports.Mojito = Mojito;
new Mojito();

},{}],2:[function(require,module,exports){
var mojito_1 = require('./mojito');
describe('Mojito', function () {
    it('should test anything', function () {
        expect('x').toEqual('x');
    });
    it('should test ', function () {
        var mojito = new mojito_1.Mojito();
        expect(mojito.upperCaseTest('test')).toEqual('TEST');
    });
});

},{"./mojito":1}]},{},[2]);
