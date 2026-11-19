
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskCategory = document.getElementById("taskCategory");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];

function saveTasks() {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        const taskItem = document.createElement("div");
        taskItem.className = "task-item";

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        const details = document.createElement("div");
        details.className = "task-details";

        const name = document.createElement("strong");
        name.className = "task-name";
        name.textContent = task.name;

        const info = document.createElement("small");
        info.textContent = task.category + " | Due: " + task.date;

        details.appendChild(name);
        details.appendChild(info);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeButton = document.createElement("button");
        completeButton.className = "complete-btn";
        completeButton.textContent = task.completed ? "Undo" : "Complete";

        completeButton.addEventListener("click", () => {
           tasks[index].completed = !tasks[index].completed;
saveTasks();
displayTasks();
updateDashboard();
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
           tasks.splice(index, 1);
saveTasks();
displayTasks();
updateDashboard();
        });

        actions.appendChild(completeButton);
        actions.appendChild(deleteButton);

        taskItem.appendChild(details);
        taskItem.appendChild(actions);

        taskList.appendChild(taskItem);
    });

    if (tasks.length === 0) {
        taskList.textContent = "No tasks yet. Add your first task!";
    }
}

if (taskForm) taskForm.addEventListener("submit", function(event) {
    event.preventDefault();
    console.log("ADD TASK BUTTON WORKS");

    const newTask = {
        name: taskInput.value.trim(),
        date: taskDate.value,
        category: taskCategory.value,
        completed: false
    };

    if (!newTask.name || !newTask.date) {
        return;
    }

    tasks.push(newTask);

    saveTasks();
displayTasks();
updateDashboard();

taskForm.reset();
});

displayTasks();

const timetableForm = document.getElementById("timetableForm");
const timetableList = document.getElementById("timetableList");

let sessions = JSON.parse(
    localStorage.getItem("studyTimetable")
) || [];

const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

function saveTimetable() {
    localStorage.setItem(
        "studyTimetable",
        JSON.stringify(sessions)
    );
}

function displayTimetable() {

    timetableList.innerHTML = "";

    if (sessions.length === 0) {
        timetableList.textContent =
            "No study sessions added yet.";
        return;
    }

    const sortedSessions = sessions
        .map((session, index) => ({ ...session, index }))
        .sort((a, b) => {
            const dayDifference =
                weekDays.indexOf(a.day) -
                weekDays.indexOf(b.day);

            if (dayDifference !== 0) {
                return dayDifference;
            }

            return a.start.localeCompare(b.start);
        });

    sortedSessions.forEach(session => {

        const item = document.createElement("div");
        item.className = "schedule-item";

        const details = document.createElement("div");

        const subject = document.createElement("h3");
        subject.textContent = session.subject;

        const day = document.createElement("p");
        day.textContent = session.day;

        const time = document.createElement("p");
        time.textContent =
            session.start + " - " + session.end;

        const location = document.createElement("p");
        location.textContent =
            session.location || "No location specified";

        details.append(subject, day, time, location);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            sessions.splice(session.index, 1);
            saveTimetable();
             displayTimetable();
            updateDashboard();
        });

        item.append(details, deleteButton);

        timetableList.appendChild(item);
    });
}

timetableForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const subject = document
        .getElementById("subjectInput").value.trim();

    const day = document.getElementById("dayInput").value;

    const start = document.getElementById("startTime").value;

    const end = document.getElementById("endTime").value;

    const location = document
        .getElementById("locationInput").value.trim();

    if (!subject || !start || !end) {
        return;
    }

    if (end <= start) {
        alert("End time must be later than start time.");
        return;
    }

    sessions.push({
        subject,
        day,
        start,
        end,
        location
    });

    saveTimetable();
    displayTimetable();
    updateDashboard();


    timetableForm.reset();
});

displayTimetable();

// ASSIGNMENT MANAGEMENT

const assignmentForm = document.getElementById("assignmentForm");
const assignmentList = document.getElementById("assignmentList");

let assignments = JSON.parse(
    localStorage.getItem("studentAssignments")
) || [];

function saveAssignments() {
    localStorage.setItem(
        "studentAssignments",
        JSON.stringify(assignments)
    );
}

function displayAssignments() {

    assignmentList.innerHTML = "";

    if (assignments.length === 0) {
        assignmentList.textContent = "No assignments added yet.";
        return;
    }

    assignments.forEach((item, index) => {

        const card = document.createElement("div");
        card.className = "assignment-item";

        if (item.completed) {
            card.classList.add("completed");
        }

        const details = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = item.name;

        const subject = document.createElement("p");
        subject.textContent = "Subject: " + item.subject;

        const date = document.createElement("p");
        date.textContent = "Due: " + item.date;

        const priority = document.createElement("span");
        priority.className = "priority " + item.priority;
        priority.textContent = item.priority + " Priority";

        details.append(name, subject, date, priority);

        const actions = document.createElement("div");

        const complete = document.createElement("button");
        complete.textContent = item.completed ? "Undo" : "Complete";

        complete.addEventListener("click", () => {
            assignments[index].completed =
                !assignments[index].completed;

           saveAssignments();
            displayAssignments();
            updateDashboard();
        });

        const remove = document.createElement("button");
        remove.textContent = "Delete";

        remove.addEventListener("click", () => {
            assignments.splice(index, 1);
            saveAssignments();
            displayAssignments();
            updateDashboard();
        });

        actions.append(complete, remove);
        card.append(details, actions);

        assignmentList.appendChild(card);
    });
}

assignmentForm.addEventListener("submit", event => {

    event.preventDefault();

    const name = document.getElementById("assignmentName").value.trim();
    const subject = document.getElementById("assignmentSubject").value.trim();
    const date = document.getElementById("assignmentDate").value;
    const priority = document.getElementById("assignmentPriority").value;

    assignments.push({
        name,
        subject,
        date,
        priority,
        completed: false
    });

   saveAssignments();
displayAssignments();
updateDashboard();
assignmentForm.reset();
});

displayAssignments();


// EXAM MANAGEMENT

const examForm = document.getElementById("examForm");
const examList = document.getElementById("examList");

let exams = JSON.parse(
    localStorage.getItem("studentExams")
) || [];

function saveExams() {
    localStorage.setItem(
        "studentExams",
        JSON.stringify(exams)
    );
}

function displayExams() {

    examList.innerHTML = "";

    if (exams.length === 0) {
        examList.textContent = "No examinations added yet.";
        return;
    }

    exams.forEach((exam, index) => {

        const card = document.createElement("div");
        card.className = "exam-item";

        const details = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = exam.name;

        const subject = document.createElement("p");
        subject.textContent = "Subject: " + exam.subject;

        const date = document.createElement("p");
        date.textContent = "Exam date: " + exam.date;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const examDay = new Date(exam.date + "T00:00:00");
        const daysLeft = Math.ceil(
            (examDay - today) / (1000 * 60 * 60 * 24)
        );

        const countdown = document.createElement("p");

        if (daysLeft < 0) {
            countdown.textContent = "Exam date has passed.";
        } else if (daysLeft === 0) {
            countdown.textContent = "Exam is TODAY!";
        } else {
            countdown.textContent =
                daysLeft + " days remaining";
        }

        details.append(name, subject, date, countdown);

        const remove = document.createElement("button");
        remove.textContent = "Delete";

        remove.addEventListener("click", () => {
        exams.splice(index, 1);
         saveExams();
        displayExams();
        updateDashboard();
        });

        card.append(details, remove);
        examList.appendChild(card);
    });
}

examForm.addEventListener("submit", event => {

    event.preventDefault();

    const name = document.getElementById("examName").value.trim();
    const subject = document.getElementById("examSubject").value.trim();
    const date = document.getElementById("examDate").value;

    exams.push({
        name,
        subject,
        date
    });

    saveExams();
displayExams();
updateDashboard();

examForm.reset();
});

displayExams();
document.getElementById("exportBackup").addEventListener("click", () => {
    const backup = {
        tasks: JSON.parse(localStorage.getItem("studentTasks")) || [],
        timetable: JSON.parse(localStorage.getItem("studyTimetable")) || [],
        assignments: JSON.parse(localStorage.getItem("studentAssignments")) || [],
        exams: JSON.parse(localStorage.getItem("studentExams")) || []
    };

    const blob = new Blob(
        [JSON.stringify(backup, null, 2)],
        { type: "application/json" }
    );

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "StudyMate-Backup.json";
    link.click();

    URL.revokeObjectURL(link.href);
});
document.getElementById("importBackup").addEventListener("click", () => {
    document.getElementById("importFile").click();
});

document.getElementById("importFile").addEventListener("change", event => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);

            if (
                !backup.tasks ||
                !backup.timetable ||
                !backup.assignments ||
                !backup.exams
            ) {
                alert("Invalid backup file!");
                return;
            }

            localStorage.setItem("studentTasks", JSON.stringify(backup.tasks));
            localStorage.setItem("studyTimetable", JSON.stringify(backup.timetable));
            localStorage.setItem("studentAssignments", JSON.stringify(backup.assignments));
            localStorage.setItem("studentExams", JSON.stringify(backup.exams));

            alert("Backup restored successfully! The page will now reload.");
            location.reload();

        } catch (error) {
            alert("Could not read this backup file!");
        }
    };

    reader.readAsText(file);
});
const darkModeToggle = document.getElementById("darkModeToggle");

if (localStorage.getItem("studyMateDarkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
}

darkModeToggle.addEventListener("change", () => {
    if (darkModeToggle.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("studyMateDarkMode", "enabled");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("studyMateDarkMode", "disabled");
    }
});
const appNameInput = document.getElementById("appNameInput");
const saveAppName = document.getElementById("saveAppName");

const savedAppName = localStorage.getItem("studyMateAppName");

if (savedAppName) {
    document.title = savedAppName;
    document.querySelector("h1").textContent = savedAppName;
    appNameInput.value = savedAppName;
}

saveAppName.addEventListener("click", () => {
    const newName = appNameInput.value.trim();

    if (newName === "") {
        alert("Please enter an app name!");
        return;
    }

    localStorage.setItem("studyMateAppName", newName);

    document.title = newName;
    document.querySelector("h1").textContent = newName;

    alert("App name changed successfully!");
});


// DASHBOARD STATISTICS

function updateDashboard() {

    // Count incomplete tasks
    const pendingTasks = tasks.filter(task => !task.completed).length;

    // Count incomplete assignments
    const pendingAssignments = assignments.filter(
        assignment => !assignment.completed
    ).length;

    // Calculate total study hours
    let totalMinutes = 0;

    sessions.forEach(session => {
        if (session.start && session.end) {
            const start = session.start.split(":");
            const end = session.end.split(":");

            const startMinutes = Number(start[0]) * 60 + Number(start[1]);
            const endMinutes = Number(end[0]) * 60 + Number(end[1]);

            let duration = endMinutes - startMinutes;

            if (duration < 0) {
                duration += 1440;
            }

            totalMinutes += duration;
        }
    });

    const totalHours = (totalMinutes / 60).toFixed(1);

    document.getElementById("taskCount").textContent = pendingTasks;

    document.getElementById("assignmentCount").textContent = pendingAssignments;

    document.getElementById("studyHours").textContent = totalHours;
}

// Display statistics when the app loads
updateDashboard();


// REGISTER SERVICE WORKER

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => {
                console.log("TsappyPlan offline support enabled");
            })
            .catch(error => {
                console.log("Service worker registration failed:", error);
            });
    });
}