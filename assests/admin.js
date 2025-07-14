//your api key here

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    const searchInput = document.getElementById("searchInput");

    function matchSearch(text) {
      const value = searchInput.value.toLowerCase();
      return text && text.toLowerCase().includes(value);
    }

    function renderUsers(data) {
      const tbody = document.getElementById("users-table");
      tbody.innerHTML = "";
      data.forEach(u => {
        if (!matchSearch(u.name) && !matchSearch(u.email)) return;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>
            <button class="btn btn-sm btn-delete btn-action" onclick="deleteUser('${u.id}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </td>`;
        tbody.appendChild(tr);
      });
    }

    function renderMembers(data) {
      const tbody = document.getElementById("members-table");
      tbody.innerHTML = "";
      data.forEach(m => {
        if (!matchSearch(m.name) && !matchSearch(m.email)) return;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${m.name}</td>
          <td><span class="badge bg-primary">${m.membership || 'Standard'}</span></td>
          <td>
            <button class="btn btn-sm btn-delete btn-action" onclick="deleteMember('${m.id}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </td>`;
        tbody.appendChild(tr);
      });
    }

    function renderFees(data) {
      const tbody = document.getElementById("fees-table");
      tbody.innerHTML = "";
      data.forEach(f => {
        const badgeClass = f.status === 'Paid' ? 'badge-paid' : (f.status === 'Unpaid' ? 'badge-unpaid' : 'badge-pending');
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${f.name}</td>
          <td><span class="badge ${badgeClass}">${f.status}</span></td>
          <td>
            <select class="form-select form-select-sm bg-dark text-light" onchange="updateFeeStatus('${f.id}', this.value)">
              <option${f.status === 'Paid' ? ' selected' : ''}>Paid</option>
              <option${f.status === 'Unpaid' ? ' selected' : ''}>Unpaid</option>
              <option${f.status === 'Pending' ? ' selected' : ''}>Pending</option>
            </select>
          </td>`;
        tbody.appendChild(tr);
      });
    }

    function deleteUser(id) {
      db.collection("users").doc(id).delete();
    }

    function deleteMember(id) {
      db.collection("members").doc(id).delete();
    }

    function updateFeeStatus(id, status) {
      db.collection("fees").doc(id).update({ status });
    }

    db.collection("users").onSnapshot(snapshot => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderUsers(users);
    });

    db.collection("members").onSnapshot(snapshot => {
      const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderMembers(members);
    });

    db.collection("fees").onSnapshot(snapshot => {
      const fees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderFees(fees);
    });

    // Search listener
    searchInput.addEventListener('input', () => {
      db.collection("users").get().then(snapshot => {
        renderUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      db.collection("members").get().then(snapshot => {
        renderMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      db.collection("fees").get().then(snapshot => {
        renderFees(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    });

    function renderData(id, collection, renderRow) {
      const tbody = document.getElementById(id);
      db.collection(collection).onSnapshot(snapshot => {
        tbody.innerHTML = "";
        snapshot.forEach(doc => {
          const data = doc.data();
          if (!matchSearch(data.name || data.fullName || data.email || data.status)) return;
          tbody.innerHTML += renderRow(doc);
        });
        if (collection === 'contactQueries') document.getElementById('query-count').textContent = snapshot.size;
        if (collection === 'gym_registrations') document.getElementById('reg-count').textContent = snapshot.size;
      });
    }

    renderData("queries-table", "contactQueries", doc => `
      <tr>
        <td>${doc.data().name}</td>
        <td>${doc.data().email}</td>
        <td>${doc.data().message}</td>
      </tr>`);

    renderData("registrations-table", "gym_registrations", doc => {
      const d = doc.data();
      return `<tr>
        <td>${d.personalInfo?.fullName || ''}</td>
        <td>${d.personalInfo?.email || ''}</td>
        <td>${d.membershipInfo?.plan || ''}</td>
        <td>${d.membershipInfo?.duration || ''} months</td>
        <td>${new Date(d.membershipInfo?.startDate).toLocaleDateString()}</td>
        <td><span class="badge bg-success">${d.status}</span></td>
        <td>
          <button class="btn btn-sm btn-primary btn-action">
            <i class="fas fa-eye"></i> View
          </button>
        </td>
      </tr>`
    });

    searchInput.addEventListener('input', () => {
      document.querySelectorAll('tbody').forEach(t => t.innerHTML = "");
      renderData("queries-table", "contactQueries", doc => `
        <tr>
          <td>${doc.data().name}</td>
          <td>${doc.data().email}</td>
          <td>${doc.data().message}</td>
        </tr>`);
      renderData("registrations-table", "gym_registrations", doc => {
        const d = doc.data();
        return `<tr>
          <td>${d.personalInfo?.fullName || ''}</td>
          <td>${d.personalInfo?.email || ''}</td>
          <td>${d.membershipInfo?.plan || ''}</td>
          <td>${d.membershipInfo?.duration || ''} months</td>
          <td>${new Date(d.membershipInfo?.startDate).toLocaleDateString()}</td>
          <td><span class="badge bg-success">${d.status}</span></td>
          <td>
            <button class="btn btn-sm btn-primary btn-action">
              <i class="fas fa-eye"></i> View
            </button>
          </td>
        </tr>`
      });
    });

    // Add new user
    document.querySelector("#addUserModal .btn-success").addEventListener("click", () => {
      const name = document.getElementById("userName").value;
      const email = document.getElementById("userEmail").value;
      const password = document.getElementById("userPassword").value;
      const role = document.getElementById("userRole").value;

      if (!name || !email || !password) return alert("Please fill all fields.");

      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(cred => {
          return db.collection("users").doc(cred.user.uid).set({
            name,
            email,
            role,
            uid: cred.user.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        })
        .then(() => {
          alert("User added successfully");
          document.getElementById("userName").value = "";
          document.getElementById("userEmail").value = "";
          document.getElementById("userPassword").value = "";
          document.getElementById("userRole").value = "Admin";
        })
        .catch(err => alert("Error: " + err.message));
    });

    // Add new member
    document.querySelector("#addMemberModal .btn-success").addEventListener("click", () => {
      const name = document.getElementById("memberName").value;
      const email = document.getElementById("memberEmail").value;
      const phone = document.getElementById("memberPhone").value;
      const plan = document.getElementById("memberPlan").value;
      const startDate = document.getElementById("memberStartDate").value;
      const duration = document.getElementById("memberDuration").value;

      const defaultPassword = "member123"; // You can generate or let admin set this

      if (!name || !email || !phone || !startDate) return alert("Please fill all fields.");

      // Create Firebase Auth account first
      firebase.auth().createUserWithEmailAndPassword(email, defaultPassword)
        .then(userCredential => {
          const uid = userCredential.user.uid;

          // Save member to Firestore
          return db.collection("members").doc(uid).set({
            fullName: name,
            email,
            phone,
            role: "member",
            plan,
            startDate,
            duration,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        })
        .then(() => {
          alert("Member added successfully with login access.\nDefault Password: member123");
          // Optionally clear modal inputs here
        })
        .catch(err => {
          console.error("Error adding member:", err);
          alert("Failed to add member: " + err.message);
        });
    });


    const recipientSelect = document.getElementById("notificationRecipient");
    const specificEmailContainer = document.getElementById("specificEmailContainer");

    recipientSelect.addEventListener("change", () => {
      if (recipientSelect.value === "specific") {
        specificEmailContainer.style.display = "block";
      } else {
        specificEmailContainer.style.display = "none";
      }
    });
    document.querySelector("#notificationModal .btn-warning").addEventListener("click", () => {
      const recipient = recipientSelect.value;
      const title = document.querySelector("#notificationModal input[type='text']").value.trim();
      const message = document.querySelector("#notificationModal textarea").value.trim();
      const priority = document.querySelector("#notificationModal input[name='priority']:checked").id.replace("Priority", "").toLowerCase();

      if (!title || !message) {
        alert("Please enter a title and message");
        return;
      }

      let notificationData = {
        title,
        message,
        priority,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };

      if (recipient === "specific") {
        const email = document.getElementById("specificMemberEmail").value.trim().toLowerCase();
        if (!email) return alert("Please enter a member email");

        notificationData.recipientType = "email";
        notificationData.recipientEmail = email;
      } else {
        notificationData.recipientType = "group";
        notificationData.recipientGroup = recipient.trim(); // Like "All Members"
      }

      db.collection("notifications").add(notificationData)
        .then(() => {
          alert("Notification sent!");
          // Clear fields
          document.querySelector("#notificationModal input[type='text']").value = "";
          document.querySelector("#notificationModal textarea").value = "";
          recipientSelect.value = "All Users";
          specificEmailContainer.style.display = "none";
          document.getElementById("specificMemberEmail").value = "";
        })
        .catch(err => alert("Error: " + err.message));
    });


function sendBillToFirestore() {
  const memberId = document.getElementById("billMemberId").value;
  const month = document.getElementById("billMonth").value;
  const amount = parseFloat(document.getElementById("billAmount").value);
  const dueDate = document.getElementById("billDueDate").value;
  const billStatus = document.getElementById("billStatus");

  if (!memberId || !month || !amount || !dueDate) {
    billStatus.textContent = "❌ All fields are required.";
    billStatus.classList.remove("text-success");
    billStatus.classList.add("text-danger");
    return;
  }

  db.collection("bills").add({
    memberId,
    month,
    amount,
    dueDate,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    billStatus.textContent = "✅ Bill sent successfully!";
    billStatus.classList.remove("text-danger");
    billStatus.classList.add("text-success");
    document.getElementById("sendBillForm").reset();
  })
  .catch((error) => {
    console.error("Error sending bill:", error);
    billStatus.textContent = "❌ Failed to send bill.";
    billStatus.classList.remove("text-success");
    billStatus.classList.add("text-danger");
  });
}


