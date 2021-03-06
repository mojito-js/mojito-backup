import { assert } from '../../debug/assert/assert';
import { Parser } from '../../render/parser/parser';
import { Injector } from '../di/di';
import { EventEmitter } from '../async/events';
import { HostElement } from './host';
import { ChangeDetector, ChangeDetectorStatus } from '../change_detection/change_detection';

export enum ViewType {
    Embedded,
    Host
}

export class View {
    
    private _parser: Parser;  
    private _rootElement: Element;
    private _hostElement: HostElement;
    private _type: ViewType;
    private _templateVars: { [key: string]: Element } = {};
    private _bindings: { [key: string]: EventEmitter<any> } = {};

    get rootElement() { return this._rootElement; }
    get hostElement() { return this._hostElement; }
    get type() { return this._type; }
    get templateVars() { return this._templateVars; }
    get isAttached() { return this._hostElement instanceof HostElement; }

    constructor(element: Element) {
        this._rootElement = element;
    }

    parse() {
        assert(this.isAttached, `View can only be parsed if it is attached to a host element`);
        this._parser.parse(this._rootElement, this, false);
    }

    addTemplateVar(key: string, element: Element) {
        assert(!(this._templateVars[key] instanceof Element), `There is already a template variable "${key}" set on this view!`);
        this._templateVars[key] = element;
    }

    getTemplateVar(key: string, hostLookup = true): Element {
        let hostView = this.hostElement.getView(-1);
        let element = this._templateVars[key] || null;
        if (hostLookup && !(element instanceof Element) && hostView !== this) {
            element = hostView.getTemplateVar(key);
        }
        return element;
    }

    attach(hostElement: HostElement, type: ViewType = ViewType.Embedded) {
        assert(!this.isAttached, `View is already attached, please detach before reattaching!`);
        this._hostElement = hostElement;
        this._parser = this._hostElement.injector.get(Parser);
        this._type = type;
    }

    detach() {
        assert(this.isAttached, `View is already detached!`);
        this._hostElement = null;
        this._parser = null;
    }

    destroy() { }

    addBinding(key: string, fn: () => void) {
        let emitter = this._peekBindingForKey(key);
        emitter.subscribe(fn);
    }

    getBindingsForKey(key: string): EventEmitter<any> {
        return this._peekBindingForKey(key);
    }

    private _peekBindingForKey(key: string): EventEmitter<any> {
        let emitter = this._bindings[key];
        if (!(emitter instanceof EventEmitter)) { 
            emitter = new EventEmitter();
            this._bindings[key] = emitter;
        }
        return emitter;
    }

}