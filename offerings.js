
document.addEventListener("DOMContentLoaded", function () {

    const grid = document.querySelector(".offerings-grid");
    const sortSelect = document.getElementById("sort");

    // Get saved offerings
    const savedOfferings = JSON.parse(
        localStorage.getItem("managerOfferings")
    ) || [];

    // Create cards for new offerings
    savedOfferings.forEach(function (offering) {

        const card = document.createElement("article");
        card.className = "offering-card";
        card.dataset.price = offering.price;

        // Image container
        const imageContainer = document.createElement("div");
        imageContainer.className = "offering-image";

        const image = document.createElement("img");
        image.src = offering.image;
        image.alt = offering.name;

        // Extra information overlay
        const more = document.createElement("div");
        more.className = "offer-more";

        const priceDetails = document.createElement("p");
        const priceLabel = document.createElement("strong");
        priceLabel.textContent = "Price: ";
        priceDetails.appendChild(priceLabel);
        priceDetails.append(
            Number(offering.price).toFixed(2) + " SAR"
        );

        const durationDetails = document.createElement("p");
        const durationLabel = document.createElement("strong");
        durationLabel.textContent = "Duration: ";
        durationDetails.appendChild(durationLabel);
        durationDetails.append(
            offering.duration || "Not specified"
        );

        const whenDetails = document.createElement("p");
        const whenLabel = document.createElement("strong");
        whenLabel.textContent = "When: ";
        whenDetails.appendChild(whenLabel);
        whenDetails.append(
            offering.when || "Not specified"
        );

        more.appendChild(priceDetails);
        more.appendChild(durationDetails);
        more.appendChild(whenDetails);

        imageContainer.appendChild(image);
        imageContainer.appendChild(more);

        // Offering body
        const body = document.createElement("div");
        body.className = "offering-body";

        const title = document.createElement("h2");
        title.textContent = offering.name;

        const description = document.createElement("p");
        description.textContent = offering.description;

        // Bottom section
        const bottom = document.createElement("div");
        bottom.className = "offering-bottom";

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = "Price: ";

        const strong = document.createElement("strong");
        strong.textContent =
            Number(offering.price).toFixed(2) + " SAR";

        price.appendChild(strong);

        const link = document.createElement("a");
        link.href = "#";
        link.className = "btn";
        link.textContent = "Request to Join";

        bottom.appendChild(price);
        bottom.appendChild(link);

        body.appendChild(title);
        body.appendChild(description);
        body.appendChild(bottom);

        card.appendChild(imageContainer);
        card.appendChild(body);

        grid.appendChild(card);

    });

    // Get all offering cards
    const cards = Array.from(
        grid.querySelectorAll(".offering-card")
    );

    // Randomize cards initially
    function shuffleCards() {

        const shuffled = [...cards];

        for (let i = shuffled.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [shuffled[i], shuffled[j]] =
                [shuffled[j], shuffled[i]];

        }

        shuffled.forEach(function (card) {
            grid.appendChild(card);
        });

    }

    // Sort offerings
    function sortCards() {

        const selectedValue = sortSelect.value;

        let sorted = [...cards];

        if (selectedValue === "price-low") {

            sorted.sort((a, b) =>
                Number(a.dataset.price) - Number(b.dataset.price)
            );

        } else if (selectedValue === "price-high") {

            sorted.sort((a, b) =>
                Number(b.dataset.price) - Number(a.dataset.price)
            );

        } else if (selectedValue === "name-az") {

            sorted.sort((a, b) =>
                a.querySelector("h2").textContent.localeCompare(
                    b.querySelector("h2").textContent
                )
            );

        } else if (selectedValue === "name-za") {

            sorted.sort((a, b) =>
                b.querySelector("h2").textContent.localeCompare(
                    a.querySelector("h2").textContent
                )
            );

        }

        sorted.forEach(function (card) {
            grid.appendChild(card);
        });

    }

    // Initial random order
    shuffleCards();

    // Listen for sorting changes
    sortSelect.addEventListener("change", sortCards);

});
