export const transformProductRequest = (rows) => {
  const product = rows[0]
  const features = [];

  for (let i = 0; i < rows.length; i++) {
    features.push({"feature": rows[i].feature, "value": rows[i].value})
  }
  product.feature = features;
  delete product.value;
  return product;
}