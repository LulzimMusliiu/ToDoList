const task_name = document.querySelector("#task-name");
const task_description = document.querySelector("#task-description");
const submit = document.querySelector("button");

const url = `https://6317556682797be77ff9e7f5.mockapi.io/api/v1/todo`;

const fetchData = () => {
  return fetch(url).then((res) => res.json());
};

const postData = (data) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
};

const changeData = (id, data) => {
  return fetch(`${url}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
};

const dt = {
  task_name: "general",
  task_description: "name",
  finished: false,
  createdAt: Date.now()
};

const deleteData = (id) => {
  return fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  });
};

const todo = (body) => {
  const { task_name, finished, uuid, id } = body;
  const td = document.createElement("div");
  td.setAttribute("data-id", uuid);
  const inp = document.createElement("input");
  const tds = document.createElement("span");
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.innerText = "Delete";

  deleteBtn.addEventListener("click", () => {
    deleteData(id)
      .then((data) => data.json())
      .then(() => {
        dataFromApi();
      });
  });

  td.classList.add("todo");
  inp.setAttribute("type", "checkbox");
  inp.setAttribute("data-id", uuid);
  td.setAttribute("data-finished", finished);
  if (finished) {
    td.classList.add("finished");
    inp.setAttribute("checked", finished);
  }
  inp.addEventListener("change", () => {
    const dfa = td.getAttribute("data-finished");
    const bd = { ...body, finished: !(dfa == "true") };
    changeData(body.id, bd)
      .then((res) => res.json())
      .then((data) => {
        if (data.finished) {
          td.setAttribute("data-finished", data.finished);
          td.classList.add("finished");
          inp.setAttribute("checked", true);
        } else {
          td.setAttribute("data-finished", data.finished);
          td.classList.remove("finished");
          inp.removeAttribute("checked");
        }
      });
  });
  tds.innerText = task_name;
  td.append(inp);
  td.append(tds);
  td.append(deleteBtn);
  return td;
};
const todoc = document.querySelector(".todo-container");
submit.addEventListener("click", () => {
  const body = {
    task_name: task_name.value,
    task_description: task_description.value,
    finished: false,
    createdAt: Date.now()
  };
  const tdn = todo(task_name.value);
  postData(body)
    .then((response) => response.json())
    .then((body) => {
      const newTodo = todo(body);
      todoc.append(newTodo);
    });
  task_name.value = "";
});

const dataFromApi = () => {
  todoc.innerHTML = "";
  fetchData().then((data) => {
    data.forEach((el) => {
      const tdc = todo(el);
      todoc.append(tdc);
    });
  });
};
dataFromApi();
