"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";


const Todo = () => {
  const [todoList, setTodoList] = useState([]);
  const [filterType, setFilterType] = useState("all");

 const loadTodo = async (ft) => {
  try {
    const token = localStorage.getItem("token");
    let url = "http://localhost:3000/todoList";

    if (ft !== "all") {
      url += `?isDone=${ft === "completed"}`;
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    setTodoList(json);
    setFilterType(ft);
  } catch (error) {
    console.error(error);
  }
};

  const addTodo = async (event) => {
  try {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const todoTextInput = document.getElementById("todo-text-input");
    const todoText = todoTextInput.value;

    const res = await fetch("http://localhost:3000/todoList", {
      method: "POST",
      body: JSON.stringify({
        todoText: todoText,
        isDone: false,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    setTodoList((val) => [...val, json]);
    todoTextInput.value = "";
  } catch (error) {
    console.error(error);
  }
};


  const updateTodo = async (id) => {
    try {
      const index = todoList.findIndex((item) => item.id === id);
      const res = await fetch(`http://localhost:3000/todoList/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...todoList[index],
          isDone: !todoList[index].isDone,
        }),
      });
      const json = await res.json();

      setTodoList((val) => {
        return [...val.slice(0, index), json, ...val.slice(index + 1)];
      });
    } catch (error) {}
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:3000/todoList/${id}`, {
        method: "DELETE",
      });

      setTodoList((val) => {
        const index = val.findIndex((item) => item.id === id);
        return [...val.slice(0, index), ...val.slice(index + 1)];
      });
    } catch (error) {}
  };

  useEffect(() => {
    loadTodo("all");
  }, []);
  

  return (
    <div className="flex flex-col items-center gap-4 h-screen max-h-svh">
      <Button
  variant="destructive"
  className="absolute top-4 right-4"
  onClick={() => {
    localStorage.removeItem("token"); // Remove the token
    window.location.reload();         // Reload the app to go back to login
  }}
>
  Logout
</Button>

      <h1 className="text-4xl font-semibold my-6">Todo App</h1>

      <form className="flex" onSubmit={addTodo}>
        <div>
          <Label htmlFor="todo-text-input" className="sr-only">
            Todo Text
          </Label>
          <Input id="todo-text-input" required className="rounded-r-none" />
        </div>
        <Button className="rounded-l-none">Add Todo</Button>
      </form>
      <div className="w-full flex flex-col gap-4 p-4 flex-1">
        {todoList.map((todoItem) => {
          return (
            <div className="flex items-center gap-4" key={todoItem.id}>
              <div>
                <Label htmlFor="isdone-checkbox" className="sr-only">
                  Todo Text
                </Label>
                <Checkbox
                  id="isdone-checkbox"
                  checked={todoItem.isDone}
                  onCheckedChange={() => updateTodo(todoItem.id)}
                />
              </div>
              <p
                className="flex-1"
                style={{
                  textDecoration: todoItem.isDone ? "line-through" : "none",
                }}
              >
                {todoItem.todoText}
              </p>
              <Button
                variant="destructive"
                onClick={() => deleteTodo(todoItem.id)}
              >
                Delete
              </Button>
            </div>
          );
        })}
      </div>
      <div className="flex w-full">
        <Button
          className="flex-1 rounded-none"
          variant={filterType === "all" ? "default" : "secondary"}
          onClick={() => loadTodo("all")}
        >
          All
        </Button>
        <Button
          className="flex-1 rounded-none"
          variant={filterType === "pending" ? "default" : "secondary"}
          onClick={() => loadTodo("pending")}
        >
          Pending
        </Button>
        <Button
          className="flex-1 rounded-none"
          variant={filterType === "completed" ? "default" : "secondary"}
          onClick={() => loadTodo("completed")}
        >
          Completed
        </Button>
      </div>
      
    </div>
  );
};

export default Todo;