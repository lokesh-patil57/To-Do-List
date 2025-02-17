let todo = [];
let req = prompt("Enter your request");

while (true) {
  if (req == "quit") {
    console.log("You Quit the Task");
    break;
  }

  if (req == "list") {
    console.log("_______________________________");

    for (let i = 0; i < todo.length; i++) {
      console.log(i, todo[i]);
    }
    console.log("_______________________________");
  } else if (req == "add") {
    let task = prompt("Enter Task you want to Add ");
    todo.push(task);
    console.log("task added");
  } else if (req == "delete") {
    let del = prompt("Enter Task you want to Delete ");
    todo.splice(del, 1);
    console.log("Task Deleted");
  } else {
    alert("Wrong Request")
  }
  req = prompt("Please enter your choice")
}
