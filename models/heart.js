module.exports = (sequelize, DataTypes) => (
    sequelize.define('heart', {
        human: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
        postnum: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
    }, {
            timestamps: true,
            paranoid: true,
        })
);