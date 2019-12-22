$("#confirmPurchase").on("click", function() {
  const products = [];
  $("input:checked").each(function() {
    products.push({ productId: $(this).prop("id"), qty: 1 });
  });

  console.log(products);
  console.log(JSON.stringify(products));

  const apiKey = $("#api-key-input").val();

  if (!apiKey) {
    showProvideApiKey();
    return;
  }

  // const url =
  //   "https://9tdvys0rs0.execute-api.ap-southeast-2.amazonaws.com/dev/products/order";

  const url = "http://localhost:3000/products/order";

  $.ajax({
    method: "POST",
    url: url,
    headers: {
      "x-api-key": apiKey
    },
    data: JSON.stringify(products),
    beforeSend: () => showLoading()
  })
    .done(purchaseOnDone)
    .fail(error => purchaseOnFailure(error));
});

const purchaseOnDone = () => {
  accordion.empty();
  accordion.append(
    `<form action="index.html">
      <div class="form-group">
        <div class="alert alert-success" role="alert">Purchase completed.</div>
      </div>
      <button type="submit" class="btn btn-outline-success">Back</button>
    </form>`
  );
};

const purchaseOnFailure = error => {
  accordion.empty();
  console.log(error);
  accordion.append(
    `<div class="alert alert-danger" role="alert">Something went wrong.</div>`
  );
};
