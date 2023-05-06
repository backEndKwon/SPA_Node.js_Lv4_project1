/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Comments', {
            commentId: {
                allowNull: false, 
                autoIncrement: true, 
                primaryKey: true, 
                type: Sequelize.INTEGER
            },
            PostId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Posts',
                    key: 'postId', 
                },
                onDelete: 'CASCADE',
            },
            UserId: { 
                allowNull: false, 
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'userId', 
                },
                onDelete: 'CASCADE', 
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
                defaultValue: Sequelize.fn("now")
            },
            updatedAt: {
                allowNull: false, 
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn("now")
            },
            likes: {
              type: Sequelize.INTEGER,
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Comments');
    }
};