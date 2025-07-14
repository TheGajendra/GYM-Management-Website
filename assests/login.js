// Firebase configuration

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

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

// Tab switching functionality
const tabs = document.querySelectorAll('.tab');
const forms = document.querySelectorAll('.form');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const targetForm = tab.getAttribute('data-tab');
        forms.forEach(form => form.classList.remove('active'));
        document.getElementById(`${targetForm}-form`).classList.add('active');
    });
});

// Switch form links
const switchToRegister = document.querySelector('.switch-to-register');
const switchToLogin = document.querySelector('.switch-to-login');

if (switchToRegister) {
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        tabs.forEach(t => t.classList.remove('active'));
        tabs[1].classList.add('active');
        forms.forEach(form => form.classList.remove('active'));
        document.getElementById('register-form').classList.add('active');
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    });
}

if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        tabs.forEach(t => t.classList.remove('active'));
        tabs[0].classList.add('active');
        forms.forEach(form => form.classList.remove('active'));
        document.getElementById('login-form').classList.add('active');
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    });
}

// Firebase Login
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Simple validation
    if (!email || !password) {
        showToast('Please fill in all fields', false);
        return;
    }

    // Show loading state
    const loginBtn = document.querySelector('#login-form .btn');
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const db = firebase.firestore();
            const user = userCredential.user;
            const uid = user.uid;
            const userEmail = user.email;

            // First check in 'users' collection
            db.collection("users").doc(uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const role = doc.data().role || "user";
                        showToast('Login successful! Redirecting...', true);
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);
                    } else {
                        // If not in users, search 'members' by email
                        return db.collection("members")
                            .where("email", "==", userEmail)
                            .limit(1)
                            .get()
                            .then((querySnapshot) => {
                                if (!querySnapshot.empty) {
                                    const memberDoc = querySnapshot.docs[0];
                                    const role = memberDoc.data().role || "member";
                                    showToast('Login successful! Redirecting...', true);
                                    setTimeout(() => {
                                        window.location.href = 'member-dashboard.html';
                                    }, 1500);
                                } else {
                                    showToast('User data not found in any collection.', false);
                                }
                            });
                    }
                })
                .catch((err) => {
                    console.error('Error checking role:', err);
                    showToast('Login failed: Unable to determine role.', false);
                });
        })

        .catch((error) => {
            console.error('Login error:', error);
            let errorMessage = 'Login failed. ';
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage += 'User not found.';
                    break;
                case 'auth/wrong-password':
                    errorMessage += 'Incorrect password.';
                    break;
                case 'auth/invalid-email':
                    errorMessage += 'Invalid email address.';
                    break;
                default:
                    errorMessage += error.message;
            }
            showToast(errorMessage, false);
        })
        .finally(() => {
            loginBtn.textContent = 'Login to Account';
            loginBtn.disabled = false;
        });
});

// Firebase Registration
document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const name = document.getElementById('register-name').value;

    // Simple validation
    if (!email || !password || !confirmPassword || !name) {
        showToast('Please fill in all fields', false);
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', false);
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters', false);
        return;
    }

    // Show loading state
    const registerBtn = document.querySelector('#register-form .btn');
    registerBtn.textContent = 'Creating account...';
    registerBtn.disabled = true;

    // Initialize Firestore
    const db = firebase.firestore();

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Save user data to Firestore
            return db.collection("users").doc(user.uid).set({
                name: name,
                email: email,
                uid: user.uid,
                role: "user",
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                return user.updateProfile({ displayName: name });
            });
        })
        .then(() => {
            showToast('Registration successful! Welcome to GymSphere', true);
            setTimeout(() => {
                tabs.forEach(t => t.classList.remove('active'));
                tabs[0].classList.add('active');
                forms.forEach(form => form.classList.remove('active'));
                document.getElementById('login-form').classList.add('active');
                document.getElementById('register-form').reset();
            }, 1500);
        })
        .catch((error) => {
            console.error('Registration error:', error);
            let errorMessage = 'Registration failed. ';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage += 'Email already in use.';
                    break;
                case 'auth/weak-password':
                    errorMessage += 'Password is too weak.';
                    break;
                case 'auth/invalid-email':
                    errorMessage += 'Invalid email address.';
                    break;
                default:
                    errorMessage += error.message;
            }
            showToast(errorMessage, false);
        })
        .finally(() => {
            registerBtn.textContent = 'Create Account';
            registerBtn.disabled = false;
        });

});

// Ensure the form container is scrollable if needed
window.addEventListener('resize', adjustFormHeight);

function adjustFormHeight() {
    const formSection = document.querySelector('.form-section');
    const formContainer = document.querySelector('.form-container');
    formContainer.style.height = 'auto';
    if (formContainer.scrollHeight > window.innerHeight * 0.8) {
        formContainer.style.maxHeight = (window.innerHeight - 200) + 'px';
        formContainer.style.overflowY = 'auto';
    }
}

// Initialize on load
window.addEventListener('load', adjustFormHeight);
