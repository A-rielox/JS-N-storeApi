const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
   const products = await Product.find({}); //para q devuelva todos
   // const products = await Product.find({ featured: true }); // devuelve los q tengan "featured: true"
   res.status(200).json({ nbHits: products.length, products });
}; // 🌀 el find({})

const getAllProducts = async (req, res) => {
   // console.log(req.query); {name:'albany',featured:'true'} ó {featured:'true'}
   // 🔰
   const { featured, company, name, sort } = req.query;
   const queryObject = {};

   if (featured) {
      queryObject.featured = featured === 'true' ? true : false;
   }
   if (company) {
      queryObject.company = company;
   }
   if (name) {
      queryObject.name = { $regex: name, $options: 'i' }; // 🧐💫
   }

   console.log(queryObject);
   // const products = await Product.find(queryObject);💥💥
   let result = Product.find(queryObject);

   if (sort) {
      const sortList = sort.split(',').join(' ');
      result = result.sort(sortList);
   } else {
      // si no se especifica un sort => pone x default x orden de creación
      result = result.sort('createdAt');
   }

   const products = await result;

   res.status(200).json({ nbHits: products.length, products });
};

module.exports = { getAllProductsStatic, getAllProducts };

// si mandamos en el query una propiedad q no existe, como buscar por { page: 2 }, q seria pasar .../products/?page=2
// => me devueve un []
// en la version nueva de mongoose, si se manda una prop q no existe en el schema => esta es ignorada
// 🔰 para pasar en el método q busca (Product.find) solo las propiedades q SI existen en nuestro schema ( y evitar q x ese error nos devuelva [] ) destructuramos el req.query, y entre las llaves ( {} ) solo ponemos las props q si existen ( más las q vamos a controlar como sort y esos ) y esas las pasamos al objeto q metemos en la busqueda en la DB

// 🌀
// como el modelo se define con "module.exports = mongoose.model('Product', productSchema)" => va a buscar a todos los items en "products" ( todos xq está vacio el find({}))

// "express-async-errors"
// para no tener q hacer al "asyncWrapper" para envolver a las funciones de los controladores ( q me evitava ponerle a todas con try-catch )
// se importa aquí en app.js
//
// con este package, si salta un error en algun controlador => se va a poder acceder al error en el "custom errorhandler" q está en /middleware/error-handler.js
// ( serian los errores q tira mongoose )

// 🧐💫 del manual de mongoDB
// $regex
// Provides regular expression capabilities for pattern matching strings in queries. MongoDB uses Perl compatible regular expressions (i.e. "PCRE" ) version 8.42 with UTF-8 support.

// To use $regex, use one of the following syntaxes:

// { <field>: { $regex: /pattern/, $options: '<options>' } }
// { <field>: { $regex: 'pattern', $options: '<options>' } }
// { <field>: { $regex: /pattern/<options> } }

// In MongoDB, you can also use regular expression objects (i.e. /pattern/) to specify regular expressions:

// { <field>: /pattern/<options> }

// 💥💥 ( video 142 Sort - getAllProducts Implementation )
// para los q se encadenan se tubo q cambiar del simple:
//        const products = await Product.find(queryObject)
// a
//        let result = Product.find(queryObject);
//
//        if (sort) {
//           const sortList = sort.split(',').join(' ');
//           result = result.sort(sortList);
//        } else { PARA ESTA EXPLICACION NO IMPORTA EL ELSE
//           // si no se especifica un sort => pone x default x orden de creación
//           result = result.sort('createdAt');
//        }

//        const products = await result;

// el Product.find() entrega un query-object, en el original se espera a q se resuelva y se mete en products ( pero ya es solo una lista, xq el await hace q se esepere hasta q se resuelva en una lista para asignarlo a products )
// el .sort() se tiene q poner en el query-object, x esto no se puede poner en el products así no más, xq es una lista.
// si no hay "sort" de la destructuración => no se le puede poner el .sort() vacio
// x estas 2 cosas es q hay q hacer el show de pasar por el "result" primero, que va a tener el "query-object" q entrega el find, ya q no se ocupo "await" y si es q existe el "sort" => se le pone a este "result" q si es un "query-object", y ya abajo en la última linea se espera a q se resuelva el "query-object" en la lista para así asignarselo a products
//
// ==> se crea el intermediario sin "await" para mantener el "query-object" y poder encadenarle el .sort() y posteriormente los demas encadenables.

//
//
// de https://thecodebarbarian.com/how-find-works-in-mongoose.html
// The Model.find() function returns an instance of Mongoose's Query class. The Query class represents a raw CRUD operation that you may send to MongoDB. It provides a chainable interface for building up more sophisticated queries. You don't instantiate a Query directly, Customer.find() instantiates one for you.
//
// const query = Customer.find();
// query instanceof mongoose.Query; // true
// const docs = await query; // Get the documents
//
// So Model.find() returns an instance of the Query class. You can chain find() calls to add additional query operators, also known as filters, to the query.
//

// Model.find() returns a query instance, so why can you do await Model.find()? That's because a Mongoose query is a thenable, meaning they have a then() function. That means you can use queries in the same way you use promises, including with promise chaining as shown below.
