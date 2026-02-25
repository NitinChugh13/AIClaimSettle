const https = require('https');
const fs = require('fs');

const url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Damaged_car_in_Sydney.jpg/800px-Damaged_car_in_Sydney.jpg';
const file = fs.createWriteStream("test-car-damage.jpg");

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
  response.pipe(file);
  file.on("finish", () => {
    file.close();
    console.log("Download Completed. Size:", fs.statSync("test-car-damage.jpg").size);
  });
});
