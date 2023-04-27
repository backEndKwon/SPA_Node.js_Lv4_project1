//연결고리
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        targetKey: "userId",
        foreignKey: "UserId",
        onDelete: "CASCADE",
      });
      this.belongsTo(models.Posts, {
        targetKey: "postId",
        foreignKey: "PostId",
        onDelete: "CASCADE",
      });
    }
  }

  Likes.init(
    {
      likeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      PostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Likes",
    }
  );
  return Likes;
};
