$("#confirmPurchase").on("click", function() {
  const selected = [];
  $("input:checked").each(function() {
    selected.push({ name: $(this).val(), id: $(this).prop("id") });
  });
  console.log(selected);
});
