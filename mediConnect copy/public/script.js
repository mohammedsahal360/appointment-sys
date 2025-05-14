//PAGE FUNCTIONS

//Show all Specialities

document.addEventListener("DOMContentLoaded", function () {
    function toggleShowAllButton() {
        const optionsContainer = document.getElementById("options");
        const showAllBtn = document.getElementById("showallbtn");

        if (optionsContainer.scrollHeight > optionsContainer.clientHeight) {
            showAllBtn.style.display = "block"; // Show button if content overflows
        } else {
            showAllBtn.style.display = "none"; // Hide button if all options fit
        }
    }

    // Run the function on load and when options change
    toggleShowAllButton();
    window.addEventListener("resize", toggleShowAllButton);
    const observer = new MutationObserver(toggleShowAllButton);
    observer.observe(document.getElementById("options"), { childList: true, subtree: true });
});



document.addEventListener("DOMContentLoaded", function(){
    const options = document.getElementById("options");
    const showbtn = document.getElementById("showallbtn");
    showbtn.addEventListener("click", function(){
        options.classList.toggle("sall");
        showbtn.innerHTML = options.classList.contains("sall")? "<h5>SHOW LESS</h5>": "<h5>SHOW ALL SPECIALITIES</h5>";
    });
});

//toglle continue to sign in box

function toggleSignbox(){
    const signbox = document.getElementById('signbox');
    const header = document.getElementById('header');
    const main = document.getElementById('main');
    const footer = document.getElementById('footer');
    signbox.classList.toggle('hide');
    header.classList.toggle('blur');
    main.classList.toggle('blur');
    footer.classList.toggle('blur');
}

let isSignUp = false;

function isSigned(condition) {
    return condition; 
}

function signclick() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please fill in both fields.');
        return;
    }

    const url = isSigned(isSignUp) ? 'https://mediconnect-dfg1.onrender.com:3000/register' : 'https://mediconnect-dfg1.onrender.com:3000/login';



    fetch(url, {  // Add full URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // Important for sessions
    })
    
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            localStorage.setItem("isSigned", "true");  // Store login state
            alert("Login successful!");
            window.location.href = "/index.html";  // Redirect to main page
        } else {
            alert("Invalid credentials! Please try again.");
        }
    })
    .catch(error => console.error('Error during sign-up/login:', error));
}

document.addEventListener("DOMContentLoaded", () => {
    fetch('https://mediconnect-dfg1.onrender.com:3000/check-auth')
        .then(response => response.json())
        .then(data => {
            if (data.isSigned) {
                alert(`Signed in as ${data.username}`);
            }
        })
        .catch(error => console.error("Error checking auth status:", error));
});

function convertsigntype() {
    isSignUp = !isSignUp;
    const signbtn = document.getElementById('signbtn');
    const signupsug = document.getElementById('signupsug');

    if (isSigned(isSignUp)) {
        signbtn.innerText = 'Sign Up';
        signupsug.innerText = 'Already have an account? Sign in now';
    } else {
        signbtn.innerText = 'Sign In';
        signupsug.innerText = 'No account! Sign up now';
    }
}



function togglebookingbox(doctor_id,name, qualification, speciality, hospital,rating, image){
    const bookingbox = document.getElementById('booknow');
    const header = document.getElementById('header');
    const main = document.getElementById('main');
    const footer = document.getElementById('footer');
    bookingbox.classList.toggle('hide');
    header.classList.toggle('blur');
    main.classList.toggle('blur');
    footer.classList.toggle('blur');
    setTimeout(() => { 
        loadNameonBooking(name, qualification, speciality, hospital, rating, image);
        loadSlots(doctor_id);
    }, 100);
}

function toggleonbooknow(doctor_id,name, qualification, speciality, hospital,rating, image){
    if (isSigned()){
        togglebookingbox(doctor_id,name, qualification, speciality, hospital,rating, image);
    } else {
        toggleSignbox()
    }
}




document.addEventListener("DOMContentLoaded", function () {
    const signbtn = document.getElementById('sighnIn');
    if (isSigned()){
        signbtn.innerHTML = `Sign Out`
    } else {
        signbtn.innerHTML = `Sign In`
    }
});

//DYNAMIC PAGE

async function loadAllHospitals(placeId){
    try{
        const response = await fetch(`https://mediconnect-dfg1.onrender.com:3000/api/hospitals/${placeId}`);
        const hospitals = await response.json();

        const optblock = document.getElementById('options');
        optblock.innerHTML = "";
        hospitals.forEach(hospital => {
            optblock.innerHTML += `
            <div class="opt">
                    <a href="#">${hospital.name}</a>
            </div>
            `
        });

    }
    catch(error){
        console.log("Error loading hospitals")
    }
}

async function loadAllSpecialities(placeId){
    try{
        const response = await fetch(`https://mediconnect-dfg1.onrender.com:3000/api/specialities/${placeId}`);
        const specialities = await response.json();
        const optblock = document.getElementById('options');
        optblock.innerHTML = "";
        specialities.forEach(speciality => {
            optblock.innerHTML += `
            <div class="opt">
                    <a href="#">${speciality.name}</a>
            </div>
            `
        });

    }
    catch(error){
        console.log("Error loading hospitals")
    }
}

async function getSpeciality(id){
    const response = await fetch(`https://mediconnect-dfg1.onrender.com:3000/api/speciality/${id}`);
    const speciality = await response.json();
    console.log(`speciality: ${speciality[0].name}`);
    return speciality[0].name;
}

async function getHospital(id){
    const response = await fetch(`https://mediconnect-dfg1.onrender.com:3000/api/hospital/${id}`);
    const hospital = await response.json();
    console.log(`hospital: ${hospital[0].name}`);
    return hospital[0].name;
}

async function loadAllDoctors(placeId){
    const response = await fetch(`https://mediconnect-dfg1.onrender.com:3000/api/doctors/${placeId}`);
    const doctors = await response.json();

    const doctorlist = document.getElementById('dclist');

    for(i = 0; i < doctors.length; i++){
        const doctor = doctors[i];
        const speciality = await getSpeciality(doctor.speciality_id);
        const hospital = await getHospital(doctor.hospital_id);
            doctorlist.innerHTML += `
            <div class="doc">
                        <img class = "docpic "src="${doctor.image_link}" alt="doctor image">
                    <div class="docmain">
                        <div class="docdetails">
                            <div class="docimg"></div>
                            <div class="mob">
                                <div class="name">Dr. ${doctor.name}</div>
                                <div class="qualification">${doctor.qualification}</div>
                                <div class="special">${speciality}</div>
                                <div class="hospital">${hospital}</div><hr>
                            </div>
                        </div>
                        <div class="btns">
                            <div class="bookbtn" onclick="toggleonbooknow(${doctor.id}, '${doctor.name}', '${doctor.qualification}', '${speciality}', '${hospital}', ${doctor.rating}, '${doctor.image_link}')"><h4>Book for Today</h4></div>
                            <div class="scheduledbtn"><h4>Schedule</h4></div>
                        </div>
                    </div>
                </div>
        `
    }
}

function formatTime(utcTime) {
    const date = new Date(utcTime);
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

async function loadNameonBooking(name, qualification, speciality, hospital,rating,image){
    const dochead = document.getElementById('booknowdochead');
    dochead.innerHTML = `
        <img class="doctorpic" src="${image}" alt="doctor image"></img>
            <div class="doctordetails">
                <div class="name">Dr. ${name}</div>
                <div class="qualification">${qualification}</div>
                <div class="special">${speciality}</div>
                <div class="hospital">${hospital}</div>
            </div>
            <div class="rating">
                ${rating} <span>&#9733;</span>
            </div>
    `
    const dateselector = document.getElementById('dateselector');
}

async function loadSlots(doctorId){
    try{
        const slotbox = document.getElementById('slots');
        const response = await fetch(`https://mediconnect-dfg1.onrender.com:3000/api/slots/${doctorId}`);
        const slots = await response.json();
        slotbox.innerHTML = "";
        if (slots.length === 0) {
            slotbox.innerHTML += "<p>No slots available</p>";
            return;
        }
        slots.forEach(slot => {
            let slotstatus = ""
            if (slot.status == "Fully Booked"){
                slotstatus = "full";
            } else if(slot.status == "Almost Booked"){
                slotstatus = "almost";
            } else{
                slotstatus = "less";
            }
            slotbox.innerHTML += `
                <div class="slot ${slotstatus}">
                    <div class="from">${formatTime(slot.start_time)}</div>-
                    <div class="to">${formatTime(slot.end_time)}</div>
                </div>
            `
        });

    } catch(error){
        console.log("Error loading slots ", error)
    }
    
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadAllSpecialities(1001);

    document.getElementById("optionselector").addEventListener("click", function (event) {
        let clickedOption = event.target.closest('.unselected'); // Detect clicked element
        let selectedOption = document.querySelector('.selected');

        if (!clickedOption || clickedOption === selectedOption) return; // Ignore invalid clicks

        // Load data based on clicked option
        if (clickedOption.classList.contains('specialopt')) {
            loadAllSpecialities(1001);
        } else {
            loadAllHospitals(1001);
        }

        // Swap selected and unselected classes
        selectedOption.classList.add('unselected');
        selectedOption.classList.remove('selected');
        clickedOption.classList.add('selected');
        clickedOption.classList.remove('unselected');
    });

    await loadAllDoctors(1001);
});
