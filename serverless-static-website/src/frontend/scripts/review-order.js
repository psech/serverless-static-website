$("#buy-button").on("click", function() {
  const selected = [];
  $("input:checked").each(function() {
    selected.push({ name: $(this).val(), id: $(this).prop("id") });
  });

  const message = "<p>You have selected the following products to order:</p>";
  const selectedProductNames = selected
    .map(p => `<li class="list-group-item">${p.name}</li>`)
    .join("");
  $("#confirmationModal .modal-body")
    .empty()
    .append(
      message +
        '<ul class="list-group list-group-flush">' +
        selectedProductNames +
        "</ul>"
    );
  $("#confirmationModal").modal();
});
