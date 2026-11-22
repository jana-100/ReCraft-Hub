document.addEventListener("DOMContentLoaded", function () {

    // Get saved offerings
    const offerings = JSON.parse(
        localStorage.getItem("managerOfferings")
    ) || [];

    const offeringsList = document.querySelector(".offerings-list");

    // Display each new offering
    offerings.forEach(function (offering) {

        const offeringDiv = document.createElement("div");
        offeringDiv.className = "manager-offering";

        const offeringInfo = document.createElement("div");
        offeringInfo.className = "offering-info";

        const image = document.createElement("img");
        image.src = offering.image;
        image.alt = offering.name;
        image.className = "manager-offering-image";

        const name = document.createElement("span");
        name.textContent = offering.name;

        const category = document.createElement("span");
        category.textContent = offering.category;

        const price = document.createElement("span");
        price.textContent = Number(offering.price).toFixed(2) + " SAR";

        offeringInfo.appendChild(image);
        offeringInfo.appendChild(name);

        offeringDiv.appendChild(offeringInfo);
        offeringDiv.appendChild(category);
        offeringDiv.appendChild(price);

        offeringsList.appendChild(offeringDiv);

    });

});
