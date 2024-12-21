#!/usr/bin/env node

const fs = require('fs');
const csv = require('csv');
const convert = require('heic-convert');
const { v4: get_uuid } = require('uuid');

const data = { inputPath: process.argv[2], outputPath: process.argv[3] };
console.log(`I have this args:`, data);

// Для конвертации одной папки
async function convert2csv({ inputPath, outputPath }) {
  const Description =
    'Облегченная кружка из керамики ручной работы, которая не прихотлива в своём уходе и использование - можно мыть в посудомоечной машине и разогревать в СВЧ печи.<br />Каждое изделие имеет свой уникальный вид и наполняет эмоциями каждый день!';
  const Text = '';
  const SEO = 'Купить кружку, Купить посуду, заказать кружку, закзать посуду, купить кружку ручной работы';
  const Brand = 'Mawave Home';
  const Editions = `product_options:[{""title"":""Объем"",""params"":{""view"":""select"",""hasColor"":false,""linkImage"":false}},{""title"":""Цвет"",""params"":{""view"":""select"",""hasColor"":true,""linkImage"":false}}]`;

  const result = [
    {
      SKU: 'SKU',
      Category: 'Category',
      Title: 'Title',
      Description: 'Description',
      Brand: 'Brand',
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

  const colorDict = {
    'Серая черепаха': '#192b35',
    Скай: '#8b93a5',
    'Топлёное молоко': '#cdb684',
    Охра: '#ccc6a4',
    'Коричнева черепаха': '#6d523d',
    'Голубое небо': '#a1b6bd',
    Джипси: '#1e2c8c',
    'Черный брутальный': '#37372c',
    'Белый прозрачный': '#ffffff',
    Красный: '#f50008',
    'Розовый кварц': '#b8aaa7',
    'Розовый пломбир': '#e6bab1',
    'Бежевый кварц': '#c9cfcf',
    'Зелёная ива': '#acc9cd',
    Ржавый: '#574e13',
    Серый: '#48494b',
    'Малиновый закат': '#993132',
  };

  const categoryDict = {
    '18+': 'Кружки и посуда 18+',
    n: 'Кружки ручной работы',
    sale: 'Специальные предложения',
    зодиак: 'Знаки зодиака',
  };

  const images = fs.readdirSync(inputPath);

  for (let image of images) {
    const tags = image.split(',').map((tag) => tag.trim());

    console.log({ tags });
    const Title = tags[0];
    const Price = tags[1];
    const Category = tags[2]
      .split(' ')
      .map((c) => categoryDict[c])
      .join(';');
    const type = tags[3] || 'Фундук';
    const color = tags[4] || 'Голубое небо';
    const id = get_uuid();
    const newFileName = `${id}`;

    // Нужно только при генерации id для картинок
    const jpg = fs.readFileSync(`${inputPath}/${image}`);
    fs.writeFileSync(`data/output/${newFileName}.jpeg`, jpg);

    const item = {
      SKU: id,
      'External ID': id,
      Category,
      Text,
      Photo: encodeURI(`https://ikondor.github.io/mawave/data/output/${newFileName}.jpeg`),
      Brand,
      Quantity: 1,
      Price,
      'SEO keywords': SEO,
    };

    result.push({
      ...item,
      Title,
      Description,
      Editions,
    });
    result.push({
      ...item,
      Title: `${Title} - ${type} - ${color}`,
      Editions: `Объем:${type};Цвет:${color} ${colorDict[color]}`,
    });
  }

  // SKU;Category;Title;Description;Text;Photo;Price;Quantity;Price Old;Editions;Modifications;External ID;Parent UID

  const fileName = new Date().toJSON().split('T')[0];
  csv.stringify(result).pipe(fs.createWriteStream(`${outputPath}/output ${fileName}.csv`));
}

convert2csv(data);
