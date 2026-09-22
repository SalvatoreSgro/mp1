/* Your JS here. */
const button = document.getElementById("learn-more");

button.addEventListener("click", function() {
    const ballparkSection = document.getElementById("ballpark");
    ballparkSection.scrollIntoView({ behavior: "smooth" });
});

const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".carousel-slide");
const leftArrow = document.querySelector(".carousel-arrow-left");
const rightArrow = document.querySelector(".carousel-arrow-right");

let currentSlide = 0;

function showSlide(index) {
    track.style.transform = `translateX(-${index * 100}%)`;
}

leftArrow.addEventListener("click", function() {
    currentSlide--;

    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);
});

rightArrow.addEventListener("click", function() {
    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    showSlide(currentSlide);
}); 


const columns = document.querySelectorAll('.column');

const modal = document.getElementById('info-modal');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');
const closeModalButton = document.getElementById('close-modal');

const information = {
    history: {
        title: "History of Wrigley Field",
        text: "Wrigley Field, home of the Chicago Cubs, is one of the oldest ballparks in Major League Baseball. It opened in 1914 and has a rich history, including hosting the first night game in 1988. The iconic hand-turned scoreboard is one of its most recognizable features."
    },

    pennant: {
        title: "History of Winning",
        text: "The Chicago Cubs have a long history in Major League Baseball, and their fans are known for their loyalty and passion. The team has won three World Series championships, in 1907, 1908, and 2016. The Cubs' 2016 World Series victory was particularly significant, as it ended a 108-year championship drought, the longest in professional sports history. It was an electric series ending in game 7 in extra innings where the Cubs were able to edged out the Cleveland Indians, now the Guardians."
    },

    fans: {
        title: "Tradition and Fanbase",
        text: "The Chicago Cubs are known for their passionate and loyal fanbase. The team has a rich tradition of supporting their players even during underperforming seasons, and celebrating their achievements. The Cubs' fans are known for their dedication and enthusiasm, creating an electric atmosphere at Wrigley Field. One of the biggest traditions is the hanging of the Chicago Cub's 'W' flag after a win, which is a symbol of victory and pride for the team and its fans. Furthermore, after every win at Wrigley Field, 'Go, Cubs, Go!' is played over the stadium's speakers, a tradition that has been in place for decades and is beloved by fans."
    }
}

columns.forEach((column) => {
    column.addEventListener("click", () => {
        const infoKey = column.getAttribute("data-info");
        const info = information[infoKey];

        if (info) {
            modalTitle.textContent = info.title;
            modalText.textContent = info.text;
            modal.style.display = "block";
        }
    });
});

closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

function setupNavbar() {
    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    const links = Array.from(
        navbar.querySelectorAll('a[href^="#"]')
    );

    const linkedSections = new Set(
        links
            .map((link) =>
                document.getElementById(
                    link.getAttribute("href").slice(1)
                )
            )
            .filter(Boolean)
    );

    // Use the actual page order.
    const sections = Array.from(
        document.querySelectorAll("main section[id]")
    ).filter((section) => linkedSections.has(section));

    if (!sections.length) return;

    function updateNavbar() {
        navbar.classList.toggle("scrolled", window.scrollY > 20);

        // Track immediately below the navbar.
        const trackingLine =
            navbar.getBoundingClientRect().bottom + 2;

        let currentSection = sections[0];

        sections.forEach((section) => {
            if (
                section.getBoundingClientRect().top <=
                trackingLine
            ) {
                currentSection = section;
            }
        });

        const atBottom =
            window.scrollY > 0 &&
            window.scrollY + window.innerHeight >=
                document.documentElement.scrollHeight - 3;

        if (atBottom) {
            currentSection = sections[sections.length - 1];
        }

        links.forEach((link) => {
            const isActive =
                link.getAttribute("href") ===
                `#${currentSection.id}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    let updateScheduled = false;

    function scheduleUpdate() {
        if (updateScheduled) return;

        updateScheduled = true;

        requestAnimationFrame(() => {
            updateScheduled = false;
            updateNavbar();
        });
    }

    // Scroll to the section using the final collapsed height.
    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            if (
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            const target = document.getElementById(
                link.getAttribute("href").slice(1)
            );

            if (!target) return;

            event.preventDefault();

            const targetPosition =
                target.id === "home"
                    ? 0
                    : target.getBoundingClientRect().top +
                      window.scrollY -
                      58;

            const reducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            history.pushState(
                null,
                "",
                link.getAttribute("href")
            );

            window.scrollTo({
                top: targetPosition,
                behavior: reducedMotion ? "instant" : "smooth"
            });
        });
    });

    window.addEventListener("scroll", scheduleUpdate, {
        passive: true
    });

    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("load", scheduleUpdate);

    const navbarObserver = new ResizeObserver(scheduleUpdate);
    navbarObserver.observe(navbar);

    updateNavbar();
}

setupNavbar();