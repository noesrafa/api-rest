import User from "../models/user.model.js";

const updateUser = async (number, token, heruId) => {
  console.log("Actualizando usuario:", number, token, heruId);
  try {
    let user = await User.findOne({ email: number });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    user.token = token;
    user.heruId = heruId;

    await user.save();
    console.log("Usuario actualizado correctamente:", user);
    return user;
  } catch (err) {
    console.error("Error al actualizar usuario:", err.message);
    throw err;
  }
};

export { updateUser };
