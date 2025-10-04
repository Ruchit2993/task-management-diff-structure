import { sequelize } from "../../config/dbConnect.js";
import { DataTypes, Model } from "sequelize";
// import Task from "./task-model.js";

class StatusMaster extends Model {}

StatusMaster.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "TO_DO",
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "To Do",
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
    },
    deleted: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deletedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "StatusMaster",
    tableName: "status_master",
    timestamps: true,
    underscored: true,
    paranoid: false,
      indexes: [
    { unique: true, fields: ["code"] }
      ]
  }
);

export default StatusMaster;