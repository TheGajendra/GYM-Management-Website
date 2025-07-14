// your api key here

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("memberName").textContent = user.displayName || "Member";
    const uid = user.uid;
    const currentUserEmail = user.email.trim().toLowerCase();

    db.collection("members").doc(uid).get().then(doc => {
        if (doc.exists) {
            const data = doc.data();
            document.getElementById("profile-section").innerHTML = `
                        <p><strong>Name:</strong> <span>${data.fullName || "N/A"}</span></p>
                        <p><strong>Email:</strong> <span>${user.email}</span></p>
                        <p><strong>Phone:</strong> <span>${data.phone || "N/A"}</span></p>
                        <p><strong>Membership:</strong> <span>${data.plan || "N/A"}</span></p>
                        <p><strong>Duration:</strong> <span>${data.duration || "N/A"}</span></p>
                        <p><strong>Start Date:</strong> <span>${data.startDate || "N/A"}</span></p>
                        <p><strong>Status:</strong> <span class="status-badge">Active</span></p>
                    `;
        } else {
            document.getElementById("profile-section").textContent = "Profile not found.";
        }
    });

    db.collection("notifications")
        .orderBy("timestamp", "desc")
        .onSnapshot(snapshot => {
            const container = document.getElementById("notifications-section");
            container.innerHTML = "";

            snapshot.forEach(doc => {
                const n = doc.data();
                const isForEmail = n.recipientType === "email" && n.recipientEmail === currentUserEmail;
                const isForAll = n.recipientType === "group" && n.recipientGroup === "All Members";

                if (isForEmail || isForAll) {
                    const priorityClass = n.priority?.toLowerCase() || 'low';
                    container.innerHTML += `
                                <div class="notification-item ${priorityClass}">
                                    <strong>${n.title}</strong><br>${n.message}
                                    <div class="text-end mt-2 text-muted" style="font-size: 0.8rem;">
                                        ${new Date(n.timestamp?.toDate()).toLocaleString()}
                                    </div>
                                </div>`;
                }
            });

            if (container.innerHTML === "") {
                container.innerHTML = `<div class="text-center py-4 text-muted">
                            <i class="fas fa-inbox fa-2x mb-2"></i>
                            <p>No notifications at this time</p>
                        </div>`;
            }
        });


    const userEmail = user.email.trim().toLowerCase(); // or from auth
    const billList = document.getElementById('billList');

    db.collection("bills")
        .where("email", "==", userEmail)
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
            billList.innerHTML = "";
            if (snapshot.empty) {
                billList.innerHTML = `<p class="text-muted">No bills found.</p>`;
                return;
            }

            snapshot.forEach((doc) => {
                const bill = doc.data();
                billList.innerHTML += `
        <div class="bill-card">
          <p><strong>Month:</strong> ${bill.month}</p>
          <p><strong>Amount:</strong> ₹${bill.amount}</p>
          <p><strong>Due:</strong> ${bill.dueDate}</p>
          <button onclick="downloadBill('${bill.month}', ${bill.amount}, '${bill.dueDate}')">Download</button>
        </div>
      `;
            });
        });

});

 function downloadBill(month, amount, dueDate) {
    const content = `🏋️‍♂️ GymSphere Bill\n\nMonth: ${month}\nAmount: ₹${amount}\nDue Date: ${dueDate}\n\nThank you for staying fit with us!`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `GymSphere-Bill-${month}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "login.html";
    });
}
