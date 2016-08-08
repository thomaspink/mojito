"use strict";
var debug_1 = require('../../debug/debug');
var utils_1 = require('../../utils/utils');
var view_1 = require('./view');
var element_1 = require('./element');
var change_detection_1 = require('../change_detection/change_detection');
var HostElement = (function () {
    function HostElement(nativeElement, parent, cdStatus) {
        this._componentView = null;
        this._nestedViews = []; // TODO: Implement embedded views
        this._parent = null;
        this._children = [];
        this._cdStatus = change_detection_1.ChangeDetectorStatus.CheckAlways;
        this._cdDefaultStatus = change_detection_1.ChangeDetectorStatus.CheckAlways;
        this._nativeElement = nativeElement;
        this._parent = parent || null;
        if (typeof cdStatus === 'number') {
            this._cdStatus = cdStatus;
            this._cdDefaultStatus = cdStatus;
        }
        var iterableDifferFactory = new change_detection_1.IterableDifferFactory();
        var keyValueDifferFactory = new change_detection_1.KeyValueDifferFactory();
        if (iterableDifferFactory.supports(this)) {
            this._iterableDiffer = iterableDifferFactory.create(this);
        }
        if (keyValueDifferFactory.supports(this)) {
            this._keyValueDiffer = keyValueDifferFactory.create(this);
        }
    }
    Object.defineProperty(HostElement.prototype, "component", {
        get: function () { return this._component; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostElement.prototype, "componentView", {
        get: function () { return this.getView(-1); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostElement.prototype, "elementRef", {
        get: function () { return new element_1.ElementRef(this._nativeElement); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostElement.prototype, "injector", {
        get: function () { return this._injector; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(HostElement.prototype, "parent", {
        get: function () { return this._parent; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostElement.prototype, "cdStatus", {
        get: function () { return this._cdStatus; },
        enumerable: true,
        configurable: true
    });
    HostElement.prototype.initComponent = function (component, injector) {
        this._component = component;
        this._injector = injector;
        var componentView = new view_1.View(this._nativeElement, this);
        this._componentView = componentView;
    };
    // TODO    
    HostElement.prototype.attachView = function (view, viewIndex) { };
    HostElement.prototype.registerChild = function (childHost) {
        this._children.push(childHost);
    };
    HostElement.prototype.parseView = function (viewIndex) {
        if (viewIndex === void 0) { viewIndex = -1; }
        var view = this.getView(viewIndex);
        debug_1.assert(view instanceof view_1.View, "No view with index \"" + viewIndex + "\"\" found!");
        view.parse();
    };
    HostElement.prototype.parse = function () {
        this.parseView(-1);
    };
    HostElement.prototype.getView = function (viewIndex) {
        if (viewIndex === void 0) { viewIndex = -1; }
        return viewIndex === -1 ? this._componentView : this._nestedViews[viewIndex];
    };
    HostElement.prototype.markForCheck = function () { };
    HostElement.prototype.detach = function () {
        this._cdStatus = change_detection_1.ChangeDetectorStatus.Detached;
    };
    HostElement.prototype.detectChanges = function () {
        if (this._cdStatus === change_detection_1.ChangeDetectorStatus.Checked || this._cdStatus === change_detection_1.ChangeDetectorStatus.Errored) {
            return;
        }
        if (this._cdStatus === change_detection_1.ChangeDetectorStatus.Destroyed) {
            return;
        }
        if (utils_1.isPresent(this._iterableDiffer)) {
            var changes = this._iterableDiffer.diff(this.component);
            if (utils_1.isPresent(changes)) {
            }
        }
        if (utils_1.isPresent(this._keyValueDiffer)) {
            var changes = this._keyValueDiffer.diff(this.component);
            if (utils_1.isPresent(changes)) {
            }
        }
        this.detectChildChanges();
        if (this._cdStatus === change_detection_1.ChangeDetectorStatus.CheckOnce)
            this._cdStatus = change_detection_1.ChangeDetectorStatus.Checked;
    };
    HostElement.prototype.detectChildChanges = function () {
        for (var i = 0, max = this._children.length; i < max; i++) {
            var childHost = this._children[i];
            if (childHost.cdStatus === change_detection_1.ChangeDetectorStatus.Detached) {
                continue;
            }
            childHost.detectChanges();
        }
    };
    HostElement.prototype.checkNoChanges = function () { };
    HostElement.prototype.reattach = function () {
        this._cdStatus = this._cdDefaultStatus;
        this.markForCheck();
    };
    return HostElement;
}());
exports.HostElement = HostElement;
//# sourceMappingURL=host.js.map