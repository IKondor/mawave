#!/usr/bin/env node
const fs = require('fs');
const csv = require('csv');
const convert = require('heic-convert');

const data = { inputPath: process.argv[2], outputPath: process.argv[3] };
console.log(`I have this args:`, data);

// Для конвертации одной папки
async function convertHeicToJpeg({ inputPath, outputPath }) {
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }
  const images = fs.readdirSync(`${inputPath}/`);
  console.log('I can see this images:', images);

  for (let image of images) {
    if (!['heic', 'HEIC'].some((format) => image.match(`.${format}$`))) continue;
    let rawImageName = image.split('.');
    rawImageName.pop();
    rawImageName.join('.');

    const buffer = fs.readFileSync(`${inputPath}/${image}`);

    console.log(`start convert ${rawImageName}`);

    const jpg = await convert({
      buffer,
      format: 'JPEG',
      quality: 1,
    });

    fs.writeFileSync(`${outputPath}/${rawImageName}.jpeg`, jpg);
    delete buffer;
    console.log(`finish convert ${rawImageName}`);
  }
}

convertHeicToJpeg(data);
