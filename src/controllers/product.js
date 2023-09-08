const { product, user, category, productCategory } = require("../../models");

// ============== GET PRODUCTS ===============
exports.getProduct = async (req, res) => {
  try {
    let data = await product.findAll({
      include: [
        {
          model: user,
          as: "seller",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            modul: productCategory,
            as: "bridge",
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["idUser", "createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    // Map
    data = data.map((item) => {
      return {
        ...item,
        image: process.env.FILE_PATH + item.image,
      };
    });

    res.status(200).send({
      status: "Success",
      message: "Get data all product success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Get data Failed",
      message: "Server Error",
    });
  }
};

// ============== ADD PRODUCTS ===============
exports.addProduct = async (req, res) => {
  try {
    let { categoryId } = req.body;

    if (categoryId) {
      categoryId = categoryId.split(',');
    }

    const data = {
      name: req.body.name,
      desc: req.body.desc,
      price: req.body.price,
      image: req.file.filename,
      qty: req.body.qty,
      idUser: req.user.id,
    };

    let newProduct = await product.create(data);

    if (categoryId) {
      const productCategoryData = categoryId.map((item) => {
        return { idProduct: newProduct.id, idCategory: parseInt(item) };
      });

      await productCategory.bulkCreate(productCategoryData);
    }

    let products = await product.findOne({
      where: {
        id: newProduct.id,
      },
      include: [
        {
          model: user,
          as: "seller",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            model: productCategory,
            as: "bridge",
          },
          attributes: {
            exclude: ["idUser", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["idUser", "createdAt", "updatedAt"],
      },
    });

    products = JSON.parse(JSON.stringify(products));

    res.status(200).send({
      status: "Success",
      message: "Add Product Success",
      data: {
        ...products,
        image: process.env.FILE_PATH + products.image,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Add Product Failed",
      message: "Server Error",
    });
  }
};

// ============ GET DETAIL PRODUCT ========
exports.getDetailProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let data = await product.findOne({
      where: { id },
      include: [
        {
          model: user,
          as: "seller",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            model: productCategory,
            as: "bridge",
          },
          attributes: {
            exclude: ["idUser", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["idUser", "createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      image: process.env.FILE_PATH + data.image,
    };

    res.status(200).send({
      status: "Success",
      message: `Get detail product: ${id} success`,
      data
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Get detail data failed",
      message: "Server Error",
    });
  }
};

// ============ UPDATED PRODUCT ========
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const data = req.body;
    console.log(data);
    let updateProduct = await product.update(
      {
        ...data,
        image: req.file.filename,
        idUser: req.user.id,
      },
      { where: { id } }
    );

    updateProduct = JSON.parse(JSON.stringify(data));

    updateProduct = {
      ...updateProduct,
      image: process.env.FILE_PATH + req.file.filename,
    };

    res.status(200).send({
      status: "Success",
      message: `Update product at id: ${id} success`,
      data: {
        products: updateProduct,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Updated product failed",
      message: "Server Error",
    });
  }
};

// ============ DELETE PRODUCT ===========
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const products = await product.destroy({
      where: { id },
    });

    res.status(200).send({
      status: "Success",
      message: `Delete product: ${id} success`,
      data: {
        products: {
          id: { id },
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Delete product failed",
      message: "Server Error",
    });
  }
};