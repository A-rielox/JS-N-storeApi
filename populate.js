// para llenar la DB, a partir de una lista en fomato json
// se establece la otra conección a la DB desde este archivo, xq se va a correr este, desde node, "node populate.js"
require('dotenv').config();
const connectDB = require('./db/connect');
const Product = require('./models/product');
const jsonProducts = require('./products.json');

const start = async () => {
   try {
      await connectDB(process.env.MONGO_URI);
      await Product.deleteMany();
      await Product.create(jsonProducts);

      console.log('Successfull populate!!');
      process.exit(0);
   } catch (error) {
      console.log(error);
      process.exit(1);
   }
};
start();

// con Product.deleteMany() se borran todos los hay ( para empezar desde cero en caso de q haya algo )
// con Product.create(nombre archivo) se va llenar la DB con los items q tenga el archivo en formato json
//
// process.exit(0);
//  para q corte solo el proceso y no tener q mandarle ctrl + c en la consola
