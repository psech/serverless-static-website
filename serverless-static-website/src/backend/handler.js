"use strict";

const { authorize } = require("./auth-manager");
const logger = require("./utils/logger");
const prismportal = require("./prismportal-manager");

module.exports.getProducts = async event => {
  logger.log(">> handler.getProducts has been called");

  try {
    const authToken = await authorize();
    const availableProducts = await prismportal.getAvailableProducts(authToken);
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(availableProducts)
    };
  } catch (error) {
    logger.error(error);
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};
