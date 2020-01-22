"use strict";

const logger = require("./utils/logger");
const { getEnv } = require("./utils/env");
const axios = require("axios");

const tenantId = getEnv("ZIPMONEY_TENANT_ID");
const prismUrl = "https://api.prismportal.online/api/v2/microsoftcsp";

const getAvailableProducts = async token => {
  logger.log(">> prismportal-manager.getAvailableProducts has been called");

  const requestOptions = {
    method: "GET",
    url: `${prismUrl}/tenants/${tenantId}/products/available`,
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

const getSubscriptions = async token => {
  logger.log(">> prismportal-manager.getSubscriptions has been called");

  const requestOptions = {
    method: "GET",
    url: `${prismUrl}/tenants/${tenantId}`,
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
  logger.log(">> prismportal-manager.makeOrder has been called");

  const requestOptions = {
    method: "POST",
    url: `${prismUrl}/orders`,
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

  return await axios.request(requestOptions);
};

const updateSubscription = async (token, data) => {
  logger.log(">> prismportal-manager.updateSubscription has been called");

  const requestOptions = {
    method: "POST",
    url: `${prismUrl}/subscriptions/${data.subscriptionId}/quantity/${data.newQuantity}`,
    headers: {
      authorization: `${token.token_type} ${token.access_token}`,
      "content-type": "application/json",
      "cache-control": "no-cache"
    }
  };

  logger.log("requestOptions", requestOptions);

  return await axios.request(requestOptions);
};

module.exports = {
  getAvailableProducts,
  getSubscriptions,
  makeOrder,
  updateSubscription
};
