import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();
// 🔥 FIREBASE IMPORT
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔥 FIREBASE CONFIG (यहाँ अपना डालो)
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDFYM4cXnQLpDTLqNsKtp_OcD4ME6lEsY",
  authDomain: "temple-donation-app-a32f8.firebaseapp.com",
  databaseURL: "https://temple-donation-app-a32f8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "temple-donation-app-a32f8",
  storageBucket: "temple-donation-app-a32f8.firebasestorage.app",
  messagingSenderId: "494327337671",
  appId: "1:494327337671:web:0a1e08fb443a69e972a4e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =============================
// GLOBAL DATA
// =============================
let donors = [];
let donations = [];
let expenses = [];

let adminPassword = "1111";

// =============================
// ROLE CHECK
// =============================
function isAdmin(){
    return localStorage.getItem("role") === "admin";
}

// =============================
// PAGE SYSTEM
// =============================
function openSection(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
}

function goHome() {
    openSection("dashboardPage");
}

// =============================
// LOGIN SYSTEM
// =============================
function loginAdmin() {
    let u = loginUser.value;
    let p = loginPass.value;

    if (u === "aaaa" && p === adminPassword) {
        localStorage.setItem("role", "admin");
    } else {
        localStorage.setItem("role", "viewer");
    }

    openSection("dashboardPage");
}

function logout() {
    localStorage.clear();
    openSection("loginPage");
}

// =============================
// FIREBASE LOAD
// =============================
onValue(ref(db, "donors"), (snapshot) => {
    donors = snapshot.val() || [];
    loadDonorTable();
    loadDonorDropdown();
});

onValue(ref(db, "donations"), (snapshot) => {
    donations = snapshot.val() || [];
    loadDonationTable();
});

onValue(ref(db, "expenses"), (snapshot) => {
    expenses = snapshot.val() || [];
    loadExpenseTable();
});

// =============================
// DONOR
// =============================
function addDonor() {
    if(!isAdmin()) return alert("आप सिर्फ देख सकते हैं");

    let name = donorName.value.trim();
    if (!name) return;

    donors.push(name);
    set(ref(db, "donors"), donors);

    donorName.value = "";
}

function deleteDonor(i) {
    if(!isAdmin()) return alert("आप सिर्फ देख सकते हैं");

    donors.splice(i, 1);
    set(ref(db, "donors"), donors);
}

function loadDonorTable() {
    let table = document.getElementById("donorTable");
    table.innerHTML = "<tr><th>नाम</th><th>Action</th></tr>";

    donors.forEach((d, i) => {
        table.innerHTML += `
        <tr>
            <td>${d}</td>
            <td>${isAdmin() ? `<button onclick="deleteDonor(${i})">Delete</button>` : ""}</td>
        </tr>`;
    });
}

function loadDonorDropdown() {
    donorSelect.innerHTML = "";
    donors.forEach(d => {
        donorSelect.innerHTML += `<option>${d}</option>`;
    });
}

// =============================
// DONATION
// =============================
function addDonation() {
    if(!isAdmin()) return alert("आप सिर्फ देख सकते हैं");

    let donor = donorSelect.value;
    let month = donationMonth.value;
    let amount = Number(donationAmount.value);

    if (!amount) return;

    donations.push({ donor, month, amount });
    set(ref(db, "donations"), donations);

    donationAmount.value = "";
}

function deleteDonation(i) {
    if(!isAdmin()) return alert("आप सिर्फ देख सकते हैं");

    donations.splice(i, 1);
    set(ref(db, "donations"), donations);
}

function loadDonationTable() {
    let table = document.getElementById("donationTable");
    table.innerHTML = "<tr><th>नाम</th><th>महीना</th><th>राशि</th><th>Action</th></tr>";

    donations.forEach((d, i) => {
        table.innerHTML += `
        <tr>
            <td>${d.donor}</td>
            <td>${d.month}</td>
            <td>${d.amount}</td>
            <td>${isAdmin() ? `<button onclick="deleteDonation(${i})">Delete</button>` : ""}</td>
        </tr>`;
    });
}

// =============================
// EXPENSE
// =============================
function addExpense() {
    if(!isAdmin()) return alert("आप सिर्फ देख सकते हैं");

    let detail = expDetail.value;
    let amount = Number(expAmount.value);
    let month = expMonth.value;

    if (!amount) return;

    expenses.push({ detail, amount, month });
    set(ref(db, "expenses"), expenses);

    expDetail.value = "";
    expAmount.value = "";
}

function deleteExpense(i) {
    if(!isAdmin()) return alert("आप सिर्फ देख सकते हैं");

    expenses.splice(i, 1);
    set(ref(db, "expenses"), expenses);
}

function loadExpenseTable() {
    let table = document.getElementById("expenseTable");
    table.innerHTML = "<tr><th>विवरण</th><th>महीना</th><th>राशि</th><th>Action</th></tr>";

    expenses.forEach((e, i) => {
        table.innerHTML += `
        <tr>
            <td>${e.detail}</td>
            <td>${e.month}</td>
            <td>${e.amount}</td>
            <td>${isAdmin() ? `<button onclick="deleteExpense(${i})">Delete</button>` : ""}</td>
        </tr>`;
    });
}

// =============================
// REPORT
// =============================
function calculateReport() {
    let totalDonation = donations.reduce((a, b) => a + b.amount, 0);
    let totalExpense = expenses.reduce((a, b) => a + b.amount, 0);

    totalDonationEl.innerText = totalDonation;
    totalExpenseEl.innerText = totalExpense;
    finalBalance.innerText = totalDonation - totalExpense;
}
function register(){
    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, pass)
    .then(() => {
        alert("User register हो गया ✅");
    })
    .catch(e => alert(e.message));
}
function login(){
    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {

        let user = userCredential.user;

        // 👑 ADMIN CHECK (यहाँ अपना email डालो)
        if(user.email === "shantanu2781986@gmail.com"){
            localStorage.setItem("role","admin");
        } else {
            localStorage.setItem("role","viewer");
        }

        openSection("dashboardPage");
    })
    .catch(e => alert(e.message));
}