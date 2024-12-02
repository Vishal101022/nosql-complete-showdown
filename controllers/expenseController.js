const userModel = require("../models/userModel");
const downloadModel = require("../models/download");
const exModel = require("../models/expenseModel");
const s3Service = require("../services/S3Service");
const mongoose = require("mongoose");

// Create new expenses
exports.createExpense = async (req, res) => {
  const { amount, description, category } = req.body;
  const UserId = req.user;

  try {
    const user = await userModel.findById(UserId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedTotalExpense =
      parseFloat(user.totalExpense) + parseFloat(amount);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newExpense = new exModel({
        amount,
        description,
        category,
        user: UserId,
      });
      const expense = await newExpense.save({ session });

      user.totalExpense = updatedTotalExpense;
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.status(201).json(expense);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get all expenses
exports.getExpenses = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const UserId = req.user;

  try {
    const skip = (page - 1) * limit;

    const expenses = await exModel
      .find({ user: UserId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalExpenses = await exModel.countDocuments({ user: UserId });

    res.status(200).json({
      expenses,
      totalPages: Math.ceil(totalExpenses / limit),
      currentPage: parseInt(page),
      totalExpenses,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete  expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    
    const UserId = req.user;
    const expense = await exModel.findOne({ _id: id, user: UserId });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const user = await userModel.findById(UserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedTotalExpense =
      parseFloat(user.totalExpense) - parseFloat(expense.amount);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      user.totalExpense = updatedTotalExpense;
      await user.save({ session });

      await exModel.deleteOne({ _id: id, user: UserId }, { session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: "Expense deleted successfully" });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update expense and total expense from user table
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category } = req.body;

    const oldExpense = await exModel.findById(id);
    if (!oldExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (amount !== oldExpense.amount) {
      const user = await userModel.findById(req.user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedTotalExpense =
        parseFloat(user.totalExpense) - parseFloat(oldExpense.amount);
      const newTotalExpense =
        parseFloat(updatedTotalExpense) + parseFloat(amount);

      user.totalExpense = newTotalExpense;
      await user.save();
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedExpense = await exModel.findByIdAndUpdate(
        id,
        { amount, description, category },
        { new: true, session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(200).json(updatedExpense);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update total income
exports.updateTotalIncome = async (req, res) => {
  try {
    const { amount } = req.body;
    const UserId = req.user;

    const user = await userModel.findById(UserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalIncome = parseFloat(user.totalIncome) + parseFloat(amount);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      user.totalIncome = totalIncome;
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: "Total income updated successfully" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get total expense & income
exports.getTotals = async (req, res) => {
  try {
    const UserId = req.user;
    const user = await userModel.findById(UserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      totalExpense: user.totalExpense,
      totalIncome: user.totalIncome,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.postexpenseDownload = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    const UserId = req.user;

    const expenses = await exModel.find({ user: UserId }).session(session);
    const expenseData = JSON.stringify(expenses);

    const filename = `Expense${UserId}/${new Date().toISOString()}.txt`;
    const url = await s3Service.uploadFileToS3(expenseData, filename);

    const downloadRecord = new downloadModel({ url, user: UserId });
    await downloadRecord.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ url });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ error: error.message });
  }
};

exports.getexpenseDownload = async (req, res) => {
  const userId = req.user;
  try {
    const downloadRecords = await downloadModel.find({ user: userId });
    res.status(200).json(downloadRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
