//연결고리
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    
    static associate(models) {
      //post와 1:N관계
      this.hasMany(models.Posts, {
        targetKey: 'userId',
        foreignKey: 'UserId',
      });
      this.hasMany(models.Likes, {
        targetKey: 'userId',
        foreignKey: 'UserId',
      });
      this.hasMany(models.Comments, {
        targetKey: 'userId',
        foreignKey: 'UserId',
      });
    };
  };

  Users.init(
    {
      userId: {
        allowNull: false, // NOT NULL
        autoIncrement: true, // AUTO_INCREMENT
        primaryKey: true, // Primary Key (기본키)
        type: DataTypes.INTEGER,
      },
      nickname: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
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
      modelName: 'Users',
    }
  );
  return Users;
};