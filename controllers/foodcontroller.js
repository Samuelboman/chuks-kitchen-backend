import Food from "../models/Food.js";

export const addFood = async (req, res) => {
  try {
    const { name, price } = req.body;

    const food = await Food.create({
      name,
      price,
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

