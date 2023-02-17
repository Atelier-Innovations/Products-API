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

export const transformStylesRequest = (rows) => {
  const stylesAndPhotos = rows[0];
  const stylesAndSkus = rows[1];
  // console.log(stylesAndSkus[0])
  const styles = {
    "product_id": stylesAndSkus[0].product_id,
    "results": []
  };

  // console.log('stylesAndPhotos', stylesAndPhotos);
  for (let i = 0; i < stylesAndSkus.length; i++) {
    if (styles.results.filter(e => e.style_id === stylesAndSkus[i].styles_id).length > 0) {
      continue;
    } else {
      styles.results.push({
        "style_id": stylesAndSkus[i].styles_id,
        "name": stylesAndSkus[i].name,
        "original_price": stylesAndSkus[i].original_price,
        "sale_price": stylesAndSkus[i].sale_price,
        "default?": !!stylesAndSkus[i].default_style,
        "photos": [],
        "skus": {}
      })
    }
  }

  for (let i = 0; i < stylesAndSkus.length; i++) {
    for (let k = 0; k < styles.results.length; k++) {
      if (styles.results[k].style_id === stylesAndSkus[i].styles_id) {
        styles.results[k].skus[stylesAndSkus[i].id] = {
          "quantity": stylesAndSkus[i].quantity,
          "size": stylesAndSkus[i].size
        }
      }
    }
  }

  for (let i = 0; i < stylesAndPhotos.length; i++) {
    for (let k = 0; k < styles.results.length; k++) {
      if (styles.results[k].style_id === stylesAndPhotos[i].styles_id) {
        styles.results[k].photos.push({
          "thumbnail_url": stylesAndPhotos[i].thumbnail_url,
          "url": stylesAndPhotos[i].url
        })
      }
    }
  }


  // console.log('stylesAndSkus', styles);
  return styles;
}


export const transformRelated = (rows) => {
  const related = [];
  for (let i = 0; i < rows.length; i++) {
    related.push(rows[i].related_product_id)
  }
  return related;
}