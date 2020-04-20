// 云函数入口文件
const cloud = require('wx-server-sdk')
const CryptoJS=require('crypto-js')

var aseKey = "123#Abcd"     
var message = "hello world";



cloud.init()

// function toHex( buffer) {
//   var sb = []

//   for (var i = 0; i < buffer.length; i += 2) {
//     sb.append(buffer.substring(i, i + 2).toString(16));
//   }

//   return sb.toString();
// },

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let wordarry=CryptoJS.enc.Hex.parse(message)
  console.log(wordarry)
  let msgarray=''
  var len=message.length

  for(var i=0;i<message.length;i++){
    // console.log(message[i])
    // console.log(message.charCodeAt(i).toString(16))
    msgarray+=message.charCodeAt(i).toString(16)
  }
  var padlen = 8 - len % 8;
  var newlen = len + padlen;

  for (var i = len; i < newlen; ++i) {
    msgarray += '0'.charCodeAt(0).toString(16);
  }
  console.log(msgarray)

  //加密
  var encrypt = CryptoJS.DES.encrypt(CryptoJS.enc.Hex.parse(msgarray), CryptoJS.enc.Utf8.parse(aseKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.NoPadding
  })
  // CryptoJS.enc.Hex.encrypt.ciphertext.toString().
  console.log(encrypt.ciphertext.toString());

  // var keyHex = CryptoJS.enc.Utf8.parse(aseKey);
  // var decrypted = CryptoJS.DES.decrypt({
  //   ciphertext: CryptoJS.enc.Hex.parse('3d518daea941120d72fe3488f5d27a64')
  // }, keyHex, {
  //     mode: CryptoJS.mode.ECB,
  //     padding: CryptoJS.pad.NoPadding
  //   });

  // console.log(decrypted.toString(CryptoJS.enc.Utf8));




  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}