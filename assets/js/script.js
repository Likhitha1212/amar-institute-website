const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyj2HZfGQxeEQK29iN5zZ6afpOTD2D0QI8WiSTuFxUEnFbfeMh0U6ZIzgW8dlw8NJct/exec";
// ===============================
// STUDENT REVIEW SYSTEM
// ===============================

// ===============================
// GOOGLE APPS SCRIPT URL
// ===============================

// const GOOGLE_SCRIPT_URL = "PASTE_YOUR_ACTUAL_WEB_APP_URL_HERE";


// Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    // ===============================
    // REVIEW ELEMENTS
    // ===============================

    const reviewModal = document.getElementById("review-modal");
    const openReviewBtn = document.getElementById("open-review-btn");
    const closeReviewBtn = document.getElementById("close-review");
    const reviewForm = document.getElementById("review-form");
    const reviewMessage = document.getElementById("review-message");

    const stars = document.querySelectorAll("#star-rating span");
    const ratingInput = document.getElementById("review-rating");


    // Check that the review elements exist
    console.log("Review system loaded");

    console.log("Open button:", openReviewBtn);
    console.log("Review modal:", reviewModal);


    // ===============================
    // OPEN REVIEW POPUP
    // ===============================

    if (openReviewBtn && reviewModal) {

        openReviewBtn.addEventListener("click", function () {

            console.log("Write a Review clicked");

            reviewModal.classList.add("active");

        });

    }


    // ===============================
    // CLOSE REVIEW POPUP
    // ===============================

    if (closeReviewBtn && reviewModal) {

        closeReviewBtn.addEventListener("click", function () {

            reviewModal.classList.remove("active");

        });

    }


    // ===============================
    // CLOSE WHEN CLICKING OUTSIDE
    // ===============================

    if (reviewModal) {

        reviewModal.addEventListener("click", function (event) {

            if (event.target === reviewModal) {

                reviewModal.classList.remove("active");

            }

        });

    }


    // ===============================
    // STAR RATING
    // ===============================

    stars.forEach(function (star) {

        star.addEventListener("click", function () {

            const rating = Number(this.dataset.rating);

            ratingInput.value = rating;

            stars.forEach(function (item) {

                const itemRating = Number(item.dataset.rating);

                if (itemRating <= rating) {

                    item.classList.add("selected");

                } else {

                    item.classList.remove("selected");

                }

            });

        });

    });


    // ===============================
    // SUBMIT REVIEW
    // ===============================

    if (reviewForm) {

        reviewForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const name =
                document.getElementById("review-name").value.trim();

            const className =
                document.getElementById("review-class").value.trim();

            const rating =
                Number(document.getElementById("review-rating").value);

            const review =
                document.getElementById("review-text").value.trim();


            // Check rating

            if (rating === 0) {

                reviewMessage.textContent =
                    "Please select a star rating.";

                reviewMessage.className = "error";

                return;

            }


            const submitButton =
                document.getElementById("submit-review");


            submitButton.disabled = true;

            submitButton.textContent = "Submitting...";


            try {

                await fetch(GOOGLE_SCRIPT_URL, {

                    method: "POST",

                    mode: "no-cors",

                    headers: {
                        "Content-Type": "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({

                        name: name,

                        className: className,

                        rating: rating,

                        review: review

                    })

                });


                reviewMessage.textContent =
                    "Thank you for your review! Your review has been submitted successfully.";

                reviewMessage.className = "success";


                reviewForm.reset();

                ratingInput.value = 0;


                stars.forEach(function (star) {

                    star.classList.remove("selected");

                });


                submitButton.disabled = false;

                submitButton.textContent = "Submit Review";


            } catch (error) {

                console.error("Review submission error:", error);

                reviewMessage.textContent =
                    "Something went wrong. Please try again.";

                reviewMessage.className = "error";


                submitButton.disabled = false;

                submitButton.textContent = "Submit Review";

            }

        });

    }

});
// ===============================
// LOAD APPROVED REVIEWS
// ===============================

async function loadApprovedReviews() {

    const reviewsContainer =
        document.getElementById("reviews-container");

    if (!reviewsContainer) {
        return;
    }

    try {

        const response = await fetch(GOOGLE_SCRIPT_URL);

        const reviews = await response.json();

        // Remove the temporary/demo reviews
        reviewsContainer.innerHTML = "";

        // No approved reviews yet
        if (reviews.length === 0) {

            reviewsContainer.innerHTML = `
                <div class="no-reviews">
                    <p>Be the first to share your experience! ⭐</p>
                </div>
            `;

            return;
        }


        // Display approved reviews
        reviews.forEach(function (review) {

            const card = document.createElement("div");

            card.className = "review-card";


            // Create stars
            const stars = "★".repeat(review.rating);


            card.innerHTML = `
                <div class="review-stars">
                    ${stars}
                </div>

                <p class="review-text">
                    ${escapeHTML(review.review)}
                </p>

                <h4>
                    ${escapeHTML(review.name)}
                </h4>

                <span>
                    ${escapeHTML(review.className)}
                </span>
            `;


            reviewsContainer.appendChild(card);

        });

    } catch (error) {

        console.error(
            "Unable to load reviews:",
            error
        );

    }

}


// ===============================
// SECURITY
// Prevent HTML from being inserted
// through user reviews
// ===============================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// Load reviews when page opens
document.addEventListener(
    "DOMContentLoaded",
    loadApprovedReviews
);