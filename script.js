// LOGIN
function login() {
    let u = document.getElementById("username").value;
    let p = document.getElementById("password").value;

    if (u === "admin" && p === "1234") {
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("error").innerText = "Invalid login!";
    }
}

// FACILITIES
function showInfo(type) {
    let info = "";

    if (type === "library")
        info = "📚 Library: 2nd floor | 8 AM - 10 PM";
    else if (type === "mess")
        info = "🍽️ Mess: Ground floor | 8-10 AM, 1-3 PM, 8-10 PM";
    else if (type === "gym")
        info = "🏋️ Gym: Block B | 6-10 AM & 5-9 PM";
    else if (type === "reading")
        info = "📖 Reading Room: 1st floor | 24 hrs";
    else if (type === "medical")
        info = "🏥 Medical: Entrance | 24/7";
    else if (type === "warden")
        info = "👨‍💼 Warden: Ground floor | 10 AM - 6 PM";

    document.getElementById("infoBox").innerText = info;
}

// SUBMIT COMPLAINT
function submitComplaint() {
    let name = document.getElementById("name").value;
    let branch = document.getElementById("branch").value;
    let roll = document.getElementById("roll").value;
    let message = document.getElementById("message").value;

    if (!name || !branch || !roll || !message) {
        alert("Fill all fields!");
        return;
    }

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    complaints.push({
        name, branch, roll, message,
        status: "Pending"
    });

    localStorage.setItem("complaints", JSON.stringify(complaints));

    document.getElementById("response").innerText =
    "✅ Complaint submitted!";

    document.getElementById("name").value = "";
    document.getElementById("branch").value = "";
    document.getElementById("roll").value = "";
    document.getElementById("message").value = "";
}

// STATUS PAGE
function loadComplaints() {
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    let div = document.getElementById("list");

    if (!div) return;

    if (complaints.length === 0) {
        div.innerHTML = "<p style='color:white;'>No complaints</p>";
        return;
    }

    div.innerHTML = "";

    complaints.forEach((c, i) => {
        div.innerHTML += `
            <button onclick="viewStatus(${i})">
                ${c.name} (${c.roll})
            </button><br>
        `;
    });
}

function viewStatus(i) {
    let c = JSON.parse(localStorage.getItem("complaints"))[i];

    alert(
        "Name: " + c.name +
        "\nBranch: " + c.branch +
        "\nRoll: " + c.roll +
        "\nComplaint: " + c.message +
        "\nStatus: " + c.status +
        "\nResponse: " + (c.response || "No response yet")
    );
}

window.onload = function () {
    loadComplaints();
    loadAdmin();
};


// ADMIN
// LOAD ADMIN TABLE
// LOAD ADMIN DASHBOARD
function loadAdmin() {
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    let table = document.getElementById("adminTable");

    if (!table) return;

    table.innerHTML = "";

    if (complaints.length === 0) {
        table.innerHTML = "<tr><td colspan='7'>No complaints yet</td></tr>";
        return;
    }

    complaints.forEach((c, i) => {
        table.innerHTML += `
            <tr>
                <td>${c.name}</td>
                <td>${c.branch}</td>
                <td>${c.roll}</td>
                <td>${c.message}</td>

                <td>
                    <select onchange="updateStatus(${i}, this.value)">
                        <option ${c.status=="Pending"?"selected":""}>Pending</option>
                        <option ${c.status=="In Progress"?"selected":""}>In Progress</option>
                        <option ${c.status=="Resolved"?"selected":""}>Resolved</option>
                    </select>
                </td>

                <td>
                    <input type="text"
                           value="${c.response || ""}"
                           onchange="updateResponse(${i}, this.value)">
                </td>

                <td>
                    <button onclick="deleteComplaint(${i})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// UPDATE STATUS
function updateStatus(i, value) {
    let complaints = JSON.parse(localStorage.getItem("complaints"));
    complaints[i].status = value;
    localStorage.setItem("complaints", JSON.stringify(complaints));
}

// UPDATE RESPONSE
function updateResponse(i, value) {
    let complaints = JSON.parse(localStorage.getItem("complaints"));
    complaints[i].response = value;
    localStorage.setItem("complaints", JSON.stringify(complaints));
}

// DELETE COMPLAINT
function deleteComplaint(i) {
    let complaints = JSON.parse(localStorage.getItem("complaints"));
    complaints.splice(i, 1);
    localStorage.setItem("complaints", JSON.stringify(complaints));
    loadAdmin(); // refresh table
}