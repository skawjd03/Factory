module.exports = (sequelize, DataTypes) => (
    sequelize.define('comment', {
        comment: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        thumbs: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        maker: {
            type: DataTypes.STRING(15),
            allowNull: true,
            defaultValue: 0,
        },
        pid:{
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        }
    }, {
            timestamps: true,
            paranoid: true,
        })
);

