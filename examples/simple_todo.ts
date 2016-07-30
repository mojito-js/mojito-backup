import { observes } from 'mojito/core';
import { Injector, Injectable, Inject, Component, Output, Input, bootstrap, Provider, ElementRef, HostElement, EventEmitter } from 'mojito/runtime';

console.time('startUp');

class Todo {
    private _id: string;
    private _title: string;
    private _due: Date;
    private _created: Date;
    private _updated: Date;

    get id() { return this._id; }
    get title() { return this._title; }
    get due() { return this._due; }
    get created() { return this._created; }
    get updated() { return this._updated; }

    set title(newTitle: string) {
        this._title = newTitle;
        this._updated = new Date();
    }
    set due(newDue: Date) {
        this._due = newDue;
        this._updated = new Date();
    }

    constructor(title: string, due: Date) {
        let date = new Date();
        this._id = Date.now() + '';
        this._title = title;
        this._due = due;
        this._created = date;
        this._updated = date;
    }
}

@Injectable()
class TodoStore {
    private todos: Todo[] = [];

    add(title: string, due: Date) {
        this.todos.push(new Todo(title, due));
    }

    remove(todo: Todo) {

    }
}

@Component({ selector: '[todo-app]' })
class TodoApp {
    constructor( @Inject(TodoStore) store: TodoStore) {
        store.add('test', new Date());
    }

    submitForm() {
        console.log("asdfasf");
    }
}

@Component({ selector: 'todo-form' })    
class TodoForm {
    @Input('hero')  hero: any;
    @Output() submitter = new EventEmitter();;

    constructor(
        @Inject(TodoStore) store: TodoStore,
        @Inject(ElementRef) element: ElementRef,
        @Inject(HostElement) host: HostElement
    ) {
    }

    submitForm() {
        this.submitter.emit();
    }

    setTitle() {
        console.log('setTitle', arguments);
    }

    setDate() {
        console.log('setDate', arguments);
    }
}

@Component({ selector: 'todo-list' })    
class TodoList {
    constructor(
        @Inject(TodoStore) store: TodoStore,
        @Inject(ElementRef) element: ElementRef
    ) {
    }
}

@Component({
    selector: '[todo-item]',
    template: `
        <tr todo-item >
            <td class="mdl-data-table__cell--non-numeric">{{title}}</td>
            <td>{{due}}</td>
        </tr>
    `
})    
class TodoListItem {
    constructor(
        @Inject(TodoStore) store: TodoStore,
        @Inject(ElementRef) element: ElementRef
    ) {
    }
}

bootstrap(TodoApp, [TodoStore]);

console.timeEnd('startUp');
