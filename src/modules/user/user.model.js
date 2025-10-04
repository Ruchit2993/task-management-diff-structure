import { sequelize } from "../../config/dbConnect.js";
import { DataTypes, Model } from "sequelize";
import TeamMember from "../team-member/team-member.model.js";
import Task from "../task/task.model.js";
import Comment from "../comments/comments.model.js";

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
    isFirstLogin: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
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
    modelName: "User",
    tableName: "users",
    timestamps: true,
    underscored: true,
    paranoid: false,
    indexes: [
      { unique: true, fields: ["email"] },
      { unique: true, fields: ["contact"] },
    ],
  }
);

// Associations0
User.hasMany(TeamMember, { foreignKey: "userId" });
TeamMember.belongsTo(User, { foreignKey: "userId" });
TeamMember.belongsTo(Task, { foreignKey: "taskId" });

User.hasMany(Task, { foreignKey: "createdBy", as: "createdTasks" });
User.hasMany(Task, { foreignKey: "updatedBy", as: "updatedTasks" });
User.hasMany(Task, { foreignKey: "deletedBy", as: "deletedTasks" });

Task.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
Task.belongsTo(User, { foreignKey: "updatedBy", as: "updater" });
Task.belongsTo(User, { foreignKey: "deletedBy", as: "deleter" });

User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });

export default User;
