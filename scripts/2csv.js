const fs = require('fs');
const csv = require('csv');
const convert = require('heic-convert');
const { promisify } = require('util');
const { v4: get_uuid } = require('uuid');

const result = [
  {
    SKU: 'SKU',
    Category: 'Category',
    Title: 'Title',
    Description: 'Description',
    Text: 'Text',
    Photo: 'Photo',
    Price: 'Price',
    Quantity: 'Quantity',
    'Price Old': 'Price Old',
    Editions: 'Editions',
    Modifications: 'Modifications',
    'External ID': 'External ID',
    'Parent UID': 'Parent UID',
    'SEO keywords': 'SEO keywords',
  },
];
const endpoint = 'archive/29.10.24';
const Description = '';
const Text = '';
const SEO = 'Купить кружку, Купить посуду, заказать кружку, закзать посуду, купить кружку ручной работы';

const dirs = fs.readdirSync(`${endpoint}`);
const dir = 'archive/29.10.24';

const imagesToJoin = [];

async function convert2csv() {
  const images = fs.readdirSync(dir);

  for (let image of images) {
    const tags = image
      .replaceAll('.HEIC', '')
      .split(',')
      .map((tag) => {
        const result = tag.replaceAll('"', '').replace(/^\s*/i, '').replace(/\s*$/i, '');

        if (!result.length) {
          return 'Без коллекции';
        }

        return result;
      });

    const Title = tags[0];
    const Price = tags[1];
    const Category = tags.slice(2, tags.length).join(';');
    const id = get_uuid();
    const newFileName = `${Title}_${id}`;

    const path = `${dir}/${image}`;
    const buffer = fs.readFileSync(path);
    console.log('ready ' + newFileName);
    const jpg = await convert({
      buffer,
      format: 'JPEG',
      quality: 1,
    });
    fs.writeFileSync(`output/${newFileName}.jpeg`, jpg);
    delete buffer;
    console.log('write ' + newFileName);

    result.push({
      SKU: id,
      Title,
      'External ID': id,
      Category,
      Description,
      Text,
      Photo: encodeURI(`https://ikondor.github.io/mawave/output/${newFileName}.jpeg`),
      Price,
      'SEO keywords': SEO,
    });
  }

  // SKU;Category;Title;Description;Text;Photo;Price;Quantity;Price Old;Editions;Modifications;External ID;Parent UID

  csv.stringify(result).pipe(fs.createWriteStream(`${__dirname}/output.csv`));
}

convert2csv();

async function convertHeic() {
  if (!fs.existsSync(`${outputPrefix}${endpoint}`)) {
    fs.mkdirSync(`${outputPrefix}${endpoint}`);
  }

  for (let dir of dirs) {
    const Category = dir.split(' ')[0];

    const images = fs.readdirSync(`${endpoint}/${dir}`);

    if (!fs.existsSync(`${outputPrefix}${endpoint}/${dir}`)) {
      fs.mkdirSync(`${outputPrefix}${endpoint}/${dir}`);
    }

    for (let image of images) {
      if (!image.match('.heic$')) continue;
      const path = `${endpoint}/${dir}/${image}`;
      const buffer = fs.readFileSync(path);

      console.log('ready ' + path);

      const jpg = await convert({
        buffer,
        format: 'JPEG',
        quality: 1,
      });

      fs.writeFileSync(`${outputPrefix}${path}.jpeg`, jpg);
      delete buffer;
      console.log('write ' + path);
    }
  }
}
