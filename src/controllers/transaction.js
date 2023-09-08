const { transaction, product, user, profile } = require("../../models");



exports.getTransactions = async (req, res) => {
  try {
    let data = await transaction.findAll({
      attributes: {
        exclude: ["idProduct", "idBuyer", "idSeller", "updatedAt"],
      },
      include: [
        {
          model: product,
          as: "product",
          attributes: {
            exclude: ["desc", "qty", "idUser", "createdAt", "updatedAt"],
          },
        },
        {
          model: user,
          as: "buyer",
          attributes: {
            exclude: ["password", "idUser", "createdAt", "updatedAt"],
          },
        },
        {
          model: user,
          as: "seller",
          attributes: {
            exclude: ["password", "idUser", "createdAt", "updatedAt"],
          },
        },
      ],
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return {
        ...item,
        product: {
          ...item.product,
          image: process.env.FILE_PATH + item.product.image,
        },
      };
    });

    res.status(200).send({
      status: "Get data Transaction Success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Get data Transactions Failed",
      message: "Server Error",
    });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const idBuyer = req.user.id;
    let data = await transaction.findAll({
      where: {
        idBuyer, //? untuk apa?
      },
      order: [["createdAt", "DESC"]], //? untuk apa?
      attributes: {
        exclude: ["idProduct", "idBuyer", "idSeller", "updatedAt"],
      },
      include: [
        {
          model: product,
          as: "product",
          attributes: {
            exclude: ["desc", "qty", "idUser", "createdAt", "updatedAt"],
          },
        },
        {
          model: user,
          as: "buyer",
          attributes: {
            exclude: ["password", "idUser", "createdAt", "updatedAt"],
          },
        },
        {
          model: user,
          as: "seller",
          attributes: {
            exclude: ["password", "idUser", "createdAt", "updatedAt"],
          },
        },
      ],
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return {
        ...item,
        product: {
          ...item.product,
          image: process.env.FILE_PATH + item.product.image,
        },
      };
    });

    res.status(200).send({
      status: "Get data Transaction Success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Get data Transactions Failed",
      message: "Server Error",
    });
  }
};

// =========== BUY PRODUCT =============
exports.addTransaction = async (req, res) => {
  try {
    // Prepare transaction data from body here ...
    let data = req.body;
    data = {
      id: parseInt(data.idProduct + Math.random().toString().slice(3, 8)),
      ...data,
      idBuyer: req.user.id,
      status: "pending",
    };
    // Insert transaction data here ...
    const newData = await transaction.create(data);

    // Get buyer data here ...
    const buyerData = await user.findOne({
      include: {
        model: profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt", "idUser"],
        },
      },
      where: {
        id: newData.idBuyer,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });


   
    // create transaction
    const payment = await snap.createTransaction(parameter);
    console.log(payment);

    res.send({
      status: "Pending",
      message: "Pending transaction payment gateway",
      payment,
      product: {
        id: data.idProduct,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Buy Products Failed",
      message: "Server Error",
    });
  }
};





// Create function for handle transaction update status
const updateTransaction = async (status, transactionId) => {
  await transaction.update(
    {
      status,
    },
    {
      where: {
        id: transactionId,
      },
    }
  );
};

// Create function for handle product update stock/qty
const updateProduct = async (orderId) => {
  const transactionData = await transaction.findOne({
    where: {
      id: orderId,
    },
  });
  const productData = await product.findOne({
    where: {
      id: transactionData?.idProduct,
    },
  });
  const qty = productData.qty - 1;
  await product.update({ qty }, { where: { id: productData.id } });
};

