/**
 * Created by lixiaodong on 16/12/24.
 */
// 在线生成 生成RSA密钥对
// http://web.chacuo.net/netrsakeypair
const crypto = require('crypto');
const constants = require('constants');
const fs = require('fs');
console.log(__dirname);
const privateKey = fs.readFileSync(__dirname + '/private.key');
const publicKey = fs.readFileSync(__dirname + '/public.key');

let privateKeyObj = {
    key:     privateKey,
    padding: constants.RSA_PKCS1_PADDING,
};

let publicKeyObj = {
  key: publicKey,
  padding: constants.RSA_PKCS1_PADDING, 
}

// 字节分组 128
function byteSplit(buffer, number) {
    let bufferArray = [];

    for (let i = 0; i < buffer.length; i += number) {
        let temp = buffer.slice(i, i + number);

        bufferArray.push(temp);
    }

    return bufferArray;
}

function privateEncrypt(formData) {
    let buffer = new Buffer(JSON.stringify(formData));
    let bufferArray = [];
    let number = 117;

    for (let i = 0; i < buffer.length; i += number) {
        let temp = buffer.slice(i, i + number);

        bufferArray.push(crypto.privateEncrypt(privateKeyObj, temp));
    }

    return Buffer.concat(bufferArray).toString('base64');
}

function privateDecrypt(encrypted) {
    // base64 解码
    let decrypted = new Buffer(encrypted, 'base64');
    let bufferArray = byteSplit(decrypted, 128);
    let finalBuffer = [];
    let final = '';

    for (let i = 0; i < bufferArray.length; i++) {
      let decryptedFrag = crypto.privateDecrypt(privateKeyObj, bufferArray[i]);
      finalBuffer.push(decryptedFrag);
    }

    let decryptedStr = Buffer.concat(finalBuffer).toString();

    for (let j = 0; j < decryptedStr.length; j++) {
        if (decryptedStr.charCodeAt(j)) {
            final += decryptedStr[j];
        }
    }

    return JSON.parse(final);
}

function publicEncrypt(formData) {
  let buffer = new Buffer(JSON.stringify(formData));
  let bufferArray = [];
  let number = 117;

  for (let i = 0; i < buffer.length; i += number) {
      let temp = buffer.slice(i, i + number);

      bufferArray.push(crypto.publicEncrypt(publicKeyObj, temp));
  }

  return Buffer.concat(bufferArray).toString('base64');
}

function publicDecrypt(encrypted) {
  // base64 解码
  let decrypted = new Buffer(encrypted, 'base64');
  let bufferArray = byteSplit(decrypted, 128);
  let finalBuffer = [];
  let final = '';

  for (let i = 0; i < bufferArray.length; i++) {
    let decryptedFrag = crypto.publicDecrypt(publicKeyObj, bufferArray[i]);
    finalBuffer.push(decryptedFrag);
  }

  let decryptedStr = Buffer.concat(finalBuffer).toString();

  for (let j = 0; j < decryptedStr.length; j++) {
      if (decryptedStr.charCodeAt(j)) {
          final += decryptedStr[j];
      }
  }

  return JSON.parse(final);
}



module.exports = {
  privateEncrypt,
  privateDecrypt,
  publicEncrypt,
  publicDecrypt,
};