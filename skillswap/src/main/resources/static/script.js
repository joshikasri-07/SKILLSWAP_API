let userId = null;

let skills = [];

let selectedSkill = 0;


/* GET */

async function get(url) {

    let response = await fetch(url);

    if (!response.ok) {
        throw new Error("Request failed");
    }

    return response.json();
}


/* LOAD MEMBERS */

async function loadUsers() {

    let members = await get(
        "/api/members"
    );

    let select =
        document.getElementById(
            "userSelect"
        );

    select.innerHTML = "";


    members.forEach(member => {

        select.innerHTML += `
            <option value="${member.id}">
                ${member.name}
            </option>
        `;
    });


    if (members.length > 0) {

        userId = members[0].id;

    }


    dashboard();
}


/* CHANGE USER */

function changeUser() {

    userId = Number(
        document.getElementById(
            "userSelect"
        ).value
    );


    dashboard();
}


/* PAGE NAVIGATION */

function showPage(page) {

    document
        .querySelectorAll("main section")
        .forEach(section => {

            section.classList.add(
                "hidden"
            );

        });


    document
        .getElementById(page)
        .classList.remove("hidden");


    let titles = {

        dashboard: "Dashboard",

        skills: "Explore Skills",

        mySkills: "My Skills",

        requests: "Requests",

        wallet: "Credit Wallet",

        profile: "Profile"

    };


    document
        .getElementById("pageTitle")
        .innerText = titles[page];


    if (page === "dashboard") {
        dashboard();
    }

    if (page === "skills") {
        loadSkills();
    }

    if (page === "mySkills") {
        loadMySkills();
    }

    if (page === "requests") {
        loadRequests();
    }

    if (page === "wallet") {
        loadWallet();
    }

    if (page === "profile") {
        loadProfile();
    }
}


/* DASHBOARD */

async function dashboard() {

    let user = await get(
        `/api/members/${userId}`
    );


    skills = await get(
        "/api/skills"
    );


    let requests = await get(
        "/api/requests"
    );


    document
        .getElementById("topCredits")
        .innerText =
        user.creditBalance;


    document
        .getElementById("dashboardCredits")
        .innerText =
        user.creditBalance;


    document
        .getElementById("skillCount")
        .innerText =
        skills.length;


    let myRequests =
        requests.filter(
            request =>
                request.requester.id == userId
        );


    document
        .getElementById("requestCount")
        .innerText =
        myRequests.length;


    document
        .getElementById("completedCount")
        .innerText =
        myRequests.filter(
            request =>
                request.status === "COMPLETED"
        ).length;


    displaySkills(
        skills.slice(0, 3),
        "dashboardSkills"
    );
}


/* DISPLAY SKILLS */

function displaySkills(
    data,
    elementId
) {

    let box =
        document.getElementById(
            elementId
        );


    box.innerHTML = "";


    if (data.length === 0) {

        box.innerHTML =
            "<p>No skills available.</p>";

        return;
    }


    data.forEach(skill => {

        let button = "";


        if (
            skill.provider.id != userId
        ) {

            button = `

                <button
                    onclick="
                    openRequestModal(
                        ${skill.id},
                        '${skill.skillName}'
                    )">

                    Request

                </button>

            `;
        }


        box.innerHTML += `

            <div class="skill-card">

                <h3>
                    ${skill.skillName}
                </h3>

                <p>
                    ${skill.description}
                </p>

                <p>
                    👤 ${skill.provider.name}
                </p>

                <p>
                    ⏱ ${skill.availableHours}
                    hours
                </p>

                ${button}

            </div>

        `;
    });
}


/* EXPLORE */

async function loadSkills() {

    skills = await get(
        "/api/skills"
    );


    displaySkills(
        skills,
        "skillsList"
    );
}


/* SEARCH */

function searchSkills() {

    let text =
        document
            .getElementById("search")
            .value
            .toLowerCase();


    let result =
        skills.filter(
            skill =>
                skill.skillName
                    .toLowerCase()
                    .includes(text)
        );


    displaySkills(
        result,
        "skillsList"
    );
}


/* MY SKILLS */

async function loadMySkills() {

    let data =
        await get("/api/skills");


    let mine =
        data.filter(
            skill =>
                skill.provider.id == userId
        );


    displaySkills(
        mine,
        "mySkillsList"
    );
}


/* ADD SKILL MODAL */

function openSkillModal() {

    document
        .getElementById("skillModal")
        .classList.remove("hidden");
}


function closeSkillModal() {

    document
        .getElementById("skillModal")
        .classList.add("hidden");
}


/* ADD SKILL */

async function addSkill() {

    let name =
        document
            .getElementById("skillName")
            .value;


    let description =
        document
            .getElementById(
                "skillDescription"
            )
            .value;


    let hours =
        Number(
            document
                .getElementById(
                    "skillHours"
                )
                .value
        );


    if (
        !name ||
        !description ||
        hours <= 0
    ) {

        alert(
            "Please enter all skill details."
        );

        return;
    }


    let skill = {

        skillName: name,

        description: description,

        availableHours: hours

    };


    let response =
        await fetch(
            `/api/skills/member/${userId}`,
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(skill)

            }
        );


    if (response.ok) {

        alert(
            "Skill added successfully!"
        );


        document
            .getElementById(
                "skillName"
            )
            .value = "";


        document
            .getElementById(
                "skillDescription"
            )
            .value = "";


        document
            .getElementById(
                "skillHours"
            )
            .value = "";


        closeSkillModal();

        dashboard();

    } else {

        alert(
            "Could not add skill."
        );
    }
}


/* REQUEST MODAL */

function openRequestModal(
    id,
    name
) {

    selectedSkill = id;


    document
        .getElementById(
            "requestSkill"
        )
        .innerText = name;


    document
        .getElementById(
            "requestHours"
        )
        .value = 1;


    document
        .getElementById(
            "requestModal"
        )
        .classList.remove(
            "hidden"
        );
}


function closeRequestModal() {

    document
        .getElementById(
            "requestModal"
        )
        .classList.add(
            "hidden"
        );
}


/* SEND REQUEST */

async function sendRequest() {

    let hours =
        Number(
            document
                .getElementById(
                    "requestHours"
                )
                .value
        );


    if (hours <= 0) {

        alert(
            "Enter valid hours."
        );

        return;
    }


    let response =
        await fetch(

            `/api/requests` +
            `?requesterId=${userId}` +
            `&skillOfferId=${selectedSkill}` +
            `&hours=${hours}`,

            {
                method: "POST"
            }

        );


    if (response.ok) {

        alert(
            "Request sent successfully!"
        );


        closeRequestModal();

        loadRequests();

    } else {

        let error =
            await response.json();


        alert(
            error.message ||
            "Request failed."
        );
    }
}


/* REQUESTS */

async function loadRequests() {

    let data =
        await get(
            "/api/requests"
        );


    let box =
        document.getElementById(
            "requestsList"
        );


    box.innerHTML = "";


    if (data.length === 0) {

        box.innerHTML =
            "<p>No requests found.</p>";

        return;
    }


    data.forEach(request => {

        let buttons = "";


        if (
            request.skillOffer.provider.id ==
            userId
            &&
            request.status ===
            "PENDING"
        ) {

            buttons += `

                <button
                    onclick="
                    updateRequest(
                        ${request.id},
                        'confirm'
                    )">

                    Confirm

                </button>

            `;
        }


        if (
            request.skillOffer.provider.id ==
            userId
            &&
            request.status ===
            "CONFIRMED"
        ) {

            buttons += `

                <button
                    onclick="
                    updateRequest(
                        ${request.id},
                        'complete'
                    )">

                    Complete

                </button>

            `;
        }


        if (
            request.status === "PENDING" ||
            request.status === "CONFIRMED"
        ) {

            buttons += `

                <button
                    onclick="
                    updateRequest(
                        ${request.id},
                        'cancel'
                    )">

                    Cancel

                </button>

            `;
        }


        box.innerHTML += `

            <div class="request">

                <h3>
                    ${request
                        .skillOffer
                        .skillName}
                </h3>


                <p>
                    Requester:
                    ${request
                        .requester
                        .name}
                </p>


                <p>
                    Hours:
                    ${request
                        .requestedHours}
                </p>


                <p>
                    Status:
                    <b>
                        ${request.status}
                    </b>
                </p>


                ${buttons}

            </div>

        `;
    });
}


/* UPDATE REQUEST */

async function updateRequest(
    id,
    action
) {

    let response =
        await fetch(
            `/api/requests/${id}/${action}`,
            {
                method: "PUT"
            }
        );


    if (response.ok) {

        alert(
            "Request updated successfully!"
        );


        loadRequests();

        dashboard();

    } else {

        let error =
            await response.json();


        alert(
            error.message ||
            "Could not update request."
        );
    }
}


/* WALLET */

async function loadWallet() {

    let user =
        await get(
            `/api/members/${userId}`
        );


    let ledger =
        await get(
            `/api/ledger/member/${userId}`
        );


    document
        .getElementById(
            "walletCredits"
        )
        .innerText =
        user.creditBalance;


    let box =
        document.getElementById(
            "ledger"
        );


    box.innerHTML = "";


    if (ledger.length === 0) {

        box.innerHTML =
            "<p>No transactions yet.</p>";

        return;
    }


    ledger.forEach(transaction => {

        box.innerHTML += `

            <div class="ledger-item">

                <b>
                    ${transaction
                        .transactionType}
                </b>

                -

                ${transaction.hours}
                hour(s)

                &nbsp; | &nbsp;

                Balance:
                ${transaction.balanceAfter}

            </div>

        `;
    });
}


/* PROFILE */

async function loadProfile() {

    let user =
        await get(
            `/api/members/${userId}`
        );


    document
        .getElementById(
            "profileName"
        )
        .innerText =
        user.name;


    document
        .getElementById(
            "profileEmail"
        )
        .innerText =
        user.email;


    document
        .getElementById(
            "profileCredits"
        )
        .innerText =
        user.creditBalance;


    document
        .getElementById(
            "avatar"
        )
        .innerText =
        user.name
            .charAt(0)
            .toUpperCase();


    document
        .getElementById(
            "joined"
        )
        .innerText =
        new Date(
            user.createdAt
        ).toLocaleDateString();
}


/* START */

loadUsers();