//연결고리
"use strict";
const Sequelize = require('sequelize');

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
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

  Comments.init(
    {
      commentId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      PostId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      comment: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      nickname: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    },
    {
      sequelize,
      modelName: "Comments",
    }
  );
  return Comments;
};
