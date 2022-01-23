const errorHandlerMiddleware = async (err, req, res, next) => {
   console.log(err);

   return res
      .status(500)
      .json({ msg: 'Something went wrong, please try again' });
};

module.exports = errorHandlerMiddleware;

// "express-async-errors"
// para no tener q hacer al "asyncWrapper" para envolver a las funciones de los controladores ( q me evitava ponerle a todas con try-catch )
// se importa aquí en app.js

// con este package, si salta un error en algun controlador => se va a poder acceder al error en el "custom errorhandler" q está en /middleware/error-handler.js
// ( serian los errores q tira mongoose )
