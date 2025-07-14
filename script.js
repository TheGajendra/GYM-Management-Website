  // Your Firebase Configuration
  // your api key here

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
 // Reference the form
  const contactForm = document.querySelector(".contact-form");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    // Save to Firestore
    db.collection("contactQueries").add({
      name: name,
      email: email,
      phone: phone,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      alert("Your message has been sent successfully!");
      contactForm.reset();
    })
    .catch((error) => {
      console.error("Error sending message: ", error);
      alert("Something went wrong. Please try again.");
    });
  });


const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
    navLinks.classList.toggle("open");

    const isOpen = navLinks.classList.contains("open");
    menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) =>{
    navLinks.classList.remove("open");
    menuBtnIcon.setAttribute("class", "ri-menu-line");
});


// header reveal scroll

const scrollRevealOption = {
    origin: "bottom",
    distance: "50px",
    duration: 1000,
};

ScrollReveal().reveal(".header-image img", {
    ...scrollRevealOption,
    origin: "right",
});

ScrollReveal().reveal(".header-content h1", {
    ...scrollRevealOption,
    delay: 500,
});

ScrollReveal().reveal(".header-content h2", {
    ...scrollRevealOption,
    delay: 1000,
});

ScrollReveal().reveal(".header-content p", {
    ...scrollRevealOption,
    delay: 1500,
});

ScrollReveal().reveal(".header-btn", {
    ...scrollRevealOption,
    delay: 2000,
});

// about reveal scroll 

ScrollReveal().reveal(".about-image img", {
    ...scrollRevealOption,
    origin: "left",
});

ScrollReveal().reveal(".about-content .section-header", {
    ...scrollRevealOption,
    delay: 500,
});

ScrollReveal().reveal(".about-content p", {
    ...scrollRevealOption,
    delay: 1000,
});

ScrollReveal().reveal(".about-btn", {
    ...scrollRevealOption,
    delay: 1500,
});

//service section scroll

ScrollReveal().reveal(".service-card", {
    duration: 1000,
    interval: 500,
});

// plans section 

const revealPlansOnScroll = () => {
    const planCards = document.querySelectorAll(".plan-card");
    planCards.forEach(card => {
      const top = card.getBoundingClientRect().top;
      if (top < window.innerHeight - 150) {
        card.classList.add("show");
      }
    });
  };

  window.addEventListener("scroll", revealPlansOnScroll);
  window.addEventListener("load", revealPlansOnScroll);

  ScrollReveal().reveal(".plans-container .section-header", {
    ...scrollRevealOption,
    delay: 700,
});

//facilities section

ScrollReveal().reveal(".facility-content .section-header", {
    ...scrollRevealOption,
});

ScrollReveal().reveal(".facility-content p", {
    ...scrollRevealOption,
    delay: 500,
});

ScrollReveal().reveal(".supplement-store .section-header, .supplement-store .supplement-text", {
    ...scrollRevealOption,
    delay: 300,
});

//mentors section

ScrollReveal().reveal(".mentor-card", {
    ...scrollRevealOption,
    interval: 500,
});

//contact section

ScrollReveal().reveal(".banner__content", {
    ...scrollRevealOption,
    delay: 500,
});

ScrollReveal().reveal(".banner__form ", {
    ...scrollRevealOption,
    delay: 800,
});

document.addEventListener('DOMContentLoaded', function() {
      const form = document.querySelector('.contact-form');
      
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple validation
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if(name && email && message) {
          // In a real implementation, you would send the form data to a server
          alert('Thank you for your message! We will contact you soon.');
          form.reset();
        } else {
          alert('Please fill in all required fields.');
        }
      });
    });

    
