const fs = require("fs");
const csv = require("csv");
const convert = require("heic-convert");
const { promisify } = require("util");


const itemTypes = [
    {
        id: 'маленькая',
        cell: 2250
    },
    {
        id: 'средняя',
        cell: 2350
    },
    {
        id: 'фигурная',
        cell: 2350
    },
    {
        id: 'большая',
        cell: 2500
    },
    {
        id: 'пивная',
        cell: 2500
    },
    {
        id: 'прочее',
        cell: 'kek'
    }
]


const result = [{
    'SKU': 'SKU',
    'Category': 'Category',
    'Title': 'Title',
    'Description': 'Description',
    'Text': 'Text',
    'Photo': 'Photo',
    'Price': 'Price',
    'Quantity': 'Quantity',
    'Price Old': 'Price Old',
    'Editions': 'Editions',
    'Modifications': 'Modifications',
    'External ID': 'External ID',
    'Parent UID': 'Parent UID',
}]
const endpoint = "output";
const Description = 'Керамическая кружка ручной работы!';
const Text = 'Вся проходят двойную обработку и подходят для мойки в посудомоечной машине и разогревания в микроволновой печи!'

const dirs = fs.readdirSync(`${endpoint}`);

function convert2csv() {
    for (let dir of dirs) {
        const images = fs.readdirSync(`${endpoint}/${dir}`);

        for (let image of images) {
            // if (image.match(".heic$")) continue;
            // const path = `${endpoint}/${dir}/${image}`;
            // const buffer = fs.readFileSync(path);

            // console.log("ready " + path);

            // const jpg = await convert({
            //     buffer
            
            //     format: "JPEG",
            //     quality: 1,
            // });

            // fs.writeFileSync(`${outputPrefix}${path}.jpeg`, jpg);
            // delete buffer;
            // console.log("write " + path);

            const Category = itemTypes.filter(t => t.cell == dir)[0].id;

            result.push({
                SKU: `${Category}-${image}`.replace('.JPG.png.jpeg', ''),
                Title: `${Category}-${image}`.replace('.JPG.png.jpeg', ''),
                'External ID': image,
                Category,
                Description,
                Text,
                Photo: encodeURI(
                    `https://ikondor.github.io/mawave/output/${dir}/${image}`
                ),
                Price: +dir,
                'Price Old': +dir + 150
            });
        }
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
        const Category = dir.split(" ")[0];

        const images = fs.readdirSync(`${endpoint}/${dir}`);

        if (!fs.existsSync(`${outputPrefix}${endpoint}/${dir}`)) {
            fs.mkdirSync(`${outputPrefix}${endpoint}/${dir}`);
        }

        for (let image of images) {
            if (!image.match(".heic$")) continue;
            const path = `${endpoint}/${dir}/${image}`;
            const buffer = fs.readFileSync(path);

            console.log("ready " + path);

            const jpg = await convert({
                buffer,
                format: "JPEG",
                quality: 1,
            });

            fs.writeFileSync(`${outputPrefix}${path}.jpeg`, jpg);
            delete buffer;
            console.log("write " + path);
        }
    }
}