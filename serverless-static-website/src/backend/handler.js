"use strict";

const { authorize } = require("./auth-manager");
const logger = require("./utils/logger");
const prism = require("./prismportal-manager");
const middy = require("middy");
const { cors } = require("middy/middlewares");

const getProducts = async event => {
  logger.log(">> handler.getProducts has been called");

  try {
    const authToken = await authorize();
    const availableProducts = await prism.getAvailableProducts(authToken);

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
    return { statusCode: 500, body: error };
  }
};

const getSubscriptions = async event => {
  logger.log(">> handler.getSubscriptions has been called");

  try {
    const authToken = await authorize();
    const subscriptions = await prism.getSubscriptions(authToken);
    const addonSubscriptions = [];
    const filteredSubscriptions = subscriptions.Subscriptions.filter(
      sub => sub.Status === "Active" && sub.Unit !== "Usage-based"
    ).map(sub => {
      const filteredSub = {
        FriendlyName: sub.FriendlyName,
        SubscriptionId: sub.SubscriptionId,
        Quantity: sub.Quantity,
        Unit: sub.Unit,
        UnitPrice: sub.UnitPrice
      };

      if (sub.AddonSubscriptions !== null) {
        const addSubs = sub.AddonSubscriptions.map(adSub => ({
          FriendlyName: sub.FriendlyName,
          AddonFriendlyName: adSub.FriendlyName,
          SubscriptionId: adSub.SubscriptionId,
          Quantity: adSub.Quantity,
          Unit: adSub.Unit,
          UnitPrice: adSub.UnitPrice
        }));

        addonSubscriptions.push(...addSubs);
      }

      return filteredSub;
    });

    const subsToReturn = [
      ...filteredSubscriptions,
      ...addonSubscriptions
    ].sort((a, b) => a.FriendlyName.localeCompare(b.FriendlyName));

    return {
      statusCode: 200,
      body: JSON.stringify(subsToReturn)
    };
  } catch (error) {
    logger.error(error);
    return { statusCode: 500, body: error };
  }
};

const makeOrder = async event => {
  logger.log(">> handler.makeOrder has been called");

  const products = JSON.parse(event.body);
  const order = products.map(p => ({
    productId: p.id,
    qty: p.qty
  }));

  try {
    const authToken = await authorize();
    const response = await prism.makeOrder(authToken, order);

    return {
      statusCode: response.status
    };
  } catch (error) {
    logger.error(error);
    return { statusCode: 500, body: error };
  }
};

const updateSubscription = async event => {
  logger.log(">> handler.updateSubscription has been called");

  try {
    const data = JSON.parse(event.body);

    if (!data.subscriptionId || !data.newQuantity) {
      throw new Error("Mandatory parameter missing");
    }

    const authToken = await authorize();
    const response = await prism.updateSubscription(authToken, data);

    return {
      statusCode: response.status
    };
  } catch (error) {
    logger.error(error);
    return { statusCode: 500, body: error };
  }
};

module.exports = {
  getProductsHandler: middy(getProducts).use(cors()),
  getSubscriptionsHandler: middy(getSubscriptions).use(cors()),
  makeOrderHandler: middy(makeOrder).use(cors()),
  updateSubscriptionHandler: middy(updateSubscription).use(cors())
};
