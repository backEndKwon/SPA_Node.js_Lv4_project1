//연결고리
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    static associate(models) {
      //user와 1:N관계
      this.belongsTo(models.Users, {
        targetKey: "userId",
        foreignKey: "UserId",
        onDelete: 'CASCADE',
      });
      this.hasMany(models.Likes,{
        sourceKey : 'postId',
        foreignKey : 'PostId',
      });
      this.hasMany(models.Comments,{
        sourceKey : 'postId',
        foreignKey : 'PostId',
      });
    }
  }

  Posts.init(
    {
      postId: {
        allowNull: false, // NOT NULL
        autoIncrement: true, // AUTO_INCREMENT
        primaryKey: true, // Primary Key (기본키)
        type: DataTypes.INTEGER,
      },
      UserId: {
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
      },
      title: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      nickname: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      content: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Posts",
    }
  );
  return Posts;
};
