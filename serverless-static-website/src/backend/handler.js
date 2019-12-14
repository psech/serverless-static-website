"use strict";

const { authorize } = require("./auth-manager");
const logger = require("./utils/logger");
const prismportal = require("./prismportal-manager");
const middy = require("middy");
const { cors } = require("middy/middlewares");

const getProducts = async event => {
  logger.log(">> handler.getProducts has been called");

  try {
    const authToken = await authorize();
    const availableProducts = await prismportal.getAvailableProducts(authToken);

    // TODO: Consider filtering response to return limited json object 
    // as full API response is not needed and may reveal some sensitive information.

    return {
      statusCode: 200,
      // headers: {
      //   "Access-Control-Allow-Origin": "*",
      //   "Access-Control-Allow-Credentials": true
      // },
      body: JSON.stringify(availableProducts)
    };
  } catch (error) {
    logger.error(error);
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};

const getProductsHandler = middy(getProducts).use(cors());

module.exports = { getProductsHandler };
