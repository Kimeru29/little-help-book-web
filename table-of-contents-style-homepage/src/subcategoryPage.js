const cityboxId = "citySelect";
const catboxId = "catSelect";
const subcatboxId = "subcatSelect";
let nbc = new NavBreadcrumb(mockCities, mockCategories, mockSubcats, mockPlaces);

/*
Assign a unique ID to the select elements, so I can find them later.
We could hard code these into the DOM, but this ensures that I'll always
have these elements regardless of future changes to the DOM. Just don't
delete the select box class associations, and I can find them.
*/
document.getElementsByClassName("city")[0].setAttribute("id", cityboxId);
document.getElementsByClassName("category")[0].setAttribute("id", catboxId);
document.getElementsByClassName("subcategory")[0].setAttribute("id", subcatboxId);

/*
Generate and place option element HTML to place into each appropriate
select box, based on the data that was passed into our NavBreadcrumb object.
*/
nbc.placeOptionElements(cityboxId, nbc.generateOptionElements(nbc.cities));
nbc.placeOptionElements(catboxId, nbc.generateOptionElements(nbc.categories));
nbc.placeOptionElements(subcatboxId, nbc.generateOptionElements(nbc.subcats));

// functions used to generate the service tiles using the data.
// These functions were moved from generateServiceTile.js
function generateServiceTiles(objArray) {
    let objString = "";
    for (let i = 0; i < objArray.length; i++) {
        objString += generateServiceTile(objArray[i]);
    }
    return objString;
}
function generateServiceTile(obj) {
    let urlTemplate = (obj["url"] != null) ? `<a target="_blank" href="${obj["url"]}">${obj["url"]}</a>` : "No website provided";
    return `<div class="tile" id=${obj["id"]}>
                <div class="provider-name">${obj["name"]}</div>
                <div class="provider-address">${ (obj["address"] != null) ? obj["address"] : "No address provided" }</div>
                <div class="provider-phone">${ (obj["phone"] != null) ? obj["phone"] : "No phone number provided" }</div>
                <div class="provider-website">${urlTemplate}</div>
                <div class="provider-description">${ (obj["description"] != null) ? obj["description"] : "No description provided" }</div>
                <div class="last-line">
                    <div class="provider-hours">Hours:  ${ (obj["hours"] != null) ? obj["hours"] : "Not provided" }</div>
                    <div class="legend-icons"><i class="ri-earth-fill"></i><i class="ri-wheelchair-fill"></i></div>
                </div>
            </div>`
}
function placeServiceTiles(elementId, objString) {
    document.getElementById(elementId).innerHTML = objString;
}

// Create the appropriate event handlers for the select elements.
function citySelectEvent() {
    console.log(this.value);
    // find the city by id, and set the focused city to it.
    nbc.focused.city = nbc.cities.find(x => x.id === this.value).id;
    /*
    This function chain checks for a selected city, category and subcategory.
    It then will filter the list of places on the selected items.
    */
    nbc.availablePlaces = nbc.filterOnSubcat(nbc.filterOnCategory(nbc.filterOnCity(nbc.places)));
    if (nbc.selectsAreChecked) {
        placeServiceTiles("provider-tiles", generateServiceTiles(nbc.availablePlaces));
    }
    if (nbc.mymap != null) {
        setView(nbc.viewCoordinates, 5);
    }
}
function categorySelectEvent() {
    // find the category by id, and set the focused category to it.
    nbc.focused.category = nbc.categories.find(x => x.id === this.value).id;
    /*
    This function chain checks for a selected city, category and subcategory.
    It then will filter the list of places on the selected items.
    */
    nbc.availableSubcats = nbc.filterSubcatOptions(nbc.subcats);
    nbc.placeOptionElements(subcatboxId, nbc.generateOptionElements(nbc.availableSubcats));
    nbc.availablePlaces = nbc.filterOnSubcat(nbc.filterOnCategory(nbc.filterOnCity(nbc.places)));
    if (nbc.selectsAreChecked) {
        placeServiceTiles("provider-tiles", generateServiceTiles(nbc.availablePlaces));
    }
    if (nbc.mymap != null) {
        setMarkers(nbc.availablePlaces);
    }
}
function subcatSelectEvent() {
    //find the subcategory by id, and set the focused subcatgory to it.
    nbc.focused.subcat = nbc.subcats.find(x => x.id === this.value).id;
    /*
    This function chain checks for a selected city, category and subcategory.
    It then will filter the list of places on the selected items.
    */
    nbc.availablePlaces = nbc.filterOnSubcat(nbc.filterOnCategory(nbc.filterOnCity(nbc.places)));
    if (nbc.selectsAreChecked) {
        placeServiceTiles("provider-tiles", generateServiceTiles(nbc.availablePlaces));
    }
    if (nbc.mymap != null) {
        setMarkers(nbc.availablePlaces);
    }
}

// Assign the appropriate events handlers to the select elements
nbc.assignCitySelectEvent(cityboxId, citySelectEvent);
nbc.assignCategorySelectEvent(catboxId, categorySelectEvent);
nbc.assignSubcatSelectEvent(subcatboxId, subcatSelectEvent);