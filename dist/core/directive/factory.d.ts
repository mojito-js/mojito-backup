import { ClassType } from '../../utils/class/class';
import { AppElement } from '../view/element';
import { ElementRef } from '../view/element-ref';
import { ViewRef } from '../view/view';
import { Injector } from '../di/di';
export declare class ComponentFactory<C> {
    private _componentType;
    private _viewFactory;
    constructor(_componentType: ClassType<C>, _viewFactory: Function);
    componentType: ClassType<C>;
    create(injector: Injector, nativeElement: Element): ComponentRef<C>;
}
export declare class ComponentRef<C> {
    private _hostElement;
    private _componentType;
    constructor(_hostElement: AppElement, _componentType: ClassType<C>);
    location: ElementRef;
    injector: Injector;
    instance: C;
    hostView: ViewRef<C>;
    componentType: ClassType<C>;
}
export declare class ComponentFactoryResolver {
    private _parent;
    private _factories;
    constructor(factories: ComponentFactory<any>[], _parent?: ComponentFactoryResolver);
    resolveComponentFactory<T>(component: {
        new (...args: any[]): T;
    }): ComponentFactory<T>;
}
