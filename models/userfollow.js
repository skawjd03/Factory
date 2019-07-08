module.exports = (sequelize, DataTypes) => (
    sequelize.define('userfollow', {
        nick: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
        follownick: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
    }, {
            timestamps: true,
            paranoid: true,
        })
);