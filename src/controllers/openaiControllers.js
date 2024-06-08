const getAllOpenai = async (_, res) => {
  res.send(`GET ALL`);
};

const getOneOpenai = async (req, res) => {
  res.send(`GET ${req.params.id}`);
};

const createOpenai = async (req, res) => {
  const { body } = req;

  if (!body.name) {
    res.status(400).send("Name is required");
  }
  res.status(201).send({
    status: "success",
    message: "Openai created",
  });
};

const updateOpenai = async (req, res) => {
  res.send(`PUT ${req.params.id}`);
};

const deleteOpenai = async (req, res) => {
  res.send(`DEL ${req.params.id}`);
};

export { getAllOpenai, getOneOpenai, createOpenai, updateOpenai, deleteOpenai };
