// This program allows for data to be loaded from and stored to a JSON file

// Loads data from a JSON file
function loadData() {
  try {
    if (fs.existsSync('./data.json')) {
      const jsonData = fs.readFileSync('./data.json', 'utf-8');
      return JSON.parse(jsonData);
    }
  } catch (error) {
    throw new Error('Failed to load data:');
  }

  // If no data exists, create 
  return {
    user: [],
    idHistory: {
        userIdTracker: 0
    }
  }
}

data = loadData()

// Retrives data 
function getData() {
    return data;
}

// Stores data into a JSON file
function storeData(newData) {
  try {
    const jsonData = JSON.stringify(newData, null, 2);
    fs.writeFileSync('./data.json', jsonData);
  } catch (error) {
    throw new Error('Could not save data');
  }

  return {};
}

export { getData, loadData, storeData }
