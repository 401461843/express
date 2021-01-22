// var crypto = require( 'crypto' );
 

// module.exports ={
// 	encryption_tx_sign: function (data, key, iv) {
//             if (!data) {
//                 return "";
//             }
//             iv = iv || "";
//             var clearEncoding = 'utf8';
//             var cipherEncoding = 'base64';
//             var cipherChunks = [];
//             var decipher = crypto.createDecipheriv('AES-192-CBC', key, iv);
//             decipher.setAutoPadding(true);
//             cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
//             cipherChunks.push(decipher.final(clearEncoding));
//             return cipherChunks.join('');
//         }
// };
 