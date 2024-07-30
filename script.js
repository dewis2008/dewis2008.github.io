const nav = document.querySelector(".NavBar");
window.addEventListener("scroll", function () {
  if (document.documentElement.scrollTop > 20) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
});

// TEXT TYPING EFFECT //

const text1 = "Hello! ";
const text2 = "I Am Deividas Pilibaitis!";
const delay = 70;

const element1 = document.getElementById("text1");
const element2 = document.getElementById("text2");

function typeWriterEffect(text, element, callback, typingSpeed = 70) {
  let i = 0;
  element.style.opacity = 0;
  element.textContent = "";

  setTimeout(() => {
    element.style.opacity = 1;
    const interval = setInterval(function () {
      if (i < text.length) {
        element.textContent = text.substring(0, i + 1);
        i++;
      } else {
        clearInterval(interval);
        if (callback) callback();
      }
    }, typingSpeed); // typing speed
  }, 200); // typing delay
}

// SMOOTH SCROLLING //

const links = document.querySelectorAll(".main-nav-link");
const buttons = document.querySelectorAll(".pButton");

for (const link of links) {
  link.addEventListener("click", scrollToSection);
}

for (const button of buttons) {
  button.addEventListener("click", scrollToSection);
}

function scrollToSection(e) {
  e.preventDefault();
  const targetId =
    this.getAttribute("href") || this.getAttribute("data-target");
  const element = document.querySelector(targetId);

  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
    });
  }
}

// CAROUSEL //

const JSCarousel = ({
  carouselSelector,
  slideSelector,
  enablePagination = true,
  enableAutoplay = false,
  autoplayInterval = 2000,
}) => {
  const carousel = document.querySelector(carouselSelector);

  // If carousel element is not found, log an error and exit.
  if (!carousel) {
    console.error("Specify a valid selector for the carousel.");
    return null;
  }

  // Find all slides within the carousel
  const slides = carousel.querySelectorAll(slideSelector);

  // If no slides are found, log an error and exit.
  if (!slides.length) {
    console.error("Specify a valid selector for slides.");
    return null;
  }

  /*
   * Initialize variables to keep track of carousel state and
   * references to different elements.
   */
  let currentSlideIndex = 0;
  let prevBtn, nextBtn;
  let autoplayTimer;
  let paginationContainer;

  /*
   * Utility function to create and append HTML elements with
   * attributes and children.
   */
  const addElement = (tag, attributes, children) => {
    const element = document.createElement(tag);

    if (attributes) {
      // Set attributes to the element.
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    if (children) {
      // Set content to the element.
      if (typeof children === "string") {
        element.textContent = children;
      } else {
        children.forEach((child) => {
          if (typeof child === "string") {
            element.appendChild(document.createTextNode(child));
          } else {
            element.appendChild(child);
          }
        });
      }
    }

    return element;
  };

  /*
   * Modify the DOM structure and add required containers and controls
   * to the carousel element.
   */
  const tweakStructure = () => {
    carousel.setAttribute("tabindex", "0");

    // Create a div for carousel inner content.
    const carouselInner = addElement("div", {
      class: "carousel-inner",
    });
    carousel.insertBefore(carouselInner, slides[0]);

    /*
     * Move slides from the carousel element to the carousel inner
     * container to facilitate alignment.
     */
    slides.forEach((slide) => {
      carouselInner.appendChild(slide);
    });

    // Create and append previous button.
    prevBtn = addElement(
      "btn",
      {
        class: "carousel-btn carousel-btn--prev-next carousel-btn--prev",
        "aria-label": "Previous Slide",
      },
      "<"
    );
    carouselInner.appendChild(prevBtn);

    // Create and append next button.
    nextBtn = addElement(
      "btn",
      {
        class: "carousel-btn carousel-btn--prev-next carousel-btn--next",
        "aria-label": "Next Slide",
      },
      ">"
    );
    carouselInner.appendChild(nextBtn);

    // If pagination is enabled, create and append pagination buttons.
    if (enablePagination) {
      paginationContainer = addElement("nav", {
        class: "carousel-pagination",
        role: "tablist",
      });
      carousel.appendChild(paginationContainer);
    }

    /*
     * Set initial alignment styles for the slides, inject pagination
     * buttons, and attach event listeners to them.
     */
    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${index * 100}%)`;
      if (enablePagination) {
        const paginationBtn = addElement(
          "btn",
          {
            class: `carousel-btn caroursel-btn--${index + 1}`,
            role: "tab",
          },
          `${index + 1}`
        );

        paginationContainer.appendChild(paginationBtn);

        if (index === 0) {
          paginationBtn.classList.add("carousel-btn--active");
          paginationBtn.setAttribute("aria-selected", true);
        }

        paginationBtn.addEventListener("click", () => {
          handlePaginationBtnClick(index);
        });
      }
    });
  };

  // Adjust slide positions according to the currently selected slide.
  const adjustSlidePosition = () => {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - currentSlideIndex)}%)`;
    });
  };

  /*
   * Update the state of pagination buttons according to the currently
   * selected slide.
   */
  const updatePaginationBtns = () => {
    const paginationBtns = paginationContainer.children;
    const prevActiveBtns = Array.from(paginationBtns).filter((btn) =>
      btn.classList.contains("carousel-btn--active")
    );
    prevActiveBtns.forEach((btn) => {
      btn.classList.remove("carousel-btn--active");
      btn.removeAttribute("aria-selected");
    });

    const currActiveBtns = paginationBtns[currentSlideIndex];
    if (currActiveBtns) {
      currActiveBtns.classList.add("carousel-btn--active");
      currActiveBtns.setAttribute("aria-selected", true);
    }
  };

  // Update the overall carousel state.
  const updateCarouselState = () => {
    if (enablePagination) {
      updatePaginationBtns();
    }
    adjustSlidePosition();
  };

  // Move slide left and right based on direction provided.
  const moveSlide = (direction) => {
    const newSlideIndex =
      direction === "next"
        ? (currentSlideIndex + 1) % slides.length
        : (currentSlideIndex - 1 + slides.length) % slides.length;
    currentSlideIndex = newSlideIndex;
    updateCarouselState();
  };

  // Event handler for pagination button click event.
  const handlePaginationBtnClick = (index) => {
    currentSlideIndex = index;
    updateCarouselState();
  };

  // Event handlers for previous and next button clicks.
  const handlePrevBtnClick = () => moveSlide("prev");
  const handleNextBtnClick = () => moveSlide("next");

  // Start autoplaying of slides.
  const startAutoplay = () => {
    autoplayTimer = setInterval(() => {
      moveSlide("next");
    }, autoplayInterval);
  };

  // Stop autoplaying of slides.
  const stopAutoplay = () => clearInterval(autoplayTimer);

  /* Event handlers to manage autoplaying intelligentally on mouse
   * enter and leave events.
   */
  const handleMouseEnter = () => stopAutoplay();
  const handleMouseLeave = () => startAutoplay();

  // Attach event listeners to relevant elements.
  const attachEventListeners = () => {
    prevBtn.addEventListener("click", handlePrevBtnClick);
    nextBtn.addEventListener("click", handleNextBtnClick);

    if (enableAutoplay && autoplayInterval !== null) {
      carousel.addEventListener("mouseenter", handleMouseEnter);
      carousel.addEventListener("mouseleave", handleMouseLeave);
    }
  };

  // Initialize/create the carousel.
  const create = () => {
    tweakStructure();
    attachEventListeners();
    if (enableAutoplay && autoplayInterval !== null) {
      startAutoplay();
    }
  };

  // Destroy the carousel/clean-up.
  const destroy = () => {
    // Remove event listeners.
    prevBtn.removeEventListener("click", handlePrevBtnClick);
    nextBtn.removeEventListener("click", handleNextBtnClick);
    if (enablePagination) {
      const paginationBtns =
        paginationContainer.querySelectorAll(".carousel-btn");
      if (paginationBtns.length) {
        paginationBtns.forEach((btn) => {
          btn.removeEventListener("click", handlePaginationBtnClick);
        });
      }
    }

    // Clear autoplay intervals if autoplay is enabled.
    if (enableAutoplay && autoplayInterval !== null) {
      carousel.removeEventListener("mouseenter", handleMouseEnter);
      carousel.removeEventListener("mouseleave", handleMouseLeave);
      stopAutoplay();
    }
  };

  // Return an object with methods to create and destroy the carousel.
  return { create, destroy };
};

const carousel1 = JSCarousel({
  carouselSelector: "#carousel-1",
  slideSelector: ".slide",
});

carousel1.create();

window.addEventListener("beforeunload", () => {
  carousel1.destroy();
});

//////////// Modal ///////////

document.addEventListener(
  "click",
  function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement;

    if (
      target.hasAttribute("data-toggle") &&
      target.getAttribute("data-toggle") == "modal"
    ) {
      if (target.hasAttribute("data-target")) {
        var m_ID = target.getAttribute("data-target");
        document.getElementById(m_ID).classList.add("open");
        e.preventDefault();
      }
    }

    // Close modal window with 'data-dismiss' attribute or when the backdrop is clicked
    if (
      (target.hasAttribute("data-dismiss") &&
        target.getAttribute("data-dismiss") == "modal") ||
      target.classList.contains("modal")
    ) {
      var modal = document.querySelector('[class="modal open"]');
      modal.classList.remove("open");
      e.preventDefault();
    }
  },
  false
);

//////////////////// Mobile Nav /////////////////

// JavaScript

let openHam = document.querySelector("#openHam");
let closeHam = document.querySelector("#closeHam");
let navigationItems = document.querySelector("#navigation-items");

const hamburgerEvent = (navigation, close, open, noScroll) => {
  navigationItems.style.display = navigation;
  closeHam.style.display = close;
  openHam.style.display = open;
  document.body.classList.toggle("no-scroll", noScroll);
};

openHam.addEventListener("click", () => {
  hamburgerEvent("flex", "block", "none", true);
});

closeHam.addEventListener("click", () => {
  hamburgerEvent("none", "none", "block", false);
});

// Event listener for links click
document.querySelectorAll(".main-nav-link").forEach((link) => {
  link.addEventListener("click", function () {
    if (window.innerWidth < 991) {
      // Apply hamburgerEvent only for resolutions less than 991px (e.g., mobile)
      hamburgerEvent("none", "none", "block", false);
    }
  });
});

/////////// Scroll to top //////////

let mybutton = document.getElementById("myBtn");

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Language changer

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("languageModal");
  const btn = document.getElementById("changeLanguageBtn");
  const span = document.getElementsByClassName("close")[0];
  const saveBtn = document.getElementById("saveLanguageBtn");
  const langSelect = document.getElementById("langSelect");

  const elementsToTranslate = [
    { id: "text1", key: "text1" },
    { id: "text2", key: "text2" },
  ];

  // Open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  };

  // Close the modal when the 'x' is clicked
  span.onclick = function () {
    modal.style.display = "none";
  };

  // Close the modal when clicking outside of the modal
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // Change language when 'Save' button is clicked
  saveBtn.onclick = function () {
    const selectedLang = langSelect.value;
    modal.style.display = "none";
    setTimeout(() => {
      fetchContent(selectedLang).then(updateContent);
    }, 300); // Short delay after closing modal
  };

  // Function to fetch content based on language
  async function fetchContent(language) {
    try {
      const response = await fetch(`content.json`);
      const data = await response.json();
      return data[language];
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  }

  function updateContent(languageData) {
    // Update text content with typewriter effect
    typeWriterEffect(
      languageData.text1,
      document.getElementById("text1"),
      () => {
        setTimeout(() => {
          typeWriterEffect(
            languageData.text2,
            document.getElementById("text2"),
            null,
            70
          );
        }, 200);
      },
      70
    );

    // Update elements with data-translate attribute
    document.querySelectorAll("[data-translate]").forEach((element) => {
      const key = element.getAttribute("data-translate");

      if (languageData[key]) {
        if (
          element.tagName.toLowerCase() === "input" &&
          (element.type === "text" || element.type === "email")
        ) {
          element.setAttribute("placeholder", languageData[key]);
        } else {
          element.textContent = languageData[key];
        }
      }
    });
  }

  // Initial fetch for default language (English)
  setTimeout(() => {
    fetchContent("en").then(updateContent);
  }, 500); // Delay initial typing to ensure DOM is ready
});
