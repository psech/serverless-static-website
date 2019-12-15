const accordionId = "productsAccordion";
const accordion = $(`#${accordionId}`);

const url =
  "https://9tdvys0rs0.execute-api.ap-southeast-2.amazonaws.com/dev/products/available";

$("#api-key-form").submit(() => {
  const apiKey = $("#api-key-input").val();

  if (!apiKey) {
    showProvideApiKey();
    return;
  }

  $.ajax({
    method: "GET",
    url: url,
    headers: {
      "x-api-key": apiKey
    },
    beforeSend: () => showLoading()
  })
    .done(data => onDone(data))
    .fail(error => onFailure(error));
});

const showLoading = () => {
  accordion.empty();
  accordion.append(
    `<div class="spinner-grow m-5" style="width: 3rem; height: 3rem;" role="status">
      <span class="sr-only">Loading...</span>
    </div>`
  );
};

const showProvideApiKey = () => {
  accordion.empty();
  accordion.append(
    `<div class="alert alert-info" role="alert">Please provide API Key.</div>`
  );
};

const onDone = data => {
  accordion.empty();
  const productGroups = data.ProductGroups;

  $.each(productGroups, index => {
    accordion.append(genSingleCard(productGroups[index], index));
  });
};

const onFailure = error => {
  accordion.empty();
  console.log(error);
  accordion.append(
    `<div class="alert alert-danger" role="alert">Something went wrong.</div>`
  );
};

const genSingleCard = (productGroup, index) => {
  const cardId = productGroup.GroupName;
  const products = productGroup.Products;

  return `<div class="card">
    <div class="card-header" id="${cardId}">
      <h2 class="mb-0">
        <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse-${index}" aria-expanded="false" aria-controls="collapse-${index}">
          ${cardId}
        </button>
      </h2>
    </div>
    <div id="collapse-${index}" class="collapse" aria-labelledby="${cardId}" data-parent="#${accordionId}">
      <div class="card-body">
        ${genCardContent(products)}
      </div>
    </div>
  </div>`;
};

const genCardContent = products => {
  const genProducts = products => {
    return products.reduce((acc, product) => {
      return acc.concat(genSingleProduct(product));
    }, "");
  };

  const listGroupMarkup = `<ul class="custom-control custom-checkbox" id="product-list">
      ${genProducts(products)}
    </ul>`;

  return listGroupMarkup;
};

const genSingleProduct = product => {
  return `<div class="input-group mb-3">
      <div class="input-group-prepend">
        <div class="input-group-text">
          <input type="checkbox" id="${product.ProductId}" value="${product.ProductName}">
        </div>
      </div>
      <input type="text" disabled class="form-control" value="${product.ProductName}">
    </div>`;
};

showProvideApiKey();
