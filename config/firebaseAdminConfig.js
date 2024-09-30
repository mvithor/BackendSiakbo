const admin = require('firebase-admin');
const serviceAccount = require('./bimbingan-konseling-37a2c-firebase-adminsdk-xui1f-0d796a43ea.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://bimbingan-konseling-37a2c.appspot.com'
});

const bucket = admin.storage().bucket();

module.exports = { bucket };

