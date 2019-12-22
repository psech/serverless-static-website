"use strict";

const logger = require("./utils/logger");
const { getEnv } = require("./utils/env");
const axios = require("axios");

const tenantId = getEnv("ZIPMONEY_TENANT_ID");

const getAvailableProducts = async token => {
  logger.log(">> prismportal-manager.getAvailableProducts has been called");

  const requestOptions = {
    method: "GET",
    url: `https://api.prismportal.online/api/v2/microsoftcsp/tenants/${tenantId}/products/available`,
    headers: {
      authorization: `${token.token_type} ${token.access_token}`,
      "content-type": "application/json",
      "cache-control": "no-cache"
    },
    json: true
  };

  const response = await axios.request(requestOptions);
  return response.data;
};

const makeOrder = async (token, products) => {
  logger.log(">> prismportal-manager.getAvailableProducts has been called");

  const requestOptions = {
    method: "POST",
    url: "https://api.prismportal.online/api/v2/microsoftcsp/orders",
    headers: {
      authorization: `${token.token_type} ${token.access_token}`,
      "content-type": "application/json",
      "cache-control": "no-cache"
    },
    data: {
      tenantId: tenantId,
      orderBillingCycle: "Monthly",
      products: products
    }
  };

  // const response = await axios.request(requestOptions);
  const response = await Promise.resolve();

  console.log(require("util").inspect(response, false, null));

  return response;
};

module.exports = {
  getAvailableProducts,
  makeOrder
};
