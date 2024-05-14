"use strict";

const axios = require("axios");
const line = require("@line/bot-sdk");
var request = require("request");

const config = {
  channelSecret: process.env.channelSecretLINE,
  channelAccessToken: process.env.channelAccessTokenLINE,
};

const client = new line.Client(config);
const sunabarToken = process.env.sunabarToken;

// 環境変数の定義
const apiUrl = process.env.API_URL;
const accept = 'application/json;charset=UTF-8';
const contentType = 'application/json;charset=UTF-8';
const accessToken = process.env.ACCESS_TOKEN;
const apiUrlOpt = process.env.API_URL_OPT;

exports.handler = (event) => {

  console.log("イベントの値：", event);
  const replyToken = JSON.parse(event.body).events[0].replyToken;

  // reqMessage = ユーザーが送信したメッセージの内容
  let reqMessage = JSON.parse(event.body).events[0].message.text;
  let resMessage = "";

  // ---------- おはよう を送ったとき ----------
  if (reqMessage == "おはよう") {
    
    resMessage = [
      {
        "type": "text",
        "text": "おはようございます $",
        "emojis": [
          {
            "index": 10,
            "productId": "5ac2197b040ab15980c9b43d",
            "emojiId": "014"
          }
        ]
      },
      {
        "type": "sticker",
        "packageId": "11539",
        "stickerId": "52114110"
      }
    ]

    console.log("LINEに応答")
    
    return client.replyMessage(replyToken, resMessage);
  }
  
  // ---------- 親口座の残高 ----------
  else if (reqMessage == "残高") {
    var request = require('request');
    var options = {
      'method': 'GET',
      'url': apiUrl,
      'headers': {
        'Accept': accept,
        'Content-Type': contentType,
        'x-access-token': accessToken
      }
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
      
      var preBalance = Number(JSON.parse(response.body).balances[0].balance);
      var balance = preBalance.toLocaleString();
      
      // UTC時間にオフセットを追加して日本時間に変換
      const JAPAN_OFFSET = 9 * 60 * 60 * 1000;
      var now = new Date();
      var japanTime = new Date(now.getTime() + JAPAN_OFFSET);
    
      // 日本時間を 'yyyy.mm.dd hh:mm (JST)' の形式にフォーマットする
      var formattedDate = japanTime.getFullYear() + '.' + 
                          ('0' + (japanTime.getMonth() + 1)).slice(-2) + '.' + 
                          ('0' + japanTime.getDate()).slice(-2) + ' ' + 
                          ('0' + japanTime.getHours()).slice(-2) + ':' + 
                          ('0' + japanTime.getMinutes()).slice(-2);

      resMessage = {
        "type": "flex",
        "altText": "Account balance information",
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "口座残高",
                "weight": "bold",
                "color": "#1DB446",
                "size": "md"
              },
              {
                "type": "text",
                "text": `${balance}円`,
                "weight": "bold",
                "size": "xl",
                "color": "#000000",
                "margin": "md"
              },
              {
                "type": "separator",
                "margin": "xxl"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "xxl",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "text",
                        "text": "照会日時",
                        "size": "sm",
                        "color": "#555555"
                      },
                      {
                        "type": "text",
                        "text": formattedDate,
                        "size": "sm",
                        "color": "#111111",
                        "align": "end"
                      }
                    ]
                  }
                ]
              }
            ],
            "backgroundColor": "#FFFFFF",
            "paddingAll": "12px"
          },
          "styles": {
            "footer": {
              "separator": true
            }
          }
        }
      };
      return client.replyMessage(replyToken, resMessage);
    });
  }
  
  // ---------- 食費 残高 ----------
  else if (reqMessage == "食費残高") {
    var request = require('request');
    var options = {
      'method': 'GET',
      'url': apiUrl,
      'headers': {
        'Accept': accept,
        'Content-Type': contentType,
        'x-access-token': accessToken
      }
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
      
      var preBalance = Number(JSON.parse(response.body).spAccountBalances[2].odBalance);
      var balance = preBalance.toLocaleString();
      
      // UTC時間にオフセットを追加して日本時間に変換
      const JAPAN_OFFSET = 9 * 60 * 60 * 1000;
      var now = new Date();
      var japanTime = new Date(now.getTime() + JAPAN_OFFSET);
    
      // 日本時間を 'yyyy.mm.dd hh:mm (JST)' の形式にフォーマットする
      var formattedDate = japanTime.getFullYear() + '.' + 
                          ('0' + (japanTime.getMonth() + 1)).slice(-2) + '.' + 
                          ('0' + japanTime.getDate()).slice(-2) + ' ' + 
                          ('0' + japanTime.getHours()).slice(-2) + ':' + 
                          ('0' + japanTime.getMinutes()).slice(-2);
      
      resMessage = {
        "type": "flex",
        "altText": "Account balance information",
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "食費残高",
                "weight": "bold",
                "color": "#1DB446",
                "size": "md"
              },
              {
                "type": "text",
                "text": `${balance}円`,
                "weight": "bold",
                "size": "xl",
                "color": "#000000",
                "margin": "md"
              },
              {
                "type": "separator",
                "margin": "xxl"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "xxl",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "text",
                        "text": "照会日時",
                        "size": "sm",
                        "color": "#555555"
                      },
                      {
                        "type": "text",
                        "text": formattedDate,
                        "size": "sm",
                        "color": "#111111",
                        "align": "end"
                      }
                    ]
                  }
                ]
              }
            ],
            "backgroundColor": "#FFFFFF",
            "paddingAll": "12px"
          },
          "styles": {
            "footer": {
              "separator": true
            }
          }
        }
      };
      return client.replyMessage(replyToken, resMessage);
    });
  }
  
  // ---------- 娯楽費 残高 ----------
  else if (reqMessage == "娯楽費残高") {
    var request = require('request');
    var options = {
      'method': 'GET',
      'url': apiUrl,
      'headers': {
        'Accept': accept,
        'Content-Type': contentType,
        'x-access-token': accessToken
      }
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
      
      var preBalance = Number(JSON.parse(response.body).spAccountBalances[3].odBalance);
      var balance = preBalance.toLocaleString();
      
      // UTC時間にオフセットを追加して日本時間に変換
      const JAPAN_OFFSET = 9 * 60 * 60 * 1000;
      var now = new Date();
      var japanTime = new Date(now.getTime() + JAPAN_OFFSET);
    
      // 日本時間を 'yyyy.mm.dd hh:mm (JST)' の形式にフォーマットする
      var formattedDate = japanTime.getFullYear() + '.' + 
                          ('0' + (japanTime.getMonth() + 1)).slice(-2) + '.' + 
                          ('0' + japanTime.getDate()).slice(-2) + ' ' + 
                          ('0' + japanTime.getHours()).slice(-2) + ':' + 
                          ('0' + japanTime.getMinutes()).slice(-2);
      
      resMessage = {
        "type": "flex",
        "altText": "Account balance information",
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "娯楽費残高",
                "weight": "bold",
                "color": "#1DB446",
                "size": "md"
              },
              {
                "type": "text",
                "text": `${balance}円`,
                "weight": "bold",
                "size": "xl",
                "color": "#000000",
                "margin": "md"
              },
              {
                "type": "separator",
                "margin": "xxl"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "xxl",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "text",
                        "text": "照会日時",
                        "size": "sm",
                        "color": "#555555"
                      },
                      {
                        "type": "text",
                        "text": formattedDate,
                        "size": "sm",
                        "color": "#111111",
                        "align": "end"
                      }
                    ]
                  }
                ]
              }
            ],
            "backgroundColor": "#FFFFFF",
            "paddingAll": "12px"
          },
          "styles": {
            "footer": {
              "separator": true
            }
          }
        }
      };
      return client.replyMessage(replyToken, resMessage);
    });
  }
  
  // ---------- 固定費 残高 ----------
  else if (reqMessage == "固定費残高") {
    var request = require('request');
    var options = {
      'method': 'GET',
      'url': apiUrl,
      'headers': {
        'Accept': accept,
        'Content-Type': contentType,
        'x-access-token': accessToken
      }
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
      
      var preBalance = Number(JSON.parse(response.body).spAccountBalances[1].odBalance);
      var balance = preBalance.toLocaleString();
      
      // UTC時間にオフセットを追加して日本時間に変換
      const JAPAN_OFFSET = 9 * 60 * 60 * 1000;
      var now = new Date();
      var japanTime = new Date(now.getTime() + JAPAN_OFFSET);
    
      // 日本時間を 'yyyy.mm.dd hh:mm (JST)' の形式にフォーマットする
      var formattedDate = japanTime.getFullYear() + '.' + 
                          ('0' + (japanTime.getMonth() + 1)).slice(-2) + '.' + 
                          ('0' + japanTime.getDate()).slice(-2) + ' ' + 
                          ('0' + japanTime.getHours()).slice(-2) + ':' + 
                          ('0' + japanTime.getMinutes()).slice(-2);
      
      resMessage = {
        "type": "flex",
        "altText": "Account balance information",
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "固定費残高",
                "weight": "bold",
                "color": "#1DB446",
                "size": "md"
              },
              {
                "type": "text",
                "text": `${balance}円`,
                "weight": "bold",
                "size": "xl",
                "color": "#000000",
                "margin": "md"
              },
              {
                "type": "separator",
                "margin": "xxl"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "xxl",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "text",
                        "text": "照会日時",
                        "size": "sm",
                        "color": "#555555"
                      },
                      {
                        "type": "text",
                        "text": formattedDate,
                        "size": "sm",
                        "color": "#111111",
                        "align": "end"
                      }
                    ]
                  }
                ]
              }
            ],
            "backgroundColor": "#FFFFFF",
            "paddingAll": "12px"
          },
          "styles": {
            "footer": {
              "separator": true
            }
          }
        }
      };
      return client.replyMessage(replyToken, resMessage);
    });
  }
  
  // ---------- 親口座（旅費） 残高 ----------
  else if (reqMessage == "旅費残高") {
    var request = require('request');
    var options = {
      'method': 'GET',
      'url': apiUrl,
      'headers': {
        'Accept': accept,
        'Content-Type': contentType,
        'x-access-token': accessToken
      }
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
      
      var preBalance = Number(JSON.parse(response.body).spAccountBalances[0].odBalance);
      var balance = preBalance.toLocaleString();
      
      // UTC時間にオフセットを追加して日本時間に変換
      const JAPAN_OFFSET = 9 * 60 * 60 * 1000;
      var now = new Date();
      var japanTime = new Date(now.getTime() + JAPAN_OFFSET);
    
      // 日本時間を 'yyyy.mm.dd hh:mm (JST)' の形式にフォーマットする
      var formattedDate = japanTime.getFullYear() + '.' + 
                          ('0' + (japanTime.getMonth() + 1)).slice(-2) + '.' + 
                          ('0' + japanTime.getDate()).slice(-2) + ' ' + 
                          ('0' + japanTime.getHours()).slice(-2) + ':' + 
                          ('0' + japanTime.getMinutes()).slice(-2);
      
      resMessage = {
        "type": "flex",
        "altText": "Account balance information",
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "旅費（親口座）残高",
                "weight": "bold",
                "color": "#1DB446",
                "size": "md"
              },
              {
                "type": "text",
                "text": `${balance}円`,
                "weight": "bold",
                "size": "xl",
                "color": "#000000",
                "margin": "md"
              },
              {
                "type": "separator",
                "margin": "xxl"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "xxl",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "text",
                        "text": "照会日時",
                        "size": "sm",
                        "color": "#555555"
                      },
                      {
                        "type": "text",
                        "text": formattedDate,
                        "size": "sm",
                        "color": "#111111",
                        "align": "end"
                      }
                    ]
                  }
                ]
              }
            ],
            "backgroundColor": "#FFFFFF",
            "paddingAll": "12px"
          },
          "styles": {
            "footer": {
              "separator": true
            }
          }
        }
      };
      return client.replyMessage(replyToken, resMessage);
    });
  }
  
  // ---------- 全体口座 振込（支払）----------
  else if (reqMessage == "振込") {
    var request = require('request');
    var options = {
      'method': 'POST',
      'url': apiUrl,
      'headers': {
        'Accept': accept,
        'Content-Type': contentType,
        'x-access-token': accessToken
      },
      body: JSON.stringify({
        "accountId": process.env.ACCOUNT_ID,
        "transferDesignatedDate": process.env.TRANSFER_DATE,
        "transferDateHolidayCode": process.env.HOLIDAY_CODE,
        "totalCount": "1",
        "totalAmount": process.env.TRANSFER_AMOUNT,
        "transfers": [
            {
                "itemId": "1",
                "transferAmount": process.env.TRANSFER_AMOUNT,
                "beneficiaryBankCode": process.env.BANK_CODE,
                "beneficiaryBranchCode": process.env.BRANCH_CODE,
                "accountTypeCode": "1",
                "accountNumber": process.env.ACCOUNT_NUMBER,
                "beneficiaryName": process.env.BENEFICIARY_NAME
            }
        ]
      })
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
      
      var applyNo = JSON.parse(response.body).applyNo;
      
      const loginPage = process.env.LOGIN_PAGE_URL;

      var resMessage = {
        "type": "flex",
        "altText": "Transfer information",
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "お振込み",
                "color": "#1DB446",
                "size": "md",
                "weight": "bold",
                "margin": "md"
              },
              {
                "type": "text",
                "text": "500円",
                "size": "xl",
                "weight": "bold",
                "color": "#000000",
                "margin": "lg"
              },
              {
                "type": "text",
                "text": "お振込みを受け付けました。",
                "size": "sm",
                "color": "#555555",
                "margin": "md"
              },
              {
                "type": "text",
                "text": `受付番号：${applyNo}`,
                "size": "sm",
                "color": "#555555",
                "margin": "xl"
              },
              {
                "type": "text",
                "text": "下記からお手続きください。",
                "size": "sm",
                "color": "#555555",
                "margin": "md"
              },
              {
                "type": "separator",
                "margin": "xxl"
              },
              {
                "type": "button",
                "action": {
                  "type": "uri",
                  "label": "ログイン",
                  "uri": loginPage
                },
                "height": "sm",
                "style": "link",
                "margin": "md"
              }
            ],
            "backgroundColor": "#FFFFFF",
            "paddingAll": "12px"
          }
        }
      };
  return client.replyMessage(replyToken, resMessage);
    });
  }
  
  // ---------- 為替レート計算 → 振込（支払）----------
  // 数値に変換
  else if (!Number.isNaN(parseInt(reqMessage))) {
    const number = parseInt(reqMessage);

    var request = require('request');
    var options = {
      'method': 'POST',
      'url': apiUrl,
      'headers': {
        'Accept': accept,
        'Content-Type': contentType,
        'x-access-token': accessToken
      },
      body: JSON.stringify({
        "accountId": process.env.ACCOUNT_ID_EXCHANGE,
        "transferDesignatedDate": process.env.TRANSFER_DATE_EXCHANGE,
        "transferDateHolidayCode": process.env.HOLIDAY_CODE_EXCHANGE,
        "totalCount": "1",
        "totalAmount": process.env.TRANSFER_AMOUNT_EXCHANGE,
        "transfers": [
        {
            "itemId": process.env.ITEM_ID_EXCHANGE,
            "transferAmount": process.env.TRANSFER_AMOUNT_EXCHANGE,
            "beneficiaryBankCode": process.env.BANK_CODE_EXCHANGE,
            "beneficiaryBranchCode": process.env.BRANCH_CODE_EXCHANGE,
            "accountTypeCode": process.env.ACCOUNT_TYPE_EXCHANGE,
            "accountNumber": process.env.ACCOUNT_NUMBER_EXCHANGE,
            "beneficiaryName": process.env.BENEFICIARY_NAME_EXCHANGE
            }
        ]
      })
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
      
      var applyNo = JSON.parse(response.body).applyNo;

      // 為替レートの計算 ドルの場合
      const exchangeRate = 151.6400;
      const jpYen = exchangeRate * number;
      const roundUp = Math.ceil(jpYen);
      const amount = roundUp.toLocaleString();

      const loginPage = process.env.LOGIN_PAGE_URL;

      var resMessage = {
        "type": "flex",
        "altText": "Transfer information",
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "為替レート計算",
                "color": "#1DB446",
                "size": "md",
                "weight": "bold",
                "margin": "md"
              },
              {
                "type": "text",
                "text": `${amount}円`,
                "size": "xl",
                "weight": "bold",
                "color": "#000000",
                "margin": "lg"
              },
              {
                "type": "text",
                "text": "日本円に換算しました。",
                "size": "sm",
                "color": "#555555",
                "margin": "md"
              },
              {
                "type": "text",
                "text": `受付番号：${applyNo}`,
                "size": "sm",
                "color": "#555555",
                "margin": "xl"
              },
              {
                "type": "text",
                "text": "お振込みは、下記からお手続きください。",
                "size": "sm",
                "color": "#555555",
                "margin": "md"
              },
              {
                "type": "separator",
                "margin": "xxl"
              },
              {
                "type": "button",
                "action": {
                  "type": "uri",
                  "label": "ログイン",
                  "uri": loginPage
                },
                "height": "sm",
                "style": "link",
                "margin": "md"
              }
            ],
            "backgroundColor": "#FFFFFF",
            "paddingAll": "12px"
          }
        }
      };
      return client.replyMessage(replyToken, resMessage);
    });
  }
  
  // ---------- 予算管理 残高 ----------
  else if (reqMessage == "予算管理") {
    var request = require('request');

    // 口座一覧照会
    var optionsAccounts = {
      'method': 'GET',
      'url': apiUrlOpt,
      'headers': {
        'Accept': accept,
        'Content-Type': contentType,
        'x-access-token': accessToken
      }
    };
    console.log("optionsAccounts：", optionsAccounts);

    request(optionsAccounts, function (errorAccounts, responseAccounts) {
      if (errorAccounts) throw new Error(errorAccounts);
      console.log("accounts response.bodyの値：", responseAccounts.body);
      
      // 日付
      var baseDate = JSON.parse(responseAccounts.body).baseDate;
      // 親口座名
      var parentAccount = JSON.parse(responseAccounts.body).spAccounts[0].spAccountName;
      // 固定費口座名
      var fixedAccount = JSON.parse(responseAccounts.body).spAccounts[1].spAccountName;
      // 食費口座名
      var foodAccount = JSON.parse(responseAccounts.body).spAccounts[2].spAccountName;
      // 娯楽費口座名
      var shoppingAccount = JSON.parse(responseAccounts.body).spAccounts[3].spAccountName;

      // 残高照会
      var optionsBalances = {
        'method': 'GET',
        'url': apiUrl,
        'headers': {
          'Accept': accept,
          'Content-Type': contentType,
          'x-access-token': accessToken
        }
      };

      request(optionsBalances, function (errorBalances, responseBalances) {
        if (errorBalances) throw new Error(errorBalances);
        console.log("balances response.bodyの値：", responseBalances.body);

        // 口座全体の残高
        var preBalance = Number(JSON.parse(responseBalances.body).balances[0].balance);
        var balance = preBalance.toLocaleString();
        
        // 親口座残高
        var preParentAccountBalance = Number(JSON.parse(responseBalances.body).spAccountBalances[0].odBalance);
        var parentAccountBalance = preParentAccountBalance.toLocaleString();
        // 固定費口座残高
        var preFixedAccountBalance = Number(JSON.parse(responseBalances.body).spAccountBalances[1].odBalance);
        var fixedAccountBalance = preFixedAccountBalance.toLocaleString();
        // 食費口座残高
        var preFoodAccountBalance = Number(JSON.parse(responseBalances.body).spAccountBalances[2].odBalance);
        var foodAccountBalance = preFoodAccountBalance.toLocaleString();
        // 娯楽費口座残高
        var preShoppingAccountBalance = Number(JSON.parse(responseBalances.body).spAccountBalances[3].odBalance);
        var shoppingAccountBalance = preShoppingAccountBalance.toLocaleString();
        
        // ユーザーへのレスポンス(resMessage)
        var resMessage = {
          "type": "flex",
          "altText": "Budget Management Information",
          "contents": {
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "予算管理",
                  "weight": "bold",
                  "color": "#1DB446",
                  "size": "md"
                },
                {
                  "type": "text",
                  "text": "残高合計",
                  "weight": "bold",
                  "size": "xl",
                  "color": "#000000",
                  "margin": "md"
                },
                {
                  "type": "text",
                  "text": `${balance}円`,
                  "weight": "bold",
                  "size": "xl",
                  "color": "#000000",
                  "align": "end"
                },
                {
                  "type": "separator",
                  "margin": "xxl"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "xxl",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "text",
                          "text": "使い分け口座残高",
                          "size": "md",
                          "weight": "bold"
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "text",
                          "text": parentAccount,
                          "size": "sm",
                          "color": "#555555"
                        },
                        {
                          "type": "text",
                          "text": `${parentAccountBalance}円`,
                          "size": "sm",
                          "color": "#111111",
                          "align": "end"
                        }
                      ],
                      "margin": "md"
                    },
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "text",
                          "text": fixedAccount,
                          "size": "sm",
                          "color": "#555555"
                        },
                        {
                          "type": "text",
                          "text": `${fixedAccountBalance}円`,
                          "size": "sm",
                          "color": "#111111",
                          "align": "end"
                        }
                      ],
                      "margin": "md"
                    },
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "text",
                          "text": foodAccount,
                          "size": "sm",
                          "color": "#555555"
                        },
                        {
                          "type": "text",
                          "text": `${foodAccountBalance}円`,
                          "size": "sm",
                          "color": "#111111",
                          "align": "end"
                        }
                      ],
                      "margin": "md"
                    },
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "contents": [
                        {
                          "type": "text",
                          "text": shoppingAccount,
                          "size": "sm",
                          "color": "#555555"
                        },
                        {
                          "type": "text",
                          "text": `${shoppingAccountBalance}円`,
                          "size": "sm",
                          "color": "#111111",
                          "align": "end"
                        }
                      ],
                      "margin": "md"
                    }
                  ]
                }
              ],
              "backgroundColor": "#FFFFFF",
              "paddingAll": "12px"
            }
          }
        };
        return client.replyMessage(replyToken, resMessage);
      });
    });
  }
  

  // その他のテキスト入力時のレスポンス
  else {
    return client.replyMessage(replyToken, {
      type: "text",
      text: "残高？振込？",
    });
  }
};
