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

module.exports = {
  getAvailableProducts
};
