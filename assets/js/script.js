// Global Variables
let projectsArr = JSON.parse(localStorage.getItem("project")) || [];
const today = dayjs();

//#region Functions
function renderTime() {
  // Display the current time on screen
  $("#timeDisplay").text(`${dayjs().format("MMM DD, YYYY at hh:mm:ss a")}`);
  setInterval(
    () =>
      $("#timeDisplay").text(`${dayjs().format("MMM DD, YYYY at hh:mm:ss a")}`),
    1000
  );
}

function renderProjects() {
  // Clear the project table
  $("tbody").html("");

  // Render each project saved in the array to the table
  $.each(projectsArr, (i, elem) => {
    const classAttr =
      today.diff(dayjs(elem.dDate), "d") === 0
        ? 'class="table-warning"'
        : today.diff(dayjs(elem.dDate), "d") > 0
        ? 'class="table-danger"'
        : "";

    $("tbody").append(
      `<tr ${classAttr}>
        <td>${elem.name}</td>
        <td>${elem.type}</td>
        <td>${elem.dDate}</td>
        <td><button id="removeBtn" class="btn btn-primary" data-index="${elem.index}">Remove</button></td>
      </tr>`
    );
  });
}

function resetForm() {
  $("#projectNameInput").val("");
  $("#datepicker").val("");
}

function getInput(evt) {
  evt.preventDefault();

  let project = {};

  if (!$("#projectNameInput").val() || !$("#datepicker").val()) {
    alert("You need to fill out the form!");
    resetForm();
    return;
  }

  // Get form data
  project.name = $("#projectNameInput").val();
  project.type = $("#projectTypeInput").val();
  project.dDate = $("#datepicker").val();
  project.index = projectsArr.length; // Use for deleting the project

  resetForm();

  // Save form data in array and save to localStorage
  projectsArr.push(project);
  localStorage.setItem("project", JSON.stringify(projectsArr));

  // display the project in the page's table
  renderProjects();
}

function init() {
  // Render time and saved project from local storage
  renderTime();
  renderProjects();

  // Use jQuery datepicker UI
  $("#datepicker").datepicker();
}
//#endregion functions

//#region eventListeners
// submit the form data on submit button click
$("#inputForm").on("submit", getInput);

// Remove the project from the table on button click
$("tbody").on("click", "#removeBtn", (evt) => {
  // removed the project from the table
  $(evt.target).parent().parent().remove();

  // Find the index of the correct project inside projectsArr and delete from the array
  let i = projectsArr.findIndex(
    (element) => element.index == $(evt.target).attr("data-index")
  );
  projectsArr.splice(i, 1);

  // Save the new project arr into localStorage
  localStorage.setItem("project", JSON.stringify(projectsArr));
});
//#endregion eventListeners

// Run on page load
init();
