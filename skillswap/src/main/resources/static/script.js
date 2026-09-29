let userId = 0;
let selectedSkill = 0;


/* GET DATA */

async function get(url) {

    let r = await fetch(url);

    if (!r.ok)
        throw new Error("Request failed");

    return r.json();
}


/* MEMBERS */

async function loadUsers() {

    let users = await get("/api/members");

    let select = document.getElementById("userSelect");

    select.innerHTML = "";

    users.forEach(u => {
        select.innerHTML +=
            `<option value="${u.id}">${u.name}</option>`;
    });

    if (users.length) {
        userId = users[0].id;
        loadDashboard();
    }
}


function changeUser() {

    userId =
        Number(document.getElementById("userSelect").value);

    loadDashboard();
}


/* PAGE NAVIGATION */

function page(name) {

    document.querySelectorAll("main section")
        .forEach(s => s.classList.add("hide"));

    document.getElementById(name)
        .classList.remove("hide");

    if (name == "dashboard")
        loadDashboard();

    if (name == "skills")
        loadSkills();

    if (name == "mySkills")
        loadMySkills();

    if (name == "requests")
        loadRequests("sent");

    if (name == "wallet")
        loadWallet();

    if (name == "profile")
        loadProfile();
}


/* DASHBOARD */

async function loadDashboard() {

    let user =
        await get(`/api/members/${userId}`);

    let skills =
        await get("/api/skills");

    let requests =
        await get("/api/requests");

    document.getElementById("topCredits")
        .innerText = user.creditBalance;

    document.getElementById("sCredits")
        .innerText = user.creditBalance;

    let mySkills =
        skills.filter(s => s.provider.id == userId);

    let myRequests =
        requests.filter(r =>
            r.requester.id == userId ||
            r.skillOffer.provider.id == userId
        );

    let completed =
        myRequests.filter(r =>
            r.status == "COMPLETED"
        );

    document.getElementById("sSkills")
        .innerText = mySkills.length;

    document.getElementById("sRequests")
        .innerText = myRequests.length;

    document.getElementById("sCompleted")
        .innerText = completed.length;

    showSkills(skills, "dashSkills", 4);
}


/* EXPLORE */

async function loadSkills() {

    let skills =
        await get("/api/skills");

    let search =
        document.getElementById("search").value
        .toLowerCase();

    skills = skills.filter(s =>
        s.skillName.toLowerCase()
        .includes(search)
    );

    showSkills(skills, "skillList");
}


/* DISPLAY SKILLS */

function showSkills(data, element, limit) {

    if (limit)
        data = data.slice(0, limit);

    let box =
        document.getElementById(element);

    box.innerHTML = "";

    if (!data.length) {
        box.innerHTML =
            "<p>No skills available.</p>";
        return;
    }

    data.forEach(s => {

        let button = "";

        if (s.provider.id != userId) {

            button = `
                <button onclick="openRequest(
                    ${s.id},
                    '${s.skillName.replace(/'/g, "\\'")}'
                )">
                    Request Skill
                </button>`;
        }

        box.innerHTML += `
            <div class="card">

                <h3>${s.skillName}</h3>

                <p>${s.description}</p>

                <p>👤 ${s.provider.name}</p>

                <p>⏱ ${s.availableHours}
                   available hours</p>

                ${button}

            </div>
        `;
    });
}


/* MY SKILLS */

async function loadMySkills() {

    let skills =
        await get("/api/skills");

    let mine =
        skills.filter(s =>
            s.provider.id == userId
        );

    let box =
        document.getElementById("mySkillList");

    box.innerHTML = "";

    if (!mine.length) {

        box.innerHTML =
            "<p>You have not offered any skills yet.</p>";

        return;
    }

    mine.forEach(s => {

        box.innerHTML += `
            <div class="card">

                <h3>${s.skillName}</h3>

                <p>${s.description}</p>

                <p>⏱ ${s.availableHours}
                   available hours</p>

                <button onclick="deleteSkill(${s.id})">
                    Delete
                </button>

            </div>
        `;
    });
}


/* ADD SKILL */

function openSkill() {

    document.getElementById("skillModal")
        .classList.remove("hide");
}


function closeSkill() {

    document.getElementById("skillModal")
        .classList.add("hide");
}


async function addSkill() {

    let name =
        document.getElementById("skillName").value;

    let desc =
        document.getElementById("skillDesc").value;

    let hours =
        Number(document.getElementById("skillHours").value);

    if (!name || !desc || hours <= 0) {

        alert("Please enter all skill details.");

        return;
    }

    let r = await fetch(
        `/api/skills/member/${userId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                skillName: name,
                description: desc,
                availableHours: hours
            })
        }
    );

    if (r.ok) {

        alert("Skill added successfully.");

        closeSkill();

        document.getElementById("skillName").value = "";
        document.getElementById("skillDesc").value = "";
        document.getElementById("skillHours").value = "";

        loadDashboard();

    } else {

        alert("Could not add skill.");
    }
}


/* DELETE SKILL */

async function deleteSkill(id) {

    if (!confirm("Delete this skill?"))
        return;

    let r = await fetch(
        `/api/skills/${id}`,
        { method: "DELETE" }
    );

    if (r.ok) {

        alert("Skill deleted.");

        loadMySkills();
        loadDashboard();
    }
}


/* REQUEST SKILL */

function openRequest(id, name) {

    selectedSkill = id;

    document.getElementById("selectedSkill")
        .innerText = "Requesting: " + name;

    document.getElementById("requestModal")
        .classList.remove("hide");
}


function closeRequest() {

    document.getElementById("requestModal")
        .classList.add("hide");
}


async function sendRequest() {

    let hours =
        Number(document.getElementById("requestHours").value);

    if (hours <= 0) {

        alert("Enter valid hours.");

        return;
    }

    let r = await fetch(
        `/api/requests?requesterId=${userId}` +
        `&skillOfferId=${selectedSkill}` +
        `&hours=${hours}`,
        { method: "POST" }
    );

    if (r.ok) {

        alert("Request sent successfully.");

        closeRequest();

        loadDashboard();

    } else {

        let e = await r.json();

        alert(e.message);
    }
}


/* REQUESTS */

async function loadRequests(type) {

    let requests =
        await get("/api/requests");

    let data;

    if (type == "sent") {

        data = requests.filter(r =>
            r.requester.id == userId
        );

    } else {

        data = requests.filter(r =>
            r.skillOffer.provider.id == userId
        );
    }

    let box =
        document.getElementById("requestList");

    box.innerHTML = "";

    if (!data.length) {

        box.innerHTML =
            "<p>No requests found.</p>";

        return;
    }

    data.forEach(r => {

        let actions = "";

        if (type == "received" &&
            r.status == "PENDING") {

            actions += `
                <button onclick="updateRequest(
                    ${r.id}, 'confirm'
                )">
                    Confirm
                </button>`;
        }

        if (type == "received" &&
            r.status == "CONFIRMED") {

            actions += `
                <button onclick="updateRequest(
                    ${r.id}, 'complete'
                )">
                    Complete
                </button>`;
        }

        if (r.status == "PENDING" ||
            r.status == "CONFIRMED") {

            actions += `
                <button onclick="updateRequest(
                    ${r.id}, 'cancel'
                )">
                    Cancel
                </button>`;
        }

        box.innerHTML += `
            <div class="card">

                <h3>${r.skillOffer.skillName}</h3>

                <p>Requester:
                    ${r.requester.name}</p>

                <p>Provider:
                    ${r.skillOffer.provider.name}</p>

                <p>Requested Hours:
                    ${r.requestedHours}</p>

                <p>Status:
                    <b>${r.status}</b>
                </p>

                ${actions}

            </div>
        `;
    });
}


/* CONFIRM / COMPLETE / CANCEL */

async function updateRequest(id, action) {

    let r = await fetch(
        `/api/requests/${id}/${action}`,
        { method: "PUT" }
    );

    if (r.ok) {

        alert("Request updated successfully.");

        loadRequests("received");
        loadDashboard();

    } else {

        let e = await r.json();

        alert(e.message);
    }
}


/* WALLET */

async function loadWallet() {

    let user =
        await get(`/api/members/${userId}`);

    let ledger =
        await get(`/api/ledger/member/${userId}`);

    document.getElementById("walletCredits")
        .innerText = user.creditBalance;

    let box =
        document.getElementById("ledger");

    box.innerHTML = "";

    if (!ledger.length) {

        box.innerHTML =
            "<p>No transactions yet.</p>";

        return;
    }

    ledger.forEach(x => {

        box.innerHTML += `
            <div class="ledger">
                <b>${x.transactionType}</b>
                &nbsp; ${x.hours} hour(s)
                &nbsp; → Balance ${x.balanceAfter}
            </div>
        `;
    });
}


/* ADD CREDITS */

async function addCredits() {

    let amount =
        prompt("Enter credits to add:");

    if (!amount || Number(amount) <= 0)
        return;

    let r = await fetch(
        `/api/members/${userId}/credits?credits=${amount}`,
        { method: "PUT" }
    );

    if (r.ok) {

        alert("Credits added successfully.");

        loadWallet();
        loadDashboard();
    }
}


/* PROFILE */

async function loadProfile() {

    let u =
        await get(`/api/members/${userId}`);

    document.getElementById("pName")
        .innerText = u.name;

    document.getElementById("pEmail")
        .innerText = u.email;

    document.getElementById("pId")
        .innerText = u.id;

    document.getElementById("pCredits")
        .innerText = u.creditBalance;

    document.getElementById("avatar")
        .innerText =
        u.name.charAt(0).toUpperCase();

    document.getElementById("pDate")
        .innerText =
        new Date(u.createdAt)
        .toLocaleDateString();
}


/* NEW MEMBER */

function openMember() {

    document.getElementById("memberModal")
        .classList.remove("hide");
}


function closeMember() {

    document.getElementById("memberModal")
        .classList.add("hide");
}


async function addMember() {

    let name =
        document.getElementById("memberName").value;

    let email =
        document.getElementById("memberEmail").value;

    if (!name || !email) {

        alert("Enter name and email.");

        return;
    }

    let r = await fetch(
        "/api/members",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email
            })
        }
    );

    if (r.ok) {

        alert("Member created successfully.");

        closeMember();

        document.getElementById("memberName").value = "";
        document.getElementById("memberEmail").value = "";

        loadUsers();

    } else {

        let e = await r.json();

        alert(e.message);
    }
}


/* START */

loadUsers();