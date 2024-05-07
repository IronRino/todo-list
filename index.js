function createElement(tag, attributes, children, callbacks = []) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  if (callbacks){
    callbacks.forEach(function (callback) {
      element.addEventListener(callback.type, callback.listener);
    });
  }

  return element;
}

class Component {
  constructor() {
    this._domNode = null;
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }

  update() {
    const newDomNode = this.render();
    this._domNode.replaceWith(newDomNode);
    this._domNode = newDomNode;
  }
}

class AddTask extends Component {
  constructor(onAddTask) {
    super();
    this.onAddTask = onAddTask;
    this.text = "";
  }

  onAddInputChange(event) {
    this.text = event.target.value;
  }

  render() {
    return createElement("div", { class: "add-todo" }, [
      createElement("input",
          {
            id: "new-todo",
            type: "text",
            placeholder: "Задание",
          }, null,
          [{ type: "input", listener: this.onAddInputChange.bind(this) }]
      ),
      createElement("button",
          { id: "add-btn" },
          createElement("button", { id: "add-btn" }, "+"), [
            { type: "click", listener: () => this.onAddTask(this.text) },
          ]),
    ]);
  }
}

class Task extends Component {
  constructor(tasks, onDeleteTask) {
    super();
    this.tasks = tasks;
    this.onDeleteTask = onDeleteTask;
    this.countForDelete = 0;
  }
  render() {
    return createElement("li", { style: this.tasks.done ? "color: gray;" : "" }, [
      createElement("input", { type: "checkbox", ...(this.tasks.done && { checked: false }) }, null,
          [
            { type: "click", listener: () => { this.tasks.done = !this.tasks.done; this.update(); },},
          ]),
      createElement("label", {}, this.tasks.text),
      createElement(
          "button",
          { style: this.countForDelete % 2 === 1 ? "background: red;" : "" },
          "🗑️",
          [
            {
              type: "click",
              listener: () => {
                this.countForDelete++;
                if (this.countForDelete % 2 === 0) {
                  this.onDeleteTask();
                }
                this.update();
              },
            },
          ]
      ),
    ]);
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      message: "",
      tasks: [
        { text: "Сделать домашку", completed: false },
        { text: "Сделать практику", completed: false },
        { text: "Пойти домой", completed: false },
      ],
    };
  }

  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      new AddTask(this.onAddTask.bind(this)).getDomNode(),
      createElement(
          "ul",
          { id: "todos" },
          this.state.tasks.map(({ text, completed }) =>
              new Task({ text, completed },
                  this.onDeleteTask({ text, completed })).getDomNode())
      ),
    ]);
  }

  onAddTask(text) {
    const newTask = { text: text, completed: false };
    this.state.tasks.push(newTask);
    this.update();
  }

  onDeleteTask(task) {
    return () => {
      this.state.tasks = this.state.tasks.filter(({ text }) => text !== task.text);
      this.update();
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});