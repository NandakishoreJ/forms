/* =========================================
   STUDENT MANAGEMENT SYSTEM
   FIREBASE FIRESTORE VERSION
========================================= */


/* =========================================
   FIREBASE IMPORTS
========================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


/* =========================================
   FIREBASE CONFIGURATION
========================================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyBJWC6xuN4WSDrXGfkXiRnLsvECLCYS2jU",

    authDomain:
        "student-form-9511e.firebaseapp.com",

    projectId:
        "student-form-9511e",

    storageBucket:
        "student-form-9511e.firebasestorage.app",

    messagingSenderId:
        "146858051954",

    appId:
        "1:146858051954:web:9a3365f82a0b703529b5eb",

    measurementId:
        "G-X8XBK4QF02"

};


/* =========================================
   INITIALIZE FIREBASE
========================================= */

const app =
    initializeApp(firebaseConfig);


/* =========================================
   INITIALIZE FIRESTORE
========================================= */

const db =
    getFirestore(app);


/* =========================================
   FIRESTORE COLLECTION
========================================= */

const studentsCollection =
    collection(db, "students");


/* =========================================
   GET HTML ELEMENTS
========================================= */

const studentForm =
    document.getElementById("studentForm");

const studentTable =
    document.getElementById("studentTable");

const searchInput =
    document.getElementById("searchInput");

const courseFilter =
    document.getElementById("courseFilter");

const modalBackground =
    document.getElementById("modalBackground");

const modalTitle =
    document.getElementById("modalTitle");

const studentIdInput =
    document.getElementById("studentId");

const nameInput =
    document.getElementById("name");

const rollNumberInput =
    document.getElementById("rollNumber");

const emailInput =
    document.getElementById("email");

const courseInput =
    document.getElementById("course");

const yearInput =
    document.getElementById("year");

const phoneInput =
    document.getElementById("phone");

const totalStudents =
    document.getElementById("totalStudents");

const totalCourses =
    document.getElementById("totalCourses");

const filteredStudents =
    document.getElementById("filteredStudents");

const showingText =
    document.getElementById("showingText");

const emptyMessage =
    document.getElementById("emptyMessage");


/* =========================================
   BUTTONS
========================================= */

const addStudentButton =
    document.getElementById("addStudentButton");

const emptyAddButton =
    document.getElementById("emptyAddButton");

const closeModal =
    document.getElementById("closeModal");

const cancelButton =
    document.getElementById("cancelButton");


/* =========================================
   STUDENT ARRAY
========================================= */

let students = [];

let editingStudentId = null;


/* =========================================
   LOAD STUDENTS FROM FIREBASE
========================================= */

async function loadStudents() {

    try {

        const snapshot =
            await getDocs(studentsCollection);

        students = [];

        snapshot.forEach((documentSnapshot) => {

            students.push({

                id:
                    documentSnapshot.id,

                ...documentSnapshot.data()

            });

        });


        console.log(
            "Students loaded from Firebase:",
            students
        );


        displayStudents();

    }

    catch (error) {

        console.error(
            "Error loading students:",
            error
        );

        alert(
            "Unable to load student data from Firebase."
        );

    }

}


/* =========================================
   GET INITIALS
========================================= */

function getInitials(name) {

    const words =
        name.trim().split(" ");


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   UPDATE COURSE FILTER
========================================= */

function updateCourseFilter() {

    const selectedCourse =
        courseFilter.value;


    const courses = [

        ...new Set(

            students
                .map(student => student.course)
                .filter(course => course)

        )

    ].sort();


    courseFilter.innerHTML =
        `<option value="">All Courses</option>`;


    courses.forEach(course => {

        const option =
            document.createElement("option");


        option.value =
            course;


        option.textContent =
            course;


        courseFilter.appendChild(option);

    });


    if (courses.includes(selectedCourse)) {

        courseFilter.value =
            selectedCourse;

    }

}


/* =========================================
   GET FILTERED STUDENTS
========================================= */

function getFilteredStudents() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedCourse =
        courseFilter.value;


    return students.filter(student => {


        const matchesSearch =

            search === "" ||

            String(student.name || "")
                .toLowerCase()
                .includes(search) ||

            String(student.rollNumber || "")
                .toLowerCase()
                .includes(search) ||

            String(student.email || "")
                .toLowerCase()
                .includes(search) ||

            String(student.course || "")
                .toLowerCase()
                .includes(search) ||

            String(student.year || "")
                .toLowerCase()
                .includes(search) ||

            String(student.phone || "")
                .toLowerCase()
                .includes(search);


        const matchesCourse =

            selectedCourse === "" ||

            student.course ===
            selectedCourse;


        return (
            matchesSearch &&
            matchesCourse
        );

    });

}


/* =========================================
   DISPLAY STUDENTS
========================================= */

function displayStudents() {

    updateCourseFilter();


    const filtered =
        getFilteredStudents();


    studentTable.innerHTML = "";


    /* =====================================
       UPDATE STATISTICS
    ===================================== */

    totalStudents.textContent =
        students.length;


    const courses =
        new Set(
            students
                .map(student => student.course)
                .filter(course => course)
        );


    totalCourses.textContent =
        courses.size;


    filteredStudents.textContent =
        filtered.length;


    showingText.textContent =
        `Showing ${filtered.length} student${
            filtered.length === 1
                ? ""
                : "s"
        }`;


    /* =====================================
       EMPTY STATE
    ===================================== */

    if (filtered.length === 0) {

        emptyMessage.style.display =
            "block";

    }

    else {

        emptyMessage.style.display =
            "none";

    }


    /* =====================================
       CREATE TABLE ROWS
    ===================================== */

    filtered.forEach(student => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <div class="student">

                    <div class="student-avatar">

                        ${escapeHTML(
                            getInitials(
                                student.name
                            )
                        )}

                    </div>

                    <div class="student-name">

                        ${escapeHTML(
                            student.name
                        )}

                    </div>

                </div>

            </td>


            <td>

                ${escapeHTML(
                    student.rollNumber
                )}

            </td>


            <td>

                <span class="course-badge">

                    ${escapeHTML(
                        student.course
                    )}

                </span>

            </td>


            <td>

                ${escapeHTML(
                    student.year
                )}

            </td>


            <td>

                ${escapeHTML(
                    student.email
                )}

            </td>


            <td>

                ${escapeHTML(
                    student.phone || "-"
                )}

            </td>


            <td>

                <div class="actions">

                    <button
                        class="action-btn"
                        onclick="editStudent('${student.id}')"
                        title="Edit"
                    >

                        ✏️

                    </button>


                    <button
                        class="action-btn delete-btn"
                        onclick="deleteStudent('${student.id}')"
                        title="Delete"
                    >

                        🗑️

                    </button>

                </div>

            </td>

        `;


        studentTable.appendChild(row);

    });

}


/* =========================================
   OPEN ADD MODAL
========================================= */

function openAddModal() {

    editingStudentId = null;


    modalTitle.textContent =
        "Add Student";


    studentForm.reset();


    studentIdInput.value =
        "";


    modalBackground.classList.add(
        "show"
    );


    nameInput.focus();

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeStudentModal() {

    modalBackground.classList.remove(
        "show"
    );


    studentForm.reset();


    editingStudentId =
        null;

}


/* =========================================
   ADD / UPDATE STUDENT
========================================= */

async function addStudent(event) {

    event.preventDefault();


    const name =
        nameInput.value.trim();


    const rollNumber =
        rollNumberInput.value.trim();


    const email =
        emailInput.value.trim();


    const course =
        courseInput.value.trim();


    const year =
        yearInput.value;


    const phone =
        phoneInput.value.trim();


    /* =====================================
       CHECK DUPLICATE ROLL NUMBER
    ===================================== */

    const duplicate =
        students.some(student =>

            String(student.rollNumber)
                .toLowerCase() ===
            rollNumber.toLowerCase()

            &&

            student.id !==
            editingStudentId

        );


    if (duplicate) {

        alert(
            "A student with this roll number already exists."
        );


        rollNumberInput.focus();


        return;

    }


    /* =====================================
       STUDENT DATA
    ===================================== */

    const studentData = {

        name:
            name,

        rollNumber:
            rollNumber,

        email:
            email,

        course:
            course,

        year:
            year,

        phone:
            phone

    };


    /* =====================================
       UPDATE EXISTING STUDENT
    ===================================== */

    if (editingStudentId) {

        try {

            const studentReference =
                doc(
                    db,
                    "students",
                    editingStudentId
                );


            await updateDoc(
                studentReference,
                studentData
            );


            alert(
                "Student updated successfully."
            );


        }

        catch (error) {

            console.error(
                "Error updating student:",
                error
            );


            alert(
                "Failed to update student."
            );


            return;

        }

    }


    /* =====================================
       ADD NEW STUDENT
    ===================================== */

    else {

        try {

            await addDoc(
                studentsCollection,
                studentData
            );


            alert(
                "Student added successfully."
            );

        }

        catch (error) {

            console.error(
                "Error adding student:",
                error
            );


            alert(
                "Failed to add student."
            );


            return;

        }

    }


    /* =====================================
       RELOAD DATA
    ===================================== */

    await loadStudents();


    /* =====================================
       CLOSE MODAL
    ===================================== */

    closeStudentModal();

}


/* =========================================
   EDIT STUDENT
========================================= */

function editStudent(id) {

    const student =
        students.find(
            student =>
                student.id === id
        );


    if (!student) {

        return;

    }


    editingStudentId =
        student.id;


    modalTitle.textContent =
        "Edit Student";


    studentIdInput.value =
        student.id;


    nameInput.value =
        student.name || "";


    rollNumberInput.value =
        student.rollNumber || "";


    emailInput.value =
        student.email || "";


    courseInput.value =
        student.course || "";


    yearInput.value =
        student.year || "";


    phoneInput.value =
        student.phone || "";


    modalBackground.classList.add(
        "show"
    );


    nameInput.focus();

}


/* =========================================
   DELETE STUDENT
========================================= */

async function deleteStudent(id) {

    const student =
        students.find(
            student =>
                student.id === id
        );


    if (!student) {

        return;

    }


    const confirmed =
        confirm(
            `Are you sure you want to delete ${student.name}?`
        );


    if (!confirmed) {

        return;

    }


    try {

        const studentReference =
            doc(
                db,
                "students",
                id
            );


        await deleteDoc(
            studentReference
        );


        alert(
            "Student deleted successfully."
        );


        await loadStudents();

    }

    catch (error) {

        console.error(
            "Error deleting student:",
            error
        );


        alert(
            "Failed to delete student."
        );

    }

}


/* =========================================
   MAKE FUNCTIONS AVAILABLE GLOBALLY
========================================= */

window.editStudent =
    editStudent;


window.deleteStudent =
    deleteStudent;


/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    displayStudents
);


/* =========================================
   COURSE FILTER
========================================= */

courseFilter.addEventListener(
    "change",
    displayStudents
);


/* =========================================
   OPEN ADD BUTTON
========================================= */

addStudentButton.addEventListener(
    "click",
    openAddModal
);


emptyAddButton.addEventListener(
    "click",
    openAddModal
);


/* =========================================
   FORM SUBMIT
========================================= */

studentForm.addEventListener(
    "submit",
    addStudent
);


/* =========================================
   CLOSE BUTTON
========================================= */

closeModal.addEventListener(
    "click",
    closeStudentModal
);


cancelButton.addEventListener(
    "click",
    closeStudentModal
);


/* =========================================
   CLOSE WHEN CLICKING OUTSIDE MODAL
========================================= */

modalBackground.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            modalBackground
        ) {

            closeStudentModal();

        }

    }
);


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            modalBackground.classList.contains("show")
        ) {

            closeStudentModal();

        }

    }
);


/* =========================================
   START APPLICATION
========================================= */

loadStudents();
