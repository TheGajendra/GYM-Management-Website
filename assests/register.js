const firebaseConfig = {
    apiKey: "AIzaSyBi7fL8Bq-UMdHLmCb4Dsa6uCN8ahS-s6k",
    authDomain: "gymsphere-df953.firebaseapp.com",
    projectId: "gymsphere-df953",
    storageBucket: "gymsphere-df953.firebasestorage.app",
    messagingSenderId: "145617623638",
    appId: "1:145617623638:web:ba2a41e88945b93b5db9f7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Global variables
let currentStep = 1;
let selectedPlan = "premium";
let membershipDuration = 3;

// Toast notification function
function showToast(message, isSuccess = true) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + (isSuccess ? 'success' : 'error');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Step navigation
function nextStep(step) {
    document.getElementById(`step${step}`).classList.remove('active');
    document.getElementById(`step${step + 1}`).classList.add('active');

    // Update progress steps
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        if (index < step) {
            stepEl.classList.add('completed');
            stepEl.classList.remove('active');
        }
        if (index === step) {
            stepEl.classList.add('active');
        }
    });

    currentStep = step + 1;
}

function prevStep(step) {
    document.getElementById(`step${step}`).classList.remove('active');
    document.getElementById(`step${step - 1}`).classList.add('active');

    // Update progress steps
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        if (index === step - 2) {
            stepEl.classList.add('active');
        }
        if (index === step - 1) {
            stepEl.classList.remove('active');
        }
    });

    currentStep = step - 1;
}

// Form validation
function validateStep(step) {
    let isValid = true;

    if (step === 1) {
        // Validate step 1 fields
        if (!document.getElementById('fullName').value) isValid = false;
        if (!document.getElementById('dob').value) isValid = false;
        if (!document.getElementById('email').value) isValid = false;
        if (!document.getElementById('phone').value) isValid = false;
        if (!document.getElementById('address').value) isValid = false;
        if (!document.getElementById('city').value) isValid = false;
        if (!document.getElementById('state').value) isValid = false;
        if (!document.getElementById('zip').value) isValid = false;
    }
    else if (step === 2) {
        // Validate step 2 fields
        if (!document.getElementById('height').value) isValid = false;
        if (!document.getElementById('weight').value) isValid = false;
        if (!document.getElementById('emergencyName').value) isValid = false;
        if (!document.getElementById('emergencyPhone').value) isValid = false;
        if (!document.getElementById('exerciseFrequency').value) isValid = false;
        if (!document.getElementById('fitnessGoals').value) isValid = false;
        if (!document.getElementById('workoutTime').value) isValid = false;
    }
    else if (step === 3) {
        // Step 3 doesn't require validation beyond selection
        isValid = true;
    }

    if (isValid) {
        nextStep(step);
    } else {
        showToast('Please fill in all required fields', false);
    }
}

// Membership selection
function selectMembership(element, plan) {
    document.querySelectorAll('.membership-card').forEach(card => {
        card.classList.remove('selected');
    });
    element.classList.add('selected');
    selectedPlan = plan;
}

// Submit registration to Firestore
function submitRegistration() {
    // Get all form values
    const registrationData = {
        personalInfo: {
            fullName: document.getElementById('fullName').value,
            dob: document.getElementById('dob').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            gender: document.querySelector('input[name="gender"]:checked').value
        },
        healthInfo: {
            height: document.getElementById('height').value,
            weight: document.getElementById('weight').value,
            medicalConditions: document.getElementById('medicalConditions').value,
            emergencyName: document.getElementById('emergencyName').value,
            emergencyPhone: document.getElementById('emergencyPhone').value,
            exerciseFrequency: document.getElementById('exerciseFrequency').value,
            fitnessGoals: document.getElementById('fitnessGoals').value,
            workoutTime: document.getElementById('workoutTime').value
        },
        membershipInfo: {
            plan: selectedPlan,
            duration: document.getElementById('membershipDuration').value,
            startDate: new Date().toISOString()
        },
        paymentInfo: {
            cardName: document.getElementById('cardName').value,
            cardNumber: document.getElementById('cardNumber').value,
            cardExpiry: document.getElementById('cardExpiry').value,
            cardCVV: document.getElementById('cardCVV').value,
            billingAddress: document.getElementById('billingAddress').value,
            promoCode: document.getElementById('promoCode').value
        },
        registrationDate: new Date().toISOString(),
        status: "active"
    };

    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;

    // Save to Firestore in "gym_registrations" collection
    db.collection("gym_registrations").add(registrationData)
        .then((docRef) => {
            console.log("Registration saved with ID: ", docRef.id);
            showToast('Registration successful!', true);
            nextStep(4); // Go to confirmation page
        })
        .catch((error) => {
            console.error("Error saving registration: ", error);
            showToast('Registration failed. Please try again.', false);
        })
        .finally(() => {
            submitBtn.innerHTML = 'Complete Registration <i class="fas fa-check"></i>';
            submitBtn.disabled = false;
        });
}

// Initialize membership duration
document.getElementById('membershipDuration').addEventListener('change', function () {
    membershipDuration = this.value;
});