module.exports = (sequelize, DataTypes) => (
    sequelize.define('post', {
        text: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        img: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        thumbs: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            defaultValue: 0,
        },
        maker: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
    }, {
            timestamps: true,
            paranoid: true,
        })
);