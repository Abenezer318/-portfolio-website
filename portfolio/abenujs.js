// ================= MOBILE MENU =================

const menuBtn = document.getElementById("menu-btn");
const navbar = document.getElementById("navbar");

menuBtn.addEventListener("click", () => {

    navbar.classList.toggle("show");

    const icon = menuBtn.querySelector("i");

    if (navbar.classList.contains("show")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }

});


// Close mobile menu after clicking a link

document.querySelectorAll(".navbar a").forEach(link => {

    link.addEventListener("click", () => {

        navbar.classList.remove("show");

        const icon = menuBtn.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


// ================= DARK / LIGHT MODE =================





const contactForm = document.getElementById("contact-form");

const scriptURL = "https://script.google.com/macros/s/AKfycbzZe_yCHT3GGXZ3Pcxhsz_RsZTQ7Ka-hnhQbCyjKmMbwKPu69olsafOxz0IwlQE2IrL/exec";

contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(contactForm);

    const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message")
    };

    try {
        const response = await fetch(scriptURL, {
            method: "POST",
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            alert("Thank you! Your message has been received.");
            contactForm.reset();
        } else {
            alert("Unable to save your message.");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Check the browser console.");
    }
});



// ================= ACTIVE NAVIGATION =================

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            current = section.getAttribute("id");
        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});
// https://script.google.com/macros/s/AKfycbwoWDw0AItzX-59E2DnCd3EMX6adzmweqjkvnABC3XbuXZvO-ODHIlnzUREzNNRhY0/exec