function createElement(tag, attributes, children, callbacks) {
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

  if (callbacks) {
    Object.keys(callbacks).forEach((key) => {
      element.addEventListener(key, callbacks[key]);
    });
  }

  return element;
}

class Component {
  constructor() {
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      tasks: [
        { id: 1, text: "Сделать домашку", completed: false },
        { id: 2, text: "Сделать практику", completed: false },
        { id: 3, text: "Пойти домой", completed: false }
      ],
      nextId: 4
    };

    this.onAddTask = this.onAddTask.bind(this);
    this.onAddInputChange = this.onAddInputChange.bind(this);
  }

  onAddTask() {
    const input = document.getElementById("new-todo");
    const newTask = { id: this.state.nextId, text: input.value, completed: false };
    this.state.tasks.push(newTask);
    input.value = "";
    this.state.nextId++;

    this._domNode.replaceWith(this.render());
  }

  onAddInputChange() {
    const input = document.getElementById("new-todo");
    this.state.currentInput = input.value;
  }

  render() {
    const tasksElements = this.state.tasks.map(task => {
      return createElement("li", { key: task.id }, [
        createElement("input", { type: "checkbox" }),
        createElement("label", {}, task.text),
        createElement("button", {}, "🗑️")
      ]);
    });

    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      createElement("div", { class: "add-todo" }, [
        createElement("input", {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
          oninput: this.onAddInputChange
        }),
        createElement("button", { id: "add-btn", onclick: this.onAddTask }, "+"),
      ]),
      createElement("ul", { id: "todos" }, tasksElements)
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
