"use strict"

const Airtable = require('airtable');
// Read-only key
const apiKey = "keyMmAL4mVBSORkGc";
// Experimental table
// const base = new Airtable({apiKey: apiKey}).base('appLwxkByQzFlBeVo');
// Production table
const base = new Airtable({apiKey: apiKey}).base('appj3UWymNh6FgtGR');

async function dalGetPlaceTable() {
  const placeTableRaw = await dalGetTable('Help Services', base);
  placeTableRaw.sort(function(a, b){
    if(a.get('Name') < b.get('Name')) { return -1; }
    if(a.get('Name') > b.get('Name')) { return 1; }
    return 0;
  });
  let placeTable = placeTableRaw.map(function(record) {
    return {
      'id' : record.id,
      'name' : record.get('Name'),
      'nameSpanish' : record.get('Name-ES'),
      'city' : record.get('City'),
      'category' : record.get('Category'),
      'subcategory' : record.get('Subcategory'),
      'phone' : record.get('Phone'),
      'address' : record.get('Physical Address'),
      'latitude' : record.get('Latitude'),
      'longitude' : record.get('Longitude'),
      'url' : record.get('Web Address'),
      'email' : record.get('Email Address'),
      'hours' : record.get('Hours of Operation'),
      'description' : record.get('Description')
    };
  });
  return placeTable;
}

async function dalGetCategoryTable() {
  const categoryTableRaw = await dalGetTable('Categories', base);
  categoryTableRaw.sort((a, b) => (a.get('Order') - b.get('Order')));
  let categoryTable = categoryTableRaw.map(function(record) {
    let subcategories = record.get('Subcategories');
    if (!subcategories) {
      subcategories = [];
    }
    return {
      'id' : record.id,
      'name' : record.get('Name'),
      'nameSpanish' : record.get('Name-ES'),
      'subcategories' : subcategories,
      'order' : record.get('Order')
    };
  });
  return categoryTable;
}

async function dalGetSubcategoryTable() {
  const subcategoryTableRaw = await dalGetTable('Subcategories', base);
  let subcategoryTable = subcategoryTableRaw.map(function(record) {
    return {
      'id' : record.id,
      'name' : record.get('Name'),
      'nameSpanish' : record.get('Name-ES'),
      'order' : record.get('Order')
    };
  });
  return subcategoryTable;
}

async function dalGetCatSubcatTable() {
  const catSubcatTableRaw = await dalGetTable('CatSubcats', base);
  let catSubcatTable = catSubcatTableRaw.map(function(record) {
    let catSubcatName = record.get('Name');
    let catSubcatId = record.id;

    // !!!NOTE misspelling. Correct in table?
    // let categoryId = record.get('Catagory');
    let categoryId = record.get('Category');
    if (categoryId) {
      categoryId = categoryId[0];
    } else  {
      console.log('Subcategory', subcategory, 'has no category.', "THIS SHOULDN'T OCCUR");
    }

    let subcategoryId = record.get('Subcategory');
    let subcategoryName;
    let subcategoryNameSpanish;
    if (subcategoryId) {
      subcategoryId = subcategoryId[0];
      subcategoryName = record.get('SubcategoryString');
      subcategoryNameSpanish = record.get('Subcategory-ES')[0];
    } else {
      subcategoryName = 'No subcategories';
      subcategoryNameSpanish = 'No hay subcategorias';
    }
    return {
      'catSubcatId': catSubcatId,
      'catSubcatName': catSubcatName,
      'categoryId' : categoryId,
      'subcategoryId' : subcategoryId,
      'name' : subcategoryName,
      'nameSpanish' : subcategoryNameSpanish,
      'order' : record.get('Order'),
      'places' : []
    };
  });
  return catSubcatTable;
}

async function dalGetCityTable() {
  const cityTableRaw = await dalGetTable('Cities', base);
  let cityTable = cityTableRaw.map(function(record) {
    return {
      'id' : record.id,
      'name' : record.get('Name'),
    };
  });
  return cityTable;
}

function dalGetTable(tablename) {
  return new Promise(function (resolve) {
    let recordsBuffer = [];
		base(tablename).select({
			// maxRecords: 3,
			maxRecords: 1000,
			view: "Grid view"
		}).eachPage(function page(records, fetchNextPage) {
			// This function (`page`) will get called for each page of records.
			records.forEach(function(record) {
				recordsBuffer.push(record);
			});
			// To fetch the next page of records, call `fetchNextPage`.
			// If there are more records, `page` will get called again.
			// If there are no more records, `done` will get called.
			fetchNextPage();
    }, function done(err) {
			if (err) { console.error(err); return; }
			resolve(recordsBuffer);
		})
  })
}
