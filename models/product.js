const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'product name must be provided'],
   },
   price: {
      type: Number,
      required: [true, 'product price must be provided'],
   },
   featured: {
      type: Boolean,
      default: false,
   },
   rating: {
      type: Number,
      default: 4.5,
   },
   createdAt: {
      type: Date,
      default: Date.now(),
   },
   company: {
      type: String,
      enum: {
         values: ['ikea', 'liddy', 'caressa', 'marcos'],
         message: '{VALUE} is not supported',
      },
      // enum: ['ikea', 'liddy', 'caressa', 'marcos'],
   },
});

module.exports = mongoose.model('Product', productSchema);

// enum, en company, es para q solo se pueda elejir entre esas

// en el mensaje de error, x si se intenta ingresar un valor q no corresponde a los q estan peemitido, a traves de {VALUE} se obtiene el q el usuario intentó ingresar
