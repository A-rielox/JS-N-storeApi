const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
   const products = await Product.find({});
   res.status(200).json({ products });
}; // 🌀 el find({})

const getAllProducts = async (req, res) => {
   res.status(200).json({ msg: 'products route' });
};

module.exports = { getAllProductsStatic, getAllProducts };

// 🌀
// como el modelo se define con "module.exports = mongoose.model('Product', productSchema);" => va a buscar a todos los items en "products" ( todos xq está vacio el find({}))

// "express-async-errors"
// para no tener q hacer al "asyncWrapper" para envolver a las funciones de los controladores ( q me evitava ponerle a todas con try-catch )
// se importa aquí en app.js

// con este package, si salta un error en algun controlador => se va a poder acceder al error en el "custom errorhandler" q está en /middleware/error-handler.js
// ( serian los errores q tira mongoose )
